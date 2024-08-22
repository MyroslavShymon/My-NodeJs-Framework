import {RequestHandler} from "express";

export interface HttpServer<TRequest = any, TResponse = any> {
    reply(response: any, body: any, statusCode?: number): any;

    get(handler: RequestHandler<TRequest, TResponse>): any;

    get(path: string, handler: RequestHandler<TRequest, TResponse>): any;

    put(handler: RequestHandler<TRequest, TResponse>): any;

    put(path: string, handler: RequestHandler<TRequest, TResponse>): any;

    patch(handler: RequestHandler<TRequest, TResponse>): any;

    patch(path: string, handler: RequestHandler<TRequest, TResponse>): any;

    delete(handler: RequestHandler<TRequest, TResponse>): any;

    delete(path: string, handler: RequestHandler<TRequest, TResponse>): any;

    post(handler: RequestHandler<TRequest, TResponse>): any;

    post(path: string, handler: RequestHandler<TRequest, TResponse>): any;

    listen(port: number | string): any;

    getInstance(): any;

    getHttpServer(): any;

    initHttpServer(): void;

    registerBodyParser(): void
}