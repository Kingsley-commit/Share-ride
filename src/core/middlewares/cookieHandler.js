// import type { Response } from "express";

// interface CookieHandlerOptions {
//   res: Response;
//   cookieName: string;
//   data: any;
// }

// interface ClearHttpCookieOptions {
//   cookieName: string;
//   res: Response;
// }

// export class CookieHandler {
//   saveToHttpOnlyCookie(options: CookieHandlerOptions) {
//     const { cookieName, data, res } = options;
//     res.cookie(cookieName, data);
//   }
//   clearHttpOnlyCookie(options: ClearHttpCookieOptions) {
//     const { cookieName, res } = options;
//     res.clearCookie(cookieName, {
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//   }
// }


// export const cookieHandler = new CookieHandler();