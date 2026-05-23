import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationTriangle, HiOutlineChartBarSquare, HiOutlineCurrencyDollar, HiOutlineArchiveBox } from 'react-icons/hi2';
import ProductCard from '../../components/product/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import sellerService from '../../services/sellerService';

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyProducts = async () => {
      try {
        const data = await sellerService.getProducts(user.id);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [isAuthenticated, navigate, user]);

  if (!user) return null;

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
          Seller Dashboard
        </h1>
        <p className="text-surface-500 mt-1">Manage your listings and view account status</p>
      </div>

      {/* Warnings & Ban Status */}
      {user.warnings > 0 && (
        <div className={`mb-8 p-6 rounded-2xl border ${
          user.isBanned 
            ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800/50' 
            : 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800/50'
        }`}>
          <div className="flex items-start gap-4">
            <HiOutlineExclamationTriangle className={`w-8 h-8 shrink-0 ${
              user.isBanned ? 'text-danger-600 dark:text-danger-500' : 'text-warning-600 dark:text-warning-500'
            }`} />
            <div>
              <h3 className={`text-lg font-bold ${
                user.isBanned ? 'text-danger-900 dark:text-danger-400' : 'text-warning-900 dark:text-warning-400'
              }`}>
                {user.isBanned ? 'Account Suspended' : 'Account Warning'}
              </h3>
              <p className={`mt-1 text-sm ${
                user.isBanned ? 'text-danger-700 dark:text-danger-500' : 'text-warning-800 dark:text-warning-500'
              }`}>
                {user.isBanned 
                  ? 'Your selling privileges have been revoked due to multiple policy violations.' 
                  : `You have received ${user.warnings} warning(s). 3 warnings will result in a ban.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
              <HiOutlineArchiveBox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Active Listings</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 rounded-xl flex items-center justify-center">
              <HiOutlineChartBarSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Items Sold</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{user.totalSold || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 rounded-xl flex items-center justify-center">
              <HiOutlineCurrencyDollar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">Total Value</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">My Active Listings</h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-64 skeleton rounded-2xl"></div>
            <div className="h-64 skeleton rounded-2xl"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all z-10">
                  <button className="px-4 py-2 bg-white text-surface-900 text-sm font-medium rounded-lg hover:bg-surface-100">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-danger-500 text-white text-sm font-medium rounded-lg hover:bg-danger-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 py-12">
            <EmptyState 
              title="No active listings" 
              description="You don't have any items for sale right now." 
              actionLabel="Post a Product"
              actionTo="/products/new"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardPage;
