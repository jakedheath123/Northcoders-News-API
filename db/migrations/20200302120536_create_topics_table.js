exports.up = function(knex) {
  return knex.schema.createTable("topics", function(topicsTable) {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
