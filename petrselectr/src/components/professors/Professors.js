import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Plot from 'react-plotly.js';

function Professors({ profs, gradeInfo }) {
    return (
        <Container fluid className="d-flex flex-row flex-nowrap overflow-auto">
            {
                profs.map((prof) => (
                    <Col key={prof.ucinetid} className="col-6">
                        <Card>
                            <Card.Body>
                                <Card.Title>{prof.name}</Card.Title>
                                <Plot data={[
                                        { type: 'bar', ...gradeInfo[prof.ucinetid]}
                                    ]}
                                    layout = {{autosize: true}}
                                    config={{displayModeBar: false}}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            }
        </Container>
    )
}

export default Professors