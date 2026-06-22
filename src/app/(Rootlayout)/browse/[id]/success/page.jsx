import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { postTransaction } from '@/lib/action/postTransaction'
import Link from 'next/link'

export default async function PaymentSuccess({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) redirect('/')

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  const { status, metadata, customer_details } = session
  const customerEmail = customer_details?.email

  if (status === 'open') redirect('/')

  if (status === 'complete') {

    const transactionId = session.payment_intent?.id ?? session.payment_intent

    await postTransaction({
      sessionId: session_id,
      transactionId: transactionId,
      bookId: metadata.bookId,
      bookTitle: metadata.bookTitle,
      deliveryFee: Number(metadata.deliveryFee),
      userId: metadata.userId,
      userEmail: metadata.userEmail,
      // delivery address
      name: metadata.name,
      phone: metadata.phone,
      street: metadata.street,
      city: metadata.city,
      postal: metadata.postal,

      deliveryStatus: 'pending',
      paidAt: new Date().toISOString(),
    })


    return (
      <main className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4 pb-16 md:pt-30 pt-20">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">

            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#fc4a32] to-[#fad4de]" />

            <div className="px-8 py-10 flex flex-col items-center text-center gap-6">

              {/* Success icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Ping animation */}
                <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
              </div>

              {/* Heading */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#fc4a32] mb-2">
                  Payment successful
                </p>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  Your delivery is booked!
                </h1>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  A confirmation has been sent to{' '}
                  <span className="font-semibold text-slate-700">{customerEmail}</span>.
                  A librarian will dispatch your book shortly.
                </p>
              </div>

              {/* Book summary card */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-3">

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order summary</p>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-500">Book</span>
                  <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%] truncate">
                    {metadata.bookTitle}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-500">Delivery fee</span>
                  <span className="text-sm font-bold text-[#fc4a32]">
                    ${Number(metadata.deliveryFee).toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Delivering to</p>
                  <p className="text-sm font-semibold text-slate-800">{metadata.name}</p>
                  <p className="text-sm text-slate-500">{metadata.phone}</p>
                  <p className="text-sm text-slate-500">
                    {metadata.street}, {metadata.city} — {metadata.postal}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-semibold text-amber-600">
                    Delivery status: Pending dispatch
                  </span>
                </div>

              </div>

              {/* Session ID for reference */}
              <p className="text-[12px] text-slate-800 font-mono break-all">
                <span className='font-bold'>TransactionID:</span> {transactionId}
              </p>

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <Link
                  href="/browse"
                  className="w-full h-12 rounded-2xl bg-[#fc4a32] hover:bg-[#e03e28] text-white font-bold text-sm flex items-center justify-center transition-colors shadow-[0_4px_16px_rgba(252,74,50,0.3)]"
                >
                  Browse more books
                </Link>
                <Link
                  href="/"
                  className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors"
                >
                  Go to home
                </Link>
              </div>

            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-6">
            Questions? Email us at{' '}
            <a href="mailto:support@bibliodropp.com" className="underline underline-offset-2 hover:text-slate-600">
              support@BookHub.com
            </a>
          </p>

        </div>
      </main>
    )
  }
}