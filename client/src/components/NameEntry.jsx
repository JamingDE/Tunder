import { useState } from 'react';

export default function NameEntry({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="name-entry-screen">
      <div className="entry-card">
        <div className="logo">
          <h1>Tunder</h1>
          <span className="logo-fire">🔥</span>
        </div>
        <p className="tagline">Dating für die beste Zeit des Lebens</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Dein Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
            autoFocus
          />
          <button type="submit" className="start-btn" disabled={!name.trim()}>
            Los geht's! 🔥
          </button>
        </form>
        <p className="disclaimer">100% kostenlos • Keine Verification needed</p>
      </div>
    </div>
  );
}
