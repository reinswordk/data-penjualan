/*
 Highcharts JS v8.0.0 (2019-12-10)

 X-range series

 (c) 2010-2019 Torstein Honsi, Lars A. V. Cabrera

 License: www.highcharts.com/license
*/
(function(b){"object"===typeof module&&module.exports?(b["default"]=b,module.exports=b):"function"===typeof define&&define.amd?define("highcharts/modules/xrange",["highcharts"],function(h){b(h);b.Highcharts=h;return b}):b("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(b){function h(b,g,A,h){b.hasOwnProperty(g)||(b[g]=h.apply(null,A))}b=b?b._modules:{};h(b,"modules/xrange.src.js",[b["parts/Globals.js"],b["parts/Utilities.js"]],function(b,g){var h=g.clamp,B=g.correctFloat,C=g.defined,
p=g.isNumber,u=g.isObject,v=g.pick;g=b.addEvent;var w=b.color,x=b.seriesTypes.column,y=b.find,r=b.merge,D=b.seriesType,E=b.Axis,t=b.Point,F=b.Series;D("xrange","column",{colorByPoint:!0,dataLabels:{formatter:function(){var a=this.point.partialFill;u(a)&&(a=a.amount);if(p(a)&&0<a)return B(100*a)+"%"},inside:!0,verticalAlign:"middle"},tooltip:{headerFormat:'<span style="font-size: 10px">{point.x} - {point.x2}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.yCategory}</b><br/>'},
borderRadius:3,pointRange:0},{type:"xrange",parallelArrays:["x","x2","y"],requireSorting:!1,animate:b.seriesTypes.line.prototype.animate,cropShoulder:1,getExtremesFromAll:!0,autoIncrement:b.noop,buildKDTree:b.noop,getColumnMetrics:function(){function a(){f.series.forEach(function(a){var c=a.xAxis;a.xAxis=a.yAxis;a.yAxis=c})}var f=this.chart;a();var d=x.prototype.getColumnMetrics.call(this);a();return d},cropData:function(a,f,d,b){f=F.prototype.cropData.call(this,this.x2Data,f,d,b);f.xData=a.slice(f.start,
f.end);return f},findPointIndex:function(a){var f=this.cropped,d=this.cropStart,b=this.points,c=a.id;if(c)var e=(e=y(b,function(a){return a.id===c}))?e.index:void 0;"undefined"===typeof e&&(e=(e=y(b,function(c){return c.x===a.x&&c.x2===a.x2&&!c.touched}))?e.index:void 0);f&&p(e)&&p(d)&&e>=d&&(e-=d);return e},translatePoint:function(a){var f=this.xAxis,d=this.yAxis,b=this.columnMetrics,c=this.options,e=c.minPointLength||0,m=a.plotX,g=v(a.x2,a.x+(a.len||0)),k=f.translate(g,0,0,0,1);g=Math.abs(k-m);
var n=this.chart.inverted,z=v(c.borderWidth,1)%2/2,l=b.offset,q=Math.round(b.width);e&&(e-=g,0>e&&(e=0),m-=e/2,k+=e/2);m=Math.max(m,-10);k=h(k,-10,f.len+10);C(a.options.pointWidth)&&(l-=(Math.ceil(a.options.pointWidth)-q)/2,q=Math.ceil(a.options.pointWidth));c.pointPlacement&&p(a.plotY)&&d.categories&&(a.plotY=d.translate(a.y,0,1,0,1,c.pointPlacement));a.shapeArgs={x:Math.floor(Math.min(m,k))+z,y:Math.floor(a.plotY+l)+z,width:Math.round(Math.abs(k-m)),height:q,r:this.options.borderRadius};c=a.shapeArgs.x;
e=c+a.shapeArgs.width;0>c||e>f.len?(c=h(c,0,f.len),e=h(e,0,f.len),k=e-c,a.dlBox=r(a.shapeArgs,{x:c,width:e-c,centerX:k?k/2:null})):a.dlBox=null;c=a.tooltipPos;e=n?1:0;k=n?0:1;c[e]=h(c[e]+g/2*(f.reversed?-1:1)*(n?-1:1),0,f.len-1);c[k]=h(c[k]+b.width/2*(n?1:-1),0,d.len-1);if(b=a.partialFill)u(b)&&(b=b.amount),p(b)||(b=0),d=a.shapeArgs,a.partShapeArgs={x:d.x,y:d.y,width:d.width,height:d.height,r:this.options.borderRadius},m=Math.max(Math.round(g*b+a.plotX-m),0),a.clipRectArgs={x:f.reversed?d.x+g-m:d.x,
y:d.y,width:m,height:d.height}},translate:function(){x.prototype.translate.apply(this,arguments);this.points.forEach(function(a){this.translatePoint(a)},this)},drawPoint:function(a,b){var d=this.options,f=this.chart.renderer,c=a.graphic,e=a.shapeType,g=a.shapeArgs,h=a.partShapeArgs,k=a.clipRectArgs,n=a.partialFill,p=d.stacking&&!d.borderRadius,l=a.state,q=d.states[l||"normal"]||{},t="undefined"===typeof l?"attr":b;l=this.pointAttribs(a,l);q=v(this.chart.options.chart.animation,q.animation);if(a.isNull)c&&
(a.graphic=c.destroy());else{if(c)c.rect[b](g);else a.graphic=c=f.g("point").addClass(a.getClassName()).add(a.group||this.group),c.rect=f[e](r(g)).addClass(a.getClassName()).addClass("highcharts-partfill-original").add(c);h&&(c.partRect?(c.partRect[b](r(h)),c.partialClipRect[b](r(k))):(c.partialClipRect=f.clipRect(k.x,k.y,k.width,k.height),c.partRect=f[e](h).addClass("highcharts-partfill-overlay").add(c).clip(c.partialClipRect)));this.chart.styledMode||(c.rect[b](l,q).shadow(d.shadow,null,p),h&&(u(n)||
(n={}),u(d.partialFill)&&(n=r(n,d.partialFill)),a=n.fill||w(l.fill).brighten(-.3).get()||w(a.color||this.color).brighten(-.3).get(),l.fill=a,c.partRect[t](l,q).shadow(d.shadow,null,p)))}},drawPoints:function(){var a=this,b=a.getAnimationVerb();a.points.forEach(function(f){a.drawPoint(f,b)})},getAnimationVerb:function(){return this.chart.pointCount<(this.options.animationLimit||250)?"animate":"attr"}},{resolveColor:function(){var a=this.series;if(a.options.colorByPoint&&!this.options.color){var b=
a.options.colors||a.chart.options.colors;var d=this.y%(b?b.length:a.chart.options.chart.colorCount);b=b&&b[d];a.chart.styledMode||(this.color=b);this.options.colorIndex||(this.colorIndex=d)}else this.color||(this.color=a.color)},init:function(){t.prototype.init.apply(this,arguments);this.y||(this.y=0);return this},setState:function(){t.prototype.setState.apply(this,arguments);this.series.drawPoint(this,this.series.getAnimationVerb())},getLabelConfig:function(){var a=t.prototype.getLabelConfig.call(this),
b=this.series.yAxis.categories;a.x2=this.x2;a.yCategory=this.yCategory=b&&b[this.y];return a},tooltipDateKeys:["x","x2"],isValid:function(){return"number"===typeof this.x&&"number"===typeof this.x2}});g(E,"afterGetSeriesExtremes",function(){var a=this.series,b;if(this.isXAxis){var d=v(this.dataMax,-Number.MAX_VALUE);a.forEach(function(a){a.x2Data&&a.x2Data.forEach(function(a){a>d&&(d=a,b=!0)})});b&&(this.dataMax=d)}});""});h(b,"masters/modules/xrange.src.js",[],function(){})});
//# sourceMappingURL=xrange.js.map