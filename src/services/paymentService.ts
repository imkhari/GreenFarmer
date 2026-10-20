import api from "@/lib/axios";

export const paymentService = {
    // VNPay
    createVnpayUrl: (orderId: number) =>
        api.post(`/payment/vnpay/${orderId}`) as Promise<{ paymentUrl: string; txnRef: string }>,

    verifyVnpayReturn: (queryString: string) =>
        api.get(`/payment/vnpay/return${queryString}`) as Promise<{
            success: boolean;
            message: string;
            orderId?: number;
        }>,

    // MoMo
    createMomoUrl: (orderId: number) =>
        api.post(`/payment/momo/${orderId}`) as Promise<{ paymentUrl: string; txnRef: string }>,

    verifyMomoReturn: (queryString: string) =>
        api.get(`/payment/momo/return${queryString}`) as Promise<{
            success: boolean;
            message: string;
            orderId?: number;
        }>,

    // ZaloPay
    createZaloPayUrl: (orderId: number) =>
        api.post(`/payment/zalopay/${orderId}`) as Promise<{ paymentUrl: string; txnRef: string }>,

    verifyZaloPayReturn: (queryString: string) =>
        api.get(`/payment/zalopay/return${queryString}`) as Promise<{
            success: boolean;
            message: string;
            orderId?: number;
        }>,
};