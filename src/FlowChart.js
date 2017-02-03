import React, { Component } from 'react'


var d3 = require('d3');

export default class FlowChart extends Component {
  render() {
    return (
      <div id='chart'></div>
    )
  }

  componentDidMount () {
    update(this.props.graph);
  }

  componentDidUpdate (prevProps, prevState) {
    update(this.props.graph);
  }
}


function update(root) {

// For matching Refs
var regex = /ref\((.+)\)/;

	
var i = 0;
var tree = d3.layout.tree();


  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

var diagonal = d3.svg.diagonal()
	.source(d => {
		let rect = d.source.el.getBoundingClientRect();
		let target = d.target;
		if (regex.test(d.target.name)) {
			var realNode = nodes.find(node => regex.exec(d.target.name)[1] === node.name);
			target = realNode;
		}

		if (d.source.depth > target.depth) {
			return { x: d.source.x, y: d.source.y - (rect.width/2) }
		} else if (d.source.depth === target.depth) {
			return { x: d.source.x, y: d.source.y + (rect.width/2) }
		} else {
			return { x: d.source.x, y: d.source.y + (rect.width/2) }
		}
	})
	.target(d => {
		let rect = d.source.el.getBoundingClientRect();
		let target = d.target;
		if (regex.test(d.target.name)) {
			var realNode = nodes.find(node => regex.exec(d.target.name)[1] === node.name);
			target = realNode;
		}

		if (d.source.depth > target.depth) {
			return { x: target.x, y: target.y + (rect.width/2) }
		} else if (d.source.depth === target.depth) {
			return { x: target.x, y: target.y - (rect.width/2) }
		} else {
			return { x: target.x, y: target.y - (rect.width/2) }
		}

		
	})
	.projection(d => [d.y, d.x]);

var existingSvg = document.querySelector('#chart > svg');
if (existingSvg) existingSvg.remove();

var svg = d3.select("#chart").append("svg")
  .append("g")
	.attr("transform", "translate(100, 20)");

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 130; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, d => { 
		  return d.id || (d.id = ++i); 
		});

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
	  .attr("class", 'node')
	  .attr('view', d => d.type === 'action' ? d.parent.id : d.id )
	  .attr('opacity', d => {
		  if (regex.test(d.name)) {
			  return 0;
		  }
		  return 1;
	  })
	  .attr("transform", function(d) {

		  var viewDepth = d.viewDepth;

		if (regex.test(d.name)) {
			var realNode = nodes.find(node => regex.exec(d.name)[1] === node.name);
			viewDepth = realNode.viewDepth;
			d.y = realNode.y;
		//   d.x = realNode.x;
		//   d.y = realNode.y;
		}
		  
		var index = nodes.filter(node => node.viewDepth === viewDepth).reverse().indexOf(d);  

		
		let offset = (index + 1) * 40;
		d.x = offset;

		  if (d.type === 'action') {
			  d.y = d.parent.y;
		  } else if(!d.children){
			d.x += 40;
		  } 


		  

		  return "translate(" + d.y + "," + d.x + ")"; 
		});

  nodeEnter.append("line")
	  .attr("x1", d => {
		  return -75;
	  })
	  .attr("x2", d => 75)
	  .attr("y1", d => 20)
	  .attr("y2", d => 20)
	  .style("stroke", d => {
		//   if (d.parent && d.parent.children.indexOf(d) === d.parent.children.length - 1) return 'rgba(0,0,0,0)';

		  return 'black';
	  })
	  .style('stroke-dasharray', d => {
		return d.type==='action' ? '5,5' : '1,0';
	  });

  nodeEnter.append("text")
	  .attr("x", d => 0)
	  .attr("dy", ".35em")
	  .attr("text-anchor", d => 'middle')
	  .text(d => d.name)
    .on('mouseover', d => {
      console.log(d);
    })
	  .style("fill-opacity", 1);


  svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  // Declare the links…
  var link = svg.selectAll("path.link")
	.data(links, d => d.target.id)


	svg.selectAll('g.node')[0].forEach(el => {
		el.__data__.el = el;
	});

  // Enter the links.
  link.enter().append("path")
	  .attr("class", "link")
  	  .style("stroke", d => {
			if (d.target.type==='action') return 'rgba(0,0,0,0)';
			return 'black';
		})
	  .attr("d", diagonal)
	  .attr('marker-end', d => d.source.type === 'action' ? 'url(#end)' : '');


}
