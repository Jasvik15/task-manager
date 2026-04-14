import { useState, useRef } from 'react';
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
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const statusOptions = ['Not Started', 'On Process', 'Completed'];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Not Started':
      return { color: '#c62828', bg: '#ffebee' };
    case 'On Process':
      return { color: '#ed6c02', bg: '#fff8e1' };
    case 'Completed':
      return { color: '#2e7d32', bg: '#e8f5e9' };
    default:
      return { color: '#757575', bg: '#f5f5f5' };
  }
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const Admin = () => {
  const { tasks, addTask, updateTask, deleteTask, reorderTasks, loading } = useTasks();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, task: null, field: '', value: '' });
  const dragOverItem = useRef(null);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading tasks from cloud...</Typography>
      </Container>
    );
  }

  const handleEdit = (taskId, field, currentValue) => {
    let displayValue = currentValue;
    if (field === 'targetDate' && currentValue) {
      displayValue = formatDateForDisplay(currentValue);
    }
    
    if (isMobile) {
      const task = tasks.find(t => t.id === taskId);
      setEditDialog({ open: true, task, field, value: displayValue || '' });
    } else {
      setEditingCell({ taskId, field });
      setEditValue(displayValue || '');
    }
  };

  const handleDialogSave = () => {
    const { task, field, value } = editDialog;
    let valueToSave = value;
    
    if (field === 'targetDate' && value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        valueToSave = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    updateTask(task.id, field, valueToSave);
    setEditDialog({ open: false, task: null, field: '', value: '' });
    setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
  };

  const handleSave = (taskId, field) => {
    if (editingCell && editingCell.taskId === taskId && editingCell.field === field) {
      let valueToSave = editValue;
      
      if (field === 'targetDate' && editValue) {
        const parts = editValue.split('/');
        if (parts.length === 3) {
          valueToSave = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      updateTask(taskId, field, valueToSave);
      setEditingCell(null);
      setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
    }
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'info' });
  };

  const handleAddTask = () => {
    addTask();
    setSnackbar({ open: true, message: 'New task added', severity: 'success' });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    dragOverItem.current = null;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = draggedItem;
    if (dragIndex === null || dragIndex === dropIndex) return;
    
    reorderTasks(dragIndex, dropIndex);
    setDraggedItem(null);
    dragOverItem.current = null;
  };

  // Mobile view: Cards instead of Table
  if (isMobile) {
    return (
      <Container maxWidth="sm" sx={{ py: 2, minHeight: '100vh' }}>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{ fontWeight: 700, mb: 2, color: '#1e3c72' }}
        >
          Admin Dashboard
        </Typography>

        {tasks.map((task, index) => {
          const statusConfig = getStatusConfig(task.status);
          return (
            <Card 
              key={task.id} 
              sx={{ mb: 2, borderRadius: 2, position: 'relative' }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DragIndicatorIcon sx={{ color: '#999', cursor: 'grab' }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      #{task.slNo} - {task.machineNo || 'No Machine'}
                    </Typography>
                  </Box>
                  <Chip
                    label={task.status || 'Not Started'}
                    size="small"
                    sx={{ bgcolor: statusConfig.bg, color: statusConfig.color }}
                    onClick={() => handleEdit(task.id, 'status', task.status)}
                  />
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Description:</Typography>
                  <Typography variant="body2" onClick={() => handleEdit(task.id, 'description', task.description)} sx={{ cursor: 'pointer' }}>
                    {task.description || 'Click to edit'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Target Date:</Typography>
                    <Typography variant="body2" onClick={() => handleEdit(task.id, 'targetDate', task.targetDate)} sx={{ cursor: 'pointer' }}>
                      {task.targetDate ? formatDateForDisplay(task.targetDate) : 'Click to add'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Remarks:</Typography>
                    <Typography variant="body2" onClick={() => handleEdit(task.id, 'remarks', task.remarks)} sx={{ cursor: 'pointer' }}>
                      {task.remarks || 'Click to edit'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                  <Tooltip title="Save">
                    <IconButton size="small" sx={{ color: '#2e7d32' }}>
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(task.id)} sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          );
        })}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2, bgcolor: '#2e7d32' }}
          >
            Add New Task
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            View Dashboard
          </Button>
        </Box>

        {/* Edit Dialog for Mobile */}
        <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, task: null, field: '', value: '' })}>
          <DialogTitle>Edit {editDialog.field}</DialogTitle>
          <DialogContent>
            {editDialog.field === 'status' ? (
              <select
                value={editDialog.value}
                onChange={(e) => setEditDialog({ ...editDialog, value: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 8, marginTop: 8 }}
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                value={editDialog.value}
                onChange={(e) => setEditDialog({ ...editDialog, value: e.target.value })}
                placeholder={editDialog.field === 'targetDate' ? 'dd/mm/yyyy' : ''}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, task: null, field: '', value: '' })}>Cancel</Button>
            <Button onClick={handleDialogSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 1 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  // Desktop/Tablet view: Table
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh' }}>
      <Typography
        variant={isTablet ? "h5" : "h4"}
        component="h1"
        align="center"
        sx={{
          fontWeight: 700,
          mb: { xs: 2, sm: 3, md: 4 },
          color: '#1e3c72',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        Admin Dashboard
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          overflowX: 'auto',
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Table sx={{ minWidth: { xs: 700, sm: 800, md: 900 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1e3c72' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Drag</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Sl.No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Machine No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Target Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>Remarks</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                sx={{
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ cursor: 'grab', textAlign: 'center', py: { xs: 1, sm: 1.5 } }}>
                  <DragIndicatorIcon sx={{ color: '#999' }} />
                </TableCell>
                <TableCell sx={{ p: { xs: 1, sm: 2 } }}>{task.slNo}</TableCell>
                <TableCell sx={{ p: { xs: 1, sm: 2 } }}>{task.machineNo || '—'}</TableCell>
                <TableCell sx={{ p: { xs: 1, sm: 2 } }}>{task.description || '—'}</TableCell>
                <TableCell sx={{ p: { xs: 1, sm: 2 } }}>
                  <Chip
                    label={task.status || 'Not Started'}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      borderRadius: 2,
                      bgcolor: getStatusConfig(task.status).bg,
                      color: getStatusConfig(task.status).color,
                      cursor: 'pointer',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' }
                    }}
                    onClick={() => handleEdit(task.id, 'status', task.status)}
                  />
                </TableCell>
                <TableCell sx={{ p: { xs: 1, sm: 2 } }}>
                  <Typography
                    onClick={() => handleEdit(task.id, 'targetDate', task.targetDate)}
                    sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
                  >
                    {task.targetDate ? formatDateForDisplay(task.targetDate) : 'Click to add'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ p: { xs: 1, sm: 2 } }}>
                  <Typography
                    onClick={() => handleEdit(task.id, 'remarks', task.remarks)}
                    sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
                  >
                    {task.remarks || 'Click to edit'}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ p: { xs: 1, sm: 2 } }}>
                  <Tooltip title="Save Changes">
                    <IconButton size="small" sx={{ color: '#2e7d32', mr: 0.5 }}>
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Task">
                    <IconButton size="small" onClick={() => handleDelete(task.id)} sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
          fullWidth={isTablet}
          sx={{
            px: { xs: 3, sm: 4, md: 5 },
            py: { xs: 1, sm: 1.2, md: 1.5 },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
            bgcolor: '#2e7d32',
          }}
        >
          Add New Task
        </Button>
        <Button
          component={Link}
          to="/dashboard"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          fullWidth={isTablet}
          sx={{
            px: { xs: 3, sm: 4, md: 5 },
            py: { xs: 1, sm: 1.2, md: 1.5 },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
          }}
        >
          View Dashboard
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 1 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;