<template>
    <div class="vps-package">
        <p v-if="plan_type === 'cyberpanel'" class="vps-package__title">Paket CyberPanel VPS</p>
        <p v-else-if="plan_type === 'cpanel'" class="vps-package__title">Paket VPS cPanel</p>
        <p v-else class="vps-package__title">Paket VPS</p>
        <div class="vps-select" :class="{'select--disabled': tmp_cart.items.length}">
            <div ref="select-plan" class="vps-select__item" :class="{'vps-select--show-option':show_vps_plan_select_option}" @click="VpsPlanToogle()">
                <p>
                  <strong v-if="plan_type === 'cpanel'">Paket {{ vps.selected.plan.title }}</strong>
                  <strong v-else>Paket {{ vps.selected.plan.title }} - {{ vps.selected.plan.description }}</strong>
                </p>
            </div>
            <transition name="fade" mode="out-in">
                <ul v-if="show_vps_plan_select_option" class="vps-select__option"
                    v-closable="{exclude: ['select-plan'], handler: 'onClose'}">
                    <li v-for="plan in vps.plans" :key="plan.id" @click="choosevpsPlan(plan)">
                        <strong v-if="plan_type === 'cpanel'">Paket {{ plan.title }} - Diskon {{ plan.discounts }}%</strong>
                        <strong v-else>Paket {{ plan.title }} - {{ plan.description }}</strong>
                    </li>
                </ul>
            </transition>
        </div>
        <h3 class="vps-package__title mt-2">Pilih Durasi Paket</h3>
        <div class="row no-gutters align-items-end ml-0 mr-0" :class="{'select--disabled': tmp_cart.items.length}">
            <template v-for="(periodPrice, x) in vps.plan_period" >
                <div class="col-lg-3 vps-duration gtmvpsPlan mb-4" 
                    :key="x"
                    v-if="period[x]"
                    @click="choosevpsPeriod(x)" 
                    :data-product="vps.selected.plan.title" 
                    :data-period="x">
                    <div class="vps-duration__list" :class="{'vps-duration--selected':vps.selected.period == x}">
                        <p class="vps-duration__discount" v-if="periodPrice.discount_enabled == 1" :class="{'vps-duration__discount--normal': discountPercent}">
                            Diskon {{ discountPrice(periodPrice.discount_price, periodPrice.price) }}%
                        </p>
                        <div class="vps-duration__period">

                            <p class="vps-duration__period-year vps-duration--half">{{ period[x].text }}</p>
                            <p class="vps-duration__period-price vps-duration__period-price--light d-none d-lg-block" v-if="periodPrice.discount_enabled == 1">
                                <s>{{ periodPrice.price | formatPrice }}</s>
                            </p>

                            <p class="vps-duration__period-price vps-duration__period-price--bold vps-duration--half" v-if="periodPrice.discount_enabled == 1">
                                {{ periodPrice.discount_price / period[x].num_of_month | formatPrice }}/bln
                            </p>

                            <p v-else class="vps-duration__period-price vps-duration__period-price--bold vps-duration--half">
                                {{ periodPrice.price / period[x].num_of_month | formatPrice }}/bln
                            </p>

                            <p class="vps-duration__period-price d-none d-lg-block" v-if="periodPrice.discount_enabled == 1">
                                {{ periodPrice.discount_price | formatPrice }}
                            </p>

                            <p class="vps-duration__period-price d-none d-lg-block" v-else>
                                {{ periodPrice.price | formatPrice }}
                            </p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import CommonMethods from '../../CommonMethods';
export default {
    name: "VpsPlan",
    props: ['vps', 'tmp_cart', 'plan_type'],
    data: function () {
        return {
            period: CommonVar.period,
            show_vps_plan_select_option: false
        }
    },
    methods: {
        setVpsPlanByParams() {
            let path = window.location.pathname;
            path = path.split("/");
            if (path.length == 3) {
                let productId = path[2];
                this.vps.plans.forEach((plan) => {
                    if (plan.id == productId) {
                        this.choosevpsPlan(plan);
                        this.show_vps_plan_select_option = false;
                        setTimeout(() => {
                            bus.$emit('virtual-page-view', 'package-selection');
                        }, 500);
                        return;
                    }
                });

                const urlParams = new URLSearchParams(window.location.search);
                let period = (urlParams.get('period')) ? urlParams.get('period') : "1Y";
                this.choosevpsPeriod(period);
            }
        },
        VpsPlanToogle() {
            this.show_vps_plan_select_option = !this.show_vps_plan_select_option;
        },
        choosevpsPlan(plan) {
            this.vps.plan_period = plan.pricing.recurrent;
            this.vps.selected.product_id = plan.id;
            this.vps.selected.plan = plan;
            this.vps.selected.period = '1Y';
            this.VpsPlanToogle();
            this.$emit('update-vps-plan', this.vps);
            this.sendTracking();
        },
        choosevpsPeriod(period) {
            this.vps.selected.period = period;
            this.$emit('update-vps-plan', this.vps);
            this.sendTracking();
        },
        sendTracking() {
            const cyberpanelIds = ['95', '96', '97', '98', '99', '100', '103', '104'];
            const cpanelIds = ['117', '118', '119', '120', '121', '122', '123'];
            if (cyberpanelIds.includes(this.vps.selected.plan.id)) {
              let title = this.vps.selected.plan.title.replace('CyberPanel', '').replace('VPS', '');
              title = this.capitalize(title);
              Gtm.trackingClickCTA('Click CTA', 'OrderVPSCyberpanel_Choose_' + title + '_Period_' + this.vps.selected.period);
            } else if (cpanelIds.includes(this.vps.selected.plan.id)) {
              let title = this.vps.selected.plan.title.replace('cPanel', '');
              title = this.capitalize(title);
              Gtm.trackingClickCTA('Click CTA', 'OrderVPScpanel_Choose_' + title + '_Period_' + this.vps.selected.period);
            } else {
              let title = this.capitalize(this.vps.selected.plan.title);
              Gtm.trackingClickCTA('Click CTA', 'OrderVPSOVZ_Choose_' + title + '_Period_' + this.vps.selected.period);
            }
        },
        capitalize(str) {
            str = str.trim().replace(' ', '').toLowerCase();
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        onClose() {
            this.show_vps_plan_select_option = false;
        },
        discountPrice(discount, price) {
            let discountPrice;
            discountPrice = Math.round((1 - (discount / price)) * 100);
            return discountPrice;
        },
        prepareVpsCpanel() {
            if (this.plan_type !== 'cpanel') {
                return;
            }
            let selfInstance = this;
            let vpsPlans     = this.vps.plans;
            Object.keys(vpsPlans).forEach(function(keys) {
                let discounts = 0;
                let pricing   = vpsPlans[keys].pricing.recurrent;
                Object.keys(pricing).forEach(function(key) {
                    if (pricing[key].discount_enabled == 1) {
                        let discount = selfInstance.discountPrice(pricing[key].discount_price, pricing[key].price);
                        if (discount > discounts) {
                            discounts = discount;
                        }
                    }
                });
                selfInstance.vps.plans[keys].discounts = discounts;
            });
        }
    },
    computed: {
    },
    mounted: function() {
        this.prepareVpsCpanel();
        this.setVpsPlanByParams();
    }
}
</script>