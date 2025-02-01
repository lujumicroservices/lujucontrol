import { createClient } from '@supabase/supabase-js';
import { Tables } from '@/@supabase/database.types';


// Initialize Supabase client with your project URL and anon key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * GET api/member/items/{id}
 */
export async function GET(req: Request, props: { params: Promise<{ id: number }> }) {
	const { id } = await props.params;

	const { data: item, error } = await supabase.from('members').select().eq('id', id).single();

	if (error || !item) {
		return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
	}

	return new Response(JSON.stringify(item), { status: 200 });
}

/**
 * PUT api/members/items/{id}
 */
export async function PUT(req: Request, props: { params: Promise<{ id: number }> }) {
	const { id } = await props.params;
	const data = (await req.json()) as Tables<'members'>;

	const { data: updatedItem, error } = await supabase
		.from('member') // Replace with your Supabase table name
		.update(data)
		.eq('id', id)
		.single();

	if (error || !updatedItem) {
		return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
	}

	return new Response(JSON.stringify(updatedItem), { status: 200 });
}

/**
 * DELETE api/members/items/{id}
 */
export async function DELETE(req: Request, props: { params: Promise<{ id: number }> }) {
	const { id } = await props.params;

	const { error } = await supabase
		.from('member') // Replace with your Supabase table name
		.delete()
		.eq('id', id);

	if (error) {
		return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
	}

	return new Response(JSON.stringify({ message: 'Deleted successfully' }), { status: 200 });
}
