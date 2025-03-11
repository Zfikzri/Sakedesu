import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function with animation trigger
  const scrollToTop = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setTimeout(() => setIsAnimating(false), 1000);
    }, 300);
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${isHovering ? 'scale-110' : 'scale-100'} ${isAnimating ? 'animate-bounce' : ''}`}
      aria-label="Back to top"
      title="Back to top"
    >
      {/* Sake bottle outline - outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg"></div>
      
      {/* Sake bottle neck */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gradient-to-b from-pink-500 to-indigo-800 rounded-t-lg overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-pink-300 opacity-70 rounded-t-lg"></div>
        <div className="absolute inset-0 bg-white opacity-10"></div>
      </div>

      {/* Sake bottle cap */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-pink-400 rounded-full shadow-lg"></div>
      
      {/* Sake bottle liquid background */}
      <div className="absolute inset-1 bg-gradient-to-b from-pink-400/80 to-pink-600/80 rounded-full overflow-hidden flex items-center justify-center">
        {/* Sake swirl pattern */}
        <div className={`absolute inset-0 transition-all duration-500 ${isHovering ? 'opacity-70' : 'opacity-40'}`}>
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-white opacity-20 rounded-t-full"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute w-32 h-32 bg-pink-300/30 rounded-full -left-16 transition-all duration-700 ${isHovering ? 'animate-sake-swirl1' : ''}`}></div>
            <div className={`absolute w-24 h-24 bg-pink-200/20 rounded-full -right-12 transition-all duration-700 ${isHovering ? 'animate-sake-swirl2' : ''}`}></div>
          </div>
        </div>
      </div>

      {/* Cherry blossom overlay on hover */}
      <div className={`absolute inset-0 transition-all duration-500 ${isHovering || isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-white animate-sakura-spin" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,20c-3.4,0-6.4,2.7-7.8,6.2c-1.4-3.5-4.5-6.2-7.9-6.2c-4.8,0-8.7,5.1-8.7,11.3c0,5.9,3.3,10.7,7.7,11.3c-4.4,0.6-7.7,5.4-7.7,11.3c0,6.2,3.9,11.3,8.7,11.3c3.4,0,6.4-2.7,7.9-6.2c1.4,3.5,4.5,6.2,7.8,6.2c3.4,0,6.4-2.7,7.8-6.2c1.4,3.5,4.5,6.2,7.9,6.2c4.8,0,8.7-5.1,8.7-11.3c0-5.9-3.3-10.7-7.7-11.3c4.4-0.6,7.7-5.4,7.7-11.3c0-6.2-3.9-11.3-8.7-11.3c-3.4,0-6.4,2.7-7.9,6.2C56.4,22.7,53.4,20,50,20z"></path>
          </svg>
        </div>
      </div>

      {/* Arrow up with animation */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovering ? 'opacity-100' : 'opacity-70'}`}>
        <svg className={`w-8 h-8 text-white transition-transform duration-500 ${isHovering ? 'transform -translate-y-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isHovering ? 3 : 2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
      
      {/* Sakura petals floating animation */}
      <div className={`absolute inset-0 rounded-full overflow-hidden transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <div className="sakura-petal absolute w-3 h-3 bg-pink-300 rounded-full top-1/10 left-1/5"></div>
        <div className="sakura-petal-delay1 absolute w-2 h-2 bg-pink-200 rounded-full top-3/10 left-4/5"></div>
        <div className="sakura-petal-delay2 absolute w-4 h-4 bg-pink-400 rounded-full opacity-40 top-7/10 left-3/10"></div>
      </div>
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute -inset-3 bg-pink-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -inset-2 bg-indigo-500 rounded-full opacity-10 animate-pulse-delay"></div>
      </div>
      
      {/* Sake splash effect on scroll initiation */}
      <div className={`absolute inset-0 rounded-full overflow-hidden transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-pink-300/20 animate-ping"></div>
        <div className="absolute -inset-4 flex items-center justify-center">
          <svg className="w-24 h-24 text-pink-300 opacity-30 animate-sake-splash" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="35"></circle>
            <circle cx="50" cy="50" r="25"></circle>
          </svg>
        </div>
      </div>
    </button>
  );
};

export default BackToTop;