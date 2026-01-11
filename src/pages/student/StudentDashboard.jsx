import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal';
import MaterialsTable from '../../components/MaterialsTable';


const StudentDashboard = () => {
	const navigate = useNavigate();

	// --- States ---
	const [activeTab, setActiveTab] = useState('uploads'); // 'uploads', 'saved', 'downloads'
	const [loading, setLoading] = useState(true);

	// Data States
	const [profile, setProfile] = useState({});
	const [myUploads, setMyUploads] = useState([]);
	const [savedMaterials, setSavedMaterials] = useState([]);
	const [downloadHistory, setDownloadHistory] = useState([]);

	// Edit Profile State
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({ name: '', university: '' });

	const [showUploadModal, setShowUploadModal] = useState(false);
	const [allMaterials, setAllMaterials] = useState([]);

	// --- Helper: Auth Header ---
	const getAuthHeader = () => {
		const token = localStorage.getItem("token");
		return { headers: { Authorization: `Bearer ${token}` } };
	};

	// --- Initial Fetch ---
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate('/login');
		} else {
			fetchAllData();
		}
	}, []);

	const fetchAllData = async () => {
		try {
			setLoading(true);

			// 1. Fetch Profile
			const profileRes = await axios.get('http://localhost:8080/api/users/profile', getAuthHeader());
			setProfile(profileRes.data);
			setEditForm({ name: profileRes.data.name, university: profileRes.data.university || '' });

			// 2. Fetch My Uploads
			const uploadsRes = await axios.get('http://localhost:8080/api/users/uploads', getAuthHeader());
			setMyUploads(uploadsRes.data);

			// 3. Fetch Saved Materials
			const savedRes = await axios.get('http://localhost:8080/api/users/saved-materials', getAuthHeader());
			setSavedMaterials(savedRes.data);

			// 4. Fetch Download History
			const downloadsRes = await axios.get('http://localhost:8080/api/users/activity/downloads', getAuthHeader());
			setDownloadHistory(downloadsRes.data);

			// 5. Fetch All Approved Materials (Browse Tab)
			const allMaterialsRes = await axios.get('http://localhost:8080/api/materials');
			setAllMaterials(allMaterialsRes.data);
			setLoading(false);
		} catch (err) {
			console.error("Error loading dashboard:", err);
			// Agar 403 Forbidden aaye to login bhejo
			if (err.response && err.response.status === 403) navigate('/login');
			setLoading(false);
		}
	};

	// --- Handlers ---
	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		try {
			await axios.put('http://localhost:8080/api/users/profile', editForm, getAuthHeader());
			setProfile({ ...profile, name: editForm.name, university: editForm.university });
			setIsEditing(false);
			alert("Profile Updated! ✨");
		} catch (err) {
			console.error(err);
			alert("Failed to update profile.");
		}
	};

	const handleUnsave = async (materialId) => {
		if (!window.confirm("Remove from bookmarks?")) return;
		try {
			await axios.post(`http://localhost:8080/api/users/materials/${materialId}/save`, {}, getAuthHeader());
			// UI se turant hata do (Optimistic Update)
			setSavedMaterials(savedMaterials.filter(m => m.id !== materialId));
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) return <div className="text-center py-20 text-xl text-blue-600">Loading your profile...</div>;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] p-6 md:p-12 transition-colors">

			{/* 1. Profile Section */}
			<div className="bg-white dark:bg-[#252526] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
				{/* Avatar Placeholder */}
				<div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-100 dark:border-gray-700">
					{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
				</div>

				<div className="flex-1 text-center md:text-left w-full">
					{!isEditing ? (
						<>
							<h1 className="text-3xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
							<p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
							<p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">
								🎓 {profile.university || "Add your university"}
							</p>
							<button
								onClick={() => setIsEditing(true)}
								className="mt-4 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-[#333333] transition text-sm font-semibold"
							>
								✏️ Edit Profile
							</button>
						</>
					) : (
						<form onSubmit={handleUpdateProfile} className="max-w-md mt-2">
							<div className="mb-3">
								<label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Full Name</label>
								<input
									type="text"
									value={editForm.name}
									onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
									className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
									required
								/>
							</div>
							<div className="mb-3">
								<label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">University</label>
								<input
									type="text"
									value={editForm.university}
									onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
									className="w-full p-2 border rounded bg-gray-50 dark:bg-[#333333] dark:text-white dark:border-gray-600"
								/>
							</div>
							<div className="flex gap-2">
								<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-bold">Save</button>
								<button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm font-bold">Cancel</button>
							</div>
						</form>
					)}
				</div>

				{/* Quick Stats */}
				<div className="flex gap-8 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-8">
					<div className="text-center">
						<span className="block text-2xl font-bold text-gray-800 dark:text-white">{myUploads.length}</span>
						<span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Uploads</span>
					</div>
					<div className="text-center">
						<span className="block text-2xl font-bold text-gray-800 dark:text-white">{savedMaterials.length}</span>
						<span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Saved</span>
					</div>
				</div>
			</div>

			{/* 2. Tabs Navigation */}
			<div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex gap-8 overflow-x-auto">
				{['uploads', 'saved', 'downloads', 'browse'].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`pb-3 px-1 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === tab
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
							}`}
					>
						{tab === 'uploads' ? 'My Uploads' :
							tab === 'saved' ? 'Saved Notes' :
								tab === 'downloads' ? 'Download History' :
									'Browse All Materials'}
					</button>
				))}
			</div>

			{/* 3. Tab Content */}
			<div className="min-h-[300px]">

				{/*My Uploads Tab */}
				{activeTab === 'uploads' && (
					<div>
						{/* Upload Button */}
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white">My Contributions</h2>
							<button
								onClick={() => setShowUploadModal(true)}
								className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 font-bold flex items-center transition"
							>
								☁️ Upload New Note
							</button>
						</div>

						{/* Reusable Table Component */}
						{/* isAdmin={false} bheja hai taaki Delete ki jagah Download button dikhe */}
						<MaterialsTable
							materials={myUploads}
							isAdmin={false}
						/>
					</div>
				)}

				{/* B. Saved Materials Tab */}
				{activeTab === 'saved' && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{savedMaterials.length > 0 ? savedMaterials.map(material => (
							<div key={material.id} className="bg-white dark:bg-[#252526] p-5 rounded-lg shadow relative group hover:shadow-xl transition border border-gray-100 dark:border-gray-700">
								<h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{material.title}</h3>
								<p className="text-sm text-gray-500 mb-3">{material.subject}</p>
								<a
									href={material.fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100 transition"
								>
									View File 📄
								</a>
								<button
									onClick={() => handleUnsave(material.id)}
									className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
									title="Remove Bookmark"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
									</svg>
								</button>
							</div>
						)) : (
							<div className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-[#252526] rounded-lg">
								<p>No saved bookmarks found.</p>
							</div>
						)}
					</div>
				)}

				{/* C. Download History Tab */}
				{activeTab === 'downloads' && (
					<div className="bg-white dark:bg-[#252526] rounded-lg shadow overflow-hidden">
						<table className="w-full text-left">
							<thead className="bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300 text-xs uppercase font-semibold">
								<tr>
									<th className="px-6 py-4">Material</th>
									<th className="px-6 py-4">Subject</th>
									<th className="px-6 py-4">Downloaded At</th>
								</tr>
							</thead>
							<tbody className="text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
								{downloadHistory.length > 0 ? downloadHistory.map((log, idx) => (
									<tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition">
										<td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{log.material ? log.material.title : "Unknown File"}</td>
										<td className="px-6 py-4">{log.material ? log.material.subject : "-"}</td>
										<td className="px-6 py-4">{new Date(log.downloadTime).toLocaleString()}</td>
									</tr>
								)) : (
									<tr><td colSpan="3" className="px-6 py-8 text-center">No download history available.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* D. Browse All Materials Tab */}
				{activeTab === 'browse' && (
					<div>
						<div className="mb-4">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white">All Study Materials</h2>
							<p className="text-sm text-gray-500">Find notes from other students.</p>
						</div>

						{/* Reusing Table Component */}
						<MaterialsTable
							materials={allMaterials}
							isAdmin={false}
						/>
					</div>
				)}

			</div>
			<UploadModal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
				onUploadSuccess={fetchAllData}
			/>
		</div>
	);
};

export default StudentDashboard;