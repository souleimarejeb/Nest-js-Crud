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

# Generating Migrations In NestJS

When working with TypeORM in NestJS, it’s common to set synchronize: true during development so that your database schema automatically matches your entities on each run.

However, this approach is risky in production or when altering existing tables, because it can lead to data loss if columns or tables are dropped.

Instead, you should use migrations.
Migrations act as checkpoints for your database schema: each migration records the changes to the schema,and you can apply or roll back these migrations as needed.


### Why use migrations?
✅ Safer than synchronize: true\
✅ Schema changes are version-controlled\
✅ You can undo (revert) or redo migrations\
✅ Keeps your production database stable\


## Getting Started

### 1.Add migrations configuration

In `src/database/config.ts`, make sure to add the migrations option and set synchronize to false. 

Example:

```ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Entities
import { UserEntity } from './models/user.entity';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT'), 10) || 3306,
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    UserEntity,
  ],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false, // disable auto sync
};

export const AppDataSource = new DataSource(dataSourceOptions);
```

### 2.Load TypeORM in your AppModule

In `src/modules/app/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { dataSourceOptions } from 'src/database/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
     TypeOrmModule.forRootAsync(dataSourceOptions),
     UserModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

```
☝️ TypeOrmModule.forRootAsync with useFactory is required when passing a plain DataSourceOptions object.


### 3.Add migration scripts

Add the following scripts to your package.json:

```ts
 "scripts": {

 "migration:generate": "typeorm-ts-node-commonjs migration:generate src/database/migrations/InitialMigration -d src/database/config.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d src/database/config.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/database/config.ts",
}
```

## Running Migration

To generate a new migration file based on entity changes:
```ts
npm run migration:generate
``` 

To apply all pending migrations:
```ts
npm run migration:run 
```


To revert the last applied migration:
```ts
npm run migration:revert
```


# Notes

Migrations are stored in src/database/migrations.

After running migration:generate, build the project (npm run build) so the dist folder is updated






