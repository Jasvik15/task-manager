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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid2,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading tasks from cloud...</Typography>
      </Container>
    );
  }

  // Mobile view: Cards instead of Table
  if (isMobile) {
    return (
      <Container maxWidth="sm" sx={{ py: 3, minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Production Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Real-time production task monitoring
          </Typography>
        </Box>

        {tasks.map((task) => {
          const statusConfig = getStatusConfig(task.status);
          return (
            <Card key={task.id} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    #{task.slNo} - {task.machineNo}
                  </Typography>
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
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {task.description || 'No description'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Target: {formatDate(task.targetDate)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {task.remarks || 'No remarks'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/admin"
            variant="contained"
            fullWidth
            startIcon={<DashboardIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Admin Panel
          </Button>
        </Box>
      </Container>
    );
  }

  // Desktop/Tablet view: Table
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 }, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography
          variant={isTablet ? "h4" : "h3"}
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Production Task Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Real-time production task monitoring
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: { xs: 500, sm: 650, md: 800 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1e3c72' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, py: { xs: 1, sm: 1.5 } }}>Sl.No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, py: { xs: 1, sm: 1.5 } }}>Machine No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, py: { xs: 1, sm: 1.5 } }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, py: { xs: 1, sm: 1.5 } }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, py: { xs: 1, sm: 1.5 } }}>Target Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }, py: { xs: 1, sm: 1.5 } }}>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              return (
                <TableRow key={task.id}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>{task.slNo}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>
                    <Typography fontWeight={500} fontSize="inherit">{task.machineNo || '—'}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>{task.description || '—'}</TableCell>
                  <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                    <Chip
                      label={statusConfig.label}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                        bgcolor: statusConfig.bg,
                        color: statusConfig.color,
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>{formatDate(task.targetDate)}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: { xs: 1, sm: 1.5 } }}>{task.remarks || '—'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 4, md: 5 } }}>
        <Button
          component={Link}
          to="/admin"
          variant="contained"
          startIcon={<DashboardIcon />}
          sx={{
            px: { xs: 3, sm: 4, md: 5 },
            py: { xs: 1, sm: 1.2, md: 1.5 },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Admin Panel
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;