<template>
    <section>
    <div v-bind:class="{'profile-modal modal fade': popup_version}" id="modalLogin" tabindex="-1" role="dialog" aria-labelledby="modalLoginLabel" aria-hidden="true">
        <div v-bind:class="{'modal-dialog profile-modal__dialog profile-modal__dialog--tranform-0': popup_version}">
            <div v-bind:class="{'modal-content profile-modal__content': popup_version}">
                <div id="client-information" class="client-information">
                    <button v-if="popup_version" type="button" ref="modalLoginClose" class="close profile-modal__close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h3 class="client-information__title" v-if="! popup_version">Informasi Anda</h3>
                    <p class="client-information__warning">Perhatian!</p>
                    <p class="client-information__note">
                        <span v-if="! popup_version">Anda <strong class="nunito--bold">belum Login/Registrasi.</strong><br></span>
                        Silakan lakukan login/registrasi terlebih dahulu untuk melanjutkan pembayaran Anda.
                    </p>
                    <div class="login-register">
                        <div class="text-center">
                            <ul class="orderflow-tab-menu orderflow-tab-menu--normal-size mb-5">
                                <li class="">
                                    <a href="javascript:void(0)" @click="selectTab(1)" :class="loginTabActive" class="nav-link">Masuk</a>
                                </li>
                                <li class="">
                                    <a href="javascript:void(0)" @click="selectTab(2)" :class="registerTabActive" class="nav-link">Daftar</a>
                                </li>
                            </ul>
                        </div>
                        <div @change="userOnInputChange" class="client-information__tab-content">
                            <div v-if="tab.login" class="content login">
                                <div class="step1">
                                    <div class="sosmed-wrapper">
                                        <button type="button" class="sosmed-button sosmed-button--google" @click="sosmedLogin(sosmed.GOOGLE)" onclick="Gtm.trackingClickCTA('CTA Click', 'Google_Login_Checkout_Clicked')">
                                            <span class="sosmed-button--google-text">Login dengan Google</span>
                                        </button>
                                        <button href="javascript(0);" type="button" class="sosmed-button sosmed-button--facebook" @click="sosmedLogin(sosmed.FACEBOOK)" onclick="Gtm.trackingClickCTA('CTA Click', 'Facebook_Login_Checkout_Clicked')">
                                            <span class="sosmed-button--facebook-text">Login dengan Facebook</span>
                                        </button>
                                    </div>
                                    <p class="sosmed__persuasive mt-5">Atau masuk  menggunakan email dan password</p>
                                    <div class="item row mt-5">
                                        <div class="form-group col-md-10 col-12">
                                            <label for="login-email">Email :</label>
                                            <input type="text" id="login-email" class="form-control" v-model="login.email" placeholder="Email Anda">
                                        </div>
                                    </div>
                                    <div class="item row">
                                        <div class="form-group col-md-10 col-12">
                                            <label for="login-password">Password :</label>
                                            <input type="password" id="login-password" class="form-control" @keyup.enter="loginAndCheckout" v-model="login.password" placeholder="*****">
                                        </div>
                                    </div>
                                    <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.login.message">{{ error_message.login.message }}!</p>
                                </div>
                                <div class="step2" style="display: none;">
                                    <div class="item text-center">
                                        <h4>Two Factor Authentication</h4>
                                    </div>
                                    <div class="item row">
                                        <div class="col-md-6 col-md-offset-3">
                                            <label for="auth-code">Authentication Code</label>
                                            <input type="text" id="auth-code" @keyup.enter="loginAndCheckout" v-model="login['2fa_code']" autofocus/>
                                            <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.login.message">{{ error_message.login.message }}!</p>
                                        </div>
                                    </div>
                                    <div class="item text-center">
                                        <a href="javascript:void(0)" @click="loginAndCheckout()" class="btn btn-success">Verify</a>
                                    </div>
                                </div>
                            </div>
                            <div v-if="tab.register" class="content register">
                                <div class="sosmed-wrapper">
                                    <button type="button" class="sosmed-button sosmed-button--google" @click="sosmedLogin(sosmed.GOOGLE, true)" onclick="Gtm.trackingClickCTA('CTA Click', 'Google_SignUp_Checkout_Clicked')">
                                        <span class="sosmed-button--google-text">Daftar dengan Google</span>
                                    </button>
                                    <button href="javascript(0);" type="button" class="sosmed-button sosmed-button--facebook" @click="sosmedLogin(sosmed.FACEBOOK, true)" onclick="Gtm.trackingClickCTA('CTA Click', 'Facebook_SignUp_Checkout_Clicked')">
                                        <span class="sosmed-button--facebook-text">Daftar dengan Facebook</span>
                                    </button>
                                </div>
                                <p class="sosmed__persuasive mt-5">Atau daftar melalui form berikut</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="email">Email :</label>
                                        <input type="text" id="email" class="form-control" v-model="register.email" placeholder="Email">
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.email">{{ error_message.register.email.error }}</p>
                                <div class="item row">
                                    <div  class="form-group col-md-10 col-12">
                                        <label for="reg_password">Password :</label>
                                        <input type="password" id="reg_password" class="form-control" v-model="register.password" placeholder="*****">
                                        <div v-if="show_check_password" class="check-password">
                                            <h5><strong>Password Harus Berisikan</strong></h5>
                                            <div class="col-md-12 check-item">
                                                <input id="min-char" class="custom-checkbox" type="checkbox" v-model="check_password.min_char" /> <label class="custom-checkbox-label">Minimal 6 Karakter</label>
                                            </div>
                                            <div class="col-md-12 check-item">
                                                <input id="no-space" class="custom-checkbox" type="checkbox" v-model="check_password.no_space" /> <label class="custom-checkbox-label">Tidak menggunakan spasi</label>
                                            </div>
                                            <div class="col-md-12 check-item">
                                                <input id="lowercase" class="custom-checkbox" type="checkbox" v-model="check_password.lowercase" /> <label class="custom-checkbox-label">Berisikan Lowercase</label>
                                            </div>
                                            <div class="col-md-12 check-item">
                                                <input id="uppercase" class="custom-checkbox" type="checkbox" v-model="check_password.uppercase" /> <label class="custom-checkbox-label">Berisikan Uppercase</label>
                                            </div>
                                            <div class="col-md-12 check-item">
                                                <input id="number" class="custom-checkbox" type="checkbox" v-model="check_password.number" /> <label class="custom-checkbox-label">Berisikan Angka</label>
                                            </div>
                                            <div class="col-md-12 check-item">
                                                <input id="special-char" class="custom-checkbox" type="checkbox" v-model="check_password.special_char" /> <label class="custom-checkbox-label"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.password">{{ error_message.register.password.error }}</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="name">Nama Lengkap :</label>
                                        <input type="text" id="name" class="form-control" v-model="register.name" placeholder="Nama Anda">
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.name">{{ error_message.register.name.error }}</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="company_name">Nama Perusahaan :</label>
                                        <input type="text" id="company_name" class="form-control" v-model="register.company" placeholder="Nama Perusahaan">
                                    </div>
                                </div>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="state">Provinsi :</label>
                                        <v-select :options="list_province" :clearable="false" v-model="register.state" @input="setListCity()" class="form-control" placeholder="Pilih Provinsi" id="state">
                                            <div slot="no-options">Provinsi tidak tersedia</div>
                                        </v-select>
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.state">{{ error_message.register.state.error }}</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="city">Kota :</label>
                                        <v-select :options="list_city" :clearable="false" v-model="register.city" class="form-control" placeholder="Pilih Kota/Kabupaten" id="city">
                                            <div slot="no-options">Kota/Kabupaten tidak tersedia</div>
                                        </v-select>
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.city">{{ error_message.register.city.error }}</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="postal_code">Kode Pos :</label>
                                        <input type="text" id="postal_code" class="form-control" v-model="register.postcode" placeholder="Kode Pos">
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.postcode">{{ error_message.register.postcode.error }}</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="address-1">Alamat :</label>
                                        <input type="text" id="address-1" class="form-control" v-model="register.address_1" v-on:keyup="onAddressChange"
                                                placeholder="Masukkan Jalan atau Gang, RT atau RW" maxlength="50">
                                        <div id="address-1-help" class="form-text">
                                            <span :class="{'text-danger' : (validation.register.address_1.valid === false), 'text-success': validation.register.address_1.valid}">{{ validation.register.address_1.message }}</span>
                                            <div id="address-1-help-counter" class="pull-right text-reset">{{ register.address_1.length }}/50</div>
                                        </div>
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.address_1">{{ error_message.register.address_1.error }}</p>
                                <div class="item row">
                                    <div class="form-group col-md-10 col-12">
                                        <label for="phone">No. Telepon :</label>
                                        <input type="text" id="phone" class="form-control" v-model="register.phone" placeholder="No. Telepon">
                                    </div>
                                </div>
                                <p style="margin: 0 0 10px 0;" class="text text-danger" v-if="error_message.register.phone">{{ error_message.register.phone.error }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row text-center">
                        <tos-text v-bind:device-class="'summary-cart__tos-mobile'"></tos-text>
                        <div class="col-12">
                            <a v-if="tab.login" href="javascript:void(0)" @click="loginAndCheckout()" :class="{'button-white-orange': login.email, 'button-grey': !login.email}" class="login client-information__button button-default">Login &amp; Bayar</a>
                            <a v-if="tab.register" href="javascript:void(0)" @click="registerAndCheckout()" :class="{'button-white-orange': register.email, 'button-grey': !register.email}" class="register client-information__button button-default">Daftar &amp; Bayar</a>            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>
</template>

<script>
    import CommonMethods from "../CommonMethods"
    import TosText from "./TosText.vue"

    export default {
        name: "ClientInformation",
        props: ['list_state', 'province_city', 'facebook_endpoint', 'google_endpoint', 'show_modal_2fa', 'autocheckout', 'checkout_v3'],
        components: {
          TosText
        },
        data: function () {
            return  {
                list_province: [],
                list_city: [],
                popup_version: false,
                disable_autocheckout: false,
                sosmed:{
                    GOOGLE:'GOOGLE',
                    FACEBOOK:'FACEBOOK'
                },
                tab: {
                    register: false,
                    login: true,
                },
                client: false,
                login: {
                    id: '',
                    email: '',
                    password: '',
                    '2fa_code': '',
                    step: 1,
                    checkout_by_login: true,
                },
                register: {
                    id: '',
                    type: 'individual',
                    email: '',
                    password: '',
                    name: '',
                    company: '',
                    address_1: '',
                    city: '',
                    postcode: '',
                    state: '',
                    phone: '',
                },
                show_check_password: false,
                check_password: {
                    min_char: false,
                    no_space: false,
                    lowercase: false,
                    uppercase: false,
                    number: false,
                    special_char: false,
                },
                error_message: {
                    login: {

                    },
                    register: {

                    },
                },
                validation: {
                    register: {
                        address_1: {
                            valid: null,
                            message: "Maksimal 50 karakter",
                            message_default: "Maksimal 50 karakter",
                            message_success: "Alamat sudah valid",
                            regexps: [
                                {
                                    regexp: new RegExp(/^.{2,50}$/u),
                                    message_error: "Alamat harus memiliki maksimal 50 karakter dengan minimal 1 angka dan 1 huruf"
                                },
                                {
                                    regexp: new RegExp(/^(?=.*?[0-9])(?=.*?[^0-9 ]).{2,50}$/u),
                                    message_error: "Alamat harus memiliki minimal 1 angka dan 1 huruf"
                                },
                                {
                                    regexp: new RegExp(/^(?=.*?[0-9])(?=.*?[^0-9 ])(?!.*?[<>~°º!@#$%^&*+_=()|\\\/'"\]\[\{\}]).{2,50}$/u),
                                    message_error: `Alamat tidak dapat memiliki karakter khusus berikut <>~°º!@#$%^&*+_=()|\/'"[]{}`
                                }
                            ]
                        }
                    }
                }
            }
        },
        methods: {
            selectTab(index) {
                if (index === 1) {
                    this.tab.login = true;
                    this.tab.register = false;
                } else {
                    this.tab.register = true;
                    this.tab.login = false;
                }
            },
            initPasswordCheckerBoard() {
                reg_password.addEventListener('focus', () => {
                    this.show_check_password = true;
                });

                reg_password.addEventListener('focusout', () => {
                    this.show_check_password = false;
                });

                reg_password.addEventListener("keyup", () => {
                    /*Min Char*/
                    if ( (this.register.password.length) >= 6 ) {
                        this.check_password.min_char = true;
                    } else {
                        this.check_password.min_char = false;
                    }

                    /*Check if ther is a space*/
                    let space = this.register.password.match(/\s+/g);
                    if (Array.isArray(space) && space.length > 0) {
                        this.check_password.no_space = false;
                    } else {
                        this.check_password.no_space = true;
                    }

                    /*Check if has lowercase*/
                    let lowercase = this.register.password.match(/[a-z]/g);
                    if (Array.isArray(lowercase) && lowercase.length > 0) {
                        this.check_password.lowercase = true;
                    } else {
                        this.check_password.lowercase = false;
                    }

                    /*Check if has uppercase*/
                    let uppercase = this.register.password.match(/[A-Z]/g);
                    if (Array.isArray(uppercase) && uppercase.length > 0) {
                        this.check_password.uppercase = true;
                    } else {
                        this.check_password.uppercase = false;
                    }

                    /*Check if has number*/
                    let number = this.register.password.match(/[0-9]/g);
                    if (Array.isArray(number) && number.length > 0) {
                        this.check_password.number = true;
                    } else {
                        this.check_password.number = false;
                    }

                    /*Check if has at least 1 special characters*/
                    let special_character = this.register.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g);
                    if (Array.isArray(number) && special_character.length > 0) {
                        this.check_password.special_char = true;
                    } else {
                        this.check_password.special_char = false;
                    }
                });
            },
            loginAndCheckout() {
                if (!this.login.email || !this.login.password) {
                    return false;
                }

                bus.$emit('show-spinner', true);
                this.loginClient(this.login).then((result) => {
                    let data = result.data;
                    if (data.result) {
                        if (data.result.must_reset_password) {
                            window.location.href = CommonVar.bb_url + '/reset-password?email=' + data.result.email;
                        } else if (data.result.use_2fa) {
                            this.login.step = 2;
                            $('.step1').hide();
                            $('.step2').show();
                            bus.$emit('show-spinner', false);
                            return false;
                        }

                        this.login.id = data.result.id;
                        this.client = this.login;
                        this.$emit('set-client', this.client);

                        this.checkoutNow();
                        this.hideLoginButton();
                    } else {
                        if (data.error.code === 1) {
                            this.$root.$emit('set-coupon-status', {
                                result: false,
                                message: data.error.message,
                                error: true,
                            });
                        } else {
                            this.error_message.login = data.error;
                        }
                        bus.$emit('show-spinner', false);
                    }
                })
                .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            registerAndCheckout() {
                bus.$emit('show-spinner', true);
                if (this.register.company) {
                    this.register.type = 'company';
                }
                if (this.validation.register.address_1) {
                    this.validation.register.address_1.valid = null;
                    this.validation.register.address_1.message = this.validation.register.address_1.message_default;
                }
                axios.post('/api/guest/front_register', this.register)
                    .then( (res) => {
                        let result = res.data.result;
                        if (result.errors) {
                            this.error_message.register = result.errors;
                            bus.$emit('show-spinner', false);
                        } else if (result) {
                            this.register.id = result.client_id;
                            this.client = this.register;
                            this.$emit('set-client', this.client);

                            this.loginClient(this.register).then((result) => {
                                if (result.data.result.id) {
                                    this.checkoutNow(false);
                                    this.hideLoginButton();
                                }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },

            loginClient(params) {
                let timeStamp = new Date().getTime();
                return axios.post('/api/guest/front_login',
                          params,
                          {
                            headers: {
                              "BB-Signature": bb.signature(params, timeStamp),
                              "Timestamp": timeStamp
                            }
                          })
                          .then( (result) => {
                              return result;
                          }).catch((err) => {
                              console.log(err);
                              bus.$emit('show-spinner', false);
                          });
            },

            hideLoginButton() {
                let clientNotLogin = document.getElementsByClassName('client-not-login');
                let clientLogin = document.getElementsByClassName('client-login');

                Array.from(clientNotLogin).forEach(function (element) {
                    element.style.display = "none";
                });

                Array.from(clientLogin).forEach(function(element) {
                    element.classList.remove('hide');
                    element.style.display = "inline-block";
                });
            },

            checkoutNow(clearAffCookie = true) {
                bus.$emit('show-spinner', false);
                if (! this.disable_autocheckout) {
                    bus.$emit('checkout-now', clearAffCookie);
                }
                if (this.popup_version) {
                    if (this.$refs.modalLoginClose == undefined) {
                        location.reload();
                    }
                    this.$refs.modalLoginClose.click();
                }
            },
            checkInputForm() {
                if ((this.tab.login && this.login.email && this.login.password) || (this.tab.register && this.register.email && this.register.password && this.register.phone)) {
                    return true
                } else {
                    return false
                }
            },
            sosmedLogin(mode = 'GOOGLE', register = false) {
                let checkout = 1;
                if (this.disable_autocheckout) {
                    checkout = 0;
                }
                let params = new URLSearchParams({
                    'next': `${window.location.pathname}?onPage=1&autoCheckout=${checkout}`,
                    'twoFaPage': `${window.location.pathname}`,
                    'source': 'checkout_page'
                });

                if (mode == this.sosmed.GOOGLE) {
                    window.location.href = `${this.google_endpoint}?${params}`;
                } else if (mode == this.sosmed.FACEBOOK) {
                    window.location.href = `${this.facebook_endpoint}?${params}`;
                } else {
                    alert('Login method not supported')
                }
            },
            showModal2Fa() {
                if (this.show_modal_2fa) {
                    this.login.step = 2;
                    $('.step1').hide();
                    $('.step2').show();
                    bus.$emit('show-spinner', false);
                }
            },
            onAddressChange() {
                this.error_message.register.address_1 = null;
                this.validation.register.address_1.valid = null;
                this.validation.register.address_1.message = this.validation.register.address_1.message_default;

                this.validation.register.address_1.regexps.every((rg) => {
                    if (! this.register.address_1.match(rg.regexp)) {
                        this.validation.register.address_1.valid = false;
                        this.validation.register.address_1.message = rg.message_error;
                        return false;
                    }
                    this.validation.register.address_1.valid = true;
                    this.validation.register.address_1.message = this.validation.register.address_1.message_success;
                    return true;
                });
            },
            setListProvince() {
                let province = [];
                Object.keys(this.province_city).forEach(function(index){
                    province.push(index);
                });
                this.list_province = province.sort(function (a, b) {
                    return a.localeCompare(b);
                });
            },
            setListCity() {
                let listCity = this.province_city[this.register.state];
                let city = [];
                Object.keys(listCity).forEach(function(index){
                    city.push(listCity[index].replace('.',''));
                });
                this.list_city = city.sort(function (a, b) {
                    return a.localeCompare(b);
                });
            },
        },
        computed: {
            registerTabActive: function () {
              return this.tab.register ? 'active' : false;
            },
            loginTabActive: function () {
              return this.tab.login ? 'active' : false;
            },
            userOnInputChange() {
                if (this.checkInputForm()) {
                    return this.$root.$emit('user-input-change', true);
                } else {
                    return this.$root.$emit('user-input-change', false);
                }
            }
        },
        mounted: function () {
            if (this.checkout_v3 == 1) {
                this.disable_autocheckout = true;
                this.popup_version = true;
            }
            this.setListProvince();
            window.dataLayer = window.dataLayer || []; 
            bus.$on('init-password-checker', () => {
                this.initPasswordCheckerBoard();
            });
            setTimeout(() => {
            bus.$on('login-register-checkout', () => {
                if (this.tab.login) {
                    this.loginAndCheckout();
                }
                if (this.tab.register) {
                    this.registerAndCheckout();
                }
            });
            }, 100);
            if (this.autocheckout > 0) {
                setTimeout(() => {
                    this.checkoutNow(false);
                }, 1000)
                
            }
        },
    }
</script>

<style scoped>

</style>