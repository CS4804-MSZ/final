"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type Row = {
    DATE: string;
    PRCP: number;
};

export default function PrecipitationChart({
                                               data,
                                               selectedDate,
                                           }: {
    data: Row[];
    selectedDate: string | null;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        const svg = d3.select(svgRef.current);

        const margin = { top: 24, right: 28, bottom: 50, left: 60 };
        const totalW = 800;
        const totalH = 300;

        const W = totalW - margin.left - margin.right;
        const H = totalH - margin.top - margin.bottom;

        svg.attr("width", totalW).attr("height", totalH);
        svg.selectAll("*").remove();

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const parseDate = d3.timeParse("%Y-%m-%d");

        const dates = data.map((d) => parseDate(d.DATE)!);
        const precips = data.map((d) => +d.PRCP || 0);

        const xScale = d3.scaleTime().domain(d3.extent(dates) as any).range([0, W]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(precips)! * 1.1])
            .range([H, 0]);

        const line = d3
            .line<number>()
            .x((d, i) => xScale(dates[i]))
            .y((d) => yScale(d))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(precips)
            .attr("fill", "none")
            .attr("stroke", "#c5b9a8")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.35)
            .attr("d", line);

        g.append("g")
            .attr("transform", `translate(0,${H})`)
            .call(
                d3.axisBottom(xScale)
                    .ticks(6)
                    .tickFormat((d) => d3.timeFormat("%b %Y")(d as Date))
            );
        g.append("g").call(
            d3.axisLeft(yScale).ticks(4).tickFormat((d) => `${d} mm`)
        );

        g.select(".domain").attr("stroke", "#ccc");
        g.selectAll(".tick line").attr("stroke", "#e0e0e0");

        if (!selectedDate) return;

        const selDate = parseDate(selectedDate);

        const selIdx = d3.leastIndex(dates, (d) =>
            Math.abs((d as any) - (selDate as any))
        );

        if (selIdx == null) return;

        const sx = xScale(dates[selIdx]);
        const sy = yScale(precips[selIdx]);

        g.append("line")
            .attr("x1", sx)
            .attr("x2", sx)
            .attr("y1", 0)
            .attr("y2", H)
            .attr("stroke", "#1c1c1c")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0.7);

        g.append("circle")
            .attr("cx", sx)
            .attr("cy", sy)
            .attr("r", 6)
            .attr("fill", "#1c1c1c")
            .attr("stroke", "#f4efe6")
            .attr("stroke-width", 2);
    }, [data, selectedDate]);

    return <svg ref={svgRef} />;
}