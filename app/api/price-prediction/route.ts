import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = "https://camptradebackend.onrender.com/api"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const itemId = searchParams.get('itemId')
        const timestamp = searchParams.get('timestamp')

        if (!itemId || !timestamp) {
            return NextResponse.json(
                { error: 'Item ID and timestamp are required' },
                { status: 400 }
            )
        }

        console.log('Proxying price prediction request to Django backend:', { itemId, timestamp })

        const response = await fetch(`${API_BASE_URL}/${itemId}/${timestamp}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                // Item not found, return null (not an error)
                return NextResponse.json(null)
            }
            console.error('Django API error:', response.status, response.statusText)
            return NextResponse.json(
                { error: 'Failed to fetch price prediction from backend' },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log('Successfully fetched price prediction from Django backend:', data)

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in price prediction API route:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
