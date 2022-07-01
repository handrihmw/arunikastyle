<template>
    <div class="summary-cart__tos" v-bind:class="deviceClass">
        Dengan mengklik tombol "Checkout Sekarang" di bawah, berarti Anda setuju dengan
        <a href="https://www.niagahoster.co.id/syarat-dan-ketentuan" class="agree" target="_blank" rel="noopener noreferrer">Syarat dan Ketentuan</a>
    </div>
</template>

<script>
export default {
  name: 'TosText',
  props: ['deviceClass']
}
</script>