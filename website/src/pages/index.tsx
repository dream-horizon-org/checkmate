import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleGradient}>Checkmate</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A modern, self-hosted test case management system built for teams
            </p>
            <p className={styles.heroDescription}>
              Organize test cases, execute test runs, and track quality metrics with an intuitive interface and powerful APIs for CI/CD integration.
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={clsx('button button--primary button--lg', styles.heroButton)}
                to="/docs/project/introduction">
                Get Started
              </Link>
              <Link
                className={clsx('button button--outline button--lg', styles.heroButtonSecondary)}
                to="/docs/guides/api">
                View API Docs
              </Link>
            </div>
            <div className={styles.heroMeta}>
              <span className={styles.badge}>
                <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Open Source
              </span>
              <span className={styles.badge}>
                <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M2 9h20M2 15h20M2 12h20"/>
                  <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
                </svg>
                Docker Ready
              </span>
              <span className={styles.badge}>
                <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Enterprise Security
              </span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroCardDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={styles.heroCardContent}>
                <div className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># Install Checkmate with one command</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>curl</span> -fsSL https://raw.githubusercontent.com/dream-horizon-org/checkmate/master/bootstrap.sh | <span className={styles.codeKeyword}>bash</span>
                  </div>
                  <div className={styles.codeLine}></div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># The installer will:</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># ✓ Check and install prerequisites</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># ✓ Guide you through OAuth setup</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># ✓ Configure everything automatically</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># ✓ Setup Docker containers</span>
                  </div>
                  <div className={styles.codeLine}></div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># Ready at http://localhost:3000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionDivider() {
  return (
    <div className={styles.sectionDivider}>
      <div className={styles.dividerLine}></div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      title: 'Project Management',
      description: 'Organize tests into projects with role-based access control and team collaboration features.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Test Case Management',
      description: 'Create, edit, and organize tests with flexible attributes, hierarchical sections, and rich metadata.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      ),
      title: 'Test Runs',
      description: 'Execute test runs, track progress in real-time, and generate comprehensive reports with a single click.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      title: 'Better Customisability',
      description: 'Use sections, labels, and group to classify and filter tests exactly the way your team works.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <line x1="3.27" y1="6.96" x2="12" y2="12.01"/>
          <line x1="12" y1="12.01" x2="20.73" y2="6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      title: 'API Integration',
      description: 'RESTful APIs with OpenAPI 3.0 spec for seamless automation and third-party tool integration.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: 'Security & RBAC',
      description: 'Google OAuth authentication with granular role-based permissions (Admin, User, Reader).'
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrapper}>
            <h2 className={styles.sectionTitle}>Everything you need for test management</h2>
            <div className={styles.sectionTitleUnderline}></div>
          </div>
          <p className={styles.sectionSubtitle}>
            Powerful features designed to streamline your testing workflow and improve team collaboration
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureCardContent}>
                <div className={styles.featureIconWrapper}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const techStack = [
    { name: 'Remix', color: '#3992ff' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'React', color: '#61dafb' },
    { name: 'MySQL', color: '#4479a1' },
    { name: 'Docker', color: '#2496ed' },
    { name: 'TailwindCSS', color: '#06b6d4' },
  ];

  return (
    <section className={styles.techStack}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Built with modern technologies</h2>
          <p className={styles.sectionSubtitle}>
            Reliable, scalable, and easy to deploy
          </p>
        </div>
        <div className={styles.techGrid}>
          {techStack.map((tech, idx) => (
            <div key={idx} className={styles.techBadge} style={{ borderColor: tech.color }}>
              <span style={{ color: tech.color }}>●</span> {tech.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenshotSection() {
  return (
    <section className={styles.screenshot}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>See Checkmate in Action</h2>
          <p className={styles.sectionSubtitle}>
            Experience the intuitive interface designed for modern test management teams
          </p>
        </div>
        <div className={styles.screenshotContainer}>
          <div className={styles.screenshotWrapper}>
            <img 
              src="/img/sample-website-1.png" 
              alt="Checkmate Test Cases Interface" 
              className={styles.screenshotImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to streamline your testing?</h2>
          <p className={styles.ctaSubtitle}>
            Get started with Checkmate in minutes. Self-host on your infrastructure or deploy to the cloud.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--primary button--lg', styles.ctaButton)}
              to="/docs/project/setup">
              Install Checkmate
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.ctaButtonSecondary)}
              to="https://github.com/dream-horizon-org/checkmate">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="A modern test case management system for teams">
      <HeroSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <ScreenshotSection />
      <SectionDivider />
      <CTASection />
    </Layout>
  );
}
