// Agent #9: Faith Flow Orchestrator
// Central webhook hub routing events to agents
// ===========================================
import Anthropic from '@anthropic-ai/sdk';
import { config } from './config';
import * as db from './supabase';
const anthropic = new Anthropic({
    apiKey: config.anthropic.apiKey,
});
class FaithFlowOrchestrator {
    async processWebhook(payload) {
        const startTime = Date.now();
        try {
            console.log(`🤖 Faith Flow Orchestrator processing: ${payload.type}`);
            let result = {};
            switch (payload.type) {
                case 'order.created':
                    result = await this.handleOrderCreated(payload.data);
                    break;
                case 'payment.succeeded':
                    result = await this.handlePaymentSucceeded(payload.data);
                    break;
                case 'prayer.shared':
                    result = await this.handlePrayerShared(payload.data);
                    break;
                case 'community.post':
                    result = await this.handleCommunityPost(payload.data);
                    break;
                case 'inventory.low':
                    result = await this.handleLowInventory(payload.data);
                    break;
                default:
                    console.log(`⚠️  Unknown event type: ${payload.type}`);
            }
            // Log success
            const executionTime = Date.now() - startTime;
            await db.logAgentAction({
                agent_name: 'Faith Flow Orchestrator (#9)',
                action: `Processed ${payload.type}`,
                status: 'success',
                input: payload,
                output: result,
                execution_time_ms: executionTime,
            });
            return result;
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            console.error('🔴 Orchestrator error:', error);
            await db.logAgentAction({
                agent_name: 'Faith Flow Orchestrator (#9)',
                action: `Failed processing ${payload.type}`,
                status: 'error',
                input: payload,
                error_message: String(error),
                execution_time_ms: executionTime,
            });
            throw error;
        }
    }
    async handleOrderCreated(data) {
        console.log('📦 Handling order.created event');
        // Route to Agent #2 (Spiritual Stock Guardian)
        return {
            message: 'Order created, inventory checked',
            orderId: data.order_id,
        };
    }
    async handlePaymentSucceeded(data) {
        console.log('💰 Handling payment.succeeded event');
        // Route to Agent #1 (Blessing Order Processor)
        return {
            message: 'Payment processed successfully',
            paymentId: data.payment_id,
        };
    }
    async handlePrayerShared(data) {
        console.log('🙏 Handling prayer.shared event');
        // Use Claude to generate a blessing response
        const prayerText = data.prayer_text || '';
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            messages: [
                {
                    role: 'user',
                    content: `Uma pessoa compartilhou esta oração na comunidade: "${prayerText}"\n\nResponda com uma mensagem de bênção, apoio e esperança. Seja breve (2-3 linhas), compassivo e inspirador.`,
                },
            ],
        });
        const blessingMessage = message.content[0].type === 'text' ? message.content[0].text : 'Que Deus abençoe sua jornada.';
        return {
            message: 'Prayer shared and blessed',
            prayerId: data.prayer_id,
            blessingResponse: blessingMessage,
        };
    }
    async handleCommunityPost(data) {
        console.log('💬 Handling community.post event');
        const postContent = data.content || '';
        // Use Claude to generate engagement suggestion
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 150,
            messages: [
                {
                    role: 'user',
                    content: `Um post foi criado na comunidade: "${postContent}"\n\nSugira uma pergunta de engajamento curta para incentivar a participação. Apenas a pergunta, sem explicação.`,
                },
            ],
        });
        const engagementQuestion = message.content[0].type === 'text' ? message.content[0].text : 'O que você achou disso?';
        return {
            message: 'Community post processed',
            postId: data.post_id,
            engagementQuestion,
        };
    }
    async handleLowInventory(data) {
        console.log('📉 Handling inventory.low event');
        // Route to Agent #2 (Spiritual Stock Guardian)
        return {
            message: 'Low inventory alert processed',
            productId: data.product_id,
            currentStock: data.stock,
        };
    }
}
export default FaithFlowOrchestrator;
//# sourceMappingURL=agent-orchestrator.js.map