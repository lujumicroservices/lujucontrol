import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Fee } from '../FeeApi';

/**
 * The fee model.
 */
const FeeModel = (data: PartialDeep<Fee>): Fee =>
	_.defaults(data || {}, {
		property_id: ,
		amount: ,
		due_date: ,
		status: ,
	});

export default FeeModel;