var compareName = undefined;

(function() {

	var status = {
		week : 1,
		type : 'weekdays',
		level: '_lv1_'
		}
	window.map1 = map1;
	

	function map1(w){
		var filename;
		if(typeof w == 'string'){
		 status.type = w;	
		}else if(typeof w == 'number'){
			status.week = w;
		}else{
			console.log(w);
			status.level = w[0];
		}
		$('#rightBlockp1').fadeIn('fast');
		$('#areap1').show(1000).html(status.type + " " + ((status.week) + 1) + " " + (status.level.slice(1, 4)));	
		loadfile1(status.type + status.week + status.level, status.type + status.week + '_',status.type);
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
	
	window.loadfile1 = loadfile1;

	//This loads all converted json files for map rendering
	function loadfile1(name,type2) {
		console.log(name);
		var file_map1 = "d3/data/" + name + ".topojson";
		
				var w = 600,
					h = 400,
					centered;
				var color = d3.scale.category20();
				
				//Define map projection
				var projection = d3.geo.mercator()
					.center([0, 43.3])
					.rotate([349, 0])
					.scale(1200 * 6)
					.translate([w / 2, h / 2])
					.precision(.1);
				//Define path generator
				var path = d3.geo.path().projection(projection);

				d3.select("svg.mappa1").remove();			 
				//Create SVG element
				var svg1 = d3.select("#map2").append("svg")
					.attr("width", w)
					.attr("height", h)
					.attr("class", "mappa1");
	
				var g1 = svg1.append("g");
				
		if(UrlExits(file_map1) == true) {
			d3.json(file_map1, function (error,data){
				console.log(file_map1);
				if (error) throw error
					
					g1.append("g")
						.attr("id", "cluster")
						.selectAll("path")
						.data(topojson.feature(data, data.objects[type2]).features)
						.enter().append("path")
						.attr("d", path)
						.style('fill', function(d) { return color(d.id); })
						.on("click", clicked)
						.on('mouseover', function(d, i) {
							var currentState = this;
							d3.select(this).transition(200).style('fill-opacity', 2);
							console.log(d)
						})
						.on('mouseout', function(d, i) {
							d3.selectAll('path').transition(200)
									.style(
										'fill-opacity', .7
									);
						});
							
			});
			function clicked(d) {
				  var x, y, k;

				  if (d && centered !== d) {
					var centroid = path.centroid(d);
					x = centroid[0];
					y = centroid[1];
					k = 4;
					centered = d;
				  } else {
					x = w / 2;
					y = h / 2;
					k = 1;
					centered = null;
				  }

				  g1.selectAll("path")
					  .classed("active", centered && function(d) { return d === centered; });

				  g1.transition()
					  .duration(750)
					  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
					  .style("stroke-width", 1.5 / k + "px");
			}
		}
	}
	
}).call(this);