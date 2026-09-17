'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  thumbnail_url: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.result) {
          setProducts(data.result);
        }
      } catch (err) {
        console.error('商品データの取得に失敗しました', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>商品情報を読み込んでいます...</div>;
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>ショップ商品一覧</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {products.map((product) => (
          <div 
            key={product.id} 
            style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px', 
              padding: '1rem', 
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <img
              src={product.thumbnail_url}
              alt={product.name}
              style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
            />
            <h2 style={{ fontSize: '1.1rem', marginTop: '1rem', fontWeight: '600' }}>{product.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}