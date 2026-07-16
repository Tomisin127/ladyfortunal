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
 * Price per purchase in USDC on Base mainnet.
 */
export const PRICE = "0.001 USDC"

let _resourceServer: x402ResourceServer | null = null

/**
 * Lazy-initialized x402 resource server.
 * Only created on first request to avoid module load errors.
 */
export function getResourceServer(): x402ResourceServer {
  if (_resourceServer) return _resourceServer

  const cdpKeyId = process.env.CDP_API_KEY_ID
  const cdpKeySecret = process.env.CDP_API_KEY_SECRET

  if (!cdpKeyId || !cdpKeySecret) {
    throw new Error(
      "Missing CDP_API_KEY_ID or CDP_API_KEY_SECRET environment variables"
    )
  }

  const facilitatorConfig = createFacilitatorConfig(cdpKeyId, cdpKeySecret)
  const facilitatorClient = new HTTPFacilitatorClient(facilitatorConfig)

  _resourceServer = new x402ResourceServer(facilitatorClient)
    .register(BASE_MAINNET, new ExactEvmScheme())
    .registerExtension(builderCodeResourceServerExtension)
    .registerExtension(bazaarResourceServerExtension)

  return _resourceServer
}

/**
 * Shared x402 resource server getter for use in route handlers.
 */
export const resourceServer = getResourceServer
