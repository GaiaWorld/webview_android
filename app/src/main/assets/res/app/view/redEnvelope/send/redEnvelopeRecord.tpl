(function (_cfg, it, it1) {
	var _$temp = void 0,
	    node = void 0;_$temp = node;{
		var _$parent = _$temp;var _node = { "attrs": {}, "tagName": "div", "sid": 0 };_node.children = [];_node.attrSize = 3;_node.attrHash = 846922391;_node.attrs["class"] = "ga-new-page";_node.attrs["ev-back-click"] = "backPrePage";_node.attrs["w-class"] = "ga-new-page";_$temp = _node;{
			var _$parent2 = _$temp;var _node2 = { "attrs": {}, "tagName": "app-components-topBar-topBar", "sid": 1 };_node2.hasChild = false;_node2.child = null;_node2.childHash = 742827243;_node2.attrHash = 0;_$temp = _node2;{
				var _$parent3 = _$temp;var _node3 = {}; //jpair pre

				{
					var jvalue = "";
					jvalue = "红包记录";
					//jpair suf

					_node3["title"] = jvalue;
				}
				//jpair pre

				{
					var _jvalue = "";
					_jvalue = "white";
					//jpair suf

					_node3["iconColor"] = _jvalue;
				}
				//jpair pre

				{
					var _jvalue2 = "";
					_jvalue2 = "color:#fff;backgroundColor:#DF5E5E;";
					//jpair suf

					_node3["style"] = _jvalue2;
				}
				_addJson(_node3, _$parent3);
			}_$parent2.children.push(_node2);
		}_$temp = _node;{
			var _$parent4 = _$temp;var _node4 = { "attrs": {}, "tagName": "div", "sid": 2 };_node4.children = [];_node4.attrSize = 1;_node4.attrHash = 3683563707;_node4.attrs["w-class"] = "ga-body";_$temp = _node4;{
				var _$parent5 = _$temp;var _node5 = { "attrs": {}, "tagName": "div", "sid": 3 };_node5.children = [];_node5.attrSize = 1;_node5.attrHash = 2953998813;_node5.attrs["w-class"] = "ga-records-num";_$temp = _node5;{
					var _$parent6 = _$temp;var _node6 = { "attrs": {}, "tagName": "span", "sid": 4 };_node6.children = [];_node6.attrSize = 1;_node6.attrHash = 3891488347;_node6.attrs["w-class"] = "ga-num";_$temp = _node6;{
						var _$parent7 = _$temp;_addText(it1.sendNumber, _$parent7);
					}_chFunc(_node6);_$parent6.children.push(_node6);
				}_$temp = _node5;{
					var _$parent8 = _$temp;var _node7 = { "attrs": {}, "tagName": "span", "sid": 5 };_node7.children = [];_node7.childHash = 1927054624;_node7.attrSize = 1;_node7.attrHash = 406484528;_node7.attrs["w-class"] = "ga-tag";_$temp = _node7;{
						var _$parent9 = _$temp;var _node8 = _installText("发出红包", 2539381968);;
						_$parent9.children.push(_node8);
					}_$parent8.children.push(_node7);
				}_chFunc(_node5);_$parent5.children.push(_node5);
			}_$temp = _node4;{
				var _$parent10 = _$temp;var _node9 = { "attrs": {}, "tagName": "div", "sid": 6 };_node9.children = [];_node9.attrSize = 1;_node9.attrHash = 3782936121;_node9.attrs["w-class"] = "ga-records-list-box";_$temp = _node9;{
					var _$parent11 = _$temp;var _node10 = { "attrs": {}, "tagName": "div", "sid": 7 };_node10.children = [];_node10.childHash = 314060369;_node10.attrSize = 1;_node10.attrHash = 696137400;_node10.attrs["w-class"] = "ga-records-list-title";_$temp = _node10;{
						var _$parent12 = _$temp;var _node11 = _installText("未被领取的红包已退回云端账户", 2965708493);;
						_$parent12.children.push(_node11);
					}_$parent11.children.push(_node10);
				}_$temp = _node9;{
					var _$parent13 = _$temp;var _node12 = { "attrs": {}, "tagName": "div", "sid": 8 };_node12.children = [];_node12.attrSize = 3;_node12.attrHash = 2411472327;_node12.attrs["w-class"] = "ga-records-list";_node12.attrs["on-scroll"] = "getMoreList";_node12.attrs["id"] = "records-container";_$temp = _node12;{
						var _$parent14 = _$temp;var _node13 = { "attrs": {}, "tagName": "div", "sid": 9 };_node13.children = [];_node13.attrSize = 1;_node13.attrHash = 994144885;_node13.attrs["id"] = "records";{
							var _$i = 0;
							for (var _iterator = it1.recordList, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
								var _ref;

								if (_isArray) {
									if (_i >= _iterator.length) break;
									_ref = _iterator[_i++];
								} else {
									_i = _iterator.next();
									if (_i.done) break;
									_ref = _i.value;
								}

								var item = _ref;
								var index = _$i++;_$temp = _node13;{
									var _$parent15 = _$temp;var _node14 = { "attrs": {}, "tagName": "div", "sid": 10 };_node14.children = [];_node14.attrSize = 2;_node14.attrHash = 3220484446;_node14.attrs["w-class"] = "ga-records-item";{
										var attrvalue = "";attrvalue += "redEnvelopeItemClick(e,";attrvalue += index;attrvalue += ")";_node14.attrs["on-tap"] = attrvalue;
									}_node14.attrHash = _hash.nextHash(_node14.attrHash, _calTextHash(_node14.attrs["on-tap"]));_$temp = _node14;{
										var _$parent16 = _$temp;var _node15 = { "attrs": {}, "tagName": "div", "sid": 11 };_node15.children = [];_node15.attrSize = 1;_node15.attrHash = 609736988;_node15.attrs["w-class"] = "ga-records-left";_$temp = _node15;{
											var _$parent17 = _$temp;var _node16 = { "attrs": {}, "tagName": "span", "sid": 12 };_node16.children = [];_node16.attrSize = 1;_node16.attrHash = 2349219154;_node16.attrs["w-class"] = "ga-records-type";_$temp = _node16;{
												var _$parent18 = _$temp;_addText(item.rtype === 0 ? '等额红包' : "随机红包", _$parent18);
											}_chFunc(_node16);_$parent17.children.push(_node16);
										}_$temp = _node15;{
											var _$parent19 = _$temp;var _node17 = { "attrs": {}, "tagName": "span", "sid": 13 };_node17.children = [];_node17.attrSize = 1;_node17.attrHash = 3943806019;_node17.attrs["w-class"] = "ga-records-time";_$temp = _node17;{
												var _$parent20 = _$temp;_addText(item.timeShow, _$parent20);
											}_chFunc(_node17);_$parent19.children.push(_node17);
										}_chFunc(_node15);_$parent16.children.push(_node15);
									}_$temp = _node14;{
										var _$parent21 = _$temp;var _node18 = { "attrs": {}, "tagName": "div", "sid": 14 };_node18.children = [];_node18.attrSize = 1;_node18.attrHash = 3575221327;_node18.attrs["w-class"] = "ga-amount";_$temp = _node18;{
											var _$parent22 = _$temp;var _node19 = { "attrs": {}, "tagName": "span", "sid": 15 };_node19.children = [];_node19.attrHash = 0;_$temp = _node19;{
												var _$parent23 = _$temp;_addText(item.amount, _$parent23);
											}_chFunc(_node19);_$parent22.children.push(_node19);
										}_$temp = _node18;{
											var _$parent24 = _$temp;var _node20 = _installText("&nbsp;", 1553561131);;
											_$parent24.children.push(_node20);
										}_$temp = _node18;{
											var _$parent25 = _$temp;var _node21 = { "attrs": {}, "tagName": "span", "sid": 16 };_node21.children = [];_node21.attrHash = 0;_$temp = _node21;{
												var _$parent26 = _$temp;_addText(item.ctypeShow, _$parent26);
											}_chFunc(_node21);_$parent25.children.push(_node21);
										}_chFunc(_node18);_$parent21.children.push(_node18);
									}_chFunc(_node14);_$parent15.children.push(_node14);
								}
							}
						}if (it1.showMoreTips) {
							_$temp = _node13;{
								var _$parent27 = _$temp;var _node22 = { "attrs": {}, "tagName": "div", "sid": 17 };_node22.children = [];_node22.attrSize = 2;_node22.attrHash = 2726404246;_node22.attrs["w-class"] = "loadmore";_node22.attrs["id"] = "more";_$temp = _node22;{
									var _$parent28 = _$temp;_addText(it1.hasMore ? '加载中，请稍后~~~' : '没有更多了', _$parent28);
								}_chFunc(_node22);_$parent27.children.push(_node22);
							}
						}_chFunc(_node13);_$parent14.children.push(_node13);
					}_chFunc(_node12);_$parent13.children.push(_node12);
				}_chFunc(_node9);_$parent10.children.push(_node9);
			}_chFunc(_node4);_$parent4.children.push(_node4);
		}_chFunc(_node);return _node;
	}
});