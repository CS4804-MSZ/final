"use client";

import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";

const TW = 200;
const TH = 500;
const tubeW = 22;
const bulbR = 28;
const tubeTopY = 60;
const bulbCY = TH - 60;
const tubeBottomY = bulbCY - bulbR + 4;
const tubeH = tubeBottomY - tubeTopY;

const fMin = -20;
const fMax = 120;

const fToC = (f: number) => (f - 32) * 5 / 9;

export default function Thermometer({
                         id,
                         title,
                         valueF,
                     }: {
    id: "min" | "max";
    title: string;
    valueF: number | null;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const mercuryRef =
        useRef<d3.Selection<SVGRectElement, unknown, null, undefined> | null>(null);
    const prevRef = useRef<number | null>(null);

    /* ---------- build SVG once ---------- */
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg
            .attr("width", TW)
            .attr("height", TH)
            .attr("viewBox", `0 0 ${TW} ${TH}`)
            .style("filter", "drop-shadow(3px 6px 18px rgba(0,0,0,0.1))");

        const fToY = d3
            .scaleLinear()
            .domain([fMin, fMax])
            .range([tubeBottomY, tubeTopY]);

        /* ---------- defs ---------- */
        const defs = svg.append("defs");

        const mercGrad = defs
            .append("linearGradient")
            .attr("id", `mercGrad-${id}`)
            .attr("x1", "0%")
            .attr("x2", "100%");

        mercGrad.append("stop").attr("class", "merc-stop-left").attr("offset", "0%");
        mercGrad.append("stop").attr("class", "merc-stop-mid").attr("offset", "50%");
        mercGrad.append("stop").attr("class", "merc-stop-right").attr("offset", "100%");

        const glassGrad = defs
            .append("linearGradient")
            .attr("id", `glassGrad-${id}`)
            .attr("x1", "0%")
            .attr("x2", "100%");

        glassGrad.append("stop").attr("offset", "0%").attr("stop-color", "#d4eaff").attr("stop-opacity", 0.9);
        glassGrad.append("stop").attr("offset", "40%").attr("stop-color", "#eef6ff").attr("stop-opacity", 0.5);
        glassGrad.append("stop").attr("offset", "100%").attr("stop-color", "#c8dff0").attr("stop-opacity", 0.7);

        defs
            .append("clipPath")
            .attr("id", `clip-${id}`)
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2 + 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW - 4)
            .attr("height", tubeH);

        /* ---------- tube ---------- */
        svg
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW)
            .attr("height", tubeH)
            .attr("rx", tubeW / 2)
            .attr("fill", "#e8f0f8")
            .attr("stroke", "#b0c4de");

        /* ---------- mercury ---------- */
        mercuryRef.current = svg
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2 + 2)
            .attr("y", tubeBottomY)
            .attr("width", tubeW - 4)
            .attr("height", 0)
            .attr("clip-path", `url(#clip-${id})`);

        /* ---------- glass overlay ---------- */
        svg
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW)
            .attr("height", tubeH)
            .attr("rx", tubeW / 2)
            .attr("fill", `url(#glassGrad-${id})`)
            .attr("stroke", "#b0c4de")
            .attr("pointer-events", "none");

        /* ---------- freeze line ---------- */
        const fy32 = fToY(32);
        svg
            .append("line")
            .attr("class", "freeze-line")
            .attr("x1", TW / 2 - tubeW / 2 - 22)
            .attr("x2", TW / 2 + tubeW / 2 + 22)
            .attr("y1", fy32)
            .attr("y2", fy32)
            .attr("stroke", "#3355FF");

        svg
            .append("text")
            .attr("x", TW / 2 + tubeW / 2 + 26)
            .attr("y", fy32 + 4)
            .attr("font-size", "10px")
            .attr("fill", "#3355FF")
            .attr("alignment-baseline", "middle")
            .text("freezing");

        /* ---------- bulb ---------- */
        svg
            .append("circle")
            .attr("class", "bulb")
            .attr("cx", TW / 2)
            .attr("cy", bulbCY)
            .attr("r", bulbR)
            .attr("fill", "#ff6b6b")
            .attr("stroke", "#c0392b");

        /* ---------- ticks ---------- */
        d3.range(fMin, fMax + 1, 20).forEach((f) => {
            const y = fToY(f);
            svg
                .append("text")
                .attr("x", TW / 2 - tubeW / 2 - 22)
                .attr("y", y + 4)
                .attr("text-anchor", "end")
                .attr("font-size", "11px")
                .text(`${f}°`);
        });
    }, [id]);

    /* ---------- animate mercury ---------- */
    useEffect(() => {
        if (valueF === null || !mercuryRef.current || !svgRef.current) return;

        const targetF = valueF;
        const start = prevRef.current ?? targetF;
        const startTime = Date.now();

        const fToY = d3.scaleLinear().domain([fMin, fMax]).range([tubeBottomY, tubeTopY]);

        const svg = d3.select(svgRef.current);

        const isHot = targetF >= 32;
        const col1 = isHot ? "#c0392b" : "#1a5fa8";
        const col2 = isHot ? "#ff6b6b" : "#4d9de0";
        const col3 = isHot ? "#e74c3c" : "#2c7bb6";

        svg.selectAll(".merc-stop-left").attr("stop-color", col1);
        svg.selectAll(".merc-stop-mid").attr("stop-color", col2);
        svg.selectAll(".merc-stop-right").attr("stop-color", col3);
        svg.select(".bulb").attr("fill", col2).attr("stroke", col1);

        function frame() {
            const t = Math.min((Date.now() - startTime) / 1400, 1);
            const ease =
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const cur = start + (targetF - start) * ease;
            const y = fToY(cur);

            mercuryRef.current!
                .attr("fill", `url(#mercGrad-${id})`)
                .attr("y", y)
                .attr("height", tubeBottomY - y + 4);

            if (t < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
        prevRef.current = targetF;
    }, [valueF, id]);

    return (
        <>

            <div className="thermo-card">
                <div className="thermo-title">{title}</div>
                <svg ref={svgRef}/>
                <div className="thermo-badge">
                    <div className="f-val">{valueF === null ? "—" : `${valueF.toFixed(1)}°F`}</div>
                    <div className="c-val">{valueF === null ? "—" : `${fToC(valueF).toFixed(1)}°C`}</div>
                </div>
            </div>
        </>
    );
}