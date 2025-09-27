# CampTrade Mobile App Build Guide

This guide explains how to build the CampTrade mobile app using Capacitor with your deployed backend server at [https://camp-trade.vercel.app](https://camp-trade.vercel.app).

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Android Studio** (for Android builds)
3. **Xcode** (for iOS builds, macOS only)
4. **Java Development Kit (JDK)** (for Android)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Capacitor dependencies:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios @capacitor/splash-screen @capacitor/status-bar @capacitor/network
```

## Configuration

The app is already configured to use your deployed backend server:
- **Backend URL**: `https://camp-trade.vercel.app`
- **App ID**: `com.camptrade.app`
- **App Name**: `CampTrade`
- **Mobile App**: Simple HTML-based mobile interface

## Build Commands

### Sync with Capacitor
```bash
npm run mobile:build
```
This syncs the mobile app with Capacitor.

### Android Development

1. **Open Android Studio**:
```bash
npm run mobile:android
```

2. **Run on Android Device/Emulator**:
```bash
npm run mobile:run:android
```

### iOS Development (macOS only)

1. **Open Xcode**:
```bash
npm run mobile:ios
```

2. **Run on iOS Device/Simulator**:
```bash
npm run mobile:run:ios
```

## Project Structure

```
CampTrade/
├── capacitor.config.ts          # Capacitor configuration
├── lib/
│   ├── mobile-config.ts        # Mobile app configuration
│   └── mobile-init.ts          # Mobile app initialization
├── out/                        # Static export directory
├── android/                    # Android project (generated)
└── ios/                        # iOS project (generated)
```

## Configuration Details

### Backend Server Configuration
The app is configured to use your deployed Vercel app as the backend:
- All API calls are routed to `https://camp-trade.vercel.app`
- Static assets are served from the same domain
- CORS is handled by your Vercel deployment

### Mobile Features
- **Splash Screen**: 2-second white background
- **Status Bar**: Dark style
- **Network Monitoring**: Automatic offline/online detection
- **Push Notifications**: Ready for implementation
- **Biometric Authentication**: Ready for implementation

## Development Workflow

1. **Make changes** to your Next.js app
2. **Deploy to Vercel** (your backend server)
3. **Export static files**: `npm run export`
4. **Sync with mobile**: `npm run mobile:build`
5. **Test on device**: `npm run mobile:run:android` or `npm run mobile:run:ios`

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all dependencies are installed
2. **Android Studio Issues**: Ensure Android SDK is properly configured
3. **Xcode Issues**: Ensure Xcode command line tools are installed
4. **Network Issues**: Check that your Vercel deployment is accessible

### Debug Commands

```bash
# Check Capacitor status
npx cap doctor

# List available devices
npx cap run android --list
npx cap run ios --list

# Clean and rebuild
npx cap sync --force
```

## Deployment

### Android
1. Build the app in Android Studio
2. Generate signed APK or AAB
3. Upload to Google Play Store

### iOS
1. Build the app in Xcode
2. Archive and upload to App Store Connect
3. Submit for App Store review

## API Integration

The mobile app uses the following API endpoints from your Vercel deployment:

- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/chat` - Chat functionality
- `/api/uploads/images` - Image uploads
- `/api/price-prediction` - Price predictions
- `/api/product-image` - Product image generation

All API calls are automatically routed to your deployed backend server.

## Support

For issues with:
- **Capacitor**: Check [Capacitor Documentation](https://capacitorjs.com/docs)
- **Android**: Check [Android Studio Documentation](https://developer.android.com/studio)
- **iOS**: Check [Xcode Documentation](https://developer.apple.com/xcode/)
- **Backend**: Check your Vercel deployment logs
