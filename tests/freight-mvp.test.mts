import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEMO_FREIGHT_COMPANY,
  FREIGHT_EVENTS,
  FREIGHT_NETWORK_SUMMARY,
} from '../src/config/freight.ts';

test('prototype freight events always disclose simulated provenance', () => {
  assert.ok(FREIGHT_EVENTS.length >= 5);
  for (const event of FREIGHT_EVENTS) {
    assert.equal(event.dataStatus, 'SIMULATED');
    assert.match(event.source, /^SIMULATED_/);
    assert.ok(Number.isFinite(event.lat));
    assert.ok(Number.isFinite(event.lon));
    assert.ok(event.affectedJourneys >= 0);
  }
});

test('network summary remains derived from the event fixtures', () => {
  assert.equal(
    FREIGHT_NETWORK_SUMMARY.roadDisruptions,
    FREIGHT_EVENTS.filter((event) => event.mode === 'road').length,
  );
  assert.equal(
    FREIGHT_NETWORK_SUMMARY.portDisruptions,
    FREIGHT_EVENTS.filter((event) => event.mode === 'port').length,
  );
  assert.equal(FREIGHT_NETWORK_SUMMARY.dataStatus, 'SIMULATED');
});

test('demo operator is visibly synthetic and has an explainable risk profile', () => {
  assert.equal(DEMO_FREIGHT_COMPANY.dataStatus, 'SIMULATED');
  assert.ok(DEMO_FREIGHT_COMPANY.riskDrivers.length >= 4);
  assert.ok(DEMO_FREIGHT_COMPANY.primaryRiskDriver.length > 0);
  assert.ok(DEMO_FREIGHT_COMPANY.operationalRiskScore >= 0);
  assert.ok(DEMO_FREIGHT_COMPANY.operationalRiskScore <= 100);
});
