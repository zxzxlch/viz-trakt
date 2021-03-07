import { useEffect, useRef } from 'react';
import { select, selectAll } from 'd3-selection';
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
      .domain([0, 9])
      .range([margin.left, w - margin.right]);

    const y = scaleLinear()
      .domain([0, max(data)])
      .range([h - margin.bottom, margin.top]);

    // y-axis
    svg
      .select('.y-axis')
      .attr('stroke', '#D1D5DB')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '4 3')
      .selectAll('line')
      .data(y.ticks(4))
      .join('line')
      .attr('y1', (d) => 0.5 + y(d))
      .attr('y2', (d) => 0.5 + y(d))
      .attr('x1', margin.left)
      .attr('x2', w - margin.right);

    // draw line
    const ratingsLine = line<number>()
      .x((_d, index) => x(index))
      .y((d) => y(d))
      .curve(curve);

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('d', (d) => ratingsLine(d))
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .attr('stroke', 'url(#line-gradient)');

    const ratingsArea = area<number>()
      .x((_d, index) => x(index))
      .y0((d) => y(d))
      .y1(y(0))
      .curve(curve);

    // draw line points
    svg
      .selectAll('.point')
      .data(data, (_d, index) => index)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', (_d, index) => x(index))
      .attr('cy', (d) => y(d))
      .attr('r', 2)
      .attr('fill', 'url(#line-gradient');

    // draw area
    svg
      .selectAll('.area')
      .data([data])
      .join('path')
      .attr('d', (d) => ratingsArea(d))
      .attr('class', 'area')
      .attr('fill', 'url(#fill-gradient)')
      .attr('fill-opacity', 0.2);

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
