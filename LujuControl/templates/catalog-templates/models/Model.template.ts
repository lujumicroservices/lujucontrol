import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { {{moduleName}} } from '../{{moduleName}}Api';

/**
 * The {{moduleNameLower}} model.
 */
const {{moduleName}}Model = (data: PartialDeep<{{moduleName}}>): {{moduleName}} =>
	_.defaults(data || {}, {
		{{#fields}}
		{{name}}: {{defaultValue}},
		{{/fields}}
	});

export default {{moduleName}}Model;