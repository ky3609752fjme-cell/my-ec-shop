import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.PRINTFUL_API_TOKEN;

  // トークンが設定されていない場合のエラーハンドリング
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'PRINTFUL_API_TOKEN が設定されていません。' },
      { status: 500 }
    );
  }

  try {
    // Printful API へショップ情報をリクエスト
    const response = await fetch('https://api.printful.com/stores', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: data,
        },
        { status: response.status }
      );
    }

    // 通信成功時のレスポンス
    return NextResponse.json({
      success: true,
      message: 'Printful API との自動連携テストに成功しました！',
      storeInfo: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
