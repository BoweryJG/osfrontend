import React, { useState, useEffect, useRef } from 'react';
import CosmicBackground from './CosmicBackground';
import SignUpForm from './SignUpForm';

import { Container, Typography, Paper, Box, Button, TextField, Select, MenuItem, Divider, List, ListItem, ListItemText, CircularProgress, Alert, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/task';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const FAVORITES_KEY = 'favorite_models_v1';
const AUTH_STATUS_KEY = 'auth_status_v1';
const ADMIN_EMAIL = 'Jasonwilliamgolden@gmail.com'; // Admin email for subscription upgrade requests

// Helper to check if a model is free based on its name, pricing, or ID
function isFreeModel(model) {
  if (!model || !model.id) return false;
  
  // Primary check: Look for "(free)" in the model name
  if (model.name && model.name.toLowerCase().includes("(free)")) {
    return true;
  }
  
  // Secondary check: Check for "$0/M" pricing in the model metadata
  if (model.pricing && model.pricing.includes("$0/M")) {
    return true;
  }
  
  // Fallback to the existing list for backward compatibility
  const freeModels = [
    'google/gemini-pro',
    'google/gemini-1.5-pro',
    'google/gemini-2.0-flash',
    'anthropic/claude-instant',
    'mistralai/mistral',
    'meta-llama/llama-2'
  ];
  
  return freeModels.some(freeModel => 
    model.id.toLowerCase().includes(freeModel.toLowerCase())
  );
}

// Helper to check if a model is paid based on its name, pricing, or ID
function isPaidModel(model) {
  if (!model || !model.id) return false;
  
  // Primary check: Look for "(paid)" in the model name
  if (model.name && model.name.toLowerCase().includes("(paid)")) {
    return true;
  }
  
  // Secondary check: Check for non-zero pricing in the model metadata
  if (model.pricing && !model.pricing.includes("$0/M") && model.pricing.includes("$")) {
    return true;
  }
  
  // Check for premium model families
  const paidModelFamilies = [
    'openai/gpt-4',
    'anthropic/claude-3-opus',
    'anthropic/claude-3-sonnet',
    'anthropic/claude-3-haiku',
    'google/gemini-1.5-pro-latest',
    'mistralai/mistral-large'
  ];
  
  if (paidModelFamilies.some(paidModel => 
    model.id.toLowerCase().includes(paidModel.toLowerCase())
  )) {
    return true;
  }
  
  // If it's not explicitly free, consider it paid
  return !isFreeModel(model);
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('openai/gpt-4');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState('');
  const [error, setError] = useState('');
  const [selectedModelDetails, setSelectedModelDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // State for subscription level and password authentication
  const [subscriptionLevel, setSubscriptionLevel] = useState('free');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingPrompt, setPendingPrompt] = useState('');
  const [pendingModel, setPendingModel] = useState('');
  const [userData, setUserData] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  
  // Load favorites from localStorage and check auth/subscription status
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    setFavorites(Array.isArray(favs) ? favs : []);
    
    // Check authentication and subscription status
    const checkStatus = async () => {
      try {
        // Try to fetch the auth status endpoint
        const authCheckUrl = `${BACKEND_URL.split('/task')[0]}/auth/status`;
        const authRes = await fetch(authCheckUrl, {
          credentials: 'include' // Include cookies for session authentication
        });
        
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated) {
            setHasPaidAccess(true);
            localStorage.setItem(AUTH_STATUS_KEY, JSON.stringify({
              authenticated: true,
              timestamp: Date.now()
            }));
            
            // If authenticated, also check subscription level
            const subscriptionUrl = `${BACKEND_URL.split('/task')[0]}/auth/subscription`;
            const subRes = await fetch(subscriptionUrl, {
              credentials: 'include'
            });
            
            if (subRes.ok) {
              const subData = await subRes.json();
              setSubscriptionLevel(subData.subscription);
              console.log(`User subscription level: ${subData.subscription}`);
            }
          }
        }
      } catch (err) {
        console.log('Status check failed:', err);
        // This is a silent failure, so we don't show an error to the user
      }
    };
    
    // Check if we have a recent auth status in localStorage
    const storedAuthStatus = JSON.parse(localStorage.getItem(AUTH_STATUS_KEY) || '{}');
    const isRecent = storedAuthStatus.timestamp && (Date.now() - storedAuthStatus.timestamp < 3600000); // 1 hour
    
    if (storedAuthStatus.authenticated && isRecent) {
      setHasPaidAccess(true);
    }
    
    // Always check with the server for the latest status
    checkStatus();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Fetch available models from OpenRouter
  useEffect(() => {
    async function fetchModels() {
      setModelsLoading(true);
      setModelsError('');
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`
          }
        });
        if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
        const data = await res.json();
        const chatModels = (data.data || []).filter(m => m.id && m.id.includes('/')).map(m => {
          const modelData = {
            id: m.id,
            name: m.name || m.id,
            provider: m.id.split('/')[0],
            context_length: m.context_length,
            ...m
          };
          
          // Add isFree and isPaid flags for easier reference
          modelData.isFree = isFreeModel(modelData);
          modelData.isPaid = isPaidModel(modelData);
          
          return modelData;
        });
        chatModels.sort((a, b) => a.id.localeCompare(b.id));
        console.log("Available models:", chatModels.map(m => m.name));
        setModels(chatModels);
        if (chatModels.length > 0) {
          // Prefer free models first, especially Gemini 2.0 Flash Experimental
          const geminiFlash = chatModels.find(m => 
            m.name && m.name.toLowerCase().includes("gemini 2.0 flash") && 
            m.name.toLowerCase().includes("(free)")
          );
          
          if (geminiFlash) {
            console.log("Setting default model to Gemini 2.0 Flash (free)");
            setModel(geminiFlash.id);
          } else {
            // Fallback to any free model
            const firstFree = chatModels.find(m => m.isFree);
            if (firstFree) {
              console.log("Setting default model to free model:", firstFree.name);
              setModel(firstFree.id);
            } else {
              console.log("No free models found, using first available model");
              setModel(chatModels[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching models from OpenRouter:', err);
        const errorMessage = err.message || 'Unknown error';
        setModelsError(`Could not load models (${errorMessage}). Showing defaults.`);
        
        // Create default models with isFree and isPaid properties
        const defaultModels = [
          { 
            id: 'openai/gpt-4', 
            name: 'OpenAI GPT-4', 
            provider: 'openai', 
            context_length: 128000,
            isFree: false,
            isPaid: true
          },
          { 
            id: 'google/gemini-pro', 
            name: 'Google Gemini Pro (free)', 
            provider: 'google', 
            context_length: 32768,
            isFree: true,
            isPaid: false
          },
          { 
            id: 'anthropic/claude-3-opus', 
            name: 'Anthropic Claude 3 Opus', 
            provider: 'anthropic', 
            context_length: 200000,
            isFree: false,
            isPaid: true
          },
        ];
        
        setModels(defaultModels);
        
        // Set a free model as default
        const freeModel = defaultModels.find(m => m.isFree);
        if (freeModel) {
          setModel(freeModel.id);
        }
      }
      setModelsLoading(false);
    }
    fetchModels();
  }, []);

  // Update model details when selected
  useEffect(() => {
    const found = models.find(m => m.id === model);
    setSelectedModelDetails(found || null);
  }, [model, models]);

  // Favorite/unfavorite a model
  const toggleFavorite = (id) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  // Reset hasPaidAccess to false to ensure authentication is required
  useEffect(() => {
    // Force hasPaidAccess to false on component mount
    setHasPaidAccess(false);
    
    // Clear any stored authentication
    localStorage.removeItem('auth_token');
    
    console.log('Authentication reset: Requiring password for paid models');
  }, []);

  // Show all models, but only allow selection of free ones unless hasPaidAccess
  const sortedModels = [
    ...models.filter(m => favorites.includes(m.id)),
    ...models.filter(m => !favorites.includes(m.id))
  ];

  // Placeholder for file upload
  const handleFileUpload = (e) => {
    alert('File upload is not implemented yet.');
  };

  // Speech-to-text input
  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev ? prev + ' ' + transcript : transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  // Handle password submission
  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }
    
    setPasswordError('');
    setLoading(true);
    
    try {
      // Submit the password with user data if available
      const res = await fetch(`${BACKEND_URL.split('/task')[0]}/auth/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password,
          userData: userData // Include user data if available
        }),
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        
        if (data.success) {
          console.log('Authentication successful:', data);
          
          // Store the token in localStorage for backup authentication
          if (data.token) {
            localStorage.setItem('auth_token', data.token);
            console.log('Auth token saved to localStorage');
          }
          
          // Set the authenticated state
          setHasPaidAccess(true);
          setShowPasswordModal(false);
          setError(''); // Clear any previous error messages
          
          // If we have a pending prompt, send it now
          if (pendingPrompt && pendingModel) {
            const savedPrompt = pendingPrompt;
            const savedModel = pendingModel;
            
            // Clear pending data
            setPendingPrompt('');
            setPendingModel('');
            
            // Reset the password field
            setPassword('');
            
            // Send the pending prompt with the token
            await sendPrompt(savedPrompt, savedModel, data.token);
          } else {
            setLoading(false);
          }
          return;
        } else {
          console.error('Authentication failed: Server returned success=false');
          setPasswordError('Authentication failed. Please try again.');
        }
      } else {
        setPasswordError('Invalid password. Please try again.');
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      setPasswordError('Error authenticating: ' + err.message);
    }
    
    setLoading(false);
  };

  // Send prompt to backend
  const sendPrompt = async (promptText, modelId, authToken) => {
    setLoading(true);
    setResponse('');
    setError('');
    
    try {
      // Get token from localStorage if not provided
      const token = authToken || localStorage.getItem('auth_token') || 'letmein123';
      
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptText, 
          model: modelId,
          token: token
        }),
        credentials: 'include' // Include cookies for session authentication
      });
      
      // Handle 403 Forbidden (password required)
      if (res.status === 403) {
        const data = await res.json();
        
        // If this is a paid model that requires registration and password
        if (data.error === 'Password required' || data.requiresRegistration) {
          setError('This model requires registration and a password to access.');
          setPendingPrompt(promptText);
          setPendingModel(modelId);
          
          // Check if user needs to register first
          if (data.requiresRegistration) {
            setShowSignUpForm(true);
          } else {
            setShowPasswordModal(true);
          }
          
          setLoading(false);
          return;
        }
        
        // If user is authenticated but needs a higher subscription level
        if (data.error === 'Subscription required for this model') {
          setError(data.response || 'Your subscription level does not include access to this model.');
          
          // Show subscription upgrade message
          if (confirm('This model requires a higher subscription level. Would you like to contact the administrator to upgrade?')) {
            // Open email to admin
            window.location.href = `mailto:${ADMIN_EMAIL || 'admin@example.com'}?subject=Subscription%20Upgrade%20Request&body=I%20would%20like%20to%20upgrade%20my%20subscription%20to%20access%20more%20models.%20My%20current%20level%20is%20${subscriptionLevel}.`;
            return;
          } else {
            // If user cancels, suggest using a model they have access to
            const accessibleModels = models.filter(m => {
              if (m.isFree) return true;
              if (subscriptionLevel === 'asm' && m.id.toLowerCase().match(/(phi|claude-instant|mistral-medium|gemini-1\.5-flash)/)) return true;
              return false;
            });
            
            if (accessibleModels.length > 0) {
              const suggestedModel = accessibleModels[0];
              if (confirm(`Would you like to use ${suggestedModel.name} instead? It's available with your ${subscriptionLevel.toUpperCase()} subscription.`)) {
                setModel(suggestedModel.id);
                setLoading(false);
                return;
              }
            }
          }
          setLoading(false);
          return;
        }
      }
      
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      
      const data = await res.json();
      let aiResponse = '';
      if (data.success && data.llmResult && data.llmResult.choices && data.llmResult.choices.length > 0) {
        aiResponse = data.llmResult.choices[0].message.content || '';
      } else if (data.response) {
        aiResponse = data.response;
      } else {
        aiResponse = 'No response';
      }
      
      // If we got a successful response with a paid model, user must be authenticated
      const selectedModel = models.find(m => m.id === modelId);
      if (selectedModel && !selectedModel.isFree) {
        setHasPaidAccess(true);
      }
      
      setResponse(aiResponse);
      setHistory([{ prompt: promptText, response: aiResponse, model: modelId, timestamp: new Date().toLocaleString() }, ...history]);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Error contacting backend.');
    }
    setLoading(false);
  };

  // Main send handler
  const handleSend = () => {
    if (!prompt) return;
    
    // Check if this is a paid model and user doesn't have access
    const selectedModel = models.find(m => m.id === model);
    if (selectedModel && !selectedModel.isFree && !hasPaidAccess) {
      // Show sign-up form
      setShowSignUpForm(true);
      
      // Store the prompt and model as pending
      setPendingPrompt(prompt);
      setPendingModel(model);
    } else {
      // User has access or it's a free model
      sendPrompt(prompt, model);
    }
  };

  return (
    <>
      <CosmicBackground />
      <Container
  maxWidth={false}
  disableGutters
  sx={{
    width: '100vw',
    height: '100vh',
    margin: 0,
    position: 'relative',
    zIndex: 1,
    border: 'none',
    borderRadius: 0,
    background: 'none',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 0,
    gap: 0,
  }}
>

        <div className="glass" style={{
  width: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
}}>
          <Typography variant="h3" sx={{
            color: '#fff',
            fontWeight: 900,
            fontSize: { xs: 32, sm: 40, md: 48 },
            textAlign: 'center',
            letterSpacing: 2,
            mt: 4,
            mb: 2,
            textShadow: '0 2px 16px #23263a, 0 1px 2px #5BC0EB44',
            fontFamily: 'Montserrat, Roboto, Arial, sans-serif'
          }}>
            Sphere oS
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: '#5BC0EB', fontWeight: 700, fontSize: 16, mr: 2 }}>
              Model:
            </Typography>
            {modelsLoading ? (
              <CircularProgress size={20} sx={{ color: '#5BC0EB', mr: 2 }} />
            ) : null}
          </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {modelsLoading ? (
            <CircularProgress size={22} sx={{ color: '#00bcd4', mr: 2 }} />
          ) : (
            <Select
              value={model}
              onChange={e => {
                const selected = e.target.value;
                const selectedModel = models.find(m => m.id === selected);
                
                // Check if this is a paid model and user doesn't have access
                if (selectedModel && !selectedModel.isFree && !hasPaidAccess) {
                  // Show sign-up form
                  setShowSignUpForm(true);
                  
                  // Store the selected model as pending
                  setPendingModel(selected);
                } else {
                  // User has access or it's a free model
                  setModel(selected);
                }
              }}
              size="small"
              sx={{ minWidth: 340, background: '#fff' }}
              MenuProps={{ PaperProps: { style: { maxHeight: 350 } } }}
            >
              {sortedModels.length === 0 ? (
                <MenuItem disabled>No models found</MenuItem>
              ) : sortedModels.map(m => {
                  // Use the pre-computed isFree property
                  return (
                    <MenuItem
                      value={m.id}
                      key={m.id}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                          <span style={{ fontSize: 12, color: '#666' }}>{m.provider} &mdash; ctx: {m.context_length || '?'} tokens</span>
                          {!m.isFree && !hasPaidAccess && (
                            <span style={{ color: '#c00', fontSize: 11 }}>Exclusive – Unlock with Pro</span>
                          )}
                        </Box>
                        <Tooltip title={favorites.includes(m.id) ? 'Unfavorite' : 'Favorite'}>
                          <IconButton size="small" onClick={e => { e.stopPropagation(); toggleFavorite(m.id); }}>
                            {favorites.includes(m.id) ? <StarIcon sx={{ color: '#FFD600' }} /> : <StarBorderIcon />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </MenuItem>
                  );
                })}
            </Select>
          )}
        </Box>
        {modelsError && <Typography variant="caption" color="error" sx={{ ml: 2 }}>{modelsError}</Typography>}
        {/* Model Details */}
        {selectedModelDetails && (
          <Box sx={{ mb: 2, textAlign: 'left', background: 'rgba(36,29,63,0.7)', borderRadius: 12, p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#00fff7' }}>{selectedModelDetails.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Provider: {selectedModelDetails.provider} | Context Window: {selectedModelDetails.context_length || '?'} tokens
            </Typography>
            {selectedModelDetails.description && (
              <Typography variant="body2" sx={{ mt: 1, color: '#fff' }}>{selectedModelDetails.description}</Typography>
            )}
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, width: '100%' }}>
          <TextField
            fullWidth
            sx={{
              width: '100%',
              background: '#221b3a',
              borderRadius: 2,
              input: { color: '#fff', caretColor: '#fff', '::placeholder': { color: '#fff', opacity: 1 } },
              label: { color: '#fff' },
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiInputLabel-root': { color: '#fff' }
            }}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            label={isListening ? "Listening..." : "Ask something..."}
            disabled={loading}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleFileUpload} variant="outlined" className="glow-btn">File</Button>
          <Button onClick={handleSpeechInput} variant={isListening ? "contained" : "outlined"} className="glow-btn" style={{ background: isListening ? '#49a09d' : undefined }}>
            🎤
          </Button>
          <Button onClick={handleSend} className="glow-btn" endIcon={<SendIcon />} disabled={loading || !prompt || modelsLoading}>Send</Button>
        </Box>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {/* Chat bubbles for response */}
        {response && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', marginTop: 12, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="chat-bubble user" style={{ padding: '8px 14px', fontSize: 15 }}>{prompt}</div>
              <img src="https://api.dicebear.com/7.x/personas/svg?seed=user" alt="user" style={{ width: 28, height: 28, borderRadius: '50%', background: '#e5eaf1', border: '1px solid #b6c9d7' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" alt="ai" style={{ width: 28, height: 28, borderRadius: '50%', background: '#232a34', border: '1px solid #5bc0eb' }} />
              <div className="chat-bubble ai" style={{ padding: '8px 14px', fontSize: 15 }}>{response}</div>
            </div>
          </div>
        )}
      </div>
      <div className="glass" style={{
  width: '100vw',
  margin: 0,
  padding: 0,
  borderRadius: 0,
}}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: '#5BC0EB', fontWeight: 700, fontSize: 15 }}>Request History</Typography>
        <Divider sx={{ mb: 1, background: '#5BC0EB' }} />
        <List dense sx={{ width: '100%' }}>
          {history.length === 0 && <ListItem><ListItemText primary="No history yet." /></ListItem>}
          {history.map((item, idx) => (
            <ListItem key={idx} alignItems="flex-start" sx={{ py: 0.5 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="chat-bubble user" style={{ padding: '6px 10px', fontSize: 14 }}>{item.prompt}</div>
                  <img src="https://api.dicebear.com/7.x/personas/svg?seed=user" alt="user" style={{ width: 22, height: 22, borderRadius: '50%', background: '#e5eaf1', border: '1px solid #b6c9d7' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" alt="ai" style={{ width: 22, height: 22, borderRadius: '50%', background: '#232a34', border: '1px solid #5bc0eb' }} />
                  <div className="chat-bubble ai" style={{ padding: '6px 10px', fontSize: 14 }}>{item.response}</div>
                </div>
                <Typography component="span" variant="caption" color="#5BC0EB">{item.model} | {item.timestamp}</Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>

    {/* Sign Up Form */}
    <SignUpForm 
      open={showSignUpForm} 
      onClose={() => setShowSignUpForm(false)} 
      onSubmit={async (formData) => {
        setSignUpLoading(true);
        try {
          // Register the user
          const res = await fetch(`${BACKEND_URL.split('/task')[0]}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
          });
          
          if (res.ok) {
            // Store user data for password authentication
            setUserData(formData);
            setShowSignUpForm(false);
            setShowPasswordModal(true);
          } else {
            const data = await res.json();
            throw new Error(data.message || 'Registration failed');
          }
        } catch (err) {
          console.error('Error during registration:', err);
          alert(`Registration failed: ${err.message}`);
        }
        setSignUpLoading(false);
      }}
      loading={signUpLoading}
    />

    {/* Password Modal */}
    <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
      <DialogTitle>Enter Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          This model requires a password to access. Please enter the password below:
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePasswordSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowPasswordModal(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePasswordSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
}


export default App;
