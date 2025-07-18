# Seeders and Migrations Implementation

## 1.Seeders : 
n NestJS, seeders are classes responsible for populating your database with initial, default, or mock data.
This process, called database seeding, is especially useful for:

Setting up development or test environments with sample data.

Creating default admin users, roles, or settings.

In this guide, we’ll use typeorm-extension and @faker-js/faker to implement seeding with TypeORM.

###  Install dependencies

Run the following command to install the required development dependencies:

```ts
npm install -D typeorm-seeding @faker-js/faker 

```
###  Create the Main Seeder
We create a main seeder class that will orchestrate all individual entity seeders.

File: src/database/seeders/main.seeder.ts

```ts
import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import UserSeeder from './user.seeder';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, UserSeeder)
  }
}
```

###  Create the Main Seeder
Next, create a seeder specific to an entity — in this example, the User entity

File: src/database/seeders/user.seeder.ts

```ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserEntity } from '../models/user.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(UserEntity);

        const data = {
            name: 'admin',
            last_name: 'admin',
            email: 'admin@gmail.com',
            phone: '55555555',
        };

        const user = await repository.findOneBy({ email: data.email });

        // Insert only one record with this username.
        if (!user) {
            await repository.insert([data]);
        }
    }

}

```
This ensures only one record with this email exists, making it idempotent.


### Run Seeders
Finally, configure the global seeding logic.

File: src/database/run-seeders.ts

```ts
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
```


### Add NPM Script

now add this to your package.json : 

```ts
  "scripts": {
     "seed": "ts-node -r tsconfig-paths/register src/database/run-seeders.ts"
  }
```

### Run the Seeders

Run the seeders with:

```ts
    npm run seed 
```






