'use client';

import { useState } from 'react';
import ProductCard from '../components/ProductCard'; // ★作った部品を読み込む

const products = [
  { id: 1, name: '美濃焼 抹茶茶碗', priceJpy: 5000 },
  { id: 2, name: '南部鉄器 急須', priceJpy: 12000 },
  { id: 3, name: '西陣織 ポーチ', priceJpy: 3500 },
  { id: 4, name: '江戸切子 グラス', priceJpy: 8800 },
];

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const exchangeRate = 155;

  const addToCart = (productName: string) => {
    setCartCount(cartCount + 1);
    alert(`「${productName}」をカートに追加しました！`);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Japan Craft Shop</h1>
        <div className="text-lg font-medium">
          🛒 カート: <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold ml-1">{cartCount}</span> 個
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            priceJpy={product.priceJpy}
            exchangeRate={exchangeRate}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </main>
  );
}