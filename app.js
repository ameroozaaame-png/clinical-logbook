(() => {
  "use strict";

  const TABLE_NAME = "clinical_cases";
  const MAX_CASES = 20;
  const CASE_FIELDS = "id, patient_code, diagnosis, notes, created_at, updated_at";
  const LIMITS = { patientCode: 40, diagnosis: 180, notes: 1000 };
  const AR_LOCALE = "ar-EG-u-nu-latn";
  const EN_LOCALE = "en-US";
  const LANGUAGE_STORAGE_KEY = "clinical-logbook-language";
  const SUPPORTED_LANGUAGES = ["ar", "en"];
  const PROJECT_CHECK_TIMEOUT_MS = 5000;
  const messages = {
    ar: {
      "meta.title": "Clinical Logbook | سجل الحالات الطبية",
      "meta.description": "Clinical Logbook — سجل طبي رقمي آمن بتسجيل دخول، وبيانات معزولة لكل مستخدم عبر Supabase.",
      "noscript.title": "JavaScript مطلوب",
      "noscript.body": "فعّل JavaScript في المتصفح لتسجيل الدخول واستخدام السجل الآمن.",
      "skipLink": "انتقل إلى المحتوى الرئيسي",
      "brand.tagline": "سجل الحالات الطبية",
      "language.switchToEnglish": "التبديل إلى الإنجليزية",
      "language.switchToArabic": "التبديل إلى العربية",
      "language.english": "English",
      "language.arabic": "العربية",
      "connection.title": "حالة الاتصال بـ Supabase",
      "connection.statusAria": "حالة الاتصال: {label}",
      "account.title": "حسابك",
      "account.signedInAs": "مسجّل الدخول باسم",
      "account.logout": "تسجيل الخروج",
      "account.fallbackEmail": "حساب مستخدم",
      "signin.aria": "الانتقال إلى تسجيل الدخول",
      "signin.text": "تسجيل الدخول",
      "newCase.aria": "إضافة حالة جديدة",
      "newCase.text": "حالة جديدة",
      "hero.eyebrow": "مساحة توثيق سريرية آمنة",
      "hero.titleHtml": "كل حالة تستحق<br><span>أن تُوثَّق بدقة.</span>",
      "hero.lead": "سجّل الحالات الطبية في حسابك، وثّق التشخيص والملاحظات، واحتفظ بسجل معزول لا يراه إلا أنت.",
      "hero.asideAria": "معلومات مساحة العمل",
      "hero.today": "اليوم",
      "hero.rlsNote": "سجلات كل حساب محمية عبر سياسات الصفوف في Supabase.",
      "boot.title": "جارٍ تجهيز مساحة العمل",
      "boot.body": "نتحقق من إعدادات الاتصال وجلسة الدخول الآمنة…",
      "access.kicker": "دخول آمن",
      "auth.tabsAria": "طريقة الدخول",
      "auth.loginTab": "تسجيل الدخول",
      "auth.signupTab": "إنشاء حساب",
      "auth.emailLabel": "البريد الإلكتروني",
      "auth.passwordLabel": "كلمة المرور",
      "auth.passwordHintLogin": "6 أحرف على الأقل",
      "auth.passwordHintSignup": "8 أحرف على الأقل للحماية",
      "auth.showPassword": "إظهار كلمة المرور",
      "auth.hidePassword": "إخفاء كلمة المرور",
      "auth.securityNote": "جلسة مشفّرة، ولا تُخزَّن سجلات المرضى محليًا في المتصفح.",
      "auth.accessTitle": "الوصول إلى السجل",
      "auth.accessSubtitle": "أكمل ربط Supabase لتفعيل الدخول الآمن.",
      "auth.lockedTitleDefault": "الاتصال غير مكتمل",
      "auth.lockedTextDefault": "أكمل إعداد Supabase للوصول إلى السجل.",
      "auth.lockedStep1Html": "ضع <strong>Project URL</strong> و<strong>anon public key</strong> في ملف <code>config.js</code>.",
      "auth.lockedStep2Html": "نفّذ ملف <code>supabase-schema.sql</code> كاملًا في <strong>SQL Editor</strong>.",
      "auth.lockedStep3Html": "أعد تحميل الصفحة، ثم أنشئ حسابك وسجّل الدخول.",
      "auth.lockedHintHtml": "التفاصيل موجودة في ملف <code>README.md</code>. لا تستخدم مفتاح <code>service_role</code> في المتصفح.",
      "access.asideKicker": "حماية البيانات",
      "access.asideTitle": "سجلك لك وحدك.",
      "access.asideBody": "كل مستخدم يمتلك مساحة معزولة. حتى لو شاركتم رابط التطبيق نفسه، فإن قاعدة البيانات تمنع أي حساب من رؤية سجلات حساب آخر.",
      "access.point1Title": "عزل على مستوى الصفوف",
      "access.point1BodyHtml": "سياسات RLS تربط كل سجل بمالكه عبر <code>auth.uid()</code>.",
      "access.point2Title": "جلسة موثّقة",
      "access.point2Body": "تسجيل الدخول عبر Supabase Auth مع تجديد آمن للجلسة.",
      "access.point3Title": "بيانات في السحابة",
      "access.point3Body": "لا سجلات مرضى في LocalStorage؛ المصدر الوحيد هو Supabase.",
      "access.asideNote": "استخدم بيانات مرضى مجهولة الهوية، والتزم بسياسات مؤسستك لحماية الخصوصية.",
      "entry.addKicker": "إضافة سجل",
      "entry.addTitle": "حالة طبية جديدة",
      "entry.addDescription": "املأ الحقول التالية، وستظهر الحالة في السجل فور حفظها.",
      "entry.editKicker": "تعديل سجل",
      "entry.editTitle": "تعديل الحالة",
      "entry.editDescription": "عدّل بيانات الحالة ثم احفظ التعديلات. سيُحدَّث وقت التعديل تلقائيًا.",
      "form.patientCodeLabel": "رمز المريض",
      "form.patientCodePlaceholder": "مثال: PT-2026-0147",
      "form.patientCodeHint": "استخدم رمزًا بديلًا لا يكشف هوية المريض. حتى 40 حرفًا.",
      "form.diagnosisLabel": "التشخيص",
      "form.diagnosisPlaceholder": "مثال: التهاب رئوي مجتمعي",
      "form.diagnosisHint": "اكتب التشخيص السريري المعتمد. حتى 180 حرفًا.",
      "form.notesLabel": "الملاحظات",
      "form.optional": "(اختياري)",
      "form.notesPlaceholder": "أضف ما يلزم من تفاصيل: الأعراض، خطة المتابعة، أو أي ملاحظات سريرية أخرى...",
      "form.notesHint": "يمكنك ترك هذا الحقل فارغًا. حتى 1000 حرف.",
      "form.privacyTitle": "تذكير بالخصوصية",
      "form.privacyText": "تجنّب إدخال الاسم الكامل أو رقم الهوية أو أي بيانات تعريفية مباشرة.",
      "form.timestampAdd": "يُضاف وقت الحفظ تلقائيًا.",
      "form.timestampEdit": "سيُسجّل وقت التعديل تلقائيًا.",
      "form.submitSave": "حفظ الحالة",
      "form.submitSaving": "جارٍ حفظ الحالة…",
      "form.submitUpdate": "حفظ التعديلات",
      "form.submitUpdating": "جارٍ تحديث الحالة…",
      "form.cancelEdit": "إلغاء التعديل",
      "list.kicker": "السجل",
      "list.title": "آخر الحالات",
      "list.refreshAria": "تحديث قائمة الحالات",
      "list.refreshTitle": "تحديث القائمة",
      "list.subtitleDefault": "سجلاتك الخاصة، مرتبة من الأحدث إلى الأقدم",
      "list.subtitleEmpty": "لا توجد حالات مسجلة بعد",
      "list.subtitleLoading": "جارٍ تحميل السجلات…",
      "list.subtitleError": "تعذّر تحميل السجلات",
      "list.subtitleSignout": "سجّل الدخول لعرض الحالات.",
      "list.lastSyncNever": "لم تتم المزامنة بعد",
      "list.lastSync": "آخر مزامنة: {time}",
      "list.syncing": "جارٍ المزامنة…",
      "list.syncFailed": "تعذّرت المزامنة",
      "list.synced": "تمت المزامنة",
      "sync.checking": "جارٍ الاتصال بـ Supabase",
      "sync.online": "حفظ آمن في Supabase",
      "sync.error": "تعذّر الاتصال بـ Supabase",
      "sync.setup": "المزامنة بانتظار الإعداد",
      "sync.unknown": "حالة المزامنة غير معروفة",
      "status.checking": "جارٍ الاتصال",
      "status.setup": "بانتظار الإعداد",
      "status.loadFailed": "تعذّر التحميل",
      "status.connectionFailed": "تعذّر الاتصال",
      "status.needsReview": "يحتاج مراجعة",
      "status.online": "متصل بـ Supabase",
      "status.available": "متاح للدخول",
      "status.offline": "لا يوجد اتصال",
      "status.updateFailed": "تعذّر التحديث",
      "status.saveFailed": "تعذّر الحفظ",
      "case.edited": "معدّل",
      "case.edit": "تعديل",
      "case.delete": "حذف",
      "case.noCode": "بدون رمز",
      "case.noDiagnosis": "بدون تشخيص",
      "case.noDate": "بدون تاريخ",
      "case.editedTitle": "آخر تعديل: {date}",
      "case.editAria": "تعديل حالة المريض {code}",
      "case.deleteAria": "حذف حالة المريض {code}",
      "empty.title": "السجل جاهز لأول حالة",
      "empty.body": "ابدأ بتوثيق أول حالة طبية، وستظهر هنا مباشرة بعد حفظها.",
      "empty.action": "إضافة أول حالة",
      "error.title": "تعذّر تحميل السجل",
      "error.action": "إعادة المحاولة",
      "dialog.closeAria": "إغلاق نافذة الحذف",
      "dialog.title": "حذف الحالة نهائيًا؟",
      "dialog.description": "سيتم حذف سجل المريض «{code}» نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
      "dialog.cancel": "إلغاء",
      "dialog.confirm": "حذف نهائي",
      "dialog.deleting": "جارٍ الحذف…",
      "toast.closeAria": "إغلاق الإشعار",
      "footer.note": "سجل سريري رقمي آمن · يُرجى الالتزام بسياسات مؤسستك لحماية بيانات المرضى.",
      "setup.title": "إعداد Supabase مطلوب",
      "setup.missing": "لم يتم العثور على بيانات اتصال Supabase. أضف Project URL ومفتاح anon العام في ملف config.js.",
      "setup.placeholder": "لم يتم استبدال القيم التجريبية بعد. افتح ملف config.js وضع Project URL والمفتاح العام لمشروعك.",
      "setup.invalidUrl": "Project URL غير صالح. يجب أن يبدأ بـ https://.",
      "setup.secret": "لا تستخدم مفتاحًا سريًا داخل المتصفح. استخدم anon public key أو publishable key فقط.",
      "setup.notAnon": "المفتاح المستخدم ليس مفتاح anon العام. استخدم anon أو publishable key.",
      "setup.shortKey": "مفتاح Supabase العام يبدو غير مكتمل. راجع إعدادات المشروع.",
      "setup.keyInvalidTitle": "مفتاح Supabase غير صالح",
      "setup.keyInvalidBody": "رفض Supabase المفتاح العام الحالي. تأكد من أن Project URL والمفتاح مأخوذان من المشروع نفسه، وأن المفتاح anon public أو publishable كامل وغير معطّل، ثم أعد تحميل الصفحة.",
      "setup.projectNotFoundTitle": "مشروع Supabase غير موجود",
      "setup.projectNotFoundBody": "لم يتم العثور على مشروع Supabase على الرابط المحدد. تحقّق من Project URL في ملف config.js، ثم أعد تحميل الصفحة.",
      "setup.libraryTitle": "تعذّر تحميل Supabase",
      "setup.libraryBody": "تعذّر تحميل مكتبة Supabase المحلية. تأكد من رفع مجلد lib مع ملفات المشروع، ثم أعد تحميل الصفحة.",
      "setup.initTitle": "تعذّر تهيئة الاتصال",
      "setup.initBody": "راجع Project URL والمفتاح العام في ملف config.js، ثم أعد تحميل الصفحة.",
      "auth.sessionCheckFailed": "تعذّر التحقق من جلسة الدخول. تحقّق من الاتصال ثم حاول تسجيل الدخول.",
      "auth.titleLogin": "تسجيل الدخول",
      "auth.titleSignup": "إنشاء حساب جديد",
      "auth.subtitleLogin": "ادخل إلى سجلاتك السريرية من أي جهاز.",
      "auth.subtitleSignup": "أنشئ مساحة خاصة لحفظ سجلاتك السريرية.",
      "auth.switchPromptLogin": "ليس لديك حساب بعد؟",
      "auth.switchPromptSignup": "لديك حساب بالفعل؟",
      "auth.switchToLogin": "تسجيل الدخول",
      "auth.switchToSignup": "إنشاء حساب جديد",
      "auth.submitChecking": "جارٍ التحقق…",
      "auth.submitCreating": "جارٍ إنشاء الحساب…",
      "auth.alertSignupConfirm": "تم إنشاء الحساب. افتح رسالة التأكيد في بريدك الإلكتروني ثم سجّل الدخول.",
      "auth.alertSignupLoginFailed": "تم إنشاء الحساب، لكن تعذّر تسجيل الدخول تلقائيًا. سجّل الدخول بكلمة المرور.",
      "auth.validationEmailRequired": "أدخل البريد الإلكتروني.",
      "auth.validationEmailInvalid": "أدخل بريدًا إلكترونيًا صالحًا.",
      "auth.validationPasswordRequired": "أدخل كلمة المرور.",
      "auth.validationPasswordMin": "اختر كلمة مرور من 8 أحرف على الأقل.",
      "auth.errorOffline": "لا يوجد اتصال بالإنترنت. تحقّق من الشبكة ثم حاول مرة أخرى.",
      "auth.errorInvalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      "auth.errorEmailNotConfirmed": "يرجى تأكيد بريدك الإلكتروني أولًا، ثم حاول تسجيل الدخول.",
      "auth.errorAlreadyRegistered": "هذا البريد الإلكتروني مسجّل مسبقًا. استخدم تسجيل الدخول أو استعد كلمة المرور.",
      "auth.errorWeakPassword": "كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل.",
      "auth.errorRateLimit": "تم تجاوز حد المحاولات. انتظر بضع دقائق ثم حاول مجددًا.",
      "auth.errorInvalidEmail": "البريد الإلكتروني غير صالح. راجع العنوان ثم حاول مجددًا.",
      "auth.errorInvalidApiKey": "مفتاح Supabase غير صالح أو لا يطابق رابط المشروع. راجع config.js ثم أعد تحميل الصفحة.",
      "auth.errorNetwork": "تعذّر الوصول إلى خدمة الدخول. تحقّق من الإنترنت وإعدادات Supabase.",
      "auth.errorSessionMissing": "لم تكتمل جلسة الدخول. حاول مرة أخرى.",
      "auth.errorGeneric": "تعذّر إتمام عملية الدخول. تحقّق من البيانات وحاول مرة أخرى.",
      "validation.patientCodeRequired": "أدخل رمز المريض.",
      "validation.patientCodeMax": "رمز المريض أطول من 40 حرفًا.",
      "validation.diagnosisRequired": "أدخل التشخيص.",
      "validation.diagnosisMax": "التشخيص أطول من 180 حرفًا.",
      "validation.notesMax": "الملاحظات أطول من 1000 حرف.",
      "alert.loginRequired": "يجب تسجيل الدخول قبل حفظ الحالة.",
      "dataErrorOffline": "لا يوجد اتصال بالإنترنت حاليًا. تحقّق من الشبكة ثم حاول مرة أخرى.",
      "dataErrorTableMissing": "الجدول clinical_cases غير موجود. نفّذ ملف supabase-schema.sql كاملًا في SQL Editor.",
      "dataErrorPermission": "لا تملك صلاحية الوصول إلى هذا السجل. تأكد من تسجيل الدخول ومن سياسات RLS.",
      "dataErrorSession": "انتهت جلسة الدخول أو أن مفتاح Supabase غير صالح. أعد تسجيل الدخول.",
      "dataErrorSchema": "بنية الجدول لا تطابق التطبيق. نفّذ ملف supabase-schema.sql المحدّث لإضافة user_id وupdated_at.",
      "dataErrorNotFound": "لم يتم العثور على السجل، أو لا تملك صلاحية تعديله.",
      "dataErrorNetwork": "تعذّر الوصول إلى Supabase. تحقّق من الرابط واتصال الشبكة.",
      "dataErrorConstraint": "إحدى القيم لا تطابق قيود قاعدة البيانات. تحقّق من طول الحقول ثم حاول مجددًا.",
      "dataErrorDeleteNotApplied": "لم يتم حذف السجل. ربما حُذف مسبقًا أو لا تملك صلاحية حذفه.",
      "dataErrorUpdate": "تعذّر تحديث الحالة. راجع البيانات وإعدادات Supabase ثم حاول مجددًا.",
      "dataErrorDelete": "تعذّر حذف الحالة. راجع الاتصال وإعدادات Supabase ثم حاول مجددًا.",
      "dataErrorLoad": "تعذّر تحميل السجل. راجع إعدادات Supabase وحاول مرة أخرى.",
      "dataErrorSave": "تعذّر حفظ الحالة. راجع إعدادات Supabase وحاول مرة أخرى.",
      "toastLoginSuccess": "تم تسجيل الدخول بنجاح.",
      "toastSignupSuccess": "تم إنشاء الحساب وتسجيل الدخول.",
      "toastSignupConfirm": "تم إنشاء الحساب. تحقّق من بريدك الإلكتروني.",
      "toastLogoutSuccess": "تم تسجيل الخروج بأمان.",
      "toastSessionExpired": "انتهت جلسة الدخول. سجّل الدخول من جديد.",
      "toastLogoutFailed": "تعذّر تسجيل الخروج. تحقّق من الاتصال وحاول مرة أخرى.",
      "toastLoginRequired": "جلسة الدخول غير متاحة. سجّل الدخول من جديد.",
      "toastSaveSuccess": "تم حفظ الحالة وإضافتها إلى السجل بنجاح.",
      "toastUpdateSuccess": "تم تحديث الحالة بنجاح.",
      "toastDeleteSuccess": "تم حذف الحالة نهائيًا.",
      "toastLoadFailedStale": "تعذّر تحديث القائمة. تُعرض آخر بيانات محمّلة.",
      "toastSaveFailed": "تعذّر حفظ الحالة.",
      "toastUpdateFailed": "تعذّر تحديث الحالة.",
      "toastDeleteFailed": "تعذّر حذف الحالة. راجع التفاصيل في النافذة.",
      "toastConnectionRestored": "عاد الاتصال بالإنترنت. يتم تحديث السجل…",
      "announceLoaded": "تم تحميل {count} من الحالات.",
      "announceLoadFailed": "تعذّر تحميل الحالات. راجع إعدادات Supabase.",
      "announceSaved": "تم حفظ الحالة الجديدة بنجاح.",
      "announceUpdated": "تم تحديث الحالة في السجل.",
      "announceDeleted": "تم حذف الحالة من السجل.",
    },
    en: {
      "meta.title": "Clinical Logbook | Medical Case Log",
      "meta.description": "Clinical Logbook — a secure digital medical log with sign-in and Supabase row-level isolation for every user.",
      "noscript.title": "JavaScript required",
      "noscript.body": "Enable JavaScript in your browser to sign in and use the secure log.",
      "skipLink": "Skip to main content",
      "brand.tagline": "Medical Case Log",
      "language.switchToEnglish": "Switch to English",
      "language.switchToArabic": "Switch to Arabic",
      "language.english": "English",
      "language.arabic": "العربية",
      "connection.title": "Supabase connection status",
      "connection.statusAria": "Connection status: {label}",
      "account.title": "Your account",
      "account.signedInAs": "Signed in as",
      "account.logout": "Sign out",
      "account.fallbackEmail": "User account",
      "signin.aria": "Go to sign in",
      "signin.text": "Sign in",
      "newCase.aria": "Add a new case",
      "newCase.text": "New case",
      "hero.eyebrow": "A secure clinical documentation space",
      "hero.titleHtml": "Every case deserves<br><span>a precise record.</span>",
      "hero.lead": "Record medical cases in your account, document diagnoses and notes, and keep a private log only you can see.",
      "hero.asideAria": "Workspace information",
      "hero.today": "Today",
      "hero.rlsNote": "Every account's records are protected by Supabase row-level policies.",
      "boot.title": "Preparing your workspace",
      "boot.body": "Checking connection settings and your secure sign-in session…",
      "access.kicker": "Secure access",
      "auth.tabsAria": "Access method",
      "auth.loginTab": "Sign in",
      "auth.signupTab": "Create account",
      "auth.emailLabel": "Email",
      "auth.passwordLabel": "Password",
      "auth.passwordHintLogin": "At least 6 characters",
      "auth.passwordHintSignup": "At least 8 characters for protection",
      "auth.showPassword": "Show password",
      "auth.hidePassword": "Hide password",
      "auth.securityNote": "Encrypted session. Patient records are never stored locally in the browser.",
      "auth.accessTitle": "Access your logbook",
      "auth.accessSubtitle": "Connect Supabase to enable secure sign-in.",
      "auth.lockedTitleDefault": "Connection incomplete",
      "auth.lockedTextDefault": "Finish setting up Supabase to access your logbook.",
      "auth.lockedStep1Html": "Place the <strong>Project URL</strong> and <strong>anon public key</strong> in <code>config.js</code>.",
      "auth.lockedStep2Html": "Run the full <code>supabase-schema.sql</code> file in the <strong>SQL Editor</strong>.",
      "auth.lockedStep3Html": "Reload the page, then create your account and sign in.",
      "auth.lockedHintHtml": "Details are in <code>README.md</code>. Never use a <code>service_role</code> key in the browser.",
      "access.asideKicker": "Data protection",
      "access.asideTitle": "Your record, and yours alone.",
      "access.asideBody": "Every user has an isolated space. Even when people share the same app link, the database prevents any account from seeing another account's records.",
      "access.point1Title": "Row-level isolation",
      "access.point1BodyHtml": "RLS policies bind every record to its owner through <code>auth.uid()</code>.",
      "access.point2Title": "Authenticated session",
      "access.point2Body": "Sign-in through Supabase Auth with secure session refresh.",
      "access.point3Title": "Cloud-only data",
      "access.point3Body": "No patient records in LocalStorage; Supabase is the only source of truth.",
      "access.asideNote": "Use de-identified patient data and follow your organization's privacy policies.",
      "entry.addKicker": "Add record",
      "entry.addTitle": "New clinical case",
      "entry.addDescription": "Fill in the fields below. The case will appear in your log as soon as you save it.",
      "entry.editKicker": "Edit record",
      "entry.editTitle": "Edit case",
      "entry.editDescription": "Update the case details, then save. The edit time is recorded automatically.",
      "form.patientCodeLabel": "Patient code",
      "form.patientCodePlaceholder": "e.g. PT-2026-0147",
      "form.patientCodeHint": "Use an alternative code that does not reveal the patient's identity. Up to 40 characters.",
      "form.diagnosisLabel": "Diagnosis",
      "form.diagnosisPlaceholder": "e.g. community-acquired pneumonia",
      "form.diagnosisHint": "Enter the confirmed clinical diagnosis. Up to 180 characters.",
      "form.notesLabel": "Notes",
      "form.optional": "(optional)",
      "form.notesPlaceholder": "Add relevant details: symptoms, follow-up plan, or other clinical notes…",
      "form.notesHint": "You can leave this field empty. Up to 1000 characters.",
      "form.privacyTitle": "Privacy reminder",
      "form.privacyText": "Avoid entering full names, ID numbers, or any directly identifying information.",
      "form.timestampAdd": "Save time is added automatically.",
      "form.timestampEdit": "Edit time is recorded automatically.",
      "form.submitSave": "Save case",
      "form.submitSaving": "Saving case…",
      "form.submitUpdate": "Save changes",
      "form.submitUpdating": "Updating case…",
      "form.cancelEdit": "Cancel edit",
      "list.kicker": "Log",
      "list.title": "Recent cases",
      "list.refreshAria": "Refresh the case list",
      "list.refreshTitle": "Refresh list",
      "list.subtitleDefault": "Your private records, newest first",
      "list.subtitleEmpty": "No cases recorded yet",
      "list.subtitleLoading": "Loading records…",
      "list.subtitleError": "Could not load records",
      "list.subtitleSignout": "Sign in to view your cases.",
      "list.lastSyncNever": "Not synced yet",
      "list.lastSync": "Last sync: {time}",
      "list.syncing": "Syncing…",
      "list.syncFailed": "Sync failed",
      "list.synced": "Synced",
      "sync.checking": "Connecting to Supabase",
      "sync.online": "Secure saving with Supabase",
      "sync.error": "Supabase connection failed",
      "sync.setup": "Sync awaiting setup",
      "sync.unknown": "Unknown sync status",
      "status.checking": "Connecting",
      "status.setup": "Setup required",
      "status.loadFailed": "Load failed",
      "status.connectionFailed": "Connection failed",
      "status.needsReview": "Needs review",
      "status.online": "Connected to Supabase",
      "status.available": "Ready to sign in",
      "status.offline": "Offline",
      "status.updateFailed": "Update failed",
      "status.saveFailed": "Save failed",
      "case.edited": "Edited",
      "case.edit": "Edit",
      "case.delete": "Delete",
      "case.noCode": "No code",
      "case.noDiagnosis": "No diagnosis",
      "case.noDate": "No date",
      "case.editedTitle": "Last edited: {date}",
      "case.editAria": "Edit patient case {code}",
      "case.deleteAria": "Delete patient case {code}",
      "empty.title": "Your log is ready for the first case",
      "empty.body": "Start by documenting your first medical case. It will appear here right after saving.",
      "empty.action": "Add first case",
      "error.title": "Could not load the log",
      "error.action": "Try again",
      "dialog.closeAria": "Close delete dialog",
      "dialog.title": "Delete this case permanently?",
      "dialog.description": "The patient record \"{code}\" will be permanently deleted. This action cannot be undone.",
      "dialog.cancel": "Cancel",
      "dialog.confirm": "Delete permanently",
      "dialog.deleting": "Deleting…",
      "toast.closeAria": "Dismiss notification",
      "footer.note": "Secure digital clinical log · Please follow your organization's policies for protecting patient data.",
      "setup.title": "Supabase setup required",
      "setup.missing": "Supabase connection details were not found. Add the Project URL and public anon key to config.js.",
      "setup.placeholder": "The placeholder values have not been replaced. Open config.js and enter your project's Project URL and public key.",
      "setup.invalidUrl": "Project URL is invalid. It must start with https://.",
      "setup.secret": "Do not use a secret key in the browser. Use only the anon public or publishable key.",
      "setup.notAnon": "The key used is not an anon public key. Use an anon or publishable key.",
      "setup.shortKey": "The Supabase public key looks incomplete. Check your project settings.",
      "setup.keyInvalidTitle": "Invalid Supabase key",
      "setup.keyInvalidBody": "Supabase rejected the current public key. Make sure the Project URL and key come from the same project, and that the anon public or publishable key is complete and enabled, then reload the page.",
      "setup.projectNotFoundTitle": "Supabase project not found",
      "setup.projectNotFoundBody": "No Supabase project was found at the configured URL. Check the Project URL in config.js, then reload the page.",
      "setup.libraryTitle": "Could not load Supabase",
      "setup.libraryBody": "The local Supabase library could not be loaded. Make sure the lib folder was uploaded with the project files, then reload the page.",
      "setup.initTitle": "Could not initialize the connection",
      "setup.initBody": "Review the Project URL and public key in config.js, then reload the page.",
      "auth.sessionCheckFailed": "Could not verify your sign-in session. Check your connection and try signing in.",
      "auth.titleLogin": "Sign in",
      "auth.titleSignup": "Create a new account",
      "auth.subtitleLogin": "Access your clinical records from any device.",
      "auth.subtitleSignup": "Create a private space for your clinical records.",
      "auth.switchPromptLogin": "Don't have an account yet?",
      "auth.switchPromptSignup": "Already have an account?",
      "auth.switchToLogin": "Sign in",
      "auth.switchToSignup": "Create a new account",
      "auth.submitChecking": "Checking…",
      "auth.submitCreating": "Creating account…",
      "auth.alertSignupConfirm": "Account created. Open the confirmation email, then sign in.",
      "auth.alertSignupLoginFailed": "Account created, but automatic sign-in failed. Sign in with your password.",
      "auth.validationEmailRequired": "Enter your email.",
      "auth.validationEmailInvalid": "Enter a valid email address.",
      "auth.validationPasswordRequired": "Enter your password.",
      "auth.validationPasswordMin": "Choose a password of at least 8 characters.",
      "auth.errorOffline": "No internet connection. Check your network and try again.",
      "auth.errorInvalidCredentials": "The email or password is incorrect.",
      "auth.errorEmailNotConfirmed": "Please confirm your email first, then try signing in.",
      "auth.errorAlreadyRegistered": "This email is already registered. Sign in or reset your password.",
      "auth.errorWeakPassword": "Password is too weak. Use at least 8 characters.",
      "auth.errorRateLimit": "Too many attempts. Wait a few minutes and try again.",
      "auth.errorInvalidEmail": "The email address is invalid. Check it and try again.",
      "auth.errorInvalidApiKey": "The Supabase key is invalid or does not match the project URL. Check config.js, then reload the page.",
      "auth.errorNetwork": "Could not reach the sign-in service. Check your connection and Supabase settings.",
      "auth.errorSessionMissing": "The sign-in session was not completed. Try again.",
      "auth.errorGeneric": "Could not complete sign-in. Check your details and try again.",
      "validation.patientCodeRequired": "Enter the patient code.",
      "validation.patientCodeMax": "Patient code is longer than 40 characters.",
      "validation.diagnosisRequired": "Enter the diagnosis.",
      "validation.diagnosisMax": "Diagnosis is longer than 180 characters.",
      "validation.notesMax": "Notes are longer than 1000 characters.",
      "alert.loginRequired": "You must sign in before saving a case.",
      "dataErrorOffline": "No internet connection right now. Check your network and try again.",
      "dataErrorTableMissing": "The clinical_cases table does not exist. Run the full supabase-schema.sql file in the SQL Editor.",
      "dataErrorPermission": "You do not have permission to access this record. Make sure you are signed in and that RLS policies are correct.",
      "dataErrorSession": "Your session expired or the Supabase key is invalid. Sign in again.",
      "dataErrorSchema": "The table structure does not match the app. Run the updated supabase-schema.sql file to add user_id and updated_at.",
      "dataErrorNotFound": "The record was not found, or you do not have permission to edit it.",
      "dataErrorNetwork": "Could not reach Supabase. Check the URL and your network connection.",
      "dataErrorConstraint": "One of the values does not match the database constraints. Check the field lengths and try again.",
      "dataErrorDeleteNotApplied": "The record was not deleted. It may have been deleted already, or you do not have permission to delete it.",
      "dataErrorUpdate": "Could not update the case. Review the data and Supabase settings, then try again.",
      "dataErrorDelete": "Could not delete the case. Review the connection and Supabase settings, then try again.",
      "dataErrorLoad": "Could not load the log. Review the Supabase settings and try again.",
      "dataErrorSave": "Could not save the case. Review the Supabase settings and try again.",
      "toastLoginSuccess": "Signed in successfully.",
      "toastSignupSuccess": "Account created and signed in.",
      "toastSignupConfirm": "Account created. Check your email.",
      "toastLogoutSuccess": "Signed out securely.",
      "toastSessionExpired": "Your session expired. Please sign in again.",
      "toastLogoutFailed": "Could not sign out. Check your connection and try again.",
      "toastLoginRequired": "Sign-in session unavailable. Please sign in again.",
      "toastSaveSuccess": "Case saved and added to the log.",
      "toastUpdateSuccess": "Case updated successfully.",
      "toastDeleteSuccess": "Case deleted permanently.",
      "toastLoadFailedStale": "Could not refresh the list. Showing the last loaded data.",
      "toastSaveFailed": "Could not save the case.",
      "toastUpdateFailed": "Could not update the case.",
      "toastDeleteFailed": "Could not delete the case. See details in the dialog.",
      "toastConnectionRestored": "Connection restored. Refreshing the log…",
      "announceLoaded": "Loaded records: {count}.",
      "announceLoadFailed": "Could not load cases. Review the Supabase settings.",
      "announceSaved": "New case saved successfully.",
      "announceUpdated": "Case updated in the log.",
      "announceDeleted": "Case deleted from the log.",
    },
  };
  const skeletonMarkup = `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-card__row"><span class="skeleton skeleton--chip"></span><span class="skeleton skeleton--date"></span></div>
      <span class="skeleton skeleton--title"></span>
      <span class="skeleton skeleton--line"></span>
      <span class="skeleton skeleton--line skeleton--short"></span>
    </div>`;

  const configState = inspectConfig(window.CLINICAL_LOGBOOK_CONFIG);
  const els = {};
  const fields = {};

  let currentLanguage = readStoredLanguage();
  let db = null;
  let currentUser = null;
  let activeUserId = null;
  let authMode = "login";
  let authLockedBySetup = false;
  let setupIssueState = null;
  let authAlertState = null;
  let isAuthSubmitting = false;
  let isSigningOut = false;
  let isLoading = false;
  let isSubmitting = false;
  let isDeleting = false;
  let hasLoadedOnce = false;
  let cachedCases = [];
  let editingId = null;
  let pendingDeleteRecord = null;
  let toastTimer = null;
  let lastSyncAt = null;
  let lastSyncState = "never";
  let connectionType = "checking";
  let connectionStatusKey = "status.checking";
  let projectCheckPassed = false;
  let formAlertKey = "";
  let deleteDialogErrorKey = "";
  const authFieldErrorKeys = { email: "", password: "" };
  const caseFieldErrorKeys = { patientCode: "", diagnosis: "", notes: "" };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    applyDocumentLanguage();
    applyStaticTranslations();
    cacheElements();
    bindEvents();
    updateLanguageToggle();
    setToday();
    updateNotesCount();
    renderAuthMode("login", { clearErrors: true });

    if (!configState.valid) {
      showSetupIssue("setup.title", configState.messageKey);
      setConnectionState("setup", "status.setup");
      return;
    }

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      showSetupIssue("setup.libraryTitle", "setup.libraryBody");
      setConnectionState("error", "status.loadFailed");
      return;
    }

    try {
      db = window.supabase.createClient(configState.url, configState.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (error) {
      console.error("Supabase client initialization failed:", error);
      showSetupIssue("setup.initTitle", "setup.initBody");
      setConnectionState("error", "status.connectionFailed");
      return;
    }

    setConnectionState("checking", "status.checking");
    verifySupabaseProject().then((canContinue) => {
      if (canContinue) initializeAuth();
    });
  }

  async function verifySupabaseProject() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      PROJECT_CHECK_TIMEOUT_MS
    );

    try {
      const response = await fetch(`${configState.url}/auth/v1/settings`, {
        headers: { apikey: configState.key },
        cache: "no-store",
        signal: controller.signal,
      });

      if (response.ok) {
        projectCheckPassed = true;
        return true;
      }

      if (response.status === 401 || response.status === 403) {
        showSetupIssue("setup.keyInvalidTitle", "setup.keyInvalidBody");
        setConnectionState("error", "status.needsReview");
        return false;
      }

      if (response.status === 404) {
        showSetupIssue("setup.projectNotFoundTitle", "setup.projectNotFoundBody");
        setConnectionState("error", "status.needsReview");
        return false;
      }

      console.error(`Supabase settings check failed with HTTP ${response.status}.`);
      setConnectionState("error", "status.connectionFailed");
      return true;
    } catch (error) {
      if (error?.name === "AbortError") {
        console.error("Supabase settings check timed out.");
      } else {
        console.error("Supabase settings check failed:", error);
      }
      setConnectionState("error", "status.connectionFailed");
      return true;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function cacheElements() {
    els.bootView = byId("bootView");
    els.accessView = byId("accessView");
    els.appView = byId("appView");

    els.connectionBadge = byId("connectionBadge");
    els.connectionText = byId("connectionText");
    els.signinButton = byId("signinButton");
    els.newCaseButton = byId("newCaseButton");
    els.languageToggle = byId("languageToggle");
    els.languageToggleText = byId("languageToggleText");

    els.accountMenu = byId("accountMenu");
    els.accountBtn = byId("accountBtn");
    els.accountAvatar = byId("accountAvatar");
    els.userEmail = byId("userEmail");
    els.accountPopover = byId("accountPopover");
    els.accountEmailFull = byId("accountEmailFull");
    els.logoutBtn = byId("logoutBtn");

    els.authTitle = byId("authTitle");
    els.authSubtitle = byId("authSubtitle");
    els.authFormWrap = byId("authFormWrap");
    els.authLocked = byId("authLocked");
    els.authLockedTitle = byId("authLockedTitle");
    els.authLockedText = byId("authLockedText");
    els.authTabs = byId("authTabs");
    els.authLoginTab = byId("authLoginTab");
    els.authSignupTab = byId("authSignupTab");
    els.authForm = byId("authForm");
    els.authEmail = byId("authEmail");
    els.authPassword = byId("authPassword");
    els.authEmailError = byId("authEmailError");
    els.authPasswordError = byId("authPasswordError");
    els.authPasswordHint = byId("authPasswordHint");
    els.authPasswordToggle = byId("authPasswordToggle");
    els.authAlert = byId("authAlert");
    els.authAlertText = byId("authAlertText");
    els.authSubmitBtn = byId("authSubmitBtn");
    els.authSubmitSpinner = byId("authSubmitSpinner");
    els.authSubmitText = byId("authSubmitText");
    els.authSwitchRow = byId("authSwitchRow");
    els.authSwitchText = byId("authSwitchText");
    els.authSwitchBtn = byId("authSwitchBtn");
    els.eyeShow = els.authPasswordToggle?.querySelector(".eye-icon--show");
    els.eyeHide = els.authPasswordToggle?.querySelector(".eye-icon--hide");

    els.form = byId("caseForm");
    els.patientCode = byId("patient-code");
    els.diagnosis = byId("diagnosis");
    els.notes = byId("notes");
    els.patientCodeError = byId("patient-code-error");
    els.diagnosisError = byId("diagnosis-error");
    els.notesError = byId("notes-error");
    els.notesCount = byId("notesCount");
    els.submitBtn = byId("submitBtn");
    els.submitBtnText = byId("submitBtnText");
    els.submitSpinner = byId("submitSpinner");
    els.cancelEditBtn = byId("cancelEditBtn");
    els.formAlert = byId("formAlert");
    els.formAlertText = byId("formAlertText");
    els.entryPanel = byId("new-case");
    els.entryKickerText = byId("entryKickerText");
    els.entryTitle = byId("entry-title");
    els.entryDescription = byId("entryDescription");
    els.formStepMark = byId("formStepMark");
    els.formTimestampText = byId("formTimestampText");

    els.caseList = byId("caseList");
    els.refreshBtn = byId("refreshBtn");
    els.casesCount = byId("casesCount");
    els.listSubtitle = byId("listSubtitle");
    els.listAnnouncement = byId("listAnnouncement");
    els.lastSync = byId("lastSync");
    els.syncIndicator = byId("syncIndicator");
    els.syncLabel = byId("syncLabel");

    els.toast = byId("toast");
    els.toastMessage = byId("toastMessage");
    els.toastClose = byId("toastClose");
    els.todayDate = byId("todayDate");
    els.todayWeekday = byId("todayWeekday");

    els.caseItemTemplate = byId("caseItemTemplate");
    els.emptyStateTemplate = byId("emptyStateTemplate");
    els.errorStateTemplate = byId("errorStateTemplate");

    els.deleteDialog = byId("deleteDialog");
    els.deleteDialogText = byId("deleteDialogText");
    els.deleteDialogError = byId("deleteDialogError");
    els.deleteDialogErrorText = byId("deleteDialogErrorText");
    els.deleteDialogClose = byId("deleteDialogClose");
    els.cancelDeleteBtn = byId("cancelDeleteBtn");
    els.confirmDeleteBtn = byId("confirmDeleteBtn");
    els.deleteSpinner = byId("deleteSpinner");
    els.confirmDeleteText = byId("confirmDeleteText");

    fields.patientCode = { input: els.patientCode, error: els.patientCodeError };
    fields.diagnosis = { input: els.diagnosis, error: els.diagnosisError };
    fields.notes = { input: els.notes, error: els.notesError };
  }

  async function initializeAuth() {
    if (!db) return;

    db.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        handleSignedOut();
        return;
      }

      if (!session?.user) return;

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED" ||
        event === "INITIAL_SESSION"
      ) {
        applySession(session);
      }
    });

    try {
      const { data, error } = await db.auth.getSession();
      if (error) throw error;

      if (data?.session) {
        applySession(data.session);
      } else if (!activeUserId) {
        handleNoSession();
      }
    } catch (error) {
      console.error("Session check failed:", error);
      els.bootView.hidden = true;
      showAccessView();
      showAuthForm();
      showAuthAlert("auth.sessionCheckFailed", "error");
      setConnectionState("error", "status.needsReview");
    }
  }

  function applySession(session) {
    const user = session?.user;
    if (!user) {
      handleNoSession();
      return;
    }

    const isNewUser = activeUserId !== user.id;
    const cameFromAuthView = !els.accessView.hidden;
    currentUser = user;
    activeUserId = user.id;
    projectCheckPassed = true;

    els.bootView.hidden = true;
    els.accessView.hidden = true;
    els.appView.hidden = false;
    setNewCaseVisibility(true);
    setSigninVisibility(false);
    updateAccountUI(user);
    closeAccountMenu();
    setConnectionState("online", "status.online");

    if (isNewUser) {
      hasLoadedOnce = false;
      cachedCases = [];
      resetCaseForm();
      els.authForm.reset();
      clearAuthFieldErrors();
      clearAuthAlert();
      setAuthMode("login", { clearErrors: false });
      loadCases();
      scrollToWorkspace(cameFromAuthView);
    } else if (!hasLoadedOnce) {
      loadCases();
    }
  }

  function handleNoSession() {
    currentUser = null;
    activeUserId = null;
    isLoading = false;
    hasLoadedOnce = false;
    cachedCases = [];
    pendingDeleteRecord = null;
    editingId = null;

    hideBoot();
    hideAppView();
    clearSensitiveView();
    showAccessView();
    showAuthForm();

    setNewCaseVisibility(false);
    setSigninVisibility(true);
    els.accountMenu.hidden = true;
    closeAccountMenu();
    setConnectionState(
      projectCheckPassed ? "online" : "error",
      projectCheckPassed ? "status.available" : "status.connectionFailed"
    );
    setRefreshLoading(false);
    resetCaseForm();
    setAuthMode("login", { clearErrors: true });
    els.authForm.reset();
    clearAuthFieldErrors();
    clearAuthAlert();
  }

  function handleSignedOut() {
    const hadUser = Boolean(activeUserId);
    const wasExplicit = isSigningOut;
    isSigningOut = false;
    handleNoSession();

    if (hadUser) {
      scrollToAccessView();
      showToast(
        wasExplicit ? "toastLogoutSuccess" : "toastSessionExpired",
        wasExplicit ? "success" : "error"
      );
    }
  }

  function showSetupIssue(titleKey, messageKey) {
    setupIssueState = { titleKey, messageKey };
    authLockedBySetup = true;
    hideBoot();
    hideAppView();
    els.accessView.hidden = false;
    els.authFormWrap.hidden = true;
    els.authLocked.hidden = false;
    renderSetupIssue();
    setNewCaseVisibility(false);
    setSigninVisibility(true);
    els.accountMenu.hidden = true;
    closeAccountMenu();
  }

  function renderSetupIssue() {
    if (!setupIssueState) return;
    els.authLockedTitle.textContent = t(setupIssueState.titleKey);
    els.authLockedText.textContent = t(setupIssueState.messageKey);
    els.authTitle.textContent = t("auth.accessTitle");
    els.authSubtitle.textContent = t("auth.accessSubtitle");
  }

  function showAccessView() {
    els.bootView.hidden = true;
    els.accessView.hidden = false;
    els.appView.hidden = true;
  }

  function showAuthForm() {
    if (authLockedBySetup) return;
    els.authFormWrap.hidden = false;
    els.authLocked.hidden = true;
  }

  function hideBoot() {
    els.bootView.hidden = true;
  }

  function hideAppView() {
    els.appView.hidden = true;
  }

  function clearSensitiveView() {
    pendingDeleteRecord = null;
    isDeleting = false;
    deleteDialogErrorKey = "";

    if (els.deleteDialog.open) {
      if (typeof els.deleteDialog.close === "function") {
        els.deleteDialog.close();
      } else {
        els.deleteDialog.removeAttribute("open");
      }
    }

    setDeleteLoading(false);
    setSubmitting(false);
    els.caseList.replaceChildren();
    els.caseList.setAttribute("aria-busy", "false");
    els.casesCount.textContent = "0";
    els.listSubtitle.textContent = t("list.subtitleSignout");
    lastSyncAt = null;
    lastSyncState = "never";
    renderLastSync();
    els.listAnnouncement.textContent = "";
    els.userEmail.textContent = "";
    els.accountEmailFull.textContent = "";
    els.accountAvatar.textContent = currentLanguage === "ar" ? "؟" : "?";
  }

  function scrollToWorkspace(smooth = false) {
    window.setTimeout(() => {
      if (els.appView.hidden) return;
      const top = els.appView.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto",
      });
    }, 90);
  }

  function scrollToAccessView() {
    window.setTimeout(() => {
      if (els.accessView.hidden) return;
      const top = els.accessView.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, 90);
  }

  function setNewCaseVisibility(visible) {
    els.newCaseButton.hidden = !visible;
  }

  function setSigninVisibility(visible) {
    els.signinButton.hidden = !visible;
  }

  function setAuthMode(mode, options = {}) {
    if (authMode !== mode) {
      els.authPassword.value = "";
      resetPasswordVisibility();
    }

    authMode = mode === "signup" ? "signup" : "login";
    const isSignup = authMode === "signup";

    els.authLoginTab.classList.toggle("is-active", !isSignup);
    els.authSignupTab.classList.toggle("is-active", isSignup);
    els.authLoginTab.setAttribute("aria-pressed", String(!isSignup));
    els.authSignupTab.setAttribute("aria-pressed", String(isSignup));

    els.authTitle.textContent = t(isSignup ? "auth.titleSignup" : "auth.titleLogin");
    els.authSubtitle.textContent = t(isSignup ? "auth.subtitleSignup" : "auth.subtitleLogin");

    els.authSubmitText.textContent = t(
      isAuthSubmitting
        ? isSignup
          ? "auth.submitCreating"
          : "auth.submitChecking"
        : isSignup
          ? "auth.signupTab"
          : "auth.loginTab"
    );
    els.authPasswordHint.textContent = t(
      isSignup ? "auth.passwordHintSignup" : "auth.passwordHintLogin"
    );
    els.authPassword.setAttribute("minlength", isSignup ? "8" : "6");
    els.authPassword.setAttribute("autocomplete", isSignup ? "new-password" : "current-password");
    els.authSwitchText.textContent = t(
      isSignup ? "auth.switchPromptSignup" : "auth.switchPromptLogin"
    );
    els.authSwitchBtn.textContent = t(
      isSignup ? "auth.switchToLogin" : "auth.switchToSignup"
    );

    if (options.clearErrors !== false) {
      clearAuthFieldErrors();
      clearAuthAlert();
    }
  }

  function renderAuthMode(mode, options = {}) {
    setAuthMode(mode, options);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    if (isAuthSubmitting || !db) return;

    clearAuthAlert();
    clearAuthFieldErrors();

    const email = els.authEmail.value.trim();
    const password = els.authPassword.value;
    const firstInvalid = validateAuthFields(email, password);
    if (firstInvalid) {
      (firstInvalid === "email" ? els.authEmail : els.authPassword).focus();
      return;
    }

    setAuthSubmitting(true);

    try {
      if (authMode === "login") {
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data?.session) {
          throw new Error("AUTH_SESSION_MISSING");
        }

        completeAuthSession(data.session, "toastLoginSuccess");
      } else {
        const redirectTo = getAuthRedirectUrl();
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
        });
        if (error) throw error;

        if (data?.session) {
          completeAuthSession(data.session, "toastSignupSuccess");
          return;
        }

        // If the project is configured without mandatory confirmation, some
        // Supabase setups still return no session from signUp. Sign the new
        // user in explicitly so account creation lands directly in the log.
        const loginResult = await db.auth.signInWithPassword({ email, password });

        if (loginResult.data?.session) {
          completeAuthSession(loginResult.data.session, "toastSignupSuccess");
          return;
        }

        setAuthMode("login", { clearErrors: true });
        els.authEmail.value = email;

        if (describeAuthError(loginResult.error) === "auth.errorEmailNotConfirmed") {
          showAuthAlert("auth.alertSignupConfirm", "success");
          showToast("toastSignupConfirm", "success");
        } else {
          showAuthAlert("auth.alertSignupLoginFailed", "error");
        }
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      const messageKey = describeAuthError(error);
      showAuthAlert(messageKey, "error");

      if (messageKey === "auth.errorInvalidApiKey") {
        setConnectionState("error", "status.needsReview");
      }
    } finally {
      setAuthSubmitting(false);
    }
  }

  function completeAuthSession(session, toastKey) {
    applySession(session);
    els.authForm.reset();
    clearAuthFieldErrors();
    showToast(toastKey, "success");
  }

  function validateAuthFields(email, password) {
    let firstInvalid = "";

    if (!email) {
      setAuthFieldError("email", "auth.validationEmailRequired");
      firstInvalid ||= "email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthFieldError("email", "auth.validationEmailInvalid");
      firstInvalid ||= "email";
    }

    if (!password) {
      setAuthFieldError("password", "auth.validationPasswordRequired");
      firstInvalid ||= "password";
    } else if (authMode === "signup" && password.length < 8) {
      setAuthFieldError("password", "auth.validationPasswordMin");
      firstInvalid ||= "password";
    }

    return firstInvalid;
  }

  function setAuthFieldError(type, messageKey) {
    authFieldErrorKeys[type] = messageKey;
    renderAuthFieldError(type);
  }

  function renderAuthFieldError(type) {
    const input = type === "email" ? els.authEmail : els.authPassword;
    const error = type === "email" ? els.authEmailError : els.authPasswordError;
    const messageKey = authFieldErrorKeys[type];

    if (messageKey) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      error.textContent = t(messageKey);
    } else {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      error.textContent = "";
    }
  }

  function renderAuthFieldErrors() {
    renderAuthFieldError("email");
    renderAuthFieldError("password");
  }

  function clearAuthFieldError(type) {
    authFieldErrorKeys[type] = "";
    renderAuthFieldError(type);
  }

  function clearAuthFieldErrors() {
    clearAuthFieldError("email");
    clearAuthFieldError("password");
  }

  function showAuthAlert(messageKey, type) {
    authAlertState = { messageKey, type };
    renderAuthAlert();
  }

  function renderAuthAlert() {
    if (!authAlertState) {
      els.authAlert.hidden = true;
      els.authAlert.classList.remove("is-success");
      els.authAlertText.textContent = "";
      return;
    }

    els.authAlertText.textContent = t(authAlertState.messageKey);
    els.authAlert.classList.toggle("is-success", authAlertState.type === "success");
    els.authAlert.hidden = false;
  }

  function clearAuthAlert() {
    authAlertState = null;
    renderAuthAlert();
  }

  function setAuthSubmitting(active) {
    isAuthSubmitting = active;
    els.authSubmitBtn.disabled = active;
    els.authSubmitBtn.classList.toggle("is-loading", active);
    els.authSubmitBtn.setAttribute("aria-busy", String(active));
    els.authSubmitSpinner.hidden = !active;
    els.authForm.setAttribute("aria-busy", String(active));
    els.authLoginTab.disabled = active;
    els.authSignupTab.disabled = active;
    els.authSwitchBtn.disabled = active;
    els.authPasswordToggle.disabled = active;

    els.authSubmitText.textContent = t(
      active
        ? authMode === "signup"
          ? "auth.submitCreating"
          : "auth.submitChecking"
        : authMode === "signup"
          ? "auth.signupTab"
          : "auth.loginTab"
    );
  }

  function renderPasswordToggleLabel() {
    if (!els.authPasswordToggle || !els.authPassword) return;
    const isVisible = els.authPassword.type === "text";
    els.authPasswordToggle.setAttribute(
      "aria-label",
      t(isVisible ? "auth.hidePassword" : "auth.showPassword")
    );
  }

  function resetPasswordVisibility() {
    els.authPassword.type = "password";
    if (els.eyeShow) els.eyeShow.hidden = false;
    if (els.eyeHide) els.eyeHide.hidden = true;
    if (els.authPasswordToggle) {
      els.authPasswordToggle.setAttribute("aria-pressed", "false");
      renderPasswordToggleLabel();
    }
  }

  function togglePasswordVisibility() {
    const shouldShow = els.authPassword.type === "password";
    els.authPassword.type = shouldShow ? "text" : "password";
    if (els.eyeShow) els.eyeShow.hidden = shouldShow;
    if (els.eyeHide) els.eyeHide.hidden = !shouldShow;
    els.authPasswordToggle.setAttribute("aria-pressed", String(shouldShow));
    renderPasswordToggleLabel();
    els.authPassword.focus();
  }

  function getAuthRedirectUrl() {
    if (!/^https?:$/.test(window.location.protocol)) return "";
    const directory = window.location.pathname.replace(/index\.html?$/i, "");
    const normalizedDirectory = directory.endsWith("/") ? directory : `${directory}/`;
    return `${window.location.origin}${normalizedDirectory}`;
  }

  function updateAccountUI(user) {
    const fallback = t("account.fallbackEmail");
    const email = typeof user?.email === "string" && user.email ? user.email : fallback;
    const initial = email.trim().charAt(0).toUpperCase() || fallback.charAt(0);
    els.userEmail.textContent = email;
    els.accountEmailFull.textContent = email;
    els.accountAvatar.textContent = initial;
    els.accountMenu.hidden = false;
  }

  function toggleAccountMenu() {
    const willOpen = els.accountPopover.hidden;
    els.accountPopover.hidden = !willOpen;
    els.accountBtn.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) {
      els.logoutBtn.focus();
    } else {
      els.accountBtn.focus();
    }
  }

  function closeAccountMenu() {
    els.accountPopover.hidden = true;
    els.accountBtn.setAttribute("aria-expanded", "false");
  }

  async function handleLogout() {
    if (!db || isSigningOut) return;

    isSigningOut = true;
    els.logoutBtn.disabled = true;
    closeAccountMenu();

    try {
      const { error } = await db.auth.signOut();
      if (error) throw error;
      if (activeUserId) handleSignedOut();
    } catch (error) {
      isSigningOut = false;
      console.error("Sign out failed:", error);
      showToast("toastLogoutFailed", "error");
    } finally {
      els.logoutBtn.disabled = false;
    }
  }

  function loadCases() {
    if (!db || !currentUser || isLoading) return;

    const userIdAtStart = currentUser.id;
    isLoading = true;
    setRefreshLoading(true);
    els.caseList.setAttribute("aria-busy", "true");
    els.listSubtitle.textContent = t("list.subtitleLoading");
    els.casesCount.textContent = "…";
    lastSyncState = "syncing";
    renderLastSync();

    if (!hasLoadedOnce || cachedCases.length === 0) {
      renderSkeletons();
    }

    db.from(TABLE_NAME)
      .select(CASE_FIELDS)
      .eq("user_id", userIdAtStart)
      .order("created_at", { ascending: false })
      .limit(MAX_CASES)
      .then(({ data, error }) => {
        if (activeUserId !== userIdAtStart) return;
        if (error) throw error;

        const rows = Array.isArray(data) ? data : [];
        cachedCases = rows.slice(0, MAX_CASES);
        hasLoadedOnce = true;
        renderCases(cachedCases);
        setConnectionState("online", "status.online");
        setLastSync();
        announce(t("announceLoaded", { count: formatNumber(cachedCases.length) }));
      })
      .catch((error) => {
        if (activeUserId !== userIdAtStart) return;

        console.error("Clinical cases fetch failed:", error);
        const messageKey = describeDataError(error, "load");
        setConnectionState("error", "status.needsReview");

        if (hasLoadedOnce && cachedCases.length > 0) {
          renderCases(cachedCases);
          showToast("toastLoadFailedStale", "error");
        } else {
          renderErrorState(messageKey);
          els.listSubtitle.textContent = t("list.subtitleError");
          els.casesCount.textContent = "—";
          announce(t("announceLoadFailed"));
        }

        lastSyncState = "failed";
        renderLastSync();
      })
      .finally(() => {
        isLoading = false;
        if (activeUserId === userIdAtStart) {
          setRefreshLoading(false);
          els.caseList.setAttribute("aria-busy", "false");
        }
      });
  }

  async function handleCaseSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!db || !currentUser) {
      showFormAlert("alert.loginRequired");
      showToast("toastLoginRequired", "error");
      return;
    }

    clearFormAlert();
    clearAllFieldErrors();

    const values = readCaseValues();
    const firstInvalid = validateCaseValues(values);
    if (firstInvalid) {
      fields[firstInvalid].input.focus();
      return;
    }

    const userIdAtStart = currentUser.id;
    const caseIdAtStart = editingId;
    const isEdit = Boolean(caseIdAtStart);

    setSubmitting(true);

    try {
      const payload = {
        patient_code: values.patientCode,
        diagnosis: values.diagnosis,
        notes: values.notes || null,
      };

      if (isEdit) {
        const { data, error } = await db
          .from(TABLE_NAME)
          .update(payload)
          .eq("id", caseIdAtStart)
          .eq("user_id", userIdAtStart)
          .select(CASE_FIELDS)
          .single();

        if (error) throw error;
        if (activeUserId !== userIdAtStart) return;

        const updatedRecord = data || {
          id: caseIdAtStart,
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const index = cachedCases.findIndex((record) => record.id === caseIdAtStart);
        if (index >= 0) {
          cachedCases[index] = { ...cachedCases[index], ...updatedRecord };
        } else {
          cachedCases = [updatedRecord, ...cachedCases].slice(0, MAX_CASES);
        }

        hasLoadedOnce = true;
        resetCaseForm();
        renderCases(cachedCases, caseIdAtStart);
        setConnectionState("online", "status.online");
        setLastSync();
        showToast("toastUpdateSuccess", "success");
        announce(t("announceUpdated"));
      } else {
        const { data, error } = await db
          .from(TABLE_NAME)
          .insert({ ...payload, user_id: userIdAtStart })
          .select(CASE_FIELDS)
          .single();

        if (error) throw error;
        if (activeUserId !== userIdAtStart) return;

        const newRecord = data || {
          id: `local-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        cachedCases = [newRecord, ...cachedCases].slice(0, MAX_CASES);
        hasLoadedOnce = true;
        resetCaseForm();
        renderCases(cachedCases, newRecord.id);
        setConnectionState("online", "status.online");
        setLastSync();
        showToast("toastSaveSuccess", "success");
        announce(t("announceSaved"));
      }

      window.setTimeout(() => els.patientCode.focus(), 80);
    } catch (error) {
      if (activeUserId !== userIdAtStart) return;

      console.error("Clinical case save failed:", error);
      const action = isEdit ? "update" : "save";
      const messageKey = describeDataError(error, action);
      showFormAlert(messageKey);
      setConnectionState("error", isEdit ? "status.updateFailed" : "status.saveFailed");
      showToast(isEdit ? "toastUpdateFailed" : "toastSaveFailed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function readCaseValues() {
    return {
      patientCode: els.patientCode.value.trim(),
      diagnosis: els.diagnosis.value.trim(),
      notes: els.notes.value.trim(),
    };
  }

  function validateCaseValues(values) {
    let firstInvalid = "";

    if (!values.patientCode) {
      setFieldError("patientCode", "validation.patientCodeRequired");
      firstInvalid ||= "patientCode";
    } else if (values.patientCode.length > LIMITS.patientCode) {
      setFieldError("patientCode", "validation.patientCodeMax");
      firstInvalid ||= "patientCode";
    }

    if (!values.diagnosis) {
      setFieldError("diagnosis", "validation.diagnosisRequired");
      firstInvalid ||= "diagnosis";
    } else if (values.diagnosis.length > LIMITS.diagnosis) {
      setFieldError("diagnosis", "validation.diagnosisMax");
      firstInvalid ||= "diagnosis";
    }

    if (values.notes.length > LIMITS.notes) {
      setFieldError("notes", "validation.notesMax");
      firstInvalid ||= "notes";
    }

    return firstInvalid;
  }

  function setFieldError(fieldName, messageKey) {
    if (!fields[fieldName]) return;
    caseFieldErrorKeys[fieldName] = messageKey;
    renderCaseFieldError(fieldName);
  }

  function renderCaseFieldError(fieldName) {
    const field = fields[fieldName];
    if (!field) return;
    const messageKey = caseFieldErrorKeys[fieldName];

    if (messageKey) {
      field.input.classList.add("is-invalid");
      field.input.setAttribute("aria-invalid", "true");
      field.error.textContent = t(messageKey);
    } else {
      field.input.classList.remove("is-invalid");
      field.input.removeAttribute("aria-invalid");
      field.error.textContent = "";
    }
  }

  function renderCaseFieldErrors() {
    Object.keys(fields).forEach(renderCaseFieldError);
  }

  function clearFieldError(fieldName) {
    if (!fields[fieldName]) return;
    caseFieldErrorKeys[fieldName] = "";
    renderCaseFieldError(fieldName);
  }

  function clearAllFieldErrors() {
    Object.keys(fields).forEach(clearFieldError);
  }

  function showFormAlert(messageKey) {
    formAlertKey = messageKey;
    renderFormAlert();
  }

  function renderFormAlert() {
    if (!formAlertKey) {
      els.formAlert.hidden = true;
      els.formAlertText.textContent = "";
      return;
    }

    els.formAlertText.textContent = t(formAlertKey);
    els.formAlert.hidden = false;
  }

  function clearFormAlert() {
    formAlertKey = "";
    renderFormAlert();
  }

  function setSubmitting(active) {
    isSubmitting = active;
    els.submitBtn.disabled = active;
    els.submitBtn.classList.toggle("is-loading", active);
    els.submitBtn.setAttribute("aria-busy", String(active));
    els.submitSpinner.hidden = !active;
    els.cancelEditBtn.disabled = active;
    els.form.setAttribute("aria-busy", String(active));

    renderSubmitLabel();
  }

  function renderSubmitLabel() {
    const isEdit = Boolean(editingId);
    const key = isSubmitting
      ? isEdit
        ? "form.submitUpdating"
        : "form.submitSaving"
      : isEdit
        ? "form.submitUpdate"
        : "form.submitSave";
    els.submitBtnText.textContent = t(key);
  }

  function renderFormMode() {
    const isEdit = Boolean(editingId);
    els.entryPanel.classList.toggle("is-editing", isEdit);
    els.entryKickerText.textContent = t(isEdit ? "entry.editKicker" : "entry.addKicker");
    els.entryTitle.textContent = t(isEdit ? "entry.editTitle" : "entry.addTitle");
    els.entryDescription.textContent = t(
      isEdit ? "entry.editDescription" : "entry.addDescription"
    );
    els.formStepMark.textContent = isEdit ? "✎" : "01";
    els.formTimestampText.textContent = t(
      isEdit ? "form.timestampEdit" : "form.timestampAdd"
    );
    els.cancelEditBtn.hidden = !isEdit;
    renderSubmitLabel();
  }

  function startEditing(record) {
    if (!record?.id) return;

    editingId = record.id;
    els.patientCode.value = cleanDisplayValue(record.patient_code);
    els.diagnosis.value = cleanDisplayValue(record.diagnosis);
    els.notes.value = cleanDisplayValue(record.notes);
    updateNotesCount();
    clearAllFieldErrors();
    clearFormAlert();
    renderFormMode();

    els.entryPanel.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => els.patientCode.focus(), 120);
  }

  function resetCaseForm() {
    editingId = null;
    els.form.reset();
    clearAllFieldErrors();
    clearFormAlert();
    updateNotesCount();
    renderFormMode();
  }

  function openDeleteDialog(record) {
    if (!record?.id) return;

    pendingDeleteRecord = record;
    deleteDialogErrorKey = "";
    renderDeleteDialogState();

    if (typeof els.deleteDialog.showModal === "function") {
      els.deleteDialog.showModal();
    } else {
      els.deleteDialog.setAttribute("open", "");
    }

    window.setTimeout(() => els.cancelDeleteBtn.focus(), 30);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;
    if (typeof els.deleteDialog.close === "function") {
      els.deleteDialog.close();
    } else {
      els.deleteDialog.removeAttribute("open");
    }
    pendingDeleteRecord = null;
  }

  function renderDeleteDialogState() {
    const record = pendingDeleteRecord;
    if (record) {
      const code = cleanDisplayValue(record.patient_code) || t("case.noCode");
      els.deleteDialogText.textContent = t("dialog.description", { code });
    }
    renderDeleteDialogError();
    renderDeleteLoadingLabel();
  }

  function renderDeleteDialogError() {
    if (!deleteDialogErrorKey) {
      els.deleteDialogError.hidden = true;
      els.deleteDialogErrorText.textContent = "";
      return;
    }

    els.deleteDialogErrorText.textContent = t(deleteDialogErrorKey);
    els.deleteDialogError.hidden = false;
  }

  function renderDeleteLoadingLabel() {
    els.confirmDeleteText.textContent = t(
      isDeleting ? "dialog.deleting" : "dialog.confirm"
    );
  }

  function setDeleteLoading(active) {
    isDeleting = active;
    els.confirmDeleteBtn.disabled = active;
    els.cancelDeleteBtn.disabled = active;
    els.deleteDialogClose.disabled = active;
    els.deleteSpinner.hidden = !active;
    renderDeleteLoadingLabel();
  }

  async function confirmDelete() {
    if (!db || !currentUser || !pendingDeleteRecord || isDeleting) return;

    const record = pendingDeleteRecord;
    const userIdAtStart = currentUser.id;
    els.deleteDialogError.hidden = true;
    setDeleteLoading(true);

    try {
      const { data, error } = await db
        .from(TABLE_NAME)
        .delete()
        .eq("id", record.id)
        .eq("user_id", userIdAtStart)
        .select("id")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error("DELETE_NOT_APPLIED");
      }
      if (activeUserId !== userIdAtStart) return;

      cachedCases = cachedCases.filter((item) => item.id !== record.id);
      if (editingId === record.id) resetCaseForm();

      renderCases(cachedCases);
      setConnectionState("online", "status.online");
      setLastSync();
      closeDeleteDialogAfterSuccess();
      showToast("toastDeleteSuccess", "success");
      announce(t("announceDeleted"));
    } catch (error) {
      if (activeUserId !== userIdAtStart) return;

      console.error("Clinical case delete failed:", error);
      deleteDialogErrorKey = describeDataError(error, "delete");
      renderDeleteDialogError();
      showToast("toastDeleteFailed", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  function closeDeleteDialogAfterSuccess() {
    pendingDeleteRecord = null;
    isDeleting = false;
    if (typeof els.deleteDialog.close === "function") {
      els.deleteDialog.close();
    } else {
      els.deleteDialog.removeAttribute("open");
    }
  }

  function renderCases(cases, highlightId = "") {
    cachedCases = Array.isArray(cases) ? cases.slice(0, MAX_CASES) : [];
    els.caseList.replaceChildren();

    if (cachedCases.length === 0) {
      els.caseList.append(els.emptyStateTemplate.content.cloneNode(true));
      els.listSubtitle.textContent = t("list.subtitleEmpty");
      els.casesCount.textContent = formatNumber(0);
      return;
    }

    const fragment = document.createDocumentFragment();
    cachedCases.forEach((record) => {
      fragment.append(createCaseElement(record, record.id === highlightId));
    });
    els.caseList.append(fragment);
    els.caseList.scrollTop = 0;
    els.listSubtitle.textContent = t("list.subtitleDefault");
    els.casesCount.textContent = formatNumber(cachedCases.length);
  }

  function createCaseElement(record, isHighlighted) {
    const node = els.caseItemTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.caseId = record.id || "";

    const codeEl = node.querySelector(".case-code");
    const dateEl = node.querySelector(".case-date");
    const diagnosisEl = node.querySelector(".case-diagnosis");
    const notesEl = node.querySelector(".case-notes");
    const editedEl = node.querySelector(".case-edited");
    const editBtn = node.querySelector('[data-action="edit"]');
    const deleteBtn = node.querySelector('[data-action="delete"]');

    const code = cleanDisplayValue(record.patient_code) || t("case.noCode");
    codeEl.textContent = code;
    diagnosisEl.textContent = cleanDisplayValue(record.diagnosis) || t("case.noDiagnosis");
    dateEl.textContent = formatCaseDate(record.created_at);
    if (record.created_at) dateEl.dateTime = record.created_at;

    const notes = cleanDisplayValue(record.notes);
    if (notes) {
      notesEl.textContent = notes;
    } else {
      notesEl.remove();
    }

    const updatedDate = parseDate(record.updated_at);
    const createdDate = parseDate(record.created_at);
    const wasEdited =
      updatedDate && createdDate && updatedDate.getTime() - createdDate.getTime() > 1000;
    if (wasEdited) {
      editedEl.hidden = false;
      editedEl.title = t("case.editedTitle", { date: formatCaseDate(record.updated_at) });
    }

    editBtn.setAttribute("aria-label", t("case.editAria", { code }));
    deleteBtn.setAttribute("aria-label", t("case.deleteAria", { code }));
    node.classList.toggle("is-new", Boolean(isHighlighted));
    return node;
  }

  function renderSkeletons() {
    els.caseList.innerHTML = skeletonMarkup.repeat(3);
  }

  function renderErrorState(messageKey) {
    const node = els.errorStateTemplate.content.cloneNode(true);
    node.querySelector(".state__message").textContent = t(messageKey);
    els.caseList.replaceChildren(node);
  }

  function setRefreshLoading(active) {
    els.refreshBtn.disabled = active;
    els.refreshBtn.classList.toggle("is-spinning", active);
  }

  function setConnectionState(state, statusKey) {
    connectionType = state;
    connectionStatusKey = statusKey;
    renderConnectionState();
  }

  function renderConnectionState() {
    const classes = {
      checking: "is-pending",
      online: "is-online",
      error: "is-error",
      setup: "is-setup",
    };
    const state = connectionType;
    const label = t(connectionStatusKey);
    els.connectionBadge.className = `status-pill ${classes[state] || "is-pending"}`;
    els.connectionText.textContent = label;
    els.connectionBadge.title = label;
    els.connectionBadge.setAttribute("aria-label", t("connection.statusAria", { label }));
    els.syncIndicator.className = `live-indicator is-${state}`;
    els.syncLabel.textContent = t(`sync.${state}`);
  }

  function setLastSync() {
    lastSyncAt = new Date();
    lastSyncState = "synced";
    renderLastSync();
  }

  function renderLastSync() {
    if (lastSyncState === "syncing") {
      els.lastSync.textContent = t("list.syncing");
      return;
    }
    if (lastSyncState === "failed") {
      els.lastSync.textContent = t("list.syncFailed");
      return;
    }
    if (lastSyncState === "synced" && lastSyncAt) {
      try {
        const time = new Intl.DateTimeFormat(getLocale(), {
          hour: "2-digit",
          minute: "2-digit",
        }).format(lastSyncAt);
        els.lastSync.textContent = t("list.lastSync", { time });
      } catch {
        els.lastSync.textContent = t("list.synced");
      }
      return;
    }
    els.lastSync.textContent = t("list.lastSyncNever");
  }

  function updateNotesCount() {
    const length = els.notes.value.length;
    els.notesCount.textContent = `${length} / ${LIMITS.notes}`;
    els.notesCount.classList.toggle("is-near-limit", length >= 900 && length < LIMITS.notes);
    els.notesCount.classList.toggle("is-at-limit", length >= LIMITS.notes);
  }

  function setToday() {
    const today = new Date();
    try {
      els.todayDate.textContent = new Intl.DateTimeFormat(getLocale(), {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(today);
      els.todayWeekday.textContent = new Intl.DateTimeFormat(getLocale(), {
        weekday: "long",
      }).format(today);
    } catch {
      els.todayDate.textContent = today.toLocaleDateString(currentLanguage);
      els.todayWeekday.textContent = today.toLocaleDateString(currentLanguage, {
        weekday: "long",
      });
    }
  }

  function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatCaseDate(value) {
    const date = parseDate(value);
    if (!date) return t("case.noDate");

    const options = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    if (date.getFullYear() !== new Date().getFullYear()) options.year = "numeric";

    try {
      return new Intl.DateTimeFormat(getLocale(), options).format(date);
    } catch {
      return date.toLocaleDateString(currentLanguage);
    }
  }

  function formatNumber(value) {
    try {
      return new Intl.NumberFormat(getLocale()).format(value);
    } catch {
      return String(value);
    }
  }

  function announce(message) {
    els.listAnnouncement.textContent = "";
    window.setTimeout(() => {
      els.listAnnouncement.textContent = message;
    }, 30);
  }

  function showToast(messageKey, type = "success") {
    window.clearTimeout(toastTimer);
    els.toastMessage.textContent = t(messageKey);
    els.toast.classList.toggle("is-error", type === "error");
    els.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(hideToast, 5200);
  }

  function hideToast() {
    window.clearTimeout(toastTimer);
    els.toast.classList.remove("is-visible");
  }

  function describeAuthError(error) {
    const message = String(error?.message || error || "");
    const code = String(error?.code || "").toLowerCase();
    const lower = message.toLowerCase();

    if (!navigator.onLine) {
      return "auth.errorOffline";
    }

    if (
      code === "invalid_api_key" ||
      lower.includes("invalid api key") ||
      lower.includes("no api key found")
    ) {
      return "auth.errorInvalidApiKey";
    }

    if (
      code === "invalid_credentials" ||
      lower.includes("invalid login credentials") ||
      lower.includes("invalid credentials")
    ) {
      return "auth.errorInvalidCredentials";
    }

    if (code === "email_not_confirmed" || lower.includes("email not confirmed")) {
      return "auth.errorEmailNotConfirmed";
    }

    if (
      code === "user_already_exists" ||
      code === "email_exists" ||
      lower.includes("already registered") ||
      lower.includes("already exists")
    ) {
      return "auth.errorAlreadyRegistered";
    }

    if (code === "weak_password" || lower.includes("password should be at least")) {
      return "auth.errorWeakPassword";
    }

    if (
      code === "over_email_send_rate_limit" ||
      code === "over_request_rate_limit" ||
      lower.includes("rate limit") ||
      lower.includes("too many requests")
    ) {
      return "auth.errorRateLimit";
    }

    if (lower.includes("unable to validate email") || lower.includes("invalid email")) {
      return "auth.errorInvalidEmail";
    }

    if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("load failed")) {
      return "auth.errorNetwork";
    }

    if (lower.includes("auth session missing")) {
      return "auth.errorSessionMissing";
    }

    return "auth.errorGeneric";
  }

  function describeDataError(error, context) {
    const message = String(error?.message || error || "");
    const lower = message.toLowerCase();
    const code = String(error?.code || "");

    if (!navigator.onLine) {
      return "dataErrorOffline";
    }

    if (
      code === "42P01" ||
      code === "PGRST205" ||
      lower.includes("could not find the table") ||
      /relation .*clinical_cases.*does not exist/i.test(message)
    ) {
      return "dataErrorTableMissing";
    }

    if (
      code === "42501" ||
      lower.includes("row-level security") ||
      lower.includes("permission denied")
    ) {
      return "dataErrorPermission";
    }

    if (
      code === "401" ||
      lower.includes("jwt expired") ||
      lower.includes("invalid jwt") ||
      lower.includes("invalid api key")
    ) {
      return "dataErrorSession";
    }

    if (
      code === "PGRST204" ||
      code === "42703" ||
      (lower.includes("column") &&
        (lower.includes("does not exist") ||
          lower.includes("could not find") ||
          lower.includes("schema cache")))
    ) {
      return "dataErrorSchema";
    }

    if (code === "PGRST116" || lower.includes("multiple (or no) rows returned")) {
      return "dataErrorNotFound";
    }

    if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("load failed")) {
      return "dataErrorNetwork";
    }

    if (lower.includes("violates check constraint") || code === "23514") {
      return "dataErrorConstraint";
    }

    if (lower.includes("delete_not_applied")) {
      return "dataErrorDeleteNotApplied";
    }

    if (context === "update") {
      return "dataErrorUpdate";
    }
    if (context === "delete") {
      return "dataErrorDelete";
    }
    if (context === "load") {
      return "dataErrorLoad";
    }
    return "dataErrorSave";
  }

  function inspectConfig(raw) {
    const url = typeof raw?.supabaseUrl === "string" ? raw.supabaseUrl.trim() : "";
    const key = typeof raw?.supabaseAnonKey === "string" ? raw.supabaseAnonKey.trim() : "";

    if (!url || !key) {
      return { valid: false, messageKey: "setup.missing" };
    }

    if (/YOUR_PROJECT_REF|YOUR_SUPABASE_ANON_KEY/i.test(`${url} ${key}`)) {
      return { valid: false, messageKey: "setup.placeholder" };
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { valid: false, messageKey: "setup.invalidUrl" };
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
      return { valid: false, messageKey: "setup.invalidUrl" };
    }

    // Accept the Project URL even if it was copied from a REST/Auth endpoint.
    const normalizedPath = parsedUrl.pathname
      .replace(/\/(rest|auth|storage|realtime|functions)\/v1(?:\/.*)?$/i, "")
      .replace(/\/+$/, "");
    const normalizedUrl = `${parsedUrl.origin}${normalizedPath}`;

    const jwtRole = readJwtRole(key);
    if (key.startsWith("sb_secret_") || jwtRole === "service_role") {
      return { valid: false, messageKey: "setup.secret" };
    }

    if (jwtRole && jwtRole !== "anon") {
      return { valid: false, messageKey: "setup.notAnon" };
    }

    if (key.length < 20) {
      return { valid: false, messageKey: "setup.shortKey" };
    }

    return {
      valid: true,
      url: normalizedUrl,
      key,
    };
  }

  function readJwtRole(token) {
    try {
      const part = token.split(".")[1];
      if (!part) return null;
      const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
      const payload = JSON.parse(atob(padded));
      return payload?.role || null;
    } catch {
      return null;
    }
  }

  function cleanDisplayValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function readStoredLanguage() {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return SUPPORTED_LANGUAGES.includes(stored) ? stored : "ar";
    } catch {
      return "ar";
    }
  }

  function storeLanguage(language) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The interface still switches for this session if storage is unavailable.
    }
  }

  function getLocale() {
    return currentLanguage === "ar" ? AR_LOCALE : EN_LOCALE;
  }

  function t(key, values = {}) {
    const languageMessages = messages[currentLanguage] || messages.ar;
    const template = languageMessages[key] ?? messages.ar[key] ?? key;
    if (!values || typeof template !== "string") return template;
    return template.replace(/\{(\w+)\}/g, (match, token) =>
      Object.prototype.hasOwnProperty.call(values, token) ? String(values[token]) : match
    );
  }

  function applyDocumentLanguage() {
    const language = SUPPORTED_LANGUAGES.includes(currentLanguage) ? currentLanguage : "ar";
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
    document.title = t("meta.title");

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("meta.description"));
  }

  function applyStaticTranslations() {
    localizeRoot(document);
    document.querySelectorAll("template").forEach((template) => {
      localizeRoot(template.content);
    });
  }

  function localizeRoot(root) {
    if (!root?.querySelectorAll) return;

    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });

    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.setAttribute("title", t(element.dataset.i18nTitle));
    });
  }

  function updateLanguageToggle() {
    if (!els.languageToggle) return;

    const targetLanguage = currentLanguage === "ar" ? "en" : "ar";
    const label =
      targetLanguage === "en" ? t("language.english") : t("language.arabic");
    const ariaKey =
      targetLanguage === "en" ? "language.switchToEnglish" : "language.switchToArabic";

    els.languageToggleText.textContent = label;
    els.languageToggleText.setAttribute("lang", targetLanguage);
    els.languageToggle.setAttribute("aria-label", t(ariaKey));
    els.languageToggle.setAttribute("title", t(ariaKey));
  }

  function setLanguage(language, options = {}) {
    const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "ar";
    if (nextLanguage === currentLanguage) return;

    currentLanguage = nextLanguage;
    if (options.persist !== false) storeLanguage(currentLanguage);
    applyDocumentLanguage();
    applyStaticTranslations();
    refreshLanguageDependentUI();
  }

  function handleLanguageToggle() {
    setLanguage(currentLanguage === "ar" ? "en" : "ar");
  }

  function refreshLanguageDependentUI() {
    updateLanguageToggle();
    setToday();
    renderConnectionState();
    renderPasswordToggleLabel();

    if (authLockedBySetup && setupIssueState) {
      renderSetupIssue();
    } else {
      renderAuthMode(authMode, { clearErrors: false });
    }

    renderAuthFieldErrors();
    renderAuthAlert();
    renderCaseFieldErrors();
    renderFormMode();
    renderFormAlert();
    renderDeleteDialogState();
    renderLastSync();

    if (currentUser) {
      updateAccountUI(currentUser);
    } else if (els.accountAvatar) {
      els.accountAvatar.textContent = currentLanguage === "ar" ? "؟" : "?";
    }

    if (!els.appView.hidden) refreshListLanguage();
    els.listAnnouncement.textContent = "";
    hideToast();
  }

  function refreshListLanguage() {
    if (isLoading) {
      els.listSubtitle.textContent = t("list.subtitleLoading");
      els.casesCount.textContent = "…";
      renderLastSync();
      return;
    }

    if (hasLoadedOnce) {
      renderCases(cachedCases);
      return;
    }

    if (currentUser) {
      loadCases();
      return;
    }

    renderLastSync();
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function bindEvents() {
    els.languageToggle.addEventListener("click", handleLanguageToggle);
    els.authLoginTab.addEventListener("click", () => setAuthMode("login"));
    els.authSignupTab.addEventListener("click", () => setAuthMode("signup"));
    els.authSwitchBtn.addEventListener("click", () => {
      setAuthMode(authMode === "login" ? "signup" : "login");
    });
    els.authForm.addEventListener("submit", handleAuthSubmit);
    els.authPasswordToggle.addEventListener("click", togglePasswordVisibility);

    els.authEmail.addEventListener("input", () => {
      clearAuthFieldError("email");
      clearAuthAlert();
    });
    els.authPassword.addEventListener("input", () => {
      clearAuthFieldError("password");
      clearAuthAlert();
    });

    els.accountBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleAccountMenu();
    });
    els.logoutBtn.addEventListener("click", handleLogout);

    document.addEventListener("click", (event) => {
      if (!els.accountMenu.contains(event.target)) closeAccountMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.accountPopover.hidden) {
        closeAccountMenu();
        els.accountBtn.focus();
      }
    });

    els.form.addEventListener("submit", handleCaseSubmit);
    els.form.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        els.form.requestSubmit();
      }
    });

    Object.entries(fields).forEach(([name, field]) => {
      field.input.addEventListener("input", () => {
        clearFieldError(name);
        clearFormAlert();
      });
    });

    els.notes.addEventListener("input", updateNotesCount);
    els.cancelEditBtn.addEventListener("click", resetCaseForm);
    els.refreshBtn.addEventListener("click", loadCases);
    els.toastClose.addEventListener("click", hideToast);

    els.caseList.addEventListener("click", (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;

      const action = actionEl.dataset.action;
      if (action === "focus-form") {
        els.patientCode.focus();
        els.entryPanel.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        return;
      }

      if (action === "retry") {
        loadCases();
        return;
      }

      const item = actionEl.closest(".case-item");
      const record = cachedCases.find((entry) => entry.id === item?.dataset.caseId);
      if (!record) return;

      if (action === "edit") startEditing(record);
      if (action === "delete") openDeleteDialog(record);
    });

    els.cancelDeleteBtn.addEventListener("click", closeDeleteDialog);
    els.deleteDialogClose.addEventListener("click", closeDeleteDialog);
    els.confirmDeleteBtn.addEventListener("click", confirmDelete);
    els.deleteDialog.addEventListener("cancel", (event) => {
      if (isDeleting) event.preventDefault();
    });
    els.deleteDialog.addEventListener("close", () => {
      pendingDeleteRecord = null;
      deleteDialogErrorKey = "";
      renderDeleteDialogError();
    });
    els.deleteDialog.addEventListener("click", (event) => {
      if (event.target === els.deleteDialog) closeDeleteDialog();
    });

    window.addEventListener("online", () => {
      if (!configState.valid || !db || authLockedBySetup) return;
      setConnectionState("online", currentUser ? "status.online" : "status.available");
      if (currentUser) {
        showToast("toastConnectionRestored", "success");
        loadCases();
      }
    });

    window.addEventListener("offline", () => {
      if (!configState.valid || authLockedBySetup) return;
      setConnectionState("error", "status.offline");
    });
  }
})();
