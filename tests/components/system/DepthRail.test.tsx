/**
 * DepthRail — the fixed side rail with a button per zone. Tests cover
 * the contract that matters for keyboard / screen-reader users: every
 * zone is exposed as a button with a meaningful aria-label, and clicking
 * one scrolls to the matching DOM section.
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DepthRail } from '../../../src/components/system/DepthRail';

describe('<DepthRail />', () => {
  it('declares an accessible label for the rail landmark', () => {
    render(<DepthRail />);
    expect(screen.getByRole('complementary', { name: /depth zones/i })).toBeInTheDocument();
  });

  it('exposes every zone as a button with a "Jump to … zone" aria-label', () => {
    render(<DepthRail />);
    const expected = ['Surface', 'Sunlit', 'Twilight', 'Midnight', 'Abyssal', 'Hadal', 'Terminal'];
    for (const label of expected) {
      const btn = screen.getByRole('button', { name: new RegExp(`jump to ${label} zone`, 'i') });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute('type', 'button');
    }
  });

  it('marks the first zone as active on initial mount', () => {
    render(<DepthRail />);
    const surface = screen.getByRole('button', { name: /jump to surface zone/i });
    expect(surface).toHaveAttribute('data-active', 'true');
  });

  it('scrolls the matching DOM section into view when a zone is clicked', async () => {
    document.body.innerHTML = '<div id="twilight" />';
    const target = document.getElementById('twilight')!;
    // The component uses `window.scrollTo` (not scrollIntoView) so spy on that.
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    // Force getBoundingClientRect to return a sensible value so the
    // smooth-scroll math doesn't return NaN under jsdom.
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 800,
      bottom: 1400,
      left: 0,
      right: 0,
      width: 0,
      height: 600,
      x: 0,
      y: 800,
      toJSON: () => ({}),
    });
    render(<DepthRail />);
    await userEvent.click(screen.getByRole('button', { name: /jump to twilight zone/i }));
    expect(scrollSpy).toHaveBeenCalled();
    const args = scrollSpy.mock.calls[scrollSpy.mock.calls.length - 1][0] as ScrollToOptions;
    expect(args.behavior).toBe('smooth');
    expect(typeof args.top).toBe('number');
  });

  it('silently no-ops when the target section is missing from the DOM', async () => {
    render(<DepthRail />);
    // No `#hadal` in the DOM — click must not throw.
    await expect(
      userEvent.click(screen.getByRole('button', { name: /jump to hadal zone/i })),
    ).resolves.not.toThrow();
  });
});
