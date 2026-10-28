const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/api/tests/",
  ],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputName: "junit.xml",
      },
    ],
  ],
};

module.exports = createJestConfig(customJestConfig);