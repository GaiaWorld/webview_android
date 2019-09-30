'use strict';

/** 
 * 依赖表加载成功后的回调函数
 * 每个项目需要在这里做3件事
 *    1. 更新：App，H5，更新界面写到这里来。
 *    2. 分批加载目录
 *    3. 调用项目的入口函数/组件
 */
winit.initNext = function () {
	var startTime = winit.startTime;
	console.log("init time:", Date.now() - startTime);

	// clear();

	pi_modules.depend.exports.init(winit.deps, winit.path);

	var flags = winit.flags;

	// 一定要立即释放，保证不会重复执行
	winit = undefined;

	/**
	 * 更新App和H5,策略如下:
	 *     1. 同时检查是否需要更新，超时1秒钟即可
	 *     2. 如果App需要更新，更新App，并重启（Android/iOS底层自动）
	 *     3. 否则，如果H5需要更新，更新H5并重新reload
	 *     4. 否则调用加载函数load加载项目资源；
	 */
	var isAppNeedUpdate = undefined;
	var isJSVM5NeedUpdate = undefined;

	var jsvmUpdateMod = pi_modules.update.exports;
	var appUpdateMod = pi_modules.appUpdate.exports;
	
	appUpdateMod.init(function () {
		appUpdateMod.needUpdate(function (isNeedUpdate) {
			if (isNeedUpdate > 0) {
				alert("App 需要更新");
				appUpdateMod.update(function () {
					alert("App 更新失败, 请重启App");
				}, function (total, process) {
					console.log("app update: total = " + total + " process = " + process);
				});
			} else {
				// 只有在这种情况下才有可能更新H5
				isAppNeedUpdate = isNeedUpdate;
				if (isJSVM5NeedUpdate !== undefined) {
					updateJSVM();
				}
			}
		});

		jsvmUpdateMod.setServerInfo("boot/");
		jsvmUpdateMod.checkUpdate(function (updateFlag) {

			isJSVM5NeedUpdate = updateFlag;
			if (isAppNeedUpdate !== undefined) {
				updateJSVM();
			}
		});
	});

	function updateJSVM() {
		var needUpdate = false;

		if (isJSVM5NeedUpdate === jsvmUpdateMod.UPDATE_FLAG_NO_UPDATE) {
			// 不需要更新
			alert("不需要更新JSVM");
			needUpdate = false;
		} else if (isJSVM5NeedUpdate === jsvmUpdateMod.UPDATE_FLAG_LAST) {
			alert("JSVM上次没有更新完成, 强制更新");
			needUpdate = true;
		} else if (isJSVM5NeedUpdate === jsvmUpdateMod.UPDATE_FLAG_FORCE) {
			alert("JSVM大版本变动, 强制更新");
			needUpdate = true;
		} else if (isJSVM5NeedUpdate === jsvmUpdateMod.UPDATE_FLAG_OPTIONAL) {
			alert("JSVM小版本变动，需要更新");
			needUpdate = true;
		} else if (isJSVM5NeedUpdate === jsvmUpdateMod.UPDATE_FLAG_LAST_ERROR) {
			alert("JSVM服务器连不上，同时上次更新到一半，错误");
			return;
		} else if (isJSVM5NeedUpdate === jsvmUpdateMod.UPDATE_FLAG_APP_ERROR) {
			alert("JSVM服务器连不上，同时app版本太低，错误");
			return;
		} else {
			alert("JSVM 更新，其他未处理错误");
			throw new Error("JSVM update error!");
		}

		if (needUpdate) {
			var start = new Date().getTime();
			jsvmUpdateMod.update(function (e) {
				console.log("update progress: ", e);
			}, function () {
				console.log("JSVM 更新耗时 = ",new Date().getTime() - start);
				console.log("JSVM 更新成功, 即将重启");
				jsvmUpdateMod.reload();
			});
		} else {
			// 这里是项目加载的开始
			loadBaseModules();		
		}
	}

	/**
	 * 加载基础模块
	 */
	function loadBaseModules() {
		pi_modules.commonjs.exports.require(["pi/util/userAgent","pi/widget/util","pi/browser/webview","pi/browser/ajax"], {}, function (mods, fm) {
			console.log("first mods time:", Date.now() - startTime, mods, Date.now());
			var html = mods[0];
			var util = mods[1];
			pi_modules.commonjs.exports.flags = html.userAgent(flags);
			flags.userinfo = undefined;
			main(util,fm);
		}, function (result) {
			console.log("加载基础模块失败, " + r.url + ", " + result.error + ":" + result.reason);
		}, console.log("load util ing....."));
	}

	/**
	 * 项目入口函数
	 */
	function main(util,fm) {
		// 开始flag
		console.log("vm项目开始了。。。。。。。");
		util.loadDir([ "app/remote/","app/store"], flags, fm, undefined, function (fileMap) {
			pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.initStore();
			pi_modules.commonjs.exports.relativeGet("app/remote/login").exports.openConnect();
			
		}, function (r) {
			console.log("加载目录失败, " + r.url + ", " + r.error + ":" + r.reason);
		}, function(){});
		
	}
};

// 初始化开始
(winit.init = function () {
	console.log("init start");
	if (!winit) {
		console.log("winit not init, stop");
		return;
	}

	winit.deps && pi_modules && pi_modules.butil  && winit.initNext();
})();