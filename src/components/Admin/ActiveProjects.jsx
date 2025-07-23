// components/ActiveProjects.jsx
import React from "react";
import "./ActiveProjects.css";

const projects = [
  {
    name: "Dropbox Design System",
    hours: 34,
    priority: "",
    members: ["👤", "👤", "👤", "👤"],
    progress: 15,
  },
  {
    name: "Slack Team UI Design",
    hours: 47,
    priority: "",
    members: ["👤", "👤", "👤"],
    progress: 35,
  },
  {
    name: "GitHub Satellite",
    hours: 120,
    priority: "Low",
    members: ["👤", "👤", "👤", "👤"],
    progress: 75,
  },
  {
    name: "3D Character Modelling",
    hours: 89,
    priority: "",
    members: ["👤", "👤", "👤"],
    progress: 63,
  },
  {
    name: "Webapp Design System",
    hours: 108,
    priority: "",
    members: ["👤", "👤", "👤", "👤"],
    progress: 100,
  },
];

const ActiveProjects = () => {
  return (
    <div className="active-projects">
      <h2>Active Projects</h2>
      <table className="projects-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Hours</th>
            <th>Priority</th>
            <th>Members</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => (
            <tr key={idx}>
              <td>{project.name}</td>
              <td>{project.hours}</td>
              <td>
                {project.priority && (
                  <span className="priority-tag">{project.priority}</span>
                )}
              </td>
              <td>
                <div className="members">
                  {project.members.map((m, i) => (
                    <span key={i} className="member-avatar">
                      {m}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${project.progress}%` }}
                  />
                  <span className="progress-text">{project.progress}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveProjects;
