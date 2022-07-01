<template>
    <div class="vps-package">
        <p class="vps-package__title">Paket VPS KVM</p>
        <div class="vps-select" :class="{'select--disabled': tmp_cart.items.length}">
            <div ref="select-plan" class="vps-select__item" :class="{'vps-select--show-option':show_vps_plan_select_option}" @click="VpsPlanToogle()">
                <p><strong>Paket {{ vps_kvm.selected.plan.title }} -</strong> {{ description(vps_kvm.selected.plan.id) }}</p>
            </div>
            <transition name="fade" mode="out-in">
                <ul v-if="show_vps_plan_select_option" class="vps-select__option"
                    v-closable="{exclude: ['select-plan'], handler: 'onClose'}">
                    <li v-for="plan in vps_kvm.plans" :key="plan.id" @click="choosevpsPlan(plan)">
                        <strong>Paket {{ plan.title }} -</strong> {{ description(plan.id) }}
                    </li>
                </ul>
            </transition>
        </div>
        <h3 class="vps-package__title mt-2 text-capitalize">pilih durasi paket</h3>
        <div class="row no-gutters align-items-end ml-0 mr-0" :class="{'select--disabled': tmp_cart.items.length}">
            <template v-for="(periodPrice, x) in vps_kvm.plan_period">
                <div class="col-lg-3 vps-duration gtmvpsPlan mb-4" 
                    :key="x"
                    v-if="period[x]"
                    @click="choosevpsPeriod(x)" 
                    :data-product="vps_kvm.selected.plan.title" 
                    :data-period="x">
                    <div class="vps-duration__list" :class="{'vps-duration--selected':vps_kvm.selected.period == x}">
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
export default {
    name: "VpsPlan",
    props: ['vps_kvm', 'tmp_cart'],
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
                this.vps_kvm.plans.forEach((plan) => {
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
            this.vps_kvm.plan_period = plan.pricing.recurrent;
            this.vps_kvm.selected.product_id = plan.id;
            this.vps_kvm.selected.plan = plan;
            this.vps_kvm.selected.period = '1Y';
            this.VpsPlanToogle();
            this.$emit('update-vps-plan', this.vps_kvm);
            this.sendTracking();
        },
        choosevpsPeriod(period) {
            this.vps_kvm.selected.period = period;
            this.$emit('update-vps-plan', this.vps_kvm);
            this.sendTracking();
        },
        sendTracking() {
            const windowsIds = ['124', '125', '126', '127', '128', '129'];
            let tracking = 'OrderVPSKVM_ChooseLinux_';
            if (windowsIds.includes(this.vps_kvm.selected.plan.id)) {
              tracking = 'OrderVPSKVM_ChooseWindows_';
            }

            let title = this.vps_kvm.selected.plan.title
              .replace('VPS', '')
              .replace('Windows', '')
              .replace('Premium', '')
              .replace('Power', '')
              .trim()
              .replace(' ', '')
              .toLowerCase();
            title = title.charAt(0).toUpperCase() + title.slice(1);
            
            Gtm.trackingClickCTA('Click CTA', tracking + title + '_Period_' + this.vps_kvm.selected.period);
        },
        onClose() {
            this.show_vps_plan_select_option = false;
        },
        discountPrice(discount, price) {
            return Math.round((1 - (discount / price)) * 100);
        },
        description(productId) {
            let desc;
            this.vps_kvm.plans.forEach((plan) => {
              if (plan.id == productId) {
                  let core   = 'CPU ' + plan.config.plan.core + ' Core';
                  let memory = 'RAM ' + plan.config.plan.memory + ' GB';
                  let ssd    = 'SSD ' + plan.config.plan.disk_space + 'GB';
                  desc = core + ', ' + memory + ', ' + ssd;
                }
            });
            return desc;
        }
    },
    computed: {
    },
    mounted: function() {
        this.setVpsPlanByParams();
    }
}
</script>