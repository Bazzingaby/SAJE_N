import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const headers = new Headers(req.headers);
        headers.delete('host');
        headers.delete('origin');
        headers.delete('referer');

        const apiKey = headers.get('Authorization')?.replace('Bearer ', '') || process.env.GROQ_API_KEY;

        if (!apiKey) {
            return new NextResponse('Unauthorized: Missing Groq API Key', { status: 401 });
        }

        headers.set('Authorization', `Bearer ${apiKey}`);
        headers.delete('x-api-key');

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.text();
            return new NextResponse(err, { status: res.status });
        }

        return new NextResponse(res.body, {
            status: 200,
            headers: {
                'Content-Type': res.headers.get('Content-Type') || 'text/event-stream',
            },
        });
    } catch (error) {
        console.error('Groq API Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
