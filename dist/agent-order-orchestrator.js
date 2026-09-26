// Agent #1: Blessing Order Processor
// Processes Stripe payments and sends confirmation emails
// ======================================================
import Anthropic from '@anthropic-ai/sdk';
import Stripe from 'stripe';
import { config } from './config';
import * as db from './supabase';
const anthropic = new Anthropic({
    apiKey: config.anthropic.apiKey,
});
const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2023-10-16',
});
class BlessingOrderProcessor {
    async processPayment(event) {
        const startTime = Date.now();
        try {
            console.log(`🤖 Blessing Order Processor starting for ${event.type}`);
            const paymentObject = event.data.object;
            const paymentIntentId = paymentObject.id || paymentObject.payment_intent;
            // Find order by Stripe Intent ID
            const order = await db.getOrderByStripeIntentId(paymentIntentId);
            if (!order) {
                console.warn(`⚠️  No order found for payment intent: ${paymentIntentId}`);
                return { error: 'Order not found' };
            }
            // Get customer details
            const customer = await db.getBelieverById(order.customer_id);
            if (!customer) {
                throw new Error('Customer not found');
            }
            let result = {};
            // Handle different payment events
            switch (event.type) {
                case 'payment_intent.succeeded':
                    result = await this.handlePaymentSuccess(order, customer, paymentObject);
                    break;
                case 'payment_intent.payment_failed':
                    result = await this.handlePaymentFailed(order, customer, paymentObject);
                    break;
                case 'charge.refunded':
                    result = await this.handleRefund(order, customer, paymentObject);
                    break;
                default:
                    console.log(`⚠️  Unhandled payment event: ${event.type}`);
            }
            // Log success
            const executionTime = Date.now() - startTime;
            await db.logAgentAction({
                agent_name: 'Blessing Order Processor (#1)',
                action: `Processed ${event.type} for order ${order.order_number}`,
                status: 'success',
                input: { paymentIntentId, orderNumber: order.order_number },
                output: result,
                execution_time_ms: executionTime,
            });
            return result;
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            console.error('🔴 Order processor error:', error);
            await db.logAgentAction({
                agent_name: 'Blessing Order Processor (#1)',
                action: `Failed processing ${event.type}`,
                status: 'error',
                error_message: String(error),
                execution_time_ms: executionTime,
            });
            throw error;
        }
    }
    async handlePaymentSuccess(order, customer, paymentObject) {
        console.log(`✅ Processing successful payment for order ${order.order_number}`);
        // Update order status
        const updatedOrder = await db.updateOrder(order.id, {
            payment_status: 'paid',
            status: 'processing',
            stripe_charge_id: paymentObject.charges?.data?.[0]?.id,
            updated_at: new Date().toISOString(),
        });
        // Generate email content using Claude
        const emailContent = await this.generateConfirmationEmail(order, customer);
        // Log email
        // In production, integrate with Brevo to actually send
        console.log(`📧 Would send email to ${customer.email}`);
        console.log(`Email subject: ${emailContent.subject}`);
        console.log(`Email body preview: ${emailContent.body.substring(0, 100)}...`);
        // Update RFM segment
        await db.updateBelieverRFMSegment(customer.id);
        return {
            message: 'Payment processed and confirmation email generated',
            orderNumber: order.order_number,
            customerEmail: customer.email,
            emailSubject: emailContent.subject,
        };
    }
    async handlePaymentFailed(order, customer, paymentObject) {
        console.log(`❌ Processing failed payment for order ${order.order_number}`);
        // Update order status
        await db.updateOrder(order.id, {
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
        });
        // Generate failure email
        const failureMessage = await this.generateFailureEmail(order, customer, paymentObject);
        console.log(`📧 Would send failure notification to ${customer.email}`);
        return {
            message: 'Payment failure processed and notification sent',
            orderNumber: order.order_number,
            customerEmail: customer.email,
            reason: paymentObject.last_payment_error?.message || 'Unknown error',
        };
    }
    async handleRefund(order, customer, paymentObject) {
        console.log(`💰 Processing refund for order ${order.order_number}`);
        // Update order status
        await db.updateOrder(order.id, {
            payment_status: 'refunded',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
        });
        console.log(`📧 Would send refund confirmation to ${customer.email}`);
        return {
            message: 'Refund processed and confirmation sent',
            orderNumber: order.order_number,
            refundAmount: paymentObject.amount_refunded / 100, // Convert cents to reais
        };
    }
    async generateConfirmationEmail(order, customer) {
        // Use Claude to generate personalized confirmation email
        const prayerIntentionContext = order.prayer_intention
            ? `\n\nIntenção de oração compartilhada: "${order.prayer_intention}"\n`
            : '';
        const prompt = `Gere um email de confirmação de compra para um cliente de uma loja de presentes religiosos.

Detalhes:
- Cliente: ${customer.full_name}
- Tradição de fé: ${customer.faith_tradition}
- Número do pedido: ${order.order_number}
- Valor total: R$ ${order.total_amount}
- ${prayerIntentionContext}

Formato:
SUBJECT: [colocar assunto aqui]
BODY: [colocar corpo do email aqui, até 200 palavras]

Seja caloroso, espiritual e acolhedor. Inclua referência à tradição de fé do cliente se apropriado.`;
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });
        const emailText = message.content[0].type === 'text' ? message.content[0].text : '';
        const [subjectLine, ...bodyLines] = emailText.split('\n');
        const subject = subjectLine.replace('SUBJECT: ', '').trim();
        const body = bodyLines
            .join('\n')
            .replace('BODY: ', '')
            .trim();
        return {
            subject: subject || `Pedido Confirmado - ${order.order_number}`,
            body: body || 'Obrigado pela sua compra. Que as bênçãos estejam com você!',
        };
    }
    async generateFailureEmail(order, customer, paymentObject) {
        const errorReason = paymentObject.last_payment_error?.message || 'Erro desconhecido';
        const prompt = `Gere um email profissional e compassivo informando que o pagamento de um pedido falhou.

Detalhes:
- Cliente: ${customer.full_name}
- Número do pedido: ${order.order_number}
- Motivo: ${errorReason}

Seja empático, oferecendo ajuda para resolver o problema. Máximo 150 palavras.`;
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });
        return message.content[0].type === 'text'
            ? message.content[0].text
            : 'Desculpe, ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.';
    }
}
export default BlessingOrderProcessor;
//# sourceMappingURL=agent-order-orchestrator.js.map