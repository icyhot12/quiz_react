import React from "react";
import Button from "./Button";
import { decode } from "html-entities"

function Question(props) {

    const buttons = props.options.map((element,index) =>
        <Button
            key={`${props.id}${index}`}
            idAnswer={index}
            idQuestion={props.id}
            value={element.value}
            handleChoose={props.handleChoose}
            isCorrect={element.isCorrect}
            isHeld={element.isHeld}
            isChecked={element.isChecked}
        />
    )

    return (
        <div className="question-container">
            <div className="question-text">{decode(props.question)}</div>
            <div className="answers-container">
                {buttons}
            </div>
        </div>
    )
}

export default Question