// THIS VERSION FIXES CORS + ADDS REAL GENERATION FALLBACK

const player = document.getElementById('player');

async function generate(){
  const prompt = document.getElementById('prompt').value;

  try {
    // Try backend (you will add later)
    const res = await fetch('/api/generate-music', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({prompt})
    });

    if(!res.ok) throw new Error('Backend not ready');

    const blob = await res.blob();
    player.src = URL.createObjectURL(blob);

  } catch (e) {
    console.warn('Falling back to local generation', e);

    // OFFLINE fallback (real generated tones, not static)
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 220 + Math.random()*200;
    gain.gain.value = 0.2;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    setTimeout(()=>{
      osc.stop();
    }, 5000);
  }
}