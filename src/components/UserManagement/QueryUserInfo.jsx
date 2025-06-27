import { useState } from "react"

function QueryUserInfo({users, queryResult}) {

  const handleChange = (inputs) => {
    const value = inputs.target.value

    // query results that starts with the input value

    const startsWithResult = users.filter(user =>
      user.name.toLowerCase().startsWith(value.toLowerCase())
    )

    // query results that includes the input value

    const includesResult = users.filter(user =>
      !user.name.toLowerCase().startsWith(value.toLowerCase()) && 
      user.name.toLowerCase().includes(value.toLowerCase())
    )

    // combine queries but prioritizes the starts with 
    // the includes result comes after

    queryResult([...startsWithResult, ...includesResult]);
  }

  return (
    <>
      <input 
      onChange={handleChange}
      placeholder="Search" 
      ></input>
    </>
  )

}

export default QueryUserInfo