import React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'
  
  // type Result = {
  //   id: number;
  //   pollName: string;
  //   status: string;
  //   author: string;
  //   createdAt: string;
  //   votes: number;
  // }

  const defaultData = [
    {
    id: 1,
    pollName: "Best Programming Language",
    status: "Open",
    author: "John Doe",
    createdAt: "2023-10-01",
    votes: 150,
    },
    {
      id: 2,
      pollName: "Best Food",
      status: "Closed",
      author: "Jane Smith",
      createdAt: "2023-09-15",
      votes: 200,
    },
    {
        id: 3,
        pollName: "Favorite Movie Genre",
        status: "Open",
        author: "Alice Johnson",
        createdAt: "2023-10-05",
        votes: 120,
    },
  ]

const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('pollName', {
      header: 'Poll Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('author', {
      header: 'Author',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('votes', {
      header: 'Votes',
      cell: info => info.getValue(),
    }),
  ]
  



const Result = () => {
  const [results, setResults] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <h1>Results</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
 
}

export default Result
