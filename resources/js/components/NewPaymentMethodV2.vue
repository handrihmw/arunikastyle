<template>
  <section class="payment-method-v2 gtmPayments">
    <h3 class="payment-method-v2__title">Pilih Metode Pembayaran</h3>
    <p class="payment-method-v2__note">Pilih salah satu dari metode pembayaran yang tersedia, kami merekomendasikan melalui <strong>Transfer Virtual Account</strong><span v-if="paymentGroups.includes(1)"> dan <strong>QRIS</strong></span> untuk kemudahan transaksi</p>

    <div class="payment-method-v2__balance" v-if="client && client_balance > 0">
      <div class="payment-method-v2__balance-container" :class="{ 'payment-method-v2__balance-container--use-balance' : this.use_balance }">
        <div class="payment-method-v2__balance-container-title">
          <div class="payment-method-v2__balance-container-title-text">
            Saldo Deposit: Rp {{ formatPrice(client_balance) }}
          </div>
        </div>
        <div class="payment-method-v2__balance-container-description">
          Saldo deposit Niagahoster merupakan saldo yang terkumpul dari kelebihan pembayaran layanan ke Niagahoster. Saldo deposit dapat Anda gunakan untuk <strong>memotong</strong> atau <strong>membayar penuh total tagihan</strong> layanan pada Niagahoster.
        </div>
        <div class="payment-method-v2__balance-container-apply">
          <div class="payment-method-v2__balance-container-apply-checklist">
            <input name="use-balance" class="orderflow-custom-checkbox orderflow-custom-checkbox--regular" type="checkbox" 
              v-model="use_balance"
              v-on:click="useBalance()">
            <label for="use-balance">Gunakan saldo deposit</label>
          </div>
        </div>
      </div>
    </div>   

    <div class="payment-method-v2__pembayaran">
      <div v-for="pg in paymentGroups" :key="pg.id" class="payment-method-v2__group" 
        :class="[{'payment-method-v2__group--expanded' : pg.list_expand}, `payment-group--${pg.id}`]">
        <div class="payment-method-v2__group-head d-flex justify-content-between flex-column"
          :class="{
            'selected' : (! pg.list_view && pg.payment_ids[0] == gateway_id && ! highlight_payment),
            'payment-method-v2__group-head--expanded' : pg.list_expand,
            'payment-method-v2__group-head--disabled' : ! enable_payment_methods
          }"
          @click="clickPaymentGroup(pg.id)">
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start flex-wrap">
              <div class="payment-method-v2__group-head-title">{{ pg.title }}</div>
              <div  v-for="(badge, idx) in pg.badges" :key="idx" class="payment-method-v2__group-head-recommended">
                <strong><i :class="{ 'payment-method-v2__icon-star' : badge == 'Recommended', 'payment-method-v2__icon-check' : badge == 'New' || badge == 'Promo' }"></i> {{ badge }}</strong>
              </div>
            </div>
            <i v-if="! pg.list_view" :class="{'payment-method-v2__icon-checklist' : (pg.payment_ids[0] == gateway_id && ! highlight_payment)}"></i>
            <i v-else :class="[pg.list_expand ? 'payment-method-v2__icon-caret-up' : 'payment-method-v2__icon-caret-down']"></i>
          </div>
          <div v-if="pg.description_expand || pg.description_expand_force">
            <transition name="fade" mode="out-in">
            <div v-if="(! pg.list_expand && pg.description_hide_expand) || ! pg.description_hide_expand">
                <div v-if="pg.description.length > 0" class="payment-method-v2__group-head-description" :class="{ 'mb-4' : (pg.description_icons.length == 0) }" v-html="pg.description"></div>
                <div v-if="pg.description_icons.length > 0" class="payment-method-v2__wrap-icon d-flex align-content-start flex-wrap mt-5">
                    <div v-for="(icon, idx) in pg.description_icons" :key="idx" class="payment-method-v2__group-payment-icon payment-method-v2__group-payment-icon--no-border">
                        <img :src="'/assets/images/payment-gateway/' + icon + '.svg?ver=1.0.1'" :alt="icon" loading="lazy">
                    </div>
                </div>
            </div>
            </transition>
          </div>
        </div>
        <transition name="accordion" 
            v-on:before-enter="accordionBeforeEnter" v-on:enter="accordionEnter" 
            v-on:before-leave="accordionBeforeLeave" v-on:leave="accordionLeave">
        <div v-if="pg.list_view && pg.list_expand" class="payment-method-v2__group-list">
          <div v-for="pm in groupPaymentMethods(pg.payment_codes)" :key="pm.id" class="payment-method-v2__group-list-child">
            <div @click="choosePaymentMethod(pm.id)" :class="[
                gateway_id == pm.id && ! highlight_payment ? 'selected' : '',
                ! enable_payment_methods ? 'payment-method-v2__group-list-child-payment--disabled' : ''
              ]"
              class="payment-method-v2__group-list-child-payment gtmPayment" data-type="auto" :data-title="pm.title">
              <div class="d-flex justify-content-start">
                <div class="payment-method-v2__group-payment-icon mb-0">
                  <img :src="'/assets/images/payment-gateway/' + pm.code + '.svg?ver=1.0.1'" :alt="pm.code" loading="lazy">
                </div>
                <p class="payment-method-v2__group-list-child-payment-title">{{ pm.title }}</p>
              </div>
              <i :class="{ 'payment-method-v2__icon-checklist' : (gateway_id == pm.id && ! highlight_payment) }"></i>
            </div>
          </div>
          <div v-if="pg.id == 4 && highlightQrisPayments.length > 0">
          <div v-for="item in highlightQrisPayments" :key="item.code" class="payment-method-v2__group-list-child">
            <div class="payment-method-v2__group-list-child-payment gtmPayment" data-type="auto"
              @click="choosePaymentMethodQrisHighlight(item.id, item.code)"
              :class="{'selected' : item.code == highlight_payment, 'payment-method-v2__group-list-child-payment--disabled' : ! enable_payment_methods}">
                <div class="d-flex justify-content-start">
                  <div class="payment-method-v2__group-payment-icon mb-0">
                    <img :src="'/assets/images/payment-gateway/' + item.code + '.svg?ver=1.0.1'" :alt="item.code" loading="lazy">
                  </div>
                  <p class="payment-method-v2__group-list-child-payment-title">{{ item.code }}</p>
                </div>
                <i :class="{ 'payment-method-v2__icon-checklist' : (item.code == highlight_payment) }"></i>
            </div>
          </div>
          </div>
          <div v-else-if="pg.id == 3">
          <div v-for="item in highlight_manual_payments" :key="item.name" class="payment-method-v2__group-list-child">
            <div class="payment-method-v2__group-list-child-payment gtmPayment" data-type="auto"
              @click="choosePaymentMethodManual(item)"
              :class="[
                gateway_id == item.id && selected_manual_payment.name == item.name && ! highlight_payment ? 'selected' : '',
                ! enable_payment_methods ? 'payment-method-v2__group-list-child-payment--disabled' : ''
              ]">
                <div class="d-flex justify-content-start">
                  <div class="payment-method-v2__group-payment-icon mb-0">
                    <img :src="'/assets/images/payment-gateway/' + item.icon + '.svg?ver=1.0.1'" :alt="item.icon" loading="lazy">
                  </div>
                  <p class="payment-method-v2__group-list-child-payment-title">{{ item.name }}</p>
                </div>
                <i :class="{ 'payment-method-v2__icon-checklist' : (gateway_id == item.id && selected_manual_payment.name == item.name && ! highlight_payment) }"></i>
            </div>
          </div>
          </div>
        </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
    export default {
        name: "NewPaymentMethodV2",
        props: ['cart', 'client', 'gateway_id', 'payment_methods', 'highlight_payment'],
        data() {
            return {
                use_balance: false,
                client_balance: 0,
                enable_payment_methods: true,
                highlight_qris_payment: [
                  {code: 'ShopeePay', id: 20},
                  {code: 'DANA', id: 20},
                  {code: 'LinkAja', id: 20},
                ],
                highlight_manual_payments: [
                  {name: 'BCA', icon: 'BCAVA', id: 1},
                  {name: 'Mandiri', icon: 'MandiriVA', id: 1},
                  {name: 'BRI', icon: 'BRIVA', id: 1},
                  {name: 'BNI', icon: 'BNIVA', id: 1},
                ],
                selected_manual_payment: {name: '', icon: '', id: null},
                payment_group_id: 1,
                payment_groups: [
                  {
                    id: 1,
                    title: 'Transfer Virtual Account (Pengecekan Otomatis)',
                    description: '',
                    description_icons: ['BCAVA', 'MandiriVA', 'BRI', 'BNIVA', 'ATM', 'CimbNiaga', 'MayBank'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: true,
                    badges: ['Recommended'],
                    payment_ids: [],
                    payment_codes: ['BCAVA', 'MandiriVA', 'BRIVA', 'BNIVA', 'CimbNiaga', 'MayBank', 'ATM'],
                    list_view: true,
                    list_expand: true,
                    tracking_name: 'VA'
                  },
                  {
                    id: 2,
                    title: 'QRIS',
                    description: 'Layanan QRIS bisa digunakan untuk semua Bank, eWallet, maupun provider pembayaran lain yang memiliki fitur Scan QRIS. <a href="https://paydia.id/merchant/" target="_blank" rel="noreferrer noopener">Klik disini untuk lihat semua provider yang memiliki fitur tersebut</a>',
                    description_icons: ['Jenius', 'BSI', 'Mega', 'BankDKI', 'UOB', 'BPDDIY', 'Muamalat', 'BTN', 'Jago', 'OctoMobile', 'BPDBali', 'Nobu', 'CommonwealthBank', '20MoreBank'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: false,
                    badges: ['Recommended'],
                    payment_ids: [],
                    payment_codes: ['Qris'],
                    list_view: false,
                    list_expand: false,
                    tracking_name: 'QRIS'
                  },
                  {
                    id: 3,
                    title: 'KoinWorks NEO',
                    description: 'Dapatkan tambahan diskon 10% menggunakan pembayaran KoinWorks Neo, serta cashback hingga 500rb pada platform KoinWorks Neo. <a href="https://www.niagahoster.co.id/blog/promo-cash-back-koinworks/" target="_blank" rel="noreferrer noopener">Lihat Syarat & Ketentuan</a>',
                    description_icons: ['HpaymentsKoinWorks'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: false,
                    badges: ['New', 'Promo'],
                    payment_ids: [],
                    payment_codes: ['HpaymentsKoinWorks'],
                    list_view: false,
                    list_expand: false,
                    tracking_name: 'KoinWorks'
                  },
                  {
                    id: 4,
                    title: 'eWallet',
                    description: '',
                    description_icons: ['GoPay', 'Ovo', 'LinkAja2', 'DANA', 'ShopeePay'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: true,
                    badges: [],
                    payment_ids: [],
                    payment_codes: ['GoPay', 'Ovo'],
                    list_view: true,
                    list_expand: false,
                    tracking_name: 'EWallet'
                  },
                  {
                    id: 5,
                    title: 'Tunai di Gerai Retail',
                    description: '',
                    description_icons: ['Indomaret', 'Alfamidi', 'AlfaMart', 'DANDAN', 'Lawson', 'PosIndonesia', 'Pegadaian'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: true,
                    badges: [],
                    payment_ids: [],
                    payment_codes: ['Alfamart', 'HpaymentsIndomaret', 'RetailDuitKu'],
                    list_view: true,
                    list_expand: false,
                    tracking_name: 'Retail'
                  },
                  {
                    id: 6,
                    title: 'Kartu Kredit',
                    description: '',
                    description_icons: ['Visa', 'MasterCard', 'JCB'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: false,
                    badge: [],
                    payment_ids: [],
                    payment_codes: ['CreditCard'],
                    list_view: false,
                    list_expand: false,
                    tracking_name: 'CreditCard'
                  },
                  {
                    id: 7,
                    title: 'PayPal',
                    description: 'Pembayaran menggunakan PayPal akan dikenakan biaya tambahan sebesar 4,2% dari total transaksi, ditambah US$ 0,30',
                    description_icons: ['PayPalEmail'],
                    description_expand: true,
                    description_expand_force: true,
                    description_hide_expand: false,
                    badges: [],
                    payment_ids: [],
                    payment_codes: ['PayPalEmail'],
                    list_view: false,
                    list_expand: false,
                    tracking_name: 'PayPalEmail'
                  }
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
                    this.clickPaymentGroup(1);
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
                        bus.$emit('show-spinner', false);
                    });
            },
            formatPrice(value) {
                value = Math.round(value);
                let val = (value/1).toFixed(2).replace('.', ',');
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");            
            },
            clickPaymentGroup(groupId) {
              let paymentGroup = this.payment_groups[groupId-1];

              this.closePaymentGroup(this.payment_group_id);

              if (groupId == this.payment_group_id && paymentGroup.list_view) {
                this.payment_group_id = null;
                return;
              }
              if (! paymentGroup.list_view) {
                this.choosePaymentMethod(paymentGroup.payment_ids[0]);
              } else {
                paymentGroup.description_expand = true;
                paymentGroup.list_expand = true;
                Gtm.gtmPaymentMethodTypes('PaymentPage_Category' + paymentGroup.tracking_name + '_Clicked');
              }
              this.payment_group_id = groupId;

              setTimeout(() => {
                this.scrollToElement(groupId);
              }, 200);
            },
            closePaymentGroup(groupId) {
              if (this.payment_group_id == null) {
                return;
              }
              let paymentGroup = this.payment_groups[groupId-1];

              if ((! paymentGroup.description_expand_force && paymentGroup.list_view) || groupId == this.payment_group_id) {
                paymentGroup.description_expand = false;
                paymentGroup.list_expand = false;
              }
            },
            choosePaymentMethod(id, customTrackingCode) {
              this.gateway_id = id;
              this.$emit('choose-payment-method', id);
              this.$emit('highlight-payment-qris', '');

              if (id != 1) {
                this.selected_manual_payment = {name: '', icon: '', id: null};
              }
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
              this.choosePaymentMethod(id, code);
              this.$emit('highlight-payment-qris', code);
            },
            choosePaymentMethodManual(highlightManualPayment) {
              this.selected_manual_payment = highlightManualPayment;
              this.choosePaymentMethod(highlightManualPayment.id, highlightManualPayment.name);
            },
            groupPaymentMethods(paymentCodes) {
              return this.paymentMethods.filter(pm => paymentCodes.includes(pm.code));
            },
            initGroupPaymentIds() {
              this.payment_groups.forEach((pg, pgIdx) => {
                pg.payment_ids = [];
                this.payment_methods.forEach(pm => {
                  if (pg.payment_codes.includes(pm.code)) {
                    pg.payment_ids.push(parseInt(pm.id));
                  }
                });
              });
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
            },
            accordionBeforeEnter: function(el) {
                el.style.height = '0';
            },
            accordionEnter: function(el) {
                el.style.height = el.scrollHeight + 4 + 'px';
            },
            accordionBeforeLeave: function(el) {
                el.style.height = el.scrollHeight + 'px';
            },
            accordionLeave: function(el) {
                el.style.height = '0';
            },
            scrollToElement(id) {
                const el = this.$el.getElementsByClassName('payment-group--' + id)[0];
                
                if (el) {
                    el.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
                }
            }
        },
        computed: {
            paymentGroups() {
              if ((this.cart.total * (1 + this.taxRate)) > 2000000) {
                return this.payment_groups.filter(pg => {
                  if (! pg.payment_codes.includes('Qris')) {
                    return pg;
                  }
                });
              }
              return this.payment_groups;
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
            }
        },
        mounted: function () {
          let flow = localStorage.getItem('ab-flow') ? localStorage.getItem('ab-flow') : sessionStorage.getItem('flow');

          localStorage.removeItem('ab-flow');

          if (flow) {
            this.$emit('update-flow', flow);
          }
          this.getClientBalance();
        },
        created() {
            this.getTaxRate();
        },
        beforeUpdate: function () {
          this.initGroupPaymentIds();
        }
    }
</script>

<style scoped>

</style>
