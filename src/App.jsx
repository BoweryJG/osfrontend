import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, TextField, Select, MenuItem, Divider, List, ListItem, ListItemText, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/task';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const FAVORITES_KEY = 'favorite_models_v1';

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
        setModels(chatModels);
        if (chatModels.length > 0) setModel(chatModels[0].id);
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

  // Sort: favorites at top, then alphabetical
  const sortedModels = [
    ...models.filter(m => favorites.includes(m.id)),
    ...models.filter(m => !favorites.includes(m.id))
  ];

  // Placeholder for file upload
  const handleFileUpload = (e) => {
    alert('File upload is not implemented yet.');
  };

  // Placeholder for speech input
  const handleSpeechInput = () => {
    alert('Speech input is not implemented yet.');
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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>OllieiQ App</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {modelsLoading ? (
            <CircularProgress size={22} sx={{ color: '#00bcd4', mr: 2 }} />
          ) : (
            <Select
              value={model}
              onChange={e => setModel(e.target.value)}
              size="small"
              sx={{ minWidth: 340, background: '#fff' }}
              MenuProps={{ PaperProps: { style: { maxHeight: 350 } } }}
            >
              {sortedModels.length === 0 ? (
                <MenuItem disabled>No models found</MenuItem>
              ) : sortedModels.map(m => (
                <MenuItem value={m.id} key={m.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      <span style={{ fontSize: 12, color: '#666' }}>{m.provider} &mdash; ctx: {m.context_length || '?'} tokens</span>
                    </Box>
                    <Tooltip title={favorites.includes(m.id) ? 'Unfavorite' : 'Favorite'}>
                      <IconButton size="small" onClick={e => { e.stopPropagation(); toggleFavorite(m.id); }}>
                        {favorites.includes(m.id) ? <StarIcon sx={{ color: '#FFD600' }} /> : <StarBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        {modelsError && <Typography variant="caption" color="error" sx={{ ml: 2 }}>{modelsError}</Typography>}
        {/* Model Details */}
        {selectedModelDetails && (
          <Box sx={{ mb: 2, textAlign: 'left', background: '#f4f4f4', borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{selectedModelDetails.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Provider: {selectedModelDetails.provider} | Context Window: {selectedModelDetails.context_length || '?'} tokens
            </Typography>
            {selectedModelDetails.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>{selectedModelDetails.description}</Typography>
            )}
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            label="Ask something..."
            disabled={loading}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleFileUpload} variant="outlined">File</Button>
          <Button onClick={handleSpeechInput} variant="outlined">🎤</Button>
          <Button onClick={handleSend} variant="contained" endIcon={<SendIcon />} disabled={loading || !prompt || modelsLoading}>Send</Button>
        </Box>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {response && (
          <Paper elevation={1} sx={{ mt: 2, p: 2, background: '#f8f8f8' }}>
            <Typography variant="subtitle1" color="secondary" fontWeight={700}>AI Response</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontFamily: 'Fira Mono, monospace' }}>{response}</Typography>
          </Paper>
        )}
      </Paper>
      <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>Request History</Typography>
        <Divider sx={{ mb: 1 }} />
        <List>
          {history.length === 0 && <ListItem><ListItemText primary="No history yet." /></ListItem>}
          {history.map((item, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={item.prompt}
                secondary={<>
                  <Typography component="span" variant="caption" color="text.secondary">{item.model} | {item.timestamp}</Typography><br />
                  <Typography component="span" variant="body2">{item.response}</Typography>
                </>}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;