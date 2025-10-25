import { useState } from 'react';

interface PasswordDialogProps {
  onClose: () => void;
  onSuccess: () => void;
  levelNumber: number;
}

export default function PasswordDialog({ onClose, onSuccess, levelNumber }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password.toUpperCase() === 'POTION2025') {
      onSuccess();
      onClose();
    } else {
      setError('Wrong password! Contact @orouk.sami on Instagram');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2>Robot Solver</h2>
        <p>Level {levelNumber} - Enter password:</p>
        
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        
        {error && <p style={{color: 'red'}}>{error}</p>}
        
        <div style={{marginTop: '20px'}}>
          <button onClick={handleSubmit} style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Unlock
          </button>
          
          <button onClick={onClose} style={{
            padding: '10px 20px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
        
        <p style={{fontSize: '12px', marginTop: '15px'}}>
          Don't have password? Follow @orouk.sami on Instagram
        </p>
      </div>
    </div>
  );
}
