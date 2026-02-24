import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  try {
    let imageUrl: string;
    // Use NEXT_PUBLIC_API_URL (baked at build time) or BACKEND_URL (runtime) or fallback
    // IMPORTANT: Use 127.0.0.1 instead of localhost because the backend binds on IPv4 only
    // and Node.js fetch resolves localhost to IPv6 ::1 which causes ECONNREFUSED
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api')
      .replace('localhost', '127.0.0.1');
    const backendBase = apiUrl.replace('/api', '');

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // For S3 URLs, extract the key and proxy through the backend
      if (imagePath.includes('.s3.') && imagePath.includes('amazonaws.com')) {
        try {
          const urlObj = new URL(imagePath);
          const key = decodeURIComponent(urlObj.pathname.substring(1)); // Remove leading /
          imageUrl = `${backendBase}/api/image/proxy?key=${encodeURIComponent(key)}`;
        } catch (urlError) {
          // If URL parsing fails, try passing the full path
          console.error('URL parse error, trying direct fetch:', urlError);
          imageUrl = imagePath;
        }
      } else {
        // Other external URLs - fetch directly
        imageUrl = imagePath;
      }
    } else {
      // Local file path - proxy through backend
      const cleanPath = imagePath.startsWith('/uploads/')
        ? imagePath.substring('/uploads/'.length)
        : imagePath;
      imageUrl = `${backendBase}/uploads/${cleanPath}`;
    }

    console.log('[image-proxy] Fetching:', imageUrl);

    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`[image-proxy] Failed: ${imageUrl} => ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
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
  } catch (error) {
    console.error('[image-proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}