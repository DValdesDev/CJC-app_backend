import { Request, Response } from "express";

const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client = new Client();

export const wspController = new class wspController {

    public async initWspClient(req: Request, res: Response) {
        try {
            await wspController.initClient();
            res.send("wsp login")
        } catch (error) {
            console.log(error)
        }
    }

    public async getContacts(req: Request, res: Response) {
        try {
            await wspController.getGroupContacts();
            // let chatGroups;

            // chats.forEach((chat) => {
            //     if(chat.isGroup!){
            //         chatGroups.push(chat)
            //     }
            // })

            // res.send(chatGroups)
        } catch (error) {
            console.log(error)
        }
    }

    static async getGroupContacts(){
        try {
            let chats: any;

            console.log(client)

            // if(client.on){
            //     chats = await client.getChats();
            // }

            return;
        } catch (error) {
            console.log(error)
        }
    }

    static async initClient(){
        try {
            client.on('ready', () => {
                console.log('Client is ready!');
            });
        
            client.on('qr', (qr:any) => {
                qrcode.generate(qr, {small: true});
            });
        
            client.initialize();
            
            console.log(client)

            return;
        } catch (error) {
            console.log(error)
        }
    }
}
