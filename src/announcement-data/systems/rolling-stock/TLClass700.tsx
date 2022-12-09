import React from 'react'
import CallingAtSelector from '@components/CallingAtSelector'
import CustomAnnouncementPane, { ICustomAnnouncementPreset } from '@components/PanelPanes/CustomAnnouncementPane'
import CustomButtonPane from '@components/PanelPanes/CustomButtonPane'
import { AllStationsTitleValueMap } from '@data/StationManipulators'
import { AudioItem, AudioItemObject, CustomAnnouncementTab } from '../../AnnouncementSystem'
import TrainAnnouncementSystem from '../../TrainAnnouncementSystem'
import crsToStationItemMapper from '@helpers/crsToStationItemMapper'

const AdditionalStations: { crs: string; name: string }[] = [
  { crs: 'TESTELJ', name: "TEST - Eleanor's Junction" },
  { crs: 'TESTHHL', name: 'TEST - Haste Hill' },
  { crs: 'TESTWBY', name: 'TEST - Woody Bay' },
  { crs: 'TESTWLN', name: 'TEST - Willow Lawn' },
]

const AdditionalStationsTitleValueMap = AdditionalStations.map(s => ({ title: s.name, value: s.crs }))

interface IApproachingStationAnnouncementOptions {
  stationCode: string
  isAto: boolean
  terminatesHere: boolean
  takeCareAsYouLeave: boolean
  changeFor: string[]
}
interface IStoppedAtStationAnnouncementOptions {
  thisStationCode: string
  terminatesAtCode: string
  callingAtCodes: { crsCode: string; name: string; randomId: string }[]
  mindTheGap: boolean
}
interface IInitialDepartureAnnouncementOptions {
  terminatesAtCode: string
  callingAtCodes: { crsCode: string; name: string; randomId: string }[]
  isSoutheastern: boolean
}

const announcementPresets: Readonly<Record<string, ICustomAnnouncementPreset[]>> = {
  stopped: [
    {
      name: 'Burgess Hill to Bedford',
      state: {
        thisStationCode: 'BUG',
        terminatesAtCode: 'BDM',
        callingAtCodes: [
          'WVF',
          'HHE',
          'TBD',
          'GTW',
          'ECR',
          'LBG',
          'BFR',
          'CTK',
          'ZFD',
          'STP',
          'SAC',
          'HPD',
          'LTN',
          'LUT',
          'LEA',
          'HLN',
          'FLT',
        ].map(crsToStationItemMapper),
        mindTheGap: true,
      },
    },
    {
      name: 'Burgess Hill to Brighton',
      state: {
        thisStationCode: 'BUG',
        terminatesAtCode: 'BTN',
        callingAtCodes: ['HSK', 'PRP'].map(crsToStationItemMapper),
        mindTheGap: true,
      },
    },
  ],
}

export default class ThameslinkClass700 extends TrainAnnouncementSystem {
  readonly NAME = 'Thameslink Class 700 - Julie & Matt'
  readonly ID = 'TL_CLASS_700_V1'
  readonly FILE_PREFIX = 'TL/700'
  readonly SYSTEM_TYPE = 'train'

  private readonly StationsWithAttractions = {
    BFR: 'riverboat services from blackfriars pier the southbank and the tate modern',
    CTK: 'st pauls cathedral',
    DYP: 'the emirates stadium',
    // HHE: 'the bluebell railway',
    GNH: 'a bus to the bluewater shopping centre',
    GNW: 'the national maritime museum and the royal observatory',
    HAT: 'hatfield house',
    KGX: 'london st pancras international and the british library',
    LBG: 'riverboat services from london bridge city pier tower bridge and the shard',
    LTN: 'london luton airport',
    RTR: 'rochester castle',
    STH: 'shepreth wildlife park',
    STP: 'london kings cross and the british library',
    WGC: 'the howard centre',
  }

  private readonly StationsWithForcedChangeHere = {
    ABW: 'other national rail services',
    DMK: 'london overground and other national rail services',
    ECR: 'other national rail and tramlink services',
    EPH: 'the bakerloo and northern lines',
    FPK: 'the piccadilly and victoria lines alight here for services to moorgate',
    LBG: 'other national rail services also change here for the jubilee and northern lines',
    KTN: 'the northern line',
    MIJ: 'other national rail and tramlink services',
    NWD: 'london overground and other national rail services',
    PMR: 'london overground and other national rail services',
    STP: 'other national rail services including eurostar services to mainland europe',
    WIM: 'other national rail tramlink services and the district line',
    WHP: 'london overground services and the jubilee line',
    WWA: 'the dlr via london city airport and other national rail services',
    ZFD: 'the circle hammersmith city and metropolitan lines',
    // ZFD: 'crossrail services and the circle hammersmith city and metropolitan lines',
  }

  private readonly OtherServicesAvailable = [{ title: 'Other NR services', value: 'other national rail services' }]

  /**
   * @inheritdoc
   */
  protected validateStationExists(stationCrs: string, type: 'high' | 'low' = 'high'): boolean {
    if (AdditionalStations.some(s => s.crs === stationCrs)) return true

    return super.validateStationExists(stationCrs, type)
  }

  private async playApproachingStationAnnouncement(options: IApproachingStationAnnouncementOptions, download: boolean = false): Promise<void> {
    const files: AudioItem[] = []

    if (options.terminatesHere) {
      if (!this.validateStationExists(options.stationCode, 'high')) return

      files.push(
        'we will shortly be arriving at',
        { id: `stations.high.${options.stationCode}`, opts: { delayStart: 500 } },
        'our final destination thank you for travelling with us please remember to take all your personal belongings with you when you leave the train',
      )
    } else {
      if (!this.validateStationExists(options.stationCode, 'low')) return

      files.push('we will shortly be arriving at', { id: `stations.low.${options.stationCode}`, opts: { delayStart: 500 } })
    }

    if (Object.keys(this.StationsWithForcedChangeHere).includes(options.stationCode)) {
      const manualChangeFor = this.StationsWithForcedChangeHere[options.stationCode as keyof typeof this.StationsWithForcedChangeHere]

      // We force 'change here' announcements for these stations
      files.push({ id: 'change here for', opts: { delayStart: 500 } })
      files.push(`station connections.${manualChangeFor}`)
    } else if (options.changeFor.length > 0) {
      files.push({ id: 'change here for', opts: { delayStart: 500 } })
      files.push(
        ...this.pluraliseAudio(
          options.changeFor.map(poi => `station connections.${poi}`),
          50,
        ),
      )
    }

    if (Object.keys(this.StationsWithAttractions).includes(options.stationCode)) {
      files.push('exit here for')
      files.push(`station attractions.${this.StationsWithAttractions[options.stationCode]}`)
    }

    if (options.takeCareAsYouLeave) {
      files.push({ id: 'please make sure you have all your belongings and take care as you leave the train', opts: { delayStart: 500 } })
    }

    if (options.isAto) {
      files.push({ id: 'the doors will open automatically at the next station', opts: { delayStart: 500 } })
    }

    await this.playAudioFiles(files, download)
  }

  private async playStoppedAtStationAnnouncement(options: IStoppedAtStationAnnouncementOptions, download: boolean = false): Promise<void> {
    const { thisStationCode, terminatesAtCode, callingAtCodes } = options

    const files: AudioItem[] = []

    if (options.mindTheGap) {
      files.push('please mind the gap between the train and the platform')
    }

    if (!this.validateStationExists(thisStationCode, 'low')) return

    files.push(
      { id: 'this station is', opts: { delayStart: options.mindTheGap ? 500 : 0 } },
      { id: `stations.low.${thisStationCode}`, opts: { delayStart: 500 } },
    )

    if (thisStationCode === terminatesAtCode) {
      files.push({ id: 'this train terminates here all change', opts: { delayStart: 4600 } })
    } else if (callingAtCodes.length === 0) {
      if (!this.validateStationExists(terminatesAtCode, 'high')) return

      files.push({ id: 'the next station is', opts: { delayStart: 4600 } }, `stations.high.${terminatesAtCode}`, `our final destination`)
    } else {
      if (!this.validateStationExists(terminatesAtCode, 'low')) return

      files.push({ id: 'this train terminates at', opts: { delayStart: 4600 } }, `stations.low.${terminatesAtCode}`)

      files.push({ id: 'we will be calling at', opts: { delayStart: 1000 } })

      if (callingAtCodes.some(({ crsCode }) => !this.validateStationExists(crsCode, 'high'))) return
      if (!this.validateStationExists(terminatesAtCode, 'low')) return

      files.push(
        ...this.pluraliseAudio(
          [
            ...callingAtCodes.map(
              ({ crsCode }): AudioItemObject => ({
                id: `stations.high.${crsCode}`,
                opts: { delayStart: 350 },
              }),
            ),
            {
              id: `stations.low.${terminatesAtCode}`,
              opts: { delayStart: 350 },
            },
          ],
          350,
        ),
      )
    }

    await this.playAudioFiles(files, download)
  }

  private async playInitialDepartureAnnouncement(options: IInitialDepartureAnnouncementOptions, download: boolean = false): Promise<void> {
    const { terminatesAtCode, callingAtCodes } = options

    const files: AudioItem[] = []

    if (!this.validateStationExists(terminatesAtCode, 'low')) return
    if (options.isSoutheastern) {
      files.push('welcome aboard this southeastern service to', { id: `stations.low.${terminatesAtCode}`, opts: { delayStart: 250 } })
    } else {
      files.push('welcome aboard this service to', { id: `stations.low.${terminatesAtCode}`, opts: { delayStart: 250 } })
    }

    if (callingAtCodes.length === 0) {
      if (!this.validateStationExists(terminatesAtCode, 'high')) return

      files.push({ id: 'the next station is', opts: { delayStart: 1000 } }, `stations.high.${terminatesAtCode}`, `our final destination`)
    } else {
      files.push({ id: 'we will be calling at', opts: { delayStart: 1000 } })

      if (callingAtCodes.some(({ crsCode }) => !this.validateStationExists(crsCode, 'high'))) return
      if (!this.validateStationExists(terminatesAtCode, 'low')) return

      files.push(
        ...this.pluraliseAudio(
          [
            ...callingAtCodes.map(
              ({ crsCode }, i): AudioItemObject => ({
                id: `stations.high.${crsCode}`,
                opts: { delayStart: 350 },
              }),
            ),
            {
              id: `stations.low.${terminatesAtCode}`,
              opts: { delayStart: 350 },
            },
          ],
          350,
        ),
      )
    }

    files.push({
      id: `safety information is provided on posters in every carriage`,
      opts: { delayStart: 2000 },
    })

    await this.playAudioFiles(files, download)
  }

  readonly AllAvailableStationNames: string[] = [
    'AAP',
    'ABN',
    'ABW',
    'ADM',
    'AFK',
    'AGT',
    'AHD',
    'AHS',
    'AMY',
    'ANF',
    'ANG',
    'ANY',
    'APD',
    'APS',
    // 'ARL-unused-new',
    'ARL',
    'ARU',
    'ASI',
    'AWM',
    'AYH',
    'AYL',
    'AYP',
    'BAA',
    'BAB',
    'BAD',
    'BAK',
    'BAL',
    'BAT',
    'BAY',
    'BBL',
    'BCH',
    'BCP',
    'BCR',
    'BCT',
    'BCU',
    'BCY',
    'BDH',
    'BDK',
    'BDM',
    'BEC',
    'BEG',
    'BEU',
    'BEX',
    'BFR',
    'BGM',
    'BIG',
    'BIK',
    'BIP',
    'BIW',
    'BKA',
    'BKH',
    'BKJ',
    'BKL',
    'BKM',
    'BKS',
    'BLM',
    'BLY',
    'BMG',
    'BMH',
    'BMN',
    'BMS',
    'BNH',
    'BOG',
    'BOH',
    'BOP',
    'BPK',
    'BRG',
    'BRK',
    'BRX',
    'BSD',
    'BSH',
    'BSR',
    'BTC',
    'BTE',
    'BTN',
    'BUG',
    'BUO',
    'BVD',
    'BXD',
    'BXH',
    'BXW',
    'BXY',
    'CAT',
    'CBE',
    'CBG',
    'CBR',
    'CBW',
    'CCH',
    'CDN',
    'CDS',
    'CED',
    'CFB',
    'CFT',
    'CHE',
    'CHG',
    'CHH',
    'CHP',
    'CHR',
    'CHX',
    'CIL',
    'CIT',
    'CLA',
    'CLD',
    'CLJ',
    'CLK',
    'CLL',
    'CLP',
    'CMB',
    'COB',
    'COH',
    'COR',
    'CRI',
    'CRT',
    'CRW',
    'CRY',
    'CSA',
    'CSB',
    'CSH',
    'CSP',
    'CST',
    'CSW',
    'CTF',
    'CTK',
    'CTM',
    'CTN',
    'CUF',
    'CUX',
    'CWH',
    'CWN',
    'CWU',
    'CYP',
    'DBY',
    'DEA',
    'DEP',
    'DFD',
    'DKG',
    'DLH',
    'DMK',
    'DMP',
    'DMS',
    'DNG',
    'DOW',
    'DUR',
    'DVP',
    // 'DYP-unused-new',
    'DYP',
    'EBD',
    'EBN',
    'EBR',
    'EBT',
    'ECR',
    'EDN',
    'EDW',
    'EFF',
    'EFL',
    'EGR',
    'ELD',
    'ELE',
    'ELS',
    'ELW',
    'ELY',
    'EMD',
    'EML',
    'EMS',
    'ENC',
    'EPD',
    'EPH',
    'EPS',
    'ERH',
    'ERI',
    'ESD',
    'ESF',
    'ESL',
    'ETC',
    'EWE',
    'EWR',
    'EXR',
    'EYN',
    'FAV',
    'FCN',
    'FGT',
    'FKC',
    'FKH',
    'FKW',
    'FLT',
    'FMR',
    'FNR',
    'FOD',
    'FOH',
    'FPK',
    'FRM',
    'FRT',
    'FSB',
    'FSG',
    'FTN',
    'FXN',
    'GBS',
    'GDH',
    'GDN',
    'GIP',
    'GLD',
    'GLM',
    'GLY',
    'GNH',
    'GNW',
    'GPK',
    'GRP',
    'GRV',
    'GTW',
    'HAI',
    'HAT',
    'HAV',
    'HBN',
    'HCB',
    'HCN',
    'HDW',
    'HEN',
    'HEV',
    'HFN',
    'HGM',
    'HGR',
    'HGS',
    'HGY',
    'HHE',
    'HHY',
    'HIB',
    'HIT',
    'HLB',
    'HLM',
    'HLN',
    'HLS',
    'HMD',
    'HME',
    'HML',
    'HMT',
    'HNA',
    'HNB',
    'HNH',
    'HOR',
    'HOV',
    'HPA',
    'HPD',
    'HRH',
    'HRM',
    'HRN',
    'HRW',
    'HSK',
    'HSY',
    'HUN',
    'HUR',
    'HYR',
    'HYS',
    'IFI',
    'IPW',
    'KBW',
    'KCK',
    'KDB',
    'KET',
    'KGL',
    'KGX',
    'KLN',
    'KLY',
    'KML',
    'KMS',
    'KND',
    'KPA',
    'KSN',
    'KTH',
    'KTN',
    'LAC',
    'LAD',
    'LBG',
    'LBZ',
    'LEA',
    'LEE',
    'LEI',
    'LEN',
    // 'LET-unused-new',
    'LET',
    'LEW',
    'LFG',
    'LGF',
    'LGJ',
    'LHD',
    'LIH',
    'LIT',
    'LRB',
    'LRD',
    'LSY',
    // 'LTN-unused-new',
    'LTN',
    'LTP',
    'LUT',
    'LVN',
    'LWS',
    'MAR',
    'MBK',
    'MCB',
    'MDB',
    'MDE',
    'MDS',
    'MDW',
    'MEL',
    'MEP',
    // 'MHM-old',
    'MHM',
    'MHR',
    'MIJ',
    'MIL',
    'MKC',
    'MOG',
    'MRN',
    'MSR',
    'MTC',
    'MTG',
    'MTM',
    'MZH',
    'NBA',
    'NBC',
    'NDL',
    'NEH',
    'NFL',
    'NGT',
    'NHD',
    'NHE',
    'NMP',
    'NOT',
    'NRB',
    'NSB',
    'NSG',
    'NTL',
    'NUF',
    'NUT',
    'NVH',
    'NVM',
    'NVN',
    'NWD',
    'NWM',
    'NWX',
    'NXG',
    'OKL',
    'OLD',
    'OLY',
    'ORE',
    'ORP',
    'OTF',
    'OXT',
    'PAL',
    'PBO',
    'PBR',
    'PDW',
    'PEB',
    'PET',
    'PEV',
    'PHR',
    'PLC',
    'PLD',
    'PLG',
    'PLU',
    'PMH',
    'PMP',
    'PMR',
    'PMS',
    'PNE',
    'PNW',
    'POK',
    'PRP',
    'PTC',
    'PUL',
    'PUO',
    'PUR',
    'QBR',
    'QRP',
    'RAI',
    'RAM',
    'RBR',
    'RDB',
    'RDD',
    'RDH',
    'RDT',
    'REI',
    'RHM',
    'RTR',
    'RUG',
    'RVB',
    'RYE',
    'RYS',
    'SAC',
    'SAF',
    'SAJ',
    'SAY',
    'SBM',
    'SCG',
    'SCY',
    'SDA',
    'SDG',
    'SDN',
    'SDW',
    'SDY',
    'SEE',
    'SEF',
    'SEG',
    'SEH',
    'SEV',
    'SGR',
    'SHF',
    'SHO',
    'SID',
    'SIH',
    'SIT',
    'SLQ',
    'SMI',
    'SMO',
    'SMY',
    'SNO',
    'SNR',
    'SNW',
    'SOB',
    'SOG',
    'SOO',
    'SOR',
    'SOU',
    'SPB',
    'SPH',
    'SPL',
    'SPU',
    'SPX',
    'SRA',
    'SRC',
    'SRH',
    'SRS',
    'SRT',
    'SSE',
    'SSS',
    'STE',
    'STH',
    'STP',
    'STU',
    'SUC',
    'SUO',
    'SUP',
    'SVG',
    'SWK',
    'SWL',
    'SWM',
    'SWO',
    'SWY',
    'SYD',
    'SYH',
    'TAD',
    'TAT',
    'TBD',
    'TBW',
    'TESTELJ',
    'TESTHHL',
    'TESTWBY',
    'TESTWLN',
    'TEY',
    'TOK',
    'TON',
    'TOO',
    'TRI',
    'TTH',
    'TTN',
    'TUH',
    'UCK',
    'UWL',
    'VIC',
    'WAD',
    'WAE',
    'WAM',
    'WAS',
    'WAT',
    'WBC',
    'WBL',
    'WBO',
    'WBP',
    'WCB',
    'WCY',
    'WDO',
    'WDU',
    'WEL',
    'WFJ',
    'WGA',
    'WGC',
    'WHA',
    'WHI',
    'WHP',
    'WHS',
    'WHY',
    'WIH',
    'WIM',
    'WIX',
    'WLD',
    'WLI',
    'WLS',
    'WLT',
    'WLW',
    'WMA',
    'WMB',
    'WME',
    // 'WMG-old',
    'WMG',
    'WNH',
    'WNW',
    'WOH',
    'WRH',
    'WSE',
    'WSU',
    'WSW',
    'WTG',
    'WTR',
    'WVF',
    'WWA',
    'WWD',
    'WWI',
    'WWO',
    'WWR',
    'WYE',
    'YAL',
    'ZFD',
  ]

  readonly AvailableStationNames = {
    low: this.AllAvailableStationNames,
    high: this.AllAvailableStationNames,
  }

  get allAvailableStationsAndTestStations() {
    const arr = AllStationsTitleValueMap.filter(s => this.AllAvailableStationNames.includes(s.value)).concat(AdditionalStationsTitleValueMap)

    arr.sort((a, b) => a.title.localeCompare(b.title))

    return arr
  }

  readonly customAnnouncementTabs: Record<string, CustomAnnouncementTab> = {
    initialDeparture: {
      name: 'Initial departure',
      component: CustomAnnouncementPane,
      props: {
        playHandler: this.playInitialDepartureAnnouncement.bind(this),
        options: {
          terminatesAtCode: {
            name: 'Terminates at',
            default: this.allAvailableStationsAndTestStations[0].value,
            options: this.allAvailableStationsAndTestStations,
            type: 'select',
          },
          callingAtCodes: {
            name: '',
            type: 'custom',
            component: CallingAtSelector,
            props: {
              availableStations: this.AllAvailableStationNames,
              additionalOptions: AdditionalStationsTitleValueMap,
            },
            default: [],
          },
          isSoutheastern: {
            name: 'Southeastern service?',
            default: false,
            type: 'boolean',
          },
        },
      },
    },
    approachingStation: {
      name: 'Approaching station',
      component: CustomAnnouncementPane,
      props: {
        playHandler: this.playApproachingStationAnnouncement.bind(this),
        options: {
          stationCode: {
            name: 'Next station',
            default: this.allAvailableStationsAndTestStations[0].value,
            options: this.allAvailableStationsAndTestStations,
            type: 'select',
          },
          isAto: {
            name: 'Automatic train operation?',
            default: false,
            type: 'boolean',
          },
          terminatesHere: {
            name: 'Terminates here?',
            default: false,
            type: 'boolean',
          },
          takeCareAsYouLeave: {
            name: 'Take care as you leave the train?',
            default: false,
            type: 'boolean',
          },
          changeForOverridden: {
            type: 'customNoState',
            component: ({ activeState }) => {
              if (Object.keys(this.StationsWithForcedChangeHere).includes(activeState.stationCode as string)) {
                return <p className="warningMessage">The "Change for" setting will have no effect for this station.</p>
              }

              return null
            },
          },
          changeFor: {
            name: 'Change for...',
            type: 'multiselect',
            options: this.OtherServicesAvailable,
            default: [],
          },
          poiMessage: {
            type: 'customNoState',
            component: ({ activeState }) => {
              if (Object.keys(this.StationsWithAttractions).includes(activeState.stationCode as string)) {
                return (
                  <p className="infoMessage">
                    This announcement will also contain additional information which cannot be modified, relating to local points of interest.
                  </p>
                )
              }

              return null
            },
          },
        },
      },
    },
    stoppedAtStation: {
      name: 'Stopped at station',
      component: CustomAnnouncementPane,
      props: {
        presets: announcementPresets.stopped,
        playHandler: this.playStoppedAtStationAnnouncement.bind(this),
        options: {
          thisStationCode: {
            name: 'This station',
            default: this.allAvailableStationsAndTestStations[0].value,
            options: this.allAvailableStationsAndTestStations,
            type: 'select',
          },
          terminatesAtCode: {
            name: 'Terminates at',
            default: this.allAvailableStationsAndTestStations[0].value,
            options: this.allAvailableStationsAndTestStations,
            type: 'select',
          },
          callingAtCodes: {
            name: '',
            type: 'custom',
            component: CallingAtSelector,
            props: {
              availableStations: this.AllAvailableStationNames,
              additionalOptions: AdditionalStationsTitleValueMap,
            },
            default: [],
          },
          mindTheGap: {
            name: 'Mind the gap?',
            default: false,
            type: 'boolean',
          },
        },
      },
    },
    announcementButtons: {
      name: 'Announcement buttons',
      component: CustomButtonPane,
      props: {
        buttonSections: {
          Safety: [
            {
              label: 'BTP (new)',
              play: this.playAudioFiles.bind(this, ['matt.if you see something that doesnt look right report it to a member of staff or']),
              download: this.playAudioFiles.bind(
                this,
                ['matt.if you see something that doesnt look right report it to a member of staff or'],
                true,
              ),
            },
            {
              label: 'BTP (old)',
              play: this.playAudioFiles.bind(this, ['matt.if you see something that doesnt look right speak to staff or text']),
              download: this.playAudioFiles.bind(this, ['matt.if you see something that doesnt look right speak to staff or text'], true),
            },
            {
              label: 'Safety information on posters',
              play: this.playAudioFiles.bind(this, ['safety information is provided on posters in every carriage']),
              download: this.playAudioFiles.bind(this, ['safety information is provided on posters in every carriage'], true),
            },
          ],
          General: [
            {
              label: 'Manual PA chime',
              play: this.playAudioFiles.bind(this, ['pa chime']),
              download: this.playAudioFiles.bind(this, ['pa chime'], true),
            },
            {
              label: 'Oyster and contactless may only be used on certain routes',
              play: this.playAudioFiles.bind(this, [
                'matt.oyster and contactless payments may only be used on certain routes and at specific stations',
              ]),
              download: this.playAudioFiles.bind(
                this,
                ['matt.oyster and contactless payments may only be used on certain routes and at specific stations'],
                true,
              ),
            },
          ],
          Disruption: [
            {
              label: 'Being held at red signal',
              play: this.playAudioFiles.bind(this, ['disruption.this train is being held at a red signal and should be moving shortly']),
              download: this.playAudioFiles.bind(
                this,
                ['disruption.this train is being held at a red signal and should be moving shortly'],
                true,
              ),
            },
            {
              label: 'Held due to congestion',
              play: this.playAudioFiles.bind(this, ['disruption.this train is being held at a signal owing to congestion ahead']),
              download: this.playAudioFiles.bind(this, ['disruption.this train is being held at a signal owing to congestion ahead'], true),
            },
            {
              label: 'Held due to PASCOM',
              play: this.playAudioFiles.bind(this, [
                'disruption.this train is being held here while our staff investigate the operation of a passenger',
              ]),
              download: this.playAudioFiles.bind(
                this,
                ['disruption.this train is being held here while our staff investigate the operation of a passenger'],
                true,
              ),
            },
          ],
          Legacy: [
            {
              label: 'You must wear a face covering',
              play: this.playAudioFiles.bind(this, ['special.you must wear a face covering on your jouney unless you are exempt']),
              download: this.playAudioFiles.bind(this, ['special.you must wear a face covering on your jouney unless you are exempt'], true),
            },
            {
              label: 'Brighton Mainline Improvements (2018) - Geoff',
              play: this.playAudioFiles.bind(this, ['special.brighton mainline improvement 2018 geoff 1']),
              download: this.playAudioFiles.bind(this, ['special.brighton mainline improvement 2018 geoff 1'], true),
            },
            {
              label: 'Brighton Mainline Improvements (2018) - Geoff (Revised)',
              play: this.playAudioFiles.bind(this, ['special.brighton mainline improvement 2018 geoff revised generic']),
              download: this.playAudioFiles.bind(this, ['special.brighton mainline improvement 2018 geoff revised generic'], true),
            },
            {
              label: 'Brighton Mainline Improvements (2018) - Geoff (Revised and detailed)',
              play: this.playAudioFiles.bind(this, ['special.brighton mainline improvement 2018 geoff revised detailed']),
              download: this.playAudioFiles.bind(this, ['special.brighton mainline improvement 2018 geoff revised detailed'], true),
            },
            {
              label: 'Railplan 2020 - Richard',
              play: this.playAudioFiles.bind(this, ['special.railplan 2020']),
              download: this.playAudioFiles.bind(this, ['special.railplan 2020'], true),
            },
          ],
        },
      },
    },
  }
}
