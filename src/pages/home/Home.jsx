import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimeService from '../../api/fetchApi';
import BackToTopButton from '../../components/BackToTop';

// Custom hook untuk animasi pada scroll
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

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animeData, setAnimeData] = useState({
    trending: [],
    seasonal: [],
    upcoming: []
  });
  const carouselRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  
  // Refs untuk animasi pada scroll
  const [trendingRef, trendingVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px'
  });
  
  const [seasonalRef, seasonalVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px'
  });
  
  const [upcomingRef, upcomingVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px'
  });
  
 // Perubahan di useEffect untuk fetch data
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      console.log('Mengambil data anime...');
      
      const trending = await AnimeService.getTrendingAnime();
      const seasonal = await AnimeService.getSeasonalAnime();
      const upcoming = await AnimeService.getUpcomingAnime();
      
      console.log('Data trending:', trending?.length || 0, 'item');
      console.log('Data seasonal:', seasonal?.length || 0, 'item');
      console.log('Data upcoming:', upcoming?.length || 0, 'item');
      
      // Memastikan semua data adalah array
      const safeTrending = Array.isArray(trending) ? trending : [];
      const safeSeasonal = Array.isArray(seasonal) ? seasonal : [];
      const safeUpcoming = Array.isArray(upcoming) ? upcoming : [];
      
      setAnimeData({ 
        trending: safeTrending, 
        seasonal: safeSeasonal, 
        upcoming: safeUpcoming 
      });
      
      console.log('Data berhasil diset ke state');
      
    } catch (error) {
      console.error('Error saat mengambil data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchData();
}, []);
 // Fungsi autoplay untuk carousel - Always on
 useEffect(() => {
  if (animeData.trending.length > 0) {
    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % animeData.trending.length);
    }, 7000); // Increased time to 7 seconds for better viewing experience
  }
  
  return () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };
}, [animeData.trending.length]);

// Fungsi untuk mengontrol carousel
const goToSlide = (index) => {
  setActiveIndex(index);
  // Reset autoplay timer when manually navigating
  if (autoplayTimerRef.current) {
    clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % animeData.trending.length);
    }, 7000);
  }
};

// Pause autoplay when hovering on carousel
const handleMouseEnter = () => {
  if (autoplayTimerRef.current) {
    clearInterval(autoplayTimerRef.current);
  }
};

const handleMouseLeave = () => {
  autoplayTimerRef.current = setInterval(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % animeData.trending.length);
  }, 7000);
};

  // Loading state dengan animasi yang lebih menarik
  // Loading state with attractive animation that's truly full screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block relative w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-l-transparent border-r-transparent border-t-pink-500 border-b-purple-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-l-transparent border-r-transparent border-t-blue-500 border-b-cyan-500 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-l-transparent border-r-transparent border-t-purple-500 border-b-pink-500 rounded-full animate-spin-reverse"></div>
            </div>
          </div>
          <div className="mt-8 relative">
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-bold">
              Loading your anime universe
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <span className="inline-block w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-gray-900  pt-16 md:pt-0">
   {/* Hero Carousel Section - Mobile Friendly */}
   {animeData.trending.length > 0 && (
        <div 
          className="relative overflow-hidden" 
          ref={carouselRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 bg-black bg-opacity-70 overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,purple,transparent_70%)] animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,blue,transparent_70%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          {/* Carousel - Height responsive for mobile */}
          <div className="relative h-[100vh] overflow-hidden">
            {animeData.trending.map((anime, index) => (
              <div
                key={`trending-${anime.mal_id}-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-black">
                  {anime.images?.jpg?.large_image_url && (
                    <div 
                      className="absolute inset-0 opacity-40 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                        filter: 'blur(8px)',
                        transform: 'scale(1.1)'
                      }}
                    ></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
                </div>
                
                {/* Content - Mobile responsive layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-20">
                  <div className="w-full flex flex-col md:flex-row items-center justify-between">
                    {/* Left: Anime Info - Stackable on mobile */}
                    <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left md:pr-8 transform transition-all duration-1000" 
                      style={{ 
                        opacity: index === activeIndex ? 1 : 0,
                        transform: index === activeIndex ? 'translateX(0)' : 'translateX(-50px)'  
                      }}
                    >
                      <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs md:text-sm font-semibold tracking-wider">
                        FEATURED ANIME
                      </div>
                      
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                          {anime.title}
                        </span>
                      </h1>
                      
                      <p className="text-gray-300 text-sm md:text-lg max-w-xl leading-relaxed">
                        {anime.synopsis?.substring(0, 120)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {anime.genres?.slice(0, 3).map(genre => (
                          <span key={genre.mal_id} className="px-2 py-1 md:px-3 bg-purple-900/40 backdrop-blur-sm rounded-full text-purple-200 text-xs md:text-sm border border-purple-700/30 transition-all hover:bg-purple-800/40">
                            {genre.name}
                          </span>
                        ))}
                        {anime.score && (
                          <span className="px-2 py-1 md:px-3 bg-pink-900/40 backdrop-blur-sm rounded-full text-pink-200 text-xs md:text-sm border border-pink-700/30">
                            ★ {anime.score}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center md:justify-start pt-2 md:pt-4">
                        <Link 
                          to={`/anime/${anime.mal_id}`} 
                          className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-full transition-all transform hover:scale-105 hover:shadow-glow flex items-center justify-center space-x-2 group text-sm md:text-base"
                        >
                          <span>Watch Now</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                        <button className="px-6 py-3 md:px-8 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-full transition-all border border-white/20 flex items-center justify-center space-x-2 text-sm md:text-base">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          <span>Add to List</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Right: Anime Image - Responsive sizing */}
                    <div className="w-full md:w-1/2 mt-6 md:mt-0 flex justify-center items-center transform transition-all duration-1000" 
                      style={{ 
                        opacity: index === activeIndex ? 1 : 0,
                        transform: index === activeIndex ? 'translateX(0)' : 'translateX(50px)'  
                      }}
                    >
                      <Link to={`/anime/${anime.mal_id}`} className="group perspective">
                        <div className="relative transform transition-all duration-700 group-hover:rotate-y-6">
                          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-70 animate-pulse group-hover:opacity-100 transition duration-1000"></div>
                          <div className="relative aspect-[3/4] w-40 sm:w-56 md:w-64 lg:w-80 overflow-hidden rounded-xl bg-black">
                            <img 
                              src={anime.images?.jpg?.large_image_url} 
                              alt={anime.title}
                              className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                              <div className="bg-black/50 backdrop-blur-md rounded-lg p-2 md:p-3">
                                <div className="text-white font-bold text-xs md:text-sm">{anime.type || 'TV'}</div>
                                <div className="text-gray-300 text-xs">{anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Carousel Controls - Responsive positioning */}
            <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
              {animeData.trending.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    index === activeIndex
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-6 md:w-8'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Arrow Navigation - Responsive sizing and positioning */}
            <button 
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 p-1 sm:p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all opacity-70 hover:opacity-100"
              onClick={() => goToSlide((activeIndex - 1 + animeData.trending.length) % animeData.trending.length)}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 p-1 sm:p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all opacity-70 hover:opacity-100"
              onClick={() => goToSlide((activeIndex + 1) % animeData.trending.length)}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      
      {/* Content Sections with Animated Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trending Section with Horizontal Scroll */}
        <div 
          className="mb-20" 
          ref={trendingRef}
        >
          <div className={`transition-all duration-1000 transform ${trendingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">Trending Now</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              </h2>
              <div className="ml-8 h-px flex-grow bg-gradient-to-r from-pink-500/50 to-transparent"></div>
              <Link to="/top-rated" className="ml-4 px-4 py-2 rounded-full bg-purple-900/30 text-sm text-purple-300 border border-purple-800/50 hover:bg-purple-800/40 transition-all duration-300 flex items-center space-x-1">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="relative">
              <div className="relative overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex space-x-6">
                  {animeData.trending.map((anime, index) => (
                    <div 
                      key={anime.mal_id} 
                      className="flex-shrink-0 w-56 group"
                      style={{ 
                        transitionDelay: `${index * 100}ms`,
                        opacity: trendingVisible ? 1 : 0,
                        transform: trendingVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      <Link to={`/anime/${anime.mal_id}`} className="block">
                        <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-anime transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">
                          <div className="aspect-[3/4] overflow-hidden">
                            <img 
                              src={anime.images?.jpg?.image_url} 
                              alt={anime.title}
                              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                          </div>
                          
                          <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full transform transition-transform duration-500 group-hover:scale-110">
                            {anime.score ? `★ ${anime.score}` : 'NEW'}
                          </div>
                          
                          {/* Flare animation on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-1">
                            <div className="absolute -left-20 w-10 h-full bg-white/20 backdrop-blur-sm transform rotate-12 translate-x-0 -skew-x-12 group-hover:translate-x-96 transition-all duration-1000 ease-out"></div>
                          </div>
                          
                          <div className="absolute bottom-0 w-full p-4">
                            <h3 className="text-white font-bold truncate">{anime.title}</h3>
                            <div className="flex items-center text-xs mt-1 text-gray-300">
                              <span>{anime.type || 'TV'}</span>
                              <span className="mx-1">•</span>
                              <span>{anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}</span>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 to-purple-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                            <span className="px-4 py-2 bg-white text-purple-800 font-bold rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-glow">
                              Watch Now
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Left and right gradient fades */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
        
        {/* Seasonal Section with Grid Layout and Animations */}
        <div 
          className="mb-20" 
          ref={seasonalRef}
        >
          <div className={`transition-all duration-1000 transform ${seasonalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">This Season</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h2>
              <div className="ml-8 h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              <Link to="/seasonal" className="ml-4 px-4 py-2 rounded-full bg-blue-900/30 text-sm text-blue-300 border border-blue-800/50 hover:bg-blue-800/40 transition-all duration-300 flex items-center space-x-1">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {animeData.seasonal.map((anime, index) => (
                <div 
                  key={anime.mal_id} 
                  className="group"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: seasonalVisible ? 1 : 0,
                    transform: seasonalVisible ? 'translateY(0) rotate(0)' : 'translateY(20px) rotate(2deg)',
                    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <Link to={`/anime/${anime.mal_id}`} className="block">
                    <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-anime transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img 
                          src={anime.images?.jpg?.image_url} 
                          alt={anime.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                      </div>
                      
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full transform transition-transform duration-500 group-hover:scale-110">
                        {anime.score ? `★ ${anime.score}` : 'SEASONAL'}
                      </div>
                      
                      {/* Season Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md transform transition-transform duration-500 origin-left group-hover:scale-110">
                        {anime.season ? anime.season.toUpperCase() : 'CURRENT'}
                      </div>
                      
                      <div className="absolute bottom-0 w-full p-4">
                        <h3 className="text-white font-bold truncate">{anime.title}</h3>
                        <div className="flex items-center text-xs mt-1 text-gray-300">
                          <span>{anime.type || 'TV'}</span>
                          <span className="mx-1">•</span>
                          <span>{anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}</span>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-purple-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
                        <span className="px-4 py-2 bg-white text-blue-800 font-bold rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-glow">
                          Watch Now
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Upcoming Section with Futuristic 3D Card Effect */}
        <div 
          className="mb-8" 
          ref={upcomingRef}
        >
          <div className={`transition-all duration-1000 transform ${upcomingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-bold text-white relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">Coming Soon</span>
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
              </h2>
              <div className="ml-8 h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              <Link to="/upcoming" className="ml-4 px-4 py-2 rounded-full bg-indigo-900/30 text-sm text-indigo-300 border border-indigo-800/50 hover:bg-indigo-800/40 transition-all duration-300 flex items-center space-x-1">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* 3D Card Perspective Grid */}
            {/* Upcoming Cards - Design yang disesuaikan */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
  {animeData.upcoming.map((anime, index) => (
    <div 
    key={`upcoming-${anime.mal_id}-${index}`} 
      className="group"
      style={{ 
        transitionDelay: `${index * 100}ms`,
        opacity: upcomingVisible ? 1 : 0,
        transform: upcomingVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <Link to={`/anime/${anime.mal_id}`} className="block">
        <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-md hover:shadow-lg transform transition-all duration-300 group-hover:scale-105">
          <div className="aspect-[3/4] overflow-hidden">
            <img 
              src={anime.images?.jpg?.image_url} 
              alt={anime.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
          </div>
          
          {/* Badge upcoming dengan desain yang konsisten */}
          <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full transform transition-transform duration-500 group-hover:scale-110">
            UPCOMING
          </div>
          
          {/* Tahun rilis */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
            {anime.year || 'TBA'}
          </div>
          
          {/* Info overlay yang konsisten dengan card lain */}
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-white font-bold truncate">{anime.title}</h3>
            <div className="flex items-center text-xs mt-1 text-gray-300">
              <span>{anime.type || 'TV'}</span>
              <span className="mx-1">•</span>
              <span>{anime.season ? anime.season.toUpperCase() : 'Coming Soon'}</span>
            </div>
          </div>
          
          {/* Hover effect overlay - warna disesuaikan untuk upcoming */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-purple-600/80 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
            <div className="px-4 py-2 bg-white text-indigo-800 font-bold rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500">
              Coming Soon
            </div>
          </div>
        </div>
      </Link>
    </div>
  ))}
</div>
          </div>
        </div>
        
        {/* Newsletter/Follow Update Section */}
        <div className="mt-24 mb-12 bg-gradient-to-r from-purple-900/30 via-indigo-900/40 to-purple-900/30 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated with Anime Releases</h3>
              <p className="text-gray-300 max-w-lg">Get notified about new episodes, season announcements, and exclusive content for your favorite anime series.</p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-glow-sm">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center sm:text-left">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
          
          {/* Decorative Anime Icons */}
          <div className="absolute bottom-2 right-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
    <BackToTopButton/>

    </div>
  );
};

export default Home;