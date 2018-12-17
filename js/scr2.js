var   w = 1000,
      h =  900,
      circleWidth = 7; 
 

var palette = {
      "lightgreen": "#E5E8E8",
      "gray": "#708284",
      "mediumgray": "#536870",
      "blue": "#3B757F"
  }

var colors = d3.scale.category20();

var nodes = [
      { name: "EU Countries"},
      { name: "Belgium=732pp", target: [0], value: 58 },
      { name: "Bulgaria=708pp", target: [0, 1], value: 65 },  
      { name: "Denmark=178pp", target: [0, 1, 2], value: 52 },
      { name: "Germany=3.459pp", target: [0, 3], value: 48 }, 
      { name: "Greece=793pp", target: [0,3,4], value: 40 }, 
      { name: "Spain=1.689pp", target: [0,3,4,5], value: 36 },
      { name: "Cyprus=57pp", target: [0, 1, 2], value: 52 },
      { name: "Italy=3.428pp", target: [0, 1, 2, 8], value: 42 },
      { name: "Poland=2.938pp", target: [0,1,2], value: 35 },
      { name: "U.Kingdom=1.804pp", target: [0,1,2,3,9], value: 67 },
      { name: "Portugal=624pp", target: [0,1,2,3,4,5,6,7,8,10], value: 68 },
      { name: "Sweden=259pp", target: [0,1,2,7,8 ], value: 36 },
      { name: "Finland=266pp", target: [0,1,2,7,8], value: 41 },
      { name: "Austria=479pp", target: [0,1,2,3,4,5,6,7,8,9,10,11,12], value: 45 },
      { name: "Norway=117pp", target: [0,1,2,7,8], value: 30 },
      { name: "Malta=11pp", target: [0,1,2,12], value: 57 },
      { name: "Hungary=644pp", target: [0,9,10], value: 33 },
      { name: "Estonia=67pp", target: [0,9,10], value: 37 },
];

var links = [];

for (var i = 0; i < nodes.length; i++){
      if (nodes[i].target !== undefined) { 
            for ( var x = 0; x < nodes[i].target.length; x++ ) 
              links.push({
                  source: nodes[i],
                  target: nodes[nodes[i].target[x]]  
              });
      };
};


var myChart = d3.select('body')
      .append("div")
        .classed("svg-container", true)
      
      .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1000 800")
        .classed("svg-content-responsive", true)


var force = d3.layout.force()
      .nodes(nodes)
      .links([])
      .gravity(0.1)
      .charge(-1000)
      .size([w,h]); 

      var link = myChart.selectAll('line') 
            .data(links).enter().append('line')
            .attr('stroke', palette.lightgreen)
            .attr('strokewidth', '1');

      var node =  myChart.selectAll('circle')  
            .data(nodes).enter() 
            .append('g') 
            .call(force.drag); 

     
     node.append('circle')
            .attr('cx', function(d){return d.x; })
            .attr('cy', function(d){return d.y; })
            .attr('r', function(d,i){
                  console.log(d.value);
                  if ( i > 0 ) {
                        return circleWidth + d.value; 
                  } else {
                        return circleWidth + 35; 
                  }
            })
            .attr('fill', function(d,i){
                  if ( i > 0 ) {
                        return colors(i);
                  } else {
                        return '#fff';
                  }
            })
            .attr('strokewidth', function(d,i){
                  if ( i > 0 ) {
                        return '0';
                  } else {
                        return '2';
                  }
            })
            .attr('stroke', function(d,i){
                  if ( i > 0 ) {
                        return '';
                  } else {
                        return 'black';
                  }
            });


      force.on('tick', function(e){ 
            node.attr('transform', function(d, i){
              return 'translate(' + d.x + ','+ d.y + ')'
            })

          link 
              .attr('x1', function(d){ return d.source.x; }) 
              .attr('y1', function(d){ return d.source.y; })
              .attr('x2', function(d){ return d.target.x; })
              .attr('y2', function(d){ return d.target.y; })
      });


      node.append('text')
            .text(function(d){ return d.name; })
            .attr('font-family', 'Raleway', 'Helvetica Neue, Helvetica')
            .attr('fill', function(d, i){
              console.log(d.value);
                  if ( i > 0 && d.value < 10 ) {
                        return palette.mediumgray;
                  } else if ( i > 0 && d.value >10 ) {
                        return palette.lightgreen;
                  } else {
                        return palette.blue;
                  }
            })
            .attr('text-anchor', function(d, i) {
                  return 'middle';
            })
            .attr('font-size', function(d, i){
                  if (i > 0) {
                        return '.8em';
                  } else {
                        return '.9em';    
                  }
            }) 

force.start();