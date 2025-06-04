import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Grid, Button, Card, CardMedia, CardContent, useTheme, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { backgroundImages, productImages } from '../../services/assetService';
import { products } from '../../utils/mockData';
import ImageSlider from '../shared/ImageSlider';
import ProductCard from '../product/ProductCard';
import Helmet from 'react-helmet';

const SpecialOffersPage = () => {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1.5 }
    }
  };

  // Special offers data
  const specialOffers = [
    {
      id: 'dark-ritual',
      title: 'آیین تاریکی',
      description: 'مجموعه‌ای کامل برای اجرای آیین‌های تاریک، شامل شمع‌های سیاه، کتاب اوراد، و نمادهای حفاظتی.',
      price: 249.99,
      imageUrl: productImages.darkRitual,
      buttonText: 'مشاهده جزئیات',
      buttonLink: '/products/dark-ritual'
    },
    {
      id: 'halloween-pack',
      title: 'پکیج هالووین',
      description: 'همه چیزهایی که برای یک جشن هالووین بی‌نظیر نیاز دارید، از ماسک‌های ترسناک تا دکوراسیون‌های مخصوص.',
      price: 199.99,
      imageUrl: productImages.halloweenPack,
      buttonText: 'افزودن به سبد خرید',
      buttonLink: '/cart/add/halloween-pack'
    },
    {
      id: 'spell-pack',
      title: 'مجموعه محلول‌ها',
      description: 'مجموعه‌ای از معجون‌های قدرتمند با خواص مختلف، دست‌ساز با مواد مرغوب و دستورالعمل‌های باستانی.',
      price: 159.99,
      imageUrl: productImages.spellPack,
      buttonText: 'افزودن به سبد خرید',
      buttonLink: '/cart/add/spell-pack'
    }
  ];

  // Featured products - select a few random products from mockData
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Helmet>
        <title>پیشنهادات ویژه | فروشگاه Draugr</title>
        <meta name="description" content="پیشنهادات ویژه و محدود فروشگاه Draugr با تخفیف‌های استثنایی" />
      </Helmet>

      {/* Hero Section */}
      <Box
        component={motion.div}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImages.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <Container>
          <Typography 
            variant="h1" 
            component={motion.h1}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            sx={{ 
              fontSize: { xs: '3rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            پیشنهادات ویژه و محدود
          </Typography>
          <Typography 
            variant="h5"
            component={motion.p}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            sx={{ 
              mb: 5,
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            محصولات منحصر به فرد با تخفیف‌های استثنایی، فقط برای مدت محدود
          </Typography>
          <Button 
            component={RouterLink} 
            to="/shop"
            variant="contained" 
            color="primary"
            size="large"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              }
            }}
          >
            مشاهده همه محصولات
          </Button>
        </Container>
      </Box>

      {/* Special Offers */}
      <Box sx={{ 
        py: 10, 
        px: 2,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)), url(${backgroundImages.main})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}>
        <Container>
          <Typography variant="h2" align="center" sx={{ mb: 6, color: 'white' }}>
            پکیج‌های ویژه
          </Typography>
          
          <Grid container spacing={4}>
            {specialOffers.map((offer, index) => (
              <Grid item xs={12} md={4} key={offer.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 } 
                  }}
                  onMouseEnter={() => setHoveredCard(offer.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: hoveredCard === offer.id ? '0 0 20px rgba(255, 0, 0, 0.5)' : 'none',
                    transition: 'box-shadow 0.3s ease'
                  }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={offer.imageUrl}
                      alt={offer.title}
                      sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        transform: hoveredCard === offer.id ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3, color: 'white' }}>
                      <Typography variant="h4" component="h3" gutterBottom>
                        {offer.title}
                      </Typography>
                      <Typography variant="h5" color="error" gutterBottom>
                        {offer.price.toLocaleString()} تومان
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {offer.description}
                      </Typography>
                      <Button 
                        component={RouterLink}
                        to={offer.buttonLink}
                        variant="contained" 
                        color="error" 
                        fullWidth
                      >
                        {offer.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Box sx={{ 
        py: 10, 
        px: 2,
        backgroundColor: '#121212'
      }}>
        <Container>
          <Typography variant="h2" align="center" sx={{ mb: 6, color: 'white' }}>
            محصولات منتخب
          </Typography>
          
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              component={RouterLink}
              to="/shop"
              variant="outlined" 
              color="error" 
              size="large"
            >
              مشاهده همه محصولات
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Skull Visual Section */}
      <Box sx={{ 
        py: 10, 
        px: 2,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImages.product})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}>
        <Container>
          <Typography variant="h2" align="center" sx={{ mb: 6, color: 'white' }}>
            محصولات فروشگاه
          </Typography>
          
          <ImageSlider products={products.slice(0, 8)} />
        </Container>
      </Box>
    </>
  );
};

export default SpecialOffersPage;
