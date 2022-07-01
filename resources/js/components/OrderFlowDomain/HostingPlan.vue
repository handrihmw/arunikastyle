<template>
  <div id="hosting-package" class="hosting-package mt-5">
    <h2 class="hosting-package__title">Pilih Paket Unlimited Hosting</h2>
    <div class="hosting-select">
      <div ref="select-period" class="hosting-select__item"
        :class="{'hosting-select--show-option': show_hosting_plan_select_option}"
        @click="showHideHostingPlanSelectOption()"
      >
        <p>
          <strong>Durasi {{ period[hosting.selected.period].text }}</strong>
          <span v-if="hosting.selected.product_id == 24">
            <strong>-</strong> Tanpa Gratis Domain
          </span>
          <span v-else>
            <strong>-</strong> Gratis Domain 1 Tahun Pertama
          </span>
        </p>
      </div>
      <transition name="fade" mode="out-in">
        <ul v-if="show_hosting_plan_select_option" class="hosting-select__option"
          v-closable="{ exclude: ['select-period'], handler: 'onClose' }"
        >
          <li v-for="(periodPrice, x) in hosting.plan_period" :key="x" v-if="periodPrice.enabled == 1 && x != '1M'"
            @click="chooseHostingPeriod(x)"
            :data-product="hosting.selected.plan.title"
            :data-period="x"
          >
            <strong>Durasi {{ period[x].text }}</strong>
            <span v-if="hosting.selected.product_id == 24">
              <strong>-</strong> Tanpa Gratis Domain
            </span>
            <span v-else>
              <strong>-</strong> Gratis Domain 1 Tahun Pertama
            </span>
          </li>
        </ul>
      </transition>
    </div>
    <div class="hosting-plan row no-gutters align-items-end ml-0 mr-0" @click="isHostingSelected()">
      <div @click="isOnlyDomain" class="hosting-plan__list col-lg-3 gtmHostingPlan mb-4">
        <div :class="{ 'hosting-plan__list--selected': is_only_domain }" class="hosting-plan__inner">
          <h3 class="hosting-plan__title">Tanpa Hosting</h3>
          <p class="hosting-plan__info hosting-plan__info--only-domain d-none d-lg-block">Hanya Domain</p>
          <p class="hosting-plan__ssl d-none d-lg-block">Tanpa SSL Gratis</p>
          <p class="hosting-plan__info d-none d-lg-block">Pilih untuk membeli domain tanpa order hosting</p>
        </div>
      </div>
      <div v-for="plan in hostingPlans" :key="plan.id" @click="chooseHostingPlan(plan)"
        class="hosting-plan__list col-lg-3 gtmHostingPlan mb-4"
        :class="{'hosting-plan__list--selected-mobile':plan.id == hosting.selected.product_id}"
      >
        <div :class="{'hosting-plan__list--selected': plan.id == hosting.selected.product_id}"
          class="hosting-plan__inner"
        >
          <p class="hosting-plan__discount" :class="{ 'hosting-plan--bg-orange': plan.id == 26 }"
          v-if="hosting.selected.period != '6M'">
            Diskon
            {{
            discountPrice(
            plan.pricing.recurrent[hosting.selected.period].discount_price,
            plan.pricing.recurrent[hosting.selected.period].price
            )
            }}%
          </p>
          <h3 class="hosting-plan__title hosting-plan__title--margin-bottom">{{ plan.title }}</h3>
          <p v-if="plan.pricing.recurrent[hosting.selected.period].discount_enabled"
            class="hosting-plan__price d-none d-lg-block"
          >
            <s>Rp {{ plan.pricing.recurrent[hosting.selected.period].price | formatPrice }}</s>
          </p>
          
          <p v-if="plan.pricing.recurrent[hosting.selected.period].discount_enabled == 1" class="hosting-plan__sale-price">
            Rp {{ plan.pricing.recurrent[hosting.selected.period].discount_price / period[hosting.selected.period].num_of_month | formatPrice }}/bln
          </p>
          <p v-else class="hosting-plan__sale-price">
            Rp {{ plan.pricing.recurrent[hosting.selected.period].price / period[hosting.selected.period].num_of_month | formatPrice }}/bln
          </p>

          <p :class="{ 'hosting-plan--color-orange': plan.id == 26 }"
            class="hosting-plan__ssl hosting-plan__ssl--blue d-none d-lg-block"
          >Domain dan SSL Gratis</p>
          <p v-if="plan.id == 25" class="hosting-plan__info d-none d-lg-block">Budget Minimal, untuk Landing Page dan Blog Pribadi</p>
          <p v-if="plan.id == 26" class="hosting-plan__info d-none d-lg-block">Untuk Website UKM, Organisasi, Komunitas, dan Toko Online</p>
          <p v-if="plan.id == 27" class="hosting-plan__info d-none d-lg-block">Untuk Website Bisnis, Portal Berita, dan e-commerce</p>
          <p :class="'hosting-plan__detail-' + plan.slug" class="d-block d-lg-none">
            <i @click="toggleHostingDetail(plan)"
              :class="
                hosting.selected.show_detail &&
                plan.id == hosting.selected.product_id
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
              "
              class="fas"
            ></i>
          </p>
        </div>
        <div v-if="hosting.selected.show_detail && plan.id == hosting.selected.product_id"
          class="hosting-plan__detail d-block d-lg-none"
        >
          <p v-for="(details, x) in plan.plan_details" :key="x">{{ details }}</p>
        </div>
      </div>
    </div>
    <div class="hosting-plan-details d-none d-lg-block">
      <div class="row">
        <p @click="show_hosting_plan_details = !show_hosting_plan_details"
          :class="{'hosting-plan-details__action--show': show_hosting_plan_details}"
          class="hosting-plan-details__action col-lg-5 offset-lg-5"
        >Rincian Layanan Paket Unlimited Hosting</p>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="show_hosting_plan_details" class="row no-gutters justify-content-end">
          <div v-for="plan in hosting.plans" :key="plan.id" v-if="plan.id != 24"
            :class="'hosting-plan-details__' + plan.slug"
            class="col-lg-3"
          >
            <p v-for="(details, key) in plan.plan_details" :key="key" class="hosting-plan-details__item">{{ details }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import CommonMethods from "../../CommonMethods";
export default {
  name: "HostingPlan",
  props: ["hosting", "flow", "tmp_cart", "is_only_domain"],
  data: function() {
    return {
      period: CommonVar.period,
      show_hosting_plan_select_option: false,
      show_hosting_plan_details: false
    };
  },
  computed: {
    hostingPlans() {
      return Object.values(this.hosting.plans).filter(item => {
        return (
          item.pricing.recurrent[this.hosting.selected.period].enabled &&
          item.id != 24
        );
      });
    }
  },
  filters: {
    formatPrice(value) {
      return CommonMethods.formatPrice(value);
    }
  },
  methods: {
    showHideHostingPlanSelectOption() {
      this.show_hosting_plan_select_option = !this
        .show_hosting_plan_select_option;
    },
    chooseHostingPlan(plan) {
      this.$emit("is-only-domain", false);
      bus.$emit("update-domain-price", false);
      this.hosting.plan_period = plan.pricing.recurrent;
      this.hosting.selected.product_id = plan.id;
      this.hosting.selected.plan = plan;
      this.hosting.selected.sync_coupon = false
      this.$emit("update-hosting-plan", this.hosting);
      Gtm.trackingClickCTA('Click CTA', 'OrderDomain_ChooseHosting_' + plan.title);
    },
    chooseHostingPeriod(period) {
      this.hosting.selected.period = period;
      this.showHideHostingPlanSelectOption();
      this.$emit("update-hosting-plan", this.hosting);
      bus.$emit("update-domain-price", false);
      Gtm.trackingClickCTA('Click CTA', 'OrderDomain_ChooseHostingPeriod_' + period);
    },
    onClose() {
      this.show_hosting_plan_select_option = false;
    },
    discountPrice(discount, price) {
      let discountPrice;
      discountPrice = Math.round((1 - discount / price) * 100);
      return discountPrice;
    },
    isHostingSelected() {
      bus.$emit("is-hosting-selected", true);
    },
    setHostingPlanDetails() {
      let planDetails = {
        pelajar: [
          "Unlimited Disk Space",
          "Unlimited Bandwidth",
          "Unlimited Email Accounts",
          "Unlimited Databases",
          "10 Addon Domains",
          "Instant Backup",
          "Gratis Domain",
          "Gratis Unlimited SSL",
          "Free Premium Course"
        ],
        personal: [
          "Unlimited Disk Space",
          "Unlimited Bandwidth",
          "Unlimited Email Accounts",
          "Unlimited Databases",
          "Unlimited Addon Domains",
          "Instant Backup",
          "Gratis Domain",
          "Free Premium Course",
          "Akses SSH",
          "Gratis Unlimited SSL",
          "SpamAssassin Protection"
        ],
        bisnis: [
          "Unlimited Disk Space",
          "Unlimited Bandwidth",
          "Unlimited Email Accounts",
          "Unlimited Databases",
          "Unlimited Addon Domains",
          "Instant Backup",
          "Gratis Domain",
          "Free Premium Course",
          "Akses SSH",
          "Gratis Unlimited SSL",
          "SpamAssassin Mail Protection",
          "SpamExpert Protection",
          "Prioritas Layanan Support"
        ]
      };
      this.hosting.plans.forEach(plan => {
        plan["plan_details"] = planDetails[plan.slug];
      });
    },
    toggleHostingDetail(plan) {
      if (plan.id == this.hosting.selected.product_id) {
        this.hosting.selected.show_detail = ! this.hosting.selected.show_detail
        return
      }
      this.hosting.selected.show_detail = true
    },
    isOnlyDomain() {
      this.$emit("is-only-domain", true);
      this.hosting.selected.product_id = false;
      bus.$emit("update-domain-price", true);
      Gtm.trackingClickCTA('Click CTA', 'OrderDomain_NoHosting');
    }
  },
  mounted: function() {
    document.getElementById("hosting-package").scrollIntoView();
    this.hosting.selected.product_id = false;
    this.setHostingPlanDetails();
  }
};
</script>

<style scoped></style>
