<template>
    <div class="orderflow-domain__result orderflow-domain__result--border-top orderflow-domain__result--border-bottom-none">
        <p class="orderflow-domain__title color-007aff" role="button" @click="show = !show"><u role="button" >Lihat Nama Domain Lainnya</u></p>
        <div v-if="show" class="orderflow-domain__suggestion pr-2">
        <div v-for="ds in domain_suggestion" :key="ds.name">
        <transition name="fade" mode="out-in">
          <div v-if="ds.availability">
            <div :class="{'select--disabled': ds.is_added_to_cart}" class="row align-items-center mb-4">
                <div class="col-md-5">
                    <input :id="ds.name | formatDomain('_')" @change="onCheckDomain(ds.is_added_to_cart)" :checked="ds.is_added_to_cart"
                    :class="{
                        'orderflow-custom-checkbox--checked': ds.is_added_to_cart,
                        'orderflow-custom-checkbox--suggestion': flow == 'orderdomain',
                        'orderflow-custom-checkbox--regular': flow != 'orderdomain'
                      }" class="orderflow-custom-checkbox gtmDomainSuggestion" :data-sld="ds.sld" :data-tld="ds.tld" type="checkbox">
                    <label @click="addDomainSuggestionToCart(ds)" :for="ds.name | formatDomain('_')">{{ ds.name.toLowerCase() }} <i class="fas fa-check" aria-hidden="true"></i></label>
                </div>
                <div class="col-md-3">
                    <div class="orderflow-domain__suggestion--period" :class="{'orderflow-domain__suggestion--period-bold':flow == 'orderdomain'}">
                        <span>Durasi: </span>
                        <select v-model="ds.pricing.min_years">
                            <option value="1">1 Tahun</option>
                            <option value="2">2 Tahun</option>
                            <option value="3">3 Tahun</option>
                        </select>
                    </div>                
                </div>
                <div class="col-md-4">                                
                  <p :class="{'nunito--bold':flow == 'orderdomain'}" class="orderflow-domain__suggestion--price mb-0" v-if="ds.pricing.allow_one_year_registration == 1">
                      Rp. {{ formatPrice( customPrice(ds.pricing.price_registration, ds.pricing.min_years, ds.pricing.first_year_registration) ) }}
                  </p> 
                  <p :class="{'nunito--bold':flow == 'orderdomain'}" class="orderflow-domain__suggestion--price mb-0" v-else="">Rp. {{formatPrice( ds.pricing.price_registration * ds.pricing.min_years)}}</p>
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
    props: ["flow", "domain_suggestion", "domain", "tmp_additional", "tmp_domain_suggestion"],
    data: function() {
        return {
            show:false,
            period: CommonVar.period,
        }
    },
    computed: {
      inArray() {
        return (needle, haystack) => CommonMethods.inArray(needle, haystack);
      },
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
        },
        formatPrice(value) {
            value = Math.round(value);
            let val = (value / 1).toFixed(2).replace('.', ',');
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        onCheckDomain(v) {
          bus.$emit('show-add-to-chart', true)
        }
    },
    watch: {
      show:function(val) {
        bus.$emit('show-add-to-chart', val)
      }
    }
}
</script>