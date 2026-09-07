import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ご購入ありがとうございます！</h1>
        <p className="text-gray-600 mb-6">決済が正常に完了しました。</p>
        <Link
          href="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ショップに戻る
        </Link>
      </div>
    </main>
  );
}