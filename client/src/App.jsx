import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  async function requestApi(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();

    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("API khong tra ve JSON hop le.");
      }
    }

    if (!response.ok) {
      throw new Error(data.message || "Yeu cau that bai");
    }

    return data;
  }

  async function loadStudents() {
    try {
      const data = await requestApi("/api/students");
      setStudents(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage("Loi tai danh sach: " + error.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function resetForm() {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const student = { studentId, name, email };

      if (editingId) {
        await requestApi(`/api/students/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        });
        setMessage("Cap nhat sinh vien thanh cong!");
      } else {
        await requestApi("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        });
        setMessage("Them sinh vien thanh cong!");
      }

      resetForm();
      await loadStudents();
    } catch (error) {
      setMessage("Loi: " + error.message);
    }
  }

  function editStudent(student) {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Ban co chac muon xoa sinh vien nay?")) {
      return;
    }

    try {
      await requestApi(`/api/students/${id}`, {
        method: "DELETE",
      });
      setMessage("Xoa sinh vien thanh cong!");
      await loadStudents();
    } catch (error) {
      setMessage("Loi xoa: " + error.message);
    }
  }

  return (
    <main style={{
      maxWidth: "1000px",
      margin: "30px auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>
      <h1>Quan ly sinh vien</h1>

      <h2>{editingId ? "Cap nhat sinh vien" : "Them sinh vien"}</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <label>Ma sinh vien: </label>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </p>

        <p>
          <label>Ho ten: </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </p>

        <p>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </p>

        <button type="submit">
          {editingId ? "Luu cap nhat" : "Them sinh vien"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Huy sua
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <h2>Danh sach sinh vien</h2>
      <button onClick={loadStudents}>Tai lai danh sach</button>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "15px",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>Ma SV</th>
            <th>Ho ten</th>
            <th>Email</th>
            <th>Thao tac</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => editStudent(student)}>
                  Sua
                </button>{" "}
                <button onClick={() => deleteStudent(student._id)}>
                  Xoa
                </button>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td colSpan="4">Chua co sinh vien nao.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

export default App;