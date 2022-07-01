<template>
    <div id="right-side-cart-wrapper">
        <div id="right-side-cart" class="section-summary">
            <div id="row-one" v-bind:class="{ 'with-coupon': orderflow_step == 2, 'without-coupon': orderflow_step != 2 }" class="card card-padding">
                <h3 class="nunito-bold font-size-16 color-4d5872">Detail Order</h3>
                <ul class="summary" v-bind:class="{ 'height-two': orderflow_step == 2, 'height-one': orderflow_step != 2 }">
                    <li v-for="item in cart.items" class="item">
                        <div class="item-row">
                            <div class="col-xs-8 no-padding">
                                <p class="nunito-regular font-size-12 color-4d5872">{{ toUpperCase(item.type) }}</p>
                            </div>
                            <div class="col-xs-4 no-padding">
                                <p class="font-size-18 text-right"><span @click="removeFromCart(item)" class="fa fa-times remove-item"></span></p>
                            </div>
                        </div>
                        <div class="item-row">
                            <p v-if="item.type == 'domain'" class="nunito-bold font-size-12 color-4d5872">
                                {{ toUpperCase(item[item.action + '_sld']) }}{{ toUpperCase(item[item.action + '_tld']) }}
                            </p>
                            <p v-else="" class="nunito-bold font-size-12 color-4d5872">{{ item.title }}</p>
                            <p class="nunito-bold font-size-12 color-4d5872 text-right">Rp. {{ formatPrice(item.total) }}</p>
                        </div>
                    </li>
                    <li class="item">
                        <div class="item-row">
                            <p class="nunito-regular font-size-12 color-4d5872">Pajak & Biaya Tambahan</p>
                        </div>
                        <div class="item-row clear-fix">
                            <div class="col-xs-4 no-padding">
                                <p class="nunito-bold font-size-12 color-4d5872">{{ taxName }}</p>
                            </div>
                            <div class="col-xs-8 no-padding">
                                <p class="nunito-bold font-size-12 color-4d5872 text-right">Rp. {{ formatPrice(cart.total * taxRate) }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="cart-total clear-fix">
                    <div class="col-xs-4 no-padding">
                        <p class="nunito-bold font-size-12 color-4d5872">TOTAL</p>
                    </div>
                    <div class="col-xs-8 no-padding">
                        <p class="nunito-bold font-size-12 color-4d5872 text-right">Rp. {{ formatPrice(cart.total + (cart.total * taxRate)) }}</p>
                    </div>
                </div>
            </div>
            <div id="row-two" v-bind:class="{ 'with-coupon': orderflow_step == 2, 'without-coupon': orderflow_step != 2 }" style="margin-top: 22px;">
                <div v-if="orderflow_step == 2" class="card card-padding" style="margin-bottom: 22px;">
                    <h3 class="nunito-bold font-size-16 color-4d5872" style="margin-bottom: 14px;">Kode Kupon</h3>
                    <div class="coupon-code-wrapper">
                        <div class="col-xs-8">
                            <input type="text" id="coupon-code" name="coupon_code" v-model="coupon_code" placeholder="Kode Kupon Anda">
                        </div>
                        <div class="col-xs-4">
                            <a href="javascript:void(0)" @click="usePromoCode" class="button-apply-coupon">Apply</a>
                        </div>
                    </div>
                    <div v-if="show_coupon_status" class="text-center">
                        <p v-if="coupon_status.result" class="nunito-light font-size-12" style="color: #00b553">Kode Coupon berhasil diaplikasikan!</p>
                        <p v-else="!coupon_status.result" class="nunito-light font-size-12" style="color: #ff0000">{{ coupon_status.message }}</p>
                    </div>
                </div>
                <div id="checkout-button-wrapper" style="height: 48px;">
                    <div id="checkout-button">
                        <a v-if="cart.items.length"
                           @click="checkoutNow" href="javascript:void(0)"
                           class="button-default button-block button-blue nunito-bold font-size-16">Checkout Sekarang</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonMethods from "../CommonMethods";

    export default {
        name: "SectionSummary",
        props: ['cart', 'orderflow_step', 'client'],
        data : function () {
            return {
                show_coupon_status: false,
                coupon_status: {
                    result: false,
                    message: '',
                },
                coupon_code: false,
                taxRate: 0,
                taxName: '',
            }
        },
        computed: {
            promocode() {
                return this.cart.promocode;
            }
        },
        watch: {
            promocode: function () {
                if (!this.coupon_code) {
                    this.coupon_code = this.cart.promocode
                }
            }
        },
        methods: {
            checkoutNow() {
                if ((this.orderflow_step == 1 && screen.width <= 1049) || (this.orderflow_step == 2 && this.client)) {
                    let button = document.getElementById("checkout-button");
                    if (button.classList.contains('sticky-cart')){
                        window.scrollTo(0,document.body.scrollHeight);
                    } else {
                        let isLoginByRegister = CommonMethods.getCookie('BOXCCBR');
                        if (isLoginByRegister === 'true') {
                            this.$emit('checkout-now', false);
                        } else {
                            this.$emit('checkout-now', true);
                        }
                    }
                } else if (this.orderflow_step == 2 && !this.client) {
                    let element = document.getElementById("client-information");
                    element.scrollIntoView();
                } else {
                    let isLoginByRegister = CommonMethods.getCookie('BOXCCBR');
                    if (isLoginByRegister === 'true') {
                        this.$emit('checkout-now', false);
                    } else {
                        this.$emit('checkout-now', true);
                    }
                }
            },
            usePromoCode() {
                bus.$emit('show-spinner', true);

                let email = '';
                let password = '';

                if (this.client) {
                    email = this.client.email;
                    password = this.client.password;
                }

                axios.post('/api/guest/use_promo_code', {
                    promo_code: this.coupon_code,
                    email: email,
                    password: password,
                })
                    .then( (res) => {
                        let result = res.data.result;
                        let error = res.data.error;

                        if (error != null) {
                            this.coupon_status.result = false;
                            this.coupon_status.message = error.message;
                        } else {
                            this.coupon_status.result = result.result;
                            this.coupon_status.message = result.message;
                        }

                        this.show_coupon_status = true;
                        if (result != null && result.result) {
                            if (result.is_affiliate) {
                                CommonMethods.setCookie('coupon_code', this.coupon_code, 30);
                                CommonMethods.setCookie('coupon_affiliate', true, 30);
                                CommonMethods.removeCookie('inv_id');
                                CommonMethods.removeCookie('hasoffers_session');
                                CommonMethods.removeCookie('hasoffers_offer_id');
                                CommonMethods.removeCookie('hasoffers_account');
                                CommonMethods.removeCookie('PIXEL_AFF');
                                let url = CommonVar.bb_url + "/set-promo-code-session?referral_id=" + result.referral_id + "&aff_coupon=" + this.coupon_code;

                                let iframe = document.createElement("iframe");
                                iframe.setAttribute("src", url);
                                iframe.setAttribute("id", "set-promo-code-session");
                                iframe.style.display = "none";
                                document.body.appendChild(iframe);
                            }

                            bus.$emit('refresh-cart');
                        } else {
                            bus.$emit('show-spinner', false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            removePromoCode() {
                bus.$emit('show-spinner', true);

                axios.post('/api/guest/remove_promo_code')
                    .then( (res) => {
                        let result = res.data.result;
                        let error = res.data.error;

                        if (error != null) {
                            this.coupon_status.result = false;
                            this.coupon_status.message = error.message;
                        } else {
                            this.coupon_status.result = result.result;
                            this.coupon_status.message = result.message;
                        }

                        this.show_coupon_status = true;
                        if (result != null && result.result) {
                            bus.$emit('refresh-cart');
                        } else {
                            bus.$emit('show-spinner', false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            getCouponCodeFromCookie() {
                this.coupon_code = CommonMethods.getCookie('coupon_code');
                if (this.coupon_code.length) {
                    this.coupon_status.result = true;
                    this.coupon_status.message = 'Kode Coupon berhasil diaplikasikan';
                    this.show_coupon_status = true;
                }
            },
            removeFromCart(item) {
                bus.$emit('show-spinner', true);
                axios.post('/api/guest/remove_from_cart', {
                    id: item.id
                })
                    .then( (res) => {
                        bus.$emit('refresh-cart');
                        /* It will uncheck additional feature checkbox, the listener is on AdditionalFeature.vue */
                        bus.$emit('remove-item', item);

                        let action;
                        let tld;

                        if (item.type == 'domain') {
                            action = item.action;
                            tld = item[action + '_tld'];
                        } else {
                            action = item.domain.action;
                            tld = item.domain[action + '_tld'];
                        }

                        Gtm.gtmRemoveFromCart(item.type, item.title, tld);
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            formatPrice(value) {
                value = Math.round(value);
                let val = (value/1).toFixed(2).replace('.', ',');
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            toUpperCase(str) {
                return str.toUpperCase();
            },
            onScrollListener() {
                let cartWrapper = document.getElementById("right-side-cart-wrapper");
                let cartElement = document.getElementById("right-side-cart");
                let button = document.getElementById("checkout-button");
                if (this.cart.items.length) {
                    if (screen.width > 1049) {
                        /*For Desktop*/
                        if ((Math.floor(window.scrollY) - 50) > cartWrapper.offsetTop) {
                            this.adjustResize();
                            cartElement.classList.add('sticky-cart')
                        } else {
                            cartElement.classList.remove('sticky-cart');
                        }
                    } else {
                        /*For Mobile*/
                        let deltaScroll = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
                        if (deltaScroll >= 100) {
                            this.adjustResize();
                            button.classList.add('sticky-cart');
                        } else {
                            button.classList.remove('sticky-cart');
                        }
                    }
                } else {
                    button.classList.remove('sticky-cart');
                    cartElement.classList.remove('sticky-cart');
                }
            },
            adjustResize() {
                let cartWrapper = document.getElementById("right-side-cart-wrapper");
                let cartElement = document.getElementById("right-side-cart");
                let buttonWrapper = document.getElementById("checkout-button-wrapper");
                let button = document.getElementById("checkout-button");
                if (screen.width > 1049) {
                    /*For Desktop*/
                    cartElement.style.width = cartWrapper.offsetWidth + "px";
                    button.style.width = buttonWrapper.offsetWidth + "px";
                    button.classList.remove('sticky-cart');
                } else {
                    /*For Mobile*/
                    cartElement.classList.remove('sticky-cart');
                    cartElement.style.width = cartWrapper.offsetWidth + "px";
                    button.style.width = buttonWrapper.offsetWidth + "px";
                }
            },
            getTaxRate(){
                bus.$emit('show-spinner', true);
                axios.get('/api/v2/get-tax')
                    .then( (res) => {
                        this.taxRate = res.data.result['taxRate'];
                        this.taxName = res.data.result['taxName'];
                        bus.$emit('show-spinner', false);
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            }
        },
        mounted: function (params) {
            this.$on('remove-promo-code', () => {
                this.removePromoCode();
            });
        },
        created() {
            this.getTaxRate();
            this.getCouponCodeFromCookie();
            window.addEventListener('scroll', () => {
                this.onScrollListener();
            });
            window.addEventListener('resize', () => {
                this.adjustResize();
            });
        },
    }
</script>

<style scoped>

</style>
