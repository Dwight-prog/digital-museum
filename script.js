// =============================================================
// National Symbols and Filipino Identity — Digital Museum
// Shared script.js loaded by every page
//
// Sources:
// - Republic Act No. 8491 (Flag and Heraldic Code)
// - Executive Order No. 292 (Administrative Code of 1987)
// - Proclamation No. 652, s. 1934 (Sampaguita & Narra)
// - Proclamation No. 615, s. 1995 (Philippine Eagle)
// - Proclamation No. 905, s. 1996 (Philippine Pearl)
// - Republic Act No. 9850 (Arnis)
// - NCCA/NEDA "Filipino Values for the Common Good"
// =============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Theme toggle (dark/light mode) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('museum-theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('museum-theme', isDark ? 'dark' : 'light');
    });
  }


  /* ---------- Hero slideshow (index.html) ---------- */
  const heroBg = document.getElementById('heroBg');

  if (heroBg) {
    const slides = heroBg.querySelectorAll('.hero-slide');
    let slideIndex = 0;

    if (slides.length > 1) {
      setInterval(function () {
        slides[slideIndex].classList.remove('active');

        slideIndex = (slideIndex + 1) % slides.length;

        slides[slideIndex].classList.add('active');
      }, 6000);
    }
  }


  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');

  if (navbar) {

    function updateNavbar() {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    updateNavbar();

    window.addEventListener('scroll', updateNavbar, {
      passive: true
    });
  }


  /* ---------- Mobile nav toggle + backdrop ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbarMobile = document.getElementById('navbar');

  if (navToggle && navLinks && navbarMobile) {

    /* Create backdrop element */
    let navBackdrop = document.querySelector('.nav-backdrop');

    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    /* Toggle function */
    function toggleMobileNav() {

      const isOpen = navLinks.classList.toggle('open');

      navToggle.classList.toggle('open', isOpen);
      navBackdrop.classList.toggle('active', isOpen);

      navToggle.setAttribute('aria-expanded', isOpen);

      /* Prevent body scroll when menu open */
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    /* Toggle button click */
    navToggle.addEventListener('click', toggleMobileNav);

    /* Backdrop click — close menu */
    navBackdrop.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navBackdrop.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });

    /* Link click — close menu */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navBackdrop.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Escape key — close menu */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navBackdrop.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    /* Resize — close menu if window grows */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navBackdrop.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Reveal-on-scroll animation ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {

    if ('IntersectionObserver' in window) {

      const observer = new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add('in-view');

              observer.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });

    } else {

      revealEls.forEach(function (el) {
        el.classList.add('in-view');
      });

    }
  }

    /* =============================================================
     PHASE 3: HOME PAGE ENHANCEMENTS
     ============================================================= */

  /* ---------- Stats Counter Animation ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length && 'IntersectionObserver' in window) {

    const statsObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {

          entry.target.classList.add('counted');

          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          const duration = 1500;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            /* Ease out cubic */
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOut * target);

            entry.target.textContent = currentValue;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              entry.target.textContent = target;
            }
          }

          requestAnimationFrame(updateCount);
        }
      });

    }, { threshold: 0.4 });

    statNumbers.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }


  /* ---------- Gallery Card 3D Tilt on Mouse Move ---------- */
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (galleryCards.length && window.matchMedia('(hover: hover)').matches) {

    galleryCards.forEach(function (card) {

      card.addEventListener('mousemove', function (e) {

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-12px) scale(1.02)';

      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });

    });
  }


  /* ---------- Featured Symbol (Random) ---------- */
  const featuredSymbol = document.getElementById('featuredSymbol');

  if (featuredSymbol && typeof exhibits !== 'undefined') {

    const featuredKeys = Object.keys(exhibits);
    const randomKey = featuredKeys[Math.floor(Math.random() * featuredKeys.length)];
    const featured = exhibits[randomKey];

    if (featured) {
      featuredSymbol.innerHTML =
        '<p class="featured-symbol-label">Symbol of the Day</p>' +
        '<h3 class="featured-symbol-title">' + featured.title + '</h3>' +
        '<p class="featured-symbol-desc">' + featured.short + '</p>';
      featuredSymbol.style.display = 'block';
    }
  }


  /* =============================================================
     EXHIBITS DATA
     
     10 Official National Symbols
     9 Popular Filipino Symbols
     
     Sources:
     - Republic Act No. 8491 (Flag and Heraldic Code)
     - Executive Order No. 292 (Administrative Code of 1987)
     - Proclamation No. 652, s. 1934 (Sampaguita & Narra)
     - Proclamation No. 615, s. 1995 (Philippine Eagle)
     - Proclamation No. 905, s. 1996 (Philippine Pearl)
     - Republic Act No. 9850 (Arnis)
     ============================================================= */

  const exhibits = {

    /* =========================================================
       OFFICIAL NATIONAL SYMBOLS
       ========================================================= */


    /* ---------- 01. PHILIPPINE FLAG ---------- */
    flag: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Philippine National Flag',

      short:
        'The Philippine flag is a symbol of sovereignty, independence, unity, and the Filipino people’s struggle for freedom.',

      history:
        'The Philippine flag was first displayed during the proclamation of Philippine independence in Kawit, Cavite, on June 12, 1898. Its design consists of a white equilateral triangle, a blue field, a red field, a golden-yellow sun with eight rays, and three five-pointed stars. The proper use, display, and treatment of the national flag are governed by Republic Act No. 8491, also known as the Flag and Heraldic Code of the Philippines.',

      meaning:
        'The white triangle represents equality and fraternity. The blue field represents peace, truth, and justice, while the red field represents patriotism and valor. The golden sun represents liberty. Its eight rays commemorate the first eight provinces that rose in revolt against Spanish colonial rule. The three stars represent the three major geographical divisions of the Philippines: Luzon, Visayas, and Mindanao.',

      identity:
        'The Philippine flag is one of the most visible expressions of Filipino national identity. It is displayed in schools, government offices, public ceremonies, and national celebrations. For Filipinos, it represents independence, unity, sacrifice, and the continuing responsibility to protect the nation.',

      image: 'assets/flag.jpg',

      media:
        '<div class="flag-art">' +
          '<div class="flag-white"></div>' +
          '<div class="flag-blue"></div>' +
          '<div class="flag-red"></div>' +
          '<div class="flag-sun"></div>' +
        '</div>'
    },


    /* ---------- 02. LUPANG HINIRANG ---------- */
    anthem: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Lupang Hinirang',

      short:
        'The Philippine national anthem expresses love of country, freedom, courage, and devotion to the Filipino homeland.',

      history:
        'The music of Lupang Hinirang was composed by Julián Felipe in 1898. It was first performed during the proclamation of Philippine independence in Kawit, Cavite, on June 12, 1898, as an instrumental march known as Marcha Nacional Filipina. The lyrics were later based on the Spanish poem Filipinas written by José Palma. Republic Act No. 8491 provides the official rules concerning the national anthem, including the proper manner of singing and the prescribed musical arrangement.',

      meaning:
        'The anthem expresses deep love for the Philippines and the willingness of Filipinos to defend freedom and national dignity. Its words recall the beauty of the homeland and the sacrifices made for independence.',

      identity:
        'Lupang Hinirang is heard during flag ceremonies, government functions, school activities, sporting events, and other important occasions. Standing properly while the anthem is performed is a way of showing respect for the country and recognizing a shared Filipino identity.',

      image: 'assets/anthem.png',

      media:
        '<div class="symbol-emoji">🎵</div>'
    },


    /* ---------- 03. NATIONAL COAT OF ARMS ---------- */
    coat: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'National Coat of Arms',

      short:
        'The National Coat of Arms is an official heraldic emblem representing the Republic of the Philippines.',

      history:
        'The National Coat of Arms is used as an official heraldic symbol of the Philippine Republic. Its design incorporates elements also found on the national flag, including the golden sun and three stars. The Arms and Great Seal are defined under Executive Order No. 292 (Administrative Code of 1987), while Republic Act No. 8491 prescribes the official design and use of the national coat of arms and other heraldic symbols.',

      meaning:
        'The three stars represent Luzon, Visayas, and Mindanao, while the sun and its rays are connected to the country’s history of independence and revolution. The shield and its historical elements reflect important periods in Philippine history and the development of the Philippine state.',

      identity:
        'The coat of arms appears in official government settings and represents the authority and identity of the Republic of the Philippines. Unlike symbols used mainly in everyday culture, it is closely connected with the Philippine government and state institutions.',

      image: 'assets/coat-of-arms.jpg',

      media:
        '<div class="symbol-emoji">🛡️</div>'
    },


    /* ---------- 04. NATIONAL MOTTO ---------- */
    motto: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'National Motto',

      short:
        '“Maka-Diyos, Maka-tao, Makakalikasan at Makabansa” expresses four values associated with Filipino citizenship.',

      history:
        'The national motto of the Philippines is “Maka-Diyos, Maka-tao, Makakalikasan at Makabansa.” It is recognized under Executive Order No. 292 (Administrative Code of 1987) and is incorporated into the country’s official heraldic and civic identity.',

      meaning:
        'Maka-Diyos refers to faith and respect for God. Maka-tao emphasizes respect for human dignity and concern for other people. Makakalikasan highlights responsibility toward the environment, while Makabansa expresses love of and commitment to the country.',

      identity:
        'The motto presents a set of values that connect personal responsibility with community, environmental care, and patriotism. It is particularly visible in civic and educational settings where Filipino values and responsibilities are emphasized.',

      image: 'assets/motto.jpg',

      media:
        '<div class="symbol-emoji">📜</div>'
    },


    /* ---------- 05. FILIPINO LANGUAGE ---------- */
    language: {

      collection: 'official',

      category: 'National Language',

      title: 'Filipino',

      short:
        'Filipino is the national language of the Philippines and continues to develop through the country’s diverse linguistic heritage.',

      history:
        'The 1987 Constitution recognizes Filipino as the national language of the Philippines. It provides that Filipino shall be further developed and enriched on the basis of existing Philippine and other languages. Filipino and English are recognized as official languages for communication and instruction, subject to the provisions of law.',

      meaning:
        'Filipino serves as an important shared means of communication among people from different linguistic communities. It continues to evolve through interaction with other Philippine languages as well as languages introduced through historical contact.',

      identity:
        'Language carries stories, humor, expressions, traditions, and memories. Filipino provides a shared linguistic space while regional languages and dialects continue to contribute to the country’s rich cultural diversity.',

      image: 'assets/language.jpg',

      media:
        '<div class="symbol-emoji">🗣️</div>'
    },


    /* ---------- 06. PHILIPPINE EAGLE ---------- */
    eagle: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Philippine Eagle',

      short:
        'The Philippine Eagle is a rare bird of prey found only in the Philippines and serves as an important symbol of the country’s natural heritage.',

      history:
        'The Philippine Eagle was declared the national bird of the Philippines through Proclamation No. 615, s. 1995, issued by President Fidel V. Ramos on July 4, 1995. The proclamation cited the eagle’s uniqueness, strength, power, and love for freedom as qualities that “exemplify the Filipino people.” It is scientifically known as Pithecophaga jefferyi and is a natural treasure found only in the Philippines.',

      meaning:
        'The Philippine Eagle is associated with strength, freedom, uniqueness, and the richness of Philippine biodiversity. Its status as a threatened species also highlights the importance of protecting forests and other habitats.',

      identity:
        'The eagle has become an important symbol of Philippine environmental conservation. Protecting it is not only about preserving one species but also about protecting the forests and ecosystems that support many other forms of Philippine wildlife.',

      image: 'assets/eagle.jpg',

      media:
        '<svg viewBox="0 0 120 120" class="eagle-art">' +
          '<circle cx="60" cy="60" r="58" class="eagle-ring"/>' +
          '<path class="eagle-body" d="M60 30c-10 3-16 12-16 12s-14-4-22 4c8 2 12 8 12 8s-16 2-20 14c8-4 16-2 16-2s-8 10-4 22c4-8 10-12 10-12s2 12 12 18c-2-10 2-18 2-18s6 10 16 10c-6-8-6-16-6-16s10 6 20 2c-8-4-10-10-10-10s14-2 18-12c-8 2-14-2-14-2s10-8 8-18c-4 6-10 8-10 8s0-10-8-14c2 6-2 12-2 12s-6-8-16-6c4 4 4 10 4 10s-8-4-10 0z"/>' +
        '</svg>'
    },


    /* ---------- 07. SAMPAGUITA ---------- */
    sampaguita: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Sampaguita',

      short:
        'The sampaguita is the national flower of the Philippines, known for its small white flowers and distinctive fragrance.',

      history:
        'The sampaguita was declared the national flower of the Philippines through Proclamation No. 652, s. 1934, issued during the Commonwealth era by Governor-General Frank Murphy. The flower has long been familiar in Filipino communities and is commonly used in garlands, religious settings, ceremonies, and traditional welcoming practices.',

      meaning:
        'The sampaguita is commonly associated with purity, simplicity, humility, and devotion. Its small white flowers and pleasant fragrance have made it a familiar part of both religious and everyday Filipino life.',

      identity:
        'Sampaguita garlands can be seen in religious places, ceremonies, streets, and traditional welcoming practices. Because of its familiarity and simplicity, the flower remains closely connected to ordinary Filipino experiences and cultural traditions.',

      image: 'assets/sampaguita.jpg',

      media:
        '<svg viewBox="0 0 120 120" class="flower-art">' +
          '<g class="petals">' +
            '<ellipse cx="60" cy="30" rx="12" ry="22"/>' +
            '<ellipse cx="60" cy="30" rx="12" ry="22" transform="rotate(72 60 60)"/>' +
            '<ellipse cx="60" cy="30" rx="12" ry="22" transform="rotate(144 60 60)"/>' +
            '<ellipse cx="60" cy="30" rx="12" ry="22" transform="rotate(216 60 60)"/>' +
            '<ellipse cx="60" cy="30" rx="12" ry="22" transform="rotate(288 60 60)"/>' +
          '</g>' +
          '<circle cx="60" cy="60" r="9" class="flower-center"/>' +
        '</svg>'
    },


    /* ---------- 08. NARRA ---------- */
    narra: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Narra',

      short:
        'Narra is the national tree of the Philippines and is known for its durable hardwood and importance in Philippine forests and culture.',

      history:
        'Narra was declared the national tree of the Philippines through Proclamation No. 652, s. 1934, the same proclamation that declared the sampaguita as the national flower. The tree has long been valued for its durable timber and has been used for furniture, construction, flooring, and other wood products.',

      meaning:
        'The narra is associated with strength, durability, and endurance. Its hardwood qualities have contributed to its reputation as a tree capable of providing useful materials while also representing the strength of Philippine natural heritage.',

      identity:
        'Narra represents the connection between Filipino communities and the country’s forests. Its designation as a national tree also reminds Filipinos of the importance of responsible use and conservation of native trees and forest resources.',

      image: 'assets/narra.jpg',

      media:
        '<svg viewBox="0 0 120 120" class="tree-art">' +
          '<rect x="55" y="70" width="10" height="40" class="tree-trunk"/>' +
          '<circle cx="60" cy="55" r="34" class="tree-canopy"/>' +
          '<circle cx="38" cy="70" r="20" class="tree-canopy soft"/>' +
          '<circle cx="82" cy="70" r="20" class="tree-canopy soft"/>' +
        '</svg>'
    },


    /* ---------- 09. PHILIPPINE PEARL ---------- */
    pearl: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Philippine Pearl',

      short:
        'The Philippine pearl represents the natural wealth of the country’s seas and the importance of the Philippines’ marine resources.',

      history:
        'The Philippine Pearl was declared the national gem of the Philippines through Proclamation No. 905, s. 1996, issued by President Fidel V. Ramos. The South Sea pearl is associated with the country’s pearl-growing industry and marine resources, particularly in areas such as Palawan and other parts of the country with suitable marine environments.',

      meaning:
        'Pearls are valued for their natural formation, rarity, luster, and beauty. As a national symbol, the pearl can be understood in connection with the richness of Philippine waters and the country’s long relationship with the sea.',

      identity:
        'The pearl reflects the Philippines as an archipelago whose communities, livelihoods, food, trade, and traditions have long been connected to the ocean. It also highlights the importance of protecting marine ecosystems and resources.',

      image: 'assets/pearl.jpg',

      media:
        '<div class="symbol-emoji">🦪</div>'
    },


    /* ---------- 10. ARNIS ---------- */
    arnis: {

      collection: 'official',

      category: 'Official National Symbol',

      title: 'Arnis',

      short:
        'Arnis is the Philippines’ national martial art and sport, representing indigenous Filipino martial traditions, discipline, and skill.',

      history:
        'Republic Act No. 9850, approved on December 11, 2009, formally declares Arnis as the national martial art and sport of the Philippines. The law recognizes Arnis as an indigenous Filipino martial art characterized by swinging and twirling movements, along with striking, thrusting, and parrying techniques for defense and offense.',

      meaning:
        'Arnis represents discipline, coordination, adaptability, self-defense, and the preservation of indigenous Filipino knowledge. Its techniques demonstrate how Filipino martial traditions developed practical systems of movement and combat.',

      identity:
        'Arnis connects modern Filipinos with indigenous martial traditions that have been passed down through generations. Its recognition as a national martial art and sport also helps preserve and promote Filipino martial heritage in schools, competitions, and cultural communities.',

      image: 'assets/arnis.jpg',

      media:
        '<div class="symbol-emoji">🥋</div>'
    },


    /* =========================================================
       POPULAR FILIPINO SYMBOLS
       These are cultural/popular symbols, NOT officially
       designated national symbols.
       ========================================================= */


    /* ---------- 11. BANGUS ---------- */
    bangus: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Bangus',

      short:
        'Bangus, or milkfish, is one of the most familiar fish in Filipino food culture and an important part of Philippine aquaculture.',

      history:
        'Bangus has long been cultivated in Philippine fishponds and other aquaculture systems. It is widely sold in public markets and supermarkets and is prepared in many ways, including grilled, fried, smoked, and marinated. It is often called the “national fish” in popular references, but this is not the same as an official legal designation.',

      meaning:
        'Bangus represents Filipino food culture, fisheries, aquaculture, and the importance of aquatic resources to local livelihoods. It is also strongly connected to everyday family meals.',

      identity:
        'For many Filipinos, bangus is associated with familiar home-cooked food. Different regions prepare it in different ways, making it an example of how a common ingredient can become part of local food traditions.',

      image: 'assets/bangus.jpg',

      media:
        '<div class="symbol-emoji">🐟</div>',

      status: 'popular'
    },


    /* ---------- 12. CARABAO ---------- */
    carabao: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Carabao',

      short:
        'The carabao is strongly associated with Philippine farming, rural life, hard work, and agricultural communities.',

      history:
        'The water buffalo has long been used in Philippine agriculture for tasks such as preparing rice fields and transporting materials. Although machines and modern agricultural equipment have reduced dependence on animal labor in many areas, the carabao remains an important cultural image of rural life. It is widely known as the “national animal” in popular references, but it is not officially designated as such by law.',

      meaning:
        'The carabao is commonly associated with strength, patience, endurance, and hard work. These qualities have contributed to its long-standing image as a companion of farmers.',

      identity:
        'The carabao appears in Filipino stories, songs, artworks, school materials, and rural imagery. It represents the agricultural roots of many Filipino communities and the important role of farmers in society.',

      image: 'assets/carabao.jpg',

      media:
        '<div class="symbol-emoji">🐃</div>',

      status: 'popular'
    },


    /* ---------- 13. MANGO ---------- */
    mango: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Philippine Mango',

      short:
        'The Philippine mango, especially the Carabao mango, is widely celebrated for its sweetness and is strongly associated with Filipino food culture.',

      history:
        'Mangoes are widely grown in different parts of the Philippines. The Carabao mango is particularly well known and is consumed fresh or processed into products such as dried mangoes, preserves, and desserts. Mango is commonly called the national fruit in popular culture, although it is not included among the legally designated national symbols.',

      meaning:
        'The mango represents agriculture, tropical abundance, food culture, and the importance of locally grown produce. Its sweetness also contributes to its positive cultural image.',

      identity:
        'Fresh mangoes and dried mango products are familiar to Filipinos at home and abroad. Dried mangoes in particular are commonly brought as pasalubong, making the fruit part of the experience of sharing Filipino food with family and friends.',

      image: 'assets/mango.jpg',

      media:
        '<div class="symbol-emoji">🥭</div>',

      status: 'popular'
    },


    /* ---------- 14. BARONG TAGALOG ---------- */
    barong: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Barong Tagalog',

      short:
        'The Barong Tagalog is a traditional Filipino formal garment known for its lightweight fabric, embroidery, and distinctive appearance.',

      history:
        'The Barong Tagalog developed from Philippine clothing traditions and changed through different historical periods. Today it is commonly worn during formal occasions such as weddings, graduations, government ceremonies, and other important events. It is widely recognized as an important Filipino garment, although it should not automatically be described as a legally declared “national costume.”',

      meaning:
        'The Barong Tagalog represents Filipino craftsmanship, textile traditions, formality, and cultural heritage. Its lightweight construction is also well suited to the tropical climate of the Philippines.',

      identity:
        'The Barong Tagalog is often worn when Filipinos want to express cultural pride while participating in formal occasions. Its embroidery and traditional construction also showcase the skills of Filipino textile and clothing makers.',

      image: 'assets/barong.jpg',

      media:
        '<div class="symbol-emoji">👔</div>',

      status: 'popular'
    },


    /* ---------- 15. BARO'T SAYA ---------- */
    barot: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: "Baro't Saya",

      short:
        "The Baro't Saya is a traditional Filipino women's ensemble that reflects Philippine clothing traditions and changing historical influences.",

      history:
        "The term Baro't Saya refers to an ensemble traditionally composed of a blouse or baro and a skirt or saya. Its forms have changed across regions and historical periods, and related styles have been influenced by indigenous Philippine clothing and later cultural contact.",

      meaning:
        "The Baro't Saya represents traditional clothing, textile craftsmanship, modesty, and the variety of Philippine fashion traditions. Different versions can reflect regional materials, styles, and occasions.",

      identity:
        "The Baro't Saya remains visible during cultural celebrations, performances, heritage events, and other occasions where traditional Filipino clothing is presented. It helps preserve knowledge of earlier Filipino clothing practices.",

      image: 'assets/barot-saya.jpg',

      media:
        '<div class="symbol-emoji">👗</div>',

      status: 'popular'
    },


    /* ---------- 16. JOSE RIZAL ---------- */
    rizal: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'José Rizal',

      short:
        'José Rizal was a Filipino writer, physician, reformist, and one of the most important figures in Philippine national history.',

      history:
        'José Rizal was born in 1861 and was executed by the Spanish colonial government on December 30, 1896. His novels Noli Me Tangere and El Filibusterismo criticized abuses under Spanish colonial rule. His writings, ideas, and death contributed to the growth of Filipino nationalism. He is widely honored as a national hero, although there is no single law formally declaring him the sole official national hero. Republic Act No. 1425, commonly known as the Rizal Law, requires the study of his life, works, and writings in schools.',

      meaning:
        'Rizal is associated with education, intellectual courage, reform, nationalism, and love of country. His life is often studied as an example of how writing, education, and civic thought can influence society.',

      identity:
        'Rizal remains deeply present in Philippine education and public life. The Rizal Law ensures that generations of Filipinos continue to learn from his life and works.',

      image: 'assets/jose-rizal.jpg',

      media:
        '<div class="symbol-emoji">📖</div>',

      status: 'popular'
    },


    /* ---------- 17. ANAHAW ---------- */
    anahaw: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Anahaw',

      short:
        'Anahaw is a Philippine palm recognized for its broad fan-shaped leaves and traditional uses in crafts, roofing, and decoration.',

      history:
        'Anahaw refers to Livistona rotundifolia, a palm native to the Philippines. Its large fan-shaped leaves have traditionally been used for practical and decorative purposes, including roofing, fans, and handicrafts. It is sometimes called the “national leaf” in popular references, but it is not an officially designated national symbol.',

      meaning:
        'The anahaw represents the practical use of native plants and the resourcefulness of Filipino communities. Its large leaves are also visually associated with the tropical environment of the Philippines.',

      identity:
        'Anahaw is familiar in rural and provincial settings and can be seen in traditional materials and decorative designs.',

      image: 'assets/anahaw.jpg',

      media:
        '<div class="symbol-emoji">🌿</div>',

      status: 'popular'
    },


    /* ---------- 18. SIPA ---------- */
    sipa: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Sipa',

      short:
        'Sipa is a traditional Filipino game that tests balance, coordination, agility, and control.',

      history:
        'Sipa is played by keeping a small object in the air using the feet or other parts of the body. Traditional versions use objects such as a washer with attached material, while related forms have been played in different communities across the Philippines. It is sometimes called the “national game” in popular references, but this is not an official legal designation.',

      meaning:
        'The game emphasizes agility, balance, concentration, timing, and coordination. It also reflects the ability of communities to create enjoyable games using simple materials.',

      identity:
        'Sipa is remembered as a traditional Filipino childhood game and remains part of Philippine recreational heritage.',

      image: 'assets/sipa.jpg',

      media:
        '<div class="symbol-emoji">⚽</div>',

      status: 'popular'
    },


    /* ---------- 19. WALING-WALING ---------- */
    waling: {

      collection: 'popular',

      category: 'Popular Filipino Symbol',

      title: 'Waling-waling',

      short:
        'The waling-waling is a famous Philippine orchid valued for its large flowers and importance to Philippine botanical heritage.',

      history:
        'Waling-waling commonly refers to Vanda sanderiana, an orchid native to the Philippines and particularly associated with Mindanao. It has long been valued by horticulturists and orchid enthusiasts because of its large and attractive flowers. It is sometimes proposed as a national flower, but the sampaguita remains the official one.',

      meaning:
        'The waling-waling represents Philippine biodiversity, botanical beauty, and the importance of protecting native plant species and their natural habitats.',

      identity:
        'The orchid has become an important symbol of pride in Philippine plant diversity. It is also a reminder that the country’s natural heritage includes many species that require protection and responsible conservation.',

      image: 'assets/waling-waling.jpg',

      media:
        '<div class="symbol-emoji">🌺</div>',

      status: 'popular'
    }

  };


  /* =============================================================
     EXHIBITS PAGE — CATEGORY → VIEWER
     ============================================================= */

  const categorySelect = document.getElementById('categorySelect');
  const gallerySection = document.getElementById('gallery');
  const modalOverlay = document.getElementById('modalOverlay');
  const viewerBackdrop = document.getElementById('viewerBackdrop');

  if (
    categorySelect &&
    gallerySection &&
    modalOverlay &&
    viewerBackdrop
  ) {

    const viewerTitle =
      document.getElementById('viewerTitle');

    const viewerDesc =
      document.getElementById('viewerDesc');

    const viewerCollectionLabel =
      document.getElementById('viewerCollectionLabel');

    const viewerOpenBtn =
      document.getElementById('viewerOpenBtn');

    const viewerBackBtn =
      document.getElementById('viewerBackBtn');

    const viewerPrev =
      document.getElementById('viewerPrev');

    const viewerNext =
      document.getElementById('viewerNext');


    const collections = {

      official: [
        'flag',
        'anthem',
        'coat',
        'motto',
        'language',
        'eagle',
        'sampaguita',
        'narra',
        'pearl',
        'arnis'
      ],

      popular: [
        'bangus',
        'carabao',
        'mango',
        'barong',
        'barot',
        'rizal',
        'anahaw',
        'sipa',
        'waling'
      ]

    };


    const collectionLabels = {

      official:
        'Official National Symbols',

      popular:
        'Popular Filipino Symbols'

    };


    const modalMedia =
      document.getElementById('modalMedia');

    const modalCategory =
      document.getElementById('modalCategory');

    const modalTitle =
      document.getElementById('modalTitle');

    const modalStatus =
      document.getElementById('modalStatus');

    const modalHistory =
      document.getElementById('modalHistory');

    const modalMeaning =
      document.getElementById('modalMeaning');

    const modalIdentity =
      document.getElementById('modalIdentity');

    const modalClose =
      document.getElementById('modalClose');

    let lastFocusedEl = null;


    function buildMediaHTML(data) {

      if (data.image) {

        return (
          '<img ' +
            'src="' + data.image + '" ' +
            'alt="' + data.title + '" ' +
            'class="exhibit-photo" ' +

            'onerror="' +
              "this.style.display='none';" +
              "var f=this.nextElementSibling;" +
              "if(f){f.style.display='flex';}" +
            '"' +
          ' />' +

          '<div ' +
            'class="media-fallback" ' +
            'style="display:none;"' +
          '>' +
            data.media +
          '</div>'
        );

      }

      return (
        '<div ' +
          'class="media-fallback" ' +
          'style="display:flex;"' +
        '>' +
          data.media +
        '</div>'
      );

    }


    function openExhibit(key) {

      const data = exhibits[key];

      if (!data) {
        return;
      }


      modalMedia.innerHTML =
        buildMediaHTML(data);


      modalCategory.textContent =
        data.category;

      modalTitle.textContent =
        data.title;


      if (
        data.status === 'popular' ||
        data.collection === 'popular'
      ) {

        modalStatus.textContent =
          'Popular / Cultural — Not Official';

        modalStatus.className =
          'modal-status popular';

      } else {

        modalStatus.textContent =
          'Official National Symbol';

        modalStatus.className =
          'modal-status official';

      }


      modalHistory.textContent =
        data.history;

      modalMeaning.textContent =
        data.meaning;

      modalIdentity.textContent =
        data.identity;


      modalOverlay.classList.add('active');

      document.body.style.overflow =
        'hidden';


      lastFocusedEl =
        document.activeElement;


      if (modalClose) {
        modalClose.focus();
      }

    }


    function closeExhibit() {

      modalOverlay.classList.remove('active');

      document.body.style.overflow = '';


      if (lastFocusedEl) {
        lastFocusedEl.focus();
      }

    }


    if (modalClose) {

      modalClose.addEventListener(
        'click',
        closeExhibit
      );

    }


    const closeBtn =
      modalOverlay.querySelector(
        '.modal-close-btn'
      );

    if (closeBtn) {

      closeBtn.addEventListener(
        'click',
        closeExhibit
      );

    }


    modalOverlay.addEventListener(
      'click',
      function (e) {

        if (e.target === modalOverlay) {
          closeExhibit();
        }

      }
    );


    document.addEventListener(
      'keydown',
      function (e) {

        if (
          e.key === 'Escape' &&
          modalOverlay.classList.contains('active')
        ) {

          closeExhibit();

        }

      }
    );


    let activeCollection =
      'official';

    let current = 0;


    function renderViewer(index) {
      const order = collections[activeCollection];
      if (!order || order.length === 0) return;

      current = (index + order.length) % order.length;
      const key = order[current];
      const data = exhibits[key];
      if (!data) return;

      /* ---------- Update viewer content ---------- */
      viewerBackdrop.innerHTML = buildMediaHTML(data);
      viewerCollectionLabel.textContent = collectionLabels[activeCollection];
      viewerTitle.textContent = data.title;
      viewerDesc.textContent = data.short;

      /* ---------- Update progress indicator ---------- */
      const viewerProgress = document.getElementById('viewerProgress');
      if (viewerProgress) {
        const total = order.length;
        const currentNum = String(current + 1).padStart(2, '0');
        const totalNum = String(total).padStart(2, '0');
        viewerProgress.textContent = currentNum + ' / ' + totalNum;
      }

      /* ---------- Re-trigger caption stagger animation ---------- */
      const caption = document.querySelector('.viewer-caption');
      if (caption) {
        caption.classList.remove('animate');
        void caption.offsetWidth; /* Force reflow */
        caption.classList.add('animate');
      }
    }


    function enterCollection(category) {
      if (!collections[category]) return;
      activeCollection = category;
      current = 0;

      /* Hide category select */
      categorySelect.hidden = true;
      categorySelect.style.display = 'none';

      /* Show gallery */
      gallerySection.hidden = false;
      gallerySection.style.display = 'block';

      /* Add viewer-active class sa page-main */
      const pageMain = document.querySelector('.page-main');
      if (pageMain) {
        pageMain.classList.add('viewer-active');
      }

      renderViewer(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function backToCategories() {
      /* Hide gallery */
      gallerySection.hidden = true;
      gallerySection.style.display = 'none';

      /* Show category select */
      categorySelect.hidden = false;
      categorySelect.style.display = 'block';

      /* Remove viewer-active class */
      const pageMain = document.querySelector('.page-main');
      if (pageMain) {
        pageMain.classList.remove('viewer-active');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    function backToCategories() {

      gallerySection.hidden =
        true;

      categorySelect.hidden =
        false;


      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }


    document
      .querySelectorAll('.category-card')
      .forEach(function (card) {

        card.addEventListener(
          'click',
          function () {

            const category =
              card.getAttribute(
                'data-category'
              );

            enterCollection(category);

          }
        );

      });


    if (viewerBackBtn) {

      viewerBackBtn.addEventListener(
        'click',
        backToCategories
      );

    }


    if (viewerPrev) {

      viewerPrev.addEventListener(
        'click',
        function () {

          renderViewer(
            current - 1
          );

        }
      );

    }


    if (viewerNext) {

      viewerNext.addEventListener(
        'click',
        function () {

          renderViewer(
            current + 1
          );

        }
      );

    }


    if (viewerOpenBtn) {

      viewerOpenBtn.addEventListener(
        'click',
        function () {

          const order =
            collections[activeCollection];


          if (!order) {
            return;
          }


          const key =
            order[current];


          openExhibit(key);

        }
      );

    }


    document.addEventListener(
      'keydown',
      function (e) {

        if (
          gallerySection.hidden ||
          modalOverlay.classList.contains('active')
        ) {
          return;
        }


        if (e.key === 'ArrowLeft') {

          renderViewer(
            current - 1
          );

        }


        if (e.key === 'ArrowRight') {

          renderViewer(
            current + 1
          );

        }

      }
    );

  }


  /* =============================================================
     HISTORY PAGE — VERTICAL ALTERNATING TIMELINE
     ============================================================= */

  document
    .querySelectorAll('.history-item')
    .forEach(function (item) {

      const toggle =
        item.querySelector('.history-toggle');

      if (!toggle) {
        return;
      }

      toggle.addEventListener('click', function () {

        const isOpen =
          item.getAttribute('data-open') === 'true';

        document
          .querySelectorAll('.history-item')
          .forEach(function (i) {

            i.setAttribute('data-open', 'false');

            const otherToggle =
              i.querySelector('.history-toggle');

            if (otherToggle) {
              otherToggle.setAttribute(
                'aria-expanded',
                'false'
              );
            }

          });

        if (!isOpen) {

          item.setAttribute('data-open', 'true');

          toggle.setAttribute(
            'aria-expanded',
            'true'
          );

        } else {

          item.setAttribute('data-open', 'false');

          toggle.setAttribute(
            'aria-expanded',
            'false'
          );

        }

      });

    });


  /* =============================================================
     FILIPINO IDENTITY DATA — 8 values
     
     Sources:
     - NCCA/NEDA "Filipino Values for the Common Good: A Primer"
     - Philippine Development Plan (PDP) 2017-2022, Chapter 7
     - AmBisyon Natin 2040
     ============================================================= */

  const identityData = {

    bayanihan: {
      icon: '🤝',
      title: 'Bayanihan',
      image: 'assets/bayanihan.jpg',
      meaning:
        'Bayanihan is the Filipino spirit of communal unity and cooperation. It comes from the traditional practice of neighbors helping a family move their entire house — literally carrying it together to a new location. Today, bayanihan is seen in disaster response, community clean-ups, fundraising drives, and the everyday willingness of Filipinos to help one another without expecting anything in return. The NCCA/NEDA primer identifies this as part of “Shared Responsibility for the Common Good” (Pakikipagkapuwa), one of the 20 core Filipino values.'
    },

    family: {
      icon: '🏠',
      title: 'Family',
      image: 'assets/family.jpg',
      meaning:
        'Family occupies the center of Filipino social life. Extended families often remain closely connected even when relatives live in different households or far apart. Grandparents, aunts, uncles, and cousins play active roles in raising children and making decisions. Family gatherings, shared meals, and mutual support across generations keep these bonds strong. The NCCA/NEDA primer lists “Love for the Family and Community” (Pagmamahal sa Pamilya at Pamayanan) as a foundational Filipino value.'
    },

    respect: {
      icon: '🙏',
      title: 'Respect',
      image: 'assets/respect.jpg',
      meaning:
        'Respect is expressed in everyday Filipino language and gestures. Words like "po" and "opo" are used when speaking to elders or people in authority, and "pagmamano" — taking an elder\'s hand and pressing it gently to the forehead — is a common sign of respect. Respect also extends to how Filipinos treat guests, teachers, and community leaders. The NCCA/NEDA primer includes “Respecting and Upholding Human Rights” (Paggalang at Pagtaguyod sa Karapatang Pantao) as one of the core values.'
    },

    hospitality: {
      icon: '🍽️',
      title: 'Hospitality',
      image: 'assets/hospitality.jpg',
      meaning:
        'Filipino hospitality is one of the most recognizable traits of the culture. Guests are warmly welcomed, offered food and drink, and made to feel at home. Even when a visitor arrives unexpectedly, families often stretch a meal to include them. This generosity reflects a deeply held belief that welcoming others is a form of honor — and that no one should leave a Filipino home hungry or empty-handed.'
    },

    pakikipagkapwa: {
      icon: '🤲',
      title: 'Pakikipagkapwa',
      image: 'assets/pakikipagkapwa.jpg',
      meaning:
        'Pakikipagkapwa is a Filipino value rooted in the idea that every person shares a common humanity. It goes beyond simple politeness — it is the practice of treating others with genuine regard, empathy, and shared responsibility. It can be seen in small daily acts: helping a stranger, listening without judgment, or sharing what little one has. The NCCA/NEDA primer lists “Shared Responsibility for the Common Good” (Pakikipagkapuwa) as one of the 20 core Filipino values, emphasizing that dignity is inherent in every person.'
    },

    resilience: {
      icon: '🌾',
      title: 'Resilience',
      image: 'assets/resilience.jpg',
      meaning:
        'The Philippines has faced typhoons, earthquakes, economic hardships, and historical challenges. Through all of these, Filipino communities have shown a remarkable ability to recover, rebuild, and continue. Resilience is often expressed collectively — neighbors helping neighbors, families starting over, and entire towns coming together after a disaster. The NCCA/NEDA primer identifies “Resilience” (Katatagan) as one of the 20 core Filipino values, emphasizing the ability to withstand and recover from adversity.'
    },

    gratitude: {
      icon: '🙌',
      title: 'Gratitude',
      image: 'assets/gratitude.jpg',
      meaning:
        'Gratitude — "pagpapasalamat" in Filipino — is a value that runs through everyday life. It is expressed in words like "salamat," in the practice of remembering favors done by others, and in the custom of "utang na loob," a sense of debt of the heart that binds people together. Gratitude is also shown in religious devotion, family traditions, and the simple act of acknowledging kindness. It reflects an awareness that no one succeeds alone.'
    },

    country: {
      icon: '🇵🇭',
      title: 'Love for Country',
      image: 'assets/love-for-country.jpg',
      meaning:
        'Love for country — "pagmamahal sa bayan" — is expressed in many ways. It can be seen in respect for national symbols, participation in civic life, the preservation of Filipino culture, and concern for the welfare of fellow Filipinos. For millions of overseas Filipino workers, this love is carried in the language they speak, the food they cook, and the traditions they pass on to their children. The NCCA/NEDA primer lists “Love for Country” (Pagmamahal sa Bayan) as one of the 20 core Filipino values.'
    }

  };


  /* =============================================================
     IDENTITY MODAL
     ============================================================= */

  const identityModalOverlay =
    document.getElementById(
      'identityModalOverlay'
    );


  if (identityModalOverlay) {

    const identityModalMedia =
      document.getElementById(
        'identityModalMedia'
      );

    const identityModalTitle =
      document.getElementById(
        'identityModalTitle'
      );

    const identityModalMeaning =
      document.getElementById(
        'identityModalMeaning'
      );

    const identityModalClose =
      document.getElementById(
        'identityModalClose'
      );


    let lastIdentityFocusedEl =
      null;


    function openIdentity(key) {

      const data =
        identityData[key];


      if (!data) {
        return;
      }


      let mediaHTML = '';


      if (data.image) {

        mediaHTML =
          '<img ' +
            'src="' + data.image + '" ' +
            'alt="' + data.title + '" ' +
            'class="identity-photo" ' +
            'onerror="' +
              "this.style.display='none';" +
              "this.nextElementSibling.style.display='flex';" +
            '"' +
          ' />' +
          '<div class="identity-frame-fallback" style="display:none;">' +
            data.icon +
          '</div>';

      } else {

        mediaHTML =
          '<div class="identity-frame-fallback" style="display:flex;">' +
            data.icon +
          '</div>';

      }


      identityModalMedia.innerHTML =
        mediaHTML;


      identityModalTitle.textContent =
        data.title;


      identityModalMeaning.textContent =
        data.meaning;


      identityModalOverlay.classList.add(
        'active'
      );


      document.body.style.overflow =
        'hidden';


      lastIdentityFocusedEl =
        document.activeElement;


      if (identityModalClose) {
        identityModalClose.focus();
      }

    }


    function closeIdentity() {

      identityModalOverlay.classList.remove(
        'active'
      );


      document.body.style.overflow =
        '';


      if (lastIdentityFocusedEl) {
        lastIdentityFocusedEl.focus();
      }

    }


    document
      .querySelectorAll('.identity-frame')
      .forEach(function (card) {

        const key =
          card.getAttribute(
            'data-identity'
          );


        card.setAttribute(
          'tabindex',
          '0'
        );


        card.addEventListener(
          'click',
          function () {

            openIdentity(key);

          }
        );


        card.addEventListener(
          'keydown',
          function (e) {

            if (
              e.key === 'Enter' ||
              e.key === ' '
            ) {

              e.preventDefault();

              openIdentity(key);

            }

          }
        );

      });


    if (identityModalClose) {

      identityModalClose.addEventListener(
        'click',
        closeIdentity
      );

    }


    const identityCloseBtn =
      identityModalOverlay.querySelector(
        '.modal-close-btn'
      );


    if (identityCloseBtn) {

      identityCloseBtn.addEventListener(
        'click',
        closeIdentity
      );

    }


    identityModalOverlay.addEventListener(
      'click',
      function (e) {

        if (
          e.target ===
          identityModalOverlay
        ) {

          closeIdentity();

        }

      }
    );


    document.addEventListener(
      'keydown',
      function (e) {

        if (
          e.key === 'Escape' &&
          identityModalOverlay.classList.contains(
            'active'
          )
        ) {

          closeIdentity();

        }

      }
    );

  }


  /* =============================================================
     REFLECTION FORM — identity.html
     ============================================================= */

  const reflectionForm =
    document.getElementById(
      'reflectionForm'
    );

  const reflectionThanks =
    document.getElementById(
      'reflectionThanks'
    );


  if (
    reflectionForm &&
    reflectionThanks
  ) {

    reflectionForm.addEventListener(
      'submit',
      function (e) {

        e.preventDefault();


        const input =
          document.getElementById(
            'reflectionInput'
          );


        if (
          !input ||
          !input.value.trim()
        ) {

          return;

        }


        reflectionForm.style.display =
          'none';


        reflectionThanks.classList.add(
          'show'
        );

      }
    );

  }

  /* =============================================================
     PHASE 5: HISTORY PAGE ENHANCEMENTS
     ============================================================= */

  /* ---------- Animate Timeline Line on Load ---------- */
  const historyTimeline = document.querySelector('.history-timeline');

  if (historyTimeline) {

    /* Trigger line draw animation after page load */
    setTimeout(function () {
      historyTimeline.classList.add('line-drawn');
    }, 300);

    /* Observer para sa card slide-in */
    if ('IntersectionObserver' in window) {

      const historyObserver = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add('in-view');

            historyObserver.unobserve(entry.target);

          }

        });

      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      });

      document.querySelectorAll('.history-item').forEach(function (item) {
        historyObserver.observe(item);
      });

    } else {

      /* Fallback para sa lumang browsers */
      document.querySelectorAll('.history-item').forEach(function (item) {
        item.classList.add('in-view');
      });

    }
  }

});

  /* =============================================================
     PHASE 6: IDENTITY PAGE ENHANCEMENTS
     ============================================================= */

  /* ---------- Staggered Entrance Observer ---------- */
  const identityFrames = document.querySelectorAll('.identity-frame');

  if (identityFrames.length && 'IntersectionObserver' in window) {

    const identityObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          identityObserver.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    identityFrames.forEach(function (frame) {
      /* Add reveal class if wala pa */
      if (!frame.classList.contains('reveal')) {
        frame.classList.add('reveal');
      }
      identityObserver.observe(frame);
    });

  } else {

    /* Fallback */
    identityFrames.forEach(function (frame) {
      frame.classList.add('reveal', 'in-view');
    });

  }
  
    /* =============================================================
     PHASE 7: ABOUT PAGE ENHANCEMENTS
     ============================================================= */

  /* ---------- Sources Cards Staggered Observer ---------- */
  const sourcesCards = document.querySelectorAll('.sources-card');

  if (sourcesCards.length && 'IntersectionObserver' in window) {

    const sourcesObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          sourcesObserver.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    sourcesCards.forEach(function (card) {
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
      sourcesObserver.observe(card);
    });

  } else {

    sourcesCards.forEach(function (card) {
      card.classList.add('reveal', 'in-view');
    });

  }


  /* ---------- Section Divider Animation ---------- */
  const aboutProject = document.querySelector('.about-project');
  const sourcesSection = document.querySelector('.sources-section');

  if ('IntersectionObserver' in window) {

    const dividerObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('divider-drawn');
          dividerObserver.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    if (aboutProject) dividerObserver.observe(aboutProject);
    if (sourcesSection) dividerObserver.observe(sourcesSection);

  } else {

    if (aboutProject) aboutProject.classList.add('divider-drawn');
    if (sourcesSection) sourcesSection.classList.add('divider-drawn');

  }


  /* ---------- About Cards Stagger ---------- */
  const aboutCards = document.querySelectorAll('.about-cards .about-card');

  if (aboutCards.length && 'IntersectionObserver' in window) {

    const aboutObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          aboutObserver.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    aboutCards.forEach(function (card) {
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
      aboutObserver.observe(card);
    });

  } else {

    aboutCards.forEach(function (card) {
      card.classList.add('reveal', 'in-view');
    });

  }


  /* ---------- About Section Body Reveal ---------- */
  const aboutBodies = document.querySelectorAll('.about .section-body');

  if (aboutBodies.length && 'IntersectionObserver' in window) {

    const bodyObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          bodyObserver.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.15
    });

    aboutBodies.forEach(function (body) {
      if (!body.classList.contains('reveal')) {
        body.classList.add('reveal');
      }
      bodyObserver.observe(body);
    });

  } else {

    aboutBodies.forEach(function (body) {
      body.classList.add('reveal', 'in-view');
    });

  }