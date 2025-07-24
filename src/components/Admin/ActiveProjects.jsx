// components/ActiveProjects.jsx
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
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
  {
    name: "Mobile App Redesign",
    hours: 55,
    priority: "High",
    members: ["👤", "👤"],
    progress: 42,
  },
  {
    name: "AI Prototype",
    hours: 200,
    priority: "Urgent",
    members: ["👤", "👤", "👤"],
    progress: 10,
  },
];

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    header: "Project Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("hours", {
    header: "Hours",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) =>
      info.getValue() ? (
        <span className="priority-tag">{info.getValue()}</span>
      ) : null,
    filterFn: "includesString",
  }),
  columnHelper.accessor("members", {
    header: "Members",
    cell: (info) => (
      <div className="members">
        {info.getValue().map((m, i) => (
          <span key={i} className="member-avatar">
            {m}
          </span>
        ))}
      </div>
    ),
    enableColumnFilter: false,
  }),
  columnHelper.accessor("progress", {
    header: "Progress",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${value}%` }} />
          <span className="progress-text">{value}%</span>
        </div>
      );
    },
    enableColumnFilter: false,
  }),
];

const ActiveProjects = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: projects,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="active-projects">
      <h2>Active Projects</h2>

      {/* 🔍 Global Search */}
      <input
        type="text"
        placeholder="Search projects..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="search-input"
      />

      {/* 🎯 Column Filter: Priority */}
      <div className="filter-controls">
        <label>
          Filter by Priority:
          <select
            value={
              table
                .getColumn("priority")
                ?.getFilterValue() ?? ""
            }
            onChange={(e) =>
              table.getColumn("priority")?.setFilterValue(e.target.value || undefined)
            }
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </label>
      </div>

      <table className="projects-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ⏮️ Pagination */}
      <div className="pagination-controls">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>

        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveProjects;
