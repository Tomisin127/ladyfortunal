import { type NextRequest, NextResponse } from "next/server"
import { withX402 } from "@x402/next"
import { BUILDER_CODE as BUILDER_CODE_KEY, declareBuilderCodeExtension } from "@x402/extensions/builder-code"
import { declareDiscoveryExtension } from "@x402/extensions/bazaar"
import { resourceServer, BASE_MAINNET, PAY_TO_ADDRESS, PRICE, BUILDER_CODE } from "@/lib/x402"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * The actual fulfillment. This only runs after the x402 payment has been
 * verified and settled on Base mainnet, so we can safely return the fortune.
 */
async function handler(_request: NextRequest) {
  return NextResponse.json({
    fortune: "Your fortune will come through the blockchain.",
    timestamp: new Date().toISOString(),
    message: "Thanks for your payment!",
  })
}

export const GET = withX402(
  handler,
  {
    accepts: {
      scheme: "exact",
      network: BASE_MAINNET,
      payTo: PAY_TO_ADDRESS,
      price: PRICE,
    },
    description: "Get a random fortune via x402 payment on Base mainnet.",
    mimeType: "application/json",
    serviceName: "Fortune Generator",
    tags: ["fortune", "prediction", "entertainment"],
    // ERC-8021 Builder Code attribution ("a" app code) on every settlement.
    extensions: {
      // Must be nested under the "builder-code" extension key so the facilitator
      // recognizes it and appends the ERC-8021 suffix to the settlement calldata.
      [BUILDER_CODE_KEY]: declareBuilderCodeExtension(BUILDER_CODE),
      // Bazaar discovery metadata: tells agents how to call this endpoint.
      ...declareDiscoveryExtension({
        output: {
          example: {
            fortune: "Your fortune will come through the blockchain.",
            message: "Thanks for your payment!",
          },
        },
      }),
    },
  },
  resourceServer,
)
