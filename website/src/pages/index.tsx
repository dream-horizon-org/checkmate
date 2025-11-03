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
              <span className={styles.badge}>✨ Open Source</span>
              <span className={styles.badge}>🐳 Docker Ready</span>
              <span className={styles.badge}>🔐 Enterprise Security</span>
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
<<<<<<< HEAD
                    <span className={styles.codeComment}># Install Checkmate with one command</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>curl</span> -fsSL https://raw.githubusercontent.com/ds-horizon/checkmate/master/bootstrap.sh | <span className={styles.codeKeyword}>bash</span>
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
                    <span className={styles.codeComment}># Ready at http://localhost:3000 🚀</span>
=======
                    <span className={styles.codeComment}># Clone the repository</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>git</span> clone git@github.com:ds-horizon/checkmate.git
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>cd</span> checkmate
                  </div>
                  <div className={styles.codeLine}></div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># Create .env file from .env.example</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>cp</span> .env.example .env
                  </div>
                  <div className={styles.codeLine}></div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># Install dependencies</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>yarn</span> install
                  </div>
                  <div className={styles.codeLine}></div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># Setup application and database</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>yarn</span> docker:setup
                  </div>
                  <div className={styles.codeLine}></div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># App will start on http://localhost:3000 🚀</span>
>>>>>>> 7ea5cdc0bf91a4ea1733025c94831857aa40a41e
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

function FeaturesSection() {
  const features = [
    {
      icon: '📦',
      title: 'Project Management',
      description: 'Organize tests into projects with role-based access control and team collaboration features.'
    },
    {
      icon: '✅',
      title: 'Test Case Management',
      description: 'Create, edit, and organize tests with flexible attributes, hierarchical sections, and rich metadata.'
    },
    {
      icon: '🔄',
      title: 'Test Runs',
      description: 'Execute test runs, track progress in real-time, and generate comprehensive reports with a single click.'
    },
    {
      icon: '🏷️',
      title: 'Better Customisability',
      description: 'Use sections, labels, and group to classify and filter tests exactly the way your team works.'
    },
    {
      icon: '🔌',
      title: 'API Integration',
      description: 'RESTful APIs with OpenAPI 3.0 spec for seamless automation and third-party tool integration.'
    },
    {
      icon: '🔐',
      title: 'Security & RBAC',
      description: 'Google OAuth authentication with granular role-based permissions (Admin, User, Reader).'
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need for test management</h2>
         
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
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
              to="https://github.com/ds-horizon/checkmate">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="A modern test case management system for teams">
      <HeroSection />
      <FeaturesSection />
      
      <CTASection />
    </Layout>
  );
}
