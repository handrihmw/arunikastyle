<template>
    <section id="additional-feature-wrapper" class="additional-feature">
        <h3 class="orderflow-domain__title">4. Rekomendasi Fitur Pendukung <span class="badge-orange">Opsional</span></h3>
        <p class="orderflow-domain__subtitle">Buat website makin handal dengan fitur pendukung. Untuk menambahkan fitur pendukung, silakan tambahkan domain terlebih dahulu.</p>
        <div class="additional-feature__container">
            <h3 class="additional-feature__title">Pilihan Fitur Pendukung</h3>
            <div class="additional-feature__addon" v-if="flow !== 'vps'">
                <div v-if="flow !== 'mailhosting'">
                    <div class="row mb-5 align-items-center" v-if="! this.isWordpressHosting()">
                        <div class="d-none d-lg-block col-lg-2">
                            <img :src="'/assets/images/orderflow/icons-wordpress.svg'" alt="Auto Install WordPress" />
                        </div>
                        <div class="col-12 col-lg-10">
                            <p class="additional-feature__addon-title">Auto Install Website Wordpress</p>
                            <div class="row align-items-start">
                                <div class="col-md-7 col-sm-12">
                                    <p class="additional-feature__addon-description">
                                        Install WordPress tanpa repot, hanya dengan satu kali klik! Proses instalasi akan berlangsung secara otomatis dan website akan siap dijalankan dalam beberapa menit.
                                    </p>
                                    <p v-if="additional_feature.wordpress.price > 0" class="additional-feature__addon-price">
                                        Rp <span>{{ additional_feature.wordpress.price | formatPrice }}</span>/tahun
                                    </p>
                                    <p v-else class="additional-feature__addon-price">
                                        <span>GRATIS</span>
                                    </p>
                                </div>
                                <div class="col-md-5 col-sm-12">
                                    <button @click="autoInstallWebsite($event.target)" @click.prevent="is_loading == true"
                                        class="button-default button-white-orange additional-feature__addon-button gtmAddon mt-5"
                                        :class="{'select--disabled': additional_feature.wordpress.selected == true }"
                                        data-addon="Auto Install Website Wordpress"
                                    >
                                        Tambah ke Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="checkFreeSslInCart() === false">
                        <hr />
                        <div class="row mt-5 mb-5 align-items-center">
                            <div class="col-lg-2 d-none d-lg-block">
                                <img :src="'/assets/images/orderflow/gratis-ssl.svg'" alt="Auto Install WordPress" />
                            </div>
                            <div class="col-12 col-lg-10">
                                <p class="additional-feature__addon-title">
                                    Premium Commodo SSL
                                </p>
                                <div class="row align-items-start">
                                    <div class="col-md-7 col-sm-12">
                                        <p class="additional-feature__addon-description">
                                            Transfer data terenkripsi, keamanan transaksi terjamin, performa SEO handal, serta kepercayaan pelanggan meningkat dengan perlindungan dari sertifikat SSL Premium Commodo terbaik.
                                        </p>
                                        <div v-if="ssl_plans > 1">
                                            <div ref="select-plan" @click="show_ssl_plan = !show_ssl_plan" :class="{'additional-feature__select--show': show_ssl_plan, 'select--disabled': additional_feature.ssl.selected}" class="additional-feature__select">
                                                <p class="additional-feature__select-title">{{additional_feature.ssl.title}} <span v-if="additional_feature.ssl.price" class="float-right pr-lg-5 d-none d-lg-block">{{ additional_feature.ssl.price | formatPrice }}/Tahun</span></p>
                                            </div>
                                            <ul v-if="show_ssl_plan" v-closable="{exclude: ['select-plan'], handler: 'onClose'}" class="additional-feature__ssl-options">
                                                <li v-for="ssl in ssl_plans" :key="ssl.id" @click="chooseSslPlan(ssl.id, ssl.title, ssl.pricing.recurrent[additional_feature.ssl.period].price)" class="text-capitalize">{{ssl.title}} <span class="float-right d-none d-lg-block">{{ ssl.pricing.recurrent[additional_feature.ssl.period].price | formatPrice}}/Tahun</span></li>
                                            </ul>
                                        </div>
                                        <p v-else-if="additional_feature.ssl.price > 0" class="additional-feature__addon-price">
                                            Rp <span>{{ additional_feature.ssl.price | formatPrice }}</span>/tahun
                                        </p>
                                        <p v-else class="additional-feature__addon-price">
                                            <span>GRATIS</span>
                                        </p>
                                    </div>
                                    <div class="col-md-5 col-sm-12">
                                        <button @click="addRemoveSSLToCart($event.target)" @click.prevent="is_loading == true"
                                            class="button-default button-white-orange additional-feature__addon-button gtmAddon mt-5"
                                            :class="{'select--disabled': additional_feature.ssl.selected == true }"
                                            data-addon="Keamanan SSL Certificate (HTTPS)"
                                        >
                                            Tambah ke Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="tmp_domain.action == 'register' && flow != 'orderdomain' && inArray(tmp_domain.register_tld, additional_feature.domainprivacy.valid_domain)" class="d-none invisible">
                    <hr />
                    <div class="row mt-5 mb-5">
                        <div class="col-lg-2 d-none d-lg-block">
                            <img :src="'/assets/images/orderflow/Proteksi-whois.svg'"
                                alt="Perlindungan Privasi WHOIS" />
                        </div>
                        <div class="col-12 col-lg-10">
                            <p class="additional-feature__addon-title">
                                Perlindungan Privasi WHOIS
                                <span class="additional-feature__addon-title--sub">Rp 45rb/domain per tahun</span>
                            </p>
                            <div class="row align-items-start">
                                <div class="col-8 col-lg-10">
                                    <p class="additional-feature__addon-description">Cegah pembajakan dan spam ke domain
                                        Anda dengan melindungi nama, alamat, dan identitas Anda</p>
                                </div>
                                <div class="col-4 col-lg-2">
                                    <div @click="addRemovePrivacyProtectionToCart"
                                        :class="{'additional-feature__addon-cart--selected': additional_feature.domainprivacy.selected == true }"
                                        class="additional-feature__addon-cart gtmAddon" data-addon="Perlindungan Privasi WHOIS">
                                        <input type="hidden" name="privacy_protection" value="1" v-model="additional_feature.domainprivacy.selected" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="row mb-5" v-if="this.plan_type !== 'cyberpanel' && this.plan_type !== 'cpanel'">
                    <div class="d-none d-lg-block col-lg-2">
                        <img
                            :src="'/assets/images/orderflow/additional-cloud-vps.png'"
                            alt="Control Panel CLoud VPS"
                            loading="lazy"
                        />
                    </div>
                    <div class="col-12 col-lg-10">
                        <p class="additional-feature__addon-title">Control Panel Cloud VPS</p>
                        <div class="row align-items-start">
                            <div class="col-10">
                                <div
                                    class="additional-feature__select"
                                    ref="select-plan"
                                    @click="show_addons = !show_addons"
                                    :class="{
                                        'additional-feature__select--show': show_addons,
                                        'select--disabled': additional_feature.vps.selected,
                                    }">
                                    <p class="additional-feature__select-title">
                                        <strong>
                                            {{ additional_feature.vps.title }}
                                            <span v-if="additional_feature.vps.price" class="float-right pr-lg-5 d-none d-lg-block">
                                                {{ pricePerPeriod(additional_feature.vps.price, additional_feature.vps.period) }}
                                            </span>
                                        </strong>
                                    </p>
                                </div>
                            <ul
                                v-if="show_addons && !additional_feature.vps.selected"
                                v-closable="{ exclude: ['select-plan'], handler: 'onClose' }"
                                class="additional-feature__vps-options"
                            >
                                <li @click="resetVpsPlan">
                                    <strong>Tanpa Control Panel (Saya Install Sendiri)</strong>
                                </li>
                                <li
                                v-for="addon in vps_addons"
                                :key="addon.id"
                                @click="
                                    chooseVpsPlan(
                                    addon.id,
                                    addon.title,
                                    totalAfterDiscount(addon.pricing.recurrent[additional_feature.vps.period])
                                    )
                                "
                                class="text-capitalize"
                                >
                                    <strong>
                                        {{ addon.title }}
                                        <span
                                        class="float-right d-none d-lg-block"
                                        style="font-size: 1.4rem"
                                        >
                                        {{ pricePerPeriod(totalAfterDiscount(addon.pricing.recurrent[additional_feature.vps.period]), additional_feature.vps.period) }}
                                        </span>
                                    </strong>
                                </li>
                            </ul>
                            <div
                                class="mt-4 additional-feature__addon"
                                v-if="additional_feature.vps.product_id > 0"
                            >
                                Termasuk instalasi otomatis
                                <span v-if="additional_feature.vps.product_id != 0">control panel &</span>
                                sistem operasi
                                <i
                                class="fa fa-question-circle float-right"
                                aria-hidden="true"
                                @mouseover="additional_feature.tooltip_message.show = true"
                                @mouseleave="additional_feature.tooltip_message.show = false"
                                ></i>
                                <div
                                class="additional-feature__addon-ribbon"
                                v-if="additional_feature.tooltip_message.show"
                                >
                                    {{ getTooltipsMessage }}
                                </div>
                            </div>
                        </div>
                        <div class="col-2">
                            <div @click="addVpsAddon"
                                :class="{'additional-feature__addon-cart--selected': (additional_feature.vps.selected || additional_feature.vps.product_id == 0) }"
                                class="additional-feature__addon-cart gtmAddon" 
                                data-addon="Control Panel Cloud VPS" 
                                :data-toggle="upgradePopupShow ? 'modal' : false" 
                                :data-target="upgradePopupShow ? '#upgradeConfirm' : false">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="d-none d-lg-block col-lg-2">
                        <img
                            :src="'/assets/images/orderflow/vps-daily-backup.png'"
                            alt="Backup Cloud VPS"
                            loading="lazy"
                        />
                    </div>
                    <div class="col-12 col-lg-10">
                        <p class="additional-feature__addon-title" v-if="plan_type === 'cpanel'">Backup VPS cPanel</p>
                        <p class="additional-feature__addon-title" v-else>Backup Cloud VPS</p>
                        <div class="row align-items-start">
                            <div class="col-10">
                                <div
                                    ref="select-plan"
                                    @click="show_daily_backup = !show_daily_backup"
                                    :class="{
                                    'additional-feature__select--show': show_daily_backup,
                                    'select--disabled': additional_feature.daily_backup_vps.selected,
                                    }"
                                    class="additional-feature__select"
                                >
                                    <p class="additional-feature__select-title">
                                    <strong>
                                        {{ additional_feature.daily_backup_vps.title }}
                                        <span
                                        v-if="additional_feature.daily_backup_vps.price"
                                        class="float-right pr-lg-4 d-none d-lg-block"
                                        >
                                        {{ pricePerPeriod(additional_feature.daily_backup_vps.price, additional_feature.daily_backup_vps.period) }}
                                        </span>
                                    </strong>
                                    </p>
                                </div>
                                <ul
                                    v-if="show_daily_backup && !additional_feature.daily_backup_vps.selected"
                                    v-closable="{ exclude: ['select-plan'], handler: 'onClose' }"
                                    class="additional-feature__vps-options"
                                >
                                    <li @click="resetDailyBackupPlan">
                                        <strong v-if="plan_type === 'cpanel'">Tanpa Backup VPS cPanel</strong>
                                        <strong v-else>Tanpa Backup Cloud VPS</strong>
                                    </li>
                                    <li
                                    v-for="addon in daily_backup_addons"
                                    :key="addon.id"
                                    @click="
                                        chooseDailyBackupVpsPlan(
                                        addon.id,
                                        addon.title,
                                        totalAfterDiscount(addon.pricing.recurrent[additional_feature.daily_backup_vps.period])
                                        )
                                    "
                                    class="text-capitalize"
                                    >
                                        <strong>
                                            {{ addon.title }}
                                            <span
                                            class="float-right d-none d-lg-block"
                                            style="font-size: 1.4rem"
                                            >
                                            {{
                                                pricePerPeriod(
                                                totalAfterDiscount(addon.pricing.recurrent[additional_feature.daily_backup_vps.period]),
                                                additional_feature.daily_backup_vps.period
                                                )
                                            }}
                                            </span>
                                        </strong>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-2">
                                <div
                                    @click="addDailyBackupVpsAddon"
                                    :class="{
                                    'additional-feature__addon-cart--selected':
                                        additional_feature.daily_backup_vps.selected ||
                                        additional_feature.daily_backup_vps.product_id == 0,
                                    }"
                                    class="additional-feature__addon-cart gtmAddon"
                                    data-addon="Backup Cloud VPS"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div v-if="toastPopupShow" class="popup-upgrade__toast">
                <div class="popup-upgrade__toast-left">
                    <img src='/assets/icons/icon-success-popup.svg' id="toast-success-icon" alt="icon-success">
                </div>
                <div class="popup-upgrade__toast-right" id="toast-text">{{ this.toast.message }}</div>
            </div>
        </transition>
    </section>
</template>

<script>
import CommonMethods from '../../CommonMethods';
export default {
    name: "NewAdditionalFeature",
    props: ["ssl_plans", "flow", "plan_type", "cart", "is_loading"],
    data() {
        return {
            period: CommonVar.period,
            tmp_domain: [],
            upgrade_popup : {
                show: false,
                status: false
            },
            toast: {
                show: false,
                message: ''
            },
            additional_feature: {
                tooltip_message: {
                    show: false,
                    message: 'sistem operasi Centos 7 siap digunakan ketika akun VPS Anda aktif'
                },
                vps: {
                    selected: false,
                    product_id: 0,
                    period: "1Y",
                    cart_product_id: "",
                    title: "Tanpa Control Panel (Saya Install Sendiri)",
                    price: 0,
                },
                daily_backup_vps: {
                    selected: false,
                    product_id: 0,
                    period: "1Y",
                    cart_product_id: "",
                    title: "Tanpa Backup Cloud VPS",
                    price: 0,
                },
                wordpress: {
                    selected: false,
                    product_id: 69,
                    period: "1Y",
                    cart_product_id: ""
                },
                install_wp_accelerator: {
                    selected: false
                },
                ssl: {
                    selected: false,
                    product_id: "",
                    period: "1Y",
                    cart_product_id: "",
                    title: "",
                    price: "",
                },
                domainprivacy: {
                    selected: false,
                    product_id: 33,
                    period: "1Y",
                    cart_product_id: "",
                    valid_domain: [".com", ".net", ".org", ".info"]
                },
            },
            plan_id: false,
            show_ssl_plan: false,
            daily_backup_addons: [],
            vps_addons: [],
            show_addons: false,
            show_daily_backup: false,
            button_loading: {
                target: null,
                defaultInnerHtml: ''
            }
        };
    },
    filters: {
        formatPrice(value) {
            return CommonMethods.formatPrice(value)
        },
    },
    computed: {
        getTooltipsMessage() {
            let message = '';
            if( this.additional_feature.vps.product_id != 0 ) {
                message += this.additional_feature.vps.title;
                message += ' dan ';
            }
            message += this.additional_feature.tooltip_message.message; 
            return message;
        },
        upgradePopupShow() {
            return this.upgrade_popup.show;
        },
        toastPopupShow() {
            return this.toast.show;
        }
    },
    methods: {
        chooseSslPlan(id, title, price) {
            this.additional_feature.ssl.product_id = id;
            this.additional_feature.ssl.title      = title;
            this.additional_feature.ssl.price      = price;
            this.show_ssl_plan = false;
        },
        resetVpsPlan() {
            this.additional_feature.vps.product_id = 0;
            this.additional_feature.vps.title      = 'Tanpa Control Panel (Saya Install Sendiri)';
            this.additional_feature.vps.price      = 0;
            this.additional_feature.vps.selected   = false;
            this.show_addons = false;
            this.emitNextBtn('reset');
            this.upgrade_popup.show = false;
            sessionStorage.setItem('upgrade_popup_status', 'disabled');
        },
        resetDailyBackupPlan() {
            this.additional_feature.daily_backup_vps.product_id = 0;
            this.additional_feature.daily_backup_vps.title      = 'Tanpa Backup Cloud VPS';
            this.additional_feature.daily_backup_vps.price      = 0;
            this.additional_feature.daily_backup_vps.selected   = false;
            this.show_daily_backup                              = false;
            this.emitNextBtn('reset'); 
        },
        chooseVpsPlan(id, title, price) {
            this.additional_feature.vps.product_id = id;
            this.additional_feature.vps.title      = title;
            this.additional_feature.vps.price      = price;
            this.show_addons = false;

            let tmp_cart  = JSON.parse(sessionStorage.getItem('tmp_cart'));
            if (
                this.additional_feature.vps.title.toLowerCase().indexOf('cpanel') !== -1 
                && tmp_cart.id == 2
                ) {
                this.upgrade_popup.show = true; 
            }
            this.emitNextBtn('choose'); 
        },
        chooseDailyBackupVpsPlan(id, title, price) {
            this.additional_feature.daily_backup_vps.product_id = id;
            this.additional_feature.daily_backup_vps.title      = title;
            this.additional_feature.daily_backup_vps.price      = price;
            this.show_daily_backup = false;
            this.emitNextBtn('choose'); 
        },
        addVpsAddon() {
            if (! this.upgrade_popup.show) {
                if (! this.additional_feature.vps.selected) {
                    bus.$emit('add-addon', this.additional_feature.vps.product_id);
                    bus.$emit('set-addon-template', this.additional_feature.vps.title);
                }
                if (this.additional_feature.vps.product_id != 0) {
                    this.additional_feature.vps.selected = true;
                }  
                this.emitNextBtn('add',this.additional_feature.daily_backup_vps);      
            }
        },
        addDailyBackupVpsAddon() {
            let product_id = this.additional_feature.daily_backup_vps.product_id;
            if (! this.additional_feature.daily_backup_vps.selected) {
                bus.$emit('add-addon', product_id);
            }
            if (product_id != 0) {
                this.additional_feature.daily_backup_vps.selected = true;
            } 
            this.emitNextBtn('add',this.additional_feature.vps);
        },
        emitNextBtn(type, addons = null){
            let status = false;
            if (type == 'reset') {
                status = false;
            } else if (type == 'choose') {
                status = true;
            } else if (type == 'add' && addons != null) {
                status = !(addons.selected || addons.product_id == 0);
            }
            bus.$emit('set-next-btn', status);
        },
        getTmpVpsAddons() {
            const vps_plan                                  = JSON.parse(sessionStorage.getItem('vps_plan'));
            this.additional_feature.vps.period              = vps_plan.period;
            this.additional_feature.daily_backup_vps.period = vps_plan.period;
            this.plan_id                                    = vps_plan.product_id;
            this.daily_backup_addons                        = this.filterAddon(vps_plan.plan.addons, false);
            this.vps_addons                                 = this.filterAddon(vps_plan.plan.addons);

            if(sessionStorage.getItem('tmp_additional')) {
                const addon = JSON.parse(sessionStorage.getItem('tmp_additional'));
                if(!addon && !addon.items.length) {
                    return;
                }
                addon.items.map(item => {
                    if (item.title.toLowerCase().indexOf('backups') == -1) {
                        this.chooseVpsPlan(item.id, item.title, item.total);
                        this.additional_feature.vps.selected = true;
                    } else {
                        this.chooseDailyBackupVpsPlan(item.id, item.title, item.total);
                        this.additional_feature.daily_backup_vps.selected = true;
                    }
                });
            }
            if (! sessionStorage.getItem('upgrade_popup_status')) {
                sessionStorage.setItem('upgrade_popup_status', 'disabled');
            }
        },
        filterAddon(addons, show_daily_backup = true) {
            return addons.filter(addon => {
                if(show_daily_backup) {
                    return addon.title.toLowerCase().indexOf("backups") == -1
                }
                return addon.title.toLowerCase().indexOf("backups") != -1
            });
        },
        setPlanUpgrade(){
            this.additional_feature.vps.selected = true;
            this.upgrade_popup.show              = false;
            sessionStorage.setItem('upgrade_popup_status', 'enabled');
            this.setBackupAddons();
        },
        resetPlanUpgrade() {
            const upgrade_status = sessionStorage.getItem('upgrade_popup_status');
            if (upgrade_status === 'enabled') {
                bus.$emit('upgrade-nano', 'reset');
                sessionStorage.setItem('upgrade_popup_status', 'disabled');
            }
        },
        setBackupAddons(){
            this.resetDailyBackupPlan();
            let tmp_addons           = JSON.parse(sessionStorage.getItem('tmp_additional'));
            let removedAddon         = tmp_addons.items.filter(el => el.title.includes('Backup'));
            const vps_plan           = JSON.parse(sessionStorage.getItem('vps_plan'));
            this.daily_backup_addons = this.filterAddon(vps_plan.plan.addons, false);
            if (removedAddon.length) {
                bus.$emit('remove-from-cart', 'tmp_additional', removedAddon[0].id);
            }
        },
        showToastPopup(message){
            this.toast.show    = true;
            this.toast.message = message; 
            setTimeout(() => {
                this.toast.show    = false;
                this.toast.message = ''; 
            }, 4000);
        },
        totalAfterDiscount(plan_period) {
            return plan_period.discount_enabled == 1 ? plan_period.discount_price : plan_period.price;
        },
        /* ADD ADDITIONAL FEATURE TO CART */
        autoInstallWebsite(triggeredButton) {
            if (triggeredButton) {
                this.button_loading.target = triggeredButton;
                this.button_loading.defaultInnerHtml = this.button_loading.target.innerHTML;
                this.button_loading.target.innerHTML = `<em class="fas fa-sync fa-spin mr-3"></em> Tambah ke Cart`;
            }
            bus.$emit("loading-state", true);
            this.additional_feature.wordpress.selected = !this.additional_feature.wordpress.selected;

            axios
                .post("/api/guest/add_remove_auto_install_website", {
                    is_add: this.additional_feature.wordpress.selected
                })
                .then(res => {
                    if (this.additional_feature.wordpress.selected) {
                        let wordpress = {
                            id: '',
                            type: 'wordpress',
                            title: '',
                            total: 0,
                            price: 0,
                        };
                        sessionStorage.setItem('additional_feature_wordpress', JSON.stringify(wordpress));
                    } else {
                        sessionStorage.removeItem('additional_feature_wordpress');
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    bus.$emit("loading-state", false);
                    this.installWpAccelerator();
                });
        },
        installWpAccelerator() {
            bus.$emit("loading-state", true);
            this.additional_feature.install_wp_accelerator.selected = !this.additional_feature.install_wp_accelerator.selected;

            axios
                .post("/api/guest/add_remove_install_wp_accelerator", {
                    is_add: this.additional_feature.install_wp_accelerator.selected
                })
                .then(res => {
                    bus.$emit("refresh-cart");
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    bus.$emit("loading-state", false);
                    this.resetLoadingButton();
                });
        },
        addRemoveSSLToCart(triggeredButton) {
            if (triggeredButton) {
                this.button_loading.target = triggeredButton;
                this.button_loading.defaultInnerHtml = this.button_loading.target.innerHTML;
                this.button_loading.target.innerHTML = `<em class="fas fa-sync fa-spin mr-3"></em> Tambah ke Cart`;
            }
            if (this.additional_feature.ssl.product_id) {
                this.additional_feature.ssl.selected = !this.additional_feature.ssl.selected;
                if (this.additional_feature.ssl.selected) {
                    this.addAdditionalFeatureToCart(
                        "ssl",
                        this.additional_feature.ssl.product_id,
                        this.additional_feature.ssl.period
                    );
                } else {
                    this.removeFromCart(this.additional_feature.ssl.cart_product_id, "ssl");
                }
            } else {
                bus.$emit("show-notification-message", "Silakan pilih SSL", true);
            }
        },
        initSslPlan() {
            this.ssl_plans.forEach(item => {
                if (item.id == 76) {
                    this.additional_feature.ssl.product_id = item.id
                    this.additional_feature.ssl.title = item.title
                    this.additional_feature.ssl.price = item.pricing.recurrent[this.additional_feature.ssl.period].price
                }        
            })
        },
        addRemovePrivacyProtectionToCart() {
            this.additional_feature.domainprivacy.selected = !this.additional_feature.domainprivacy.selected
            if (this.additional_feature.domainprivacy.selected) {
                this.addAdditionalFeatureToCart(
                    "domainprivacy",
                    this.additional_feature.domainprivacy.product_id,
                    this.additional_feature.domainprivacy.period
                );
            } else {
                this.removeFromCart(
                    this.additional_feature.domainprivacy.cart_product_id,
                    "domainprivacy"
                );
            }
        },
        addAdditionalFeatureToCart(type, product_id, period) {
            bus.$emit("loading-state", true);
            axios
                .post("/api/guest/add_additional_feature_to_cart", {
                    type: type,
                    product_id: product_id,
                    period: period
                })
                .then(res => {
                    let result = res.data.result;
                    this.additional_feature[result.type].cart_product_id = result.id;
                    sessionStorage.setItem('additional_feature_' + result.type, JSON.stringify(result) );
                    bus.$emit("refresh-cart");
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    bus.$emit("loading-state", false);
                    this.resetLoadingButton();
                });
        },
        removeFromCart(cart_product_id, type) { 
            bus.$emit("loading-state", true);
            axios
                .post("/api/guest/remove_from_cart", {
                    id: cart_product_id
                })
                .then(res => {
                    bus.$emit("refresh-cart");
                    if (type == 'wordpress' && this.additional_feature.wordpress.selected) {
                        this.autoInstallWebsite();
                    } else {
                        sessionStorage.removeItem('additional_feature_' + type);
                        this.additional_feature[type].selected = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    bus.$emit("loading-state", false);
                    this.resetLoadingButton();
                });
        },
        sslPrice() {
            this.ssl_plans.forEach(item => {
                this.additional_feature.ssl.price = price
            })
        },
        sslPriceStartingFrom() {
            let price;
            this.ssl_plans.forEach(item => {
                price = (item.price_starting_from - (item.price_starting_from % 1000)) / 1000;
            });
            return price;
        },
        getTmpDomain() {
            if ( sessionStorage.getItem('tmp_cart_domain') ) {
                this.tmp_domain = JSON.parse(sessionStorage.getItem('tmp_cart_domain'));
            }
        },
        inArray(needle, haystack) {
            return CommonMethods.inArray(needle, haystack);
        },
        isWordpressHosting() {
            if (sessionStorage.getItem('wordpress_hosting') || sessionStorage.getItem('managed_wordpress')) {
                return true
            }
            return false
        },
        pricePerPeriod(price, period) {
            const symbol = period.replace(/[0-9]/g, '');
            const text_period = this.period[period].text.replace(/[ 0-9]/g, '');
            let num_of_period = this.period[period].num_of_month;

            if (symbol == 'Y') {
                num_of_period = num_of_period / 12;
            }

            return this.$options.filters.formatPrice(
                Math.round(Number(price)/num_of_period)
            ) + '/' + text_period;
        },
        checkFreeSslInCart() {
            let status = false;
            this.cart.items.forEach(item => {
                if (item.product_id == 76 && item.free_ssl_hosting === true) {
                    status = true
                }
            });
            return status
        },
        resetLoadingButton() {
            if (this.button_loading.target) {
                this.button_loading.target.innerHTML = this.button_loading.defaultInnerHtml;
                this.button_loading.target = null;
                this.button_loading.defaultInnerHtml = '';
            }
        }
    },
    mounted: function() {
        this.getTmpDomain();
        setTimeout(() => {
            bus.$on("remove-item", item => {
                if (
                    item.type &&
                    this.additional_feature[item.type] &&
                    this.additional_feature[item.type].cart_product_id === item.id
                ) {
                    this.removeFromCart(item.id, item.type);
                }
            });
            bus.$on("set-upgrade", () => {
                this.showToastPopup('Paket berhasil diubah menjadi Paket Cloud VPS Mikro');
                this.setPlanUpgrade();
            });
            bus.$on("reset-plan-upgrade", () => {
                this.resetPlanUpgrade();
            });
            bus.$on("reset-selected-addon", () => {
                this.resetVpsPlan();
            });
        }, 100);
    },
    created() {
        if( this.flow !== 'vps' ) {
            this.initSslPlan();
        } else {
            this.getTmpVpsAddons();
        }
    }
};
</script>

<style scoped>
</style>
