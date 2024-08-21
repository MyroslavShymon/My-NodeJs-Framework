import {Module} from "./module";
import {ModuleTokenFactory} from "./module-token-factory";
import {AbstractHttpAdapter} from "../../adapters";

export class Container {
    private readonly modules = new Map<string, Module>();
    private readonly moduleTokenFactory = new ModuleTokenFactory();
    private httpAdapter: AbstractHttpAdapter | undefined;

    public async addModule(module: any) {
        const token = this.moduleTokenFactory.create(module);

        if (this.modules.has(module.name)) {
            return;
        }

        const moduleRef = new Module(module);
        moduleRef.token = token;
        this.modules.set(token, moduleRef);

        return moduleRef;
    }

    public getModules(): Map<string, Module> {
        return this.modules;
    }

    public setHttpAdapter(httpAdapter: any) {
        this.httpAdapter = httpAdapter;
    }

    public getHttpAdapterRef() {
        return this.httpAdapter;
    }

    public async addImport(
        relatedModule: any,
        token: string,
    ) {
        if (!this.modules.has(token)) {
            return;
        }
        const moduleRef = this.modules.get(token);
        if (!moduleRef) {
            throw Error('MODULE NOT EXIST')
        }

        const related = this.modules.get(relatedModule.name);
        if (!related) {
            throw Error('RELATED MODULE NOT EXIST')
        }
        moduleRef.addRelatedModule(related);
    }

    public addProvider(provider: any, token: string) {
        if (!this.modules.has(token)) {
            throw new Error('Module not found.');
        }
        const moduleRef = this.modules.get(token);
        if (!moduleRef) {
            throw Error('MODULE NOT EXIST')
        }
        moduleRef.addProvider(provider)
    }

    public addController(controller: any, token: string) {
        if (!this.modules.has(token)) {
            throw new Error('Module not found.');
        }
        const moduleRef = this.modules.get(token);
        if (!moduleRef) {
            throw Error('MODULE NOT EXIST')
        }
        moduleRef.addController(controller);
    }
}