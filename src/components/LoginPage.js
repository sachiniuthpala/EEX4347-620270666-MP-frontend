import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogImage from '../assets/login-illustration.png';
import LMSLogo from '../assets/lmslogo.jpg';
import fb from '../assets/fb.jpg';
import Google from '../assets/gp.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
   
    try {
      const result = await login(email, password);
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        navigate(`/${result.user.role}-dashboard`);
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="mb-8">
          <img src={LMSLogo} alt="lmslogo" className="h-8" />
        </div>
       
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome To ODL</h1>
        <p className="text-gray-500 mb-6">Sign in your account</p>
       
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
         
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox h-4 w-4 text-purple-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <button type="button" className="text-sm text-purple-600 hover:text-purple-500">
              Forgot Password?
            </button>
          </div>
         
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        </form>
       
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Sign in with</p>
          <div className="mt-3 flex justify-center space-x-4">
            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
              <img src={fb} alt="fb" className="h-5 w-5" />
            </button>
            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
              <img src={Google} alt="google" className="h-5 w-5" />
            </button>
          </div>
        </div>
       
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?
          <button type="button" className="ml-1 text-purple-600 hover:text-purple-500">
            Sign Up
          </button>
        </p>
      </div>
     
      <div className="hidden lg:block w-1/2 ml-8">
        <img src={LogImage} alt="Login illustration" className="w-full" />
      </div>
    </div>
  );
};

export default LoginPage;
