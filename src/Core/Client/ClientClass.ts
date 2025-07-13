import { Telegraf, Context } from 'telegraf';
import { Database } from '@db/Database';
import LoggerService from '@services/Logger';

export class Client {
    public readonly bot: Telegraf<Context>;
    public readonly db: Database;
    public readonly logger: LoggerService;

    constructor() {
        this.bot = new Telegraf<Context>(`${process.env['BOT_TOKEN']}`);
        this.db = new Database(this);
        this.logger = new LoggerService();
    }
}
