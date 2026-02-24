import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const headers = new Headers(req.headers);
        headers.delete('host');
        headers.delete('origin');

        const apiKey = headers.get('Authorization')?.replace('Bearer ', '') || process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return new NextResponse('Unauthorized: Missing OpenRouter API Key', { status: 401 });
        }

        headers.set('Authorization', `Bearer ${apiKey}`);
        headers.delete('x-api-key');

        // Provide default HTTP Referer for OpenRouter compliance if available
        if (!headers.has('HTTP-Referer') && process.env.NEXT_PUBLIC_APP_URL) {
            headers.set('HTTP-Referer', process.env.NEXT_PUBLIC_APP_URL);
        }

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
        console.error('OpenRouter API Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
