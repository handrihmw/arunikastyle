<template>
    <div class="modal fade block-website__modal-difm" id="difm-modal" tabindex="-1" role="dialog" aria-labelledby="difmModal" aria-hidden="true">
        <div class="modal-dialog block-website__modal-difm-dialog" role="document">
            <div class="modal-content block-website__modal-difm-dialog-content">
                <div class="modal-body block-website__modal-difm-dialog-content-body">
                    <div class="block-website__modal-difm-dialog-content-body-title">Membuat Website Kini Lebih Mudah</div>
                    <div class="block-website__modal-difm-dialog-content-body-description block-website__modal-difm-dialog-content-body-description--new">
                      Jasa pembuatan website Niagahoster siap mewujudkan impian Anda. Hubungi tim profesional kami dan website langsung dapat digunakan. Anda sangat suka kebebasan? Buat sendiri website Anda dalam beberapa klik saja!.
                    </div>
                    <div class="block-website__modal-difm-dialog-content-body-item">
                        <div class="row justify-content-center">
                            <div class="col-12 col-md-6 col-xl-4"
                              v-for="list in listWebsite"
                              :key="list.id">
                                <div class="block-website__modal-difm-dialog-content-body-item-card block-website__modal-difm-dialog-content-body-item-card--new">
                                    <h5 class="block-website__modal-difm-dialog-content-body-item-card-title">{{ list.title }}</h5>
                                    <p class="block-website__modal-difm-dialog-content-body-item-card-price">Rp {{ priceFormat(list.price ) }}</p>
                                    <a href="javascript:void(0)" class="nh-btn nh-btn--orange no-gutters gtmProductView website-custom"
                                      v-on:click="order(list)">
                                        Pilih Sekarang
                                    </a>
                                    <p class="block-website__modal-difm-dialog-content-body-item-card-description">{{ list.desc }}</p>
                                    <ul class="block-website__modal-difm-dialog-content-body-item-card-point">
                                      <li v-for="(feature, featureIndex) in list.features" :key="featureIndex">
                                          <div class="block-website__modal-difm-dialog-content-body-item-card-point-icon nh-tooltip">
                                              <img src="/assets/images/2019/hosting-package/icon-question-mark.svg"/>
                                          </div>
                                          <p class="block-website__modal-difm-dialog-content-body-item-card-point-text">{{ feature }}</p>
                                      </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="d-none" data-dismiss="modal" aria-label="Close" ref="closeOrderDifmModalTrigger"></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "OrderDifmModal",
    created() {
        this.getDifmList();
    },
    data() {
        return {
            listWebsite: []
        };
    },
    methods: {
        getDifmList() {
            axios
                .get("/api/guest/get-website-custom-list")
                .then(res => {
                    if (res.data) {
                        this.listWebsite = res.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        priceFormat(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        },
        order(data) {
            this.$refs.closeOrderDifmModalTrigger.click();
            this.$emit("spinner", true);
            sessionStorage.setItem("website-custom", $(this).data("title"));
            this.addToCart({
                selector: null,
                "remove-id": null,
                domain: "",
                free_domain: 1,
                domain_type: "register_free",
                id: data.id,
                period: "1Y",
                multiple: "1"
            });
        },
        addToCart(data) {
            this.$emit("add-to-cart", {
                item: data,
                requestBy: "difm"
            });
        },
        addToCartResult(data) {
            if (data.success) {
                window.location.href = "/order/checkout";
            } else {
                console.log("Error : " + data.message);
            }
        }
    },
    props: ["addedCartResultDifm"],
    watch: {
        addedCartResultDifm: function(value) {
            this.addToCartResult(value);
        }
    }
};
</script>