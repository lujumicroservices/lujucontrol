export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];


export type Member = {
	id: number;
	start_date: string;
	end_date: string;
	membership_id: number | null;
	person_id: number;
	person: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		address_line_1: string;
		address_line_2: string | null;
		birthdate: string;
		city: string;
		country: string;
		created_at: string | null;
		phone: string | null;
		postal_code: string;
		state: string;
		type: string;
		updated_at: string | null;
	};
};

export type Staff = {
	person_id: number;
	role: string;
	schedule: Json | null;
	person: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		address_line_1: string;
		address_line_2: string | null;
		birthdate: string;
		city: string;
		country: string;
		created_at: string | null;
		phone: string | null;
		postal_code: string;
		state: string;
		type: string;
		updated_at: string | null;
	};
};

export type SystemUser = {
	person_id: number;
	username: string;
	role: string;
	password_hash: string;
	person: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		address_line_1: string;
		address_line_2: string | null;
		birthdate: string;
		city: string;
		country: string;
		created_at: string | null;
		phone: string | null;
		postal_code: string;
		state: string;
		type: string;
		updated_at: string | null;
	};
};