exports.up = function(knex) {
  return knex.schema.createTable("articles", function(articlesTable) {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);

    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("author").references("users.username");
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
