import {HttpServer} from "./http-server.interface";

export interface Resolver {
    resolve(httpAdapter: HttpServer, basePath: string): void;
}