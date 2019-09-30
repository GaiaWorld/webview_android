'use strict';

/** 
 * 依赖表加载成功后的回调函数
 * 每个项目需要在这里做3件事
 *    1. 更新：App，H5，更新界面写到这里来。
 *    2. 分批加载目录
 *    3. 调用项目的入口函数/组件
 */
winit.initNext = function () {
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;
	win.Map = 1;
	var startTime = winit.startTime;
	console.log("init time:", Date.now() - startTime);

	// 清除运营商注入的代码
	var clear = function () {
		//清除window上新增的对象
		var k;
		for (k in window) {
			if (window.hasOwnProperty(k) && !win[k])
				window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i, arr = document.body.children;
		for (i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if (!k.getAttribute("pi"))
				document.body.removeChild(k);
		}
	};
	// clear();

	pi_modules.depend.exports.init(winit.deps, winit.path);

	var flags = winit.flags;

	// 一定要立即释放，保证不会重复执行
	winit = undefined;

	// 进度条
	var div = document.createElement('div');
	div.setAttribute("pi", "1");
	div.setAttribute("style", "position:absolute;bottom:10px;left: 2%;width: 95%;height: 10px;background: #262626;padding: 1px;border-radius: 20px;border-top: 1px solid #000;border-bottom: 1px solid #7992a8;");
	var divProcess = document.createElement('div');
	divProcess.setAttribute("style", "width: 0%;height: 100%;background-color: rgb(162, 131, 39);border-radius: 20px;");
	div.appendChild(divProcess);
	document.body.appendChild(div);

	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	
	var isFinish = false;
	var gooo = function () {
		if (isFinish) return;
		var p = modProcess.getState() * 0.5 + dirProcess.getState() * 0.5;
		divProcess.style.width = p * 100 + "%";

		requestAnimationFrame(gooo);
	}
	gooo();

	/**
	 * 更新App和H5,策略如下:
	 *     1. 同时检查是否需要更新，超时1秒钟即可
	 *     2. 如果App需要更新，更新App，并重启（Android/iOS底层自动）
	 *     3. 否则，如果H5需要更新，更新H5并重新reload
	 *     4. 否则调用加载函数load加载项目资源；
	 */
	var isAppNeedUpdate = undefined;
	var isH5NeedUpdate = undefined;

	var h5UpdateMod = pi_modules.update.exports;
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
				if (isH5NeedUpdate !== undefined) {
					updateH5();
				}
			}
		});

		h5UpdateMod.setServerInfo("boot/");
		h5UpdateMod.checkUpdate(function (updateFlag) {

			isH5NeedUpdate = updateFlag;
			if (isAppNeedUpdate !== undefined) {
				updateH5();
			}
		});
	});

	function updateH5() {
		var needUpdate = false;

		if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_NO_UPDATE) {
			// 不需要更新
			needUpdate = false;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST) {
			alert("上次没有更新完成, 强制更新");
			needUpdate = true;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_FORCE) {
			alert("大版本变动, 强制更新");
			needUpdate = true;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_OPTIONAL) {
			needUpdate = confirm("小版本变动，需要更新吗？");
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST_ERROR) {
			alert("服务器连不上，同时上次更新到一半，错误");
			return;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_APP_ERROR) {
			alert("服务器连不上，同时app版本太低，错误");
			return;
		} else {
			alert("H5 更新，其他未处理错误");
			throw new Error("H5 update error!");
		}

		if (needUpdate) {
			h5UpdateMod.update(function (e) {
				console.log("update progress: ", e);
			}, function () {
				alert("H5 更新成功, 即将重启");
				h5UpdateMod.reload();
			});
		} else {
			// 这里是项目加载的开始
			loadBaseModules();
		}
	}

	/**
	 * 加载基础模块
	 */
	function loadBaseModules(callback) {
		console.log("loadBaseModules ===========")
		pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util","pi/util/userAgent","pi/browser/ajax"], {}, function (mods, fm) {
			console.log("first mods time:", Date.now() - startTime, mods, Date.now());
			var html = mods[0],
				util = mods[1],
				userAgentMod = mods[2];

			// 判断是否第一次进入,决定是显示片头界面还是开始界面
			var userinfo = html.getCookie("userinfo");
			pi_modules.commonjs.exports.flags = userAgentMod.userAgent(flags);
			flags.userinfo = userinfo;

			// 是否支持webp格式的图片
			html.checkWebpFeature(function (r) {
				flags.webp = flags.webp || r;
				loadDir(fm, util);
			});
		}, function (result) {
			alert("加载基础模块失败, " + r.url + ", " + result.error + ":" + result.reason);
		}, modProcess.handler);
	}

	/**
	 * 加载项目目录
	 */
	function loadDir(fm, util) {
		util.loadDir([ "app/store/","app/remote/postWalletMessage.js"], flags, fm, undefined, function (fileMap) {
			// store 数据初始化完成后才通知 如果数据初始化没完成就通知  有可能数据还没读出来钱包就已经取了数据  导致数据不一致
			var initStore = pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.initStore;
			initStore().then(() => {
				var WebViewManager = pi_modules.commonjs.exports.relativeGet("pi/browser/webview").exports.WebViewManager;
				WebViewManager.addListenStage(function(stage){
					if(stage === "firstStage"){    // 第一阶段完成  
						// TODO 在回调中加载剩余代码 并且注册监听已经完成
						var postStoreLoadedMessage = pi_modules.commonjs.exports.relativeGet("app/remote/postWalletMessage").exports.postStoreLoadedMessage;
						console.log("postStoreLoadedMessage start-----------------------");
						postStoreLoadedMessage();
						// 加载剩下资源
						util.loadDir([ "app/remote/","app/core/","app/publicLib/"], flags, fm, undefined, function (fileMap) {
							var postAllLoadedMessage = pi_modules.commonjs.exports.relativeGet("app/remote/postWalletMessage").exports.postAllLoadedMessage;
							console.log("postAllLoadedMessage start-----------------------");
							postAllLoadedMessage();
						}, function (r) {
							console.log("加载目录失败, " + r.url + ", " + r.error + ":" + r.reason);
						}, function(){});
					}
				});
				console.log("stage vm goReady");
				WebViewManager.getReady("firstStage"); // 通知一阶段准备完毕
			});
			
		}, function (r) {
			console.log("加载目录失败, " + r.url + ", " + r.error + ":" + r.reason);
		}, function(){});
	}

	/**
	 * 项目入口函数
	 */
	function main(util) {

		// ============== 测试struct ==============

		// var structUtil = pi_modules.commonjs.exports.relativeGet("struct/util").exports;
		// var structMgr = pi_modules.commonjs.exports.relativeGet("struct/struct_mgr").exports;
		// var mgr1 = new structMgr.StructMgr();
		// var mgr2 = new structMgr.StructMgr();
		// structUtil.registerToMgr(fileMap, mgr1);
		// structUtil.registerToMgr(fileMap, mgr2);
		// //structUtil.addLisner(mgr1, mgr2);
		// self.__mgr1 = mgr1;
		// self.__mgr2 = mgr2;

		// ============== 测试rpc ==============

		// var structUtil = pi_modules.commonjs.exports.relativeGet("struct/util").exports;
		// var structMgr = pi_modules.commonjs.exports.relativeGet("struct/struct_mgr").exports;
		// var rpcMgr = new structMgr.StructMgr();
		// structUtil.registerRpc(fileMap, rpcMgr);
		// self.rpcMgr = rpcMgr;

		// ============== 测试worker线程 ==============

		// var worker = pi_modules.commonjs.exports.relativeGet("pi/worker/client").exports;
		// worker.create("calc", 2, ["pi/util/img"], fm);
		// worker.request("calc", "pi/util/hash", "calcHashTime", ["asdf", 1000], undefined, 900, 0, function (r) {
		// 	console.log("calc hash count per ms: " + (r.count / r.time | 0));
		// }, function (err) {
		// 	console.log(err);
		// });

		// ============== 加载根组件 ==============

		// var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
		// root.cfg.full = true; // PC模式
		// util.addWidget(document.body, "pi-ui-root");

		// ============== 加载examples测试框架 ==============

		// var w = root.open("examples-root", "examples-");

		// ============== 应用程序使用，显示片头界面或开始界面 ==============
		// var w = root.open(flags.userinfo?"app-start-show":"app-title-show");
	}
};

// 初始化开始
(winit.init = function () {
	if (!winit) return;

	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();

	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();