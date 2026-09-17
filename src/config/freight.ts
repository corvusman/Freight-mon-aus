export type FreightSeverity = 'high' | 'medium' | 'low';
export type FreightDataStatus = 'LIVE' | 'DELAYED' | 'HISTORICAL' | 'SIMULATED';

export interface FreightEvent {
  id: string;
  title: string;
  location: string;
  corridor: string;
  mode: 'road' | 'port' | 'maritime' | 'weather';
  severity: FreightSeverity;
  lat: number;
  lon: number;
  summary: string;
  affectedJourneys: number;
  source: string;
  dataStatus: FreightDataStatus;
}

/**
 * Deterministic prototype fixtures anchored to real Australian freight nodes.
 * They exercise the production event model without presenting invented events
 * as live observations. Replace this export with feed adapters as each source
 * is connected; consumers must continue to surface dataStatus and source.
 */
export const FREIGHT_EVENTS: readonly FreightEvent[] = [
  {
    id: 'sim-bruce-gympie-flood',
    title: 'Flooding affecting Bruce Highway',
    location: 'Gympie, QLD',
    corridor: 'Bruce Highway',
    mode: 'road',
    severity: 'high',
    lat: -26.19,
    lon: 152.67,
    summary: 'Northbound freight movements are being diverted around a simulated 9.4 km closure.',
    affectedJourneys: 14,
    source: 'SIMULATED_QLD_TRAFFIC',
    dataStatus: 'SIMULATED',
  },
  {
    id: 'sim-port-botany-wind',
    title: 'Strong winds at Port Botany',
    location: 'Port Botany, NSW',
    corridor: 'Port Botany → Western Sydney',
    mode: 'port',
    severity: 'high',
    lat: -33.97,
    lon: 151.22,
    summary: 'Crane operations and empty-container movements may be constrained during the simulated wind window.',
    affectedJourneys: 9,
    source: 'SIMULATED_MARINE_WEATHER',
    dataStatus: 'SIMULATED',
  },
  {
    id: 'sim-hume-incident',
    title: 'Multi-vehicle incident on Hume Highway',
    location: 'Gundagai, NSW',
    corridor: 'Sydney → Melbourne',
    mode: 'road',
    severity: 'medium',
    lat: -35.07,
    lon: 148.10,
    summary: 'One southbound lane is unavailable with a simulated delay estimate of 48 minutes.',
    affectedJourneys: 6,
    source: 'SIMULATED_LIVE_TRAFFIC_NSW',
    dataStatus: 'SIMULATED',
  },
  {
    id: 'sim-melbourne-port-congestion',
    title: 'Elevated container dwell time',
    location: 'Port of Melbourne, VIC',
    corridor: 'Port Melbourne → Dandenong',
    mode: 'port',
    severity: 'medium',
    lat: -37.83,
    lon: 144.91,
    summary: 'Simulated terminal dwell time is 31% above the rolling baseline.',
    affectedJourneys: 5,
    source: 'SIMULATED_PORT_ACTIVITY',
    dataStatus: 'SIMULATED',
  },
  {
    id: 'sim-bass-strait-swell',
    title: 'High swell across Bass Strait',
    location: 'Bass Strait',
    corridor: 'Melbourne → Tasmania',
    mode: 'maritime',
    severity: 'low',
    lat: -39.35,
    lon: 146.20,
    summary: 'A simulated 4.1 m swell may affect RoRo schedules and exposed cargo.',
    affectedJourneys: 2,
    source: 'SIMULATED_MARINE_WEATHER',
    dataStatus: 'SIMULATED',
  },
];

export const DEMO_FREIGHT_COMPANY = {
  name: 'Pacific Freight Logistics',
  vehicles: 38,
  movingVehicles: 12,
  exposedVehicles: 4,
  operationalRiskScore: 34,
  currentExposure: 'MODERATE',
  riskDrivers: [
    { label: 'Flood exposure', value: 'Moderate', score: 52 },
    { label: 'Severe weather', value: 'Low', score: 28 },
    { label: 'Route concentration', value: 'High', score: 71 },
    { label: 'Disruption management', value: 'Good', score: 24 },
  ],
  primaryRiskDriver: '71% of east-coast freight relies on three corridors.',
  dataStatus: 'SIMULATED' as const,
};

export const FREIGHT_NETWORK_SUMMARY = {
  riskScore: 62,
  status: 'ELEVATED',
  roadDisruptions: FREIGHT_EVENTS.filter((event) => event.mode === 'road').length,
  severeWeatherZones: FREIGHT_EVENTS.filter((event) => event.mode === 'weather' || event.mode === 'maritime').length,
  portDisruptions: FREIGHT_EVENTS.filter((event) => event.mode === 'port').length,
  exposedCorridors: new Set(FREIGHT_EVENTS.map((event) => event.corridor)).size,
  dataStatus: 'SIMULATED' as const,
};
