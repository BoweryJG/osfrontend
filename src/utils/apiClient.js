import axios from 'axios';

// Use Vite's standard environment variables
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.error(
    'API URL is missing. Make sure VITE_API_URL is set in your .env file and Netlify.'
  );
  // Potentially throw an error or use a placeholder if critical for app startup
}

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Supabase Auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Supabase stores the session in localStorage with a key like 'sb-<project-ref>-auth-token'
    // Or the older 'supabase.auth.token'. We should try to find the correct key.
    // A more robust way might be to get it directly from supabase.auth.getSession() if apiClient
    // has access to the supabase instance, but localStorage is common for interceptors.

    let token = null;
    try {
      // Try the newer pattern first: sb-<project-ref>-auth-token
      // We need the project reference for this.
      // For now, let's try a common older key or assume Supabase client updates it.
      // A simpler approach if Supabase client is v2 and handles localStorage:
      const sessionDataString = localStorage.getItem('supabase.auth.token'); // This was for older Supabase versions
      
      // For Supabase JS v2, the key is typically `sb-${projectRef}-auth-token`
      // Or more generally, find the key that starts with `sb-` and ends with `-auth-token`
      let foundToken = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          const item = localStorage.getItem(key);
          if (item) {
            const parsedItem = JSON.parse(item);
            if (parsedItem && parsedItem.access_token) {
              foundToken = parsedItem.access_token;
              break;
            }
          }
        }
      }
      
      if (!foundToken && sessionDataString) { // Fallback to older key if new one not found
         const sessionData = JSON.parse(sessionDataString);
         if (sessionData && sessionData.access_token) {
            foundToken = sessionData.access_token;
         }
      }
      token = foundToken;

    } catch (e) {
      console.warn('Could not parse auth token from localStorage for API client:', e);
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
