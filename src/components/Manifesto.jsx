import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { useContent } from '../context/ContentContext';

export default function Manifesto() {
  const { content } = useContent();
  const sectionRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const manifesto = content.home?.manifesto || { 
    title: 'To Engineer Legacies that transcend borders.', 
    subtitle: 'Excellence is a habit.' 
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Split text simulation
      const splitText = (element) => {
        if (!element) return [];
        const text = element.innerText;
        element.innerHTML = '';
        const words = text.split(' ');
        const spans = [];
        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.innerText = word;
          span.style.opacity = '0';
          span.style.transform = 'translateY(15px)';
          span.style.display = 'inline-block';
          element.appendChild(span);
          spans.push(span);
          
          if (i < words.length - 1) {
            element.appendChild(document.createTextNode(' '));
          }
        });
        return spans;
      };

      const words1 = splitText(textRef1.current);
      const words2 = splitText(textRef2.current);

      gsap.to([...words1, ...words2], {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [manifesto]); // Re-run effect when manifesto content changes

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-48 px-4 md:px-16 bg-[var(--color-bone)] text-[var(--color-sage)] overflow-hidden border-y border-[var(--color-sand)]/20">
      <div className="absolute inset-0 opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left flex flex-col items-center md:items-start">
        <div className="w-12 h-px bg-[var(--color-sand)] mb-8 md:mb-12"></div>
        <h2 className="font-sans font-light text-xl md:text-4xl lg:text-5xl mb-8 md:mb-12 leading-relaxed text-[var(--color-sand)]">
          <div ref={textRef1}>{manifesto.title}</div>
        </h2>
        <h2 className="font-heading italic text-4xl md:text-5xl lg:text-6xl leading-tight text-[var(--color-sage)]">
          <div ref={textRef2}>{manifesto.subtitle}</div>
        </h2>
      </div>
    </section>
  );
}

