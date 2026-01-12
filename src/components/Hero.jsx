import React from 'react';
import UnifiedMaterialSection from '../components/UnifiedMaterialSection';

const Hero = () => {
	return (

		<div className="bg-blue-600 dark:bg-chai-bg py-20 transition-colors duration-300">
			<div className="bg-gray-50 dark:bg-[#1e1e1e] min-h-screen">
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
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<UnifiedMaterialSection mode="guest" />
				</div>
			</div>
		</div >
	);
};

export default Hero;