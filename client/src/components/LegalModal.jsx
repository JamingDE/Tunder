import { useState } from 'react';

export default function LegalModal({ type, onClose, onClearData }) {
  const isImpressum = type === 'impressum';

  const handleClearData = () => {
    if (window.confirm('Alle Daten wirklich löschen? Chats, Matches und Name werden zurückgesetzt.')) {
      sessionStorage.clear();
      onClearData();
      onClose();
    }
  };

  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="legal-close" onClick={onClose}>✕</button>
        <h1>{isImpressum ? 'Impressum' : 'Datenschutz'}</h1>
        {isImpressum ? (
          <div className="legal-content">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              Tunder GmbH<br />
              Mühlenstraße 42<br />
              10115 Berlin
            </p>
            <h2>Vertreten durch:</h2>
            <p>Gerd Müller, Geschäftsführer</p>
            <h2>Kontakt:</h2>
            <p>
              Telefon: +49 (0) 30 12345678<br />
              E-Mail: info@tunder-dating.de
            </p>
            <h2>Umsatzsteuer-ID:</h2>
            <p>DE123456789</p>
            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
            <p>
              Gerd Müller<br />
              Mühlenstraße 42<br />
              10115 Berlin
            </p>
            <p className="legal-fine">Alle Daten fiktiv. Tunder ist eine Satire-App.</p>
          </div>
        ) : (
          <div className="legal-content">
            <h2>1. Datenschutz</h2>
            <p>Wir speichern nichts. Ihr Chat bleibt lokal. Versprochen.</p>
            <h2>2. Cookies</h2>
            <p>Keine Cookies. Wir sind keine Spione.</p>
            <h2>3. KI-Chats</h2>
            <p>Alle Gespräche werden an OpenRouter gesendet. Die alten Menschen sind KI.</p>
            <h2>4. Haftung</h2>
            <p>Wir haften für nichts. Das ist ein Troll-Projekt.</p>
            <button className="clear-data-btn" onClick={handleClearData}>
              🗑️ Alle Daten löschen
            </button>
            <p className="legal-fine">Diese Seite ist Satire. Keine echten Daten.</p>
          </div>
        )}
      </div>
    </div>
  );
}
