import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Divider
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const OverviewStatsMaterials = ({ open, onClose, statsData }) => {
  
  // 1. Prepare Chart Data
  const chartData = useMemo(() => {
    if (!statsData || !statsData.team_breakdown) return null;

    const labels = statsData.team_breakdown.map(item => item.team);
    const dataPoints = statsData.team_breakdown.map(item => item.material_count);

    return {
      labels,
      datasets: [
        {
          label: 'Total Materials',
          data: dataPoints,
          backgroundColor: 'rgba(99, 102, 241, 0.5)', // Primary Color (Indigo)
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
        },
      ],
    };
  }, [statsData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Distribution by Team' },
    },
  };

  if (!statsData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Material Statistics</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3}>
          
          {/* A. Global Total Card */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6">Total Materials in Inventory</Typography>
                <Typography variant="h3" fontWeight="bold">
                  {statsData.total_global_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* B. Bar Chart: Materials per Team */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined">
              <CardContent>
                {chartData && <Bar options={chartOptions} data={chartData} />}
              </CardContent>
            </Card>
          </Grid>

          {/* C. Table: Users per Team */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Users per Team
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Users (Owners)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statsData.team_breakdown.map((row) => (
                      <TableRow key={row.team}>
                        <TableCell component="th" scope="row">
                          {row.team}
                        </TableCell>
                        <TableCell align="right">{row.user_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};