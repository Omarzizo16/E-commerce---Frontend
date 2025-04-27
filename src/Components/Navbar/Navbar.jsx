import React, { useEffect, useRef, useState , useContext } from 'react'
import logo from '../../assets/download.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext';
import { CartContext } from '../../Context/CartContext';
import { WishListContext } from '../../Context/WishListContext';
import { ThemeContext } from '../../Context/ThemeContext';
import axios from 'axios';
import Fuse from 'fuse.js';
import { jwtDecode } from 'jwt-decode';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  let { userToken, setUserToken } = useContext(UserContext);
  let { cart } = useContext(CartContext);
  let { whishList } = useContext(WishListContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  let navigate = useNavigate();
  const decoded = userToken ? jwtDecode(userToken) : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function logOut() {
    localStorage.removeItem('userToken');
    setUserToken(null);
    document.dispatchEvent(new Event('logout'));
    navigate('/login');
  }



  useEffect(() => {
    // Fetch products for search
    const getProducts = async () => {
      try {
        const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
        setProducts(data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    getProducts();


   // Click outside to close search results and search bar
   const handleClickOutside = (event) => {
    // Handle search bar click outside
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearching(false);
      setIsSearchVisible(false);
    }
    
    // Handle dropdown click outside (kept separate for clarity)
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  // Fuse.js options
  const fuseOptions = {
    keys: ['title', 'category.name', 'description', 'brand.name', 'brand.slug'],
    threshold: 0.2,
    includeScore: true
  };

  useEffect(() => {
    if (searchTerm.length >= 1 && products.length > 0) {
      const fuse = new Fuse(products, fuseOptions);
      const results = fuse.search(searchTerm)
        .slice(0, 5)
        .map(result => result.item);
      setSearchResults(results);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const searchBar = (
    <div ref={searchRef} className={`relative transition-all duration-300 ease-in-out ${isSearchVisible ? 'w-64 md:w-80' : 'w-0'}`}>
      {isSearchVisible && (
        <input
          type="text"
          className={`w-full px-4 py-2 rounded-full border-none outline-none ${theme === 'dark' ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-800'} transition-all duration-300`}
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      )}
      {isSearching && searchResults.length > 0 && (
        <div className={`absolute w-full mt-2 rounded-lg shadow-lg z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          {searchResults.map((product) => (
            <Link
              key={product.id}
              to={`/productdetails/${product.id}`}
              className={`block p-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => {
                setSearchTerm('');
                setIsSearching(false);
                setIsSearchVisible(false);
              }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{product.title}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{product.category.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      // Focus will be set by autoFocus prop when input appears
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        if (input) input.focus();
      }, 100);
    }
  };




  const userDropdown = (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        type="button"
        className="inline-flex items-center rounded-lg justify-center p-2  hover:scale-125 transition-transform duration-500 text-sm font-medium leading-none text-gray-900"
      >
        <i className="fa-solid fa-circle-user text-2xl"></i>
      </button>

      <div className={`${isDropdownOpen ? 'block' : 'hidden'} absolute right-0 z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white shadow`}>
        {userToken ? (
          <>
            <ul className="p-2 text-start text-sm font-medium text-gray-900">
              <li className="inline-block w-full items-center gap-2 rounded-md px-3 py-2 text-xl ">{decoded?.name}
                <p className='text-sm'>Welcome back</p>
              </li>
              <li><Link to="/allorders" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100">My Orders</Link></li>
            </ul>
            <div className="p-2 text-sm font-medium text-gray-900">
              <button
                onClick={() => {
                  logOut();
                  setIsDropdownOpen(false);
                }}
                className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                <i className="fa-solid fa-right-from-bracket text-red-600"></i>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div className="p-2 text-sm font-medium text-gray-900">
            <Link
              to="/login"
              className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);


  return <>

    <header className={`fixed inset-x-0 top-0 z-50 items-center transition-colors duration-300 ease-in-out ${scrolled ? 'bg-gray-100/90 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
          <nav className="flex items-center justify-between lg:gap-4 px-6 py-3 lg:px-8" aria-label="Global">
      <Link to={'home'} className="lg:pe-12">
        <img className="w-12 scale-150" src={logo} alt="logo" />
      </Link>

      <div className="hidden lg:flex lg:gap-x-6 capitalize">
        <NavLink
          to={"home"}
          className={({ isActive }) =>
            `font-bold hover:scale-125 transition-transform duration-500 text-gray-900 ${isActive ? "scale-125" : ""}`
          }
        >
          home
        </NavLink>

        <NavLink
          to={"ourproduct"}
          className={({ isActive }) =>
            `font-bold hover:scale-125 transition-transform duration-500 text-gray-900 ${isActive ? "scale-125" : ""}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to={"brands"}
          className={({ isActive }) =>
            `font-bold hover:scale-125 transition-transform duration-500 text-gray-900 ${isActive ? "scale-125" : ""}`
          }
        >
          brands
        </NavLink>
        <NavLink
          to={"categories"}
          className={({ isActive }) =>
            `font-bold hover:scale-125 transition-transform duration-500 text-gray-900 ${isActive ? "scale-125" : ""}`
          }
        >
          categories
        </NavLink>

      </div>
      <div className="flex lg:flex-1 lg:justify-end space-x-5 items-center">
          <button 
            onClick={toggleSearch} 
            className={`text-xl hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <i className="fa-solid fa-search"></i>
          </button>
          
          {searchBar}
        {userToken ?
          <>
<label className="cursor-pointer flex items-center gap-2">
  <input
    type="checkbox"
    checked={theme === 'dark'}
    onChange={toggleTheme}
    className="toggle hidden"
  />
  <span className="text-2xl">
    {theme === 'dark' ? '🌙' : '🌞'}
  </span>
</label>
            <NavLink
              to={"wishlist"}
              className={({ isActive }) =>
                `font-bold text-xl hover:scale-125 transition-transform duration-500 text-gray-900 ${isActive ? "scale-125" : ""}`
              }>
              <div className="relative flex items-center justify-center">
                <i className="fa-regular fa-heart"></i>
                <span className="absolute -top-4 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                  {whishList?.count}
                </span>
              </div>
            </NavLink>
            <NavLink
              to={"cart"}
              className={({ isActive }) =>
                `font-semibold hover:scale-125 transition-transform duration-500 text-gray-900 ${isActive ? "scale-125" : ""}`
              }>
              <div className="relative flex items-center justify-center">
                <i className="fa-solid fa-cart-shopping text-2xl"></i>
                <span className="absolute -top-4 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                  {cart?.numOfCartItems}
                </span>
              </div>
            </NavLink>
            {userDropdown}
          </>
          :
          <>
            {userDropdown}
          </>
        }
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 bg-transparent hover:bg-gray-100"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-14 left-0 w-full bg-white shadow-md rounded-lg p-4 flex flex-col gap-4 items-center capitalize transition-transform duration-300">
            <NavLink
              to="home"
              className={({ isActive }) =>
                `font-bold text-gray-900 hover:scale-110 transition-transform duration-300 ${isActive ? "scale-110" : ""}`
              }
            >
              home
            </NavLink>

            <NavLink
              to="ourproduct"
              className={({ isActive }) =>
                `font-bold text-gray-900 hover:scale-110 transition-transform duration-300 ${isActive ? "scale-110" : ""}`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="brands"
              className={({ isActive }) =>
                `font-bold text-gray-900 hover:scale-110 transition-transform duration-300 ${isActive ? "scale-110" : ""}`
              }
            >
              brands
            </NavLink>
            <NavLink
              to="categories"
              className={({ isActive }) =>
                `font-bold text-gray-900 hover:scale-110 transition-transform duration-300 ${isActive ? "scale-110" : ""}`
              }
            >
              categories
            </NavLink>

          </div>
        )}
      </div>

    </nav>
    </header>

  </>
}