import React, { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const initialQuestions = [{ questionTitle: "", options: ["", ""] }];
const initialDuration = "";

const Create = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { isAuthenticated: isAuth0Authenticated, isLoading: auth0Loading } = useAuth0();
  const navigate = useNavigate();

  const isUserLoggedIn = isLoggedIn || isAuth0Authenticated;

  const [questions, setQuestions] = useState(initialQuestions);
  const [duration, setDuration] = useState(initialDuration);
  const [createdPollId, setCreatedPollId] = useState(null);
  const [message, setMessage] = useState("");

  // Handle changes
  const handleQuestionChange = (qIdx, value) => {
    setQuestions(prev =>
      prev.map((q, idx) => (idx === qIdx ? { ...q, questionTitle: value } : q))
    );
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === oIdx ? value : opt)),
            }
          : q
      )
    );
  };

  const handleAddOption = qIdx => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleDeleteOption = qIdx => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx && q.options.length > 2
          ? { ...q, options: q.options.slice(0, -1) }
          : q
      )
    );
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, { questionTitle: "", options: ["", ""] }]);
  };

  const handleDurationChange = e => setDuration(e.target.value);

  const handleDeleteDraft = () => {
    setQuestions(initialQuestions);
    setDuration(initialDuration);
    setMessage("Draft cleared.");
  };

  const handleDuplicatePoll = () => {
    const duplicated = questions.map(q => ({
      questionTitle: q.questionTitle,
      options: [...q.options],
    }));
    setQuestions(duplicated);
    setDuration(duration);
    setMessage("Poll duplicated.");
  };

  // API logic
  const createPoll = async () => {
    const pollRes = await axios.post("/api/polls", {
      title: questions[0]?.questionTitle || "Untitled Poll",
      description: "", // Add a description field if needed
      allowGuests: true,
      endTime: duration ? new Date(Date.now() + duration * 60000).toISOString() : null,
    });

    const pollId = pollRes.data.id;
    setCreatedPollId(pollId);

    // Add options
    for (const q of questions) {
      const validOptions = q.options.filter(opt => opt.trim() !== "");
      for (const opt of validOptions) {
        await axios.post(`/api/polls/${pollId}/options`, { text: opt });
      }
    }

    return pollId;
  };

  const handleSaveAsDraft = async () => {
    const confirmed = window.confirm("Save this poll as a draft?");
    if (!confirmed) return;
    try {
      await createPoll();
      setMessage("✅ Poll saved as draft!");
    } catch {
      setMessage("❌ Failed to save poll.");
    }
  };

  const handlePublish = async () => {
    const confirmed = window.confirm("Are you sure you want to publish this poll?");
    if (!confirmed) return;

    try {
      const pollId = createdPollId || (await createPoll());
      await axios.put(`/api/polls/publish/${pollId}`);
      setMessage("🚀 Poll published!");
      navigate(`/polls/${pollId}`);
    } catch (err) {
      console.error("Publish error:", err);
      setMessage("❌ Failed to publish poll.");
    }
  };

  // UI guard
  if (auth0Loading) return <div>Loading...</div>;

  if (!isUserLoggedIn) {
    return (
      <div className="login-prompt">
        <h2>You must be logged in to create a poll.</h2>
        <Link to="/login" className="login-link">Go to Login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="create-poll-form">
      <h2>Create a New Poll</h2>

      <div className="form-group">
        <label htmlFor="duration">Poll Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="1"
          value={duration}
          onChange={handleDurationChange}
          placeholder="Enter duration in minutes"
        />
      </div>

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="question-block">
          <label>
            Question {qIdx + 1}:
            <input
              type="text"
              value={q.questionTitle}
              onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
              placeholder="Enter question"
              required
            />
          </label>

          {q.options.map((option, oIdx) => (
            <div key={oIdx} className="option-block">
              <label>
                Option {oIdx + 1}:
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                  placeholder={`Enter option ${oIdx + 1}`}
                  required
                />
              </label>
            </div>
          ))}

          <button type="button" onClick={() => handleAddOption(qIdx)} className="btn btn-add-option">Add Option</button>
          <button type="button" onClick={() => handleDeleteOption(qIdx)} disabled={q.options.length <= 2} className="btn btn-delete-option">
            Delete Option
          </button>
        </div>
      ))}

      <div className="form-actions">
        <button type="button" onClick={handleAddQuestion} className="btn btn-add-question">Add Question</button>
        <button type="button" onClick={handleSaveAsDraft} className="btn btn-save-draft">Save as Draft</button>
        <button type="button" onClick={handlePublish} className="btn btn-publish">Publish Poll</button>
        <button type="button" onClick={handleDeleteDraft} className="btn btn-delete-draft">Delete Draft</button>
        <button type="button" onClick={handleDuplicatePoll} className="btn btn-duplicate-poll">Duplicate Poll</button>
      </div>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default Create;
