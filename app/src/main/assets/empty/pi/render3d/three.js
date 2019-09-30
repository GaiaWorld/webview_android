_$define("pi/render3d/three", function (require, exports, module) {
	// File:../dev/three/Three.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	var THREE = {
		REVISION: '76'
	};

	if (Number.EPSILON === undefined) {

		Number.EPSILON = Math.pow(2, -52);

	}

	//

	if (Math.sign === undefined) {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

		Math.sign = function (x) {

			return (x < 0) ? -1 : (x > 0) ? 1 : +x;

		};

	}

	if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {

		// Missing in IE9-11.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

		Object.defineProperty(Function.prototype, 'name', {

			get: function () {

				return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];

			}

		});

	}

	if (Object.assign === undefined) {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

		Object.defineProperty(Object, 'assign', {

			writable: true,
			configurable: true,

			value: function (target) {

				'use strict';

				if (target === undefined || target === null) {

					throw new TypeError("Cannot convert first argument to object");

				}

				var to = Object(target);

				for (var i = 1, n = arguments.length; i !== n; ++i) {

					var nextSource = arguments[i];

					if (nextSource === undefined || nextSource === null) continue;

					nextSource = Object(nextSource);

					var keysArray = Object.keys(nextSource);

					for (var nextIndex = 0, len = keysArray.length; nextIndex !== len; ++nextIndex) {

						var nextKey = keysArray[nextIndex];
						var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

						if (desc !== undefined && desc.enumerable) {

							to[nextKey] = nextSource[nextKey];

						}

					}

				}

				return to;

			}

		});

	}

	// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

	THREE.MOUSE = {
		LEFT: 0,
		MIDDLE: 1,
		RIGHT: 2
	};

	// GL STATE CONSTANTS

	THREE.CullFaceNone = 0;
	THREE.CullFaceBack = 1;
	THREE.CullFaceFront = 2;
	THREE.CullFaceFrontBack = 3;

	THREE.FrontFaceDirectionCW = 0;
	THREE.FrontFaceDirectionCCW = 1;

	// SHADOWING TYPES

	THREE.BasicShadowMap = 0;
	THREE.PCFShadowMap = 1;
	THREE.PCFSoftShadowMap = 2;

	// MATERIAL CONSTANTS

	// side

	THREE.FrontSide = 0;
	THREE.BackSide = 1;
	THREE.DoubleSide = 2;

	// shading

	THREE.FlatShading = 1;
	THREE.SmoothShading = 2;

	// colors

	THREE.NoColors = 0;
	THREE.FaceColors = 1;
	THREE.VertexColors = 2;

	// blending modes

	THREE.NoBlending = 0; // 不混合，(1,1,1) * src.rgb + (0, 0, 0) * dst.rgb
	THREE.NormalBlending = 1; // 混合，(1,1,1) * src.rgb + (0, 0, 0) * dst.rgb
	THREE.AdditiveBlending = 2; // 混合，srcFactor * src.rgb + dstFactor * dst.rgb
	THREE.SubtractiveBlending = 3; // 混合，srcFactor * src.rgb - dstFactor * dst.rgb
	THREE.MultiplyBlending = 4; // 混合，srcFactor * src.rgb * dstFactor * dst.rgb
	THREE.CustomBlending = 5;

	// custom blending equations
	// (numbers start from 100 not to clash with other
	// mappings to OpenGL constants defined in Texture.js)

	THREE.AddEquation = 100;
	THREE.SubtractEquation = 101;
	THREE.ReverseSubtractEquation = 102;
	THREE.MinEquation = 103;
	THREE.MaxEquation = 104;

	// custom blending destination factors

	THREE.ZeroFactor = 200; // (0, 0, 0) 
	THREE.OneFactor = 201; // (1, 1, 1)
	THREE.SrcColorFactor = 202; // (src.r,
	THREE.OneMinusSrcColorFactor = 203; // 1 - src.rgb
	THREE.SrcAlphaFactor = 204; // src.alpha
	THREE.OneMinusSrcAlphaFactor = 205; // 1 - src.alpha
	THREE.DstAlphaFactor = 206; // dst.rgb
	THREE.OneMinusDstAlphaFactor = 207; // 1 - dst.rgb

	// custom blending source factors

	//THREE.ZeroFactor = 200;
	//THREE.OneFactor = 201;
	//THREE.SrcAlphaFactor = 204;
	//THREE.OneMinusSrcAlphaFactor = 205;
	//THREE.DstAlphaFactor = 206;
	//THREE.OneMinusDstAlphaFactor = 207;
	THREE.DstColorFactor = 208;
	THREE.OneMinusDstColorFactor = 209;
	THREE.SrcAlphaSaturateFactor = 210;

	// depth modes

	THREE.NeverDepth = 0;
	THREE.AlwaysDepth = 1;
	THREE.LessDepth = 2;
	THREE.LessEqualDepth = 3;
	THREE.EqualDepth = 4;
	THREE.GreaterEqualDepth = 5;
	THREE.GreaterDepth = 6;
	THREE.NotEqualDepth = 7;


	// TEXTURE CONSTANTS

	THREE.MultiplyOperation = 0;
	THREE.MixOperation = 1;
	THREE.AddOperation = 2;

	// Tone Mapping modes

	THREE.NoToneMapping = 0; // do not do any tone mapping, not even exposure (required for special purpose passes.)
	THREE.LinearToneMapping = 1; // only apply exposure.
	THREE.ReinhardToneMapping = 2;
	THREE.Uncharted2ToneMapping = 3; // John Hable
	THREE.CineonToneMapping = 4; // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson

	// Mapping modes

	THREE.UVMapping = 300;

	THREE.CubeReflectionMapping = 301;
	THREE.CubeRefractionMapping = 302;

	THREE.EquirectangularReflectionMapping = 303;
	THREE.EquirectangularRefractionMapping = 304;

	THREE.SphericalReflectionMapping = 305;
	THREE.CubeUVReflectionMapping = 306;
	THREE.CubeUVRefractionMapping = 307;

	// Wrapping modes

	THREE.RepeatWrapping = 1000;
	THREE.ClampToEdgeWrapping = 1001;
	THREE.MirroredRepeatWrapping = 1002;

	// Filters

	THREE.NearestFilter = 1003;
	THREE.NearestMipMapNearestFilter = 1004;
	THREE.NearestMipMapLinearFilter = 1005;
	THREE.LinearFilter = 1006;
	THREE.LinearMipMapNearestFilter = 1007;
	THREE.LinearMipMapLinearFilter = 1008;

	// Data types

	THREE.UnsignedByteType = 1009;
	THREE.ByteType = 1010;
	THREE.ShortType = 1011;
	THREE.UnsignedShortType = 1012;
	THREE.IntType = 1013;
	THREE.UnsignedIntType = 1014;
	THREE.FloatType = 1015;
	THREE.HalfFloatType = 1025;

	// Pixel types

	//THREE.UnsignedByteType = 1009;
	THREE.UnsignedShort4444Type = 1016;
	THREE.UnsignedShort5551Type = 1017;
	THREE.UnsignedShort565Type = 1018;

	// Pixel formats

	THREE.AlphaFormat = 1019;
	THREE.RGBFormat = 1020;
	THREE.RGBAFormat = 1021;
	THREE.LuminanceFormat = 1022;
	THREE.LuminanceAlphaFormat = 1023;
	// THREE.RGBEFormat handled as THREE.RGBAFormat in shaders
	THREE.RGBEFormat = THREE.RGBAFormat; //1024;
	THREE.DepthFormat = 1026;

	// DDS / ST3C Compressed texture formats

	THREE.RGB_S3TC_DXT1_Format = 2001;
	THREE.RGBA_S3TC_DXT1_Format = 2002;
	THREE.RGBA_S3TC_DXT3_Format = 2003;
	THREE.RGBA_S3TC_DXT5_Format = 2004;


	// PVRTC compressed texture formats

	THREE.RGB_PVRTC_4BPPV1_Format = 2100;
	THREE.RGB_PVRTC_2BPPV1_Format = 2101;
	THREE.RGBA_PVRTC_4BPPV1_Format = 2102;
	THREE.RGBA_PVRTC_2BPPV1_Format = 2103;

	// ETC compressed texture formats

	THREE.RGB_ETC1_Format = 2151;

	// Loop styles for AnimationAction

	THREE.LoopOnce = 2200;
	THREE.LoopRepeat = 2201;
	THREE.LoopPingPong = 2202;

	// Interpolation

	THREE.InterpolateDiscrete = 2300;
	THREE.InterpolateLinear = 2301;
	THREE.InterpolateSmooth = 2302;

	// Interpolant ending modes

	THREE.ZeroCurvatureEnding = 2400;
	THREE.ZeroSlopeEnding = 2401;
	THREE.WrapAroundEnding = 2402;

	// Triangle Draw modes

	THREE.TrianglesDrawMode = 0;
	THREE.TriangleStripDrawMode = 1;
	THREE.TriangleFanDrawMode = 2;

	// Texture Encodings

	THREE.LinearEncoding = 3000; // No encoding at all.
	THREE.sRGBEncoding = 3001;
	THREE.GammaEncoding = 3007; // uses GAMMA_FACTOR, for backwards compatibility with WebGLRenderer.gammaInput/gammaOutput

	// The following Texture Encodings are for RGB-only (no alpha) HDR light emission sources.
	// These encodings should not specified as output encodings except in rare situations.
	THREE.RGBEEncoding = 3002; // AKA Radiance.
	THREE.LogLuvEncoding = 3003;
	THREE.RGBM7Encoding = 3004;
	THREE.RGBM16Encoding = 3005;
	THREE.RGBDEncoding = 3006; // MaxRange is 256.

	// Depth packing strategies

	THREE.BasicDepthPacking = 3200; // for writing to float textures for high precision or for visualizing results in RGB buffers
	THREE.RGBADepthPacking = 3201; // for packing into RGBA buffers.

	//字体渲染对齐方式
	THREE.TextAlignLeft = "left";
	THREE.TextAlignRight = "right";
	THREE.TextAlignCenter = "center";

	// File:../dev/three/math/Color.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Color = function (color) {

		if (arguments.length === 3) {

			return this.fromArray(arguments);

		}

		return this.set(color);

	};

	THREE.Color.prototype = {

		constructor: THREE.Color,

		r: 1,
		g: 1,
		b: 1,
		a: 1,

		set: function (value) {

			if (value instanceof THREE.Color) {

				this.copy(value);

			} else if (typeof value === 'number') {

				this.setHex(value);

			} else if (typeof value === 'string') {

				this.setStyle(value);

			}

			return this;

		},

		setScalar: function (scalar) {

			this.r = scalar;
			this.g = scalar;
			this.b = scalar;

		},

		setHex: function (hex) {

			hex = Math.floor(hex);

			this.r = (hex >> 16 & 255) / 255;
			this.g = (hex >> 8 & 255) / 255;
			this.b = (hex & 255) / 255;

			return this;

		},

		setRGB: function (r, g, b) {

			this.r = r;
			this.g = g;
			this.b = b;

			return this;

		},

		setRGBA: function (r, g, b, a) {

			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;

			return this;
		},


		setHSL: function () {

			function hue2rgb(p, q, t) {

				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
				return p;

			}

			return function (h, s, l) {

				// h,s,l ranges are in 0.0 - 1.0
				h = THREE.Math.euclideanModulo(h, 1);
				s = THREE.Math.clamp(s, 0, 1);
				l = THREE.Math.clamp(l, 0, 1);

				if (s === 0) {

					this.r = this.g = this.b = l;

				} else {

					var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
					var q = (2 * l) - p;

					this.r = hue2rgb(q, p, h + 1 / 3);
					this.g = hue2rgb(q, p, h);
					this.b = hue2rgb(q, p, h - 1 / 3);

				}

				return this;

			};

		}(),

		setStyle: function (style) {

			function handleAlpha(string) {

				if (string === undefined) return;

				if (parseFloat(string) < 1) {

					console.warn('THREE.Color: Alpha component of ' + style + ' will be ignored.');

				}

			}


			var m;

			if (m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(style)) {

				// rgb / hsl

				var color;
				var name = m[1];
				var components = m[2];

				switch (name) {

					case 'rgb':
					case 'rgba':

						if (color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(components)) {

							// rgb(255,0,0) rgba(255,0,0,0.5)
							this.r = Math.min(255, parseInt(color[1], 10)) / 255;
							this.g = Math.min(255, parseInt(color[2], 10)) / 255;
							this.b = Math.min(255, parseInt(color[3], 10)) / 255;

							handleAlpha(color[5]);

							return this;

						}

						if (color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(components)) {

							// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
							this.r = Math.min(100, parseInt(color[1], 10)) / 100;
							this.g = Math.min(100, parseInt(color[2], 10)) / 100;
							this.b = Math.min(100, parseInt(color[3], 10)) / 100;

							handleAlpha(color[5]);

							return this;

						}

						break;

					case 'hsl':
					case 'hsla':

						if (color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(components)) {

							// hsl(120,50%,50%) hsla(120,50%,50%,0.5)
							var h = parseFloat(color[1]) / 360;
							var s = parseInt(color[2], 10) / 100;
							var l = parseInt(color[3], 10) / 100;

							handleAlpha(color[5]);

							return this.setHSL(h, s, l);

						}

						break;

				}

			} else if (m = /^\#([A-Fa-f0-9]+)$/.exec(style)) {

				// hex color

				var hex = m[1];
				var size = hex.length;

				if (size === 3) {

					// #ff0
					this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
					this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
					this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;

					return this;

				} else if (size === 6) {

					// #ff0000
					this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255;
					this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255;
					this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255;

					return this;

				}

			}

			if (style && style.length > 0) {

				// color keywords
				var hex = THREE.ColorKeywords[style];

				if (hex !== undefined) {

					// red
					this.setHex(hex);

				} else {

					// unknown color
					console.warn('THREE.Color: Unknown color ' + style);

				}

			}

			return this;

		},

		clone: function () {

			var obj = new this.constructor(this.r, this.g, this.b);
			obj.a = this.a;
			return obj;
		},

		copy: function (color) {

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;
			this.a = color.a;
			return this;

		},

		copyGammaToLinear: function (color, gammaFactor) {

			if (gammaFactor === undefined) gammaFactor = 2.0;

			this.r = Math.pow(color.r, gammaFactor);
			this.g = Math.pow(color.g, gammaFactor);
			this.b = Math.pow(color.b, gammaFactor);

			return this;

		},

		copyLinearToGamma: function (color, gammaFactor) {

			if (gammaFactor === undefined) gammaFactor = 2.0;

			var safeInverse = (gammaFactor > 0) ? (1.0 / gammaFactor) : 1.0;

			this.r = Math.pow(color.r, safeInverse);
			this.g = Math.pow(color.g, safeInverse);
			this.b = Math.pow(color.b, safeInverse);

			return this;

		},

		convertGammaToLinear: function () {

			var r = this.r,
				g = this.g,
				b = this.b;

			this.r = r * r;
			this.g = g * g;
			this.b = b * b;

			return this;

		},

		convertLinearToGamma: function () {

			this.r = Math.sqrt(this.r);
			this.g = Math.sqrt(this.g);
			this.b = Math.sqrt(this.b);

			return this;

		},

		getHex: function () {

			return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0;

		},

		getHexString: function () {

			return ('000000' + this.getHex().toString(16)).slice(-6);

		},

		getHSL: function (optionalTarget) {

			// h,s,l ranges are in 0.0 - 1.0

			var hsl = optionalTarget || {
				h: 0,
				s: 0,
				l: 0
			};

			var r = this.r,
				g = this.g,
				b = this.b;

			var max = Math.max(r, g, b);
			var min = Math.min(r, g, b);

			var hue, saturation;
			var lightness = (min + max) / 2.0;

			if (min === max) {

				hue = 0;
				saturation = 0;

			} else {

				var delta = max - min;

				saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

				switch (max) {

					case r:
						hue = (g - b) / delta + (g < b ? 6 : 0);
						break;
					case g:
						hue = (b - r) / delta + 2;
						break;
					case b:
						hue = (r - g) / delta + 4;
						break;

				}

				hue /= 6;

			}

			hsl.h = hue;
			hsl.s = saturation;
			hsl.l = lightness;

			return hsl;

		},

		getStyle: function () {

			return 'rgb(' + ((this.r * 255) | 0) + ',' + ((this.g * 255) | 0) + ',' + ((this.b * 255) | 0) + ')';

		},

		offsetHSL: function (h, s, l) {

			var hsl = this.getHSL();

			hsl.h += h;
			hsl.s += s;
			hsl.l += l;

			this.setHSL(hsl.h, hsl.s, hsl.l);

			return this;

		},

		add: function (color) {

			this.r += color.r;
			this.g += color.g;
			this.b += color.b;

			return this;

		},

		addColors: function (color1, color2) {

			this.r = color1.r + color2.r;
			this.g = color1.g + color2.g;
			this.b = color1.b + color2.b;

			return this;

		},

		addScalar: function (s) {

			this.r += s;
			this.g += s;
			this.b += s;

			return this;

		},

		multiply: function (color) {

			this.r *= color.r;
			this.g *= color.g;
			this.b *= color.b;

			return this;

		},

		multiplyScalar: function (s) {

			this.r *= s;
			this.g *= s;
			this.b *= s;

			return this;

		},

		lerp: function (color, alpha) {

			this.r += (color.r - this.r) * alpha;
			this.g += (color.g - this.g) * alpha;
			this.b += (color.b - this.b) * alpha;

			return this;

		},

		equals: function (c) {

			return (c.r === this.r) && (c.g === this.g) && (c.b === this.b);

		},

		fromArray: function (array, offset) {

			if (offset === undefined) offset = 0;

			this.r = array[offset];
			this.g = array[offset + 1];
			this.b = array[offset + 2];

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this.r;
			array[offset + 1] = this.g;
			array[offset + 2] = this.b;

			return array;

		}

	};

	THREE.ColorKeywords = {
		'aliceblue': 0xF0F8FF,
		'antiquewhite': 0xFAEBD7,
		'aqua': 0x00FFFF,
		'aquamarine': 0x7FFFD4,
		'azure': 0xF0FFFF,
		'beige': 0xF5F5DC,
		'bisque': 0xFFE4C4,
		'black': 0x000000,
		'blanchedalmond': 0xFFEBCD,
		'blue': 0x0000FF,
		'blueviolet': 0x8A2BE2,
		'brown': 0xA52A2A,
		'burlywood': 0xDEB887,
		'cadetblue': 0x5F9EA0,
		'chartreuse': 0x7FFF00,
		'chocolate': 0xD2691E,
		'coral': 0xFF7F50,
		'cornflowerblue': 0x6495ED,
		'cornsilk': 0xFFF8DC,
		'crimson': 0xDC143C,
		'cyan': 0x00FFFF,
		'darkblue': 0x00008B,
		'darkcyan': 0x008B8B,
		'darkgoldenrod': 0xB8860B,
		'darkgray': 0xA9A9A9,
		'darkgreen': 0x006400,
		'darkgrey': 0xA9A9A9,
		'darkkhaki': 0xBDB76B,
		'darkmagenta': 0x8B008B,
		'darkolivegreen': 0x556B2F,
		'darkorange': 0xFF8C00,
		'darkorchid': 0x9932CC,
		'darkred': 0x8B0000,
		'darksalmon': 0xE9967A,
		'darkseagreen': 0x8FBC8F,
		'darkslateblue': 0x483D8B,
		'darkslategray': 0x2F4F4F,
		'darkslategrey': 0x2F4F4F,
		'darkturquoise': 0x00CED1,
		'darkviolet': 0x9400D3,
		'deeppink': 0xFF1493,
		'deepskyblue': 0x00BFFF,
		'dimgray': 0x696969,
		'dimgrey': 0x696969,
		'dodgerblue': 0x1E90FF,
		'firebrick': 0xB22222,
		'floralwhite': 0xFFFAF0,
		'forestgreen': 0x228B22,
		'fuchsia': 0xFF00FF,
		'gainsboro': 0xDCDCDC,
		'ghostwhite': 0xF8F8FF,
		'gold': 0xFFD700,
		'goldenrod': 0xDAA520,
		'gray': 0x808080,
		'green': 0x008000,
		'greenyellow': 0xADFF2F,
		'grey': 0x808080,
		'honeydew': 0xF0FFF0,
		'hotpink': 0xFF69B4,
		'indianred': 0xCD5C5C,
		'indigo': 0x4B0082,
		'ivory': 0xFFFFF0,
		'khaki': 0xF0E68C,
		'lavender': 0xE6E6FA,
		'lavenderblush': 0xFFF0F5,
		'lawngreen': 0x7CFC00,
		'lemonchiffon': 0xFFFACD,
		'lightblue': 0xADD8E6,
		'lightcoral': 0xF08080,
		'lightcyan': 0xE0FFFF,
		'lightgoldenrodyellow': 0xFAFAD2,
		'lightgray': 0xD3D3D3,
		'lightgreen': 0x90EE90,
		'lightgrey': 0xD3D3D3,
		'lightpink': 0xFFB6C1,
		'lightsalmon': 0xFFA07A,
		'lightseagreen': 0x20B2AA,
		'lightskyblue': 0x87CEFA,
		'lightslategray': 0x778899,
		'lightslategrey': 0x778899,
		'lightsteelblue': 0xB0C4DE,
		'lightyellow': 0xFFFFE0,
		'lime': 0x00FF00,
		'limegreen': 0x32CD32,
		'linen': 0xFAF0E6,
		'magenta': 0xFF00FF,
		'maroon': 0x800000,
		'mediumaquamarine': 0x66CDAA,
		'mediumblue': 0x0000CD,
		'mediumorchid': 0xBA55D3,
		'mediumpurple': 0x9370DB,
		'mediumseagreen': 0x3CB371,
		'mediumslateblue': 0x7B68EE,
		'mediumspringgreen': 0x00FA9A,
		'mediumturquoise': 0x48D1CC,
		'mediumvioletred': 0xC71585,
		'midnightblue': 0x191970,
		'mintcream': 0xF5FFFA,
		'mistyrose': 0xFFE4E1,
		'moccasin': 0xFFE4B5,
		'navajowhite': 0xFFDEAD,
		'navy': 0x000080,
		'oldlace': 0xFDF5E6,
		'olive': 0x808000,
		'olivedrab': 0x6B8E23,
		'orange': 0xFFA500,
		'orangered': 0xFF4500,
		'orchid': 0xDA70D6,
		'palegoldenrod': 0xEEE8AA,
		'palegreen': 0x98FB98,
		'paleturquoise': 0xAFEEEE,
		'palevioletred': 0xDB7093,
		'papayawhip': 0xFFEFD5,
		'peachpuff': 0xFFDAB9,
		'peru': 0xCD853F,
		'pink': 0xFFC0CB,
		'plum': 0xDDA0DD,
		'powderblue': 0xB0E0E6,
		'purple': 0x800080,
		'red': 0xFF0000,
		'rosybrown': 0xBC8F8F,
		'royalblue': 0x4169E1,
		'saddlebrown': 0x8B4513,
		'salmon': 0xFA8072,
		'sandybrown': 0xF4A460,
		'seagreen': 0x2E8B57,
		'seashell': 0xFFF5EE,
		'sienna': 0xA0522D,
		'silver': 0xC0C0C0,
		'skyblue': 0x87CEEB,
		'slateblue': 0x6A5ACD,
		'slategray': 0x708090,
		'slategrey': 0x708090,
		'snow': 0xFFFAFA,
		'springgreen': 0x00FF7F,
		'steelblue': 0x4682B4,
		'tan': 0xD2B48C,
		'teal': 0x008080,
		'thistle': 0xD8BFD8,
		'tomato': 0xFF6347,
		'turquoise': 0x40E0D0,
		'violet': 0xEE82EE,
		'wheat': 0xF5DEB3,
		'white': 0xFFFFFF,
		'whitesmoke': 0xF5F5F5,
		'yellow': 0xFFFF00,
		'yellowgreen': 0x9ACD32
	};

	// File:../dev/three/math/Quaternion.js

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author bhouston / http://clara.io
	 */

	THREE.Quaternion = function (x, y, z, w) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._w = (w !== undefined) ? w : 1;

	};

	THREE.Quaternion.prototype = {

		constructor: THREE.Quaternion,

		get x() {

			return this._x;

		},

		set x(value) {

			this._x = value;
			this.onChangeCallback();

		},

		get y() {

			return this._y;

		},

		set y(value) {

			this._y = value;
			this.onChangeCallback();

		},

		get z() {

			return this._z;

		},

		set z(value) {

			this._z = value;
			this.onChangeCallback();

		},

		get w() {

			return this._w;

		},

		set w(value) {

			this._w = value;
			this.onChangeCallback();

		},

		set: function (x, y, z, w) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

			this.onChangeCallback();

			return this;

		},

		clone: function () {

			return new this.constructor(this._x, this._y, this._z, this._w);

		},

		copy: function (quaternion) {

			this._x = quaternion.x;
			this._y = quaternion.y;
			this._z = quaternion.z;
			this._w = quaternion.w;

			this.onChangeCallback();

			return this;

		},

		setFromEuler: function (euler, update) {

			if (euler instanceof THREE.Euler === false) {

				throw new Error('THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.');

			}

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			var c1 = Math.cos(euler._x / 2);
			var c2 = Math.cos(euler._y / 2);
			var c3 = Math.cos(euler._z / 2);
			var s1 = Math.sin(euler._x / 2);
			var s2 = Math.sin(euler._y / 2);
			var s3 = Math.sin(euler._z / 2);

			var order = euler.order;

			if (order === 'XYZ') {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if (order === 'YXZ') {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			} else if (order === 'ZXY') {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if (order === 'ZYX') {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			} else if (order === 'YZX') {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if (order === 'XZY') {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			}

			if (update !== false) this.onChangeCallback();

			return this;

		},

		setFromAxisAngle: function (axis, angle) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

			// assumes axis is normalized

			var halfAngle = angle / 2,
				s = Math.sin(halfAngle);

			this._x = axis.x * s;
			this._y = axis.y * s;
			this._z = axis.z * s;
			this._w = Math.cos(halfAngle);

			this.onChangeCallback();

			return this;

		},

		setFromRotationMatrix: function (m) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var te = m.elements,

				m11 = te[0],
				m12 = te[4],
				m13 = te[8],
				m21 = te[1],
				m22 = te[5],
				m23 = te[9],
				m31 = te[2],
				m32 = te[6],
				m33 = te[10],

				trace = m11 + m22 + m33,
				s;

			if (trace > 0) {

				s = 0.5 / Math.sqrt(trace + 1.0);

				this._w = 0.25 / s;
				this._x = (m32 - m23) * s;
				this._y = (m13 - m31) * s;
				this._z = (m21 - m12) * s;

			} else if (m11 > m22 && m11 > m33) {

				s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

				this._w = (m32 - m23) / s;
				this._x = 0.25 * s;
				this._y = (m12 + m21) / s;
				this._z = (m13 + m31) / s;

			} else if (m22 > m33) {

				s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

				this._w = (m13 - m31) / s;
				this._x = (m12 + m21) / s;
				this._y = 0.25 * s;
				this._z = (m23 + m32) / s;

			} else {

				s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

				this._w = (m21 - m12) / s;
				this._x = (m13 + m31) / s;
				this._y = (m23 + m32) / s;
				this._z = 0.25 * s;

			}

			this.onChangeCallback();

			return this;

		},

		setFromUnitVectors: function () {

			// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

			// assumes direction vectors vFrom and vTo are normalized

			var v1, r;

			var EPS = 0.000001;

			return function (vFrom, vTo) {

				if (v1 === undefined) v1 = new THREE.Vector3();

				r = vFrom.dot(vTo) + 1;

				if (r < EPS) {

					r = 0;

					if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

						v1.set(-vFrom.y, vFrom.x, 0);

					} else {

						v1.set(0, -vFrom.z, vFrom.y);

					}

				} else {

					v1.crossVectors(vFrom, vTo);

				}

				this._x = v1.x;
				this._y = v1.y;
				this._z = v1.z;
				this._w = r;

				this.normalize();

				return this;

			};

		}(),

		inverse: function () {

			this.conjugate().normalize();

			return this;

		},

		conjugate: function () {

			this._x *= -1;
			this._y *= -1;
			this._z *= -1;

			this.onChangeCallback();

			return this;

		},

		dot: function (v) {

			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

		},

		lengthSq: function () {

			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

		},

		length: function () {

			return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);

		},

		normalize: function () {

			var l = this.length();

			if (l === 0) {

				this._x = 0;
				this._y = 0;
				this._z = 0;
				this._w = 1;

			} else {

				l = 1 / l;

				this._x = this._x * l;
				this._y = this._y * l;
				this._z = this._z * l;
				this._w = this._w * l;

			}

			this.onChangeCallback();

			return this;

		},

		multiply: function (q, p) {

			if (p !== undefined) {

				console.warn('THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
				return this.multiplyQuaternions(q, p);

			}

			return this.multiplyQuaternions(this, q);

		},

		multiplyQuaternions: function (a, b) {

			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

			var qax = a._x,
				qay = a._y,
				qaz = a._z,
				qaw = a._w;
			var qbx = b._x,
				qby = b._y,
				qbz = b._z,
				qbw = b._w;

			this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			this.onChangeCallback();

			return this;

		},

		slerp: function (qb, t) {

			if (t === 0) return this;
			if (t === 1) return this.copy(qb);

			var x = this._x,
				y = this._y,
				z = this._z,
				w = this._w;

			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

			var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

			if (cosHalfTheta < 0) {

				this._w = -qb._w;
				this._x = -qb._x;
				this._y = -qb._y;
				this._z = -qb._z;

				cosHalfTheta = -cosHalfTheta;

			} else {

				this.copy(qb);

			}

			if (cosHalfTheta >= 1.0) {

				this._w = w;
				this._x = x;
				this._y = y;
				this._z = z;

				return this;

			}

			var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

			if (Math.abs(sinHalfTheta) < 0.001) {

				this._w = 0.5 * (w + this._w);
				this._x = 0.5 * (x + this._x);
				this._y = 0.5 * (y + this._y);
				this._z = 0.5 * (z + this._z);

				return this;

			}

			var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
			var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
				ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

			this._w = (w * ratioA + this._w * ratioB);
			this._x = (x * ratioA + this._x * ratioB);
			this._y = (y * ratioA + this._y * ratioB);
			this._z = (z * ratioA + this._z * ratioB);

			this.onChangeCallback();

			return this;

		},

		equals: function (quaternion) {

			return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);

		},

		fromArray: function (array, offset) {

			if (offset === undefined) offset = 0;

			this._x = array[offset];
			this._y = array[offset + 1];
			this._z = array[offset + 2];
			this._w = array[offset + 3];

			this.onChangeCallback();

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this._x;
			array[offset + 1] = this._y;
			array[offset + 2] = this._z;
			array[offset + 3] = this._w;

			return array;

		},

		onChange: function (callback) {

			this.onChangeCallback = callback;

			return this;

		},

		onChangeCallback: function () {}

	};

	Object.assign(THREE.Quaternion, {

		slerp: function (qa, qb, qm, t) {

			return qm.copy(qa).slerp(qb, t);

		},

		slerpFlat: function (
			dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

			// fuzz-free, array-based Quaternion SLERP operation

			var x0 = src0[srcOffset0 + 0],
				y0 = src0[srcOffset0 + 1],
				z0 = src0[srcOffset0 + 2],
				w0 = src0[srcOffset0 + 3],

				x1 = src1[srcOffset1 + 0],
				y1 = src1[srcOffset1 + 1],
				z1 = src1[srcOffset1 + 2],
				w1 = src1[srcOffset1 + 3];

			if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

				var s = 1 - t,

					cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

					dir = (cos >= 0 ? 1 : -1),
					sqrSin = 1 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems:
				if (sqrSin > Number.EPSILON) {

					var sin = Math.sqrt(sqrSin),
						len = Math.atan2(sin, cos * dir);

					s = Math.sin(s * len) / sin;
					t = Math.sin(t * len) / sin;

				}

				var tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case we just did a lerp:
				if (s === 1 - t) {

					var f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[dstOffset] = x0;
			dst[dstOffset + 1] = y0;
			dst[dstOffset + 2] = z0;
			dst[dstOffset + 3] = w0;

		}

	});

	// File:../dev/three/math/Vector2.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author philogb / http://blog.thejit.org/
	 * @author egraether / http://egraether.com/
	 * @author zz85 / http://www.lab4games.net/zz85/blog
	 */

	THREE.Vector2 = function (x, y) {

		this.x = x || 0;
		this.y = y || 0;

	};

	THREE.Vector2.prototype = {

		constructor: THREE.Vector2,

		get width() {

			return this.x;

		},

		set width(value) {

			this.x = value;

		},

		get height() {

			return this.y;

		},

		set height(value) {

			this.y = value;

		},

		set: function (x, y) {

			this.x = x;
			this.y = y;

			return this;

		},

		setScalar: function (scalar) {

			this.x = scalar;
			this.y = scalar;

			return this;

		},

		setX: function (x) {

			this.x = x;

			return this;

		},

		setY: function (y) {

			this.y = y;

			return this;

		},

		setComponent: function (index, value) {

			switch (index) {

				case 0:
					this.x = value;
					break;
				case 1:
					this.y = value;
					break;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		getComponent: function (index) {

			switch (index) {

				case 0:
					return this.x;
				case 1:
					return this.y;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		clone: function () {

			return new this.constructor(this.x, this.y);

		},

		copy: function (v) {

			this.x = v.x;
			this.y = v.y;

			return this;

		},

		add: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
				return this.addVectors(v, w);

			}

			this.x += v.x;
			this.y += v.y;

			return this;

		},

		addScalar: function (s) {

			this.x += s;
			this.y += s;

			return this;

		},

		addVectors: function (a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		},

		addScaledVector: function (v, s) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		},

		sub: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
				return this.subVectors(v, w);

			}

			this.x -= v.x;
			this.y -= v.y;

			return this;

		},

		subScalar: function (s) {

			this.x -= s;
			this.y -= s;

			return this;

		},

		subVectors: function (a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		},

		multiply: function (v) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		},

		multiplyScalar: function (scalar) {

			if (isFinite(scalar)) {

				this.x *= scalar;
				this.y *= scalar;

			} else {

				this.x = 0;
				this.y = 0;

			}

			return this;

		},

		divide: function (v) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		},

		divideScalar: function (scalar) {

			return this.multiplyScalar(1 / scalar);

		},

		min: function (v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);

			return this;

		},

		max: function (v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);

			return this;

		},

		clamp: function (min, max) {

			// This function assumes min < max, if this assumption isn't true it will not operate correctly

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));

			return this;

		},

		clampScalar: function () {

			var min, max;

			return function clampScalar(minVal, maxVal) {

				if (min === undefined) {

					min = new THREE.Vector2();
					max = new THREE.Vector2();

				}

				min.set(minVal, minVal);
				max.set(maxVal, maxVal);

				return this.clamp(min, max);

			};

		}(),

		clampLength: function (min, max) {

			var length = this.length();

			this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);

			return this;

		},

		floor: function () {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;

		},

		ceil: function () {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;

		},

		round: function () {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			return this;

		},

		roundToZero: function () {

			this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
			this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);

			return this;

		},

		negate: function () {

			this.x = -this.x;
			this.y = -this.y;

			return this;

		},

		dot: function (v) {

			return this.x * v.x + this.y * v.y;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y;

		},

		length: function () {

			return Math.sqrt(this.x * this.x + this.y * this.y);

		},

		lengthManhattan: function () {

			return Math.abs(this.x) + Math.abs(this.y);

		},

		normalize: function () {

			return this.divideScalar(this.length());

		},

		angle: function () {

			// computes the angle in radians with respect to the positive x-axis

			var angle = Math.atan2(this.y, this.x);

			if (angle < 0) angle += 2 * Math.PI;

			return angle;

		},

		distanceTo: function (v) {

			return Math.sqrt(this.distanceToSquared(v));

		},

		distanceToSquared: function (v) {

			var dx = this.x - v.x,
				dy = this.y - v.y;
			return dx * dx + dy * dy;

		},

		setLength: function (length) {

			return this.multiplyScalar(length / this.length());

		},

		lerp: function (v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;

			return this;

		},

		lerpVectors: function (v1, v2, alpha) {

			this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

			return this;

		},

		equals: function (v) {

			return ((v.x === this.x) && (v.y === this.y));

		},

		fromArray: function (array, offset) {

			if (offset === undefined) offset = 0;

			this.x = array[offset];
			this.y = array[offset + 1];

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this.x;
			array[offset + 1] = this.y;

			return array;

		},

		fromAttribute: function (attribute, index, offset) {

			if (offset === undefined) offset = 0;

			index = index * attribute.itemSize + offset;

			this.x = attribute.array[index];
			this.y = attribute.array[index + 1];

			return this;

		},

		rotateAround: function (center, angle) {

			var c = Math.cos(angle),
				s = Math.sin(angle);

			var x = this.x - center.x;
			var y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

	};

	// File:../dev/three/math/Vector3.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author *kile / http://kile.stravaganza.org/
	 * @author philogb / http://blog.thejit.org/
	 * @author mikael emtinger / http://gomo.se/
	 * @author egraether / http://egraether.com/
	 * @author WestLangley / http://github.com/WestLangley
	 */

	THREE.Vector3 = function (x, y, z) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;

	};

	THREE.Vector3.prototype = {

		constructor: THREE.Vector3,

		get x() {
			return this._x;
		},

		set x(value) {
			this._x = value;
			this.onChangeCallback();
		},
		get y() {
			return this._y;
		},

		set y(value) {
			this._y = value;
			this.onChangeCallback();
		},
		get z() {
			return this._z;
		},

		set z(value) {
			this._z = value;
			this.onChangeCallback();
		},

		set: function (x, y, z) {

			this._x = x;
			this._y = y;
			this._z = z;
			this.onChangeCallback();
			return this;

		},

		setScalar: function (scalar) {

			this._x = scalar;
			this._y = scalar;
			this._z = scalar;
			this.onChangeCallback();
			return this;

		},

		setX: function (x) {

			this._x = x;

			return this;

		},

		setY: function (y) {

			this._y = y;
			this.onChangeCallback();
			return this;

		},

		setZ: function (z) {

			this._z = z;

			return this;

		},

		setComponent: function (index, value) {

			switch (index) {

				case 0:
					this._x = value;
					break;
				case 1:
					this._y = value;
					break;
				case 2:
					this._z = value;
					break;
				default:
					throw new Error('index is out of range: ' + index);

			}
			this.onChangeCallback();
		},

		getComponent: function (index) {

			switch (index) {

				case 0:
					return this._x;
				case 1:
					return this._y;
				case 2:
					return this._z;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		clone: function () {

			return new this.constructor(this._x, this._y, this._z);

		},

		copy: function (v) {

			this._x = v.x;
			this._y = v.y;
			this._z = v.z;
			this.onChangeCallback();
			return this;

		},

		add: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
				return this.addVectors(v, w);

			}

			this._x += v.x;
			this._y += v.y;
			this._z += v.z;
			this.onChangeCallback();
			return this;

		},

		addScalar: function (s) {

			this._x += s;
			this._y += s;
			this._z += s;
			this.onChangeCallback();
			return this;

		},

		addVectors: function (a, b) {

			this._x = a.x + b.x;
			this._y = a.y + b.y;
			this._z = a.z + b.z;
			this.onChangeCallback();
			return this;

		},

		addScaledVector: function (v, s) {

			this._x += v.x * s;
			this._y += v.y * s;
			this._z += v.z * s;
			this.onChangeCallback();
			return this;

		},

		sub: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
				return this.subVectors(v, w);

			}

			this._x -= v.x;
			this._y -= v.y;
			this._z -= v.z;
			this.onChangeCallback();
			return this;

		},

		subScalar: function (s) {

			this._x -= s;
			this._y -= s;
			this._z -= s;
			this.onChangeCallback();
			return this;

		},

		subVectors: function (a, b) {

			this._x = a.x - b.x;
			this._y = a.y - b.y;
			this._z = a.z - b.z;
			this.onChangeCallback();
			return this;

		},

		multiply: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
				return this.multiplyVectors(v, w);

			}

			this._x *= v.x;
			this._y *= v.y;
			this._z *= v.z;
			this.onChangeCallback();
			return this;

		},

		multiplyScalar: function (scalar) {

			if (isFinite(scalar)) {

				this._x *= scalar;
				this._y *= scalar;
				this._z *= scalar;

			} else {

				this._x = 0;
				this._y = 0;
				this._z = 0;

			}
			this.onChangeCallback();
			return this;

		},

		multiplyVectors: function (a, b) {

			this._x = a.x * b.x;
			this._y = a.y * b.y;
			this._z = a.z * b.z;
			this.onChangeCallback();
			return this;

		},

		applyEuler: function () {

			var quaternion;

			return function applyEuler(euler) {

				if (euler instanceof THREE.Euler === false) {

					console.error('THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.');

				}

				if (quaternion === undefined) quaternion = new THREE.Quaternion();

				this.applyQuaternion(quaternion.setFromEuler(euler));

				return this;

			};

		}(),

		applyAxisAngle: function () {

			var quaternion;

			return function applyAxisAngle(axis, angle) {

				if (quaternion === undefined) quaternion = new THREE.Quaternion();

				this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));

				return this;

			};

		}(),

		applyMatrix3: function (m) {

			var x = this._x;
			var y = this._y;
			var z = this._z;

			var e = m.elements;

			this._x = e[0] * x + e[3] * y + e[6] * z;
			this._y = e[1] * x + e[4] * y + e[7] * z;
			this._z = e[2] * x + e[5] * y + e[8] * z;
			this.onChangeCallback();
			return this;

		},

		applyMatrix4: function (m) {

			// input: THREE.Matrix4 affine matrix

			var x = this._x,
				y = this._y,
				z = this._z;

			var e = m.elements;

			this._x = e[0] * x + e[4] * y + e[8] * z + e[12];
			this._y = e[1] * x + e[5] * y + e[9] * z + e[13];
			this._z = e[2] * x + e[6] * y + e[10] * z + e[14];
			this.onChangeCallback();
			return this;

		},

		applyProjection: function (m) {

			// input: THREE.Matrix4 projection matrix

			var x = this._x,
				y = this._y,
				z = this._z;

			var e = m.elements;
			var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

			this._x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
			this._y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
			this._z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
			this.onChangeCallback();
			return this;

		},

		applyQuaternion: function (q) {

			var x = this._x;
			var y = this._y;
			var z = this._z;

			var qx = q.x;
			var qy = q.y;
			var qz = q.z;
			var qw = q.w;

			// calculate quat * vector

			var ix = qw * x + qy * z - qz * y;
			var iy = qw * y + qz * x - qx * z;
			var iz = qw * z + qx * y - qy * x;
			var iw = -qx * x - qy * y - qz * z;

			// calculate result * inverse quat

			this._x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this._y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this._z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
			this.onChangeCallback();
			return this;

		},

		project: function () {

			var matrix;

			return function project(camera) {

				if (matrix === undefined) matrix = new THREE.Matrix4();

				matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
				return this.applyProjection(matrix);

			};

		}(),

		unproject: function () {

			var matrix;

			return function unproject(camera) {

				if (matrix === undefined) matrix = new THREE.Matrix4();

				matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
				return this.applyProjection(matrix);

			};

		}(),

		transformDirection: function (m) {

			// input: THREE.Matrix4 affine matrix
			// vector interpreted as a direction

			var x = this._x,
				y = this._y,
				z = this._z;

			var e = m.elements;

			this._x = e[0] * x + e[4] * y + e[8] * z;
			this._y = e[1] * x + e[5] * y + e[9] * z;
			this._z = e[2] * x + e[6] * y + e[10] * z;

			this.normalize();
			this.onChangeCallback();
			return this;

		},

		divide: function (v) {

			this._x /= v.x;
			this._y /= v.y;
			this._z /= v.z;
			this.onChangeCallback();
			return this;

		},

		divideScalar: function (scalar) {

			return this.multiplyScalar(1 / scalar);

		},

		min: function (v) {

			this._x = Math.min(this._x, v.x);
			this._y = Math.min(this._y, v.y);
			this._z = Math.min(this._z, v.z);
			this.onChangeCallback();
			return this;

		},

		max: function (v) {

			this._x = Math.max(this._x, v.x);
			this._y = Math.max(this._y, v.y);
			this._z = Math.max(this._z, v.z);
			this.onChangeCallback();
			return this;

		},

		clamp: function (min, max) {

			// This function assumes min < max, if this assumption isn't true it will not operate correctly

			this._x = Math.max(min.x, Math.min(max.x, this._x));
			this._y = Math.max(min.y, Math.min(max.y, this._y));
			this._z = Math.max(min.z, Math.min(max.z, this._z));
			this.onChangeCallback();
			return this;

		},

		clampScalar: function () {

			var min, max;

			return function clampScalar(minVal, maxVal) {

				if (min === undefined) {

					min = new THREE.Vector3();
					max = new THREE.Vector3();

				}

				min.set(minVal, minVal, minVal);
				max.set(maxVal, maxVal, maxVal);

				return this.clamp(min, max);

			};

		}(),

		clampLength: function (min, max) {

			var length = this.length();

			this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);

			return this;

		},

		floor: function () {

			this._x = Math.floor(this._x);
			this._y = Math.floor(this._y);
			this._z = Math.floor(this._z);
			this.onChangeCallback();
			return this;

		},

		ceil: function () {

			this._x = Math.ceil(this._x);
			this._y = Math.ceil(this._y);
			this._z = Math.ceil(this._z);
			this.onChangeCallback();
			return this;

		},

		round: function () {

			this._x = Math.round(this._x);
			this._y = Math.round(this._y);
			this._z = Math.round(this._z);
			this.onChangeCallback();
			return this;

		},

		roundToZero: function () {

			this._x = (this._x < 0) ? Math.ceil(this._x) : Math.floor(this._x);
			this._y = (this._y < 0) ? Math.ceil(this._y) : Math.floor(this._y);
			this._z = (this._z < 0) ? Math.ceil(this._z) : Math.floor(this._z);
			this.onChangeCallback();
			return this;

		},

		negate: function () {

			this._x = -this._x;
			this._y = -this._y;
			this._z = -this._z;
			this.onChangeCallback();
			return this;

		},

		dot: function (v) {

			return this._x * v.x + this._y * v.y + this._z * v.z;

		},

		lengthSq: function () {

			return this._x * this._x + this._y * this._y + this._z * this._z;

		},

		length: function () {

			return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);

		},

		lengthManhattan: function () {

			return Math.abs(this._x) + Math.abs(this._y) + Math.abs(this._z);

		},

		normalize: function () {

			return this.divideScalar(this.length());

		},

		setLength: function (length) {

			return this.multiplyScalar(length / this.length());

		},

		lerp: function (v, alpha) {

			this._x += (v.x - this._x) * alpha;
			this._y += (v.y - this._y) * alpha;
			this._z += (v.z - this._z) * alpha;
			this.onChangeCallback();
			return this;

		},

		lerpVectors: function (v1, v2, alpha) {

			this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

			return this;

		},

		cross: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
				return this.crossVectors(v, w);

			}

			var x = this._x,
				y = this._y,
				z = this._z;

			this._x = y * v.z - z * v.y;
			this._y = z * v.x - x * v.z;
			this._z = x * v.y - y * v.x;
			this.onChangeCallback();
			return this;

		},

		crossVectors: function (a, b) {

			var ax = a.x,
				ay = a.y,
				az = a.z;
			var bx = b.x,
				by = b.y,
				bz = b.z;

			this._x = ay * bz - az * by;
			this._y = az * bx - ax * bz;
			this._z = ax * by - ay * bx;
			this.onChangeCallback();
			return this;

		},

		projectOnVector: function () {

			var v1, dot;

			return function projectOnVector(vector) {

				if (v1 === undefined) v1 = new THREE.Vector3();

				v1.copy(vector).normalize();

				dot = this.dot(v1);

				return this.copy(v1).multiplyScalar(dot);

			};

		}(),

		projectOnPlane: function () {

			var v1;

			return function projectOnPlane(planeNormal) {

				if (v1 === undefined) v1 = new THREE.Vector3();

				v1.copy(this).projectOnVector(planeNormal);

				return this.sub(v1);

			};

		}(),

		reflect: function () {

			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length

			var v1;

			return function reflect(normal) {

				if (v1 === undefined) v1 = new THREE.Vector3();

				return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));

			};

		}(),

		angleTo: function (v) {

			var theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));

			// clamp, to handle numerical problems

			return Math.acos(THREE.Math.clamp(theta, -1, 1));

		},

		distanceTo: function (v) {

			return Math.sqrt(this.distanceToSquared(v));

		},

		distanceToSquared: function (v) {

			var dx = this._x - v.x;
			var dy = this._y - v.y;
			var dz = this._z - v.z;

			return dx * dx + dy * dy + dz * dz;

		},

		setFromSpherical: function (s) {

			var sinPhiRadius = Math.sin(s.phi) * s.radius;

			this._x = sinPhiRadius * Math.sin(s.theta);
			this._y = Math.cos(s.phi) * s.radius;
			this._z = sinPhiRadius * Math.cos(s.theta);
			this.onChangeCallback();
			return this;

		},

		setFromMatrixPosition: function (m) {

			return this.setFromMatrixColumn(m, 3);

		},

		setFromMatrixScale: function (m) {

			var sx = this.setFromMatrixColumn(m, 0).length();
			var sy = this.setFromMatrixColumn(m, 1).length();
			var sz = this.setFromMatrixColumn(m, 2).length();

			this._x = sx;
			this._y = sy;
			this._z = sz;
			this.onChangeCallback();
			return this;

		},

		setFromMatrixColumn: function (m, index) {

			if (typeof m === 'number') {

				console.warn('THREE.Vector3: setFromMatrixColumn now expects ( matrix, index ).');

				m = arguments[1];
				index = arguments[0];

			}

			return this.fromArray(m.elements, index * 4);

		},

		equals: function (v) {

			return (
				Math.abs(v.x - this._x) < 0.0001 &&
				Math.abs(v.y - this._y) < 0.0001 &&
				Math.abs(v.z - this._z) < 0.0001
			);
		},

		fromArray: function (array, offset) {

			if (offset === undefined) offset = 0;

			this._x = array[offset];
			this._y = array[offset + 1];
			this._z = array[offset + 2];
			this.onChangeCallback();
			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this._x;
			array[offset + 1] = this._y;
			array[offset + 2] = this._z;

			return array;

		},

		fromAttribute: function (attribute, index, offset) {

			if (offset === undefined) offset = 0;

			index = index * attribute.itemSize + offset;

			this._x = attribute.array[index];
			this._y = attribute.array[index + 1];
			this._z = attribute.array[index + 2];
			this.onChangeCallback();
			return this;

		},
		onChange: function (callback) {

			this.onChangeCallback = callback;

			return this;

		},
		onChangeCallback: function () {}
	};

	// File:../dev/three/math/Vector4.js

	/**
	 * @author supereggbert / http://www.paulbrunt.co.uk/
	 * @author philogb / http://blog.thejit.org/
	 * @author mikael emtinger / http://gomo.se/
	 * @author egraether / http://egraether.com/
	 * @author WestLangley / http://github.com/WestLangley
	 */

	THREE.Vector4 = function (x, y, z, w) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = (w !== undefined) ? w : 1;

	};

	THREE.Vector4.prototype = {

		constructor: THREE.Vector4,

		set: function (x, y, z, w) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		},

		setScalar: function (scalar) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;
			this.w = scalar;

			return this;

		},

		setX: function (x) {

			this.x = x;

			return this;

		},

		setY: function (y) {

			this.y = y;

			return this;

		},

		setZ: function (z) {

			this.z = z;

			return this;

		},

		setW: function (w) {

			this.w = w;

			return this;

		},

		setComponent: function (index, value) {

			switch (index) {

				case 0:
					this.x = value;
					break;
				case 1:
					this.y = value;
					break;
				case 2:
					this.z = value;
					break;
				case 3:
					this.w = value;
					break;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		getComponent: function (index) {

			switch (index) {

				case 0:
					return this.x;
				case 1:
					return this.y;
				case 2:
					return this.z;
				case 3:
					return this.w;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		clone: function () {

			return new this.constructor(this.x, this.y, this.z, this.w);

		},

		copy: function (v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = (v.w !== undefined) ? v.w : 1;

			return this;

		},

		add: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
				return this.addVectors(v, w);

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;

			return this;

		},

		addScalar: function (s) {

			this.x += s;
			this.y += s;
			this.z += s;
			this.w += s;

			return this;

		},

		addVectors: function (a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			this.w = a.w + b.w;

			return this;

		},

		addScaledVector: function (v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			this.w += v.w * s;

			return this;

		},

		sub: function (v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
				return this.subVectors(v, w);

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;

			return this;

		},

		subScalar: function (s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;
			this.w -= s;

			return this;

		},

		subVectors: function (a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;

			return this;

		},

		multiplyScalar: function (scalar) {

			if (isFinite(scalar)) {

				this.x *= scalar;
				this.y *= scalar;
				this.z *= scalar;
				this.w *= scalar;

			} else {

				this.x = 0;
				this.y = 0;
				this.z = 0;
				this.w = 0;

			}

			return this;

		},

		applyMatrix4: function (m) {

			var x = this.x;
			var y = this.y;
			var z = this.z;
			var w = this.w;

			var e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
			this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

			return this;

		},

		divideScalar: function (scalar) {

			return this.multiplyScalar(1 / scalar);

		},

		setAxisAngleFromQuaternion: function (q) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

			// q is assumed to be normalized

			this.w = 2 * Math.acos(q.w);

			var s = Math.sqrt(1 - q.w * q.w);

			if (s < 0.0001) {

				this.x = 1;
				this.y = 0;
				this.z = 0;

			} else {

				this.x = q.x / s;
				this.y = q.y / s;
				this.z = q.z / s;

			}

			return this;

		},

		setAxisAngleFromRotationMatrix: function (m) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var angle, x, y, z, // variables for result
				epsilon = 0.01, // margin to allow for rounding errors
				epsilon2 = 0.1, // margin to distinguish between 0 and 180 degrees

				te = m.elements,

				m11 = te[0],
				m12 = te[4],
				m13 = te[8],
				m21 = te[1],
				m22 = te[5],
				m23 = te[9],
				m31 = te[2],
				m32 = te[6],
				m33 = te[10];

			if ((Math.abs(m12 - m21) < epsilon) &&
				(Math.abs(m13 - m31) < epsilon) &&
				(Math.abs(m23 - m32) < epsilon)) {

				// singularity found
				// first check for identity matrix which must have +1 for all terms
				// in leading diagonal and zero in other terms

				if ((Math.abs(m12 + m21) < epsilon2) &&
					(Math.abs(m13 + m31) < epsilon2) &&
					(Math.abs(m23 + m32) < epsilon2) &&
					(Math.abs(m11 + m22 + m33 - 3) < epsilon2)) {

					// this singularity is identity matrix so angle = 0

					this.set(1, 0, 0, 0);

					return this; // zero angle, arbitrary axis

				}

				// otherwise this singularity is angle = 180

				angle = Math.PI;

				var xx = (m11 + 1) / 2;
				var yy = (m22 + 1) / 2;
				var zz = (m33 + 1) / 2;
				var xy = (m12 + m21) / 4;
				var xz = (m13 + m31) / 4;
				var yz = (m23 + m32) / 4;

				if ((xx > yy) && (xx > zz)) {

					// m11 is the largest diagonal term

					if (xx < epsilon) {

						x = 0;
						y = 0.707106781;
						z = 0.707106781;

					} else {

						x = Math.sqrt(xx);
						y = xy / x;
						z = xz / x;

					}

				} else if (yy > zz) {

					// m22 is the largest diagonal term

					if (yy < epsilon) {

						x = 0.707106781;
						y = 0;
						z = 0.707106781;

					} else {

						y = Math.sqrt(yy);
						x = xy / y;
						z = yz / y;

					}

				} else {

					// m33 is the largest diagonal term so base result on this

					if (zz < epsilon) {

						x = 0.707106781;
						y = 0.707106781;
						z = 0;

					} else {

						z = Math.sqrt(zz);
						x = xz / z;
						y = yz / z;

					}

				}

				this.set(x, y, z, angle);

				return this; // return 180 deg rotation

			}

			// as we have reached here there are no singularities so we can handle normally

			var s = Math.sqrt((m32 - m23) * (m32 - m23) +
				(m13 - m31) * (m13 - m31) +
				(m21 - m12) * (m21 - m12)); // used to normalize

			if (Math.abs(s) < 0.001) s = 1;

			// prevent divide by zero, should not happen if matrix is orthogonal and should be
			// caught by singularity test above, but I've left it in just in case

			this.x = (m32 - m23) / s;
			this.y = (m13 - m31) / s;
			this.z = (m21 - m12) / s;
			this.w = Math.acos((m11 + m22 + m33 - 1) / 2);

			return this;

		},

		min: function (v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);
			this.w = Math.min(this.w, v.w);

			return this;

		},

		max: function (v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);
			this.w = Math.max(this.w, v.w);

			return this;

		},

		clamp: function (min, max) {

			// This function assumes min < max, if this assumption isn't true it will not operate correctly

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));
			this.w = Math.max(min.w, Math.min(max.w, this.w));

			return this;

		},

		clampScalar: function () {

			var min, max;

			return function clampScalar(minVal, maxVal) {

				if (min === undefined) {

					min = new THREE.Vector4();
					max = new THREE.Vector4();

				}

				min.set(minVal, minVal, minVal, minVal);
				max.set(maxVal, maxVal, maxVal, maxVal);

				return this.clamp(min, max);

			};

		}(),

		floor: function () {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);
			this.w = Math.floor(this.w);

			return this;

		},

		ceil: function () {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.z = Math.ceil(this.z);
			this.w = Math.ceil(this.w);

			return this;

		},

		round: function () {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.z = Math.round(this.z);
			this.w = Math.round(this.w);

			return this;

		},

		roundToZero: function () {

			this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
			this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
			this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
			this.w = (this.w < 0) ? Math.ceil(this.w) : Math.floor(this.w);

			return this;

		},

		negate: function () {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;
			this.w = -this.w;

			return this;

		},

		dot: function (v) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

		},

		length: function () {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

		},

		lengthManhattan: function () {

			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);

		},

		normalize: function () {

			return this.divideScalar(this.length());

		},

		setLength: function (length) {

			return this.multiplyScalar(length / this.length());

		},

		lerp: function (v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;
			this.z += (v.z - this.z) * alpha;
			this.w += (v.w - this.w) * alpha;

			return this;

		},

		lerpVectors: function (v1, v2, alpha) {

			this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

			return this;

		},

		equals: function (v) {

			return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z) && (v.w === this.w));

		},

		fromArray: function (array, offset) {

			if (offset === undefined) offset = 0;

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.w = array[offset + 3];

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.w;

			return array;

		},

		fromAttribute: function (attribute, index, offset) {

			if (offset === undefined) offset = 0;

			index = index * attribute.itemSize + offset;

			this.x = attribute.array[index];
			this.y = attribute.array[index + 1];
			this.z = attribute.array[index + 2];
			this.w = attribute.array[index + 3];

			return this;

		}

	};

	// File:../dev/three/math/Euler.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author bhouston / http://clara.io
	 */

	THREE.Euler = function (x, y, z, order) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._order = order || THREE.Euler.DefaultOrder;

	};

	THREE.Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];

	THREE.Euler.DefaultOrder = 'YXZ';

	THREE.Euler.prototype = {

		constructor: THREE.Euler,

		get x() {
			this.onGetCallback();
			return this._x;

		},

		set x(value) {

			this._x = value;
			this.onChangeCallback();

		},

		get y() {
			this.onGetCallback();
			return this._y;

		},

		set y(value) {

			this._y = value;
			this.onChangeCallback();

		},

		get z() {
			this.onGetCallback();
			return this._z;

		},

		set z(value) {
			this._z = value;
			this.onChangeCallback();

		},

		get order() {

			return this._order;

		},

		set order(value) {

			this._order = value;
			this.onChangeCallback();

		},

		set: function (x, y, z, order) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order || this._order;

			this.onChangeCallback();

			return this;

		},

		clone: function () {

			return new this.constructor(this._x, this._y, this._z, this._order);

		},

		copy: function (euler) {

			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;

			this.onChangeCallback();

			return this;

		},

		setFromRotationMatrix: function (m, order, update) {

			var clamp = THREE.Math.clamp;

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var te = m.elements;
			var m11 = te[0],
				m12 = te[4],
				m13 = te[8];
			var m21 = te[1],
				m22 = te[5],
				m23 = te[9];
			var m31 = te[2],
				m32 = te[6],
				m33 = te[10];

			order = order || this._order;

			if (order === 'XYZ') {

				this._y = Math.asin(clamp(m13, -1, 1));

				if (Math.abs(m13) < 0.99999) {

					this._x = Math.atan2(-m23, m33);
					this._z = Math.atan2(-m12, m11);

				} else {

					this._x = Math.atan2(m32, m22);
					this._z = 0;

				}

			} else if (order === 'YXZ') {

				this._x = Math.asin(-clamp(m23, -1, 1));

				if (Math.abs(m23) < 0.99999) {

					this._y = Math.atan2(m13, m33);
					this._z = Math.atan2(m21, m22);

				} else {

					this._y = Math.atan2(-m31, m11);
					this._z = 0;

				}

			} else if (order === 'ZXY') {

				this._x = Math.asin(clamp(m32, -1, 1));

				if (Math.abs(m32) < 0.99999) {

					this._y = Math.atan2(-m31, m33);
					this._z = Math.atan2(-m12, m22);

				} else {

					this._y = 0;
					this._z = Math.atan2(m21, m11);

				}

			} else if (order === 'ZYX') {

				this._y = Math.asin(-clamp(m31, -1, 1));

				if (Math.abs(m31) < 0.99999) {

					this._x = Math.atan2(m32, m33);
					this._z = Math.atan2(m21, m11);

				} else {

					this._x = 0;
					this._z = Math.atan2(-m12, m22);

				}

			} else if (order === 'YZX') {

				this._z = Math.asin(clamp(m21, -1, 1));

				if (Math.abs(m21) < 0.99999) {

					this._x = Math.atan2(-m23, m22);
					this._y = Math.atan2(-m31, m11);

				} else {

					this._x = 0;
					this._y = Math.atan2(m13, m33);

				}

			} else if (order === 'XZY') {

				this._z = Math.asin(-clamp(m12, -1, 1));

				if (Math.abs(m12) < 0.99999) {

					this._x = Math.atan2(m32, m22);
					this._y = Math.atan2(m13, m11);

				} else {

					this._x = Math.atan2(-m23, m33);
					this._y = 0;

				}

			} else {

				console.warn('THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order);

			}

			this._order = order;

			if (update !== false) this.onChangeCallback();

			return this;

		},

		setFromQuaternion: function () {

			var matrix;

			return function (q, order, update) {

				if (matrix === undefined) matrix = new THREE.Matrix4();
				matrix.makeRotationFromQuaternion(q);
				this.setFromRotationMatrix(matrix, order, update);

				return this;

			};

		}(),

		setFromVector3: function (v, order) {

			return this.set(v.x, v.y, v.z, order || this._order);

		},

		reorder: function () {

			// WARNING: this discards revolution information -bhouston

			var q = new THREE.Quaternion();

			return function (newOrder) {

				q.setFromEuler(this);
				this.setFromQuaternion(q, newOrder);

			};

		}(),

		equals: function (euler) {

			return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);

		},

		fromArray: function (array) {

			this._x = array[0];
			this._y = array[1];
			this._z = array[2];
			if (array[3] !== undefined) this._order = array[3];

			this.onChangeCallback();

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this._x;
			array[offset + 1] = this._y;
			array[offset + 2] = this._z;
			array[offset + 3] = this._order;

			return array;

		},

		toVector3: function (optionalResult) {

			if (optionalResult) {

				return optionalResult.set(this._x, this._y, this._z);

			} else {

				return new THREE.Vector3(this._x, this._y, this._z);

			}

		},

		onChange: function (callback) {

			this.onChangeCallback = callback;

			return this;

		},
		onGet: function (callback) {
			this.onGetCallback = callback;
			return this;
		},

		onChangeCallback: function () {},
		onGetCallback: function () {}
	};

	// File:../dev/three/math/Line3.js

	/**
	 * @author bhouston / http://clara.io
	 */

	THREE.Line3 = function (start, end) {

		this.start = (start !== undefined) ? start : new THREE.Vector3();
		this.end = (end !== undefined) ? end : new THREE.Vector3();

	};

	THREE.Line3.prototype = {

		constructor: THREE.Line3,

		set: function (start, end) {

			this.start.copy(start);
			this.end.copy(end);

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (line) {

			this.start.copy(line.start);
			this.end.copy(line.end);

			return this;

		},

		center: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.addVectors(this.start, this.end).multiplyScalar(0.5);

		},

		delta: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.subVectors(this.end, this.start);

		},

		distanceSq: function () {

			return this.start.distanceToSquared(this.end);

		},

		distance: function () {

			return this.start.distanceTo(this.end);

		},

		at: function (t, optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();

			return this.delta(result).multiplyScalar(t).add(this.start);

		},

		closestPointToPointParameter: function () {

			var startP = new THREE.Vector3();
			var startEnd = new THREE.Vector3();

			return function (point, clampToLine) {

				startP.subVectors(point, this.start);
				startEnd.subVectors(this.end, this.start);

				var startEnd2 = startEnd.dot(startEnd);
				var startEnd_startP = startEnd.dot(startP);

				var t = startEnd_startP / startEnd2;

				if (clampToLine) {

					t = THREE.Math.clamp(t, 0, 1);

				}

				return t;

			};

		}(),

		closestPointToPoint: function (point, clampToLine, optionalTarget) {

			var t = this.closestPointToPointParameter(point, clampToLine);

			var result = optionalTarget || new THREE.Vector3();

			return this.delta(result).multiplyScalar(t).add(this.start);

		},

		applyMatrix4: function (matrix) {

			this.start.applyMatrix4(matrix);
			this.end.applyMatrix4(matrix);

			return this;

		},

		equals: function (line) {

			return line.start.equals(this.start) && line.end.equals(this.end);

		}

	};

	// File:../dev/three/math/Box2.js

	/**
	 * @author bhouston / http://clara.io
	 */

	THREE.Box2 = function (min, max) {

		this.min = (min !== undefined) ? min : new THREE.Vector2(+Infinity, +Infinity);
		this.max = (max !== undefined) ? max : new THREE.Vector2(-Infinity, -Infinity);

	};

	THREE.Box2.prototype = {

		constructor: THREE.Box2,

		set: function (min, max) {

			this.min.copy(min);
			this.max.copy(max);

			return this;

		},

		setFromPoints: function (points) {

			this.makeEmpty();

			for (var i = 0, il = points.length; i < il; i++) {

				this.expandByPoint(points[i]);

			}

			return this;

		},

		setFromCenterAndSize: function () {

			var v1 = new THREE.Vector2();

			return function (center, size) {

				var halfSize = v1.copy(size).multiplyScalar(0.5);
				this.min.copy(center).sub(halfSize);
				this.max.copy(center).add(halfSize);

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (box) {

			this.min.copy(box.min);
			this.max.copy(box.max);

			return this;

		},

		makeEmpty: function () {

			this.min.x = this.min.y = +Infinity;
			this.max.x = this.max.y = -Infinity;

			return this;

		},

		isEmpty: function () {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return (this.max.x < this.min.x) || (this.max.y < this.min.y);

		},

		center: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector2();
			return result.addVectors(this.min, this.max).multiplyScalar(0.5);

		},

		size: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector2();
			return result.subVectors(this.max, this.min);

		},

		expandByPoint: function (point) {

			this.min.min(point);
			this.max.max(point);

			return this;

		},

		expandByVector: function (vector) {

			this.min.sub(vector);
			this.max.add(vector);

			return this;

		},

		expandByScalar: function (scalar) {

			this.min.addScalar(-scalar);
			this.max.addScalar(scalar);

			return this;

		},

		containsPoint: function (point) {

			if (point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y) {

				return false;

			}

			return true;

		},

		containsBox: function (box) {

			if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
				(this.min.y <= box.min.y) && (box.max.y <= this.max.y)) {

				return true;

			}

			return false;

		},

		getParameter: function (point, optionalTarget) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			var result = optionalTarget || new THREE.Vector2();

			return result.set(
				(point.x - this.min.x) / (this.max.x - this.min.x),
				(point.y - this.min.y) / (this.max.y - this.min.y)
			);

		},

		intersectsBox: function (box) {

			// using 6 splitting planes to rule out intersections.

			if (box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y) {

				return false;

			}

			return true;

		},

		clampPoint: function (point, optionalTarget) {

			var result = optionalTarget || new THREE.Vector2();
			return result.copy(point).clamp(this.min, this.max);

		},

		distanceToPoint: function () {

			var v1 = new THREE.Vector2();

			return function (point) {

				var clampedPoint = v1.copy(point).clamp(this.min, this.max);
				return clampedPoint.sub(point).length();

			};

		}(),

		intersect: function (box) {

			this.min.max(box.min);
			this.max.min(box.max);

			return this;

		},

		union: function (box) {

			this.min.min(box.min);
			this.max.max(box.max);

			return this;

		},

		translate: function (offset) {

			this.min.add(offset);
			this.max.add(offset);

			return this;

		},

		equals: function (box) {

			return box.min.equals(this.min) && box.max.equals(this.max);

		}

	};

	// File:../dev/three/math/Box3.js

	/**
	 * @author bhouston / http://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 */

	THREE.Box3 = function (min, max) {

		this.min = (min !== undefined) ? min : new THREE.Vector3(+Infinity, +Infinity, +Infinity);
		this.max = (max !== undefined) ? max : new THREE.Vector3(-Infinity, -Infinity, -Infinity);

	};

	THREE.Box3.prototype = {

		constructor: THREE.Box3,

		set: function (min, max) {

			this.min.copy(min);
			this.max.copy(max);

			return this;

		},

		setFromArray: function (array) {

			var minX = +Infinity;
			var minY = +Infinity;
			var minZ = +Infinity;

			var maxX = -Infinity;
			var maxY = -Infinity;
			var maxZ = -Infinity;

			for (var i = 0, l = array.length; i < l; i += 3) {

				var x = array[i];
				var y = array[i + 1];
				var z = array[i + 2];

				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (z < minZ) minZ = z;

				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
				if (z > maxZ) maxZ = z;

			}

			this.min.set(minX, minY, minZ);
			this.max.set(maxX, maxY, maxZ);

		},

		setFromPoints: function (points) {

			this.makeEmpty();

			for (var i = 0, il = points.length; i < il; i++) {

				this.expandByPoint(points[i]);

			}

			return this;

		},

		setFromCenterAndSize: function () {

			var v1 = new THREE.Vector3();

			return function (center, size) {

				var halfSize = v1.copy(size).multiplyScalar(0.5);

				this.min.copy(center).sub(halfSize);
				this.max.copy(center).add(halfSize);

				return this;

			};

		}(),

		setFromObject: function () {

			// Computes the world-axis-aligned bounding box of an object (including its children),
			// accounting for both the object's, and children's, world transforms

			var v1 = new THREE.Vector3();

			return function (object) {

				var scope = this;

				object.updateMatrixWorld(true);

				this.makeEmpty();

				object.traverse(function (node) {

					var geometry = node.geometry;

					if (geometry !== undefined) {

						if (geometry instanceof THREE.Geometry) {

							var vertices = geometry.vertices;

							for (var i = 0, il = vertices.length; i < il; i++) {

								v1.copy(vertices[i]);
								v1.applyMatrix4(node.matrixWorld);

								scope.expandByPoint(v1);

							}

						} else if (geometry instanceof THREE.BufferGeometry && geometry.attributes['position'] !== undefined) {

							var positions = geometry.attributes['position'].array;

							for (var i = 0, il = positions.length; i < il; i += 3) {

								v1.fromArray(positions, i);
								v1.applyMatrix4(node.matrixWorld);

								scope.expandByPoint(v1);

							}

						}

					}

				});

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (box) {

			this.min.copy(box.min);
			this.max.copy(box.max);

			return this;

		},

		makeEmpty: function () {

			this.min.x = this.min.y = this.min.z = +Infinity;
			this.max.x = this.max.y = this.max.z = -Infinity;

			return this;

		},

		isEmpty: function () {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);

		},

		center: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.addVectors(this.min, this.max).multiplyScalar(0.5);

		},

		size: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.subVectors(this.max, this.min);

		},

		expandByPoint: function (point) {

			this.min.min(point);
			this.max.max(point);

			return this;

		},

		expandByVector: function (vector) {

			this.min.sub(vector);
			this.max.add(vector);

			return this;

		},

		expandByScalar: function (scalar) {

			this.min.addScalar(-scalar);
			this.max.addScalar(scalar);

			return this;

		},

		containsPoint: function (point) {

			if (point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y ||
				point.z < this.min.z || point.z > this.max.z) {

				return false;

			}

			return true;

		},

		containsBox: function (box) {

			if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
				(this.min.y <= box.min.y) && (box.max.y <= this.max.y) &&
				(this.min.z <= box.min.z) && (box.max.z <= this.max.z)) {

				return true;

			}

			return false;

		},

		getParameter: function (point, optionalTarget) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			var result = optionalTarget || new THREE.Vector3();

			return result.set(
				(point.x - this.min.x) / (this.max.x - this.min.x),
				(point.y - this.min.y) / (this.max.y - this.min.y),
				(point.z - this.min.z) / (this.max.z - this.min.z)
			);

		},

		intersectsBox: function (box) {

			// using 6 splitting planes to rule out intersections.

			if (box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z) {

				return false;

			}

			return true;

		},

		intersectsSphere: (function () {

			var closestPoint;

			return function intersectsSphere(sphere) {

				if (closestPoint === undefined) closestPoint = new THREE.Vector3();

				// Find the point on the AABB closest to the sphere center.
				this.clampPoint(sphere.center, closestPoint);

				// If that point is inside the sphere, the AABB and sphere intersect.
				return closestPoint.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);

			};

		})(),

		intersectsPlane: function (plane) {

			// We compute the minimum and maximum dot product values. If those values
			// are on the same side (back or front) of the plane, then there is no intersection.

			var min, max;

			if (plane.normal.x > 0) {

				min = plane.normal.x * this.min.x;
				max = plane.normal.x * this.max.x;

			} else {

				min = plane.normal.x * this.max.x;
				max = plane.normal.x * this.min.x;

			}

			if (plane.normal.y > 0) {

				min += plane.normal.y * this.min.y;
				max += plane.normal.y * this.max.y;

			} else {

				min += plane.normal.y * this.max.y;
				max += plane.normal.y * this.min.y;

			}

			if (plane.normal.z > 0) {

				min += plane.normal.z * this.min.z;
				max += plane.normal.z * this.max.z;

			} else {

				min += plane.normal.z * this.max.z;
				max += plane.normal.z * this.min.z;

			}

			return (min <= plane.constant && max >= plane.constant);

		},

		clampPoint: function (point, optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.copy(point).clamp(this.min, this.max);

		},

		distanceToPoint: function () {

			var v1 = new THREE.Vector3();

			return function (point) {

				var clampedPoint = v1.copy(point).clamp(this.min, this.max);
				return clampedPoint.sub(point).length();

			};

		}(),

		getBoundingSphere: function () {

			var v1 = new THREE.Vector3();

			return function (optionalTarget) {

				var result = optionalTarget || new THREE.Sphere();

				result.center = this.center();
				result.radius = this.size(v1).length() * 0.5;

				return result;

			};

		}(),

		intersect: function (box) {

			this.min.max(box.min);
			this.max.min(box.max);

			// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
			if (this.isEmpty()) this.makeEmpty();

			return this;

		},

		union: function (box) {

			this.min.min(box.min);
			this.max.max(box.max);

			return this;

		},

		applyMatrix4: function () {

			var points = [
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3()
			];

			return function (matrix) {

				// transform of empty box is an empty box.
				if (this.isEmpty()) return this;

				// NOTE: I am using a binary pattern to specify all 2^3 combinations below
				points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
				points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
				points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
				points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
				points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
				points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
				points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
				points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

				this.setFromPoints(points);

				return this;

			};

		}(),

		translate: function (offset) {

			this.min.add(offset);
			this.max.add(offset);

			return this;

		},

		equals: function (box) {

			return box.min.equals(this.min) && box.max.equals(this.max);

		}

	};

	// File:../dev/three/math/Matrix3.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author bhouston / http://clara.io
	 * @author tschw
	 */

	THREE.Matrix3 = function () {

		this.elements = new Float32Array([

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		]);

		if (arguments.length > 0) {

			console.error('THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.');

		}

	};

	THREE.Matrix3.prototype = {

		constructor: THREE.Matrix3,

		set: function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {

			var te = this.elements;

			te[0] = n11;
			te[1] = n21;
			te[2] = n31;
			te[3] = n12;
			te[4] = n22;
			te[5] = n32;
			te[6] = n13;
			te[7] = n23;
			te[8] = n33;

			return this;

		},

		identity: function () {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		},

		clone: function () {

			return new this.constructor().fromArray(this.elements);

		},

		copy: function (m) {

			var me = m.elements;

			this.set(

				me[0], me[3], me[6],
				me[1], me[4], me[7],
				me[2], me[5], me[8]

			);

			return this;

		},

		setFromMatrix4: function (m) {

			var me = m.elements;

			this.set(

				me[0], me[4], me[8],
				me[1], me[5], me[9],
				me[2], me[6], me[10]

			);

			return this;

		},

		applyToVector3Array: function () {

			var v1;

			return function (array, offset, length) {

				if (v1 === undefined) v1 = new THREE.Vector3();
				if (offset === undefined) offset = 0;
				if (length === undefined) length = array.length;

				for (var i = 0, j = offset; i < length; i += 3, j += 3) {

					v1.fromArray(array, j);
					v1.applyMatrix3(this);
					v1.toArray(array, j);

				}

				return array;

			};

		}(),

		applyToBuffer: function () {

			var v1;

			return function applyToBuffer(buffer, offset, length) {

				if (v1 === undefined) v1 = new THREE.Vector3();
				if (offset === undefined) offset = 0;
				if (length === undefined) length = buffer.length / buffer.itemSize;

				for (var i = 0, j = offset; i < length; i++, j++) {

					v1.x = buffer.getX(j);
					v1.y = buffer.getY(j);
					v1.z = buffer.getZ(j);

					v1.applyMatrix3(this);

					buffer.setXYZ(v1.x, v1.y, v1.z);

				}

				return buffer;

			};

		}(),

		multiplyScalar: function (s) {

			var te = this.elements;

			te[0] *= s;
			te[3] *= s;
			te[6] *= s;
			te[1] *= s;
			te[4] *= s;
			te[7] *= s;
			te[2] *= s;
			te[5] *= s;
			te[8] *= s;

			return this;

		},

		determinant: function () {

			var te = this.elements;

			var a = te[0],
				b = te[1],
				c = te[2],
				d = te[3],
				e = te[4],
				f = te[5],
				g = te[6],
				h = te[7],
				i = te[8];

			return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

		},

		getInverse: function (matrix, throwOnDegenerate) {

			if (matrix instanceof THREE.Matrix4) {

				console.error("THREE.Matrix3.getInverse no longer takes a Matrix4 argument.");

			}

			var me = matrix.elements,
				te = this.elements,

				n11 = me[0],
				n21 = me[1],
				n31 = me[2],
				n12 = me[3],
				n22 = me[4],
				n32 = me[5],
				n13 = me[6],
				n23 = me[7],
				n33 = me[8],

				t11 = n33 * n22 - n32 * n23,
				t12 = n32 * n13 - n33 * n12,
				t13 = n23 * n12 - n22 * n13,

				det = n11 * t11 + n21 * t12 + n31 * t13;

			if (det === 0) {

				var msg = "THREE.Matrix3.getInverse(): can't invert matrix, determinant is 0";

				if (throwOnDegenerate || false) {

					throw new Error(msg);

				} else {

					console.warn(msg);

				}

				return this.identity();
			}

			te[0] = t11;
			te[1] = n31 * n23 - n33 * n21;
			te[2] = n32 * n21 - n31 * n22;

			te[3] = t12;
			te[4] = n33 * n11 - n31 * n13;
			te[5] = n31 * n12 - n32 * n11;

			te[6] = t13;
			te[7] = n21 * n13 - n23 * n11;
			te[8] = n22 * n11 - n21 * n12;

			return this.multiplyScalar(1 / det);

		},

		transpose: function () {

			var tmp, m = this.elements;

			tmp = m[1];
			m[1] = m[3];
			m[3] = tmp;
			tmp = m[2];
			m[2] = m[6];
			m[6] = tmp;
			tmp = m[5];
			m[5] = m[7];
			m[7] = tmp;

			return this;

		},

		flattenToArrayOffset: function (array, offset) {

			console.warn("THREE.Matrix3: .flattenToArrayOffset is deprecated " +
				"- just use .toArray instead.");

			return this.toArray(array, offset);

		},

		getNormalMatrix: function (matrix4) {

			return this.setFromMatrix4(matrix4).getInverse(this).transpose();

		},

		transposeIntoArray: function (r) {

			var m = this.elements;

			r[0] = m[0];
			r[1] = m[3];
			r[2] = m[6];
			r[3] = m[1];
			r[4] = m[4];
			r[5] = m[7];
			r[6] = m[2];
			r[7] = m[5];
			r[8] = m[8];

			return this;

		},

		fromArray: function (array) {

			this.elements.set(array);

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			var te = this.elements;

			array[offset] = te[0];
			array[offset + 1] = te[1];
			array[offset + 2] = te[2];

			array[offset + 3] = te[3];
			array[offset + 4] = te[4];
			array[offset + 5] = te[5];

			array[offset + 6] = te[6];
			array[offset + 7] = te[7];
			array[offset + 8] = te[8];

			return array;

		}

	};

	// File:../dev/three/math/Matrix4.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author supereggbert / http://www.paulbrunt.co.uk/
	 * @author philogb / http://blog.thejit.org/
	 * @author jordi_ros / http://plattsoft.com
	 * @author D1plo1d / http://github.com/D1plo1d
	 * @author alteredq / http://alteredqualia.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author timknip / http://www.floorplanner.com/
	 * @author bhouston / http://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 */

	THREE.Matrix4 = function () {

		this.elements = new Float32Array([

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		]);

		if (arguments.length > 0) {

			console.error('THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.');

		}

	};

	THREE.Matrix4.prototype = {

		constructor: THREE.Matrix4,

		set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

			var te = this.elements;

			te[0] = n11;
			te[4] = n12;
			te[8] = n13;
			te[12] = n14;
			te[1] = n21;
			te[5] = n22;
			te[9] = n23;
			te[13] = n24;
			te[2] = n31;
			te[6] = n32;
			te[10] = n33;
			te[14] = n34;
			te[3] = n41;
			te[7] = n42;
			te[11] = n43;
			te[15] = n44;

			return this;

		},

		identity: function () {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		clone: function () {

			return new THREE.Matrix4().fromArray(this.elements);

		},

		copy: function (m) {

			this.elements.set(m.elements);

			return this;

		},

		copyPosition: function (m) {

			var te = this.elements;
			var me = m.elements;

			te[12] = me[12];
			te[13] = me[13];
			te[14] = me[14];

			return this;

		},

		extractBasis: function (xAxis, yAxis, zAxis) {

			xAxis.setFromMatrixColumn(this, 0);
			yAxis.setFromMatrixColumn(this, 1);
			zAxis.setFromMatrixColumn(this, 2);

			return this;

		},

		makeBasis: function (xAxis, yAxis, zAxis) {

			this.set(
				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1
			);

			return this;

		},

		extractRotation: function () {

			var v1;

			return function (m) {

				if (v1 === undefined) v1 = new THREE.Vector3();

				var te = this.elements;
				var me = m.elements;

				var scaleX = 1 / v1.setFromMatrixColumn(m, 0).length();
				var scaleY = 1 / v1.setFromMatrixColumn(m, 1).length();
				var scaleZ = 1 / v1.setFromMatrixColumn(m, 2).length();

				te[0] = me[0] * scaleX;
				te[1] = me[1] * scaleX;
				te[2] = me[2] * scaleX;

				te[4] = me[4] * scaleY;
				te[5] = me[5] * scaleY;
				te[6] = me[6] * scaleY;

				te[8] = me[8] * scaleZ;
				te[9] = me[9] * scaleZ;
				te[10] = me[10] * scaleZ;

				return this;

			};

		}(),

		makeRotationFromEuler: function (euler) {

			if (euler instanceof THREE.Euler === false) {

				console.error('THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');

			}

			var te = this.elements;

			var x = euler.x,
				y = euler.y,
				z = euler.z;
			var a = Math.cos(x),
				b = Math.sin(x);
			var c = Math.cos(y),
				d = Math.sin(y);
			var e = Math.cos(z),
				f = Math.sin(z);

			if (euler.order === 'XYZ') {

				var ae = a * e,
					af = a * f,
					be = b * e,
					bf = b * f;

				te[0] = c * e;
				te[4] = -c * f;
				te[8] = d;

				te[1] = af + be * d;
				te[5] = ae - bf * d;
				te[9] = -b * c;

				te[2] = bf - ae * d;
				te[6] = be + af * d;
				te[10] = a * c;

			} else if (euler.order === 'YXZ') {

				var ce = c * e,
					cf = c * f,
					de = d * e,
					df = d * f;

				te[0] = ce + df * b;
				te[4] = de * b - cf;
				te[8] = a * d;

				te[1] = a * f;
				te[5] = a * e;
				te[9] = -b;

				te[2] = cf * b - de;
				te[6] = df + ce * b;
				te[10] = a * c;

			} else if (euler.order === 'ZXY') {

				var ce = c * e,
					cf = c * f,
					de = d * e,
					df = d * f;

				te[0] = ce - df * b;
				te[4] = -a * f;
				te[8] = de + cf * b;

				te[1] = cf + de * b;
				te[5] = a * e;
				te[9] = df - ce * b;

				te[2] = -a * d;
				te[6] = b;
				te[10] = a * c;

			} else if (euler.order === 'ZYX') {

				var ae = a * e,
					af = a * f,
					be = b * e,
					bf = b * f;

				te[0] = c * e;
				te[4] = be * d - af;
				te[8] = ae * d + bf;

				te[1] = c * f;
				te[5] = bf * d + ae;
				te[9] = af * d - be;

				te[2] = -d;
				te[6] = b * c;
				te[10] = a * c;

			} else if (euler.order === 'YZX') {

				var ac = a * c,
					ad = a * d,
					bc = b * c,
					bd = b * d;

				te[0] = c * e;
				te[4] = bd - ac * f;
				te[8] = bc * f + ad;

				te[1] = f;
				te[5] = a * e;
				te[9] = -b * e;

				te[2] = -d * e;
				te[6] = ad * f + bc;
				te[10] = ac - bd * f;

			} else if (euler.order === 'XZY') {

				var ac = a * c,
					ad = a * d,
					bc = b * c,
					bd = b * d;

				te[0] = c * e;
				te[4] = -f;
				te[8] = d * e;

				te[1] = ac * f + bd;
				te[5] = a * e;
				te[9] = ad * f - bc;

				te[2] = bc * f - ad;
				te[6] = b * e;
				te[10] = bd * f + ac;

			}

			// last column
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;

			// bottom row
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		},

		makeRotationFromQuaternion: function (q) {

			var te = this.elements;

			var x = q.x,
				y = q.y,
				z = q.z,
				w = q.w;
			var x2 = x + x,
				y2 = y + y,
				z2 = z + z;
			var xx = x * x2,
				xy = x * y2,
				xz = x * z2;
			var yy = y * y2,
				yz = y * z2,
				zz = z * z2;
			var wx = w * x2,
				wy = w * y2,
				wz = w * z2;

			te[0] = 1 - (yy + zz);
			te[4] = xy - wz;
			te[8] = xz + wy;

			te[1] = xy + wz;
			te[5] = 1 - (xx + zz);
			te[9] = yz - wx;

			te[2] = xz - wy;
			te[6] = yz + wx;
			te[10] = 1 - (xx + yy);

			// last column
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;

			// bottom row
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		},

		lookAt: function () {

			var x, y, z;

			return function (eye, target, up) {

				if (x === undefined) x = new THREE.Vector3();
				if (y === undefined) y = new THREE.Vector3();
				if (z === undefined) z = new THREE.Vector3();

				var te = this.elements;

				z.subVectors(eye, target).normalize();

				if (z.lengthSq() === 0) {

					z.z = 1;

				}

				x.crossVectors(up, z).normalize();

				if (x.lengthSq() === 0) {

					z.x += 0.0001;
					x.crossVectors(up, z).normalize();

				}

				y.crossVectors(z, x);


				te[0] = x.x;
				te[4] = y.x;
				te[8] = z.x;
				te[1] = x.y;
				te[5] = y.y;
				te[9] = z.y;
				te[2] = x.z;
				te[6] = y.z;
				te[10] = z.z;

				return this;

			};

		}(),

		multiply: function (m, n) {

			if (n !== undefined) {

				console.warn('THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');
				return this.multiplyMatrices(m, n);

			}

			return this.multiplyMatrices(this, m);

		},

		premultiply: function (m) {

			return this.multiplyMatrices(m, this);

		},

		multiplyMatrices: function (a, b) {

			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;

			var a11 = ae[0],
				a12 = ae[4],
				a13 = ae[8],
				a14 = ae[12];
			var a21 = ae[1],
				a22 = ae[5],
				a23 = ae[9],
				a24 = ae[13];
			var a31 = ae[2],
				a32 = ae[6],
				a33 = ae[10],
				a34 = ae[14];
			var a41 = ae[3],
				a42 = ae[7],
				a43 = ae[11],
				a44 = ae[15];

			var b11 = be[0],
				b12 = be[4],
				b13 = be[8],
				b14 = be[12];
			var b21 = be[1],
				b22 = be[5],
				b23 = be[9],
				b24 = be[13];
			var b31 = be[2],
				b32 = be[6],
				b33 = be[10],
				b34 = be[14];
			var b41 = be[3],
				b42 = be[7],
				b43 = be[11],
				b44 = be[15];

			te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return this;

		},

		multiplyToArray: function (a, b, r) {

			var te = this.elements;

			this.multiplyMatrices(a, b);

			r[0] = te[0];
			r[1] = te[1];
			r[2] = te[2];
			r[3] = te[3];
			r[4] = te[4];
			r[5] = te[5];
			r[6] = te[6];
			r[7] = te[7];
			r[8] = te[8];
			r[9] = te[9];
			r[10] = te[10];
			r[11] = te[11];
			r[12] = te[12];
			r[13] = te[13];
			r[14] = te[14];
			r[15] = te[15];

			return this;

		},

		multiplyScalar: function (s) {

			var te = this.elements;

			te[0] *= s;
			te[4] *= s;
			te[8] *= s;
			te[12] *= s;
			te[1] *= s;
			te[5] *= s;
			te[9] *= s;
			te[13] *= s;
			te[2] *= s;
			te[6] *= s;
			te[10] *= s;
			te[14] *= s;
			te[3] *= s;
			te[7] *= s;
			te[11] *= s;
			te[15] *= s;

			return this;

		},

		applyToVector3Array: function () {

			var v1;

			return function (array, offset, length) {

				if (v1 === undefined) v1 = new THREE.Vector3();
				if (offset === undefined) offset = 0;
				if (length === undefined) length = array.length;

				for (var i = 0, j = offset; i < length; i += 3, j += 3) {

					v1.fromArray(array, j);
					v1.applyMatrix4(this);
					v1.toArray(array, j);

				}

				return array;

			};

		}(),

		applyToBuffer: function () {

			var v1;

			return function applyToBuffer(buffer, offset, length) {

				if (v1 === undefined) v1 = new THREE.Vector3();
				if (offset === undefined) offset = 0;
				if (length === undefined) length = buffer.length / buffer.itemSize;

				for (var i = 0, j = offset; i < length; i++, j++) {

					v1.x = buffer.getX(j);
					v1.y = buffer.getY(j);
					v1.z = buffer.getZ(j);

					v1.applyMatrix4(this);

					buffer.setXYZ(v1.x, v1.y, v1.z);

				}

				return buffer;

			};

		}(),

		determinant: function () {

			var te = this.elements;

			var n11 = te[0],
				n12 = te[4],
				n13 = te[8],
				n14 = te[12];
			var n21 = te[1],
				n22 = te[5],
				n23 = te[9],
				n24 = te[13];
			var n31 = te[2],
				n32 = te[6],
				n33 = te[10],
				n34 = te[14];
			var n41 = te[3],
				n42 = te[7],
				n43 = te[11],
				n44 = te[15];

			//TODO: make this more efficient
			//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return (
				n41 * (+n14 * n23 * n32 -
					n13 * n24 * n32 -
					n14 * n22 * n33 +
					n12 * n24 * n33 +
					n13 * n22 * n34 -
					n12 * n23 * n34
				) +
				n42 * (+n11 * n23 * n34 -
					n11 * n24 * n33 +
					n14 * n21 * n33 -
					n13 * n21 * n34 +
					n13 * n24 * n31 -
					n14 * n23 * n31
				) +
				n43 * (+n11 * n24 * n32 -
					n11 * n22 * n34 -
					n14 * n21 * n32 +
					n12 * n21 * n34 +
					n14 * n22 * n31 -
					n12 * n24 * n31
				) +
				n44 * (-n13 * n22 * n31 -
					n11 * n23 * n32 +
					n11 * n22 * n33 +
					n13 * n21 * n32 -
					n12 * n21 * n33 +
					n12 * n23 * n31
				)

			);

		},

		transpose: function () {

			var te = this.elements;
			var tmp;

			tmp = te[1];
			te[1] = te[4];
			te[4] = tmp;
			tmp = te[2];
			te[2] = te[8];
			te[8] = tmp;
			tmp = te[6];
			te[6] = te[9];
			te[9] = tmp;

			tmp = te[3];
			te[3] = te[12];
			te[12] = tmp;
			tmp = te[7];
			te[7] = te[13];
			te[13] = tmp;
			tmp = te[11];
			te[11] = te[14];
			te[14] = tmp;

			return this;

		},

		flattenToArrayOffset: function (array, offset) {

			console.warn("THREE.Matrix3: .flattenToArrayOffset is deprecated " +
				"- just use .toArray instead.");

			return this.toArray(array, offset);

		},

		getPosition: function () {

			var v1;

			return function () {

				if (v1 === undefined) v1 = new THREE.Vector3();
				console.warn('THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.');

				return v1.setFromMatrixColumn(this, 3);

			};

		}(),

		setPosition: function (v) {

			var te = this.elements;

			te[12] = v.x;
			te[13] = v.y;
			te[14] = v.z;

			return this;

		},

		getInverse: function (m, throwOnDegenerate) {

			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			var te = this.elements,
				me = m.elements,

				n11 = me[0],
				n21 = me[1],
				n31 = me[2],
				n41 = me[3],
				n12 = me[4],
				n22 = me[5],
				n32 = me[6],
				n42 = me[7],
				n13 = me[8],
				n23 = me[9],
				n33 = me[10],
				n43 = me[11],
				n14 = me[12],
				n24 = me[13],
				n34 = me[14],
				n44 = me[15],

				t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
				t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
				t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
				t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

			var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if (det === 0) {

				var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";

				if (throwOnDegenerate || false) {

					throw new Error(msg);

				} else {

					console.warn(msg);

				}

				return this.identity();

			}

			te[0] = t11;
			te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
			te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
			te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;

			te[4] = t12;
			te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
			te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
			te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;

			te[8] = t13;
			te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
			te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
			te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;

			te[12] = t14;
			te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
			te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
			te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

			return this.multiplyScalar(1 / det);

		},

		scale: function (v) {

			var te = this.elements;
			var x = v.x,
				y = v.y,
				z = v.z;

			te[0] *= x;
			te[4] *= y;
			te[8] *= z;
			te[1] *= x;
			te[5] *= y;
			te[9] *= z;
			te[2] *= x;
			te[6] *= y;
			te[10] *= z;
			te[3] *= x;
			te[7] *= y;
			te[11] *= z;

			return this;

		},

		getMaxScaleOnAxis: function () {

			var te = this.elements;

			var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
			var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
			var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

			return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));

		},

		makeTranslation: function (x, y, z) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationX: function (theta) {

			var c = Math.cos(theta),
				s = Math.sin(theta);

			this.set(

				1, 0, 0, 0,
				0, c, -s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationY: function (theta) {

			var c = Math.cos(theta),
				s = Math.sin(theta);

			this.set(

				c, 0, s, 0,
				0, 1, 0, 0, -s, 0, c, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationZ: function (theta) {

			var c = Math.cos(theta),
				s = Math.sin(theta);

			this.set(

				c, -s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationAxis: function (axis, angle) {

			// Based on http://www.gamedev.net/reference/articles/article1199.asp

			var c = Math.cos(angle);
			var s = Math.sin(angle);
			var t = 1 - c;
			var x = axis.x,
				y = axis.y,
				z = axis.z;
			var tx = t * x,
				ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeScale: function (x, y, z) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		},

		compose: function (position, quaternion, scale) {

			this.makeRotationFromQuaternion(quaternion);
			this.scale(scale);
			this.setPosition(position);

			return this;

		},

		decompose: function () {

			var vector, matrix;

			return function (position, quaternion, scale) {

				if (vector === undefined) vector = new THREE.Vector3();
				if (matrix === undefined) matrix = new THREE.Matrix4();

				var te = this.elements;

				var sx = vector.set(te[0], te[1], te[2]).length();
				var sy = vector.set(te[4], te[5], te[6]).length();
				var sz = vector.set(te[8], te[9], te[10]).length();

				// if determine is negative, we need to invert one scale
				var det = this.determinant();
				if (det < 0) {

					sx = -sx;

				}

				position.x = te[12];
				position.y = te[13];
				position.z = te[14];

				// scale the rotation part

				matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()

				var invSX = 1 / sx;
				var invSY = 1 / sy;
				var invSZ = 1 / sz;

				matrix.elements[0] *= invSX;
				matrix.elements[1] *= invSX;
				matrix.elements[2] *= invSX;

				matrix.elements[4] *= invSY;
				matrix.elements[5] *= invSY;
				matrix.elements[6] *= invSY;

				matrix.elements[8] *= invSZ;
				matrix.elements[9] *= invSZ;
				matrix.elements[10] *= invSZ;

				quaternion.setFromRotationMatrix(matrix);

				scale.x = sx;
				scale.y = sy;
				scale.z = sz;

				return this;

			};

		}(),

		makeFrustum: function (left, right, bottom, top, near, far) {

			var te = this.elements;
			var x = 2 * near / (right - left);
			var y = 2 * near / (top - bottom);

			var a = (right + left) / (right - left);
			var b = (top + bottom) / (top - bottom);
			var c = -(far + near) / (far - near);
			var d = -2 * far * near / (far - near);

			te[0] = x;
			te[4] = 0;
			te[8] = a;
			te[12] = 0;
			te[1] = 0;
			te[5] = y;
			te[9] = b;
			te[13] = 0;
			te[2] = 0;
			te[6] = 0;
			te[10] = c;
			te[14] = d;
			te[3] = 0;
			te[7] = 0;
			te[11] = -1;
			te[15] = 0;

			return this;

		},

		makePerspective: function (fov, aspect, near, far) {

			var ymax = near * Math.tan(THREE.Math.DEG2RAD * fov * 0.5);
			var ymin = -ymax;
			var xmin = ymin * aspect;
			var xmax = ymax * aspect;

			return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);

		},

		makeOrthographic: function (left, right, top, bottom, near, far) {

			var te = this.elements;
			var w = 1.0 / (right - left);
			var h = 1.0 / (top - bottom);
			var p = 1.0 / (far - near);

			var x = (right + left) * w;
			var y = (top + bottom) * h;
			var z = (far + near) * p;

			te[0] = 2 * w;
			te[4] = 0;
			te[8] = 0;
			te[12] = -x;
			te[1] = 0;
			te[5] = 2 * h;
			te[9] = 0;
			te[13] = -y;
			te[2] = 0;
			te[6] = 0;
			te[10] = -2 * p;
			te[14] = -z;
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;
			te[15] = 1;

			return this;

		},

		equals: function (matrix) {

			var te = this.elements;
			var me = matrix.elements;

			for (var i = 0; i < 16; i++) {

				if (te[i] !== me[i]) return false;

			}

			return true;

		},

		fromArray: function (array) {

			this.elements.set(array);

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			var te = this.elements;

			array[offset] = te[0];
			array[offset + 1] = te[1];
			array[offset + 2] = te[2];
			array[offset + 3] = te[3];

			array[offset + 4] = te[4];
			array[offset + 5] = te[5];
			array[offset + 6] = te[6];
			array[offset + 7] = te[7];

			array[offset + 8] = te[8];
			array[offset + 9] = te[9];
			array[offset + 10] = te[10];
			array[offset + 11] = te[11];

			array[offset + 12] = te[12];
			array[offset + 13] = te[13];
			array[offset + 14] = te[14];
			array[offset + 15] = te[15];

			return array;

		}

	};

	// File:../dev/three/math/Ray.js

	/**
	 * @author bhouston / http://clara.io
	 */

	THREE.Ray = function (origin, direction) {

		this.origin = (origin !== undefined) ? origin : new THREE.Vector3();
		this.direction = (direction !== undefined) ? direction : new THREE.Vector3();

	};

	THREE.Ray.prototype = {

		constructor: THREE.Ray,

		set: function (origin, direction) {

			this.origin.copy(origin);
			this.direction.copy(direction);

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (ray) {

			this.origin.copy(ray.origin);
			this.direction.copy(ray.direction);

			return this;

		},

		at: function (t, optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();

			return result.copy(this.direction).multiplyScalar(t).add(this.origin);

		},

		lookAt: function (v) {

			this.direction.copy(v).sub(this.origin).normalize();

		},

		recast: function () {

			var v1 = new THREE.Vector3();

			return function (t) {

				this.origin.copy(this.at(t, v1));

				return this;

			};

		}(),

		closestPointToPoint: function (point, optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			result.subVectors(point, this.origin);
			var directionDistance = result.dot(this.direction);

			if (directionDistance < 0) {

				return result.copy(this.origin);

			}

			return result.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);

		},

		distanceToPoint: function (point) {

			return Math.sqrt(this.distanceSqToPoint(point));

		},

		distanceSqToPoint: function () {

			var v1 = new THREE.Vector3();

			return function (point) {

				var directionDistance = v1.subVectors(point, this.origin).dot(this.direction);

				// point behind the ray

				if (directionDistance < 0) {

					return this.origin.distanceToSquared(point);

				}

				v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);

				return v1.distanceToSquared(point);

			};

		}(),

		distanceSqToSegment: function () {

			var segCenter = new THREE.Vector3();
			var segDir = new THREE.Vector3();
			var diff = new THREE.Vector3();

			return function (v0, v1, optionalPointOnRay, optionalPointOnSegment) {

				// from http://www.geometrictools.com/LibMathematics/Distance/Wm5DistRay3Segment3.cpp
				// It returns the min distance between the ray and the segment
				// defined by v0 and v1
				// It can also set two optional targets :
				// - The closest point on the ray
				// - The closest point on the segment

				segCenter.copy(v0).add(v1).multiplyScalar(0.5);
				segDir.copy(v1).sub(v0).normalize();
				diff.copy(this.origin).sub(segCenter);

				var segExtent = v0.distanceTo(v1) * 0.5;
				var a01 = -this.direction.dot(segDir);
				var b0 = diff.dot(this.direction);
				var b1 = -diff.dot(segDir);
				var c = diff.lengthSq();
				var det = Math.abs(1 - a01 * a01);
				var s0, s1, sqrDist, extDet;

				if (det > 0) {

					// The ray and segment are not parallel.

					s0 = a01 * b1 - b0;
					s1 = a01 * b0 - b1;
					extDet = segExtent * det;

					if (s0 >= 0) {

						if (s1 >= -extDet) {

							if (s1 <= extDet) {

								// region 0
								// Minimum at interior points of ray and segment.

								var invDet = 1 / det;
								s0 *= invDet;
								s1 *= invDet;
								sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;

							} else {

								// region 1

								s1 = segExtent;
								s0 = Math.max(0, -(a01 * s1 + b0));
								sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;

							}

						} else {

							// region 5

							s1 = -segExtent;
							s0 = Math.max(0, -(a01 * s1 + b0));
							sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;

						}

					} else {

						if (s1 <= -extDet) {

							// region 4

							s0 = Math.max(0, -(-a01 * segExtent + b0));
							s1 = (s0 > 0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
							sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;

						} else if (s1 <= extDet) {

							// region 3

							s0 = 0;
							s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
							sqrDist = s1 * (s1 + 2 * b1) + c;

						} else {

							// region 2

							s0 = Math.max(0, -(a01 * segExtent + b0));
							s1 = (s0 > 0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
							sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;

						}

					}

				} else {

					// Ray and segment are parallel.

					s1 = (a01 > 0) ? -segExtent : segExtent;
					s0 = Math.max(0, -(a01 * s1 + b0));
					sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;

				}

				if (optionalPointOnRay) {

					optionalPointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);

				}

				if (optionalPointOnSegment) {

					optionalPointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);

				}

				return sqrDist;

			};

		}(),

		intersectSphere: function () {

			var v1 = new THREE.Vector3();

			return function (sphere, optionalTarget) {

				v1.subVectors(sphere.center, this.origin);
				var tca = v1.dot(this.direction);
				var d2 = v1.dot(v1) - tca * tca;
				var radius2 = sphere.radius * sphere.radius;

				if (d2 > radius2) return null;

				var thc = Math.sqrt(radius2 - d2);

				// t0 = first intersect point - entrance on front of sphere
				var t0 = tca - thc;

				// t1 = second intersect point - exit point on back of sphere
				var t1 = tca + thc;

				// test to see if both t0 and t1 are behind the ray - if so, return null
				if (t0 < 0 && t1 < 0) return null;

				// test to see if t0 is behind the ray:
				// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
				// in order to always return an intersect point that is in front of the ray.
				if (t0 < 0) return this.at(t1, optionalTarget);

				// else t0 is in front of the ray, so return the first collision point scaled by t0
				return this.at(t0, optionalTarget);

			};

		}(),

		intersectsSphere: function (sphere) {

			return this.distanceToPoint(sphere.center) <= sphere.radius;

		},

		distanceToPlane: function (plane) {

			var denominator = plane.normal.dot(this.direction);

			if (denominator === 0) {

				// line is coplanar, return origin
				if (plane.distanceToPoint(this.origin) === 0) {

					return 0;

				}

				// Null is preferable to undefined since undefined means.... it is undefined

				return null;

			}

			var t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;

			// Return if the ray never intersects the plane

			return t >= 0 ? t : null;

		},

		intersectPlane: function (plane, optionalTarget) {

			var t = this.distanceToPlane(plane);

			if (t === null) {

				return null;

			}

			return this.at(t, optionalTarget);

		},



		intersectsPlane: function (plane) {

			// check if the ray lies on the plane first

			var distToPoint = plane.distanceToPoint(this.origin);

			if (distToPoint === 0) {

				return true;

			}

			var denominator = plane.normal.dot(this.direction);

			if (denominator * distToPoint < 0) {

				return true;

			}

			// ray origin is behind the plane (and is pointing behind it)

			return false;

		},

		intersectBox: function (box, optionalTarget) {

			var tmin, tmax, tymin, tymax, tzmin, tzmax;

			var invdirx = 1 / this.direction.x,
				invdiry = 1 / this.direction.y,
				invdirz = 1 / this.direction.z;

			var origin = this.origin;

			if (invdirx >= 0) {

				tmin = (box.min.x - origin.x) * invdirx;
				tmax = (box.max.x - origin.x) * invdirx;

			} else {

				tmin = (box.max.x - origin.x) * invdirx;
				tmax = (box.min.x - origin.x) * invdirx;

			}

			if (invdiry >= 0) {

				tymin = (box.min.y - origin.y) * invdiry;
				tymax = (box.max.y - origin.y) * invdiry;

			} else {

				tymin = (box.max.y - origin.y) * invdiry;
				tymax = (box.min.y - origin.y) * invdiry;

			}

			if ((tmin > tymax) || (tymin > tmax)) return null;

			// These lines also handle the case where tmin or tmax is NaN
			// (result of 0 * Infinity). x !== x returns true if x is NaN

			if (tymin > tmin || tmin !== tmin) tmin = tymin;

			if (tymax < tmax || tmax !== tmax) tmax = tymax;

			if (invdirz >= 0) {

				tzmin = (box.min.z - origin.z) * invdirz;
				tzmax = (box.max.z - origin.z) * invdirz;

			} else {

				tzmin = (box.max.z - origin.z) * invdirz;
				tzmax = (box.min.z - origin.z) * invdirz;

			}

			if ((tmin > tzmax) || (tzmin > tmax)) return null;

			if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

			if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

			//return point closest to the ray (positive side)

			if (tmax < 0) return null;

			return this.at(tmin >= 0 ? tmin : tmax, optionalTarget);

		},

		intersectsBox: (function () {

			var v = new THREE.Vector3();

			return function (box) {

				return this.intersectBox(box, v) !== null;

			};

		})(),

		intersectTriangle: function () {

			// Compute the offset origin, edges, and normal.
			var diff = new THREE.Vector3();
			var edge1 = new THREE.Vector3();
			var edge2 = new THREE.Vector3();
			var normal = new THREE.Vector3();

			return function (a, b, c, backfaceCulling, optionalTarget) {

				// from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

				edge1.subVectors(b, a);
				edge2.subVectors(c, a);
				normal.crossVectors(edge1, edge2);

				// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
				// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
				//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
				//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
				//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
				var DdN = this.direction.dot(normal);
				var sign;

				if (DdN > 0) {

					if (backfaceCulling) return null;
					sign = 1;

				} else if (DdN < 0) {

					sign = -1;
					DdN = -DdN;

				} else {

					return null;

				}

				diff.subVectors(this.origin, a);
				var DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));

				// b1 < 0, no intersection
				if (DdQxE2 < 0) {

					return null;

				}

				var DdE1xQ = sign * this.direction.dot(edge1.cross(diff));

				// b2 < 0, no intersection
				if (DdE1xQ < 0) {

					return null;

				}

				// b1+b2 > 1, no intersection
				if (DdQxE2 + DdE1xQ > DdN) {

					return null;

				}

				// Line intersects triangle, check if ray does.
				var QdN = -sign * diff.dot(normal);

				// t < 0, no intersection
				if (QdN < 0) {

					return null;

				}

				// Ray intersects triangle.
				return this.at(QdN / DdN, optionalTarget);

			};

		}(),

		applyMatrix4: function (matrix4) {

			this.direction.add(this.origin).applyMatrix4(matrix4);
			this.origin.applyMatrix4(matrix4);
			this.direction.sub(this.origin);
			this.direction.normalize();

			return this;

		},

		equals: function (ray) {

			return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);

		}

	};
	// File:../dev/three/math/Sphere.js

	/**
	 * @author bhouston / http://clara.io
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Sphere = function (center, radius) {

		this.center = (center !== undefined) ? center : new THREE.Vector3();
		this.radius = (radius !== undefined) ? radius : 0;

	};

	THREE.Sphere.prototype = {

		constructor: THREE.Sphere,

		set: function (center, radius) {

			this.center.copy(center);
			this.radius = radius;

			return this;

		},

		setFromPoints: function () {

			var box = new THREE.Box3();

			return function (points, optionalCenter) {

				var center = this.center;

				if (optionalCenter !== undefined) {

					center.copy(optionalCenter);

				} else {

					box.setFromPoints(points).center(center);

				}

				var maxRadiusSq = 0;

				for (var i = 0, il = points.length; i < il; i++) {

					maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));

				}

				this.radius = Math.sqrt(maxRadiusSq);

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (sphere) {

			this.center.copy(sphere.center);
			this.radius = sphere.radius;

			return this;

		},

		empty: function () {

			return (this.radius <= 0);

		},

		containsPoint: function (point) {

			return (point.distanceToSquared(this.center) <= (this.radius * this.radius));

		},

		distanceToPoint: function (point) {

			return (point.distanceTo(this.center) - this.radius);

		},

		intersectsSphere: function (sphere) {

			var radiusSum = this.radius + sphere.radius;

			return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);

		},

		intersectsBox: function (box) {

			return box.intersectsSphere(this);

		},

		intersectsPlane: function (plane) {

			// We use the following equation to compute the signed distance from
			// the center of the sphere to the plane.
			//
			// distance = q * n - d
			//
			// If this distance is greater than the radius of the sphere,
			// then there is no intersection.

			return Math.abs(this.center.dot(plane.normal) - plane.constant) <= this.radius;

		},

		clampPoint: function (point, optionalTarget) {

			var deltaLengthSq = this.center.distanceToSquared(point);

			var result = optionalTarget || new THREE.Vector3();

			result.copy(point);

			if (deltaLengthSq > (this.radius * this.radius)) {

				result.sub(this.center).normalize();
				result.multiplyScalar(this.radius).add(this.center);

			}

			return result;

		},

		getBoundingBox: function (optionalTarget) {

			var box = optionalTarget || new THREE.Box3();

			box.set(this.center, this.center);
			box.expandByScalar(this.radius);

			return box;

		},

		applyMatrix4: function (matrix) {

			this.center.applyMatrix4(matrix);
			this.radius = this.radius * matrix.getMaxScaleOnAxis();

			return this;

		},

		translate: function (offset) {

			this.center.add(offset);

			return this;

		},

		equals: function (sphere) {

			return sphere.center.equals(this.center) && (sphere.radius === this.radius);

		}

	};

	// File:../dev/three/math/Frustum.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 * @author bhouston / http://clara.io
	 */

	THREE.Frustum = function (p0, p1, p2, p3, p4, p5) {

		this.planes = [

			(p0 !== undefined) ? p0 : new THREE.Plane(),
			(p1 !== undefined) ? p1 : new THREE.Plane(),
			(p2 !== undefined) ? p2 : new THREE.Plane(),
			(p3 !== undefined) ? p3 : new THREE.Plane(),
			(p4 !== undefined) ? p4 : new THREE.Plane(),
			(p5 !== undefined) ? p5 : new THREE.Plane()

		];

	};

	THREE.Frustum.prototype = {

		constructor: THREE.Frustum,

		set: function (p0, p1, p2, p3, p4, p5) {

			var planes = this.planes;

			planes[0].copy(p0);
			planes[1].copy(p1);
			planes[2].copy(p2);
			planes[3].copy(p3);
			planes[4].copy(p4);
			planes[5].copy(p5);

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (frustum) {

			var planes = this.planes;

			for (var i = 0; i < 6; i++) {

				planes[i].copy(frustum.planes[i]);

			}

			return this;

		},

		setFromMatrix: function (m) {

			var planes = this.planes;
			var me = m.elements;
			var me0 = me[0],
				me1 = me[1],
				me2 = me[2],
				me3 = me[3];
			var me4 = me[4],
				me5 = me[5],
				me6 = me[6],
				me7 = me[7];
			var me8 = me[8],
				me9 = me[9],
				me10 = me[10],
				me11 = me[11];
			var me12 = me[12],
				me13 = me[13],
				me14 = me[14],
				me15 = me[15];

			planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
			planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
			planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
			planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
			planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
			planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

			return this;

		},

		intersectsObject: function () {

			var sphere = new THREE.Sphere();

			return function (object) {

				var geometry = object.geometry;

				if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

				sphere.copy(geometry.boundingSphere);
				sphere.applyMatrix4(object.matrixWorld);

				return this.intersectsSphere(sphere);

			};

		}(),

		intersectsSphere: function (sphere) {

			var planes = this.planes;
			var center = sphere.center;
			var negRadius = -sphere.radius;

			for (var i = 0; i < 6; i++) {

				var distance = planes[i].distanceToPoint(center);

				if (distance < negRadius) {

					return false;

				}

			}

			return true;

		},

		intersectsBox: function () {

			var p1 = new THREE.Vector3(),
				p2 = new THREE.Vector3();

			return function (box) {

				var planes = this.planes;

				for (var i = 0; i < 6; i++) {

					var plane = planes[i];

					p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
					p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
					p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
					p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
					p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
					p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

					var d1 = plane.distanceToPoint(p1);
					var d2 = plane.distanceToPoint(p2);

					// if both outside plane, no intersection

					if (d1 < 0 && d2 < 0) {

						return false;

					}

				}

				return true;

			};

		}(),


		containsPoint: function (point) {

			var planes = this.planes;

			for (var i = 0; i < 6; i++) {

				if (planes[i].distanceToPoint(point) < 0) {

					return false;

				}

			}

			return true;

		}

	};

	// File:../dev/three/math/Plane.js

	/**
	 * @author bhouston / http://clara.io
	 */

	THREE.Plane = function (normal, constant) {

		this.normal = (normal !== undefined) ? normal : new THREE.Vector3(1, 0, 0);
		this.constant = (constant !== undefined) ? constant : 0;

	};

	THREE.Plane.prototype = {

		constructor: THREE.Plane,

		set: function (normal, constant) {

			this.normal.copy(normal);
			this.constant = constant;

			return this;

		},

		setComponents: function (x, y, z, w) {

			this.normal.set(x, y, z);
			this.constant = w;

			return this;

		},

		setFromNormalAndCoplanarPoint: function (normal, point) {

			this.normal.copy(normal);
			this.constant = -point.dot(this.normal); // must be this.normal, not normal, as this.normal is normalized

			return this;

		},

		setFromCoplanarPoints: function () {

			var v1 = new THREE.Vector3();
			var v2 = new THREE.Vector3();

			return function (a, b, c) {

				var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();

				// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

				this.setFromNormalAndCoplanarPoint(normal, a);

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (plane) {

			this.normal.copy(plane.normal);
			this.constant = plane.constant;

			return this;

		},

		normalize: function () {

			// Note: will lead to a divide by zero if the plane is invalid.

			var inverseNormalLength = 1.0 / this.normal.length();
			this.normal.multiplyScalar(inverseNormalLength);
			this.constant *= inverseNormalLength;

			return this;

		},

		negate: function () {

			this.constant *= -1;
			this.normal.negate();

			return this;

		},

		distanceToPoint: function (point) {

			return this.normal.dot(point) + this.constant;

		},

		distanceToSphere: function (sphere) {

			return this.distanceToPoint(sphere.center) - sphere.radius;

		},

		projectPoint: function (point, optionalTarget) {

			return this.orthoPoint(point, optionalTarget).sub(point).negate();

		},

		orthoPoint: function (point, optionalTarget) {

			var perpendicularMagnitude = this.distanceToPoint(point);

			var result = optionalTarget || new THREE.Vector3();
			return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);

		},

		intersectLine: function () {

			var v1 = new THREE.Vector3();

			return function (line, optionalTarget) {

				var result = optionalTarget || new THREE.Vector3();

				var direction = line.delta(v1);

				var denominator = this.normal.dot(direction);

				if (denominator === 0) {

					// line is coplanar, return origin
					if (this.distanceToPoint(line.start) === 0) {

						return result.copy(line.start);

					}

					// Unsure if this is the correct method to handle this case.
					return undefined;

				}

				var t = -(line.start.dot(this.normal) + this.constant) / denominator;

				if (t < 0 || t > 1) {

					return undefined;

				}

				return result.copy(direction).multiplyScalar(t).add(line.start);

			};

		}(),

		intersectsLine: function (line) {

			// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

			var startSign = this.distanceToPoint(line.start);
			var endSign = this.distanceToPoint(line.end);

			return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);

		},

		intersectsBox: function (box) {

			return box.intersectsPlane(this);

		},

		intersectsSphere: function (sphere) {

			return sphere.intersectsPlane(this);

		},

		coplanarPoint: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.copy(this.normal).multiplyScalar(-this.constant);

		},

		applyMatrix4: function () {

			var v1 = new THREE.Vector3();
			var m1 = new THREE.Matrix3();

			return function (matrix, optionalNormalMatrix) {

				var referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix);

				// transform normal based on theory here:
				// http://www.songho.ca/opengl/gl_normaltransform.html
				var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);
				var normal = this.normal.applyMatrix3(normalMatrix).normalize();

				// recalculate constant (like in setFromNormalAndCoplanarPoint)
				this.constant = -referencePoint.dot(normal);

				return this;

			};

		}(),

		translate: function (offset) {

			this.constant = this.constant - offset.dot(this.normal);

			return this;

		},

		equals: function (plane) {

			return plane.normal.equals(this.normal) && (plane.constant === this.constant);

		}

	};

	// File:../dev/three/math/Spherical.js

	/**
	 * @author bhouston / http://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 *
	 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 *
	 * The poles (phi) are at the positive and negative y axis.
	 * The equator starts at positive z.
	 */

	THREE.Spherical = function (radius, phi, theta) {

		this.radius = (radius !== undefined) ? radius : 1.0;
		this.phi = (phi !== undefined) ? phi : 0; // up / down towards top and bottom pole
		this.theta = (theta !== undefined) ? theta : 0; // around the equator of the sphere

		return this;

	};

	THREE.Spherical.prototype = {

		constructor: THREE.Spherical,

		set: function (radius, phi, theta) {

			this.radius = radius;
			this.phi = phi;
			this.theta = theta;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (other) {

			this.radius.copy(other.radius);
			this.phi.copy(other.phi);
			this.theta.copy(other.theta);

			return this;

		},

		// restrict phi to be betwee EPS and PI-EPS
		makeSafe: function () {

			var EPS = 0.000001;
			this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

		},

		setFromVector3: function (vec3) {

			this.radius = vec3.length();

			if (this.radius === 0) {

				this.theta = 0;
				this.phi = 0;

			} else {

				this.theta = Math.atan2(vec3.x, vec3.z); // equator angle around y-up axis
				this.phi = Math.acos(THREE.Math.clamp(vec3.y / this.radius, -1, 1)); // polar angle

			}

			return this;

		},

	};

	// File:../dev/three/math/Math.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Math = {

		DEG2RAD: Math.PI / 180,
		RAD2DEG: 180 / Math.PI,

		generateUUID: function () {

			// http://www.broofa.com/Tools/Math.uuid.htm

			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid = new Array(36);
			var rnd = 0,
				r;

			return function () {

				for (var i = 0; i < 36; i++) {

					if (i === 8 || i === 13 || i === 18 || i === 23) {

						uuid[i] = '-';

					} else if (i === 14) {

						uuid[i] = '4';

					} else {

						if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
						r = rnd & 0xf;
						rnd = rnd >> 4;
						uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];

					}

				}

				return uuid.join('');

			};

		}(),

		clamp: function (value, min, max) {

			return Math.max(min, Math.min(max, value));

		},

		// compute euclidian modulo of m % n
		// https://en.wikipedia.org/wiki/Modulo_operation

		euclideanModulo: function (n, m) {

			return ((n % m) + m) % m;

		},

		// Linear mapping from range <a1, a2> to range <b1, b2>

		mapLinear: function (x, a1, a2, b1, b2) {

			return b1 + (x - a1) * (b2 - b1) / (a2 - a1);

		},

		// http://en.wikipedia.org/wiki/Smoothstep

		smoothstep: function (x, min, max) {

			if (x <= min) return 0;
			if (x >= max) return 1;

			x = (x - min) / (max - min);

			return x * x * (3 - 2 * x);

		},

		smootherstep: function (x, min, max) {

			if (x <= min) return 0;
			if (x >= max) return 1;

			x = (x - min) / (max - min);

			return x * x * x * (x * (x * 6 - 15) + 10);

		},

		random16: function () {

			console.warn('THREE.Math.random16() has been deprecated. Use Math.random() instead.');
			return Math.random();

		},

		// Random integer from <low, high> interval

		randInt: function (low, high) {

			return low + Math.floor(Math.random() * (high - low + 1));

		},

		// Random float from <low, high> interval

		randFloat: function (low, high) {

			return low + Math.random() * (high - low);

		},

		// Random float from <-range/2, range/2> interval

		randFloatSpread: function (range) {

			return range * (0.5 - Math.random());

		},

		degToRad: function (degrees) {

			return degrees * THREE.Math.DEG2RAD;

		},

		radToDeg: function (radians) {

			return radians * THREE.Math.RAD2DEG;

		},

		isPowerOfTwo: function (value) {

			return (value & (value - 1)) === 0 && value !== 0;

		},

		nearestPowerOfTwo: function (value) {

			return Math.pow(2, Math.round(Math.log(value) / Math.LN2));

		},

		nextPowerOfTwo: function (value) {

			value--;
			value |= value >> 1;
			value |= value >> 2;
			value |= value >> 4;
			value |= value >> 8;
			value |= value >> 16;
			value++;

			return value;

		}

	};

	// File:../dev/three/math/Spline.js

	/**
	 * Spline from Tween.js, slightly optimized (and trashed)
	 * http://sole.github.com/tween.js/examples/05_spline.html
	 *
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Spline = function (points) {

		this.points = points;

		var c = [],
			v3 = {
				x: 0,
				y: 0,
				z: 0
			},
			point, intPoint, weight, w2, w3,
			pa, pb, pc, pd;

		this.initFromArray = function (a) {

			this.points = [];

			for (var i = 0; i < a.length; i++) {

				this.points[i] = {
					x: a[i][0],
					y: a[i][1],
					z: a[i][2]
				};

			}

		};

		this.getPoint = function (k) {

			point = (this.points.length - 1) * k;
			intPoint = Math.floor(point);
			weight = point - intPoint;

			c[0] = intPoint === 0 ? intPoint : intPoint - 1;
			c[1] = intPoint;
			c[2] = intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
			c[3] = intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

			pa = this.points[c[0]];
			pb = this.points[c[1]];
			pc = this.points[c[2]];
			pd = this.points[c[3]];

			w2 = weight * weight;
			w3 = weight * w2;

			v3.x = interpolate(pa.x, pb.x, pc.x, pd.x, weight, w2, w3);
			v3.y = interpolate(pa.y, pb.y, pc.y, pd.y, weight, w2, w3);
			v3.z = interpolate(pa.z, pb.z, pc.z, pd.z, weight, w2, w3);

			return v3;

		};

		this.getControlPointsArray = function () {

			var i, p, l = this.points.length,
				coords = [];

			for (i = 0; i < l; i++) {

				p = this.points[i];
				coords[i] = [p.x, p.y, p.z];

			}

			return coords;

		};

		// approximate length by summing linear segments

		this.getLength = function (nSubDivisions) {

			var i, index, nSamples, position,
				point = 0,
				intPoint = 0,
				oldIntPoint = 0,
				oldPosition = new THREE.Vector3(),
				tmpVec = new THREE.Vector3(),
				chunkLengths = [],
				totalLength = 0;

			// first point has 0 length

			chunkLengths[0] = 0;

			if (!nSubDivisions) nSubDivisions = 100;

			nSamples = this.points.length * nSubDivisions;

			oldPosition.copy(this.points[0]);

			for (i = 1; i < nSamples; i++) {

				index = i / nSamples;

				position = this.getPoint(index);
				tmpVec.copy(position);

				totalLength += tmpVec.distanceTo(oldPosition);

				oldPosition.copy(position);

				point = (this.points.length - 1) * index;
				intPoint = Math.floor(point);

				if (intPoint !== oldIntPoint) {

					chunkLengths[intPoint] = totalLength;
					oldIntPoint = intPoint;

				}

			}

			// last point ends with total length

			chunkLengths[chunkLengths.length] = totalLength;

			return {
				chunks: chunkLengths,
				total: totalLength
			};

		};

		this.reparametrizeByArcLength = function (samplingCoef) {

			var i, j,
				index, indexCurrent, indexNext,
				realDistance,
				sampling, position,
				newpoints = [],
				tmpVec = new THREE.Vector3(),
				sl = this.getLength();

			newpoints.push(tmpVec.copy(this.points[0]).clone());

			for (i = 1; i < this.points.length; i++) {

				//tmpVec.copy( this.points[ i - 1 ] );
				//linearDistance = tmpVec.distanceTo( this.points[ i ] );

				realDistance = sl.chunks[i] - sl.chunks[i - 1];

				sampling = Math.ceil(samplingCoef * realDistance / sl.total);

				indexCurrent = (i - 1) / (this.points.length - 1);
				indexNext = i / (this.points.length - 1);

				for (j = 1; j < sampling - 1; j++) {

					index = indexCurrent + j * (1 / sampling) * (indexNext - indexCurrent);

					position = this.getPoint(index);
					newpoints.push(tmpVec.copy(position).clone());

				}

				newpoints.push(tmpVec.copy(this.points[i]).clone());

			}

			this.points = newpoints;

		};

		// Catmull-Rom

		function interpolate(p0, p1, p2, p3, t, t2, t3) {

			var v0 = (p2 - p0) * 0.5,
				v1 = (p3 - p1) * 0.5;

			return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	};

	// File:../dev/three/math/Triangle.js

	/**
	 * @author bhouston / http://clara.io
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Triangle = function (a, b, c) {

		this.a = (a !== undefined) ? a : new THREE.Vector3();
		this.b = (b !== undefined) ? b : new THREE.Vector3();
		this.c = (c !== undefined) ? c : new THREE.Vector3();

	};

	THREE.Triangle.normal = function () {

		var v0 = new THREE.Vector3();

		return function (a, b, c, optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();

			result.subVectors(c, b);
			v0.subVectors(a, b);
			result.cross(v0);

			var resultLengthSq = result.lengthSq();
			if (resultLengthSq > 0) {

				return result.multiplyScalar(1 / Math.sqrt(resultLengthSq));

			}

			return result.set(0, 0, 0);

		};

	}();

	// static/instance method to calculate barycentric coordinates
	// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
	THREE.Triangle.barycoordFromPoint = function () {

		var v0 = new THREE.Vector3();
		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function (point, a, b, c, optionalTarget) {

			v0.subVectors(c, a);
			v1.subVectors(b, a);
			v2.subVectors(point, a);

			var dot00 = v0.dot(v0);
			var dot01 = v0.dot(v1);
			var dot02 = v0.dot(v2);
			var dot11 = v1.dot(v1);
			var dot12 = v1.dot(v2);

			var denom = (dot00 * dot11 - dot01 * dot01);

			var result = optionalTarget || new THREE.Vector3();

			// collinear or singular triangle
			if (denom === 0) {

				// arbitrary location outside of triangle?
				// not sure if this is the best idea, maybe should be returning undefined
				return result.set(-2, -1, -1);

			}

			var invDenom = 1 / denom;
			var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
			var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

			// barycentric coordinates must always sum to 1
			return result.set(1 - u - v, v, u);

		};

	}();

	THREE.Triangle.containsPoint = function () {

		var v1 = new THREE.Vector3();

		return function (point, a, b, c) {

			var result = THREE.Triangle.barycoordFromPoint(point, a, b, c, v1);

			return (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1);

		};

	}();

	THREE.Triangle.prototype = {

		constructor: THREE.Triangle,

		set: function (a, b, c) {

			this.a.copy(a);
			this.b.copy(b);
			this.c.copy(c);

			return this;

		},

		setFromPointsAndIndices: function (points, i0, i1, i2) {

			this.a.copy(points[i0]);
			this.b.copy(points[i1]);
			this.c.copy(points[i2]);

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (triangle) {

			this.a.copy(triangle.a);
			this.b.copy(triangle.b);
			this.c.copy(triangle.c);

			return this;

		},

		area: function () {

			var v0 = new THREE.Vector3();
			var v1 = new THREE.Vector3();

			return function () {

				v0.subVectors(this.c, this.b);
				v1.subVectors(this.a, this.b);

				return v0.cross(v1).length() * 0.5;

			};

		}(),

		midpoint: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();
			return result.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);

		},

		normal: function (optionalTarget) {

			return THREE.Triangle.normal(this.a, this.b, this.c, optionalTarget);

		},

		plane: function (optionalTarget) {

			var result = optionalTarget || new THREE.Plane();

			return result.setFromCoplanarPoints(this.a, this.b, this.c);

		},

		barycoordFromPoint: function (point, optionalTarget) {

			return THREE.Triangle.barycoordFromPoint(point, this.a, this.b, this.c, optionalTarget);

		},

		containsPoint: function (point) {

			return THREE.Triangle.containsPoint(point, this.a, this.b, this.c);

		},

		closestPointToPoint: function () {

			var plane, edgeList, projectedPoint, closestPoint;

			return function closestPointToPoint(point, optionalTarget) {

				if (plane === undefined) {

					plane = new THREE.Plane();
					edgeList = [new THREE.Line3(), new THREE.Line3(), new THREE.Line3()];
					projectedPoint = new THREE.Vector3();
					closestPoint = new THREE.Vector3();

				}

				var result = optionalTarget || new THREE.Vector3();
				var minDistance = Infinity;

				// project the point onto the plane of the triangle

				plane.setFromCoplanarPoints(this.a, this.b, this.c);
				plane.projectPoint(point, projectedPoint);

				// check if the projection lies within the triangle

				if (this.containsPoint(projectedPoint) === true) {

					// if so, this is the closest point

					result.copy(projectedPoint);

				} else {

					// if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices

					edgeList[0].set(this.a, this.b);
					edgeList[1].set(this.b, this.c);
					edgeList[2].set(this.c, this.a);

					for (var i = 0; i < edgeList.length; i++) {

						edgeList[i].closestPointToPoint(projectedPoint, true, closestPoint);

						var distance = projectedPoint.distanceToSquared(closestPoint);

						if (distance < minDistance) {

							minDistance = distance;

							result.copy(closestPoint);

						}

					}

				}

				return result;

			};

		}(),

		equals: function (triangle) {

			return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);

		}

	};

	// File:../dev/three/math/Interpolant.js

	/**
	 * Abstract base class of interpolants over parametric samples.
	 *
	 * The parameter domain is one dimensional, typically the time or a path
	 * along a curve defined by the data.
	 *
	 * The sample values can have any dimensionality and derived classes may
	 * apply special interpretations to the data.
	 *
	 * This class provides the interval seek in a Template Method, deferring
	 * the actual interpolation to derived classes.
	 *
	 * Time complexity is O(1) for linear access crossing at most two points
	 * and O(log N) for random access, where N is the number of positions.
	 *
	 * References:
	 *
	 * 		http://www.oodesign.com/template-method-pattern.html
	 *
	 * @author tschw
	 */

	THREE.Interpolant = function (
		parameterPositions, sampleValues, sampleSize, resultBuffer) {

		this.parameterPositions = parameterPositions;
		this._cachedIndex = 0;

		this.resultBuffer = resultBuffer !== undefined ?
			resultBuffer : new sampleValues.constructor(sampleSize);
		this.sampleValues = sampleValues;
		this.valueSize = sampleSize;

	};

	THREE.Interpolant.prototype = {

		constructor: THREE.Interpolant,

		evaluate: function (t) {

			var pp = this.parameterPositions,
				i1 = this._cachedIndex,

				t1 = pp[i1],
				t0 = pp[i1 - 1];

			validate_interval: {

				seek: {

					var right;

					linear_scan: {
						//- See http://jsperf.com/comparison-to-undefined/3
						//- slower code:
						//-
						//- 				if ( t >= t1 || t1 === undefined ) {
						forward_scan: if (!(t < t1)) {

							for (var giveUpAt = i1 + 2;;) {

								if (t1 === undefined) {

									if (t < t0) break forward_scan;

									// after end

									i1 = pp.length;
									this._cachedIndex = i1;
									return this.afterEnd_(i1 - 1, t, t0);

								}

								if (i1 === giveUpAt) break; // this loop

								t0 = t1;
								t1 = pp[++i1];

								if (t < t1) {

									// we have arrived at the sought interval
									break seek;

								}

							}

							// prepare binary search on the right side of the index
							right = pp.length;
							break linear_scan;

						}

						//- slower code:
						//-					if ( t < t0 || t0 === undefined ) {
						if (!(t >= t0)) {

							// looping?

							var t1global = pp[1];

							if (t < t1global) {

								i1 = 2; // + 1, using the scan for the details
								t0 = t1global;

							}

							// linear reverse scan

							for (var giveUpAt = i1 - 2;;) {

								if (t0 === undefined) {

									// before start

									this._cachedIndex = 0;
									return this.beforeStart_(0, t, t1);

								}

								if (i1 === giveUpAt) break; // this loop

								t1 = t0;
								t0 = pp[--i1 - 1];

								if (t >= t0) {

									// we have arrived at the sought interval
									break seek;

								}

							}

							// prepare binary search on the left side of the index
							right = i1;
							i1 = 0;
							break linear_scan;

						}

						// the interval is valid

						break validate_interval;

					} // linear scan

					// binary search

					while (i1 < right) {

						var mid = (i1 + right) >>> 1;

						if (t < pp[mid]) {

							right = mid;

						} else {

							i1 = mid + 1;

						}

					}

					t1 = pp[i1];
					t0 = pp[i1 - 1];

					// check boundary cases, again

					if (t0 === undefined) {

						this._cachedIndex = 0;
						return this.beforeStart_(0, t, t1);

					}

					if (t1 === undefined) {

						i1 = pp.length;
						this._cachedIndex = i1;
						return this.afterEnd_(i1 - 1, t0, t);

					}

				} // seek

				this._cachedIndex = i1;

				this.intervalChanged_(i1, t0, t1);

			} // validate_interval

			return this.interpolate_(i1, t0, t, t1);

		},

		settings: null, // optional, subclass-specific settings structure
		// Note: The indirection allows central control of many interpolants.

		// --- Protected interface

		DefaultSettings_: {},

		getSettings_: function () {

			return this.settings || this.DefaultSettings_;

		},

		copySampleValue_: function (index) {

			// copies a sample value to the result buffer

			var result = this.resultBuffer,
				values = this.sampleValues,
				stride = this.valueSize,
				offset = index * stride;

			for (var i = 0; i !== stride; ++i) {

				result[i] = values[offset + i];

			}

			return result;

		},

		// Template methods for derived classes:

		interpolate_: function (i1, t0, t, t1) {

			throw new Error("call to abstract method");
			// implementations shall return this.resultBuffer

		},

		intervalChanged_: function (i1, t0, t1) {

			// empty

		}

	};

	Object.assign(THREE.Interpolant.prototype, {

		beforeStart_: //( 0, t, t0 ), returns this.resultBuffer
			THREE.Interpolant.prototype.copySampleValue_,

		afterEnd_: //( N-1, tN-1, t ), returns this.resultBuffer
			THREE.Interpolant.prototype.copySampleValue_

	});

	// File:../dev/three/math/interpolants/CubicInterpolant.js

	/**
	 * Fast and simple cubic spline interpolant.
	 *
	 * It was derived from a Hermitian construction setting the first derivative
	 * at each sample position to the linear slope between neighboring positions
	 * over their parameter interval.
	 *
	 * @author tschw
	 * 
	 * Cubic Hermite spline
	 */

	THREE.CubicInterpolant = function (
		parameterPositions, sampleValues, sampleSize, resultBuffer) {

		THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer);

	};

	// PI_BEGIN

	THREE.CubicInterpolant.prototype =
		Object.assign(Object.create(THREE.Interpolant.prototype), {

			constructor: THREE.CubicInterpolant,

			setTangent: function (inTan, outTan) {
				this.inTangent = inTan;
				this.outTangent = outTan;
			},

			interpolate_: function (i1, t0, t, t1) {

				var result = this.resultBuffer,
					values = this.sampleValues,
					stride = this.valueSize,
					o1 = i1 * stride,
					o0 = o1 - stride;

				if (i1 === 0 || t < t0 || t > t1) {
					throw new Error("i1 === 0 || t < t0 || t > t1");
				}

				var m0 = this.outTangent[i1 - 1];
				var m1 = this.inTangent[i1];
				// 有一个是inf或者-inf，都要按阶梯函数处理
				if (m0 === Infinity || m0 === -Infinity || m1 === Infinity || m1 === -Infinity) {

					for (var i = 0; i !== stride; ++i) {
						result[i] = values[o0 + i];
					}

					return result;
				}

				var dt = t1 - t0;

				var x = (t - t0) / dt;
				var x2 = x * x;
				var x3 = x * x2;

				var h1 = 2 * x3 - 3 * x2 + 1;
				var h2 = x3 - 2 * x2 + x;
				var h3 = -2 * x3 + 3 * x2;
				var h4 = x3 - x2;

				for (var i = 0; i !== stride; ++i) {
					result[i] = h1 * values[o0 + i] + dt * h2 * m0 + h3 * values[o1 + i] + dt * h4 * m1;
				}

				return result;

			}
			// PI_END
		});

	// File:../dev/three/math/interpolants/DiscreteInterpolant.js

	/**
	 *
	 * Interpolant that evaluates to the sample value at the position preceeding
	 * the parameter.
	 *
	 * @author tschw
	 */

	THREE.DiscreteInterpolant = function (
		parameterPositions, sampleValues, sampleSize, resultBuffer) {

		THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer);

	};

	THREE.DiscreteInterpolant.prototype =
		Object.assign(Object.create(THREE.Interpolant.prototype), {

			constructor: THREE.DiscreteInterpolant,

			interpolate_: function (i1, t0, t, t1) {

				return this.copySampleValue_(i1 - 1);

			}

		});

	// File:../dev/three/math/interpolants/LinearInterpolant.js

	/**
	 * @author tschw
	 */

	THREE.LinearInterpolant = function (
		parameterPositions, sampleValues, sampleSize, resultBuffer) {

		THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer);

	};

	THREE.LinearInterpolant.prototype =
		Object.assign(Object.create(THREE.Interpolant.prototype), {

			constructor: THREE.LinearInterpolant,

			interpolate_: function (i1, t0, t, t1) {

				var result = this.resultBuffer,
					values = this.sampleValues,
					stride = this.valueSize,

					offset1 = i1 * stride,
					offset0 = offset1 - stride,

					weight1 = (t - t0) / (t1 - t0),
					weight0 = 1 - weight1;

				for (var i = 0; i !== stride; ++i) {

					result[i] =
						values[offset0 + i] * weight0 +
						values[offset1 + i] * weight1;

				}

				return result;

			}

		});

	// File:../dev/three/math/interpolants/QuaternionLinearInterpolant.js

	/**
	 * Spherical linear unit quaternion interpolant.
	 *
	 * @author tschw
	 */

	THREE.QuaternionLinearInterpolant = function (
		parameterPositions, sampleValues, sampleSize, resultBuffer) {

		THREE.Interpolant.call(
			this, parameterPositions, sampleValues, sampleSize, resultBuffer);

	};

	THREE.QuaternionLinearInterpolant.prototype =
		Object.assign(Object.create(THREE.Interpolant.prototype), {

			constructor: THREE.QuaternionLinearInterpolant,

			interpolate_: function (i1, t0, t, t1) {

				var result = this.resultBuffer,
					values = this.sampleValues,
					stride = this.valueSize,

					offset = i1 * stride,

					alpha = (t - t0) / (t1 - t0);

				for (var end = offset + stride; offset !== end; offset += 4) {

					THREE.Quaternion.slerpFlat(result, 0,
						values, offset - stride, values, offset, alpha);

				}

				return result;

			}

		});

	// File:../dev/three/core/Clock.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Clock = function (autoStart) {

		this.autoStart = (autoStart !== undefined) ? autoStart : true;

		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;

		this.running = false;

	};

	THREE.Clock.prototype = {

		constructor: THREE.Clock,

		start: function () {

			this.startTime = (window.performance || Date).now();

			this.oldTime = this.startTime;
			this.running = true;

		},

		stop: function () {

			this.getElapsedTime();
			this.running = false;

		},

		getElapsedTime: function () {

			this.getDelta();
			return this.elapsedTime;

		},

		getDelta: function () {

			var diff = 0;

			if (this.autoStart && !this.running) {

				this.start();

			}

			if (this.running) {

				var newTime = (window.performance || Date).now();

				diff = (newTime - this.oldTime) / 1000;
				this.oldTime = newTime;

				this.elapsedTime += diff;

			}

			return diff;

		}

	};

	// File:../dev/three/core/EventDispatcher.js

	/**
	 * https://github.com/mrdoob/eventdispatcher.js/
	 */

	THREE.EventDispatcher = function () {};

	THREE.EventDispatcher.prototype = {

		constructor: THREE.EventDispatcher,

		apply: function (object) {

			object.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
			object.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
			object.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
			object.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;

		},

		addEventListener: function (type, listener) {

			if (this._listeners === undefined) this._listeners = {};

			var listeners = this._listeners;

			if (listeners[type] === undefined) {

				listeners[type] = [];

			}

			if (listeners[type].indexOf(listener) === -1) {

				listeners[type].push(listener);

			}

		},

		hasEventListener: function (type, listener) {

			if (this._listeners === undefined) return false;

			var listeners = this._listeners;

			if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {

				return true;

			}

			return false;

		},

		removeEventListener: function (type, listener) {

			if (this._listeners === undefined) return;

			var listeners = this._listeners;
			var listenerArray = listeners[type];

			if (listenerArray !== undefined) {

				var index = listenerArray.indexOf(listener);

				if (index !== -1) {

					listenerArray.splice(index, 1);

				}

			}

		},

		dispatchEvent: function (event) {

			if (this._listeners === undefined) return;

			var listeners = this._listeners;
			var listenerArray = listeners[event.type];

			if (listenerArray !== undefined) {

				event.target = this;

				var array = [];
				var length = listenerArray.length;

				for (var i = 0; i < length; i++) {

					array[i] = listenerArray[i];

				}

				for (var i = 0; i < length; i++) {

					array[i].call(this, event);

				}

			}

		}

	};

	// File:../dev/three/core/Layers.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Layers = function () {

		this.mask = 1;

	};

	THREE.Layers.prototype = {

		constructor: THREE.Layers,

		set: function (channel) {

			this.mask = 1 << channel;

		},

		enable: function (channel) {

			this.mask |= 1 << channel;

		},

		toggle: function (channel) {

			this.mask ^= 1 << channel;

		},

		disable: function (channel) {

			this.mask &= ~(1 << channel);

		},

		test: function (layers) {

			return (this.mask & layers.mask) !== 0;

		}

	};

	// File:../dev/three/core/Raycaster.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author bhouston / http://clara.io/
	 * @author stephomi / http://stephaneginier.com/
	 */

	(function (THREE) {

		THREE.Raycaster = function (origin, direction, near, far) {

			this.ray = new THREE.Ray(origin, direction);
			// direction is assumed to be normalized (for accurate distance calculations)

			this.near = near || 0;
			this.far = far || Infinity;

			this.params = {
				Mesh: {},
				Line: {},
				LOD: {},
				Points: {
					threshold: 1
				},
				Sprite: {}
			};

			Object.defineProperties(this.params, {
				PointCloud: {
					get: function () {
						console.warn('THREE.Raycaster: params.PointCloud has been renamed to params.Points.');
						return this.Points;
					}
				}
			});

		};

		function ascSort(a, b) {

			return a.distance - b.distance;

		}

		function intersectObject(object, raycaster, intersects, recursive) {

			// if ( object.visible === false ) return;

			object.raycast(raycaster, intersects);

			if (recursive === true) {

				var children = object.children;

				for (var i = 0, l = children.length; i < l; i++) {

					intersectObject(children[i], raycaster, intersects, true);

				}

			}

		}

		//

		THREE.Raycaster.prototype = {

			constructor: THREE.Raycaster,

			linePrecision: 1,

			set: function (origin, direction) {

				// direction is assumed to be normalized (for accurate distance calculations)

				this.ray.set(origin, direction);

			},

			setFromCamera: function (coords, camera) {

				if (camera instanceof THREE.PerspectiveCamera) {

					this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
					this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();

				} else if (camera instanceof THREE.OrthographicCamera) {

					this.ray.origin.set(coords.x, coords.y, -1).unproject(camera);
					this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);

				} else {

					console.error('THREE.Raycaster: Unsupported camera type.');

				}

			},

			intersectObject: function (object, recursive) {

				var intersects = [];

				intersectObject(object, this, intersects, recursive);

				// intersects.sort( ascSort );

				return intersects;

			},

			intersectObjects: function (objects, recursive, ignoreObj) {

				var intersects = [];

				if (Array.isArray(objects) === false) {

					console.warn('THREE.Raycaster.intersectObjects: objects is not an Array.');
					return intersects;

				}

				for (var i = 0, l = objects.length; i < l; i++) {
					if (ignoreObj && objects[i].rayID > 0) {
						continue;
					}
					intersectObject(objects[i], this, intersects, recursive);
					if (intersects.length > 0) {
						return intersects;
					}
				}

				// intersects.sort( ascSort );

				return intersects;

			}

		};

	}(THREE));

	// File:../dev/three/core/Object3D.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author elephantatwork / www.elephantatwork.ch
	 */

	THREE.Object3D = function () {

		Object.defineProperty(this, 'id', {
			value: THREE.Object3DIdCount++
		});

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.type = 'Object3D';
		this.needResCount = 0;

		this.parent = null;
		this.children = [];
		this.mode = 1; //1表示普通的mesh， 2表示公告板

		this.skeleton = undefined;
		this.implBones = undefined;

		this.aniControl = undefined;

		this.animSpeed = 1.0;

		this.up = THREE.Object3D.DefaultUp.clone();

		this.playWait = undefined;
		this.ready = true; //自身是否已经就绪（不包含子节点）
		this.childrenReady = false; //子节点是否已经就绪
		this.childrenReadyCount = 0;
		this.childrenCount = 0;

		this.scene = undefined;

		this.play = undefined;

		var position = new THREE.Vector3();
		var rotation = new THREE.Euler();
		var quaternion = new THREE.Quaternion();
		var scale = new THREE.Vector3(1, 1, 1);

		var scope = this;

		function onRotationChange() {
			quaternion.setFromEuler(rotation, false);
			scope.tranformChange();
		}

		function onQuaternionChange() {
			rotation._update === true;
			scope.tranformChange();
		}

		function onGetRotation() {
			if (rotation._update === true) {
				rotation.setFromQuaternion(quaternion, undefined, false);
				rotation._update = false;
			}
		}

		function onVector3Change() {
			scope.tranformChange();
		}

		rotation.onChange(onRotationChange);
		quaternion.onChange(onQuaternionChange);
		rotation.onGet(onGetRotation);
		position.onChange(onVector3Change);
		scale.onChange(onVector3Change);

		Object.defineProperties(this, {
			position: {
				enumerable: true,
				value: position
			},
			rotation: {
				enumerable: true,
				value: rotation
			},
			quaternion: {
				enumerable: true,
				value: quaternion
			},
			scale: {
				enumerable: true,
				value: scale
			},
			modelViewMatrix: {
				value: new THREE.Matrix4()
			},
			normalMatrix: {
				value: new THREE.Matrix3()
			}
		});

		this.rotationAutoUpdate = true;

		this.matrix = new THREE.Matrix4();
		this.matrixWorld = new THREE.Matrix4();

		this.matrixAutoUpdate = THREE.Object3D.DefaultMatrixAutoUpdate;
		this.matrixWorldNeedsUpdate = false;

		this.layers = new THREE.Layers();
		this.visible = true;

		this.castShadow = false;
		this.receiveShadow = false;

		this.frustumCulled = true;
		this.renderOrder = 0;

		this.userData = {};
	};

	THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0);
	THREE.Object3D.DefaultMatrixAutoUpdate = true;

	THREE.Object3D.prototype = {

		constructor: THREE.Object3D,

		applyMatrix: function (matrix) {

			this.matrix.multiplyMatrices(matrix, this.matrix);

			this.matrix.decompose(this.position, this.quaternion, this.scale);

		},

		setRotationFromAxisAngle: function (axis, angle) {

			// assumes axis is normalized

			this.quaternion.setFromAxisAngle(axis, angle);

		},

		setRotationFromEuler: function (euler) {

			this.quaternion.setFromEuler(euler, true);

		},

		setRotationFromMatrix: function (m) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			this.quaternion.setFromRotationMatrix(m);

		},

		setRotationFromQuaternion: function (q) {

			// assumes q is normalized

			this.quaternion.copy(q);

		},

		rotateOnAxis: function () {

			// rotate object on axis in object space
			// axis is assumed to be normalized

			var q1 = new THREE.Quaternion();

			return function (axis, angle) {

				q1.setFromAxisAngle(axis, angle);

				this.quaternion.multiply(q1);

				return this;

			};

		}(),

		rotateX: function () {

			var v1 = new THREE.Vector3(1, 0, 0);

			return function (angle) {

				return this.rotateOnAxis(v1, angle);

			};

		}(),

		rotateY: function () {

			var v1 = new THREE.Vector3(0, 1, 0);

			return function (angle) {

				return this.rotateOnAxis(v1, angle);

			};

		}(),

		rotateZ: function () {

			var v1 = new THREE.Vector3(0, 0, 1);

			return function (angle) {

				return this.rotateOnAxis(v1, angle);

			};

		}(),

		translateOnAxis: function () {

			// translate object by distance along axis in object space
			// axis is assumed to be normalized

			var v1 = new THREE.Vector3();

			return function (axis, distance) {

				v1.copy(axis).applyQuaternion(this.quaternion);

				this.position.add(v1.multiplyScalar(distance));

				return this;

			};

		}(),

		translateX: function () {

			var v1 = new THREE.Vector3(1, 0, 0);

			return function (distance) {

				return this.translateOnAxis(v1, distance);

			};

		}(),

		translateY: function () {

			var v1 = new THREE.Vector3(0, 1, 0);

			return function (distance) {

				return this.translateOnAxis(v1, distance);

			};

		}(),

		translateZ: function () {

			var v1 = new THREE.Vector3(0, 0, 1);

			return function (distance) {

				return this.translateOnAxis(v1, distance);

			};

		}(),

		localToWorld: function (vector) {

			return vector.applyMatrix4(this.matrixWorld);

		},

		worldToLocal: function () {

			var m1 = new THREE.Matrix4();

			return function (vector) {

				return vector.applyMatrix4(m1.getInverse(this.matrixWorld));

			};

		}(),

		lookAt: function () {

			// This routine does not support objects with rotated and/or translated parent(s)

			var m1 = new THREE.Matrix4();

			return function (vector) {

				m1.lookAt(vector, this.position, this.up);

				this.quaternion.setFromRotationMatrix(m1);

			};

		}(),

		add: function (object) {

			if (arguments.length > 1) {

				for (var i = 0; i < arguments.length; i++) {

					this.add(arguments[i]);

				}

				return this;

			}

			if (object === this) {

				console.error("THREE.Object3D.add: object can't be added as a child of itself.", object);
				return this;

			}

			if (object instanceof THREE.Object3D) {

				if (object.parent !== null) {

					object.parent.remove(object);

				}

				object.parent = this;
				object.dispatchEvent({
					type: 'added'
				});

				this.children.push(object);
				this.addChildScene(object);
				if (this.scene && !this.dirt) {
					this.dirt = true;
					this.scene.dirts.push(this);
				}
			} else {

				console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);

			}

			return this;

		},

		remove: function (object) {

			if (arguments.length > 1) {

				for (var i = 0; i < arguments.length; i++) {

					this.remove(arguments[i]);

				}

			}

			var index = this.children.indexOf(object);

			if (index !== -1) {

				object.parent = null;

				object.dispatchEvent({
					type: 'removed'
				});

				this.children.splice(index, 1);

			}

		},

		getObjectById: function (id) {

			return this.getObjectByProperty('id', id);

		},

		getObjectByName: function (name) {

			return this.getObjectByProperty('name', name);

		},

		getObjectByProperty: function (name, value) {

			if (this[name] === value) return this;

			for (var i = 0, l = this.children.length; i < l; i++) {

				var child = this.children[i];
				var object = child.getObjectByProperty(name, value);

				if (object !== undefined) {

					return object;

				}

			}

			return undefined;

		},

		getWorldPosition: function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();

			this.updateMatrixWorld(true);

			return result.setFromMatrixPosition(this.matrixWorld);

		},

		getWorldQuaternion: function () {

			var position = new THREE.Vector3();
			var scale = new THREE.Vector3();

			return function (optionalTarget) {

				var result = optionalTarget || new THREE.Quaternion();

				this.updateMatrixWorld(true);

				this.matrixWorld.decompose(position, result, scale);

				return result;

			};

		}(),

		getWorldRotation: function () {

			var quaternion = new THREE.Quaternion();

			return function (optionalTarget) {

				var result = optionalTarget || new THREE.Euler();

				this.getWorldQuaternion(quaternion);

				return result.setFromQuaternion(quaternion, this.rotation.order, false);

			};

		}(),

		getWorldScale: function () {

			var position = new THREE.Vector3();
			var quaternion = new THREE.Quaternion();

			return function (optionalTarget) {

				var result = optionalTarget || new THREE.Vector3();

				this.updateMatrixWorld(true);

				this.matrixWorld.decompose(position, quaternion, result);

				return result;

			};

		}(),

		getWorldDirection: function () {

			var quaternion = new THREE.Quaternion();

			return function (optionalTarget) {

				var result = optionalTarget || new THREE.Vector3();

				this.getWorldQuaternion(quaternion);

				return result.set(0, 0, 1).applyQuaternion(quaternion);

			};

		}(),

		raycast: (function () {

			var ray = new THREE.Ray();
			var inverseMatrix = new THREE.Matrix4();

			return function (raycaster, intersects) {

				if (!this.settingBound) return;

				inverseMatrix.getInverse(this.matrixWorld);
				ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

				if (ray.intersectsBox(this.settingBound) === false) return;

				intersects.push({
					object: this
				});
			}
		}()),

		traverse: function (callback) {

			callback(this);

			var children = this.children;

			for (var i = 0, l = children.length; i < l; i++) {

				children[i].traverse(callback);

			}

		},

		traverseVisible: function (callback) {

			if (this.visible === false) return;

			callback(this);

			var children = this.children;

			for (var i = 0, l = children.length; i < l; i++) {

				children[i].traverseVisible(callback);

			}

		},
		addChildScene: function (object) {
			if (!this.scene) {
				return;
			}
			object.scene = this.scene;
			object.addSuccess && object.addSuccess();

			if (object.mode === 2) { //如果是公告板，push到公告板列表
				this.scene.BulletinBoards.push(object);
			}
			if (object.children) {
				for (var i = 0; i < object.children.length; i++) {
					object.addChildScene(object.children[i]);
				}
			}
			if (object.addSuccess) {
				object.addSuccess();
			}
		},

		traverseAncestors: function (callback) {

			var parent = this.parent;

			if (parent !== null) {

				callback(parent);

				parent.traverseAncestors(callback);

			}

		},

		updateMatrix: function () {

			this.matrix.compose(this.position, this.quaternion, this.scale);

			// if (this.initPose) {
			// 	this.matrix.multiplyMatrices(this.initPose, this.matrix);
			// }

			this.matrixWorldNeedsUpdate = true;

		},

		updateMatrixWorld: function (force) {

			this.dirt = false;
			if (this.matrixAutoUpdate === true) this.updateMatrix();

			if (this.matrixWorldNeedsUpdate === true || force === true) {

				if (this.parent === null) {

					this.matrixWorld.copy(this.matrix);

				} else {

					this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);

				}

				this.matrixWorldNeedsUpdate = false;

				force = true;

			}

			// update children

			for (var i = 0, l = this.children.length; i < l; i++) {

				this.children[i].updateMatrixWorld(force);

			}
		},

		toJSON: function (meta) {

			// meta is '' when called from JSON.stringify
			var isRootObject = (meta === undefined || meta === '');

			var output = {};

			// meta is a hash used to collect geometries, materials.
			// not providing it implies that this is the root object
			// being serialized.
			if (isRootObject) {

				// initialize meta obj
				meta = {
					geometries: {},
					materials: {},
					textures: {},
					images: {}
				};

				output.metadata = {
					version: 4.4,
					type: 'Object',
					generator: 'Object3D.toJSON'
				};

			}

			// standard Object3D serialization

			var object = {};

			object.uuid = this.uuid;
			object.type = this.type;

			if (this.name !== '') object.name = this.name;
			if (JSON.stringify(this.userData) !== '{}') object.userData = this.userData;
			if (this.castShadow === true) object.castShadow = true;
			if (this.receiveShadow === true) object.receiveShadow = true;
			if (this.visible === false) object.visible = false;

			object.matrix = this.matrix.toArray();

			//

			if (this.geometry !== undefined) {

				if (meta.geometries[this.geometry.uuid] === undefined) {

					meta.geometries[this.geometry.uuid] = this.geometry.toJSON(meta);

				}

				object.geometry = this.geometry.uuid;

			}

			if (this.material !== undefined) {

				if (meta.materials[this.material.uuid] === undefined) {

					meta.materials[this.material.uuid] = this.material.toJSON(meta);

				}

				object.material = this.material.uuid;

			}

			//

			if (this.children.length > 0) {

				object.children = [];

				for (var i = 0; i < this.children.length; i++) {

					object.children.push(this.children[i].toJSON(meta).object);

				}

			}

			if (isRootObject) {

				var geometries = extractFromCache(meta.geometries);
				var materials = extractFromCache(meta.materials);
				var textures = extractFromCache(meta.textures);
				var images = extractFromCache(meta.images);

				if (geometries.length > 0) output.geometries = geometries;
				if (materials.length > 0) output.materials = materials;
				if (textures.length > 0) output.textures = textures;
				if (images.length > 0) output.images = images;

			}

			output.object = object;

			return output;

			// extract data from the cache hash
			// remove metadata on each item
			// and return as array
			function extractFromCache(cache) {

				var values = [];
				for (var key in cache) {

					var data = cache[key];
					delete data.metadata;
					values.push(data);

				}
				return values;

			}

		},

		clone: function (recursive) {

			return new this.constructor().copy(this, recursive);

		},

		copy: function (source, recursive) {

			if (recursive === undefined) recursive = true;

			this.name = source.name;

			this.up.copy(source.up);

			this.position.copy(source.position);
			this.quaternion.copy(source.quaternion);
			this.scale.copy(source.scale);

			this.rotationAutoUpdate = source.rotationAutoUpdate;

			this.matrix.copy(source.matrix);
			this.matrixWorld.copy(source.matrixWorld);

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

			this.visible = source.visible;

			this.castShadow = source.castShadow;
			this.receiveShadow = source.receiveShadow;

			this.frustumCulled = source.frustumCulled;
			this.renderOrder = source.renderOrder;

			this.userData = JSON.parse(JSON.stringify(source.userData));

			if (recursive === true) {

				for (var i = 0; i < source.children.length; i++) {

					var child = source.children[i];
					this.add(child.clone());

				}

			}

			return this;

		},

		finishCB: function () {
			this.scene.animObjectMap.delete(this.uuid);
			this.play = undefined;
			window.AnimFinishCB(this.finishCBObj);
		},

		playAnim: function (clip, isOnce, speed, obj) {
			if (this._isDestroy) {
				return;
			}

			if (!this.ready || !this.childrenReady) {
				this.playWait = this.playWait || [];
				this.playWait.push([clip, isOnce, speed, obj]);
				return;
			}

			if (!this.mixer) {
				this.mixer = new THREE.AnimationMixer(this);
				this.mixer.addEventListener('finished', this.finishCB.bind(this));
			}

			this.scene.animObjectMap.set(this.uuid, this);

			this.play = (typeof clip === 'string') ? clip : clip.name;

			if (speed !== undefined) this.animSpeed = speed;

			if (this.currentAction) {
				this.currentAction.stop();
			}

			this.currentAction = this.mixer.clipAction(clip);
			if (this.currentAction) {
				var loopType = isOnce ? THREE.LoopOnce : THREE.LoopRepeat;
				this.currentAction.reset().setEffectiveWeight(1.0).setLoop(loopType).play();
				this.currentAction.clampWhenFinished = true;
				if (isOnce && obj) {
					this.finishCBObj = obj;
				}
			}
		},

		update: function (deltaTime) {
			var dl = this.animSpeed * deltaTime;
			if (this.mixer) {
				this.mixer.update(dl);
			}

			if (this.skHelper) {
				this.skHelper.update(deltaTime);
			}

			if (this.bHelper) {
				this.bHelper.update(deltaTime);
			}
		},

		setSkeletonChild: function (bones) {
			if (this._isDestroy) {
				return;
			}

			if (!bones)
				return;

			var implBones = [];
			var bone, gbone;

			for (var b = 0, bl = bones.length; b < bl; ++b) {
				gbone = bones[b];

				bone = new THREE.Bone();
				implBones.push(bone);

				bone.name = gbone.name;

				bone.position._x = gbone.pos[0];
				bone.position._y = gbone.pos[1];
				bone.position._z = gbone.pos[2];
				bone.initPosition = bone.position.clone();

				bone.quaternion._x = gbone.rotq[0];
				bone.quaternion._y = gbone.rotq[1];
				bone.quaternion._z = gbone.rotq[2];
				bone.quaternion._w = gbone.rotq[3];
				bone.initQuaternion = bone.quaternion.clone();

				if (gbone.scl !== undefined) {
					bone.scale._x = gbone.scl[0];
					bone.scale._y = gbone.scl[1];
					bone.scale._z = gbone.scl[2];
					bone.initScale = bone.scale.clone();
				}
			}

			for (var b = 0, bl = bones.length; b < bl; ++b) {
				gbone = bones[b];

				if (gbone.parent !== -1 && gbone.parent !== null &&
					implBones[gbone.parent] !== undefined) {

					implBones[gbone.parent].add(implBones[b]);

				} else {
					this.add(implBones[b]);
					this.childReadyOk();
				}
			}
			this.implBones = implBones;

			this.updateMatrixWorld(true);
			this.skeleton = new THREE.Skeleton(this, implBones, undefined, false);
			// this.setBoneVisible(true);
			return this.skeleton;
		},

		dispose: function () {
			this._isDestroy = true;

			if (this.mixer) {
				this.mixer.uncacheRoot(this);
				delete this.mixer._root;
			}

			if (this.skeleton) {
				this.skeleton.dispose();
			}

			if (this.scene) {
				if (this.scene.animObjectMap.get(this.uuid))
					this.scene.animObjectMap.delete(this.uuid);
				for (var i = 0; i < this.scene.dirts.length; i++) {
					if (this.scene.dirts[i] === this) {
						for (; i < this.scene.dirts.length - 1; i++) {
							this.scene.dirts[i] = this.scene.dirts[i + 1];
						}
						this.scene.dirts.length = this.scene.dirts.length - 1;
						return;
					}
				}
			}
		},

		setBoneVisible: function (isVisible) {
			if (this.skHelper) {
				this.skHelper.visible = isVisible;
			} else if (isVisible) {
				if (this.skeleton) {
					this.skHelper = new THREE.SkeletonHelper(this);
					this.skHelper.material.linewidth = 3;
					this.skHelper.visible = true;
					this.add(this.skHelper);
				} else {
					throw ("not skeleton:setBoneVisible");
				}
			}
		},

		setNeedResCount: function (count) {
			this.needResCount = count;
		},

		readyOk: function () {
			this.parent && this.parent.childReadyOk && this.parent.childReadyOk();
			if (this.playWait) {
				for (var i = 0; i < this.playWait.length; i++) {
					this.playAnim(this.playWait[i][0], this.playWait[i][1], this.playWait[i][2], this.playWait[i][3]);
				}
				this.playWait = undefined;
			}
		},

		checkReady: function () {
			if (this.childrenReady) {
				this.readyOk();
			}
		},

		childReadyOk: function () {
			this.childrenReadyCount++;
			if (this.childrenCount <= this.childrenReadyCount) {
				this.childrenReady = true;
				this.checkReady();
				delete this.childrenCount;
				delete this.childrenReadyCount;
			}
		},
		tranformChange: function () {
			if (this.scene && !this.dirt) {
				this.dirt = true;
				this.scene.dirts.push(this);
			}
		}
	};

	THREE.EventDispatcher.prototype.apply(THREE.Object3D.prototype);

	THREE.Object3DIdCount = 0;
	// File:../dev/three/core/Face3.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Face3 = function (a, b, c, normal, color, materialIndex) {

		this.a = a;
		this.b = b;
		this.c = c;

		this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
		this.vertexNormals = Array.isArray(normal) ? normal : [];

		this.color = color instanceof THREE.Color ? color : new THREE.Color();
		this.vertexColors = Array.isArray(color) ? color : [];

		this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

	};

	THREE.Face3.prototype = {

		constructor: THREE.Face3,

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (source) {

			this.a = source.a;
			this.b = source.b;
			this.c = source.c;

			this.normal.copy(source.normal);
			this.color.copy(source.color);

			this.materialIndex = source.materialIndex;

			for (var i = 0, il = source.vertexNormals.length; i < il; i++) {

				this.vertexNormals[i] = source.vertexNormals[i].clone();

			}

			for (var i = 0, il = source.vertexColors.length; i < il; i++) {

				this.vertexColors[i] = source.vertexColors[i].clone();

			}

			return this;

		}

	};

	// File:../dev/three/core/BufferAttribute.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.BufferAttribute = function (array, itemSize, normalized) {

		this.uuid = THREE.Math.generateUUID();

		this.array = array;
		this.itemSize = itemSize;

		this.dynamic = false;
		this.updateRange = {
			offset: 0,
			count: -1
		};

		this.version = 0;
		this.normalized = normalized === true;

	};

	THREE.BufferAttribute.prototype = {

		constructor: THREE.BufferAttribute,

		get count() {

			return this.array.length / this.itemSize;

		},

		set needsUpdate(value) {

			if (value === true) this.version++;

		},

		setDynamic: function (value) {

			this.dynamic = value;

			return this;

		},

		copy: function (source) {

			this.array = new source.array.constructor(source.array);
			this.itemSize = source.itemSize;

			this.dynamic = source.dynamic;

			return this;

		},

		copyAt: function (index1, attribute, index2) {

			index1 *= this.itemSize;
			index2 *= attribute.itemSize;

			for (var i = 0, l = this.itemSize; i < l; i++) {

				this.array[index1 + i] = attribute.array[index2 + i];

			}

			return this;

		},

		copyArray: function (array) {

			this.array.set(array);

			return this;

		},

		copyColorsArray: function (colors) {

			var array = this.array,
				offset = 0;

			for (var i = 0, l = colors.length; i < l; i++) {

				var color = colors[i];

				if (color === undefined) {

					console.warn('THREE.BufferAttribute.copyColorsArray(): color is undefined', i);
					color = new THREE.Color();

				}

				array[offset++] = color.r;
				array[offset++] = color.g;
				array[offset++] = color.b;

			}

			return this;

		},

		copyIndicesArray: function (indices) {

			var array = this.array,
				offset = 0;

			for (var i = 0, l = indices.length; i < l; i++) {

				var index = indices[i];

				array[offset++] = index.a;
				array[offset++] = index.b;
				array[offset++] = index.c;

			}

			return this;

		},

		copyVector2sArray: function (vectors) {

			var array = this.array,
				offset = 0;

			for (var i = 0, l = vectors.length; i < l; i++) {

				var vector = vectors[i];

				if (vector === undefined) {

					console.warn('THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i);
					vector = new THREE.Vector2();

				}

				array[offset++] = vector.x;
				array[offset++] = vector.y;

			}

			return this;

		},

		copyVector3sArray: function (vectors) {

			var array = this.array,
				offset = 0;

			for (var i = 0, l = vectors.length; i < l; i++) {

				var vector = vectors[i];

				if (vector === undefined) {

					console.warn('THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i);
					vector = new THREE.Vector3();

				}

				array[offset++] = vector.x;
				array[offset++] = vector.y;
				array[offset++] = vector.z;

			}

			return this;

		},

		copyVector4sArray: function (vectors) {

			var array = this.array,
				offset = 0;

			for (var i = 0, l = vectors.length; i < l; i++) {

				var vector = vectors[i];

				if (vector === undefined) {

					console.warn('THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i);
					vector = new THREE.Vector4();

				}

				array[offset++] = vector.x;
				array[offset++] = vector.y;
				array[offset++] = vector.z;
				array[offset++] = vector.w;

			}

			return this;

		},

		set: function (value, offset) {

			if (offset === undefined) offset = 0;

			this.array.set(value, offset);

			return this;

		},

		getX: function (index) {

			return this.array[index * this.itemSize];

		},

		setX: function (index, x) {

			this.array[index * this.itemSize] = x;

			return this;

		},

		getY: function (index) {

			return this.array[index * this.itemSize + 1];

		},

		setY: function (index, y) {

			this.array[index * this.itemSize + 1] = y;

			return this;

		},

		getZ: function (index) {

			return this.array[index * this.itemSize + 2];

		},

		setZ: function (index, z) {

			this.array[index * this.itemSize + 2] = z;

			return this;

		},

		getW: function (index) {

			return this.array[index * this.itemSize + 3];

		},

		setW: function (index, w) {

			this.array[index * this.itemSize + 3] = w;

			return this;

		},

		setXY: function (index, x, y) {

			index *= this.itemSize;

			this.array[index + 0] = x;
			this.array[index + 1] = y;

			return this;

		},

		setXYZ: function (index, x, y, z) {

			index *= this.itemSize;

			this.array[index + 0] = x;
			this.array[index + 1] = y;
			this.array[index + 2] = z;

			return this;

		},

		setXYZW: function (index, x, y, z, w) {

			index *= this.itemSize;

			this.array[index + 0] = x;
			this.array[index + 1] = y;
			this.array[index + 2] = z;
			this.array[index + 3] = w;

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		}

	};

	//

	THREE.Int8Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Int8Array(array), itemSize);

	};

	THREE.Uint8Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Uint8Array(array), itemSize);

	};

	THREE.Uint8ClampedAttribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Uint8ClampedArray(array), itemSize);

	};

	THREE.Int16Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Int16Array(array), itemSize);

	};

	THREE.Uint16Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Uint16Array(array), itemSize);

	};

	THREE.Int32Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Int32Array(array), itemSize);

	};

	THREE.Uint32Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Uint32Array(array), itemSize);

	};

	THREE.Float32Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Float32Array(array), itemSize);

	};

	THREE.Float64Attribute = function (array, itemSize) {

		return new THREE.BufferAttribute(new Float64Array(array), itemSize);

	};


	// Deprecated

	THREE.DynamicBufferAttribute = function (array, itemSize) {

		console.warn('THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setDynamic( true ) instead.');
		return new THREE.BufferAttribute(array, itemSize).setDynamic(true);

	};

	// File:../dev/three/core/Geometry.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author kile / http://kile.stravaganza.org/
	 * @author alteredq / http://alteredqualia.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author zz85 / http://www.lab4games.net/zz85/blog
	 * @author bhouston / http://clara.io
	 */

	THREE.Geometry = function () {

		Object.defineProperty(this, 'id', {
			value: THREE.GeometryIdCount++
		});

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.type = 'Geometry';

		this.vertices = [];
		this.colors = [];
		this.faces = [];
		this.faceVertexUvs = [
			[]
		];

		this.morphTargets = [];
		this.morphNormals = [];

		this.skinWeights = [];
		this.skinIndices = [];

		this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.verticesNeedUpdate = false;
		this.elementsNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.lineDistancesNeedUpdate = false;
		this.groupsNeedUpdate = false;

	};

	THREE.Geometry.prototype = {

		constructor: THREE.Geometry,

		applyMatrix: function (matrix) {

			var normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);

			for (var i = 0, il = this.vertices.length; i < il; i++) {

				var vertex = this.vertices[i];
				vertex.applyMatrix4(matrix);

			}

			for (var i = 0, il = this.faces.length; i < il; i++) {

				var face = this.faces[i];
				face.normal.applyMatrix3(normalMatrix).normalize();

				for (var j = 0, jl = face.vertexNormals.length; j < jl; j++) {

					face.vertexNormals[j].applyMatrix3(normalMatrix).normalize();

				}

			}

			if (this.boundingBox !== null) {

				this.computeBoundingBox();

			}

			if (this.boundingSphere !== null) {

				this.computeBoundingSphere();

			}

			this.verticesNeedUpdate = true;
			this.normalsNeedUpdate = true;

			return this;

		},

		rotateX: function () {

			// rotate geometry around world x-axis

			var m1;

			return function rotateX(angle) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeRotationX(angle);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		rotateY: function () {

			// rotate geometry around world y-axis

			var m1;

			return function rotateY(angle) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeRotationY(angle);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		rotateZ: function () {

			// rotate geometry around world z-axis

			var m1;

			return function rotateZ(angle) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeRotationZ(angle);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		translate: function () {

			// translate geometry

			var m1;

			return function translate(x, y, z) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeTranslation(x, y, z);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		scale: function () {

			// scale geometry

			var m1;

			return function scale(x, y, z) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeScale(x, y, z);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		lookAt: function () {

			var obj;

			return function lookAt(vector) {

				if (obj === undefined) obj = new THREE.Object3D();

				obj.lookAt(vector);

				obj.updateMatrix();

				this.applyMatrix(obj.matrix);

			};

		}(),

		fromBufferGeometry: function (geometry) {

			var scope = this;

			var indices = geometry.index !== null ? geometry.index.array : undefined;
			var attributes = geometry.attributes;

			var positions = attributes.position.array;
			var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
			var colors = attributes.color !== undefined ? attributes.color.array : undefined;
			var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
			var uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;

			if (uvs2 !== undefined) this.faceVertexUvs[1] = [];

			var tempNormals = [];
			var tempUVs = [];
			var tempUVs2 = [];

			for (var i = 0, j = 0; i < positions.length; i += 3, j += 2) {

				scope.vertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));

				if (normals !== undefined) {

					tempNormals.push(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]));

				}

				if (colors !== undefined) {

					scope.colors.push(new THREE.Color(colors[i], colors[i + 1], colors[i + 2]));

				}

				if (uvs !== undefined) {

					tempUVs.push(new THREE.Vector2(uvs[j], uvs[j + 1]));

				}

				if (uvs2 !== undefined) {

					tempUVs2.push(new THREE.Vector2(uvs2[j], uvs2[j + 1]));

				}

			}

			function addFace(a, b, c, materialIndex) {

				var vertexNormals = normals !== undefined ? [tempNormals[a].clone(), tempNormals[b].clone(), tempNormals[c].clone()] : [];
				var vertexColors = colors !== undefined ? [scope.colors[a].clone(), scope.colors[b].clone(), scope.colors[c].clone()] : [];

				var face = new THREE.Face3(a, b, c, vertexNormals, vertexColors, materialIndex);

				scope.faces.push(face);

				if (uvs !== undefined) {

					scope.faceVertexUvs[0].push([tempUVs[a].clone(), tempUVs[b].clone(), tempUVs[c].clone()]);

				}

				if (uvs2 !== undefined) {

					scope.faceVertexUvs[1].push([tempUVs2[a].clone(), tempUVs2[b].clone(), tempUVs2[c].clone()]);

				}

			}

			if (indices !== undefined) {

				var groups = geometry.groups;

				if (groups.length > 0) {

					for (var i = 0; i < groups.length; i++) {

						var group = groups[i];

						var start = group.start;
						var count = group.count;

						for (var j = start, jl = start + count; j < jl; j += 3) {

							addFace(indices[j], indices[j + 1], indices[j + 2], group.materialIndex);

						}

					}

				} else {

					for (var i = 0; i < indices.length; i += 3) {

						addFace(indices[i], indices[i + 1], indices[i + 2]);

					}

				}

			} else {

				for (var i = 0; i < positions.length / 3; i += 3) {

					addFace(i, i + 1, i + 2);

				}

			}

			this.computeFaceNormals();

			if (geometry.boundingBox !== null) {

				this.boundingBox = geometry.boundingBox.clone();

			}

			if (geometry.boundingSphere !== null) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			return this;

		},

		center: function () {

			this.computeBoundingBox();

			var offset = this.boundingBox.center().negate();

			this.translate(offset.x, offset.y, offset.z);

			return offset;

		},

		normalize: function () {

			this.computeBoundingSphere();

			var center = this.boundingSphere.center;
			var radius = this.boundingSphere.radius;

			var s = radius === 0 ? 1 : 1.0 / radius;

			var matrix = new THREE.Matrix4();
			matrix.set(
				s, 0, 0, -s * center.x,
				0, s, 0, -s * center.y,
				0, 0, s, -s * center.z,
				0, 0, 0, 1
			);

			this.applyMatrix(matrix);

			return this;

		},

		computeFaceNormals: function () {

			var cb = new THREE.Vector3(),
				ab = new THREE.Vector3();

			for (var f = 0, fl = this.faces.length; f < fl; f++) {

				var face = this.faces[f];

				var vA = this.vertices[face.a];
				var vB = this.vertices[face.b];
				var vC = this.vertices[face.c];

				cb.subVectors(vC, vB);
				ab.subVectors(vA, vB);
				cb.cross(ab);

				cb.normalize();

				face.normal.copy(cb);

			}

		},

		computeVertexNormals: function (areaWeighted) {

			if (areaWeighted === undefined) areaWeighted = true;

			var v, vl, f, fl, face, vertices;

			vertices = new Array(this.vertices.length);

			for (v = 0, vl = this.vertices.length; v < vl; v++) {

				vertices[v] = new THREE.Vector3();

			}

			if (areaWeighted) {

				// vertex normals weighted by triangle areas
				// http://www.iquilezles.org/www/articles/normals/normals.htm

				var vA, vB, vC;
				var cb = new THREE.Vector3(),
					ab = new THREE.Vector3();

				for (f = 0, fl = this.faces.length; f < fl; f++) {

					face = this.faces[f];

					vA = this.vertices[face.a];
					vB = this.vertices[face.b];
					vC = this.vertices[face.c];

					cb.subVectors(vC, vB);
					ab.subVectors(vA, vB);
					cb.cross(ab);

					vertices[face.a].add(cb);
					vertices[face.b].add(cb);
					vertices[face.c].add(cb);

				}

			} else {

				for (f = 0, fl = this.faces.length; f < fl; f++) {

					face = this.faces[f];

					vertices[face.a].add(face.normal);
					vertices[face.b].add(face.normal);
					vertices[face.c].add(face.normal);

				}

			}

			for (v = 0, vl = this.vertices.length; v < vl; v++) {

				vertices[v].normalize();

			}

			for (f = 0, fl = this.faces.length; f < fl; f++) {

				face = this.faces[f];

				var vertexNormals = face.vertexNormals;

				if (vertexNormals.length === 3) {

					vertexNormals[0].copy(vertices[face.a]);
					vertexNormals[1].copy(vertices[face.b]);
					vertexNormals[2].copy(vertices[face.c]);

				} else {

					vertexNormals[0] = vertices[face.a].clone();
					vertexNormals[1] = vertices[face.b].clone();
					vertexNormals[2] = vertices[face.c].clone();

				}

			}

			if (this.faces.length > 0) {

				this.normalsNeedUpdate = true;

			}

		},

		computeMorphNormals: function () {

			var i, il, f, fl, face;

			// save original normals
			// - create temp variables on first access
			//   otherwise just copy (for faster repeated calls)

			for (f = 0, fl = this.faces.length; f < fl; f++) {

				face = this.faces[f];

				if (!face.__originalFaceNormal) {

					face.__originalFaceNormal = face.normal.clone();

				} else {

					face.__originalFaceNormal.copy(face.normal);

				}

				if (!face.__originalVertexNormals) face.__originalVertexNormals = [];

				for (i = 0, il = face.vertexNormals.length; i < il; i++) {

					if (!face.__originalVertexNormals[i]) {

						face.__originalVertexNormals[i] = face.vertexNormals[i].clone();

					} else {

						face.__originalVertexNormals[i].copy(face.vertexNormals[i]);

					}

				}

			}

			// use temp geometry to compute face and vertex normals for each morph

			var tmpGeo = new THREE.Geometry();
			tmpGeo.faces = this.faces;

			for (i = 0, il = this.morphTargets.length; i < il; i++) {

				// create on first access

				if (!this.morphNormals[i]) {

					this.morphNormals[i] = {};
					this.morphNormals[i].faceNormals = [];
					this.morphNormals[i].vertexNormals = [];

					var dstNormalsFace = this.morphNormals[i].faceNormals;
					var dstNormalsVertex = this.morphNormals[i].vertexNormals;

					var faceNormal, vertexNormals;

					for (f = 0, fl = this.faces.length; f < fl; f++) {

						faceNormal = new THREE.Vector3();
						vertexNormals = {
							a: new THREE.Vector3(),
							b: new THREE.Vector3(),
							c: new THREE.Vector3()
						};

						dstNormalsFace.push(faceNormal);
						dstNormalsVertex.push(vertexNormals);

					}

				}

				var morphNormals = this.morphNormals[i];

				// set vertices to morph target

				tmpGeo.vertices = this.morphTargets[i].vertices;

				// compute morph normals

				tmpGeo.computeFaceNormals();
				tmpGeo.computeVertexNormals();

				// store morph normals

				var faceNormal, vertexNormals;

				for (f = 0, fl = this.faces.length; f < fl; f++) {

					face = this.faces[f];

					faceNormal = morphNormals.faceNormals[f];
					vertexNormals = morphNormals.vertexNormals[f];

					faceNormal.copy(face.normal);

					vertexNormals.a.copy(face.vertexNormals[0]);
					vertexNormals.b.copy(face.vertexNormals[1]);
					vertexNormals.c.copy(face.vertexNormals[2]);

				}

			}

			// restore original normals

			for (f = 0, fl = this.faces.length; f < fl; f++) {

				face = this.faces[f];

				face.normal = face.__originalFaceNormal;
				face.vertexNormals = face.__originalVertexNormals;

			}

		},

		computeTangents: function () {

			console.warn('THREE.Geometry: .computeTangents() has been removed.');

		},

		computeLineDistances: function () {

			var d = 0;
			var vertices = this.vertices;

			for (var i = 0, il = vertices.length; i < il; i++) {

				if (i > 0) {

					d += vertices[i].distanceTo(vertices[i - 1]);

				}

				this.lineDistances[i] = d;

			}

		},

		computeBoundingBox: function () {

			if (this.boundingBox === null) {

				this.boundingBox = new THREE.Box3();

			}

			this.boundingBox.setFromPoints(this.vertices);

		},

		computeBoundingSphere: function () {

			if (this.boundingSphere === null) {

				this.boundingSphere = new THREE.Sphere();

			}

			this.boundingSphere.setFromPoints(this.vertices);

		},

		merge: function (geometry, matrix, materialIndexOffset) {

			if (geometry instanceof THREE.Geometry === false) {

				console.error('THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry);
				return;

			}

			var normalMatrix,
				vertexOffset = this.vertices.length,
				vertices1 = this.vertices,
				vertices2 = geometry.vertices,
				faces1 = this.faces,
				faces2 = geometry.faces,
				uvs1 = this.faceVertexUvs[0],
				uvs2 = geometry.faceVertexUvs[0];

			if (materialIndexOffset === undefined) materialIndexOffset = 0;

			if (matrix !== undefined) {

				normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);

			}

			// vertices

			for (var i = 0, il = vertices2.length; i < il; i++) {

				var vertex = vertices2[i];

				var vertexCopy = vertex.clone();

				if (matrix !== undefined) vertexCopy.applyMatrix4(matrix);

				vertices1.push(vertexCopy);

			}

			// faces

			for (i = 0, il = faces2.length; i < il; i++) {

				var face = faces2[i],
					faceCopy, normal, color,
					faceVertexNormals = face.vertexNormals,
					faceVertexColors = face.vertexColors;

				faceCopy = new THREE.Face3(face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset);
				faceCopy.normal.copy(face.normal);

				if (normalMatrix !== undefined) {

					faceCopy.normal.applyMatrix3(normalMatrix).normalize();

				}

				for (var j = 0, jl = faceVertexNormals.length; j < jl; j++) {

					normal = faceVertexNormals[j].clone();

					if (normalMatrix !== undefined) {

						normal.applyMatrix3(normalMatrix).normalize();

					}

					faceCopy.vertexNormals.push(normal);

				}

				faceCopy.color.copy(face.color);

				for (var j = 0, jl = faceVertexColors.length; j < jl; j++) {

					color = faceVertexColors[j];
					faceCopy.vertexColors.push(color.clone());

				}

				faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

				faces1.push(faceCopy);

			}

			// uvs

			for (i = 0, il = uvs2.length; i < il; i++) {

				var uv = uvs2[i],
					uvCopy = [];

				if (uv === undefined) {

					continue;

				}

				for (var j = 0, jl = uv.length; j < jl; j++) {

					uvCopy.push(uv[j].clone());

				}

				uvs1.push(uvCopy);

			}

		},

		mergeMesh: function (mesh) {

			if (mesh instanceof THREE.Mesh === false) {

				console.error('THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.', mesh);
				return;

			}

			mesh.matrixAutoUpdate && mesh.updateMatrix();

			this.merge(mesh.geometry, mesh.matrix);

		},

		/*
		 * Checks for duplicate vertices with hashmap.
		 * Duplicated vertices are removed
		 * and faces' vertices are updated.
		 */

		mergeVertices: function () {

			var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
			var unique = [],
				changes = [];

			var v, key;
			var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
			var precision = Math.pow(10, precisionPoints);
			var i, il, face;
			var indices, j, jl;

			for (i = 0, il = this.vertices.length; i < il; i++) {

				v = this.vertices[i];
				key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);

				if (verticesMap[key] === undefined) {

					verticesMap[key] = i;
					unique.push(this.vertices[i]);
					changes[i] = unique.length - 1;

				} else {

					//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
					changes[i] = changes[verticesMap[key]];

				}

			}


			// if faces are completely degenerate after merging vertices, we
			// have to remove them from the geometry.
			var faceIndicesToRemove = [];

			for (i = 0, il = this.faces.length; i < il; i++) {

				face = this.faces[i];

				face.a = changes[face.a];
				face.b = changes[face.b];
				face.c = changes[face.c];

				indices = [face.a, face.b, face.c];

				var dupIndex = -1;

				// if any duplicate vertices are found in a Face3
				// we have to remove the face as nothing can be saved
				for (var n = 0; n < 3; n++) {

					if (indices[n] === indices[(n + 1) % 3]) {

						dupIndex = n;
						faceIndicesToRemove.push(i);
						break;

					}

				}

			}

			for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {

				var idx = faceIndicesToRemove[i];

				this.faces.splice(idx, 1);

				for (j = 0, jl = this.faceVertexUvs.length; j < jl; j++) {

					this.faceVertexUvs[j].splice(idx, 1);

				}

			}

			// Use unique set of vertices

			var diff = this.vertices.length - unique.length;
			this.vertices = unique;
			return diff;

		},

		sortFacesByMaterialIndex: function () {

			var faces = this.faces;
			var length = faces.length;

			// tag faces

			for (var i = 0; i < length; i++) {

				faces[i]._id = i;

			}

			// sort faces

			function materialIndexSort(a, b) {

				return a.materialIndex - b.materialIndex;

			}

			faces.sort(materialIndexSort);

			// sort uvs

			var uvs1 = this.faceVertexUvs[0];
			var uvs2 = this.faceVertexUvs[1];

			var newUvs1, newUvs2;

			if (uvs1 && uvs1.length === length) newUvs1 = [];
			if (uvs2 && uvs2.length === length) newUvs2 = [];

			for (var i = 0; i < length; i++) {

				var id = faces[i]._id;

				if (newUvs1) newUvs1.push(uvs1[id]);
				if (newUvs2) newUvs2.push(uvs2[id]);

			}

			if (newUvs1) this.faceVertexUvs[0] = newUvs1;
			if (newUvs2) this.faceVertexUvs[1] = newUvs2;

		},

		toJSON: function () {

			var data = {
				metadata: {
					version: 4.4,
					type: 'Geometry',
					generator: 'Geometry.toJSON'
				}
			};

			// standard Geometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if (this.name !== '') data.name = this.name;

			if (this.parameters !== undefined) {

				var parameters = this.parameters;

				for (var key in parameters) {

					if (parameters[key] !== undefined) data[key] = parameters[key];

				}

				return data;

			}

			var vertices = [];

			for (var i = 0; i < this.vertices.length; i++) {

				var vertex = this.vertices[i];
				vertices.push(vertex.x, vertex.y, vertex.z);

			}

			var faces = [];
			var normals = [];
			var normalsHash = {};
			var colors = [];
			var colorsHash = {};
			var uvs = [];
			var uvsHash = {};

			for (var i = 0; i < this.faces.length; i++) {

				var face = this.faces[i];

				var hasMaterial = true;
				var hasFaceUv = false; // deprecated
				var hasFaceVertexUv = this.faceVertexUvs[0][i] !== undefined;
				var hasFaceNormal = face.normal.length() > 0;
				var hasFaceVertexNormal = face.vertexNormals.length > 0;
				var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
				var hasFaceVertexColor = face.vertexColors.length > 0;

				var faceType = 0;

				faceType = setBit(faceType, 0, 0); // isQuad
				faceType = setBit(faceType, 1, hasMaterial);
				faceType = setBit(faceType, 2, hasFaceUv);
				faceType = setBit(faceType, 3, hasFaceVertexUv);
				faceType = setBit(faceType, 4, hasFaceNormal);
				faceType = setBit(faceType, 5, hasFaceVertexNormal);
				faceType = setBit(faceType, 6, hasFaceColor);
				faceType = setBit(faceType, 7, hasFaceVertexColor);

				faces.push(faceType);
				faces.push(face.a, face.b, face.c);
				faces.push(face.materialIndex);

				if (hasFaceVertexUv) {

					var faceVertexUvs = this.faceVertexUvs[0][i];

					faces.push(
						getUvIndex(faceVertexUvs[0]),
						getUvIndex(faceVertexUvs[1]),
						getUvIndex(faceVertexUvs[2])
					);

				}

				if (hasFaceNormal) {

					faces.push(getNormalIndex(face.normal));

				}

				if (hasFaceVertexNormal) {

					var vertexNormals = face.vertexNormals;

					faces.push(
						getNormalIndex(vertexNormals[0]),
						getNormalIndex(vertexNormals[1]),
						getNormalIndex(vertexNormals[2])
					);

				}

				if (hasFaceColor) {

					faces.push(getColorIndex(face.color));

				}

				if (hasFaceVertexColor) {

					var vertexColors = face.vertexColors;

					faces.push(
						getColorIndex(vertexColors[0]),
						getColorIndex(vertexColors[1]),
						getColorIndex(vertexColors[2])
					);

				}

			}

			function setBit(value, position, enabled) {

				return enabled ? value | (1 << position) : value & (~(1 << position));

			}

			function getNormalIndex(normal) {

				var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

				if (normalsHash[hash] !== undefined) {

					return normalsHash[hash];

				}

				normalsHash[hash] = normals.length / 3;
				normals.push(normal.x, normal.y, normal.z);

				return normalsHash[hash];

			}

			function getColorIndex(color) {

				var hash = color.r.toString() + color.g.toString() + color.b.toString();

				if (colorsHash[hash] !== undefined) {

					return colorsHash[hash];

				}

				colorsHash[hash] = colors.length;
				colors.push(color.getHex());

				return colorsHash[hash];

			}

			function getUvIndex(uv) {

				var hash = uv.x.toString() + uv.y.toString();

				if (uvsHash[hash] !== undefined) {

					return uvsHash[hash];

				}

				uvsHash[hash] = uvs.length / 2;
				uvs.push(uv.x, uv.y);

				return uvsHash[hash];

			}

			data.data = {};

			data.data.vertices = vertices;
			data.data.normals = normals;
			if (colors.length > 0) data.data.colors = colors;
			if (uvs.length > 0) data.data.uvs = [uvs]; // temporal backward compatibility
			data.data.faces = faces;

			return data;

		},

		clone: function () {

			/*
			// Handle primitives

			var parameters = this.parameters;

			if ( parameters !== undefined ) {

				var values = [];

				for ( var key in parameters ) {

					values.push( parameters[ key ] );

				}

				var geometry = Object.create( this.constructor.prototype );
				this.constructor.apply( geometry, values );
				return geometry;

			}

			return new this.constructor().copy( this );
			*/

			return new THREE.Geometry().copy(this);

		},

		copy: function (source) {

			this.vertices = [];
			this.faces = [];
			this.faceVertexUvs = [
				[]
			];

			var vertices = source.vertices;

			for (var i = 0, il = vertices.length; i < il; i++) {

				this.vertices.push(vertices[i].clone());

			}

			var faces = source.faces;

			for (var i = 0, il = faces.length; i < il; i++) {

				this.faces.push(faces[i].clone());

			}

			for (var i = 0, il = source.faceVertexUvs.length; i < il; i++) {

				var faceVertexUvs = source.faceVertexUvs[i];

				if (this.faceVertexUvs[i] === undefined) {

					this.faceVertexUvs[i] = [];

				}

				for (var j = 0, jl = faceVertexUvs.length; j < jl; j++) {

					var uvs = faceVertexUvs[j],
						uvsCopy = [];

					for (var k = 0, kl = uvs.length; k < kl; k++) {

						var uv = uvs[k];

						uvsCopy.push(uv.clone());

					}

					this.faceVertexUvs[i].push(uvsCopy);

				}

			}

			return this;

		},

		dispose: function () {

			this.dispatchEvent({
				type: 'dispose'
			});

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.Geometry.prototype);

	THREE.GeometryIdCount = 0;

	// File:../dev/three/core/DirectGeometry.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.DirectGeometry = function () {

		Object.defineProperty(this, 'id', {
			value: THREE.GeometryIdCount++
		});

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.type = 'DirectGeometry';

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.colors = [];
		this.uvs = [];
		this.uvs2 = [];

		this.groups = [];

		this.morphTargets = {};

		this.skinWeights = [];
		this.skinIndices = [];

		// this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.verticesNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.groupsNeedUpdate = false;

	};

	THREE.DirectGeometry.prototype = {

		constructor: THREE.DirectGeometry,

		computeBoundingBox: THREE.Geometry.prototype.computeBoundingBox,
		computeBoundingSphere: THREE.Geometry.prototype.computeBoundingSphere,

		computeFaceNormals: function () {

			console.warn('THREE.DirectGeometry: computeFaceNormals() is not a method of this type of geometry.');

		},

		computeVertexNormals: function () {

			console.warn('THREE.DirectGeometry: computeVertexNormals() is not a method of this type of geometry.');

		},

		computeGroups: function (geometry) {

			var group;
			var groups = [];
			var materialIndex;

			var faces = geometry.faces;

			for (var i = 0; i < faces.length; i++) {

				var face = faces[i];

				// materials

				if (face.materialIndex !== materialIndex) {

					materialIndex = face.materialIndex;

					if (group !== undefined) {

						group.count = (i * 3) - group.start;
						groups.push(group);

					}

					group = {
						start: i * 3,
						materialIndex: materialIndex
					};

				}

			}

			if (group !== undefined) {

				group.count = (i * 3) - group.start;
				groups.push(group);

			}

			this.groups = groups;

		},

		fromGeometry: function (geometry) {

			var faces = geometry.faces;
			var vertices = geometry.vertices;
			var faceVertexUvs = geometry.faceVertexUvs;

			var hasFaceVertexUv = faceVertexUvs[0] && faceVertexUvs[0].length > 0;
			var hasFaceVertexUv2 = faceVertexUvs[1] && faceVertexUvs[1].length > 0;

			// morphs

			var morphTargets = geometry.morphTargets;
			var morphTargetsLength = morphTargets.length;

			var morphTargetsPosition;

			if (morphTargetsLength > 0) {

				morphTargetsPosition = [];

				for (var i = 0; i < morphTargetsLength; i++) {

					morphTargetsPosition[i] = [];

				}

				this.morphTargets.position = morphTargetsPosition;

			}

			var morphNormals = geometry.morphNormals;
			var morphNormalsLength = morphNormals.length;

			var morphTargetsNormal;

			if (morphNormalsLength > 0) {

				morphTargetsNormal = [];

				for (var i = 0; i < morphNormalsLength; i++) {

					morphTargetsNormal[i] = [];

				}

				this.morphTargets.normal = morphTargetsNormal;

			}

			// skins

			var skinIndices = geometry.skinIndices;
			var skinWeights = geometry.skinWeights;

			var hasSkinIndices = skinIndices.length === vertices.length;
			var hasSkinWeights = skinWeights.length === vertices.length;

			//

			for (var i = 0; i < faces.length; i++) {

				var face = faces[i];

				this.vertices.push(vertices[face.a], vertices[face.b], vertices[face.c]);

				var vertexNormals = face.vertexNormals;

				if (vertexNormals.length === 3) {

					this.normals.push(vertexNormals[0], vertexNormals[1], vertexNormals[2]);

				} else {

					var normal = face.normal;

					this.normals.push(normal, normal, normal);

				}

				var vertexColors = face.vertexColors;

				if (vertexColors.length === 3) {

					this.colors.push(vertexColors[0], vertexColors[1], vertexColors[2]);

				} else {

					var color = face.color;

					this.colors.push(color, color, color);

				}

				if (hasFaceVertexUv === true) {

					var vertexUvs = faceVertexUvs[0][i];

					if (vertexUvs !== undefined) {

						this.uvs.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);

					} else {

						console.warn('THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ', i);

						this.uvs.push(new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2());

					}

				}

				if (hasFaceVertexUv2 === true) {

					var vertexUvs = faceVertexUvs[1][i];

					if (vertexUvs !== undefined) {

						this.uvs2.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);

					} else {

						console.warn('THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i);

						this.uvs2.push(new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2());

					}

				}

				// morphs

				for (var j = 0; j < morphTargetsLength; j++) {

					var morphTarget = morphTargets[j].vertices;

					morphTargetsPosition[j].push(morphTarget[face.a], morphTarget[face.b], morphTarget[face.c]);

				}

				for (var j = 0; j < morphNormalsLength; j++) {

					var morphNormal = morphNormals[j].vertexNormals[i];

					morphTargetsNormal[j].push(morphNormal.a, morphNormal.b, morphNormal.c);

				}

				// skins

				if (hasSkinIndices) {

					this.skinIndices.push(skinIndices[face.a], skinIndices[face.b], skinIndices[face.c]);

				}

				if (hasSkinWeights) {

					this.skinWeights.push(skinWeights[face.a], skinWeights[face.b], skinWeights[face.c]);

				}

			}

			this.computeGroups(geometry);

			this.verticesNeedUpdate = geometry.verticesNeedUpdate;
			this.normalsNeedUpdate = geometry.normalsNeedUpdate;
			this.colorsNeedUpdate = geometry.colorsNeedUpdate;
			this.uvsNeedUpdate = geometry.uvsNeedUpdate;
			this.groupsNeedUpdate = geometry.groupsNeedUpdate;

			return this;

		},

		dispose: function () {

			this.dispatchEvent({
				type: 'dispose'
			});

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.DirectGeometry.prototype);

	// File:../dev/three/core/BufferGeometry.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.BufferGeometry = function () {

		Object.defineProperty(this, 'id', {
			value: THREE.GeometryIdCount++
		});

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.type = 'BufferGeometry';

		this.index = null;
		this.attributes = {};

		this.morphAttributes = {};

		this.groups = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		this.drawRange = {
			start: 0,
			count: Infinity
		};

	};

	THREE.BufferGeometry.prototype = {

		constructor: THREE.BufferGeometry,

		getIndex: function () {

			return this.index;

		},

		setIndex: function (index) {

			this.index = index;

		},

		addAttribute: function (name, attribute) {

			if (attribute instanceof THREE.BufferAttribute === false && attribute instanceof THREE.InterleavedBufferAttribute === false) {

				console.warn('THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).');

				this.addAttribute(name, new THREE.BufferAttribute(arguments[1], arguments[2]));

				return;

			}

			if (name === 'index') {

				console.warn('THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.');
				this.setIndex(attribute);

				return;

			}

			this.attributes[name] = attribute;

			return this;

		},

		getAttribute: function (name) {

			return this.attributes[name];

		},

		removeAttribute: function (name) {

			delete this.attributes[name];

			return this;

		},

		addGroup: function (start, count, materialIndex) {

			this.groups.push({

				start: start,
				count: count,
				materialIndex: materialIndex !== undefined ? materialIndex : 0

			});

		},

		clearGroups: function () {

			this.groups = [];

		},

		setDrawRange: function (start, count) {

			this.drawRange.start = start;
			this.drawRange.count = count;

		},

		applyMatrix: function (matrix) {

			var position = this.attributes.position;

			if (position !== undefined) {

				matrix.applyToVector3Array(position.array);
				position.needsUpdate = true;

			}

			var normal = this.attributes.normal;

			if (normal !== undefined) {

				var normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);

				normalMatrix.applyToVector3Array(normal.array);
				normal.needsUpdate = true;

			}

			if (this.boundingBox !== null) {

				this.computeBoundingBox();

			}

			if (this.boundingSphere !== null) {

				this.computeBoundingSphere();

			}

			return this;

		},

		rotateX: function () {

			// rotate geometry around world x-axis

			var m1;

			return function rotateX(angle) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeRotationX(angle);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		rotateY: function () {

			// rotate geometry around world y-axis

			var m1;

			return function rotateY(angle) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeRotationY(angle);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		rotateZ: function () {

			// rotate geometry around world z-axis

			var m1;

			return function rotateZ(angle) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeRotationZ(angle);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		translate: function () {

			// translate geometry

			var m1;

			return function translate(x, y, z) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeTranslation(x, y, z);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		scale: function () {

			// scale geometry

			var m1;

			return function scale(x, y, z) {

				if (m1 === undefined) m1 = new THREE.Matrix4();

				m1.makeScale(x, y, z);

				this.applyMatrix(m1);

				return this;

			};

		}(),

		lookAt: function () {

			var obj;

			return function lookAt(vector) {

				if (obj === undefined) obj = new THREE.Object3D();

				obj.lookAt(vector);

				obj.updateMatrix();

				this.applyMatrix(obj.matrix);

			};

		}(),

		center: function () {

			this.computeBoundingBox();

			var offset = this.boundingBox.center().negate();

			this.translate(offset.x, offset.y, offset.z);

			return offset;

		},

		setFromObject: function (object) {

			// console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

			var geometry = object.geometry;

			if (object instanceof THREE.Points || object instanceof THREE.Line) {

				var positions = new THREE.Float32Attribute(geometry.vertices.length * 3, 3);
				var colors = new THREE.Float32Attribute(geometry.colors.length * 3, 3);

				this.addAttribute('position', positions.copyVector3sArray(geometry.vertices));
				this.addAttribute('color', colors.copyColorsArray(geometry.colors));

				if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {

					var lineDistances = new THREE.Float32Attribute(geometry.lineDistances.length, 1);

					this.addAttribute('lineDistance', lineDistances.copyArray(geometry.lineDistances));

				}

				if (geometry.boundingSphere !== null) {

					this.boundingSphere = geometry.boundingSphere.clone();

				}

				if (geometry.boundingBox !== null) {

					this.boundingBox = geometry.boundingBox.clone();

				}

			} else if (object instanceof THREE.Mesh) {

				if (geometry instanceof THREE.Geometry) {

					this.fromGeometry(geometry);

				}

			}

			return this;

		},

		updateFromObject: function (object) {

			var geometry = object.geometry;

			if (object instanceof THREE.Mesh) {

				var direct = geometry.__directGeometry;

				if (direct === undefined) {

					return this.fromGeometry(geometry);

				}

				direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
				direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
				direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
				direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
				direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

				geometry.verticesNeedUpdate = false;
				geometry.normalsNeedUpdate = false;
				geometry.colorsNeedUpdate = false;
				geometry.uvsNeedUpdate = false;
				geometry.groupsNeedUpdate = false;

				geometry = direct;

			}

			if (geometry.verticesNeedUpdate === true) {

				var attribute = this.attributes.position;

				if (attribute !== undefined) {

					attribute.copyVector3sArray(geometry.vertices);
					attribute.needsUpdate = true;

				}

				geometry.verticesNeedUpdate = false;

			}

			if (geometry.normalsNeedUpdate === true) {

				var attribute = this.attributes.normal;

				if (attribute !== undefined) {

					attribute.copyVector3sArray(geometry.normals);
					attribute.needsUpdate = true;

				}

				geometry.normalsNeedUpdate = false;

			}

			if (geometry.colorsNeedUpdate === true) {

				var attribute = this.attributes.color;

				if (attribute !== undefined) {

					attribute.copyColorsArray(geometry.colors);
					attribute.needsUpdate = true;

				}

				geometry.colorsNeedUpdate = false;

			}

			if (geometry.uvsNeedUpdate) {

				var attribute = this.attributes.uv;

				if (attribute !== undefined) {

					attribute.copyVector2sArray(geometry.uvs);
					attribute.needsUpdate = true;

				}

				geometry.uvsNeedUpdate = false;

			}

			if (geometry.lineDistancesNeedUpdate) {

				var attribute = this.attributes.lineDistance;

				if (attribute !== undefined) {

					attribute.copyArray(geometry.lineDistances);
					attribute.needsUpdate = true;

				}

				geometry.lineDistancesNeedUpdate = false;

			}

			if (geometry.groupsNeedUpdate) {

				geometry.computeGroups(object.geometry);
				this.groups = geometry.groups;

				geometry.groupsNeedUpdate = false;

			}

			return this;

		},

		fromGeometry: function (geometry) {

			geometry.__directGeometry = new THREE.DirectGeometry().fromGeometry(geometry);

			return this.fromDirectGeometry(geometry.__directGeometry);

		},

		fromDirectGeometry: function (geometry) {

			var positions = new Float32Array(geometry.vertices.length * 3);
			this.addAttribute('position', new THREE.BufferAttribute(positions, 3).copyVector3sArray(geometry.vertices));

			if (geometry.normals.length > 0) {

				var normals = new Float32Array(geometry.normals.length * 3);
				this.addAttribute('normal', new THREE.BufferAttribute(normals, 3).copyVector3sArray(geometry.normals));

			}

			if (geometry.colors.length > 0) {

				var colors = new Float32Array(geometry.colors.length * 3);
				this.addAttribute('color', new THREE.BufferAttribute(colors, 3).copyColorsArray(geometry.colors));

			}

			if (geometry.uvs.length > 0) {

				var uvs = new Float32Array(geometry.uvs.length * 2);
				this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2).copyVector2sArray(geometry.uvs));

			}

			if (geometry.uvs2.length > 0) {

				var uvs2 = new Float32Array(geometry.uvs2.length * 2);
				this.addAttribute('uv2', new THREE.BufferAttribute(uvs2, 2).copyVector2sArray(geometry.uvs2));

			}

			if (geometry.indices.length > 0) {

				var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array;
				var indices = new TypeArray(geometry.indices.length * 3);
				this.setIndex(new THREE.BufferAttribute(indices, 1).copyIndicesArray(geometry.indices));

			}

			// groups

			this.groups = geometry.groups;

			// morphs

			for (var name in geometry.morphTargets) {

				var array = [];
				var morphTargets = geometry.morphTargets[name];

				for (var i = 0, l = morphTargets.length; i < l; i++) {

					var morphTarget = morphTargets[i];

					var attribute = new THREE.Float32Attribute(morphTarget.length * 3, 3);

					array.push(attribute.copyVector3sArray(morphTarget));

				}

				this.morphAttributes[name] = array;

			}

			// skinning

			if (geometry.skinIndices.length > 0) {

				var skinIndices = new THREE.Float32Attribute(geometry.skinIndices.length * 4, 4);
				this.addAttribute('skinIndex', skinIndices.copyVector4sArray(geometry.skinIndices));

			}

			if (geometry.skinWeights.length > 0) {

				var skinWeights = new THREE.Float32Attribute(geometry.skinWeights.length * 4, 4);
				this.addAttribute('skinWeight', skinWeights.copyVector4sArray(geometry.skinWeights));

			}

			//

			if (geometry.boundingSphere !== null) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			if (geometry.boundingBox !== null) {

				this.boundingBox = geometry.boundingBox.clone();

			}

			return this;

		},

		computeBoundingBox: function () {

			if (this.boundingBox === null) {

				this.boundingBox = new THREE.Box3();

			}

			if (!this.attributes.position) return;

			var positions = this.attributes.position.array;

			if (positions !== undefined) {

				this.boundingBox.setFromArray(positions);

			} else {

				this.boundingBox.makeEmpty();

			}

			if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {

				console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);

			}

		},

		computeBoundingSphere: function () {

			var box = new THREE.Box3();
			var vector = new THREE.Vector3();

			return function () {

				if (this.boundingSphere === null) {

					this.boundingSphere = new THREE.Sphere();

				}

				var positions = this.attributes.position.array;

				if (positions) {

					var center = this.boundingSphere.center;

					box.setFromArray(positions);
					box.center(center);

					// hoping to find a boundingSphere with a radius smaller than the
					// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

					var maxRadiusSq = 0;

					for (var i = 0, il = positions.length; i < il; i += 3) {

						vector.fromArray(positions, i);
						maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));

					}

					this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

					if (isNaN(this.boundingSphere.radius)) {

						console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);

					}

				}

			};

		}(),

		computeFaceNormals: function () {

			// backwards compatibility

		},

		computeVertexNormals: function () {

			var index = this.index;
			var attributes = this.attributes;
			var groups = this.groups;

			if (attributes.position) {

				var positions = attributes.position.array;

				if (attributes.normal === undefined) {

					this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(positions.length), 3));

				} else {

					// reset existing normals to zero

					var array = attributes.normal.array;

					for (var i = 0, il = array.length; i < il; i++) {

						array[i] = 0;

					}

				}

				var normals = attributes.normal.array;

				var vA, vB, vC,

					pA = new THREE.Vector3(),
					pB = new THREE.Vector3(),
					pC = new THREE.Vector3(),

					cb = new THREE.Vector3(),
					ab = new THREE.Vector3();

				// indexed elements

				if (index) {

					var indices = index.array;

					if (groups.length === 0) {

						this.addGroup(0, indices.length);

					}

					for (var j = 0, jl = groups.length; j < jl; ++j) {

						var group = groups[j];

						var start = group.start;
						var count = group.count;

						for (var i = start, il = start + count; i < il; i += 3) {

							vA = indices[i + 0] * 3;
							vB = indices[i + 1] * 3;
							vC = indices[i + 2] * 3;

							pA.fromArray(positions, vA);
							pB.fromArray(positions, vB);
							pC.fromArray(positions, vC);

							cb.subVectors(pC, pB);
							ab.subVectors(pA, pB);
							cb.cross(ab);

							var area = cb.length();

							normals[vA] += cb.x * area;
							normals[vA + 1] += cb.y * area;
							normals[vA + 2] += cb.z * area;

							normals[vB] += cb.x * area;
							normals[vB + 1] += cb.y * area;
							normals[vB + 2] += cb.z * area;

							normals[vC] += cb.x * area;
							normals[vC + 1] += cb.y * area;
							normals[vC + 2] += cb.z * area;

						}

					}

				} else {

					// non-indexed elements (unconnected triangle soup)

					for (var i = 0, il = positions.length; i < il; i += 9) {

						pA.fromArray(positions, i);
						pB.fromArray(positions, i + 3);
						pC.fromArray(positions, i + 6);

						cb.subVectors(pC, pB);
						ab.subVectors(pA, pB);
						cb.cross(ab);

						normals[i] = cb.x;
						normals[i + 1] = cb.y;
						normals[i + 2] = cb.z;

						normals[i + 3] = cb.x;
						normals[i + 4] = cb.y;
						normals[i + 5] = cb.z;

						normals[i + 6] = cb.x;
						normals[i + 7] = cb.y;
						normals[i + 8] = cb.z;

					}

				}

				this.normalizeNormals();

				attributes.normal.needsUpdate = true;

			}

		},

		merge: function (geometry, offset) {

			if (geometry instanceof THREE.BufferGeometry === false) {

				console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
				return;

			}

			if (offset === undefined) offset = 0;

			var attributes = this.attributes;

			for (var key in attributes) {

				if (geometry.attributes[key] === undefined) continue;

				var attribute1 = attributes[key];
				var attributeArray1 = attribute1.array;

				var attribute2 = geometry.attributes[key];
				var attributeArray2 = attribute2.array;

				var attributeSize = attribute2.itemSize;

				for (var i = 0, j = attributeSize * offset; i < attributeArray2.length; i++, j++) {

					attributeArray1[j] = attributeArray2[i];

				}

			}

			return this;

		},

		normalizeNormals: function () {

			var normals = this.attributes.normal.array;

			var x, y, z, n;

			for (var i = 0, il = normals.length; i < il; i += 3) {

				x = normals[i];
				y = normals[i + 1];
				z = normals[i + 2];

				n = 1.0 / Math.sqrt(x * x + y * y + z * z);

				normals[i] *= n;
				normals[i + 1] *= n;
				normals[i + 2] *= n;

			}

		},

		toNonIndexed: function () {

			if (this.index === null) {

				console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.');
				return this;

			}

			var geometry2 = new THREE.BufferGeometry();

			var indices = this.index.array;
			var attributes = this.attributes;

			for (var name in attributes) {

				var attribute = attributes[name];

				var array = attribute.array;
				var itemSize = attribute.itemSize;

				var array2 = new array.constructor(indices.length * itemSize);

				var index = 0,
					index2 = 0;

				for (var i = 0, l = indices.length; i < l; i++) {

					index = indices[i] * itemSize;

					for (var j = 0; j < itemSize; j++) {

						array2[index2++] = array[index++];

					}

				}

				geometry2.addAttribute(name, new THREE.BufferAttribute(array2, itemSize));

			}

			return geometry2;

		},

		toJSON: function () {

			var data = {
				metadata: {
					version: 4.4,
					type: 'BufferGeometry',
					generator: 'BufferGeometry.toJSON'
				}
			};

			// standard BufferGeometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if (this.name !== '') data.name = this.name;

			if (this.parameters !== undefined) {

				var parameters = this.parameters;

				for (var key in parameters) {

					if (parameters[key] !== undefined) data[key] = parameters[key];

				}

				return data;

			}

			data.data = {
				attributes: {}
			};

			var index = this.index;

			if (index !== null) {

				var array = Array.prototype.slice.call(index.array);

				data.data.index = {
					type: index.array.constructor.name,
					array: array
				};

			}

			var attributes = this.attributes;

			for (var key in attributes) {

				var attribute = attributes[key];

				var array = Array.prototype.slice.call(attribute.array);

				data.data.attributes[key] = {
					itemSize: attribute.itemSize,
					type: attribute.array.constructor.name,
					array: array,
					normalized: attribute.normalized
				};

			}

			var groups = this.groups;

			if (groups.length > 0) {

				data.data.groups = JSON.parse(JSON.stringify(groups));

			}

			var boundingSphere = this.boundingSphere;

			if (boundingSphere !== null) {

				data.data.boundingSphere = {
					center: boundingSphere.center.toArray(),
					radius: boundingSphere.radius
				};

			}

			return data;

		},

		clone: function () {

			/*
			// Handle primitives

			var parameters = this.parameters;

			if ( parameters !== undefined ) {

				var values = [];

				for ( var key in parameters ) {

					values.push( parameters[ key ] );

				}

				var geometry = Object.create( this.constructor.prototype );
				this.constructor.apply( geometry, values );
				return geometry;

			}

			return new this.constructor().copy( this );
			*/

			return new THREE.BufferGeometry().copy(this);

		},

		copy: function (source) {

			var index = source.index;

			if (index !== null) {

				this.setIndex(index.clone());

			}

			var attributes = source.attributes;

			for (var name in attributes) {

				var attribute = attributes[name];
				this.addAttribute(name, attribute.clone());

			}

			var groups = source.groups;

			for (var i = 0, l = groups.length; i < l; i++) {

				var group = groups[i];
				this.addGroup(group.start, group.count, group.materialIndex);

			}

			return this;

		},

		dispose: function () {

			this.dispatchEvent({
				type: 'dispose'
			});

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.BufferGeometry.prototype);

	THREE.BufferGeometry.MaxIndex = 65535;

	// File:../dev/three/core/InterleavedBuffer.js

	/**
	 * @author benaadams / https://twitter.com/ben_a_adams
	 */

	THREE.InterleavedBuffer = function (array, stride) {

		this.uuid = THREE.Math.generateUUID();

		this.array = array;
		this.stride = stride;

		this.dynamic = false;
		this.updateRange = {
			offset: 0,
			count: -1
		};

		this.version = 0;

	};

	THREE.InterleavedBuffer.prototype = {

		constructor: THREE.InterleavedBuffer,

		get length() {

			return this.array.length;

		},

		get count() {

			return this.array.length / this.stride;

		},

		set needsUpdate(value) {

			if (value === true) this.version++;

		},

		setDynamic: function (value) {

			this.dynamic = value;

			return this;

		},

		copy: function (source) {

			this.array = new source.array.constructor(source.array);
			this.stride = source.stride;
			this.dynamic = source.dynamic;

			return this;

		},

		copyAt: function (index1, attribute, index2) {

			index1 *= this.stride;
			index2 *= attribute.stride;

			for (var i = 0, l = this.stride; i < l; i++) {

				this.array[index1 + i] = attribute.array[index2 + i];

			}

			return this;

		},

		set: function (value, offset) {

			if (offset === undefined) offset = 0;

			this.array.set(value, offset);

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		}

	};

	// File:../dev/three/core/InterleavedBufferAttribute.js

	/**
	 * @author benaadams / https://twitter.com/ben_a_adams
	 */

	THREE.InterleavedBufferAttribute = function (interleavedBuffer, itemSize, offset) {

		this.uuid = THREE.Math.generateUUID();

		this.data = interleavedBuffer;
		this.itemSize = itemSize;
		this.offset = offset;

	};


	THREE.InterleavedBufferAttribute.prototype = {

		constructor: THREE.InterleavedBufferAttribute,

		get length() {

			console.warn('THREE.BufferAttribute: .length has been deprecated. Please use .count.');
			return this.array.length;

		},

		get count() {

			return this.data.count;

		},

		setX: function (index, x) {

			this.data.array[index * this.data.stride + this.offset] = x;

			return this;

		},

		setY: function (index, y) {

			this.data.array[index * this.data.stride + this.offset + 1] = y;

			return this;

		},

		setZ: function (index, z) {

			this.data.array[index * this.data.stride + this.offset + 2] = z;

			return this;

		},

		setW: function (index, w) {

			this.data.array[index * this.data.stride + this.offset + 3] = w;

			return this;

		},

		getX: function (index) {

			return this.data.array[index * this.data.stride + this.offset];

		},

		getY: function (index) {

			return this.data.array[index * this.data.stride + this.offset + 1];

		},

		getZ: function (index) {

			return this.data.array[index * this.data.stride + this.offset + 2];

		},

		getW: function (index) {

			return this.data.array[index * this.data.stride + this.offset + 3];

		},

		setXY: function (index, x, y) {

			index = index * this.data.stride + this.offset;

			this.data.array[index + 0] = x;
			this.data.array[index + 1] = y;

			return this;

		},

		setXYZ: function (index, x, y, z) {

			index = index * this.data.stride + this.offset;

			this.data.array[index + 0] = x;
			this.data.array[index + 1] = y;
			this.data.array[index + 2] = z;

			return this;

		},

		setXYZW: function (index, x, y, z, w) {

			index = index * this.data.stride + this.offset;

			this.data.array[index + 0] = x;
			this.data.array[index + 1] = y;
			this.data.array[index + 2] = z;
			this.data.array[index + 3] = w;

			return this;

		}

	};

	// File:../dev/three/core/InstancedBufferAttribute.js

	/**
	 * @author benaadams / https://twitter.com/ben_a_adams
	 */

	THREE.InstancedBufferAttribute = function (array, itemSize, meshPerAttribute) {

		THREE.BufferAttribute.call(this, array, itemSize);

		this.meshPerAttribute = meshPerAttribute || 1;

	};

	THREE.InstancedBufferAttribute.prototype = Object.create(THREE.BufferAttribute.prototype);
	THREE.InstancedBufferAttribute.prototype.constructor = THREE.InstancedBufferAttribute;

	THREE.InstancedBufferAttribute.prototype.copy = function (source) {

		THREE.BufferAttribute.prototype.copy.call(this, source);

		this.meshPerAttribute = source.meshPerAttribute;

		return this;

	};

	// File:../dev/three/core/InstancedBufferGeometry.js

	/**
	 * @author benaadams / https://twitter.com/ben_a_adams
	 */

	THREE.InstancedBufferGeometry = function () {

		THREE.BufferGeometry.call(this);

		this.type = 'InstancedBufferGeometry';
		this.maxInstancedCount = undefined;

	};

	THREE.InstancedBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
	THREE.InstancedBufferGeometry.prototype.constructor = THREE.InstancedBufferGeometry;

	THREE.InstancedBufferGeometry.prototype.addGroup = function (start, count, instances) {

		this.groups.push({

			start: start,
			count: count,
			instances: instances

		});

	};

	THREE.InstancedBufferGeometry.prototype.copy = function (source) {

		var index = source.index;

		if (index !== null) {

			this.setIndex(index.clone());

		}

		var attributes = source.attributes;

		for (var name in attributes) {

			var attribute = attributes[name];
			this.addAttribute(name, attribute.clone());

		}

		var groups = source.groups;

		for (var i = 0, l = groups.length; i < l; i++) {

			var group = groups[i];
			this.addGroup(group.start, group.count, group.instances);

		}

		return this;

	};

	THREE.EventDispatcher.prototype.apply(THREE.InstancedBufferGeometry.prototype);

	// File:../dev/three/core/InstancedInterleavedBuffer.js

	/**
	 * @author benaadams / https://twitter.com/ben_a_adams
	 */

	THREE.InstancedInterleavedBuffer = function (array, stride, meshPerAttribute) {

		THREE.InterleavedBuffer.call(this, array, stride);

		this.meshPerAttribute = meshPerAttribute || 1;

	};

	THREE.InstancedInterleavedBuffer.prototype = Object.create(THREE.InterleavedBuffer.prototype);
	THREE.InstancedInterleavedBuffer.prototype.constructor = THREE.InstancedInterleavedBuffer;

	THREE.InstancedInterleavedBuffer.prototype.copy = function (source) {

		THREE.InterleavedBuffer.prototype.copy.call(this, source);

		this.meshPerAttribute = source.meshPerAttribute;

		return this;

	};

	// File:../dev/three/core/Uniform.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Uniform = function (value) {

		if (typeof value === 'string') {

			console.warn('THREE.Uniform: Type parameter is no longer needed.');
			value = arguments[1];

		}

		this.value = value;

		this.dynamic = false;

	};

	THREE.Uniform.prototype = {

		constructor: THREE.Uniform,

		onUpdate: function (callback) {

			this.dynamic = true;
			this.onUpdateCallback = callback;

			return this;

		}

	};

	// File:../dev/three/animation/AnimationClip.js

	/**
	 *
	 * Reusable set of Tracks that represent an animation.
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 */

	THREE.AnimationClip = function (name, duration, tracks) {

		this.name = name || THREE.Math.generateUUID();
		this.tracks = tracks;
		this.duration = (duration !== undefined) ? duration : -1;

		// this means it should figure out its duration by scanning the tracks
		if (this.duration < 0) {

			this.resetDuration();

		}

		// maybe only do these on demand, as doing them here could potentially slow down loading
		// but leaving these here during development as this ensures a lot of testing of these functions

		// PI_BEGIN
		// this.trim();
		// this.optimize();
		// PI_END

	};

	THREE.AnimationClip.prototype = {

		constructor: THREE.AnimationClip,

		resetDuration: function () {

			var tracks = this.tracks,
				duration = 0;

			for (var i = 0, n = tracks.length; i !== n; ++i) {

				var track = this.tracks[i];

				duration = Math.max(
					duration, track.times[track.times.length - 1]);

			}

			this.duration = duration;

		},

		trim: function () {

			for (var i = 0; i < this.tracks.length; i++) {

				this.tracks[i].trim(0, this.duration);

			}

			return this;

		}
	};

	// Static methods:

	Object.assign(THREE.AnimationClip, {

		parse: function (json) {

			var tracks = [],
				jsonTracks = json.tracks,
				frameTime = 1.0 / (json.fps || 1.0);

			for (var i = 0, n = jsonTracks.length; i !== n; ++i) {

				tracks.push(THREE.KeyframeTrack.parse(jsonTracks[i]).scale(frameTime));

			}

			return new THREE.AnimationClip(json.name, json.duration, tracks);

		},


		toJSON: function (clip) {

			var tracks = [],
				clipTracks = clip.tracks;

			var json = {

				'name': clip.name,
				'duration': clip.duration,
				'tracks': tracks

			};

			for (var i = 0, n = clipTracks.length; i !== n; ++i) {

				tracks.push(THREE.KeyframeTrack.toJSON(clipTracks[i]));

			}

			return json;

		},


		CreateFromMorphTargetSequence: function (name, morphTargetSequence, fps, noLoop) {

			var numMorphTargets = morphTargetSequence.length;
			var tracks = [];

			for (var i = 0; i < numMorphTargets; i++) {

				var times = [];
				var values = [];

				times.push(
					(i + numMorphTargets - 1) % numMorphTargets,
					i,
					(i + 1) % numMorphTargets);

				values.push(0, 1, 0);

				var order = THREE.AnimationUtils.getKeyframeOrder(times);
				times = THREE.AnimationUtils.sortedArray(times, 1, order);
				values = THREE.AnimationUtils.sortedArray(values, 1, order);

				// if there is a key at the first frame, duplicate it as the
				// last frame as well for perfect loop.
				if (!noLoop && times[0] === 0) {

					times.push(numMorphTargets);
					values.push(values[0]);

				}

				tracks.push(
					new THREE.NumberKeyframeTrack(
						'.morphTargetInfluences[' + morphTargetSequence[i].name + ']',
						times, values
					).scale(1.0 / fps));
			}

			return new THREE.AnimationClip(name, -1, tracks);

		},

		findByName: function (clipArray, name) {

			for (var i = 0; i < clipArray.length; i++) {

				if (clipArray[i].name === name) {

					return clipArray[i];

				}
			}

			return null;

		},

		CreateClipsFromMorphTargetSequences: function (morphTargets, fps, noLoop) {

			var animationToMorphTargets = {};

			// tested with https://regex101.com/ on trick sequences
			// such flamingo_flyA_003, flamingo_run1_003, crdeath0059
			var pattern = /^([\w-]*?)([\d]+)$/;

			// sort morph target names into animation groups based
			// patterns like Walk_001, Walk_002, Run_001, Run_002
			for (var i = 0, il = morphTargets.length; i < il; i++) {

				var morphTarget = morphTargets[i];
				var parts = morphTarget.name.match(pattern);

				if (parts && parts.length > 1) {

					var name = parts[1];

					var animationMorphTargets = animationToMorphTargets[name];
					if (!animationMorphTargets) {

						animationToMorphTargets[name] = animationMorphTargets = [];

					}

					animationMorphTargets.push(morphTarget);

				}

			}

			var clips = [];

			for (var name in animationToMorphTargets) {

				clips.push(THREE.AnimationClip.CreateFromMorphTargetSequence(name, animationToMorphTargets[name], fps, noLoop));

			}

			return clips;

		},

		// parse the animation.hierarchy format
		// PI_BEGIN
		parseAnimation: function (animation, bones, nodeName, interpolant) {
			// PI_END
			if (!animation) {

				console.error("  no animation in JSONLoader data");
				return null;

			}

			var addNonemptyTrack = function (
				trackType, trackName, animationKeys, propertyName, destTracks, interpolant) {

				// only return track if there are actually keys.
				if (animationKeys.length !== 0) {

					var times = [];
					var values = [];

					THREE.AnimationUtils.flattenJSON(
						animationKeys, times, values, propertyName);

					// empty keys are filtered out, so check again
					if (times.length !== 0) {

						destTracks.push(new trackType(trackName, times, values, interpolant));

					}

				}

			};

			var tracks = [];

			var clipName = animation.name || 'default';
			// automatic length determination in AnimationClip.
			var duration = animation.length || -1;
			var fps = animation.fps || 30;

			var hierarchyTracks = animation.hierarchy || [];

			for (var h = 0; h < hierarchyTracks.length; h++) {

				var animationKeys = hierarchyTracks[h].keys;

				// skip empty tracks
				if (!animationKeys || animationKeys.length == 0) continue;

				// process morph targets in a way exactly compatible
				// with AnimationHandler.init( animation )
				if (animationKeys[0].morphTargets) {

					// figure out all morph targets used in this track
					var morphTargetNames = {};
					for (var k = 0; k < animationKeys.length; k++) {

						if (animationKeys[k].morphTargets) {

							for (var m = 0; m < animationKeys[k].morphTargets.length; m++) {

								morphTargetNames[animationKeys[k].morphTargets[m]] = -1;
							}

						}

					}

					// create a track for each morph target with all zero
					// morphTargetInfluences except for the keys in which
					// the morphTarget is named.
					for (var morphTargetName in morphTargetNames) {

						var times = [];
						var values = [];

						for (var m = 0; m !== animationKeys[k].morphTargets.length; ++m) {

							var animationKey = animationKeys[k];

							times.push(animationKey.time);
							values.push((animationKey.morphTarget === morphTargetName) ? 1 : 0)

						}

						tracks.push(new THREE.NumberKeyframeTrack(
							'.morphTargetInfluence[' + morphTargetName + ']', times, values));

					}

					duration = morphTargetNames.length * (fps || 1.0);

				} else {
					// ...assume skeletal animation

					// var boneName = '.bones[' + bones[ h ].name + ']';
					// PI_BEGIN

					var boneName;

					if (typeof bones === "string") {
						boneName = bones;
					} else {
						var r = false;
						var n = hierarchyTracks[h].name;

						for (var kk = 0; kk < bones.length; ++kk) {
							if (bones[kk].name === n) {
								r = true;
								break;
							}
						}
						if (!r) continue;

						boneName = '.bones[' + n + ']';
					}
					// PI_END

					addNonemptyTrack(
						THREE.VectorKeyframeTrack, boneName + '.position',
						animationKeys, 'pos', tracks, interpolant);

					addNonemptyTrack(
						THREE.QuaternionKeyframeTrack, boneName + '.quaternion',
						animationKeys, 'rot', tracks, interpolant);

					addNonemptyTrack(
						THREE.VectorKeyframeTrack, boneName + '.scale',
						animationKeys, 'scl', tracks, interpolant);
				}

			}

			if (tracks.length === 0) {

				return null;

			}

			var clip = new THREE.AnimationClip(clipName, duration, tracks);

			return clip;

		},


	});


	// File:../dev/three/animation/AnimationMixer.js

	/**
	 *
	 * Player for AnimationClips.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.AnimationMixer = function (root) {

		this._root = root;
		this._initMemoryManager();
		this._accuIndex = 0;

		this.time = 0;

		this.timeScale = 1.0;

	};

	THREE.AnimationMixer.prototype = {

		constructor: THREE.AnimationMixer,

		// return an action for a clip optionally using a custom root target
		// object (this method allocates a lot of dynamic memory in case a
		// previously unknown clip/root combination is specified)
		clipAction: function (clip, optionalRoot) {

			if (!clip) return;

			var root = optionalRoot || this._root,
				rootUuid = root.uuid,
				clipName = (typeof clip === 'string') ? clip : clip.name,
				clipObject = (clip !== clipName) ? clip : null,

				actionsForClip = this._actionsByClip[clipName],
				prototypeAction;

			if (actionsForClip !== undefined) {

				var existingAction =
					actionsForClip.actionByRoot[rootUuid];

				if (existingAction !== undefined) {

					return existingAction;

				}

				// we know the clip, so we don't have to parse all
				// the bindings again but can just copy
				prototypeAction = actionsForClip.knownActions[0];

				// also, take the clip from the prototype action
				clipObject = prototypeAction._clip;

				if (clip !== clipName && clip !== clipObject) {

					throw new Error(
						"Different clips with the same name detected!");

				}

			}

			// clip must be known when specified via string
			if (clipObject === null) return null;

			// allocate all resources required to run it
			var newAction = new THREE.
			AnimationMixer._Action(this, clipObject, optionalRoot);

			this._bindAction(newAction, prototypeAction);

			// and make the action known to the memory manager
			this._addInactiveAction(newAction, clipName, rootUuid);

			return newAction;

		},

		// get an existing action
		existingAction: function (clip, optionalRoot) {

			var root = optionalRoot || this._root,
				rootUuid = root.uuid,
				clipName = (typeof clip === 'string') ? clip : clip.name,
				actionsForClip = this._actionsByClip[clipName];

			if (actionsForClip !== undefined) {

				return actionsForClip.actionByRoot[rootUuid] || null;

			}

			return null;

		},

		// deactivates all previously scheduled actions
		stopAllAction: function () {

			var actions = this._actions,
				nActions = this._nActiveActions,
				bindings = this._bindings,
				nBindings = this._nActiveBindings;

			this._nActiveActions = 0;
			this._nActiveBindings = 0;

			for (var i = 0; i !== nActions; ++i) {

				actions[i].reset();

			}

			for (var i = 0; i !== nBindings; ++i) {

				bindings[i].useCount = 0;

			}

			return this;

		},

		// advance the time and update apply the animation
		update: function (deltaTime) {
			deltaTime *= this.timeScale;

			var actions = this._actions,
				nActions = this._nActiveActions,

				time = this.time += deltaTime,
				timeDirection = Math.sign(deltaTime),

				accuIndex = this._accuIndex ^= 1;

			// run active actions

			for (var i = 0; i !== nActions; ++i) {

				var action = actions[i];

				if (action.enabled) {

					action._update(time, deltaTime, timeDirection, accuIndex);

				}

			}

			// update scene graph

			var bindings = this._bindings,
				nBindings = this._nActiveBindings;

			for (var i = 0; i !== nBindings; ++i) {

				bindings[i].apply(accuIndex);

			}

			return this;

		},

		// return this mixer's root target object
		getRoot: function () {

			return this._root;

		},

		// free all resources specific to a particular clip
		uncacheClip: function (clip) {

			var actions = this._actions,
				clipName = clip.name,
				actionsByClip = this._actionsByClip,
				actionsForClip = actionsByClip[clipName];

			if (actionsForClip !== undefined) {

				// note: just calling _removeInactiveAction would mess up the
				// iteration state and also require updating the state we can
				// just throw away

				var actionsToRemove = actionsForClip.knownActions;

				for (var i = 0, n = actionsToRemove.length; i !== n; ++i) {

					var action = actionsToRemove[i];

					this._deactivateAction(action);

					var cacheIndex = action._cacheIndex,
						lastInactiveAction = actions[actions.length - 1];

					action._cacheIndex = null;
					action._byClipCacheIndex = null;

					lastInactiveAction._cacheIndex = cacheIndex;
					actions[cacheIndex] = lastInactiveAction;
					actions.pop();

					this._removeInactiveBindingsForAction(action);

				}

				delete actionsByClip[clipName];

			}

		},

		// free all resources specific to a particular root target object
		uncacheRoot: function (root) {

			var rootUuid = root.uuid,
				actionsByClip = this._actionsByClip;

			for (var clipName in actionsByClip) {

				var actionByRoot = actionsByClip[clipName].actionByRoot,
					action = actionByRoot[rootUuid];

				if (action !== undefined) {

					this._deactivateAction(action);
					this._removeInactiveAction(action);

				}

			}

			var bindingsByRoot = this._bindingsByRootAndName,
				bindingByName = bindingsByRoot[rootUuid];

			for (var trackName in bindingByName) {

				if (bindingByName !== undefined) {

					var binding = bindingByName[trackName];
					binding.restoreOriginalState();
					this._removeInactiveBinding(binding);

				}

			}

		},

		// remove a targeted clip from the cache
		uncacheAction: function (clip, optionalRoot) {

			var action = this.existingAction(clip, optionalRoot);

			if (action !== null) {

				this._deactivateAction(action);
				this._removeInactiveAction(action);

			}

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.AnimationMixer.prototype);

	THREE.AnimationMixer._Action =
		function (mixer, clip, localRoot) {

			this._mixer = mixer;
			this._clip = clip;
			this._localRoot = localRoot || null;

			var tracks = clip.tracks,
				nTracks = tracks.length,
				interpolants = new Array(nTracks);

			var interpolantSettings = {
				endingStart: THREE.ZeroCurvatureEnding,
				endingEnd: THREE.ZeroCurvatureEnding
			};

			for (var i = 0; i !== nTracks; ++i) {

				var interpolant = tracks[i].createInterpolant(null);
				interpolants[i] = interpolant;
				interpolant.settings = interpolantSettings

			}

			this._interpolantSettings = interpolantSettings;

			this._interpolants = interpolants; // bound by the mixer

			// inside: PropertyMixer (managed by the mixer)
			this._propertyBindings = new Array(nTracks);

			this._cacheIndex = null; // for the memory manager
			this._byClipCacheIndex = null; // for the memory manager

			this._timeScaleInterpolant = null;
			this._weightInterpolant = null;

			this.loop = THREE.LoopRepeat;
			this._loopCount = -1;

			// global mixer time when the action is to be started
			// it's set back to 'null' upon start of the action
			this._startTime = null;

			// scaled local time of the action
			// gets clamped or wrapped to 0..clip.duration according to loop
			this.time = 0;

			this.timeScale = 1;
			this._effectiveTimeScale = 1;

			this.weight = 1;
			this._effectiveWeight = 1;

			this.repetitions = Infinity; // no. of repetitions when looping

			this.paused = false; // false -> zero effective time scale
			this.enabled = true; // true -> zero effective weight

			this.clampWhenFinished = false; // keep feeding the last frame?

			this.zeroSlopeAtStart = true; // for smooth interpolation w/o separate
			this.zeroSlopeAtEnd = true; // clips for start, loop and end
		};

	THREE.AnimationMixer._Action.prototype = {

		constructor: THREE.AnimationMixer._Action,

		// State & Scheduling

		play: function () {

			// PI_BEGIN
			this.isFinished = false;
			// PI_END

			this._mixer._activateAction(this);

			return this;

		},

		stop: function () {

			// PI_BEGIN
			this.isFinished = true;
			// PI_END

			this._mixer._deactivateAction(this);

			return this.reset();

		},

		reset: function () {

			// PI_BEGIN
			this.isFinished = false;
			// PI_END

			this.paused = false;
			this.enabled = true;

			this.time = 0; // restart clip
			this._loopCount = -1; // forget previous loops
			this._startTime = null; // forget scheduling

			return this.stopFading().stopWarping();

		},

		isRunning: function () {

			var start = this._startTime;

			return this.enabled && !this.paused && this.timeScale !== 0 &&
				this._startTime === null && this._mixer._isActiveAction(this)

		},

		// return true when play has been called
		isScheduled: function () {

			return this._mixer._isActiveAction(this);

		},

		startAt: function (time) {

			this._startTime = time;

			return this;

		},

		setLoop: function (mode, repetitions) {

			this.loop = mode;
			this.repetitions = repetitions || Infinity;

			return this;

		},

		// Weight

		// set the weight stopping any scheduled fading
		// although .enabled = false yields an effective weight of zero, this
		// method does *not* change .enabled, because it would be confusing
		setEffectiveWeight: function (weight) {

			this.weight = weight;

			// note: same logic as when updated at runtime
			this._effectiveWeight = this.enabled ? weight : 0;

			return this.stopFading();

		},

		// return the weight considering fading and .enabled
		getEffectiveWeight: function () {

			return this._effectiveWeight;

		},

		fadeIn: function (duration) {

			return this._scheduleFading(duration, 0, 1);

		},

		fadeOut: function (duration) {

			return this._scheduleFading(duration, 1, 0);

		},

		crossFadeFrom: function (fadeOutAction, duration, warp) {

			var mixer = this._mixer;

			fadeOutAction.fadeOut(duration);
			this.fadeIn(duration);

			if (warp) {

				var fadeInDuration = this._clip.duration,
					fadeOutDuration = fadeOutAction._clip.duration,

					startEndRatio = fadeOutDuration / fadeInDuration,
					endStartRatio = fadeInDuration / fadeOutDuration;

				fadeOutAction.warp(1.0, startEndRatio, duration);
				this.warp(endStartRatio, 1.0, duration);

			}

			return this;

		},

		crossFadeTo: function (fadeInAction, duration, warp) {

			return fadeInAction.crossFadeFrom(this, duration, warp);

		},

		stopFading: function () {

			var weightInterpolant = this._weightInterpolant;

			if (weightInterpolant !== null) {

				this._weightInterpolant = null;
				this._mixer._takeBackControlInterpolant(weightInterpolant);

			}

			return this;

		},

		// Time Scale Control

		// set the weight stopping any scheduled warping
		// although .paused = true yields an effective time scale of zero, this
		// method does *not* change .paused, because it would be confusing
		setEffectiveTimeScale: function (timeScale) {

			this.timeScale = timeScale;
			this._effectiveTimeScale = this.paused ? 0 : timeScale;

			return this.stopWarping();

		},

		// return the time scale considering warping and .paused
		getEffectiveTimeScale: function () {

			return this._effectiveTimeScale;

		},

		setDuration: function (duration) {

			this.timeScale = this._clip.duration / duration;

			return this.stopWarping();

		},

		syncWith: function (action) {

			this.time = action.time;
			this.timeScale = action.timeScale;

			return this.stopWarping();

		},

		halt: function (duration) {

			return this.warp(this._currentTimeScale, 0, duration);

		},

		warp: function (startTimeScale, endTimeScale, duration) {

			var mixer = this._mixer,
				now = mixer.time,
				interpolant = this._timeScaleInterpolant,

				timeScale = this.timeScale;

			if (interpolant === null) {

				interpolant = mixer._lendControlInterpolant(),
					this._timeScaleInterpolant = interpolant;

			}

			var times = interpolant.parameterPositions,
				values = interpolant.sampleValues;

			times[0] = now;
			times[1] = now + duration;

			values[0] = startTimeScale / timeScale;
			values[1] = endTimeScale / timeScale;

			return this;

		},

		stopWarping: function () {

			var timeScaleInterpolant = this._timeScaleInterpolant;

			if (timeScaleInterpolant !== null) {

				this._timeScaleInterpolant = null;
				this._mixer._takeBackControlInterpolant(timeScaleInterpolant);

			}

			return this;

		},

		// Object Accessors

		getMixer: function () {

			return this._mixer;

		},

		getClip: function () {

			return this._clip;

		},

		getRoot: function () {

			return this._localRoot || this._mixer._root;

		},

		// Interna

		_update: function (time, deltaTime, timeDirection, accuIndex) {
			// called by the mixer

			var startTime = this._startTime;

			if (startTime !== null) {

				// check for scheduled start of action

				var timeRunning = (time - startTime) * timeDirection;
				if (timeRunning < 0 || timeDirection === 0) {

					return; // yet to come / don't decide when delta = 0

				}

				// start

				this._startTime = null; // unschedule
				deltaTime = timeDirection * timeRunning;

			}

			// apply time scale and advance time

			deltaTime *= this._updateTimeScale(time);
			var clipTime = this._updateTime(deltaTime);

			// note: _updateTime may disable the action resulting in
			// an effective weight of 0

			var weight = this._updateWeight(time);

			if (weight > 0) {

				var interpolants = this._interpolants;
				var propertyMixers = this._propertyBindings;

				for (var j = 0, m = interpolants.length; j !== m; ++j) {

					interpolants[j].evaluate(clipTime);
					propertyMixers[j].accumulate(accuIndex, weight);

				}

			}

		},

		_updateWeight: function (time) {

			var weight = 0;

			if (this.enabled) {

				weight = this.weight;
				var interpolant = this._weightInterpolant;

				if (interpolant !== null) {

					var interpolantValue = interpolant.evaluate(time)[0];

					weight *= interpolantValue;

					if (time > interpolant.parameterPositions[1]) {

						this.stopFading();

						if (interpolantValue === 0) {

							// faded out, disable
							this.enabled = false;

						}

					}

				}

			}

			this._effectiveWeight = weight;
			return weight;

		},

		_updateTimeScale: function (time) {

			var timeScale = 0;

			if (!this.paused) {

				timeScale = this.timeScale;

				var interpolant = this._timeScaleInterpolant;

				if (interpolant !== null) {

					var interpolantValue = interpolant.evaluate(time)[0];

					timeScale *= interpolantValue;

					if (time > interpolant.parameterPositions[1]) {

						this.stopWarping();

						if (timeScale === 0) {

							// motion has halted, pause
							this.pause = true;

						} else {

							// warp done - apply final time scale
							this.timeScale = timeScale;

						}

					}

				}

			}

			this._effectiveTimeScale = timeScale;
			return timeScale;

		},

		_updateTime: function (deltaTime) {

			var time = this.time + deltaTime;

			if (deltaTime === 0) return time;

			var duration = this._clip.duration,

				loop = this.loop,
				loopCount = this._loopCount,

				pingPong = false;

			switch (loop) {

				case THREE.LoopOnce:

					if (loopCount === -1) {

						// just started

						this.loopCount = 0;
						this._setEndings(true, true, false);

					}

					if (time >= duration) {

						time = duration;

					} else if (time < 0) {

						time = 0;

					} else break;

					// reached the end

					if (this.clampWhenFinished) this.pause = true;
					else this.enabled = false;

					// PI_BEGIN
					if (!this.isFinished) {
						this.isFinished = true;
						this._mixer.dispatchEvent({
							type: 'finished',
							action: this,
							direction: deltaTime < 0 ? -1 : 1
						});
					}
					// PI_END

					break;

				case THREE.LoopPingPong:

					pingPong = true;

				case THREE.LoopRepeat:

					if (loopCount === -1) {

						// just started

						if (deltaTime > 0) {

							loopCount = 0;

							this._setEndings(
								true, this.repetitions === 0, pingPong);

						} else {

							// when looping in reverse direction, the initial
							// transition through zero counts as a repetition,
							// so leave loopCount at -1

							this._setEndings(
								this.repetitions === 0, true, pingPong);

						}

					}

					if (time >= duration || time < 0) {

						// wrap around

						var loopDelta = Math.floor(time / duration); // signed
						time -= duration * loopDelta;

						loopCount += Math.abs(loopDelta);

						var pending = this.repetitions - loopCount;

						if (pending < 0) {

							// stop (switch state, clamp time, fire event)

							if (this.clampWhenFinished) this.paused = true;
							else this.enabled = false;

							time = deltaTime > 0 ? duration : 0;

							// PI_BEGIN
							if (!this.isFinished) {
								this.isFinished = true;
								this._mixer.dispatchEvent({
									type: 'finished',
									action: this,
									direction: deltaTime < 0 ? -1 : 1
								});
							}
							// PI_END

							break;

						} else if (pending === 0) {

							// transition to last round

							var atStart = deltaTime < 0;
							this._setEndings(atStart, !atStart, pingPong);

						} else {

							this._setEndings(false, false, pingPong);

						}

						this._loopCount = loopCount;

						this._mixer.dispatchEvent({
							type: 'loop',
							action: this,
							loopDelta: loopDelta
						});

					}

					if (loop === THREE.LoopPingPong && (loopCount & 1) === 1) {

						// invert time for the "pong round"

						this.time = time;

						return duration - time;

					}

					break;

			}

			this.time = time;

			return time;

		},

		_setEndings: function (atStart, atEnd, pingPong) {

			var settings = this._interpolantSettings;

			if (pingPong) {

				settings.endingStart = THREE.ZeroSlopeEnding;
				settings.endingEnd = THREE.ZeroSlopeEnding;

			} else {

				// assuming for LoopOnce atStart == atEnd == true

				if (atStart) {

					settings.endingStart = this.zeroSlopeAtStart ?
						THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;

				} else {

					settings.endingStart = THREE.WrapAroundEnding;

				}

				if (atEnd) {

					settings.endingEnd = this.zeroSlopeAtEnd ?
						THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;

				} else {

					settings.endingEnd = THREE.WrapAroundEnding;

				}

			}

		},

		_scheduleFading: function (duration, weightNow, weightThen) {

			var mixer = this._mixer,
				now = mixer.time,
				interpolant = this._weightInterpolant;

			if (interpolant === null) {

				interpolant = mixer._lendControlInterpolant(),
					this._weightInterpolant = interpolant;

			}

			var times = interpolant.parameterPositions,
				values = interpolant.sampleValues;

			times[0] = now;
			values[0] = weightNow;
			times[1] = now + duration;
			values[1] = weightThen;

			return this;

		}

	};

	// Implementation details:

	Object.assign(THREE.AnimationMixer.prototype, {

		_bindAction: function (action, prototypeAction) {

			var root = action._localRoot || this._root,
				tracks = action._clip.tracks,
				nTracks = tracks.length,
				bindings = action._propertyBindings,
				interpolants = action._interpolants,
				rootUuid = root.uuid,
				bindingsByRoot = this._bindingsByRootAndName,
				bindingsByName = bindingsByRoot[rootUuid];

			if (bindingsByName === undefined) {

				bindingsByName = {};
				bindingsByRoot[rootUuid] = bindingsByName;

			}

			for (var i = 0; i !== nTracks; ++i) {

				var track = tracks[i],
					trackName = track.name,
					binding = bindingsByName[trackName];

				if (binding !== undefined) {

					bindings[i] = binding;

				} else {

					binding = bindings[i];

					if (binding !== undefined) {

						// existing binding, make sure the cache knows

						if (binding._cacheIndex === null) {

							++binding.referenceCount;
							this._addInactiveBinding(binding, rootUuid, trackName);

						}

						continue;

					}

					var path = prototypeAction && prototypeAction.
					_propertyBindings[i].binding.parsedPath;

					binding = new THREE.PropertyMixer(
						THREE.PropertyBinding.create(root, trackName, path),
						track.ValueTypeName, track.getValueSize());

					++binding.referenceCount;
					this._addInactiveBinding(binding, rootUuid, trackName);

					bindings[i] = binding;

				}

				interpolants[i].resultBuffer = binding.buffer;

			}

		},

		_activateAction: function (action) {

			if (!this._isActiveAction(action)) {
				if (action._cacheIndex === null) {

					// this action has been forgotten by the cache, but the user
					// appears to be still using it -> rebind

					var rootUuid = (action._localRoot || this._root).uuid,
						clipName = action._clip.name,
						actionsForClip = this._actionsByClip[clipName];

					this._bindAction(action,
						actionsForClip && actionsForClip.knownActions[0]);

					this._addInactiveAction(action, clipName, rootUuid);

				}

				var bindings = action._propertyBindings;

				// increment reference counts / sort out state
				for (var i = 0, n = bindings.length; i !== n; ++i) {

					var binding = bindings[i];

					if (binding.useCount++ === 0) {

						this._lendBinding(binding);
						binding.saveOriginalState();

					}

				}

				this._lendAction(action);

			}

		},

		_deactivateAction: function (action) {

			if (this._isActiveAction(action)) {

				var bindings = action._propertyBindings;

				// decrement reference counts / sort out state
				for (var i = 0, n = bindings.length; i !== n; ++i) {

					var binding = bindings[i];

					if (--binding.useCount === 0) {

						binding.restoreOriginalState();
						this._takeBackBinding(binding);

					}

				}

				this._takeBackAction(action);

			}

		},

		// Memory manager

		_initMemoryManager: function () {

			this._actions = []; // 'nActiveActions' followed by inactive ones
			this._nActiveActions = 0;

			this._actionsByClip = {};
			// inside:
			// {
			// 		knownActions: Array< _Action >	- used as prototypes
			// 		actionByRoot: _Action			- lookup
			// }


			this._bindings = []; // 'nActiveBindings' followed by inactive ones
			this._nActiveBindings = 0;

			this._bindingsByRootAndName = {}; // inside: Map< name, PropertyMixer >


			this._controlInterpolants = []; // same game as above
			this._nActiveControlInterpolants = 0;

			var scope = this;

			this.stats = {

				actions: {
					get total() {
						return scope._actions.length;
					},
					get inUse() {
						return scope._nActiveActions;
					}
				},
				bindings: {
					get total() {
						return scope._bindings.length;
					},
					get inUse() {
						return scope._nActiveBindings;
					}
				},
				controlInterpolants: {
					get total() {
						return scope._controlInterpolants.length;
					},
					get inUse() {
						return scope._nActiveControlInterpolants;
					}
				}

			};

		},

		// Memory management for _Action objects

		_isActiveAction: function (action) {

			var index = action._cacheIndex;
			return index !== null && index < this._nActiveActions;

		},

		_addInactiveAction: function (action, clipName, rootUuid) {

			var actions = this._actions,
				actionsByClip = this._actionsByClip,
				actionsForClip = actionsByClip[clipName];

			if (actionsForClip === undefined) {

				actionsForClip = {

					knownActions: [action],
					actionByRoot: {}

				};

				action._byClipCacheIndex = 0;

				actionsByClip[clipName] = actionsForClip;

			} else {

				var knownActions = actionsForClip.knownActions;

				action._byClipCacheIndex = knownActions.length;
				knownActions.push(action);

			}

			action._cacheIndex = actions.length;
			actions.push(action);

			actionsForClip.actionByRoot[rootUuid] = action;

		},

		_removeInactiveAction: function (action) {

			var actions = this._actions,
				lastInactiveAction = actions[actions.length - 1],
				cacheIndex = action._cacheIndex;

			lastInactiveAction._cacheIndex = cacheIndex;
			actions[cacheIndex] = lastInactiveAction;
			actions.pop();

			action._cacheIndex = null;


			var clipName = action._clip.name,
				actionsByClip = this._actionsByClip,
				actionsForClip = actionsByClip[clipName],
				knownActionsForClip = actionsForClip.knownActions,

				lastKnownAction =
				knownActionsForClip[knownActionsForClip.length - 1],

				byClipCacheIndex = action._byClipCacheIndex;

			lastKnownAction._byClipCacheIndex = byClipCacheIndex;
			knownActionsForClip[byClipCacheIndex] = lastKnownAction;
			knownActionsForClip.pop();

			action._byClipCacheIndex = null;


			var actionByRoot = actionsForClip.actionByRoot,
				rootUuid = (actions._localRoot || this._root).uuid;

			delete actionByRoot[rootUuid];

			if (knownActionsForClip.length === 0) {

				delete actionsByClip[clipName];

			}

			this._removeInactiveBindingsForAction(action);

		},

		_removeInactiveBindingsForAction: function (action) {

			var bindings = action._propertyBindings;
			for (var i = 0, n = bindings.length; i !== n; ++i) {

				var binding = bindings[i];

				if (--binding.referenceCount === 0) {

					this._removeInactiveBinding(binding);

				}

			}

		},

		_lendAction: function (action) {

			// [ active actions |  inactive actions  ]
			// [  active actions >| inactive actions ]
			//                 s        a
			//                  <-swap->
			//                 a        s

			var actions = this._actions,
				prevIndex = action._cacheIndex,

				lastActiveIndex = this._nActiveActions++,

				firstInactiveAction = actions[lastActiveIndex];

			action._cacheIndex = lastActiveIndex;
			actions[lastActiveIndex] = action;

			firstInactiveAction._cacheIndex = prevIndex;
			actions[prevIndex] = firstInactiveAction;

		},

		_takeBackAction: function (action) {

			// [  active actions  | inactive actions ]
			// [ active actions |< inactive actions  ]
			//        a        s
			//         <-swap->
			//        s        a

			var actions = this._actions,
				prevIndex = action._cacheIndex,

				firstInactiveIndex = --this._nActiveActions,

				lastActiveAction = actions[firstInactiveIndex];

			action._cacheIndex = firstInactiveIndex;
			actions[firstInactiveIndex] = action;

			lastActiveAction._cacheIndex = prevIndex;
			actions[prevIndex] = lastActiveAction;

		},

		// Memory management for PropertyMixer objects

		_addInactiveBinding: function (binding, rootUuid, trackName) {

			var bindingsByRoot = this._bindingsByRootAndName,
				bindingByName = bindingsByRoot[rootUuid],

				bindings = this._bindings;

			if (bindingByName === undefined) {

				bindingByName = {};
				bindingsByRoot[rootUuid] = bindingByName;

			}

			bindingByName[trackName] = binding;

			binding._cacheIndex = bindings.length;
			bindings.push(binding);

		},

		_removeInactiveBinding: function (binding) {

			var bindings = this._bindings,
				propBinding = binding.binding,
				rootUuid = propBinding.rootNode.uuid,
				trackName = propBinding.path,
				bindingsByRoot = this._bindingsByRootAndName,
				bindingByName = bindingsByRoot[rootUuid],

				lastInactiveBinding = bindings[bindings.length - 1],
				cacheIndex = binding._cacheIndex;

			lastInactiveBinding._cacheIndex = cacheIndex;
			bindings[cacheIndex] = lastInactiveBinding;
			bindings.pop();

			delete bindingByName[trackName];

			remove_empty_map: {

				for (var _ in bindingByName) break remove_empty_map;

				delete bindingsByRoot[rootUuid];

			}

		},

		_lendBinding: function (binding) {

			var bindings = this._bindings,
				prevIndex = binding._cacheIndex,

				lastActiveIndex = this._nActiveBindings++,

				firstInactiveBinding = bindings[lastActiveIndex];

			binding._cacheIndex = lastActiveIndex;
			bindings[lastActiveIndex] = binding;

			firstInactiveBinding._cacheIndex = prevIndex;
			bindings[prevIndex] = firstInactiveBinding;

		},

		_takeBackBinding: function (binding) {

			var bindings = this._bindings,
				prevIndex = binding._cacheIndex,

				firstInactiveIndex = --this._nActiveBindings,

				lastActiveBinding = bindings[firstInactiveIndex];

			binding._cacheIndex = firstInactiveIndex;
			bindings[firstInactiveIndex] = binding;
			if (lastActiveBinding) {
				lastActiveBinding._cacheIndex = prevIndex;
				bindings[prevIndex] = lastActiveBinding;
			}
		},


		// Memory management of Interpolants for weight and time scale

		_lendControlInterpolant: function () {

			var interpolants = this._controlInterpolants,
				lastActiveIndex = this._nActiveControlInterpolants++,
				interpolant = interpolants[lastActiveIndex];

			if (interpolant === undefined) {

				interpolant = new THREE.LinearInterpolant(
					new Float32Array(2), new Float32Array(2),
					1, this._controlInterpolantsResultBuffer);

				interpolant.__cacheIndex = lastActiveIndex;
				interpolants[lastActiveIndex] = interpolant;

			}

			return interpolant;

		},

		_takeBackControlInterpolant: function (interpolant) {

			var interpolants = this._controlInterpolants,
				prevIndex = interpolant.__cacheIndex,

				firstInactiveIndex = --this._nActiveControlInterpolants,

				lastActiveInterpolant = interpolants[firstInactiveIndex];

			interpolant.__cacheIndex = firstInactiveIndex;
			interpolants[firstInactiveIndex] = interpolant;

			lastActiveInterpolant.__cacheIndex = prevIndex;
			interpolants[prevIndex] = lastActiveInterpolant;

		},

		_controlInterpolantsResultBuffer: new Float32Array(1)

	});


	// File:../dev/three/animation/AnimationObjectGroup.js

	/**
	 *
	 * A group of objects that receives a shared animation state.
	 *
	 * Usage:
	 *
	 * 	-	Add objects you would otherwise pass as 'root' to the
	 * 		constructor or the .clipAction method of AnimationMixer.
	 *
	 * 	-	Instead pass this object as 'root'.
	 *
	 * 	-	You can also add and remove objects later when the mixer
	 * 		is running.
	 *
	 * Note:
	 *
	 *  	Objects of this class appear as one object to the mixer,
	 *  	so cache control of the individual objects must be done
	 *  	on the group.
	 *
	 * Limitation:
	 *
	 * 	- 	The animated properties must be compatible among the
	 * 		all objects in the group.
	 *
	 *  -	A single property can either be controlled through a
	 *  	target group or directly, but not both.
	 *
	 * @author tschw
	 */

	THREE.AnimationObjectGroup = function (var_args) {

		this.uuid = THREE.Math.generateUUID();

		// cached objects followed by the active ones
		this._objects = Array.prototype.slice.call(arguments);

		this.nCachedObjects_ = 0; // threshold
		// note: read by PropertyBinding.Composite

		var indices = {};
		this._indicesByUUID = indices; // for bookkeeping

		for (var i = 0, n = arguments.length; i !== n; ++i) {

			indices[arguments[i].uuid] = i;

		}

		this._paths = []; // inside: string
		this._parsedPaths = []; // inside: { we don't care, here }
		this._bindings = []; // inside: Array< PropertyBinding >
		this._bindingsIndicesByPath = {}; // inside: indices in these arrays

		var scope = this;

		this.stats = {

			objects: {
				get total() {
					return scope._objects.length;
				},
				get inUse() {
					return this.total - scope.nCachedObjects_;
				}
			},

			get bindingsPerObject() {
				return scope._bindings.length;
			}

		};

	};

	THREE.AnimationObjectGroup.prototype = {

		constructor: THREE.AnimationObjectGroup,

		add: function (var_args) {

			var objects = this._objects,
				nObjects = objects.length,
				nCachedObjects = this.nCachedObjects_,
				indicesByUUID = this._indicesByUUID,
				paths = this._paths,
				parsedPaths = this._parsedPaths,
				bindings = this._bindings,
				nBindings = bindings.length;

			for (var i = 0, n = arguments.length; i !== n; ++i) {

				var object = arguments[i],
					uuid = object.uuid,
					index = indicesByUUID[uuid];

				if (index === undefined) {

					// unknown object -> add it to the ACTIVE region

					index = nObjects++;
					indicesByUUID[uuid] = index;
					objects.push(object);

					// accounting is done, now do the same for all bindings

					for (var j = 0, m = nBindings; j !== m; ++j) {

						bindings[j].push(
							new THREE.PropertyBinding(
								object, paths[j], parsedPaths[j]));

					}

				} else if (index < nCachedObjects) {

					var knownObject = objects[index];

					// move existing object to the ACTIVE region

					var firstActiveIndex = --nCachedObjects,
						lastCachedObject = objects[firstActiveIndex];

					indicesByUUID[lastCachedObject.uuid] = index;
					objects[index] = lastCachedObject;

					indicesByUUID[uuid] = firstActiveIndex;
					objects[firstActiveIndex] = object;

					// accounting is done, now do the same for all bindings

					for (var j = 0, m = nBindings; j !== m; ++j) {

						var bindingsForPath = bindings[j],
							lastCached = bindingsForPath[firstActiveIndex],
							binding = bindingsForPath[index];

						bindingsForPath[index] = lastCached;

						if (binding === undefined) {

							// since we do not bother to create new bindings
							// for objects that are cached, the binding may
							// or may not exist

							binding = new THREE.PropertyBinding(
								object, paths[j], parsedPaths[j]);

						}

						bindingsForPath[firstActiveIndex] = binding;

					}

				} else if (objects[index] !== knownObject) {

					console.error("Different objects with the same UUID " +
						"detected. Clean the caches or recreate your " +
						"infrastructure when reloading scenes...");

				} // else the object is already where we want it to be

			} // for arguments

			this.nCachedObjects_ = nCachedObjects;

		},

		remove: function (var_args) {

			var objects = this._objects,
				nObjects = objects.length,
				nCachedObjects = this.nCachedObjects_,
				indicesByUUID = this._indicesByUUID,
				bindings = this._bindings,
				nBindings = bindings.length;

			for (var i = 0, n = arguments.length; i !== n; ++i) {

				var object = arguments[i],
					uuid = object.uuid,
					index = indicesByUUID[uuid];

				if (index !== undefined && index >= nCachedObjects) {

					// move existing object into the CACHED region

					var lastCachedIndex = nCachedObjects++,
						firstActiveObject = objects[lastCachedIndex];

					indicesByUUID[firstActiveObject.uuid] = index;
					objects[index] = firstActiveObject;

					indicesByUUID[uuid] = lastCachedIndex;
					objects[lastCachedIndex] = object;

					// accounting is done, now do the same for all bindings

					for (var j = 0, m = nBindings; j !== m; ++j) {

						var bindingsForPath = bindings[j],
							firstActive = bindingsForPath[lastCachedIndex],
							binding = bindingsForPath[index];

						bindingsForPath[index] = firstActive;
						bindingsForPath[lastCachedIndex] = binding;

					}

				}

			} // for arguments

			this.nCachedObjects_ = nCachedObjects;

		},

		// remove & forget
		uncache: function (var_args) {

			var objects = this._objects,
				nObjects = objects.length,
				nCachedObjects = this.nCachedObjects_,
				indicesByUUID = this._indicesByUUID,
				bindings = this._bindings,
				nBindings = bindings.length;

			for (var i = 0, n = arguments.length; i !== n; ++i) {

				var object = arguments[i],
					uuid = object.uuid,
					index = indicesByUUID[uuid];

				if (index !== undefined) {

					delete indicesByUUID[uuid];

					if (index < nCachedObjects) {

						// object is cached, shrink the CACHED region

						var firstActiveIndex = --nCachedObjects,
							lastCachedObject = objects[firstActiveIndex],
							lastIndex = --nObjects,
							lastObject = objects[lastIndex];

						// last cached object takes this object's place
						indicesByUUID[lastCachedObject.uuid] = index;
						objects[index] = lastCachedObject;

						// last object goes to the activated slot and pop
						indicesByUUID[lastObject.uuid] = firstActiveIndex;
						objects[firstActiveIndex] = lastObject;
						objects.pop();

						// accounting is done, now do the same for all bindings

						for (var j = 0, m = nBindings; j !== m; ++j) {

							var bindingsForPath = bindings[j],
								lastCached = bindingsForPath[firstActiveIndex],
								last = bindingsForPath[lastIndex];

							bindingsForPath[index] = lastCached;
							bindingsForPath[firstActiveIndex] = last;
							bindingsForPath.pop();

						}

					} else {

						// object is active, just swap with the last and pop

						var lastIndex = --nObjects,
							lastObject = objects[lastIndex];

						indicesByUUID[lastObject.uuid] = index;
						objects[index] = lastObject;
						objects.pop();

						// accounting is done, now do the same for all bindings

						for (var j = 0, m = nBindings; j !== m; ++j) {

							var bindingsForPath = bindings[j];

							bindingsForPath[index] = bindingsForPath[lastIndex];
							bindingsForPath.pop();

						}

					} // cached or active

				} // if object is known

			} // for arguments

			this.nCachedObjects_ = nCachedObjects;

		},

		// Internal interface used by befriended PropertyBinding.Composite:

		subscribe_: function (path, parsedPath) {
			// returns an array of bindings for the given path that is changed
			// according to the contained objects in the group

			var indicesByPath = this._bindingsIndicesByPath,
				index = indicesByPath[path],
				bindings = this._bindings;

			if (index !== undefined) return bindings[index];

			var paths = this._paths,
				parsedPaths = this._parsedPaths,
				objects = this._objects,
				nObjects = objects.length,
				nCachedObjects = this.nCachedObjects_,
				bindingsForPath = new Array(nObjects);

			index = bindings.length;

			indicesByPath[path] = index;

			paths.push(path);
			parsedPaths.push(parsedPath);
			bindings.push(bindingsForPath);

			for (var i = nCachedObjects,
					n = objects.length; i !== n; ++i) {

				var object = objects[i];

				bindingsForPath[i] =
					new THREE.PropertyBinding(object, path, parsedPath);

			}

			return bindingsForPath;

		},

		unsubscribe_: function (path) {
			// tells the group to forget about a property path and no longer
			// update the array previously obtained with 'subscribe_'

			var indicesByPath = this._bindingsIndicesByPath,
				index = indicesByPath[path];

			if (index !== undefined) {

				var paths = this._paths,
					parsedPaths = this._parsedPaths,
					bindings = this._bindings,
					lastBindingsIndex = bindings.length - 1,
					lastBindings = bindings[lastBindingsIndex],
					lastBindingsPath = path[lastBindingsIndex];

				indicesByPath[lastBindingsPath] = index;

				bindings[index] = lastBindings;
				bindings.pop();

				parsedPaths[index] = parsedPaths[lastBindingsIndex];
				parsedPaths.pop();

				paths[index] = paths[lastBindingsIndex];
				paths.pop();

			}

		}

	};


	// File:../dev/three/animation/AnimationUtils.js

	/**
	 * @author tschw
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 */

	THREE.AnimationUtils = {

		// same as Array.prototype.slice, but also works on typed arrays
		arraySlice: function (array, from, to) {

			if (THREE.AnimationUtils.isTypedArray(array)) {

				return new array.constructor(array.subarray(from, to));

			}

			return array.slice(from, to);

		},

		// converts an array to a specific type
		convertArray: function (array, type, forceClone) {

			if (!array || // let 'undefined' and 'null' pass
				!forceClone && array.constructor === type) return array;

			if (typeof type.BYTES_PER_ELEMENT === 'number') {

				return new type(array); // create typed array

			}

			return Array.prototype.slice.call(array); // create Array

		},

		isTypedArray: function (object) {

			return ArrayBuffer.isView(object) &&
				!(object instanceof DataView);

		},

		// returns an array by which times and values can be sorted
		getKeyframeOrder: function (times) {

			function compareTime(i, j) {

				return times[i] - times[j];

			}

			var n = times.length;
			var result = new Array(n);
			for (var i = 0; i !== n; ++i) result[i] = i;

			result.sort(compareTime);

			return result;

		},

		// uses the array previously returned by 'getKeyframeOrder' to sort data
		sortedArray: function (values, stride, order) {

			var nValues = values.length;
			var result = new values.constructor(nValues);

			for (var i = 0, dstOffset = 0; dstOffset !== nValues; ++i) {

				var srcOffset = order[i] * stride;

				for (var j = 0; j !== stride; ++j) {

					result[dstOffset++] = values[srcOffset + j];

				}

			}

			return result;

		},

		utf8Decode: function (ab) {
			var arr = new Uint8Array(ab);
			var c, out = "",
				i = 0,
				len = arr.length;
			while (i < len) {
				c = arr[i++];
				if (c < 128) {
					out += String.fromCharCode(c);
				} else if (c < 0xE0 && i < len) {
					out += String.fromCharCode(((c & 0x1F) << 6) | (arr[i++] & 0x3F));
				} else if (c < 0xF0 && i + 1 < len) {
					out += String.fromCharCode((((c & 0x0F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
				} else if (c < 0xF8 && i + 2 < len) {
					out += String.fromCharCode((((c & 0x07) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
				} else if (c < 0xFC && i + 3 < len) {
					out += String.fromCharCode((((c & 0x03) << 24) | ((arr[i++] & 0x3F) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
				} else if (c < 0xFE && i + 4 < len) {
					out += String.fromCharCode((((c & 0x01) << 30) | ((arr[i++] & 0x3F) << 24) | ((arr[i++] & 0x3F) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
				} else
					throw new Error("invalid utf8");
			}
			return out;
		},

		// function for parsing AOS keyframe formats
		flattenJSON: function (jsonKeys, times, values, valuePropertyName) {

			var i = 1,
				key = jsonKeys[0];

			while (key !== undefined && key[valuePropertyName] === undefined) {

				key = jsonKeys[i++];

			}

			if (key === undefined) return; // no data

			var value = key[valuePropertyName];
			if (value === undefined) return; // no data

			if (Array.isArray(value)) {

				do {

					value = key[valuePropertyName];

					if (value !== undefined) {

						times.push(key.time);
						values.push.apply(values, value); // push all elements

					}

					key = jsonKeys[i++];

				} while (key !== undefined);

			} else if (value.toArray !== undefined) {
				// ...assume THREE.Math-ish

				do {

					value = key[valuePropertyName];

					if (value !== undefined) {

						times.push(key.time);
						value.toArray(values, values.length);

					}

					key = jsonKeys[i++];

				} while (key !== undefined);

			} else {
				// otherwise push as-is

				do {

					value = key[valuePropertyName];

					if (value !== undefined) {

						times.push(key.time);
						values.push(value);

					}

					key = jsonKeys[i++];

				} while (key !== undefined);

			}

		}

	};

	// File:../dev/three/animation/KeyframeTrack.js

	/**
	 *
	 * A timed sequence of keyframes for a specific property.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.KeyframeTrack = function (name, times, values, interpolation) {

		if (name === undefined) throw new Error("track name is undefined");

		if (times === undefined || times.length === 0) {

			throw new Error("no keyframes in track named " + name);

		}

		this.name = name;

		this.times = THREE.AnimationUtils.convertArray(times, this.TimeBufferType);
		this.values = THREE.AnimationUtils.convertArray(values, this.ValueBufferType);

		this.setInterpolation(interpolation || this.DefaultInterpolation);

		// this.validate();
		// this.optimize();

	};

	THREE.KeyframeTrack.prototype = {

		constructor: THREE.KeyframeTrack,

		TimeBufferType: Float32Array,
		ValueBufferType: Float32Array,

		DefaultInterpolation: THREE.InterpolateLinear,

		InterpolantFactoryMethodDiscrete: function (result) {

			return new THREE.DiscreteInterpolant(
				this.times, this.values, this.getValueSize(), result);

		},

		InterpolantFactoryMethodLinear: function (result) {

			return new THREE.LinearInterpolant(
				this.times, this.values, this.getValueSize(), result);

		},

		InterpolantFactoryMethodSmooth: function (result) {

			// PI_BEGIN
			var inter = new THREE.CubicInterpolant(this.times, this.values, this.getValueSize(), result);
			inter.setTangent(this.inTangent, this.outTangent);
			return inter;
			// PI_END
		},

		// PI_BEGIN
		setTangent: function (inTangent, outTangent) {
			this.inTangent = inTangent;
			this.outTangent = inTangent;

		},
		// PI_END

		setInterpolation: function (interpolation) {

			var factoryMethod = undefined;

			switch (interpolation) {

				case THREE.InterpolateDiscrete:

					factoryMethod = this.InterpolantFactoryMethodDiscrete;

					break;

				case THREE.InterpolateLinear:

					factoryMethod = this.InterpolantFactoryMethodLinear;

					break;

				case THREE.InterpolateSmooth:

					factoryMethod = this.InterpolantFactoryMethodSmooth;

					break;

			}

			if (factoryMethod === undefined) {

				var message = "unsupported interpolation for " +
					this.ValueTypeName + " keyframe track named " + this.name;

				if (this.createInterpolant === undefined) {

					// fall back to default, unless the default itself is messed up
					if (interpolation !== this.DefaultInterpolation) {

						this.setInterpolation(this.DefaultInterpolation);

					} else {

						throw new Error(message); // fatal, in this case

					}

				}

				console.warn(message);
				return;

			}

			this.createInterpolant = factoryMethod;

		},

		getInterpolation: function () {

			switch (this.createInterpolant) {

				case this.InterpolantFactoryMethodDiscrete:

					return THREE.InterpolateDiscrete;

				case this.InterpolantFactoryMethodLinear:

					return THREE.InterpolateLinear;

				case this.InterpolantFactoryMethodSmooth:

					return THREE.InterpolateSmooth;

			}

		},

		getValueSize: function () {

			return this.values.length / this.times.length;

		},

		// move all keyframes either forwards or backwards in time
		shift: function (timeOffset) {

			if (timeOffset !== 0.0) {

				var times = this.times;

				for (var i = 0, n = times.length; i !== n; ++i) {

					times[i] += timeOffset;

				}

			}

			return this;

		},

		// scale all keyframe times by a factor (useful for frame <-> seconds conversions)
		scale: function (timeScale) {

			if (timeScale !== 1.0) {

				var times = this.times;

				for (var i = 0, n = times.length; i !== n; ++i) {

					times[i] *= timeScale;

				}

			}

			return this;

		},

		// removes keyframes before and after animation without changing any values within the range [startTime, endTime].
		// IMPORTANT: We do not shift around keys to the start of the track time, because for interpolated keys this will change their values
		trim: function (startTime, endTime) {

			var times = this.times,
				nKeys = times.length,
				from = 0,
				to = nKeys - 1;

			while (from !== nKeys && times[from] < startTime) ++from;
			while (to !== -1 && times[to] > endTime) --to;

			++to; // inclusive -> exclusive bound

			if (from !== 0 || to !== nKeys) {

				// empty tracks are forbidden, so keep at least one keyframe
				if (from >= to) to = Math.max(to, 1), from = to - 1;

				var stride = this.getValueSize();
				this.times = THREE.AnimationUtils.arraySlice(times, from, to);
				this.values = THREE.AnimationUtils.
				arraySlice(this.values, from * stride, to * stride);

			}

			return this;

		},

		// ensure we do not get a GarbageInGarbageOut situation, make sure tracks are at least minimally viable
		validate: function () {

			var valid = true;

			var valueSize = this.getValueSize();
			if (valueSize - Math.floor(valueSize) !== 0) {

				console.error("invalid value size in track", this);
				valid = false;

			}

			var times = this.times,
				values = this.values,

				nKeys = times.length;

			if (nKeys === 0) {

				console.error("track is empty", this);
				valid = false;

			}

			var prevTime = null;

			for (var i = 0; i !== nKeys; i++) {

				var currTime = times[i];

				if (typeof currTime === 'number' && isNaN(currTime)) {

					console.error("time is not a valid number", this, i, currTime);
					valid = false;
					break;

				}

				if (prevTime !== null && prevTime > currTime) {

					console.error("out of order keys", this, i, currTime, prevTime);
					valid = false;
					break;

				}

				prevTime = currTime;

			}

			if (values !== undefined) {

				if (THREE.AnimationUtils.isTypedArray(values)) {

					for (var i = 0, n = values.length; i !== n; ++i) {

						var value = values[i];

						if (isNaN(value)) {

							console.error("value is not a valid number", this, i, value);
							valid = false;
							break;

						}

					}

				}

			}

			return valid;

		},

		// removes equivalent sequential keys as common in morph target sequences
		// (0,0,0,0,1,1,1,0,0,0,0,0,0,0) --> (0,0,1,1,0,0)
		optimize: function () {

			var times = this.times,
				values = this.values,
				stride = this.getValueSize(),

				writeIndex = 1;

			for (var i = 1, n = times.length - 1; i <= n; ++i) {

				var keep = false;

				var time = times[i];
				var timeNext = times[i + 1];

				// remove adjacent keyframes scheduled at the same time

				if (time !== timeNext && (i !== 1 || time !== time[0])) {

					// remove unnecessary keyframes same as their neighbors
					var offset = i * stride,
						offsetP = offset - stride,
						offsetN = offset + stride;

					for (var j = 0; j !== stride; ++j) {

						var value = values[offset + j];

						if (value !== values[offsetP + j] ||
							value !== values[offsetN + j]) {

							keep = true;
							break;

						}

					}

				}

				// in-place compaction

				if (keep) {

					if (i !== writeIndex) {

						times[writeIndex] = times[i];

						var readOffset = i * stride,
							writeOffset = writeIndex * stride;

						for (var j = 0; j !== stride; ++j) {

							values[writeOffset + j] = values[readOffset + j];

						}


					}

					++writeIndex;

				}

			}

			if (writeIndex !== times.length) {

				this.times = THREE.AnimationUtils.arraySlice(times, 0, writeIndex);
				this.values = THREE.AnimationUtils.arraySlice(values, 0, writeIndex * stride);

			}

			return this;

		}

	};

	// Static methods:

	Object.assign(THREE.KeyframeTrack, {

		// Serialization (in static context, because of constructor invocation
		// and automatic invocation of .toJSON):

		parse: function (json) {

			if (json.type === undefined) {

				throw new Error("track type undefined, can not parse");

			}

			var trackType = THREE.KeyframeTrack._getTrackTypeForValueTypeName(json.type);

			if (json.times === undefined) {

				console.warn("legacy JSON format detected, converting");

				var times = [],
					values = [];

				THREE.AnimationUtils.flattenJSON(json.keys, times, values, 'value');

				json.times = times;
				json.values = values;

			}

			// derived classes can define a static parse method
			if (trackType.parse !== undefined) {

				return trackType.parse(json);

			} else {

				// by default, we asssume a constructor compatible with the base
				return new trackType(
					json.name, json.times, json.values, json.interpolation);

			}

		},

		toJSON: function (track) {

			var trackType = track.constructor;

			var json;

			// derived classes can define a static toJSON method
			if (trackType.toJSON !== undefined) {

				json = trackType.toJSON(track);

			} else {

				// by default, we assume the data can be serialized as-is
				json = {

					'name': track.name,
					'times': THREE.AnimationUtils.convertArray(track.times, Array),
					'values': THREE.AnimationUtils.convertArray(track.values, Array)

				};

				var interpolation = track.getInterpolation();

				if (interpolation !== track.DefaultInterpolation) {

					json.interpolation = interpolation;

				}

			}

			json.type = track.ValueTypeName; // mandatory

			return json;

		},

		_getTrackTypeForValueTypeName: function (typeName) {

			switch (typeName.toLowerCase()) {

				case "scalar":
				case "double":
				case "float":
				case "number":
				case "integer":

					return THREE.NumberKeyframeTrack;

				case "vector":
				case "vector2":
				case "vector3":
				case "vector4":

					return THREE.VectorKeyframeTrack;

				case "color":

					return THREE.ColorKeyframeTrack;

				case "quaternion":

					return THREE.QuaternionKeyframeTrack;

				case "bool":
				case "boolean":

					return THREE.BooleanKeyframeTrack;

				case "string":

					return THREE.StringKeyframeTrack;

			};

			throw new Error("Unsupported typeName: " + typeName);

		}

	});

	// File:../dev/three/animation/PropertyBinding.js

	/**
	 *
	 * A reference to a real property in the scene graph.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.PropertyBinding = function (rootNode, path, parsedPath) {

		this.path = path;
		this.parsedPath = parsedPath ||
			THREE.PropertyBinding.parseTrackName(path);

		this.node = THREE.PropertyBinding.findNode(
			rootNode, this.parsedPath.nodeName) || rootNode;

		this.rootNode = rootNode;

	};

	THREE.PropertyBinding.prototype = {

		constructor: THREE.PropertyBinding,

		getValue: function getValue_unbound(targetArray, offset) {

			this.bind();
			this.getValue(targetArray, offset);

			// Note: This class uses a State pattern on a per-method basis:
			// 'bind' sets 'this.getValue' / 'setValue' and shadows the
			// prototype version of these methods with one that represents
			// the bound state. When the property is not found, the methods
			// become no-ops.

		},

		setValue: function getValue_unbound(sourceArray, offset) {

			this.bind();
			this.setValue(sourceArray, offset);

		},

		// create getter / setter pair for a property in the scene graph
		bind: function () {

			//var targetObject = this.node,
			var targetObject,
				parsedPath = this.parsedPath,

				objectName = parsedPath.objectName,
				propertyName = parsedPath.propertyName,
				propertyIndex = parsedPath.propertyIndex;

			targetObject = THREE.PropertyBinding.findNodeByPath(
				this.rootNode, parsedPath.nodePath + parsedPath.nodeName) || this.rootNode;

			//this.node = targetObject;


			// set fail state so we can just 'return' on error
			this.getValue = this._getValue_unavailable;
			this.setValue = this._setValue_unavailable;

			// ensure there is a value node
			if (!targetObject) {

				console.error("  trying to update node for track: " + this.path + " but it wasn't found.");
				return;

			}

			if (objectName) {

				var objectIndex = parsedPath.objectIndex;

				// special cases were we need to reach deeper into the hierarchy to get the face materials....
				switch (objectName) {

					case 'material':

						if (!targetObject.material) {

							console.error('  can not bind to material as node does not have a material', this);
							return;

						}

						targetObject = targetObject.material;

						break;

					case 'bones':

						if (!targetObject.skeleton) {

							console.error('  can not bind to bones as node does not have a skeleton', this);
							return;

						}

						// potential future optimization: skip this if propertyIndex is already an integer
						// and convert the integer string to a true integer.

						targetObject = targetObject.skeleton.bones;

						// support resolving morphTarget names into indices.
						for (var i = 0; i < targetObject.length; i++) {

							if (targetObject[i].name === objectIndex) {

								objectIndex = i;
								break;

							}

						}

						break;

					default:

						if (targetObject[objectName] === undefined) {

							console.error('  can not bind to objectName of node, undefined', this);
							return;

						}

						targetObject = targetObject[objectName];

				}


				if (objectIndex !== undefined) {

					if (targetObject[objectIndex] === undefined) {

						console.error("  trying to bind to objectIndex of objectName, but is undefined:", this, targetObject);
						return;

					}

					targetObject = targetObject[objectIndex];

				}

			}

			var propertyNames = propertyName.split(".")
			var nodeProperty = targetObject;

			// resolve property
			for (var i = 0; i < propertyNames.length; i++) {
				if (propertyNames[i] != "__r")
					nodeProperty = nodeProperty[propertyNames[i]];
			}

			if (nodeProperty === undefined) {

				var nodeName = parsedPath.nodeName;

				console.error("  trying to update property for track: " + nodeName +
					'.' + propertyName + " but it wasn't found.", targetObject);
				return;

			}

			// determine versioning scheme
			var versioning = this.Versioning.None;

			if (targetObject.needsUpdate !== undefined) { // material

				versioning = this.Versioning.NeedsUpdate;
				this.targetObject = targetObject;

			} else if (targetObject.matrixWorldNeedsUpdate !== undefined) { // node transform

				versioning = this.Versioning.MatrixWorldNeedsUpdate;
				this.targetObject = targetObject;

			}

			// determine how the property gets bound
			var bindingType = this.BindingType.Direct;

			if (propertyIndex !== undefined) {
				// access a sub element of the property array (only primitives are supported right now)

				if (propertyName === "morphTargetInfluences") {
					// potential optimization, skip this if propertyIndex is already an integer, and convert the integer string to a true integer.

					// support resolving morphTarget names into indices.
					if (!targetObject.geometry) {

						console.error('  can not bind to morphTargetInfluences becasuse node does not have a geometry', this);
						return;

					}

					if (!targetObject.geometry.morphTargets) {

						console.error('  can not bind to morphTargetInfluences becasuse node does not have a geometry.morphTargets', this);
						return;

					}

					for (var i = 0; i < this.node.geometry.morphTargets.length; i++) {

						if (targetObject.geometry.morphTargets[i].name === propertyIndex) {

							propertyIndex = i;
							break;

						}

					}

				}

				bindingType = this.BindingType.ArrayElement;

				this.resolvedProperty = nodeProperty;
				this.propertyIndex = propertyIndex;

			} else if (nodeProperty.fromArray !== undefined && nodeProperty.toArray !== undefined) {
				// must use copy for Object3D.Euler/Quaternion

				bindingType = this.BindingType.HasFromToArray;

				this.resolvedProperty = nodeProperty;

			} else if (nodeProperty.length !== undefined) {

				bindingType = this.BindingType.EntireArray;

				this.resolvedProperty = nodeProperty;

			} else {

				this.propertyName = propertyName;

			}

			// select getter / setter
			this.getValue = this.GetterByBindingType[bindingType];
			this.setValue = this.SetterByBindingTypeAndVersioning[bindingType][versioning];

		},

		unbind: function () {

			this.node = null;

			// back to the prototype version of getValue / setValue
			// note: avoiding to mutate the shape of 'this' via 'delete'
			this.getValue = this._getValue_unbound;
			this.setValue = this._setValue_unbound;

		}

	};

	Object.assign(THREE.PropertyBinding.prototype, { // prototype, continued

		// these are used to "bind" a nonexistent property
		_getValue_unavailable: function () {},
		_setValue_unavailable: function () {},

		// initial state of these methods that calls 'bind'
		_getValue_unbound: THREE.PropertyBinding.prototype.getValue,
		_setValue_unbound: THREE.PropertyBinding.prototype.setValue,

		BindingType: {
			Direct: 0,
			EntireArray: 1,
			ArrayElement: 2,
			HasFromToArray: 3
		},

		Versioning: {
			None: 0,
			NeedsUpdate: 1,
			MatrixWorldNeedsUpdate: 2
		},

		GetterByBindingType: [

			function getValue_direct(buffer, offset) {

				buffer[offset] = this.node[this.propertyName];

			},

			function getValue_array(buffer, offset) {

				var source = this.resolvedProperty;

				for (var i = 0, n = source.length; i !== n; ++i) {

					buffer[offset++] = source[i];

				}

			},

			function getValue_arrayElement(buffer, offset) {

				buffer[offset] = this.resolvedProperty[this.propertyIndex];

			},

			function getValue_toArray(buffer, offset) {

				this.resolvedProperty.toArray(buffer, offset);

			}

		],

		SetterByBindingTypeAndVersioning: [

			[
				// Direct

				function setValue_direct(buffer, offset) {

					this.node[this.propertyName] = buffer[offset];

				},

				function setValue_direct_setNeedsUpdate(buffer, offset) {

					this.node[this.propertyName] = buffer[offset];
					this.targetObject.needsUpdate = true;

				},

				function setValue_direct_setMatrixWorldNeedsUpdate(buffer, offset) {

					this.node[this.propertyName] = buffer[offset];
					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			],
			[

				// EntireArray

				function setValue_array(buffer, offset) {

					var dest = this.resolvedProperty;

					for (var i = 0, n = dest.length; i !== n; ++i) {

						dest[i] = buffer[offset++];

					}

				},

				function setValue_array_setNeedsUpdate(buffer, offset) {

					var dest = this.resolvedProperty;

					for (var i = 0, n = dest.length; i !== n; ++i) {

						dest[i] = buffer[offset++];

					}

					this.targetObject.needsUpdate = true;

				},

				function setValue_array_setMatrixWorldNeedsUpdate(buffer, offset) {

					var dest = this.resolvedProperty;

					for (var i = 0, n = dest.length; i !== n; ++i) {

						dest[i] = buffer[offset++];

					}

					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			],
			[

				// ArrayElement

				function setValue_arrayElement(buffer, offset) {

					this.resolvedProperty[this.propertyIndex] = buffer[offset];

				},

				function setValue_arrayElement_setNeedsUpdate(buffer, offset) {

					this.resolvedProperty[this.propertyIndex] = buffer[offset];
					this.targetObject.needsUpdate = true;

				},

				function setValue_arrayElement_setMatrixWorldNeedsUpdate(buffer, offset) {

					this.resolvedProperty[this.propertyIndex] = buffer[offset];
					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			],
			[

				// HasToFromArray

				function setValue_fromArray(buffer, offset) {

					this.resolvedProperty.fromArray(buffer, offset);

				},

				function setValue_fromArray_setNeedsUpdate(buffer, offset) {

					this.resolvedProperty.fromArray(buffer, offset);
					this.targetObject.needsUpdate = true;

				},

				function setValue_fromArray_setMatrixWorldNeedsUpdate(buffer, offset) {

					this.resolvedProperty.fromArray(buffer, offset);
					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			]

		]

	});

	THREE.PropertyBinding.Composite =
		function (targetGroup, path, optionalParsedPath) {

			var parsedPath = optionalParsedPath ||
				THREE.PropertyBinding.parseTrackName(path);

			this._targetGroup = targetGroup;
			this._bindings = targetGroup.subscribe_(path, parsedPath);

		};

	THREE.PropertyBinding.Composite.prototype = {

		constructor: THREE.PropertyBinding.Composite,

		getValue: function (array, offset) {

			this.bind(); // bind all binding

			var firstValidIndex = this._targetGroup.nCachedObjects_,
				binding = this._bindings[firstValidIndex];

			// and only call .getValue on the first
			if (binding !== undefined) binding.getValue(array, offset);

		},

		setValue: function (array, offset) {

			var bindings = this._bindings;

			for (var i = this._targetGroup.nCachedObjects_,
					n = bindings.length; i !== n; ++i) {

				bindings[i].setValue(array, offset);

			}

		},

		bind: function () {

			var bindings = this._bindings;

			for (var i = this._targetGroup.nCachedObjects_,
					n = bindings.length; i !== n; ++i) {

				bindings[i].bind();

			}

		},

		unbind: function () {

			var bindings = this._bindings;

			for (var i = this._targetGroup.nCachedObjects_,
					n = bindings.length; i !== n; ++i) {

				bindings[i].unbind();

			}

		}

	};

	THREE.PropertyBinding.create = function (root, path, parsedPath) {

		if (!(root instanceof THREE.AnimationObjectGroup)) {

			return new THREE.PropertyBinding(root, path, parsedPath);

		} else {

			return new THREE.PropertyBinding.Composite(root, path, parsedPath);

		}

	};

	THREE.PropertyBinding.parseTrackName = function (trackName) {

		// matches strings in the form of:
		//    nodeName.property
		//    nodeName.property[accessor]
		//    nodeName.material.property[accessor]
		//    uuid.property[accessor]
		//    uuid.objectName[objectIndex].propertyName[propertyIndex]
		//    parentName/nodeName.property
		//    parentName/parentName/nodeName.property[index]
		//	  .bone[Armature.DEF_cog].position
		// created and tested via https://regex101.com/#javascript

		var re = /^(([\w ]+\/)*)([\w-\d ]+)?(\.([\w]+)(\[([\w\d\[\]\_.:\- ]+)\])?)?(\.([\w.]+)(\[([\w\d\[\]\_. ]+)\])?)$/;
		var matches = re.exec(trackName);

		if (!matches) {
			throw new Error("cannot parse trackName at all: " + trackName);
		}

		if (matches.index === re.lastIndex) {
			re.lastIndex++;
		}

		var results = {
			// directoryName: matches[1], // (tschw) currently unused
			nodePath: matches[1],
			nodeName: matches[3], // allowed to be null, specified root node.
			objectName: matches[5],
			objectIndex: matches[7],
			propertyName: matches[9],
			propertyIndex: matches[11] // allowed to be null, specifies that the whole property is set.
		};

		if (results.propertyName === null || results.propertyName.length === 0) {
			throw new Error("can not parse propertyName from trackName: " + trackName);
		}

		if (results.objectName === "b") {
			results.objectName = "bones";
		}

		if (results.propertyName === "p") {
			results.propertyName = "position";
		} else if (results.propertyName === "q") {
			results.propertyName = "quaternion";
		} else if (results.propertyName === "s") {
			results.propertyName = "scale";
		} else if (results.propertyName === "r") {
			results.propertyName = "rotation";
		}

		return results;

	};

	THREE.PropertyBinding.findNode = function (root, nodeName) {

		if (!nodeName || nodeName === "" || nodeName === "root" || nodeName === "." || nodeName === -1 || nodeName === root.name || nodeName === root.uuid) {

			return root;

		}

		// search into skeleton bones.
		if (root.skeleton) {

			var searchSkeleton = function (skeleton) {

				for (var i = 0; i < skeleton.bones.length; i++) {

					var bone = skeleton.bones[i];

					if (bone.name === nodeName) {

						return bone;

					}
				}

				return null;

			};

			var bone = searchSkeleton(root.skeleton);

			if (bone) {

				return bone;

			}
		}

		// search into node subtree.
		if (root.children) {

			var searchNodeSubtree = function (children) {

				for (var i = 0; i < children.length; i++) {

					var childNode = children[i];

					if (childNode.name === nodeName || childNode.uuid === nodeName) {

						return childNode;

					}

					var result = searchNodeSubtree(childNode.children);

					if (result) return result;

				}

				return null;

			};

			var subTreeNode = searchNodeSubtree(root.children);

			if (subTreeNode) {

				return subTreeNode;

			}

		}

		return null;

	}

	THREE.PropertyBinding.findNodeByPath = function (root, path) {

		if (!path || path === "" || path === "." || path === -1)
			return root;

		var paths = path.split("/");
		var node = root;
		var searchNode = function (children, nodeName) {
			for (var i = 0; i < children.length; i++) {
				var childNode = children[i];
				if (childNode.name === nodeName || childNode.uuid === nodeName)
					return childNode;
			}
			return null;
		};

		if (node.children) {
			for (var i = 0; i < paths.length; i++)
				node = searchNode(node.children, paths[i]);
			return node;
		} else
			return null;
	}


	// File:../dev/three/animation/PropertyMixer.js

	/**
	 *
	 * Buffered scene graph property that allows weighted accumulation.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.PropertyMixer = function (binding, typeName, valueSize) {

		this.binding = binding;
		this.valueSize = valueSize;

		var bufferType = Float64Array,
			mixFunction;

		switch (typeName) {

			case 'quaternion':
				mixFunction = this._slerp;
				break;

			case 'string':
			case 'bool':

				bufferType = Array, mixFunction = this._select;
				break;

			default:
				mixFunction = this._lerp;

		}

		this.buffer = new bufferType(valueSize * 4);
		// layout: [ incoming | accu0 | accu1 | orig ]
		//
		// interpolators can use .buffer as their .result
		// the data then goes to 'incoming'
		//
		// 'accu0' and 'accu1' are used frame-interleaved for
		// the cumulative result and are compared to detect
		// changes
		//
		// 'orig' stores the original state of the property

		this._mixBufferRegion = mixFunction;

		this.cumulativeWeight = 0;

		this.useCount = 0;
		this.referenceCount = 0;

	};

	THREE.PropertyMixer.prototype = {

		constructor: THREE.PropertyMixer,

		// accumulate data in the 'incoming' region into 'accu<i>'
		accumulate: function (accuIndex, weight) {

			// note: happily accumulating nothing when weight = 0, the caller knows
			// the weight and shouldn't have made the call in the first place

			var buffer = this.buffer,
				stride = this.valueSize,
				offset = accuIndex * stride + stride,

				currentWeight = this.cumulativeWeight;

			if (currentWeight === 0) {

				// accuN := incoming * weight

				for (var i = 0; i !== stride; ++i) {

					buffer[offset + i] = buffer[i];

				}

				currentWeight = weight;

			} else {

				// accuN := accuN + incoming * weight

				currentWeight += weight;
				var mix = weight / currentWeight;
				this._mixBufferRegion(buffer, offset, 0, mix, stride);

			}

			this.cumulativeWeight = currentWeight;

		},

		// apply the state of 'accu<i>' to the binding when accus differ
		apply: function (accuIndex) {

			var stride = this.valueSize,
				buffer = this.buffer,
				offset = accuIndex * stride + stride,

				weight = this.cumulativeWeight,

				binding = this.binding;

			this.cumulativeWeight = 0;

			if (weight < 1) {

				// accuN := accuN + original * ( 1 - cumulativeWeight )

				var originalValueOffset = stride * 3;

				this._mixBufferRegion(
					buffer, offset, originalValueOffset, 1 - weight, stride);

			}

			for (var i = stride, e = stride + stride; i !== e; ++i) {

				if (buffer[i] !== buffer[i + stride]) {

					// value has changed -> update scene graph

					binding.setValue(buffer, offset);
					break;

				}

			}

		},

		// remember the state of the bound property and copy it to both accus
		saveOriginalState: function () {

			var binding = this.binding;

			var buffer = this.buffer,
				stride = this.valueSize,

				originalValueOffset = stride * 3;

			binding.getValue(buffer, originalValueOffset);

			// accu[0..1] := orig -- initially detect changes against the original
			for (var i = stride, e = originalValueOffset; i !== e; ++i) {

				buffer[i] = buffer[originalValueOffset + (i % stride)];

			}

			this.cumulativeWeight = 0;

		},

		// apply the state previously taken via 'saveOriginalState' to the binding
		restoreOriginalState: function () {

			var originalValueOffset = this.valueSize * 3;
			this.binding.setValue(this.buffer, originalValueOffset);

		},


		// mix functions

		_select: function (buffer, dstOffset, srcOffset, t, stride) {

			if (t >= 0.5) {

				for (var i = 0; i !== stride; ++i) {

					buffer[dstOffset + i] = buffer[srcOffset + i];

				}

			}

		},

		_slerp: function (buffer, dstOffset, srcOffset, t, stride) {

			THREE.Quaternion.slerpFlat(buffer, dstOffset,
				buffer, dstOffset, buffer, srcOffset, t);

		},

		_lerp: function (buffer, dstOffset, srcOffset, t, stride) {

			var s = 1 - t;

			for (var i = 0; i !== stride; ++i) {

				var j = dstOffset + i;

				buffer[j] = buffer[j] * s + buffer[srcOffset + i] * t;

			}

		}

	};

	// File:../dev/three/animation/tracks/BooleanKeyframeTrack.js

	/**
	 *
	 * A Track of Boolean keyframe values.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.BooleanKeyframeTrack = function (name, times, values) {

		THREE.KeyframeTrack.call(this, name, times, values);

	};

	THREE.BooleanKeyframeTrack.prototype =
		Object.assign(Object.create(THREE.KeyframeTrack.prototype), {

			constructor: THREE.BooleanKeyframeTrack,

			ValueTypeName: 'bool',
			ValueBufferType: Array,

			DefaultInterpolation: THREE.InterpolateDiscrete,

			InterpolantFactoryMethodLinear: undefined,
			InterpolantFactoryMethodSmooth: undefined

			// Note: Actually this track could have a optimized / compressed
			// representation of a single value and a custom interpolant that
			// computes "firstValue ^ isOdd( index )".

		});

	// File:../dev/three/animation/tracks/ColorKeyframeTrack.js

	/**
	 *
	 * A Track of keyframe values that represent color.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.ColorKeyframeTrack = function (name, times, values, interpolation) {

		THREE.KeyframeTrack.call(this, name, times, values, interpolation);

	};

	THREE.ColorKeyframeTrack.prototype =
		Object.assign(Object.create(THREE.KeyframeTrack.prototype), {

			constructor: THREE.ColorKeyframeTrack,

			ValueTypeName: 'color'

			// ValueBufferType is inherited

			// DefaultInterpolation is inherited


			// Note: Very basic implementation and nothing special yet.
			// However, this is the place for color space parameterization.

		});

	// File:../dev/three/animation/tracks/NumberKeyframeTrack.js

	/**
	 *
	 * A Track of numeric keyframe values.
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.NumberKeyframeTrack = function (name, times, values, interpolation) {

		THREE.KeyframeTrack.call(this, name, times, values, interpolation);

	};

	THREE.NumberKeyframeTrack.prototype =
		Object.assign(Object.create(THREE.KeyframeTrack.prototype), {

			constructor: THREE.NumberKeyframeTrack,

			ValueTypeName: 'number',

			// ValueBufferType is inherited

			// DefaultInterpolation is inherited

		});

	// File:../dev/three/animation/tracks/QuaternionKeyframeTrack.js

	/**
	 *
	 * A Track of quaternion keyframe values.
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.QuaternionKeyframeTrack = function (name, times, values, interpolation) {

		THREE.KeyframeTrack.call(this, name, times, values, interpolation);

	};

	THREE.QuaternionKeyframeTrack.prototype =
		Object.assign(Object.create(THREE.KeyframeTrack.prototype), {

			constructor: THREE.QuaternionKeyframeTrack,

			ValueTypeName: 'quaternion',

			// ValueBufferType is inherited

			DefaultInterpolation: THREE.InterpolateLinear,

			InterpolantFactoryMethodLinear: function (result) {

				return new THREE.QuaternionLinearInterpolant(
					this.times, this.values, this.getValueSize(), result);

			},

			InterpolantFactoryMethodSmooth: undefined // not yet implemented

		});

	// File:../dev/three/animation/tracks/StringKeyframeTrack.js

	/**
	 *
	 * A Track that interpolates Strings
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.StringKeyframeTrack = function (name, times, values, interpolation) {

		THREE.KeyframeTrack.call(this, name, times, values, interpolation);

	};

	THREE.StringKeyframeTrack.prototype =
		Object.assign(Object.create(THREE.KeyframeTrack.prototype), {

			constructor: THREE.StringKeyframeTrack,

			ValueTypeName: 'string',
			ValueBufferType: Array,

			DefaultInterpolation: THREE.InterpolateDiscrete,

			InterpolantFactoryMethodLinear: undefined,

			InterpolantFactoryMethodSmooth: undefined

		});

	// File:../dev/three/animation/tracks/VectorKeyframeTrack.js

	/**
	 *
	 * A Track of vectored keyframe values.
	 *
	 *
	 * @author Ben Houston / http://clara.io/
	 * @author David Sarno / http://lighthaus.us/
	 * @author tschw
	 */

	THREE.VectorKeyframeTrack = function (name, times, values, interpolation) {

		THREE.KeyframeTrack.call(this, name, times, values, interpolation);

	};

	THREE.VectorKeyframeTrack.prototype =
		Object.assign(Object.create(THREE.KeyframeTrack.prototype), {

			constructor: THREE.VectorKeyframeTrack,

			ValueTypeName: 'vector'

			// ValueBufferType is inherited

			// DefaultInterpolation is inherited

		});

	// File:../dev/three/cameras/Camera.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author WestLangley / http://github.com/WestLangley
	 */

	THREE.Camera = function () {

		THREE.Object3D.call(this);

		this.type = 'Camera';

		this.matrixWorldInverse = new THREE.Matrix4();
		this.projectionMatrix = new THREE.Matrix4();

	};

	THREE.Camera.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Camera.prototype.constructor = THREE.Camera;

	THREE.Camera.prototype.getWorldDirection = function () {

		var quaternion = new THREE.Quaternion();

		return function (optionalTarget) {

			var result = optionalTarget || new THREE.Vector3();

			this.getWorldQuaternion(quaternion);

			return result.set(0, 0, -1).applyQuaternion(quaternion);

		};

	}();

	THREE.Camera.prototype.lookAt = function () {

		// This routine does not support cameras with rotated and/or translated parent(s)

		var m1 = new THREE.Matrix4();

		return function (vector) {

			m1.lookAt(this.position, vector, this.up);

			this.quaternion.setFromRotationMatrix(m1);

		};

	}();

	THREE.Camera.prototype.clone = function () {

		return new this.constructor().copy(this);

	};

	THREE.Camera.prototype.copy = function (source) {

		THREE.Object3D.prototype.copy.call(this, source);

		this.matrixWorldInverse.copy(source.matrixWorldInverse);
		this.projectionMatrix.copy(source.projectionMatrix);

		return this;

	};

	// File:../dev/three/cameras/OrthographicCamera.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.OrthographicCamera = function (left, right, top, bottom, near, far) {

		THREE.Camera.call(this);

		this.setProjection(left, right, top, bottom, near, far);
	};

	THREE.OrthographicCamera.prototype = Object.create(THREE.Camera.prototype);
	THREE.OrthographicCamera.prototype.constructor = THREE.OrthographicCamera;


	THREE.OrthographicCamera.prototype.setProjection = function (left, right, top, bottom, near, far) {
		this.type = 'OrthographicCamera';

		this.zoom = 1;

		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;

		this.near = (near !== undefined) ? near : 0.1;
		this.far = (far !== undefined) ? far : 2000;

		this.updateProjectionMatrix();
	};

	THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {

		var dx = (this.right - this.left) / (2 * this.zoom);
		var dy = (this.top - this.bottom) / (2 * this.zoom);
		var cx = (this.right + this.left) / 2;
		var cy = (this.top + this.bottom) / 2;

		this.projectionMatrix.makeOrthographic(cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far);

	};

	THREE.OrthographicCamera.prototype.copy = function (source) {

		THREE.Camera.prototype.copy.call(this, source);

		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;

		this.zoom = source.zoom;

		return this;

	};

	THREE.OrthographicCamera.prototype.toJSON = function (meta) {

		var data = THREE.Object3D.prototype.toJSON.call(this, meta);

		data.object.zoom = this.zoom;
		data.object.left = this.left;
		data.object.right = this.right;
		data.object.top = this.top;
		data.object.bottom = this.bottom;
		data.object.near = this.near;
		data.object.far = this.far;

		return data;

	};

	// File:../dev/three/cameras/PerspectiveCamera.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author greggman / http://games.greggman.com/
	 * @author zz85 / http://www.lab4games.net/zz85/blog
	 * @author tschw
	 */

	THREE.PerspectiveCamera = function (fov, aspect, near, far) {

		THREE.Camera.call(this);

		this.setProjection(fov, aspect, near, far);
	};

	THREE.PerspectiveCamera.prototype = Object.create(THREE.Camera.prototype);
	THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;

	THREE.PerspectiveCamera.prototype.setProjection = function (fov, aspect, near, far) {

		this.type = 'PerspectiveCamera';

		this.fov = fov !== undefined ? fov : 50;
		this.zoom = 1;

		this.near = near !== undefined ? near : 0.1;
		this.far = far !== undefined ? far : 2000;
		this.focus = 10;

		this.aspect = aspect !== undefined ? aspect : 1;
		this.view = null;

		this.filmGauge = 35; // width of the film (default in millimeters)
		this.filmOffset = 0; // horizontal film offset (same unit as gauge)

		this.updateProjectionMatrix();
	}

	/**
	 * Sets the FOV by focal length (DEPRECATED).
	 *
	 * Optionally also sets .filmGauge, otherwise uses it. See .setFocalLength.
	 */
	THREE.PerspectiveCamera.prototype.setLens = function (focalLength, filmGauge) {

		console.warn("THREE.PerspectiveCamera.setLens is deprecated. " +
			"Use .setFocalLength and .filmGauge for a photographic setup.");

		if (filmGauge !== undefined) this.filmGauge = filmGauge;
		this.setFocalLength(focalLength);

	};

	/**
	 * Sets the FOV by focal length in respect to the current .filmGauge.
	 *
	 * The default film gauge is 35, so that the focal length can be specified for
	 * a 35mm (full frame) camera.
	 *
	 * Values for focal length and film gauge must have the same unit.
	 */
	THREE.PerspectiveCamera.prototype.setFocalLength = function (focalLength) {

		// see http://www.bobatkins.com/photography/technical/field_of_view.html
		var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;

		this.fov = THREE.Math.RAD2DEG * 2 * Math.atan(vExtentSlope);
		this.updateProjectionMatrix();

	};


	/**
	 * Calculates the focal length from the current .fov and .filmGauge.
	 */
	THREE.PerspectiveCamera.prototype.getFocalLength = function () {

		var vExtentSlope = Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov);

		return 0.5 * this.getFilmHeight() / vExtentSlope;

	};

	THREE.PerspectiveCamera.prototype.getEffectiveFOV = function () {

		return THREE.Math.RAD2DEG * 2 * Math.atan(
			Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov) / this.zoom);

	};

	THREE.PerspectiveCamera.prototype.getFilmWidth = function () {

		// film not completely covered in portrait format (aspect < 1)
		return this.filmGauge * Math.min(this.aspect, 1);

	};

	THREE.PerspectiveCamera.prototype.getFilmHeight = function () {

		// film not completely covered in landscape format (aspect > 1)
		return this.filmGauge / Math.max(this.aspect, 1);

	};



	/**
	 * Sets an offset in a larger frustum. This is useful for multi-window or
	 * multi-monitor/multi-machine setups.
	 *
	 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
	 * the monitors are in grid like this
	 *
	 *   +---+---+---+
	 *   | A | B | C |
	 *   +---+---+---+
	 *   | D | E | F |
	 *   +---+---+---+
	 *
	 * then for each monitor you would call it like this
	 *
	 *   var w = 1920;
	 *   var h = 1080;
	 *   var fullWidth = w * 3;
	 *   var fullHeight = h * 2;
	 *
	 *   --A--
	 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
	 *   --B--
	 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
	 *   --C--
	 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
	 *   --D--
	 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
	 *   --E--
	 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
	 *   --F--
	 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
	 *
	 *   Note there is no reason monitors have to be the same size or in a grid.
	 */
	THREE.PerspectiveCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {

		this.aspect = fullWidth / fullHeight;

		this.view = {
			fullWidth: fullWidth,
			fullHeight: fullHeight,
			offsetX: x,
			offsetY: y,
			width: width,
			height: height
		};

		this.updateProjectionMatrix();

	};

	THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {

		var near = this.near,
			top = near * Math.tan(
				THREE.Math.DEG2RAD * 0.5 * this.fov) / this.zoom,
			height = 2 * top,
			width = this.aspect * height,
			left = -0.5 * width,
			view = this.view;

		if (view !== null) {

			var fullWidth = view.fullWidth,
				fullHeight = view.fullHeight;

			left += view.offsetX * width / fullWidth;
			top -= view.offsetY * height / fullHeight;
			width *= view.width / fullWidth;
			height *= view.height / fullHeight;

		}

		var skew = this.filmOffset;
		if (skew !== 0) left += near * skew / this.getFilmWidth();

		this.projectionMatrix.makeFrustum(
			left, left + width, top - height, top, near, this.far);

	};

	THREE.PerspectiveCamera.prototype.copy = function (source) {

		THREE.Camera.prototype.copy.call(this, source);

		this.fov = source.fov;
		this.zoom = source.zoom;

		this.near = source.near;
		this.far = source.far;
		this.focus = source.focus;

		this.aspect = source.aspect;
		this.view = source.view === null ? null : Object.assign({}, source.view);

		this.filmGauge = source.filmGauge;
		this.filmOffset = source.filmOffset;

		return this;

	};

	THREE.PerspectiveCamera.prototype.toJSON = function (meta) {

		var data = THREE.Object3D.prototype.toJSON.call(this, meta);

		data.object.fov = this.fov;
		data.object.zoom = this.zoom;

		data.object.near = this.near;
		data.object.far = this.far;
		data.object.focus = this.focus;

		data.object.aspect = this.aspect;

		if (this.view !== null) data.object.view = Object.assign({}, this.view);

		data.object.filmGauge = this.filmGauge;
		data.object.filmOffset = this.filmOffset;

		return data;

	};

	// File:../dev/three/lights/Light.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Light = function (color, intensity) {

		THREE.Object3D.call(this);

		this.type = 'Light';

		this.color = new THREE.Color(color);
		this.intensity = intensity !== undefined ? intensity : 1;

		this.receiveShadow = undefined;

	};

	THREE.Light.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Light.prototype.constructor = THREE.Light;

	THREE.Light.prototype.copy = function (source) {

		THREE.Object3D.prototype.copy.call(this, source);

		this.color.copy(source.color);
		this.intensity = source.intensity;

		return this;

	};

	THREE.Light.prototype.toJSON = function (meta) {

		var data = THREE.Object3D.prototype.toJSON.call(this, meta);

		data.object.color = this.color.getHex();
		data.object.intensity = this.intensity;

		if (this.groundColor !== undefined) data.object.groundColor = this.groundColor.getHex();

		if (this.distance !== undefined) data.object.distance = this.distance;
		if (this.angle !== undefined) data.object.angle = this.angle;
		if (this.decay !== undefined) data.object.decay = this.decay;
		if (this.penumbra !== undefined) data.object.penumbra = this.penumbra;

		return data;

	};

	// File:../dev/three/lights/AmbientLight.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.AmbientLight = function (color, intensity) {

		THREE.Light.call(this, color, intensity);

		this.type = 'AmbientLight';

		this.castShadow = undefined;

	};

	THREE.AmbientLight.prototype = Object.create(THREE.Light.prototype);
	THREE.AmbientLight.prototype.constructor = THREE.AmbientLight;

	// File:../dev/three/lights/DirectionalLight.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.DirectionalLight = function (color, intensity) {

		THREE.Light.call(this, color, intensity);

		this.type = 'DirectionalLight';

		this.position.set(0, 1, 0);
		this.updateMatrix();

		this.target = new THREE.Object3D();

		this.shadow = new THREE.DirectionalLightShadow();

	};

	THREE.DirectionalLight.prototype = Object.create(THREE.Light.prototype);
	THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight;

	THREE.DirectionalLight.prototype.copy = function (source) {

		THREE.Light.prototype.copy.call(this, source);

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	};

	// File:../dev/three/lights/PointLight.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */


	THREE.PointLight = function (color, intensity, distance, decay) {

		THREE.Light.call(this, color, intensity);

		this.type = 'PointLight';

		this.distance = (distance !== undefined) ? distance : 0;
		this.decay = (decay !== undefined) ? decay : 1; // for physically correct lights, should be 2.

		this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(90, 1, 0.5, 500));

	};

	THREE.PointLight.prototype = Object.create(THREE.Light.prototype);
	THREE.PointLight.prototype.constructor = THREE.PointLight;

	Object.defineProperty(THREE.PointLight.prototype, "power", {

		get: function () {

			// intensity = power per solid angle.
			// ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			return this.intensity * 4 * Math.PI;

		},

		set: function (power) {

			// intensity = power per solid angle.
			// ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			this.intensity = power / (4 * Math.PI);

		}

	});

	THREE.PointLight.prototype.copy = function (source) {

		THREE.Light.prototype.copy.call(this, source);

		this.distance = source.distance;
		this.decay = source.decay;

		this.shadow = source.shadow.clone();

		return this;

	};

	// File:../dev/three/lights/SpotLight.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.SpotLight = function (color, intensity, distance, angle, penumbra, decay) {

		THREE.Light.call(this, color, intensity);

		this.type = 'SpotLight';

		this.position.set(0, 1, 0);
		this.updateMatrix();

		this.target = new THREE.Object3D();

		this.distance = (distance !== undefined) ? distance : 0;
		this.angle = (angle !== undefined) ? angle : Math.PI / 3;
		this.penumbra = (penumbra !== undefined) ? penumbra : 0;
		this.decay = (decay !== undefined) ? decay : 1; // for physically correct lights, should be 2.

		this.shadow = new THREE.SpotLightShadow();

	};

	THREE.SpotLight.prototype = Object.create(THREE.Light.prototype);
	THREE.SpotLight.prototype.constructor = THREE.SpotLight;

	Object.defineProperty(THREE.SpotLight.prototype, "power", {

		get: function () {

			// intensity = power per solid angle.
			// ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			return this.intensity * Math.PI;

		},

		set: function (power) {

			// intensity = power per solid angle.
			// ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
			this.intensity = power / Math.PI;

		}

	});

	THREE.SpotLight.prototype.copy = function (source) {

		THREE.Light.prototype.copy.call(this, source);

		this.distance = source.distance;
		this.angle = source.angle;
		this.penumbra = source.penumbra;
		this.decay = source.decay;

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	};

	// File:../dev/three/lights/LightShadow.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.LightShadow = function (camera) {

		this.camera = camera;

		this.bias = 0;
		this.radius = 1;

		this.mapSize = new THREE.Vector2(512, 512);

		this.map = null;
		this.matrix = new THREE.Matrix4();

	};

	THREE.LightShadow.prototype = {

		constructor: THREE.LightShadow,

		copy: function (source) {

			this.camera = source.camera.clone();

			this.bias = source.bias;
			this.radius = source.radius;

			this.mapSize.copy(source.mapSize);

			return this;

		},

		clone: function () {

			return new this.constructor().copy(this);

		}

	};

	// File:../dev/three/lights/DirectionalLightShadow.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.DirectionalLightShadow = function (light) {

		THREE.LightShadow.call(this, new THREE.OrthographicCamera(-5, 5, 5, -5, 0.5, 500));

	};

	THREE.DirectionalLightShadow.prototype = Object.create(THREE.LightShadow.prototype);
	THREE.DirectionalLightShadow.prototype.constructor = THREE.DirectionalLightShadow;

	// File:../dev/three/lights/HemisphereLight.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.HemisphereLight = function (skyColor, groundColor, intensity) {

		THREE.Light.call(this, skyColor, intensity);

		this.type = 'HemisphereLight';

		this.castShadow = undefined;

		this.position.set(0, 1, 0);
		this.updateMatrix();

		this.groundColor = new THREE.Color(groundColor);

	};

	THREE.HemisphereLight.prototype = Object.create(THREE.Light.prototype);
	THREE.HemisphereLight.prototype.constructor = THREE.HemisphereLight;

	THREE.HemisphereLight.prototype.copy = function (source) {

		THREE.Light.prototype.copy.call(this, source);

		this.groundColor.copy(source.groundColor);

		return this;

	};

	// File:../dev/three/lights/SpotLightShadow.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.SpotLightShadow = function () {

		THREE.LightShadow.call(this, new THREE.PerspectiveCamera(50, 1, 0.5, 500));

	};

	THREE.SpotLightShadow.prototype = Object.create(THREE.LightShadow.prototype);
	THREE.SpotLightShadow.prototype.constructor = THREE.SpotLightShadow;

	THREE.SpotLightShadow.prototype.update = function (light) {

		var fov = THREE.Math.RAD2DEG * 2 * light.angle;
		var aspect = this.mapSize.width / this.mapSize.height;
		var far = light.distance || 500;

		var camera = this.camera;

		if (fov !== camera.fov || aspect !== camera.aspect || far !== camera.far) {

			camera.fov = fov;
			camera.aspect = aspect;
			camera.far = far;
			camera.updateProjectionMatrix();

		}

	};

	// File:../dev/three/materials/Material.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Material = function () {

		Object.defineProperty(this, 'id', {
			value: THREE.MaterialIdCount++
		});

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.layer = 0;
		this.type = 'Material';

		this.side = THREE.BackSide;

		this.mapst = new THREE.Vector4(1, 1, 0, 0);
		this.lightmapst = new THREE.Vector4(1, 1, 0, 0);

		// PI_BEGIN 灰色
		this.enableGray = false;
		// PI_END

		this.opacity = 1;
		this.transparent = false;

		this.blending = THREE.NormalBlending;

		this.blendSrc = THREE.SrcAlphaFactor;
		this.blendDst = THREE.OneMinusSrcAlphaFactor;
		this.blendEquation = THREE.AddEquation;
		// PI_BEGIN
		this.blendSrcAlpha = THREE.OneFactor; // 必须这样，否则，当物体半透明时候会投过去
		this.blendDstAlpha = THREE.OneFactor; // 必须这样，否则，当物体半透明时候会投过去
		// PI_END
		this.blendEquationAlpha = null;

		this.vertexColors = false;

		this.depthFunc = THREE.LessEqualDepth;
		this.depthTest = true;
		this.depthWrite = true;

		this.clippingPlanes = null;
		this.clipShadows = false;

		this.colorWrite = true;

		this.precision = null; // override the renderer's default precision for this material

		this.polygonOffset = false;
		this.polygonOffsetFactor = 0;
		this.polygonOffsetUnits = 0;

		this.alphaTest = 0;
		this.premultipliedAlpha = false;

		this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

		this.visible = true;

		this._needsUpdate = true;

	};

	THREE.Material.prototype = {

		constructor: THREE.Material,

		get needsUpdate() {

			return this._needsUpdate;

		},

		set needsUpdate(value) {

			if (value === true) this.update();

			this._needsUpdate = value;

		},

		setValues: function (values) {

			if (values === undefined) return;

			for (var key in values) {

				if (key === "_$hash")
					continue;

				var newValue = values[key];

				if (newValue === undefined) {

					console.warn("THREE.Material: '" + key + "' parameter is undefined.");
					continue;

				}

				var currentValue = this[key];

				if (currentValue === undefined) {

					console.warn("THREE." + this.type + ": '" + key + "' is not a property of this material.");
					continue;

				}

				if (currentValue instanceof THREE.Color) {

					currentValue.set(newValue);

				} else if (currentValue instanceof THREE.Vector4) {
					if (newValue instanceof THREE.Vector4) {
						currentValue.copy(newValue);
					} else {
						currentValue.set(newValue[0], newValue[1], newValue[2], newValue[3]);
					}
				} else if (currentValue instanceof THREE.Vector3) {

					if (newValue instanceof THREE.Vector3) {
						currentValue.copy(newValue);
					} else {
						currentValue.set(newValue[0], newValue[1], newValue[2]);
					}

				} else if (key === 'overdraw') {

					// ensure overdraw is backwards-compatible with legacy boolean type
					this[key] = Number(newValue);

				} else {

					this[key] = newValue;

				}

			}

		},

		toJSON: function (meta) {

			var isRoot = meta === undefined;

			if (isRoot) {

				meta = {
					textures: {},
					images: {}
				};

			}

			var data = {
				metadata: {
					version: 4.4,
					type: 'Material',
					generator: 'Material.toJSON'
				}
			};

			// standard Material serialization
			data.uuid = this.uuid;
			data.type = this.type;
			if (this.name !== '') data.name = this.name;

			if (this.color instanceof THREE.Color) data.color = this.color.getHex();

			if (this.roughness !== 0.5) data.roughness = this.roughness;
			if (this.metalness !== 0.5) data.metalness = this.metalness;

			if (this.emissive instanceof THREE.Color) data.emissive = this.emissive.getHex();
			if (this.specular instanceof THREE.Color) data.specular = this.specular.getHex();
			if (this.shininess !== undefined) data.shininess = this.shininess;

			if (this.map instanceof THREE.Texture) data.map = this.map.toJSON(meta).uuid;
			if (this.alphaMap instanceof THREE.Texture) data.alphaMap = this.alphaMap.toJSON(meta).uuid;
			if (this.lightMap instanceof THREE.Texture) data.lightMap = this.lightMap.toJSON(meta).uuid;
			if (this.bumpMap instanceof THREE.Texture) {

				data.bumpMap = this.bumpMap.toJSON(meta).uuid;
				data.bumpScale = this.bumpScale;

			}
			if (this.normalMap instanceof THREE.Texture) {

				data.normalMap = this.normalMap.toJSON(meta).uuid;
				data.normalScale = this.normalScale.toArray();

			}
			if (this.displacementMap instanceof THREE.Texture) {

				data.displacementMap = this.displacementMap.toJSON(meta).uuid;
				data.displacementScale = this.displacementScale;
				data.displacementBias = this.displacementBias;

			}
			if (this.roughnessMap instanceof THREE.Texture) data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
			if (this.metalnessMap instanceof THREE.Texture) data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;

			if (this.emissiveMap instanceof THREE.Texture) data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
			if (this.specularMap instanceof THREE.Texture) data.specularMap = this.specularMap.toJSON(meta).uuid;

			if (this.envMap instanceof THREE.Texture) {

				data.envMap = this.envMap.toJSON(meta).uuid;
				data.reflectivity = this.reflectivity; // Scale behind envMap

			}

			if (this.size !== undefined) data.size = this.size;
			if (this.sizeAttenuation !== undefined) data.sizeAttenuation = this.sizeAttenuation;

			if (this.vertexColors !== undefined && this.vertexColors !== THREE.NoColors) data.vertexColors = this.vertexColors;
			if (this.shading !== undefined && this.shading !== THREE.SmoothShading) data.shading = this.shading;
			if (this.blending !== undefined && this.blending !== THREE.NormalBlending) data.blending = this.blending;
			if (this.side !== undefined && this.side !== THREE.FrontSide) data.side = this.side;

			if (this.opacity < 1) data.opacity = this.opacity;
			if (this.transparent === true) data.transparent = this.transparent;
			if (this.alphaTest > 0) data.alphaTest = this.alphaTest;
			if (this.premultipliedAlpha === true) data.premultipliedAlpha = this.premultipliedAlpha;
			if (this.wireframe === true) data.wireframe = this.wireframe;
			if (this.wireframeLinewidth > 1) data.wireframeLinewidth = this.wireframeLinewidth;

			// TODO: Copied from Object3D.toJSON

			function extractFromCache(cache) {

				var values = [];

				for (var key in cache) {

					var data = cache[key];
					delete data.metadata;
					values.push(data);

				}

				return values;

			}

			if (isRoot) {

				var textures = extractFromCache(meta.textures);
				var images = extractFromCache(meta.images);

				if (textures.length > 0) data.textures = textures;
				if (images.length > 0) data.images = images;

			}

			return data;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (source) {

			this.name = source.name;

			this.side = source.side;

			this.opacity = source.opacity;
			this.transparent = source.transparent;

			this.blending = source.blending;

			this.blendSrc = source.blendSrc;
			this.blendDst = source.blendDst;
			this.blendEquation = source.blendEquation;
			this.blendSrcAlpha = source.blendSrcAlpha;
			this.blendDstAlpha = source.blendDstAlpha;
			this.blendEquationAlpha = source.blendEquationAlpha;

			this.depthFunc = source.depthFunc;
			this.depthTest = source.depthTest;
			this.depthWrite = source.depthWrite;

			this.colorWrite = source.colorWrite;

			this.precision = source.precision;

			this.polygonOffset = source.polygonOffset;
			this.polygonOffsetFactor = source.polygonOffsetFactor;
			this.polygonOffsetUnits = source.polygonOffsetUnits;

			this.alphaTest = source.alphaTest;

			this.premultipliedAlpha = source.premultipliedAlpha;

			this.mapst.copy(source.mapst);
			this.lightmapst.copy(source.lightmapst);

			this.overdraw = source.overdraw;

			this.visible = source.visible;
			this.clipShadows = source.clipShadows;

			var srcPlanes = source.clippingPlanes,
				dstPlanes = null;

			if (srcPlanes) {

				var n = srcPlanes.length;
				dstPlanes = new Array(n);

				for (var i = 0; i !== n; ++i)
					dstPlanes[i] = srcPlanes[i].clone();

			}

			this.clippingPlanes = dstPlanes;

			return this;

		},

		update: function () {

			this.dispatchEvent({
				type: 'update'
			});

		},

		dispose: function () {

			this.dispatchEvent({
				type: 'dispose'
			});

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.Material.prototype);

	THREE.MaterialIdCount = 0;
	// File:../dev/three/materials/LineBasicMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *
	 *  linewidth: <float>,
	 *  linecap: "round",
	 *  linejoin: "round",
	 *
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  vertexColors: <bool>
	 * }
	 */

	THREE.LineBasicMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'LineBasicMaterial';

		this.color = new THREE.Color(0xffffff);

		this.linewidth = 1;
		this.linecap = 'round';
		this.linejoin = 'round';

		this.blending = THREE.NormalBlending;

		this.vertexColors = THREE.NoColors;

		this.setValues(parameters);

	};

	THREE.LineBasicMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial;

	THREE.LineBasicMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);

		this.linewidth = source.linewidth;
		this.linecap = source.linecap;
		this.linejoin = source.linejoin;

		this.vertexColors = source.vertexColors;

		return this;

	};

	// File:../dev/three/materials/MeshLambertMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *  lightMap: new THREE.Texture( <Image> ),
	 *  lightMapIntensity: <float>
	 *
	 *  aoMap: new THREE.Texture( <Image> ),
	 *  aoMapIntensity: <float>
	 *
	 *  emissive: <hex>,
	 *  emissiveIntensity: <float>
	 *  emissiveMap: new THREE.Texture( <Image> ),
	 *
	 *  specularMap: new THREE.Texture( <Image> ),
	 *
	 *  alphaMap: new THREE.Texture( <Image> ),
	 *
	 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
	 *  combine: THREE.Multiply,
	 *  reflectivity: <float>,
	 *  refractionRatio: <float>,
	 *
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
	 *
	 *  skinning: <bool>,
	 *  morphTargets: <bool>,
	 *  morphNormals: <bool>,
	 *
	 *	fog: <bool>
	 * }
	 */

	THREE.MeshLambertMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshLambertMaterial';

		this.color = new THREE.Color(0xffffff); // diffuse

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.emissive = new THREE.Color(0x000000);
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.combine = THREE.MultiplyOperation;
		this.reflectivity = 1;
		this.refractionRatio = 0.98;

		this.fog = true;

		this.blending = THREE.NormalBlending;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.vertexColors = THREE.NoColors;

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;

		this.setValues(parameters);

	};

	THREE.MeshLambertMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial;

	THREE.MeshLambertMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);

		this.map = source.map;

		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.emissive.copy(source.emissive);
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;

		this.specularMap = source.specularMap;

		this.alphaMap = source.alphaMap;

		this.envMap = source.envMap;
		this.combine = source.combine;
		this.reflectivity = source.reflectivity;
		this.refractionRatio = source.refractionRatio;

		this.fog = source.fog;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		this.vertexColors = source.vertexColors;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;

		return this;

	};

	// File:../dev/three/materials/MeshBasicMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *  shading: THREE.SmoothShading,
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
	 *
	 *  skinning: <bool>,
	 * 
	 *  fog: <bool>
	 * 
	 *  enableConvertColor: <bool>,
	 *  hsvValue: THREE.Vector3,
	 * 
	 *  lightMap: new THREE.Texture( <Image> ),
	 *  lightMapIntensity: number,
	 * 
	 * }
	 */

	THREE.MeshBasicMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshBasicMaterial';

		this.color = new THREE.Color(0xffffff); // vec4(rgba)

		this.map = null;

		this.fog = true;

		this.shading = THREE.SmoothShading;
		this.blending = THREE.NormalBlending;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.vertexColors = THREE.NoColors;

		this.skinning = false;

		// PI_BEGIN

		this.enableConvertColor = false;
		this.hsvValue = new THREE.Vector3(0.0, 0.0, 0.0);

		this.lightMap = null;
		this.lightMapIntensity = 1.0;
		// PI_END

		this.setValues(parameters);
	};

	THREE.MeshBasicMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial;

	THREE.MeshBasicMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);

		this.map = source.map;
		this.fog = source.fog;

		this.shading = source.shading;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		// PI_BEGIN
		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.enableConvertColor = source.enableConvertColor;
		this.hsvValue.copy(source.hsvValue);
		// PI_END

		this.vertexColors = source.vertexColors;

		this.skinning = source.skinning;

		return this;
	};
	// File:../dev/three/materials/LineDashedMaterial.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *
	 *  linewidth: <float>,
	 *
	 *  scale: <float>,
	 *  dashSize: <float>,
	 *  gapSize: <float>,
	 *
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.FaceColors / THREE.VertexColors
	 *
	 *  fog: <bool>
	 * }
	 */

	THREE.LineDashedMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'LineDashedMaterial';

		this.color = new THREE.Color(0xffffff);

		this.linewidth = 1;

		this.scale = 1;
		this.dashSize = 3;
		this.gapSize = 1;

		this.blending = THREE.NormalBlending;

		this.vertexColors = THREE.NoColors;

		this.fog = true;

		this.setValues(parameters);

	};

	THREE.LineDashedMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.LineDashedMaterial.prototype.constructor = THREE.LineDashedMaterial;

	THREE.LineDashedMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);

		this.linewidth = source.linewidth;

		this.scale = source.scale;
		this.dashSize = source.dashSize;
		this.gapSize = source.gapSize;

		this.vertexColors = source.vertexColors;

		this.fog = source.fog;

		return this;

	};

	// File:../dev/three/materials/MeshDepthMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 * @author bhouston / https://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 *
	 * parameters = {
	 *
	 *  opacity: <float>,
	 *
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *  alphaMap: new THREE.Texture( <Image> ),
	 *
	 *  displacementMap: new THREE.Texture( <Image> ),
	 *  displacementScale: <float>,
	 *  displacementBias: <float>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>
	 * }
	 */

	THREE.MeshDepthMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshDepthMaterial';

		this.depthPacking = THREE.BasicDepthPacking;

		this.skinning = false;
		this.morphTargets = false;

		this.map = null;

		this.alphaMap = null;

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.wireframe = false;
		this.wireframeLinewidth = 1;

		this.setValues(parameters);

	};

	THREE.MeshDepthMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial;

	THREE.MeshDepthMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.depthPacking = source.depthPacking;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;

		this.map = source.map;

		this.alphaMap = source.alphaMap;

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;

		return this;

	};

	// File:../dev/three/materials/MeshNormalMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 *
	 * parameters = {
	 *  opacity: <float>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>
	 * }
	 */

	THREE.MeshNormalMaterial = function (parameters) {

		THREE.Material.call(this, parameters);

		this.type = 'MeshNormalMaterial';

		this.wireframe = false;
		this.wireframeLinewidth = 1;

		this.morphTargets = false;

		this.setValues(parameters);

	};

	THREE.MeshNormalMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial;

	THREE.MeshNormalMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;

		return this;

	};

	// File:../dev/three/materials/MeshPhongMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  specular: <hex>,
	 *  shininess: <float>,
	 *  opacity: <float>,
	 *
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *  lightMap: new THREE.Texture( <Image> ),
	 *  lightMapIntensity: <float>
	 *
	 *  aoMap: new THREE.Texture( <Image> ),
	 *  aoMapIntensity: <float>
	 *
	 *  emissive: <hex>,
	 *  emissiveIntensity: <float>
	 *  emissiveMap: new THREE.Texture( <Image> ),
	 *
	 *  bumpMap: new THREE.Texture( <Image> ),
	 *  bumpScale: <float>,
	 *
	 *  normalMap: new THREE.Texture( <Image> ),
	 *  normalScale: <Vector2>,
	 *
	 *  displacementMap: new THREE.Texture( <Image> ),
	 *  displacementScale: <float>,
	 *  displacementBias: <float>,
	 *
	 *  specularMap: new THREE.Texture( <Image> ),
	 *
	 *  alphaMap: new THREE.Texture( <Image> ),
	 *
	 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
	 *  combine: THREE.Multiply,
	 *  reflectivity: <float>,
	 *  refractionRatio: <float>,
	 *
	 *  shading: THREE.SmoothShading,
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
	 *
	 *  skinning: <bool>,
	 *  morphTargets: <bool>,
	 *  morphNormals: <bool>,
	 *
	 *	fog: <bool>
	 * }
	 */

	THREE.MeshPhongMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshPhongMaterial';

		this.color = new THREE.Color(0xffffff); // diffuse
		this.specular = new THREE.Color(0x111111);
		this.shininess = 30;

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.emissive = new THREE.Color(0x000000);
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.bumpMap = null;
		this.bumpScale = 1;

		this.normalMap = null;
		this.normalScale = new THREE.Vector2(1, 1);

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.combine = THREE.MultiplyOperation;
		this.reflectivity = 1;
		this.refractionRatio = 0.98;

		this.fog = true;

		this.shading = THREE.SmoothShading;
		this.blending = THREE.NormalBlending;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.vertexColors = THREE.NoColors;

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;

		this.setValues(parameters);

	};

	THREE.MeshPhongMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial;

	THREE.MeshPhongMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);
		this.specular.copy(source.specular);
		this.shininess = source.shininess;

		this.map = source.map;

		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.emissive.copy(source.emissive);
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;

		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;

		this.normalMap = source.normalMap;
		this.normalScale.copy(source.normalScale);

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.specularMap = source.specularMap;

		this.alphaMap = source.alphaMap;

		this.envMap = source.envMap;
		this.combine = source.combine;
		this.reflectivity = source.reflectivity;
		this.refractionRatio = source.refractionRatio;

		this.fog = source.fog;

		this.shading = source.shading;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		this.vertexColors = source.vertexColors;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;

		return this;

	};

	// File:../dev/three/materials/MeshStandardMaterial.js

	/**
	 * @author WestLangley / http://github.com/WestLangley
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  roughness: <float>,
	 *  metalness: <float>,
	 *  opacity: <float>,
	 *
	 *  map: new THREE.Texture( <Image> ),
	 *
	 * 	enableConvertColor: <boolean>,
	 * 	hsvValue: new THREE.Vector3(),
	 *
	 *  lightMap: new THREE.Texture( <Image> ),
	 *  lightMapIntensity: <float>
	 *
	 *  aoMap: new THREE.Texture( <Image> ),
	 *  aoMapIntensity: <float>
	 *
	 *  emissive: <hex>,
	 *  emissiveIntensity: <float>
	 *  emissiveMap: new THREE.Texture( <Image> ),
	 *
	 *  bumpMap: new THREE.Texture( <Image> ),
	 *  bumpScale: <float>,
	 *
	 *  normalMap: new THREE.Texture( <Image> ),
	 *  normalScale: <Vector2>,
	 *
	 *  displacementMap: new THREE.Texture( <Image> ),
	 *  displacementScale: <float>,
	 *  displacementBias: <float>,
	 *
	 *  roughnessMap: new THREE.Texture( <Image> ),
	 *
	 *  metalnessMap: new THREE.Texture( <Image> ),
	 *
	 *  alphaMap: new THREE.Texture( <Image> ),
	 *
	 *  envMap: new THREE.CubeTexture( [posx, negx, posy, negy, posz, negz] ),
	 *  envMapIntensity: <float>
	 *
	 *  refractionRatio: <float>,
	 *
	 *  shading: THREE.SmoothShading,
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
	 *
	 *  skinning: <bool>,
	 *  morphTargets: <bool>,
	 *  morphNormals: <bool>,
	 *
	 *	fog: <bool>
	 * }
	 */

	THREE.MeshStandardMaterial = function (parameters) {

		THREE.Material.call(this);

		this.defines = {
			'STANDARD': ''
		};

		this.type = 'MeshStandardMaterial';

		this.color = new THREE.Color(0xffffff); // diffuse
		this.roughness = 0.5;
		this.metalness = 0.5;

		this.map = null;
		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.enableConvertColor = false;
		this.hsvValue = new THREE.Vector3();

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.emissive = new THREE.Color(0x000000);
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.bumpMap = null;
		this.bumpScale = 1;

		this.normalMap = null;
		this.normalScale = new THREE.Vector2(1, 1);

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.roughnessMap = null;

		this.metalnessMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.envMapIntensity = 1.0;

		this.refractionRatio = 0.98;

		this.fog = true;

		this.shading = THREE.SmoothShading;
		this.blending = THREE.NormalBlending;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.vertexColors = THREE.NoColors;

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;

		this.setValues(parameters);

	};

	THREE.MeshStandardMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshStandardMaterial.prototype.constructor = THREE.MeshStandardMaterial;

	THREE.MeshStandardMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.defines = {
			'STANDARD': ''
		};

		this.color.copy(source.color);
		this.roughness = source.roughness;
		this.metalness = source.metalness;

		this.map = source.map;
		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.enableConvertColor = source.enableConvertColor;
		this.hsvValue.copy(source.hsvValue);

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.emissive.copy(source.emissive);
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;

		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;

		this.normalMap = source.normalMap;
		this.normalScale.copy(source.normalScale);

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.roughnessMap = source.roughnessMap;

		this.metalnessMap = source.metalnessMap;

		this.alphaMap = source.alphaMap;

		this.envMap = source.envMap;
		this.envMapIntensity = source.envMapIntensity;

		this.refractionRatio = source.refractionRatio;

		this.fog = source.fog;

		this.shading = source.shading;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		this.vertexColors = source.vertexColors;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;

		return this;

	};

	// File:../dev/three/materials/MeshPhysicalMaterial.js

	/**
	 * @author WestLangley / http://github.com/WestLangley
	 *
	 * parameters = {
	 *  reflectivity: <float>
	 * }
	 */

	THREE.MeshPhysicalMaterial = function (parameters) {

		THREE.MeshStandardMaterial.call(this);

		this.defines = {
			'PHYSICAL': ''
		};

		this.type = 'MeshPhysicalMaterial';

		this.reflectivity = 0.5; // maps to F0 = 0.04

		this.setValues(parameters);

	};

	THREE.MeshPhysicalMaterial.prototype = Object.create(THREE.MeshStandardMaterial.prototype);
	THREE.MeshPhysicalMaterial.prototype.constructor = THREE.MeshPhysicalMaterial;

	THREE.MeshPhysicalMaterial.prototype.copy = function (source) {

		THREE.MeshStandardMaterial.prototype.copy.call(this, source);

		this.defines = {
			'PHYSICAL': ''
		};

		this.reflectivity = source.reflectivity;

		return this;

	};

	// File:../dev/three/materials/MultiMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.MultiMaterial = function (materials) {

		this.uuid = THREE.Math.generateUUID();

		this.type = 'MultiMaterial';

		this.materials = materials instanceof Array ? materials : [];

		this.visible = true;

	};

	THREE.MultiMaterial.prototype = {

		constructor: THREE.MultiMaterial,

		toJSON: function (meta) {

			var output = {
				metadata: {
					version: 4.2,
					type: 'material',
					generator: 'MaterialExporter'
				},
				uuid: this.uuid,
				type: this.type,
				materials: []
			};

			var materials = this.materials;

			for (var i = 0, l = materials.length; i < l; i++) {

				var material = materials[i].toJSON(meta);
				delete material.metadata;

				output.materials.push(material);

			}

			output.visible = this.visible;

			return output;

		},

		clone: function () {

			var material = new this.constructor();

			for (var i = 0; i < this.materials.length; i++) {

				material.materials.push(this.materials[i].clone());

			}

			material.visible = this.visible;

			return material;

		}

	};

	// File:../dev/three/materials/MeshParticlesMaterial.js

	/**
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *  shading: THREE.SmoothShading,
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
	 *
	 *  skinning: <bool>,
	 * 
	 *  fog: <bool>
	 * }
	 */

	THREE.MeshParticlesMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshParticlesMaterial';

		this.tintOpacity = 1;
		this.tintColor = new THREE.Color(0xffffff); // vec4(rgba)
		this.useBillboard = false;
		this.map = null;

		this.fog = true;
		this.transparent = true;
		this.shading = THREE.SmoothShading;
		this.blending = THREE.NormalBlending;
		this.vertexColors = THREE.NoColors;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.skinning = false;
		this.depthWrite = false;

		this.mShininess = 1.0;
		this.mAmbient = [1.0, 1.0, 1.0];
		this.mDiffuse = [1.0, 1.0, 1.0];
		this.mSpecular = [1.0, 1.0, 1.0];

		this.setValues(parameters);
	};

	THREE.MeshParticlesMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshParticlesMaterial.prototype.constructor = THREE.MeshParticlesMaterial;

	THREE.MeshParticlesMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.tintColor.copy(source.tintColor);
		this.tintOpacity = source.tintOpacity;

		this.map = source.map;

		this.fog = source.fog;

		this.shading = source.shading;
		this.useBillboard = source.useBillboard;
		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		// PI_BEGIN
		this.mShininess = source.mShininess;
		this.mAmbient = [];
		for (var i = 0; i < source.mAmbient; ++i) {
			this.mAmbient[i] = source.mAmbient[i];
		}
		this.mDiffuse = [];
		for (var i = 0; i < source.mDiffuse; ++i) {
			this.mDiffuse[i] = source.mDiffuse[i];
		}
		this.mSpecular = [];
		for (var i = 0; i < source.mSpecular; ++i) {
			this.mSpecular[i] = source.mSpecular[i];
		}
		// PI_END

		this.vertexColors = source.vertexColors;

		this.skinning = source.skinning;

		return this;
	};
	// File:../dev/three/materials/MeshT4M3Material.js

	THREE.MeshT4M3Material = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshT4M3Material';

		this._Control = null;
		this._Splat0 = null;
		this._Splat1 = null;
		this._Splat2 = null;

		this._controlst = new THREE.Vector4(1, 1, 0, 0);
		this._splat0st = new THREE.Vector4(1, 1, 0, 0);
		this._splat1st = new THREE.Vector4(1, 1, 0, 0);
		this._splat2st = new THREE.Vector4(1, 1, 0, 0);

		this.fog = true;

		this.shading = THREE.SmoothShading;
		this.blending = THREE.NormalBlending;
		this.vertexColors = THREE.NoColors;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.skinning = false;
		this.depthWrite = true;

		this.mShininess = 1.0;
		this.mAmbient = [1.0, 1.0, 1.0];
		this.mDiffuse = [1.0, 1.0, 1.0];
		this.mSpecular = [1.0, 1.0, 1.0];

		this.tintOpacity = 1;

		this.setValues(parameters);
	};

	THREE.MeshT4M3Material.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshT4M3Material.prototype.constructor = THREE.MeshT4M3Material;
	// File:../dev/three/materials/MeshT4M2Material.js

	THREE.MeshT4M2Material = function (parameters) {

		THREE.Material.call(this);

		this.type = 'MeshT4M2Material';

		this._Control = null;
		this._Splat0 = null;
		this._Splat1 = null;
		this.lightMap = null;

		this._controlst = new THREE.Vector4(1, 1, 0, 0);
		this._splat0st = new THREE.Vector4(1, 1, 0, 0);
		this._splat1st = new THREE.Vector4(1, 1, 0, 0);
		this.lightmapst = new THREE.Vector4(1, 1, 0, 0);

		this.lightMapIntensity = 1.0;

		this.fog = true;

		this.shading = THREE.SmoothShading;
		this.blending = THREE.NormalBlending;
		this.vertexColors = THREE.NoColors;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.skinning = false;
		this.depthWrite = true;

		this.mShininess = 1.0;
		this.mAmbient = [1.0, 1.0, 1.0];
		this.mDiffuse = [1.0, 1.0, 1.0];
		this.mSpecular = [1.0, 1.0, 1.0];

		this.tintOpacity = 1;

		this.setValues(parameters);
	};

	THREE.MeshT4M2Material.prototype = Object.create(THREE.Material.prototype);
	THREE.MeshT4M2Material.prototype.constructor = THREE.MeshT4M2Material;
	// File:../dev/three/materials/PointsMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *  size: <float>,
	 *  sizeAttenuation: <bool>,
	 *
	 *  blending: THREE.NormalBlending,
	 *  depthTest: <bool>,
	 *  depthWrite: <bool>,
	 *
	 *  vertexColors: <bool>,
	 * }
	 */

	THREE.PointsMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'PointsMaterial';

		this.color = new THREE.Color(0xffffff);

		this.map = null;

		this.size = 1;
		this.sizeAttenuation = true;

		this.blending = THREE.NormalBlending;

		this.vertexColors = THREE.NoColors;

		this.setValues(parameters);

	};

	THREE.PointsMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.PointsMaterial.prototype.constructor = THREE.PointsMaterial;

	THREE.PointsMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);

		this.map = source.map;

		this.size = source.size;
		this.sizeAttenuation = source.sizeAttenuation;

		this.vertexColors = source.vertexColors;

		return this;

	};

	// File:../dev/three/materials/ShaderMaterial.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  defines: { "label" : "value" },
	 *  uniforms: { "parameter1": { type: "1f", value: 1.0 }, "parameter2": { type: "1i" value2: 2 } },
	 *
	 *  fragmentShader: <string>,
	 *  vertexShader: <string>,
	 *
	 *  shading: THREE.SmoothShading,
	 *
	 *  lights: <bool>,
	 *
	 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
	 *
	 *  skinning: <bool>,
	 *  
	 *  fog: <bool>
	 * }
	 */

	THREE.ShaderMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'ShaderMaterial';

		this.defines = {};
		this.uniforms = {};

		this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
		this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';

		this.shading = THREE.SmoothShading;

		this.lights = false; // set to use scene lights
		this.clipping = false; // set to use user-defined clipping planes

		this.vertexColors = THREE.NoColors; // set to use "color" attribute stream

		this.fog = false; // set to use scene fog

		this.skinning = false; // set to use skinning attribute streams

		this.extensions = {
			derivatives: false, // set to use derivatives
			fragDepth: false, // set to use fragment depth values
			drawBuffers: false, // set to use draw buffers
			shaderTextureLOD: false // set to use shader texture LOD
		};

		// When rendered geometry doesn't include these attributes but the material does,
		// use these default values in WebGL. This avoids errors when buffer data is missing.
		this.defaultAttributeValues = {
			'color': [1, 1, 1],
			'uv': [0, 0],
			'uv2': [0, 0]
		};

		this.index0AttributeName = undefined;

		if (parameters !== undefined) {

			if (parameters.attributes !== undefined) {

				console.error('THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.');

			}

			this.setValues(parameters);

		}

	};

	THREE.ShaderMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.ShaderMaterial.prototype.constructor = THREE.ShaderMaterial;

	THREE.ShaderMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.fragmentShader = source.fragmentShader;
		this.vertexShader = source.vertexShader;

		this.uniforms = THREE.UniformsUtils.clone(source.uniforms);

		this.defines = source.defines;

		this.shading = source.shading;

		this.fog = source.fog;

		this.lights = source.lights;
		this.clipping = source.clipping;

		this.vertexColors = source.vertexColors;

		this.skinning = source.skinning;

		this.extensions = source.extensions;

		return this;

	};

	THREE.ShaderMaterial.prototype.toJSON = function (meta) {

		var data = THREE.Material.prototype.toJSON.call(this, meta);

		data.uniforms = this.uniforms;
		data.vertexShader = this.vertexShader;
		data.fragmentShader = this.fragmentShader;

		return data;

	};

	// File:../dev/three/materials/RawShaderMaterial.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.RawShaderMaterial = function (parameters) {

		THREE.ShaderMaterial.call(this, parameters);

		this.type = 'RawShaderMaterial';

	};

	THREE.RawShaderMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
	THREE.RawShaderMaterial.prototype.constructor = THREE.RawShaderMaterial;

	// File:../dev/three/materials/SpriteMaterial.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  color: <hex>,
	 *  opacity: <float>,
	 *  map: new THREE.Texture( <Image> ),
	 *
	 *	uvOffset: new THREE.Vector2(),
	 *	uvScale: new THREE.Vector2(),
	 * }
	 */

	THREE.SpriteMaterial = function (parameters) {

		THREE.Material.call(this);

		this.type = 'SpriteMaterial';

		this.color = new THREE.Color(0xffffff);
		this.map = null;

		this.rotation = 0;

		// set parameters

		this.setValues(parameters);

	};

	THREE.SpriteMaterial.prototype = Object.create(THREE.Material.prototype);
	THREE.SpriteMaterial.prototype.constructor = THREE.SpriteMaterial;

	THREE.SpriteMaterial.prototype.copy = function (source) {

		THREE.Material.prototype.copy.call(this, source);

		this.color.copy(source.color);
		this.map = source.map;

		this.rotation = source.rotation;

		return this;

	};

	// File:../dev/three/textures/Texture.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 * @author szimek / https://github.com/szimek/
	 */

	THREE.Texture = function (image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {

		Object.defineProperty(this, 'id', {
			value: THREE.TextureIdCount++
		});

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.sourceFile = '';

		this.image = image !== undefined ? image : THREE.Texture.DEFAULT_IMAGE;
		this.mipmaps = [];

		this.mapping = mapping !== undefined ? mapping : THREE.Texture.DEFAULT_MAPPING;

		// PI_BEGIN
		// this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
		// this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

		this.wrapS = wrapS !== undefined ? wrapS : THREE.RepeatWrapping;
		this.wrapT = wrapT !== undefined ? wrapT : THREE.RepeatWrapping;
		// PI_END

		this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
		this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearFilter;

		this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

		this.format = format !== undefined ? format : THREE.RGBAFormat;
		this.type = type !== undefined ? type : THREE.UnsignedByteType;

		this.generateMipmaps = true;
		this.premultiplyAlpha = false;
		this.flipY = true;
		this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)


		// Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
		//
		// Also changing the encoding after already used by a Material will not automatically make the Material
		// update.  You need to explicitly call Material.needsUpdate to trigger it to recompile.
		this.encoding = encoding !== undefined ? encoding : THREE.LinearEncoding;

		this.version = 0;
		this.onUpdate = null;

	};

	THREE.Texture.DEFAULT_IMAGE = undefined;
	THREE.Texture.DEFAULT_MAPPING = THREE.UVMapping;

	THREE.Texture.prototype = {

		constructor: THREE.Texture,

		set needsUpdate(value) {

			if (value === true) this.version++;

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (source) {

			this.image = source.image;
			this.mipmaps = source.mipmaps.slice(0);

			this.mapping = source.mapping;

			this.wrapS = source.wrapS;
			this.wrapT = source.wrapT;

			this.magFilter = source.magFilter;
			this.minFilter = source.minFilter;

			this.anisotropy = source.anisotropy;

			this.format = source.format;
			this.type = source.type;

			this.generateMipmaps = source.generateMipmaps;
			this.premultiplyAlpha = source.premultiplyAlpha;
			this.flipY = source.flipY;
			this.unpackAlignment = source.unpackAlignment;
			this.encoding = source.encoding;

			return this;

		},

		toJSON: function (meta) {

			if (meta.textures[this.uuid] !== undefined) {

				return meta.textures[this.uuid];

			}

			function getDataURL(image) {

				var canvas;

				if (image.toDataURL !== undefined) {

					canvas = image;

				} else {

					canvas = document.createElement('canvas');
					canvas.width = image.width;
					canvas.height = image.height;

					canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

				}

				if (canvas.width > 2048 || canvas.height > 2048) {

					return canvas.toDataURL('image/jpeg', 0.6);

				} else {

					return canvas.toDataURL('image/png');

				}

			}

			var output = {
				metadata: {
					version: 4.4,
					type: 'Texture',
					generator: 'Texture.toJSON'
				},

				uuid: this.uuid,
				name: this.name,

				mapping: this.mapping,

				wrap: [this.wrapS, this.wrapT],

				minFilter: this.minFilter,
				magFilter: this.magFilter,
				anisotropy: this.anisotropy
			};

			if (this.image !== undefined) {

				// TODO: Move to THREE.Image

				var image = this.image;

				if (image.uuid === undefined) {

					image.uuid = THREE.Math.generateUUID(); // UGH

				}

				if (meta.images[image.uuid] === undefined) {

					meta.images[image.uuid] = {
						uuid: image.uuid,
						url: getDataURL(image)
					};

				}

				output.image = image.uuid;

			}

			meta.textures[this.uuid] = output;

			return output;

		},

		dispose: function () {

			this.dispatchEvent({
				type: 'dispose'
			});

		},

		transformUv: function (uv) {

			if (this.mapping !== THREE.UVMapping) return;

			if (uv.x < 0 || uv.x > 1) {

				switch (this.wrapS) {

					case THREE.RepeatWrapping:

						uv.x = uv.x - Math.floor(uv.x);
						break;

					case THREE.ClampToEdgeWrapping:

						uv.x = uv.x < 0 ? 0 : 1;
						break;

					case THREE.MirroredRepeatWrapping:

						if (Math.abs(Math.floor(uv.x) % 2) === 1) {

							uv.x = Math.ceil(uv.x) - uv.x;

						} else {

							uv.x = uv.x - Math.floor(uv.x);

						}
						break;

				}

			}

			if (uv.y < 0 || uv.y > 1) {

				switch (this.wrapT) {

					case THREE.RepeatWrapping:

						uv.y = uv.y - Math.floor(uv.y);
						break;

					case THREE.ClampToEdgeWrapping:

						uv.y = uv.y < 0 ? 0 : 1;
						break;

					case THREE.MirroredRepeatWrapping:

						if (Math.abs(Math.floor(uv.y) % 2) === 1) {

							uv.y = Math.ceil(uv.y) - uv.y;

						} else {

							uv.y = uv.y - Math.floor(uv.y);

						}
						break;

				}

			}

			if (this.flipY) {

				uv.y = 1 - uv.y;

			}

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.Texture.prototype);

	THREE.TextureIdCount = 0;

	// File:../dev/three/textures/DepthTexture.js

	/**
	 * @author Matt DesLauriers / @mattdesl
	 */

	THREE.DepthTexture = function (width, height, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {

		THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, THREE.DepthFormat, type, anisotropy);

		this.image = {
			width: width,
			height: height
		};

		this.type = type !== undefined ? type : THREE.UnsignedShortType;

		this.magFilter = magFilter !== undefined ? magFilter : THREE.NearestFilter;
		this.minFilter = minFilter !== undefined ? minFilter : THREE.NearestFilter;

		this.flipY = false;
		this.generateMipmaps = false;

	};

	THREE.DepthTexture.prototype = Object.create(THREE.Texture.prototype);
	THREE.DepthTexture.prototype.constructor = THREE.DepthTexture;

	// File:../dev/three/textures/CanvasTexture.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.CanvasTexture = function (canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {

		THREE.Texture.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);

		this.needsUpdate = true;

	};

	THREE.CanvasTexture.prototype = Object.create(THREE.Texture.prototype);
	THREE.CanvasTexture.prototype.constructor = THREE.CanvasTexture;

	// File:../dev/three/textures/CubeTexture.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.CubeTexture = function (images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {

		images = images !== undefined ? images : [];
		mapping = mapping !== undefined ? mapping : THREE.CubeReflectionMapping;

		THREE.Texture.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

		this.flipY = false;

	};

	THREE.CubeTexture.prototype = Object.create(THREE.Texture.prototype);
	THREE.CubeTexture.prototype.constructor = THREE.CubeTexture;

	Object.defineProperty(THREE.CubeTexture.prototype, 'images', {

		get: function () {

			return this.image;

		},

		set: function (value) {

			this.image = value;

		}

	});

	// File:../dev/three/textures/CompressedTexture.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.CompressedTexture = function (mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {

		THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

		this.image = {
			width: width,
			height: height
		};
		this.mipmaps = mipmaps;

		// no flipping for cube textures
		// (also flipping doesn't work for compressed textures )

		this.flipY = false;

		// can't generate mipmaps for compressed textures
		// mips must be embedded in DDS files

		this.generateMipmaps = false;

	};

	THREE.CompressedTexture.prototype = Object.create(THREE.Texture.prototype);
	THREE.CompressedTexture.prototype.constructor = THREE.CompressedTexture;

	// File:../dev/three/textures/DataTexture.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.DataTexture = function (data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {

		THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

		this.image = {
			data: data,
			width: width,
			height: height
		};

		this.magFilter = magFilter !== undefined ? magFilter : THREE.NearestFilter;
		this.minFilter = minFilter !== undefined ? minFilter : THREE.NearestFilter;

		this.flipY = false;
		this.generateMipmaps = false;

	};

	THREE.DataTexture.prototype = Object.create(THREE.Texture.prototype);
	THREE.DataTexture.prototype.constructor = THREE.DataTexture;
	// File:../dev/three/objects/Group.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Group = function () {

		THREE.Object3D.call(this);

		this.type = 'Group';

	};

	THREE.Group.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Group.prototype.constructor = THREE.Group;

	// File:../dev/three/objects/Points.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Points = function (geometry, material) {

		THREE.Object3D.call(this);

		this.type = 'Points';

		this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
		this.material = material !== undefined ? material : new THREE.PointsMaterial({
			color: Math.random() * 0xffffff
		});

	};

	THREE.Points.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Points.prototype.constructor = THREE.Points;

	THREE.Points.prototype.raycast = (function () {

		var inverseMatrix = new THREE.Matrix4();
		var ray = new THREE.Ray();
		var sphere = new THREE.Sphere();

		return function raycast(raycaster, intersects) {

			var object = this;
			var geometry = this.geometry;
			var matrixWorld = this.matrixWorld;
			var threshold = raycaster.params.Points.threshold;

			// Checking boundingSphere distance to ray

			if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

			sphere.copy(geometry.boundingSphere);
			sphere.applyMatrix4(matrixWorld);

			if (raycaster.ray.intersectsSphere(sphere) === false) return;

			//

			inverseMatrix.getInverse(matrixWorld);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
			var localThresholdSq = localThreshold * localThreshold;
			var position = new THREE.Vector3();

			function testPoint(point, index) {

				var rayPointDistanceSq = ray.distanceSqToPoint(point);

				if (rayPointDistanceSq < localThresholdSq) {

					var intersectPoint = ray.closestPointToPoint(point);
					intersectPoint.applyMatrix4(matrixWorld);

					var distance = raycaster.ray.origin.distanceTo(intersectPoint);

					if (distance < raycaster.near || distance > raycaster.far) return;

					intersects.push({

						distance: distance,
						distanceToRay: Math.sqrt(rayPointDistanceSq),
						point: intersectPoint.clone(),
						index: index,
						face: null,
						object: object

					});

				}

			}

			if (geometry instanceof THREE.BufferGeometry) {

				var index = geometry.index;
				var attributes = geometry.attributes;
				var positions = attributes.position.array;

				if (index !== null) {

					var indices = index.array;

					for (var i = 0, il = indices.length; i < il; i++) {

						var a = indices[i];

						position.fromArray(positions, a * 3);

						testPoint(position, a);

					}

				} else {

					for (var i = 0, l = positions.length / 3; i < l; i++) {

						position.fromArray(positions, i * 3);

						testPoint(position, i);

					}

				}

			} else {

				var vertices = geometry.vertices;

				for (var i = 0, l = vertices.length; i < l; i++) {

					testPoint(vertices[i], i);

				}

			}

		};

	}());

	THREE.Points.prototype.clone = function () {

		return new this.constructor(this.geometry, this.material).copy(this);

	};

	// File:../dev/three/objects/Line.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Line = function (geometry, material, mode) {

		if (mode === 1) {

			console.warn('THREE.Line: parameter THREE.LinePieces no longer supported. Created THREE.LineSegments instead.');
			return new THREE.LineSegments(geometry, material);

		}

		THREE.Object3D.call(this);

		this.type = 'Line';

		this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
		this.material = material !== undefined ? material : new THREE.LineBasicMaterial({
			color: Math.random() * 0xffffff
		});

	};

	THREE.Line.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Line.prototype.constructor = THREE.Line;

	THREE.Line.prototype.raycast = (function () {

		var inverseMatrix = new THREE.Matrix4();
		var ray = new THREE.Ray();
		var sphere = new THREE.Sphere();

		return function raycast(raycaster, intersects) {

			var precision = raycaster.linePrecision;
			var precisionSq = precision * precision;

			var geometry = this.geometry;
			var matrixWorld = this.matrixWorld;

			// Checking boundingSphere distance to ray

			if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

			sphere.copy(geometry.boundingSphere);
			sphere.applyMatrix4(matrixWorld);

			if (raycaster.ray.intersectsSphere(sphere) === false) return;

			//

			inverseMatrix.getInverse(matrixWorld);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			var vStart = new THREE.Vector3();
			var vEnd = new THREE.Vector3();
			var interSegment = new THREE.Vector3();
			var interRay = new THREE.Vector3();
			var step = this instanceof THREE.LineSegments ? 2 : 1;

			if (geometry instanceof THREE.BufferGeometry) {

				var index = geometry.index;
				var attributes = geometry.attributes;
				var positions = attributes.position.array;

				if (index !== null) {

					var indices = index.array;

					for (var i = 0, l = indices.length - 1; i < l; i += step) {

						var a = indices[i];
						var b = indices[i + 1];

						vStart.fromArray(positions, a * 3);
						vEnd.fromArray(positions, b * 3);

						var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);

						if (distSq > precisionSq) continue;

						interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

						var distance = raycaster.ray.origin.distanceTo(interRay);

						if (distance < raycaster.near || distance > raycaster.far) continue;

						intersects.push({

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4(this.matrixWorld),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						});

					}

				} else {

					for (var i = 0, l = positions.length / 3 - 1; i < l; i += step) {

						vStart.fromArray(positions, 3 * i);
						vEnd.fromArray(positions, 3 * i + 3);

						var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);

						if (distSq > precisionSq) continue;

						interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

						var distance = raycaster.ray.origin.distanceTo(interRay);

						if (distance < raycaster.near || distance > raycaster.far) continue;

						intersects.push({

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4(this.matrixWorld),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						});

					}

				}

			} else if (geometry instanceof THREE.Geometry) {

				var vertices = geometry.vertices;
				var nbVertices = vertices.length;

				for (var i = 0; i < nbVertices - 1; i += step) {

					var distSq = ray.distanceSqToSegment(vertices[i], vertices[i + 1], interRay, interSegment);

					if (distSq > precisionSq) continue;

					interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

					var distance = raycaster.ray.origin.distanceTo(interRay);

					if (distance < raycaster.near || distance > raycaster.far) continue;

					intersects.push({

						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4(this.matrixWorld),
						index: i,
						face: null,
						faceIndex: null,
						object: this

					});

				}

			}

		};

	}());

	THREE.Line.prototype.clone = function () {

		return new this.constructor(this.geometry, this.material).copy(this);

	};

	// DEPRECATED

	THREE.LineStrip = 0;
	THREE.LinePieces = 1;

	// File:../dev/three/objects/LineSegments.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.LineSegments = function (geometry, material) {

		THREE.Line.call(this, geometry, material);

		this.type = 'LineSegments';

	};

	THREE.LineSegments.prototype = Object.create(THREE.Line.prototype);
	THREE.LineSegments.prototype.constructor = THREE.LineSegments;

	// File:../dev/three/objects/Mesh.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author jonobr1 / http://jonobr1.com/
	 */

	THREE.Mesh = function (geometry, material) {

		THREE.Object3D.call(this);

		this.type = 'Mesh';

		this.isGray = 0;

		this.geometry = geometry;
		this.material = material;

		this.drawMode = THREE.TrianglesDrawMode;

		this.textureReady = false;
		this.geoReady = false;
		this.ready = false;

		material && this.textureReadyOk();
		geometry && this.geoReadyOk();
		// this.updateMorphTargets();
	};

	THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Mesh.prototype.constructor = THREE.Mesh;

	THREE.Mesh.prototype.getMaterial = function () {
		return this.material;
	};

	THREE.Mesh.prototype.createMaterial = function (m) {
		if (m.type === "MeshParticlesMaterial")
			return new THREE.MeshParticlesMaterial(m);
		else if (m.type === "MeshT4M3Material")
			return new THREE.MeshT4M3Material(m);
		else if (m.type == "MeshT4M2Material")
			return new THREE.MeshT4M2Material(m);
		else if (m.type == "MeshStandardMaterial")
			return new THREE.MeshStandardMaterial(m);
		else
			return new THREE.MeshBasicMaterial(m);
	};

	THREE.Mesh.prototype.setMaterial = function (material, index) {
		if (this._isDestroy) return;
		if (Array.isArray(material)) {
			this.material = [];
			for (var i = 0; i < material.length; i++)
				this.material = this.createMaterial(material[i]);
		} else if (index != undefined) {
			if (!Array.isArray(this.material))
				this.material = [];
			this.material[index] = this.createMaterial(material);
		} else
			this.material = this.createMaterial(material);

		this.checkTextureReady();
	};

	THREE.Mesh.prototype.setBoundVisible = function () {
		if (!this.geometry.boundingBox) {
			this.geometry.computeBoundingBox();
			this.bound = this.geometry.boundingBox
		}
		this.bHelper = new THREE.BoundHelper(this);
		this.bHelper.material.linewidth = 3;
		this.bHelper.visible = true;
		if (this.bHelper)
			this.add(this.bHelper);
	}


	THREE.Mesh.prototype.setTexture = function (texture, key, index) {
		var target;

		if (this._isDestroy) return;

		if (index >= 0)
			target = this.material[index];
		else
			target = this.material;

		target[key] = texture;
		target.needsUpdate = true;

		this.checkTextureReady(); //检查纹理是否全部就绪
	};

	THREE.Mesh.prototype.setGeometry = function (geo) {
		this.geometry = geo;
		this.geoReadyOk();
	};

	THREE.Mesh.prototype.checkTextureReady = function () {
		if (!this.material)
			return false;

		var materials = [];
		if (!Array.isArray(this.material)) {
			materials[0] = this.material;
		} else {
			materials = this.material;
		}

		var mapReady = function (map) {
			if (map === undefined || map === null || (map.image && map.image.width > 0)) {
				return true;
			}
			return false;
		}

		for (var i = 0; i < materials.length; i++) {
			var material = materials[i];
			if (material instanceof THREE.MeshBasicMaterial) {
				if (mapReady(material.map) && mapReady(material.lightMap))
					continue;
			} else if (material instanceof THREE.MeshT4M2Material) {
				if (mapReady(material._Control) && mapReady(material._Splat0) && mapReady(material._Splat1) && mapReady(material.lightMap))
					continue;
			} else if (material instanceof THREE.MeshT4M3Material) {
				if (mapReady(material._Control) && mapReady(material._Splat0) && mapReady(material._Splat1) && mapReady(material._Splat2))
					continue;
			} else if (material instanceof THREE.MeshParticlesMaterial) {
				if (mapReady(material.map))
					continue;
			} else if (material instanceof THREE.MeshStandardMaterial) {
				if (mapReady(material.AMSMap) && mapReady(material.NAHMap) && mapReady(material.EmissionMap) && mapReady(material.lightMap))
					continue;
			} else {
				throw "暂不支持材质类型！";
			}

			return false;
		}

		this.textureReadyOk();
		return true;
	}

	THREE.Mesh.prototype.setDrawMode = function (value) {

		this.drawMode = value;

	};

	// PI_BEGIN

	THREE.Mesh.prototype.setGray = function (isGray) {
		this.isGray = isGray ? 1 : 0
	};

	// PI_END

	THREE.Mesh.prototype.updateMorphTargets = function () {

		if (this.geometry.morphTargets !== undefined && this.geometry.morphTargets.length > 0) {

			this.morphTargetBase = -1;
			this.morphTargetInfluences = [];
			this.morphTargetDictionary = {};

			for (var m = 0, ml = this.geometry.morphTargets.length; m < ml; m++) {

				this.morphTargetInfluences.push(0);
				this.morphTargetDictionary[this.geometry.morphTargets[m].name] = m;

			}

		}

	};

	THREE.Mesh.prototype.getMorphTargetIndexByName = function (name) {

		if (this.morphTargetDictionary[name] !== undefined) {

			return this.morphTargetDictionary[name];

		}

		console.warn('THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.');

		return 0;

	};

	THREE.Mesh.prototype.dispose = function () {

		THREE.Object3D.prototype.dispose.call(this);

		if (Array.isArray(this.material)) {
			for (var i = 0; i < this.material.length; ++i) {
				this.material[i].dispose();
			}
		} else if (this.material) {
			this.material.dispose();
		}

		this.material = undefined;

	};

	THREE.Mesh.prototype.raycast = (function () {

		var inverseMatrix = new THREE.Matrix4();
		var ray = new THREE.Ray();
		var sphere = new THREE.Sphere();

		var vA = new THREE.Vector3();
		var vB = new THREE.Vector3();
		var vC = new THREE.Vector3();

		var tempA = new THREE.Vector3();
		var tempB = new THREE.Vector3();
		var tempC = new THREE.Vector3();

		var uvA = new THREE.Vector2();
		var uvB = new THREE.Vector2();
		var uvC = new THREE.Vector2();

		var barycoord = new THREE.Vector3();

		var intersectionPoint = new THREE.Vector3();
		var intersectionPointWorld = new THREE.Vector3();

		function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {

			THREE.Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);

			uv1.multiplyScalar(barycoord.x);
			uv2.multiplyScalar(barycoord.y);
			uv3.multiplyScalar(barycoord.z);

			uv1.add(uv2).add(uv3);

			return uv1.clone();

		}

		function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {

			var intersect;
			var material = object.material;

			// PI_BEGIN
			if (!object.geometry instanceof THREE.PlaneBufferGeometry && material.side === THREE.BackSide) {
				// PI_END

				intersect = ray.intersectTriangle(pC, pB, pA, true, point);

			} else {

				intersect = ray.intersectTriangle(pA, pB, pC, material.side !== THREE.DoubleSide, point);

			}

			if (intersect === null) return null;

			intersectionPointWorld.copy(point);
			intersectionPointWorld.applyMatrix4(object.matrixWorld);

			var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);

			if (distance < raycaster.near || distance > raycaster.far) return null;

			return {
				distance: distance,
				point: intersectionPointWorld.clone(),
				object: object
			};

		}

		function checkBufferGeometryIntersection(object, raycaster, ray, positions, uvs, a, b, c) {

			vA.fromArray(positions, a * 3);
			vB.fromArray(positions, b * 3);
			vC.fromArray(positions, c * 3);

			var intersection = checkIntersection(object, raycaster, ray, vA, vB, vC, intersectionPoint);

			if (intersection) {

				if (uvs) {

					uvA.fromArray(uvs, a * 2);
					uvB.fromArray(uvs, b * 2);
					uvC.fromArray(uvs, c * 2);

					intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);

				}

				intersection.face = new THREE.Face3(a, b, c, THREE.Triangle.normal(vA, vB, vC));
				intersection.faceIndex = a;

			}

			return intersection;

		}

		return function raycast(raycaster, intersects) {

			var geometry = this.geometry;
			var material = this.material;
			var matrixWorld = this.matrixWorld;

			if (material === undefined) return;

			// Checking boundingSphere distance to ray

			// if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			// sphere.copy( geometry.boundingSphere );
			// sphere.applyMatrix4( matrixWorld );

			// if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

			//

			inverseMatrix.getInverse(matrixWorld);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			// Check boundingBox before continuing

			if (geometry.boundingBox === null) geometry.computeBoundingBox();

			if (ray.intersectsBox(geometry.boundingBox) === false) return;

			var uvs, intersection;

			if (geometry instanceof THREE.BufferGeometry) {

				var a, b, c;
				var index = geometry.index;
				var attributes = geometry.attributes;
				var positions = attributes.position.array;

				// if ( attributes.uv !== undefined ) {

				// 	uvs = attributes.uv.array;

				// }

				if (index !== null) {

					var indices = index.array;

					for (var i = 0, l = indices.length; i < l; i += 3) {

						a = indices[i];
						b = indices[i + 1];
						c = indices[i + 2];

						intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, undefined, a, b, c);

						if (intersection) {

							intersection.faceIndex = Math.floor(i / 3); // triangle number in indices buffer semantics
							intersects.push(intersection);

						}

					}

				} else {


					for (var i = 0, l = positions.length; i < l; i += 9) {

						a = i / 3;
						b = a + 1;
						c = a + 2;

						intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, undefined, a, b, c);

						if (intersection) {

							intersection.index = a; // triangle number in positions buffer semantics
							intersects.push(intersection);

						}

					}

				}

				if (intersects.length === 0) {
					THREE.Object3D.prototype.raycast.call(this, raycaster, intersects);
				}
			} else if (geometry instanceof THREE.Geometry) {

				var fvA, fvB, fvC;
				var vertices = geometry.vertices;
				var faces = geometry.faces;
				var faceVertexUvs = geometry.faceVertexUvs[0];
				if (faceVertexUvs.length > 0) uvs = faceVertexUvs;

				for (var f = 0, fl = faces.length; f < fl; f++) {

					var face = faces[f];
					var faceMaterial = material;

					if (faceMaterial === undefined) continue;

					fvA = vertices[face.a];
					fvB = vertices[face.b];
					fvC = vertices[face.c];

					if (faceMaterial.morphTargets === true) {

						var morphTargets = geometry.morphTargets;
						var morphInfluences = this.morphTargetInfluences;

						vA.set(0, 0, 0);
						vB.set(0, 0, 0);
						vC.set(0, 0, 0);

						for (var t = 0, tl = morphTargets.length; t < tl; t++) {

							var influence = morphInfluences[t];

							if (influence === 0) continue;

							var targets = morphTargets[t].vertices;

							vA.addScaledVector(tempA.subVectors(targets[face.a], fvA), influence);
							vB.addScaledVector(tempB.subVectors(targets[face.b], fvB), influence);
							vC.addScaledVector(tempC.subVectors(targets[face.c], fvC), influence);

						}

						vA.add(fvA);
						vB.add(fvB);
						vC.add(fvC);

						fvA = vA;
						fvB = vB;
						fvC = vC;

					}

					intersection = checkIntersection(this, raycaster, ray, fvA, fvB, fvC, intersectionPoint);

					if (intersection) {

						if (uvs) {

							var uvs_f = uvs[f];
							uvA.copy(uvs_f[0]);
							uvB.copy(uvs_f[1]);
							uvC.copy(uvs_f[2]);

							intersection.uv = uvIntersection(intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC);

						}

						intersection.face = face;
						intersection.faceIndex = f;
						intersects.push(intersection);

					}

				}

			}

		};

	}());

	THREE.Mesh.prototype.clone = function () {

		return new this.constructor(this.geometry, this.material).copy(this);

	};

	THREE.Mesh.prototype.checkReady = function () {
		if (this.textureReady && this.geoReady) {
			this.ready = true;
			THREE.Object3D.prototype.checkReady.call(this);
		}
	};

	THREE.Mesh.prototype.geoReadyOk = function () {
		this.geoReady = true;
		this.checkReady();
	};
	THREE.Mesh.prototype.textureReadyOk = function () {
		this.textureReady = true;
		this.checkReady();
	};
	// File:../dev/three/objects/Bone.js

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author ikerr / http://verold.com
	 */

	THREE.Bone = function () {

		THREE.Object3D.call(this);

		this.type = 'Bone';

	};

	THREE.Bone.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Bone.prototype.constructor = THREE.Bone;

	THREE.Bone.prototype.copy = function (source) {

		THREE.Object3D.prototype.copy.call(this, source);

		return this;

	};
	// File:../dev/three/objects/Skeleton.js

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author michael guerrero / http://realitymeltdown.com
	 * @author ikerr / http://verold.com
	 */

	THREE.Skeleton = function (root, bones, boneInverses) {

		this.root = root;
		this.identityMatrix = new THREE.Matrix4();

		// copy the bone array

		bones = bones || [];
		this.bones = bones;

		// create a bone texture or an array of floats
		this.boneMatrices = [];
		for (var i = 0; i < this.bones.length; ++i) {
			this.boneMatrices.push(new THREE.Matrix4());
		}

		// use the supplied bone inverses or calculate the inverses
		this.calculateInverses(root);

	};

	THREE.Skeleton.prototype.calculateInverses = function (root) {

		this.boneInverses = [];

		for (var b = 0, bl = this.bones.length; b < bl; b++) {

			var inverse = new THREE.Matrix4();

			if (this.bones[b]) {
				inverse.getInverse(this.bones[b].matrixWorld);
				inverse.multiplyMatrices(inverse, this.root.matrixWorld);
			}

			this.boneInverses.push(inverse);
		}
	};

	THREE.Skeleton.prototype.dispose = function () {
		delete this.bones;
	};

	THREE.Skeleton.prototype.update = (function () {

		var invMat = new THREE.Matrix4();

		return function update() {

			// flatten bone matrices to array
			invMat.getInverse(this.root.matrixWorld);

			for (var b = 0, bl = this.bones.length; b < bl; b++) {

				// compute the offset between the current and the original transform
				var matrix = this.bones[b] ? this.bones[b].matrixWorld : this.identityMatrix;
				this.boneMatrices[b].multiplyMatrices(matrix, this.boneInverses[b]);
				this.boneMatrices[b].multiplyMatrices(invMat, this.boneMatrices[b]);
			}
		};

	})();

	THREE.Skeleton.prototype.clone = function () {

		return new THREE.Skeleton(this.root, this.bones, this.boneInverses);

	};
	// File:../dev/three/objects/SkinnedMesh.js

	THREE.SkinnedMesh = function (geometry, material) {

		THREE.Mesh.call(this, geometry, material);
		this.skeletonRef = undefined; //骨骼引用

		this.maxBones = 0;
		this.useVertexTexture = false; // 用不用顶点纹理
		this.skeletonReady = false;
	}

	THREE.SkinnedMesh.prototype = Object.create(THREE.Mesh.prototype);
	THREE.SkinnedMesh.prototype.constructor = THREE.SkinnedMesh;

	THREE.SkinnedMesh.prototype.setUseVertexTexture = function (useVertexTexture) {
		this.useVertexTexture = useVertexTexture;
	}

	THREE.SkinnedMesh.prototype.setMaxBones = function (num) {
		this.maxBones = num;
	}

	THREE.SkinnedMesh.prototype.updateMatrixWorld = function (force) {
		if (this.skeletonRef) {
			this.updateMatrix();
			if (this.parent) {
				this.matrixWorld.copy(this.parent.matrixWorld);
			} else {
				this.matrixWorld.copy(this.matrix);
			}
		} else {
			THREE.Mesh.prototype.updateMatrixWorld.call(this, force);
		}
	}

	THREE.SkinnedMesh.prototype._findBoundBone = function () {
		if (this.skeletonRef && typeof this.boundBone === "string") {
			var bones = this.skeletonRef.bones;

			this.skeletonRef.root.updateMatrixWorld(true);
			for (var i = 0; i < bones.length; ++i) {
				if (bones[i].name === this.boundBone) {
					this.boundBone = bones[i];
					break;
				}
			}
		}
	}

	THREE.SkinnedMesh.prototype.raycast = (function () {

		var ray = new THREE.Ray();
		var inverseMatrix = new THREE.Matrix4();

		return function (raycaster, intersects) {

			if (typeof this.boundBone === "string") return;

			inverseMatrix.getInverse(this.boundBone.matrixWorld);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			if (ray.intersectsBox(this.bound) === false) return;

			intersects.push({
				object: this
			});
		}
	}());

	/**
	 * 设置包围盒和影响那个包围盒的骨头
	 * rootBone：骨头的字符串
	 */
	THREE.SkinnedMesh.prototype.setBoundBone = function (bound, rootBone) {
		if (this._isDestroy) return;
		var max = new THREE.Vector3(bound[0][0], bound[0][1], bound[0][2]);
		var min = new THREE.Vector3(bound[1][0], bound[1][1], bound[1][2]);
		this.bound = new THREE.Box3(min, max);
		this.boundBone = rootBone;
		this._findBoundBone();
	}


	THREE.SkinnedMesh.prototype.setBoundVisible = function () {
		this.bHelper = new THREE.BoundHelper(this);
		this.bHelper.material.linewidth = 3;
		this.bHelper.visible = true;
	}

	THREE.SkinnedMesh.prototype.setSkeleton = function (skeletonRef, boneIndexs) {
		if (this._isDestroy) return;
		this.skeletonRef = skeletonRef;
		this.boneIndexs = boneIndexs;
		this._findBoundBone();
		if (this.bHelper)
			this.boundBone.add(this.bHelper);

		if (this.maxBones >= boneIndexs.length) {
			this.useVertexTexture = false;
		}

		if (!this.useVertexTexture) {
			this.boneMatrices = new Float32Array(16 * boneIndexs.length);
		} else {

			// layout (1 matrix = 4 pixels)
			//      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
			//  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
			//       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
			//       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
			//       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)


			var size = Math.sqrt(boneIndexs.length * 4); // 4 pixels needed for 1 matrix
			size = THREE.Math.nextPowerOfTwo(Math.ceil(size));
			size = Math.max(size, 4);

			this.boneTextureWidth = size;
			this.boneTextureHeight = size;

			this.boneMatrices = new Float32Array(this.boneTextureWidth * this.boneTextureHeight * 4); // 4 floats per RGBA pixel
			this.boneTexture = new THREE.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType);

		}

		if (!Array.isArray(this.material)) {
			this.material.skinning = true;
		} else {
			for (var i = 0; i < this.material.length; ++i) {
				this.material[i].skinning = true;
			}
		}

		this.skeletonReadyOk();
	};

	THREE.SkinnedMesh.prototype.clone = function () {
		return new this.constructor(this.geometry, this.material).copy(this);
	}

	THREE.SkinnedMesh.prototype.dispose = function () {
		THREE.Mesh.prototype.dispose.call(this);
		if (this.boneTexture) {
			//this.boneTexture.dispose();
			delete this.boneTexture;
		}
	}
	THREE.SkinnedMesh.prototype.checkReady = function () {
		if (this.skeletonReady) {
			THREE.Mesh.prototype.checkReady.call(this);
		}
	};

	THREE.SkinnedMesh.prototype.skeletonReadyOk = function () {
		this.skeletonReady = true;
		this.checkReady();
	};
	// File:../dev/three/objects/Terrain.js


	// PI_BEGIN

	THREE.TerrainNoise = function (width, height) {

		var scope = this;

		scope._vs = THREE.ShaderChunk['terrain_vertex'];
		scope._fs = THREE.ShaderChunk['terrain_noise_fragment'];

		scope._width = width;
		scope._height = height;

		scope._target = new THREE.WebGLRenderTarget(width, height, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat
		});

		scope._texture = scope._target.texture;
		scope._texture.generateMipmaps = false;
		scope._texture.minFilter = scope._texture.magFilter = THREE.LinearFilter;

		var uniforms = {
			frequency: {
				type: "v3",
				value: new THREE.Vector3(4.0, 4.0, 4.0)
			},
			size: {
				type: "v2",
				value: new THREE.Vector2(width, height)
			},
			seed: {
				type: "v4",
				value: new THREE.Vector4(3, 17, 53, 97)
			},
			coff: {
				type: "v4",
				value: new THREE.Vector4(0.1, 0.0, 0.1, 0.0)
			},
			clamp: {
				type: "v3",
				value: new THREE.Vector3(0.1, 0.0, 0.8)
			}
		};

		scope._material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: scope._vs,
			fragmentShader: scope._fs,
		});

		scope._material.fog = false;

		// MESH

		scope._scene = new THREE.Scene();

		scope._geometry = new THREE.PlaneBufferGeometry(width, height);

		scope._quad = new THREE.Mesh(scope._geometry, scope._material);
		scope._quad.position.z = 1.0;

		scope._scene.add(scope._quad);

		var w = width / 2,
			h = height / 2;
		scope._camera = new THREE.OrthographicCamera(-w, w, h, -h, -10000, 10000);
	};

	THREE.TerrainNoise.prototype = {

		constructor: THREE.TerrainNoise,

		dispose: function () {
			//this._geometry.dispose();
			this._quad.dispose();
			this._target.dispose();
		},

		getTexture: function () {
			return this._texture;
		},

		setSeed: function (x, y, z, w) {
			var value = this._material.uniforms.seed.value;
			value.set(x, y, z, w);
		},

		setCoff: function (c1, l1, c2, l2) {
			var value = this._material.uniforms.coff.value;
			value.set(c1, l1, c2, l2);
		},

		setFrequency: function (f1, f2, f3) {
			var value = this._material.uniforms.frequency.value;
			value.set(f1, f2, f3);
		},

		setClamp: function (one, zero, middle) {
			var value = this._material.uniforms.clamp.value;
			value.set(one, zero, middle);
		},

		update: function (renderer, pos) {
			if (pos) {
				this._quad.position.setX(pos.x);
				this._quad.position.setY(pos.y);
			}
			renderer.render(this._scene, this._camera, 0, this._target, true);
		}
	};

	// Terrain

	THREE.Terrain = function (width, height, blendW, blendH) {

		var scope = this;

		THREE.Object3D.call(scope);

		scope._vs = THREE.ShaderChunk['terrain_vertex'];
		scope._fs = THREE.ShaderChunk['terrain_fragment'];

		scope._width = width;
		scope._height = height;

		// Blend
		scope._noise = new THREE.TerrainNoise(blendW, blendH);

		var uniforms = {

			fogDensity: {
				type: "1f",
				value: 10
			},

			fogNear: {
				type: "1f",
				value: 1
			},

			fogFar: {
				type: "1f",
				value: 200
			},

			fogColor: {
				type: "c",
				value: new THREE.Color(0x0000FF)
			},

			tex1: {
				type: "t"
			},
			texSize1: {
				type: "v2",
				value: new THREE.Vector2(1, 1)
			},

			tex2: {
				type: "t"
			},
			texSize2: {
				type: "v2",
				value: new THREE.Vector2(1, 1)
			},

			tex3: {
				type: "t"
			},
			texSize3: {
				type: "v2",
				value: new THREE.Vector2(1, 1)
			},

			blend: {
				type: "t",
				value: scope._noise.getTexture()
			},

			size: {
				type: "v2",
				value: new THREE.Vector2(scope._width, scope._height)
			},

			mShininess: {
				type: "1f",
				value: 1
			},
			mAmbient: {
				type: "v3",
				value: new THREE.Vector3(1, 1, 1)
			},
			mDiffuse: {
				type: "v3",
				value: new THREE.Vector3(1, 1, 1)
			},
			mSpecular: {
				type: "v3",
				value: new THREE.Vector3(1, 1, 1)
			},

			ambientLightColor: {
				type: "3fv",
				value: []
			},

			directionalLights: {
				type: "sa",
				value: [],
				properties: {
					direction: {
						type: "v3"
					},
					diffuse: {
						type: "v3"
					},
					specular: {
						type: "v3"
					}
				}
			},

			spotLights: {
				type: "sa",
				value: [],
				properties: {
					position: {
						type: "v3"
					},
					"startAtten": {
						type: "1f"
					},
					"endAtten": {
						type: "1f"
					},
					spotDirection: {
						type: "v3"
					},
					spotCosCutoff: {
						type: "1f"
					},
					spotExponent: {
						type: "1f"
					},
					diffuse: {
						type: "v3"
					},
					specular: {
						type: "v3"
					}
				}
			},

			pointLights: {
				type: "sa",
				value: [],
				properties: {
					position: {
						type: "v3"
					},
					"startAtten": {
						type: "1f"
					},
					"endAtten": {
						type: "1f"
					},
					diffuse: {
						type: "v3"
					},
					specular: {
						type: "v3"
					}
				}
			},
		};

		scope._texs = [{
			tex: uniforms.tex1,
			size: uniforms.texSize1
		}, {
			tex: uniforms.tex2,
			size: uniforms.texSize2
		}, {
			tex: uniforms.tex3,
			size: uniforms.texSize3
		}];

		scope._material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: scope._vs,
			fragmentShader: scope._fs
		});

		scope._material.map = {};
		scope._material.fog = true;

		// Mesh
		var w = scope._width,
			h = scope._height;

		// [-w/2, -h/2] ~ [w/2, h/2]
		var geometry = new THREE.PlaneBufferGeometry(w, h);

		scope._rayMesh = scope._mesh = new THREE.Mesh(geometry, scope._material);
		scope.rotation.x = -Math.PI / 2;
		scope.add(scope._mesh);
	};

	THREE.Terrain.prototype = Object.create(THREE.Object3D.prototype);

	THREE.Terrain.prototype.constructor = THREE.Terrain;

	THREE.Terrain.prototype.setTextureIsReady = function () {
		this._material.map.isReady = true;
		this.ready = true;
		this.textureReady = true;
	}

	THREE.Terrain.prototype.dispose = function () {

		this.remove(this._mesh);
		//this._mesh.geometry.dispose();

		delete this._texs;
		delete this._material;

		this._mesh.material.dispose();
		this._noise.dispose();

		this.parent && this.parent.remove(this);
	};

	THREE.Terrain.prototype.raycast = function (raycaster, intersects) {
		if (intersects.length > 0) {
			return;
		}

		THREE.Mesh.prototype.raycast.call(this._mesh, raycaster, intersects);

		if (intersects.length > 0) {
			intersects[0].object = this;
		}
	};

	THREE.Terrain.prototype.getMesh = function () {
		return this._mesh;
	};

	THREE.Terrain.prototype.setTexture = function (index, texture) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;

		this._texs[index].size.value.set(texture.image.width, texture.image.height);
		this._texs[index].tex.value = texture;

	};

	THREE.Terrain.prototype.setBlendSeed = function (x, y, z, w) {
		this._noise.setSeed(x, y, z, w);
	};

	THREE.Terrain.prototype.setBlendCoff = function (c1, l1, c2, l2) {
		this._noise.setCoff(c1, l1, c2, l2);
	};

	THREE.Terrain.prototype.setBlendFrequency = function (f1, f2, f3) {
		this._noise.setFrequency(f1, f2, f3);
	};

	THREE.Terrain.prototype.setBlendClamp = function (one, zero, middle) {
		this._noise.setClamp(one || 0.1, zero || 0.0, middle || 0.8);
	};

	// renderer: THREE.Renderer
	THREE.Terrain.prototype.updateBlend = function (renderer, pos) {
		this._noise.update(renderer, pos);
	};

	// PI_END
	// File:../dev/three/objects/Sprite.js

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Sprite = (function () {

		var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
		var vertices = new Float32Array([-1, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0]);
		var uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

		var geometry = new THREE.BufferGeometry();
		geometry.setIndex(new THREE.BufferAttribute(indices, 1));
		geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

		return function Sprite(material) {

			THREE.Object3D.call(this);

			this.type = 'Sprite';

			this.geometry = geometry;
			this.material = (material !== undefined) ? material : new THREE.SpriteMaterial();

		};

	})();

	THREE.Sprite.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Sprite.prototype.constructor = THREE.Sprite;

	// PI_BEGIN
	THREE.Sprite.prototype.getMaterial = function () {
		return this.material;
	};
	// PI_END

	THREE.Sprite.prototype.raycast = (function () {

		var matrixPosition = new THREE.Vector3();

		return function raycast(raycaster, intersects) {

			matrixPosition.setFromMatrixPosition(this.matrixWorld);

			var distanceSq = raycaster.ray.distanceSqToPoint(matrixPosition);
			var guessSizeSq = this.scale.x * this.scale.y / 4;

			if (distanceSq > guessSizeSq) {

				return;

			}

			intersects.push({

				distance: Math.sqrt(distanceSq),
				point: this.position,
				face: null,
				object: this

			});

		};

	}());

	THREE.Sprite.prototype.clone = function () {

		return new this.constructor(this.material).copy(this);

	};

	// Backwards compatibility

	THREE.Particle = THREE.Sprite;

	// File:../dev/three/objects/Text2D.js

	// PI_BEGIN

	/**
	 * options = {
	 *     font: "",
	 *     fillStyle: "#FFFFFF",
	 *     align: (0,0)
	 *     antialias: true
	 * }
	 */
	THREE.Text2D = function (textCon, resTab, GeometryRes, TextureRes, drawFun) {
		var textcfg = textCon.textcfg || {};

		THREE.Object3D.call(this);

		this._antialias = false;
		this._align = new THREE.Vector2(0, 0);

		this.text = textcfg.text;
		this.type = "Text2D";

		if (this.text !== "") {
			this.updateText(textCon, resTab, GeometryRes, TextureRes, drawFun);
		}
		this.ready = true;
		this.textureReady = true;
		this.geoReady = true;
	};

	THREE.Text2D.prototype = Object.create(THREE.Object3D.prototype);

	THREE.Text2D.prototype.constructor = THREE.Text2D;

	THREE.Text2D.prototype.getMaterial = function () {
		return this._material;
	};

	THREE.Text2D.prototype._getTexture = function (textcfg, resTab, TextureRes, drawFun) {
		//drawFun.destroyImgText(this.textcfg);

		var hash = drawFun.getImgTextKey(textcfg, "texture");
		var res = resTab.get(hash);
		if (res) return res.link;

		var texture;
		var textData = drawFun.drawText(textcfg);
		var canvas = textData[0];
		var cfg = textData[2];
		texture = new THREE.Texture(canvas);

		texture._textWidth = cfg.textWidth
		texture._textHeight = cfg.textHeight
		texture._canvasWidth = canvas.width;
		texture._canvasHeight = canvas.height;

		canvas = undefined;

		resTab.createRes(hash, "texture", undefined, TextureRes, texture);

		return texture;
	};

	var createPlane = function (resTab, GeometryRes, w, h, cw, ch, alignModHorizon, alignModVertical) {

		var key = "geometry" + "-Plane:" + w + "," + h + "," + cw + "," + ch + "," + alignModHorizon + "," + alignModVertical;
		var res = resTab.get(key);
		if (res) return res.link;

		var plane = new THREE.PlaneBufferGeometry(w, h, cw, ch, alignModHorizon, alignModVertical);
		resTab.createRes(key, "geometry", undefined, GeometryRes, plane);

		return plane;
	}

	THREE.Text2D.prototype.setText = function (textCon, resTab, GeometryRes, TextureRes, drawFun) {
		if (this.text !== textCon.show) {
			this.text = textCon.show;
			this.updateText(textCon, resTab, GeometryRes, TextureRes, drawFun);
		}
	}

	THREE.Text2D.prototype.setColor = function (textCon, resTab, GeometryRes, TextureRes, drawFun) {
		if (this.color !== textCon.textcfg.color) {
			this.color = textCon.textcfg.color;
			this.updateText(textCon, resTab, GeometryRes, TextureRes, drawFun);
		}
	}

	THREE.Text2D.prototype.updateText = function (textCon, resTab, GeometryRes, TextureRes, drawFun) {

		this.dispose();

		if (!this.text) {
			this.visible = false;
			return;
		} else
			this.visible = true;


		var textcfg = {};
		for (var k in textCon.textcfg) {
			if (textCon.textcfg.hasOwnProperty(k))
				textcfg[k] = textCon.textcfg[k];
		}

		this._texture = this._getTexture(textcfg, resTab, TextureRes, drawFun);
		this._texture.needsUpdate = true;
		this.applyAntiAlias()

		if (!this._material) {
			this._material = new THREE.MeshBasicMaterial({
				map: this._texture
			});

			this._material.transparent = true;
			this._material.needsUpdate = true;
		} else {
			this._material.map = this._texture;
			this._material.needsUpdate = true;
		}

		this._material.map.isReady = true;

		var w = this._texture._canvasWidth; // canvas._canvas.width;
		var h = this._texture._canvasHeight; // canvas._canvas.height;

		var alignModHorizon = textCon.horizontalAlign;
		var alignModVertical = textCon.verticalAlign;

		var textalign = textcfg.textAlign;
		if (textalign === undefined)
			textalign = THREE.AlignModHorizontalLeft;
		if (alignModHorizon === undefined)
			alignModHorizon = textalign;
		if (alignModVertical === undefined)
			alignModVertical = THREE.AlignModVerticalTop;

		if (!this._sprite) {

			var g = createPlane(resTab, GeometryRes, w, h, 1, 1, alignModHorizon, alignModVertical);
			this._sprite = new THREE.Mesh(g, this._material);
			this.add(this._sprite);
			if (this.tranformChange) {
				this.tranformChange(this);
			}
		}
	};

	THREE.Text2D.prototype.dispose = function () {
		if (this._material) {
			this._material.dispose();
			delete this._material;
		}

		if (this._texture) {
			delete this._texture;
		}

		this.remove(this._sprite);
		delete this._sprite;
	};

	THREE.Text2D.prototype.applyAntiAlias = function () {
		if (this._antialias === false) {
			this._texture.magFilter = THREE.NearestFilter
			this._texture.minFilter = THREE.LinearMipMapLinearFilter
		}
	};

	// PI_END
	// File:../dev/three/objects/ImageText.js

	// PI_BEGIN

	THREE.ImageText = function () {
		var scope = this;
		THREE.Object3D.call(scope);

		scope._material = new THREE.MeshBasicMaterial();
		scope._material.transparent = true;
		scope.type = "ImageText";
		//scope._material.needsUpdate = true;

	};

	THREE.ImageText.prototype = Object.create(THREE.Object3D.prototype);

	THREE.ImageText.prototype.constructor = THREE.ImageText;

	THREE.ImageText.prototype.setTexture = function (tex) {
		if (tex !== this._material.map) {
			this._material.map = tex;
			this._material.needsUpdate = true;
		}
		this.textureReady = true;
		this.checkReady();
	};

	THREE.ImageText.prototype.dispose = function () {
		THREE.Object3D.prototype.dispose.call(this);
		if (this._material) {
			this._material.dispose();
		}

		if (this._mesh) {
			this.remove(this._mesh);
			delete this._mesh;
		}

		if (this._rayMesh) {
			this.remove(this._rayMesh);
			delete this._rayMesh;
		}

		// if(this._geometry){
		// 	this._geometry.dispose();//没有缓存在resTab中，需要dispose
		// }
	};

	THREE.ImageText.prototype.raycast = (function () {

		var ray = new THREE.Ray();
		var inverseMatrix = new THREE.Matrix4();

		return function (raycaster, intersects) {

			inverseMatrix.getInverse(this.matrixWorld);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			if (ray.intersectsBox(this._geometry.boundingBox) === false) return;

			intersects.push({
				object: this
			});
		}
	}());


	THREE.ImageText.prototype.setGeometry = function (geometry) {

		//this.dispose();	
		this._geometry = geometry;

		this._geometry.computeBoundingBox();
		this._mesh = new THREE.Mesh(geometry, this._material);
		this.add(this._mesh);
		if (this.tranformChange) {
			this.tranformChange(this);
		}
		THREE.Mesh.prototype.setGeometry(geometry);
	};

	/**
	 * @description 创建常用文字的几何体, 默认对齐方式为左上
	 * @param  {Array} coords 显示文字在 文字图片 上的uv坐标, 每个文字对应coords中的一个元素
	 * @param  {number} texW 纹理图片的宽度
	 * @param  {number} texH 纹理图片的高度
	 * @param  {number} width 文字几何体的宽度
	 * @param  {string} alignModHorizon 水平对齐方式
	 * @param  {string} alignModVertical 垂直对齐方式
	 * @param  {obj} textSize 空对象，几何体被创建完毕后，被赋予字体宽高
	 * @example
	 */
	THREE.ImageText.prototype.createTxPlaneBufferGeometry = function (coords, texW, texH, width, alignModHorizon, alignModVertical, textSize) {
		if (alignModHorizon !== THREE.AlignModHorizontalCenter && alignModHorizon !== THREE.AlignModHorizontalLeft && alignModHorizon !== THREE.AlignModHorizontalRight) {
			throw "不支持alignModHorizon：" + alignModHorizon;
		}

		if (alignModVertical !== THREE.AlignModVerticalCenter && alignModVertical !== THREE.AlignModVerticalButtom && alignModVertical !== THREE.AlignModVerticalTop) {
			throw "不支持alignModVertical：" + alignModVertical;
		}

		var textPlane = new THREE.BufferGeometry;
		var vertices = new Float32Array(coords.length * 4 * 3); //每个文字4个顶点，每个顶点都是一个3元素
		var uvs = new Float32Array(coords.length * 4 * 2); //每个顶点1个uv坐标，每个uv坐标是一个2元素

		var verticesOffset = 0; //顶点index偏移量
		var uvsOffset = 0; //uv坐标index偏移量

		//单个文字宽度, 单个文字高度, 显示文字宽度和, 循环过程中累计的字体宽度(换行重置为0),x偏移量,y偏移量, 单个字体的uv坐标
		var textW, textH, allW = 0,
			height = 0,
			tempW = 0,
			xOffset = 0,
			yOffset = 0,
			textUv

		for (var j = 0; j < coords.length; j++) {
			allW += (coords[j].u2 - coords[j].u1);
		}

		//几何体宽度
		if (width === undefined)
			width = allW;

		//几何体高度
		height += coords[0].v2 - coords[0].v1
		for (var i = 0; i < coords.length; i++) {
			textUv = coords[i];
			textW = textUv.u2 - textUv.u1; //
			if (tempW + textW > width) {
				tempW = 0;
				height += textUv.v2 - textUv.v1;
			}
			tempW += textW;
		}


		var resetxOffset = function () {
			if (alignModHorizon === THREE.AlignModHorizontalCenter)
				xOffset = width / 2;
			else if (alignModHorizon === THREE.AlignModHorizontalRight)
				xOffset = width;
		}
		resetxOffset(); //初始化x的起始偏移量

		//初始化y的起始偏移量
		if (alignModVertical === THREE.AlignModVerticalButtom)
			yOffset = height;
		else if (alignModVertical === THREE.AlignModVerticalCenter)
			yOffset = height / 2;

		for (var i = 0; i < coords.length; i++) {
			textUv = coords[i];
			textW = textUv.u2 - textUv.u1;
			textH = textUv.v2 - textUv.v1;

			if (tempW + textW > width) {
				tempW = 0;
				yOffset += -textH;
				resetxOffset();
			}

			//单个文字四个顶点的x,y坐标，uv坐标（左上角为第一点，顺序为顺时针）
			var vx = [xOffset, xOffset - textW, xOffset - textW, xOffset];
			var vy = [yOffset, yOffset, yOffset - textH, yOffset - textH];
			var ux = [textUv.u1, textUv.u2, textUv.u2, textUv.u1];
			var uy = [texH - textUv.v1, texH - textUv.v1, texH - textUv.v2, texH - textUv.v2];

			for (var j = 0; j < 4; j++) {

				vertices[verticesOffset] = vx[j];
				vertices[verticesOffset + 1] = vy[j];
				vertices[verticesOffset + 2] = 0;

				uvs[uvsOffset] = ux[j] / texW;
				uvs[uvsOffset + 1] = uy[j] / texH;

				verticesOffset += 3;
				uvsOffset += 2;
			}

			tempW += textW;
			xOffset -= textW;
		}

		textPlane.type = 'TextPlaneBufferGeometry';

		var offset = 0;
		//每个文字一个四边形，一个四边形被分为两个三角形，因此每个文字6个索引
		var indices = new((coords.length * 6) > 65535 ? Uint32Array : Uint16Array)(coords.length * 6);

		for (var k = 0; k < coords.length; k++) {

			var a = k * 4;
			var b = k * 4 + 1;
			var c = k * 4 + 2;
			var d = k * 4 + 3;

			indices[offset] = a;
			indices[offset + 1] = b;
			indices[offset + 2] = c;

			indices[offset + 3] = a;
			indices[offset + 4] = c;
			indices[offset + 5] = d;

			offset += 6;

		}

		textPlane.setIndex(new THREE.BufferAttribute(indices, 1));
		textPlane.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		textPlane.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

		textSize.width = width;
		textSize.height = height;

		return textPlane;
	};
	// File:../dev/three/objects/LensFlare.js

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.LensFlare = function (texture, size, distance, blending, color) {

		THREE.Object3D.call(this);

		this.lensFlares = [];

		this.positionScreen = new THREE.Vector3();
		this.customUpdateCallback = undefined;

		if (texture !== undefined) {

			this.add(texture, size, distance, blending, color);

		}

	};

	THREE.LensFlare.prototype = Object.create(THREE.Object3D.prototype);
	THREE.LensFlare.prototype.constructor = THREE.LensFlare;


	/*
	 * Add: adds another flare
	 */

	THREE.LensFlare.prototype.add = function (texture, size, distance, blending, color, opacity) {

		if (size === undefined) size = -1;
		if (distance === undefined) distance = 0;
		if (opacity === undefined) opacity = 1;
		if (color === undefined) color = new THREE.Color(0xffffff);
		if (blending === undefined) blending = THREE.NormalBlending;

		distance = Math.min(distance, Math.max(0, distance));

		this.lensFlares.push({
			texture: texture, // THREE.Texture
			size: size, // size in pixels (-1 = use texture.width)
			distance: distance, // distance (0-1) from light source (0=at light source)
			x: 0,
			y: 0,
			z: 0, // screen position (-1 => 1) z = 0 is in front z = 1 is back
			scale: 1, // scale
			rotation: 0, // rotation
			opacity: opacity, // opacity
			color: color, // color
			blending: blending // blending
		});

	};

	/*
	 * Update lens flares update positions on all flares based on the screen position
	 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
	 */

	THREE.LensFlare.prototype.updateLensFlares = function () {

		var f, fl = this.lensFlares.length;
		var flare;
		var vecX = -this.positionScreen.x * 2;
		var vecY = -this.positionScreen.y * 2;

		for (f = 0; f < fl; f++) {

			flare = this.lensFlares[f];

			flare.x = this.positionScreen.x + vecX * flare.distance;
			flare.y = this.positionScreen.y + vecY * flare.distance;

			flare.wantedRotation = flare.x * Math.PI * 0.25;
			flare.rotation += (flare.wantedRotation - flare.rotation) * 0.25;

		}

	};

	THREE.LensFlare.prototype.copy = function (source) {

		THREE.Object3D.prototype.copy.call(this, source);

		this.positionScreen.copy(source.positionScreen);
		this.customUpdateCallback = source.customUpdateCallback;

		for (var i = 0, l = source.lensFlares.length; i < l; i++) {

			this.lensFlares.push(source.lensFlares[i]);

		}

		return this;

	};

	// File:../dev/three/objects/LOD.js

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.LOD = function () {

		THREE.Object3D.call(this);

		this.type = 'LOD';

		Object.defineProperties(this, {
			levels: {
				enumerable: true,
				value: []
			}
		});

	};


	THREE.LOD.prototype = Object.create(THREE.Object3D.prototype);
	THREE.LOD.prototype.constructor = THREE.LOD;

	THREE.LOD.prototype.addLevel = function (object, distance) {

		if (distance === undefined) distance = 0;

		distance = Math.abs(distance);

		var levels = this.levels;

		for (var l = 0; l < levels.length; l++) {

			if (distance < levels[l].distance) {

				break;

			}

		}

		levels.splice(l, 0, {
			distance: distance,
			object: object
		});

		this.add(object);

	};

	THREE.LOD.prototype.getObjectForDistance = function (distance) {

		var levels = this.levels;

		for (var i = 1, l = levels.length; i < l; i++) {

			if (distance < levels[i].distance) {

				break;

			}

		}

		return levels[i - 1].object;

	};

	THREE.LOD.prototype.raycast = (function () {

		var matrixPosition = new THREE.Vector3();

		return function raycast(raycaster, intersects) {

			matrixPosition.setFromMatrixPosition(this.matrixWorld);

			var distance = raycaster.ray.origin.distanceTo(matrixPosition);

			this.getObjectForDistance(distance).raycast(raycaster, intersects);

		};

	}());

	THREE.LOD.prototype.update = function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function update(camera) {

			var levels = this.levels;

			if (levels.length > 1) {

				v1.setFromMatrixPosition(camera.matrixWorld);
				v2.setFromMatrixPosition(this.matrixWorld);

				var distance = v1.distanceTo(v2);

				levels[0].object.visible = true;

				for (var i = 1, l = levels.length; i < l; i++) {

					if (distance >= levels[i].distance) {

						levels[i - 1].object.visible = false;
						levels[i].object.visible = true;

					} else {

						break;

					}

				}

				for (; i < l; i++) {

					levels[i].object.visible = false;

				}

			}

		};

	}();

	THREE.LOD.prototype.copy = function (source) {

		THREE.Object3D.prototype.copy.call(this, source, false);

		var levels = source.levels;

		for (var i = 0, l = levels.length; i < l; i++) {

			var level = levels[i];

			this.addLevel(level.object.clone(), level.distance);

		}

		return this;

	};

	THREE.LOD.prototype.toJSON = function (meta) {

		var data = THREE.Object3D.prototype.toJSON.call(this, meta);

		data.object.levels = [];

		var levels = this.levels;

		for (var i = 0, l = levels.length; i < l; i++) {

			var level = levels[i];

			data.object.levels.push({
				object: level.object.uuid,
				distance: level.distance
			});

		}

		return data;

	};

	// File:../dev/three/scenes/Scene.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.Scene = function () {

		THREE.Object3D.call(this);

		this.type = 'Scene';
		this.fog = null;
		this.autoUpdate = true; // checked by the renderer
		this.dirts = [];
		this.animObjectMap = new Map();
		this.BulletinBoards = [];
		this.scene = this;
	};

	THREE.Scene.prototype = Object.create(THREE.Object3D.prototype);
	THREE.Scene.prototype.constructor = THREE.Scene;

	THREE.Scene.prototype.copy = function (source, recursive) {

		THREE.Object3D.prototype.copy.call(this, source, recursive);
		if (source.fog !== null) this.fog = source.fog.clone();
		this.autoUpdate = source.autoUpdate;
		this.matrixAutoUpdate = source.matrixAutoUpdate;

		return this;

	};

	// File:../dev/three/scenes/FogExp2.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.FogExp2 = function (color, density) {

		this.name = '';

		this.color = new THREE.Color(color);
		this.density = (density !== undefined) ? density : 0.00025;

	};

	THREE.FogExp2.prototype.clone = function () {

		return new THREE.FogExp2(this.color.getHex(), this.density);

	};

	// File:../dev/three/scenes/Fog.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.Fog = function (color, near, far) {

		this.name = '';

		this.color = new THREE.Color(color);

		this.near = (near !== undefined) ? near : 1;
		this.far = (far !== undefined) ? far : 1000;

	};

	THREE.Fog.prototype.clone = function () {

		return new THREE.Fog(this.color.getHex(), this.near, this.far);

	};

	// File:../dev/three/renderers/shaders/ShaderChunk.js

	THREE.ShaderChunk = {};
	// File:../dev/three/renderers/shaders/app/particles_mesh_vertex.glsl

	THREE.ShaderChunk['particles_mesh_vertex'] = "\n#ifdef USE_MAP\nvarying vec2 mapUV;\nuniform vec4 mapst;\n#endif\n#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n#include <common>\n#include <skinning_pars_vertex>\nvoid main ()\n{\n	#include <skinbase_vertex>\n	#include <begin_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n  #ifdef USE_MAP\n  mapUV = uv * mapst.xy + mapst.zw;\n  #endif\n	\n	#include <worldpos_vertex>\n  #ifdef USE_COLOR\n  vColor = color;\n  #endif\n}\n";

	// File:../dev/three/renderers/shaders/app/particles_mesh_fragment.glsl

	THREE.ShaderChunk['particles_mesh_fragment'] = "#include <common>\n#ifdef USE_MAP\nvarying vec2 mapUV;\nuniform sampler2D map;\n#endif\n#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\nuniform vec3 tintColor;\nuniform float tintOpacity;\nvoid main ()\n{\n	vec4 c = vec4(1.0, 1.0, 1.0, 1.0);\n	\n	#ifdef USE_MAP\n	c = texture2D (map, mapUV);\n	#endif\n	\n	#ifdef USE_COLOR\n	c = c * vColor;\n	#endif\n	gl_FragColor = 2.0 * (vec4(tintColor, tintOpacity) * c);\n}";

	// File:../dev/three/renderers/shaders/app/terrain_vertex.glsl

	THREE.ShaderChunk['terrain_vertex'] = "\nvarying vec3 vPosition;\n#include <common>\n#define USE_LIGHT\n#include <lights_basic_pars_vertex>\nvoid main( void ) {\n	vPosition = position;\n	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n	vec3 transformedNormal = normalMatrix * vec3( normal );\n	gl_Position = projectionMatrix * mvPosition;\n	\n	#include <lights_basic_vertex>\n}";

	// File:../dev/three/renderers/shaders/app/terrain_fragment.glsl

	THREE.ShaderChunk['terrain_fragment'] = "\n#define USE_LIGHT\n#include <common>\n#include <fog_pars_fragment>\n#include <lights_basic_pars_vertex>\nuniform sampler2D tex1;\nuniform sampler2D tex2;\nuniform sampler2D tex3;\nuniform sampler2D blend;\nuniform vec2 texSize1;\nuniform vec2 texSize2;\nuniform vec2 texSize3;\nuniform vec2 size;\nvarying vec3 vPosition;\nvoid main( void ) {\n	vec3 c1 = texture2D(tex1, 1.0 * vPosition.xy / texSize1).xyz;\n	vec3 c2 = texture2D(tex2, 1.0 * vPosition.xy / texSize2).xyz;\n	vec3 c3 = texture2D(tex3, 1.0 * vPosition.xy / texSize3).xyz;\n	vec2 coord = 0.5 + vec2(vPosition.xy / size);\n	\n	vec4 w = texture2D(blend, coord);\n	vec3 c = mix(c2, c3, w.y);\n	c = mix(c1, c, w.x);\n#if defined( USE_LIGHT )\n	c = vDiffuse.rgb * c + vSpecular.rgb;\n#endif\n	gl_FragColor = vec4(c, 1.0);\n	#include <fog_fragment>\n}";

	// File:../dev/three/renderers/shaders/app/terrain_t4m2_vertex.glsl

	THREE.ShaderChunk['terrain_t4m2_vertex'] = "\nattribute vec2 uv2;\nvarying vec2 controlUV;\nvarying vec2 splatUV0;\nvarying vec2 splatUV1;\nvarying vec2 vUV2;\nuniform vec4 _controlst;\nuniform vec4 _splat0st;\nuniform vec4 _splat1st;\nuniform vec4 lightmapst;\n#include <common>\n#include <lights_basic_pars_vertex>\nvoid main( void ) {\n	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n	vec3 transformedNormal = normalMatrix * vec3( normal );\n	gl_Position = projectionMatrix * mvPosition;\n	\n	controlUV = uv * _controlst.xy + _controlst.zw;\n	splatUV0 = uv * _splat0st.xy + _splat0st.zw;\n	splatUV1 = uv * _splat1st.xy + _splat1st.zw;\n	vUV2 = uv2 * lightmapst.xy + lightmapst.zw;\n}";

	// File:../dev/three/renderers/shaders/app/terrain_t4m2_fragment.glsl

	THREE.ShaderChunk['terrain_t4m2_fragment'] = "#include <common>\n#include <fog_pars_fragment>\nvarying vec2 controlUV;\nvarying vec2 splatUV0;\nvarying vec2 splatUV1;\nvarying vec2 vUV2;\nuniform float lightMapIntensity;\nuniform sampler2D _splat0;\nuniform sampler2D _splat1;\nuniform sampler2D _control;\nuniform sampler2D lightMap;\nvoid main( void ) {\n	\n	vec4 c = texture2D (_control, controlUV);\n	vec4 lay0 = texture2D (_splat0, splatUV0);\n	vec4 lay1 = texture2D (_splat1, splatUV1);	\n	\n	gl_FragColor = lay0 * c.r + lay1 * c.g;\n	gl_FragColor.a = 1.0;\n	#if defined(USE_LIGHTMAP)\n		gl_FragColor.rgb *= 2.0 * texture2D( lightMap, vUV2 ).xyz * lightMapIntensity;\n	#endif\n}";

	// File:../dev/three/renderers/shaders/app/terrain_t4m3_vertex.glsl

	THREE.ShaderChunk['terrain_t4m3_vertex'] = "varying vec2 controlUV;\nvarying vec2 splatUV0;\nvarying vec2 splatUV1;\nvarying vec2 splatUV2;\nuniform vec4 _controlst;\nuniform vec4 _splat0st;\nuniform vec4 _splat1st;\nuniform vec4 _splat2st;\n#include <common>\nvoid main( void ) {\n	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n	gl_Position = projectionMatrix * mvPosition;\n	\n	controlUV = uv * _controlst.xy + _controlst.zw;\n	splatUV0 = uv * _splat0st.xy + _splat0st.zw;\n	splatUV1 = uv * _splat1st.xy + _splat1st.zw;\n  	splatUV2 = uv * _splat2st.xy + _splat2st.zw;\n}";

	// File:../dev/three/renderers/shaders/app/terrain_t4m3_fragment.glsl

	THREE.ShaderChunk['terrain_t4m3_fragment'] = "#include <common>\n#include <fog_pars_fragment>\nuniform sampler2D _control;\nuniform sampler2D _splat0;\nuniform sampler2D _splat1;\nuniform sampler2D _splat2;\nvarying vec2 controlUV;\nvarying vec2 splatUV0;\nvarying vec2 splatUV1;\nvarying vec2 splatUV2;\nvoid main( void ) {\n	\n	vec4 c = texture2D (_control, controlUV);\n	vec4 lay0 = texture2D (_splat0, splatUV0);\n	vec4 lay1 = texture2D (_splat1, splatUV1);\n	vec4 lay2 = texture2D (_splat2, splatUV2);\n	gl_FragColor = lay0 * c.r + lay1 * c.g + lay2 * c.b;\n	gl_FragColor.a = 1.0;\n}";

	// File:../dev/three/renderers/shaders/app/terrain_noise_fragment.glsl

	THREE.ShaderChunk['terrain_noise_fragment'] = "\nvarying vec3 vPosition;\nuniform vec4 seed;\nuniform vec2 size;\nuniform vec4 coff;uniform vec3 frequency;\nuniform vec3 clamp;\nvec3 random3(vec3 c) {\n	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));\n	vec3 r;\n	r.z = fract(512.0*j);\n	j *= .125;\n	r.x = fract(512.0*j);\n	j *= .125;\n	r.y = fract(512.0*j);\n	return r-0.5;\n}\nconst float F3 =  0.3333333;\nconst float G3 =  0.1666667;\nfloat simplex3d(vec3 p) {\n	 \n	 vec3 s = floor(p + dot(p, vec3(F3)));\n	 vec3 x = p - s + dot(s, vec3(G3));\n	 \n	 vec3 e = step(vec3(0.0), x - x.yzx);\n	 vec3 i1 = e*(1.0 - e.zxy);\n	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);\n	 	\n	 vec3 x1 = x - i1 + G3;\n	 vec3 x2 = x - i2 + 2.0*G3;\n	 vec3 x3 = x - 1.0 + 3.0*G3;\n	 \n	 vec4 w, d;\n	 \n	 w.x = dot(x, x);\n	 w.y = dot(x1, x1);\n	 w.z = dot(x2, x2);\n	 w.w = dot(x3, x3);\n	 \n	 w = max(0.6 - w, 0.0);\n	 \n	 d.x = dot(random3(s), x);\n	 d.y = dot(random3(s + i1), x1);\n	 d.z = dot(random3(s + i2), x2);\n	 d.w = dot(random3(s + 1.0), x3);\n	 \n	 w *= w;\n	 w *= w;\n	 d *= w;\n	 \n	 return dot(d, vec4(52.0));\n}\nfloat pnoise(vec3 p) {\n	float n = 0.0;\n	n += 1.0 * simplex3d(1.0 * p);\n	n += 0.5 * simplex3d(2.0 * p);\n	n += 0.25 * simplex3d(4.0 * p);\n	n += 0.125 * simplex3d(8.0 * p);\n	\n	n = 0.5 + 0.5 * n;\n	n *= smoothstep(0.0, 1.0, n);\n	return n;\n}\nfloat genShape(vec2 p, float seed, float freq, float constant, float linear) {\n	\n	float f = pnoise(vec3(freq * p, seed));\n	p = 2.0 * p - 1.0;\n	float d = length(p);\n	\n	f = f - (constant +  linear * d * d);\n	\n	if (f > clamp.x)\n		f = 1.0;\n	else if (f > clamp.y)\n		f = clamp.z;\n	else\n		f = 0.0;\n	return f;\n} \nvoid main( void ) {\n	vec2 p = 0.5 + vPosition.xy / size;\n	float r = genShape(p, seed.x, frequency.x, coff.x, coff.y);\n	float g = genShape(p, seed.y, frequency.y, coff.z, coff.w);\n	float b = pnoise(vec3(frequency.z * p, seed.z));\n	gl_FragColor = vec4(r, g, b, 1.0);\n}";

	// File:../dev/three/renderers/shaders/app/wava_effect_fragment.glsl

	THREE.ShaderChunk['wava_effect_fragment'] = "#include <common>\nuniform sampler2D map;\nuniform float _waveWidth;\nuniform float _curWaveDis;\nuniform float _waveCount;\nuniform float _waveHeight;\nuniform float _distanceFactor;\nuniform vec2 _start;\nuniform float _xscale;\nvarying vec2 vUv;\nvoid main( void ) {\n	vec2 dv = (_start - vUv)*vec2(_xscale, 1);\n	float dis = sqrt(dv.x * dv.x + dv.y * dv.y);\n	if (_curWaveDis - dis < 0.0 || (_curWaveDis - dis) >(_waveWidth * _waveCount)) {\n		gl_FragColor = texture2D (map, vUv);\n	}else{\n		float sinFactor = sin((dis - _curWaveDis) * _distanceFactor) * _waveHeight;\n		vec2 dv1 = normalize(dv);\n		vec2 offset = dv1  * sinFactor;\n		gl_FragColor = texture2D (map, vUv + offset);\n	}\n	\n}";

	// File:../dev/three/renderers/shaders/app/lut_effect_fragment.glsl

	THREE.ShaderChunk['lut_effect_fragment'] = "#include <common>\nuniform sampler2D map;\nuniform sampler2D _lut;\nuniform vec3 _scaleOffset;\nvarying vec2 vUv;\nvoid main( void ) {\n	vec4  uvw = texture2D(map, vUv);\n	uvw.z *= _scaleOffset.z;\n	float shift = floor(uvw.z);\n	uvw.xy = uvw.xy * _scaleOffset.z * _scaleOffset.xy + _scaleOffset.xy * 0.5;\n	uvw.x += shift * _scaleOffset.y;\n	uvw.xyz = mix(texture2D(_lut, uvw.xy).rgb, texture2D(_lut, uvw.xy + vec2(_scaleOffset.y, 0)).rgb, uvw.z - shift);\n	gl_FragColor = uvw;	\n}";

	// File:../dev/three/renderers/shaders/ShaderChunk/alphamap_fragment.glsl

	THREE.ShaderChunk['alphamap_fragment'] = "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/alphamap_pars_fragment.glsl

	THREE.ShaderChunk['alphamap_pars_fragment'] = "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/alphatest_fragment.glsl

	THREE.ShaderChunk['alphatest_fragment'] = "#ifdef ALPHATEST\n	if ( diffuseColor.a < ALPHATEST ) discard;\n#else\n	if ( diffuseColor.a == 0.0 ) discard;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/aomap_fragment.glsl

	THREE.ShaderChunk['aomap_fragment'] = "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/aomap_pars_fragment.glsl

	THREE.ShaderChunk['aomap_pars_fragment'] = "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/begin_vertex.glsl

	THREE.ShaderChunk['begin_vertex'] = "\nvec3 transformed = vec3( position );\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/beginnormal_vertex.glsl

	THREE.ShaderChunk['beginnormal_vertex'] = "\nvec3 objectNormal = vec3( normal );\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/bsdfs.glsl

	THREE.ShaderChunk['bsdfs'] = "bool testLightInRange( const in float lightDistance, const in float cutoffDistance ) {\n	return any( bvec2( cutoffDistance == 0.0, lightDistance < cutoffDistance ) );\n}\nfloat punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n		if( decayExponent > 0.0 ) {\n#if defined ( PHYSICALLY_CORRECT_LIGHTS )\n			float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n			float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n			return distanceFalloff * maxDistanceCutoffFactor;\n#else\n			return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n#endif\n		}\n		return 1.0;\n}\nvec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n	return ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	return 1.0 / ( gl * gv );\n}\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\nvec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n	float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n	float dotNH = saturate( dot( geometry.normal, halfDir ) );\n	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n	vec3 F = F_Schlick( specularColor, dotLH );\n	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n	float D = D_GGX( alpha, dotNH );\n	return F * ( G * D );\n}\nvec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n	vec4 r = roughness * c0 + c1;\n	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n	return specularColor * AB.x + AB.y;\n}\nfloat G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n	float dotNH = saturate( dot( geometry.normal, halfDir ) );\n	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n	vec3 F = F_Schlick( specularColor, dotLH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n}\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl

	THREE.ShaderChunk['bumpmap_pars_fragment'] = "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 );\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/clipping_planes_fragment.glsl

	THREE.ShaderChunk['clipping_planes_fragment'] = "#if NUM_CLIPPING_PLANES > 0\n	for ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {\n		vec4 plane = clippingPlanes[ i ];\n		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n	}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/clipping_planes_pars_fragment.glsl

	THREE.ShaderChunk['clipping_planes_pars_fragment'] = "#if NUM_CLIPPING_PLANES > 0\n	#if ! defined( PHYSICAL ) && ! defined( PHONG )\n		varying vec3 vViewPosition;\n	#endif\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/clipping_planes_pars_vertex.glsl

	THREE.ShaderChunk['clipping_planes_pars_vertex'] = "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n	varying vec3 vViewPosition;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/clipping_planes_vertex.glsl

	THREE.ShaderChunk['clipping_planes_vertex'] = "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n	vViewPosition = - mvPosition.xyz;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/color_fragment.glsl

	THREE.ShaderChunk['color_fragment'] = "#ifdef USE_COLOR\n	diffuseColor.rgba *= vColor;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/color_pars_fragment.glsl

	THREE.ShaderChunk['color_pars_fragment'] = "#ifdef USE_COLOR\n	varying vec4 vColor;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/color_pars_vertex.glsl

	THREE.ShaderChunk['color_pars_vertex'] = "#ifdef USE_COLOR\n	varying vec4 vColor;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/color_vertex.glsl

	THREE.ShaderChunk['color_vertex'] = "#ifdef USE_COLOR\n	vColor.xyzw = color.xyzw;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/common.glsl

	THREE.ShaderChunk['common'] = "#define PI 3.14159265359\n#define PI2 6.28318530718\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract(sin(sn) * c);\n}\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\nstruct GeometricContext {\n	vec3 position;\n	vec3 normal;\n	vec3 viewDir;\n};\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	float distance = dot( planeNormal, point - pointOnPlane );\n	return - distance * planeNormal + point;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/cube_uv_reflection_fragment.glsl

	THREE.ShaderChunk['cube_uv_reflection_fragment'] = "#ifdef ENVMAP_TYPE_CUBE_UV\nconst float cubeUV_textureSize = 1024.0;\nint getFaceFromDirection(vec3 direction) {\n	vec3 absDirection = abs(direction);\n	int face = -1;\n	if( absDirection.x > absDirection.z ) {\n		if(absDirection.x > absDirection.y )\n			face = direction.x > 0.0 ? 0 : 3;\n		else\n			face = direction.y > 0.0 ? 1 : 4;\n	}\n	else {\n		if(absDirection.z > absDirection.y )\n			face = direction.z > 0.0 ? 2 : 5;\n		else\n			face = direction.y > 0.0 ? 1 : 4;\n	}\n	return face;\n}\nfloat cubeUV_maxLods1 = log2(cubeUV_textureSize*0.25) - 1.0;\nfloat cubeUV_rangeClamp = exp2((6.0 - 1.0) * 2.0);\nvec2 MipLevelInfo( vec3 vec, float roughnessLevel, float roughness ) {\n	float scale = exp2(cubeUV_maxLods1 - roughnessLevel);\n	float dxRoughness = dFdx(roughness);\n	float dyRoughness = dFdy(roughness);\n	vec3 dx = dFdx( vec * scale * dxRoughness );\n	vec3 dy = dFdy( vec * scale * dyRoughness );\n	float d = max( dot( dx, dx ), dot( dy, dy ) );\n	d = clamp(d, 1.0, cubeUV_rangeClamp);\n	float mipLevel = 0.5 * log2(d);\n	return vec2(floor(mipLevel), fract(mipLevel));\n}\nfloat cubeUV_maxLods2 = log2(cubeUV_textureSize*0.25) - 2.0;\nconst float cubeUV_rcpTextureSize = 1.0 / cubeUV_textureSize;\nvec2 getCubeUV(vec3 direction, float roughnessLevel, float mipLevel) {\n	mipLevel = roughnessLevel > cubeUV_maxLods2 - 3.0 ? 0.0 : mipLevel;\n	float a = 16.0 * cubeUV_rcpTextureSize;\n	vec2 exp2_packed = exp2( vec2( roughnessLevel, mipLevel ) );\n	vec2 rcp_exp2_packed = vec2( 1.0 ) / exp2_packed;\n	float powScale = exp2_packed.x * exp2_packed.y;\n	float scale = rcp_exp2_packed.x * rcp_exp2_packed.y * 0.25;\n	float mipOffset = 0.75*(1.0 - rcp_exp2_packed.y) * rcp_exp2_packed.x;\n	bool bRes = mipLevel == 0.0;\n	scale =  bRes && (scale < a) ? a : scale;\n	vec3 r;\n	vec2 offset;\n	int face = getFaceFromDirection(direction);\n	float rcpPowScale = 1.0 / powScale;\n	if( face == 0) {\n		r = vec3(direction.x, -direction.z, direction.y);\n		offset = vec2(0.0+mipOffset,0.75 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n	}\n	else if( face == 1) {\n		r = vec3(direction.y, direction.x, direction.z);\n		offset = vec2(scale+mipOffset, 0.75 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n	}\n	else if( face == 2) {\n		r = vec3(direction.z, direction.x, direction.y);\n		offset = vec2(2.0*scale+mipOffset, 0.75 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n	}\n	else if( face == 3) {\n		r = vec3(direction.x, direction.z, direction.y);\n		offset = vec2(0.0+mipOffset,0.5 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n	}\n	else if( face == 4) {\n		r = vec3(direction.y, direction.x, -direction.z);\n		offset = vec2(scale+mipOffset, 0.5 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n	}\n	else {\n		r = vec3(direction.z, -direction.x, direction.y);\n		offset = vec2(2.0*scale+mipOffset, 0.5 * rcpPowScale);\n		offset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n	}\n	r = normalize(r);\n	float texelOffset = 0.5 * cubeUV_rcpTextureSize;\n	vec2 s = ( r.yz / abs( r.x ) + vec2( 1.0 ) ) * 0.5;\n	vec2 base = offset + vec2( texelOffset );\n	return base + s * ( scale - 2.0 * texelOffset );\n}\nfloat cubeUV_maxLods3 = log2(cubeUV_textureSize*0.25) - 3.0;\nvec4 textureCubeUV(vec3 reflectedDirection, float roughness ) {\n	float roughnessVal = roughness* cubeUV_maxLods3;\n	float r1 = floor(roughnessVal);\n	float r2 = r1 + 1.0;\n	float t = fract(roughnessVal);\n	vec2 mipInfo = MipLevelInfo(reflectedDirection, r1, roughness);\n	float s = mipInfo.y;\n	float level0 = mipInfo.x;\n	float level1 = level0 + 1.0;\n	level1 = level1 > 5.0 ? 5.0 : level1;\n	level0 += min( floor( s + 0.5 ), 5.0 );\n	vec2 uv_10 = getCubeUV(reflectedDirection, r1, level0);\n	vec4 color10 = envMapTexelToLinear(texture2D(envMap, uv_10));\n	vec2 uv_20 = getCubeUV(reflectedDirection, r2, level0);\n	vec4 color20 = envMapTexelToLinear(texture2D(envMap, uv_20));\n	vec4 result = mix(color10, color20, t);\n	return vec4(result.rgb, 1.0);\n}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/defaultnormal_vertex.glsl

	THREE.ShaderChunk['defaultnormal_vertex'] = "#ifdef FLIP_SIDED\n	objectNormal = -objectNormal;\n#endif\nvec3 transformedNormal = normalMatrix * objectNormal;\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/displacementmap_vertex.glsl

	THREE.ShaderChunk['displacementmap_vertex'] = "#ifdef USE_DISPLACEMENTMAP\n	transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/displacementmap_pars_vertex.glsl

	THREE.ShaderChunk['displacementmap_pars_vertex'] = "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/emissivemap_fragment.glsl

	THREE.ShaderChunk['emissivemap_fragment'] = "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vUv );\n	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/emissivemap_pars_fragment.glsl

	THREE.ShaderChunk['emissivemap_pars_fragment'] = "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/encodings_pars_fragment.glsl

	THREE.ShaderChunk['encodings_pars_fragment'] = "\nvec4 LinearToLinear( in vec4 value ) {\n  return value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n  float maxComponent = max( max( value.r, value.g ), value.b );\n  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n  return vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n  float maxRGB = max( value.x, max( value.g, value.b ) );\n  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n  M            = ceil( M * 255.0 ) / 255.0;\n  return vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n    float maxRGB = max( value.x, max( value.g, value.b ) );\n    float D      = max( maxRange / maxRGB, 1.0 );\n    D            = min( floor( D ) / 255.0, 1.0 );\n    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )  {\n  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n  vec4 vResult;\n  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n  vResult.w = fract(Le);\n  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n  return vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n  float Le = value.z * 255.0 + value.w;\n  vec3 Xp_Y_XYZp;\n  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n  return vec4( max(vRGB, 0.0), 1.0 );\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/encodings_fragment.glsl

	THREE.ShaderChunk['encodings_fragment'] = "  gl_FragColor = linearToOutputTexel( gl_FragColor );\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/envmap_fragment.glsl

	THREE.ShaderChunk['envmap_fragment'] = "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n	#else\n		float flipNormal = 1.0;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n	envColor = envMapTexelToLinear( envColor );\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n	#elif defined( ENVMAP_BLENDING_MIX )\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n	#elif defined( ENVMAP_BLENDING_ADD )\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/envmap_pars_fragment.glsl

	THREE.ShaderChunk['envmap_pars_fragment'] = "#if defined( USE_ENVMAP ) || defined( PHYSICAL )\n	uniform float reflectivity;\n	uniform float envMapIntenstiy;\n#endif\n#ifdef USE_ENVMAP\n	#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )\n		varying vec3 vWorldPosition;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/envmap_pars_vertex.glsl

	THREE.ShaderChunk['envmap_pars_vertex'] = "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/envmap_vertex.glsl

	THREE.ShaderChunk['envmap_vertex'] = "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/fog_fragment.glsl

	THREE.ShaderChunk['fog_fragment'] = "#ifdef USE_FOG\n	#ifdef USE_LOGDEPTHBUF_EXT\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n	#else\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n	#endif\n	#ifdef FOG_EXP2\n		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/fog_pars_fragment.glsl

	THREE.ShaderChunk['fog_pars_fragment'] = "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/lightmap_fragment.glsl

	THREE.ShaderChunk['lightmap_fragment'] = "#ifdef USE_LIGHTMAP\n	reflectedLight.indirectDiffuse += PI * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lightmap_pars_fragment.glsl

	THREE.ShaderChunk['lightmap_pars_fragment'] = "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_lambert_vertex.glsl

	THREE.ShaderChunk['lights_lambert_vertex'] = "vec3 diffuse = vec3( 1.0 );\nGeometricContext geometry;\ngeometry.position = mvPosition.xyz;\ngeometry.normal = normalize( transformedNormal );\ngeometry.viewDir = normalize( -mvPosition.xyz );\nGeometricContext backGeometry;\nbackGeometry.position = geometry.position;\nbackGeometry.normal = -geometry.normal;\nbackGeometry.viewDir = geometry.viewDir;\nvLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\n	vLightBack = vec3( 0.0 );\n#endif\nIncidentLight directLight;\nfloat dotNL;\nvec3 directLightColor_Diffuse;\n#if NUM_POINT_LIGHTS > 0\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );\n		dotNL = dot( geometry.normal, directLight.direction );\n		directLightColor_Diffuse = PI * directLight.color;\n		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n		#ifdef DOUBLE_SIDED\n			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n		#endif\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );\n		dotNL = dot( geometry.normal, directLight.direction );\n		directLightColor_Diffuse = PI * directLight.color;\n		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n		#ifdef DOUBLE_SIDED\n			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n		#endif\n	}\n#endif\n#if NUM_DIR_LIGHTS > 0\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );\n		dotNL = dot( geometry.normal, directLight.direction );\n		directLightColor_Diffuse = PI * directLight.color;\n		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n		#ifdef DOUBLE_SIDED\n			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n		#endif\n	}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n		vLightFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n		#ifdef DOUBLE_SIDED\n			vLightBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );\n		#endif\n	}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_pars.glsl

	THREE.ShaderChunk['lights_pars'] = "uniform vec3 ambientLightColor;\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	#ifndef PHYSICALLY_CORRECT_LIGHTS\n		irradiance *= PI;\n	#endif\n	return irradiance;\n}\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n		directLight.color = directionalLight.color;\n		directLight.direction = directionalLight.direction;\n		directLight.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n		vec3 lVector = pointLight.position - geometry.position;\n		directLight.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		if ( testLightInRange( lightDistance, pointLight.distance ) ) {\n			directLight.color = pointLight.color;\n			directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n			directLight.visible = true;\n		} else {\n			directLight.color = vec3( 0.0 );\n			directLight.visible = false;\n		}\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n		int shadow;\n		float shadowBias;\n		float shadowRadius;\n		vec2 shadowMapSize;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {\n		vec3 lVector = spotLight.position - geometry.position;\n		directLight.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		float angleCos = dot( directLight.direction, spotLight.direction );\n		if ( all( bvec2( angleCos > spotLight.coneCos, testLightInRange( lightDistance, spotLight.distance ) ) ) ) {\n			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n			directLight.color = spotLight.color;\n			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n			directLight.visible = true;\n		} else {\n			directLight.color = vec3( 0.0 );\n			directLight.visible = false;\n		}\n	}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n		float dotNL = dot( geometry.normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		#ifndef PHYSICALLY_CORRECT_LIGHTS\n			irradiance *= PI;\n		#endif\n		return irradiance;\n	}\n#endif\n#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {\n		#ifdef DOUBLE_SIDED\n			float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n		#else\n			float flipNormal = 1.0;\n		#endif\n		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n		#ifdef ENVMAP_TYPE_CUBE\n			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n			#else\n				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#elif defined( ENVMAP_TYPE_CUBE_UV )\n			vec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n			vec4 envMapColor = textureCubeUV( queryVec, 1.0 );\n		#else\n			vec4 envMapColor = vec4( 0.0 );\n		#endif\n		return PI * envMapColor.rgb * envMapIntensity;\n	}\n	float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n		float maxMIPLevelScalar = float( maxMIPLevel );\n		float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n	}\n	vec3 getLightProbeIndirectRadiance( const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );\n		#else\n			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );\n		#endif\n		#ifdef DOUBLE_SIDED\n			float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n		#else\n			float flipNormal = 1.0;\n		#endif\n		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n		#ifdef ENVMAP_TYPE_CUBE\n			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n			#else\n				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#elif defined( ENVMAP_TYPE_CUBE_UV )\n			vec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n			vec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));\n		#elif defined( ENVMAP_TYPE_EQUIREC )\n			vec2 sampleUV;\n			sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n			sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );\n			#else\n				vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#elif defined( ENVMAP_TYPE_SPHERE )\n			vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n			#ifdef TEXTURE_LOD_EXT\n				vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n			#else\n				vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n			#endif\n			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n		#endif\n		return envMapColor.rgb * envMapIntensity;\n	}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_phong_fragment.glsl

	THREE.ShaderChunk['lights_phong_fragment'] = "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_phong_pars_fragment.glsl

	THREE.ShaderChunk['lights_phong_pars_fragment'] = "varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\nstruct BlinnPhongMaterial {\n	vec3	diffuseColor;\n	vec3	specularColor;\n	float	specularShininess;\n	float	specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifndef PHYSICALLY_CORRECT_LIGHTS\n		irradiance *= PI;\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong\n#define Material_LightProbeLOD( material )	(0)\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_physical_fragment.glsl

	THREE.ShaderChunk['lights_physical_fragment'] = "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.specularRoughness = clamp( roughnessFactor, 0.04, 1.0 );\n#ifdef STANDARD\n	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = mix( vec3( 0.16 * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_physical_pars_fragment.glsl

	THREE.ShaderChunk['lights_physical_pars_fragment'] = "struct PhysicalMaterial {\n	vec3	diffuseColor;\n	float	specularRoughness;\n	vec3	specularColor;\n	#ifndef STANDARD\n	#endif\n};\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifndef PHYSICALLY_CORRECT_LIGHTS\n		irradiance *= PI;\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_Specular_GGX( directLight, geometry, material.specularColor, material.specularRoughness );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectSpecular += radiance * BRDF_Specular_GGX_Environment( geometry, material.specularColor, material.specularRoughness );\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\n#define Material_BlinnShininessExponent( material )   GGXRoughnessToBlinnExponent( material.specularRoughness )\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/lights_template.glsl

	THREE.ShaderChunk['lights_template'] = "\nGeometricContext geometry;\ngeometry.position = - vViewPosition;\ngeometry.normal = normal;\ngeometry.viewDir = normalize( vViewPosition );\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointDirectLightIrradiance( pointLight, geometry, directLight );\n		#ifdef USE_SHADOWMAP\n		directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometry, material, reflectedLight );\n	}\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotDirectLightIrradiance( spotLight, geometry, directLight );\n		#ifdef USE_SHADOWMAP\n		directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometry, material, reflectedLight );\n	}\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n		#ifdef USE_SHADOWMAP\n		directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometry, material, reflectedLight );\n	}\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#ifdef USE_LIGHTMAP\n		vec3 lightMapIrradiance = 2.0 * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n		#ifndef PHYSICALLY_CORRECT_LIGHTS\n			lightMapIrradiance *= PI;\n		#endif\n		irradiance += lightMapIrradiance;\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n		}\n	#endif\n	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )\n	 	irradiance += getLightProbeIndirectIrradiance( geometry, 8 );\n	#endif\n	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	vec3 radiance = getLightProbeIndirectRadiance( geometry, Material_BlinnShininessExponent( material ), 8 );\n	RE_IndirectSpecular( radiance, geometry, material, reflectedLight );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl

	THREE.ShaderChunk['logdepthbuf_fragment'] = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/logdepthbuf_pars_fragment.glsl

	THREE.ShaderChunk['logdepthbuf_pars_fragment'] = "#ifdef USE_LOGDEPTHBUF\n	uniform float logDepthBufFC;\n	#ifdef USE_LOGDEPTHBUF_EXT\n		varying float vFragDepth;\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/logdepthbuf_pars_vertex.glsl

	THREE.ShaderChunk['logdepthbuf_pars_vertex'] = "#ifdef USE_LOGDEPTHBUF\n	#ifdef USE_LOGDEPTHBUF_EXT\n		varying float vFragDepth;\n	#endif\n	uniform float logDepthBufFC;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/logdepthbuf_vertex.glsl

	THREE.ShaderChunk['logdepthbuf_vertex'] = "#ifdef USE_LOGDEPTHBUF\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n	#ifdef USE_LOGDEPTHBUF_EXT\n		vFragDepth = 1.0 + gl_Position.w;\n	#else\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/convert_color_pars_fragment.glsl

	THREE.ShaderChunk['convert_color_pars_fragment'] = "\nconst float hsvEpsilon = 1e-10;\nvec3 rgb2hcv(vec3 RGB)\n{\n    vec4 P = mix(vec4(RGB.bg, -1.0, 2.0/3.0), vec4(RGB.gb, 0.0, -1.0/3.0), step(RGB.b, RGB.g));\n    vec4 Q = mix(vec4(P.xyw, RGB.r), vec4(RGB.r, P.yzx), step(P.x, RGB.r));\n    float C = Q.x - min(Q.w, Q.y);\n    float H = abs((Q.w - Q.y) / (6.0 * C + hsvEpsilon) + Q.z);\n    return vec3(H, C, Q.x);\n}\nvec3 rgb2hsv(vec3 RGB)\n{\n    vec3 HCV = rgb2hcv(RGB);\n    float L = HCV.z - HCV.y * 0.5;\n    float S = HCV.y / (1.0 - abs(L * 2.0 - 1.0) + hsvEpsilon);\n    return vec3(HCV.x, S, L);\n}\nvec3 hsv2rgb(vec3 c)\n{\n    c = vec3(fract(c.x), clamp(c.yz, 0.0, 1.0));\n    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);\n    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));\n}\n#if defined( USE_CONVERT_COLOR )\nuniform vec3 hsvValue;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/convert_color_fragment.glsl

	THREE.ShaderChunk['convert_color_fragment'] = "#if defined( USE_CONVERT_COLOR )\n	vec3 hsv = rgb2hsv(diffuseColor.rgb);\n	hsv += hsvValue;\n	diffuseColor.rgb = hsv2rgb(hsv);\n	\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/map_fragment.glsl

	THREE.ShaderChunk['map_fragment'] = "#ifdef USE_MAP\n	vec4 texelColor = texture2D( map, vUv );\n	diffuseColor *= texelColor;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/map_pars_fragment.glsl

	THREE.ShaderChunk['map_pars_fragment'] = "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_GRAY\n	uniform int isGray;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/map_particle_fragment.glsl

	THREE.ShaderChunk['map_particle_fragment'] = "#ifdef USE_MAP\n	vec4 mapTexel = texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * mapst.xy + mapst.zw );\n	diffuseColor *= mapTexelToLinear( mapTexel );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/map_particle_pars_fragment.glsl

	THREE.ShaderChunk['map_particle_pars_fragment'] = "#ifdef USE_MAP\n	uniform vec4 mapst;\n	uniform sampler2D map;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/metalnessmap_fragment.glsl

	THREE.ShaderChunk['metalnessmap_fragment'] = "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vUv );\n	metalnessFactor *= texelMetalness.r;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/metalnessmap_pars_fragment.glsl

	THREE.ShaderChunk['metalnessmap_pars_fragment'] = "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/morphnormal_vertex.glsl

	THREE.ShaderChunk['morphnormal_vertex'] = "#ifdef USE_MORPHNORMALS\n	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/morphtarget_pars_vertex.glsl

	THREE.ShaderChunk['morphtarget_pars_vertex'] = "#ifdef USE_MORPHTARGETS\n	#ifndef USE_MORPHNORMALS\n	uniform float morphTargetInfluences[ 8 ];\n	#else\n	uniform float morphTargetInfluences[ 4 ];\n	#endif\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/morphtarget_vertex.glsl

	THREE.ShaderChunk['morphtarget_vertex'] = "#ifdef USE_MORPHTARGETS\n	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n	#ifndef USE_MORPHNORMALS\n	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/normal_fragment.glsl

	THREE.ShaderChunk['normal_fragment'] = "#ifdef FLAT_SHADED\n	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n	#endif\n#endif\n#ifdef USE_NORMALMAP\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/normalmap_pars_fragment.glsl

	THREE.ShaderChunk['normalmap_pars_fragment'] = "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n	}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/packing.glsl

	THREE.ShaderChunk['packing'] = "vec3 packNormalToRGB( const in vec3 normal ) {\n  return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n  return 1.0 - 2.0 * rgb.xyz;\n}\nvec4 packDepthToRGBA( const in float value ) {\n	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\n	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\n	vec4 res = mod( value * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );\n	res -= res.xxyz * bit_mask;\n	return res;\n}\nfloat unpackRGBAToDepth( const in vec4 rgba ) {\n	const vec4 bitSh = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n	return dot( rgba, bitSh );\n}\nfloat viewZToOrthoDepth( const in float viewZ, const in float near, const in float far ) {\n  return ( viewZ + near ) / ( near - far );\n}\nfloat OrthoDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n  return linearClipZ * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n  return ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/premultiplied_alpha_fragment.glsl

	THREE.ShaderChunk['premultiplied_alpha_fragment'] = "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/project_vertex.glsl

	THREE.ShaderChunk['project_vertex'] = "#ifdef USE_SKINNING\n	vec4 mvPosition = modelViewMatrix * skinned;\n#else\n	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n	\n#endif\ngl_Position = projectionMatrix * mvPosition;\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/roughnessmap_fragment.glsl

	THREE.ShaderChunk['roughnessmap_fragment'] = "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vUv );\n	roughnessFactor *= texelRoughness.r;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/roughnessmap_pars_fragment.glsl

	THREE.ShaderChunk['roughnessmap_pars_fragment'] = "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl

	THREE.ShaderChunk['shadowmap_pars_fragment'] = "#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n	#endif\n	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n	}\n	float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n		const vec2 offset = vec2( 0.0, 1.0 );\n		vec2 texelSize = vec2( 1.0 ) / size;\n		vec2 centroidUV = floor( uv * size + 0.5 ) / size;\n		float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n		float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n		float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n		float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n		vec2 f = fract( uv * size + 0.5 );\n		float a = mix( lb, lt, f.y );\n		float b = mix( rb, rt, f.y );\n		float c = mix( a, b, f.x );\n		return c;\n	}\n	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n		shadowCoord.xyz /= shadowCoord.w;\n		shadowCoord.z += shadowBias;\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n		bool frustumTest = all( frustumTestVec );\n		if ( frustumTest ) {\n		#if defined( SHADOWMAP_TYPE_PCF )\n			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n			float dx0 = - texelSize.x * shadowRadius;\n			float dy0 = - texelSize.y * shadowRadius;\n			float dx1 = + texelSize.x * shadowRadius;\n			float dy1 = + texelSize.y * shadowRadius;\n			return (\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n			) * ( 1.0 / 9.0 );\n		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n			float dx0 = - texelSize.x * shadowRadius;\n			float dy0 = - texelSize.y * shadowRadius;\n			float dx1 = + texelSize.x * shadowRadius;\n			float dy1 = + texelSize.y * shadowRadius;\n			return (\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n			) * ( 1.0 / 9.0 );\n		#else\n			return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n		#endif\n		}\n		return 1.0;\n	}\n	vec2 cubeToUV( vec3 v, float texelSizeY ) {\n		vec3 absV = abs( v );\n		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n		absV *= scaleToCube;\n		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n		vec2 planar = v.xy;\n		float almostATexel = 1.5 * texelSizeY;\n		float almostOne = 1.0 - almostATexel;\n		if ( absV.z >= almostOne ) {\n			if ( v.z > 0.0 )\n				planar.x = 4.0 - v.x;\n		} else if ( absV.x >= almostOne ) {\n			float signX = sign( v.x );\n			planar.x = v.z * signX + 2.0 * signX;\n		} else if ( absV.y >= almostOne ) {\n			float signY = sign( v.y );\n			planar.x = v.x + 2.0 * signY + 2.0;\n			planar.y = v.z * signY - 2.0;\n		}\n		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n	}\n	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;\n		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n			return (\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n			) * ( 1.0 / 9.0 );\n		#else\n			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n		#endif\n	}\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/shadowmap_pars_vertex.glsl

	THREE.ShaderChunk['shadowmap_pars_vertex'] = "#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/shadowmap_vertex.glsl

	THREE.ShaderChunk['shadowmap_vertex'] = "#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n	}\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n	}\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * worldPosition;\n	}\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/shadowmask_pars_fragment.glsl

	THREE.ShaderChunk['shadowmask_pars_fragment'] = "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHTS > 0\n	DirectionalLight directionalLight;\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		shadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#endif\n	#if NUM_SPOT_LIGHTS > 0\n	SpotLight spotLight;\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		shadow *= bool( spotLight.shadow ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n	}\n	#endif\n	#if NUM_POINT_LIGHTS > 0\n	PointLight pointLight;\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		shadow *= bool( pointLight.shadow ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n	}\n	#endif\n	#endif\n	return shadow;\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/skinbase_vertex.glsl

	THREE.ShaderChunk['skinbase_vertex'] = "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl

	THREE.ShaderChunk['skinning_pars_vertex'] = "#ifdef USE_SKINNING\n	\n	#ifdef BONE_TEXTURE\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n		mat4 getBoneMatrix( const in float i ) {\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n			y = dy * ( y + 0.5 );\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n			mat4 bone = mat4( v1, v2, v3, v4 );\n			return bone;\n		}\n	#else\n		uniform mat4 boneMatrices[ MAX_BONES ];\n		mat4 getBoneMatrix( const in float i ) {\n			mat4 bone = boneMatrices[ int(i) ];\n			return bone;\n		}\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/skinning_vertex.glsl

	THREE.ShaderChunk['skinning_vertex'] = "#ifdef USE_SKINNING\n	vec4 skinVertex = vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = skinned;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl

	THREE.ShaderChunk['skinnormal_vertex'] = "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/specularmap_fragment.glsl

	THREE.ShaderChunk['specularmap_fragment'] = "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/specularmap_pars_fragment.glsl

	THREE.ShaderChunk['specularmap_pars_fragment'] = "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/tonemapping_fragment.glsl

	THREE.ShaderChunk['tonemapping_fragment'] = "#if defined( TONE_MAPPING )\n  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl

	THREE.ShaderChunk['tonemapping_pars_fragment'] = "#define saturate(a) clamp( a, 0.0, 1.0 )\nuniform float toneMappingExposure;\nuniform float toneMappingWhitePoint;\nvec3 LinearToneMapping( vec3 color ) {\n  return toneMappingExposure * color;\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  return saturate( color / ( vec3( 1.0 ) + color ) );\n}\n#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )\nvec3 Uncharted2ToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );\n}\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  color = max( vec3( 0.0 ), color - 0.004 );\n  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\n";

	// File:../dev/three/renderers/shaders/ShaderChunk/uv2_pars_fragment.glsl

	THREE.ShaderChunk['uv2_pars_fragment'] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n	varying vec2 vUv2;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/uv2_pars_vertex.glsl

	THREE.ShaderChunk['uv2_pars_vertex'] = "#if defined( USE_LIGHTMAP )\n	uniform vec4 lightmapst;\n	attribute vec2 uv2;\n	varying vec2 vUv2;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/uv2_vertex.glsl

	THREE.ShaderChunk['uv2_vertex'] = "#if defined( USE_LIGHTMAP )\n	vUv2 = uv2 * lightmapst.xy + lightmapst.zw;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/uv_pars_fragment.glsl

	THREE.ShaderChunk['uv_pars_fragment'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n	varying vec2 vUv;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/uv_pars_vertex.glsl

	THREE.ShaderChunk['uv_pars_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP ) || defined (USE_AOMAP)\n	varying vec2 vUv;\n	uniform vec4 mapst;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/uv_vertex.glsl

	THREE.ShaderChunk['uv_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n	vUv = uv * mapst.xy + mapst.zw;\n#endif";

	// File:../dev/three/renderers/shaders/ShaderChunk/worldpos_vertex.glsl

	THREE.ShaderChunk['worldpos_vertex'] = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( PHYSICAL ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n	#ifdef USE_SKINNING\n		vec4 worldPosition = modelMatrix * skinned;\n	#else\n		vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n	#endif\n#endif\n";

	// File:../dev/three/renderers/shaders/UniformsUtils.js

	/**
	 * Uniform Utilities
	 */

	THREE.UniformsUtils = {

		merge: function (uniforms) {

			var merged = {};

			for (var u = 0; u < uniforms.length; u++) {

				var tmp = this.clone(uniforms[u]);

				for (var p in tmp) {

					merged[p] = tmp[p];

				}

			}

			return merged;

		},

		clone: function (uniforms_src) {

			var uniforms_dst = {};

			for (var u in uniforms_src) {

				uniforms_dst[u] = {};

				for (var p in uniforms_src[u]) {

					var parameter_src = uniforms_src[u][p];

					if (parameter_src instanceof THREE.Color ||
						parameter_src instanceof THREE.Vector2 ||
						parameter_src instanceof THREE.Vector3 ||
						parameter_src instanceof THREE.Vector4 ||
						parameter_src instanceof THREE.Matrix3 ||
						parameter_src instanceof THREE.Matrix4 ||
						parameter_src instanceof THREE.Texture) {

						uniforms_dst[u][p] = parameter_src.clone();

					} else if (Array.isArray(parameter_src)) {

						uniforms_dst[u][p] = parameter_src.slice();

					} else {

						uniforms_dst[u][p] = parameter_src;

					}

				}

			}

			return uniforms_dst;

		}

	};

	// File:../dev/three/renderers/shaders/UniformsLib.js

	/**
	 * Uniforms library for shared webgl shaders
	 */

	THREE.UniformsLib = {

		common: {

			"diffuse": {
				type: "c",
				value: new THREE.Color(0xeeeeee)
			},
			"opacity": {
				type: "1f",
				value: 1.0
			},

			"map": {
				type: "t",
				value: null
			},
			"mapst": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},

			"specularMap": {
				type: "t",
				value: null
			},
			"alphaMap": {
				type: "t",
				value: null
			},

			"envMap": {
				type: "t",
				value: null
			},
			"flipEnvMap": {
				type: "1f",
				value: -1
			},
			"reflectivity": {
				type: "1f",
				value: 1.0
			},
			"refractionRatio": {
				type: "1f",
				value: 0.98
			}

		},

		convertcolor: {
			"hsvValue": {
				type: "v3",
				value: new THREE.Vector3(0, 0, 0)
			}
		},

		aomap: {

			"aoMap": {
				type: "t",
				value: null
			},
			"aoMapIntensity": {
				type: "1f",
				value: 1
			}

		},

		lightmap: {
			"lightmapst": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},
			"lightMap": {
				type: "t",
				value: null
			},
			"lightMapIntensity": {
				type: "1f",
				value: 1
			}

		},

		emissivemap: {

			"emissiveMap": {
				type: "t",
				value: null
			}

		},

		bumpmap: {

			"bumpMap": {
				type: "t",
				value: null
			},
			"bumpScale": {
				type: "1f",
				value: 1
			}

		},

		normalmap: {

			"normalMap": {
				type: "t",
				value: null
			},
			"normalScale": {
				type: "v2",
				value: new THREE.Vector2(1, 1)
			}

		},

		displacementmap: {

			"displacementMap": {
				type: "t",
				value: null
			},
			"displacementScale": {
				type: "1f",
				value: 1
			},
			"displacementBias": {
				type: "1f",
				value: 0
			}

		},

		roughnessmap: {

			"roughnessMap": {
				type: "t",
				value: null
			}

		},

		metalnessmap: {

			"metalnessMap": {
				type: "t",
				value: null
			}

		},

		fog: {

			"fogDensity": {
				type: "1f",
				value: 0.00025
			},
			"fogNear": {
				type: "1f",
				value: 1
			},
			"fogFar": {
				type: "1f",
				value: 2000
			},
			"fogColor": {
				type: "c",
				value: new THREE.Color(0xffffff)
			}

		},

		lights: {

			"ambientLightColor": {
				type: "3fv",
				value: []
			},

			"directionalLights": {
				type: "sa",
				value: [],
				properties: {
					"direction": {
						type: "v3"
					},
					"color": {
						type: "c"
					},

					"shadow": {
						type: "1i"
					},
					"shadowBias": {
						type: "1f"
					},
					"shadowRadius": {
						type: "1f"
					},
					"shadowMapSize": {
						type: "v2"
					}
				}
			},

			"directionalShadowMap": {
				type: "tv",
				value: []
			},
			"directionalShadowMatrix": {
				type: "m4v",
				value: []
			},

			"spotLights": {
				type: "sa",
				value: [],
				properties: {
					"color": {
						type: "c"
					},
					"position": {
						type: "v3"
					},
					"direction": {
						type: "v3"
					},
					"distance": {
						type: "1f"
					},
					"coneCos": {
						type: "1f"
					},
					"penumbraCos": {
						type: "1f"
					},
					"decay": {
						type: "1f"
					},

					"shadow": {
						type: "1i"
					},
					"shadowBias": {
						type: "1f"
					},
					"shadowRadius": {
						type: "1f"
					},
					"shadowMapSize": {
						type: "v2"
					}
				}
			},

			"spotShadowMap": {
				type: "tv",
				value: []
			},
			"spotShadowMatrix": {
				type: "m4v",
				value: []
			},

			"pointLights": {
				type: "sa",
				value: [],
				properties: {
					"color": {
						type: "c"
					},
					"position": {
						type: "v3"
					},
					"decay": {
						type: "1f"
					},
					"distance": {
						type: "1f"
					},

					"shadow": {
						type: "1i"
					},
					"shadowBias": {
						type: "1f"
					},
					"shadowRadius": {
						type: "1f"
					},
					"shadowMapSize": {
						type: "v2"
					}
				}
			},

			"pointShadowMap": {
				type: "tv",
				value: []
			},
			"pointShadowMatrix": {
				type: "m4v",
				value: []
			},

			"hemisphereLights": {
				type: "sa",
				value: [],
				properties: {
					"direction": {
						type: "v3"
					},
					"skyColor": {
						type: "c"
					},
					"groundColor": {
						type: "c"
					}
				}
			}

		},

		points: {

			"diffuse": {
				type: "c",
				value: new THREE.Color(0xeeeeee)
			},
			"opacity": {
				type: "1f",
				value: 1.0
			},
			"size": {
				type: "1f",
				value: 1.0
			},
			"scale": {
				type: "1f",
				value: 1.0
			},
			"map": {
				type: "t",
				value: null
			},
			"mapst": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			}

		},

		terrain: {
			"_control": {
				type: "t",
				value: null
			},
			"_controlst": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},

			"_splat0": {
				type: "t",
				value: null
			},
			"_splat0st": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},

			"_splat1": {
				type: "t",
				value: null
			},
			"_splat1st": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},

			"_splat2": {
				type: "t",
				value: null
			},
			"_splat2st": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},

			"lightMap": {
				type: "t",
				value: null
			},
			"lightmapst": {
				type: "v4",
				value: new THREE.Vector4(1, 1, 0, 0)
			},
			"lightMapIntensity": {
				type: "1f",
				value: 1.0
			},
		},

		extra: {
			"tintColor": {
				type: "v3",
				value: new THREE.Color(0xeeeeee)
			},
			"tintOpacity": {
				type: "1f",
				value: 1.0
			}
		}

	};

	// File:../dev/three/renderers/shaders/ShaderLib/cube_frag.glsl

	THREE.ShaderChunk['cube_frag'] = "uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n	#include <logdepthbuf_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/cube_vert.glsl

	THREE.ShaderChunk['cube_vert'] = "varying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vWorldPosition = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/depth_frag.glsl

	THREE.ShaderChunk['depth_frag'] = "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( 1.0 );\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <logdepthbuf_fragment>\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( gl_FragCoord.z ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n	#endif\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/depth_vert.glsl

	THREE.ShaderChunk['depth_vert'] = "#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <skinbase_vertex>\n	#include <begin_vertex>\n	#include <displacementmap_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/distanceRGBA_frag.glsl

	THREE.ShaderChunk['distanceRGBA_frag'] = "uniform vec3 lightPos;\nvarying vec4 vWorldPosition;\n#include <common>\n#include <packing>\n#include <clipping_planes_pars_fragment>\nvoid main () {\n	#include <clipping_planes_fragment>\n	gl_FragColor = packDepthToRGBA( length( vWorldPosition.xyz - lightPos.xyz ) / 1000.0 );\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/distanceRGBA_vert.glsl

	THREE.ShaderChunk['distanceRGBA_vert'] = "varying vec4 vWorldPosition;\n#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <skinbase_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition;\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/equirect_frag.glsl

	THREE.ShaderChunk['equirect_frag'] = "uniform sampler2D tEquirect;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec3 direction = normalize( vWorldPosition );\n	vec2 sampleUV;\n	sampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );\n	sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <logdepthbuf_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/equirect_vert.glsl

	THREE.ShaderChunk['equirect_vert'] = "varying vec3 vWorldPosition;\n#include <common>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vWorldPosition = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/linedashed_frag.glsl

	THREE.ShaderChunk['linedashed_frag'] = "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/linedashed_vert.glsl

	THREE.ShaderChunk['linedashed_vert'] = "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <color_vertex>\n	vLineDistance = scale * lineDistance;\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/meshbasic_frag.glsl

	THREE.ShaderChunk['meshbasic_frag'] = "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <convert_color_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n#if defined(USE_LIGHTMAP)\n	diffuseColor.rgb *= 2.0 * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n#endif\n#include <convert_color_fragment>\n#ifdef USE_GRAY\n	if (isGray == 1) {\n		float g = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));\n		diffuseColor = vec4(g, g, g, diffuseColor.a);\n	}\n#endif\n	gl_FragColor = diffuseColor;\n	#include <fog_fragment>\n}";

	// File:../dev/three/renderers/shaders/ShaderLib/meshbasic_vert.glsl

	THREE.ShaderChunk['meshbasic_vert'] = "\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <color_pars_vertex>\n#include <skinning_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <skinbase_vertex>\n	#include <beginnormal_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	\n	#include <worldpos_vertex>\n	\n}";

	// File:../dev/three/renderers/shaders/ShaderLib/meshlambert_frag.glsl

	THREE.ShaderChunk['meshlambert_frag'] = "uniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n	varying vec3 vLightBack;\n#endif\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <emissivemap_fragment>\n	reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );\n	#include <lightmap_fragment>\n	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );\n	#ifdef DOUBLE_SIDED\n		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;\n	#else\n		reflectedLight.directDiffuse = vLightFront;\n	#endif\n	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/meshlambert_vert.glsl

	THREE.ShaderChunk['meshlambert_vert'] = "#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n	varying vec3 vLightBack;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <bsdfs>\n#include <lights_pars>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <lights_lambert_vertex>\n	#include <shadowmap_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/meshphong_frag.glsl

	THREE.ShaderChunk['meshphong_frag'] = "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_template>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/meshphong_vert.glsl

	THREE.ShaderChunk['meshphong_vert'] = "#define PHONG\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n#endif\n	#include <begin_vertex>\n	#include <displacementmap_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/meshphysical_frag.glsl

	THREE.ShaderChunk['meshphysical_frag'] = "#define PHYSICAL\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\nuniform float envMapIntensity;\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <lights_pars>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <specularmap_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_template>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#ifdef USE_GRAY\n		if (isGray == 1) {\n			float g = dot(outgoingLight, vec3(0.299, 0.587, 0.114));\n			outgoingLight = vec3(g, g, g);\n		}\n	#endif\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/meshphysical_vert.glsl

	THREE.ShaderChunk['meshphysical_vert'] = "#define PHYSICAL\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <amsuv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <amsuv_vertex>\n	#include <uv2_vertex>\n	#include <color_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n#endif\n	#include <begin_vertex>\n	#include <displacementmap_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/normal_frag.glsl

	THREE.ShaderChunk['normal_frag'] = "uniform float opacity;\nvarying vec3 vNormal;\n#include <common>\n#include <packing>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	gl_FragColor = vec4( packNormalToRGB( vNormal ), opacity );\n	#include <logdepthbuf_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/normal_vert.glsl

	THREE.ShaderChunk['normal_vert'] = "varying vec3 vNormal;\n#include <common>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vNormal = normalize( normalMatrix * normal );\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/points_frag.glsl

	THREE.ShaderChunk['points_frag'] = "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	outgoingLight = diffuseColor.rgb;\n	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n	#include <premultiplied_alpha_fragment>\n	#include <tonemapping_fragment>\n	#include <encodings_fragment>\n	#include <fog_fragment>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib/points_vert.glsl

	THREE.ShaderChunk['points_vert'] = "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <color_vertex>\n	#include <begin_vertex>\n	#include <project_vertex>\n	#ifdef USE_SIZEATTENUATION\n		gl_PointSize = size * ( scale / - mvPosition.z );\n	#else\n		gl_PointSize = size;\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n}\n";

	// File:../dev/three/renderers/shaders/ShaderLib.js

	/**
	 * Webgl Shader Library for three.js
	 *
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 * @author mikael emtinger / http://gomo.se/
	 */


	THREE.ShaderLib = {

		'basic': {

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib['common'],
				THREE.UniformsLib['fog'],
				THREE.UniformsLib['lights'],
				THREE.UniformsLib['lightmap'],
				THREE.UniformsLib['convertcolor']
			]),

			vertexShader: THREE.ShaderChunk['meshbasic_vert'],
			fragmentShader: THREE.ShaderChunk['meshbasic_frag']

		},

		'lambert': {

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib['common'],
				THREE.UniformsLib['aomap'],
				THREE.UniformsLib['lightmap'],
				THREE.UniformsLib['emissivemap'],
				THREE.UniformsLib['fog'],
				THREE.UniformsLib['lights'],

				{
					"emissive": {
						type: "c",
						value: new THREE.Color(0x000000)
					}
				}

			]),

			vertexShader: THREE.ShaderChunk['meshlambert_vert'],
			fragmentShader: THREE.ShaderChunk['meshlambert_frag']

		},

		'phong': {

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib['common'],
				THREE.UniformsLib['aomap'],
				THREE.UniformsLib['lightmap'],
				THREE.UniformsLib['emissivemap'],
				THREE.UniformsLib['bumpmap'],
				THREE.UniformsLib['normalmap'],
				THREE.UniformsLib['displacementmap'],
				THREE.UniformsLib['fog'],
				THREE.UniformsLib['lights'],

				{
					"emissive": {
						type: "c",
						value: new THREE.Color(0x000000)
					},
					"specular": {
						type: "c",
						value: new THREE.Color(0x111111)
					},
					"shininess": {
						type: "1f",
						value: 30
					}
				}

			]),

			vertexShader: THREE.ShaderChunk['meshphong_vert'],
			fragmentShader: THREE.ShaderChunk['meshphong_frag']

		},

		'standard': {

			uniforms: THREE.UniformsUtils.merge([

				{
					"emissive": {
						type: "c",
						value: new THREE.Color(0x000000)
					},
					"roughness": {
						type: "1f",
						value: 0.5
					},
					"metalness": {
						type: "1f",
						value: 0
					},
					"envMapIntensity": {
						type: "1f",
						value: 1
					} // temporary
				},

				THREE.UniformsLib['common'],
				THREE.UniformsLib['aomap'],
				THREE.UniformsLib['lightmap'],
				THREE.UniformsLib['emissivemap'],
				THREE.UniformsLib['bumpmap'],
				THREE.UniformsLib['normalmap'],
				THREE.UniformsLib['displacementmap'],
				THREE.UniformsLib['roughnessmap'],
				THREE.UniformsLib['metalnessmap'],
				THREE.UniformsLib['fog'],
				THREE.UniformsLib['lights'],
				THREE.UniformsLib['convertcolor']

			]),

			vertexShader: THREE.ShaderChunk['meshphysical_vert'],
			fragmentShader: THREE.ShaderChunk['meshphysical_frag']

		},

		'points': {

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib['points'],
				THREE.UniformsLib['fog']

			]),

			vertexShader: THREE.ShaderChunk['points_vert'],
			fragmentShader: THREE.ShaderChunk['points_frag']

		},

		'dashed': {

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib['common'],
				THREE.UniformsLib['fog'],

				{
					"scale": {
						type: "1f",
						value: 1
					},
					"dashSize": {
						type: "1f",
						value: 1
					},
					"totalSize": {
						type: "1f",
						value: 2
					}
				}

			]),

			vertexShader: THREE.ShaderChunk['linedashed_vert'],
			fragmentShader: THREE.ShaderChunk['linedashed_frag']

		},

		'depth': {

			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib['common'],
				THREE.UniformsLib['displacementmap']

			]),

			vertexShader: THREE.ShaderChunk['depth_vert'],
			fragmentShader: THREE.ShaderChunk['depth_frag']

		},

		'normal': {

			uniforms: {

				"opacity": {
					type: "1f",
					value: 1.0
				}

			},

			vertexShader: THREE.ShaderChunk['normal_vert'],
			fragmentShader: THREE.ShaderChunk['normal_frag']

		},

		/* -------------------------------------------------------------------------
		//	Cube map shader
		 ------------------------------------------------------------------------- */

		'cube': {

			uniforms: {
				"tCube": {
					type: "t",
					value: null
				},
				"tFlip": {
					type: "1f",
					value: -1
				}
			},

			vertexShader: THREE.ShaderChunk['cube_vert'],
			fragmentShader: THREE.ShaderChunk['cube_frag']

		},

		/* -------------------------------------------------------------------------
		//	Cube map shader
		 ------------------------------------------------------------------------- */

		'equirect': {

			uniforms: {
				"tEquirect": {
					type: "t",
					value: null
				},
				"tFlip": {
					type: "1f",
					value: -1
				}
			},

			vertexShader: THREE.ShaderChunk['equirect_vert'],
			fragmentShader: THREE.ShaderChunk['equirect_frag']

		},

		'distanceRGBA': {

			uniforms: {

				"lightPos": {
					type: "v3",
					value: new THREE.Vector3()
				}

			},

			vertexShader: THREE.ShaderChunk['distanceRGBA_vert'],
			fragmentShader: THREE.ShaderChunk['distanceRGBA_frag']

		}

	};

	THREE.ShaderLib['physical'] = {

		uniforms: THREE.UniformsUtils.merge([

			THREE.ShaderLib['standard'].uniforms,

			{
				// future
			}

		]),

		vertexShader: THREE.ShaderChunk['meshphysical_vert'],
		fragmentShader: THREE.ShaderChunk['meshphysical_frag']

	};

	THREE.ShaderLib['particle'] = {

		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['common'],
			THREE.UniformsLib['extra']
		]),

		vertexShader: THREE.ShaderChunk['particles_mesh_vertex'],
		fragmentShader: THREE.ShaderChunk['particles_mesh_fragment']

	};

	THREE.ShaderLib['terraint4m3'] = {

		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['terrain'],
		]),

		vertexShader: THREE.ShaderChunk['terrain_t4m3_vertex'],
		fragmentShader: THREE.ShaderChunk['terrain_t4m3_fragment']

	};

	THREE.ShaderLib['terraint4m2'] = {

		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['terrain'],
		]),

		vertexShader: THREE.ShaderChunk['terrain_t4m2_vertex'],
		fragmentShader: THREE.ShaderChunk['terrain_t4m2_fragment']

	};


	// File:../dev/three/renderers/WebGLRenderer.js

	/**
	 * @author supereggbert / http://www.paulbrunt.co.uk/
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 * @author szimek / https://github.com/szimek/
	 * @author tschw
	 */

	THREE.WebGLRenderer = function (parameters) {

		console.log('THREE.WebGLRenderer', THREE.REVISION);

		parameters = parameters || {};

		var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas'),
			_context = parameters.context !== undefined ? parameters.context : null,

			_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
			_depth = parameters.depth !== undefined ? parameters.depth : true,
			_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
			_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
			_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
			_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

		var lights = [];

		var opaqueObjects = [];
		var opaqueObjectsLastIndex = -1;
		var transparentObjects = [];
		var transparentObjectsLastIndex = -1;

		var morphInfluences = new Float32Array(8);

		var sprites = [];
		var lensFlares = [];

		// public properties

		this.domElement = _canvas;
		this.context = null;

		// clearing

		this.autoClear = true;
		this.autoClearColor = true;
		this.autoClearDepth = true;
		this.autoClearStencil = true;

		// scene graph

		this.sortObjects = true;

		// user-defined clipping

		this.clippingPlanes = [];
		this.localClippingEnabled = false;

		// physically based shading

		this.gammaFactor = 2.0; // for backwards compatibility
		this.gammaInput = false;
		this.gammaOutput = false;

		// physical lights

		this.physicallyCorrectLights = false;

		// tone mapping

		this.toneMapping = THREE.LinearToneMapping;
		this.toneMappingExposure = 1.0;
		this.toneMappingWhitePoint = 1.0;

		// morphs

		this.maxMorphTargets = 8;
		this.maxMorphNormals = 4;

		// flags

		this.autoScaleCubemaps = true;

		// internal properties

		var _this = this,

			// internal state cache

			_currentProgram = null,
			_currentRenderTarget = null,
			_currentFramebuffer = null,
			_currentMaterialId = -1,
			_currentGeometryProgram = '',
			_currentCamera = null,

			_currentScissor = new THREE.Vector4(),
			_currentScissorTest = null,

			_currentViewport = new THREE.Vector4(),

			//

			_usedTextureUnits = 0,

			//

			_clearColor = new THREE.Color(0x000000),
			_clearAlpha = 0,

			_width = _canvas.width,
			_height = _canvas.height,

			_pixelRatio = 1,

			_scissor = new THREE.Vector4(0, 0, _width, _height),
			_scissorTest = false,

			_viewport = new THREE.Vector4(0, 0, _width, _height),

			// frustum

			_frustum = new THREE.Frustum(),

			// clipping

			_clippingEnabled = false,
			_localClippingEnabled = false,
			_clipRenderingShadows = false,

			_numClippingPlanes = 0,
			_clippingPlanesUniform = {
				type: '4fv',
				value: null,
				needsUpdate: false
			},

			_globalClippingState = null,
			_numGlobalClippingPlanes = 0,

			_matrix3 = new THREE.Matrix3(),
			_sphere = new THREE.Sphere(),
			_plane = new THREE.Plane(),


			// camera matrices cache

			_projScreenMatrix = new THREE.Matrix4(),

			_vector3 = new THREE.Vector3(),

			// light arrays cache

			_lights = {

				hash: '',

				ambient: [0, 0, 0],
				directional: [],
				directionalShadowMap: [],
				directionalShadowMatrix: [],
				spot: [],
				spotShadowMap: [],
				spotShadowMatrix: [],
				point: [],
				pointShadowMap: [],
				pointShadowMatrix: [],
				hemi: [],

				shadows: []

			},

			// info

			_infoMemory = {

				geometries: 0,
				textures: 0

			},

			_infoRender = {

				calls: 0,
				vertices: 0,
				faces: 0,
				points: 0

			};

		this.info = {

			render: _infoRender,
			memory: _infoMemory,
			programs: null

		};


		// initialize

		var _gl;

		try {

			var attributes = {
				alpha: _alpha,
				depth: _depth,
				stencil: _stencil,
				antialias: _antialias,
				premultipliedAlpha: _premultipliedAlpha,
				preserveDrawingBuffer: _preserveDrawingBuffer
			};

			_gl = _context || _canvas.getContext('webgl', attributes) || _canvas.getContext('experimental-webgl', attributes);

			if (_gl === null) {

				if (_canvas.getContext('webgl') !== null) {

					throw 'Error creating WebGL context with your selected attributes.';

				} else {

					throw 'Error creating WebGL context.';

				}

			}

			// Some experimental-webgl implementations do not have getShaderPrecisionFormat

			if (_gl.getShaderPrecisionFormat === undefined) {

				_gl.getShaderPrecisionFormat = function () {

					return {
						'rangeMin': 1,
						'rangeMax': 1,
						'precision': 1
					};

				};

			}

			_canvas.addEventListener('webglcontextlost', onContextLost, false);

		} catch (error) {

			console.error('THREE.WebGLRenderer: ' + error);

		}

		var _isWebGL2 = (typeof WebGL2RenderingContext !== 'undefined' && _gl instanceof WebGL2RenderingContext);
		var extensions = new THREE.WebGLExtensions(_gl);

		extensions.get('WEBGL_depth_texture');
		extensions.get('OES_texture_float');
		extensions.get('OES_texture_float_linear');
		extensions.get('OES_texture_half_float');
		extensions.get('OES_texture_half_float_linear');
		extensions.get('OES_standard_derivatives');
		extensions.get('ANGLE_instanced_arrays');

		if (extensions.get('OES_element_index_uint')) {

			THREE.BufferGeometry.MaxIndex = 4294967296;

		}

		var capabilities = new THREE.WebGLCapabilities(_gl, extensions, parameters);

		var state = new THREE.WebGLState(_gl, extensions, paramThreeToGL);
		var properties = new THREE.WebGLProperties();
		var objects = new THREE.WebGLObjects(_gl, properties, this.info);
		var programCache = new THREE.WebGLPrograms(this, capabilities);
		var lightCache = new THREE.WebGLLights();

		this.info.programs = programCache.programs;

		var bufferRenderer = new THREE.WebGLBufferRenderer(_gl, extensions, _infoRender);
		var indexedBufferRenderer = new THREE.WebGLIndexedBufferRenderer(_gl, extensions, _infoRender);

		//

		function getTargetPixelRatio() {

			return _currentRenderTarget === null ? _pixelRatio : 1;

		}

		function glClearColor(r, g, b, a) {

			if (_premultipliedAlpha === true) {

				r *= a;
				g *= a;
				b *= a;

			}

			state.clearColor(r, g, b, a);

		}

		function setDefaultGLState() {

			state.init();

			state.scissor(_currentScissor.copy(_scissor).multiplyScalar(_pixelRatio));
			state.viewport(_currentViewport.copy(_viewport).multiplyScalar(_pixelRatio));

			glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);

		}

		function resetGLState() {

			_currentProgram = null;
			_currentCamera = null;

			_currentGeometryProgram = '';
			_currentMaterialId = -1;

			state.reset();

		}

		setDefaultGLState();

		this.context = _gl;
		this.capabilities = capabilities;
		this.extensions = extensions;
		this.properties = properties;
		this.state = state;

		// shadow map

		// var shadowMap = new THREE.WebGLShadowMap( this, _lights, objects );

		// this.shadowMap = shadowMap;


		// Plugins

		// PI_BEGIN
		// var spritePlugin = new THREE.SpritePlugin( this, sprites );
		// var lensFlarePlugin = new THREE.LensFlarePlugin( this, lensFlares );
		// PI_END

		// API

		this.getContext = function () {

			return _gl;

		};

		this.getContextAttributes = function () {

			return _gl.getContextAttributes();

		};

		this.forceContextLoss = function () {

			extensions.get('WEBGL_lose_context').loseContext();

		};

		this.getMaxAnisotropy = (function () {

			var value;

			return function getMaxAnisotropy() {

				if (value !== undefined) return value;

				var extension = extensions.get('EXT_texture_filter_anisotropic');

				if (extension !== null) {

					value = _gl.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);

				} else {

					value = 0;

				}

				return value;

			};

		})();

		this.getPrecision = function () {

			return capabilities.precision;

		};

		this.getPixelRatio = function () {

			return _pixelRatio;

		};

		this.setPixelRatio = function (value) {

			if (value === undefined) return;

			_pixelRatio = value;

			this.setSize(_viewport.z, _viewport.w, false);

		};
		// PI_BEGIN
		this.getSize = function (obj) {
			obj = obj || {
				width: 0,
				height: 0
			};

			obj.width = _width;
			obj.height = _height;
			return obj;
		};
		// PI_END
		this.setSize = function (width, height, updateStyle) {

			_width = width;
			_height = height;

			_canvas.width = width * _pixelRatio;
			_canvas.height = height * _pixelRatio;

			if (updateStyle !== false) {

				_canvas.style.width = width + 'px';
				_canvas.style.height = height + 'px';

			}

			this.setViewport(0, 0, width, height);

		};

		this.setViewport = function (x, y, width, height) {

			state.viewport(_viewport.set(x, y, width, height));

		};

		this.setScissor = function (x, y, width, height) {

			state.scissor(_scissor.set(x, y, width, height));

		};

		this.setScissorTest = function (boolean) {

			state.setScissorTest(_scissorTest = boolean);

		};

		// PI_BEGIN
		this.updateGeometry = function (mesh) {
			objects.update(mesh);
		}

		// PI_END

		// Clearing

		this.getClearColor = function () {

			return _clearColor;

		};

		this.setClearColor = function (color, alpha) {

			_clearColor.set(color);

			_clearAlpha = alpha !== undefined ? alpha : 1;

			glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);

		};

		this.getClearAlpha = function () {

			return _clearAlpha;

		};

		this.setClearAlpha = function (alpha) {

			_clearAlpha = alpha;

			glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);

		};

		this.clear = function (color, depth, stencil) {

			var bits = 0;

			if (color === undefined || color) bits |= _gl.COLOR_BUFFER_BIT;
			if (depth === undefined || depth) bits |= _gl.DEPTH_BUFFER_BIT;
			if (stencil === undefined || stencil) bits |= _gl.STENCIL_BUFFER_BIT;

			_gl.clear(bits);

		};

		this.clearColor = function () {

			this.clear(true, false, false);

		};

		this.clearDepth = function () {

			this.clear(false, true, false);

		};

		this.clearStencil = function () {

			this.clear(false, false, true);

		};

		this.clearTarget = function (renderTarget, color, depth, stencil) {

			this.setRenderTarget(renderTarget);
			this.clear(color, depth, stencil);

		};

		// Reset

		this.resetGLState = resetGLState;

		this.dispose = function () {

			_canvas.removeEventListener('webglcontextlost', onContextLost, false);

		};

		// Events

		function onContextLost(event) {
			// PI_BEGIN
			alert("崩溃");
			// PI_END

			event.preventDefault();

			resetGLState();
			setDefaultGLState();

			properties.clear();

		}

		function onTextureDispose(event) {

			var texture = event.target;

			texture.removeEventListener('dispose', onTextureDispose);

			deallocateTexture(texture);

			_infoMemory.textures--;


		}

		function onRenderTargetDispose(event) {

			var renderTarget = event.target;

			renderTarget.removeEventListener('dispose', onRenderTargetDispose);

			deallocateRenderTarget(renderTarget);

			_infoMemory.textures--;

		}

		function onMaterialDispose(event) {

			var material = event.target;

			material.removeEventListener('dispose', onMaterialDispose);

			deallocateMaterial(material);

		}

		// Buffer deallocation

		function deallocateTexture(texture) {

			var textureProperties = properties.get(texture);

			if (texture.image && textureProperties.__image__webglTextureCube) {

				// cube texture

				_gl.deleteTexture(textureProperties.__image__webglTextureCube);

			} else {

				// 2D texture

				if (textureProperties.__webglInit === undefined) return;

				_gl.deleteTexture(textureProperties.__webglTexture);

			}

			// remove all webgl properties
			properties.delete(texture);

		}

		function deallocateRenderTarget(renderTarget) {

			var renderTargetProperties = properties.get(renderTarget);
			var textureProperties = properties.get(renderTarget.texture);

			if (!renderTarget) return;

			if (textureProperties.__webglTexture !== undefined) {

				_gl.deleteTexture(textureProperties.__webglTexture);

			}

			if (renderTarget.depthTexture) {

				renderTarget.depthTexture.dispose();

			}

			if (renderTarget instanceof THREE.WebGLRenderTargetCube) {

				for (var i = 0; i < 6; i++) {

					_gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer[i]);
					if (renderTargetProperties.__webglDepthbuffer) _gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer[i]);

				}

			} else {

				_gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
				if (renderTargetProperties.__webglDepthbuffer) _gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer);

			}

			properties.delete(renderTarget.texture);
			properties.delete(renderTarget);

		}

		function deallocateMaterial(material) {

			releaseMaterialProgramReference(material);

			properties.delete(material);

		}


		function releaseMaterialProgramReference(material) {

			var programInfo = properties.get(material).program;

			material.program = undefined;

			if (programInfo !== undefined) {

				programCache.releaseProgram(programInfo);

			}

		}

		// Buffer rendering

		this.renderBufferImmediate = function (object, program, material) {

			state.initAttributes();

			var buffers = properties.get(object);

			if (object.hasPositions && !buffers.position) buffers.position = _gl.createBuffer();
			if (object.hasNormals && !buffers.normal) buffers.normal = _gl.createBuffer();
			if (object.hasUvs && !buffers.uv) buffers.uv = _gl.createBuffer();
			if (object.hasColors && !buffers.color) buffers.color = _gl.createBuffer();

			var attributes = program.getAttributes();

			if (object.hasPositions) {

				_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.position);
				_gl.bufferData(_gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW);

				state.enableAttribute(attributes.position);
				_gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, false, 0, 0);

			}

			if (object.hasNormals) {

				_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.normal);

				if (material.type !== 'MeshPhongMaterial' && material.type !== 'MeshStandardMaterial' && material.type !== 'MeshPhysicalMaterial' && material.shading === THREE.FlatShading) {

					for (var i = 0, l = object.count * 3; i < l; i += 9) {

						var array = object.normalArray;

						var nx = (array[i + 0] + array[i + 3] + array[i + 6]) / 3;
						var ny = (array[i + 1] + array[i + 4] + array[i + 7]) / 3;
						var nz = (array[i + 2] + array[i + 5] + array[i + 8]) / 3;

						array[i + 0] = nx;
						array[i + 1] = ny;
						array[i + 2] = nz;

						array[i + 3] = nx;
						array[i + 4] = ny;
						array[i + 5] = nz;

						array[i + 6] = nx;
						array[i + 7] = ny;
						array[i + 8] = nz;

					}

				}

				_gl.bufferData(_gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW);

				state.enableAttribute(attributes.normal);

				_gl.vertexAttribPointer(attributes.normal, 3, _gl.FLOAT, false, 0, 0);

			}

			if (object.hasUvs && material.map) {

				_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.uv);
				_gl.bufferData(_gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW);

				state.enableAttribute(attributes.uv);

				_gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, false, 0, 0);

			}

			if (object.hasColors && material.vertexColors !== THREE.NoColors) {

				_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.color);
				_gl.bufferData(_gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW);

				state.enableAttribute(attributes.color);

				_gl.vertexAttribPointer(attributes.color, 3, _gl.FLOAT, false, 0, 0);

			}

			state.disableUnusedAttributes();

			_gl.drawArrays(_gl.TRIANGLES, 0, object.count);

			object.count = 0;

		};

		this.renderBufferDirect = function (camera, fog, geometry, material, object, group) {

			setMaterial(material);

			var program = setProgram(camera, fog, material, object);

			var updateBuffers = false;
			var geometryProgram = geometry.id + '_' + program.id + '_' + material.wireframe;

			if (geometryProgram !== _currentGeometryProgram) {

				_currentGeometryProgram = geometryProgram;
				updateBuffers = true;

			}

			// morph targets

			var morphTargetInfluences = object.morphTargetInfluences;

			if (morphTargetInfluences !== undefined) {

				var activeInfluences = [];

				for (var i = 0, l = morphTargetInfluences.length; i < l; i++) {

					var influence = morphTargetInfluences[i];
					activeInfluences.push([influence, i]);

				}

				activeInfluences.sort(absNumericalSort);

				if (activeInfluences.length > 8) {

					activeInfluences.length = 8;

				}

				var morphAttributes = geometry.morphAttributes;

				for (var i = 0, l = activeInfluences.length; i < l; i++) {

					var influence = activeInfluences[i];
					morphInfluences[i] = influence[0];

					if (influence[0] !== 0) {

						var index = influence[1];

						if (material.morphTargets === true && morphAttributes.position) geometry.addAttribute('morphTarget' + i, morphAttributes.position[index]);
						if (material.morphNormals === true && morphAttributes.normal) geometry.addAttribute('morphNormal' + i, morphAttributes.normal[index]);

					} else {

						if (material.morphTargets === true) geometry.removeAttribute('morphTarget' + i);
						if (material.morphNormals === true) geometry.removeAttribute('morphNormal' + i);

					}

				}

				program.getUniforms().setValue(
					_gl, 'morphTargetInfluences', morphInfluences);

				updateBuffers = true;

			}

			//

			var index = geometry.index;
			var position = geometry.attributes.position;

			if (material.wireframe === true) {

				index = objects.getWireframeAttribute(geometry);

			}

			var renderer;

			if (index !== null) {

				renderer = indexedBufferRenderer;
				renderer.setIndex(index);

			} else {

				renderer = bufferRenderer;

			}

			if (updateBuffers) {

				setupVertexAttributes(material, program, geometry);

				if (index !== null) {

					_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, objects.getAttributeBuffer(index));

				}

			}

			//

			var dataStart = 0;
			var dataCount = Infinity;

			if (index !== null) {

				dataCount = index.count;

			} else if (position !== undefined) {

				dataCount = position.count;

			}

			var rangeStart = geometry.drawRange.start;
			var rangeCount = geometry.drawRange.count;

			var groupStart = group !== null ? group.start : 0;
			var groupCount = group !== null ? group.count : Infinity;

			var drawStart = Math.max(dataStart, rangeStart, groupStart);
			var drawEnd = Math.min(dataStart + dataCount, rangeStart + rangeCount, groupStart + groupCount) - 1;

			var drawCount = Math.max(0, drawEnd - drawStart + 1);

			//

			if (object instanceof THREE.Mesh) {

				if (material.wireframe === true) {

					state.setLineWidth(material.wireframeLinewidth * getTargetPixelRatio());
					renderer.setMode(_gl.LINES);

				} else {

					switch (object.drawMode) {

						case THREE.TrianglesDrawMode:
							renderer.setMode(_gl.TRIANGLES);
							break;

						case THREE.TriangleStripDrawMode:
							renderer.setMode(_gl.TRIANGLE_STRIP);
							break;

						case THREE.TriangleFanDrawMode:
							renderer.setMode(_gl.TRIANGLE_FAN);
							break;

					}

				}


			} else if (object instanceof THREE.Line) {

				var lineWidth = material.linewidth;

				if (lineWidth === undefined) lineWidth = 1; // Not using Line*Material

				state.setLineWidth(lineWidth * getTargetPixelRatio());

				if (object instanceof THREE.LineSegments) {

					renderer.setMode(_gl.LINES);

				} else {

					renderer.setMode(_gl.LINE_STRIP);

				}

			} else if (object instanceof THREE.Points) {

				renderer.setMode(_gl.POINTS);

			}

			if (geometry instanceof THREE.InstancedBufferGeometry) {

				if (geometry.maxInstancedCount > 0) {

					renderer.renderInstances(geometry, drawStart, drawCount);

				}

			} else {

				renderer.render(drawStart, drawCount);

			}

		};

		function setupVertexAttributes(material, program, geometry, startIndex) {

			var extension;

			if (geometry instanceof THREE.InstancedBufferGeometry) {

				extension = extensions.get('ANGLE_instanced_arrays');

				if (extension === null) {

					console.error('THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
					return;

				}

			}

			if (startIndex === undefined) startIndex = 0;

			state.initAttributes();

			var geometryAttributes = geometry.attributes;

			var programAttributes = program.getAttributes();

			var materialDefaultAttributeValues = material.defaultAttributeValues;

			for (var name in programAttributes) {

				var programAttribute = programAttributes[name];

				if (programAttribute >= 0) {

					var geometryAttribute = geometryAttributes[name];

					if (geometryAttribute !== undefined) {

						var type = _gl.FLOAT;
						var array = geometryAttribute.array;
						var normalized = geometryAttribute.normalized;

						if (array instanceof Float32Array) {

							type = _gl.FLOAT;

						} else if (array instanceof Float64Array) {

							console.warn("Unsupported data buffer format: Float64Array");

						} else if (array instanceof Uint16Array) {

							type = _gl.UNSIGNED_SHORT;

						} else if (array instanceof Int16Array) {

							type = _gl.SHORT;

						} else if (array instanceof Uint32Array) {

							type = _gl.UNSIGNED_INT;

						} else if (array instanceof Int32Array) {

							type = _gl.INT;

						} else if (array instanceof Int8Array) {

							type = _gl.BYTE;

						} else if (array instanceof Uint8Array) {

							type = _gl.UNSIGNED_BYTE;

						}

						var size = geometryAttribute.itemSize;
						var buffer = objects.getAttributeBuffer(geometryAttribute);

						if (geometryAttribute instanceof THREE.InterleavedBufferAttribute) {

							var data = geometryAttribute.data;
							var stride = data.stride;
							var offset = geometryAttribute.offset;

							if (data instanceof THREE.InstancedInterleavedBuffer) {

								state.enableAttributeAndDivisor(programAttribute, data.meshPerAttribute, extension);

								if (geometry.maxInstancedCount === undefined) {

									geometry.maxInstancedCount = data.meshPerAttribute * data.count;

								}

							} else {

								state.enableAttribute(programAttribute);

							}

							_gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
							_gl.vertexAttribPointer(programAttribute, size, type, normalized, stride * data.array.BYTES_PER_ELEMENT, (startIndex * stride + offset) * data.array.BYTES_PER_ELEMENT);

						} else {

							if (geometryAttribute instanceof THREE.InstancedBufferAttribute) {

								state.enableAttributeAndDivisor(programAttribute, geometryAttribute.meshPerAttribute, extension);

								if (geometry.maxInstancedCount === undefined) {

									geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;

								}

							} else {

								state.enableAttribute(programAttribute);

							}

							_gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
							_gl.vertexAttribPointer(programAttribute, size, type, normalized, 0, startIndex * size * geometryAttribute.array.BYTES_PER_ELEMENT);

						}

					} else if (materialDefaultAttributeValues !== undefined) {

						var value = materialDefaultAttributeValues[name];

						if (value !== undefined) {

							switch (value.length) {

								case 2:
									_gl.vertexAttrib2fv(programAttribute, value);
									break;

								case 3:
									_gl.vertexAttrib3fv(programAttribute, value);
									break;

								case 4:
									_gl.vertexAttrib4fv(programAttribute, value);
									break;

								default:
									_gl.vertexAttrib1fv(programAttribute, value);

							}

						}

					}

				}

			}

			state.disableUnusedAttributes();

		}

		// Sorting

		function absNumericalSort(a, b) {

			return Math.abs(b[0]) - Math.abs(a[0]);

		}

		function painterSortStable(a, b) {

			if (a.object.renderOrder !== b.object.renderOrder) {

				return a.object.renderOrder - b.object.renderOrder;

			} else if (a.material.id !== b.material.id) {

				return a.material.id - b.material.id;

			} else if (a.z !== b.z) {

				return a.z - b.z;

			} else {

				return a.id - b.id;

			}

		}

		function reversePainterSortStable(a, b) {

			if (a.object.renderOrder !== b.object.renderOrder) {

				return a.object.renderOrder - b.object.renderOrder;

			}
			if (a.z !== b.z) {

				return b.z - a.z;

			} else {

				return a.id - b.id;

			}

		}

		// PI_BEGIN
		// object: Object3D
		// delta: time, unit: second
		function updateAnimation(map, delta) {
			map.forEach(function (v, k) {
				var b;
				if (v.aniBox && (b = v.aniBox[v.play])) {
					if (b.max.x - b.min.x != 0) {
						var box3 = new THREE.Box3();
						box3.copy(b).applyMatrix4(v.matrixWorld);

						if (!_frustum.intersectsBox(box3)) return;
					}
				}
				v.update(delta);
			});
		}

		function updateDirts(dirts, camera) {
			for (var i = 0; i < dirts.length; ++i) {
				if (dirts[i].dirt === true)
					if (dirts[i].mode === 2) {
						updateBulletinBoard(dirts[i], camera);
					} else {
						dirts[i].updateMatrixWorld();
					}
			}
			dirts.length = 0;
		}

		function updateBulletinBoards(bulletinBoards, camera) {
			for (var i = 0; i < bulletinBoards.length; ++i) {
				updateBulletinBoard(bulletinBoards[i], camera);
			}
		}

		function updateBulletinBoard(bulletinBoard, camera) {}

		function objDirt(obj) {
			if (obj.dirt) {
				return true;
			}
			if (obj.parent) {
				return objDirt(obj.parent);
			} else {
				return false;
			}
		}
		// PI_END

		// Rendering

		this.render = function (scene, camera, deltaTime, renderTarget, forceClear) {

			if (renderTarget === undefined) {
				renderTarget = null;
			}
			this.setRenderTarget(renderTarget);

			if (this.autoClear || forceClear) {

				this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);

			}

			if (!camera) return;

			var fog = scene.fog;

			// reset caching for this frame

			_currentGeometryProgram = '';
			_currentMaterialId = -1;
			_currentCamera = null;

			var dirts = scene.dirts;
			var cameraDirt = objDirt(camera);
			updateDirts(dirts, camera); //更新transform改变过的物体的世界矩阵,包括相机，公告板

			camera.matrixWorldInverse.getInverse(camera.matrixWorld);
			_projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
			_frustum.setFromMatrix(_projScreenMatrix);

			if (cameraDirt) {
				updateBulletinBoards(scene.BulletinBoards, camera);
			}

			var animObjectMap = scene.animObjectMap;
			updateAnimation(animObjectMap, deltaTime); //更新动画
			// update scene graph
			//if (scene.autoUpdate === true) scene.updateMatrixWorld();
			//projectObject(scene, camera);//相机裁剪
			updateDirts(dirts, camera); //更新动画改变了transform的物体的世界矩阵


			lights.length = 0;

			opaqueObjectsLastIndex = -1;
			transparentObjectsLastIndex = -1;

			sprites.length = 0;
			lensFlares.length = 0;

			setupGlobalClippingPlanes(this.clippingPlanes, camera);

			projectObject(scene, camera);


			opaqueObjects.length = opaqueObjectsLastIndex + 1;
			transparentObjects.length = transparentObjectsLastIndex + 1;

			if (_this.sortObjects === true) {

				opaqueObjects.sort(painterSortStable);
				transparentObjects.sort(reversePainterSortStable);

			}

			//

			if (_clippingEnabled) {

				_clipRenderingShadows = true;
				setupClippingPlanes(null);

			}

			// setupShadows( lights );

			// shadowMap.render( scene, camera );

			setupLights(lights, camera);

			if (_clippingEnabled) {

				_clipRenderingShadows = false;
				resetGlobalClippingState();

			}

			//

			_infoRender.calls = 0;
			_infoRender.vertices = 0;
			_infoRender.faces = 0;
			_infoRender.points = 0;

			if (renderTarget === undefined) {

				renderTarget = null;

			}


			if (scene.overrideMaterial) {

				var overrideMaterial = scene.overrideMaterial;

				renderObjects(opaqueObjects, camera, fog, overrideMaterial);
				renderObjects(transparentObjects, camera, fog, overrideMaterial);

			} else {

				// opaque pass (front-to-back order)

				state.setBlending(THREE.NoBlending);
				renderObjects(opaqueObjects, camera, fog);
				opaqueObjects.length = 0;

				// transparent pass (back-to-front order)

				renderObjects(transparentObjects, camera, fog);
				transparentObjects.length = 0;

			}

			// custom render plugins (post pass)

			// spritePlugin.render( scene, camera );
			// lensFlarePlugin.render( scene, camera, _currentViewport );

			// Generate mipmap if we're using any kind of mipmap filtering

			if (renderTarget) {

				var texture = renderTarget.texture;

				if (texture.generateMipmaps && isPowerOfTwo(renderTarget) &&
					texture.minFilter !== THREE.NearestFilter &&
					texture.minFilter !== THREE.LinearFilter) {

					updateRenderTargetMipmap(renderTarget);

				}

			}

			// Ensure depth buffer writing is enabled so it can be cleared on next render

			state.setDepthTest(true);
			state.setDepthWrite(true);
			state.setColorWrite(true);

			// _gl.finish();

		};

		function pushRenderItem(object, geometry, material, z, group) {

			var array, index;

			// allocate the next position in the appropriate array

			if (material.transparent) {

				array = transparentObjects;
				index = ++transparentObjectsLastIndex;

			} else {

				array = opaqueObjects;
				index = ++opaqueObjectsLastIndex;

			}

			// recycle existing render item or grow the array

			var renderItem = array[index];

			if (renderItem !== undefined) {

				renderItem.id = object.id;
				renderItem.object = object;
				renderItem.geometry = geometry;
				renderItem.material = material;
				renderItem.z = _vector3.z;
				renderItem.group = group;

			} else {

				renderItem = {
					id: object.id,
					object: object,
					geometry: geometry,
					material: material,
					z: _vector3.z,
					group: group
				};

				// assert( index === array.length );
				array.push(renderItem);

			}

		}

		function isObjectViewable(object) {

			var geometry = object.geometry;

			if (geometry.boundingSphere === null)
				geometry.computeBoundingSphere();

			var sphere = _sphere.
			copy(geometry.boundingSphere).
			applyMatrix4(object.matrixWorld);

			if (!_frustum.intersectsSphere(sphere)) return false;
			if (_numClippingPlanes === 0) return true;

			var planes = _this.clippingPlanes,

				center = sphere.center,
				negRad = -sphere.radius,
				i = 0;

			do {

				// out when deeper than radius in the negative halfspace
				if (planes[i].distanceToPoint(center) < negRad) return false;

			} while (++i !== _numClippingPlanes);

			return true;

		}

		function projectObject(object, camera) {

			if (!object.visible) return;

			if (object.layers.test(camera.layers)) {

				if (object instanceof THREE.Light) {

					lights.push(object);

				} else if (object instanceof THREE.Sprite) {

					if (object.frustumCulled === false || isObjectViewable(object) === true) {

						sprites.push(object);

					}
				} else if (object instanceof THREE.LensFlare) {

					lensFlares.push(object);
				} else if (object instanceof THREE.ImmediateRenderObject) {

					if (_this.sortObjects === true) {

						_vector3.setFromMatrixPosition(object.matrixWorld);
						_vector3.applyProjection(_projScreenMatrix);

					}

					pushRenderItem(object, null, object.material, _vector3.z, null);

				} else if (object.skeleton && object.skeleton instanceof THREE.Skeleton) {
					// PI_BEGIN
					object.skeleton.update();
					// PI_END

				} else if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
					// PI_BEGIN
					if (!object.ready) return;

					if (object.geometry instanceof THREE.BufferGeometry) {
						if (!object.geometry.attributes.position) return;
					}

					// PI_END
					if (object.frustumCulled === false || isObjectViewable(object) === true) {


						if (_this.sortObjects === true) {
							if (object.geometry.boundingBox) {
								object.geometry.boundingBox.center(_vector3);
								_vector3.applyMatrix4(object.matrixWorld);
							} else {
								_vector3.setFromMatrixPosition(object.matrixWorld);
							}
							_vector3.applyProjection(_projScreenMatrix);

						}

						var geometry = objects.update(object);

						var material = object.material;
						if (Array.isArray(material)) {
							var groups = geometry.groups;

							for (var i = 0, l = groups.length; i < l; i++) {

								var group = groups[i];
								var groupMaterial = material[group.materialIndex];

								if (groupMaterial && groupMaterial.visible) {

									pushRenderItem(object, geometry, groupMaterial, _vector3.z, group);

								}

							}

						} else {

							pushRenderItem(object, geometry, material, _vector3.z, null);


						}

					}

				}

			}

			var children = object.children;

			for (var i = 0, l = children.length; i < l; i++) {

				projectObject(children[i], camera);

			}

		}

		function renderObjects(renderList, camera, fog, overrideMaterial) {

			for (var i = 0, l = renderList.length; i < l; i++) {

				var renderItem = renderList[i];

				var object = renderItem.object;
				var geometry = renderItem.geometry;
				var material = overrideMaterial === undefined ? renderItem.material : overrideMaterial;
				var group = renderItem.group;

				object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
				object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

				if (object instanceof THREE.ImmediateRenderObject) {

					setMaterial(material);

					var program = setProgram(camera, fog, material, object);

					_currentGeometryProgram = '';

					object.render(function (object) {

						_this.renderBufferImmediate(object, program, material);

					});

				} else {

					_this.renderBufferDirect(camera, fog, geometry, material, object, group);

				}

			}

		}

		function initMaterial(material, fog, object) {

			var materialProperties = properties.get(material);

			var parameters = programCache.getParameters(
				material, _lights, fog, _numClippingPlanes, object);

			var code = programCache.getProgramCode(material, parameters);

			var program = materialProperties.program;
			var programChange = true;

			if (program === undefined) {

				// new material
				material.addEventListener('dispose', onMaterialDispose);

			} else if (program.code !== code) {

				// changed glsl or parameters
				releaseMaterialProgramReference(material);

			} else if (parameters.shaderID !== undefined) {

				// same glsl and uniform list
				return;

			} else {

				// only rebuild uniform list
				programChange = false;

			}

			if (programChange) {

				if (parameters.shaderID) {

					var shader = THREE.ShaderLib[parameters.shaderID];

					materialProperties.__webglShader = {
						name: material.type,
						uniforms: THREE.UniformsUtils.clone(shader.uniforms),
						vertexShader: shader.vertexShader,
						fragmentShader: shader.fragmentShader
					};

				} else {

					materialProperties.__webglShader = {
						name: material.type,
						uniforms: material.uniforms,
						vertexShader: material.vertexShader,
						fragmentShader: material.fragmentShader
					};

				}

				material.__webglShader = materialProperties.__webglShader;

				program = programCache.acquireProgram(material, parameters, code);

				materialProperties.program = program;
				material.program = program;

			}

			var attributes = program.getAttributes();

			if (material.morphTargets) {

				material.numSupportedMorphTargets = 0;

				for (var i = 0; i < _this.maxMorphTargets; i++) {

					if (attributes['morphTarget' + i] >= 0) {

						material.numSupportedMorphTargets++;

					}

				}

			}

			if (material.morphNormals) {

				material.numSupportedMorphNormals = 0;

				for (var i = 0; i < _this.maxMorphNormals; i++) {

					if (attributes['morphNormal' + i] >= 0) {

						material.numSupportedMorphNormals++;

					}

				}

			}

			var uniforms = materialProperties.__webglShader.uniforms;

			if (!(material instanceof THREE.ShaderMaterial) &&
				!(material instanceof THREE.RawShaderMaterial) ||
				material.clipping === true) {

				materialProperties.numClippingPlanes = _numClippingPlanes;
				uniforms.clippingPlanes = _clippingPlanesUniform;

			}

			if (material instanceof THREE.MeshPhongMaterial ||
				material instanceof THREE.MeshLambertMaterial ||
				material instanceof THREE.MeshStandardMaterial ||
				material.lights) {

				// store the light setup it was created for

				materialProperties.lightsHash = _lights.hash;

				// wire up the material to this renderer's lighting state

				uniforms.ambientLightColor.value = _lights.ambient;
				uniforms.directionalLights.value = _lights.directional;
				uniforms.spotLights.value = _lights.spot;
				uniforms.pointLights.value = _lights.point;
				uniforms.hemisphereLights.value = _lights.hemi;

				uniforms.directionalShadowMap.value = _lights.directionalShadowMap;
				uniforms.directionalShadowMatrix.value = _lights.directionalShadowMatrix;
				uniforms.spotShadowMap.value = _lights.spotShadowMap;
				uniforms.spotShadowMatrix.value = _lights.spotShadowMatrix;
				uniforms.pointShadowMap.value = _lights.pointShadowMap;
				uniforms.pointShadowMatrix.value = _lights.pointShadowMatrix;

			}

			var progUniforms = materialProperties.program.getUniforms(),
				uniformsList =
				THREE.WebGLUniforms.seqWithValue(progUniforms.seq, uniforms);

			materialProperties.uniformsList = uniformsList;
			materialProperties.dynamicUniforms =
				THREE.WebGLUniforms.splitDynamic(uniformsList, uniforms);

		}

		function setMaterial(material) {

			setMaterialFaces(material);

			if (material.transparent === true) {

				state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);

			} else {

				state.setBlending(THREE.NoBlending);

			}

			state.setDepthFunc(material.depthFunc);
			state.setDepthTest(material.depthTest);
			state.setDepthWrite(material.depthWrite);
			state.setColorWrite(material.colorWrite);
			state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);

		}

		function setMaterialFaces(material) {

			material.side !== THREE.DoubleSide ? state.enable(_gl.CULL_FACE) : state.disable(_gl.CULL_FACE);
			state.setFlipSided(material.side === THREE.BackSide);

		}

		var _mat = new THREE.Matrix4();

		function setProgram(camera, fog, material, object) {

			_usedTextureUnits = 0;

			var materialProperties = properties.get(material);

			if (_clippingEnabled) {

				if (_localClippingEnabled || camera !== _currentCamera) {

					var useCache =
						camera === _currentCamera &&
						material.id === _currentMaterialId;

					// we might want to call this function with some ClippingGroup
					// object instead of the material, once it becomes feasible
					// (#8465, #8379)
					setClippingState(
						material.clippingPlanes, material.clipShadows,
						camera, materialProperties, useCache);

				}

				if (materialProperties.numClippingPlanes !== undefined &&
					materialProperties.numClippingPlanes !== _numClippingPlanes) {

					material.needsUpdate = true;

				}

			}

			if (materialProperties.program === undefined) {

				material.needsUpdate = true;

			}

			if (materialProperties.lightsHash !== undefined &&
				materialProperties.lightsHash !== _lights.hash) {

				material.needsUpdate = true;

			}

			if (material.needsUpdate) {

				initMaterial(material, fog, object);
				material.needsUpdate = false;

			}

			var refreshProgram = false;
			var refreshMaterial = false;
			var refreshLights = false;

			var program = materialProperties.program,
				p_uniforms = program.getUniforms(),
				m_uniforms = materialProperties.__webglShader.uniforms;

			if (program.id !== _currentProgram) {

				_gl.useProgram(program.program);
				_currentProgram = program.id;

				refreshProgram = true;
				refreshMaterial = true;
				refreshLights = true;

			}

			if (material.id !== _currentMaterialId) {

				_currentMaterialId = material.id;

				refreshMaterial = true;

			}

			if (refreshProgram || camera !== _currentCamera) {

				p_uniforms.set(_gl, camera, 'projectionMatrix');

				if (capabilities.logarithmicDepthBuffer) {

					p_uniforms.setValue(_gl, 'logDepthBufFC',
						2.0 / (Math.log(camera.far + 1.0) / Math.LN2));

				}


				if (camera !== _currentCamera) {

					_currentCamera = camera;

					// lighting uniforms depend on the camera so enforce an update
					// now, in case this material supports lights - or later, when
					// the next material that does gets activated:

					refreshMaterial = true; // set to true on material change
					refreshLights = true; // remains set until update done

				}

				// load material specific uniforms
				// (shader material also gets them for the sake of genericity)

				if (material instanceof THREE.ShaderMaterial ||
					material instanceof THREE.MeshPhongMaterial ||
					material instanceof THREE.MeshStandardMaterial ||
					material.envMap) {

					var uCamPos = p_uniforms.map.cameraPosition;

					if (uCamPos !== undefined) {

						uCamPos.setValue(_gl,
							_vector3.setFromMatrixPosition(camera.matrixWorld));

					}

				}

				if (material instanceof THREE.MeshPhongMaterial ||
					material instanceof THREE.MeshLambertMaterial ||
					material instanceof THREE.MeshBasicMaterial ||
					material instanceof THREE.MeshStandardMaterial ||
					material instanceof THREE.ShaderMaterial ||
					material.skinning) {

					p_uniforms.setValue(_gl, 'viewMatrix', camera.matrixWorldInverse);

				}

				p_uniforms.set(_gl, _this, 'toneMappingExposure');
				p_uniforms.set(_gl, _this, 'toneMappingWhitePoint');

			}

			// PI_BEGIN
			if (material.enableGray) {

				p_uniforms.setOptional(_gl, object, 'isGray');

			}

			// PI_END

			// skinning uniforms must be set even if material didn't change
			// auto-setting of texture unit for bone texture must go before other textures
			// not sure why, but otherwise weird things happen

			if (material.skinning) {


				var skeleton = object.skeletonRef;

				if (skeleton) {

					for (var i = 0; i < object.boneIndexs.length; ++i) {
						var m = skeleton.boneMatrices[object.boneIndexs[i]];
						_mat.multiplyMatrices(m, object.matrix);
						_mat.toArray(object.boneMatrices, i * 16);
					}

					if (capabilities.floatVertexTextures && object.useVertexTexture) {
						object.boneTexture.needsUpdate = true;
						p_uniforms.set(_gl, object, 'boneTexture');
						p_uniforms.set(_gl, object, 'boneTextureWidth');
						p_uniforms.set(_gl, object, 'boneTextureHeight');
					} else {
						p_uniforms.setOptional(_gl, object, 'boneMatrices');
					}

				}

			}

			if (refreshMaterial) {

				if (material instanceof THREE.MeshPhongMaterial ||
					material instanceof THREE.MeshLambertMaterial ||
					material instanceof THREE.MeshStandardMaterial ||
					material.lights) {

					// the current material requires lighting info

					// note: all lighting uniforms are always set correctly
					// they simply reference the renderer's state for their
					// values
					//
					// use the current material's .needsUpdate flags to set
					// the GL state when required

					markUniformsLightsNeedsUpdate(m_uniforms, refreshLights);

				}

				// refresh uniforms common to several materials

				if (fog && material.fog) {

					refreshUniformsFog(m_uniforms, fog);

				}

				if (material instanceof THREE.MeshBasicMaterial ||
					material instanceof THREE.MeshLambertMaterial ||
					material instanceof THREE.MeshPhongMaterial ||
					material instanceof THREE.MeshStandardMaterial ||
					material instanceof THREE.MeshDepthMaterial) {

					refreshUniformsCommon(m_uniforms, material);

				}

				// refresh single material specific uniforms

				if (material instanceof THREE.LineBasicMaterial) {

					refreshUniformsLine(m_uniforms, material);

				} else if (material instanceof THREE.LineDashedMaterial) {

					refreshUniformsLine(m_uniforms, material);
					refreshUniformsDash(m_uniforms, material);

				} else if (material instanceof THREE.PointsMaterial) {

					refreshUniformsPoints(m_uniforms, material);

				} else if (material instanceof THREE.MeshLambertMaterial) {

					refreshUniformsLambert(m_uniforms, material);

				} else if (material instanceof THREE.MeshPhongMaterial) {

					refreshUniformsPhong(m_uniforms, material);

				} else if (material instanceof THREE.MeshPhysicalMaterial) {

					refreshUniformsPhysical(m_uniforms, material);

				} else if (material instanceof THREE.MeshStandardMaterial) {

					refreshUniformsStandard(m_uniforms, material);

				} else if (material instanceof THREE.MeshDepthMaterial) {

					if (material.displacementMap) {

						m_uniforms.displacementMap.value = material.displacementMap;
						m_uniforms.displacementScale.value = material.displacementScale;
						m_uniforms.displacementBias.value = material.displacementBias;

					}

				} else if (material instanceof THREE.MeshNormalMaterial) {

					m_uniforms.opacity.value = material.opacity;

				} else if (material instanceof THREE.MeshParticlesMaterial) {
					refreshUniformsCommon(m_uniforms, material);
					refreshUniformsExtra(m_uniforms, material);
				} else if (material instanceof THREE.MeshT4M3Material || material instanceof THREE.MeshT4M2Material) {
					refreshUniformsTerraint(m_uniforms, material);
				}

				THREE.WebGLUniforms.upload(
					_gl, materialProperties.uniformsList, m_uniforms, _this);

			}


			// common matrices

			p_uniforms.set(_gl, object, 'modelViewMatrix');
			p_uniforms.set(_gl, object, 'normalMatrix');
			p_uniforms.setValue(_gl, 'modelMatrix', object.matrixWorld);


			// dynamic uniforms

			var dynUniforms = materialProperties.dynamicUniforms;

			if (dynUniforms !== null) {

				THREE.WebGLUniforms.evalDynamic(
					dynUniforms, m_uniforms, object, camera);

				THREE.WebGLUniforms.upload(_gl, dynUniforms, m_uniforms, _this);

			}

			return program;

		}

		function refreshUniformsTerraint(uniforms, material) {
			uniforms._splat0.value = material._Splat0;
			uniforms._splat1.value = material._Splat1;
			if (material._Splat2)
				uniforms._splat2.value = material._Splat2;
			uniforms._control.value = material._Control;

			if (material._splat2st)
				uniforms._splat2st.value = material._splat2st;
			uniforms._splat1st.value = material._splat1st;
			uniforms._splat0st.value = material._splat0st;
			uniforms._controlst.value = material._controlst;

			if (material.lightMap)
				uniforms.lightMap.value = material.lightMap;
			if (material.lightmapst)
				uniforms.lightmapst.value = material.lightmapst;
			if (material.lightMapIntensity != undefined)
				uniforms.lightMapIntensity.value = material.lightMapIntensity;
		}

		function refreshUniformsExtra(uniforms, material) {
			uniforms.tintColor.value = material.tintColor;
			uniforms.tintOpacity.value = material.tintOpacity;
		}

		// Uniforms (refresh uniforms objects)

		function refreshUniformsCommon(uniforms, material) {

			uniforms.opacity.value = material.opacity;

			uniforms.diffuse.value = material.color;

			if (material.hsvValue) {
				uniforms.hsvValue.value.copy(material.hsvValue);
			}

			if (material.emissive) {

				uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);

			}

			uniforms.map.value = material.map;
			uniforms.specularMap.value = material.specularMap;
			uniforms.alphaMap.value = material.alphaMap;

			if (material.aoMap) {

				uniforms.aoMap.value = material.aoMap;
				uniforms.aoMapIntensity.value = material.aoMapIntensity;

			}

			// uv repeat and offset setting priorities
			// 1. color map
			// 2. specular map
			// 3. normal map
			// 4. bump map
			// 5. alpha map
			// 6. emissive map

			var uvScaleMap;

			if (material.map) {

				uvScaleMap = material.map;

			} else if (material.specularMap) {

				uvScaleMap = material.specularMap;

			} else if (material.displacementMap) {

				uvScaleMap = material.displacementMap;

			} else if (material.normalMap) {

				uvScaleMap = material.normalMap;

			} else if (material.bumpMap) {

				uvScaleMap = material.bumpMap;

			} else if (material.roughnessMap) {

				uvScaleMap = material.roughnessMap;

			} else if (material.metalnessMap) {

				uvScaleMap = material.metalnessMap;

			} else if (material.alphaMap) {

				uvScaleMap = material.alphaMap;

			} else if (material.emissiveMap) {

				uvScaleMap = material.emissiveMap;

			}

			if (uvScaleMap !== undefined) {

				if (uvScaleMap instanceof THREE.WebGLRenderTarget) {

					uvScaleMap = uvScaleMap.texture;

				}

			}

			if (uvScaleMap !== undefined) {

				uniforms.mapst.value.copy(material.mapst);

			}

			uniforms.envMap.value = material.envMap;
			uniforms.flipEnvMap.value = (material.envMap instanceof THREE.WebGLRenderTargetCube) ? 1 : -1;

			uniforms.reflectivity.value = material.reflectivity;
			uniforms.refractionRatio.value = material.refractionRatio;

		}

		function refreshUniformsLine(uniforms, material) {

			uniforms.diffuse.value = material.color;
			uniforms.opacity.value = material.opacity;

		}

		function refreshUniformsDash(uniforms, material) {

			uniforms.dashSize.value = material.dashSize;
			uniforms.totalSize.value = material.dashSize + material.gapSize;
			uniforms.scale.value = material.scale;

		}

		function refreshUniformsPoints(uniforms, material) {

			uniforms.diffuse.value = material.color;
			uniforms.opacity.value = material.opacity;
			uniforms.size.value = material.size * _pixelRatio;
			uniforms.scale.value = _canvas.clientHeight * 0.5;

			uniforms.map.value = material.map;

			if (material.map !== null) {

				var offset = material.map.offset;
				var repeat = material.map.repeat;

				uniforms.mapst.value.set(repeat.x, repeat.y, offset.x, offset.y);

			}

		}

		function refreshUniformsFog(uniforms, fog) {

			uniforms.fogColor.value = fog.color;

			if (fog instanceof THREE.Fog) {

				uniforms.fogNear.value = fog.near;
				uniforms.fogFar.value = fog.far;

			} else if (fog instanceof THREE.FogExp2) {

				uniforms.fogDensity.value = fog.density;
			}

		}

		function refreshUniformsLightmap(uniforms, material) {

			if (material.lightMap) {

				uniforms.lightmapst.value.copy(material.lightmapst);

				uniforms.lightMap.value = material.lightMap;
				uniforms.lightMapIntensity.value = material.lightMapIntensity;

			}

		}

		function refreshUniformsLambert(uniforms, material) {

			if (material.lightMap) {

				uniforms.lightMap.value = material.lightMap;
				uniforms.lightMapIntensity.value = material.lightMapIntensity;

			}

			if (material.emissiveMap) {

				uniforms.emissiveMap.value = material.emissiveMap;

			}

		}

		function refreshUniformsPhong(uniforms, material) {

			uniforms.specular.value = material.specular;
			uniforms.shininess.value = Math.max(material.shininess, 1e-4); // to prevent pow( 0.0, 0.0 )

			if (material.lightMap) {

				uniforms.lightMap.value = material.lightMap;
				uniforms.lightMapIntensity.value = material.lightMapIntensity;

			}

			if (material.emissiveMap) {

				uniforms.emissiveMap.value = material.emissiveMap;

			}

			if (material.bumpMap) {

				uniforms.bumpMap.value = material.bumpMap;
				uniforms.bumpScale.value = material.bumpScale;

			}

			if (material.normalMap) {

				uniforms.normalMap.value = material.normalMap;
				uniforms.normalScale.value.copy(material.normalScale);

			}

			if (material.displacementMap) {

				uniforms.displacementMap.value = material.displacementMap;
				uniforms.displacementScale.value = material.displacementScale;
				uniforms.displacementBias.value = material.displacementBias;

			}

		}

		function refreshUniformsStandard(uniforms, material) {

			uniforms.roughness.value = material.roughness;
			uniforms.metalness.value = material.metalness;

			if (material.roughnessMap) {

				uniforms.roughnessMap.value = material.roughnessMap;

			}

			if (material.metalnessMap) {

				uniforms.metalnessMap.value = material.metalnessMap;

			}

			if (material.lightMap) {

				uniforms.lightMap.value = material.lightMap;
				uniforms.lightMapIntensity.value = material.lightMapIntensity;

			}

			if (material.emissiveMap) {

				uniforms.emissiveMap.value = material.emissiveMap;

			}

			if (material.bumpMap) {

				uniforms.bumpMap.value = material.bumpMap;
				uniforms.bumpScale.value = material.bumpScale;

			}

			if (material.normalMap) {

				uniforms.normalMap.value = material.normalMap;
				uniforms.normalScale.value.copy(material.normalScale);

			}

			if (material.displacementMap) {

				uniforms.displacementMap.value = material.displacementMap;
				uniforms.displacementScale.value = material.displacementScale;
				uniforms.displacementBias.value = material.displacementBias;

			}

			if (material.envMap) {

				//uniforms.envMap.value = material.envMap; // part of uniforms common
				uniforms.envMapIntensity.value = material.envMapIntensity;

			}

		}

		function refreshUniformsPhysical(uniforms, material) {

			refreshUniformsStandard(uniforms, material);

		}

		// If uniforms are marked as clean, they don't need to be loaded to the GPU.

		function markUniformsLightsNeedsUpdate(uniforms, value) {

			uniforms.ambientLightColor.needsUpdate = value;

			uniforms.directionalLights.needsUpdate = value;
			uniforms.pointLights.needsUpdate = value;
			uniforms.spotLights.needsUpdate = value;
			uniforms.hemisphereLights.needsUpdate = value;

		}

		// Lighting

		function setupShadows(lights) {

			var lightShadowsLength = 0;

			for (var i = 0, l = lights.length; i < l; i++) {

				var light = lights[i];

				if (light.castShadow) {

					_lights.shadows[lightShadowsLength++] = light;

				}

			}

			_lights.shadows.length = lightShadowsLength;

		}

		function setupLights(lights, camera) {

			var l, ll, light,
				r = 0,
				g = 0,
				b = 0,
				color,
				intensity,
				distance,

				viewMatrix = camera.matrixWorldInverse,

				directionalLength = 0,
				pointLength = 0,
				spotLength = 0,
				hemiLength = 0;

			for (l = 0, ll = lights.length; l < ll; l++) {

				light = lights[l];

				color = light.color;
				intensity = light.intensity;
				distance = light.distance;

				if (light instanceof THREE.AmbientLight) {

					r += color.r * intensity;
					g += color.g * intensity;
					b += color.b * intensity;

				} else if (light instanceof THREE.DirectionalLight) {

					var uniforms = lightCache.get(light);

					uniforms.color.copy(light.color).multiplyScalar(light.intensity);
					uniforms.direction.setFromMatrixPosition(light.matrixWorld);
					_vector3.setFromMatrixPosition(light.target.matrixWorld);
					uniforms.direction.sub(_vector3);
					uniforms.direction.transformDirection(viewMatrix);

					uniforms.shadow = light.castShadow;

					if (light.castShadow) {

						uniforms.shadowBias = light.shadow.bias;
						uniforms.shadowRadius = light.shadow.radius;
						uniforms.shadowMapSize = light.shadow.mapSize;

					}

					_lights.directionalShadowMap[directionalLength] = light.shadow.map;
					_lights.directionalShadowMatrix[directionalLength] = light.shadow.matrix;
					_lights.directional[directionalLength++] = uniforms;

				} else if (light instanceof THREE.SpotLight) {

					var uniforms = lightCache.get(light);

					uniforms.position.setFromMatrixPosition(light.matrixWorld);
					uniforms.position.applyMatrix4(viewMatrix);

					uniforms.color.copy(color).multiplyScalar(intensity);
					uniforms.distance = distance;

					uniforms.direction.setFromMatrixPosition(light.matrixWorld);
					_vector3.setFromMatrixPosition(light.target.matrixWorld);
					uniforms.direction.sub(_vector3);
					uniforms.direction.transformDirection(viewMatrix);

					uniforms.coneCos = Math.cos(light.angle);
					uniforms.penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
					uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;

					uniforms.shadow = light.castShadow;

					if (light.castShadow) {

						uniforms.shadowBias = light.shadow.bias;
						uniforms.shadowRadius = light.shadow.radius;
						uniforms.shadowMapSize = light.shadow.mapSize;

					}

					_lights.spotShadowMap[spotLength] = light.shadow.map;
					_lights.spotShadowMatrix[spotLength] = light.shadow.matrix;
					_lights.spot[spotLength++] = uniforms;

				} else if (light instanceof THREE.PointLight) {

					var uniforms = lightCache.get(light);

					uniforms.position.setFromMatrixPosition(light.matrixWorld);
					uniforms.position.applyMatrix4(viewMatrix);

					uniforms.color.copy(light.color).multiplyScalar(light.intensity);
					uniforms.distance = light.distance;
					uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;

					uniforms.shadow = light.castShadow;

					if (light.castShadow) {

						uniforms.shadowBias = light.shadow.bias;
						uniforms.shadowRadius = light.shadow.radius;
						uniforms.shadowMapSize = light.shadow.mapSize;

					}

					_lights.pointShadowMap[pointLength] = light.shadow.map;

					if (_lights.pointShadowMatrix[pointLength] === undefined) {

						_lights.pointShadowMatrix[pointLength] = new THREE.Matrix4();

					}

					// for point lights we set the shadow matrix to be a translation-only matrix
					// equal to inverse of the light's position
					_vector3.setFromMatrixPosition(light.matrixWorld).negate();
					_lights.pointShadowMatrix[pointLength].identity().setPosition(_vector3);

					_lights.point[pointLength++] = uniforms;

				} else if (light instanceof THREE.HemisphereLight) {

					var uniforms = lightCache.get(light);

					uniforms.direction.setFromMatrixPosition(light.matrixWorld);
					uniforms.direction.transformDirection(viewMatrix);
					uniforms.direction.normalize();

					uniforms.skyColor.copy(light.color).multiplyScalar(intensity);
					uniforms.groundColor.copy(light.groundColor).multiplyScalar(intensity);

					_lights.hemi[hemiLength++] = uniforms;

				}

			}

			_lights.ambient[0] = r;
			_lights.ambient[1] = g;
			_lights.ambient[2] = b;

			_lights.directional.length = directionalLength;
			_lights.spot.length = spotLength;
			_lights.point.length = pointLength;
			_lights.hemi.length = hemiLength;

			_lights.hash = directionalLength + ',' + pointLength + ',' + spotLength + ',' + hemiLength + ',' + _lights.shadows.length;

		}

		// Clipping

		function setupGlobalClippingPlanes(planes, camera) {

			_clippingEnabled =
				_this.clippingPlanes.length !== 0 ||
				_this.localClippingEnabled ||
				// enable state of previous frame - the clipping code has to
				// run another frame in order to reset the state:
				_numGlobalClippingPlanes !== 0 ||
				_localClippingEnabled;

			_localClippingEnabled = _this.localClippingEnabled;

			_globalClippingState = setupClippingPlanes(planes, camera, 0);
			_numGlobalClippingPlanes = planes !== null ? planes.length : 0;

		}

		function setupClippingPlanes(planes, camera, dstOffset, skipTransform) {

			var nPlanes = planes !== null ? planes.length : 0,
				dstArray = null;

			if (nPlanes !== 0) {

				dstArray = _clippingPlanesUniform.value;

				if (skipTransform !== true || dstArray === null) {

					var flatSize = dstOffset + nPlanes * 4,
						viewMatrix = camera.matrixWorldInverse,
						viewNormalMatrix = _matrix3.getNormalMatrix(viewMatrix);

					if (dstArray === null || dstArray.length < flatSize) {

						dstArray = new Float32Array(flatSize);

					}

					for (var i = 0, i4 = dstOffset; i !== nPlanes; ++i, i4 += 4) {

						var plane = _plane.copy(planes[i]).
						applyMatrix4(viewMatrix, viewNormalMatrix);

						plane.normal.toArray(dstArray, i4);
						dstArray[i4 + 3] = plane.constant;

					}

				}

				_clippingPlanesUniform.value = dstArray;
				_clippingPlanesUniform.needsUpdate = true;

			}

			_numClippingPlanes = nPlanes;
			return dstArray;

		}

		function resetGlobalClippingState() {

			if (_clippingPlanesUniform.value !== _globalClippingState) {

				_clippingPlanesUniform.value = _globalClippingState;
				_clippingPlanesUniform.needsUpdate = _numGlobalClippingPlanes > 0;

			}

			_numClippingPlanes = _numGlobalClippingPlanes;

		}

		function setClippingState(planes, clipShadows, camera, cache, fromCache) {

			if (!_localClippingEnabled ||
				planes === null || planes.length === 0 ||
				_clipRenderingShadows && !clipShadows) {
				// there's no local clipping

				if (_clipRenderingShadows) {
					// there's no global clipping

					setupClippingPlanes(null);

				} else {

					resetGlobalClippingState();
				}

			} else {

				var nGlobal = _clipRenderingShadows ? 0 : _numGlobalClippingPlanes,
					lGlobal = nGlobal * 4,

					dstArray = cache.clippingState || null;

				_clippingPlanesUniform.value = dstArray; // ensure unique state

				dstArray = setupClippingPlanes(
					planes, camera, lGlobal, fromCache);

				for (var i = 0; i !== lGlobal; ++i) {

					dstArray[i] = _globalClippingState[i];

				}

				cache.clippingState = dstArray;
				_numClippingPlanes += nGlobal;

			}

		}


		// GL state setting

		this.setFaceCulling = function (cullFace, frontFaceDirection) {

			if (cullFace === THREE.CullFaceNone) {

				state.disable(_gl.CULL_FACE);

			} else {

				if (frontFaceDirection === THREE.FrontFaceDirectionCW) {

					_gl.frontFace(_gl.CW);

				} else {

					_gl.frontFace(_gl.CCW);

				}

				if (cullFace === THREE.CullFaceBack) {

					_gl.cullFace(_gl.BACK);

				} else if (cullFace === THREE.CullFaceFront) {

					_gl.cullFace(_gl.FRONT);

				} else {

					_gl.cullFace(_gl.FRONT_AND_BACK);

				}

				state.enable(_gl.CULL_FACE);

			}

		};

		// Textures

		function allocTextureUnit() {

			var textureUnit = _usedTextureUnits;

			if (textureUnit >= capabilities.maxTextures) {

				console.warn('WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + capabilities.maxTextures);

			}

			_usedTextureUnits += 1;

			return textureUnit;

		}

		function setTextureParameters(textureType, texture, isPowerOfTwoImage) {

			var extension;

			if (isPowerOfTwoImage) {

				_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL(texture.wrapS));
				_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL(texture.wrapT));

				// PI_BEGIN
				if (texture.generateMipmaps) {
					switch (texture.minFilter) {
						case THREE.NearestFilter:
							texture.minFilter = THREE.NearestMipMapLinearFilter;
							break;
						case THREE.LinearFilter:
							texture.minFilter = THREE.LinearMipMapLinearFilter;
							break;
					}
				}
				// PI_END

				_gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL(texture.magFilter));
				_gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL(texture.minFilter));

			} else {

				_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
				_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);

				if (texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping) {

					console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.', texture);

				}

				_gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter));
				_gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter));

				if (texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter) {

					console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.', texture);

				}

			}

			extension = extensions.get('EXT_texture_filter_anisotropic');

			if (extension) {

				if (texture.type === THREE.FloatType && extensions.get('OES_texture_float_linear') === null) return;
				if (texture.type === THREE.HalfFloatType && extensions.get('OES_texture_half_float_linear') === null) return;

				if (texture.anisotropy > 1 || properties.get(texture).__currentAnisotropy) {

					_gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, _this.getMaxAnisotropy()));
					properties.get(texture).__currentAnisotropy = texture.anisotropy;

				}

			}

		}

		function uploadTexture(textureProperties, texture, slot) {

			if (textureProperties.__webglInit === undefined) {

				textureProperties.__webglInit = true;

				texture.addEventListener('dispose', onTextureDispose);

				textureProperties.__webglTexture = _gl.createTexture();

				_infoMemory.textures++;

			}

			state.activeTexture(_gl.TEXTURE0 + slot);
			state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);

			_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
			_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
			_gl.pixelStorei(_gl.UNPACK_ALIGNMENT, texture.unpackAlignment);

			var image = clampToMaxSize(texture.image, capabilities.maxTextureSize);

			if (textureNeedsPowerOfTwo(texture) && isPowerOfTwo(image) === false) {

				image = makePowerOfTwo(image);

			}

			var isPowerOfTwoImage = isPowerOfTwo(image),
				glFormat = paramThreeToGL(texture.format),
				glType = paramThreeToGL(texture.type);

			setTextureParameters(_gl.TEXTURE_2D, texture, isPowerOfTwoImage);

			var mipmap, mipmaps = texture.mipmaps;

			if (texture instanceof THREE.DepthTexture) {

				// populate depth texture with dummy data

				var internalFormat = _gl.DEPTH_COMPONENT;

				if (texture.type === THREE.FloatType) {

					if (!_isWebGL2) throw new Error('Float Depth Texture only supported in WebGL2.0');
					internalFormat = _gl.DEPTH_COMPONENT32F;

				} else if (_isWebGL2) {

					// WebGL 2.0 requires signed internalformat for glTexImage2D
					internalFormat = _gl.DEPTH_COMPONENT16;

				}

				state.texImage2D(_gl.TEXTURE_2D, 0, internalFormat, image.width, image.height, 0, glFormat, glType, null);

			} else if (texture instanceof THREE.DataTexture) {

				// use manually created mipmaps if available
				// if there are no manual mipmaps
				// set 0 level mipmap and then use GL to generate other mipmap levels

				if (mipmaps.length > 0 && isPowerOfTwoImage) {

					for (var i = 0, il = mipmaps.length; i < il; i++) {

						mipmap = mipmaps[i];
						state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

					}

					texture.generateMipmaps = false;

				} else {

					state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data);

				}

			} else if (texture instanceof THREE.CompressedTexture) {

				for (var i = 0, il = mipmaps.length; i < il; i++) {

					mipmap = mipmaps[i];

					if (texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat) {

						if (state.getCompressedTextureFormats().indexOf(glFormat) > -1) {

							state.compressedTexImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);

						} else {

							console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");

						}

					} else {

						state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

					}

				}

			} else {

				// regular Texture (image, video, canvas)

				// use manually created mipmaps if available
				// if there are no manual mipmaps
				// set 0 level mipmap and then use GL to generate other mipmap levels

				if (mipmaps.length > 0 && isPowerOfTwoImage) {

					for (var i = 0, il = mipmaps.length; i < il; i++) {

						mipmap = mipmaps[i];
						state.texImage2D(_gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);

					}

					texture.generateMipmaps = false;

				} else {

					state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, glFormat, glType, image);

				}

			}

			if (texture.generateMipmaps && isPowerOfTwoImage) _gl.generateMipmap(_gl.TEXTURE_2D);

			textureProperties.__version = texture.version;

			if (texture.onUpdate) texture.onUpdate(texture);

		}

		function setTexture2D(texture, slot) {

			if (texture instanceof THREE.WebGLRenderTarget) texture = texture.texture;

			var textureProperties = properties.get(texture);

			if (texture.version > 0 && textureProperties.__version !== texture.version) {

				var image = texture.image;

				if (image === undefined) {

					console.warn('THREE.WebGLRenderer: Texture marked for update but image is undefined', texture);
					return;

				}

				if (image.complete === false) {

					console.warn('THREE.WebGLRenderer: Texture marked for update but image is incomplete', texture);
					return;

				}

				uploadTexture(textureProperties, texture, slot);

				return;

			}

			state.activeTexture(_gl.TEXTURE0 + slot);
			state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);

		}

		function clampToMaxSize(image, maxSize) {

			if (image.width > maxSize || image.height > maxSize) {

				// Warning: Scaling through the canvas will only work with images that use
				// premultiplied alpha.

				var scale = maxSize / Math.max(image.width, image.height);

				var canvas = document.createElement('canvas');
				canvas.width = Math.floor(image.width * scale);
				canvas.height = Math.floor(image.height * scale);

				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

				console.warn('THREE.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

				return canvas;

			}

			return image;

		}

		function isPowerOfTwo(image) {

			return THREE.Math.isPowerOfTwo(image.width) && THREE.Math.isPowerOfTwo(image.height);

		}

		function textureNeedsPowerOfTwo(texture) {

			if (texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping) return true;
			if (texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter) return true;

			return false;

		}

		function makePowerOfTwo(image) {

			if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement) {

				var canvas = document.createElement('canvas');
				canvas.width = THREE.Math.nearestPowerOfTwo(image.width);
				canvas.height = THREE.Math.nearestPowerOfTwo(image.height);

				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0, canvas.width, canvas.height);

				console.warn('THREE.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

				return canvas;

			}

			return image;

		}

		function setCubeTexture(texture, slot) {

			var textureProperties = properties.get(texture);

			if (texture.image.length === 6) {

				if (texture.version > 0 && textureProperties.__version !== texture.version) {

					if (!textureProperties.__image__webglTextureCube) {

						texture.addEventListener('dispose', onTextureDispose);

						textureProperties.__image__webglTextureCube = _gl.createTexture();

						_infoMemory.textures++;

					}

					state.activeTexture(_gl.TEXTURE0 + slot);
					state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);

					_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);

					var isCompressed = texture instanceof THREE.CompressedTexture;
					var isDataTexture = texture.image[0] instanceof THREE.DataTexture;

					var cubeImage = [];

					for (var i = 0; i < 6; i++) {

						if (_this.autoScaleCubemaps && !isCompressed && !isDataTexture) {

							cubeImage[i] = clampToMaxSize(texture.image[i], capabilities.maxCubemapSize);

						} else {

							cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i];

						}

					}

					var image = cubeImage[0],
						isPowerOfTwoImage = isPowerOfTwo(image),
						glFormat = paramThreeToGL(texture.format),
						glType = paramThreeToGL(texture.type);

					setTextureParameters(_gl.TEXTURE_CUBE_MAP, texture, isPowerOfTwoImage);

					for (var i = 0; i < 6; i++) {

						if (!isCompressed) {

							if (isDataTexture) {

								state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data);

							} else {

								state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);

							}

						} else {

							var mipmap, mipmaps = cubeImage[i].mipmaps;

							for (var j = 0, jl = mipmaps.length; j < jl; j++) {

								mipmap = mipmaps[j];

								if (texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat) {

									if (state.getCompressedTextureFormats().indexOf(glFormat) > -1) {

										state.compressedTexImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);

									} else {

										console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setCubeTexture()");

									}

								} else {

									state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

								}

							}

						}

					}

					if (texture.generateMipmaps && isPowerOfTwoImage) {

						_gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);

					}

					textureProperties.__version = texture.version;

					if (texture.onUpdate) texture.onUpdate(texture);

				} else {

					state.activeTexture(_gl.TEXTURE0 + slot);
					state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);

				}

			}

		}

		function setCubeTextureDynamic(texture, slot) {

			state.activeTexture(_gl.TEXTURE0 + slot);
			state.bindTexture(_gl.TEXTURE_CUBE_MAP, properties.get(texture).__webglTexture);

		}

		var setTextureWarned = false;
		this.setTexture = function (texture, slot) {

			if (!setTextureWarned) {

				console.warn("THREE.WebGLRenderer: .setTexture is deprecated, " +
					"use setTexture2D instead.");
				setTextureWarned = true;

			}

			setTexture2D(texture, slot);

		};

		this.allocTextureUnit = allocTextureUnit;
		this.setTexture2D = setTexture2D;
		this.setTextureCube = function (texture, slot) {

			if (texture instanceof THREE.CubeTexture ||
				(Array.isArray(texture.image) && texture.image.length === 6)) {

				// CompressedTexture can have Array in image :/

				setCubeTexture(texture, slot);

			} else {
				// assumed: texture instanceof THREE.WebGLRenderTargetCube

				setCubeTextureDynamic(texture.texture, slot);

			}

		};

		// Render targets

		// Setup storage for target texture and bind it to correct framebuffer
		function setupFrameBufferTexture(framebuffer, renderTarget, attachment, textureTarget) {

			var glFormat = paramThreeToGL(renderTarget.texture.format);
			var glType = paramThreeToGL(renderTarget.texture.type);
			state.texImage2D(textureTarget, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null);
			_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
			_gl.framebufferTexture2D(_gl.FRAMEBUFFER, attachment, textureTarget, properties.get(renderTarget.texture).__webglTexture, 0);
			_gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

		}

		// Setup storage for internal depth/stencil buffers and bind to correct framebuffer
		function setupRenderBufferStorage(renderbuffer, renderTarget) {

			_gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer);

			if (renderTarget.depthBuffer && !renderTarget.stencilBuffer) {

				_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
				_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer);

			} else if (renderTarget.depthBuffer && renderTarget.stencilBuffer) {

				_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
				_gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer);

			} else {

				// FIXME: We don't support !depth !stencil
				_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height);

			}

			_gl.bindRenderbuffer(_gl.RENDERBUFFER, null);

		}

		// Setup resources for a Depth Texture for a FBO (needs an extension)
		function setupDepthTexture(framebuffer, renderTarget) {

			var isCube = (renderTarget instanceof THREE.WebGLRenderTargetCube);
			if (isCube) throw new Error('Depth Texture with cube render targets is not supported!');

			_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);

			if (!(renderTarget.depthTexture instanceof THREE.DepthTexture)) {

				throw new Error('renderTarget.depthTexture must be an instance of THREE.DepthTexture');

			}

			// upload an empty depth texture with framebuffer size
			if (!properties.get(renderTarget.depthTexture).__webglTexture ||
				renderTarget.depthTexture.image.width !== renderTarget.width ||
				renderTarget.depthTexture.image.height !== renderTarget.height) {
				renderTarget.depthTexture.image.width = renderTarget.width;
				renderTarget.depthTexture.image.height = renderTarget.height;
				renderTarget.depthTexture.needsUpdate = true;
			}

			_this.setTexture(renderTarget.depthTexture, 0);

			var webglDepthTexture = properties.get(renderTarget.depthTexture).__webglTexture;
			_gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0);

		}

		// Setup GL resources for a non-texture depth buffer
		function setupDepthRenderbuffer(renderTarget) {

			var renderTargetProperties = properties.get(renderTarget);

			var isCube = (renderTarget instanceof THREE.WebGLRenderTargetCube);

			if (renderTarget.depthTexture) {

				if (isCube) throw new Error('target.depthTexture not supported in Cube render targets');

				setupDepthTexture(renderTargetProperties.__webglFramebuffer, renderTarget);

			} else {

				if (isCube) {

					renderTargetProperties.__webglDepthbuffer = [];

					for (var i = 0; i < 6; i++) {

						_gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[i]);
						renderTargetProperties.__webglDepthbuffer[i] = _gl.createRenderbuffer();
						setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer[i], renderTarget);

					}

				} else {

					_gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
					renderTargetProperties.__webglDepthbuffer = _gl.createRenderbuffer();
					setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer, renderTarget);

				}

			}

			_gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

		}

		// Set up GL resources for the render target
		function setupRenderTarget(renderTarget) {

			var renderTargetProperties = properties.get(renderTarget);
			var textureProperties = properties.get(renderTarget.texture);

			renderTarget.addEventListener('dispose', onRenderTargetDispose);

			textureProperties.__webglTexture = _gl.createTexture();

			_infoMemory.textures++;

			var isCube = (renderTarget instanceof THREE.WebGLRenderTargetCube);
			var isTargetPowerOfTwo = THREE.Math.isPowerOfTwo(renderTarget.width) && THREE.Math.isPowerOfTwo(renderTarget.height);

			// Setup framebuffer

			if (isCube) {

				renderTargetProperties.__webglFramebuffer = [];

				for (var i = 0; i < 6; i++) {

					renderTargetProperties.__webglFramebuffer[i] = _gl.createFramebuffer();

				}

			} else {

				renderTargetProperties.__webglFramebuffer = _gl.createFramebuffer();

			}

			// Setup color buffer

			if (isCube) {

				state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
				setTextureParameters(_gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo);

				for (var i = 0; i < 6; i++) {

					setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer[i], renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);

				}

				if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
				state.bindTexture(_gl.TEXTURE_CUBE_MAP, null);

			} else {

				state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);
				setTextureParameters(_gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo);
				setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer, renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D);

				if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) _gl.generateMipmap(_gl.TEXTURE_2D);
				state.bindTexture(_gl.TEXTURE_2D, null);

			}

			// Setup depth and stencil buffers

			if (renderTarget.depthBuffer) {

				setupDepthRenderbuffer(renderTarget);

			}

		}

		this.getCurrentRenderTarget = function () {

			return _currentRenderTarget;

		};

		this.setRenderTarget = function (renderTarget) {

			_currentRenderTarget = renderTarget;

			if (renderTarget && properties.get(renderTarget).__webglFramebuffer === undefined) {

				setupRenderTarget(renderTarget);

			}

			var isCube = (renderTarget instanceof THREE.WebGLRenderTargetCube);
			var framebuffer;

			if (renderTarget) {

				var renderTargetProperties = properties.get(renderTarget);

				if (isCube) {

					framebuffer = renderTargetProperties.__webglFramebuffer[renderTarget.activeCubeFace];

				} else {

					framebuffer = renderTargetProperties.__webglFramebuffer;

				}

				_currentScissor.copy(renderTarget.scissor);
				_currentScissorTest = renderTarget.scissorTest;

				_currentViewport.copy(renderTarget.viewport);

			} else {

				framebuffer = null;

				_currentScissor.copy(_scissor).multiplyScalar(_pixelRatio);
				_currentScissorTest = _scissorTest;

				_currentViewport.copy(_viewport).multiplyScalar(_pixelRatio);

			}

			if (_currentFramebuffer !== framebuffer) {

				_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
				_currentFramebuffer = framebuffer;

			}

			state.scissor(_currentScissor);
			state.setScissorTest(_currentScissorTest);

			state.viewport(_currentViewport);

			if (isCube) {

				var textureProperties = properties.get(renderTarget.texture);
				_gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, renderTarget.activeMipMapLevel);

			}

		};

		this.readRenderTargetPixels = function (renderTarget, x, y, width, height, buffer) {

			if (renderTarget instanceof THREE.WebGLRenderTarget === false) {

				console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.');
				return;

			}

			var framebuffer = properties.get(renderTarget).__webglFramebuffer;

			if (framebuffer) {

				var restore = false;

				if (framebuffer !== _currentFramebuffer) {

					_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);

					restore = true;

				}

				try {

					var texture = renderTarget.texture;

					if (texture.format !== THREE.RGBAFormat && paramThreeToGL(texture.format) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_FORMAT)) {

						console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.');
						return;

					}

					if (texture.type !== THREE.UnsignedByteType &&
						paramThreeToGL(texture.type) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_TYPE) &&
						!(texture.type === THREE.FloatType && extensions.get('WEBGL_color_buffer_float')) &&
						!(texture.type === THREE.HalfFloatType && extensions.get('EXT_color_buffer_half_float'))) {

						console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.');
						return;

					}

					if (_gl.checkFramebufferStatus(_gl.FRAMEBUFFER) === _gl.FRAMEBUFFER_COMPLETE) {

						// the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)

						if ((x > 0 && x <= (renderTarget.width - width)) && (y > 0 && y <= (renderTarget.height - height))) {

							_gl.readPixels(x, y, width, height, paramThreeToGL(texture.format), paramThreeToGL(texture.type), buffer);

						}

					} else {

						console.error('THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.');

					}

				} finally {

					if (restore) {

						_gl.bindFramebuffer(_gl.FRAMEBUFFER, _currentFramebuffer);

					}

				}

			}

		};

		function updateRenderTargetMipmap(renderTarget) {

			var target = renderTarget instanceof THREE.WebGLRenderTargetCube ? _gl.TEXTURE_CUBE_MAP : _gl.TEXTURE_2D;
			var texture = properties.get(renderTarget.texture).__webglTexture;

			state.bindTexture(target, texture);
			_gl.generateMipmap(target);
			state.bindTexture(target, null);

		}

		// Fallback filters for non-power-of-2 textures

		function filterFallback(f) {

			if (f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter) {

				return _gl.NEAREST;

			}

			return _gl.LINEAR;

		}

		// Map three.js constants to WebGL constants

		function paramThreeToGL(p) {

			var extension;

			if (p === THREE.RepeatWrapping) return _gl.REPEAT;
			if (p === THREE.ClampToEdgeWrapping) return _gl.CLAMP_TO_EDGE;
			if (p === THREE.MirroredRepeatWrapping) return _gl.MIRRORED_REPEAT;

			if (p === THREE.NearestFilter) return _gl.NEAREST;
			if (p === THREE.NearestMipMapNearestFilter) return _gl.NEAREST_MIPMAP_NEAREST;
			if (p === THREE.NearestMipMapLinearFilter) return _gl.NEAREST_MIPMAP_LINEAR;

			if (p === THREE.LinearFilter) return _gl.LINEAR;
			if (p === THREE.LinearMipMapNearestFilter) return _gl.LINEAR_MIPMAP_NEAREST;
			if (p === THREE.LinearMipMapLinearFilter) return _gl.LINEAR_MIPMAP_LINEAR;

			if (p === THREE.UnsignedByteType) return _gl.UNSIGNED_BYTE;
			if (p === THREE.UnsignedShort4444Type) return _gl.UNSIGNED_SHORT_4_4_4_4;
			if (p === THREE.UnsignedShort5551Type) return _gl.UNSIGNED_SHORT_5_5_5_1;
			if (p === THREE.UnsignedShort565Type) return _gl.UNSIGNED_SHORT_5_6_5;

			if (p === THREE.ByteType) return _gl.BYTE;
			if (p === THREE.ShortType) return _gl.SHORT;
			if (p === THREE.UnsignedShortType) return _gl.UNSIGNED_SHORT;
			if (p === THREE.IntType) return _gl.INT;
			if (p === THREE.UnsignedIntType) return _gl.UNSIGNED_INT;
			if (p === THREE.FloatType) return _gl.FLOAT;

			extension = extensions.get('OES_texture_half_float');

			if (extension !== null) {

				if (p === THREE.HalfFloatType) return extension.HALF_FLOAT_OES;

			}

			if (p === THREE.AlphaFormat) return _gl.ALPHA;
			if (p === THREE.RGBFormat) return _gl.RGB;
			if (p === THREE.RGBAFormat) return _gl.RGBA;
			if (p === THREE.LuminanceFormat) return _gl.LUMINANCE;
			if (p === THREE.LuminanceAlphaFormat) return _gl.LUMINANCE_ALPHA;
			if (p === THREE.DepthFormat) return _gl.DEPTH_COMPONENT;

			if (p === THREE.AddEquation) return _gl.FUNC_ADD;
			if (p === THREE.SubtractEquation) return _gl.FUNC_SUBTRACT;
			if (p === THREE.ReverseSubtractEquation) return _gl.FUNC_REVERSE_SUBTRACT;

			if (p === THREE.ZeroFactor) return _gl.ZERO;
			if (p === THREE.OneFactor) return _gl.ONE;
			if (p === THREE.SrcColorFactor) return _gl.SRC_COLOR;
			if (p === THREE.OneMinusSrcColorFactor) return _gl.ONE_MINUS_SRC_COLOR;
			if (p === THREE.SrcAlphaFactor) return _gl.SRC_ALPHA;
			if (p === THREE.OneMinusSrcAlphaFactor) return _gl.ONE_MINUS_SRC_ALPHA;
			if (p === THREE.DstAlphaFactor) return _gl.DST_ALPHA;
			if (p === THREE.OneMinusDstAlphaFactor) return _gl.ONE_MINUS_DST_ALPHA;

			if (p === THREE.DstColorFactor) return _gl.DST_COLOR;
			if (p === THREE.OneMinusDstColorFactor) return _gl.ONE_MINUS_DST_COLOR;
			if (p === THREE.SrcAlphaSaturateFactor) return _gl.SRC_ALPHA_SATURATE;

			extension = extensions.get('WEBGL_compressed_texture_s3tc');

			if (extension !== null) {

				if (p === THREE.RGB_S3TC_DXT1_Format) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if (p === THREE.RGBA_S3TC_DXT1_Format) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if (p === THREE.RGBA_S3TC_DXT3_Format) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if (p === THREE.RGBA_S3TC_DXT5_Format) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;

			}

			extension = extensions.get('WEBGL_compressed_texture_pvrtc');

			if (extension !== null) {

				if (p === THREE.RGB_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if (p === THREE.RGB_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if (p === THREE.RGBA_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if (p === THREE.RGBA_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

			}

			extension = extensions.get('WEBGL_compressed_texture_etc1');

			if (extension !== null) {

				if (p === THREE.RGB_ETC1_Format) return extension.COMPRESSED_RGB_ETC1_WEBGL;

			}

			extension = extensions.get('EXT_blend_minmax');

			if (extension !== null) {

				if (p === THREE.MinEquation) return extension.MIN_EXT;
				if (p === THREE.MaxEquation) return extension.MAX_EXT;

			}

			return 0;

		}

	};

	// File:../dev/three/renderers/WebGLRenderTarget.js

	/**
	 * @author szimek / https://github.com/szimek/
	 * @author alteredq / http://alteredqualia.com/
	 * @author Marius Kintel / https://github.com/kintel
	 */

	/*
	 In options, we can specify:
	 * Texture parameters for an auto-generated target texture
	 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
	*/
	THREE.WebGLRenderTarget = function (width, height, options) {

		this.uuid = THREE.Math.generateUUID();

		this.width = width;
		this.height = height;

		this.scissor = new THREE.Vector4(0, 0, width, height);
		this.scissorTest = false;

		this.viewport = new THREE.Vector4(0, 0, width, height);

		options = options || {};

		if (options.minFilter === undefined) options.minFilter = THREE.LinearFilter;

		this.texture = new THREE.Texture(undefined, undefined, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding);

		this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
		this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;
		this.depthTexture = null;

	};

	THREE.WebGLRenderTarget.prototype = {

		constructor: THREE.WebGLRenderTarget,

		setSize: function (width, height) {

			if (this.width !== width || this.height !== height) {

				this.width = width;
				this.height = height;

				this.dispose();

			}

			this.viewport.set(0, 0, width, height);
			this.scissor.set(0, 0, width, height);

		},

		clone: function () {

			return new this.constructor().copy(this);

		},

		copy: function (source) {

			this.width = source.width;
			this.height = source.height;

			this.viewport.copy(source.viewport);

			this.texture = source.texture.clone();

			this.depthBuffer = source.depthBuffer;
			this.stencilBuffer = source.stencilBuffer;
			this.depthTexture = source.depthTexture;

			return this;

		},

		dispose: function () {

			this.dispatchEvent({
				type: 'dispose'
			});

		}

	};

	THREE.EventDispatcher.prototype.apply(THREE.WebGLRenderTarget.prototype);

	// File:../dev/three/renderers/WebGLRenderTargetCube.js

	/**
	 * @author alteredq / http://alteredqualia.com
	 */

	THREE.WebGLRenderTargetCube = function (width, height, options) {

		THREE.WebGLRenderTarget.call(this, width, height, options);

		this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
		this.activeMipMapLevel = 0;

	};

	THREE.WebGLRenderTargetCube.prototype = Object.create(THREE.WebGLRenderTarget.prototype);
	THREE.WebGLRenderTargetCube.prototype.constructor = THREE.WebGLRenderTargetCube;

	// File:../dev/three/renderers/webgl/WebGLBufferRenderer.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLBufferRenderer = function (_gl, extensions, _infoRender) {

		var mode;

		function setMode(value) {

			mode = value;

		}

		function render(start, count) {

			_gl.drawArrays(mode, start, count);

			_infoRender.calls++;
			_infoRender.vertices += count;
			if (mode === _gl.TRIANGLES) _infoRender.faces += count / 3;

		}

		function renderInstances(geometry) {

			var extension = extensions.get('ANGLE_instanced_arrays');

			if (extension === null) {

				console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
				return;

			}

			var position = geometry.attributes.position;

			var count = 0;

			if (position instanceof THREE.InterleavedBufferAttribute) {

				count = position.data.count;

				extension.drawArraysInstancedANGLE(mode, 0, count, geometry.maxInstancedCount);

			} else {

				count = position.count;

				extension.drawArraysInstancedANGLE(mode, 0, count, geometry.maxInstancedCount);

			}

			_infoRender.calls++;
			_infoRender.vertices += count * geometry.maxInstancedCount;
			if (mode === _gl.TRIANGLES) _infoRender.faces += geometry.maxInstancedCount * count / 3;

		}

		this.setMode = setMode;
		this.render = render;
		this.renderInstances = renderInstances;

	};

	// File:../dev/three/renderers/webgl/WebGLIndexedBufferRenderer.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLIndexedBufferRenderer = function (_gl, extensions, _infoRender) {

		var mode;

		function setMode(value) {

			mode = value;

		}

		var type, size;

		function setIndex(index) {

			if (index.array instanceof Uint32Array && extensions.get('OES_element_index_uint')) {

				type = _gl.UNSIGNED_INT;
				size = 4;

			} else {

				type = _gl.UNSIGNED_SHORT;
				size = 2;

			}

		}

		function render(start, count) {

			_gl.drawElements(mode, count, type, start * size);

			_infoRender.calls++;
			_infoRender.vertices += count;
			if (mode === _gl.TRIANGLES) _infoRender.faces += count / 3;

		}

		function renderInstances(geometry, start, count) {

			var extension = extensions.get('ANGLE_instanced_arrays');

			if (extension === null) {

				console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
				return;

			}

			extension.drawElementsInstancedANGLE(mode, count, type, start * size, geometry.maxInstancedCount);

			_infoRender.calls++;
			_infoRender.vertices += count * geometry.maxInstancedCount;
			if (mode === _gl.TRIANGLES) _infoRender.faces += geometry.maxInstancedCount * count / 3;
		}

		this.setMode = setMode;
		this.setIndex = setIndex;
		this.render = render;
		this.renderInstances = renderInstances;

	};

	// File:../dev/three/renderers/webgl/WebGLExtensions.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLExtensions = function (gl) {

		var extensions = {};

		this.get = function (name) {

			if (extensions[name] !== undefined) {

				return extensions[name];

			}

			var extension;

			switch (name) {

				case 'WEBGL_depth_texture':
					extension = gl.getExtension('WEBGL_depth_texture') || gl.getExtension('MOZ_WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture');

				case 'EXT_texture_filter_anisotropic':
					extension = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
					break;

				case 'WEBGL_compressed_texture_s3tc':
					extension = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
					break;

				case 'WEBGL_compressed_texture_pvrtc':
					extension = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
					break;

				case 'WEBGL_compressed_texture_etc1':
					extension = gl.getExtension('WEBGL_compressed_texture_etc1');
					break;

				default:
					extension = gl.getExtension(name);

			}

			if (extension === null) {

				console.warn('THREE.WebGLRenderer: ' + name + ' extension not supported.');

			}

			extensions[name] = extension;

			return extension;

		};

	};

	// File:../dev/three/renderers/webgl/WebGLCapabilities.js

	THREE.WebGLCapabilities = function (gl, extensions, parameters) {

		function getMaxPrecision(precision) {

			if (precision === 'highp') {

				if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
					gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {

					return 'highp';

				}

				precision = 'mediump';

			}

			if (precision === 'mediump') {

				if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
					gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {

					return 'mediump';

				}

			}

			return 'lowp';

		}

		this.getMaxPrecision = getMaxPrecision;

		this.precision = parameters.precision !== undefined ? parameters.precision : 'highp',
			this.logarithmicDepthBuffer = parameters.logarithmicDepthBuffer !== undefined ? parameters.logarithmicDepthBuffer : false;

		this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
		this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
		this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

		this.maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		this.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
		this.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
		this.maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

		this.vertexTextures = this.maxVertexTextures > 0;
		this.floatFragmentTextures = !!extensions.get('OES_texture_float');
		this.floatVertexTextures = this.vertexTextures && this.floatFragmentTextures;

		var _maxPrecision = getMaxPrecision(this.precision);

		if (_maxPrecision !== this.precision) {

			console.warn('THREE.WebGLRenderer:', this.precision, 'not supported, using', _maxPrecision, 'instead.');
			this.precision = _maxPrecision;

		}

		if (this.logarithmicDepthBuffer) {

			this.logarithmicDepthBuffer = !!extensions.get('EXT_frag_depth');

		}

	};

	// File:../dev/three/renderers/webgl/WebGLGeometries.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLGeometries = function (gl, properties, info) {

		var geometries = {};

		function get(object) {

			var geometry = object.geometry;
			// PI_BEGIN
			if (geometries[geometry.id] === geometry) {
				// PI_END
				return geometries[geometry.id];

			}

			geometry.addEventListener('dispose', onGeometryDispose);

			var buffergeometry;

			if (geometry instanceof THREE.BufferGeometry) {

				buffergeometry = geometry;

			} else if (geometry instanceof THREE.Geometry) {

				if (geometry._bufferGeometry === undefined) {

					geometry._bufferGeometry = new THREE.BufferGeometry().setFromObject(object);

				}

				buffergeometry = geometry._bufferGeometry;

			}

			geometries[geometry.id] = buffergeometry;

			info.memory.geometries++;

			return buffergeometry;

		}

		function onGeometryDispose(event) {

			var geometry = event.target;
			var buffergeometry = geometries[geometry.id];

			if (buffergeometry.index !== null) {

				deleteAttribute(buffergeometry.index);

			}

			deleteAttributes(buffergeometry.attributes);

			geometry.removeEventListener('dispose', onGeometryDispose);

			delete geometries[geometry.id];

			// TODO

			var property = properties.get(geometry);

			if (property.wireframe) {

				deleteAttribute(property.wireframe);

			}

			properties.delete(geometry);

			var bufferproperty = properties.get(buffergeometry);

			if (bufferproperty.wireframe) {

				deleteAttribute(bufferproperty.wireframe);

			}

			properties.delete(buffergeometry);

			//

			info.memory.geometries--;

		}

		function getAttributeBuffer(attribute) {

			if (attribute instanceof THREE.InterleavedBufferAttribute) {

				return properties.get(attribute.data).__webglBuffer;

			}

			return properties.get(attribute).__webglBuffer;

		}

		function deleteAttribute(attribute) {

			var buffer = getAttributeBuffer(attribute);

			if (buffer !== undefined) {

				gl.deleteBuffer(buffer);
				removeAttributeBuffer(attribute);

			}

		}

		function deleteAttributes(attributes) {

			for (var name in attributes) {

				deleteAttribute(attributes[name]);

			}

		}

		function removeAttributeBuffer(attribute) {

			if (attribute instanceof THREE.InterleavedBufferAttribute) {

				properties.delete(attribute.data);

			} else {

				properties.delete(attribute);

			}

		}

		this.get = get;

	};

	// File:../dev/three/renderers/webgl/WebGLLights.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLLights = function () {

		var lights = {};

		this.get = function (light) {

			if (lights[light.id] !== undefined) {

				return lights[light.id];

			}

			var uniforms;

			switch (light.type) {

				case 'DirectionalLight':
					uniforms = {
						direction: new THREE.Vector3(),
						color: new THREE.Color(),

						shadow: false,
						shadowBias: 0,
						shadowRadius: 1,
						shadowMapSize: new THREE.Vector2()
					};
					break;

				case 'SpotLight':
					uniforms = {
						position: new THREE.Vector3(),
						direction: new THREE.Vector3(),
						color: new THREE.Color(),
						distance: 0,
						coneCos: 0,
						penumbraCos: 0,
						decay: 0,

						shadow: false,
						shadowBias: 0,
						shadowRadius: 1,
						shadowMapSize: new THREE.Vector2()
					};
					break;

				case 'PointLight':
					uniforms = {
						position: new THREE.Vector3(),
						color: new THREE.Color(),
						distance: 0,
						decay: 0,

						shadow: false,
						shadowBias: 0,
						shadowRadius: 1,
						shadowMapSize: new THREE.Vector2()
					};
					break;

				case 'HemisphereLight':
					uniforms = {
						direction: new THREE.Vector3(),
						skyColor: new THREE.Color(),
						groundColor: new THREE.Color()
					};
					break;

			}

			lights[light.id] = uniforms;

			return uniforms;

		};

	};

	// File:../dev/three/renderers/webgl/WebGLObjects.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLObjects = function (gl, properties, info) {

		var geometries = new THREE.WebGLGeometries(gl, properties, info);

		//

		function update(object) {

			// TODO: Avoid updating twice (when using shadowMap). Maybe add frame counter.

			var geometry = geometries.get(object);

			if (object.geometry instanceof THREE.Geometry) {

				geometry.updateFromObject(object);

			}

			var index = geometry.index;
			var attributes = geometry.attributes;

			if (index !== null) {

				updateAttribute(index, gl.ELEMENT_ARRAY_BUFFER);

			}

			for (var name in attributes) {

				updateAttribute(attributes[name], gl.ARRAY_BUFFER);

			}

			// morph targets

			var morphAttributes = geometry.morphAttributes;

			for (var name in morphAttributes) {

				var array = morphAttributes[name];

				for (var i = 0, l = array.length; i < l; i++) {

					updateAttribute(array[i], gl.ARRAY_BUFFER);

				}

			}

			return geometry;

		}

		function updateAttribute(attribute, bufferType) {

			var data = (attribute instanceof THREE.InterleavedBufferAttribute) ? attribute.data : attribute;

			var attributeProperties = properties.get(data);

			if (attributeProperties.__webglBuffer === undefined) {

				createBuffer(attributeProperties, data, bufferType);

			} else if (attributeProperties.version !== data.version) {

				updateBuffer(attributeProperties, data, bufferType);

			}

		}

		function createBuffer(attributeProperties, data, bufferType) {

			attributeProperties.__webglBuffer = gl.createBuffer();
			gl.bindBuffer(bufferType, attributeProperties.__webglBuffer);

			var usage = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

			gl.bufferData(bufferType, data.array, usage);

			attributeProperties.version = data.version;

		}

		function updateBuffer(attributeProperties, data, bufferType) {

			gl.bindBuffer(bufferType, attributeProperties.__webglBuffer);

			if (data.dynamic === false || data.updateRange.count === -1) {

				// Not using update ranges

				gl.bufferSubData(bufferType, 0, data.array);

			} else if (data.updateRange.count === 0) {

				console.error('THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.');

			} else {

				gl.bufferSubData(bufferType, data.updateRange.offset * data.array.BYTES_PER_ELEMENT,
					data.array.subarray(data.updateRange.offset, data.updateRange.offset + data.updateRange.count));

				data.updateRange.count = 0; // reset range

			}

			attributeProperties.version = data.version;

		}

		function getAttributeBuffer(attribute) {

			if (attribute instanceof THREE.InterleavedBufferAttribute) {

				return properties.get(attribute.data).__webglBuffer;

			}

			return properties.get(attribute).__webglBuffer;

		}

		function getWireframeAttribute(geometry) {

			var property = properties.get(geometry);

			if (property.wireframe !== undefined) {

				return property.wireframe;

			}

			var indices = [];

			var index = geometry.index;
			var attributes = geometry.attributes;
			var position = attributes.position;

			// console.time( 'wireframe' );

			if (index !== null) {

				var edges = {};
				var array = index.array;

				for (var i = 0, l = array.length; i < l; i += 3) {

					var a = array[i + 0];
					var b = array[i + 1];
					var c = array[i + 2];

					if (checkEdge(edges, a, b)) indices.push(a, b);
					if (checkEdge(edges, b, c)) indices.push(b, c);
					if (checkEdge(edges, c, a)) indices.push(c, a);

				}

			} else {

				var array = attributes.position.array;

				for (var i = 0, l = (array.length / 3) - 1; i < l; i += 3) {

					var a = i + 0;
					var b = i + 1;
					var c = i + 2;

					indices.push(a, b, b, c, c, a);

				}

			}

			// console.timeEnd( 'wireframe' );

			var TypeArray = position.count > 65535 ? Uint32Array : Uint16Array;
			var attribute = new THREE.BufferAttribute(new TypeArray(indices), 1);

			updateAttribute(attribute, gl.ELEMENT_ARRAY_BUFFER);

			property.wireframe = attribute;

			return attribute;

		}

		function checkEdge(edges, a, b) {

			if (a > b) {

				var tmp = a;
				a = b;
				b = tmp;

			}

			var list = edges[a];

			if (list === undefined) {

				edges[a] = [b];
				return true;

			} else if (list.indexOf(b) === -1) {

				list.push(b);
				return true;

			}

			return false;

		}

		this.getAttributeBuffer = getAttributeBuffer;
		this.getWireframeAttribute = getWireframeAttribute;

		this.update = update;

	};

	// File:../dev/three/renderers/webgl/WebGLShadowMap.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLShadowMap = function (_renderer, _lights, _objects) {

		var _gl = _renderer.context,
			_state = _renderer.state,
			_frustum = new THREE.Frustum(),
			_projScreenMatrix = new THREE.Matrix4(),

			_lightShadows = _lights.shadows,

			_shadowMapSize = new THREE.Vector2(),

			_lookTarget = new THREE.Vector3(),
			_lightPositionWorld = new THREE.Vector3(),

			_renderList = [],

			_MorphingFlag = 1,
			_SkinningFlag = 2,

			_NumberOfMaterialVariants = (_MorphingFlag | _SkinningFlag) + 1,

			_depthMaterials = new Array(_NumberOfMaterialVariants),
			_distanceMaterials = new Array(_NumberOfMaterialVariants),

			_materialCache = {};

		var cubeDirections = [
			new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)
		];

		var cubeUps = [
			new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0),
			new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
		];

		var cube2DViewPorts = [
			new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(),
			new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()
		];

		// init

		var depthMaterialTemplate = new THREE.MeshDepthMaterial();
		depthMaterialTemplate.depthPacking = THREE.RGBADepthPacking;
		depthMaterialTemplate.clipping = true;

		var distanceShader = THREE.ShaderLib["distanceRGBA"];
		var distanceUniforms = THREE.UniformsUtils.clone(distanceShader.uniforms);

		for (var i = 0; i !== _NumberOfMaterialVariants; ++i) {

			var useMorphing = (i & _MorphingFlag) !== 0;
			var useSkinning = (i & _SkinningFlag) !== 0;

			var depthMaterial = depthMaterialTemplate.clone();
			depthMaterial.morphTargets = useMorphing;
			depthMaterial.skinning = useSkinning;

			_depthMaterials[i] = depthMaterial;

			var distanceMaterial = new THREE.ShaderMaterial({
				defines: {
					'USE_SHADOWMAP': ''
				},
				uniforms: distanceUniforms,
				vertexShader: distanceShader.vertexShader,
				fragmentShader: distanceShader.fragmentShader,
				morphTargets: useMorphing,
				skinning: useSkinning,
				clipping: true
			});

			_distanceMaterials[i] = distanceMaterial;

		}

		//

		var scope = this;

		this.enabled = false;

		this.autoUpdate = true;
		this.needsUpdate = false;

		this.type = THREE.PCFShadowMap;
		this.cullFace = THREE.CullFaceFront;

		this.render = function (scene, camera) {

			if (scope.enabled === false) return;
			if (scope.autoUpdate === false && scope.needsUpdate === false) return;

			if (_lightShadows.length === 0) return;

			// Set GL state for depth map.
			_state.clearColor(1, 1, 1, 1);
			_state.disable(_gl.BLEND);
			_state.enable(_gl.CULL_FACE);
			_gl.frontFace(_gl.CCW);
			_gl.cullFace(scope.cullFace === THREE.CullFaceFront ? _gl.FRONT : _gl.BACK);
			_state.setDepthTest(true);
			_state.setScissorTest(false);

			// render depth map

			var faceCount, isPointLight;

			for (var i = 0, il = _lightShadows.length; i < il; i++) {

				var light = _lightShadows[i];

				var shadow = light.shadow;
				var shadowCamera = shadow.camera;

				_shadowMapSize.copy(shadow.mapSize);

				if (light instanceof THREE.PointLight) {

					faceCount = 6;
					isPointLight = true;

					var vpWidth = _shadowMapSize.x;
					var vpHeight = _shadowMapSize.y;

					// These viewports map a cube-map onto a 2D texture with the
					// following orientation:
					//
					//  xzXZ
					//   y Y
					//
					// X - Positive x direction
					// x - Negative x direction
					// Y - Positive y direction
					// y - Negative y direction
					// Z - Positive z direction
					// z - Negative z direction

					// positive X
					cube2DViewPorts[0].set(vpWidth * 2, vpHeight, vpWidth, vpHeight);
					// negative X
					cube2DViewPorts[1].set(0, vpHeight, vpWidth, vpHeight);
					// positive Z
					cube2DViewPorts[2].set(vpWidth * 3, vpHeight, vpWidth, vpHeight);
					// negative Z
					cube2DViewPorts[3].set(vpWidth, vpHeight, vpWidth, vpHeight);
					// positive Y
					cube2DViewPorts[4].set(vpWidth * 3, 0, vpWidth, vpHeight);
					// negative Y
					cube2DViewPorts[5].set(vpWidth, 0, vpWidth, vpHeight);

					_shadowMapSize.x *= 4.0;
					_shadowMapSize.y *= 2.0;

				} else {

					faceCount = 1;
					isPointLight = false;

				}

				if (shadow.map === null) {

					var pars = {
						minFilter: THREE.NearestFilter,
						magFilter: THREE.NearestFilter,
						format: THREE.RGBAFormat
					};

					shadow.map = new THREE.WebGLRenderTarget(_shadowMapSize.x, _shadowMapSize.y, pars);

					shadowCamera.updateProjectionMatrix();

				}

				if (shadow instanceof THREE.SpotLightShadow) {

					shadow.update(light);

				}

				var shadowMap = shadow.map;
				var shadowMatrix = shadow.matrix;

				_lightPositionWorld.setFromMatrixPosition(light.matrixWorld);
				shadowCamera.position.copy(_lightPositionWorld);

				_renderer.setRenderTarget(shadowMap);
				_renderer.clear();

				// render shadow map for each cube face (if omni-directional) or
				// run a single pass if not

				for (var face = 0; face < faceCount; face++) {

					if (isPointLight) {

						_lookTarget.copy(shadowCamera.position);
						_lookTarget.add(cubeDirections[face]);
						shadowCamera.up.copy(cubeUps[face]);
						shadowCamera.lookAt(_lookTarget);

						var vpDimensions = cube2DViewPorts[face];
						_state.viewport(vpDimensions);

					} else {

						_lookTarget.setFromMatrixPosition(light.target.matrixWorld);
						shadowCamera.lookAt(_lookTarget);

					}

					shadowCamera.updateMatrixWorld();
					shadowCamera.matrixWorldInverse.getInverse(shadowCamera.matrixWorld);

					// compute shadow matrix

					shadowMatrix.set(
						0.5, 0.0, 0.0, 0.5,
						0.0, 0.5, 0.0, 0.5,
						0.0, 0.0, 0.5, 0.5,
						0.0, 0.0, 0.0, 1.0
					);

					shadowMatrix.multiply(shadowCamera.projectionMatrix);
					shadowMatrix.multiply(shadowCamera.matrixWorldInverse);

					// update camera matrices and frustum

					_projScreenMatrix.multiplyMatrices(shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse);
					_frustum.setFromMatrix(_projScreenMatrix);

					// set object matrices & frustum culling

					_renderList.length = 0;

					projectObject(scene, camera, shadowCamera);

					// render shadow map
					// render regular objects

					for (var j = 0, jl = _renderList.length; j < jl; j++) {

						var object = _renderList[j];
						var geometry = _objects.update(object);
						var material = object.material;

						if (material instanceof THREE.MultiMaterial) {

							var groups = geometry.groups;
							var materials = material.materials;

							for (var k = 0, kl = groups.length; k < kl; k++) {

								var group = groups[k];
								var groupMaterial = materials[group.materialIndex];

								if (groupMaterial.visible === true) {

									var depthMaterial = getDepthMaterial(object, groupMaterial, isPointLight, _lightPositionWorld);
									_renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, group);

								}

							}

						} else {

							var depthMaterial = getDepthMaterial(object, material, isPointLight, _lightPositionWorld);
							_renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, null);

						}

					}

				}

			}

			// Restore GL state.
			var clearColor = _renderer.getClearColor(),
				clearAlpha = _renderer.getClearAlpha();
			_renderer.setClearColor(clearColor, clearAlpha);

			_state.enable(_gl.BLEND);

			if (scope.cullFace === THREE.CullFaceFront) {

				_gl.cullFace(_gl.BACK);

			}

			scope.needsUpdate = false;

		};

		function getDepthMaterial(object, material, isPointLight, lightPositionWorld) {

			var geometry = object.geometry;

			var result = null;

			var materialVariants = _depthMaterials;
			var customMaterial = object.customDepthMaterial;

			if (isPointLight) {

				materialVariants = _distanceMaterials;
				customMaterial = object.customDistanceMaterial;

			}

			if (!customMaterial) {

				var useMorphing = geometry.morphTargets !== undefined &&
					geometry.morphTargets.length > 0 && material.morphTargets;

				var useSkinning = object instanceof THREE.SkinnedMesh && material.skinning;

				var variantIndex = 0;

				if (useMorphing) variantIndex |= _MorphingFlag;
				if (useSkinning) variantIndex |= _SkinningFlag;

				result = materialVariants[variantIndex];

			} else {

				result = customMaterial;

			}

			if (_renderer.localClippingEnabled &&
				material.clipShadows === true &&
				material.clippingPlanes.length !== 0) {

				// in this case we need a unique material instance reflecting the
				// appropriate state

				var keyA = result.uuid,
					keyB = material.uuid;

				var materialsForVariant = _materialCache[keyA];

				if (materialsForVariant === undefined) {

					materialsForVariant = {};
					_materialCache[keyA] = materialsForVariant;

				}

				var cachedMaterial = materialsForVariant[keyB];

				if (cachedMaterial === undefined) {

					cachedMaterial = result.clone();
					materialsForVariant[keyB] = cachedMaterial;

				}

				result = cachedMaterial;

			}

			result.visible = material.visible;
			result.wireframe = material.wireframe;
			result.side = material.side;
			result.clipShadows = material.clipShadows;
			result.clippingPlanes = material.clippingPlanes;
			result.wireframeLinewidth = material.wireframeLinewidth;
			result.linewidth = material.linewidth;

			if (isPointLight && result.uniforms.lightPos !== undefined) {

				result.uniforms.lightPos.value.copy(lightPositionWorld);

			}

			return result;

		}

		function projectObject(object, camera, shadowCamera) {

			if (object.visible === false) return;

			if (object.layers.test(camera.layers) && (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) {

				if (object.castShadow && (object.frustumCulled === false || _frustum.intersectsObject(object) === true)) {

					var material = object.material;

					if (material.visible === true) {

						object.modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld);
						_renderList.push(object);

					}

				}

			}

			var children = object.children;

			for (var i = 0, l = children.length; i < l; i++) {

				projectObject(children[i], camera, shadowCamera);

			}

		}

	};

	// File:../dev/three/renderers/webgl/WebGLProgram.js

	THREE.WebGLProgram = (function () {

		var programIdCount = 0;

		function getEncodingComponents(encoding) {

			switch (encoding) {

				case THREE.LinearEncoding:
					return ['Linear', '( value )'];
				case THREE.sRGBEncoding:
					return ['sRGB', '( value )'];
				case THREE.RGBEEncoding:
					return ['RGBE', '( value )'];
				case THREE.RGBM7Encoding:
					return ['RGBM', '( value, 7.0 )'];
				case THREE.RGBM16Encoding:
					return ['RGBM', '( value, 16.0 )'];
				case THREE.RGBDEncoding:
					return ['RGBD', '( value, 256.0 )'];
				case THREE.GammaEncoding:
					return ['Gamma', '( value, float( GAMMA_FACTOR ) )'];
				default:
					throw new Error('unsupported encoding: ' + encoding);

			}

		}

		function getTexelDecodingFunction(functionName, encoding) {

			var components = getEncodingComponents(encoding);
			return "vec4 " + functionName + "( vec4 value ) { return " + components[0] + "ToLinear" + components[1] + "; }";

		}

		function getTexelEncodingFunction(functionName, encoding) {

			var components = getEncodingComponents(encoding);
			return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[0] + components[1] + "; }";

		}

		function getToneMappingFunction(functionName, toneMapping) {

			var toneMappingName;

			switch (toneMapping) {

				case THREE.LinearToneMapping:
					toneMappingName = "Linear";
					break;

				case THREE.ReinhardToneMapping:
					toneMappingName = "Reinhard";
					break;

				case THREE.Uncharted2ToneMapping:
					toneMappingName = "Uncharted2";
					break;

				case THREE.CineonToneMapping:
					toneMappingName = "OptimizedCineon";
					break;

				default:
					throw new Error('unsupported toneMapping: ' + toneMapping);

			}

			return "vec3 " + functionName + "( vec3 color ) { return " + toneMappingName + "ToneMapping( color ); }";

		}

		function generateExtensions(extensions, parameters, rendererExtensions) {

			extensions = extensions || {};

			var chunks = [
				(extensions.derivatives || parameters.envMapCubeUV || parameters.bumpMap || parameters.normalMap || parameters.flatShading) ? '#extension GL_OES_standard_derivatives : enable' : '',
				(extensions.fragDepth || parameters.logarithmicDepthBuffer) && rendererExtensions.get('EXT_frag_depth') ? '#extension GL_EXT_frag_depth : enable' : '',
				(extensions.drawBuffers) && rendererExtensions.get('WEBGL_draw_buffers') ? '#extension GL_EXT_draw_buffers : require' : '',
				(extensions.shaderTextureLOD || parameters.envMap) && rendererExtensions.get('EXT_shader_texture_lod') ? '#extension GL_EXT_shader_texture_lod : enable' : '',
			];

			return chunks.filter(filterEmptyLine).join('\n');

		}

		function generateDefines(defines) {

			var chunks = [];

			for (var name in defines) {

				var value = defines[name];

				if (value === false) continue;

				chunks.push('#define ' + name + ' ' + value);

			}

			return chunks.join('\n');

		}

		function fetchAttributeLocations(gl, program, identifiers) {

			var attributes = {};

			var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

			for (var i = 0; i < n; i++) {

				var info = gl.getActiveAttrib(program, i);
				var name = info.name;

				// console.log("THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:", name, i );

				attributes[name] = gl.getAttribLocation(program, name);

			}

			return attributes;

		}

		function filterEmptyLine(string) {

			return string !== '';

		}

		function replaceLightNums(string, parameters) {

			return string
				.replace(/NUM_DIR_LIGHTS/g, parameters.numDirLights)
				.replace(/NUM_SPOT_LIGHTS/g, parameters.numSpotLights)
				.replace(/NUM_POINT_LIGHTS/g, parameters.numPointLights)
				.replace(/NUM_HEMI_LIGHTS/g, 0);

		}

		function parseIncludes(string) {

			var pattern = /#include +<([\w\d.]+)>/g;

			function replace(match, include) {

				var replace = THREE.ShaderChunk[include];

				if (replace === undefined) {

					throw new Error('Can not resolve #include <' + include + '>');

				}

				return parseIncludes(replace);

			}

			return string.replace(pattern, replace);

		}

		function unrollLoops(string) {

			var pattern = /for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

			function replace(match, start, end, snippet) {

				var unroll = '';

				for (var i = parseInt(start); i < parseInt(end); i++) {

					unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');

				}

				return unroll;

			}

			return string.replace(pattern, replace);

		}

		return function WebGLProgram(renderer, code, material, parameters) {

			var gl = renderer.context;

			var extensions = material.extensions;
			var defines = material.defines;

			var vertexShader = material.__webglShader.vertexShader;
			var fragmentShader = material.__webglShader.fragmentShader;


			var envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
			var envMapModeDefine = 'ENVMAP_MODE_REFLECTION';
			var envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';

			if (parameters.envMap) {

				switch (material.envMap.mapping) {

					case THREE.CubeReflectionMapping:
					case THREE.CubeRefractionMapping:
						envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
						break;

					case THREE.CubeUVReflectionMapping:
					case THREE.CubeUVRefractionMapping:
						envMapTypeDefine = 'ENVMAP_TYPE_CUBE_UV';
						break;

					case THREE.EquirectangularReflectionMapping:
					case THREE.EquirectangularRefractionMapping:
						envMapTypeDefine = 'ENVMAP_TYPE_EQUIREC';
						break;

					case THREE.SphericalReflectionMapping:
						envMapTypeDefine = 'ENVMAP_TYPE_SPHERE';
						break;

				}

				switch (material.envMap.mapping) {

					case THREE.CubeRefractionMapping:
					case THREE.EquirectangularRefractionMapping:
						envMapModeDefine = 'ENVMAP_MODE_REFRACTION';
						break;

				}

				switch (material.combine) {

					case THREE.MultiplyOperation:
						envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
						break;

					case THREE.MixOperation:
						envMapBlendingDefine = 'ENVMAP_BLENDING_MIX';
						break;

					case THREE.AddOperation:
						envMapBlendingDefine = 'ENVMAP_BLENDING_ADD';
						break;

				}

			}
			var gammaFactorDefine = (renderer.gammaFactor > 0) ? renderer.gammaFactor : 1.0;

			var customExtensions = generateExtensions(extensions, parameters, renderer.extensions);

			var customDefines = generateDefines(defines);

			//

			var program = gl.createProgram();

			var prefixVertex, prefixFragment;

			if (material instanceof THREE.RawShaderMaterial) {

				prefixVertex = '';
				prefixFragment = '';

			} else {

				prefixVertex = [

					'precision ' + parameters.precision + ' float;',
					'precision ' + parameters.precision + ' int;',

					'#define SHADER_NAME ' + material.__webglShader.name,

					customDefines,

					parameters.supportsVertexTextures ? '#define VERTEX_TEXTURES' : '',

					'#define GAMMA_FACTOR ' + gammaFactorDefine,

					'#define MAX_BONES ' + parameters.maxBones,
					parameters.envMap ? '#define USE_ENVMAP' : '',
					parameters.envMap ? '#define ' + envMapModeDefine : '',
					parameters.lightMap ? '#define USE_LIGHTMAP' : '',
					parameters.map ? '#define USE_MAP' : '',
					parameters.aoMap ? '#define USE_AOMAP' : '',
					parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
					parameters.bumpMap ? '#define USE_BUMPMAP' : '',
					parameters.normalMap ? '#define USE_NORMALMAP' : '',
					parameters.displacementMap && parameters.supportsVertexTextures ? '#define USE_DISPLACEMENTMAP' : '',
					parameters.specularMap ? '#define USE_SPECULARMAP' : '',
					parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
					parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
					parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
					parameters.vertexColors ? '#define USE_COLOR' : '',

					parameters.flatShading ? '#define FLAT_SHADED' : '',

					parameters.skinning ? '#define USE_SKINNING' : '',
					parameters.useVertexTexture ? '#define BONE_TEXTURE' : '',

					parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
					parameters.flipSided ? '#define FLIP_SIDED' : '',

					'#define NUM_CLIPPING_PLANES ' + parameters.numClippingPlanes,

					parameters.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',

					parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
					parameters.logarithmicDepthBuffer && renderer.extensions.get('EXT_frag_depth') ? '#define USE_LOGDEPTHBUF_EXT' : '',

					'uniform mat4 modelMatrix;',
					'uniform mat4 modelViewMatrix;',
					'uniform mat4 projectionMatrix;',
					'uniform mat4 viewMatrix;',
					'uniform mat3 normalMatrix;',
					'uniform vec3 cameraPosition;',

					'attribute vec3 position;',
					'attribute vec3 normal;',
					'attribute vec2 uv;',

					'#ifdef USE_COLOR',

					'	attribute vec4 color;',

					'#endif',

					'#ifdef USE_SKINNING',

					'	attribute vec4 skinIndex;',
					'	attribute vec4 skinWeight;',

					'#endif',

					'\n'

				].filter(filterEmptyLine).join('\n');

				prefixFragment = [

					customExtensions,

					'precision ' + parameters.precision + ' float;',
					'precision ' + parameters.precision + ' int;',

					'#define SHADER_NAME ' + material.__webglShader.name,

					customDefines,

					parameters.lightMap ? '#define USE_LIGHTMAP' : '',

					parameters.alphaTest ? '#define ALPHATEST ' + parameters.alphaTest : '',

					'#define GAMMA_FACTOR ' + gammaFactorDefine,

					(parameters.useFog && parameters.fog) ? '#define USE_FOG' : '',
					(parameters.useFog && parameters.fogExp) ? '#define FOG_EXP2' : '',
					parameters.map ? '#define USE_MAP' : '',
					parameters.envMap ? '#define USE_ENVMAP' : '',
					parameters.envMap ? '#define ' + envMapTypeDefine : '',
					parameters.envMap ? '#define ' + envMapModeDefine : '',
					parameters.envMap ? '#define ' + envMapBlendingDefine : '',
					parameters.lightMap ? '#define USE_LIGHTMAP' : '',
					parameters.aoMap ? '#define USE_AOMAP' : '',
					parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
					parameters.bumpMap ? '#define USE_BUMPMAP' : '',
					parameters.normalMap ? '#define USE_NORMALMAP' : '',
					parameters.specularMap ? '#define USE_SPECULARMAP' : '',
					parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
					parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
					parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
					parameters.vertexColors ? '#define USE_COLOR' : '',

					parameters.flatShading ? '#define FLAT_SHADED' : '',
					parameters.enableConvertColor ? '#define USE_CONVERT_COLOR' : '',
					parameters.enableGray ? '#define USE_GRAY' : '',
					parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
					parameters.flipSided ? '#define FLIP_SIDED' : '',

					'#define NUM_CLIPPING_PLANES ' + parameters.numClippingPlanes,

					parameters.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : '',

					parameters.physicallyCorrectLights ? "#define PHYSICALLY_CORRECT_LIGHTS" : '',

					parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
					parameters.logarithmicDepthBuffer && renderer.extensions.get('EXT_frag_depth') ? '#define USE_LOGDEPTHBUF_EXT' : '',

					parameters.envMap && renderer.extensions.get('EXT_shader_texture_lod') ? '#define TEXTURE_LOD_EXT' : '',

					'uniform mat4 viewMatrix;',
					'uniform vec3 cameraPosition;',

					(parameters.toneMapping !== THREE.NoToneMapping) ? "#define TONE_MAPPING" : '',
					(parameters.toneMapping !== THREE.NoToneMapping) ? THREE.ShaderChunk['tonemapping_pars_fragment'] : '', // this code is required here because it is used by the toneMapping() function defined below
					(parameters.toneMapping !== THREE.NoToneMapping) ? getToneMappingFunction("toneMapping", parameters.toneMapping) : '',

					(parameters.outputEncoding || parameters.mapEncoding || parameters.envMapEncoding || parameters.emissiveMapEncoding) ? THREE.ShaderChunk['encodings_pars_fragment'] : '', // this code is required here because it is used by the various encoding/decoding function defined below
					parameters.mapEncoding ? getTexelDecodingFunction('mapTexelToLinear', parameters.mapEncoding) : '',
					parameters.envMapEncoding ? getTexelDecodingFunction('envMapTexelToLinear', parameters.envMapEncoding) : '',
					parameters.emissiveMapEncoding ? getTexelDecodingFunction('emissiveMapTexelToLinear', parameters.emissiveMapEncoding) : '',
					parameters.outputEncoding ? getTexelEncodingFunction("linearToOutputTexel", parameters.outputEncoding) : '',

					parameters.depthPacking ? "#define DEPTH_PACKING " + material.depthPacking : '',

					'\n'

				].filter(filterEmptyLine).join('\n');

			}

			vertexShader = parseIncludes(vertexShader, parameters);
			vertexShader = replaceLightNums(vertexShader, parameters);

			fragmentShader = parseIncludes(fragmentShader, parameters);
			fragmentShader = replaceLightNums(fragmentShader, parameters);

			if (material instanceof THREE.ShaderMaterial === false) {

				vertexShader = unrollLoops(vertexShader);
				fragmentShader = unrollLoops(fragmentShader);

			}

			var vertexGlsl = prefixVertex + vertexShader;
			var fragmentGlsl = prefixFragment + fragmentShader;

			// console.log( '*VERTEX*', vertexGlsl );
			// console.log( '*FRAGMENT*', fragmentGlsl );

			var glVertexShader = THREE.WebGLShader(gl, gl.VERTEX_SHADER, vertexGlsl);
			var glFragmentShader = THREE.WebGLShader(gl, gl.FRAGMENT_SHADER, fragmentGlsl);

			gl.attachShader(program, glVertexShader);
			gl.attachShader(program, glFragmentShader);

			// Force a particular attribute to index 0.

			if (material.index0AttributeName !== undefined) {

				gl.bindAttribLocation(program, 0, material.index0AttributeName);

			} else if (parameters.morphTargets === true) {

				// programs with morphTargets displace position out of attribute 0
				gl.bindAttribLocation(program, 0, 'position');

			}

			gl.linkProgram(program);

			var programLog = gl.getProgramInfoLog(program);
			var vertexLog = gl.getShaderInfoLog(glVertexShader);
			var fragmentLog = gl.getShaderInfoLog(glFragmentShader);

			var runnable = true;
			var haveDiagnostics = true;

			// console.log( '**VERTEX**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glVertexShader ) );
			// console.log( '**FRAGMENT**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glFragmentShader ) );

			if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {

				runnable = false;

				console.error('THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog);

			} else if (programLog !== '') {

				console.warn('THREE.WebGLProgram: gl.getProgramInfoLog()', programLog);

			} else if (vertexLog === '' || fragmentLog === '') {

				haveDiagnostics = false;

			}

			if (haveDiagnostics) {

				this.diagnostics = {

					runnable: runnable,
					material: material,

					programLog: programLog,

					vertexShader: {

						log: vertexLog,
						prefix: prefixVertex

					},

					fragmentShader: {

						log: fragmentLog,
						prefix: prefixFragment

					}

				};

			}

			// clean up

			// PI_BEGIN Shader缓冲
			// gl.deleteShader( glVertexShader );
			// gl.deleteShader( glFragmentShader );
			// PI_END

			// set up caching for uniform locations

			var cachedUniforms;

			this.getUniforms = function () {

				if (cachedUniforms === undefined) {

					cachedUniforms =
						new THREE.WebGLUniforms(gl, program, renderer);

				}

				return cachedUniforms;

			};

			// set up caching for attribute locations

			var cachedAttributes;

			this.getAttributes = function () {

				if (cachedAttributes === undefined) {

					cachedAttributes = fetchAttributeLocations(gl, program);

				}

				return cachedAttributes;

			};

			// free resource

			this.destroy = function () {

				gl.deleteProgram(program);
				this.program = undefined;

			};

			// DEPRECATED

			Object.defineProperties(this, {

				uniforms: {
					get: function () {

						console.warn('THREE.WebGLProgram: .uniforms is now .getUniforms().');
						return this.getUniforms();

					}
				},

				attributes: {
					get: function () {

						console.warn('THREE.WebGLProgram: .attributes is now .getAttributes().');
						return this.getAttributes();

					}
				}

			});


			//

			this.id = programIdCount++;
			this.code = code;
			this.usedTimes = 1;
			this.program = program;
			this.vertexShader = glVertexShader;
			this.fragmentShader = glFragmentShader;

			return this;

		};

	})();

	// File:../dev/three/renderers/webgl/WebGLPrograms.js

	THREE.WebGLPrograms = function (renderer, capabilities) {

		var programs = [];

		var shaderIDs = {
			MeshBasicMaterial: 'basic',
			MeshStandardMaterial: 'physical',
			MeshPhysicalMaterial: 'physical',
			MeshParticlesMaterial: 'particle',
			LineBasicMaterial: 'basic',
			MeshLambertMaterial: 'lambert',
			PointsMaterial: 'points',
			MeshT4M3Material: 'terraint4m3',
			MeshT4M2Material: 'terraint4m2'
		};

		var parameterNames = [
			"precision", "supportsVertexTextures", "map", "mapEncoding", "envMap", "envMapMode", "envMapEncoding", "enableConvertColor",
			"lightMap", "aoMap", "emissiveMap", "emissiveMapEncoding", "bumpMap", "normalMap", "displacementMap", "specularMap",
			"roughnessMap", "metalnessMap",
			"alphaMap", "combine", "vertexColors", "fog", "useFog", "fogExp",
			"flatShading", "enableGray", "sizeAttenuation", "logarithmicDepthBuffer",
			"skinning", "maxBones", "useVertexTexture", "morphTargets", "morphNormals",
			"maxMorphTargets", "maxMorphNormals", "premultipliedAlpha",
			"numDirLights", "numPointLights", "numSpotLights",
			"toneMapping", 'physicallyCorrectLights',
			"alphaTest", "doubleSided", "flipSided", "numClippingPlanes", "depthPacking"
		];


		function allocateBones(object) {

			if (capabilities.floatVertexTextures && object && object.skeletonRef && object.useVertexTexture) {

				return 1024;

			} else {

				// default for when object is not specified
				// ( for example when prebuilding shader to be used with multiple objects )
				//
				//  - leave some extra space for other uniforms
				//  - limit here is ANGLE's 254 max uniform vectors
				//    (up to 54 should be safe)

				var nVertexUniforms = capabilities.maxVertexUniforms;

				// PI_BEGIN
				var nVertexMatrices = Math.floor((nVertexUniforms - 60) / 4);
				var maxBones = nVertexMatrices;
				if (object && object.skeletonRef) {
					if (maxBones < object.skeletonRef.boneIndexs.length) {
						var info = 'Error, WebGLRenderer: too many bones - ' + object.skeletonRef.boneIndexs.length + ', this GPU supports just ' + maxBones;
						alert(info);
						console.log(info);
						throw new Error("too many bones");
					}
				}
				// PI_END

				return maxBones;

			}

		}

		function getTextureEncodingFromMap(map, gammaOverrideLinear) {

			var encoding;

			if (!map) {

				encoding = THREE.LinearEncoding;

			} else if (map instanceof THREE.Texture) {

				encoding = map.encoding;

			} else if (map instanceof THREE.WebGLRenderTarget) {

				encoding = map.texture.encoding;

			}

			// add backwards compatibility for WebGLRenderer.gammaInput/gammaOutput parameter, should probably be removed at some point.
			if (encoding === THREE.LinearEncoding && gammaOverrideLinear) {

				encoding = THREE.GammaEncoding;

			}

			return encoding;

		}

		this.getParameters = function (material, lights, fog, object) {

			var shaderID = shaderIDs[material.type];

			// heuristics to create shader parameters according to lights in the scene
			// (not to blow over maxLights budget)

			var maxBones = allocateBones(object);
			var precision = renderer.getPrecision();

			if (material.precision !== null) {

				precision = capabilities.getMaxPrecision(material.precision);

				if (precision !== material.precision) {

					console.warn('THREE.WebGLProgram.getParameters:', material.precision, 'not supported, using', precision, 'instead.');

				}

			}

			var parameters = {

				shaderID: shaderID,

				precision: precision,
				supportsVertexTextures: capabilities.vertexTextures,
				outputEncoding: getTextureEncodingFromMap(renderer.getCurrentRenderTarget(), renderer.gammaOutput),
				map: !!material.map,
				mapEncoding: getTextureEncodingFromMap(material.map, renderer.gammaInput),
				enableConvertColor: !!material.enableConvertColor,
				envMap: !!material.envMap,
				envMapMode: material.envMap && material.envMap.mapping,
				envMapEncoding: getTextureEncodingFromMap(material.envMap, renderer.gammaInput),
				envMapCubeUV: (!!material.envMap) && ((material.envMap.mapping === THREE.CubeUVReflectionMapping) || (material.envMap.mapping === THREE.CubeUVRefractionMapping)),
				lightMap: !!material.lightMap,
				aoMap: !!material.aoMap,
				emissiveMap: !!material.emissiveMap,
				emissiveMapEncoding: getTextureEncodingFromMap(material.emissiveMap, renderer.gammaInput),
				bumpMap: !!material.bumpMap,
				normalMap: !!material.normalMap,
				displacementMap: !!material.displacementMap,
				roughnessMap: !!material.roughnessMap,
				metalnessMap: !!material.metalnessMap,
				specularMap: !!material.specularMap,
				alphaMap: !!material.alphaMap,

				combine: material.combine,

				vertexColors: material.vertexColors,

				fog: fog,
				useFog: material.fog,
				fogExp: fog instanceof THREE.FogExp2,

				flatShading: material.shading === THREE.FlatShading,

				sizeAttenuation: material.sizeAttenuation,
				logarithmicDepthBuffer: capabilities.logarithmicDepthBuffer,

				// PI_BEGIN
				enableGray: material.enableGray,
				// PI_END

				lightMap: !!material.lightMap,
				skinning: material.skinning,
				maxBones: maxBones,
				useVertexTexture: capabilities.floatVertexTextures && object && object.skeletonRef && object.useVertexTexture,

				numDirLights: lights.directional.length,
				numPointLights: lights.point.length,
				numSpotLights: lights.spot.length,

				numClippingPlanes: 0,
				toneMapping: renderer.toneMapping,
				physicallyCorrectLights: renderer.physicallyCorrectLights,

				premultipliedAlpha: material.premultipliedAlpha,

				alphaTest: material.alphaTest,
				doubleSided: material.side === THREE.DoubleSide,
				flipSided: material.side === THREE.BackSide,

				depthPacking: (material.depthPacking !== undefined) ? material.depthPacking : false

			};

			return parameters;

		};

		this.getProgramCode = function (material, parameters) {

			var array = [];

			if (parameters.shaderID) {

				array.push(parameters.shaderID);

			} else {

				array.push(material.fragmentShader);
				array.push(material.vertexShader);

			}

			if (material.defines !== undefined) {

				for (var name in material.defines) {

					array.push(name);
					array.push(material.defines[name]);

				}

			}

			for (var i = 0; i < parameterNames.length; i++) {

				array.push(parameters[parameterNames[i]]);

			}

			return array.join();

		};

		this.acquireProgram = function (material, parameters, code) {

			var program;

			// Check if code has been already compiled
			for (var p = 0, pl = programs.length; p < pl; p++) {

				var programInfo = programs[p];

				if (programInfo.code === code) {

					program = programInfo;
					++program.usedTimes;

					break;

				}

			}

			if (program === undefined) {

				program = new THREE.WebGLProgram(renderer, code, material, parameters);
				programs.push(program);

			}

			return program;

		};

		this.releaseProgram = function (program) {
			// PI_BEGIN
			// if (--program.usedTimes === 0) {

			// 	// Remove from unordered set
			// 	var i = programs.indexOf(program);
			// 	programs[i] = programs[programs.length - 1];
			// 	programs.pop();

			// 	// Free WebGL resources
			// 	program.destroy();

			// }
			// PI_END
		};

		// Exposed for resource monitoring & error feedback via renderer.info:
		this.programs = programs;

	};

	// File:../dev/three/renderers/webgl/WebGLProperties.js

	/**
	 * @author fordacious / fordacious.github.io
	 */

	THREE.WebGLProperties = function () {

		var properties = {};

		this.get = function (object) {

			var uuid = object.uuid;
			var map = properties[uuid];

			if (map === undefined) {

				map = {};
				properties[uuid] = map;

			}

			return map;

		};

		this.delete = function (object) {

			delete properties[object.uuid];

		};

		this.clear = function () {

			properties = {};

		};

	};

	// File:../dev/three/renderers/webgl/WebGLShader.js

	THREE.WebGLShader = (function () {

		var shaderCache = {};

		function addLineNumbers(string) {

			var lines = string.split('\n');

			for (var i = 0; i < lines.length; i++) {

				lines[i] = (i + 1) + ': ' + lines[i];

			}

			return lines.join('\n');

		}

		return function WebGLShader(gl, type, string) {

			// PI_BEGIN 加缓冲
			var shader = shaderCache[string];
			if (shader) return shader;

			shader = gl.createShader(type);
			shaderCache[string] = shader;
			// PI_END

			gl.shaderSource(shader, string);
			gl.compileShader(shader);

			if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {

				console.error('THREE.WebGLShader: Shader couldn\'t compile.');

			}

			if (gl.getShaderInfoLog(shader) !== '') {

				console.warn('THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog(shader), addLineNumbers(string));

			}

			// --enable-privileged-webgl-extension
			// console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

			return shader;

		};

	})();

	// File:../dev/three/renderers/webgl/WebGLState.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.WebGLState = function (gl, extensions, paramThreeToGL) {

		var _this = this;

		var color = new THREE.Vector4();

		var maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		var newAttributes = new Uint8Array(maxVertexAttributes);
		var enabledAttributes = new Uint8Array(maxVertexAttributes);
		var attributeDivisors = new Uint8Array(maxVertexAttributes);

		var capabilities = {};

		var compressedTextureFormats = null;

		var currentBlending = null;
		var currentBlendEquation = null;
		var currentBlendSrc = null;
		var currentBlendDst = null;
		var currentBlendEquationAlpha = null;
		var currentBlendSrcAlpha = null;
		var currentBlendDstAlpha = null;
		var currentPremultipledAlpha = false;

		var currentDepthFunc = null;
		var currentDepthWrite = null;

		var currentColorWrite = null;

		var currentStencilWrite = null;
		var currentStencilFunc = null;
		var currentStencilRef = null;
		var currentStencilMask = null;
		var currentStencilFail = null;
		var currentStencilZFail = null;
		var currentStencilZPass = null;

		var currentFlipSided = null;

		var currentLineWidth = null;

		var currentPolygonOffsetFactor = null;
		var currentPolygonOffsetUnits = null;

		var currentScissorTest = null;

		var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

		var currentTextureSlot = undefined;
		var currentBoundTextures = {};

		var currentClearColor = new THREE.Vector4();
		var currentClearDepth = null;
		var currentClearStencil = null;

		var currentScissor = new THREE.Vector4();
		var currentViewport = new THREE.Vector4();

		this.init = function () {

			this.clearColor(0, 0, 0, 1);
			this.clearDepth(1);
			this.clearStencil(0);

			this.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);

			gl.frontFace(gl.CCW);
			gl.cullFace(gl.BACK);
			this.enable(gl.CULL_FACE);

			this.enable(gl.BLEND);
			gl.blendEquation(gl.FUNC_ADD);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		};

		this.initAttributes = function () {

			for (var i = 0, l = newAttributes.length; i < l; i++) {

				newAttributes[i] = 0;

			}

		};

		this.enableAttribute = function (attribute) {

			newAttributes[attribute] = 1;

			if (enabledAttributes[attribute] === 0) {

				gl.enableVertexAttribArray(attribute);
				enabledAttributes[attribute] = 1;

			}

			if (attributeDivisors[attribute] !== 0) {

				var extension = extensions.get('ANGLE_instanced_arrays');

				extension.vertexAttribDivisorANGLE(attribute, 0);
				attributeDivisors[attribute] = 0;

			}

		};

		this.enableAttributeAndDivisor = function (attribute, meshPerAttribute, extension) {

			newAttributes[attribute] = 1;

			if (enabledAttributes[attribute] === 0) {

				gl.enableVertexAttribArray(attribute);
				enabledAttributes[attribute] = 1;

			}

			if (attributeDivisors[attribute] !== meshPerAttribute) {

				extension.vertexAttribDivisorANGLE(attribute, meshPerAttribute);
				attributeDivisors[attribute] = meshPerAttribute;

			}

		};

		this.disableUnusedAttributes = function () {

			for (var i = 0, l = enabledAttributes.length; i < l; i++) {

				if (enabledAttributes[i] !== newAttributes[i]) {

					gl.disableVertexAttribArray(i);
					enabledAttributes[i] = 0;

				}

			}

		};

		this.enable = function (id) {

			if (capabilities[id] !== true) {

				gl.enable(id);
				capabilities[id] = true;

			}

		};

		this.disable = function (id) {

			if (capabilities[id] !== false) {

				gl.disable(id);
				capabilities[id] = false;

			}

		};

		this.getCompressedTextureFormats = function () {

			if (compressedTextureFormats === null) {

				compressedTextureFormats = [];

				if (extensions.get('WEBGL_compressed_texture_pvrtc') ||
					extensions.get('WEBGL_compressed_texture_s3tc') ||
					extensions.get('WEBGL_compressed_texture_etc1')) {

					var formats = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);

					for (var i = 0; i < formats.length; i++) {

						compressedTextureFormats.push(formats[i]);

					}

				}

			}

			return compressedTextureFormats;

		};

		this.setBlending = function (blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {

			if (blending === THREE.NoBlending) {

				this.disable(gl.BLEND);

			} else {

				this.enable(gl.BLEND);

			}

			if (blending !== currentBlending || premultipliedAlpha !== currentPremultipledAlpha) {

				if (blending === THREE.AdditiveBlending) {

					if (premultipliedAlpha) {

						gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
						gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);

					} else {

						gl.blendEquation(gl.FUNC_ADD);
						gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

					}

				} else if (blending === THREE.SubtractiveBlending) {

					if (premultipliedAlpha) {

						gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
						gl.blendFuncSeparate(gl.ZERO, gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);

					} else {

						gl.blendEquation(gl.FUNC_ADD);
						gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);

					}

				} else if (blending === THREE.MultiplyBlending) {

					if (premultipliedAlpha) {

						gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
						gl.blendFuncSeparate(gl.ZERO, gl.ZERO, gl.SRC_COLOR, gl.SRC_ALPHA);

					} else {

						gl.blendEquation(gl.FUNC_ADD);
						gl.blendFunc(gl.ZERO, gl.SRC_COLOR);

					}

				} else {

					if (premultipliedAlpha) {

						gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
						gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

					} else {

						gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
						gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

					}

				}

				currentBlending = blending;
				currentPremultipledAlpha = premultipliedAlpha;

			}

			if (blending === THREE.CustomBlending) {

				blendEquationAlpha = blendEquationAlpha || blendEquation;
				blendSrcAlpha = blendSrcAlpha || blendSrc;
				blendDstAlpha = blendDstAlpha || blendDst;

				if (blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha) {

					gl.blendEquationSeparate(paramThreeToGL(blendEquation), paramThreeToGL(blendEquationAlpha));

					currentBlendEquation = blendEquation;
					currentBlendEquationAlpha = blendEquationAlpha;

				}

				if (blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha) {

					gl.blendFuncSeparate(paramThreeToGL(blendSrc), paramThreeToGL(blendDst), paramThreeToGL(blendSrcAlpha), paramThreeToGL(blendDstAlpha));

					currentBlendSrc = blendSrc;
					currentBlendDst = blendDst;
					currentBlendSrcAlpha = blendSrcAlpha;
					currentBlendDstAlpha = blendDstAlpha;

				}

			} else {

				currentBlendEquation = null;
				currentBlendSrc = null;
				currentBlendDst = null;
				currentBlendEquationAlpha = null;
				currentBlendSrcAlpha = null;
				currentBlendDstAlpha = null;

			}

		};

		this.setDepthFunc = function (depthFunc) {

			if (currentDepthFunc !== depthFunc) {

				if (depthFunc) {

					switch (depthFunc) {

						case THREE.NeverDepth:

							gl.depthFunc(gl.NEVER);
							break;

						case THREE.AlwaysDepth:

							gl.depthFunc(gl.ALWAYS);
							break;

						case THREE.LessDepth:

							gl.depthFunc(gl.LESS);
							break;

						case THREE.LessEqualDepth:

							gl.depthFunc(gl.LEQUAL);
							break;

						case THREE.EqualDepth:

							gl.depthFunc(gl.EQUAL);
							break;

						case THREE.GreaterEqualDepth:

							gl.depthFunc(gl.GEQUAL);
							break;

						case THREE.GreaterDepth:

							gl.depthFunc(gl.GREATER);
							break;

						case THREE.NotEqualDepth:

							gl.depthFunc(gl.NOTEQUAL);
							break;

						default:

							gl.depthFunc(gl.LEQUAL);

					}

				} else {

					gl.depthFunc(gl.LEQUAL);

				}

				currentDepthFunc = depthFunc;

			}

		};

		this.setDepthTest = function (depthTest) {

			if (depthTest) {

				this.enable(gl.DEPTH_TEST);

			} else {

				this.disable(gl.DEPTH_TEST);

			}

		};

		this.setDepthWrite = function (depthWrite) {

			// TODO: Rename to setDepthMask

			if (currentDepthWrite !== depthWrite) {

				gl.depthMask(depthWrite);
				currentDepthWrite = depthWrite;

			}

		};

		this.setColorWrite = function (colorWrite) {

			// TODO: Rename to setColorMask

			if (currentColorWrite !== colorWrite) {

				gl.colorMask(colorWrite, colorWrite, colorWrite, colorWrite);
				currentColorWrite = colorWrite;

			}

		};

		this.setStencilFunc = function (stencilFunc, stencilRef, stencilMask) {

			if (currentStencilFunc !== stencilFunc ||
				currentStencilRef !== stencilRef ||
				currentStencilMask !== stencilMask) {

				gl.stencilFunc(stencilFunc, stencilRef, stencilMask);

				currentStencilFunc = stencilFunc;
				currentStencilRef = stencilRef;
				currentStencilMask = stencilMask;

			}

		};

		this.setStencilOp = function (stencilFail, stencilZFail, stencilZPass) {

			if (currentStencilFail !== stencilFail ||
				currentStencilZFail !== stencilZFail ||
				currentStencilZPass !== stencilZPass) {

				gl.stencilOp(stencilFail, stencilZFail, stencilZPass);

				currentStencilFail = stencilFail;
				currentStencilZFail = stencilZFail;
				currentStencilZPass = stencilZPass;

			}

		};

		this.setStencilTest = function (stencilTest) {

			if (stencilTest) {

				this.enable(gl.STENCIL_TEST);

			} else {

				this.disable(gl.STENCIL_TEST);

			}

		};

		this.setStencilWrite = function (stencilWrite) {

			// TODO: Rename to setStencilMask

			if (currentStencilWrite !== stencilWrite) {

				gl.stencilMask(stencilWrite);
				currentStencilWrite = stencilWrite;

			}

		};

		this.setFlipSided = function (flipSided) {

			if (currentFlipSided !== flipSided) {

				if (flipSided) {

					gl.frontFace(gl.CW);

				} else {

					gl.frontFace(gl.CCW);

				}

				currentFlipSided = flipSided;

			}

		};

		this.setLineWidth = function (width) {

			if (width !== currentLineWidth) {

				gl.lineWidth(width);

				currentLineWidth = width;

			}

		};

		this.setPolygonOffset = function (polygonOffset, factor, units) {

			if (polygonOffset) {

				this.enable(gl.POLYGON_OFFSET_FILL);

			} else {

				this.disable(gl.POLYGON_OFFSET_FILL);

			}

			if (polygonOffset && (currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units)) {

				gl.polygonOffset(factor, units);

				currentPolygonOffsetFactor = factor;
				currentPolygonOffsetUnits = units;

			}

		};

		this.getScissorTest = function () {

			return currentScissorTest;

		};

		this.setScissorTest = function (scissorTest) {

			currentScissorTest = scissorTest;

			if (scissorTest) {

				this.enable(gl.SCISSOR_TEST);

			} else {

				this.disable(gl.SCISSOR_TEST);

			}

		};

		// texture

		this.activeTexture = function (webglSlot) {

			if (webglSlot === undefined) webglSlot = gl.TEXTURE0 + maxTextures - 1;

			if (currentTextureSlot !== webglSlot) {

				gl.activeTexture(webglSlot);
				currentTextureSlot = webglSlot;

			}

		};

		this.bindTexture = function (webglType, webglTexture) {

			if (currentTextureSlot === undefined) {

				_this.activeTexture();

			}

			var boundTexture = currentBoundTextures[currentTextureSlot];

			if (boundTexture === undefined) {

				boundTexture = {
					type: undefined,
					texture: undefined
				};
				currentBoundTextures[currentTextureSlot] = boundTexture;

			}

			if (boundTexture.type !== webglType || boundTexture.texture !== webglTexture) {

				gl.bindTexture(webglType, webglTexture);

				boundTexture.type = webglType;
				boundTexture.texture = webglTexture;

			}

		};

		this.compressedTexImage2D = function () {

			try {

				gl.compressedTexImage2D.apply(gl, arguments);

			} catch (error) {

				console.error(error);

			}

		};

		this.texImage2D = function () {

			try {

				gl.texImage2D.apply(gl, arguments);

			} catch (error) {

				console.error(error);

			}

		};

		// clear values

		this.clearColor = function (r, g, b, a) {

			color.set(r, g, b, a);

			if (currentClearColor.equals(color) === false) {

				gl.clearColor(r, g, b, a);
				currentClearColor.copy(color);

			}

		};

		this.clearDepth = function (depth) {

			if (currentClearDepth !== depth) {

				gl.clearDepth(depth);
				currentClearDepth = depth;

			}

		};

		this.clearStencil = function (stencil) {

			if (currentClearStencil !== stencil) {

				gl.clearStencil(stencil);
				currentClearStencil = stencil;

			}

		};

		//

		this.scissor = function (scissor) {

			if (currentScissor.equals(scissor) === false) {

				gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
				currentScissor.copy(scissor);

			}

		};

		this.viewport = function (viewport) {

			if (currentViewport.equals(viewport) === false) {

				gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
				currentViewport.copy(viewport);

			}

		};

		//

		this.reset = function () {

			for (var i = 0; i < enabledAttributes.length; i++) {

				if (enabledAttributes[i] === 1) {

					gl.disableVertexAttribArray(i);
					enabledAttributes[i] = 0;

				}

			}

			capabilities = {};

			compressedTextureFormats = null;

			currentTextureSlot = undefined;
			currentBoundTextures = {};

			currentBlending = null;

			currentColorWrite = null;
			currentDepthWrite = null;
			currentStencilWrite = null;

			currentFlipSided = null;

		};

	};

	// File:../dev/three/renderers/webgl/WebGLUniforms.js

	/**
	 *
	 * Uniforms of a program.
	 * Those form a tree structure with a special top-level container for the root,
	 * which you get by calling 'new WebGLUniforms( gl, program, renderer )'.
	 *
	 *
	 * Properties of inner nodes including the top-level container:
	 *
	 * .seq - array of nested uniforms
	 * .map - nested uniforms by name
	 *
	 *
	 * Methods of all nodes except the top-level container:
	 *
	 * .setValue( gl, value, [renderer] )
	 *
	 * 		uploads a uniform value(s)
	 *  	the 'renderer' parameter is needed for sampler uniforms
	 *
	 *
	 * Static methods of the top-level container (renderer factorizations):
	 *
	 * .upload( gl, seq, values, renderer )
	 *
	 * 		sets uniforms in 'seq' to 'values[id].value'
	 *
	 * .seqWithValue( seq, values ) : filteredSeq
	 *
	 * 		filters 'seq' entries with corresponding entry in values
	 *
	 * .splitDynamic( seq, values ) : filteredSeq
	 *
	 * 		filters 'seq' entries with dynamic entry and removes them from 'seq'
	 *
	 *
	 * Methods of the top-level container (renderer factorizations):
	 *
	 * .setValue( gl, name, value )
	 *
	 * 		sets uniform with  name 'name' to 'value'
	 *
	 * .set( gl, obj, prop )
	 *
	 * 		sets uniform from object and property with same name than uniform
	 *
	 * .setOptional( gl, obj, prop )
	 *
	 * 		like .set for an optional property of the object
	 *
	 *
	 * @author tschw
	 *
	 */

	THREE.WebGLUniforms = (function () { // scope

		// --- Base for inner nodes (including the root) ---

		var UniformContainer = function () {

				this.seq = [];
				this.map = {};

			},

			// --- Utilities ---

			// Array Caches (provide typed arrays for temporary by size)

			arrayCacheF32 = [],
			arrayCacheI32 = [],

			uncacheTemporaryArrays = function () {

				arrayCacheF32.length = 0;
				arrayCacheI32.length = 0;

			},

			// Flattening for arrays of vectors and matrices

			flatten = function (array, nBlocks, blockSize) {

				var firstElem = array[0];

				if (firstElem <= 0 || firstElem > 0) return array;
				// unoptimized: ! isNaN( firstElem )
				// see http://jacksondunstan.com/articles/983

				var n = nBlocks * blockSize,
					r = arrayCacheF32[n];

				if (r === undefined) {

					r = new Float32Array(n);
					arrayCacheF32[n] = r;

				}

				if (nBlocks !== 0) {

					firstElem.toArray(r, 0);

					for (var i = 1, offset = 0; i !== nBlocks; ++i) {

						offset += blockSize;
						array[i].toArray(r, offset);

					}

				}

				return r;

			},

			// Texture unit allocation

			allocTexUnits = function (renderer, n) {

				var r = arrayCacheI32[n];

				if (r === undefined) {

					r = new Int32Array(n);
					arrayCacheI32[n] = r;

				}

				for (var i = 0; i !== n; ++i)
					r[i] = renderer.allocTextureUnit();

				return r;

			},

			// --- Setters ---

			// Note: Defining these methods externally, because they come in a bunch
			// and this way their names minify.

			// Single scalar

			setValue1f = function (gl, v) {
				gl.uniform1f(this.addr, v);
			},
			setValue1i = function (gl, v) {
				gl.uniform1i(this.addr, v);
			},

			// Single float vector (from flat array or THREE.VectorN)

			setValue2fv = function (gl, v) {

				if (v.x === undefined) gl.uniform2fv(this.addr, v);
				else gl.uniform2f(this.addr, v.x, v.y);

			},

			setValue3fv = function (gl, v) {

				if (v.x !== undefined)
					gl.uniform3f(this.addr, v.x, v.y, v.z);
				else if (v.r !== undefined)
					gl.uniform3f(this.addr, v.r, v.g, v.b);
				else
					gl.uniform3fv(this.addr, v);

			},

			setValue4fv = function (gl, v) {

				if (v.x === undefined) gl.uniform4fv(this.addr, v);
				else gl.uniform4f(this.addr, v.x, v.y, v.z, v.w);

			},

			// Single matrix (from flat array or MatrixN)

			setValue2fm = function (gl, v) {

				gl.uniformMatrix2fv(this.addr, false, v.elements || v);

			},

			setValue3fm = function (gl, v) {

				gl.uniformMatrix3fv(this.addr, false, v.elements || v);

			},

			setValue4fm = function (gl, v) {

				gl.uniformMatrix4fv(this.addr, false, v.elements || v);

			},

			// Single texture (2D / Cube)

			setValueT1 = function (gl, v, renderer) {

				var unit = renderer.allocTextureUnit();
				gl.uniform1i(this.addr, unit);
				if (v) renderer.setTexture2D(v, unit);

			},

			setValueT6 = function (gl, v, renderer) {

				var unit = renderer.allocTextureUnit();
				gl.uniform1i(this.addr, unit);
				if (v) renderer.setTextureCube(v, unit);

			},

			// Integer / Boolean vectors or arrays thereof (always flat arrays)

			setValue2iv = function (gl, v) {
				gl.uniform2iv(this.addr, v);
			},
			setValue3iv = function (gl, v) {
				gl.uniform3iv(this.addr, v);
			},
			setValue4iv = function (gl, v) {
				gl.uniform4iv(this.addr, v);
			},

			// Helper to pick the right setter for the singular case

			getSingularSetter = function (type) {

				switch (type) {

					case 0x1406:
						return setValue1f; // FLOAT
					case 0x8b50:
						return setValue2fv; // _VEC2
					case 0x8b51:
						return setValue3fv; // _VEC3
					case 0x8b52:
						return setValue4fv; // _VEC4

					case 0x8b5a:
						return setValue2fm; // _MAT2
					case 0x8b5b:
						return setValue3fm; // _MAT3
					case 0x8b5c:
						return setValue4fm; // _MAT4

					case 0x8b5e:
						return setValueT1; // SAMPLER_2D
					case 0x8b60:
						return setValueT6; // SAMPLER_CUBE

					case 0x1404:
					case 0x8b56:
						return setValue1i; // INT, BOOL
					case 0x8b53:
					case 0x8b57:
						return setValue2iv; // _VEC2
					case 0x8b54:
					case 0x8b58:
						return setValue3iv; // _VEC3
					case 0x8b55:
					case 0x8b59:
						return setValue4iv; // _VEC4

				}

			},

			// Array of scalars

			setValue1fv = function (gl, v) {
				gl.uniform1fv(this.addr, v);
			},
			setValue1iv = function (gl, v) {
				gl.uniform1iv(this.addr, v);
			},

			// Array of vectors (flat or from THREE classes)

			setValueV2a = function (gl, v) {

				gl.uniform2fv(this.addr, flatten(v, this.size, 2));

			},

			setValueV3a = function (gl, v) {

				gl.uniform3fv(this.addr, flatten(v, this.size, 3));

			},

			setValueV4a = function (gl, v) {

				gl.uniform4fv(this.addr, flatten(v, this.size, 4));

			},

			// Array of matrices (flat or from THREE clases)

			setValueM2a = function (gl, v) {

				gl.uniformMatrix2fv(this.addr, false, flatten(v, this.size, 4));

			},

			setValueM3a = function (gl, v) {

				gl.uniformMatrix3fv(this.addr, false, flatten(v, this.size, 9));

			},

			setValueM4a = function (gl, v) {

				gl.uniformMatrix4fv(this.addr, false, flatten(v, this.size, 16));

			},

			// Array of textures (2D / Cube)

			setValueT1a = function (gl, v, renderer) {

				var n = v.length,
					units = allocTexUnits(renderer, n);

				gl.uniform1iv(this.addr, units);

				for (var i = 0; i !== n; ++i) {

					var tex = v[i];
					if (tex) renderer.setTexture2D(tex, units[i]);

				}

			},

			setValueT6a = function (gl, v, renderer) {

				var n = v.length,
					units = allocTexUnits(renderer, n);

				gl.uniform1iv(this.addr, units);

				for (var i = 0; i !== n; ++i) {

					var tex = v[i];
					if (tex) renderer.setTextureCube(tex, units[i]);

				}

			},


			// Helper to pick the right setter for a pure (bottom-level) array

			getPureArraySetter = function (type) {

				switch (type) {

					case 0x1406:
						return setValue1fv; // FLOAT
					case 0x8b50:
						return setValueV2a; // _VEC2
					case 0x8b51:
						return setValueV3a; // _VEC3
					case 0x8b52:
						return setValueV4a; // _VEC4

					case 0x8b5a:
						return setValueM2a; // _MAT2
					case 0x8b5b:
						return setValueM3a; // _MAT3
					case 0x8b5c:
						return setValueM4a; // _MAT4

					case 0x8b5e:
						return setValueT1a; // SAMPLER_2D
					case 0x8b60:
						return setValueT6a; // SAMPLER_CUBE

					case 0x1404:
					case 0x8b56:
						return setValue1iv; // INT, BOOL
					case 0x8b53:
					case 0x8b57:
						return setValue2iv; // _VEC2
					case 0x8b54:
					case 0x8b58:
						return setValue3iv; // _VEC3
					case 0x8b55:
					case 0x8b59:
						return setValue4iv; // _VEC4

				}

			},

			// --- Uniform Classes ---

			SingleUniform = function SingleUniform(id, activeInfo, addr) {

				this.id = id;
				this.addr = addr;
				this.setValue = getSingularSetter(activeInfo.type);

				// this.path = activeInfo.name; // DEBUG

			},

			PureArrayUniform = function (id, activeInfo, addr) {

				this.id = id;
				this.addr = addr;
				this.size = activeInfo.size;
				this.setValue = getPureArraySetter(activeInfo.type);

				// this.path = activeInfo.name; // DEBUG

			},

			StructuredUniform = function (id) {

				this.id = id;

				UniformContainer.call(this); // mix-in

			};

		StructuredUniform.prototype.setValue = function (gl, value) {

			// Note: Don't need an extra 'renderer' parameter, since samplers
			// are not allowed in structured uniforms.

			var seq = this.seq;

			for (var i = 0, n = seq.length; i !== n; ++i) {

				var u = seq[i];
				u.setValue(gl, value[u.id]);

			}

		};

		// --- Top-level ---

		// Parser - builds up the property tree from the path strings

		var RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g,
			// extracts
			// 	- the identifier (member name or array index)
			//  - followed by an optional right bracket (found when array index)
			//  - followed by an optional left bracket or dot (type of subscript)
			//
			// Note: These portions can be read in a non-overlapping fashion and
			// allow straightforward parsing of the hierarchy that WebGL encodes
			// in the uniform names.

			addUniform = function (container, uniformObject) {

				container.seq.push(uniformObject);
				container.map[uniformObject.id] = uniformObject;

			},

			parseUniform = function (activeInfo, addr, container) {

				var path = activeInfo.name,
					pathLength = path.length;

				// reset RegExp object, because of the early exit of a previous run
				RePathPart.lastIndex = 0;

				for (;;) {

					var match = RePathPart.exec(path),
						matchEnd = RePathPart.lastIndex,

						id = match[1],
						idIsIndex = match[2] === ']',
						subscript = match[3];

					if (idIsIndex) id = id | 0; // convert to integer

					if (subscript === undefined ||
						subscript === '[' && matchEnd + 2 === pathLength) {
						// bare name or "pure" bottom-level array "[0]" suffix

						addUniform(container, subscript === undefined ?
							new SingleUniform(id, activeInfo, addr) :
							new PureArrayUniform(id, activeInfo, addr));

						break;

					} else {
						// step into inner node / create it in case it doesn't exist

						var map = container.map,
							next = map[id];

						if (next === undefined) {

							next = new StructuredUniform(id);
							addUniform(container, next);

						}

						container = next;

					}

				}

			},

			// Root Container

			WebGLUniforms = function WebGLUniforms(gl, program, renderer) {

				UniformContainer.call(this);

				this.renderer = renderer;

				var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

				for (var i = 0; i !== n; ++i) {

					var info = gl.getActiveUniform(program, i),
						path = info.name,
						addr = gl.getUniformLocation(program, path);

					parseUniform(info, addr, this);

				}

			};


		WebGLUniforms.prototype.setValue = function (gl, name, value) {

			var u = this.map[name];

			if (u !== undefined) u.setValue(gl, value, this.renderer);

		};

		WebGLUniforms.prototype.set = function (gl, object, name) {

			var u = this.map[name];

			if (u !== undefined) u.setValue(gl, object[name], this.renderer);

		};

		WebGLUniforms.prototype.setOptional = function (gl, object, name) {

			var v = object[name];

			if (v !== undefined) this.setValue(gl, name, v);

		};


		// Static interface

		WebGLUniforms.upload = function (gl, seq, values, renderer) {

			for (var i = 0, n = seq.length; i !== n; ++i) {

				var u = seq[i],
					v = values[u.id];

				if (v.needsUpdate !== false) {
					// note: always updating when .needsUpdate is undefined

					u.setValue(gl, v.value, renderer);

				}

			}

		};

		WebGLUniforms.seqWithValue = function (seq, values) {

			var r = [];

			for (var i = 0, n = seq.length; i !== n; ++i) {

				var u = seq[i];
				if (u.id in values) r.push(u);

			}

			return r;

		};

		WebGLUniforms.splitDynamic = function (seq, values) {

			var r = null,
				n = seq.length,
				w = 0;

			for (var i = 0; i !== n; ++i) {

				var u = seq[i],
					v = values[u.id];

				if (v && v.dynamic === true) {

					if (r === null) r = [];
					r.push(u);

				} else {

					// in-place compact 'seq', removing the matches
					if (w < i) seq[w] = u;
					++w;

				}

			}

			if (w < n) seq.length = w;

			return r;

		};

		WebGLUniforms.evalDynamic = function (seq, values, object, camera) {

			for (var i = 0, n = seq.length; i !== n; ++i) {

				var v = values[seq[i].id],
					f = v.onUpdateCallback;

				if (f !== undefined) f.call(v, object, camera);

			}

		};

		return WebGLUniforms;

	})();


	// File:../dev/three/post/Post.js


	THREE.Post = function (material /*THREE.ShaderMaterial*/ ) {
		this.material = material;
		material.uniforms.mapst = {
			type: "v4",
			value: new THREE.Vector4(1, 1, 0, 0)
		}
	};

	THREE.Post.prototype = {
		constructor: THREE.Post,
		onRenderImage(postRender /*THREE.PostRender*/ , source /*THREE.WebGLRenderTarget*/ , destination /*THREE.WebGLRenderTarget*/ , delta /*float*/ ) {
			postRender.render(source, destination, this.material, delta);
		}
	}

	// File:../dev/three/post/PostRender.js


	THREE.PostRender = function (renderer /*THREE.WebGLRenderer*/ ) {
		this.setRenderer(renderer);
	};

	THREE.PostRender.prototype = {
		constructor: THREE.PostRender,
		setRenderer(renderer /*THREE.WebGLRenderer*/ ) {
			var width = renderer.domElement.width;
			var height = renderer.domElement.height;
			this.renderer = renderer;
			this.scene = new THREE.Scene();
			var mesh = new THREE.Mesh();
			this.scene.add(mesh);
			mesh.geometry = new THREE.PlaneBufferGeometry(width, height, 1, 1, THREE.AlignModHorizontalCenter, THREE.AlignModVerticalCenter);
			this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -5, 5);
			this.camera.position.set(0, 0, 2);
		},
		render(source /*THREE.WebGLRenderTarget*/ , destination /*THREE.WebGLRenderTarget*/ , material /* THREE.Material*/ , delta /*float*/ ) {
			if (!this.renderer) {
				throw "THREE.PostRender.renderer is not exist!";
			}
			if (!material.uniforms.map) {
				material.uniforms.map = {
					type: "t",
					value: source.texture
				};
				material.defines.USE_MAP = "";
			}
			if (!material.textureOk || material.textureOk) {
				this.scene.children[0].ready = true;
			}
			material.side = THREE.FrontSide;
			material.uniforms._xscale = {
				type: "1f",
				value: this.renderer.domElement.width / this.renderer.domElement.height
			}
			this.scene.children[0].material = material;
			this.renderer.render(this.scene, this.camera, delta, destination, true);
		}
	}



	// File:../dev/three/post/WaveEffect.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * parameters = {
	 *  waveHeight: <float>,
	 *  waveWidth: <float>,
	 *  waveSpeed: <float>,
	 *  start:[float,float],
	 * 	angle:<float>
	 * 	waveCount:<int>
	 * }
	 */

	THREE.WaveEffect = function (parameters, wh) {
		this.waveWidth = parameters.waveWidth || 0.3;
		this.waveHeight = parameters.waveHeight || 0.01;
		this.waveSpeed = parameters.waveSpeed || 1;
		this.waveCount = parameters.waveCount || 1;
		this.start = parameters.start || [0.5, 0.5];
		this.angle = parameters.angle || 0;
		this.waveStartTime = new Date().getTime();

		this._vs = THREE.ShaderChunk['meshbasic_vert'];
		this._fs = THREE.ShaderChunk['wava_effect_fragment'];

		var uniforms = {
			_distanceFactor: {
				type: "1f",
				value: Math.PI * 2 / this.waveWidth
			},
			_waveWidth: {
				type: "1f",
				value: this.waveWidth
			}, //波纹宽度（指一个周期的宽度）
			_waveHeight: {
				type: "1f",
				value: this.waveHeight
			}, //振幅
			_waveCount: {
				type: "1f",
				value: this.waveCount
			}, //波纹个数（一个周期为一个）
			_start: {
				type: "v2",
				value: {
					x: this.start[0],
					y: this.start[1]
				}
			}, //震动源
			_cosd: {
				type: "1f",
				value: wh * Math.cos(this.angle / 180 * Math.PI)
			}, //视线倾斜角度
			_curWaveDis: {
				type: "1f",
				value: 0
			} //波纹当前移动距离
		};
		THREE.Post.call(this, new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: this._vs,
			fragmentShader: this._fs,
		}));

	};

	THREE.WaveEffect.prototype = Object.create(THREE.Post.prototype);
	THREE.WaveEffect.prototype.constructor = THREE.WaveEffect;

	THREE.WaveEffect.prototype.onRenderImage = function (postRender /*THREE.PostRender*/ , source /*THREE.WebGLRenderTarget*/ , destination /*THREE.WebGLRenderTarget*/ , delta /*float*/ ) {
		var curWaveDistance = (new Date().getTime() - this.waveStartTime) * this.waveSpeed / 1000;
		this.material.uniforms._curWaveDis.value = curWaveDistance;
		postRender.render(source, destination, this.material, delta);
	};

	// File:../dev/three/post/LutEffect.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.LutEffect = function () {
		this._vs = THREE.ShaderChunk['meshbasic_vert'];
		this._fs = THREE.ShaderChunk['lut_effect_fragment'];

		THREE.Post.call(this, new THREE.ShaderMaterial({
			uniforms: {
				_lut: {
					type: "t"
				},
				_scaleOffset: {
					type: "v3",
					value: new THREE.Vector3()
				}
			},
			vertexShader: this._vs,
			fragmentShader: this._fs,
		}));

		this.material.textureOk = function () {
			if (this.lut) {
				return true;
			} else {
				return false;
			}
		}

	};

	THREE.LutEffect.prototype = Object.create(THREE.Post.prototype);
	THREE.LutEffect.prototype.constructor = THREE.LutEffect;

	THREE.LutEffect.prototype.setTexture = function (lut) {
		this.lut = lut;
		lut.generateMipmaps = false; //lut不能开mimap
		this.material.uniforms._lut.value = lut;
		this.material.uniforms._scaleOffset.value.set(1 / lut.image.width, 1 / lut.image.height, lut.image.height - 1);
		this.material.needsUpdate = true;
	};
	// File:../dev/utils/controls/OrbitControls.js

	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

	// This set of controls performs orbiting, dollying (zooming), and panning.
	// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
	//
	//    Orbit - left mouse / touch: one finger move
	//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
	//    Pan - right mouse, or arrow keys / touch: three finter swipe

	THREE.OrbitControls = function (object, domElement) {

		this.object = object;

		this.domElement = (domElement !== undefined) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = -Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0; // pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = {
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			BOTTOM: 40
		};

		// Mouse buttons
		this.mouseButtons = {
			ORBIT: THREE.MOUSE.LEFT,
			ZOOM: THREE.MOUSE.MIDDLE,
			PAN: THREE.MOUSE.RIGHT
		};

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy(scope.target0);
			scope.object.position.copy(scope.position0);
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent(changeEvent);

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function () {

				var position = scope.object.position;

				offset.copy(position).sub(scope.target);

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion(quat);

				// angle from z-axis around y-axis
				spherical.setFromVector3(offset);

				if (scope.autoRotate && state === STATE.NONE) {

					rotateLeft(getAutoRotationAngle());

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));

				// restrict phi to be between desired limits
				spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

				// move target to panned location
				scope.target.add(panOffset);

				offset.setFromSpherical(spherical);

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion(quatInverse);

				position.copy(scope.target).add(offset);

				scope.object.lookAt(scope.target);

				if (scope.enableDamping === true) {

					sphericalDelta.theta *= (1 - scope.dampingFactor);
					sphericalDelta.phi *= (1 - scope.dampingFactor);

				} else {

					sphericalDelta.set(0, 0, 0);

				}

				scale = 1;
				panOffset.set(0, 0, 0);

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if (zoomChanged ||
					lastPosition.distanceToSquared(scope.object.position) > EPS ||
					8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {

					scope.dispatchEvent(changeEvent);

					lastPosition.copy(scope.object.position);
					lastQuaternion.copy(scope.object.quaternion);
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function () {

			scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
			scope.domElement.removeEventListener('mousedown', onMouseDown, false);
			scope.domElement.removeEventListener('mousewheel', onMouseWheel, false);
			scope.domElement.removeEventListener('MozMousePixelScroll', onMouseWheel, false); // firefox

			scope.domElement.removeEventListener('touchstart', onTouchStart, false);
			scope.domElement.removeEventListener('touchend', onTouchEnd, false);
			scope.domElement.removeEventListener('touchmove', onTouchMove, false);

			document.removeEventListener('mousemove', onMouseMove, false);
			document.removeEventListener('mouseup', onMouseUp, false);
			document.removeEventListener('mouseout', onMouseUp, false);

			window.removeEventListener('keydown', onKeyDown, false);

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = {
			type: 'change'
		};
		var startEvent = {
			type: 'start'
		};
		var endEvent = {
			type: 'end'
		};

		var STATE = {
			NONE: -1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_DOLLY: 4,
			TOUCH_PAN: 5
		};

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow(0.95, scope.zoomSpeed);

		}

		function rotateLeft(angle) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp(angle) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function () {

			var v = new THREE.Vector3();

			return function panLeft(distance, objectMatrix) {

				v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
				v.multiplyScalar(-distance);

				panOffset.add(v);

			};

		}();

		var panUp = function () {

			var v = new THREE.Vector3();

			return function panUp(distance, objectMatrix) {

				v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
				v.multiplyScalar(distance);

				panOffset.add(v);

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function () {

			var offset = new THREE.Vector3();

			return function (deltaX, deltaY) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if (scope.object instanceof THREE.PerspectiveCamera) {

					// perspective
					var position = scope.object.position;
					offset.copy(position).sub(scope.target);
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
					panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);

				} else if (scope.object instanceof THREE.OrthographicCamera) {

					// orthographic
					panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
					panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);

				} else {

					// camera neither orthographic nor perspective
					console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn(dollyScale) {

			if (scope.object instanceof THREE.PerspectiveCamera) {

				scale /= dollyScale;

			} else if (scope.object instanceof THREE.OrthographicCamera) {

				scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
				scope.enableZoom = false;

			}

		}

		function dollyOut(dollyScale) {

			if (scope.object instanceof THREE.PerspectiveCamera) {

				scale *= dollyScale;

			} else if (scope.object instanceof THREE.OrthographicCamera) {

				scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate(event) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set(event.clientX, event.clientY);

		}

		function handleMouseDownDolly(event) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set(event.clientX, event.clientY);

		}

		function handleMouseDownPan(event) {

			//console.log( 'handleMouseDownPan' );

			panStart.set(event.clientX, event.clientY);

		}

		function handleMouseMoveRotate(event) {

			//console.log( 'handleMouseMoveRotate' );

			rotateEnd.set(event.clientX, event.clientY);
			rotateDelta.subVectors(rotateEnd, rotateStart);

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

			rotateStart.copy(rotateEnd);

			scope.update();

		}

		function handleMouseMoveDolly(event) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set(event.clientX, event.clientY);

			dollyDelta.subVectors(dollyEnd, dollyStart);

			if (dollyDelta.y > 0) {

				dollyIn(getZoomScale());

			} else if (dollyDelta.y < 0) {

				dollyOut(getZoomScale());

			}

			dollyStart.copy(dollyEnd);

			scope.update();

		}

		function handleMouseMovePan(event) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set(event.clientX, event.clientY);

			panDelta.subVectors(panEnd, panStart);

			pan(panDelta.x, panDelta.y);

			panStart.copy(panEnd);

			scope.update();

		}

		function handleMouseUp(event) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel(event) {

			//console.log( 'handleMouseWheel' );

			var delta = 0;

			if (event.wheelDelta !== undefined) {

				// WebKit / Opera / Explorer 9

				delta = event.wheelDelta;

			} else if (event.detail !== undefined) {

				// Firefox

				delta = -event.detail;

			}

			if (delta > 0) {

				dollyOut(getZoomScale());

			} else if (delta < 0) {

				dollyIn(getZoomScale());

			}

			scope.update();

		}

		function handleKeyDown(event) {

			//console.log( 'handleKeyDown' );

			switch (event.keyCode) {

				case scope.keys.UP:
					pan(0, scope.keyPanSpeed);
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan(0, -scope.keyPanSpeed);
					scope.update();
					break;

				case scope.keys.LEFT:
					pan(scope.keyPanSpeed, 0);
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan(-scope.keyPanSpeed, 0);
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate(event) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

		}

		function handleTouchStartDolly(event) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[0].pageX - event.touches[1].pageX;
			var dy = event.touches[0].pageY - event.touches[1].pageY;

			var distance = Math.sqrt(dx * dx + dy * dy);

			dollyStart.set(0, distance);

		}

		function handleTouchStartPan(event) {

			//console.log( 'handleTouchStartPan' );

			panStart.set(event.touches[0].pageX, event.touches[0].pageY);

		}

		function handleTouchMoveRotate(event) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
			rotateDelta.subVectors(rotateEnd, rotateStart);

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

			rotateStart.copy(rotateEnd);

			scope.update();

		}

		function handleTouchMoveDolly(event) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[0].pageX - event.touches[1].pageX;
			var dy = event.touches[0].pageY - event.touches[1].pageY;

			var distance = Math.sqrt(dx * dx + dy * dy);

			dollyEnd.set(0, distance);

			dollyDelta.subVectors(dollyEnd, dollyStart);

			if (dollyDelta.y > 0) {

				dollyOut(getZoomScale());

			} else if (dollyDelta.y < 0) {

				dollyIn(getZoomScale());

			}

			dollyStart.copy(dollyEnd);

			scope.update();

		}

		function handleTouchMovePan(event) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set(event.touches[0].pageX, event.touches[0].pageY);

			panDelta.subVectors(panEnd, panStart);

			pan(panDelta.x, panDelta.y);

			panStart.copy(panEnd);

			scope.update();

		}

		function handleTouchEnd(event) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown(event) {

			if (scope.enabled === false) return;

			event.preventDefault();

			if (event.button === scope.mouseButtons.ORBIT) {

				if (scope.enableRotate === false) return;

				handleMouseDownRotate(event);

				state = STATE.ROTATE;

			} else if (event.button === scope.mouseButtons.ZOOM) {

				if (scope.enableZoom === false) return;

				handleMouseDownDolly(event);

				state = STATE.DOLLY;

			} else if (event.button === scope.mouseButtons.PAN) {

				if (scope.enablePan === false) return;

				handleMouseDownPan(event);

				state = STATE.PAN;

			}

			if (state !== STATE.NONE) {

				document.addEventListener('mousemove', onMouseMove, false);
				document.addEventListener('mouseup', onMouseUp, false);
				document.addEventListener('mouseout', onMouseUp, false);

				scope.dispatchEvent(startEvent);

			}

		}

		function onMouseMove(event) {

			if (scope.enabled === false) return;

			event.preventDefault();

			if (state === STATE.ROTATE) {

				if (scope.enableRotate === false) return;

				handleMouseMoveRotate(event);

			} else if (state === STATE.DOLLY) {

				if (scope.enableZoom === false) return;

				handleMouseMoveDolly(event);

			} else if (state === STATE.PAN) {

				if (scope.enablePan === false) return;

				handleMouseMovePan(event);

			}

		}

		function onMouseUp(event) {

			if (scope.enabled === false) return;

			handleMouseUp(event);

			document.removeEventListener('mousemove', onMouseMove, false);
			document.removeEventListener('mouseup', onMouseUp, false);
			document.removeEventListener('mouseout', onMouseUp, false);

			scope.dispatchEvent(endEvent);

			state = STATE.NONE;

		}

		function onMouseWheel(event) {

			if (scope.enabled === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel(event);

			scope.dispatchEvent(startEvent); // not sure why these are here...
			scope.dispatchEvent(endEvent);

		}

		function onKeyDown(event) {

			if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;

			handleKeyDown(event);

		}

		function onTouchStart(event) {

			if (scope.enabled === false) return;

			switch (event.touches.length) {

				case 1: // one-fingered touch: rotate

					if (scope.enableRotate === false) return;

					handleTouchStartRotate(event);

					state = STATE.TOUCH_ROTATE;

					break;

				case 2: // two-fingered touch: dolly

					if (scope.enableZoom === false) return;

					handleTouchStartDolly(event);

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if (scope.enablePan === false) return;

					handleTouchStartPan(event);

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if (state !== STATE.NONE) {

				scope.dispatchEvent(startEvent);

			}

		}

		function onTouchMove(event) {

			if (scope.enabled === false) return;

			event.preventDefault();
			event.stopPropagation();

			switch (event.touches.length) {

				case 1: // one-fingered touch: rotate

					if (scope.enableRotate === false) return;
					if (state !== STATE.TOUCH_ROTATE) return; // is this needed?...

					handleTouchMoveRotate(event);

					break;

				case 2: // two-fingered touch: dolly

					if (scope.enableZoom === false) return;
					if (state !== STATE.TOUCH_DOLLY) return; // is this needed?...

					handleTouchMoveDolly(event);

					break;

				case 3: // three-fingered touch: pan

					if (scope.enablePan === false) return;
					if (state !== STATE.TOUCH_PAN) return; // is this needed?...

					handleTouchMovePan(event);

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd(event) {

			if (scope.enabled === false) return;

			handleTouchEnd(event);

			scope.dispatchEvent(endEvent);

			state = STATE.NONE;

		}

		function onContextMenu(event) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener('contextmenu', onContextMenu, false);

		scope.domElement.addEventListener('mousedown', onMouseDown, false);
		scope.domElement.addEventListener('mousewheel', onMouseWheel, false);
		scope.domElement.addEventListener('MozMousePixelScroll', onMouseWheel, false); // firefox

		scope.domElement.addEventListener('touchstart', onTouchStart, false);
		scope.domElement.addEventListener('touchend', onTouchEnd, false);
		scope.domElement.addEventListener('touchmove', onTouchMove, false);

		window.addEventListener('keydown', onKeyDown, false);

		// force an update at start

		this.update();

	};

	THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
	THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

	Object.defineProperties(THREE.OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn('THREE.OrbitControls: .center has been renamed to .target');
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
				return !this.enableZoom;

			},

			set: function (value) {

				console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
				this.enableZoom = !value;

			}

		},

		noRotate: {

			get: function () {

				console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
				return !this.enableRotate;

			},

			set: function (value) {

				console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
				this.enableRotate = !value;

			}

		},

		noPan: {

			get: function () {

				console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
				return !this.enablePan;

			},

			set: function (value) {

				console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
				this.enablePan = !value;

			}

		},

		noKeys: {

			get: function () {

				console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
				return !this.enableKeys;

			},

			set: function (value) {

				console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
				this.enableKeys = !value;

			}

		},

		staticMoving: {

			get: function () {

				console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
				return !this.constraint.enableDamping;

			},

			set: function (value) {

				console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
				this.constraint.enableDamping = !value;

			}

		},

		dynamicDampingFactor: {

			get: function () {

				console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
				return this.constraint.dampingFactor;

			},

			set: function (value) {

				console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
				this.constraint.dampingFactor = value;

			}

		}

	});

	// File:../dev/utils/helpers/SkeletonHelper.js

	/**
	 * @author Sean Griffin / http://twitter.com/sgrif
	 * @author Michael Guerrero / http://realitymeltdown.com
	 * @author mrdoob / http://mrdoob.com/
	 * @author ikerr / http://verold.com
	 */

	THREE.SkeletonHelper = function (object) {

		this.bones = this.getBoneList(object.root);

		var geometry = new THREE.Geometry();

		for (var i = 0; i < this.bones.length; i++) {

			var bone = this.bones[i];

			if (bone.parent instanceof THREE.Bone) {

				geometry.vertices.push(new THREE.Vector3());
				geometry.vertices.push(new THREE.Vector3());
				geometry.colors.push(new THREE.Color(0, 0, 1));
				geometry.colors.push(new THREE.Color(0, 1, 0));

			}

		}

		geometry.dynamic = true;

		var material = new THREE.LineBasicMaterial({
			vertexColors: THREE.VertexColors,
			depthTest: false,
			depthWrite: false,
			transparent: true
		});

		THREE.LineSegments.call(this, geometry, material);

		this.root = object;

		this.matrix = object.matrixWorld;
		this.matrixAutoUpdate = false;

		this.update();

	};


	THREE.SkeletonHelper.prototype = Object.create(THREE.LineSegments.prototype);
	THREE.SkeletonHelper.prototype.constructor = THREE.SkeletonHelper;

	THREE.SkeletonHelper.prototype.getBoneList = function (object) {

		var boneList = [];

		if (object instanceof THREE.Bone) {

			boneList.push(object);

		}

		for (var i = 0; i < object.children.length; i++) {

			boneList.push.apply(boneList, this.getBoneList(object.children[i]));

		}

		return boneList;

	};

	THREE.SkeletonHelper.prototype.update = function () {

		var geometry = this.geometry;

		var matrixWorldInv = new THREE.Matrix4().getInverse(this.root.matrixWorld);

		var boneMatrix = new THREE.Matrix4();

		var j = 0;

		for (var i = 0; i < this.bones.length; i++) {

			var bone = this.bones[i];

			if (bone.parent instanceof THREE.Bone) {

				boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld);
				geometry.vertices[j].setFromMatrixPosition(boneMatrix);

				boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld);
				geometry.vertices[j + 1].setFromMatrixPosition(boneMatrix);

				j += 2;

			}

		}

		geometry.verticesNeedUpdate = true;

		geometry.computeBoundingSphere();

	};

	// File:../dev/utils/helpers/AxisHelper.js

	/**
	 * @author sroucheray / http://sroucheray.org/
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.AxisHelper = function (size) {

		size = size || 1;

		var vertices = new Float32Array([
			0, 0, 0, size, 0, 0,
			0, 0, 0, 0, size, 0,
			0, 0, 0, 0, 0, size
		]);

		var colors = new Float32Array([
			1, 0, 0, 1, 0.6, 0,
			0, 1, 0, 0.6, 1, 0,
			0, 0, 1, 0, 0.6, 1
		]);

		var geometry = new THREE.BufferGeometry();
		geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

		var material = new THREE.LineBasicMaterial({
			vertexColors: THREE.VertexColors
		});

		THREE.LineSegments.call(this, geometry, material);

	};

	THREE.AxisHelper.prototype = Object.create(THREE.LineSegments.prototype);
	THREE.AxisHelper.prototype.constructor = THREE.AxisHelper;

	// File:../dev/utils/helpers/BoundHelper.js

	THREE.BoundHelper = function (object) {
		this.bound = object.bound;
		var geometry = this.getGeomtry(this.bound);
		//var geometry = new THREE.BoxBufferGeometry(max.x - min.x, max.y - min.y, max.z - min.z, 1, 1, 1);
		var material = new THREE.LineBasicMaterial({
			vertexColors: THREE.VertexColors,
			depthTest: false,
			depthWrite: false,
			transparent: true
		})
		geometry.dynamic = true;
		THREE.LineSegments.call(this, geometry, material);
		this.root = object;

		//applyMatrix4(inverseMatrix)
		//this.matrix = object.matrixWorld;
		//this.matrixAutoUpdate = false;
		//this.update();
	};


	THREE.BoundHelper.prototype = Object.create(THREE.LineSegments.prototype);
	THREE.BoundHelper.prototype.constructor = THREE.BoundHelper;

	THREE.BoundHelper.prototype.update = function () {
		this.geometry = this.getGeomtry(this.bound);
		//geometry.computeBoundingSphere();
	};

	THREE.BoundHelper.prototype.getGeomtry = function (bound) {
		var max = bound.max;
		var min = bound.min;
		var vector = [];
		vector[0] = [max.x, max.y, max.z];
		vector[1] = [max.x, max.y, min.z];
		vector[2] = [min.x, max.y, min.z];
		vector[3] = [min.x, max.y, max.z];
		vector[4] = [max.x, min.y, max.z];
		vector[5] = [max.x, min.y, min.z];
		vector[6] = [min.x, min.y, min.z];
		vector[7] = [min.x, min.y, max.z];

		var geometry = new THREE.Geometry();
		for (var i = 0; i < 4; i++) {
			var j = (i === 3 ? 0 : i + 1);
			geometry.vertices.push(new THREE.Vector3(vector[i][0], vector[i][1], vector[i][2]));
			geometry.vertices.push(new THREE.Vector3(vector[j][0], vector[j][1], vector[j][2]));
			geometry.colors.push(new THREE.Color(0, 0, 1));
			geometry.colors.push(new THREE.Color(0, 0, 1));

			geometry.vertices.push(new THREE.Vector3(vector[i][0], vector[i][1], vector[i][2]));
			geometry.vertices.push(new THREE.Vector3(vector[i + 4][0], vector[i + 4][1], vector[i + 4][2]));
			geometry.colors.push(new THREE.Color(0, 0, 1));
			geometry.colors.push(new THREE.Color(0, 0, 1));
		}

		for (var i = 4; i < 8; i++) {
			var j = (i === 7 ? 4 : i + 1);
			geometry.vertices.push(new THREE.Vector3(vector[i][0], vector[i][1], vector[i][2]));
			geometry.vertices.push(new THREE.Vector3(vector[j][0], vector[j][1], vector[j][2]));
			geometry.colors.push(new THREE.Color(0, 0, 1));
			geometry.colors.push(new THREE.Color(0, 0, 1));
		}

		return geometry;
		//geometry.computeBoundingSphere();
	};

	// File:../dev/utils/geometries/PlaneBufferGeometry.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
	 */
	THREE.AlignModHorizontalLeft = "left",
		THREE.AlignModHorizontalCenter = "center",
		THREE.AlignModHorizontalRight = "right",
		THREE.AlignModVerticalTop = "top",
		THREE.AlignModVerticalCenter = "center",
		THREE.AlignModVerticalButtom = "bottom",

		THREE.PlaneBufferGeometry = function (width, height, widthSegments, heightSegments, alignModHorizon, alignModVertical) {

			if (alignModHorizon === undefined) alignModHorizon = THREE.AlignModHorizontalCenter;
			if (alignModVertical === undefined) alignModVertical = THREE.AlignModVerticalCenter;

			if (alignModHorizon !== THREE.AlignModHorizontalCenter && alignModHorizon !== THREE.AlignModHorizontalLeft && alignModHorizon !== THREE.AlignModHorizontalRight) {
				throw "不支持alignModHorizon：" + alignModHorizon;
			}

			if (alignModVertical !== THREE.AlignModVerticalCenter && alignModVertical !== THREE.AlignModVerticalButtom && alignModVertical !== THREE.AlignModVerticalTop) {
				throw "不支持alignModVertical：" + alignModVertical;
			}

			THREE.BufferGeometry.call(this);

			this.type = 'PlaneBufferGeometry';

			this.parameters = {
				width: width,
				height: height,
				widthSegments: widthSegments,
				heightSegments: heightSegments
			};

			var xOffset = 0;
			var yOffset = 0;

			if (alignModHorizon === THREE.AlignModHorizontalCenter) //水平中对齐
				xOffset = width / 2;
			else if (alignModHorizon === THREE.AlignModHorizontalRight) //水平右对齐
				xOffset = width;

			if (alignModVertical === THREE.AlignModVerticalCenter) //垂直中对齐
				yOffset = height / 2;
			else if (alignModVertical === THREE.AlignModVerticalButtom) //垂直下对齐
				yOffset = height;

			var gridX = Math.floor(widthSegments) || 1;
			var gridY = Math.floor(heightSegments) || 1;

			var gridX1 = gridX + 1;
			var gridY1 = gridY + 1;

			var segment_width = width / gridX;
			var segment_height = height / gridY;

			var vertices = new Float32Array(gridX1 * gridY1 * 3);
			var normals = new Float32Array(gridX1 * gridY1 * 3);
			var uvs = new Float32Array(gridX1 * gridY1 * 2);

			var offset = 0;
			var offset2 = 0;

			for (var iy = 0; iy < gridY1; iy++) {

				var y = -iy * segment_height + yOffset;

				for (var ix = 0; ix < gridX1; ix++) {

					var x = -ix * segment_width + xOffset;

					vertices[offset + 0] = x;
					vertices[offset + 1] = y;
					vertices[offset + 2] = 0;

					normals[offset + 0] = 0;
					normals[offset + 1] = 0;
					normals[offset + 2] = 1;

					uvs[offset2] = ix / gridX;
					uvs[offset2 + 1] = 1 - (iy / gridY);

					offset += 3;
					offset2 += 2;

				}

			}

			offset = 0;

			var indices = new((vertices.length / 3) > 65535 ? Uint32Array : Uint16Array)(gridX * gridY * 6);

			for (var iy = 0; iy < gridY; iy++) {

				for (var ix = 0; ix < gridX; ix++) {

					var a = ix + gridX1 * iy;
					var b = ix + gridX1 * (iy + 1);
					var c = (ix + 1) + gridX1 * (iy + 1);
					var d = (ix + 1) + gridX1 * iy;

					indices[offset] = a;
					indices[offset + 1] = d;
					indices[offset + 2] = c;

					indices[offset + 3] = a;
					indices[offset + 4] = c;
					indices[offset + 5] = b;

					offset += 6;

				}

			}

			this.setIndex(new THREE.BufferAttribute(indices, 1));
			this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
			this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
			this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

		};

	THREE.PlaneBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
	THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry;

	// File:../dev/utils/geometries/CircleBufferGeometry.js

	/**
	 * @author benaadams / https://twitter.com/ben_a_adams
	 */

	THREE.CircleBufferGeometry = function (radius, segments, thetaStart, thetaLength) {

		THREE.BufferGeometry.call(this);

		this.type = 'CircleBufferGeometry';

		this.parameters = {
			radius: radius,
			segments: segments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		radius = radius || 10;
		segments = segments !== undefined ? Math.max(3, segments) : 50;

		thetaStart = thetaStart !== undefined ? thetaStart : 0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

		var vertices = segments + 2;

		var positions = new Float32Array(vertices * 3);
		var normals = new Float32Array(vertices * 3);
		var uvs = new Float32Array(vertices * 2);

		// center data is already zero, but need to set a few extras
		normals[2] = 1.0;
		uvs[0] = 0.5;
		uvs[1] = 0.5;

		for (var s = 0, i = 3, ii = 2; s <= segments; s++, i += 3, ii += 2) {

			var segment = thetaStart + s / segments * thetaLength;

			positions[i] = radius * Math.cos(segment);
			positions[i + 1] = radius * Math.sin(segment);

			normals[i + 2] = 0; // normal z

			uvs[ii] = (positions[i] / radius + 1) / 2;
			uvs[ii + 1] = (positions[i + 1] / radius + 1) / 2;

		}

		var indices = [];

		for (var i = 1; i <= segments; i++) {

			indices.push(i, i + 1, 0);

		}

		this.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
		this.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
		this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

		this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);

	};

	THREE.CircleBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
	THREE.CircleBufferGeometry.prototype.constructor = THREE.CircleBufferGeometry;

	// File:../dev/utils/geometries/BoxBufferGeometry.js

	/**
	 * @author Mugen87 / https://github.com/Mugen87
	 */

	THREE.BoxBufferGeometry = function (width, height, depth, widthSegments, heightSegments, depthSegments) {

		THREE.BufferGeometry.call(this);

		this.type = 'BoxBufferGeometry';

		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};

		var scope = this;

		// segments
		widthSegments = Math.floor(widthSegments) || 1;
		heightSegments = Math.floor(heightSegments) || 1;
		depthSegments = Math.floor(depthSegments) || 1;

		// these are used to calculate buffer length
		var vertexCount = calculateVertexCount(widthSegments, heightSegments, depthSegments);
		var indexCount = (vertexCount / 4) * 6;

		// buffers
		var indices = new(indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount);
		var vertices = new Float32Array(vertexCount * 3);
		var normals = new Float32Array(vertexCount * 3);
		var uvs = new Float32Array(vertexCount * 2);

		// offset variables
		var vertexBufferOffset = 0;
		var uvBufferOffset = 0;
		var indexBufferOffset = 0;
		var numberOfVertices = 0;

		// group variables
		var groupStart = 0;

		// build each side of the box geometry
		buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, 0); // px
		buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, 1); // nx
		buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2); // py
		buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, 3); // ny
		buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, 4); // pz
		buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, 5); // nz

		// build geometry
		this.setIndex(new THREE.BufferAttribute(indices, 1));
		this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
		this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

		// helper functions

		function calculateVertexCount(w, h, d) {

			var segments = 0;

			// calculate the amount of segments for each side
			segments += w * h * 2; // xy
			segments += w * d * 2; // xz
			segments += d * h * 2; // zy

			return segments * 4; // four vertices per segments

		}

		function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {

			var segmentWidth = width / gridX;
			var segmentHeight = height / gridY;

			var widthHalf = width / 2;
			var heightHalf = height / 2;
			var depthHalf = depth / 2;

			var gridX1 = gridX + 1;
			var gridY1 = gridY + 1;

			var vertexCounter = 0;
			var groupCount = 0;

			var vector = new THREE.Vector3();

			// generate vertices, normals and uvs

			for (var iy = 0; iy < gridY1; iy++) {

				var y = iy * segmentHeight - heightHalf;

				for (var ix = 0; ix < gridX1; ix++) {

					var x = ix * segmentWidth - widthHalf;

					// set values to correct vector component
					vector[u] = x * udir;
					vector[v] = y * vdir;
					vector[w] = depthHalf;

					// now apply vector to vertex buffer
					vertices[vertexBufferOffset] = vector.x;
					vertices[vertexBufferOffset + 1] = vector.y;
					vertices[vertexBufferOffset + 2] = vector.z;

					// set values to correct vector component
					vector[u] = 0;
					vector[v] = 0;
					vector[w] = depth > 0 ? 1 : -1;

					// now apply vector to normal buffer
					normals[vertexBufferOffset] = vector.x;
					normals[vertexBufferOffset + 1] = vector.y;
					normals[vertexBufferOffset + 2] = vector.z;

					// uvs
					uvs[uvBufferOffset] = ix / gridX;
					uvs[uvBufferOffset + 1] = 1 - (iy / gridY);

					// update offsets and counters
					vertexBufferOffset += 3;
					uvBufferOffset += 2;
					vertexCounter += 1;

				}

			}

			// 1. you need three indices to draw a single face
			// 2. a single segment consists of two faces
			// 3. so we need to generate six (2*3) indices per segment

			for (iy = 0; iy < gridY; iy++) {

				for (ix = 0; ix < gridX; ix++) {

					// indices
					var a = numberOfVertices + ix + gridX1 * iy;
					var b = numberOfVertices + ix + gridX1 * (iy + 1);
					var c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
					var d = numberOfVertices + (ix + 1) + gridX1 * iy;

					// face one
					indices[indexBufferOffset] = a;
					indices[indexBufferOffset + 1] = b;
					indices[indexBufferOffset + 2] = d;

					// face two
					indices[indexBufferOffset + 3] = b;
					indices[indexBufferOffset + 4] = c;
					indices[indexBufferOffset + 5] = d;

					// update offsets and counters
					indexBufferOffset += 6;
					groupCount += 6;

				}

			}

			// add a group to the geometry. this will ensure multi material support
			scope.addGroup(groupStart, groupCount, materialIndex);

			// calculate new start value for groups
			groupStart += groupCount;

			// update total number of vertices
			numberOfVertices += vertexCounter;

		}

	};

	THREE.BoxBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
	THREE.BoxBufferGeometry.prototype.constructor = THREE.BoxBufferGeometry;

	// File:../dev/utils/geometries/BoxGeometry.js

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
	 */

	THREE.BoxGeometry = function (width, height, depth, widthSegments, heightSegments, depthSegments) {

		THREE.Geometry.call(this);

		this.type = 'BoxGeometry';

		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};

		this.fromBufferGeometry(new THREE.BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments));
		this.mergeVertices();

	};

	THREE.BoxGeometry.prototype = Object.create(THREE.Geometry.prototype);
	THREE.BoxGeometry.prototype.constructor = THREE.BoxGeometry;

	THREE.CubeGeometry = THREE.BoxGeometry;

	// File:../dev/utils/objects/ImmediateRenderObject.js

	/**
	 * @author alteredq / http://alteredqualia.com/
	 */

	THREE.ImmediateRenderObject = function (material) {

		THREE.Object3D.call(this);

		this.material = material;
		this.render = function (renderCallback) {};

	};

	THREE.ImmediateRenderObject.prototype = Object.create(THREE.Object3D.prototype);
	THREE.ImmediateRenderObject.prototype.constructor = THREE.ImmediateRenderObject;

	// File:../dev/app/App.js

	var APP = {};
	// File:../dev/app/ByteBuffer.js

	APP.ByteBuffer = function (arraybuffer, isLittleOrder) {
		this.readIndex = 0;
		this.isLittleOrder = isLittleOrder || true;
		this.view = new DataView(arraybuffer);
	};

	APP.ByteBuffer.prototype = {

		INT8_LEN: 1,
		INT16_LEN: 2,
		INT32_LEN: 4,
		INT64_LEN: 8,

		UINT8_LEN: 1,
		UINT16_LEN: 2,
		UINT32_LEN: 4,
		UINT64_LEN: 8,

		FLOAT32_LEN: 4,
		FLOAT64_LEN: 8,

		constructor: APP.ByteBuffer,

		getReadIndex: function () {
			return this.readIndex;
		},

		readInt8: function () {
			var v = this.view.getInt8(this.readIndex);
			this.readIndex += this.INT8_LEN;
			return v;
		},

		readInt16: function () {
			var v = this.view.getInt16(this.readIndex, this.isLittleOrder);
			this.readIndex += this.INT16_LEN;
			return v;
		},

		readInt32: function () {
			var v = this.view.getInt32(this.readIndex, this.isLittleOrder);
			this.readIndex += this.INT32_LEN;
			return v;
		},

		readInt64: function () {
			var v = this.view.getInt64(this.readIndex, this.isLittleOrder);
			this.readIndex += this.INT64_LEN;
			return v;
		},

		readUint8: function () {
			var v = this.view.getUint8(this.readIndex);
			this.readIndex += this.UINT8_LEN;
			return v;
		},

		readUint16: function () {
			var v = this.view.getUint16(this.readIndex, this.isLittleOrder);
			this.readIndex += this.UINT16_LEN;
			return v;
		},

		readUint32: function () {
			var v = this.view.getUint32(this.readIndex, this.isLittleOrder);
			this.readIndex += this.UINT32_LEN;
			return v;
		},

		readUint64: function () {
			var v = this.view.getUint64(this.readIndex, this.isLittleOrder);
			this.readIndex += this.UINT64_LEN;
			return v;
		},

		readFloat32: function () {
			var v = this.view.getFloat32(this.readIndex, this.isLittleOrder);
			this.readIndex += this.FLOAT32_LEN;
			return v;
		},

		readFloat64: function () {
			var v = this.view.getFloat64(this.readIndex, this.isLittleOrder);
			this.readIndex += this.FLOAT64_LEN;
			return v;
		},

		readAsciiStr: function () {
			var i, arr = [];
			var size = this.readUint32();

			for (i = 0; i < size; ++i) {
				var c = this.readUint8();
				if (c !== 0) {
					c = String.fromCharCode(c);
					arr.push(c);
				}
			}
			return arr.join("");
		},
	};
	// File:../dev/app/Detector.js


	APP.Detector = {

		canvas: !!window.CanvasRenderingContext2D,

		webgl: (function () {

			try {

				var canvas = document.createElement('canvas');
				return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

			} catch (e) {

				return false;

			}

		})(),

		workers: !!window.Worker,

		fileapi: window.File && window.FileReader && window.FileList && window.Blob,

		getWebGLErrorMessage: function () {

			var element = document.createElement('div');
			element.id = 'webgl-error-message';
			element.style.fontFamily = 'monospace';
			element.style.fontSize = '13px';
			element.style.fontWeight = 'normal';
			element.style.textAlign = 'center';
			element.style.background = '#fff';
			element.style.color = '#000';
			element.style.padding = '1.5em';
			element.style.width = '400px';
			element.style.margin = '5em auto 0';

			if (!this.webgl) {

				element.innerHTML = window.WebGLRenderingContext ? [
					'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
					'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
				].join('\n') : [
					'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
					'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
				].join('\n');

			}

			return element;

		},

		addGetWebGLMessage: function (parameters) {

			var parent, id, element;

			parameters = parameters || {};

			parent = parameters.parent !== undefined ? parameters.parent : document.body;
			id = parameters.id !== undefined ? parameters.id : 'oldie';

			element = APP.Detector.getWebGLErrorMessage();
			element.id = id;

			parent.appendChild(element);

		}

	};
	// File:../dev/app/Renderer.js

	APP.Renderer = function () {

	};

	APP.Renderer.prototype = {

		constructor: APP.Renderer,

		init: function (width, height, ratio) {

			height = height || 1;

			if (!APP.Detector.webgl) {
				APP.Detector.addGetWebGLMessage();
				return false;
			}

			this._meshes = [];

			this._scene = new THREE.Scene();

			this._scene.add(new THREE.AmbientLight(new THREE.Color(1.0, 1.0, 1.0), 1.0));

			this._container = document.getElementById('container');

			this._stats = new window.Stats();
			this._container.appendChild(this._stats.dom);

			this._renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: false
			});

			this._renderer.setSize(width, height);
			this._renderer.setClearColor(0x7F7F7F);
			this._renderer.setPixelRatio(ratio);
			this._renderer.autoClear = true;
			this._container.appendChild(this._renderer.domElement);

			this._camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

			this._axisHelper = new THREE.AxisHelper(300);
			this._scene.add(this._axisHelper);

			return true;
		},

		setSize: function (width, height) {
			height = height || 1;

			this._camera.aspect = width / height;
			this._camera.updateProjectionMatrix();

			this._renderer.setSize(width, height);
		},

		addScene: function (obj) {
			if (obj instanceof THREE.PiMesh) {
				this._meshes.push(obj);
			}
			this._scene.add(obj);
		},

		addUpdate: function (obj) {
			if (obj instanceof THREE.PiMesh) {
				this._meshes.push(obj);
			}
		},

		removeScene: function (obj) {
			var i, length = this._meshes.length;

			this._scene.remove(obj);

			if (obj instanceof THREE.PiMesh) {
				for (i = 0; i < length; ++i) {
					if (this._meshes[i] === obj) {
						break;
					}
				}
				if (i < length) {
					this._meshes.splice(i, 1);
				}
			}
		},

		getDomElement: function () {
			return this._renderer.domElement;
		},

		getCamera: function () {
			return this._camera;
		},

		getScene: function () {
			return this._scene;
		},

		getRenderer: function () {
			return this._renderer;
		},

		update: function (deltaMS) {

			for (var i = 0; i < this._meshes.length; ++i) {
				this._meshes[i].update(deltaMS);
			}

			this._renderer.render(this._scene, this._camera);

			this._stats.update();

		}
	};
	// File:../dev/app/Demo.js


	APP.Demo = function () {

		// 检查webgl的可用性
		if (!APP.Detector.webgl) {
			APP.Detector.addGetWebGLMessage();
			return false;
		}

		var w = 640;
		var h = 960;

		// var w = window.innerWidth;
		// var h = window.innerHeight;

		var camera3D = {
			type: "Camera",
			position: [0, 80, 80],
			rotate: [-Math.PI / 4, 0, 0],
			perspective: [45, w / h, 0.5, 10000]
		};

		var camera2D = {
			type: "Camera",
			ortho: [-w / 2, w / 2, h / 2, -h / 2, -10000, 10000]
		};

		var weapon = {
			type: "Mesh",
			config: "weapon/sword1.json",
			parentBone: "R Weapon"
		};

		var wing = {
			type: "Mesh",
			config: "wing/chibang1.json",
			parentBone: "WingBack"
		};

		var text = {
			attachment: "2D",
			type: "Text",
			text: "主角",
			position: [0, 60, 0],
			material: {
				fillStyle: "#000000",
				strokeStyle: "#FF0000",
				lineWidth: 3,
				shadowColor: "gray",
				shadowOffsetX: 3,
				shadowOffsetY: 3,
				shadowBlur: 10
			}
		};

		var textBackGround = {
			attachment: "2D",
			type: "Mesh",
			shape: "Quad",
			rayID: 100,
			width: 180,
			height: 30,
			position: [-90, 60, -1]
		};

		var bloodBack = {
			attachment: "2D",
			type: "Mesh",
			shape: "Quad",
			width: 130,
			height: 10,
			position: [-65, 20, 0], // 界面描述
			texture: "res/blood.png"
		};

		var bloodFront = {
			attachment: "2D",
			type: "Mesh",
			shape: "Quad",
			width: 124,
			height: 4,
			scale: [1, 1, 1],
			position: [-62, 18, 0.01],
			color: 0xFFFF0000
		};

		var shadow = {
			type: "Mesh",
			shape: "Circle",
			radius: 4,
			position: [0, 0.05, 10],
			rotate: [-Math.PI / 2, 0, 0],
			color: 0x7f777777
		};

		var nodePlayerHead = {
			type: "Node",
			position: [0, 20, 0],
			children: [text, textBackGround, bloodFront, bloodBack]
		};

		var player = {
			config: "player/ay.json",
			type: "Mesh",
			position: [0, 0, 0],
			rotate: [0, 0, 0],
			scale: [0.1, 0.1, 0.1],
			animationSpeed: 1.0,
			animationLoop: "run",
			children: [weapon, wing],
			rayID: 1
		};

		var nodePlayer = {
			type: "Node",
			position: [0, 0, 0],
			children: [player, nodePlayerHead]
		};

		var node = {
			type: "Node",
			position: [0, 0, 0],
			children: [nodePlayer, shadow]
			// children: []
		};

		var node2 = JSON.parse(JSON.stringify(node));
		// node2.position[0] -= 20;
		// node2.position[2] += 300;
		// node2.children[0].children[0].rayID = 2;

		var node3 = JSON.parse(JSON.stringify(node));
		// node3.position[0] -= 20;
		// node3.position[2] -= 300;
		// node3.children[0].children[0].rayID = 3;

		node.children.push(camera3D);

		var pointLight = {
			type: "PointLight",
			position: [0, 40, 40],
			startAtten: 1.0,
			endAtten: 1000.0,
			diffuse: [1.0, 1.0, 1.0],
			specular: [0.0, 0.0, 0.0]
		};

		// nodePlayer.children.push(pointLight);

		var spotLight = {

			type: "SpotLight",
			position: [0, 0, 40],

			spotDirection: [0, -1, 0],
			spotCosCutoff: 1.0,
			spotExponent: 1.0,

			startAtten: 1.0,
			endAtten: 1000.0,

			diffuse: [1.0, 1.0, 1.0],
			specular: [0.0, 0.0, 0.0]
		};

		// nodePlayer.children.push(spotLight);

		var container = document.getElementById('container');

		var renderer = new THREE.PiRenderer(w, h, 1);
		renderer.setClearColor(0xFFFFFFFF);
		container.appendChild(renderer.getCanvas());

		var sceneData = {

			// terrain: {
			// 	type: "Noise",   
			// 	path: "1.json"   // 相对路径 res/terrain
			// },

			// skybox: [
			// 		'res/skybox/px.jpg', // right
			// 		'res/skybox/nx.jpg', // left
			// 		'res/skybox/py.jpg', // top
			// 		'res/skybox/ny.jpg', // bottom
			// 		'res/skybox/pz.jpg', // back
			// 		'res/skybox/nz.jpg'  // front
			// ],

			lights: [{
				type: "Ambient",
				color: 0xFFFFFF,
				intensity: 1.0
			}] // ,

			// fog: {
			// 	type: "Linear", // "Linear" or "Exp" -- exp对应density
			// 	color: 0x7F7F7F,
			// 	near: 5,
			// 	far: 1000,
			// 	density: 0.0001
			// } 
		};

		var scene = renderer.createScene(sceneData);

		scene.insert(node);
		scene.insert(camera2D);
		// scene.insert(node2);
		// scene.insert(node3);
		// scene.insert(camera3D);


		// var dir = 1, originX = node.position[0], originZ = node.position[2];
		// setInterval(function () {
		// 	var isChangeDir;
		// 	if (!node) return;
		// 	if (node.position[0] < 0 || node.position[2] < 0) {
		// 		isChangeDir = true;
		// 	} else if (node.position[0] > originX + 400 || node.position[2] > originZ + 400) {
		// 		isChangeDir = true;
		// 	}

		// 	if (isChangeDir) {
		// 		isChangeDir = false;
		// 		dir *= -1;

		// 		player.rotate[1] += Math.PI;
		// 		if (player.rotate[1] >= 2 * Math.PI) player.rotate[1] = 0;
		// 		scene.modify(player, "rotate");
		// 	}

		// 	// node.position[0] += dir;
		// 	node.position[2] += dir;

		// 	scene.modify(node, "position");
		// }, 50);

		// var xDir = -1;
		// setInterval(function () {

		// 	if (!node) return;

		// 	var x = bloodFront.scale[0];

		// 	x -= 0.01;
		// 	if (x < 0) {
		// 		x = 1;
		// 	}

		// 	bloodFront.scale[0] = x;
		// 	scene.modify(bloodFront, "scale");
		// }, 100);

		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', onKeydown, false);
		window.addEventListener('mousedown', onMouseDown, true);
		window.addEventListener('contextmenu', onContextmenu, false);

		var clock = new THREE.Clock();
		render();

		function render() {

			requestAnimationFrame(render);

			var delta = clock.getDelta();

			scene.render(delta);
		};

		// 事件 处理函数

		function onWindowResize() {}

		function onContextmenu(event) {
			event.preventDefault();
		}

		var nodes = [];
		var curX = 0,
			curZ = 0;

		// setInterval(function () {
		// 	while (nodes.length > 0) {
		// 		var n = nodes.pop();
		// 		scene.remove(n);
		// 		curX--;
		// 		curZ--;
		// 	}
		// 	scene.remove(node);
		// 	scene.destroy();

		// 	scene = renderer.createScene(sceneData);	
		// 	scene.insert(node);
		// 	scene.insert(camera2D);
		// }, 2000)

		function onKeydown(event) {

			var key = String.fromCharCode(event.which);
			if (key === "A") {
				while (nodes.length > 0) {
					var n = nodes.pop();
					scene.remove(n);
					curX--;
					curZ--;
				}
				scene.remove(node);
				scene.destroy();

				scene = renderer.createScene(sceneData);
				scene.insert(node);
				scene.insert(camera2D);
			} else if (key === "R") {
				if (nodes.length > 0) {
					var n = nodes.pop();
					scene.remove(n);
					curX--;
					curZ--;
				}
			} else if (key === "I") {
				var n = JSON.parse(JSON.stringify(node2));
				n.position[0] += curX++;
				n.position[2] += curZ++;
				scene.insert(n);
				nodes.push(n);
			}
		}

		function onMouseDown(event) {
			var x = event.clientX;
			var y = event.clientY;

			if (!node) return;

			// 右键攻击
			if (event.button === 2) {
				// player.animationOnce = {value: "attack1"};
				player.animationOnce = {
					value: "fitting_b"
				};
				scene.modify(player, "animationOnce");

				// setTimeout(function () {
				// 	scene.remove(node);
				// 	node = player = undefined;
				// }, 800);

				return;
			}

			var result = scene.raycast(x, y);

			if (result) {
				if (result.type === "terrain") {
					// x = result.data[0];
					// var z = result.data[2];

					// player.lookatOnce = {
					// 	value: [x, 0, z]
					// };
					// scene.modify(player, "lookatOnce");

					// player.position[0] = x;
					// player.position[2] = z;

					// scene.modify(player, "position");
				} else {
					console.log("----------- raycast mesh = " + (result.id === player.rayID))
				}
			}
		}
	};
	// File:../dev/app/MeshViewer.js



	// 网格查看器 

	APP.MeshViewer = function () {

		var renderer = new APP.Renderer();
		renderer.init(window.innerWidth, window.innerHeight, window.devicePixelRatio);

		//var skHelpers = [];

		var camera = renderer.getCamera();
		var orbitControls = new THREE.OrbitControls(camera);

		var clock = new THREE.Clock();

		var loader = new THREE.XHRLoader();
		loader.load("meshviewer.json", function (text) {
			var json = JSON.parse(text);
			loadMeshes(json);
		});

		var meshInfoDiv = document.createElement("div");
		meshInfoDiv.style.color = '#FF0';
		meshInfoDiv.style.position = "absolute";
		meshInfoDiv.style.top = window.innerHeight / 2;
		document.body.appendChild(meshInfoDiv);

		render();

		function render() {
			requestAnimationFrame(render);

			var delta = 1.0 * clock.getDelta();

			// for (var i = 0; i < skHelpers.length; ++i) {
			// 	skHelpers[i].update();	
			// }

			renderer.update(delta);
		};

		// 事件 处理函数

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);

		}

		function getMeshInfo(mesh) {
			var str = "";

			if (mesh.skeleton) {
				str += "骨头数：" + mesh.bones.length + "<br />";
			}

			var g = mesh.meshes[0].geometry;
			str += "面数：" + (g.index.count / 3) + "； ";
			var keys = Object.keys(g.attributes);
			var k = keys[0];
			str += "顶点数：" + g.attributes[k].count + "<br />";

			return str;
		}

		function loadBind(mesh, json) {
			var loader = new THREE.PiMeshLoader(renderer.getRenderer());
			loader.load(json.mesh, function (m) {

				mesh.bindBone(json.bone, m);

				if (m.skeleton && json.animation) {
					renderer.addUpdate(m);
					m.play(json.animation);
					m.setAnimSpeed(json.speed || 1.0);
				}
			});
		}

		function createCB(json, attachMesh) {
			return function (m) {

				m.setMaterialParams(json.material);

				renderer.addScene(m);

				var radius = 100;
				camera.position.set(0.0, radius, radius * 3.5);
				orbitControls.target.set(0, radius, 0);
				orbitControls.update();

				meshInfoDiv.innerHTML = getMeshInfo(m);

				m.setAnimSpeed(json.speed || 1.0);

				if (json.playUVAnim) {
					m.playUVAnim(true);
				}
				if (json.playModelAnim) {
					m.playModelAnim(true);
				}
				if (m.skeleton) {

					if (json.animation) {
						m.play(json.animation);
					}

					// var skHelper = new THREE.SkeletonHelper( m );
					// skHelper.material.linewidth = 3;
					// skHelper.visible = true;
					// renderer.addScene( skHelper );
					// skHelpers.push(skHelper);

					if (json.binds) {
						for (var i = 0; i < json.binds.length; ++i) {
							loadBind(m, json.binds[i]);
						}
					}
				}

				if (attachMesh) {
					m.attachSkeleton(attachMesh);
				}
			}
		};

		function loadMeshes(jsons) {

			var meshes = [];
			for (var i = 0; i < jsons.length; ++i) {
				var json = jsons[i];

				var mesh = new THREE.PiMesh();
				meshes.push(mesh);

				var loader = new THREE.PiMeshLoader(renderer.getRenderer(), mesh);
				var a = json.skAttachIndex !== undefined ? meshes[json.skAttachIndex] : undefined;
				loader.load(json.mesh, createCB(json, a));
			}
		}
	};
	// File:../dev/app/TerrainViewer.js


	APP.TerrainGui = function (params) {
		var scope = this;

		var TERRAIN_PATH = "res/terrain/";

		scope._params = params;

		scope._gui = new window.dat.GUI();
		scope._terrainFolder = scope._gui.addFolder("地形");
		scope._blendFolder = scope._gui.addFolder("噪音");

		params.blend.updateSeed1 = function () {
			params.blend.seed[0] = 256 * Math.random();
		};

		params.blend.updateSeed2 = function () {
			params.blend.seed[1] = 256 * Math.random();
		};

		params.blend.updateSeed3 = function () {
			params.blend.seed[2] = 256 * Math.random();
		};

		params["保存"] = function () {

			var json = JSON.parse(JSON.stringify(params));

			var name = TERRAIN_PATH + json.fileName;
			delete json.fileName;

			var loader = new THREE.XHRLoader();
			loader.post(name, json, function () {
				alert("保存成功");
			});
		};

		scope._terrainFolder.add(params, "保存");

		scope._terrainFolder.add(params, "fileName");

		scope._terrainFolder.add(params, "width");
		scope._terrainFolder.add(params, "height");

		scope._terrainFolder.add(params, "image1");
		scope._terrainFolder.add(params, "image2");
		scope._terrainFolder.add(params, "image3");

		scope._blendFolder.add(params.blend, "width");
		scope._blendFolder.add(params.blend, "height");

		scope._blendFolder.add(params.blend, "updateSeed1").onChange(updateSeed);
		scope._blendFolder.add(params.blend, "updateSeed2").onChange(updateSeed);
		scope._blendFolder.add(params.blend, "updateSeed3").onChange(updateSeed);

		scope._blendFolder.add(params.blend, 'frequency1', 1, 20).step(1.0).onChange(updateFrequency);
		scope._blendFolder.add(params.blend, 'frequency2', 1, 20).step(1.0).onChange(updateFrequency);
		scope._blendFolder.add(params.blend, 'frequency3', 1, 20).step(1.0).onChange(updateFrequency);

		scope._blendFolder.add(params.blend, 'constCoff1', 0.0, 1.0).step(0.1).onChange(updateCoff);
		scope._blendFolder.add(params.blend, 'linearCoff1', 0.0, 1.0).step(0.1).onChange(updateCoff);

		scope._blendFolder.add(params.blend, 'constCoff2', 0.0, 1.0).step(0.1).onChange(updateCoff);
		scope._blendFolder.add(params.blend, 'linearCoff2', 0.0, 1.0).step(0.1).onChange(updateCoff);

		params.blend.oneClamp = params.blend.oneClamp || 0.1;
		params.blend.zeroClamp = params.blend.zeroClamp || 0.01;
		params.blend.middleValue = params.blend.middleValue || 0.8;

		scope._blendFolder.add(params.blend, 'oneClamp', 0.0, 1.0).step(0.1).onChange(updateClamp);

		scope._blendFolder.add(params.blend, 'zeroClamp', 0.0, 1.0).step(0.1).onChange(updateClamp);

		scope._blendFolder.add(params.blend, 'middleValue', 0.0, 1.0).step(0.1).onChange(updateClamp);


		scope._blendFolder.open();

		function updateSeed() {
			var data = {
				detail: {
					data: [params.blend.seed[0], params.blend.seed[1], params.blend.seed[2]]
				}
			};
			window.dispatchEvent(new CustomEvent('update-seed', data));
		};

		function updateFrequency() {
			var data = {
				detail: {
					data: [params.blend.frequency1, params.blend.frequency2, params.blend.frequency3]
				}
			};
			window.dispatchEvent(new CustomEvent('update-frequency', data));
		};

		function updateCoff() {
			var data = {
				detail: {
					data: [params.blend.constCoff1, params.blend.linearCoff1, params.blend.constCoff2, params.blend.linearCoff2]
				}
			};
			window.dispatchEvent(new CustomEvent('update-coff', data));
		};

		function updateClamp() {
			var data = {
				detail: {
					data: [params.blend.oneClamp, params.blend.zeroClamp, params.blend.middleValue]
				}
			};
			window.dispatchEvent(new CustomEvent('update-clamp', data));
		};
	};

	APP.TerrainGui.prototype = {

		constructor: APP.TerrainGui

	};

	APP.TerrainViewer = function () {

		var TERRAIN_PATH = "res/terrain/";

		var renderer = new APP.Renderer();
		renderer.init(window.innerWidth, window.innerHeight, window.devicePixelRatio);

		var camera = renderer.getCamera();
		var orbitControls = new THREE.OrbitControls(camera);
		camera.position.set(-100, 100, 300);
		orbitControls.target.set(0, 0, 0);
		orbitControls.update();

		// 地形

		var terrain, terrainLoader = new THREE.TerrainLoader(renderer.getRenderer());
		var fileName = "1.json";
		terrainLoader.load(fileName, function (t) {
			terrain = t;
			renderer.addScene(terrain);
		});

		var gui, loader = new THREE.XHRLoader();
		loader.load(TERRAIN_PATH + fileName, function (text) {
			var json = JSON.parse(text);
			json.fileName = fileName;
			gui = APP.TerrainGui(json);
		});

		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('update-seed', onUpdateSeed, false);
		window.addEventListener('update-frequency', onUpdateFrequency, false);
		window.addEventListener('update-coff', onUpdateCoff, false);
		window.addEventListener('update-clamp', onUpdateClamp, false);

		render();

		function render() {

			requestAnimationFrame(render);

			renderer.update(0);
		};

		// 事件 处理函数

		function onWindowResize() {
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		function onUpdateSeed(event) {
			var data = event.detail.data;
			terrain.setBlendSeed(data[0], data[1], data[2], data[3]);
			terrain.updateBlend(renderer.getRenderer());
		}

		function onUpdateFrequency(event) {
			var data = event.detail.data;
			terrain.setBlendFrequency(data[0], data[1], data[2]);
			terrain.updateBlend(renderer.getRenderer());
		}

		function onUpdateCoff(event) {
			var data = event.detail.data;
			terrain.setBlendCoff(data[0], data[1], data[2], data[3]);
			terrain.updateBlend(renderer.getRenderer());
		}

		function onUpdateClamp(event) {
			var data = event.detail.data;
			terrain.setBlendClamp(data[0], data[1], data[2]);
			terrain.updateBlend(renderer.getRenderer());
		}
	};

	exports.THREE = THREE;
});