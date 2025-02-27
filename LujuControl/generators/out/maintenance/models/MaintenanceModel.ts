import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Maintenance } from '../MaintenanceApi';

/**
 * The maintenance model.
 */
const MaintenanceModel = (data: PartialDeep<Maintenance>): Maintenance =>
	_.defaults(data || {}, {
		property_id: ,
		issue_type: ,
		description: ,
		status: ,
	});

export default MaintenanceModel;