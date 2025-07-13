import mongoose from 'mongoose';
import { Client } from '@core/Client/ClientClass';
import { Users } from '@core/Database/Users/UserMethods';
import { LogLevel } from '@enums/LogLevel';

export class Database {
    public readonly users: Users;

    constructor(private readonly client: Client) {
        this.users = new Users();
    }

    async connect() {
        try {
            await mongoose
                .connect(`${process.env['MONGO_URL']}`, {
                    serverSelectionTimeoutMS: 20000,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 30000
                })
                .then(() =>
                    this.client.logger.log(
                        LogLevel.INFO,
                        'Успешная загрузка всех сервисов'
                    )
                );
        } catch (error: any) {
            this.client.logger.log(
                LogLevel.WARN,
                `Ошибка подключения к базе данных\n${error.stack ?? error}`
            );
            return;
        }
    }
}
