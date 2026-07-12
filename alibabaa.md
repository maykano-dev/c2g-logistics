Latest update:2024-08-12 15:09:32
2582
Advanced Freight Cost Calculation
GET/POST
/order/freight/calculate
Description：Provides a more accurate freight cost estimation using the shipping destination and product metrics.
Parameter
Name
	
Type
	
Required or not
	
Description
e_company_id
	
String
	
Yes
	
Get from https://openapi.alibaba.com/doc/api.htm?spm=a2o9m.11193531.0.0.1dd7f453B15glv#/api?cid=7&path=/eco/buyer/product/description&methodType=GET
address
	
Object
	
No
	
Shipping address
destination_country
	
String
	
Yes
	
Destination Country,like US
logistics_product_list
	
Object[]
	
Yes
	
Product List
dispatch_location
	
String
	
No
	
Product dispatch location, default as CN
enable_distribution_waybill
	
Boolean
	
No
	
true means using the distribution pick-up list, and the default is false.
Response Parameters
Name
	
Type
	
Description
value
	
Object[]
	
[]
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/order/freight/calculate

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/order/freight/calculate");
request.addApiParameter("e_company_id", "cVmhg7/xG8q3UQgcH/5Fag==");
request.addApiParameter("address", "{\"zip\":\"35022\",\"country\":{\"code\":\"US\",\"name\":\"United States\"},\"address\":\"4595 Clubview Drive\",\"province\":{\"code\":\"xx\",\"name\":\"Alabama\"},\"city\":{\"code\":\"xx\",\"name\":\"Bessemer\"}}");
request.addApiParameter("destination_country", "US");
request.addApiParameter("logistics_product_list", "[{\"quantity\":\"1\",\"product_id\":\"1600191825486\",\"sku_id\":\"12321\"}]");
request.addApiParameter("dispatch_location", "CN");
request.addApiParameter("enable_distribution_waybill", "false");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": [
    {
      "destination_country": "US",
      "vendor_code": "seller_oversea_distributor_sellers_shipping_method_1",
      "fee": {
        "amount": "3.0",
        "currency": "USD"
      },
      "shipping_type": "EXPRESS/MULTIMODAL_TRANSPORT",
      "dispatch_country": "US",
      "vendor_name": "Seller\u0027s Shipping Method 1",
      "solution_biz_type": "distributionWaybill",
      "trade_term": "DAP",
      "delivery_time": "3-9",
      "store_type": "CERTIFIED"
    }
  ],
  "request_id": "0ba2887315178178017221014"
}2024-08-10 21:07:55
6875
Basic Freight Cost Estimation
GET/POST
/shipping/freight/calculate
Description：Estimates basic freight costs for a product based on its details.
Parameter
Name
	
Type
	
Required or not
	
Description
destination_country
	
String
	
Yes
	
destination country ISO 3166-2
product_id
	
Number
	
Yes
	
product id
quantity
	
Number
	
Yes
	
quantity
zip_code
	
String
	
No
	
destination zip code
dispatch_location
	
String
	
No
	
product dispatch location, default as CN
enable_distribution_waybill
	
Boolean
	
No
	
true means using the distribution pick-up list, and the default is false.
Response Parameters
Name
	
Type
	
Description
value
	
Object[]
	
[]
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/shipping/freight/calculate

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/shipping/freight/calculate");
request.addApiParameter("destination_country", "US");
request.addApiParameter("product_id", "213421");
request.addApiParameter("quantity", "3");
request.addApiParameter("zip_code", "90001");
request.addApiParameter("dispatch_location", "CN");
request.addApiParameter("enable_distribution_waybill", "false");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": [
    {
      "destination_country": "US",
      "vendor_code": "EX_ASP_Economy_Express_3C",
      "fee": {
        "amount": "19.1",
        "currency": "USD"
      },
      "shipping_type": "EXPRESS",
      "dispatch_country": "CN",
      "vendor_name": "Alibaba.com Economy Express (3C)",
      "solution_biz_type": "distributionWaybill",
      "trade_term": "DAP",
      "delivery_time": "10~15"
    }
  ],
  "request_id": "0ba2887315178178017221014"
}

Combined payment group query service
GET/POST
/order/merge/pay/query
Description：Combined payment group query service
Parameter
Name
	
Type
	
Required or not
	
Description
order_ids
	
String[]
	
Yes
	
Need to query the order number array for combined payment
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
{}
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/order/merge/pay/query

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/order/merge/pay/query");
request.addApiParameter("order_ids", "[\"23423333\",\"123421\"]");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "groups": [
      {
        "can_not_merge_pay_reason": "ORDER_STATUS_ERROR",
        "can_merge_pay": "false",
        "group_code": "CN",
        "can_not_merge_pay_order_items": [
          {
            "can_not_merge_pay_reason": "ORDER_STATUS_ERROR",
            "can_not_merge_pay_reason_message": "订单状态不符合合并支付条件",
            "order_id": "270913970501025473"
          }
        ],
        "can_not_merge_pay_reason_message": "订单状态不符合合并支付条件",
        "can_merge_pay_order_items": [
          {
            "order_id": "270914298501025473"
          }
        ]
      }
    ]
  },
  "request_id": "0ba2887315178178017221014"
}Create BuyNow Order
GET/POST
/buynow/order/create
Description：Allows partners to create BuyNow orders on Alibaba.com, generating an order_id future queries.
Parameter
Name
	
Type
	
Required or not
	
Description
channel_refer_id
	
String
	
Yes
	
Provide the order number corresponding to the 3rd party ISV
logistics_detail
	
Object
	
Yes
	
Logistics details
product_list
	
Object[]
	
Yes
	
Product list
properties
	
String
	
No
	
Put the order number provided by the 3rd party platform and the name of the 3rd party platform. For example, if the order number is for a transaction made on Shopify, put “Shopify” and the order number. <br /> Platform Names can be case ignored:<br /> Shopify,CommerceHQ,WooCommerce,GrooveKart,BigCommerce
remark
	
String
	
No
	
order remark
attachments
	
Object[]
	
No
	
attachments list
enable_distribution_waybill
	
Boolean
	
No
	
true means use the distribution bill for self-pickup, the default is false
clearance_detail
	
Object
	
No
	
clearance detail ，Shipping address is required for South Korea.
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
{}
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/buynow/order/create

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/buynow/order/create");
request.addApiParameter("channel_refer_id", "124232");
request.addApiParameter("logistics_detail", "{\"shipment_address\":{\"zip\":\"314007\",\"country\":\"United States of America\",\"address\":\"1000 Fifth Avenue at 82nd Street\uFF0CNew York, NY\",\"city\":\"New York\",\"contact_person\":\"John Doe\",\"city_code\":\"NYC\",\"telephone\":{\"area\":\"86\",\"country\":\"0751\",\"number\":\"35354244223\"},\"province_code\":\"CA\",\"country_code\":\"US\",\"province\":\"California\",\"port\":\"NewYork\",\"alternate_address\":\"1000 Fifth Avenue at 82nd Street\uFF0CNew York, NY\",\"fax\":{\"area\":\"86\",\"country\":\"0571\",\"number\":\"67824793472\"},\"port_code\":\"NYC\"},\"dispatch_location\":\"Default as CN\",\"carrier_code\":\"EX_ASP_JYC_FEDEX\"}");
request.addApiParameter("product_list", "[{\"quantity\":\"10\",\"product_id\":\"100001\",\"sku_id\":\"200001\"}]");
request.addApiParameter("properties", "{\"platform\":\"Shopify\", \"orderId\": \"1111111111111\"}");
request.addApiParameter("remark", "order remarks");
request.addApiParameter("attachments", "[{\"file_path\":\"fghjkgfghjk\",\"file_usage\":\"DISTRIBUTION_WAY_BILL\",\"waybill_number\":\"SF11234321\",\"file_name\":\"xxxxx.jpg\",\"service_provider_name\":\"shunfeng\"}]");
request.addApiParameter("enable_distribution_waybill", "false");
request.addApiParameter("clearance_detail", "{\"business_name\":\"\uD55C\uAD6D\uBBF8\uC4F0\uBE44\uC2DC\uC0C1\uC0AC\uB294\",\"business_taxpayer_id\":\"1234567890\",\"clearance_code\":\"P123456789012\",\"clearance_mobile_number\":\"01012345678\",\"clearance_type\":\"PERSONAL | BUSINESS\",\"clearancer\":\"\uBCF5\uD654\"}");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "trade_id": "12345321",
    "pay_url": "https://xxxx"
  },
  "request_id": "0ba2887315178178017221014"
}

Logistics Tracking
GET/POST
/order/logistics/tracking/get
Description：Allows partners to track shipment and logistics updates for placed orders.
Parameter
Name
	
Type
	
Required or not
	
Description
trade_id
	
Number
	
Yes
	
order id
Response Parameters
Name
	
Type
	
Description
tracking_list
	
Object[]
	
logistics tracking list
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/order/logistics/tracking/get

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/order/logistics/tracking/get");
request.addApiParameter("trade_id", "2345323432");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "tracking_list": [
    {
      "carrier": "FEDEX",
      "tracking_number": "776705370628",
      "event_list": [
        {
          "event_code": "DELIVERED",
          "event_location": "US, TN, HENDERSONVILLE",
          "event_name": "Delivered",
          "event_time": "2024-06-11 15:53:00"
        }
      ],
      "tracking_url": "https://sale.alibaba.com/p/dwlfbxdr4/index.html?wx_screen_direc\u003dportrait\u0026wx_navbar_transparent\u003dtrue\u0026path\u003d/p/dwlfbxdr4/index.html\u0026ncms_spm\u003da27aq.23858521\u0026buyerAliId\u003dQEnHicXHVOhWsDJo1rcNhg%3D%3D\u0026sourceOrderId\u003dMven3kO0O%2BG%2BZUUUsCfiNoHQcmfctcdM",
      "current_event_code": "DELIVERED"
    }
  ],
  "request_id": "0ba2887315178178017221014"
}

Oversea admittance check api
GET/POST
/icbu/check/overseas/admittance
Description：This api is used for checking admittance status of users' oversea warehouse on Alibaba Platform
Parameter
Name
	
Type
	
Required or not
	
Description
No Data
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
returned result
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/icbu/check/overseas/admittance

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/icbu/check/overseas/admittance");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "result": {
    "exception": ":java.lang.Exception",
    "error_message": "systen error",
    "response": "true",
    "error_code": "500"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}alibaba dropshipping order pay
GET/POST
/alibaba/dropshipping/order/pay
Description：alibaba dropshipping order pay
Parameter
Name
	
Type
	
Required or not
	
Description
param_order_pay_request
	
Object
	
Yes
	
{}
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
response model
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/dropshipping/order/pay

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/dropshipping/order/pay");
request.addApiParameter("param_order_pay_request", "{\"user_ip\":\"10.11.102.11\",\"isv_drop_shipper_registration_time\":\"1616595118627\",\"order_id_list\":[\"[1234,2234]\",\"[1234,2234]\"],\"is_pc\":\"true\",\"accept_language\":\"zh-CN,zh;q\\u003d0.9,en;q\\u003d0.8,ja;q\\u003d0.7\",\"screen_resolution\":\"1024*1024  \",\"user_agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.30 Safari/537.36\",\"payment_method\":\"CREDIT_CARD\"}");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "reason_code": "NEVER_PAY_SUCCESS_IN_DROPSHIPER",
    "reason_message": "The buyer has never paid for a successful dropshipping order and needs to visit payUrl to pay 10.",
    "pay_url": "https://xxxx.htm",
    "status": "PAY_FAILED"
  },
  "request_id": "0ba2887315178178017221014"
}alibaba fund query api
GET/POST
/alibaba/order/fund/query
Description：alibaba fund query api
Parameter
Name
	
Type
	
Required or not
	
Description
e_trade_id
	
String
	
Yes
	
orderId
data_select
	
String
	
Yes
	
payment transaction fee
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
fund
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/order/fund/query

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/order/fund/query");
request.addApiParameter("e_trade_id", "21342134");
request.addApiParameter("data_select", "fund_transaction_fee");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "payment_transaction_fee": {
      "amount": "11",
      "currency": "USD"
    }
  },
  "request_id": "0ba2887315178178017221014"
}

alibaba ggs seller warehouse list
GET/POST
/alibaba/ggs/warehouse/list
Description：alibaba ggs seller warehouse list
Parameter
Name
	
Type
	
Required or not
	
Description
product_id
	
Number
	
Yes
	
product_id
page_size
	
Number
	
Yes
	
10
current_page
	
Number
	
Yes
	
1
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/ggs/warehouse/list

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/ggs/warehouse/list");
request.addApiParameter("product_id", "12134343");
request.addApiParameter("page_size", "page_size");
request.addApiParameter("current_page", "current_page");
IopResponse response = client.execute(request);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "result": {
    "total": "1",
    "code": "200",
    "data": [
      {
        "gmt_create": "1758100804000",
        "warehouse_province": "sdsd",
        "warehouse_type": "Private warehouse",
        "warehouse_address": "sdsdsd",
        "warehouse_code": "WH_1123_3688636448716134",
        "warehouse_country": "xini",
        "warehouse_city": "shanghai",
        "gmt_modified": "1758100804000",
        "zip_code": "123456",
        "warehouse_status": "active",
        "warehouse_name": "sdasd",
        "deleted": "0",
        "warehouse_contact": "thf",
        "warehouse_phone_number": "12334521",
        "ali_member_id": "1234522",
        "id": "11141"
      }
    ],
    "success": "success",
    "total_page": "1",
    "message": "success",
    "current_page": "1",
    "page_size": "10"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}

alibaba order attachment upload
GET/POST
/alibaba/order/attachment/upload
Description：alibaba order attachment upload
Parameter
Name
	
Type
	
Required or not
	
Description
data
	
byte[]
	
Yes
	
File byte array
file_name
	
String
	
Yes
	
The file name must end with .jpg (supports jpg, png, pdf, doc), and the file size should not exceed 5M
Response Parameters
Name
	
Type
	
Description
value
	
String
	
生成的附件的filepath值
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/order/attachment/upload

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/order/attachment/upload");
request.addFileParameter("data",new FileItem("/Users/D ocuments/book.jpg"));
request.addApiParameter("file_name", "xxxx.jpg");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": "xxxxxxxxxxx",
  "request_id": "0ba2887315178178017221014"
}

alibaba order cancel
GET/POST
/alibaba/order/cancel
Description：order cancel api
Parameter
Name
	
Type
	
Required or not
	
Description
trade_id
	
String
	
Yes
	
order id
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
success
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/order/cancel

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/order/cancel");
request.addApiParameter("trade_id", "1234532134");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {},
  "request_id": "0ba2887315178178017221014"
}alibaba order get
GET/POST
/alibaba/order/get
Description：alibaba order get
Parameter
Name
	
Type
	
Required or not
	
Description
e_trade_id
	
String
	
Yes
	
orderId
data_select
	
String
	
No
	
Data selectors all have parameters in English, separated by <br />statusAction,draft_role,snapshot_product
language
	
String
	
No
	
multi language
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
{}
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/order/get

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/order/get");
request.addApiParameter("e_trade_id", "12342132");
request.addApiParameter("data_select", "draft_role");
request.addApiParameter("language", "en_US");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "seller": {
      "immutable_eid": "kx++Dlfuw+osaJiw08no/A\u003d\u003d",
      "full_name": "mary mary",
      "immutable_eAdminId": "kx++Dlfuw+xxxxxx/A\u003d\u003d"
    },
    "attachments": [
      {
        "waybill_number": "SF12345",
        "file_usage": "DISTRIBUTION_WAY_BILL",
        "file_name": "hello.jpg",
        "service_provider_name": "SF",
        "url": "https://xxxxxxx"
      }
    ],
    "nation": "US",
    "discount_amount": {
      "amount": "0.0000",
      "currency": "USD"
    },
    "shipment_method": "EXPRESS",
    "remark": "null",
    "shipment_date": {
      "duration": "7",
      "date": {
        "format_date": "MMM. d, yyyy, HH:mm:ss z.",
        "timestamp": "213453"
      },
      "type": "relative"
    },
    "draft_role": "seller",
    "order_products": [
      {
        "unit": "Pieces",
        "quantity": "2.0000",
        "product_image": "https://sc04.alicdn.com/kf/H519351ec653a43b99a599b9318c8938cz.jpg",
        "product_id": "1601314875038",
        "sku_attributes": [
          {
            "value": "10A",
            "key": "Maximum Current"
          }
        ],
        "name": "yanwen combine test aliqatest",
        "sku_id": "106117950042",
        "sort": "1",
        "id": "133658eea7a2b5d8e0cbb6877ec6fff0",
        "model_number": "10A/20A/30A",
        "unit_price": {
          "amount": "0.1000",
          "currency": "USD"
        },
        "sku_code": "1"
      }
    ],
    "shipment_insurance_fee": {
      "amount": "1.0",
      "currency": "USD"
    },
    "trade_id": "234193410001028893",
    "vat_amount": {
      "amount": "1.0",
      "currency": "USD"
    },
    "fulfillment_channel": "TAD",
    "trade_status": "unpay",
    "export_service_type": "self_run_service",
    "shipping_address": {
      "zip": "10012",
      "country": "United States of America",
      "country_code": "US",
      "address": "Washington Square",
      "province": "New York",
      "city": "New york",
      "contact_person": "aaaa",
      "port": "null",
      "mobile": {
        "area": "null",
        "country": "+1",
        "number": "1234567890"
      },
      "alternate_address": "Washington Square Park",
      "telephone": {
        "area": "null",
        "country": "+1",
        "number": "null"
      }
    },
    "create_date": {
      "format_date": "MMM. d, yyyy, HH:mm:ss z.",
      "timestamp": "1733821832000"
    },
    "shipment_fee": {
      "amount": "4.6700",
      "currency": "USD"
    },
    "duty_amount": {
      "amount": "1.0",
      "currency": "USD"
    },
    "dropshipping": "false",
    "biz_code": "1010306",
    "pay_step": "ADVANCE",
    "trade_term": "FOB",
    "item_status": "normal",
    "tags": "[\"dropshipping\",\"ds_waybill\"]",
    "buyer": {
      "immutable_eid": "8s0vvDIbRvbS9hSAK4bUtw\u003d\u003d",
      "full_name": "xiaowu bglv"
    },
    "product_total_amount": {
      "amount": "0.20",
      "currency": "USD"
    },
    "carrier": {
      "code": "SEMI_MANAGED_CARRIER_CODE_CHEAPEST",
      "name": "Standard"
    },
    "status_action": {
      "actions": [
        {
          "name": "view_payment_link",
          "value": "http://xxxxxxx",
          "render_name": "View payment link"
        }
      ],
      "status": "trade_success"
    },
    "adjust_amount": {
      "amount": "0.0000",
      "currency": "USD"
    },
    "total_amount": {
      "amount": "4.8700",
      "currency": "USD"
    },
    "balance_amount": {
      "amount": "0.0000",
      "currency": "USD"
    },
    "semi_manage": "true",
    "advance_amount": {
      "amount": "4.8700",
      "currency": "USD"
    }
  },
  "request_id": "0ba2887315178178017221014"
}

alibaba order list
GET/POST
/alibaba/order/list
Description：alibaba order list
Parameter
Name
	
Type
	
Required or not
	
Description
start_page
	
Number
	
No
	
Default Value:0
role
	
String
	
Yes
	
seller/buyer， default buyer
modified_date_start
	
Object
	
No
	
Modify the time starting from the date_str time zone, which is America/Los_Angeles.
page_size
	
Number
	
No
	
Default Value:10,The maximum number of pages is 100.
sales_man_login_id
	
String
	
No
	
sales man login id
modified_date_end
	
Object
	
No
	
Modify the time starting from the date_str time zone, which is America/Los_Angeles.
create_date_start
	
Object
	
No
	
Order creation time, preferably use date_str, America/Los_Angeles.
create_date_end
	
Object
	
No
	
Order creation time, preferably use date_str, America/Los_Angeles.
status
	
String
	
No
	
order status。 see https://openapi.alibaba.com/doc/doc.htm?spm=a2o9m.11193535.0.0.381a2f04MvF1fW#/?docId=131
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
{}
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/order/list

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/order/list");
request.addApiParameter("start_page", "0");
request.addApiParameter("role", "buyer");
request.addApiParameter("modified_date_start", "{\"date_str\":\"2018-10-30 00:00:00\",\"date_timestamp\":\"123456\"}");
request.addApiParameter("page_size", "10");
request.addApiParameter("sales_man_login_id", "cn1514584373mpdm");
request.addApiParameter("modified_date_end", "{\"date_str\":\"2018-10-30 00:00:00\",\"date_timestamp\":\"123423\"}");
request.addApiParameter("create_date_start", "{\"date_str\":\"2018-10-30 00:00:00\",\"date_timestamp\":\"123422\"}");
request.addApiParameter("create_date_end", "{\"date_str\":\"2018-10-30 00:00:00\",\"date_timestamp\":\"2132122\"}");
request.addApiParameter("status", "unpay");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "total_count": "264930",
    "order_list": [
      {
        "trade_id": "271207727001028893",
        "trade_status": "unpay",
        "create_date": {
          "format_date": "Jul. 31, 2025, 21:09:36 PDT.",
          "timestamp": "1754021376000"
        },
        "modify_date": {
          "format_date": "Jul. 31, 2025, 21:09:37 PDT.",
          "timestamp": "1754021377000"
        }
      }
    ]
  },
  "request_id": "0ba2887315178178017221014"
}

alibaba order pay result query
GET/POST
/alibaba/order/pay/result/query
Description：alibaba查询订单支付结果
Parameter
Name
	
Type
	
Required or not
	
Description
trade_id
	
Number
	
Yes
	
order id
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
pay response
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/alibaba/order/pay/result/query

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/alibaba/order/pay/result/query");
request.addApiParameter("trade_id", "2134213421");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "reason_code": "50006",
    "trade_id": "23432131",
    "reason_message": "test failed",
    "pay_url": "https://xxxxx.htm",
    "status": "PAY_FAILED"
  },
  "request_id": "0ba2887315178178017221014"
}

alibaba seller warehouse list
GET/POST
/warehouse/list
Description：alibaba seller warehouse list
Parameter
Name
	
Type
	
Required or not
	
Description
product_id
	
Number
	
Yes
	
product id
country_code
	
String
	
No
	
country code
current_page
	
Number
	
No
	
current page
Response Parameters
Name
	
Type
	
Description
response
	
Object
	
response
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/warehouse/list

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/warehouse/list");
request.addApiParameter("product_id", "12343213");
request.addApiParameter("country_code", "US");
request.addApiParameter("current_page", "1");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "response": {
    "total": "26",
    "records": [
      {
        "country": "United States of America",
        "country_code": "US",
        "address": "asdffdsadfsa",
        "city": "Abernant",
        "name": "null",
        "state": "Alabama",
        "zip_code": "22222",
        "warehouse_id": "37507"
      }
    ],
    "current_page": "1",
    "page_size": "20"
  },
  "request_id": "0ba2887315178178017221014"
}

order logistics info query api
GET/POST
/order/logistics/query
Description：order logistics info query api
Parameter
Name
	
Type
	
Required or not
	
Description
trade_id
	
String
	
Yes
	
order id
data_select
	
String
	
No
	
If logistic_order is provided, it will query the express shipping tracking number.
Response Parameters
Name
	
Type
	
Description
value
	
Object
	
{}
Error code
Error code
	
Error message
	
Solution
No Data
GET/POST
/order/logistics/query

    JAVA
    PHP
    .NET
    RUBY
    PYTHON
    CURL

IopClient client = new IopClient(url, appkey, appSecret);
IopRequest request = new IopRequest();
request.setApiName("/order/logistics/query");
request.addApiParameter("trade_id", "2134532");
request.addApiParameter("data_select", "logistic_order");
IopResponse response = client.execute(request, accessToken);
System.out.println(response.getBody());
Thread.sleep(10);

    Streamlined Return

{
  "code": "0",
  "value": {
    "logistic_status": "CONFIRM_RECEIPT",
    "shipping_order_list": [
      {
        "voucher": {
          "tracking_number": "123432",
          "service_provider": "EX_ASP_OCEAN_EXPRESS",
          "logistics_type": "EXPRESS"
        }
      }
    ],
    "shipment_date": {
      "format_date": "Jun. 11, 2024, 20:10:13 PDT.",
      "timestamp": "1718161813000"
    }
  },
  "request_id": "0ba2887315178178017221014"
}

Batch Get Product Description
GET
/eco/buyer/product/batch/description
Description：Get the detail of Alibaba product using product_ids
Parameter
Name
	
Type
	
Required or not
	
Description
param0
	
Object
	
Yes
	
the id of Alibaba product
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result_info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/batch/description

    CURL

curl -X GET url + '/eco/buyer/product/batch/description?param0=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794001195'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "code": "200",
    "data": {
      "resultData": [
        {
          "detail_url": "https://www.alibaba.com/product-detail/Sublimation-Mug-40oz-Tumbler-Stainless-Steel_1601206892606.html",
          "images": "https://sc04.alicdn.com/kf/H223c0dee279948d3bbfeb813ab8fb58co.jpg",
          "skus": [
            {
              "image": "https://sc04.alicdn.com/kf/H0cc3ec827e3246c7bb6ae171b46a693bY.jpg",
              "total_discount_cost_price": "10.33",
              "cost_origin_price": "10",
              "sku_id": "105613018158",
              "sku_attr_list": [
                {
                  "attr_name_id": "111",
                  "attr_value_desc": "40oz solid color tumbler 1.0",
                  "attr_name_desc": "Color",
                  "attr_value_id": "-1",
                  "attr_value_image": "https://sc04.alicdn.com/kf/A78446e80a79746feaac8500a201de6afE.jpg_100x100.jpg"
                }
              ],
              "seller_sku_id": "1601206892606_107152354495",
              "cost_price_currency": "USD",
              "shipping_fee": "10",
              "unit": "Piece",
              "ladder_price": [
                {
                  "max_quantity": "499",
                  "min_quantity": "50",
                  "price": "3.69",
                  "currency": "USD"
                }
              ],
              "product_id": "1601206892606",
              "cost_discount_price": "10",
              "total_origin_cost_price": "10.33",
              "status": "NORMAL"
            }
          ],
          "eCompanyId": "eCompanyId",
          "main_image": "https://sc04.alicdn.com/kf/H223c0dee279948d3bbfeb813ab8fb58co.jpg",
          "description": "description",
          "wholesale_trade": [
            {
              "volume": "1234",
              "batch_number": "12",
              "package_size": "2*3*4",
              "price": "12.31",
              "sale_type": "batch",
              "weight": "12",
              "deliver_periods": [
                {
                  "quantity": "12",
                  "process_period": "3"
                }
              ],
              "unit_type": "Piece",
              "handling_time": "3",
              "min_order_quantity": "12",
              "shipping_line_template_id": "3"
            }
          ],
          "title": "title",
          "min_order_quantity": "1",
          "video_url": "https://play.video.alibaba.com/global/play/123.mp4",
          "category_id": "100003291",
          "mode_id": "\"AV.YW.DEP.103.L\"",
          "product_id": "1601206892606",
          "supplier": "Company name",
          "currency": "USD",
          "category": "Vacuum Flasks \u0026 Thermoses",
          "status": "PRODUCT_ONLINE"
        }
      ],
      "failedItems": [
        {
          "productId": "1601206892606",
          "errorCode": "2005",
          "errorMsg": "query failed"
        }
      ]
    },
    "success": "true",
    "message": "success"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Batch Get Product Inventory
GET
/eco/buyer/product/batch/inventory
Description：Get the inventory of Alibaba product using product_ids
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result_info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/batch/inventory

    CURL

curl -X GET url + '/eco/buyer/product/batch/inventory?query_req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794018022'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "code": "200",
    "data": {
      "failed_items": [
        {
          "error_msg": "query failed",
          "product_id": "601234567890",
          "error_code": "2005"
        }
      ],
      "result_data": [
        {
          "inventory_list": [
            {
              "inventory_list": [
                {
                  "inventory_unit": "Piece",
                  "inventory_count": "1",
                  "product_id": "1600927952535",
                  "sku_id": "104536974925"
                }
              ],
              "shipping_from": "CN"
            }
          ],
          "ship_from_list": [
            "CN"
          ],
          "product_id": "1600927952535"
        }
      ]
    },
    "success": "true",
    "message": "success"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Batch Get Product Keyattributes
GET
/eco/buyer/product/batch/keyattributes
Description：Get the attributes of Alibaba product using product_ids
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result_info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/batch/keyattributes

    CURL

curl -X GET url + '/eco/buyer/product/batch/keyattributes?query_req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794030492'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "code": "200",
    "data": {
      "resultData": [
        {
          "productId": "1601626498518",
          "attributes": [
            {
              "attributes": [
                {
                  "values": [
                    {
                      "verified": "null",
                      "name": "Water Proof",
                      "id": "3811327"
                    }
                  ],
                  "name": "Feature",
                  "id": "191284141"
                }
              ],
              "type": "Industry-specific attributes"
            }
          ]
        }
      ],
      "failedItems": [
        {
          "productId": "1601626498518",
          "errorCode": "ATTRIBUTE_QUERY_FAILED",
          "errorMsg": "query attribute failed"
        }
      ]
    },
    "success": "true",
    "message": "success"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Channel Product Events
POST
/eco/buyer/product/events
Description：Notify product online status (ACTIVE/INACTIVE) and current price from external sales channels.
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
POST
/eco/buyer/product/events

    CURL

curl -X POST url + '/eco/buyer/product/events' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794054258'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_message": "request success",
    "result_data": {
      "total": 1
    },
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Channel Store Products Batch Import By EcoId
POST
/eco/buyer/product/channel/batch-import
Description：Imports products by ecologyId in bulk into channel stores asynchronously.
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
query request
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result_info
Error code
Error code
	
Error message
	
Solution
No Data
POST
/eco/buyer/product/channel/batch-import

    CURL

curl -X POST url + '/eco/buyer/product/channel/batch-import' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794069076'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_message": "request success",
    "success": {},
    "result_data": {
      "pending_count": "1",
      "site_id": "b52fbc81-f3e3-4ea2-b737-2601a0e18235"
    },
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Cross-Border Product List
GET
/eco/buyer/crossborder/product/check
Description：Returns a list of products on Alibaba.com with cross-border inventory
Parameter
Name
	
Type
	
Required or not
	
Description
param0
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/crossborder/product/check

    CURL

curl -X GET url + '/eco/buyer/crossborder/product/check?param0=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794078937'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": [
      1284823,
      28743823
    ],
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Get Product Certificates
GET
/eco/buyer/product/cert
Description：Provides the certificates of Alibaba products using product_id
Parameter
Name
	
Type
	
Required or not
	
Description
req
	
Object
	
Yes
	
request object info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result object info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/cert

    CURL

curl -X GET url + '/eco/buyer/product/cert?req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794092083'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": [
      {
        "cert_name": "CC",
        "cert_no": "XD128738",
        "cert_urls": []
      }
    ],
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}

Get Product Description
GET
/eco/buyer/product/description
Description：Get the detail of Alibaba product using product_id
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result object info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/description

    CURL

curl -X GET url + '/eco/buyer/product/description?query_req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794112986'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": {
      "detail_url": "https://www.alibaba.com/product-detail/Sublimation-Mug-40oz-Tumbler-Stainless-Steel_1601206892606.html",
      "images": [],
      "skus": [
        {
          "image": "https://sc04.alicdn.com/kf/H0cc3ec827e3246c7bb6ae171b46a693bY.jpg",
          "total_discount_cost_price": "10.33",
          "cost_origin_price": "7.9",
          "sku_id": "105613018158",
          "sku_attr_list": [
            {
              "attr_name_id": "1111",
              "attr_value_desc": "40oz solid color tumbler 1.0",
              "attr_name_desc": "Color",
              "attr_value_id": "-11",
              "attr_value_image": "https://sc04.alicdn.com/kf/A78446e80a79746feaac8500a201de6afE.jpg_100x100.jpg"
            }
          ],
          "seller_sku_id": "1601206892606_107152354495",
          "cost_price_currency": "USD",
          "shipping_fee": "2.43",
          "unit": "Piece",
          "ladder_price": [
            {
              "max_quantity": "499",
              "min_quantity": "50",
              "price": "3.69",
              "currency": "USD"
            }
          ],
          "product_id": "1601206892606",
          "cost_discount_price": "7.9",
          "total_origin_cost_price": "10.33",
          "status": "NORMAL"
        }
      ],
      "main_image": "https://sc04.alicdn.com/kf/H223c0dee279948d3bbfeb813ab8fb58co.jpg",
      "eCompanyId": "xxxxxxxxx",
      "description": "description",
      "wholesale_trade": {
        "volume": "1234",
        "batch_number": "12",
        "package_size": "2*3*4",
        "price": "12.34",
        "sale_type": "batch",
        "weight": "12.34",
        "deliver_periods": [
          {
            "quantity": "50",
            "process_period": "3"
          }
        ],
        "unit_type": "Piece",
        "handling_time": "3",
        "min_order_quantity": "12",
        "shipping_line_template_id": "123"
      },
      "title": "Sublimation Mug 40oz Tumbler Stainless Steel Double Wall Reusable Insulated Stanly 40oz Tumbler with Handle",
      "min_order_quantity": "50",
      "video_url": "https://play.video.alibaba.com/global/play/123.mp4",
      "category_id": "100003291",
      "mode_id": "\"AV.YW.DEP.103.L\"",
      "product_id": "1601206892606",
      "supplier": "Company name",
      "currency": "USD",
      "category": "Vacuum Flasks \u0026 Thermoses",
      "status": "PRODUCT_ONLINE"
    },
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}

Get Product Key Attributes
GET
/eco/buyer/product/keyattributes
Description：Provides the key attributes of Alibaba products using product_id
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/keyattributes

    CURL

curl -X GET url + '/eco/buyer/product/keyattributes?query_req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794126704'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": {
      "attributes": [
        {
          "attributes": [
            {
              "values": [
                {
                  "value": "12-24 hours"
                }
              ],
              "name": "thermal insulation performance"
            }
          ],
          "type": "Industry-specific attributes"
        }
      ]
    },
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}

Local Product List
GET
/eco/buyer/local/product/check
Description：Returns a list of products on Alibaba.com with overseas (local) inventory.
Parameter
Name
	
Type
	
Required or not
	
Description
req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/local/product/check

    CURL

curl -X GET url + '/eco/buyer/local/product/check?req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794167530'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": [
      1284823,
      28743823
    ],
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Local Product List - Regular Fulfillment
GET
/eco/buyer/localregular/product/check
Description：Returns a list of products on Alibaba.com with overseas inventory.
Parameter
Name
	
Type
	
Required or not
	
Description
req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/localregular/product/check

    CURL

curl -X GET url + '/eco/buyer/localregular/product/check?req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794229728'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": [
      1284823,
      28743823
    ],
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Product Image Search
GET
/eco/buyer/item/rec/image
Description：Allows partners to conduct image-based product searches using the Item ID.
Parameter
Name
	
Type
	
Required or not
	
Description
recReq
	
Object
	
Yes
	
request object info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/item/rec/image

    CURL

curl -X GET url + '/eco/buyer/item/rec/image?recReq=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794240156'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": {
      "pagination": {
        "current": "1",
        "page_count": "99",
        "page_size": "20",
        "total_product_count": "2000"
      },
      "products": [
        {
          "image": {
            "main_image": "https://s01.alicdn.com/image01.jpg",
            "multi_image": [
              "https://s01.alicdn.com/image01.jpg"
            ]
          },
          "price": "99",
          "product_id": "1600398490",
          "permalink": "https://www.alibaba.com/product-detail/100-Cotton-Men-s-t-shirt_1600736931988.html?spm\u003da27aq.28960555.6692376620.2.57693065wgEg2Q\u0026venueType\u003dgetSample"
        }
      ]
    },
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}

Product List
GET
/eco/buyer/product/check
Description：Returns a list of products on Alibaba.com including local products in the U.S., Mexico as well as cross-border products from China depending on your specific needs.
Parameter
Name
	
Type
	
Required or not
	
Description
query_req
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/product/check

    CURL

curl -X GET url + '/eco/buyer/product/check?query_req=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794254803'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": [
      1284823,
      28743823
    ],
    "result_code": "200",
    "result_total": "100000"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Product Search
GET
/eco/buyer/product/search
Description：Searches products on Alibaba.com
Parameter
Name
	
Type
	
Required or not
	
Description
param0
	
Object
	
Yes
	
request info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
400
	
Parameter format is error!
	
The request body or query-string contains a malformed parameter (e.g., wrong type, missing field, invalid enum value). Please double-check the syntax and data types described in the API contract.
500
	
system error
	
The server ran into an unexpected condition that prevented it from fulfilling the request. Retry after a short delay; if the issue persists, contact support and include the returned request/trace ID.
GET
/eco/buyer/product/search

    CURL

curl -X GET url + '/eco/buyer/product/search?param0=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794264926'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "code": "200",
    "data": {
      "pagination": {
        "current": "1",
        "page_count": "99",
        "page_size": "20",
        "total_product_count": "2000"
      },
      "products": [
        {
          "image": {
            "main_image": "https://s01.alicdn.com/image01.jpg",
            "multi_image": [
              "https://s01.alicdn.com/image01.jpg"
            ]
          },
          "price": "99",
          "product_id": "1600398490",
          "permalink": "https://www.alibaba.com/product-detail/100-Cotton-Men-s-t-shirt_1600736931988.html?spm\u003da27aq.28960555.6692376620.2.57693065wgEg2Q\u0026venueType\u003dgetSample",
          "title": "Wireless Bluetooth Earbuds with Charging Case"
        }
      ]
    },
    "message": "request success"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}Product Search & Recommendation
GET
/eco/buyer/item/rec
Description：Generates search and recommendation results for products based on the uploaded data using Item ID.
Parameter
Name
	
Type
	
Required or not
	
Description
recReq
	
Object
	
Yes
	
object info
Response Parameters
Name
	
Type
	
Description
result
	
Object
	
result info
Error code
Error code
	
Error message
	
Solution
No Data
GET
/eco/buyer/item/rec

    CURL

curl -X GET url + '/eco/buyer/item/rec?recReq=001' --http1.1\ 
-H 'app_key=12345678'\ 
-H 'timestamp=1783794276422'\ 
-H 'access_token=37c66819338b4562e17675b8c5c4dbd0'\ 
-H 'sign_method=sha256'\ 
-H 'sign=D13F2A03BE94D9AAE9F933FFA7B13E0A5AD84A3DAEBC62A458A3C382EC2E91EC'

    Streamlined Return

{
  "result": {
    "result_msg": "request success",
    "result_data": {
      "pagination": {
        "current": "1",
        "page_count": "99",
        "page_size": "20",
        "total_product_count": "2000"
      },
      "products": [
        {
          "image": {
            "main_image": "https://s01.alicdn.com/image01.jpg",
            "multi_image": [
              "https://s01.alicdn.com/image01.jpg"
            ]
          },
          "price": "99",
          "product_id": "1600398490",
          "permalink": "https://www.alibaba.com/product-detail/100-Cotton-Men-s-t-shirt_1600736931988.html?spm\u003da27aq.28960555.6692376620.2.57693065wgEg2Q\u0026venueType\u003dgetSample"
        }
      ]
    },
    "result_code": "200"
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}

