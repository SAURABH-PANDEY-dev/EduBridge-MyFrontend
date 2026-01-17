import axios from 'axios';

// ✅ Base URL wahin hardcode kar diya
const BASE_URL = 'http://localhost:8080/api';

// ✅ Helper function jo har request ke liye Token header banayega
const getAuthHeaders = () => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	};
};

// 1. Get All Posts (Search & Filter)
// 1. GET ALL POSTS
export const getAllPosts = async (query = "") => {
	try {
		// 👇 ERROR YAHAN THA: '/forum' galat hai, sahi endpoint '/forum/posts' ya '/forum/search' hai
		// Documentation ke hisaab se GET Posts ke liye ye use karo:
		let url = `${BASE_URL}/forum/posts`;

		// Agar search query hai to search endpoint use kar sakte ho (Optional logic)
		if (query) {
			url = `${BASE_URL}/forum/search?query=${query}`;
		}

		// Token Header Prepare Karo
		const token = localStorage.getItem('token');
		const config = token ? {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		} : {};

		const response = await axios.get(url, config);
		return response.data;
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
};

// 2. Create a Post
export const createPost = async (postData) => {
	try {
		// postData looks like: { title: "...", content: "...", category: "..." }
		const response = await axios.post(`${BASE_URL}/forum/posts`, postData, getAuthHeaders());
		return response.data;
	} catch (error) {
		console.error("Error creating post:", error);
		throw error;
	}
};

// 3. Delete a Post (Admin or Owner)
export const deletePost = async (postId) => {
	try {
		const response = await axios.delete(`${BASE_URL}/forum/posts/${postId}`, getAuthHeaders());
		return response.data;
	} catch (error) {
		console.error("Error deleting post:", error);
		throw error;
	}
};

// 4. Vote on a Post
export const votePost = async (postId, voteType) => {
	try {
		// voteType: "UPVOTE"
		const response = await axios.post(`${BASE_URL}/forum/posts/${postId}/vote`, { voteType }, getAuthHeaders());
		return response.data;
	} catch (error) {
		console.error("Error voting:", error);
		throw error;
	}
};

// 5. Get Comments for a Post (Optional if needed explicitly)
export const getComments = async (postId) => {
	try {
		const response = await axios.get(`${BASE_URL}/forum/posts/${postId}/comments`, getAuthHeaders());
		return response.data;
	} catch (error) {
		console.error("Error fetching comments:", error);
		return [];
	}
};

// 6. Add a Comment (NEW)
export const createComment = async (commentData) => {
	try {
		// commentData: { content: "...", postId: 123 }
		const response = await axios.post(`${BASE_URL}/forum/comments`, commentData, getAuthHeaders());
		return response.data;
	} catch (error) {
		console.error("Error posting comment:", error);
		throw error;
	}
}

// 7. Mark Comment as Best Answer
export const markCommentAsAnswer = async (postId, commentId) => {
	try {
		const response = await axios.put(
			`${BASE_URL}/forum/posts/${postId}/comments/${commentId}/accept`,
			{}, // Empty body
			getAuthHeaders()
		);
		return response.data;
	} catch (error) {
		console.error("Error marking answer:", error);
		throw error;
	}
};