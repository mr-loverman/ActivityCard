import { useEffect, useState } from "react"

// option for dropdown menu

const queryOptions = Object.freeze({
  "Student Id": "id",
  "Name" : "name",
  "Course & Section" : "year_section",
})

function QueryUserInfo({users, queryResult}) {

  const [queryInput, setQueryInput] = useState('')
  const [dropdownValue, setDropdownValue] = useState('');
  const defaultSort = "name";

  // handles change for dopdown

  const handleDropdownChange = (selected) => {
    let sortedUsers = [...users].sort((a, b) => a[selected.target.value].localeCompare(b[selected.target.value]))
    setDropdownValue(selected.target.value);
    setQueryInput('');
    queryResult(sortedUsers);
  };

  // handles change for querying

  const handleQueryChange = (inputs) => {

    const value = inputs.target.value.toLowerCase();
    setQueryInput(value)

    // query results that starts with the input value

    const startsWithResult = users.filter(user =>
      user[dropdownValue].toLowerCase().startsWith(value)
    );

    // query results that includes the input value specifically including the 
    // those with the matching user substring from the query input

    const includesResult = users.filter(user =>
      !user[dropdownValue ].toLowerCase().startsWith(value) && 
      user[dropdownValue].toLowerCase().includes(value)
    ).sort((a, b) => {
      return a[dropdownValue].toLowerCase().indexOf(value) - b[dropdownValue].toLowerCase().indexOf(value);
    })

    // combine queries but prioritizes the includes with 
    // the startswith result comes after

    queryResult([...includesResult, ...startsWithResult]);
  };


  useEffect(() => {
    if (users && users.length > 0) {
      let sortedUsers = [...users].sort((a, b) => a[defaultSort].localeCompare(b[defaultSort]));
      queryResult(sortedUsers);
    }
  },[users])

  return (
    <>
    <div>
      <input 
      value={queryInput}
      onChange={handleQueryChange}
      placeholder="Search" 
      ></input>
      <select
      id="dropdown"
      value={dropdownValue}
      onChange={handleDropdownChange}
      >
        <option value="" disabled hidden >Search Option</option>
        {Object.entries(queryOptions).map(([key, value]) => (
          <option key={key} value={value} >{key}</option>
        ))}
      </select>
    </div>
    </>
  )

}

export default QueryUserInfo