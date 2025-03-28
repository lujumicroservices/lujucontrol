import Card from '@mui/material/Card';
import { lighten, styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import clsx from 'clsx';
import { useRef } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import _ from 'lodash';
import BoardAddCard from '../board-card/BoardAddCard';
import BoardCard from '../board-card/BoardCard';
import BoardListHeader from './BoardListHeader';
import { useGetScrumboardBoardListsQuery } from '../../../ScrumboardApi';

const StyledCard = styled(Card)(({ theme }) => ({
	'&': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	}
}));

type BoardListProps = {
	boardId: string;
	listId: string;
	cardIds: string[];
	index: number;
};

/**
 * The board list component.
 */
function BoardList(props: BoardListProps) {
	const { boardId, listId, cardIds, index } = props;

	const contentScrollEl = useRef<HTMLDivElement>(null);

	const { data: listItems } = useGetScrumboardBoardListsQuery(boardId);

	const list = _.find(listItems, { id: listId });

	function handleCardAdded() {
		if (contentScrollEl.current) {
			contentScrollEl.current.scrollTop = contentScrollEl.current.scrollHeight;
		}
	}

	if (!list) {
		return null;
	}

	return (
		<Draggable
			draggableId={listId}
			index={index}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<StyledCard
						sx={(theme) => ({
							backgroundColor: lighten(theme.palette.background.default, 0.02),
							...theme.applyStyles('light', {
								backgroundColor: lighten(theme.palette.background.default, 0.4)
							})
						})}
						className={clsx(
							snapshot.isDragging ? 'shadow-lg' : 'shadow-0',
							'w-64 sm:w-80 mx-2 max-h-full flex flex-col rounded-lg border'
						)}
						square
					>
						<BoardListHeader
							list={list}
							cardIds={cardIds}
							boardId={boardId}
							className="border-b-1"
							handleProps={provided.dragHandleProps}
						/>

						<CardContent
							className="flex flex-col flex-auto h-full min-h-0 w-full p-0 overflow-auto"
							ref={contentScrollEl}
						>
							<Droppable
								droppableId={listId}
								direction="vertical"
								type="card"
							>
								{(_provided) => (
									<div
										ref={_provided.innerRef}
										className="flex flex-col w-full h-full p-3 min-h-0.25"
									>
										{cardIds.map((cardId, index) => (
											<BoardCard
												key={cardId}
												cardId={cardId}
												boardId={boardId}
												index={index}
											/>
										))}
										{_provided.placeholder}
									</div>
								)}
							</Droppable>
						</CardContent>

						<div className="p-3">
							<BoardAddCard
								boardId={boardId}
								listId={listId}
								onCardAdded={handleCardAdded}
							/>
						</div>
					</StyledCard>
				</div>
			)}
		</Draggable>
	);
}

export default BoardList;
