import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const UsersSearch = ({ searchTerm, onSearchChange }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={searchTerm}
      onChange={onSearchChange}
      fullWidth
      placeholder="User FirstName/ User LastName"
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
