// Supabase client utility for interacting with the Supabase database

// Supabase URL and API key
const SUPABASE_URL = 'https://cbopynuvhcymbumjnvay.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk5NTE3MywiZXhwIjoyMDU5NTcxMTczfQ.75TJbQHaB2wbDeXr3pCvmLxjoid51MhNmCl7jLeDcJE';

/**
 * Fetch all AI prompts from the Supabase database
 * @returns {Promise<Array>} Array of prompt objects
 */
export const fetchPrompts = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_prompts`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching prompts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

/**
 * Fetch a single prompt by ID
 * @param {string} id - The prompt ID
 * @returns {Promise<Object>} Prompt object
 */
export const fetchPromptById = async (id) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_prompts?id=eq.${id}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching prompt: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[0]; // Return the first (and should be only) result
  } catch (error) {
    console.error(`Error fetching prompt with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update the usage count for a prompt
 * @param {string} id - The prompt ID
 * @returns {Promise<Object>} Updated prompt object
 */
export const incrementPromptUsage = async (id) => {
  try {
    // First, get the current usage count
    const prompt = await fetchPromptById(id);
    const currentCount = prompt.usage_count || 0;
    
    // Update the usage count
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_prompts?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        usage_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error updating prompt usage: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error incrementing usage count for prompt ${id}:`, error);
    throw error;
  }
};

/**
 * Update the effectiveness score for a prompt
 * @param {string} id - The prompt ID
 * @param {number} score - The effectiveness score (0-10)
 * @returns {Promise<Object>} Updated prompt object
 */
export const updatePromptEffectiveness = async (id, score) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_prompts?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        effectiveness_score: score,
        updated_at: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error updating prompt effectiveness: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating effectiveness score for prompt ${id}:`, error);
    throw error;
  }
};

export default {
  fetchPrompts,
  fetchPromptById,
  incrementPromptUsage,
  updatePromptEffectiveness
};
