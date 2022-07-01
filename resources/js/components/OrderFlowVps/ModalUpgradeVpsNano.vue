<template>
  <div 
    class="popup-upgrade fade modal"
    id="upgradeConfirm"
    tabindex="-1"
    aria-hidden="true">
      <div class="modal-dialog popup-upgrade__dialog">
        <div class="modal-content popup-upgrade__content">
          <h5 class="popup-upgrade__title text-center">Konfirmasi Perubahan Paket</h5>
          <p></p>
          <div class="popup-upgrade__form">
            <div class="form-group popup-upgrade__form-group">
              <p class="text-center">Dibutuhkan minimum Paket Cloud VPS Mikro untuk dapat menambahkan Addons cPanel WHM di dasbor Anda.<br/>Apakah Anda ingin mengganti paket layanan sebelumnya menjadi Paket Cloud VPS Mikro?</p>
              <div>
                <button
                  @click="cancel()"
                  type="button" 
                  class="popup-upgrade__button popup-upgrade__button--cancel" 
                  data-dismiss="modal">
                  Tidak, Terima Kasih
                </button>
                <button
                  @click="upgrade()"
                  type="button"
                  class="popup-upgrade__button popup-upgrade__button--save"
                  data-dismiss="modal">
                  Ganti Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'modalUpgradeVpsNano',
  props: ['vps', 'tmp_cart'],
  data: function() {
    return {

    }
  },
  methods: {
    upgrade() {
      bus.$emit('upgrade-nano', 'upgrade');
    },
    cancel() {
      bus.$emit('reset-selected-addon');
    }
  },
  created() {

  }
}
</script>