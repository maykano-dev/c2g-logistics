import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().regex(/^(\+233|0)[0-9]{9}$/, 'Invalid Ghana phone number').optional().or(z.literal('')),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const SHIPPING_MODES = z.union([z.literal('air'), z.literal('sea'), z.literal('express')]);

export const CreateLinkOrderSchema = z.object({
  items_json: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }, 'Invalid items format'),
  shipping_mode: SHIPPING_MODES,
});

export const UpdateLinkOrderSchema = z.object({
  quantity: z.number().int().positive().max(999),
  notes: z.string().max(500).optional(),
  shipping_mode: SHIPPING_MODES,
});

export const RegisterPackagesSchema = z.object({
  tracking_numbers: z.array(z.string().min(3)).min(1, 'At least one tracking number is required'),
  store_name: z.string().min(1, 'Store name is required').max(200),
  description: z.string().min(1, 'Description is required').max(500),
  shipping_mode: SHIPPING_MODES,
});

export const UpdateProfileSchema = z.object({
  name: z.string().max(100).min(1, "Name cannot be empty"),
  phone: z.string().optional(),
  telegram_chat_id: z.string().max(50).optional(),
  telegram_notifications_enabled: z.boolean().optional(),
});

export const ImporterRegistrationSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  storeSlug: z.string().regex(/^[a-z0-9-]+$/, 'Store URL can only contain lowercase letters, numbers, and hyphens'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  email: z.string().email('Invalid email address'),
  ghanaCard: z.string().min(1, 'Ghana Card is required'),
  businessDescription: z.string().optional(),
  password: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
});

export const AddProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  sourcePlatform: z.string().optional(),
  sourceUrl: z.string().optional(),
  costPriceCny: z.number().positive(),
  sellingPriceGhs: z.number().positive(),
  category: z.string().max(100).optional(),
});

export const CheckoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional().nullable(),
    quantity: z.number().int().positive(),
    priceGhs: z.number().optional(),
    priceCny: z.number().optional(),
    imageUrl: z.string().optional(),
    combination: z.any().optional(),
  })).min(1),
  shippingName: z.string().min(1),
  shippingPhone: z.string().min(1),
  shippingAddress: z.string().min(1),
  shippingNotes: z.string().optional(),
  shippingMethod: z.string().optional(),
  paymentGateway: z.string().optional(),
  reference: z.string().optional(),
  subtotal: z.number().optional(),
  shippingCost: z.number().optional(),
  serviceFee: z.number().optional(),
  exchangeRate: z.number().optional(),
});

const STATUSES = z.union([
  z.literal('pending'),
  z.literal('processing'),
  z.literal('purchased'),
  z.literal('arrived_warehouse'),
  z.literal('shipped'),
  z.literal('delivered'),
  z.literal('cancelled'),
  z.literal('on_hold')
]);

export const EmployeeActionSchema = z.object({
  status: STATUSES.optional(),
  trackingNumber: z.string().regex(/^[a-zA-Z0-9\-_]+$/).max(50).optional(),
  note: z.string().max(2000).optional(),
});
