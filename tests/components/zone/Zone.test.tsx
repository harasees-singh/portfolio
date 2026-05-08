/**
 * Zone, Card, and Bento — the building blocks every deep-dive section
 * is composed from. Tests cover:
 *
 *   - Zone renders the eyebrow, title, depth, and temp readouts.
 *   - The section's `id` is forwarded so depth-rail anchors land on it.
 *   - Card variants emit the matching `card--{variant}` class so the
 *     bento grid layout works.
 *   - Bento is a thin wrapper that renders its children inside `.bento`.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Bento, Card, Zone } from '../../../src/components/zone/Zone';

describe('<Zone />', () => {
  it('renders the eyebrow, title, depth, and temp readouts', () => {
    render(
      <Zone id="twilight" eyebrow="Twilight Zone" title="Storage engines" depth="200m" temp="6°C">
        <p>body</p>
      </Zone>,
    );
    expect(screen.getByText('Twilight Zone')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /storage engines/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/CURRENT_DEPTH:\s*200m/)).toBeInTheDocument();
    expect(screen.getByText(/TEMP:\s*6°C/)).toBeInTheDocument();
  });

  it('forwards `id` to the section element so depth-rail anchors work', () => {
    const { container } = render(
      <Zone id="midnight" eyebrow="Midnight" title="Replication" depth="1500m" temp="2°C">
        <p>body</p>
      </Zone>,
    );
    expect(container.querySelector('section#midnight')).toBeInTheDocument();
  });
});

describe('<Card />', () => {
  it.each(['feature', 'side', 'half', 'third', 'full'] as const)(
    'emits `card--%s` so the bento layout grid can target it',
    (variant) => {
      const { container } = render(<Card variant={variant} body="body" />);
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
      expect(card?.classList.contains(`card--${variant}`)).toBe(true);
    },
  );

  it('renders eyebrow, title, and body when provided', () => {
    render(<Card variant="full" eyebrow="00 Prologue" title="A title" body="A body." />);
    expect(screen.getByText('00 Prologue')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /a title/i })).toBeInTheDocument();
    expect(screen.getByText('A body.')).toBeInTheDocument();
  });

  it('renders children alongside body content', () => {
    render(
      <Card variant="full" body="body">
        <span data-testid="custom-child">extra</span>
      </Card>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});

describe('<Bento />', () => {
  it('wraps children in a `.bento` grid container', () => {
    const { container } = render(
      <Bento>
        <Card variant="full" body="b" />
      </Bento>,
    );
    expect(container.querySelector('.bento')).toBeInTheDocument();
    expect(container.querySelectorAll('.bento .card').length).toBe(1);
  });
});
