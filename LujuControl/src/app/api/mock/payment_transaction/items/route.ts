import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);



export async function GET(req: Request) {
	try {
		// Parse query parameters for filtering
		const url = new URL(req.url);
		const queryParams = Object.fromEntries(url.searchParams.entries());

		// Fetch players, apply filters dynamically
		let playerQuery = supabase.from('player').select('id, first_name, last_name');

		if (queryParams.team_name) {
			playerQuery = playerQuery.eq('team_name', queryParams.team_name);
		}

		if (queryParams.position) {
			playerQuery = playerQuery.eq('position', queryParams.position);
		}

		const { data: players, error: playersError } = await playerQuery;

		if (playersError) {
			throw new Error(playersError.message);
		}

		// Fetch payment transactions
		const { data: payments, error: paymentsError } = await supabase
			.from('payment_transaction')
			.select('player_id, billing_period, payment_date, due_date, status');

		if (paymentsError) {
			throw new Error(paymentsError.message);
		}

		// Map players and determine payment status
		const playerPaymentStatus = players.map((player) => {
			const playerPayments = payments.filter((p) => p.player_id === player.id);

			// If no payments, mark as "No Payments"
			if (playerPayments.length === 0) {
				return {
					player_id: player.id,
					player_name: `${player.first_name} ${player.last_name}`,
					last_billing_period: 'No Payments',
					last_payment_date: 'No Payments',
					payment_status: 'No Payments'
				};
			}

			// Get the latest payment transaction
			const latestPayment = playerPayments.reduce((latest, current) => {
				return new Date(current.payment_date) > new Date(latest.payment_date) ? current : latest;
			});

			// Determine payment status
			let payment_status = 'Delayed';

			if (latestPayment.status === 'completed') {
				const dueDate = new Date(latestPayment.due_date);
				const paymentDate = new Date(latestPayment.payment_date);
				payment_status = paymentDate <= dueDate ? 'Up to Date' : 'Late Payment';
			}

			return {
				player_id: player.id,
				player_name: `${player.first_name} ${player.last_name}`,
				last_billing_period: latestPayment.billing_period,
				last_payment_date: latestPayment.payment_date,
				payment_status,
			};
		});

		return new Response(JSON.stringify(playerPaymentStatus), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
}



/**
 * POST api/payment_transaction/items
 */
export async function POST(req: Request) {
	
	const insertData = (await req.json()) as Tables<'payment_transaction'>;	// Parse the incoming JSON

	
	// Add the current datetime to the `created_at` field
	insertData.created_at = new Date().toISOString();
	// Insert the new payment_transaction item into the 'payment_transaction_items' table
	const { error } = await supabase
		.from('payment_transaction')	// Your table name
		.insert([insertData]);	// Insert the new payment_transaction item

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify(insertData), { status: 201 });
}