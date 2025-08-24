import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  end: number;
  label: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  label,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <Box textAlign="center">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
          }}
        >
          {inView && (
            <CountUp
              start={0}
              end={end}
              duration={duration}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
            />
          )}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default AnimatedCounter;
