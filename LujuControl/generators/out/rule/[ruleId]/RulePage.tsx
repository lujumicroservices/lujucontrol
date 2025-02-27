'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/RuleForm';

function {moduleName}}Page() {
	const { ruleId } = useParams<{ ruleId: string }>();

	if (ruleId === 'new') {
		return <RuleForm isNew />;
	}

	redirect(`/rule/${staffId}/view`);

	return null;
}

export default RulePage;
