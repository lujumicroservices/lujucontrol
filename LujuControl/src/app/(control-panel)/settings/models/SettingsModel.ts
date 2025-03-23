import { v4 as uuidv4 } from 'uuid';
import { PartialDeep } from 'type-fest';
import { Settings } from '../SettingsApi';
import _ from 'lodash';

/**
 * The settings model.
 */
const SettingsModel = (data: PartialDeep<Settings>): Settings =>
	_.defaults(data || {}, {
		id: uuidv4(),
		description: '',
		monthly_cost: 0,
		annual_cost: 0,
		default_payment_due_day: 0,
		max_late_days: 0,
		late_fee_percentage: 0,
		created_at: null,
		updated_at: null,
	});

export default SettingsModel;
