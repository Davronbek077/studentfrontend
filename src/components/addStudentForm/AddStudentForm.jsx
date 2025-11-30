import React, { useState } from "react";
import "./AddStudentForm.css";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const Add = ({ groups = [] }) => {
  const [groupId, setGroupId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");

  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("Qilinmagan");
  const [notes, setNotes] = useState("");

  const formatPhone = (value, prev) => {
    // Agar o'chirish bo'layotgan bo'lsa (backspace)
    if (value.length < prev.length) {
      return value; // formatlamay qaytaramiz
    }
  
    // Faqat raqamlarni qoldiramiz
    value = value.replace(/[^\d]/g, "");
  
    // 998 bilan boshlansa olib tashlaymiz
    if (value.startsWith("998")) value = value.slice(3);
  
    // Maksimum 9 ta raqam
    value = value.slice(0, 9);
  
    let res = "+998";
  
    if (value.length >= 1) res += " (" + value.slice(0, 2);
    if (value.length >= 2) res += ")";
    if (value.length >= 3) res += " " + value.slice(2, 5);
    if (value.length >= 5) res += "-" + value.slice(5, 7);
    if (value.length >= 7) res += "-" + value.slice(7, 9);
  
    return res;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupId) return toast.error("Guruh tanlang!");

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

      toast.success("O‘quvchi qo‘shildi!");

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
      toast.error("Xatolik!");
    }
  };

  return (
    <div className="add-container">
      <h2>O‘quvchi qo‘shish</h2>

      <form onSubmit={handleSubmit} className="add-form">

        {/* Guruh tanlash */}
        <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="">Guruh tanlang</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* O‘quvchi ismi */}
        <div className={`input-wrapper ${name ? "filled" : ""}`}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>O‘quvchi ismi</label>
        </div>

        {/* O‘quvchi telefoni */}
        <div className={`input-wrapper ${phone ? "filled" : ""}`}>
        <input type="text" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value, phone))}
         onFocus={() => !phone && setPhone("+998 ")}/>
          <label>O‘quvchi telefoni</label>
        </div>

        {/* Otasining ismi */}
        <div className={`input-wrapper ${fatherName ? "filled" : ""}`}>
          <input
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
          <label>Otasining ismi</label>
        </div>

        {/* Otasining telefoni */}
        <div className={`input-wrapper ${fatherPhone ? "filled" : ""}`}>
        <input type="text" value={fatherPhone} onChange={(e) => setFatherPhone(formatPhone(e.target.value, fatherPhone))}
          onFocus={() => !fatherPhone && setFatherPhone("+998 ")}/>
          <label>Otasining telefoni</label>
        </div>

        <div className={`input-wrapper ${motherName ? "filled" : ""}`}>
        <input
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
          />
          <label>Onasining ismi</label>
        </div>

        <div className={`input-wrapper ${motherPhone ? "filled" : ""}`}>
        <input type="text" value={motherPhone} onChange={(e) => setMotherPhone(formatPhone(e.target.value, motherPhone))}
          onFocus={() => !motherPhone && setMotherPhone("+998 ")}/>
          <label>Onasining telefoni</label>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="O‘quvchi haqida izoh (ixtiyoriy)"
        />

        <button>Qo‘shish</button>
      </form>
    </div>
  );
};

export default Add;
