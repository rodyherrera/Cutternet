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
const Prompt = require('prompt-sync')({ sigint: true });
const User = require('./Models/User');
const Language = require('./Models/Language');
const FileSystem = require('fs');
const DotEnv = require('dotenv');
const Mongoose = require('mongoose');
DotEnv.config({ path: './Settings.env' });

const FormatStandardOutput = (Message) => console.log(`: (Cutternet) => ${Message}.`);
const FormatInput = (Message) => `: (Cutternet) => ${Message} << `;

const ConnectToDatabase = () =>
    new Promise(async (Resolve, Reject) => {
        try {
            const Database = process.env.DATABASE_HOST.replace(
                '<password>',
                process.env.DATABASE_PASSWORD
            );
            await Mongoose.connect(Database, { useNewUrlParser: true });
            FormatStandardOutput('You have successfully connected to the MongoDB database.');
            Resolve();
        } catch (DatabaseConnectionError) {
            FormatStandardOutput(
                'An error ocurred while trying to connect to the MongoDB database.'
            );
            Reject();
            process.exit();
        }
    });

const DropLanguageCollection = () =>
    Mongoose.connection.db.dropCollection('languages', (DatabaseError) => {
        if (DatabaseError)
            return FormatStandardOutput(
                'An error has been ocurred while trying delete de Languages collection'
            );
        FormatStandardOutput('Languages collection has been deleted successfully!');
    });

const CreateSuperUser = async () => {
    const Default = {
        Username: 'codewithrodi',
        Email: 'admin@codewithrodi.com',
        Password: 'idorherztoor',
        PasswordConfirm: 'idorherztoor'
    };
    FormatStandardOutput(`Creating a user with an administrator role...`);
    const Username =
        Prompt(FormatInput(`Username (Default - ${Default.Username})`)) || Default.Username;
    const Email = Prompt(FormatInput(`Email: (Default - ${Default.Email})`)) || Default.Email;
    const Password =
        Prompt(FormatInput(`Password: (Default - ${Default.Password})`)) || Default.Password;
    const PasswordConfirm = Prompt(FormatInput(`Confirm the password`));
    if (Password !== PasswordConfirm) {
        FormatStandardOutput('Password are no the same');
        process.exit();
    }
    console.clear();
    FormatStandardOutput('Please wait...');
    try {
        await User.create({
            Username,
            Email,
            Password,
            PasswordConfirm,
            Role: 'Admin'
        });
        FormatStandardOutput('Super user has been created successfully!');
        FormatStandardOutput(`Now you must enter the site and log in as ${Username}@${Password}`);
    } catch (UserCreationError) {
        FormatStandardOutput(UserCreationError);
    }
};

const ExportLocale = () => {
    const LocaleDirectory = './Data/Locale/';
    FileSystem.readdir(LocaleDirectory, (RuntimeError, Files) =>
        Files.forEach((File) => {
            if (!File.endsWith('.json')) return;
            FileSystem.readFile(LocaleDirectory + File, 'utf8', (RuntimeError, Content) => {
                const Locale = File.split('.')[0].toLowerCase();
                const Data = JSON.parse(Content);
                Object.keys(Data).forEach(async (Key) => {
                    try {
                        await Language.create({
                            Key,
                            Value: Data[Key],
                            Language: Locale
                        });
                        FormatStandardOutput(`<${Locale}>::<${Key}> OK`);
                    } catch (LanguageCreationError) {
                        FormatStandardOutput(LanguageCreationError);
                    }
                });
            });
        })
    );
};

const Callbacks = {
    createsuperuser: CreateSuperUser,
    exportlocale: ExportLocale,
    droplanguagecollection: DropLanguageCollection
};

(async () => {
    try {
        await ConnectToDatabase();
        const Arguments = process.argv.slice(2);
        if (!Arguments.length) {
            FormatStandardOutput(
                'No arguments detected, check the Cutternet documentation and read about how to use the Manager'
            );
            process.exit();
        }
        Arguments.forEach((Instruction) => {
            console.clear();
            Instruction = Instruction.toLowerCase();
            if (Callbacks[Instruction] !== undefined) Callbacks[Instruction]();
            else FormatStandardOutput(`${Instruction} it is not a valid argument`);
        });
    } catch (ManagerRuntimeError) {
        FormatStandardOutput(ManagerRuntimeError);
    }
})();
