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
import ToggleBtn from "./ToggleButton";
// import defaultAvatar from "../../assets/user-avatar.png";

const projects = [
  {
    name: "John Smith",
    polls: 34,
    status: "Active",
    email: "johnsmith123@gmail.com",
    progress: 15,
  },
  {
    name: "James Doe",
    polls: 47,
    status: "Active",
    email: "JamesDoeDoe@gmail.com",
    progress: 35,
  },
  {
    name: "Kelly Johnson",
    polls: 120,
    status: "Suspended",
    email: "kjhonson@yahoo.com",
    progress: 75,
  },
  {
    name: "Rachel Green",
    polls: 89,
    status: "Active",
    email: "GreenRed@gmail.com",
    progress: 63,
  },
  {
    name: "Robert Brown",
    polls: 108,
    status: "Suspended",
    email: "theycallmebrown@yahoo.com",
    progress: 100,
  },
  {
    name: "Paul White",
    polls: 55,
    status: "Active",
    email: "Walterwhite@gmail.com",
    progress: 42,
  },
  {
    name: "Susan Black",
    polls: 200,
    status: "Active",
    email: "SuzzySusan@gmail.com",
    progress: 10,
  },
];

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => {
      const name = info.getValue();
  
      return (
        <div className="user-cell">
          <img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png" alt="avatar" className="user-avatar" />
          <span className="user-name">{name}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("polls", {
    header: "Polls",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <div className="email">
        {info.getValue()}
      </div>
    ),
    enableColumnFilter: false,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <span className={`status-tag-${info.getValue().toLowerCase()}`}>{info.getValue()}</span>
      ) : null,
    filterFn: "includesString",
  }),
  columnHelper.accessor("status", {
    header: "Actions",
    cell: (info) => {
      const value = info.getValue();
      return (
        <ToggleBtn initialStatus={value}/>
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
      <div className="table-holder">
      <h2>Users</h2>

   
      <input
        type="text"
        placeholder="Search by Name..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="search-input"
      />

      <div className="filter-controls">
        <label>
          Filter by Status:
          <select
            value={
              table
                .getColumn("status")
                ?.getFilterValue() ?? ""
            }
            onChange={(e) =>
              table.getColumn("status")?.setFilterValue(e.target.value || undefined)
            }
          >
            <option value="">All</option>
            <option value="suspended">Suspended</option>
            <option value="active">Active</option>
            
          </select>
        </label>
      </div>
      
      <div className="table-responsive">
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
      </div>

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
    </div>
  );
};

export default ActiveProjects;
