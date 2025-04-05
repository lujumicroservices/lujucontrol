import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/payment_transaction/player/{player_id}
 * Fetch transactions for a specific player
 */
export async function GET(req: Request, props: { params: Promise<{ player_id: string }> }) {
	const { player_id } = await props.params;

	const { data: transactions, error } = await supabase
		.from('payment_transaction')
		.select()
		.eq('player_id', player_id);

	if (error || !transactions) {
		return new Response(JSON.stringify({ message: 'Transactions not found' }), { status: 404 });
	}

	return new Response(JSON.stringify(transactions), { status: 200 });
}



/**
 * PUT api/payment_transaction/items/{id}
 */
/*
export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params;
	const data = (await req.json()) as Tables<'payment_transaction'>;

	const { data: updatedItem, error } = await supabase
		.from('payment_transaction') // Replace with your Supabase table name
		.update(data)
		.eq('id', id)
		.select();

	if (error || !updatedItem) {
		return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
	}

	return new Response(JSON.stringify(updatedItem), { status: 200 });
}
*/
