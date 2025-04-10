import { Parser, Scanner } from '../src/parser';
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';

describe('Parsing', () => {
  test('', () => {
    const data = fs.readFileSync('tests/email-password-recovery-code.csv', 'utf8');
    const scanner = new Scanner(data, ";");
    const parser = new Parser(scanner.ScanTokens());
    const result = parser.Parse();
    
    expect(result).toBeDefined();
    expect(result.length).toBe(6);

    // Test the header row
    expect(result[0]).toEqual([
      'Login email',
      'Identifier',
      'One-time password',
      'Recovery code',
      'First name',
      'Last name',
      'Department',
      'Location',
    ]);

    // Test the data rows
    expect(result[1]).toEqual([
      'rachel@example.com',
      '9012',
      '12se74',
      'rb9012',
      'Rachel',
      'Booker',
      'Sales',
      'Manchester',
    ]);

    expect(result[2]).toEqual([
      'laura@example.com',
      '2070',
      '04ap67',
      'lg2070',
      'Laura',
      'Grey',
      'Depot',
      'London',
    ]);

    expect(result[3]).toEqual([
      'craig@example.com',
      '4081',
      '30no86',
      'cj4081',
      'Craig',
      'Johnson',
      'Depot',
      'London',
    ]);

    expect(result[4]).toEqual([
      'mary@example.com',
      '9346',
      '14ju73',
      'mj9346',
      'Mary',
      'Jenkins',
      'Engineering',
      'Manchester',
    ]);

    expect(result[5]).toEqual([
      'jamie@example.com',
      '5079',
      '09ja61',
      'js5079',
      'Jamie',
      'Smith',
      'Engineering',
      'Manchester',
    ]);
  });
});