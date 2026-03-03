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
                    This project was completed by Morgan Vasiliou, Skyler Lin, and Zoë Fisk for the final project of the Data Visualization
                    course. The goal of this site is to allow users to pick any date between January 1st, 2010 and December 31st, 2023.
                    After doing so, they see two thermometers, showing the minimum and maximum temperatures respectively. Additionally,
                    they are shown a precipitation gauge for that day.
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
                <h2>Process</h2>
                <p>
                    This site was coded using the NextJS framework. Some of the elements were initially programmed in
                    regular html/css/js, but were then turned into REACT-style code. Furthermore, d3 was used to create
                    the visualizations.
                </p>
            </div>
        </>
    )
}