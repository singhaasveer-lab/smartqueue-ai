export type ServiceId =
  | 'general_enquiry'
  | 'document_verification'
  | 'fee_payment'
  | 'technical_support'
  | 'appointment'
  | 'express_billing';

export type PriorityLevel = 'normal' | 'priority';

export type TokenStatus =
  | 'waiting'
  | 'called'
  | 'serving'
  | 'completed'
  | 'skipped'
  | 'cancelled';

export interface Service {
  id: ServiceId;
  name: string;
  code: string; // e.g. "GEN", "DOC", "FEE", "TEC", "APT"
  avgDurationMinutes: number;
  description: string;
  category: string;
  color: string;
  iconName: string;
}

export interface QueueToken {
  id: string;
  tokenNumber: string; // e.g. "DOC-104", "PRI-102"
  numericSeq: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  notes?: string;
  serviceId: ServiceId;
  serviceName: string;
  priority: PriorityLevel;
  status: TokenStatus;
  joinedAt: number; // timestamp in ms
  calledAt?: number;
  serviceStartedAt?: number;
  completedAt?: number;
  assignedCounter?: number;
  estimatedWaitMinutes: number;
}

export interface Counter {
  id: number;
  name: string;
  staffName: string;
  currentServingTokenId?: string | null;
  status: 'available' | 'busy' | 'closed';
  supportedServices?: ServiceId[];
}

export interface AIInsight {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'success' | 'recommendation';
  title: string;
  message: string;
  metric?: string;
  confidence: number;
  timestamp: number;
  impact: 'high' | 'medium' | 'low';
}

export interface QueueAnalytics {
  totalServedToday: number;
  totalWaiting: number;
  totalServing: number;
  totalSkipped: number;
  avgWaitTimeMinutes: number;
  avgServiceTimeMinutes: number;
  peakQueueSize: number;
  priorityCount: number;
  normalCount: number;
  priorityPercentage: number;
  serviceDistribution: {
    serviceId: ServiceId;
    serviceName: string;
    count: number;
    percentage: number;
    avgWaitMinutes: number;
  }[];
  hourlyTraffic: {
    hour: string;
    joined: number;
    served: number;
  }[];
  congestionLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  estimatedTimeToClearMinutes: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: number;
}
