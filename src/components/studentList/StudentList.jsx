import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Link, useParams } from "react-router-dom";
import "./StudentList.css";

const StudentsList = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get(`/students/group/${id}`).then(res => setStudents(res.data));
  }, [id]);

  const deleteStudent = async (studentId) => {
    // Confirm olib tashlandi
    try {
      await api.delete(`/students/${studentId}`);
      setStudents(students.filter(s => s._id !== studentId));
    } catch (err) {
      console.error(err);
      alert("O‘chirishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="students-list">
      <h2>O‘quvchilar ro‘yxati</h2>

      {students.map(student => (
        <div className="student-item" key={student._id}>
          <Link to={`/student/${student._id}`}>
            {student.name}
          </Link>

          <button
            className="delete-btn"
            onClick={() => deleteStudent(student._id)}
          >
            O‘chirish
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentsList;
