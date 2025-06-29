import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config"
import { getDocs, collection} from "firebase/firestore"
import AddUserInfo from "./AddUserInfo";
import QueryUserInfo from "./QueryUserInfo";
import RowInfo from "./RowInfo";

function DisplayUserInfo() {

  const [userInfos, setUserInfos] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [prevPage, setPrevPage] = useState(0);
  let nextPage = prevPage + 10;

  const fetchInformation = async () => {
    const docSnap = await getDocs(collection(db, "UserTest"));
    const userList = docSnap.docs.map(user => {
      const data = user.data();
      const created_at = data.created_at?.toDate();
      return {
        id: user.id,
        ...data,
        created_at: data.created_at? created_at.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) : 'None',
      }}
    );
    setUserInfos(userList);
  }

  useEffect(() => {
    fetchInformation();
  }, [])

  return(
    <>
      <div>
         <QueryUserInfo users={userInfos} queryResult={setQueryList} />
      </div>
      <div>
        <table border="1" cellPadding="10" cellSpacing="0" >
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Name</th>
              <th>Section</th>
              <th>Email</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {queryList.slice(prevPage, nextPage).map(user => (
              <RowInfo 
              key={user.id} 
              user={user} 
              refresh={fetchInformation}
              editingRowId={editingRowId}
              setEditingRowId={setEditingRowId}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {prevPage > 0 && (<button onClick={() => {
          setPrevPage((prevPageValue) => prevPageValue - 10);
          setEditingRowId(null);
        }} >prev</button>)}
        <p>{nextPage / 10}</p>
        {nextPage < queryList.length && (<button onClick={() => {
          setPrevPage((prevPageValue) => prevPageValue + 10)
          setEditingRowId(null);
        }} >next</button>)}
      </div>
    </>
  )

}

export default DisplayUserInfo