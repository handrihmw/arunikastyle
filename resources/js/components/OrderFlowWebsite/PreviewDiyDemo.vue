<template>
  <div class="modal fade block-website__modal-preview" id="preview-modal" tabindex="-1" role="dialog" aria-labelledby="previewModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-body" style="padding:0px">
          <div class="block-website__modal-preview-header">
            <div class="row">
              <div class="col-lg-4">
                <div style="margin: 24px 0px 15px 36px">
                  <h4>{{ data.name }}</h4>
                  <p>{{ data.category }}</p>
                </div>
              </div>
              <div class="col-lg-4 d-none d-sm-block">
                <div class="d-flex block-website__modal-preview-device">
                  <div class="flex-fill block-website__modal-preview-device-icon-desktop"
                    v-bind:class="{'active' : currentDevice === 'desktop'}"
                    v-on:click="setView('desktop')">
                    <img class="img-fluid" src="/assets/images/2020/membuat-website/icon-desktop.svg"/>
                    <div class="block-website__modal-preview-device-icon-title" 
                      v-bind:class="{'active active--orange' : currentDevice === 'desktop'}">
                      Desktop
                    </div>
                  </div>
                  <div class="flex-fill block-website__modal-preview-device-icon-tablet"
                    v-bind:class="{'active' : currentDevice === 'tablet'}" 
                    v-on:click="setView('tablet')">
                    <img class="img-fluid" src="/assets/images/2020/membuat-website/icon-tablet.svg"/>
                    <div class="block-website__modal-preview-device-icon-title"
                      v-bind:class="{'active active--orange' : currentDevice === 'tablet'}">
                      Tablet
                    </div>
                  </div>
                  <div class="flex-fill block-website__modal-preview-device-icon-mobile"
                    v-bind:class="{'active' : currentDevice === 'mobile'}" 
                    v-on:click="setView('mobile')">
                    <img class="img-fluid" src="/assets/images/2020/membuat-website/icon-mobile.svg"/>
                    <div class="block-website__modal-preview-device-icon-title" 
                      v-bind:class="{'active active--orange' : currentDevice === 'mobile'}">
                      Mobile
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <a class="nh-btn nh-btn--center nh-btn--orange block-website__modal-preview-btn-select"
                  v-on:click="showOrder()"
                  :onclick="`trackingClickCTA('CTA Click', 'pilih_website_${data.cta}_clicked')`"
                  href="javascript:void(0)"
                  data-dismiss="modal">
                  Pilih Website
                </a>
              </div>
            </div>
          </div>
          <div class="block-website__modal-preview-iframe block-website__modal-preview-iframe--new">
            <iframe :src="data.url_preview" class="preview-iframe" v-bind:class="currentDevice"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "PreviewDiyModal",
    data() {
        return {
            data: [],
            currentDevice: "desktop",
        };
    },
    methods: {
        setData(){
          this.data = this.previewData;
        },
        setView(device) {
            this.currentDevice = device;
        },
        showOrder() {
            this.$emit("order");
        }
    },
    props: ["previewData"],
    watch: {
        previewData: function() {
            this.setData();
            if (screen.width < 767) {
              this.setView('mobile');
            }
        }
    }
};
</script>