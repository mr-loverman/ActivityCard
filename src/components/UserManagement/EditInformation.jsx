import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config"
import { doc, updateDoc } from "firebase/firestore"


function EditInformation({user, refresh, editingRowId, setEditingRowId}) {

  const isEditing = editingRowId === user.id;
  const [userEdit, setUserEdit] = useState({
    id: "",
    name: "",
    year_section: "",
  });

    const handleEditChange = (input) => {
    const {name, value} = input.target;
    setUserEdit((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  }

  const editInformation = async (e, user) => {

    e.preventDefault();

    if (!isEditing) {
      setEditingRowId(user.id);
      setUserEdit({
        id: user.id,
        name: user.name,
        year_section: user.year_section,
      })
    } else {
      if (!userEdit.id) {
        console.log("You must provide an ID")
      }

      if (userEdit.id === user.id) {

        const docRef = doc(db, "UserTest", user.id);

        try {
          await updateDoc(docRef, userEdit);
        } catch (err) {
          console.error("Failed in updating the document: ", err);
        }
        
      }
      setEditingRowId(null);
    }
    refresh();
  }

  return (
    <tr>
      <td>{isEditing ? <input name="id" value={userEdit.id} onChange={handleEditChange} /> : user.id}</td>
      <td>{isEditing ? <input name="name" value={userEdit.name} onChange={handleEditChange} /> : user.name}</td>
      <td>{isEditing ? <input name="year_section" value={userEdit.year_section} onChange={handleEditChange} /> : user.year_section}</td>
      <td>{user.email === "" ? "None" : user.email}</td>
      <td>{user.created_at}</td>
      <td>
        {isEditing ? 
            <button
            onClick={(e) => editInformation(e, user)}
            > submit </button>
          : editingRowId === null ? 
            <button
            onClick={(e) => editInformation(e, user)}
            > edit </button> :
          null  
        }
      </td>
    </tr>
  )

}

export default EditInformation