_$define("pi/spine/AssetManager", function (require, exports, module){
/******************************************************************************
 * Spine Runtimes Software License v2.5
 *
 * Copyright (c) 2013-2016, Esoteric Software
 * All rights reserved.
 *
 * You are granted a perpetual, non-exclusive, non-sublicensable, and
 * non-transferable license to use, install, execute, and perform the Spine
 * Runtimes software and derivative works solely for personal or internal
 * use. Without the written permission of Esoteric Software (see Section 2 of
 * the Spine Software License Agreement), you may not (a) modify, translate,
 * adapt, or develop new applications using the Spine Runtimes or otherwise
 * create derivative works or improvements of the Spine Runtimes or (b) remove,
 * delete, alter, or obscure any trademarks or any copyright, trademark, patent,
 * or other intellectual property or proprietary rights notices on or in the
 * Software, including any copy thereof. Redistributions in binary or source
 * form must include this license and terms.
 *
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS INTERRUPTION, OR LOSS OF
 * USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
var spine;
(function (spine) {
    class AssetManager {
        constructor(textureLoader, pathPrefix = "") {
            this.assets = {};
            this.errors = {};
            this.toLoad = 0;
            this.loaded = 0;
            this.textureLoader = textureLoader;
            this.pathPrefix = pathPrefix;
        }
        static downloadText(url, success, error) {
            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.onload = () => {
                if (request.status == 200) {
                    success(request.responseText);
                }
                else {
                    error(request.status, request.responseText);
                }
            };
            request.onerror = () => {
                error(request.status, request.responseText);
            };
            request.send();
        }
        static downloadBinary(url, success, error) {
            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = () => {
                if (request.status == 200) {
                    success(new Uint8Array(request.response));
                }
                else {
                    error(request.status, request.responseText);
                }
            };
            request.onerror = () => {
                error(request.status, request.responseText);
            };
            request.send();
        }
        loadText(path, success = null, error = null) {
            path = this.pathPrefix + path;
            this.toLoad++;
            AssetManager.downloadText(path, (data) => {
                this.assets[path] = data;
                if (success)
                    success(path, data);
                this.toLoad--;
                this.loaded++;
            }, (state, responseText) => {
                this.errors[path] = `Couldn't load text ${path}: status ${status}, ${responseText}`;
                if (error)
                    error(path, `Couldn't load text ${path}: status ${status}, ${responseText}`);
                this.toLoad--;
                this.loaded++;
            });
        }
        loadTexture(path, success = null, error = null) {
            path = this.pathPrefix + path;
            this.toLoad++;
            let img = new Image();
            img.decoding = "async";
            img.crossOrigin = "anonymous";
            img.onload = (ev) => {
                let texture = this.textureLoader(img);
                this.assets[path] = texture;
                this.toLoad--;
                this.loaded++;
                if (success)
                    success(path, img);
            };
            img.onerror = (ev) => {
                this.errors[path] = `Couldn't load image ${path}`;
                this.toLoad--;
                this.loaded++;
                if (error)
                    error(path, `Couldn't load image ${path}`);
            };
            img.src = path;
        }
        loadTextureData(path, data, success = null, error = null) {
            path = this.pathPrefix + path;
            this.toLoad++;
            let img = new Image();
            img.decoding = "async";
            img.onload = (ev) => {
                let texture = this.textureLoader(img);
                this.assets[path] = texture;
                this.toLoad--;
                this.loaded++;
                if (success)
                    success(path, img);
            };
            img.onerror = (ev) => {
                this.errors[path] = `Couldn't load image ${path}`;
                this.toLoad--;
                this.loaded++;
                if (error)
                    error(path, `Couldn't load image ${path}`);
            };
            img.src = data;
        }
        loadTextureAtlas(path, success = null, error = null) {
            let parent = path.lastIndexOf("/") >= 0 ? path.substring(0, path.lastIndexOf("/")) : "";
            path = this.pathPrefix + path;
            this.toLoad++;
            AssetManager.downloadText(path, (atlasData) => {
                var pagesLoaded = { count: 0 };
                var atlasPages = new Array();
                try {
                    let atlas = new spine.TextureAtlas(atlasData, (path) => {
                        atlasPages.push(parent + "/" + path);
                        let image = document.createElement("img");
                        image.width = 16;
                        image.height = 16;
                        return new spine.FakeTexture(image);
                    });
                }
                catch (e) {
                    let ex = e;
                    this.errors[path] = `Couldn't load texture atlas ${path}: ${ex.message}`;
                    if (error)
                        error(path, `Couldn't load texture atlas ${path}: ${ex.message}`);
                    this.toLoad--;
                    this.loaded++;
                    return;
                }
                for (let atlasPage of atlasPages) {
                    let pageLoadError = false;
                    this.loadTexture(atlasPage, (imagePath, image) => {
                        pagesLoaded.count++;
                        if (pagesLoaded.count == atlasPages.length) {
                            if (!pageLoadError) {
                                try {
                                    let atlas = new spine.TextureAtlas(atlasData, (path) => {
                                        return this.get(parent + "/" + path);
                                    });
                                    this.assets[path] = atlas;
                                    if (success)
                                        success(path, atlas);
                                    this.toLoad--;
                                    this.loaded++;
                                }
                                catch (e) {
                                    let ex = e;
                                    this.errors[path] = `Couldn't load texture atlas ${path}: ${ex.message}`;
                                    if (error)
                                        error(path, `Couldn't load texture atlas ${path}: ${ex.message}`);
                                    this.toLoad--;
                                    this.loaded++;
                                }
                            }
                            else {
                                this.errors[path] = `Couldn't load texture atlas page ${imagePath}} of atlas ${path}`;
                                if (error)
                                    error(path, `Couldn't load texture atlas page ${imagePath} of atlas ${path}`);
                                this.toLoad--;
                                this.loaded++;
                            }
                        }
                    }, (imagePath, errorMessage) => {
                        pageLoadError = true;
                        pagesLoaded.count++;
                        if (pagesLoaded.count == atlasPages.length) {
                            this.errors[path] = `Couldn't load texture atlas page ${imagePath}} of atlas ${path}`;
                            if (error)
                                error(path, `Couldn't load texture atlas page ${imagePath} of atlas ${path}`);
                            this.toLoad--;
                            this.loaded++;
                        }
                    });
                }
            }, (state, responseText) => {
                this.errors[path] = `Couldn't load texture atlas ${path}: status ${status}, ${responseText}`;
                if (error)
                    error(path, `Couldn't load texture atlas ${path}: status ${status}, ${responseText}`);
                this.toLoad--;
                this.loaded++;
            });
        }
        get(path) {
            path = this.pathPrefix + path;
            return this.assets[path];
        }
        remove(path) {
            path = this.pathPrefix + path;
            let asset = this.assets[path];
            if (asset.dispose)
                asset.dispose();
            this.assets[path] = null;
        }
        removeAll() {
            for (let key in this.assets) {
                let asset = this.assets[key];
                if (asset.dispose)
                    asset.dispose();
            }
            this.assets = {};
        }
        isLoadingComplete() {
            return this.toLoad == 0;
        }
        getToLoad() {
            return this.toLoad;
        }
        getLoaded() {
            return this.loaded;
        }
        dispose() {
            this.removeAll();
        }
        hasErrors() {
            return Object.keys(this.errors).length > 0;
        }
        getErrors() {
            return this.errors;
        }
    }
    spine.AssetManager = AssetManager;
})(spine || (spine = {}));
});
