import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import "./Payments.css";

const Payments = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    groupId: "",
    month: "",
    amount: "",
    date: "",
    duration: ""
  });

  // Backenddan maʼlumot olish
  useEffect(() => {
    api.get("/students").then(res => setStudents(res.data));
    api.get("/groups").then(res => setGroups(res.data));
  }, []);

  // Formdagi o‘zgarishlarni boshqarish
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredStudents = students.filter(
    (s) => s.group_id === form.groupId
  );  

  // To‘lovni yuborish
  const submitPayment = async () => {
    try {
      await api.post("/payments", form);

      toast.success("To'lov tasdiqlandi!");

      setForm({
        studentId: "",
        groupId: "",
        month: "",
        amount: "",
        date: "",
        duration: ""
      });
    } catch (err) {
      toast.error("To'lovni tasdiqlashda xatolik!")
    }
  };

  return (
    <div className="payments">
      <h2>To‘lov qilish</h2>

      <div className="payment-form">

        {/* GURUHNI TANLASH */}
        <label>Guruh:</label>
        <select
          name="groupId"
          value={form.groupId}
          onChange={(e) => {
            handleChange(e);
            setForm((f) => ({ ...f, studentId: "" })); // eski o‘quvchini tozalash
          }}
        >
          <option value="">Guruh tanlang</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>

        {/* O‘QUVCHINI TANLASH */}
        <label>O‘quvchi:</label>
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          disabled={!form.groupId}
        >
          <option value="">O‘quvchi tanlang</option>
          {filteredStudents.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        {/* BOSHQA MAYDONLAR */}
        <label>Oy:</label>
        <select name="month" value={form.month} onChange={handleChange}>
          <option value="">Oy tanlang</option>
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

        <label>To‘lov summasi:</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} />

        <label>Sana:</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} />

        <label>Muddat (oy):</label>
        <input type="number" name="duration" value={form.duration} onChange={handleChange} />

        <button onClick={submitPayment} className="confirm-btn">
          Tasdiqlash
        </button>

      </div>
    </div>
  );
};

export default Payments;
