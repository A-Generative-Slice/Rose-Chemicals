import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  try {
    let imageUrl: string;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // For S3 URLs, extract the key and proxy through the backend
      // S3 URLs look like: https://bucket.s3.region.amazonaws.com/products/filename.png
      if (imagePath.includes('.s3.') && imagePath.includes('amazonaws.com')) {
        // Extract the S3 key from the URL (everything after the bucket path)
        const urlObj = new URL(imagePath);
        const key = decodeURIComponent(urlObj.pathname.substring(1)); // Remove leading /
        imageUrl = `${backendUrl}/api/image/proxy?key=${encodeURIComponent(key)}`;
      } else {
        // Other external URLs - fetch directly
        imageUrl = imagePath;
      }
    } else {
      // Local file path - proxy through backend
      const cleanPath = imagePath.startsWith('/uploads/')
        ? imagePath.substring('/uploads/'.length)
        : imagePath;
      imageUrl = `${backendUrl}/uploads/${cleanPath}`;
    }

    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`Image proxy failed for ${imageUrl}: ${response.status}`);
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
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}