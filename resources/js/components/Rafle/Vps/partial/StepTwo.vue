
<template>
    <div class="as-nav-col__content">
        <div class="row">
            <div class="col-md-12"><p class="mb-4">Langkah 2: Pilih layanan VPS gratis Anda</p></div>
            <div class="col-md-12">
                <ul @click="onVpsChange('KVM')" :class="'as-card-select ' + (type == 'KVM' ? 'selected': 'unselected')">
                    <li class="as-card-select__title">VPS KVM</li>
                    <li class="as-card-select__description">Teknologi virtualisasi VPS memungkinkan Anda untuk memiliki alamat IP dedicated dan mampu digunakan di berbagai jenis OS Linux.</li>
                </ul>
            </div>
            <div class="col-md-12">
                <ul @click="onVpsChange('CYBER_PANEL')" :class="'as-card-select ' + (type == 'CYBER_PANEL' ? 'selected': 'unselected')">
                    <li class="as-card-select__title">VPS Cyberpanel</li>
                    <li class="as-card-select__description">Layanan VPS yang dilengkapi dengan CyberPanel, memberikan kemudahan lebih untuk mengatur website dengan cepat, aman dan efisien.</li>
                </ul>
            </div>
            <div class="col-12 mt-5">
                <a href="javascript:void(0)" @click="onButtonNext" :class="'as-btn--rounded go-daftar-sekarang ' + (type ? 'as-btn--primary' : 'as-btn--disabled ')" disabled="disabled">Selanjutnya</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"VpsFlowStepTwo",
    data(){
        return {
            type:'KVM'
        }
    },
    methods:{
        onButtonNext(){
            document.querySelector('#v-pills-three-tab').click()
            document.querySelector('#v-pills-mobile-three-tab').click()
            this.$emit('onButtonNext', 3, this.type)
        },
        onVpsChange(type){
            this.type = type
        }
    }
}
</script>
