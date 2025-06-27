import { useRef, useState } from "react"
import { db } from "../../config/firebase-config"
import { doc, getDoc, setDoc } from "firebase/firestore"
import ExcelJS from "exceljs"

const UNDEFINED_VALUES = "NYS";

function Import() {

  const jsonData = useRef([]);

  // Opens the uploaded excel file

  const handleFileUpload = async (e) => {

    // reads excel

    const file = e.target.files[0];
    const workBook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workBook.xlsx.load(arrayBuffer);
    const workSheet = workBook.getWorksheet(1);

    jsonData.current = [];
    let tempHeader = null;

    // iterates in each row of the excel

    workSheet.eachRow((row) => {
      const rowValues = row.values.slice(1);

      // check if header is a title or information header

      if (!tempHeader) {
        const hasDuplicate = new Set(rowValues).size !== rowValues.length;
        if (hasDuplicate) {
          return;
        }
        tempHeader = rowValues;
        return;
      }

      // puts the information in a json
      // { header: info from header }
      // example:
      // { name: VERUNQUE, RHEY CHRISTIAN }

      const rowData = {};
      tempHeader.forEach((key, index) => {
        rowData[key] = rowValues[index] === undefined || 
        rowValues[index] === null || 
        (typeof rowValues[index] === 'string' && rowValues[index].trim() === '')
        ? UNDEFINED_VALUES 
        : rowValues[index];
      })
      jsonData.current.push(rowData);

    })

  }

  const importToFireStore = async () => {
    
    const lines = []

    // iterates in the json data from the excel 

    await Promise.all(
      jsonData.current.map( async value => {
        try {
          const student_id = value["STUDENT ID"];
          const docRef = doc(db, "UserTest", student_id);
          const docSnap = await getDoc(docRef);

          // log if the student number of student is missing
          // else push it to fire base

          if (!student_id) {
            const missing_students = `name: ${value["LASTNAME"]}, ${value["FIRSTNAME"]} ${value["MIDDLENAME"]}., year_section: ${value["SECTION"]}, password_hash: "123456", role: "student", created_at: ${new Date()}, status: "active" \n`;
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

    // downloadable log of students with missing student id

    if (lines.length > 0) {
      const blob = new Blob(lines, {type: 'text/plain'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "missing_student_id.txt";
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