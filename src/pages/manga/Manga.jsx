import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimeService from '../../api/fetchApi';
import BackToTop from '../../components/BackToTop';

// Custom hook for scroll animation
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
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

const Manga = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('all');
  const [mangaData, setMangaData] = useState({
    popular: [],
    new: [],
    genres: [],
    genreList: []
  });
  const [featuredManga, setFeaturedManga] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAll, setShowAll] = useState(false);

  // Refs for scroll animation
  const [popularRef, popularVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px'
  });
  
  const [newReleasesRef, newReleasesVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px'
  });
  
  const [genresRef, genresVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px'
  });

  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Reset showAll when switching to desktop view
      if (window.innerWidth >= 768) {
        setShowAll(true);
      } else {
        setShowAll(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Call once to set initial state
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel using AnimeService
        const [popular, newMangas, genreList] = await Promise.all([
          AnimeService.getTopManga(10),
          AnimeService.getRecentManga(8),
          AnimeService.getMangaGenres()
        ]);
        
        // Filter main genres for manga
        const mainGenres = ['Action', 'Romance', 'Fantasy', 'Horror', 'Comedy'].map(name => {
          const genre = genreList.find(g => g.name === name);
          return genre ? { id: genre.mal_id, name: genre.name } : null;
        }).filter(Boolean);
        
        // Get manga for each genre
        const genresWithManga = await Promise.all(
          mainGenres.map(async (genre) => {
            const mangaList = await AnimeService.getMangaByGenre(genre.id, 6);
            return {
              ...genre,
              mangas: mangaList
            };
          })
        );
        
        // Set featured manga (select first popular manga)
        if (popular && popular.length > 0) {
          setFeaturedManga(popular[0]);
        }
        
        setMangaData({
          popular: popular || [],
          new: newMangas || [],
          genres: genresWithManga,
          genreList: genreList || []
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching manga data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter manga based on active genre
  const getGenreManga = () => {
    if (activeGenre === 'all') {
      return mangaData.genres.flatMap(genre => genre.mangas.slice(0, 2));
    }
    
    const genre = mangaData.genres.find(g => g.id.toString() === activeGenre);
    return genre ? genre.mangas : [];
  };

  // Display manga items based on whether "Show More" is clicked
  const displayMangaItems = (items, limit = 6) => {
    return (showAll ? items : items.slice(0, limit));
  };

  // Improved responsive loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 px-4">
        <div className="text-center">
          <div className="inline-block relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-l-transparent border-r-transparent border-t-pink-500 border-b-purple-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 border-l-transparent border-r-transparent border-t-blue-500 border-b-cyan-500 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-4 border-l-transparent border-r-transparent border-t-purple-500 border-b-pink-500 rounded-full animate-spin-reverse"></div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 relative">
            <p className="text-base sm:text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-bold">
              Loading your manga universe
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-gray-900 pt-16">
      {/* Hero Banner - Responsive height with minimum height */}
      <div className="relative w-full h-[calc(30vh+60px)] min-h-[250px] sm:h-[40vh] sm:min-h-[300px] md:h-[50vh] md:min-h-[350px] overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080/020617/FFFFFF?text=Manga+Collection')] bg-cover bg-center"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Animated Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_80%,indigo,transparent_70%)] animate-pulse opacity-30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,purple,transparent_70%)] animate-pulse opacity-30" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Content - Improved responsive text sizes and spacing */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 sm:mb-3 md:mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                Discover Manga
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              Explore the best manga from Japan and around the world. From action-packed adventures to heartwarming romances.
            </p>
            
            {/* Search Bar - Enhanced responsive sizing */}
            <div className="mt-4 sm:mt-6 md:mt-8 max-w-xl mx-auto px-3 sm:px-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for manga..."
                  className="w-full h-10 sm:h-12 bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-full py-2 px-4 pl-10 sm:pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
                />
                <button className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="absolute right-2 sm:right-3 top-1.5 sm:top-2 h-7 sm:h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all text-xs">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Sections - Enhanced responsive spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
        {/* Popular Manga Section - FIXED */}
        <div className="mb-10 sm:mb-12 md:mb-16" ref={popularRef}>
          <div className={`transition-all duration-1000 transform ${popularVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-5 sm:mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Popular Manga</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </h2>
              <div className="ml-4 sm:ml-8 h-px flex-grow bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
              <Link 
                to="/popular" 
                className="ml-3 sm:ml-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-900/30 text-xs sm:text-sm text-indigo-300 border border-indigo-800/50 hover:bg-indigo-800/40 transition-all duration-300 flex items-center space-x-1"
              >
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* Popular Manga Cards - Fixed grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {displayMangaItems(mangaData.popular, isMobile ? 6 : 10).map((manga, index) => (
                <div 
                  key={manga.mal_id || `popular-manga-${index}`} 
                  className="group"
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    opacity: popularVisible ? 1 : 0,
                    transform: popularVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <Link to={`/manga/${manga.mal_id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img 
                          src={manga.images?.jpg?.image_url || `https://via.placeholder.com/225x319/181925/FFFFFF?text=${encodeURIComponent(manga.title || 'Popular Manga')}`} 
                          alt={manga.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                      </div>
                      
                      {/* Rating badge */}
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full transform transition-transform duration-500 group-hover:scale-110">
                        {manga.score ? `★ ${manga.score}` : 'NEW'}
                      </div>
                      
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md">
                        {manga.status || 'Ongoing'}
                      </div>
                      
                      {/* Card content */}
                      <div className="absolute bottom-0 w-full p-2 sm:p-3 bg-gradient-to-t from-gray-900/90 to-transparent">
                        <h3 className="text-white text-xs sm:text-sm font-bold truncate">{manga.title}</h3>
                        <p className="text-gray-300 text-xs truncate">
                          {manga.authors && manga.authors.length > 0 
                            ? manga.authors[0].name 
                            : 'Unknown author'}
                        </p>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-purple-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-indigo-800 font-bold rounded-full text-xs transform scale-0 group-hover:scale-100 transition-transform duration-500">
                          Read Now
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Mobile "Show More" button */}
            {isMobile && mangaData.popular.length > 6 && !showAll && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowAll(true)} 
                  className="inline-block px-4 py-2 bg-indigo-900/50 text-indigo-300 border border-indigo-800/50 rounded-full text-sm hover:bg-indigo-800/40 transition-all"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* New Releases Section - FIXED */}
        <div className="mb-10 sm:mb-12 md:mb-16" ref={newReleasesRef}>
          <div className={`transition-all duration-1000 transform ${newReleasesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-5 sm:mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">New Releases</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </h2>
              <div className="ml-4 sm:ml-8 h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              <Link 
                to="/new" 
                className="ml-3 sm:ml-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-900/30 text-xs sm:text-sm text-blue-300 border border-blue-800/50 hover:bg-blue-800/40 transition-all duration-300 flex items-center space-x-1"
              >
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* New Releases Manga Cards - Fixed Horizontal Scrollable */}
            <div className="relative">
              <div className="relative overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex space-x-3 sm:space-x-4 md:space-x-6">
                  {mangaData.new.map((manga, index) => (
                    <div 
                      key={manga.mal_id || `new-manga-${index}`} 
                      className="flex-shrink-0 w-36 sm:w-44 md:w-52 group"
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        opacity: newReleasesVisible ? 1 : 0,
                        transform: newReleasesVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      <Link to={`/manga/${manga.mal_id}`} className="block">
                        <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
                          <div className="aspect-[3/4] overflow-hidden">
                            <img 
                              src={manga.images?.jpg?.image_url || `https://via.placeholder.com/225x319/181925/FFFFFF?text=${encodeURIComponent(manga.title || 'New Manga')}`} 
                              alt={manga.title}
                              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                          </div>
                          
                          {/* Badges */}
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full transform transition-transform duration-500 group-hover:scale-110">
                            NEW
                          </div>
                          
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-md transform transition-transform duration-500 origin-left group-hover:scale-110">
                            {manga.volumes ? `Vol ${manga.volumes}` : manga.chapters ? `Ch ${manga.chapters}` : 'New'}
                          </div>
                          
                          {/* Card content */}
                          <div className="absolute bottom-0 w-full p-2 sm:p-3 bg-gradient-to-t from-gray-900/90 to-transparent">
                            <h3 className="text-white text-xs sm:text-sm font-bold truncate">{manga.title}</h3>
                            <p className="text-gray-300 text-xs truncate">
                              {manga.authors && manga.authors.length > 0 
                                ? manga.authors[0].name
                                : 'Unknown author'}
                            </p>
                          </div>
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                            <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-blue-800 font-bold rounded-full text-xs transform scale-0 group-hover:scale-100 transition-transform duration-500">
                              Read Latest
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Left and right gradient fades */}
              <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
        
        {/* Genres Section - FIXED */}
        <div className="mb-8 sm:mb-10 md:mb-12" ref={genresRef}>
          <div className={`transition-all duration-1000 transform ${genresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Browse by Genre</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </h2>
              <div className="ml-4 sm:ml-8 h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
            </div>
            
            {/* Genre Tabs - Fixed scrollable tabs */}
            <div className="flex gap-2 mb-5 sm:mb-6 md:mb-8 overflow-x-auto pb-2 hide-scrollbar">
              <button
                onClick={() => setActiveGenre('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                  activeGenre === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                All Genres
              </button>
              
              {mangaData.genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setActiveGenre(genre.id.toString())}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${activeGenre === genre.id.toString()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            
            {/* Genre Manga Grid - Fixed grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {displayMangaItems(getGenreManga(), isMobile ? 6 : 12).map((manga, index) => (
                <div 
                  key={`${manga.mal_id}-${index}`} 
                  className="group"
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    opacity: genresVisible ? 1 : 0,
                    transform: genresVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <Link to={`/manga/${manga.mal_id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img 
                          src={manga.images?.jpg?.image_url || `https://via.placeholder.com/225x319/181925/FFFFFF?text=${encodeURIComponent(manga.title || 'Manga')}`} 
                          alt={manga.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                      </div>
                      
                      {/* Rating badge */}
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full transform transition-transform duration-500 group-hover:scale-110">
                        {manga.score ? `★ ${manga.score}` : 'N/A'}
                      </div>
                      
                      {/* Genre Tags */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {manga.genres && manga.genres.length > 0 ? (
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-md truncate max-w-[100px]">
                            {manga.genres[0].name}
                          </span>
                        ) : null}
                      </div>
                      
                      {/* Card content */}
                      <div className="absolute bottom-0 w-full p-2 sm:p-3 bg-gradient-to-t from-gray-900/90 to-transparent">
                        <h3 className="text-white font-bold text-xs sm:text-sm truncate">{manga.title}</h3>
                        <p className="text-gray-300 text-xs truncate">
                          {manga.authors && manga.authors.length > 0 
                            ? manga.authors[0].name 
                            : 'Unknown author'}
                        </p>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-pink-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-purple-800 font-bold rounded-full text-xs transform scale-0 group-hover:scale-100 transition-transform duration-500">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Show More for genres on mobile */}
            {isMobile && getGenreManga().length > 6 && !showAll && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowAll(true)} 
                  className="inline-block px-4 py-2 bg-purple-900/50 text-purple-300 border border-purple-800/50 rounded-full text-sm hover:bg-purple-800/40 transition-all"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Manga Section */}
        <div className="mt-10 sm:mt-12 md:mt-16 mb-8 sm:mb-10 md:mb-12">
          <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/40 to-purple-900/30 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute -top-24 -right-24 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-32 -left-12 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Featured Manga Cover */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="relative max-w-[200px] sm:max-w-xs mx-auto md:mx-0 aspect-[3/4] overflow-hidden rounded-lg shadow-xl group">
                  {featuredManga && featuredManga.images ? (
                    <img 
                      src={featuredManga.images.jpg.large_image_url || featuredManga.images.jpg.image_url}
                      alt={featuredManga.title} 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <img 
                      src="https://via.placeholder.com/300x450/181925/FFFFFF?text=Featured+Manga"
                      alt="Featured Manga" 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold py-0.5 px-2 rounded-full">
                    Featured
                  </div>
                </div>
              </div>
              
              {/* Featured Manga Info */}
              <div className="md:w-2/3 lg:w-3/4 flex flex-col justify-center mt-4 md:mt-0">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  {featuredManga ? featuredManga.title : 'Loading...'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {featuredManga && featuredManga.authors && featuredManga.authors.length > 0
                    ? `By ${featuredManga.authors.map(author => author.name).join(', ')}`
                    : featuredManga ? 'Unknown Author' : 'Loading...'}
                </p>
                
                <div className="flex flex-wrap gap-2 my-4">
                  {featuredManga && featuredManga.genres
                    ? featuredManga.genres.slice(0, isMobile ? 3 : 5).map((genre, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-900/40 backdrop-blur-sm rounded-full text-purple-200 text-xs border border-purple-700/30">
                          {genre.name}
                        </span>
                      ))
                    : <span className="px-3 py-1 bg-purple-900/40 backdrop-blur-sm rounded-full text-purple-200 text-xs border border-purple-700/30">
                        Loading genres...
                      </span>
                  }
                  {featuredManga && featuredManga.score && (
                    <span className="px-3 py-1 bg-pink-900/40 backdrop-blur-sm rounded-full text-pink-200 text-xs border border-pink-700/30">
                      ★ {featuredManga.score}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-6 text-sm sm:text-base md:text-base line-clamp-3 md:line-clamp-none">
                  {featuredManga ? featuredManga.synopsis || 'No synopsis available.' : 'Loading synopsis...'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link to={`/manga/${featuredManga ? featuredManga.mal_id : ''}`} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-full transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl text-sm">
                    <span>Read Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-full transition-all border border-white/20 flex items-center justify-center space-x-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span>Add to Library</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     <BackToTop/>
    </div>
  );
};

export default Manga;