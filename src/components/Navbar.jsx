import React from 'react';

const Navbar = () => {
	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo Section */}
					<div className="flex-shrink-0 flex items-center">
						<h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
							EduBridge
						</h1>
					</div>

					{/* Menu Links */}
					<div className="hidden md:flex space-x-8 items-center">
						<a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Home</a>
						<a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Courses</a>
						<a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">About Us</a>
						<a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">Contact</a>
					</div>

					{/* Login/Signup Buttons */}
					<div className="flex items-center space-x-4">
						<button className="text-gray-700 hover:text-blue-600 font-medium">
							Login
						</button>
						<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 shadow-sm">
							Sign Up
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;