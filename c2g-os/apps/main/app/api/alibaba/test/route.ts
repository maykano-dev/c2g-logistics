import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/alibaba/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await searchProducts({
      keyword: 'shoes',
      page_index: 1,
      page_size: 2
    });
    return NextResponse.json({ success: true, data: res });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
