import { NextRequest, NextResponse } from 'next/server';

/**
 * Resolve the backend base URL.
 * - Production VPS: backend runs on port 5000 (not 5001)
 * - Local dev: use NEXT_PUBLIC_API_URL or fallback to localhost:5000
 */
function getBackendBase(): string {
  if (process.env.BACKEND_INTERNAL_URL) {
    return process.env.BACKEND_INTERNAL_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'http://127.0.0.1:5000';
  }
  const publicApi = process.env.NEXT_PUBLIC_API_URL || '';
  if (publicApi) {
    return publicApi.replace(/\/api\/?$/, '');
  }
  return 'http://127.0.0.1:5000';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  try {
    let imageUrl: string;
    const backendBase = getBackendBase();

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // Old S3 URLs — these are broken (bucket AllAccessDisabled).
      // Return 404 so frontend falls back to placeholder cleanly.
      if (imagePath.includes('.amazonaws.com')) {
        console.warn('[image-proxy] S3 URL requested but S3 is disabled:', imagePath);
        return NextResponse.json({ error: 'S3 storage no longer available' }, { status: 404 });
      }
      // Other full HTTP URLs — fetch directly
      imageUrl = imagePath;
    } else if (imagePath.startsWith('/uploads/')) {
      // Local upload path — fetch from backend
      imageUrl = `${backendBase}${imagePath}`;
    } else if (imagePath.startsWith('/images/')) {
      // Static images from public/images/ — fetch from backend (served via /images/ route)
      imageUrl = `${backendBase}${imagePath}`;
    } else if (imagePath.startsWith('/')) {
      // Other relative paths
      imageUrl = `${backendBase}${imagePath}`;
    } else {
      // Bare filename — assume uploads/products/
      imageUrl = `${backendBase}/uploads/products/${imagePath}`;
    }

    console.log('[image-proxy] Fetching:', imageUrl);

    const response = await fetch(imageUrl, {
      headers: { 'Accept': 'image/*' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`[image-proxy] Backend returned ${response.status} for: ${imageUrl}`);
      return NextResponse.json(
        { error: `Image not available (${response.status})` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('[image-proxy] Error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
