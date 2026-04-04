import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { certificateApi } from '../../services/learning.services';
import type { Certificate } from '../../types/types';

const CertificateValidationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const doVerify = useCallback(async (certNum: string) => {
    if (!certNum.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSearched(true);
    try {
      const { data } = await certificateApi.verify(certNum.trim());
      setResult(data);
    } catch {
      setError('Certificate not found. Please check the certificate number and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cert = searchParams.get('cert');
    if (cert) {
      setCertificateNumber(cert);
      doVerify(cert);
    }
  }, [searchParams, doVerify]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(certificateNumber);
  };

  const isValid = result?.is_valid && !result?.is_expired;
  const issuedDate = result ? new Date(result.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const expiryDate = result?.expiry_date ? new Date(result.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cert-page { min-height: 100vh; background: linear-gradient(145deg,#fafaf8 0%, #fff7ed 50%, #fafaf8 100%); font-family: 'Inter', system-ui, sans-serif; }
        .cert-container { max-width: 640px; margin: 0 auto; padding: 40px 20px 80px; }
        .cert-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 40px -8px rgba(0,0,0,0.1);
          overflow: hidden;
          animation: fadeInUp 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .cert-card-header {
          padding: 40px 40px 32px;
          background: linear-gradient(135deg,#fffbf0,#fff7ed);
          border-bottom: 1px solid #fde8c8;
          text-align: center;
        }
        .cert-card-body { padding: 36px 40px 40px; }
        .cert-icon-ring {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg,rgba(255,164,36,0.2),rgba(249,115,22,0.2));
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 16px; box-shadow: 0 0 0 8px rgba(255,164,36,0.08);
        }
        .cert-input {
          width: 100%; padding: 14px 16px; border: 1.5px solid #e4e4e7;
          border-radius: 12px; font-size: 0.95rem; color: #18181b;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box; font-family: inherit; background: #fafafa;
        }
        .cert-input:focus { border-color: #ffa424; box-shadow: 0 0 0 3px rgba(255,164,36,0.15); background: white; }
        .cert-input::placeholder { color: #a1a1aa; }
        .cert-btn {
          padding: 14px 28px; background: linear-gradient(135deg,#ffa424,#f97316);
          color: white; border: none; border-radius: 12px; font-size: 0.95rem;
          font-weight: 700; cursor: pointer; transition: all 0.2s;
          white-space: nowrap; font-family: inherit; flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .cert-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,164,36,0.4); }
        .cert-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .result-card {
          border-radius: 16px; padding: 28px; border: 2px solid;
          animation: fadeInUp 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .result-valid { border-color: #10b981; background: linear-gradient(135deg,rgba(16,185,129,0.04),rgba(16,185,129,0.08)); }
        .result-expired { border-color: #f59e0b; background: linear-gradient(135deg,rgba(245,158,11,0.04),rgba(245,158,11,0.08)); }
        .result-invalid { border-color: #ef4444; background: linear-gradient(135deg,rgba(239,68,68,0.04),rgba(239,68,68,0.08)); }
        .result-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 0.85rem; font-weight: 700; margin-bottom: 20px;
        }
        .badge-valid { background: rgba(16,185,129,0.12); color: #059669; }
        .badge-expired { background: rgba(245,158,11,0.12); color: #d97706; }
        .badge-invalid { background: rgba(239,68,68,0.12); color: #dc2626; }
        .detail-row {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05);
          gap: 16px;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-size: 0.85rem; color: #71717a; flex-shrink: 0; }
        .detail-value { font-size: 0.9rem; font-weight: 600; color: #18181b; text-align: right; }
        .cert-number-badge {
          display: inline-block; padding: 4px 10px;
          background: rgba(255,164,36,0.1); color: #b45309;
          border-radius: 6px; font-family: 'Courier New', monospace;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.03em;
        }
        .cert-spinner {
          width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: #71717a; font-size: 0.875rem; font-family: inherit;
          padding: 0; margin-bottom: 24px; transition: color 0.2s;
        }
        .back-btn:hover { color: #18181b; }
        .trust-bar {
          display: flex; align-items: center; justify-content: center; gap: 20px;
          margin-top: 32px; padding: 16px; flex-wrap: wrap;
        }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #a1a1aa; }
        @media (max-width: 520px) {
          .cert-card-header { padding: 28px 20px 24px; }
          .cert-card-body { padding: 24px 20px 28px; }
        }
        @media print {
          .cert-page { background: white; }
          .back-btn, .cert-form-row, .trust-bar { display: none !important; }
        }
      `}</style>

      <div className="cert-page">
        <div className="cert-container">

          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left" style={{ fontSize: '0.8rem' }} />
            Back
          </button>

          <div className="cert-card">
            {/* Header */}
            <div className="cert-card-header">
              <div>
                <div className="cert-icon-ring">
                  <i className="fas fa-certificate" style={{ fontSize: '2rem', color: '#ffa424' }} />
                </div>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Certificate Verification
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#71717a', margin: 0 }}>
                Instantly verify the authenticity of any TASC certificate
              </p>
            </div>

            {/* Body */}
            <div className="cert-card-body">
              {/* Search form */}
              <form onSubmit={handleVerify} style={{ display: 'flex', gap: 10, marginBottom: 24 }} className="cert-form-row">
                <input
                  className="cert-input"
                  type="text"
                  id="cert-number-field"
                  placeholder="Enter certificate number (e.g. TASC-2024-00001)"
                  value={certificateNumber}
                  onChange={e => { setCertificateNumber(e.target.value); setError(''); }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button className="cert-btn" type="submit" disabled={loading || !certificateNumber.trim()}>
                  {loading ? <span className="cert-spinner" /> : <i className="fas fa-search" />}
                  {loading ? 'Verifying…' : 'Verify'}
                </button>
              </form>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '14px 16px', borderRadius: 12, marginBottom: 20,
                  background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
                  color: '#b91c1c', fontSize: '0.875rem', lineHeight: 1.5,
                }}>
                  <i className="fas fa-exclamation-circle" style={{ marginTop: 2, flexShrink: 0 }} />
                  {error}
                </div>
              )}

              {/* Result */}
              {result && (
                <div className={`result-card ${isValid ? 'result-valid' : result?.is_expired ? 'result-expired' : 'result-invalid'}`}>
                  {/* Status badge */}
                  <div>
                    <span className={`result-badge ${isValid ? 'badge-valid' : result?.is_expired ? 'badge-expired' : 'badge-invalid'}`}>
                      <i className={`fas fa-${isValid ? 'check-circle' : result?.is_expired ? 'clock' : 'times-circle'}`} />
                      {isValid ? 'Valid Certificate' : result?.is_expired ? 'Expired Certificate' : 'Invalid Certificate'}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div>
                    <div className="detail-row">
                      <span className="detail-label">Certificate Number</span>
                      <span className="cert-number-badge">{result.certificate_number}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Issued To</span>
                      <span className="detail-value">{result.user_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Course</span>
                      <span className="detail-value" style={{ maxWidth: '60%' }}>{result.course_title}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date of Award</span>
                      <span className="detail-value">{issuedDate}</span>
                    </div>
                    {expiryDate && (
                      <div className="detail-row">
                        <span className="detail-label">Expiry Date</span>
                        <span className="detail-value" style={{ color: result?.is_expired ? '#d97706' : '#18181b' }}>{expiryDate}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">Status</span>
                      <span className="detail-value" style={{ color: isValid ? '#059669' : result?.is_expired ? '#d97706' : '#dc2626' }}>
                        {isValid ? 'Active & Verified' : result?.is_expired ? 'Expired' : 'Not Valid'}
                      </span>
                    </div>
                  </div>

                  {/* Print/Share actions */}
                  {isValid && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(16,185,129,0.15)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => window.print()}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '8px 16px', borderRadius: 8, border: '1.5px solid rgba(16,185,129,0.4)',
                          background: 'rgba(16,185,129,0.08)', color: '#059669',
                          fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.2s', fontFamily: 'inherit',
                        }}
                      >
                        <i className="fas fa-print" /> Print / Save PDF
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Idle state */}
              {!searched && !loading && (
                <div style={{ textAlign: 'center', padding: '24px 0 8px', color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: '1.5rem', marginBottom: 8, display: 'block', color: '#e4e4e7' }} />
                  All TASC certificates are cryptographically signed.<br />
                  Enter a certificate number above to verify its authenticity.
                </div>
              )}
            </div>
          </div>

          {/* Trust bar */}
          <div className="trust-bar">
            <div className="trust-item"><i className="fas fa-lock" style={{ color: '#10b981' }} /> Tamper-proof verification</div>
            <div className="trust-item"><i className="fas fa-bolt" style={{ color: '#ffa424' }} /> Instant results</div>
            <div className="trust-item"><i className="fas fa-globe" style={{ color: '#6366f1' }} /> Globally recognized</div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CertificateValidationPage;
