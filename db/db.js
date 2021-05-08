/* eslint-disable camelcase */
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config);

pool.connect();

const getReviews = async (request, response) => {
  const { product_id, page, count } = request.query;
  const data = {
    product: product_id,
    page: page || 0,
    count: count || 5,
    results: [],
  };
  try {
    const { rows } = await pool.query(
      `SELECT
          id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
          COALESCE((SELECT array_to_json(array_agg(row_to_json(p))) FROM
              (SELECT id, url FROM reviews_photos WHERE review_id = E.id)p
          ), '[]'::json) as photos
          FROM reviews E WHERE product_id=${product_id} AND reported=false;`,
    );
    data.results = rows;
    response.status(200).send(data);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

const getReviewsMeta = async (request, response) => {
  const { product_id } = request.query;
  try {
    const { rows } = await pool.query(
      `WITH rev_table AS (
      SELECT ID, rating, recommend
      FROM reviews
      WHERE product_id = ${product_id}
      ), rate_table AS (
      SELECT json_object_agg(rating, counts ORDER BY rating) AS json
      FROM (SELECT rating, counts FROM
        (SELECT rating, COUNT(rating) AS counts
        FROM rev_table
        GROUP BY rating)w
        WHERE rating IS NOT NULL
        )q
      ), rec_table AS (
      SELECT json_object_agg(recommend, counts ORDER BY recommend) AS json
      FROM (SELECT recommend, COUNT(recommend) AS counts
        FROM rev_table
        GROUP BY recommend)p
      ), char_table AS (
      SELECT json_object_agg(name, json_build_object('id', id, 'value',value)) AS json
      FROM (SELECT characteristics.id AS id, characteristics.name AS name,
          AVG(characteristic_review.value) AS value
        FROM characteristics LEFT JOIN characteristic_review
        ON characteristics.id = characteristic_review.characteristic_id
      WHERE characteristics.product_id = ${product_id}
      GROUP BY characteristics.id, characteristics.name)t
      )
      SELECT ${product_id} AS product_id, rate_table.json AS ratings, rec_table.json AS recommended,
        char_table.json AS characteristics
      FROM rate_table, rec_table, char_table;
    `,
    );
    response.status(200).send(rows[0]);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

const postReview = async (request, response) => {
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics,
  } = request.body;
  const photo_query_string = (photos.length > 0
    ? `, url_list AS (
      SELECT main_insert.review_id as review_id, json_array_elements('${JSON.stringify(photos)}')
        as url FROM main_insert
    ), photo_insert AS(
      INSERT INTO reviews_photos (review_id, url)
      SELECT review_id, url FROM url_list
    )`
    : '');

  try {
    const { rows } = await pool.query(
      `WITH main_insert AS (
        INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email )
        VALUES (${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}')
        RETURNING id AS review_id
      )${photo_query_string}, characteristics_table AS (
        SELECT key::int AS char_id, value::int as char_value  from json_each_text('${JSON.stringify(characteristics)}')
      )
      INSERT INTO characteristic_review (characteristic_id, review_id, value)
      SELECT characteristics_table.char_id, main_insert.review_id, characteristics_table.char_value
      FROM characteristics_table, main_insert;`,
    );
    response.status(201).send(rows);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

const reportReview = async (request, response) => {
  const { review_id } = request.params;
  try {
    const report = await pool.query(
      `UPDATE reviews
      SET reported = true
      WHERE id=${review_id};
      `,
    );
    response.status(204).send(report);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

const markReviewHelpful = async (request, response) => {
  const { review_id } = request.params;
  try {
    const helpful = await pool.query(
      `UPDATE reviews
      SET helpfulness = (helpfulness+1)
      WHERE id=${review_id};
      `,
    );
    response.status(204).send(helpful);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

module.exports = {
  getReviews, reportReview, markReviewHelpful, getReviewsMeta, postReview,
};
