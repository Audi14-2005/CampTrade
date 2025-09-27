// Image generation service using Gemini API
const GEMINI_API_KEY = 'AIzaSyB2EUia6G7zimHHMrcdFwDpQwqVODxEPb0'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

interface GeneratedImage {
    url: string
    prompt: string
    category: string
}

// Cache for generated images to avoid regenerating the same images
const imageCache = new Map<string, string>()

export async function generateProductImage(category: string, productName: string): Promise<string> {
    const cacheKey = `${category}-${productName}`

    // Check cache first
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey)!
    }

    try {
        const prompt = `Create a clean, professional product image for a ${productName} in the ${category} category. 
    The image should be:
    - Square aspect ratio (1:1)
    - Clean white or light background
    - Product-focused, not lifestyle
    - High quality and detailed
    - Suitable for e-commerce listing
    - No text or watermarks
    - Professional product photography style`

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        })

        if (!response.ok) {
            console.error('Gemini API error:', response.status, response.statusText)
            return '/placeholder.svg'
        }

        const data = await response.json()

        // Extract the generated image URL from the response
        // Note: Gemini API might return different response structure
        // This is a placeholder - you may need to adjust based on actual API response
        const imageUrl = data.candidates?.[0]?.content?.parts?.[0]?.text || '/placeholder.svg'

        // Cache the result
        imageCache.set(cacheKey, imageUrl)

        return imageUrl
    } catch (error) {
        console.error('Error generating product image:', error)
        return '/placeholder.svg'
    }
}

// Generate a unique image URL based on product name and category
export const getProductImage = (category: string, productName: string): string => {
    // Create a unique identifier for this specific product
    const productId = `${category}-${productName}`.toLowerCase().replace(/[^a-z0-9]/g, '-')

    // For now, return a placeholder that will be replaced by generated images
    // In a real implementation, you would store generated images and return their URLs
    return `/api/generate-image?category=${encodeURIComponent(category)}&product=${encodeURIComponent(productName)}`
}

// Generate multiple product images for different categories
export async function generateCategoryImages(): Promise<Record<string, string>> {
    const categories = ['electronics', 'books', 'clothes', 'general']
    const images: Record<string, string> = {}

    for (const category of categories) {
        try {
            const imageUrl = await generateProductImage(category, `sample ${category} product`)
            images[category] = imageUrl
        } catch (error) {
            console.error(`Error generating image for ${category}:`, error)
            images[category] = getProductImage(category, '')
        }
    }

    return images
}
