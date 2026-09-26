interface WebhookPayload {
    type: 'order.created' | 'payment.succeeded' | 'prayer.shared' | 'community.post' | 'inventory.low';
    data: Record<string, any>;
    timestamp: string;
}
declare class FaithFlowOrchestrator {
    processWebhook(payload: WebhookPayload): Promise<any>;
    private handleOrderCreated;
    private handlePaymentSucceeded;
    private handlePrayerShared;
    private handleCommunityPost;
    private handleLowInventory;
}
export default FaithFlowOrchestrator;
//# sourceMappingURL=agent-orchestrator.d.ts.map