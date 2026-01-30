import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fs.existsSync(APPLICATIONS_FILE)) {
        return NextResponse.json({ applications: [] });
    }

    const fileContent = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    try {
        const applications = JSON.parse(fileContent);
        // Sort by date desc
        applications.sort((a: { submittedAt: string }, b: { submittedAt: string }) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        return NextResponse.json({ applications });
    } catch (e) {
        return NextResponse.json({ applications: [] });
    }
}
