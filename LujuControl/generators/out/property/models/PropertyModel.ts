import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Property } from '../PropertyApi';

/**
 * The property model.
 */
const PropertyModel = (data: PartialDeep<Property>): Property =>
	_.defaults(data || {}, {
		address: ,
		unit_number: ,
		size: ,
		type: ,
		owner_id: ,
	});

export default PropertyModel;