import { v4 as uuidv4 } from 'uuid';
import { PartialDeep } from 'type-fest';
import { Player } from '../PlayerApi';
import _ from 'lodash';

/**
 * The player model.
 */
const PlayerModel = (data: PartialDeep<Player>): Player =>
	_.defaults(data || {}, {
		id: uuidv4(),
		first_name: '',
		last_name: '',
		birth_date: null,
		jersey_number: 0,
		position: null,
		team_name: '',
		medical_conditions: '',
		created_at: null,
		updated_at: null,
	});

export default PlayerModel;
