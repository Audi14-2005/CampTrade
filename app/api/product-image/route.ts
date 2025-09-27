import { NextRequest, NextResponse } from 'next/server'
import { generateProductImageUrl } from '@/lib/product-image-generator'
import { Product } from '@/lib/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const name = searchParams.get('name')
        const id = searchParams.get('id')

        if (!category || !name || !id) {
            return NextResponse.json(
                { error: 'Category, name, and id are required' },
                { status: 400 }
            )
        }

        // Create a mock product object
        const product: Product = {
            id: id,
            name: name,
            price: 0,
            description: '',
            category: category,
            seller: '',
            recommended: false
        }

        // Generate the image URL
        const imageUrl = generateProductImageUrl(product)

        // Return the image as a redirect
        return NextResponse.redirect(imageUrl)

    } catch (error) {
        console.error('Error generating product image:', error)
        // Use absolute URL for redirect
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        return NextResponse.redirect(`${baseUrl}/product-placeholder.svg`)
    }
}
