<template>
  <div class="modal fade block-website__modal-diy" id="diy-modal" tabindex="-1" role="dialog" aria-labelledby="diyModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content block-website__modal-diy-content" style="border-radius: .8rem">
        <div class="modal-body">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" ref="closeOrderDiyModalTrigger">
            <span aria-hidden="true">&times</span>
          </button>
          <h4 class="block-website__modal-diy-title">Apa Nama Website Anda</h4>
          <p class="block-website__modal-diy-desc">Pilih nama terbaik untuk website Anda.</p>
          <form @submit="formDiyAction" method="post" action="#">
            <div>
              <div class="pretty-radio">
                <input type="radio" name="domain_action" value="register" />
                <p class="pretty-radio__icon pretty-radio__title" 
                  v-on:click="setDomainAction('register')"
                  v-bind:class="{'checked' : domainAction == 'register'}">
                  Cari Nama Website (Domain) Anda
                </p>
                <p class="pretty-radio__desc">Deskripsi : Anda bisa mencari nama website Anda dengan ekstensi domain .com, .net, .org, .info, .sch.id, .or.id, .ac.id, .web.id, .xyz, .website, .space, .site, .online dan .ponpes.id secara gratis.</p>
              </div>
              <div v-if="domainAction == 'register'">
                <div class="block-website__modal-diy-domain">
                  <input type="text" class="block-website__modal-diy-input"
                    placeholder="Tulis Nama Website yang Anda inginkan"
                    :required="domainAction == 'register'"
                    v-model="registerSld"/>
                  <select name="register_tld" 
                    class="block-website__modal-diy-select"
                    v-on:change="setDomainID(registerTld)"  
                    v-model="registerTld" required>
                    <option v-for="tld in tldList" :key="tld.id" :value="tld.tld"> {{ tld.tld }} </option>
                  </select>
                </div>
                <div v-if="domainID" class="pretty-radio__desc">
                  <strong>Perhatian:</strong> Sebelum mendaftarkan domain dot ID, lihat <a href="persyaratan-domain-indonesia" target="_blank" rel="noopener noreferrer" title="Persyaratan Domain Indonesia"><strong>Persyaratan Nama Domain Indonesia</strong></a>.
                </div>
              </div>
            </div>
            <div>
              <div class="pretty-radio">
                <input type="radio" name="domain_action" value="owndomain" />
                <p class="pretty-radio__icon pretty-radio__title" 
                  v-on:click="setDomainAction('owndomain')"
                  v-bind:class="{'checked' : domainAction == 'owndomain'}">Gunakan Domain Saya Sendiri</p>
                <p class="pretty-radio__desc">Anda bisa menggunakan nama domain yang sudah Anda beli sebelumnya.</p>
              </div>
              <div v-if="domainAction == 'owndomain'" class="block-website__modal-diy-domain">
                <input type="text" class="block-website__modal-diy-input block-website__modal-diy-input--fullsize"
                  placeholder="Tulis Nama Website Anda"
                  :required="domainAction == 'owndomain'"
                  v-model="ownDomainAddress"/>
                </select>
              </div>
            </div>
            <button v-bind:disabled="isButtonDisabled()" :class="{'block-website__modal-diy-btn--disabled': isButtonDisabled()}" class="nh-btn nh-btn--center nh-btn--orange block-website__modal-diy-btn">Pilih Sekarang</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderDiyModal",
  created() {
    this.getTldList();
    this.setData();
  },
  data() {
    return {
      data: [],
      domainAction: "register",
      registerSld: "",
      registerTld: ".com",
      owndomainSld: '',
      owndomainTld: '.com',
      domainID: false,
      tldList: []
    };
  },
  methods: {
    setData(){
      this.data = this.previewData;
    },
    setDomainAction(data) {
      this.domainAction = data;
    },
    setDomainID(data) {
      this.domainID = false;
      if (CommonMethods.inArray(this.registerTld, ['.id','.web.id','.co.id','.sch.id','.or.id','.ac.id','.biz.id','.my.id'])) {
        this.domainID = true;
      }
    },
    setInfoWebsite(data) {
      localStorage.setItem("website-template-id", data.id);
      localStorage.setItem("website-template-image", data.url_img);
      localStorage.setItem("website-template-category", data.category);
      localStorage.setItem("website-template-name", data.name);
      localStorage.setItem("website-template-wpstore", data.wpstore);
      localStorage.setItem("website-template-currency", data.currency);
      localStorage.setItem("website-template-price", data.price);
    },
    formDiyAction(event) {
      event.preventDefault();

      this.$refs.closeOrderDiyModalTrigger.click();
      this.setInfoWebsite(this.data);
      this.spinner(true);

      if (this.domainAction == "register") {
          this.checkDomain(
            {
                sld: this.registerSld,
                tld: this.registerTld
            },
            result => {
              if (result) {
                this.addToCart({
                  selector: null,
                  "remove-id": null,
                  domain: {
                    action: "register",
                    register_sld: this.registerSld,
                    register_tld: this.registerTld,
                    register_years: 1
                  },
                  free_domain: 1,
                  domain_type: "register_free",
                  wpstore: {
                      product_id: "83",
                      type: "wpthemes",
                      item_id: this.data.wpstore,
                      wp_domain: this.registerSld+this.registerTld
                  },
                  id: "84",
                  period: "1Y",
                  multiple: "1",
                  auto_force_https: true,
                  auto_install_website: true,
                  install_wp_accelerator: true,
                  "theme-id": this.data.id,
                  "theme-title": this.data.name,
                  "theme-currency": this.data.currency,
                  "theme-price": this.data.price,
                });
              } else {
                sessionStorage.setItem(
                  "website-domain",
                  "register"
                );
                sessionStorage.setItem(
                  "website-domain-sld",
                  this.registerSld
                );
                sessionStorage.setItem(
                  "website-domain-tld",
                  this.registerTld
                );

                this.redirectOrder();
              }
            }
          );
      } else {
        let parsedDomain = psl.parse(this.ownDomainAddress);
        if (psl.isValid(this.ownDomainAddress)) {
          this.addToCart({
            selector: null,
            "remove-id": null,
            domain: {
              action: "owndomain",
              owndomain_sld: parsedDomain.sld,
              owndomain_tld: '.'+parsedDomain.tld,
              register_years: 1
            },
            free_domain: 1,
            domain_type: 'use_existing',
            wpstore: {
                product_id: "83",
                type: "wpthemes",
                item_id: this.data.wpstore,
                wp_domain: this.ownDomainAddress
            },
            id: "84",
            period: "1Y",
            multiple: "1",
            auto_force_https: true,
            auto_install_website: true,
            install_wp_accelerator: true,
            "theme-id": this.data.id,
            "theme-title": this.data.name,
            "theme-currency": this.data.currency,
            "theme-price": this.data.price,
          });
        } else {
          sessionStorage.setItem(
            "website-domain",
            "owndomain"
          );
          if (parsedDomain.sld === undefined || parsedDomain.tld === undefined) {
              sessionStorage.setItem(
                  "website-owndomain-sld",
                  ''
              );
              sessionStorage.setItem(
                  "website-owndomain-tld",
                  '.com'
              );
          } else {
              sessionStorage.setItem(
                  "website-owndomain-sld",
                  parsedDomain.sld
              );
              sessionStorage.setItem(
                  "website-owndomain-tld",
                  parsedDomain.tld
              );
          }
          this.redirectOrder();
        }
      }
    },
    checkDomain(data, callback) {
      axios
        .post("/api/guest/domain_check", data)
        .then(res => {
          callback(res.data.result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    addToCart(data) {
      this.$emit("add-to-cart", {
        item: data,
        requestBy: "diy"
      });
    },
    addToCartResult(data) {
      if (data.success) {
        window.location.href = "/order/checkout";
      } else {
        console.log("Error : " + data.message);
      }
    },
    getTldList() {
      axios
        .get("/api/guest/get-tld-list")
        .then(res => {
          if (res.data) {
            this.tldList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    spinner(status) {
      this.$emit("spinner", status);
    },
    redirectOrder() {
      setTimeout(function(){
        window.location.href = "/order/website-instant/84";
      }, 3000);
    },
    isButtonDisabled() {
      if (
        (this.domainAction == 'owndomain' && this.ownDomainAddress=='') 
        || (this.domainAction == 'register' && this.registerSld=='')
      ) {
        return true;
      }
      return false;
    }
  },
  props: ["previewData", "addedCartResultDiy"],
  watch: {
    previewData: function(value) {
      this.data = value;
    },
    addedCartResultDiy: function(value) {
      this.addToCartResult(value);
    }
  }
};
</script>