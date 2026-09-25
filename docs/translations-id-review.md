# Перевод на индонезийский: файл для вычитки

Таблицы собраны из кода командой `node scripts/build-id-review-doc.mjs`, поэтому всегда совпадают с сайтом.
Правки удобно присылать строками «было → стало»: Claude Code заменит их в `lib/dictionaries.ts` и файлах данных.

Тон перевода: вежливое «Anda». Не переводятся KAIFO, названия туров-продуктов (Traditional Boat, Beat Boat, ATV,
Enduro, Jeep Tours, Jet Ski, Harley Tours), географические названия и названия сервисов (WhatsApp, Instagram, Google).


## Метаданные страниц

| Ключ | EN | ID |
|---|---|---|
| `meta.homeTitle` | KAIFO: boat trips, surfing, ATV, jeep tours and day tours in Bali | KAIFO: trip kapal, surfing, ATV, tur jeep, dan wisata harian di Bali |
| `meta.homeDescription` | Boat trips, surfing, snorkeling, ATV, jeep and Harley tours, plus day tours across the island. Scenic, safe and real Bali experiences. | Trip kapal, surfing, snorkeling, ATV, tur jeep dan Harley, serta wisata harian keliling pulau. Pengalaman Bali yang indah, aman, dan apa adanya. |
| `meta.toursTitle` | Bali Tours: the Full Catalog | Tur Bali: katalog lengkap |
| `meta.toursDescription` | Ocean trips, off-road rides, day tours and guided rentals in Bali. Filter by activity, price and duration. | Trip laut, perjalanan off-road, wisata harian, dan sewa dengan pemandu di Bali. Saring menurut aktivitas, harga, dan durasi. |
| `meta.tourSuffix` | Book via WhatsApp. | Pesan via WhatsApp. |
| `meta.legalDescription` | This KAIFO document is being prepared. | Dokumen KAIFO ini sedang disiapkan. |

## Подписи для скринридеров

| Ключ | EN | ID |
|---|---|---|
| `a11y.skip` | Skip to content | Lewati ke konten |
| `a11y.openMenu` | Open menu | Buka menu |
| `a11y.closeMenu` | Close menu | Tutup menu |
| `a11y.mainNav` | Main navigation | Navigasi utama |
| `a11y.footerNav` | Site sections | Bagian situs |
| `a11y.language` | Site language | Bahasa situs |
| `a11y.breadcrumbs` | Breadcrumbs | Jejak navigasi |
| `a11y.newTab` | opens in a new tab | terbuka di tab baru |
| `a11y.toursList` | Tour list | Daftar tur |
| `a11y.categories` | Tour categories | Kategori tur |
| `a11y.gallery` | Tour photos | Foto tur |
| `a11y.closeCard` | Close card | Tutup kartu |

## Меню

| Ключ | EN | ID |
|---|---|---|
| `nav.stories` | Stories | Cerita |
| `nav.tours` | Tours | Tur |
| `nav.reviews` | Reviews | Ulasan |
| `nav.about` | About | Tentang Kami |
| `nav.contact` | Contact | Kontak |
| `nav.faq` | FAQ | Tanya Jawab |
| `nav.home` | Home | Beranda |

## Кнопки

| Ключ | EN | ID |
|---|---|---|
| `cta.book` | Book via WhatsApp | Pesan via WhatsApp |
| `cta.bookShort` | Book | Pesan |
| `cta.message` | Message on WhatsApp | Chat via WhatsApp |
| `cta.explore` | Explore tours | Lihat tur |
| `cta.exploreAll` | Explore all tours | Lihat semua tur |
| `cta.details` | Details | Detail |
| `cta.instagram` | Message on Instagram | Chat via Instagram |
| `cta.consult` | Get advice | Minta saran |

## Готовые сообщения в WhatsApp

| Ключ | EN | ID |
|---|---|---|
| `whatsapp.general` | Hello! I'd like to choose a tour in Bali | Halo! Saya ingin memilih tur di Bali |
| `whatsapp.question` | Hello! I have a question about your Bali tours | Halo! Saya ingin bertanya tentang tur Bali Anda |
| `whatsapp.consult` | Hello! Could you help me choose a tour in Bali? | Halo! Bisakah Anda membantu saya memilih tur di Bali? |
| `whatsapp.review` | Hello! I'd like to leave a review about my trip with KAIFO | Halo! Saya ingin menulis ulasan tentang perjalanan saya bersama KAIFO |

## Цены

| Ключ | EN | ID |
|---|---|---|
| `price.from` | from | mulai |
| `price.onRequest` | Price on request | Harga sesuai permintaan |
| `price.disclaimer` | Prices are for reference only | Harga hanya perkiraan |

## Первый экран

| Ключ | EN | ID |
|---|---|---|
| `hero.title` | All of Bali in one place | Seluruh Bali dalam satu tempat |
| `hero.subtitle` | Tours, activities, rentals and adventures | Tur, aktivitas, sewa, dan petualangan |
| `hero.captionLeft` | We plan each route so you remember it years later | Kami menyusun setiap rute agar Anda mengingatnya bertahun-tahun kemudian |
| `hero.captionRight` | The sunrise you almost slept through. The reef only locals know. | Matahari terbit yang nyaris Anda lewatkan. Karang yang hanya diketahui warga lokal. |
| `hero.scrollHint` | Scroll to explore | Gulir untuk menjelajah |

## Секция «Одна страна, сотни маршрутов»

| Ключ | EN | ID |
|---|---|---|
| `ride.title` | One island, hundreds of routes | Satu pulau, ratusan rute |
| `ride.intro` | Boats, jeeps, bikes and hiking trails. Choose how you want to see the island. | Kapal, jeep, motor, dan jalur pendakian. Pilih cara Anda melihat pulau ini. |
| `ride.sectors.ocean.title` | Ocean Trips | Trip Laut |
| `ride.sectors.ocean.caption` | Wooden boats, quiet coves, water you can see through | Kapal kayu, teluk yang tenang, air sebening kaca |
| `ride.sectors.offroad.title` | Off-Road Rides | Perjalanan Off-Road |
| `ride.sectors.offroad.caption` | Volcanic trails, jungle roads, dust and viewpoints | Jalur vulkanik, jalan hutan, debu, dan titik pandang |
| `ride.sectors.sunset.title` | Sunset Cruises | Pelayaran Senja |
| `ride.sectors.sunset.caption` | Dinner on deck, fire show, the sky doing its thing | Makan malam di dek, fire show, dan langit yang beraksi |
| `ride.sectors.rentals.title` | Guided Rentals | Sewa dengan Pemandu |
| `ride.sectors.rentals.caption` | Your own machine, a guide who knows the roads | Kendaraan Anda sendiri, pemandu yang hafal jalannya |

## Каталог и фильтры

| Ключ | EN | ID |
|---|---|---|
| `catalog.homeTitle` | Tours Worth Riding | Tur yang Layak Dijalani |
| `catalog.pageTitle` | Every Tour, Thought Through | Setiap Tur Dipikirkan Matang |
| `catalog.pageIntro` | {count} across Bali: ocean trips, off-road rides, day tours and guided rentals. | {count} di seluruh Bali: trip laut, perjalanan off-road, wisata harian, dan sewa dengan pemandu. |
| `catalog.all` | All | Semua |
| `catalog.filters.environment` | Setting | Suasana |
| `catalog.filters.environmentAny` | Any | Semua |
| `catalog.filters.water` | Water | Air |
| `catalog.filters.land` | Land | Darat |
| `catalog.filters.price` | Price | Harga |
| `catalog.filters.priceAny` | Any | Semua |
| `catalog.filters.priceUnder500` | Under 500K IDR | Di bawah Rp500 ribu |
| `catalog.filters.price500to1500` | 500K-1.5M IDR | Rp500 ribu - Rp1,5 juta |
| `catalog.filters.priceOver1500` | 1.5M IDR and up | Rp1,5 juta ke atas |
| `catalog.filters.priceOnRequest` | On request | Sesuai permintaan |
| `catalog.filters.duration` | Duration | Durasi |
| `catalog.filters.durationAny` | Any | Semua |
| `catalog.filters.hours` | A few hours | Beberapa jam |
| `catalog.filters.fullDay` | Full day | Seharian |
| `catalog.filters.extended` | More than a day | Lebih dari sehari |
| `catalog.filters.sort` | Sort | Urutkan |
| `catalog.filters.popular` | Popular | Populer |
| `catalog.filters.priceAsc` | Price: low to high | Harga: rendah ke tinggi |
| `catalog.filters.priceDesc` | Price: high to low | Harga: tinggi ke rendah |
| `catalog.filters.reset` | Reset filters | Atur ulang filter |
| `catalog.clearCollection` | Clear collection | Hapus pilihan |
| `catalog.emptyTitle` | No tours match these filters | Tidak ada tur yang cocok dengan filter ini |
| `catalog.emptyText` | Try different filters or message us and we will put a route together for you. | Coba filter lain atau hubungi kami, dan kami akan menyusun rute untuk Anda. |

## Страница тура

| Ключ | EN | ID |
|---|---|---|
| `tour.duration` | Duration | Durasi |
| `tour.difficulty` | Difficulty | Tingkat kesulitan |
| `tour.price` | Price | Harga |
| `tour.category` | Category | Kategori |
| `tour.difficultyLevels.easy` | Easy | Mudah |
| `tour.difficultyLevels.medium` | Moderate | Sedang |
| `tour.difficultyLevels.hard` | Challenging | Menantang |
| `tour.difficultyLevels.unknown` | Ask our manager | Tanya manajer kami |
| `tour.includes` | What's included | Termasuk dalam paket |
| `tour.variants` | Another route in this tour | Rute lain dalam tur ini |
| `tour.gallery` | What it looks like | Seperti ini suasananya |
| `tour.related` | More tours like this | Tur serupa lainnya |
| `tour.badgeNew` | New | Baru |
| `tour.consultTitle` | Not sure what to choose? | Belum yakin memilih yang mana? |
| `tour.consultText` | We will tell you which tour suits you, help with dates and put together a plan around your wishes. | Kami akan menyarankan tur yang cocok untuk Anda, membantu soal tanggal, dan menyusun rencana sesuai keinginan Anda. |

## О нас и «Почему KAIFO?»

| Ключ | EN | ID |
|---|---|---|
| `about.kicker` | About us | Tentang kami |
| `about.lead` | We're a team of expats and Indonesians for whom Bali isn't just a travel destination — it's home. | Kami tim ekspatriat dan orang Indonesia yang menganggap Bali bukan sekadar tujuan wisata — ini rumah kami. |
| `about.paragraphs` | We've lived here for more than five years, travel around the island a lot and try different routes, activities and places ourselves. Along the way we learned a simple thing: popular isn't always best, and the most vivid experiences are often far from where standard guidebooks lead. | Kami sudah lebih dari lima tahun tinggal di sini, sering berkeliling pulau, dan mencoba sendiri berbagai rute, aktivitas, dan tempat. Dari situ kami belajar hal sederhana: yang populer belum tentu yang terbaik, dan pengalaman paling berkesan sering berada jauh dari jalur panduan wisata biasa. |
| `about.paragraphs` | That's how KAIFO was born — a wish to share the Bali we love ourselves. We only pick what we'd happily go to ourselves and would recommend to our friends without a second thought. | Begitulah KAIFO lahir — dari keinginan berbagi Bali yang kami cintai sendiri. Kami hanya memilih yang akan kami datangi sendiri dan kami rekomendasikan kepada teman tanpa ragu. |
| `about.quote` | Our idea is simple: fewer tourist clichés — more real Bali, emotions and pure “kaif” from travelling. | Ide kami sederhana: lebih sedikit klise turis — lebih banyak Bali yang sebenarnya, emosi, dan “kaif” murni dari perjalanan. |
| `about.why.title` | Why KAIFO? | Mengapa KAIFO? |
| `about.why.intro` | KAIFO comes from the word “kaif” — that very feeling when everything falls into place and you simply feel good. | KAIFO berasal dari kata “kaif” — perasaan ketika semuanya pas dan Anda merasa senang begitu saja. |

## Секция историй

| Ключ | EN | ID |
|---|---|---|
| `stories.title` | We create routes for the moments you'll want to remember | Kami merancang rute untuk momen yang ingin Anda kenang |
| `stories.intro` | We build every route around the moment that stays with you after the trip. | Setiap rute kami susun di sekitar momen yang tetap tinggal setelah perjalanan berakhir. |
| `stories.stack.title` | Moments from our routes | Momen dari perjalanan kami |
| `stories.stack.guestBadge` | Guest story | Cerita tamu |
| `stories.stack.momentBadge` | From the route | Dari perjalanan |
| `stories.stack.viewTour` | View tour | Lihat tur |
| `stories.stack.pause` | Pause stories | Jeda cerita |
| `stories.stack.play` | Play stories | Putar cerita |
| `stories.stack.prev` | Previous story | Cerita sebelumnya |
| `stories.stack.next` | Next story | Cerita berikutnya |
| `stories.stack.position` | Story {index} of {total} | Cerita {index} dari {total} |

## Отзывы

| Ключ | EN | ID |
|---|---|---|
| `reviews.kicker` | Reviews | Ulasan |
| `reviews.title` | What our guests say | Kata tamu kami |
| `reviews.ratingBadge` | ★ {value} on Google · {count} reviews | ★ {value} di Google · {count} ulasan |
| `reviews.leaveReview` | Leave a review | Tulis ulasan |
| `reviews.emptyText` | Been on a trip with us? Tell others how it went. | Sudah pernah ikut perjalanan bersama kami? Ceritakan pengalaman Anda. |
| `reviews.rated` | Rated {rating} out of 5 | Dinilai {rating} dari 5 |
| `reviews.badge` | Guest review | Ulasan tamu |
| `reviews.translatedFrom` | Translated from the original | Diterjemahkan dari versi asli |
| `reviews.showOriginal` | Show original | Lihat versi asli |
| `reviews.showTranslation` | Show translation | Lihat terjemahan |
| `reviews.stackTitle` | Guest reviews | Ulasan tamu |
| `reviews.pause` | Pause reviews | Jeda ulasan |
| `reviews.play` | Play reviews | Putar ulasan |
| `reviews.prev` | Previous review | Ulasan sebelumnya |
| `reviews.next` | Next review | Ulasan berikutnya |
| `reviews.position` | Review {index} of {total} | Ulasan {index} dari {total} |
| `reviews.viewTour` | View tour | Lihat tur |
| `reviews.original` | Original | Versi asli |
| `reviews.translated` | Translated by Google | Diterjemahkan oleh Google |
| `reviews.fromGoogle` | Reviews from Google | Ulasan dari Google |
| `reviews.mapTitle` | KAIFO on Google Maps | KAIFO di Google Maps |
| `reviews.place` | KAIFO · Bali | KAIFO · Bali |
| `reviews.openMap` | Open in Google Maps | Buka di Google Maps |
| `reviews.directions` | Get directions | Lihat rute |

## Вопросы и ответы

| Ключ | EN | ID |
|---|---|---|
| `faq.title` | Questions Before You Go | Pertanyaan Sebelum Berangkat |
| `faq.stillQuestions` | Still have questions? We're here. | Masih ada pertanyaan? Kami siap membantu. |
| `faq.items.q` | Do I need experience for surfing, ATV or enduro? | Apakah saya perlu pengalaman untuk surfing, ATV, atau enduro? |
| `faq.items.a` | It depends on the route. Surfing is done in small groups with a guide, and ATV tours come with a guide too. For enduro and motorcycle tours, talk your riding experience through with our manager first so they can match the route to your level. | Tergantung rutenya. Surfing berlangsung dalam grup kecil bersama pemandu, dan tur ATV juga selalu didampingi pemandu. Untuk enduro dan tur motor, ceritakan dulu pengalaman berkendara Anda kepada manajer kami agar rutenya disesuaikan dengan kemampuan Anda. |
| `faq.items.q` | What is included in the price? | Apa saja yang termasuk dalam harga? |
| `faq.items.a` | Every tour page has a “What's included” list, such as gear, a guide, transfer or food. Prices on the site are for reference only, and our manager confirms the exact price before you book. | Setiap halaman tur punya daftar “Termasuk dalam paket”, misalnya perlengkapan, pemandu, transfer, atau makan. Harga di situs hanya perkiraan, dan manajer kami memastikan harga pastinya sebelum Anda memesan. |
| `faq.items.q` | How do I pay: prepayment or on the day? | Bagaimana cara membayar: di muka atau pada hari tur? |
| `faq.items.a` | Payment terms depend on the tour. Our manager will share them on WhatsApp before you confirm your booking. | Ketentuan pembayaran berbeda untuk tiap tur. Manajer kami akan menjelaskannya lewat WhatsApp sebelum pesanan Anda dikonfirmasi. |
| `faq.items.q` | Can I bring my children? | Bolehkah saya mengajak anak-anak? |
| `faq.items.a` | Age requirements depend on the tour: ATV, enduro and volcano climbs ask more of you than boat trips and day tours. Tell us your children's ages and our manager will suggest suitable options. | Batas usia tergantung turnya: ATV, enduro, dan pendakian gunung menuntut lebih banyak dibandingkan trip kapal dan wisata harian. Beri tahu usia anak Anda, dan manajer kami akan menyarankan pilihan yang sesuai. |
| `faq.items.q` | What happens if the weather is bad? | Bagaimana kalau cuacanya buruk? |
| `faq.items.a` | Safety comes first. If the weather makes a route unsafe, our manager will contact you with options: another date or another route. | Keselamatan lebih dulu. Kalau cuaca membuat sebuah rute tidak aman, manajer kami akan menghubungi Anda dengan pilihan lain: ganti tanggal atau ganti rute. |
| `faq.items.q` | How do you pick me up from my hotel? | Bagaimana penjemputan dari hotel saya? |
| `faq.items.a` | Transfer is included in many tours, as noted on each tour page. When you book, send us your hotel or villa address and our manager will agree on the pickup time and place. | Transfer sudah termasuk di banyak tur, seperti tertulis di setiap halaman tur. Saat memesan, kirimkan alamat hotel atau vila Anda, dan manajer kami akan menyepakati waktu serta tempat penjemputan. |
| `faq.items.q` | What should I bring? | Apa yang perlu saya bawa? |
| `faq.items.a` | The main gear for each activity is included, for example fishing gear or climbing gear for Mount Agung. Bring sunscreen, water and comfortable clothes, plus a warm layer for sunrise climbs: it gets cool at the summit. | Perlengkapan utama untuk tiap aktivitas sudah termasuk, misalnya alat pancing atau perlengkapan pendakian Gunung Agung. Bawalah tabir surya, air minum, dan pakaian yang nyaman, ditambah jaket hangat untuk pendakian subuh: di puncak udaranya dingin. |
| `faq.items.q` | How do I reach my guide on the day of the tour? | Bagaimana saya menghubungi pemandu pada hari tur? |
| `faq.items.a` | Message us on WhatsApp at +62 851-9010-1270. Our manager will send you the guide's contact and meeting details before the trip. | Hubungi kami lewat WhatsApp di +62 851-9010-1270. Manajer kami akan mengirimkan kontak pemandu dan detail titik temu sebelum perjalanan. |

## Форма «Спланируйте поездку»

| Ключ | EN | ID |
|---|---|---|
| `plan.title` | Plan Your Bali Trip | Rencanakan Perjalanan Bali Anda |
| `plan.subtitle` | Tell us what you're dreaming of, and we'll shape the route around you | Ceritakan apa yang Anda impikan, dan kami susun rutenya untuk Anda |
| `plan.name` | Name | Nama |
| `plan.namePlaceholder` | How should we call you | Kami memanggil Anda siapa |
| `plan.dates` | Travel dates | Tanggal perjalanan |
| `plan.dateFrom` | From | Dari |
| `plan.dateTo` | To | Sampai |
| `plan.tourType` | Which tour are you interested in | Tur mana yang Anda minati |
| `plan.tourTypes.ocean` | Ocean | Laut |
| `plan.tourTypes.offroad` | Off-Road | Off-Road |
| `plan.tourTypes.sunset` | Sunset Cruise | Pelayaran Senja |
| `plan.tourTypes.dayTours` | Day Tours | Wisata Harian |
| `plan.tourTypes.rides` | Guided Rentals | Sewa dengan Pemandu |
| `plan.tourTypes.unsure` | Not sure yet | Belum tahu |
| `plan.submit` | Send via WhatsApp | Kirim via WhatsApp |
| `plan.helper` | WhatsApp will open with a ready-made message. Sending it doesn't commit you to anything. | WhatsApp akan terbuka dengan pesan yang sudah siap. Mengirimnya tidak mengikat Anda pada apa pun. |
| `plan.replyTime` | We usually reply within 10-15 minutes | Biasanya kami membalas dalam 10-15 menit |
| `plan.errorName` | Please tell us your name | Mohon tuliskan nama Anda |
| `plan.errorDates` | The end date can't be earlier than the start date | Tanggal selesai tidak boleh lebih awal dari tanggal mulai |
| `plan.datesRange` | {from} - {to} | {from} - {to} |
| `plan.dateFromOnly` | from {from} | dari {from} |
| `plan.dateToOnly` | until {to} | sampai {to} |
| `plan.sent` | Your message is ready. If WhatsApp didn't open, | Pesan Anda sudah siap. Kalau WhatsApp tidak terbuka, |
| `plan.openWhatsapp` | use this link | gunakan tautan ini |
| `plan.message.greeting` | Hello! My name is {name}. | Halo! Nama saya {name}. |
| `plan.message.dates` | Travel dates: {dates}. | Tanggal perjalanan: {dates}. |
| `plan.message.type` | Interested in: {type}. | Saya tertarik dengan: {type}. |

## Футер

| Ключ | EN | ID |
|---|---|---|
| `footer.tagline` | Scenic, safe and real Bali experiences, from ocean trips to off-road adventures | Pengalaman Bali yang indah, aman, dan apa adanya, dari trip laut sampai petualangan off-road |
| `footer.navTitle` | Sections | Bagian |
| `footer.contactsTitle` | Contacts | Kontak |
| `footer.legalTitle` | Documents | Dokumen |
| `footer.disclaimer` | Information on this site is for reference only and does not constitute a public offer. Prices are for reference only and are confirmed by our manager before booking. | Informasi di situs ini hanya bersifat perkiraan dan bukan penawaran resmi. Harga hanya perkiraan dan dipastikan oleh manajer kami sebelum pemesanan. |
| `footer.rights` | All rights reserved | Hak cipta dilindungi |

## Юридические страницы

| Ключ | EN | ID |
|---|---|---|
| `legal.documents.privacy` | Privacy Policy | Kebijakan Privasi |
| `legal.documents.offer` | Public Offer | Penawaran Publik |
| `legal.documents.cookies` | Cookie Policy | Kebijakan Cookie |
| `legal.pending` | This document is being prepared and will be published on this page. | Dokumen ini sedang disiapkan dan akan diterbitkan di halaman ini. |
| `legal.contact` | For questions, email | Untuk pertanyaan, kirim email ke |

## Страница 404

| Ключ | EN | ID |
|---|---|---|
| `notFound.title` | Page not found | Halaman tidak ditemukan |
| `notFound.text` | The link may be out of date, or the tour has moved to another section. | Tautannya mungkin sudah usang, atau turnya pindah ke bagian lain. |
| `notFound.home` | Back to home | Kembali ke beranda |

## Туры: кикеры, описания, длительность, что включено

| Поле | EN | ID |
|---|---|---|
| `` | On request | Sesuai permintaan |
| `` | 1 day | 1 hari |
| `` | Ocean | Laut |
| `` | Off-road | Off-Road |
| `` | Day Tours | Wisata Harian |
| `` | Rides | Sewa Kendaraan |
| `kicker` | 01 / Ocean | 01 / Laut |
| `lead` | Sunset and evening cruises on a traditional boat, with dinner on board, live music and a fire show. | Pelayaran senja dan malam dengan perahu tradisional, lengkap dengan makan malam di kapal, musik live, dan fire show. |
| `durationLabel` | Evening cruise | Pelayaran malam |
| `includes[0]` | Sunset or evening cruise | Pelayaran senja atau malam |
| `includes[1]` | Dinner on board | Makan malam di kapal |
| `includes[2]` | Live music | Musik live |
| `includes[3]` | Fire show | Fire show |
| `kicker` | 02 / Ocean | 02 / Laut |
| `lead` | A three-hour cruise with swim stops. On board: a bar, a DJ and a tower for jumping into the sea. | Pelayaran tiga jam dengan berhenti untuk berenang. Di kapal: bar, DJ, dan menara untuk melompat ke laut. |
| `durationLabel` | 3 hours | 3 jam |
| `includes[0]` | 3-hour cruise | Pelayaran 3 jam |
| `includes[1]` | Swim stops | Berhenti untuk berenang |
| `includes[2]` | Bar and DJ on board | Bar dan DJ di kapal |
| `includes[3]` | Jumping tower | Menara lompat |
| `includes[4]` | Day trip 10:00-13:00 or evening trip 15:00-18:30 | Trip siang 10.00-13.00 atau trip sore 15.00-18.30 |
| `kicker` | 03 / Ocean | 03 / Laut |
| `lead` | Ocean fishing in two formats, local or professional. Gear and food are included in the price. | Memancing di laut dalam dua pilihan, lokal atau profesional. Perlengkapan dan makanan sudah termasuk dalam harga. |
| `includes[0]` | Local fishing trip | Trip memancing lokal |
| `includes[1]` | Professional fishing trip | Trip memancing profesional |
| `includes[2]` | Fishing gear | Perlengkapan pancing |
| `includes[3]` | Food | Makanan |
| `kicker` | 04 / Ocean | 04 / Laut |
| `lead` | Surfing on secret beaches, in small groups and with a guide. | Surfing di pantai-pantai rahasia, dalam grup kecil dan bersama pemandu. |
| `includes[0]` | Spots on secret beaches | Spot di pantai rahasia |
| `includes[1]` | Small groups | Grup kecil |
| `includes[2]` | Guide | Pemandu |
| `kicker` | 05 / Ocean | 05 / Laut |
| `lead` | Snorkeling at standard spots or a premium trip to see manta rays. The longest option is a full day on Nusa Penida. | Snorkeling di spot standar atau trip premium untuk melihat pari manta. Pilihan terpanjang: seharian penuh di Nusa Penida. |
| `durationLabel` | Up to 9 hours | Sampai 9 jam |
| `includes[0]` | Standard spots | Spot standar |
| `includes[1]` | Premium trip with manta rays | Trip premium dengan pari manta |
| `includes[2]` | Full day on Nusa Penida, about 9 hours | Seharian di Nusa Penida, sekitar 9 jam |
| `lead` | A full day on Nusa Penida: snorkeling with manta rays plus the island's main viewpoints, Kelingking Cliff and Broken Beach. | Seharian penuh di Nusa Penida: snorkeling bersama pari manta plus titik pandang utama pulau ini, Kelingking Cliff dan Broken Beach. |
| `durationLabel` | 1 day, about 9 hours | 1 hari, sekitar 9 jam |
| `includes[0]` | Snorkeling with manta rays | Snorkeling bersama pari manta |
| `includes[1]` | Kelingking Cliff | Kelingking Cliff |
| `includes[2]` | Broken Beach | Broken Beach |
| `includes[3]` | Return boat transfer | Transfer kapal pulang pergi |
| `includes[4]` | Guide | Pemandu |
| `kicker` | 01 / Off-road | 01 / Off-Road |
| `lead` | ATV routes from 1 to 4 hours, with new vehicles, a guide and transfer. | Rute ATV dari 1 sampai 4 jam, dengan kendaraan baru, pemandu, dan transfer. |
| `durationLabel` | 1-4 hours | 1-4 jam |
| `includes[0]` | Routes from 1 to 4 hours | Rute dari 1 sampai 4 jam |
| `includes[1]` | New vehicles | Kendaraan baru |
| `includes[2]` | Guide | Pemandu |
| `includes[3]` | Transfer | Transfer |
| `kicker` | 02 / Off-road | 02 / Off-Road |
| `lead` | Enduro rides on the Kintamani, Tabanan and Secret Forest routes on Yamaha, Honda and KTM bikes. | Perjalanan enduro di rute Kintamani, Tabanan, dan Secret Forest dengan motor Yamaha, Honda, dan KTM. |
| `includes[0]` | Yamaha, Honda and KTM bikes | Motor Yamaha, Honda, dan KTM |
| `includes[1]` | Kintamani route | Rute Kintamani |
| `includes[2]` | Tabanan route | Rute Tabanan |
| `includes[3]` | Secret Forest route | Rute Secret Forest |
| `kicker` | 03 / Off-road | 03 / Off-Road |
| `lead` | Jeep tours to sunrises and volcanoes. Routes: Batur and Kintamani, Ubud, Jatiluwih and Bedugul, Munduk. | Tur jeep ke matahari terbit dan gunung berapi. Rute: Batur dan Kintamani, Ubud, Jatiluwih dan Bedugul, Munduk. |
| `includes[0]` | Sunrise by the volcano | Matahari terbit di dekat gunung berapi |
| `includes[1]` | Batur / Kintamani route | Rute Batur / Kintamani |
| `includes[2]` | Ubud route | Rute Ubud |
| `includes[3]` | Jatiluwih / Bedugul route | Rute Jatiluwih / Bedugul |
| `includes[4]` | Munduk route | Rute Munduk |
| `lead` | A jeep safari across the frozen lava fields of Mount Batur: sunrise, breakfast and a swim in natural hot springs. No hiking involved. | Safari jeep melintasi hamparan lava beku Gunung Batur: matahari terbit, sarapan, dan berendam di sumber air panas alami. Tanpa mendaki. |
| `includes[0]` | Sunrise at a viewpoint | Matahari terbit di titik pandang |
| `includes[1]` | Jeep ride over black lava | Perjalanan jeep di atas lava hitam |
| `includes[2]` | Breakfast or lunch | Sarapan atau makan siang |
| `includes[3]` | Hot springs | Sumber air panas |
| `note` | Unlike Batur Sunrise Trekking, there is no hike: the whole route is by jeep. A good fit if you are not up for trekking. | Berbeda dengan Batur Sunrise Trekking, di sini tidak ada pendakian: seluruh rute ditempuh dengan jeep. Cocok kalau Anda tidak ingin trekking. |
| `kicker` | 01 / Rides | 01 / Sewa Kendaraan |
| `lead` | Jet ski rides from 30 minutes to 6 hours. Locations: Sanur, Jimbaran, Nusa Dua and Uluwatu. | Jet ski dari 30 menit sampai 6 jam. Lokasi: Sanur, Jimbaran, Nusa Dua, dan Uluwatu. |
| `durationLabel` | 30 min - 6 h | 30 menit - 6 jam |
| `includes[0]` | Rides from 30 minutes to 6 hours | Sesi dari 30 menit sampai 6 jam |
| `includes[1]` | Sanur or Jimbaran | Sanur atau Jimbaran |
| `includes[2]` | Nusa Dua or Uluwatu | Nusa Dua atau Uluwatu |
| `kicker` | 02 / Rides | 02 / Sewa Kendaraan |
| `lead` | Harley-Davidson tours with five models to choose from, a guide on the route, and photos and video of the ride. | Tur Harley-Davidson dengan lima model pilihan, pemandu sepanjang rute, serta foto dan video perjalanan. |
| `includes[0]` | 5 models: Dyna, Sportster, Fat Bob, Heritage, Softail | 5 model: Dyna, Sportster, Fat Bob, Heritage, Softail |
| `includes[1]` | Guide | Pemandu |
| `includes[2]` | Photos and video | Foto dan video |
| `kicker` | 01 / Day Tours | 01 / Wisata Harian |
| `lead` | A one-day cultural route through the heart of Bali: rice terraces, temples and craft villages. The route is built around your interests, with several combinations of locations to choose from. | Rute budaya sehari melewati jantung Bali: terasering, pura, dan desa kerajinan. Rutenya disusun sesuai minat Anda, dengan beberapa kombinasi lokasi yang bisa dipilih. |
| `includes[0]` | Private guide and transfer for the whole day | Pemandu pribadi dan transfer seharian |
| `includes[1]` | Tegallalang rice terraces | Terasering Tegallalang |
| `includes[2]` | A temple complex of your choice | Kompleks pura pilihan Anda |
| `includes[3]` | Craft villages (silver, wood, batik) | Desa kerajinan (perak, kayu, batik) |
| `includes[4]` | 4 location combinations to choose from | 4 kombinasi lokasi yang bisa dipilih |
| `kicker` | 02 / Day Tours | 02 / Wisata Harian |
| `lead` | A hike to the summit of Mount Batur in the dark to watch the sunrise above the clouds, followed by the descent, breakfast and a swim in natural hot springs. | Pendakian ke puncak Gunung Batur dalam gelap untuk menyaksikan matahari terbit di atas awan, lalu turun, sarapan, dan berendam di sumber air panas alami. |
| `durationLabel` | 1 day, night start | 1 hari, berangkat malam |
| `includes[0]` | Trekking guide, flashlights, transfer | Pemandu trekking, lampu senter, transfer |
| `includes[1]` | Sunrise ascent | Pendakian menuju matahari terbit |
| `includes[2]` | Breakfast at the summit | Sarapan di puncak |
| `includes[3]` | Hot springs swim after the descent | Berendam air panas setelah turun |
| `difficultyNote` | about 2 hours of uphill hiking | sekitar 2 jam pendakian menanjak |
| `kicker` | 03 / Day Tours | 03 / Wisata Harian |
| `lead` | A climb to Bali's highest point at 3,145 metres. For those who want a bigger challenge than Batur: a view over the whole island with sunrise at the summit. | Pendakian ke titik tertinggi di Bali, 3.145 meter. Untuk Anda yang ingin tantangan lebih besar daripada Batur: pemandangan seluruh pulau dengan matahari terbit di puncak. |
| `durationLabel` | 1.5 days, night departure | 1,5 hari, berangkat malam |
| `includes[0]` | Experienced guide, climbing gear | Pemandu berpengalaman, perlengkapan pendakian |
| `includes[1]` | Transfer and night-start logistics | Transfer dan pengaturan keberangkatan malam |
| `includes[2]` | Sunrise at 3,145 m | Matahari terbit di ketinggian 3.145 m |
| `includes[3]` | Panoramic views over the whole island | Pemandangan panorama seluruh pulau |
| `difficultyNote` | requires good fitness | butuh kondisi fisik yang baik |
| `kicker` | 04 / Day Tours | 04 / Wisata Harian |
| `lead` | A journey into Bali's spiritual side: a Melukat purification ceremony at a holy spring and a visit to one of the island's main temples. | Perjalanan ke sisi spiritual Bali: upacara penyucian Melukat di mata air suci dan kunjungan ke salah satu pura utama pulau ini. |
| `includes[0]` | Melukat ceremony (ritual water purification) | Upacara Melukat (ritual penyucian dengan air) |
| `includes[1]` | Visit to a major temple complex | Kunjungan ke kompleks pura besar |
| `includes[2]` | Traditional sarong for entering the temple | Kain sarung tradisional untuk masuk pura |
| `includes[3]` | A guide who knows the cultural context of the ceremonies | Pemandu yang memahami latar budaya upacaranya |
| `kicker` | 05 / Day Tours | 05 / Wisata Harian |
| `lead` | The most scenic spots of East Bali in one day: the famous Gates of Heaven, water palaces and a viewpoint facing Mount Agung. | Tempat-tempat terindah di Bali Timur dalam sehari: Gerbang Surga (Pura Lempuyang) yang terkenal, taman air, dan titik pandang menghadap Gunung Agung. |
| `includes[0]` | Gates of Heaven at Lempuyang | Gerbang Surga (Pura Lempuyang) |
| `includes[1]` | Tirta Gangga water palace | Taman air Tirta Gangga |
| `includes[2]` | Viewpoint facing Mount Agung | Titik pandang menghadap Gunung Agung |
| `includes[3]` | Transfer and guide for the whole day | Transfer dan pemandu seharian |
| `kicker` | 06 / Day Tours | 06 / Wisata Harian |
| `lead` | A one-day route around the southern Bukit Peninsula: a dream beach, a beach club with a glass pool above the ocean, Indonesia's tallest statue and sunset at a clifftop temple. | Rute sehari keliling Semenanjung Bukit di selatan: pantai impian, beach club dengan kolam kaca di atas laut, patung tertinggi di Indonesia, dan matahari terbenam di pura di atas tebing. |
| `includes[0]` | One of the peninsula's best beaches | Salah satu pantai terbaik di semenanjung ini |
| `includes[1]` | Beach club with an infinity or glass pool | Beach club dengan kolam infinity atau kolam kaca |
| `includes[2]` | Garuda Wisnu Kencana statue | Patung Garuda Wisnu Kencana |
| `includes[3]` | Sunset at the clifftop Uluwatu Temple | Matahari terbenam di Pura Uluwatu di atas tebing |
| `kicker` | 07 / Day Tours | 07 / Wisata Harian |
| `lead` | A trip to the north of the island: a morning boat ride to wild dolphins in the open sea and a swim at one of Bali's most scenic waterfalls. | Perjalanan ke utara pulau: naik perahu pagi-pagi menemui lumba-lumba liar di laut lepas dan berenang di salah satu air terjun terindah di Bali. |
| `durationLabel` | 1 day, early start | 1 hari, berangkat pagi buta |
| `includes[0]` | Morning boat trip to see dolphins | Trip perahu pagi untuk melihat lumba-lumba |
| `includes[1]` | Waterfall visit and swim | Kunjungan dan berenang di air terjun |
| `includes[2]` | Transfer and guide for the whole day | Transfer dan pemandu seharian |
| `kicker` | 08 / Day Tours | 08 / Wisata Harian |
| `lead` | A two-day route around Nusa Lembongan and Nusa Ceningan: signature spots, snorkeling and kayaking. | Rute dua hari keliling Nusa Lembongan dan Nusa Ceningan: spot andalan, snorkeling, dan kayak. |
| `durationLabel` | 2 days / 1 night | 2 hari / 1 malam |
| `includes[0]` | Signature island spots | Spot andalan pulau |
| `includes[1]` | Snorkeling | Snorkeling |
| `includes[2]` | Kayaking | Kayak |
| `kicker` | Sumba | Sumba |
| `lead` |  |  |
| `durationLabel` | 3 days / 2 nights | 3 hari / 2 malam |

## Карточки историй и сцен с маршрутов

| Поле | EN | ID |
|---|---|---|
| `author` | — KAIFO guest | — Tamu KAIFO |
| `text` | We planned just a week in Bali, but every day turned out completely different. Snorkeling, a trip to the volcano, ATVs, a sunset on a boat — and never the feeling that we were rushing anywhere. That's probably how we'll remember Bali most. | Kami hanya berencana seminggu di Bali, tetapi setiap hari ternyata benar-benar berbeda. Snorkeling, perjalanan ke gunung berapi, ATV, matahari terbenam di atas kapal — dan tidak sekali pun terasa terburu-buru. Mungkin begitulah Bali akan paling kami kenang. |
| `text` | The sun slips into the sea, dinner is served on deck, and the fire show begins as the first stars come out. | Matahari turun ke laut, makan malam disajikan di dek, dan fire show dimulai saat bintang pertama muncul. |
| `text` | Music on deck, a swim stop in clear water, and a jump from the platform that everyone takes sooner or later. | Musik di dek, berhenti berenang di air jernih, dan lompatan dari menara yang cepat atau lambat dicoba semua orang. |
| `text` | An early start, a calm sea, the first bite — and lunch on board while the line waits for the next one. | Berangkat pagi buta, laut yang tenang, sambaran pertama — lalu makan siang di kapal sementara pancing menunggu yang berikutnya. |
| `text` | A quiet spot away from the crowds, a guide who reads the waves, and a first ride you'll talk about all evening. | Spot tenang jauh dari keramaian, pemandu yang paham ombak, dan ombak pertama yang akan Anda ceritakan sepanjang malam. |
| `text` | You put your face in the water and, if the ocean is kind, a manta glides past below — slowly, as if it has all day. | Anda benamkan wajah ke air dan, kalau laut sedang baik, seekor pari manta melintas pelan di bawah, seolah punya waktu seharian. |
| `text` | Mud splashes, open trails, and laughter nobody can hear over the engines. | Cipratan lumpur, jalur terbuka, dan tawa yang tenggelam oleh suara mesin. |
| `text` | Black volcanic sand under the wheels in Kintamani, then forest roads where the only sound is your engine. | Pasir vulkanik hitam Kintamani di bawah roda, lalu jalan hutan tempat yang terdengar hanya mesin Anda sendiri. |
| `text` | Headlights in the dark, a climb up the slope, and the sun rising over Batur right in front of you. | Lampu sorot dalam gelap, tanjakan di lereng — dan matahari terbit di atas Batur tepat di depan Anda. |
| `text` | Open water, spray in your face, and the Bali coastline flying past at full throttle. | Laut lepas, cipratan air di wajah, dan garis pantai Bali yang melesat melewati Anda. |
| `text` | Morning roads, the low rumble of the engine, and a guide who knows exactly where to stop for the view. | Jalan pagi, deru mesin yang rendah, dan pemandu yang tahu persis di mana harus berhenti demi pemandangan. |
| `text` | The terraces of Tegallalang in soft morning light, then a quiet temple courtyard and artisans at work. | Terasering Tegallalang dalam cahaya pagi yang lembut, lalu halaman pura yang tenang dan para perajin yang sedang bekerja. |
| `text` | Two hours up in the dark by torchlight — and then the clouds below you turn pink. | Dua jam mendaki dalam gelap dengan lampu kepala — lalu awan di bawah Anda berubah merah muda. |
| `text` | The island's highest summit, and at sunrise all of Bali lies below you. | Puncak tertinggi di pulau ini, dan saat matahari terbit seluruh Bali terhampar di bawah Anda. |
| `text` | Cool spring water pouring over you during the Melukat ritual, and a stillness you don't expect in the middle of the day. | Air mata air yang dingin mengguyur Anda dalam ritual Melukat, dan ketenangan yang tak Anda duga di tengah hari. |
| `text` | The Gates of Heaven framing Mount Agung, then the pools and fountains of Tirta Gangga. | Gerbang Surga (Pura Lempuyang) membingkai Gunung Agung, lalu kolam dan air mancur Tirta Gangga. |
| `text` | A turquoise beach below the cliffs, a pool above the ocean, and sunset at Uluwatu temple. | Pantai tosca di bawah tebing, kolam di atas laut, dan matahari terbenam di Pura Uluwatu. |
| `text` | Dawn on the water, eyes on the surface for fins, then a cold waterfall swim that wakes you up for good. | Fajar di laut, mata mencari sirip di permukaan, lalu air terjun dingin yang membuat Anda benar-benar terjaga. |

## Отзывы гостей (перевод, оригинал остаётся на своём языке)

| Поле | EN | ID |
|---|---|---|
| `author` | Lilia Golubina | Lilia Golubina |
| `text` | A great boat trip - everything was organized perfectly. My friends really liked it, so many impressions. Thank you 😻 | Trip kapal yang luar biasa - semuanya diatur dengan sempurna. Teman-teman saya sangat suka, banyak sekali kesannya. Terima kasih 😻 |
| `author` | Andrey Antonov | Andrey Antonov |
| `text` | The sunrise hike up Batur is a must-do in Bali! 🌋 We started before dawn and walked for about two hours with headlamps — easier than it sounds, the trail is well marked and the guide kept everyone motivated. At the top: an incredible sunrise above the clouds with the crater right in front of you. Worth every minute of that 2 a.m. climb. For breakfast they even serve eggs cooked in volcanic steam — a fun little detail. Overall great organization, guides who clearly know the route, hotel transfer both ways included. Strongly recommend it if you want to see one unforgettable sunrise on your whole trip 🌅 | Pendakian matahari terbit ke Batur wajib dilakukan di Bali! 🌋 Kami berangkat sebelum fajar dan berjalan sekitar dua jam dengan lampu kepala — lebih mudah daripada yang dibayangkan, jalurnya jelas dan pemandu terus menyemangati semua orang. Di puncak: matahari terbit yang luar biasa di atas awan dengan kawah tepat di depan mata. Setiap menit pendakian pukul dua pagi itu sepadan. Saat sarapan bahkan disajikan telur yang direbus dengan uap vulkanik — detail kecil yang menyenangkan. Secara keseluruhan pengaturannya bagus, pemandunya jelas hafal rute, dan transfer dari hotel pulang pergi sudah termasuk. Sangat direkomendasikan kalau Anda ingin melihat satu matahari terbit yang tak terlupakan sepanjang perjalanan Anda 🌅 |
| `author` | Stanislav Morozov | Stanislav Morozov |
| `text` | Hi, the fishing was fire, I'm happier than elephants ever get, huge thanks, wishing you well-being and prosperity, expect me back soon!!! | Halo, mancingnya mantap, saya puas sampai gajah pun tidak sepuas itu, terima kasih banyak, semoga sejahtera dan makmur, tunggu saya, saya akan datang lagi!!! |
| `author` | Alexandr Gridin | Alexandr Gridin |
| `text` | A great experience, we went fishing with the family, everything was very Cool!!! Big thanks to the organizers. | Pengalaman yang luar biasa, kami sekeluarga pergi memancing, semuanya sangat Keren!!! Terima kasih banyak kepada penyelenggaranya. |
| `author` | johnny lullaby | johnny lullaby |
| `text` | Stopped by the guys for a fishing trip, the fishing was superb! Big thanks to KAIFO Bali!! | Mampir ke teman-teman untuk memancing, hasil mancingnya luar biasa! Terima kasih banyak KAIFO Bali!! |

## Alt-тексты фотографий

| Поле | EN | ID |
|---|---|---|
| `hero` | A wooden boat by the shore at sunset | Perahu kayu di tepi pantai saat matahari terbenam |
| `sunset-boats` | Traditional boats at sunset off the coast of Bali | Perahu tradisional saat senja di lepas pantai Bali |
| `traditional-boat` | A traditional boat on a Bali beach at sunset | Perahu tradisional di pantai Bali saat matahari terbenam |
| `boat-dusk` | Boats at dusk on calm water in Bali | Perahu saat senja di air yang tenang di Bali |
| `beat-boat` | Jumping from a boat into the sea | Melompat dari perahu ke laut |
| `boat-turquoise` | A boat in a turquoise sea seen from above | Perahu di laut tosca dilihat dari atas |
| `fishing` | A boat in the open ocean seen from above | Perahu di laut lepas dilihat dari atas |
| `fishing-boats` | Fishing boats on the ocean at sunset | Perahu nelayan di laut saat matahari terbenam |
| `surfing` | Surfers riding waves off the coast of Bali | Peselancar menaiki ombak di lepas pantai Bali |
| `surf-wave` | A surfer about to ride a wave barrel | Peselancar bersiap masuk ke dalam ombak |
| `bukit-cliffs` | The green Balangan cliffs above the ocean | Tebing hijau Balangan di atas laut |
| `snorkeling` | Snorkeling in clear sea water | Snorkeling di air laut yang jernih |
| `manta` | A manta ray swimming through sunlit water | Pari manta berenang di air yang disinari matahari |
| `reef` | Clear water over a coral reef | Air jernih di atas terumbu karang |
| `kelingking` | Kelingking Beach on Nusa Penida from above | Pantai Kelingking di Nusa Penida dari atas |
| `atv` | An ATV among Bali's rice fields | ATV di antara sawah Bali |
| `atv-river` | An ATV crossing a river | ATV menyeberangi sungai |
| `ubud-terraces` | Tegallalang rice terraces and palm trees | Terasering Tegallalang dan pohon kelapa |
| `enduro` | An enduro bike on a forest trail | Motor enduro di jalur hutan |
| `enduro-trail` | A rider on a dirt bike | Pengendara di atas motor trail |
| `batur-crater` | Mount Batur and its caldera from above | Gunung Batur dan kalderanya dari atas |
| `jeep` | Jeeps on an off-road trail in Bali | Jeep di jalur off-road di Bali |
| `jeep-volcano` | A jeep near a steaming volcano | Jeep di dekat gunung berapi yang berasap |
| `batur-sunrise` | Sunrise over Mount Batur | Matahari terbit di atas Gunung Batur |
| `jet-ski` | A jet ski on the open sea | Jet ski di laut lepas |
| `jet-ski-aerial` | A jet ski on turquoise water seen from above | Jet ski di air tosca dilihat dari atas |
| `uluwatu` | Uluwatu Temple on a cliff above the ocean | Pura Uluwatu di tebing di atas laut |
| `harley` | Riding a Harley-Davidson on the road | Berkendara dengan Harley-Davidson di jalan raya |
| `coastal-ride` | A motorcycle on a winding road through Bali's greenery | Motor di jalan berkelok di antara hijaunya Bali |
| `riders-sunset` | Motorcyclists silhouetted against the sunset sky in Bali | Siluet pengendara motor di langit senja Bali |
| `ubud-craft` | A Balinese wood carver at work | Pengukir kayu Bali sedang bekerja |
| `ubud-gate` | A carved temple gateway in Ubud | Gerbang pura berukir di Ubud |
| `agung-sunrise` | Mount Agung above the clouds at sunrise | Gunung Agung di atas awan saat matahari terbit |
| `agung-clouds` | Mount Agung and palm trees at sunrise | Gunung Agung dan pohon kelapa saat matahari terbit |
| `agung-gates` | Temple gates with Mount Agung in the distance | Gerbang pura dengan Gunung Agung di kejauhan |
| `purification` | A water purification ritual at temple spouts | Ritual penyucian diri di pancuran pura |
| `water-temple` | A temple reflected in a sacred spring | Pura yang terpantul di mata air suci |
| `lempuyang` | The Gates of Heaven at Lempuyang Temple | Gerbang Surga di Pura Lempuyang |
| `tirta-gangga` | Tirta Gangga water palace from above | Taman air Tirta Gangga dari atas |
| `gwk` | The Garuda Wisnu Kencana statue | Patung Garuda Wisnu Kencana |
| `dolphins` | Dolphins in the open sea seen from above | Lumba-lumba di laut lepas dilihat dari atas |
| `waterfall` | Sekumpul waterfall in the Bali jungle | Air terjun Sekumpul di hutan Bali |
| `waterfall-twin` | Waterfalls in Bali's tropical jungle | Air terjun di hutan tropis Bali |
| `story` | Travelers watching the sunrise over Mount Batur | Wisatawan menyaksikan matahari terbit di Gunung Batur |

## Адрес точки

| Поле | EN | ID |
|---|---|---|
| `embedSrc` | Ithon Mart Kuruksetra, Jl. Kuruksetra, Benoa, Kuta Selatan, Badung Regency, Bali 80361, Indonesia | Ithon Mart Kuruksetra, Jl. Kuruksetra, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali 80361, Indonesia |

## Места, где я сомневался

- **«Sewa Kendaraan» для категории Rides.** В английской версии это «Rides» — прокат техники с пемanду.
  Возможно, ближе «Sewa dengan Pemandu», но для бейджа категории это длинно.
- **«Trip kapal» против «Perjalanan dengan perahu».** Выбрал короткое «trip», как в разговорной речи балийских операторов.
- **«Wisata Harian» для Day Tours.** Альтернатива — «Tur Harian»; выбрал «Wisata», чтобы не путалось с «Tur» в меню.
- **«Fire show» оставил как есть** — на Бали так и пишут в программах, но можно заменить на «pertunjukan api».
- **«Spot» в описаниях серфинга и снорклинга** — англицизм, привычный в туризме; заменить на «lokasi», если режет глаз.
- **«Jeda / Putar» для паузы и продолжения показа карточек** — короткие формы для кнопок, проверьте на слух.
- **«Gerbang Surga (Pura Lempuyang)»** — как в промте; в тексте тура и в карточке момента одинаково.
- **Шутка в отзыве Станислава** («доволен так как слоны не бывают довольны») передана смыслом:
  «saya puas sampai gajah pun tidak sepuas itu». Дословный перевод звучал бы странно.
- **«Anda» во всех текстах гостей.** В отзывах гость говорит о себе, поэтому там «saya», а обращение «Anda»
  осталось только в текстах от лица KAIFO.
