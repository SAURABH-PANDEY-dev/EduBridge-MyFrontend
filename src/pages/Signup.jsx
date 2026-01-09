import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'STUDENT'
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		setLoading(true);
		setError('');

		try {
			await axios.post('http://localhost:8080/api/auth/register', {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role
			});

			alert("Registration Successful!");
			navigate('/login');

		} catch (err) {
			setError(err.response?.data?.message || "Registration Failed. Backend check karo.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] transition-colors duration-300 px-4">
			<div className="max-w-md w-full bg-white dark:bg-[#252526] rounded-xl shadow-lg p-8 transition-colors duration-300">

				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Join EduBridge to start your learning journey
					</p>
				</div>

				{error && <div className="text-red-500 text-sm text-center mb-4 bg-red-100 p-2 rounded">{error}</div>}
				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">

					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
						<input
							type="text"
							name="name"
							value={formData.fullName}
							onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
							placeholder="John Doe"
							required
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
							placeholder="john@example.com"
							required
						/>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
							placeholder="••••••••"
							required
						/>
					</div>

					{/* Confirm Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
							placeholder="••••••••"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Role</label>
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
						>
							<option value="STUDENT">Student</option>
							{/* <option value="ADMIN">Admin</option> */}
						</select>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
					>
						{loading ? 'Creating Account...' : 'Sign Up'}
					</button>
				</form>

				{/* Footer Link */}
				<p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
					Already have an account?{' '}
					<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;