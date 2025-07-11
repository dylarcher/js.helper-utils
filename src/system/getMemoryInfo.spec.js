import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import { getMemoryInfo } from './getMemoryInfo.js';

describe('getMemoryInfo()', () => {
	it('should return an object with totalMemory and freeMemory properties', () => {
		const memInfo = getMemoryInfo();

		assert.strictEqual(typeof memInfo, 'object', 'Should return an object');
		assert.ok('totalMemory' in memInfo, 'Should have totalMemory property');
		assert.ok('freeMemory' in memInfo, 'Should have freeMemory property');
	});

	it('should return numbers for memory values', () => {
		const memInfo = getMemoryInfo();

		assert.strictEqual(
			typeof memInfo.totalMemory,
			'number',
			'totalMemory should be a number',
		);
		assert.strictEqual(
			typeof memInfo.freeMemory,
			'number',
			'freeMemory should be a number',
		);
	});

	it('should return values that closely match os module values', () => {
		const memInfo = getMemoryInfo();
		const osFreeMemory = os.freemem();
		const osTotalMemory = os.totalmem();

		// Allow for small differences due to timing (memory values change constantly)
		const tolerance = 1024 * 1024; // 1MB tolerance

		assert.ok(
			Math.abs(memInfo.freeMemory - osFreeMemory) <= tolerance,
			`freeMemory (${memInfo.freeMemory}) should be within ${tolerance} bytes of os.freemem() (${osFreeMemory})`,
		);
		assert.strictEqual(
			memInfo.totalMemory,
			osTotalMemory,
			'totalMemory should match os.totalmem()',
		);
	});

	it('should return positive memory values', () => {
		const memInfo = getMemoryInfo();

		assert.ok(memInfo.totalMemory > 0, 'totalMemory should be positive');
		assert.ok(memInfo.freeMemory >= 0, 'freeMemory should be non-negative');
	});

	it('should have freeMemory less than or equal to totalMemory', () => {
		const memInfo = getMemoryInfo();

		assert.ok(
			memInfo.freeMemory <= memInfo.totalMemory,
			'freeMemory should not exceed totalMemory',
		);
	});

	it('should be consistent with os.totalmem() and os.freemem()', () => {
		const memInfo = getMemoryInfo();
		const osTotalMem = os.totalmem();
		const osFreeMem = os.freemem();

		assert.strictEqual(
			memInfo.totalMemory,
			osTotalMem,
			'totalMemory should match os.totalmem()',
		);

		// Allow for small variance in free memory due to system activity
		// between the two calls (typically within a few MB)
		const memoryDifference = Math.abs(memInfo.freeMemory - osFreeMem);
		const maxAllowedDifference = 100 * 1024 * 1024; // 100MB tolerance

		assert.ok(
			memoryDifference <= maxAllowedDifference,
			`freeMemory should be close to os.freemem() (difference: ${memoryDifference} bytes, max allowed: ${maxAllowedDifference} bytes)`,
		);
	});

	it('should return reasonable memory values', () => {
		const memInfo = getMemoryInfo();

		// Modern systems should have at least 1GB of total memory (1,073,741,824 bytes)
		assert.ok(
			memInfo.totalMemory >= 1073741824,
			'Should have at least 1GB total memory',
		);

		// Total memory should be less than 1TB (1,099,511,627,776 bytes) for most systems
		assert.ok(
			memInfo.totalMemory < 1099511627776,
			'Total memory should be reasonable (< 1TB)',
		);
	});

	it('should return consistent totalMemory across calls', () => {
		const memInfo1 = getMemoryInfo();
		const memInfo2 = getMemoryInfo();

		assert.strictEqual(
			memInfo1.totalMemory,
			memInfo2.totalMemory,
			'totalMemory should be consistent',
		);
	});

	it('should return memory values in bytes', () => {
		const memInfo = getMemoryInfo();

		// Memory values should be whole numbers (bytes)
		assert.strictEqual(
			memInfo.totalMemory % 1,
			0,
			'totalMemory should be a whole number',
		);
		assert.strictEqual(
			memInfo.freeMemory % 1,
			0,
			'freeMemory should be a whole number',
		);
	});

	it('should show that freeMemory can vary between calls', () => {
		const memInfo1 = getMemoryInfo();

		// Do some memory allocation to potentially change free memory
		const largeArray = new Array(1000000).fill(0);

		const memInfo2 = getMemoryInfo();

		// Free memory might change, but total should remain the same
		assert.strictEqual(
			memInfo1.totalMemory,
			memInfo2.totalMemory,
			'totalMemory should remain constant',
		);

		// Clean up
		largeArray.length = 0;
	});

	it('should have reasonable free memory percentage', () => {
		const memInfo = getMemoryInfo();
		const freePercentage = (memInfo.freeMemory / memInfo.totalMemory) * 100;

		// Free memory should be between 0% and 100%
		assert.ok(
			freePercentage >= 0,
			'Free memory percentage should be non-negative',
		);
		assert.ok(
			freePercentage <= 100,
			'Free memory percentage should not exceed 100%',
		);
	});

	it('should return only the expected properties', () => {
		const memInfo = getMemoryInfo();
		const keys = Object.keys(memInfo);

		assert.strictEqual(keys.length, 2, 'Should have exactly 2 properties');
		assert.ok(keys.includes('totalMemory'), 'Should include totalMemory');
		assert.ok(keys.includes('freeMemory'), 'Should include freeMemory');
	});

	it('should handle memory values as integers', () => {
		const memInfo = getMemoryInfo();

		assert.ok(
			Number.isInteger(memInfo.totalMemory),
			'totalMemory should be an integer',
		);
		assert.ok(
			Number.isInteger(memInfo.freeMemory),
			'freeMemory should be an integer',
		);
	});
});
