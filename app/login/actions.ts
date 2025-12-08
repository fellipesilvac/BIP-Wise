'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const username = formData.get('username') as string
    const parentId = formData.get('parentId') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                username: username,
                parent_id: parentId,
            },
        },
    })

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // Redirect to login page with success message
    redirect('/login?signup_success=true')
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function signInWithApple() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    if (data.url) {
        redirect(data.url)
    }
}
