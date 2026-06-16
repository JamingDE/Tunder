import { useState, useRef } from 'react';

export default function SwipeDeck({ profiles, currentIndex, onSwipe, userName }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const cardRef = useRef(null);

  const profile = profiles[currentIndex];
  if (!profile) return null;

  const handleMouseDown = (e) => {
    startX.current = e.clientX || e.touches?.[0]?.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX;
    setDragX(currentX - startX.current);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (dragX > 100) {
      onSwipe('right');
    } else if (dragX < -100) {
      onSwipe('left');
    }
    setDragX(0);
  };

  const rotation = dragX * 0.1;
  const opacityLike = Math.min(Math.max(dragX / 100, 0), 1);
  const opacityNope = Math.min(Math.max(-dragX / 100, 0), 1);

  const buttonSwipe = (dir) => {
    onSwipe(dir);
  };

  return (
    <div className="swipe-screen">
      <div className="card-container">
        {profiles.length > currentIndex + 1 && (
          <div className="card card-background">
            <img src={profiles[currentIndex + 1].image} alt={profiles[currentIndex + 1].name} draggable={false} onDragStart={(e) => e.preventDefault()} />
          </div>
        )}
        <div
          ref={cardRef}
          className="card"
          style={{
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onDragStart={(e) => e.preventDefault()}
        >
          <img src={profile.image} alt={profile.name} draggable={false} onDragStart={(e) => e.preventDefault()} />
          <div className="card-info">
            <h2>{profile.name}, {profile.age}</h2>
            <p className="bio">{profile.bio}</p>
            <div className="interests">
              {profile.interests.map((interest, i) => (
                <span key={i} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>
          <div className="overlay-like" style={{ opacity: opacityLike }}>LIKE</div>
          <div className="overlay-nope" style={{ opacity: opacityNope }}>NOPE</div>
        </div>
      </div>
      <div className="swipe-buttons">
        <button className="swipe-btn nope-btn" onClick={() => buttonSwipe('left')}>
          ✕
        </button>
        <button className="swipe-btn superlike-btn" onClick={() => buttonSwipe('right')}>
          ⭐
        </button>
        <button className="swipe-btn like-btn" onClick={() => buttonSwipe('right')}>
          ♥
        </button>
      </div>
    </div>
  );
}
