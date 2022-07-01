<template>
  <transition name="fade" mode="out-in">
    <div class="orderflow-toast" v-if="showed">
        <p>
          {{ message }}
        </p>
        <button class="btn btn-link" @click="hideToast(true)">{{ actionButton.title }}</button>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Toast',
    data() {
      return {
        default: {
          message: 'Domain Anda berhasil ditambahkan ke Cart',
          actionTitle: 'Batalkan',
          autoHide: 5000
        },
        message: 'Domain Anda berhasil ditambahkan ke Cart',
        actionButton: {
          title: 'Batalkan',
          callbackFn: null
        },
        actionTitle: 'Batalkan',
        actionCallback: null,
        showed: false
      }
    },
    methods: {
      showToast: function (message, actionTitle, actionCallback, autoHide) {
        let hideTimeout         = (autoHide || this.default.autoHide);
        this.message            = (message || this.default.message);
        this.actionButton.title = (actionTitle || this.default.actionTitle);

        if (typeof actionCallback == 'function') {
          this.actionButton.callbackFn = actionCallback;
        }
        this.showed = true;

        if (autoHide > 0) {
          setTimeout(() => {
            this.hideToast();
          }, hideTimeout);
        }
      },
      hideToast: function(withCallback) {
        this.showed = false;

        if (withCallback === true && (typeof this.actionButton.callbackFn == 'function')) {
          this.actionButton.callbackFn();
        }
      }
    },
    mounted() {
      setTimeout(() => {
        bus.$on('show-toast', (message, actionTitle, actionCallback, autoHide) => {
          this.showToast(message, actionTitle, actionCallback, autoHide);
        })
      }, 100);
    }
  }
</script>