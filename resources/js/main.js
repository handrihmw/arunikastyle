import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import ('./vue-filter/filter')
import ('./vendor-orderflow')

import foobar from './components/FooBar.vue'
import sectionSummary from './components/SectionSummary.vue'
import hostingPlan from './components/HostingPlan.vue'
import paymentMethod from './components/PaymentMethod.vue'
import clientInformation from './components/ClientInformation.vue'
import sectionCart from './components/SectionCart.vue'
import additionalFeature from './components/AdditionalFeature.vue'
import orderFlowDomainVerisign from './components/OrderFlowDomain/OrderFlowDomainVerisign.vue'
import customNotification from './components/CustomNotification.vue'

import newHostingPlan from './components/OrderFlowHosting/HostingPlan.vue'
import newPaymentMethod from './components/NewPaymentMethod.vue'
import newPaymentMethodV2 from './components/NewPaymentMethodV2.vue'
import newClientInformation from './components/NewClientInformation.vue'
import newAdditionalFeature from './components/NewAdditionalFeature.vue'
import domainSuggestion from './components/OrderFlowHosting/DomainSuggestion.vue'
import thankYou from './components/OrderFlowHosting/ThankYou.vue'
import summaryCart from './components/SummaryCart.vue'
import newSectionSummary from './components/NewSectionSummary.vue'
import domainHostingPlan from './components/OrderFlowDomain/HostingPlan.vue'

import websitePlan from './components/OrderFlowWebsite/WebsitePlan.vue'
import websiteDiyList from './components/OrderFlowWebsite/WebsiteDiyList.vue'
import websiteDiyListSecond from './components/OrderFlowWebsite/WebsiteDiyListSecond.vue'
import websiteDiyListThird from './components/OrderFlowWebsite/WebsiteDiyListThird.vue'
import websiteDiyListFourth from './components/OrderFlowWebsite/WebsiteDiyListFourth.vue'
import previewDiyModal from './components/OrderFlowWebsite/PreviewDiyModal.vue'
import previewDiyModalSecond from './components/OrderFlowWebsite/PreviewDiyModalSecond.vue'
import previewDiyModalThird from './components/OrderFlowWebsite/PreviewDiyModalThird.vue'
import previewDiyDemo from './components/OrderFlowWebsite/PreviewDiyDemo.vue'
import previewDiyNavigation from './components/OrderFlowWebsite/PreviewDiyNavigation.vue'
import orderDiyModal from './components/OrderFlowWebsite/OrderDiyModal.vue'
import orderDiyModalSecond from './components/OrderFlowWebsite/OrderDiyModalSecond.vue'
import filterDiyList from './components/OrderFlowWebsite/FilterDiyList.vue'
import filterDiyListSecond from './components/OrderFlowWebsite/FilterDiyListSecond.vue'
import filterDiyListTagGroup from './components/OrderFlowWebsite/FilterDiyListTagGroup.vue'
import paginationDiyList from './components/OrderFlowWebsite/PaginationDiyList.vue'
import paginationDiyListSecond from './components/OrderFlowWebsite/PaginationDiyListSecond.vue'

import orderDifmModal from './components/OrderFlowWebsite/OrderDifmModal.vue'
import summaryCartV2 from './components/SummaryCartV2.vue'
import modalCompleteUserProfile from './components/ModalCompleteUserProfile.vue'
import modalSosmed2Fa from './components/ModalSosmed2Fa.vue'
import vpsPlan from './components/OrderFlowVps/VpsPlan.vue'
import vpsKvmPlan from './components/OrderFlowVps/VpsKvmPlan.vue'
import selectImages from './components/OrderFlowVps/SelectImages.vue'
import modalSelectOs from './components/OrderFlowVps/ModalSelectOs.vue'
import modalUpgradeVpsNano from './components/OrderFlowVps/ModalUpgradeVpsNano.vue'
import itemCart from './components/ItemCart.vue'
import questionBox from './components/OrderFlowJasaWebsite/QuestionBox.vue'
import jasaWebsiteSectionSummary from './components/OrderFlowJasaWebsite/SectionSummary.vue'
import vpsFLow from './components/Rafle/Vps/VpsFlow.vue'
import selectRegion from './components/OrderFlowVps/SelectRegion.vue'
import UsernameBox from "./components/EazyLink/UsernameBox.vue"
import Toast from "./components/Toast.vue"

// Orderflow V2 Components
import hostingPlanV2 from './components/OrderFlowHosting/v2/HostingPlan.vue'
import domainSuggestionV2 from './components/OrderFlowHosting/v2/DomainSuggestion.vue'
import domainSuggestionV3 from './components/OrderFlowHosting/v2/DomainSuggestionV3.vue'

import sectionSummaryV2 from './components/v2/SectionSummary.vue'
import newAdditionalFeatureV2 from './components/v2/AdditionalFeature.vue'

Vue.component('v-select', vSelect)

// Enable this for development only
// Vue.config.devtools = true

window.axios = axios
window.Vue = Vue

Vue.options.delimiters = ['${', '}']
Vue.component('foobar', foobar)
Vue.component('section-summary', sectionSummary)
Vue.component('hosting-plan', hostingPlan)
Vue.component('payment-method', paymentMethod)
Vue.component('client-information', clientInformation)
Vue.component('section-cart', sectionCart)
Vue.component('additional-feature', additionalFeature)
Vue.component('orderflow-domain-verisign', orderFlowDomainVerisign)
Vue.component('custom-notification', customNotification)
Vue.component('new-hosting-plan', newHostingPlan)
Vue.component('new-payment-method', newPaymentMethod)
Vue.component('new-payment-method-v2', newPaymentMethodV2)
Vue.component('new-client-information', newClientInformation)
Vue.component('new-additional-feature', newAdditionalFeature)
Vue.component('domain-suggestion', domainSuggestion)
Vue.component('thank-you', thankYou)
Vue.component('summary-cart', summaryCart)
Vue.component('new-section-summary', newSectionSummary)
Vue.component('domain-hosting-plan', domainHostingPlan)

Vue.component('new-website-plan', websitePlan)
Vue.component('new-website-diy-list', websiteDiyList)
Vue.component('website-diy-list-second', websiteDiyListSecond)
Vue.component('website-diy-list-third', websiteDiyListThird)
Vue.component('website-diy-list-fourth', websiteDiyListFourth)
Vue.component('new-preview-diy-modal', previewDiyModal)
Vue.component('preview-diy-modal-second', previewDiyModalSecond)
Vue.component('preview-diy-modal-third', previewDiyModalThird)
Vue.component('preview-diy-demo', previewDiyDemo)
Vue.component('new-preview-diy-navigation', previewDiyNavigation)
Vue.component('new-order-diy-modal', orderDiyModal)
Vue.component('order-diy-modal-second', orderDiyModalSecond)
Vue.component('new-filter-diy-list', filterDiyList)
Vue.component('filter-diy-list-second', filterDiyListSecond)
Vue.component('filter-diy-list-tag-group', filterDiyListTagGroup)
Vue.component('new-pagination-diy-list', paginationDiyList)
Vue.component('pagination-diy-list-second', paginationDiyListSecond)

Vue.component('new-order-difm-modal', orderDifmModal)
Vue.component('summary-cart-v2', summaryCartV2)
Vue.component('modal-complete-user-profile', modalCompleteUserProfile)
Vue.component('modal-sosmed-2fa', modalSosmed2Fa)
Vue.component('vps-plan', vpsPlan)
Vue.component('vps-kvm-plan', vpsKvmPlan)
Vue.component('select-images', selectImages)
Vue.component('modal-select-os', modalSelectOs)
Vue.component('modal-upgrade-vps-nano', modalUpgradeVpsNano)
Vue.component('item-cart', itemCart)
Vue.component('question-box', questionBox)
Vue.component('jasa-website-section-summary', jasaWebsiteSectionSummary)
Vue.component('rafle-vps-flow', vpsFLow)
Vue.component('select-region', selectRegion)
Vue.component('username-box', UsernameBox)
Vue.component('toast', Toast)

// Orderflow V2 Components
Vue.component('hosting-plan-v2', hostingPlanV2)
Vue.component('domain-suggestion-v2', domainSuggestionV2)
Vue.component('domain-suggestion-v3', domainSuggestionV3)
Vue.component('section-summary-v2', sectionSummaryV2)
Vue.component('new-additional-feature-v2', newAdditionalFeatureV2)

window.bus = new Vue({
  el: '#vue-wrapper',
  mounted: function () {},
})