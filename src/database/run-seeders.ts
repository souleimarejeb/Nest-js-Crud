import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './config';
import { MainSeeder } from './seeders/main.seeder';

async function runAllSeeders() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('Data source has been initialized');

    // Run seeders
    await runSeeders(AppDataSource, {
      seeds: [MainSeeder],
    });
    console.log('Seeders have been executed successfully');

    // Close the connection
    await AppDataSource.destroy();
    console.log('Connection has been closed');
  } catch (error) {
    console.error('Error during seeding', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

runAllSeeders();