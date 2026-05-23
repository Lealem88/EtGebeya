import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HiOutlineHeart, HiHeart, HiOutlineMapPin, HiOutlineClock, 
  HiOutlineShieldCheck, HiOutlineChatBubbleLeftEllipsis, HiOutlineExclamationTriangle 
} from 'react-icons/hi2';
import { toast } from 'react-hot-toast';

import ProductGallery from '../../components/product/ProductGallery';
import ProductSpecs from '../../components/product/ProductSpecs';
import SimilarProducts from '../../components/product/SimilarProducts';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Rating from '../../components/common/Rating';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ReportModal from '../../components/report/ReportModal';

import productService from '../../services/productService';
import sellerService from '../../services/sellerService';
import { toggleWishlist } from '../../store/wishlistSlice';
import { formatPrice, timeAgo } from '../../utils/helpers';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlistIds } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await productService.getById(id);
        setProduct(productData);
        
        if (productData.sellerId) {
          const sellerData = await sellerService.getById(productData.sellerId);
          setSeller(sellerData);
        }
      } catch (err) {
        setError('Product not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save items');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact the seller');
      navigate('/login');
      return;
    }
    // In a real app, this would open a chat modal or navigate to messages
    toast.success('Opening chat with seller...');
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsReportModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/5">
            <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
            <div className="flex gap-4 mt-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-20 h-20 rounded-xl" />)}
            </div>
          </div>
          <div className="w-full lg:w-2/5 space-y-6">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-3/4 h-10" />
            <Skeleton className="w-1/2 h-8" />
            <Skeleton className="w-full h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          title="Product Not Found"
          description={error}
          actionLabel="Back to Home"
          actionTo="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-surface-500 mb-6">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600 transition-colors">Electronics</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${product.category}`} className="capitalize hover:text-primary-600 transition-colors">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-surface-900 dark:text-surface-300 truncate">{product.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column: Gallery & Specs */}
        <div className="w-full lg:w-3/5 flex flex-col gap-12">
          <ProductGallery images={product.images} title={product.title} />
          
          <div className="hidden lg:block">
            <ProductSpecs specs={product.specs} features={product.features} />
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-24 space-y-6">
            
            {/* Title & Price Section */}
            <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <Badge variant={product.condition === 'New' ? 'success' : 'surface'}>
                  {product.condition} Condition
                </Badge>
                <div className="flex items-center gap-2 text-surface-500 text-sm">
                  <HiOutlineClock className="w-4 h-4" />
                  {timeAgo(product.postedAt)}
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white leading-tight mb-4">
                {product.title}
              </h1>

              <div className="flex items-end justify-between mb-6 pb-6 border-b border-surface-100 dark:border-surface-800">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </p>
                <button
                  onClick={handleWishlistToggle}
                  className="p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-danger-500 transition-colors group"
                >
                  {isWishlisted ? (
                    <HiHeart className="w-7 h-7 text-danger-500" />
                  ) : (
                    <HiOutlineHeart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Description</h3>
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400 mb-8 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center shrink-0">
                  <HiOutlineMapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-0.5">Location</p>
                  <p className="font-medium text-surface-900 dark:text-white">{product.location}</p>
                </div>
              </div>

              {/* Seller Preview */}
              {seller && (
                <div className="mb-8 p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <Link to={`/seller/${seller.id}`} className="flex items-center gap-4">
                    <img 
                      src={seller.avatar} 
                      alt={seller.name} 
                      className="w-14 h-14 rounded-full object-cover border border-surface-200 dark:border-surface-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-surface-900 dark:text-white">{seller.name}</h4>
                        {seller.isVerified && (
                          <HiOutlineShieldCheck className="w-4 h-4 text-success-500" title="Verified Seller" />
                        )}
                      </div>
                      <Rating value={seller.trustScore} count={seller.totalRatings} size="sm" showValue />
                    </div>
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  icon={HiOutlineChatBubbleLeftEllipsis}
                  onClick={handleContactSeller}
                >
                  Contact Seller
                </Button>
              </div>

              {/* Report Button */}
              <div className="mt-6 text-center">
                <button 
                  onClick={handleReport}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-400 hover:text-warning-600 dark:hover:text-warning-500 transition-colors"
                >
                  <HiOutlineExclamationTriangle className="w-4 h-4" />
                  Report this listing
                </button>
              </div>
            </div>

            {/* Mobile Specs (Moved here for better mobile flow) */}
            <div className="lg:hidden block bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm mt-6">
              <ProductSpecs specs={product.specs} features={product.features} />
            </div>

          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <SimilarProducts productId={product.id} />
      
      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        productId={product.id} 
        productTitle={product.title} 
      />
    </div>
  );
};

export default ProductDetailPage;
