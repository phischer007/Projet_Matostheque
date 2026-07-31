import {
  Box, Card, CardContent, TextField,
  Typography, Paper, Stack, CardActions,
  Button, Divider, Alert, Link
} from '@mui/material';
//for tables only
import { TableContainer, Table, TableRow, TableBody, TableCell } from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { CheckIcon, PencilIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect, useCallback } from 'react';
import config from '../../utils/config';
import { useRouter } from 'next/router';
import { useLoanDetailHandlers } from 'src/hooks/loan-detail-handlers';
import { useAuth } from 'src/hooks/use-auth';
import { statusMap } from 'src/data/static_data';

export const LoanDetailOverview = (props) => {
    const user = useAuth().user;
    const router = useRouter();
    const data = props.data ? props.data : null;
    console.log(new Date(data.loan_date) )
    console.log(new Date())
    console.log(new Date(data.loan_date) <= new Date())

    const {
        formattedDate,
        daysLeft,
        editableRow,
        formData,
        message,
        handleChange,
        handleEdit,
        handleSave,
        handleSaveChanges,
        handleDelete,
        enableEdit
    } = useLoanDetailHandlers(data);



    return data ? (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                    gap={1}
                >
                    {data ?
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 200 }} aria-label="information table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Material Title
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            <Link href={'../material-detail/' + data.material }
                                                  underline="none"
                                            >
                                              {data.material_details.title}</Link>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Material Type
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                              {data.type}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Status
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            <Stack
                                                direction="rows"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <SeverityPill color={statusMap[data.loan_status]}>
                                                    {data.loan_status}
                                                </SeverityPill>
                                                <p>{daysLeft ? `( ${daysLeft} )` : null}</p>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Borrower
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {data.borrower_details.first_name} {data.borrower_details.last_name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Borrower&apos;s Email
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {data.borrower_details.email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Starting date
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {formattedDate}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Duration (in day)
                                        </TableCell>
                                        <TableCell id="duration" style={{ minWidth: 160 }} align="left">
                                            {data.owner_details.user_id === user.user_id ? (
                                            <Stack
                                                  direction="rows"
                                                  alignItems="center"
                                                  gap={1}
                                              >
                                                  {editableRow === "duration" ? (
                                                      <TextField
                                                          name='duration'
                                                          value={formData.duration}
                                                          onChange={handleChange}
                                                      />
                                                  ) : (
                                                      formData.duration
                                                  )}
                                                  {enableEdit ? editableRow === "duration" ? (
                                                      <Button
                                                          onClick={handleSave}
                                                      >
                                                          <CheckIcon style={{ width: 20, height: 20 }} />
                                                      </Button>
                                                  ) : (
                                                      <Button
                                                          onClick={() => handleEdit("duration")}
                                                      >
                                                          <PencilIcon style={{ width: 20, height: 20 }} />
                                                      </Button>
                                                  ) : null}
                                              </Stack>
                                              ) :
                                            data.duration
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Quantity
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                          {data.borrower_details.user_id === user.user_id && new Date(data.loan_date) >= new Date() ? (
                                            <Stack
                                                  direction="rows"
                                                  alignItems="center"
                                                  gap={1}
                                              >
                                                  {editableRow === "loan_quantity" ? (
                                                      <TextField
                                                          name='loan_quantity'
                                                          value={formData.loan_quantity}
                                                          onChange={handleChange}
                                                      />
                                                  ) : (
                                                      formData.loan_quantity
                                                  )}
                                                  {enableEdit ? editableRow === "loan_quantity" ? (
                                                      <Button
                                                          onClick={handleSave}
                                                      >
                                                          <CheckIcon style={{ width: 20, height: 20 }} />
                                                      </Button>
                                                  ) : (
                                                      <Button
                                                          onClick={() => handleEdit("loan_quantity")}
                                                      >
                                                          <PencilIcon style={{ width: 20, height: 20 }} />
                                                      </Button>
                                                  ) : null}
                                              </Stack>
                                              ) :
                                            data.loan_quantity
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Location
                                        </TableCell>
                                        <TableCell id="team" style={{ minWidth: 160 }} align="left">
                                          {data.borrower_details.user_id === user.user_id ? (
                                            <Stack
                                                direction="rows"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                {editableRow === "location" ? (
                                                    <TextField
                                                        name='location'
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    formData.location
                                                )}
                                                {enableEdit ? editableRow === "location" ? (
                                                    <Button
                                                        onClick={handleSave}
                                                    >
                                                        <CheckIcon style={{ width: 20, height: 20 }} />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleEdit("location")}
                                                    >
                                                        <PencilIcon style={{ width: 20, height: 20 }} />
                                                    </Button>
                                                ) : null}
                                            </Stack>
                                          ) :
                                            data.location
                                          }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Contact person
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {data.owner_details.first_name} {data.owner_details.last_name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Contact person&apos;s Email
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {data.owner_details.email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row" style={{ verticalAlign: 'top' }}>
                                            Borrower&apos;s Note
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160, whiteSpace: 'pre-line' }} align="left">
                                            {data.message}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        : <Typography variant="subtitle.2"> ...Loading data</Typography>}
                    {message && message.status ?
                        <Stack
                            xs={12}
                            md={6}
                        >
                            <Alert severity={message.status}> {message.value}</Alert>
                        </Stack> : null}
                </Box>
            </CardContent>
            {enableEdit ? (
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                <CardActions sx={{ justifyContent: 'center',grow:1 }}>
                    <Button
                        type="submit"
                        onClick={handleSaveChanges}
                        variant="contained">
                        Save changes
                    </Button>
                </CardActions>
            {user.is_staff ?
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete loan record
                    </Button>
                </CardActions>
                : null}
              </Stack>
              ) : null}
        </Card>)
        : (
            <Card>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                    >
                        No material found!!
                    </Typography>
                </CardContent>
            </Card>
        );
}
