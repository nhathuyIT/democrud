import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    padding: "6px 10px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
    background: isActive ? "#eef" : "transparent",
  });

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          justifyContent: "center",
        }}
      >
        <NavLink to="/home" style={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/se180003/all-lessons" style={linkStyle}>
          All Lessons
        </NavLink>
        <NavLink to="/se180003/completed-lessons" style={linkStyle}>
          Completed Lessons
        </NavLink>
        <NavLink to="/se180003/add-lesson" style={linkStyle}>
          Add Lesson
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;
