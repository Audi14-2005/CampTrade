// Product description generator using Gemini API
const GEMINI_API_KEY = 'AIzaSyB2EUia6G7zimHHMrcdFwDpQwqVODxEPb0'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Cache for generated descriptions to avoid regenerating the same descriptions
const descriptionCache = new Map<string, string>()

export async function generateProductDescription(productName: string, category: string): Promise<string> {
    const cacheKey = `${category}-${productName}`

    // Check cache first
    if (descriptionCache.has(cacheKey)) {
        return descriptionCache.get(cacheKey)!
    }

    try {
        const prompt = `Generate a concise, accurate product description for "${productName}" in the ${category} category. 
    
    Requirements:
    - Keep it under 100 words
    - Be specific and accurate to the actual product
    - Include relevant details like condition, features, or specifications
    - Use a professional, e-commerce tone
    - Focus on what makes this product valuable to buyers
    - Don't make up features that aren't mentioned in the product name
    
    Product: ${productName}
    Category: ${category}
    
    Generate a compelling product description:`

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
                    maxOutputTokens: 200,
                }
            })
        })

        if (!response.ok) {
            console.error('Gemini API error:', response.status, response.statusText)
            return getDefaultDescription(productName, category)
        }

        const data = await response.json()
        const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || getDefaultDescription(productName, category)

        // Cache the result
        descriptionCache.set(cacheKey, description)

        return description

    } catch (error) {
        console.error('Error generating product description:', error)
        return getDefaultDescription(productName, category)
    }
}

function getDefaultDescription(productName: string, category: string): string {
    const categoryDescriptions: Record<string, string> = {
        'electronics': `A quality ${productName} perfect for students and tech enthusiasts. Well-maintained and ready to use.`,
        'books': `This ${productName} is in good condition and perfect for your studies. Great value for money.`,
        'clothes': `Stylish ${productName} in excellent condition. Perfect for campus life and casual wear.`,
        'general': `Quality ${productName} in good condition. Great value for students and campus community.`
    }

    return categoryDescriptions[category.toLowerCase()] || `Quality ${productName} in good condition. Perfect for students.`
}

// Generate descriptions for multiple products
export async function generateProductDescriptions(products: Array<{ name: string, category: string }>): Promise<Record<string, string>> {
    const descriptions: Record<string, string> = {}

    // Process products in batches to avoid overwhelming the API
    const batchSize = 5
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize)

        const batchPromises = batch.map(async (product) => {
            const description = await generateProductDescription(product.name, product.category)
            return { key: `${product.category}-${product.name}`, description }
        })

        const batchResults = await Promise.all(batchPromises)
        batchResults.forEach(({ key, description }) => {
            descriptions[key] = description
        })

        // Small delay between batches to be respectful to the API
        if (i + batchSize < products.length) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    return descriptions
}
