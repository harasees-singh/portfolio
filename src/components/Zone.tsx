import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ZoneProps {
  id: string;
  eyebrow: string;
  title: string;
  depth: string;
  temp: string;
  children: ReactNode;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Zone({ id, eyebrow, title, depth, temp, children }: ZoneProps) {
  return (
    <section id={id} className="zone">
      <div className="shell">
        <motion.header
          className="zone__header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div>
            <div className="zone__eyebrow">{eyebrow}</div>
            <h2 className="zone__title">{title}</h2>
          </div>
          <div className="zone__telemetry">
            <span>CURRENT_DEPTH: {depth}</span>
            <span>TEMP: {temp}</span>
          </div>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

interface CardProps {
  variant: 'feature' | 'side' | 'half' | 'third' | 'full';
  eyebrow?: string;
  title?: string;
  body?: string;
  children?: ReactNode;
}

export function Card({ variant, eyebrow, title, body, children }: CardProps) {
  return (
    <motion.article className={`card card--${variant}`} variants={fadeUp}>
      {eyebrow && (
        <div className="card__eyebrow">
          <span>{eyebrow}</span>
        </div>
      )}
      {title && <h3 className="card__title">{title}</h3>}
      {body && <p className="card__body">{body}</p>}
      {children}
    </motion.article>
  );
}

export function Bento({ children }: { children: ReactNode }) {
  return <div className="bento">{children}</div>;
}
