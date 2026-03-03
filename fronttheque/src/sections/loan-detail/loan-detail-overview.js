import {
    Box, Card, CardContent, TextField,
    Typography, Paper, Stack, CardActions,
    Button, Divider, Alert
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
                                            {data.material_details.title}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Duration (in days)
                                        </TableCell>
                                        <TableCell id="duration" style={{ minWidth: 160 }} align="left">
                                            {data.duration}
                                        </TableCell>
                                    </TableRow>

                                    {/* <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Quantity Borrowed
                                        </TableCell>
                                        <TableCell id="quantity" style={{ minWidth: 160 }} align="left">
                                            {data.quantity}
                                        </TableCell>
                                    </TableRow> */}

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
                                            Loan starting date
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {formattedDate}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Team
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {data.material_details.team}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Loan Location
                                        </TableCell>
                                        <TableCell id="team" style={{ minWidth: 160 }} align="left">
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
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Owner
                                        </TableCell>
                                        <TableCell style={{ minWidth: 160 }} align="left">
                                            {data.owner_details.first_name} {data.owner_details.last_name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" variant="head" scope="row">
                                            Owner&apos;s Email
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
            {enableEdit ? (<>
                <Divider />
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        onClick={handleSaveChanges}
                        variant="contained">
                        Save changes
                    </Button>
                </CardActions>
            </>) : null}
            <Divider />
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
