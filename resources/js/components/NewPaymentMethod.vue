<template>
  <section class="payment-method gtmPayments">
    <h3 class="payment-method__title">Pilih Metode Pembayaran</h3>   

    <div class="payment-method__balance mb-5" v-if="client && client_balance > 0">
      <div class="payment-method__balance-container">
        <div class="payment-method__balance-container-title">
          <div class="payment-method__balance-container-title-icon">
            <img src='/assets/images/payment-gateway/balance-wallet-icon.svg' alt="balance" class="img-fluid">
          </div>
          <div class="payment-method__balance-container-title-text">
            Anda memiliki saldo sebesar Rp. {{ formatPrice(client_balance) }}
          </div>
        </div>
        <div class="payment-method__balance-container-description">
          Klik informasi berikut jika Anda ingin membayar seluruh transaksi menggunakan saldo Anda.
        </div>
        <div class="payment-method__balance-container-apply">
          <div class="payment-method__balance-container-apply-checklist">
            <input class="orderflow-custom-checkbox orderflow-custom-checkbox--regular" type="checkbox" 
            v-model="use_balance"
            v-on:click="useBalance()">
            <label></label>
          </div>
          <div class="payment-method__balance-container-apply-text">
            <a href="https://www.niagahoster.co.id/kb/cara-melakukan-pembayaran-menggunakan-deposit" target="blank">
              Lakukan transaksi menggunakan saldo saya <img src='/assets/images/payment-gateway/notification-blue.svg' alt="balance" class="img-fluid ml-2">
            </a>
          </div>
        </div>
      </div>
    </div>   

    <transition name="fade" mode="out-in">
      <div v-if="tab.pembayaranOtomatis" class="payment-method__pembayaran-otomatis">
        <p class="payment-method__note" style="display: none">Tidak ingin menunggu? Gunakan pilihan Konfirmasi Pembayaran Otomatis, aktivasi cepat tanpa perlu mengunggah bukti bayar. Selesaikan pembayaran dan layanan siap Anda gunakan hanya dalam waktu beberapa menit!</p>
        <div class="row">
          <div v-for="pm in paymentMethods" :key="pm.id" class="col-lg-3">
            <div @click="choosePaymentMethod(pm.id)" :class="[
                gateway_id == pm.id && ! highlight_payment ? 'selected' : '',
                isPaymentShowedWithTooltip(pm.code) ? 'payment-method--with-tooltip' : '',
                ! enable_payment_methods ? 'payment-method__card--disabled' : ''
              ]"
              class="payment-method__card gtmPayment" data-type="auto" :data-title="pm.title">
              <div v-if="pm.code === 'Qris'" class="payment-method__tooltip payment-method__tooltip--dark">
                <label>Informasi Penting</label>
                <hr>
                <p>
                  Gunakan QRIS untuk transaksi cepat dan mudah. Scan QR Code unik Niagahoster melalui platform pembayaran berikut ini!
                  <img :src="'/assets/images/payment-gateway/qris-tooltip-icon-hover-2-1641803242.svg'" alt="tooltip" class="img-fluid">
                </p>
              </div>
              <div v-if="pm.code.toLowerCase().includes('paypal')" class="payment-method__tooltip payment-method__tooltip--dark" style="top: -198px;">
                <label>Informasi Penting</label>
                <hr>
                <p>
                  Pembayaran menggunakan PayPal akan dikenakan biaya tambahan sebesar <strong>4,2% dari total transaksi</strong>, ditambah <strong>US$ 0,30</strong>
                </p>
              </div>
              <div v-if="pm.code.toLowerCase().includes('koinworks')" class="payment-method__tooltip payment-method__tooltip--dark" style="top: -222px;">
                <label>Informasi Penting</label>
                <hr>
                <p>
                  Dapatkan <strong>tambahan diskon 10%</strong> menggunakan pembayaran KoinWorks Neo, serta <strong>cashback hingga Rp 500.000</strong> pada platform <strong>KoinWorks Neo</strong>.
                </p>
              </div>
              <div :class="pm.code === 'CreditCard' ? 'payment-method__gateway--cc-size' : ''" class="payment-method__gateway">
                <img class="img-responsive" :src="'/assets/images/payment-gateway/' + pm.code + '.svg?ver=1.0.1'" alt="payment gateway">
              </div>
              <p class="payment-method__pembayaran-otomatis-title">{{ pm.title }}</p>
            </div>
          </div>
          <div class="col-lg-3" v-for="item in highlightQrisPayments" :key="item.code">
            <div class="payment-method__card gtmPayment" data-type="auto"
              @click="choosePaymentMethodQrisHighlight(item.id, item.code)"
              :class="{'selected' : item.code == highlight_payment}">
                <div class="payment-method__gateway"><img :src="'/assets/images/payment-gateway/' + item.code + '.svg?ver=1.0.1'" alt="payment gateway" class="img-responsive"></div>
                <p class="payment-method__pembayaran-otomatis-title">{{ item.code }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
    export default {
        name: "NewPaymentMethod",
        props: ['cart', 'client', 'gateway_id', 'payment_methods', 'highlight_payment'],
        data() {
            return {
                tab: {
                    pembayaranOtomatis: true,
                    transferManual: false,
                },
                rekening: {
                    bca: '0283116490',
                    mandiri: '1030006055954',
                    bri: '040901000395302',
                    bni: '3300030034',
                },
                use_balance: false,
                client_balance: 0,
                enable_payment_methods: true,
                highlight_qris_payment: [
                  {code: 'ShopeePay', id: 20},
                  {code: 'DANA', id: 20},
                  {code: 'LinkAja', id: 20},
                ],
                taxRate: 0,
                taxName: '',
            }
        },
        methods: {
            useBalance(){
                this.use_balance = !this.use_balance;
                if (this.use_balance && this.client_balance >= (this.cart.total * (1 + this.taxRate))) {
                    this.enable_payment_methods = false;
                    this.choosePaymentMethod(10);
                } else {
                    this.enable_payment_methods = true;
                    this.choosePaymentMethod(19);
                }
                this.$emit('use-balance', this.use_balance);
            },
            getClientBalance(){
                bus.$emit('show-spinner', true);
                axios.get('/api/guest/get_client_balance')
                    .then( (res) => {
                        this.client_balance = res.data.result;
                        this.$emit('client-balance', this.client_balance);
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
            },
            selectTab(index) {
                if (index === 1) {
                    this.tab.pembayaranOtomatis = true;
                    this.tab.transferManual = false;
                } else {
                    this.tab.transferManual = true;
                    this.tab.pembayaranOtomatis = false;
                }
            },            
            choosePaymentMethod(id, customTrackingCode) {
              this.gateway_id = id;
              this.$emit('choose-payment-method', id);
              this.$emit('highlight-payment-qris', '')
              if (CommonVar.allow_mkt_script === 'false') {
                return;
              }
              this.payment_methods.forEach(pm => {
                if (pm.id == this.gateway_id) {
                  Gtm.gtmPaymentMethodTypes('PaymentPage_Button' + (customTrackingCode || pm.code) + '_Clicked');
                }
              });
            },
            choosePaymentMethodQrisHighlight(id, code) {
              this.choosePaymentMethod(id, code)
              this.$emit('highlight-payment-qris', code)
            },
            isPaymentShowedWithTooltip(code) {
              const paymentCodeWithTooltip = ['qris', 'paypal', 'koinworks'];
              const paymentCode = code.toLowerCase();

              for (let idx = 0; idx < paymentCodeWithTooltip.length; idx++) {
                if (paymentCode.includes(paymentCodeWithTooltip[idx])) {
                  return true;
                }
              }
              return false;
            },
            getTaxRate(){
                bus.$emit('show-spinner', true);
                axios.get('/api/v2/get-tax')
                    .then( (res) => {
                        this.taxRate = res.data.result['taxRate'];
                        this.taxName = res.data.result['taxName'];
                        bus.$emit('show-spinner', false);
                    })
                    .catch((err) => {
                        console.log(err);
                        bus.$emit('show-spinner', false);
                    });
            }
        },
        computed: {
            pembayaranOtomatisActive: function () {
                return {
                    '': this.tab.pembayaranOtomatis === false,
                    'active': this.tab.pembayaranOtomatis,
                }
            },
            transferManualActive: function () {
                return {
                    '': this.tab.transferManual === false,
                    'active': this.tab.transferManual,
                }
            },
            paymentMethods() {
              let hidden = ['Custom', 'HpaymentsOvo', 'HpaymentsGoPay', 'HpaymentsAlfamart', 'HpaymentsBRIVA', 'HpaymentsCimbNiaga', 'HpaymentsMandiri', 'HpaymentsMayBank', 'HpaymentsBNIVA', 'HpaymentsPermataBank', 'HpaymentsRitel', 'HpaymentsQris', 'HpaymentsBCAVA', 'HpaymentsCreditCard', 'HpaymentsPayPal'];
              return this.payment_methods.filter(pm => {
                if (!(pm.id == 12 && (this.cart.total * (1 + this.taxRate)) > 500000) &&
                    !(pm.code === 'Qris' && (this.cart.total * (1 + this.taxRate)) > 2000000) &&
                    !hidden.includes(pm.code)) {
                  return pm;
                }
              });
            },
            highlightQrisPayments() {
              return this.highlight_qris_payment.filter(hpm => {
                if ((this.cart.total * (1 + this.taxRate)) <= 2000000) {
                  return hpm;
                }
              });
            },
        },
        mounted: function () {
            this.getClientBalance();

            // For AB Test purpose
            let flow = sessionStorage.getItem('flow') ? sessionStorage.getItem('flow') : 'hosting';
            localStorage.setItem('ab-flow', flow);
        },
        created() {
            this.getTaxRate();
        }
    }
</script>

<style scoped>

</style>
