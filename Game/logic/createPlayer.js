export const createPlayer = (scene,player) => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x0077ff });
    let sphere = new THREE.Mesh(geometry, material);
    const playerGeometry = new THREE.SphereGeometry(1, 32, 32);
    const playerMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;

    return {sphere,player}
}
export const checkPlayButton = (event, player) => {

    var keyCode = event.which;
    if (keyCode == 87) {
        player.position.z -= 1;
    } else if (keyCode == 83) {
        player.position.z += 1;
    } else if (keyCode == 65) {
        player.position.x -= 1;
    } else if (keyCode == 68) {
        player.position.x += 1;
    } else if (keyCode == 32) {
        shoot();
    }
}