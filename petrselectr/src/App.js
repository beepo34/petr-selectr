import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap'
import Header from './components/header/Header.js'
import Schedule from './components/schedule/Schedule.js'
import Professors from './components/professors/Professors.js'
import { courseInfoQuery } from './api/queries/queries'
import useFetch from 'use-http'
import './bootstrap.min.css';

function App() {

  const [profs, setProfs] = useState([{ name: 'shindler', rating: 3.8 }, { name: 'wongma', rating: 2.8 }, { name: 'pattis', rating: 4.8 }, { name: 'thornton', rating: 4.8 }, { name: 'gassko', rating: 1.8 }]);
  const [courseInfo, setCourseInfo] = useState({});
  const [fall, setFall] = useState([]);
  const [winter, setWinter] = useState([]);
  const [spring, setSpring] = useState([]);

  const options = {
    // displays error message when an error occurs
    onError: ({ error }) => {
      console.log("An error occurred. Please try searching the course again.")
    },
    responseType: "json"
  }

  const graphqlRequest = useFetch('https://api.peterportal.org/graphql/', options) // may be better to put this link in .env?
  const getCourseInfo = id => graphqlRequest.query(courseInfoQuery, { classID: id })

  const getData = async (id) => {
    console.log(id) //form input

    await getCourseInfo(id)
    .then((response)=>{
      console.log(response.data)
      const data = {
        id: response.data.course.id,
        title: response.data.course.title,
        department: response.data.course.department,
        number: response.data.course.number,
        description: response.data.course.description.split(".")[0] + ".", // only take the first sentence from the description
        course_level: response.data.course.course_level.split(" ").slice(0, 2).join(" "), // ignore course numbers
        units: response.data.course.units[0]
      }
      setCourseInfo(data)
    })
  }

  return (
    <Container fluid>
      <Row className="row header-row">
      <Header getData={getData}/>
      </Row>
      <Row className="row schedule-row">
      <Schedule course={courseInfo} fall={fall} winter={winter} spring={spring} />
      </Row>
      <Row className="row professor-row">
      <Professors profs={profs} />
      </Row>
    </Container>
  );
}

export default App;
