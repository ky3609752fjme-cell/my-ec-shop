'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface Variant {
  id: number;
  name: string;
  retail_price: string;
  currency: string;
  size: string;
  color: string;
  variant_id: number;
}

interface ProductData {
  sync_product: {
    id: number;
    name: string;
    thumbnail_url: string;
  };
  sync_variants: Variant[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.result) {
          setProductData(data.result);
        }
      } catch (err) {
        console.error('詳細情報の取得に失敗しました', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleBuy = async () => {
    if (!productData) return;
    setCheckoutLoading(true);

    const mainVariant = productData.sync_variants[0];

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.sync_product.name,
          price: mainVariant.retail_price,
          variantId: mainVariant.variant_id || mainVariant.id,
          image: productData.sync_product.thumbnail_url,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('決済セッションの作成に失敗しました: ' + (data.error || '不明なエラー'));
      }
    } catch (err) {
      console.error(err);
      alert('決済処理中にエラーが発生しました。');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>商品詳細を読み込んでいます...</div>;
  }

  if (!productData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>商品が見つかりませんでした。</div>;
  }

  const { sync_product, sync_variants } = productData;
  const mainVariant = sync_variants[0];

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← トップページに戻る
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        <img
          src={sync_product.thumbnail_url}
          alt={sync_product.name}
          style={{ width: '100%', borderRadius: '12px', border: '1px solid #e5e7eb' }}
        />
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>{sync_product.name}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            ¥{Number(mainVariant?.retail_price || 0).toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280' }}>({mainVariant?.currency})</span>
          </p>
          
          <button
            disabled={checkoutLoading}
            onClick={handleBuy}
            style={{
              width: '100%',
              backgroundColor: checkoutLoading ? '#9ca3af' : '#2563eb',
              color: '#fff',
              padding: '0.8rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: checkoutLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {checkoutLoading ? '決済画面へ移動中...' : '購入手続きへ進む'}
          </button>
        </div>
      </div>
    </main>
  );
}