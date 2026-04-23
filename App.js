import { useEffect, useState } from "react";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("admin");

  const [dark, setDark] = useState(false);

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    age: "",
    className: "",
    gender: "Male",
    attendance: "Present",
  });

  const [editMode, setEditMode] = useState(false);

  /* LOAD */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("students"));
    if (data) setStudents(data);
  }, []);

  /* SAVE */
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  /* LOGIN */
  const login = (r) => {
    setRole(r);
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  /* ADD / EDIT */
  const saveStudent = () => {
    if (!form.name || !form.age) return;

    if (editMode) {
      setStudents(students.map((s) => (s.id === form.id ? form : s)));
      setEditMode(false);
    } else {
      setStudents([...students, { ...form, id: Date.now() }]);
    }

    setForm({
      id: null,
      name: "",
      age: "",
      className: "",
      gender: "Male",
      attendance: "Present",
    });
  };

  const editStudent = (s) => {
    setForm(s);
    setEditMode(true);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const toggleAttendance = (id) => {
    setStudents(
      students.map((s) =>
        s.id === id
          ? {
              ...s,
              attendance:
                s.attendance === "Present" ? "Absent" : "Present",
            }
          : s
      )
    );
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const present = students.filter(
    (s) => s.attendance === "Present"
  ).length;

  const absent = students.length - present;

  /* LOGIN SCREEN */
  if (!loggedIn) {
    return (
      <div className="login">
        <h2>🎓 SaaS School System</h2>
        <button onClick={() => login("admin")}>Login Admin</button>
        <button onClick={() => login("teacher")}>Login Teacher</button>
      </div>
    );
  }

  /* DASHBOARD */
  return (
    <div className={dark ? "app dark" : "app"}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>School SaaS</h2>

        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button onClick={logout}>Logout</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h3>Dashboard ({role})</h3>
        </div>

        {/* STATS */}
        <div className="cards">
          <div>Total Students: {students.length}</div>
          <div>Present: {present}</div>
          <div>Absent: {absent}</div>
        </div>

        {/* FORM */}
        <div className="card">
          <h3>{editMode ? "Edit Student" : "Add Student"}</h3>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Age"
            value={form.age}
            onChange={(e) =>
              setForm({ ...form, age: e.target.value })
            }
          />

          <input
            placeholder="Class"
            value={form.className}
            onChange={(e) =>
              setForm({ ...form, className: e.target.value })
            }
          />

          <select
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <button onClick={saveStudent}>
            {editMode ? "Update" : "Save"}
          </button>
        </div>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.age}</td>
                  <td>{s.className}</td>
                  <td>{s.gender}</td>
                  <td>
                    <button onClick={() => toggleAttendance(s.id)}>
                      {s.attendance}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => editStudent(s)}>✏️</button>
                    <button onClick={() => deleteStudent(s.id)}>
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}