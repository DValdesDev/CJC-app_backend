import express, { Application, Response } from "express";
import dotenv from "dotenv";

// Import routes
import { cuotaRoutes } from "./routes/cuota_routes";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

class Server{
    app: Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config():void {
        this.app.set('port', PORT);
    }

    routes():void {
        this.app.use('/cuota', cuotaRoutes.router);
    }

    start():void {
        this.app.listen(this.app.get('port'), () => {
            console.log('SERVER on port', this.app.get('port'));
        })
    }
}

const server = new Server();

server.start();