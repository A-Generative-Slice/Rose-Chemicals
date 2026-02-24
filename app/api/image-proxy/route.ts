import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  try {
    let imageUrl: string;
    // For server-side requests, ALWAYS use internal IP to avoid nginx loop
    const backendBase = 'http://127.0.0.1:5001';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // For S3 URLs, extract the key and proxy through the backend
      if (imagePath.includes('.s3.') && imagePath.includes('amazonaws.com')) {
        try {
          const urlObj = new URL(imagePath);
          const key = decodeURIComponent(urlObj.pathname.substring(1)); // Remove leading /
          imageUrl = `${backendBase}/api/image/proxy?key=${encodeURIComponent(key)}`;
        } catch (urlError) {
          console.error('URL parse error, trying direct fetch:', urlError);
          imageUrl = imagePath;
        }
      } else {
        // Other external URLs - fetch directly
        imageUrl = imagePath;
      }
    } else if (imagePath.startsWith('/')) {
      // Handles paths like /uploads/filename.png or /images/CATALOG IMAGES/filename.png
      // Prepend the backend base URL
      imageUrl = `${backendBase}${imagePath}`;
    } else {
      // Bare filename - assume it's in /uploads/
      imageUrl = `${backendBase}/uploads/${imagePath}`;
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