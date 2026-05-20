// FIFA World Cup 2026 – Official fixture data (source: FIFA.com, December 2025 draw)
// All 72 group stage games with real dates and venues.
// Team IDs match src/data/teams.js
// ──────────────────────────────────────────────────────────────────────────────

export const TOURNAMENT_START = new Date('2026-06-11T21:00:00Z') // Azteca opener
export const TOURNAMENT_END   = new Date('2026-07-19T20:00:00Z') // MetLife Final

// Official groups – teamIds in draw order (seed, pot2, pot3, pot4)
export const GROUPS = {
  A: { name: 'Group A', teamIds: [1,  2,  3,  4]  },  // Mexico, South Korea, Czechia, South Africa
  B: { name: 'Group B', teamIds: [5,  6,  7,  8]  },  // Canada, Switzerland, Bosnia-Herz, Qatar
  C: { name: 'Group C', teamIds: [9,  10, 11, 12] },  // Brazil, Morocco, Scotland, Haiti
  D: { name: 'Group D', teamIds: [13, 14, 15, 16] },  // USA, Australia, Türkiye, Paraguay
  E: { name: 'Group E', teamIds: [17, 18, 19, 20] },  // Germany, Côte d'Ivoire, Ecuador, Curaçao
  F: { name: 'Group F', teamIds: [21, 22, 23, 24] },  // Netherlands, Japan, Sweden, Tunisia
  G: { name: 'Group G', teamIds: [25, 26, 27, 28] },  // Belgium, IR Iran, Egypt, New Zealand
  H: { name: 'Group H', teamIds: [29, 30, 31, 32] },  // Spain, Uruguay, Saudi Arabia, Cabo Verde
  I: { name: 'Group I', teamIds: [33, 34, 35, 36] },  // France, Senegal, Norway, Iraq
  J: { name: 'Group J', teamIds: [37, 38, 39, 40] },  // Argentina, Algeria, Austria, Jordan
  K: { name: 'Group K', teamIds: [41, 42, 43, 44] },  // Portugal, Colombia, Uzbekistan, Congo DR
  L: { name: 'Group L', teamIds: [45, 46, 47, 48] },  // England, Croatia, Panama, Ghana
}

// ── All 72 group stage fixtures ──────────────────────────────────────────────
// home / away = team id  |  date = YYYY-MM-DD  |  simultaneous = MD3 rule
export const GROUP_FIXTURES = [
  // ── GROUP A ──────────────────────────────────────────────────────────────
  // MD1 – Jun 11
  { id:  1, group:'A', matchday:1, home: 1, away: 4,  date:'2026-06-11', simultaneous:false, venue:'Estadio Azteca, Mexico City'            },
  { id:  2, group:'A', matchday:1, home: 2, away: 3,  date:'2026-06-11', simultaneous:false, venue:'Estadio Akron, Guadalajara'              },
  // MD2 – Jun 18
  { id:  3, group:'A', matchday:2, home: 3, away: 4,  date:'2026-06-18', simultaneous:false, venue:'Mercedes-Benz Stadium, Atlanta'          },
  { id:  4, group:'A', matchday:2, home: 1, away: 2,  date:'2026-06-18', simultaneous:false, venue:'Estadio Akron, Guadalajara'              },
  // MD3 – Jun 24 (simultaneous)
  { id:  5, group:'A', matchday:3, home: 3, away: 1,  date:'2026-06-24', simultaneous:true,  venue:'Estadio Azteca, Mexico City'             },
  { id:  6, group:'A', matchday:3, home: 4, away: 2,  date:'2026-06-24', simultaneous:true,  venue:'Estadio BBVA, Monterrey'                 },

  // ── GROUP B ──────────────────────────────────────────────────────────────
  // MD1 – Jun 12 / 13
  { id:  7, group:'B', matchday:1, home: 5, away: 7,  date:'2026-06-12', simultaneous:false, venue:'BMO Field, Toronto'                      },
  { id:  8, group:'B', matchday:1, home: 8, away: 6,  date:'2026-06-13', simultaneous:false, venue:"Levi's Stadium, San Francisco Bay Area"   },
  // MD2 – Jun 18
  { id:  9, group:'B', matchday:2, home: 6, away: 7,  date:'2026-06-18', simultaneous:false, venue:'SoFi Stadium, Los Angeles'               },
  { id: 10, group:'B', matchday:2, home: 5, away: 8,  date:'2026-06-18', simultaneous:false, venue:'BC Place, Vancouver'                     },
  // MD3 – Jun 24 (simultaneous)
  { id: 11, group:'B', matchday:3, home: 6, away: 5,  date:'2026-06-24', simultaneous:true,  venue:'BC Place, Vancouver'                     },
  { id: 12, group:'B', matchday:3, home: 7, away: 8,  date:'2026-06-24', simultaneous:true,  venue:'Lumen Field, Seattle'                    },

  // ── GROUP C ──────────────────────────────────────────────────────────────
  // MD1 – Jun 13
  { id: 13, group:'C', matchday:1, home:12, away:11,  date:'2026-06-13', simultaneous:false, venue:'Gillette Stadium, Boston'                },
  { id: 14, group:'C', matchday:1, home: 9, away:10,  date:'2026-06-13', simultaneous:false, venue:'MetLife Stadium, New York/New Jersey'    },
  // MD2 – Jun 19
  { id: 15, group:'C', matchday:2, home: 9, away:12,  date:'2026-06-19', simultaneous:false, venue:'Lincoln Financial Field, Philadelphia'   },
  { id: 16, group:'C', matchday:2, home:11, away:10,  date:'2026-06-19', simultaneous:false, venue:'Gillette Stadium, Boston'                },
  // MD3 – Jun 24 (simultaneous)
  { id: 17, group:'C', matchday:3, home:11, away: 9,  date:'2026-06-24', simultaneous:true,  venue:'Hard Rock Stadium, Miami'                },
  { id: 18, group:'C', matchday:3, home:10, away:12,  date:'2026-06-24', simultaneous:true,  venue:'Mercedes-Benz Stadium, Atlanta'          },

  // ── GROUP D ──────────────────────────────────────────────────────────────
  // MD1 – Jun 12 / 13
  { id: 19, group:'D', matchday:1, home:13, away:16,  date:'2026-06-12', simultaneous:false, venue:'SoFi Stadium, Los Angeles'               },
  { id: 20, group:'D', matchday:1, home:14, away:15,  date:'2026-06-13', simultaneous:false, venue:'BC Place, Vancouver'                     },
  // MD2 – Jun 19
  { id: 21, group:'D', matchday:2, home:15, away:16,  date:'2026-06-19', simultaneous:false, venue:"Levi's Stadium, San Francisco Bay Area"   },
  { id: 22, group:'D', matchday:2, home:13, away:14,  date:'2026-06-19', simultaneous:false, venue:'Lumen Field, Seattle'                    },
  // MD3 – Jun 25 (simultaneous)
  { id: 23, group:'D', matchday:3, home:15, away:13,  date:'2026-06-25', simultaneous:true,  venue:'SoFi Stadium, Los Angeles'               },
  { id: 24, group:'D', matchday:3, home:16, away:14,  date:'2026-06-25', simultaneous:true,  venue:"Levi's Stadium, San Francisco Bay Area"   },

  // ── GROUP E ──────────────────────────────────────────────────────────────
  // MD1 – Jun 14
  { id: 25, group:'E', matchday:1, home:18, away:19,  date:'2026-06-14', simultaneous:false, venue:'Lincoln Financial Field, Philadelphia'   },
  { id: 26, group:'E', matchday:1, home:17, away:20,  date:'2026-06-14', simultaneous:false, venue:'NRG Stadium, Houston'                    },
  // MD2 – Jun 20
  { id: 27, group:'E', matchday:2, home:17, away:18,  date:'2026-06-20', simultaneous:false, venue:'BMO Field, Toronto'                      },
  { id: 28, group:'E', matchday:2, home:19, away:20,  date:'2026-06-20', simultaneous:false, venue:'Arrowhead Stadium, Kansas City'          },
  // MD3 – Jun 25 (simultaneous)
  { id: 29, group:'E', matchday:3, home:20, away:18,  date:'2026-06-25', simultaneous:true,  venue:'Lincoln Financial Field, Philadelphia'   },
  { id: 30, group:'E', matchday:3, home:19, away:17,  date:'2026-06-25', simultaneous:true,  venue:'MetLife Stadium, New York/New Jersey'    },

  // ── GROUP F ──────────────────────────────────────────────────────────────
  // MD1 – Jun 14
  { id: 31, group:'F', matchday:1, home:21, away:22,  date:'2026-06-14', simultaneous:false, venue:'AT&T Stadium, Dallas'                    },
  { id: 32, group:'F', matchday:1, home:23, away:24,  date:'2026-06-14', simultaneous:false, venue:'Estadio BBVA, Monterrey'                 },
  // MD2 – Jun 20
  { id: 33, group:'F', matchday:2, home:21, away:23,  date:'2026-06-20', simultaneous:false, venue:'NRG Stadium, Houston'                    },
  { id: 34, group:'F', matchday:2, home:24, away:22,  date:'2026-06-20', simultaneous:false, venue:'Estadio BBVA, Monterrey'                 },
  // MD3 – Jun 25 (simultaneous)
  { id: 35, group:'F', matchday:3, home:22, away:23,  date:'2026-06-25', simultaneous:true,  venue:'AT&T Stadium, Dallas'                    },
  { id: 36, group:'F', matchday:3, home:24, away:21,  date:'2026-06-25', simultaneous:true,  venue:'Arrowhead Stadium, Kansas City'          },

  // ── GROUP G ──────────────────────────────────────────────────────────────
  // MD1 – Jun 15
  { id: 37, group:'G', matchday:1, home:26, away:28,  date:'2026-06-15', simultaneous:false, venue:'SoFi Stadium, Los Angeles'               },
  { id: 38, group:'G', matchday:1, home:25, away:27,  date:'2026-06-15', simultaneous:false, venue:'Lumen Field, Seattle'                    },
  // MD2 – Jun 21
  { id: 39, group:'G', matchday:2, home:25, away:26,  date:'2026-06-21', simultaneous:false, venue:'SoFi Stadium, Los Angeles'               },
  { id: 40, group:'G', matchday:2, home:28, away:27,  date:'2026-06-21', simultaneous:false, venue:'BC Place, Vancouver'                     },
  // MD3 – Jun 26 (simultaneous)
  { id: 41, group:'G', matchday:3, home:27, away:26,  date:'2026-06-26', simultaneous:true,  venue:'Lumen Field, Seattle'                    },
  { id: 42, group:'G', matchday:3, home:28, away:25,  date:'2026-06-26', simultaneous:true,  venue:'BC Place, Vancouver'                     },

  // ── GROUP H ──────────────────────────────────────────────────────────────
  // MD1 – Jun 15
  { id: 43, group:'H', matchday:1, home:31, away:30,  date:'2026-06-15', simultaneous:false, venue:'Hard Rock Stadium, Miami'                },
  { id: 44, group:'H', matchday:1, home:29, away:32,  date:'2026-06-15', simultaneous:false, venue:'Mercedes-Benz Stadium, Atlanta'          },
  // MD2 – Jun 21
  { id: 45, group:'H', matchday:2, home:30, away:32,  date:'2026-06-21', simultaneous:false, venue:'Hard Rock Stadium, Miami'                },
  { id: 46, group:'H', matchday:2, home:29, away:31,  date:'2026-06-21', simultaneous:false, venue:'Mercedes-Benz Stadium, Atlanta'          },
  // MD3 – Jun 26 (simultaneous)
  { id: 47, group:'H', matchday:3, home:32, away:31,  date:'2026-06-26', simultaneous:true,  venue:'NRG Stadium, Houston'                    },
  { id: 48, group:'H', matchday:3, home:30, away:29,  date:'2026-06-26', simultaneous:true,  venue:'Estadio Akron, Guadalajara'              },

  // ── GROUP I ──────────────────────────────────────────────────────────────
  // MD1 – Jun 16
  { id: 49, group:'I', matchday:1, home:33, away:34,  date:'2026-06-16', simultaneous:false, venue:'MetLife Stadium, New York/New Jersey'    },
  { id: 50, group:'I', matchday:1, home:36, away:35,  date:'2026-06-16', simultaneous:false, venue:'Gillette Stadium, Boston'                },
  // MD2 – Jun 22
  { id: 51, group:'I', matchday:2, home:35, away:34,  date:'2026-06-22', simultaneous:false, venue:'MetLife Stadium, New York/New Jersey'    },
  { id: 52, group:'I', matchday:2, home:33, away:36,  date:'2026-06-22', simultaneous:false, venue:'Lincoln Financial Field, Philadelphia'   },
  // MD3 – Jun 26 (simultaneous)
  { id: 53, group:'I', matchday:3, home:35, away:33,  date:'2026-06-26', simultaneous:true,  venue:'Gillette Stadium, Boston'                },
  { id: 54, group:'I', matchday:3, home:34, away:36,  date:'2026-06-26', simultaneous:true,  venue:'BMO Field, Toronto'                      },

  // ── GROUP J ──────────────────────────────────────────────────────────────
  // MD1 – Jun 16
  { id: 55, group:'J', matchday:1, home:37, away:38,  date:'2026-06-16', simultaneous:false, venue:'Arrowhead Stadium, Kansas City'          },
  { id: 56, group:'J', matchday:1, home:39, away:40,  date:'2026-06-16', simultaneous:false, venue:"Levi's Stadium, San Francisco Bay Area"   },
  // MD2 – Jun 22
  { id: 57, group:'J', matchday:2, home:37, away:39,  date:'2026-06-22', simultaneous:false, venue:'AT&T Stadium, Dallas'                    },
  { id: 58, group:'J', matchday:2, home:40, away:38,  date:'2026-06-22', simultaneous:false, venue:"Levi's Stadium, San Francisco Bay Area"   },
  // MD3 – Jun 27 (simultaneous)
  { id: 59, group:'J', matchday:3, home:38, away:39,  date:'2026-06-27', simultaneous:true,  venue:'Arrowhead Stadium, Kansas City'          },
  { id: 60, group:'J', matchday:3, home:40, away:37,  date:'2026-06-27', simultaneous:true,  venue:'AT&T Stadium, Dallas'                    },

  // ── GROUP K ──────────────────────────────────────────────────────────────
  // MD1 – Jun 17
  { id: 61, group:'K', matchday:1, home:41, away:44,  date:'2026-06-17', simultaneous:false, venue:'NRG Stadium, Houston'                    },
  { id: 62, group:'K', matchday:1, home:43, away:42,  date:'2026-06-17', simultaneous:false, venue:'Estadio Azteca, Mexico City'             },
  // MD2 – Jun 23
  { id: 63, group:'K', matchday:2, home:41, away:43,  date:'2026-06-23', simultaneous:false, venue:'NRG Stadium, Houston'                    },
  { id: 64, group:'K', matchday:2, home:42, away:44,  date:'2026-06-23', simultaneous:false, venue:'Estadio Akron, Guadalajara'              },
  // MD3 – Jun 27 (simultaneous)
  { id: 65, group:'K', matchday:3, home:42, away:41,  date:'2026-06-27', simultaneous:true,  venue:'Hard Rock Stadium, Miami'                },
  { id: 66, group:'K', matchday:3, home:44, away:43,  date:'2026-06-27', simultaneous:true,  venue:'Mercedes-Benz Stadium, Atlanta'          },

  // ── GROUP L ──────────────────────────────────────────────────────────────
  // MD1 – Jun 17
  { id: 67, group:'L', matchday:1, home:48, away:47,  date:'2026-06-17', simultaneous:false, venue:'BMO Field, Toronto'                      },
  { id: 68, group:'L', matchday:1, home:45, away:46,  date:'2026-06-17', simultaneous:false, venue:'AT&T Stadium, Dallas'                    },
  // MD2 – Jun 23
  { id: 69, group:'L', matchday:2, home:45, away:48,  date:'2026-06-23', simultaneous:false, venue:'Gillette Stadium, Boston'                },
  { id: 70, group:'L', matchday:2, home:47, away:46,  date:'2026-06-23', simultaneous:false, venue:'BMO Field, Toronto'                      },
  // MD3 – Jun 27 (simultaneous)
  { id: 71, group:'L', matchday:3, home:47, away:45,  date:'2026-06-27', simultaneous:true,  venue:'MetLife Stadium, New York/New Jersey'    },
  { id: 72, group:'L', matchday:3, home:46, away:48,  date:'2026-06-27', simultaneous:true,  venue:'Lincoln Financial Field, Philadelphia'   },
]

// ── Knockout Rounds (all 32 games, dates & venues from FIFA.com) ─────────────
export const KNOCKOUT_ROUNDS = [
  {
    id: 'r32',
    name: 'Round of 32',
    dates: 'June 28 – July 3, 2026',
    matches: [
      { id:'r32-73', num:73,  date:'2026-06-28', label:'Group A runners-up v Group B runners-up',           venue:'SoFi Stadium, Los Angeles'                },
      { id:'r32-74', num:74,  date:'2026-06-29', label:'Group E winners v best 3rd (A/B/C/D/F)',            venue:'Gillette Stadium, Boston'                  },
      { id:'r32-75', num:75,  date:'2026-06-29', label:'Group F winners v Group C runners-up',              venue:'Estadio BBVA, Monterrey'                   },
      { id:'r32-76', num:76,  date:'2026-06-29', label:'Group C winners v Group F runners-up',              venue:'NRG Stadium, Houston'                      },
      { id:'r32-77', num:77,  date:'2026-06-30', label:'Group I winners v best 3rd (C/D/F/G/H)',            venue:'MetLife Stadium, New York/New Jersey'       },
      { id:'r32-78', num:78,  date:'2026-06-30', label:'Group E runners-up v Group I runners-up',           venue:'AT&T Stadium, Dallas'                      },
      { id:'r32-79', num:79,  date:'2026-06-30', label:'Group A winners v best 3rd (C/E/F/H/I)',            venue:'Estadio Azteca, Mexico City'                },
      { id:'r32-80', num:80,  date:'2026-07-01', label:'Group L winners v best 3rd (E/H/I/J/K)',            venue:'Mercedes-Benz Stadium, Atlanta'             },
      { id:'r32-81', num:81,  date:'2026-07-01', label:'Group D winners v best 3rd (B/E/F/I/J)',            venue:"Levi's Stadium, San Francisco Bay Area"      },
      { id:'r32-82', num:82,  date:'2026-07-01', label:'Group G winners v best 3rd (A/E/H/I/J)',            venue:'Lumen Field, Seattle'                       },
      { id:'r32-83', num:83,  date:'2026-07-02', label:'Group K runners-up v Group L runners-up',           venue:'BMO Field, Toronto'                         },
      { id:'r32-84', num:84,  date:'2026-07-02', label:'Group H winners v Group J runners-up',              venue:'SoFi Stadium, Los Angeles'                  },
      { id:'r32-85', num:85,  date:'2026-07-02', label:'Group B winners v best 3rd (E/F/G/I/J)',            venue:'BC Place, Vancouver'                        },
      { id:'r32-86', num:86,  date:'2026-07-03', label:'Group J winners v Group H runners-up',              venue:'Hard Rock Stadium, Miami'                   },
      { id:'r32-87', num:87,  date:'2026-07-03', label:'Group K winners v best 3rd (D/E/I/J/L)',            venue:'Arrowhead Stadium, Kansas City'              },
      { id:'r32-88', num:88,  date:'2026-07-03', label:'Group D runners-up v Group G runners-up',           venue:'AT&T Stadium, Dallas'                       },
    ],
  },
  {
    id: 'r16',
    name: 'Round of 16',
    dates: 'July 4–7, 2026',
    matches: [
      { id:'r16-89',  num:89,  date:'2026-07-04', label:'Winner M74 v Winner M77',  venue:'Lincoln Financial Field, Philadelphia'  },
      { id:'r16-90',  num:90,  date:'2026-07-04', label:'Winner M73 v Winner M75',  venue:'NRG Stadium, Houston'                   },
      { id:'r16-91',  num:91,  date:'2026-07-05', label:'Winner M76 v Winner M78',  venue:'MetLife Stadium, New York/New Jersey'   },
      { id:'r16-92',  num:92,  date:'2026-07-05', label:'Winner M79 v Winner M80',  venue:'Estadio Azteca, Mexico City'            },
      { id:'r16-93',  num:93,  date:'2026-07-06', label:'Winner M83 v Winner M84',  venue:'AT&T Stadium, Dallas'                   },
      { id:'r16-94',  num:94,  date:'2026-07-06', label:'Winner M81 v Winner M82',  venue:'Lumen Field, Seattle'                   },
      { id:'r16-95',  num:95,  date:'2026-07-07', label:'Winner M86 v Winner M88',  venue:'Mercedes-Benz Stadium, Atlanta'         },
      { id:'r16-96',  num:96,  date:'2026-07-07', label:'Winner M85 v Winner M87',  venue:'BC Place, Vancouver'                    },
    ],
  },
  {
    id: 'qf',
    name: 'Quarter-Finals',
    dates: 'July 9–11, 2026',
    matches: [
      { id:'qf-97',  num:97,  date:'2026-07-09', label:'Winner M89 v Winner M90',  venue:'Gillette Stadium, Boston'               },
      { id:'qf-98',  num:98,  date:'2026-07-10', label:'Winner M93 v Winner M94',  venue:'SoFi Stadium, Los Angeles'              },
      { id:'qf-99',  num:99,  date:'2026-07-11', label:'Winner M91 v Winner M92',  venue:'Hard Rock Stadium, Miami'               },
      { id:'qf-100', num:100, date:'2026-07-11', label:'Winner M95 v Winner M96',  venue:'Arrowhead Stadium, Kansas City'         },
    ],
  },
  {
    id: 'sf',
    name: 'Semi-Finals',
    dates: 'July 14–15, 2026',
    matches: [
      { id:'sf-101', num:101, date:'2026-07-14', label:'Winner M97 v Winner M98',  venue:'AT&T Stadium, Dallas'                   },
      { id:'sf-102', num:102, date:'2026-07-15', label:'Winner M99 v Winner M100', venue:'Mercedes-Benz Stadium, Atlanta'         },
    ],
  },
  {
    id: '3rd',
    name: 'Third Place',
    dates: 'July 18, 2026',
    matches: [
      { id:'3rd-103', num:103, date:'2026-07-18', label:'Runner-up M101 v Runner-up M102', venue:'Hard Rock Stadium, Miami'       },
    ],
  },
  {
    id: 'final',
    name: 'Final',
    dates: 'July 19, 2026',
    matches: [
      { id:'final-104', num:104, date:'2026-07-19', label:'FIFA World Cup 2026 Final', venue:'MetLife Stadium, New York/New Jersey' },
    ],
  },
]
