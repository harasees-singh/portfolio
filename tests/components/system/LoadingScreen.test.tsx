/**
 * LoadingScreen — the descent loader. Tests cover:
 *
 *   - The loader exposes a polite live region with a meaningful label
 *     (so screen-reader users know the page is loading, not broken).
 *   - It is fully unmounted when `visible` is false (otherwise the
 *     hidden DOM keeps stealing keyboard focus on iOS).
 *   - The eyebrow + title + sub copy are stable text the user can rely
 *     on while the scene warms up.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from '../../../src/components/system/LoadingScreen';

describe('<LoadingScreen />', () => {
  it('renders a polite live region with a meaningful label', () => {
    render(<LoadingScreen visible />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-label', expect.stringMatching(/loading deep-sea scene/i));
  });

  it('shows the calibration copy while visible', () => {
    render(<LoadingScreen visible />);
    expect(screen.getByText(/initializing descent/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /calibrating pressure systems/i })).toBeInTheDocument();
    expect(screen.getByText(/loading deep-sea telemetry/i)).toBeInTheDocument();
  });

  it('renders nothing when visible is false', () => {
    const { container } = render(<LoadingScreen visible={false} />);
    expect(container.querySelector('.loader')).toBeNull();
  });
});
