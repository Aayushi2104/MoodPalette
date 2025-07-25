import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-black dark:text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black dark:text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black dark:text-white">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-mood-blue text-white py-2 rounded font-semibold hover:bg-mood-purple transition-colors"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="text-center mt-4 text-sm text-black dark:text-white">
        Already have an account?{' '}
        <Link to="/login" className="text-mood-purple hover:underline">Login</Link>
      </div>
    </div>
  );
};

export default Register;
