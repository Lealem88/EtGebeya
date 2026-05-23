import { HiStar, HiOutlineStar } from 'react-icons/hi2';

/**
 * Reusable Rating Component
 */
const Rating = ({ value, count, size = 'sm', showValue = false }) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconClass = sizes[size];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-warning-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <HiStar key={i} className={iconClass} />;
          }
          if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative">
                <HiOutlineStar className={`${iconClass} text-warning-500`} />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <HiStar className={`${iconClass} text-warning-500`} />
                </div>
              </div>
            );
          }
          return <HiOutlineStar key={i} className={`${iconClass} text-surface-300 dark:text-surface-600`} />;
        })}
      </div>
      
      {(showValue || count !== undefined) && (
        <div className="flex items-center gap-1 text-sm">
          {showValue && <span className="font-medium text-surface-900 dark:text-white">{value.toFixed(1)}</span>}
          {count !== undefined && <span className="text-surface-500">({count})</span>}
        </div>
      )}
    </div>
  );
};

export default Rating;
