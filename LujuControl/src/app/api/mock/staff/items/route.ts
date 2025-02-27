import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/staff/items
 */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const queryParams = Object.fromEntries(url.searchParams.entries());

	// Query Supabase for staff_items table
	const { data: items, error } = await supabase
		.from('staff')	// Your table name
		.select('*')	// Select all columns
		.match(queryParams);	// Match query params to filter the data

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(items), { status: 200 });
}

/**
 * POST api/staff/items
 */
export async function POST(req: Request) {
	const requestData = (await req.json()) as Tables<'staff'>;	// Parse the incoming JSON

	// Remove the `id` field if present (to allow auto-increment behavior)
	const { id, ...insertData } = requestData;

	// Add the current datetime to the `created_at` field
	insertData.created_at = new Date().toISOString();
	// Insert the new staff item into the 'staff_items' table
	const { data: newItem, error } = await supabase
		.from('staff')	// Your table name
		.insert([insertData]);	// Insert the new staff item

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(newItem), { status: 201 });
}
