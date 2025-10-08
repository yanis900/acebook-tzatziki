const dotenv = require("dotenv");
dotenv.config({ path: "./.env.test" });

/** @type {import('jest').Config} */
const config = {
  verbose: true,              // Detailed test output
  maxWorkers: 1,              // Run tests serially to avoid DB race conditions
  testEnvironment: "node",    // Use Node environment for Express API
  collectCoverage: true,      // Enable coverage collection
  coverageDirectory: "coverage",          // Where to save coverage reports
  coverageReporters: ["text", "html", "lcov"], // Terminal + HTML + lcov
  collectCoverageFrom: [
    "controllers/**/*.js",
    "lib/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "!**/*.test.js",
    "!tests/**",
    "!index.js",
    "!db/db.js"
  ],
  testMatch: ["**/tests/**/*.test.js"],   // Where Jest looks for tests
};

module.exports = config;