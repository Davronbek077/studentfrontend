import React, { useEffect, useState, useRef } from "react";
import { api } from "../../api/api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./StudentList.css";

const StudentsList = ({setGroups}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    api.get(`/students/group/${id}`).then(res => setStudents(res.data));
  }, [id]);

  useEffect(() => {
    api.get(`/students/group/${id}`).then(res => {
      console.log("💡 Students from backend:", res.data);
      setStudents(res.data);
    });
  }, [id]);
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Guruhni o‘chirish
  const deleteGroup = async () => {
    try {
      await api.delete(`/groups/${id}`);
  
      // 🔥 Sidebar dagi ro‘yxatdan olib tashlash
      setGroups(prev => prev.filter(group => group._id !== id));
  
      setShowModal(false);
      navigate("/");
      toast.success("Guruh o‘chirildi!");
    } catch (err) {
      console.error(err);
      toast.error("Guruhni o‘chirishda xatolik!");
    }
  };
  
  

  return (
    <div className="students-list">

      {/* TITLE + MENU */}
      <div className="list-header">
        <h2>O‘quvchilar ro‘yxati</h2>

        <div className="dots-menu" ref={menuRef}>
          <span
            onClick={(e) => {
              e.stopPropagation(); // tashqi clickga tushmasligi uchun
              setMenuOpen(!menuOpen);
            }}
            className="dots"
          >
            ⋮
          </span>

          {menuOpen && (
            <div className="menu-box">
              <button onClick={() => setShowModal(true)}>
                Guruhni o‘chirish
              </button>
            </div>
          )}
        </div>
      </div>

      {students.map((student, index) => (
  <div className="student-item" key={student._id}>
    <Link to={`/student/${student._id}`}>
      {student.name}
    </Link>

    <span className="student-number">{index + 1}</span>
  </div>
))}


      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Rostdan ham guruhni o‘chirmoqchimisiz?</p>

            <div className="modal-buttons">
              <button className="yes" onClick={deleteGroup}>Ha</button>
              <button className="no" onClick={() => setShowModal(false)}>Yo‘q</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
