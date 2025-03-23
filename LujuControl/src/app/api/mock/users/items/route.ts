import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/users/items
 */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const queryParams = Object.fromEntries(url.searchParams.entries());

	// Query Supabase for users_items table
	const { data: items, error } = await supabase
		.from('users')	// Your table name
		.select('*')	// Select all columns
		.match(queryParams);	// Match query params to filter the data

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(items), { status: 200 });
}

/**
 * POST api/users/items
 */
export async function POST(req: Request) {
	const insertData = (await req.json()) as Tables<'users'>;	// Parse the incoming JSON

	
	// Add the current datetime to the `created_at` field
	insertData.created_at = new Date().toISOString();
	// Insert the new users item into the 'users_items' table
	const { error } = await supabase
		.from('users')	// Your table name
		.insert([insertData]);	// Insert the new users item

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(insertData), { status: 201 });
}
