/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  "testTimeout": 5 * 60 * 1000, // 5 minutes
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  coverageReporters: ['json-summary'],
};
