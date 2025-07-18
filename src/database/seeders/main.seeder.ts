import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import UserSeeder from './user.seeder';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, UserSeeder)
  }
}