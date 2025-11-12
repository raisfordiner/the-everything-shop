import nodemailer from "nodemailer";

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "mailhog",
        port: Number(process.env.SMTP_PORT) || 1025,
        secure: false,
    });

    const info = await transport.sendMail({
        from: opts.from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
    });
}
