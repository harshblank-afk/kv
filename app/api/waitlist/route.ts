import { NextResponse } from 'next/server';
import { sendWaitlistWelcome } from '@/lib/mailer';
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
        await logToDatabase('waitlist_join', { name, email });

        // Send Welcome Email
        const emailResult = await sendWaitlistWelcome(email, name);

        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
        }

        return NextResponse.json({ success: true, message: 'Joined waitlist successfully' });
    } catch (error: unknown) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
