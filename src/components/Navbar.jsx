import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Get current route location
  
  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-purple-900/90 backdrop-blur-lg shadow-lg shadow-pink-500/20' : 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
<div className="flex-shrink-0 flex items-center">
  <div className="flex items-center group relative">
    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
    <div className="h-14 w-14 relative flex justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-indigo-600 rounded-lg shadow-xl"></div>
      <div className="absolute inset-0.5 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-md"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PHBhdGggZD0iTS0xMCAxMCBMMyAtMTAgTTAgMjAgTDIwIDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30 rounded-lg mix-blend-overlay"></div>
      
      {/* Custom Sake Bottle SVG */}
      <svg viewBox="0 0 36 36" className="h-9 w-9 text-pink-300 relative">
        <defs>
          <linearGradient id="sake-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <radialGradient id="sake-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Sake bottle shape */}
        <path fill="url(#sake-gradient)" d="M18,3.5c-1.1,0-2,0.9-2,2v2c0,0.3,0.1,0.6,0.2,0.9l1.8,3.6l1.8-3.6c0.1-0.3,0.2-0.6,0.2-0.9v-2C20,4.4,19.1,3.5,18,3.5z" />
        <path fill="url(#sake-gradient)" d="M22,12.5c0,0,0-1-4-1s-4,1-4,1l-2,15c0,0-0.5,5,6,5s6-5,6-5L22,12.5z" />
        
        {/* Sake cup */}
        <path fill="url(#sake-gradient)" d="M27,24c0,0-1-2-2-2s-4,1-4,1s-2,1-2,3s1,4,3,4s5-2,5-6z" />
        
        {/* Kanji overlay */}
        <text x="13.5" y="21" fill="white" fontSize="6px" fontWeight="bold" opacity="0.9">酒</text>
        
        {/* Liquid splash animation */}
        <circle cx="18" cy="18" r="3" fill="url(#sake-glow)" opacity="0.6">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Cherry blossom accent */}
        <path fill="#F472B6" d="M28,10c-0.6,0-1.1,0.2-1.5,0.5C26.2,9.8,25.6,9,24.5,9c-0.5,0-1,0.2-1.3,0.5c0,0,0-0.1,0-0.1c0-1.1-0.9-2-2-2c-1.1,0-2,0.9-2,2c0,0,0,0.1,0,0.1C18.9,9.2,18.5,9,18,9c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2c0.5,0,1-0.2,1.3-0.5c0,0,0,0.1,0,0.1c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2c0,0,0-0.1,0-0.1c0.3,0.3,0.8,0.5,1.3,0.5c1.1,0,2-0.9,2-2c0-0.5-0.2-1-0.5-1.3c0.3-0.3,0.5-0.8,0.5-1.3C30,10.9,29.1,10,28,10z">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
      
      {/* Anime flare accent */}
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center transform -rotate-12 animate-pulse">
        <span className="text-white text-xs font-bold">酒</span>
      </div>
    </div>
    <div className="ml-4 font-bold text-3xl relative z-10">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 tracking-wider group-hover:tracking-widest transition-all duration-500">
        Sake<span className="text-white">desu</span>
      </span>
      <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
    <div className="absolute -bottom-2 left-0 w-20 h-10 bg-pink-500/30 blur-xl rounded-full"></div>
  </div>
</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* Changed from hardcoded active to dynamic */}
              <NavLink to="/" title="Anime" active={isActive('/')}>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 17a5 5 0 100-10 5 5 0 000 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
                </svg>
                Anime
              </NavLink>
              
              <NavLink to="/manga" title="Manga" active={isActive('/manga')}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Manga
              </NavLink>
              
              <NavLink to="/characters" title="Characters" active={isActive('/character')}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Characters
              </NavLink>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="hidden md:block">
            <div className="flex items-center">
              <div className="relative group">
                <input
                  type="text"
                  className="bg-purple-800/30 text-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-purple-700/50 w-40 transition-all duration-300 group-hover:w-52 focus:w-64 backdrop-blur-sm placeholder-purple-300/70"
                  placeholder="Search anime..."
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-4 w-4 text-pink-400 group-hover:text-pink-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-pink-300 hover:text-white hover:bg-purple-700 focus:outline-none transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-all duration-500`}>
        <div className="px-4 pt-3 pb-4 space-y-3 sm:px-6 bg-gradient-to-b from-indigo-900/90 to-purple-900/90 backdrop-blur-md border-t border-indigo-700/30">
          {/* Changed from hardcoded active to dynamic */}
          <MobileNavLink to="/" title="Anime" active={isActive('/')}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17a5 5 0 100-10 5 5 0 000 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
            </svg>
            Anime
          </MobileNavLink>
          
          <MobileNavLink to="/manga" title="Manga" active={isActive('/manga')}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Manga
          </MobileNavLink>
          
          <MobileNavLink to="/characters" title="Characters" active={isActive('/character')}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Characters
          </MobileNavLink>
          
          {/* Mobile Search */}
          <div className="pt-2 relative mx-1">
            <input
              type="text"
              className="w-full bg-purple-800/30 text-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-purple-700/50 placeholder-purple-300/70"
              placeholder="Search anime..."
            />
            <div className="absolute left-3 top-4.5">
              <svg className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cool anime-style effects for aesthetics */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-16 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-3 left-1/4 w-1 h-1 bg-pink-500 animate-ping opacity-75 rounded-full delay-150"></div>
        <div className="absolute top-10 left-1/3 w-1 h-1 bg-blue-500 animate-ping opacity-75 rounded-full delay-300"></div>
        <div className="absolute top-4 left-2/3 w-1 h-1 bg-purple-500 animate-ping opacity-75 rounded-full delay-75"></div>
        <div className="absolute top-12 left-3/4 w-1 h-1 bg-indigo-500 animate-ping opacity-75 rounded-full delay-200"></div>
        
        {/* Light streaks */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-5 right-1/4 w-24 h-px bg-pink-500/20 rotate-45 blur-sm"></div>
          <div className="absolute top-8 right-1/3 w-32 h-px bg-indigo-500/30 -rotate-12 blur-sm"></div>
          <div className="absolute top-2 left-1/5 w-16 h-px bg-purple-500/20 rotate-12 blur-sm"></div>
        </div>
        
        {/* Glowing accent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent blur-sm"></div>
      </div>
      
      {/* Sakura petal animation - subtle floating elements */}
      <div className="hidden md:block absolute top-0 right-0 w-full h-16 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-10 w-3 h-3 opacity-20">
          <svg className="animate-float-slow" fill="currentColor" viewBox="0 0 24 24">
            <path fill="url(#sakura-gradient)" d="M12,2C9.8,2,7.9,3.1,6.7,4.5C5.4,3.4,3.9,2.7,2.2,2.5C2.1,2.5,2,2.6,2,2.7C1.9,4.3,2.3,5.8,3.1,7.1C1.3,8.9,0.2,11.3,0.2,14c0,0.1,0.1,0.2,0.2,0.2c1.8,0.1,3.5-0.4,4.9-1.3c0.6,1.6,1.6,3,3,4c-0.1,1.8,0.4,3.5,1.3,4.9c0.1,0.1,0.2,0.1,0.3,0C11.5,21,12.5,20,13,18.8c1.4,0.9,3.1,1.4,4.9,1.3c0.1,0,0.2-0.1,0.2-0.2c0.1-1.8-0.4-3.5-1.3-4.9c1.6-0.6,3-1.6,4-3c1.8,0.1,3.5-0.4,4.9-1.3c0.1-0.1,0.1-0.2,0-0.3c-0.9-1.7-2.5-2.9-4.3-3.3c0.3-1.7,0-3.4-0.8-4.9c-0.1-0.1-0.2-0.1-0.3,0c-1.5,1-2.7,2.5-3.1,4.3C16.5,5.7,14.9,4.6,13,4.3c-0.1,0-0.2,0.1-0.2,0.2C12.7,6.3,13.1,8,14,9.3C13.1,10.1,12.5,11.2,12,12.4z"></path>
            <defs>
              <linearGradient id="sakura-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FF9BE8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-5 right-40 w-2 h-2 opacity-10">
          <svg className="animate-float" fill="currentColor" viewBox="0 0 24 24">
            <path fill="url(#sakura-gradient)" d="M12,2C9.8,2,7.9,3.1,6.7,4.5C5.4,3.4,3.9,2.7,2.2,2.5C2.1,2.5,2,2.6,2,2.7C1.9,4.3,2.3,5.8,3.1,7.1C1.3,8.9,0.2,11.3,0.2,14c0,0.1,0.1,0.2,0.2,0.2c1.8,0.1,3.5-0.4,4.9-1.3c0.6,1.6,1.6,3,3,4c-0.1,1.8,0.4,3.5,1.3,4.9c0.1,0.1,0.2,0.1,0.3,0C11.5,21,12.5,20,13,18.8c1.4,0.9,3.1,1.4,4.9,1.3c0.1,0,0.2-0.1,0.2-0.2c0.1-1.8-0.4-3.5-1.3-4.9c1.6-0.6,3-1.6,4-3c1.8,0.1,3.5-0.4,4.9-1.3c0.1-0.1,0.1-0.2,0-0.3c-0.9-1.7-2.5-2.9-4.3-3.3c0.3-1.7,0-3.4-0.8-4.9c-0.1-0.1-0.2-0.1-0.3,0c-1.5,1-2.7,2.5-3.1,4.3C16.5,5.7,14.9,4.6,13,4.3c-0.1,0-0.2,0.1-0.2,0.2C12.7,6.3,13.1,8,14,9.3C13.1,10.1,12.5,11.2,12,12.4z"></path>
          </svg>
        </div>
      </div>
    </nav>
  );
};

// Component for desktop navigation links
const NavLink = ({ children, title, to, active = false }) => {
  return (
    <Link
      to={to}
      className={`px-5 py-2.5 rounded-md text-base font-medium flex items-center relative group overflow-hidden ${
        active
          ? 'text-white bg-gradient-to-r from-purple-800/50 to-indigo-900/50'
          : 'text-purple-200 hover:text-white hover:bg-purple-800/20'
      } transition-all duration-300`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-300 group-hover:w-full ${active ? 'w-full' : ''}`}></span>
      <span className="absolute inset-0 rounded-md bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
    </Link>
  );
};

// Component for mobile navigation links
const MobileNavLink = ({ children, title, to, active = false }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-md text-base font-medium ${
        active
          ? 'bg-gradient-to-r from-purple-800/80 to-indigo-900/80 text-white border-l-4 border-pink-500'
          : 'text-purple-200 hover:bg-purple-800/30 hover:text-white hover:border-l-4 hover:border-pink-500/70'
      } transition-all duration-200`}
    >
      {children}
    </Link>
  );
};

// CSS animations for floating elements
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes float {
    0% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-10px) rotate(5deg); }
    100% { transform: translateY(0) rotate(0); }
  }
  
  @keyframes float-slow {
    0% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-15px) rotate(-5deg); }
    100% { transform: translateY(0) rotate(0); }
  }
     .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-float-slow {
    animation: float-slow 12s ease-in-out infinite;
  }
`;
document.head.appendChild(floatStyle);

export default Navbar;