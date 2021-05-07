const express = require('express');
const getReviews = require('./db/queries');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/reviews', getReviews);

app.get('/reviews/meta', (req, res) => {
  console.log('server test');
});

app.post('/reviews', (req, res) => {
  console.log('server test');
});

app.put('/reviews/:review_id/helpful', (req, res) => {

});

app.put('/reviews/:review_id/helpful', (req, res) => {

});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
