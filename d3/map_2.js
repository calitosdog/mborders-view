var compareName1 = undefined;

(function() {

	var status = {
		week : 1,
		type : 'weekdays',
		level: '_lv1_'
		}
	window.map2 = map2;
	

	function map2(w){
		var filename;
		if(typeof w == 'string'){
		 status.type = w;	
		}else if(typeof w == 'number'){
			status.week = w;
		}else{
			console.log(w);
			status.level = w[0];
		}
		
		$('#rightBlockp2').fadeIn('fast');
		$('#areap2').show(1000).html(status.type + " " + ((status.week) + 1) + " " + (status.level.slice(1, 4)));
		loadfile2(status.type + status.week + status.level,status.type + status.week + '_',status.type);
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
	
	window.loadfile2 = loadfile2;

	//This loads all converted json files for map rendering
	function loadfile2(name,type1) {
		console.log(name);
		var file_map2 = "d3/data/" + name + ".topojson";
		
				var w1 = 600,
					h1 = 400,
					centered1;
				var color1 = d3.scale.category20();
				
				//Define map projection
				var projection1 = d3.geo.mercator()
					.center([0, 43.3])
					.rotate([349, 0])
					.scale(1200 * 6)
					.translate([w1 / 2, h1 / 2])
					.precision(.1);
				//Define path generator
				var path1 = d3.geo.path().projection(projection1);

				d3.select("svg.mappa2").remove();			 
				//Create SVG element
				var svg2 = d3.select("#map3").append("svg")
					.attr("width", w1)
					.attr("height", h1)
					.attr("class","mappa2");
	
				var g2 = svg2.append("g");
				
		if(UrlExits(file_map2) == true) {
			d3.json(file_map2, function (error,data1){
				console.log(file_map2);
				if (error) throw error
					
					g2.append("g")
						.attr("id", "cluster")
						.selectAll("path")
						.data(topojson.feature(data1, data1.objects[type1]).features)
						.enter().append("path")
						.attr("d", path1)
						.style('fill', function(d) { return color1(d.id); })
						.on("click", clicked1)
						.on('mouseover', function(d, i) {
							var currentState1 = this;
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
			function clicked1(d) {
				  var x, y, k;

				  if (d && centered1 !== d) {
					var centroid1 = path1.centroid(d);
					x1 = centroid1[0];
					y1 = centroid1[1];
					k1 = 4;
					centered1 = d;
				  } else {
					x1 = w1 / 2;
					y1 = h1 / 2;
					k1 = 1;
					centered1 = null;
				  }

				  g2.selectAll("path")
					  .classed("active", centered1 && function(d) { return d === centered1; });

				  g2.transition()
					  .duration(750)
					  .attr("transform", "translate(" + w1 / 2 + "," + h1 / 2 + ")scale(" + k1 + ")translate(" + -x1 + "," + -y1 + ")")
					  .style("stroke-width", 1.5 / k11 + "px");
			}
		}
	}
	
}).call(this);