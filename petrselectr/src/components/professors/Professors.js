import Plot from 'react-plotly.js'

import './ProfessorsStyle.css'

function Professors({ profs, gradeInfo }) {

    return (
        <div class="d-flex flex-row flex-nowrap overflow-auto professor-container">
            {
                profs.map((prof) => (
                    <div key={prof.ucinetid} className="card col-4 professor-card">
                        <b><p className="title">{prof.name}</p></b>
                        <p className="email"><a href={"mailto:" + prof.email}>{prof.email}</a></p>
                        <p>Average GPA: {gradeInfo.hasOwnProperty(prof.ucinetid) ? parseFloat(gradeInfo[prof.ucinetid].gpa).toFixed(2) : ""}</p>
                        <Plot
                            data={[
                                { type: 'bar', ...(gradeInfo.hasOwnProperty(prof.ucinetid) ? gradeInfo[prof.ucinetid].grades : {}) }
                            ]}
                            layout={{
                                autosize: true,
                                margin: { l: 20, r: 20, t: 0, b: 20 },
                                plot_bgcolor: "#00000000",
                                paper_bgcolor: "#00000000"
                            }}
                            config={{ staticPlot: true, responsive: true }}
                            className="plot"
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default Professors