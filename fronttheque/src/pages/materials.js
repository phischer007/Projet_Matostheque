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
import { MaterialCategory } from 'src/sections/materials/materialcategory';


const useMaterials = (materials, page, cardPerPage) => {
  return useMemo(() => {
    const startIndex = page * cardPerPage;
    const endIndex = startIndex + cardPerPage;
    return materials?.slice(startIndex, endIndex);
  }, [materials, page, cardPerPage]);
};

const deepSearch = (obj, searchTerm) => {
  const searchableFields = ['material_title', 'user_first_name', 'user_last_name', 'material_id', 'description'];
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const materialCategoryRef = useRef(null);

  // 1. Fetch and SORT data immediately
  useEffect(() => {
    fetch(`${config.apiUrl}/materials/`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        // Sort alphabetically by title
        const sortedData = (data || []).sort((a, b) => {
          const titleA = a.material_title?.toLowerCase() || '';
          const titleB = b.material_title?.toLowerCase() || '';
          return titleA.localeCompare(titleB);
        });

        setMaterialList(sortedData);
        setFilteredMaterials(sortedData)
        
        if (sortedData && user.is_staff) {
          setQrCodeDataArray(sortedData.map(material => ({
            qrCodeData: material.qrcode,
            material_id: material.material_id,
            material_title: material.material_title
          })));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [user.is_staff]);


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



  const handleInternalReset = () => {
    // 1. Reset local state
    setSelectedCategory(null);

    // 2. Reset Page
    setPage(0);

  };

  const handleTagClick = (categoryValue) => {
    // Toggle off if clicking the already selected tag
    if (selectedCategory === categoryValue) {
      handleInternalReset();
      return;
    }
    setSelectedCategory(categoryValue);

    // Reset Page
    setPage(0);
  };

  useEffect(() => {
    if (selectedCategory) {
      let filtered = materialList.filter(
        material => material.sub_type === selectedCategory
      );
      filtered = searchTerm
        ? filtered?.filter(material => deepSearch(material, searchTerm))
        : filtered;
      setFilteredMaterials(filtered);
    }
    else {
      let filtered = searchTerm
        ? materialList?.filter(material => deepSearch(material, searchTerm))
        : materialList;
      setFilteredMaterials(filtered);
    }
  }, [selectedCategory, materialList]);

  useEffect(() =>{
    let filtered = searchTerm
      ? materialList?.filter(material => deepSearch(material, searchTerm))
      : materialList;
    if (selectedCategory) {
      filtered = filtered.filter(
        material => material.sub_type === selectedCategory
      );
    }
    setFilteredMaterials(filtered);
  },[materialList,searchTerm])

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
                  </Stack>
                )}
              </Stack>
              <div>
                <Button
                  // sx={{ backgroundColor: '#162A42' }}
                  startIcon={
                    <SvgIcon 
                      fontSize="small"
                    >
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
              handleInternalReset = {handleInternalReset}
              handleTagClick = {handleTagClick}
              selectedCategory = {selectedCategory}
              setSelectedCategory = {setSelectedCategory}
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