'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/FeeForm';

function {moduleName}}Page() {
	const { feeId } = useParams<{ feeId: string }>();

	if (feeId === 'new') {
		return <FeeForm isNew />;
	}

	redirect(`/fee/${staffId}/view`);

	return null;
}

export default FeePage;
