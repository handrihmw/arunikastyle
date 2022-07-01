module.exports = {
    init: function (Vue) {
        Vue.component('section-summary', require('./components/SectionCart.vue'));
        Vue.component('hosting-plan', require('./components/HostingPlan.vue'));
        Vue.component('payment-method', require('./components/PaymentMethod.vue'));
        Vue.component('client-information', require('./components/ClientInformation.vue'));
        Vue.component('section-cart', require('./components/SectionCart.vue'));
        Vue.component('additional-feature', require('./components/AdditionalFeature.vue'));
        Vue.component('client-information-verisign', require('./components/ClientInformationVerisign.vue'));

        Vue.component('new-hosting-plan', require('./components/OrderFlowHosting/HostingPlan.vue'));
        Vue.component('domain-suggestion', require('./components/OrderFlowHosting/DomainSuggestion.vue'));
        Vue.component('new-payment-method', require('./components/NewPaymentMethod.vue'));
        Vue.component('new-payment-method-v2', require('./components/NewPaymentMethodV2.vue'));
        Vue.component('new-client-information', require('./components/NewClientInformation.vue'));
        Vue.component('new-additional-feature', require('./components/NewAdditionalFeature.vue'));
        Vue.component('thank-you', require('./components/OrderFlowHosting/ThankYou.vue'));
        Vue.component('summary-cart', require('./components/SummaryCart.vue'));
        Vue.component('new-section-summary', require('./components/NewSectionSummary.vue'));
        Vue.component('domain-hosting-plan', require('./components/OrderFlowDomain/HostingPlan.vue'));
    }
};
