import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params;

	const { searchParams } = new URL(req.url);
	const startDateParam = searchParams.get('start_date');

	if (!startDateParam) {
		return new Response(JSON.stringify({ message: 'Missing start_date query param' }), { status: 400 });
	}

	const start = dayjs(startDateParam).startOf('month');
	const end = dayjs().startOf('month');

	if (!start.isValid()) {
		return new Response(JSON.stringify({ message: 'Invalid start_date format' }), { status: 400 });
	}

	// 1. Fetch settings
	const { data: settingsData, error: settingsError } = await supabase
		.from('settings')
		.select('monthly_cost, max_late_days, late_fee_percentage')
		.limit(1)
		.single();

	if (settingsError || !settingsData) {
		console.error('Settings fetch error:', settingsError);
		return new Response(JSON.stringify({ message: 'Settings not found' }), { status: 500 });
	}

	const monthlyCost = parseFloat(settingsData.monthly_cost || '0');
	const maxLateDays = parseInt(settingsData.max_late_days || '0');
	const lateFeePct = parseFloat(settingsData.late_fee_percentage || '0');

	// 2. Generate month series
	const months: string[] = [];
	let current = start.clone();
	while (current.isSameOrBefore(end)) {
		months.push(current.format('YYYY-MM'));
		current = current.add(1, 'month');
	}

	// 3. Fetch actual transactions for the player
	const { data: payments, error } = await supabase
		.from('payment_transaction')
		.select('player_id, billing_period, amount')
		.eq('player_id', id)
		.gte('billing_period', start.format('YYYY-MM'));

	if (error) {
		console.error('Supabase error:', error);
		return new Response(JSON.stringify({ message: 'Error fetching transactions' }), { status: 500 });
	}

	const actualMap = new Map((payments ?? []).map((p) => [dayjs(p.billing_period).format('YYYY-MM'), p.amount]));

	// 4. Merge logic
	const now = dayjs();
	const result = months.map((month) => {
		const paymentAmount = actualMap.get(month) || 0;
		const isPaid = actualMap.has(month);
		const billingDate = dayjs(`${month}-01`);
		const dueDate = billingDate.add(maxLateDays, 'day');
		const isLate = !isPaid && now.isAfter(dueDate);
		const lateFee = isLate ? (monthlyCost * lateFeePct) / 100 : 0;
		const totalDue = monthlyCost + lateFee;

		return {
			id,
			billing_period: month,
			amount: isPaid ? paymentAmount : 0,
			payment_status: isPaid ? 'paid' : 'unpaid',
			due_date: dueDate.format('YYYY-MM-DD'),
			monthly_cost: monthlyCost,
			late_fee: lateFee,
			total_due: totalDue
		};
	});

	return new Response(JSON.stringify(result), { status: 200 });
}

/**
 * POST /api/mock/payment_transaction/player/[player_id]
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
	try {
		const { billing_period, paid_amount } = await req.json();
		const { id } = params;

		if (!id || !billing_period || typeof paid_amount !== 'number') {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
		}

		// Fetch any additional info you may need, e.g., monthly_cost or late_fee
		// Or hardcode/simulate it for mock/demo purposes:
		const monthly_cost = 50; // you can replace this with a lookup or logic
		const late_fee = Math.max(0, paid_amount - monthly_cost); // adjust logic as needed

		const paymentData = {
			player_id: id,
			billing_period,
			amount: paid_amount,
			late_fee,
			payment_date: new Date().toISOString(),
			due_date: new Date().toISOString(), // optional: set from billing_period if you have that logic
			status: 'paid',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		const { data, error } = await supabase.from('payment_transaction').insert([paymentData]).select().single();

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500 });
		}

		return new Response(JSON.stringify(data), { status: 201 });
	} catch (err: any) {
		return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), { status: 500 });
	}
}
