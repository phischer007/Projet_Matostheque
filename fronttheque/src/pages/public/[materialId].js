import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, Divider, Card, CardActions, Unstable_Grid2 as Grid } from '@mui/material';
import { PublicLayout } from 'src/layouts/public/public-layout';
import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
import { MaterialDetailViewer } from 'src/sections/material-detail/material-detail-viewer';
import { MaterialDetailCalendar } from 'src/sections/material-detail/material-detail-calendar';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback, use } from 'react';
import config from 'src/utils/config';
import NextLink from 'next/link';

const Page = () => {
    const router = useRouter();
    const { materialId } = router.query;
    const [materialData, setMaterialData] = useState(null);
    const [eventsData, setEventsData] = useState(null);

    //fetching material data
    useEffect(() => {
        if (materialId) {
            fetch(`${config.apiUrl}/materials/${materialId}`)
                .then(response => response.json())
                .then(data => {
                    setMaterialData(data);
                })
                .catch(error => console.error('Error fetching data:', error));
            
            fetch(`${config.apiUrl}/material/${materialId}/events/`)
                .then(response => response.json())
                .then(data => {
                    setEventsData(data);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [materialId]);

    const handleBorrow = useCallback(() => {
        const url = '/create/create-loan' + (materialId ? `?materialId=${materialId}` : '');
        router.push(url);
    }, [materialId]);

    return (
        <>
            <Head>
                <title>
                    Public Material Details
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3} gap = {2}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Typography variant="h5">
                                Public Material
                            </Typography>
                        </Stack>

                        <MaterialDetailOverview
                            data={materialData}
                            mode={'public'}
                        />
                        <MaterialDetailCalendar
                            data = {eventsData}
                            mode={'public'}
                        />
                        <Stack spacing={1}>
                            <Divider />
                            <Button 
                                variant="contained"
                                onClick={handleBorrow}
                            >
                                Book Material
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box >
        </>
    );
}

Page.getLayout = (page) => (
    <PublicLayout>
        {page}
    </PublicLayout>
);

export default Page;
