import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. Support Ticket Email (With Ticket ID)
function generateSupportEmail(ticketId: string, name: string) {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #c026d3; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Kridavista Support</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #c026d3;">Ticket Created: #${ticketId}</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to Kridavista Support. We have received your query and our team is already looking into it.</p>
        <p>Your Ticket ID is <strong>${ticketId}</strong>. Please keep this for future reference.</p>
        <p>We aim to respond to all inquiries within 24 hours.</p>
        <br>
        <p>Warm regards,</p>
        <p><strong>The Kridavista Team</strong></p>
      </div>
       <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} Kridavista. All rights reserved.
      </div>
    </div>
  `;
}

// 2. Newsletter Welcome Email (No Ticket ID)
function generateNewsletterEmail(name: string) {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #c026d3; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Welcome to Kridavista!</h1>
      </div>
      <div style="padding: 30px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Welcome to the <strong>Kridavista Newsletter</strong>! We are thrilled to have you with us.</p>
        
        <h3 style="color: #c026d3;">What is Kridavista?</h3>
        <p>Kridavista is building the future of virtual connection—a space where you can hang out, play games, and connect with people in a whole new way.</p>
        
        <h3 style="color: #c026d3;">What to expect?</h3>
        <ul>
            <li>Exclusive early access news</li>
            <li>Behind-the-scenes updates</li>
            <li>Feature reveals and launch timelines</li>
        </ul>
        
        <p>Stay tuned! Exciting things are coming your way.</p>
        <br>
        <p>Cheers,</p>
        <p><strong>The Kridavista Team</strong></p>
      </div>
       <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} Kridavista. All rights reserved.
      </div>
    </div>
  `;
}

// 3. Waitlist Welcome Email (No Ticket ID)
function generateWaitlistEmail(name: string) {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #c026d3; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">You're on the list!</h1>
      </div>
      <div style="padding: 30px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>You have successfully joined the <strong>Kridavista Request Access Waitlist</strong>. You are now one step closer to experiencing the future of social gaming.</p>
        
        <h3 style="color: #c026d3;">What now?</h3>
        <p>We are rolling out access in batches to ensure the best experience for everyone. Keep an eye on your inbox—we’ll let you know as soon as your spot opens up!</p>
        
        <p>In the meantime, get ready for:</p>
        <ul>
            <li>Seamless video rooms</li>
            <li>Interactive social games</li>
            <li>A community built for connection</li>
        </ul>
        
        <p>We can't wait to see you inside.</p>
        <br>
        <p>Best,</p>
        <p><strong>The Kridavista Team</strong></p>
      </div>
       <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} Kridavista. All rights reserved.
      </div>
    </div>
  `;
}

function generateAdminEmail(ticketId: string, formData: any) {
    return `
    <h2>New Submission Received</h2>
    <ul>
      <li><strong>ID:</strong> ${ticketId}</li>
      <li><strong>Type:</strong> ${formData.type}</li>
      <li><strong>Name:</strong> ${formData.name}</li>
      <li><strong>Email:</strong> ${formData.email}</li>
      <li><strong>Phone:</strong> ${formData.phone || 'N/A'}</li>
      <li><strong>Date:</strong> ${new Date().toISOString()}</li>
    </ul>
    <h3>Message:</h3>
    <p>${formData.message}</p>
  `;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract fields
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const type = formData.get('type') as string;
        const message = formData.get('message') as string;
        const attachment = formData.get('attachment') as File | null;

        // Default message for waitlist/newsletter if not provided
        let finalMessage = message;
        if (!finalMessage && (type === 'waitlist' || type === 'newsletter')) {
            finalMessage = `User joined via ${type} popup.`;
        }

        // Validation
        if (!name || !email || !type || !finalMessage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate Internal ID (Submitted ID)
        const submissionId = uuidv4();

        // Prepare Attachment for Email if exists (Only for support typically, but handled generically)
        const attachments = [];
        if (attachment && attachment.size > 0) {
            const buffer = Buffer.from(await attachment.arrayBuffer());
            attachments.push({
                filename: attachment.name,
                content: buffer,
            });
        }

        // Save to JSON (Simulated Database)
        const submission = {
            id: submissionId,
            name,
            email,
            phone,
            type,
            message: finalMessage,
            createdAt: new Date().toISOString(),
            hasAttachment: !!attachment && attachment.size > 0,
            status: type === 'waitlist' ? 'Waitlist Member' : type === 'newsletter' ? 'Newsletter Subscriber' : 'New Ticket'
        };

        let existingData = [];
        if (fs.existsSync(SUBMISSIONS_FILE)) {
            const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
            try {
                existingData = JSON.parse(fileContent);
            } catch (e) {
                existingData = [];
            }
        }
        existingData.push(submission);
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(existingData, null, 2));

        // Handle Emails based on Type
        if (type === 'waitlist') {
            await sendEmail({
                to: email,
                subject: `You’re on the Kridavista Waitlist`,
                html: generateWaitlistEmail(name),
            });
            // No Admin Email for Waitlist (as per new requirements implicitly focusing on user exp, but saving to DB is done)
        }
        else if (type === 'newsletter') {
            await sendEmail({
                to: email,
                subject: `Welcome to Kridavista Newsletter`,
                html: generateNewsletterEmail(name),
            });
            // No Admin Email for Newsletter
        }
        else {
            // SUPPORT or Default
            // Send Admin Email (Support Tickets needs admin attention)
            const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@kridavista.in';
            await sendEmail({
                to: adminEmail,
                subject: `[SUPPORT] New Ticket - ${submissionId}`,
                html: generateAdminEmail(submissionId, submission),
                attachments: attachments,
            });

            // Send User Email (Ticket Confirmation)
            await sendEmail({
                to: email,
                subject: `Support Ticket Created #${submissionId}`,
                html: generateSupportEmail(submissionId, name),
            });
        }

        // Response Logic
        if (type === 'waitlist' || type === 'newsletter') {
            return NextResponse.json({
                message: 'Successfully subscribed!',
                // No ticketId for these actions
            }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'Your request has been submitted successfully.',
                ticketId: submissionId
            }, { status: 200 });
        }

    } catch (error: any) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
    }
}
