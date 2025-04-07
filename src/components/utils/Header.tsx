import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Cookies from 'js-cookie';
import { useState, useEffect, useRef } from 'react';
import { SearchResults } from './SearchResults';
import { fetchProducts } from '../../services/api';
import { useShop } from '../../contexts/ShopContext';
import logo from '/headerLogo.png';
import { useDebounce } from 'use-debounce';
import { Search } from 'lucide-react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { cart, wishlist } = useShop();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  // const navigate = useNavigate();
  const wishlistCount = wishlist.length;
  const [isMobile, setIsMobile] = useState(false);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const checkLoginStatus = () => {
      const authToken = Cookies.get('authToken');
      const loggedIn = Cookies.get('isLoggedIn') === 'true';
      setIsLoggedIn(authToken != null && loggedIn);
    };

    checkLoginStatus();
    // Listen for login status changes
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    // Handle clicks outside of search results to close the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   // Clear any existing timeout
  //   if (searchTimeout.current) {
  //     clearTimeout(searchTimeout.current);
  //   }

  //   if (searchTerm.trim() === '') {
  //     setSearchResults([]);
  //     setIsSearching(false);
  //     return;
  //   }

  //   setIsSearching(true);

  //   // Set a new timeout for debouncing
  //   searchTimeout.current = setTimeout(async () => {
  //     try {
  //       const data = await searchProducts(searchTerm);
  //       setSearchResults(data.products || []);
  //     } catch (error) {
  //       console.error('Error searching products:', error);
  //       setSearchResults([]);
  //     } finally {
  //       setIsSearching(false);
  //     }
  //   }, 300); // 300ms debounce

  //   return () => {
  //     if (searchTimeout.current) {
  //       clearTimeout(searchTimeout.current);
  //     }
  //   };
  // }, [searchTerm]);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  //   setShowResults(true);
  // };

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchTerm.trim()) {
  //     setSearchRedirect(`/search?q=${encodeURIComponent(searchTerm)}`);
  //     setShowResults(false);
  //   }
  // };

  // const handleResultClick = () => {
  //   setShowResults(false);
  //   setSearchTerm('');
  // };

  // const handleAccountClick = (e: React.MouseEvent) => {
  //   if (!isLoggedIn) {
  //     e.preventDefault();
  //     navigate('/login');
  //   }
  // };

  // Fetch search results when debounced query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setSearchLoading(true);
      setShowResults(true);
      try {
        const data = await fetchProducts(1, 5, debouncedQuery); // Limit to 5 results
        setSearchResults(data.products);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className=" border-2 border-b-yellow-300">
      <div className="container mx-auto px-4 py-2">
        {isMobile ? (
          <div>
            <div className="flex items-center justify-between">
              <Link to="/" className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Industrywaala Logo"
                  width={150}
                  className="h-8 w-auto"
                />
              </Link>

              <div className="flex items-center gap-4">
                <Link to="/wishlist" className="flex items-center gap-1">
                  <span className="relative">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4280ef] text-[10px] font-medium text-white flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  </span>
                  <span className="hidden md:inline">Wishlist</span>
                </Link>
                <Link to="/cart" className="flex items-center gap-1">
                  <span className="relative">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4280ef] text-[10px] font-medium text-white flex items-center justify-center">
                      {cartCount}
                    </span>
                  </span>
                  <span className="hidden md:inline">Cart</span>
                </Link>
                {isLoggedIn ? (
                  <Link to="/account" className="flex items-center gap-1">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="hidden md:inline">Account</span>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-[#4280ef] hover:bg-[#3a72d4] text-white">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="relative" ref={searchRef}>
                <form>
                  <Input
                    type="search"
                    placeholder="Search for products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                  />
                </form>
                {showResults && (
                  <SearchResults
                    query={debouncedQuery}
                    results={searchResults}
                    loading={searchLoading}
                    onClose={() => setShowResults(false)}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Industrywaala Logo"
                width={180}
                height={40}
                className="h-16 w-auto"
              />
            </Link>
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div
                className="flex-1 mx-4 relative hidden md:block"
                ref={searchRef}
              >
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search for products"
                    className="w-full pl-4 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    // onFocus={() => setShowResults(true)}
                  />
                  <div className="absolute inset-y-0 right-3 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {showResults && (
                  <SearchResults
                    query={debouncedQuery}
                    results={searchResults}
                    loading={searchLoading}
                    onClose={() => setShowResults(false)}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/wishlist" className="flex items-center gap-1">
                <span className="relative">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4280ef] text-[10px] font-medium text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                </span>
                <span className="hidden md:inline">Wishlist</span>
              </Link>
              <Link to="/cart" className="flex items-center gap-1">
                <span className="relative">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4280ef] text-[10px] font-medium text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                </span>
                <span className="hidden md:inline">Cart</span>
              </Link>
              {isLoggedIn ? (
                <Link to="/account" className="flex items-center gap-1">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="hidden md:inline">Account</span>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-[#4280ef] hover:bg-[#3a72d4] text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
