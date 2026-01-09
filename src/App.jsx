import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Home Component (Navbar + Hero)
const Home = () => (
  <>
    <Hero />
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">More Content Coming Soon...</h2>
    </div>
  </>
);

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e1e] transition-colors duration-300">
    
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
      
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;