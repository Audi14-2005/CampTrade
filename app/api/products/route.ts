import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching products for userId:', userId)

    // Try Django backend first
    try {
      console.log('Attempting to fetch from Django backend...')
      const response = await fetch(`https://camptradebackend.onrender.com/api/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Successfully fetched products from Django backend:', data)

        // Prices are already in INR, no conversion needed
        console.log('Prices are already in INR, no conversion applied')

        return NextResponse.json(data)
      } else {
        console.log('Django backend returned error:', response.status, response.statusText)
      }
    } catch (djangoError) {
      console.log('Django backend unavailable, falling back to Supabase:', djangoError)
    }

    // Fallback to Supabase data
    console.log('Fetching products from Supabase...')
    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products from database' },
        { status: 500 }
      )
    }

    // Transform Supabase data to match the expected format
    const products = items?.map((item, index) => ({
      id: item.item_id,
      name: item.title,
      price: item.price,
      description: item.description || 'No description available',
      image: item.images?.[0] || '/product-placeholder.svg',
      category: item.category,
      seller: `Seller ${item.seller_id?.slice(-4) || 'Unknown'}`,
      recommended: index < 3, // Mark first 3 as recommended
      brand: item.tags?.find(tag => tag.toLowerCase().includes('brand')) || 'Unknown',
      model: item.tags?.find(tag => tag.toLowerCase().includes('model')) || 'N/A',
      condition: item.tags?.find(tag => tag.toLowerCase().includes('used') || tag.toLowerCase().includes('new')) || 'Good',
      location: 'Campus'
    })) || []

    console.log('Successfully fetched products from Supabase:', products.length, 'items')

    return NextResponse.json({ items: products })
  } catch (error) {
    console.error('Error in products API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, quantity, discount, discountEndDate, category, tags, images, status, seller_id } = body

    // Validate required fields
    if (!title || !description || price === undefined || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price, quantity' },
        { status: 400 }
      )
    }

    if (!seller_id) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Generate a unique item_id
    const itemId = `item_${Date.now().toString().padStart(4, '0')}`

    // Prepare the product data for the items table
    const productData = {
      item_id: itemId,
      title: title,
      description: description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: category || 'general',
      tags: tags || [],
      images: images || [],
      discount: discount ? parseFloat(discount) : null,
      discount_end_date: discountEndDate || null,
      status: status || 'published',
      seller_id: seller_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Creating product with data:', productData)

    // Insert into the items table
    const { data, error } = await supabase
      .from('items')
      .insert([productData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create product in database' },
        { status: 500 }
      )
    }

    console.log('Product created successfully:', data)

    return NextResponse.json({
      success: true,
      product: data[0],
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}