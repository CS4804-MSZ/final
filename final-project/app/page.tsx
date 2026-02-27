"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

/**
 * IMPORTANT FIXES:
 * 1) CSV path MUST be "/synthetic_weather.csv" (Next.js serves /public at root)
 * 2) Styling is copied 1:1 from original HTML and injected via <style>
 * 3) DOM structure now exactly matches the original HTML
 */

export default function Page() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // =====================
    // THERMOMETER GEOMETRY
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
    const fToC = (f: number) => (f - 32) * 5 / 9;

    // =====================
    // BUILD THERMOMETER
    // =====================
    function buildThermometer(id: string, gradId: string) {
      const svg = d3.select(`#${id}`)
          .attr("width", TW)
          .attr("height", TH)
          .attr("viewBox", `0 0 ${TW} ${TH}`)
          .style("filter", "drop-shadow(3px 6px 18px rgba(0,0,0,0.1))");

      const defs = svg.append("defs");

      const grad = defs.append("linearGradient")
          .attr("id", `mercGrad-${gradId}`)
          .attr("x1", "0%")
          .attr("x2", "100%");

      grad.append("stop").attr("class", "merc-stop-left").attr("offset", "0%");
      grad.append("stop").attr("class", "merc-stop-mid").attr("offset", "50%");
      grad.append("stop").attr("class", "merc-stop-right").attr("offset", "100%");

      const glass = defs.append("linearGradient")
          .attr("id", `glassGrad-${gradId}`)
          .attr("x1", "0%")
          .attr("x2", "100%");

      glass.append("stop").attr("offset", "0%")
          .attr("stop-color", "#d4eaff").attr("stop-opacity", 0.9);
      glass.append("stop").attr("offset", "40%")
          .attr("stop-color", "#eef6ff").attr("stop-opacity", 0.5);
      glass.append("stop").attr("offset", "100%")
          .attr("stop-color", "#c8dff0").attr("stop-opacity", 0.7);

      defs.append("clipPath")
          .attr("id", `clip-${gradId}`)
          .append("rect")
          .attr("x", tubeX - tubeW / 2 + 2)
          .attr("y", tubeTopY)
          .attr("width", tubeW - 4)
          .attr("height", tubeH);

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

      const mercury = svg.append("rect")
          .attr("class", "mercury")
          .attr("x", tubeX - tubeW / 2 + 2)
          .attr("y", tubeBottomY)
          .attr("width", tubeW - 4)
          .attr("height", 0)
          .attr("clip-path", `url(#clip-${gradId})`);

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

      const fy32 = fToY(32);
      svg.append("line")
          .attr("class", "freeze-line")
          .attr("x1", tubeX - tubeW / 2 - 22)
          .attr("x2", tubeX + tubeW / 2 + 22)
          .attr("y1", fy32)
          .attr("y2", fy32)
          .attr("stroke", "#3355FF");

      svg.append("circle")
          .attr("class", "bulb")
          .attr("cx", tubeX)
          .attr("cy", bulbCY)
          .attr("r", bulbR)
          .attr("stroke-width", 2);

      fTicks.forEach(f => {
        const y = fToY(f);
        svg.append("line")
            .attr("x1", tubeX - tubeW / 2 - 2)
            .attr("x2", tubeX - tubeW / 2 - 18)
            .attr("y1", y).attr("y2", y)
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
            .attr("y1", y).attr("y2", y)
            .attr("stroke", "#555");

        svg.append("text")
            .attr("x", tubeX + tubeW / 2 + 22)
            .attr("y", y + 4)
            .attr("text-anchor", "start")
            .attr("font-size", "11px")
            .text(`${c}°`);
      });

      return { svg, mercury };
    }

    const thermos = {
      min: buildThermometer("thermo-min", "min"),
      max: buildThermometer("thermo-max", "max"),
    };

    let prevMin: number | undefined;
    let prevMax: number | undefined;

    // =====================
    // CSV LOAD (FIXED PATH)
    // =====================
    d3.csv("/synthetic_weather.csv").then(raw => {
      const allData = raw.map(d => ({
        DATE: d.DATE as string,
        TMAX: d.TMAX !== "" ? (+d.TMAX! / 10) * 9 / 5 + 32 : null,
        TMIN: d.TMIN !== "" ? (+d.TMIN! / 10) * 9 / 5 + 32 : null,
      })).filter(d => d.TMAX !== null && d.TMIN !== null) as any[];

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

        setTemp(thermos.min.svg, thermos.min.mercury, "min", row.TMIN, prevMin);
        setTemp(thermos.max.svg, thermos.max.mercury, "max", row.TMAX, prevMax);
        updateBadge("badge-min", row.TMIN.toFixed(1));
        updateBadge("badge-max", row.TMAX.toFixed(1));

        prevMin = row.TMIN;
        prevMax = row.TMAX;
      });
    });

    function setTemp(svgSel: any, mercury: any, gradId: string, targetF: number, prevF?: number, duration = 1400) {
      const isHot = targetF >= 32;
      const col1 = isHot ? "#c0392b" : "#1a5fa8";
      const col2 = isHot ? "#ff6b6b" : "#4d9de0";
      const col3 = isHot ? "#e74c3c" : "#2c7bb6";

      svgSel.selectAll(`.merc-stop-left`).attr("stop-color", col1);
      svgSel.selectAll(`.merc-stop-mid`).attr("stop-color", col2);
      svgSel.selectAll(`.merc-stop-right`).attr("stop-color", col3);
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
      el.querySelector('.f-val')!.textContent = `${f}°F`;
      el.querySelector('.c-val')!.textContent = `${fToC(f).toFixed(1)}°C`;
      el.className = `thermo-badge ${f >= 32 ? 'badge-hot' : 'badge-cold'}`;
    }

  }, []);

  return (
      <>
        <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root { --bg:#f4efe6; --card:#fffef9; --border:#e0d9cc; --text:#1c1c1c; --muted:#999; --red:#d44032; --blue:#2c7bb6; --accent:#1c1c1c; }
body { background:var(--bg); min-height:100vh; font-family:'Arial',serif; color:var(--text); }
header { background:var(--bg); padding:24px 48px; display:flex; align-items:baseline; gap:20px; }
header h1 { font-size:1.8rem; font-weight:700; }
main { max-width:1100px; margin:0 auto; padding:40px 24px 60px; display:flex; flex-direction:column; gap:36px; }
.date-section { display:flex; flex-direction:column; gap:10px; }
.date-label { font-size:.65rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
.date-controls { display:flex; gap:12px; }
select { font-size:.85rem; background:var(--card); border:1.5px solid var(--border); border-radius:8px; padding:10px 16px; }
#date-select { min-width:200px; }
.day-info { background:var(--card); border:1.5px solid var(--border); border-radius:12px; padding:14px 20px; font-size:.8rem; color:var(--muted); }
.thermo-section { display:flex; justify-content:center; gap:60px; flex-wrap:wrap; }
.thermo-card { display:flex; flex-direction:column; align-items:center; gap:12px; }
.thermo-title { font-size:.65rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
.thermo-badge { background:var(--card); border:1.5px solid var(--border); border-radius:10px; padding:10px 20px; text-align:center; }
.badge-cold .f-val{color:var(--blue);} .badge-hot .f-val{color:var(--red);} 
#loading{display:flex;align-items:center;justify-content:center;height:120px;font-size:.8rem;color:var(--muted);letter-spacing:.1em;} .freeze-line{stroke-dasharray:4,4;}`}</style>

        <header><h1>Data Vis Temp Prj</h1></header>
        <main>
          <div id="loading">Loading dataset…</div>
          <div id="app" style={{ display: "none", flexDirection: "column", gap: "36px" }}>
            <div className="date-section">
              <div className="date-label">Select a date</div>
              <div className="date-controls"><select id="date-select" /></div>
              <div className="day-info" id="day-info">Pick a date to get temp data</div>
            </div>
            <div className="thermo-section">
              <div className="thermo-card">
                <div className="thermo-title">Min Temp of Day</div>
                <svg id="thermo-min" />
                <div className="thermo-badge" id="badge-min"><div className="f-val">—</div><div className="c-val">—</div></div>
              </div>
              <div className="thermo-card">
                <div className="thermo-title">Max Temp of Day</div>
                <svg id="thermo-max" />
                <div className="thermo-badge" id="badge-max"><div className="f-val">—</div><div className="c-val">—</div></div>
              </div>
            </div>
          </div>
        </main>
      </>
  );
}
