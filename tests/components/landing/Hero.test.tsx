/**
 * Hero family — `<SurfaceEntry />`, `<Hero />`, `<ScrollHint />`,
 * `<ExploreLink />`. These are the shipped landing-page widgets, and the
 * tests document the contract they hold:
 *
 *   - `<SurfaceEntry />` keeps the wordmark + the meta strip with the
 *     three info pills (location, focus, status). The previous redesign
 *     dropped the meta strip silently and nobody noticed for a day.
 *   - `<Hero />` calls `onExplore('sunlit')` when the CTA is clicked.
 *   - `<ScrollHint />` calls `scrollIntoView` on the target id.
 *   - `<ExploreLink />` invokes its handler.
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExploreLink, Hero, ScrollHint, SurfaceEntry } from '../../../src/components/landing/Hero';

describe('<SurfaceEntry />', () => {
  it('renders the wordmark with the glowing period and blinking cursor', () => {
    const { container } = render(<SurfaceEntry />);
    const wordmark = container.querySelector('.surface-entry__wordmark');
    expect(wordmark).toBeInTheDocument();
    expect(wordmark).toHaveTextContent(/a deep dive into my work\./i);
    expect(container.querySelector('.surface-entry__period'), 'glowing period anchor').toBeInTheDocument();
    expect(container.querySelector('.surface-entry__cursor'), 'blinking cursor anchor').toBeInTheDocument();
  });

  it('renders the meta strip with location, focus, and the open-to-work status', () => {
    render(<SurfaceEntry />);
    const meta = screen.getByLabelText(/at a glance/i);
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveTextContent(/bengaluru/i);
    expect(meta).toHaveTextContent(/backend.*distributed systems/i);
    expect(meta).toHaveTextContent(/open to work/i);
  });

  it('embeds the scroll hint pointing at the sunlit hero', () => {
    render(<SurfaceEntry />);
    expect(screen.getByRole('button', { name: /scroll to descend/i })).toBeInTheDocument();
  });
});

describe('<Hero />', () => {
  it('renders as the landing page H1 with the sunlit eyebrow', () => {
    render(<Hero onExplore={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/charting the depths/i);
    expect(screen.getByText(/sunlit zone/i)).toBeInTheDocument();
  });

  it('fires onExplore("sunlit") when the explore CTA is clicked', async () => {
    const onExplore = vi.fn();
    render(<Hero onExplore={onExplore} />);
    const cta = screen.getByRole('button', { name: /chart the sunlit territories/i });
    await userEvent.click(cta);
    expect(onExplore).toHaveBeenCalledExactlyOnceWith('sunlit');
  });
});

describe('<ScrollHint />', () => {
  it('scrolls the target element into view on click', async () => {
    document.body.innerHTML = '<div id="next-section" />';
    render(<ScrollHint targetId="next-section" />);
    const target = document.getElementById('next-section')!;
    const spy = vi.spyOn(target, 'scrollIntoView');
    await userEvent.click(screen.getByRole('button', { name: /scroll to descend/i }));
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('is a no-op when the target id does not exist', async () => {
    render(<ScrollHint targetId="does-not-exist" />);
    // Clicking must not throw.
    await expect(
      userEvent.click(screen.getByRole('button', { name: /scroll to descend/i })),
    ).resolves.not.toThrow();
  });
});

describe('<ExploreLink />', () => {
  it('invokes the click handler', async () => {
    const onClick = vi.fn();
    render(<ExploreLink label="Dive in" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: /dive in/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the label inside its own span (so the underline animation has a target)', () => {
    const { container } = render(<ExploreLink label="Dive in" onClick={() => {}} />);
    const label = container.querySelector('.explore-link__label');
    expect(label, 'underline animation targets `.explore-link__label`').toBeInTheDocument();
    expect(label).toHaveTextContent('Dive in');
  });
});
