<template>
  <div class="hosting-package mt-lg-0 mt-5">
    <form ref="questions-form" @submit.prevent="submit">
      <h2 class="hosting-package__title question-box-header">
        Pemesanan Paket {{package_name}}
      </h2>
      <hr>
      <div class="question-box" v-if="questionStep == 1">
        <div class="question-box__item">
          <div class="question-box__item__question">
          Apakah Anda sudah pernah menggunakan jasa Niagaweb sebelumnya?
          </div>
          <div class="question-box__item__answers container-fluid">
            <div class="row">
              <div class="col-12 col-lg-6 px-0 pl-lg-0 pr-lg-1">
                <div class="answer--radio">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="order_model.first_time" id="notFirstTimeRadio" value="no" checked>
                    <label class="form-check-label" for="notFirstTimeRadio">
                      Belum, ini pertama kali
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-6 px-0 px-0 pr-lg-0 pl-lg-1">
                <div class="answer--radio">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="order_model.first_time" id="yesFirstTimeRadio" value="yes">
                    <label class="form-check-label" for="yesFirstTimeRadio">
                      Sudah pernah
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="question-box__item">
          <div class="question-box__item__question">
          Dalam bidang apa bisnis Anda bergerak?
          </div>
          <div class="question-box__item__answers">
          <div class="answer--textarea">
            <div class="form-group">
            <textarea class="form-control" v-model="order_model.business_field" rows="6" placeholder="Misal: Jasa Properti, Firma Hukum, Perusahaan IT, dan sebagainya."></textarea>
            </div>
          </div>
          </div>
        </div>
        <div class="question-box__item">
          <div class="question-box__item__question">
          Apa nama website yang Anda inginkan?
          </div>
          <div class="question-box__item__answers">
            <div class="answer--input-dropdown">
              <div v-bind:class="'col-8 col-md-9'" class="col-8 px-0">
                <input type="text" 
                  class="orderflow-domain__register-sld border-right-0"
                  v-model="order_model.sld"
                  v-bind:placeholder="'namadomainbaru'">
              </div>
              <div class="col-4 col-md-3 px-0">
                <v-select :options="tlds" :clearable="false"
                  class="orderflow-domain__register-tld border-left-0 vs--single vs--searchable"
                  v-model="order_model.tld" :placeholder="order_model.tld">
                  <div slot="no-options">Ekstensi domain tidak ada</div>
                </v-select>
              </div>
            </div>
          </div>
        </div>
        <div class="question-box__item">
          <div class="question-box__item__question">
          Apakah Anda punya referensi desain website yang diinginkan?
          </div>
          <div class="question-box__item__answers">
          <div class="answer--input">
            <input type="text" class="form-control" v-model="order_model.reference" placeholder="Misal: tokohepi.com, niagahoster.com, dan sebagainya.">
          </div>
          </div>
        </div>
      </div>
      <div class="question-box" v-if="questionStep == 2">
        <div v-for="(question_set, index) in questionSet" :key="index">
          <div v-if="package_id == question_set.id">
            <div v-for="(q, i) in question_set.questions" :key="i">
              <div class="question-box__item" :data-product-id="question_set.id">
                <div class="question-box__item__question">
                  {{q.question}}
                </div>
                <div class="question-box__item__answers">
                  <div :class="'answer--' + q.type" 
                  v-for="(answer, num) in q.answers"
                  :key="num">
                    <div class="form-check">
                      <input v-if="q.type == 'multi-radio'" 
                        class="form-check-input" 
                        type="radio" 
                        v-model="order_questions[question_set.id][i]['answer']" 
                        :value="answer.price ? answer.text + ' [+ Rp' + answer.price + ']' : answer.text" 
                        @click="addToAdditionals(i, answer, true)">
                      <input v-else 
                        type="checkbox" 
                        class="form-check-input"
                        v-model="order_questions[question_set.id][i]['answer']" 
                        :value="answer.price ? answer.text + ' [+ Rp' + answer.price + ']' : answer.text"
                        @click="(num != 0) ? addToAdditionals(i, answer, false) : addToAdditionals(i, answer, true)"> <!-- Add Price to Answer -->
                      <label class="form-check-label form-check-label--flex" :id="'question-' + i">
                        <div>
                          {{answer.text}}
                        </div>
                        <div v-if="answer.price" class="form-check-label__price">
                          + Rp{{answer.price | formatPrice}}
                          <span v-if="answer.unit">/ {{answer.unit}}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div v-if="q.accept_custom" :class="'answer--' + q.type">
                    <div class="form-check" v-if="q.type == 'multi-radio'">
                      <input class="form-check-input" 
                        type="radio"
                        v-model="order_questions[question_set.id][i]['answer']"
                        value="custom">
                      <label class="form-check-label" :for="'question-' + i">
                        Yang lain:
                      </label>
                      <input type="text" 
                        class="form-check-field" 
                        v-model="order_questions[question_set.id][i]['other']">
                    </div>
                    <div class="form-check" v-else>
                      <input type="checkbox" 
                        class="form-check-input" 
                        v-model="order_questions[question_set.id][i]['answer']" 
                        value="custom">
                      <label class="form-check-label" :for="'question-' + i">
                        Yang lain:
                      </label>
                      <input type="text" 
                        class="form-check-field" 
                        v-model="order_questions[question_set.id][i]['other']">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="question-box" v-if="questionStep == 3">
        <div class="question-box__note mb-5">
          <p>
            Terima kasih sebelumnya telah mengisi formulir untuk kebutuhan website Anda. Pada tahap terakhir ini, kami membutuhkan data diri Anda berupa nama, e-mail, dan nomor telepon yang dapat dihubungi oleh Account Manager kami.
          </p>
          <p>
            Jika lebih dari 3 hari kerja setelah mengirimkan formulir Account Manager kami belum menghubungi Anda, Anda bisa menghubungi Account Manager kami di nomor berikut ini:
          </p>
          <div class="container-fluid px-0">
            <div class="row">
              <div class="col-12 col-lg-4 mb-1 mb-lg-0">
                <div class="phone-box">
                  Dimas: 0852-2822-7582
                </div>
              </div>
              <div class="col-12 col-lg-4 mb-1 mb-lg-0">
                <div class="phone-box">
                  Danang: 0851-5900-7472
                </div>
              </div>
              <div class="col-12 col-lg-4 mb-1 mb-lg-0">
                <div class="phone-box">
                  Brian: 0822-3253-8778
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container-fluid px-0">
          <div class="row">
          <div class="col-12 col-lg-6 question-box__item">
            <div class="question-box__item__question">
            Nama Anda
            </div>
            <div class="question-box__item__answers">
            <div class="answer--input">
              <input type="text" 
                v-model="order_model.name" 
                class="form-control" 
                placeholder="Nama Anda">
            </div>
            </div>
          </div>
          <div class="col-12 col-lg-6 question-box__item">
            <div class="question-box__item__question">
            Alamat Email Anda
            </div>
            <div class="question-box__item__answers">
            <div class="answer--input">
              <input type="email" 
                v-model="order_model.email" 
                class="form-control" 
                placeholder="mail@mail.com">
            </div>
            </div>
          </div>
          <div class="col-12 question-box__item">
            <div class="question-box__item__question">
            Nomor yang bisa dihubungi (Telepon/WhatsApp)
            </div>
            <div class="question-box__item__answers">
            <div class="answer--input">
              <input type="text" 
                v-model="order_model.phone" 
                class="form-control" 
                placeholder="081234567890">
            </div>
            </div>
          </div>
          <div class="col-12 question-box__item">
            <div class="question-box__item__question">
            Lebih suka dihubungi melalui:
            </div>
            <div class="question-box__item__answers">
            <div class="col-12 col-lg-4 px-0 pl-lg-0 pr-lg-1 mb-1 mb-lg-0">
              <div class="answer--radio">
                <div class="form-check">
                  <input class="form-check-input"
                    type="radio"
                    v-model="order_model.contact_by"
                    id="phoneRadio" 
                    value="phone">
                  <label class="form-check-label" for="phoneRadio">
                  Telepon
                  </label>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4 px-0 px-lg-1 mb-1 mb-lg-0">
              <div class="answer--radio">
                <div class="form-check">
                  <input class="form-check-input" 
                    type="radio" 
                    v-model="order_model.contact_by"
                    id="whatsappRadio" 
                    value="whatsapp">
                  <label class="form-check-label" for="whatsappRadio">
                  WhatsApp
                  </label>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4 px-0 pr-lg-0 pl-lg-1 mb-1 mb-lg-0">
              <div class="answer--radio">
                <div class="form-check">
                  <input class="form-check-input"
                    type="radio" 
                    v-model="order_model.contact_by"
                    id="emailRadio" 
                    value="email">
                  <label class="form-check-label" for="emailRadio">
                  Email
                  </label>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div class="col-12 question-box__item">
            <div class="question-box__item__question">
            Pertanyaan dan Komentar
            </div>
            <div class="question-box__item__answers">
            <div class="answer--textarea">
              <div class="form-group">
              <textarea class="form-control"
                v-model="order_model.comment_question"
                rows="6" 
                placeholder="Ada saran atau pertanyaan untuk kami? Tulis saja disini!"></textarea>
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>
        </div>
      <div class="question-footer">
        <div class="question-footer-left">
          <div class="question-footer__step">
            Langkah {{this.questionStep}} dari 3
          </div>
          <div class="question-footer__progress">
            <div class="question-footer__progress-text" v-if="this.questionStep == 1">
              Detail Bisnis Anda
            </div>
            <div class="question-footer__progress-text" v-if="this.questionStep == 2">
              Tambahan
            </div>
            <div class="question-footer__progress-text" v-if="this.questionStep == 3">
              Data Diri dan Kontak
            </div>
            <div class="question-footer__progress-bar">
              <div class="progress-bar__background" style="width: 100%"></div>
              <div class="progress-bar__overlay" :style="'width:' + progressPercentage + '%'"></div>
            </div>
          </div>
        </div>
        <div class="question-footer-right">
          <button class="jasa-website-button jasa-website-button--previous" @click.prevent="previous()" v-if="questionStep > 1">Sebelumnya</button>
          <button class="jasa-website-button" @click.prevent="next()" v-if="questionStep < 3">Lanjutkan</button>
          <button class="jasa-website-button" v-if="questionStep == 3">Kirim Jawaban</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import CommonMethods from '../../CommonMethods';
export default {
  name: "QuestionBox",
  emits: ['update-cart', 'update-step'],
  props: [
    'tlds',
    'package_id', 
    'package_name', 
    'package_price',
    'checkout_gtm_name',
    'checkout_gtm_tag'
  ],
  data() {
    return {
      additionals: {},
      order_model: {
        'business_field': '',
        'first_time': 'no',
        'sld': '',
        'tld': '.com',
        'reference': '',
        'name': '',
        'email': '',
        'phone': '',
        'contact_by': '',
        'comment_question': '',
      },
      order_questions: [],
      progressPercentage: 0,
      questionStep: 1,
      questionSet: [
        {
          'id': '90',
          'questions': [
            {
              'accept_custom': false,
              'type': 'multi-radio',
              'question': 'Apakah Anda ingin mengupgrade hosting Anda?',
              'answers': [
                {
                  'text': 'Tidak, gunakan yang standar saja.'
                },
                {
                  'text': 'Upgrade ke Paket Personal',
                  'price': 250000,
                },
                {
                  'text': 'Update ke Paket Bisnis',
                  'price': 500000,
                },
                {
                  'text': 'Upgrade ke Paket Cloud Hosting Bisnis',
                  'price': 2500000
                },
                {
                  'text': 'Gunakan hosting saya sendiri (Pastikan Anda sudah punya hosting sendiri untuk opsi ini)'
                }
              ]
            },
            {
              'accept_custom': true,
              'type': 'multi-radio',
              'question': 'Apakah Anda ingin menambahkan kesempatan revisi untuk website Anda?',
              'answers': [
                {
                  'text': 'Tidak, gunakan kesempatan sekali revisi saja.'
                },
                {
                  'text': 'Tambah 1 kali revisi - Total 2 Kali Revisi',
                  'price': 300000
                },
                {
                  'text': 'Tambah 2 kali revisi - Total 3 Kali Revisi',
                  'price': 600000
                },
                {
                  'text': 'Tambah 3 kali revisi - Total 4 Kali Revisi',
                  'price': 900000
                },
              ]
            },
            {
              'accept_custom': true,
              'type': 'multi-radio',
              'question': 'Apakah Anda ingin menambahkan jumlah halaman awal pada website Anda?',
              'answers': [
                {
                  'text': 'Tidak, cukup dengan jatah halaman awal saat ini saja'
                },
                {
                  'text': 'Tambah 1 Halaman Awal - Rp 250.000 per Halaman',
                  'price': 250000
                },
                {
                  'text': 'Tambah 3 Halaman Awal - Rp 225.000 per Halaman',
                  'price': 675000
                },
                {
                  'text': 'Tambah 5 Halaman Awal - Rp 200.000 per Halaman',
                  'price': 1000000
                },
                {
                  'text': 'Tambah 10 Halaman Awal - Rp 150.000 per Halaman',
                  'price': 1500000
                },
              ]
            },
            {
              'accept_custom': true,
              'type': 'multi-checkbox',
              'question': 'Apakah ada Plugin & Widgets yang ingin Anda tambahkan?',
              'answers': [
                {
                  'text': 'Tidak perlu tambah plugin.'
                },
                {
                  'text': 'Click to Chat WhatsApp',
                  'price': 100000
                },
                {
                  'text': 'GTranslate untuk penerjemah otomatis pada website Anda',
                  'price': 30000
                },
                {
                  'text': 'Live Chat via Tawk.to',
                  'price': 30000
                },
                {
                  'text': 'Buttonizer',
                  'price': 30000
                },
                {
                  'text': 'WP Mail SMTP',
                  'price': 75000
                },
                {
                  'text': 'Halaman Coming Soon',
                  'price': 30000
                },
              ]
            },
          ] 
        },
        {
          'id': '91',
          'questions': [
            {
            'accept_custom': false,
            'type': 'multi-radio',
            'question': 'Apakah Anda ingin mengupgrade hosting Anda?',
            'answers': [
              {
                'text': 'Tidak, gunakan yang standar saja.'
              },
              {
                'text': 'Upgrade ke Paket Personal',
                'price': 250000,
              },
              {
                'text': 'Update ke Paket Bisnis',
                'price': 500000,
              },
              {
                'text': 'Upgrade ke Paket Cloud Hosting Bisnis',
                'price': 2500000
              },
              {
                'text': 'Gunakan hosting saya sendiri (Pastikan Anda sudah punya hosting sendiri untuk opsi ini)'
              }
            ]
            },
            {
            'accept_custom': true,
            'type': 'multi-radio',
            'question': 'Apakah Anda ingin menambahkan kesempatan revisi untuk website Anda?',
            'answers': [
              {
                'text': 'Tidak, gunakan kesempatan sekali revisi saja.'
              },
              {
                'text': 'Tambah 1 kali revisi - Total 2 Kali Revisi',
                'price': 300000
              },
              {
                'text': 'Tambah 2 kali revisi - Total 3 Kali Revisi',
                'price': 600000
              },
              {
                'text': 'Tambah 3 kali revisi - Total 4 Kali Revisi',
                'price': 900000
              },
            ]
            },
            {
            'accept_custom': true,
            'type': 'multi-radio',
            'question': 'Apakah Anda ingin menambahkan jumlah halaman awal pada website Anda?',
            'answers': [
              {
                'text': 'Tidak, cukup dengan jatah halaman awal saat ini saja'
              },
              {
                'text': 'Tambah 1 Halaman Awal - Rp 250.000 per Halaman',
                'price': 250000
              },
              {
                'text': 'Tambah 3 Halaman Awal - Rp 225.000 per Halaman',
                'price': 675000
              },
              {
                'text': 'Tambah 5 Halaman Awal - Rp 200.000 per Halaman',
                'price': 1000000
              },
              {
                'text': 'Tambah 10 Halaman Awal - Rp 150.000 per Halaman',
                'price': 1500000
              },
            ]
            },
            {
            'accept_custom': true,
            'type': 'multi-checkbox',
            'question': 'Apakah ada Plugin & Widgets yang ingin Anda tambahkan?',
            'answers': [
              {
                'text': 'Tidak perlu tambah plugin.'
              },
              {
                'text': 'Click to Chat WhatsApp',
                'price': 100000
              },
              {
                'text': 'Live Chat via Tawk.to',
                'price': 30000
              },
              {
                'text': 'GTranslate penerjemah otomatis di website Anda ',
                'price': 30000
              },
              {
                'text': 'Plugin untuk Ongkos Kirim dengan Ongkoskirim.id',
                'price': 25000
              },
              {
                'text': 'Pengecekan Resi dari Cekresi.com',
                'price': 30000
              },
              {
                'text': 'Setup Plugin Harga Grosir',
                'price': 110000
              },
              {
                'text': 'Buttonizer',
                'price': 30000
              },
              {
                'text': 'WP Mail SMTP',
                'price': 75000
              },
              {
                'text': 'Halaman Coming Soon',
                'price': 30000
              },
              {
                'text': 'Member Area dengan plugin Qode Membership',
                'price': 100000
              },
            ]
            },
            {
            'accept_custom': false,
            'type': 'multi-radio',
            'question': 'Saat ini Anda memilki jatah untuk setup 5 produk yang akan ditampilkan pada website Anda. Namun apakah Anda ingin menambahkan setup produk lagi?',
            'answers': [
              {
                'text': 'Ya, bantu saya untuk setup beberapa produk lagi',
                'price': 20000,
                'unit': 'Produk'
              },
              {
                'text': 'Tidak perlu'
              }
            ]
            }
          ]
        },
        {
          'id': '92',
          'questions': [
            {
              'accept_custom': false,
              'type': 'multi-radio',
              'question': 'Apa hosting yang ingin Anda gunakan?',
              'answers': [
                {
                  'text': 'Paket Bayi Niagahoster',
                  'price': 300000
                },
                {
                  'text': 'Paket Pelajar Niagahoster',
                  'price': 600000
                },
                {
                  'text': 'Paket Personal Niagahoster',
                  'price': 700000
                },
                {
                  'text': 'Paket Bisnis Niagahoster',
                  'price': 1100000
                },
                {
                  'text': 'Saya sudah memiliki paket Hosting di Niagahoster'
                },
              ]
            },
            {
              'accept_custom': true,
              'type': 'multi-radio',
              'question': 'Apakah Anda ingin menambahkan kesempatan revisi untuk website Anda?',
              'answers': [
                {
                  'text': 'Tidak, gunakan kesempatan sekali revisi saja.'
                },
                {
                  'text': 'Tambah 1 kali revisi - Total 2 Kali Revisi',
                  'price': 300000
                },
                {
                  'text': 'Tambah 2 kali revisi - Total 3 Kali Revisi',
                  'price': 600000
                },
                {
                  'text': 'Tambah 3 kali revisi - Total 4 Kali Revisi',
                  'price': 900000
                },
              ]
            },
            {
              'accept_custom': true,
              'type': 'multi-radio',
              'question': 'Apakah Anda ingin menambahkan jumlah halaman awal pada website Anda?',
              'answers': [
                {
                  'text': 'Tidak, cukup dengan jatah halaman awal saat ini saja'
                },
                {
                  'text': 'Tambah 1 Halaman Awal - Rp 250.000 per Halaman',
                  'price': 250000
                },
                {
                  'text': 'Tambah 3 Halaman Awal - Rp 225.000 per Halaman',
                  'price': 675000
                },
                {
                  'text': 'Tambah 5 Halaman Awal - Rp 200.000 per Halaman',
                  'price': 1000000
                },
                {
                  'text': 'Tambah 10 Halaman Awal - Rp 150.000 per Halaman',
                  'price': 1500000
                },
              ]
            },
            {
              'accept_custom': true,
              'type': 'multi-checkbox',
              'question': 'Plugin & Widgets yang ingin Anda tambahkan',
              'answers': [
                {
                  'text': 'Tidak perlu tambah plugin.'
                },
                {
                  'text': 'Click to Chat WhatsApp',
                  'price': 100000
                },
                {
                  'text': 'GTranslate untuk penerjemah otomatis pada website Anda',
                  'price': 30000
                },
                {
                  'text': 'Live Chat via Tawk.to',
                  'price': 30000
                },
                {
                  'text': 'Buttonizer',
                  'price': 30000
                },
                {
                  'text': 'WP Mail SMTP',
                  'price': 75000
                },
                {
                  'text': 'Halaman Coming Soon',
                  'price': 30000
                },
              ]
            },
          ]
        }
      ],
      totalPrice: 0,
    }
  },
  computed: {
  },
  filters: {
    formatPrice(value) {
      return CommonMethods.formatPrice(value)
    }
  },
  methods: {
    addToAdditionals(group, value, replaceGroup = false) {
      if (replaceGroup) {
        this.additionals[group] = [value];
        this.order_questions[this.package_id][group].answer = [value];
      } else {
        this.order_questions[this.package_id][group].answer = this.order_questions[this.package_id][group].answer.filter(selected => selected !== 'Tidak perlu tambah plugin.');
        if (! this.additionals[group]) {
          this.additionals[group] = [];
        }
        this.additionals[group].push(value);
      }
      this.calculateTotal();
      this.$forceUpdate();
      this.$emit('update-cart', this.additionals);
    },
    calculateTotal() {
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
    },
    allFieldValid() {
      let isValid = true;
      let fields = {
        '1': ['business_field', 'first_time', 'sld', 'tld'],
        '3': ['name', 'email', 'phone', 'contact_by', 'comment_question']
      };
      if (this.questionStep == 1 || this.questionStep == 3) {
        let model = this.order_model;
        fields[this.questionStep].some(function(field) {
          if (model[field] == '') {
            isValid = false;
            return false;
          }
        });
      } else {
        this.order_questions[this.package_id].some(function(question) {
          if (typeof question.answer === 'string' || question.answer instanceof String) {
            if (question.answer == '' || (question.answer == 'custom' && question.other == '')) {
              isValid = false;
              return false;
            }
          } else if (question.answer instanceof Array) {
            if (question.answer.length == 0) {
              // Validate if checkbox is selected
              isValid = false;
              return false;
            } else {
              let tempOther = question.other;
              // Look for value 'custom'. 
              // If there is value 'custom' and 'other' var is empty, mark as invalid.
              question.answer.some(function(value) {
                if (value == 'custom' && tempOther == '') {
                  isValid = false;
                  return false;
                }
              });
            }
          }
        });
      }

      // Prevent Showing Double Alert Popup
      if (!isValid) {
        alert('Mohon periksa kembali data Anda');
      }
      return isValid;
    },
    recalculateProgress() {
      window.scrollTo(0, 0);
      this.progressPercentage = Math.ceil(this.questionStep / 3 * 100);
    },
    previous() {
      this.questionStep = this.questionStep - 1;
      this.recalculateProgress();
      this.$emit('update-step', this.questionStep);
    },
    next() {
      if (this.allFieldValid()) {
        this.questionStep = this.questionStep + 1;
        this.recalculateProgress();
        this.$emit('update-step', this.questionStep);
      }
    },
    submit() {
      if (this.allFieldValid()) {
        Gtm.trackingClickCTA(this.checkout_gtm_name, this.checkout_gtm_tag);
        this.$emit('show-spinner', true);
        this.order_questions[this.package_id].forEach(function(q) {
          if (q.answer instanceof String || typeof q.answer === 'string') {
            if (q.answer == 'custom') {
              q.answer = q.other;
            }
          } else if (q.answer instanceof Array) {
            let temp = q.answer;
            let tempCustom = q.other;
            q.answer.some(function(option, indexVal) {
              if (option == 'custom') {
                temp[indexVal] = tempCustom;
                return; // break
              }
            });
            q.answer = temp;
          }
        });
        axios.post('/api/v2/difm_order/submit', {
          'difm-estimate': this.totalPrice,
          'difm-product-id': this.package_id,
          'difm-business-field-p1': this.order_model.business_field,
          'difm-first-time-p1': this.order_model.first_time,
          'difm-sld-p1': this.order_model.sld,
          'difm-tld-p1': this.order_model.tld,
          'difm-reference-p1': this.order_model.reference,
          'difm-name-p3': this.order_model.name,
          'difm-email-p3': this.order_model.email,
          'difm-phone-p3': this.order_model.phone,
          'difm-contact-by-p3': this.order_model.contact_by,
          'difm-comment-question-p3': this.order_model.comment_question,
          'order_questions': this.order_questions,
        }).then((response) => {
          if (response.data.success) {
            window.location.href = "/order/jasa-pembuatan-website/thank-you";
          }
        }).catch((error) => {
          this.$emit('show-spinner', false);
          if (error.response.data.error.message) {
            alert(error.response.data.error.message);
          } else {
            alert('Mohon periksa kembali data Anda');
          }
        });
      }
    }
  },
  mounted: function() {
    this.progressPercentage = Math.ceil(this.questionStep / 3 * 100);
    let questions = {};
    let tempPackageId = this.package_id;
    this.questionSet.forEach(function (questionSet) {
      if (questionSet.id == tempPackageId) {
        questions[tempPackageId] = [];
        questionSet.questions.forEach(function(questionObject, index) {
          questions[tempPackageId][index] = {
            'question': questionObject.question,
            'answer': questionObject.type == 'multi-checkbox' ? [] : '',
            'other': ''
          };
        });
      }
    });
    this.order_questions = questions;
    this.calculateTotal();
  },
  created() {
    
  },
}
</script>