'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/{{moduleName}}Form';

function {moduleName}}Page() {
	const { {{moduleNameLower}}Id } = useParams<{ {{moduleNameLower}}Id: string }>();

	if ({{moduleNameLower}}Id === 'new') {
		return <{{moduleName}}Form isNew />;
	}

	redirect(`/{{moduleNameLower}}/${staffId}/view`);

	return null;
}

export default {{moduleName}}Page;
