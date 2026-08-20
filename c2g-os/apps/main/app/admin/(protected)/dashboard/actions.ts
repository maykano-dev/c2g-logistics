'use server';

import { createClient } from '@/utils/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  
  try {
    // BATCH 1: Lightweight counts (head: true)
    const [
      { count: newOrdersCount },
      { count: warehouseCount },
      { count: activeShipmentsCount },
      { count: customersCount },
      { count: pendingPaymentsCount },
      { count: ecomOrdersCount },
      { count: totalProductsCount },
      { count: importersCount },
      { count: packagesReceivedCount },
      { count: packagesShippedCount },
      { count: pendingProcurementCount }
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'new'),
      supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('status', 'in_warehouse'),
      supabase.from('shipments').select('*', { count: 'exact', head: true }).in('status', ['in_transit', 'clearing_customs', 'ready_for_pickup']),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'awaiting_payment'),
      supabase.from('ecom_orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }).in('role', ['importer', 'admin']),
      supabase.from('incoming_packages').select('*', { count: 'exact', head: true }).eq('status', 'received'),
      supabase.from('incoming_packages').select('*', { count: 'exact', head: true }).eq('status', 'shipped'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid').eq('order_status', 'pending')
    ]);

    // BATCH 2: Financial Data
    const [
      { data: linkOrders },
      { data: mallOrders },
      { data: shipmentPayments }
    ] = await Promise.all([
      supabase.from('orders').select('total').gte('created_at', firstDayOfMonth).eq('payment_status', 'paid'),
      supabase.from('ecom_orders').select('total_amount, shipping_cost').gte('created_at', firstDayOfMonth).eq('payment_status', 'paid'),
      supabase.from('shipments').select('shipping_cost').gte('created_at', firstDayOfMonth).eq('shipping_fee_paid', true)
    ]);

    const linkOrdersRevenue = (linkOrders || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const mallOrdersRevenue = (mallOrders || []).reduce((sum, o) => sum + parseFloat(o.total_amount || 0) + parseFloat(o.shipping_cost || 0), 0);
    const shipmentPaymentsRevenue = (shipmentPayments || []).reduce((sum, s) => sum + parseFloat(s.shipping_cost || 0), 0);
    const totalRevenue = linkOrdersRevenue + mallOrdersRevenue + shipmentPaymentsRevenue;

    // BATCH 3: Recent Orders & Chart Data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const chartData = [];
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const [
      { data: recentOrders },
      { data: weekLinkOrders },
      { data: weekMallOrders }
    ] = await Promise.all([
      supabase.from('orders').select('id, customer_name, total, order_status, payment_status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('created_at').gte('created_at', weekStart.toISOString()),
      supabase.from('ecom_orders').select('created_at').gte('created_at', weekStart.toISOString())
    ]);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const dayStart = new Date(d.setHours(0, 0, 0, 0)).toISOString();
      const dayEnd = new Date(d.setHours(23, 59, 59, 999)).toISOString();

      let linkCount = 0;
      let mallCount = 0;

      (weekLinkOrders || []).forEach(o => {
        if (o.created_at >= dayStart && o.created_at <= dayEnd) linkCount++;
      });
      (weekMallOrders || []).forEach(o => {
        if (o.created_at >= dayStart && o.created_at <= dayEnd) mallCount++;
      });

      chartData.push({
        name: days[d.getDay()],
        linkOrders: linkCount,
        mallOrders: mallCount
      });
    }

    // BATCH 4: Highly Optimized Low Stock Alerts (Avoids fetching entire products table)
    const [
      { data: lowStockBaseProducts },
      { data: lowStockVariants }
    ] = await Promise.all([
      supabase.from('products').select('id, name, sku, stock').gt('stock', 0).lte('stock', 10),
      supabase.from('product_variants').select('id, sku, stock, variant_options, product_id, products(name)').gt('stock', 0).lte('stock', 10)
    ]);

    const lowStockProducts: any[] = [];
    
    // Add base products
    (lowStockBaseProducts || []).forEach(p => {
      lowStockProducts.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock
      });
    });

    // Add variants
    (lowStockVariants || []).forEach(v => {
      const productsData: any = v.products;
      const parentName = Array.isArray(productsData) ? productsData[0]?.name : productsData?.name;
      lowStockProducts.push({
        id: v.product_id || v.id,
        name: `${parentName || 'Product'} (${Object.values(v.variant_options || {}).join(' / ')})`,
        sku: v.sku,
        stock: v.stock
      });
    });

    return {
      success: true,
      data: {
        newOrdersCount: newOrdersCount || 0,
        warehouseCount: warehouseCount || 0,
        activeShipmentsCount: activeShipmentsCount || 0,
        customersCount: customersCount || 0,
        pendingPaymentsCount: pendingPaymentsCount || 0,
        ecomOrdersCount: ecomOrdersCount || 0,
        totalProductsCount: totalProductsCount || 0,
        importersCount: importersCount || 0,
        packagesReceivedCount: packagesReceivedCount || 0,
        packagesShippedCount: packagesShippedCount || 0,
        pendingProcurementCount: pendingProcurementCount || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
        lowStockProducts,
        chartData
      }
    };
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: error.message || 'Failed to load stats' };
  }
}
