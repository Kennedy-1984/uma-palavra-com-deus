// Type definitions for Uma Palavra com Deus
// ==========================================

export interface Believer {
  id: string;
  email: string;
  full_name: string;
  faith_tradition: 'cristianismo' | 'islamismo' | 'judaismo' | 'hinduismo' | 'budismo' | 'sikhismo' | 'outro';
  avatar_url?: string;
  bio?: string;
  prayer_count: number;
  order_count: number;
  total_spent: number;
  rfm_segment?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface SpiritualGift {
  id: string;
  name: string;
  description?: string;
  long_description?: string;
  category?: string;
  religion_category?: string;
  price: number;
  cost?: number;
  stock: number;
  image_url?: string;
  images_urls?: string[];
  sku?: string;
  weight_kg?: number;
  dimensions_cm?: string;
  tags?: string[];
  occasions?: string[];
  avg_rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpiritualOrder {
  id: string;
  order_number: string;
  customer_id: string;
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  shipping_cost?: number;
  total_amount: number;
  prayer_intention?: string;
  prayer_shared_in_community: boolean;
  shipping_address?: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  tracking_number?: string;
  tracking_url?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  customer_id: string;
  prayer_text: string;
  faith_tradition?: string;
  category?: string;
  is_public: boolean;
  prayer_count: number;
  status: 'pending' | 'shared' | 'answered' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  content: string;
  faith_tradition?: string;
  category?: string;
  likes: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes: number;
  created_at: string;
}

export interface DailyMetrics {
  id: string;
  metric_date: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  new_customers: number;
  returning_customers: number;
  prayer_requests_created: number;
  community_posts: number;
  community_engagement: number;
  emails_sent: number;
  email_opens: number;
  email_clicks: number;
  top_product_id?: string;
  low_stock_products: number;
  created_at: string;
}

export interface StripeEvent {
  type: string;
  data: {
    object: Record<string, any>;
  };
}

export interface ShippingAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface AgentLog {
  id: string;
  agent_name: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  input?: Record<string, any>;
  output?: Record<string, any>;
  error_message?: string;
  execution_time_ms: number;
  created_at: string;
}

export interface StrategicDecision {
  id: string;
  decision_type: string;
  description: string;
  recommendation: string;
  agent_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  approved_by?: string;
  created_at: string;
  implemented_at?: string;
}