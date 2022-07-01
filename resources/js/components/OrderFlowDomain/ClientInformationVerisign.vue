<template>
    <div class="section-client">
       <div class="separate-section"></div>
       <div class="section-body">
          <div class="card card-padding">
             <div class="login-register">
                <div class="tabs">
                   <div class="tab-nav">
                      <a href="javascript:void(0)" @click="selectTab(1)" :class="loginTabActive" class="button-default tab-nav-left">Masuk</a>
                      <a href="javascript:void(0)" @click="selectTab(2)" :class="registerTabActive" class="button-default tab-nav-right">Daftar</a>
                   </div>
                   <div class="tab-content">
                      <div v-if="tab.register" class="content register text-left">
                         <div class="row">
                            <div class="col-md-6">
                               <div class="form-register">
                                  <div class="item row">
                                     <div class="col-md-11">
                                        <label class="nunito-regular font-size-16 color-4d5872" for="email">Nama :</label>
                                        <input type="text" id="name" class="pretty-input" v-model="register.name" placeholder="Nama Anda">
                                     </div>
                                  </div>
                                  <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.name">{{ error_message.register.name.error }}!</p>
                                  <div class="item row">
                                     <div class="col-md-11">
                                        <label class="nunito-regular font-size-16 color-4d5872" for="email">Email :</label>
                                        <input type="text" id="email" class="pretty-input" v-model="register.email" placeholder="Email Anda">
                                     </div>
                                  </div>
                                  <div class="item row">
                                     <div class="col-md-11">
                                        <label class="nunito-regular font-size-16 color-4d5872" for="password">Password :</label>
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
                                  <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.email">{{ error_message.register.email.error }}!</p>
                                  <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.password">{{ error_message.register.password.error }}!</p>
                                  <div class="item row">
                                     <div class="col-md-11">
                                        <div @click="agreeTos()" class="pretty-checkbox">
                                           <input type="checkbox" name="agree_tos" value="1"v-model="register.agree_tos"/>
                                           <span class="checkbox-icon checkbox-title font-size-16"></span>
                                           <a href="/syarat-dan-ketentuan" target="_blank" rel="noopener noreferrer" class="nunito-regular font-size-16 color-4d5872 tos-link">I Agree with the Terms and Privacy Policies</a>
                                        </div>
                                     </div>
                                  </div>
                                  <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.register.message">{{ error_message.register.message }}!</p>
                                  <div class="item row box-submit">
                                     <div class="col-md-11">
                                        <a href="javascript:void(0)" @click="registerAndCheckout()" class="button-default button-white-blue btn-hover-blue">Daftar & Checkout</a>
                                     </div>
                                  </div>
                                  <div class="mar_top1"></div>
                               </div>
                            </div>
                            <div class="col-md-6">
                               <div class="item row">
                                  <div class="col-md-11">
                                     <span class="nunito-bold font-size-18">Sign up with Social Network :</span>
                                  </div>
                               </div>
                               <div class="item row">
                                  <div class="col-md-11">
                                     <div class="col-md-6">
                                        <a href="javascript:void(0)" @click="loginFacebook()" class="button-default button-facebook">Facebook</a>
                                     </div>
                                     <div class="col-md-6">
                                        <a href="javascript:void(0)" @click="loginGoogle()" class="button-default button-google">Google</a>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div v-if="tab.login" class="content login">
                         <div class="item row text-left">
                            <div class="col-md-6">
                               <label class="nunito-regular font-size-16 color-4d5872" for="email">Email :</label>
                               <input type="text" id="email" class="pretty-input" v-model="login.email"
                                                                                  v-on:set-email="login.email = $event"
                               placeholder="Email Anda">
                            </div>
                            <div class="col-md-6">
                               <label class="nunito-regular font-size-16 color-4d5872" for="email">Password :</label>
                               <input type="password" id="password" class="pretty-input" v-model="login.password"
                                                                                         v-on:set-password="login.password = $event"
                               placeholder="*****">
                            </div>
                         </div>
                         <div class="item row text-left">
                            <div class="col-md-12">
                               <div @click="agreeTos()" class="pretty-checkbox">
                                  <input type="checkbox" name="agree_tos" value="1" v-model="register.agree_tos"/>
                                  <span class="checkbox-icon checkbox-title font-size-16"></span>
                                  <a href="/syarat-dan-ketentuan" target="_blank" rel="noopener noreferrer" class="nunito-regular font-size-16 color-4d5872 tos-link">I Agree with the Terms and Privacy Policies</a>
                               </div>
                            </div>
                         </div>
                         <p style="margin: 10px 0;" class="text text-danger" v-if="error_message.login.message">{{ error_message.login.message }}!</p>
                         <div class="item row box-submit">
                            <div class="col-md-12">
                               <a href="javascript:void(0)" @click="loginAndAddCart()"
                                                            v-on:login-and-add-cart="loginAndAddCart"
                               class="button-default button-white-blue btn-hover-blue">Masuk & Checkout</a>
                            </div>
                         </div>
                         <div class="mar_top3"></div>
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
        name: "ClientInformationVerisign",
        data: function () {
            return  {
                tab: {
                    register: true,
                    login: false,
                },

                client: false,

                login: {
                    email: '',
                    password: '',
                    agree_tos: false,
                },

                register: {
                    type: 'individual',
                    email: '',
                    password: '',
                    name: '',
                    agree_tos: false,
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

            agreeTos() {
                this.register.agree_tos = ! this.register.agree_tos;
                this.login.agree_tos = ! this.login.agree_tos;
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

            loginAndAddCart() {
                bus.$emit('show-spinner', true);

                if (! this.login.email || ! this.login.password) {
                    return false;
                }

                if (! this.login.agree_tos) {
                    this.error_message.login = {message: 'Silakan menyetujui syarat dan ketentuan yang berlaku'};

                    bus.$emit('show-spinner', false);

                    return;
                }

                let timeStamp = new Date().getTime();

                axios.post('/api/guest/front_login',
                    this.login,
                    {
                      headers: {
                        "BB-Signature": bb.signature(this.login, timeStamp),
                        "Timestamp": timeStamp
                      }
                    })
                    .then( (res) => {
                        let data = res.data;
                        if (data.result) {
                            if (data.result.must_reset_password) {
                                window.location.href = CommonVar.bb_url + '/reset-password?email=' + data.result.email;
                            }
                            this.client = this.login;
                            this.$emit('set-client', this.client);
                            bus.$emit('show-spinner', false);
                            this.$emit('add-domain-to-cart');
                            this.$emit('set-orderflow-step', 2);
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

                if (! this.register.agree_tos) {
                    this.error_message.register = {message: 'Silakan menyetujui syarat dan ketentuan yang berlaku'};

                    bus.$emit('show-spinner', false);

                    return;
                }

                axios.post('/api/guest/front_register', this.register)
                    .then( (res) => {
                        let result = res.data.result;

                        if (result.errors) {
                            this.error_message.register = result.errors;
                            bus.$emit('show-spinner', false);
                        } else if (result) {
                            this.client = this.register;
                            bus.$emit('show-spinner', false);
                            this.loginClient(this.register).then((result) => {
                                let data = result.data;
                                if (data.result) {
                                    this.$emit('set-client', data.result);
                                    this.$emit('add-domain-to-cart');
                                    this.$emit('set-orderflow-step', 2);
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

            loginFacebook() {
                window.open("/login/facebook?ref=register", "Ratting", "width=800,height=500,0,status=0,");
            },

            loginGoogle() {
                window.open("/login/google", "Ratting", "width=800,height=500,0,status=0,");
            },

            setCookie(key, value, days) {
                let d = new Date();
                d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = key + "=" + value + ";" + expires + ";path=/";
            },
        },
        computed: {
            registerTabActive: function () {
                return {
                    'button-white-blue item-down': this.tab.register === false,
                    'button-white item-up': this.tab.register,
                }
            },
            loginTabActive: function () {
                return {
                    'button-white-blue item-down': this.tab.login === false,
                    'button-white item-up': this.tab.login,
                }
            }
        },
        mounted: function () {
            this.initPasswordCheckerBoard();
        },
    }
</script>
