import React from "react";

const Rows = data => {
  if (data && data.items) {
    return data.items.map(item => {
      return (
        <tr key={item.id}>
          <td className="mdl-data-table__cell--non-numeric">
            {item.full_name}
          </td>
          <td>{item.score}</td>
        </tr>
      );
    });
  } else {
    return null;
  }
};

const Table = ({ data }) => (
  <table className="xm2 mdl-data-table mdl-js-data-table">
    <thead>
      <tr>
        <th className="mdl-data-table__cell--non-numeric">Name</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>{Rows(data)}</tbody>
  </table>
);

export default Table;
