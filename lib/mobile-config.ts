// Mobile app configuration for Capacitor
export const MOBILE_CONFIG = {
  // Backend server URL for mobile app
  API_BASE_URL: 'https://camp-trade.vercel.app',
  
  // API endpoints
  ENDPOINTS: {
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    CHAT: '/api/chat',
    AUTH: '/api/auth',
    UPLOADS: '/api/uploads/images',
    PRICE_PREDICTION: '/api/price-prediction',
    PRODUCT_IMAGE: '/api/product-image',
    GENERATE_IMAGE: '/api/generate-image'
  },
  
  // Mobile-specific settings
  MOBILE: {
    SPLASH_SCREEN_DURATION: 2000,
    STATUS_BAR_STYLE: 'dark',
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_BIOMETRIC_AUTH: true
  },
  
  // Capacitor plugins
  PLUGINS: {
    CAMERA: true,
    FILESYSTEM: true,
    NETWORK: true,
    STORAGE: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC_AUTH: true
  }
}

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${MOBILE_CONFIG.API_BASE_URL}${endpoint}`
}

// Mobile-specific API client
export class MobileApiClient {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = MOBILE_CONFIG.API_BASE_URL
  }
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
    
    return fetch(url, { ...defaultOptions, ...options })
  }
  
  // Product-related API calls
  async getProducts() {
    return this.request(MOBILE_CONFIG.ENDPOINTS.PRODUCTS)
  }
  
  async getProduct(id: string) {
    return this.request(`${MOBILE_CONFIG.ENDPOINTS.PRODUCTS}/${id}`)
  }
  
  // Order-related API calls
  async createOrder(orderData: any) {
    return this.request(MOBILE_CONFIG.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  }
  
  // Chat API calls
  async sendMessage(message: string) {
    return this.request(MOBILE_CONFIG.ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }
  
  // Image upload
  async uploadImage(imageData: FormData) {
    return this.request(MOBILE_CONFIG.ENDPOINTS.UPLOADS, {
      method: 'POST',
      body: imageData
    })
  }
}
