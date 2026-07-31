import { 
  Grid, 
  Card, 
  CardActionArea,
  CardMedia,
  CardContent,
  Typography, 
  Link 
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useAuth } from 'src/hooks/use-auth';

export const MaterialTable = (props) => {
  const user = useAuth().user;
  const { data } = props;

  const sortedData = data ? [...data].sort((a, b) => {
    return a.material_title.localeCompare(b.material_title);
  }) : [];

  return (
    <Grid container spacing={3}>
      {sortedData && sortedData.map((material) => {
        let images = [];
        try {
          images = JSON.parse(material.images);
        } catch (e) {
          console.error("Error parsing images for material:", material.material_id);
        }
        
        const image_path = images && images.length > 0 
          ? `${process.env.NEXT_PUBLIC_ASSETS}/${images[0]}` 
          : ''; 

        return (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={material.material_id}
          >
            <Card 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid',       // Adds a 1px solid border
                borderColor: 'grey.300',   // Uses a subtle light-grey color from MUI's palette
                boxShadow: 3, 
                transition: 'box-shadow 0.3s ease-in-out', 
                '&:hover': {
                  boxShadow: 6, 
                }
              }}
            >
              <Link
                underline="none"
                color="inherit"
                href={`/matostheque/details/material-detail/${material.material_id}`}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', flexGrow: 1 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={image_path}
                    alt={material.material_title}
                    sx={{ backgroundColor: 'background.default' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="div"
                      sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                      {material.material_title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // Limits description to 2 lines
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {material.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

MaterialTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  data: PropTypes.array
};