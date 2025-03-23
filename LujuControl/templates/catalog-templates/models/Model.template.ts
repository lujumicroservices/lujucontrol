import { v4 as uuidv4 } from 'uuid';
import { PartialDeep } from 'type-fest';
import { {{moduleName}} } from '../{{moduleName}}Api';
import _ from 'lodash';

/**
 * The {{moduleNameLower}} model.
 */
const {{moduleName}}Model = (data: PartialDeep<{{moduleName}}>): {{moduleName}} =>
	_.defaults(data || {}, {
		id: uuidv4(),
		{{#fields}}
		{{name}}: {{#if (or (endsWith name "id") (endsWith name "_date") (endsWith name "_at"))}}null{{/if}}{{#if (eq type "string")}}{{#unless (or (endsWith name "id") (endsWith name "_date") (endsWith name "_at") )}}''{{/unless}}{{/if}}{{#if (eq type "number") }}0{{/if}}{{#if (eq type "boolean") }}false{{/if}}{{#if (eq type "select") }}null{{/if}},
		{{/fields}}
	});

export default {{moduleName}}Model;
