import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with URL and ANON key from Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file and Netlify.'
  );
  // Potentially throw an error or use placeholder values if critical for app startup
  // For now, createClient will likely error out if these are undefined.
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || ''); // Provide empty strings if undefined to prevent immediate crash

/**
 * Fetch all AI prompts from the Supabase database
 * @returns {Promise<Array>} Array of prompt objects
 */
export const fetchPrompts = async () => {
  const { data, error } = await supabase.from('ai_prompts').select('*');
  if (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
  return data || [];
};

/**
 * Fetch a single prompt by ID
 * @param {string} id - The prompt ID
 * @returns {Promise<Object|null>} Prompt object or null if not found
 */
export const fetchPromptById = async (id) => {
  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('id', id)
    .single(); // .single() returns one object or null

  if (error && error.code !== 'PGRST116') { // PGRST116: Row to be returned was not found
    console.error(`Error fetching prompt with ID ${id}:`, error);
    throw error;
  }
  return data;
};

/**
 * Update the usage count for a prompt
 * @param {string} id - The prompt ID
 * @returns {Promise<Object|null>} Updated prompt object or null
 */
export const incrementPromptUsage = async (id) => {
  // Note: This is not atomic. For true atomic increment, use an rpc call to a Supabase function.
  const prompt = await fetchPromptById(id);
  if (!prompt) {
    throw new Error(`Prompt with ID ${id} not found for incrementing usage.`);
  }
  const currentCount = prompt.usage_count || 0;

  const { data, error } = await supabase
    .from('ai_prompts')
    .update({
      usage_count: currentCount + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select() // To get the updated row back
    .single();

  if (error) {
    console.error(`Error incrementing usage count for prompt ${id}:`, error);
    throw error;
  }
  return data;
};

/**
 * Update the effectiveness score for a prompt
 * @param {string} id - The prompt ID
 * @param {number} score - The effectiveness score (0-10)
 * @returns {Promise<Object|null>} Updated prompt object or null
 */
export const updatePromptEffectiveness = async (id, score) => {
  if (score < 0 || score > 10) {
    throw new Error('Effectiveness score must be between 0 and 10.');
  }
  const { data, error } = await supabase
    .from('ai_prompts')
    .update({
      effectiveness_score: score,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select() // To get the updated row back
    .single();

  if (error) {
    console.error(`Error updating effectiveness score for prompt ${id}:`, error);
    throw error;
  }
  return data;
};

// Export the supabase client instance itself if needed elsewhere (e.g., for auth)
// And the specific functions
export default {
  supabaseInstance: supabase, // Exporting the client instance
  fetchPrompts,
  fetchPromptById,
  incrementPromptUsage,
  updatePromptEffectiveness,
};
