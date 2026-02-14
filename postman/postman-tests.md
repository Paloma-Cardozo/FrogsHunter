# Postman – Test Scripts

## Endpoint tested

GET /cards

## Purpose

Validate that the API returns a valid JSON array of cards with the expected structure and data quality.

---

## Test scripts used in Postman

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response is valid JSON and is an array", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.be.an("array");
});

pm.test("Each item has required properties", function () {
  const jsonData = pm.response.json();
  jsonData.forEach(function (item, index) {
    pm.expect(item).to.have.property("id");
    pm.expect(item).to.have.property("name");
    pm.expect(item).to.have.property("image");
    pm.expect(item).to.have.property("alt");
    pm.expect(item).to.have.property("color");
  });
});

pm.test("Response time is under 1000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Content-Type header is application/json", function () {
  pm.expect(pm.response.headers.get("Content-Type")).to.include(
    "application/json",
  );
});

pm.test("At least one card exists in the response", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData.length).to.be.at.least(1);
});

pm.test(
  "Each card has required properties (id, name, image, alt, color)",
  function () {
    const jsonData = pm.response.json();
    jsonData.forEach((card, index) => {
      pm.expect(card).to.have.property("id");
      pm.expect(card).to.have.property("name");
      pm.expect(card).to.have.property("image");
      pm.expect(card).to.have.property("alt");
      pm.expect(card).to.have.property("color");
    });
  },
);

pm.test("Each card has correct property types", function () {
  const jsonData = pm.response.json();
  jsonData.forEach((card, index) => {
    pm.expect(card.id).to.be.a("number");
    pm.expect(card.name).to.be.a("string");
    pm.expect(card.image).to.be.a("string");
    pm.expect(card.alt).to.be.a("string");
    pm.expect(card.color).to.be.a("string");
  });
});

pm.test("Each card's color is a valid hex color format", function () {
  const jsonData = pm.response.json();
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  jsonData.forEach((card, index) => {
    pm.expect(card.color).to.match(hexColorRegex);
  });
});
```

---

## Test results

All tests passed successfully.

See screenshots:

- screenshots/body-preview.png
- screenshots/test-results.png
