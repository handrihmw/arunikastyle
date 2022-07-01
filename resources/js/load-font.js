let FontFaceObserver = require('fontfaceobserver');

let nunitoReg = new FontFaceObserver('NunitoSansRegular');
let nunitoLight = new FontFaceObserver('NunitoSansLight');
let nunitoBold = new FontFaceObserver('NunitoSansBold');

if (document.cookie.replace(/(?:(?:^|.*;\s*)fonts_loaded\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
  Promise.all([nunitoReg.load(), nunitoLight.load(), nunitoBold.load()]).then(function () {
    document.documentElement.classList.add('fonts-loaded');
    document.cookie = "fonts_loaded=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    console.log('Fonts success to load.');
  }).catch(function() {
    console.log('Fonts failed to load.');
  });
};