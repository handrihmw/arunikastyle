export default class Gtm {
    constructor() {

    }

    static test()
    {
        console.log(dataLayer);
    }

    static gtmAddToCartDomain(tld){
        dataLayer.push({
            'event': 'addToCart',
            'eventCategory': 'Add to Cart',
            'eventAction': 'Domain',
            'ecommerce': {
                'currencyCode': 'IDR',
                'add': {
                    'products': [{
                        'name': 'Domain',
                        'id': tld,
                        'category': 'domain',
                        'quantity': 1,
                        'brand': 'Niagahoster'
                    }]
                }
            }
        });
    }

    static gtmAddToCartWp(title){
        dataLayer.push({
            'event': 'addToCart',
            'eventCategory': 'Add to Cart',
            'eventAction': 'Wordpress Hosting',
            'ecommerce': {
                'currencyCode': 'IDR',
                'add': {
                    'products': [{
                        'name': 'Wordpress Hosting',
                        'id': title,
                        'category': 'hosting',
                        'quantity': 1,
                        'brand': 'Niagahoster'
                    }]
                }
            }
        });
    }

    static gtmAddToCartHosting(title){
        dataLayer.push({
            'event': 'addToCart',
            'eventCategory': 'Add to Cart',
            'eventAction': 'Hosting',
            'ecommerce': {
                'currencyCode': 'IDR',
                'add': {
                    'products': [{
                        'name': 'Hosting',
                        'id': title,
                        'category': 'hosting',
                        'quantity': 1,
                        'brand': 'Niagahoster'
                    }]
                }
            }
        });
    }

    static gtmAddToCartSsl(title){
        dataLayer.push({
            'event': 'addToCart',
            'eventCategory': 'Add to Cart',
            'eventAction': 'SSL',
            'ecommerce': {
                'currencyCode': 'IDR',
                'add': {
                    'products': [{
                        'name': 'SSL',
                        'id': title,
                        'category': 'ssl',
                        'quantity': 1,
                        'brand': 'Niagahoster'
                    }]
                }
            }
        });
    }

    static gtmAddToCartVpsAddon(id){
        let product_id;
        if (id == 38) {
            product_id = 'Webuzo';
        } else if(id == 61) {
            product_id = 'cPanel';
        }
        dataLayer.push({
            'event': 'addToCart',
            'eventCategory': 'Add to Cart',
            'eventAction': 'VPS Addon',
            'ecommerce': {
                'currencyCode': 'IDR',
                'add': {
                    'products': [{
                        'name': 'Addon',
                        'id': product_id,
                        'category': 'vps addon',
                        'quantity': 1,
                        'brand': 'Niagahoster'
                    }]
                }
            }
        });
    }

    static gtmRemoveFromCart(type,title,tld){
        let name;
        let category;
        let id = title.split(" ")[0];
        let eventAction;

        if (type == 'vpsme') {
            eventAction = 'VPS';
            name = 'VPS';
            category = 'vps';
        } else if (type == 'custom') {
            eventAction = 'VPS Addon';
            name = 'Addon';
            category = 'vps addon';
        } else if (type == 'hosting') {
            eventAction = 'Hosting';
            name = 'Hosting';
            category = 'hosting';
        } else if (type == 'domain') {
            eventAction = 'Domain';
            name = 'Domain';
            category = 'domain';
            id = tld;
        } else if (type == 'wordpresshosting') {
            eventAction = 'Wordpress Hosting';
            name = 'Wordpress Hosting';
            category = 'hosting';
            id = title.split(" ")[0] + " " + this.jsUcFirst(title.split(" ")[1]);
        } else if (type == 'ssl') {
            eventAction = 'SSL';
            name = 'SSL';
            category = 'ssl';
            id = this.jsUppercase(title.split("untuk")[0]);
        } else if (type == 'weebly') {
            eventAction = 'Weebly';
            name = 'Weebly';
            category = 'weebly';
            id = this.jsUppercase(title.split("untuk")[0]);
        }

        dataLayer.push({
            'event': 'removeFromCart',
            'eventCategory': 'Remove from Cart',
            'eventAction': eventAction,
            'ecommerce': {
                'currencyCode': 'IDR',
                'remove': {
                    'products': [{
                        'name': name,
                        'id': id,
                        'category': category,
                        'quantity': 1,
                        'brand': 'Niagahoster'
                    }]
                }
            }
        });
    }

    static gtmCheckout(data, orderflow){
        let product = [];
        let items = data.items;

        for (let i = 0; i < items.length; i++) {
            let sku = items[i]['sku'].split(" ");
            if (items[i]['category'] == 'hosting') {
                let id = items[i]['sku'].split("for");
                let name;
                if (sku[0] == 'Mail') {
                    name = 'Email Hosting';
                } else {
                    name = 'Hosting';
                }
                product.push({
                    'name': name,
                    'id': id[0].trim(),
                    'price': items[i]['price'],
                    'category': items[i]['category'],
                    'quantity': parseInt(items[i]['quantity']),
                    'brand': 'Niagahoster'
                });
            } else if (items[i]['category'] == 'domain') {
                let id = sku[1].split(".");
                if (id.length == 3) {
                    id = '.' + id[1] + '.' + id[2];
                } else {
                    id = '.' + id[1];
                }
                product.push({
                    'name': 'Domain',
                    'id': id.trim(),
                    'price': items[i]['price'],
                    'category': items[i]['category'],
                    'quantity': parseInt(items[i]['quantity']),
                    'brand': 'Niagahoster'
                });
            } else if (items[i]['category'] == 'vpsme') {
                let id = sku[0].split(" ");
                product.push({
                    'name': 'VPS',
                    'id': id[0].trim(),
                    'price': items[i]['price'],
                    'category': 'vps',
                    'quantity': parseInt(items[i]['quantity']),
                    'brand': 'Niagahoster'
                });
            } else if (items[i]['category'] == 'wordpresshosting') {
                let id = sku[0].split(" ")[0] + " " + this.jsUcFirst(sku[1].split(" ")[0]);
                product.push({
                    'name': 'Wordpress Hosting',
                    'id': id.trim(),
                    'price': items[i]['price'],
                    'category': 'hosting',
                    'quantity': parseInt(items[i]['quantity']),
                    'brand': 'Niagahoster'
                });
            } else if (items[i]['category'] == 'ssl') {
                let id = this.jsUppercase(items[i]['sku'].split("untuk")[0].trim());
                product.push({
                    'name': 'SSL',
                    'id': id,
                    'price': items[i]['price'],
                    'category': 'ssl',
                    'quantity': parseInt(items[i]['quantity']),
                    'brand': 'Niagahoster'
                });
            } else if (items[i]['category'] == 'weebly') {
                if (items[i]['sku'].split(" ")[0] == 'Trial') {
                    let id = this.jsUppercase(items[i]['sku'].split("untuk")[0].trim().split("Trial")[1]);
                } else {
                    let id = this.jsUppercase(items[i]['sku'].split("untuk")[0].trim());
                }
                product.push({
                    'name': 'Weebly',
                    'id': id.trim(),
                    'price': items[i]['price'],
                    'category': 'weebly',
                    'quantity': 1,
                    'brand': 'Niagahoster'
                });
            }
        }

        dataLayer.push({
            'event': 'checkout',
            'eventCategory': 'Checkout',
            'eventAction': orderflow,
            'ecommerce': {
                'checkout': {
                    'products': product
                }
            }
        });
    }

    static gtmCheckoutStep(n){
        let stepNumber = parseInt(n);
        dataLayer.push({
            'event': 'checkout',
            'ecommerce': {
                'checkout': {
                    'actionField': {'step': stepNumber}
                }
            }
        });
    }

    static gtmPaymentMethodTypes(eventAction) {
      dataLayer.push({
        'event': 'checkout',
        'eventCategory': 'Payment Method Types',
        'eventAction': eventAction,
      });
    }

    static trackingPromoRamadhan(){
        dataLayer.push({
            'event': 'clickCTAPromoRamadhan',
            'eventCategory': 'CTA Promo Ramadhan'
        });
    }

    static promotionImpression(name) {
        dataLayer.push({
            'event': 'promotionImpression',
            'eventCategory': 'Promotion Impression',
            'eventAction': name,
            'ecommerce': {
                'promoView': {
                    'promotions': [
                        {
                            'name': name
                        }]
                }
            }
        });
    }

    static promotionClick(name) {
        dataLayer.push({
            'event': 'promotionClick',
            'eventCategory': 'Promotion Click',
            'eventAction': name,
            'ecommerce': {
                'promoClick': {
                    'promotions': [
                        {
                            'name': name
                        }]
                }
            }
        });
    }

    static trackingClickCTA(eventCategory, eventAction) {
        dataLayer.push({
            'event': 'clickCTA',
            'eventCategory': eventCategory,
            'eventAction': eventAction
        });
    }

    static jsUcFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static jsUppercase(string) {
        let arr_split = string.split(" ");
        let arr_str = [];

        for (let i = 0; i < arr_split.length; i++) {
            if (arr_split[i] == 'ssl') {
                arr_str.push(arr_split[i].toUpperCase());
            } else {
                arr_str.push(arr_split[i].charAt(0).toUpperCase() + arr_split[i].slice(1));
            }
        }
        return arr_str.join(" ");
    }
}