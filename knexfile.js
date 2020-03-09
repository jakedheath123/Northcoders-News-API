const ENV = process.env.NODE_ENV || "development";
//console.log(`i am currently in ${ENV}`);

const { DB_URL } = process.env;

const customConfigs = {
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news"
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
