const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Student = require("./models/Student");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kiem tra server
app.get("/", (req, res) => {
  res.json({ message: "Backend dang hoat dong!" });
});

// Câu 36, 47: Lay danh sach sinh vien
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Câu 37, 49: Them sinh vien
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui long nhap day du ma sinh vien, ho ten va email",
      });
    }

    const existingStudent = await Student.findOne({ studentId });

    if (existingStudent) {
      return res.status(400).json({
        message: "Ma sinh vien da ton tai",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
    });

    res.status(201).json({
      message: "Them sinh vien thanh cong",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Câu 38: Cap nhat sinh vien
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Khong tim thay sinh vien",
      });
    }

    res.json({
      message: "Cap nhat sinh vien thanh cong",
      student,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Câu 39: Xoa sinh vien
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Khong tim thay sinh vien",
      });
    }

    res.json({ message: "Xoa sinh vien thanh cong" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ket noi MongoDB truoc khi mo server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Ket noi MongoDB Atlas thanh cong!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server dang chay tai cong ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Loi ket noi MongoDB:", error.message);
  });
