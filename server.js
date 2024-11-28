const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schoolRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.get("/",(req,res)=>{

    return res.send("Hello this is me api of school management")
})

app.use(bodyParser.json());
app.use('/api', schoolRoutes);

// Gracefully close the pool when the app is terminated
process.on('SIGINT', async () => {
    console.log('[INFO]: Closing database pool...');
    await pool.end();
    console.log('[INFO]: Database pool closed.');
    process.exit(0);
  });


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
