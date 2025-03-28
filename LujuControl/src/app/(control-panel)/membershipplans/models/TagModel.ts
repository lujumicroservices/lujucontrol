import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Tag } from '../MembershipPlanApi';

/**
 * The tag model.
 */
const TagModel = (data: PartialDeep<Tag>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		title: ''
	});

export default TagModel;
