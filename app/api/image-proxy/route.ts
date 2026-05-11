import { NextRequest, NextResponse } from 'next/server';

// Resolve the backend base URL:
// - On VPS/production: 127.0.0.1:5001 (nginx proxies, local backend runs)
// - In local dev without backend: fall back to the production API URL so images still load
function getBackendBase(): string {
  // If a server-side backend URL is explicitly set, use it
  if (process.env.BACKEND_INTERNAL_URL) {
    return process.env.BACKEND_INTERNAL_URL;
  }
  // In production VPS environment
  if (process.env.NODE_ENV === 'production') {
    return 'http://127.0.0.1:5001';
  }
  // Local dev: use the public API URL (rosechemicals.in) so images resolve from live backend
  const publicApi = process.env.NEXT_PUBLIC_API_URL || '';
  if (publicApi) {
    // Strip the /api suffix to get the backend root
    return publicApi.replace(/\/api\/?$/, '');
  }
  // Last resort fallback
  return 'http://127.0.0.1:5001';
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
      // S3 URL — extract key and proxy through backend
      if (imagePath.includes('.s3.') && imagePath.includes('amazonaws.com')) {
        try {
          const urlObj = new URL(imagePath);
          const key = decodeURIComponent(urlObj.pathname.substring(1));
          imageUrl = `${backendBase}/api/image/proxy?key=${encodeURIComponent(key)}`;
        } catch {
          imageUrl = imagePath;
        }
      } else {
        // Other full URLs — fetch directly
        imageUrl = imagePath;
      }
    } else if (imagePath.startsWith('/')) {
      // Relative paths like /uploads/... or /images/...
      imageUrl = `${backendBase}${imagePath}`;
    } else {
      // Bare filename — assume it lives in /uploads/
      imageUrl = `${backendBase}/uploads/${imagePath}`;
    }

    console.log('[image-proxy] Fetching:', imageUrl);

    const response = await fetch(imageUrl, {
      headers: { 'Accept': 'image/*' },
      // 8-second timeout so we don't hang forever if backend is down
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