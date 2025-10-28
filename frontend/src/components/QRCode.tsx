import React, { useEffect, useRef, useState } from 'react';
import QRCodeLib from 'qrcode';
import './QRCode.css';

const QRCode = () => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const gameURL = 'https://water-sort-frontend.onrender.com';

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, gameURL, {
        width: 300,
        margin: 2,
        color: { dark: '#667eea', light: '#ffffff' }
      });
    }
  }, []);

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(gameURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const input = document.createElement('input');
      input.value = gameURL;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'potion-sort-qr.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent('Check out Potion Sort! ' + gameURL);
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  return (
    <div className="qr-container">
      <div className="qr-content">
        <div className="logo">🧪</div>
        <h1>Share Potion Sort</h1>
        <p className="subtitle">Scan the QR code or share the link!</p>

        <div className="qr-section">
          <div className="qr-placeholder">
            <canvas ref={canvasRef} />
          </div>
          <p className="qr-info">
            <strong>Scan with your phone camera</strong>
          </p>
        </div>

        <div className="url-box" onClick={copyURL}>
          <span>{gameURL}</span>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={copyURL}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button className="btn btn-primary" onClick={downloadQR}>
            Download QR
          </button>
          <button className="btn btn-secondary" onClick={shareWhatsApp}>
            Share WhatsApp
          </button>
        </div>

        <div className="copyright">
          <p><strong>2025 Potion Sort by Sami Orouk. All Rights Reserved.</strong></p>
        </div>
      </div>

      {copied && <div className="notification">Copied!</div>}
    </div>
  );
};

export default QRCode;