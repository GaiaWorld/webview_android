(function (_cfg, it, it1) {
	var _$temp = void 0,
	    node = void 0;_$temp = node;{
		var _$parent = _$temp;var _node = { "attrs": {}, "tagName": "div", "sid": 0 };_node.children = [];_node.attrSize = 3;_node.attrHash = 3437572703;_node.attrs["class"] = "new-page";_node.attrs["w-class"] = "new-page";_node.attrs["ev-back-click"] = "backPrePage";_$temp = _node;{
			var _$parent2 = _$temp;var _node2 = { "attrs": {}, "tagName": "div", "sid": 1 };_node2.children = [];_node2.attrSize = 2;_node2.attrHash = 4120364114;_node2.attrs["w-class"] = "top-head";_node2.attrs["ev-next-click"] = "doScanClick";_$temp = _node2;{
				var _$parent3 = _$temp;var _node3 = { "attrs": {}, "tagName": "app-components1-topBar-topBar", "sid": 2 };_node3.hasChild = false;_node3.child = null;_node3.attrHash = 0;_$temp = _node3;{
					var _$parent4 = _$temp;var _node4 = {}; //jpair pre

					{
						var jvalue = "";
						jvalue += it.currencyName;jvalue += "收款";
						//jpair suf

						_node4["title"] = jvalue;
					}
					//jpair pre

					{
						var _jvalue = "";
						_jvalue = "#fff";
						//jpair suf

						_node4["background"] = _jvalue;
					}
					_addJson(_node4, _$parent4);
				}_chFunc(_node3);_$parent3.children.push(_node3);
			}_chFunc(_node2);_$parent2.children.push(_node2);
		}_$temp = _node;{
			var _$parent5 = _$temp;var _node5 = { "attrs": {}, "tagName": "div", "sid": 3 };_node5.children = [];_node5.attrSize = 1;_node5.attrHash = 4252679546;_node5.attrs["w-class"] = "body";_$temp = _node5;{
				var _$parent6 = _$temp;var _node6 = { "attrs": {}, "tagName": "div", "sid": 4 };_node6.children = [];_node6.attrSize = 1;_node6.attrHash = 1913054642;_node6.attrs["w-class"] = "main";_$temp = _node6;{
					var _$parent7 = _$temp;var _node7 = { "attrs": {}, "tagName": "div", "sid": 5 };_node7.children = [];_node7.childHash = 2299383028;_node7.attrSize = 1;_node7.attrHash = 1019047777;_node7.attrs["w-class"] = "title";_$temp = _node7;{
						var _$parent8 = _$temp;var _node8 = { "attrs": {}, "tagName": "img", "sid": 6 };_node8.children = [];_node8.childHash = 0;_node8.attrSize = 2;_node8.attrHash = 1615159661;_node8.attrs["src"] = "../../../res/image1/default_avatar.png";_node8.attrs["w-class"] = "avatar";_$parent8.children.push(_node8);
					}_$temp = _node7;{
						var _$parent9 = _$temp;var _node9 = { "attrs": {}, "tagName": "div", "sid": 7 };_node9.children = [];_node9.childHash = 4085931654;_node9.attrHash = 0;_$temp = _node9;{
							var _$parent10 = _$temp;var _node10 = _installText("向他人收款", 579758706);;
							_$parent10.children.push(_node10);
						}_$parent9.children.push(_node9);
					}_$parent7.children.push(_node7);
				}_$temp = _node6;{
					var _$parent11 = _$temp;var _node11 = { "attrs": {}, "tagName": "div", "sid": 8 };_node11.children = [];_node11.attrSize = 1;_node11.attrHash = 487306359;_node11.attrs["w-class"] = "content";_$temp = _node11;{
						var _$parent12 = _$temp;var _node12 = { "attrs": {}, "tagName": "div", "sid": 9 };_node12.children = [];_node12.attrSize = 1;_node12.attrHash = 1801736937;_node12.attrs["w-class"] = "qrcode-container";_$temp = _node12;{
							var _$parent13 = _$temp;var _node13 = { "attrs": {}, "tagName": "app-components-qrcode-qrcode", "sid": 10 };_node13.hasChild = false;_node13.child = null;_node13.attrHash = 0;_$temp = _node13;{
								var _$parent14 = _$temp;var _node14 = {}; //jpair pre

								_node14["value"] = it1.fromAddr;
								//jpair suf
								//jpair pre

								_node14["size"] = 400;
								//jpair suf
								_addJson(_node14, _$parent14);
							}_chFunc(_node13);_$parent13.children.push(_node13);
						}_chFunc(_node12);_$parent12.children.push(_node12);
					}_$temp = _node11;{
						var _$parent15 = _$temp;var _node15 = { "attrs": {}, "tagName": "div", "sid": 11 };_node15.children = [];_node15.attrSize = 1;_node15.attrHash = 582383954;_node15.attrs["w-class"] = "addr-container";_$temp = _node15;{
							var _$parent16 = _$temp;_addText(it1.fromAddr, _$parent16);
						}_$temp = _node15;{
							var _$parent17 = _$temp;var _node16 = { "attrs": {}, "tagName": "img", "sid": 12 };_node16.children = [];_node16.childHash = 0;_node16.attrSize = 3;_node16.attrHash = 2695277147;_node16.attrs["src"] = "../../../res/image/copy.png";_node16.attrs["w-class"] = "copy";_node16.attrs["on-tap"] = "copyClick";_$parent17.children.push(_node16);
						}_chFunc(_node15);_$parent15.children.push(_node15);
					}_$temp = _node11;{
						var _$parent18 = _$temp;var _node17 = { "attrs": {}, "tagName": "div", "sid": 13 };_node17.children = [];_node17.childHash = 432283751;_node17.attrSize = 2;_node17.attrHash = 1411731355;_node17.attrs["w-class"] = "btn-container";_node17.attrs["ev-btn-tap"] = "shareClick";_$temp = _node17;{
							var _$parent19 = _$temp;var _node18 = { "attrs": {}, "tagName": "app-components1-btn-btn", "sid": 14 };_node18.hasChild = false;_node18.child = null;_node18.childHash = 366093123;_node18.attrHash = 0;_$temp = _node18;{
								var _$parent20 = _$temp;var _node19 = {}; //jpair pre

								{
									var _jvalue2 = "";
									_jvalue2 = "分享好友";
									//jpair suf

									_node19["name"] = _jvalue2;
								}
								//jpair pre

								{
									var _jvalue3 = "";
									_jvalue3 = "big";
									//jpair suf

									_node19["types"] = _jvalue3;
								}
								//jpair pre

								{
									var _jvalue4 = "";
									_jvalue4 = "white";
									//jpair suf

									_node19["color"] = _jvalue4;
								}
								_addJson(_node19, _$parent20);
							}_$parent19.children.push(_node18);
						}_$parent18.children.push(_node17);
					}_chFunc(_node11);_$parent11.children.push(_node11);
				}_chFunc(_node6);_$parent6.children.push(_node6);
			}_chFunc(_node5);_$parent5.children.push(_node5);
		}_chFunc(_node);return _node;
	}
});