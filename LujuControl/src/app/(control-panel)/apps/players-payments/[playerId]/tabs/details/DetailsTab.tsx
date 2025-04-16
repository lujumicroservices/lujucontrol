import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'next/navigation';
import { useGetPlayerPaymentsListQuery, usePayPlayerBillingPeriodMutation } from '../../../PaymentTransactionApi';

/**
 * The order details tab.
 */
function DetailsTab() {
	const routeParams = useParams();
	const { playerId } = routeParams as { playerId: string };

	const { data: paymentHistory, isError } = useGetPlayerPaymentsListQuery({
		player_id: playerId,
		start_date: '2025-01-01'
	});

	const [selectedPayment, setSelectedPayment] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const openPayModal = (payment) => {
		setSelectedPayment(payment);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedPayment(null);
	};

	const [payPlayerBillingPeriod, { isLoading: isPaying }] = usePayPlayerBillingPeriodMutation();
	const [paidAmount, setPaidAmount] = useState<number>(selectedPayment?.total_due || 0);

	useEffect(() => {
		if (selectedPayment) {
			setPaidAmount(selectedPayment.total_due);
		}
	}, [selectedPayment]);

	const handlePayment = async (paidAmount: number) => {
		try {
			await payPlayerBillingPeriod({
				player_id: playerId, // ← Use from route param
				billing_period: selectedPayment.billing_period,
				paid_amount: paidAmount
			}).unwrap();
	
			closeModal();
		} catch (err) {
			console.error('Payment failed:', err);
		}
	};

	if (!isError && !paymentHistory) {
		return null;
	}

	return (
		<div className="w-full max-w-7xl mx-auto p-8 space-y-8">
			<div className="space-y-4">
				<div className="flex items-center border-b pb-2 space-x-2">
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:calendar
					</FuseSvgIcon>
					<Typography
						className="text-2xl"
						color="text.secondary"
					>
						Payment History
					</Typography>
				</div>

				<div className="table-responsive border rounded-md overflow-auto">
					<table className="simple dense w-full text-left">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-4 font-semibold">Billing Period</th>
								<th className="p-4 font-semibold">Amount Paid</th>
								<th className="p-4 font-semibold">Monthly Cost</th>
								<th className="p-4 font-semibold">Late Fee</th>
								<th className="p-4 font-semibold">Total Due</th>
								<th className="p-4 font-semibold">Due Date</th>
								<th className="p-4 font-semibold">Payment Status</th>
								<th className="p-4 font-semibold">Action</th>
							</tr>
						</thead>
						<tbody>
							{paymentHistory.map((item) => (
								<tr
									key={item.billing_period}
									className="border-t"
								>
									<td className="p-4">{item.billing_period}</td>
									<td className="p-4">${item.amount.toFixed(2)}</td>
									<td className="p-4">${item.monthly_cost.toFixed(2)}</td>
									<td className="p-4">${item.late_fee.toFixed(2)}</td>
									<td className="p-4">${item.total_due.toFixed(2)}</td>
									<td className="p-4">{item.due_date}</td>
									<td className="p-4">
										<span
											className={`px-2 py-1 rounded text-sm font-medium ${
												item.payment_status === 'paid'
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}
										>
											{item.payment_status}
										</span>
									</td>
									<td className="p-4">
										{item.payment_status === 'unpaid' && (
											<button
												className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
												onClick={() => openPayModal(item)}
											>
												Pay
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal */}
			{showModal && selectedPayment && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
						<h2 className="text-xl font-semibold mb-4">Pay for {selectedPayment.billing_period}</h2>

						<div className="space-y-2 text-sm">
							<p>
								<strong>Monthly Cost:</strong> ${selectedPayment.monthly_cost.toFixed(2)}
							</p>
							<p>
								<strong>Late Fee:</strong> ${selectedPayment.late_fee.toFixed(2)}
							</p>
							<p>
								<strong>Total Due:</strong>{' '}
								<span className="text-lg font-bold text-red-600">
									${selectedPayment.total_due.toFixed(2)}
								</span>
							</p>

							{/* Input for paid amount */}
							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
								<input
									type="number"
									step="0.01"
									className="w-full border rounded px-3 py-2"
									value={paidAmount}
									onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
									min={0}
									max={selectedPayment.total_due}
								/>
							</div>
						</div>

						<div className="mt-6 flex justify-end gap-2">
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								onClick={() => handlePayment(paidAmount)}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
								disabled={isPaying || paidAmount <= 0}
							>
								{isPaying ? 'Paying...' : 'Confirm Payment'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default DetailsTab;
