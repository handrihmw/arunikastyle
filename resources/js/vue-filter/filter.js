import Vue from 'vue';
Vue.filter('link', function (slug) {
  if (!slug) {
    return CommonVar.niaga_url;
  }
  return CommonVar.niaga_url + slug;
});

Vue.filter('formatPrice', function (value) {
  if (!value) {
    return 'Rp. 0,00';
  }
  value = Math.round(value);
  value = (value / 1).toFixed(2).replace('.', ',');
  return 'Rp. ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

Vue.filter('phone_number', function (separator = '') {
  return process.env.PHONE_AREA + separator + process.env.PHONE_NUMBER;
});