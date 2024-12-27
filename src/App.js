// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute
                element={<AdminDashboard />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute
                element={<TeacherDashboard />}
                allowedRoles={['admin', 'teacher']}
              />
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute
                element={<StudentDashboard />}
                allowedRoles={['admin', 'teacher', 'student']}
              />
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
