const express = require('express');
const app = express();

app.use(express.json());
app.use('/offers', require('./routes/offers'));

app.listen(3000, () => console.log('API up on http://localhost:3000'));
