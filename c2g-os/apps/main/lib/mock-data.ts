export const mockProducts = [
  {
    id: 'mock-prod-1',
    name: 'Wireless Noise Cancelling Headphones PRO',
    price: 450.00,
    price_cny: 280.00,
    stock: 45,
    sales_count: 120,
    view_count: 540,
    demandLabel: 'high',
    category: 'Electronics',
    product_images: [
      { id: 'img1', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  },
  {
    id: 'mock-prod-2',
    name: 'Smart Fitness Watch Series 7',
    price: 320.00,
    price_cny: 200.00,
    stock: 12,
    sales_count: 85,
    view_count: 310,
    demandLabel: 'medium',
    category: 'Electronics',
    product_images: [
      { id: 'img2', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  },
  {
    id: 'mock-prod-3',
    name: 'Minimalist Ceramic Coffee Mug',
    price: 45.00,
    price_cny: 25.00,
    stock: 150,
    sales_count: 420,
    view_count: 890,
    demandLabel: 'high',
    category: 'Home & Living',
    product_images: [
      { id: 'img3', image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop', is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  },
  {
    id: 'mock-prod-4',
    name: 'Mechanical Gaming Keyboard RGB',
    price: 280.00,
    price_cny: 180.00,
    stock: 5,
    sales_count: 45,
    view_count: 220,
    demandLabel: 'low',
    category: 'Electronics',
    product_images: [
      { id: 'img4', image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop', is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  },
  {
    id: 'mock-prod-5',
    name: 'Premium Leather Crossbody Bag',
    price: 550.00,
    price_cny: 350.00,
    stock: 22,
    sales_count: 64,
    view_count: 410,
    demandLabel: 'medium',
    category: 'Fashion',
    product_images: [
      { id: 'img5', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop', is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  },
  {
    id: 'mock-prod-6',
    name: 'Ultra-thin Power Bank 10000mAh',
    price: 120.00,
    price_cny: 75.00,
    stock: 0,
    sales_count: 210,
    view_count: 650,
    demandLabel: 'high',
    category: 'Electronics',
    product_images: [
      { id: 'img6', image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1000&auto=format&fit=crop', is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  },
  ...Array.from({ length: 30 }).map((_, i) => ({
    id: `mock-prod-${7 + i}`,
    name: `Premium Quality Product ${i + 7}`,
    price: 150.00 + (i * 20),
    price_cny: 90.00 + (i * 10),
    stock: 20 + i,
    sales_count: 10 + (i * 5),
    view_count: 100 + (i * 50),
    demandLabel: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
    category: i % 3 === 0 ? 'Home & Living' : i % 2 === 0 ? 'Fashion' : 'Electronics',
    product_images: [
      { id: `img${7 + i}`, image_url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&sig=${i}`, is_primary: true, media_type: 'image' }
    ],
    status: 'published'
  }))
];

export const mockOrders = [
  {
    id: 'ORD-2026-9843',
    customer_name: 'Kwame Mensah',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    amount_ghs: 450.00,
    status: 'pending',
    items: [mockProducts[0]]
  },
  {
    id: 'ORD-2026-9842',
    customer_name: 'Ama Osei',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    amount_ghs: 365.00,
    status: 'processing',
    items: [mockProducts[1], mockProducts[2]]
  },
  {
    id: 'ORD-2026-9841',
    customer_name: 'John Doe',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    amount_ghs: 280.00,
    status: 'shipped',
    items: [mockProducts[3]]
  },
  {
    id: 'ORD-2026-9840',
    customer_name: 'Grace Appiah',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    amount_ghs: 1100.00,
    status: 'delivered',
    items: [mockProducts[4], mockProducts[4]]
  },
  {
    id: 'ORD-2026-9839',
    customer_name: 'Peter Yeboah',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    amount_ghs: 120.00,
    status: 'delivered',
    items: [mockProducts[5]]
  }
];

export const mockTransactions = [
  {
    id: 'TXN-101',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'earning',
    description: 'Earnings from Order ORD-2026-9840',
    amount: 1100.00,
    status: 'completed'
  },
  {
    id: 'TXN-102',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'withdrawal',
    description: 'Withdrawal to Mobile Money (MTN: *****4567)',
    amount: -500.00,
    status: 'completed'
  },
  {
    id: 'TXN-103',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'earning',
    description: 'Earnings from Order ORD-2026-9839',
    amount: 120.00,
    status: 'completed'
  },
  {
    id: 'TXN-104',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'pending_clearance',
    description: 'Pending clearance for Order ORD-2026-9841',
    amount: 280.00,
    status: 'pending'
  }
];

export const mockStats = {
  wallet_balance: 720.00,
  pending_clearance: 1095.00, // 450 + 365 + 280
  total_earned: 1220.00,
  active_products: mockProducts.length,
  total_orders: mockOrders.length,
  conversion_rate: '4.2%'
};

export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'New Order Received!',
    message: 'Grace Appiah just placed an order for ₵1100.00.',
    type: 'order',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: 'notif-2',
    title: 'Withdrawal Successful',
    message: 'Your withdrawal of ₵500.00 to Mobile Money has been processed.',
    type: 'wallet',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-3',
    title: 'Low Stock Alert',
    message: 'Mechanical Gaming Keyboard RGB is running low on stock (5 items left).',
    type: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'notif-4',
    title: 'Product Published',
    message: 'Your product "Ultra-thin Power Bank 10000mAh" is now live on your storefront.',
    type: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  }
];
