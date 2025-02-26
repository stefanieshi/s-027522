
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      <div className="glass-panel rounded-full px-6 py-4 flex items-center justify-between shadow-lg backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-full"></div>
          <span className="text-xl font-semibold text-white">EveryID</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-neutral-200 hover:text-white transition-colors font-medium">Home</Link>
          <Link to="/vision" className="text-neutral-200 hover:text-white transition-colors font-medium">Our Vision</Link>
          <Link to="/solutions" className="text-neutral-200 hover:text-white transition-colors font-medium">Solutions</Link>
          <Link to="/industry-applications" className="text-neutral-200 hover:text-white transition-colors font-medium">Industry Applications</Link>
          <Link to="/future-directions" className="text-neutral-200 hover:text-white transition-colors font-medium">Future Directions</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-2 text-neutral-200 hover:text-white transition-colors font-medium">
            Log in
          </button>
          <button className="button-secondary">
            Try for Free
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden glass-panel mt-2 rounded-xl p-4 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-neutral-200 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/10 rounded-lg">Home</Link>
            <Link to="/vision" className="text-neutral-200 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/10 rounded-lg">Our Vision</Link>
            <Link to="/solutions" className="text-neutral-200 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/10 rounded-lg">Solutions</Link>
            <Link to="/industry-applications" className="text-neutral-200 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/10 rounded-lg">Industry Applications</Link>
            <Link to="/future-directions" className="text-neutral-200 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/10 rounded-lg">Future Directions</Link>
            <hr className="border-white/10" />
            <button className="text-neutral-200 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/10 rounded-lg text-left">
              Log in
            </button>
            <button className="button-secondary w-full">
              Try for Free
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
