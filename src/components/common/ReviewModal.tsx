import { useState } from "react";
import { Star, X, Loader2, CheckCircle2 } from "lucide-react";
import { reviewService } from "@/services/reviewService";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    productName: string;
    onSuccess?: () => void;
}

const RATING_LABELS = [
    "",
    "Rất không hài lòng",
    "Không hài lòng",
    "Bình thường",
    "Hài lòng",
    "Rất hài lòng & Nông sản tươi ngon!"
];

export function ReviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    onSuccess,
}: ReviewModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [hover, setHover] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1) {
            setError("Vui lòng chọn số sao đánh giá.");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            await reviewService.create(productId, {
                rating,
                comment: comment.trim() || undefined,
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1200);
        } catch (err: any) {
            console.error("Lỗi gửi đánh giá:", err);
            const msg =
                err?.message ??
                err?.response?.data?.message ??
                "Có lỗi xảy ra khi gửi đánh giá.";
            setError(Array.isArray(msg) ? msg.join(", ") : msg);
        } finally {
            setSubmitting(false);
        }
    };

    const currentDisplayRating = hover ?? rating;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút đóng */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {success ? (
                    <div className="py-8 text-center space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">Cảm ơn bạn đã đánh giá!</h3>
                        <p className="text-sm text-muted-foreground">
                            Đánh giá của bạn giúp cộng đồng tiêu dùng nông sản minh bạch và đáng tin cậy hơn.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Đánh giá sản phẩm
                            </span>
                            <h2 className="text-xl font-bold mt-1 text-foreground">
                                {productName}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Hãy chia sẻ trải nghiệm về chất lượng và độ minh bạch nguồn gốc của nông sản
                            </p>
                        </div>

                        {/* Chọn sao */}
                        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(null)}
                                        className="p-1 hover:scale-125 transition-transform duration-150 focus:outline-none"
                                        aria-label={`${star} sao`}
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors ${
                                                star <= currentDisplayRating
                                                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                                                    : "text-muted-foreground/30 hover:text-muted-foreground/50"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-2 h-4">
                                {RATING_LABELS[currentDisplayRating]}
                            </span>
                        </div>

                        {/* Ô nhập nhận xét */}
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">
                                Nhận xét chi tiết
                            </label>
                            <textarea
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Ví dụ: Rau rất tươi, giòn ngọt, quét mã QR thấy rõ nhật ký bón phân ngày 10/10 nên rất yên tâm..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {/* Nút bấm */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                            >
                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
