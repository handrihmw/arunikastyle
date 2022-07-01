<template>
    <div>
        <div class="row winner-form--dekstop">
            <div class="col-md-3">
                <div class="nav flex-columns" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a :class="'as-nav-col pb-3 ' + (step == 1 ? 'show active' : '')">
                        <a class="d-none" id="v-pills-one-tab" data-toggle="pill" href="#v-pills-one" role="tab" aria-controls="v-pills-one" aria-selected="true"></a>
                        <div class="row">
                            <div class="d-flex justify-content-start align-items-center col-12">
                                <img src="/assets/images/2021/arunika/free-vps/ico/step-1.svg" class="img-fluid mr-3" loading="lazy" alt="icon" />
                                <span class="as-nav-col__title mt-2">Step 1</span>
                            </div>
                            <p class="as-nav-col__description ml-2 mt-2">Like, Share, dan Subscribe</p>
                        </div>
                    </a>
                    <a :class="'as-nav-col ' + (step == 2 ? 'active' : '')">
                        <a class="d-none" id="v-pills-two-tab" data-toggle="pill" href="#v-pills-two" role="tab" aria-controls="v-pills-two" aria-selected="true"></a>
                        <div class="row">
                            <div class="d-flex justify-content-start align-items-center col-12">
                                <img src="/assets/images/2021/arunika/free-vps/ico/step-2.svg" class="img-fluid mr-3" loading="lazy" alt="icon" />
                                <span class="as-nav-col__title">Step 2</span>
                            </div>
                            <p class="as-nav-col__description ml-2 mt-2">Pilih Layanan VPS</p>
                        </div>
                    </a>
                    <a :class="'as-nav-col ' + (step == 3 ? 'active' : '')" >
                        <a id="v-pills-three-tab" data-toggle="pill" href="#v-pills-three" role="tab" aria-controls="v-pills-three" aria-selected="true"></a>
                        <div class="row">
                            <div class="d-flex justify-content-start align-items-center col-12">
                                <img src="/assets/images/2021/arunika/free-vps/ico/step-3.svg" class="img-fluid mr-3" loading="lazy" alt="icon" />
                                <span class="as-nav-col__title">Step 3</span>
                            </div>
                            <p class="as-nav-col__description ml-2 mt-2">Isi Data Diri Anda</p>
                        </div>
                    </a>
                </div>
            </div>
            <div class="col-md-9 ps-lg-5">
                <div class="tab-content text-left pl-4" id="v-pills-tabContent">
                    <div class="tab-pane as-nav-col__pane fade show active" id="v-pills-one" role="tabpanel" aria-labelledby="v-pills-one-tab">
                        <vps-flow-step-one @onButtonNext="onStepChangeEvent"/>
                    </div>

                    <div class="tab-pane as-nav-col__pane fade" id="v-pills-two" role="tabpanel" aria-labelledby="v-pills-two-tab">
                        <vps-flow-step-two @onButtonNext="onStepChangeEvent"/>
                    </div>

                    <div class="tab-pane as-nav-col__pane fade" id="v-pills-three" role="tabpanel" aria-labelledby="v-pills-three-tab">
                        <div class="as-nav-col__content">
                            <div class="row">
                                <div class="col-md-12">
                                    <p class="mb-4">Langkah 3: Isi data diri Anda dengan data secara lengkap dengan informasi alamat email yang valid dan masih aktif.</p>
                                    <p v-if="status.msg" :class="'alert alert-' + (status.type)">{{status.msg}}</p>
                                </div>
                                <div class="col-md-12">
                                    <input type="hidden" name="vps_type" value="KVM" v-model="vpsType"/>
                                    <div class="mb-3">
                                        <label for="contact_name" class="form-label">Nama Anda</label>
                                        <input :disabled="loading" type="text" class="form-control rounded-pill" required="required" id="contact_name" v-model="contact_name" aria-describedby="contact_name" placeholder="Contoh : Budi Saputra" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input :disabled="loading" type="email" class="form-control rounded-pill" required="required" id="email" v-model="email" placeholder="Contoh : emailbudi@gmail.com" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="company" class="form-label">Nama Perusahaan</label>
                                        <input :disabled="loading" type="text" class="form-control rounded-pill" required="required" id="company" v-model="company" placeholder="Contoh : PT Budi Sejahtera" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Nomor Telepon *</label>
                                        <input :disabled="loading" type="text" class="form-control rounded-pill" required="required" id="contact_phone" v-model="contact_phone" placeholder="Contoh: 081234567890" />
                                    </div>
                                    <div class="col-12 mt-5">
                                        <button @click="formSubmit" :disabled="loading" :class="'as-btn--rounded go-daftar-sekarang ' + (!loading ? 'as-btn--primary' : 'as-btn--disabled')">Dapatkan VPS Gratis</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row winner-form--mobile">
            <div class="col-12">
                <div class="accordion" id="navigationMobileTwo">
                    <div>
                        <a :class="'as-nav-col pb-3 ' + (step == 1 ? 'show active' : '')">
                            <a class="d-none" id="v-pills-mobile-one-tab" data-toggle="pill" href="#v-pills-mobile-one" role="tab" aria-controls="v-pills-mobile-one" aria-selected="true"></a>
                            <div class="row">
                                <div class="d-flex justify-content-start align-items-center col-12">
                                    <img src="/assets/images/2021/arunika/free-vps/icon/step-1.svg" class="img-fluid mr-3" loading="lazy" alt="icon" />
                                    <span class="as-nav-col__title mt-2">Step 1</span>
                                </div>
                                <p class="as-nav-col__description ml-2 mt-2">Like, Share, dan Subscribe</p>
                            </div>
                        </a>
                        <div :class="'tab-pane as-nav-col-sm__pane collapse p-3 ' +(step == 1 ? 'show':'')" id="v-pills-mobile-one" aria-labelledby="v-pills-mobile-one">
                            <div class="as-nav-col-sm__content">
                                <vps-flow-step-one @onButtonNext="onStepChangeEvent"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <a :class="'as-nav-col ' + (step == 2 ? 'active' : '')">
                            <a class="d-none" id="v-pills-mobile-two-tab" data-toggle="pill" href="#v-pills-mobile-two" role="tab" aria-controls="v-pills-mobile-two" aria-selected="false"></a>
                            <div class="row">
                                <div class="d-flex justify-content-start align-items-center col-12">
                                    <img src="/assets/images/2021/arunika/free-vps/icon/step-2.svg" class="img-fluid mr-3" loading="lazy" alt="icon" />
                                    <span class="as-nav-col__title">Step 2</span>
                                </div>
                                <p class="as-nav-col__description ml-2 mt-2">Pilih Layanan VPS</p>
                            </div>
                        </a>
                        <div :class="'tab-pane as-nav-col-sm__pane collapse p-3 ' + (step == 2 ? 'show':'')" id="v-pills-mobile-two" aria-labelledby="v-pills-mobile-two">
                            <div class="as-nav-col-sm__content">
                                <vps-flow-step-two @onButtonNext="onStepChangeEvent"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <a :class="'as-nav-col ' + (step == 3 ? 'active' : '')" >
                            <a id="v-pills-mobile-three-tab" data-toggle="pill" href="#v-pills-mobile-three" role="tab" aria-controls="v-pills-mobile-three" aria-selected="false"></a>
                            <div class="row">
                                <div class="d-flex justify-content-start align-items-center col-12">
                                    <img src="/assets/images/2021/arunika/free-vps/icon/step-3.svg" class="img-fluid mr-3" loading="lazy" alt="icon" />
                                    <span class="as-nav-col__title">Step 3</span>
                                </div>
                                <p class="as-nav-col__description ml-2 mt-2">Isi Data Diri Anda</p>
                            </div>
                        </a>
                        <div :class="'tab-pane as-nav-col-sm__pane collapse p-3 ' + (step == 3 ? 'show':'')" id="v-pills-mobile-three" aria-labelledby="v-pills-mobile-three">
                            <div class="as-nav-col-sm__content">
                                <div class="row">
                                    <div class="col-md-12">
                                        <p class="mb-4">Langkah 3: Isi data diri Anda dengan data secara lengkap dengan informasi alamat email yang valid dan masih aktif.</p>
                                        <p v-if="status.msg" :class="'alert alert-' + (status.type)">{{status.msg}}</p>
                                    </div>
                                    <div class="col-md-12">
                                        <input type="hidden" name="vps_type" value="KVM" v-model="vpsType"/>
                                        <div class="mb-3">
                                            <label for="contact_name" class="form-label">Nama Anda</label>
                                            <input :disabled="loading" type="text" class="form-control rounded-pill" required="required" id="contact_name" v-model="contact_name" aria-describedby="contact_name" placeholder="Contoh : Budi Saputra" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="email" class="form-label">Email</label>
                                            <input :disabled="loading" type="email" class="form-control rounded-pill" required="required" id="email" v-model="email" placeholder="Contoh : emailbudi@gmail.com" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="company" class="form-label">Nama Perusahaan</label>
                                            <input :disabled="loading" type="text" class="form-control rounded-pill" required="required" id="company" v-model="company" placeholder="Contoh : PT Budi Sejahtera" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="email" class="form-label">Nomor Telepon *</label>
                                            <input :disabled="loading" type="text" class="form-control rounded-pill" required="required" id="contact_phone" v-model="contact_phone" placeholder="Contoh: 081234567890" />
                                        </div>
                                        <div class="col-12 mt-5">
                                            <button @click="formSubmit" :disabled="loading" :class="'as-btn--rounded go-daftar-sekarang ' + (!loading ? 'as-btn--primary' : 'as-btn--disabled')">Dapatkan VPS Gratis</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VpsFlowStepOne from './partial/StepOne.vue';
import VpsFlowStepTwo from './partial/StepTwo.vue';

export default {
    name:"vpsFLow",
    components:{
        'vps-flow-step-one' : VpsFlowStepOne,
        'vps-flow-step-two' : VpsFlowStepTwo,
    },
    data() {
        return {
            contact_name:'',
            contact_phone:'',
            email:'',
            company:'',
            step:1,
            vpsType:'KVM',
            loading:false,
            status:{
                type:'warning',
                msg:''
            }
        }
    },
    methods: {
        onStepChangeEvent(step, type){
            this.vpsType = type
            this.step = step
        },
        formSubmit(){
            this.loading = true
            axios.post('/api/guest/raffle_free_vps', {
                name:this.contact_name,
                phone:this.contact_phone,
                email:this.email,
                company:this.company,
                vps_type:this.vpsType,
            })
            .then(res => {
                var data = res.data
                if (data.error && data.error.message) {
                    this.status.type = 'warning'
                    this.status.msg = data.error.message
                } else {
                    this.status.type = 'success'
                    this.status.msg  = 'Terimakasih karena sudah mendaftar program VPS Gratis'
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            })
            .catch(err => {
                this.status.type = 'danger'
                this.status.msg = String(err)
            })
            .then( () => {
                this.loading = false
            })
        }
    }
}
</script>
