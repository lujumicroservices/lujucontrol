import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Violation } from '../ViolationApi';

/**
 * The violation model.
 */
const ViolationModel = (data: PartialDeep<Violation>): Violation =>
	_.defaults(data || {}, {
		property_id: ,
		violation_type: ,
		description: ,
		status: ,
	});

export default ViolationModel;