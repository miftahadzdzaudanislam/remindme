<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <title>RemindMe</title>

    <!-- Bootstrap core CSS -->
    <link href="{{ asset('vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/fontawesome.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/templatemo-scholar.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/owl.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/animate.css') }}">
    <link rel="stylesheet"href="https://unpkg.com/swiper@7/swiper-bundle.min.css"/>
    <link rel="icon" type="image/png" href="/logo-remindMe.png">
<!--

TemplateMo 586 Scholar

https://templatemo.com/tm-586-scholar

-->
  </head>

<body>

  <!-- ***** Preloader Start ***** -->
  <div id="js-preloader" class="js-preloader">
    <div class="preloader-inner">
      <span class="dot"></span>
      <div class="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
  <!-- ***** Preloader End ***** -->

  <!-- ***** Header Area Start ***** -->
  <header class="header-area header-sticky bg-transparent">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <nav class="main-nav">
                    <!-- ***** Logo Start ***** -->
                    <a href="{{ url('/') }}" class="logo">
                        <img src="assets/images/logo-remindme.png" alt="">
                    </a>
                    <!-- ***** Logo End ***** -->
                    <!-- ***** Serach Start ***** -->
                    <!-- <div class="search-input">
                      <form id="search" action="#">
                        <input type="text" placeholder="Type Something" id='searchText' name="searchKeyword" onkeypress="handle" />
                        <i class="fa fa-search"></i>
                      </form>
                    </div> -->
                    <!-- ***** Serach Start ***** -->
                    <!-- ***** Menu Start ***** -->
                    <ul class="nav">
                      <li class="scroll-to-section"><a href="#top" class="active">Home</a></li>
                      @if (Auth::check())
                      @if (Auth::user()->role === 'mahasiswa')
                      <li class="scroll-to-section"><a href="#task">Task</a></li>
                      @endif
                      @endif
                      <li class="scroll-to-section"><a href="#services">Services</a></li>
                      <li class="scroll-to-section"><a href="#team">Team</a></li>                      
                      {{-- Jika belum login --}}
                    @guest
                      <li><a href="{{ route('login') }}">Login</a></li>
                      <li><a href="{{ route('register') }}">Register</a></li>
                    @endguest

                    {{-- Jika sudah login --}}
                    @if(Auth::check())
                      @if(Auth::user()->role === 'mahasiswa')
                          <li><a href="{{ route('mahasiswa.dashboard') }}">Dashboard</a></li>
                      @elseif(Auth::user()->role === 'admin')
                          <li><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
                      @endif
                    @endif


                  </ul>   
                    <a class='menu-trigger'>
                        <span>Menu</span>
                    </a>
                    <!-- ***** Menu End ***** -->
                </nav>
            </div>
        </div>
    </div>
  </header>
  <!-- ***** Header Area End ***** -->

  <div class="main-banner" id="top">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="owl-carousel owl-banner">
            <div class="item item-1">
              <div class="header-text">
                <span class="category">Fitur Unggulan</span>
                <h2>Reminder Tugas & Jadwal Kuliah Mahasiswa</h2>
                <p>Kelola waktu kuliahmu dengan lebih mudah!
                  Dengan aplikasi ini, kamu bisa mencatat tugas, menyusun jadwal kuliah, dan mendapatkan notifikasi deadline langsung ke WhatsApp.</p>
                <!-- <div class="buttons">
                  <div class="main-button">
                    <a href="#">Request Demo</a>
                  </div>
                  <div class="icon-button">
                    <a href="#"><i class="fa fa-play"></i> What's Scholar?</a>
                  </div>
                </div> -->
              </div>
            </div>
            <div class="item item-2">
              <div class="header-text">
                <span class="category">Ringan & Akrab</span>
                <h2>Kuliah Tenang, Tugas Aman</h2>
                <p>Capek lupa deadline atau keteteran jadwal? Aplikasi ini bantu kamu mencatat jadwal kuliah, bikin reminder tugas, dan ngirim notifikasi otomatis ke WhatsApp.
                  Gampang banget, tinggal atur – kami yang ingetin!</p>
                <!-- <div class="buttons">
                  <div class="main-button">
                    <a href="#">Request Demo</a>
                  </div>
                  <div class="icon-button">
                    <a href="#"><i class="fa fa-play"></i> What's the best result?</a>
                  </div>
                </div> -->
              </div>
            </div>
            <div class="item item-3">
              <div class="header-text">
                <span class="category">Promosi & Menarik</span>
                <h2>Jadi Mahasiswa Super Produktif!</h2>
                <p>Gunakan aplikasi Reminder Tugas untuk mencatat semua deadline, jadwal kuliah, dan dapatkan pengingat otomatis lewat WhatsApp.
                  Belajar lebih fokus, tanpa takut lupa tugas lagi.</p>
                <!-- <div class="buttons">
                  <div class="main-button">
                    <a href="#">Request Demo</a>
                  </div>
                  <div class="icon-button">
                    <a href="#"><i class="fa fa-play"></i> What's Online Course?</a>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <div class="section events" id="task">
    <div class="container">
  <div class="row">
      @if(Auth::check() && Auth::user()->role === 'mahasiswa')
      <div class="section-heading text-center">
        <h6>Schedule</h6>
        <h2 style="color: #3949AB">Upcoming Task</h2>
      </div>
      @endif

    @if(Auth::check() && Auth::user()->role === 'mahasiswa')
  <p class="text-xl text-center font-semibold mb-4">Selamat datang, <span style="color: #3949AB; font-weight: bold"> {{ Auth::user()->name }}! </span></p>

  @if($tugas_terdekat->isEmpty())
    <p class="text-center text-gray-600">Tidak ada tugas yang tersedia.</p>
  @else
    @foreach ($tugas_terdekat as $tugas)
      <div class="col-lg-12 col-md-6 mb-4 mt-10">
        <div class="item border rounded-lg p-4 shadow-sm">
          <div class="row">
            <div class="col-lg-12">
              <ul>
                <li>
                  <span class="category text-sm font-medium text-blue-600">{{ ucfirst($tugas->prioritas) }}</span>
                  <h4 class="text-xl font-bold">{{ $tugas->judul }}</h4>
                </li>
                <li class="mt-2">
                  <span class="text-sm text-gray-500">Mata Kuliah:</span>
                  <h6 class="text-base">{{ $tugas->mata_kuliah->nama_matkul ?? 'Tidak diketahui' }}</h6>
                </li>
                <li class="mt-2">
                  <span class="text-sm text-gray-500">Deadline:</span>
                  <h6 class="text-base text-red-600">{{ \Carbon\Carbon::parse($tugas->deadline)->translatedFormat('d F Y, H:i') }}</h6>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    @endforeach
  @endif
@endif

  </div>
</div>

  </div>

  <div class="services section" id="services">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6">
          <div class="service-item">
            <div class="icon">
              <img src="{{ asset('assets/images/service-01.png') }}" alt="online degrees">
            </div>
            <div class="main-content">
              <h4 style="color: #3949AB">Manajemen <br> Tugas Otomatis</h4>
              <p>Tambahkan tugas dan tentukan deadline-nya</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="service-item">
            <div class="icon">
              <img src="{{ asset('assets/images/service-02.png') }}" alt="short courses">
            </div>
            <div class="main-content">
              <h4 style="color: #3949AB">Integrasi Jadwal Kuliah</h4>
              <p>Sinkronisasi dengan Google Calendar atau input manual</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="service-item">
            <div class="icon">
              <img src="{{ asset('assets/images/service-03.png') }}" alt="web experts">
            </div>
            <div class="main-content">
              <h4 style="color: #3949AB">Pengingat via WhatsApp</h4>
              <p>Notifikasi langsung ke WhatsApp sebelum H-3 deadline & Hari H deadline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section about-us">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 offset-lg-1">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Fokus pada Produktivitas Mahasiswa
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  Kami memahami betapa padatnya jadwal kuliah dan tugas. Dengan RemindMe, kamu bisa lebih fokus belajar tanpa khawatir lupa deadline.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Notifikasi Real-Time via WhatsApp
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  Langsung dapat pengingat ke WhatsApp sesuai jadwal yang kamu tentukan sendiri—mulai dari H-3 hingga beberapa jam sebelum tenggat!
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Desain Simpel, Fitur Lengkap
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  Antarmuka dirancang khusus agar mudah digunakan siapa saja. Mulai dari tambah tugas, atur jadwal, hingga lihat daftar deadline—semua dalam satu aplikasi.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFour">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  Dibuat oleh Mahasiswa, untuk Mahasiswa
                </button>
              </h2>
              <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  RemindMe lahir dari pengalaman nyata mahasiswa yang kesulitan mengatur tugas dan jadwal. Kami bangun solusi ini karena kami pernah ada di posisimu.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5 align-self-center">
          <div class="section-heading">
            <h6>About Us</h6>
            <h2 style="color: #3949AB">Solusi Cerdas untuk Mahasiswa yang Sibuk</h2>
            <p>Kami hadir untuk membantu mahasiswa mengelola tugas dan jadwal kuliah dengan lebih mudah. Dengan fitur pengingat otomatis dan integrasi WhatsApp, kamu nggak perlu takut lagi lupa deadline.
              Kami percaya, manajemen waktu yang baik adalah kunci kesuksesan akademik.</p>
            <div class="main-button">
              <a href="#">Selengkapnya</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <section class="section courses" id="courses" >
    <div class="container">
      <div class="row">
        <div class="col-lg-12 text-center">
          <div class="section-heading">
            <h6>Latest Courses</h6>
            <h2>Latest Courses</h2>
          </div>
        </div>
      </div>
      <ul class="event_filter">
        <li>
          <a class="is_active" href="#!" data-filter="*">Show All</a>
        </li>
        <li>
          <a href="#!" data-filter=".design">Webdesign</a>
        </li>
        <li>
          <a href="#!" data-filter=".development">Development</a>
        </li>
        <li>
          <a href="#!" data-filter=".wordpress">Wordpress</a>
        </li>
      </ul>
      <div class="row event_box">
        <div class="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 design">
          <div class="events_item">
            <div class="thumb">
              <a href="#"><img src="assets/images/course-01.jpg" alt=""></a>
              <span class="category">Webdesign</span>
              <span class="price"><h6><em>$</em>160</h6></span>
            </div>
            <div class="down-content">
              <span class="author">Stella Blair</span>
              <h4>Learn Web Design</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6  development">
          <div class="events_item">
            <div class="thumb">
              <a href="#"><img src="assets/images/course-02.jpg" alt=""></a>
              <span class="category">Development</span>
              <span class="price"><h6><em>$</em>340</h6></span>
            </div>
            <div class="down-content">
              <span class="author">Cindy Walker</span>
              <h4>Web Development Tips</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 design wordpress">
          <div class="events_item">
            <div class="thumb">
              <a href="#"><img src="assets/images/course-03.jpg" alt=""></a>
              <span class="category">Wordpress</span>
              <span class="price"><h6><em>$</em>640</h6></span>
            </div>
            <div class="down-content">
              <span class="author">David Hutson</span>
              <h4>Latest Web Trends</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 development">
          <div class="events_item">
            <div class="thumb">
              <a href="#"><img src="assets/images/course-04.jpg" alt=""></a>
              <span class="category">Development</span>
              <span class="price"><h6><em>$</em>450</h6></span>
            </div>
            <div class="down-content">
              <span class="author">Stella Blair</span>
              <h4>Online Learning Steps</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 wordpress development">
          <div class="events_item">
            <div class="thumb">
              <a href="#"><img src="assets/images/course-05.jpg" alt=""></a>
              <span class="category">Wordpress</span>
              <span class="price"><h6><em>$</em>320</h6></span>
            </div>
            <div class="down-content">
              <span class="author">Sophia Rose</span>
              <h4>Be a WordPress Master</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 align-self-center mb-30 event_outer col-md-6 wordpress design">
          <div class="events_item">
            <div class="thumb">
              <a href="#"><img src="assets/images/course-06.jpg" alt=""></a>
              <span class="category">Webdesign</span>
              <span class="price"><h6><em>$</em>240</h6></span>
            </div>
            <div class="down-content">
              <span class="author">David Hutson</span>
              <h4>Full Stack Developer</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section> -->

  <div class="section fun-facts">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="wrapper">
            <div class="row">
              <div class="col-lg-3 col-md-6">
                <div class="counter">
                  <h2 class="timer count-title count-number" data-to="300" data-speed="1000"></h2>
                   <p class="count-text ">Mahasiswa Aktif</p>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="counter">
                  <h2 class="timer count-title count-number" data-to="720" data-speed="1000"></h2>
                  <p class="count-text ">Jadwal Kuliah Tercatat</p>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="counter">
                  <h2 class="timer count-title count-number" data-to="370" data-speed="1000"></h2>
                  <p class="count-text ">Tugas Tercatat</p>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="counter end">
                  <h2 class="timer count-title count-number" data-to="290" data-speed="1000"></h2>
                  <p class="count-text ">Tugas Terselesaikan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="team section" id="team">
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center mb-5">
        <h2 class="text-center mb-5" style="color: #3949AB">Our Team in <span style="color: #1E63B0">RemindMe</span></h2>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-lg-3 col-md-6">
        <div class="team-member">
          <div class="main-content">
            <img src="{{ asset('assets/images/member-03.jpg') }}" alt="Mufadhal">
            <span  class="category">Project Manager</span>
            <h4>Mufadhal</h4>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="team-member">
          <div class="main-content">
            <img src="{{ asset('assets/images/member-02.jpg') }}" alt="Ade Purnamasari">
            <span class="category">Scrum Master</span>
            <h4>Ade Purnamasari</h4>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="team-member">
          <div class="main-content">
            <img src="{{ asset('assets/images/member-03.jpg') }}" alt="Miftah A. D. Islam">
            <span class="category">Designer &amp; Developer</span>
            <h4>Miftah A. D. Islam</h4>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="team-member">
          <div class="main-content">
            <img src="{{ asset('assets/images/member-03.jpg') }}" alt="Erik Setiawan">
            <span class="category">Designer &amp; Developer</span>
            <h4>Erik Setiawan</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


   <div style="margin-top: 0;" class="team section" id="team">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-3 col-md-6">
          <div class="team-member">
            <div class="main-content">
              <img src="{{ asset('assets/images/member-01.jpg') }}" alt="">
              <span class="category">Designer & Developer</span>
              <h4>Ainun Nisa W. N</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="team-member">
            <div class="main-content">
              <img src="{{ asset('assets/images/member-03.jpg') }}" alt="">
              <span class="category">Media Kreatif</span>
              <h4>Egi Vrinaldi A. F</h4>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="team-member">
            <div class="main-content">
              <img src="{{ asset('assets/images/member-02.jpg') }}" alt="">
              <span class="category">Media Kreatif</span>
              <h4>Naila Fitriani H.</h4>              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> 

  <footer>
    <div class="container">
      <div class="col-lg-12">
        <p>Copyright © 2025 Pistachio. All rights reserved. &nbsp;&nbsp;&nbsp;</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <!-- Bootstrap core JavaScript -->
  <script src="{{ asset('vendor/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('vendor/bootstrap/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('assets/js/isotope.min.js') }}"></script>
    <script src="{{ asset('assets/js/owl-carousel.js') }}"></script>
    <script src="{{ asset('assets/js/counter.js') }}"></script>
    <script src="{{ asset('assets/js/custom.js') }}"></script>

  </body>
</html>