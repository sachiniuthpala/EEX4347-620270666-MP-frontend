import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'teacher'
  });
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser),
        credentials: 'include'
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('User created successfully');
        setNewUser({ username: '', email: '', password: '', role: 'teacher' });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error creating user');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

      <div className="max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        {message && (
          <div className="mb-4 text-center text-sm font-medium text-gray-900">
            {message}
          </div>
        )}
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              placeholder="Username"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              placeholder="Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;