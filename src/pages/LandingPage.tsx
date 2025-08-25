import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Stack,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Avatar,
} from '@mui/material';
import {
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  PhoneAndroid as PhoneAndroidIcon,
  LocationOn as LocationOnIcon,
  Payment as PaymentIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Shield as ShieldIcon,
  Group as GroupIcon,
  PlayArrow as PlayArrowIcon,
  Apple as AppleIcon,
  Android as AndroidIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from '../components/AnimatedCounter';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Simple CSS animation component to replace framer-motion
const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <Box
    sx={{
      animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      '@keyframes fadeInUp': {
        from: {
          opacity: 0,
          transform: 'translateY(30px)'
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }
    }}
  >
    {children}
  </Box>
);

/**
 * Modern bilingual landing page for Wiqayah - showcasing the comprehensive mobile app
 * for hiring professional bodyguards and security services in Saudi Arabia.
 * Features smooth animations, modern design, and full Arabic/English localization.
 */
const LandingPage: React.FC = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const appFeatures = [
    {
      icon: <LocationOnIcon />,
      titleKey: 'features.realTimeTracking.title',
      descriptionKey: 'features.realTimeTracking.description'
    },
    {
      icon: <PaymentIcon />,
      titleKey: 'features.securePayment.title',
      descriptionKey: 'features.securePayment.description'
    },
    {
      icon: <ChatIcon />,
      titleKey: 'features.inAppMessaging.title',
      descriptionKey: 'features.inAppMessaging.description'
    },
    {
      icon: <ScheduleIcon />,
      titleKey: 'features.smartScheduling.title',
      descriptionKey: 'features.smartScheduling.description'
    },
    {
      icon: <StarIcon />,
      titleKey: 'features.reviewsRatings.title',
      descriptionKey: 'features.reviewsRatings.description'
    },
    {
      icon: <VerifiedUserIcon />,
      titleKey: 'features.verifiedGuards.title',
      descriptionKey: 'features.verifiedGuards.description'
    }
  ];

  const testimonials = [
    {
      nameKey: 'testimonials.clients.ahmed.name',
      roleKey: 'testimonials.clients.ahmed.role',
      commentKey: 'testimonials.clients.ahmed.comment',
      rating: 5,
      avatar: 'A'
    },
    {
      nameKey: 'testimonials.clients.sarah.name',
      roleKey: 'testimonials.clients.sarah.role',
      commentKey: 'testimonials.clients.sarah.comment',
      rating: 5,
      avatar: 'S'
    },
    {
      nameKey: 'testimonials.clients.mohammed.name',
      roleKey: 'testimonials.clients.mohammed.role',
      commentKey: 'testimonials.clients.mohammed.comment',
      rating: 5,
      avatar: 'M'
    }
  ];

  React.useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  return (
    <>
      {/* Navigation bar */}
      <AppBar
        position="fixed"
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
        elevation={0}
      >
        <Toolbar>
          <Box 
            display="flex" 
            alignItems="center"
            sx={{
              animation: 'slideInLeft 0.5s ease-out',
              '@keyframes slideInLeft': {
                from: {
                  opacity: 0,
                  transform: 'translateX(-20px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)'
                }
              }
            }}
          >
            <ShieldIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Wiqayah
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" href="#features">{t('nav.features')}</Button>
            <Button color="inherit" href="#app">{t('nav.mobileApp')}</Button>
            <Button color="inherit" href="#services">{t('nav.services')}</Button>
            <Button color="inherit" href="#testimonials">{t('nav.reviews')}</Button>
            <Button color="inherit" href="#contact">{t('nav.contact')}</Button>
          </Stack>
          
          <LanguageSwitcher />
          
          <Button 
            variant="outlined" 
            href="/admin/login" 
            sx={{ ml: 2, borderRadius: 2 }}
          >
            {t('nav.adminPortal')}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero section with hero-bg.png */}
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 10, md: 12 },
          pb: { xs: 6, md: 8 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.6)} 100%)`,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <FadeInSection>
                <Chip 
                  label={t('hero.trustedInSaudi')}
                  color="secondary" 
                  variant="filled"
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 3,
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {t('hero.title')}
                  <br />{t('hero.titleSecond')}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {t('hero.subtitle')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    color="secondary"
                    startIcon={<PhoneAndroidIcon />}
                    sx={{ 
                      px: 4, 
                      py: 2, 
                      borderRadius: 3, 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 8px 32px rgba(255, 152, 0, 0.4)'
                    }}
                    href="#app"
                  >
                    {t('hero.downloadApp')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<PlayArrowIcon />}
                    sx={{ 
                      px: 4, 
                      py: 2, 
                      borderRadius: 3, 
                      fontSize: '1.1rem',
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {t('hero.watchDemo')}
                  </Button>
                </Stack>
              </FadeInSection>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FadeInSection delay={0.2}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, md: 500 },
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <PhoneAndroidIcon sx={{ fontSize: 120, color: 'white', opacity: 0.5 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      color: 'white',
                      opacity: 0.8
                    }}
                  >
                    {t('mobileApp.appScreenshots')}
                  </Typography>
                </Box>
              </FadeInSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <AnimatedCounter end={1500} suffix="+" label={t('stats.activeGuards')} />
            </Grid>
            <Grid item xs={6} md={3}>
              <AnimatedCounter end={10000} suffix="+" label={t('stats.completedBookings')} />
            </Grid>
            <Grid item xs={6} md={3}>
              <AnimatedCounter end={98} suffix="%" label={t('stats.customerSatisfaction')} />
            </Grid>
            <Grid item xs={6} md={3}>
              <AnimatedCounter end={24} suffix="/7" label={t('stats.availableSupport')} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* App Features section */}
      <Box id="features" sx={{ py: 10, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container>
          <FadeInSection>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('features.title')}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
              {t('features.subtitle')}
            </Typography>
          </FadeInSection>
          
          <Grid container spacing={4}>
            {appFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FadeInSection delay={index * 0.1}>
                  <Card sx={{ height: '100%', p: 3 }}>
                    <CardContent>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          mb: 3
                        }}
                      >
                        {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {t(feature.titleKey)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(feature.descriptionKey)}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mobile App Download section */}
      <Box id="app" sx={{ py: 10, backgroundColor: 'background.paper' }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <FadeInSection>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                  {t('mobileApp.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                  {t('mobileApp.subtitle')}
                </Typography>
                
                <List sx={{ mb: 4 }}>
                  {[
                    t('mobileApp.features.multiRole'),
                    t('mobileApp.features.realTimeBooking'),
                    t('mobileApp.features.gpsTracking'),
                    t('mobileApp.features.securePayments'),
                    t('mobileApp.features.messaging'),
                    t('mobileApp.features.reviewSystem')
                  ].map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    startIcon={<AppleIcon />}
                    sx={{ px: 3, py: 1.5, borderRadius: 2 }}
                  >
                    {t('mobileApp.appStore')}
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<AndroidIcon />}
                    sx={{ px: 3, py: 1.5, borderRadius: 2 }}
                  >
                    {t('mobileApp.googlePlay')}
                  </Button>
                </Stack>
              </FadeInSection>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FadeInSection>
                <Box
                  sx={{
                    height: 400,
                    backgroundImage: 'url(/hero-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.7)} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
                    }
                  }}
                >
                  <Stack spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    <PhoneAndroidIcon sx={{ fontSize: 80, color: 'white', opacity: 0.9 }} />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {t('mobileApp.appScreenshots')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {t('mobileApp.comingSoon')}
                    </Typography>
                  </Stack>
                </Box>
              </FadeInSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services section */}
      <Box id="services" sx={{ py: 10, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container>
          <FadeInSection>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('services.title')}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 700, mx: 'auto' }}>
              {t('services.subtitle')}
            </Typography>
          </FadeInSection>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FadeInSection>
                <Card sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                  <SecurityIcon color="primary" sx={{ fontSize: 64, mb: 3 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('services.personalProtection.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {t('services.personalProtection.description')}
                  </Typography>
                  <Chip label={t('services.personalProtection.price')} color="primary" variant="outlined" />
                </Card>
              </FadeInSection>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FadeInSection delay={0.1}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                  <GroupIcon color="primary" sx={{ fontSize: 64, mb: 3 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('services.eventSecurity.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {t('services.eventSecurity.description')}
                  </Typography>
                  <Chip label={t('services.eventSecurity.price')} color="primary" variant="outlined" />
                </Card>
              </FadeInSection>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FadeInSection delay={0.2}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 4 }}>
                  <WorkspacePremiumIcon color="primary" sx={{ fontSize: 64, mb: 3 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('services.corporateSecurity.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {t('services.corporateSecurity.description')}
                  </Typography>
                  <Chip label={t('services.corporateSecurity.price')} color="primary" variant="outlined" />
                </Card>
              </FadeInSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials section */}
      <Box id="testimonials" sx={{ py: 10, backgroundColor: 'background.paper' }}>
        <Container>
          <FadeInSection>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('testimonials.title')}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
              {t('testimonials.subtitle')}
            </Typography>
          </FadeInSection>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FadeInSection delay={index * 0.1}>
                  <Card sx={{ height: '100%', p: 3 }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {t(testimonial.nameKey)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t(testimonial.roleKey)}
                          </Typography>
                        </Box>
                      </Stack>
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        "{t(testimonial.commentKey)}"
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact section */}
      <Box id="contact" sx={{ py: 10, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container>
          <FadeInSection>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('cta.title')}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
              {t('cta.subtitle')}
            </Typography>
          </FadeInSection>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <FadeInSection>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <PhoneAndroidIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('cta.downloadApp.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('cta.downloadApp.description')}
                  </Typography>
                  <Button variant="contained" fullWidth>
                    {t('cta.downloadApp.button')}
                  </Button>
                </Card>
              </FadeInSection>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FadeInSection delay={0.1}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <ChatIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('cta.contactUs.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('cta.contactUs.description')}
                  </Typography>
                  <Button variant="outlined" fullWidth href="mailto:info@wiqayah.com">
                    {t('cta.contactUs.button')}
                  </Button>
                </Card>
              </FadeInSection>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FadeInSection delay={0.2}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <TrendingUpIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {t('cta.adminPortal.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('cta.adminPortal.description')}
                  </Typography>
                  <Button variant="outlined" fullWidth href="/admin/login">
                    {t('cta.adminPortal.button')}
                  </Button>
                </Card>
              </FadeInSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer with hero-bg.png */}
      <Box 
        component="footer" 
        sx={{ 
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          color: 'white', 
          py: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.grey[900], 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
            zIndex: 1
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <ShieldIcon sx={{ fontSize: 32, mr: 1, color: 'secondary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Wiqayah
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.7, opacity: 0.9 }}>
                {t('footer.description')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {t('footer.services.title')}
              </Typography>
              <Stack spacing={1}>
                {[
                  t('footer.services.personalProtection'),
                  t('footer.services.eventSecurity'),
                  t('footer.services.corporateSecurity'),
                  t('footer.services.consultation')
                ].map((item) => (
                  <Typography key={item} variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {t('footer.platform.title')}
              </Typography>
              <Stack spacing={1}>
                {[
                  t('footer.platform.mobileApp'),
                  t('footer.platform.adminPortal'),
                  t('footer.platform.api'),
                  t('footer.platform.support')
                ].map((item) => (
                  <Typography key={item} variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {t('footer.contact.title')}
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('footer.contact.location')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('footer.contact.phone')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('footer.contact.email')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('footer.contact.support')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
