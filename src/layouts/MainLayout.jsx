import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BottomNav from '../components/navigation/BottomNav';

/**
 * MainLayout — Primary application layout with navbar and mobile bottom nav
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
