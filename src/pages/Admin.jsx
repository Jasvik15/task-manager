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
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';

const statusOptions = ['Not Started', 'On Process', 'Completed'];

const getStatusColor = (status) => {
  switch (status) {
    case 'Not Started': return '#c62828';
    case 'On Process': return '#ed6c02';
    case 'Completed': return '#2e7d32';
    default: return '#757575';
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case 'Not Started': return '#ffebee';
    case 'On Process': return '#fff8e1';
    case 'Completed': return '#e8f5e9';
    default: return '#f5f5f5';
  }
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatDateForStorage = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

const Admin = () => {
  const { tasks, addTask, updateTask, deleteTask, reorderTasks, loading } = useTasks();
  const [editDialog, setEditDialog] = useState({ open: false, task: null, field: '', value: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [draggedItem, setDraggedItem] = useState(null);
  const dragOverItem = useRef(null);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading tasks from cloud...</Typography>
      </Container>
    );
  }

  const handleEdit = (task, field, currentValue) => {
    let displayValue = currentValue || '';
    if (field === 'targetDate' && currentValue) {
      displayValue = formatDateForDisplay(currentValue);
    }
    setEditDialog({ open: true, task, field, value: displayValue });
  };

  const handleSaveEdit = () => {
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

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'info' });
    }
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

  const renderCellValue = (task, field) => {
    if (field === 'status') {
      return (
        <Chip
          label={task.status || 'Not Started'}
          size="small"
          sx={{
            fontWeight: 500,
            borderRadius: 2,
            bgcolor: getStatusBg(task.status),
            color: getStatusColor(task.status),
            cursor: 'pointer',
          }}
          onClick={() => handleEdit(task, 'status', task.status)}
        />
      );
    }
    
    if (field === 'targetDate') {
      return (
        <Typography
          onClick={() => handleEdit(task, 'targetDate', task.targetDate)}
          sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
        >
          {task.targetDate ? formatDateForDisplay(task.targetDate) : 'Click to add'}
        </Typography>
      );
    }
    
    return (
      <Typography
        onClick={() => handleEdit(task, field, task[field])}
        sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
      >
        {task[field] || 'Click to edit'}
      </Typography>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{ fontWeight: 700, mb: 4, color: '#1e3c72' }}
      >
        Admin Dashboard
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflowX: 'auto', mb: 4 }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1e3c72' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, width: '50px' }}>Drag</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Sl.No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Machine No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Target Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Remarks</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
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
                <TableCell sx={{ cursor: 'grab', textAlign: 'center' }}>
                  <DragIndicatorIcon sx={{ color: '#999' }} />
                </TableCell>
                <TableCell>{renderCellValue(task, 'slNo')}</TableCell>
                <TableCell>{renderCellValue(task, 'machineNo')}</TableCell>
                <TableCell>{renderCellValue(task, 'description')}</TableCell>
                <TableCell>{renderCellValue(task, 'status')}</TableCell>
                <TableCell>{renderCellValue(task, 'targetDate')}</TableCell>
                <TableCell>{renderCellValue(task, 'remarks')}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete Task">
                    <IconButton size="small" onClick={() => handleDelete(task.id)} sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No tasks available. Click "Add New Task" to create one.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            bgcolor: '#2e7d32',
            '&:hover': { bgcolor: '#1b5e20' },
          }}
        >
          Add New Task
        </Button>
        <Button
          component={Link}
          to="/dashboard"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': { borderWidth: 2, bgcolor: '#f5f5f5' },
          }}
        >
          View Dashboard
        </Button>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, task: null, field: '', value: '' })}>
        <DialogTitle>Edit {editDialog.field}</DialogTitle>
        <DialogContent>
          {editDialog.field === 'status' ? (
            <Select
              fullWidth
              value={editDialog.value}
              onChange={(e) => setEditDialog({ ...editDialog, value: e.target.value })}
              sx={{ mt: 1 }}
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
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
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
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
};

export default Admin;