<template>
    <div class="hosting-package">
        <p class="hosting-package__title">Website Instan</p>
        <div class="row">
            <div class="col-lg-4 col-7">
                <img class="hosting-package__website-image" :src="templateImage" alt="website-instan">
            </div>
            <div class="col-lg-8 col-5 pl-1">
                <div>
                    <span class="hosting-package__website-title">{{templateName}}</span><i aria-hidden="true" class="fas fa-check hosting-package__website-label"></i>
                </div>
                <div class="hosting-package__website-category">{{templateCategory}}</div>
                <div v-if="hosting.plan_period[hosting.selected.period].discount_price > 0">
                    <span class="hosting-package__website-price-number">Rp {{hosting.plan_period[hosting.selected.period].discount_price | formatPrice}}</span><span class="hosting-package__website-price-year">/{{ period[hosting.selected.period].text.toLowerCase().replace('1 ', '') }}</span>
                </div>
                <div v-else>
                    <span class="hosting-package__website-price-number">Rp {{hosting.plan_period[hosting.selected.period].price | formatPrice}}</span><span class="hosting-package__website-price-year">/{{ period[hosting.selected.period].text.toLowerCase().replace('1 ', '') }}</span>
                </div>
            </div>
        </div>
        <h3 class="hosting-package__title mt-2">Pilih Durasi Paket</h3>
        <div class="row no-gutters align-items-end ml-0 mr-0" :class="{'select--disabled': tmp_cart.items.length}">
            <div class="col-lg-3 hosting-duration gtmHostingPlan mb-4" v-for="(periodPrice, x) in hosting.plan_period" :key="x" v-if="periodPrice.enabled == 1 && x != '1M'" @click="chooseHostingPeriod(x)" :data-product="hosting.selected.plan.title" :data-period="x">
                <div class="hosting-duration__list" :class="{'hosting-duration--selected':hosting.selected.period == x}">
                    <p class="hosting-duration__discount" :class="{'button-white-orange': x == '3Y' && hosting.selected.period != x, 'hosting-duration__discount--normal': x != '3Y' || hosting.selected.period == x }" v-if="periodPrice.discount_enabled == 1">
                        Diskon {{ gimmick_discount != 'undefined' && x == '1Y' ? gimmick_discount : discountPrice(periodPrice.discount_price, periodPrice.price) }}%
                    </p>
                    <div class="hosting-duration__period mb-4">
                        <p class="hosting-duration__period-year hosting-duration--half">{{ period[x].text }}</p>
                        <p class="hosting-duration__period-price hosting-duration__period-price--light d-none d-lg-block" v-if="periodPrice.discount_enabled == 1">
                            <s>Rp. {{ periodPrice.price | formatPrice }}</s>
                        </p>

                        <p class="hosting-duration__period-price hosting-duration__period-price--bold hosting-duration--half" v-if="periodPrice.discount_enabled == 1">
                            Rp. {{ periodPrice.discount_price / period[x].num_of_month | formatPrice }}/bln
                        </p>

                        <p v-else class="hosting-duration__period-price hosting-duration__period-price--bold hosting-duration--half">
                            Rp. {{ periodPrice.price / period[x].num_of_month | formatPrice }}/bln
                        </p>

                        <p v-if="periodPrice.discount_enabled == 1" class="hosting-duration__period-price d-none d-lg-block">
                            Rp. {{ periodPrice.discount_price | formatPrice }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "WebsitePlan",
    props: ["hosting", 'tmp_cart', "flow"],
    data: function() {
        return {
            period: CommonVar.period,
            templateImage : localStorage.getItem('website-template-image'),
            templateCategory : localStorage.getItem('website-template-category'),
            templateName : localStorage.getItem('website-template-name'),
            gimmick_discount: localStorage.getItem('website-template-gimmick-discount'),
        }
    },
    filters: {
        formatPrice(value) {
            return CommonMethods.formatPrice(value)
        }
    },
    methods: {
        discountPrice(discount, price) {
            let discountPrice;
            discountPrice = Math.round((1 - (discount / price)) * 100);
            return discountPrice;
        },
        chooseHostingPeriod(period) {
            this.hosting.selected.period = period;
            this.$emit('update-hosting-plan', this.hosting);
            setTimeout(() => {
                bus.$emit('virtual-page-view', 'package-selection');
            }, 500);
        },
        checkData() {
            var value = localStorage.getItem('website-template-id')
            var selectedpricing = localStorage.getItem('website-template-price-selected')
            if (! value) {
                window.location.href = "/membuat-website"
            }
            if (! selectedpricing || selectedpricing == 'undefined') {
                selectedpricing = '1Y'
            }
            
            this.hosting.selected.period = selectedpricing
            this.$emit('update-hosting-plan', this.hosting)
            setTimeout(() => {
                bus.$emit('virtual-page-view', 'package-selection');
            }, 500);
        }
    },
    mounted(){
        this.checkData()
    }
}
</script>

<style scoped>
    .custom-size {
        font-size: 30px;
        font-weight: 900;
        margin-bottom: 50px;
    }
</style>