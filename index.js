const express = require('express');
const app = express();

app.use(express.json());
app.use('/offers', require('./routes/offers'));
app.use('/reco', require('./routes/reco'));
app.use('/login', require('./routes/auth'));

app.listen(3000, () => console.log('API up on http://localhost:3000'));
