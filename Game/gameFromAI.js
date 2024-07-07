import { createPlayer,checkPlayButton } from './logic/createPlayer.js';

let scene, camera, renderer, controls;
let player, crystals = [], enemies = [];
let playerHealth = 10;

const acceleration = new THREE.Vector3();
let velocity = new THREE.Vector3();
const maxSpeed = 1; // Максимальная скорость игрока
const friction = 0.05; // Коэффициент трен
let sphere = 0;

// function updateInput() {
//     const moveForward = (keysPressed['w'] || keysPressed['ArrowUp']);
//     const moveBackward = (keysPressed['s'] || keysPressed['ArrowDown']);
//     const moveLeft = (keysPressed['a'] || keysPressed['ArrowLeft']);
//     const moveRight = (keysPressed['d'] || keysPressed['ArrowRight']);

//     acceleration.set(0, 0, 0);

//     if (moveForward) {
//         acceleration.z += -1;
//     }
//     if (moveBackward) {
//         acceleration.z += 1;
//     }
//     if (moveLeft) {
//         acceleration.x += -1;
//     }
//     if (moveRight) {
//         acceleration.x += 1;
//     }

//     acceleration.normalize().multiplyScalar(0.1); // Небольшое значение ускорения
// }

// Обновляем функцию движения игрока
// function updatePlayer(velocity, delta) {
//     // Обновляем входы
//     updateInput();

//     // Учитываем инерцию и трение
//     velocity.add(acceleration);
//     velocity.multiplyScalar(1 - friction); // Применяем трение

//     // Ограничиваем скорость
//     if (velocity.length() > maxSpeed) {
//         velocity.normalize().multiplyScalar(maxSpeed);
//     }

//     // Обновляем позицию игрока на основе текущей скорости
//     player.position.add(velocity);

//     // Если скорость очень маленькая, останавливаем игрока
//     if (velocity.length() < 0.0001) {
//         velocity.set(0, 0, 0);
//     }
// }


function generateBackgroundTexture() {
    
    const size = 200; // размер текстуры
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');

    // Заполнение фона цветом
    context.fillStyle = '#c2b280'; // светлый песочный цвет
    context.fillRect(0, 0, size, size);

    // Добавление случайных пятен
    for (let i = 0; i < 200; i++) {
        context.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.5})`; // полупрозрачный серый
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 3;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // повторение текстуры

    return texture;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(25, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    camera.position.set(0, 20, 50);
    controls.update();

    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Создание игрока
    sphere = createPlayer(scene,player)
    scene.add(sphere.player);
    player = sphere.player
            // Настройка фона
    const backgroundTexture = generateBackgroundTexture();
    const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
    const backgroundGeometry = new THREE.PlaneGeometry(50, 50); // размер фона подбирайте соответствующий
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.rotation.x = - Math.PI / 2; // поворачиваем фон чтобы он был горизонтально
    scene.add(backgroundMesh);

    // Создание кристаллов
    for (let i = 0; i < 10; i++) {
        const crystal = new THREE.Mesh(
            new THREE.TetrahedronGeometry(0.5),
            new THREE.MeshPhongMaterial({color: 0xff00ff})
        );
        crystal.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
        crystals.push(crystal);
        scene.add(crystal);
    }

    // Создание врагов
    for (let i = 0; i < 5; i++) {
        const enemy = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshPhongMaterial({color: 0xff0000})
        );
        enemy.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
        enemies.push(enemy);
        scene.add(enemy);

    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    // const delta = clock.getDelta();

    // updatePlayer(delta);

    renderer.render(scene, camera);
}

function onDocumentKeyDown(event) {

    checkPlayButton(event, player)
    collectCrystals();
    checkCollisions();
}

function collectCrystals() {
    crystals.forEach((crystal, index) => {
        if (player.position.distanceTo(crystal.position) < 1.5) {
            scene.remove(crystal);
            crystals.splice(index, 1);

            player.scale.addScalar(0.1);
            playerHealth += 10;
        }
    });
}
// Добавим обработчик события для нажатия на левую кнопку мыши
// document.addEventListener('mousedown', (event) => {
//     if (event.button === 0) { // 0 — это левая кнопка мыши
//         shoot();
//     }
// });

// function shoot() {
//     const bulletSpeed = 5;
//     const bulletSize = 5;

//     // Создаем геометрию и материал для снаряда
//     const bulletGeometry = new THREE.SphereGeometry(bulletSize, 8, 8);
//     const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Красный цвет
//     const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

//     // Начальное положение снаряда — у основания вышки
//     bullet.position.copy(tower.position);

//     // Добавляем снаряд в сцену
//     scene.add(bullet);

//     // Рассчитываем направление выстрела
//     const direction = new THREE.Vector3();
//     player.getWorldDirection(direction);
//     direction.normalize();

//     // Постоянно обновляем положение снаряда
//     function updateBullet() {
//         bullet.position.add(direction.clone().multiplyScalar(bulletSpeed));

//         // Проверяем, если снаряд вышел за границы сцены (условно) или пересекается с целью,
//         // его нужно удалить
//         if (Math.abs(bullet.position.x) > 50 || Math.abs(bullet.position.z) > 50) {
//             scene.remove(bullet);
//             return;
//         }

//         requestAnimationFrame(updateBullet);
//     }

//     updateBullet();
// }
// function checkBulletCollisions(bullet) {
//     // Пули сталкиваются с врагами
//     let hit = false;
//     enemies.forEach((enemy, index) => {
//         if (bullet.position.distanceTo(enemy.position) < 1) {
//             scene.remove(enemy);
//             enemies.splice(index, 1);
//             playerHealth += 5; // Добавляем здоровье при убийстве
//             hit = true;
//         }
//     });

//     // Удаление пули, если она слишком далеко
//     if (bullet.position.length() > 50) {
//         hit = true;
//     }

//     return hit;
// }

function checkCollisions() {
    // Проверка столкновений игрока с врагами
    enemies.forEach((enemy, index) => {
        if (player.position.distanceTo(enemy.position) < 1.5) {
            playerHealth -= 5;
            if (playerHealth <= 0) {
                alert("You Died!");
                location.reload();
            } else {
                scene.remove(enemy);
                enemies.splice(index, 1);
            }
            if(enemies.length === 0) {
                alert("You Won!");
                location.reload();
            }
        }
    });
}

document.addEventListener('keydown', onDocumentKeyDown, false);

init();
animate();