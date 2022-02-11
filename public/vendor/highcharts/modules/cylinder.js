/*
 Highcharts JS v8.0.0 (2019-12-10)

 Highcharts cylinder module

 (c) 2010-2019 Kacper Madej

 License: www.highcharts.com/license
*/
(function(d){"object"===typeof module&&module.exports?(d["default"]=d,module.exports=d):"function"===typeof define&&define.amd?define("highcharts/modules/cylinder",["highcharts","highcharts/highcharts-3d"],function(f){d(f);d.Highcharts=f;return d}):d("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(d){function f(d,c,f,h){d.hasOwnProperty(c)||(d[c]=h.apply(null,f))}d=d?d._modules:{};f(d,"modules/cylinder.src.js",[d["parts/Globals.js"],d["parts/Utilities.js"]],function(d,c){var f=c.pick,
h=d.charts,k=d.color,u=d.deg2rad,v=d.perspective,m=d.seriesType;c=d.Renderer.prototype;var w=c.cuboidPath;m("cylinder","column",{},{},{shapeType:"cylinder",hasNewShapeType:d.seriesTypes.column.prototype.pointClass.prototype.hasNewShapeType});d=d.merge(c.elements3d.cuboid,{parts:["top","bottom","front","back"],pathType:"cylinder",fillSetter:function(a){this.singleSetterForParts("fill",null,{front:a,back:a,top:k(a).brighten(.1).get(),bottom:k(a).brighten(-.1).get()});this.color=this.fill=a;return this}});
c.elements3d.cylinder=d;c.cylinder=function(a){return this.element3d("cylinder",a)};c.cylinderPath=function(a){var b=h[this.chartIndex],e=w.call(this,a),d=!e.isTop,q=!e.isFront,c=this.getCylinderEnd(b,a);a=this.getCylinderEnd(b,a,!0);return{front:this.getCylinderFront(c,a),back:this.getCylinderBack(c,a),top:c,bottom:a,zIndexes:{top:d?3:0,bottom:d?0:3,front:q?2:1,back:q?1:2,group:e.zIndexes.group}}};c.getCylinderFront=function(a,b){a=a.slice(0,a.simplified?9:17);a.push("L");b.simplified?(a=a.concat(b.slice(7,
9)).concat(b.slice(3,6)).concat(b.slice(0,3)),a[a.length-3]="L"):a.push(b[15],b[16],"C",b[13],b[14],b[11],b[12],b[8],b[9],"C",b[6],b[7],b[4],b[5],b[1],b[2]);a.push("Z");return a};c.getCylinderBack=function(a,b){var e=["M"];a.simplified?(e=e.concat(a.slice(7,12)),e.push("L",a[1],a[2])):e=e.concat(a.slice(15));e.push("L");b.simplified?e=e.concat(b.slice(1,3)).concat(b.slice(9,12)).concat(b.slice(6,9)):e.push(b[29],b[30],"C",b[27],b[28],b[25],b[26],b[22],b[23],"C",b[20],b[21],b[18],b[19],b[15],b[16]);
e.push("Z");return e};c.getCylinderEnd=function(a,b,e){var d=f(b.depth,b.width),c=Math.min(b.width,d)/2,h=u*(a.options.chart.options3d.beta-90+(b.alphaCorrection||0));e=b.y+(e?b.height:0);var g=.5519*c,k=b.width/2+b.x,m=d/2+b.z,l=[{x:0,y:e,z:c},{x:g,y:e,z:c},{x:c,y:e,z:g},{x:c,y:e,z:0},{x:c,y:e,z:-g},{x:g,y:e,z:-c},{x:0,y:e,z:-c},{x:-g,y:e,z:-c},{x:-c,y:e,z:-g},{x:-c,y:e,z:0},{x:-c,y:e,z:g},{x:-g,y:e,z:c},{x:0,y:e,z:c}],r=Math.cos(h),t=Math.sin(h),n,p;l.forEach(function(a,b){n=a.x;p=a.z;l[b].x=n*
r-p*t+k;l[b].z=p*r+n*t+m});a=v(l,a,!0);2.5>Math.abs(a[3].y-a[9].y)&&2.5>Math.abs(a[0].y-a[6].y)?(a=this.toLinePath([a[0],a[3],a[6],a[9]],!0),a.simplified=!0):a=this.getCurvedPath(a);return a};c.getCurvedPath=function(a){var b=["M",a[0].x,a[0].y],d=a.length-2,c;for(c=1;c<d;c+=3)b.push("C",a[c].x,a[c].y,a[c+1].x,a[c+1].y,a[c+2].x,a[c+2].y);return b}});f(d,"masters/modules/cylinder.src.js",[],function(){})});
//# sourceMappingURL=cylinder.js.map