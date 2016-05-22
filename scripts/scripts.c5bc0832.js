"use strict";angular.module("LEDApp",["ngRoute","ngMessages","rzModule"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/search.html",controller:"SearchController",controllerAs:"sc"}).otherwise({redirectTo:"/"})}]),angular.module("LEDApp").controller("SearchController",["SearchService","$scope",function(a,b){function c(a){var b=a.match(/-?\d+.?\d* -?\d+.?\d*,/g);return[b[0].match(/-?\d+.?\d*/g).reverse(),b[2].match(/-?\d+.?\d*/g).reverse()]}var d=this;this.hasSearched=!1;var e,f=[],g=[],h="SELECT ?subject ?geoSparql ?timePeriod ?band ?image ?resolution ?lon ?lat",i="ORDER BY DESC(?timePeriod) LIMIT 25";d.currentOverlay=[],b.selectGeolocation=null,f.push("PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>"),f.push("PREFIX led: <http://www.example.org/ANU-LED#>"),f.push("PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>"),g.push("?subject a <http://purl.org/linked-data/cube#Observation>"),g.push(". ?subject <http://www.example.org/ANU-LED#imageData> ?image"),g.push(". ?subject <http://www.example.org/ANU-LED#etmBand> ?band"),g.push(". ?subject <http://www.example.org/ANU-LED#bounds> ?geoSparql"),g.push(". ?subject <http://www.example.org/ANU-LED#time> ?timePeriod"),g.push(". ?subject <http://www.example.org/ANU-LED#resolution> ?resolution"),g.push(". ?subject <http://www.example.org/ANU-LED#location> ?location"),g.push(". ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat"),g.push(". ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lon> ?lon");var j=L.map("mapid").setView([51.505,-.09],13);L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',maxZoom:18,id:"duo.034p8op4",accessToken:"pk.eyJ1IjoiZHVvIiwiYSI6ImNpbm52Y2lxdzB6emZ0dmx5MmNmNGZnejMifQ._yO4cALvQUPwvtVj_nUYEA"}).addTo(j);var k=L.control();k.onAdd=function(){return this._div=L.DomUtil.create("div","info"),this.update(),this._div},k.update=function(a){if(void 0!==a){var b=a.subject.value,c=Number(a.lat.value),d=Number(a.lon.value);this._div.innerHTML="<h4>Image Details</h4>",this._div.innerHTML+='<a href="'+b+'">Link</a>',this._div.innerHTML+="<p>Band:"+a.band.value+"</p>",this._div.innerHTML+="<p>Resolution:"+a.resolution.value+"</p>",this._div.innerHTML+="<p>Location: ("+Math.round(100*(c+1e-5))/100+", "+Math.round(100*(d+1e-5))/100+"(</p>"}else this._div.innerHTML="<h4>Image Details</h4><p>None Selected</p>"},k.addTo(j),b.search=function(){console.log("On Click Search"),null!==b.selectGeolocation&&(f.push("PREFIX spatial: <http://jena.apache.org/spatial#>"),g.push(". ?subject "+b.selectGeolocation+" ("+b.geospatialQuery+")"),d.performQuery())},d.getMessage=function(){},a.getDistinctTime().then(function(a){d.dict=[],d.display=[];for(var c in a)d.dict[moment(a[c]).format("DD/MM/YY, h:mm:ss a")]=a[c],console.log(d.dict),d.display.push(moment(a[c]).format("DD/MM/YY, h:mm:ss a")),e=a[c];d.performQuery(),b.sliderDate={value:d.display.length-1,showTicks:!0,options:{stepsArray:d.display,onStart:function(){},onChange:function(){},onEnd:function(){console.log(b.sliderDate.value),e!==d.dict[b.sliderDate.value]&&(console.log(b.sliderDate.value),e=d.dict[d.display[b.sliderDate.value]],d.performQuery())}}}}),d.performQuery=function(){var b="";for(var l in f)b+=f[l]+" ";b+=h,b+=" WHERE {";for(l in g)b+=g[l];b+='. Filter(?timePeriod = "'+e+'"^^xsd:dateTime)}',b+=i,console.log("Query: "+b);var m=encodeURIComponent(b);a.getAll(m).then(function(a){var b=a.results.bindings,e=[];for(var f in d.currentOverlay)j.removeLayer(d.currentOverlay[f]);d.currentOverlay=[];var g=function(a){k.update(e[a.target.src])};for(f in b){e[b[f].image.value]=b[f];var h=c(String(b[f].geoSparql.value)),i=new L.imageOverlay(b[f].image.value,h).addTo(j).setOpacity(1);L.DomEvent.on(i._image,"click",g),d.currentOverlay.push(i),j.panTo(h[0])}})}}]),angular.module("LEDApp").factory("SearchService",["$http",function(a){var b={},c="http://144.6.231.77/landsat/query?query=",d=c,e=d+"SELECT+%3Fsubject+%3FtimePeriod+%0AWHERE+%7B%0A++%3Fsubject+a+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23Observation%3E%0A++++.+%3Fsubject+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23timePeriod%3E+%3FtimePeriod%0A%7D%0AORDER+BY+DESC(%3FtimePeriod)%0ALIMIT+1",f=d+"SELECT+%3Fsubject+%3FtimePeriod+%0AWHERE+%7B%0A++%3Fsubject+a+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23Observation%3E%0A++++.+%3Fsubject+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23timePeriod%3E+%3FtimePeriod%0A%7D%0AORDER+BY+ASC(%3FtimePeriod)%0ALIMIT+1",g=d+"SELECT%20DISTINCT%20%3FtimePeriod%20%0AWHERE%20%7B%0A%20%20%3Fsubject%20a%20%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23Observation%3E%0A%20%20%20%20.%20%3Fsubject%20%3Chttp%3A%2F%2Fwww.example.org%2FANU-LED%23time%3E%20%3FtimePeriod%0A%7D%0AORDER%20BY%20DESC(%3FtimePeriod)";return b.getAll=function(b){a.defaults.useXDomain=!0,console.log("Getting query: "+d+b);var c={method:"GET",url:d+b,headers:{Accept:"application/sparql-results+json,*/*;q=0.9"}};return a(c).then(function(a){return a.data.status>200?a.data.statusText:a.data},function(a){console.error(a)})},b.getFirstTime=function(){this.queryServer(e).then(function(a){return a.results.bindings[0].timePeriod.value})},b.getLastTime=function(){this.queryServer(f).then(function(a){return a.results.bindings[0].timePeriod.value})},b.getDistinctTime=function(){return this.queryServer(g,function(a){var b=[];for(var c in a.results.bindings){var d=a.results.bindings[c].timePeriod.value;b.push(d)}return b})},b.queryServer=function(b,c){a.defaults.useXDomain=!0;var d={method:"GET",url:b,headers:{Accept:"application/sparql-results+json,*/*;q=0.9"}};return a(d).then(function(a){return a.data.status>200?a.data.statusText:c(a.data)},function(a){console.error(a)})},b}]),angular.module("LEDApp").run(["$templateCache",function(a){a.put("views/search.html",'<nav class="navbar navbar-default navbar-static-top"> <div class="container-fluid"> <!-- Brand and toggle get grouped for better mobile display --> <div class="navbar-header"> <a class="navbar-brand" href="#/">ANU Linked Earth Observations</a> </div> <form class="navbar-form navbar-right"> <div class="form-group"> <rzslider rz-slider-model="sliderDate.value" rz-slider-options="sliderDate.options"> </rzslider> </div> </form> </div><!-- /.container-fluid --> </nav> <div ng-class="{\'search-result\': sc.hasSearched, \'search-new\': !sc.hasSearched}" ng-cloak="ng-cloak"> <md-content> <!-- Start Date: <md-datepicker ng-model="startDate" md-placeholder="Enter date"></md-datepicker> --> <!-- End Date: <md-datepicker ng-model="endDate" md-placeholder="Enter date"></md-datepicker> --> </md-content> <!-- <li ng-repeat="band in getBands()">\n                <label>Band {{band.name}}:\n                <input type="checkbox" ng-model="checkboxModel.band.name">\n                </label>\n                </li> --> <div class="jumbotron search-show-hide" ng-show="sc.hasSearched" style="clear:both"> <p>Search Result: {{sc.message}}</p> </div> </div> <div> <div id="mapid"></div> </div>')}]);