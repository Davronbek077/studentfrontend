import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import "./Sidebar.css";

const Sidebar = ({ groups = [], setGroups, isOpen, setIsOpen }) => {

  const deleteGroup = async (groupId) => {
    if (!confirm("Guruhni o‘chirmoqchimisiz?")) return;

    await api.delete(`/groups/${groupId}`);

    setGroups(groups.filter(g => g._id !== groupId));
  };

  useEffect(() => {
    api.get("/groups").then(res => {
      console.log("Backenddan kelgan guruhlar:", res.data);
      setGroups(res.data);
    });
  }, []);
  

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
      </div>

    </div>
  );
};

export default Sidebar;
