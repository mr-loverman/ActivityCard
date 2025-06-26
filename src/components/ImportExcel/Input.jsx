import { useState } from "react"
import { db } from "../../config/firebase-config"
import { doc, getDoc, setDoc } from "firebase/firestore"
import ExcelJS from "exceljs"

const UNDEFINED_VALUES = "NYS";

function Import() {

  const jsonData = [];
  const headers = [];

  const handleFileUpload = async (e) => {

    const file = e.target.files[0];
    const workBook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workBook.xlsx.load(arrayBuffer);
    const workSheet = workBook.getWorksheet(1);
    workSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowValues = row.values.slice(1);
      if (rowNumber === 2) {
        headers.push(...rowValues)
      } else {
        const rowData = {};
        headers.map((value, index) => {
          rowData[headers[index]] = rowValues[index] === undefined || 
          rowValues[index] === null || 
          (typeof rowValues[index] === 'string' && rowValues[index].trim() === '')
          ? UNDEFINED_VALUES 
          : rowValues[index];
        })
        jsonData.push(rowData);
      }
    })
  }

  const importToFireStore = async () => {
    
    const lines = []

    await Promise.all(
      jsonData.map( async value => {
        try {
          const student_id = value["STUDENT ID"];
          const docRef = doc(db, "UserTest", student_id);
          const docSnap = await getDoc(docRef);
          if (!student_id) {
            const missing_students = `name: ${value["LASTNAME"]}, ${value["FIRSTNAME"]} ${value["MIDDLENAME"]}., year_section: ${["SECTION"]}, password_hash: "123456", role: "student", created_at: ${new Date()}, status: "active" \n`;
            lines.push(missing_students);
          } else if (!docSnap.exists()) {
            setDoc(doc(db, "UserTest", student_id), {
              name: `${value["LASTNAME"]}, ${value["FIRSTNAME"]} ${value["MIDDLENAME"]}.`,
              year_section: value["SECTION"],
              password_hash: "123456",
              role: "student",
              created_at: new Date(),
              status: "active",
              qr_token: "",
              email: "",
            })
          }
        } catch (err) {
          console.error("Failed to import", value, err)
        }}
      )
    )

    if (lines.length > 0) {
      const blob = new Blob(lines, {type: 'text/plain'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "missing_students.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={importToFireStore} >Click</button>
    </div>
  )

}

export default Import