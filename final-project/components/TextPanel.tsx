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
                .text-panel h2:first-of-type {
                  font-weight: 800;
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
                    This project was completed by Morgan Vasiliou, Skyler Lin, and Zoë Fisk for the final project of the
                    Data Visualization course. Discretion: The data used is synthetic, so it does not reference any particular place or real time. It is simply for
                    display purposes.
                </p>
                <h2>Instructions</h2>
                <p>
                    Select a date on the calendar (or click “Pick Random Day”) to view historical weather data between
                    January 1, 2010 and December 31, 2023.
                    The thermometers display the minimum and maximum temperatures for the selected day. The gauge shows
                    the total precipitation recorded on that date.
                    Additionally, you can click on the "i" icon next to each gauge to see a fully expanded temperature and precipitation chart
                    respectively.
                </p>
                <h2>Future Steps</h2>
                <p>
                    In future iterations, we want to expand this project beyond historical weather viewing into an interactive tool that strengthens data literacy skills.
                    We plan to incorporate guided explanations, trend comparisons, and analytics features to help users better interpret temperature ranges and precipitation.
                    Ultimately, our goal is to use this visualization as an accessible entry point into the data visualization sector!
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
                    the visualizations. Mantine was used for the date picker and button.
                </p>
            </div>
        </>
    )
}