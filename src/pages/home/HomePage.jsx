import HeroBanner from '../../components/home/HeroBanner';
import CategoryNav from '../../components/home/CategoryNav';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import RecentProducts from '../../components/home/RecentProducts';
import TrendingBrands from '../../components/home/TrendingBrands';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <CategoryNav />
        <FeaturedProducts />
      </div>

      <RecentProducts />

      <div className="max-w-7xl mx-auto">
        <TrendingBrands />
      </div>
    </div>
  );
};

export default HomePage;
