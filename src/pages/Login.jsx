import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			// API Call
			const response = await axios.post('http://localhost:8080/api/auth/login', {
				email: formData.email,
				password: formData.password
			});

			// Response Handling
			console.log("Login Response:", response.data);
			const token = response.data.token || response.data;

			localStorage.setItem("token", token); 
			setIsLoggedIn(true);
			alert("Login Successful!");
			navigate('/');

		} catch (err) {
			console.error(err);
			setError("Invalid Email or Password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] transition-colors duration-300 px-4">
			<div className="max-w-md w-full bg-white dark:bg-[#252526] rounded-xl shadow-lg p-8 transition-colors duration-300">

				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Sign in to continue to EduBridge
					</p>
				</div>

				{error && <div className="text-red-500 text-sm text-center mb-4 bg-red-100 p-2 rounded">{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
						<input
							type="email" name="email" value={formData.email} onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							placeholder="john@example.com" required
						/>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
						<input
							type="password" name="password" value={formData.password} onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							placeholder="••••••••" required
						/>
					</div>

					{/* Login Button */}
					<button
						type="submit"
						disabled={loading}
						className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
              transition-colors`}
					>
						{loading ? 'Signing In...' : 'Sign In'}
					</button>
				</form>

				<p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
					Don't have an account?{' '}
					<Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
						Create account
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;