import { useState, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { tableConfig } from '../config/tableConfig';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LogoutIcon from '@mui/icons-material/Logout';

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

const Admin = () => {
  const { tasks, addTask, updateTask, deleteTask, reorderTasks, loading } = useTasks();
  const { logout } = useAuth();
  const [editDialog, setEditDialog] = useState({ open: false, task: null, field: '', value: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [draggedItem, setDraggedItem] = useState(null);
  const dragOverItem = useRef(null);
  
  const { headers, visibleFields, titles, buttons } = tableConfig;

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading tasks from cloud...</Typography>
      </Container>
    );
  }

  const handleEdit = (task, field, currentValue) => {
    let displayValue = currentValue || '';
    if ((field === 'targetDate' || field === 'closeDate') && currentValue) {
      displayValue = formatDateForDisplay(currentValue);
    }
    setEditDialog({ open: true, task, field, value: displayValue });
  };

  const handleSaveEdit = () => {
    const { task, field, value } = editDialog;
    let valueToSave = value;
    
    if ((field === 'targetDate' || field === 'closeDate') && value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        valueToSave = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    updateTask(task.id, field, valueToSave);
    setEditDialog({ open: false, task: null, field: '', value: '' });
    setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      setEditDialog({ ...editDialog, value: formattedDate });
    } else {
      setEditDialog({ ...editDialog, value: '' });
    }
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

  const getFieldValue = (task, field) => {
    const fieldMap = {
      'slNo': task.slNo,
      'plant': task.machineNo,
      'description': task.description,
      'status': task.status,
      'targetDate': task.targetDate,
      'closeDate': task.closeDate,    // ADD THIS
      'remarks': task.remarks
    };
    return fieldMap[field];
  };

  const renderCellValue = (task, field) => {
    const value = getFieldValue(task, field);
    
    if (field === 'status') {
      return (
        <Chip
          label={value || 'Not Started'}
          size="small"
          sx={{
            fontWeight: 500,
            borderRadius: 2,
            bgcolor: getStatusBg(value),
            color: getStatusColor(value),
            cursor: 'pointer',
          }}
          onClick={() => handleEdit(task, field, value)}
        />
      );
    }
    
    if (field === 'targetDate' || field === 'closeDate') {
      return (
        <Typography
          onClick={() => handleEdit(task, field, value)}
          sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
        >
          {value ? formatDateForDisplay(value) : 'Click to add'}
        </Typography>
      );
    }
    
    const editField = field === 'plant' ? 'machineNo' : field;
    return (
      <Typography
        onClick={() => handleEdit(task, editField, value)}
        sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
      >
        {value || 'Click to edit'}
      </Typography>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e3c72' }}>
            {titles.admin}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ textTransform: 'none', borderColor: '#d32f2f', color: '#d32f2f', '&:hover': { borderColor: '#d32f2f', bgcolor: '#ffebee' } }}
          >
            {buttons.logout}
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflowX: 'auto', mb: 4 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1e3c72' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600, width: '50px' }}>Drag</TableCell>
                {visibleFields.includes('slNo') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.slNo}</TableCell>
                )}
                {visibleFields.includes('plant') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.plant}</TableCell>
                )}
                {visibleFields.includes('description') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.description}</TableCell>
                )}
                {visibleFields.includes('status') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.status}</TableCell>
                )}
                {visibleFields.includes('targetDate') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.targetDate}</TableCell>
                )}
                {visibleFields.includes('closeDate') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.closeDate}</TableCell>
                )}
                {visibleFields.includes('remarks') && (
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{headers.remarks}</TableCell>
                )}
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
                  {visibleFields.includes('slNo') && (
                    <TableCell>{renderCellValue(task, 'slNo')}</TableCell>
                  )}
                  {visibleFields.includes('plant') && (
                    <TableCell>{renderCellValue(task, 'plant')}</TableCell>
                  )}
                  {visibleFields.includes('description') && (
                    <TableCell>{renderCellValue(task, 'description')}</TableCell>
                  )}
                  {visibleFields.includes('status') && (
                    <TableCell>{renderCellValue(task, 'status')}</TableCell>
                  )}
                  {visibleFields.includes('targetDate') && (
                    <TableCell>{renderCellValue(task, 'targetDate')}</TableCell>
                  )}
                  {visibleFields.includes('closeDate') && (
                    <TableCell>{renderCellValue(task, 'closeDate')}</TableCell>
                  )}
                  {visibleFields.includes('remarks') && (
                    <TableCell>{renderCellValue(task, 'remarks')}</TableCell>
                  )}
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
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
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
            {buttons.addTask}
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
            {buttons.viewDashboard}
          </Button>
        </Box>

        {/* Edit Dialog with Date Picker */}
        <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, task: null, field: '', value: '' })}>
          <DialogTitle>Edit {editDialog.field === 'targetDate' ? 'Start Date' : editDialog.field === 'closeDate' ? 'Close Date' : editDialog.field}</DialogTitle>
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
            ) : (editDialog.field === 'targetDate' || editDialog.field === 'closeDate') ? (
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label={editDialog.field === 'targetDate' ? "Select Start Date" : "Select Close Date"}
                  value={editDialog.value ? dayjs(editDialog.value) : null}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </Box>
            ) : (
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                value={editDialog.value}
                onChange={(e) => setEditDialog({ ...editDialog, value: e.target.value })}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, task: null, field: '', value: '' })}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Admin;