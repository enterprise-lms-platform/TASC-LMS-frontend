import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificateApi } from '../../services/learning.services';

interface CertificateVerifyModalProps {
  open: boolean;
  onClose: () => void;
}

const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [certNumber, setCertNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = certNumber.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      await certificateApi.verify(trimmed);
      onClose();
      navigate(`/verify-certificate?cert=${encodeURIComponent(trimmed)}`);
    } catch {
      setError('Certificate not found. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  }, [certNumber, navigate, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cert-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeInModal 0.18s ease;
        }
        .cert-modal-card {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 480px;
          padding: 40px 36px 32px;
          box-shadow: 0 32px 64px -12px rgba(0,0,0,0.3);
          animation: slideUpModal 0.22s cubic-bezier(0.22,1,0.36,1);
          position: relative;
        }
        .cert-modal-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e4e4e7;
          border-radius: 10px;
          font-size: 0.95rem;
          color: #18181b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: inherit;
          background: #fafafa;
        }
        .cert-modal-input:focus {
          border-color: #ffa424;
          box-shadow: 0 0 0 3px rgba(255,164,36,0.15);
          background: white;
        }
        .cert-modal-input::placeholder { color: #a1a1aa; }
        .cert-modal-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #ffa424, #f97316);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .cert-modal-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(255,164,36,0.4);
        }
        .cert-modal-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .cert-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #71717a;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.15s;
          font-size: 1.1rem;
          line-height: 1;
        }
        .cert-modal-close:hover { background: #f4f4f5; color: #18181b; }
      `}</style>

      <div className="cert-modal-backdrop" onClick={handleBackdropClick}>
        <div className="cert-modal-card" role="dialog" aria-modal="true" aria-labelledby="cert-modal-title">
          <button className="cert-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>

          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,164,36,0.15), rgba(249,115,22,0.15))',
              marginBottom: 12,
            }}>
              <i className="fas fa-certificate" style={{ fontSize: '1.75rem', color: '#ffa424' }} />
            </div>
            <h2 id="cert-modal-title" style={{
              fontSize: '1.375rem', fontWeight: 800, color: '#18181b',
              margin: '0 0 6px', letterSpacing: '-0.01em',
            }}>
              Verify Certificate
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#71717a', margin: 0, lineHeight: 1.5 }}>
              Enter the certificate number found at the bottom of your TASC certificate to confirm its authenticity.
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              id="cert-number-input"
              className="cert-modal-input"
              type="text"
              placeholder="e.g. TASC-2024-00001"
              value={certNumber}
              onChange={e => { setCertNumber(e.target.value); setError(''); }}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#b91c1c', fontSize: '0.85rem',
              }}>
                <i className="fas fa-exclamation-circle" />
                {error}
              </div>
            )}

            <button className="cert-modal-btn" type="submit" disabled={loading || !certNumber.trim()}>
              {loading
                ? <><i className="fas fa-circle-notch fa-spin" style={{ marginRight: 8 }} />Verifying…</>
                : <><i className="fas fa-search" style={{ marginRight: 8 }} />Verify Certificate</>
              }
            </button>
          </form>

          <p style={{ fontSize: '0.78rem', color: '#a1a1aa', textAlign: 'center', margin: '16px 0 0', lineHeight: 1.5 }}>
            All TASC certificates are cryptographically signed and tamper-proof.
          </p>
        </div>
      </div>
    </>
  );
};

export default CertificateVerifyModal;
