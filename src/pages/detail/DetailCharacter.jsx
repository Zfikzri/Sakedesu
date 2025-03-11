import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AnimeService from '../../api/fetchApi';

const DetailCharacter = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        setIsLoading(true);
        const data = await AnimeService.getCharacterDetails(id);
        setCharacter(data);
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching character details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterDetails();
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
          <p className="mt-6 text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">Loading character data...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Character Not Found</h2>
          <p className="text-gray-300 mb-6">Sorry, we couldn't find the character you're looking for.</p>
          <Link to="/characters" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full transition-all transform hover:scale-105">
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to truncate and expand text
  const renderBiography = (text) => {
    if (!text) return <p className="text-gray-400 italic">No biography available.</p>;
    
    const maxLength = 500;
    const isTruncated = text.length > maxLength && !showMore;
    
    return (
      <>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {isTruncated ? text.substr(0, maxLength) + '...' : text}
        </p>
        {text.length > maxLength && (
          <button 
            onClick={() => setShowMore(!showMore)} 
            className="mt-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
          >
            {showMore ? 'Show Less' : 'Read More'}
          </button>
        )}
      </>
    );
  };

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
            src={character.anime && character.anime[0]?.anime?.images?.jpg?.large_image_url || character.images?.jpg?.image_url} 
            alt={character.name}
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
          <Link to="/characters" className="inline-flex items-center text-gray-300 hover:text-white mb-6 group transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Characters
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Character Image and Info */}
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={character.images?.jpg?.image_url} 
                    alt={character.name}
                    className="w-full h-auto"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg flex items-center justify-center transition-all transform hover:scale-105 hover:shadow-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Add to Favorites
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center justify-center border border-indigo-500/30 transition-all hover:border-indigo-500/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share Character
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Information</h3>
                <div className="space-y-3 text-gray-300">
                  {character.name_kanji && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Japanese:</span>
                      <span className="font-medium text-white">{character.name_kanji}</span>
                    </div>
                  )}
                  
                  {character.nicknames && character.nicknames.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nicknames:</span>
                      <span className="font-medium text-white text-right">{character.nicknames.slice(0, 3).join(", ")}{character.nicknames.length > 3 ? "..." : ""}</span>
                    </div>
                  )}
                  
                  {character.favorites && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Favorites:</span>
                      <span className="font-medium text-white">{character.favorites.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {character.anime && character.anime.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Anime:</span>
                      <span className="font-medium text-white">{character.anime.length}</span>
                    </div>
                  )}
                  
                  {character.manga && character.manga.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Manga:</span>
                      <span className="font-medium text-white">{character.manga.length}</span>
                    </div>
                  )}
                  
                  {character.voices && character.voices.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voice Actors:</span>
                      <span className="font-medium text-white">{character.voices.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Character Details */}
            <div className="lg:w-2/3 xl:w-3/4 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {character.anime && character.anime.length > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-semibold">
                    Anime
                  </span>
                )}
                {character.manga && character.manga.length > 0 && (
                  <span className="px-3 py-1 bg-purple-700/80 rounded-full text-xs font-semibold">
                    Manga
                  </span>
                )}
                {character.voices && character.voices.length > 0 && (
                  <span className="px-3 py-1 bg-blue-700/80 rounded-full text-xs font-semibold">
                    Voice Acted
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white">
                {character.name}
              </h1>
              
              {character.name_kanji && (
                <h2 className="text-xl text-gray-300 mb-4">
                  {character.name_kanji}
                </h2>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <div className="text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-gray-400">Favorites</div>
                    <div className="text-sm font-medium">{character.favorites?.toLocaleString() || '0'}</div>
                  </div>
                </div>

                {character.anime && character.anime.length > 0 && (
                  <div className="flex items-center">
                    <div className="text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-400">Appears In</div>
                      <div className="text-sm font-medium">{character.anime.length} Anime</div>
                    </div>
                  </div>
                )}

                {character.manga && character.manga.length > 0 && (
                  <div className="flex items-center">
                    <div className="text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-400">Featured In</div>
                      <div className="text-sm font-medium">{character.manga.length} Manga</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Nicknames */}
              {character.nicknames && character.nicknames.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Nicknames</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.nicknames.map((nickname, index) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-sm border border-indigo-500/30 transition-colors"
                      >
                        {nickname}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="border-b border-gray-700 mb-6 mt-10 overflow-x-auto no-scrollbar">
                <nav className="flex space-x-8 whitespace-nowrap">
                  {['about', 'anime', 'manga', 'voices'].map((tab) => (
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
                {activeTab === 'about' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-semibold mb-4 inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Biography
                    </h3>
                    <div className="bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm mb-8">
                      {renderBiography(character.about)}
                    </div>
                    
                    {/* Roles and Background Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-800/60 rounded-lg p-5 border border-indigo-500/20 backdrop-blur-sm">
                        <h4 className="text-lg font-semibold mb-3 inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          Role Information
                        </h4>
                        
                        {character.anime && character.anime.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-semibold text-gray-400 mb-1">Main Anime Role</h5>
                            <span className="px-3 py-1 bg-purple-900/40 rounded-md text-purple-200 text-sm">
                              {character.anime[0].role || 'Character'}
                            </span>
                          </div>
                        )}
                        
                        {character.manga && character.manga.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-semibold text-gray-400 mb-1">Main Manga Role</h5>
                            <span className="px-3 py-1 bg-blue-900/40 rounded-md text-blue-200 text-sm">
                              {character.manga[0].role || 'Character'}
                            </span>
                          </div>
                        )}
                        
                        {character.voices && character.voices.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-400 mb-1">Primary Voice</h5>
                            <span className="px-3 py-1 bg-indigo-900/40 rounded-md text-indigo-200 text-sm">
                              {character.voices[0].person.name} ({character.voices[0].language})
                            </span>
                          </div>
                        )}
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
                            <div className="text-xl font-bold text-indigo-500">{character.favorites ? (character.favorites > 999 ? (character.favorites/1000).toFixed(1) + 'K' : character.favorites) : 0}</div>
                            <div className="text-xs text-gray-400">Favorites</div>
                          </div>
                          
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-purple-500">{character.anime ? character.anime.length : 0}</div>
                            <div className="text-xs text-gray-400">Anime</div>
                          </div>
                          
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-blue-500">{character.manga ? character.manga.length : 0}</div>
                            <div className="text-xs text-gray-400">Manga</div>
                          </div>
                          
                          <div className="bg-gray-900/60 rounded-lg p-3 border border-indigo-500/10 text-center">
                            <div className="text-xl font-bold text-pink-500">{character.voices ? character.voices.length : 0}</div>
                            <div className="text-xs text-gray-400">Voice Actors</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'anime' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-semibold mb-4 inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                      </svg>
                      Anime Appearances
                    </h3>
                    
                    {character.anime && character.anime.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {character.anime.map((item, index) => (
                          <div key={`anime-${index}`} className="bg-gray-800/60 rounded-lg overflow-hidden border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
                            <div className="flex items-start p-4">
                              <div className="flex-shrink-0 w-16 h-24 bg-gray-700 rounded overflow-hidden mr-4">
                                {item.anime.images?.jpg?.image_url ? (
                                  <img 
                                    src={item.anime.images.jpg.image_url} 
                                    alt={item.anime.title} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <Link to={`/anime/${item.anime.mal_id}`} className="text-white font-semibold hover:text-indigo-300 transition-colors line-clamp-2">
                                  {item.anime.title}
                                </Link>
                                
                                <div className="mt-1 flex items-center text-xs text-gray-400">
                                  {item.anime.type && (
                                    <span className="bg-gray-700 px-2 py-1 rounded mr-2">
                                      {item.anime.type}
                                    </span>
                                  )}
                                  {item.role && (
                                    <span className="bg-purple-700/40 px-2 py-1 rounded">
                                    {item.role}
                                  </span>
                                )}
                              </div>
                              
                              {item.anime.aired && (
                                <div className="mt-2 text-xs text-gray-400">
                                  {item.anime.aired.string || (item.anime.aired.from && new Date(item.anime.aired.from).getFullYear())}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/60 rounded-lg p-6 border border-indigo-500/20 backdrop-blur-sm text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                      <h3 className="text-xl font-semibold mb-2">No Anime Appearances</h3>
                      <p className="text-gray-400 mb-4">This character doesn't appear in any anime series yet.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'manga' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Manga Appearances
                  </h3>
                  
                  {character.manga && character.manga.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {character.manga.map((item, index) => (
                        <div key={`manga-${index}`} className="bg-gray-800/60 rounded-lg overflow-hidden border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
                          <div className="flex items-start p-4">
                            <div className="flex-shrink-0 w-16 h-24 bg-gray-700 rounded overflow-hidden mr-4">
                              {item.manga.images?.jpg?.image_url ? (
                                <img 
                                  src={item.manga.images.jpg.image_url} 
                                  alt={item.manga.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <Link to={`/manga/${item.manga.mal_id}`} className="text-white font-semibold hover:text-indigo-300 transition-colors line-clamp-2">
                                {item.manga.title}
                              </Link>
                              
                              <div className="mt-1 flex items-center text-xs text-gray-400">
                                {item.manga.type && (
                                  <span className="bg-gray-700 px-2 py-1 rounded mr-2">
                                    {item.manga.type}
                                  </span>
                                )}
                                {item.role && (
                                  <span className="bg-blue-700/40 px-2 py-1 rounded">
                                    {item.role}
                                  </span>
                                )}
                              </div>
                              
                              {item.manga.published && (
                                <div className="mt-2 text-xs text-gray-400">
                                  {item.manga.published.string || (item.manga.published.from && new Date(item.manga.published.from).getFullYear())}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/60 rounded-lg p-6 border border-indigo-500/20 backdrop-blur-sm text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h3 className="text-xl font-semibold mb-2">No Manga Appearances</h3>
                      <p className="text-gray-400 mb-4">This character doesn't appear in any manga series yet.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'voices' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Voice Actors
                  </h3>
                  
                  {character.voices && character.voices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {character.voices.map((voice, index) => (
                        <div key={`voice-${index}`} className="bg-gray-800/60 rounded-lg overflow-hidden border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
                          <div className="aspect-w-1 aspect-h-1 bg-gray-700">
                            {voice.person.images?.jpg?.image_url ? (
                              <img 
                                src={voice.person.images.jpg.image_url} 
                                alt={voice.person.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h4 className="text-white font-medium line-clamp-1">{voice.person.name}</h4>
                            
                            <div className="mt-1 flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {voice.language}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/60 rounded-lg p-6 border border-indigo-500/20 backdrop-blur-sm text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <h3 className="text-xl font-semibold mb-2">No Voice Actors</h3>
                      <p className="text-gray-400 mb-4">There are no voice actors associated with this character yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  
  </div>
);
};

export default DetailCharacter;