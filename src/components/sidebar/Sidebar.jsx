import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import "./Sidebar.css";

const Sidebar = ({ groups = [], setGroups, isOpen, setIsOpen }) => {
  const [newGroupName, setNewGroupName] = useState("");

  const addGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const res = await api.post("/groups", { name: newGroupName.trim() });
      setGroups([...groups, res.data]);
      setNewGroupName("");
    } catch (err) {
      alert("Guruh qo‘shishda xatolik!");
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>

      <h2>Guruhlar</h2>

      <div className="group-list">

        {groups.length === 0 ? (
          <p className="empty-text">Guruhlar yo'q</p>
        ) : (
          groups.map((group) => (
            <div className="group-item" key={group._id}>
              <Link to={`/group/${group._id}`} onClick={() => setIsOpen(false)}>
                {group.name}
              </Link>
            </div>
          ))
        )}

        <div className="add-group">
          <input
            type="text"
            placeholder="Guruh nomi"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={addGroup}>Qo‘shish</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
