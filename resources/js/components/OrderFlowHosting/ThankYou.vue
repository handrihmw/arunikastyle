<template>
    <div class="row justify-content-center">
        <div class="col-md-10 col-xl-8">
            <div class="thanks-page">
                <p class="thanks-page__title">Terimakasih! Kami akan aktifkan pesanan Anda segera setelah Anda melakukan <strong>konfirmasi pembayaran!</strong></p>
                <div class="thanks-page__btn">
                    <a href="javascript:void(0);" @click="konfirmasiPembayaran()" class="button-default button-white-orange">Konfirmasi Pembayaran di Member Area</a>
                </div>
                
                <hr>
                <div v-if="checkoutData.code == 'Custom'" class="thanks-page__bank row justify-content-center">
                    <div class="col-md-10">
                    <p class="thanks-page__bank-title text-center">Transfer Bank Manual</p>
                        <div  class="thanks-page__bank-details">
                            <div v-for="(rek, bank) in rekening" v-bind:key="bank">
                                <div class="row align-items-center mb-3">
                                    <div class="col-md-4">
                                        <div v-bind:class="'payment-method__gateway-'+ bank"></div>
                                    </div>
                                    <div class="col-md-8">
                                        <p class="payment-method__gateway-norek">{{rek}}</p>
                                        <p class="payment-method__gateway-akun">a.n: PT. WEB MEDIA TECHNOLOGY INDONESIA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="d-block d-md-none clearfix mb-4">
                        <img v-bind:src="niaga_url + 'assets/images/payment-gateway/' + checkoutData.gateway_name + '.png'" class="img-fluid float-right" alt="Payment Gateway">
                    </div>
                    <div class="row">
                        <div class="" :class="payment_information.qrcode_url ? 'col-md-9' : 'col-md-8'">
                            <div class="row text-left">
                                <div class="col-6">
                                    <p class="thanks-page__payment-title">Invoice ID</p>
                                    <p v-if="payment_information.va_number" class="thanks-page__payment-title">Kode Pembayaran</p>
                                    <p class="thanks-page__payment-title">Nominal Tagihan</p>
                                    <p v-if="payment_information.qrcode_url" class="thanks-page__payment-title">Lakukan pembayaran sebelum</p>
                                    <p v-if="payment_information.qrcode_url" class="thanks-page__payment-title">Kode QR</p>
                                </div>
                                <div class="col-6">
                                    <p class="thanks-page__payment-detail text-uppercase">{{payment_information.invoice_serie_nr}}</p>
                                    <p v-if="payment_information.va_number" class="thanks-page__payment-detail">{{ payment_information.va_number }}</p>
                                    <p class="thanks-page__payment-detail">Rp {{ payment_information.payment_amount | formatPrice }}</p>
                                    <p v-if="payment_information.qrcode_url" class="thanks-page__payment-detail">{{ payment_information.expires_at }}</p>
                                    <p v-if="payment_information.qrcode_url" class="thanks-page__payment-detail" :class="{'thanks-page__payment-detail--qrcode':payment_information.qrcode_url}">
                                      <img :src="payment_information.qrcode_url" class="img-fluid float-right" alt="Kode QR">
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class=" d-none d-md-block" v-bind:class="payment_information.qrcode_url ? 'col-md-3' : 'col-md-4'">
                            <img v-bind:src="niaga_url + 'assets/images/payment-gateway/' + checkoutData.code + '.svg?ver=1.0.2'" class="img-fluid float-right" alt="Payment Gateway">
                        </div>
                    </div>
                    <div v-if="checkoutData.code == 'BCAVA' || checkoutData.code == 'HpaymentsBCAVA'" class="payment-step">
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM :</h3>
                        <ol>                                            
                          <li>Masukkan Kartu <b>ATM BCA & PIN</b></li>
                          <li>Pilih menu <b>Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account</b></li>
                          <li>Masukkan <b>kode pembayaran</b> atau <b>nomor BCA Virtual Account Anda</b></li>
                          <li>Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai seperti <b>No VA, Nama, Perus/Produk</b> dan <b>Total Tagihan</b></li>
                          <li>Ikuti instruksi untuk menyelesaikan transaksi</li>
                          <li>Transaksi selesai</li>
                        </ol>

                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui m-Banking :</h3>
                        <ol>
                          <li>Lakukan <b>log in</b> pada <b>aplikasi BCA Mobile</b></li>
                          <li>Pilih menu <b>m-BCA</b>, kemudian masukkan <b>kode akses m-BCA</b></li>
                          <li>Pilih <b>m-Transfer > BCA Virtual Account</b></li>
                          <li>Masukkan <b>kode pembayaran</b> atau <b>nomor BCA Virtual Account Anda</b></li>
                          <li>Di <b>halaman konfirmasi</b>, pastikan detil pembayaran sudah sesuai seperti <b>No VA, Nama, Perus/Produk</b> dan <b>Total Tagihan</b></li>
                          <li>Masukkan <b>pin m-BCA</b></li>
                          <li>Pembayaran selesai. <b>Simpan notifikasi</b> yang muncul sebagai bukti pembayaran</li>
                        </ol>

                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui IBanking</h3>
                        <ol>
                          <li>Login pada alamat Internet Banking BCA (https://klikbca.com)</li>
                          <li>Pilih menu <b>Pembayaran Tagihan > Pembayaran > BCA Virtual Account</b></li>
                          <li>Masukkan <b>kode pembayaran</b> atau nomor <b>BCA Virtual Account Anda</b></li>
                          <li>Di <b>halaman konfirmasi</b>, pastikan detil pembayaran sudah sesuai seperti <b>Nomor BCA Virtual Account, Nama Pelanggan</b> dan <b>Jumlah Pembayaran</b>.</li>
                          <li>Masukkan password dan mToken.</li>
                          <li>Transaksi selesai</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'HpaymentsQris'" class="payment-step">
                        <h3 class="payment-step__title">Pembayaran melalui QRIS :</h3>
                        <p>Anda dapat membayar tagihan Niagahoster menggunakan QRIS (QR Code Indonesian Standard) melalui semua Bank, eWallet, maupun provider pembayaran lain yang memiliki fitur Scan QRIS. Untuk melakukannya, ikuti langkah-langkah di bawah ini:</p>
                        <ol>
                          <li>Pilih <b>QRIS</b> </li>
                          <li>Pindai <b>kode QR</b> melalui platform pembayaran pilihan Anda</li>
                          <li>Masukkan nominal pembayaran </li> 
                          <li>Tekan bayar </li> 
                          <li>Tekan kembali ke merchant setelah pembayaran selesai dilakukan </li>
                          <li>Anda akan dialihkan kembali ke halaman tagihan pada Client Area Niagahoster </li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'BNIVA' || checkoutData.code == 'HpaymentsBNIVA'" class="payment-step">
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM :</h3>
                        <ol>
                            <li>Pilih Menu Lain > Transfer</li>
                            <li>Pilih rekening asal dan pilih rekening tujuan ke rekening BNI</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda <strong>{{ payment_information.va_number }}</strong> dan pilih Benar</li>
                            <li>Masukkan jumlah pembayaran sejumlah tagihan Anda dan pilih Benar</li>
                            <li>Periksa data di layar. Pastikan Nama Rekening Tujuan adalah nama penerima Anda dan Total Tagihan benar. Apabila data sudah benar, pilih Ya</li>
                            <li>Transaksi selesai</li>
                        </ol>

                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui IBanking :</h3>
                        <ol>                            
                            <li>Pilih Transaksi > Virtual Account Billing</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda <strong>{{ payment_information.va_number }}</strong>.</li>
                            <li>Pilih Rekening Debet dan klik Lanjutkan.</li>
                            <li>Cek detail konfirmasi. Pastikan Nama adalah nama penerima Anda.</li>
                            <li>Periksa detail konfirmasi. Pastikan Nama Rekening Tujuan adalah nama penerima Anda dan nominal transfer sudah benar.</li>
                            <li>Masukkan PIN BNI e-Secure Anda dan Klik Proses</li>
                            <li>Transaksi selesai</li>
                        </ol>
                        
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui m-Banking</h3>
                        <ol>                            
                            <li>Pilih Transfer > Antar Rekening BNI</li>
                            <li>Pilih Rekening Tujuan > Input Rekening Baru. Masukkan nomor rekening dengan nomor Virtual Account Anda <strong>{{ payment_information.va_number }}</strong> dan klik Lanjut, kemudian klik Lanjut lagi.</li>
                            <li>Masukkan jumlah pembayaran sejumlah tagihan Anda. Lalu, klik Lanjutkan</li>
                            <li>Periksa detail konfirmasi. Pastikan Nama Rekening Tujuan adalah nama penerima Anda dan nominal transfer sudah benar. Jika benar, masukkan password transaksi dan klik Lanjut</li>
                        </ol>
                        <h3 class="payment-step__title">Cara Pembayaran lewat ATM Mandiri/Jaringan ATM Bersama: (dikenakan biaya Rp 6.500,00)</h3> 
                        <ol>                            
                            <li>Pada Menu utama, pilih Transaksi Lainnya.</li>
                            <li>Pilih Transfer.</li>
                            <li>Pilih Antar Bank Online.</li>
                            <li>Masukkan nomor <strong>099 {{ payment_information.va_number }}</strong> (kode 009 dan kode Virtual account).</li>
                            <li>Masukkan jumlah tagihan yang akan Anda bayar secara lengkap. Pembayaran dengan jumlah yang tidak sesuai akan otomatis ditolak.</li>
                            <li>Pada halaman konfirmasi transfer akan muncul jumlah yang dibayarkan & nomor rekening tujuan. Jika informasinya telah sesuai tekan tombol Benar.</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Internet Banking Selain BNI (dikenakan biaya Rp 6.500,00):</h3>
                        <ol>                            
                            <li>Pilih Transfer >> Ke Bank Lain dan kemudian pilih BNI</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda <strong>{{ payment_information.va_number }}</strong>.</li>
                            <li>Masukkan jumlah tagihan yang akan Anda bayar secara lengkap. Pembayaran dengan jumlah yang tidak sesuai akan otomatis ditolak.</li>
                            <li>Periksa detail konfirmasi. Pastikan Nama Rekening Tujuan adalah nama penerima Anda dan nominal transfer sudah benar.</li>
                            <li>Masukkan PIN internet banking Anda dan Klik Proses untuk menyelesaikannya.</li>
                            <li>Transaksi selesai</li>
                        </ol>
                        <h3 class="payment-step__title">Cara Pembayaran lewat ATM BCA/Jaringan ATM PRIMA: (dikenakan biaya Rp 6.500,00)</h3>
                        <ol>                            
                            <li>Pada Menu utama, Pilih Transaksi Lainnya.</li>
                            <li>Pilih Transfer.</li>
                            <li>Pilih Ke Rek Bank Lain.</li>
                            <li>Masukkan kode 009 untuk BNI lalu tekan Benar.</li>
                            <li>Masukkan jumlah tagihan yang akan Anda bayar secara lengkap. Pembayaran dengan jumlah yang tidak sesuai akan otomatis ditolak.</li>
                            <li>Masukkan <strong>{{ payment_information.va_number }}</strong> (kode virtual account pembayaran) lalu tekan Benar.</li>
                            <li>Pada halaman konfirmasi transfer akan muncul jumlah yang dibayarkan & nomor rekening tujuan. Jika informasinya telah sesuai tekan Benar.</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'CimbNiaga' || checkoutData.code == 'HpaymentsCimbNiaga'" class="payment-step">
                        <h3 class="payment-step__title">Pembayaran CIMB Virtual Account dengan ATM CIMB :</h3>
                        <ol>                            
                            <li>Masukkan Kartu ATM dan PIN CIMB Anda</li>
                            <li>Pilih menu Pembayaran > Lanjut > Virtual Account</li>
                            <li>Masukkan nomor virtual account {{ payment_information.va_number }}</li>
                            <li>Pilih rekening debit</li>
                            <li>Nomor, nama virtual account dan jumlah billing ditampilkan pada layar</li>
                            <li>Pilih OK untuk melakukan pembayaran</li>
                            <li>Konfirmasi pembayaran ditampilkan pada layar</li>
                        </ol>

                        <h3 class="payment-step__title">Pembayaran CIMB Virtual Account dengan ATM Bersama / Prima :</h3>
                        <ol>                            
                            <li>Masukkan Kartu ATM dan PIN Anda pada mesin ATM bank tersebut</li>
                            <li>Pilih menu TRANSFER > TRANSFER KE BANK LAIN</li>
                            <li>Masukkan kode bank CIMB Niaga: 022</li>
                            <li>Masukkan jumlah pembayaran sesuai tagihan</li>
                            <li>Masukkan nomor virtual account {{ payment_information.va_number }}</li>
                            <li>Ikuti instruksi untuk menyelesaikan transaksi</li>
                            <li>Konfirmasi pembayaran ditampilkan pada layar</li>
                        </ol>

                        <h3 class="payment-step__title">Pembayaran CIMB Virtual Account dengan CIMB Clicks :</h3>
                        <ol>                            
                            <li>Login ke <a href="https://www.octoclicks.co.id/" target="_blank" rel="noopener noreferrer">CIMB clicks</a></li>
                            <li>Pilih menu Bayar Tagihan / Pay Bills</li>
                            <li>Pilih Rekening Sumber / Source Account dan Jenis Pembayaran / Payment Type > Virtual Account</li>
                            <li>Masukkan nomor virtual account {{ payment_information.va_number }}</li>
                            <li>Nomor, nama virtual account dan jumlah billing ditampilkan pada layar</li>
                            <li>Masukkan 6 digit mPIN dan tekan tombol Submit</li>
                            <li>Konfirmasi pembayaran ditampilkan pada layar</li>
                        </ol>
                        
                        <h3 class="payment-step__title">Pembayaran CIMB Virtual Account dengan Internet Banking Bank Lain :</h3>
                        <ol>                            
                            <li>Login ke internet banking</li>
                            <li>Pilih menu transfer ke Bank Lain Online</li>
                            <li>Pilih bank tujuan Bank CIMB Niaga (kode bank: 022)</li>
                            <li>Masukkan nomor virtual account {{ payment_information.va_number }}</li>
                            <li>Masukkan jumlah pembayaran sesuai tagihan</li>
                            <li>Nomor, nama virtual account dan jumlah billing ditampilkan pada layar</li>
                            <li>Ikuti instruksi untuk menyelesaikan transaksi</li>
                            <li>Konfirmasi pembayaran ditampilkan pada layar</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'MayBank' || checkoutData.code == 'HpaymentsMayBank'" class="payment-step">
                        <h3 class="payment-step__title">Melalui Transfer ATM Maybank :</h3>
                        <ol>                        
                            <li>Silahkan pilih menu Pembayaran / Topup Pulsa</li>
                            <li>Setelah itu, pilih menu Virtual Account</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda (contoh: {{ payment_information.va_number }}) dan pilih Benar</li>
                            <li>Tunggu sebentar hingga muncul konfirmasi pembayaran. Lalu masukkan jumlah pembayaran. Setelah selesai, silahkan klik Benar</li>
                        </ol>

                        <h3 class="payment-step__title">Melalui Transfer Internet Banking :</h3>
                        <ol>                        
                            <li>Silahkan login Internet Banking dari Maybank</li>
                            <li>Silahkan klik menu Rekening dan Transaksi. Kemudian pilih Maybank Virtual Account</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda (contoh: {{ payment_information.va_number }}). Lalu masukkan jumlah nominal transaksi anda</li>
                            <li>Setelah itu, masukkan SMS Token (TAC) dan klik Setuju</li>
                        </ol>

                        <h3 class="payment-step__title">Melalui Transfer mBanking :</h3>
                        <ol>                        
                            <li>Silahkan login mobile banking yang ada di smartphone anda</li>
                            <li>Setelah itu pilih menu Transfer. Lalu klik menu Virtual Account</li>
                            <li>Masukkan jumlah nominal transaksi dan masukkan nomor rekening dengan nomor Virtual Account Anda (contoh: {{ payment_information.va_number }}). Setelah itu klik Kirim</li>
                            <li>Tunggu sebentar hingga anda mendapatkan SMS notifikasi. Lakukan apa yang diperintahkan SMS notifikasi tersebut. Setelah semua selesai dilakukan, silahkan klik Reply</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'MandiriVA'" class="payment-step">
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM :</h3>
                        <ol>
                            <li>Pilih menu "Bayar/Beli"</li>
                            <li>Pilih menu "Lainnya"</li>
                            <li>Pilih menu "Multi Payment"</li>
                            <li>Masukkan Nomor Kode bayar Perusahaan / Instansi (<strong>70002</strong>)</li>
                            <li>Masukkan Kode Merchant (<strong>264</strong>)</li>
                            <li>Masukkan 8 digit Nomor Kode Pembayaran (<strong>{{ payment_information.va_number }}</strong>)</li>
                            <li>Periksa kembali semua rincian transaksi Anda</li>
                            <li>Transaksi selesai</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui e-Banking :</h3>
                        <ol>
                            <li>Pilih menu "Bayar --> Multi Payment"</li>
                            <li>Pilih "Penyedia jasa --> Doku"</li>
                            <li>Masukkan "Kode Merchant" (<strong>264</strong>)</li>
                            <li>Masukkan 8 digit Nomor Kode Pembayaran (<strong>{{ payment_information.va_number }}</strong>) di "ID/Pay Code"</li>
                            <li>Periksa kembali semua rincian transaksi Anda</li>
                            <li>Transaksi selesai </li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'HpaymentsBRIVA'" class="payment-step">
                        <h3 class="payment-step__title">Melalui Transfer ATM BRI VA :</h3>
                        <ol>                        
                            <li>Pilih menu "Transaksi Lain"</li>
                            <li>Pilih menu "Pembayaran"</li>
                            <li>Pilih menu "Lainnya"</li>
                            <li>Pilih menu "BRIVA"</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda (<strong>{{ payment_information.va_number }}</strong>) dan pilih Benar</li>
                            <li>Tunggu sebentar hingga muncul konfirmasi pembayaran. Jika informasinya telah sesuai tekan Ya.</li>
                            <li>Transaksi selesai. Simpan bukti pembayaran Anda</li>
                        </ol>

                        <h3 class="payment-step__title">Melalui BRI Internet Banking :</h3>
                        <ol>                        
                            <li>Silahkan login Internet Banking BRI</li>
                            <li>Pilih menu "Pembayaran"</li>
                            <li>Pilih menu "BRIVA"</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda (<strong>{{ payment_information.va_number }}</strong>) dan pilih Kirim</li>
                            <li>Masukkan Password dan Token, pilih Kirim</li>
                            <li>Transaksi selesai. Simpan bukti pembayaran Anda</li>
                        </ol>

                        <h3 class="payment-step__title">Melalui BRI Mobile Banking :</h3>
                        <ol>                        
                            <li>Silahkan login BRI Mobile dan pilih Mobile Banking BRI</li>
                            <li>Setelah itu pilih menu "Pembayaran". Lalu klik menu "BRIVA"</li>
                            <li>Masukkan nomor rekening dengan nomor Virtual Account Anda (<strong>{{ payment_information.va_number }}</strong>)</li>
                            <li>Masukkan Mobile Banking PIN dan pilih Kirim</li>
                            <li>Pembayaran selesai dan bukti pembayaran akan dikirim melalui SMS</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'RetailDuitKu' || checkoutData.code == 'HpaymentsRitel'" class="payment-step">
                      <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Retail DuitKu:</h3>
                      <ol>
                        <li>Klik <b>Checkout Sekarang</b></li>
                        <li>Anda akan diarahkan ke <b>halaman pembayaran Duitku</b>. Petunjuk pembayaran juga dapat Anda lihat pada halaman tersebut</li>
                        <li>Datangi <b>Gerai </b> terdekat</li>
                        <li>Informasikan kepada petugas bahwa Anda akan melakukan <b>Pembayaran Telkom</b></li>
                        <li>Apabila petugas menanyakan produk yang akan dibayar, instruksikan petugas untuk memilih produk <b>Telkom Indihome</b> atau <b>Telepon Rumah</b></li>
                        <li>Petugas akan meminta Kode Pembayaran. Sebutkan <b>Kode Pembayaran</b> Anda</li><li>Petugas akan memasukkan kode pembayaran yang Anda berikan ke dalam sistem. Selanjutnya, petugas akan memberitahukan nominal tagihan yang harus Anda bayar</li><li>Lakukan pembayaran sesuai nominal tagihan yang diinformasikan dan tunggu hingga proses selesai</li><li>Setelah melakukan pembayaran, petugas akan memberikan struk bukti pembayaran. Apabila tidak diberikan, mintalah struk tersebut. Simpan struk tersebut sebagai bukti pembayaran Anda</li>
                        <li>Transaksi selesai. Pembayaran Anda tercatat secara otomatis oleh sistem</li>
                      </ol>
                    </div>
                    <div v-if="checkoutData.code == 'Alfamart' || checkoutData.code == 'HpaymentsAlfamart'" class="payment-step">
                      <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Alfamart Group:</h3>
                      <ol>
                        <li>Catat Kode Pembayaran di atas dan datang ke gerai Alfa Group terdekat</li> 
                        <li>Datangi kasir dan katakan "ingin membayar NIAGAHOSTER Merchant"</li> 
                        <li>Kasir akan menayakan kode pembayaran, berikan Kode Pembayaran yang tertulis di atas</li> 
                        <li>Kasir akan mengkonfirmasi nama Merchant dan nominal yang harus dibayarkan</li> 
                        <li>Lakukan pembayaran ke kasir sejumlah nominal yang disebutkan. Pembayaran dapat menggunakan uang tunai atau non tunai. Non Tunai antara lain Kartu Debit BCA, Kartu Debit BNI, BCA Flazz, BNI Prepaid, dan Mandiri e-money.</li> 
                        <li>Terima struk sebagai bukti pembayaran sukses dilakukan. Notifikasi pembayaran juga akan langsung diterima Niagahoster.</li>
                      </ol>
                    </div>
                    <div v-if="checkoutData.code == 'HpaymentsIndomaret'" class="payment-step">
                      <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Kasir Gerai Indomaret:</h3>
                      <ol>
                        <li>Datangi gerai Indomaret terdekat</li> 
                        <li>Informasikan kepada kasir Indomaret bahwa Anda akan melakukan <b>transaksi payment point</b> atau pembayaran dengan menyebutkan nama merchant</li> 
                        <li>Sebutkan <b>Kode Bayar</b> pada kasir Indomaret</li> 
                        <li>Kasir akan memproses transaksi Anda</li> 
                        <li>Bayar transaksi sesuai nominal yang disebutkan oleh kasir Indomaret</li> 
                        <li>Simpan struk pembayaran Anda sebagai bukti transaksi</li> 
                        <li>Transaksi selesai</li>
                      </ol>
                      <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Mesin i-Kios Indomaret:</h3>
                      <ol>
                        <li>Datangi gerai Indomaret terdekat</li> 
                        <li>Lakukan transaksi melalui mesin i-Kios Indomaret</li> 
                        <li>Pilih <b>i-Payment</b>, kemudian pilih <b>e-Commerce</b></li> 
                        <li>Pilih nama merchant tujuan pembayaran yaitu <b>Niagahoster</b></li>
                        <li>Masukan <b>nomor handphone</b> dan <b>Kode Bayar</b></li> 
                        <li>Muncul <b>Konfirmasi Transaksi</b> pada layar. Tekan <b>Next</b></li> 
                        <li>Mesin i-Kios Indomaret akan mencetak invoice.</li> 
                        <li>Bayar sesuai nominal tagihan melalui kasir Indomaret dengan cara menunjukan <b>invoice</b></li> 
                        <li>Transaksi selesai. Simpan bukti pembayaran Anda</li>
                      </ol>
                    </div>
                    <div v-if="checkoutData.code == 'HpaymentsMandiri'" class="payment-step">
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM Mandiri:</h3>
                        <ol>
                            <li>Pilih Pembayaran/Pembelian</li>
                            <li>Pilih "Multi Payment"</li>
                            <li>Masukkan kode perusahan "5 digit pertama dari Virtual Account"</li>
                            <li>Masukkan seluruh kode Virtual Account </li>
                            <li>Masukkan jumlah nominal</li>
                            <li>Cek terlebih dahulu, jika sudah benar masukan angka/nomor 1, lalu pilih “Ya”</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM Bersama:</h3>
                        <ol>
                            <li>Masukkan kartu ke mesin ATM Bersama</li>
                            <li>Pilih "Transaksi lainnya"</li>
                            <li>Pilih menu "Transfer"</li>
                            <li>Pilih "Transfer ke Bank Lain"</li>
                            <li>Masukkan kode Bank Mandiri "008" dan 16 Digit nomor Virtual Account</li>
                            <li>Masukkan Nominal Transfer seusai tagihan atau kewajiban Anda. pastikan nominal sesuai</li>
                            <li>Konfirmasi rincian Anda akan tampil di layar, cek dan tekan 'Ya' untuk melanjutkan</li>
                            <li>Transaksi Berhasil</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Mobile Banking Mandiri:</h3>
                        <ol>
                            <li>Pilih "Bayar"</li>
                            <li>Masuk ke "Pembayaran Baru" lalu "Multipayment"</li>
                            <li>Pilih Penyedia Jasa "Duitku"</li>
                            <li>Isi "No VA" dengan "Nomor Virtual Account"</li>
                            <li>Pilih konfirmasi lalu masukan Nominal Transfer anda</li>
                            <li>Pilih "LANJUT" untuk melakukan pembayaran dan konfirmasi</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Mobile Banking Livin' by Mandiri berlogo Kuning:</h3>
                        <h4 class="payment-step__title">Cara 1</h4>
                        <ol>
                            <li>Pilih "Bayar"</li>
                            <li>Ketik dan cari pembayaran dengan memasukkan kata "Duitku" pada kolom pencarian "Cari Penyedia Jasa..."</li>
                            <li>Masukkan "Nomor Virtual Account"</li>
                            <li>Masukkan "Jumlah Nominal Tagihan"</li>
                            <li>Pilih "Lanjut Bayar" dan masukkan PIN anda</li>
                        </ol>
                        <h4 class="payment-step__title">Cara 2</h4>
                        <ol>
                            <li>Pilih "Bayar"</li>
                            <li>Masuk ke "Investasi"</li>
                            <li>Ketik kata "Duitku" pada kolom pencarian "Cari Penyedia Jasa apa"</li>
                            <li>Masukkan "Nomor Virtual Account"</li>
                            <li>Masukkan "Jumlah Nominal Tagihan"</li>
                            <li>Pilih "Lanjut Bayar" dan masukkan PIN anda</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'HpaymentsPermataBank'" class="payment-step">
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Permata Mobile :</h3>
                        <ol>
                            <li>Buka aplikasi Permata Mobile Internet (Android/iPhone)</li>
                            <li>Masukkan User ID & Password</li>
                            <li>Pilih Pembayaran Tagihan</li>
                            <li>Pilih Virtual Account</li>
                            <li>Masukkan 16 digit nomor Virtual Account yang tertera pada halaman konfirmasi (<strong>{{ payment_information.va_number }}</strong>)</li>
                            <li>Masukkan nominal pembayaran sesuai dengan yang ditagihkan</li>
                            <li>Muncul Konfirmasi pembayaran</li>
                            <li>Masukkan otentikasi transaksi/token</li>
                            <li>Transaksi selesai</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Permata Net :</h3>
                        <ol>
                            <li>Buka website <a href="https://new.permatanet.com" target="_blank" rel="noopener noreferrer">PermataNet</a></li>
                            <li>Masukkan User ID & Password</li>
                            <li>Pilih Pembayaran Tagihan</li>
                            <li>Pilih Virtual Account</li>
                            <li>Masukkan 16 digit nomor Virtual Account yang tertera pada halaman konfirmasi (<strong>{{ payment_information.va_number }}</strong>)</li>
                            <li>Masukkan nominal pembayaran sesuai dengan yang ditagihkan</li>
                            <li>Muncul Konfirmasi pembayaran</li>
                            <li>Masukkan otentikasi transaksi/token</li>
                            <li>Transaksi selesai</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM Permata :</h3>
                        <ol>
                            <li>Pilih menu Transaksi Lainnya</li>
                            <li>Pilih menu Pembayaran</li>
                            <li>Pilih menu Pembayaran Lainnya</li>
                            <li>Pilih menu Virtual Account</li>
                            <li>Masukkan nomor Virtual Account yang tertera pada halaman konfirmasi, dan tekan Benar</li>
                            <li>Pilih Rekening yang menjadi sumber dana yang akan didebet, lalu tekan Ya untuk konfirmasi transaksi</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM Bersama :</h3>
                        <ol>
                            <li>Pada Menu utama, pilih Transaksi Lainnya</li>
                            <li>Pilih Transfer</li>
                            <li>Pilih Antar Bank Online</li>
                            <li>Masukkan nomor 013 <strong>{{ payment_information.va_number }}</strong> (kode 013 (kode bank) dan 16 angka kode Virtual account)</li>
                            <li>Masukkan jumlah pembayaran sesuai tagihan</li>
                            <li>Akan muncul rincian pembayaran Anda. Jika sudah benar, klik 'Ya' untuk melanjutkan</li>
                        </ol>
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui ATM Prima :</h3>
                        <ol>
                            <li>Pada Menu utama, Pilih Transaksi Lainnya</li>
                            <li>Pilih Transfer</li>
                            <li>Pilih Ke Rek Bank Lain</li>
                            <li>Masukkan kode 013 untuk PERMATA lalu tekan Benar</li>
                            <li>Masukkan jumlah tagihan yang akan Anda bayar secara lengkap</li>
                            <li>Masukkan <strong>{{ payment_information.va_number }}</strong> ( 16 kode virtual account pembayaran) lalu tekan Benar</li>
                            <li>Akan muncul rincian pembayaran Anda. Jika sudah benar, klik 'Ya' untuk melanjutkan</li>
                        </ol>
                    </div>
                    <div v-if="checkoutData.code == 'HpaymentsKoinWorks'" class="payment-step">
                        <h3 class="payment-step__title">Langkah - Langkah Pembayaran Melalui Koinworks Neo:</h3>
                        <ol>
                            <li>Klik <strong>Checkout Sekarang</strong></li>
                            <li>Anda akan diarahkan ke <strong>halaman pembayaran MIDTRANS</strong>. Pembayaran tagihan melalui kartu kredit diproses sepenuhnya oleh MIDTRANS</li>
                            <li>Masukkan <strong>Nomor Kartu Kredit, Kode CCV, Tanggal Kadaluarsa Kartu</strong>, serta <strong>identitas diri Anda</strong></li>
                            <li>Niagahoster adalah merchant <strong>Koinworks Neo</strong>. Anda akan diminta untuk mengisi PIN kartu kredit Anda</li>
                            <li>Masukkan PIN kartu kredit Anda. Bank penerbit kartu kredit memiliki metode pengiriman PIN berbeda-beda. Umumnya, PIN dikirimkan ke nomor handphone yang terdaftar pada kartu kredit Anda</li> 
                            <li>Setelah proses verifikasi berhasil, transaksi akan dicatat oleh sistem menggunakan kartu kredit Anda</li> 
                            <li>Transaksi selesai. Anda akan diarahkan ke <strong>halaman Thank You Niagahoster</strong> dan order Anda akan segera diaktifkan</li> 
                            <li>Apabila <strong>transaksi gagal</strong>, Anda akan diarahkan ke <strong>halaman Thank You Niagahoster</strong>. Sistem akan mengirimkan email berisi petunjuk pembayaran. Order akan aktif setelah Niagahoster memverifikasi pembayaran manual Anda</li>
                        </ol>
                    </div>
                </div>
                <p class="thanks-page__note">
                    Jika Anda ada pertanyaan lebih lanjut silakan <strong>chat kami</strong> atau telepon <strong>0{{ cs_phone }}</strong>
                </p>
            </div>                
        </div>
    </div>
</template>
<script>
import CommonMethods from '../../CommonMethods';
export default {
    name: 'ThankYou',
    props: ['cart','client','cs_phone','payment_methods'],
    data: function() {
        return {
            bb_url: CommonVar.bb_url,
            niaga_url: CommonVar.niaga_url,
            gateway_id: null,
            rekening: {
                bca: '0283116490',
                mandiri: '1030006055954',
                bri: '040901000395302',
                bni: '3300030034',
            },
            checkoutData: [],
            cartTotal: null,
            show_spinner: false,
            invoiceData: [],
            payment_information: [],
        }
    },
    filters: {
        formatPrice(value) {
            return CommonMethods.formatPrice(value)
        }
    },
    methods: {
        konfirmasiPembayaran() {            
            if (sessionStorage.getItem('front_checkout')) {
                let hash = this.checkoutData.invoice_hash;
                let redirectUrl = this.bb_url + '/invoice/thank-you/' + hash + '?status=ok&gw=invoice';
                window.location.href = redirectUrl;
                sessionStorage.clear();
            }            
        },
        getFromStorage() {
            if ( sessionStorage.getItem('front_checkout')) {
                bus.$emit('show-spinner', true);
                this.checkoutData = JSON.parse(sessionStorage.getItem('front_checkout'));
                this.invoiceData = JSON.parse(sessionStorage.getItem('checkout_payment'));
            } else {
                window.location.href = CommonVar.niaga_url + 'orderhosting';
            }

            if (sessionStorage.getItem('flow') === 'cloudhosting'
                || sessionStorage.getItem('flow') === 'mailhosting'
            ) {
                sessionStorage.removeItem('flow');
            }
        },
        getInvoice() {            
            axios.post('/api/guest/invoice_information',{                
                hash: this.checkoutData.invoice_hash,
                gateway_code: this.checkoutData.code,
                invoice_id: this.checkoutData.invoice_id,
                checkout_data: this.invoiceData
            })
                .then( (res) => {
                    this.payment_information = res.data.result;
                    bus.$emit('show-spinner', false);
            })
            .catch((err) => {
                console.log(err);
                bus.$emit('show-spinner', false);
            });
        },
        virtualPageView() {
          let wordpressHosting = sessionStorage.getItem('wordpress_hosting');
          const urlParams = new URLSearchParams(window.location.search);
          let type = urlParams.get('type');

          if (wordpressHosting === 'checked') {
            type = 'wp-hosting';
          }

          let vpOrderFlow = [
            'unlimited-hosting',
            'cloud-hosting',
            'mail-hosting',
            'domain',
            'wp-hosting',
            'cloud-vps-hosting',
            'vps-kvm-indonesia',
            'web-instant'
          ];

          if (CommonMethods.inArray(type, vpOrderFlow)) {
            setTimeout(() => {
              bus.$emit('gtm-page-view', `/vp-orderflow/${type}/thank-you`);
            }, 500);
          }
        }
    },
    created() {
        this.getFromStorage();
        this.getInvoice();
        this.virtualPageView();
    }
}
</script>