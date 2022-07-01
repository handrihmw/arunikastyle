<template>
    <div class="section-additional-feature">
        <div class="section-title">
            <h3 class="nunito-bold font-size-24 color-4d5872">FITUR PENDUKUNG</h3>
        </div>
        <div class="section-body">
            <div class="product-plan">

                <div class="auto-install-wp addon">
                    <div @click="autoInstallWebsite" class="pretty-checkbox">
                        <input type="checkbox" name="auto_install_wp" value="1" v-model="additional_feature.auto_install_wp.selected"/>
                        <p class="checkbox-icon checkbox-title">Gratis Auto Install Website Wordpress</p>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            Kami akan menginstalkan website wordpress dengan theme premium dan plugin SEO secara gratis!
                        </p>
                    </div>
                    <div v-if="additional_feature.auto_install_wp.selected" @click="installWpAccelerator" class="install-wp-accelerator  pretty-checkbox">
                        <input type="checkbox" v-model="additional_feature.install_wp_accelerator.selected"/>
                        <p class="checkbox-icon checkbox-title">Wordpress Accelerator (LiteSpeed Cache)</p>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            Tambahkan plugin cache terbaik untuk mempercepat WordPress Anda yang hanya berjalan pada web server LiteSpeed Enterprise di Niagahoster
                        </p>
                    </div>
                </div>

                <div class="website-builder addon" v-if="show_weebly">
                    <div @click="addWeeblyToCart" class="pretty-checkbox">
                        <input type="checkbox" name="weebly" value="1" v-model="additional_feature.weebly.selected"/>
                        <p class="checkbox-icon checkbox-title">Rekomendasi Website Builder</p>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            <b>Weebly Cepat, Mudah, dan Tanpa Repot!</b> <br>
                        </p>
                        <div class="mar_top1"></div>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            Dengan integrasi aplikasi weebly, ciptakan halaman website pribadi dengan nama domain milik Anda
                        </p>
                    </div>
                    <div class="custom-select">
                        <div ref="select-weebly" class="selected-item" v-bind:class="{'show-option':show_weebly_plan_select_option}" @click="showHideWeeblyPlanSelectOption()">
                            <p>
                                <b>
                                    {{ additional_feature.weebly.plan.title }} - {{ formatPrice(additional_feature.weebly.plan.price) }} /
                                    {{ period[additional_feature.weebly.plan.period].unit }}
                                </b>
                            </p>
                        </div>
                        <ul v-if="show_weebly_plan_select_option" class="select-option" v-closable="{exclude: ['select-weebly'], handler: 'showHideWeeblyPlanSelectOption'}">
                            <li v-for="weebly in weebly_plans_parsed" @click="chooseWeeblyPlan(weebly)">
                                <b>{{ weebly.title }} - {{ formatPrice(weebly.price) }} / {{ period[weebly.period].unit }}</b>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="ssl addon">
                    <div @click="addRemoveSSLToCart" class="pretty-checkbox">
                        <input type="checkbox" name="ssl" value="1" v-model="additional_feature.ssl.selected"/>
                        <p class="checkbox-icon checkbox-title">Rekomendasi Keamanan</p>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            <b>SSL Certificate: Hanya Rp 125rb/domain per tahun</b><br>
                            Tingkatkan Kepercayaan Website bisnis dan toko online Anda dengan koneksi aman HTTPS
                        </p>
                    </div>
                    <div class="ssl-package" style="margin-top: 20px;">
                        <div class="pretty-select">
                            <select v-model="additional_feature.ssl.product_id" name="ssl_package">
                                <option v-for="ssl in ssl_plans" v-bind:value="ssl.id" >{{ ssl.title }}</option>
                            </select>
                            <span class="arrow fa fa-chevron-down"></span>
                        </div>
                    </div>
                </div>

                <div class="privacy-protection addon"
                     v-bind:class="{'no-click':!inArray(domain.tld, additional_feature.domainprivacy.valid_domain)}">
                    <div @click="addRemovePrivacyProtectionToCart" class="pretty-checkbox">
                        <input type="checkbox" name="privacy_protection" value="1" v-model="additional_feature.domainprivacy.selected"/>
                        <p class="checkbox-icon checkbox-title">Rekomendasi Privasi</p>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            <b>WHOIS Protection: Hanya Rp 45rb/domain per tahun</b><br>
                            Lindungi informasi pribadi Anda agar tidak jatuh ke tangan yang salah
                        </p>
                        <p class="checkbox-description nunito-regular font-size-16 color-4d5872">
                            - Sembunyikan nama, email, alamat, dan telepon dari informasi WHOIS  domain Anda<br>
                            - Cegah pembajakan dan spam ke domain Anda<br>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdditionalFeature",
        props: ['weebly_plans_parsed', 'ssl_plans', 'domain'],
        data() {
            return {
                period: CommonVar.period,
                show_weebly_plan_select_option: false,
                show_weebly: false,
                additional_feature: {
                    auto_install_wp: {
                        selected: false,
                        product_id: 69,
                        period: '1Y',
                        cart_product_id: '',
                    },
                    install_wp_accelerator: {
                        selected: false,
                    },
                    weebly: {
                        selected: false,
                        product_id: 29,
                        period: '1Y',
                        plan: {},
                        cart_product_id: '',
                    },
                    ssl: {
                        selected: false,
                        product_id: 76,
                        period: "1Y",
                        cart_product_id: '',
                    },
                    domainprivacy: {
                        selected: false,
                        product_id: 33,
                        period: "1Y",
                        cart_product_id: '',
                        valid_domain: ['.com', '.net', '.org', '.info'],
                    },
                },
            }
        },
        methods: {
            showHideWeeblyPlanSelectOption() {
                this.show_weebly_plan_select_option = !this.show_weebly_plan_select_option;
            },
            chooseWeeblyPlan(plan) {
                this.additional_feature.weebly.product_id = plan.id;
                this.additional_feature.weebly.period = plan.period;
                this.additional_feature.weebly.plan = plan;
                this.showHideWeeblyPlanSelectOption();
            },
            /* ADD ADDITIONAL FEATURE TO CART */
            autoInstallWebsite() {
                bus.$emit('show-spinner', true);
                this.additional_feature.auto_install_wp.selected = !this.additional_feature.auto_install_wp.selected;

                axios.post('/api/guest/add_remove_auto_install_website', {
                    is_add: this.additional_feature.auto_install_wp.selected
                })
                    .then( (res) => {
                        bus.$emit('refresh-cart');
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            installWpAccelerator() {
                bus.$emit('show-spinner', true);
                this.additional_feature.install_wp_accelerator.selected = !this.additional_feature.install_wp_accelerator.selected;

                axios.post('/api/guest/add_remove_install_wp_accelerator', {
                    is_add: this.additional_feature.install_wp_accelerator.selected
                })
                    .then( (res) => {
                        bus.$emit('refresh-cart');
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            addWeeblyToCart() {
                this.additional_feature.weebly.selected = !this.additional_feature.weebly.selected;
                if (this.additional_feature.weebly.selected) {
                    this.addAdditionalFeatureToCart('weebly', this.additional_feature.weebly.product_id, this.additional_feature.weebly.period);
                } else {
                    this.removeFromCart(this.additional_feature.weebly.cart_product_id, 'weebly');
                }
            },
            addRemoveSSLToCart() {
                this.additional_feature.ssl.selected = !this.additional_feature.ssl.selected;
                if (this.additional_feature.ssl.selected) {
                    this.addAdditionalFeatureToCart('ssl', this.additional_feature.ssl.product_id, this.additional_feature.ssl.period);
                } else {
                    this.removeFromCart(this.additional_feature.ssl.cart_product_id, 'ssl');
                }
            },
            addRemovePrivacyProtectionToCart() {
                this.additional_feature.domainprivacy.selected = !this.additional_feature.domainprivacy.selected;
                if (this.additional_feature.domainprivacy.selected) {
                    this.addAdditionalFeatureToCart('domainprivacy', this.additional_feature.domainprivacy.product_id,
                        this.additional_feature.domainprivacy.period);
                } else {
                    this.removeFromCart(this.additional_feature.domainprivacy.cart_product_id, 'domainprivacy');
                }
            },
            addAdditionalFeatureToCart(type, product_id, period) {
                bus.$emit('show-spinner', true);
                axios.post('/api/guest/add_additional_feature_to_cart', {
                    type: type,
                    product_id: product_id,
                    period: period,
                })
                    .then( (res) => {
                        let result = res.data.result;
                        this.additional_feature[result.type].cart_product_id = result.id;
                        bus.$emit('refresh-cart');
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            removeFromCart(cart_product_id, type) {
                bus.$emit('show-spinner', true);
                axios.post('/api/guest/remove_from_cart', {
                    id: cart_product_id
                })
                    .then( (res) => {
                        bus.$emit('refresh-cart');
                        if (type && this.additional_feature[type]
                            && this.additional_feature[type].cart_product_id === cart_product_id) {
                            this.additional_feature[type].selected = false;
                        }
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
            inArray(needle, haystack) {
                let length = haystack.length;
                for (let i = 0; i < length; i++) {
                    if (haystack[i] == needle) {
                        return true;
                    }
                }
                return false;
            },
        },
        created() {
            this.additional_feature.weebly.plan = this.weebly_plans_parsed[0];
        },
        mounted: function () {
            setTimeout(() => {
                bus.$on('remove-item', (item) => {
                    if (item.type && this.additional_feature[item.type]
                        && this.additional_feature[item.type].cart_product_id === item.id) {

                        this.additional_feature[item.type].selected = false;
                    }
                })
            }, 100);
        }
    }
</script>

<style scoped>

</style>
