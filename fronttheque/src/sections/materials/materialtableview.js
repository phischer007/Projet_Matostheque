import { 
  Typography, 
  Link, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Box,
  Checkbox,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import config from 'src/utils/config';
import { toast } from 'react-toastify';
import { quickNotifyOption } from 'src/utils/notification-config';
import { getCookie } from 'src/utils/csrf';

import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------------------------------- //

export const MaterialTableView = (props) => {
  const { data, refreshData } = props;

  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const sortedData = data ? [...data].sort((a, b) => {
    return a.material_title.localeCompare(b.material_title);
  }) : [];

  const { t } = useTranslation();

  // --- Selection Handlers ---
  const handleToggle = (event, id) => {
    event.stopPropagation();
    event.preventDefault(); 
    
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sortedData.map((n) => n.material_id);
      setSelectedItems(newSelecteds);
      return;
    }
    setSelectedItems([]);
  };

  // --- Bulk Action Handlers ---
  const openConfirmationDialog = (type) => {
    setActionType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setActionType(null);
  };

  const executeBulkUpdate = useCallback(async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      const isAvailable = actionType === 'make_available';

      const updatePromises = selectedItems.map((id) => 
        fetch(`${config.apiUrl}/materials/${id}/availability/`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({ available_for_loan: isAvailable })
        })
      );

      const responses = await Promise.all(updatePromises);
      const hasErrors = responses.some(res => !res.ok);

      if (hasErrors) {
        toast.error(t('persManageMaterials.availabilityActions.error_message_not_updated', 'Some materials could not be updated.'), { ...quickNotifyOption });
      } else {
        toast.success(t('persManageMaterials.availabilityActions.succes_message', 'Materials successfully updated.'), { ...quickNotifyOption });
        setSelectedItems([]);
        
        if (refreshData) {
          refreshData(); 
        } else {
          setTimeout(() => window.location.reload(), 1500); 
        }
      }
    } catch (error) {
      toast.error(t('persManageMaterials.availabilityActions.error_message_try_again', 'Could not update materials, try again later'), { ...quickNotifyOption });
    }
    setDialogOpen(false);
  }, [selectedItems, actionType, refreshData]);

  // --- Dynamic Dialog Text ---
  const getDialogText = () => {
    if (actionType === 'make_available') {
      return {
        title: t('persManageMaterials.availabilityActions.title_available', 'Put on Loan / Donation'),
        content: t('persManageMaterials.availabilityActions.available_content', 'Are you sure you want to make the selected materials available for borrowing again?'),
        btnText: t('persManageMaterials.availabilityActions.btnAvailableText', 'Make Available')
      };
    }
    return {
      title: t('persManageMaterials.availabilityActions.title_unavailable', 'Remove from Loan / Donation'),
      content: t('persManageMaterials.availabilityActions.remove_content', 'Are you sure you want to make the selected materials unavailable for borrowing?'),
      btnText: t('persManageMaterials.availabilityActions.btnRemoveText', 'Remove Availability')
    };
  };

  const numSelected = selectedItems.length;

  const headerStyle = {
    backgroundColor: '#162A42',
    color: 'white',
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          border: 1.5,
          borderColor: 'divider',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            borderBottom: 1, 
            borderColor: 'divider',
            ...(numSelected > 0 && {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              {t('persManageMaterials.title', 'Manage Personal Material Availability')}
            </Typography>
          )}

          {numSelected > 0 && (
            <Stack direction="row" spacing={2}>
               <Button 
                variant="contained" 
                color="primary" 
                size="small"
                sx={{ whiteSpace: 'nowrap' }}
                onClick={() => openConfirmationDialog('make_available')}
               >
                 {/* Put on Loan / Donation */}
                 {t('persManageMaterials.availabilityActions.title_available', 'Put on Loan / Donation')}
               </Button>
               <Button 
                variant="outlined" 
                color="error" 
                size="small"
                sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}
                onClick={() => openConfirmationDialog('make_unavailable')}
               >
                 {/* Remove from Loan / Donation */}
                  {t('persManageMaterials.availabilityActions.title_unavailable', 'Remove from Loan / Donation')}
               </Button>
            </Stack>
          )}
        </Toolbar>

        <Table sx={{ minWidth: 650 }} size='small' aria-label="materials table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" style={{ ...headerStyle, width: '2%' }}>
                <Checkbox
                  sx={{ 
                    color: 'white', 
                    '&.Mui-checked': { color: 'white' },
                    '&.MuiCheckbox-indeterminate': { color: 'white' }
                  }}
                  indeterminate={numSelected > 0 && numSelected < sortedData.length}
                  checked={sortedData.length > 0 && numSelected === sortedData.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
                <TableCell style={headerStyle}>{t('persManageMaterials.headers.title', 'Title')}</TableCell>
                <TableCell style={headerStyle}>{t('persManageMaterials.headers.description', 'Description')}</TableCell>
              <TableCell style={{...headerStyle, width: '5%'}}>{t('persManageMaterials.headers.quantity', 'Quantity')}</TableCell>
              <TableCell style={{...headerStyle, width: '5%'}}>{t('persManageMaterials.headers.status', 'Status')}</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {sortedData && sortedData.map((material) => {
              const isSelected = selectedItems.includes(material.material_id);

              return (
                <TableRow
                  key={material.material_id}
                  hover
                  selected={isSelected}
                  component={Link}
                  href={`/matostheque/details/material-detail/${material.material_id}`}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    cursor: 'pointer',
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onClick={(event) => handleToggle(event, material.material_id)}
                    />
                  </TableCell>
                  
                  <TableCell sx={{ minWidth: '200px' }}>
                    <Typography variant="subtitle1">
                      {material.material_title}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {material.description}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {material.quantity_available}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color={material.available_for_loan ? "success.main" : "text.secondary"}>
                      {material.available_for_loan 
                        ? t('persManageMaterials.availabilityActions.textStatusAvailable', 'Available')
                        : t('persManageMaterials.availabilityActions.textStatusUnavailable', 'Unavailable')
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{getDialogText().title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getDialogText().content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
          >
            {t('persManageMaterials.availabilityActions.btnCancelText', 'Cancel')}
          </Button>
          <Button onClick={executeBulkUpdate} color="primary" variant="contained">
            {getDialogText().btnText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

MaterialTableView.propTypes = {
  data: PropTypes.array,
  refreshData: PropTypes.func,
};