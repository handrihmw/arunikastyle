<template>
  <section id="summary-cart-wrapper">
    <div v-if="new_sidebar">
        <div class="as-card-base as-card-base--full-width summary-cart">
            <div v-if="flow !== 'cart_page'" class="order-step">
                <ul v-if="flow === 'website' || flow === 'mailhosting' || flow === 'vps_kvm'">
                    <li :class="{
                            'order-step__item--active': orderflow_step == 1,
                            'order-step__item--complete': orderflow_step > 1
                        }"
                        class="order-step__item"
                    >
                        <div v-if="flow === 'website'" class="ribbon">Atur Website &amp; Domain</div>
                        <div v-else-if="flow === 'vps_kvm'" class="ribbon">Pilih VPS KVM</div>
                        <div v-else class="ribbon">Pilih Website &amp; Domain</div>
                    </li>
                    <li class="orderflow-step__item orderflow-step__item--active orderflow-step__item--website">
                        <div class="ribbon">Metode Pembayaran</div>
                    </li>
                </ul>
                <ul v-if="flow !== 'hosting'">
                    <li :class="{'order-step__item--active':orderflow_step == 1, 'order-step__item--complete':orderflow_step > 1}" class="order-step__item">
                        <div v-if="flow === 'vps' && plan_type === 'cpanel'" class="ribbon">1. Pilih VPS cPanel</div>
                        <div v-else-if="flow === 'vps'" class="ribbon">1. Pilih Cloud VPS</div>
                        <div v-else class="ribbon">Pilih Hosting &amp; Domain</div>
                    </li>
                    <li :class="{'order-step__item--active':orderflow_step == 2, 'order-step__item--complete':orderflow_step > 2}" class="order-step__item">
                        <div class="ribbon">Tambah Fitur</div>
                    </li>
                    <li :class="{'order-step__item--active':orderflow_step == 3, 'order-step__item--complete':orderflow_step > 3}" class="order-step__item">
                        <div class="ribbon">Metode Pembayaran</div>
                    </li>
                </ul>
                <ul v-else>
                    <li :class="{'order-step__item--active':orderflow_step <= 2, 'order-step__item--complete':orderflow_step > 2}" class="order-step__item">
                        <div class="ribbon">Tambah Paket</div>
                    </li>
                    <li :class="{'order-step__item--active':orderflow_step == 3, 'order-step__item--complete':orderflow_step > 3}" class="order-step__item">
                        <div class="ribbon">Metode Pembayaran</div>
                    </li>
                    <li :class="{'order-step__item--active':orderflow_step == 4, 'order-step__item--complete':orderflow_step > 4}" class="order-step__item">
                        <div class="ribbon">Selesai</div>
                    </li>
                </ul>
            </div>
            <div v-else class="mb-4">Ringkasan Order</div>

            <div>
                <div id="summary-cart__item" class="summary-cart__item">
                    <transition name="fade" mode="out-in">
                        <div v-if="cart.items.length">
                            <div v-for="item in cart.items" :key="item.id">
                                <div>
                                    <div class="row mb-2">
                                        <div class="col-10">
                                            <div class="summary-cart__item-type text-capitalize">
                                                {{ itemType(item) }}
                                                <div v-if="item.type == 'hosting' && item.product_id != 84 || item.type == 'domain'" class="as-card-base__feature--icon as-card-base__feature--icon-exclamation as-tooltip">
                                                    <p class="as-tooltip__info as-tooltip__info--bottom"  :class="{'as-tooltip__domain':item.type == 'domain'}">Besar biaya perpanjangan Anda adalah {{ item.price | formatPrice }}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-2">
                                            <p class="font-size-18 text-right"><span  @click="removeFromCart(item)" class="fa fa-times remove-item"></span></p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <div v-if="item.type == 'domain' && !item.cart_type && item.cart_type == 'tmp_domain'" class="summary-cart__item-title">
                                                {{ toUpperCase(item[item.action + "_sld"]) }}{{ toUpperCase(item[item.action + "_tld"]) }}
                                            </div>
                                            <div v-if="item.type == 'hosting' && flow === 'website'" class="summary-cart__item-title">{{ period[item.period].text }}</div>
                                            <div v-else-if="item.type === 'custom' && item.title === 'cPanel WHM Admin'" class="summary-cart__item-title">Gratis {{ item.title }}</div>
                                            <div v-else class="summary-cart__item-title">
                                                <div v-if="item.type == 'hosting' && item.total != item.price">
                                                    Diskon {{ discountPrice(item.total, item.price) }}%
                                                </div>
                                                <span v-if="item.type == 'domain'">Gratis for </span>
                                                <span v-else-if="item.type == 'hosting' && item.product_id != 84">Hosting </span>
                                                {{ item.title }}
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div id="hosting-package-price" class="summary-cart__item-price text-right">
                                                <div>{{ item.total | formatPrice }}</div>
                                                <s v-if="item.price != undefined && item.total != item.price" class="summary-cart__normal-price">{{ item.price | formatPrice }}</s>
                                            </div>
                                            <div v-if="item.vps_cpanel && item.title === 'cPanel WHM Admin'" class="summary-cart__item-price">
                                                <s>{{ item.discount_price | formatPrice }}</s>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                </div>
                            </div>
                        </div>
                    </transition>

                    <p class="summary-cart__item-type">Pajak &amp; Biaya Tambahan</p>
                    <div class="row">
                        <div class="col-7">
                            <p class="summary-cart__item-title">{{ taxName }}</p>
                        </div>
                        <div class="col-5">
                            <p class="summary-cart__item-price text-right">{{ (cart.total * taxRate) | formatPrice }}</p>
                        </div>
                    </div>
                </div>

                <hr>
                <div v-if="orderflow_step == 3 || flow === 'cart_page'" class="summary-cart__coupon d-none d-lg-block">
                    <div v-if="!show_coupon_status && additionalDiscountPayGateway == 0" class="input-group mb-3">
                        <input
                            type="text"
                            class="form-control"
                            name="coupon_code"
                            v-model="coupon_code"
                            placeholder="Kode Kupon (opsional)"
                            aria-label="Kode Kupon (opsional)"
                            aria-describedby="coupon-code"/>
                        <div class="input-group-append">
                            <button
                                id="coupon-code"
                                type="button"
                                @click="usePromoCode"
                                :class="{ 'summary-cart__coupon--btn-grey': coupon_code == '' }"
                                class="btn btn-secondary"
                                :disabled="coupon_code == ''">
                            Gunakan
                            </button>
                        </div>
                    </div>
                    <transition name="fade" mode="out-in">
                        <div class="row as-mb-8" v-if="show_coupon_status">
                            <div class="col-10">
                                <div v-if="coupon_status.result" class="summary-cart__item-coupon">
                                    <div>
                                        Kupon <span>{{ coupon_code }}</span> telah diterapkan.
                                        <span v-if="extra_point"> dan Anda akan mendapatkan Bonus Extra <strong>{{ extra_point }}</strong> Poin pada order ini</span>
                                    </div>
                                </div>
                                <div v-else class="summary-cart__coupon-status--error">
                                    <div>{{ coupon_status.message }}</div>
                                </div>
                            </div>
                            <div class="col-2">
                                <p class="font-size-18 text-right" @click="removeCoupon()"><span class="fa fa-times remove-item"></span></p>
                            </div>
                        </div>
                    </transition>
                    <transition name="fade" mode="out-in">
                        <div class="row as-mb-8" v-if="additionalDiscountPayGateway > 0">
                            <div class="col-12">
                                <div class="summary-cart__item-coupon">
                                    <div>
                                        Pembayaran <strong>{{ selectedPaymentMethodName }}</strong> diterapkan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="row as-mb-10" v-if="totalDiscount != 0">
                    <div class="col-12">
                        <div class="summary-cart__item-save">
                            <div v-if="additionalDiscountPayGateway > 0">Tambahan diskon {{ cart.additional_discount_gateway.discount.type == "percentage" ? cart.additional_discount_gateway.discount.value + "%" : (cart.additional_discount_gateway.discount.value | formatPrice) }}, Anda akan lebih hemat sebesar <span>{{ Number(totalDiscount) | formatPrice }}</span></div>
                            <div v-else>Selamat! Anda berhasil berhemat <span>{{ Number(totalDiscount) | formatPrice }}</span>.</div>
                        </div>
                    </div>
                </div>

                <div class="summary-cart__total">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <p class="summary-cart__total-title">TOTAL</p>
                        </div>
                        <div class="col-9">
                            <p class="summary-cart__total-price">{{ total | formatPrice }}</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="row justify-content-beetwen align-items-center summary-cart__payment-method">
                        <p class="col mb-0">Metode Pembayaran</p>
                        <div class="col-auto" v-if="use_balance && gateway_id == 10">
                            <span><strong>Deposit</strong></span>
                        </div>
                        <div class="col-auto" v-else-if="highlight_payment">
                            <span><strong>{{ highlight_payment}} </strong></span>
                        </div>
                        <div class="col-auto" v-else>
                            <strong v-for="method in payment_methods" :key="method.id">
                            <span v-if="method.id == gateway_id">{{ method.title }}</span>
                            </strong>
                        </div>
                    </div>
                    <tos-text></tos-text>
                </div>
            </div>
        </div>
        <div v-if="orderflow_step == 3 && client" id="checkout-button-wrapper" class="d-none d-lg-block gtmCTA" style="height: 48px;">
            <div id="checkout-button">
                <a @click="checkoutNow" href="javascript:void(0)"
                    class="button-default button-white-orange button-block nunito-bold PaymentPage_ButtonCheckoutSekarang_Clicked">
                    Checkout Sekarang
                </a>
            </div>
        </div>
        <div v-else-if="flow === 'cart_page'" class="d-none d-lg-block gtmCTA" style="height: 48px;">
            <a href="/order/checkout" class="button-default button-white-orange button-block nunito-bold">Checkout Sekarang</a>
        </div>
        <div v-if="popup_login && orderflow_step == 3 && ! client" class="d-none d-lg-block gtmCTA" style="height: 48px;">
            <div id="checkout-button">
                <a @click="checkoutNow" href="javascript:void(0)"
                class="button-default button-white-orange button-block nunito-bold PaymentPage_ButtonLoginUntukBayar_Clicked">
                Masuk untuk Checkout
                </a>
            </div>
        </div>
    </div>
    <div v-else id="summary-cart">
      <div class="summary-cart">
        <div v-if="flow !== 'cart_page'" class="orderflow-step">
          <ul v-if="flow === 'website' || flow === 'mailhosting'">
            <li
              :class="{
                'orderflow-step__item--active': orderflow_step == 1,
                'orderflow-step__item--complete': orderflow_step > 1
              }"
              class="orderflow-step__item orderflow-step__item--website"
            >
              <div v-if="flow === 'website'" class="ribbon">1. Atur Website &amp; Domain</div>
              <div v-else class="ribbon">1. Pilih Website &amp; Domain</div>
            </li>
            <li class="orderflow-step__item orderflow-step__item--active orderflow-step__item--website">
              <div class="ribbon">2. Metode Pembayaran</div>
            </li>
          </ul>

          <ul v-else-if="flow === 'vps_kvm'">
            <li
              :class="{
                'orderflow-step__item--active': orderflow_step == 1,
                'orderflow-step__item--complete': orderflow_step > 1
              }"
              class="orderflow-step__item orderflow-step__item--website"
            >
              <div class="ribbon">1. Pilih VPS KVM</div>
            </li>
            <li class="orderflow-step__item orderflow-step__item--active orderflow-step__item--website">
              <div class="ribbon">2. Metode Pembayaran</div>
            </li>
          </ul>

          <ul v-else>
            <li
              :class="{
                'orderflow-step__item--active': orderflow_step == 1,
                'orderflow-step__item--complete': orderflow_step > 1
              }"
              class="orderflow-step__item"
            >
              <div class="ribbon">1. Pilih Hosting &amp; Domain</div>
            </li>
            <li
              :class="{
                'orderflow-step__item--active': orderflow_step == 2,
                'orderflow-step__item--complete': orderflow_step > 2
              }"
              class="orderflow-step__item"
            >
              <div class="ribbon">2. Tambah Fitur</div>
            </li>
            <li
              :class="{
                'orderflow-step__item--active': orderflow_step == 3,
                'orderflow-step__item--complete': orderflow_step > 3
              }"
              class="orderflow-step__item"
            >
              <div class="ribbon">3. Metode Pembayaran</div>
            </li>
          </ul>
        </div>
        <div v-else class="mb-4">Ringkasan Order</div>
        <div :class="{'d-block': show_summary_cart, 'd-none d-lg-block': !show_summary_cart}">
          <div id="summary-cart__item" class="summary-cart__item">
            <transition name="fade" mode="out-in">
              <div v-if="cart.items.length">
                <div v-for="item in cart.items" :key="item.id">
                  <div class="row">
                    <div class="col-8">
                      <div v-if="flow === 'website' && item.type == 'hosting'">
                        <p class="summary-cart__item-type">{{ item.title }}</p>
                      </div>
                      <div v-else-if=" flow === 'mailhosting' && item.type == 'hosting'">
                        <p class="summary-cart__item-type">
                          Mail {{ item.type }} {{ period[item.period].text }}
                        </p>
                      </div>
                      <div v-else>
                        <p v-if="item.type == 'hosting'" class="summary-cart__item-type text-capitalize">
                          {{ item.type }} {{ period[item.period].text }}
                        </p>
                        <p v-else-if="item.type == 'ssl'" class="summary-cart__item-type text-uppercase">
                          {{ item.type }}
                        </p>
                        <p v-else-if="item.type == 'domainprivacy'" class="summary-cart__item-type text-capitalize">
                          {{ item.type.replace("domain", "domain ") }}
                        </p>
                        <p v-else-if=" item.type == 'domain' && item.action === 'transfer'">
                          Transfer Domain
                        </p>
                        <p v-else-if="item.type == 'kvm'" class="summary-cart__item-type text-uppercase">
                          vps kvm
                        </p>
                        <p v-else-if="item.vps_cpanel" class="summary-cart__item-type">
                          <template v-if="item.type === 'vpsme'">VPS cPanel {{ period[item.period].text }}</template>
                          <template v-if="item.type === 'custom' && item.title === 'cPanel WHM Admin'">Control Panel {{ period[item.period].text }}</template>
                        </p>
                        <p v-else class="summary-cart__item-type text-capitalize">
                          {{ item.type }}
                        </p>
                      </div>
                    </div>
                    <div class="col-4">
                      <p class="font-size-18 text-right">
                        <span @click="removeFromCart(item)" class="fa fa-times remove-item"></span>
                      </p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-7">
                      <div v-if="flow === 'website' && item.type == 'hosting'">
                        <p class="summary-cart__item-title">{{ period[item.period].text }}</p>
                      </div>
                      <div v-else>
                        <p v-if="item.type == 'domain'" class="summary-cart__item-title">
                          {{ toUpperCase(item[item.action + "_sld"]) }}{{ toUpperCase(item[item.action + "_tld"]) }}
                        </p>
                        <p v-else-if="item.type === 'custom' && item.title === 'cPanel WHM Admin'" class="summary-cart__item-title">Gratis {{ item.title }}</p>
                        <p v-else class="summary-cart__item-title">{{ item.title }}</p>
                      </div>
                    </div>
                    <div class="col-5">
                      <p class="summary-cart__item-price">{{ item.total | formatPrice }}</p>
                      <p v-if="item.vps_cpanel && item.title === 'cPanel WHM Admin'" class="summary-cart__item-price"><s>{{ item.discount_price | formatPrice }}</s></p>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </transition>

            <p class="summary-cart__item-type">Pajak &amp; Biaya Tambahan</p>
            <div class="row">
              <div class="col-7">
                <p class="summary-cart__item-title">{{ taxName }}</p>
              </div>
              <div class="col-5">
                <p class="summary-cart__item-price text-right">{{ (cart.total * taxRate) | formatPrice }}</p>
              </div>
            </div>
            <hr />
          </div>
          <div v-if="orderflow_step == 3 || flow === 'cart_page'" class="summary-cart__coupon d-none d-lg-block">
            <div v-if="!show_coupon_status && promocode_copyable && getPackageText()" class="as-info">
              <p class="as-info__content">
                Tambahan diskon <strong>{{ promocode_copyable.discount }}</strong> pakai kode promo <strong>{{ promocode_copyable.promocode }}</strong> untuk pembelian layanan {{ getPackageText() }}!
              </p>
            </div>
            <div v-if="!show_coupon_status && additionalDiscountPayGateway == 0" class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                name="coupon_code"
                v-model="coupon_code"
                placeholder="Kode Kupon (opsional)"
                aria-label="Kode Kupon (opsional)"
                aria-describedby="coupon-code"
              />
              <div class="input-group-append">
                <button
                  id="coupon-code"
                  type="button"
                  @click="usePromoCode"
                  :class="{ 'summary-cart__coupon--btn-grey': coupon_code == '' }"
                  class="btn btn-secondary"
                  :disabled="coupon_code == ''"
                >
                  Gunakan
                </button>
              </div>
            </div>
            <transition name="fade" mode="out-in">
              <div v-if="show_coupon_status" class="summary-cart__coupon-status">
                <div v-if="coupon_status.result" class="row mb-4">
                  <div class="col-10">
                    <p>
                      Kode Kupon <strong>{{ coupon_code }}</strong> berhasil digunakan
                      <span v-if="extra_point"> dan Anda akan mendapatkan Bonus Extra <strong>{{ extra_point }}</strong> Poin pada order ini</span>
                    </p>
                  </div>
                  <div class="col-2">
                    <span @click="removeCoupon()" class="fa fa-times summary-cart__coupon-status--remove"></span>
                  </div>
                </div>
                <div v-else-if="coupon_status.error != null" class="row">
                  <div class="col-10">
                    <p class="summary-cart__coupon-status--error">{{ coupon_status.message }}</p>
                  </div>
                  <div class="col-2">
                    <span @click="removeCoupon()" class="fa fa-times summary-cart__coupon-status--remove"></span>
                  </div>
                </div>
                <div v-else class="row">
                  <div class="col-10">
                    <p class="summary-cart__coupon-status--error">{{ coupon_status.message }}</p>
                  </div>
                  <div class="col-2">
                    <span @click="removeCoupon()" class="fa fa-times summary-cart__coupon-status--remove"></span>
                  </div>
                </div>
              </div>
            </transition>
            <transition name="fade" mode="out-in">
                <div v-if="additionalDiscountPayGateway > 0">
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="summary-cart__coupon-check">
                                <div>
                                    Pembayaran <strong>{{ selectedPaymentMethodName }}</strong> diterapkan
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row as-mb-10">
                        <div class="col-12">
                            <div class="summary-cart__save">
                                <div>Tambahan diskon {{ cart.additional_discount_gateway.discount.type == "percentage" ? cart.additional_discount_gateway.discount.value + "%" : (cart.additional_discount_gateway.discount.value | formatPrice) }}, Anda akan lebih hemat sebesar <span>{{ Number(totalDiscount) | formatPrice }}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
          </div>
        </div>
        <div class="row">
          <div
            v-if="orderflow_step == 3 && payment_methods"
            :class="{
              'd-block': show_summary_cart,
              'd-none d-lg-block': !show_summary_cart
            }"
            class="col-12 order-lg-2"
          >
            <div class="row justify-content-beetwen align-items-center summary-cart__payment-method">
              <p class="col mb-0">Metode Pembayaran</p>
              <div class="col-auto" v-if="use_balance && gateway_id == 10">
                <span><strong>Deposit</strong></span>
              </div>
              <div class="col-auto" v-else-if="highlight_payment">
                <span><strong>{{ highlight_payment}} </strong></span>
              </div>
              <div class="col-auto" v-else>
                <strong v-for="method in payment_methods" :key="method.id">
                  <span v-if="method.id == gateway_id">{{ method.title }}</span>
                </strong>
              </div>
            </div>
            <tos-text v-bind:device-class="'summary-cart__tos-desktop'"></tos-text>
          </div>
          <div class="col-12">
            <div class="summary-cart__total">
              <div class="row justify-content-between" :class="{ 'align-items-center': !cart.coupon }">
                <div class="col pr-0">
                  <p class="summary-cart__total-title" :class="{'summary-cart__total-title--discount': cart.coupon}">
                    TOTAL&nbsp;<span v-if="cart.coupon">(-{{ discount_percentage }}%)</span>
                  </p>
                </div>
                <div class="col-auto">
                  <p v-if="cart.coupon" class="summary-cart__total-price summary-cart__total-price--discount">
                    {{ total_before_coupon | formatPrice }}
                  </p>
                  <p class="summary-cart__total-price">
                    {{ total | formatPrice }}
                    <span class="float-right badge badge-pill badge-light d-inline d-lg-none">{{ cart.items.length }}</span>
                  </p>
                </div>
                <a href="javascript:void(0);" v-on:click="show_summary_cart = true ? show_summary_cart == false : false"
                  class="summary-cart__total-details col-1 d-block d-lg-none pl-0" 
                  aria-label="cart"
                >
                  <span v-if="show_summary_cart" class="fa fa-angle-up"></span>
                  <span v-else class="fa fa-angle-down"></span>
                </a>
              </div>
            </div>
            <tos-text
              v-bind:device-class="'summary-cart__tos-desktop summary-cart__tos-mobile-logged'"
              v-if="client">
            </tos-text>
          </div>
        </div>
      </div>
      <div v-if="orderflow_step == 3 && client" id="checkout-button-wrapper" class="d-none d-lg-block gtmCTA">
        <div id="checkout-button">
          <a
            @click="checkoutNow"
            href="javascript:void(0)"
            class="button-default button-white-orange button-block nunito-bold PaymentPage_ButtonCheckoutSekarang_Clicked"
            >Checkout Sekarang</a
          >
        </div>
      </div>
      <div v-else-if="flow === 'cart_page'" class="d-none d-lg-block gtmCTA">
        <a :href="'order/checkout'|link" class="button-default button-white-orange button-block nunito-bold">Checkout Sekarang</a>
      </div>
    </div>
  </section>
</template>

<script>
import TosText from "./TosText.vue"
export default {
  name: "SummaryCartV2",
  components: {
    TosText
  },
  props: [
    "cart",
    "orderflow_step",
    "client",
    "gateway_id",
    "payment_methods",
    "hosting",
    "flow",
    "use_balance",
    "client_balance",
    "highlight_payment",
    "promo_available",
    "popup_login",
    "new_sidebar"
  ],
  data: function() {
    return {
      period: CommonVar.period,
      show_coupon_status: false,
      coupon_status: {
        result: false,
        message: "",
        error: false
      },
      coupon_code: "",
      show_summary_cart: false,
      user_input_change: false,
      extra_point: 0,
      taxRate: 0,
      taxName: '',
    };
  },
  computed: {
    promocode() {
      return this.cart.promocode;
    },
    total() {
      let total = this.cart.total * (1 + this.taxRate)
      if (this.use_balance && this.client_balance >= total) {
        total = 0
      } else if (this.use_balance && this.client_balance < total) {
        total = total - this.client_balance
      }
      total -= this.additionalDiscountPayGateway

      return total
    },
    total_before_coupon() {
      return this.cart.total_before_coupon * (1 + this.taxRate)
    },
    discount_percentage() {
      return Math.round(
        ((this.total_before_coupon - this.total) / this.total_before_coupon) *
          100
      );
    },
    auto_install_website() {
      return this.cart.items.filter(item => {
        return item.type == "hosting" && item.auto_install_website == "1";
      });
    },
    promocode_copyable() {
      if (Array.isArray(this.promo_available)) {
        return this.promo_available.filter(item => {
          return item.promocode === "CLOUDMAX" && this.flow === 'cloudhosting';
        })[0];
      }

      return this.promo_available;
    },
    totalDiscount() {
        let discount = 0;
        for (let value of this.cart.items) {
            if (value.price != undefined && value.total != value.price) {
                discount = discount + (value.price - value.total);
            }
        }
        discount += this.additionalDiscountPayGateway;

        return discount;
    },
    selectedPaymentMethodName() {
      for (let pm of this.payment_methods) {
        if (pm.id == this.gateway_id) {
          return pm.title;
        }
      }
      return "Unknown";
    },
    selectedPaymentMethodCode() {
        if (this.payment_methods) {
            for (let pm of this.payment_methods) {
                if (pm.id == this.gateway_id) {
                    return pm.code;
                }
            }
        }
        return "Unknown";
    },
    additionalDiscountPayGateway(){
      let additionalDiscount = 0;
      if (this.cart.additional_discount_gateway && this.gateway_id == this.cart.additional_discount_gateway.gateway_id) {
        if (this.cart.additional_discount_gateway.discount.type == "percentage") {
          additionalDiscount = this.cart.total * (this.cart.additional_discount_gateway.discount.value/100);
        } else {
          additionalDiscount = this.cart.additional_discount_gateway.discount.value;
        }
      }
      if (
          this.orderflow_step == 3 && 
          this.selectedPaymentMethodCode == 'HpaymentsKoinWorks' &&
          this.cart.items.length > 0 && additionalDiscount == 0
      ) {
        this.$emit("popup-failed", true);
      }
      return additionalDiscount;
    }
  },
  watch: {
    promocode: function() {
      if (!this.coupon_code) {
        if (this.cart.aff_coupon) {
          this.coupon_code = this.cart.aff_coupon;
        } else {
          this.coupon_code = this.cart.promocode;
        }
        if (this.coupon_code) {
          this.coupon_status.result = true;
          this.coupon_status.message = "Kode Coupon berhasil diaplikasikan";
          this.show_coupon_status = true;
          this.extra_point = CommonMethods.getCookie(this.coupon_code);
        }
      }
    },
    cart: function() {
      let key = Object.keys(this.cart.items);
      let items = this.cart.items;
      key = parseInt(key[key.length - 1]);
      items.forEach(item => {
        if (item.type == "hosting" && item.auto_install_website == "1") {
          items[key + 1] = {
            id: "",
            type: "wordpress",
            title: "",
            total: 0
          };
        }
      });

      setTimeout(() => {
        this.$root.$on("remove-wordpress", () => {
          this.removeWordPress();
          bus.$emit("refresh-cart");
        });
      }, 100);
    }
  },
  methods: {
    itemType(item) {  
        let itemType = item.type;
        if (this.flow === 'website' && item.type == 'hosting') {
            itemType = item.title
        } else if (this.flow === 'mailhosting' && item.type == 'hosting') {
            itemType = 'Mail ' + item.type + ' ' + this.period[item.period].text;
        } else {
            if (item.type == 'hosting') {
                itemType = 'Hosting ' + this.period[item.period].text;
            } else if (item.type == 'ssl') {
                itemType = item.type;
            } else if (item.type == 'domainprivacy') {
                itemType = item.type.replace("domain", "domain ");
            } else if (item.type == 'domain' && item.action === 'transfer') {
                itemType = 'Transfer Domain'
            } else if (item.type == 'kvm') {
                itemType = 'VPS KVM';
            } else if (item.vps_cpanel) {
                if (item.type === 'vpsme') {
                    itemType = 'VPS cPanel ' + this.period[item.period].text;
                }
                if (item.type === 'custom' && item.title === 'cPanel WHM Admin') {
                    itemType = 'Control Panel ' + this.period[item.period].text;
                }
            }
        }
        return itemType;
    },
    discountPrice(discount, price) {
        let discountPrice;
        discountPrice = Math.round((1 - (discount / price)) * 100);
        return discountPrice;
    },
    checkoutNow() {
      this.$emit("checkout-now", true);
    },
    checkUrlPath(path) {
      let urlPath;
      urlPath = window.location.pathname.split("/");
      return urlPath.includes(path);
    },
    usePromoCode() {
      bus.$emit("show-spinner", true);

      let email = "";
      let password = "";

      if (this.client) {
        email = this.client.email;
        password = this.client.password;
      }

      axios
        .post("/api/guest/use_promo_code", {
          promo_code: this.coupon_code,
          email: email,
          password: password
        })
        .then(res => {
          let result = res.data.result;
          let error = res.data.error;

          if (error != null) {
            this.coupon_status.result = false;
            this.coupon_status.message = error.message;
          } else {
            this.coupon_status.result = result.result;
            this.coupon_status.message = result.message;
            this.coupon_status.error = error;
            this.extra_point = 0;
            if (result.extra_point) {
              this.extra_point = result.extra_point;
              CommonMethods.setCookie(this.coupon_code, this.extra_point, 30);
            }
          }

          this.show_coupon_status = true;
          if (result != null && result.result) {
            if (result.is_affiliate) {
              CommonMethods.setCookie("coupon_code", this.coupon_code, 30);
              CommonMethods.setCookie("coupon_affiliate", true, 30);
              CommonMethods.removeCookie("inv_id");
              CommonMethods.removeCookie('PIXEL_AFF');
              let url =
                CommonVar.bb_url +
                "/set-promo-code-session?referral_id=" +
                result.referral_id +
                "&aff_coupon=" +
                this.coupon_code;

              let iframe = document.createElement("iframe");
              iframe.setAttribute("src", url);
              iframe.setAttribute("id", "set-promo-code-session");
              iframe.style.display = "none";
              document.body.appendChild(iframe);
            }

            bus.$emit("refresh-cart");
          } else {
            bus.$emit("show-spinner", false);
          }
        })
        .catch(err => {
          console.log(err);
          bus.$emit("show-spinner", false);
        });
    },
    removeCoupon() {
      bus.$emit("show-spinner", true);
      if (this.coupon_status.result == false) {
        this.show_coupon_status = false;
        this.coupon_code = "";
        bus.$emit("show-spinner", false);
        return;
      }
      axios
      .post("/api/guest/remove_coupon", {
        remove_coupon: true
      })
        .then((res)=> {
          CommonMethods.removeCookie(CommonMethods.getCookie("coupon_code"));
          CommonMethods.removeCookie("coupon_code");
          this.show_coupon_status = false;
          this.coupon_status.result = false;
          this.coupon_code = false;
          bus.$emit("refresh-cart");
        })
        .catch(err => {
          console.log(err);
          bus.$emit("show-spinner", false);
        });
    },
    removeFromCart(item, bundling = false) {
      bus.$emit("show-spinner", true);
      axios
        .post("/api/guest/remove_from_cart", {
          id: item.id
        })
        .then(res => {
          if(this.flow == "vps" || this.flow == "vps_kvm") {
            const key = (item.type === 'vpsme' || item.type === 'kvm') ? 'tmp_cart': 'tmp_additional';
            bus.$emit('remove-from-cart', key);
            bus.$emit('show-spinner', false);
          } else {
            bus.$emit("refresh-cart");
            /* It will uncheck additional feature checkbox, the listener is on AdditionalFeature.vue */
            bus.$emit("remove-item", item);
            if (item.type == "wordpress") {
              this.$root.$emit("remove-wordpress");
            }
            if (item.is_added_to_cart) {
              item.is_added_to_cart = false;
            }

            let action;
            let tld;

            if (item.type == "domain") {
              action = item.action;
              tld = item[action + "_tld"];
            } else {
              action = item.domain.action;
              tld = item.domain[action + "_tld"];
            }
            if (CommonVar.allow_mkt_script == true) {
              Gtm.gtmRemoveFromCart(item.type, item.title, tld);
            }
          }
        })
        .catch(err => {
          console.log(err);
          bus.$emit("show-spinner", false);
        });
      sessionStorage.removeItem("tmp_cart");
    },
    removeWordPress() {
      axios
        .post("/api/guest/add_remove_auto_install_website", {
          is_add: false
        })
        .catch(err => {
          console.log(err);
        });
      axios
        .post("/api/guest/add_remove_install_wp_accelerator", {
          is_add: false
        })
        .catch(err => {
          console.log(err);
        });
    },
    toUpperCase(str) {
      return str.toUpperCase();
    },

    onScrollListener() {
      let cartWrapper = document.getElementById("summary-cart-wrapper");
      let cartElement = document.getElementById("summary-cart");
      if (this.cart.items.length && screen.width > 991) {
        if (Math.floor(window.scrollY) - 50 > cartWrapper.offsetTop) {
          cartElement.classList.add("sticky-cart");
          this.adjustResize();
        } else {
          cartElement.classList.remove("sticky-cart");
        }
      } else {
        cartElement.classList.remove("sticky-cart");
      }
    },

    adjustResize() {
      let cartWrapper = document.getElementById("summary-cart-wrapper");
      let cartElement = document.getElementById("summary-cart");
      let itemElement = document.getElementById("summary-cart__item");
      if (screen.width > 991) {
        /*For Desktop*/
        cartElement.style.width = cartWrapper.offsetWidth + "px";
        if (screen.height < 810) {
          itemElement.classList.add("summary-cart__item--max-height");
        } else {
          itemElement.classList.remove("summary-cart__item--max-height");
        }
      } else {
        /*For Mobile*/
        cartElement.classList.remove("sticky-cart");
        cartElement.style.width = cartWrapper.offsetWidth + "px";
        itemElement.classList.remove("summary-cart__item--max-height");
      }
    },
    checkUserInputChange() {
      this.$root.$on("user-input-change", status => {
        return (this.user_input_change = status);
      });
    },
    setCouponStatus() {
      this.$root.$on("set-coupon-status", status => {
        this.coupon_status = status;
      });
    },
    getPackageText() {
      if (!this.cart.items.length) {
        return false;
      }

      let loop        = true;
      let packageText = false;
      let promoId     = this.promocode_copyable.checkout.id;
      
      this.cart.items.forEach((item) => {
        Object.keys(promoId).forEach((key) => {
          if (promoId[key].indexOf(parseInt(item.product_id)) != -1) {
            packageText = this.promocode_copyable.package_text[key];
            loop        = false;
          }
          if (!loop) return;
        });
        if (!loop) return;
      });

      return packageText;
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
  mounted: function() {
    setTimeout(() => {
      bus.$on("change-coupon-status", (msg, err) => {
        this.coupon_status.result = false;
        this.coupon_status.message = msg;
        this.coupon_status.error = err;
      });
      bus.$on("refresh-coupon-status", () => {
        this.coupon_code = false;
        this.show_coupon_status = false;
      });
    }, 100);
  },
  created() {
    this.getTaxRate();
    this.checkUserInputChange();

    if (sessionStorage.getItem("flow")) {
      this.$emit("update-flow", sessionStorage.getItem("flow"));
      this.flow = sessionStorage.getItem("flow");
    }

    this.setCouponStatus();
  }
};
</script>
