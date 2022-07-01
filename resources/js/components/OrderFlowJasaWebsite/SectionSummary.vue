<template>
    <section id="summary-cart-wrapper">       
        <div id="summary-cart">
            <div class="summary-cart">                
                <div class="orderflow-step">
                    <ul>
                        <li :class="{'orderflow-step__item--active':step == 1, 'orderflow-step__item--complete':step > 1}" class="orderflow-step__item orderflow-step__item--website">
                            <div class="ribbon">1. Detail Bisnis Anda</div>
                        </li>
                        <li :class="{'orderflow-step__item--active':step == 2, 'orderflow-step__item--complete':step > 2}" class="orderflow-step__item orderflow-step__item--website">
                            <div class="ribbon">2. Tambahan</div>
                        </li>
                        <li :class="{'orderflow-step__item--active':step == 3, 'orderflow-step__item--complete':step > 3}" class="orderflow-step__item orderflow-step__item--website">
                            <div class="ribbon">3. Data diri dan Kontak</div>
                        </li>
                    </ul>
                </div>
                <div>
                    <div id="summary-cart__item" class="summary-cart__item">
                        <transition name="fade" mode="out-in">
                            <div>
                                <div class="row">
                                    <div class="col-8">
                                        <p class="summary-cart__item-type">Estimasi Harga Jasa</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-7">
                                        <p class="summary-cart__item-title">{{package_name}}</p>
                                    </div>
                                    <div class="col-5">
                                        <p class="summary-cart__item-price text-right">Rp{{package_price | formatPrice}}</p>
                                    </div>
                                </div>
                                <hr>
                            </div>
                        </transition>
                        <transition>
                            <div>
                                <div class="row mb-2">
                                    <div class="col-10">
                                        <p class="text-capitalize summary-cart__item-type">
                                            Biaya Tambahan
                                        </p>
                                    </div>
                                </div>
                                <div v-if="totalPrice == package_price" class="row">
                                    <div class="col-12 summary-cart__item-title">
                                        Tidak Ada Tambahan
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-for="(group, groupIndex) in additionals" :key="groupIndex">
                                        <div v-for="(item, index) in group" :key="index">
                                            <div v-if="item.price && item.price != 0" class="row mb-4">
                                                <div class="col-7">
                                                    <p class="summary-cart__item-title">{{item.text}}</p>
                                                </div>
                                                <div class="col-5">
                                                    <p class="summary-cart__item-price text-right">Rp{{item.price | formatPrice}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <hr>
                    </div>
                    <div class="summary-cart__total">
                        <div class="row align-items-center">
                            <div class="col-4 col-lg-3">
                                <p class="summary-cart__total-title">ESTIMASI BIAYA</p>
                            </div>
                            <div class="col-8 col-lg-9">
                                <p class="summary-cart__total-price text-right">
                                    ~Rp{{totalPrice | formatPrice}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="summary-cart__disclaimer">
                        Harga diatas masih estimasi dan belum harga final. Info lebih lanjut terkait biaya akan diinfokan oleh Account Manager kami
                    </div>
                </div>
            </div> 
        </div>      
    </section>
</template>

<script>
import CommonMethods from '../../CommonMethods';
export default {
    name: "JasaWebsiteSectionSummary",
    props: [
        'additionals',
        'flow',
        'package_id',
        'package_name',
        'package_price',
        'step'
    ],
    data() {
        return {
            totalPrice: 0
        }
    },
    filters: {
        formatPrice(value) {
            return CommonMethods.formatPrice(value)
        }
    },
    mounted() {
        let temporary = this.additionals;
        let tempPrice = 0;
        Object.keys(this.additionals).forEach(function(key) {
            temporary[key].forEach((item, index) => {
                if (item.price) {
                    tempPrice += item.price;
                }
            });
        });
        this.totalPrice = tempPrice;
        this.totalPrice = tempPrice + this.package_price;
    }
}
</script>