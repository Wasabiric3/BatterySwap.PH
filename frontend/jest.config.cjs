module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
