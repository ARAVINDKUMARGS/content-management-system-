import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const getStatusClass = (status) => {

  switch (status) {

    case "draft":
      return "status draft";

    case "submitted":
      return "status submitted";

    case "approved":
      return "status approved";

    case "rejected":
      return "status rejected";

    default:
      return "status";
  }
};

function App() {


  // ==========================================
  // ARTICLE STATE
  // ==========================================

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Science");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");


  // ==========================================
  // QUIZ STATE
  // ==========================================

  const [quizEnabled, setQuizEnabled] = useState(false);

  const [createdQuiz, setCreatedQuiz] = useState(null);

  const [quizList, setQuizList] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");

  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const clearFilters = () => {

    setSearchTerm("");

    setStatusFilter("all");

  };

  const [editingQuiz, setEditingQuiz] = useState(null);

  const [viewingQuiz, setViewingQuiz] = useState(null);

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    }
  ]);

  useEffect(() => {

    const fetchQuizzes = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/quizzes"
        );

        const data = await response.json();

        console.log(
          "All Quizzes:",
          data
        );

        if (response.ok) {
          setQuizList(data.quizzes);
        }

      } catch (error) {

        console.error(
          "Fetch Quizzes Error:",
          error
        );

      }
    };


    fetchQuizzes();

  }, []);

  // ==========================================
  // UPDATE QUESTION
  // ==========================================

  const updateQuestion = (questionIndex, value) => {

    const updatedQuestions = [...questions];

    updatedQuestions[questionIndex].question = value;

    setQuestions(updatedQuestions);
  };


  // ==========================================
  // UPDATE OPTION
  // ==========================================

  const updateOption = (
    questionIndex,
    optionIndex,
    value
  ) => {

    const updatedQuestions = [...questions];

    updatedQuestions[questionIndex].options[
      optionIndex
    ] = value;

    setQuestions(updatedQuestions);
  };


  // ==========================================
  // SELECT CORRECT ANSWER
  // ==========================================

  const selectCorrectAnswer = (
    questionIndex,
    optionIndex
  ) => {

    const updatedQuestions = [...questions];

    updatedQuestions[questionIndex].correctAnswer =
      updatedQuestions[questionIndex].options[
      optionIndex
      ];

    setQuestions(updatedQuestions);
  };


  // ==========================================
  // ADD QUESTION
  // ==========================================

  const addQuestion = () => {

    setQuestions([
      ...questions,

      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      }
    ]);
  };


  // ==========================================
  // CREATE QUIZ
  // ==========================================

  const createQuiz = async () => {

    if (quizEnabled) {

      if (questions.length === 0) {
        alert("Quiz must have at least one question.");
        return;
      }

      for (let i = 0; i < questions.length; i++) {

        const question = questions[i];

        if (!question.question.trim()) {
          alert(`Please enter Question ${i + 1}.`);
          return;
        }

        if (
          question.options.some(
            (option) => !option.trim()
          )
        ) {
          alert(
            `Please fill all 4 options for Question ${i + 1}.`
          );
          return;
        }

        if (!question.correctAnswer) {
          alert(
            `Please select the correct answer for Question ${i + 1}.`
          );
          return;
        }
      }
    }

    try {

      const quizData = {

        title: title || "Untitled Quiz",

        description: "Quiz created from Lumen",

        questions: questions.map((q) => ({

          question: q.question,

          options: q.options,

          correctAnswer: q.correctAnswer

        }))

      };


      const response = await fetch(
        "http://localhost:5000/api/quizzes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(quizData)
        }
      );


      const data = await response.json();


      console.log(
        "Create Quiz Response:",
        data
      );


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to create quiz"
        );

        return;
      }


      alert(
        "Quiz created successfully!"
      );


      console.log(
        "Created Quiz:",
        data.quiz
      );


      setCreatedQuiz(data.quiz);

      setQuizList((previousQuizzes) => [
        data.quiz,
        ...previousQuizzes
      ]);


    } catch (error) {

      console.error(
        "Create Quiz Error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    }
  };


  const updateQuiz = async () => {

    if (!editingQuiz) {
      return;
    }

    if (!editingQuiz.title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    for (let i = 0; i < editingQuiz.questions.length; i++) {

      const question = editingQuiz.questions[i];

      if (!question.question.trim()) {
        alert(`Please enter Question ${i + 1}.`);
        return;
      }

      if (
        question.options.some(
          (option) => !option.trim()
        )
      ) {
        alert(
          `Please fill all 4 options for Question ${i + 1}.`
        );
        return;
      }

      if (!question.correctAnswer) {
        alert(
          `Please select the correct answer for Question ${i + 1}.`
        );
        return;
      }

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        alert(
          `Correct answer must match an option for Question ${i + 1}.`
        );
        return;
      }
    }

    try {

      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${editingQuiz._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            title: editingQuiz.title,
            description: editingQuiz.description,
            questions: editingQuiz.questions
          })
        }
      );


      const data = await response.json();


      console.log(
        "Update Quiz Response:",
        data
      );


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to update quiz"
        );

        return;
      }


      // Update selected quiz
      setEditingQuiz(data.quiz);


      // Update quiz list
      setQuizList((previousQuizzes) =>
        previousQuizzes.map((quiz) =>
          quiz._id === data.quiz._id
            ? data.quiz
            : quiz
        )
      );


      // Update created quiz if it is the same quiz
      if (
        createdQuiz &&
        createdQuiz._id === data.quiz._id
      ) {
        setCreatedQuiz(data.quiz);
      }


      alert(
        "Quiz updated successfully!"
      );


    } catch (error) {

      console.error(
        "Update Quiz Error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    } finally {

      setActionLoading(false);

    }
  };

  const attachQuizToArticle = async () => {

    if (!editingQuiz) {
      return;
    }

    if (editingQuiz.status !== "draft") {
      alert(
        "Only draft quizzes can be attached to an article."
      );
      return;
    }


    if (!editingQuiz.articleId) {
      alert("Please enter an Article ID.");
      return;
    }

    try {

      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${editingQuiz._id}/attach/${editingQuiz.articleId}`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      console.log(
        "Attach Quiz Response:",
        data
      );

      if (!response.ok) {

        alert(
          data.message ||
          "Failed to attach quiz"
        );

        return;
      }

      // Update the quiz being edited
      setEditingQuiz(data.quiz);

      // Update quiz list
      setQuizList((previousQuizzes) =>
        previousQuizzes.map((quiz) =>
          quiz._id === data.quiz._id
            ? data.quiz
            : quiz
        )
      );

      // Update created quiz if same quiz
      if (
        createdQuiz &&
        createdQuiz._id === data.quiz._id
      ) {
        setCreatedQuiz(data.quiz);
      }

      alert(
        "Quiz attached to article successfully!"
      );

    } catch (error) {

      console.error(
        "Attach Quiz Error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    } finally {

      setActionLoading(false);

    }
  };

  const submitQuiz = async (quizId) => {

    const quiz = quizList.find(
      (quiz) => quiz._id === quizId
    );

    if (!quiz) {
      alert("Quiz not found.");
      return;
    }

    if (quiz.status !== "draft") {
      alert(
        "Only draft quizzes can be submitted."
      );
      return;
    }

    if (!quiz.title || !quiz.title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      alert("Quiz must contain at least one question.");
      return;
    }

    for (let i = 0; i < quiz.questions.length; i++) {

      const question = quiz.questions[i];

      if (!question.question || !question.question.trim()) {
        alert(`Please enter Question ${i + 1}.`);
        return;
      }

      if (
        !question.options ||
        question.options.length !== 4
      ) {
        alert(
          `Question ${i + 1} must have exactly 4 options.`
        );
        return;
      }

      if (
        question.options.some(
          (option) => !option || !option.trim()
        )
      ) {
        alert(
          `Please fill all 4 options for Question ${i + 1}.`
        );
        return;
      }

      if (!question.correctAnswer) {
        alert(
          `Please select the correct answer for Question ${i + 1}.`
        );
        return;
      }

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        alert(
          `Correct answer must match an option for Question ${i + 1}.`
        );
        return;
      }
    }

    const confirmSubmit = window.confirm(
      "Are you sure you want to submit this quiz for admin review?"
    );

    if (!confirmSubmit) {
      return;
    }

    try {

      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}/submit`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      console.log(
        "Submit Quiz Response:",
        data
      );

      if (!response.ok) {

        alert(
          data.message ||
          "Failed to submit quiz"
        );

        return;
      }

      // Update quiz in the list
      setQuizList((previousQuizzes) =>
        previousQuizzes.map((quiz) =>
          quiz._id === data.quiz._id
            ? data.quiz
            : quiz
        )
      );

      // Update currently viewed quiz
      if (
        viewingQuiz &&
        viewingQuiz._id === data.quiz._id
      ) {
        setViewingQuiz(data.quiz);
      }

      // Update currently edited quiz
      if (
        editingQuiz &&
        editingQuiz._id === data.quiz._id
      ) {
        setEditingQuiz(data.quiz);
      }

      // Update created quiz
      if (
        createdQuiz &&
        createdQuiz._id === data.quiz._id
      ) {
        setCreatedQuiz(data.quiz);
      }

      alert(
        "Quiz submitted for admin review!"
      );

    } catch (error) {

      console.error(
        "Submit Quiz Error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    } finally {

      setActionLoading(false);

    }
  };

  const deleteQuiz = async (quizId) => {

    // Ask before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}`,
        {
          method: "DELETE"
        }
      );


      const data = await response.json();


      console.log(
        "Delete Quiz Response:",
        data
      );


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to delete quiz"
        );

        return;
      }


      // Remove quiz from frontend list
      setQuizList((previousQuizzes) =>
        previousQuizzes.filter(
          (quiz) => quiz._id !== quizId
        )
      );


      // If deleted quiz is currently being edited,
      // close the edit form
      if (
        editingQuiz &&
        editingQuiz._id === quizId
      ) {
        setEditingQuiz(null);
      }


      // If deleted quiz is the created quiz,
      // remove it from the screen
      if (
        createdQuiz &&
        createdQuiz._id === quizId
      ) {
        setCreatedQuiz(null);
      }

      if (
        viewingQuiz &&
        viewingQuiz._id === quizId
      ) {
        setViewingQuiz(null);
      }


      alert(
        "Quiz deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete Quiz Error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    } finally {

      setActionLoading(false);

    }
  };

  const deleteQuestion = async (quizId, questionId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}/questions/${questionId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      console.log(
        "Delete Question Response:",
        data
      );

      if (!response.ok) {

        alert(
          data.message ||
          "Failed to delete question"
        );

        return;
      }

      // Update the quiz being edited
      setEditingQuiz(data.quiz);

      // Update the quiz in the quiz list
      setQuizList((previousQuizzes) =>
        previousQuizzes.map((quiz) =>
          quiz._id === data.quiz._id
            ? data.quiz
            : quiz
        )
      );

      // Update created quiz if it is the same quiz
      if (
        createdQuiz &&
        createdQuiz._id === data.quiz._id
      ) {
        setCreatedQuiz(data.quiz);
      }

      alert(
        "Question deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete Question Error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    }
  };

  // ==========================================
  // SUBMIT ARTICLE
  // ==========================================

  const submitArticle = async () => {

    if (!createdQuiz) {
      alert("Please create the quiz first.");
      return;
    }

    await submitQuiz(createdQuiz._id);

  };

  const filteredQuizzes = quizList.filter((quiz) => {

    const matchesStatus =
      statusFilter === "all" ||
      quiz.status === statusFilter;

    const matchesSearch =
      quiz.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      quiz.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app">


      {/* ==================================
                NAVBAR
            ================================== */}

      <header className="navbar">

        <div className="logo">

          <div className="logo-icon">
            ▣
          </div>

          <span>
            Lumen
          </span>

        </div>


        <nav className="nav-links">

          <a>
            <span>▦</span>
            Home
          </a>

          <a>
            <span>⌕</span>
            Browse
          </a>

          <a className="active">

            <span>✎</span>

            Write

          </a>

          <a>

            <span>♙</span>

            Profile

          </a>

        </nav>


        <div className="nav-right">

          <select defaultValue="author">

            <option value="author">
              Priya Mehta (author)
            </option>

          </select>


          <span className="bell">
            ♧
          </span>


          <div className="avatar">
            PM
          </div>

        </div>

      </header>


      {/* ==================================
                MAIN
            ================================== */}

      <main className="container">


        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              New Article
            </h1>

            <p>
              Write your article and add a quiz
              before submitting for review.
            </p>

          </div>


          <button className="cancel-button">

            ← &nbsp; Cancel

          </button>

        </div>


        {/* ==================================
                    TITLE
                ================================== */}

        <section className="card title-card">

          <label>
            Title
          </label>


          <input
            type="text"
            placeholder="Enter your article title..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

        </section>


        {/* ==================================
                    ARTICLE
                ================================== */}

        <section className="card article-card">

          <div className="row">


            {/* CATEGORY */}

            <div className="field">

              <label>
                Category
              </label>


              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
              >

                <option>
                  Science
                </option>

                <option>
                  Technology
                </option>

                <option>
                  Education
                </option>

                <option>
                  Health
                </option>

              </select>

            </div>


            {/* TAGS */}

            <div className="field">

              <label>
                Tags (comma separated)
              </label>


              <input
                type="text"
                placeholder="biology, medicine, genetics"
                value={tags}
                onChange={(e) =>
                  setTags(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* CONTENT */}

          <div className="field content-field">

            <label>
              Content
            </label>


            <textarea
              placeholder="Write your article here. Use **bold text** for subheadings."
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
            />

          </div>

        </section>


        {/* ==================================
                    QUIZ
                ================================== */}

        <section className="card quiz-card">


          {/* QUIZ HEADER */}

          <div className="quiz-header">

            <div>

              <h2>
                Add a Quiz
              </h2>

              <p>
                Quizzes increase reader
                engagement significantly.
              </p>

            </div>


            {/* TOGGLE */}

            <button
              className={
                quizEnabled
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setQuizEnabled(
                  !quizEnabled
                )
              }
            >

              <span />

            </button>

          </div>


          {/* QUESTIONS */}

          {quizEnabled && (

            <div className="quiz-content">

              <div className="divider" />


              {questions.map(
                (
                  question,
                  questionIndex
                ) => (

                  <div
                    className="question-box"
                    key={questionIndex}
                  >


                    <div className="question-number">

                      QUESTION{" "}

                      {questionIndex + 1}

                    </div>


                    {/* QUESTION INPUT */}

                    <input
                      className="question-input"
                      type="text"
                      placeholder="Enter question..."
                      value={
                        question.question
                      }
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          e.target.value
                        )
                      }
                    />


                    {/* OPTIONS */}

                    <div className="options-grid">

                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <div
                            className={
                              question.correctAnswer ===
                                option &&
                                option !== ""
                                ? "option selected"
                                : "option"
                            }
                            key={
                              optionIndex
                            }
                          >


                            {/* CHECKBOX */}

                            <button
                              className={
                                question.correctAnswer ===
                                  option &&
                                  option !== ""
                                  ? "check selected"
                                  : "check"
                              }
                              onClick={() =>
                                selectCorrectAnswer(
                                  questionIndex,
                                  optionIndex
                                )
                              }
                            >

                              {question.correctAnswer ===
                                option &&
                                option !== ""
                                ? "✓"
                                : ""}

                            </button>


                            {/* OPTION INPUT */}

                            <input
                              type="text"
                              placeholder={`Option ${String.fromCharCode(
                                65 +
                                optionIndex
                              )}`}
                              value={
                                option
                              }
                              onChange={(e) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                            />

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )
              )}


              {/* ADD QUESTION */}

              <button
                className="add-question"
                onClick={addQuestion}
              >

                <span>
                  +
                </span>

                Add Question

              </button>

            </div>

          )}

        </section>


        {/* ==================================
                    CREATED QUIZ
                ================================== */}

        {createdQuiz && (

          <section className="card">

            <h2>
              Quiz Created
            </h2>


            <p>

              <strong>
                Title:
              </strong>{" "}

              {createdQuiz.title}

            </p>


            <p>
              <strong>Status:</strong>{" "}

              <span className={getStatusClass(createdQuiz.status)}>
                {createdQuiz.status}
              </span>
            </p>


            <p>

              <strong>
                Questions:
              </strong>{" "}

              {createdQuiz.questions.length}

            </p>

          </section>

        )}

        {/* ==================================
    ALL QUIZZES
================================== */}

        {quizList.length > 0 && (

          <section className="card">

            <h2>
              All Quizzes
            </h2>

            <div className="quiz-stats">

              <div className="quiz-stat-card">
                <span>Total</span>
                <strong>{quizList.length}</strong>
              </div>

              <div className="quiz-stat-card">
                <span>Draft</span>
                <strong>
                  {
                    quizList.filter(
                      (quiz) => quiz.status === "draft"
                    ).length
                  }
                </strong>
              </div>

              <div className="quiz-stat-card">
                <span>Submitted</span>
                <strong>
                  {
                    quizList.filter(
                      (quiz) => quiz.status === "submitted"
                    ).length
                  }
                </strong>
              </div>

              <div className="quiz-stat-card">
                <span>Approved</span>
                <strong>
                  {
                    quizList.filter(
                      (quiz) => quiz.status === "approved"
                    ).length
                  }
                </strong>
              </div>

            </div>

            <div className="quiz-search">

              <label>
                Search:
              </label>

              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <div className="quiz-filter">

              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <label>
                Filter:
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="all">
                  All
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="submitted">
                  Submitted
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>

              </select>

              <button
                type="button"
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

            {filteredQuizzes.length === 0 && (
              <div className="no-quizzes">
                <h3>
                  No quizzes found
                </h3>

                <p>
                  There are no quizzes matching this filter.
                </p>
              </div>
            )}

            {filteredQuizzes.map((quiz) => (

              <div
                className="quiz-list-card"
                key={quiz._id}
              >

                <div className="quiz-list-header">

                  <div>

                    <h3>
                      {quiz.title}
                    </h3>

                    <p>
                      {quiz.description}
                    </p>

                  </div>


                  <span
                    className={getStatusClass(quiz.status)}
                  >
                    {quiz.status}
                  </span>

                </div>


                <div className="quiz-list-info">

                  <span>
                    📝 {quiz.questions.length} Questions
                  </span>

                  {quiz.articleId && (
                    <span>
                      🔗 Article Attached
                    </span>
                  )}

                  <span>
                    📅 Created:{" "}
                    {new Date(
                      quiz.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <span>
                    🔄 Updated:{" "}
                    {new Date(
                      quiz.updatedAt
                    ).toLocaleDateString()}
                  </span>

                </div>


                <div className="quiz-list-actions">

                  <button
                    className="view-button"
                    onClick={() => setViewingQuiz(quiz)}
                  >
                    View Quiz
                  </button>

                  {quiz.status === "draft" && (
                    <button
                      className="save-button"
                      onClick={() => setEditingQuiz(quiz)}
                    >
                      Edit Quiz
                    </button>
                  )}

                  {quiz.status === "draft" && (
                    <button
                      className="submit-button"
                      onClick={() => submitQuiz(quiz._id)}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? "Submitting..."
                        : "Submit for Review"}
                    </button>
                  )}

                  {quiz.status === "draft" && (
                    <button
                      className="delete-button"
                      onClick={() => deleteQuiz(quiz._id)}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? "Deleting..."
                        : "Delete Quiz"}
                    </button>
                  )}

                </div>

              </div>

            ))}

          </section>

        )}

        {/* ==================================
    EDIT QUIZ
================================== */}

        {editingQuiz &&
          editingQuiz.status === "draft" && (

            <section className="card">

              <h2>
                Edit Quiz
              </h2>

              <label>
                Article ID
              </label>

              <input
                type="text"
                placeholder="Enter article ID..."
                value={editingQuiz.articleId || ""}
                onChange={(e) =>
                  setEditingQuiz({
                    ...editingQuiz,
                    articleId: e.target.value
                  })
                }
              />

              <button
                type="button"
                className="save-button"
                onClick={attachQuizToArticle}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Attaching..."
                  : "Attach Quiz to Article"}
              </button>

              <label>
                Quiz Title
              </label>

              <input
                type="text"
                value={editingQuiz.title}
                onChange={(e) =>
                  setEditingQuiz({
                    ...editingQuiz,
                    title: e.target.value
                  })
                }
              />


              <br />
              <br />


              <label>
                Description
              </label>

              <input
                type="text"
                value={editingQuiz.description || ""}
                onChange={(e) =>
                  setEditingQuiz({
                    ...editingQuiz,
                    description: e.target.value
                  })
                }
              />


              <br />
              <br />


              <h3>
                Questions
              </h3>


              {editingQuiz.questions.map(
                (question, questionIndex) => (

                  <div
                    className="question-box"
                    key={question._id}
                  >

                    {/* QUESTION */}

                    <label>
                      Question {questionIndex + 1}
                    </label>

                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => {

                        const updatedQuestions = [
                          ...editingQuiz.questions
                        ];

                        updatedQuestions[
                          questionIndex
                        ].question = e.target.value;

                        setEditingQuiz({
                          ...editingQuiz,
                          questions: updatedQuestions
                        });

                      }}
                    />


                    {/* OPTIONS */}

                    <h4>
                      Options
                    </h4>

                    {question.options.map(
                      (option, optionIndex) => (

                        <div
                          className="option"
                          key={optionIndex}
                        >

                          {/* CORRECT ANSWER BUTTON */}

                          <button
                            type="button"
                            className={
                              question.correctAnswer === option
                                ? "check selected"
                                : "check"
                            }
                            onClick={() => {

                              const updatedQuestions = [
                                ...editingQuiz.questions
                              ];

                              updatedQuestions[
                                questionIndex
                              ].correctAnswer = option;

                              setEditingQuiz({
                                ...editingQuiz,
                                questions: updatedQuestions
                              });

                            }}
                          >

                            {question.correctAnswer === option
                              ? "✓"
                              : ""}

                          </button>


                          {/* OPTION INPUT */}

                          <input
                            type="text"
                            value={option}
                            placeholder={`Option ${String.fromCharCode(
                              65 + optionIndex
                            )}`}
                            onChange={(e) => {

                              const updatedQuestions = [
                                ...editingQuiz.questions
                              ];

                              updatedQuestions[
                                questionIndex
                              ].options[
                                optionIndex
                              ] = e.target.value;

                              setEditingQuiz({
                                ...editingQuiz,
                                questions: updatedQuestions
                              });

                            }}
                          />

                        </div>

                      )
                    )}

                    <button
                      type="button"
                      className="delete-button"
                      disabled={
                        editingQuiz.questions.length === 1
                      }
                      title={
                        editingQuiz.questions.length === 1
                          ? "A quiz must have at least one question"
                          : "Delete this question"
                      }
                      onClick={() =>
                        deleteQuestion(
                          editingQuiz._id,
                          question._id
                        )
                      }
                    >
                      Delete Question
                    </button>

                  </div>

                )
              )}

              <button
                type="button"
                className="add-question"
                onClick={() => {

                  const newQuestion = {
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: ""
                  };

                  setEditingQuiz({
                    ...editingQuiz,
                    questions: [
                      ...editingQuiz.questions,
                      newQuestion
                    ]
                  });

                }}
              >
                <span>+</span>
                Add Question
              </button>

              <br />


              <button
                className="save-button"
                onClick={updateQuiz}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>


              <button
                className="cancel-button"
                onClick={() => {

                  const confirmCancel = window.confirm(
                    "Are you sure you want to cancel? Your unsaved changes will be lost."
                  );

                  if (!confirmCancel) {
                    return;
                  }

                  setEditingQuiz(null);

                }}
              >
                Cancel
              </button>

            </section>

          )}


        {/* ==================================
                    BOTTOM BUTTONS
                ================================== */}

        <div className="bottom-actions">


          <button
            className="save-button"
            onClick={createQuiz}
          >

            Save Draft

          </button>


          {createdQuiz &&
            createdQuiz.status === "draft" && (

              <button
                className="submit-button"
                onClick={submitArticle}
              >

                <span>
                  ◇
                </span>

                Submit for Review

              </button>

            )}

        </div>


      </main>

      {viewingQuiz && (
        <div className="quiz-modal">

          <div className="quiz-modal-content">

            {/* HEADER */}

            <div className="quiz-modal-header">

              <div>

                <h2>
                  {viewingQuiz.title}
                </h2>

                <p>
                  {viewingQuiz.description}
                </p>

                <p>
                  <strong>Article:</strong>{" "}

                  {viewingQuiz.articleId
                    ? "Attached"
                    : "Not Attached"}
                </p>

                {viewingQuiz.articleId && (
                  <p>
                    <strong>Article ID:</strong>{" "}
                    {viewingQuiz.articleId}
                  </p>
                )}

              </div>


              <span
                className={getStatusClass(
                  viewingQuiz.status
                )}
              >
                {viewingQuiz.status}
              </span>

            </div>


            <hr />


            {/* QUESTIONS */}

            {viewingQuiz.questions.map(
              (question, questionIndex) => (

                <div
                  className="view-question"
                  key={question._id || questionIndex}
                >

                  <h3>
                    {questionIndex + 1}.{" "}
                    {question.question}
                  </h3>


                  <div className="view-options">

                    {question.options.map(
                      (option, optionIndex) => (

                        <div
                          className={
                            option ===
                              question.correctAnswer
                              ? "view-option correct"
                              : "view-option"
                          }
                          key={optionIndex}
                        >

                          <span>
                            {String.fromCharCode(
                              65 + optionIndex
                            )}.
                          </span>

                          {option}

                          {option ===
                            question.correctAnswer && (
                              <strong>
                                {" "}✓ Correct Answer
                              </strong>
                            )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              )
            )}


            {/* CLOSE BUTTON */}

            <button
              className="save-button"
              onClick={() =>
                setViewingQuiz(null)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


createRoot(
  document.getElementById("root")
).render(

  <StrictMode>
    <App />
  </StrictMode>

);