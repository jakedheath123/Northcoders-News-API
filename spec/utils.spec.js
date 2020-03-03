const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", function() {
  test("Returns an empty array when passed an empty array", function() {
    const input = [];
    const expected = [];
    const actual = formatDates(input);

    expect(actual).toEqual(expected);
  });
  test("Returns a new array of one new object with timestrap converted into a Javascript date object, when passed an array of one object with a timestrap property", function() {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const actual = formatDates(input);

    expect(actual[0].created_at instanceof Date).toBe(true);
    expect(actual[0].created_at.toString()).toEqual(
      "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)"
    );
  });
  test("Returns a new array of more than one new object with timestrap converted into a Javascript date object, when passed an array of more than one object with a timestrap property", function() {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];

    const actual = formatDates(input);

    expect(actual[0].created_at instanceof Date).toBe(true);
    expect(actual[1].created_at instanceof Date).toBe(true);
    expect(actual[2].created_at instanceof Date).toBe(true);
  });
  test("Original input is not mutated", function() {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];

    formatDates(input);

    expect(input).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
  test("Return value is different reference from input", function() {
    const input = [];

    expect(formatDates(input)).not.toBe(input);
  });
});

describe("makeRefObj", function() {
  test("Returns an empty object when passed an empty array", function() {
    const input = [];
    const expected = {};
    const actual = makeRefObj(input);

    expect(actual).toEqual(expected);
  });
  test("Returns a reference object of title value as key, and article_id as value when passed an array of one object with the keys of article_id and title", function() {
    const input = [{ article_id: 1, title: "A" }];
    const expected = { A: 1 };
    const actual = makeRefObj(input);

    expect(actual).toEqual(expected);
  });
  test("Returns a reference object which is keyed by each item's title, with the values being each item's corresponding id, when passed an array with multiple object with corresponding keys", function() {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" },
      { article_id: 4, title: "D" },
      { article_id: 5, title: "E" }
    ];

    const expected = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5
    };

    const actual = makeRefObj(input);

    expect(actual).toEqual(expected);
  });
  test("Original input is not mutated", function() {
    const input = [{ article_id: 1, title: "A" }];
    makeRefObj(input);
    expect(input).toEqual([{ article_id: 1, title: "A" }]);
  });
  test("Return value is different reference from input", function() {
    const input = [];
    expect(makeRefObj(input)).not.toBe(input);
  });
});

describe("formatComments", function() {
  test("Returns an empty array when passed an empty array", function() {
    const input = [];
    const expected = [];
    const actual = formatComments(input);

    expect(actual).toEqual(expected);
  });
  test("Returns a new array of one object with formatted comments when passed an array of one object and a reference object", function() {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];

    const referenceObject = {
      "They're not exactly dogs, are they?": 1
    };

    const actual = formatComments(input, referenceObject);

    expect(actual[0]).toHaveProperty(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
    expect(actual[0].created_at instanceof Date).toBe(true);
  });
  test("Returns a new array of more than one object with formatted comments when passed an array of one object and a reference object", function() {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Hello Magazine",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];

    const referenceObject = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2,
      "Hello Magazine": 3
    };

    const actual = formatComments(input, referenceObject);

    expect(actual[0]).toHaveProperty(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
    expect(actual[1]).toHaveProperty(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
    expect(actual[2]).toHaveProperty(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
    expect(actual[0].created_at instanceof Date).toBe(true);
    expect(actual[1].created_at instanceof Date).toBe(true);
    expect(actual[2].created_at instanceof Date).toBe(true);
  });
  test("Original input is not mutated", function() {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const referenceObject = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2,
      "Hello Magazine": 3
    };
    formatComments(input, referenceObject);

    expect(input).toEqual([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
  test("Return value is different reference from input", function() {
    const input = [];
    expect(formatComments(input)).not.toBe(input);
  });
});
