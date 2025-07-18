import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserEntity } from '../models/user.entity';

export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(UserEntity);

        const data = {
            name: 'admin',
            last_name: 'admin',
            email: 'admin@gmail.com',
            phone: '5555555',
        };

        const user = await repository.findOneBy({ email: data.email });

        // Insert only one record with this username.
        if (!user) {
            await repository.insert([data]);
        }
    }
}