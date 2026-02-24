import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const headers = new Headers(req.headers);
        headers.delete('host');
        headers.delete('origin');
        headers.delete('referer');

        if (!headers.has('x-api-key') && process.env.ANTHROPIC_API_KEY) {
            headers.set('x-api-key', process.env.ANTHROPIC_API_KEY);
        }

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!anthropicRes.ok) {
            const err = await anthropicRes.text();
            return new NextResponse(err, { status: anthropicRes.status });
        }

        return new NextResponse(anthropicRes.body, {
            status: 200,
            headers: {
                'Content-Type': anthropicRes.headers.get('Content-Type') || 'text/event-stream',
            },
        });
    } catch (error) {
        console.error('Anthropic API Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
