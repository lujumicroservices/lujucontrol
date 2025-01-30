import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Members, MembersEmail, MembersPhoneNumber } from '../MembersApi';

/**
 * The contact phone number model.
 */
export const MembersPhoneModel = (data: PartialDeep<MembersPhoneNumber> | null): MembersPhoneNumber =>
	_.defaults(data || {}, {
		country: '',
		phoneNumber: '',
		label: ''
	});

/**
 * The contact email model.
 */
export const MembersEmailModel = (data: Partial<MembersEmail> | null): MembersEmail =>
	_.defaults(data || {}, {
		email: '',
		label: ''
	});

/**
 * The contact model.
 */
const MembersModel = (data: PartialDeep<Members>): Members =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		avatar: '',
		background: '',
		name: '',
		emails: [MembersEmailModel(null)],
		phoneNumbers: [MembersPhoneModel(null)],
		title: '',
		company: '',
		birthday: '',
		address: '',
		notes: '',
		tags: []
	});

export default MembersModel;
