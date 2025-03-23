import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/{{moduleNameLower}}/items
 */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const queryParams = Object.fromEntries(url.searchParams.entries());

	// Query Supabase for {{moduleNameLower}}_items table
	const { data: items, error } = await supabase
		.from('{{moduleNameLower}}')	// Your table name
		.select('*')	// Select all columns
		.match(queryParams);	// Match query params to filter the data

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(items), { status: 200 });
}

/**
 * POST api/{{moduleNameLower}}/items
 */
export async function POST(req: Request) {
	const insertData = (await req.json()) as Tables<'{{moduleNameLower}}'>;	// Parse the incoming JSON

	
	// Add the current datetime to the `created_at` field
	insertData.created_at = new Date().toISOString();
	// Insert the new {{moduleNameLower}} item into the '{{moduleNameLower}}_items' table
	const { error } = await supabase
		.from('{{moduleNameLower}}')	// Your table name
		.insert([insertData]);	// Insert the new {{moduleNameLower}} item

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(insertData), { status: 201 });
}
