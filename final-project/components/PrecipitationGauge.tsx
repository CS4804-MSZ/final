"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {useDisclosure} from "@mantine/hooks";
import {ActionIcon, Modal, Tooltip} from "@mantine/core";
import {IconInfoCircle} from "@tabler/icons-react";
import PrecipitationChart from "./PrecipitationChart";

/* =====================
   Shared geometry
   ===================== */

const TW = 150;
const TH = 500;
const tubeW = 22;
const tubeTopY = 60;
const bulbCY = TH - 60;
const tubeBottomY = bulbCY - 28 + 4;
const tubeH = tubeBottomY - tubeTopY;

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
                                               selectedDate
                                           }: {
    valueMM: number | null;
    isSnowy: boolean;
    data: any[];
    selectedDate: string | null;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const fillRef = useRef<d3.Selection<SVGRectElement, unknown, null, undefined> | null>(null);
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

        const defs = svg.append("defs");

        const glass = defs
            .append("linearGradient")
            .attr("id", "precip-glass")
            .attr("x1", "0%")
            .attr("x2", "100%");

        glass.append("stop").attr("offset", "0%").attr("stop-color", "#d4eaff").attr("stop-opacity", 0.9);
        glass.append("stop").attr("offset", "40%").attr("stop-color", "#eef6ff").attr("stop-opacity", 0.5);
        glass.append("stop").attr("offset", "100%").attr("stop-color", "#c8dff0").attr("stop-opacity", 0.7);

        defs
            .append("clipPath")
            .attr("id", "precip-clip")
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2 + 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW - 4)
            .attr("height", tubeH);

        // Tube background
        svg
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW)
            .attr("height", tubeH)
            .attr("rx", tubeW / 2)
            .attr("fill", "#e8f0f8")
            .attr("stroke", "#b0c4de");

        // Fill
        fillRef.current = svg
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2 + 2)
            .attr("y", tubeBottomY)
            .attr("width", tubeW - 4)
            .attr("height", 0)
            .attr("clip-path", "url(#precip-clip)")
            .attr("fill", "#9ec9f3");

        // Glass overlay
        svg
            .append("rect")
            .attr("x", TW / 2 - tubeW / 2)
            .attr("y", tubeTopY)
            .attr("width", tubeW)
            .attr("height", tubeH)
            .attr("rx", tubeW / 2)
            .attr("fill", "url(#precip-glass)")
            .attr("stroke", "#b0c4de")
            .attr("pointer-events", "none");

        // Ticks
        d3.range(0, mmMax + 1, 25).forEach(mm => {
            const y = mmToY(mm);
            svg.append("line")
                .attr("x1", TW / 2 - tubeW / 2 - 6)
                .attr("x2", TW / 2 - tubeW / 2 - 18)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "#555");

            svg.append("text")
                .attr("x", TW / 2 - tubeW / 2 - 22)
                .attr("y", y + 4)
                .attr("text-anchor", "end")
                .attr("font-size", "11px")
                .text(mm);
        });

    }, []);

    useEffect(() => {
        if (valueMM === null || !fillRef.current) return;

        const mm = Math.max(0, Math.min(150, valueMM));
        const start = prevRef.current;
        const startTime = Date.now();

        const mmToY = d3
            .scaleLinear()
            .domain([0, 150])
            .range([tubeBottomY, tubeTopY]);

        const color = isSnowy ? "#f7fbff" : "#3a54c5";

        function frame() {
            const t = Math.min((Date.now() - startTime) / 1200, 1);
            const ease = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const cur = start + (mm - start) * ease;
            const y = mmToY(cur);

            fillRef.current!
                .attr("fill", color)
                .attr("y", y)
                .attr("height", tubeBottomY - y + 4);

            if (t < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
        prevRef.current = mm;

    }, [valueMM, isSnowy]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Precipitation Chart For Full Date Range"
                centered
                size="xxl"
            >
                <PrecipitationChart
                    data={data}
                    selectedDate={selectedDate}
                />
            </Modal>

            <div className="thermo-card">

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    <div className="thermo-title">Precipitation</div>

                    <Tooltip label="How does the precipitation hold up to the date range?">
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            radius="xl"
                            onClick={open}
                        >
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