/**
 * Accessibility smoke tests.
 *
 * Runs axe-core (via `vitest-axe`) over the major shipped UI islands
 * inside a jsdom render. The intent is to catch coarse regressions —
 * missing aria-labels on icon buttons, contrast violations in tokens,
 * unlabeled landmarks — not to be a full a11y audit. Animations,
 * focus management, and the 3D scene are out of scope.
 *
 * `axe.run()` is configured to skip `color-contrast` because jsdom
 * doesn't load the stylesheet (the test environment is `css: false`),
 * so axe can't compute foreground/background colors anyway.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TopNav } from '../src/components/TopNav';
import { MobileTabBar } from '../src/components/MobileTabBar';
import { SiteFooter } from '../src/components/SiteFooter';
import { LoadingScreen } from '../src/components/LoadingScreen';
import { ExploreLink, Hero, ScrollHint, SurfaceEntry } from '../src/components/Hero';
import { Bento, Card, Zone } from '../src/components/Zone';

const axeOptions = {
  // Color contrast is computed against actual rendered styles, but
  // `css: false` in vitest.config.ts means jsdom never applies our
  // stylesheet. Trust the design tokens here and skip the rule.
  rules: { 'color-contrast': { enabled: false } },
};

async function expectNoViolations(ui: React.ReactElement) {
  const { container } = render(ui);
  const result = await axe(container, axeOptions);
  expect(result).toHaveNoViolations();
}

describe('a11y smoke tests', () => {
  it('<TopNav /> has no axe violations', async () => {
    await expectNoViolations(<TopNav currentDepth={42} />);
  });

  it('<MobileTabBar /> has no axe violations', async () => {
    await expectNoViolations(<MobileTabBar />);
  });

  it('<SiteFooter /> has no axe violations', async () => {
    await expectNoViolations(<SiteFooter />);
  });

  it('<LoadingScreen visible /> has no axe violations', async () => {
    await expectNoViolations(<LoadingScreen visible />);
  });

  it('<SurfaceEntry /> has no axe violations', async () => {
    await expectNoViolations(<SurfaceEntry />);
  });

  it('<Hero /> has no axe violations', async () => {
    await expectNoViolations(<Hero onExplore={() => {}} />);
  });

  it('<ScrollHint /> has no axe violations', async () => {
    await expectNoViolations(<ScrollHint targetId="next" />);
  });

  it('<ExploreLink /> has no axe violations', async () => {
    await expectNoViolations(<ExploreLink label="Dive in" onClick={() => {}} />);
  });

  it('<Zone /> with a Bento + Card has no axe violations', async () => {
    await expectNoViolations(
      <Zone id="z" eyebrow="E" title="Title" depth="100m" temp="6°C">
        <Bento>
          <Card variant="full" eyebrow="00" title="Card title" body="Body" />
        </Bento>
      </Zone>,
    );
  });
});
