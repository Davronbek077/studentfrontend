import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import "./Sidebar.css";

const Sidebar = ({ groups = [], setGroups, isOpen, setIsOpen }) => {
  const [newGroupName, setNewGroupName] = useState("");

  const deleteGroup = async (groupId) => {
    // Confirm olib tashlash yoki qoldirish mumkin
    // if (!confirm("Guruhni o‘chirmoqchimisiz?")) return;
    try {
      await api.delete(`/groups/${groupId}`);
      setGroups(groups.filter(g => g._id !== groupId));
    } catch (err) {
      console.error(err);
      alert("Guruhni o‘chirishda xatolik yuz berdi!");
    }
  };

  const addGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const res = await api.post("/groups", { name: newGroupName.trim() });
      setGroups([...groups, res.data]); // yangi guruhni ro‘yxatga qo‘shish
      setNewGroupName(""); // inputni tozalash
    } catch (err) {
      console.error(err);
      alert("Guruh qo‘shishda xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    api.get("/groups").then(res => {
      setGroups(res.data);
    });
  }, [setGroups]);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>

      <h2>Guruhlar</h2>

      <div className="group-list">
        {groups.length === 0 && <p>Guruhlar yo‘q</p>}

        {groups.map(group => (
          <div className="group-item" key={group._id}>
            <Link
              to={`/group/${group._id}`}
              onClick={() => setIsOpen(false)}
            >
              {group.name}
            </Link>

            <button
              className="delete-btn"
              onClick={() => deleteGroup(group._id)}
            >
              X
            </button>
          </div>
        ))}

        {/* --- Yangi guruh qo‘shish --- */}
        <div className="add-group">
          <input
            type="text"
            placeholder="Guruh nomi"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={addGroup}>Qo'shish</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
