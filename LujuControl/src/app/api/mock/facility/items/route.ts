import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/facility/items
 */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const queryParams = Object.fromEntries(url.searchParams.entries());

	// Query Supabase for facility_items table
	const { data: items, error } = await supabase
		.from('facility')	// Your table name
		.select('*')	// Select all columns
		.match(queryParams);	// Match query params to filter the data

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(items), { status: 200 });
}

/**
 * POST api/facility/items
 */
export async function POST(req: Request) {
	const requestData = (await req.json()) as Tables<'facility'>;	// Parse the incoming JSON

	// Remove the `id` field if present (to allow auto-increment behavior)
	const { id, ...insertData } = requestData;

	// Add the current datetime to the `created_at` field
	insertData.created_at = new Date().toISOString();
	// Insert the new facility item into the 'facility_items' table
	const { data: newItem, error } = await supabase
		.from('facility')	// Your table name
		.insert([insertData]);	// Insert the new facility item

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(newItem), { status: 201 });
}
