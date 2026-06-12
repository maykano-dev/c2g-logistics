'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateLinkOrder, cancelLinkOrder } from '../../actions';
import { Plane, Ship, Image as ImageIcon, Loader2, Link as LinkIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';

const initialState: any = {
  error: null,
  success: false,
  redirectUrl: null
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
    </button>
  );
}

export function EditLinkOrderForm({ order }: { order: any }) {
  const updateOrderWithId = updateLinkOrder.bind(null, order.id);
  const [state, formAction] = useFormState(updateOrderWithId, initialState);

  if (state?.redirectUrl) {
    window.location.href = state.redirectUrl;
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    const res = await cancelLinkOrder(order.id);
    if (res.error) {
      alert(res.error);
    } else {
      window.location.href = res.redirectUrl!;
    }
  };

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm font-medium rounded-xl border border-destructive/20 text-center animate-shake">
          {state.error}
        </div>
      )}

      {/* Product Summary (Read-only) */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary" /> Product Details
        </h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-secondary/50 rounded-xl border border-border overflow-hidden shrink-0 flex items-center justify-center">
            {order.screenshot_url ? (
              <img src={order.screenshot_url} alt="Screenshot" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold">{order.product_name || 'Link Order Product'}</p>
            <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">{order.product_link}</p>
            <p className="text-sm font-bold text-primary mt-2">Unit Price: ¥{order.cny_price}</p>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="glass-panel p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Quantity</label>
          <div className="relative">
            <input 
              type="number" 
              name="quantity" 
              min="1" 
              defaultValue={order.quantity}
              required 
              className="w-full h-12 bg-background/50 border border-input rounded-xl px-4 pl-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="1"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold">
              ×
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Shipping Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative cursor-pointer group">
              <input type="radio" name="shipping" value="air" defaultChecked={order.shipping_mode === 'air'} className="peer sr-only" />
              <div className="h-24 rounded-xl border-2 border-input bg-background/50 peer-checked:border-blue-500 peer-checked:bg-blue-500/5 flex flex-col items-center justify-center gap-2 transition-all group-hover:border-blue-500/50">
                <Plane className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-sm">Air Express</span>
              </div>
            </label>
            <label className="relative cursor-pointer group">
              <input type="radio" name="shipping" value="sea" defaultChecked={order.shipping_mode === 'sea'} className="peer sr-only" />
              <div className="h-24 rounded-xl border-2 border-input bg-background/50 peer-checked:border-green-500 peer-checked:bg-green-500/5 flex flex-col items-center justify-center gap-2 transition-all group-hover:border-green-500/50">
                <Ship className="w-6 h-6 text-green-500" />
                <span className="font-bold text-sm">Sea Freight</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Additional Notes</label>
          <textarea 
            name="notes"
            rows={3}
            defaultValue={order.notes || ''}
            className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            placeholder="Color, size, or specific instructions for the buyer..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SubmitButton />
        <button 
          type="button" 
          onClick={handleCancel}
          className="w-full h-12 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Cancel Order
        </button>
        <Link 
          href={`/dashboard/link-orders/${order.id}`}
          className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-xl transition-all flex items-center justify-center"
        >
          Go Back
        </Link>
      </div>
    </form>
  );
}
