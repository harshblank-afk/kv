import { NextResponse } from 'next/server';
import { sendNewsletterWelcome } from '@/lib/mailer';
import { logToDatabase } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;

        if (!email || !name) {
            return NextResponse.json({ error: 'Email and Name are required' }, { status: 400 });
        }

        // Log to "Database"
        await logToDatabase('newsletter_subscription', { name, email });

        // Send Welcome Email
        const emailResult = await sendNewsletterWelcome(email, name);

        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
            // We still return success to the user so they don't retry unnecessarily, but we log the error.
        }

        return NextResponse.json({ success: true, message: 'Subscribed successfully' });
    } catch (error: unknown) {
        console.error('Newsletter API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
