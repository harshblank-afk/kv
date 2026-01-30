import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendCareerApplication } from '@/lib/mailer';
import { logToDatabase } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const roleTitle = formData.get('roleTitle') as string;
        const resume = formData.get('resume') as File;

        // Additional fields can be logged or used in the future
        const portfolio = formData.get('portfolio') as string;
        const why_join = formData.get('why_join') as string;

        if (!email || !name || !roleTitle || !resume) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ticketId = `APP-${uuidv4().substring(0, 8).toUpperCase()}`;

        // Log to "Database" (excluding binary data)
        await logToDatabase('career_application', { ticketId, name, email, phone, roleTitle, portfolio });

        // Convert File to Buffer for Nodemailer
        const arrayBuffer = await resume.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Send Emails
        const emailResult = await sendCareerApplication(
            email,
            name,
            ticketId,
            roleTitle,
            buffer,
            resume.name
        );

        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
        }

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            ticketId
        });
    } catch (error: unknown) {
        console.error('Career API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
