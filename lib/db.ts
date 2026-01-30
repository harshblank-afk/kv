import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.txt');

export async function logToDatabase(type: string, data: unknown) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${type.toUpperCase()}] ${JSON.stringify(data)}\n`;

    try {
        // In Vercel Serverless environment, we can't rely on persistent file writes.
        // But for "dev" or logging purposes locally, this works.
        // We use appendFile to add to the log.
        await fs.promises.appendFile(DB_FILE, entry, 'utf8');
        console.log(`Logged to database: ${type}`);
    } catch (error) {
        console.error('Database log error:', error);
        // On Vercel (read-only filesystem in some paths), this might fail if not in /tmp
        // We fail gracefully to not block the user flow.
    }
}
