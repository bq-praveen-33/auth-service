import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Get origin from request to support multiple domains
    const origin = req.headers.origin || '';
    const allowedOrigins = ['https://books.betaque.com', 'http://localhost:3000', 'http://localhost:3001'];
    
    if (origin && allowedOrigins.includes(origin)) {
      // Add CORS headers to support cross-origin requests
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

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
