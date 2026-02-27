"use client";

import * as d3 from "d3";
import { useEffect } from "react";
import Thermometer from "@/components/Thermometer";

export default function Page() {
  useEffect(() => {
    d3.csv("/synthetic_weather.csv").then(() => {
      document.getElementById("loading")!.style.display = "none";
      document.getElementById("app")!.style.display = "flex";
    });
  }, []);

  return (
      <>
        <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg:#f4efe6; --card:#fffef9; --border:#e0d9cc; --text:#1c1c1c; --muted:#999; --red:#d44032; --blue:#2c7bb6; --accent:#1c1c1c; }
        body { background:var(--bg); min-height:100vh; font-family:'Arial',serif; color:var(--text); }
        header { background:var(--bg); padding:24px 48px; display:flex; align-items:baseline; gap:20px; }
        header h1 { font-size:1.8rem; font-weight:700; }
        main { max-width:1100px; margin:0 auto; padding:40px 24px 60px; display:flex; flex-direction:column; gap:36px; }
        .thermo-section { display:flex; justify-content:center; gap:60px; flex-wrap:wrap; }
        #loading { display:flex; align-items:center; justify-content:center; height:120px; font-size:.8rem; color:var(--muted); letter-spacing:.1em; }
        .freeze-line { stroke-dasharray:4,4; }
      `}</style>

        <header>
          <h1>Data Vis Temp Prj</h1>
        </header>

        <main>
          <div id="loading">Loading dataset…</div>

          <div id="app" style={{ display: "none", flexDirection: "column", gap: "36px" }}>
            <div className="thermo-section">
              <Thermometer id="thermo-min" gradId="min" />
              <Thermometer id="thermo-max" gradId="max" />
            </div>
          </div>
        </main>
      </>
  );
}