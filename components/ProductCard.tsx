'use client';

import React, { useState } from 'react';

type ProductCardProps = {
  name: string;
  priceJpy: number;
  exchangeRate: number;
  onAddToCart: (name: string) => void;
};

export default function ProductCard({
  name,
  priceJpy,
  exchangeRate,
  onAddToCart,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const priceUsd = (priceJpy / exchangeRate).toFixed(2);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: name, priceJpy }),
      });

      const data = await response.json();

      if (data.url) {
        // Stripeの公式決済ページへ飛ばす
        window.location.href = data.url;
      } else {
        alert(`エラー: ${data.error || '決済ページの作成に失敗しました'}`);
      }
    } catch (error) {
      alert('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-2xl font-extrabold text-gray-900">{priceJpy.toLocaleString()} 円</p>
        <p className="text-sm text-orange-600 font-bold mb-6">${priceUsd} USD</p>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onAddToCart(name)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition text-sm"
        >
          🛒 カートに追加
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition text-sm disabled:opacity-50"
        >
          {loading ? '決済ページへ移動中...' : '💳 今すぐ購入 (Stripe)'}
        </button>
      </div>
    </div>
  );
}