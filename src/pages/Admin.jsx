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
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
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

  const handleEdit = (taskId, field, currentValue) => {
    let displayValue = currentValue;
    if (field === 'targetDate' && currentValue) {
      displayValue = formatDateForDisplay(currentValue);
    }
    setEditingCell({ taskId, field });
    setEditValue(displayValue || '');
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

  const handleKeyDown = (e, taskId, field) => {
    if (e.key === 'Enter') {
      handleSave(taskId, field);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
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

  const renderEditableCell = (task, field, displayValue) => {
    const isEditing = editingCell?.taskId === task.id && editingCell?.field === field;

    if (isEditing) {
      if (field === 'status') {
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave(task.id, field)}
            onKeyDown={(e) => handleKeyDown(e, task.id, field)}
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '2px solid #1976d2',
              outline: 'none',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              backgroundColor: 'white',
            }}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      }

      if (field === 'targetDate') {
        return (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave(task.id, field)}
            onKeyDown={(e) => handleKeyDown(e, task.id, field)}
            placeholder="dd/mm/yyyy"
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '2px solid #1976d2',
              outline: 'none',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
            }}
          />
        );
      }

      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleSave(task.id, field)}
          onKeyDown={(e) => handleKeyDown(e, task.id, field)}
          autoFocus
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: '2px solid #1976d2',
            outline: 'none',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
          }}
        />
      );
    }

    if (field === 'status') {
      const statusConfig = getStatusConfig(task.status);
      return (
        <Chip
          label={task.status || 'Not Started'}
          size="small"
          sx={{
            fontWeight: 500,
            borderRadius: 2,
            bgcolor: statusConfig.bg,
            color: statusConfig.color,
            cursor: 'pointer',
            '&:hover': { bgcolor: statusConfig.bg, opacity: 0.8 },
          }}
          onClick={() => handleEdit(task.id, field, task.status)}
        />
      );
    }

    if (field === 'targetDate') {
      return (
        <Typography
          onClick={() => handleEdit(task.id, field, task.targetDate)}
          sx={{
            cursor: 'pointer',
            display: 'inline-block',
            width: '100%',
            '&:hover': { color: '#1976d2' },
          }}
        >
          {task.targetDate ? formatDateForDisplay(task.targetDate) : 'Click to add date'}
        </Typography>
      );
    }

    return (
      <Typography
        onClick={() => handleEdit(task.id, field, task[field])}
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          width: '100%',
          wordBreak: 'break-word',
          '&:hover': { color: '#1976d2' },
        }}
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
        sx={{
          fontWeight: 700,
          mb: 4,
          color: '#1e3c72',
        }}
      >
        Admin Dashboard
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          mb: 4,
        }}
      >
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
                <TableCell sx={{ p: 2 }}>{renderEditableCell(task, 'slNo', task.slNo)}</TableCell>
                <TableCell sx={{ p: 2 }}>{renderEditableCell(task, 'machineNo', task.machineNo)}</TableCell>
                <TableCell sx={{ p: 2 }}>{renderEditableCell(task, 'description', task.description)}</TableCell>
                <TableCell sx={{ p: 2 }}>{renderEditableCell(task, 'status', task.status)}</TableCell>
                <TableCell sx={{ p: 2 }}>{renderEditableCell(task, 'targetDate', task.targetDate)}</TableCell>
                <TableCell sx={{ p: 2 }}>{renderEditableCell(task, 'remarks', task.remarks)}</TableCell>
                <TableCell align="center" sx={{ p: 2 }}>
                  <Tooltip title="Save Changes">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSnackbar({ open: true, message: 'All changes saved', severity: 'success' });
                      }}
                      sx={{ color: '#2e7d32', mr: 1, '&:hover': { backgroundColor: '#e8f5e9' } }}
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Task">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(task.id)} 
                      sx={{ color: '#d32f2f', '&:hover': { backgroundColor: '#ffebee' } }}
                    >
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
            '&:hover': {
              bgcolor: '#1b5e20',
            },
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
            '&:hover': {
              borderWidth: 2,
              bgcolor: '#f5f5f5',
            },
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