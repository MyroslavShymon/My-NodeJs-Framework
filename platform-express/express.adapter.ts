import express from 'express';
import * as http from 'http';
import {json as bodyParserJson, urlencoded as bodyParserUrlencoded,} from 'body-parser';
import {AbstractHttpAdapter} from "../adapters";
import {isNil, isObject} from "../common";

export class ExpressAdapter extends AbstractHttpAdapter {

    constructor() {
        super(express());
    }

    public reply(response: any, body: any) {
        if (isNil(body)) {
            return response.send();
        }

        return isObject(body) ? response.json(body) : response.send(String(body));
    }

    public listen(port: any) {
        return this.httpServer.listen(port);
    }


    public registerBodyParser() {
        const parserMiddleware = {
            jsonParser: bodyParserJson(),
            urlencodedParser: bodyParserUrlencoded({extended: true}),
        };
        Object.keys(parserMiddleware)
            .forEach((parserKey: any) => this.use((parserMiddleware as any)[parserKey]));
    }

    public initHttpServer() {
        this.httpServer = http.createServer(this.getInstance());
    }
}