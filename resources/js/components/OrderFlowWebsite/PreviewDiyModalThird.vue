<template>
  <div class="modal fade block-website__modal-preview" id="preview-modal" tabindex="-1" role="dialog" aria-labelledby="previewModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <a class="block-website__modal-preview-btn-prev" href="javascript:void(0)"
          v-if="currentDataPosition != 0"
          v-on:click="updatePreviewData(prevData)">
          <img class="img-fluid" src="/assets/images/arrow-preview-left.svg" />
        </a>
        <a class="block-website__modal-preview-btn-next" href="javascript:void(0)"
          v-if="currentDataPosition != lastDataPosition"
          v-on:click="updatePreviewData(nextData)">
          <img class="img-fluid" src="/assets/images/arrow-preview-right.svg" />
        </a>
        <div class="modal-body" style="padding:0px">
          <div class="block-website__modal-preview-header">
            <div class="row">
              <div class="col-12">
                <button type="button" class="close pr-2" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="col-lg-4 col-xl-3">
                <div style="margin: 24px 0px 15px 36px">
                  <h4>{{ data.title }}</h4>
                  <p>{{ data.category }}</p>
                </div>
              </div>
              <div class="col-lg-4 col-xl-3 d-none d-sm-block">
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
              <div class="col-lg-4 col-xl-6 block-website__modal-preview-btn-select-container">
                <a class="nh-btn nh-btn--white nh-btn--color-orange nh-btn--border-orange block-website__modal-preview-btn-select nh-order-lg-6 nh-order-xl-0 text-uppercase"
                  v-on:click="goToDetail(data)"
                  href="javascript:void(0)">
                  Lihat Detail Fitur
                </a>
                <a class="nh-btn nh-btn--orange block-website__modal-preview-btn-select nh-order-lg-0 nh-order-xl-6 text-uppercase"
                  v-on:click="showOrder(data)"
                  href="javascript:void(0)"
                  data-dismiss="modal">
                  Pilih Website Ini
                </a>
              </div>
            </div>
          </div>
          <div class="block-website__modal-preview-iframe block-website__modal-preview-iframe--new" v-if="previewStatus">
            <iframe :src="data.url_preview" class="preview-iframe" v-bind:class="currentDevice"></iframe>
            <p class="block-website__modal-preview-disclaimer" v-if="data.show_disclaimer == 1">
              Anda tengah melihat Live Preview dengan contoh konten website. Setelah aktivasi, Anda perlu melakukan personalisasi tampilan sesuai keinginan. Lihat informasi selengkapnya di <a :href="niaga_url + 'syarat-dan-ketentuan'">Syarat &amp; Ketentuan</a>.
            </p>
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
            niaga_url: CommonVar.niaga_url,
            showModal: false,
            data: [],
            currentDevice: "desktop",
            dataList: [],
            currentDataPosition: 0,
            lastDataPosition: 0,
            prevData: [],
            nextData: []
        };
    },
    methods: {
        setView(device) {
            this.currentDevice = device;
        },
        showOrder(data) {
          this.$emit("order", {
              status: true,
              data: this.data
          });
        },
        setDataList(data) {
            let dataList = [];
            for (var i in data) {
                dataList.push(data[i].item);
            }
            this.dataList = dataList;
        },
        getDataPosition(data) {
            let dataList = this.dataList;
            for (var i in dataList) {
                if (dataList[i].title == data.title) {
                    this.currentDataPosition = parseInt(i);
                    break;
                }
            }
            this.lastDataPosition = dataList.length - 1;
        },
        setArrowData() {
            let dataList = this.dataList;
            let currentDataPosition = this.currentDataPosition;
            if (currentDataPosition) {
                this.prevData = dataList[currentDataPosition - 1];
            }

            if (currentDataPosition < this.lastDataPosition) {
                this.nextData = dataList[currentDataPosition + 1];
            }
        },
        updatePreviewData(data) {
            this.$emit("update-preview-data", data);
        },
        goToDetail(data) {
          if (typeof data.gtm_detail_fitur !== 'undefined' && data.gtm_detail_fitur !== '') {
            trackingClickCTA('CTA Detail Fitur ' + data.title, data.gtm_detail_fitur);
          }
          let configs = JSON.parse(data.configs);
          let url = '/membuat-website/' + data.slug;
          if (configs.custom_slug!="") {
            url = '/pembuatan-website-' + configs.custom_slug;
          }
          window.location.href = url;
        },
    },
    props: ["previewStatus", "previewData", "listWebsite"],
    watch: {
        previewStatus: function(value) {
            this.showModal = value;
        },
        previewData: function(value) {
            this.data = {
              ...value,
              url_preview: ''
            };

            setTimeout(() => {
              this.data.url_preview = value.url_preview
            }, 100)

            if (screen.width < 767) {
              this.setView('mobile');
            }
            this.getDataPosition(value);
            this.setArrowData();
        },
        listWebsite: function(value) {
            this.setDataList(value);
        }
    }
};
</script>