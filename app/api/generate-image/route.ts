import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyB2EUia6G7zimHHMrcdFwDpQwqVODxEPb0'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Cache for generated images
const imageCache = new Map<string, string>()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const product = searchParams.get('product')

        if (!category || !product) {
            return NextResponse.json(
                { error: 'Category and product are required' },
                { status: 400 }
            )
        }

        const cacheKey = `${category}-${product}`

        // Check cache first
        if (imageCache.has(cacheKey)) {
            return NextResponse.redirect(imageCache.get(cacheKey)!)
        }

        // Generate a unique image based on the product
        const imageUrl = await generateProductImage(category, product)

        // Cache the result
        imageCache.set(cacheKey, imageUrl)

        return NextResponse.redirect(imageUrl)

    } catch (error) {
        console.error('Error generating image:', error)
        // Return a placeholder image
        return NextResponse.redirect('/product-placeholder.svg')
    }
}

async function generateProductImage(category: string, productName: string): Promise<string> {
    try {
        // Create a more specific prompt based on the actual product
        const prompt = `Create a clean, professional product image for "${productName}" in the ${category} category. 
    The image should be:
    - Square aspect ratio (1:1)
    - Clean white or light background
    - Product-focused, not lifestyle
    - High quality and detailed
    - Suitable for e-commerce listing
    - No text or watermarks
    - Professional product photography style
    - Make it look like the actual product: ${productName}`

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
            return '/product-placeholder.svg'
        }

        const data = await response.json()

        // For now, return a placeholder since Gemini might not return direct image URLs
        // In a real implementation, you would process the response and return the image URL
        return '/product-placeholder.svg'

    } catch (error) {
        console.error('Error generating product image:', error)
        return '/product-placeholder.svg'
    }
}

export async function POST(request: NextRequest) {
    try {
        const { category, productName } = await request.json()

        if (!category || !productName) {
            return NextResponse.json(
                { error: 'Category and product name are required' },
                { status: 400 }
            )
        }

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
            return NextResponse.json(
                { error: 'Failed to generate image' },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract the generated image URL from the response
        const imageUrl = data.candidates?.[0]?.content?.parts?.[0]?.text || null

        return NextResponse.json({
            success: true,
            imageUrl: imageUrl,
            category: category,
            productName: productName
        })

    } catch (error) {
        console.error('Error generating image:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
