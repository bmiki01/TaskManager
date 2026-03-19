import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/projects" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/projects" />} />
            <Route path="/projects" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/projects/:id" element={isAuthenticated ? <ProjectBoard /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/projects" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
