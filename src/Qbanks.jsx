// src/components/Qbank.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const Qbank = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const qbankCollection = collection(db, 'qbank');
      const qbankSnapshot = await getDocs(qbankCollection);
      const questionsList = qbankSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(questionsList);
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div>
      <h2>Question Bank</h2>
      {showResults ? (
        <div>
          <h3>Your Score: {score}/{questions.length}</h3>
        </div>
      ) : questions.length > 0 ? (
        <div>
          <h3>{questions[currentQuestion].questionText}</h3>
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option.text}
              onClick={() => handleAnswer(option.isCorrect)}
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Qbank;
