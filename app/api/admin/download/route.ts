import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic to prevent caching of file access
export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    const filename = searchParams.get('filename');

    if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);

    // Return file
    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
            'Content-Type': 'application/pdf', // Assuming PDF
            'Content-Length': stats.size.toString(),
        },
    });
}
