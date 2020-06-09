const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();
app.set('PORT', process.env.PORT);

app.use(cors());
// Routes
app.use('/', routes);
// Errors
app.use(require('./middlewares/errors'));


app.listen(app.get('PORT'), () =>
  console.log(`Server running at port ${app.get('PORT')}`)
);
