import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineClock, HiOutlineXMark } from 'react-icons/hi2';
import productsData from '../../data/products.json';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const q = value.toLowerCase();
      const matches = productsData
        .filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(value.length === 0 && recentSearches.length > 0);
    }
  };

  const handleSearch = (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    // Save to recent searches
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setShowDropdown(false);
    navigate(`/products?search=${encodeURIComponent(q)}`);
    if (onSearch) onSearch();
  };

  const clearRecent = (searchTerm) => {
    const updated = recentSearches.filter(s => s !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search phones, laptops, headphones..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200"
        />
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-slide-down z-50"
        >
          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-3 py-2">
                Recent Searches
              </p>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg cursor-pointer group"
                >
                  <div
                    className="flex items-center gap-3 flex-1"
                    onClick={() => { setQuery(search); handleSearch(search); }}
                  >
                    <HiOutlineClock className="w-4 h-4 text-surface-400" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">{search}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearRecent(search); }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-surface-200 dark:hover:bg-surface-600 rounded transition-all"
                  >
                    <HiOutlineXMark className="w-3 h-3 text-surface-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-3 py-2">
                Suggestions
              </p>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(`/products/${product.id}`);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-surface-500">${product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length > 1 && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-surface-500">No products found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
