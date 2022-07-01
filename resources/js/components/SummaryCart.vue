<template>
    <section id="summary-cart-wrapper">       
        <div id="summary-cart">
            <div class="summary-cart">
                <div class="orderflow-step">
                    <ul v-if="flow === 'website' || flow === 'mailhosting'">
                        <li :class="{'orderflow-step__item--active':orderflow_step == 1, 'orderflow-step__item--complete':orderflow_step > 1}" class="orderflow-step__item orderflow-step__item--website">
                            <div v-if="flow === 'website'" class="ribbon">1. Atur Website &amp; Domain</div>
                            <div v-else class="ribbon">1. Pilih Website &amp; Domain</div>
                        </li>
                        <li class="orderflow-step__item orderflow-step__item--active orderflow-step__item--website">
                            <div class="ribbon">2. Metode Pembayaran</div>
                        </li>
                    </ul>

                    <ul v-else>
                        <li :class="{'orderflow-step__item--active':orderflow_step == 1, 'orderflow-step__item--complete':orderflow_step > 1}" class="orderflow-step__item">
                            <div class="ribbon">1. Pilih Hosting &amp; Domain</div>
                        </li>
                        <li :class="{'orderflow-step__item--active':orderflow_step == 2, 'orderflow-step__item--complete':orderflow_step > 2}" class="orderflow-step__item">
                            <div class="ribbon">2. Tambah Fitur</div>
                        </li>
                        <li :class="{'orderflow-step__item--active':orderflow_step == 3, 'orderflow-step__item--complete':orderflow_step > 3}" class="orderflow-step__item">
                            <div class="ribbon">3. Metode Pembayaran</div>
                        </li>
                    </ul>
                </div>
            <div :class="{'d-block':show_summary_cart, 'd-none d-lg-block': !show_summary_cart}">
                <div id="summary-cart__item" class="summary-cart__item">
                    <transition name="fade" mode="out-in">
                        <div v-if="cart.items.length">
                            <div v-for="item in cart.items" :key="item.id">
                                <div class="row">
                                    <div class="col-8">
                                        <div v-if="flow === 'website' && item.type == 'hosting'">
                                            <p class="summary-cart__item-type">{{ item.title }}</p>
                                        </div>
                                        <div v-else-if="flow === 'mailhosting' && item.type == 'hosting'">
                                            <p class="summary-cart__item-type">Mail {{ item.type }} {{period[item.period].text}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="item.type == 'hosting'" class="summary-cart__item-type text-capitalize">{{ item.type }} {{period[item.period].text}}</p>
                                            <p v-else-if="item.type == 'ssl'" class="summary-cart__item-type text-uppercase">{{ item.type }}</p>
                                            <p v-else-if="item.type == 'domainprivacy'" class="summary-cart__item-type text-capitalize">{{ item.type.replace('domain', 'domain ')}}</p>
                                            <p v-else-if="item.type == 'domain' && item.action === 'transfer'">Transfer Domain</p>
                                            <p v-else class="summary-cart__item-type text-capitalize">{{ item.type }}</p>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <p class="font-size-18 text-right"><span @click="removeFromCart(item)" class="fa fa-times remove-item"></span></p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-7">
                                        <div v-if="flow === 'website' && item.type == 'hosting'">
                                            <p class="summary-cart__item-title">{{period[item.period].text}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="item.type == 'domain'" class="summary-cart__item-title">
                                                {{ toUpperCase(item[item.action + '_sld']) }}{{ toUpperCase(item[item.action + '_tld']) }}
                                            </p>
                                            <p v-else class="summary-cart__item-title">{{ item.title }}</p>
                                        </div>
                                    </div>
                                    <div class="col-5">                            
                                        <p class="summary-cart__item-price">Rp. {{ item.total | formatPrice }}</p>
                                    </div>
                                </div>
                                <hr>
                            </div>
                        </div>
                    </transition>

                    <p class="summary-cart__item-type">Pajak &amp; Biaya Tambahan</p>
                    <div class="row">
                        <div class="col-7">
                            <p class="summary-cart__item-title">{{ taxName }}</p>
                        </div>
                        <div class="col-5">
                            <p class="summary-cart__item-price text-right">Rp. {{ cart.total * taxRate | formatPrice }}</p>
                        </div>
                    </div>
                    <hr>
                </div>
                <div v-if="orderflow_step == 3" class="summary-cart__coupon d-none d-lg-block">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" name="coupon_code" v-model="coupon_code"  placeholder="Kode Kupon (opsional)" aria-label="Kode Kupon (opsional)" aria-describedby="coupon-code">
                        <div class="input-group-append">
                            <button id="coupon-code" type="button" @click="usePromoCode" :class="{'summary-cart__coupon--btn-grey': !coupon_code}" class="btn btn-secondary" :disabled="!coupon_code">Gunakan</button>
                        </div>
                    </div>
                    <transition name="fade" mode="out-in">
                        <div v-if="show_coupon_status" class="summary-cart__coupon-status">
                            <div v-if="coupon_status.result" class="row">
                                <div class="col-10">
                                    <p>Kode Kupon <strong>{{coupon_code}}</strong> berhasil digunakan</p>
                                </div>
                                <div class="col-2"><span @click="removeCoupon()" class="fa fa-times summary-cart__coupon-status--remove"></span></div>
                            </div>
                            <div v-else-if="coupon_status.error != null" class="row">
                                <div class="col-10">
                                    <p class="summary-cart__coupon-status--error">{{ coupon_status.message }}</p>
                                </div>
                                <div class="col-2"><span @click="removeCoupon()" class="fa fa-times summary-cart__coupon-status--remove"></span></div>
                            </div>                    
                            <p v-else class="summary-cart__coupon-status--error">{{ coupon_status.message }}</p>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="row">
                <div v-if="orderflow_step == 3 && payment_methods" :class="{'d-block':show_summary_cart, 'd-none d-lg-block': !show_summary_cart}" class="col-12 order-lg-2">
                    <div class="summary-cart__payment-method">
                        <p>Metode Pembayaran</p>
                        <strong v-for="method in payment_methods" :key="method.id">
                            <span v-if="method.id == gateway_id">{{method.title}}</span>
                        </strong>
                    </div>
                    <tos-text v-bind:device-class="'summary-cart__tos-desktop'"></tos-text>
                </div>
                <div class="col-12">
                    <div class="summary-cart__total">
                        <div class="row" :class="{'align-items-center': !cart.coupon}">
                            <div class="col-3 col-lg-4 pr-0">
                                <p class="summary-cart__total-title" :class="{'summary-cart__total-title--discount': cart.coupon}">
                                    TOTAL&nbsp;
                                    <span v-if="cart.coupon">(-{{ discount_percentage }}%)</span>
                                </p>       
                            </div>
                            <div class="col-8 col-lg-8">
                                <p v-if="cart.coupon" class="summary-cart__total-price summary-cart__total-price--discount">Rp. {{ total_before_coupon | formatPrice }}</p>
                                <p class="summary-cart__total-price">Rp. {{ total | formatPrice }} <span class="float-right badge badge-pill badge-light d-inline d-lg-none">{{ cart.items.length }}</span></p>
                            </div>
                            <a href="javascript:void(0);" v-on:click="show_summary_cart = true ? show_summary_cart == false : false" class="summary-cart__total-details col-1 d-block d-lg-none pl-0" aria-label="cart">
                                <span v-if="show_summary_cart" class="fa fa-angle-up"></span>
                                <span v-else class="fa fa-angle-down"></span>
                            </a>
                        </div>
                    </div> 
                    <tos-text
                        v-bind:device-class="'summary-cart__tos-desktop summary-cart__tos-mobile-logged'"
                        v-if="client">
                    </tos-text>
                </div>
            </div>            
        </div>
            <div v-if="orderflow_step == 3" id="checkout-button-wrapper" class="d-none d-lg-block gtmCTA">
                <div id="checkout-button">
                    <a  v-if="client" @click="checkoutNow" href="javascript:void(0)" class="button-default button-white-orange button-block nunito-bold PaymentPage_ButtonCheckoutSekarang_Clicked">Checkout Sekarang</a>
                    <a  v-else @click="checkoutNow" href="javascript:void(0)" :class="{'button-white-orange gtmCTAAfter': user_input_change, 'button-blue gtmCTABefore': !user_input_change}" class="button-default button-block nunito-bold PaymentPage_ButtonCheckoutSekarang_Clicked">Checkout Sekarang</a>
                </div>
            </div>
        </div>        
    </section>
</template>

<script>
    import TosText from "./TosText.vue"

    export default {
        name: "NewSectionSummary",
        components: {
          TosText
        },
        props: ['cart', 'orderflow_step', 'client', 'gateway_id', 'payment_methods', 'hosting', 'flow'],
        data : function () {
            return {
                period: CommonVar.period,
                show_coupon_status: false,
                coupon_status: {
                    result: false,
                    message: '',
                    error: false,
                },
                coupon_code: false,
                show_summary_cart: false,
                user_input_change: false,
                taxRate: 0,
                taxName: '',
            }
        },
        computed: {
            promocode() {
                return this.cart.promocode;                
            },
            total() {
                return this.cart.total * (1 + this.taxRate);
            },
            total_before_coupon() {
                return this.cart.total_before_coupon * (1 + this.taxRate);
            },
            discount_percentage() {
                return Math.round((this.total_before_coupon - this.total) / this.total_before_coupon * 100);
            },
            auto_install_website() {
              return this.cart.items.filter(item => {
                return (item.type == 'hosting' && item.auto_install_website == '1')
              });
            }
        },
        watch: {
            promocode: function () {
                if (!this.coupon_code) {
                    if ( this.cart.aff_coupon ) {
                        this.coupon_code = this.cart.aff_coupon
                    } else {
                        this.coupon_code = this.cart.promocode
                    }
                    if (this.coupon_code) {
                        this.coupon_status.result = true;
                        this.coupon_status.message = 'Kode Coupon berhasil diaplikasikan';
                        this.show_coupon_status = true;
                    }
                }
            },
            cart: function() {
              let key = Object.keys(this.cart.items);
              let items = this.cart.items;
              key = parseInt(key[key.length - 1]);
              items.forEach(item => {
                if (item.type == 'hosting' && item.auto_install_website == '1') {
                  items[key + 1] = {
                    id: '',
                    type: 'wordpress',
                    title: '',
                    total: 0
                  };
                }
              });
              
              setTimeout(() => {
              this.$on('remove-wordpress', () => {
                this.removeWordPress();
                bus.$emit('refresh-cart');
              });
              }, 100)
              
            }
        },
        filters: {
            formatPrice(value) {
               return CommonMethods.formatPrice(value)
            }
        },
        methods: {
            checkoutNow() {
                if (this.client) {
                    let isLoginByRegister = CommonMethods.getCookie('is_login_by_register');
                    if (isLoginByRegister === 'true') {
                        this.$emit('checkout-now', false);
                    } else {
                        this.$emit('checkout-now', true);
                    }
                } else {
                    bus.$emit('login-register-checkout');
                }
                if (! this.client && ! this.user_input_change) {
                    document.getElementById('client-information').scrollIntoView();
                }
                
            },
            checkUrlPath(path) {
                let urlPath;
                urlPath = window.location.pathname.split('/');
                return urlPath.includes(path);
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
                            this.coupon_status.error = error;
                        }

                        this.show_coupon_status = true;
                        if (result != null && result.result) {
                            if (result.is_affiliate) {
                                CommonMethods.setCookie('coupon_code', this.coupon_code, 30);
                                CommonMethods.setCookie('coupon_affiliate', true, 30);
                                CommonMethods.removeCookie('inv_id');
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
            removeCoupon() {
                bus.$emit('show-spinner', true);
                axios.post('/api/guest/remove_coupon')
                .then((res) => {
                    CommonMethods.removeCookie('coupon_code');
                    this.show_coupon_status = false;
                    this.coupon_status.result = false;
                    this.coupon_code = false;
                    bus.$emit('refresh-cart');
                })
                .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            removeFromCart(item) {
                bus.$emit('show-spinner', true);
                axios.post('/api/guest/remove_from_cart', {
                    id: item.id
                })
                    .then( (res) => {
                        if (this.flow === 'website') {
                            if (item.type === 'domain') {
                                window.location.href = CommonVar.niaga_url + 'order/website-instant/84';
                            } else if(item.type === 'hosting' || item.type == 'custom') {
                                window.location.href = CommonVar.niaga_url + 'membuat-website';
                            }
                        } else {
                            bus.$emit('refresh-cart');
                            /* It will uncheck additional feature checkbox, the listener is on AdditionalFeature.vue */
                            bus.$emit('remove-item', item);
                            if (item.type == 'wordpress') {
                              this.$emit('remove-wordpress');
                            }
                            if(item.is_added_to_cart) {
                                item.is_added_to_cart = false;
                            }

                            let action;
                            let tld;

                            if (item.type == 'domain') {
                                action = item.action;
                                tld = item[action + '_tld'];
                            } else {
                                action = item.domain.action;
                                tld = item.domain[action + '_tld'];
                            }
                            if (CommonVar.allow_mkt_script == true) {
                                Gtm.gtmRemoveFromCart(item.type, item.title, tld);
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
                    sessionStorage.removeItem('tmp_cart');
            },
            removeWordPress() {
              axios
              .post("/api/guest/add_remove_auto_install_website", {
                is_add: false
              })
              .catch(err => {
                console.log(err)
              });
              axios
              .post("/api/guest/add_remove_install_wp_accelerator", {
                is_add: false
              })
              .catch(err => {
                console.log(err)
              });
            },
            toUpperCase(str) {
                return str.toUpperCase();
            },
            onScrollListener() {
                let cartWrapper = document.getElementById("summary-cart-wrapper");
                let cartElement = document.getElementById("summary-cart");
                if (this.cart.items.length && screen.width > 991) {
                    if ((Math.floor(window.scrollY) - 50) > cartWrapper.offsetTop) {
                        cartElement.classList.add('sticky-cart');
                        this.adjustResize();
                    } else {
                        cartElement.classList.remove('sticky-cart');
                    }
                } else {
                    cartElement.classList.remove('sticky-cart');
                }
            },
            adjustResize() {
                let cartWrapper = document.getElementById("summary-cart-wrapper");
                let cartElement = document.getElementById("summary-cart");
                let itemElement = document.getElementById("summary-cart__item");
                if (screen.width > 991) {
                    /*For Desktop*/
                    cartElement.style.width = cartWrapper.offsetWidth + "px";
                    if (screen.height < 810) {
                        itemElement.classList.add("summary-cart__item--max-height");
                    } else {
                        itemElement.classList.remove("summary-cart__item--max-height");
                    }
                } else {
                    /*For Mobile*/
                    cartElement.classList.remove('sticky-cart');
                    cartElement.style.width = cartWrapper.offsetWidth + "px";
                    itemElement.classList.remove("summary-cart__item--max-height");
                }
            },
            checkUserInputChange() {
                this.$root.$on('user-input-change', status => {
                    return this.user_input_change = status
                }); 
            },
            setCouponStatus() {
                this.$root.$on('set-coupon-status', status => {
                    this.coupon_status = status;
                });
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
        mounted: function() {            
            setTimeout(() => {
                bus.$on('change-coupon-status', (msg, err) => {
                    this.coupon_status.result = false;
                    this.coupon_status.message = msg;
                    this.coupon_status.error = err;
                });
                bus.$on('refresh-coupon-status', () => {
                    this.coupon_code = false;
                    this.show_coupon_status = false;
                });                             
            }, 100);
        },
        created() {
            this.getTaxRate();
            this.checkUserInputChange();
            window.addEventListener('scroll', () => {
                this.onScrollListener();
            });
            window.addEventListener('resize', () => {
                this.adjustResize();
            });

            if (sessionStorage.getItem('flow')) {
                this.$emit('update-flow', sessionStorage.getItem('flow'));
                this.flow = sessionStorage.getItem('flow');
            }

            this.setCouponStatus();
        },
    }
</script>
<style scoped>

</style>