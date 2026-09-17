import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const token = process.env.PRINTFUL_API_KEY || process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'PRINTFUL_API_KEY が設定されていません。' },
      { status: 500 }
    );
  }

  const resolvedParams = await params;
  const productId = resolvedParams.id;

  try {
    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || '商品詳細の取得に失敗しました。' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}