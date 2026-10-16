// The parts of @coinbase/agentkit this package uses, loaded from the installed package itself.
// Importing the package root also loads every wallet and action provider it ships, and several of
// their dependencies are ES modules only, which Jest's CommonJS runtime cannot load.
const dist = "../node_modules/@coinbase/agentkit/dist";

module.exports = {
  ...require(`${dist}/action-providers/actionProvider`),
  ...require(`${dist}/action-providers/actionDecorator`),
  ...require(`${dist}/wallet-providers/walletProvider`),
  ...require(`${dist}/wallet-providers/evmWalletProvider`),
};
