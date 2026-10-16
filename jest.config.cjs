module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  moduleNameMapper: {
    // See test/agentkit-core.js. The decorator's "../wallet-providers" import only needs the
    // WalletProvider base class.
    "^@coinbase/agentkit$": "<rootDir>/test/agentkit-core.js",
    "^\\.\\./wallet-providers$":
      "<rootDir>/node_modules/@coinbase/agentkit/dist/wallet-providers/walletProvider.js",
  },
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*.ts", "!./src/**/*.test.ts", "!./src/index.ts"],
  coverageReporters: ["text", "text-summary"],
  coverageThreshold: {
    global: { branches: 77, functions: 85, statements: 85, lines: 85 },
  },
  maxWorkers: 1,
};
