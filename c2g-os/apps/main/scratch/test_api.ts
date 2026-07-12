import { alibabaRequest } from '../lib/alibaba/client';

async function main() {
  console.log('Testing Alibaba GGS Seller Warehouse API...');
  
  const accessToken = '50000100528UUobrNExlmCr3nQgaak1fLuhxQefE13b6cdb6jsiMsthkjsenU5';
  
  try {
    const res = await alibabaRequest({
      apiMethod: '/alibaba/ggs/warehouse/list',
      accessToken: accessToken,
      httpMethod: 'POST',
      params: {
        product_id: '12134343',
        page_size: '10',
        current_page: '1'
      }
    });
    console.log('\n--- SUCCESS! ---');
    console.log(JSON.stringify(res, null, 2));
  } catch (error: any) {
    console.error('\n--- FAILED! ---');
    console.error(error.message);
  }
}

main();
