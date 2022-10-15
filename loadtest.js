import http from "k6/http";
import { check, fail, sleep } from "k6";

export const options = {
  vus: 3,
  duration: "500s",
};

const port = __ENV.PORT || 4000;
const baseUrl = `http://host.docker.internal:${port}`;
const minSleep = 0.05;
const maxSleep = 0.50;

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEntryId(entries) {
  const randomIndex = getRandomInt(0, entries.length - 1);
  return entries[randomIndex].id;
}

function getRandomString(len) {
  const charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,_.!";
  let randomString = "";

  for (let i = 0; i < len; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }

  return randomString;
}

export default function () {
  let res = http.get(`${baseUrl}/articles`);
  let articles = JSON.parse(res.body);

  if (articles.length == 0) {
    fail("No articles in database");
  }

  // GET /articles/:id
  for (let i = 0; i < 5; i++) {
    sleep(getRandomFloat(minSleep, maxSleep));
    let article = http.get(`${baseUrl}/articles/${getRandomEntryId(articles)}`);
    check(article, {
      "is GET /article request status 200": (r) => r.status === 200,
    });
  }

  // GET /articles/audit/:id
  for (let i = 0; i < 5; i++) {
    sleep(getRandomFloat(minSleep, maxSleep));

    let audit = http.get(
      `${baseUrl}/articles/audit/${getRandomEntryId(articles)}`
    );

    check(audit, {
      "is GET /audit request status 200": (r) => r.status === 200,
    });
  }

  // PATCH /articles/audit/:id
  for (let i = 0; i < 5; i++) {
    sleep(getRandomFloat(minSleep, maxSleep));

    let patchArticle = http.patch(
      `${baseUrl}/articles/${getRandomEntryId(articles)}`,
      JSON.stringify({
        title: getRandomString(getRandomInt(10, 30)),
        body: getRandomString(getRandomInt(50, 100)),
      })
    );

    check(patchArticle, {
      "is PATCH /article request status 201": (r) => r.status === 201,
    });
  }

  // GET /random
  for (let i = 0; i < 5; i++) {
    sleep(getRandomFloat(minSleep, maxSleep));
    let randomResponse = http.get(`${baseUrl}/random`);
    check(randomResponse, {
      "is GET /random request status 200": (r) => r.status === 200,
    });
  }
}
