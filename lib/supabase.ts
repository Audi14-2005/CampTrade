import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://byeefyogeusvnophzoph.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZWVmeW9nZXVzdm5vcGh6b3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTI1MTcsImV4cCI6MjA3NDQ4ODUxN30.lpIl6MmKLt1fe6f2Ua45FrZ4qaKL29uTagk2vt8ffMo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
    id: string
    email: string
    user_id: string
    group_name: string
    created_at: string
}

export interface AuthUser {
    id: string
    email: string
    user_id: string
    group_name: string
}

// Allowed Gmail domains for different groups
export const ALLOWED_DOMAINS = {
    'students': ['gmail.com', 'outlook.com', 'yahoo.com'],
    'faculty': ['university.edu', 'college.edu', 'institute.edu'],
    'staff': ['university.edu', 'college.edu', 'institute.edu']
}

export function getGroupFromEmail(email: string): string | null {
    const domain = email.split('@')[1]?.toLowerCase()

    for (const [group, domains] of Object.entries(ALLOWED_DOMAINS)) {
        if (domains.includes(domain)) {
            return group
        }
    }

    return null
}

export function generateUserId(): string {
    const randomNum = Math.floor(Math.random() * 500) + 1
    return `user_${randomNum.toString().padStart(4, '0')}`
}

export function getGroupDisplayName(group: string): string {
    switch (group) {
        case 'students':
            return 'Student Community'
        case 'faculty':
            return 'Faculty Members'
        case 'staff':
            return 'Staff Members'
        default:
            return 'Campus Community'
    }
}
