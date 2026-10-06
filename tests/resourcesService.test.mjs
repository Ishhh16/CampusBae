import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Exercise the real service with a paginated Data API substitute, without
// needing credentials or modifying the production resource index.
const bundled = await build({
  entryPoints: ['src/services/resourcesService.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  plugins: [{
    name: 'resource-database-fixture',
    setup(build) {
      build.onResolve({ filter: /supabaseClient$/ }, () => ({ path: 'fixture', namespace: 'fixture' }));
      build.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `
        export const supabase = { from() { return {
          select() { return this; }, order() { return this; },
          async range(start, end) {
            globalThis.resourcePageRequests.push([start, end]);
            return { data: globalThis.resourceFixture.slice(start, end + 1), error: null };
          }
        }; } };
      ` }));
    },
  }],
});
const { resourcesService } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const row = (path, id) => ({ id: String(id), file_path: path, file_name: path.split('/').at(-1), public_url: 'https://drive.google.com/file/d/fixture/view', created_at: '2026-10-06' });
const cases = [
  ['IKS&UHV/pyqs/uhv end 2026.pdf', 'IKS/UHV', 'pyqs'],
  ['IKS/UH/PYQ/END SEM/paper.pdf', 'IKS/UHV', 'pyqs'],
  ['SWE/pyqs/mid sem /paper.pdf', 'Software Engineering (SE)', 'pyqs'],
  ['TOC/pyqs/end sem/paper.pdf', 'Theory of Computation (BCS 301)', 'pyqs'],
  ['DCCN/pyqs/mid sem/paper.pdf', 'Data Communication and Computer Networks (BIT 301)', 'pyqs'],
  ['itw/pyqs/paper.pdf', 'IT Workshop - ITW (BAI 102)', 'pyqs'],
  ['eme/pyqs/paper.pdf', 'Elements of Mechanical Engineering - EME (BMA 106)', 'pyqs'],
  ['WP/NOTES/sheetmetalshop.pdf', 'Workshop Practice - WP (BMA 107)', 'notes'],
  ['PT/PYQS/MID SEM/paper.pdf', 'Production Technology - I (PT1)', 'pyqs'],
  ['PT-1/notes/unit.pdf', 'Production Technology - I (PT1)', 'notes'],
  ['EMATERIAL /PYQS/MID SEM/paper.pdf', 'Engineering Materials (EM)', 'pyqs'],
  ['EMECH/PYQ/END-SEM/paper.pdf', 'Engineering Mechanics - EM (BMA 103)', 'pyqs'],
  ['OOPS/pyqs/paper.pdf', 'Object Oriented Programming (BIT 202)', 'pyqs'],
  ['AI/pyqs/paper.pdf', 'Artificial Intelligence (BAI 202)', 'pyqs'],
  ['HCI/pyqs/paper.pdf', 'Human Computer Interaction (BCS 303)', 'pyqs'],
  ['CRPYT/pyqs/paper.pdf', 'Cryptography (BIT 319)', 'pyqs'],
  ['CRYPTO/pyqs/paper.pdf', 'Cryptography (BIT 319)', 'pyqs'],
  ['CSSA/pyqs/paper.pdf', 'Cloud Computing Systems and Applications (BCS 304)', 'pyqs'],
  ['FES/pyqs/paper.pdf', 'Fundamentals of Electrical Sciences - FES (BEC 105)', 'pyqs'],
  ['DSD/pyqs/paper.pdf', 'Digital System Design (DSD)', 'pyqs'],
  ['DSD/Registers.pptx', 'Digital System Design (DSD)', 'notes'],
  ['MTT/pyqs/paper.pdf', 'Microwave Theory and Techniques (BEC 303)', 'pyqs'],
  ['CA/pyqs/paper.pdf', 'Computer Architecture (BEC 305)', 'pyqs'],
];
globalThis.resourceFixture = [
  ...Array.from({ length: 1000 }, (_, i) => row(`Unrelated/notes/filler-${i}.pdf`, i)),
  ...cases.map(([path], i) => row(path, 1000 + i)),
  row('ITW/pyqs/.emptyfolderplaceholder', 2000),
];
globalThis.resourcePageRequests = [];
const originalLog = console.log;
console.log = () => {};
try {
  const all = await resourcesService.getAllResources();
  assert.equal(all.length, 1000 + cases.length);
  assert.deepEqual(globalThis.resourcePageRequests, [[0, 999], [1000, 1999]]);
  for (const [path, subject, type] of cases) {
    const matches = await resourcesService.getFilteredFiles({ subjects: [subject], types: [type] });
    assert(matches.some(resource => resource.fullPath === path), `${subject} must include ${path}`);
    assert(matches.every(resource => resource.subject === subject && resource.type === type));
  }
  const materials = await resourcesService.getFilteredFiles({ subjects: ['Engineering Materials (EM)'], types: ['pyqs'] });
  assert(!materials.some(resource => resource.fullPath.startsWith('EMECH/')));
  const earlierOOPS = await resourcesService.getFilteredFiles({ subjects: ['Object Oriented Programming System - OOPS (BIT 102)'], types: ['pyqs'] });
  assert(earlierOOPS.some(resource => resource.fullPath === 'OOPS/pyqs/paper.pdf'));
  const earlierAI = await resourcesService.getFilteredFiles({ subjects: ['Artificial Intelligence (AI)'], types: ['pyqs'] });
  assert(earlierAI.some(resource => resource.fullPath === 'AI/pyqs/paper.pdf'));
  const earlierDCCN = await resourcesService.getFilteredFiles({ subjects: ['Data Communication and Computer Networks (DCCN)'], types: ['pyqs'] });
  assert(earlierDCCN.some(resource => resource.fullPath === 'DCCN/pyqs/mid sem/paper.pdf'));
  const nested = await resourcesService.getFilteredFiles({ subjects: ['IKS/UHV'], types: ['pyqs'], searchQuery: 'paper' });
  assert.equal(nested.length, 1);
  assert.equal(nested[0].unit, 'END SEM');
  assert.deepEqual(await resourcesService.getFilteredFiles({ subjects: [], types: ['pyqs'] }), []);
} finally {
  console.log = originalLog;
}
console.log(`Passed pagination, ${cases.length} mapping cases, curriculum compatibility, search and placeholder checks.`);
