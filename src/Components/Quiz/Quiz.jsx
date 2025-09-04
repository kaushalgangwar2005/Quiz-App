import { useEffect, useState } from "react";
import { data } from "../../assets/data";
import "../Quiz.css";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quiz-progress"));
    if (saved) {
      setIndex(saved.index);
      setSelectedOptions(saved.selectedOptions);
      setScore(saved.score);
      setResult(saved.result);
      setTimeLeft(saved.timeLeft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "quiz-progress",
      JSON.stringify({ index, selectedOptions, score, result, timeLeft })
    );
  }, [index, selectedOptions, score, result, timeLeft]);

  useEffect(() => {
    if (!result && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, result]);

  const checkAns = (ans) => {
    setSelectedOptions({ ...selectedOptions, [index]: ans });
  };

  const next = () => {
    if (index < data.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = () => {
    let sc = 0;
    data.forEach((q, i) => {
      if (selectedOptions[i] === q.ans) sc++;
    });
    setScore(sc);
    setResult(true);
  };

  const reset = () => {
    setIndex(0);
    setSelectedOptions({});
    setScore(0);
    setResult(false);
    setTimeLeft(300);
    localStorage.removeItem("quiz-progress");
  };

  const progressPercent = ((index + 1) / data.length) * 100;

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {!result && (
        <>
          <div className="timer">
            Time Left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </>
      )}

      {result ? (
        <>
          <h2>
            You Scored {score} out of {data.length}
          </h2>
          <div className="summary">
            {data.map((q, i) => (
              <div key={i} className="summary-item">
                <p>
                  <b>Q{i + 1}:</b> {q.question}
                </p>
                <p>
                  Your Answer:{" "}
                  <span className={selectedOptions[i] === q.ans ? "correct" : "wrong"}>
                    {q[`option${selectedOptions[i]}`] || "Not Answered"}
                  </span>
                </p>
                <p>
                  Correct Answer:{" "}
                  <span className="correct">{q[`option${q.ans}`]}</span>
                </p>
              </div>
            ))}
          </div>
          <button className="reset-btn" onClick={reset}>
            Restart Quiz
          </button>
        </>
      ) : (
        <>
          <h2>
            {index + 1}. {data[index].question}
          </h2>
          <ul>
            {[1, 2, 3, 4].map((opt) => (
              <li
                key={opt}
                onClick={() => checkAns(opt)}
                className={selectedOptions[index] === opt ? "selected" : ""}
              >
                {data[index][`option${opt}`]}
              </li>
            ))}
          </ul>
          <div className="buttons">
            <button className="prev-btn" onClick={prev} disabled={index === 0}>
              Previous
            </button>
            {index < data.length - 1 ? (
              <button className="next-btn" onClick={next}>
                Next
              </button>
            ) : (
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
          <div className="index">
            {index + 1} of {data.length} questions
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
