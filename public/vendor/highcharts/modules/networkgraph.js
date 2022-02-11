/*
 Highcharts JS v8.0.0 (2019-12-10)

 Force directed graph module

 (c) 2010-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(g){"object"===typeof module&&module.exports?(g["default"]=g,module.exports=g):"function"===typeof define&&define.amd?define("highcharts/modules/networkgraph",["highcharts"],function(l){g(l);g.Highcharts=l;return g}):g("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(g){function l(e,a,c,d){e.hasOwnProperty(a)||(e[a]=d.apply(null,c))}g=g?g._modules:{};l(g,"mixins/nodes.js",[g["parts/Globals.js"],g["parts/Utilities.js"]],function(e,a){var c=a.defined,d=a.extend,f=a.pick,k=e.Point;
e.NodesMixin={createNode:function(a){function c(b,h){return e.find(b,function(b){return b.id===h})}var b=c(this.nodes,a),h=this.pointClass;if(!b){var m=this.options.nodes&&c(this.options.nodes,a);b=(new h).init(this,d({className:"highcharts-node",isNode:!0,id:a,y:1},m));b.linksTo=[];b.linksFrom=[];b.formatPrefix="node";b.name=b.name||b.options.id;b.mass=f(b.options.mass,b.options.marker&&b.options.marker.radius,this.options.marker&&this.options.marker.radius,4);b.getSum=function(){var h=0,d=0;b.linksTo.forEach(function(b){h+=
b.weight});b.linksFrom.forEach(function(b){d+=b.weight});return Math.max(h,d)};b.offset=function(h,d){for(var a=0,m=0;m<b[d].length;m++){if(b[d][m]===h)return a;a+=b[d][m].weight}};b.hasShape=function(){var h=0;b.linksTo.forEach(function(b){b.outgoing&&h++});return!b.linksTo.length||h!==b.linksTo.length};this.nodes.push(b)}return b},generatePoints:function(){var d=this.chart,a={};e.Series.prototype.generatePoints.call(this);this.nodes||(this.nodes=[]);this.colorCounter=0;this.nodes.forEach(function(b){b.linksFrom.length=
0;b.linksTo.length=0;b.level=b.options.level});this.points.forEach(function(b){c(b.from)&&(a[b.from]||(a[b.from]=this.createNode(b.from)),a[b.from].linksFrom.push(b),b.fromNode=a[b.from],d.styledMode?b.colorIndex=f(b.options.colorIndex,a[b.from].colorIndex):b.color=b.options.color||a[b.from].color);c(b.to)&&(a[b.to]||(a[b.to]=this.createNode(b.to)),a[b.to].linksTo.push(b),b.toNode=a[b.to]);b.name=b.name||b.id},this);this.nodeLookup=a},setData:function(){this.nodes&&(this.nodes.forEach(function(a){a.destroy()}),
this.nodes.length=0);e.Series.prototype.setData.apply(this,arguments)},destroy:function(){this.data=[].concat(this.points||[],this.nodes);return e.Series.prototype.destroy.apply(this,arguments)},setNodeState:function(a){var d=arguments,b=this.isNode?this.linksTo.concat(this.linksFrom):[this.fromNode,this.toNode];"select"!==a&&b.forEach(function(b){b.series&&(k.prototype.setState.apply(b,d),b.isNode||(b.fromNode.graphic&&k.prototype.setState.apply(b.fromNode,d),b.toNode.graphic&&k.prototype.setState.apply(b.toNode,
d)))});k.prototype.setState.apply(this,d)}}});l(g,"modules/networkgraph/integrations.js",[g["parts/Globals.js"]],function(e){e.networkgraphIntegrations={verlet:{attractiveForceFunction:function(a,c){return(c-a)/a},repulsiveForceFunction:function(a,c){return(c-a)/a*(c>a?1:0)},barycenter:function(){var a=this.options.gravitationalConstant,c=this.barycenter.xFactor,d=this.barycenter.yFactor;c=(c-(this.box.left+this.box.width)/2)*a;d=(d-(this.box.top+this.box.height)/2)*a;this.nodes.forEach(function(a){a.fixedPosition||
(a.plotX-=c/a.mass/a.degree,a.plotY-=d/a.mass/a.degree)})},repulsive:function(a,c,d){c=c*this.diffTemperature/a.mass/a.degree;a.fixedPosition||(a.plotX+=d.x*c,a.plotY+=d.y*c)},attractive:function(a,c,d){var f=a.getMass(),k=-d.x*c*this.diffTemperature;c=-d.y*c*this.diffTemperature;a.fromNode.fixedPosition||(a.fromNode.plotX-=k*f.fromNode/a.fromNode.degree,a.fromNode.plotY-=c*f.fromNode/a.fromNode.degree);a.toNode.fixedPosition||(a.toNode.plotX+=k*f.toNode/a.toNode.degree,a.toNode.plotY+=c*f.toNode/
a.toNode.degree)},integrate:function(a,c){var d=-a.options.friction,f=a.options.maxSpeed,k=(c.plotX+c.dispX-c.prevX)*d;d*=c.plotY+c.dispY-c.prevY;var e=Math.abs,g=e(k)/(k||1);e=e(d)/(d||1);k=g*Math.min(f,Math.abs(k));d=e*Math.min(f,Math.abs(d));c.prevX=c.plotX+c.dispX;c.prevY=c.plotY+c.dispY;c.plotX+=k;c.plotY+=d;c.temperature=a.vectorLength({x:k,y:d})},getK:function(a){return Math.pow(a.box.width*a.box.height/a.nodes.length,.5)}},euler:{attractiveForceFunction:function(a,c){return a*a/c},repulsiveForceFunction:function(a,
c){return c*c/a},barycenter:function(){var a=this.options.gravitationalConstant,c=this.barycenter.xFactor,d=this.barycenter.yFactor;this.nodes.forEach(function(f){if(!f.fixedPosition){var k=f.getDegree();k*=1+k/2;f.dispX+=(c-f.plotX)*a*k/f.degree;f.dispY+=(d-f.plotY)*a*k/f.degree}})},repulsive:function(a,c,d,f){a.dispX+=d.x/f*c/a.degree;a.dispY+=d.y/f*c/a.degree},attractive:function(a,c,d,f){var k=a.getMass(),e=d.x/f*c;c*=d.y/f;a.fromNode.fixedPosition||(a.fromNode.dispX-=e*k.fromNode/a.fromNode.degree,
a.fromNode.dispY-=c*k.fromNode/a.fromNode.degree);a.toNode.fixedPosition||(a.toNode.dispX+=e*k.toNode/a.toNode.degree,a.toNode.dispY+=c*k.toNode/a.toNode.degree)},integrate:function(a,c){c.dispX+=c.dispX*a.options.friction;c.dispY+=c.dispY*a.options.friction;var d=c.temperature=a.vectorLength({x:c.dispX,y:c.dispY});0!==d&&(c.plotX+=c.dispX/d*Math.min(Math.abs(c.dispX),a.temperature),c.plotY+=c.dispY/d*Math.min(Math.abs(c.dispY),a.temperature))},getK:function(a){return Math.pow(a.box.width*a.box.height/
a.nodes.length,.3)}}}});l(g,"modules/networkgraph/QuadTree.js",[g["parts/Globals.js"],g["parts/Utilities.js"]],function(e,a){a=a.extend;var c=e.QuadTreeNode=function(a){this.box=a;this.boxSize=Math.min(a.width,a.height);this.nodes=[];this.body=this.isInternal=!1;this.isEmpty=!0};a(c.prototype,{insert:function(a,f){this.isInternal?this.nodes[this.getBoxPosition(a)].insert(a,f-1):(this.isEmpty=!1,this.body?f?(this.isInternal=!0,this.divideBox(),!0!==this.body&&(this.nodes[this.getBoxPosition(this.body)].insert(this.body,
f-1),this.body=!0),this.nodes[this.getBoxPosition(a)].insert(a,f-1)):(f=new c({top:a.plotX,left:a.plotY,width:.1,height:.1}),f.body=a,f.isInternal=!1,this.nodes.push(f)):(this.isInternal=!1,this.body=a))},updateMassAndCenter:function(){var a=0,c=0,e=0;this.isInternal?(this.nodes.forEach(function(d){d.isEmpty||(a+=d.mass,c+=d.plotX*d.mass,e+=d.plotY*d.mass)}),c/=a,e/=a):this.body&&(a=this.body.mass,c=this.body.plotX,e=this.body.plotY);this.mass=a;this.plotX=c;this.plotY=e},divideBox:function(){var a=
this.box.width/2,f=this.box.height/2;this.nodes[0]=new c({left:this.box.left,top:this.box.top,width:a,height:f});this.nodes[1]=new c({left:this.box.left+a,top:this.box.top,width:a,height:f});this.nodes[2]=new c({left:this.box.left+a,top:this.box.top+f,width:a,height:f});this.nodes[3]=new c({left:this.box.left,top:this.box.top+f,width:a,height:f})},getBoxPosition:function(a){var d=a.plotY<this.box.top+this.box.height/2;return a.plotX<this.box.left+this.box.width/2?d?0:3:d?1:2}});e=e.QuadTree=function(a,
f,e,g){this.box={left:a,top:f,width:e,height:g};this.maxDepth=25;this.root=new c(this.box,"0");this.root.isInternal=!0;this.root.isRoot=!0;this.root.divideBox()};a(e.prototype,{insertNodes:function(a){a.forEach(function(a){this.root.insert(a,this.maxDepth)},this)},visitNodeRecursive:function(a,c,e){var d;a||(a=this.root);a===this.root&&c&&(d=c(a));!1!==d&&(a.nodes.forEach(function(a){if(a.isInternal){c&&(d=c(a));if(!1===d)return;this.visitNodeRecursive(a,c,e)}else a.body&&c&&c(a.body);e&&e(a)},this),
a===this.root&&e&&e(a))},calculateMassAndCenter:function(){this.visitNodeRecursive(null,null,function(a){a.updateMassAndCenter()})}})});l(g,"modules/networkgraph/layouts.js",[g["parts/Globals.js"],g["parts/Utilities.js"]],function(e,a){var c=a.clamp,d=a.defined,f=a.extend,k=a.pick,g=a.setAnimation;a=e.addEvent;var n=e.Chart;e.layouts={"reingold-fruchterman":function(){}};f(e.layouts["reingold-fruchterman"].prototype,{init:function(b){this.options=b;this.nodes=[];this.links=[];this.series=[];this.box=
{x:0,y:0,width:0,height:0};this.setInitialRendering(!0);this.integration=e.networkgraphIntegrations[b.integration];this.attractiveForce=k(b.attractiveForce,this.integration.attractiveForceFunction);this.repulsiveForce=k(b.repulsiveForce,this.integration.repulsiveForceFunction);this.approximation=b.approximation},start:function(){var b=this.series,a=this.options;this.currentStep=0;this.forces=b[0]&&b[0].forces||[];this.initialRendering&&(this.initPositions(),b.forEach(function(b){b.render()}));this.setK();
this.resetSimulation(a);a.enableSimulation&&this.step()},step:function(){var b=this,a=this.series,m=this.options;b.currentStep++;"barnes-hut"===b.approximation&&(b.createQuadTree(),b.quadTree.calculateMassAndCenter());b.forces.forEach(function(a){b[a+"Forces"](b.temperature)});b.applyLimits(b.temperature);b.temperature=b.coolDown(b.startTemperature,b.diffTemperature,b.currentStep);b.prevSystemTemperature=b.systemTemperature;b.systemTemperature=b.getSystemTemperature();m.enableSimulation&&(a.forEach(function(b){b.chart&&
b.render()}),b.maxIterations--&&isFinite(b.temperature)&&!b.isStable()?(b.simulation&&e.win.cancelAnimationFrame(b.simulation),b.simulation=e.win.requestAnimationFrame(function(){b.step()})):b.simulation=!1)},stop:function(){this.simulation&&e.win.cancelAnimationFrame(this.simulation)},setArea:function(b,a,m,c){this.box={left:b,top:a,width:m,height:c}},setK:function(){this.k=this.options.linkLength||this.integration.getK(this)},addElementsToCollection:function(b,a){b.forEach(function(b){-1===a.indexOf(b)&&
a.push(b)})},removeElementFromCollection:function(b,a){b=a.indexOf(b);-1!==b&&a.splice(b,1)},clear:function(){this.nodes.length=0;this.links.length=0;this.series.length=0;this.resetSimulation()},resetSimulation:function(){this.forcedStop=!1;this.systemTemperature=0;this.setMaxIterations();this.setTemperature();this.setDiffTemperature()},setMaxIterations:function(b){this.maxIterations=k(b,this.options.maxIterations)},setTemperature:function(){this.temperature=this.startTemperature=Math.sqrt(this.nodes.length)},
setDiffTemperature:function(){this.diffTemperature=this.startTemperature/(this.options.maxIterations+1)},setInitialRendering:function(b){this.initialRendering=b},createQuadTree:function(){this.quadTree=new e.QuadTree(this.box.left,this.box.top,this.box.width,this.box.height);this.quadTree.insertNodes(this.nodes)},initPositions:function(){var b=this.options.initialPositions;e.isFunction(b)?(b.call(this),this.nodes.forEach(function(b){d(b.prevX)||(b.prevX=b.plotX);d(b.prevY)||(b.prevY=b.plotY);b.dispX=
0;b.dispY=0})):"circle"===b?this.setCircularPositions():this.setRandomPositions()},setCircularPositions:function(){function b(a){a.linksFrom.forEach(function(a){g[a.toNode.id]||(g[a.toNode.id]=!0,f.push(a.toNode),b(a.toNode))})}var a=this.box,c=this.nodes,d=2*Math.PI/(c.length+1),e=c.filter(function(b){return 0===b.linksTo.length}),f=[],g={},p=this.options.initialPositionRadius;e.forEach(function(a){f.push(a);b(a)});f.length?c.forEach(function(b){-1===f.indexOf(b)&&f.push(b)}):f=c;f.forEach(function(b,
h){b.plotX=b.prevX=k(b.plotX,a.width/2+p*Math.cos(h*d));b.plotY=b.prevY=k(b.plotY,a.height/2+p*Math.sin(h*d));b.dispX=0;b.dispY=0})},setRandomPositions:function(){function b(b){b=b*b/Math.PI;return b-=Math.floor(b)}var a=this.box,c=this.nodes,d=c.length+1;c.forEach(function(h,c){h.plotX=h.prevX=k(h.plotX,a.width*b(c));h.plotY=h.prevY=k(h.plotY,a.height*b(d+c));h.dispX=0;h.dispY=0})},force:function(b){this.integration[b].apply(this,Array.prototype.slice.call(arguments,1))},barycenterForces:function(){this.getBarycenter();
this.force("barycenter")},getBarycenter:function(){var b=0,a=0,c=0;this.nodes.forEach(function(h){a+=h.plotX*h.mass;c+=h.plotY*h.mass;b+=h.mass});return this.barycenter={x:a,y:c,xFactor:a/b,yFactor:c/b}},barnesHutApproximation:function(b,a){var h=this.getDistXY(b,a),c=this.vectorLength(h);if(b!==a&&0!==c)if(a.isInternal)if(a.boxSize/c<this.options.theta&&0!==c){var d=this.repulsiveForce(c,this.k);this.force("repulsive",b,d*a.mass,h,c);var f=!1}else f=!0;else d=this.repulsiveForce(c,this.k),this.force("repulsive",
b,d*a.mass,h,c);return f},repulsiveForces:function(){var b=this;"barnes-hut"===b.approximation?b.nodes.forEach(function(a){b.quadTree.visitNodeRecursive(null,function(c){return b.barnesHutApproximation(a,c)})}):b.nodes.forEach(function(a){b.nodes.forEach(function(c){if(a!==c&&!a.fixedPosition){var h=b.getDistXY(a,c);var d=b.vectorLength(h);if(0!==d){var m=b.repulsiveForce(d,b.k);b.force("repulsive",a,m*c.mass,h,d)}}})})},attractiveForces:function(){var b=this,a,c,d;b.links.forEach(function(h){h.fromNode&&
h.toNode&&(a=b.getDistXY(h.fromNode,h.toNode),c=b.vectorLength(a),0!==c&&(d=b.attractiveForce(c,b.k),b.force("attractive",h,d,a,c)))})},applyLimits:function(){var b=this;b.nodes.forEach(function(a){a.fixedPosition||(b.integration.integrate(b,a),b.applyLimitBox(a,b.box),a.dispX=0,a.dispY=0)})},applyLimitBox:function(b,a){var h=b.radius;b.plotX=c(b.plotX,a.left+h,a.width-h);b.plotY=c(b.plotY,a.top+h,a.height-h)},coolDown:function(a,c,d){return a-c*d},isStable:function(){return.00001>Math.abs(this.systemTemperature-
this.prevSystemTemperature)||0>=this.temperature},getSystemTemperature:function(){return this.nodes.reduce(function(a,c){return a+c.temperature},0)},vectorLength:function(a){return Math.sqrt(a.x*a.x+a.y*a.y)},getDistR:function(a,c){a=this.getDistXY(a,c);return this.vectorLength(a)},getDistXY:function(a,c){var b=a.plotX-c.plotX;a=a.plotY-c.plotY;return{x:b,y:a,absX:Math.abs(b),absY:Math.abs(a)}}});a(n,"predraw",function(){this.graphLayoutsLookup&&this.graphLayoutsLookup.forEach(function(a){a.stop()})});
a(n,"render",function(){function a(a){a.maxIterations--&&isFinite(a.temperature)&&!a.isStable()&&!a.options.enableSimulation&&(a.beforeStep&&a.beforeStep(),a.step(),d=!1,c=!0)}var c=!1;if(this.graphLayoutsLookup){g(!1,this);for(this.graphLayoutsLookup.forEach(function(a){a.start()});!d;){var d=!0;this.graphLayoutsLookup.forEach(a)}c&&this.series.forEach(function(a){a&&a.layout&&a.render()})}})});l(g,"modules/networkgraph/draggable-nodes.js",[g["parts/Globals.js"]],function(e){var a=e.Chart,c=e.addEvent;
e.dragNodesMixin={onMouseDown:function(a,c){c=this.chart.pointer.normalize(c);a.fixedPosition={chartX:c.chartX,chartY:c.chartY,plotX:a.plotX,plotY:a.plotY};a.inDragMode=!0},onMouseMove:function(a,c){if(a.fixedPosition&&a.inDragMode){var d=this.chart,e=d.pointer.normalize(c);c=a.fixedPosition.chartX-e.chartX;e=a.fixedPosition.chartY-e.chartY;if(5<Math.abs(c)||5<Math.abs(e))c=a.fixedPosition.plotX-c,e=a.fixedPosition.plotY-e,d.isInsidePlot(c,e)&&(a.plotX=c,a.plotY=e,a.hasDragged=!0,this.redrawHalo(a),
this.layout.simulation?this.layout.resetSimulation():(this.layout.setInitialRendering(!1),this.layout.enableSimulation?this.layout.start():this.layout.setMaxIterations(1),this.chart.redraw(),this.layout.setInitialRendering(!0)))}},onMouseUp:function(a,c){a.fixedPosition&&a.hasDragged&&(this.layout.enableSimulation?this.layout.start():this.chart.redraw(),a.inDragMode=a.hasDragged=!1,this.options.fixedDraggable||delete a.fixedPosition)},redrawHalo:function(a){a&&this.halo&&this.halo.attr({d:a.haloPath(this.options.states.hover.halo.size)})}};
c(a,"load",function(){var a=this,e,g,l;a.container&&(e=c(a.container,"mousedown",function(d){var b=a.hoverPoint;b&&b.series&&b.series.hasDraggableNodes&&b.series.options.draggable&&(b.series.onMouseDown(b,d),g=c(a.container,"mousemove",function(a){return b&&b.series&&b.series.onMouseMove(b,a)}),l=c(a.container.ownerDocument,"mouseup",function(a){g();l();return b&&b.series&&b.series.onMouseUp(b,a)}))}));c(a,"destroy",function(){e()})})});l(g,"modules/networkgraph/networkgraph.src.js",[g["parts/Globals.js"],
g["parts/Utilities.js"]],function(e,a){var c=a.defined,d=a.pick,f=e.addEvent;a=e.seriesType;var g=e.seriesTypes,l=e.Point,n=e.Series,b=e.dragNodesMixin;a("networkgraph","line",{stickyTracking:!1,inactiveOtherPoints:!0,marker:{enabled:!0,states:{inactive:{opacity:.3,animation:{duration:50}}}},states:{inactive:{linkOpacity:.3,animation:{duration:50}}},dataLabels:{formatter:function(){return this.key},linkFormatter:function(){return this.point.fromNode.name+"<br>"+this.point.toNode.name},linkTextPath:{enabled:!0},
textPath:{enabled:!1}},link:{color:"rgba(100, 100, 100, 0.5)",width:1},draggable:!0,layoutAlgorithm:{initialPositions:"circle",initialPositionRadius:1,enableSimulation:!1,theta:.5,maxSpeed:10,approximation:"none",type:"reingold-fruchterman",integration:"euler",maxIterations:1E3,gravitationalConstant:.0625,friction:-.981},showInLegend:!1},{forces:["barycenter","repulsive","attractive"],hasDraggableNodes:!0,drawGraph:null,isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,pointArrayMap:["from",
"to"],trackerGroups:["group","markerGroup","dataLabelsGroup"],drawTracker:e.TrackerMixin.drawTrackerPoint,animate:null,buildKDTree:e.noop,createNode:e.NodesMixin.createNode,destroy:function(){this.layout.removeElementFromCollection(this,this.layout.series);e.NodesMixin.destroy.call(this)},init:function(){n.prototype.init.apply(this,arguments);f(this,"updatedData",function(){this.layout&&this.layout.stop()});return this},generatePoints:function(){var a;e.NodesMixin.generatePoints.apply(this,arguments);
this.options.nodes&&this.options.nodes.forEach(function(a){this.nodeLookup[a.id]||(this.nodeLookup[a.id]=this.createNode(a.id))},this);for(a=this.nodes.length-1;0<=a;a--){var b=this.nodes[a];b.degree=b.getDegree();b.radius=d(b.marker&&b.marker.radius,this.options.marker&&this.options.marker.radius,0);this.nodeLookup[b.id]||b.remove()}this.data.forEach(function(a){a.formatPrefix="link"});this.indexateNodes()},indexateNodes:function(){this.nodes.forEach(function(a,b){a.index=b})},markerAttribs:function(a,
b){b=n.prototype.markerAttribs.call(this,a,b);c(a.plotY)||(b.y=0);b.x=(a.plotX||0)-(b.width/2||0);return b},translate:function(){this.processedXData||this.processData();this.generatePoints();this.deferLayout();this.nodes.forEach(function(a){a.isInside=!0;a.linksFrom.forEach(function(a){a.shapeType="path";a.y=1})})},deferLayout:function(){var a=this.options.layoutAlgorithm,b=this.chart.graphLayoutsStorage,d=this.chart.graphLayoutsLookup,f=this.chart.options.chart;if(this.visible){b||(this.chart.graphLayoutsStorage=
b={},this.chart.graphLayoutsLookup=d=[]);var g=b[a.type];g||(a.enableSimulation=c(f.forExport)?!f.forExport:a.enableSimulation,b[a.type]=g=new e.layouts[a.type],g.init(a),d.splice(g.index,0,g));this.layout=g;g.setArea(0,0,this.chart.plotWidth,this.chart.plotHeight);g.addElementsToCollection([this],g.series);g.addElementsToCollection(this.nodes,g.nodes);g.addElementsToCollection(this.points,g.links)}},render:function(){var a=this.points,b=this.chart.hoverPoint,c=[];this.points=this.nodes;g.line.prototype.render.call(this);
this.points=a;a.forEach(function(a){a.fromNode&&a.toNode&&(a.renderLink(),a.redrawLink())});b&&b.series===this&&this.redrawHalo(b);this.chart.hasRendered&&!this.options.dataLabels.allowOverlap&&(this.nodes.concat(this.points).forEach(function(a){a.dataLabel&&c.push(a.dataLabel)}),this.chart.hideOverlappingLabels(c))},drawDataLabels:function(){var a=this.options.dataLabels.textPath;n.prototype.drawDataLabels.apply(this,arguments);this.points=this.data;this.options.dataLabels.textPath=this.options.dataLabels.linkTextPath;
n.prototype.drawDataLabels.apply(this,arguments);this.points=this.nodes;this.options.dataLabels.textPath=a},pointAttribs:function(a,b){var c=b||a.state||"normal";b=n.prototype.pointAttribs.call(this,a,c);c=this.options.states[c];a.isNode||(b=a.getLinkAttributes(),c&&(b={stroke:c.linkColor||b.stroke,dashstyle:c.linkDashStyle||b.dashstyle,opacity:d(c.linkOpacity,b.opacity),"stroke-width":c.linkColor||b["stroke-width"]}));return b},redrawHalo:b.redrawHalo,onMouseDown:b.onMouseDown,onMouseMove:b.onMouseMove,
onMouseUp:b.onMouseUp,setState:function(a,b){b?(this.points=this.nodes.concat(this.data),n.prototype.setState.apply(this,arguments),this.points=this.data):n.prototype.setState.apply(this,arguments);this.layout.simulation||a||this.render()}},{setState:e.NodesMixin.setNodeState,init:function(){l.prototype.init.apply(this,arguments);this.series.options.draggable&&!this.series.chart.styledMode&&(f(this,"mouseOver",function(){e.css(this.series.chart.container,{cursor:"move"})}),f(this,"mouseOut",function(){e.css(this.series.chart.container,
{cursor:"default"})}));return this},getDegree:function(){var a=this.isNode?this.linksFrom.length+this.linksTo.length:0;return 0===a?1:a},getLinkAttributes:function(){var a=this.series.options.link,b=this.options;return{"stroke-width":d(b.width,a.width),stroke:b.color||a.color,dashstyle:b.dashStyle||a.dashStyle,opacity:d(b.opacity,a.opacity,1)}},renderLink:function(){if(!this.graphic&&(this.graphic=this.series.chart.renderer.path(this.getLinkPath()).add(this.series.group),!this.series.chart.styledMode)){var a=
this.series.pointAttribs(this);this.graphic.attr(a);(this.dataLabels||[]).forEach(function(b){b&&b.attr({opacity:a.opacity})})}},redrawLink:function(){var a=this.getLinkPath();if(this.graphic){this.shapeArgs={d:a};if(!this.series.chart.styledMode){var b=this.series.pointAttribs(this);this.graphic.attr(b);(this.dataLabels||[]).forEach(function(a){a&&a.attr({opacity:b.opacity})})}this.graphic.animate(this.shapeArgs);this.plotX=(a[1]+a[4])/2;this.plotY=(a[2]+a[5])/2}},getMass:function(){var a=this.fromNode.mass,
b=this.toNode.mass,c=a+b;return{fromNode:1-a/c,toNode:1-b/c}},getLinkPath:function(){var a=this.fromNode,b=this.toNode;a.plotX>b.plotX&&(a=this.toNode,b=this.fromNode);return["M",a.plotX,a.plotY,"L",b.plotX,b.plotY]},isValid:function(){return!this.isNode||c(this.id)},remove:function(a,b){var c=this.series,d=c.options.nodes||[],e,f=d.length;if(this.isNode){c.points=[];[].concat(this.linksFrom).concat(this.linksTo).forEach(function(a){e=a.fromNode.linksFrom.indexOf(a);-1<e&&a.fromNode.linksFrom.splice(e,
1);e=a.toNode.linksTo.indexOf(a);-1<e&&a.toNode.linksTo.splice(e,1);n.prototype.removePoint.call(c,c.data.indexOf(a),!1,!1)});c.points=c.data.slice();for(c.nodes.splice(c.nodes.indexOf(this),1);f--;)if(d[f].id===this.options.id){c.options.nodes.splice(f,1);break}this&&this.destroy();c.isDirty=!0;c.isDirtyData=!0;a&&c.chart.redraw(a)}else c.removePoint(c.data.indexOf(this),a,b)},destroy:function(){this.isNode&&this.linksFrom.concat(this.linksTo).forEach(function(a){a.destroyElements&&a.destroyElements()});
this.series.layout.removeElementFromCollection(this,this.series.layout[this.isNode?"nodes":"links"]);return l.prototype.destroy.apply(this,arguments)}});""});l(g,"masters/modules/networkgraph.src.js",[],function(){})});
//# sourceMappingURL=networkgraph.js.map