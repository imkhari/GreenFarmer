import { useParams, Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import { orderService } from "@/services/orderService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ReviewModal } from "@/components/common/ReviewModal";
import { CheckCircle2, XCircle, Star, QrCode, Sparkles } from "lucide-react";
import { useState } from "react";

export default function OrderDetailPage() {
    const { id } = useParams();
    const { data: order, loading, refetch } = useFetch(() => orderService.getById(Number(id)), [id]);
    const [confirming, setConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string } | null>(null);

    const confirmReceived = async () => {
        if (!order) return;
        setConfirming(true);
        try {
            await orderService.confirmReceived(order.id);
            refetch();
        } finally {
            setConfirming(false);
        }
    };

    const cancelOrder = async () => {
        if (!order) return;
        if (!window.confirm(`Bạn chắc chắn muốn hủy đơn hàng #${order.id}?`)) return;
        setCancelling(true);
        setError("");
        try {
            await orderService.cancel(order.id);
            refetch();
        } catch (err: any) {
            const m = err?.message;
            setError(Array.isArray(m) ? m.join(", ") : m ?? "Hủy đơn thất bại");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-muted-foreground">Đang tải...</div>;
    if (!order) return <div className="max-w-3xl mx-auto px-4 py-16 text-muted-foreground">Không tìm thấy đơn hàng.</div>;

    const isPending = order.status === "Pending";
    const isCompleted = order.status === "Completed";
    const canCancel = isPending && order.payment_status !== "Paid";
    const paidPending = isPending && order.payment_status === "Paid";

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <Link to="/orders" className="text-sm text-muted-foreground hover:text-primary transition">
                ← Đơn hàng của tôi
            </Link>

            <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-2xl font-bold">Đơn hàng #{order.id}</h1>
                <StatusBadge status={order.status} />
            </div>

            {/* Banner chúc mừng khi đơn hàng đã hoàn thành */}
            {isCompleted && (
                <div className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-100 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-sm flex-1">
                        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                            Đơn hàng đã hoàn thành thành công!
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Cảm ơn bạn đã lựa chọn nông sản sạch GreenFarmer. Bạn có thể để lại đánh giá cho từng sản phẩm dưới đây hoặc tra cứu lại nguồn gốc lô hàng.
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-6 bg-card border rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Thông tin nhận hàng</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                    <div>{order.receiver_name} · {order.receiver_phone}</div>
                    <div>{order.shipping_address}</div>
                    <div>Đặt ngày {formatDate(order.created_at)}</div>
                    {order.tracking_note && <div className="mt-2 p-3 rounded-lg bg-muted/50">{order.tracking_note}</div>}
                </div>
            </div>

            <div className="mt-4 bg-card border rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Sản phẩm trong đơn</h3>
                <div className="space-y-3">
                    {order.details?.map((d) => (
                        <div
                            key={d.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm border-b last:border-0 pb-3"
                        >
                            <div className="space-y-1">
                                <div className="font-medium text-foreground">
                                    {d.product_name ?? `Lô hàng #${d.batch_id}`}
                                    <span className="text-muted-foreground font-normal ml-2">× {d.quantity}</span>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    Mã lô: {d.batch_code ?? `#${d.batch_id}`}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center flex-wrap">
                                <span className="font-semibold text-foreground">
                                    {formatCurrency(d.price * d.quantity)}
                                </span>

                                {/* Nút tra cứu mã QR lô hàng */}
                                {(d.barcode || d.batch_code) && (
                                    <Link
                                        to={`/trace?code=${encodeURIComponent(d.barcode || d.batch_code || "")}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                        title="Tra cứu nguồn gốc lô hàng"
                                    >
                                        <QrCode className="w-3.5 h-3.5" />
                                        Nguồn gốc
                                    </Link>
                                )}

                                {/* Nút đánh giá khi đơn đã Hoàn thành */}
                                {isCompleted && d.product_id && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedProduct({
                                                id: d.product_id!,
                                                name: d.product_name ?? "Sản phẩm",
                                            })
                                        }
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold transition"
                                    >
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        Đánh giá
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatCurrency(order.total_price)}</span>
                </div>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-3">
                {(order.status === "Shipping" || order.status === "Delivered") && (
                    <button
                        onClick={confirmReceived}
                        disabled={confirming}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition shadow-sm"
                    >
                        <CheckCircle2 className="w-4 h-4" /> {confirming ? "Đang xác nhận..." : "Xác nhận đã nhận hàng"}
                    </button>
                )}

                {canCancel && (
                    <button
                        onClick={cancelOrder}
                        disabled={cancelling}
                        className="inline-flex items-center gap-2 border-2 border-destructive text-destructive px-6 py-3 rounded-xl font-semibold hover:bg-destructive/10 disabled:opacity-50 transition"
                    >
                        <XCircle className="w-4 h-4" /> {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                    </button>
                )}
            </div>

            {paidPending && (
                <p className="mt-3 text-xs text-muted-foreground">
                    Đơn này đã thanh toán online nên không thể tự hủy. Vui lòng liên hệ cửa hàng để được hoàn tiền.
                </p>
            )}

            {/* Modal popup viết đánh giá sản phẩm */}
            <ReviewModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                productId={selectedProduct?.id ?? 0}
                productName={selectedProduct?.name ?? ""}
                onSuccess={refetch}
            />
        </div>
    );
}