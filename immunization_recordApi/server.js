const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================================
// MYSQL CONNECTION
// ================================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "manager",
  database: "Projectdb",
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
    return;
  }

  console.log("MySQL Connected");
});

// ================================
// GET ALL RECORDS
// ================================
app.get("/immunizations", (req, res) => {
  const sql = "SELECT * FROM immunization_record";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
});

// ================================
// GET RECORD BY ID
// ================================
app.get("/immunizations/:id", (req, res) => {
  const sql =
    "SELECT * FROM immunization_record WHERE record_id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Record Not Found",
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
  });
});

// ================================
// GET RECORDS BY CHILD ID
// ================================
app.get("/child/:childId", (req, res) => {
  const sql =
    "SELECT * FROM immunization_record WHERE child_id = ?";

  db.query(sql, [req.params.childId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
});

// ================================
// ADD RECORD
// ================================
app.post("/immunizations", (req, res) => {
  const {
    child_id,
    vaccine_id,
    vaccination_date,
    next_due_date,
    hospital_name,
    doctor_name,
    remarks,
  } = req.body;

  const sql = `
    INSERT INTO immunization_record
    (
      child_id,
      vaccine_id,
      vaccination_date,
      next_due_date,
      hospital_name,
      doctor_name,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      child_id,
      vaccine_id,
      vaccination_date,
      next_due_date,
      hospital_name,
      doctor_name,
      remarks,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
        });
      }

      res.json({
        success: true,
        message: "Record Added Successfully",
        record_id: result.insertId,
      });
    }
  );
});

// ================================
// UPDATE RECORD
// ================================
app.put("/immunizations/:id", (req, res) => {
  const {
    child_id,
    vaccine_id,
    vaccination_date,
    next_due_date,
    hospital_name,
    doctor_name,
    remarks,
  } = req.body;

  const sql = `
    UPDATE immunization_record
    SET
      child_id = ?,
      vaccine_id = ?,
      vaccination_date = ?,
      next_due_date = ?,
      hospital_name = ?,
      doctor_name = ?,
      remarks = ?
    WHERE record_id = ?
  `;

  db.query(
    sql,
    [
      child_id,
      vaccine_id,
      vaccination_date,
      next_due_date,
      hospital_name,
      doctor_name,
      remarks,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
        });
      }

      res.json({
        success: true,
        message: "Record Updated Successfully",
      });
    }
  );
});

// ================================
// DELETE RECORD
// ================================
app.delete("/immunizations/:id", (req, res) => {
  const sql =
    "DELETE FROM immunization_record WHERE record_id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    res.json({
      success: true,
      message: "Record Deleted Successfully",
    });
  });
});

// ================================
// VACCINATION HISTORY WITH JOIN
// ================================
app.get("/history/:childId", (req, res) => {
  const sql = `
    SELECT
      ir.record_id,
      c.child_name,
      v.vaccine_name,
      ir.vaccination_date,
      ir.next_due_date,
      ir.hospital_name,
      ir.doctor_name,
      ir.remarks
    FROM immunization_record ir
    INNER JOIN child c
      ON ir.child_id = c.child_id
    INNER JOIN vaccine v
      ON ir.vaccine_id = v.vaccine_id
    WHERE ir.child_id = ?
  `;

  db.query(sql, [req.params.childId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
});

// ================================
// SERVER START
// ================================
app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});