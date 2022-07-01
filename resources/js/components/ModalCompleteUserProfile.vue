<template>
  <div 
    class="profile-modal modal fade" 
    id="modalCompleteUserProfile" 
    tabindex="-1" 
    aria-labelledby="modalSignuppLabel"
    aria-hidden="true">
    <div class="modal-dialog profile-modal__dialog">
      <button type="button" ref="modalCompleteUserProfileClose" class="close hide" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="modal-content profile-modal__content">
        <h5 class="profile-modal__title" id="modalSignuppLabel">Lengkapi Data Anda</h5>
        <p class="profile-modal__subtitle">Silahkan lengkapi data anda untuk menyelesaikan proses checkout</p>
        <form class="profile-modal__form" @submit.prevent="save">
          <div v-if="use_hdomains">
            <div v-for="(item, index) in requirements.whois_details" :key="item.id">
              <div class="form-group profile-modal__form-group" v-if="item.slug != 'country_code' && item.slug != 'email'" >
                <label class="profile-modal__form-label" :for="item.slug">{{item.title}}</label>
                <select v-if="item.type == 'select'" 
                  :id="item.slug"
                  class="form-control profile-modal__form-control"
                  :name="item.slug"
                  :value="getField(item.slug)"
                  @input="updateField"
                >
                  <div slot="no-options">Opsi tidak tersedia</div>
                  <option v-for="(option, index) in item.possible_values" 
                    :value="index" 
                    :key="option.id"
                    :selected="index == getField(item.slug)"
                  >{{option}}</option>
                </select>
                <input v-if="item.type == 'input'"
                  :type="item.type"
                  class="form-control profile-modal__form-control"
                  :name="item.slug"
                  :id="item.slug"
                  :placeholder="item.example"
                  :value="getField(item.slug)"
                  @input="updateField"
                >
                <p class="text-danger mb-4 p-0" v-if="(!isValidField(getField(item.slug), item.regular_expression) && item.type == 'input') || getError(item.slug)">
                  {{ validationMessage(requirements.whois_details[index].constraints) }}
                </p>
              </div>
            </div>

            <div v-for="(item, index) in tld_fields" :key="item.id">
              <div class="form-group profile-modal__form-group">
                <label class="profile-modal__form-label" :for="item.field_constraint.slug">{{item.field_constraint.title}}</label>
                <select v-if="item.field_constraint.type == 'select'" 
                  :id="item.field_constraint.slug"
                  class="form-control profile-modal__form-control"
                  :name="item.field_constraint.slug"
                  :value="item.field_value"
                  @input="updateTldField(index)"
                >
                  <div slot="no-options">Opsi tidak tersedia</div>
                  <option v-for="(option, index) in item.field_constraint.possible_values" 
                    :value="index" 
                    :key="option.id"
                    :selected="index == (item.field_value || 1)"
                  >{{option}}</option>
                </select>
                <input v-if="item.field_constraint.type == 'input'"
                  :type="item.field_constraint.type"
                  class="form-control profile-modal__form-control"
                  :name="item.field_constraint.slug"
                  :id="item.field_constraint.slug"
                  :placeholder="item.field_constraint.example"
                  :value="item.field_value"
                  @input="updateTldField(index)"
                >
                <p class="text-danger mb-4 p-0" v-if="!isValidField(item.field_value, item.field_constraint.regular_expression)">
                  {{ validationMessage(requirements.tld_details[index].constraints) }}
                </p>
              </div>
            </div>

            <div v-for="(item, index) in domain_fields" :key="item.id">
              <div class="form-group profile-modal__form-group">
                <label class="profile-modal__form-label" :for="item.field_constraint.slug">{{item.field_constraint.title}}</label>
                <select v-if="item.field_constraint.type == 'select'" 
                  :id="item.field_constraint.slug"
                  class="form-control profile-modal__form-control"
                  :name="item.field_constraint.slug"
                  :value="item.field_value"
                  @input="updateDomainFields(index)"
                >
                  <div slot="no-options">Opsi tidak tersedia</div>
                  <option v-for="(option, index) in item.field_constraint.possible_values" 
                    :value="index" 
                    :key="option.id"
                    :selected="index == (item.field_value || 1)"
                  >{{option}}</option>
                </select>
                <input v-if="item.field_constraint.type == 'input'"
                  :type="item.field_constraint.type"
                  class="form-control profile-modal__form-control"
                  :name="item.field_constraint.slug"
                  :id="item.field_constraint.slug"
                  :placeholder="item.field_constraint.example"
                  :value="item.field_value"
                  @input="updateDomainFields(index)"
                >
                <p class="text-danger mb-4 p-0" v-if="!isValidField(item.field_value, item.field_constraint.regular_expression)">
                  {{ validationMessage(requirements.domain_requirements[index].constraints) }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="!use_hdomains">
            <div class="form-group profile-modal__form-group">
              <label class="profile-modal__form-label" for="company">Nama Perusahaan</label>
              <input 
                type="text" 
                class="form-control profile-modal__form-control" 
                v-model="company"
                :class="{'profile-modal__form-control--error': err.company}"
                name="company" 
                id="company" 
                placeholder="Nama Perusahaan"
              >
              <p class="text-danger mb-4 p-0" v-if="err.company">Nama perusahaan tidak boleh kosong</p>
            </div>
            <div class="form-group profile-modal__form-group">
              <label class="profile-modal__form-label" for="address_1">Alamat</label>
              <input 
                type="text" 
                class="form-control profile-modal__form-control" 
                name="address_1"
                v-model="address_1"
                :class="{'profile-modal__form-control--error': err.address_1}"
                id="address_1" 
                placeholder="Masukkan Jalan atau Gang, RT atau RW"
                maxlength="50"
              >
              <div id="address-1-help" class="form-text">
                <span class="mb-4 p-0" :class="{'text-danger' : (validation.address_1.valid === false), 'text-success': validation.address_1.valid}">{{ validation.address_1.message }}</span>
                <div id="address-1-help-counter" class="pull-right text-reset">{{ address_1.length }}/50</div>
              </div>
            </div>
            <div class="form-group profile-modal__form-group">
              <label class="profile-modal__form-label" for="city">Kota</label>
              <input 
                type="text" 
                class="form-control profile-modal__form-control" 
                v-model="city"
                :class="{'profile-modal__form-control--error': err.city}"
                name="city" 
                id="city" 
                placeholder="Masukan Kota Anda"
              >
              <p class="text-danger mb-4 p-0" v-if="err.city">Nama kota tidak boleh kosong</p>
            </div>
            <div class="form-group profile-modal__form-group">
              <label class="profile-modal__form-label" for="postcode">Kode Pos</label>
              <input 
                type="text" 
                class="form-control profile-modal__form-control" 
                v-model="postcode"
                :class="{'profile-modal__form-control--error': err.postcode}"
                name="postcode" 
                id="postcode" 
                placeholder="Kode Pos"
              >
              <p class="text-danger mb-4 p-0" v-if="err.postcode">Kode Pos tidak boleh kosong</p>
            </div>
            <div class="form-group profile-modal__form-group">
              <label class="profile-modal__form-label" for="state">Provinsi</label>
              <v-select
              :options="list_state"
              :clearable="false"
              v-model="state"
              class="form-control profile-modal__form-control"
              :class="{'profile-modal__form-control--error': err.state}" placeholder="Pilih Provinsi"
              id="state"
              >
                <div slot="no-options">Provinsi tidak tersedia</div>
              </v-select>
              <p class="text-danger mb-4 p-0" v-if="err.state">Provinsi tidak boleh kosong</p>
            </div>
            <div class="form-group profile-modal__form-group">
              <label class="profile-modal__form-label" for="phone">Telepon / No. HP</label>
              <input 
                type="text" 
                class="form-control profile-modal__form-control" 
                v-model="phone"
                :class="{'profile-modal__form-control--error': err.phone}"
                name="phone" 
                id="phone" 
                placeholder="Telepon / No. HP"
              >
              <p class="text-danger mb-4 p-0" v-if="err.phone">Telepon / No. HP tidak boleh kosong</p>
            </div>
          </div>
          <button 
            class="profile-modal__button profile-modal__button--save"
            :class="{'profile-modal__button--disabled' : loading}"
            type="submit"
            :disabled="loading">
              <span v-if="loading">Menyimpan Data Anda</span>
              <span v-else>Selesai</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ModalCompleteUserProfile",
    props: ['list_state'],
    data: function() {
      return {
        loading: false,
        use_hdomains: false,
        first_name: '',
        last_name: '',
        postcode: '',
        address_1: '',
        city: '',
        company: '',
        phone: '',
        phone_cc: '',
        state: '',
        empty_fields: [],
        requirements: [],
        tld_fields: [],
        domain_fields: [],
        err: {
          first_name: false,
          last_name: false,
          phone_cc: false,
          postcode: false,
          address_1: false,
          city: false,
          company: false,
          phone: false,
          state: false,
        },
        validation: {
          address_1: {
            valid: null,
            message: 'Maksimal 50 karakter',
            message_default: "Maksimal 50 karakter",
            message_success: "Alamat sudah valid",
            regexps: [
              {
                regexp: new RegExp(/^.{2,50}$/u),
                message_error: "Alamat harus memiliki maksimal 50 karakter dengan minimal 1 angka dan 1 huruf"
              },
              {
                regexp: new RegExp(/^(?=.*?[0-9])(?=.*?[^0-9 ]).{2,50}$/u),
                message_error: "Alamat harus memiliki minimal 1 angka dan 1 huruf"
              },
              {
                regexp: new RegExp(/^(?=.*?[0-9])(?=.*?[^0-9 ])(?!.*?[<>~°º!@#$%^&*+_=()|\\\/'"\]\[\{\}]).{2,50}$/u),
                message_error: `Alamat tidak dapat memiliki karakter khusus berikut <>~°º!@#$%^&*+_=()|\/'"[]{}`
              }
            ]
          }
        },
        constraintsReq: [
          { keyword: 'First name', message: 'Karakter pada nama depan tidak valid.' },
          { keyword: 'Last name', message: 'Karakter pada nama belakang tidak valid.' },
          { keyword: 'e-mail address', message: 'E-mail tidak valid.' },
          { keyword: 'Company name', message: 'Karakter pada nama perusahaan tidak valid.' },
          { keyword: 'At least one number and one letter and no special characters', message: 'KAlamat harus memiliki maksimal 50 karakter dengan minimal terdapat 1 angka dan 1 huruf, serta tidak memiliki karakter khusus.' },
          { keyword: 'City', message: 'Karakter pada nama kota tidak valid.' },
          { keyword: 'Country', message: 'Pilih salah satu dari negara yang ada.' },
          { keyword: 'Phone number country code', message: 'Kode nomor telepon tidak valid.' },
          { keyword: 'numeric phone number', message: 'Nomor telepon tidak valid.' },
          { keyword: 'region', message: 'Provinsi tidak valid.' },
          { keyword: 'Postal Code', message: 'Koda Pos harus 5 angka.' },
          { keyword: 'Valid category', message: 'Pilih salah satu dari kategori yang ada.' },
        ],
      }
    },
    mounted: function() {
      this.$root.$on('set-user-profile-modal', fields => {
        this.use_hdomains = fields.use_hdomains;
        this.empty_fields = fields.empty_fields;
        this.requirements = fields.requirements;
        this.first_name = fields.first_name || '';
        this.last_name = fields.last_name || '';
        this.postcode = fields.postcode || '';
        this.phone_cc = fields.phone_cc || '';
        this.address_1 = fields.address_1 || '';
        this.city = fields.city || '';
        this.company = fields.company || '';
        this.phone = fields.phone || '';
        this.state = fields.state || '';

        if (this.requirements) {
          this.requirements.tld_details.forEach((value) => {
            this.tld_fields.push({
              field_constraint: value,
              field_value: ''
            });
          });
          this.requirements.domain_requirements.forEach((value) => {
            this.domain_fields.push({
              field_constraint: value,
              field_value: ''
            });
          })
        }
      });
    },
    watch: {
      address_1(value) {
        this.address_1 = value;
        this.validate(value, 'address_1');
      },
      city(value) {
        this.city = value;
        this.notEmpty(value, 'city');
      },
      postcode(value) {
        this.postcode = value;
        this.notEmpty(value, 'postcode');
      },
      phone(value) {
        this.phone = value;
        this.notEmpty(value, 'phone');
      },
      state(value) {
        this.state = value;
        this.notEmpty(value, 'state');
      },
    },
    methods: {
      updateField(event) {
        let attribute = event.target.getAttribute('name');
        this[this.convertSlug(attribute)] = event.target.value;
        this.empty_fields[this.convertSlug(attribute)] = null;
      },
      updateTldField(index) {
        this.tld_fields[index].field_value = event.target.value;
      },
      updateDomainFields(index) {
        this.domain_fields[index].field_value = event.target.value;
      },
      getField(slug) {
        switch (slug) {
          case 'address':
            return this.address_1;
          case 'phone_number':
            return this.phone;  
          case 'zip_id':
            return this.postcode;
          case 'state_id':
            return this.state;
          case 'company_name':
            return this.company;
          default:
            return this[slug];
        }
      },
      convertSlug(slug) {
        switch (slug) {
          case 'address':
            return 'address_1';
          case 'phone_number':
            return 'phone';
          case 'zip_id':
            return 'postcode';
          case 'state_id':
            return 'state';
          case 'company_name':
            return 'company';
          default:
            return slug;
        }
      },
      getError(slug) {
        return this.empty_fields[this.convertSlug(slug)];
      },
      isValidField(value, regular_expression) {
        let regEx = regular_expression;
        regEx = new RegExp(regEx.replaceAll(/^\/|\/[a-z]$|\/$/g, ''));
        if (regEx.test(value)) {
          return true;
        }
        return false;
      },
      notEmpty(value, field) {
        this.err[field] = false;
        if(value === "") {
          this.err[field] = true;
        }
      },
      validate(value, field) {
        this.validation[field].valid   = null;
        this.validation[field].message = this.validation[field].message_default;

        this.validation[field].regexps.every((rg) => {
            if (! value.match(rg.regexp)) {
                this.validation[field].valid   = false;
                this.validation[field].message = rg.message_error;
                this.err[field]                = true;
                return false;
            }
            this.validation[field].valid   = true;
            this.validation[field].message = this.validation[field].message_success;
            this.err[field]                = false;
            return true;
        });
      },
      validationMessage(msg) {
        for (let constraint of this.constraintsReq) {
          if (msg.toLowerCase().includes(constraint.keyword.toLowerCase())) {
            return constraint.message;
          }
        }
        return msg;
      },
      save(e) {
        if (! this.use_hdomains) {
          if (! this.postcode) {
            this.err.postcode = true;
          }
          if (! this.address_1) {
            this.err.address_1 = true;
          }
          if (! this.city) {
            this.err.city = true;
          }
          if (! this.phone) {
            this.err.phone = true;
          }
          if (! this.state) {
            this.err.state = true;
          }

          const hasError = Object.keys(this.err).filter(key => this.err[key] === true);
        
          if (hasError.length > 0) {
            return false;
          }
        } else {
          let isValidationFail = false;
          this.requirements.whois_details.forEach((requirement) => {
            if (
              requirement.slug != 'country_code' &&
              requirement.slug != 'email' &&
              ! this.isValidField(this[this.convertSlug(requirement.slug)], requirement.regular_expression)
            ) {
              isValidationFail = true;
            }
          });
          this.tld_fields.forEach((field) => {
            if (! this.isValidField(field.field_value, field.field_constraint.regular_expression)) {
              isValidationFail = true;
            }
          });
          this.domain_fields.forEach((field) => {
            if (! this.isValidField(field.field_value, field.field_constraint.regular_expression)) {
              isValidationFail = true;
            }
          });
          if (isValidationFail) {
            alert('Mohon periksa kembali data diri Anda');
            return false;
          }
        }

        this.loading = true;
        
        axios.post("/api/guest/complete-user", {
          use_hdomains: this.use_hdomains,
          tld_fields: this.tld_fields,
          domain_fields: this.domain_fields,
          first_name: this.first_name,
          last_name: this.last_name,
          postcode: this.postcode,
          phone_cc: this.phone_cc,
          postcode: this.postcode,
          address_1: this.address_1,
          city: this.city,
          company: this.company,
          phone: this.phone,
          state: this.state,
        }).then(res => {
          const data = JSON.parse(JSON.stringify(res));
          const result = data.data.result;
          if (result.status === 'failed') {
            alert(result.message);
            this.loading = false;
            return false;
          }
          this.loading = false;
          this.$refs.modalCompleteUserProfileClose.click()
          this.$emit("checkout-now", true, false);
        });
      }
    }
  }
</script>