import * as types from './types';
declare class BlessingOrderProcessor {
    processPayment(event: types.StripeEvent): Promise<any>;
    private handlePaymentSuccess;
    private handlePaymentFailed;
    private handleRefund;
    private generateConfirmationEmail;
    private generateFailureEmail;
}
export default BlessingOrderProcessor;
//# sourceMappingURL=agent-order-orchestrator.d.ts.map