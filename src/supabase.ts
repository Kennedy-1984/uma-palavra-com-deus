// Supabase Client & Database Queries
// ===================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';
import * as types from './types';

// Initialize Supabase clients
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

// ==========================================
// BELIEVERS (Users)
// ==========================================

export async function getBelieverById(id: string): Promise<types.Believer | null> {
  const { data, error } = await supabase
    .from('believers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching believer:', error);
    return null;
  }
  return data;
}

export async function getBelieverByEmail(email: string): Promise<types.Believer | null> {
  const { data, error } = await supabase
    .from('believers')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

export async function createBeliever(believer: Omit<types.Believer, 'id' | 'created_at' | 'updated_at'>): Promise<types.Believer | null> {
  const { data, error } = await supabaseAdmin
    .from('believers')
    .insert([believer])
    .select()
    .single();

  if (error) {
    console.error('Error creating believer:', error);
    return null;
  }
  return data;
}

export async function updateBeliever(id: string, updates: Partial<types.Believer>): Promise<types.Believer | null> {
  const { data, error } = await supabaseAdmin
    .from('believers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating believer:', error);
    return null;
  }
  return data;
}

// ==========================================
// SPIRITUAL GIFTS (Products)
// ==========================================

export async function getProductById(id: string): Promise<types.SpiritualGift | null> {
  const { data, error } = await supabase
    .from('spiritual_gifts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getAllProducts(): Promise<types.SpiritualGift[]> {
  const { data, error } = await supabase
    .from('spiritual_gifts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export async function getProductsByCategory(category: string): Promise<types.SpiritualGift[]> {
  const { data, error } = await supabase
    .from('spiritual_gifts')
    .select('*')
    .eq('category', category)
    .eq('is_active', true);

  if (error) return [];
  return data || [];
}

export async function getProductsByReligion(religion: string): Promise<types.SpiritualGift[]> {
  const { data, error } = await supabase
    .from('spiritual_gifts')
    .select('*')
    .eq('religion_category', religion)
    .eq('is_active', true);

  if (error) return [];
  return data || [];
}

export async function createProduct(product: Omit<types.SpiritualGift, 'id' | 'created_at' | 'updated_at'>): Promise<types.SpiritualGift | null> {
  const { data, error } = await supabaseAdmin
    .from('spiritual_gifts')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  return data;
}

// ==========================================
// SPIRITUAL ORDERS (Orders)
// ==========================================

export async function getOrderById(id: string): Promise<types.SpiritualOrder | null> {
  const { data, error } = await supabase
    .from('spiritual_orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getOrderByStripeIntentId(intentId: string): Promise<types.SpiritualOrder | null> {
  const { data, error } = await supabase
    .from('spiritual_orders')
    .select('*')
    .eq('stripe_payment_intent_id', intentId)
    .single();

  if (error) return null;
  return data;
}

export async function getOrdersByCustomer(customerId: string): Promise<types.SpiritualOrder[]> {
  const { data, error } = await supabase
    .from('spiritual_orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createOrder(order: Omit<types.SpiritualOrder, 'id' | 'created_at' | 'updated_at'>): Promise<types.SpiritualOrder | null> {
  const { data, error } = await supabaseAdmin
    .from('spiritual_orders')
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }
  return data;
}

export async function updateOrder(id: string, updates: Partial<types.SpiritualOrder>): Promise<types.SpiritualOrder | null> {
  const { data, error } = await supabaseAdmin
    .from('spiritual_orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    return null;
  }
  return data;
}

// ==========================================
// PRAYER REQUESTS
// ==========================================

export async function getPrayerById(id: string): Promise<types.PrayerRequest | null> {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getPublicPrayers(): Promise<types.PrayerRequest[]> {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('is_public', true)
    .eq('status', 'shared')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createPrayerRequest(prayer: Omit<types.PrayerRequest, 'id' | 'created_at' | 'updated_at'>): Promise<types.PrayerRequest | null> {
  const { data, error } = await supabaseAdmin
    .from('prayer_requests')
    .insert([prayer])
    .select()
    .single();

  if (error) {
    console.error('Error creating prayer:', error);
    return null;
  }
  return data;
}

// ==========================================
// COMMUNITY POSTS
// ==========================================

export async function getPostById(id: string): Promise<types.CommunityPost | null> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getCommunityPosts(): Promise<types.CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createCommunityPost(post: Omit<types.CommunityPost, 'id' | 'created_at' | 'updated_at'>): Promise<types.CommunityPost | null> {
  const { data, error } = await supabaseAdmin
    .from('community_posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }
  return data;
}

// ==========================================
// AGENT LOGS
// ==========================================

export async function logAgentAction(log: Omit<types.AgentLog, 'id' | 'created_at'>): Promise<types.AgentLog | null> {
  const { data, error } = await supabaseAdmin
    .from('agent_logs')
    .insert([log])
    .select()
    .single();

  if (error) {
    console.error('Error logging agent action:', error);
    return null;
  }
  return data;
}

export async function getAgentLogs(agentName: string, limit = 50): Promise<types.AgentLog[]> {
  const { data, error } = await supabase
    .from('agent_logs')
    .select('*')
    .eq('agent_name', agentName)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

// ==========================================
// DAILY METRICS
// ==========================================

export async function getDailyMetrics(date: string): Promise<types.DailyMetrics | null> {
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('metric_date', date)
    .single();

  if (error) return null;
  return data;
}

export async function recordDailyMetrics(metrics: Omit<types.DailyMetrics, 'id' | 'created_at'>): Promise<types.DailyMetrics | null> {
  const { data, error } = await supabaseAdmin
    .from('daily_metrics')
    .upsert([metrics])
    .select()
    .single();

  if (error) {
    console.error('Error recording metrics:', error);
    return null;
  }
  return data;
}

// ==========================================
// RFM SEGMENTATION
// ==========================================

export async function updateBelieverRFMSegment(believerId: string): Promise<void> {
  const believer = await getBelieverById(believerId);
  if (!believer) return;

  // Get recency (days since last order)
  const { data: orders } = await supabase
    .from('spiritual_orders')
    .select('created_at')
    .eq('customer_id', believerId)
    .order('created_at', { ascending: false })
    .limit(1);

  const lastOrderDate = orders?.[0]?.created_at;
  const recencyDays = lastOrderDate 
    ? Math.floor((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Get frequency (number of orders)
  const { count: frequency } = await supabase
    .from('spiritual_orders')
    .select('*', { count: 'exact' })
    .eq('customer_id', believerId);

  // Monetary is already in total_spent

  // Simple RFM scoring (1-5 for each)
  let rScore = recencyDays < 30 ? '5' : recencyDays < 90 ? '4' : recencyDays < 180 ? '3' : recencyDays < 365 ? '2' : '1';
  let fScore = (frequency || 0) >= 5 ? '5' : (frequency || 0) >= 3 ? '4' : (frequency || 0) >= 2 ? '3' : (frequency || 0) === 1 ? '2' : '1';
  let mScore = believer.total_spent >= 1000 ? '5' : believer.total_spent >= 500 ? '4' : believer.total_spent >= 200 ? '3' : believer.total_spent >= 50 ? '2' : '1';

  const rfmSegment = `R${rScore}F${fScore}M${mScore}`;

  await updateBeliever(believerId, { rfm_segment: rfmSegment });
}

export default {
  supabase,
  supabaseAdmin,
  getBelieverById,
  getBelieverByEmail,
  createBeliever,
  updateBeliever,
  getAllProducts,
  getProductsByCategory,
  getProductsByReligion,
  createProduct,
  getOrderById,
  getOrderByStripeIntentId,
  getOrdersByCustomer,
  createOrder,
  updateOrder,
  getPrayerById,
  getPublicPrayers,
  createPrayerRequest,
  getCommunityPosts,
  createCommunityPost,
  logAgentAction,
  getAgentLogs,
  getDailyMetrics,
  recordDailyMetrics,
  updateBelieverRFMSegment,
};