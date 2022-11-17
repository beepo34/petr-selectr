import './bootstrap.min.css';
import React, { useState } from 'react';
import Header from './components/Header.js'
import Schedule from './components/Schedule.js'
import Professors from './components/Professors.js'


function App() {

  const [profs, setProfs] = useState([{ name: 'shindler', rating: 3.8 }, { name: 'wongma', rating: 2.8 }, { name: 'pattis', rating: 4.8 }, { name: 'thornton', rating: 4.8 }, { name: 'gassko', rating: 1.8 }]);
  const [fall, setFall] = useState([]);
  const [winter, setWinter] = useState([]);
  const [spring, setSpring] = useState([]);

  const getData = e => {
    e.preventDefault();
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries())
    console.log(formDataObj) //form input
  }

  return (
    <>
      <Header getData={getData} />
      <Schedule fall={fall} winter={winter} spring={spring} />
      <Professors profs={profs} />
    </>
  );
}

export default App;
