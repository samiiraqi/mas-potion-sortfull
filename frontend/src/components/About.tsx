import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <div className="logo">🧪</div>
        <h1>About Potion Sort</h1>
        <p className="tagline">A puzzle game built with passion and code</p>
      </div>

      <section className="section">
        <h2>What is Potion Sort?</h2>
        <p>
          Potion Sort is a free, addictive puzzle game where you sort colorful liquids into bottles. 
          Its simple to learn but challenging to master, with over 100 levels!
        </p>
      </section>

      <section className="section">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-title">100+ Levels</div>
            <p>Progressive difficulty from easy to challenging</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <div className="feature-title">Particle Effects</div>
            <p>Beautiful visual effects</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <div className="feature-title">Sound Effects</div>
            <p>Satisfying audio feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🆓</div>
            <div className="feature-title">100% Free</div>
            <p>No ads, completely free!</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>The Story Behind the Game</h2>
        <div className="story-box">
          <p>
            Hey! Im Sami Orouk, a DevSecOps engineer who loves building things. 
            After learning AWS, Docker, Kubernetes, Terraform, Python, and JavaScript, 
            I wanted to create something fun and interactive.
          </p>
          <p>
            This project started as a learning exercise but became a passion project. 
            I hope you enjoy playing Potion Sort!
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Tech Stack</h2>
        <div className="tech-stack">
          <div className="tech-badge">React</div>
          <div className="tech-badge">TypeScript</div>
          <div className="tech-badge">Vite</div>
          <div className="tech-badge">HTML5</div>
          <div className="tech-badge">CSS3</div>
        </div>
      </section>

      <div className="developer-card">
        <h3>Meet the Developer</h3>
        <p><strong>Sami Orouk</strong></p>
        <p>DevSecOps Engineer | Game Developer</p>
        <div className="social-links">
          <a href="https://instagram.com/orouk.sami" target="_blank" rel="noopener noreferrer" className="social-link">
            Instagram @orouk.sami
          </a>
        </div>
      </div>

      <div className="copyright">
        <p><strong>2025 Potion Sort by Sami Orouk. All Rights Reserved.</strong></p>
      </div>
    </div>
  );
};

export default About;