(function (_cfg, it, it1) {
	var _$temp = void 0,
	    node = void 0;_$temp = node;{
		var _$parent = _$temp;var _node = { "attrs": {}, "tagName": "div", "sid": 0 };_node.children = [];_node.attrSize = 3;_node.attrHash = 903060142;_node.attrs["class"] = "new-page";_node.attrs["ev-next-click"] = "share";_node.attrs["ev-back-click"] = "backPrePage";_$temp = _node;{
			var _$parent2 = _$temp;var _node2 = { "attrs": {}, "tagName": "app-components1-topBar-topBar", "sid": 1 };_node2.hasChild = false;_node2.child = null;_node2.attrHash = 0;_$temp = _node2;{
				var _$parent3 = _$temp;var _node3 = {}; //jpair pre

				_node3["title"] = it1.cfgData.topBarTitle;
				//jpair suf
				//jpair pre

				{
					var jvalue = "";
					jvalue = "../../res/image/09.png";
					//jpair suf

					_node3["nextImg"] = jvalue;
				}
				_addJson(_node3, _$parent3);
			}_chFunc(_node2);_$parent2.children.push(_node2);
		}_$temp = _node;{
			var _$parent4 = _$temp;var _node4 = { "attrs": {}, "tagName": "div", "sid": 2 };_node4.children = [];_node4.attrSize = 1;_node4.attrHash = 487306359;_node4.attrs["w-class"] = "content";_$temp = _node4;{
				var _$parent5 = _$temp;var _node5 = { "attrs": {}, "tagName": "div", "sid": 3 };_node5.children = [];_node5.attrSize = 1;_node5.attrHash = 1019047777;_node5.attrs["w-class"] = "title";_$temp = _node5;{
					var _$parent6 = _$temp;var _node6 = { "attrs": {}, "tagName": "img", "sid": 4 };_node6.children = [];_node6.attrSize = 2;_node6.attrHash = 1283080277;{
						var attrvalue = "";attrvalue = it1.userHead;_node6.attrs["src"] = attrvalue;
					}_node6.attrHash = _hash.nextHash(_node6.attrHash, _calTextHash(_node6.attrs["src"]));_node6.attrs["w-class"] = "userHead";_chFunc(_node6);_$parent6.children.push(_node6);
				}_$temp = _node5;{
					var _$parent7 = _$temp;var _node7 = { "attrs": {}, "tagName": "span", "sid": 5 };_node7.children = [];_node7.attrSize = 1;_node7.attrHash = 4232090967;_node7.attrs["w-class"] = "userName";_$temp = _node7;{
						var _$parent8 = _$temp;_addText(it1.userName, _$parent8);
					}_chFunc(_node7);_$parent7.children.push(_node7);
				}_chFunc(_node5);_$parent5.children.push(_node5);
			}_$temp = _node4;{
				var _$parent9 = _$temp;var _node8 = { "attrs": {}, "tagName": "div", "sid": 6 };_node8.children = [];_node8.attrSize = 2;_node8.attrHash = 3708489470;_node8.attrs["w-class"] = "address";_node8.attrs["on-tap"] = "copyAddr";_$temp = _node8;{
					var _$parent10 = _$temp;_addText(it1.address, _$parent10);
				}_$temp = _node8;{
					var _$parent11 = _$temp;var _node9 = { "attrs": {}, "tagName": "img", "sid": 7 };_node9.children = [];_node9.childHash = 0;_node9.attrSize = 2;_node9.attrHash = 1080944863;_node9.attrs["src"] = "../../../res/image/42.png";_node9.attrs["w-class"] = "copy";_$parent11.children.push(_node9);
				}_chFunc(_node8);_$parent9.children.push(_node8);
			}_$temp = _node4;{
				var _$parent12 = _$temp;var _node10 = { "attrs": {}, "tagName": "div", "sid": 8 };_node10.children = [];_node10.attrSize = 1;_node10.attrHash = 3583682907;_node10.attrs["style"] = "text-align: center;";_$temp = _node10;{
					var _$parent13 = _$temp;var _node11 = { "attrs": {}, "tagName": "app-components-qrcode-qrcode", "sid": 9 };_node11.hasChild = false;_node11.child = null;_node11.attrHash = 0;_$temp = _node11;{
						var _$parent14 = _$temp;var _node12 = {}; //jpair pre

						_node12["value"] = it1.address;
						//jpair suf
						//jpair pre

						{
							var _jvalue = "";
							_jvalue = "350";
							//jpair suf

							_node12["size"] = _jvalue;
						}
						_addJson(_node12, _$parent14);
					}_chFunc(_node11);_$parent13.children.push(_node11);
				}_$temp = _node10;{
					var _$parent15 = _$temp;var _node13 = { "attrs": {}, "tagName": "div", "sid": 10 };_node13.children = [];_node13.attrSize = 1;_node13.attrHash = 3925273237;_node13.attrs["style"] = "font-size: 32px;color: #222222;margin-top: 50px;";_$temp = _node13;{
						var _$parent16 = _$temp;_addText(it1.cfgData.shortMess, _$parent16);
					}_chFunc(_node13);_$parent15.children.push(_node13);
				}_chFunc(_node10);_$parent12.children.push(_node10);
			}_chFunc(_node4);_$parent4.children.push(_node4);
		}_chFunc(_node);return _node;
	}
});