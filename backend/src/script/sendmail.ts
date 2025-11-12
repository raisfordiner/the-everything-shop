// This is a helper script for quick testing mail sending
// Also used a an example

import { sendMail } from "../util/mail";

async function main() {
    await sendMail({
        from: "sender@example.com",
        to: "receiver@example.com",
        subject: "Test Mail 101",
        text: "Hey, this mail is send to you from 'the everything shop'"
    });

    await sendMail({
        from: "another@example.com",
        to: "receiver@example.com",
        subject: "Test Mail html 101",
        html: `
        <html>
            <h1>HEY, I AM GOING TO SEND YOU A HTML</h1>

            <p>
                <b>this is so bold</b> <br>
                <i>this is so italic</i>
            </p>
        </html>
        `
    })
}

main().catch(console.error);
