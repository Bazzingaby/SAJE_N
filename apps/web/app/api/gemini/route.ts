import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const headers = new Headers(req.headers);
        headers.delete('host');
        headers.delete('origin');
        headers.delete('referer');

        // Remove any user-submitted x-api-key if we want to enforce Bearer token rules here,
        // though the OpenAI-compatible endpoint uses `Authorization: Bearer`
        const apiKey = headers.get('Authorization')?.replace('Bearer ', '') || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new NextResponse('Unauthorized: Missing API Key', { status: 401 });
        }

        // Set standard Bearer header
        headers.set('Authorization', `Bearer ${apiKey}`);

        // If x-api-key exists from the client, we remove it to prevent conflicts
        headers.delete('x-api-key');

        const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!geminiRes.ok) {
            const err = await geminiRes.text();
            return new NextResponse(err, { status: geminiRes.status });
        }

        return new NextResponse(geminiRes.body, {
            status: 200,
            headers: {
                'Content-Type': geminiRes.headers.get('Content-Type') || 'text/event-stream',
            },
        });
    } catch (error) {
        console.error('Gemini API Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
