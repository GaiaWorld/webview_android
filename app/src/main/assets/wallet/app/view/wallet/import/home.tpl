(function (_cfg, it, it1) {
	var _$temp = void 0,
	    node = void 0;_$temp = node;{
		var _$parent = _$temp;var _node = { "attrs": {}, "tagName": "div", "sid": 0 };_node.children = [];_node.attrSize = 4;_node.attrHash = 195180245;_node.attrs["class"] = "new-page";_node.attrs["w-class"] = "new-page";_node.attrs["ev-back-click"] = "backPrePage";_node.attrs["ev-import-success"] = "importSuccess";_$temp = _node;{
			var _$parent2 = _$temp;var _node2 = { "attrs": {}, "tagName": "app-components1-topBar-topBar", "sid": 1 };_node2.hasChild = false;_node2.child = null;_node2.childHash = 3401996685;_node2.attrHash = 0;_$temp = _node2;{
				var _$parent3 = _$temp;var _node3 = {}; //jpair pre

				{
					var jvalue = "";
					jvalue = "导入";
					//jpair suf

					_node3["title"] = jvalue;
				}
				//jpair pre

				{
					var _jvalue = "";
					_jvalue = "#fff";
					//jpair suf

					_node3["background"] = _jvalue;
				}
				_addJson(_node3, _$parent3);
			}_$parent2.children.push(_node2);
		}_$temp = _node;{
			var _$parent4 = _$temp;var _node4 = { "attrs": {}, "tagName": "app-components1-tabs-tabs", "sid": 2 };_node4.hasChild = false;_node4.child = null;_node4.attrHash = 0;_$temp = _node4;{
				var _$parent5 = _$temp;var _node5 = {}; //jpair pre

				_node5["list"] = it1.tabList;
				//jpair suf
				_addJson(_node5, _$parent5);
			}_chFunc(_node4);_$parent4.children.push(_node4);
		}_chFunc(_node);return _node;
	}
});