<template>
    <div class="section-cart">
        <div class="section-title">
            <h3 class="nunito-bold font-size-24 color-4d5872">CART</h3>
        </div>
        <div class="section-body">
            <div class="card">
                <div class="order-review">
                    <p class="nunito-bold color-4d5872 font-size-21">Review Order Anda</p>
                    <ul class="cart">
                        <li class="cart-item" v-for="item in cart.items">
                            <p class="nunito-bold font-size-16 color-4d5872">{{ toUpperCase(item.type) }}</p>

                            <p v-if="item.type == 'domain' && item.total != 0" class="nunito-regular font-size-14 color-4d5872">
                                {{ toUpperCase(item[item.action + '_sld']) }} {{ toUpperCase(item[item.action + '_tld']) }}
                            </p>
                            <p v-if="item.type != 'domain'" class="nunito-regular font-size-14 color-4d5872">{{ item.title }}</p>

                            <div v-if="item.type == 'domain'" class="col-md-6 no-padding">
                                <p v-if="item.total == 0" class="nunito-regular font-size-14 color-4d5872">Domain gratis dengan nama {{ item[item.action + '_sld'] + item[item.action + '_tld'] }}</p>
                                <p v-else class="nunito-regular font-size-14 color-4d5872">
                                    {{ period[item.period].text }} Rp. {{ formatPrice(item.total) }} (Rp. {{ formatPrice(item.total / period[item.period].num_of_month) }}/bln)
                                </p>
                            </div>

                            <div v-else class="col-md-6 no-padding">
                                <p class="nunito-regular font-size-14 color-4d5872">
                                    {{ period[item.period].text }} Rp. {{ formatPrice(item.total) }} (Rp. {{ formatPrice(item.total / period[item.period].num_of_month) }}/bln)
                                </p>
                            </div>

                            <div class="col-md-6 no-padding text-right">
                                <h3 class="nunito-bold font-size-24 color-4d5872">Rp. {{ formatPrice(item.total) }}</h3>
                            </div>
                        </li>

                    </ul>
                </div>
                <div class="sub-total-and-tax">
                    <div class="col-md-6 no-padding text-left">
                        <p class="nunito-bold font-size-21 color-4d5872">Sub Total</p>
                        <p style="margin-top: 28px;" class="nunito-bold font-size-21 color-4d5872">{{ taxName }}</p>
                    </div>
                    <div class="col-md-6 no-padding text-right">
                        <h3 class="nunito-bold font-size-24 color-4d5872">{{ formatPrice(cart.total) }}</h3>

                        <h3 style="margin-top: 28px;" class="nunito-bold font-size-24 color-4d5872">{{ formatPrice(cart.total * taxRate) }}</h3>
                    </div>
                </div>
                <div class="total">
                    <div class="col-md-6 no-padding text-left">
                        <p class="nunito-bold font-size-21 color-4d5872">Total</p>
                    </div>
                    <div class="col-md-6 no-padding text-right">
                        <p class="nunito-bold font-size-24 color-007aff">Rp. {{ formatPrice(cart.total + (cart.total * taxRate)) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SectionCart",
        props: ['cart'],
        data() {
            return  {
                period: CommonVar.period,
                taxRate: 0,
                taxName: '',
            }
        },
        methods: {
            formatPrice(value) {
                value = Math.round(value);
                let val = (value/1).toFixed(2).replace('.', ',');
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            toUpperCase(str) {
                return str.toUpperCase();
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
        created() {
            this.getTaxRate();
        },
    }
</script>

<style scoped>

</style>