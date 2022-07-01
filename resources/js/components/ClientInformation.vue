<template>
    <div id="client-information" class="section-client-information">
        <div class="section-title">
            <h3 class="nunito-bold font-size-24 color-4d5872">INFORMASI ANDA</h3>
        </div>
        <div class="section-body">
            <div class="card card-padding">
                <div class="note">
                    <p class="nunito-bold font-size-20 color-fbbd0e">
                        <span class="fa fa-exclamation-triangle" style="margin-right: 10px"></span>
                        Perhatian!
                    </p>
                    <p class="nunito-regular font-size-16 color-4d5872">
                        Anda <b>belum Login/Registrasi.</b>
                        Silakan lakukan login/registrasi terlebih dahulu untuk melanjutkan pembayaran Anda.
                    </p>
                </div>

                <div class="login-register">

                    <div class="tabs">
                        <div class="tab-nav">
                            <a href="javascript:void(0)" @click="selectTab(1)" :class="loginTabActive" class="button-default tab-nav-left">Masuk</a>
                            <a href="javascript:void(0)" @click="selectTab(2)" :class="registerTabActive" class="button-default tab-nav-right">Daftar</a>
                        </div>
                    </div>

                    <div class="tab-content">
                        <div v-if="tab.login" class="content login">
                            <div class="step1">
                                <div class="item row">
                                    <div class="col-md-12 no-padding">
                                        <label class="nunito-regular font-size-16 color-4d5872" for="login-email">Email :</label>
                                        <input type="text" id="login-email" class="pretty-input" v-model="login.email" placeholder="Email Anda">
                                    </div>
                                </div>
                                <div class="item row">
                                    <div class="col-md-12 no-padding">
                                        <label class="nunito-regular font-size-16 color-4d5872" for="login-password">Password :</label>
                                        <input type="password" id="login-password" @keyup.enter="loginAndCheckout" class="pretty-input" v-model="login.password" placeholder="*****">
                                    </div>
                                </div>
                                <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.login.message">{{ error_message.login.message }}!</p>
                                <div class="item text-center">
                                    <a href="javascript:void(0)" @click="loginAndCheckout()" class="button-default">Login & Checkout</a>
                                </div>
                            </div>
                            <div class="step2" style="display: none;">
                                <div class="item text-center">
                                    <h4>Two Factor Authentication</h4>
                                </div>
                                <div class="item row">
                                    <div class="col-md-6 col-md-offset-3">
                                        <label for="auth-code">Authentication Code</label>
                                        <input type="text" id="auth-code" @keyup.enter="loginAndCheckout" class="pretty-input" v-model="login['2fa_code']" autofocus/>
                                        <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.login.message">{{ error_message.login.message }}!</p>
                                    </div>
                                </div>
                                <div class="item text-center">
                                    <a href="javascript:void(0)" @click="loginAndCheckout()" class="btn btn-success">Verify</a>
                                </div>
                            </div>

                        </div>

                        <div v-if="tab.register" class="content register">
                            <div class="item row">
                                <div class="col-md-6 email-wrapper">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="email">Email :</label>
                                    <input type="text" id="email" class="pretty-input" v-model="register.email" placeholder="Email">
                                </div>
                                <div  class="col-md-6 password-wrapper">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="reg_password">Password :</label>
                                    <input type="password" id="reg_password" class="pretty-input" v-model="register.password" placeholder="*****">
                                    <div v-if="show_check_password" class="check-password">
                                        <h5><strong>Password Harus Berisikan</strong></h5>
                                        <div class="col-md-12 check-item">
                                            <input id="min-char" class="custom-checkbox" type="checkbox" v-model="check_password.min_char" /> <label class="custom-checkbox-label">Minimal 7 Karakter</label>
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
                                    </div>
                                </div>
                            </div>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.email">{{ error_message.register.email.error }}</p>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.password">{{ error_message.register.password.error }}</p>
                            <div class="item row">
                                <div class="col-md-12 no-padding">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="name">Nama Lengkap :</label>
                                    <input type="text" id="name" class="pretty-input" v-model="register.name" placeholder="Nama Anda">
                                </div>
                            </div>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.name">{{ error_message.register.name.error }}!</p>
                            <div class="item row">
                                <div class="col-md-12 no-padding">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="company_name">Nama Perusahaan :</label>
                                    <input type="text" id="company_name" class="pretty-input" v-model="register.company" placeholder="Nama Perusahaan">
                                </div>
                            </div>
                            <div class="item row">
                                <div class="col-md-12 no-padding">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="address-1">Alamat :</label>
                                    <input type="text" id="address-1" class="pretty-input" v-model="register.address_1"
                                           placeholder="Masukkan Jalan atau Gang, RT atau RW">
                                </div>
                            </div>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.address_1">{{ error_message.register.address_1.error }}!</p>
                            <div class="item row">
                                <div class="col-md-12 no-padding">
                                    <input type="text" id="address-2" class="pretty-input" v-model="register.address_2"
                                           placeholder="Masukkan Kelurahan atau Desa Anda">
                                </div>
                            </div>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.address_2">{{ error_message.register.address_2.error }}!</p>
                            <div class="item row">
                                <div class="col-md-12 no-padding">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="city">Kota :</label>
                                    <input type="text" id="city" class="pretty-input" v-model="register.city"
                                           placeholder="Masukkan Kota Anda">
                                </div>
                            </div>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.city">{{ error_message.register.city.error }}!</p>
                            <div class="item row">
                                <div class="col-md-6 postcode-wrapper">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="postal_code">Kode Pos :</label>
                                    <input type="text" id="postal_code" class="pretty-input" v-model="register.postcode" placeholder="Kode Pos">
                                </div>
                                <div class="col-md-6 phone-wrapper">
                                    <label class="nunito-regular font-size-16 color-4d5872" for="phone">No. Telepon :</label>
                                    <input type="text" id="phone" class="pretty-input" v-model="register.phone" placeholder="No. Telepon">
                                </div>
                            </div>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.postcode">{{ error_message.register.postcode.error }}!</p>
                            <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.phone">{{ error_message.register.phone.error }}!</p>
                            <div class="item row text-center">
                                <a href="javascript:void(0)" @click="registerAndCheckout()" class="button-default">Daftar & Checkout</a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import CommonMethods from "../CommonMethods";

    export default {
        name: "ClientInformation",
        data: function () {
            return  {
                tab: {
                    register: true,
                    login: false,
                },
                client: false,
                login: {
                    id: '',
                    email: '',
                    password: '',
                    '2fa_code': '',
                    step: 1,
                },
                register: {
                    id: '',
                    type: 'individual',
                    email: '',
                    password: '',
                    name: '',
                    company: '',
                    address_1: '',
                    address_2: '',
                    city: '',
                    postcode: '',
                    phone: '',
                },
                show_check_password: false,
                check_password: {
                    min_char: false,
                    no_space: false,
                    lowercase: false,
                    uppercase: false,
                    number: false,
                },
                error_message: {
                    login: {

                    },
                    register: {

                    },
                },
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
                    if ( (this.register.password.length) > 6 ) {
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
                        CommonMethods.setCookie('BOXCCBR', false, 30);
                        this.checkoutNow();
                        this.hideLoginButton();
                    } else {
                        this.error_message.login = data.error;
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
                            CommonMethods.setCookie('BOXCCBR', true, 30);
                            this.loginClient(this.register).then((result) => {
                                if (result.data.result.id) {
                                    this.checkoutNow();
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

            checkoutNow() {
                if (screen.width <= 1049) {
                    window.scrollTo(0,document.body.scrollHeight);
                    bus.$emit('show-spinner', false);
                } else {
                    let isLoginByRegister = CommonMethods.getCookie('BOXCCBR');
                    if (isLoginByRegister) {
                        bus.$emit('checkout-now', false);
                    } else {
                        bus.$emit('checkout-now', true);
                    }
                }
            }
        },
        computed: {
            registerTabActive: function () {
                return {
                    'button-light-grey item-down': this.tab.register === false,
                    'button-blue-bordered-shadowed item-up': this.tab.register,
                }
            },
            loginTabActive: function () {
                return {
                    'button-light-grey item-down': this.tab.login === false,
                    'button-blue-bordered-shadowed item-up': this.tab.login,
                }
            }
        },
        mounted: function () {
            bus.$on('init-password-checker', () => {
                this.initPasswordCheckerBoard();
            });
        },
    }
</script>

<style scoped>

</style>
