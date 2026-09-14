import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const HOME_FOUNDATION_VERSION = '1.0.0';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function HomePageSection({
  children,
  className,
  id,
  eyebrow,
  title,
  description,
  headingLevel = 'h2',
  ...props
}) {
  const Heading = headingLevel;

  return (
    <section id={id} className={cx('home-section', className)} {...props}>
      <div className="home-section__inner">
        {(eyebrow || title || description) && (
          <header className="home-section__header">
            {eyebrow ? <p className="home-section__eyebrow">{eyebrow}</p> : null}
            {title ? <Heading className="home-section__title">{title}</Heading> : null}
            {description ? <p className="home-section__description">{description}</p> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function HomeCard({ children, className, interactive = false, as = 'article', ...props }) {
  const Card = as;
  return (
    <Card
      className={cx('home-card', interactive && 'home-card--interactive', className)}
      {...props}
    >
      {children}
    </Card>
  );
}

export function HomeButton({ children, className, variant = 'primary', to, type = 'button', ...props }) {
  const classes = cx('home-button', `home-button--${variant}`, className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export function HomeReveal({
  children,
  className,
  delay = 0,
  once = true,
  threshold = 0.12,
  as = 'div',
  ...props
}) {
  const ref = useRef(null);
  const [prepared, setPrepared] = useState(false);
  const [visible, setVisible] = useState(false);
  const Reveal = as;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mediaQuery?.matches || typeof IntersectionObserver === 'undefined') {
      setPrepared(false);
      setVisible(true);
      return undefined;
    }

    setPrepared(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        if (once) observer.unobserve(node);
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  const mergedStyle = {
    '--home-reveal-delay': `${delay}ms`,
    ...props.style
  };

  return (
    <Reveal
      ref={ref}
      className={cx(
        'home-reveal',
        prepared && 'home-reveal--prepared',
        visible && 'home-reveal--visible',
        className
      )}
      {...props}
      style={mergedStyle}
    >
      {children}
    </Reveal>
  );
}
