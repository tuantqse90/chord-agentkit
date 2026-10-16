# chord-agentkit

Swap actions for [Coinbase AgentKit](https://github.com/coinbase/agentkit), backed by the [Chord](https://getchord.xyz) API.

Chord quotes every venue it indexes on a chain, splits an order across venues when that gives a better output, and settles the trade through one router contract (`0x1b1fee89a381e595fe6536b99ba91f3e16e9601a`, the same address on every chain below). Transactions are built by the API unsigned and signed by your AgentKit wallet provider; Chord never sees a key and never holds funds.

## Install

```bash
npm install chord-agentkit @coinbase/agentkit viem zod
```

## Usage

```typescript
import { AgentKit } from "@coinbase/agentkit";
import { chordActionProvider } from "chord-agentkit";

const agentkit = await AgentKit.from({
  walletProvider, // any EvmWalletProvider: CDP, Viem, Privy, ...
  actionProviders: [chordActionProvider()],
});
```

The actions then show up in any AgentKit framework extension (LangChain, Vercel AI SDK, MCP, OpenAI Agents SDK) like the built-in ones.

### Configuration

All fields are optional.

| Option | Env var | Description |
| --- | --- | --- |
| `apiKey` | `CHORD_API_KEY` | Sent as `X-API-Key`. Quotes and swaps work without a key at the public limit of 60 requests per minute per IP. |
| `feeAccount` | `CHORD_FEE_ACCOUNT` | Optional referrer address, sent to the Chord API as `feeAccount` on swaps built by this provider. |
| `baseUrl` |  | Defaults to `https://api.getchord.xyz/v1`. |

## Actions

| Action | What it does |
| --- | --- |
| `search_tokens` | Searches Chord's token index on the wallet's chain by symbol, name or address. Returns address, symbol, decimals and whether the token is on the chain's curated list. |
| `get_swap_quote` | Best route for `amount` of `fromToken` into `toToken`: expected output after Chord's fee, the minimum the transaction enforces, price impact, fee and the venues used. Sends nothing. |
| `swap` | Quotes, approves the router for exactly the input amount when the allowance is too low, builds the transaction with the Chord API, checks that it targets the Chord router on the wallet's chain, simulates it from the wallet, and only then sends it. Returns the transaction hash and, for an ERC-20 output, the amount received. |

Amounts are given in whole units (`"1.5"` ETH, `"10"` USDC); the provider reads decimals on-chain. The native coin is `0x0000000000000000000000000000000000000000` (`0xEeee...EEeE` is accepted too).

## Networks

The provider is active when the wallet is on one of these chains:

| Chain             | Id    | Native coin |
| ----------------- | ----- | ----------- |
| Ethereum          | 1     | ETH         |
| Base              | 8453  | ETH         |
| Arbitrum One      | 42161 | ETH         |
| BNB Chain         | 56    | BNB         |
| Avalanche C-Chain | 43114 | AVAX        |
| Monad             | 143   | MON         |
| Robinhood Chain   | 4663  | ETH         |
| Arc               | 5042  | USDC        |

On Arc gas is paid in USDC. The provider sends the USDC system contract (`0x3600...0000`, 6 decimals) for the native coin, so an Arc "native" input is approved and pulled like an ERC-20.

USDT on Ethereum rejects a new approval while an allowance is still open; the provider resets it to zero first.

## Fees

Chord's fee is read on-chain per output token (`FeeCollector.feeBpsFor`). The quote reports it as `feeBps` and `feeAmount`, and `expectedAmountOut` is already net of it.

## Development

```bash
npm install
npm run lint
npm test
npm run build
```

Unit tests mock HTTP and the wallet. They load AgentKit's own `ActionProvider`, `CreateAction` and wallet base classes from the installed package (see `test/agentkit-core.js`).

## Links

- Docs: https://getchord.xyz/docs
- API reference (OpenAPI): https://getchord.xyz/docs/openapi.json
- AgentKit: https://github.com/coinbase/agentkit

## License

MIT
