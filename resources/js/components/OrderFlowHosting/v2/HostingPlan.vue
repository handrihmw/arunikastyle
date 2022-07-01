<template>
    <section class="hosting-product">
        <h3 class="hosting-product__title">1. Pilih Paket Hosting</h3>
        <p class="hosting-product__subtitle">Silakan pilih salah satu paket hosting sesuai kebutuhan Anda</p>
        <div class="swiper-container hosting-product__swiper-container" :class="{'select--disabled': tmp_cart.items.length || is_loading}">
            <div class="swiper-wrapper align-items-end">
                <div v-for="plan in hosting.plans" :key="plan.id" @click="chooseHostingPlan(plan)" class="swiper-slide">
                    <div class="as-card-base as-card-base--full-width as-card-base--border as-card-base--no-boxshadow" :class="{'as-card-base--label':plan.id == 26, 'as-card-base--selected':hosting.selected.product_id == plan.id}">
                        <p v-if="plan.id == 26" class="as-card-base__label as-card-base__label--blue">Paling Laris</p>
                        <h3 class="as-card-base__title text-capitalize">{{ plan.title }}</h3>
                        <hr>
                        <ul class="as-card-icon__list" v-if="plan.id == 24">
                            <li class="as-card-icon__list-item">Tanpa Gratis Domain</li>
                            <li class="as-card-icon__list-item"><strong>15.000</strong> pengunjung/bulan</li>
                            <li class="as-card-icon__list-item"><strong>500 MB</strong> SSD Disk Space</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Bandwidth & Database</li>
                            <li class="as-card-icon__list-item">1 Email Account</li>
                            <li class="as-card-icon__list-item">1 Domain</li>
                        </ul>
                        <ul class="as-card-icon__list" v-else-if="plan.id == 25">
                            <li class="as-card-icon__list-item"><strong>Free domain</strong> 1 Tahun</li>
                            <li class="as-card-icon__list-item"><strong>60.000</strong> pengunjung/bulan</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> SSD Disk Space</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Bandwidth & Database</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Email Account</li>
                            <li class="as-card-icon__list-item"><strong>10 Addon Domain</strong></li>
                        </ul>
                        <ul class="as-card-icon__list" v-else-if="plan.id == 26">
                            <li class="as-card-icon__list-item"><strong>Free domain</strong> 1 Tahun</li>
                            <li class="as-card-icon__list-item"><strong>135.000</strong> pengunjung/bulan </li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> SSD Disk Space</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Bandwidth & Database</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Email Account</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Addon Domain</li>
                        </ul>
                        <ul class="as-card-icon__list" v-else>
                            <li class="as-card-icon__list-item">Tanpa Gratis Domain</li>
                            <li class="as-card-icon__list-item"><strong>180.000</strong> pengunjung/bulan</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> SSD Disk Space</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Bandwidth & Database</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Email Account</li>
                            <li class="as-card-icon__list-item"><strong>Unlimited</strong> Addon Domain</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="hosting-product__swiper-buttons">
                <div class="swiper-button-prev"><span></span></div>
                <div class="swiper-pagination hosting-product__dot"></div>
                <div class="swiper-button-next"><span></span></div>
            </div>
        </div>

        <h3 class="hosting-product__title">2. Pilih Durasi Paket</h3>
        <p class="hosting-product__subtitle">Silahkan pilih durasi paket sesuai kebutuhan Anda</p>
        <div class="swiper-container hosting-period mt-5" :class="{'select--disabled': tmp_cart.items.length || is_loading}">
            <div class="swiper-wrapper align-items-end">
                <div v-for="(periodPrice, x) in hosting.plan_period" :key="x" :data-product="hosting.selected.plan.title" :data-period="x" @click="chooseHostingPeriod(x)" v-if="periodPrice.enabled == 1" class="swiper-slide hosting-period__item">
                    <div class="as-card-base as-card-base--full-width as-card-base--border as-card-base--no-boxshadow mb-3" :class="{'as-card-base--label':periodPrice.discount_enabled == 1, 'as-card-base--selected':hosting.selected.period == x}">
                        <p v-if="periodPrice.discount_enabled == 1" class="as-card-base__label as-card-base__label--blue">
                            Diskon {{ discountPrice(periodPrice.discount_price, periodPrice.price) }}%
                        </p>
                        <p class="hosting-period__duration">{{ period[x].text }}</p>
                        
                        <p class="hosting-period__price-month as-mt-3" v-if="periodPrice.discount_enabled == 1">
                            {{ periodPrice.discount_price / period[x].num_of_month | formatPrice }}
                        </p>
                        <p class="hosting-period__price-month as-mt-3" v-else>
                            {{ periodPrice.price / period[x].num_of_month | formatPrice }}
                        </p>

                        <p class="hosting-period__desc as-mt-3">Total</p>
                        <p class="hosting-period__price-year" v-if="periodPrice.discount_enabled == 1">
                            {{ periodPrice.discount_price | formatPrice }}
                        </p>
                        <p class="hosting-period__price-year" v-else>
                            {{ periodPrice.price | formatPrice }}
                        </p>
                        <p class="hosting-period__price-strikethrough">
                            <s v-if="periodPrice.discount_enabled == 1">Rp {{ periodPrice.price | formatPrice }}</s>
                            <span v-else>&nbsp;</span>
                        </p>
                    </div>
                    <div class="hosting-period__price-renewal" :class="{'invisible': hosting.selected.period != x}">
                        Paket akan diperpanjang pada {{ period[x].num_of_month | nextRenewalDate }} dengan harga <strong>Rp {{ (periodPrice.price / period[x].num_of_month) | formatPrice }} per bln</strong>
                    </div>
                </div>
            </div>
            <div class="hosting-product__swiper-buttons mb-0">
                <div class="swiper-button-prev"><span></span></div>
                <div class="swiper-pagination hosting-product__dot"></div>
                <div class="swiper-button-next"><span></span></div>
            </div>
        </div>
    </section>
</template>

<script>
import CommonMethods from '../../../CommonMethods';
    export default {
        name: 'HostingPlan',
        props: ['hosting', 'flow', 'tmp_cart', 'is_loading'],
        data: function () {
            return {
                period: CommonVar.period,
            }
        },
        computed: {},
        filters: {
            formatPrice(value) {
                return CommonMethods.formatPrice(value);
            },
            nextRenewalDate(monthPeriod) {
                let dateNow = new Date();
                let dateNextRenewal = new Date(dateNow.setMonth(dateNow.getMonth() + monthPeriod));

                return dateNextRenewal.toLocaleDateString('id-id', { day:"numeric", month:"long", year:"numeric"});
            }
        },
        methods: {
            chooseHostingPlan(plan) {
                this.hosting.plan_period = plan.pricing.recurrent;
                this.hosting.selected.product_id = plan.id;
                this.hosting.selected.plan = plan;
                this.hosting.selected.period = '1Y';
                this.$emit('update-hosting-plan', this.hosting);
                Gtm.trackingClickCTA('Click CTA', 'OrderHosting_ChooseHosting_' + plan.title);
            },
            chooseHostingPeriod(period) {
                this.hosting.selected.period = period;
                this.$emit('update-hosting-plan', this.hosting);
                Gtm.trackingClickCTA('Click CTA', 'OrderHosting_ChooseHostingPeriod_' + period);
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
        },
        mounted: function () {
            this.setHostingPlanByPath();
        },
        watch: {}
    }
</script>
