
// ─── Google Apps Script Web App URL ────────────────────────────────────────
// IMPORTANT: Replace this with your deployed Apps Script URL.
// See README_SHEETS_SETUP.md for step-by-step instructions.
const SHEET_URL = "https://script.google.com/macros/s/AKfycby2RtGn76ZEjy3tgKUbqoEiwrGONcxR4cf1O2S6vDXWCUnI2YI6klupsI3ppiksDn_-/exec";

// ─── Falling petals ─────────────────────────────────────────────────────────
function spawnPetal() {
    const p = document.createElement('div');
    p.classList.add('petal');
    p.style.left = Math.random() * 100 + 'vw';
    const dur = 5 + Math.random() * 6;
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = Math.random() * dur + 's';
    p.style.width = (6 + Math.random() * 8) + 'px';
    p.style.height = (12 + Math.random() * 12) + 'px';
    p.style.opacity = 0.6 + Math.random() * 0.4;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), (dur + 2) * 1000);
}
setInterval(spawnPetal, 600);

// ─── Ramp walk toggle ────────────────────────────────────────────────────────
function toggleRamp() {
    const card = document.getElementById('rampCard');
    const val = document.getElementById('rampWalk');
    card.classList.toggle('active');
    val.value = card.classList.contains('active') ? 'Yes' : 'No';
}

// ─── Form submit → Google Sheets ────────────────────────────────────────────
document.getElementById('regForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const submittingMsg = document.getElementById('submittingMsg');

    const categoryEl = document.querySelector('input[name="category"]:checked');
    const bgPrefEl = document.querySelector('input[name="bgpref"]:checked');

    const payload = {
        timestamp:        new Date().toISOString(),
        fullname:         document.getElementById('fullname').value.trim(),
        rollno:           document.getElementById('rollno').value.trim(),
        email:            document.getElementById('email').value.trim(),
        phone:            document.getElementById('phone').value.trim(),
        deptclass:        document.getElementById('deptclass').value.trim(),
        category:         categoryEl ? categoryEl.value : '',
        movieinspiration: document.getElementById('movieinspiration').value.trim(),
        actdesc:          document.getElementById('actdesc').value.trim(),
        trackname:        document.getElementById('trackname').value.trim(),
        tracklink:        document.getElementById('tracklink').value.trim(),
        trackstart:       document.getElementById('trackstart').value.trim(),
        trackend:         document.getElementById('trackend').value.trim(),
        bgpref:           bgPrefEl ? bgPrefEl.value : '',
        tracknotes:       document.getElementById('tracknotes').value.trim(),
        bgimage:          (document.querySelector('input[name="bgimage"]:checked') || {}).value || '',
        bgimagelink:      document.getElementById('bgimagelink').value.trim(),
        bgimagedesc:      document.getElementById('bgimagedesc').value.trim(),
        rampwalk:         document.getElementById('rampWalk').value,
    };

    submitBtn.style.display = 'none';
    submittingMsg.style.display = 'block';

    try {
        if (SHEET_URL && SHEET_URL !== "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
            await fetch(SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } else {
            console.warn("Google Sheets URL not configured. Form data:", payload);
            await new Promise(r => setTimeout(r, 800));
        }

        this.style.display = 'none';
        submittingMsg.style.display = 'none';
        document.getElementById('successMsg').style.display = 'block';
        document.getElementById('register').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error("Submission error:", err);
        submittingMsg.style.display = 'none';
        submitBtn.style.display = 'block';
        alert("Something went wrong. Please try again or contact the organizers.");
    }
});

// ─── Scroll fade-in ──────────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.tl-card, .about, .form-wrap').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(el);
});
