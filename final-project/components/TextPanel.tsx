import React from "react";

export default function TextPanel() {
    return (
        <>
            <style>{`
                .text-panel{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:28px;line-height:1.6}
                .text-panel h2{font-size:1.2rem;margin-bottom:12px}
                .text-panel p{font-size:.9rem;color:var(--muted)}
            `}</style>

            <div className="text-panel">
                <h2>MSZ Final Project for Data Visualization Course</h2>
                <p>
                    TEST TEST TEST TEST TEST TEST
                </p>
                <h2>About This Project</h2>
                <p>
                    Select a date from the calendar to explore daily temperature
                    extremes and precipitation levels. This visualization helps
                    reveal seasonal patterns and weather variability over time.
                </p>
                <h2>About This Project</h2>
                <p>
                    Select a date from the calendar to explore daily temperature
                    extremes and precipitation levels. This visualization helps
                    reveal seasonal patterns and weather variability over time.
                </p>
                <h2>About This Project</h2>
                <p>
                    Select a date from the calendar to explore daily temperature
                    extremes and precipitation levels. This visualization helps
                    reveal seasonal patterns and weather variability over time.
                </p>
                <h2>About This Project</h2>
                <p>
                    Select a date from the calendar to explore daily temperature
                    extremes and precipitation levels. This visualization helps
                    reveal seasonal patterns and weather variability over time.
                </p>
            </div>
        </>
    )
}