import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import { sendMail } from "util/mail";

export default class MailController {
  static async postMail(req: Request, res: Response) {
    try {
      const { from, to, subject, text, html } = req.body;

      const mailData: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html?: string;
      } = { from, to, subject, text };

      if (html) {
        mailData.html = html;
      }

      const mail = await sendMail(mailData);

      return Send.success(res, { mail }, "Mail sent successfully");
    } catch (error) {
      logger.error({ error }, "Error sending mail");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
