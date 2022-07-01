<template>
    <div class="hosting-package">
        <p class="hosting-package__title">Paket Hosting</p>
        <div class="hosting-select" :class="{'select--disabled': tmp_cart.items.length}">
            <div ref="select-plan" class="hosting-select__item" :class="{'hosting-select--show-option':show_hosting_plan_select_option}" @click="showHideHostingPlanSelectOption()">
                <p v-if="flow === 'mailhosting'">
                    <strong>Paket {{ hosting.selected.plan.title }}</strong>
                    <span> <strong>-</strong> {{ getMailHostingSubtitle(hosting.selected.product_id) }}</span>
                </p>
                <p v-else-if="is_wordpress_hosting">
                    <strong>WP {{ hosting.selected.plan.title }}</strong>
                    <span v-if="hosting.selected.product_id == 24"> <strong>-</strong> Tanpa Gratis Domain</span>
                    <span v-else> <strong>-</strong> Gratis Domain</span>
                </p>
                <p v-else>
                    <strong v-if="isEasyWordpress()">Paket {{ hosting.selected.plan.title }}</strong>
                    <strong v-else>Paket Hosting {{ hosting.selected.plan.title }}</strong>
                    <span v-if="hosting.selected.product_id == 24"> <strong>-</strong> Tanpa Gratis Domain</span>
                    <span v-else> <strong>-</strong> Gratis Domain</span>
                </p>
            </div>
            <transition name="fade" mode="out-in">
            <ul v-if="show_hosting_plan_select_option" class="hosting-select__option"
                v-closable="{exclude: ['select-plan'], handler: 'onClose'}">
                <div v-if="flow === 'mailhosting'">
                  <li v-for="plan in hosting.plans" :key="plan.id" @click="chooseHostingPlan(plan)">
                      <strong>Paket {{ plan.title }}</strong>
                      <span> <strong>-</strong> {{ getMailHostingSubtitle(plan.id) }}</span>
                  </li>
                </div>
                <div v-else-if="is_wordpress_hosting">
                  <li v-for="plan in hosting.plans" :key="plan.id" @click="chooseHostingPlan(plan)">
                      <strong>WP {{ plan.title }}</strong>
                      <span v-if="plan.id == 24"> <strong>-</strong> Tanpa Gratis Domain</span>
                      <span v-else> <strong>-</strong> Gratis Domain</span>
                  </li>
                </div>
                <div v-else>
                  <li v-for="plan in hosting.plans" :key="plan.id" @click="chooseHostingPlan(plan)">
                      <strong v-if="isEasyWordpress()">Paket {{ plan.title }}</strong>
                      <strong v-else>Paket Hosting {{ plan.title }}</strong>
                      <span v-if="plan.id == 24"> <strong>-</strong> Tanpa Gratis Domain</span>
                      <span v-else> <strong>-</strong> Gratis Domain</span>
                  </li>
                </div>
            </ul>
            </transition>
        </div>
        <div v-if="isEasyWordpress()">
            <h3 class="hosting-package__title mt-2">Pilih Theme {{ hosting.selected.plan.title }}</h3>
            <div class="row no-gutters align-items-end ml-0 mr-0">
                <div class="col-lg-3 hosting-duration gtmHostingPlan mb-4" 
                    v-for="(item, index) in easywp_themes[parseInt(this.hosting.selected.product_id)]" 
                    :key="index"
                    @click="easywp_selected_theme = item"
                >
                    <div class="hosting-duration__list easywp__theme" v-bind:class="{'easywp__theme--selected' : item.slug == easywp_selected_theme.slug}">
                        <div class="hosting-duration__period easywp__theme-box">
                            <img :src="item.image" class="w-100" alt="duration">
                            <p class="hosting-duration__period-price hosting-duration__period-price--bold hosting-duration--half">{{ item.name }}</p>
                            <p class="hosting-duration__period-price d-none d-lg-block">
                                Gratis
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h3 class="hosting-package__title mt-2">Pilih Durasi Paket</h3>
        <div class="row no-gutters align-items-end ml-0 mr-0" :class="{'select--disabled': tmp_cart.items.length}">
            <div class="col-lg-3 hosting-duration gtmHostingPlan mb-4" v-for="(periodPrice, x) in hosting.plan_period" :key="x" v-if="periodPrice.enabled == 1" @click="chooseHostingPeriod(x)" :data-product="hosting.selected.plan.title" :data-period="x">
                <div class="hosting-duration__list" :class="{'hosting-duration--selected':hosting.selected.period == x}">
                    <p class="hosting-duration__discount" v-if="periodPrice.discount_enabled == 1" :class="{'hosting-duration__discount--normal': discountPercent}">
                        Diskon {{ discountPrice(periodPrice.discount_price, periodPrice.price) }}%
                    </p>
                    <div class="hosting-duration__period">
                        <p class="hosting-duration__period-year hosting-duration--half">{{ period[x].text }}</p>
                        <p class="hosting-duration__period-price hosting-duration__period-price--light d-none d-lg-block" v-if="periodPrice.discount_enabled == 1">
                            <s>Rp. {{ periodPrice.price | formatPrice }}</s>
                        </p>

                        <p class="hosting-duration__period-price hosting-duration__period-price--bold hosting-duration--half" v-if="periodPrice.discount_enabled == 1">
                            Rp {{ periodPrice.discount_price / period[x].num_of_month | formatPrice }}/bln
                        </p>

                        <p v-else class="hosting-duration__period-price hosting-duration__period-price--bold hosting-duration--half">
                            Rp {{ periodPrice.price / period[x].num_of_month | formatPrice }}/bln
                        </p>

                        <p class="hosting-duration__period-price d-none d-lg-block" v-if="periodPrice.discount_enabled == 1">
                            Rp. {{ periodPrice.discount_price | formatPrice }}
                        </p>

                        <p class="hosting-duration__period-price d-none d-lg-block" v-else>
                            Rp. {{ periodPrice.price | formatPrice }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CommonMethods from '../../CommonMethods';
    export default {
        name: "HostingPlan",
        props: ['hosting', 'flow', 'tmp_cart', 'is_wordpress_hosting'],
        data: function () {
            return {
                period: CommonVar.period,
                show_hosting_plan_select_option: false,
                easywp_themes: {
                    92: [
                        {slug: 'astra', name: 'Blog Theme', image: 'https://niagaspace.sgp1.cdn.digitaloceanspaces.com/easywp/blog-theme-1641283423.png'}
                    ],
                    93: [
                        {slug: 'astra', name: 'Compro Theme', image: 'https://niagaspace.sgp1.cdn.digitaloceanspaces.com/easywp/compro-theme-1641283533.png'}
                    ],
                    94: [
                        {slug: 'astra', name: 'E-Commerce Theme', image: 'https://niagaspace.sgp1.cdn.digitaloceanspaces.com/easywp/ecommerce-theme-1641283607.png'}
                    ],
                },
                easywp_selected_theme: {}
            }
        },
        computed: {
            discountPercent() {
                if (CommonMethods.checkUrlPath('ordercloudhost')) {
                    return true
                }
            }
        },
        filters: {
            formatPrice(value) {
                return CommonMethods.formatPrice(value);
            }
        },
        methods: {
            showHideHostingPlanSelectOption() {
                this.show_hosting_plan_select_option = !this.show_hosting_plan_select_option;
            },
            chooseHostingPlan(plan) {
                this.hosting.plan_period = plan.pricing.recurrent;
                this.hosting.selected.product_id = plan.id;
                this.hosting.selected.plan = plan;
                this.hosting.selected.period = '1Y';
                this.showHideHostingPlanSelectOption();
                this.$emit('update-hosting-plan', this.hosting);

                if (this.isEasyWordpress()) {
                    this.easywp_selected_theme = this.easywp_themes[plan.id][0];
                }
                if (CommonMethods.checkUrlPath('orderhosting')) {
                    Gtm.trackingClickCTA('Click CTA', 'OrderHosting_ChooseHosting_' + plan.title);
                }
            },
            chooseHostingPeriod(period) {
                this.hosting.selected.period = period;
                this.$emit('update-hosting-plan', this.hosting);

                if (CommonMethods.checkUrlPath('orderhosting')) {
                    Gtm.trackingClickCTA('Click CTA', 'OrderHosting_ChooseHostingPeriod_' + period);
                }
                if (CommonMethods.checkUrlPath('ordercloudhost')) {
                    const title = this.hosting.selected.plan.title;
                    Gtm.trackingClickCTA('Click CTA', 'OrderHosting_ChooseHosting_' + title + '_Period_' + period);
                }
            },
            onClose() {
                this.show_hosting_plan_select_option = false;
            },
            setHostingPlanByPath() {
                let path = window.location.pathname;
                if (path.includes("v2")) {
                    path = path.slice(1);
                }
                path = path.split("/");
                if (path.length == 3) {
                    let productId = path[2];
                    this.hosting.plans.forEach((plan) => {
                        if (plan.id == productId) {
                            this.chooseHostingPlan(plan);
                            this.show_hosting_plan_select_option = false;
                            setTimeout(() => {
                              bus.$emit('virtual-page-view', 'package-selection');
                            }, 500);
                            return;
                        }
                    });

                    const urlParams = new URLSearchParams(window.location.search);
                    let period = (urlParams.get('period')) ? urlParams.get('period') : "1Y";
                    this.chooseHostingPeriod(period);
                }

            },
            discountPrice(discount, price) {
                let discountPrice;
                discountPrice = Math.round((1 - (discount / price)) * 100);
                return discountPrice;
            },
            getMailHostingSubtitle(id) {
              let subtitle = {
                53 : '25',
                54 : '50',
                55 : '100',
                130: '200'
              }
              return subtitle[id] + ' GB Disk Space, Akun Email Unlimited'
            },
            isEasyWordpress() {
                return [92,93,94].includes(parseInt(this.hosting.selected.product_id))
            }
        },
        mounted: function () {
            this.setHostingPlanByPath();

            if (this.isEasyWordpress()) {
                this.easywp_selected_theme = this.easywp_themes[parseInt(this.hosting.selected.product_id)][0];
            }
        },
        watch: {
            easywp_selected_theme: function(val) {
                bus.$emit('easywp-selected-theme', val)
            }
        }
    }
</script>

<style scoped>

</style>
