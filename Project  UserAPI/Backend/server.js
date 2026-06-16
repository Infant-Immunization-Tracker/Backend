const express = require("express");
const cors = require("cors");

const app=express();
app.use(cors());
app.use(express.json());

const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"manager",
    database:"Projectdb",
    port:3306
});

db.connect((err)=>{
    if(err)
        console.log(err);
    else
        console.log("MySQL Connected");
});


app.post("/post",(req,res)=>{

    const {
        full_name,
        email,
        password,
        phone,
        address
    } = req.body;

    const sql=
    `INSERT INTO users
    (full_name,email,password,phone,address)
    VALUES(?,?,?,?,?)`;

    db.query(
        sql,
        [
            full_name,
            email,
            password,
            phone,
            address
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"User Registered Successfully"
            });

        }
    );
});

app.get("/get", (req, res) => {

    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(result);
    });
});

app.delete("/:id", (req, res) => {

    const userId = req.params.id;

    const sql = "DELETE FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.status(200).json({
            message: "User Deleted Successfully"
        });

    });

});



app.listen(3000,()=>{
    console.log("Server Running On Port 3000");
});