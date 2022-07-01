<template>
  <div class="kvm-region" :class="{'select--disabled': tmp_cart.items.length}">
    <h3 class="kvm-region__title text-capitalize">Pilih Lokasi Data Center Anda: </h3>
    <div class="select-region">
      <div ref="select-region" class="select-region__item" :class="{'select-region--show-option':show_options}" @click="show_options = !show_options">
        <div>
            <span><strong>{{ default_kvm_region.region }}</strong>, {{ default_kvm_region.country }}</span>
        </div>
      </div>
      <transition>
        <div class="select-region__wrapper" v-if="show_options">
          <ul class="select-region__option"
              v-closable="{exclude: ['select-region'], handler: 'onClose'}">
            <li v-for="(item, key) in kvm_region.lists" :key="key" @click="chooseRegion(key)">
              <span><strong>{{ item.region }}</strong>, {{ item.country }}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <p class="kvm-region__info">Data center yang akan Anda pilih tidak dapat diubah setelah transaksi selesai</p>
  </div>
</template>

<script>
export default {
  name: "selectRegion",
  props: ["kvm_region", "tmp_cart"],
  data: function () {
    return {
      show_options: false,
      default_kvm_region: {
        region: "",
        country: "",
      },
    };
  },
  methods: {
    chooseRegion(id) {
      this.kvm_region.selected = id;
      this.show_options = false;
      this.setRegionName();
    },
    setRegionName() {
      let selectedRegion = this.kvm_region.lists[this.kvm_region.selected];
      this.default_kvm_region.region = selectedRegion.region;
      this.default_kvm_region.country = selectedRegion.country;
    },
    onClose() {
      this.show_options = false;
    },
  },
  mounted() {
    this.setRegionName();
  },
};
</script>