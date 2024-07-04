let scene, camera, renderer, sphere, cude, controls;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x0077ff });
    sphere = new THREE.Mesh(geometry, material);

    const squareGeometry = new THREE.BoxGeometry(2, 2, 2);
    const squareMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const square = new THREE.Mesh(squareGeometry, squareMaterial);

    square.position.set(-3, 0, 1);
    scene.add(square);

    scene.add(sphere);
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 2, 4).normalize();
    scene.add(light);

    // Добавляем контроллы
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // добавляет плавное замедление
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 500;

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Обновляем контроллы
    controls.update();

    renderer.render(scene, camera);
}

init();