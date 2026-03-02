"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type Props = {
    id: string;
    gradId: string;
};

export default function Thermometer({ id, gradId }: Props) {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // =====================
        // GEOMETRY
        // =====================
        const TW = 200, TH = 500;
        const tubeX = TW / 2;
        const tubeW = 22;
        const bulbR = 28;
        const bulbCY = TH - 60;
        const tubeTopY = 60;
        const tubeBottomY = bulbCY - bulbR + 4;
        const tubeH = tubeBottomY - tubeTopY;

        const fMin = -20, fMax = 120;
        const fToY = d3.scaleLinear()
            .domain([fMin, fMax])
            .range([tubeBottomY, tubeTopY]);

        const fTicks = d3.range(fMin, fMax + 1, 20);
        const cTicks = d3.range(-30, 51, 10);
        const cToF = (c: number) => c * 9 / 5 + 32;

        // =====================
        // SVG SETUP
        // =====================
        const svg = d3.select(`#${id}`)
            .attr("width", TW)
            .attr("height", TH)
            .attr("viewBox", `0 0 ${TW} ${TH}`)
            .style("filter", "drop-shadow(3px 6px 18px rgba(0,0,0,0.1))");

        const defs = svg.append("defs");

        // Mercury gradient
        const grad = defs.append("linearGradient")
            .attr("id", `mercGrad-${gradId}`)
            .attr("x1", "0%")
            .attr("x2", "100%");

        grad.append("stop").attr("class", "merc-stop-left").attr("offset", "0%");
        grad.append("stop").attr("class", "merc-stop-mid").attr("offset", "50%");
        grad.append("stop").attr("class", "merc-stop-right").attr("offset", "100%");

        // Glass gradient
        const glass = defs.append("linearGradient")
            .attr("id", `glassGrad-${gradId}`)
            .attr("x1", "0%")
            .attr("x2", "100%");

        glass.append("stop").attr("offset", "0%").attr("stop-color", "#d4eaff").attr("stop-opacity", 0.9);
        glass.append("stop").attr("offset", "40%").attr("stop-color", "#eef6ff").attr("stop-opacity", 0.5);
        glass.append("stop").attr("offset", "100%").attr("stop-color", "#c8dff0").attr("stop-opacity", 0.7);

        defs.append("clipPath")
            .attr("id", `clip-${gradId}`)
            .append("rect")
            .attr("x", tubeX - tubeW / 2 + 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW - 4)
            .attr("height", tubeH);

        // Tube
        svg.append("rect")
            .attr("x", tubeX - tubeW / 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW)
            .attr("height", tubeH)
            .attr("rx", tubeW / 2)
            .attr("ry", tubeW / 2)
            .attr("fill", "#e8f0f8")
            .attr("stroke", "#b0c4de")
            .attr("stroke-width", 1.5);

        // Mercury
        svg.append("rect")
            .attr("class", "mercury")
            .attr("x", tubeX - tubeW / 2 + 2)
            .attr("y", tubeBottomY)
            .attr("width", tubeW - 4)
            .attr("height", 0)
            .attr("clip-path", `url(#clip-${gradId})`)
            .attr("fill", `url(#mercGrad-${gradId})`);

        // Glass overlay
        svg.append("rect")
            .attr("x", tubeX - tubeW / 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW)
            .attr("height", tubeH)
            .attr("rx", tubeW / 2)
            .attr("ry", tubeW / 2)
            .attr("fill", `url(#glassGrad-${gradId})`)
            .attr("stroke", "#b0c4de")
            .attr("stroke-width", 1.5)
            .attr("pointer-events", "none");

        // Freeze line
        const fy32 = fToY(32);
        svg.append("line")
            .attr("class", "freeze-line")
            .attr("x1", tubeX - tubeW / 2 - 22)
            .attr("x2", tubeX + tubeW / 2 + 22)
            .attr("y1", fy32)
            .attr("y2", fy32)
            .attr("stroke", "#3355FF");

        // Bulb
        svg.append("circle")
            .attr("class", "bulb")
            .attr("cx", tubeX)
            .attr("cy", bulbCY)
            .attr("r", bulbR)
            .attr("stroke-width", 2);

        // Ticks
        fTicks.forEach(f => {
            const y = fToY(f);
            svg.append("line")
                .attr("x1", tubeX - tubeW / 2 - 2)
                .attr("x2", tubeX - tubeW / 2 - 18)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "#555");

            svg.append("text")
                .attr("x", tubeX - tubeW / 2 - 22)
                .attr("y", y + 4)
                .attr("text-anchor", "end")
                .attr("font-size", "11px")
                .text(`${f}°`);
        });

        cTicks.forEach(c => {
            const f = cToF(c);
            if (f < fMin || f > fMax) return;
            const y = fToY(f);
            svg.append("line")
                .attr("x1", tubeX + tubeW / 2 + 2)
                .attr("x2", tubeX + tubeW / 2 + 18)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "#555");

            svg.append("text")
                .attr("x", tubeX + tubeW / 2 + 22)
                .attr("y", y + 4)
                .attr("text-anchor", "start")
                .attr("font-size", "11px")
                .text(`${c}°`);
        });
    }, [id, gradId]);

    return <svg id={id} />;
}