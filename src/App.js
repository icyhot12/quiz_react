import React from "react";
import { useState, useEffect } from "react"
import handleData from "./handleData";
import Question from "./Question";
import Form from "./Form";
import bkgImage from "./images/quiz_medium.jpg"

function App() {
  const [start, setStart] = useState(false)
  const [data, setData] = useState([])
  const [selectedCounter, setSelectedCounter] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [isChecked, setIsChecked] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [apiChoice, setApiChoice] = useState("")

  function handleApi(choices) {
    let url = `https://opentdb.com/api.php?amount=${choices.questionNumber}${choices.questionCategory === "any" ? "" : `&category=${choices.questionCategory}`}${choices.questionDif === "any" ? "" : `&difficulty=${choices.questionDif}`}&type=multiple`

    setApiChoice(url)
  }

  function getApi() {
    fetch(apiChoice)
      .then((response) => response.json())
      .then((data) => {
        const constructedData = handleData(data.results)
        setData(constructedData)
      });
  }

  function handleChoose(idQuestion, idAnswer) {
    setData(prevData => {
      let tempData = [].concat(prevData)
      tempData[idQuestion].options.map(answer => {
        return answer.isHeld = false
      })
      tempData[idQuestion].options[idAnswer].isHeld = true
      tempData[idQuestion].isChoosen = true
      return tempData
    })
  }

  function choosenCounter() {
    setSelectedCounter(0)
    for (let i = 0; i < data.length; i++) {
      if (data[i].isChoosen) {
        setSelectedCounter(prevCounter => prevCounter + 1)
      }
    }
  }

  useEffect(choosenCounter, [data])

  function handleCheck() {
    setData(prevData => {
      let tempData = [].concat(prevData)
      tempData.map(element =>
        element.options.map(answer => {
          return answer.isChecked = true
        })
      )
      return tempData
    })

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].options.length; j++) {
        if (data[i].options[j].isHeld === true &&
          data[i].options[j].isCorrect === true) {
          setCorrect(prevCorect => prevCorect + 1)
        }
      }
    }
    setIsChecked(true)
  }

  function startQuiz() {
    getApi()
    setStart(prevStart => !prevStart)
  }

  const questionsElements = data.map((element, index) =>
    <Question
      key={index}
      id={index}
      question={element.question}
      options={element.options}
      handleChoose={handleChoose}
      isChoosen={element.isChoosen}
      isChecked={element.isChecked}
    />
  )

  function resetQuiz() {
    setData([])
    setIsReset(prevReset => !prevReset)
    setStart(false)
    setSelectedCounter(0)
    setCorrect(0)
    setIsChecked(false)
  }

  return (
    !start ?
      <div className="start-bkg" style={{ backgroundImage: `url(${bkgImage})` }}>
        <div className="start-container">
          <div className="start-tile">Welcome in Quiz Game</div>
          <Form handleApi={handleApi} />
          <div className="start-button">
            <button onClick={() => startQuiz()}>Start quiz!</button>
          </div>
        </div>
      </div>
      :
      data.length > 1 ?
        <div className="start-bkg" style={{ backgroundImage: `url(${bkgImage})` }} >
          <div className="main-container">
            <div className="title">Quiz</div>
            <div className="questions-container">
              {questionsElements}
            </div>
            <div className="check-container">
              {selectedCounter < data.length ?
                <div className="counter">Remaning answers: {data.length - selectedCounter}</div>
                :
                null
              }
              {selectedCounter === data.length && !isChecked ?
                <button onClick={handleCheck}>Check your answers</button>
                :
                null
              }
              {isChecked ?
                <div>
                  <div>Your score: {correct} </div>
                  <button onClick={() => resetQuiz()}>Start new quiz!</button>
                </div>
                :
                null}
            </div>
          </div>
        </div>
        :
        <div>Waiting for your quiz...</div>
  );
}

export default App;
