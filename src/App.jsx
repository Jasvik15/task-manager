import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ... rest of your imports

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskProvider>
        <Router basename="/task-manager">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}