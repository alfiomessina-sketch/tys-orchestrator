const translations = {
    it: {
        nav_dashboard: "Dashboard",
        nav_radio: "Radio Player",
        nav_playlists: "Playlist",
        nav_tts: "Studio TTS",
        nav_ads: "Pubblicità",
        nav_planner: "Programmatore",
        nav_packages: "Pacchetti",
        nav_subscription: "Il Mio Abbonamento",
        system_active: "Sistema attivo",
        header_title: "Centro di Controllo",
        role_admin: "Admin",
        role_client: "Cliente",
        role_collab: "Collaboratore",

        title: "TUNE YOUR STORE®",
        subtitle: "In-Store Radio · Digital Signage · Comunicazione Multilingue",
        question: "La tua attività comunica davvero… oppure resta in silenzio?",
        p1: "Ogni giorno entrano clienti nel tuo locale. Quanti conoscono le tue promozioni?",
        p2: "Tune Your Store trasforma la tua attività in un sistema di vendita attivo 24 ore su 24.",
        li1: "Radio personalizzata con il nome della tua attività",
        li2: "Annunci programmati che promuovono prodotti e offerte",
        li3: "Comunicazione multilingue automatica",
        li4: "Messaggi ripetuti con strategia, senza stancare",
        p3: "È come avere un collaboratore instancabile che ricorda ai clienti cosa acquistare in più.",
        price: "Il costo? Meno di un caffè al giorno.",
        final: "Tune Your Store non è un servizio. È una collaborazione orientata al tuo fatturato."
    },

    de: {
        nav_dashboard: "Dashboard",
        nav_radio: "Radio Player",
        nav_playlists: "Playlists",
        nav_tts: "TTS Studio",
        nav_ads: "Werbung",
        nav_planner: "Programm-Planer",
        nav_packages: "Themen-Pakete",
        nav_subscription: "Mein Abo",
        system_active: "System aktiv",
        header_title: "Broadcast Command Center",
        role_admin: "Admin",
        role_client: "Kunde",
        role_collab: "Mitarbeiter",

        title: "TUNE YOUR STORE®",
        subtitle: "In-Store Radio · Digital Signage · Mehrsprachige Kommunikation",
        question: "Kommuniziert Ihr Geschäft wirklich… oder bleibt es still?",
        p1: "Jeden Tag betreten Kunden Ihr Geschäft. Wie viele kennen Ihre Angebote?",
        p2: "Tune Your Store verwandelt Ihr Geschäft in ein aktives Verkaufssystem rund um die Uhr.",
        li1: "Personalisierte Radio mit Ihrem Geschäftsnamen",
        li2: "Geplante Werbeansagen für Produkte und Angebote",
        li3: "Automatische mehrsprachige Kommunikation",
        li4: "Strategisch wiederholte Botschaften ohne zu stören",
        p3: "Wie ein unermüdlicher Mitarbeiter, der alle 15 Minuten an Zusatzverkäufe erinnert.",
        price: "Kosten? Weniger als ein Kaffee pro Tag.",
        final: "Tune Your Store ist kein Service. Es ist eine Partnerschaft für Ihren Umsatz."
    },

    en: {
        nav_dashboard: "Dashboard",
        nav_radio: "Radio Player",
        nav_playlists: "Playlists",
        nav_tts: "TTS Studio",
        nav_ads: "Advertising",
        nav_planner: "Scheduler",
        nav_packages: "Packages",
        nav_subscription: "My Subscription",
        system_active: "System active",
        header_title: "Broadcast Command Center",
        role_admin: "Admin",
        role_client: "Client",
        role_collab: "Collaborator",

        title: "TUNE YOUR STORE®",
        subtitle: "In-Store Radio · Digital Signage · Multilingual Communication",
        question: "Is your business really communicating… or staying silent?",
        p1: "Every day customers enter your store. How many know your promotions?",
        p2: "Tune Your Store turns your business into a 24/7 active sales system.",
        li1: "Personalized radio with your business name",
        li2: "Scheduled announcements promoting products and offers",
        li3: "Automatic multilingual communication",
        li4: "Strategic repetition without annoying customers",
        p3: "Like having a tireless collaborator reminding customers every 15 minutes.",
        price: "Cost? Less than a coffee per day.",
        final: "Tune Your Store is not a service. It is a revenue-oriented partnership."
    },

    tr: {
        nav_dashboard: "Kontrol Paneli",
        nav_radio: "Radyo",
        nav_playlists: "Çalma Listeleri",
        nav_tts: "TTS Stüdyo",
        nav_ads: "Reklam",
        nav_planner: "Programlayıcı",
        nav_packages: "Paketler",
        nav_subscription: "Aboneliğim",
        system_active: "Sistem aktif",
        header_title: "Yayın Kontrol Merkezi",
        role_admin: "Admin",
        role_client: "Müşteri",
        role_collab: "Çalışan",

        title: "TUNE YOUR STORE®",
        subtitle: "Mağaza İçi Radyo · Dijital Ekran · Çok Dilli İletişim",
        question: "İşletmeniz gerçekten iletişim kuruyor mu… yoksa sessiz mi kalıyor?",
        p1: "Her gün müşteriler mağazanıza giriyor. Kaçı kampanyalarınızı biliyor?",
        p2: "Tune Your Store işletmenizi 7/24 aktif bir satış sistemine dönüştürür.",
        li1: "İşletme adınıza özel radyo",
        li2: "Planlanmış ürün ve kampanya anonsları",
        li3: "Otomatik çok dilli iletişim",
        li4: "Rahatsız etmeden stratejik tekrar",
        p3: "Her 15 dakikada bir ek satış hatırlatan yorulmaz bir çalışan gibi.",
        price: "Maliyet? Günde bir kahveden daha az.",
        final: "Tune Your Store bir hizmet değildir. Gelire odaklı bir iş ortaklığıdır."
    }
};

function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });

    localStorage.setItem("tys_lang", lang);
}

const languageSelect = document.getElementById("languageSelect");

languageSelect.addEventListener("change", function () {
    applyTranslations(this.value);
});

const savedLang = localStorage.getItem("tys_lang") || "de";
languageSelect.value = savedLang;
applyTranslations(savedLang);