import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || `"Kridavista Support" <${SMTP_USER}>`;

// Create re-usable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

/* =========================================================================
   HTML Email Templates (Magenta Theme)
   ========================================================================= */

const emailHeader = `
<div style="background-color: #fce7f3; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #c026d3; margin: 0; font-family: 'Arial', sans-serif;">Kridavista</h1>
    <p style="color: #555; font-size: 14px; margin-top: 5px;">Virtual Connections. Real Emotion.</p>
</div>
`;

const emailFooter = `
<div style="background-color: #fce7f3; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; margin-top: 20px; font-size: 12px; color: #666;">
    <p>&copy; ${new Date().getFullYear()} Kridavista. All rights reserved.</p>
    <p>Follow us on social media for updates.</p>
</div>
`;

function wrapEmailBody(content: string) {
    return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${emailHeader}
        <div style="padding: 30px; color: #333; line-height: 1.6;">
            ${content}
        </div>
        ${emailFooter}
    </div>
    `;
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType?: string;
        path?: string;
    }[];
}

export async function sendEmail({ to, subject, html, from, attachments }: SendEmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: from || SMTP_FROM,
            to,
            subject,
            html,
            attachments,
        });
        console.log(`Email sent: ${info.messageId} to ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (error: unknown) {
        const err = error as Error;
        console.error(`Error sending email to ${to}:`, err);
        return { success: false, error: err.message };
    }
}

/* =========================================================================
   Specific Email Functions
   ========================================================================= */

export async function sendNewsletterWelcome(to: string, name: string) {
    const content = `
        <h2 style="color: #a21caf;">Welcome to the Kridavista Community, ${name}!</h2>
        <p>Thank you for trying to subscribe to our newsletter. You are now on the list to receive the latest updates, feature reveals, and launch announcements.</p>
        <p>We are building something special, and we're glad to have you with us.</p>
        <p><em>Stay tuned for more!</em></p>
    `;
    return sendEmail({
        to,
        subject: 'Welcome to Kridavista Newsletter',
        html: wrapEmailBody(content),
    });
}

export async function sendWaitlistWelcome(to: string, name: string) {
    const content = `
        <h2 style="color: #a21caf;">You're on the List, ${name}!</h2>
        <p>Thanks for joining the Kridavista waitlist. We are thrilled to see your interest in our premium virtual connection platform.</p>
        <p><strong>What to expect:</strong></p>
        <ul>
             <li>Early access to beta features.</li>
             <li>Exclusive community updates.</li>
             <li>A chance to shape the future of virtual interactions.</li>
        </ul>
        <p>We'll notify you as soon as spots open up!</p>
    `;
    return sendEmail({
        to,
        subject: 'You have joined the Kridavista Waitlist',
        html: wrapEmailBody(content),
    });
}

export async function sendSupportTicket(to: string, name: string, ticketId: string, message: string) {
    const userContent = `
        <h2 style="color: #a21caf;">Support Request Received</h2>
        <p>Hi ${name},</p>
        <p>We have received your support request. Your Ticket ID is: <strong style="color: #c026d3; font-size: 1.1em;">${ticketId}</strong>.</p>
        <p>Our team will review your message and get back to you shortly.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 0.9em;"><strong>Your Message:</strong><br/>${message}</p>
    `;

    // Send to User
    const result = await sendEmail({
        to,
        subject: `Support Ticket Received [${ticketId}]`,
        html: wrapEmailBody(userContent),
    });

    // Notify Admin
    const adminContent = `
        <h2>New Support Ticket</h2>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #c026d3;">${message}</blockquote>
    `;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || to; // Fallback

    // Check if sending to admin is distinct from auto-reply to user to avoid spamming if self-test
    if (adminEmail) {
        // Fire and forget admin email to not block response? Or await it?
        // Let's await it to be safe, but return the user result.
        await sendEmail({
            to: adminEmail,
            subject: `[Admin] New Support Ticket: ${ticketId}`,
            html: wrapEmailBody(adminContent),
        });
    }

    return result;
}

export async function sendCareerApplication(to: string, name: string, ticketId: string, role: string, resumeFile: File | Blob | Buffer, resumeName: string) {
    const userContent = `
        <h2 style="color: #a21caf;">Application Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for applying for the position of <strong>${role}</strong> at Kridavista.</p>
        <p>Your Application ID is: <strong style="color: #c026d3;">${ticketId}</strong>.</p>
        <p>We have successfully received your resume. Our talent acquisition team will review your application and contact you if your profile matches our requirements. This usually takes about one week.</p>
        <p>Best of luck!</p>
    `;

    // Send to Applicant
    const result = await sendEmail({
        to,
        subject: `Application Received: ${role} [${ticketId}]`,
        html: wrapEmailBody(userContent),
    });

    // Notify Admin with Attachment
    const adminContent = `
        <h2>New Career Application</h2>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Application ID:</strong> ${ticketId}</p>
        <p><em>Resume attached.</em></p>
    `;

    // In a real Vercel environment, we receive 'File' as Buffer or ArrayBuffer.
    // We'll handle the conversion in the API route, assuming 'resumeFile' passed here is ready for nodemailer.
    // For simplicity in this function signature, we expect Buffer.

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail && resumeFile) {
        await sendEmail({
            to: adminEmail,
            subject: `[Admin] Application for ${role} - ${name}`,
            html: wrapEmailBody(adminContent),
            attachments: [
                {
                    filename: resumeName,
                    content: resumeFile as Buffer
                }
            ]
        });
    }

    return result;
}
