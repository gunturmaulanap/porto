import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, getMotionConfig } from '../../hooks/useReducedMotion';
import { FiX, FiGithub } from 'react-icons/fi'; // Install react-icons jika belum: npm install react-icons

const ProjectModal = ({ isOpen, onClose, project }) => {
  // State untuk mengontrol animasi penutupan
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Fungsi untuk menangani penutupan dengan animasi
  const handleClose = () => {
    setIsClosing(true);
    
    if (!prefersReducedMotion && modalRef.current && overlayRef.current) {
      const motionConfig = getMotionConfig({
        duration: 0.3,
        ease: 'power2.in'
      }, prefersReducedMotion);

      gsap.to(modalRef.current, {
        scale: 0.8,
        z: -80,
        opacity: 0,
        ...motionConfig
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        ...motionConfig,
        onComplete: () => {
          onClose();
          setIsClosing(false);
        }
      });
    } else {
      // Fallback without animation
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 50);
    }
  };

  // Entry animation
  useGSAP(() => {
    if (!isOpen || !modalRef.current || !overlayRef.current) return;

    const motionConfig = getMotionConfig({
      duration: 0.4,
      ease: 'power3.out'
    }, prefersReducedMotion);

    // Animate page scale down
    gsap.to('body', {
      scale: 0.98,
      filter: 'blur(2px)',
      ...motionConfig
    });

    // Animate modal in
    gsap.fromTo(modalRef.current,
      { 
        scale: 0.8, 
        z: -80, 
        opacity: 0,
        rotateX: 10 
      },
      { 
        scale: 1, 
        z: 0, 
        opacity: 1,
        rotateX: 0,
        ...motionConfig,
        delay: 0.1
      }
    );

    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, ...motionConfig }
    );

    return () => {
      gsap.set('body', { scale: 1, filter: 'none' });
    };
  }, { dependencies: [isOpen], scope: modalRef });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      gsap.set('body', { scale: 1, filter: 'none' });
    };
  }, []);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Mencegah scroll di background saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    // Overlay
    <div
      ref={overlayRef}
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 depth-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Content */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
        className="glass border border-violet-500/50 rounded-2xl w-full max-w-lg card-3d"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--accent)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* --- GAMBAR PROYEK --- */}
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-56 object-cover rounded-t-2xl"
        />

        <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <h2 id="modal-title" className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                  {project.title}
                </h2>
                <button
                    onClick={handleClose}
                    className="btn-3d glass p-2 rounded-full -mt-2 -mr-2 magnetic"
                    style={{ color: 'var(--muted)' }}
                    aria-label="Close modal"
                >
                    <FiX size={24} />
                </button>
            </div>

            {/* --- DESKRIPSI LENGKAP --- */}
            <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                {project.fullDescription}
            </p>

            <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 font-semibold p-3 px-5 rounded-full w-full cursor-pointer btn-3d glass magnetic"
                style={{
                  background: 'var(--accent)',
                  color: 'white'
                }}
            >
                <FiGithub />
                <span>Source Code</span>
            </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;