export type ScenarioType = 'home' | 'party' | 'jewelry' | 'history' | 'viva';

export interface ShoppingLinks {
  amazon?: string;
  flipkart?: string;
  ikea?: string;
  myntra?: string;
  ajio?: string;
  swiggy?: string;
  zomato?: string;
  bigbasket?: string;
  oyorooms?: string;
  makemytrip?: string;
  booking?: string;
  bookmyshow?: string;
  tanishq?: string;
  caratlane?: string;
  bluestone?: string;
  google?: string;
  meesho?: string;
}

export interface HomeBudgetItem {
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links?: ShoppingLinks;
}

export interface HomeBudgetCategory {
  category: string;
  allocation: number;
  items: HomeBudgetItem[];
}

export interface CalculationTableEntry {
  category: string;
  items_count: number;
  total_cost: number;
  percentage_of_budget: number;
}

export interface HomeBudgetResponse {
  total_budget: number;
  allocated_total: number;
  remaining_budget: number;
  style_summary: string;
  budget_breakdown: HomeBudgetCategory[];
  calculation_table: CalculationTableEntry[];
  smart_recommendations: string[];
  fallback_strategy: string;
}

export interface PartyBudgetItem {
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links?: ShoppingLinks;
}

export interface PartyBudgetCategory {
  category: string;
  allocation: number;
  cost_per_head_share?: number;
  items: PartyBudgetItem[];
}

export interface VenueSuggestion {
  name: string;
  type: string;
  capacity: number;
  estimated_cost: number;
  search_terms: string;
  search_links?: ShoppingLinks;
}

export interface PartyBudgetResponse {
  total_budget: number;
  guest_count: number;
  cost_per_head: number;
  is_budget_tight: boolean;
  smart_alert: string;
  budget_breakdown: PartyBudgetCategory[];
  venue_suggestions?: VenueSuggestion[];
  calculation_table: CalculationTableEntry[];
  cost_saving_tips: string[];
}

export interface JewelryRecommendationItem {
  piece_name: string;
  category: string;
  estimated_price: number;
  approx_weight_or_carat: string;
  matching_reason: string;
  search_terms: string;
  shopping_links?: ShoppingLinks;
}

export interface JewelryBudgetResponse {
  total_budget: number;
  metal_benchmark_info: string;
  outfit_analysis: string;
  style_recommendation: string;
  recommendations: JewelryRecommendationItem[];
  metal_care_and_hallmarking_tips: string[];
}

export interface GoldRatesResponse {
  currency: string;
  rates: {
    gold_24k_per_gram: number;
    gold_22k_per_gram: number;
    gold_18k_per_gram: number;
    silver_per_gram: number;
    platinum_per_gram: number;
    making_charges_est_percent: number;
    gst_percent: number;
  };
  usd_inr_exchange_rate: number;
  last_updated: string;
}

export interface HistoryItem {
  id: string;
  username: string;
  scenario: 'home' | 'party' | 'jewelry';
  title: string;
  timestamp: string;
  budget: number;
  inputSummary: Record<string, any>;
  result: any;
}

export interface UserProfile {
  username: string;
  email: string;
  fullName: string;
}
