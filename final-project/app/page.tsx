"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import Thermometer, { ThermometerHandle } from "@/components/Thermometer";

export default function Page() {
    const initialized = useRef(false);

    const thermos = useRef<{
        min?: ThermometerHandle;
        max?: ThermometerHandle;
    }>({});

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        let prevMin: number | undefined;
        let prevMax: number | undefined;

        const fToC = (f: number) => (f - 32) * 5 / 9;

        const fMin = -20, fMax = 120;
        const tubeBottomY = 500 - 60 - 28 + 4;
        const tubeTopY = 60;

        const fToY = d3.scaleLinear()
            .domain([fMin, fMax])
            .range([tubeBottomY, tubeTopY]);

        d3.csv("/synthetic_weather.csv").then(raw => {
            const allData = raw
                .map(d => ({
                    DATE: d.DATE as string,
                    TMAX: d.TMAX !== "" ? (+d.TMAX! / 10) * 9 / 5 + 32 : null,
                    TMIN: d.TMIN !== "" ? (+d.TMIN! / 10) * 9 / 5 + 32 : null,
                }))
                .filter(d => d.TMAX !== null && d.TMIN !== null) as any[];

            const step = Math.max(1, Math.floor(allData.length / 300));
            const sampled = allData.filter((_, i) => i % step === 0);

            const sel = d3.select<HTMLSelectElement, unknown>("#date-select");
            sel.append("option").attr("value", "").text("— choose a date —");
            sampled.forEach(d => sel.append("option").attr("value", d.DATE).text(d.DATE));

            document.getElementById("loading")!.style.display = "none";
            document.getElementById("app")!.style.display = "flex";

            sel.on("change", function () {
                const date = (this as HTMLSelectElement).value;
                if (!date) return;
                const row = allData.find(d => d.DATE === date);
                if (!row) return;

                document.getElementById("day-info")!.innerHTML =
                    `<strong>${date}</strong> · Min: <strong>${row.TMIN.toFixed(1)}°F</strong> · Max: <strong>${row.TMAX.toFixed(1)}°F</strong>`;

                setTemp(thermos.current.min!, row.TMIN, prevMin, "min");
                setTemp(thermos.current.max!, row.TMAX, prevMax, "max");

                updateBadge("badge-min", row.TMIN);
                updateBadge("badge-max", row.TMAX);

                prevMin = row.TMIN;
                prevMax = row.TMAX;
            });
        });

        function setTemp(
            thermo: ThermometerHandle,
            targetF: number,
            prevF?: number,
            gradId?: string,
            duration = 1400
        ) {
            const mercury = thermo.mercury;
            const svgSel = thermo.svg;

            const isHot = targetF >= 32;
            const col1 = isHot ? "#c0392b" : "#1a5fa8";
            const col2 = isHot ? "#ff6b6b" : "#4d9de0";
            const col3 = isHot ? "#e74c3c" : "#2c7bb6";

            svgSel.selectAll(".merc-stop-left").attr("stop-color", col1);
            svgSel.selectAll(".merc-stop-mid").attr("stop-color", col2);
            svgSel.selectAll(".merc-stop-right").attr("stop-color", col3);
            svgSel.select(".bulb").attr("fill", col2).attr("stroke", col1);
            svgSel.select(".bulb-patch").attr("fill", col2);

            mercury.attr("fill", `url(#mercGrad-${gradId})`);

            const startF = prevF ?? targetF;
            const startTime = Date.now();

            function frame() {
                const t = Math.min((Date.now() - startTime) / duration, 1);
                const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                const curF = startF + (targetF - startF) * ease;
                const y = fToY(curF);
                mercury.attr("y", y).attr("height", tubeBottomY - y + 4);
                if (t < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }

        function updateBadge(id: string, f: number) {
            const el = document.getElementById(id)!;
            el.querySelector(".f-val")!.textContent = `${f.toFixed(1)}°F`;
            el.querySelector(".c-val")!.textContent = `${fToC(f).toFixed(1)}°C`;
            el.className = `thermo-badge ${f >= 32 ? "badge-hot" : "badge-cold"}`;
        }
    }, []);

    return (
        <>
            {/* CSS + DOM STRUCTURE UNCHANGED */}
            {/* (exact same JSX you already had for header, date picker, badges, etc.) */}

            {/* ONLY change below is the two Thermometer components */}
            <div className="thermo-section">
                <div className="thermo-card">
                    <div className="thermo-title">Min Temp of Day</div>
                    <Thermometer id="thermo-min" gradId="min" onReady={h => (thermos.current.min = h)} />
                    <div className="thermo-badge" id="badge-min">
                        <div className="f-val">—</div>
                        <div className="c-val">—</div>
                    </div>
                </div>

                <div className="thermo-card">
                    <div className="thermo-title">Max Temp of Day</div>
                    <Thermometer id="thermo-max" gradId="max" onReady={h => (thermos.current.max = h)} />
                    <div className="thermo-badge" id="badge-max">
                        <div className="f-val">—</div>
                        <div className="c-val">—</div>
                    </div>
                </div>
            </div>
        </>
    );
}