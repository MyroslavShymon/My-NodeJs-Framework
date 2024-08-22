# My Framework

## Overview

My Framework is a lightweight and modular framework for building server-side applications with TypeScript. It provides a
clean and intuitive way to define and manage modules, controllers, and services, allowing for a streamlined development
experience. The framework integrates decorators and a factory pattern to handle dependency injection, routing, and
application bootstrapping efficiently.This framework features a clean and intuitive approach to application development
by integrating a dependency container to manage services and dependencies seamlessly.

[Example of usage of my framework](https://github.com/MyroslavShymon/NodeJs-Framework-Example-Project)

## Features

1. Modular Architecture: Define application modules, controllers, and services with a clear separation of concerns.
2. Decorators: Utilize decorators for defining routes, request methods, and dependency injections.
3. Dependency Injection: Seamlessly inject services into controllers and manage dependencies.
4. Routing: Configure routing with support for multiple HTTP methods (GET, POST, PUT, PATCH, DELETE).
5. Bootstrapping: Simple application initialization using a factory pattern.

## Implementation

### Bootstrapping the Application

To start the application, use the Factory class to create an instance of the AppModule and listen on a specified port.

```typescript
async function bootstrap() {
	const app = await Factory.create(AppModule);
	await app.listen(3000);
}

bootstrap();
```

### Defining Modules

Modules define the structure of the application, including controllers and providers.

```typescript
import { Module } from "../decorators";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
```

### Creating Controllers

Controllers handle HTTP requests and use decorators to define routes and request methods.

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "../decorators";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {
	}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Post('body/:id')
	recieveBody(@Body() data: any, @Param('id') id: string) {
		return 'body: ' + JSON.stringify(data) + ` has been received and id: ${id}`;
	}

	@Patch('body/:id')
	examplePatch(@Body() data: any, @Param('id') id: string) {
		return 'patch body: ' + JSON.stringify(data) + ` has been received and id: ${id}`;
	}

	@Put('body/:id')
	examplePut(@Body() data: any, @Param('id') id: string) {
		return 'put body: ' + JSON.stringify(data) + ` has been received and id: ${id}`;
	}

	@Delete('body/:id')
	exampleDelete(@Param('id') id: string) {
		return `Delete has been received and id: ${id}`;
	}
}
```

### Implementing Services

Services provide business logic and can be injected into controllers.

```typescript
import { Injectable } from "../decorators";

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
}
```

Feel free to customize and extend the framework to fit your needs.
Thanks for checking out the functionality of my self-written framework, I hope you like it