import React from 'react';
import { Typography, Box } from '@mui/material';
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
    <Box 
      ref={ref}
      textAlign="center"
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
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
  );
};

export default AnimatedCounter;
