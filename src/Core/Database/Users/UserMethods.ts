import UserModel from '@core/Database/Users/UserModel';

export class Users {
    public async findUserById(userId: number) {
        let db = await UserModel.findOne({
            user: userId
        });

        if (!db)
            db = await UserModel.create({
                user: userId
            });

        return db;
    }

    public async findUserByThreadId(threadId: number) {
        return UserModel.findOne({
            threadId: threadId
        });
    }
}
