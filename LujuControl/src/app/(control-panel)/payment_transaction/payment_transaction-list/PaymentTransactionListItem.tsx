import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { PaymentTransaction } from '../PaymentTransactionApi';

type PaymentTransactionListItemPropsType = {
	payment_transaction: PaymentTransaction;
};

/**
 * The payment_transaction list item.
 */
function PaymentTransactionListItem(props: PaymentTransactionListItemPropsType) {
	const { payment_transaction } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/payment_transaction/${ payment_transaction.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ payment_transaction.amount }
																		
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ payment_transaction.amount }
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary">
							{ payment_transaction.player_id },{ payment_transaction.amount },{ payment_transaction.billing_period },{ payment_transaction.due_date },{ payment_transaction.status }										    
						</Typography>
					}
				/>				
			</ListItemButton>
			<Divider />
		</>
	);
}

export default PaymentTransactionListItem;