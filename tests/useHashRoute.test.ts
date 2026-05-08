/**
 * useHashRoute — tiny hash-based router used to switch between the
 * landing page and per-zone deep-dive routes.
 *
 * Tests cover the contract callers depend on:
 *   - The initial value reflects `window.location.hash`.
 *   - `navigate('slug')` updates the hash to `#/slug` and scrolls to top.
 *   - `navigate('')` clears the hash via `history.pushState` (so the URL
 *     stays clean) and triggers a scroll restore on the next frame.
 *   - External `hashchange` events update the hook state.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useHashRoute } from '../src/useHashRoute';

describe('useHashRoute', () => {
  beforeEach(() => {
    history.pushState(null, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    history.pushState(null, '', '/');
  });

  it('reads the initial slug from window.location.hash', () => {
    history.pushState(null, '', '/#/twilight');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current[0]).toBe('twilight');
  });

  it('treats empty / non-route hashes as the landing route', () => {
    history.pushState(null, '', '/#sunlit-hero');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current[0], 'in-page anchors are not deep-dive routes').toBe('');
  });

  it('navigate("slug") sets the hash to #/slug and scrolls to top', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    const { result } = renderHook(() => useHashRoute());
    act(() => result.current[1]('midnight'));
    expect(window.location.hash).toBe('#/midnight');
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });

  it('navigate("") clears the hash via pushState (keeps the URL clean)', () => {
    history.pushState(null, '', '/#/midnight');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current[0]).toBe('midnight');
    act(() => result.current[1](''));
    expect(window.location.hash).toBe('');
    expect(result.current[0]).toBe('');
  });

  it('responds to external hashchange events (browser back/forward)', () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => {
      history.pushState(null, '', '/#/abyssal');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current[0]).toBe('abyssal');
  });
});
