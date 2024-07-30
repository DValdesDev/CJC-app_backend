import { Request, Response } from "express";
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');

import { google, GoogleApis } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export const cuotaController = new class CuotaController {
    public async getLista(req: Request, res: Response) {
        try {
            const users:any = await CuotaController.authorize().then(CuotaController.listMajors).catch(console.error);
            res.send(users);
        } catch (error) {
            console.log(error)
        }
    }

    static async loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);

            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    static async saveCredentials(client: any) {
        const content = await fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });

        await fs.writeFile(TOKEN_PATH, payload);
    }

    static async authorize() {
        let client: any = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
          });
        if (client.credentials) {
            await this.saveCredentials(client);
        }

        return client;
    }

    static async listMajors(auth:any) {
        const sheets = google.sheets({ version: 'v4', auth});
        
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: '1LMKGWE3W1wCELFLQC1VHmrr4JPtwkhtEAkS_Zx7E2nM',
            range:'Listado de jugadores!B5:E',
        });

        const rows = res.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return;
        }
        let users:any[] = [];
        rows.forEach((row) => {
            // Print columns A and E, which correspond to indices 0 and 4.
            if (row[3] == "No") {
                users.push(`${row[0]}, ${row[1]}, ${row[3]}`)
            } 
        });

        return users;
    }
}