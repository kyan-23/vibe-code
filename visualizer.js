const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const audioPlayback = document.getElementById('audioPlayback');
const fileInput = document.getElementById('fileInput');
const moodSelect = document.getElementById('moodSelect');
const visualModeSelect = document.getElementById('visualModeSelect');
const themeSelect = document.getElementById('themeSelect');
const radioButtons = document.querySelectorAll('.radio-card');
const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queueCount');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const trackAlbum = document.getElementById('trackAlbum');
const currentTimeLabel = document.getElementById('currentTime');
const durationTimeLabel = document.getElementById('durationTime');
const progressInput = document.getElementById('progressInput');
const prevButton = document.getElementById('prevButton');
const playPauseButton = document.getElementById('playPauseButton');
const nextButton = document.getElementById('nextButton');
const volumeRange = document.getElementById('volumeRange');
const lyricsCaption = document.getElementById('lyricsCaption');
const sensitivityRange = document.getElementById('sensitivityRange');
const densityRange = document.getElementById('densityRange');
const blurRange = document.getElementById('blurRange');
const sensitivityValue = document.getElementById('sensitivityValue');
const densityValue = document.getElementById('densityValue');
const blurValue = document.getElementById('blurValue');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const sourceButtons = document.querySelectorAll('[data-source]');
const moodOverlay = document.getElementById('moodOverlay');
const energyValue = document.getElementById('energyValue');
const bpmValue = document.getElementById('bpmValue');
const modeValue = document.getElementById('modeValue');

let audioContext;
let analyser;
let sourceNode;
let dataArray;
let freqArray;
let gainNode;
let animationId;
let particles = [];
let starfield = [];
let rings = [];
let sparks = [];
let beatPulse = 0;
let currentSource = 'file';
let palette = 'neon';
let isRunning = false;
let lastBeatTime = 0;
let synthOscillator = null;
let synthModulator = null;
let activeStation = 'chill';
let queue = [];
let currentTrackIndex = 0;
let isPlaying = false;
let trackStartTime = 0;
let currentTrackDuration = 180;
const stationData = {
  chill: [
    { title: 'Cloud Nine', artist: 'Lunar Drift', album: 'Skyline Dreams', tone: 160, duration: 180, cover: 'https://picsum.photos/seed/track1/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', lyrics: 'Soft waves, late nights, warm glow in the air.' },
    { title: 'Velvet Sky', artist: 'Aurora Tone', album: 'Neon Clouds', tone: 184, duration: 168, cover: 'https://picsum.photos/seed/track2/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', lyrics: 'Drifting through neon clouds with slow-motion beats.' },
    { title: 'Midnight Cruise', artist: 'Stereo Bloom', album: 'City Lights', tone: 200, duration: 193, cover: 'https://picsum.photos/seed/track3/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', lyrics: 'Cool chords and city lights take over the room.' }
  ],
  party: [
    { title: 'Pulse Drive', artist: 'Funk Reactor', album: 'Club Circuit', tone: 220, duration: 175, cover: 'https://picsum.photos/seed/track4/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', lyrics: 'Kick in the bass, let the room move with the beat.' },
    { title: 'Electric Rush', artist: 'Neon Voltage', album: 'Voltage Nights', tone: 248, duration: 188, cover: 'https://picsum.photos/seed/track5/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', lyrics: 'Rising energy, bright lights, endless motion.' },
    { title: 'After Hours', artist: 'Rhythm Syndicate', album: 'Late Shift', tone: 196, duration: 165, cover: 'https://picsum.photos/seed/track6/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', lyrics: 'Turn up the heat and let the sound take over.' }
  ],
  sunrise: [
    { title: 'Morning Glow', artist: 'Dawn Horizon', album: 'First Light', tone: 140, duration: 182, cover: 'https://picsum.photos/seed/track7/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', lyrics: 'Light filtering through, the city starts to breathe.' },
    { title: 'Soft Radiance', artist: 'Pastel Flow', album: 'Daybreak', tone: 150, duration: 176, cover: 'https://picsum.photos/seed/track8/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', lyrics: 'Warm colors bloom across the skyline of sound.' },
    { title: 'Daybreak', artist: 'Solar Drift', album: 'Morning Bloom', tone: 170, duration: 210, cover: 'https://picsum.photos/seed/track9/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', lyrics: 'A fresh rhythm rises with every new heartbeat.' }
  ],
  lounge: [
    { title: 'Warm Seat', artist: 'Velour Vibe', album: 'Velvet Hour', tone: 130, duration: 190, cover: 'https://picsum.photos/seed/track10/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', lyrics: 'Low lights, smooth motion, chords that lay gently.' },
    { title: 'Silk Hour', artist: 'Luxe Echo', album: 'Candle Glow', tone: 145, duration: 174, cover: 'https://picsum.photos/seed/track11/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', lyrics: 'Slow grooves that melt into the air between us.' },
    { title: 'Late Lounge', artist: 'Candlelight', album: 'After Dark', tone: 155, duration: 198, cover: 'https://picsum.photos/seed/track12/300/300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', lyrics: 'A mellow pocket of sound for the perfect unwind.' }
  ]
};

const colorPalettes = {
  neon: ['#8e63ff', '#39d3ff', '#fff1a6', '#ff5ebb', '#7af2ff'],
  chill: ['#6cd8ff', '#a086ff', '#f3f8ff', '#6fe9d8', '#7a8fff'],
  cosmos: ['#5b76ff', '#d16bff', '#6ce3ff', '#ff9ed9', '#4a64d9'],
  ocean: ['#62d4ff', '#4a8fff', '#84ffea', '#68d7ff', '#2a4d7d'],
  ember: ['#ff7a65', '#ffbe54', '#ffe38e', '#ff4d9b', '#a23659']
};

const controlState = {
  sensitivity: Number(sensitivityRange.value),
  density: Number(densityRange.value),
  blur: Number(blurRange.value),
  volume: Number(volumeRange ? volumeRange.value : 1),
  visualMode: 'flow'
};

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createAudioContext() {
  if (audioContext) return;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.75;
  dataArray = new Uint8Array(analyser.fftSize);
  freqArray = new Uint8Array(analyser.frequencyBinCount);

  gainNode = audioContext.createGain();
  gainNode.gain.value = controlState.sensitivity * controlState.volume;
  gainNode.connect(analyser);
  analyser.connect(audioContext.destination);
}

async function attachMic() {
  createAudioContext();
  disconnectSource();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(gainNode);
  } catch (error) {
    console.error('Microphone access denied or unavailable.', error);
    alert('Unable to access the microphone. Please check your browser settings.');
  }
}

function attachFile(file) {
  createAudioContext();
  disconnectSource();

  audioPlayback.src = URL.createObjectURL(file);
  audioPlayback.loop = true;
  audioPlayback.crossOrigin = 'anonymous';
  audioPlayback.play().catch(() => {
    // autoplay blocked; user can press start
  });

  sourceNode = audioContext.createMediaElementSource(audioPlayback);
  sourceNode.connect(gainNode);
}

function attachTrackUrl(url) {
  createAudioContext();
  disconnectSource();

  audioPlayback.pause();
  audioPlayback.crossOrigin = 'anonymous';
  audioPlayback.src = url;
  audioPlayback.loop = false;
  audioPlayback.load();
  audioPlayback.play().catch(() => {
    // autoplay blocked; user can press start
  });

  sourceNode = audioContext.createMediaElementSource(audioPlayback);
  sourceNode.connect(gainNode);
}

function attachSynth() {
  createAudioContext();
  disconnectSource();

  const oscillator = audioContext.createOscillator();
  const carrier = audioContext.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.value = 160;

  const mod = audioContext.createOscillator();
  const modGain = audioContext.createGain();
  mod.frequency.value = 2;
  modGain.gain.value = 40;

  mod.connect(modGain);
  modGain.connect(oscillator.frequency);
  oscillator.connect(carrier);
  carrier.connect(gainNode);

  oscillator.start();
  mod.start();

  sourceNode = carrier;
  synthOscillator = oscillator;
  synthModulator = mod;
}

function setSource(source) {
  currentSource = source;
  sourceButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.source === source);
  });

  if (source === 'file') {
    if (fileInput.files.length > 0) {
      attachFile(fileInput.files[0]);
    } else if (queue[currentTrackIndex]?.src) {
      attachTrackUrl(queue[currentTrackIndex].src);
    }
  } else if (source === 'synth') {
    if (!audioContext) createAudioContext();
    attachSynth();
    applyTrackTone(currentTrackIndex);
  }
}

function disconnectSource() {
  if (sourceNode) {
    try {
      sourceNode.disconnect();
    } catch (err) {
      console.warn('Failed to disconnect current source', err);
    }
    sourceNode = null;
  }
}

function updateState() {
  controlState.sensitivity = Number(sensitivityRange.value);
  controlState.density = Number(densityRange.value);
  controlState.blur = Number(blurRange.value);
  sensitivityValue.textContent = controlState.sensitivity.toFixed(2);
  densityValue.textContent = controlState.density.toFixed(2);
  blurValue.textContent = controlState.blur.toFixed(2);
  controlState.volume = Number(volumeRange.value);

  if (gainNode) gainNode.gain.value = controlState.sensitivity * controlState.volume;
  if (audioPlayback) audioPlayback.volume = controlState.volume;
}

function createParticle(x, y, radius, hue, orbitRadius) {
  return {
    x,
    y,
    radius,
    baseRadius: radius,
    hue,
    angle: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 1.2,
    alpha: 0.15 + Math.random() * 0.4,
    drift: (Math.random() - 0.5) * 0.8,
    orbitRadius,
    orbitOffset: Math.random() * Math.PI * 2
  };
}

function createStarfield(count = 70) {
  starfield = [];
  for (let i = 0; i < count; i += 1) {
    starfield.push({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      radius: 0.7 + Math.random() * 1.4,
      alpha: 0.08 + Math.random() * 0.26,
      hue: colorPalettes[palette][0]
    });
  }
}

function createRings(count = 4) {
  rings = [];
  const smaller = Math.min(canvas.clientWidth, canvas.clientHeight);
  for (let i = 0; i < count; i += 1) {
    rings.push({
      radius: smaller * (0.18 + i * 0.12),
      width: 1.5 + i * 0.8,
      speed: 0.0007 + i * 0.00065,
      offset: Math.random() * Math.PI * 2,
      alpha: 0.08 + i * 0.045
    });
  }
}

function createSparks(count = 24) {
  sparks = [];
  for (let i = 0; i < count; i += 1) {
    sparks.push({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      radius: 0.9 + Math.random() * 1.6,
      alpha: 0.05 + Math.random() * 0.18,
      hue: colorPalettes[palette][4],
      drift: (Math.random() - 0.5) * 0.35
    });
  }
}

function buildParticles(count = 160) {
  particles = [];
  createStarfield(70 + Math.floor(count * 0.18));
  createRings(3 + Math.floor(count * 0.04));
  createSparks(24 + Math.floor(count * 0.08));

  for (let i = 0; i < count; i += 1) {
    const radius = 1.2 + Math.random() * 2.6;
    const x = Math.random() * canvas.clientWidth;
    const y = Math.random() * canvas.clientHeight;
    const hue = colorPalettes[palette][Math.floor(Math.random() * colorPalettes[palette].length)];
    const orbitRadius = 30 + Math.random() * Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
    particles.push(createParticle(x, y, radius, hue, orbitRadius));
  }
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    canvas.clientWidth * 0.5,
    canvas.clientHeight * 0.35,
    40,
    canvas.clientWidth * 0.5,
    canvas.clientHeight * 0.45,
    canvas.clientWidth * 0.95
  );
  const paletteColors = colorPalettes[palette];

  gradient.addColorStop(0, `${paletteColors[0]}33`);
  gradient.addColorStop(0.3, `${paletteColors[1]}17`);
  gradient.addColorStop(1, '#02040b');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawStarfield() {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  starfield.forEach((star) => {
    ctx.beginPath();
    ctx.fillStyle = star.hue;
    ctx.globalAlpha = star.alpha * (0.45 + beatPulse * 0.45);
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawRings() {
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  rings.forEach((ring, index) => {
    const rotation = ring.offset + performance.now() * ring.speed;
    ctx.strokeStyle = `${colorPalettes[palette][index % colorPalettes[palette].length]}${toHex(Math.floor(ring.alpha * 255))}`;
    ctx.lineWidth = ring.width;
    ctx.beginPath();
    ctx.arc(cx, cy, ring.radius, rotation, rotation + Math.PI * 1.8);
    ctx.stroke();
  });
  ctx.restore();
}

function drawSparks() {
  sparks.forEach((spark) => {
    spark.x += Math.cos(spark.drift) * 0.28;
    spark.y += Math.sin(spark.drift) * 0.28;
    spark.alpha = 0.05 + Math.abs(Math.sin(performance.now() * 0.001 + spark.drift)) * 0.18;
    if (spark.x < 0) spark.x = canvas.clientWidth;
    if (spark.x > canvas.clientWidth) spark.x = 0;
    if (spark.y < 0) spark.y = canvas.clientHeight;
    if (spark.y > canvas.clientHeight) spark.y = 0;
    ctx.fillStyle = spark.hue;
    ctx.globalAlpha = spark.alpha * (0.75 + beatPulse * 0.25);
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawParticles() {
  const centerX = canvas.clientWidth / 2;
  const centerY = canvas.clientHeight / 2;
  const mode = controlState.visualMode;

  particles.forEach((particle) => {
    if (mode === 'flow') {
      particle.x += particle.speed * Math.cos(particle.angle) * 0.8;
      particle.y += particle.speed * Math.sin(particle.angle) * 0.8 + particle.drift;
      particle.angle += 0.002;
    } else if (mode === 'pulse') {
      const pulseScale = 1 + Math.sin(performance.now() * 0.002 + particle.angle) * 0.08 + beatPulse * 0.32;
      particle.radius = particle.baseRadius * pulseScale;
      particle.x += particle.speed * Math.cos(particle.angle) * 0.55;
      particle.y += particle.speed * Math.sin(particle.angle) * 0.55 + particle.drift * 0.55;
      particle.angle += 0.012;
    } else {
      const orbitSpeed = 0.0008 + beatPulse * 0.0012;
      particle.angle += orbitSpeed;
      particle.x = centerX + Math.cos(particle.angle + particle.orbitOffset) * particle.orbitRadius;
      particle.y = centerY + Math.sin(particle.angle + particle.orbitOffset) * particle.orbitRadius;
      particle.radius = particle.baseRadius * (1 + beatPulse * 0.28);
    }

    if (particle.x < -24) particle.x = canvas.clientWidth + 24;
    if (particle.x > canvas.clientWidth + 24) particle.x = -24;
    if (particle.y < -24) particle.y = canvas.clientHeight + 24;
    if (particle.y > canvas.clientHeight + 24) particle.y = -24;

    ctx.beginPath();
    ctx.fillStyle = particle.hue;
    ctx.globalAlpha = particle.alpha * (0.72 + beatPulse * 0.24);
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawWaveform(waveData) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const midY = height / 2;

  ctx.strokeStyle = colorPalettes[palette][2];
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  const step = Math.max(1, Math.floor(waveData.length / 120));
  for (let i = 0; i < waveData.length; i += step) {
    const x = (i / waveData.length) * width;
    const y = midY + ((waveData[i] - 128) / 128) * (height * 0.22);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < waveData.length; i += step) {
    const x = (i / waveData.length) * width;
    const y = midY + ((waveData[i] - 128) / 128) * (height * 0.1);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawFrequencyBars(freqData) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const barCount = 36;
  const spacing = width / barCount;

  for (let i = 0; i < barCount; i += 1) {
    const value = freqData[Math.floor((i / barCount) * freqData.length)];
    const barHeight = (value / 255) * height * 0.46;
    const x = i * spacing + spacing * 0.1;
    const y = height - barHeight - 36;
    const gradient = ctx.createLinearGradient(x, y, x, height);
    gradient.addColorStop(0, colorPalettes[palette][3]);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, spacing * 0.8, barHeight);
  }
}

function beatDetect(values) {
  const now = performance.now();
  const bass = values.slice(0, 8).reduce((sum, val) => sum + val, 0) / 8;
  const threshold = 150 + ((controlState.sensitivity - 1) * 25);

  if (bass > threshold && now - lastBeatTime > 210) {
    lastBeatTime = now;
    beatPulse = 1;
  }
  beatPulse *= 0.94;
}

function toHex(value) {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function drawCursorHalo() {
  const strength = Math.min(1, beatPulse + 0.08);
  const radius = Math.max(canvas.clientWidth, canvas.clientHeight) * 0.38;
  const halo = ctx.createRadialGradient(
    canvas.clientWidth / 2,
    canvas.clientHeight / 2,
    radius * 0.08,
    canvas.clientWidth / 2,
    canvas.clientHeight / 2,
    radius
  );
  halo.addColorStop(0, `${colorPalettes[palette][0]}${toHex(Math.floor(70 + 90 * strength))}`);
  halo.addColorStop(0.32, 'transparent');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function updateMetrics(freqData) {
  const avg = freqData.reduce((sum, value) => sum + value, 0) / freqData.length;
  const energy = Math.min(100, Math.round((avg / 255) * 100 * Math.min(1.2, controlState.sensitivity)));
  energyValue.textContent = `${energy}%`;

  const bass = freqData.slice(0, 12).reduce((sum, value) => sum + value, 0) / 12;
  const bpm = Math.max(40, Math.min(180, Math.round(45 + (bass / 255) * 120)));
  bpmValue.textContent = bpm;
}

function updateVisualMode(mode) {
  controlState.visualMode = mode;
  modeValue.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
}

function animate() {
  if (!isRunning) return;
  analyser.getByteTimeDomainData(dataArray);
  analyser.getByteFrequencyData(freqArray);

  const alpha = 1 - controlState.blur;
  ctx.fillStyle = `rgba(3, 5, 12, ${alpha})`;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  drawBackground();
  drawStarfield();
  drawRings();
  drawSparks();
  drawCursorHalo();
  drawParticles();
  drawFrequencyBars(freqArray);
  drawWaveform(dataArray);
  beatDetect(freqArray);
  updateMetrics(freqArray);
  updateSynthProgress();

  animationId = requestAnimationFrame(animate);
}

function startVisualizer() {
  if (isRunning) return;
  isRunning = true;
  updateState();
  resizeCanvas();
  if (!audioContext) {
    createAudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (currentSource === 'file' && audioPlayback.src) {
    audioPlayback.play().catch(() => {
      console.warn('Audio playback requires user interaction.');
    });
  }

  buildParticles(Math.floor(120 * controlState.density));
  animate();
}

function stopVisualizer() {
  isRunning = false;
  if (animationId) cancelAnimationFrame(animationId);
  if (audioPlayback && !audioPlayback.paused) audioPlayback.pause();

  if (synthOscillator) {
    try {
      synthOscillator.stop();
      synthOscillator.disconnect();
    } catch (err) {
      console.warn('Synth oscillator stop error:', err);
    }
    synthOscillator = null;
  }

  if (synthModulator) {
    try {
      synthModulator.stop();
      synthModulator.disconnect();
    } catch (err) {
      console.warn('Synth modulator stop error:', err);
    }
    synthModulator = null;
  }

  disconnectSource();
}

function updatePalette(selected) {
  palette = selected;
  moodOverlay.textContent = moodSelect.options[moodSelect.selectedIndex].text;
  document.body.style.background = `radial-gradient(circle at top left, ${colorPalettes[palette][0]}22, transparent 24%), radial-gradient(circle at bottom right, ${colorPalettes[palette][1]}18, transparent 18%), #05060f`;
  buildParticles(Math.floor(120 * controlState.density));
}

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds) || seconds === Infinity) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateQueueUI() {
  queueList.innerHTML = queue.map((track, index) => `
    <li data-index="${index}" class="${index === currentTrackIndex ? 'active' : ''}">
      <div>
        <span class="track-name">${track.title}</span>
        <span>${track.artist}</span>
      </div>
      <span>${formatTime(track.duration)}</span>
    </li>`).join('');
}

function updateQueueCount() {
  queueCount.textContent = `${queue.length} tracks`;
}

function updateTrackInfo(index) {
  const track = queue[index] || queue[0] || { title: 'Nothing playing', artist: 'Choose a vibe or upload a file', lyrics: 'Select a station and watch the visuals react.' };
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackAlbum.textContent = track.album || 'Station Mix';
  lyricsCaption.textContent = track.lyrics || 'Keep the vibe flowing.';
  if (track.cover) {
    coverArt.style.background = `url('${track.cover}') center/cover no-repeat`;
  } else {
    coverArt.style.background = `linear-gradient(135deg, ${colorPalettes[palette][1]}44, ${colorPalettes[palette][3]}14)`;
  }
  coverArt.style.backgroundSize = 'cover';

  if (currentSource === 'file' && audioPlayback.src) {
    progressInput.disabled = false;
    durationTimeLabel.textContent = formatTime(audioPlayback.duration || 0);
  } else {
    progressInput.disabled = true;
    currentTimeLabel.textContent = '0:00';
    durationTimeLabel.textContent = formatTime(track.duration || currentTrackDuration);
    progressInput.value = 0;
  }
}

function setStation(stationKey) {
  activeStation = stationKey;
  radioButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.radio === stationKey);
  });

  queue = stationData[stationKey].slice();
  currentTrackIndex = 0;
  currentTrackDuration = queue[0]?.duration || 180;
  trackStartTime = performance.now();
  updateQueueCount();
  updateQueueUI();
  updateTrackInfo(currentTrackIndex);
  lyricsCaption.textContent = `Station loaded: ${stationKey}`;

  if (currentSource === 'file' && queue[currentTrackIndex]?.src) {
    attachTrackUrl(queue[currentTrackIndex].src);
  } else if (currentSource === 'synth') {
    setSource('synth');
    if (isPlaying) startVisualizer();
  }
}

function applyTrackTone(index) {
  const track = queue[index];
  if (track && synthOscillator) {
    synthOscillator.frequency.setValueAtTime(track.tone, audioContext.currentTime);
  }
}

function skipTrack(offset) {
  if (queue.length === 0) return;
  currentTrackIndex = (currentTrackIndex + offset + queue.length) % queue.length;
  updateQueueUI();
  updateTrackInfo(currentTrackIndex);
  if (currentSource === 'file' && queue[currentTrackIndex]?.src) {
    attachTrackUrl(queue[currentTrackIndex].src);
  }
  if (currentSource === 'synth') {
    applyTrackTone(currentTrackIndex);
    currentTrackDuration = queue[currentTrackIndex].duration || 180;
    trackStartTime = performance.now();
  }
}

function togglePlayPause() {
  if (isRunning) {
    stopVisualizer();
    playPauseButton.textContent = '▶';
    isPlaying = false;
    return;
  }

  if (currentSource === 'file' && !audioPlayback.src) {
    if (fileInput.files.length > 0) {
      attachFile(fileInput.files[0]);
    } else if (queue[currentTrackIndex]?.src) {
      attachTrackUrl(queue[currentTrackIndex].src);
    }
  }

  if (currentSource === 'synth' && !synthOscillator) {
    attachSynth();
    applyTrackTone(currentTrackIndex);
  }

  if (currentSource === 'mic' && !sourceNode) {
    attachMic();
  }

  if (currentSource === 'synth') {
    currentTrackDuration = queue[currentTrackIndex]?.duration || 180;
    trackStartTime = performance.now();
  }

  startVisualizer();
  playPauseButton.textContent = '⏸';
  isPlaying = true;
}

function handleAudioTimeUpdate() {
  if (!audioPlayback.src || audioPlayback.duration === 0 || Number.isNaN(audioPlayback.duration)) return;
  currentTimeLabel.textContent = formatTime(audioPlayback.currentTime);
  durationTimeLabel.textContent = formatTime(audioPlayback.duration);
  progressInput.value = (audioPlayback.currentTime / audioPlayback.duration) * 100;
}

function handleAudioLoadedMetadata() {
  durationTimeLabel.textContent = formatTime(audioPlayback.duration);
  progressInput.disabled = false;
}

function updateSynthProgress() {
  if (currentSource !== 'synth' || !isRunning) return;
  const elapsed = (performance.now() - trackStartTime) / 1000;
  const progress = Math.min(elapsed / currentTrackDuration, 1);
  currentTimeLabel.textContent = formatTime(elapsed);
  durationTimeLabel.textContent = formatTime(currentTrackDuration);
  progressInput.value = progress * 100;

  if (progress >= 1) {
    skipTrack(1);
  }
}

function seekAudio(event) {
  if (!audioPlayback.src || audioPlayback.duration === 0) return;
  const value = Number(event.target.value) / 100;
  audioPlayback.currentTime = value * audioPlayback.duration;
}

function updateTheme(themeValue) {
  if (themeValue === 'dark') {
    document.body.style.background = '#05060f';
  } else if (themeValue === 'neon') {
    document.body.style.background = 'radial-gradient(circle at top left, rgba(142, 99, 255, 0.12), transparent 22%), radial-gradient(circle at bottom right, rgba(57, 211, 255, 0.12), transparent 18%), #02040b';
  } else if (themeValue === 'lounge') {
    document.body.style.background = 'radial-gradient(circle at top left, rgba(255, 170, 135, 0.14), transparent 22%), radial-gradient(circle at bottom right, rgba(115, 204, 197, 0.09), transparent 18%), #081018';
  }
}

window.addEventListener('resize', resizeCanvas);

sourceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setSource(button.dataset.source);
  });
});

radioButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setStation(button.dataset.radio);
  });
});

fileInput.addEventListener('change', (event) => {
  if (event.target.files.length > 0) {
    if (currentSource === 'file') {
      attachFile(event.target.files[0]);
      updateTrackInfo(currentTrackIndex);
    }
  }
});

queueList.addEventListener('click', (event) => {
  const item = event.target.closest('li');
  if (!item || item.dataset.index == null) return;
  const index = Number(item.dataset.index);
  if (Number.isNaN(index)) return;

  currentTrackIndex = index;
  updateQueueUI();
  updateTrackInfo(currentTrackIndex);

  if (currentSource === 'file' && queue[currentTrackIndex]?.src) {
    attachTrackUrl(queue[currentTrackIndex].src);
  }
  if (currentSource === 'synth') {
    applyTrackTone(currentTrackIndex);
    currentTrackDuration = queue[currentTrackIndex].duration || 180;
    trackStartTime = performance.now();
  }

  if (isPlaying && !isRunning) {
    startVisualizer();
  }
});

sensitivityRange.addEventListener('input', updateState);
densityRange.addEventListener('input', () => {
  updateState();
  buildParticles(Math.floor(120 * controlState.density));
});
blurRange.addEventListener('input', updateState);
volumeRange.addEventListener('input', updateState);

visualModeSelect.addEventListener('change', (event) => {
  updateVisualMode(event.target.value);
});

moodSelect.addEventListener('change', (event) => {
  updatePalette(event.target.value);
});

themeSelect.addEventListener('change', (event) => {
  updateTheme(event.target.value);
});

startButton.addEventListener('click', () => {
  if (!audioContext) createAudioContext();
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (currentSource === 'mic') {
    attachMic().then(startVisualizer);
  } else if (currentSource === 'file') {
    if (fileInput.files.length > 0) {
      attachFile(fileInput.files[0]);
    } else if (queue[currentTrackIndex]?.src) {
      attachTrackUrl(queue[currentTrackIndex].src);
    } else {
      alert('Choose a source or select a track first.');
      return;
    }
    startVisualizer();
  } else {
    if (!synthOscillator) attachSynth();
    applyTrackTone(currentTrackIndex);
    startVisualizer();
  }
  playPauseButton.textContent = '⏸';
  isPlaying = true;
});

stopButton.addEventListener('click', () => {
  stopVisualizer();
  playPauseButton.textContent = '▶';
  isPlaying = false;
});

prevButton.addEventListener('click', () => skipTrack(-1));
nextButton.addEventListener('click', () => skipTrack(1));
playPauseButton.addEventListener('click', togglePlayPause);
progressInput.addEventListener('input', seekAudio);

audioPlayback.addEventListener('timeupdate', handleAudioTimeUpdate);
audioPlayback.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
audioPlayback.addEventListener('ended', () => {
  if (currentSource === 'file') skipTrack(1);
});

document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
  if (event.code === 'Space') {
    event.preventDefault();
    togglePlayPause();
  }
  if (event.code === 'ArrowRight') {
    skipTrack(1);
  }
  if (event.code === 'ArrowLeft') {
    skipTrack(-1);
  }
});

resizeCanvas();
updateState();
updateVisualMode(controlState.visualMode);
updatePalette(palette);
queue = stationData[activeStation].slice();
updateQueueCount();
updateQueueUI();
updateTrackInfo(currentTrackIndex);
sourceButtons.forEach((button) => button.classList.toggle('active', button.dataset.source === currentSource));
