import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Paper,
    Typography,
    Divider,
    Button,
    Box,
    Grid,
    TextField
} from "@mui/material";

import MainLayout from "../../layouts/MainLayout";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseItemGrid from "./PurchaseItemGrid";
import PurchaseSummary from "./PurchaseSummary";
import {
    createPurchase,
    getPurchase,
    updatePurchase,
    recordPurchasePayment
} from "../../api/purchaseApi";

const emptyPurchase = {

    purchase_no: "",

    purchase_date: new Date()
        .toISOString()
        .substring(0, 10),

    supplier_id: "",

    invoice_no: "",

    invoice_date: new Date()
        .toISOString()
        .substring(0, 10),

    paid_amount: 0,

    pending_amount: 0,

    payment_status: "PENDING",

    remarks: ""

};

export default function PurchaseEntry() {

    const { id } = useParams();

    const isEdit = !!id;

    const [purchase, setPurchase] = useState(emptyPurchase);

    const [items, setItems] = useState([]);

    const [paymentHistory, setPaymentHistory] = useState([]);

    const [payment, setPayment] = useState({
        payment_date: new Date().toISOString().substring(0, 10),
        amount: 0,
        payment_mode: "",
        reference_no: "",
        remarks: ""
    });

    const [isRecordingPayment, setIsRecordingPayment] = useState(false);

    const navigate = useNavigate();

    const getEffectiveGrandTotal = (purchaseData) => {

        const itemRows = Array.isArray(purchaseData?.items)
            ? purchaseData.items
            : [];

        const itemGrandTotal = Number(
            itemRows.reduce(
                (total, row) => total + Number(row.total_amount || 0),
                0
            ).toFixed(2)
        );

        if (itemGrandTotal > 0) {
            return itemGrandTotal;
        }

        return Number(purchaseData?.grand_total || 0);

    };

    const summarizePayments = (purchaseData, payments) => {

        const grandTotal = getEffectiveGrandTotal(purchaseData);

        const paidAmount = Number(
            (payments || []).reduce(
                (total, row) => total + Number(row.amount || 0),
                0
            ).toFixed(2)
        );

        const pendingAmount = Number(
            Math.max(grandTotal - paidAmount, 0).toFixed(2)
        );

        let paymentStatus = "PENDING";

        if (paidAmount > 0 && pendingAmount === 0) {
            paymentStatus = "PAID";
        }
        else if (paidAmount > 0) {
            paymentStatus = "PARTIAL";
        }

        return {
            paidAmount,
            pendingAmount,
            paymentStatus
        };

    };

    useEffect(() => {

        if (isEdit) {
            loadPurchase();
        }

    }, [isEdit, id]);

    const loadPurchase = async () => {

        try {

            const data = await getPurchase(id);

            const payments = Array.isArray(data.payments)
                ? data.payments
                : [];

            const paymentSummary = summarizePayments(data, payments);

            setPurchase({
                purchase_no: data.purchase_no || "",
                purchase_date: data.purchase_date || emptyPurchase.purchase_date,
                supplier_id: data.supplier_id || "",
                invoice_no: data.invoice_no || "",
                invoice_date: data.invoice_date || emptyPurchase.invoice_date,
                paid_amount: paymentSummary.paidAmount,
                pending_amount: paymentSummary.pendingAmount,
                payment_status: paymentSummary.paymentStatus,
                remarks: data.remarks || ""
            });

            setItems(Array.isArray(data.items) ? data.items : []);

            setPaymentHistory(payments);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load purchase.");

        }

    };

    const handleChange = (e) => {

        const { name, value, type } = e.target;

        setPurchase(prev => ({
            ...prev,
            [name]: type === "number"
                ? Number(value)
                : value
        }));

    };

    const handlePaymentChange = (e) => {

        const { name, value, type } = e.target;

        setPayment(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));

    };

    const loadPaymentHistory = async () => {

        try {

            const data = await getPurchase(id);

            const payments = Array.isArray(data.payments)
                ? data.payments
                : [];

            const paymentSummary = summarizePayments(data, payments);

            setPaymentHistory(payments);

            setPurchase(prev => ({
                ...prev,
                payment_status: paymentSummary.paymentStatus,
                paid_amount: paymentSummary.paidAmount,
                pending_amount: paymentSummary.pendingAmount
            }));

        }
        catch (err) {

            console.error(err);

        }

    };

    const handleRecordPayment = async () => {

        if (isRecordingPayment) {
            return;
        }

        setIsRecordingPayment(true);

        try {

            if (!payment.amount || payment.amount <= 0) {
                alert("Enter a valid payment amount.");
                return;
            }

            // Ensure backend totals are aligned with current edited line items
            // before validating pending amount for payment.
            await updatePurchase(id, {
                ...purchase,
                items
            });

            const response = await recordPurchasePayment(id, payment);

            await loadPaymentHistory();

            setPurchase(prev => ({
                ...prev,
                payment_status: response.payment_summary?.payment_status || prev.payment_status,
                paid_amount: response.payment_summary?.paid_amount || prev.paid_amount,
                pending_amount: response.payment_summary?.pending_amount || prev.pending_amount
            }));

            setPayment(prev => ({
                ...prev,
                amount: 0,
                remarks: "",
                reference_no: "",
                payment_mode: ""
            }));

            const receiptNo = response?.payment_summary?.receipt_no;
            alert(
                receiptNo
                    ? `Payment recorded successfully. Receipt: ${receiptNo}`
                    : "Payment recorded successfully."
            );

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to record payment.");

        }
        finally {

            setIsRecordingPayment(false);

        }

    };

    const handleSave = async () => {

        try {

            const payload = {

                ...purchase,

                items

            };

            console.log(payload);
            
            if (isEdit) {

                const response = await updatePurchase(id, payload);

                alert(response.message);

                navigate(`/purchase/${id}`);

            }
            else {

                const response = await createPurchase(payload);

                alert(response.message);

                if (response.purchase_id) {

                    navigate(`/purchase/${response.purchase_id}`);

                }

            }

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to save purchase.");

        }

    };

    return (

        <MainLayout>

            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    {isEdit ? "Edit Purchase" : "Purchase Entry"}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <PurchaseHeader
                    purchase={purchase}
                    onChange={handleChange}
                />
                
                <PurchaseItemGrid
                    items={items}
                    setItems={setItems}
                />

                <PurchaseSummary
                    items={items}
                />

                {isEdit && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Payment History
                        </Typography>

                        {paymentHistory.length === 0 ? (
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                No payment entries recorded yet.
                            </Typography>
                        ) : (
                            <Box sx={{ overflowX: "auto", mb: 3 }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse"
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th align="left">Receipt</th>
                                            <th align="left">Date</th>
                                            <th align="right">Amount</th>
                                            <th align="left">Mode</th>
                                            <th align="left">Reference</th>
                                            <th align="left">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((entry) => (
                                            <tr key={entry.payment_id}>
                                                <td>{entry.receipt_no || "-"}</td>
                                                <td>{entry.payment_date}</td>
                                                <td align="right">₹ {Number(entry.amount || 0).toFixed(2)}</td>
                                                <td>{entry.payment_mode || "-"}</td>
                                                <td>{entry.reference_no || "-"}</td>
                                                <td>{entry.remarks || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        )}

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Record Purchase Payment
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Payment Date"
                                    type="date"
                                    name="payment_date"
                                    value={payment.payment_date}
                                    onChange={handlePaymentChange}
                                    disabled={isRecordingPayment}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Amount"
                                    name="amount"
                                    value={payment.amount}
                                    onChange={handlePaymentChange}
                                    disabled={isRecordingPayment}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Payment Mode"
                                    name="payment_mode"
                                    value={payment.payment_mode}
                                    onChange={handlePaymentChange}
                                    disabled={isRecordingPayment}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Reference No"
                                    name="reference_no"
                                    value={payment.reference_no}
                                    onChange={handlePaymentChange}
                                    disabled={isRecordingPayment}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    name="remarks"
                                    value={payment.remarks}
                                    onChange={handlePaymentChange}
                                    disabled={isRecordingPayment}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={handleRecordPayment}
                                    disabled={
                                        isRecordingPayment ||
                                        Number(purchase.pending_amount || 0) <= 0
                                    }
                                >
                                    {isRecordingPayment
                                        ? "Recording Payment..."
                                        : "Record Payment"}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}

                <Box
                    sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/purchases")}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                    >
                        Save Purchase
                    </Button>

                </Box>

            </Paper>

        </MainLayout>

    );

}