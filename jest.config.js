module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [
      "ts", "js"
  ],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.spec.ts$": "ts-jest"
  },
  testRegex: ".spec.ts$"
}