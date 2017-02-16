var compareName = undefined;

(function() {

	var status = {
		week : 1,
		type : 'weekdays',
		level: '_lv1_'
		}
	window.week = week;
	

	function week(w){
		
		$('#weekpanel').show(1000);
		$('#weekcompare').show(1000);
		$('#weeklevel').show(1000);
		//$('#map').show( "fade" );
		
		//$("#area").fadeIn('fast').html("<b>AREA</b><br> "+(record.area.slice(0,-1)) + " km<sup>2</sup>");
		
		var filename;
		if(typeof w == 'string'){
		 status.type = w;	
		}else if(typeof w == 'number'){
			status.week = w;
		}else{
			console.log(w);
			status.level = w[0];
		}
		//$('#areap').fadeIn('fast').html(status.type + status.week  + status.level);
		$('#rightBlockp').fadeIn('fast');
		$('#areap').show(1000).html(status.type + " " + ((status.week) + 1) + " " + (status.level.slice(1, 4)));
		loadfile(status.type + status.week + status.level, status.type + status.week + '_',status.type);
		console.log(status.type + status.week + status.level);
	}

	
	//Controls Url Presensce in Project
	function UrlExits(url)
	{
		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		return http.status!=404;
	}

	function getUrlParams(){
		var params = {};
		window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
			params[key] = value;
		});
		return params;
		alert(params);	
	}
	
	window.loadfile = loadfile;
	
	
	//Create Google Maps layer
	var $map = $("#map");
	var map = new google.maps.Map($map[0], {
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.TrafficLayer,
			center: new google.maps.LatLng(43.469740, 10.946157),//Tuscany
			styles:[{"stylers": [{"saturation": -100},{"lightness": 10}]}]   
	});
	var lastOverlay;
	//This loads all converted json files for map rendering
	function loadfile(name,type,stat) {
		var file = "d3/data/" + name + ".topojson";
		if(UrlExits(file) == true) {
			d3.json(file, function (error,tuscany){

				if (error) throw error
				
				
				//console.log(tuscany);
				var overlay = new google.maps.OverlayView();
				
				overlay.onRemove = function() {
					this.layer.transition().remove().duration();
				}
				// Add d3 overlay to Google Maps 
				overlay.onAdd = function() {
										
					this.layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
					
					// Draw overlay to google maps *changing projection format
					overlay.draw = function() {
						
						this.layer.select('svg').remove();
							
						var centered;
						var markerOverlay = this;
						var overlayProjection = markerOverlay.getProjection();
						
						// Turn the overlay projection into a d3 projection
						var googleMapProjection = function (coordinates) {
							var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
							var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
							return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
						}
						var color = d3.scale.category20();
						var path = d3.geo.path().projection(googleMapProjection);

						var svg = this.layer.append("svg");
						var g = svg.append("g");
						
						
						g.append("g")
							.attr("id", "cluster")
							.selectAll("path")
							.data(topojson.feature(tuscany, tuscany.objects[type]).features)
							.enter().append("path")
							.attr("d", path)
							.style('fill', function(d) { return color(d.id); })
							.on("click", level2)
							.on('mouseover', function(d, i) {
								var currentState = this;
								d3.select(this).transition(200).style('fill-opacity', .7);
							})
							.on('mouseout', function(d, i) {
								d3.selectAll('path').transition(200)
								.style('fill-opacity', 2);
							});
						
						//Loads level 2 exploration for the selected element						
						function level2(d, i) {
							
							console.log(type);
							var selected = this;
							var x = d3.select(selected);
							
							d3.json('d3/data/'+type+'lv2_.topojson', function(error, tuscany) {
								var clusters = topojson.feature(tuscany, tuscany.objects[type]);
									cluster = clusters.features.filter(function(a) { return a.id[0] === d.id;} );
							
								x.transition().duration(500).style("opacity", 0).remove();
								g.append("g")
									.attr("id", "cluster")
									.selectAll("path")
									.data(cluster)
									.enter().append("path")
									.attr("d", path)
									.style('fill', function(d) { return color(d.id); })
									.on("click", level3)
									.on('mouseover', function(d, i) {
										var currentState = this;
										d3.select(this).transition(200).style('fill-opacity', .7);
									})
									.on('mouseout', function(d, i) {
										d3.selectAll('path').transition(200)
										.style('fill-opacity', 2);
									});
							});
						}
						function level3(d1, i) {
							
							console.log(d1.id);
							var selectedlv3 = this;
							var x1 = d3.select(selectedlv3);
							
							d3.json('d3/data/'+type+'lv3_.topojson', function(error, tuscany1) {
								var clusters1 = topojson.feature(tuscany1, tuscany1.objects[type]);
									cluster1 = clusters1.features.filter(function(b) { 
									var f = b.id.split(':').slice(0, 2).join(':');
									return f === d1.id; });
								
								x1.transition().duration(500).style("opacity", 0).remove();
								g.append("g")
									.attr("id", "cluster")
									.selectAll("path")
									.data(cluster1)
									.enter().append("path")
									.attr("d", path)
									.style('fill', function(d1) { return color(d1.id); })
									.on('mouseover', function(d1, i) {
										var currentState1 = this;
										d3.select(this).transition(200).style('fill-opacity', .7);
									})
									.on('mouseout', function(d1, i) {
										d3.selectAll('path').transition(200)
										.style('fill-opacity', 2);
									});
							});
						}
					}
				}
				if(lastOverlay)lastOverlay.setMap(null);		
					overlay.setMap(map);
					lastOverlay = overlay;
			});
			
			}
		}
}).call(this);
function loadweek(){
		$('#weekpanel').show(1000);
		$('#map').toggle( "fade" );
	}
	
$(function() {
    //----- OPEN
    $('[data-popup-open]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
 
        e.preventDefault();
    });
 
    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
 
        e.preventDefault();
    });
});