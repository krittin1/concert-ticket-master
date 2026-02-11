"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const messages = errors.map((error) => ({
                field: error.property,
                errors: Object.values(error.constraints || {}),
            }));
            return new common_1.BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: messages,
            });
        },
    }));
    await app.listen(process.env.PORT ?? 4000);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 4000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map