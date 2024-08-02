import { Router } from "express";
import { wspController } from "../controllers/wsp_controller";

export const wspBotRouter = new class wspBotRouter {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void {
        this.router.get('/', wspController.initWspClient);
        this.router.get('/contactos', wspController.getContacts);
    }
}