import { x402ResourceServer } from "@x402/next"
import { HTTPFacilitatorClient } from "@x402/core/http"
import { ExactEvmScheme } from "@x402/evm/exact/server"
import { builderCodeResourceServerExtension } from "@x402/extensions/builder-code"
import { bazaarResourceServerExtension } from "@x402/extensions/bazaar"
import { createFacilitatorConfig } from "@coinbase/x402"

/**
 * Base mainnet network id (CAIP-2).
 * USDC payments settle here through the Coinbase CDP facilitator.
 */
export const BASE_MAINNET = "eip155:8453"

/**
 * The wallet that receives the USDC for each purchase.
 */
export const PAY_TO_ADDRESS = process.env.PAYMENT_WALLET_ADDRESS || ""

/**
 * ERC-8021 Builder Code (app code "a") attributed on every settlement.
 */
export const BUILDER_CODE = process.env.BASE_BUILDER_CODE || "bc_placeholder"

/**
 * Price per purchase, expressed in USD. The CDP facilitator resolves "$" prices
 * to USDC on Base mainnet.
 */
export const PRICE = "$0.001" as const

if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
  // Surfaced at request time so the route returns a clear 500 instead of a cryptic auth error.
  console.error("[v0] Missing CDP_API_KEY_ID / CDP_API_KEY_SECRET — required for the CDP facilitator on mainnet.")
}

/**
 * The Coinbase CDP facilitator config (mainnet). It is authenticated with the
 * CDP API key pair and is what makes the endpoint discoverable through the Bazaar.
 */
const facilitatorConfig = createFacilitatorConfig(process.env.CDP_API_KEY_ID, process.env.CDP_API_KEY_SECRET)

const facilitatorClient = new HTTPFacilitatorClient(facilitatorConfig)

/**
 * Shared x402 resource server:
 * - settles "exact" EVM payments on Base mainnet,
 * - attributes payments to the Builder Code (ERC-8021),
 * - declares Bazaar discovery metadata so agents can find the endpoint.
 */
export const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(BASE_MAINNET, new ExactEvmScheme())
  .registerExtension(builderCodeResourceServerExtension)
  .registerExtension(bazaarResourceServerExtension)
