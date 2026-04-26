import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('slNo', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    const newSlNo = tasks.length > 0 ? Math.max(...tasks.map(t => t.slNo)) + 1 : 1;
    const newTask = {
      slNo: newSlNo,
      machineNo: '',
      description: '',
      status: 'Not Started',
      targetDate: '',
      closeDate: '',        // ADD THIS LINE - New field
      remarks: '',
      createdAt: new Date().toISOString()
    };
    
    try {
      await addDoc(collection(db, 'tasks'), newTask);
      console.log("Task added successfully!");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const updateTask = async (id, field, value) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        [field]: value,
        updatedAt: new Date().toISOString()
      });
      console.log("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
      console.log("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const reorderTasks = async (dragIndex, dropIndex) => {
    const newTasks = [...tasks];
    const draggedTask = newTasks[dragIndex];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);
    
    const updates = newTasks.map((task, idx) => {
      return updateDoc(doc(db, 'tasks', task.id), { slNo: idx + 1 });
    });
    
    try {
      await Promise.all(updates);
      console.log("Tasks reordered successfully!");
    } catch (error) {
      console.error("Error reordering tasks: ", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, reorderTasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};