<template>
  <!-- Modal -->
  <div class="checkout-tos modal" id="checkoutTos" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="checkoutTosLabel">Perhatian!</h5>
        </div>
        <div class="modal-body">
          Dengan mengklik tombol <strong>"Lanjutkan"</strong>, berarti Anda setuju dengan <a :href="'syarat-dan-ketentuan' | link " target="_blank" rel="noopener noreferrer">Syarat dan Ketentuan yang berlaku.</a>
        </div>
        <div class="modal-footer">
          <a href="javascript:void(0);" @click="acceptTos(false)" class="button-default button-white" data-dismiss="modal">Kembali</a>
          <a href="javascript:void(0);" @click="acceptTos" class="button-default button-white-orange" data-dismiss="modal">Lanjutkan</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TosPopUp',
  methods: {
    acceptTos(status = true) {
      if (!status) {
        bus.$emit('accept-tos', false);
        bus.$emit('show-spinner', false);
        return;
      }
      bus.$emit('accept-tos', true);
      bus.$emit('checkout-now');
    }
  }
}
</script>