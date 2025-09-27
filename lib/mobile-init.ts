// Mobile app initialization for Capacitor
import { Capacitor } from '@capacitor/core'
import { MOBILE_CONFIG } from './mobile-config'

// Conditional imports for Capacitor plugins
let SplashScreen: any
let StatusBar: any
let Network: any

if (typeof window !== 'undefined') {
  try {
    SplashScreen = require('@capacitor/splash-screen').SplashScreen
    StatusBar = require('@capacitor/status-bar').StatusBar
    Network = require('@capacitor/network').Network
  } catch (error) {
    console.warn('Capacitor plugins not available:', error)
  }
}

export class MobileApp {
  private static instance: MobileApp
  private isInitialized = false
  
  private constructor() {}
  
  static getInstance(): MobileApp {
    if (!MobileApp.instance) {
      MobileApp.instance = new MobileApp()
    }
    return MobileApp.instance
  }
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      // Check if running on mobile
      if (!Capacitor.isNativePlatform()) {
        console.log('Running on web platform')
        return
      }
      
      console.log('Initializing mobile app...')
      
      // Configure status bar
      await this.setupStatusBar()
      
      // Configure splash screen
      await this.setupSplashScreen()
      
      // Setup network monitoring
      await this.setupNetworkMonitoring()
      
      // Initialize app-specific features
      await this.initializeAppFeatures()
      
      this.isInitialized = true
      console.log('Mobile app initialized successfully')
      
    } catch (error) {
      console.error('Failed to initialize mobile app:', error)
      throw error
    }
  }
  
  private async setupStatusBar(): Promise<void> {
    try {
      if (StatusBar) {
        await StatusBar.setStyle({ style: 'dark' })
        await StatusBar.setBackgroundColor({ color: '#000000' })
      }
    } catch (error) {
      console.warn('StatusBar setup failed:', error)
    }
  }
  
  private async setupSplashScreen(): Promise<void> {
    try {
      if (SplashScreen) {
        await SplashScreen.show({
          showSpinner: false,
          autoHide: true
        })
        
        // Hide splash screen after delay
        setTimeout(async () => {
          await SplashScreen.hide()
        }, MOBILE_CONFIG.MOBILE.SPLASH_SCREEN_DURATION)
      }
    } catch (error) {
      console.warn('SplashScreen setup failed:', error)
    }
  }
  
  private async setupNetworkMonitoring(): Promise<void> {
    try {
      if (Network) {
        const status = await Network.getStatus()
        console.log('Network status:', status)
        
        // Listen for network changes
        Network.addListener('networkStatusChange', (status) => {
          console.log('Network status changed:', status)
          this.handleNetworkChange(status)
        })
      }
    } catch (error) {
      console.warn('Network monitoring setup failed:', error)
    }
  }
  
  private handleNetworkChange(status: any): void {
    if (!status.connected) {
      console.log('Network disconnected')
      // Handle offline state
      this.showOfflineMessage()
    } else {
      console.log('Network connected')
      // Handle online state
      this.hideOfflineMessage()
    }
  }
  
  private showOfflineMessage(): void {
    // You can implement a toast or banner to show offline status
    console.log('App is offline')
  }
  
  private hideOfflineMessage(): void {
    // Hide offline message when back online
    console.log('App is back online')
  }
  
  private async initializeAppFeatures(): Promise<void> {
    // Initialize any app-specific features here
    console.log('Initializing app features...')
    
    // Example: Initialize push notifications
    if (MOBILE_CONFIG.PLUGINS.PUSH_NOTIFICATIONS) {
      await this.initializePushNotifications()
    }
    
    // Example: Initialize biometric authentication
    if (MOBILE_CONFIG.PLUGINS.BIOMETRIC_AUTH) {
      await this.initializeBiometricAuth()
    }
  }
  
  private async initializePushNotifications(): Promise<void> {
    try {
      // Add push notification setup here
      console.log('Push notifications initialized')
    } catch (error) {
      console.warn('Push notifications setup failed:', error)
    }
  }
  
  private async initializeBiometricAuth(): Promise<void> {
    try {
      // Add biometric authentication setup here
      console.log('Biometric authentication initialized')
    } catch (error) {
      console.warn('Biometric authentication setup failed:', error)
    }
  }
  
  // Public methods for app lifecycle
  async onAppResume(): Promise<void> {
    console.log('App resumed')
    // Handle app resume logic
  }
  
  async onAppPause(): Promise<void> {
    console.log('App paused')
    // Handle app pause logic
  }
  
  async onAppDestroy(): Promise<void> {
    console.log('App destroyed')
    // Handle app destroy logic
  }
}

// Export singleton instance
export const mobileApp = MobileApp.getInstance()

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  mobileApp.initialize().catch(console.error)
}
