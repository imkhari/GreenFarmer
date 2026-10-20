import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { paymentService } from "@/services/paymentService";

export default function PaymentResultPage() {
    const location = useLocation();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);

    useEffect(() => {
        const isMomo = location.pathname.includes("/momo/") || location.search.includes("partnerCode=");
        const isZaloPay = location.pathname.includes("/zalopay/") || location.search.includes("apptransid=");

        let verifyPromise;
        if (isMomo) {
            verifyPromise = paymentService.verifyMomoReturn(location.search);
        } else if (isZaloPay) {
            verifyPromise = paymentService.verifyZaloPayReturn(location.search);
        } else {
            verifyPromise = paymentService.verifyVnpayReturn(location.search);
        }

        verifyPromise
            .then((res) => {
                setMessage(res.message);
                setOrderId(res.orderId ?? null);
                setStatus(res.success ? "success" : "failed");
            })
            .catch(() => {
                setMessage("Không thể xác minh giao dịch");
                setStatus("failed");
            });
    }, [location.pathname, location.search]);

    return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
            {status === "loading" && <p className="text-muted-foreground animate-pulse">Đang xác nhận kết quả thanh toán...</p>}
            {status === "success" && (
                <>
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        ✓
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">Thanh toán thành công</h1>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Link to={orderId ? `/orders/${orderId}` : "/orders"} className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
                        Xem chi tiết đơn hàng →
                    </Link>
                </>
            )}
            {status === "failed" && (
                <>
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        ✕
                    </div>
                    <h1 className="text-2xl font-bold text-destructive mb-2">Thanh toán thất bại</h1>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Link to="/checkout" className="inline-block px-5 py-2.5 rounded-xl bg-muted font-semibold hover:bg-muted/80 transition">
                        Quay lại trang thanh toán →
                    </Link>
                </>
            )}
        </div>
    );
}