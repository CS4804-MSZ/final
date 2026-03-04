"use client";

// TODO
// swap mm and in for the precipitation
// add imperial/metric to the gauges themselves on the other side

import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import Thermometer from "@/components/Thermometer";
import PrecipitationGauge from "@/components/PrecipitationGauge";
import { DatePicker } from "@mantine/dates";
import { Button } from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import TextPanel from "@/components/TextPanel";
import { getWeatherQuote } from "@/utils/getWeatherQuote";

dayjs.extend(advancedFormat);

export default function Page() {
    const [data, setData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [calendarDate, setCalendarDate] = useState<string>("2010-01-01");

    useEffect(() => {
        d3.csv("/final/data/synthetic_weather.csv").then((raw) => {
            setData(raw.filter((d) => d.TMIN && d.TMAX));
        });
    }, []);

    const dateString = selectedDate ?? "";

    const row = data.find((d) => d.DATE === dateString);

    const precipMM = row ? row.PRCP / 10 : null;
    const isSnowy = row
        ? (row.TMAX / 10) * 9 / 5 + 32 <= 34
        : false;

    const quote =
        row
            ? getWeatherQuote(
                (row.TMAX / 10) * 9 / 5 + 32,
                row.PRCP / 10
            )
            : null;

    return (
        <>
            <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f4efe6;--card:#fffef9;--border:#e0d9cc;--text:#1c1c1c;--muted:#999;--red:#d44032;--blue:#2c7bb6}
body{background:var(--bg);font-family: 'Times New Roman', serif;,serif;color:var(--text)}
main{max-width:1300px;margin:0 auto;padding:40px 24px 60px;display:flex;flex-direction:column;gap:36px}
.calendar-row{
  display:flex;
  justify-content:center;
  align-items:stretch;
  gap:32px;
  margin-bottom:20px
  height: 1000px;
}

.calendar-wrapper{
  background:var(--card);
  border:1.5px solid var(--border);
  border-radius:16px;
  padding:14px;

  display:flex;
  align-items:center;
  justify-content:center;
  height:100%;
}

.calendar-wrapper .mantine-DatePicker-calendar{
  width:100%;
}
.day-info-card{width:360px;background:var(--card);border:2px solid var(--border);border-radius:18px;padding:22px 26px;display:flex;flex-direction:column;gap:20px}
.day-info-date{font-size:1.4rem;font-weight:700;letter-spacing:.04em;text-align:center}
.day-info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.day-info-item{display:flex;flex-direction:column;align-items:center;gap:6px}
.day-info-label{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.day-info-value{font-size:1.2rem;font-weight:700}
.day-info-value .unit{font-size:.75rem;font-weight:500;color:var(--muted)}
.day-info-sub{font-size:.75rem;color:var(--muted)}
.day-info-empty{text-align:center;font-size:.8rem;color:var(--muted)}
.thermo-section{display:flex;justify-content:center;gap:60px}
.thermo-card{display:flex;flex-direction:column;align-items:center;gap:12px}
.thermo-title{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.thermo-badge{
  background:var(--card);
  border:1.5px solid var(--border);
  border-radius:10px;
  padding:10px 20px;
  text-align:center;

  margin-top:-30px;
}
.thermo-badge .f-val {
  font-size: 1.3rem;
  font-weight: 500;
}

.thermo-badge .c-val {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 2px;
}
.freeze-line{stroke-dasharray:4,4}
.page-shell{display:flex;justify-content:center}
.page-layout{display:grid;  grid-template-columns: minmax(600px, 1.4fr) 1fr;;gap:48px;align-items:start}
.visual-panel{display:flex;flex-direction:column;gap:20px}
.day-panel-column{display:flex;flex-direction:column;gap:16px;height:100%}
.random-day-card{background:var(--card);border:2px solid var(--border);border-radius:18px;padding:18px;display:flex;align-items:center;justify-content:center}
.mantine-DatePicker-day[data-weekend="true"] { color: var(--text) !important;}
.badge-cold .f-val { color: var(--blue); }
.badge-hot .f-val { color: var(--red); }
.quote-card{
  background:var(--card);
  border:2px solid var(--border);
  border-radius:18px;
  padding:18px;
  text-align:center;
  font-size:.9rem;
  font-style:italic;
  color:#444;
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:70px;
}
      `}</style>

            <main>
                <div className="page-shell">
                    <div className="page-layout">
                        <TextPanel />

                        <div className="visual-panel">
                            <div className="calendar-row">
                                <div className="calendar-wrapper">
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={(value) => {
                                            setSelectedDate(value);
                                            if (value) {
                                                setCalendarDate(value);
                                            }
                                        }}
                                        date={calendarDate}
                                        onDateChange={(value) => {
                                            setCalendarDate(value);
                                        }}
                                        defaultDate="2010-01-01"
                                        minDate="2010-01-01"
                                        maxDate="2023-12-31"
                                    />
                                </div>

                                <div className="day-panel-column">
                                    <div className="day-info-card">
                                        {row ? (
                                            <>
                                                <div className="day-info-date">
                                                    {dayjs(row.DATE).format("MMMM Do, YYYY")}
                                                </div>

                                                <div className="day-info-grid">
                                                    <div className="day-info-item">
                                                        <div className="day-info-label">Min</div>
                                                        <div className="day-info-value">
                                                            {((row.TMIN / 10) * 9 / 5 + 32).toFixed(1)}°F
                                                        </div>
                                                    </div>

                                                    <div className="day-info-item">
                                                        <div className="day-info-label">Max</div>
                                                        <div className="day-info-value">
                                                            {((row.TMAX / 10) * 9 / 5 + 32).toFixed(1)}°F
                                                        </div>
                                                    </div>

                                                    <div className="day-info-item">
                                                        <div className="day-info-label">Precip</div>
                                                        <div className="day-info-value">
                                                            {((row.PRCP / 10) / 25.4).toFixed(2)}
                                                            <span className="unit"> in</span>
                                                        </div>
                                                        <div className="day-info-sub">
                                                            {(row.PRCP / 10).toFixed(1)} mm
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="day-info-empty">
                                                Pick a date to see details
                                            </div>
                                        )}
                                    </div>

                                    <div className="random-day-card">
                                        <Button
                                            fullWidth
                                            radius="md"
                                            variant="light"
                                            onClick={() => {
                                                if (!data.length) return;

                                                const randomIndex = Math.floor(Math.random() * data.length);
                                                const randomDateString = data[randomIndex].DATE;

                                                setSelectedDate(randomDateString);
                                                setCalendarDate(randomDateString);
                                            }}
                                        >
                                            Pick Random Day
                                        </Button>
                                    </div>
                                    <div className="quote-card">
                                        {quote ?? "Pick a date to get weather advice."}
                                    </div>
                                </div>
                            </div>

                            <div className="thermo-section">
                                <Thermometer
                                    id="min"
                                    title="Min Temp of Day"
                                    valueF={row ? (row.TMIN / 10) * 9 / 5 + 32 : null}
                                    data={data}
                                    selectedDate={selectedDate}
                                />

                                <Thermometer
                                    id="max"
                                    title="Max Temp of Day"
                                    valueF={row ? (row.TMAX / 10) * 9 / 5 + 32 : null}
                                    data={data}
                                    selectedDate={selectedDate}
                                />
                                <PrecipitationGauge
                                    valueMM={precipMM}
                                    isSnowy={isSnowy}
                                    data={data}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}