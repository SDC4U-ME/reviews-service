import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
  discardResponseBodies: true,
  scenarios: {
    constant_vus: {
      executor: 'constant-vus',
      vus: 2,
      duration: '1m',
    },
  },
};

const BASE_URL = 'http://localhost:3000/reviews/';

export default () => {
  let currProd_id = Math.floor(Math.random() * 5000000);

  http.get(`${BASE_URL}?product_id=${currProd_id}`);
  http.get(`${BASE_URL}meta/?product_id=${currProd_id}`);
}