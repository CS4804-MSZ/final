"use client";

import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import Thermometer from "@/components/Thermometer";
import PrecipitationGauge from "@/components/PrecipitationGauge";

export default function Page() {


    const [data, setData] = useState<any[]>([]);
    const [date, setDate] = useState("");

    useEffect(() => {
        d3.csv("/synthetic_weather.csv").then((raw) => {
            setData(raw.filter((d) => d.TMIN && d.TMAX));
        });
    }, []);

    const row = data.find((d) => d.DATE === date);

    const precipMM = row ? row.PRCP / 10 : null;
    const isSnowy = row ? (row.TMAX / 10 * 9 / 5 + 32) <= 34 : false;


    return (
        <>
            <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f4efe6;--card:#fffef9;--border:#e0d9cc;--text:#1c1c1c;--muted:#999;--red:#d44032;--blue:#2c7bb6}
body{background:var(--bg);font-family:Arial,serif;color:var(--text)}
header{padding:24px 48px}
main{max-width:1100px;margin:0 auto;padding:40px 24px 60px;display:flex;flex-direction:column;gap:36px}
.date-section{display:flex;flex-direction:column;gap:10px}
.date-label{font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
select{background:var(--card);border:1.5px solid var(--border);border-radius:8px;padding:10px 16px}
.day-info{max-width:700px;background:var(--card);border:1.5px solid var(--border);border-radius:12px;padding:14px 20px;font-size:.8rem;color:var(--muted)}
.thermo-section{display:flex;justify-content:center;gap:60px}
.thermo-card{display:flex;flex-direction:column;align-items:center;gap:12px}
.thermo-title{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.thermo-badge{background:var(--card);border:1.5px solid var(--border);border-radius:10px;padding:10px 20px;text-align:center}
.freeze-line{stroke-dasharray:4,4}
      `}</style>

            <header>
                <h1>Data Vis Temp Prj</h1>
            </header>

            <main>
                <div className="date-section">
                    <div className="date-label">Select a date</div>
                    <select value={date} onChange={(e) => setDate(e.target.value)}>
                        <option value="">— choose a date —</option>
                        {data.map((d) => (
                            <option key={d.DATE}>{d.DATE}</option>
                        ))}
                    </select>

                    <div className="day-info">
                        {row
                            ? `${row.DATE} · 
           Min: ${(row.TMIN / 10 * 9 / 5 + 32).toFixed(1)}°F · 
           Max: ${(row.TMAX / 10 * 9 / 5 + 32).toFixed(1)}°F · 
           Precip: ${(row.PRCP / 10).toFixed(1)} mm (${((row.PRCP / 10) / 25.4).toFixed(2)} in)`
                            : "Pick a date to get temp data"}
                    </div>
                </div>

                <div className="thermo-section">
                    <Thermometer
                        id="min"
                        title="Min Temp of Day"
                        valueF={row ? row.TMIN / 10 * 9 / 5 + 32 : null}
                    />
                    <Thermometer
                        id="max"
                        title="Max Temp of Day"
                        valueF={row ? row.TMAX / 10 * 9 / 5 + 32 : null}
                    />
                    <PrecipitationGauge valueMM={precipMM} isSnowy={isSnowy} />
                </div>
            </main>
        </>
    );
}