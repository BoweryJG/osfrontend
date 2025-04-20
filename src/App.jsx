import React, { useState, useEffect, useRef } from 'react';
import CosmicBackground from './CosmicBackground';

import { Container, Typography, Paper, Box, Button, TextField, Select, MenuItem, Divider, List, ListItem, ListItemText, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/task';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const FAVORITES_KEY = 'favorite_models_v1';

const PAID_MODELS_PASSWORD = "letmein123"; // Change this to your desired password

// Helper to check if a model is free based on its name
function isFreeModel(model) {
  return model.name && /\bfree\b/i.test(model.name);
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

  // Load favorites from localStorage
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    setFavorites(Array.isArray(favs) ? favs : []);
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
        const chatModels = (data.data || []).filter(m => m.id && m.id.includes('/')).map(m => ({
          id: m.id,
          name: m.name || m.id,
          provider: m.id.split('/')[0],
          context_length: m.context_length,
          ...m
        }));
        chatModels.sort((a, b) => a.id.localeCompare(b.id));
        console.log("Available models:", chatModels.map(m => m.name));
        setModels(chatModels);
        if (chatModels.length > 0) {
          // Prefer Gemini 2.5 Pro Experimental (free) if present
          const gemini = chatModels.find(m => m.name && m.name.toLowerCase().includes('gemini 2.5 pro experimental'));
          if (gemini) {
            setModel(gemini.id);
          } else {
            const firstFree = chatModels.find(isFreeModel);
            setModel(firstFree ? firstFree.id : chatModels[0].id);
          }
        }
      } catch (err) {
        setModelsError('Could not load models. Showing defaults.');
        setModels([
          { id: 'openai/gpt-4', name: 'OpenAI GPT-4', provider: 'openai', context_length: 128000 },
          { id: 'google/gemini-pro', name: 'Google Gemini Pro', provider: 'google', context_length: 32768 },
          { id: 'anthropic/claude-3-opus', name: 'Anthropic Claude 3 Opus', provider: 'anthropic', context_length: 200000 },
        ]);
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


  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse('');
    setError('');
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model })
      });
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
      setResponse(aiResponse);
      setHistory([{ prompt, response: aiResponse, model, timestamp: new Date().toLocaleString() }, ...history]);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Error contacting backend.');
    }
    setLoading(false);
  };

  return (
    <>
      <CosmicBackground />
      <Container maxWidth="sm" sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
        <div className="header-glass" style={{ padding: '32px 0 18px 0', marginBottom: 18, borderBottom: '2px solid var(--vp-accent)', boxShadow: '0 2px 8px rgba(143,156,255,0.09)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h3" align="center" style={{ fontWeight: 900, letterSpacing: 1, color: 'var(--vp-accent)', marginBottom: 0, textShadow: '0 2px 12px #181C20' }}>
            Sphere1a
          </Typography>
        </div>
        <div className="glass" style={{ marginBottom: 18, padding: 18 }}>
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
                if (selectedModel && !isFreeModel(selectedModel) && !hasPaidAccess) {
                  const pw = window.prompt("Enter password for exclusive models:");
                  if (pw === PAID_MODELS_PASSWORD) {
                    setHasPaidAccess(true);
                    setModel(selected);
                  } else {
                    alert("Incorrect password.");
                    return;
                  }
                } else {
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
                  const isFree = isFreeModel(m);
                  return (
                    <MenuItem
                      value={m.id}
                      key={m.id}
                      disabled={!isFree && !hasPaidAccess}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                          <span style={{ fontSize: 12, color: '#666' }}>{m.provider} &mdash; ctx: {m.context_length || '?'} tokens</span>
                          {!isFree && !hasPaidAccess && (
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
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            label={isListening ? "Listening..." : "Ask something..."}
            disabled={loading}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            sx={{ background: '#221b3a', borderRadius: 2, input: { color: '#fff' }, label: { color: '#00fff7' } }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', marginTop: 12 }}>
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
      <div className="glass" style={{ marginTop: 18, marginBottom: 18, padding: 14 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: '#5BC0EB', fontWeight: 700, fontSize: 15 }}>Request History</Typography>
        <Divider sx={{ mb: 1, background: '#5BC0EB' }} />
        <List dense>
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
  </>
  );
}


export default App;