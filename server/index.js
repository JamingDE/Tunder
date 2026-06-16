require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const profiles = require('./profiles');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/images', express.static(path.join(__dirname, '../images')));

const conversationHistory = {};

app.get('/api/profiles', (req, res) => {
  res.json(profiles);
});

app.post('/api/chat', async (req, res) => {
  const { profileId, message, userName } = req.body;

  if (!message || !profileId) {
    return res.status(400).json({ error: 'Message and profileId required' });
  }

  const profile = profiles.find(p => p.id === profileId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  if (!conversationHistory[profileId]) {
    conversationHistory[profileId] = [];
  }

  conversationHistory[profileId].push({ role: 'user', content: message });

  const systemPrompt = `Du bist ${profile.name}, ${profile.age} Jahre alt. Du bist auf der Dating-App Tunder. 
Deine Bio: "${profile.bio}"
Deine Interessen: ${profile.interests.join(', ')}
${profile.name === 'Johnny' ? 'Du bist Johnny Sins, der Multitalent. Sei charmant und mache anspielende Witze.' : 'Du bist ein typischer deutscher Senior auf Tinder. Sprich kurz, etwas krude, verwende Emojis, sei ein bisschen seltsam aber nett. Antworte immer auf Deutsch.'}
Antworte KURZ (max 2-3 Sätze). ${userName ? `Der User heißt ${userName}.` : ''}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://tunder.app',
        'X-Title': 'Tunder'
      },
      body: JSON.stringify({
        model: process.env.MODEL || 'openrouter/owl-alpha',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory[profileId].slice(-10)
        ],
        max_tokens: 150,
        temperature: 0.9
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Hmm, ich höre nicht gut 😅";

    conversationHistory[profileId].push({ role: 'assistant', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ reply: "Mein Internet ist weg... wieder mal 😤" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Tunder running on port ${PORT} 🔥`);
});
