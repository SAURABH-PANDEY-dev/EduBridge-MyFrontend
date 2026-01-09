import React from 'react';

const Hero = () => {
	return (
		// dark:bg-chai-bg = Jab dark mode ho, tab background chai-bg (black/grey) ho jaye
		<div className="bg-blue-600 dark:bg-chai-bg py-20 transition-colors duration-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

				{/* Main Heading */}
				<h1 className="text-4xl font-bold text-white dark:text-chai-text sm:text-5xl md:text-6xl">
					Learn, Grow, and Succeed with <span className="text-yellow-300 dark:text-chai-blue">EduBridge</span>
				</h1>

				{/* Sub Heading */}
				<p className="mt-6 text-xl text-blue-100 dark:text-gray-400 max-w-2xl mx-auto">
					Your centralized platform for BCA notes, projects, and expert guidance.
					Everything you need to ace your exams is right here.
				</p>

				{/* Buttons */}
				<div className="mt-10 flex justify-center gap-4">
					<button className="bg-white dark:bg-chai-blue text-blue-600 dark:text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-blue-600 transition duration-300 shadow-lg">
						Get Started
					</button>

					<button className="border-2 border-white dark:border-chai-blue text-white dark:text-chai-blue px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 dark:hover:bg-chai-blue dark:hover:text-white transition duration-300">
						Learn More
					</button>
				</div>

			</div>
		</div>
	);
};

export default Hero;