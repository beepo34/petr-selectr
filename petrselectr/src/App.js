import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap'
import Header from './components/header/Header.js'
import Schedule from './components/schedule/Schedule.js'
import Professors from './components/professors/Professors.js'
import { courseInfoQuery } from './api/queries/queries'
import useFetch from 'use-http'
import './bootstrap.min.css';
import cheerio from 'cheerio'

function App() {
  const [courseOfferingsHTML, setCourseOfferingsHTML] = useState("")
  const [profs, setProfs] = useState([]);
  const [courseInfo, setCourseInfo] = useState({});
  const [gradeInfo, setGradeInfo] = useState({});
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
    .then((response) => {
      console.log(response.data)
      const courseInfoData = {
        id: response.data.course.id,
        title: response.data.course.title,
        department: response.data.course.department,
        number: response.data.course.number,
        description: response.data.course.description.split(".")[0] + ".", // only take the first sentence from the description
        course_level: response.data.course.course_level.split(" ").slice(0, 2).join(" "), // ignore course numbers
        units: response.data.course.units[0]
      }
      setCourseInfo(courseInfoData)

      const instructors = []
      response.data.course.instructor_history.forEach(prof => {
        instructors.push({ucinetid: prof.ucinetid, name: prof.name, shortened_name: prof.shortened_name})
      })
      console.log(instructors)
      setProfs(instructors)
    })
}

const getInstructorCourseGrades = async () => {
  const instructorCourseGradesQuery = "query {" + courseInfo.instructor_history.reduce((query, prof) => {
    return query + `${prof.ucinetid}: grades(instructor: "${prof.shortened_name}", department: "${courseInfo.department}", number: "${courseInfo.number}") {
        aggregate{
          sum_grade_a_count
          sum_grade_b_count
          sum_grade_c_count
          sum_grade_d_count
          sum_grade_f_count
          average_gpa
        }
      }`
    }, "") + "}" // constructs instructor grade distribution query
  await graphqlRequest.query(instructorCourseGradesQuery)
  .then((response) => {
    console.log(response.data)
    const grades = response.data
    for (var key in grades) {
      if (grades[key]) {
      grades[key] = {x: ["A", "B", "C", "D", "F"], 
                        y: [grades[key].aggregate.sum_grade_a_count,
                        grades[key].aggregate.sum_grade_b_count,
                        grades[key].aggregate.sum_grade_c_count,
                        grades[key].aggregate.sum_grade_d_count,
                        grades[key].aggregate.sum_grade_f_count]}
      }
    }
    setGradeInfo(response.data)
  })
}

useEffect(() => {
  if (JSON.stringify(courseInfo) !== "{}") getInstructorCourseGrades();
}, [courseInfo])

useEffect(() => {
  const fetchCourseOfferings = async () =>{
    // get html from course offerings website
    const url = 'https://cors-anywhere.herokuapp.com/https://www.ics.uci.edu/ugrad/courses/listing-course.php?year=2022&level=ALL&department=ALL&program=ALL'
    const response = await fetch(url, {
      headers: {
         "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
      }
    })
    const template = await response.text()
    setCourseOfferingsHTML(template)

  }
  fetchCourseOfferings()
}, [])

const getCourseOfferingRow = (html, department, number) => {
  let $ = cheerio.load(html)
  let id = department + " " + number
  console.log($(`tr:contains(${id})`).html())
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
      <Professors profs={profs} gradeInfo={gradeInfo}/>
      </Row>
    </Container>
  );
}

export default App;
