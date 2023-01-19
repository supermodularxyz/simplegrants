// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    const { user } = req.body;
    const session = await getSession({ req });

    if (!session) return res.status(404);

    // Update the user ID with the visitor ID on sign in
    await prisma.user.update({
      data: {
        visitorId: user,
      },
      where: {
        id: (session.user as any).id,
      },
    });

    return res.status(200).end();
  } else {
    // Do nothing
    res.status(404).end();
  }
}
