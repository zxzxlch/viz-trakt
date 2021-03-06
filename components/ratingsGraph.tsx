import { useEffect, useRef } from 'react';
import { select, line, max, scaleLinear, curveNatural, axisBottom, area } from 'd3';
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

    const x = scaleLinear()
      .domain([0, 9])
      .range([margin.left, w - margin.right]);

    const y = scaleLinear()
      .domain([0, max(data)])
      .range([h - margin.bottom, margin.top]);

    const ratingsLine = line<number>()
      .x((_d, index) => x(index))
      .y((d) => y(d))
      .curve(curveNatural);

    const yAxis = axisBottom(x);

    svg.select('.x-axis').attr('transform', `translate(0, ${h})`).call(yAxis);

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('d', (d) => ratingsLine(d))
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'url(#line-gradient)');

    const ratingsArea = area<number>()
      .x((_d, index) => x(index))
      .y0((d) => y(d))
      .y1(y(0))
      .curve(curveNatural);

    svg
      .selectAll('.area')
      .data([data])
      .join('path')
      .attr('d', (d) => ratingsArea(d))
      .attr('class', 'area')
      .attr('fill', 'url(#line-gradient)')
      .attr('fill-opacity', 0.2);

    svg
      .selectAll('.point')
      .data(data, (_d, index) => index)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', (_d, index) => x(index))
      .attr('cy', (d) => y(d))
      .attr('r', 1.5)
      .attr('fill', 'url(#line-gradient');

    svg
      .select('#line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', x(0))
      .attr('y1', y(y.domain()[1]))
      .attr('x2', x(0))
      .attr('y2', y(0))
      .selectAll('stop')
      .data(
        [
          { offset: '0%', color: 'magenta' },
          { offset: '100%', color: 'gray' },
        ],
        (d) => d['offset'],
      )
      .join('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);
  }, [rating, distribution]);

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg">
      <svg
        className="w-full h-full"
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="x-axis"></g>
        <g className="y-axis"></g>
        <linearGradient id="line-gradient"></linearGradient>
      </svg>
    </div>
  );
}
