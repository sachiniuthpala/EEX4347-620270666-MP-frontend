// src/components/TeacherDashboard.js
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard = () => {
  const { logout, user } = useAuth();
 
  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.username}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;