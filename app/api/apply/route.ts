import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const role = formData.get('role');
        const resume = formData.get('resume');

        if (!name || !email || !role || !resume) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Mock storage/processing
        console.log('Job application:', {
            name,
            email,
            role,
            resumeName: (resume as File).name,
            date: new Date().toISOString()
        });

        return NextResponse.json(
            { message: 'Application submitted successfully!' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
