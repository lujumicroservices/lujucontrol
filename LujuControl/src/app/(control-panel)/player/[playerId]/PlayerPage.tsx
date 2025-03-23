'use client';

import { redirect, useParams } from 'next/navigation';
import PlayerForm from '../player-form/PlayerForm';

function PlayerPage() {
	const { playerId } = useParams<{ playerId: string }>();

	if (playerId === 'new') {
		return <PlayerForm isNew />;
	}

	redirect(`/player/${ playerId}/view`);

	return null;
}

export default PlayerPage;
