export default class CommonMethods {
    constructor() {

    }

    static setCookie(key, value, days) {
        let d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires="+ d.toUTCString();
        let domain = "domain=." + process.env.DOMAIN;
        document.cookie = key + "=" + value + ";" + expires + ";" + domain + ";path=/";
    }

    static getCookie(key) {
        let name = key + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookies = decodedCookie.split(';');
        for(let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return false;
    }

    static removeCookie(key) {
        let domain = "domain=." + process.env.DOMAIN;
        document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + domain + ";path=/";
    }

    static formatPrice(value) {
        value = Math.round(value);
        let val = (value/1).toFixed(2).replace('.', ',');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    static toUpperCase(str) {
        return str.toUpperCase();
    }

    static isDomainValid(sld, tld) {
        let tldMin3Char = ['.web.id','.co.id','.sch.id','.or.id','.ac.id','.biz.id','.my.id'];
        let tldMin5Char = ['.id'];

        if (tldMin3Char.includes(tld)) {
            if (sld.length < 3 ) {
                return {
                    valid: false,
                    message: "Jumlah karakter untuk domain "+ tld +" minimal 3 karakter."
                };
            }
        } else if (tldMin5Char.includes(tld)) {
            if (sld.length < 5){
                return {
                    valid: false,
                    message: "Jumlah karakter untuk domain "+ tld +" minimal 5 karakter.",
                };
            }
        }

        return {
            valid: true,
            message: 'Domain is valid'
        }
    }

    static inArray(needle, haystack) {
        let length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (haystack[i] == needle) {
                return true;
            }
        }
        return false;
    }
    
    static checkUrlPath(path) {
        let urlPath, urlString;
        urlPath = window.location.pathname.split('/');
        return urlString = urlPath.includes(path);
    }

    static discountPrice(reg, years, first) {
      let customDiscountPrice;
      customDiscountPrice = (reg * years) - (reg - first);
      return customDiscountPrice;
    }

    static formatDomain(domain, sparator) {
      return domain.replace(/\./g, sparator)
    }

    static isSldValid(sld) {
      let re = /[-a-zA-Z0-9_.+]+@[a-zA-Z0-9-]{2,}/;
      return !re.test(sld);
    }

    static loadPixel(data, cartItems, callback) {
      let pixel = this.getCookie('PIXEL_AFF');

      if (!pixel) {
        callback();
        return;
      }

      pixel = JSON.parse(pixel);

      if (pixel.client_id == process.env.ACCESSTRADE_CLIENT_ID) {
        this.accessTradeConversion(pixel, data.invoice_id, cartItems, callback);
      } else {
        this.involveAsiaConversion(pixel, data, cartItems, callback );
      }

      this.removeCookie('PIXEL_AFF');
    }

    static involveAsiaConversion(pixel, data, cartItems, callback) {
      let item;
      let total = 0;
      for (item of cartItems) {
        if ('hosting' == item.type) {
          total = item.total;
          break;
        }
      }

      if (total === 0) {
        callback();
        return;
      }

      let pixelUrl = pixel.url
        .replace('__invoice_number__', data.invoice_number)
        .replace('__invoice_id__', data.invoice_id)
        .replace('__total__', total);

      this.addHtmlTag('img', pixelUrl, callback);
    }

    static accessTradeConversion(pixel, transactionId, cartItems, callback) {
      let item;
      let products = [];

      for (item of cartItems) {
        if ('hosting' == item.type) {
          products.push({
            id          : item.product_id,
            category_id : item.type,
            price       : item.total,
            quantity    : item.quantity
          });
          break;
        }
      }

      if (!products.length) {
        callback();
        return;
      }

      window.__atw = window.__atw || [];
      __atw.push({
        mcn   : pixel.campaign_id,
        param : {
          result_id  : pixel.result_id,
          identifier : transactionId,
          products   : products
        }
      });

      this.addHtmlTag('script', pixel.url + timestamp, callback);
    }

    static addHtmlTag(tagName, url, onLoadCallback = null) {
      let tag = document.createElement(tagName);
      tag.src = url;
      if (onLoadCallback != null) {
        tag.addEventListener('load', onLoadCallback);
      }
      let target = document.getElementsByTagName('script')[0];
      target.parentNode.insertBefore(tag, target);
    }

    static tiktokAddToCart(cart) {
      if (typeof window.ttq === 'undefined' || !this.getCookie('ttclid')) {
        return false;
      }
      let items = [];
      cart.items.forEach(item => {
        let itemData = {
          content_category: item.type,
          content_id: item.id,
          content_name: item.title,
          content_type: 'product',
          price: item.total,
          quantity: item.quantity,
        }
        items.push(itemData);
      });

      ttq.track('AddToCart', {
        contents: items,
        value: cart.total,
        currency: cart.currency.code,
      });
    }
}