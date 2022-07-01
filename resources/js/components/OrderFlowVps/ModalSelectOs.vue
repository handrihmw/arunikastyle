<template>
  <div 
    class="select-os fade modal"
    id="selectOs"
    tabindex="-1"
    aria-hidden="true">
      <div class="modal-dialog select-os__dialog">
        <div class="modal-content select-os__content">
          <h5 class="select-os__title text-left">Pilih Sistem Operasi Anda: </h5>
          <p></p>
          <div class="select-os__form">
            <div class="form-group select-os__form-group">
              <div ref="select-plan" @click="show_options = !show_options" :class="{'select-os__select--show': show_options}" class="select-os__select">
                <p class="select-os__select-title"><strong>{{template.name}}</strong></p>
              </div>
              <div class="select-os__wrapper" v-if="show_options">
                <ul v-closable="{exclude: ['select-plan'], handler: 'onClose'}" class="select-os__os-options">
                  <li v-for="(template, index) in os_templates" :key="index" @click="chooseTemplate(index, template)" class="text-capitalize">
                    <strong>{{template}}</strong></li>
                </ul>
              </div>
              <p v-if="show_error" class="text-danger">Silahkan pilih sistem operasi Anda</p>
              <button
                @click="setOs()"
                type="button"
                class="select-os__button select-os__button--save">
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'modalSelectOs',
  props: ['os_templates'],
  data: function() {
    return {
      show_options: false,
      show_error: false,
      template: {
        id: 0,
        name: '',
      }
    }
  },
  methods: {
    chooseTemplate(id, name) {
      this.template.id = id;
      this.template.name = name
      this.show_options = false;
    },
    setOs() {
      if (!this.template.id && !this.template.name) {
        this.show_error = true;
        return;
      }
      bus.$emit('set-os-template', this.template.id);
      bus.$emit('next-orderflow-step');
    },
    init() {
      for (const [key, value] of Object.entries(this.os_templates)) {
        if(Number(key) === 195) {
          this.chooseTemplate(Number(key), value);
          return;
        }
      }
    }
  },
  created() {
    this.init();
  }
}
</script>