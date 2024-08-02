import { Request, Response } from "express";
import { Cuota_pago } from "../interfaces/cuota";
import { googleAuth } from "./google_auth";
import { google, GoogleApis } from 'googleapis';

export const cuotaController = new class CuotaController {
    public async getLista(req: Request, res: Response) {
        try {
            const usuariosNoPagaron:Cuota_pago[] | undefined | void = await googleAuth.authorize().then(CuotaController.listMajors).catch(console.error);

            res.send({
                "status": res.statusCode,
                "statusText": res.statusMessage,
                "data": usuariosNoPagaron,
            })
        } catch (error) {
            res.send({
                "status": res.statusCode,
                "statusMessage": res.statusMessage,
                "message": error
            })
        }
    }

    static async listMajors(auth:any) {
        const sheets = google.sheets({ version: 'v4', auth});
        
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: '1LMKGWE3W1wCELFLQC1VHmrr4JPtwkhtEAkS_Zx7E2nM',
            range:'Listado de jugadores!B5:E',
        });

        const lista = res.data.values;

        if (!lista || lista.length === 0) {
            console.log('No data found.');
            return;
        }

        let usuarios_no_pagaron:Cuota_pago[] = [];

        lista.forEach((jugador) => {
            if (jugador[3] == "No") {
                const user:Cuota_pago = {
                    nombre: jugador[0],
                    apellido:jugador[1],
                    pago:jugador[3]
                }

                usuarios_no_pagaron.push(user)
            }
        });

        return usuarios_no_pagaron;
    }
}