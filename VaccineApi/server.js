const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'May@2026',
  database: 'projectdb'
});

app.post("/vaccine",(req,res)=>{

    const {
        vaccine_name,
        recommended_age
    } = req.body;

    if (!vaccine_name || !recommended_age) {
        return res.status(400).json({ error: 'vaccine_name and recommended_age are required' });
    }

connection.query(
        "INSERT INTO vaccine(vaccine_name,recommended_age) VALUES(?,?)",
        [vaccine_name,recommended_age],
        (err,result)=>{

            if(err)
                return res.status(500).json(err);

            res.json({
                message:"Vaccine Added"
            });
        }
    );
});

app.get("/vaccine",(req,res)=>{

    connection.query(
        "SELECT * FROM vaccine",
        (err,result)=>{

            if(err)
                return res.status(500).json(err);

            res.json(result);
        }
    );
});

// JSON parse error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next(err);
});



app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Also available on your network at http://<your-pc-ip>:${port}`);
});
