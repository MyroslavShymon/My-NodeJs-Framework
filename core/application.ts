import {Container} from "./injector";
import {addLeadingSlash, HttpServer} from "../common";
import {Resolver} from "../common/interfaces/resolver.interface";
import {RoutesResolver} from "./router";

export class Application {
    public httpServer: any;
    private readonly routesResolver: Resolver;

    constructor(
        private readonly container: Container,
        private readonly httpAdapter: HttpServer,
    ) {
        this.registerHttpServer();

        this.routesResolver = new RoutesResolver(
            this.container,
        );
    }

    public registerHttpServer() {
        this.httpServer = this.createServer();
    }

    public createServer<T = any>(): T {
        this.httpAdapter.initHttpServer();
        return this.httpAdapter.getHttpServer() as T;
    }

    public async init(): Promise<this> {
        this.httpAdapter.registerBodyParser();
        await this.registerRouter();
        return this;
    }

    public async listen(port: number | string) {
        await this.init();
        this.httpAdapter.listen(port);
        return this.httpServer;
    }

    public async registerRouter() {
        const prefix = ''
        const basePath = addLeadingSlash(prefix);
        this.routesResolver.resolve(this.httpAdapter, basePath);
    }
}