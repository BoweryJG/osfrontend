// OpenRouter API client utility for generating AI content

// Get the API key from environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * Generate content using the OpenRouter API
 * @param {string} prompt - The prompt to send to the model
 * @param {string} model - The model to use (default: 'gpt-4o')
 * @param {string} systemPrompt - Optional system prompt to set context
 * @returns {Promise<string>} The generated content
 */
export const generateContent = async (prompt, model = 'gpt-4o', systemPrompt = '') => {
  try {
    // Default system prompt if none provided
    const defaultSystemPrompt = 'You are an expert medical marketing assistant. Generate detailed, professional reports for doctors based on the provided information.';
    
    // Use the provided system prompt or the default
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'repSpheres Doctor Report Generator'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: finalSystemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content with OpenRouter:', error);
    throw error;
  }
};

/**
 * Get available models from OpenRouter
 * @returns {Promise<Array>} Array of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching available models:', error);
    throw error;
  }
};

export default {
  generateContent,
  getAvailableModels
};
