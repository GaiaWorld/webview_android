//jsvm console是否打开，默认是关闭，正式环境下，将该值设置为false，避免频繁与底层通信
isConsole = true;

var winit = {};
(function () {

	/**
	 * 判断在ios还是android的jsvm运行
	 */
	var inApp = false;
	var inIOSApp = false;
	var inAndroidApp = false;

	if (navigator.userAgent.indexOf('JSVM_ANDROID') >= 0) {
		winit.inAndroidApp = inAndroidApp = true;
	} else if (navigator.userAgent.indexOf('JSVM_IOS') >= 0) {
		winit.inIOSApp = inIOSApp = true;
	}
	winit.inApp = inApp = winit.inAndroidApp || winit.inIOSApp;

	winit.startTime = Date.now();
	var name = "jsvm"; // 每个项目需要定义自己的表名，该名称决定了本地存储表
	winit.store = name;

	// app更新配置的URL地址
	winit.appURL = "http://192.168.31.226/appversion";

	var defaultDomains;
	winit.httpDomains = ["http://192.168.31.226"];

	if (inAndroidApp) {
		defaultDomains = winit.domains = ["file:///android_asset"];
	}
	if (inIOSApp) {
		var index = location.href.indexOf("/assets");
		index += "/assets".length;
		defaultDomains = winit.domains = [location.href.slice(0, index)];
	}
	
	winit.JSIntercept = {
		isNative: inApp,

		// 告诉底层已经完成数据库更新，可以更新底层版本了
		updateFinish: function (cb) {
			if (inAndroidApp || inIOSApp) {
				JSVM.Boot.updateFinish();
			} else {
				setTimeout(cb, 0);
			}
		},

		// 取App底层版本号
		getAppVersion: function (cb) {
			if (inAndroidApp || inIOSApp) {
				// window.webkit.messageHandlers.JSIntercept.postMessage(["getAppVersion", jsInterceptID]);
				JSVM.Boot.getAppVersion(cb);
			} else {
				setTimeout(cb, 0);
			}
		},

		// 更新App
		// iOS：url用来跳转到下载页面
		// Android：url用于底层更新apk文件
		updateApp: function (url, cb, progress) {
			if (inAndroidApp || inIOSApp) {
				// TODO: 弹出safari浏览器，跳转到url，并退出程序
				// window.webkit.messageHandlers.JSIntercept.postMessage(["updateApp", jsInterceptUpdate, url, jsInterceptID]);
				JSVM.Boot.updateApp(url);
			} else {
				setTimeout(cb, 0);
			}
		},

		getBootFile: function (fileName) {
			return mobileBootFiles[fileName];
		},

		getMobileBootFiles: function (cb) {
			if (inAndroidApp || inIOSApp) {
				JSVM.Boot.getMobileBootFiles(cb);
			} else {
				setTimeout(cb, 0);
			}
		},
		
		/**
		 * 重启JSVM
		 */
		restartJSVM: function () {
			if (inAndroidApp || inIOSApp) {
				JSVM.Boot.restartJSVM();
			}
		}
	};

	winit.loadJS = function (roots) {
		roots.runScript();
	};

	winit.initFail = function (url, err) {
		err ? console.log(err + ", " + url) : "";
	};

	winit.init = function () { };

	winit.flags = {};

	mobileBootFiles = {};

	winit.start = function () {
		winit.JSIntercept.getMobileBootFiles(function (arr){
			mobileBootFiles = arr;
			for (var key in mobileBootFiles) {
				if (key === "update.flag")
					mobileBootFiles[key] = mobileBootFiles[key].getContent();
			}
			winit.startImpl();
		});
	};

	winit.getLoadDomain = function (name, path) {
		var domain = mobileBootFiles[name];
		if (domain) return domain;
		else{
			return JSVM.Boot.loadJS(defaultDomains[0], path);
		}
		
	}


	winit.startImpl = function () {
		console.log("vm in startImpl 123");
		winit.loadJS(winit.getLoadDomain("jsindex.js", '/vm/boot/jsindex.js'));
	}

	winit.start();
})();