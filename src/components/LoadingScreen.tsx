import { AnimatePresence, motion } from 'framer-motion';

/**
 * Full-viewport descent loader. Shown while the background video and 3D
 * ocean scene warm up so the user never sees an empty deep-sea page.
 *
 * Visuals are intentionally on-brand: a sonar pulse + a sinking bead that
 * mirrors the ScrollHint rail, plus telemetry-style status copy. Everything
 * sits over the same depth gradient the page uses so the dissolve into the
 * landing scene is invisible.
 */
export function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader"
          role="status"
          aria-live="polite"
          aria-label="Loading deep-sea scene"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="loader__backdrop" aria-hidden />
          <div className="loader__snow" aria-hidden />

          <motion.div
            className="loader__center"
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            {/* Sonar pulse — three rings staggered to read as a ping */}
            <div className="loader__sonar" aria-hidden>
              <span className="loader__ring" style={{ animationDelay: '0s' }} />
              <span className="loader__ring" style={{ animationDelay: '0.9s' }} />
              <span className="loader__ring" style={{ animationDelay: '1.8s' }} />
              <span className="loader__core" />
            </div>

            <span className="loader__eyebrow">Initializing Descent</span>
            <h1 className="loader__title">Calibrating pressure systems</h1>
            <p className="loader__sub">
              Loading deep-sea telemetry — hold steady while the surface clears.
            </p>

            {/* Indeterminate descent rail — a bead falling on a thin gradient track */}
            <div className="loader__rail" aria-hidden>
              <span className="loader__bead" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
