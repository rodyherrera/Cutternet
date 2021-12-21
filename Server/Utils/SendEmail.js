/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Backend Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
const NodeMailer = require('nodemailer');
const CatchAsync = require('./CatchAsync');

const SendEmail = CatchAsync(async (Options) => {
    // * Create a transporter
    const Transporter = NodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // * Define the email options
    const MailOptions = {
        from: 'Rodolfo Herrera Hernandez <admin@codewithrodi.com>',
        to: Options.Email,
        subject: Options.Subject,
        text: Options.Message
    };

    // * Actually send the email
    await Transporter.sendMail(MailOptions);
});

module.exports = SendEmail;
