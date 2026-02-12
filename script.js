// ========================================
// Islamic Will Generator - JavaScript
// ========================================

// Supabase Configuration
const SUPABASE_URL = 'https://gyvzfylmvocrriwoemhf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dnpmeWxtdm9jcnJpd29lbWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjAyOTEsImV4cCI6MjA4NjQ5NjI5MX0.H6E2iAWkqi82szU52_jtbBSyzPKTlAt5jqgRsYt9Kfk';

// Initialize Supabase (with error handling)
let supabaseClient = null;

function initSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialized successfully');
        } else {
            console.warn('Supabase library not loaded, will save locally only');
        }
    } catch (e) {
        console.warn('Supabase initialization error:', e);
    }
}

// State
let currentStep = 1;
const totalSteps = 12;
let formData = {};

// Counters for dynamic lists
let childCount = 0;
let debtCount = 0;
let debtOwedCount = 0;
let propertyCount = 0;
let bankCount = 0;
let investmentCount = 0;
let businessCount = 0;
let vehicleCount = 0;
let valuableCount = 0;
let charitableCount = 0;
let nonHeirCount = 0;
let adoptedCount = 0;

// ========================================
// Language Translations for Will Document
// ========================================
const willTranslations = {
    en: {
        title: "ISLAMIC WILL (WASIYYAH)",
        bismillah: "In the Name of Allah, the Most Gracious, the Most Merciful",
        declarationOfFaith: "DECLARATION OF FAITH",
        declarationText: (name, address) => `I, <strong>${name}</strong>, of <strong>${address}</strong>, being of sound mind and understanding, declare that I bear witness that there is no god but Allah, and that Muhammad (peace be upon him) is His final Messenger.`,
        willInAccordance: "I make this Will in accordance with Islamic Law (Shariah) and the laws of England and Wales.",
        part1Title: "PART 1: REVOCATION",
        part1Text: "I hereby revoke all former Wills and Codicils made by me and declare this to be my Last Will and Testament.",
        part2Title: "PART 2: APPOINTMENT OF EXECUTORS",
        part2Text: "I appoint the following person(s) to be the Executor(s) of this Will:",
        primaryExecutor: "Primary Executor",
        secondaryExecutor: "Secondary Executor (if primary unable to act)",
        name: "Name",
        address: "Address",
        relationship: "Relationship",
        part3Title: "PART 3: FUNERAL ARRANGEMENTS",
        part3Text: "I direct that upon my death:",
        funeral1: "My body shall be washed (Ghusl) and shrouded (Kafan) according to Islamic rites",
        funeral2: "The Janazah (funeral) prayer shall be performed",
        funeral3: "I shall be buried (not cremated) in a Muslim cemetery or Muslim section of a cemetery, facing the Qiblah",
        funeral4: "My burial shall take place as soon as reasonably possible after my death",
        funeral5: "My funeral shall be conducted simply, without extravagance, in accordance with the Sunnah",
        repatriation: "Repatriation",
        repatriationText: (country) => `I wish to be buried in ${country}. If repatriation is not possible within 3 days, I should be buried in the UK.`,
        preferredCemetery: "Preferred Cemetery",
        preferredMosque: "Preferred Mosque for Janazah",
        part4Title: "PART 4: PAYMENT OF DEBTS AND EXPENSES",
        part4Text: "I direct my Executor(s) to pay from my estate in the following order of priority:",
        funeralExpenses: "My funeral and burial expenses",
        allDebts: "All my lawful debts",
        outstandingMahr: "Outstanding Mahr (Dowry) to my wife",
        unpaidZakat: "Unpaid Zakat",
        fidyah: "Fidyah for missed fasts",
        fidyahDays: "days",
        kaffarah: "Kaffarah",
        hajjBadal: "Arrange Hajj Badal (proxy Hajj) from my estate",
        part5Title: "PART 5: ISLAMIC BEQUEST (WASIYYAH)",
        wasiyyahYes: "In accordance with Islamic Law, I bequeath up to <strong>ONE-THIRD (1/3)</strong> of my net estate (after payment of debts and expenses) as follows:",
        wasiyyahNote: "Note: This bequest cannot be made to those who are already entitled to inherit under Islamic Law (Faraid)",
        beneficiary: "Beneficiary",
        percentage: "Percentage",
        purpose: "Purpose",
        bequestDetails: "Charitable bequests and non-heir bequests as recorded",
        wasiyyahNo: "I do not wish to make any Wasiyyah. My entire estate shall be distributed according to the Islamic Law of Inheritance (Faraid).",
        part6Title: "PART 6: ISLAMIC INHERITANCE (FARAID)",
        part6Text: "I direct that the remainder of my estate (after payment of debts, expenses, and Wasiyyah) shall be distributed according to the Islamic Law of Inheritance (Faraid) as prescribed in the Holy Quran (Surah An-Nisa 4:11-12) and Sunnah.",
        testatorInfo: "Testator Information for Faraid Calculation:",
        testator: "Testator",
        male: "Male",
        female: "Female",
        maritalStatus: "Marital Status",
        notSpecified: "Not specified",
        spouse: "Spouse",
        husband: "Husband",
        wife: "Wife",
        entitledTo: "entitled to",
        hasChildren: "Has Children",
        yes: "Yes",
        no: "No",
        children: "Children",
        son: "Son",
        daughter: "Daughter",
        father: "Father",
        mother: "Mother",
        living: "Living",
        deceased: "Deceased",
        calculatedShares: "Calculated Inheritance Shares According to Shariah:",
        sharesNote: "Based on the family information provided and Islamic inheritance law, the shares are calculated as follows:",
        faraidReference: "Faraid Reference (Quranic Shares):",
        faraidQuote: 'As ordained in the Holy Quran - "Allah instructs you concerning your children: for the male, what is equal to the share of two females..." (4:11)',
        heir: "Heir",
        withChildren: "With Children",
        withoutChildren: "Without Children",
        residue: "Residue",
        receivesDouble: "Residue (receives double the share of daughter)",
        sharedEqually: "shared equally",
        faraidImportant: "These shares are calculated based on the information provided and in accordance with Islamic Shariah law. I request that my Executor(s) consult with a qualified Islamic scholar (Mufti) for the final calculation of Faraid shares at the time of distribution, as circumstances may change.",
        part7Title: "PART 7: GUARDIANSHIP OF MINOR CHILDREN",
        part7Text: "If I have minor children at the time of my death, I appoint:",
        primaryGuardian: "Primary Guardian",
        secondaryGuardian: "Secondary Guardian",
        guardianRequest: "I request that my children be raised according to Islamic principles and teachings.",
        part8Title: "PART 8: ORGAN DONATION",
        organConsent: "I consent to organ donation to save lives.",
        organRefuse: "I do not consent to organ donation.",
        organDefer: "I defer the decision on organ donation to my family and an Islamic scholar at the time.",
        part9Title: "PART 9: DECLARATION",
        part9Text: "I declare that:",
        declaration1: "I am over 18 years of age",
        declaration2: "I am of sound mind",
        declaration3: "I make this Will freely and voluntarily",
        declaration4: "I understand that the Islamic shares are fixed by Allah and cannot be altered",
        declaration5: "I have not made any bequest to an heir from the one-third Wasiyyah portion",
        declaration6: "The total Wasiyyah does not exceed one-third of my estate",
        signatures: "SIGNATURES",
        testatorSig: "TESTATOR",
        signatureOf: "Signature of Testator",
        fullName: "Full Name",
        date: "Date",
        witness1: "WITNESS 1",
        witnessNote: "This Will must be signed in the presence of two witnesses who are not beneficiaries",
        signature: "Signature",
        occupation: "Occupation",
        witness2: "WITNESS 2",
        solicitorCert: "SOLICITOR CERTIFICATION",
        solicitorCertText: "I certify that:",
        cert1: "The Testator appeared of sound mind",
        cert2: "The Will was explained to the Testator",
        cert3: "The Will complies with UK law",
        cert4: "Proper witnessing procedures were followed",
        solicitorName: "Solicitor Name",
        firm: "Firm",
        sraNumber: "SRA Number",
        islamicCert: "ISLAMIC CERTIFICATION (MUFTI/IMAM)",
        islamicCertText: "I certify that I have reviewed this Will and confirm that:",
        islamic1: "The Wasiyyah does not exceed one-third (1/3)",
        islamic2: "No bequests are made to Quranic heirs from the Wasiyyah",
        islamic3: "The Faraid distribution follows Islamic law",
        islamic4: "The funeral wishes comply with Shariah",
        muftiName: "Mufti/Imam Name",
        mosque: "Mosque/Institution",
        contact: "Contact",
        firmStamp: "Firm Stamp",
        mosqueStamp: "Mosque/Institution Stamp",
        generatedOn: (date) => `This Will was generated on ${date} using the Islamic Will Generator.`,
        reviewNote: "Please have this document reviewed by a qualified solicitor and Islamic scholar before signing.",
        transcriptNote: "This document has been translated from English. The original English version should be considered the authoritative legal text in case of any discrepancy."
    },
    ar: {
        title: "الوصية الإسلامية (وصيّة)",
        bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
        declarationOfFaith: "شهادة الإيمان",
        declarationText: (name, address) => `أنا، <strong>${name}</strong>، المقيم في <strong>${address}</strong>، وأنا بكامل قواي العقلية والإدراكية، أشهد أن لا إله إلا الله وأن محمداً صلى الله عليه وسلم رسوله الخاتم.`,
        willInAccordance: "أُعدّ هذه الوصية وفقاً للشريعة الإسلامية وقوانين إنجلترا وويلز.",
        part1Title: "الجزء الأول: الإلغاء",
        part1Text: "أُلغي بموجب هذا جميع الوصايا والملاحق السابقة وأعلن أن هذه هي وصيتي الأخيرة.",
        part2Title: "الجزء الثاني: تعيين الأوصياء المنفذين",
        part2Text: "أُعيّن الشخص (الأشخاص) التالية أسماؤهم ليكونوا منفذي هذه الوصية:",
        primaryExecutor: "المنفذ الرئيسي",
        secondaryExecutor: "المنفذ الثانوي (في حال عدم قدرة الرئيسي)",
        name: "الاسم",
        address: "العنوان",
        relationship: "صلة القرابة",
        part3Title: "الجزء الثالث: ترتيبات الجنازة",
        part3Text: "أوصي بأنه عند وفاتي:",
        funeral1: "يُغسَّل جسدي (الغُسل) ويُكفَّن وفقاً للشعائر الإسلامية",
        funeral2: "تُقام صلاة الجنازة",
        funeral3: "أُدفن (لا أُحرق) في مقبرة إسلامية أو قسم إسلامي من مقبرة، مستقبلاً القبلة",
        funeral4: "يتم دفني في أقرب وقت ممكن بعد وفاتي",
        funeral5: "تُجرى جنازتي ببساطة، دون إسراف، وفقاً للسنة النبوية",
        repatriation: "الترحيل",
        repatriationText: (country) => `أرغب في أن أُدفن في ${country}. إذا لم يكن الترحيل ممكناً خلال 3 أيام، فليتم دفني في المملكة المتحدة.`,
        preferredCemetery: "المقبرة المفضلة",
        preferredMosque: "المسجد المفضل لصلاة الجنازة",
        part4Title: "الجزء الرابع: سداد الديون والمصاريف",
        part4Text: "أوجّه المنفذ (المنفذين) لسداد ما يلي من تركتي حسب الأولوية:",
        funeralExpenses: "مصاريف الجنازة والدفن",
        allDebts: "جميع ديوني المشروعة",
        outstandingMahr: "المهر المتبقي لزوجتي",
        unpaidZakat: "الزكاة غير المسددة",
        fidyah: "فدية الصيام الفائت",
        fidyahDays: "أيام",
        kaffarah: "الكفارة",
        hajjBadal: "ترتيب حج البدل من تركتي",
        part5Title: "الجزء الخامس: الوصية الإسلامية",
        wasiyyahYes: "وفقاً للشريعة الإسلامية، أوصي بما يصل إلى <strong>الثُلث (1/3)</strong> من صافي تركتي (بعد سداد الديون والمصاريف) كالتالي:",
        wasiyyahNote: "ملاحظة: لا يجوز الوصية لمن يستحق الإرث بموجب الشريعة الإسلامية (الفرائض)",
        beneficiary: "المستفيد",
        percentage: "النسبة",
        purpose: "الغرض",
        bequestDetails: "الوصايا الخيرية ووصايا غير الورثة كما هو مسجل",
        wasiyyahNo: "لا أرغب في عمل وصية. تُوزَّع تركتي بالكامل وفقاً لقانون الميراث الإسلامي (الفرائض).",
        part6Title: "الجزء السادس: الميراث الإسلامي (الفرائض)",
        part6Text: "أوجّه بتوزيع باقي تركتي (بعد سداد الديون والمصاريف والوصية) وفقاً لقانون الميراث الإسلامي (الفرائض) كما جاء في القرآن الكريم (سورة النساء 4:11-12) والسنة النبوية.",
        testatorInfo: "معلومات المُوصي لحساب الفرائض:",
        testator: "المُوصي",
        male: "ذكر",
        female: "أنثى",
        maritalStatus: "الحالة الاجتماعية",
        notSpecified: "غير محدد",
        spouse: "الزوج/الزوجة",
        husband: "الزوج",
        wife: "الزوجة",
        entitledTo: "يستحق",
        hasChildren: "لديه أولاد",
        yes: "نعم",
        no: "لا",
        children: "الأولاد",
        son: "ابن",
        daughter: "ابنة",
        father: "الأب",
        mother: "الأم",
        living: "حي/حية",
        deceased: "متوفى/متوفاة",
        calculatedShares: "حصص الميراث المحسوبة وفقاً للشريعة:",
        sharesNote: "بناءً على المعلومات العائلية المقدمة وقانون الميراث الإسلامي، تم حساب الحصص كالتالي:",
        faraidReference: "مرجع الفرائض (الأنصبة القرآنية):",
        faraidQuote: 'كما جاء في القرآن الكريم - "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ" (4:11)',
        heir: "الوارث",
        withChildren: "مع وجود أولاد",
        withoutChildren: "بدون أولاد",
        residue: "الباقي",
        receivesDouble: "الباقي (يحصل على ضعف نصيب البنت)",
        sharedEqually: "يُقسَّم بالتساوي",
        faraidImportant: "هذه الحصص محسوبة بناءً على المعلومات المقدمة ووفقاً لأحكام الشريعة الإسلامية. أطلب من المنفذ (المنفذين) استشارة عالم إسلامي مؤهل (مفتي) للحساب النهائي لحصص الفرائض عند التوزيع، حيث قد تتغير الظروف.",
        part7Title: "الجزء السابع: الوصاية على القُصّر",
        part7Text: "إذا كان لدي أطفال قُصّر عند وفاتي، أُعيّن:",
        primaryGuardian: "الوصي الرئيسي",
        secondaryGuardian: "الوصي الثانوي",
        guardianRequest: "أطلب أن يُربّى أطفالي وفقاً للمبادئ والتعاليم الإسلامية.",
        part8Title: "الجزء الثامن: التبرع بالأعضاء",
        organConsent: "أوافق على التبرع بأعضائي لإنقاذ الأرواح.",
        organRefuse: "لا أوافق على التبرع بأعضائي.",
        organDefer: "أترك قرار التبرع بالأعضاء لعائلتي وعالم إسلامي في ذلك الوقت.",
        part9Title: "الجزء التاسع: الإقرار",
        part9Text: "أُقرّ بأنني:",
        declaration1: "أبلغ من العمر أكثر من 18 عاماً",
        declaration2: "بكامل قواي العقلية",
        declaration3: "أُعدّ هذه الوصية بحرية وطواعية",
        declaration4: "أفهم أن الحصص الإسلامية ثابتة بأمر الله ولا يمكن تغييرها",
        declaration5: "لم أوصِ لوارث من ثلث الوصية",
        declaration6: "مجموع الوصية لا يتجاوز ثلث تركتي",
        signatures: "التوقيعات",
        testatorSig: "المُوصي",
        signatureOf: "توقيع المُوصي",
        fullName: "الاسم الكامل",
        date: "التاريخ",
        witness1: "الشاهد الأول",
        witnessNote: "يجب توقيع هذه الوصية بحضور شاهدين ليسا من المستفيدين",
        signature: "التوقيع",
        occupation: "المهنة",
        witness2: "الشاهد الثاني",
        solicitorCert: "تصديق المحامي",
        solicitorCertText: "أشهد أن:",
        cert1: "المُوصي بدا سليم العقل",
        cert2: "تم شرح الوصية للمُوصي",
        cert3: "الوصية متوافقة مع قانون المملكة المتحدة",
        cert4: "تم اتباع إجراءات الشهادة الصحيحة",
        solicitorName: "اسم المحامي",
        firm: "المكتب",
        sraNumber: "رقم SRA",
        islamicCert: "التصديق الإسلامي (المفتي/الإمام)",
        islamicCertText: "أشهد أنني راجعت هذه الوصية وأؤكد أن:",
        islamic1: "الوصية لا تتجاوز الثلث (1/3)",
        islamic2: "لا توجد وصايا لورثة قرآنيين من الوصية",
        islamic3: "توزيع الفرائض يتبع الشريعة الإسلامية",
        islamic4: "أمنيات الجنازة متوافقة مع الشريعة",
        muftiName: "اسم المفتي/الإمام",
        mosque: "المسجد/المؤسسة",
        contact: "الاتصال",
        firmStamp: "ختم المكتب",
        mosqueStamp: "ختم المسجد/المؤسسة",
        generatedOn: (date) => `تم إنشاء هذه الوصية بتاريخ ${date} باستخدام مُولِّد الوصية الإسلامية.`,
        reviewNote: "يُرجى مراجعة هذه الوثيقة من قبل محامٍ مؤهل وعالم إسلامي قبل التوقيع.",
        transcriptNote: "هذه الوثيقة مترجمة من الإنجليزية. يُعتبر النص الإنجليزي الأصلي هو النص القانوني المعتمد في حال وجود أي تعارض."
    },
    ur: {
        title: "اسلامی وصیت (وصیّہ)",
        bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
        declarationOfFaith: "اعلانِ ایمان",
        declarationText: (name, address) => `میں، <strong>${name}</strong>، مقیم <strong>${address}</strong>، اپنی مکمل عقل و شعور کے ساتھ اعلان کرتا/کرتی ہوں کہ میں گواہی دیتا/دیتی ہوں کہ اللہ کے سوا کوئی معبود نہیں اور محمد صلی اللہ علیہ وسلم اس کے آخری رسول ہیں۔`,
        willInAccordance: "میں یہ وصیت اسلامی شریعت اور انگلینڈ و ویلز کے قوانین کے مطابق بناتا/بناتی ہوں۔",
        part1Title: "حصہ 1: منسوخی",
        part1Text: "میں اپنی تمام سابقہ وصیتوں اور ضمیموں کو منسوخ کرتا/کرتی ہوں اور اعلان کرتا/کرتی ہوں کہ یہ میری آخری وصیت ہے۔",
        part2Title: "حصہ 2: وصیت کے نفاذ کنندگان کی تقرری",
        part2Text: "میں مندرجہ ذیل شخص/اشخاص کو اس وصیت کا نفاذ کنندہ مقرر کرتا/کرتی ہوں:",
        primaryExecutor: "بنیادی نفاذ کنندہ",
        secondaryExecutor: "ثانوی نفاذ کنندہ (اگر بنیادی قاصر ہو)",
        name: "نام",
        address: "پتہ",
        relationship: "رشتہ",
        part3Title: "حصہ 3: جنازے کے انتظامات",
        part3Text: "میں ہدایت کرتا/کرتی ہوں کہ میری وفات پر:",
        funeral1: "میرے جسم کو اسلامی رسوم کے مطابق غسل اور کفن دیا جائے",
        funeral2: "نمازِ جنازہ ادا کی جائے",
        funeral3: "مجھے مسلم قبرستان میں یا قبرستان کے مسلم حصے میں قبلہ رخ دفنایا جائے (نہ جلایا جائے)",
        funeral4: "میری تدفین جلد از جلد عمل میں لائی جائے",
        funeral5: "میرا جنازہ سادگی سے، بغیر اسراف کے، سنت کے مطابق ادا کیا جائے",
        repatriation: "وطن واپسی",
        repatriationText: (country) => `میں چاہتا/چاہتی ہوں کہ مجھے ${country} میں دفنایا جائے۔ اگر 3 دنوں میں واپسی ممکن نہ ہو تو مجھے برطانیہ میں دفنایا جائے۔`,
        preferredCemetery: "پسندیدہ قبرستان",
        preferredMosque: "نمازِ جنازہ کے لیے پسندیدہ مسجد",
        part4Title: "حصہ 4: قرضوں اور اخراجات کی ادائیگی",
        part4Text: "میں اپنے نفاذ کنندہ/کنندگان کو ہدایت کرتا/کرتی ہوں کہ میری جائیداد سے مندرجہ ذیل ترتیب سے ادائیگی کریں:",
        funeralExpenses: "جنازے اور تدفین کے اخراجات",
        allDebts: "میرے تمام جائز قرضے",
        outstandingMahr: "بیوی کا بقایا مہر",
        unpaidZakat: "ادا نہ کی گئی زکوٰۃ",
        fidyah: "چھوٹے ہوئے روزوں کا فدیہ",
        fidyahDays: "دن",
        kaffarah: "کفارہ",
        hajjBadal: "میری جائیداد سے حجِ بدل کا انتظام کریں",
        part5Title: "حصہ 5: اسلامی وصیت",
        wasiyyahYes: "اسلامی شریعت کے مطابق، میں اپنی خالص جائیداد کے <strong>ایک تہائی (1/3)</strong> تک (قرضوں اور اخراجات کی ادائیگی کے بعد) مندرجہ ذیل طور پر وصیت کرتا/کرتی ہوں:",
        wasiyyahNote: "نوٹ: یہ وصیت ان لوگوں کے لیے نہیں کی جا سکتی جو اسلامی قانون (فرائض) کے تحت وراثت کے حقدار ہیں",
        beneficiary: "مستفید",
        percentage: "فیصد",
        purpose: "مقصد",
        bequestDetails: "خیراتی وصایا اور غیر وارثوں کی وصایا جیسا کہ درج ہے",
        wasiyyahNo: "میں کوئی وصیت نہیں کرنا چاہتا/چاہتی۔ میری پوری جائیداد اسلامی قانونِ وراثت (فرائض) کے مطابق تقسیم ہوگی۔",
        part6Title: "حصہ 6: اسلامی وراثت (فرائض)",
        part6Text: "میں ہدایت کرتا/کرتی ہوں کہ میری باقی جائیداد (قرضوں، اخراجات اور وصیت کی ادائیگی کے بعد) قرآن مجید (سورۃ النساء 4:11-12) اور سنت کے مطابق اسلامی قانونِ وراثت (فرائض) کے تحت تقسیم کی جائے۔",
        testatorInfo: "فرائض کے حساب کے لیے وصیت کنندہ کی معلومات:",
        testator: "وصیت کنندہ",
        male: "مرد",
        female: "عورت",
        maritalStatus: "ازدواجی حیثیت",
        notSpecified: "غیر متعین",
        spouse: "شریکِ حیات",
        husband: "شوہر",
        wife: "بیوی",
        entitledTo: "کا حق",
        hasChildren: "اولاد ہے",
        yes: "ہاں",
        no: "نہیں",
        children: "اولاد",
        son: "بیٹا",
        daughter: "بیٹی",
        father: "والد",
        mother: "والدہ",
        living: "زندہ",
        deceased: "مرحوم/مرحومہ",
        calculatedShares: "شریعت کے مطابق حساب شدہ وراثت کے حصے:",
        sharesNote: "فراہم کردہ خاندانی معلومات اور اسلامی قانونِ وراثت کی بنیاد پر حصوں کا حساب مندرجہ ذیل ہے:",
        faraidReference: "فرائض کا حوالہ (قرآنی حصے):",
        faraidQuote: 'جیسا کہ قرآن مجید میں فرمایا - "اللہ تمہیں تمہاری اولاد کے بارے میں حکم دیتا ہے: لڑکے کا حصہ دو لڑکیوں کے حصے کے برابر ہے..." (4:11)',
        heir: "وارث",
        withChildren: "اولاد ہونے کی صورت میں",
        withoutChildren: "اولاد نہ ہونے کی صورت میں",
        residue: "بقیہ",
        receivesDouble: "بقیہ (بیٹی کے حصے سے دوگنا)",
        sharedEqually: "برابر تقسیم",
        faraidImportant: "یہ حصے فراہم کردہ معلومات اور اسلامی شریعت کے احکام کی بنیاد پر حساب کیے گئے ہیں۔ میں درخواست کرتا/کرتی ہوں کہ نفاذ کنندہ/کنندگان تقسیم کے وقت ایک مستند اسلامی عالم (مفتی) سے فرائض کے حصوں کا حتمی حساب کروائیں، کیونکہ حالات بدل سکتے ہیں۔",
        part7Title: "حصہ 7: نابالغ بچوں کی سرپرستی",
        part7Text: "اگر میری وفات کے وقت میرے نابالغ بچے ہوں تو میں مقرر کرتا/کرتی ہوں:",
        primaryGuardian: "بنیادی سرپرست",
        secondaryGuardian: "ثانوی سرپرست",
        guardianRequest: "میں درخواست کرتا/کرتی ہوں کہ میرے بچوں کی پرورش اسلامی اصولوں اور تعلیمات کے مطابق ہو۔",
        part8Title: "حصہ 8: اعضاء کا عطیہ",
        organConsent: "میں جانیں بچانے کے لیے اعضاء کے عطیے پر رضامند ہوں۔",
        organRefuse: "میں اعضاء کے عطیے پر رضامند نہیں ہوں۔",
        organDefer: "میں اعضاء کے عطیے کا فیصلہ اپنے خاندان اور اسلامی عالم پر چھوڑتا/چھوڑتی ہوں۔",
        part9Title: "حصہ 9: اقرار نامہ",
        part9Text: "میں اقرار کرتا/کرتی ہوں کہ:",
        declaration1: "میری عمر 18 سال سے زیادہ ہے",
        declaration2: "میں مکمل عقل و شعور میں ہوں",
        declaration3: "میں یہ وصیت آزادانہ اور رضاکارانہ طور پر بنا رہا/رہی ہوں",
        declaration4: "میں سمجھتا/سمجھتی ہوں کہ اسلامی حصے اللہ کے مقرر کردہ ہیں اور تبدیل نہیں کیے جا سکتے",
        declaration5: "میں نے ایک تہائی وصیت کے حصے سے کسی وارث کو وصیت نہیں کی",
        declaration6: "کل وصیت میری جائیداد کے ایک تہائی سے زیادہ نہیں",
        signatures: "دستخط",
        testatorSig: "وصیت کنندہ",
        signatureOf: "وصیت کنندہ کے دستخط",
        fullName: "مکمل نام",
        date: "تاریخ",
        witness1: "گواہ نمبر 1",
        witnessNote: "یہ وصیت دو گواہوں کی موجودگی میں دستخط کی جانی چاہیے جو مستفیدین نہ ہوں",
        signature: "دستخط",
        occupation: "پیشہ",
        witness2: "گواہ نمبر 2",
        solicitorCert: "وکیل کی تصدیق",
        solicitorCertText: "میں تصدیق کرتا/کرتی ہوں کہ:",
        cert1: "وصیت کنندہ مکمل عقل میں دکھائی دیے",
        cert2: "وصیت وصیت کنندہ کو سمجھائی گئی",
        cert3: "وصیت برطانوی قانون کے مطابق ہے",
        cert4: "گواہی کے مناسب طریقہ کار پر عمل کیا گیا",
        solicitorName: "وکیل کا نام",
        firm: "فرم",
        sraNumber: "SRA نمبر",
        islamicCert: "اسلامی تصدیق (مفتی/امام)",
        islamicCertText: "میں تصدیق کرتا/کرتی ہوں کہ میں نے اس وصیت کا جائزہ لیا ہے اور تصدیق کرتا/کرتی ہوں کہ:",
        islamic1: "وصیت ایک تہائی (1/3) سے زیادہ نہیں",
        islamic2: "قرآنی وارثوں کو وصیت سے کوئی وصیت نہیں کی گئی",
        islamic3: "فرائض کی تقسیم اسلامی شریعت کے مطابق ہے",
        islamic4: "جنازے کی خواہشات شریعت کے مطابق ہیں",
        muftiName: "مفتی/امام کا نام",
        mosque: "مسجد/ادارہ",
        contact: "رابطہ",
        firmStamp: "فرم کی مہر",
        mosqueStamp: "مسجد/ادارے کی مہر",
        generatedOn: (date) => `یہ وصیت ${date} کو اسلامی وصیت جنریٹر کے ذریعے بنائی گئی۔`,
        reviewNote: "براہ کرم دستخط سے پہلے یہ دستاویز کسی مستند وکیل اور اسلامی عالم سے جانچ کروائیں۔",
        transcriptNote: "یہ دستاویز انگریزی سے ترجمہ شدہ ہے۔ کسی تضاد کی صورت میں اصل انگریزی نسخہ قانونی طور پر مستند سمجھا جائے گا۔"
    },
    bn: {
        title: "ইসলামী উইল (ওসিয়্যাহ)",
        bismillah: "বিসমিল্লাহির রাহমানির রাহীম",
        declarationOfFaith: "ঈমানের ঘোষণা",
        declarationText: (name, address) => `আমি, <strong>${name}</strong>, <strong>${address}</strong>-এ বসবাসকারী, সুস্থ মস্তিষ্ক ও বোধগম্যতা সহকারে ঘোষণা করছি যে, আমি সাক্ষ্য দিচ্ছি যে আল্লাহ ছাড়া কোনো উপাস্য নেই এবং মুহাম্মদ (সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম) তাঁর শেষ রাসূল।`,
        willInAccordance: "আমি এই উইল ইসলামী শরীয়াহ আইন এবং ইংল্যান্ড ও ওয়েলসের আইন অনুসারে তৈরি করছি।",
        part1Title: "অংশ ১: রদকরণ",
        part1Text: "আমি এতদ্বারা আমার পূর্ববর্তী সকল উইল ও কোডিসিল রদ করছি এবং ঘোষণা করছি যে এটি আমার শেষ উইল ও টেস্টামেন্ট।",
        part2Title: "অংশ ২: নির্বাহক নিয়োগ",
        part2Text: "আমি নিম্নলিখিত ব্যক্তি(দের) এই উইলের নির্বাহক হিসেবে নিয়োগ করছি:",
        primaryExecutor: "প্রধান নির্বাহক",
        secondaryExecutor: "দ্বিতীয় নির্বাহক (প্রধান অক্ষম হলে)",
        name: "নাম",
        address: "ঠিকানা",
        relationship: "সম্পর্ক",
        part3Title: "অংশ ৩: জানাযার ব্যবস্থা",
        part3Text: "আমি নির্দেশ দিচ্ছি যে আমার মৃত্যুতে:",
        funeral1: "আমার শরীর ইসলামী রীতি অনুযায়ী গোসল ও কাফন দেওয়া হবে",
        funeral2: "জানাযার নামায আদায় করা হবে",
        funeral3: "আমাকে মুসলিম কবরস্থানে কিবলামুখী দাফন করা হবে (দাহ নয়)",
        funeral4: "আমার দাফন যত তাড়াতাড়ি সম্ভব সম্পন্ন করা হবে",
        funeral5: "আমার জানাযা সুন্নাহ অনুযায়ী সরলভাবে, অপচয় ছাড়া পরিচালিত হবে",
        repatriation: "দেশে প্রত্যাবর্তন",
        repatriationText: (country) => `আমি ${country}-এ দাফন হতে চাই। ৩ দিনের মধ্যে প্রত্যাবর্তন সম্ভব না হলে, যুক্তরাজ্যে দাফন করা হোক।`,
        preferredCemetery: "পছন্দের কবরস্থান",
        preferredMosque: "জানাযার জন্য পছন্দের মসজিদ",
        part4Title: "অংশ ৪: ঋণ ও ব্যয় পরিশোধ",
        part4Text: "আমি নির্বাহক(দের) নির্দেশ দিচ্ছি আমার সম্পত্তি থেকে নিম্নলিখিত অগ্রাধিকার অনুযায়ী পরিশোধ করতে:",
        funeralExpenses: "জানাযা ও দাফনের খরচ",
        allDebts: "আমার সকল বৈধ ঋণ",
        outstandingMahr: "স্ত্রীর বকেয়া মোহর",
        unpaidZakat: "অনাদায়ী যাকাত",
        fidyah: "ছুটে যাওয়া রোযার ফিদিয়া",
        fidyahDays: "দিন",
        kaffarah: "কাফফারা",
        hajjBadal: "আমার সম্পত্তি থেকে হজ্জে বদল-এর ব্যবস্থা করুন",
        part5Title: "অংশ ৫: ইসলামী ওসিয়্যত",
        wasiyyahYes: "ইসলামী আইন অনুসারে, আমি আমার নিট সম্পত্তির (ঋণ ও ব্যয় পরিশোধের পর) <strong>এক-তৃতীয়াংশ (১/৩)</strong> পর্যন্ত নিম্নরূপে ওসিয়্যত করছি:",
        wasiyyahNote: "দ্রষ্টব্য: এই ওসিয়্যত ইসলামী আইনে (ফারায়েয) যারা ইতিমধ্যে উত্তরাধিকারী তাদের জন্য করা যাবে না",
        beneficiary: "সুবিধাভোগী",
        percentage: "শতাংশ",
        purpose: "উদ্দেশ্য",
        bequestDetails: "দাতব্য ওসিয়্যত এবং অ-উত্তরাধিকারীদের ওসিয়্যত যথা নথিভুক্ত",
        wasiyyahNo: "আমি কোনো ওসিয়্যত করতে চাই না। আমার সম্পূর্ণ সম্পত্তি ইসলামী উত্তরাধিকার আইন (ফারায়েয) অনুযায়ী বণ্টন করা হবে।",
        part6Title: "অংশ ৬: ইসলামী উত্তরাধিকার (ফারায়েয)",
        part6Text: "আমি নির্দেশ দিচ্ছি যে আমার অবশিষ্ট সম্পত্তি (ঋণ, ব্যয় ও ওসিয়্যত পরিশোধের পর) পবিত্র কুরআন (সূরা আন-নিসা ৪:১১-১২) ও সুন্নাহ অনুযায়ী ইসলামী উত্তরাধিকার আইনে (ফারায়েয) বণ্টন করা হবে।",
        testatorInfo: "ফারায়েয গণনার জন্য ওসিয়্যতকারীর তথ্য:",
        testator: "ওসিয়্যতকারী",
        male: "পুরুষ",
        female: "মহিলা",
        maritalStatus: "বৈবাহিক অবস্থা",
        notSpecified: "উল্লেখ নেই",
        spouse: "স্বামী/স্ত্রী",
        husband: "স্বামী",
        wife: "স্ত্রী",
        entitledTo: "প্রাপ্য",
        hasChildren: "সন্তান আছে",
        yes: "হ্যাঁ",
        no: "না",
        children: "সন্তান",
        son: "পুত্র",
        daughter: "কন্যা",
        father: "পিতা",
        mother: "মাতা",
        living: "জীবিত",
        deceased: "মৃত",
        calculatedShares: "শরীয়াহ অনুযায়ী গণনাকৃত উত্তরাধিকার অংশ:",
        sharesNote: "প্রদত্ত পারিবারিক তথ্য এবং ইসলামী উত্তরাধিকার আইনের ভিত্তিতে অংশগুলি নিম্নরূপ গণনা করা হয়েছে:",
        faraidReference: "ফারায়েয রেফারেন্স (কুরআনিক অংশ):",
        faraidQuote: 'পবিত্র কুরআনে বর্ণিত - "আল্লাহ তোমাদের সন্তানদের বিষয়ে নির্দেশ দিচ্ছেন: পুরুষের অংশ দুই নারীর অংশের সমান..." (৪:১১)',
        heir: "উত্তরাধিকারী",
        withChildren: "সন্তান থাকলে",
        withoutChildren: "সন্তান না থাকলে",
        residue: "অবশিষ্ট",
        receivesDouble: "অবশিষ্ট (কন্যার দ্বিগুণ অংশ পায়)",
        sharedEqually: "সমানভাবে বণ্টিত",
        faraidImportant: "এই অংশগুলি প্রদত্ত তথ্য এবং ইসলামী শরীয়াহ আইন অনুসারে গণনা করা হয়েছে। আমি অনুরোধ করছি যে নির্বাহক(রা) বণ্টনের সময় একজন যোগ্য ইসলামী পণ্ডিত (মুফতি)-এর সাথে পরামর্শ করবেন, কারণ পরিস্থিতি পরিবর্তন হতে পারে।",
        part7Title: "অংশ ৭: অপ্রাপ্তবয়স্ক সন্তানদের অভিভাবকত্ব",
        part7Text: "আমার মৃত্যুর সময় অপ্রাপ্তবয়স্ক সন্তান থাকলে, আমি নিয়োগ করছি:",
        primaryGuardian: "প্রধান অভিভাবক",
        secondaryGuardian: "দ্বিতীয় অভিভাবক",
        guardianRequest: "আমি অনুরোধ করছি যে আমার সন্তানদের ইসলামী নীতি ও শিক্ষা অনুযায়ী লালন-পালন করা হোক।",
        part8Title: "অংশ ৮: অঙ্গদান",
        organConsent: "জীবন রক্ষার জন্য আমি অঙ্গদানে সম্মত।",
        organRefuse: "আমি অঙ্গদানে সম্মত নই।",
        organDefer: "আমি অঙ্গদানের সিদ্ধান্ত আমার পরিবার ও একজন ইসলামী পণ্ডিতের উপর ছেড়ে দিচ্ছি।",
        part9Title: "অংশ ৯: ঘোষণা",
        part9Text: "আমি ঘোষণা করছি যে:",
        declaration1: "আমার বয়স ১৮ বছরের বেশি",
        declaration2: "আমি সুস্থ মস্তিষ্কের",
        declaration3: "আমি এই উইল স্বেচ্ছায় ও স্বাধীনভাবে তৈরি করছি",
        declaration4: "আমি বুঝি যে ইসলামী অংশ আল্লাহ কর্তৃক নির্ধারিত এবং পরিবর্তনযোগ্য নয়",
        declaration5: "আমি এক-তৃতীয়াংশ ওসিয়্যত থেকে কোনো উত্তরাধিকারীকে ওসিয়্যত করিনি",
        declaration6: "মোট ওসিয়্যত আমার সম্পত্তির এক-তৃতীয়াংশের বেশি নয়",
        signatures: "স্বাক্ষর",
        testatorSig: "ওসিয়্যতকারী",
        signatureOf: "ওসিয়্যতকারীর স্বাক্ষর",
        fullName: "পূর্ণ নাম",
        date: "তারিখ",
        witness1: "সাক্ষী ১",
        witnessNote: "এই উইল দুইজন সাক্ষীর উপস্থিতিতে স্বাক্ষর করতে হবে যারা সুবিধাভোগী নন",
        signature: "স্বাক্ষর",
        occupation: "পেশা",
        witness2: "সাক্ষী ২",
        solicitorCert: "সলিসিটরের সনদপত্র",
        solicitorCertText: "আমি সনদ দিচ্ছি যে:",
        cert1: "ওসিয়্যতকারী সুস্থ মস্তিষ্কের মনে হয়েছে",
        cert2: "উইল ওসিয়্যতকারীকে ব্যাখ্যা করা হয়েছে",
        cert3: "উইল যুক্তরাজ্যের আইন মেনে চলে",
        cert4: "যথাযথ সাক্ষ্য প্রক্রিয়া অনুসরণ করা হয়েছে",
        solicitorName: "সলিসিটরের নাম",
        firm: "ফার্ম",
        sraNumber: "SRA নম্বর",
        islamicCert: "ইসলামী সনদপত্র (মুফতি/ইমাম)",
        islamicCertText: "আমি সনদ দিচ্ছি যে আমি এই উইল পর্যালোচনা করেছি এবং নিশ্চিত করছি যে:",
        islamic1: "ওসিয়্যত এক-তৃতীয়াংশ (১/৩) এর বেশি নয়",
        islamic2: "ওসিয়্যত থেকে কুরআনিক উত্তরাধিকারীদের কোনো ওসিয়্যত করা হয়নি",
        islamic3: "ফারায়েয বণ্টন ইসলামী আইন অনুসরণ করে",
        islamic4: "জানাযার ইচ্ছাসমূহ শরীয়াহ মেনে চলে",
        muftiName: "মুফতি/ইমামের নাম",
        mosque: "মসজিদ/প্রতিষ্ঠান",
        contact: "যোগাযোগ",
        firmStamp: "ফার্মের সিল",
        mosqueStamp: "মসজিদ/প্রতিষ্ঠানের সিল",
        generatedOn: (date) => `এই উইল ${date} তারিখে ইসলামী উইল জেনারেটর ব্যবহার করে তৈরি করা হয়েছে।`,
        reviewNote: "অনুগ্রহ করে স্বাক্ষরের আগে একজন যোগ্য সলিসিটর ও ইসলামী পণ্ডিত দ্বারা এই দলিল পর্যালোচনা করান।",
        transcriptNote: "এই দলিল ইংরেজি থেকে অনুবাদিত। কোনো অসঙ্গতির ক্ষেত্রে মূল ইংরেজি সংস্করণই আইনগত দলিল হিসেবে গণ্য হবে।"
    },
    ms: {
        title: "WASIAT ISLAM (WASIYYAH)",
        bismillah: "Dengan Nama Allah Yang Maha Pemurah Lagi Maha Penyayang",
        declarationOfFaith: "PENGAKUAN IMAN",
        declarationText: (name, address) => `Saya, <strong>${name}</strong>, beralamat di <strong>${address}</strong>, dengan kewarasan akal dan kefahaman yang sempurna, mengaku bahawa saya bersaksi tiada tuhan selain Allah, dan Muhammad (Sallallahu Alaihi Wasallam) adalah Rasul-Nya yang terakhir.`,
        willInAccordance: "Saya membuat Wasiat ini mengikut Undang-undang Islam (Syariah) dan undang-undang England dan Wales.",
        part1Title: "BAHAGIAN 1: PEMBATALAN",
        part1Text: "Saya dengan ini membatalkan semua Wasiat dan Kodisil yang terdahulu dan mengisytiharkan ini sebagai Wasiat Terakhir saya.",
        part2Title: "BAHAGIAN 2: PELANTIKAN WASI",
        part2Text: "Saya melantik orang berikut sebagai Wasi Wasiat ini:",
        primaryExecutor: "Wasi Utama",
        secondaryExecutor: "Wasi Kedua (jika yang utama tidak mampu bertindak)",
        name: "Nama",
        address: "Alamat",
        relationship: "Hubungan",
        part3Title: "BAHAGIAN 3: URUSAN PENGEBUMIAN",
        part3Text: "Saya mengarahkan bahawa selepas kematian saya:",
        funeral1: "Jenazah saya dimandikan (Ghusl) dan dikafankan mengikut syariat Islam",
        funeral2: "Solat Jenazah hendaklah didirikan",
        funeral3: "Saya hendaklah dikebumikan (bukan dikremasi) di tanah perkuburan Islam, menghadap Kiblat",
        funeral4: "Pengebumian saya hendaklah dilaksanakan secepat mungkin selepas kematian",
        funeral5: "Pengebumian saya hendaklah dijalankan secara sederhana, tanpa pembaziran, mengikut Sunnah",
        repatriation: "Penghantaran Pulang",
        repatriationText: (country) => `Saya ingin dikebumikan di ${country}. Jika penghantaran pulang tidak dapat dilakukan dalam 3 hari, saya hendaklah dikebumikan di UK.`,
        preferredCemetery: "Tanah Perkuburan Pilihan",
        preferredMosque: "Masjid Pilihan untuk Solat Jenazah",
        part4Title: "BAHAGIAN 4: PEMBAYARAN HUTANG DAN PERBELANJAAN",
        part4Text: "Saya mengarahkan Wasi saya membayar daripada harta pusaka mengikut keutamaan berikut:",
        funeralExpenses: "Perbelanjaan pengebumian",
        allDebts: "Semua hutang sah saya",
        outstandingMahr: "Mahar tertunggak kepada isteri",
        unpaidZakat: "Zakat yang belum dibayar",
        fidyah: "Fidyah untuk puasa yang tertinggal",
        fidyahDays: "hari",
        kaffarah: "Kaffarah",
        hajjBadal: "Mengaturkan Haji Badal daripada harta pusaka saya",
        part5Title: "BAHAGIAN 5: WASIAT ISLAM (WASIYYAH)",
        wasiyyahYes: "Mengikut Undang-undang Islam, saya mewasiatkan sehingga <strong>SATU PERTIGA (1/3)</strong> daripada harta bersih saya (selepas pembayaran hutang dan perbelanjaan) seperti berikut:",
        wasiyyahNote: "Nota: Wasiat ini tidak boleh dibuat kepada mereka yang sudah berhak mewarisi di bawah Undang-undang Islam (Faraid)",
        beneficiary: "Penerima",
        percentage: "Peratusan",
        purpose: "Tujuan",
        bequestDetails: "Wasiat kebajikan dan wasiat bukan waris seperti yang direkodkan",
        wasiyyahNo: "Saya tidak ingin membuat sebarang Wasiyyah. Seluruh harta pusaka saya hendaklah dibahagikan mengikut Undang-undang Pewarisan Islam (Faraid).",
        part6Title: "BAHAGIAN 6: PEWARISAN ISLAM (FARAID)",
        part6Text: "Saya mengarahkan bahawa baki harta pusaka saya (selepas pembayaran hutang, perbelanjaan, dan Wasiyyah) hendaklah dibahagikan mengikut Undang-undang Pewarisan Islam (Faraid) seperti yang ditetapkan dalam Al-Quran (Surah An-Nisa 4:11-12) dan Sunnah.",
        testatorInfo: "Maklumat Pewasiat untuk Pengiraan Faraid:",
        testator: "Pewasiat",
        male: "Lelaki",
        female: "Perempuan",
        maritalStatus: "Status Perkahwinan",
        notSpecified: "Tidak dinyatakan",
        spouse: "Pasangan",
        husband: "Suami",
        wife: "Isteri",
        entitledTo: "berhak kepada",
        hasChildren: "Ada Anak",
        yes: "Ya",
        no: "Tidak",
        children: "Anak-anak",
        son: "Anak Lelaki",
        daughter: "Anak Perempuan",
        father: "Bapa",
        mother: "Ibu",
        living: "Hidup",
        deceased: "Meninggal",
        calculatedShares: "Bahagian Warisan yang Dikira Mengikut Syariah:",
        sharesNote: "Berdasarkan maklumat keluarga yang diberikan dan undang-undang pewarisan Islam, bahagian dikira seperti berikut:",
        faraidReference: "Rujukan Faraid (Bahagian Quraniik):",
        faraidQuote: 'Seperti yang diperintahkan dalam Al-Quran - "Allah perintahkan kamu mengenai anak-anak kamu: bahagian anak lelaki sama dengan bahagian dua anak perempuan..." (4:11)',
        heir: "Waris",
        withChildren: "Dengan Anak",
        withoutChildren: "Tanpa Anak",
        residue: "Baki",
        receivesDouble: "Baki (menerima dua kali bahagian anak perempuan)",
        sharedEqually: "dibahagikan sama rata",
        faraidImportant: "Bahagian-bahagian ini dikira berdasarkan maklumat yang diberikan dan mengikut undang-undang Syariah Islam. Saya memohon agar Wasi saya berunding dengan ulama Islam yang berkelayakan (Mufti) untuk pengiraan akhir bahagian Faraid semasa pengagihan, kerana keadaan mungkin berubah.",
        part7Title: "BAHAGIAN 7: PENJAGAAN ANAK DI BAWAH UMUR",
        part7Text: "Jika saya mempunyai anak di bawah umur semasa kematian, saya melantik:",
        primaryGuardian: "Penjaga Utama",
        secondaryGuardian: "Penjaga Kedua",
        guardianRequest: "Saya memohon agar anak-anak saya dibesarkan mengikut prinsip dan ajaran Islam.",
        part8Title: "BAHAGIAN 8: DERMA ORGAN",
        organConsent: "Saya bersetuju dengan pendermaan organ untuk menyelamatkan nyawa.",
        organRefuse: "Saya tidak bersetuju dengan pendermaan organ.",
        organDefer: "Saya menyerahkan keputusan pendermaan organ kepada keluarga dan ulama Islam pada masa itu.",
        part9Title: "BAHAGIAN 9: PENGAKUAN",
        part9Text: "Saya mengaku bahawa:",
        declaration1: "Saya berumur lebih 18 tahun",
        declaration2: "Saya waras",
        declaration3: "Saya membuat Wasiat ini secara bebas dan sukarela",
        declaration4: "Saya memahami bahawa bahagian Islam ditetapkan oleh Allah dan tidak boleh diubah",
        declaration5: "Saya tidak membuat sebarang wasiat kepada waris daripada bahagian satu pertiga Wasiyyah",
        declaration6: "Jumlah Wasiyyah tidak melebihi satu pertiga harta pusaka saya",
        signatures: "TANDATANGAN",
        testatorSig: "PEWASIAT",
        signatureOf: "Tandatangan Pewasiat",
        fullName: "Nama Penuh",
        date: "Tarikh",
        witness1: "SAKSI 1",
        witnessNote: "Wasiat ini mesti ditandatangani di hadapan dua orang saksi yang bukan penerima manfaat",
        signature: "Tandatangan",
        occupation: "Pekerjaan",
        witness2: "SAKSI 2",
        solicitorCert: "PENGESAHAN PEGUAM",
        solicitorCertText: "Saya mengesahkan bahawa:",
        cert1: "Pewasiat kelihatan waras",
        cert2: "Wasiat telah dijelaskan kepada Pewasiat",
        cert3: "Wasiat mematuhi undang-undang UK",
        cert4: "Prosedur penyaksian yang betul telah diikuti",
        solicitorName: "Nama Peguam",
        firm: "Firma",
        sraNumber: "Nombor SRA",
        islamicCert: "PENGESAHAN ISLAM (MUFTI/IMAM)",
        islamicCertText: "Saya mengesahkan bahawa saya telah menyemak Wasiat ini dan mengesahkan bahawa:",
        islamic1: "Wasiyyah tidak melebihi satu pertiga (1/3)",
        islamic2: "Tiada wasiat dibuat kepada waris Qurani daripada Wasiyyah",
        islamic3: "Pengagihan Faraid mengikut undang-undang Islam",
        islamic4: "Hasrat pengebumian mematuhi Syariah",
        muftiName: "Nama Mufti/Imam",
        mosque: "Masjid/Institusi",
        contact: "Hubungi",
        firmStamp: "Cop Firma",
        mosqueStamp: "Cop Masjid/Institusi",
        generatedOn: (date) => `Wasiat ini dijana pada ${date} menggunakan Penjana Wasiat Islam.`,
        reviewNote: "Sila semak dokumen ini oleh peguam berkelayakan dan ulama Islam sebelum menandatangani.",
        transcriptNote: "Dokumen ini telah diterjemahkan daripada Bahasa Inggeris. Versi Bahasa Inggeris asal hendaklah dianggap sebagai teks undang-undang yang sah sekiranya terdapat sebarang percanggahan."
    },
    id: {
        title: "WASIAT ISLAM (WASIYYAH)",
        bismillah: "Dengan Nama Allah Yang Maha Pengasih Lagi Maha Penyayang",
        declarationOfFaith: "PERNYATAAN IMAN",
        declarationText: (name, address) => `Saya, <strong>${name}</strong>, beralamat di <strong>${address}</strong>, dengan akal sehat dan pemahaman yang sempurna, menyatakan bahwa saya bersaksi tiada tuhan selain Allah, dan Muhammad (Shallallahu Alaihi Wasallam) adalah Rasul-Nya yang terakhir.`,
        willInAccordance: "Saya membuat Wasiat ini sesuai dengan Hukum Islam (Syariah) dan hukum Inggris dan Wales.",
        part1Title: "BAGIAN 1: PENCABUTAN",
        part1Text: "Dengan ini saya mencabut semua Wasiat dan Kodisil sebelumnya dan menyatakan ini sebagai Wasiat Terakhir saya.",
        part2Title: "BAGIAN 2: PENUNJUKAN PELAKSANA",
        part2Text: "Saya menunjuk orang berikut sebagai Pelaksana Wasiat ini:",
        primaryExecutor: "Pelaksana Utama",
        secondaryExecutor: "Pelaksana Kedua (jika yang utama tidak mampu bertindak)",
        name: "Nama",
        address: "Alamat",
        relationship: "Hubungan",
        part3Title: "BAGIAN 3: PENGATURAN PEMAKAMAN",
        part3Text: "Saya mengarahkan bahwa setelah kematian saya:",
        funeral1: "Jenazah saya dimandikan (Ghusl) dan dikafani sesuai syariat Islam",
        funeral2: "Sholat Jenazah hendaknya dilaksanakan",
        funeral3: "Saya hendaknya dimakamkan (bukan dikremasi) di pemakaman Muslim, menghadap Kiblat",
        funeral4: "Pemakaman saya hendaknya dilaksanakan sesegera mungkin setelah kematian",
        funeral5: "Pemakaman saya hendaknya dijalankan secara sederhana, tanpa pemborosan, sesuai Sunnah",
        repatriation: "Pemulangan",
        repatriationText: (country) => `Saya ingin dimakamkan di ${country}. Jika pemulangan tidak dapat dilakukan dalam 3 hari, saya hendaknya dimakamkan di UK.`,
        preferredCemetery: "Pemakaman Pilihan",
        preferredMosque: "Masjid Pilihan untuk Sholat Jenazah",
        part4Title: "BAGIAN 4: PEMBAYARAN UTANG DAN PENGELUARAN",
        part4Text: "Saya mengarahkan Pelaksana saya untuk membayar dari harta warisan sesuai prioritas berikut:",
        funeralExpenses: "Biaya pemakaman dan penguburan",
        allDebts: "Semua utang sah saya",
        outstandingMahr: "Mahar yang belum dibayarkan kepada istri",
        unpaidZakat: "Zakat yang belum dibayarkan",
        fidyah: "Fidyah untuk puasa yang terlewat",
        fidyahDays: "hari",
        kaffarah: "Kaffarah",
        hajjBadal: "Mengatur Haji Badal dari harta warisan saya",
        part5Title: "BAGIAN 5: WASIAT ISLAM (WASIYYAH)",
        wasiyyahYes: "Sesuai dengan Hukum Islam, saya mewasiatkan hingga <strong>SEPERTIGA (1/3)</strong> dari harta bersih saya (setelah pembayaran utang dan pengeluaran) sebagai berikut:",
        wasiyyahNote: "Catatan: Wasiat ini tidak dapat dibuat untuk mereka yang sudah berhak mewarisi menurut Hukum Islam (Faraid)",
        beneficiary: "Penerima Manfaat",
        percentage: "Persentase",
        purpose: "Tujuan",
        bequestDetails: "Wasiat amal dan wasiat non-ahli waris sebagaimana tercatat",
        wasiyyahNo: "Saya tidak ingin membuat Wasiyyah. Seluruh harta warisan saya hendaknya dibagikan sesuai Hukum Waris Islam (Faraid).",
        part6Title: "BAGIAN 6: WARISAN ISLAM (FARAID)",
        part6Text: "Saya mengarahkan bahwa sisa harta warisan saya (setelah pembayaran utang, pengeluaran, dan Wasiyyah) hendaknya dibagikan sesuai Hukum Waris Islam (Faraid) sebagaimana ditetapkan dalam Al-Quran (Surah An-Nisa 4:11-12) dan Sunnah.",
        testatorInfo: "Informasi Pewasiat untuk Perhitungan Faraid:",
        testator: "Pewasiat",
        male: "Laki-laki",
        female: "Perempuan",
        maritalStatus: "Status Pernikahan",
        notSpecified: "Tidak ditentukan",
        spouse: "Pasangan",
        husband: "Suami",
        wife: "Istri",
        entitledTo: "berhak atas",
        hasChildren: "Memiliki Anak",
        yes: "Ya",
        no: "Tidak",
        children: "Anak-anak",
        son: "Putra",
        daughter: "Putri",
        father: "Ayah",
        mother: "Ibu",
        living: "Hidup",
        deceased: "Almarhum/Almarhumah",
        calculatedShares: "Bagian Warisan yang Dihitung Sesuai Syariah:",
        sharesNote: "Berdasarkan informasi keluarga yang diberikan dan hukum waris Islam, bagian-bagian dihitung sebagai berikut:",
        faraidReference: "Referensi Faraid (Bagian Qurani):",
        faraidQuote: 'Sebagaimana diperintahkan dalam Al-Quran - "Allah memerintahkan kamu tentang anak-anakmu: bagian anak laki-laki sama dengan bagian dua anak perempuan..." (4:11)',
        heir: "Ahli Waris",
        withChildren: "Dengan Anak",
        withoutChildren: "Tanpa Anak",
        residue: "Sisa",
        receivesDouble: "Sisa (menerima dua kali bagian anak perempuan)",
        sharedEqually: "dibagi sama rata",
        faraidImportant: "Bagian-bagian ini dihitung berdasarkan informasi yang diberikan dan sesuai dengan hukum Syariah Islam. Saya meminta agar Pelaksana saya berkonsultasi dengan ulama Islam yang berkualifikasi (Mufti) untuk perhitungan akhir bagian Faraid saat pembagian, karena keadaan mungkin berubah.",
        part7Title: "BAGIAN 7: PERWALIAN ANAK DI BAWAH UMUR",
        part7Text: "Jika saya memiliki anak di bawah umur saat kematian, saya menunjuk:",
        primaryGuardian: "Wali Utama",
        secondaryGuardian: "Wali Kedua",
        guardianRequest: "Saya meminta agar anak-anak saya dibesarkan sesuai dengan prinsip dan ajaran Islam.",
        part8Title: "BAGIAN 8: DONOR ORGAN",
        organConsent: "Saya menyetujui donasi organ untuk menyelamatkan nyawa.",
        organRefuse: "Saya tidak menyetujui donasi organ.",
        organDefer: "Saya menyerahkan keputusan donasi organ kepada keluarga dan ulama Islam pada saat itu.",
        part9Title: "BAGIAN 9: PERNYATAAN",
        part9Text: "Saya menyatakan bahwa:",
        declaration1: "Saya berusia di atas 18 tahun",
        declaration2: "Saya berakal sehat",
        declaration3: "Saya membuat Wasiat ini dengan bebas dan sukarela",
        declaration4: "Saya memahami bahwa bagian Islam ditetapkan oleh Allah dan tidak dapat diubah",
        declaration5: "Saya tidak membuat wasiat kepada ahli waris dari bagian sepertiga Wasiyyah",
        declaration6: "Total Wasiyyah tidak melebihi sepertiga dari harta warisan saya",
        signatures: "TANDA TANGAN",
        testatorSig: "PEWASIAT",
        signatureOf: "Tanda Tangan Pewasiat",
        fullName: "Nama Lengkap",
        date: "Tanggal",
        witness1: "SAKSI 1",
        witnessNote: "Wasiat ini harus ditandatangani di hadapan dua saksi yang bukan penerima manfaat",
        signature: "Tanda Tangan",
        occupation: "Pekerjaan",
        witness2: "SAKSI 2",
        solicitorCert: "SERTIFIKASI PENGACARA",
        solicitorCertText: "Saya menyatakan bahwa:",
        cert1: "Pewasiat tampak berakal sehat",
        cert2: "Wasiat telah dijelaskan kepada Pewasiat",
        cert3: "Wasiat sesuai dengan hukum UK",
        cert4: "Prosedur penyaksian yang benar telah diikuti",
        solicitorName: "Nama Pengacara",
        firm: "Firma",
        sraNumber: "Nomor SRA",
        islamicCert: "SERTIFIKASI ISLAM (MUFTI/IMAM)",
        islamicCertText: "Saya menyatakan bahwa saya telah meninjau Wasiat ini dan mengonfirmasi bahwa:",
        islamic1: "Wasiyyah tidak melebihi sepertiga (1/3)",
        islamic2: "Tidak ada wasiat yang dibuat untuk ahli waris Qurani dari Wasiyyah",
        islamic3: "Distribusi Faraid mengikuti hukum Islam",
        islamic4: "Keinginan pemakaman sesuai dengan Syariah",
        muftiName: "Nama Mufti/Imam",
        mosque: "Masjid/Lembaga",
        contact: "Kontak",
        firmStamp: "Cap Firma",
        mosqueStamp: "Cap Masjid/Lembaga",
        generatedOn: (date) => `Wasiat ini dibuat pada ${date} menggunakan Pembuat Wasiat Islam.`,
        reviewNote: "Harap dokumen ini ditinjau oleh pengacara dan ulama Islam yang berkualifikasi sebelum ditandatangani.",
        transcriptNote: "Dokumen ini telah diterjemahkan dari Bahasa Inggris. Versi Bahasa Inggris asli hendaknya dianggap sebagai teks hukum yang sah jika terdapat ketidaksesuaian."
    },
    tr: {
        title: "İSLAMİ VASİYETNAME (VASİYYE)",
        bismillah: "Rahman ve Rahim olan Allah'ın adıyla",
        declarationOfFaith: "İMAN BEYANI",
        declarationText: (name, address) => `Ben, <strong>${name}</strong>, <strong>${address}</strong> adresinde ikamet eden, aklı başında ve anlayış sahibi olarak, Allah'tan başka ilah olmadığına ve Muhammed'in (Sallallahu Aleyhi Vesellem) O'nun son elçisi olduğuna şehadet ettiğimi beyan ederim.`,
        willInAccordance: "Bu vasiyetnameyi İslam Hukuku (Şeriat) ve İngiltere ve Galler yasalarına uygun olarak hazırlıyorum.",
        part1Title: "BÖLÜM 1: İPTAL",
        part1Text: "Bu vesileyle önceki tüm vasiyetnamelerimi ve ek vasiyetlerimi iptal eder ve bunun Son Vasiyetnamem olduğunu beyan ederim.",
        part2Title: "BÖLÜM 2: VASİ TAYİNİ",
        part2Text: "Bu Vasiyetnamenin Vasisi olarak aşağıdaki kişi(leri) tayin ediyorum:",
        primaryExecutor: "Birincil Vasi",
        secondaryExecutor: "İkincil Vasi (birincil görev yapamaz ise)",
        name: "Ad",
        address: "Adres",
        relationship: "İlişki",
        part3Title: "BÖLÜM 3: CENAZE DÜZENLEMELERİ",
        part3Text: "Vefatımda şunları yönerge olarak bildiriyorum:",
        funeral1: "Cenazemem İslami usullere göre yıkanması (Gusül) ve kefenlenmesi",
        funeral2: "Cenaze namazının kılınması",
        funeral3: "Müslüman mezarlığında veya mezarlığın Müslüman bölümünde Kıble'ye yöneltilebilecek şekilde defnedilmem (yakılmam)",
        funeral4: "Defnimin vefatımdan sonra mümkün olan en kısa sürede yapılması",
        funeral5: "Cenaze törenimin Sünnet'e uygun olarak sade, israf olmadan yapılması",
        repatriation: "Nakil",
        repatriationText: (country) => `${country}'de defnedilmek istiyorum. 3 gün içinde nakil mümkün olmazsa, İngiltere'de defnedilmeliyim.`,
        preferredCemetery: "Tercih Edilen Mezarlık",
        preferredMosque: "Cenaze Namazı İçin Tercih Edilen Cami",
        part4Title: "BÖLÜM 4: BORÇLARIN VE GİDERLERİN ÖDENMESİ",
        part4Text: "Vasime, mirasımdan aşağıdaki öncelik sırasına göre ödeme yapmasını yönlendiriyorum:",
        funeralExpenses: "Cenaze ve defin masrafları",
        allDebts: "Tüm yasal borçlarım",
        outstandingMahr: "Eşime ödenmemiş Mehir",
        unpaidZakat: "Ödenmemiş Zekat",
        fidyah: "Kaçırılan oruçlar için Fidye",
        fidyahDays: "gün",
        kaffarah: "Keffaret",
        hajjBadal: "Mirasımdan Bedel Haccı düzenleyin",
        part5Title: "BÖLÜM 5: İSLAMİ VASİYET (VASİYYE)",
        wasiyyahYes: "İslam Hukukuna uygun olarak, net mirasımın (borç ve giderlerin ödenmesinden sonra) <strong>ÜÇTE BİRİNE (1/3)</strong> kadarını aşağıdaki şekilde vasiyet ediyorum:",
        wasiyyahNote: "Not: Bu vasiyet, İslam Hukuku (Feraiz) kapsamında zaten miras almaya hak kazananlara yapılamaz",
        beneficiary: "Lehtar",
        percentage: "Yüzde",
        purpose: "Amaç",
        bequestDetails: "Hayır vasiyetleri ve varis olmayan vasiyetler kaydedildiği şekilde",
        wasiyyahNo: "Herhangi bir Vasiyye yapmak istemiyorum. Tüm mirasım İslami Miras Hukuku (Feraiz) uyarınca dağıtılacaktır.",
        part6Title: "BÖLÜM 6: İSLAMİ MİRAS (FERAİZ)",
        part6Text: "Mirasımın kalanının (borçlar, giderler ve Vasiyye ödendikten sonra) Kur'an-ı Kerim'de (Nisa Suresi 4:11-12) ve Sünnet'te belirtildiği üzere İslami Miras Hukuku (Feraiz) uyarınca dağıtılmasını yönlendiriyorum.",
        testatorInfo: "Feraiz Hesaplaması İçin Vasiyet Eden Bilgileri:",
        testator: "Vasiyet Eden",
        male: "Erkek",
        female: "Kadın",
        maritalStatus: "Medeni Durum",
        notSpecified: "Belirtilmemiş",
        spouse: "Eş",
        husband: "Koca",
        wife: "Karı",
        entitledTo: "hakkı",
        hasChildren: "Çocuğu Var",
        yes: "Evet",
        no: "Hayır",
        children: "Çocuklar",
        son: "Oğul",
        daughter: "Kız",
        father: "Baba",
        mother: "Anne",
        living: "Yaşıyor",
        deceased: "Vefat etmiş",
        calculatedShares: "Şeriata Göre Hesaplanmış Miras Payları:",
        sharesNote: "Verilen aile bilgileri ve İslami miras hukuku temelinde paylar aşağıdaki şekilde hesaplanmıştır:",
        faraidReference: "Feraiz Referansı (Kurani Paylar):",
        faraidQuote: 'Kur\'an-ı Kerim\'de buyurulduğu üzere - "Allah size çocuklarınız hakkında şunu emreder: Erkeğin payı, iki kadının payına eşittir..." (4:11)',
        heir: "Varis",
        withChildren: "Çocuk Varken",
        withoutChildren: "Çocuk Yokken",
        residue: "Kalan",
        receivesDouble: "Kalan (kızın payının iki katını alır)",
        sharedEqually: "eşit olarak paylaşılır",
        faraidImportant: "Bu paylar verilen bilgiler temelinde ve İslam Şeriat hukuku uyarınca hesaplanmıştır. Vasimden, koşullar değişebileceğinden, dağıtım sırasında Feraiz paylarının nihai hesaplaması için yetkin bir İslam alimiyle (Müftü) istişare etmesini rica ediyorum.",
        part7Title: "BÖLÜM 7: KÜÇÜK ÇOCUKLARIN VELAYETİ",
        part7Text: "Vefatım sırasında küçük çocuklarım varsa, şu kişileri tayin ediyorum:",
        primaryGuardian: "Birincil Veli",
        secondaryGuardian: "İkincil Veli",
        guardianRequest: "Çocuklarımın İslami ilke ve öğretilere göre yetiştirilmesini rica ediyorum.",
        part8Title: "BÖLÜM 8: ORGAN BAĞIŞI",
        organConsent: "Hayat kurtarmak için organ bağışına rıza gösteriyorum.",
        organRefuse: "Organ bağışına rıza göstermiyorum.",
        organDefer: "Organ bağışı kararını aileme ve o zamanki bir İslam alimine bırakıyorum.",
        part9Title: "BÖLÜM 9: BEYAN",
        part9Text: "Beyan ederim ki:",
        declaration1: "18 yaşından büyüğüm",
        declaration2: "Aklı başında biriyim",
        declaration3: "Bu Vasiyeti özgür irademle ve gönüllü olarak yapıyorum",
        declaration4: "İslami payların Allah tarafından belirlendiğini ve değiştirilemeyeceğini anlıyorum",
        declaration5: "Üçte bir Vasiyye payından herhangi bir varise vasiyet yapmadım",
        declaration6: "Toplam Vasiyye mirasımın üçte birini aşmıyor",
        signatures: "İMZALAR",
        testatorSig: "VASİYET EDEN",
        signatureOf: "Vasiyet Edenin İmzası",
        fullName: "Tam Ad",
        date: "Tarih",
        witness1: "TANIK 1",
        witnessNote: "Bu Vasiyet, lehtar olmayan iki tanığın huzurunda imzalanmalıdır",
        signature: "İmza",
        occupation: "Meslek",
        witness2: "TANIK 2",
        solicitorCert: "AVUKAT SERTİFİKASI",
        solicitorCertText: "Tasdik ederim ki:",
        cert1: "Vasiyet eden aklı başında görünüyordu",
        cert2: "Vasiyet, vasiyet edene açıklandı",
        cert3: "Vasiyet İngiltere yasalarına uygundur",
        cert4: "Uygun tanıklık prosedürleri izlendi",
        solicitorName: "Avukat Adı",
        firm: "Firma",
        sraNumber: "SRA Numarası",
        islamicCert: "İSLAMİ SERTİFİKA (MÜFTÜ/İMAM)",
        islamicCertText: "Bu Vasiyeti incelediğimi ve şunları tasdik ettiğimi beyan ederim:",
        islamic1: "Vasiyye üçte biri (1/3) aşmıyor",
        islamic2: "Vasiyyeden Kurani varislere vasiyet yapılmamıştır",
        islamic3: "Feraiz dağıtımı İslam hukukuna uygundur",
        islamic4: "Cenaze istekleri Şeriata uygundur",
        muftiName: "Müftü/İmam Adı",
        mosque: "Cami/Kurum",
        contact: "İletişim",
        firmStamp: "Firma Mührü",
        mosqueStamp: "Cami/Kurum Mührü",
        generatedOn: (date) => `Bu Vasiyet ${date} tarihinde İslami Vasiyet Oluşturucu kullanılarak oluşturuldu.`,
        reviewNote: "Lütfen imzalamadan önce bu belgeyi yetkin bir avukat ve İslam alimine inceletin.",
        transcriptNote: "Bu belge İngilizce'den tercüme edilmiştir. Herhangi bir tutarsızlık durumunda orijinal İngilizce metin yasal olarak geçerli metin olarak kabul edilecektir."
    },
    fr: {
        title: "TESTAMENT ISLAMIQUE (WASIYYAH)",
        bismillah: "Au Nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux",
        declarationOfFaith: "DÉCLARATION DE FOI",
        declarationText: (name, address) => `Je, <strong>${name}</strong>, demeurant au <strong>${address}</strong>, étant sain d'esprit et de compréhension, déclare que j'atteste qu'il n'y a de dieu qu'Allah et que Muhammad (paix et bénédictions sur lui) est Son dernier Messager.`,
        willInAccordance: "Je rédige ce Testament conformément à la Loi Islamique (Charia) et aux lois d'Angleterre et du Pays de Galles.",
        part1Title: "PARTIE 1 : RÉVOCATION",
        part1Text: "Je révoque par la présente tous mes Testaments et Codicilles antérieurs et déclare ceci comme mon Dernier Testament.",
        part2Title: "PARTIE 2 : NOMINATION DES EXÉCUTEURS",
        part2Text: "Je nomme la/les personne(s) suivante(s) comme Exécuteur(s) de ce Testament :",
        primaryExecutor: "Exécuteur Principal",
        secondaryExecutor: "Exécuteur Secondaire (si le principal est empêché)",
        name: "Nom",
        address: "Adresse",
        relationship: "Lien de parenté",
        part3Title: "PARTIE 3 : DISPOSITIONS FUNÉRAIRES",
        part3Text: "J'ordonne qu'à mon décès :",
        funeral1: "Mon corps soit lavé (Ghusl) et enveloppé (Kafan) selon les rites islamiques",
        funeral2: "La prière funéraire (Janazah) soit accomplie",
        funeral3: "Je sois enterré(e) (non incinéré(e)) dans un cimetière musulman, face à la Qibla",
        funeral4: "Mon enterrement ait lieu le plus rapidement possible après mon décès",
        funeral5: "Mes funérailles soient conduites simplement, sans extravagance, conformément à la Sounna",
        repatriation: "Rapatriement",
        repatriationText: (country) => `Je souhaite être enterré(e) en/au ${country}. Si le rapatriement n'est pas possible dans les 3 jours, je devrais être enterré(e) au Royaume-Uni.`,
        preferredCemetery: "Cimetière Préféré",
        preferredMosque: "Mosquée Préférée pour la Janazah",
        part4Title: "PARTIE 4 : PAIEMENT DES DETTES ET DÉPENSES",
        part4Text: "J'ordonne à mon/mes Exécuteur(s) de payer de ma succession dans l'ordre de priorité suivant :",
        funeralExpenses: "Mes frais funéraires et d'enterrement",
        allDebts: "Toutes mes dettes légitimes",
        outstandingMahr: "Mahr (dot) impayé à mon épouse",
        unpaidZakat: "Zakat impayée",
        fidyah: "Fidyah pour les jeûnes manqués",
        fidyahDays: "jours",
        kaffarah: "Kaffarah",
        hajjBadal: "Organiser un Hajj Badal (pèlerinage par procuration) de ma succession",
        part5Title: "PARTIE 5 : LEGS ISLAMIQUE (WASIYYAH)",
        wasiyyahYes: "Conformément à la Loi Islamique, je lègue jusqu'à <strong>UN TIERS (1/3)</strong> de ma succession nette (après paiement des dettes et dépenses) comme suit :",
        wasiyyahNote: "Note : Ce legs ne peut être fait à ceux qui ont déjà droit à l'héritage en vertu de la Loi Islamique (Faraid)",
        beneficiary: "Bénéficiaire",
        percentage: "Pourcentage",
        purpose: "Objet",
        bequestDetails: "Legs caritatifs et legs aux non-héritiers tels qu'enregistrés",
        wasiyyahNo: "Je ne souhaite pas faire de Wasiyyah. L'intégralité de ma succession sera distribuée selon la Loi de l'Héritage Islamique (Faraid).",
        part6Title: "PARTIE 6 : HÉRITAGE ISLAMIQUE (FARAID)",
        part6Text: "J'ordonne que le reste de ma succession (après paiement des dettes, dépenses et Wasiyyah) soit distribué selon la Loi de l'Héritage Islamique (Faraid) telle que prescrite dans le Saint Coran (Sourate An-Nisa 4:11-12) et la Sounna.",
        testatorInfo: "Informations du Testateur pour le Calcul du Faraid :",
        testator: "Testateur",
        male: "Homme",
        female: "Femme",
        maritalStatus: "Situation Matrimoniale",
        notSpecified: "Non spécifié",
        spouse: "Conjoint(e)",
        husband: "Époux",
        wife: "Épouse",
        entitledTo: "ayant droit à",
        hasChildren: "A des Enfants",
        yes: "Oui",
        no: "Non",
        children: "Enfants",
        son: "Fils",
        daughter: "Fille",
        father: "Père",
        mother: "Mère",
        living: "Vivant(e)",
        deceased: "Décédé(e)",
        calculatedShares: "Parts d'Héritage Calculées Selon la Charia :",
        sharesNote: "Sur la base des informations familiales fournies et de la loi de l'héritage islamique, les parts sont calculées comme suit :",
        faraidReference: "Référence Faraid (Parts Coraniques) :",
        faraidQuote: "Tel qu'ordonné dans le Saint Coran - \"Allah vous ordonne concernant vos enfants : pour le mâle, une part égale à celle de deux femmes...\" (4:11)",
        heir: "Héritier",
        withChildren: "Avec Enfants",
        withoutChildren: "Sans Enfants",
        residue: "Résidu",
        receivesDouble: "Résidu (reçoit le double de la part de la fille)",
        sharedEqually: "partagé également",
        faraidImportant: "Ces parts sont calculées sur la base des informations fournies et conformément à la loi de la Charia islamique. Je demande que mon/mes Exécuteur(s) consulte(nt) un savant islamique qualifié (Mufti) pour le calcul final des parts de Faraid au moment de la distribution, car les circonstances peuvent changer.",
        part7Title: "PARTIE 7 : TUTELLE DES ENFANTS MINEURS",
        part7Text: "Si j'ai des enfants mineurs au moment de mon décès, je nomme :",
        primaryGuardian: "Tuteur Principal",
        secondaryGuardian: "Tuteur Secondaire",
        guardianRequest: "Je demande que mes enfants soient élevés selon les principes et enseignements islamiques.",
        part8Title: "PARTIE 8 : DON D'ORGANES",
        organConsent: "Je consens au don d'organes pour sauver des vies.",
        organRefuse: "Je ne consens pas au don d'organes.",
        organDefer: "Je laisse la décision du don d'organes à ma famille et à un savant islamique le moment venu.",
        part9Title: "PARTIE 9 : DÉCLARATION",
        part9Text: "Je déclare que :",
        declaration1: "J'ai plus de 18 ans",
        declaration2: "Je suis sain(e) d'esprit",
        declaration3: "Je fais ce Testament librement et volontairement",
        declaration4: "Je comprends que les parts islamiques sont fixées par Allah et ne peuvent être modifiées",
        declaration5: "Je n'ai fait aucun legs à un héritier de la portion d'un tiers de la Wasiyyah",
        declaration6: "Le total de la Wasiyyah ne dépasse pas un tiers de ma succession",
        signatures: "SIGNATURES",
        testatorSig: "TESTATEUR",
        signatureOf: "Signature du Testateur",
        fullName: "Nom Complet",
        date: "Date",
        witness1: "TÉMOIN 1",
        witnessNote: "Ce Testament doit être signé en présence de deux témoins qui ne sont pas bénéficiaires",
        signature: "Signature",
        occupation: "Profession",
        witness2: "TÉMOIN 2",
        solicitorCert: "CERTIFICATION DU NOTAIRE",
        solicitorCertText: "Je certifie que :",
        cert1: "Le Testateur semblait sain d'esprit",
        cert2: "Le Testament a été expliqué au Testateur",
        cert3: "Le Testament est conforme à la loi britannique",
        cert4: "Les procédures de témoignage appropriées ont été suivies",
        solicitorName: "Nom du Notaire",
        firm: "Cabinet",
        sraNumber: "Numéro SRA",
        islamicCert: "CERTIFICATION ISLAMIQUE (MUFTI/IMAM)",
        islamicCertText: "Je certifie avoir examiné ce Testament et confirme que :",
        islamic1: "La Wasiyyah ne dépasse pas un tiers (1/3)",
        islamic2: "Aucun legs n'est fait aux héritiers coraniques de la Wasiyyah",
        islamic3: "La distribution du Faraid suit la loi islamique",
        islamic4: "Les souhaits funéraires sont conformes à la Charia",
        muftiName: "Nom du Mufti/Imam",
        mosque: "Mosquée/Institution",
        contact: "Contact",
        firmStamp: "Cachet du Cabinet",
        mosqueStamp: "Cachet de la Mosquée/Institution",
        generatedOn: (date) => `Ce Testament a été généré le ${date} à l'aide du Générateur de Testament Islamique.`,
        reviewNote: "Veuillez faire examiner ce document par un notaire qualifié et un savant islamique avant de le signer.",
        transcriptNote: "Ce document a été traduit de l'anglais. La version originale en anglais doit être considérée comme le texte juridique faisant autorité en cas de divergence."
    },
    so: {
        title: "DARDAARAN ISLAAMIGA AH (WASIYYAH)",
        bismillah: "Bismillaahi Raxmaani Raxiim",
        declarationOfFaith: "QIRAALKA IIMAANKA",
        declarationText: (name, address) => `Aniga, <strong>${name}</strong>, deggan <strong>${address}</strong>, iyadoo aan caqli buuxda iyo faham leh, waxaan qiraa inaan markhaati ka ahay in aanay jirin ilaah la caabudo oo xaq ah Allaah mooyee, iyo in Muxammed (Sallallaahu Calayhi Wasallam) uu yahay Rasuulkiisa ugu dambeeya.`,
        willInAccordance: "Waxaan sameeyey Dardaarankan si waafaqsan Sharciga Islaamka (Shareecada) iyo sharciyada England iyo Wales.",
        part1Title: "QAYBTA 1AAD: BURINTIISA",
        part1Text: "Waxaan halkan ku burinayaa dhammaan Dardaarannadaydii hore waxaanan ku dhawaaqayaa inay tani tahay Dardaarankaygii ugu dambeeyay.",
        part2Title: "QAYBTA 2AAD: MAGACAABISTA FULIYAYAASHA",
        part2Text: "Waxaan u magacaabayaa qof(yaalka) soo socda inay fuliyayaasha Dardaarankan noqdaan:",
        primaryExecutor: "Fuliyaha Koowaad",
        secondaryExecutor: "Fuliyaha Labaad (haddii kii hore aanu awoodi karin)",
        name: "Magaca",
        address: "Cinwaanka",
        relationship: "Xiriirka",
        part3Title: "QAYBTA 3AAD: QABANQAABADA AASKA",
        part3Text: "Waxaan amraa in markii aan dhinto:",
        funeral1: "Jidhkayga la maydho (Ghusl) loona kafano si waafaqsan caadooyinka Islaamka",
        funeral2: "Salaadda Janaasooyinka la tukaado",
        funeral3: "La ii aaso (aan la i gubin) xabaalaha Muslimiinta, Qiblada la iigu jeediyona",
        funeral4: "Aaskaygu uu dhaco sida ugu dhakhsaha badan ee macquulka ah",
        funeral5: "Aaskaygu uu si fudud u dhaco, bilaash wax isticmaal ah, oo waafaqsan Sunnada",
        repatriation: "Dib-u-celin",
        repatriationText: (country) => `Waxaan doonayaa in la i aaso ${country}. Haddii dib-u-celintu aanay suurtogal ahayn 3 maalmood gudahooda, waa la i aasi karaa UK.`,
        preferredCemetery: "Xabaalaha La Doorbiday",
        preferredMosque: "Masjidka La Doorbiday ee Salaadda Janaasada",
        part4Title: "QAYBTA 4AAD: BIXINTA DEYMAHA IYO KHARASHKA",
        part4Text: "Waxaan ku amrayaa Fuliyahayga inay hantidayda ka bixiyaan sida soo socota oo kala horreeya:",
        funeralExpenses: "Kharashka aaska iyo aasidda",
        allDebts: "Dhammaan deymahayga sharci ah",
        outstandingMahr: "Meherka aan la bixin ee xaaskayda",
        unpaidZakat: "Zakada aan la bixin",
        fidyah: "Fidyada soonka la waayay",
        fidyahDays: "maalmood",
        kaffarah: "Kaffaarad",
        hajjBadal: "Hagaaji Xajka Badalka hantidayda",
        part5Title: "QAYBTA 5AAD: DARDAARANTAN ISLAAMIGA AH (WASIYYAH)",
        wasiyyahYes: "Si waafaqsan Sharciga Islaamka, waxaan dardaaranayaa ilaa <strong>SADDEX MEELOOD (1/3)</strong> hantidayda saafiga ah (ka dib bixinta deymaha iyo kharashka) sida soo socota:",
        wasiyyahNote: "Fiiro gaar ah: Dardaarantan looma samayn karo kuwa horeba ay xaq u leeyihiin inay dhaxlaan Sharciga Islaamka (Faraid)",
        beneficiary: "Ka-faa'iideysta",
        percentage: "Boqolkiiba",
        purpose: "Ujeeddo",
        bequestDetails: "Dardaarannada khayriyadda iyo kuwa aan dhaxlayaasha ahayn sida la diiwaangeliyay",
        wasiyyahNo: "Ma doonayo inaan sameeyo Wasiyyah. Hantidayda oo dhan waxaa loo qaybinayaa Sharciga Dhaxalka Islaamiga ah (Faraid).",
        part6Title: "QAYBTA 6AAD: DHAXALKA ISLAAMIGA AH (FARAID)",
        part6Text: "Waxaan amraa in inta ka hadhay hantidayda (ka dib bixinta deymaha, kharashka, iyo Wasiyyahda) loo qaybiyio Sharciga Dhaxalka Islaamiga ah (Faraid) sida ku qoran Quraanka Kariimka (Suurat An-Nisaa 4:11-12) iyo Sunnada.",
        testatorInfo: "Macluumaadka Qofka Dardaaranaya ee Xisaabinta Faraid:",
        testator: "Qofka Dardaaranaya",
        male: "Lab",
        female: "Dhedig",
        maritalStatus: "Xaaladda Guurka",
        notSpecified: "Lama cayimin",
        spouse: "Xaaska/Ninkeeda",
        husband: "Ninka",
        wife: "Xaaska",
        entitledTo: "xaq u leh",
        hasChildren: "Waa leh Caruur",
        yes: "Haa",
        no: "Maya",
        children: "Carruurta",
        son: "Wiilka",
        daughter: "Gabadha",
        father: "Aabbaha",
        mother: "Hooyada",
        living: "Nool",
        deceased: "Dhintay",
        calculatedShares: "Qaybaha Dhaxalka ee La Xisaabiyay ee Shareecada:",
        sharesNote: "Iyadoo lagu saleynayo macluumaadka qoyska la bixiyay iyo sharciga dhaxalka Islaamka, qaybaha waxaa loo xisaabiyay sida soo socota:",
        faraidReference: "Tixraaca Faraid (Qaybaha Quraanka):",
        faraidQuote: 'Sida Quraanka Kariimka lagu amray - "Allaah wuxuu idinku amrayaa arrintan carruurtiinna: wiilku wuxuu leeyahay wax la mid ah labada gabar..." (4:11)',
        heir: "Dhaxle",
        withChildren: "Carruur La Leeyahay",
        withoutChildren: "Carruur La'aan",
        residue: "Inta Hadhay",
        receivesDouble: "Inta Hadhay (wuxuu helaa laba jeer qeybta gabadha)",
        sharedEqually: "si siman loo qaybiyay",
        faraidImportant: "Qaybahaan waxaa lagu xisaabiyay macluumaadkii la bixiyay iyo Sharciga Shareecada Islaamiga ah. Waxaan ka codsanayaa Fuliyahayga inuu la tashaddo culimo Islaami ah oo xirfad leh (Mufti) xisaabinta ugu dambaysa ee qaybaha Faraid wakhtiga qaybinta, maxaa yeelay xaaladuhu way isbeddeli karaan.",
        part7Title: "QAYBTA 7AAD: MAS'UULIYADDA CARRUURTA YARYAR",
        part7Text: "Haddii aan leeyahay carruur yar wakhtiga dhimashadayda, waxaan magacaabayaa:",
        primaryGuardian: "Mas'uulka Koowaad",
        secondaryGuardian: "Mas'uulka Labaad",
        guardianRequest: "Waxaan codsanayaa in carruurteydii loo korinayo mabaadiidda iyo cilmiga Islaamka.",
        part8Title: "QAYBTA 8AAD: KU DEEQISTA XUBNAHA",
        organConsent: "Waan ogolahay ku deeqista xubnaha si ay nafaf u badbaadiyaan.",
        organRefuse: "Kama ogola ku deeqista xubnaha.",
        organDefer: "Go'aanka ku deeqista xubnaha waxaan u daayaa qoyskaygii iyo culimada Islaamka wakhtiga.",
        part9Title: "QAYBTA 9AAD: QIRASHO",
        part9Text: "Waxaan qiraa in:",
        declaration1: "Da'daydu ka weyn tahay 18 sano",
        declaration2: "Caqli buuxa leeyahay",
        declaration3: "Dardaarankan si xor ah oo ikhtiyaar ah ayaan u sameeyey",
        declaration4: "Waan fahamaa in qaybaha Islaamku ay yihiin kuwa Allaah dejiyay oo aan la beddelin karin",
        declaration5: "Kuma samayn dardaaran dhaxle oo ka mid ah saddex meeloodka Wasiyyahda",
        declaration6: "Wadarta Wasiyyahdu kama badan saddex meeloodka hantidayda",
        signatures: "SAXIIXYADA",
        testatorSig: "QOFKA DARDAARANAYA",
        signatureOf: "Saxiixa Qofka Dardaaranaya",
        fullName: "Magaca Buuxa",
        date: "Taariikhda",
        witness1: "MARKHAATI 1AAD",
        witnessNote: "Dardaarankan waxaa la saxiixi karaa laba markhaati oo aan ka faa'iidaysanayaal ahayn",
        signature: "Saxiixa",
        occupation: "Shaqada",
        witness2: "MARKHAATI 2AAD",
        solicitorCert: "XAQIIJINTA QAREENKA",
        solicitorCertText: "Waxaan xaqiijinayaa in:",
        cert1: "Qofka dardaaranaya uu u muuqday caqli buuxa",
        cert2: "Dardaaranku loo sharxay qofka dardaaranaya",
        cert3: "Dardaaranku uu waafaqsan yahay sharciga UK",
        cert4: "Qaababka markhaatiga saxda ah la raaciyay",
        solicitorName: "Magaca Qareenka",
        firm: "Shirkadda",
        sraNumber: "Lambarka SRA",
        islamicCert: "XAQIIJINTA ISLAAMIGA AH (MUFTI/IMAAM)",
        islamicCertText: "Waxaan xaqiijinayaa inaan dib u eegay Dardaarankan waxaanan xaqiijinayaa in:",
        islamic1: "Wasiyyahdu kama badna saddex meelood (1/3)",
        islamic2: "Dardaarannooyin looma samaynin dhaxlayaasha Quraanka Wasiyyahda",
        islamic3: "Qaybinta Faraid ay raacdo sharciga Islaamka",
        islamic4: "Rabbitaannada aaska ay waafaqsan yihiin Shareecada",
        muftiName: "Magaca Muftiga/Imaamka",
        mosque: "Masjidka/Hay'adda",
        contact: "Xiriir",
        firmStamp: "Shaabiga Shirkadda",
        mosqueStamp: "Shaabiga Masjidka/Hay'adda",
        generatedOn: (date) => `Dardaarankan waxaa la sameeyay ${date} isticmaalka Soo Saaraha Dardaarantan Islaamiga ah.`,
        reviewNote: "Fadlan ka hor saxiixa, dukumeentigan ha dib u eego qareen iyo culimo Islaami ah oo xirfad leh.",
        transcriptNote: "Dukumeentigan waxaa laga turjumay Ingriisiga. Nuskhada asalka ah ee Ingriisiga ayaa loo tixgeliyaa qoraalka sharciga ee la aamino marka ay jirto kala duwanaansho."
    }
};

// Helper to get RTL languages
function isRTL(lang) {
    return ['ar', 'ur'].includes(lang);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    initSupabase();
    initProgressSteps();
    updateProgress();
    setupEventListeners();
    loadProgress();
    setupToolbarUpdates();
    console.log('Initialization complete');
});

// Setup toolbar auto-updates
function setupToolbarUpdates() {
    const nameInput = document.getElementById('fullName');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            updateToolbar(e.target.value);
        });
    }
}

// Update toolbar with client name
function updateToolbar(name) {
    const titleEl = document.getElementById('currentClientName');
    if (titleEl) {
        titleEl.textContent = name || 'New Will';
    }
}

// Initialize progress steps
function initProgressSteps() {
    const stepsContainer = document.getElementById('progressSteps');
    const stepLabels = [
        'Welcome', 'Personal', 'Executors', 'Funeral', 'Family',
        'Debts', 'Assets', 'Wasiyyah', 'Guardian', 'Special', 'Review', 'Complete'
    ];

    stepsContainer.innerHTML = stepLabels.map((label, index) => `
        <div class="progress-step ${index + 1 === currentStep ? 'active' : ''}" data-step="${index + 1}">
            <span class="progress-step-number">${index + 1}</span>
            <span class="progress-step-label">${label}</span>
        </div>
    `).join('');
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${percentage}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });

    // Update navigation buttons
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'flex';

    const nextBtn = document.getElementById('nextBtn');
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
    } else if (currentStep === totalSteps - 1) {
        nextBtn.innerHTML = 'Generate Will <span class="icon">✓</span>';
        nextBtn.style.display = 'flex';
    } else {
        nextBtn.innerHTML = 'Next <span class="icon">→</span>';
        nextBtn.style.display = 'flex';
    }
}

// Change step
function changeStep(direction) {
    // Validate current step before proceeding
    if (direction === 1 && !validateStep(currentStep)) {
        return;
    }

    // Save current step data
    saveStepData();

    // Move to next/prev step
    currentStep += direction;
    currentStep = Math.max(1, Math.min(totalSteps, currentStep));

    // Update UI
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');

    updateProgress();

    // Special handling for review and generate steps
    if (currentStep === 11) {
        generateReview();
    } else if (currentStep === 12) {
        generateWill();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Go to specific step
function goToStep(step) {
    saveStepData();
    currentStep = step;

    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate step
function validateStep(step) {
    let isValid = true;
    const currentStepEl = document.querySelector(`.step[data-step="${step}"]`);

    // Step-specific validation
    if (step === 1) {
        const shahadaCheck = document.getElementById('shahadaConfirm');
        if (!shahadaCheck.checked) {
            alert('Please confirm the Declaration of Faith (Shahada) to proceed.');
            return false;
        }
        return true;
    }

    // Check required text/select fields (not checkboxes or radios)
    const requiredFields = currentStepEl.querySelectorAll('input[required]:not([type="checkbox"]):not([type="radio"]), select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc2626';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }

    return isValid;
}

// Save step data
function saveStepData() {
    const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    const inputs = currentStepEl.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else {
            formData[input.id] = input.value;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Burial location toggle
    document.querySelectorAll('input[name="burialLocation"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('repatriationCountryGroup').style.display =
                e.target.value === 'repatriate' ? 'block' : 'none';
        });
    });

    // Marital status toggle
    document.getElementById('maritalStatus').addEventListener('change', (e) => {
        document.getElementById('spouseSection').style.display =
            e.target.value === 'married' ? 'block' : 'none';
    });

    // Mahr status toggle
    document.querySelectorAll('input[name="mahrStatus"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('mahrAmountGroup').style.display =
                e.target.value === 'outstanding' ? 'block' : 'none';
        });
    });

    // Children toggle
    document.querySelectorAll('input[name="hasChildren"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('childrenSection').style.display =
                e.target.value === 'yes' ? 'block' : 'none';
        });
    });

    // Parent status toggles
    document.getElementById('fatherStatus').addEventListener('change', (e) => {
        document.getElementById('fatherNameGroup').style.display =
            e.target.value === 'living' ? 'block' : 'none';
    });

    document.getElementById('motherStatus').addEventListener('change', (e) => {
        document.getElementById('motherNameGroup').style.display =
            e.target.value === 'living' ? 'block' : 'none';
    });

    // Hajj status toggle
    document.getElementById('hajjStatus').addEventListener('change', (e) => {
        document.getElementById('hajjBadalSection').style.display =
            e.target.value === 'obligatory-not-performed' ? 'block' : 'none';
    });

    // Crypto toggle
    document.getElementById('hasCrypto').addEventListener('change', (e) => {
        document.getElementById('cryptoSection').style.display =
            e.target.checked ? 'block' : 'none';
    });

    // Wasiyyah toggle
    document.querySelectorAll('input[name="makeWasiyyah"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('wasiyyahSection').style.display =
                e.target.value === 'yes' ? 'block' : 'none';
        });
    });

    // Minor children toggle
    document.querySelectorAll('input[name="hasMinorChildren"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('guardianshipSection').style.display =
                e.target.value === 'yes' ? 'block' : 'none';
        });
    });

    // Non-Muslim relatives toggle
    document.querySelectorAll('input[name="hasNonMuslimRelatives"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('nonMuslimSection').style.display =
                e.target.value === 'yes' ? 'block' : 'none';
        });
    });
}

// Dynamic list functions
function addChild() {
    childCount++;
    const container = document.getElementById('childrenList');
    const html = `
        <div class="list-item" id="child-${childCount}">
            <div class="list-item-header">
                <span class="list-item-title">Child ${childCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('child-${childCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="childName-${childCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Gender</label>
                    <select class="form-input" id="childGender-${childCount}">
                        <option value="male">Male (Son)</option>
                        <option value="female">Female (Daughter)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" class="form-input" id="childDOB-${childCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">From Marriage To</label>
                    <input type="text" class="form-input" id="childMother-${childCount}" placeholder="Mother's name">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addDebt() {
    debtCount++;
    const container = document.getElementById('debtsList');
    const html = `
        <div class="list-item" id="debt-${debtCount}">
            <div class="list-item-header">
                <span class="list-item-title">Debt ${debtCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('debt-${debtCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Creditor Name</label>
                    <input type="text" class="form-input" id="debtCreditor-${debtCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-input" id="debtType-${debtCount}">
                        <option value="Mortgage">Mortgage</option>
                        <option value="Loan">Personal Loan</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Car Finance">Car Finance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount Owed</label>
                    <input type="number" class="form-input" id="debtAmount-${debtCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addDebtOwed() {
    debtOwedCount++;
    const container = document.getElementById('debtsOwedList');
    const html = `
        <div class="list-item" id="debtOwed-${debtOwedCount}">
            <div class="list-item-header">
                <span class="list-item-title">Debt Owed to Me ${debtOwedCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('debtOwed-${debtOwedCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Debtor Name</label>
                    <input type="text" class="form-input" id="debtOwedDebtor-${debtOwedCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="number" class="form-input" id="debtOwedAmount-${debtOwedCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addProperty() {
    propertyCount++;
    const container = document.getElementById('propertiesList');
    const html = `
        <div class="list-item" id="property-${propertyCount}">
            <div class="list-item-header">
                <span class="list-item-title">Property ${propertyCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('property-${propertyCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group full-width">
                    <label class="form-label">Property Address</label>
                    <textarea class="form-input" id="propertyAddress-${propertyCount}" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" class="form-input" id="propertyCountry-${propertyCount}" value="United Kingdom">
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-input" id="propertyType-${propertyCount}">
                        <option value="Freehold">Freehold</option>
                        <option value="Leasehold">Leasehold</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Ownership</label>
                    <select class="form-input" id="propertyOwnership-${propertyCount}">
                        <option value="Sole">Sole Owner</option>
                        <option value="Joint Tenants">Joint Tenants</option>
                        <option value="Tenants in Common">Tenants in Common</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input type="number" class="form-input" id="propertyValue-${propertyCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addBankAccount() {
    bankCount++;
    const container = document.getElementById('bankAccountsList');
    const html = `
        <div class="list-item" id="bank-${bankCount}">
            <div class="list-item-header">
                <span class="list-item-title">Bank Account ${bankCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('bank-${bankCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-input" id="bankName-${bankCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Account Type</label>
                    <select class="form-input" id="bankType-${bankCount}">
                        <option value="Current">Current Account</option>
                        <option value="Savings">Savings Account</option>
                        <option value="ISA">ISA</option>
                        <option value="Joint">Joint Account</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Approximate Balance</label>
                    <input type="number" class="form-input" id="bankBalance-${bankCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addInvestment() {
    investmentCount++;
    const container = document.getElementById('investmentsList');
    const html = `
        <div class="list-item" id="investment-${investmentCount}">
            <div class="list-item-header">
                <span class="list-item-title">Investment ${investmentCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('investment-${investmentCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-input" id="investmentType-${investmentCount}">
                        <option value="Stocks/Shares">Stocks/Shares</option>
                        <option value="Bonds">Bonds</option>
                        <option value="Unit Trusts">Unit Trusts</option>
                        <option value="Pension">Pension</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Provider</label>
                    <input type="text" class="form-input" id="investmentProvider-${investmentCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input type="number" class="form-input" id="investmentValue-${investmentCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addBusiness() {
    businessCount++;
    const container = document.getElementById('businessList');
    const html = `
        <div class="list-item" id="business-${businessCount}">
            <div class="list-item-header">
                <span class="list-item-title">Business ${businessCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('business-${businessCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Business Name</label>
                    <input type="text" class="form-input" id="businessName-${businessCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-input" id="businessType-${businessCount}">
                        <option value="Sole Trader">Sole Trader</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Limited Company">Limited Company</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Ownership %</label>
                    <input type="number" class="form-input" id="businessOwnership-${businessCount}" placeholder="%" max="100">
                </div>
                <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input type="number" class="form-input" id="businessValue-${businessCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addVehicle() {
    vehicleCount++;
    const container = document.getElementById('vehiclesList');
    const html = `
        <div class="list-item" id="vehicle-${vehicleCount}">
            <div class="list-item-header">
                <span class="list-item-title">Vehicle ${vehicleCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('vehicle-${vehicleCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Make & Model</label>
                    <input type="text" class="form-input" id="vehicleMake-${vehicleCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Registration</label>
                    <input type="text" class="form-input" id="vehicleReg-${vehicleCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input type="number" class="form-input" id="vehicleValue-${vehicleCount}" placeholder="£">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addValuable() {
    valuableCount++;
    const container = document.getElementById('valuablesList');
    const html = `
        <div class="list-item" id="valuable-${valuableCount}">
            <div class="list-item-header">
                <span class="list-item-title">Valuable ${valuableCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('valuable-${valuableCount}')">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Item Description</label>
                    <input type="text" class="form-input" id="valuableDesc-${valuableCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-input" id="valuableCategory-${valuableCount}">
                        <option value="Jewellery">Jewellery</option>
                        <option value="Gold/Silver">Gold/Silver</option>
                        <option value="Watch">Watch</option>
                        <option value="Art">Art</option>
                        <option value="Antiques">Antiques</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Estimated Value</label>
                    <input type="number" class="form-input" id="valuableValue-${valuableCount}" placeholder="£">
                </div>
                <div class="form-group">
                    <label class="form-label">Specific Recipient (optional)</label>
                    <input type="text" class="form-input" id="valuableRecipient-${valuableCount}" placeholder="Leave blank for Faraid distribution">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addCharitable() {
    charitableCount++;
    const container = document.getElementById('charitableList');
    const html = `
        <div class="list-item" id="charitable-${charitableCount}">
            <div class="list-item-header">
                <span class="list-item-title">Charity ${charitableCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('charitable-${charitableCount}'); updateWasiyyahMeter();">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Charity Name</label>
                    <input type="text" class="form-input" id="charityName-${charitableCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Registration Number (optional)</label>
                    <input type="text" class="form-input" id="charityReg-${charitableCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Percentage of Estate</label>
                    <input type="number" class="form-input" id="charityPercent-${charitableCount}" placeholder="%" max="33" onchange="updateWasiyyahMeter()">
                </div>
                <div class="form-group">
                    <label class="form-label">Purpose (optional)</label>
                    <input type="text" class="form-input" id="charityPurpose-${charitableCount}" placeholder="e.g., Mosque building, education">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addNonHeir() {
    nonHeirCount++;
    const container = document.getElementById('nonHeirList');
    const html = `
        <div class="list-item" id="nonHeir-${nonHeirCount}">
            <div class="list-item-header">
                <span class="list-item-title">Non-Heir ${nonHeirCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('nonHeir-${nonHeirCount}'); updateWasiyyahMeter();">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-input" id="nonHeirName-${nonHeirCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Relationship</label>
                    <input type="text" class="form-input" id="nonHeirRelation-${nonHeirCount}" placeholder="e.g., Friend, Nephew">
                </div>
                <div class="form-group">
                    <label class="form-label">Percentage of Estate</label>
                    <input type="number" class="form-input" id="nonHeirPercent-${nonHeirCount}" placeholder="%" max="33" onchange="updateWasiyyahMeter()">
                </div>
                <div class="form-group">
                    <label class="form-label">Reason (optional)</label>
                    <input type="text" class="form-input" id="nonHeirReason-${nonHeirCount}">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addAdopted() {
    adoptedCount++;
    const container = document.getElementById('adoptedList');
    const html = `
        <div class="list-item" id="adopted-${adoptedCount}">
            <div class="list-item-header">
                <span class="list-item-title">Adopted Child ${adoptedCount}</span>
                <button type="button" class="list-item-remove" onclick="removeItem('adopted-${adoptedCount}'); updateWasiyyahMeter();">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-input" id="adoptedName-${adoptedCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Date Adopted</label>
                    <input type="date" class="form-input" id="adoptedDate-${adoptedCount}">
                </div>
                <div class="form-group">
                    <label class="form-label">Percentage of Estate</label>
                    <input type="number" class="form-input" id="adoptedPercent-${adoptedCount}" placeholder="%" max="33" onchange="updateWasiyyahMeter()">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function removeItem(id) {
    document.getElementById(id).remove();
}

function updateWasiyyahMeter() {
    let total = 0;

    // Sum all wasiyyah percentages
    document.querySelectorAll('[id^="charityPercent-"], [id^="nonHeirPercent-"], [id^="adoptedPercent-"]').forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    const percentage = Math.min(total, 100);
    document.getElementById('wasiyyahPercentage').textContent = `${total.toFixed(1)}%`;
    document.getElementById('wasiyyahFill').style.width = `${percentage}%`;

    // Change color if over limit
    if (total > 33.33) {
        document.getElementById('wasiyyahFill').style.background = 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)';
    } else {
        document.getElementById('wasiyyahFill').style.background = 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
    }
}

// Save progress to localStorage and optionally to Supabase
async function saveProgress() {
    saveStepData();

    // Collect all dynamic list data
    formData.children = collectListData('child', childCount, ['Name', 'Gender', 'DOB', 'Mother']);
    formData.debts = collectListData('debt', debtCount, ['Creditor', 'Type', 'Amount']);
    formData.properties = collectListData('property', propertyCount, ['Address', 'Country', 'Type', 'Ownership', 'Value']);
    formData.bankAccounts = collectListData('bank', bankCount, ['Name', 'Type', 'Balance']);
    formData.investments = collectListData('investment', investmentCount, ['Type', 'Provider', 'Value']);
    formData.businesses = collectListData('business', businessCount, ['Name', 'Type', 'Ownership', 'Value']);
    formData.vehicles = collectListData('vehicle', vehicleCount, ['Make', 'Reg', 'Value']);
    formData.valuables = collectListData('valuable', valuableCount, ['Desc', 'Category', 'Value', 'Recipient']);
    formData.charities = collectListData('charity', charitableCount, ['Name', 'Reg', 'Percent', 'Purpose']);
    formData.nonHeirs = collectListData('nonHeir', nonHeirCount, ['Name', 'Relation', 'Percent', 'Reason']);
    formData.adopted = collectListData('adopted', adoptedCount, ['Name', 'Date', 'Percent']);

    formData.currentStep = currentStep;

    // Save to localStorage
    localStorage.setItem('islamicWillData', JSON.stringify(formData));
    alert('Progress saved! You can continue later.');
}

// Save completed will to Supabase
async function saveWillToDatabase(status = 'draft') {
    if (!supabaseClient) {
        console.warn('Supabase not initialized, skipping database save');
        return null;
    }

    saveStepData();

    // Collect all data
    formData.children = collectListData('child', childCount, ['Name', 'Gender', 'DOB', 'Mother']);
    formData.debts = collectListData('debt', debtCount, ['Creditor', 'Type', 'Amount']);
    formData.properties = collectListData('property', propertyCount, ['Address', 'Country', 'Type', 'Ownership', 'Value']);
    formData.bankAccounts = collectListData('bank', bankCount, ['Name', 'Type', 'Balance']);
    formData.investments = collectListData('investment', investmentCount, ['Type', 'Provider', 'Value']);
    formData.businesses = collectListData('business', businessCount, ['Name', 'Type', 'Ownership', 'Value']);
    formData.vehicles = collectListData('vehicle', vehicleCount, ['Make', 'Reg', 'Value']);
    formData.valuables = collectListData('valuable', valuableCount, ['Desc', 'Category', 'Value', 'Recipient']);
    formData.charities = collectListData('charity', charitableCount, ['Name', 'Reg', 'Percent', 'Purpose']);
    formData.nonHeirs = collectListData('nonHeir', nonHeirCount, ['Name', 'Relation', 'Percent', 'Reason']);
    formData.adopted = collectListData('adopted', adoptedCount, ['Name', 'Date', 'Percent']);

    try {
        const willRecord = {
            // Testator Personal Info
            testator_name: formData.fullName || '',
            testator_aka: formData.alsoKnownAs || '',
            testator_email: formData.email || '',
            testator_phone: formData.phone || '',
            testator_address: formData.address || '',
            testator_dob: formData.dateOfBirth || null,
            testator_pob: formData.placeOfBirth || '',
            testator_gender: formData.testatorGender || '',
            testator_ni: formData.niNumber || '',
            testator_passport: formData.passportNumber || '',
            testator_country: formData.countryOfOrigin || '',

            // Will Type
            will_type: formData.willType || 'simple',

            // Executor 1
            executor1_name: formData.executor1Name || '',
            executor1_address: formData.executor1Address || '',
            executor1_relationship: formData.executor1Relationship || '',
            executor1_phone: formData.executor1Phone || '',
            executor1_email: formData.executor1Email || '',

            // Executor 2
            executor2_name: formData.executor2Name || '',
            executor2_address: formData.executor2Address || '',
            executor2_relationship: formData.executor2Relationship || '',
            executor2_phone: formData.executor2Phone || '',
            executor2_email: formData.executor2Email || '',

            // Funeral
            burial_location: formData.burialLocation || 'uk',
            repatriation_country: formData.repatriationCountry || '',
            preferred_cemetery: formData.preferredCemetery || '',
            preferred_mosque: formData.preferredMosque || '',
            funeral_instructions: formData.funeralInstructions || '',
            funeral_budget: formData.funeralBudget ? parseFloat(formData.funeralBudget) : 0,

            // Family
            marital_status: formData.maritalStatus || '',
            spouse_name: formData.spouseName || '',
            marriage_date: formData.marriageDate || null,
            mahr_status: formData.mahrStatus || '',
            mahr_amount: formData.mahrAmount ? parseFloat(formData.mahrAmount) : 0,
            has_children: formData.hasChildren === 'yes',
            father_status: formData.fatherStatus || '',
            father_name: formData.fatherName || '',
            mother_status: formData.motherStatus || '',
            mother_name: formData.motherName || '',

            // Religious Obligations
            unpaid_zakat: formData.unpaidZakat ? parseFloat(formData.unpaidZakat) : 0,
            fidyah_days: formData.fidyahDays ? parseInt(formData.fidyahDays) : 0,
            kaffarah: formData.kaffarah ? parseFloat(formData.kaffarah) : 0,
            hajj_status: formData.hajjStatus || '',
            hajj_badal: formData.arrangeHajjBadal || false,
            forgiven_debts: formData.forgivenDebts || '',

            // Wasiyyah
            make_wasiyyah: formData.makeWasiyyah === 'yes',

            // Guardianship
            has_minor_children: formData.hasMinorChildren === 'yes',
            guardian1_name: formData.guardian1Name || '',
            guardian1_address: formData.guardian1Address || '',
            guardian1_relationship: formData.guardian1Relationship || '',
            guardian1_phone: formData.guardian1Phone || '',
            guardian1_religion: formData.guardian1Religion || '',
            guardian2_name: formData.guardian2Name || '',
            guardian2_address: formData.guardian2Address || '',
            guardian2_relationship: formData.guardian2Relationship || '',
            upbringing_wishes: formData.otherUpbringingWishes || '',

            // Special
            organ_donation: formData.organDonation || 'defer',
            has_non_muslim_relatives: formData.hasNonMuslimRelatives === 'yes',
            non_muslim_relatives: formData.nonMuslimRelatives || '',
            preferred_scholar: formData.preferredScholar || '',
            madhab: formData.madhab || '',
            additional_wishes: formData.additionalWishes || '',
            people_forgiven: formData.peopleForgiven || '',

            // All Data as JSON (backup)
            will_data: formData,
            children_data: formData.children || [],
            debts_data: formData.debts || [],
            assets_data: {
                properties: formData.properties || [],
                bankAccounts: formData.bankAccounts || [],
                investments: formData.investments || [],
                businesses: formData.businesses || [],
                vehicles: formData.vehicles || [],
                valuables: formData.valuables || []
            },
            wasiyyah_data: {
                charities: formData.charities || [],
                nonHeirs: formData.nonHeirs || [],
                adopted: formData.adopted || []
            },

            // Status
            status: status
        };

        // Check if we're updating an existing will or creating new
        if (formData.willId) {
            // Update existing
            const { data, error } = await supabaseClient
                .from('islamic_wills')
                .update(willRecord)
                .eq('id', formData.willId)
                .select()
                .single();

            if (error) throw error;
            return data;
        }

        const { data, error } = await supabaseClient
            .from('islamic_wills')
            .insert(willRecord)
            .select()
            .single();

        if (error) throw error;

        formData.willId = data.id;
        localStorage.setItem('islamicWillData', JSON.stringify(formData));

        return data;
    } catch (error) {
        console.error('Error saving will:', error);
        throw error;
    }
}

function collectListData(prefix, count, fields) {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const el = document.getElementById(`${prefix}-${i}`);
        if (el) {
            const item = {};
            fields.forEach(field => {
                const input = document.getElementById(`${prefix}${field}-${i}`);
                if (input) item[field.toLowerCase()] = input.value;
            });
            items.push(item);
        }
    }
    return items;
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('islamicWillData');
    if (saved) {
        formData = JSON.parse(saved);
        // Restore would need more complex logic - simplified for now
    }
}

// Save and start new client
async function saveAndStartNew() {
    if (!formData.fullName) {
        if (!confirm('No client data entered. Start a new will anyway?')) {
            return;
        }
    } else {
        // Save current progress
        saveStepData();

        // Collect all data
        formData.children = collectListData('child', childCount, ['Name', 'Gender', 'DOB', 'Mother']);
        formData.debts = collectListData('debt', debtCount, ['Creditor', 'Type', 'Amount']);
        formData.properties = collectListData('property', propertyCount, ['Address', 'Country', 'Type', 'Ownership', 'Value']);

        // Save to database if available
        if (supabaseClient) {
            try {
                await saveWillToDatabase();
                alert(`Will for ${formData.fullName} saved successfully!`);
            } catch (error) {
                console.error('Error saving:', error);
                // Save to localStorage as backup
                const savedWills = JSON.parse(localStorage.getItem('savedWills') || '[]');
                formData.savedAt = new Date().toISOString();
                formData.localId = Date.now();
                savedWills.push(formData);
                localStorage.setItem('savedWills', JSON.stringify(savedWills));
                alert(`Will saved locally for ${formData.fullName}`);
            }
        } else {
            // Save to localStorage
            const savedWills = JSON.parse(localStorage.getItem('savedWills') || '[]');
            formData.savedAt = new Date().toISOString();
            formData.localId = Date.now();
            savedWills.push(formData);
            localStorage.setItem('savedWills', JSON.stringify(savedWills));
            alert(`Will saved locally for ${formData.fullName}`);
        }
    }

    // Reset form
    resetForm();
}

// Reset form for new client
function resetForm() {
    console.log('resetForm called');

    // Confirm if there's data
    if (formData.fullName && !confirm('Are you sure you want to start a new will? Unsaved changes will be lost.')) {
        return;
    }

    // Clear form data
    formData = {};
    localStorage.removeItem('islamicWillData');

    // Update toolbar
    updateToolbar('');

    // Reset counters
    childCount = 0;
    debtCount = 0;
    debtOwedCount = 0;
    propertyCount = 0;
    bankCount = 0;
    investmentCount = 0;
    businessCount = 0;
    vehicleCount = 0;
    valuableCount = 0;
    charitableCount = 0;
    nonHeirCount = 0;
    adoptedCount = 0;

    // Clear all dynamic lists
    document.querySelectorAll('#childrenList, #debtsList, #debtsOwedList, #propertiesList, #bankAccountsList, #investmentsList, #businessList, #vehiclesList, #valuablesList, #charitableList, #nonHeirList, #adoptedList').forEach(el => {
        if (el) el.innerHTML = '';
    });

    // Reset all form inputs
    document.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = input.defaultChecked;
        } else {
            input.value = input.defaultValue || '';
        }
    });

    // Go to step 1
    currentStep = 1;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.step[data-step="1"]').classList.add('active');
    updateProgress();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Variables for load options
let pendingLoadWill = null;

// Load saved wills modal
async function loadSavedWills() {
    console.log('loadSavedWills called');

    const modal = document.getElementById('savedWillsModal');
    const listContainer = document.getElementById('savedWillsList');

    if (!modal) {
        console.error('Modal element not found!');
        alert('Error: Could not open saved wills panel');
        return;
    }

    modal.style.display = 'flex';
    listContainer.innerHTML = '<p>Loading saved wills...</p>';

    let wills = [];

    // Try to load from Supabase
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('islamic_wills')
                .select('id, testator_name, testator_email, will_type, status, created_at, reference_number')
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                wills = data.map(w => ({
                    id: w.id,
                    name: w.testator_name,
                    email: w.testator_email,
                    type: w.will_type,
                    status: w.status || 'draft',
                    date: w.created_at,
                    reference: w.reference_number,
                    source: 'database'
                }));
            }
        } catch (e) {
            console.warn('Could not load from database:', e);
        }
    }

    // Also load from localStorage
    const localWills = JSON.parse(localStorage.getItem('savedWills') || '[]');
    localWills.forEach(w => {
        wills.push({
            id: w.localId,
            name: w.fullName,
            email: w.email,
            type: w.willType,
            status: w.isCompleted ? 'completed' : 'draft',
            date: w.savedAt,
            source: 'local'
        });
    });

    if (wills.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #64748b;">No saved wills found.</p>';
        return;
    }

    listContainer.innerHTML = wills.map(w => `
        <div class="saved-will-card">
            <div class="saved-will-info">
                <h4>${w.name || 'Unnamed'} ${w.reference ? `<small>(${w.reference})</small>` : ''}</h4>
                <p>${w.email || 'No email'} • ${w.type || 'simple'} will • ${new Date(w.date).toLocaleDateString()}</p>
                <span class="status-badge ${w.status}">${w.status === 'completed' ? '✓ Completed' : 'Draft'}</span>
                <span style="font-size: 0.75rem; color: #94a3b8; margin-left: 0.5rem;">${w.source === 'local' ? '(Local)' : '(Database)'}</span>
            </div>
            <div class="saved-will-actions">
                <button class="btn btn-primary" onclick="showLoadOptions('${w.id}', '${w.source}', '${(w.name || 'Client').replace(/'/g, "\\'")}')">
                    ${w.status === 'completed' ? '📄 Open' : '✏️ Edit'}
                </button>
                <button class="btn btn-secondary" onclick="deleteWill('${w.id}', '${w.source}')" style="color: #dc2626;">Delete</button>
            </div>
        </div>
    `).join('');
}

// Show load options modal
function showLoadOptions(id, source, name) {
    pendingLoadWill = { id, source };
    document.getElementById('loadWillName').textContent = name;
    document.getElementById('savedWillsModal').style.display = 'none';
    document.getElementById('loadOptionsModal').style.display = 'flex';
}

// Close load options modal
function closeLoadOptionsModal() {
    document.getElementById('loadOptionsModal').style.display = 'none';
    pendingLoadWill = null;
}

// Load will and view the document
async function loadWillAndView() {
    if (!pendingLoadWill) return;

    closeLoadOptionsModal();

    await loadWillData(pendingLoadWill.id, pendingLoadWill.source);

    // Go directly to step 12 and generate the will
    currentStep = 12;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.step[data-step="12"]').classList.add('active');
    updateProgress();

    // Generate the will document
    generateWillFromData();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load will and edit
async function loadWillAndEdit() {
    if (!pendingLoadWill) return;

    closeLoadOptionsModal();

    await loadWillData(pendingLoadWill.id, pendingLoadWill.source);

    // Go to step 2 (personal details) to continue editing
    currentStep = 2;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.step[data-step="2"]').classList.add('active');
    updateProgress();

    // Populate form fields
    populateFormFromData();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load will data from database or localStorage
async function loadWillData(id, source) {
    if (source === 'database' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('islamic_wills')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Load will_data JSON into formData
            formData = data.will_data || {};
            formData.willId = data.id;

            // Also set individual fields from database columns
            formData.fullName = data.testator_name || formData.fullName;
            formData.email = data.testator_email || formData.email;
            formData.phone = data.testator_phone || formData.phone;
            formData.address = data.testator_address || formData.address;
            formData.testatorGender = data.testator_gender || formData.testatorGender;
            formData.dateOfBirth = data.testator_dob || formData.dateOfBirth;

            // Load children and other data from JSON columns
            if (data.children_data) formData.children = data.children_data;
            if (data.debts_data) formData.debts = data.debts_data;
            if (data.assets_data) {
                formData.properties = data.assets_data.properties || [];
                formData.bankAccounts = data.assets_data.bankAccounts || [];
                formData.investments = data.assets_data.investments || [];
                formData.businesses = data.assets_data.businesses || [];
                formData.vehicles = data.assets_data.vehicles || [];
                formData.valuables = data.assets_data.valuables || [];
            }
            if (data.wasiyyah_data) {
                formData.charities = data.wasiyyah_data.charities || [];
                formData.nonHeirs = data.wasiyyah_data.nonHeirs || [];
                formData.adopted = data.wasiyyah_data.adopted || [];
            }

            // Family data
            formData.maritalStatus = data.marital_status || formData.maritalStatus;
            formData.spouseName = data.spouse_name || formData.spouseName;
            formData.hasChildren = data.has_children ? 'yes' : formData.hasChildren;
            formData.fatherStatus = data.father_status || formData.fatherStatus;
            formData.fatherName = data.father_name || formData.fatherName;
            formData.motherStatus = data.mother_status || formData.motherStatus;
            formData.motherName = data.mother_name || formData.motherName;

            // Update toolbar
            updateToolbar(formData.fullName);

            console.log('Loaded will from database:', formData);
        } catch (e) {
            alert('Error loading will: ' + e.message);
            throw e;
        }
    } else {
        // Load from localStorage
        const localWills = JSON.parse(localStorage.getItem('savedWills') || '[]');
        const will = localWills.find(w => w.localId == id);
        if (will) {
            formData = will;
            updateToolbar(formData.fullName);
            console.log('Loaded will from localStorage:', formData);
        } else {
            alert('Could not find saved will');
            throw new Error('Will not found');
        }
    }
}

// Generate will document from loaded data (without collecting from form)
function generateWillFromData() {
    console.log('Generating will from loaded data');
    console.log('Testator Gender:', formData.testatorGender);
    console.log('Children Data:', formData.children);
    console.log('Has Children:', formData.hasChildren);

    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const willType = formData.willType || 'simple';

    const willDocument = document.getElementById('willDocument');
    willDocument.innerHTML = generateWillHTML(today);
}

// Separate function to generate will HTML (reusable)
function generateWillHTML(today) {
    const lang = formData.willLanguage || 'en';
    const t = willTranslations[lang] || willTranslations.en;
    const rtl = isRTL(lang);
    const dirAttr = rtl ? ' dir="rtl"' : '';
    const dirStyle = rtl ? ' style="direction: rtl; text-align: right;"' : '';

    // Translated notice for non-English languages
    const transcriptNotice = lang !== 'en' ? `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1rem; margin: 0 0 2rem 0;">
            <p style="margin: 0; font-size: 0.9rem;"><strong>⚠️ ${t.transcriptNote}</strong></p>
        </div>
    ` : '';

    return `
        <div${dirAttr}${dirStyle}>
        ${transcriptNotice}
        <h1>${t.title}</h1>
        <p class="will-arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p style="text-align: center; margin-bottom: 2rem;">${t.bismillah}</p>

        <h2>${t.declarationOfFaith}</h2>
        <p>${t.declarationText(formData.fullName || '[____]', formData.address || '[____]')}</p>
        <p>${t.willInAccordance}</p>

        <h2>${t.part1Title}</h2>
        <p>${t.part1Text}</p>

        <h2>${t.part2Title}</h2>
        <p>${t.part2Text}</p>
        <p><strong>${t.primaryExecutor}:</strong><br>
        ${t.name}: ${formData.executor1Name || '____________________'}<br>
        ${t.address}: ${formData.executor1Address || '____________________'}<br>
        ${t.relationship}: ${formData.executor1Relationship || '____________________'}</p>

        ${formData.executor2Name ? `
        <p><strong>${t.secondaryExecutor}:</strong><br>
        ${t.name}: ${formData.executor2Name}<br>
        ${t.address}: ${formData.executor2Address || '____________________'}<br>
        ${t.relationship}: ${formData.executor2Relationship || '____________________'}</p>
        ` : ''}

        <h2>${t.part3Title}</h2>
        <p>${t.part3Text}</p>
        <ol>
            <li>${t.funeral1}</li>
            <li>${t.funeral2}</li>
            <li>${t.funeral3}</li>
            <li>${t.funeral4}</li>
            <li>${t.funeral5}</li>
        </ol>
        ${formData.burialLocation === 'repatriate' ? `<p><strong>${t.repatriation}:</strong> ${t.repatriationText(formData.repatriationCountry || 'my home country')}</p>` : ''}
        ${formData.preferredCemetery ? `<p><strong>${t.preferredCemetery}:</strong> ${formData.preferredCemetery}</p>` : ''}
        ${formData.preferredMosque ? `<p><strong>${t.preferredMosque}:</strong> ${formData.preferredMosque}</p>` : ''}

        <h2>${t.part4Title}</h2>
        <p>${t.part4Text}</p>
        <ol>
            <li>${t.funeralExpenses}</li>
            <li>${t.allDebts}</li>
            ${formData.mahrStatus === 'outstanding' ? `<li><strong>${t.outstandingMahr}:</strong> £${formData.mahrAmount || '____'}</li>` : ''}
            ${formData.unpaidZakat ? `<li><strong>${t.unpaidZakat}:</strong> £${formData.unpaidZakat}</li>` : ''}
            ${formData.fidyahDays ? `<li><strong>${t.fidyah}:</strong> ${formData.fidyahDays} ${t.fidyahDays}</li>` : ''}
            ${formData.kaffarah ? `<li><strong>${t.kaffarah}:</strong> £${formData.kaffarah}</li>` : ''}
            ${formData.hajjStatus === 'obligatory-not-performed' && formData.arrangeHajjBadal ? `<li>${t.hajjBadal}</li>` : ''}
        </ol>

        <h2>${t.part5Title}</h2>
        ${formData.makeWasiyyah === 'yes' ? `
        <p>${t.wasiyyahYes}</p>
        <p><em>${t.wasiyyahNote}</em></p>
        <table>
            <tr><th>${t.beneficiary}</th><th>${t.percentage}</th><th>${t.purpose}</th></tr>
            <tr><td colspan="3"><em>${t.bequestDetails}</em></td></tr>
        </table>
        ` : `
        <p>${t.wasiyyahNo}</p>
        `}

        <h2>${t.part6Title}</h2>
        <p>${t.part6Text}</p>

        <div style="background: #e8f5e9; border: 2px solid #4caf50; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
            <h4 style="margin-top: 0; color: #2e7d32;">${t.testatorInfo}</h4>
            <p><strong>${t.testator}:</strong> ${formData.fullName || '____'} (${formData.testatorGender === 'female' ? t.female : t.male})</p>
            <p><strong>${t.maritalStatus}:</strong> ${formData.maritalStatus || t.notSpecified}</p>
            ${formData.maritalStatus === 'married' ? `<p><strong>${t.spouse}:</strong> ${formData.spouseName || '____'} (${formData.testatorGender === 'female' ? t.husband + ' - ' + t.entitledTo + ' ' + (formData.hasChildren === 'yes' ? '1/4 (25%)' : '1/2 (50%)') : t.wife + ' - ' + t.entitledTo + ' ' + (formData.hasChildren === 'yes' ? '1/8 (12.5%)' : '1/4 (25%)')})</p>` : ''}
            <p><strong>${t.hasChildren}:</strong> ${formData.hasChildren === 'yes' ? t.yes : t.no}</p>
            ${formData.children && formData.children.length > 0 ? `<p><strong>${t.children}:</strong> ${formData.children.map(c => c.name + ' (' + (c.gender === 'male' ? t.son : t.daughter) + ')').join(', ')}</p>` : ''}
            <p><strong>${t.father}:</strong> ${formData.fatherStatus === 'living' ? formData.fatherName + ' (' + t.living + ')' : t.deceased}</p>
            <p><strong>${t.mother}:</strong> ${formData.motherStatus === 'living' ? formData.motherName + ' (' + t.living + ')' : t.deceased}</p>
        </div>

        <h3>${t.calculatedShares}</h3>
        <p><em>${t.sharesNote}</em></p>
        ${generateFaraidTable()}

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
            <h4 style="margin-top: 0; color: #1e3a5f;">${t.faraidReference}</h4>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">${t.faraidQuote}</p>
            <table style="font-size: 0.85rem;">
                <tr><th>${t.heir}</th><th>${t.withChildren}</th><th>${t.withoutChildren}</th></tr>
                <tr><td>${t.wife}</td><td>1/8 (12.5%)</td><td>1/4 (25%)</td></tr>
                <tr><td>${t.husband}</td><td>1/4 (25%)</td><td>1/2 (50%)</td></tr>
                <tr><td>${t.father}</td><td>1/6 (16.67%) + ${t.residue}</td><td>${t.residue}</td></tr>
                <tr><td>${t.mother}</td><td>1/6 (16.67%)</td><td>1/3 (33.33%)</td></tr>
                <tr><td>${t.son}(s)</td><td colspan="2">${t.receivesDouble}</td></tr>
                <tr><td>${t.daughter} (1)</td><td colspan="2">1/2 (50%)</td></tr>
                <tr><td>${t.daughter} (2+)</td><td colspan="2">2/3 (66.67%) ${t.sharedEqually}</td></tr>
            </table>
        </div>

        <p><strong>${lang === 'en' ? 'Important' : '⚠️'}:</strong> ${t.faraidImportant}</p>

        ${formData.hasMinorChildren === 'yes' ? `
        <h2>${t.part7Title}</h2>
        <p>${t.part7Text}</p>
        <p><strong>${t.primaryGuardian}:</strong> ${formData.guardian1Name || '____________________'}<br>
        ${t.address}: ${formData.guardian1Address || '____________________'}<br>
        ${t.relationship}: ${formData.guardian1Relationship || '____________________'}</p>
        ${formData.guardian2Name ? `<p><strong>${t.secondaryGuardian}:</strong> ${formData.guardian2Name}</p>` : ''}
        <p>${t.guardianRequest}</p>
        ` : ''}

        <h2>${t.part8Title}</h2>
        <p>${formData.organDonation === 'consent' ? t.organConsent :
             formData.organDonation === 'refuse' ? t.organRefuse :
             t.organDefer}</p>

        <h2>${t.part9Title}</h2>
        <p>${t.part9Text}</p>
        <ol>
            <li>${t.declaration1}</li>
            <li>${t.declaration2}</li>
            <li>${t.declaration3}</li>
            <li>${t.declaration4}</li>
            <li>${t.declaration5}</li>
            <li>${t.declaration6}</li>
        </ol>

        <!-- Signatures Section -->
        <div class="will-signature-section">
            <h2>${t.signatures}</h2>

            <div class="will-signature-block">
                <h4>${t.testatorSig}</h4>
                <div class="signature-line"></div>
                <p class="signature-label">${t.signatureOf}</p>
                <p><strong>${t.fullName}:</strong> ${formData.fullName || '____________________'}</p>
                <p><strong>${t.date}:</strong> ____________________</p>
            </div>

            <div class="will-signature-block">
                <h4>${t.witness1}</h4>
                <p><em>${t.witnessNote}</em></p>
                <div class="signature-line"></div>
                <p class="signature-label">${t.signature}</p>
                <p><strong>${t.fullName}:</strong> ____________________</p>
                <p><strong>${t.address}:</strong> ____________________</p>
                <p><strong>${t.occupation}:</strong> ____________________</p>
                <p><strong>${t.date}:</strong> ____________________</p>
            </div>

            <div class="will-signature-block">
                <h4>${t.witness2}</h4>
                <div class="signature-line"></div>
                <p class="signature-label">${t.signature}</p>
                <p><strong>${t.fullName}:</strong> ____________________</p>
                <p><strong>${t.address}:</strong> ____________________</p>
                <p><strong>${t.occupation}:</strong> ____________________</p>
                <p><strong>${t.date}:</strong> ____________________</p>
            </div>

            <!-- Solicitor Certification -->
            <div class="certification-block">
                <h4>⚖️ ${t.solicitorCert}</h4>
                <p>${t.solicitorCertText}</p>
                <div class="certification-checkbox">
                    <input type="checkbox" id="cert1"> <label for="cert1">${t.cert1}</label>
                </div>
                <div class="certification-checkbox">
                    <input type="checkbox" id="cert2"> <label for="cert2">${t.cert2}</label>
                </div>
                <div class="certification-checkbox">
                    <input type="checkbox" id="cert3"> <label for="cert3">${t.cert3}</label>
                </div>
                <div class="certification-checkbox">
                    <input type="checkbox" id="cert4"> <label for="cert4">${t.cert4}</label>
                </div>
                <div class="form-grid" style="margin-top: 1rem;">
                    <div>
                        <p><strong>${t.solicitorName}:</strong> ____________________</p>
                        <p><strong>${t.firm}:</strong> ____________________</p>
                        <p><strong>${t.sraNumber}:</strong> ____________________</p>
                    </div>
                    <div>
                        <div class="signature-line"></div>
                        <p class="signature-label">${t.signature}</p>
                        <p><strong>${t.date}:</strong> ____________________</p>
                    </div>
                </div>
                <div class="stamp-area">${t.firmStamp}</div>
            </div>

            <!-- Mufti/Imam Certification -->
            <div class="certification-block mufti">
                <h4>🕌 ${t.islamicCert}</h4>
                <p>${t.islamicCertText}</p>
                <div class="certification-checkbox">
                    <input type="checkbox" id="islamic1"> <label for="islamic1">${t.islamic1}</label>
                </div>
                <div class="certification-checkbox">
                    <input type="checkbox" id="islamic2"> <label for="islamic2">${t.islamic2}</label>
                </div>
                <div class="certification-checkbox">
                    <input type="checkbox" id="islamic3"> <label for="islamic3">${t.islamic3}</label>
                </div>
                <div class="certification-checkbox">
                    <input type="checkbox" id="islamic4"> <label for="islamic4">${t.islamic4}</label>
                </div>
                <div class="form-grid" style="margin-top: 1rem;">
                    <div>
                        <p><strong>${t.muftiName}:</strong> ____________________</p>
                        <p><strong>${t.mosque}:</strong> ____________________</p>
                        <p><strong>${t.contact}:</strong> ____________________</p>
                    </div>
                    <div>
                        <div class="signature-line"></div>
                        <p class="signature-label">${t.signature}</p>
                        <p><strong>${t.date}:</strong> ____________________</p>
                    </div>
                </div>
                <div class="stamp-area">${t.mosqueStamp}</div>
            </div>
        </div>

        <hr style="margin: 2rem 0;">
        <p style="text-align: center; font-size: 0.875rem; color: #6b7280;">
            ${t.generatedOn(today)}<br>
            ${t.reviewNote}
        </p>
        </div>
    `;
}

// Close modal
function closeSavedWillsModal() {
    document.getElementById('savedWillsModal').style.display = 'none';
}

// Populate form from loaded data
function populateFormFromData() {
    // Basic fields
    const fieldMappings = [
        'fullName', 'alsoKnownAs', 'dateOfBirth', 'placeOfBirth', 'address',
        'niNumber', 'passportNumber', 'countryOfOrigin', 'phone', 'email',
        'testatorGender', 'executor1Name', 'executor1Relationship', 'executor1Address',
        'executor1Phone', 'executor1Email', 'executor2Name', 'executor2Relationship',
        'executor2Address', 'executor2Phone', 'executor2Email', 'repatriationCountry',
        'preferredCemetery', 'preferredMosque', 'funeralInstructions', 'funeralBudget',
        'maritalStatus', 'spouseName', 'marriageDate', 'mahrAmount',
        'fatherName', 'motherName', 'unpaidZakat', 'fidyahDays', 'kaffarah',
        'guardian1Name', 'guardian1Relationship', 'guardian1Address', 'guardian1Phone',
        'guardian2Name', 'guardian2Relationship', 'guardian2Address',
        'preferredScholar', 'madhab', 'additionalWishes', 'peopleForgiven',
        'willLanguage'
    ];

    fieldMappings.forEach(field => {
        const el = document.getElementById(field);
        if (el && formData[field]) {
            el.value = formData[field];
        }
    });

    // Handle radio buttons
    if (formData.willType) {
        const radio = document.querySelector(`input[name="willType"][value="${formData.willType}"]`);
        if (radio) radio.checked = true;
    }
    if (formData.burialLocation) {
        const radio = document.querySelector(`input[name="burialLocation"][value="${formData.burialLocation}"]`);
        if (radio) radio.checked = true;
    }
    if (formData.hasChildren) {
        const radio = document.querySelector(`input[name="hasChildren"][value="${formData.hasChildren}"]`);
        if (radio) radio.checked = true;
    }

    // Trigger change events to show/hide sections
    document.getElementById('maritalStatus')?.dispatchEvent(new Event('change'));
    document.querySelectorAll('input[name="hasChildren"]').forEach(r => {
        if (r.checked) r.dispatchEvent(new Event('change'));
    });
}

// Delete a will
async function deleteWill(id, source) {
    if (!confirm('Are you sure you want to delete this will?')) return;

    if (source === 'database' && supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('islamic_wills')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (e) {
            alert('Error deleting: ' + e.message);
            return;
        }
    } else {
        // Delete from localStorage
        let localWills = JSON.parse(localStorage.getItem('savedWills') || '[]');
        localWills = localWills.filter(w => w.localId != id);
        localStorage.setItem('savedWills', JSON.stringify(localWills));
    }

    // Refresh the list
    loadSavedWills();
}

// Generate Faraid table HTML
function generateFaraidTable() {
    const shares = calculateFaraid();

    if (shares.length === 0) {
        return '<p><em>No heirs identified. Please ensure family information is complete.</em></p>';
    }

    let totalShare = shares.reduce((sum, s) => sum + s.share, 0);

    let html = `
        <table style="width: 100%; margin: 1rem 0;">
            <tr style="background: #1e3a5f; color: white;">
                <th style="padding: 10px; text-align: left;">Heir</th>
                <th style="padding: 10px; text-align: left;">Name</th>
                <th style="padding: 10px; text-align: center;">Fraction</th>
                <th style="padding: 10px; text-align: center;">Percentage</th>
                <th style="padding: 10px; text-align: left;">Notes</th>
            </tr>
    `;

    shares.forEach((s, idx) => {
        const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        html += `
            <tr style="background: ${bgColor};">
                <td style="padding: 10px; font-weight: 600;">${s.heir}</td>
                <td style="padding: 10px;">${s.name}</td>
                <td style="padding: 10px; text-align: center;">${s.fraction}</td>
                <td style="padding: 10px; text-align: center; font-weight: 600; color: #1e3a5f;">${s.share.toFixed(2)}%</td>
                <td style="padding: 10px; font-size: 0.85rem; color: #64748b;">${s.note}</td>
            </tr>
        `;
    });

    html += `
            <tr style="background: #1e3a5f; color: white; font-weight: 600;">
                <td colspan="3" style="padding: 10px; text-align: right;">TOTAL:</td>
                <td style="padding: 10px; text-align: center;">${totalShare.toFixed(2)}%</td>
                <td style="padding: 10px;"></td>
            </tr>
        </table>
    `;

    if (Math.abs(totalShare - 100) > 0.1) {
        html += `<p style="color: #dc2626; font-size: 0.9rem;"><strong>Note:</strong> Total does not equal 100%. This may be due to Radd (redistribution) or 'Awl (proportional reduction) rules. Please consult an Islamic scholar.</p>`;
    }

    return html;
}

// Calculate Faraid (Islamic Inheritance) Shares
function calculateFaraid() {
    const hasSpouse = formData.maritalStatus === 'married';
    const hasChildren = formData.hasChildren === 'yes';
    const fatherAlive = formData.fatherStatus === 'living';
    const motherAlive = formData.motherStatus === 'living';

    // Count children by gender
    const children = formData.children || [];
    console.log('Faraid Calculation - Children:', children);

    const sons = children.filter(c => c.gender === 'male').length;
    const daughters = children.filter(c => c.gender === 'female').length;
    const totalChildren = sons + daughters;

    console.log('Faraid Calculation - Sons:', sons, 'Daughters:', daughters);

    // Determine testator gender from form
    const testatorIsMale = formData.testatorGender === 'male';
    console.log('Faraid Calculation - Testator is Male:', testatorIsMale, 'Gender value:', formData.testatorGender);

    const shares = [];
    let remainingShare = 100; // Start with 100%

    // 1. SPOUSE SHARE
    if (hasSpouse) {
        let spouseShare;
        if (testatorIsMale) {
            // Wife's share
            spouseShare = hasChildren ? 12.5 : 25; // 1/8 or 1/4
        } else {
            // Husband's share
            spouseShare = hasChildren ? 25 : 50; // 1/4 or 1/2
        }
        shares.push({
            heir: 'Spouse',
            name: formData.spouseName || '____',
            share: spouseShare,
            fraction: testatorIsMale ? (hasChildren ? '1/8' : '1/4') : (hasChildren ? '1/4' : '1/2'),
            note: testatorIsMale ? 'Wife' : 'Husband'
        });
        remainingShare -= spouseShare;
    }

    // 2. FATHER'S SHARE
    if (fatherAlive) {
        if (hasChildren) {
            // Father gets 1/6 when there are children
            shares.push({
                heir: 'Father',
                name: formData.fatherName || '____',
                share: 16.67,
                fraction: '1/6',
                note: 'Fixed share (with children)'
            });
            remainingShare -= 16.67;
        }
        // If no children, father takes residue (calculated later)
    }

    // 3. MOTHER'S SHARE
    if (motherAlive) {
        let motherShare;
        if (hasChildren || totalChildren >= 2) {
            motherShare = 16.67; // 1/6
        } else {
            motherShare = 33.33; // 1/3
        }
        shares.push({
            heir: 'Mother',
            name: formData.motherName || '____',
            share: motherShare,
            fraction: hasChildren ? '1/6' : '1/3',
            note: hasChildren ? 'Fixed share (with children)' : 'Fixed share (no children)'
        });
        remainingShare -= motherShare;
    }

    // 4. CHILDREN'S SHARES (from residue)
    if (hasChildren && totalChildren > 0) {
        if (sons > 0 && daughters > 0) {
            // Sons get double daughters - calculate units
            const totalUnits = (sons * 2) + daughters;
            const unitValue = remainingShare / totalUnits;
            const sonShare = (unitValue * 2).toFixed(2);
            const daughterShare = unitValue.toFixed(2);

            children.forEach((child, idx) => {
                const isSon = child.gender === 'male';
                shares.push({
                    heir: isSon ? 'Son' : 'Daughter',
                    name: child.name || `Child ${idx + 1}`,
                    share: parseFloat(isSon ? sonShare : daughterShare),
                    fraction: `Residue`,
                    note: isSon ? '2 units (double daughter)' : '1 unit (half of son)'
                });
            });
        } else if (sons > 0) {
            // Only sons - share equally
            const sonShare = (remainingShare / sons).toFixed(2);
            children.forEach((child, idx) => {
                shares.push({
                    heir: 'Son',
                    name: child.name || `Son ${idx + 1}`,
                    share: parseFloat(sonShare),
                    fraction: 'Residue',
                    note: 'Equal share among sons'
                });
            });
        } else if (daughters > 0) {
            // Only daughters
            let daughterTotal;
            if (daughters === 1) {
                daughterTotal = 50; // 1/2
            } else {
                daughterTotal = 66.67; // 2/3
            }
            // Cap at remaining share
            daughterTotal = Math.min(daughterTotal, remainingShare);
            const perDaughter = (daughterTotal / daughters).toFixed(2);

            children.forEach((child, idx) => {
                shares.push({
                    heir: 'Daughter',
                    name: child.name || `Daughter ${idx + 1}`,
                    share: parseFloat(perDaughter),
                    fraction: daughters === 1 ? '1/2' : '2/3 shared',
                    note: daughters === 1 ? 'Only daughter' : `Shared among ${daughters} daughters`
                });
            });

            remainingShare -= daughterTotal;

            // If father alive and there's residue, father gets it
            if (fatherAlive && remainingShare > 0) {
                shares.push({
                    heir: 'Father',
                    name: formData.fatherName || '____',
                    share: parseFloat(remainingShare.toFixed(2)),
                    fraction: 'Residue',
                    note: 'Residue after fixed shares'
                });
            }
        }
    } else if (!hasChildren && fatherAlive) {
        // No children - father takes residue
        shares.push({
            heir: 'Father',
            name: formData.fatherName || '____',
            share: parseFloat(remainingShare.toFixed(2)),
            fraction: 'Residue',
            note: 'As residuary heir (no children)'
        });
    }

    return shares;
}

// Generate review content
function generateReview() {
    saveStepData();

    const reviewContent = document.getElementById('reviewContent');
    reviewContent.innerHTML = `
        <div class="review-section">
            <div class="review-section-header">
                <span class="review-section-title">Personal Details</span>
                <button class="review-section-edit" onclick="goToStep(2)">Edit</button>
            </div>
            <div class="review-section-content">
                <div class="review-item"><span class="review-label">Full Name:</span><span class="review-value">${formData.fullName || 'Not provided'}</span></div>
                <div class="review-item"><span class="review-label">Date of Birth:</span><span class="review-value">${formData.dateOfBirth || 'Not provided'}</span></div>
                <div class="review-item"><span class="review-label">Address:</span><span class="review-value">${formData.address || 'Not provided'}</span></div>
            </div>
        </div>

        <div class="review-section">
            <div class="review-section-header">
                <span class="review-section-title">Executors</span>
                <button class="review-section-edit" onclick="goToStep(3)">Edit</button>
            </div>
            <div class="review-section-content">
                <div class="review-item"><span class="review-label">Primary Executor:</span><span class="review-value">${formData.executor1Name || 'Not provided'}</span></div>
                <div class="review-item"><span class="review-label">Secondary Executor:</span><span class="review-value">${formData.executor2Name || 'None'}</span></div>
            </div>
        </div>

        <div class="review-section">
            <div class="review-section-header">
                <span class="review-section-title">Family</span>
                <button class="review-section-edit" onclick="goToStep(5)">Edit</button>
            </div>
            <div class="review-section-content">
                <div class="review-item"><span class="review-label">Marital Status:</span><span class="review-value">${formData.maritalStatus || 'Not provided'}</span></div>
                <div class="review-item"><span class="review-label">Spouse:</span><span class="review-value">${formData.spouseName || 'N/A'}</span></div>
                <div class="review-item"><span class="review-label">Has Children:</span><span class="review-value">${formData.hasChildren || 'No'}</span></div>
            </div>
        </div>

        <div class="review-section">
            <div class="review-section-header">
                <span class="review-section-title">Wasiyyah (Bequest)</span>
                <button class="review-section-edit" onclick="goToStep(8)">Edit</button>
            </div>
            <div class="review-section-content">
                <div class="review-item"><span class="review-label">Making Wasiyyah:</span><span class="review-value">${formData.makeWasiyyah === 'yes' ? 'Yes' : 'No - All to Faraid'}</span></div>
            </div>
        </div>

        <div class="info-box info-warning">
            <strong>Important:</strong> Please review all information carefully before generating your Will.
            Once generated, have it reviewed by a qualified solicitor and Islamic scholar.
        </div>
    `;
}

// Generate the will document
async function generateWill() {
    saveStepData();

    // Capture language selection (from step 1)
    const langSelect = document.getElementById('willLanguage');
    if (langSelect) formData.willLanguage = langSelect.value;

    // IMPORTANT: Collect all dynamic list data BEFORE generating will
    formData.children = collectListData('child', childCount, ['Name', 'Gender', 'DOB', 'Mother']);
    formData.debts = collectListData('debt', debtCount, ['Creditor', 'Type', 'Amount']);
    formData.properties = collectListData('property', propertyCount, ['Address', 'Country', 'Type', 'Ownership', 'Value']);
    formData.bankAccounts = collectListData('bank', bankCount, ['Name', 'Type', 'Balance']);
    formData.investments = collectListData('investment', investmentCount, ['Type', 'Provider', 'Value']);
    formData.businesses = collectListData('business', businessCount, ['Name', 'Type', 'Ownership', 'Value']);
    formData.vehicles = collectListData('vehicle', vehicleCount, ['Make', 'Reg', 'Value']);
    formData.valuables = collectListData('valuable', valuableCount, ['Desc', 'Category', 'Value', 'Recipient']);
    formData.charities = collectListData('charity', charitableCount, ['Name', 'Reg', 'Percent', 'Purpose']);
    formData.nonHeirs = collectListData('nonHeir', nonHeirCount, ['Name', 'Relation', 'Percent', 'Reason']);
    formData.adopted = collectListData('adopted', adoptedCount, ['Name', 'Date', 'Percent']);

    // Mark as completed
    formData.isCompleted = true;
    formData.completedAt = new Date().toISOString();

    console.log('Testator Gender:', formData.testatorGender);
    console.log('Children Data:', formData.children);
    console.log('Has Children:', formData.hasChildren);

    // Save to database with completed status
    try {
        await saveWillToDatabase('completed');
        console.log('Will saved to database as completed');
    } catch (error) {
        console.warn('Could not save to database:', error);
    }

    // Also save to localStorage with completed flag
    const savedWills = JSON.parse(localStorage.getItem('savedWills') || '[]');
    const existingIndex = savedWills.findIndex(w => w.localId === formData.localId);
    formData.savedAt = new Date().toISOString();
    if (!formData.localId) formData.localId = Date.now();

    if (existingIndex >= 0) {
        savedWills[existingIndex] = formData;
    } else {
        savedWills.push(formData);
    }
    localStorage.setItem('savedWills', JSON.stringify(savedWills));

    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const willDocument = document.getElementById('willDocument');
    willDocument.innerHTML = generateWillHTML(today);
}

// Print will
function printWill() {
    window.print();
}

// Download PDF (basic implementation - would need a library like jsPDF for proper PDF)
function downloadPDF() {
    alert('For best results, use the Print function and select "Save as PDF" as your printer.\n\nA proper PDF generation feature requires additional libraries.');
    window.print();
}
