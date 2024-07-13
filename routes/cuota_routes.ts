import { Router } from "express";
import { cuotaController } from "../controllers/cuota_controller";

export const cuotaRoutes = new class CuotaRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void {
        this.router.get('/', cuotaController.getLista);
    }
}