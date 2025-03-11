import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimeService from '../../api/fetchApi';
import BackToTop from '../../components/BackToTop';

// Custom hook for intersection observer (scroll animation) dengan threshold yang lebih rendah dan rootMargin positif untuk trigger lebih awal
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true); // Once visible, stay visible
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

const Character = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [popularCharacters, setPopularCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  // Cek ukuran layar untuk penyesuaian mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Refs for scroll animation with reduced threshold for mobile and positive rootMargin
  const [popularRef, popularVisible] = useIntersectionObserver({
    threshold: 0.05, // Lebih sensitif dari sebelumnya
    rootMargin: '50px 0px', // Trigger 50px sebelum elemen masuk viewport
  });
  
  const [allCharactersRef, allCharactersVisible] = useIntersectionObserver({
    threshold: 0.05, // Lebih sensitif dari sebelumnya
    rootMargin: '100px 0px', // Trigger 100px sebelum elemen masuk viewport
  });

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        
        // Fetch top characters
        const topCharacters = await AnimeService.getTopCharacters(20);
        
        // Get a larger set of characters for the full list
        const allCharacters = await AnimeService.getAllCharacters(50);
        
        setPopularCharacters(topCharacters?.slice(0, 8) || generateMockCharacters(8, true));
        setCharacters(allCharacters || generateMockCharacters(30));
      } catch (error) {
        console.error('Error fetching characters:', error);
        // Fallback to mock data if API fails
        setPopularCharacters(generateMockCharacters(8, true));
        setCharacters(generateMockCharacters(30));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    const delaySearch = setTimeout(async () => {
      try {
        // Search characters - Add this method to AnimeService
        const results = await AnimeService.searchCharacters(searchQuery);
        setSearchResults(results || []);
      } catch (error) {
        console.error('Error searching characters:', error);
        // Fallback to filtering local data if API fails
        const filteredResults = characters.filter(character => 
          character.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, characters]);

  // Filter characters based on active filter
  const getFilteredCharacters = () => {
    if (activeFilter === 'all') {
      return characters;
    }
    
    return characters.filter(character => {
      if (activeFilter === 'anime') {
        return character.anime && character.anime.length > 0;
      } else if (activeFilter === 'manga') {
        return character.manga && character.manga.length > 0;
      }
      return true;
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Generate mock characters when API fails
  const generateMockCharacters = (count, isPopular = false) => {
    const animeTypes = ['TV', 'Movie', 'OVA'];
    const popularNames = [
      'Luffy', 'Naruto', 'Goku', 'Eren', 'Levi', 'Mikasa', 
      'Light', 'L', 'Lelouch', 'Spike', 'Edward', 'Guts'
    ];
    const regularNames = [
      'Ichigo', 'Sasuke', 'Vegeta', 'Armin', 'Erwin', 'Annie', 
      'Misa', 'Near', 'Suzaku', 'Jet', 'Alphonse', 'Griffith',
      'Gon', 'Killua', 'Hisoka', 'Kurapika', 'Itachi', 'Kakashi',
      'Saitama', 'Genos', 'Tanjiro', 'Nezuko', 'Zenitsu', 'Inosuke'
    ];
    
    const names = isPopular ? popularNames : regularNames;
    
    return Array.from({ length: count }, (_, index) => {
      const name = names[index % names.length];
      const lastName = isPopular ? '' : String.fromCharCode(65 + index % 26);
      const fullName = isPopular ? name : `${name} ${lastName}`;
      
      const hasAnime = Math.random() > 0.2;
      const hasManga = Math.random() > 0.3;
      
      return {
        mal_id: isPopular ? (index + 1) : (100 + index),
        name: fullName,
        favorites: isPopular ? Math.floor(5000 + Math.random() * 15000) : Math.floor(500 + Math.random() * 2000),
        images: {
          jpg: {
            image_url: `https://via.placeholder.com/225x319/181925/${isPopular ? 'FF5CAA' : '84DFFF'}?text=${encodeURIComponent(fullName)}`
          }
        },
        anime: hasAnime ? [
          {
            anime: {
              mal_id: 1000 + index,
              title: `${fullName}'s Adventure`,
              type: animeTypes[index % animeTypes.length]
            }
          }
        ] : [],
        manga: hasManga ? [
          {
            manga: {
              mal_id: 2000 + index,
              title: `The Legend of ${fullName}`,
              type: 'Manga'
            }
          }
        ] : []
      };
    });
  };

  // Responsive loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 px-4">
        <div className="text-center">
          <div className="inline-block relative w-20 h-20 sm:w-24 sm:h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-l-transparent border-r-transparent border-t-purple-500 border-b-indigo-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-l-transparent border-r-transparent border-t-blue-500 border-b-cyan-500 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-l-transparent border-r-transparent border-t-indigo-500 border-b-purple-500 rounded-full animate-spin-reverse"></div>
            </div>
          </div>
          <div className="mt-6 relative">
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">
              Summoning characters...
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner - Adjusted height for better mobile experience */}
      <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080/020617/FFFFFF?text=Anime+Characters')] bg-cover bg-center"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Animated Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_80%,purple,transparent_70%)] animate-pulse opacity-30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,indigo,transparent_70%)] animate-pulse opacity-30" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Content - Improved padding and responsive text size */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 sm:mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 animate-gradient">
                Anime Characters
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-2">
              Discover your favorite heroes, villains, and everyone in between from the anime world.
            </p>
            
            {/* Search Bar - Improved mobile experience */}
            <div className="mt-4 sm:mt-6 md:mt-8 max-w-xl mx-auto px-4 sm:px-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for characters..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-black/30 backdrop-blur-sm border border-indigo-500/30 rounded-full py-2 sm:py-3 px-10 sm:px-12 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 sm:right-14 top-2.5 sm:top-3.5 text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button className="absolute right-2 sm:right-3 top-1.5 sm:top-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all text-xs sm:text-sm">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Sections - Improved spacing and padding for mobile */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Search Results Section (conditionally rendered) */}
        {isSearching && (
          <div className="mb-10 sm:mb-16 md:mb-20">
            <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">Search Results</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </h2>
              <div className="ml-4 sm:ml-6 md:ml-8 h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-2 sm:ml-4 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-blue-900/30 text-xs sm:text-sm text-blue-300 border border-blue-800/50 hover:bg-blue-800/40 transition-all duration-300 flex items-center space-x-1"
              >
                <span>Clear</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {searchResults.map((character, index) => (
                  <div 
                    key={`search-${character.mal_id || index}`}
                    className="group"
                    style={{ 
                      transitionDelay: `${isMobile ? Math.min(index * 25, 300) : index * 50}ms`, // Reduced delay on mobile
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Link to={`/character/${character.mal_id}`} className="block">
                      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img 
                            src={character.images?.jpg?.image_url || `https://via.placeholder.com/225x319/181925/FFFFFF?text=${encodeURIComponent(character.name || 'Character')}`} 
                            alt={character.name}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        </div>
                        
                        {/* Character info - Adjusted text size for better mobile readability */}
                        <div className="absolute bottom-0 w-full p-2 sm:p-3 md:p-4 bg-gradient-to-t from-gray-900/90 to-transparent">
                          <h3 className="text-white text-sm sm:text-base font-bold truncate">{character.name}</h3>
                          {character.anime && character.anime[0] && (
                            <p className="text-gray-300 text-xs truncate">
                              {character.anime[0].anime?.title || 'Unknown anime'}
                            </p>
                          )}
                        </div>
                        
                        {/* Hover overlay - Mobile friendly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                          <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white text-indigo-800 font-bold rounded-full text-xs transform scale-0 group-hover:scale-100 transition-transform duration-500">
                            View Details
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/60 rounded-lg p-4 sm:p-6 md:p-8 border border-indigo-500/20 backdrop-blur-sm text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-gray-500 mb-3 md:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-sm sm:text-base text-gray-400">We couldn't find any characters matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Popular Characters Section */}
        {!isSearching && (
          <div className="mb-10 sm:mb-16 md:mb-20" ref={popularRef}>
            <div className={`transition-all duration-1000 transform ${popularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">Popular Characters</span>
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                </h2>
                <div className="ml-4 sm:ml-6 md:ml-8 h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              </div>
              
              {/* Popular Characters Cards - Improved grid for various screen sizes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {popularCharacters.map((character, index) => (
                  <div 
                    key={`popular-${character.mal_id || index}`}
                    className="group"
                    style={{ 
                      transitionDelay: `${isMobile ? Math.min(index * 50, 400) : index * 100}ms`, // Reduced delay on mobile
                      opacity: popularVisible ? 1 : 0,
                      transform: popularVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Link to={`/character/${character.mal_id}`} className="block">
                      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
                        {/* Special highlight for popular characters */}
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                        
                        <div className="aspect-[3/4] overflow-hidden">
                          <img 
                            src={character.images?.jpg?.image_url || `https://via.placeholder.com/225x319/181925/FFFFFF?text=${encodeURIComponent(character.name || 'Character')}`} 
                            alt={character.name}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        </div>
                        
                        {/* Popularity ranking badge - Adjusted sizes for mobile */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-purple-600 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transform transition-transform duration-500 group-hover:scale-110">
                          #{index + 1}
                        </div>
                        
                        {/* Favorites count - Mobile optimized */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/50 backdrop-blur-sm text-white text-xs flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {character.favorites?.toLocaleString() || '0'}
                        </div>
                        
                        {/* Character info - Adjusted for mobile */}
                        <div className="absolute bottom-0 w-full p-2 sm:p-3 bg-gradient-to-t from-gray-900/90 to-transparent">
                          <h3 className="text-white text-xs sm:text-sm font-bold truncate">{character.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {character.anime && character.anime[0] && (
                              <span className="inline-block text-xs px-1 sm:px-1.5 py-0.5 bg-indigo-900/60 text-indigo-200 rounded-sm truncate max-w-full">
                                {character.anime[0].anime?.title}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Hover overlay - Mobile friendly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                          <div className="px-2 py-1 sm:px-4 sm:py-2 bg-white text-indigo-800 font-bold rounded-full text-xs sm:text-sm transform scale-0 group-hover:scale-100 transition-transform duration-500">
                            View Profile
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* All Characters Section - Mengembalikan animasi dengan penyesuaian */}
        {!isSearching && (
          <div className="mb-8 sm:mb-10 md:mb-12" ref={allCharactersRef}>
            <div className={`transition-all duration-700 transform ${allCharactersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">All Characters</span>
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                </h2>
                <div className="ml-4 sm:ml-6 md:ml-8 h-px flex-grow bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
              </div>
              
              {/* Filter Tabs - Improved mobile experience */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8 overflow-x-auto pb-2 hide-scrollbar">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  All Characters
                </button>
                
                <button
                  onClick={() => setActiveFilter('anime')}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                    activeFilter === 'anime'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Anime Characters
                </button>
                
                <button
                  onClick={() => setActiveFilter('manga')}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                    activeFilter === 'manga'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Manga Characters
                </button>
              </div>
              
              {/* All Characters Grid - Dengan animasi untuk mobile tapi tanpa delay yang terlalu lama */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {getFilteredCharacters().map((character, index) => (
                  <div 
                    key={`all-${character.mal_id || index}`}
                    className="group"
                    style={{ 
                      // Mengurangi delay untuk mobile dan membatasi delay maksimum
                      transitionDelay: `${isMobile ? Math.min(index * 15, 200) : Math.min(index * 30, 500)}ms`,
                      opacity: allCharactersVisible ? 1 : 0,
                      transform: allCharactersVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <Link to={`/character/${character.mal_id}`} className="block">
                      <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img 
                            src={character.images?.jpg?.image_url || `https://via.placeholder.com/225x319/181925/FFFFFF?text=${encodeURIComponent(character.name || 'Character')}`} 
                            alt={character.name}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        </div>
                        
                        {/* Character type badge - Mobile optimized */}
                        {character.anime && character.anime.length > 0 && character.manga && character.manga.length > 0 ? (
                          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-indigo-600 text-white text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full">Both</div>
                        ) : character.anime && character.anime.length > 0 ? (
                          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-blue-600 text-white text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full">Anime</div>
                        ) : character.manga && character.manga.length > 0 ? (
                          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-purple-600 text-white text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full">Manga</div>
                        ) : null}

                        {/* Character info - Smaller padding for mobile */}
                        <div className="absolute bottom-0 w-full p-1.5 sm:p-2 md:p-3 bg-gradient-to-t from-gray-900/90 to-transparent">
                          <h3 className="text-white text-xs sm:text-sm font-bold truncate">{character.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-0.5 sm:mt-1">
                            {character.anime && character.anime[0] && (
                              <span className="inline-block text-xs px-1 py-0.5 bg-indigo-900/60 text-indigo-200 rounded-sm truncate max-w-full">
                                {character.anime[0].anime?.title}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Hover overlay - Mobile friendly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                          <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white text-indigo-800 font-bold rounded-full text-xs transform scale-0 group-hover:scale-100 transition-transform duration-500">
                            View Details
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Add loading indicator if no characters are available */}
              {getFilteredCharacters().length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 bg-gray-800/40 rounded-lg border border-indigo-500/20 text-center">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full border-indigo-500 animate-spin mb-4"></div>
                  <p className="text-indigo-300 text-lg">No characters found for this filter.</p>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm transition-colors"
                  >
                    Show All Characters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination (for future implementation) - Improved touch-friendly controls */}
        {/* {!isSearching && characters.length > 20 && (
          <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
            <nav className="flex items-center gap-1 sm:gap-2">
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm sm:text-base">1</button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm sm:text-base">2</button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm sm:text-base">3</button>
              <span className="px-1 sm:px-2 text-gray-500">...</span>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm sm:text-base">10</button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )} */}
      </div>

      <BackToTop/>
    </div>
  );
};

export default Character;