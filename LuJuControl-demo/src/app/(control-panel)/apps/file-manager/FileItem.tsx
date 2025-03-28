import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from 'src/store/hooks';
import ItemIcon from './ItemIcon';
import { FileManagerItem } from './FileManagerApi';
import { setSelectedItemId } from './fileManagerAppSlice';

type FileItemProps = {
	item: FileManagerItem;
};

/**
 * The file item.
 */
function FileItem(props: FileItemProps) {
	const { item } = props;

	const dispatch = useAppDispatch();

	if (!item) {
		return null;
	}

	return (
		<Box
			sx={{ backgroundColor: 'background.paper' }}
			className="flex flex-col relative w-full sm:w-40 h-40 m-2 p-4 shadow-sm rounded-xl cursor-pointer"
			onClick={() => dispatch(setSelectedItemId(item.id))}
		>
			<div className="flex flex-auto w-full items-center justify-center">
				<ItemIcon type={item.type} />
			</div>
			<div className="flex shrink flex-col justify-center text-center">
				<Typography className="truncate text-md font-medium">{item.name}</Typography>
				{item.contents && (
					<Typography
						className="truncate text-md font-medium"
						color="text.secondary"
					>
						{item.contents}
					</Typography>
				)}
			</div>
		</Box>
	);
}

export default FileItem;
