import React, { useState } from "react";
import "./QuizAttempt.css";

const QuizAttempt = () => {
  const questions = [
    {
      question: "What does CRISPR stand for?",
      options: [
        "Clustered Regularly Interspaced Short Palindromic Repeats",
        "Coded Recombinant Integrated Short Protein Repeats",
        "Clustered RNA Integrated Sequence Protein Replication",
        "Cellular Recombination In Short Palindromic Regions",
      ],
    },
    {
      question:
        "Which protein is most commonly paired with CRISPR as a gene-editing tool?",
      options: [
        "Cas9",
        "Insulin",
        "Hemoglobin",
        "Collagen",
      ],
    },
    {
      question:
        "Who were awarded the 2020 Nobel Prize in Chemistry for developing CRISPR?",
      options: [
        "Jennifer Doudna and Emmanuelle Charpentier",
        "Marie Curie and Irène Joliot-Curie",
        "Dorothy Hodgkin and Rosalind Franklin",
        "Ada Yonath and Frances Arnold",
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  const answeredCount = Object.keys(answers).length;

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      console.log("Quiz submitted:", answers);
      // Later we will call the backend API here.
    }
  };

  return (
    <div className="quiz-attempt-page">
      <div className="quiz-attempt-container">

        {/* Back to Article */}
        <button className="back-to-article">
          <span>←</span> Back to Article
        </button>

        {/* Question Header */}
        <div className="question-header">
          <span>
            QUESTION {currentQuestion + 1} OF {questions.length}
          </span>

          <span>
            {answeredCount} answered
          </span>
        </div>

        {/* Progress Line */}
        <div className="quiz-progress">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Question Card */}
        <div className="question-card">
          <h1>{question.question}</h1>

          <div className="options-container">
            {question.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  className={`option-button ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  <span className="option-letter">
                    {letter}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next / Submit Button */}
        <button
          className={`next-question-button ${
            selectedAnswer === undefined ? "disabled" : ""
          }`}
          disabled={selectedAnswer === undefined}
          onClick={handleNext}
        >
          {currentQuestion === questions.length - 1
            ? "Submit Quiz"
            : "Next Question"}
        </button>

      </div>
    </div>
  );
};

export default QuizAttempt;