<template>
    <div>
        <p class="mb-4">Langkah 1: <strong>Like</strong> Facebook Page Niagahoster, <strong>Share</strong> halaman ini ke Facebook, dan <strong>Subscribe</strong> YouTube channel Niagahoster.</p>
        <div class="row">
            <div id="fb-root"></div>
            <div class="col-md-6 col-12 mb-5">
                <p>Facebook</p>
                <div class="fb-like" data-href="https://www.facebook.com/Niagahoster" data-width="" data-layout="button" data-action="like" data-size="large" data-show-faces="true" data-share="false"></div>
                <a href="javascript:void(0);" class="fb-share" @click="onShare()">Share</a>
            </div>
            <div class="col-md-6 col-12 mb-5">
                <p>Youtube</p>
                <div class="d-flex align-items-center">
                    <a href="https://www.youtube.com/NiagahosterIndonesia" target="__blank" class="as-btn-sosmed as-btn-sosmed--youtube"  @click="onButtonClick('youtube')"><span class="as-btn-sosmed-icon as-btn-sosmed-icon--youtube"></span>Subscribe</a>
                </div>
            </div>
            <div class="col-md-6 col-12 mb-5">
                <p>Tiktok</p>
                <div class="d-flex">
                    <a href="https://www.tiktok.com/@niagahoster" target="__blank" class="as-btn-sosmed as-btn-sosmed--tiktok" @click="onButtonClick('tiktok')"><span class="as-btn-sosmed-icon as-btn-sosmed-icon--tiktok" ></span>Follow</a>
                </div>
            </div>
            <div class="col-md-6 col-12 mb-5">
                <p>Instagram</p>
                <div class="d-flex">
                    <a href="https://www.instagram.com/niagahoster.id/" target="__blank" class="as-btn-sosmed as-btn-sosmed--instagram" @click="onButtonClick('instagram')"><span class="as-btn-sosmed-icon as-btn-sosmed-icon--instagram"></span>Follow</a>
                </div>
            </div>
            <div class="col-12 mb-4" v-if="!next">
                <p class="text-danger">Like, Share, dan Subscribe terlebih dahulu untuk bisa meneruskan proses.</p>
            </div>
            <div class="col-12">
                <a href="javascript:void(0);" @click="onButtonNext()" :class="'as-btn--rounded go-daftar-sekarang ' +( next ? 'as-btn--primary' : 'as-btn--disabled')" :disabled="!next">Selanjutnya</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'VpsFlowStepOne',
    props:["step"],
    data(){
        return {
            facebookLikes:0,
            facebookShare:0,
            youtube:0,
            tiktok:0,
            instagram:0,
            next:false
        }
    },
    methods: {
        onShare() {
            FB.ui(
            {
                display: 'popup',
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object:window.location.href,
                })
            });
            this.facebookShare = 1
            this.facebookLikes = 1
            this.checkButtonClick()
        },
        onButtonClick(type){
            this[type] = 1
            this.checkButtonClick()
        },
        checkButtonClick() {
            if (
                this.facebookLikes &&
                this.facebookShare &&
                this.youtube && 
                this.tiktok && 
                this.instagram
            ) {
                this.next = true
            }
        },
        onButtonNext() {
            this.$emit('onButtonNext', 2, '')
            document.querySelector('#v-pills-two-tab').click()
            document.querySelector('#v-pills-mobile-two-tab').click()
        }
    }
}
</script>