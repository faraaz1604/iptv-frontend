// const API = 'http://localhost:8080/api/channels';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const API = `${API_BASE}/api/channels`;

console.log("🌍 API BASE URL:", process.env.REACT_APP_API_BASE_URL);


// ================= AUTH HEADER =================
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ================= SAFE FETCH =================
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);

    // ✅ Handle authentication errors
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // Redirect to login
      throw new Error('Session expired. Please login again.');
    }

    // ✅ Handle forbidden errors
    if (res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.reload();
      throw new Error('Access denied. Please login again.');
    }

    // ✅ Handle server errors
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    // ✅ Handle client errors
    if (res.status >= 400) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return res;

  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(error.message || 'Network error. Check your connection.');
  }
}

// ================= HELPER: Extract Data from ApiResponse =================
function extractDataFromResponse(response) {
  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || response.error || 'API Error');
  }
}

// ================= CHANNELS API =================
export const api = {

  // Get all channels
  getChannels: async () => {
    try {
      const response = await safeFetch(API, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to fetch channels');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  },

  // Get channel by ID
  getChannelById: async (id) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const response = await safeFetch(`${API}/${id}`, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to fetch channel');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await safeFetch(`${API}/categories`, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get all countries
  getCountries: async () => {
    try {
      const response = await safeFetch(`${API}/countries`, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to fetch countries');
      const apiResponse = await response.json();
      const data = extractDataFromResponse(apiResponse);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  // Get all favorites
  getFavorites: async () => {
    try {
      const response = await safeFetch(`${API}/favorites`, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  // Get recently watched channels
  getRecentlyWatched: async (limit = 10) => {
    try {
      if (!limit || limit < 1) limit = 10;
      
      const response = await safeFetch(`${API}/recently-watched?limit=${limit}`, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to fetch recently watched');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching recently watched:', error);
      throw error;
    }
  },

  // Remove from recently watched
  removeRecentlyWatched: async (id) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const response = await safeFetch(`${API}/${id}/recently-watched`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to remove recently watched');
      const apiResponse = await response.json();
      extractDataFromResponse(apiResponse);
      return true;
    } catch (error) {
      console.error('Error removing recently watched:', error);
      throw error;
    }
  },

  // Toggle favorite
  toggleFavorite: async (id, isFav) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const response = await safeFetch(`${API}/${id}/favorite`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      if (!response.ok) throw new Error('Failed to toggle favorite');
      const apiResponse = await response.json();
      extractDataFromResponse(apiResponse);
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Check if channel is favorite
  isFavorite: async (id) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const response = await safeFetch(`${API}/${id}/is-favorite`, {
        headers: { ...authHeaders() }
      });
      if (!response.ok) throw new Error('Failed to check favorite');
      const apiResponse = await response.json();
      const data = extractDataFromResponse(apiResponse);
      return data.isFavorite || false;
    } catch (error) {
      console.error('Error checking favorite:', error);
      throw error;
    }
  },

  // Record channel watch
  watchChannel: async (id, duration = null) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const url = duration
        ? `${API}/${id}/watch?duration=${duration}`
        : `${API}/${id}/watch`;

      const response = await safeFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      if (!response.ok) throw new Error('Failed to record watch');
      const apiResponse = await response.json();
      extractDataFromResponse(apiResponse);
      return true;
    } catch (error) {
      console.error('Error recording watch:', error);
      throw error;
    }
  },

  // Refresh playlist
  refreshPlaylist: async (
    playlistUrl = 'https://iptv-org.github.io/iptv/index.m3u'
  ) => {
    try {
      if (!playlistUrl) throw new Error('Playlist URL is required');
      
      const response = await safeFetch(`${API}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ playlistUrl })
      });
      if (!response.ok) throw new Error('Failed to refresh playlist');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error refreshing playlist:', error);
      throw error;
    }
  },

  // Search channels by keyword
  searchChannels: async (keyword) => {
    try {
      if (!keyword || keyword.trim() === '') {
        throw new Error('Search keyword is required');
      }
      
      const response = await safeFetch(
        `${API}/search?keyword=${encodeURIComponent(keyword)}`,
        { headers: { ...authHeaders() } }
      );
      if (!response.ok) throw new Error('Failed to search channels');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error searching channels:', error);
      throw error;
    }
  },

  // Get channels by category
  getChannelsByCategory: async (category) => {
    try {
      if (!category) throw new Error('Category is required');
      
      const response = await safeFetch(
        `${API}/category/${encodeURIComponent(category)}`,
        { headers: { ...authHeaders() } }
      );
      if (!response.ok) throw new Error('Failed to fetch channels by category');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching channels by category:', error);
      throw error;
    }
  },

  // Get channels by country
  getChannelsByCountry: async (countryCode) => {
    try {
      if (!countryCode) throw new Error('Country code is required');
      
      const response = await safeFetch(
        `${API}/country/${encodeURIComponent(countryCode)}`,
        { headers: { ...authHeaders() } }
      );
      if (!response.ok) throw new Error('Failed to fetch channels by country');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching channels by country:', error);
      throw error;
    }
  },

  // Get channels by language
  getChannelsByLanguage: async (language) => {
    try {
      if (!language) throw new Error('Language is required');
      
      const response = await safeFetch(
        `${API}/language/${encodeURIComponent(language)}`,
        { headers: { ...authHeaders() } }
      );
      if (!response.ok) throw new Error('Failed to fetch channels by language');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error fetching channels by language:', error);
      throw error;
    }
  },

  // Mark channel as active
  markChannelActive: async (id) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const response = await safeFetch(`${API}/${id}/status/active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      if (!response.ok) throw new Error('Failed to mark channel active');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error marking channel active:', error);
      throw error;
    }
  },

  // Mark channel as inactive
  markChannelInactive: async (id) => {
    try {
      if (!id) throw new Error('Channel ID is required');
      
      const response = await safeFetch(`${API}/${id}/status/inactive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      if (!response.ok) throw new Error('Failed to mark channel inactive');
      const apiResponse = await response.json();
      return extractDataFromResponse(apiResponse);
    } catch (error) {
      console.error('Error marking channel inactive:', error);
      throw error;
    }
  }

};