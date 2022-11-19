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

  const departments = {
    "COMPSCI": "CS",
    "CSE": "CSE",
    "ECE": "ECE",
    "EDUC": "EDUC",
    "EECS": "EECS",
    "GDIM": "GDM",
    "I&CSCI": "ICS",
    "IN4MATX": "INF",
    "MATH": "MATH",
    "NETSYS": "NetSys",
    "SWE": "SE",
    "STATS": "STATS",
    "US": "US"
  }

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
          instructors.push({ email: prof.email, ucinetid: prof.ucinetid, name: prof.name, shortened_name: prof.shortened_name })
        })
        console.log(instructors)
        setProfs(instructors)
      })
  }

  const getInstructorCourseGrades = async () => {
    console.log(profs)
    const instructorCourseGradesQuery = "query {" + profs.reduce((query, prof) => {
      return query + `${prof.ucinetid}: grades(instructor: "${prof.shortened_name}", department: "${courseInfo.department}", number: "${courseInfo.number}") {
        aggregate{
          A: sum_grade_a_count
          B: sum_grade_b_count
          C: sum_grade_c_count
          D: sum_grade_d_count
          F: sum_grade_f_count
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
            var total = grades[key].aggregate.A
              + grades[key].aggregate.B
              + grades[key].aggregate.C
              + grades[key].aggregate.D
              + grades[key].aggregate.F
            grades[key] = {
              total: total, 
              gpa: grades[key].aggregate.average_gpa,
              grades: {
                x: ["A", "B", "C", "D", "F"],
                y: [grades[key].aggregate.A * 100/ total,
                grades[key].aggregate.B * 100/ total,
                grades[key].aggregate.C * 100/ total,
                grades[key].aggregate.D * 100/ total,
                grades[key].aggregate.F * 100/ total]
              }
            }
          }
          else {
            grades[key] = {
              total: 0,
              gpa: 0,
              grades: {}
            }
          }
        }
        setGradeInfo(response.data)
      })
  }

  useEffect(() => {
    const fetchCourseOfferings = async () => {
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

  const getCourseOfferingRowProfs = (html, department, number) => {
    let $ = cheerio.load(html)
    let id = departments[department] + " " + number
    let rowHTML = $(`tr:contains(${id})`).html()
    getProfs(`${rowHTML}`)
  }

  const getProfs = (html) => {
    let i = html.search('<td class="instruction">')
    let html_str = html.slice(i - html.length)
    html_str = html_str.split('<td class="instruction"><a href="')

    let counter = 0 // keep track of the quarters
    for (let j = 0; j < html_str.length; j++) {
      if (html_str[j].includes("http")) {
        // run body if string contains a link
        let profsList = []
        let profs = html_str[j].split('</a>') // count the num of profs by the num of links

        for (let k = 0; k < profs.length; k++) {
          // only go up to prof.length - 1 bc the last element of the array does not have a link/prof
          let link_i = profs[k].search('http') // find the end of the a tag
          if (link_i !== -1) {
            let link = profs[k].slice(link_i)
            let link_end_i = profs[k].search('">')

            link = link.slice(link_i, link_end_i + 1)
            let name = profs[k].slice(link_end_i + 2)
            profsList.push({
              "name": name,
              "link": link
            })
          }
        }

        if (counter === 0) {
          // fall quarter
          setFall(profsList)
        } else if (counter === 1) {
          // winter quarter
          setWinter(profsList)
        } else if (counter === 2) {
          // spring quarter
          setSpring(profsList)
        }

        counter++
      }

    }

  }

  useEffect(() => {
    if (JSON.stringify(profs) !== "[]") getInstructorCourseGrades();
  }, [profs])

  return (
    <Container fluid>
      <Row className="row header-row">
        <Header getData={getData} />
      </Row>
      <Row className="row schedule-row">
        <Schedule course={courseInfo} fall={fall} winter={winter} spring={spring} />
      </Row>
      <Row className="row professors-row">
        <Professors profs={profs} gradeInfo={gradeInfo} />
      </Row>
    </Container>
  );
}

export default App;
