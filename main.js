// 1. Inisialisasi Scene Three.js
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Custom GLSL Shader untuk Efek Distorsi Liquid & Hover
const vertexShader = `
    varying vec2 vUv;
    uniform vec2 uMouse;
    
    void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Distorsi posisi vertex berdasarkan jarak kursor mouse
        float dist = distance(uv, uMouse);
        pos.z += sin(dist * 10.0) * 0.15 * (1.0 - dist);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
        vec2 uv = vUv;
        
        // Gelombang mikro halus (efek napas/cairan)
        uv.x += sin(uv.y * 10.0 + uTime) * 0.005;
        uv.y += cos(uv.x * 10.0 + uTime) * 0.005;
        
        vec4 color = texture2D(uTexture, uv);
        gl_FragColor = color;
    }
`;

// 3. Load Texture Gambar (Ganti dengan gambar burung gagak / visual utama Anda)
const textureLoader = new THREE.TextureLoader();
// Menggunakan URL gambar transparan / elemen visual sinematik
const texture = textureLoader.load('https://pngimg.com/uploads/crow/crow_PNG64.png');

const uniforms = {
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 }
};

const geometry = new THREE.PlaneGeometry(3, 3, 32, 32);
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 1.2; // Geser ke kanan
scene.add(mesh);

// 4. Integrasi Interaksi Mouse (Smooth Inertia dengan GSAP)
const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX / window.innerWidth;
    mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
    
    // Rotasi 3D mesh mengikuti kursor secara perlahan
    gsap.to(mesh.rotation, {
        y: (e.clientX / window.innerWidth - 0.5) * 0.5,
        x: -(e.clientY / window.innerHeight - 0.5) * 0.5,
        duration: 1.5,
        ease: "power2.out"
    });
});

// 5. Render Loop (60 FPS)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    // Smooth lerp mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    uniforms.uMouse.value.set(mouse.x, mouse.y);
    
    uniforms.uTime.value = clock.getElapsedTime();
    
    renderer.render(scene, camera);
}

animate();

// 6. Handling Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // WAJIB: Membuka transparansi latar WebGL
    antialias: true
});
renderer.setClearColor(0x000000, 0); // Set transparansi ke 0 (100% transparan)

// 1. Load Gambar Latar sebagai Texture Three.js
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load('path/ke/gambar-background.jpg', (texture) => {
    // Memastikan proporsi gambar tidak gepeng saat di-stretch
    texture.minFilter = THREE.LinearFilter;
});

// 2. Buat Geometry Plane Seluas Layar
// Menggunakan PlaneGeometry sebesar aspek rasio layar
const bgGeometry = new THREE.PlaneGeometry(10, 10);

// 3. Masukkan ke ShaderMaterial (Dapat diberi efek kustom)
const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D uBgTexture;
        uniform vec2 uMouse;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            
            // Efek Distorsi Gelombang Lembut pada Gambar Background
            uv.x += sin(uv.y * 5.0 + uTime * 0.5) * 0.003;
            uv.y += cos(uv.x * 5.0 + uTime * 0.5) * 0.003;

            vec4 color = texture2D(uBgTexture, uv);
            gl_FragColor = color;
        }
    `,
    uniforms: {
        uBgTexture: { value: bgTexture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 }
    },
    depthWrite: false // Agar elemen 3D lain (objek gagak) selalu dirender di depannya
});

// 4. Tambahkan Mesh Background ke Scene
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.z = -2; // Posisikan di paling belakang objek lain
scene.add(bgMesh);