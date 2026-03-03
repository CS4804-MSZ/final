import React from "react";

export default function TextPanel() {
    return (
        <>
            <style>{`
                .text-panel {
                    background: var(--card);
                    border: 1.5px solid var(--border);
                    border-radius: 18px;
                    padding: 28px;
                    line-height: 1.6
                }
                .text-panel h2 {
                    font-size: 1.2rem;
                    margin: 24px 0 12px 0;
                 }
                .text-panel p {
                    font-size: 0.9rem;
                    color :var(--muted)
                }
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
                <h2>Instructions</h2>
                <p>
                    instructions here
                </p>
                <h2>Our Goal</h2>
                <p>
                    We designed these visualizations after traditional measurement tools to enhance understanding of
                    temperature range and precipitation levels on a given day.
                    We hope this visualization supports daily decision-making on how to best dress for the given
                    temperature and whether or not to bring additional weather garments
                    (e.g., an umbrella) for the amount of precipitation. Although this visualization currently only has
                    past data, this visualization type could be applied to forecasted
                    temperature and precipitation data in future iterations.
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