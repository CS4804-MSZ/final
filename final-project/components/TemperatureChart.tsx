"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type Row = {
    DATE: string;
    TMIN: number;
    TMAX: number;
};

export default function TemperatureChart({
                                             data,
                                             selectedDate,
                                             mode,
                                         }: {
    data: Row[];
    selectedDate: string | null;
    mode: "min" | "max";
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

        const temps =
            mode === "min"
                ? data.map((d) => ((+d.TMIN / 10) * 9) / 5 + 32)
                : data.map((d) => ((+d.TMAX / 10) * 9) / 5 + 32);

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(dates) as any)
            .range([0, W]);

        const yScale = d3
            .scaleLinear()
            .domain([d3.min(temps)! - 5, d3.max(temps)! + 5])
            .range([H, 0]);

        const line = d3
            .line<number>()
            .x((d, i) => xScale(dates[i]))
            .y((d) => yScale(d))
            .curve(d3.curveMonotoneX);

        const color = mode === "min" ? "#2c7bb6" : "#d44032";

        g.append("path")
            .datum(temps)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", line);

        g.append("g")
            .attr("transform", `translate(0,${H})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(6)
                    .tickFormat((d) => d3.timeFormat("%b %Y")(d as Date))
            );

        g.append("g").call(
            d3.axisLeft(yScale).ticks(6).tickFormat((d) => `${d}°F`)
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
        const sy = yScale(temps[selIdx]);

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
            .attr("fill", color)
            .attr("stroke", "#f4efe6")
            .attr("stroke-width", 2);
    }, [data, selectedDate, mode]);

    return <svg ref={svgRef} />;
}