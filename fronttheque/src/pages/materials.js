import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { 
  Box, 
  Button, 
  Container, 
  Pagination, 
  Stack, 
  SvgIcon, 
  Typography, 
  Unstable_Grid2 as Grid 
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MaterialsCard } from 'src/sections/materials/materialcard';
import { MaterialsSearch } from 'src/sections/materials/materialsearch';
import config from '../utils/config';
import NextLink from 'next/link';
import { useAuth } from 'src/hooks/use-auth';
import { MaterialQRCodeDoc } from 'src/documents/material-qrcode-document';
import { MaterialListDoc } from 'src/documents/material-export-document';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MaterialCategory } from '/src/sections/materials/materialcategory'; 


const useMaterials = (materials, page, cardPerPage) => {
  return useMemo(() => {
    const startIndex = page * cardPerPage;
    const endIndex = startIndex + cardPerPage;
    return materials?.slice(startIndex, endIndex);
  }, [materials, page, cardPerPage]);
};

const deepSearch = (obj, searchTerm) => {
  const searchableFields = ['material_title', 'owner_first_name', 'owner_last_name', 'material_id', 'team', 'description'];
  let normalizedSearchTerm = searchTerm;
  if (!isNaN(searchTerm)) {
    normalizedSearchTerm = searchTerm.toString().padStart(3, '0');
  }
  for (const key in obj) {
    if (searchableFields.includes(key)) {
      if ((typeof obj[key] === 'string' && obj[key].toLowerCase().includes(normalizedSearchTerm.toLowerCase())) ||
        (key === 'material_id' && String(obj[key]).padStart(3, '0') === normalizedSearchTerm)) {
        return true;
      }
    } else if (typeof obj[key] === 'object' && deepSearch(obj[key], normalizedSearchTerm)) {
      return true;
    }
  }
  return false;
};

const Page = () => {
  const auth = useAuth();
  const user = auth.user;
  const [materialList, setMaterialList] = useState(null);
  const [filteredMaterials, setFilteredMaterials] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [cardPerPage, setRowsPerPage] = useState(16);
  const [qrCodeDataArray, setQrCodeDataArray] = useState(null);

  const materialCategoryRef = useRef(null);

  // 1. Fetch and SORT data immediately
  useEffect(() => {
    fetch(`${config.apiUrl}/materials/`)
      .then(response => response.json())
      .then(data => {
        // Sort alphabetically by title
        const sortedData = (data || []).sort((a, b) => {
          const titleA = a.material_title?.toLowerCase() || '';
          const titleB = b.material_title?.toLowerCase() || '';
          return titleA.localeCompare(titleB);
        });

        setMaterialList(sortedData);
        
        if (sortedData && user.is_staff) {
          setQrCodeDataArray(sortedData.map(material => ({
            qrCodeData: material.qrcode,
            material_id: material.material_id,
            material_title: material.material_title
          })));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // 2. Filter Effect (Preserves Order)
  useEffect(() => {
    // Since materialList is sorted, the filtered result will effectively remain sorted
    let filtered = searchTerm 
      ? materialList?.filter(material => deepSearch(material, searchTerm))
      : materialList;

    setFilteredMaterials(filtered);
  }, [searchTerm, materialList, cardPerPage]); 

  const count = Math.ceil((filteredMaterials?.length || 0) / cardPerPage);
  const materials = useMaterials(filteredMaterials, page, cardPerPage);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleRowsPerPageChange = (event) => {
    setCardPerPage(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCategoryChange = useCallback(() => {
    setPage(0);
  }, []);

  const handleCategoryReset = useCallback(() => {
    setSearchTerm('');
    setPage(0);
  }, []);


  return (
    <>
      <Head>
        <title>Materials</title>
      </Head>
      <Box component="main" 
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            
            <Stack direction="row" 
              justifyContent="space-between" 
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography 
                  variant="h4"
                >
                  Materials
                </Typography>
                {user.is_staff && (
                  <Stack alignItems="center" 
                    direction="row" 
                    spacing={1}
                  >
                    <PDFDownloadLink
                      document={<MaterialListDoc materials={materialList ? materialList : []} />}
                      fileName={"Matostheque Material List"}
                    >
                      {({ blob, url, loading, error }) => (
                        <Button color="primary" 
                          startIcon={
                            <SvgIcon fontSize="small">
                              <ArrowDownOnSquareIcon />
                            </SvgIcon>
                          } 
                          style={{ width: '150px' }}
                        >
                          Export list
                        </Button>
                      )}
                    </PDFDownloadLink>
                    <PDFDownloadLink
                      document={<MaterialQRCodeDoc documentData={qrCodeDataArray ? qrCodeDataArray : []} />}
                      fileName={"Matostheqye QRCode list"}
                    >
                      {({ blob, url, loading, error }) => (
                        <Button color="primary" 
                          startIcon={
                            <SvgIcon fontSize="small">
                              <ArrowDownOnSquareIcon />
                            </SvgIcon>
                          } 
                          style={{ width: '200px' }}
                        >
                          Export qrcodes
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </Stack>
                )}
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  component={NextLink}
                  href="/create/create-material"
                >
                  Add
                </Button>
              </div>
            </Stack>

            <MaterialsSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />

            <MaterialCategory 
              ref={materialCategoryRef}
              materials={materialList || []}
              setFilteredMaterials={setFilteredMaterials}
              onCategoryChange={handleCategoryChange}
              onReset={handleCategoryReset} 
            />
            
            <Grid container 
              spacing={3}
            >
              {materials && materials.map((material) => (
                <Grid xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={material.id}
                >
                  <MaterialsCard material={material} />
                </Grid>
              ))}
            </Grid>

            {filteredMaterials && filteredMaterials.length > cardPerPage && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3 
                }}
              >
                <Pagination
                  count={count}
                  size="small"
                  page={page + 1}
                  onChange={handlePageChange}
                  rowsPerPage={cardPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[6, 12, 24]}
                  sx={{
                    '& .Mui-selected': {
                      color: 'primary',
                    },
                  }}
                />
              </Box>
            )}

          </Stack>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;