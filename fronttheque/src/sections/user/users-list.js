import {
  Box,
  TableCell,
  TableRow,
  Link, Switch
} from '@mui/material';
import { getCookie } from '../../utils/csrf';
import React, { useState } from 'react';
import config from '../../utils/config';
import { formatDate } from 'src/utils/get-formatted-date';
import { useAuth } from '../../hooks/use-auth';
import { useRouter } from 'next/router';

export const UsersList= (props) => {
  const {
    user = {}
  } = props;
  const [isChecked, setIsChecked] = useState(user.is_active);
  const router = useRouter();
  const actual_user = useAuth().user;
  const handleChange = (user,event) => {
  const newValue = !isChecked;
  const csrftoken = getCookie('csrftoken');
  fetch(`${config.apiUrl}/users/changeActivity/${user.user_id}/`,{
    method: 'PUT',
    credentials: 'include',// Add this so the session cookie is sent!
    headers: {
        'X-CSRFToken': csrftoken, // Add this
      },
    body: JSON.stringify({
      is_active: newValue,
    }),
  })
  setIsChecked(!isChecked);
}
  return (

      <TableRow
        hover
        key={user.user_id}
        onClick={() => user.role == "owner" ? router.push(`/materialsof?id=${user.user_id}`) : undefined}
      >
        <TableCell>{user.first_name}</TableCell>
        <TableCell>{user.last_name}</TableCell>
        <TableCell> {user.email}</TableCell>
        <TableCell> {user.role}</TableCell>
        <TableCell>{formatDate(user.last_login)} </TableCell>
        <TableCell>
          <span>{isChecked ? 'Active' : 'Not Active'  }</span>
          <br/>
          <Switch
            checked={isChecked}
            onClick={(e) => e.stopPropagation()}
            onChange={(event) => handleChange(user,event)}
            color={"success"}
            disabled={actual_user.email == user.email}
            sx = {{
              pointerEvents: actual_user.email == user.email ? 'none' : 'auto',
              opacity: actual_user.email == user.email ? 0.5 : 1,
            }}
          />
        </TableCell>
      </TableRow>
  );
}