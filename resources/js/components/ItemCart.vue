<template>
  <section class="item-cart">
    <div v-for="item in cart.items" :key="item.id" class="row no-gutters item-cart__list">
      <div class="col-10">
        <p class="item-cart__list-title">
          {{ itemTitle(item) }}
        </p>
        <p v-if="inArray(item.type, ['hosting', 'vpsme', 'cloudhosting'])">
          <span v-if="item.discount">
            <strike>{{ item.price | formatPrice }}</strike> {{ item.total | formatPrice }} ({{ item.total / period[item.period].num_of_month | formatPrice }}/bulan)
          </span>
          <span v-else>{{ item.total | formatPrice }} ({{ item.total / period[item.period].num_of_month | formatPrice }}/bulan)</span>
        </p>
        <p v-else-if="item.type === 'domain'">
          <span v-if="item.discount">
            <strike>{{ item.price | formatPrice }}</strike> {{ item.total | formatPrice }}
          </span>
          <span v-else>{{ item.total | formatPrice }}</span>
        </p>
        <p v-else>{{ item.total | formatPrice }}
          <span v-if="item.period">/
            <span v-if="item.period === '1Y'">tahun</span>
            <span v-else>{{ period[item.period].text }}</span>
          </span>
        </p>
      </div>
      <div class="col-2">
        <p class="font-size-18 text-right">
          <span @click="removeFromCart(item)" class="fa fa-times remove-item"></span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import CommonMethods from '../CommonMethods';
export default {
  name: "ItemCart",
  props: ["cart"],
  data: function() {
    return {
      period: CommonVar.period
    }
  },
  watch: {
    cart: function() {
      if (!this.cart.items.length) {
        window.location.href = "cart-kosong";
      }
    }
  },
  methods: {
    itemTitle(item) {
      let title = item.title;
      let periodText = false;
      if (item.period) {
        periodText = this.period[item.period].text;
        title = `${title} - ${periodText}`
      }
      
      switch (item.type) {
        case 'hosting':
        case 'cloudhosting':
          title = `${item.title.replace(/[\(\)']+/g,'')} - ${periodText}`;
          break;
        case 'vpsme':
          title = `VPS ${item.title} - ${periodText}`;
          break;
        case 'wordpress':
          title = 'Auto Install WordPress - 1 Tahun';
          break;
        case 'ssl':
          title = `COMODO Positive SSL - ${periodText}`;
          break;
        case 'domainprivacy':
          title = `WHOIS - ${periodText}`;
          break;
        case 'domain':
          if (item.action === 'transfer') {
            title = `Transfer Domain ${this.toUpperCase(item[item.action + "_sld"])}${this.toUpperCase(item[item.action + "_tld"]) } - ${periodText}`;
          }
          break;
        default:
            title = title;
          break;
      }
      return title;
    },
    removeFromCart(item) {
      bus.$emit("show-spinner", true);
      axios
        .post("/api/guest/remove_from_cart", {
          id: item.id
        })
        .then(res => {
          bus.$emit("show-spinner", false);
          bus.$emit("refresh-cart");
          if (item.type == "wordpress") {
            this.$root.$emit("remove-wordpress");
          }
        })
        .catch(err => {
          console.log(err);
          bus.$emit("show-spinner", false);
        });
    },
    inArray(needle, haystack) {
      return CommonMethods.inArray(needle, haystack);
    },
    toUpperCase(str) {
      return str.toUpperCase();
    }
  }
};
</script>
