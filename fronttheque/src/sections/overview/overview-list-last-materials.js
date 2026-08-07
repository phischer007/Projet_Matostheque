import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import { 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardHeader, 
  Divider, 
  IconButton, 
  Link,
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  SvgIcon, 
  Typography, 
  Menu, 
  MenuItem 
} from '@mui/material';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';



export const OverviewLatestMaterials = (props) => {
  const { materials = [], sx } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [materialId, setMaterialId] = useState(null);
  const [canBeLoaned, setCanBeLoaned] = useState(false);
  const [menuList, setMenuList] = useState([]);

  const handleMenuOpen = (event, material) => {
    setAnchorEl(event.currentTarget);
    setMaterialId(material.material_id);
    setCanBeLoaned(material.available_for_loan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation();

  useEffect(() => {
    let list = [
      {
        href: `matostheque/details/material-detail/${materialId}`,
        label: 'View Details',
      },
    ];
    if (canBeLoaned) {
      list.push({
        href: `matostheque/create/create-loan?materialId=${materialId}`,
        label: 'Borrow',
      });
    }
    setMenuList(list);
  }, [materialId, canBeLoaned]);

  return (
    <Card sx={sx}>
      <CardHeader title={t('dashboard.latestMaterialsAdded', 'Latest Materials Added')} />
      <List>
        {materials && materials.map((material, index) => {
          console.log(material)
          const hasDivider = index < materials.length - 1;
          const ago = formatDistanceToNow(new Date(material.updated_at));
          const images = material.images && material.images.length !== 0 ? JSON.parse(material.images) : {};
          const image_path = images ? `${process.env.NEXT_PUBLIC_ASSETS}/${images[0]}` : '';

          return (
            <ListItem
              divider={hasDivider}
              key={material.material_id}
	            style={{ display : 'flex', alignItems: 'center', justifyContent: 'space-between' }} // try to modify styling here
            >
              <ListItemAvatar>
                <Avatar
                  src={image_path}
                  alt="Material"
                  sx={{
                    height: 48,
                    width: 48,
                    borderRadius: 1
                  }}
                />
              </ListItemAvatar>

              <Link component={NextLink} style={{ flexGrow: '1', marginLeft: '16px'}} underline="none" color="inherit" href={`/details/material-detail/${material.material_id}`} passHref>
                <ListItemText
                  primary={material.material_title}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondary={t('dashboard.updatedMaterialsDays', { ago: ago })}
                  secondaryTypographyProps={{ variant: 'body2' }}

                  sx={{cursor: 'pointer'}} // Add cursor pointer style
                />
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Box
                  sx={{
                    width: 15,
                    height: 15,
                    borderRadius: 1,
                    bgcolor: (() => { return(material.availability ? '#4caf50' : '#f44336') })
                  }}
                />
                <IconButton edge="end" onClick={(event) => handleMenuOpen(event, material)}>
                  <SvgIcon>
                    <EllipsisVerticalIcon />
                  </SvgIcon>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'right',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  style={{ marginLeft: '20px' }}
                >
                  {menuList.map((menuItem, index) => (
                    <MenuItem key={index} component="a" href={menuItem.href}>
                      <Typography variant="caption">{menuItem.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          component={NextLink}
          href="/materials"
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          {/* View all */}
          {t('dashboard.viewall', 'View All')}
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestMaterials.propTypes = {
  materials: PropTypes.array,
  sx: PropTypes.object
};
