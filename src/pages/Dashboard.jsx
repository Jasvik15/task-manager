import { useTasks } from '../context/TaskContext';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';

const getStatusConfig = (status) => {
  switch (status) {
    case 'Not Started':
      return { color: '#c62828', bg: '#ffebee', label: 'Not Started' };
    case 'On Process':
      return { color: '#ed6c02', bg: '#fff8e1', label: 'On Process' };
    case 'Completed':
      return { color: '#2e7d32', bg: '#e8f5e9', label: 'Completed' };
    default:
      return { color: '#757575', bg: '#f5f5f5', label: status };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const Dashboard = () => {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading tasks from cloud...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          Maintenance Task Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Projects & Pending activities
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1e3c72' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Sl.No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Machine No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Target Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              return (
                <TableRow key={task.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{task.slNo}</TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{task.machineNo || '—'}</Typography>
                  </TableCell>
                  <TableCell>{task.description || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusConfig.label}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                        bgcolor: statusConfig.bg,
                        color: statusConfig.color,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(task.targetDate)}</TableCell>
                  <TableCell>{task.remarks || '—'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button
          component={Link}
          to="/admin"
          variant="contained"
          startIcon={<DashboardIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Admin Panel
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;