// Use Next.js API routes to avoid CORS issues
const API_BASE_URL = ''

export interface Product {
    id: string
    name: string
    price: number
    description: string
    image?: string
    category: string
    seller: string
    recommended: boolean
    timestamp?: string
    brand?: string
    model?: string
    condition?: string
    location?: string
}

export interface PricePrediction {
    item_id: string
    timestamp: string
    predicted_price: number
    confidence: number
    trend: 'up' | 'down' | 'stable'
}

export class CampTradeAPI {
    private baseUrl: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    /**
     * Fetch all products with recommendations for a specific user
     */
    async getProducts(userId: string): Promise<Product[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/products?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`)
            }

            const data = await response.json()
            console.log('API response data:', data)

            // Handle different response formats
            let items = []

            if (data && Array.isArray(data.items)) {
                // Django backend format: {items: [...]}
                items = data.items
            } else if (data && data.status === 'success' && Array.isArray(data.items)) {
                // Django backend format: {status: "success", items: [...]}
                items = data.items
            } else if (Array.isArray(data)) {
                // Direct array format
                items = data
            }

            console.log('Extracted items:', items.length, 'items')

            return items.map((item: any) => ({
                id: item.id?.toString() || item.item_id?.toString() || Math.random().toString(),
                name: item.title || item.name || 'Unknown Product',
                price: parseFloat(item.price) || 0,
                description: item.description || 'No description available',
                image: item.image || "/product-placeholder.svg",
                category: item.category || 'general',
                seller: item.seller || `Seller ${item.seller_id?.slice(-4) || 'Unknown'}`,
                recommended: item.recommended || false,
                brand: item.brand || 'Unknown',
                model: item.model || 'N/A',
                condition: item.condition || 'Good',
                location: item.location || 'Campus',
            }))
        } catch (error) {
            console.error('Error fetching products:', error)
            return []
        }
    }

    /**
     * Get price prediction for an item at a specific timestamp
     */
    async getPricePrediction(itemId: string, timestamp: string): Promise<PricePrediction | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/price-prediction?itemId=${itemId}&timestamp=${timestamp}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch price prediction: ${response.status}`)
            }

            const data = await response.json()

            // Prices are already in INR, no conversion needed
            return data
        } catch (error) {
            console.error('Error fetching price prediction:', error)
            return null
        }
    }

    /**
     * Get current timestamp in ISO format
     */
    getCurrentTimestamp(): string {
        return new Date().toISOString()
    }

    /**
     * Format price for display
     */
    formatPrice(price: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price)
    }

    /**
     * Get price trend icon
     */
    getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
        switch (trend) {
            case 'up':
                return '📈'
            case 'down':
                return '📉'
            case 'stable':
                return '➡️'
            default:
                return '➡️'
        }
    }
}

// Export a default instance
export const campTradeAPI = new CampTradeAPI()
