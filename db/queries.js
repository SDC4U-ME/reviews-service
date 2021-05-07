const { Client } = require('pg');
const config = require('../config');

const client = new Client(config);

client.connect();

const getReviews = async (request, response) => {
  const { product_id, page, count } = request.query;
  const data = {
    product: product_id,
    page: page || 0,
    count: count || 5,
    results: [],
  };
  try {
    const { rows } = await client.query(
      `SELECT
          id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
          COALESCE((SELECT array_to_json(array_agg(row_to_json(p))) FROM
              (SELECT id, url FROM reviews_photos WHERE review_id = E.id)p
          ), '[]'::json) as photos
          FROM reviews E WHERE product_id=${product_id} AND reported=false;`,
    );
    data.results = rows;
    await Promise.all(response.status(200).send(data));
  } catch (e) {
    console.log(e);
  }
};

module.exports = getReviews;
