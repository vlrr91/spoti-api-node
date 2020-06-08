const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');

const app = express();
app.set('PORT', process.env.PORT);

app.use(cors());
app.use('/', routes);

app.listen(app.get('PORT'), () =>
  console.log(`Server running at port ${app.get('PORT')}`)
);
