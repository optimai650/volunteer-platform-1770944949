import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
  
  await resend.emails.send({
    from: 'Volunteer Platform <noreply@volunteers.com>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Volunteer Platform!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `
  })
}

export async function sendSignUpConfirmation(
  volunteerEmail: string,
  volunteerName: string,
  opportunityTitle: string,
  organizationName: string,
  startDate: Date
) {
  await resend.emails.send({
    from: 'Volunteer Platform <noreply@volunteers.com>',
    to: volunteerEmail,
    subject: `Confirmed: ${opportunityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Sign-up Confirmed!</h2>
        <p>Hi ${volunteerName},</p>
        <p>You've successfully signed up for:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${opportunityTitle}</h3>
          <p><strong>Organization:</strong> ${organizationName}</p>
          <p><strong>Date:</strong> ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}</p>
        </div>
        <p>Thank you for volunteering!</p>
      </div>
    `
  })
}

export async function sendSignUpNotificationToOrg(
  orgEmail: string,
  volunteerName: string,
  opportunityTitle: string
) {
  await resend.emails.send({
    from: 'Volunteer Platform <noreply@volunteers.com>',
    to: orgEmail,
    subject: `New volunteer sign-up: ${opportunityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Volunteer Sign-up</h2>
        <p>${volunteerName} has signed up for:</p>
        <h3>${opportunityTitle}</h3>
        <p>Login to your dashboard to view details.</p>
      </div>
    `
  })
}
