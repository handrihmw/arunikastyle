<template>
    <div class="section-payment-method">
        <div class="section-title">
            <h3 class="nunito-bold font-size-24 color-4d5872">METODE PEMBAYARAN</h3>
        </div>
        <div class="section-body">
            <div class="card">
                <div class="payment-method-title">
                    <h4>PEMBAYARAN OTOMATIS (RECOMMENDED)</h4>
                    <p>Sistem akan secara langsung mengaktifkan order Anda setelah pembayaran selesai dilakukan tanpa konfirmasi secara MANUAL.</p>    
                </div>
                <!-- <div v-if="client && client_balance > 0" @click="useBalance" class="use-balance  pretty-checkbox">
                    <input type="checkbox" name="use_balance" value="1" v-model="use_balance" />
                    <p v-if="cart.total * 1.1 <= client_balance" class="checkbox-icon checkbox-title">Bayar dengan saldo</p>
                    <p v-else class="checkbox-icon checkbox-title">Bayar sebagian dengan saldo</p>
                    <p class="checkbox-description nunito-regular font-size-16 color-4d5872">Saldo anda: Rp. {{ formatPrice(client_balance) }}</p>
                </div> -->
                <ul v-if="show_payment_methods" class="payment-method">
                    <li v-for="pm in payment_methods" v-if="!(pm.id == 12 && (cart.total + (cart.total * 0.1)) > 500000) && pm.id != 1">
                        <div @click="choosePaymentMethod(pm.id)" class="pretty-radio">
                            <input type="radio" name="payment_method" v-model="gateway_id" v-bind:value="pm.id"/>
                            <p class="radio-icon radio-title"><b>{{ pm.title }}</b></p>
                            <div class="gateway-icon">
                                <img class="img-responsive" v-bind:src="'/assets/images/payment-gateway/' + pm.code + '.svg'">
                            </div>
                            <!--<div class="radio-description" :class="{'hide':gateway_id != pm.id}">
                                <p class="nunito-bold font-size-16 color-4d5872">Ketentuan Pembayaran</p>
                                <ul class="bullet">
                                    <li><span>Pembayaran dapat dilakukan melalui transfer ke rekening Bank BCA, Bank Mandiri, Bank Syariah Mandiri, Bank BNI, atau Bank BRI.</span></li>
                                    <li>Total belanja kamu belum termasuk kode pembayaran untuk keperluan proses verifikasi otomatis</li>
                                    <li>Mohon transfer tepat sampai 3 digit terakhir</li>
                                </ul>
                            </div>-->
                        </div>
                    </li>
                </ul>
                <div v-if="show_payment_methods" class="payment-method-title">
                    <h4>TRANSFER MANUAL</h4>
                    <p>Harus melakukan konfirmasi secara MANUAL jika sistem gagal menemukan pembayaran yang Anda lakukan.</p>
                </div>
                <ul v-if="show_payment_methods" class="payment-method">
                  <li v-for="pm in payment_methods" v-if="pm.id == 1">
                    <div @click="choosePaymentMethod(pm.id)" class="pretty-radio">
                      <input type="radio" name="payment_method" v-model="gateway_id" v-bind:value="pm.id"/>
                      <p class="radio-icon radio-title"><b>{{ pm.title }}</b></p>
                      <div class="gateway-icon">
                        <img class="img-responsive" v-bind:src="'/assets/images/payment-gateway/' + pm.code + '.svg'">
                      </div>
                      <!--<div class="radio-description" :class="{'hide':gateway_id != pm.id}">
                          <p class="nunito-bold font-size-16 color-4d5872">Ketentuan Pembayaran</p>
                          <ul class="bullet">
                              <li><span>Pembayaran dapat dilakukan melalui transfer ke rekening Bank BCA, Bank Mandiri, Bank Syariah Mandiri, Bank BNI, atau Bank BRI.</span></li>
                              <li>Total belanja kamu belum termasuk kode pembayaran untuk keperluan proses verifikasi otomatis</li>
                              <li>Mohon transfer tepat sampai 3 digit terakhir</li>
                          </ul>
                      </div>-->
                    </div>
                  </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaymentMethod",
        props: ['cart', 'client'],
        data() {
            return {
                payment_methods: [],
                gateway_id: 19,
                use_balance: false,
                client_balance: 0,
                show_payment_methods: true,
            }
        },
        methods: {
            getPaymentMethods() {
                bus.$emit('show-spinner', true);
                axios.get('/api/guest/get_payment_methods')
                    .then( (res) => {
                        this.payment_methods = res.data.result;
                        bus.$emit('show-spinner', false);
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            choosePaymentMethod(id) {
                this.gateway_id = id;
                this.$emit('choose-payment-method', id);
            },
            useBalance(){
                this.use_balance = !this.use_balance;
                if (this.use_balance && this.client_balance >= (this.cart.total * 1.1)) {
                    this.show_payment_methods = false;
                    this.choosePaymentMethod(10);
                } else {
                    this.show_payment_methods = true;
                    this.choosePaymentMethod(19);
                }
                this.$emit('use-balance', this.use_balance);
            },
            getClientBalance(){
                bus.$emit('show-spinner', true);
                axios.get('/api/guest/get_client_balance')
                    .then( (res) => {
                        this.client_balance = res.data.result;
                        bus.$emit('show-spinner', false);
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            },
            formatPrice(value) {
                value = Math.round(value);
                let val = (value/1).toFixed(2).replace('.', ',');
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        },
        mounted: function () {
            this.getPaymentMethods();
            this.getClientBalance();
        }
    }
</script>

<style scoped>

</style>
