"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Modal, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import PrecipitationChart from "./PrecipitationChart";

/* =====================
   Geometry
===================== */

const TW = 170;
const TH = 500;

const marginTop = 34;
const marginBottom = 60;

const tubeW = 44;
const tubeTopY = 80;
const tubeBottomY = 440;
const tubeH = tubeBottomY - tubeTopY;

const bottomR = tubeW / 2;

/* Funnel */

const funnelTopY = 40;
const funnelLipRx = 46;
const funnelLipRy = 10;

const funnelNeckY = tubeTopY;
const funnelNeckW = tubeW * 0.92;

/* =====================
   Helpers
===================== */

const mmToIn = (mm: number) => mm / 25.4;

/* =====================
   Component
===================== */

export default function PrecipitationGauge({
                                               valueMM,
                                               isSnowy,
                                               data,
                                               selectedDate,
                                           }: {
    valueMM: number | null;
    isSnowy: boolean;
    data: any[];
    selectedDate: string | null;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const fillRef =
        useRef<d3.Selection<SVGRectElement, unknown, null, undefined> | null>(
            null
        );
    const prevRef = useRef<number>(0);

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg
            .attr("width", TW)
            .attr("height", TH)
            .attr("viewBox", `0 0 ${TW} ${TH}`)
            .style("filter", "drop-shadow(3px 6px 18px rgba(0,0,0,0.1))");

        const mmMax = 150;

        const mmToY = d3
            .scaleLinear()
            .domain([0, mmMax])
            .range([tubeBottomY, tubeTopY]);

        const cx = TW / 2;

        /* =====================
           defs
        ===================== */

        const defs = svg.append("defs");

        const glass = defs
            .append("linearGradient")
            .attr("id", "glass")
            .attr("x1", "0%")
            .attr("x2", "100%");

        glass.append("stop").attr("offset", "0%").attr("stop-color", "#dbe8f6");
        glass.append("stop").attr("offset", "45%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.35);
        glass.append("stop").attr("offset", "100%").attr("stop-color", "#cfe0f3");

        const water = defs
            .append("linearGradient")
            .attr("id", "water")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        water.append("stop").attr("offset", "0%").attr("stop-color", "#a8d1ff");
        water.append("stop").attr("offset", "100%").attr("stop-color", "#3d6fd1");

        /* =====================
           Tube clip
        ===================== */

        const clip = defs.append("clipPath").attr("id", "tube-clip");

        const tubeClipPath = [
            `M ${cx - tubeW / 2 + 2} ${tubeTopY}`,
            `L ${cx - tubeW / 2 + 2} ${tubeBottomY - bottomR}`,
            `A ${bottomR - 2} ${bottomR - 2} 0 0 0 ${cx} ${tubeBottomY - 2}`,
            `A ${bottomR - 2} ${bottomR - 2} 0 0 0 ${cx + tubeW / 2 - 2} ${tubeBottomY - bottomR}`,
            `L ${cx + tubeW / 2 - 2} ${tubeTopY}`,
            "Z",
        ].join(" ");

        clip.append("path").attr("d", tubeClipPath);

        /* =====================
           Funnel
        ===================== */

        svg
            .append("ellipse")
            .attr("cx", cx)
            .attr("cy", funnelTopY)
            .attr("rx", funnelLipRx)
            .attr("ry", funnelLipRy)
            .attr("fill", "#eef5ff")
            .attr("stroke", "#a9bfd8");

        const funnelPath = [
            `M ${cx - funnelLipRx} ${funnelTopY}`,
            `Q ${cx - funnelLipRx * 0.55} ${funnelTopY + 28} ${cx - funnelNeckW / 2} ${funnelNeckY}`,
            `L ${cx + funnelNeckW / 2} ${funnelNeckY}`,
            `Q ${cx + funnelLipRx * 0.55} ${funnelTopY + 28} ${cx + funnelLipRx} ${funnelTopY}`,
            "Z",
        ].join(" ");

        svg
            .append("path")
            .attr("d", funnelPath)
            .attr("fill", "url(#glass)")
            .attr("stroke", "#a9bfd8");

        /* =====================
           Tube
        ===================== */

        const tubePath = [
            `M ${cx - tubeW / 2} ${tubeTopY}`,
            `L ${cx - tubeW / 2} ${tubeBottomY - bottomR}`,
            `A ${bottomR} ${bottomR} 0 0 0 ${cx} ${tubeBottomY}`,
            `A ${bottomR} ${bottomR} 0 0 0 ${cx + tubeW / 2} ${tubeBottomY - bottomR}`,
            `L ${cx + tubeW / 2} ${tubeTopY}`,
            "Z",
        ].join(" ");

        svg
            .append("path")
            .attr("d", tubePath)
            .attr("fill", "url(#glass)")
            .attr("stroke", "#a9bfd8");

        /* =====================
           Water
        ===================== */

        fillRef.current = svg
            .append("rect")
            .attr("x", cx - tubeW / 2 + 2)
            .attr("y", tubeBottomY)
            .attr("width", tubeW - 4)
            .attr("height", 0)
            .attr("clip-path", "url(#tube-clip)")
            .attr("fill", "url(#water)");

        /* =====================
           Tube highlight
        ===================== */

        svg
            .append("rect")
            .attr("x", cx - tubeW / 2 + tubeW * 0.12)
            .attr("y", tubeTopY + 8)
            .attr("width", tubeW * 0.14)
            .attr("height", tubeH - 16)
            .attr("rx", 8)
            .attr("fill", "white")
            .attr("opacity", 0.22);

        /* =====================
           Scale ticks
        ===================== */

        /* =====================
           Scale ticks
        ===================== */

        d3.range(0, mmMax + 1, 10).forEach((mm) => {
            const y = mmToY(mm);
            const inches = mm / 25.4;

            /* left tick */
            svg
                .append("line")
                .attr("x1", cx - tubeW / 2 - 8)
                .attr("x2", cx - tubeW / 2 - 22)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "#555");

            /* left label (inches) */
            svg
                .append("text")
                .attr("x", cx - tubeW / 2 - 26)
                .attr("y", y + 4)
                .attr("text-anchor", "end")
                .attr("font-size", "11px")
                .text(inches.toFixed(1));

            /* right tick */
            svg
                .append("line")
                .attr("x1", cx + tubeW / 2 + 8)
                .attr("x2", cx + tubeW / 2 + 22)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "#555");

            /* right label (mm) */
            svg
                .append("text")
                .attr("x", cx + tubeW / 2 + 26)
                .attr("y", y + 4)
                .attr("font-size", "11px")
                .text(mm);
        });

        /* unit titles */

        svg.append("text")
            .attr("x", cx - tubeW / 2 - 26)
            .attr("y", tubeTopY - 14)
            .attr("text-anchor", "end")
            .attr("font-size", "13px")
            .attr("font-weight", "700")
            .attr("fill", "#333")
            .text("in");

        svg.append("text")
            .attr("x", cx + tubeW / 2 + 26)
            .attr("y", tubeTopY - 14)
            .attr("font-size", "13px")
            .attr("font-weight", "700")
            .attr("fill", "#333")
            .text("mm");
    }, []);

    /* =====================
       Fill animation
    ===================== */

    useEffect(() => {
        if (valueMM === null || !fillRef.current) return;

        const mm = Math.max(0, Math.min(150, valueMM));
        const start = prevRef.current;
        const startTime = Date.now();

        const mmToY = d3
            .scaleLinear()
            .domain([0, 150])
            .range([tubeBottomY, tubeTopY]);

        function frame() {
            const t = Math.min((Date.now() - startTime) / 1100, 1);

            const ease =
                t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const cur = start + (mm - start) * ease;
            const y = mmToY(cur);

            fillRef.current!
                .attr("y", y)
                .attr("height", tubeBottomY - y);

            if (t < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
        prevRef.current = mm;
    }, [valueMM]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Precipitation Chart For Full Date Range"
                centered
                size="xxl"
            >
                <PrecipitationChart data={data} selectedDate={selectedDate} />
            </Modal>

            <div className="thermo-card">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="thermo-title">Precipitation</div>

                    <Tooltip label="How does the precipitation hold up to the date range?">
                        <ActionIcon variant="subtle" size="sm" radius="xl" onClick={open}>
                            <IconInfoCircle size={16} />
                        </ActionIcon>
                    </Tooltip>
                </div>

                <svg ref={svgRef} />

                <div className="thermo-badge">
                    {valueMM === null ? (
                        "—"
                    ) : (
                        <>
                            <div className="f-val">{mmToIn(valueMM).toFixed(2)} in</div>
                            <div className="c-val">{valueMM.toFixed(1)} mm</div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}