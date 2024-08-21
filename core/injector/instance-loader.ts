import {Container} from "./container";
import {Injector} from "./injector";
import {Module} from "./module";

export class InstanceLoader {
    private readonly injector = new Injector();

    constructor(private readonly container: Container) {
    }

    public async createInstancesOfDependencies() {
        const modules = this.container.getModules();

        await this.createInstances(modules);
    }

    private async createInstances(modules: Map<string, Module>) {
        await Promise.all(
            [...modules.values()].map(async module => {
                await this.createInstancesOfProviders(module);
                await this.createInstancesOfControllers(module);
            })
        )
    }

    private async createInstancesOfProviders(module: Module) {
        const {providers} = module;
        const wrappers = [...providers.values()];
        await Promise.all(
            wrappers.map(item => this.injector.loadProvider(item, module)),
        )
    }

    private async createInstancesOfControllers(module: Module) {
        const {controllers} = module;
        const wrappers = [...controllers.values()];
        await Promise.all(
            wrappers.map(item => this.injector.loadControllers(item, module)),
        )
    }
}