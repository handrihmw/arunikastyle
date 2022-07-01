<template>
    <div class="block-website__content-list">
        <div class="row">
            <div class="col-12 col-md-6 col-xl-4" 
              v-for="(list, listIndex) in listWebsite" 
              :key="listIndex">
                <div class="block-website__content-list-item" v-if="list.page == currentPage">
                    <div class="block-website__content-list-item-box">
                        <div class="block-website__content-list-item-box-image block-website__content-list-item-box-image--new">
                            <div class="block-website__content-list-item-box-image-browser block-website__content-list-item-box-image-browser--grey">
                                <div class="block-website__content-list-item-box-image-browser-dot block-website__content-list-item-box-image-browser-dot--white"></div>
                                <div class="block-website__content-list-item-box-image-browser-dot block-website__content-list-item-box-image-browser-dot--white"></div>
                                <div class="block-website__content-list-item-box-image-browser-dot block-website__content-list-item-box-image-browser-dot--white"></div>
                            </div>
                            <div class="block-website__content-list-item-box-image-overlay-wrap">
                              <img v-bind:src="list.item.url_img" class="img-fluid" v-bind:alt="list.item.title" />
                              <div class="block-website__content-list-item-box-image-overlay-new">
                                  <a href="javascript:void(0)" class="nh-btn nh-btn--orange nh-btn--padding-top-bottom-16-right-left-32" v-on:click="previewModal(list.item)">LIVE PREVIEW</a>
                                  <a href="javascript:void(0)" class="nh-btn nh-btn--color-orange nh-btn--transparent nh-btn--border-orange" v-on:click="previewDetail(list.item)">LIHAT DETAIL FITUR</a>
                              </div>
                            </div>
                        </div>
                        <div class="block-website__content-list-item-box-content">
                            <div class="row">
                              <div class="col-12 col-sm-6">
                                <div class="block-website__content-list-item-box-content-title block-website__content-list-item-box-content-title--new">
                                  {{ list.item.title }}
                                </div>
                                <div class="block-website__content-list-item-box-content-category block-website__content-list-item-box-content-category--new">{{ list.item.category }}</div>
                              </div>
                              <div class="col-12 col-sm-6">
                                <div class="block-website__content-list-item-box-content-subprice block-website__content-list-item-box-content-subprice--new" v-if="list.item.gimmick_price_month > 0">
                                  Rp {{ list.item.gimmick_price_month | formatPrice }} <sub>/ Bulan</sub>
                                </div>
                                <div class="block-website__content-list-item-box-content-price-left block-website__content-list-item-box-content-price-left--new">
                                  Rp {{ list.item.price_month | formatPrice }} <sub>/ Bulan</sub>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="notFoundStatus">
              <div class="block-website__content-list-not-found">
                <div class="row">
                  <div class="col-12 col-lg-6 offset-lg-3 col-md-8 offset-md-2">
                    <div class="block-website__content-list-not-found-media">
                      <video autoplay loop width="100%" height="auto" muted="muted" preload="none" poster="/assets/images/2020/membuat-website/No_themes.svg">
                        <source src="/assets/images/2020/membuat-website/No_themes.mp4" type="video/mp4">
                      </video>
                    </div>
                    <div class="block-website__content-list-not-found-title">Yaaah, website “{{ keywordSearch }}” gak ada</div>
                  </div>
                  <div class="col-12 col-lg-4 offset-lg-4 col-md-6 offset-md-3">
                    <div class="block-website__content-list-not-found-description">
                      Coba cari website yang lain, kami masih punya kok website yang bagus - bagus selain itu
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "WebsiteDiyList",
    created() {
        this.getDiyList();
    },
    data() {
        return {
            resourceWebsite: [],
            listWebsite: [],
            notFoundStatus: false,
            keywordSearch: '',
            totalPage: 1
        };
    },
    filters: {
        formatPrice(value) {
            return CommonMethods.formatPrice(value)
        }
    },
    methods: {
        getDiyList() {
            axios
                .get("/api/guest/get-website-template-list")
                .then(res => {
                    if (res.data) {
                        this.resourceWebsite = res.data;
                        this.listWebsite = res.data;
                        this.setPagination(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        previewModal(data) {
            this.$emit("preview-modal", {
                status: true,
                data: data
            });
        },
        previewDetail(data) {
          let configs = JSON.parse(data.configs);
          let url = '/membuat-website/' + data.slug;
          if (configs.custom_slug!="") {
            url = '/pembuatan-website-' + configs.custom_slug;
          }
          window.location.href = url;
        },
        updateCategory(data) {
            let resource = this.resourceWebsite;
            if (data == "Semua Website") {
                this.setPagination(resource);
                return true;
            }

            var categoryList = [];
            for (var i in resource) {
                if (resource[i].category == data) {
                    categoryList.push(resource[i]);
                }
            }
            this.currentPage = 1;
            this.setPagination(categoryList);
        },
        updateSort(data) {
            let resource = this.resourceWebsite;
            if (data == "Terbaru") {
                resource.sort(function (a, b) {
                    return a.position - b.position;
                });
                this.setPagination(resource);
                return true;
            }

            resource.sort(function (a, b) {
                return b.title.localeCompare(a.title);
            });

            if (data == "A-Z") {
              resource.sort(function (a, b) {
                  return a.title.localeCompare(b.title);
              });
            }

            let sortList = resource;
            this.currentPage = 1;
            this.setPagination(sortList);
        },
        searchWebsite(data) {
            let resource = this.resourceWebsite;
            if (data === "") {
                this.setPagination(resource);
                return true;
            }

            let keyword = data.toLowerCase();
            var searchList = [];
            let notFoundStatus = true;
            for (var i in resource) {
                let title = resource[i].title.toLowerCase();
                let keyword_web = resource[i].keyword;
                if (title.indexOf(keyword) !== -1 || keyword_web.includes(keyword)) {
                    searchList.push(resource[i]);
                    notFoundStatus = false;
                }
            }
            this.notFoundStatus = notFoundStatus;
            this.keywordSearch = data;
            this.currentPage = 1;
            this.setPagination(searchList);
        },
        setPagination(data) {
            var page = 0;
            var dataList = [];

            for (var i in data) {
                if (i % 9 == 0) {
                    page += 1;
                }

                dataList.push({
                    page: page,
                    item: data[i]
                });
            }

            this.totalPage = page;
            this.listWebsite = dataList;

            this.$emit("pagination", {
                totalPage: this.totalPage,
                currentPage: this.currentPage,
                totalResource: this.resourceWebsite.length > 9 ? 9 : this.resourceWebsite.length 
            });

            this.$emit("list-website", this.listWebsite);
        }
    },
    props: ["sort", "category", "search", "currentPage"],
    watch: {
        sort: function(data) {
            this.updateSort(data);
        },
        category: function(data) {
            this.updateCategory(data);
        },
        search: function(data) {
            this.searchWebsite(data);
        }
    }
};
</script>