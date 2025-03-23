import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Maintenance } from '../MaintenanceApi';

/**
 * The maintenance model.
 */
const MaintenanceModel = (data: PartialDeep<Maintenance>): Maintenance =>
	_.defaults(data || {}, {
		id: null,
		property_id: null'',
		issue_type: '',
		description: '',
		status: '',
	});

export default MaintenanceModel;
