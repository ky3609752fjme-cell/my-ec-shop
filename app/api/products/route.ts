import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.PRINTFUL_API_KEY || process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'PRINTFUL_API_KEY が設定されていません。' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}