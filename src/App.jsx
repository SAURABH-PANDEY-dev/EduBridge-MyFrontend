import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero /> 

      {/* Temporary Content */}
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">More Content Coming Soon...</h2>
      </div>
    </div>
  )
}

export default App