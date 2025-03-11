import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AnimeService from '../../api/fetchApi';

const DetailManga = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [relatedManga, setRelatedManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setIsLoading(true);
        // Use the manga-specific API method
        const data = await AnimeService.getMangaDetails(id);
        setManga(data);
        
        // Fetch related manga
        if (data && data.mal_id) {
          const related = await AnimeService.getRelatedManga(data.mal_id);
          setRelatedManga(related);
        }
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching manga details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative w-24 h-24">
            <div className="absolute w-full h-full rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
            <div className="absolute w-full h-full rounded-full border-r-4 border-l-4 border-purple-500 animate-spin animate-pulse"></div>
          </div>
          <p className="mt-6 text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">Loading manga details...</p>
        </div>
      </div>
    );
  }

  // if (!manga) {
  //   return (
  //     <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
  //       <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
  //         <h2 className="text-2xl font-bold text-white mb-4">Manga Not Found</h2>
  //         <p className="text-gray-300 mb-6">Sorry, we couldn't find the manga you're looking for.</p>
  //         <Link to="/" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full transition-all transform hover:scale-105">
  //           Return Home
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950/30 to-gray-900 overflow-hidden">
      {/* Floating Animation Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[10%] top-[20%] w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl animate-float"></div>
        <div className="absolute right-[10%] top-[40%] w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute left-[25%] bottom-[10%] w-72 h-72 rounded-full bg-blue-600/10 blur-3xl animate-float animation-delay-2000"></div>
      </div>

      {/* Hero Banner */}
      <div className="relative z-10">
        {/* Background Image */}
        <div className="absolute inset-0 h-[600px] sm:h-[650px] md:h-[700px] overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-filter backdrop-blur-sm"></div>
          <img 
            src={manga.images?.jpg?.large_image_url} 
            alt={manga.title}
            className="w-full h-full object-cover opacity-30"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="sparkles-container">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className="sparkle" 
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    width: `${Math.random() * 5 + 1}px`,
                    height: `${Math.random() * 5 + 1}px`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-24 md:pt-32 pb-12">
          {/* Back Button */}
          <Link to="/manga" className="inline-flex items-center text-gray-300 hover:text-white mb-6 group transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Manga
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Manga Cover and Info */}
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={manga.images?.jpg?.large_image_url} 
                    alt={manga.title}
                    className="w-full h-auto"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg flex items-center justify-center transition-all transform hover:scale-105 hover:shadow-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Read Now
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center justify-center border border-indigo-500/30 transition-all hover:border-indigo-500/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Add to Library
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
                <div className="space-y-3 text-gray-300">
                  {manga.type && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-medium text-white">{manga.type}</span>
                    </div>
                  )}
                  
                  {manga.chapters && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chapters:</span>
                      <span className="font-medium text-white">{manga.chapters}</span>
                    </div>
                  )}
                  
                  {manga.volumes && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volumes:</span>
                      <span className="font-medium text-white">{manga.volumes}</span>
                    </div>
                  )}
                  
                  {manga.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="font-medium text-white">{manga.status}</span>
                    </div>
                  )}
                  
                  {manga.published && manga.published.string && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Published:</span>
                      <span className="font-medium text-white">{manga.published.string}</span>
                    </div>
                  )}
                  
                  {manga.serialization && manga.serialization.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Magazine:</span>
                      <span className="font-medium text-white">{manga.serialization[0].name}</span>
                    </div>
                  )}
                  
                  {manga.authors && manga.authors.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Author:</span>
                      <span className="font-medium text-white">{manga.authors[0].name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reader Demographics */}
              {manga.demographics && manga.demographics.length > 0 && (
                <div className="mt-6 bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Demographics</h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.demographics.map((demographic) => (
                      <span 
                        key={demographic.mal_id} 
                        className="px-3 py-1 bg-blue-900/40 backdrop-blur-sm rounded-full text-blue-200 text-sm border border-blue-700/30"
                      >
                        {demographic.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manga Details */}
            <div className="lg:w-2/3 xl:w-3/4 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-semibold">
                  {manga.type}
                </span>
                {manga.status && (
                  <span className="px-3 py-1 bg-purple-700/80 rounded-full text-xs font-semibold">
                    {manga.status}
                  </span>
                )}
                {manga.chapters && (
                  <span className="px-3 py-1 bg-indigo-700/80 rounded-full text-xs font-semibold">
                    {manga.chapters} Chapters
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white">
                {manga.title}
              </h1>
              
              {manga.title_japanese && (
                <h2 className="text-xl text-gray-300 mb-4">
                  {manga.title_japanese}
                </h2>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                {manga.score && (
                  <div className="flex items-center">
                    <div className="relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          className="text-gray-700" 
                          stroke="currentColor" 
                          strokeWidth="10" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50" 
                        />
                        <circle 
                          className="text-indigo-500" 
                          stroke="currentColor" 
                          strokeWidth="10" 
                          strokeDasharray={`${251.2 * manga.score/10} 251.2`}
                          strokeLinecap="round" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{manga.score}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm text-gray-300">Scored by</div>
                      <div className="text-base font-medium">{manga.scored_by?.toLocaleString() || '0'} users</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div className="flex items-center">
                    <div className="text-indigo-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-400">Rank</div>
                      <div className="text-sm font-medium">#{manga.rank || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-400">Popularity</div>
                      <div className="text-sm font-medium">#{manga.popularity || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-400">Members</div>
                      <div className="text-sm font-medium">{manga.members?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genres */}
              {manga.genres && manga.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre) => (
                      <span 
                        key={genre.mal_id} 
                        className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-sm border border-indigo-500/30 transition-colors cursor-pointer hover:border-indigo-500/60"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="border-b border-gray-700 mb-6 mt-10 overflow-x-auto no-scrollbar">
                <nav className="flex space-x-8 whitespace-nowrap">
                  {['overview', 'characters', 'chapters', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-500'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-semibold mb-4 inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      Synopsis
                    </h3>
                    <div className="bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm mb-8">
                      <p className="text-gray-300 leading-relaxed">
                        {showFullSynopsis 
                          ? manga.synopsis 
                          : manga.synopsis?.substring(0, 300) + (manga.synopsis?.length > 300 ? '...' : '')}
                      </p>
                      {manga.synopsis?.length > 300 && (
                        <button 
                          onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                          className="mt-3 text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2"
                        >
                          {showFullSynopsis ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                    
                    {/* Publication Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm">
                        <h4 className="text-lg font-semibold mb-3 inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                          Publication & Creators
                        </h4>
                        <div className="space-y-3">
                          {manga.authors && manga.authors.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-400 mb-1">Author(s)</h5>
                              <div className="flex flex-wrap gap-2">
                                {manga.authors.map(author => (
                                  <span key={author.mal_id} className="px-3 py-1 bg-indigo-900/40 rounded-md text-indigo-200 text-sm">
                                    {author.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {manga.serialization && manga.serialization.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-400 mb-1">Serialization</h5>
                              <div className="flex flex-wrap gap-2">
                                {manga.serialization.map(magazine => (
                                  <span key={magazine.mal_id} className="px-3 py-1 bg-purple-900/40 rounded-md text-purple-200 text-sm">
                                    {magazine.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {manga.published && manga.published.string && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-400 mb-1">Published</h5>
                              <span className="px-3 py-1 bg-blue-900/40 rounded-md text-blue-200 text-sm">
                                {manga.published.string}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Statistics */}
                      <div className="bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm">
                        <h4 className="text-lg font-semibold mb-3 inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          Statistics
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-indigo-500">{manga.rank || 'N/A'}</div>
                            <div className="text-xs text-gray-400">Rank</div>
                          </div>
                          
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-purple-500">{manga.popularity || 'N/A'}</div>
                            <div className="text-xs text-gray-400">Popularity</div>
                          </div>
                          
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-blue-500">{manga.members ? (manga.members > 999999 ? (manga.members/1000000).toFixed(1) + 'M' : (manga.members/1000).toFixed(1) + 'K') : 'N/A'}</div>
                            <div className="text-xs text-gray-400">Members</div>
                          </div>
                          
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-indigo-500">{manga.favorites ? (manga.favorites > 999 ? (manga.favorites/1000).toFixed(1) + 'K' : manga.favorites) : 'N/A'}</div>
                            <div className="text-xs text-gray-400">Favorites</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alternative Titles */}
                    {manga.titles && manga.titles.length > 0 && (
                      <div className="bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm mb-8">
                        <h4 className="text-lg font-semibold mb-3 inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                          </svg>
                          Alternative Titles
                        </h4>
                        <div className="space-y-2">
                          {manga.titles.map((title, index) => (
                            <div key={index} className="flex flex-wrap items-center">
                              <span className="text-sm font-semibold text-gray-400 mr-2 min-w-[80px]">{title.type}:</span>
                              <span className="text-white">{title.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'characters' && (
                  <div className="bg-gray-800/60 rounded-lg p-6 border border-indigo-500/20 backdrop-blur-sm text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Character List</h3>
                    <p className="text-gray-400 mb-4">Character data will be available soon!</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-colors">
                      Check Back Later
                    </button>
                  </div>
                )}
                
                {activeTab === 'chapters' && (
                  <div className="bg-gray-800/60 rounded-lg p-6 border border-indigo-500/20 backdrop-blur-sm text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Chapter List</h3>
                    <p className="text-gray-400 mb-4">Chapter data will be available soon!</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-colors">
                      Check Back Later
                    </button>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="bg-gray-800/60 rounded-lg p-6 border border-indigo-500/20 backdrop-blur-sm text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">User Reviews</h3>
                    <p className="text-gray-400 mb-4">Reviews will be available soon!</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-colors">
                      Check Back Later
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Manga Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Related Manga
          </span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedManga && relatedManga.length > 0 ? (
            relatedManga.map((related) => (
              <Link to={`/manga/${related.mal_id}`} key={related.mal_id} className="group">
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 h-full flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-700 relative">
                    {related.images?.jpg?.image_url ? (
                      <img 
                        src={related.images.jpg.image_url} 
                        alt={related.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  </div>
                  <div className="p-3 bg-gray-800 flex-grow">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">{related.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{related.type || 'Manga'}</span>
                      {related.score && (
                        <span className="text-yellow-400 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {related.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Render placeholders when no related manga
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
                <div className="aspect-[3/4] bg-gray-700 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reading Recommendations Section */}
      {(!relatedManga || relatedManga.length === 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              You Might Also Like
            </span>
          </h2>
          
          <div className="text-center py-8 bg-gray-800/60 rounded-lg border border-indigo-500/20 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Recommendations Coming Soon</h3>
            <p className="text-gray-400 mb-4">We're working on gathering the perfect manga recommendations for you!</p>
            <Link to="/manga" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-500 hover:to-indigo-500 transition-colors inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Browse More Manga
            </Link>
          </div>
        </div>
      )}

      {/* Manga Reader Sample */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Preview Chapter
          </span>
        </h2>
        
        <div className="bg-gray-800/60 rounded-lg p-6 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="max-w-xl w-full bg-black/50 p-2 sm:p-4 rounded-lg mb-6">
              <img 
                src={manga.images?.jpg?.large_image_url || "https://via.placeholder.com/600x900/181925/FFFFFF?text=Sample+Page"} 
                alt="Sample Page"
                className="w-full h-auto rounded shadow-lg"
              />
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4 w-full">
              <button className="px-4 py-2 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <span className="text-gray-300 mx-2">Sample Page 1</span>
              
              <button className="px-4 py-2 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-full transition-all transform hover:scale-105 hover:shadow-glow flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                </svg>
                Start Reading
              </button>
              
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full transition-all border border-purple-500/30 hover:border-purple-500/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Manga
              </button>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default DetailManga;