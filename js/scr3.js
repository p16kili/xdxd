var data_V1 = [{
  "Type": "Αθηναίων",
  "Amount": 664.046,
  "Description": "Σύνολο: 664.046χιλ Άρρενες: 315.210χιλ Θήλεις: 348.836χιλ  "
},{
"Type": "Θεσσαλονίκης",
  "Amount": 325.182,
  "Description": "Σύνολο: 325.182χιλ Άρρενες: 148.470χιλ Θήλεις: 176.712χιλ "
}, {
  "Type": "Πατρέων",
  "Amount": 213.984,
  "Description": "Σύνολο: 213.984χιλ Άρρενες: 104.307χιλ Θήλεις: 109.677χιλ "
}, {
  "Type": "Ηρακλείου",
  "Amount": 173.993,
  "Description": "Σύνολο: 173.993χιλ Άρρενες: 85.133χιλ Θήλεις: 88.860χιλ "
}, {
  "Type": "Πειραιώς",
  "Amount": 163.688,
  "Description": "Σύνολο: 163.688χιλ Άρρενες: 78.200χιλ Θήλεις: 85.488χιλ "
},{
"Type": "Λαρισαίων",
  "Amount": 162.591,
  "Description": "Σύνολο: 162.591χιλ Άρρενες: 79.762χιλ Θήλεις: 82.829χιλ  "
},{
"Type": "Βόλου",
  "Amount": 144.449,
  "Description": "Σύνολο: 144.449χιλ Άρρενες: 70.185χιλ Θήλεις: 74.264χιλ "
},{
"Type": "Περιστερίου",
  "Amount": 139.981,
  "Description": "Σύνολο: 139.981χιλ.  Άρρενες: 68.563χιλ Θήλεις: 71.418χιλ "
},{
"Type": "Ρόδου",
  "Amount": 115.490,
  "Description": "Σύνολο: 115.490χιλ  Άρρενες: 57.879χιλ Θήλεις: 57.611χιλ "
},{
"Type": "Ιωαννιτών",
  "Amount": 112.486,
  "Description": "Σύνολο: 112.486χιλ Άρρενες: 53.975χιλ Θήλεις: 58.511χιλ "
}];


data = [{
  "key": "data_V1",
  "values": data_V1
}]

var width = parseInt(d3.select('#pieChart').style('width'), 10);
var height = width;
var radius = (Math.min(width, height) - 20) / 2;

var type = function getObject(obj) {
  types = [];
  for (var i = 0; i < obj.length; i++) {
    types.push(obj[i].Type);
  }
  return types
};

var pie = d3.layout.pie()
  .value(function(d) {
    return d.Amount;
  })
  .sort(null);

var arc = d3.svg.arc()
  .outerRadius(radius - 5)
  .innerRadius(200);

var arcOver = d3.svg.arc()
  .outerRadius(radius + 5)
  .innerRadius(200);

var svg = d3.select("#pieChart").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
  .attr('preserveAspectRatio', 'xMinYMin')
  .append("g")
  .attr("transform", "translate(" + radius + "," + height / 2 + ")");

var path = svg.selectAll("path");

var label = d3.select("#dataSelection")
  .data(data)
  .on("change", changeData)
  .filter(function(d, i) {
  console.log(!i)
    return !i;
  })
  .each(changeData)

changeText = function(text, textID) {
  d3.select(textID)
    .text(text)
};

change = function(d, i) {
  var angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2))
  svg.transition()
    .duration(1000)
    .attr("transform", "translate(" + radius + "," + height / 2 + ") rotate(" + angle + ")")
  d3.selectAll("path")
    .transition()
    .attr("d", arc)
  d3.select(i)
    .transition()
    .duration(1000)
    .attr("d", arcOver)
};

function changeData() {
  var selectedData = data[this.selectedIndex]
  var color = d3.scale.ordinal()
  .domain(type(selectedData.values))
  .range(["#8A76A6", "#54B5BF", "#8EA65B", "#F27B35", "#BF4539","#ffad60","#008020","#e9e813","#0045f4","#ff0074"]);
  
  var data1 = pie(selectedData.values);
  var dataText = [selectedData.key];

  path = path.data(data1)

  path.enter().append("path")
    .each(function(d) {
      this._current = {
        startAngle: d.endAngle,
        endAngle: d.endAngle
      };
    })
    .attr("fill", function(d) {
      return color(d.data.Type);
    })
    .on("click", function(d) {
      var titleText = d.data.Type + ": " + d.data.Amount;
      var blockText = d.data.Description;

      changeText(titleText, "#segmentTitle");
      changeText(blockText, "#segmentText");
      change(d, this);
    });
  path.exit()
    .datum(function(d, i) {
      return {
        startAngle: d.endAngle,
        endAngle: d.endAngle
      };
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTween)
    .remove();
  path.transition()
    .duration(750)
    .attrTween("d", arcTween);

  $('.text-container').hide();
  $('#segmentTitle').replaceWith('<h1 id="segmentTitle">Select Segment</h1>');
  $('#')
  $('#segmentText').replaceWith('<p id="segmentText">Information</p>');
  $('.text-container').fadeIn(400);

};

function key(d) {
  return d.data.Type;
}

function arcTween(d) {
  var i = d3.interpolate(this._current, d);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

document.querySelector('style').textContent += '@media(max-width:767px) {#pieChart { transform: rotate(90deg); transform-origin: 50% 50%; transition: 1s; max-width: 50%; } .text-container { width: 100%; min-height: 0; }} @media(min-width:768px) {#pieChart { transition: 1s;}}'