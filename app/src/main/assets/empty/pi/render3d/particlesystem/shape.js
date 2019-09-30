_$define("pi/render3d/particlesystem/shape", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const three_1 = require("../three");
let tmp1;
let tmp2;
var PSShapeType;
(function (PSShapeType) {
    PSShapeType[PSShapeType["Sphere"] = 0] = "Sphere";
    PSShapeType[PSShapeType["SphereShell"] = 1] = "SphereShell";
    PSShapeType[PSShapeType["Hemisphere"] = 2] = "Hemisphere";
    PSShapeType[PSShapeType["HemisphereShell"] = 3] = "HemisphereShell";
    PSShapeType[PSShapeType["Cone"] = 4] = "Cone";
    PSShapeType[PSShapeType["Box"] = 5] = "Box";
    PSShapeType[PSShapeType["Mesh"] = 6] = "Mesh";
    PSShapeType[PSShapeType["ConeShell"] = 7] = "ConeShell";
    PSShapeType[PSShapeType["ConeVolume"] = 8] = "ConeVolume";
    PSShapeType[PSShapeType["ConeVolumeShell"] = 9] = "ConeVolumeShell";
    PSShapeType[PSShapeType["Circle"] = 10] = "Circle";
    PSShapeType[PSShapeType["CircleEdge"] = 11] = "CircleEdge";
    PSShapeType[PSShapeType["SingleSidedEdge"] = 12] = "SingleSidedEdge";
    PSShapeType[PSShapeType["MeshRenderer"] = 13] = "MeshRenderer";
    PSShapeType[PSShapeType["SkinnedMeshRenderer"] = 14] = "SkinnedMeshRenderer";
    PSShapeType[PSShapeType["BoxShell"] = 15] = "BoxShell";
    PSShapeType[PSShapeType["BoxEdge"] = 16] = "BoxEdge";
})(PSShapeType || (PSShapeType = {}));
class BoxImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.box = new three_1.THREE.Vector3(config.box.x, config.box.y, config.box.z);
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const x = this.box.x * (Math.random() - 0.5);
        const y = this.box.y * (Math.random() - 0.5);
        const z = this.box.z * (Math.random() - 0.5);
        pos.set(x, y, z);
    }
}
class BoxShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.box = new three_1.THREE.Vector3(config.box.x, config.box.y, config.box.z);
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        let x = 0;
        let y = 0;
        let z = 0;
        const v1 = Math.random() - 0.5;
        const v2 = Math.random() - 0.5;
        const plane = Math.floor(Math.random() * 6);
        switch (plane) {
            case 0: // x正面
                x = this.box.x * 0.5;
                y = this.box.y * v1;
                z = this.box.z * v2;
                break;
            case 1: // x反面
                x = this.box.x * -0.5;
                y = this.box.y * v1;
                z = this.box.z * v2;
                break;
            case 2: // y正面
                x = this.box.x * v1;
                y = this.box.y * 0.5;
                z = this.box.z * v2;
                break;
            case 3: // y反面
                x = this.box.x * v1;
                y = this.box.y * -0.5;
                z = this.box.z * v2;
                break;
            case 4: // z正面
                x = this.box.x * v1;
                y = this.box.y * v2;
                z = this.box.z * 0.5;
                break;
            case 5: // z反面
                x = this.box.x * v1;
                y = this.box.y * v2;
                z = this.box.z * -0.5;
                break;
            default:
        }
        pos.set(x, y, z);
    }
}
class BoxEdgeImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.box = new three_1.THREE.Vector3(config.box.x, config.box.y, config.box.z);
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        let x = 0;
        let y = 0;
        let z = 0;
        const v = Math.random() - 0.5;
        const edge = Math.floor(Math.random() * 12);
        switch (edge) {
            case 0:
                x = this.box.x * 0.5;
                y = this.box.y * 0.5;
                z = this.box.z * v;
                break;
            case 1:
                x = -this.box.x * 0.5;
                y = this.box.y * 0.5;
                z = this.box.z * v;
                break;
            case 2:
                x = this.box.x * 0.5;
                y = -this.box.y * 0.5;
                z = this.box.z * v;
                break;
            case 3:
                x = -this.box.x * 0.5;
                y = -this.box.y * 0.5;
                z = this.box.z * v;
                break;
            case 4:
                x = this.box.x * v;
                y = this.box.y * 0.5;
                z = this.box.z * 0.5;
                break;
            case 5:
                x = this.box.x * v;
                y = -this.box.y * 0.5;
                z = this.box.z * 0.5;
                break;
            case 6:
                x = this.box.x * v;
                y = this.box.y * 0.5;
                z = -this.box.z * 0.5;
                break;
            case 7:
                x = this.box.x * v;
                y = -this.box.y * 0.5;
                z = -this.box.z * 0.5;
                break;
            case 8:
                x = this.box.x * 0.5;
                y = this.box.y * v;
                z = this.box.z * 0.5;
                break;
            case 9:
                x = -this.box.x * 0.5;
                y = this.box.y * v;
                z = this.box.z * 0.5;
                break;
            case 10:
                x = this.box.x * 0.5;
                y = this.box.y * v;
                z = -this.box.z * 0.5;
                break;
            case 11:
                x = -this.box.x * 0.5;
                y = this.box.y * v;
                z = -this.box.z * 0.5;
                break;
            default:
        }
        pos.set(x, y, z);
    }
}
// tslint:disable:max-classes-per-file
class SphereImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const r = this.radius * Math.random();
        const a = Math.PI * Math.random();
        const b = Math.PI * Math.random() * 2;
        const sa = r * Math.sin(a);
        const ca = r * Math.cos(a);
        const sb = Math.sin(b);
        const cb = Math.cos(b);
        pos.set(sa * cb, ca, sa * sb);
    }
}
class SphereShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const a = Math.PI * Math.random();
        const b = Math.PI * Math.random() * 2;
        const sa = this.radius * Math.sin(a);
        const ca = this.radius * Math.cos(a);
        const sb = Math.sin(b);
        const cb = Math.cos(b);
        pos.set(sa * cb, ca, sa * sb);
    }
}
class HemisphereImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const r = this.radius * Math.random();
        const a = Math.PI * Math.random() * 0.5;
        const b = Math.PI * Math.random() * 2;
        const sa = r * Math.sin(a);
        const ca = r * Math.cos(a);
        const sb = Math.sin(b);
        const cb = Math.cos(b);
        pos.set(sa * cb, ca, sa * sb);
    }
}
class HemisphereShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const a = Math.PI * Math.random() * 0.5;
        const b = Math.PI * Math.random() * 2;
        const sa = this.radius * Math.sin(a);
        const ca = this.radius * Math.cos(a);
        const sb = Math.sin(b);
        const cb = Math.cos(b);
        pos.set(sa * cb, ca, sa * sb);
    }
}
/**
 * 圆柱底部的圆内
 */
class CylinderImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        const r = this.radius * Math.random();
        pos.set(r * Math.cos(phi), 0, r * Math.sin(phi));
        dir.set(0, 1, 0);
    }
}
/**
 * 圆柱底部的圆周
 */
class CylinderShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        pos.set(this.radius * Math.cos(phi), 0, this.radius * Math.sin(phi));
        dir.set(0, 1, 0);
    }
}
/**
 * 圆柱体内部
 */
class CylinderVolumeImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.length = config.length;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        const r = this.radius * Math.random();
        const len = this.length * Math.random();
        pos.set(r * Math.cos(phi), len, r * Math.sin(phi));
        dir.set(0, 1, 0);
    }
}
/**
 * 圆柱体表面
 */
class CylinderVolumeShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.length = config.length;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        const len = this.length * Math.random();
        pos.set(this.radius * Math.cos(phi), len, this.radius * Math.sin(phi));
        dir.set(0, 1, 0);
    }
}
/**
 * 圆锥底圆内部
 */
class ConeImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.angle = config.angle * Math.PI / 180;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        const r = this.radius * Math.random();
        pos.set(r * Math.cos(phi), 0, r * Math.sin(phi));
        dir.set(pos.x, pos.y + this.radius / Math.tan(this.angle), pos.z);
        dir.normalize();
    }
}
/**
 * 圆锥底圆周
 */
class ConeShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.angle = config.angle * Math.PI / 180;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        pos.set(this.radius * Math.cos(phi), 0, this.radius * Math.sin(phi));
        dir.set(pos.x, pos.y + this.radius / Math.tan(this.angle), pos.z);
        dir.normalize();
    }
}
/**
 * 圆锥体内部
 */
class ConeVolumeImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.length = config.length;
        this.angle = config.angle * Math.PI / 180;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        const offset = this.radius / Math.tan(this.angle);
        const y = offset + this.length * Math.random();
        const tmp = y * Math.tan(this.angle) * Math.random();
        pos.set(tmp * Math.cos(phi), y - offset, tmp * Math.sin(phi));
        dir.set(pos.x, pos.y + offset, pos.z);
        dir.normalize();
    }
}
/**
 * 圆锥面
 */
class ConeVolumeShellImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.radius = config.radius;
        this.length = config.length;
        this.angle = config.angle * Math.PI / 180;
        this.arc = config.arc * Math.PI / 180;
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        const phi = this.arc * Math.random();
        const offset = this.radius / Math.tan(this.angle);
        const y = offset + this.length * Math.random();
        const tmp = y * Math.tan(this.angle);
        pos.set(tmp * Math.cos(phi), y - offset, tmp * Math.sin(phi));
        dir.set(pos.x, pos.y + offset, pos.z);
        dir.normalize();
    }
}
class ShapeModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        if (!tmp1) {
            tmp1 = new three_1.THREE.Vector3();
            tmp2 = new three_1.THREE.Vector3();
        }
        this.alignToDirection = config.alignToDirection;
        this.randomDirectionAmount = config.randomDirectionAmount;
        this.sphericalDirectionAmount = config.sphericalDirectionAmount;
        this.shapeType = config.shapeType;
        switch (this.shapeType) {
            case PSShapeType.Box:
                this.impl = new BoxImpl(config);
                break;
            case PSShapeType.BoxEdge:
                this.impl = new BoxEdgeImpl(config);
                break;
            case PSShapeType.BoxShell:
                this.impl = new BoxShellImpl(config);
                break;
            case PSShapeType.Sphere:
                this.sphericalDirectionAmount = 1;
                this.impl = new SphereImpl(config);
                break;
            case PSShapeType.SphereShell:
                this.sphericalDirectionAmount = 1;
                this.impl = new SphereShellImpl(config);
                break;
            case PSShapeType.Hemisphere:
                this.sphericalDirectionAmount = 1;
                this.impl = new HemisphereImpl(config);
                break;
            case PSShapeType.HemisphereShell:
                this.sphericalDirectionAmount = 1;
                this.impl = new HemisphereShellImpl(config);
                break;
            case PSShapeType.Cone:
                if (Math.abs(config.angle) < 0.001) {
                    this.impl = new CylinderImpl(config);
                }
                else {
                    this.impl = new ConeImpl(config);
                }
                break;
            case PSShapeType.ConeShell:
                if (Math.abs(config.angle) < 0.001) {
                    this.impl = new CylinderShellImpl(config);
                }
                else {
                    this.impl = new ConeShellImpl(config);
                }
                break;
            case PSShapeType.ConeVolume:
                if (Math.abs(config.angle) < 0.001) {
                    this.impl = new CylinderVolumeImpl(config);
                }
                else {
                    this.impl = new ConeVolumeImpl(config);
                }
                break;
            case PSShapeType.ConeVolumeShell:
                if (Math.abs(config.angle) < 0.001) {
                    this.impl = new CylinderVolumeShellImpl(config);
                }
                else {
                    this.impl = new ConeVolumeShellImpl(config);
                }
                break;
            default:
                throw new Error('Not Implementation !');
        }
    }
    // tslint:disable-next-line:no-reserved-keywords
    get(pos, dir) {
        this.impl && this.impl.get(pos, dir);
        dir.set(0, 0, 1);
        if (this.randomDirectionAmount > 0) {
            tmp1.copy(dir);
            tmp2.set(Math.random(), Math.random(), Math.random());
            tmp2.normalize();
            dir.lerpVectors(tmp1, tmp2, this.randomDirectionAmount);
            dir.normalize();
        }
        if (this.sphericalDirectionAmount > 0) {
            tmp1.copy(dir);
            tmp2.copy(pos);
            tmp2.normalize();
            dir.lerpVectors(tmp1, tmp2, this.sphericalDirectionAmount);
            dir.normalize();
        }
    }
}
exports.ShapeModule = ShapeModule;
});
