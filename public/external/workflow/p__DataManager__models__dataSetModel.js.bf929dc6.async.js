(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"iR+f":function(e,t,a){"use strict";a.r(t);var r=a("Ico4"),n=a.n(r),s=a("rXjv"),c=a.n(s),u=a("mK77"),o=a.n(u),p=a("BG4o"),d=a.n(p),i=a("WlY1"),l=a("nWk1"),y=a("t3Un");function f(e){return Object(y["b"])("/database/updateCategory",e)}function h(e){return Object(y["b"])("/category/categoryList",e)}var m={updateCategory:f,queryCategory:h},w=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t={};return e.forEach(function(e){t[e.uuId]={name:e.name,type:e.type}}),t},x=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;return e.map(function(e){var a=e.param,r=d()(e,["param"]),n=JSON.parse(a),s=n.type;return o()({type:s,param:a,dsName:t[e.dsUUId]?t[e.dsUUId].name:null},r)})};t["default"]={namespace:"dataSetModel",state:{listData:[],dataSourceMap:{},dataSourceList:[],categoryList:[],selectedRowKeys:[],selectedRows:[],showModal:!1,showAddModal:!1,detailInfo:{},editType:"create",setType:"query",columns:[],searchText:[""]},subscriptions:{setup:function(e){var t=e.dispatch,a=e.history;a.listen(function(e){var a=e.pathname;t({type:"stateChange",payload:{searchText:[""]}}),"/datamanager/dataset"===a&&(t({type:"stateChange",payload:{setType:"query",searchText:[""]}}),t({type:"queryList"})),"/report/functionset"===a&&(t({type:"stateChange",payload:{setType:"operate",searchText:[""]}}),t({type:"queryList"}))})}},effects:{queryList:n.a.mark(function e(t,a){var r,s,u,o,p,d,y,f;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a.call,r=a.put,s=a.select,e.next=4,s(function(e){return e.dataSetModel});case 4:return u=e.sent,o={categoryName:u.setType},e.next=8,i["a"].queryDataset(o);case 8:return p=e.sent,e.next=11,l["a"].queryDatasource();case 11:return d=e.sent,y=[{uuId:-1,name:"service\u6570\u636e\u6e90",dsName:"service\u6570\u636e\u6e90",sourceType:"service"},{uuId:-2,name:"\u672c\u5730\u6570\u636e\u6e90",dsName:"\u672c\u5730\u6570\u636e\u6e90",sourceType:"jdbc"}].concat(c()(d)),f=w(y||[]),e.next=16,r({type:"stateChange",payload:{listData:x(p||[],f),selectedRowKeys:[],selectedRows:[],dataSourceMap:f}});case 16:case"end":return e.stop()}},e)}),queryCategoryList:n.a.mark(function e(t,a){var r,s,c,u,o,p;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a.call,r=a.put,s=a.select,e.next=4,s(function(e){return e.dataSetModel});case 4:return c=e.sent,u="query"===c.setType?"dataset_query":"dataset_operate",e.next=8,m.queryCategory({param:u});case 8:return o=e.sent,p=o.resultData.filter(function(e){return"dataset"===e.type})||[],e.next=12,r({type:"stateChange",payload:{categoryList:p}});case 12:case"end":return e.stop()}},e)}),delete:n.a.mark(function e(t,a){var r,s,c,u;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,c=a.put,u=r.map(function(e){return{uuId:"".concat(e)}}),e.next=5,s(i["a"].deleteDataset,u);case 5:return e.next=7,c({type:"stateChange",payload:{selectedRowKeys:[],selectedRows:[]}});case 7:case"end":return e.stop()}},e)}),test:n.a.mark(function e(t,a){var r,s,c,u,o,p,d,l;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=t.callback,c=void 0===s?function(){}:s,u=a.call,o=a.put,p=a.select,e.next=4,p(function(e){return e.dataSetModel});case 4:return d=e.sent,r.categoryName=d.setType,e.next=8,u(i["a"].testDatasetSql,r);case 8:return l=e.sent,e.next=11,o({type:"stateChange",payload:{columns:l}});case 11:c();case 12:case"end":return e.stop()}},e)}),insert:n.a.mark(function e(t,a){var r,s,c,u;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,c=a.put,u=r.formData,e.next=5,s(i["a"].createDataset,[u]);case 5:return e.next=7,c({type:"queryList"});case 7:return e.next=9,c({type:"stateChange",payload:{showAddModal:!1,selectedRows:[],selectedRowKeys:[]}});case 9:case"end":return e.stop()}},e)}),update:n.a.mark(function e(t,a){var r,s,c,u,p,d,l,y,f,h,m,w;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=t.callback,c=void 0===s?function(){}:s,u=a.call,p=a.put,d=a.select,e.next=4,d(function(e){return e.dataSetModel});case 4:return l=e.sent,y=r.param,f=r.testPara,h=r.formData,f.categoryName=l.setType,e.next=9,u(i["a"].testDatasetSql,f);case 9:if(m=e.sent,w=o()({},h),y.columns=m,w.param=JSON.stringify(y),w.categoryName=l.setType,"edit"!==l.editType){e.next=20;break}return w.uuId=l.detailInfo.uuId,e.next=18,u(i["a"].updateDataset,[w]);case 18:e.next=22;break;case 20:return e.next=22,u(i["a"].createDataset,[w]);case 22:return c(),e.next=25,p({type:"queryList"});case 25:return e.next=27,p({type:"stateChange",payload:{columns:m,showModal:!1}});case 27:case"end":return e.stop()}},e)}),queryDatasourceList:n.a.mark(function e(t,a){var r,s,u,p;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,a.call,s=a.put,e.next=4,l["a"].queryDatasource();case 4:return u=e.sent,p=[{uuId:-1,name:"service\u6570\u636e\u6e90",dsName:"service\u6570\u636e\u6e90",sourceType:"service"},{uuId:-2,name:"\u672c\u5730\u6570\u636e\u6e90",dsName:"\u672c\u5730\u6570\u636e\u6e90",sourceType:"jdbc"}].concat(c()(u)),e.next=8,s({type:"stateChange",payload:o()({dataSourceList:p},r)});case 8:case"end":return e.stop()}},e)})},reducers:{stateChange:function(e,t){var a=t.payload;return o()({},e,a)}}}}}]);