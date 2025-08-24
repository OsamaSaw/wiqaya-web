import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  sx?: SxProps<Theme>;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 30,
  sx = {},
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  return (
    <Box ref={ref} sx={sx}>
      <motion.div
        initial={{ 
          opacity: 0, 
          ...getInitialPosition()
        }}
        animate={inView ? { 
          opacity: 1, 
          x: 0, 
          y: 0 
        } : { 
          opacity: 0, 
          ...getInitialPosition()
        }}
        transition={{ 
          duration,
          delay,
          ease: 'easeOut'
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};

export default AnimatedSection;
