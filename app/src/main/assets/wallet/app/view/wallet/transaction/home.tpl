(function (_cfg, it, it1) {
	var _$temp = void 0,
	    node = void 0;_$temp = node;{
		var _$parent = _$temp;var _node = { "attrs": {}, "tagName": "div", "sid": 0 };_node.children = [];_node.attrSize = 4;_node.attrHash = 274209324;_node.attrs["class"] = "new-page";_node.attrs["w-class"] = "new-page";_node.attrs["ev-back-click"] = "backPrePage";_node.attrs["ev-next-click"] = "chooseAddrClick";_$temp = _node;{
			var _$parent2 = _$temp;var _node2 = { "attrs": {}, "tagName": "div", "sid": 1 };_node2.children = [];_node2.attrSize = 1;_node2.attrHash = 3673846548;_node2.attrs["w-class"] = "top-head";_$temp = _node2;{
				var _$parent3 = _$temp;var _node3 = { "attrs": {}, "tagName": "app-components1-topBar-topBar", "sid": 2 };_node3.hasChild = false;_node3.child = null;_node3.attrHash = 0;_$temp = _node3;{
					var _$parent4 = _$temp;var _node4 = {}; //jpair pre

					_node4["title"] = it.currencyName;
					//jpair suf
					//jpair pre

					{
						var jvalue = "";
						jvalue = "linear-gradient(to right,#38CFE7,#318DE6)";
						//jpair suf

						_node4["background"] = jvalue;
					}
					//jpair pre

					{
						var _jvalue = "";
						_jvalue = "../../res/image/location.png";
						//jpair suf

						_node4["nextImg"] = _jvalue;
					}
					_addJson(_node4, _$parent4);
				}_chFunc(_node3);_$parent3.children.push(_node3);
			}_$temp = _node2;{
				var _$parent5 = _$temp;var _node5 = { "attrs": {}, "tagName": "div", "sid": 3 };_node5.children = [];_node5.attrSize = 1;_node5.attrHash = 3605200885;_node5.attrs["w-class"] = "head";_$temp = _node5;{
					var _$parent6 = _$temp;var _node6 = { "attrs": {}, "tagName": "img", "sid": 4 };_node6.children = [];_node6.attrSize = 2;_node6.attrHash = 1742546961;{
						var attrvalue = "";attrvalue += "../../../res/image/currency/";attrvalue += it.currencyName;attrvalue += ".png";_node6.attrs["src"] = attrvalue;
					}_node6.attrHash = _hash.nextHash(_node6.attrHash, _calTextHash(_node6.attrs["src"]));_node6.attrs["w-class"] = "currency-icon";_chFunc(_node6);_$parent6.children.push(_node6);
				}_$temp = _node5;{
					var _$parent7 = _$temp;var _node7 = { "attrs": {}, "tagName": "div", "sid": 5 };_node7.children = [];_node7.attrSize = 1;_node7.attrHash = 3118159832;_node7.attrs["w-class"] = "asset-container";_$temp = _node7;{
						var _$parent8 = _$temp;var _node8 = { "attrs": {}, "tagName": "div", "sid": 6 };_node8.children = [];_node8.attrSize = 1;_node8.attrHash = 1349797565;_node8.attrs["w-class"] = "balance";_$temp = _node8;{
							var _$parent9 = _$temp;_addText(it1.balance, _$parent9);
						}_chFunc(_node8);_$parent8.children.push(_node8);
					}_$temp = _node7;{
						var _$parent10 = _$temp;var _node9 = { "attrs": {}, "tagName": "div", "sid": 7 };_node9.children = [];_node9.attrSize = 1;_node9.attrHash = 1532757002;_node9.attrs["w-class"] = "balance-value";_$temp = _node9;{
							var _$parent11 = _$temp;_addText(it1.currencyUnitSymbol, _$parent11);
						}_$temp = _node9;{
							var _$parent12 = _$temp;_addText(it1.balanceValue, _$parent12);
						}_chFunc(_node9);_$parent10.children.push(_node9);
					}_chFunc(_node7);_$parent7.children.push(_node7);
				}if (it1.canConvert) {
					_$temp = _node5;{
						var _$parent13 = _$temp;var _node10 = { "attrs": {}, "tagName": "div", "sid": 8 };_node10.children = [];_node10.attrSize = 2;_node10.attrHash = 3356756753;_node10.attrs["w-class"] = "btn-exchange";_node10.attrs["on-tap"] = "convertCurrencyClick";_$temp = _node10;{
							var _$parent14 = _$temp;_addText(it1.cfgData.tabs[0], _$parent14);
						}_chFunc(_node10);_$parent13.children.push(_node10);
					}
				}_chFunc(_node5);_$parent5.children.push(_node5);
			}_$temp = _node2;{
				var _$parent15 = _$temp;var _node11 = { "attrs": {}, "tagName": "div", "sid": 9 };_node11.children = [];_node11.attrSize = 1;_node11.attrHash = 2324204331;_node11.attrs["w-class"] = "operating";_$temp = _node11;{
					var _$parent16 = _$temp;var _node12 = { "attrs": {}, "tagName": "div", "sid": 10 };_node12.children = [];_node12.attrSize = 2;_node12.attrHash = 281941336;_node12.attrs["w-class"] = "operating-item";_node12.attrs["on-tap"] = "doTransferClick";_$temp = _node12;{
						var _$parent17 = _$temp;var _node13 = { "attrs": {}, "tagName": "img", "sid": 11 };_node13.children = [];_node13.childHash = 0;_node13.attrSize = 2;_node13.attrHash = 3210676121;_node13.attrs["src"] = "../../../res/image/transfer.png";_node13.attrs["w-class"] = "icon";_$parent17.children.push(_node13);
					}_$temp = _node12;{
						var _$parent18 = _$temp;var _node14 = { "attrs": {}, "tagName": "span", "sid": 12 };_node14.children = [];_node14.attrHash = 0;_$temp = _node14;{
							var _$parent19 = _$temp;_addText(it1.cfgData.tabs[1], _$parent19);
						}_chFunc(_node14);_$parent18.children.push(_node14);
					}_chFunc(_node12);_$parent16.children.push(_node12);
				}_$temp = _node11;{
					var _$parent20 = _$temp;var _node15 = { "attrs": {}, "tagName": "div", "sid": 13 };_node15.children = [];_node15.childHash = 2946814719;_node15.attrSize = 1;_node15.attrHash = 374818280;_node15.attrs["w-class"] = "line";_$parent20.children.push(_node15);
				}_$temp = _node11;{
					var _$parent21 = _$temp;var _node16 = { "attrs": {}, "tagName": "div", "sid": 14 };_node16.children = [];_node16.attrSize = 2;_node16.attrHash = 567769592;_node16.attrs["w-class"] = "operating-item";_node16.attrs["on-tap"] = "doReceiptClick";_$temp = _node16;{
						var _$parent22 = _$temp;var _node17 = { "attrs": {}, "tagName": "img", "sid": 15 };_node17.children = [];_node17.childHash = 0;_node17.attrSize = 2;_node17.attrHash = 1309473459;_node17.attrs["src"] = "../../../res/image/19.png";_node17.attrs["w-class"] = "icon";_$parent22.children.push(_node17);
					}_$temp = _node16;{
						var _$parent23 = _$temp;var _node18 = { "attrs": {}, "tagName": "span", "sid": 16 };_node18.children = [];_node18.attrHash = 0;_$temp = _node18;{
							var _$parent24 = _$temp;_addText(it1.cfgData.tabs[2], _$parent24);
						}_chFunc(_node18);_$parent23.children.push(_node18);
					}_chFunc(_node16);_$parent21.children.push(_node16);
				}_chFunc(_node11);_$parent15.children.push(_node11);
			}_chFunc(_node2);_$parent2.children.push(_node2);
		}_$temp = _node;{
			var _$parent25 = _$temp;var _node19 = { "attrs": {}, "tagName": "div", "sid": 17 };_node19.children = [];_node19.attrSize = 1;_node19.attrHash = 915048845;_node19.attrs["w-class"] = "show-container";_$temp = _node19;{
				var _$parent26 = _$temp;var _node20 = { "attrs": {}, "tagName": "div", "sid": 18 };_node20.children = [];_node20.attrSize = 1;_node20.attrHash = 2438851802;_node20.attrs["w-class"] = "quotes";_$temp = _node20;{
					var _$parent27 = _$temp;_addText(it1.cfgData.tabs[3], _$parent27);
				}_$temp = _node20;{
					var _$parent28 = _$temp;var _node21 = _installText("&nbsp;", 1553561131);;
					_$parent28.children.push(_node21);
				}_$temp = _node20;{
					var _$parent29 = _$temp;_addText(it1.currencyUnitSymbol, _$parent29);
				}_$temp = _node20;{
					var _$parent30 = _$temp;_addText(it1.rate, _$parent30);
				}_$temp = _node20;{
					var _$parent31 = _$temp;var _node22 = _installText("/", 883865250);;
					_$parent31.children.push(_node22);
				}_$temp = _node20;{
					var _$parent32 = _$temp;_addText(it.currencyName, _$parent32);
				}_chFunc(_node20);_$parent26.children.push(_node20);
			}if (it1.redUp) {
				_$temp = _node19;{
					var _$parent33 = _$temp;var _node23 = { "attrs": {}, "tagName": "div", "sid": 19 };_node23.children = [];_node23.attrSize = 1;_node23.attrHash = 2255571891;{
						var _attrvalue = "";_attrvalue += it.gain > 0 ? 'up' : 'down';_attrvalue += "";_node23.attrs["w-class"] = _attrvalue;
					}_node23.attrHash = _hash.nextHash(_node23.attrHash, _calTextHash(_node23.attrs["w-class"]));_$temp = _node23;{
						var _$parent34 = _$temp;_addText(it1.cfgData.tabs[4], _$parent34);
					}_$temp = _node23;{
						var _$parent35 = _$temp;var _node24 = _installText("&nbsp;", 1553561131);;
						_$parent35.children.push(_node24);
					}_$temp = _node23;{
						var _$parent36 = _$temp;_addText(it.gain > 0 ? '+' : '', _$parent36);
					}_$temp = _node23;{
						var _$parent37 = _$temp;_addText(it.gain, _$parent37);
					}_$temp = _node23;{
						var _$parent38 = _$temp;var _node25 = _installText("%", 4257547020);;
						_$parent38.children.push(_node25);
					}_chFunc(_node23);_$parent33.children.push(_node23);
				}
			} else {
				_$temp = _node19;{
					var _$parent39 = _$temp;var _node26 = { "attrs": {}, "tagName": "div", "sid": 20 };_node26.children = [];_node26.attrSize = 1;_node26.attrHash = 2255571891;{
						var _attrvalue2 = "";_attrvalue2 += it.gain > 0 ? 'down' : 'up';_attrvalue2 += "";_node26.attrs["w-class"] = _attrvalue2;
					}_node26.attrHash = _hash.nextHash(_node26.attrHash, _calTextHash(_node26.attrs["w-class"]));_$temp = _node26;{
						var _$parent40 = _$temp;_addText(it1.cfgData.tabs[4], _$parent40);
					}_$temp = _node26;{
						var _$parent41 = _$temp;var _node27 = _installText("&nbsp;", 1553561131);;
						_$parent41.children.push(_node27);
					}_$temp = _node26;{
						var _$parent42 = _$temp;_addText(it.gain > 0 ? '+' : '', _$parent42);
					}_$temp = _node26;{
						var _$parent43 = _$temp;_addText(it.gain, _$parent43);
					}_$temp = _node26;{
						var _$parent44 = _$temp;var _node28 = _installText("%", 4257547020);;
						_$parent44.children.push(_node28);
					}_chFunc(_node26);_$parent39.children.push(_node26);
				}
			}_chFunc(_node19);_$parent25.children.push(_node19);
		}_$temp = _node;{
			var _$parent45 = _$temp;var _node29 = { "attrs": {}, "tagName": "div", "sid": 21 };_node29.children = [];_node29.attrSize = 1;_node29.attrHash = 4252679546;_node29.attrs["w-class"] = "body";_$temp = _node29;{
				var _$parent46 = _$temp;var _node30 = { "attrs": {}, "tagName": "div", "sid": 22 };_node30.children = [];_node30.attrSize = 1;_node30.attrHash = 1331109157;_node30.attrs["w-class"] = "tx-list-container";if (it1.txList.length === 0) {
					_$temp = _node30;{
						var _$parent47 = _$temp;var _node31 = { "attrs": {}, "tagName": "div", "sid": 23 };_node31.children = [];_node31.attrSize = 1;_node31.attrHash = 1587261762;_node31.attrs["w-class"] = "no-recode";_$temp = _node31;{
							var _$parent48 = _$temp;var _node32 = { "attrs": {}, "tagName": "img", "sid": 24 };_node32.children = [];_node32.childHash = 0;_node32.attrSize = 2;_node32.attrHash = 832237403;_node32.attrs["src"] = "../../../res/image/dividend_history_none.png";_node32.attrs["w-class"] = "no-recode-icon";_$parent48.children.push(_node32);
						}_$temp = _node31;{
							var _$parent49 = _$temp;var _node33 = { "attrs": {}, "tagName": "div", "sid": 25 };_node33.children = [];_node33.attrSize = 1;_node33.attrHash = 308010609;_node33.attrs["w-class"] = "no-recode-text";_$temp = _node33;{
								var _$parent50 = _$temp;_addText(it1.cfgData.noneRes, _$parent50);
							}_chFunc(_node33);_$parent49.children.push(_node33);
						}_chFunc(_node31);_$parent47.children.push(_node31);
					}
				}_$temp = _node30;{
					var _$parent51 = _$temp;var _node34 = { "attrs": {}, "tagName": "div", "sid": 26 };_node34.children = [];_node34.attrSize = 1;_node34.attrHash = 660002203;_node34.attrs["w-class"] = "tx-list";{
						var _$i = 0;
						for (var _iterator = it1.txList, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
							var _ref;

							if (_isArray) {
								if (_i >= _iterator.length) break;
								_ref = _iterator[_i++];
							} else {
								_i = _iterator.next();
								if (_i.done) break;
								_ref = _i.value;
							}

							var v = _ref;
							var i = _$i++;_$temp = _node34;{
								var _$parent52 = _$temp;var _node35 = { "attrs": {}, "tagName": "div", "sid": 27 };_node35.children = [];_node35.attrSize = 1;_node35.attrHash = 1363181170;{
									var _attrvalue3 = "";_attrvalue3 += "txListItemClick(e,";_attrvalue3 += i;_attrvalue3 += ")";_node35.attrs["on-tap"] = _attrvalue3;
								}_node35.attrHash = _hash.nextHash(_node35.attrHash, _calTextHash(_node35.attrs["on-tap"]));_$temp = _node35;{
									var _$parent53 = _$temp;var _node36 = { "attrs": {}, "tagName": "app-components-fourParaImgItem-fourParaImgItem", "sid": 28 };_node36.hasChild = false;_node36.child = null;_node36.attrHash = 0;_$temp = _node36;{
										var _$parent54 = _$temp;var _node37 = {}; //jpair pre

										_node37["name"] = v.txTypeShow;
										//jpair suf
										//jpair pre

										_node37["data"] = v.pay;
										//jpair suf
										//jpair pre

										_node37["time"] = v.TimeShow;
										//jpair suf
										//jpair pre

										_node37["describe"] = v.statusShow;
										//jpair suf
										//jpair pre

										{
											var _jvalue2 = "";
											_jvalue2 += "../../res/image/";_jvalue2 += v.txType === 2 ? "receive_icon.png" : "transfer_icon.png";_jvalue2 += "";
											//jpair suf

											_node37["img"] = _jvalue2;
										}
										_addJson(_node37, _$parent54);
									}_chFunc(_node36);_$parent53.children.push(_node36);
								}_chFunc(_node35);_$parent52.children.push(_node35);
							}
						}
					}_chFunc(_node34);_$parent51.children.push(_node34);
				}_chFunc(_node30);_$parent46.children.push(_node30);
			}_chFunc(_node29);_$parent45.children.push(_node29);
		}_chFunc(_node);return _node;
	}
});