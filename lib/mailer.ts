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

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }[];
}

export async function sendEmail({ to, subject, html, from, attachments }: SendEmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: from || SMTP_FROM, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
            attachments,
        });

        console.log(`Email sent: ${info.messageId} to ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`Error sending email to ${to}:`, error);
        // Determine if it's a connection error or auth error
        let errorMessage = 'Failed to send email.';
        if (error.code === 'EAUTH') {
            errorMessage = 'SMTP Authentication failed. Check credentials.';
        } else if (error.code === 'ESOCKET') {
            errorMessage = 'SMTP Connection failed. Check host/port.';
        }

        return { success: false, error: error.message, details: errorMessage };
    }
}
