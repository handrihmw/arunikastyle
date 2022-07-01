export default {
    getCart() {
        this.show_spinner = true;

        axios.get('/api/guest/get_cart')
            .then((res) => {
                this.cart = res.data.cart;
                if (!this.cart.items.length &&
                    (this.orderflow_step !== 1 || (this.orderflow_step === 1))) {
                    location.reload(true);
                }
                this.show_spinner = false;
            })
            .catch((err) => {
                console.log(err);
                this.show_spinner = false;
            });
    },

    addToCart(item) {
        this.show_spinner = true;
        
        axios.post('/api/guest/add_to_cart', {
                item: item
            })
            .then((res) => {
                this.getCart();
            })
            .catch((err) => {
                console.log(err);
                this.show_spinner = false;
            });
    },

    addDomainToCart() {
        let action = this.domain_config.action;

        let item = {
          register_years: this.domain_config.period,
          id: this.domain_config.product_id,
          action: action,
          [action + "_sld"]: this.sld,
          [action + "_tld"]: this.tld,
          "data-title": this.sld + this.tld,
          siapngedotcom: true
        };
        this.addToCart(item);
    },

    checkoutNow() {
        if (this.orderflow_step < 2) {
            this.orderflow_step += 1;
            if (this.orderflow_step === 1 && !this.client) {
                setTimeout(() => {
                    bus.$emit('init-password-checker');
                }, 100);
            }
            return false;
        }

        if (this.orderflow_step === 2) {
            this.show_spinner = true;
            axios.post('/api/guest/front_checkout', {
                    gateway_id: this.gateway_id,
                    order_flow: 'orderdomain',
                    client_data: this.client,
                })
                .then((res) => {
                    let result = res.data.result;
                    console.log(result);
                    this.checkoutPayment(result);
                })
                .catch((err) => {
                    console.log(err);
                    this.show_spinner = false;
                });
        }
    },

    checkoutPayment(params) {
        this.show_spinner = true;
        axios.post('/api/guest/checkout_payment', {
                hash: params.invoice_hash,
                gateway_id: params.gateway_id,
                auto_redirect: true,
            })
            .then((res) => {
                let result = res.data.result;
                this.removeCookie('BOXAFF');
                this.removeCookie('coupon_code');
                this.removeCookie('PIXEL_AFF');
                if (params.gateway_id === 1) {
                    let redirectUrl = CommonVar.bb_url + '/orderhost/terimakasih/' + params.gateway_name + '/' + params.invoice_number;
                    window.location.href = redirectUrl;
                    return;
                }
                if (!result.iframe && result.type === 'html') {
                    /*this.gateway_html = result.result;*/
                    document.getElementById("payment-gateway-html").innerHTML = result.result;
                    document.forms['payment_form'].submit();
                }
                this.show_spinner = false;
            })
            .catch((err) => {
                console.log(err);
                this.show_spinner = false;
            });
    },

    getComPricing() {
        this.show_spinner = true;

        axios.post('/api/guest/domain_pricing', {
                data: {
                    tld: this.tld
                }
            })
            .then((res) => {
                this.domain.first_year_registration = res.data.result.first_year_registration;
                this.domain.price_registration = res.data.result.price_registration;
                this.domain.price_renew = res.data.result.price_renew;

                this.setDomainPrice();

                this.show_spinner = false;
            })
            .catch((err) => {
                console.log(err);
                this.show_spinner = false;
            });
    },

    formatPrice(value) {
        value = Math.round(value);
        let val = (value / 1).toFixed(2).replace('.', ',');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    chooseDomainPeriod() {
        if (this.domain_config.period > 1) {
            this.domain.price = (this.domain.price_registration * this.domain_config.period) - (this.domain.price_registration - this.domain.first_year_registration);
            this.domain_config.period;
        } else {
            this.setDomainPrice();
        }
    },

    setDomainPrice: function() {
        if (this.domain.first_year_registration < 1) {
            this.domain.price = this.domain.price_registration;
        }

        if (this.domain.first_year_registration < this.domain.price_registration) {
            this.domain.price = this.domain.first_year_registration;
        } else {
            this.domain.price = this.domain.price_registration;
        }
    },
    
    getCookie(key) {
        let name = key + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookies = decodedCookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return false;
    },

    removeCookie(key) {
        document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
}
