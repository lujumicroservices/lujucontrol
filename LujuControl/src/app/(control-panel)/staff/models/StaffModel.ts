import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Staff } from '../StaffApi';


/**
 * The staff model.
 */
const StaffModel = (data: PartialDeep<Staff>): Staff =>
	_.defaults(data || {}, {
		address_line_1: '',
		address_line_2: '',
		birthdate: null,
		city: '',
		country: '',
		created_at: null,
		email: '',
		first_name: '',
		id: null,
		last_name: '',
		phone: '',
		postal_code: '',
		role: '',
		schedule: null,
		state: '',
		updated_at: null
	});

export default StaffModel;
