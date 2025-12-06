'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function requestEmailChange(newEmail: string, currentPassword: string) {
    const supabase = await createClient()
    const adminAuthClient = createAdminClient().auth

    try {
        // 1. Verify user is logged in
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('Usuário não autenticado.')
        }

        // 2. Verify current password
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword
        })

        if (signInError) {
            throw new Error('Senha incorreta.')
        }

        // 3. Check if new email is already in use (by another user)
        // We can't strictly "check" without admin, but signInWithOtp will create a user if they don't exist.
        // Or we can try to get user by email via admin.
        // It's cleaner to check first to avoid creating extensive temp users if the email is taken by a real user.
        // However, listUsers is expensive. simplest check: verify if we can send magic link or if it fails.
        // Actually, let's use Admin API to check if user exists.
        const { data: { users }, error: listError } = await adminAuthClient.admin.listUsers()
        if (!listError) {
            const existingUser = users.find(u => u.email === newEmail);
            if (existingUser) {
                throw new Error('Este email já está em uso.');
            }
        }

        // 4. Send OTP to the NEW email
        // We use signInWithOtp. This might create a "temporary" user if one doesn't exist.
        // That is acceptable for verification. We will delete it later.
        const { error: otpError } = await supabase.auth.signInWithOtp({
            email: newEmail,
            options: {
                shouldCreateUser: true, // creates a temp user to receive the code
            }
        })

        if (otpError) {
            throw new Error('Erro ao enviar código de verificação: ' + otpError.message)
        }

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function confirmEmailChange(newEmail: string, otp: string) {
    const supabase = await createClient()
    const adminAuthClient = createAdminClient().auth

    try {
        // 1. Verify user is logged in
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('Usuário não autenticado.')
        }

        // 2. Verify OTP for the NEW email
        // This is tricky. We need to verify the OTP. 
        // If we use supabase.auth.verifyOtp, it will try to log us in as that new user.
        // We don't want to switch sessions.
        // We can use a separate client or just let it return the session tokens and ignore them.

        // Let's use a fresh client or just the current one? 
        // If we use the current one, verifying OTP for a different email might handle it as a new session?
        // documentation: verifyOtp({ email, token, type: 'magiclink' | 'signup' | 'recovery' | 'email_change' })
        // Since we did signInWithOtp (magiclink/signup), type is likely 'magiclink' or 'signup'.
        // If the user didn't exist, it's 'signup'. If they did (but we checked they didn't?), it's 'magiclink'.

        // Actually, we can use the Admin API to verify the link directly? Admin API verifyOTP is not always exposed or works differently.
        // Use a disposable client for verification to avoid messing up the current session.
        const tempClient = createAdminClient() // Wait, admin client creates a client with service role.
        // Admin Verify? 
        // "Verify an OTP. This will return a session."
        // We can just use verifyOtp with type 'email' or 'magiclink'.

        const { data: verifyData, error: verifyError } = await tempClient.auth.verifyOtp({
            email: newEmail,
            token: otp,
            type: 'email'
        })

        if (verifyError) {
            console.error("OTP verification failed:", verifyError);
            throw new Error('Código inválido ou expirado.')
        }

        // If verification passed, `verifyData.user` is the "temp" user.
        const tempUserId = verifyData.user?.id;

        // 3. Delete the temp user
        if (tempUserId) {
            await adminAuthClient.admin.deleteUser(tempUserId)
        }

        // 4. Update the REAL user's email
        // We must use Admin API to update without sending a confirmation email again?
        // updateUser(id, { email: newEmail, email_confirm: true }) <--- ensure it's confirmed
        const { error: updateError } = await adminAuthClient.admin.updateUserById(
            user.id,
            {
                email: newEmail,
                email_confirm: true,
                user_metadata: { ...user.user_metadata } // Keep metadata
            }
        )

        if (updateError) {
            throw new Error('Erro ao atualizar email: ' + updateError.message)
        }

        revalidatePath('/settings/email')
        return { success: true }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
