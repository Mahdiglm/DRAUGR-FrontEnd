import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ImageSlider = ({ products }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  // Auto slide effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  // Animation variants
  const slideVariants = {
    hiddenRight: {
      x: 300,
      opacity: 0,
    },
    hiddenLeft: {
      x: -300,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Check if products array is valid
  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
        <Typography variant="body1">No products available for display</Typography>
      </Box>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8))',
            zIndex: 1,
          },
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial={direction === 1 ? 'hiddenRight' : 'hiddenLeft'}
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 2rem',
              zIndex: 2,
            }}
          >
            <Box
              component="img"
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                zIndex: -1,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                textAlign: 'center',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                fontWeight: 'bold',
              }}
            >
              {currentProduct.name}
            </Typography>
            <Typography
              variant="h5"
              color="error"
              sx={{ mb: 2, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {currentProduct.price.toLocaleString()} تومان
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                textAlign: 'center',
                mb: 4,
                maxWidth: '800px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {currentProduct.description}
            </Typography>
            <Box
              component={Link}
              to={`/product/${currentProduct.id}`}
              sx={{
                backgroundColor: theme.palette.error.main,
                color: 'white',
                py: 1,
                px: 3,
                borderRadius: 2,
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                },
              }}
            >
              مشاهده محصول
            </Box>
          </motion.div>
        </AnimatePresence>
      </Paper>

      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 20,
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          zIndex: 10,
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          zIndex: 10,
        }}
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          zIndex: 10,
        }}
      >
        {products.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? 'error.main' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)',
                backgroundColor: index === currentIndex ? 'error.main' : 'rgba(255,255,255,0.8)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageSlider; 