import { useState, useRef, useEffect } from 'react';

export default function Chat({ profile, userName, onBack }) {
  const storageKey = `tunder_chat_${profile.id}`;
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    if (messages.length === 0) {
      sendFirstMessage();
    }
  }, []);

  const sendFirstMessage = async () => {
    const greetings = [
      `Hallo ${userName || 'Schatz'}! 😘`,
      `Na, sieht man sich? 🔥`,
      `Hey! Meine Enkelin sagt du siehst gut aus 😊`,
      `Moin! Was suchst du hier? 😏`
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    setTyping(true);
    setTimeout(() => {
      setMessages([{ sender: 'them', text: greeting }]);
      setTyping(false);
    }, 1500);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'me', text: userMessage }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          message: userMessage,
          userName: userName
        })
      });

      const data = await res.json();
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'them', text: data.reply }]);
        setTyping(false);
      }, 1000 + Math.random() * 1500);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'them', text: 'Hmm, mein Internet ist wieder mal schlecht 😤' }]);
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <img src={profile.image} alt={profile.name} className="chat-avatar" draggable={false} onDragStart={(e) => e.preventDefault()} />
        <div className="chat-user-info">
          <h3>{profile.name}, {profile.age}</h3>
          <span className="online-status">Online</span>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'me' ? 'message-me' : 'message-them'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {typing && (
          <div className="message message-them typing-indicator">
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe etwas..."
          className="chat-text-input"
        />
        <button onClick={sendMessage} className="send-btn" disabled={!input.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}
