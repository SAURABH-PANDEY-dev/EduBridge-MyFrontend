import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
	const navigate = useNavigate();

	// State to store stats
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalMaterials: 0,
		pendingMaterials: 0,
		totalPosts: 0
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// API Call on Component Mount
	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			const token = localStorage.getItem("token");

			// Agar token nahi hai, to login pe bhejo
			if (!token) {
				navigate('/login');
				return;
			}

			const response = await axios.get('http://localhost:8080/api/admin/stats', {
				headers: {
					Authorization: `Bearer ${token}` // 👈 Header mein Token bhejna zaroori hai
				}
			});

			setStats(response.data); // Data state mein set kiya
			setLoading(false);

		} catch (err) {
			console.error("Error fetching stats:", err);
			setError("Failed to load dashboard data. Are you an Admin?");
			setLoading(false);
		}
	};

	// Stats Card Component (Design reuse ke liye)
	const StatCard = ({ title, count, color }) => (
		<div className={`p-6 rounded-lg shadow-md text-white ${color} transition-transform hover:scale-105`}>
			<h3 className="text-lg font-semibold opacity-90">{title}</h3>
			<p className="text-4xl font-bold mt-2">{count}</p>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] p-8 transition-colors duration-300">

			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
				<p className="text-gray-600 dark:text-gray-400">Welcome back, Admin</p>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			{/* Loading Spinner */}
			{loading ? (
				<div className="text-center text-blue-600 dark:text-blue-400 text-xl">Loading stats...</div>
			) : (
				/* Stats Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<StatCard title="Total Users" count={stats.totalUsers} color="bg-blue-600 dark:bg-blue-700" />
					<StatCard title="Total Materials" count={stats.totalMaterials} color="bg-green-600 dark:bg-green-700" />
					<StatCard title="Pending Requests" count={stats.pendingMaterials} color="bg-yellow-500 dark:bg-yellow-600" />
					<StatCard title="Total Posts" count={stats.totalPosts} color="bg-purple-600 dark:bg-purple-700" />
				</div>
			)}

			{/* Placeholder for future sections */}
			<div className="mt-12 text-center text-gray-500 dark:text-gray-500">
				More admin modules (Users, Approvals) coming soon...
			</div>
		</div>
	);
};

export default AdminDashboard;