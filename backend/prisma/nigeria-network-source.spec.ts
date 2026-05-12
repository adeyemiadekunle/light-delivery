import {
  buildNigeriaNetworkSeed,
  parseLocalGovernmentsSql,
  parseStatesSql,
} from './nigeria-network-source';

describe('Nigeria network seed source', () => {
  const statesSql = `
    INSERT INTO \`states\` (\`id\`, \`name\`) VALUES
    (1, 'Abia'),
    (15, 'FCT'),
    (25, 'Lagos');
  `;

  const localGovernmentsSql = `
    INSERT INTO \`local_governments\` (\`id\`, \`state_id\`, \`name\`) VALUES
    (1, 1, 'Aba North'),
    (101, 5, 'Jama''are'),
    (516, 25, 'Ikeja');
  `;

  it('parses Nigerian states from the MySQL dump into stable state codes', () => {
    expect(parseStatesSql(statesSql)).toEqual([
      { sourceId: 1, name: 'Abia', code: 'ABI' },
      { sourceId: 15, name: 'FCT', code: 'FCT' },
      { sourceId: 25, name: 'Lagos', code: 'LOS' },
    ]);
  });

  it('parses LGAs from the MySQL dump and unescapes SQL string values', () => {
    expect(parseLocalGovernmentsSql(localGovernmentsSql)).toEqual([
      { sourceId: 1, stateSourceId: 1, name: 'Aba North', code: 'ABA-NORTH' },
      { sourceId: 101, stateSourceId: 5, name: "Jama'are", code: 'JAMAARE' },
      { sourceId: 516, stateSourceId: 25, name: 'Ikeja', code: 'IKEJA' },
    ]);
  });

  it('builds a Prisma-friendly Nigeria network seed with LGAs as local areas', () => {
    expect(buildNigeriaNetworkSeed(statesSql, localGovernmentsSql)).toEqual({
      country: { name: 'Nigeria', code: 'NIG' },
      states: [
        {
          sourceId: 1,
          name: 'Abia',
          code: 'ABI',
          city: { name: 'Abia', code: 'ABI' },
          localAreas: [{ sourceId: 1, name: 'Aba North', code: 'ABA-NORTH' }],
        },
        {
          sourceId: 15,
          name: 'FCT',
          code: 'FCT',
          city: { name: 'FCT', code: 'FCT' },
          localAreas: [],
        },
        {
          sourceId: 25,
          name: 'Lagos',
          code: 'LOS',
          city: { name: 'Lagos', code: 'LOS' },
          localAreas: [{ sourceId: 516, name: 'Ikeja', code: 'IKEJA' }],
        },
      ],
    });
  });
});
