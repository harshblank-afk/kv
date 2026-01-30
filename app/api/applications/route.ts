import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function generateConfirmationEmail(ticketId: string, name: string, roleTitle: string) {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #c026d3; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Kridavista Careers</h1>
      </div>
      <div style="padding: 30px;">
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>Thank you for applying to Kridavista for the position of <strong>${roleTitle}</strong>.</p>
        
        <p>We have successfully received your application and our team is currently reviewing your profile. We appreciate the time and effort you took to share your credentials with us.</p>
        
        <p>You can expect to hear back from us within <strong>approximately one week</strong> regarding the next steps.</p>
        
        <p>Your Application ID is <strong>${ticketId}</strong>.</p>
        
        <p style="font-size: 13px; color: #666;"><em>Note: Please avoid submitting multiple applications for the same role, as this may delay our review process.</em></p>
        
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

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract base fields
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const roleSlug = formData.get('roleSlug') as string;
        const roleTitle = formData.get('roleTitle') as string;
        const resume = formData.get('resume') as File;

        if (!name || !email || !roleSlug || !resume) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate Ticket ID
        const ticketId = uuidv4();

        // Save Resume Securely
        const resumeBuffer = Buffer.from(await resume.arrayBuffer());
        const resumeFilename = `${ticketId}-${roleSlug}-${name.replace(/\s+/g, '_')}.pdf`;
        const resumePath = path.join(UPLOADS_DIR, resumeFilename);
        fs.writeFileSync(resumePath, resumeBuffer);

        // Save Application Metadata
        const application = {
            id: ticketId,
            name,
            email,
            phone,
            roleSlug,
            roleTitle,
            resume: resumeFilename,
            submittedAt: new Date().toISOString(),
            fields: Object.fromEntries(formData.entries()), // Capture all fields including dynamic ones
        };

        let existingData = [];
        if (fs.existsSync(APPLICATIONS_FILE)) {
            const fileContent = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
            try {
                existingData = JSON.parse(fileContent);
            } catch (e) {
                existingData = [];
            }
        }
        existingData.push(application);
        fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(existingData, null, 2));

        // Send User Email
        const userEmailResult = await sendEmail({
            to: email,
            subject: `Thank You for Applying to Kridavista – ${roleTitle}`,
            html: generateConfirmationEmail(ticketId, name, roleTitle),
        });

        // Send Admin Email
        const adminEmail = process.env.ADMIN_EMAIL || 'support@kridavista.in';

        // Construct Detailed HTML
        const fields = Object.fromEntries(formData.entries());
        let answersHtml = '';

        // Filter out base fields to show only dynamic Q&A
        const baseFields = ['name', 'email', 'phone', 'roleSlug', 'roleTitle', 'resume'];
        for (const [key, value] of Object.entries(fields)) {
            if (!baseFields.includes(key) && typeof value === 'string') {
                // Format key to be more readable (e.g., 'why_join' -> 'Why Join')
                const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                answersHtml += `
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 0; font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">${readableKey}</p>
                        <p style="margin: 5px 0 0 0; color: #333; white-space: pre-wrap;">${value}</p>
                    </div>
                 `;
            }
        }

        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
                <div style="background: #f4f4f4; padding: 20px; border-bottom: 1px solid #eee;">
                    <h2 style="margin: 0; color: #333;">New Career Application</h2>
                    <p style="margin: 5px 0 0 0; color: #666;">${roleTitle}</p>
                </div>
                
                <div style="padding: 20px;">
                    <h3 style="color: #c026d3; border-bottom: 2px solid #c026d3; padding-bottom: 5px; margin-top: 0;">Candidate Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; width: 30%;">Name:</td>
                            <td style="padding: 8px 0; font-weight: bold;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Email:</td>
                            <td style="padding: 8px 0; font-weight: bold;"><a href="mailto:${email}" style="color: #c026d3; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Phone:</td>
                            <td style="padding: 8px 0;">${phone || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Ticket ID:</td>
                            <td style="padding: 8px 0; font-family: monospace;">${ticketId}</td>
                        </tr>
                         <tr>
                            <td style="padding: 8px 0; color: #666;">Submitted:</td>
                            <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
                        </tr>
                    </table>

                    <h3 style="color: #c026d3; border-bottom: 2px solid #c026d3; padding-bottom: 5px; margin-top: 30px;">Application Responses</h3>
                    ${answersHtml}
                    
                    <div style="margin-top: 30px; background: #fff4fc; padding: 15px; border-radius: 5px; border: 1px solid #ffe6f9;">
                         <p style="margin: 0; color: #c026d3; font-weight: bold;"> Resume attached as PDF.</p>
                    </div>
                </div>
            </div>
        `;

        const adminEmailResult = await sendEmail({
            to: adminEmail,
            subject: `New Career Application - ${roleTitle} (${name})`,
            html: adminEmailHtml,
            attachments: [{
                filename: resume.name,
                content: resumeBuffer,
            }]
        });

        if (!userEmailResult.success) {
            console.error('Failed to send confirmation email', userEmailResult.error);
        }
        if (!adminEmailResult.success) {
            console.error('Failed to send admin notification', adminEmailResult.error);
        }

        return NextResponse.json({
            message: 'Application submitted successfully!',
            ticketId: ticketId
        }, { status: 200 });

    } catch (error: any) {
        console.error('Application Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
