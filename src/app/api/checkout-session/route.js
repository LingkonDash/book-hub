import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });
    const user = userSession?.user;

    const formData = await request.formData();

    const bookId      = formData.get('bookId');
    const bookTitle   = formData.get('bookTitle');
    const deliveryFee = formData.get('deliveryFee');
    const name        = formData.get('name');
    const phone       = formData.get('phone');
    const street      = formData.get('street');
    const city        = formData.get('city');
    const postal      = formData.get('postal');

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(deliveryFee) * 100),
            product_data: {
              name: `Delivery — ${bookTitle}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookId,
        bookTitle,
        deliveryFee: Number(deliveryFee),
        userId:      user.id,
        userEmail:   user.email,
        // address fields — so your success page can save the full delivery doc
        name,
        phone,
        street,
        city,
        postal,
      },
      mode: "payment",
      success_url: `${origin}/browse/${bookId}/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.redirect(session.url, 303);

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}