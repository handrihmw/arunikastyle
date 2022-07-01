<template>
    <div class="orderflow-domain__result orderflow-domain__result--border-top orderflow-domain__result--border-bottom-none">
        <p class="orderflow-domain__suggestion-title">Pilihan Nama Domain Lainnya</p>
        <div class="orderflow-domain__suggestion pr-2">
            <div v-for="ds in domain_suggestion" :key="ds.name">
                <transition name="fade" mode="out-in">
                    <div v-if="ds.availability">
                        <div :class="{'select--disabled': ds.is_added_to_cart || is_loading}" class="row align-items-top mb-4">
                            <div class="col-md-5 col-sm-12">
                                <input :id="ds.name | formatDomain('_')" :checked="selected_domain_suggestion.includes(ds.name) || ds.is_added_to_cart"
                                :class="{
                                    'orderflow-custom-checkbox--checked': ds.is_added_to_cart,
                                    'orderflow-custom-checkbox--suggestion': flow == 'orderdomain',
                                    'orderflow-custom-checkbox--regular': flow != 'orderdomain'
                                }" class="orderflow-custom-checkbox gtmDomainSuggestion" :data-sld="ds.sld" :data-tld="ds.tld" type="checkbox">
                                <label @click="addDomainSuggestionToCart(ds)" @click.prevent="is_loading == true" :for="ds.name | formatDomain('_')">{{ ds.name.toLowerCase() }}</label>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="orderflow-domain__suggestion--period" :class="{'orderflow-domain__suggestion--period-bold':flow == 'orderdomain'}">
                                    <span>Durasi: </span>
                                    <select v-model="ds.pricing.min_years">
                                        <option value="1">1 Tahun</option>
                                        <option value="2">2 Tahun</option>
                                        <option value="3">3 Tahun</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-12 orderflow-domain__suggestion-price-wrapper">
                                <div class="orderflow-domain__suggestion-price">
                                    <p class=" mb-0" v-if="ds.pricing.allow_one_year_registration == 1">
                                        Rp {{ formatPrice( customPrice(ds.pricing.price_registration, ds.pricing.min_years, ds.pricing.first_year_registration) ) }}
                                    </p>
                                    <p class="mb-0" v-else>
                                        Rp {{ formatPrice(ds.pricing.price_registration * ds.pricing.min_years) }}
                                    </p>
                                    <s v-if="ds.pricing.allow_one_year_registration == 1">
                                        Rp {{ formatPrice(ds.pricing.price_registration * ds.pricing.min_years) }}
                                    </s>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import CommonMethods from '../../../CommonMethods';
export default {
    name: "DomainSuggestion",
    props: ["flow", "domain_suggestion", "domain", "tmp_additional", "tmp_domain_suggestion", "is_loading"],
    data: function() {
        return {
            selected_domain_suggestion: [],
            period: CommonVar.period,
        }
    },
    computed: {
        tmpDomainSuggestion() {
            return this.tmp_domain_suggestion.items.filter(item => {
                return item.id == 1
            })
        }
    },
    filters: {
        formatDomain(domain, sparator) {
            return CommonMethods.formatDomain(domain, sparator);
        }
    },
    methods: {
        customPrice(reg, years, first) {
            let customDiscountPrice;
            customDiscountPrice = (reg * years) - (reg - first);

            return customDiscountPrice;
        },
        addDomainSuggestionToCart(ds) {
            bus.$emit('add-domain-suggestion', ds);
            if (this.selected_domain_suggestion.includes(ds.name)) {
                this.selected_domain_suggestion = this.selected_domain_suggestion.filter(item => {
                    return item !== ds.name
                });
            } else {
                this.selected_domain_suggestion.push(ds.name);
            }
        },
        formatPrice(value) {
            return CommonMethods.formatPrice(value);
        }
    }
}
</script>
