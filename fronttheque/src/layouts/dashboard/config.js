import ChartPieIcon from '@heroicons/react/24/solid/ChartPieIcon';
import CalendarDaysIcon from '@heroicons/react/24/solid/CalendarDaysIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';
import ClipboardDocumentCheckIcon from '@heroicons/react/24/solid/ClipboardDocumentCheckIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import AtSymbolIcon  from '@heroicons/react/24/solid/AtSymbolIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartPieIcon />
      </SvgIcon>
    )
  },
  {
    // title: 'Materials Library',
    title: 'Inventory',
    path: '/materials',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentCheckIcon />
      </SvgIcon>
    )
  },
  {
    title: 'My Transactions',
    path: '/myloans',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarDaysIcon />
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
  },
  {
    title: 'List of Users',
    path: '/userslist',
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    )
  }
];
