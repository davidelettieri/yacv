import { Parser, Scanner } from '../src/parser';
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

describe('Parsing', () => {
  const data = fs.readFileSync('tests/email-password-recovery-code.csv', 'utf8');
  const scanner = new Scanner(data, ';');
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

const csvTestConfigs = [
  {
    fileName: 'email-password-recovery-code.csv',
    separator: ';',
    expectedRowCount: 6,
    expectedHeader: [
      'Login email',
      'Identifier',
      'One-time password',
      'Recovery code',
      'First name',
      'Last name',
      'Department',
      'Location',
    ],
  },
  {
    fileName: 'airtravel.csv',
    separator: ',',
    expectedRowCount: 13,
    expectedHeader: [
      'Month',
      '1958',
      '1959',
      '1960',
    ],
  },
  {
    fileName: 'crash_catalonia.csv',
    separator: ',',
    expectedRowCount: 8,
    expectedHeader: [
      'Day of Week',
      'Number of Crashes',
    ],
  },
  {
    fileName: 'deniro.csv',
    separator: ',',
    expectedRowCount: 88, // Adjust based on the actual number of rows
    expectedHeader: [
      'Year',
      'Score',
      'Title',
    ],
  },
  {
    fileName: 'faithful.csv',
    separator: ',',
    expectedRowCount: 273, // Adjust based on the actual number of rows
    expectedHeader: [
      'Index',
      'Eruption length (mins)',
      'Eruption wait (mins)',
    ],
  },
  {
    fileName: 'ford_escort.csv',
    separator: ',',
    expectedRowCount: 24, // Adjust based on the actual number of rows
    expectedHeader: [
      'Year',
      'Mileage (thousands)',
      'Price',
    ],
  },
  {
    fileName: 'grades.csv',
    separator: ',',
    expectedRowCount: 17, // Adjust based on the actual number of rows
    expectedHeader: [
      'Last name',
      'First name',
      'SSN',
      'Test1',
      'Test2',
      'Test3',
      'Test4',
      'Final',
      'Grade',
    ],
  },
  {
    fileName: 'homes.csv',
    separator: ',',
    expectedRowCount: 51, // Adjust based on the actual number of rows
    expectedHeader: [
      'Sell',
      'List',
      'Living',
      'Rooms',
      'Beds',
      'Baths',
      'Age',
      'Acres',
      'Taxes',
    ],
  },
  {
    fileName: 'addresses.csv',
    separator: ',',
    expectedRowCount: 6,
    expectedHeader: [
        'John',
        'Doe',
        '120 jefferson st.',
        'Riverside',
        'NJ',
        '08075',
    ],
  },
  {
    fileName: 'biostats.csv',
    separator: ',',
    expectedRowCount: 19, // Adjust based on the actual number of rows
    expectedHeader: [
      'Name',
      'Sex',
      'Age',
      'Height (in)',
      'Weight (lbs)',
    ],
  },
  {
    fileName: 'example.csv',
    separator: ',',
    expectedRowCount: 2, // Adjust based on the actual number of rows
    expectedHeader: [
      'TOK',
      'UPDATE',
      'DATE',
      'SHOT',
      'TIME',
      'AUXHEAT',
      'PHASE',
      'STATE',
      'PGASA',
      'PGASZ',
      'BGASA',
      'BGASZ',
      'BGASA2',
      'BGASZ2',
      'PIMPA',
      'PIMPZ',
      'PELLET',
      'RGEO',
      'RMAG',
      'AMIN',
      'SEPLIM',
      'XPLIM',
      'KAPPA',
      'DELTA',
      'INDENT',
      'AREA',
      'VOL',
      'CONFIG',
      'IGRADB',
      'WALMAT',
      'DIVMAT',
      'LIMMAT',
      'EVAP',
      'BT',
      'IP',
      'VSURF',
      'Q95',
      'BEPMHD',
      'BETMHD',
      'BEPDIA',
      'NEL',
      'DNELDT',
      'ZEFF',
      'PRAD',
      'POHM',
      'ENBI',
      'PINJ',
      'BSOURCE',
      'PINJ2',
      'BSOURCE2',
      'COCTR',
      'PNBI',
      'ECHFREQ',
      'ECHMODE',
      'ECHLOC',
      'PECH',
      'ICFREQ',
      'ICSCHEME',
      'ICANTEN',
      'PICRH',
      'LHFREQ',
      'LHNPAR',
      'PLH',
      'IBWFREQ',
      'PIBW',
      'TE0',
      'TI0',
      'WFANI',
      'WFICRH',
      'MEFF',
      'ISEQ',
      'WTH',
      'WTOT',
      'DWTOT',
      'PL',
      'PLTH',
      'TAUTOT',
      'TAUTH',
    ],
  },
  {
    fileName: 'customers-100.csv',
    separator: ',',
    expectedRowCount: 101, // Adjust based on the actual number of rows
    expectedHeader: [
      'Index',
      'Customer Id',
      'First Name',
      'Last Name',
      'Company',
      'City',
      'Country',
      'Phone 1',
      'Phone 2',
      'Email',
      'Subscription Date',
      'Website',
    ],
  },
  {
    fileName: 'freshman_kgs.csv',
    separator: ',',
    expectedRowCount: 68, // Adjust based on the actual number of rows
    expectedHeader: [
      'Sex',
      'Weight (Sep)',
      'Weight (Apr)',
      'BMI (Sep)',
      'BMI (Apr)',
    ],
  },
  {
    fileName: 'freshman_lbs.csv',
    separator: ',',
    expectedRowCount: 68, // Adjust based on the actual number of rows
    expectedHeader: [
      'Sex',
      'Weight (lbs,Sep)',
      'Weight (lbs,Apr)',
      'BMI (Sep)',
      'BMI (Apr)',
    ],
  },
  {
    fileName: 'cities.csv',
    separator: ',',
    expectedRowCount: 129, // Adjust based on the actual number of rows
    expectedHeader: [
      'LatD',
      'LatM',
      'LatS',
      'NS',
      'LonD',
      'LonM',
      'LonS',
      'EW',
      'City',
      'State',
    ],
  },
];

describe('CSV Parsing with Configuration', () => {
  csvTestConfigs.forEach(config => {
    test(`Parse ${config.fileName}`, () => {
      const filePath = path.join(__dirname, config.fileName);
      const data = fs.readFileSync(filePath, 'utf8');
      const scanner = new Scanner(data, config.separator);
      const parser = new Parser(scanner.ScanTokens());
      const result = parser.Parse();

      // Validate the result
      expect(result).toBeDefined();
      expect(result.length).toBe(config.expectedRowCount);

      // Validate the header row
      expect(result[0]).toEqual(config.expectedHeader);

      // Validate data rows
      for (let i = 1; i < result.length; i++) {
        const row = result[i];
        expect(Array.isArray(row)).toBe(true);
        expect(row.length).toBe(config.expectedHeader.length);
      }
    });
  });
});