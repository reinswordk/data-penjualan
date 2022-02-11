/*
 Highcharts JS v8.0.0 (2019-12-10)

 (c) 2009-2019 Sebastian Bochan, Rafal Sebestjanski

 License: www.highcharts.com/license
*/
(function(b){"object"===typeof module&&module.exports?(b["default"]=b,module.exports=b):"function"===typeof define&&define.amd?define("highcharts/modules/dumbbell",["highcharts"],function(c){b(c);b.Highcharts=c;return b}):b("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(b){function c(b,f,c,k){b.hasOwnProperty(f)||(b[f]=k.apply(null,c))}b=b?b._modules:{};c(b,"modules/dumbbell.src.js",[b["parts/Globals.js"]],function(b){var f=b.pick,c=b.seriesType,k=b.seriesTypes,t=b.Series.prototype,
m=k.arearange.prototype,q=k.column.prototype,n=m.pointClass.prototype;c("dumbbell","arearange",{trackByArea:!1,fillColor:"none",lineWidth:0,pointRange:1,connectorWidth:1,stickyTracking:!1,groupPadding:.2,pointPadding:.1,lowColor:"#333333",states:{hover:{lineWidthPlus:0,connectorWidthPlus:1,halo:!1}}},{trackerGroups:["group","markerGroup","dataLabelsGroup"],drawTracker:b.TrackerMixin.drawTrackerPoint,drawGraph:b.noop,crispConnector:function(a,b){a[1]===a[4]&&(a[1]=a[4]=Math.floor(a[1])+b%2/2);a[2]===
a[5]&&(a[2]=a[5]=Math.floor(a[2])+b%2/2);return a},crispCol:q.crispCol,getConnectorAttribs:function(a){var r=this.chart,e=a.options,g=this.options,d=this.xAxis,h=this.yAxis,c=f(e.connectorWidth,g.connectorWidth),k=f(e.connectorColor,g.connectorColor,e.color,a.zone?a.zone.color:void 0,a.color),m=f(g.states&&g.states.hover&&g.states.hover.connectorWidthPlus,1),n=f(e.dashStyle,g.dashStyle),p=f(a.plotLow,a.plotY),l=h.toPixels(g.threshold||0,!0);l=f(a.plotHigh,r.inverted?h.len-l:l);a.state&&(c+=m);0>p?
p=0:p>=h.len&&(p=h.len);0>l?l=0:l>=h.len&&(l=h.len);if(0>a.plotX||a.plotX>d.len)c=0;a.upperGraphic&&(d={y:a.y,zone:a.zone},a.y=a.high,a.zone=a.zone?a.getZone():void 0,k=f(e.connectorColor,g.connectorColor,e.color,a.zone?a.zone.color:void 0,a.color),b.extend(a,d));a={d:this.crispConnector(["M",a.plotX,p,"L",a.plotX,l],c)};r.styledMode||(a.stroke=k,a["stroke-width"]=c,n&&(a.dashstyle=n));return a},drawConnector:function(a){var b=f(this.options.animationLimit,250);b=a.connector&&this.chart.pointCount<
b?"animate":"attr";a.connector||(a.connector=this.chart.renderer.path().addClass("highcharts-lollipop-stem").attr({zIndex:-1}).add(this.markerGroup));a.connector[b](this.getConnectorAttribs(a))},getColumnMetrics:function(){var a=q.getColumnMetrics.apply(this,arguments);a.offset+=a.width/2;return a},translatePoint:m.translate,setShapeArgs:k.columnrange.prototype.translate,translate:function(){this.setShapeArgs.apply(this);this.translatePoint.apply(this,arguments);this.points.forEach(function(a){var b=
a.shapeArgs,e=a.pointWidth;a.plotX=b.x;b.x=a.plotX-e/2;a.tooltipPos=null})},seriesDrawPoints:m.drawPoints,drawPoints:function(){var a=this.chart,b=this.points.length,e=this.lowColor=this.options.lowColor,c=0;for(this.seriesDrawPoints.apply(this,arguments);c<b;){var d=this.points[c];this.drawConnector(d);d.upperGraphic&&(d.upperGraphic.element.point=d,d.upperGraphic.addClass("highcharts-lollipop-high"));d.connector.element.point=d;if(d.lowerGraphic){var h=d.zone&&d.zone.color;h=f(d.options.lowColor,
e,d.options.color,h,d.color,this.color);a.styledMode||d.lowerGraphic.attr({fill:h});d.lowerGraphic.addClass("highcharts-lollipop-low")}c++}},markerAttribs:function(){var a=m.markerAttribs.apply(this,arguments);a.x=Math.floor(a.x);a.y=Math.floor(a.y);return a},pointAttribs:function(a,b){var e=t.pointAttribs.apply(this,arguments);"hover"===b&&delete e.fill;return e}},{destroyElements:n.destroyElements,isValid:n.isValid,pointSetState:n.setState,setState:function(){var a=this.series,c=a.chart,e=this.options,
g=f(e.lowColor,a.options.lowColor,e.color,this.zone&&this.zone.color,this.color,a.color),d="attr";this.pointSetState.apply(this,arguments);this.state||(d="animate",this.lowerGraphic&&!c.styledMode&&(this.lowerGraphic.attr({fill:g}),this.upperGraphic&&(c={y:this.y,zone:this.zone},this.y=this.high,this.zone=this.zone?this.getZone():void 0,e=f(this.marker?this.marker.fillColor:void 0,e.color,this.zone?this.zone.color:void 0,this.color),this.upperGraphic.attr({fill:e}),b.extend(this,c))));this.connector[d](a.getConnectorAttribs(this))}})});
c(b,"masters/modules/dumbbell.src.js",[],function(){})});
//# sourceMappingURL=dumbbell.js.map