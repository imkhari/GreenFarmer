import { useState } from "react";
import {
    Printer,
    X,
    Download,
    Copy,
    Check,
    Leaf,
    MapPin,
    Calendar,
    PackageCheck,
    ShieldCheck,
    QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { buildTraceUrl } from "@/lib/trace";
import { formatDate } from "@/lib/utils";
import type { BatchListItem } from "@/types/batch";

interface PrintStickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    batch: BatchListItem;
}

export function PrintStickerModal({ isOpen, onClose, batch }: PrintStickerModalProps) {
    const [copies, setCopies] = useState<number>(4);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const traceUrl = buildTraceUrl(batch.barcode || batch.batch_code);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(traceUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadSticker = () => {
        const qrSvg = document.getElementById("sticker-qr-svg-master");
        if (!qrSvg) return;

        const qrSvgData = new XMLSerializer().serializeToString(qrSvg);
        const qrImg = new Image();
        qrImg.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Kích thước chuẩn tem decal ngang 95 x 55 mm (tỉ lệ 2x sắc nét 760 x 440 px)
            const scale = 2;
            const width = 380 * scale;
            const height = 220 * scale;
            canvas.width = width;
            canvas.height = height;

            // Nền trắng viền bo nhẹ
            ctx.fillStyle = "#ffffff";
            if (ctx.roundRect) {
                ctx.roundRect(0, 0, width, height, 14 * scale);
                ctx.fill();
            } else {
                ctx.fillRect(0, 0, width, height);
            }

            // Viền tem
            ctx.lineWidth = 1.5 * scale;
            ctx.strokeStyle = "#e4e4e7";
            if (ctx.roundRect) {
                ctx.roundRect(0, 0, width, height, 14 * scale);
                ctx.stroke();
            } else {
                ctx.strokeRect(0, 0, width, height);
            }

            // Thanh thương hiệu Header
            ctx.fillStyle = "#059669";
            ctx.beginPath();
            ctx.arc(28 * scale, 24 * scale, 9 * scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#065f46";
            ctx.font = `bold ${11 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillText("GREEN FARMER", 44 * scale, 24 * scale);

            ctx.fillStyle = "#71717a";
            ctx.font = `500 ${7.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillText("NÔNG SẢN NGUYÊN BẢN • TRUY XUẤT NGUỒN GỐC", 44 * scale, 33 * scale);

            // Badge mã lô
            ctx.fillStyle = "#f4f4f5";
            if (ctx.roundRect) {
                ctx.roundRect(width - 120 * scale, 14 * scale, 102 * scale, 20 * scale, 4 * scale);
                ctx.fill();
            } else {
                ctx.fillRect(width - 120 * scale, 14 * scale, 102 * scale, 20 * scale);
            }
            ctx.fillStyle = "#3f3f46";
            ctx.font = `600 ${8.5 * scale}px monospace`;
            ctx.fillText(`LÔ: ${batch.batch_code}`, width - 114 * scale, 27.5 * scale);

            // Đường phân cách mỏng
            ctx.strokeStyle = "#f4f4f5";
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(18 * scale, 44 * scale);
            ctx.lineTo(width - 18 * scale, 44 * scale);
            ctx.stroke();

            // Cột trái: Thông tin sản phẩm
            ctx.fillStyle = "#09090b";
            ctx.font = `bold ${15 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillText(batch.product_name, 20 * scale, 70 * scale);

            ctx.fillStyle = "#52525b";
            ctx.font = `500 ${10 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillText(`Trang trại: ${batch.farm_name || "Nông trại GreenFarmer"}`, 20 * scale, 92 * scale);

            ctx.fillStyle = "#71717a";
            ctx.font = `${9.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillText(`Thu hoạch: ${formatDate(batch.harvest_date)}`, 20 * scale, 114 * scale);
            ctx.fillText(`Sản lượng: ${batch.quantity ? `${batch.quantity} kg` : "Tiêu chuẩn"}`, 20 * scale, 133 * scale);

            // Badge tiêu chuẩn chứng nhận
            ctx.fillStyle = "#ecfdf5";
            if (ctx.roundRect) {
                ctx.roundRect(20 * scale, 148 * scale, 142 * scale, 22 * scale, 11 * scale);
                ctx.fill();
            } else {
                ctx.fillRect(20 * scale, 148 * scale, 142 * scale, 22 * scale);
            }
            ctx.strokeStyle = "#a7f3d0";
            ctx.stroke();
            ctx.fillStyle = "#047857";
            ctx.font = `bold ${8.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            const certTitle = batch.trust_level === "High" ? "Chứng nhận GlobalGAP" : "Tiêu chuẩn VietGAP";
            ctx.fillText(`✓ ${certTitle}`, 28 * scale, 162.5 * scale);

            // Cột phải: Mã QR Code
            const qrSize = 92 * scale;
            const qrX = width - qrSize - 24 * scale;
            const qrY = 58 * scale;

            // Khung QR
            ctx.fillStyle = "#ffffff";
            if (ctx.roundRect) {
                ctx.roundRect(qrX - 4 * scale, qrY - 4 * scale, qrSize + 8 * scale, qrSize + 8 * scale, 8 * scale);
                ctx.fill();
            } else {
                ctx.fillRect(qrX - 4 * scale, qrY - 4 * scale, qrSize + 8 * scale, qrSize + 8 * scale);
            }
            ctx.strokeStyle = "#e4e4e7";
            ctx.stroke();

            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            // Mã vạch dưới QR
            ctx.fillStyle = "#71717a";
            ctx.font = `600 ${8 * scale}px monospace`;
            ctx.textAlign = "center";
            ctx.fillText(batch.barcode || batch.batch_code, qrX + qrSize / 2, qrY + qrSize + 14 * scale);
            ctx.textAlign = "left";

            // Đường phân cách đáy
            ctx.strokeStyle = "#f4f4f5";
            ctx.beginPath();
            ctx.moveTo(18 * scale, height - 32 * scale);
            ctx.lineTo(width - 18 * scale, height - 32 * scale);
            ctx.stroke();

            // Chân tem
            ctx.fillStyle = "#71717a";
            ctx.font = `500 ${8 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillText("Quét mã QR để xem nhật ký canh tác & nguồn gốc", 20 * scale, height - 15 * scale);

            ctx.fillStyle = "#047857";
            ctx.font = `bold ${8 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.textAlign = "right";
            ctx.fillText("GreenFarmer Verified", width - 20 * scale, height - 15 * scale);
            ctx.textAlign = "left";

            // Tải file ảnh
            const pngUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.download = `Tem-Nhan-${batch.batch_code}.png`;
            a.href = pngUrl;
            a.click();
        };
        qrImg.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(qrSvgData)));
    };

    const certLabel = batch.trust_level === "High" ? "Chứng nhận GlobalGAP" : "Tiêu chuẩn VietGAP";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            {/* CSS chuyên dụng chỉ in tem khi gọi lệnh in của trình duyệt */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 12mm 10mm;
                    }
                    body * {
                        visibility: hidden !important;
                    }
                    #print-stickers-container, #print-stickers-container * {
                        visibility: visible !important;
                    }
                    #print-stickers-container {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 8mm 6mm !important;
                    }
                }
            `}</style>

            <div
                className="relative w-full max-w-4xl bg-card border border-border rounded-3xl p-6 shadow-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header modal */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Printer className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">In tem nhãn truy xuất nguồn gốc</h2>
                            <p className="text-xs text-muted-foreground">Mẫu nhãn decal dán bao bì & hộp đóng gói nông sản</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Thanh điều khiển: Bố cục in & Nút xuất */}
                <div className="my-4 p-3 rounded-2xl bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-3">
                    {/* Segmented controls: Chọn số lượng tem */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground mr-1">Khổ in:</span>
                        {[
                            { value: 1, label: "1 tem đơn" },
                            { value: 2, label: "2 tem" },
                            { value: 4, label: "4 tem (Khổ A4)" },
                            { value: 6, label: "6 tem" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setCopies(item.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    copies === item.value
                                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                        : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Nút hành động tiện ích */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopyUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition text-muted-foreground hover:text-foreground"
                            title="Sao chép link truy xuất"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Đã copy link" : "Sao chép link"}
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadSticker}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition text-muted-foreground hover:text-foreground"
                            title="Tải ảnh tem nhãn hoàn chỉnh chất lượng cao"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Tải tem nhãn (PNG)
                        </button>
                    </div>
                </div>

                {/* Vùng xem trước tem nhãn (Preview Canvas) */}
                <div className="flex-1 overflow-y-auto p-5 bg-zinc-100 rounded-2xl border border-zinc-200">
                    <div
                        id="print-stickers-container"
                        className={
                            copies === 1
                                ? "max-w-md mx-auto"
                                : "grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
                        }
                    >
                        {Array.from({ length: copies }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white text-zinc-900 border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col justify-between select-none"
                                style={{ pageBreakInside: "avoid" }}
                            >
                                {/* Header con tem: Logo & Mã lô */}
                                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white shrink-0">
                                            <Leaf className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-xs tracking-wider text-emerald-800 leading-none">
                                                GREEN FARMER
                                            </div>
                                            <div className="text-[8px] text-zinc-400 font-medium tracking-tight mt-0.5">
                                                NÔNG SẢN NGUYÊN BẢN
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
                                        LÔ: {batch.batch_code}
                                    </span>
                                </div>

                                {/* Body con tem: Thông tin bên trái, Mã QR bên phải */}
                                <div className="py-3 flex items-center justify-between gap-3">
                                    {/* Cột trái: Tên sản phẩm, Trang trại, Ngày thu hoạch, Chứng nhận */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <h4 className="text-sm font-bold text-zinc-900 leading-snug truncate">
                                            {batch.product_name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                                            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                                            <span className="truncate">{batch.farm_name || "Nông trại GreenFarmer"}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-500 pt-0.5">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                                                <span>Thu hoạch: <b className="text-zinc-700 font-medium">{formatDate(batch.harvest_date)}</b></span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <PackageCheck className="w-3 h-3 text-zinc-400 shrink-0" />
                                                <span>SL: <b className="text-zinc-700 font-medium">{batch.quantity ? `${batch.quantity} kg` : "Tiêu chuẩn"}</b></span>
                                            </div>
                                        </div>

                                        {/* Huy hiệu kiểm định chuẩn */}
                                        <div className="pt-1">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                {certLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cột phải: Mã QR Code sắc nét */}
                                    <div className="shrink-0 flex flex-col items-center">
                                        <div className="p-1.5 bg-white border border-zinc-200 rounded-lg shadow-2xs">
                                            <QRCodeSVG
                                                id={index === 0 ? "sticker-qr-svg-master" : undefined}
                                                value={traceUrl}
                                                size={88}
                                                level="M"
                                                includeMargin={false}
                                            />
                                        </div>
                                        <span className="font-mono text-[8.5px] text-zinc-500 mt-1 font-semibold tracking-tight">
                                            {batch.barcode || batch.batch_code}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer con tem: Hướng dẫn quét trang trọng */}
                                <div className="pt-2 border-t border-dashed border-zinc-200 flex items-center justify-between text-[8.5px] text-zinc-400">
                                    <div className="flex items-center gap-1 text-zinc-500 font-medium">
                                        <QrCode className="w-2.5 h-2.5 text-emerald-600" />
                                        <span>Quét mã QR để xem nhật ký canh tác</span>
                                    </div>
                                    <span className="font-semibold text-emerald-700">GreenFarmer Verified</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer modal */}
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                        Kích thước: <b>Decal 95 × 55 mm</b> • Tương thích máy in văn phòng A4 và máy in tem nhiệt
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition shadow-xs"
                        >
                            <Printer className="w-4 h-4" />
                            In tem ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
