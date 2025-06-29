import { useEffect, useState } from "react";
import EditUserInfo from "./EditUserInfo"


function RowInfo({user, refresh, isEditing, setEditing ,editingRowId, setEditingRowId}) {

  let isEditingRow = editingRowId === user.id;
  const [userEdit, setUserEdit] = useState({
    id: "",
    name: "",
    year_section: "",
  });

  // handle chnge for editing

  const handleEditChange = (input) => {
    const {name, value} = input.target;
    setUserEdit((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  }

  return (
    <>
      {/* displays rows with the loaded information from cloudbase */}
      <tr>
        <td>{editingRowId === user.id ? <input name="id" value={userEdit.id} onChange={handleEditChange} /> : user.id}</td>
        <td>{editingRowId === user.id ? <input name="name" value={userEdit.name} onChange={handleEditChange} /> : user.name}</td>
        <td>{editingRowId === user.id ? <input name="year_section" value={userEdit.year_section} onChange={handleEditChange} /> : user.year_section}</td>
        <td>{user.email === "" ? "None" : user.email}</td>
        <td>{user.created_at}</td>
        <td>
          <EditUserInfo user={user} refresh={refresh} editingRowId={editingRowId} setEditingRowId={setEditingRowId} setIsEditing={setEditing} isEditing={isEditing} userEdit={userEdit} setUserEdit={setUserEdit} />
        </td>
      </tr>
    </>
  )

}

export default RowInfo