import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Facility } from '../FacilityApi';

/**
 * The facility model.
 */
const FacilityModel = (data: PartialDeep<Facility>): Facility =>
	_.defaults(data || {}, {
		name: ,
		type: ,
		capacity: ,
		rules: ,
	});

export default FacilityModel;