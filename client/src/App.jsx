
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function loadStudents() {
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Khong tai duoc danh sach");
      setStudents(await response.json());
    } catch (error) {
      setMessage("Loi: " + error.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, name, email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Khong them duoc");
      }

      setMessage("Them sinh vien thanh cong!");
      setStudentId("");
      setName("");
      setEmail("");
      await loadStudents();
    } catch (error) {
      setMessage("Loi: " + error.message);
    }
  }

  return (
    <main className="container">
      <h1>Quan ly sinh vien</h1>
      <h2>Danh sach sinh vien</h2>
      <button onClick={loadStudents}>Tai lai danh sach</button>

      <table>
        <thead>
          <tr>
            <th>Ma SV</th>
            <th>Ho ten</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Them sinh vien</h2>
      <form onSubmit={handleSubmit}>
        <label>Ma sinh vien</label>
        <input
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <label>Ho ten</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Them sinh vien</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}

export default App;
