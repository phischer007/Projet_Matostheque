import { SvgIcon } from '@mui/material';
import ChatBubbleLeftRightIcon from '@heroicons/react/24/solid/ChatBubbleLeftRightIcon';
import Squares2X2Icon from '@heroicons/react/24/solid/Squares2X2Icon';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import ClipboardDocumentCheckIcon from '@heroicons/react/24/solid/ClipboardDocumentCheckIcon';
import BriefcaseIcon  from '@heroicons/react/24/solid/BriefcaseIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';

export const items = [
  {
    // title: 'Overview',
    title: 'navbar.overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <Squares2X2Icon />
      </SvgIcon>
    )
  },
  {
    // title: 'Catalog',
    title: 'navbar.catalog',
    path: '/materials',
    icon: (
      <SvgIcon fontSize="small">
        <RectangleStackIcon />
      </SvgIcon>
    )
  },
  {

    // title: 'Loans',
    title: 'navbar.loans',
    path: '/myloans',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentCheckIcon />
      </SvgIcon>
    )
  },
  {
    // title: 'Personal Materials',
    title: 'navbar.personalMaterials',
    path: '/mymaterials',
    icon: (
      <SvgIcon fontSize="small">
        <BriefcaseIcon />
      </SvgIcon>
    )
  },
  {
    // title: 'Profile',
    title: 'navbar.profile',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    // title: 'Threads',
    title: 'navbar.threads',
    path: '/comments',
    icon: (
      <SvgIcon fontSize="small">
        <ChatBubbleLeftRightIcon />
      </SvgIcon>
    )
  },
  {
    // title: 'User Management',
    title: 'navbar.userManagement',
    path: '/userslist',
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    )
  }
];
