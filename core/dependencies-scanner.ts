import 'reflect-metadata';
import {MODULE_METADATA} from "../common";
import { Container, Module } from "./injector";

export class DependenciesScanner {

    constructor(private readonly container: Container) {}

    public async scan(module: any) {
        await this.scanForModules(module);
        await this.scanModulesForDependencies();
    }

    public async scanForModules(module: any) {
        const moduleInstance = await this.insertModule(module);
        const innerModules = [...this.reflectMetadata(moduleInstance, MODULE_METADATA.IMPORTS)];

        for (const [index, innerModule] of innerModules.entries()) {
            await this.scanForModules(innerModule)
        }

        return moduleInstance
    }

    public async insertModule(module: any) {
        return this.container.addModule(module);
    }


    public async scanModulesForDependencies() {
        const modules: Map<string, Module> = this.container.getModules();

        for (const [token, { metatype }] of modules) {
            await this.reflectAndAddImports(metatype, token);
            this.reflectAndAddProviders(metatype, token);
            this.reflectAndAddControllers(metatype, token);
        }
    }

    public async reflectAndAddImports(
        module: any,
        token: string,
    ) {
        const modules = this.reflectMetadata(module, MODULE_METADATA.IMPORTS);
        for (const related of modules) {
            await this.container.addImport(related, token);
        }
    }

    public reflectAndAddProviders(
        module: any,
        token: string,
    ) {
        const providers = this.reflectMetadata(module, MODULE_METADATA.PROVIDERS);
        providers.forEach((provider: any) =>
            this.container.addProvider(provider, token),
        );
    }

    public reflectAndAddControllers(module: any, token: string) {
        const controllers = this.reflectMetadata(module, MODULE_METADATA.CONTROLLERS);
        controllers.forEach((controller: any) =>
            this.container.addController(controller, token),
        );
    }

    public reflectMetadata(metatype: any, metadataKey: string) {
        return Reflect.getMetadata(metadataKey, metatype) || [];
    }
}