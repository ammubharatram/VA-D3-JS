// select the svg container first
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 1020)
    .attr('height', 1000);

    
// create margins & dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


// create axes groups
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g');

d3.json('menu.json').then(data => {

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Count_nonSAR)])
    .range([graphHeight, 0]);

  const ys = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Count_SAR)])
    .range([0,graphHeight]);
 
  const x = d3.scaleBand()
    .domain(data.map(item => item.RatioBins))
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  // join the data to rects
  const rects = graph.selectAll('rect')
    .data(data);
  const rects2 = graph.selectAll('rect')
    .data(data);


  // add attrs to rects already in the DOM
  rects.attr('width', x.bandwidth)
    .attr("height", d => graphHeight - y(d.Count_nonSAR))
    .attr('fill', 'black')
    .attr('x', d => x(d.RatioBins))
    .attr('y', d => y(d.Count_nonSAR));

    // add attrs to rects already in the DOM
  rects2.attr('width', x.bandwidth)
  .attr("height", d => ys(d.Count_SAR))
  .attr('fill', 'yellow')
  .attr('x', d => x(d.RatioBins))
  .attr('y', d => ys(d.Count_SAR));

  // append the enter selection to the DOM
  rects.enter()
  
    .append('rect')
    .transition().duration(500)
      .attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.Count_nonSAR))
      
      .style('fill', '#000000') //black
      .attr('x', (d) => x(d.RatioBins))
      .attr('y', d => y(d.Count_nonSAR))
      
  rects2.enter()
    .append('rect')
    .transition().duration(500)
      .attr('width', x.bandwidth)
      .attr("height", d => ys(d.Count_SAR))
      .style('fill', '#FFFF00') //yellow
      .attr('x', d => x(d.RatioBins))
      .attr('y', d => y(d.Count_nonSAR)- ys(d.Count_SAR));
  // create & call axesit
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(d => d  );

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  const xa = xAxisGroup.selectAll('text')
    .attr('fill', 'black')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    
  xa.select('path').attr("marker-end", "url(#arrowhead)");
  yAxisGroup.selectAll('text')
    .attr('fill', 'black')


/*     d3.select(['SAR','Non-SAR'])
      .attr("class", "legend");   
 */


// ######## legend setup #######
console.log(d3["schemeSet3"]);

// ordinal colour scale
var colour = d3.scaleOrdinal(['#FFFF00','#000000','#ff0000']);
const legendGroup = svg.append('g')
  .attr('transform', `translate(${graphWidth + 180}, 10)`)


 // update colour scale domain
 colour.domain(["No. of SARs ","No.of Non-SARs","%True Positive Rate (Right Axis)"]);

/* console.log(d3.select(rects)
.attr('style')); */
const legend = d3.legendColor()
  .shape('path', d3.symbol().type(d3.symbolCircle)())
  .shapePadding(10)
  .scale(colour);
console.log( d3.max(data, d =>  d.Fraction_SAR));
// update legend
legendGroup.call(legend);
legendGroup.selectAll('text').attr('fill', 'black');
// ######## legend setup #######

 
/* Adding line path of Fraction of SAR's ############
*/
// scales

const y_line = d3.scaleLinear().range([graphHeight, 0]);

console.log(x.bandwidth());

// d3 line path generator
const line = d3.line()
  .curve(d3.curveCardinal)
    .x(function(d){ return x(d.RatioBins)+(x.bandwidth())/2})
  .y(function(d){ return y_line(d.Fraction_SAR)});
  //.attr('fill', 'yellow')
 const yAxisGroup_line = graph.append('g')
  .attr('class', 'y-axis')
  .attr('transform', `translate(${graphWidth+10},0)`)
  .transition().duration(2500);

// line path element
const path = graph.append('path')
;


y_line.domain([0, d3.max(data, d =>  d.Fraction_SAR)]);
console.log(y_line);

// update path data
path.attr('fill', 'none')
.transition().duration(2500)  
  .attr('stroke', '#ff0000')
  .attr('stroke-width', '2')
  .attr('d', line(data))
  ;


 // create circles for points
const circles = graph.selectAll('circle')
  .data(data);


 // add new points
 circles.enter()
 .append('circle')
 .transition().duration(1500)
   .attr('r', '4')
   .attr('cx', d => x(d.RatioBins)+(x.bandwidth()/2))
   .attr('cy', d => y_line(d.Fraction_SAR))
   .attr('fill', '#ccc');
 
// create axes

 
const yAxis_line = d3.axisRight(y_line)
.ticks(10)
.tickFormat(d => d + '%');


// call axes

yAxisGroup_line.call(yAxis_line);
yAxisGroup_line.selectAll('text')
    .attr('fill', 'red');

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("transform",
    "translate(" + (580) + " ," + 
    (margin.top + 80) + ")") 
    .attr("y", margin.left)
    .attr("x", (graphHeight/6))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .html("&#8593; % SAR ") 

/* Adding line path of Fraction of SAR's ############
*/
    // text label for the x axis
 svg.append("text")   
 .attr("transform",
            "translate(" + (graphWidth/1.5  ) + " ," + 
                           (graphHeight + margin.top + 80) + ")")         
 .style("text-anchor", "middle")
 .attr("dy", "0em")
 .html(" &#8594; Interval in which RATIO_NUM_MT103_12M lies ")

 
 
// text label for the y axis
svg.append("text")
.attr("transform", "rotate(-90)")
.attr("transform",
            "translate(" + (- 80) + " ," + 
                           (margin.top + 80) + ")") 
.attr("y", margin.left)
.attr("x", (graphHeight/4))
.attr("dy", "1em")
.style("text-anchor", "middle")
.html(" Freq &#8593;")
;  
    
    
// Slider - simple
// Simple
var sensitivity = [0, 0.05, 0.1, 0.15, 0.2, 0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1];
var specificity = [0, 0.05, 0.1, 0.15, 0.2, 0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1];
var auc = [0, 0.05, 0.1, 0.15, 0.2, 0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1];

var sliderSimple = d3
  .sliderBottom()
  .min(d3.min(sensitivity))
  .max(d3.max(sensitivity))
  .width(300)
  .tickFormat(d3.format('.2%'))
  .ticks(5)
  .default(0.015)
  .on('onchange', val => {
    d3.select('p#value-simple').text(d3.format('.2%')(val));
  });

var gSimple = d3
  .select('div#slider-simple')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gSimple.call(sliderSimple);

d3.select('p#value-simple').text(d3.format('.2%')(sliderSimple.value()));
});