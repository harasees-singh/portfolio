/**
 * MobileTabBar — the bottom thumb-zone bar shown only on phones.
 *
 * Locks down the link list and accessibility contract: every external
 * profile must have a matching `aria-label`, open in a new tab safely,
 * and the bar itself must declare an `aria-label` so screen readers
 * announce its purpose.
 */
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MobileTabBar } from '../../../src/components/layout/MobileTabBar';

describe('<MobileTabBar />', () => {
  it('declares an accessible label for the nav landmark', () => {
    render(<MobileTabBar />);
    const nav = screen.getByRole('navigation', { name: /quick contact/i });
    expect(nav).toBeInTheDocument();
  });

  it('renders Email + every external profile + a Channel jump link', () => {
    render(<MobileTabBar />);
    const nav = screen.getByRole('navigation', { name: /quick contact/i });
    for (const label of ['Email', 'GitHub', 'LinkedIn', 'Codeforces', 'Open Channel']) {
      expect(within(nav).getByLabelText(label), `missing tab bar item: ${label}`).toBeInTheDocument();
    }
  });

  it('opens external profile links in a new tab with safe rel attributes', () => {
    render(<MobileTabBar />);
    for (const label of ['GitHub', 'LinkedIn', 'Codeforces']) {
      const link = screen.getByLabelText(label);
      expect(link, `${label} must target _blank`).toHaveAttribute('target', '_blank');
      expect(link, `${label} must include noopener for security`).toHaveAttribute(
        'rel',
        expect.stringMatching(/noopener/),
      );
    }
  });

  it('does NOT open the in-page Channel link in a new tab', () => {
    render(<MobileTabBar />);
    const channel = screen.getByLabelText('Open Channel');
    expect(channel).toHaveAttribute('href', '#contact');
    expect(channel).not.toHaveAttribute('target');
  });

  it('uses the Material Symbols icon slot for every item', () => {
    const { container } = render(<MobileTabBar />);
    // Every item has a `.mobile-bar__icon` wrapper with an inline SVG.
    const icons = container.querySelectorAll('.mobile-bar__icon');
    expect(icons.length, 'one icon slot per tab bar item').toBe(5);
  });
});
