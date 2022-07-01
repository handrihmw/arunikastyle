<template>
  <section class="theme-website-preview">
    <div class="theme-website-preview__nav">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-xl-4">
            <div class="theme-website-preview__box">
              <div class="theme-website-preview__box-logo">
                <a href="/v2/membuat-website">
                  <img src="/assets/images/2020/membuat-website/logo-niagahoster.svg" class="img-fluid" />
                </a>
              </div>
              <div>
                <div class="theme-website-preview__box-title">{{ data.name }}</div>
                <div class="theme-website-preview__box-category">{{ data.category }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-4 d-none d-sm-block">
            <div class="theme-website-preview__box justify-content-center">
              <div v-on:click="setView('desktop')" class="theme-website-preview__box-device theme-website-preview__box-device--desktop" v-bind:class="{'theme-website-preview__box-device--active' : currentDevice === 'desktop'}">
                <img src="/assets/images/2020/membuat-website/icon-desktop.svg"/>
                <div>Desktop</div>
                <hr>
              </div>
              <div v-on:click="setView('tablet')" class="theme-website-preview__box-device theme-website-preview__box-device--tablet"  v-bind:class="{'theme-website-preview__box-device--active' : currentDevice === 'tablet'}">
                <img src="/assets/images/2020/membuat-website/icon-tablet.svg"/>
                <div>Tablet</div>
                <hr>
              </div>
              <div v-on:click="setView('mobile')" class="theme-website-preview__box-device theme-website-preview__box-device--mobile"  v-bind:class="{'theme-website-preview__box-device--active' : currentDevice === 'mobile'}">
                <img src="/assets/images/2020/membuat-website/icon-mobile.svg"/>
                <div>Mobile</div>
                <hr>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-4">
            <div class="theme-website-preview__box justify-content-end theme-website-preview__box--third-box">
              <div class="theme-website-preview__box-price d-flex justify-content-center">
                <div>
                  <sub>Rp 100.000 / Bulan</sub><br/>
                  Rp 62.500 <sub>/ Bulan</sub>
                </div>
              </div>
              <div class="theme-website-preview__box-order d-flex justify-content-center">
                <a class="nh-btn nh-btn--orange" 
                href="javascript:void(0);" 
                v-on:click="showOrder()">PILIH WEBSITE INI</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="theme-website-preview__iframe">
      <iframe :src="data.url_preview" v-bind:class="currentDevice" frameborder="0" />
    </div>
  </section>
</template>

<script>
export default {
  name: "PreviewDiyNavigation",
  created() {
    this.setData();
    if (screen.width < 767) {
      this.setView('mobile');
    }
  },
  data() {
    return {
      data: [],
      currentDevice: "desktop"
    };
  },
  methods: {
    setData(){
      this.data = this.previewData;
    },
    setView(device) {
      this.currentDevice = device;
    },
    showOrder(data) {
      this.$emit("order");
    }
  },
  props: ["previewData"],
  watch: {
    previewData: function(value) {
      this.data = value;
      if (screen.width < 767) {
        this.setView('mobile');
      }
    }
  }
};
</script>