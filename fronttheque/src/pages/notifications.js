import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, SvgIcon, Typography, Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { NotificationItem } from 'src/sections/notification/notification-item';
import config from '../utils/config';
import { useAuth } from 'src/hooks/use-auth';

import { useTranslation } from 'react-i18next';

const Page = () => {
    const [notificationsList, setNotificationsList] = useState(null);
    const user = useAuth().user;

    useEffect(() => {
        fetch(`${config.apiUrl}/notifications/${user.user_id}/`,{credentials:'include'})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setNotificationsList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('reqNotifications.title', 'Notifications')}</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    {t('reqNotifications.title', 'Notifications')}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack
                            direction="column"
                            justifyContent="space-between"
                            spacing={2}
                            sx={{
                                boxShadow: 'none'
                            }} // Remove box shadow

                        >
                            {notificationsList && notificationsList.length > 0 ? notificationsList.map(item => (
                                <NotificationItem
                                    key={item.id} // Ensure to provide a unique key
                                    notification={item}
                                />
                            )) : (
                                <Typography variant="subtitle2">{t('reqNotifications.subtitle', 'No notification to show yet')}</Typography>
                            )}
                        </Stack>

                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
