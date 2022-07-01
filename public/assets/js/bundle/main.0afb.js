"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwpck"] = self["webpackChunkwpck"] || []).push([[484],{

/***/ "./resources/js/vue-filter/filter.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"./node_modules/vue/dist/vue.esm.js\");\n\nvue__WEBPACK_IMPORTED_MODULE_0__/* [\"default\"].filter */ .Z.filter('link', function (slug) {\n  if (!slug) {\n    return CommonVar.niaga_url;\n  }\n\n  return CommonVar.niaga_url + slug;\n});\nvue__WEBPACK_IMPORTED_MODULE_0__/* [\"default\"].filter */ .Z.filter('formatPrice', function (value) {\n  if (!value) {\n    return 'Rp. 0,00';\n  }\n\n  value = Math.round(value);\n  value = (value / 1).toFixed(2).replace('.', ',');\n  return 'Rp. ' + value.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, \".\");\n});\nvue__WEBPACK_IMPORTED_MODULE_0__/* [\"default\"].filter */ .Z.filter('phone_number', function (separator = '') {\n  return \"MISSING_ENV_VAR\".PHONE_AREA + separator + \"MISSING_ENV_VAR\".PHONE_NUMBER;\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9yZXNvdXJjZXMvanMvdnVlLWZpbHRlci9maWx0ZXIuanMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dwY2svLi9yZXNvdXJjZXMvanMvdnVlLWZpbHRlci9maWx0ZXIuanM/NzA0OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSc7XG5WdWUuZmlsdGVyKCdsaW5rJywgZnVuY3Rpb24gKHNsdWcpIHtcbiAgaWYgKCFzbHVnKSB7XG4gICAgcmV0dXJuIENvbW1vblZhci5uaWFnYV91cmw7XG4gIH1cbiAgcmV0dXJuIENvbW1vblZhci5uaWFnYV91cmwgKyBzbHVnO1xufSk7XG5cblZ1ZS5maWx0ZXIoJ2Zvcm1hdFByaWNlJywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gJ1JwLiAwLDAwJztcbiAgfVxuICB2YWx1ZSA9IE1hdGgucm91bmQodmFsdWUpO1xuICB2YWx1ZSA9ICh2YWx1ZSAvIDEpLnRvRml4ZWQoMikucmVwbGFjZSgnLicsICcsJyk7XG4gIHJldHVybiAnUnAuICcgKyB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiLlwiKTtcbn0pO1xuXG5WdWUuZmlsdGVyKCdwaG9uZV9udW1iZXInLCBmdW5jdGlvbiAoc2VwYXJhdG9yID0gJycpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LlBIT05FX0FSRUEgKyBzZXBhcmF0b3IgKyBwcm9jZXNzLmVudi5QSE9ORV9OVU1CRVI7XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./resources/js/vue-filter/filter.js\n");

/***/ })

}]);