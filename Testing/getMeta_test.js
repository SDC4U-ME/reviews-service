import http from 'k6/http';
import { sleep } from 'k6';

export default function() {
  http.get('http://localhost:3000/reviews/meta?product_id=20100');
  sleep(1);
  http.get('http://localhost:3000/reviews/meta?product_id=20101');
  sleep(1);
  http.get('http://localhost:3000/reviews/meta?product_id=20102');
  sleep(1);
  http.get('http://localhost:3000/reviews/meta?product_id=20103');
  sleep(1);
  http.get('http://localhost:3000/reviews/meta?product_id=20104');
}
