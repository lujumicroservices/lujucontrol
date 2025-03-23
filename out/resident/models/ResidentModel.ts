import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Resident } from '../ResidentApi';

/**
 * The resident model.
 */
const ResidentModel = (data: PartialDeep<Resident>): Resident =>
	_.defaults(data || {}, {
		first_name: ,
		last_name: ,
		email: ,
		phone: ,
		property_id: ,
		role: ,
	});

export default ResidentModel;