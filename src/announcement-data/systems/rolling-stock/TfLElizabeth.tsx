import CustomAnnouncementPane, { ICustomAnnouncementPreset } from '@components/PanelPanes/CustomAnnouncementPane'
import crsToStationItemMapper from '@helpers/crsToStationItemMapper'
import AnnouncementSystem, { AudioItem, CustomAnnouncementTab } from '../../AnnouncementSystem'

const ChangeOptions = [
  'Bakerloo',
  'Central',
  'Circle',
  'District',
  'Hammersmith & City',
  'Jubilee',
  'Metropolitan',
  'Northern',
  'Piccadilly',
  'Victoria',
  'Waterloo & City',
  'DLR',
  'London Overground',
  'National Rail services',
  'Elizabeth',
] as const

const ExitForOptions = [
  'billingsgate market',
  'excel london exhibition centre',
  'hackney downs',
  'queen elizabeth olympic park',
  'railair bus service to heathrow airport',
  'smithfield market',
  'spitalfields market',
  "st mary's hospital",
  'the royal london hospital',
  'trains to gatwick and luton airports',
  'trains to heathrow airport',
  'trains to stansted and southend airports',
  'wanstead park london overground station',
  'woodgrange park london overground station',
] as const

type ChangeOption = (typeof ChangeOptions)[number]
type ExitForOption = (typeof ExitForOptions)[number]

interface StationInfo {
  name: string
  crs: string
  audioName: {
    b?: string
    m?: string
    e?: string
  }
  changeFor: ChangeOption[]
  exitFor: ExitForOption[]
}

const AllStationFiles = {
  b: [
    'ABW',
    'AML',
    'BDS',
    'BNM',
    'BRE',
    'CTH',
    'CUS',
    'CWX',
    'EAL',
    'FOG',
    'GDP',
    'GMY',
    'HAF',
    'HAN',
    'HAY',
    'HRO',
    'HWV',
    'HXX',
    'IFD',
    'IVR',
    'LNY',
    'LST',
    'MAI',
    'MNP',
    'MYL',
    'PAD',
    'RDG',
    'RMF',
    'SLO',
    'SNF',
    'SRA',
    'STL',
    'SVK',
    'TAP',
    'TCR',
    'TWY',
    'WDT',
    'WEA',
    'WWC',
    'ZFD',
    'ZLW',
  ],
  em: [
    'ABW',
    'ACC',
    'AHD',
    'AHS',
    'ALN',
    'ALR',
    'AML',
    'AMR',
    'AMT',
    'ANZ',
    'APF',
    'APS',
    'AUD',
    'AYP',
    'BAB',
    'BAD',
    'BAK',
    'BAL',
    'BAN',
    'BCV',
    'BCY',
    'BDM',
    'BDS',
    'BDW',
    'BEF',
    'BET',
    'BFR',
    'BHK',
    'BHM',
    'BHO',
    'BIC',
    'BIK',
    'BIS',
    'BKA',
    'BKG',
    'BKH',
    'BKJ',
    'BKM',
    'BLB',
    'BLM',
    'BLY',
    'BMD',
    'BNE',
    'BNH',
    'BNM',
    'BRE',
    'BRI',
    'BRX',
    'BSH',
    'BSO',
    'BSP',
    'BSY',
    'BTN',
    'BTP',
    'BUG',
    'BUU',
    'BVD',
    'BXB',
    'BXD',
    'BXH',
    'BXW',
    'BXY',
    'CAT',
    'CBG',
    'CBH',
    'CBP',
    'CDF',
    'CDN',
    'CDS',
    'CED',
    'CES',
    'CET',
    'CFH',
    'CFO',
    'CHE',
    'CHI',
    'CHM',
    'CHN',
    'CHO',
    'CHP',
    'CHW',
    'CHX',
    'CIR',
    'CLA',
    'CLJ',
    'CLP',
    'CLT',
    'CLW',
    'CMD',
    'CNG',
    'CNN',
    'COH',
    'COL',
    'COO',
    'CPK',
    'CPT',
    'CRH',
    'CRW',
    'CRY',
    'CSB',
    'CST',
    'CTH',
    'CTM',
    'CTN',
    'CUM',
    'CUS',
    'CWN',
    'CWX',
    'CYP',
    'DBR',
    'DDK',
    'DEP',
    'DFD',
    'DID',
    'DIS',
    'DKG',
    'DLJ',
    'DLK',
    'DMK',
    'DMS',
    'DOW',
    'DRG',
    'DVC',
    'EAL',
    'EBR',
    'EBT',
    'ECR',
    'EDR',
    'EDW',
    'EFF',
    'EGR',
    'ELD',
    'ELW',
    'ELY',
    'EMP',
    'ENF',
    'ENL',
    'EPD',
    'EPH',
    'EPS',
    'ERH',
    'ERI',
    'ESM',
    'ETL',
    'EUS',
    'EWE',
    'EXD',
    'FCN',
    'FGT',
    'FLX',
    'FNY',
    'FOG',
    'FOH',
    'FPK',
    'FRI',
    'FST',
    'FZP',
    'GDN',
    'GDP',
    'GFD',
    'GIP',
    'GLD',
    'GLM',
    'GMY',
    'GNH',
    'GNW',
    'GOR',
    'GPO',
    'GRB',
    'GRC',
    'GRV',
    'GRY',
    'GTW',
    'GUN',
    'GYM',
    'HAF',
    'HAN',
    'HAP',
    'HAY',
    'HDH',
    'HDL',
    'HDN',
    'HEV',
    'HFE',
    'HFN',
    'HGD',
    'HGG',
    'HGM',
    'HGR',
    'HHE',
    'HHY',
    'HIB',
    'HIP',
    'HKC',
    'HKW',
    'HML',
    'HMN',
    'HOC',
    'HOH',
    'HOR',
    'HOT',
    'HOX',
    'HPA',
    'HPQ',
    'HRH',
    'HRO',
    'HRW',
    'HRY',
    'HSK',
    'HSY',
    'HTE',
    'HUR',
    'HWC',
    'HWM',
    'HWN',
    'HWV',
    'HXX',
    'HYD',
    'HYH',
    'IFD',
    'IFI',
    'IMW',
    'INT',
    'IPS',
    'IVR',
    'KBN',
    'KBX',
    'KDB',
    'KEL',
    'KGL',
    'KGS',
    'KIT',
    'KLN',
    'KLY',
    'KND',
    'KNL',
    'KNR',
    'KNT',
    'KPA',
    'KTN',
    'KTW',
    'KWG',
    'LAI',
    'LBG',
    'LBZ',
    'LEE',
    'LEM',
    'LER',
    'LES',
    'LEW',
    'LFD',
    'LHD',
    'LHS',
    'LIH',
    'LMS',
    'LNY',
    'LOF',
    'LRD',
    'LST',
    'LTP',
    'LUT',
    'LVN',
    'MAC',
    'MAI',
    'MAN',
    'MDG',
    'MDS',
    'MHM',
    'MIS',
    'MKC',
    'MKT',
    'MLW',
    'MNG',
    'MNP',
    'MOG',
    'MTG',
    'MYB',
    'MYL',
    'MZH',
    'NBY',
    'NDL',
    'NEH',
    'NFA',
    'NFL',
    'NGT',
    'NHD',
    'NLT',
    'NMP',
    'NMT',
    'NRB',
    'NRC',
    'NRW',
    'NSG',
    'NUF',
    'NUM',
    'NWB',
    'NWD',
    'NWP',
    'NWX',
    'NXG',
    'OCK',
    'OLD',
    'OXF',
    'OXT',
    'PAD',
    'PAN',
    'PFL',
    'PHR',
    'PLU',
    'PLY',
    'PMR',
    'PNW',
    'PON',
    'PRL',
    'PRP',
    'PSE',
    'PUO',
    'PUR',
    'QPW',
    'QRP',
    'RAD',
    'RAI',
    'RDB',
    'RDD',
    'RDG',
    'RDH',
    'RDW',
    'REC',
    'REI',
    'RFD',
    'RHM',
    'RIC',
    'RLG',
    'RMD',
    'RMF',
    'ROE',
    'RTR',
    'RYH',
    'RYN',
    'SAC',
    'SAF',
    'SAJ',
    'SAT',
    'SAW',
    'SBM',
    'SBP',
    'SBU',
    'SCG',
    'SCY',
    'SDC',
    'SDE',
    'SDH',
    'SED',
    'SFA',
    'SFO',
    'SGN',
    'SGR',
    'SHI',
    'SIA',
    'SID',
    'SIH',
    'SIT',
    'SJS',
    'SKW',
    'SLO',
    'SLV',
    'SMH',
    'SMK',
    'SMN',
    'SMO',
    'SNF',
    'SNR',
    'SOC',
    'SOE',
    'SOF',
    'SOH',
    'SOK',
    'SOO',
    'SOT',
    'SOV',
    'SPB',
    'SPT',
    'SQE',
    'SRA',
    'SRC',
    'SRH',
    'SRS',
    'SRU',
    'SRY',
    'SSD',
    'SST',
    'STA',
    'STE',
    'STL',
    'STO',
    'SUC',
    'SUO',
    'SVG',
    'SVK',
    'SVS',
    'SWA',
    'SWI',
    'SWM',
    'SYD',
    'TAC',
    'TAD',
    'TAP',
    'TAT',
    'TBD',
    'TBR',
    'TBW',
    'TCR',
    'TEO',
    'THA',
    'THE',
    'TIL',
    'TLH',
    'TLS',
    'TOM',
    'TON',
    'TPB',
    'TRI',
    'TRM',
    'TTH',
    'TUH',
    'TUR',
    'TWI',
    'TWY',
    'UCK',
    'UHL',
    'UPM',
    'UWL',
    'VIC',
    'VXH',
    'WAR',
    'WAT',
    'WBC',
    'WBO',
    'WBP',
    'WCB',
    'WCF',
    'WCY',
    'WDO',
    'WDT',
    'WEA',
    'WEE',
    'WEH',
    'WFH',
    'WFI',
    'WFJ',
    'WGC',
    'WGR',
    'WGV',
    'WHC',
    'WHD',
    'WHL',
    'WHR',
    'WHS',
    'WHY',
    'WIC',
    'WIJ',
    'WIM',
    'WIV',
    'WLC',
    'WLF',
    'WLI',
    'WLT',
    'WMB',
    'WME',
    'WMW',
    'WNC',
    'WNP',
    'WNW',
    'WNY',
    'WOH',
    'WOL',
    'WON',
    'WPE',
    'WRB',
    'WRU',
    'WST',
    'WSU',
    'WSW',
    'WTG',
    'WTM',
    'WVF',
    'WVH',
    'WWA',
    'WWC',
    'WWD',
    'WWR',
    'ZCW',
    'ZFD',
    'ZLW',
  ],
}

function createNormalStation(
  crsCode: string,
  changeFor: ChangeOption[] = [],
  exitFor: ExitForOption[] = [],
  // types: ('b' | 'm' | 'e' | 'c')[] = ['b', 'm', 'e'],
): StationInfo {
  const stn = crsToStationItemMapper(crsCode)

  if (!stn.name) {
    console.warn(`No station found for ${crsCode}`)
  }

  return {
    name: stn.name,
    crs: crsCode,
    audioName: {
      b: AllStationFiles.b.includes(crsCode) ? `stations.b.${crsCode}` : null,
      m: AllStationFiles.em.includes(crsCode) ? `stations.m.${crsCode}` : null,
      e: AllStationFiles.em.includes(crsCode) ? `stations.e.${crsCode}` : null,
    },
    changeFor,
    exitFor,
  }
}

const AllStations: StationInfo[] = [
  createNormalStation('ABW', ['National Rail services']),
  createNormalStation('ACC'),
  createNormalStation('AHD'),
  createNormalStation('AHS'),
  createNormalStation('ALN'),
  createNormalStation('ALR'),
  createNormalStation('AML'),
  createNormalStation('AMR'),
  createNormalStation('AMT'),
  createNormalStation('ANZ'),
  createNormalStation('APF'),
  createNormalStation('APS'),
  createNormalStation('AUD'),
  createNormalStation('AYP'),
  createNormalStation('BAB'),
  createNormalStation('BAD'),
  createNormalStation('BAK'),
  createNormalStation('BAL'),
  createNormalStation('BAN'),
  createNormalStation('BCV'),
  createNormalStation('BCY'),
  createNormalStation('BDM'),
  createNormalStation('BDS', ['Central', 'Jubilee']),
  createNormalStation('BDW'),
  createNormalStation('BEF'),
  createNormalStation('BET'),
  createNormalStation('BFR'),
  createNormalStation('BHK'),
  createNormalStation('BHM'),
  createNormalStation('BHO'),
  createNormalStation('BIC'),
  createNormalStation('BIK'),
  createNormalStation('BIS'),
  createNormalStation('BKA'),
  createNormalStation('BKG'),
  createNormalStation('BKH'),
  createNormalStation('BKJ'),
  createNormalStation('BKM'),
  createNormalStation('BLB'),
  createNormalStation('BLM'),
  createNormalStation('BLY'),
  createNormalStation('BMD'),
  createNormalStation('BNE'),
  createNormalStation('BNH'),
  createNormalStation('BNM'),
  createNormalStation('BRE'),
  createNormalStation('BRI'),
  createNormalStation('BRX'),
  createNormalStation('BSH'),
  createNormalStation('BSO'),
  createNormalStation('BSP'),
  createNormalStation('BSY'),
  createNormalStation('BTN'),
  createNormalStation('BTP'),
  createNormalStation('BUG'),
  createNormalStation('BUU'),
  createNormalStation('BVD'),
  createNormalStation('BXB'),
  createNormalStation('BXD'),
  createNormalStation('BXH'),
  createNormalStation('BXW'),
  createNormalStation('BXY'),
  createNormalStation('CAT'),
  createNormalStation('CBG'),
  createNormalStation('CBH'),
  createNormalStation('CBP'),
  createNormalStation('CDF'),
  createNormalStation('CDN'),
  createNormalStation('CDS'),
  createNormalStation('CED'),
  createNormalStation('CES'),
  createNormalStation('CET'),
  createNormalStation('CFH'),
  createNormalStation('CFO'),
  createNormalStation('CHE'),
  createNormalStation('CHI'),
  createNormalStation('CHM'),
  createNormalStation('CHN'),
  createNormalStation('CHO'),
  createNormalStation('CHP'),
  createNormalStation('CHW'),
  createNormalStation('CHX'),
  createNormalStation('CIR'),
  createNormalStation('CLA'),
  createNormalStation('CLJ'),
  createNormalStation('CLP'),
  createNormalStation('CLT'),
  createNormalStation('CLW'),
  createNormalStation('CMD'),
  createNormalStation('CNG'),
  createNormalStation('CNN'),
  createNormalStation('COH'),
  createNormalStation('COL'),
  createNormalStation('COO'),
  createNormalStation('CPK'),
  createNormalStation('CPT'),
  createNormalStation('CRH'),
  createNormalStation('CRW'),
  createNormalStation('CRY'),
  createNormalStation('CSB'),
  createNormalStation('CST'),
  createNormalStation('CTH'),
  createNormalStation('CTM'),
  createNormalStation('CTN'),
  createNormalStation('CUM'),
  createNormalStation('CUS', ['DLR'], ['excel london exhibition centre']),
  createNormalStation('CWN'),
  createNormalStation('CWX', ['Jubilee', 'DLR']),
  createNormalStation('CYP'),
  createNormalStation('DBR'),
  createNormalStation('DDK'),
  createNormalStation('DEP'),
  createNormalStation('DFD'),
  createNormalStation('DID'),
  createNormalStation('DIS'),
  createNormalStation('DKG'),
  createNormalStation('DLJ'),
  createNormalStation('DLK'),
  createNormalStation('DMK'),
  createNormalStation('DMS'),
  createNormalStation('DOW'),
  createNormalStation('DRG'),
  createNormalStation('DVC'),
  createNormalStation('EAL', ['Central', 'District', 'National Rail services']),
  createNormalStation('EBR'),
  createNormalStation('EBT'),
  createNormalStation('ECR'),
  createNormalStation('EDR'),
  createNormalStation('EDW'),
  createNormalStation('EFF'),
  createNormalStation('EGR'),
  createNormalStation('ELD'),
  createNormalStation('ELW'),
  createNormalStation('ELY'),
  createNormalStation('EMP'),
  createNormalStation('ENF'),
  createNormalStation('ENL'),
  createNormalStation('EPD'),
  createNormalStation('EPH'),
  createNormalStation('EPS'),
  createNormalStation('ERH'),
  createNormalStation('ERI'),
  createNormalStation('ESM'),
  createNormalStation('ETL'),
  createNormalStation('EUS'),
  createNormalStation('EWE'),
  createNormalStation('EXD'),
  createNormalStation('FCN'),
  createNormalStation('FGT'),
  createNormalStation('FLX'),
  createNormalStation('FNY'),
  createNormalStation('FOG', [], ['wanstead park london overground station']),
  createNormalStation('FOH'),
  createNormalStation('FPK'),
  createNormalStation('FRI'),
  createNormalStation('FST'),
  createNormalStation('FZP'),
  createNormalStation('GDN'),
  createNormalStation('GDP'),
  createNormalStation('GFD'),
  createNormalStation('GIP'),
  createNormalStation('GLD'),
  createNormalStation('GLM'),
  createNormalStation('GMY'),
  createNormalStation('GNH'),
  createNormalStation('GNW'),
  createNormalStation('GOR'),
  createNormalStation('GPO'),
  createNormalStation('GRB'),
  createNormalStation('GRC'),
  createNormalStation('GRV'),
  createNormalStation('GRY'),
  createNormalStation('GTW'),
  createNormalStation('GUN'),
  createNormalStation('GYM'),
  createNormalStation('HAF', ['Piccadilly']),
  createNormalStation('HAN'),
  createNormalStation('HAP'),
  createNormalStation('HAY', ['National Rail services']),
  createNormalStation('HDH'),
  createNormalStation('HDL'),
  createNormalStation('HDN'),
  createNormalStation('HEV'),
  createNormalStation('HFE'),
  createNormalStation('HFN'),
  createNormalStation('HGD'),
  createNormalStation('HGG'),
  createNormalStation('HGM'),
  createNormalStation('HGR'),
  createNormalStation('HHE'),
  createNormalStation('HHY'),
  createNormalStation('HIB'),
  createNormalStation('HIP'),
  createNormalStation('HKC'),
  createNormalStation('HKW'),
  createNormalStation('HML'),
  createNormalStation('HMN'),
  createNormalStation('HOC'),
  createNormalStation('HOH'),
  createNormalStation('HOR'),
  createNormalStation('HOT'),
  createNormalStation('HOX'),
  createNormalStation('HPA'),
  createNormalStation('HPQ'),
  createNormalStation('HRH'),
  createNormalStation('HRO'),
  createNormalStation('HRW'),
  createNormalStation('HRY'),
  createNormalStation('HSK'),
  createNormalStation('HSY'),
  createNormalStation('HTE'),
  createNormalStation('HUR'),
  createNormalStation('HWC'),
  createNormalStation('HWM'),
  createNormalStation('HWN'),
  createNormalStation('HWV', ['Piccadilly']),
  createNormalStation('HXX', ['Piccadilly']),
  createNormalStation('HYD'),
  createNormalStation('HYH'),
  createNormalStation('IFD'),
  createNormalStation('IFI'),
  createNormalStation('IMW'),
  createNormalStation('INT'),
  createNormalStation('IPS'),
  createNormalStation('IVR'),
  createNormalStation('KBN'),
  createNormalStation('KBX'),
  createNormalStation('KDB'),
  createNormalStation('KEL'),
  createNormalStation('KGL'),
  createNormalStation('KGS'),
  createNormalStation('KIT'),
  createNormalStation('KLN'),
  createNormalStation('KLY'),
  createNormalStation('KND'),
  createNormalStation('KNL'),
  createNormalStation('KNR'),
  createNormalStation('KNT'),
  createNormalStation('KPA'),
  createNormalStation('KTN'),
  createNormalStation('KTW'),
  createNormalStation('KWG'),
  createNormalStation('LAI'),
  createNormalStation('LBG'),
  createNormalStation('LBZ'),
  createNormalStation('LEE'),
  createNormalStation('LEM'),
  createNormalStation('LER'),
  createNormalStation('LES'),
  createNormalStation('LEW'),
  createNormalStation('LFD'),
  createNormalStation('LHD'),
  createNormalStation('LHS'),
  createNormalStation('LIH'),
  createNormalStation('LMS'),
  createNormalStation('LNY'),
  createNormalStation('LOF'),
  createNormalStation('LRD'),
  createNormalStation(
    'LST',
    ['Central', 'Circle', 'Hammersmith & City', 'Metropolitan', 'Northern', 'London Overground', 'National Rail services'],
    ['trains to stansted and southend airports'],
  ),
  createNormalStation('LTP'),
  createNormalStation('LUT'),
  createNormalStation('LVN'),
  createNormalStation('MAC'),
  createNormalStation('MAI', ['National Rail services']),
  createNormalStation('MAN'),
  createNormalStation('MDG'),
  createNormalStation('MDS'),
  createNormalStation('MHM'),
  createNormalStation('MIS'),
  createNormalStation('MKC'),
  createNormalStation('MKT'),
  createNormalStation('MLW'),
  createNormalStation('MNG'),
  createNormalStation('MNP', [], ['wanstead park london overground station']),
  createNormalStation('MOG'),
  createNormalStation('MTG'),
  createNormalStation('MYB'),
  createNormalStation('MYL'),
  createNormalStation('MZH'),
  createNormalStation('NBY'),
  createNormalStation('NDL'),
  createNormalStation('NEH'),
  createNormalStation('NFA'),
  createNormalStation('NFL'),
  createNormalStation('NGT'),
  createNormalStation('NHD'),
  createNormalStation('NLT'),
  createNormalStation('NMP'),
  createNormalStation('NMT'),
  createNormalStation('NRB'),
  createNormalStation('NRC'),
  createNormalStation('NRW'),
  createNormalStation('NSG'),
  createNormalStation('NUF'),
  createNormalStation('NUM'),
  createNormalStation('NWB'),
  createNormalStation('NWD'),
  createNormalStation('NWP'),
  createNormalStation('NWX'),
  createNormalStation('NXG'),
  createNormalStation('OCK'),
  createNormalStation('OLD'),
  createNormalStation('OXF'),
  createNormalStation('OXT'),
  createNormalStation('PAD', ['Bakerloo', 'Circle', 'Hammersmith & City', 'National Rail services'], ['trains to heathrow airport']),
  createNormalStation('PAN'),
  createNormalStation('PFL'),
  createNormalStation('PHR'),
  createNormalStation('PLU'),
  createNormalStation('PLY'),
  createNormalStation('PMR'),
  createNormalStation('PNW'),
  createNormalStation('PON'),
  createNormalStation('PRL'),
  createNormalStation('PRP'),
  createNormalStation('PSE'),
  createNormalStation('PUO'),
  createNormalStation('PUR'),
  createNormalStation('QPW'),
  createNormalStation('QRP'),
  createNormalStation('RAD'),
  createNormalStation('RAI'),
  createNormalStation('RDB'),
  createNormalStation('RDD'),
  createNormalStation('RDG', ['National Rail services']),
  createNormalStation('RDH'),
  createNormalStation('RDW'),
  createNormalStation('REC'),
  createNormalStation('REI'),
  createNormalStation('RFD'),
  createNormalStation('RHM'),
  createNormalStation('RIC'),
  createNormalStation('RLG'),
  createNormalStation('RMD'),
  createNormalStation('RMF', ['London Overground', 'National Rail services']),
  createNormalStation('ROE'),
  createNormalStation('RTR'),
  createNormalStation('RYH'),
  createNormalStation('RYN'),
  createNormalStation('SAC'),
  createNormalStation('SAF'),
  createNormalStation('SAJ'),
  createNormalStation('SAT'),
  createNormalStation('SAW'),
  createNormalStation('SBM'),
  createNormalStation('SBP'),
  createNormalStation('SBU'),
  createNormalStation('SCG'),
  createNormalStation('SCY'),
  createNormalStation('SDC'),
  createNormalStation('SDE'),
  createNormalStation('SDH'),
  createNormalStation('SED'),
  createNormalStation('SFA'),
  createNormalStation('SFO'),
  createNormalStation('SGN'),
  createNormalStation('SGR'),
  createNormalStation('SHI'),
  createNormalStation('SIA'),
  createNormalStation('SID'),
  createNormalStation('SIH'),
  createNormalStation('SIT'),
  createNormalStation('SJS'),
  createNormalStation('SKW'),
  createNormalStation('SLO', ['National Rail services']),
  createNormalStation('SLV'),
  createNormalStation('SMH'),
  createNormalStation('SMK'),
  createNormalStation('SMN'),
  createNormalStation('SMO'),
  createNormalStation('SNF', ['National Rail services']),
  createNormalStation('SNR'),
  createNormalStation('SOC'),
  createNormalStation('SOE'),
  createNormalStation('SOF'),
  createNormalStation('SOH'),
  createNormalStation('SOK'),
  createNormalStation('SOO'),
  createNormalStation('SOT'),
  createNormalStation('SOV'),
  createNormalStation('SPB'),
  createNormalStation('SPT'),
  createNormalStation('SQE'),
  createNormalStation('SRA', ['Central', 'Jubilee', 'DLR', 'London Overground', 'National Rail services']),
  createNormalStation('SRC'),
  createNormalStation('SRH'),
  createNormalStation('SRS'),
  createNormalStation('SRU'),
  createNormalStation('SRY'),
  createNormalStation('SSD'),
  createNormalStation('SST'),
  createNormalStation('STA'),
  createNormalStation('STE'),
  createNormalStation('STL'),
  createNormalStation('STO'),
  createNormalStation('SUC'),
  createNormalStation('SUO'),
  createNormalStation('SVG'),
  createNormalStation('SVK'),
  createNormalStation('SVS'),
  createNormalStation('SWA'),
  createNormalStation('SWI'),
  createNormalStation('SWM'),
  createNormalStation('SYD'),
  createNormalStation('TAC'),
  createNormalStation('TAD'),
  createNormalStation('TAP'),
  createNormalStation('TAT'),
  createNormalStation('TBD'),
  createNormalStation('TBR'),
  createNormalStation('TBW'),
  createNormalStation('TCR', ['Central', 'Northern']),
  createNormalStation('TEO'),
  createNormalStation('THA'),
  createNormalStation('THE'),
  createNormalStation('TIL'),
  createNormalStation('TLH'),
  createNormalStation('TLS'),
  createNormalStation('TOM'),
  createNormalStation('TON'),
  createNormalStation('TPB'),
  createNormalStation('TRI'),
  createNormalStation('TRM'),
  createNormalStation('TTH'),
  createNormalStation('TUH'),
  createNormalStation('TUR'),
  createNormalStation('TWI'),
  createNormalStation('TWY', ['National Rail services']),
  createNormalStation('UCK'),
  createNormalStation('UHL'),
  createNormalStation('UPM'),
  createNormalStation('UWL'),
  createNormalStation('VIC'),
  createNormalStation('VXH'),
  createNormalStation('WAR'),
  createNormalStation('WAT'),
  createNormalStation('WBC'),
  createNormalStation('WBO'),
  createNormalStation('WBP'),
  createNormalStation('WCB'),
  createNormalStation('WCF'),
  createNormalStation('WCY'),
  createNormalStation('WDO'),
  createNormalStation('WDT'),
  createNormalStation('WEA', ['National Rail services']),
  createNormalStation('WEE'),
  createNormalStation('WEH'),
  createNormalStation('WFH'),
  createNormalStation('WFI'),
  createNormalStation('WFJ'),
  createNormalStation('WGC'),
  createNormalStation('WGR'),
  createNormalStation('WGV'),
  createNormalStation('WHC'),
  createNormalStation('WHD'),
  createNormalStation('WHL'),
  createNormalStation('WHR'),
  createNormalStation('WHS'),
  createNormalStation('WHY'),
  createNormalStation('WIC'),
  createNormalStation('WIJ'),
  createNormalStation('WIM'),
  createNormalStation('WIV'),
  createNormalStation('WLC'),
  createNormalStation('WLF'),
  createNormalStation('WLI'),
  createNormalStation('WLT'),
  createNormalStation('WMB'),
  createNormalStation('WME'),
  createNormalStation('WMW'),
  createNormalStation('WNC'),
  createNormalStation('WNP'),
  createNormalStation('WNW'),
  createNormalStation('WNY'),
  createNormalStation('WOH'),
  createNormalStation('WOL'),
  createNormalStation('WON'),
  createNormalStation('WPE'),
  createNormalStation('WRB'),
  createNormalStation('WRU'),
  createNormalStation('WST'),
  createNormalStation('WSU'),
  createNormalStation('WSW'),
  createNormalStation('WTG'),
  createNormalStation('WTM'),
  createNormalStation('WVF'),
  createNormalStation('WVH'),
  createNormalStation('WWA'),
  createNormalStation('WWC', ['DLR', 'National Rail services']),
  createNormalStation('WWD'),
  createNormalStation('WWR'),
  createNormalStation('ZCW'),
  createNormalStation(
    'ZFD',
    ['Circle', 'Hammersmith & City', 'Metropolitan', 'National Rail services'],
    ['trains to gatwick and luton airports'],
  ),
  createNormalStation('ZLW', ['District', 'Hammersmith & City', 'London Overground']),
]

interface IAtStationAnnouncementOptions {
  thisStationCrs: string
  destinationCrs: string
  viaCrs: string
  nextStationCrs: string
}

interface IApproachingStationAnnouncementOptions {
  nextStationCrs: string
  terminating: boolean
}

const announcementPresets: Readonly<Record<string, ICustomAnnouncementPreset[]>> = {
  thisStation: [
    {
      name: 'Farringdon towards Abbey Wood',
      state: {
        thisStationCrs: 'ZFD',
        destinationCrs: 'ABW',
        viaCrs: 'CWX',
        nextStationCrs: 'LST',
      },
    },
  ],
}

export default class TfLElizabethLine extends AnnouncementSystem {
  readonly NAME = 'TfL Elizabeth Line'
  readonly ID = 'TFL_ELIZ_LINE_V1'
  readonly FILE_PREFIX = 'TfL/Elizabeth Line'
  readonly SYSTEM_TYPE = 'train'

  headerComponent() {
    return "This system contains stations not related to the line itself due to TfL's shared announcement set between Overground and Elizabeth line."
  }

  private async playAtStationAnnouncement(options: IAtStationAnnouncementOptions, download: boolean = false): Promise<void> {
    const files: AudioItem[] = []

    const thisStation = AllStations.find(stn => stn.crs === options.thisStationCrs)
    const destinationStation = AllStations.find(stn => stn.crs === options.destinationCrs)
    const viaStation = AllStations.find(stn => stn.crs === options.viaCrs)
    const nextStation = AllStations.find(stn => stn.crs === options.nextStationCrs)

    if (!thisStation || !destinationStation || !nextStation) {
      alert(`Invalid stations.\n\n${thisStation?.crs} ${destinationStation?.crs} ${nextStation?.crs}`)
      return
    }

    files.push(thisStation.audioName.e)

    if (thisStation.crs === destinationStation.crs) {
      files.push({ id: 'conjoiners.this train terminates here all change please', opts: { delayStart: 1000 } })
    } else {
      files.push({ id: 'conjoiners.this is the train to', opts: { delayStart: 1000 } })

      if (viaStation) {
        files.push(destinationStation.audioName.m, 'conjoiners.via', viaStation.audioName.e)
      } else {
        files.push(destinationStation.audioName.e)
      }

      files.push({ id: 'conjoiners.next station', opts: { delayStart: 1000 } })

      if (nextStation.crs === destinationStation.crs) {
        files.push(nextStation.audioName.m, 'conjoiners.where this train terminates')
      } else {
        files.push(nextStation.audioName.e)
      }
    }

    await this.playAudioFiles(files, download)
  }

  private async playApproachingStationAnnouncement(options: IApproachingStationAnnouncementOptions, download: boolean = false): Promise<void> {
    const files: AudioItem[] = []

    const nextStation = AllStations.find(stn => stn.crs === options.nextStationCrs)

    if (!nextStation) {
      alert(`Invalid station.\n\n${nextStation?.crs}`)
      return
    }

    files.push({ id: 'conjoiners.next station', opts: { delayStart: 1000 } })

    if (options.terminating) {
      files.push(nextStation.audioName.m, 'conjoiners.where this train terminates')
    } else {
      files.push(nextStation.audioName.e)
    }

    if (nextStation.changeFor.length) {
      files.push(
        { id: 'conjoiners.change for', opts: { delayStart: 1000 } },
        ...this.pluraliseAudio(nextStation.changeFor, { andId: 'conjoiners.and', prefix: 'change for.m.', finalPrefix: 'change for.e.' }),
      )
    }

    if (nextStation.exitFor.length) {
      files.push(
        { id: 'conjoiners.exit for', opts: { delayStart: 1000 } },
        ...this.pluraliseAudio(nextStation.exitFor, { andId: 'conjoiners.and', prefix: 'exit for.m.', finalPrefix: 'exit for.e.' }),
      )
    }

    await this.playAudioFiles(files, download)
  }

  readonly customAnnouncementTabs: Record<string, CustomAnnouncementTab> = {
    thisStation: {
      name: 'Stopped at station',
      component: CustomAnnouncementPane,
      props: {
        playHandler: this.playAtStationAnnouncement.bind(this),
        presets: announcementPresets.thisStation,
        options: {
          thisStationCrs: {
            name: 'This station',
            default: AllStationFiles.em[0],
            options: AllStations.filter(station => station.audioName.e).map(stn => ({ title: stn.name, value: stn.crs })),
            type: 'select',
          },
          destinationCrs: {
            name: 'Destination station',
            default: AllStationFiles.em[0],
            options: AllStations.filter(station => station.audioName.e).map(stn => ({ title: stn.name, value: stn.crs })),
            type: 'select',
          },
          viaCrs: {
            name: 'Destination via station',
            default: 'none',
            options: [
              { title: '(None)', value: 'none' },
              ...AllStations.filter(station => station.audioName.e).map(stn => ({ title: stn.name, value: stn.crs })),
            ],
            type: 'select',
          },
          nextStationCrs: {
            name: 'Next station',
            default: AllStationFiles.em[0],
            options: AllStations.filter(station => station.audioName.e).map(stn => ({ title: stn.name, value: stn.crs })),
            type: 'select',
          },
        },
      },
    },
    approachingStation: {
      name: 'Approaching station',
      component: CustomAnnouncementPane,
      props: {
        playHandler: this.playApproachingStationAnnouncement.bind(this),
        presets: announcementPresets.approachingStation,
        options: {
          nextStationCrs: {
            name: 'Next station',
            default: AllStationFiles.em[0],
            options: AllStations.filter(station => station.audioName.e).map(stn => ({ title: stn.name, value: stn.crs })),
            type: 'select',
          },
          terminating: {
            name: 'Terminates here',
            default: false,
            type: 'boolean',
          },
        },
      },
    },

    // announcementButtons: {
    //   name: 'Announcement buttons',
    //   component: CustomButtonPane,
    //   props: {
    //     buttonSections: {
    //       Safety: [],
    //     },
    //   },
    // },
  }
}
