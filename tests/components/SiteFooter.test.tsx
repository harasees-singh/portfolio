/**
 * SiteFooter — the telemetry strip beneath the descent.
 *
 * Locks down the structure of the footer's labelled key/value groups so
 * that future style changes can't accidentally remove a row, and that the
 * compile-time `__APP_VERSION__` constant from `vite.config.ts` actually
 * reaches the rendered DOM.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from '../../src/components/SiteFooter';

describe('<SiteFooter />', () => {
  it('renders the contentinfo landmark with a stable id', () => {
    render(<SiteFooter />);
    const region = screen.getByRole('contentinfo');
    expect(region).toBeInTheDocument();
    expect(region.closest('footer')).toHaveAttribute('id', 'terminal');
  });

  it('renders the Build / Stack / Pressure key+value rows', () => {
    render(<SiteFooter />);
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Stack')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();
    // Pressure is a hard-coded poetic value, but the unit & format
    // matter for layout — guard against a future "1.1k atm" rewrite.
    expect(screen.getByText(/1100 atm/i)).toBeInTheDocument();
  });

  it('renders the every entry of the build stack', () => {
    render(<SiteFooter />);
    // The stack value is a single text node joined with " · " — assert each tech appears.
    for (const tech of ['React', 'TypeScript', 'Three.js', 'Framer', 'Vite']) {
      expect(screen.getByText(new RegExp(tech))).toBeInTheDocument();
    }
  });

  it('surfaces the compile-time __APP_VERSION__ in the build cell', () => {
    render(<SiteFooter />);
    // Vitest's `define` block injects the string from package.json.
    expect(screen.getByText(/^v\d+\.\d+\.\d+/)).toBeInTheDocument();
  });

  it('renders the copyright with the current year', () => {
    render(<SiteFooter />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year} Harasees Singh`))).toBeInTheDocument();
  });
});
