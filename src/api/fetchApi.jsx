// src/services/AnimeService.js

class AnimeService {
  constructor() {
    this.baseUrl = 'https://api.jikan.moe/v4';
    this.requestQueue = [];
    this.processing = false;
    this.requestDelay = 1000; // Delay 1 detik antar request
    this.mockData = this.generateMockData(); // Data dummy untuk fallback
  }

  // Mengelola queue request dengan delay
  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;
    
    this.processing = true;
    const nextRequest = this.requestQueue.shift();
    
    try {
      const result = await nextRequest.request();
      nextRequest.resolve(result);
    } catch (error) {
      // Jika request gagal, coba gunakan mock data
      console.warn(`Request failed, using fallback data: ${error.message}`);
      const mockResult = this.getMockDataForEndpoint(nextRequest.endpoint);
      nextRequest.resolve(mockResult);
    }
    
    // Delay sebelum request berikutnya
    setTimeout(() => {
      this.processing = false;
      this.processQueue();
    }, this.requestDelay);
  }

  // Menambahkan request ke queue
  enqueueRequest(endpoint, requestFn) {
    return new Promise((resolve) => {
      this.requestQueue.push({
        endpoint,
        request: requestFn,
        resolve
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  // Request dengan penanganan error dan retry
  async makeRequest(endpoint, params = '') {
    const requestFn = async () => {
      try {
        const url = `${this.baseUrl}${endpoint}${params}`;
        console.log(`Making request to: ${url}`);
        
        const response = await fetch(url);
        
        if (response.status === 429) {
          console.warn('Rate limited by Jikan API, returning fallback data');
          // Return fallback data jika terkena rate limit
          return this.getMockDataForEndpoint(endpoint);
        }
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Successfully fetched data from ${endpoint}`);
        return data.data;
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        // Return fallback data jika error
        return this.getMockDataForEndpoint(endpoint);
      }
    };
    
    return this.enqueueRequest(endpoint, requestFn);
  }

  // API Methods dengan penanganan error yang baik
  async getTrendingAnime() {
    return this.makeRequest('/top/anime', '?filter=airing&limit=10');
  }

  async getSeasonalAnime() {
    return this.makeRequest('/seasons/now', '?limit=8');
  }

  async getUpcomingAnime() {
    console.log('Memanggil getUpcomingAnime');
    const result = await this.makeRequest('/seasons/upcoming', '?limit=8');
    console.log('Data upcoming dari API/mock:', result);
    console.log('Apakah array?', Array.isArray(result));
    console.log('Panjang array:', result ? result.length : 0);
    
    // Memastikan hasil yang dikembalikan adalah array
    // Jika bukan array atau kosong, gunakan data mock langsung
    if (!Array.isArray(result) || result.length === 0) {
      console.log('Menggunakan data mock untuk upcoming anime');
      return this.mockData['/seasons/upcoming'] || [];
    }
    
    return result;
  }

  async getAnimeByGenre(genreId) {
    return this.makeRequest('/anime', `?genres=${genreId}&limit=8`);
  }

  async searchAnime(query) {
    return this.makeRequest('/anime', `?q=${query}&sfw=true&limit=20`);
  }

  async getAnimeDetails(id) {
    return this.makeRequest(`/anime/${id}`);
  }

  async getRelatedAnime(animeId) {
    try {
      // Bisa menggunakan endpoint recommendations jika tersedia
      // Atau jika tidak, bisa menggunakan anime dengan genre yang sama
      const genres = await this.makeRequest(`/anime/${animeId}`);
      
      // Jika anime memiliki genre, dapatkan rekomendasi berdasarkan genre pertama
      if (genres && genres.genres && genres.genres.length > 0) {
        const firstGenre = genres.genres[0].mal_id;
        const relatedByGenre = await this.makeRequest('/anime', `?genres=${firstGenre}&limit=6`);
        
        // Filter anime saat ini agar tidak muncul di daftar terkait
        return relatedByGenre.filter(anime => anime.mal_id !== parseInt(animeId));
      }
      
      // Default fallback jika tidak ada genre
      return this.makeRequest('/top/anime', '?limit=6');
    } catch (error) {
      console.error(`Error fetching related anime for ID ${animeId}:`, error);
      return [];
    }
  }

  async getTopManga(limit = 10) {
    console.log('Memanggil getTopManga');
    const result = await this.makeRequest('/top/manga', `?limit=${limit}`);
    console.log('Data top manga dari API:', result ? result.length : 0, 'item');
    return result;
  }
  
  async getRecentManga(limit = 8) {
    console.log('Memanggil getRecentManga');
    // Karena Jikan tidak punya endpoint "recent manga" secara spesifik,
    // kita gunakan manga filter dengan status publishing
    const result = await this.makeRequest('/manga', `?status=publishing&order_by=start_date&sort=desc&limit=${limit}`);
    console.log('Data recent manga dari API:', result ? result.length : 0, 'item');
    return result;
  }
  
  async getMangaByGenre(genreId, limit = 6) {
    console.log(`Memanggil getMangaByGenre untuk genre ID: ${genreId}`);
    const result = await this.makeRequest('/manga', `?genres=${genreId}&limit=${limit}`);
    console.log('Data manga by genre dari API:', result ? result.length : 0, 'item');
    return result || [];
  }
  
  async getMangaGenres() {
    console.log('Memanggil getMangaGenres');
    const result = await this.makeRequest('/genres/manga');
    console.log('Data manga genres dari API:', result ? result.length : 0, 'item');
    return result;
  }

  async getMangaDetails(id) {
    console.log('Memanggil getMangaDetails untuk ID:', id);
    const result = await this.makeRequest(`/manga/${id}`);
    console.log('Data manga details dari API/mock:', result ? 'Ditemukan' : 'Tidak ditemukan');
    return result;
  }

  async getRelatedManga(mangaId) {
    try {
      // Bisa menggunakan endpoint recommendations jika tersedia
      // Atau jika tidak, bisa menggunakan manga dengan genre yang sama
      const manga = await this.makeRequest(`/manga/${mangaId}`);
      
      // Jika manga memiliki genre, dapatkan rekomendasi berdasarkan genre pertama
      if (manga && manga.genres && manga.genres.length > 0) {
        const firstGenre = manga.genres[0].mal_id;
        const relatedByGenre = await this.makeRequest('/manga', `?genres=${firstGenre}&limit=6`);
        
        // Filter manga saat ini agar tidak muncul di daftar terkait
        return relatedByGenre.filter(manga => manga.mal_id !== parseInt(mangaId));
      }
      
      // Default fallback jika tidak ada genre
      return this.makeRequest('/top/manga', '?limit=6');
    } catch (error) {
      console.error(`Error fetching related manga for ID ${mangaId}:`, error);
      return [];
    }
  }

  async getTopCharacters(limit = 20) {
    console.log('Memanggil getTopCharacters');
    const result = await this.makeRequest('/top/characters', `?limit=${limit}`);
    console.log('Data top characters dari API:', result ? result.length : 0, 'item');
    return result || this.generateMockCharacters(limit, true);
  }
  
  async getAllCharacters(limit = 50) {
    console.log('Memanggil getAllCharacters');
    // There's no direct "all characters" endpoint in Jikan, so we'll use a combination of popular and search
    try {
      const popular = await this.getTopCharacters(Math.floor(limit / 2));
      
      // Get some random characters from different anime
      const animeIds = [1, 5, 21, 30, 31, 199, 1735, 11061, 16498, 38000];
      const randomAnimeId = animeIds[Math.floor(Math.random() * animeIds.length)];
      const animeCharacters = await this.makeRequest(`/anime/${randomAnimeId}/characters`);
      
      // Combine and deduplicate by mal_id
      const combined = [...popular];
      if (Array.isArray(animeCharacters)) {
        animeCharacters.forEach(char => {
          if (!combined.some(c => c.mal_id === char.character.mal_id)) {
            // Transform to match the structure of top characters
            combined.push({
              mal_id: char.character.mal_id,
              name: char.character.name,
              favorites: char.favorites,
              images: char.character.images,
              anime: [{ anime: { mal_id: randomAnimeId, title: char.anime?.title || 'Unknown' } }],
              manga: []
            });
          }
        });
      }
      
      return combined.slice(0, limit);
    } catch (error) {
      console.error('Error fetching all characters:', error);
      return this.generateMockCharacters(limit);
    }
  }
  
  async searchCharacters(query) {
    console.log(`Memanggil searchCharacters untuk query: ${query}`);
    // Use the character search endpoint
    const result = await this.makeRequest('/characters', `?q=${encodeURIComponent(query)}&limit=20`);
    console.log('Data character search dari API:', result ? result.length : 0, 'item');
    return result || [];
  }
  
  async getCharacterDetails(id) {
    console.log(`Memanggil getCharacterDetails untuk ID: ${id}`);
    const result = await this.makeRequest(`/characters/${id}/full`);
    console.log('Data character details dari API:', result ? 'Ditemukan' : 'Tidak ditemukan');
    return result || this.generateMockCharacterDetails(id);
  }
    

  // Generate mock data untuk fallback saat API rate limited
  generateMockData() {
      this.mockRelated = [
          {
            mal_id: 30,
            title: "Neon Genesis Evangelion",
            images: { jpg: { image_url: "https://via.placeholder.com/225x319/181925/5CFFDA?text=Related" } },
            type: "TV",
            score: 8.5
          },
          {
            mal_id: 31,
            title: "Cowboy Bebop",
            images: { jpg: { image_url: "https://via.placeholder.com/225x319/181925/FF9D5C?text=Related" } },
            type: "TV",
            score: 8.8
          },
          {
            mal_id: 32,
            title: "Steins;Gate",
            images: { jpg: { image_url: "https://via.placeholder.com/225x319/181925/5C6DFF?text=Related" } },
            type: "TV",
            score: 9.0
          },
          {
            mal_id: 33,
            title: "Fullmetal Alchemist: Brotherhood",
            images: { jpg: { image_url: "https://via.placeholder.com/225x319/181925/FFE85C?text=Related" } },
            type: "TV",
            score: 9.1
          },
          {
            mal_id: 34,
            title: "Code Geass",
            images: { jpg: { image_url: "https://via.placeholder.com/225x319/181925/C45CFF?text=Related" } },
            type: "TV",
            score: 8.7
          },
          {
            mal_id: 35,
            title: "Serial Experiments Lain",
            images: { jpg: { image_url: "https://via.placeholder.com/225x319/181925/FF5CA8?text=Related" } },
            type: "TV",
            score: 8.1
          }
        ];          
      this.mockDetails = {
          mal_id: 1535,
          title: "Death Note",
          title_japanese: "デスノート",
          type: "TV",
          episodes: 37,
          status: "Finished Airing",
          aired: {
            string: "Oct 4, 2006 to Jun 27, 2007"
          },
          duration: "23 min per ep",
          rating: "R - 17+ (violence & profanity)",
          score: 8.62,
          scored_by: 2442239,
          rank: 69,
          popularity: 2,
          members: 3181474,
          favorites: 167983,
          synopsis: "Brutal murders, petty thefts, and senseless violence pollute the human world. In contrast, the realm of death gods is a humdrum, unchanging gambling den. The ingenious 17-year-old Japanese student Light Yagami and sadistic god of death Ryuk share one belief: their worlds are rotten. For his own amusement, Ryuk drops his Death Note into the human world. Light stumbles upon it, deeming the first of its rules ridiculous: the human whose name is written in this note shall die. But it's just as the god of death said, and Light is persuaded to try it out.",
          background: "Death Note has been adapted into live action films, TV dramas, video games, light novels and a musical composed by Broadway veterans Frank Wildhorn and Jack Murphy.",
          season: "fall",
          year: 2006,
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
              small_image_url: "https://cdn.myanimelist.net/images/anime/9/9453t.jpg",
              large_image_url: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg"
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/anime/9/9453.webp",
              small_image_url: "https://cdn.myanimelist.net/images/anime/9/9453t.webp",
              large_image_url: "https://cdn.myanimelist.net/images/anime/9/9453l.webp"
            }
          },
          trailer: {
            youtube_id: "NlJZ-YgAt-c",
            url: "https://www.youtube.com/watch?v=NlJZ-YgAt-c",
            embed_url: "https://www.youtube.com/embed/NlJZ-YgAt-c"
          },
          studios: [
            {
              mal_id: 11,
              name: "Madhouse"
            }
          ],
          genres: [
            {
              mal_id: 37,
              name: "Supernatural"
            },
            {
              mal_id: 7,
              name: "Mystery"
            },
            {
              mal_id: 41,
              name: "Suspense"
            }
          ],
          themes: [
            {
              mal_id: 40,
              name: "Psychological"
            }
          ],
          producers: [
            {
              mal_id: 29,
              name: "VAP"
            },
            {
              mal_id: 93,
              name: "Konami"
            },
            {
              mal_id: 245,
              name: "Shueisha"
            },
            {
              mal_id: 1003,
              name: "Nippon Television Network"
            }
          ],
          demographics: [
            {
              mal_id: 27,
              name: "Shounen"
            }
          ]
        };
    return {
      '/top/anime': [
        {
          mal_id: 1,
          title: "Demon Slayer",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FF5CAA?text=Anime", image_url: "https://via.placeholder.com/225x319/181925/FF5CAA?text=Anime" } },
          score: 9.2,
          synopsis: "After his family was brutally murdered and his sister turned into a demon, Tanjiro Kamado's journey as a demon slayer began.",
          type: "TV",
          episodes: 24,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 2,
          title: "My Hero Academia",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/84DFFF?text=Anime", image_url: "https://via.placeholder.com/225x319/181925/84DFFF?text=Anime" } },
          score: 8.8,
          synopsis: "A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.",
          type: "TV",
          episodes: 25,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 3,
          title: "Attack on Titan",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FFDD5C?text=Anime", image_url: "https://via.placeholder.com/225x319/181925/FFDD5C?text=Anime" } },
          score: 9.0,
          synopsis: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
          type: "TV",
          episodes: 25,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 8, name: "Drama" }]
        },
        {
          mal_id: 4,
          title: "Jujutsu Kaisen",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/9D5CFF?text=Anime", image_url: "https://via.placeholder.com/225x319/181925/9D5CFF?text=Anime" } },
          score: 8.7,
          synopsis: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
          type: "TV",
          episodes: 24,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 5,
          title: "One Punch Man",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FF5C5C?text=Anime", image_url: "https://via.placeholder.com/225x319/181925/FF5C5C?text=Anime" } },
          score: 8.8,
          synopsis: "The story of Saitama, a hero who can defeat any enemy with a single punch but seeks a worthy opponent after growing bored by a lack of challenge.",
          type: "TV",
          episodes: 12,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 4, name: "Comedy" }]
        },
        {
          mal_id: 6,
          title: "Tokyo Revengers",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5CFFB0?text=Anime", image_url: "https://via.placeholder.com/225x319/181925/5CFFB0?text=Anime" } },
          score: 8.2,
          synopsis: "A middle-aged loser travels back in time to his school years and gets the chance to start over.",
          type: "TV",
          episodes: 24,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 8, name: "Drama" }]
        }
      ],
      '/seasons/now': [
        {
          mal_id: 7,
          title: "Chainsaw Man",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FF855C?text=Seasonal", image_url: "https://via.placeholder.com/225x319/181925/FF855C?text=Seasonal" } },
          score: 8.9,
          synopsis: "Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils in order to pay off his crushing debts.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 8,
          title: "Spy x Family",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5C85FF?text=Seasonal", image_url: "https://via.placeholder.com/225x319/181925/5C85FF?text=Seasonal" } },
          score: 8.7,
          synopsis: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 4, name: "Comedy" }]
        },
        {
          mal_id: 9,
          title: "Blue Lock",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5CFFE8?text=Seasonal", image_url: "https://via.placeholder.com/225x319/181925/5CFFE8?text=Seasonal" } },
          score: 8.3,
          synopsis: "After a disastrous defeat at the 2018 World Cup, Japan's team struggles to regroup. But what's missing? An absolute Ace Striker, who can guide them to the win.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 30, name: "Sports" }]
        },
        {
          mal_id: 10,
          title: "Bleach: Thousand-Year Blood War",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FFDC5C?text=Seasonal", image_url: "https://via.placeholder.com/225x319/181925/FFDC5C?text=Seasonal" } },
          score: 9.1,
          synopsis: "The peace is suddenly broken when warning sirens blare through the Soul Society. Residents are disappearing without a trace and nobody knows who's behind it all.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 11,
          title: "Mob Psycho 100 III",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/D75CFF?text=Seasonal", image_url: "https://via.placeholder.com/225x319/181925/D75CFF?text=Seasonal" } },
          score: 8.8,
          synopsis: "The third season of Mob Psycho 100.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 4, name: "Comedy" }]
        }
      ],
      '/seasons/upcoming': [
        {
          mal_id: 12,
          title: "Solo Leveling",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FF5CA8?text=Upcoming", image_url: "https://via.placeholder.com/225x319/181925/FF5CA8?text=Upcoming" } },
          score: null,
          synopsis: "In a world where hunters — humans who possess magical abilities — must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 13,
          title: "Demon Slayer: Swordsmith Village Arc",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5C91FF?text=Upcoming", image_url: "https://via.placeholder.com/225x319/181925/5C91FF?text=Upcoming" } },
          score: null,
          synopsis: "The Swordsmith Village Arc from Demon Slayer, continuing Tanjiro's journey.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 14,
          title: "The Rising of the Shield Hero Season 3",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5CFFB0?text=Upcoming", image_url: "https://via.placeholder.com/225x319/181925/5CFFB0?text=Upcoming" } },
          score: null,
          synopsis: "The third season of The Rising of the Shield Hero.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 15,
          title: "Dragon Ball Daima",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FFCF5C?text=Upcoming", image_url: "https://via.placeholder.com/225x319/181925/FFCF5C?text=Upcoming" } },
          score: null,
          synopsis: "A new Dragon Ball series announced with Goku and others returning in a new adventure.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 16,
          title: "One Punch Man Season 3",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FF5C5C?text=Upcoming", image_url: "https://via.placeholder.com/225x319/181925/FF5C5C?text=Upcoming" } },
          score: null,
          synopsis: "The third season of One Punch Man.",
          type: "TV",
          episodes: null,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 4, name: "Comedy" }]
        }
      ],
      '/anime': [ // For genre-based queries
        {
          mal_id: 17,
          title: "Naruto",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FF9D5C?text=Action", image_url: "https://via.placeholder.com/225x319/181925/FF9D5C?text=Action" } },
          score: 8.3,
          synopsis: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.",
          type: "TV",
          episodes: 220,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 18,
          title: "Fullmetal Alchemist: Brotherhood",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5C6DFF?text=Action", image_url: "https://via.placeholder.com/225x319/181925/5C6DFF?text=Action" } },
          score: 9.1,
          synopsis: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes wrong and leaves them in damaged physical forms.",
          type: "TV",
          episodes: 64,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        },
        {
          mal_id: 19,
          title: "Hunter x Hunter",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/5CFFD6?text=Action", image_url: "https://via.placeholder.com/225x319/181925/5CFFD6?text=Action" } },
          score: 9.0,
          synopsis: "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. To reach his goals, he embarks on a journey to find his father, who abandoned him when he was young.",
          type: "TV",
          episodes: 148,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }]
        },
        {
          mal_id: 20,
          title: "Black Clover",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/FFE85C?text=Action", image_url: "https://via.placeholder.com/225x319/181925/FFE85C?text=Action" } },
          score: 8.2,
          synopsis: "Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the Wizard King—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position.",
          type: "TV",
          episodes: 170,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 4, name: "Comedy" }]
        },
        {
          mal_id: 21,
          title: "Dragon Ball Z",
          images: { jpg: { large_image_url: "https://via.placeholder.com/225x319/181925/C45CFF?text=Action", image_url: "https://via.placeholder.com/225x319/181925/C45CFF?text=Action" } },
          score: 8.5,
          synopsis: "After learning that he is from another planet, a warrior named Goku and his friends are prompted to defend it from an onslaught of extraterrestrial enemies.",
          type: "TV",
          episodes: 291,
          genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }]
        }
      ]
    };
  }

  // Helper untuk mendapatkan mock data berdasarkan endpoint
  getMockDataForEndpoint(endpoint) {
    console.log('Mendapatkan mock data untuk endpoint:', endpoint);
    
    // Simpan endpoint asli untuk log
    const originalEndpoint = endpoint;
    
    // Menangani endpoint dengan parameter
    if (endpoint.includes('?')) {
      endpoint = endpoint.split('?')[0];
    }
    
    console.log('Endpoint setelah menghapus parameter:', endpoint);
    
    // Penanganan khusus untuk endpoint upcoming
    if (originalEndpoint.includes('/seasons/upcoming')) {
      console.log('Menggunakan data mock untuk /seasons/upcoming');
      return this.mockData['/seasons/upcoming'] || [];
    }
    
    // Untuk genre, gunakan data dari '/anime'
    if (endpoint.includes('/anime') && !endpoint.includes('/anime/')) {
      console.log('Menggunakan data mock untuk /anime');
      return this.mockData['/anime'] || [];
    }

    if (endpoint.includes('/anime/')) {
      console.log('Menggunakan data mock untuk detail anime');
      return this.mockDetails;
    }

    if (endpoint.includes('/anime') && originalEndpoint.includes('?genres=')) {
      console.log('Menggunakan data mock untuk anime berdasarkan genre');
      return this.mockRelated;
    }

    if (endpoint.includes('/manga/') && !endpoint.includes('?')) {
      console.log('Menggunakan data mock untuk detail manga');
      return this.mockMangaDetails;
    }

    if (endpoint.includes('/manga') && endpoint.includes('?genres=')) {
      console.log('Menggunakan data mock untuk manga berdasarkan genre');
      // You could reuse the mockRelated data or create a specific mockRelatedManga
      return this.mockRelated;
    }
    
    console.log('Mencoba mendapatkan data mock dari:', endpoint);
    const result = this.mockData[endpoint] || [];
    console.log('Hasil data mock:', result.length, 'item');
    return result;
  }
}

export default new AnimeService();