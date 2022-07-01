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
                        <li :class="{'orderflow-step__item--active':orderflow_step == 3, 'orderflow-step__item--complete':orderflow_step > 3}" class="orderflow-step__item orderflow-step__item--website">
                            <div class="ribbon">2. Metode Pembayaran</div>
                        </li>
                    </ul>

                    <ul v-else-if="flow === 'vps_kvm'">
                        <li :class="{'orderflow-step__item--active':orderflow_step == 1, 'orderflow-step__item--complete':orderflow_step > 1}" class="orderflow-step__item orderflow-step__item--website">
                            <div class="ribbon">1. Pilih VPS KVM</div>
                        </li>
                        <li :class="{'orderflow-step__item--active':orderflow_step == 3, 'orderflow-step__item--complete':orderflow_step > 3}" class="orderflow-step__item orderflow-step__item--website">
                            <div class="ribbon">2. Metode Pembayaran</div>
                        </li>
                    </ul>

                    <ul v-else>
                        <li :class="{'orderflow-step__item--active':orderflow_step == 1, 'orderflow-step__item--complete':orderflow_step > 1}" class="orderflow-step__item">
                            <div v-if="flow === 'vps' && plan_type === 'cpanel'" class="ribbon">1. Pilih VPS cPanel</div>
                            <div v-else-if="flow === 'vps'" class="ribbon">1. Pilih Cloud VPS</div>
                            <div v-else class="ribbon">1. Pilih Hosting &amp; Domain</div>
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
                        <div v-if="tmpCart.length">
                            <div v-for="item in tmpCart" :key="item.id">
                                <div v-if="item.action != 'owndomain'">
                                    <div class="row mb-2">
                                        <div class="col-8">
                                          <p class="summary-cart__item-type">{{ itemType(item) }}</p>
                                        </div>
                                        <div class="col-4">
                                            <p class="font-size-18 text-right"><span @click="removeFromCart(item, 'vps')" class="fa fa-times remove-item"></span></p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-7">
                                            <p v-if="item.type == 'domain' && !item.cart_type && item.cart_type == 'tmp_domain'" class="summary-cart__item-title">{{ item.register_sld + item.register_tld}}</p>
                                            <p v-if="item.type == 'hosting' && flow === 'website'" class="summary-cart__item-title">{{ item.period_text }}</p>
                                            <p v-else class="summary-cart__item-title">{{ item.title }}</p>
                                        </div>
                                        <div class="col-5">
                                            <p id="hosting-package-price" class="summary-cart__item-price text-right">Rp. {{ item.total | formatPrice }}</p>
                                            <p v-if="plan_type === 'cpanel' && item.type === 'cpanel_license'" class="summary-cart__item-price"><s>Rp. {{ item.discount_price | formatPrice }}</s></p>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                            </div>
                        </div>
                        </transition>
                        <transition name="fade" mode="out-in">
                        <div v-if="tmpAdditionalItems.length && (orderflow_step == 2 || flow == 'orderdomain')">
                            <div v-for="item in tmpAdditionalItems" :key="item.id">
                                <div class="row mb-2">
                                    <div class="col-10">
                                      <p v-if="flow === 'vps'" class="text-capitalize summary-cart__item-type">
                                        {{ item.title.includes('Backup') ? 'Backup Cloud VPS' : item.title.includes('Backup') == false ? 'Control Panel Cloud VPS' : item.type }} {{ period[tmp_addon_period].text }}
                                      </p>
                                      <p v-else :class="item.type == 'domainprivacy' ? 'text-capitalize' : 'text-uppercase'" class="summary-cart__item-type">
                                        {{ item.type == 'domainprivacy' ? 'Domain Privacy' : item.type }}
                                      </p>
                                    </div>
                                    <div class="col-2">
                                        <p class="font-size-18 text-right"><span @click="removeFromCart(item, 'addon')" class="fa fa-times remove-item"></span></p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-7">
                                        <p class="summary-cart__item-title">{{ item.title }}</p>
                                    </div>
                                    <div class="col-5">
                                        <p v-if="flow === 'vps' || item.product_id == 76" id="hosting-package-price" class="summary-cart__item-price text-right">Rp. {{ item.total | formatPrice }}</p>
                                        <p v-else id="hosting-package-price" class="summary-cart__item-price text-right">Rp. {{ item.price | formatPrice }}</p>
                                    </div>
                                </div>
                                <hr>
                            </div>
                        </div>
                        </transition>
                        <transition name="fade" mode="out-in">
                            <div v-if="orderflow_step == 1 &&
                              !tmp_cart.items.length &&
                              !tmp_domain_suggestion.items.length &&
                              flow != 'orderdomain'">
                                <div class="row justify-content-left">
                                    <div class="col-8">
                                        <p class="summary-cart__item-type" v-if="flow === 'website'">Website {{ templateName }}</p>
                                        <p class="summary-cart__item-type" v-else-if="flow === 'mailhosting'">Mail Hosting {{ period[hosting.selected.period].text }}</p>
                                        <p class="summary-cart__item-type" v-else-if="flow === 'vps' && plan_type === 'cpanel'">VPS cPanel {{ period[vps.selected.period].text }}</p>
                                        <p class="summary-cart__item-type" v-else-if="flow === 'vps'">Cloud VPS {{ period[vps.selected.period].text }}</p>
                                        <p class="summary-cart__item-type" v-else-if="flow === 'vps_kvm'">VPS KVM {{ period[vps_kvm.selected.period].text }}</p>
                                        <p class="summary-cart__item-type" v-else>Hosting {{ period[hosting.selected.period].text }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <p class="summary-cart__item-title" v-if="flow === 'website'">{{ period[hosting.selected.period].text }}</p>
                                        <p class="summary-cart__item-title" v-else-if="flow === 'vps'">{{ vps.selected.plan.title }}</p>
                                        <p class="summary-cart__item-title" v-else-if="flow === 'vps_kvm'">{{ vps_kvm.selected.plan.title }}</p>
                                        <p class="summary-cart__item-title" v-else>{{ hosting.selected.plan.title }}</p>
                                    </div>
                                    <div class="col-6">             
                                        <div v-if="flow != 'vps' && flow != 'vps_kvm'">
                                            <p v-if="flow === 'website' && hosting.plan_period[hosting.selected.period].discount_enabled == 1" id="hosting-package-price" class="summary-cart__item-price">Rp. {{ hosting.plan_period[hosting.selected.period].discount_price | formatPrice }}</p>
                                            <p v-else-if="flow === 'website'" id="hosting-package-price" class="summary-cart__item-price">Rp. {{ hosting.plan_period[hosting.selected.period].price | formatPrice }}</p>
                                            <p v-else-if="hosting.plan_period[hosting.selected.period].discount_enabled == 1" class="summary-cart__item-price">Rp. {{ hosting.plan_period[hosting.selected.period].discount_price | formatPrice }}</p>
                                            <p v-else id="hosting-package-price" class="summary-cart__item-price">Rp. {{ hosting.plan_period[hosting.selected.period].price | formatPrice }}</p>
                                        </div>
                                        <div v-else-if="flow === 'vps_kvm'">
                                            <p v-if="vps_kvm.plan_period[vps_kvm.selected.period].discount_enabled == 1" class="summary-cart__item-price">Rp. {{ vps_kvm.plan_period[vps_kvm.selected.period].discount_price | formatPrice }}</p>
                                            <p v-else id="hosting-package-price" class="summary-cart__item-price">Rp. {{ vps_kvm.plan_period[vps_kvm.selected.period].price | formatPrice }}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="vps.plan_period[vps.selected.period].discount_enabled == 1" class="summary-cart__item-price">Rp. {{ vps.plan_period[vps.selected.period].discount_price | formatPrice }}</p>
                                            <p v-else id="hosting-package-price" class="summary-cart__item-price">Rp. {{ vps.plan_period[vps.selected.period].price | formatPrice }}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                            </div>
                        </transition>
                        <p class="summary-cart__item-type">Pajak &amp; Biaya Tambahan</p>
                        <div class="row">
                            <div class="col-7">
                                <p class="summary-cart__item-title">{{ taxName }}</p>
                            </div>
                            <div class="col-5">
                                <p class="summary-cart__item-price text-right">Rp. {{ (Number(tmp_cart.total) + Number(tmp_domain_suggestion.total) + Number(tmp_additional.total)) * taxRate | formatPrice }}</p>
                            </div>
                        </div>
                        <div v-if="coupon_code">
                            <hr>
                            <div class="row mb-2">
                                <div class="col-8">
                                    <p class="summary-cart__item-type">Kode Kupon yang digunakan</p>
                                </div>
                                <div class="col-4">
                                    <p class="font-size-18 text-right" @click="removeCoupon()"><span class="fa fa-times remove-item"></span></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-9">
                                    <p class="summary-cart__item-title summary-cart__item-title--kupon">{{ coupon_code }}</p>
                                </div>
                            </div>
                        </div>
                    </div>                   
                </div>
                <div class="summary-cart__total">
                    <div class="row align-items-center">
                        <div class="col-3 col-lg-3">
                            <p class="summary-cart__total-title">TOTAL</p>
                        </div>
                        <div class="col-8 col-lg-9">
                            <p class="summary-cart__total-price">Rp. {{ 
                                (Number(tmp_cart.total) + Number(tmp_domain_suggestion.total) + Number(tmp_additional.total)) + ((Number(tmp_cart.total) + Number(tmp_domain_suggestion.total) + Number(tmp_additional.total)) * taxRate) | formatPrice }} <span class="badge badge-pill badge-light d-inline d-lg-none float-right">{{ tmp_cart.items.length + tmp_domain_suggestion.items.length + tmp_additional.items.length}}</span>
                            </p>
                        </div>
                        <a href="javascript:void(0);" v-on:click="show_summary_cart = !show_summary_cart" class="col-1 d-block d-lg-none pl-0" aria-label="cart">
                            <span v-if="show_summary_cart" class="fa fa-angle-up"></span>
                            <span v-else class="fa fa-angle-down"></span>
                        </a>
                    </div>
                </div>      
            </div> 
            <div v-if="nextStep" id="checkout-button-wrapper" class="d-none d-lg-block" style="height: 48px;">
              <div id="checkout-button">
                  <a @click="nextOrderflowStep" @click.prevent="btnNextDisabled" href="javascript:void(0)" class="button-default button-block nunito-bold font-size-16" :class="btnNextDisabled ? 'button-disabled' : 'button-blue' ">Lanjutkan</a>
              </div>
            </div>
        </div>      
    </section>
</template>

<script>
import CommonMethods from '../CommonMethods';
    export default {
        name: "NewSectionSummary",
        props: ['tmp_cart', 'tmp_domain_suggestion', 'orderflow_step', 'hosting', 'vps', 'vps_kvm', 'hostname', 'tmp_additional', 'flow', 'is_hosting_selected', 'is_only_domain', 'coupon_code', 'cart', 'plan_type'],
        data : function () {
            return {
                period: CommonVar.period,
                show_summary_cart: false,
                templateName : localStorage.getItem('website-template-name'),
                templatePrice: localStorage.getItem('website-template-price'),
                tmp_addon_period : '',
                btn_next_disabled: false,
                taxRate: 0,
                taxName: '',
            }
        },
        computed: {
          tmpCart() {
            let items = this.tmp_cart.items.concat(this.tmp_domain_suggestion.items);
            return items.filter(item => {
              return item.id != 1
            })
          },
          tmpAdditionalItems() {
            let additionalItems = this.tmp_additional.items.filter(item => {
              return item.id != undefined
            })
            if (this.checkFreeSslInCart()) {
                additionalItems.push(this.checkFreeSslInCart())
            }
            return additionalItems
          },
          nextStep() {
            let step = false;
            if (
              (this.orderflow_step != 3 && this.flow != 'orderdomain' && this.tmp_cart.items.length) ||
              (this.orderflow_step == 1 && this.flow == 'orderdomain' && this.is_hosting_selected &&
                (this.tmp_cart.items.length || this.tmp_domain_suggestion.items.length)) ||
              (this.orderflow_step != 1 && this.orderflow_step != 3 &&
                (this.tmp_cart.items.length || this.tmp_domain_suggestion.items.length)) ||
              (this.orderflow_step == 1 && this.flow == 'vps' && (this.tmp_cart.items.length && this.hostname.length)) ||
              (this.orderflow_step == 1 && this.flow == 'vps_kvm' && this.tmp_cart.items.length)
            ) {
              step = true
            }
            return step;
          },
          btnNextDisabled(){
            return this.btn_next_disabled;
          }
        },
        filters: {
            formatPrice(value) {
               return CommonMethods.formatPrice(value)
            }
        },
        methods: {
          itemType(item) {  
            let itemType = 'Domain';
            if (
              item.type === 'hosting'
              && ( this.flow === 'hosting' || 
                this.flow === 'cloudhosting' || 
                this.flow === 'orderdomain' )
            ) {
              itemType = 'Hosting ' + item.period_text;
            } else if (item.type === 'hosting' && this.flow === 'website') {
              itemType = item.title
            } else if (item.type === 'hosting' && this.flow === 'mailhosting') {
              itemType = 'Mail Hosting ' + item.period_text;
            } else if (item.type === 'domain' && item.action === 'transfer') {
              itemType = 'Transfer Domain'
            } else if (this.flow === 'vps' && this.plan_type === 'cpanel') {
              if (item.type === 'cpanel_license') {
                itemType = `Control Panel ${item.period_text}`
              } else {
                itemType = 'VPS cPanel ' + item.period_text
              }              
            } else if (this.flow === 'vps') {
              itemType = 'Cloud VPS ' + item.period_text
            } else if (this.flow === 'vps_kvm') {
              itemType = 'VPS KVM ' + item.period_text
            }
            return itemType;
          },
            nextOrderflowStep() {
              if (! this.btn_next_disabled) {
                if (this.flow == 'orderdomain' && this.orderflow_step == 1 && !this.is_only_domain) {
                  bus.$emit('add-hosting-to-cart');
                } else {
                  bus.$emit('next-orderflow-step');
                }
              }             
            },
            checkUrlPath(path) {
                let urlPath;
                urlPath = window.location.pathname.split('/');
                return urlPath.includes(path);
            },
            removeFromCart(item, productType) {
                bus.$emit('show-add-to-chart', true)
                bus.$emit('show-spinner', true);                

                if( this.flow == 'vps' || this.flow == 'vps_kvm' ) {
                    const key = productType === 'vps' ? 'tmp_cart': 'tmp_additional';
                    bus.$emit('remove-from-cart', key, item.id);
                    bus.$emit('show-spinner', false);
                    if (
                        key === 'tmp_additional' && 
                        item.title.includes('cPanel')
                      ) {
                      bus.$emit('reset-plan-upgrade');
                      sessionStorage.setItem('os_template', null);
                    }
                    return false;
                }

                axios.post('/api/guest/remove_from_cart', {
                    id: item.id
                })
                .then( (res) => {   
                    if (this.flow === 'website') {
                        if (item.type === 'domain') {
                            window.location.href = CommonVar.niaga_url + 'order/website-instant/84';
                        } else if (item.type === 'hosting') {
                            window.location.href = CommonVar.niaga_url + 'membuat-website';
                        }
                    } else if (this.flow === 'vps') {
                        window.location.href = CommonVar.niaga_url + 'ordervps';
                    } else if (this.flow === 'vps_kvm') {
                        window.location.href = CommonVar.niaga_url + 'ordervps-kvm';
                    } else {
                        if (item.cart_type == 'tmp_hosting') {
                            sessionStorage.removeItem('tmp_cart_hosting');
                            sessionStorage.removeItem('tmp_cart_domain');
                        }

                        if (item.cart_type == 'tmp_domain') {
                            sessionStorage.removeItem('tmp_cart_domain');
                        }

                        if (sessionStorage.getItem('tmp_domain_suggestion_' + item.id)) {
                            sessionStorage.removeItem('tmp_domain_suggestion_' + item.id);
                        }
                        if (this.flow == 'orderdomain' && (item.type == 'domain' || item.type == 'hosting')) {
                          bus.$emit('remove-from-sesssion-storage', 'additional_feature_domainprivacy_');
                        }
                        if (item.type == 'domainprivacy') {
                          let domainPrivacyKey = this.orderflow_step == 1 ? CommonMethods.formatDomain(item.sld + item.tld, '_') : item.id;
                          sessionStorage.removeItem('additional_feature_domainprivacy_' + domainPrivacyKey)
                        }

                        bus.$emit('refresh-cart');
                        /* It will uncheck additional feature checkbox, the listener is on AdditionalFeature.vue */
                        bus.$emit('remove-item', item);

                        let action;
                        let tld;

                        if (item.type === 'domain') {
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
                })
                .finally( () => {
                    if (!this.tmp_cart.items.length && !this.tmp_domain_suggestion.items.length) {
                        location.reload();
                    }
                })
            },
            toUpperCase(str) {
                return str.toUpperCase();
            },
            adjustResize() {
                let cartWrapper = document.getElementById("summary-cart-wrapper");
                let cartElement = document.getElementById("summary-cart");
                let itemElement = document.getElementById("summary-cart__item");
                if (screen.width > 991) {
                    /*For Desktop*/
                    cartElement.style.width = cartWrapper.offsetWidth + "px";
                    if (screen.height < 768) {
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

            removeCoupon() {
                this.$root.$emit('remove-coupon');
            },
            checkFreeSslInCart() {
              let ssl;
              if (this.cart) {
                this.cart.items.forEach(item => {
                  if (item.product_id == 76 && item.free_ssl_hosting === true) {
                    ssl = item
                  }
                });
              }
              return ssl
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
            bus.$on('set-next-btn', (val) => {             
              this.btn_next_disabled = val;
            });
          }, 100);
        },
        created() {
            this.getTaxRate();

            if (this.flow == 'vps' && this.orderflow_step == 2) {
              if (sessionStorage.getItem('tmp_additional')) {
                this.tmp_additional = JSON.parse(sessionStorage.getItem('tmp_additional'))
              } else {
                this.tmp_additional = {
                    items: [],
                    total: 0
                };
              }
                let vps_plan          = JSON.parse(sessionStorage.getItem('vps_plan'));
                this.tmp_addon_period = vps_plan.period;
            }
            window.addEventListener('resize', () => {
                this.adjustResize();
            });
        },
    }
</script>
<style scoped>

</style>