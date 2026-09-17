import { Panel } from './Panel';
import {
  DEMO_FREIGHT_COMPANY,
  FREIGHT_EVENTS,
  FREIGHT_NETWORK_SUMMARY,
  type FreightSeverity,
} from '@/config/freight';
import { escapeHtml, unsafeRawHtml } from '@/utils/sanitize';

const severityRank: Record<FreightSeverity, number> = { high: 0, medium: 1, low: 2 };

function injectStyles(): void {
  if (document.getElementById('freight-monitor-panel-styles')) return;
  const style = document.createElement('style');
  style.id = 'freight-monitor-panel-styles';
  style.textContent = `
    .fm-stack{display:grid;gap:10px;padding:4px}.fm-kicker{display:flex;align-items:center;gap:7px;color:var(--text-secondary);font-size:10px;letter-spacing:.08em;text-transform:uppercase}.fm-status{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:3px 7px;font-weight:700}.fm-status--sim{border-color:rgba(245,166,35,.45);color:#f5a623;background:rgba(245,166,35,.09)}.fm-score-row{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}.fm-score{font-size:38px;font-weight:800;line-height:1;color:#f5a623}.fm-score small{font-size:13px;color:var(--text-secondary);font-weight:600}.fm-state{font-size:12px;font-weight:800;letter-spacing:.08em;color:#f5a623}.fm-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.fm-metric{padding:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:7px}.fm-metric strong{display:block;font-size:20px;line-height:1.1}.fm-metric span{display:block;margin-top:4px;color:var(--text-secondary);font-size:10px}.fm-event{display:grid;grid-template-columns:7px 1fr auto;gap:9px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.07)}.fm-event:last-child{border-bottom:0}.fm-severity{width:7px;height:7px;border-radius:50%;margin-top:5px}.fm-severity--high{background:#ff4d4f;box-shadow:0 0 8px rgba(255,77,79,.45)}.fm-severity--medium{background:#f5a623}.fm-severity--low{background:#44a5ff}.fm-event-title{font-size:12px;font-weight:700}.fm-event-meta,.fm-event-summary{font-size:10px;color:var(--text-secondary);margin-top:2px}.fm-event-count{font-size:10px;text-align:right;color:var(--text-secondary);white-space:nowrap}.fm-profile-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.fm-company{font-size:15px;font-weight:800}.fm-profile-score{font-size:28px;font-weight:800;color:#52c878;text-align:right}.fm-profile-score small{display:block;font-size:9px;color:var(--text-secondary);font-weight:600}.fm-bars{display:grid;gap:8px}.fm-bar-head{display:flex;justify-content:space-between;font-size:10px}.fm-bar-track{height:5px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.fm-bar-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#43c67a,#f5a623,#ff4d4f)}.fm-callout{padding:9px 10px;border-left:2px solid #f5a623;background:rgba(245,166,35,.07);font-size:10px;color:var(--text-secondary)}
  `;
  document.head.appendChild(style);
}

function simulatedBadge(): string {
  return '<span class="fm-status fm-status--sim">SIMULATED DATA</span>';
}

export class FreightNetworkStatusPanel extends Panel {
  constructor() {
    super({ id: 'freight-network-status', title: 'Australia Freight Risk', infoTooltip: 'Prototype network-risk summary. All values in this panel are deterministic simulated data.' });
    injectStyles();
    const s = FREIGHT_NETWORK_SUMMARY;
    this.setSafeContent(unsafeRawHtml(`<div class="fm-stack" data-data-status="${s.dataStatus}"><div class="fm-kicker">Current network risk ${simulatedBadge()}</div><div class="fm-score-row"><div class="fm-score">${s.riskScore}<small>/100</small></div><div class="fm-state">${s.status}</div></div><div class="fm-metrics"><div class="fm-metric"><strong>${s.roadDisruptions}</strong><span>Road disruptions</span></div><div class="fm-metric"><strong>${s.severeWeatherZones}</strong><span>Weather / marine risks</span></div><div class="fm-metric"><strong>${s.portDisruptions}</strong><span>Port disruptions</span></div><div class="fm-metric"><strong>${s.exposedCorridors}</strong><span>Corridors exposed</span></div></div></div>`, 'deterministic freight MVP fixture'));
  }
}

export class FreightExposurePanel extends Panel {
  constructor() {
    super({ id: 'active-exposures', title: 'Active Exposures', defaultRowSpan: 2, infoTooltip: 'Prototype exposure events located on real freight corridors. Events are simulated and labelled accordingly.' });
    injectStyles();
    const rows = [...FREIGHT_EVENTS].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]).map((event) => `<div class="fm-event" data-event-id="${escapeHtml(event.id)}" data-data-status="${event.dataStatus}"><span class="fm-severity fm-severity--${event.severity}"></span><div><div class="fm-event-title">${escapeHtml(event.title)}</div><div class="fm-event-meta">${escapeHtml(event.location)} · ${escapeHtml(event.corridor)}</div><div class="fm-event-summary">${escapeHtml(event.summary)}</div></div><div class="fm-event-count">${event.affectedJourneys}<br/>journeys</div></div>`).join('');
    this.setSafeContent(unsafeRawHtml(`<div class="fm-stack"><div class="fm-kicker">Prioritised by severity ${simulatedBadge()}</div>${rows}</div>`, 'deterministic freight MVP fixture'));
  }
}

export class FreightRiskProfilePanel extends Panel {
  constructor() {
    super({ id: 'freight-risk-profile', title: 'Freight Risk Profile', defaultRowSpan: 2, infoTooltip: 'Explainable prototype risk profile for an invented freight operator. It is not an insurance score.' });
    injectStyles();
    const c = DEMO_FREIGHT_COMPANY;
    const bars = c.riskDrivers.map((driver) => `<div><div class="fm-bar-head"><span>${escapeHtml(driver.label)}</span><strong>${escapeHtml(driver.value)}</strong></div><div class="fm-bar-track"><div class="fm-bar-fill" style="width:${driver.score}%"></div></div></div>`).join('');
    this.setSafeContent(unsafeRawHtml(`<div class="fm-stack" data-data-status="${c.dataStatus}"><div class="fm-kicker">Demo operator ${simulatedBadge()}</div><div class="fm-profile-head"><div><div class="fm-company">${escapeHtml(c.name)}</div><div class="fm-event-meta">${c.vehicles} vehicles · ${c.movingVehicles} moving · ${c.exposedVehicles} exposed</div></div><div class="fm-profile-score">${c.operationalRiskScore}<small>LOW–MODERATE</small></div></div><div class="fm-bars">${bars}</div><div class="fm-callout"><strong>Primary risk driver:</strong> ${escapeHtml(c.primaryRiskDriver)}</div></div>`, 'deterministic freight MVP fixture'));
  }
}
