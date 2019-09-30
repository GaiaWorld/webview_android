_$define("pi/render3d/fly_control", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const three_1 = require("./three");
class FlyControl {
    constructor(target, movementSpeed = 80.0, rollSpeed = 0.1, dimension = { size: [1, 1], offset: [0, 0] }) {
        this.target = target;
        this.dimension = dimension;
        this.movementSpeed = movementSpeed;
        this.rollSpeed = rollSpeed;
        this.tmpQuaternion = new three_1.THREE.Quaternion();
        this.state = {
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0
        };
        this.moveVector = new three_1.THREE.Vector3(0, 0, 0);
        this.rotationVector = new three_1.THREE.Vector3(0, 0, 0);
    }
    setRollSpeed(rollSpeed) {
        this.rollSpeed = rollSpeed;
    }
    setMovementSpeed(movementSpeed) {
        this.movementSpeed = movementSpeed;
    }
    onMouseLDown(event) {
        if (event.which === 1) {
            this.updateLastPos(event.clientX, event.clientY);
        }
    }
    onMouseMDown(event) {
        if (event.which === 2) {
            this.updateLastPos(event.clientX, event.clientY);
        }
    }
    onMouseLMove(event) {
        if (event.which !== 1) {
            return;
        }
        const xc = event.clientX - this.lastMouseX;
        const yc = event.clientY - this.lastMouseY;
        this.state.ry = xc;
        this.state.rx = yc;
        this.update();
        this.updateLastPos(event.clientX, event.clientY);
        this.restoreState();
    }
    onMouseMMove(event) {
        if (event.which !== 2) {
            return;
        }
        const xc = event.clientX - this.lastMouseX;
        const yc = event.clientY - this.lastMouseY;
        this.state.x = xc;
        this.state.y = yc;
        this.update();
        this.updateLastPos(event.clientX, event.clientY);
        this.restoreState();
    }
    onMouseWheel(event) {
        const dy = event.deltaY;
        this.state.z = dy;
        this.update();
        this.updateLastPos(event.clientX, event.clientY);
        this.restoreState();
    }
    update(delta = 0.02) {
        const moveMult = delta * this.movementSpeed;
        const rotMult = delta * this.rollSpeed;
        this.target.translateX(-this.state.x * moveMult);
        this.target.translateY(this.state.y * moveMult);
        this.target.translateZ(this.state.z * moveMult);
        this.target.rotation._x += this.state.rx * rotMult;
        this.target.rotation._y += this.state.ry * rotMult;
        // this.target.rotation._z += this.state.z * rotMult;
        this.target.quaternion.setFromEuler(this.target.rotation);
    }
    updateLastPos(x, y) {
        this.lastMouseX = x;
        this.lastMouseY = y;
    }
    restoreState() {
        this.state.x = 0;
        this.state.y = 0;
        this.state.z = 0;
        this.state.rx = 0;
        this.state.ry = 0;
    }
}
exports.FlyControl = FlyControl;
});
