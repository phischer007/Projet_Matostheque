import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import { formatDate } from 'src/utils/get-formatted-date';
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

export const OverviewLatestLoans = (props) => {
  const user = useAuth().user;
  const loans = props?.loans;
  const sx = props?.sx;
  const title = user.is_staff ? "Latest Transactions" : "Your Transactions";

  return (
    <Card sx={sx}>
      <CardHeader title={title} />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Material
                </TableCell>
                <TableCell>
                  Owner
                </TableCell>
                <TableCell sortDirection="desc">
                  Borrower
                </TableCell>
                <TableCell sortDirection="desc">
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans ? loans.map((loan) => {
                const loanDate = formatDate(loan.transaction_date);

                return (
                  <Link
                    key={loan.transaction_id}
                    underline="none"
                    color="inherit"
                    href={`/matostheque/details/loan-detail/${loan.transaction_id}`}
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
                        {loan.user_first_name} {loan.user_last_name}
                      </TableCell>
                      <TableCell>
                        {loan.borrower_first_name} {loan.borrower_last_name}
                      </TableCell>
                      <TableCell>
                        {loanDate}
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[loan.transaction_status]}>
                          {loan.transaction_status}
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
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestLoans.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
