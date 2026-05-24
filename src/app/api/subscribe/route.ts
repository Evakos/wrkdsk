import { NextResponse } from "next/server";

const MAILERLITE_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMDViZmFmM2VlMDFjN2QxNWE4NjVmN2U3M2VjNjJhNDhlYTcxMmRhMGU3NTdmMjgwODQzNTEyZWUzM2MzNGQ0ZjRiODAzYzVmNDZmZDU4NWEiLCJpYXQiOjE3Nzk2MDMyNDQuODM3NzA3LCJuYmYiOjE3Nzk2MDMyNDQuODM3NzEsImV4cCI6NDkzNTI3Njg0NC44MzI2OTksInN1YiI6IjIzODQ3MDQiLCJzY29wZXMiOltdfQ.eVvxs0i52q18lroki3gvcwyskwUX-lXBfALWT06aLTJUFTXniX4-cWd3d-_ixpu9E4IBWzf46XlJRliw8CK71lIePgqWbjrqmBkgcP3TGnHulDUbjNYqK5yky-uX35Vxp0L2tGpjhmUeg62kf5vGLLOYZGOv4xqtv7zaI1dfgsety0PQeHgKRRONWwxXaKl-bmqw1sHorZRTGBflVftGefnE55kbUZL39FvL1JLVFF0kG_GlthNlv1fi8AMVvZphzGieIBckOvm8yEzeL7Az1a14tCruVFy5d1YOV6S6-xsk9cksz4o88O83-XkYOLEXKbJpr47Fd2ptnFFPhngQmnayZaIyPrfKc2rcSe3RNoNOW1U7omndR35EVw6EgCmyBADGdAunahfj2dAGfN9qFm5DfKQ2596I892yjve7lOf4yxcUoA-hW8_60P_-KsY8Pw-YFv0scWFxLRt1InEVcmliqgm7x5M0PYHKTpwKqJB0mVMBpgGvh7VvTDItCHEKpGMV_gODA4Wk0wCapHdw610QNACoHQuRQIu_8pNbDQXL_k2RUChU4edeJb6duLCmkS2aijlB1gHuw5Lal0hyq_pXlwFJ0Bz9vWavOqSMWXc6OV3IoWnEXy1meBRzv_klLF435gH8p-ewdyZqRBiryHCZDlEVRFo4rDMvVsAJg7Q";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          groups: [],
          fields: {
            source: "wrkdsk.com landing page",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("MailerLite error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
