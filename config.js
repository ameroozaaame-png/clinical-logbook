/**
 * إعدادات الاتصال بمشروع Supabase
 * ------------------------------------------------------------
 * 1) استبدل القيمتين أدناه بالقيم الموجودة في:
 *    Supabase Dashboard → Project Settings → API
 * 2) استخدم المفتاح العام فقط: anon public key أو publishable key.
 *    لا تضع مفتاح service_role في أي ملف يُحمَّل داخل المتصفح.
 *
 * ملاحظة: هذا الملف عام بطبيعته عند نشر الموقع، لذلك تعتمد حماية
 * البيانات على سياسات Row Level Security في قاعدة البيانات.
 */
window.CLINICAL_LOGBOOK_CONFIG = {
    supabaseUrl: "https://uqxeehwjjawxnaghvxa.supabase.co",
    supabaseAnonKey: "sb_publishable_dfDxP50HKNvGPOacv-Mdrg__DoIycj5s"
};
