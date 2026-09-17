import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 決済成功イベントの処理
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const variantId = session.metadata?.variant_id;
    const shipping = session.shipping_details;

    if (variantId && shipping && shipping.address) {
      try {
        // Printful API へ自動注文を送信
        const printfulRes = await fetch('https://api.printful.com/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: {
              name: shipping.name || 'Customer',
              address1: shipping.address.line1 || '',
              address2: shipping.address.line2 || '',
              city: shipping.address.city || '',
              state_code: shipping.address.state || '',
              country_code: shipping.address.country || 'JP',
              zip: shipping.address.postal_code || '',
            },
            items: [
              {
                variant_id: parseInt(variantId, 10),
                quantity: 1,
              },
            ],
          }),
        });

        const printfulData = await printfulRes.json();
        console.log('--- Printful 自動発注成功 ---', printfulData);
      } catch (error) {
        console.error('--- Printful 自動発注エラー ---', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}