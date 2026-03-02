"use client";

import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import Thermometer from "@/components/Thermometer";
import PrecipitationGauge from "@/components/PrecipitationGauge";
import { DatePicker, DatePickerProps } from '@mantine/dates';
import dayjs from "dayjs";

export default function Page() {


    const [data, setData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        d3.csv("/synthetic_weather.csv").then((raw) => {
            setData(raw.filter((d) => d.TMIN && d.TMAX));
        });
    }, []);


    // Convert DatePicker value → CSV date string
    const dateString = selectedDate
        ? selectedDate.toString().slice(0, 10)
        : "";

    const row = data.find((d) => d.DATE === dateString);

    const precipMM = row ? row.PRCP / 10 : null;
    const isSnowy = row
        ? (row.TMAX / 10) * 9 / 5 + 32 <= 34
        : false;


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
.date-row {
  display: flex;
  align-items: stretch;
  gap: 24px;
}

.day-info {
  width: 220px;
  height: 220px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  font-size: 0.8rem;
  color: var(--muted);

  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.5;
}.thermo-section{display:flex;justify-content:center;gap:60px}
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
                    <div className="date-row">
                        <DatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            defaultDate={new Date(2010, 0, 1)}
                            minDate={new Date(2010, 0, 1)}
                            maxDate={new Date(2023, 11, 31)}
                        />

                        <div className="day-info">
                            {row ? (
                                <>
                                    <strong>{row.DATE}</strong>
                                    <div>Min: {((row.TMIN / 10) * 9 / 5 + 32).toFixed(1)}°F</div>
                                    <div>Max: {((row.TMAX / 10) * 9 / 5 + 32).toFixed(1)}°F</div>
                                    <div>
                                        Precip: {(row.PRCP / 10).toFixed(1)} mm (
                                        {((row.PRCP / 10) / 25.4).toFixed(2)} in)
                                    </div>
                                </>
                            ) : (
                                "Pick a date to get temp data"
                            )}
                        </div>
                    </div>
                </div>


                <div className="thermo-section">
                    <Thermometer
                        id="min"
                        title="Min Temp of Day"
                        valueF={
                            row ? (row.TMIN / 10) * 9 / 5 + 32 : null
                        }
                    />
                    <Thermometer
                        id="max"
                        title="Max Temp of Day"
                        valueF={
                            row ? (row.TMAX / 10) * 9 / 5 + 32 : null
                        }
                    />
                    <PrecipitationGauge valueMM={precipMM} isSnowy={isSnowy}/>
                </div>
            </main>
        </>
    );
}