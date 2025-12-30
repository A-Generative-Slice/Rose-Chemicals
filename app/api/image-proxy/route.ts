// Image proxy API route for local uploads
import { NextRequest, NextResponse } from 'next/server';

// This route uses `request.url` (dynamic request data) so it must be treated as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath) {
      return new NextResponse('Missing image path', { status: 400 });
    }

    // Fetch image from backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
    const imageUrl = `${backendUrl}/uploads/${imagePath}`;
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}