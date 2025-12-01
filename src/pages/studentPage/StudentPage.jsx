import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./StudentPage.css";

const StudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Date formatlash
  const formatDate = (d) => {
    if (!d) return "";
    return d.toString().split("T")[0];
  };

  // 1) Studentni olish
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
        setForm(res.data);
      } catch (err) {
        toast.error("O‘quvchi ma’lumotlarini yuklashda xatolik!");
      }
    };
    fetchStudent();
  }, [id]);

  // 2) To'lovlarni olish
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/payments/student/${id}`);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, [id]);

  // Tahrirlash
  const updateStudent = async () => {
    try {
      // student update
      const res = await api.patch(`/students/${id}`, form);
      setStudent(res.data);
  
      // payment update
      if (payments.length > 0) {
        const p = payments[0];
  
        await api.patch(`/payments/${p._id}`, {
          month: p.month,
          amount: p.amount,
          date: p.date,      // <-- formatDate yo‘q
          duration: p.duration,
        });
      }
  
      toast.success("Yangilandi!");
      setEditMode(false);
  
    } catch (err) {
      toast.error("Yangilashda xatolik!");
    }
  };
  
  // O‘quvchi o‘chirish
  const deleteStudent = async () => {
    try {
      await api.delete(`/students/${id}`);
      toast.success("O'quvchi o'chirildi");
      window.location.href = "/";
    } catch (err) {
      toast.error("O'chirishda xatolik!");
    }
  };

  // Telefon format
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

              <button
                className="delete-btn"
                onClick={() => {
                  setDeleteModal(true);
                  setMenuOpen(false);
                }}
              >
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
            <p><b>O‘quvchi telefoni:</b> {formatPhone(student.phone)}</p>
            <p><b>Otasi:</b> {student.fatherName || "-"}</p>
            <p><b>Otasining telefoni:</b> {formatPhone(student.fatherPhone)}</p>
            <p><b>Onasi:</b> {student.motherName || "-"}</p>
            <p><b>Onasining telefoni:</b> {formatPhone(student.motherPhone)}</p>
          </>
        )}
      </div>

      {/* PAYMENT EDIT */}
      {editMode && payments.length > 0 && (
        <div className="edit-payment-box">
          <h3>Oxirgi to‘lovni tahrirlash:</h3>

          <label>Oy:</label>
          <select
            value={payments[0].month}
            onChange={(e) =>
              setPayments([{ ...payments[0], month: e.target.value }])
            }
          >
            <option value="Yanvar">Yanvar</option>
            <option value="Fevral">Fevral</option>
            <option value="Mart">Mart</option>
            <option value="Aprel">Aprel</option>
            <option value="May">May</option>
            <option value="Iyun">Iyun</option>
            <option value="Iyul">Iyul</option>
            <option value="Avgust">Avgust</option>
            <option value="Sentabr">Sentabr</option>
            <option value="Oktabr">Oktabr</option>
            <option value="Noyabr">Noyabr</option>
            <option value="Dekabr">Dekabr</option>
          </select>

          <label>Summa:</label>
          <input
            type="number"
            value={payments[0].amount}
            onChange={(e) =>
              setPayments([
                { ...payments[0], amount: Number(e.target.value) },
              ])
            }
          />

          <label>Sana:</label>
          <input
            type="date"
            value={formatDate(payments[0].date)}
            onChange={(e) =>
              setPayments([{ ...payments[0], date: e.target.value }])
            }
          />

          <label>Muddat (oy):</label>
          <input
            type="number"
            value={payments[0].duration}
            onChange={(e) =>
              setPayments([
                { ...payments[0], duration: Number(e.target.value) },
              ])
            }
          />
        </div>
      )}

      {/* PAYMENT LIST */}
      {!editMode && (
        <>
          <h3 className="payment-title">To‘lovlar tarixi:</h3>
          <div className="payments-list">
            {payments.length === 0 ? (
              <p className="no-payments">To‘lovlar mavjud emas</p>
            ) : (
              payments.map((p, i) => (
                <div className="payment-item" key={i}>
                  <p><b>Oy:</b> {p.month}</p>
                  <p><b>Summa:</b> {p.amount}</p>
                  <p><b>Sana:</b> {formatDate(p.date)}</p>
                  <p><b>Muddat:</b> {p.duration} oy</p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* NOTES */}
      <h3 className="comment-title">O‘quvchi haqida izoh:</h3>
      {editMode ? (
        <textarea
          className="comment-edit"
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      ) : (
        <div className="comment-box">
          {student.notes || "Izoh mavjud emas"}
        </div>
      )}

      {/* SAVE BUTTON */}
      {editMode && (
        <button className="save-btn" onClick={updateStudent}>
          Saqlash
        </button>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Rostdan ham o'quvchini o'chirmoqchimisiz?</h3>

            <div className="modal-buttons">
              <button className="yes" onClick={deleteStudent}>Ha</button>
              <button className="no" onClick={() => setDeleteModal(false)}>
                Yo‘q
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BACK */}
      <button
        className="back-btn"
        onClick={() => {
          if (window.history.length > 2) navigate(-1);
          else navigate("/");
        }}
      >
        Orqaga qaytish ←
      </button>
    </div>
  );
};

export default StudentPage;
