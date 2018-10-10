import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as chroma from 'chroma-js';
import * as d3 from 'd3';
import { Mat1DVal, Mat2DVal } from '../../../types';

@Component({
  selector: 'twittalyzer-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnChanges {
  @Input() width = 800;
  @Input() height = 600;
  @Input() hourly: Mat1DVal[];
  @Input() weekly: Mat1DVal[];
  @Input() matrix: Mat2DVal[];
  @Input() margin = {
    top: 75,
    right: 15,
    bottom: 125,
    left: 85
  };

  daynames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  times = ['12A', '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A',
           '12P', '1P', '2P', '3P', '4P', '5P', '6P', '7P', '8P', '9P', '10P', '11P'];
  colorscale = chroma.scale(['blue', 'purple', 'black', 'orange', 'red']).domain([-1, 1]);

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Absolutely MASSIVE credit to https://codepen.io/bonham000/pen/RRVLOb
    // I would not have been able to get this done without it. The code below
    // is still very much my own, but it bears a resemblance to the code at the
    // link.

    if (this.matrix.length === 0 || this.weekly.length === 0 || this.hourly.length === 0) {
      return;
    }

    const x = d3.scaleLinear().range([0, this.width]).domain([0, 23]);
    const y = d3.scaleLinear().range([0, this.height]).domain([0, 6]);

    // Add chart element
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Base heatmap
    svg.selectAll('svg')
      .data(this.matrix)
      .enter()
      .append('rect')
      .attr('class', 'tile')
      .attr('x', d => parseInt(d.y) * ((this.width - this.margin.left - this.margin.right) / 24))
      .attr('y', d => parseInt(d.x) * ((this.height - this.margin.top - this.margin.bottom) / 7))
      .attr('width', (this.width - this.margin.left - this.margin.right) / 24)
      .attr('height', (this.height - this.margin.top - this.margin.bottom) / 7)
      .style('fill', d => {
        return this.colorscale(d.val).hex();
      });

    // x axis
    svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0, ${this.height - this.margin.top - this.margin.bottom})`);
  }
}