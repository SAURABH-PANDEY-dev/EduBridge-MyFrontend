import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

	
	useEffect(() => {
		const element = document.documentElement;
		if (theme === "dark") {
			element.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			element.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [theme]);

	// 3. Toggle Function
	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		
		<nav className="bg-white dark:bg-chai-card shadow-md transition-colors duration-300 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">

					{/* Logo Section */}
					<div className="flex-shrink-0 flex items-center">
						<h1 className="text-2xl font-bold text-blue-600 dark:text-chai-blue cursor-pointer">
							EduBridge
						</h1>
					</div>

					{/* Menu Links (Desktop) */}
					<div className="hidden md:flex space-x-8 items-center">
						{['Home', 'Courses', 'About Us', 'Contact'].map((item) => (
							<a
								key={item}
								href="#"
								className="text-gray-700 dark:text-chai-text hover:text-blue-600 dark:hover:text-chai-accent font-medium transition duration-300"
							>
								{item}
							</a>
						))}
					</div>

					{/* Buttons Section */}
					<div className="flex items-center space-x-4">

						{/* ☀️/🌙 Dark Mode Toggle Button */}
						<button
							onClick={toggleTheme}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 transition-all duration-300 hover:scale-110 shadow-sm"
							title="Toggle Dark Mode"
						>
							{theme === "light" ? "🌙" : "☀️"}
						</button>

						{/* Login/Signup Buttons */}
						<Link to="/login" className="text-gray-700 dark:text-chai-text hover:text-blue-600 dark:hover:text-chai-blue font-medium hidden sm:block">
							Login
						</Link>
							<Link to="/signup" className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 shadow-sm">
								Sign Up
							</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;