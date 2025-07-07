import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    // await runSeeder(dataSource, UsersSeeder);
  }
}