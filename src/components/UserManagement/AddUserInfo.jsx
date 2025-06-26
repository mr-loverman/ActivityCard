import { doc, setDoc } from "firebase/firestore";
import { useState } from "react"
import { db } from "../../config/firebase-config";

function AddUserInfo({users}) {

  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    year_section: "",
  })

  const handleChange = (inputs) => {
    const { name, value } = inputs.target;
    setUserInfo((prevUserInput) => ({
      ...prevUserInput,
      [name]: value,
    }));
  }

  const addInformation = async () => {
    const userFound = users.find(user => userInfo.id === user.id) === null
    if (userInfo.id === "" || userInfo.id === null) {
      console.log("You must enter an Id");
      return;
    }

    if (!userFound) {
      try {
        await setDoc(doc(db, "UserTest", userInfo.id), {
          name: userInfo.name,
          year_section: userInfo.year_section,
          email: "",
          password_hash: "123456",
          role: "student",
          qr_token: "",
          status: "active",
          created_at: new Date(),
        });
        console.log(userInfo)
        console.log("User sucessfully added:", userInfo.name)
      } catch (err) {
        console.error("Error in adding the user:", err)
      }
    }
  }

  return (
    <>
      <div>
        <p>
          Student ID:
        </p>
        <input 
        name="id"
        value={userInfo.id}
        onChange={handleChange}
        >
        </input>
      </div>
      <div>
        <p>
          Name:
        </p>
        <input
        name="name"
        value={userInfo.name}
        onChange={handleChange}
        >
        </input>
      </div>
      <div>
        <p>
          Year and Section:
        </p>
        <input
        name="year_section"
        value={userInfo.year_section}
        onChange={handleChange}
        >
        </input>
      </div>
      <div>
        <button
        onClick={addInformation}
        >
          add
        </button>
      </div>
    </>
  )

}

export default AddUserInfo