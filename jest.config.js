export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  moduleFileExtensions: ["js", "json"],
  transform: {},
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middlewares/**/*.js",
    "routes/**/*.js",
    "app.js",
    "!**/node_modules/**",
  ],
};
