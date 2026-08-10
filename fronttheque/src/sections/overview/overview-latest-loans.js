import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
// import { formatDate } from 'src/utils/get-formatted-date';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardHeader, 
  Divider, 
  SvgIcon, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Link
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';
import { statusMap } from 'src/data/static_data';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';


export const OverviewLatestLoans = (props) => {
  const user = useAuth().user;
  const loans = props?.loans;
  const sx = props?.sx;

  const { t, i18n } = useTranslation();

  // const title = user.is_staff ? "General loans information" : "Your loan information";
  const title = user.is_staff 
  ? t('latestLoans.generalInfo', 'General loans information') 
  : t('latestLoans.yourInfo', 'Your loan information');

  const headerStyle = {
    backgroundColor: '#162A42',
    color: 'white',
    width: 280
  };

  const currentLocale = i18n.language === 'fr' ? fr : enUS;

  return (
    <Card sx={sx}>
      <CardHeader title={title} />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={headerStyle}>
                  {t('latestLoans.material', 'Material')}
                </TableCell>
                <TableCell style={headerStyle}>
                  {t('latestLoans.type', 'Type')}
                </TableCell>
                <TableCell style={headerStyle}>
                  {t('latestLoans.ownerName', 'Owner\'s Name')}
                </TableCell>
                <TableCell style={headerStyle}>
                  {t('latestLoans.duration', 'Duration')}
                </TableCell>
                <TableCell style={headerStyle} sortDirection="desc">
                  {t('latestLoans.date', 'Date')}
                </TableCell>
                <TableCell style={headerStyle}>
                  {t('latestLoans.quantity', 'Quantity')}
                </TableCell>
                <TableCell style={headerStyle}>
                  {t('latestLoans.status', 'Status')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans ? loans.map((loan) => {
                const loanDate = format(new Date(loan.loan_date), 'PP', { locale: currentLocale });

                return (
                  <Link
                    key={loan.loan_id}
                    underline="none"
                    color="inherit"
                    href={`/matostheque/details/loan-detail/${loan.loan_id}`}
                    style={{ display: 'contents' }}
                  >
                    <TableRow
                      hover
                      key={loan.loan_id}
                    >
                      <TableCell>
                        {loan.material_title}
                      </TableCell>
                      <TableCell>
                        {t(`staticData.loanTypes.${loan.type}`, loan.type)}
                      </TableCell>
                      <TableCell>
                        {user.is_staff 
                          ? `${loan.user_first_name} ${loan.user_last_name}` 
                          : `${loan.owner_first_name} ${loan.owner_last_name}`}
                      </TableCell>
                      <TableCell>
                        {loan.duration}
                      </TableCell>
                      <TableCell>
                        {loanDate}
                      </TableCell>
                      <TableCell>
                        {loan.loan_quantity}
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[loan.loan_status]}>
                          {t(`staticData.loanStatus.${loan.loan_status}`, loan.loan_status)}
                        </SeverityPill>
                      </TableCell>
                    </TableRow>
                  </Link>
                  );
                }) : null}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
          component={NextLink}
          href="/myloans"
        >
          {t('latestLoans.viewall', 'View All')}
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestLoans.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
