import { Stack, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Link } from '@mui/material';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { statusMap, loanStatus } from 'src/data/static_data'


export const MaterialTable = (props) => {
  const user = useAuth().user;
  const { data } = props;

  const sortedData = data ? [...data].sort((a, b) => {
    return a.material_title.localeCompare(b.material_title);
  }) : [];

  return (<>
    <Grid xs={6} gap={1} container alignItems="center">
      <Typography variant="h6" align="center">List Of Materials</Typography>
    </Grid>
    <List sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, // One column for xs and sm, two columns for md, and three columns for lg and above
      gap: '16px'
    }}>
      {sortedData && sortedData.map((material, index) => {
        const hasDivider = index < sortedData.length - 1;
        const images = JSON.parse(material.images);
        const image_path = images ? `${process.env.NEXT_PUBLIC_ASSETS}/${images[0]}` : '';

        return (

          <Link
            key={material.material_id}
            underline="none"
            color="inherit"
            href={`/matostheque/details/material-detail/${material.material_id}`}
            style={{ display: 'contents' }}
          >
            <ListItem divider={hasDivider} key={material.material_id}>
              <ListItemAvatar>
                <Avatar
                  src={image_path}
                  alt="Material"
                  sx={{
                    height: 150,
                    width: 200,
                    borderRadius: 1
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={material.material_title}
                primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                secondary={material.description}
                secondaryTypographyProps={{ variant: 'body2' }}
                sx={{ ml: 2 }}
              />
            </ListItem>
          </Link>
        );
      })}
    </List>
  </>);
};

MaterialTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
