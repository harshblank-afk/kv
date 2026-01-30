import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendSupportTicket } from '@/lib/mailer';
import { logToDatabase } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const message = formData.get('message') as string;
        // Attachment handling could be added here if we want to support file uploads for support too.
        // For now, simpler flow.

        if (!email || !name || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ticketId = `SUP-${uuidv4().substring(0, 8).toUpperCase()}`;

        // Log to "Database"
        await logToDatabase('support_ticket', { ticketId, name, email, phone, message });

        // Send Emails
        const emailResult = await sendSupportTicket(email, name, ticketId, message);

        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
            // Consider returning 500 if email is critical, or just log it.
        }

        return NextResponse.json({
            success: true,
            message: 'Support ticket created successfully',
            ticketId
        });
    } catch (error: unknown) {
        console.error('Support API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
