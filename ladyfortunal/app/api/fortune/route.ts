import { type NextRequest, NextResponse } from "next/server"
import { declareBuilderCodeExtension, BUILDER_CODE as BUILDER_CODE_KEY } from "@x402/extensions/builder-code"
import { PAY_TO_ADDRESS, BUILDER_CODE, BASE_MAINNET, PRICE } from "@/lib/x402"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// x402 V2 Payment Required schema with Builder Code extension
const createPaymentRequired = () => ({
  x402Version: 2,
  resource: {
    url: "/api/fortune",
    description: "Random fortune generator",
    mimeType: "application/json",
  },
  accepts: [
    {
      scheme: "exact",
      network: BASE_MAINNET,
      asset: "USDC",
      amount: PRICE,
      payTo: PAY_TO_ADDRESS,
      maxTimeoutSeconds: 60,
    },
  ],
  extensions: {
    [BUILDER_CODE_KEY]: declareBuilderCodeExtension(BUILDER_CODE),
  },
})

export async function GET(_req: NextRequest) {
  const paymentRequired = createPaymentRequired()
  
  return new NextResponse(
    JSON.stringify({
      error: "Payment Required",
      message: "This endpoint requires payment via x402",
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "Payment-Required": Buffer.from(JSON.stringify(paymentRequired)).toString("base64"),
      },
    }
  )
}

export async function POST(_req: NextRequest) {
  const paymentRequired = createPaymentRequired()
  
  return new NextResponse(
    JSON.stringify({
      error: "Payment Required",
      message: "This endpoint requires payment via x402",
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "Payment-Required": Buffer.from(JSON.stringify(paymentRequired)).toString("base64"),
      },
    }
  )
}
