import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate responsive cards per view based on window width
 * Card dimensions: 150px width + 16px gap = 166px per card
 * Accounts for padding (32px total) and button space (80px total)
 * 
 * Maximizes space utilization - shows as many cards as fit in available width
 * Minimum thresholds:
 * - Mobile (<640px): min 1 card
 * - Tablet (640px-1024px): min 2 cards
 * - Desktop (1024px-1536px): min 4 cards
 * - Large (>1536px): min 6 cards
 */
export const useResponsiveCardsPerView = () => {
  const [cardsPerView, setCardsPerView] = useState(6);

  useEffect(() => {
    const calculateCards = () => {
      const viewportWidth = window.innerWidth;
      const cardWidth = 150; // Card width in pixels
      const cardGap = 16; // Gap between cards
      const containerPadding = 32; // 16px on each side
      const buttonSpace = 80; // Space for nav buttons (40px each + margins)
      
      // Available width for cards
      const availableWidth = viewportWidth - containerPadding - buttonSpace;
      const cardsPerRow = Math.max(1, Math.floor(availableWidth / (cardWidth + cardGap)));

      // Set minimum based on screen size, but use calculated value if more cards fit
      let minCards = 1;
      if (viewportWidth >= 640) minCards = 2;
      if (viewportWidth >= 1024) minCards = 4;
      if (viewportWidth >= 1536) minCards = 6;

      setCardsPerView(Math.max(minCards, cardsPerRow));
    };

    // Initial calculation
    calculateCards();

    // Recalculate on window resize
    const handleResize = () => {
      calculateCards();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return cardsPerView;
};
