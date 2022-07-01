<template>
    <div v-if="images" class="kvm-images" :class="{'select--disabled': tmp_cart.items.length}">
        <h3 class="kvm-images__title text-capitalize">pilih sistem operasi anda: </h3>
        <div class="select-images">
            <div ref="select-image" class="select-images__item" :class="{'select-images--show-option':show_options}" @click="show_options = !show_options">
                <div>
                    <strong>{{ image.name }}</strong>
                </div>
                <span v-if="(os_type == 'windows')" class="select-images__badge--new pull-right">New</span>
            </div>
            <transition>
                <div class="select-images__wrapper" :class="{'select-images__wrapper--long': (os_type != 'windows')}" v-if="show_options">
                    <ul class="select-images__option"
                        v-closable="{exclude: ['select-image'], handler: 'onClose'}">
                        <li v-for="(image, index) in kvm_images" :key="index" @click="chooseImage(index, image)">
                            <strong>{{ image }}</strong><span v-if="(os_type == 'windows')" class="select-images__badge--new">New</span>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
        <div class="kvm-images__button mt-4">
            <a href="javascript:void(0)" @click="setImage()" class="button-default button-white-orange">Tambahkan ke Cart</a>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'selectImages',
    props: ['kvm_images', 'tmp_cart'],
    data: function() {
      return {
        show_options: false,
        os_type: 'linux',
        image: {
          id: '',
          name: '',
        }
      }
    },
    computed: {
      images() {
        return Object.keys(this.kvm_images).length > 0;
      }
    },
    methods: {
      listImages() {
        if (this.images) {
          const imageKeys = Object.keys(this.kvm_images);
          if (this.kvm_images[imageKeys[0]].toLowerCase().includes('windows')) {
            this.os_type = 'windows';
          }
          return imageKeys.forEach(key => {
            if (this.kvm_images[key].toLowerCase().includes('alibaba')) {
              delete this.kvm_images[key];
            }
          });
        }
      },
      chooseImage(id, name) {
        this.image.id = id;
        this.image.name = name
        this.show_options = false;
        sessionStorage.setItem('selected_kvm_image_id', id);
      },
      setImage() {
        bus.$emit('set-kvm-image', this.image.id);
        bus.$emit('virtual-page-view', 'image-selection');
        Gtm.trackingClickCTA('Click CTA', 'add_to_cart_clicked');
      },
      onClose() {
        this.show_options = false;
      },
      init() {
        for (const [key, value] of Object.entries(this.kvm_images)) {
          this.chooseImage(key, value);
          return;
        }
      },
    },
    mounted() {
      this.init();
      this.listImages();
      setTimeout(() => {
        bus.$on('refresh-selected-image', (id, name) => {
          this.chooseImage(id, name);
        });
      }, 100);
    }
  }
</script>