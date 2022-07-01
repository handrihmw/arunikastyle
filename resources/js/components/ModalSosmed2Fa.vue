<template>
  <div 
    class="profile-modal modal fade" 
    id="ModalSosmed2Fa" 
    tabindex="-1" 
    role="dialog"
    aria-labelledby="modalSignuppLabel"
    aria-hidden="true">
    <div class="modal-dialog profile-modal__dialog">
      <div class="modal-content profile-modal__content">
        <h5 class="profile-modal__title" id="modalSignuppLabel">2FA Authentication</h5>
        <form class="profile-modal__form" >
          <div class="form-group profile-modal__form-group">
            <label class="profile-modal__form-label" for="code2va">Authentication Code</label>
            <input 
              type="text" 
              class="form-control profile-modal__form-control" 
              v-model="code"
              :class="{'profile-modal__form-control--error': err.status}"
              placeholder="123456"
              :disabled="loading"
            >
            <p class="text-danger mb-4 p-0" v-if="err.status">{{err.msg}}</p>
          </div>
          <button 
            class="profile-modal__button profile-modal__button--save" 
            type="button" @click="verify()" :disabled="loading">
            <span 
              v-if="loading" 
              class="profile-modal__button--loading">
              Loading...
            </span>
            <span 
              v-else >
              Verify
            </span>
            
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ModalSosmed2Fa",
    props:['hash', 'sosmedloginurl'],
    data: function() {
      return {
        loading: false,
        code:'',
        err: {
          status:false,
          msg:''
        }
      }
    },
    methods: {
      verify() {
        if ( ! this.code) {
          this.err.status = true
          this.err.msg = 'Authentication Code tidak boleh kosong'
        } else {
          this.err.status = false
          this.err.msg = ''
          
          this.loading = true
          let requestData = {
            'hash': this.hash,
            'step': 2,
            '2fa_code': this.code
          };
          axios.post('/api/guest/verify_two_fa_authentication', requestData)
          .then(res => {
            try {
              var resp = JSON.parse(res.data)
            } catch {
              var resp = res.data
            }
            
            if (! resp.result && resp.error) {
              this.err.status = true
              this.err.msg = resp.error.message
            } else {
              this.err.status = false
              this.err.msg = ''
              window.location.href = this.sosmedloginurl
            }
          })
          .catch(err => {
            if (err.data) {
                var data = JSON.parse(err.data)
                if (data.error) {
                  this.err.status = true
                  this.err.msg = data.error.message
                } else {
                  this.err.status = true
                  this.err.msg = 'Invalid/Expired login token. Please log in again.'
                }
            } else {
              this.err.status = true
              this.err.msg = 'Invalid/Expired login token. Please log in again.'
            }
          })
          this.loading = false;
        }

        
      }
    }
  }
</script>