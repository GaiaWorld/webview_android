(_$defineTpl("pi/components/navmenu/navmenu",function(a,t,p,r,n,e,k,x,s,i,y){return function(a,t,r){var n={attrs:{},tagName:"ul",sid:0,children:[],attrSize:3,attrHash:1540423300},e="";e+="nav-menu nav-menu--",e+="horizontal"==t.mod?"horizontal":"vertical",e+="",n.attrs.class=e,n.attrHash=p.nextHash(n.attrHash,k(n.attrs.class));var s="";s+="horizontal"==t.mod?"doClick1":"doClick",s+="",n.attrs["ev-navmenu-click"]=s,n.attrHash=p.nextHash(n.attrHash,k(n.attrs["ev-navmenu-click"]));var i="";i+="min-width: 240px; width:",i+="horizontal"==t.mod?"auto":"240px",i+="; ",n.attrs.style=i,n.attrHash=p.nextHash(n.attrHash,k(n.attrs.style));var l=0,h=t.arr,o=Array.isArray(h),u=0;for(h=o?h:h[Symbol.iterator]();;){var d;if(o){if(u>=h.length)break;d=h[u++]}else{if((u=h.next()).done)break;d=u.value}var m=d;l++;if(m.submenu){m.mod=t.mod;var v=n,c={attrs:{},tagName:"nav_submenu$",sid:1};c.hasChild=!1,c.child=null,c.attrHash=0,x(m,c),y(c),v.children.push(c)}else{var H=n,f={attrs:{},tagName:"navmenu_item$",sid:2};f.hasChild=!1,f.child=null,f.attrHash=0,x(m,f),y(f),H.children.push(f)}}return y(n),n}}));