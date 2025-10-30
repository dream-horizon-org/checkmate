import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export function Card({ title, icon, children }: CardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        {title}
      </h3>
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  stagger?: boolean;
}

export function CardGrid({ children, stagger }: CardGridProps) {
  return (
    <div className={`${styles.cardGrid} ${stagger ? styles.stagger : ''}`}>
      {children}
    </div>
  );
}

