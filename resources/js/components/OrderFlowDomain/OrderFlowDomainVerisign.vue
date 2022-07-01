<template>
    <div class="orderflow-wrapper">
        <div v-if="show_spinner" class="spinner">
            <img v-bind:src="asset_url + '/spinner.gif'" alt="spinner">
        </div>
        <div class="container">
            <div class="mar_top3"></div>
            <div class="col-md-12">
                <div class="section-domain">
                    <div class="section-body">
                        <div class="product-plan">
                            <div class="col-md-3 col-sm-12 text-center">
                                <img class="img-responsive" v-bind:src="asset_url + '/orderflow/web-hosting.png'">
                            </div>
                            <div class="col-md-5 col-sm-12">
                                <span class="nunito-regular color-4d5872 font-size-18">
                                    Selamat, domain :
                                </span>

                                <div class="mar_top2"></div>

                                <h3 class="nunito-bold color-4d5872 font-size-24">
                                    <b>{{ sld + tld | title }}</b>
                                    <input type="hidden" v-model="domain_config.domain">
                                </h3>

                                <div class="mar_top2"></div>
                                <span class="nunito-regular color-4d5872 font-size-16">
                                    telah Anda pesan. Silahkan <b>pilih durasi</b> serta lakukan<br> <b>login/registrasi</b> untuk menyelesaikan pemesan Anda.
                                </span>

                                <div class="mar_top2"></div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <span class="nunito-regular font-size-18">Durasi : </span>
                                        <select id="domain_period" class="select-period nunito-bold font-size-18 color-4d5872"
                                                                    v-if="orderflow_step != 2"
                                                                    v-model="domain_config.period"
                                                                    v-on:change="chooseDomainPeriod">
                                            <option value="1">1 Tahun</option>
                                            <option value="2">2 Tahun</option>
                                            <option value="3">3 Tahun</option>
                                        </select>
                                        <span v-if="orderflow_step == 2" class="nunito-bold font-size-18 color-4d5872">{{ domain_config.period }} Tahun</span>
                                        <span class="nunito-bold font-size-18 color-4d5872">Rp {{ formatPrice(domain.price) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <span class="nunito-regular color-4d5872 font-size-18">
                                    <b>Review Domain : </b>
                                </span>

                                <div class="mar_top3"></div>

                                <div class="row nunito-regular color-4d5872 font-size-16">
                                    <div class="col-md-5 col-xs-5">Subtotal : </div>
                                    <div class="col-md-7 col-xs-7 text-right">
                                        <b>Rp {{ formatPrice(domain.price) }}</b>
                                    </div>
                                </div>

                                <div class="mar_top1"></div>

                                <div class="row nunito-regular color-4d5872 font-size-16">
                                    <div class="col-md-5 col-xs-5">PPN (10%) : </div>
                                    <div class="col-md-7 col-xs-7 text-right">
                                        <b>Rp {{ formatPrice(domain.price * 0.1) }}</b>
                                    </div>
                                </div>

                                <div class="mar_top2"></div>

                                <div class="row nunito-bold color-4d5872 font-size-18">
                                    <div class="col-md-5 col-xs-5"><b>TOTAL</b></div>
                                    <div class="col-md-7 col-xs-7 color-4d5872 text-right">
                                        <b class="niaga-azure">Rp {{ formatPrice(domain.price * 1.1) }}</b>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <client-information-verisign v-if="orderflow_step == 1 && ! client"
                                             v-on:set-client="client = $event"
                                             v-on:add-domain-to-cart="addDomainToCart"
                                             v-on:set-orderflow-step="orderflow_step = $event"
                                             ref="foo">
                </client-information-verisign>

                <payment-method v-if="orderflow_step == 2"
                                v-bind:cart="cart"
                                v-on:choose-payment-method="gateway_id = $event" >
                </payment-method>

                <div class="col-md-offset-9 col-md-3">
                    <a v-if="orderflow_step == 2 && client && cart.items.length" @click="checkoutNow()" href="javascript:void(0)" style="margin-top: 32px" class="button-default button-block button-white-blue nunito-bold font-size-16">Checkout Sekarang</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ClientInformationVerisign from './ClientInformationVerisign.vue';
    import Vue from 'vue';
    import Method from './method';

    Vue.use(ClientInformationVerisign);

    export default {
        data () {
            return {
                domain: {
                    price: 125000,
                    first_year_registration: 125000,
                    price_registration: 125000,
                    price_renew: 125000,
                },

                client: false,

                check_password: {
                    min_char: false,
                    no_space: false,
                    lowercase: false,
                    uppercase: false,
                    number: false,
                },

                domain_config: {
                    action: 'register',
                    domain: '',
                    register_sld: '',
                    register_tld: '.com',
                    owndomain_sld: '',
                    owndomain_tld: '.com',
                    register_years: 1,
                    product_id: 1,
                    period: '1',
                },

                cart: {
                    items:[],
                },

                gateway_id: 1,

                orderflow_step: 1,

                show_spinner: false,
            }
        },
        props: [
            'asset_url',
            'sld',
            'tld'
        ],
        methods: {
            ...Method
        },
        mounted: function() {
            this.getComPricing();
            window.addEventListener('message', (msg) => {
                if (msg.data.task == 'login') {
                    this.client = true;
                    this.addDomainToCart();
                    this.orderflow_step = 2;
                }
            });
            this.$on('show-spinner', (status) => {
               this.show_spinner = status;
            });
        },
        components: {
            ClientInformationVerisign
        },
    }

    window.CallParent = () => {
       location.reload();
    }
</script>
