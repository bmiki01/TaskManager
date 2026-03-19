
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  setIsAuthenticated: (val: boolean) => void;
}

export default function Navbar({ setIsAuthenticated }: NavbarProps) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
               <Link to="/projects" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                 <LayoutDashboard size={24} />
                 Task Manager
               </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, <strong>{username}</strong></span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
