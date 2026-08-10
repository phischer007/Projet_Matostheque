import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

import { useTranslation } from 'react-i18next';

export const UsersSearch = ({ searchTerm, onSearchChange }) => {

  const { t } = useTranslation();

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchTerm}
        onChange={onSearchChange}
        fullWidth
        placeholder={t('userManagement.placeholder', 'Search by First Name, Last Name')}
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
        sx={{ maxWidth: 800 }}
      />
    </Card>
  );
};
