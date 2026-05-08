/**
 * TopNav — the brand monogram, social row, depth telemetry, and "Open
 * Channel" CTA at the top of every page.
 *
 * Locks down the structural pieces a future change should never silently
 * remove: brand link to #surface, accessible profile labels, telemetry
 * with `aria-live="polite"`, and the contact CTA pointing at #contact.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopNav } from '../../src/components/TopNav';

describe('<TopNav />', () => {
  it('renders the brand monogram as a link back to #surface', () => {
    render(<TopNav />);
    const brand = screen.getByRole('link', { name: /return to surface/i });
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', '#surface');
    expect(brand).toHaveTextContent(/harasees singh/i);
  });

  it('exposes the three external profiles with accessible labels', () => {
    render(<TopNav />);
    for (const label of ['GitHub', 'LinkedIn', 'Codeforces']) {
      const link = screen.getByRole('link', { name: label });
      expect(link, `missing ${label} link`).toBeInTheDocument();
      expect(link, `${label} link must open in a new tab`).toHaveAttribute('target', '_blank');
      expect(link, `${label} link must be safe to open in a new tab`).toHaveAttribute(
        'rel',
        expect.stringMatching(/noopener/),
      );
    }
  });

  it('renders the depth telemetry as a polite live region', () => {
    render(<TopNav currentDepth={1234} />);
    const telemetry = screen.getByLabelText(/current depth/i);
    expect(telemetry).toBeInTheDocument();
    expect(telemetry).toHaveAttribute('aria-live', 'polite');
    // 5-digit zero-padded readout so the pill width never changes.
    expect(telemetry).toHaveTextContent('01234');
    expect(telemetry).toHaveTextContent(/M$/);
  });

  it('renders the contact CTA pointing at #contact', () => {
    render(<TopNav />);
    const cta = screen.getByRole('link', { name: /open channel/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '#contact');
  });

  it('formats the depth readout with leading zeros and clamps the max', () => {
    render(<TopNav currentDepth={99999999} />);
    const telemetry = screen.getByLabelText(/current depth/i);
    // Clamp at 99,999 to keep the pill width stable.
    expect(telemetry).toHaveTextContent('99999');
  });
});
