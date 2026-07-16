import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PAY_TO_ADDRESS = process.env.PAY_TO_ADDRESS || ""
const BUILDER_CODE = process.env.BUILDER_CODE || "bc_placeholder"

// x402 Payment Requirement Challenge
const paymentRequirement = {
  resource: {
    url: "/api/fortune",
    description: "Random fortune generator",
    mimeType: "application/json",
  },
  accepts: [
    {
      scheme: "exact",
      network: "eip155:8453",
      payTo: PAY_TO_ADDRESS,
      price: "0.001 USDC",
    },
  ],
  extensions: {
    "builder-code": {
      info: {
        a: BUILDER_CODE,
      },
    },
  },
}

export async function GET(_req: NextRequest) {
  return new NextResponse(
    JSON.stringify({
      error: "Payment Required",
      message: "This endpoint requires payment via x402",
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "Payment-Required": Buffer.from(JSON.stringify(paymentRequirement)).toString("base64"),
      },
    }
  )
}

export async function POST(_req: NextRequest) {
  return new NextResponse(
    JSON.stringify({
      error: "Payment Required",
      message: "This endpoint requires payment via x402",
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "Payment-Required": Buffer.from(JSON.stringify(paymentRequirement)).toString("base64"),
      },
    }
  )
}
