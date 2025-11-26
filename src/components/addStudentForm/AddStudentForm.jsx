import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import "./AddStudentForm.css";

const Add = () => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");

  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("Qilinmagan");
  const [notes, setNotes] = useState("");

  // 🔥 Backenddan guruhlarni olish
  useEffect(() => {
    api.get("/groups").then((res) => {
      setGroups(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupId) {
      alert("Iltimos, guruhni tanlang!");
      return;
    }

    await api.post("/students", {
      name,
      phone,
      group_id: groupId,
      fatherName,
      fatherPhone,
      motherName,
      motherPhone,
      paymentStatus,
      notes,
    });

    alert("O‘quvchi qo‘shildi!");
  };

  return (
    <div className="add-container">
      <h2>O‘quvchi qo‘shish</h2>

      <form onSubmit={handleSubmit} className="add-form">
        <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="">Guruh tanlang</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>

        <input placeholder="O'quvchi ismi" onChange={(e) => setName(e.target.value)} />
        <input placeholder="O'quvchi telefoni" onChange={(e) => setPhone(e.target.value)} />

        <input placeholder="Otasining ismi" onChange={(e) => setFatherName(e.target.value)} />
        <input placeholder="Otasining telefoni" onChange={(e) => setFatherPhone(e.target.value)} />

        <input placeholder="Onasining ismi" onChange={(e) => setMotherName(e.target.value)} />
        <input placeholder="Onasining telefoni" onChange={(e) => setMotherPhone(e.target.value)} />

        <label>To‘lov holati:</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          <option value="Qilinmagan">Qilinmagan</option>
          <option value="Qilingan">Qilingan</option>
        </select>

        <textarea placeholder="Izoh" onChange={(e) => setNotes(e.target.value)} />

        <button type="submit">Qo‘shish</button>
      </form>
    </div>
  );
};

export default Add;
