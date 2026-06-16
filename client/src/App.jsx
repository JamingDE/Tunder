import { useState, useEffect, useCallback } from 'react';
import NameEntry from './components/NameEntry';
import SwipeDeck from './components/SwipeDeck';
import Chat from './components/Chat';
import LegalModal from './components/LegalModal';

const SCREENS = { ENTRY: 'entry', SWIPE: 'swipe', MATCHES: 'matches', CHAT: 'chat' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.ENTRY);
  const [userName, setUserName] = useState(sessionStorage.getItem('tunder_user') || '');
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchAnimation, setShowMatchAnimation] = useState(null);
  const [legalModal, setLegalModal] = useState(null);
  const [showChatList, setShowChatList] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (userName) {
      sessionStorage.setItem('tunder_user', userName);
    }
  }, [userName]);

  useEffect(() => {
    if (screen === SCREENS.SWIPE && profiles.length === 0) {
      fetch('/api/profiles')
        .then(r => r.json())
        .then(data => {
          const johnny = data.find(p => p.id === 19);
          const others = data.filter(p => p.id !== 19).sort(() => Math.random() - 0.5);
          const johnnyIndex = Math.floor(Math.random() * 3) + 1;
          others.splice(johnnyIndex, 0, johnny);
          setProfiles(others);
        });
    }
  }, [screen, profiles.length]);

  const handleNameSubmit = (name) => {
    setUserName(name);
    setScreen(SCREENS.SWIPE);
  };

  const handleSwipe = useCallback((direction) => {
    if (direction === 'right') {
      const matchChance = Math.random();
      if (matchChance > 0.3) {
        const matchedProfile = profiles[currentIndex];
        setMatches(prev => [...prev, matchedProfile]);
        setShowMatchAnimation(matchedProfile);
      }
    }
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setScreen(SCREENS.MATCHES);
    }
  }, [currentIndex, profiles]);

  const openChat = (profile) => {
    setActiveChat(profile);
    setScreen(SCREENS.CHAT);
  };

  const backToSwipe = () => {
    setScreen(SCREENS.SWIPE);
    setActiveChat(null);
  };

  const backToMatches = () => {
    setScreen(SCREENS.MATCHES);
    setActiveChat(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClearData = () => {
    setUserName('');
    setProfiles([]);
    setMatches([]);
    setActiveChat(null);
    setCurrentIndex(0);
    setShowMatchAnimation(null);
    setScreen(SCREENS.ENTRY);
  };

  const Footer = () => (
    <div className="footer">
      <button onClick={() => setLegalModal('impressum')}>Impressum</button>
      <button onClick={() => setLegalModal('datenschutz')}>Datenschutz</button>
      <span className="yt-hidden">
        <a href="https://youtube.com/@jamingde" target="_blank" rel="noopener noreferrer">
          Tunder Partner
        </a>
      </span>
    </div>
  );

  if (screen === SCREENS.ENTRY) {
    return (
      <div className="app-container entry-container">
        <NameEntry onSubmit={handleNameSubmit} />
        <Footer />
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} onClearData={handleClearData} />}
      </div>
    );
  }

  if (screen === SCREENS.SWIPE) {
    return (
      <div className="app-container">
        <div className="swipe-header">
          <h1>Tunder 🔥</h1>
          <div className="header-actions">
            <button className="chat-list-btn" onClick={() => setShowChatList(true)}>
              💬 {matches.length > 0 && <span className="badge">{matches.length}</span>}
            </button>
            <button className="fullscreen-btn" onClick={toggleFullscreen} title="Vollbild">
              {isFullscreen ? '⊡' : '⛶'}
            </button>
          </div>
        </div>
        <div className="swipe-main">
          <SwipeDeck
            profiles={profiles}
            currentIndex={currentIndex}
            onSwipe={handleSwipe}
            userName={userName}
          />
        </div>
        {showMatchAnimation && (
          <div className="match-animation">
            <div className="match-content">
              <h1>It's a Match!</h1>
              <p>{showMatchAnimation.name} findet dich auch gut!</p>
              <img src={showMatchAnimation.image} alt={showMatchAnimation.name} className="match-image" draggable={false} onDragStart={(e) => e.preventDefault()} />
              <button onClick={() => { setShowMatchAnimation(null); openChat(showMatchAnimation); }}>
                Schreibe ihr/ihm!
              </button>
              <button onClick={() => setShowMatchAnimation(null)} className="skip-btn">
                Weiter swipen
              </button>
            </div>
          </div>
        )}
        {showChatList && (
          <div className="chat-list-overlay" onClick={() => setShowChatList(false)}>
            <div className="chat-list-panel" onClick={(e) => e.stopPropagation()}>
              <div className="chat-list-header">
                <h2>Deine Chats</h2>
                <button className="close-chat-list" onClick={() => setShowChatList(false)}>✕</button>
              </div>
              <div className="chat-list-items">
                {matches.length === 0 ? (
                  <p className="no-chats">Noch keine Chats. Swipe right!</p>
                ) : (
                  matches.map(match => (
                    <div key={match.id} className="chat-list-item" onClick={() => { setShowChatList(false); openChat(match); }}>
                      <img src={match.image} alt={match.name} />
                      <div className="chat-item-info">
                        <h4>{match.name}</h4>
                        <span className="online-dot-small"></span>
                        <span className="online-text-small">Online</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        <Footer />
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} onClearData={handleClearData} />}
      </div>
    );
  }

  if (screen === SCREENS.MATCHES) {
    return (
      <div className="app-container">
        <div className="swipe-header">
          <h1>Deine Matches 🔥</h1>
        </div>
        <div className="matches-screen">
          {matches.length === 0 ? (
            <p className="no-matches">Noch keine Matches. Weiter swipen!</p>
          ) : (
            <div className="matches-grid">
              {matches.map(match => (
                <div key={match.id} className="match-card" onClick={() => openChat(match)}>
                  <img src={match.image} alt={match.name} draggable={false} onDragStart={(e) => e.preventDefault()} />
                  <div className="match-info">
                    <h3>{match.name}, {match.age}</h3>
                    <span className="online-dot"></span>
                    <span className="online-text">Online</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
        {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} onClearData={handleClearData} />}
      </div>
    );
  }

  if (screen === SCREENS.CHAT && activeChat) {
    return (
      <Chat
        profile={activeChat}
        userName={userName}
        onBack={backToMatches}
      />
    );
  }

  return null;
}
