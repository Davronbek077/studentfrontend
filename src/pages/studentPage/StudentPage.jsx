import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import "./StudentPage.css";

const StudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    api.get(`/students/${id}`).then(res => {
      setStudent(res.data);
      setPaymentStatus(res.data.paymentStatus);
    });
  }, [id]);

  const updatePayment = async () => {
    try {
      await api.patch(`/students/payment/${id}`, { paymentStatus });
      // Serverga yuborilgandan keyin tepada yangilanadi
      setStudent(prev => ({ ...prev, paymentStatus }));
      alert("To‘lov holati o‘zgartirildi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi!");
    }
  };

  if (!student) return <p className="loading">Yuklanmoqda...</p>;

  return (
    <div className="student-container">
      <h1>{student.name}</h1>

      <div className="info-box">
        <p><b>O'quvchi telefoni:</b> {student.phone}</p>
        <p><b>Otasining ismi:</b> {student.fatherName || "-"}</p>
        <p><b>Otasining telefoni:</b> {student.fatherPhone || "-"}</p>
        <p><b>Onasining ismi:</b> {student.motherName || "-"}</p>
        <p><b>Onasining telefoni:</b> {student.motherPhone || "-"}</p>
        <p><b>To‘lov holati:</b> {student.paymentStatus}</p>
      </div>

      <label>To‘lov holati:</label>
      <select
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
      >
        <option value="Qilinmagan">Qilinmagan</option>
        <option value="Qilingan">Qilingan</option>
      </select>

      <button className="save-btn" onClick={updatePayment}>
        Saqlash
      </button>

      <h3 className="comment-title">O‘quvchi haqida izoh:</h3>
      <div className="comment-box">
        {student.notes || "Izoh mavjud emas"}
      </div>
    </div>
  );
};

export default StudentPage;
