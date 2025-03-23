import { v4 as uuidv4 } from 'uuid';
import { PartialDeep } from 'type-fest';
import { Users } from '../UsersApi';
import _ from 'lodash';

/**
 * The users model.
 */
const UsersModel = (data: PartialDeep<Users>): Users =>
	_.defaults(data || {}, {
		id: uuidv4(),
		user_name: '',
		first_name: '',
		last_name: '',
		password: '',
		created_at: null,
		updated_at: null,
	});

export default UsersModel;
