import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config";


function EditUserInfo({user, refresh, editingRowId, setEditingRowId, userEdit, setUserEdit}) {

  // responsible for editing information

  const editInformation = async (e, user) => {

    // prevents reload upon submitting (can be changed
    // depending on preference)

    e.preventDefault();

    // if editing sets userEdit to current user info base
    // on the id provided by clicking edit button
    // if button is clicked again with the display of 
    // submit, edits information in cloud firestore

    if (!editingRowId) {
      setEditingRowId(user.id);
      setUserEdit({
        id: user.id,
        name: user.name,
        year_section: user.year_section,
      })
    } else {
      console.log(userEdit)
      if (!userEdit.id) {
        console.log("You must provide an ID")
        setEditingRowId(null);
        return;
      }

      // chechks if no info is changed, no change means
      // nothing will happen upon clicking submit

      if (userEdit.name !== user.name || userEdit.year_section == user.year_section) {

        if (userEdit.id !== user.id) {

          const docRef = doc(db, "UserTest", user.id);

          try {
            await updateDoc(docRef, userEdit);
          } catch (err) {
            console.error("Failed in updating the document: ", err);
          }
          
        }

      }

      // setting row id to null for other edit attempts

      setEditingRowId(null);
    }
    refresh();
  }

  return(
    <>
      {/* all rows has edit button but when one is clicked 
      other button is hidden except for the clicked row
      after clicking submit then all edit buttons will
      appear again */}
      {editingRowId === user.id? 
          <button
          onClick={(e) => editInformation(e, user)}
          > submit </button>
        : editingRowId === null ? 
          <button
          onClick={(e) => editInformation(e, user)}
          > edit </button> :
        null  
      }
    </>
  )

}

export default EditUserInfo