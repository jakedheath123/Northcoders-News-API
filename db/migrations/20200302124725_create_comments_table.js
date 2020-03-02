exports.up = function(knex) {
  return knex.schema.createTable("comments", function(commentsTable) {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").notNullable();
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.string("body").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
