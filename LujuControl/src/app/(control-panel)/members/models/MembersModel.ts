import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Members } from '../MembersApi';


/**
 * The member model.
 */
const MembersModel = (data: PartialDeep<Members>): Members =>
	_.defaults(data || {}, {
		address_line_1: '',
		address_line_2: '',
		birthdate: '',
		city: '',
		country: '',
		email: '',
		end_date: '',
		first_name: '',
		start_date: '',
		last_name: '',
		membership_id: null,
		phone: '',
		postal_code: '',
		state: '',
		created_at: '',
		id: '',
		updated_at: ''
	});


export default MembersModel;
