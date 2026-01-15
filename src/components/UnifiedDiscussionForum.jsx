import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, getComments, votePost, deletePost } from '../api/forumApi';

const UnifiedDiscussionForum = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false); // Default false
	const [searchTerm, setSearchTerm] = useState("");

	// Comments Logic
	const [expandedPostId, setExpandedPostId] = useState(null);
	const [activeComments, setActiveComments] = useState([]);

	// 1. Check Auth on Load
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
				setUser({
					role: (payload.role || payload.roles || "STUDENT").toString().toUpperCase(),
					name: payload.sub || "User"
				});
				// ✅ Agar User hai, tabhi posts fetch karo
				fetchPosts();
			} catch (e) { setUser(null); }
		}
	}, []); // Run only once

	// 2. Fetch Function (Sirf Logged In user ke liye)
	const fetchPosts = async () => {
		setLoading(true);
		try {
			const data = await getAllPosts(searchTerm);
			setPosts(data);
		} catch (err) {
			console.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	// Search trigger (Only if user exists)
	useEffect(() => {
		if (user) fetchPosts();
	}, [searchTerm]);

	const toggleComments = async (postId) => {
		if (expandedPostId === postId) {
			setExpandedPostId(null);
			return;
		}
		setExpandedPostId(postId);
		const commentsData = await getComments(postId);
		setActiveComments(commentsData);
	};

	const handleVote = async (postId) => {
		try {
			await votePost(postId, "UPVOTE");
			fetchPosts();
		} catch (error) {
			alert("Vote failed.");
		}
	};
	// 🗑️ ADMIN DELETE LOGIC
	const handleDelete = async (postId) => {
		if (!window.confirm("⚠️ Admin Action: Delete this post permanently?")) return;

		try {
			await deletePost(postId);
			// UI se turant gayab kar do
			setPosts(posts.filter(p => p.id !== postId));
			alert("Post deleted.");
		} catch (error) {
			console.error(error);
			alert("Delete failed.");
		}
	};
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-8 transition-colors duration-300">
			<div className="max-w-4xl mx-auto px-4">

				{/* HEADER */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">Discussion Forum 💬</h1>
				</div>

				{/* 🔒 IF GUEST: SHOW LOGIN LOCK SCREEN */}
				{!user ? (
					<div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e1e1e] rounded-xl shadow border border-gray-200 dark:border-gray-800 text-center">
						<div className="text-6xl mb-4">🔒</div>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Restricted</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
							Hamare community discussions ko dekhne aur hissa lene ke liye aapko login karna padega.
						</p>
						<div className="flex gap-4">
							<button
								onClick={() => navigate('/login')}
								className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
							>
								Login Now
							</button>
							<button
								onClick={() => navigate('/signup')}
								className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
							>
								Sign Up
							</button>
						</div>
					</div>
				) : (
					/* 🔓 IF LOGGED IN: SHOW FORUM */
					<>
						{/* Search & Actions */}
						<div className="flex gap-4 mb-6">
							<input
								type="text"
								placeholder="Search..."
								className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-white"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
								+ Ask Question
							</button>
						</div>

						{/* Posts List */}
						<div className="space-y-4">
							{loading ? <p className="text-center text-gray-500">Loading Discussions...</p> :
								posts.length === 0 ? <p className="text-center text-gray-500">No posts found.</p> :
									posts.map((post) => (
										<div key={post.id} className="bg-white dark:bg-[#1e1e1e] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
											<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{post.title}</h3>
											{/* delete post button */}
											{user && user.role === 'ADMIN' && (
												<button
													onClick={() => handleDelete(post.id)}
													className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition shrink-0 ml-2"
													title="Delete Post (Admin)"
												>
													🗑️
												</button>
											)}

											<p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
											<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
												<span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
													👤 {post.userName || "Unknown User"}
												</span>
												<span>•</span>
												<span>📅 {post.creationDate ? new Date(post.creationDate).toLocaleDateString() : "Just now"}</span>
											</div>

											<div className="flex gap-4 border-t dark:border-gray-700 pt-3">
												<button onClick={() => handleVote(post.id)} className="text-blue-600 font-bold">
													👍 {post.voteCount || 0}
												</button>
												<button onClick={() => toggleComments(post.id)} className="text-gray-500">
													💬 {post.commentCount || 0} Comments
												</button>
											</div>

											{/* Comments Section */}
											{expandedPostId === post.id && (
												<div className="mt-4 bg-gray-50 dark:bg-[#2d2d2d] p-4 rounded-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
													<h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-gray-600 pb-2">
														Discussion ({activeComments.length})
													</h4>

													{activeComments.length > 0 ? (
														<div className="space-y-3">
															{activeComments.map(c => (
																<div key={c.id} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
																	<div className="flex justify-between items-center mb-1">
																		{/* ✅ Name Color Fixed */}
																		<span className="text-xs font-bold text-blue-600 dark:text-blue-400">
																			{c.userName || "User"}
																		</span>
																		{/* ✅ Date Color Fixed */}
																		<span className="text-xs text-gray-400">
																			{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
																		</span>
																	</div>
																	{/* ✅ Content Color Fixed */}
																	<p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
																		{c.content}
																	</p>
																</div>
															))}
														</div>
													) : (
														<p className="text-sm text-gray-500 dark:text-gray-400 italic">No comments yet.</p>
													)}
												</div>
											)}
										</div>
									))
							}
						</div>
					</>
				)}

			</div>
		</div>
	);
};

export default UnifiedDiscussionForum;