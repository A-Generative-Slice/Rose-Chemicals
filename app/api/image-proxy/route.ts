// Image proxy API route — handles both S3 and local uploads
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return new NextResponse('Missing image path', { status: 400 });
    }

    let imageUrl: string;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // Full URL (S3 or external) — fetch directly
      imageUrl = imagePath;
    } else {
      // Local filename — fetch from backend's /uploads/ folder
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      imageUrl = `${backendUrl}/uploads/${imagePath}`;
    }

    const response = await fetch(imageUrl, {
      headers: {
        // Forward basic headers, avoid CORS issues with S3
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`Image proxy: ${response.status} for ${imageUrl}`);
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