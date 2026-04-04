/**
 * Tests: CertificateVerifyModal
 * - Renders when open=true, hidden when open=false
 * - Shows loading on submit
 * - Calls certificateApi.verify with the entered cert number
 * - Navigates to /verify-certificate?cert=… on success
 * - Shows error message on failure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CertificateVerifyModal from '../components/landing/CertificateVerifyModal';

// ---------------------------------------------------------------------------
// Mock certificateApi
// ---------------------------------------------------------------------------
const mockVerify = vi.fn();
vi.mock('../services/learning.services', () => ({
  certificateApi: { verify: (...args: unknown[]) => mockVerify(...args) },
}));

// ---------------------------------------------------------------------------
// Mock useNavigate
// ---------------------------------------------------------------------------
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const orig = await importOriginal<typeof import('react-router-dom')>();
  return { ...orig, useNavigate: () => mockNavigate };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const renderModal = (open: boolean, onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <CertificateVerifyModal open={open} onClose={onClose} />
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('CertificateVerifyModal', () => {
  beforeEach(() => {
    mockVerify.mockReset();
    mockNavigate.mockReset();
  });

  it('renders nothing when open=false', () => {
    const { container } = renderModal(false);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal when open=true', () => {
    renderModal(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/TASC-2024/i)).toBeInTheDocument();
  });

  it('disables Verify button when input is empty', () => {
    renderModal(true);
    const btn = screen.getByRole('button', { name: /verify certificate/i });
    expect(btn).toBeDisabled();
  });

  it('enables Verify button when input has text', async () => {
    const user = userEvent.setup();
    renderModal(true);
    await user.type(screen.getByPlaceholderText(/TASC-2024/i), 'TASC-2024-00001');
    const btn = screen.getByRole('button', { name: /verify certificate/i });
    expect(btn).not.toBeDisabled();
  });

  it('calls certificateApi.verify with trimmed cert number on submit', async () => {
    mockVerify.mockResolvedValueOnce({ data: {} });
    const user = userEvent.setup();
    renderModal(true);
    await user.type(screen.getByPlaceholderText(/TASC-2024/i), 'TASC-2024-00001');
    await user.click(screen.getByRole('button', { name: /verify certificate/i }));
    await waitFor(() => expect(mockVerify).toHaveBeenCalledWith('TASC-2024-00001'));
  });

  it('navigates to /verify-certificate?cert=… on success', async () => {
    mockVerify.mockResolvedValueOnce({ data: {} });
    const user = userEvent.setup();
    renderModal(true);
    await user.type(screen.getByPlaceholderText(/TASC-2024/i), 'TASC-2024-00001');
    await user.click(screen.getByRole('button', { name: /verify certificate/i }));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/verify-certificate?cert=TASC-2024-00001')
    );
  });

  it('shows error message when verify call fails', async () => {
    mockVerify.mockRejectedValueOnce(new Error('Not found'));
    const user = userEvent.setup();
    renderModal(true);
    await user.type(screen.getByPlaceholderText(/TASC-2024/i), 'BAD-CERT');
    await user.click(screen.getByRole('button', { name: /verify certificate/i }));
    await waitFor(() =>
      expect(screen.getByText(/certificate not found/i)).toBeInTheDocument()
    );
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    renderModal(true, onClose);
    // Click the backdrop (the outer div with the handler)
    const backdrop = document.querySelector('.cert-modal-backdrop') as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal(true, onClose);
    await user.click(screen.getByLabelText(/close/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
