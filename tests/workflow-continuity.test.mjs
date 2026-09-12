import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const ci = readFileSync('.github/workflows/ci.yml', 'utf8')
let autoMerge = ''
try {
  autoMerge = readFileSync('.github/workflows/pr-auto-merge.yml', 'utf8')
} catch {}

assert.match(ci, /workflow_dispatch:/, 'CI must support explicit post-merge revalidation')
assert.match(autoMerge, /cancel-in-progress: true/, 'duplicate merge triggers must coalesce')
assert.match(autoMerge, /actions: write/, 'auto-merge must be able to dispatch CI')
assert.match(autoMerge, /merged_main_sha/, 'already-merged runs must resume from the merge SHA')
assert.match(autoMerge, /actions\/workflows\/ci\.yml\/dispatches/, 'merged main must be revalidated')
assert.match(autoMerge, /-f sha="\$HEAD_SHA"/, 'merge must be pinned to the validated head SHA')
