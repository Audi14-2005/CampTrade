import { NextRequest, NextResponse } from 'next/server'

// CampTrade executives (canonical display name and phone)
const EXECUTIVES = [
    { name: "Monic Auditya A", phone: "8825511797" },
    { name: "Akshaya", phone: "7667447308" },
    { name: "Harini", phone: "8122071086" },
    { name: "DhivyaShree", phone: "8807099153" },
]

// Name variants mapped to canonical index in EXECUTIVES
const NAME_INDEX: Record<string, number> = {
    'monic': 0,
    'monic auditya': 0,
    'monic auditya a': 0,
    'akshaya': 1,
    'harini': 2,
    'dhivyashree': 3,
    'dhivya shree': 3,
    'dhivya': 3,
    'divyashree': 3,
}

function sanitizeText(text: string): string {
    if (!text) return text
    // Remove markdown markers and normalize whitespace
    return text
        .replace(/[*_`]+/g, "")
        .replace(/^[\s]*[•\-*]+\s*/gm, "- ")
        .replace(/\r\n|\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim()
}

function pickContactByName(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase()
    for (const [key, idx] of Object.entries(NAME_INDEX)) {
        if (lowerMessage.includes(key)) {
            return EXECUTIVES[idx]
        }
    }
    return null
}

function pickContactGeneric(userMessage: string) {
    const idx = Math.abs(userMessage.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % EXECUTIVES.length
    return EXECUTIVES[idx]
}

function maybeHandleContactRequest(userMessage: string): string | null {
    const lowerMessage = userMessage.toLowerCase()

    // If a specific name is mentioned, return that person only
    const named = pickContactByName(userMessage)
    if (named) {
        return `You can contact ${named.name} – ${named.phone}.`
    }

    // Generic executive/contact/support request
    const contactKeywords = ['executive', 'contact', 'support', 'talk to', 'call', 'phone', 'help', 'assistance']
    if (contactKeywords.some(keyword => lowerMessage.includes(keyword))) {
        const contact = pickContactGeneric(userMessage)
        return `You can contact ${contact.name} – ${contact.phone}.`
    }

    return null
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const message = body.message

        if (!message) {
            return NextResponse.json({ error: 'message is required' }, { status: 400 })
        }

        // Intercept executive/contact requests to enforce a single recommendation
        const contactResponse = maybeHandleContactRequest(message)
        if (contactResponse) {
            return NextResponse.json({ reply: contactResponse })
        }

        // Mistral API integration
        const apiKey = process.env.MISTRAL_API_KEY || 'biQdCPlNpe1q5odzxRyaTKPK9Ke9xMLj'
        const model = process.env.MISTRAL_MODEL || 'mistral-small-latest'

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Mistral API key not configured' },
                { status: 500 }
            )
        }

        try {
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: "You are Zyraa, an AI assistant built by Team Invicta to help users in the CampTrade platform. Purpose: Assist students in finding, buying, and selling products within their campus community. Guidelines: 1) Always respond in a friendly, helpful, and professional tone. 2) Clearly guide users toward their desired product or solution. 3) If asked about your origin, say you were created by Team Invicta. 4) If a problem cannot be solved directly, recommend contacting a CampTrade executive: Monic Auditya A – 8825511797; Akshaya – 7667447308; Harini – 8122071086; DhivyaShree – 8807099153. 5) If a user asks for a person by name, return only that person's details. 6) Never invent contacts beyond this list. 7) Keep answers short, actionable, and clear."
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.3,
                    stream: false,
                }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Mistral API error:', response.status, errorText)
                return NextResponse.json(
                    { error: 'AI service temporarily unavailable' },
                    { status: 502 }
                )
            }

            const data = await response.json()
            const content = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.'

            return NextResponse.json({ reply: sanitizeText(content) })

        } catch (error) {
            console.error('Mistral API request failed:', error)
            return NextResponse.json(
                { error: 'AI service temporarily unavailable' },
                { status: 502 }
            )
        }

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
