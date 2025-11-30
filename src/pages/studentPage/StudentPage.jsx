import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./StudentPage.css";

const StudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 1️⃣ Student ma’lumotini yuklash
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`); // backend /students/:id
        setStudent(res.data);
        setForm(res.data);
      } catch (err) {
        toast.error("O‘quvchi ma’lumotlarini yuklashda xatolik!");
        console.error(err);
      }
    };
    fetchStudent();
  }, [id]);

  // 2️⃣ Tashqariga bosilganda menyuni yopish
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // 3️⃣ Student ma’lumotini yangilash
  const updateStudent = async () => {
    try {
      console.log("PATCH URL:", `/students/${id}`);
      console.log("PATCH DATA:", form);
  
      const res = await api.patch(`/students/${id}`, form);
  
      console.log("PATCH RESPONSE:", res.data);
  
      setStudent(res.data);
      setEditMode(false);
      toast.success("Maʼlumotlar yangilandi!");
    } catch (err) {
      console.error("PATCH ERROR:", err);
      toast.error("Xatolik yuz berdi!");
    }
  };

  const deleteStudent = async () => {
    try{
      await api.delete(`/students/${id}`);
      toast.success("O'quvchi o'chirildi");
      setDeleteModal(false);

      window.location.href = "/";
    } catch (err) {
      toast.error("O'chirishda xatolik!");
      console.error(err);
    }
  };


  // 4️⃣ Telefon formatlash funksiyasi
  const formatPhone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    if (value.startsWith("998")) value = value.slice(3);
    value = value.slice(0, 9);
    let f = "+998 ";
    if (value.length >= 2) f += `(${value.slice(0, 2)})`;
    else if (value.length > 0) f += `(${value}`;
    if (value.length >= 5) f += ` ${value.slice(2, 5)}`;
    else if (value.length > 2) f += ` ${value.slice(2)}`;
    if (value.length >= 7) f += `-${value.slice(5, 7)}`;
    else if (value.length > 5) f += `-${value.slice(5)}`;
    if (value.length === 9) f += `-${value.slice(7, 9)}`;
    return f;
  };

  if (!student) return <p className="loading">Yuklanmoqda...</p>;

  return (
    <div className="student-container">
      {/* HEADER */}
      <div className="header-line">
        <h1>{student.name}</h1>

        {/* MENU */}
        <div className="dots-menu" ref={menuRef}>
          <span
            className="dots"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            ⋮
          </span>
          {menuOpen && (
            <div className="menu-box">
              <button
                onClick={() => {
                  setEditMode(true);
                  setMenuOpen(false);
                }}
              >
                Tahrirlash
              </button>

              <button onClick={() => {
                setDeleteModal(true);
                setMenuOpen(false);
              }}
              className="delete-btn">
                O'chirish
              </button>
            </div>
          )}
        </div>
      </div>

      {/* INFORMATION */}
      <div className={`info-box ${editMode ? "edit-mode" : ""}`}>
        {editMode ? (
          <>
            <label>O‘quvchi ismi:</label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label>O‘quvchi telefoni:</label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <label>Otasining ismi:</label>
            <input
              type="text"
              value={form.fatherName || ""}
              onChange={(e) =>
                setForm({ ...form, fatherName: e.target.value })
              }
            />

            <label>Otasining telefoni:</label>
            <input
              type="text"
              value={form.fatherPhone || ""}
              onChange={(e) =>
                setForm({ ...form, fatherPhone: e.target.value })
              }
            />

            <label>Onasining ismi:</label>
            <input
              type="text"
              value={form.motherName || ""}
              onChange={(e) =>
                setForm({ ...form, motherName: e.target.value })
              }
            />

            <label>Onasining telefoni:</label>
            <input
              type="text"
              value={form.motherPhone || ""}
              onChange={(e) =>
                setForm({ ...form, motherPhone: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <p>
              <b>O‘quvchi telefoni:</b> {formatPhone(student.phone) || "-"}
            </p>
            <p>
              <b>Otasi:</b> {student.fatherName || "-"}
            </p>
            <p>
              <b>Otasining telefoni:</b> {formatPhone(student.fatherPhone) || "-"}
            </p>
            <p>
              <b>Onasi:</b> {student.motherName || "-"}
            </p>
            <p>
              <b>Onasining telefoni:</b> {formatPhone(student.motherPhone) || "-"}
            </p>
          </>
        )}
      </div>

      {/* NOTES */}
      <h3 className="comment-title">O‘quvchi haqida izoh:</h3>
      {editMode ? (
        <textarea
          className="comment-edit"
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      ) : (
        <div className="comment-box">{student.notes || "Izoh mavjud emas"}</div>
      )}

      {/* SAVE BUTTON */}
      {editMode && (
        <button className="save-btn" onClick={updateStudent}>
          Saqlash
        </button>
      )}

      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Rostdan ham o'quvchini o'chirmoqchimisiz?</h3>

            <div className="modal-buttons">
              <button className="yes" onClick={deleteStudent}> Ha</button>
              <button className="no" onClick={() => setDeleteModal(false)}>Yo'q</button>
            </div>
          </div>
        </div>
      )}

        <button className="back-btn" onClick={() => {
          if (window.history.length > 2) navigate(-1);
          else navigate("/");
        }}>
          Orqaga qaytish  ←
        </button>
    </div>
  );
};

export default StudentPage;
