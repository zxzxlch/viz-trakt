import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line, area, curveCardinal } from 'd3-shape';
import { IRatingDistribution } from '../lib/types';

type Props = {
  rating: number;
  votes: number;
  distribution: IRatingDistribution;
};

const w = 400;
const h = 120;

export default function RatingsGraph({ rating, votes, distribution }: Props) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!distribution) return;

    const svg = select(svgRef.current);
    const data = distribution;
    const margin = { top: 10, right: 5, bottom: 5, left: 5 };
    const curve = curveCardinal;

    // scales
    const x = scaleLinear()
      .domain([1, 10])
      .range([margin.left, w - margin.right]);

    const y = scaleLinear()
      .domain([0, max(data)])
      .range([h - margin.bottom, margin.top]);

    // x-axis
    svg
      .select('.x-axis')
      .attr('stroke', '#D1D5DB')
      .attr('stroke-width', 0.5)
      .selectAll('line')
      .data(x.ticks(10))
      .join('line')
      .attr('x1', (d) => 0.5 + x(d))
      .attr('x2', (d) => 0.5 + x(d))
      .attr('y1', margin.top)
      .attr('y2', h - margin.bottom);

    // y-axis
    const yAxisScale = scaleLinear()
      .domain([0, 1])
      .range([margin.top, h - margin.bottom]);
    svg
      .select('.y-axis')
      .attr('stroke', '#D1D5DB')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2')
      .selectAll('line')
      .data([0, 0.25, 0.5, 0.75, 1])
      .join('line')
      .attr('y1', (d) => 0.5 + yAxisScale(d))
      .attr('y2', (d) => 0.5 + yAxisScale(d))
      .attr('x1', margin.left)
      .attr('x2', w - margin.right);

    // draw line
    const ratingsLine = line<number>()
      .x((_d, index) => x(index + 1))
      .y((d) => y(d))
      .curve(curve);

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('d', (d) => ratingsLine(d))
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', 3.5)
      .attr('stroke', 'url(#line-gradient)');

    const ratingsArea = area<number>()
      .x((_d, index) => x(index + 1))
      .y0((d) => y(d))
      .y1(y(0))
      .curve(curve);

    // draw line points
    // svg
    //   .selectAll('.point')
    //   .data(data, (_d, index) => index)
    //   .join('circle')
    //   .attr('class', 'point')
    //   .attr('cx', (_d, index) => x(index))
    //   .attr('cy', (d) => y(d))
    //   .attr('r', 2)
    //   .attr('fill', 'url(#line-gradient');

    // draw area
    svg
      .selectAll('.area')
      .data([data])
      .join('path')
      .attr('d', (d) => ratingsArea(d))
      .attr('class', 'area')
      .attr('fill', 'url(#fill-gradient)')
      .attr('fill-opacity', 0.2);

    // draw rating line
    svg
      .selectAll('.rating-line')
      .data([rating])
      .join('line')
      .attr('class', 'rating-line')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-dasharray', '3 2')
      .attr('stroke-width', 1)
      .attr('x1', (d) => 0.5 + x(d))
      .attr('x2', (d) => 0.5 + x(d))
      .attr('y1', margin.top)
      .attr('y2', h - margin.bottom);

    // gradients
    const createGradient = (className: string) => {
      return svg
        .select(`#${className}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', x(0))
        .attr('y1', y(0))
        .attr('x2', x(0))
        .attr('y2', y(y.domain()[1]))
        .selectAll('stop')
        .data(
          [
            { offset: '0%', color: '#D1D5DB', opacity: '0' },
            { offset: '20%', color: '#93C5FD', opacity: '0.7' },
            { offset: '65%', color: '#A78BFA', opacity: '0.8' },
            { offset: '98%', color: '#F472B6', opacity: '1' },
            { offset: '100%', color: '#F472B6', opacity: '1' },
          ],
          (d) => d['offset'],
        )
        .join('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color);
    };

    createGradient('line-gradient').attr('stop-opacity', 1);
    createGradient('fill-gradient').attr('stop-opacity', (d) => d.opacity);
  }, [rating, distribution]);

  return (
    <div className="w-full h-full">
      <svg
        className="w-full h-full"
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="x-axis"></g>
        <g className="y-axis"></g>
        <linearGradient id="line-gradient"></linearGradient>
        <linearGradient id="fill-gradient"></linearGradient>
      </svg>
    </div>
  );
}
