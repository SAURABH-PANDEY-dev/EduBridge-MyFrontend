import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, getComments, votePost, deletePost, createComment, markCommentAsAnswer } from '../api/forumApi';
import CreatePostModal from './CreatePostModal';

const UnifiedDiscussionForum = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false); // Default false
	const [searchTerm, setSearchTerm] = useState("");
	const [showPostModal, setShowPostModal] = useState(false);

	// Comments Logic
	const [expandedPostId, setExpandedPostId] = useState(null);
	const [activeComments, setActiveComments] = useState([]);
	// FOR COMMENT INPUT
	const [newComment, setNewComment] = useState("");
	const [submitting, setSubmitting] = useState(false);

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
	// Handle Comment Submit
	const handlePostComment = async (postId) => {
		if (!newComment.trim()) return; // Empty comment mat bhejo
		setSubmitting(true);

		try {
			// 1. API Call
			await createComment({ content: newComment, postId: postId });

			// 2. Refresh Comments
			const updatedComments = await getComments(postId);
			setActiveComments(updatedComments);

			// 3. Clear Input
			setNewComment("");

			// Optional: Update post comment count locally (User experience ke liye)
			setPosts(posts.map(p =>
				p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
			));

		} catch (error) {
			alert("Failed to post comment.");
		} finally {
			setSubmitting(false);
		}
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
	// Handle Mark as Answer
	const handleMarkAsAnswer = async (postId, commentId) => {
		if (!window.confirm("Mark this as the correct answer?")) return;

		try {
			await markCommentAsAnswer(postId, commentId);

			// UI Update: Local state mein us comment ko 'accepted' true kar do
			setActiveComments(activeComments.map(c =>
				c.id === commentId ? { ...c, isAccepted: true } : { ...c, isAccepted: false } // Baaki sab false, ye true
			));

			alert("Answer marked successfully! ✅");
		} catch (error) {
			console.error(error);
			alert("Failed to mark answer.");
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
							<button onClick={() => setShowPostModal(true)}
								className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
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

													{/* COMMENT INPUT BOX */}
													<div className="flex gap-2 mb-4">
														<input
															type="text"
															placeholder="Write a reply..."
															className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-[#333] text-sm outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-white"
															value={newComment}
															onChange={(e) => setNewComment(e.target.value)}
															onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)} // Enter dabane pe send
														/>
														<button
															onClick={() => handlePostComment(post.id)}
															disabled={submitting || !newComment.trim()}
															className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
														>
															{submitting ? "..." : "Reply"}
														</button>
													</div>

													{/* Comments List */}
													{activeComments.length > 0 ? (
														<div className="space-y-3">
															{activeComments.map(c => {
																// 👇 LOGIC: Check karo ki User Admin hai ya Post ka Owner hai
																const isOwner = user && user.name === post.userName; // Post Owner check
																const isAdmin = user && user.role === 'ADMIN';       // Admin check
																const canMarkAnswer = isOwner || isAdmin;

																return (
																	<div
																		key={c.id}
																		className={`border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 p-3 rounded-lg transition
                        ${c.isAccepted ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800" : ""}
                    `}
																	>
																		<div className="flex justify-between items-start">

																			{/* Comment Content */}
																			<div className="flex-1">
																				<div className="flex justify-between items-center mb-1">
																					<span className="text-xs font-bold text-blue-600 dark:text-blue-400">
																						{c.userName || "User"}
																						{c.isAccepted && <span className="ml-2 text-green-600 font-bold text-xs">✅ BEST ANSWER</span>}
																					</span>
																					<span className="text-xs text-gray-400">
																						{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
																					</span>
																				</div>
																				<p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
																					{c.content}
																				</p>
																			</div>

																			{/* 👇 ACTION BUTTON (Sirf agar Post Owner/Admin ho aur Answer abhi tak accepted na ho) */}
																			{canMarkAnswer && !c.isAccepted && (
																				<button
																					onClick={() => handleMarkAsAnswer(post.id, c.id)}
																					className="ml-3 text-gray-400 hover:text-green-600 transition"
																					title="Mark as Correct Answer"
																				>
																					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
																					</svg>
																				</button>
																			)}

																			{/* Agar already accepted hai to Green Tick dikhao */}
																			{c.isAccepted && (
																				<div className="ml-3 text-green-500" title="Accepted Answer">
																					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
																						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
																					</svg>
																				</div>
																			)}
																		</div>
																	</div>
																);
															})}
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
			{/* 👇 ADD MODAL HERE */}
			<CreatePostModal
				isOpen={showPostModal}
				onClose={() => setShowPostModal(false)}
				onSuccess={() => {
					fetchPosts(); // Post banne ke baad list refresh hogi
				}}
			/>
		</div>
	);
};

export default UnifiedDiscussionForum;