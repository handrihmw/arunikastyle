<template>
    <div class="section-hosting">
        <div class="section-title">
            <h3 class="nunito-bold font-size-24 color-4d5872">WEB HOSTING</h3>
        </div>
        <div class="section-body">
            <div class="product-plan">
                <p class="nunito-regular font-size-16 color-4d5872">Paket Hosting Anda</p>
                <div class="custom-select">
                    <div ref="select-plan" class="selected-item" v-bind:class="{'show-option':show_hosting_plan_select_option}" @click="showHideHostingPlanSelectOption()">
                        <p>
                            <b>Paket Hosting {{ hosting.selected.plan.title }}</b>
                            <span v-if="hosting.selected.product_id == 24"> <b>-</b> Tanpa Gratis Domain</span>
                            <span v-else=""> <b>-</b> Gratis Domain</span>
                        </p>
                    </div>
                    <ul v-if="show_hosting_plan_select_option" class="select-option" v-closable="{exclude: ['select-plan'], handler: 'onClose'}">
                        <li v-for="plan in hosting.plans" @click="chooseHostingPlan(plan)">
                            <b>Paket Hosting {{ plan.title }}</b>
                            <span v-if="plan.id == 24"> <b>-</b> Tanpa Gratis Domain</span>
                            <span v-else=""> <b>-</b> Gratis Domain</span>
                        </li>
                    </ul>
                </div>
                <div class="mar_top2"></div>
                <p class="nunito-regular font-size-16 color-4d5872">Pilih Durasi Paket Anda</p>
                <div>
                    <ul class="hosting-duration">
                        <li v-for="(periodPrice, x) in hosting.plan_period" v-if="periodPrice.enabled == 1 && x != '1M'"
                            @click="chooseHostingPeriod(x)" v-bind:class="{'selected':hosting.selected.period == x}">

                            <div v-if="periodPrice.discount_enabled == 1" class="ribbon">
                                <p class="nunito-bold font-size-21">Diskon {{ Math.ceil((1 - (periodPrice.discount_price / periodPrice.price)) * 100) }}%</p>
                                <p class="nunito-regular font-size-18">
                                    <s>Rp. {{ formatPrice(periodPrice.price) }}</s>
                                </p>
                            </div>

                            <div class="text-center">
                                <h3 class="nunito-bold font-size-21">{{ period[x].text }}</h3>

                                <p v-if="periodPrice.discount_enabled == 1" class="nunito-bold font-size-18">
                                    Rp. {{ formatPrice(periodPrice.discount_price) }}
                                </p>

                                <p v-else="periodPrice.discount_enabled" class="nunito-bold font-size-18">
                                    Rp. {{ formatPrice(periodPrice.price) }}
                                </p>

                                <p v-if="periodPrice.discount_enabled == 1" class="nunito-regular font-size-13">
                                    Rp {{ formatPrice(periodPrice.discount_price / period[x].num_of_month) }}/bln
                                </p>
                                <p v-else class="nunito-regular font-size-14">
                                    Rp {{ formatPrice(periodPrice.price / period[x].num_of_month) }}/bln
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <hr>
                <div class="note" v-if="flow === 'hosting'">
                    <p v-if="hosting.selected.product_id == 24 || hosting.selected.product_id == 25 && hosting.selected.period == '6M'" class="nunito-bold font-size-20 color-fbbd0e">
                        <span class="fa fa-exclamation-triangle" style="margin-right: 10px"></span>
                        Perhatian!
                    </p>
                    <p v-else="" class="nunito-bold font-size-20 color-fbbd0e">
                        <span class="fa fa-exclamation-triangle" style="margin-right: 10px"></span>
                        Selamat!
                    </p>

                    <p v-if="hosting.selected.product_id == 24" class="nunito-regular font-size-16 color-4d5872">
                        <b>Paket Bayi belum termasuk domain gratis.</b> Gunakan Paket <b>Pelajar</b>, <b>Personal</b>, atau <b>Bisnis</b> dengan masa berlangganan
                        <b>minimal 12 bulan</b> untuk mendapatkan <b>domain gratis</b> sekarang.
                    </p>

                    <p v-if="hosting.selected.product_id == 25 && hosting.selected.period == '6M'" class="nunito-regular font-size-16 color-4d5872">
                        Anda <b>belum mendapatkan</b> domain gratis. Dapatkan <b>domain gratis</b> hanya dengan berlangganan paket hosting selama <b>minimal 12 bulan</b>.
                    </p>

                    <p v-if="hosting.selected.product_id > 25 || hosting.selected.product_id == 25 && hosting.selected.period != '6M'" class="nunito-regular font-size-16 color-4d5872">
                        Selamat, Anda berhak mendapatkan <b>domain gratis</b>. Silakan pilih sendiri <b>domain gratis</b> yang Anda inginkan.
                    </p>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HostingPlan",
        props: ['hosting', 'flow'],
        data: function () {
            return {
                period: CommonVar.period,
                show_hosting_plan_select_option: false,
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
            },
            chooseHostingPeriod(period) {
                this.hosting.selected.period = period;
                this.$emit('update-hosting-plan', this.hosting);
            },
            formatPrice(value) {
                value = Math.round(value);
                let val = (value/1).toFixed(2).replace('.', ',');
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            onClose() {
                this.show_hosting_plan_select_option = false;
            },
            setHostingPlanByPath() {
                let path = window.location.pathname;
                path = path.split("/");
                if (path.length == 3) {
                    let productId = path[2];
                    this.hosting.plans.forEach((plan) => {
                        if (plan.id == productId) {
                            this.chooseHostingPlan(plan);
                            this.show_hosting_plan_select_option = false;
                            return;
                        }
                    });

                    const urlParams = new URLSearchParams(window.location.search);
                    let period = (urlParams.get('period')) ? urlParams.get('period') : "1Y";
                    this.chooseHostingPeriod(period);
                }

            }
        },
        mounted: function () {
            this.setHostingPlanByPath();
        }
    }
</script>

<style scoped>

</style>
