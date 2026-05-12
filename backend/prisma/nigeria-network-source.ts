export const NIGERIA_STATES_SQL_URL =
  'https://raw.githubusercontent.com/davepartner/sql-list-of-local-governments-and-states-in-Nigeria/master/list-of-states-in-nigeria';

export const NIGERIA_LOCAL_GOVERNMENTS_SQL_URL =
  'https://raw.githubusercontent.com/davepartner/sql-list-of-local-governments-and-states-in-Nigeria/master/mysql-list-of-local-governments-in-nigeria';

const STATE_CODES: Record<string, string> = {
  Abia: 'ABI',
  Adamawa: 'ADA',
  'Akwa Ibom': 'AKI',
  Anambra: 'ANA',
  Bauchi: 'BAU',
  Bayelsa: 'BAY',
  Benue: 'BEN',
  Borno: 'BOR',
  'Cross River': 'CRS',
  Delta: 'DEL',
  Ebonyi: 'EBO',
  Edo: 'EDO',
  Ekiti: 'EKT',
  Enugu: 'ENU',
  FCT: 'FCT',
  Gombe: 'GOM',
  Imo: 'IMO',
  Jigawa: 'JIG',
  Kaduna: 'KAD',
  Kano: 'KAN',
  Katsina: 'KAT',
  Kebbi: 'KEB',
  Kogi: 'KOG',
  Kwara: 'KWA',
  Lagos: 'LOS',
  Nasarawa: 'NAS',
  Niger: 'NIGR',
  Ogun: 'OGU',
  Ondo: 'OND',
  Osun: 'OSU',
  Oyo: 'OYO',
  Plateau: 'PLA',
  Rivers: 'RIV',
  Sokoto: 'SOK',
  Taraba: 'TAR',
  Yobe: 'YOB',
  Zamfara: 'ZAM',
};

export type NigeriaStateSource = {
  sourceId: number;
  name: string;
  code: string;
};

export type NigeriaLocalGovernmentSource = {
  sourceId: number;
  stateSourceId: number;
  name: string;
  code: string;
};

export type NigeriaNetworkSeed = {
  country: {
    name: 'Nigeria';
    code: 'NIG';
  };
  states: Array<
    NigeriaStateSource & {
      city: {
        name: string;
        code: string;
      };
      localAreas: Array<Omit<NigeriaLocalGovernmentSource, 'stateSourceId'>>;
    }
  >;
};

export function parseStatesSql(sql: string): NigeriaStateSource[] {
  return Array.from(sql.matchAll(/\((\d+),\s*'((?:''|[^'])*)'\)/g), ([, id, name]) => {
    const stateName = unescapeSqlString(name);

    return {
      sourceId: Number(id),
      name: stateName,
      code: STATE_CODES[stateName] ?? toLocationCode(stateName),
    };
  });
}

export function parseLocalGovernmentsSql(sql: string): NigeriaLocalGovernmentSource[] {
  return Array.from(
    sql.matchAll(/\((\d+),\s*(\d+),\s*'((?:''|[^'])*)'\)/g),
    ([, id, stateId, name]) => {
      const lgaName = unescapeSqlString(name);

      return {
        sourceId: Number(id),
        stateSourceId: Number(stateId),
        name: lgaName,
        code: toLocationCode(lgaName),
      };
    },
  );
}

export function buildNigeriaNetworkSeed(
  statesSql: string,
  localGovernmentsSql: string,
): NigeriaNetworkSeed {
  const localGovernmentsByState = new Map<number, NigeriaLocalGovernmentSource[]>();

  for (const localGovernment of parseLocalGovernmentsSql(localGovernmentsSql)) {
    const existing = localGovernmentsByState.get(localGovernment.stateSourceId) ?? [];
    existing.push(localGovernment);
    localGovernmentsByState.set(localGovernment.stateSourceId, existing);
  }

  return {
    country: { name: 'Nigeria', code: 'NIG' },
    states: parseStatesSql(statesSql).map((state) => ({
      ...state,
      city: {
        name: state.name,
        code: state.code,
      },
      localAreas: (localGovernmentsByState.get(state.sourceId) ?? []).map(
        ({ stateSourceId: _stateSourceId, ...localArea }) => localArea,
      ),
    })),
  };
}

export function toLocationCode(value: string) {
  return value
    .replace(/''/g, '')
    .replace(/'/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();
}

function unescapeSqlString(value: string) {
  return value.replace(/''/g, "'");
}
