import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, getMotionConfig } from '../../hooks/useReducedMotion';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { FiMenu, FiX, FiHome, FiUser, FiFolder, FiMail } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const underlineRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home', icon: <FiHome /> },
    { id: 'about', label: 'About', href: '#about', icon: <FiUser /> },
    { id: 'project', label: 'Projects', href: '#project', icon: <FiFolder /> },
    { id: 'contact', label: 'Contact', href: '#contact', icon: <FiMail /> }
  ];

  const handleLinkClick = (linkId, href) => {
    setActiveLink(linkId);
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mount animation
  useGSAP(() => {
    if (!navRef.current || prefersReducedMotion) return;

    const motionConfig = getMotionConfig({
      duration: 0.8,
      ease: 'power3.out'
    }, prefersReducedMotion);

    gsap.fromTo(navRef.current, 
      { 
        y: -30, 
        z: -60, 
        opacity: 0,
        rotateX: -15 
      },
      { 
        y: 0, 
        z: 0, 
        opacity: 1,
        rotateX: 0,
        ...motionConfig,
        delay: 0.2
      }
    );
  }, { scope: navRef });

  // Menu animation
  useGSAP(() => {
    if (!menuRef.current) return;

    const motionConfig = getMotionConfig({
      duration: 0.4,
      ease: 'power2.out'
    }, prefersReducedMotion);

    if (isMenuOpen) {
      gsap.fromTo(menuRef.current,
        { 
          opacity: 0, 
          y: -20, 
          z: -40,
          rotateX: -10 
        },
        { 
          opacity: 1, 
          y: 0, 
          z: 0,
          rotateX: 0,
          ...motionConfig 
        }
      );
    }
  }, { dependencies: [isMenuOpen], scope: menuRef });

  return (
    <>
      {/* Skip to content link */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Desktop Navbar */}
      <nav 
        ref={navRef}
        className="navbar-desktop depth-container"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-content glass">
          {/* Brand */}
          <div className="navbar-brand">
            <h1 className="brand-text">
              <span className="brand-highlight">G</span>untur
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.href)}
                className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
                aria-current={activeLink === link.id ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}
            <div 
              ref={underlineRef}
              className="nav-underline"
              aria-hidden="true"
            />
          </div>

          {/* Controls */}
          <div className="navbar-controls">
            <ThemeToggle />
            <a 
              href="#contact"
              className="hire-btn btn-3d glass magnetic"
              onClick={() => handleLinkClick('contact', '#contact')}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="mobile-menu-btn btn-3d glass"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <nav 
            ref={menuRef}
            className="mobile-menu glass depth-container"
            onClick={(e) => e.stopPropagation()}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="mobile-menu-content">
              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.href)}
                  className={`mobile-nav-link stagger-item ${activeLink === link.id ? 'active' : ''}`}
                  style={{ '--stagger-delay': `${index * 0.1}s` }}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  <span className="mobile-nav-text">{link.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Dock */}
      <div className="mobile-dock glass">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.id, link.href)}
            className={`dock-item ${activeLink === link.id ? 'active' : ''}`}
            aria-label={link.label}
          >
            {link.icon}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;