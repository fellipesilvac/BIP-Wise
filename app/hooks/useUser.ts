import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/app/types/profile'

export type UserData = {
    id: string
    email: string | undefined
    name: string
    username: string | null
    avatar_url: string | null
    plan: string
}

export function useUser() {
    const [user, setUser] = useState<UserData | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        let channel: any = null;

        async function fetchData() {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser()

                if (!authUser) {
                    setLoading(false)
                    return
                }

                // Initial Profile Fetch
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                // Fetch Subscription & Plan
                const { data: subscription } = await supabase
                    .from('subscriptions')
                    .select('*, plans(name)')
                    .eq('user_id', authUser.id)
                    .maybeSingle()

                const planName = subscription?.plans?.name || 'Gratuito'

                if (profileData) {
                    setProfile(profileData as Profile)
                    setUser({
                        id: authUser.id,
                        email: authUser.email,
                        name: profileData.full_name || 'Usuário',
                        username: profileData.username || null,
                        avatar_url: profileData.avatar_url || null,
                        plan: planName
                    })
                } else {
                    setUser({
                        id: authUser.id,
                        email: authUser.email,
                        name: 'Usuário',
                        username: null,
                        avatar_url: null,
                        plan: planName
                    })
                }

                // Realtime Subscription
                channel = supabase
                    .channel('profile_changes')
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `id=eq.${authUser.id}`
                        },
                        (payload) => {
                            const newProfile = payload.new as Profile
                            setProfile(newProfile)
                            setUser(prev => {
                                if (!prev) return null
                                return {
                                    ...prev,
                                    name: newProfile.full_name || 'Usuário',
                                    username: newProfile.username || null,
                                    avatar_url: newProfile.avatar_url || null
                                }
                            })
                        }
                    )
                    .subscribe()

            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            if (channel) supabase.removeChannel(channel)
        }
    }, [])

    return { user, profile, loading }
}
