import { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, getMotionConfig } from '../hooks/useReducedMotion';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import { FiMenu, FiX, FiHome, FiUser, FiFolderOpen, FiMail } from 'react-icons/fi';

const Navbar = ({ hidden = false }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  // ⛔ Saat hidden, jangan render apa pun
  if (hidden) return null;

  const [active, setActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 150);
    handleScroll(); // init posisi saat mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (!navRef.current || prefersReducedMotion) return;

    const motionConfig = getMotionConfig({
      duration: 1.2,
      ease: 'power3.out'
    }, prefersReducedMotion);

    // Initial navbar animation
    gsap.fromTo(navRef.current, 
      { 
        y: -100, 
        opacity: 0,
        rotateX: -15,
        transformOrigin: 'center top'
      },
      { 
        y: 0, 
        opacity: 1,
        rotateX: 0,
        delay: 0.5,
        ...motionConfig
      }
    );

    // Logo 3D entrance
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { scale: 0.8, rotateY: -20, z: -50 },
        { scale: 1, rotateY: 0, z: 0, delay: 0.8, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }

    // Links stagger animation
    if (linksRef.current) {
      const links = linksRef.current.querySelectorAll('li');
      gsap.fromTo(links,
        { opacity: 0, y: 20, z: -30 },
        { 
          opacity: 1, 
          y: 0, 
          z: 0,
          delay: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, { scope: navRef });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    if (!prefersReducedMotion && mobileMenuRef.current) {
      const motionConfig = getMotionConfig({
        duration: 0.4,
        ease: 'power2.inOut'
      }, prefersReducedMotion);

      if (!mobileMenuOpen) {
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, scale: 0.95, rotateX: -10 },
          { opacity: 1, scale: 1, rotateX: 0, ...motionConfig }
        );
      }
    }
  };

  const navItems = [
    { href: '#home', label: 'Home', icon: <FiHome /> },
    { href: '#about', label: 'About', icon: <FiUser /> },
    { href: '#project', label: 'Projects', icon: <FiFolderOpen /> },
    { href: '#contact', label: 'Contact', icon: <FiMail /> }
  ];

  return (
    <>
    <nav 
      ref={navRef}
      className={`
        navbar fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12
        transition-all duration-300 depth-container
        ${active ? 'glass shadow-lg' : 'bg-transparent'}
      `}
      style={{
        background: active ? 'var(--glass)' : 'transparent',
        backdropFilter: active ? 'blur(12px)' : 'none',
        borderBottom: active ? '1px solid var(--border)' : 'none'
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div ref={logoRef} className="logo depth-1">
          <h1 
            className="text-3xl font-bold p-1 card-3d"
            style={{ 
              color: 'var(--text)',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transformStyle: 'preserve-3d'
            }}
          >
            Portofolio
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul
          ref={linksRef}
          className="hidden md:flex items-center gap-8"
        >
          {navItems.map((item, index) => (
            <li key={item.href} className="depth-1">
              <a 
                href={item.href} 
                className="
                  relative px-4 py-2 rounded-lg font-medium
                  transition-all duration-300 magnetic
                  hover:bg-glass focus:bg-glass
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                "
                style={{ 
                  color: 'var(--text)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Hire Me CTA - Desktop */}
          <a
            href="#contact"
            className="
              hidden md:inline-flex items-center gap-2 px-6 py-3
              rounded-full font-semibold btn-3d magnetic
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-accent/50
            "
            style={{
              background: 'var(--accent)',
              color: 'white',
              boxShadow: 'var(--shadow)'
            }}
          >
            Hire Me
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="
              md:hidden p-3 rounded-full glass btn-3d
              focus:outline-none focus:ring-2 focus:ring-primary/50
            "
            aria-label="Toggle mobile menu"
            style={{ color: 'var(--text)' }}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {mobileMenuOpen && (
      <div 
        className="fixed inset-0 z-40 md:hidden"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div 
          ref={mobileMenuRef}
          className="
            absolute top-20 left-4 right-4 p-6 rounded-2xl
            glass depth-container
          "
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex items-center gap-3 p-4 rounded-lg
                    transition-all duration-300 card-3d
                    hover:bg-glass focus:bg-glass
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                  "
                  style={{ color: 'var(--text)' }}
                >
                  <span className="text-primary">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 pt-6 border-t border-border">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="
                flex items-center justify-center gap-2 w-full p-4
                rounded-full font-semibold btn-3d
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-accent/50
              "
              style={{
                background: 'var(--accent)',
                color: 'white'
              }}
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;