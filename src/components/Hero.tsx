"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    // Initial resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');

    // Define colors based on theme
    const primaryColor = isDarkMode ? 'rgba(129, 140, 248, 0.6)' : 'rgba(79, 70, 229, 0.3)';
    const secondaryColor = isDarkMode ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.2)';
    const accentColor = isDarkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(245, 158, 11, 0.15)';
    
    // Fire-like colors that work in both dark and light mode
    const fireColors = [
      isDarkMode ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.5)', // red
      isDarkMode ? 'rgba(249, 115, 22, 0.7)' : 'rgba(249, 115, 22, 0.5)', // orange
      isDarkMode ? 'rgba(234, 179, 8, 0.6)' : 'rgba(234, 179, 8, 0.4)', // yellow
    ];

    // Wave parameters
    const waves = [
      { y: canvas.height * 0.5, amplitude: 25, frequency: 0.02, speed: 0.03, color: primaryColor },
      { y: canvas.height * 0.6, amplitude: 20, frequency: 0.03, speed: 0.02, color: secondaryColor },
      { y: canvas.height * 0.7, amplitude: 15, frequency: 0.01, speed: 0.04, color: accentColor },
      { y: canvas.height * 0.8, amplitude: 10, frequency: 0.04, speed: 0.01, color: primaryColor },
    ];

    // Define particle types
    type Particle = {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      type: 'circle' | 'banknote' | 'fire';
      rotation?: number;
      rotationSpeed?: number;
      width?: number;
      height?: number;
      opacity?: number;
      fadeSpeed?: number;
    };

    // Create particles (banknotes and fire particles)
    const particles: Particle[] = [];
    const particleCount = Math.floor(canvas.width / 20); // Adjust based on screen width

    // Create banknote particles
    for (let i = 0; i < particleCount * 0.4; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 15 + 20, // Banknote width
        height: Math.random() * 5 + 10, // Banknote height
        size: 1, // Not used for banknotes but kept for type compatibility
        speed: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor,
        type: 'banknote',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.5
      });
    }

    // Create regular particles
    for (let i = 0; i < particleCount * 0.3; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 1 + 0.5,
        color: Math.random() > 0.7 ? accentColor : (Math.random() > 0.5 ? primaryColor : secondaryColor),
        type: 'circle'
      });
    }

    // Create fire particles
    for (let i = 0; i < particleCount * 0.3; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        size: Math.random() * 5 + 2,
        speed: Math.random() * 2 + 1,
        color: fireColors[Math.floor(Math.random() * fireColors.length)],
        type: 'fire',
        opacity: Math.random() * 0.3 + 0.7,
        fadeSpeed: Math.random() * 0.01 + 0.005
      });
    }

    // Animation variables
    let animationFrameId: number;
    let time = 0;

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x < canvas.width; x++) {
          const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.save();
        
        if (particle.type === 'circle') {
          // Draw regular circular particles
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Move particles
          particle.y -= particle.speed;
          particle.x += Math.sin(time * 0.1) * 0.5;
          
          // Reset particles that go off screen
          if (particle.y < -particle.size) {
            particle.y = canvas.height + particle.size;
            particle.x = Math.random() * canvas.width;
          }
        }
        else if (particle.type === 'banknote') {
          // Draw banknote-like particles
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation!);
          ctx.globalAlpha = particle.opacity!;
          
          // Draw banknote rectangle
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.width! / 2, -particle.height! / 2, particle.width!, particle.height!);
          
          // Add some details to make it look like a banknote
          ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-particle.width! / 2 + 2, -particle.height! / 2 + 2, particle.width! - 4, particle.height! - 4);
          
          // Add a small circle to represent a denomination
          ctx.beginPath();
          ctx.arc(particle.width! / 4, 0, particle.height! / 4, 0, Math.PI * 2);
          ctx.stroke();
          
          // Move and rotate banknotes
          particle.y -= particle.speed * 0.8;
          particle.x += Math.sin(time * 0.05 + particle.y * 0.01) * 1.2;
          particle.rotation! += particle.rotationSpeed!;
          
          // Reset banknotes that go off screen
          if (particle.y < -particle.height! * 2) {
            particle.y = canvas.height + particle.height!;
            particle.x = Math.random() * canvas.width;
            particle.opacity = Math.random() * 0.5 + 0.5;
          }
        }
        else if (particle.type === 'fire') {
          // Draw fire-like particles
          ctx.globalAlpha = particle.opacity!;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Add glow effect for fire particles
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
          
          ctx.globalAlpha = particle.opacity! * 0.5;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Move fire particles
          particle.y -= particle.speed;
          particle.x += (Math.random() - 0.5) * 0.8; // Slight random horizontal movement
          particle.opacity! -= particle.fadeSpeed!;
          
          // Reset fire particles that fade out or go off screen
          if (particle.opacity! <= 0 || particle.y < -particle.size) {
            particle.y = canvas.height + Math.random() * 20;
            particle.x = Math.random() * canvas.width;
            particle.opacity = Math.random() * 0.3 + 0.7;
            particle.size = Math.random() * 5 + 2;
          }
        }
        
        ctx.restore();
      });

      // Update time
      time += 0.05;

      // Continue animation
      animationFrameId = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden py-16 md:py-24 transition-colors duration-300">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
      />
      
      <div className="container relative mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-indigo-900 dark:text-indigo-100 mb-6 animate-fadeIn">
            Calculează Impactul Inflației Asupra Salariului Tău
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8 animate-slideUp">
            Află cât de mult ți-a afectat inflația puterea de cumpărare și ce salariu ai nevoie pentru a-ți menține nivelul de trai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <Link
              href="#calculator"
              className="btn btn-primary px-8 py-3 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Începe Calculul
            </Link>
            <Link
              href="#faq"
              className="btn btn-outline px-8 py-3 text-base font-medium rounded-lg border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
            >
              Află Mai Multe
            </Link>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent transition-colors duration-300"></div>
    </div>
  );
};