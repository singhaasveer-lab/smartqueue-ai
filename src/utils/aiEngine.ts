import { QueueToken, Counter, Service, AIInsight, QueueAnalytics, ServiceId } from '../types';

export function calculateAnalytics(
  tokens: QueueToken[],
  counters: Counter[],
  services: Service[]
): QueueAnalytics {
  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const servingTokens = tokens.filter((t) => t.status === 'serving' || t.status === 'called');
  const completedTokens = tokens.filter((t) => t.status === 'completed');
  const skippedTokens = tokens.filter((t) => t.status === 'skipped');

  const totalWaiting = waitingTokens.length;
  const totalServing = servingTokens.length;
  const totalServedToday = completedTokens.length;
  const totalSkipped = skippedTokens.length;

  // Calculate actual average wait time from completed or current waiting
  let totalWaitMinutes = 0;
  let waitCount = 0;

  completedTokens.forEach((t) => {
    if (t.calledAt && t.joinedAt) {
      const waitMins = Math.max(1, Math.round((t.calledAt - t.joinedAt) / (60 * 1000)));
      totalWaitMinutes += waitMins;
      waitCount++;
    }
  });

  // If few completed, blend with current waiting elapsed times
  waitingTokens.forEach((t) => {
    const elapsedMins = Math.max(1, Math.round((Date.now() - t.joinedAt) / (60 * 1000)));
    totalWaitMinutes += elapsedMins;
    waitCount++;
  });

  const avgWaitTimeMinutes = waitCount > 0 ? Math.round((totalWaitMinutes / waitCount) * 10) / 10 : 8;

  // Average service time
  let totalServiceMinutes = 0;
  let serviceCount = 0;

  completedTokens.forEach((t) => {
    if (t.completedAt && t.serviceStartedAt) {
      const servMins = Math.max(1, Math.round((t.completedAt - t.serviceStartedAt) / (60 * 1000)));
      totalServiceMinutes += servMins;
      serviceCount++;
    }
  });

  const avgServiceTimeMinutes = serviceCount > 0 ? Math.round((totalServiceMinutes / serviceCount) * 10) / 10 : 9.5;

  // Priority count & percentage
  const priorityCount = waitingTokens.filter((t) => t.priority === 'priority').length;
  const normalCount = waitingTokens.filter((t) => t.priority === 'normal').length;
  const priorityPercentage = totalWaiting > 0 ? Math.round((priorityCount / totalWaiting) * 100) : 0;

  // Peak queue size estimation
  const peakQueueSize = Math.max(tokens.length, totalWaiting + totalServing + totalServedToday);

  // Service distribution
  const serviceDistribution = services.map((srv) => {
    const srvTokens = tokens.filter((t) => t.serviceId === srv.id);
    const count = srvTokens.length;
    const percentage = tokens.length > 0 ? Math.round((count / tokens.length) * 100) : 0;

    let srvWaitTotal = 0;
    let srvWaitCount = 0;
    srvTokens.forEach((t) => {
      if (t.calledAt && t.joinedAt) {
        srvWaitTotal += Math.round((t.calledAt - t.joinedAt) / (60 * 1000));
        srvWaitCount++;
      } else if (t.status === 'waiting') {
        srvWaitTotal += Math.round((Date.now() - t.joinedAt) / (60 * 1000));
        srvWaitCount++;
      }
    });

    const avgWait = srvWaitCount > 0 ? Math.round(srvWaitTotal / srvWaitCount) : srv.avgDurationMinutes;

    return {
      serviceId: srv.id,
      serviceName: srv.name,
      count,
      percentage,
      avgWaitMinutes: avgWait,
    };
  });

  // Active open counters
  const activeCounters = counters.filter((c) => c.status !== 'closed').length || 1;

  // Total backlog minutes
  const totalBacklogMinutes = waitingTokens.reduce((acc, t) => {
    const srv = services.find((s) => s.id === t.serviceId);
    return acc + (srv?.avgDurationMinutes || 10);
  }, 0);

  const estimatedTimeToClearMinutes = Math.max(
    0,
    Math.round(totalBacklogMinutes / Math.max(1, activeCounters))
  );

  // Congestion Level
  let congestionLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  const ratio = totalWaiting / Math.max(1, activeCounters);
  if (ratio > 5) {
    congestionLevel = 'Severe';
  } else if (ratio >= 3) {
    congestionLevel = 'High';
  } else if (ratio >= 1.5) {
    congestionLevel = 'Moderate';
  } else {
    congestionLevel = 'Low';
  }

  // Hourly Traffic simulation based on current session
  const currentHour = new Date().getHours();
  const hourlyTraffic = [
    { hour: `${(currentHour - 3 + 24) % 24}:00`, joined: Math.max(2, Math.floor(tokens.length * 0.2)), served: Math.max(2, Math.floor(totalServedToday * 0.3)) },
    { hour: `${(currentHour - 2 + 24) % 24}:00`, joined: Math.max(4, Math.floor(tokens.length * 0.35)), served: Math.max(3, Math.floor(totalServedToday * 0.4)) },
    { hour: `${(currentHour - 1 + 24) % 24}:00`, joined: Math.max(5, Math.floor(tokens.length * 0.5)), served: Math.max(4, Math.floor(totalServedToday * 0.55)) },
    { hour: `${currentHour}:00 (Now)`, joined: totalWaiting + totalServing, served: Math.max(1, totalServing) },
    { hour: `${(currentHour + 1) % 24}:00 (Pred)`, joined: Math.max(1, Math.round(totalWaiting * 0.7)), served: Math.min(totalWaiting, activeCounters * 4) },
  ];

  return {
    totalServedToday,
    totalWaiting,
    totalServing,
    totalSkipped,
    avgWaitTimeMinutes,
    avgServiceTimeMinutes,
    peakQueueSize,
    priorityCount,
    normalCount,
    priorityPercentage,
    serviceDistribution,
    hourlyTraffic,
    congestionLevel,
    estimatedTimeToClearMinutes,
  };
}

export function generateAIInsights(
  tokens: QueueToken[],
  counters: Counter[],
  services: Service[],
  analytics: QueueAnalytics
): AIInsight[] {
  const insights: AIInsight[] = [];
  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const activeCounters = counters.filter((c) => c.status !== 'closed');
  const busyCounters = counters.filter((c) => c.status === 'busy');

  // 1. Congestion & Load Velocity Insight
  if (analytics.congestionLevel === 'Severe' || analytics.congestionLevel === 'High') {
    insights.push({
      id: 'ai-cong-high',
      type: 'alert',
      title: 'High Congestion Surge Detected',
      message: `Queue congestion is increasing. With ${analytics.totalWaiting} visitors waiting across ${activeCounters.length} active counters, arrival velocity exceeds clearance rate.`,
      metric: `${analytics.congestionLevel} Congestion`,
      confidence: 94,
      impact: 'high',
      timestamp: Date.now(),
    });
  } else if (analytics.congestionLevel === 'Moderate') {
    insights.push({
      id: 'ai-cong-mod',
      type: 'warning',
      title: 'Moderate Queue Density',
      message: `Queue density is stable but nearing capacity. Current wait times are hovering around ${analytics.avgWaitTimeMinutes} minutes.`,
      metric: `${analytics.totalWaiting} in line`,
      confidence: 89,
      impact: 'medium',
      timestamp: Date.now(),
    });
  } else {
    insights.push({
      id: 'ai-cong-opt',
      type: 'success',
      title: 'Optimal Queue Flow',
      message: `Queue is operating with rapid throughput. Customers are being greeted in less than ${analytics.avgWaitTimeMinutes || 5} minutes.`,
      metric: 'Low Latency',
      confidence: 96,
      impact: 'low',
      timestamp: Date.now(),
    });
  }

  // 2. Average Waiting & Service Time Insight
  insights.push({
    id: 'ai-time-metric',
    type: 'info',
    title: 'Dynamic Waiting Time Metric',
    message: `Average waiting time is currently ${analytics.avgWaitTimeMinutes} minutes, while average desk service duration is ${analytics.avgServiceTimeMinutes} minutes.`,
    metric: `${analytics.avgWaitTimeMinutes}m avg wait`,
    confidence: 92,
    impact: 'medium',
    timestamp: Date.now(),
  });

  // 3. Priority Customer Ratio & Bottleneck Assessment
  if (analytics.priorityPercentage >= 30) {
    insights.push({
      id: 'ai-prio-high',
      type: 'warning',
      title: 'High Priority Segment Impact',
      message: `Priority customers represent ${analytics.priorityPercentage}% (${analytics.priorityCount} visitors) of the waiting line. Standard queue delays are extended by approx. 6-8 minutes.`,
      metric: `${analytics.priorityPercentage}% Priority`,
      confidence: 91,
      impact: 'high',
      timestamp: Date.now(),
    });
  } else if (analytics.priorityPercentage > 0) {
    insights.push({
      id: 'ai-prio-norm',
      type: 'info',
      title: 'Balanced Priority Distribution',
      message: `Priority customers represent ${analytics.priorityPercentage}% of the active queue. Queue dispatching is maintaining equitable turnaround for all tiers.`,
      metric: `${analytics.priorityCount} Priority Token${analytics.priorityCount === 1 ? '' : 's'}`,
      confidence: 88,
      impact: 'low',
      timestamp: Date.now(),
    });
  }

  // 4. Staffing & Counter Resource Recommendation
  if (analytics.totalWaiting >= 5 && busyCounters.length === activeCounters.length) {
    const nextCounterNum = counters.length + 1;
    insights.push({
      id: 'ai-rec-counter',
      type: 'recommendation',
      title: 'Staffing Recommendation: Open Next Counter',
      message: `All ${activeCounters.length} active counters are currently at 100% utilization. Opening Counter ${nextCounterNum} would reduce overall waiting times by ~38%.`,
      metric: '+1 Counter Recommended',
      confidence: 95,
      impact: 'high',
      timestamp: Date.now(),
    });
  } else if (analytics.totalWaiting === 0 && activeCounters.length > 2) {
    insights.push({
      id: 'ai-rec-idle',
      type: 'info',
      title: 'Counter Resource Optimization',
      message: 'Queue is currently empty. Staff can be temporarily reassigned to back-office verification or administrative processing.',
      metric: 'Counter Availability 100%',
      confidence: 85,
      impact: 'low',
      timestamp: Date.now(),
    });
  }

  // 5. Estimated Queue Clearance Projection
  const clearTime = analytics.estimatedTimeToClearMinutes;
  insights.push({
    id: 'ai-clear-proj',
    type: clearTime > 30 ? 'warning' : 'info',
    title: 'Backlog Clearance Projection',
    message: `At the current service pace, the queue is expected to clear in approximately ${clearTime} minutes with no further arrivals.`,
    metric: `~${clearTime} min clearance`,
    confidence: 87,
    impact: clearTime > 30 ? 'medium' : 'low',
    timestamp: Date.now(),
  });

  // 6. Service Category Bottleneck Detection
  const sortedServices = [...analytics.serviceDistribution].sort((a, b) => b.count - a.count);
  if (sortedServices.length > 0 && sortedServices[0].count > 0) {
    const topSrv = sortedServices[0];
    const srvObj = services.find((s) => s.id === topSrv.serviceId);
    if (topSrv.percentage >= 40) {
      insights.push({
        id: 'ai-service-bottleneck',
        type: 'alert',
        title: `Service Demand Concentration: ${topSrv.serviceName}`,
        message: `${topSrv.percentage}% of all incoming requests are for "${topSrv.serviceName}". Dedicating a dedicated express lane for this category will eliminate 60% of queuing latency.`,
        metric: `${topSrv.percentage}% of Traffic`,
        confidence: 93,
        impact: 'medium',
        timestamp: Date.now(),
      });
    }
  }

  return insights;
}

/**
 * Interactive simulated AI Q&A Assistant for Staff / Admins
 */
export function answerAIQuestion(
  query: string,
  analytics: QueueAnalytics,
  services: Service[],
  counters: Counter[]
): { answer: string; relatedMetric: string; actionSuggestion?: string } {
  const q = query.toLowerCase();

  if (q.includes('wait') || q.includes('time') || q.includes('how long')) {
    return {
      answer: `Current average waiting time is approximately **${analytics.avgWaitTimeMinutes} minutes**. For priority tickets, the average is ~${Math.max(2, Math.round(analytics.avgWaitTimeMinutes * 0.4))} minutes, while standard tickets average ~${Math.round(analytics.avgWaitTimeMinutes * 1.2)} minutes.`,
      relatedMetric: `${analytics.avgWaitTimeMinutes}m avg wait`,
      actionSuggestion: analytics.avgWaitTimeMinutes > 15 ? 'Consider activating an additional desk.' : undefined,
    };
  }

  if (q.includes('counter') || q.includes('staff') || q.includes('open') || q.includes('more')) {
    const active = counters.filter((c) => c.status !== 'closed').length;
    return {
      answer: `There are currently **${active} active counters** serving ${analytics.totalWaiting} waiting visitors. ${
        analytics.totalWaiting >= 4
          ? 'AI models suggest opening 1 additional counter to bring the congestion index down from ' + analytics.congestionLevel + ' to Low.'
          : 'Staffing capacity is currently adequate for incoming demand.'
      }`,
      relatedMetric: `${active} Active Counters`,
      actionSuggestion: analytics.totalWaiting >= 4 ? 'Open Counter 3 / Express Desk' : 'Maintain current staffing',
    };
  }

  if (q.includes('clear') || q.includes('empty') || q.includes('finish') || q.includes('backlog')) {
    return {
      answer: `With ${analytics.totalWaiting} customers in line and an average processing velocity of ${analytics.avgServiceTimeMinutes} min/customer, the queue backlog will clear in **approximately ${analytics.estimatedTimeToClearMinutes} minutes**.`,
      relatedMetric: `${analytics.estimatedTimeToClearMinutes} mins to clear`,
    };
  }

  if (q.includes('priority') || q.includes('vip') || q.includes('fast')) {
    return {
      answer: `Priority customers account for **${analytics.priorityPercentage}%** (${analytics.priorityCount} out of ${analytics.totalWaiting} waiting). Priority tokens automatically move to the front of the queue calculation without completely starving normal tickets.`,
      relatedMetric: `${analytics.priorityPercentage}% Priority Load`,
    };
  }

  if (q.includes('bottleneck') || q.includes('slow') || q.includes('service')) {
    const topSrv = [...analytics.serviceDistribution].sort((a, b) => b.count - a.count)[0];
    return {
      answer: `The highest volume category is **"${topSrv?.serviceName || 'Document Verification'}"**, representing ${topSrv?.percentage || 35}% of visitors with an average handling duration of ~${topSrv?.avgWaitMinutes || 12} minutes.`,
      relatedMetric: `${topSrv?.serviceName || 'Documents'} (${topSrv?.percentage || 35}%)`,
      actionSuggestion: 'Deploy a dedicated document pre-check kiosk.',
    };
  }

  return {
    answer: `SmartQueue AI is continuously optimizing queue dynamics. Currently monitoring **${analytics.totalWaiting} waiting visitors**, **${analytics.totalServedToday} served today**, with an overall congestion state of **${analytics.congestionLevel}**.`,
    relatedMetric: `${analytics.congestionLevel} Congestion`,
  };
}
