import React, { useEffect, useState } from "react";
import StudentList from "../../components/studentList/StudentList";
import { api } from "../../api/api";
import { useParams } from "react-router-dom";
import "./GroupPage.css";

const GroupPage = ({setGroups }) => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (id) {
      api
        .get(`/students/group/${id}`)
        .then((res) => setStudents(res.data))
        .catch((err) => console.log(err));
    }
  }, [id]);

  return (
    <div className="group-page">
      {students.length === 0 ? (
        <p className="no-students">Hozircha o‘quvchilar yo‘q</p>
      ) : (
        <div className="student-list-container">
          <StudentList
            students={students}
            setGroups={setGroups}
          />
        </div>
      )}
    </div>
  );
};

export default GroupPage;
