import { useState, useCallback } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { 
  Card, 
  InputAdornment, 
  OutlinedInput, 
  IconButton, 
  SvgIcon, 
  Stack, 
  Typography 
} from '@mui/material';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

import { useTranslation } from 'react-i18next';

// ------------------------------------------------------------------------------------ //

export const MaterialsSearch = ({ searchTerm, onSearchChange }) => {
  const [isCheckedInformation, setCheckedInformation] = useState(false);
  const handleInformationShow = useCallback(() => {
    setCheckedInformation(!isCheckedInformation);
  }, [isCheckedInformation]);

  const { t } = useTranslation();


  return (
    <Card sx={{ p: 2, maxWidth: 800 }}>
      <Stack direction="row" 
      spacing={2} 
      alignItems="center"
      >
        <OutlinedInput
          value={searchTerm}
          onChange={onSearchChange}
          fullWidth
          placeholder={t('inventoryMaterials.materialSearchField.placeholder', 'Material name or Material number or Owner or Description')}
          startAdornment={(
            <InputAdornment position="start">
              <SvgIcon
                color="action"
                fontSize="small"
              >
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          )}
          sx={{ flex: 1 }}
        />
        <IconButton onClick={handleInformationShow}>
          <SvgIcon fontSize="small">
            <InformationCircleIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      {isCheckedInformation ?
        <Stack spacing={2}
          sx={{
            my: 1,
            p: 1,
            bgcolor: '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: 0,
            maxWidth: 715,
            borderBottomRightRadius: 65
          }}>
          <Typography
            color="neutral.500"
            variant="caption"
          >
            {t(
              'inventoryMaterials.materialSearchField.informationText', 
              "You can search a material by the material's name, the owner's name, description, the material number on the qrcode (ex. Matostheque-001, type 001)"
              )
            }
          </Typography>
        </Stack>
        : null}
    </Card>
  )
};
