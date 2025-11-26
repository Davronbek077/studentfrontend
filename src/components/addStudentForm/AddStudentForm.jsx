import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import "./AddStudentForm.css";
import { toast } from "react-toastify";

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

  // 🔥 Guruhlarni backenddan olish
  useEffect(() => {
    api.get("/groups").then((res) => {
      setGroups(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupId) {
      toast.error("Iltimos, guruh tanlang!");
      return;
    }

    try {
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

      toast.success("O‘quvchi muvaffaqiyatli qo‘shildi!");

      // Formani tozalash
      setName("");
      setPhone("");
      setFatherName("");
      setFatherPhone("");
      setMotherName("");
      setMotherPhone("");
      setNotes("");
      setGroupId("");
      setPaymentStatus("Qilinmagan");

    } catch (err) {
      toast.error("Xatolik! O‘quvchi qo‘shilmadi.");
    }
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

        <input value={name} placeholder="O'quvchi ismi" onChange={(e) => setName(e.target.value)} />
        <input value={phone} placeholder="O'quvchi telefoni" onChange={(e) => setPhone(e.target.value)} />

        <input value={fatherName} placeholder="Otasining ismi" onChange={(e) => setFatherName(e.target.value)} />
        <input value={fatherPhone} placeholder="Otasining telefoni" onChange={(e) => setFatherPhone(e.target.value)} />

        <input value={motherName} placeholder="Onasining ismi" onChange={(e) => setMotherName(e.target.value)} />
        <input value={motherPhone} placeholder="Onasining telefoni" onChange={(e) => setMotherPhone(e.target.value)} />

        <label>To‘lov holati:</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          <option value="Qilinmagan">Qilinmagan</option>
          <option value="Qilingan">Qilingan</option>
        </select>

        <textarea value={notes} placeholder="Izoh" onChange={(e) => setNotes(e.target.value)} />

        <button type="submit">Qo‘shish</button>
      </form>
    </div>
  );
};

export default Add;
