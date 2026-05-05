import { useState, useCallback } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, Divider, InputAdornment, OutlinedInput, IconButton, SvgIcon, Stack, Typography } from '@mui/material';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

export const MaterialsSearch = ({ searchTerm, onSearchChange }) => {
  const [isCheckedInformation, setCheckedInformation] = useState(false);
  const handleInformationShow = useCallback(() => {
    setCheckedInformation(!isCheckedInformation);
  }, [isCheckedInformation]);

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
          // placeholder="Material name/ Material number/ Owner name/ Team"
          placeholder="Material name/ Material number/ Owner name/ Team/ Description"

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
          sx={{ flex: 1 }} // Remove border radius and stretch input
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
            You can search a material by the material&apos;s name,
            the owner&apos;s name, description, the team name or the material number on the qrcode (ex. Matostheque-001, type 001)
          </Typography>
        </Stack>
        : null}
    </Card>
  )
};
