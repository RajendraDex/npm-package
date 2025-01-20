export interface ORM {
	getName(): string;
	getModelTemplate(): string;
	getConnectionTemplate(connectionString: string): string;
}

export class Mongoose implements ORM {
	getName() {
		return 'Mongoose';
	}
	getModelTemplate() {
		return `
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

export const User = mongoose.model('User', userSchema);
`;
	}
	getConnectionTemplate(connectionString: string) {
		return `
import mongoose from 'mongoose';

export const connectDatabase = async () => {
  await mongoose.connect('${connectionString}');
  console.log('Connected to the database');
};
`;
	}
}

export class Prisma implements ORM {
	getName() {
		return 'Prisma';
	}
	getModelTemplate() {
		return `
// This goes in prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  age   Int
}
`;
	}
	getConnectionTemplate(connectionString: string) {
		return `
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
  await prisma.$connect();
  console.log('Connected to the database');
};
`;
	}
}

export class Knex implements ORM {
	getName() {
		return 'Knex.js';
	}
	getModelTemplate() {
		return `
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.integer('age').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
`;
	}
	getConnectionTemplate(connectionString: string) {
		return `
import knex from 'knex';

const db = knex({
  client: 'YOUR_DB_CLIENT',
  connection: '${connectionString}',
});

export const connectDatabase = async () => {
  await db.raw('SELECT 1');
  console.log('Connected to the database');
};
`;
	}
}

export class Sequelize implements ORM {
	getName() {
		return 'Sequelize';
	}
	getModelTemplate() {
		return `
import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public age!: number;
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'users',
  });
};
`;
	}
	getConnectionTemplate(connectionString: string) {
		return `
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('${connectionString}');

export const connectDatabase = async () => {
  await sequelize.authenticate();
  console.log('Connected to the database');
};
`;
	}
}

export class TypeORM implements ORM {
	getName() {
		return 'TypeORM';
	}
	getModelTemplate() {
		return `
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;
}
`;
	}
	getConnectionTemplate(connectionString: string) {
		return `
import { createConnection } from 'typeorm';
import { User } from './User';

export const connectDatabase = async () => {
  await createConnection({
    type: 'YOUR_DB_TYPE',
    url: '${connectionString}',
    entities: [User],
    synchronize: true,
  });
  console.log('Connected to the database');
};
`;
	}
}

