import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/settings/items
 */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const queryParams = Object.fromEntries(url.searchParams.entries());

	// Query Supabase for settings_items table
	const { data: items, error } = await supabase
		.from('settings')	// Your table name
		.select('*')	// Select all columns
		.match(queryParams);	// Match query params to filter the data

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(items), { status: 200 });
}

/**
 * POST api/settings/items
 */
export async function POST(req: Request) {
	const insertData = (await req.json()) as Tables<'settings'>;	// Parse the incoming JSON

	
	// Add the current datetime to the `created_at` field
	insertData.created_at = new Date().toISOString();
	// Insert the new settings item into the 'settings_items' table
	const { error } = await supabase
		.from('settings')	// Your table name
		.insert([insertData]);	// Insert the new settings item

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(insertData), { status: 201 });
}
