import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Rule } from '../RuleApi';

/**
 * The rule model.
 */
const RuleModel = (data: PartialDeep<Rule>): Rule =>
	_.defaults(data || {}, {
		title: ,
		description: ,
		category: ,
	});

export default RuleModel;