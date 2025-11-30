import React from "react";
import AddStudentForm from "../components/addStudentForm/AddStudentForm";

const Home = ({ groups }) => {
  console.log("Homega kelgan groups:", groups); // <-- diagnostika
  return (
    <div>
      <AddStudentForm groups={groups} />
    </div>
  );
};

export default Home;
