import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import * as d3 from 'd3';
import { GeoJSON } from '../utils/types';
import { GeoJSONFeature } from 'maplibre-gl';

interface ScatterProps {
  data: GeoJSON,
  blockFid: number|null,
  selectedBlock:GeoJSONFeature|null,
  setSelectedBlock: Dispatch<SetStateAction<GeoJSONFeature|null>>,
  setBlockFid: Dispatch<SetStateAction<number|null>>,
  setBlockStat: Dispatch<SetStateAction<{[name: string]: number}|null>>
}

  const getColorFromBrackets = (d: GeoJSONFeature):string => {
    const gsi = d.properties['gsi']
    const m_lvl = d.properties['mean_lvl']
    if (gsi <= 0.15) {
      if (m_lvl <= 3 ) {
        return "rgb(0, 105, 4)"
      }
      if (m_lvl > 3 &&  m_lvl <= 9) {
        return "#009a6cff"
      }
      if (m_lvl > 9) {
        return "#00ffffff"
      }
    }
    if (gsi > 0.15 && gsi <= 0.3) {
      if (m_lvl <= 3 ) {
        return "#8da000ff"
      }
      if (m_lvl > 3 &&  m_lvl <= 9) {
        return "#3bb001ff"
      }
      if (m_lvl > 9) {
        return "#00ffaeff"
      }
    }
    if (gsi > 0.3) {
      if (m_lvl <= 3 ) {
        return "#ffb700ff"
      }
      if (m_lvl > 3 &&  m_lvl <= 9) {
        return "#b5de00ff"
      }
      if (m_lvl > 9) {
        return "#1eff00ff"
      }
    }
    return "rgb(180, 180, 180)"
      
  };

  const getOpac = (id:number|null):number => {
    if (id === null) {return 0.7} else return 0.25
  }



export const MinimalScatterplot= ({data,blockFid,selectedBlock,setSelectedBlock,setBlockStat,setBlockFid}:ScatterProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 360;
    const height = 520;
    const margin = 40;

    svg.attr('width', width).attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([0, 0.8])
      .range([margin, width-margin]);

    const yScale = d3.scaleLinear()
      .domain([0, 25])
      .range([height - margin, margin]);


  // Define specific tick values where you want dashed lines
  const xTickValues = [0.15, 0.3];
  const yTickValues = [3, 9];

  svg.append('text')
    .attr('x', width/2)
    .attr('y', height-8)
    .attr('text-anchor', 'middle')
    .attr('fill', '#ffffff')
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .style("font-family", "Arial, sans-serif")
    .text('GSI/BAR Процент застроенности');
  svg.append('text')
    .attr('x', -height/2)
    .attr('y', 14)
    .attr('text-anchor', 'middle')
    .attr('fill', '#ffffff')
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr("transform", "rotate(270)")
    .style("font-family", "Arial, sans-serif")
    .text('L Средняя этажность');

  // Add vertical dashed lines at specific x values
  svg.selectAll("line.vertical-dash")
    .data(xTickValues)
    .join("line")
    .attr("x1", d => xScale(d))
    .attr("y1", yScale.range()[0])  // bottom
    .attr("x2", d => xScale(d))
    .attr("y2", yScale.range()[1])  // top
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5")  // dash pattern: 5px dash, 5px gap
    .attr("opacity", 0.6);

  // Add horizontal dashed lines at specific y values
  svg.selectAll("line.horizontal-dash")
    .data(yTickValues)
    .join("line")
    .attr("x1", xScale.range()[0])
    .attr("y1", d => yScale(d))
    .attr("x2", xScale.range()[1])
    .attr("y2", d => yScale(d))
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5")
    .attr("opacity", 0.6);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin}, 0)`)
      .call(d3.axisLeft(yScale));

    // Add points
    svg.selectAll('circle')
      .data(data.features)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.properties['gsi']))
      .attr('cy', d => yScale(d.properties['mean_lvl']))
      .attr('r', d => Math.log2(d.properties['sqr']/1000))
      .attr('fill', d => getColorFromBrackets(d))
      .attr('stroke','black')
      .attr('stroke-width', 0.5)
      .attr('opacity', getOpac(blockFid))
      .on("click", function(d) {
        // setSelectedBlock(d)
        console.log(d)
        if (d.target.__data__) {
          const feature = d.target.__data__
          console.log('plotclick: ',)
          setSelectedBlock(d.target.__data__)
          setBlockStat({...feature.properties})
          setBlockFid(feature.properties.fid)
        } else {
          setBlockFid(null)
          setSelectedBlock(null)
        }
      })

    if (selectedBlock && blockFid !== null) {

        svg.selectAll("line.vertical-dash")
          .data(data.features.filter(f => f.properties.fid === blockFid))
          .join("line")
          .attr("x1", d => xScale(d.properties['gsi']))
          .attr("y1", yScale.range()[0])  // bottom
          .attr("x2", d => xScale(d.properties['gsi']))
          .attr("y2", yScale.range()[1])  // top
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")  // dash pattern: 5px dash, 5px gap
          .attr("opacity", 0.6);
        // Add horizontal dashed lines at specific y values
        svg.selectAll("line.horizontal-dash")
          .data(data.features.filter(f => f.properties.fid === blockFid))
          .join("line")
          .attr("x1", xScale.range()[0])
          .attr("y1", d => yScale(d.properties['mean_lvl']))
          .attr("x2", xScale.range()[1])
          .attr("y2", d => yScale(d.properties['mean_lvl']))
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("opacity", 0.6);
      svg.selectAll('select')
        .data(data.features.filter(f => f.properties.fid === blockFid))
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.properties['gsi']))
        .attr('cy', d => yScale(d.properties['mean_lvl']))
        .attr('r', d => Math.log2(d.properties['sqr']/1000))
        .attr('fill', d => getColorFromBrackets(d))
        .attr('stroke','white')
        .attr('stroke-width', 1.5)
        .attr('opacity', 1)
      svg.append('text')
        .attr('x', xScale.range()[1])
        .attr('y', yScale(selectedBlock.properties['mean_lvl']))
        .attr('text-anchor', 'left')
        .attr('alignment-baseline','middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-weight', '800')
        .text(Number(selectedBlock.properties['mean_lvl']).toFixed(1));
      svg.append('text')
        .attr('x', xScale(selectedBlock.properties['gsi']))
        .attr('y', yScale.range()[1])
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-weight', '800')
        .text(Number(selectedBlock.properties['gsi']).toFixed(2));
      svg.append('text')
        .attr('x', xScale.range()[1]-100)
        .attr('y', yScale.range()[1]-20)
        .attr('text-anchor', 'right')
        .attr('fill', '#ffffff')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .style("font-family", "Arial, sans-serif")
        .text(`квартал №${selectedBlock.properties['fid']}`);

    }

  }, [data, blockFid, selectedBlock, setSelectedBlock,setBlockStat, setBlockFid]);



  return <svg ref={svgRef}></svg>;
};

export default MinimalScatterplot;