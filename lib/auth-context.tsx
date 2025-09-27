"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, AuthUser, getGroupFromEmail, generateUserId, getGroupDisplayName } from './supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: AuthUser | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signOut: () => Promise<void>
    groupName: string | null
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                loadUserData(session.user)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    await loadUserData(session.user)
                } else {
                    setUser(null)
                    setLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const loadUserData = async (supabaseUser: User) => {
        try {
            console.log('Loading user data for:', supabaseUser.email)

            // Check if user exists in our custom table
            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', supabaseUser.id)
                .single()

            console.log('User data query result:', { userData, error })

            if (error || !userData) {
                console.log('User not found in database, creating manually...')
                // If user doesn't exist, create manually
                const group = getGroupFromEmail(supabaseUser.email!)
                if (!group) {
                    throw new Error('Email domain not allowed')
                }

                const userId = generateUserId()
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: supabaseUser.id,
                        email: supabaseUser.email!,
                        user_id: userId,
                        group_name: group,
                        created_at: new Date().toISOString()
                    })

                if (insertError) {
                    console.error('Error creating user record:', insertError)
                    // If insert fails, try to get user data again (maybe it was created by trigger)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    const { data: retryData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', supabaseUser.id)
                        .single()

                    if (retryData) {
                        console.log('User found on retry:', retryData)
                        setUser({
                            id: retryData.id,
                            email: retryData.email,
                            user_id: retryData.user_id,
                            group_name: retryData.group_name
                        })
                    } else {
                        throw insertError
                    }
                } else {
                    console.log('User created successfully:', { id: supabaseUser.id, email: supabaseUser.email, user_id: userId, group_name: group })
                    setUser({
                        id: supabaseUser.id,
                        email: supabaseUser.email!,
                        user_id: userId,
                        group_name: group
                    })
                }
            } else {
                console.log('User found in database:', userData)
                setUser({
                    id: userData.id,
                    email: userData.email,
                    user_id: userData.user_id,
                    group_name: userData.group_name
                })
            }
        } catch (error) {
            console.error('Error loading user data:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const group = getGroupFromEmail(email)
            if (!group) {
                return { success: false, error: 'Email domain not allowed. Please use a valid campus email.' }
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                return { success: false, error: error.message }
            }

            console.log('Signin successful, user data:', data.user)

            if (data.user) {
                // User signed in successfully, load their data
                console.log('Loading user data after signin...')
                await loadUserData(data.user)
            }

            return { success: true }
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' }
        }
    }

    const signUp = async (email: string, password: string) => {
        try {
            const group = getGroupFromEmail(email)
            if (!group) {
                return { success: false, error: 'Email domain not allowed. Please use a valid campus email.' }
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            })

            if (error) {
                return { success: false, error: error.message }
            }

            console.log('Signup successful, user data:', data.user)

            if (data.user) {
                // User created successfully, load their data
                console.log('Loading user data after signup...')
                await loadUserData(data.user)
            }

            return { success: true }
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' }
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            await loadUserData(session.user)
        }
    }

    const groupName = user ? getGroupDisplayName(user.group_name) : null

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signIn,
            signUp,
            signOut,
            groupName,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
