_$define("pi/render3d/drc_parser", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drc_decoder_1 = require("../polyfill/drc_decoder");
const three_1 = require("../render3d/three");
let DecoderModule;
const decoderType = {};
exports.decodeDrc = (rawBuffer, attributeIdMap, callback, dracoDecoderType) => {
    attributeIdMap = attributeIdMap || {};
    dracoDecoderType = dracoDecoderType ? dracoDecoderType : decoderType;
    // tslint:disable-next-line:no-invalid-this
    getDecoder(this, dracoDecoderType, (dracoDecoder) => { decodeDrcInternal(rawBuffer, attributeIdMap, dracoDecoder, callback); });
};
const decodeDrcInternal = (rawBuffer, attributeIdMap, dracoDecoder, callback) => {
    const buffer = new dracoDecoder.DecoderBuffer();
    buffer.Init(new Int8Array(rawBuffer), rawBuffer.byteLength);
    const decoder = new dracoDecoder.Decoder();
    const geometryType = decoder.GetEncodedGeometryType(buffer);
    if (geometryType !== dracoDecoder.TRIANGULAR_MESH) {
        throw new Error(`drc_loader: 类型不支持`);
    }
    callback(convertDracoGeometryTo3JS(dracoDecoder, decoder, geometryType, buffer, attributeIdMap));
};
const addAttributeToGeometry = (geometry, name, attribute, attributeData, numPoints) => {
    if (attribute.ptr === 0) {
        throw new Error(`THREE.DRACOLoader: No attribute ${name}`);
    }
    const numComponents = attribute.num_components();
    const numValues = numPoints * numComponents;
    let buffer;
    buffer = new Float32Array(numValues);
    if (name === 'skinIndex') {
        for (let i = 0; i < numValues; i++) {
            buffer[i] = Math.round(attributeData.GetValue(i)); // skinIndex应该是整数
        }
    }
    else {
        for (let i = 0; i < numValues; i++) {
            buffer[i] = attributeData.GetValue(i);
        }
    }
    geometry.addAttribute(name, new three_1.THREE.BufferAttribute(buffer, numComponents));
};
const convertDracoGeometryTo3JS = (dracoDecoder, decoder, geometryType, buffer, attributeIdMap) => {
    // tslint:disable-next-line:variable-name
    const start_time = performance.now();
    const dracoGeometry = new dracoDecoder.Mesh();
    const decodingStatus = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    if (!decodingStatus.ok() || dracoGeometry.ptr === 0) {
        dracoDecoder.destroy(decoder);
        dracoDecoder.destroy(dracoGeometry);
        throw new Error(`THREE.DRACOLoader: Decoding failed: ${decodingStatus.error_msg()}`);
    }
    // tslint:disable-next-line:variable-name
    const decode_end = performance.now();
    dracoDecoder.destroy(buffer);
    const numFaces = dracoGeometry.num_faces();
    const numPoints = dracoGeometry.num_points();
    let attributeData;
    let attribute;
    const geometry = new three_1.THREE.BufferGeometry();
    for (const name in attributeIdMap) {
        attribute = decoder.GetAttribute(dracoGeometry, attributeIdMap[name]);
        attributeData = new dracoDecoder.DracoFloat32Array();
        decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);
        addAttributeToGeometry(geometry, name, attribute, attributeData, numPoints);
        dracoDecoder.destroy(attributeData);
    }
    const numIndices = numFaces * 3;
    let indexBuffer;
    let ia;
    let firstIndex;
    indexBuffer = new Uint32Array(numIndices);
    ia = new dracoDecoder.DracoInt32Array();
    for (let i = 0; i < numFaces; ++i) {
        decoder.GetFaceFromMesh(dracoGeometry, i, ia);
        firstIndex = i * 3;
        indexBuffer[firstIndex] = ia.GetValue(0);
        indexBuffer[firstIndex + 1] = ia.GetValue(1);
        indexBuffer[firstIndex + 2] = ia.GetValue(2);
    }
    dracoDecoder.destroy(ia);
    if (numIndices < 65536) {
        const temp = indexBuffer;
        indexBuffer = new Uint16Array(temp.length);
        for (let i = 0; i < temp.length; i++) {
            indexBuffer[i] = temp[i];
        }
    }
    geometry.setIndex(new three_1.THREE.BufferAttribute(indexBuffer, 1));
    dracoDecoder.destroy(decoder);
    dracoDecoder.destroy(dracoGeometry);
    console.log(`Decode time: ${decode_end - start_time}`);
    console.log(`Import time: ${performance.now() - decode_end}`);
    return geometry;
};
const getDecoder = (() => {
    let decoder;
    let decoderCreationCalled = false;
    return (dracoDecoder, dracoDecoderType, loadCallback) => {
        if (typeof decoder !== 'undefined') {
            // Module already initialized.
            if (typeof loadCallback !== 'undefined') {
                loadCallback(decoder);
            }
        }
        else {
            decoderCreationCalled = true;
            // tslint:disable-next-line:no-reserved-keywords
            dracoDecoderType.onModuleLoaded = (module) => {
                decoder = module;
                loadCallback(decoder);
            };
            DecoderModule = drc_decoder_1.CreateDecoderModule(dracoDecoderType);
        }
    };
})();
});
