import { ReadingItem } from '../types';

export const SAMPLE_READINGS: ReadingItem[] = [
  {
    id: 'sample-a1-market',
    created_at: new Date().toISOString(),
    title_ar: 'يَوْمٌ فِي السُّوقِ التَّقْلِيدِيِّ',
    title_id: 'Suatu Hari di Pasar Tradisional',
    topic: 'Kehidupan Sehari-hari & Belanja',
    level: 'A1',
    style: 'cerita_naratif',
    length_preset: '1_page',
    target_word_count: 280,
    actual_word_count: 275,
    grammar_level: 'A1',
    grammar_language: 'ar_id',
    show_harakat_default: true,
    transliteration_enabled: true,
    summary: 'Kisah pendek tentang Ahmad yang pergi ke pasar tradisional di pagi hari untuk membeli sayuran, buah-buahan segar, dan rempah-rempah bersama ayahnya.',
    full_text_harakat: 'فِي صَبَاحِ يَوْمِ العُطْلَةِ، اسْتَيْقَظَ أَحْمَدُ مُبَكِّرًا وَذَهَبَ مَعَ وَالِدِهِ إِلَى السُّوقِ المَرْكَزِيِّ. كَانَ الجَوُّ لَطِيفًا وَالشَّمْسُ مُشْرِقَةً. وَصَلَ أَحْمَدُ إِلَى السُّوقِ، فَوَجَدَ النَّاسَ يَشْتَرُونَ الفَوَاكِهَ الطَّازَجَةَ وَالخُضْرَاوَاتِ اللَّذِيذَةَ. قَالَ الوَالِدُ لِلبَائِعِ: "بِكَمْ كِيلُو التُّفَّاحِ؟" أَجَابَ البَائِعُ بِابْتِسَامَةٍ: "التُّفَّاحُ بِعَشَرَةِ دَرَاهِمَ يَا سَيِّدِي". اشْتَرَى الوَالِدُ تُفَّاحًا وَبُرْتُقَالًا وَعِنَبًا، ثُمَّ تَوَجَّهَ مَعَ ابْنِهِ إِلَى دُكَّانِ التَّوَابِلِ. رَائِحَةُ النَّعْنَاعِ وَالزَّعْفَرَانِ مَلَأَتِ المَكَانَ. كَانَ أَحْمَدُ سَعِيدًا جِدًّا بِهَذِهِ التَّجْرِبَةِ البَسِيطَةِ وَالمُمْتِعَةِ.',
    full_text_gundul: 'في صباح يوم العطلة، استيقظ أحمد مبكرا وذهب مع والده إلى السوق المركزي. كان الجو لطيفا والشمس مشرقة. وصل أحمد إلى السوق، فوجد الناس يشترون الفواكه الطازجة والخضراوات اللذيذة. قال الوالد للبائع: "بكم كيلو التفاح؟" أجاب البائع بابتسامة: "التفاح بعشرة دراهم يا سيدي". اشترى الوالد تفاحا وبرتقالا وعنبا، ثم توجه مع ابنه إلى دكان التوابل. رائحة النعناع والزعفران ملأت المكان. كان أحمد سعيدا جدا بهذه التجربة البسيطة والممتعة.',
    paragraphs: [
      {
        id: 1,
        ar_harakat: 'فِي صَبَاحِ يَوْمِ العُطْلَةِ، اسْتَيْقَظَ أَحْمَدُ مُبَكِّرًا وَذَهَبَ مَعَ وَالِدِهِ إِلَى السُّوقِ المَرْكَزِيِّ. كَانَ الجَوُّ لَطِيفًا وَالشَّمْسُ مُشْرِقَةً.',
        ar_gundul: 'في صباح يوم العطلة، استيقظ أحمد مبكرا وذهب مع والده إلى السوق المركزي. كان الجو لطيفا والشمس مشرقة.',
        id_translation: 'Pada pagi hari libur, Ahmad bangun pagi-pagi dan pergi bersama ayahnya ke pasar pusat. Udaranya sejuk dan matahari bersinar terang.'
      },
      {
        id: 2,
        ar_harakat: 'وَصَلَ أَحْمَدُ إِلَى السُّوقِ، فَوَجَدَ النَّاسَ يَشْتَرُونَ الفَوَاكِهَ الطَّازَجَةَ وَالخُضْرَاوَاتِ اللَّذِيذَةَ. قَالَ الوَالِدُ لِلبَائِعِ: "بِكَمْ كِيلُو التُّفَّاحِ؟" أَجَابَ البَائِعُ بِابْتِسَامَةٍ: "التُّفَّاحُ بِعَشَرَةِ دَرَاهِمَ يَا سَيِّدِي".',
        ar_gundul: 'وصل أحمد إلى السوق، فوجد الناس يشترون الفواكه الطازجة والخضراوات اللذيذة. قال الوالد للبائع: "بكم كيلو التفاح؟" أجاب البائع بابتسامة: "التفاح بعشرة دراهم يا سيدي".',
        id_translation: 'Ahmad sampai di pasar, lalu mendapati orang-orang sedang membeli buah-buahan segar dan sayur-mayur yang lezat. Sang ayah berkata kepada penjual: "Berapa harga satu kilo apel?" Penjual menjawab dengan senyuman: "Apel sepuluh dirham, Tuan."'
      },
      {
        id: 3,
        ar_harakat: 'اشْتَرَى الوَالِدُ تُفَّاحًا وَبُرْتُقَالًا وَعِنَبًا، ثُمَّ تَوَجَّهَ مَعَ ابْنِهِ إِلَى دُكَّانِ التَّوَابِلِ. رَائِحَةُ النَّعْنَاعِ وَالزَّعْفَرَانِ مَلَأَتِ المَكَانَ. كَانَ أَحْمَدُ سَعِيدًا جِدًّا بِهَذِهِ التَّجْرِبَةِ البَسِيطَةِ وَالمُمْتِعَةِ.',
        ar_gundul: 'اشترى الوالد تفاحا وبرتقالا وعنبا، ثم توجه مع ابنه إلى دكان التوابل. رائحة النعناع والزعفران ملأت المكان. كان أحمد سعيدا جدا بهذه التجربة البسيطة والممتعة.',
        id_translation: 'Sang ayah membeli apel, jeruk, dan anggur, kemudian menuju bersama putranya ke toko rempah-rempah. Aroma daun mint dan kuma-kuma (za\'faran) memenuhi tempat itu. Ahmad sangat gembira dengan pengalaman sederhana dan menyenangkan ini.'
      }
    ],
    vocabulary: [
      {
        word_ar: 'اسْتَيْقَظَ',
        word_clean: 'استيقظ',
        word_id: 'Bangun tidur',
        root: 'ي - ق - ظ (y-q-zh)',
        pos: 'فِعْلٌ مَاضٍ (Fi\'il Madhi)',
        wazan: 'اِسْتَفْعَلَ (Istaf\'ala)',
        meaning_detail: 'Terbangun dari tidur dalam keadaan sadar.',
        transliteration: 'Istaiqadha',
        nahwu_note: 'Mabni \'alal Fath'
      },
      {
        word_ar: 'مُبَكِّرًا',
        word_clean: 'مبكرا',
        word_id: 'Pagi-pagi / Lebih awal',
        root: 'ب - ك - ر (b-k-r)',
        pos: 'ظَرْفُ زَمَانٍ / حَالٌ (Zharf Zaman / Hal)',
        wazan: 'مُفَعِّل (Mufa\'\'il)',
        meaning_detail: 'Waktu di awal pagi hari sebelum matahari meninggi.',
        transliteration: 'Mubakkiran',
        nahwu_note: 'Manshub bil Fathah'
      },
      {
        word_ar: 'السُّوقِ',
        word_clean: 'السوق',
        word_id: 'Pasar',
        root: 'س - و - ق (s-w-q)',
        pos: 'اِسْمٌ مَجْرُورٌ (Isim Majrur)',
        wazan: 'فُعُول / فَعْل',
        meaning_detail: 'Tempat bertemunya penjual dan pembeli untuk bertransaksi.',
        transliteration: 'As-Suuq',
        nahwu_note: 'Majrur bi harfil jar (Ila)'
      },
      {
        word_ar: 'الطَّازَجَةَ',
        word_clean: 'الطازجة',
        word_id: 'Segar / Fresh',
        root: 'ط - ز - ج (pinjaman/mu\'arrab)',
        pos: 'نَعْتٌ / صِفَةٌ (Na\'at / Sifat)',
        wazan: 'فَاعِلَة',
        meaning_detail: 'Kondisi makanan atau buah yang baru dipetik dan belum layu.',
        transliteration: 'Ath-Thazijah',
        nahwu_note: 'Na\'at tabi\' lil man\'ut manshub'
      },
      {
        word_ar: 'اشْتَرَى',
        word_clean: 'اشترى',
        word_id: 'Membeli',
        root: 'ش - ر - ي (sy-r-y)',
        pos: 'فِعْلٌ مَاضٍ (Fi\'il Madhi)',
        wazan: 'اِفْتَعَلَ (Ifta\'ala)',
        meaning_detail: 'Mengambil barang dengan menukarkan sejumlah uang.',
        transliteration: 'Isytaraa',
        nahwu_note: 'Mabni \'alal fath al-muqaddar'
      },
      {
        word_ar: 'التَّوَابِلِ',
        word_clean: 'التوابل',
        word_id: 'Rempah-rempah / Bumbu',
        root: 'ت - ب - ل (t-b-l)',
        pos: 'مُضَافٌ إِلَيْهِ (Mudhaf Ilaih)',
        wazan: 'فَوَاعِل (Fawa\'il)',
        meaning_detail: 'Bahan herbal aromatik penyedap masakan.',
        transliteration: 'At-Tawabil',
        nahwu_note: 'Majrur bil kasrah'
      }
    ],
    grammar_analysis: [
      {
        id: 'g-1',
        title: 'Jumlah Fi\'liyyah Dasar (الجملة الفعلية)',
        category: 'nahwu',
        rule_ar: 'الجُمْلَةُ الفِعْلِيَّةُ تَتَكَوَّنُ مِنْ فِعْلٍ وَفَاعِلٍ (مِثْلُ: اسْتَيْقَظَ أَحْمَدُ)',
        rule_id: 'Jumlah Fi\'liyyah tersusun dari kata kerja (Fi\'il) dan pelaku (Fa\'il). Fa\'il berstatus Marfu\' dengan tanda dhammah.',
        example_ar: 'اسْتَيْقَظَ أَحْمَدُ مُبَكِّرًا',
        example_id: 'Ahmad bangun pagi-pagi.',
        explanation: 'Kata "اسْتَيْقَظَ" adalah Fi\'il Madhi, dan "أَحْمَدُ" adalah Fa\'il (pelaku tindakan) yang berharakat dhammah di akhirnya.',
        transliteration: 'Istaiqadha Ahmadu mubakkiran'
      },
      {
        id: 'g-2',
        title: 'Kāna wa Akhawātuhā (كان وأخواتها)',
        category: 'nahwu',
        rule_ar: 'كَانَ تَدْخُلُ عَلَى المُبْتَدَأِ وَالخَبَرِ، فَتَرْفَعُ الأَوَّلَ وَيُسَمَّى اسْمَهَا، وَتَنْصِبُ الثَّانِيَ وَيُسَمَّى خَبَرَهَا.',
        rule_id: 'Kana masuk ke dalam susunan Mubtada\' dan Khabar: isim Kana dibaca Marfu\' (dhammah) dan khabar Kana dibaca Manshub (fathah).',
        example_ar: 'كَانَ الجَوُّ لَطِيفًا',
        example_id: 'Cuaca terasa sejuk / menyenangkan.',
        explanation: '"الجَوُّ" adalah Isim Kana (marfu\' dengan dhammah), dan "لَطِيفًا" adalah Khabar Kana (manshub dengan fathatain).',
        transliteration: 'Kaana al-jawwu lathiifan'
      },
      {
        id: 'g-3',
        title: 'Na\'at dan Man\'ut / Sifat dan yang Disifati (النعت والمنعوت)',
        category: 'nahwu',
        rule_ar: 'النَّعْتُ يَتْبَعُ المَنْعُوتَ فِي الإِعْرَابِ، وَالتَّعْرِيفِ، وَالتَّنْكِيرِ، وَالتَّذْكِيرِ، وَالتَّأْنِيثِ.',
        rule_id: 'Kata sifat (Na\'at) selalu mengikuti kata yang disifati (Man\'ut) dalam i\'rab, kejelasan (Ma\'rifah/Nakirah), serta jenis kelamin (Mudzakkar/Muannats).',
        example_ar: 'الفَوَاكِهَ الطَّازَجَةَ',
        example_id: 'Buah-buahan yang segar.',
        explanation: 'Keduanya berawalan alif-lam (Ma\'rifah) dan sama-sama manshub dengan harakat fathah karena berposisi sebagai Maf\'ul Bih.',
        transliteration: 'Al-fawaakiha ath-thaazijata'
      }
    ],
    comprehension_quiz: [
      {
        id: 1,
        question_ar: 'مَتَى اسْتَيْقَظَ أَحْمَدُ؟',
        question_id: 'Kapan Ahmad bangun tidur?',
        options: ['فِي المَسَاءِ', 'مُبَكِّرًا فِي صَبَاحِ يَوْمِ العُطْلَةِ', 'فِي الظَّهِيرَةِ', 'بَعْدَ مَغِيبِ الشَّمْسِ'],
        correct_index: 1,
        explanation: 'Disebutkan pada kalimat pertama: "فِي صَبَاحِ يَوْمِ العُطْلَةِ، اسْتَيْقَظَ أَحْمَدُ مُبَكِّرًا"'
      },
      {
        id: 2,
        question_ar: 'كَمْ سِعْرُ كِيلُو التُّفَّاحِ فِي السُّوقِ؟',
        question_id: 'Berapa harga satu kilogram apel di pasar?',
        options: ['خَمْسَةُ دَرَاهِمَ', 'عِشْرُونَ دِرْهَمًا', 'عَشَرَةُ دَرَاهِمَ', 'مَجَّانًا'],
        correct_index: 2,
        explanation: 'Penjual menjawab: "التُّفَّاحُ بِعَشَرَةِ دَرَاهِمَ يَا سَيِّدِي"'
      }
    ]
  },
  {
    id: 'sample-b1-al-andalus',
    created_at: new Date().toISOString(),
    title_ar: 'مَكْتَبَاتُ قُرْطُبَةَ: مَنَارَةُ العِلْمِ وَالحَضَارَةِ',
    title_id: 'Perpustakaan Kordoba: Menara Ilmu dan Peradaban',
    topic: 'Sejarah & Kebudayaan Islam',
    level: 'B1',
    style: 'artikel_informatif',
    length_preset: '2_pages',
    target_word_count: 550,
    actual_word_count: 540,
    grammar_level: 'B1',
    grammar_language: 'ar_id',
    show_harakat_default: true,
    transliteration_enabled: true,
    summary: 'Artikel informatif mendalam tentang peranan perpustakaan Kordoba pada masa keemasan Andalusia sebagai pusat penerjemahan, sains, dan toleransi intelektual di Eropa.',
    full_text_harakat: 'عَرَفَتْ مَدِينَةُ قُرْطُبَةَ فِي الأَنْدَلُسِ إِبَّانَ العَصْرِ الإِسْلَامِيِّ ازْدِهَارًا ثَقَافِيًّا وَعِلْمِيًّا لَمْ تَشْهَدْ لَهُ أُورُوبَّا مَثِيلًا فِي تِلْكَ الحِقْبَةِ. وَكَانَتْ مَكْتَبَةُ الخَلِيفَةِ الحَكَمِ المُسْتَنْصِرِ بِاللهِ تُمَثِّلُ دُرَّةَ التَّاجِ فِي هَذَا الإِشْعَاعِ الحَضَارِيِّ، إِذْ ضَمَّتْ أَكْثَرَ مِنْ أَرْبَعِمِائَةِ أَلْفِ مُجَلَّدٍ شَمِلَتْ شَتَّى المَعَارِفِ الإِنْسَانِيَّةِ مِنَ الفَلَسَفَةِ، وَالطِّبِّ، وَالفَلَكِ، وَالرِّيَاضِيَّاتِ، وَالأَدَبِ.\n\nلَمْ تَكُنْ هَذِهِ المَكْتَبَاتُ مُجَرَّدَ مَخَازِنَ لِحِفْظِ الكُتُبِ وَالمَخْطُوطَاتِ النَّادِرَةِ، بَلْ كَانَتْ مَرَاكِزَ حَيَوِيَّةً لِلتَّرْجَمَةِ وَالنَّسْخِ وَالبَحْثِ التَّجْرِيبِيِّ. كَانَ العُلَمَاءُ وَالطُّلَّابُ يَفِدُونَ إِلَيْهَا مِنْ مُخْتَلِفِ أَقْطَارِ العَالَمِ، يَسْتَفِيدُونَ مِنْ حُرِّيَّةِ الفِكْرِ وَتَوَافُرِ المَصَادِرِ. إِنَّ الحِفَاظَ عَلَى التُّرَاثِ الإِنْسَانِيِّ وَتَطْوِيرَهُ هُوَ الرِّسَالَةُ الخَالِدَةُ الَّتِي قَدَّمَتْهَا تِلْكَ المَدِينَةُ العَرِيقَةُ لِلإِنْسَانِيَّةِ جَمْعَاءَ.',
    full_text_gundul: 'عرفت مدينة قرطبة في الأندلس إبان العصر الإسلامي ازدهارا ثقافيا وعلميا لم تشهد له أوروبا مثيلا في تلك الحقبة. وكانت مكتبة الخليفة الحكم المستنصر بالله تمثل درة التاج في هذا الإشعاع الحضاري، إذ ضمت أكثر من أربعمائة ألف مجلد شملت شتى المعارف الإنسانية من الفلسفة، والطب، والفلك، والرياضيات، والأدب.\n\nلم تكن هذه المكتبات مجرد مخازن لحفظ الكتب والمخطوطات النادرة، بل كانت مراكز حيوية للترجمة والنسخ والبحث التجريبي. كان العلماء والطلاب يفدون إليها من مختلف أقطار العالم، يستفيدون من حرية الفكر وتوافر المصادر. إن الحفاظ على التراث الإنساني وتطويره هو الرسالة الخالدة التي قدمتها تلك المدينة العريقة للإنسانية جمعاء.',
    paragraphs: [
      {
        id: 1,
        ar_harakat: 'عَرَفَتْ مَدِينَةُ قُرْطُبَةَ فِي الأَنْدَلُسِ إِبَّانَ العَصْرِ الإِسْلَامِيِّ ازْدِهَارًا ثَقَافِيًّا وَعِلْمِيًّا لَمْ تَشْهَدْ لَهُ أُورُوبَّا مَثِيلًا فِي تِلْكَ الحِقْبَةِ.',
        ar_gundul: 'عرفت مدينة قرطبة في الأندلس إبان العصر الإسلامي ازدهارا ثقافيا وعلميا لم تشهد له أوروبا مثيلا في تلك الحقبة.',
        id_translation: 'Kota Kordoba di Andalusia pada era peradaban Islam mengalami kemajuan budaya dan keilmuan yang tiada tandingannya di Eropa pada zaman tersebut.'
      },
      {
        id: 2,
        ar_harakat: 'وَكَانَتْ مَكْتَبَةُ الخَلِيفَةِ الحَكَمِ المُسْتَنْصِرِ بِاللهِ تُمَثِّلُ دُرَّةَ التَّاجِ فِي هَذَا الإِشْعَاعِ الحَضَارِيِّ، إِذْ ضَمَّتْ أَكْثَرَ مِنْ أَرْبَعِمِائَةِ أَلْفِ مُجَلَّدٍ شَمِلَتْ شَتَّى المَعَارِفِ الإِنْسَانِيَّةِ مِنَ الفَلَسَفَةِ، وَالطِّبِّ، وَالفَلَكِ، وَالرِّيَاضِيَّاتِ، وَالأَدَبِ.',
        ar_gundul: 'وكانت مكتبة الخليفة الحكم المستنصر بالله تمثل درة التاج في هذا الإشعاع الحضاري، إذ ضمت أكثر من أربعمائة ألف مجلد شملت شتى المعارف الإنسانية من الفلسفة، والطب، والفلك، والرياضيات، والأدب.',
        id_translation: 'Perpustakaan Khalifah Al-Hakam Al-Mustansir Billah merupakan permata mahkota dalam pancaran peradaban ini, memuat lebih dari 400.000 jilid kitab yang mencakup berbagai ilmu pengetahuan manusia seperti filsafat, kedokteran, astronomi, matematika, dan sastra.'
      },
      {
        id: 3,
        ar_harakat: 'لَمْ تَكُنْ هَذِهِ المَكْتَبَاتُ مُجَرَّدَ مَخَازِنَ لِحِفْظِ الكُتُبِ وَالمَخْطُوطَاتِ النَّادِرَةِ، بَلْ كَانَتْ مَرَاكِزَ حَيَوِيَّةً لِلتَّرْجَمَةِ وَالنَّسْخِ وَالبَحْثِ التَّجْرِيبِيِّ. كَانَ العُلَمَاءُ وَالطُّلَّابُ يَفِدُونَ إِلَيْهَا مِنْ مُخْتَلِفِ أَقْطَارِ العَالَمِ.',
        ar_gundul: 'لم تكن هذه المكتبات مجرد مخازن لحفظ الكتب والمخطوطات النادرة، بل كانت مراكز حيوية للترجمة والنسخ والبحث التجريبي. كان العلماء والطلاب يفدون إليها من مختلف أقطار العالم.',
        id_translation: 'Perpustakaan-perpustakaan ini bukan sekadar gudang penyimpanan buku dan manuskrip langka, melainkan pusat vital penerjemahan, penyalinan, dan penelitian eksperimental. Para sarjana dan pelajar berdatangan dari berbagai penjuru dunia.'
      }
    ],
    vocabulary: [
      {
        word_ar: 'إِبَّانَ',
        word_clean: 'إبان',
        word_id: 'Semasa / Pada kurun waktu',
        root: 'أ - ب - ن (a-b-n)',
        pos: 'ظَرْفُ زَمَانٍ (Zharf Zaman)',
        wazan: 'فِعَّال (Fi\'\'al)',
        meaning_detail: 'Menunjukkan rentang waktu tertentu saat suatu peristiwa berlangsung.',
        transliteration: 'Ibbāna',
        nahwu_note: 'Manshub \'alazh-zharfiyyah'
      },
      {
        word_ar: 'ازْدِهَارًا',
        word_clean: 'ازدهارا',
        word_id: 'Kemajuan pesat / Kegemilangan',
        root: 'ز - ه - ر (z-h-r)',
        pos: 'مَفْعُولٌ بِهِ / مَصْدَرٌ (Maf\'ul Bih / Masdar)',
        wazan: 'اِفْتِعَال (Ifti\'al - ada ibdal ز + د)',
        meaning_detail: 'Perkembangan yang pesat dan mencapai puncak kejayaan.',
        transliteration: 'Izdiharaa',
        nahwu_note: 'Manshub bil fathah'
      },
      {
        word_ar: 'دُرَّةَ',
        word_clean: 'درة',
        word_id: 'Mutiara terindah / Permata',
        root: 'د - ر - ر (d-r-r)',
        pos: 'خَبَرُ كَانَ (Khabar Kana)',
        wazan: 'فُعْلَة (Fu\'lah)',
        meaning_detail: 'Mutiara besar berkilau; kiasan untuk sesuatu yang paling berharga.',
        transliteration: 'Durrah',
        nahwu_note: 'Manshub bil fathah'
      },
      {
        word_ar: 'يَفِدُونَ',
        word_clean: 'يفدون',
        word_id: 'Mereka berdatangan',
        root: 'و - ف - د (w-f-d)',
        pos: 'فِعْلٌ مُضَارِعٌ (Fi\'il Mudhari\')',
        wazan: 'يَفْعِلُونَ (Mutsal wawi / Fi\'il Mitsal)',
        meaning_detail: 'Datang sebagai delegasi atau rombongan untuk tujuan belajar.',
        transliteration: 'Yafidūna',
        nahwu_note: 'Marfu\' bi tsubutin-nun'
      }
    ],
    grammar_analysis: [
      {
        id: 'gb-1',
        title: 'Fi\'il Mu\'tal Mitsal (الفعل المعتل المثال: وفد -> يفد)',
        category: 'shorof',
        rule_ar: 'الفِعْلُ المِثَالُ الوَاوِيُّ تُحْذَفُ وَاوُهُ فِي المُضَارِعِ إِذَا كَانَتْ عَيْنُهُ مَكْسُورَةً (وَفَدَ -> يَفِدُ).',
        rule_id: 'Fi\'il Mitsal Wawi (huruf pertama berpenyakit Waw) dihilangkan huruf waw-nya ketika diubah ke fi\'il mudhari\' yang berharakat kasrah pada \'ain fi\'ilnya.',
        example_ar: 'كَانَ العُلَمَاءُ يَفِدُونَ إِلَيْهَا',
        example_id: 'Para ilmuwan berdatangan kepadanya.',
        explanation: 'Asal katanya "يَوْفِدُونَ", huruf waw dihilangkan karena berada di antara harakat fathah dan kasrah menjadi "يَفِدُونَ".',
        transliteration: 'Yafidūna'
      },
      {
        id: 'gb-2',
        title: 'Inna wa Akhawātuhā (إنّ وأخواتها)',
        category: 'nahwu',
        rule_ar: 'إِنَّ حَرْفُ تَوْكِيدٍ وَنَصْبٍ، تَنْصِبُ الاسْمَ وَتَرْفَعُ الخَبَرَ.',
        rule_id: 'Inna adalah huruf penegas (taukid) yang menashabkan Isim Inna dan me-rafa\'kan Khabar Inna.',
        example_ar: 'إِنَّ الحِفَاظَ عَلَى التُّرَاثِ ... هُوَ الرِّسَالَةُ الخَالِدَةُ',
        example_id: 'Sesungguhnya menjaga warisan adalah risalah yang abadi.',
        explanation: '"الحِفَاظَ" adalah Isim Inna yang manshub dengan fathah, dan jumlah ismiyyah "هُوَ الرِّسَالَةُ" berada pada posisi rafa\' sebagai Khabar Inna.',
        transliteration: 'Inna al-hifaazha...'
      }
    ],
    comprehension_quiz: [
      {
        id: 1,
        question_ar: 'كَمْ مُجَلَّدًا كَانَتْ تَضُمُّ مَكْتَبَةُ الحَكَمِ المُسْتَنْصِرِ بِاللهِ؟',
        question_id: 'Berapa jilid kitab yang terdapat di perpustakaan Al-Hakam Al-Mustansir Billah?',
        options: ['أَلْفُ مُجَلَّدٍ', 'عَشَرَةُ آلَافِ مُجَلَّدٍ', 'أَكْثَرُ مِنْ أَرْبَعِمِائَةِ أَلْفِ مُجَلَّدٍ', 'مِائَةُ أَلْفِ مُجَلَّدٍ فَقَطْ'],
        correct_index: 2,
        explanation: 'Sesuai dengan teks: "إِذْ ضَمَّتْ أَكْثَرَ مِنْ أَرْبَعِمِائَةِ أَلْفِ مُجَلَّدٍ"'
      }
    ]
  }
];
