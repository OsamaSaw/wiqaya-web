# Wiqayah Landing & Admin Dashboard

A modern React TypeScript application that serves as both a landing page for the Wiqayah security company and an admin dashboard for managing users, guards, bookings, and payments.

## 🚀 Features

### Landing Page
- **Bilingual Support**: Arabic and English with automatic language detection
- **Modern UI**: Material-UI components with custom theming
- **Responsive Design**: Optimized for all device sizes
- **Smooth Animations**: Framer Motion animations and intersection observers
- **Contact Forms**: Direct integration with backend services

### Admin Dashboard
- **Secure Authentication**: Firebase-based authentication system
- **User Management**: View and manage customer profiles
- **Guard Management**: Track and manage security personnel
- **Booking System**: Monitor and handle service bookings
- **Payment Tracking**: View payment history and status
- **Admin Controls**: Manage administrator accounts
- **Real-time Data**: Live updates and analytics
- **Data Visualization**: Charts and metrics using MUI X Charts and Recharts

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.7.2
- **UI Library**: Material-UI (MUI) 6.1.8
- **Routing**: React Router DOM 6.28.0
- **Authentication**: Firebase 12.1.0
- **Animations**: Framer Motion 11.15.0
- **Internationalization**: i18next 25.4.0
- **HTTP Client**: Axios 1.7.9
- **Charts**: MUI X Charts 7.22.2, Recharts 3.1.2
- **Build Tool**: Create React App 5.0.1

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wiqayah-landing-admin-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Backend API Configuration
   REACT_APP_API_BASE_URL=http://localhost:3000
   
   # Development Server Port
   PORT=3001
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and configure sign-in methods
   - Update `src/config/firebase.ts` with your Firebase configuration

## 🚀 Development

### Start Development Server
```bash
npm start
```
The application will open at `http://localhost:3001`

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## 🌐 Deployment

### Prerequisites
- Node.js 16+ installed
- Backend API server running and accessible
- Firebase project configured

### Build and Deploy Steps

1. **Configure Environment Variables**
   ```bash
   # For production deployment
   REACT_APP_API_BASE_URL=https://your-backend-domain.com
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy Options**

   #### Option 1: Static Hosting (Netlify, Vercel, etc.)
   - Upload the `build` folder to your hosting provider
   - Configure redirects for single-page application routing

   #### Option 2: Traditional Web Server
   - Copy `build` folder contents to your web server directory
   - Configure server to serve `index.html` for all routes

   #### Option 3: Firebase Hosting
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

### Environment-Specific Configurations

#### Development
- API URL: `http://localhost:3000`
- Port: `3001`
- Debug mode enabled

#### Production
- API URL: Your production backend URL
- Optimized builds
- Error tracking enabled

## 🔧 Project Structure

```
src/
├── admin-panel/          # Admin dashboard pages
│   ├── components/       # Admin-specific components
│   ├── AdminsPage.tsx
│   ├── BookingsPage.tsx
│   ├── ConversationsPage.tsx
│   ├── DashboardLayout.tsx
│   ├── DashboardPage.tsx
│   ├── GuardsPage.tsx
│   ├── PaymentsPage.tsx
│   └── UsersPage.tsx
├── components/           # Shared components
│   ├── AnimatedCounter.tsx
│   ├── AnimatedSection.tsx
│   ├── LanguageSwitcher.tsx
│   └── ProtectedRoute.tsx
├── config/              # Configuration files
│   └── firebase.ts
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── i18n/               # Internationalization
│   ├── locales/
│   │   ├── ar.json
│   │   └── en.json
│   └── index.ts
├── pages/              # Main pages
│   ├── AdminLogin.tsx
│   └── LandingPage.tsx
├── services/           # API services
│   └── api.ts
├── theme/              # MUI theme configuration
│   └── index.ts
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── types.ts            # TypeScript type definitions
```

## 🔐 Authentication

The application uses Firebase Authentication for admin login. Ensure your Firebase project has:
- Email/Password authentication enabled
- Authorized admin users configured

## 🌍 Internationalization

The app supports Arabic and English languages:
- Automatic language detection
- Manual language switching
- RTL support for Arabic
- Translation files in `src/i18n/locales/`

## 📱 API Integration

The app communicates with the backend through:
- REST API calls using Axios
- Centralized API service in `src/services/api.ts`
- Environment-based API URL configuration

## 🎨 Theming

Custom Material-UI theme with:
- Corporate color scheme
- Typography customizations
- Component overrides
- Dark/Light mode support

## 🔍 Browser Support

- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (last 1 version)
- Mobile browsers (>0.2% market share)

## 📄 Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary to Wiqayah Security Company.

## 🆘 Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`

2. **API calls failing**
   - Verify `REACT_APP_API_BASE_URL` in `.env` file
   - Ensure backend server is running
   - Check network connectivity

3. **Authentication not working**
   - Verify Firebase configuration in `src/config/firebase.ts`
   - Check Firebase Console for authentication setup
   - Ensure admin users are properly configured

4. **Language switching issues**
   - Check translation files in `src/i18n/locales/`
   - Verify i18next configuration

## 📞 Support

For technical support or questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2024
