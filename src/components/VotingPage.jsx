import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Remove mockUser, expect actual user prop to be passed
// const mockUser = { username: "testuser" };

const fallbackPoll = {
  questions: [
    {
      questionTitle: "Favorite Fruit?",
      options: ["Apple", "Banana", "Orange"],
      votes: 12,
    },
    {
      questionTitle: "Best Color?",
      options: ["Red", "Blue", "Green"],
      votes: 8,
    },
  ],
  endDate: "2025-07-20",
};

const VotingPage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const poll = location.state?.poll || fallbackPoll;

  // Rankings state now resets when poll changes 
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    setRankings(poll.questions.map((q) => Array(q.options.length).fill("")));
  }, [poll]);

  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleRankChange = (qIdx, oIdx, rank) => {
    setRankings((prev) =>
      prev.map((ranks, idx) =>
        idx === qIdx
          ? ranks.map((r, i) => (i === oIdx ? rank : r))
          : ranks
      )
    );
  };

  const isRankingComplete = () =>
    rankings.every((ranks) => {
      const filled = ranks.filter((r) => r !== "");
      const unique = new Set(filled).size === filled.length;
      return filled.length === ranks.length && unique;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasVoted) return;
    if (!isRankingComplete()) {
      setWarning(true);
      return;
    }
    setWarning(false);
    setSubmitted(true);
    setHasVoted(true);
    // TODO: submit rankings to backend here
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setEmailSubmitted(true);
    // TODO: Send email to backend to receive results
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  // Save for later now saves rankings to localStorage as placeholder 
  const handleSaveForLater = () => {
    if (!user) return; // Only logged-in users can save
    localStorage.setItem(
      `savedRankings_${user.username}_${poll.endDate}`,
      JSON.stringify(rankings)
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="voting-page">
      <h2>🗳️ Vote on This Poll</h2>
      <p>
        Poll ends: <strong>{poll.endDate}</strong> <br />
        Total votes so far:{" "}
        <strong>
          {poll.questions.reduce((sum, q) => sum + (q.votes || 0), 0)}
        </strong>
      </p>
      {hasVoted && (
        <div style={{ color: "red" }}>
          You have already submitted your ballot.
        </div>
      )}
      {warning && (
        <div style={{ color: "orange" }}>
          Please rank all options uniquely for each question!
        </div>
      )}
      {saved && (
        <div style={{ color: "blue" }}>
          Rankings saved! You can come back later to submit.
        </div>
      )}
      {submitted && !emailSubmitted && (
        <form onSubmit={handleEmailSubmit}>
          <div style={{ color: "green" }}>
            Thank you for voting! Enter your email to receive poll results:
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ margin: "1em 0", padding: "0.5em" }}
          />
          <button type="submit">Submit Email</button>
        </form>
      )}
      {emailSubmitted && (
        <div style={{ color: "blue" }}>
          Your email was submitted! You will receive the results when the poll ends.
        </div>
      )}
      {!submitted && (
        <form onSubmit={handleSubmit}>
          {poll.questions.map((q, qIdx) => (
            <div key={qIdx} className="question-block">
              <h3>{q.questionTitle}</h3>
              <div className="options-list">
                {q.options.map((option, oIdx) => (
                  <div key={oIdx} style={{ marginBottom: "0.5em" }}>
                    <span>{option}</span>
                    <select
                      value={rankings[qIdx]?.[oIdx] || ""}
                      onChange={(e) =>
                        handleRankChange(qIdx, oIdx, e.target.value)
                      }
                      disabled={hasVoted}
                    >
                      <option value="">Rank</option>
                      {q.options.map((_, rankIdx) => (
                        <option key={rankIdx} value={rankIdx + 1}>
                          {rankIdx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <span>Votes: {q.votes || 0}</span>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="submit-vote-btn"
            disabled={hasVoted}
          >
            Submit Vote
          </button>
          {/* Use real user prop instead of mockUser */}
          {user && (
            <button
              type="button"
              onClick={handleSaveForLater}
              disabled={hasVoted}
              style={{ marginLeft: "1em" }}
            >
              Save for Later
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default VotingPage;
