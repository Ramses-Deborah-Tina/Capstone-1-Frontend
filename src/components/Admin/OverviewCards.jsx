import React from "react";
import "./OverviewCards.css";

const OverviewCards = () => {
  const cards = [
    { title: "Projects", value: 18, sub: "2 Completed" },
    { title: "Active Task", value: 132, sub: "28 Completed" },
    { title: "Teams", value: 12, sub: "1 Completed" },
    { title: "Productivity", value: "76%", sub: "5% Completed" },
  ];

  return (
    <div className="overview-cards">
      <div className="card-header">
        <h2>Admin Dashboard</h2>
        <div className="create-project-btn">Create New Project</div>
      </div>

      <div className="card-container">
        {cards.map((card, idx) => (
          <div key={idx} className="card">
            <div className="card-title">{card.title}</div>
            <div className="card-value">{card.value}</div>
            <div className="card-sub">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;
