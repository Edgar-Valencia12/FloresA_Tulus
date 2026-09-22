// --- SISTEMA DE PARTÍCULAS ---
function createParticle() {
    const container = document.getElementById('particles-container');
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 2; 
    const left = Math.random() * 100;
    const duration = Math.random() * 7 + 5;
    const delay = Math.random() * 2;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}vw`;
    particle.style.animationDuration = `${duration}s, 3s`;
    particle.style.animationDelay = `${delay}s, 0s`;
    
    container.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000);
}
setInterval(createParticle, 250);

// --- CONFIGURACIÓN DEL RAMO ---
const bouquetPoints = [
    {x: 150, y: 180, s: 0.75}, {x: 230, y: 130, s: 0.8}, {x: 300, y: 110, s: 0.9}, {x: 370, y: 130, s: 0.8}, {x: 450, y: 180, s: 0.75},
    {x: 100, y: 260, s: 0.8}, {x: 500, y: 260, s: 0.8},
    {x: 180, y: 240, s: 0.95}, {x: 260, y: 190, s: 1.0}, {x: 340, y: 190, s: 1.0}, {x: 420, y: 240, s: 0.95},
    {x: 130, y: 340, s: 0.9}, {x: 470, y: 340, s: 0.9},
    {x: 200, y: 320, s: 1.1}, {x: 300, y: 280, s: 1.2}, {x: 400, y: 320, s: 1.1},
    {x: 160, y: 420, s: 0.85}, {x: 250, y: 380, s: 1.25}, {x: 350, y: 380, s: 1.25}, {x: 440, y: 420, s: 0.85},
    {x: 200, y: 480, s: 0.9}, {x: 300, y: 460, s: 1.3}, {x: 400, y: 480, s: 0.9},
    {x: 260, y: 520, s: 0.8}, {x: 340, y: 520, s: 0.8}
];

const stemsGroup = document.getElementById('stems-group');
const flowersGroup = document.getElementById('flowers-group');

// --- GENERACIÓN DE TALLOS Y FLORES ---
bouquetPoints.forEach((pt) => {
    const startX = 270 + (Math.random() * 60); 
    const startY = 600 + (Math.random() * 30);
    
    const cpX = (startX + pt.x) / 2 + (Math.random() * 80 - 40);
    const cpY = (startY + pt.y) / 2 + 50;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'stem-path');
    path.setAttribute('d', `M ${startX} ${startY} Q ${cpX} ${cpY} ${pt.x} ${pt.y}`);
    stemsGroup.appendChild(path);

    const randomRotation = Math.random() * 360;
    
    const gWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gWrapper.setAttribute('class', 'flower-wrapper');
    gWrapper.style.transformOrigin = `${pt.x}px ${pt.y}px`;

    const gTransform = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gTransform.setAttribute('transform', `translate(${pt.x}, ${pt.y}) scale(${pt.s}) rotate(${randomRotation})`);
    
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#sunflower-def');
    
    gTransform.appendChild(use);
    gWrapper.appendChild(gTransform);
    flowersGroup.appendChild(gWrapper);
});

// --- MÚSICA DE PIANO SUAVE ---
function startSoftPianoMusic() {
    const reverb = new Tone.Reverb({
        decay: 4,
        wet: 0.5
    }).toDestination();

    const pianoSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
            attack: 0.2,
            decay: 1.5,
            sustain: 0.1,
            release: 2
        }
    }).connect(reverb);
    
    pianoSynth.volume.value = -10;

    const melodyNotes = [
        "C4", "E4", "G4", "B4", 
        "A4", "F4", "C4", "E4", 
        "D4", "F4", "A4", "C5", 
        "B4", "G4", "E4", "G4"
    ];

    let noteIndex = 0;

    Tone.Transport.scheduleRepeat((time) => {
        pianoSynth.triggerAttackRelease(melodyNotes[noteIndex], "2n", time);
        noteIndex = (noteIndex + 1) % melodyNotes.length;
    }, "1n");

    Tone.Transport.start();
}

// --- LÓGICA DE INTERACCIÓN ---
document.getElementById('initial-trigger').addEventListener('click', async function() {
    // Activa el motor de audio web al toque del usuario
    await Tone.start();
    startSoftPianoMusic();

    // Ocultar elementos iniciales y títulos
    this.classList.add('hide');
    document.getElementById('main-title').style.opacity = '0'; 
    document.getElementById('sub-title').style.opacity = '0'; 

    // Mostrar el contenedor del ramo y envolturas
    const bouquet = document.getElementById('bouquet-container');
    bouquet.classList.add('show');
    
    const wrapperParts = document.querySelectorAll('.wrapper-front');
    wrapperParts.forEach(part => part.classList.add('show'));

    // Animar crecimiento de tallos y florecimiento
    const stems = document.querySelectorAll('.stem-path');
    const flowers = document.querySelectorAll('.flower-wrapper');
    
    stems.forEach((stem, index) => {
        const length = stem.getTotalLength();
        stem.style.strokeDasharray = length;
        stem.style.strokeDashoffset = length;
        
        stem.getBoundingClientRect(); // Forzar repintado
        
        stem.style.strokeDashoffset = '0';
        
        setTimeout(() => {
            flowers[index].classList.add('bloom');
        }, 1800 + (Math.random() * 600)); 
    });
});
