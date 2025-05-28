import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import cors from "cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await new Promise<void>((resolve, reject) => {
      cors({
        origin: true, // Allow all origins
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
      })(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve();
      });
    });
    const session = await getSession({ req });
    const redirect = req.query.redirect as string;

    if (session) {
      const userEmail = session.user?.email;
      if (
        userEmail &&
        (process.env.NEXT_PUBLIC_DOMAIN_WHITELIST || "betaque.com").split(',').map(domain => domain.trim()).some(domain => userEmail.endsWith(domain))
      ) {
        // User is authenticated and from the correct domain
        res.status(200).json({
          isAuthenticated: true,
          user: session,
          redirect: redirect,
        });
      } else {
        // User is not from the correct domain
        res.status(403).json({
          isAuthenticated: false,
          error: "Access denied",
        });
      }
    } else {
      // User is not authenticated
      res.status(401).json({ isAuthenticated: false, error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    res
      .status(500)
      .json({ isAuthenticated: false, error: "Internal server error" });
  }
};

export default handler;
