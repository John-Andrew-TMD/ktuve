(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{mC8E:function(e,t,a){"use strict";a.r(t);var r=a("mK77"),n=a.n(r),o=(a("EdcA"),a("rKq6")),s=a("Ico4"),c=a.n(s),p=a("BhiI"),u=a("32hC");t["default"]={namespace:"chartModel",state:{listData:[],selectedRowKeys:[],selectedRows:[],showModal:!1,formData:{},editType:"create",categoryList:[],showReportPreview:!1,mode:"eidt",searchText:[""]},subscriptions:{setup:function(e){var t=e.dispatch,a=e.history;a.listen(function(e){var a=e.pathname,r=e.query;if(r&&r.searchText&&"/report/template"===a)return t({type:"stateChange",payload:{mode:"/report/report"===a?"preview":"edit",searchText:[r.searchText]}}),void t({type:"queryList"});"/report/chart"!==a&&"/report/template"!==a&&"/report/report"!==a||(t({type:"stateChange",payload:{mode:"/report/report"===a?"preview":"edit",searchText:[""]}}),t({type:"queryList"}))})}},effects:{queryList:c.a.mark(function e(t,a){var r,n,o;return c.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,r=a.call,n=a.put,a.select,e.next=4,r(p["a"].queryChartOutLine);case 4:return o=e.sent,e.next=7,n({type:"stateChange",payload:{listData:o}});case 7:case"end":return e.stop()}},e)}),delete:c.a.mark(function e(t,a){var r,n,s,u;return c.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,n=a.call,s=a.put,u=r.map(function(e){return{uuId:"".concat(e)}}),e.next=5,n(p["a"].deleteChart,u);case 5:return o["a"].success("\u5220\u9664\u6210\u529f"),e.next=8,s({type:"selectRowChange",payload:{selectedRows:[],selectedRowKeys:[]}});case 8:return e.next=10,s({type:"queryList"});case 10:case"end":return e.stop()}},e)}),modalHandleOk:c.a.mark(function e(t,a){var r,n,o,s;return c.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,n=t.callback,void 0===n?function(){}:n,o=a.call,s=a.put,e.next=4,s({type:"stateChange",payload:{formData:r.formData,selectedRowKeys:[],selectedRows:[]}});case 4:if("edit"!==r.editType){e.next=9;break}return e.next=7,o(p["a"].updateChart,[r.formData]);case 7:e.next=11;break;case 9:return e.next=11,o(p["a"].createChart,[r.formData]);case 11:return e.next=13,s({type:"hideModal"});case 13:return e.next=15,s({type:"queryList"});case 15:case"end":return e.stop()}},e)}),showConfig:c.a.mark(function e(t,a){var r,n,o,s,i,d,l,y,h;return c.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(r=t.payload,n=a.call,o=a.put,s=r.formData,i=r.editType,d=[{}],"edit"!==i&&"copy"!==i){e.next=8;break}return e.next=7,n(p["a"].queryChart,{uuId:s.uuId});case 7:d=e.sent;case 8:return e.next=10,n(u["a"].queryCategory,{param:"widget"});case 10:return l=e.sent,y=l.resultData.filter(function(e){return"report"===e.type}),h=y||[],e.next=15,o({type:"stateChange",payload:{showModal:!0,categoryList:h,editType:i,formData:d[0]}});case 15:case"end":return e.stop()}},e)})},reducers:{stateChange:function(e,t){var a=t.payload;return n()({},e,a)},showModal:function(e,t){var a=t.payload,r=void 0===a?{}:a,o={showModal:!0};return n()({},e,o,r)},hideModal:function(e,t){t.payload;var a={showModal:!1};return n()({},e,a)},selectRowChange:function(e,t){var a=t.payload;return n()({},e,a)}}}}}]);