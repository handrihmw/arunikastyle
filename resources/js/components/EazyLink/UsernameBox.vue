<template>
  <div class="hosting-package mt-lg-0 mt-5">
    <div>
      Username Niagahoster EazyLink
    </div>
    <div class="mt-5">
      <div class="input-group la-inner-addon la-inner-addon__right">
        <div class="input-group-addon" id="basic-addon1">
          <i class="niaga-icon icon-ic-link position-absolute font-size-20 mt-n1"></i>
          <span class="ml-5">nh.co.id/</span>
        </div>
        <input type="text" class="form-control" ref="inputUsername" placeholder="username" aria-describedby="basic-addon1" v-model="username" @input="resetInfo" :readonly="readOnlyUsername">
        <i v-if="usernameChecked && canSetUsername" class="icon niaga-icon icon-ic-check text-success font-size-18"></i>
        <span v-if="usernameChecked && !canSetUsername" class="icon fa fa-times-circle text-danger"></span>
      </div>
    </div>
    <div class="mt-4">
      <span :class="info.classes">
        • {{ info.message }}
      </span>
      <div v-if="!info.classes">
        • Username yang sudah Anda dipilih, tidak dapat diubah kembali.
      </div>
    </div>
    <div class="mt-5">
      <button v-if="has_order && showJumpToDashboard" class="rounded-pill la-btn la-btn__orange" @click="jumpDashboard">
        Ke Dashboard
      </button>
      <button v-else-if="!canSetUsername" :class="`rounded-pill la-btn-outline ${canCheckUsername ? 'la-btn-outline__orange' : 'disabled'}`" :disabled="!canCheckUsername" @click="checkUsername">
        Cek Username
      </button>
      <div v-else>
          <button class="rounded-pill la-btn la-btn__orange" @click="saveUsername">Lanjutkan</button>
          <button class="rounded-pill la-btn-outline la-btn-outline__orange" @click="changeUsername">Ubah Username</button>
      </div>
    </div>
  </div>
</template>

<script>
import CommonMethods from '../../CommonMethods';
export default {
  name: "UsernameBox",
  props: ['id', 'brand', 'has_order'],
  emits: ['show-spinner'],
  data: () => {
    return {
        info: {
            classes: null,
            message: null
        },
        username: '',
        readOnlyUsername: false,
        canCheckUsername: false,
        canSetUsername: false,
        usernameChecked: false,
        showJumpToDashboard: false
    }
  },
  mounted() {
    this.username = this.brand;
    this.checkLogin();
    this.resetInfo();
    this.inputValidation();
  },
  methods: {
    inputValidation() {
      this.$refs.inputUsername.addEventListener('keydown', e => {
        if(e.key == 'Enter' && this.canCheckUsername){
          this.checkUsername();
          this.$refs.inputUsername.blur();
        }
        if(!e.key.match(/(^([a-zA-Z0-9\-]+)?$)/u)) {
          e.preventDefault();
          this.username = this.username.trim().replace('.', '');
        }
      });
    },
    checkLogin() {
      window.addEventListener('message', (msg) => {
        if (msg.data.task == 'not_login') {
          window.location.href = CommonVar.bb_url + '/login?next=' + window.location.href;
        }
      });
    },
    resetInfo() {
      this.info = {
        classes: '',
        message: 'Username ini akan menjadi nama link yang dapat diakses oleh calon customer Anda.'
      }
      this.canCheckUsername = !!(this.username && !this.username.trim().includes(' '));
      this.usernameChecked = false;
    },
    checkUsername() {
      this.$emit('show-spinner', true);
      axios.post('/api/v2/eazylink/check', {
        username: this.username
      }).then(response => {
        if (response.data.is_valid) {
          this.setUsernameError(false);
        } else {
          this.setUsernameError(true);
        }
      }).catch((err) => {
        this.setUsernameError(true);
        if (err.response.data.error) {
          this.info.message = err.response.data.error
          if (this.has_order == 'true') {
            this.showJumpToDashboard = true
          }
        }
      });
    },
    setUsernameError(status = true) {
      this.$emit('show-spinner', false);
      this.usernameChecked = true;
      if (status) {
        this.info.classes = 'text-danger';
        this.info.message = 'Mohon maaf, username tidak tersedia. Silahkan coba kombinasi lain.';
        this.canCheckUsername = false;
        this.canSetUsername = false;
        this.readOnlyUsername = false;
      } else {
        this.info.classes = 'text-success';
        this.info.message = 'Username tersedia';
        this.canSetUsername = true;
        this.readOnlyUsername = true;
      }
    },
    changeUsername() {
      this.resetInfo();
      this.canSetUsername = false;
      this.readOnlyUsername = false;
      this.$refs.inputUsername.focus();
    },
    saveUsername() {
      this.$emit('show-spinner', true);
      axios.post('/api/guest/add_to_cart', {
        item: {
          id: this.id,
          username: this.username
        }
      }).then(response => {
        if (!response.data.error) {
          this.checkout();
        } else {
          this.$emit('show-spinner', false);
        }
      }).catch(error => {
        this.$emit('show-spinner', false);
      });
    },
    checkout() {
      axios.post('/api/guest/front_checkout', {
          order_flow: 'new_link_aggregator',
          '_ga': CommonMethods.getCookie('_ga'),

      }).then(response => {
        if (!response.data.error) {
          window.location.href = '/order/eazylink/thank-you'
        } else {
          this.$emit('show-spinner', false);
        }
      }).catch(error => {
        this.$emit('show-spinner', false);
      });
    },
    jumpDashboard() {
      window.location.href = CommonVar.bb_url + '/eazylink/login'
    }
  }
}
</script>