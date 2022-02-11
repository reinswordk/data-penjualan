/*
 Highcharts Gantt JS v8.0.0 (2019-12-10)

 GridAxis

 (c) 2016-2019 Lars A. V. Cabrera

 License: www.highcharts.com/license
*/
(function(f){"object"===typeof module&&module.exports?(f["default"]=f,module.exports=f):"function"===typeof define&&define.amd?define("highcharts/modules/grid-axis",["highcharts"],function(l){f(l);f.Highcharts=l;return f}):f("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(f){function l(f,q,e,l){f.hasOwnProperty(q)||(f[q]=l.apply(null,e))}f=f?f._modules:{};l(f,"parts-gantt/GridAxis.js",[f["parts/Globals.js"],f["parts/Utilities.js"]],function(f,q){var e=q.defined,l=q.erase,B=q.isArray,
v=q.isNumber,w=q.pick,C=q.wrap,u=f.addEvent,F=f.dateFormat,p=function(a){return q.isObject(a,!0)},x=f.merge,G=f.Chart,k=f.Axis,H=f.Tick,I=function(a){var b=a.options;b.labels||(b.labels={});b.labels.align=w(b.labels.align,"center");a.categories||(b.showLastLabel=!1);a.labelRotation=0;b.labels.rotation=0},y={top:0,right:1,bottom:2,left:3,0:"top",1:"right",2:"bottom",3:"left"};k.prototype.isOuterAxis=function(){var a=this,b=a.columnIndex,c=a.linkedParent&&a.linkedParent.columns||a.columns,g=b?a.linkedParent:
a,d=-1,m=0;a.chart[a.coll].forEach(function(b,c){b.side!==a.side||b.options.isInternal||(m=c,b===g&&(d=c))});return m===d&&(v(b)?c.length===b:!0)};k.prototype.getMaxLabelDimensions=function(a,b){var c={width:0,height:0};b.forEach(function(b){b=a[b];if(p(b)){var d=p(b.label)?b.label:{};b=d.getBBox?d.getBBox().height:0;d.textStr&&!v(d.textPxLength)&&(d.textPxLength=d.getBBox().width);d=v(d.textPxLength)?Math.round(d.textPxLength):0;c.height=Math.max(b,c.height);c.width=Math.max(d,c.width)}});return c};
f.dateFormats.W=function(a){a=new Date(a);a.setHours(0,0,0,0);a.setDate(a.getDate()-(a.getDay()||7));var b=new Date(a.getFullYear(),0,1);return Math.ceil(((a-b)/864E5+1)/7)};f.dateFormats.E=function(a){return F("%a",a,!0).charAt(0)};u(H,"afterGetLabelPosition",function(a){var b=this.label,c=this.axis,g=c.reversed,d=c.chart,m=c.options,f=m&&p(m.grid)?m.grid:{};m=c.options.labels;var z=m.align,h=y[c.side],n=a.tickmarkOffset,r=c.tickPositions,A=this.pos-n;r=v(r[a.index+1])?r[a.index+1]-n:c.max+n;var t=
c.tickSize("tick",!0);n=B(t)?t[0]:0;t=t&&t[1]/2;if(!0===f.enabled){if("top"===h){f=c.top+c.offset;var e=f-n}else"bottom"===h?(e=d.chartHeight-c.bottom+c.offset,f=e+n):(f=c.top+c.len-c.translate(g?r:A),e=c.top+c.len-c.translate(g?A:r));"right"===h?(h=d.chartWidth-c.right+c.offset,g=h+n):"left"===h?(g=c.left+c.offset,h=g-n):(h=Math.round(c.left+c.translate(g?r:A))-t,g=Math.round(c.left+c.translate(g?A:r))-t);this.slotWidth=g-h;a.pos.x="left"===z?h:"right"===z?g:h+(g-h)/2;a.pos.y=e+(f-e)/2;d=d.renderer.fontMetrics(m.style.fontSize,
b.element);b=b.getBBox().height;m.useHTML?a.pos.y+=d.b+-(b/2):(b=Math.round(b/d.h),a.pos.y+=(d.b-(d.h-d.f))/2+-((b-1)*d.h/2));a.pos.x+=c.horiz&&m.x||0}});u(k,"afterTickSize",function(a){var b=this.defaultLeftAxisOptions,c=this.horiz,g=this.options.grid;g=void 0===g?{}:g;var d=this.maxLabelDimensions;g.enabled&&(b=2*Math.abs(b.labels.x),c=c?g.cellHeight||b+d.height:b+d.width,B(a.tickSize)?a.tickSize[0]=c:a.tickSize=[c])});u(k,"afterGetTitlePosition",function(a){var b=this.options;if(!0===(b&&p(b.grid)?
b.grid:{}).enabled){var c=this.axisTitle,g=c&&c.getBBox().width,d=this.horiz,f=this.left,D=this.top,z=this.width,h=this.height,n=b.title;b=this.opposite;var r=this.offset,e=this.tickSize()||[0],t=n.x||0,k=n.y||0,l=w(n.margin,d?5:10);c=this.chart.renderer.fontMetrics(n.style&&n.style.fontSize,c).f;e=(d?D+h:f)+e[0]/2*(b?-1:1)*(d?1:-1)+(this.side===y.bottom?c:0);a.titlePosition.x=d?f-g/2-l+t:e+(b?z:0)+r+t;a.titlePosition.y=d?e-(b?h:0)+(b?c:-c)/2+r+k:D-l+k}});C(k.prototype,"unsquish",function(a){var b=
this.options;return!0===(b&&p(b.grid)?b.grid:{}).enabled&&this.categories?this.tickInterval:a.apply(this,Array.prototype.slice.call(arguments,1))});u(k,"afterSetOptions",function(a){var b=this.options;a=a.userOptions;var c=b&&p(b.grid)?b.grid:{};if(!0===c.enabled){var g=x(!0,{className:"highcharts-grid-axis "+(a.className||""),dateTimeLabelFormats:{hour:{list:["%H:%M","%H"]},day:{list:["%A, %e. %B","%a, %e. %b","%E"]},week:{list:["Week %W","W%W"]},month:{list:["%B","%b","%o"]}},grid:{borderWidth:1},
labels:{padding:2,style:{fontSize:"13px"}},margin:0,title:{text:null,reserveSpace:!1,rotation:0},units:[["millisecond",[1,10,100]],["second",[1,10]],["minute",[1,5,15]],["hour",[1,6]],["day",[1]],["week",[1]],["month",[1]],["year",null]]},a);"xAxis"===this.coll&&(e(a.linkedTo)&&!e(a.tickPixelInterval)&&(g.tickPixelInterval=350),e(a.tickPixelInterval)||!e(a.linkedTo)||e(a.tickPositioner)||e(a.tickInterval)||(g.tickPositioner=function(a,b){var c=this.linkedParent&&this.linkedParent.tickPositions&&this.linkedParent.tickPositions.info;
if(c){var d,h=g.units;for(d=0;d<h.length;d++)if(h[d][0]===c.unitName){var m=d;break}if(h[m+1]){var e=h[m+1][0];var k=(h[m+1][1]||[1])[0]}else"year"===c.unitName&&(e="year",k=10*c.count);c=f.timeUnits[e];this.tickInterval=c*k;return this.getTimeTicks({unitRange:c,count:k,unitName:e},a,b,this.options.startOfWeek)}}));x(!0,this.options,g);this.horiz&&(b.minPadding=w(a.minPadding,0),b.maxPadding=w(a.maxPadding,0));v(b.grid.borderWidth)&&(b.tickWidth=b.lineWidth=c.borderWidth)}});u(k,"afterSetAxisTranslation",
function(){var a=this.options,b=a&&p(a.grid)?a.grid:{},c=this.tickPositions&&this.tickPositions.info,g=this.userOptions.labels||{};this.horiz&&(!0===b.enabled&&this.series.forEach(function(a){a.options.pointRange=0}),c&&(!1===a.dateTimeLabelFormats[c.unitName].range||1<c.count)&&!e(g.align)&&(a.labels.align="left",e(g.x)||(a.labels.x=3)))});u(k,"trimTicks",function(){var a=this.options,b=a&&p(a.grid)?a.grid:{},c=this.categories,g=this.tickPositions,d=g[0],f=g[g.length-1],e=this.linkedParent&&this.linkedParent.min||
this.min,k=this.linkedParent&&this.linkedParent.max||this.max,h=this.tickInterval;!0!==b.enabled||c||!this.horiz&&!this.isLinked||(d<e&&d+h>e&&!a.startOnTick&&(g[0]=e),f>k&&f-h<k&&!a.endOnTick&&(g[g.length-1]=k))});u(k,"afterRender",function(){var a=this.options,b=a&&p(a.grid)?a.grid:{},c=this.chart.renderer;if(!0===b.enabled){this.maxLabelDimensions=this.getMaxLabelDimensions(this.ticks,this.tickPositions);this.rightWall&&this.rightWall.destroy();if(this.isOuterAxis()&&this.axisLine){var f=a.lineWidth;
if(f){var d=this.getLinePath(f);var e=d.indexOf("M")+1;var k=d.indexOf("L")+1;b=d.indexOf("M")+2;var l=d.indexOf("L")+2;var h=(this.tickSize("tick")[0]-1)*(this.side===y.top||this.side===y.left?-1:1);this.horiz?(d[b]+=h,d[l]+=h):(d[e]+=h,d[k]+=h);this.axisLineExtra?this.axisLineExtra.animate({d:d}):(this.axisLineExtra=c.path(d).attr({zIndex:7}).addClass("highcharts-axis-line").add(this.axisGroup),c.styledMode||this.axisLineExtra.attr({stroke:a.lineColor,"stroke-width":f}));this.axisLine[this.showAxis?
"show":"hide"](!0)}}(this.columns||[]).forEach(function(a){a.render()})}});var E={afterGetOffset:function(){(this.columns||[]).forEach(function(a){a.getOffset()})},afterInit:function(){var a=this.chart,b=this.userOptions,c=this.options;c=c&&p(c.grid)?c.grid:{};c.enabled&&(I(this),C(this,"labelFormatter",function(a){var b=this.axis,c=b.tickPositions,d=this.value,e=(b.isLinked?b.linkedParent:b).series[0],g=d===c[0];c=d===c[c.length-1];e=e&&f.find(e.options.data,function(a){return a[b.isXAxis?"x":"y"]===
d});this.isFirst=g;this.isLast=c;this.point=e;return a.call(this)}));if(c.columns)for(var g=this.columns=[],d=this.columnIndex=0;++d<c.columns.length;){var e=x(b,c.columns[c.columns.length-d-1],{linkedTo:0,type:"category"});delete e.grid.columns;e=new k(this.chart,e,!0);e.isColumn=!0;e.columnIndex=d;l(a.axes,e);l(a[this.coll],e);g.push(e)}},afterSetOptions:function(a){a=(a=a.userOptions)&&p(a.grid)?a.grid:{};var b=a.columns;a.enabled&&b&&x(!0,this.options,b[b.length-1])},afterSetScale:function(){(this.columns||
[]).forEach(function(a){a.setScale()})},destroy:function(a){(this.columns||[]).forEach(function(b){b.destroy(a.keepEvents)})},init:function(a){var b=(a=a.userOptions)&&p(a.grid)?a.grid:{};b.enabled&&e(b.borderColor)&&(a.tickColor=a.lineColor=b.borderColor)}};Object.keys(E).forEach(function(a){u(k,a,E[a])});u(G,"afterSetChartSize",function(){this.axes.forEach(function(a){(a.columns||[]).forEach(function(a){a.setAxisSize();a.setAxisTranslation()})})})});l(f,"masters/modules/grid-axis.src.js",[],function(){})});
//# sourceMappingURL=grid-axis.js.map