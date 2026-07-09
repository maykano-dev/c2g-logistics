import { aliexpressRequest } from './lib/aliexpress/client.ts';
import 'dotenv/config';

async function run() {
  try {
    const res = await aliexpressRequest({
      apiMethod: 'aliexpress.ds.category.get',
      params: {
        app_signature: 'test',
        target_currency: 'USD',
        target_language: 'EN'
      }
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
