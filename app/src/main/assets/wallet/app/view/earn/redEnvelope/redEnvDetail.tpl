(function (_cfg, it, it1) {
	var _$temp = void 0,
	    node = void 0;_$temp = node;{
		var _$parent = _$temp;var _node = { "attrs": {}, "tagName": "div", "sid": 0 };_node.children = [];_node.attrSize = 3;_node.attrHash = 3286765528;_node.attrs["class"] = "new-page";_node.attrs["ev-back-click"] = "backPrePage";_node.attrs["w-class"] = "new-page";if (!it1.scroll) {
			_$temp = _node;{
				var _$parent2 = _$temp;var _node2 = { "attrs": {}, "tagName": "app-components1-topBar-topBar", "sid": 1 };_node2.hasChild = false;_node2.child = null;_node2.attrHash = 0;_$temp = _node2;{
					var _$parent3 = _$temp;var _node3 = {}; //jpair pre

					_node3["title"] = it1.cfgData.topBarTitle;
					//jpair suf
					//jpair pre

					{
						var jvalue = "";
						jvalue = "#DF5E5E";
						//jpair suf

						_node3["background"] = jvalue;
					}
					_addJson(_node3, _$parent3);
				}_chFunc(_node2);_$parent2.children.push(_node2);
			}
		} else {
			_$temp = _node;{
				var _$parent4 = _$temp;var _node4 = { "attrs": {}, "tagName": "app-components1-topBar-topBar", "sid": 2 };_node4.hasChild = false;_node4.child = null;_node4.attrHash = 0;_$temp = _node4;{
					var _$parent5 = _$temp;var _node5 = {}; //jpair pre

					_node5["title"] = it1.cfgData.topBarTitle;
					//jpair suf
					_addJson(_node5, _$parent5);
				}_chFunc(_node4);_$parent4.children.push(_node4);
			}
		}_$temp = _node;{
			var _$parent6 = _$temp;var _node6 = { "attrs": {}, "tagName": "div", "sid": 3 };_node6.children = [];_node6.attrSize = 3;_node6.attrHash = 1861377870;_node6.attrs["w-class"] = "content";_node6.attrs["on-scroll"] = "pageScroll";_node6.attrs["id"] = "redEnvDetail";_$temp = _node6;{
				var _$parent7 = _$temp;var _node7 = { "attrs": {}, "tagName": "img", "sid": 4 };_node7.children = [];_node7.childHash = 0;_node7.attrSize = 2;_node7.attrHash = 1033678261;_node7.attrs["src"] = "../../../res/image/redEnvDetail.png";_node7.attrs["w-class"] = "topBackimg";_$parent7.children.push(_node7);
			}_$temp = _node6;{
				var _$parent8 = _$temp;var _node8 = { "attrs": {}, "tagName": "div", "sid": 5 };_node8.children = [];_node8.attrSize = 1;_node8.attrHash = 2188685783;_node8.attrs["w-class"] = "topBack";_$temp = _node8;{
					var _$parent9 = _$temp;var _node9 = { "attrs": {}, "tagName": "img", "sid": 6 };_node9.children = [];_node9.attrSize = 2;_node9.attrHash = 1283080277;{
						var attrvalue = "";attrvalue = it1.userHead;_node9.attrs["src"] = attrvalue;
					}_node9.attrHash = _hash.nextHash(_node9.attrHash, _calTextHash(_node9.attrs["src"]));_node9.attrs["w-class"] = "userHead";_chFunc(_node9);_$parent9.children.push(_node9);
				}_$temp = _node8;{
					var _$parent10 = _$temp;var _node10 = { "attrs": {}, "tagName": "div", "sid": 7 };_node10.children = [];_node10.attrSize = 1;_node10.attrHash = 2409994842;_node10.attrs["style"] = "margin: 30px 0 10px;font-size: 30px;color: #222222;";_$temp = _node10;{
						var _$parent11 = _$temp;_addText(it1.userName, _$parent11);
					}if (it1.showPin) {
						_$temp = _node10;{
							var _$parent12 = _$temp;var _node11 = { "attrs": {}, "tagName": "span", "sid": 8 };_node11.children = [];_node11.attrSize = 1;_node11.attrHash = 2405874756;_node11.attrs["w-class"] = "other";_$temp = _node11;{
								var _$parent13 = _$temp;_addText(it1.cfgData.pin, _$parent13);
							}_chFunc(_node11);_$parent12.children.push(_node11);
						}
					}_chFunc(_node10);_$parent10.children.push(_node10);
				}_$temp = _node8;{
					var _$parent14 = _$temp;var _node12 = { "attrs": {}, "tagName": "div", "sid": 9 };_node12.children = [];_node12.attrHash = 0;_$temp = _node12;{
						var _$parent15 = _$temp;_addText(it1.message, _$parent15);
					}_chFunc(_node12);_$parent14.children.push(_node12);
				}_chFunc(_node8);_$parent8.children.push(_node8);
			}_$temp = _node6;{
				var _$parent16 = _$temp;var _node13 = { "attrs": {}, "tagName": "div", "sid": 10 };_node13.children = [];_node13.attrSize = 1;_node13.attrHash = 832204064;_node13.attrs["w-class"] = "bottom";_$temp = _node13;{
					var _$parent17 = _$temp;var _node14 = { "attrs": {}, "tagName": "div", "sid": 11 };_node14.children = [];_node14.attrSize = 1;_node14.attrHash = 819962544;_node14.attrs["w-class"] = "tips";_$temp = _node14;{
						var _$parent18 = _$temp;_addText(it1.cfgData.tips[0] + it.curNum + "/" + it.totalNum, _$parent18);
					}_$temp = _node14;{
						var _$parent19 = _$temp;var _node15 = _installText("，", 3114458989);;
						_$parent19.children.push(_node15);
					}_$temp = _node14;{
						var _$parent20 = _$temp;_addText(it1.cfgData.tips[1] + it.amount + it.ctypeShow, _$parent20);
					}_chFunc(_node14);_$parent17.children.push(_node14);
				}{
					var _$i = 0;
					for (var _iterator = it1.redBagList, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
						var _ref;

						if (_isArray) {
							if (_i >= _iterator.length) break;
							_ref = _iterator[_i++];
						} else {
							_i = _iterator.next();
							if (_i.done) break;
							_ref = _i.value;
						}

						var val = _ref;
						var ind = _$i++;_$temp = _node13;{
							var _$parent21 = _$temp;var _node16 = { "attrs": {}, "tagName": "app-components-fourParaImgItem-fourParaImgItem", "sid": 12 };_node16.hasChild = false;_node16.child = null;_node16.attrHash = 0;_$temp = _node16;{
								var _$parent22 = _$temp;var _node17 = {}; //jpair pre

								_node17["name"] = val.userName;
								//jpair suf
								//jpair pre

								_node17["data"] = val.amount + " " + it.ctypeShow;
								//jpair suf
								//jpair pre

								_node17["time"] = val.timeShow;
								//jpair suf
								//jpair pre

								_node17["img"] = val.avatar;
								//jpair suf
								//jpair pre

								_node17["describe"] = it1.greatUser == ind ? it1.cfgData.greatUser : "";
								//jpair suf
								_addJson(_node17, _$parent22);
							}_chFunc(_node16);_$parent21.children.push(_node16);
						}
					}
				}if (it.curNum < it.totalNum) {
					_$temp = _node13;{
						var _$parent23 = _$temp;var _node18 = { "attrs": {}, "tagName": "div", "sid": 13 };_node18.children = [];_node18.attrSize = 1;_node18.attrHash = 3992589513;_node18.attrs["w-class"] = "endMess";_$temp = _node18;{
							var _$parent24 = _$temp;var _node19 = { "attrs": {}, "tagName": "div", "sid": 14 };_node19.children = [];_node19.attrSize = 2;_node19.attrHash = 2799917979;_node19.attrs["w-class"] = "againSend";_node19.attrs["on-tap"] = "againSend";_$temp = _node19;{
								var _$parent25 = _$temp;_addText(it1.cfgData.tips[2], _$parent25);
							}_chFunc(_node19);_$parent24.children.push(_node19);
						}_$temp = _node18;{
							var _$parent26 = _$temp;var _node20 = { "attrs": {}, "tagName": "div", "sid": 15 };_node20.children = [];_node20.attrHash = 0;_$temp = _node20;{
								var _$parent27 = _$temp;_addText(it1.cfgData.tips[3], _$parent27);
							}_chFunc(_node20);_$parent26.children.push(_node20);
						}_chFunc(_node18);_$parent23.children.push(_node18);
					}
				}_chFunc(_node13);_$parent16.children.push(_node13);
			}_chFunc(_node6);_$parent6.children.push(_node6);
		}_chFunc(_node);return _node;
	}
});