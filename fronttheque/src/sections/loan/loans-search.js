// import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
// import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

// import { useTranslation } from 'react-i18next';



// export const LoansSearch = ({ searchTerm, onSearchChange }) => (
  

//   <Card sx={{ p: 2 }}>
//     <OutlinedInput
//       value={searchTerm}
//       onChange={onSearchChange}
//       fullWidth
//       placeholder={t('loansSearch.placeholder', 'Material Name/ Borrower Name/ Owner Name')}
//       startAdornment={(
//         <InputAdornment position="start">
//           <SvgIcon
//             color="action"
//             fontSize="small"
//           >
//             <MagnifyingGlassIcon />
//           </SvgIcon>
//         </InputAdornment>
//       )}
//       sx={{ maxWidth: 800 }}
//     />
//   </Card>
// );



import { 
  Card, 
  InputAdornment, 
  OutlinedInput, 
  SvgIcon 
} from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';

import { useTranslation } from 'react-i18next';

export const LoansSearch = ({ searchTerm, onSearchChange }) => {
  // 1. Hook MUST be inside the component
  const { t } = useTranslation(); 

  // 2. Added explicit return statement
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchTerm}
        onChange={onSearchChange}
        fullWidth
        placeholder={t('perloansSearch.placeholder', 'Material Name or Borrower Name or Owner Name')}
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