import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle('IT Live')
    .setDescription('IT LIVE')
    .setVersion('1.0')
    .addBearerAuth()
    .build();