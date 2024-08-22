export interface Controller {
    // An array of strings containing the names of the routes handled by the controller
    readonly routes: string[];

    // A method to initialize routers or other logic if needed
    initialize?(): void;

    // A method for processing requests for a specific route
    handleRequest?(req: any, res: any, next?: Function): void;
}