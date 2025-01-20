import { Knex } from 'knex';
import fetch from 'node-fetch'; 
import * as dotenv from 'dotenv';

dotenv.config();

export async function up(knex: Knex): Promise<void> {
    const dataUrl = process.env.STATE_CITY_COUNTRY_URL;
    if (!dataUrl) {
        throw new Error('STATE_CITY_COUNTRY_URL is not defined in the .env file');
    }

    const response = await fetch(dataUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from URL: ${dataUrl}`);
    }

    const countriesData = await response.json();

    const countryBatchSize = 100; // Number of records to insert per batch
    const stateBatchSize = 500; // Number of records to insert per batch
    const cityBatchSize = 1000; // Number of records to insert per batch

    // Prepare data for batch insert
    const countries = countriesData.map((country: any) => ({
        id: country.id,
        country_name: country.name,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
    }));

    const states = countriesData.flatMap((country: any) =>
        country.states.map((state: any) => ({
            id: state.id,
            state_name: state.name,
            country_id: country.id,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        }))
    );

    const cities = countriesData.flatMap((country: any) =>
        country.states.flatMap((state: any) =>
            state.cities.map((city: any) => ({
                id: city.id,
                city_name: city.name,
                state_id: state.id,
                country_id: country.id,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            }))
        )
    );

    // Insert countries in batches
    await knex.batchInsert('country_master', countries, countryBatchSize);

    // Insert states in batches
    await knex.batchInsert('state_master', states, stateBatchSize);

    // Insert cities in batches
    await knex.batchInsert('city_master', cities, cityBatchSize);
}

export async function down(knex: Knex): Promise<void> {
    await knex('city_master').del();
    await knex('state_master').del();
    await knex('country_master').del();
}
