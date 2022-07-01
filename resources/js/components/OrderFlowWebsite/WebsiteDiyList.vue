<template>
    <div class="block-website__content-list">
        <div class="row">
            <div class="col-12 col-sm-6 col-xl-6" 
              v-for="(list, listIndex) in listWebsite" 
              :key="listIndex">
                <div class="block-website__content-list-item" v-if="list.page == currentPage">
                    <div class="block-website__content-list-item-box">
                        <div class="block-website__content-list-item-box-image">
                            <div class="block-website__content-list-item-box-image-browser">
                                <div class="block-website__content-list-item-box-image-browser-dot"></div>
                                <div class="block-website__content-list-item-box-image-browser-dot"></div>
                                <div class="block-website__content-list-item-box-image-browser-dot"></div>
                            </div>
                            <img v-bind:src="list.item.url_img" alt />
                            <div class="block-website__content-list-item-box-image-overlay">
                                <a href="javascript:void(0)" class="nh-btn" v-on:click="previewModal(list.item)">LIHAT PREVIEW</a>
                            </div>
                        </div>
                        <div class="block-website__content-list-item-box-content">
                            <div class="block-website__content-list-item-box-content-title" >{{ list.item.title }}</div>
                            <div class="block-website__content-list-item-box-content-category">{{ list.item.category }}</div>
                            <div class="block-website__content-list-item-box-content-description">{{ list.item.description }}</div>
                            <div class="block-website__content-list-item-box-content-point">
                                <div class="row">
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                        <div class="block-website__content-list-item-box-content-point-col-item"
                                          v-for="(pointLeft, pointLeftIndex) in list.item.point.left"
                                          :key="pointLeftIndex">
                                            <div class="block-website__content-list-item-box-content-point-col-item-icon">
                                                <img src="/assets/images/2020/membuat-website/checklist-icon-website-instant.svg"/>
                                            </div>
                                            <div class="block-website__content-list-item-box-content-point-col-item-text">{{ pointLeft }}</div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                        <div class="block-website__content-list-item-box-content-point-col-item"
                                          v-for="(pointRight, pointLeftRight) in list.item.point.right"
                                          :key="pointLeftRight">
                                            <div class="block-website__content-list-item-box-content-point-col-item-icon">
                                                <img src="/assets/images/2020/membuat-website/checklist-icon-website-instant.svg"/>
                                            </div>
                                            <div class="block-website__content-list-item-box-content-point-col-item-text">{{ pointRight }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="block-website__content-list-item-box-content-price">
                                <div class="block-website__content-list-item-box-content-price-left">
                                  <div class="block-website__content-list-item-box-content-subprice">Rp 100.000<sub>/bln</sub></div>
                                  <div>Rp 62.500<sub>/bln</sub></div>
                                </div>
                                <div>
                                    <a href="javascript:void(0)" class="nh-btn nh-btn--orange" v-on:click="showOrder(list.item)">PILIH WEBSITE INI</a>
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
        showOrder(data) {
            this.$emit("order", {
                status: true,
                data: data
            });
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
                var title = resource[i].title.toLowerCase();
                if (title.indexOf(data) !== -1) {
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
                if (i % 6 == 0) {
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
                totalResource: this.resourceWebsite.length > 6 ? 6 : this.resourceWebsite.length 
            });

            this.$emit("list-website", this.listWebsite);
        }
    },
    props: ["preview", "category", "search", "currentPage"],
    watch: {
        category: function(data) {
            this.updateCategory(data);
        },
        search: function(data) {
            this.searchWebsite(data);
        }
    }
};
</script>