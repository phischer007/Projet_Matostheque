import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import TicketIcon from '@heroicons/react/24/solid/TicketIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import FolderIcon from '@heroicons/react/24/solid/FolderIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import AtSymbolIcon  from '@heroicons/react/24/solid/AtSymbolIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    // title: 'Materials Library',
    title: 'Inventory',
    path: '/materials',
    icon: (
      <SvgIcon fontSize="small">
        <FolderIcon />
      </SvgIcon>
    )
  },
  {
    title: 'My Loans',
    path: '/myloans',
    icon: (
      <SvgIcon fontSize="small">
        <TicketIcon />
      </SvgIcon>
    )
  },
  {
    title: 'My Materials',
    path: '/mymaterials',
    icon: (
      <SvgIcon fontSize="small">
        <ArchiveBoxIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Threads',
    path: '/comments',
    icon: (
      <SvgIcon fontSize="small">
        <AtSymbolIcon />
      </SvgIcon>
    )
  }
];
