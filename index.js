const express = require('express');
const db = require('./db/db');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/reviews', db.getReviews);

app.get('/reviews/meta', db.getReviewsMeta);

app.post('/reviews', db.postReview);

app.put('/reviews/:review_id/helpful', db.markReviewHelpful);

app.put('/reviews/:review_id/report', db.reportReview);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
