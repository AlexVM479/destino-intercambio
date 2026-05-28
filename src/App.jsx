import { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import {
  Plane, Undo2, MapPin,
  Banknote, Trophy, Sparkles, History, Pencil,
  ChevronRight, Target, Coins, Settings, X, Check, Plus,
} from 'lucide-react'

/* ─── Constants ────────────────────────────────────────────── */
const STORAGE_KEY = 'destino_intercambio_v2'

// iso = numeric ISO 3166-1 used by world-atlas TopoJSON
const DESTINATIONS = [
  { id: 'cl', label: 'Chile',     flag: 'CL', iso: 152 },
  { id: 'es', label: 'España',    flag: 'ES', iso: 724 },
  { id: 'mx', label: 'México',    flag: 'MX', iso: 484 },
  { id: 'ar', label: 'Argentina', flag: 'AR', iso: 32  },
  { id: 'fr', label: 'Francia',   flag: 'FR', iso: 250 },
  { id: 'jp', label: 'Japón',     flag: 'JP', iso: 392 },
  { id: 'us', label: 'EE.UU.',    flag: 'US', iso: 840 },
  { id: 'it', label: 'Italia',    flag: 'IT', iso: 380 },
]

const EXTRA_DESTINATIONS = [
  { id: 'af', label: 'Afganistán',           flag: 'AF', iso: 4   },
  { id: 'al', label: 'Albania',              flag: 'AL', iso: 8   },
  { id: 'de', label: 'Alemania',             flag: 'DE', iso: 276 },
  { id: 'ad', label: 'Andorra',              flag: 'AD', iso: 20  },
  { id: 'ao', label: 'Angola',               flag: 'AO', iso: 24  },
  { id: 'ag', label: 'Antigua y Barbuda',    flag: 'AG', iso: 28  },
  { id: 'sa', label: 'Arabia Saudí',         flag: 'SA', iso: 682 },
  { id: 'dz', label: 'Argelia',              flag: 'DZ', iso: 12  },
  { id: 'am', label: 'Armenia',              flag: 'AM', iso: 51  },
  { id: 'au', label: 'Australia',            flag: 'AU', iso: 36  },
  { id: 'at', label: 'Austria',              flag: 'AT', iso: 40  },
  { id: 'az', label: 'Azerbaiyán',           flag: 'AZ', iso: 31  },
  { id: 'bd', label: 'Bangladesh',           flag: 'BD', iso: 50  },
  { id: 'bb', label: 'Barbados',             flag: 'BB', iso: 52  },
  { id: 'bh', label: 'Baréin',               flag: 'BH', iso: 48  },
  { id: 'be', label: 'Bélgica',              flag: 'BE', iso: 56  },
  { id: 'bz', label: 'Belice',               flag: 'BZ', iso: 84  },
  { id: 'bj', label: 'Benín',                flag: 'BJ', iso: 204 },
  { id: 'by', label: 'Bielorrusia',          flag: 'BY', iso: 112 },
  { id: 'bo', label: 'Bolivia',              flag: 'BO', iso: 68  },
  { id: 'ba', label: 'Bosnia y Herzegovina', flag: 'BA', iso: 70  },
  { id: 'bw', label: 'Botsuana',             flag: 'BW', iso: 72  },
  { id: 'br', label: 'Brasil',               flag: 'BR', iso: 76  },
  { id: 'bn', label: 'Brunéi',               flag: 'BN', iso: 96  },
  { id: 'bg', label: 'Bulgaria',             flag: 'BG', iso: 100 },
  { id: 'bf', label: 'Burkina Faso',         flag: 'BF', iso: 854 },
  { id: 'bi', label: 'Burundi',              flag: 'BI', iso: 108 },
  { id: 'bt', label: 'Bután',                flag: 'BT', iso: 64  },
  { id: 'cv', label: 'Cabo Verde',           flag: 'CV', iso: 132 },
  { id: 'kh', label: 'Camboya',              flag: 'KH', iso: 116 },
  { id: 'cm', label: 'Camerún',              flag: 'CM', iso: 120 },
  { id: 'ca', label: 'Canadá',               flag: 'CA', iso: 124 },
  { id: 'td', label: 'Chad',                 flag: 'TD', iso: 148 },
  { id: 'cn', label: 'China',                flag: 'CN', iso: 156 },
  { id: 'cy', label: 'Chipre',               flag: 'CY', iso: 196 },
  { id: 'co', label: 'Colombia',             flag: 'CO', iso: 170 },
  { id: 'km', label: 'Comoras',              flag: 'KM', iso: 174 },
  { id: 'cg', label: 'Congo',                flag: 'CG', iso: 178 },
  { id: 'cd', label: 'Congo RD',             flag: 'CD', iso: 180 },
  { id: 'kp', label: 'Corea del Norte',      flag: 'KP', iso: 408 },
  { id: 'kr', label: 'Corea del Sur',        flag: 'KR', iso: 410 },
  { id: 'ci', label: 'Costa de Marfil',      flag: 'CI', iso: 384 },
  { id: 'cr', label: 'Costa Rica',           flag: 'CR', iso: 188 },
  { id: 'hr', label: 'Croacia',              flag: 'HR', iso: 191 },
  { id: 'cu', label: 'Cuba',                 flag: 'CU', iso: 192 },
  { id: 'dk', label: 'Dinamarca',            flag: 'DK', iso: 208 },
  { id: 'dm', label: 'Dominica',             flag: 'DM', iso: 212 },
  { id: 'ec', label: 'Ecuador',              flag: 'EC', iso: 218 },
  { id: 'eg', label: 'Egipto',               flag: 'EG', iso: 818 },
  { id: 'sv', label: 'El Salvador',          flag: 'SV', iso: 222 },
  { id: 'ae', label: 'Emiratos Árabes',      flag: 'AE', iso: 784 },
  { id: 'er', label: 'Eritrea',              flag: 'ER', iso: 232 },
  { id: 'sk', label: 'Eslovaquia',           flag: 'SK', iso: 703 },
  { id: 'si', label: 'Eslovenia',            flag: 'SI', iso: 705 },
  { id: 'ee', label: 'Estonia',              flag: 'EE', iso: 233 },
  { id: 'sz', label: 'Esuatini',             flag: 'SZ', iso: 748 },
  { id: 'et', label: 'Etiopía',              flag: 'ET', iso: 231 },
  { id: 'ph', label: 'Filipinas',            flag: 'PH', iso: 608 },
  { id: 'fi', label: 'Finlandia',            flag: 'FI', iso: 246 },
  { id: 'fj', label: 'Fiyi',                 flag: 'FJ', iso: 242 },
  { id: 'ga', label: 'Gabón',                flag: 'GA', iso: 266 },
  { id: 'gm', label: 'Gambia',               flag: 'GM', iso: 270 },
  { id: 'ge', label: 'Georgia',              flag: 'GE', iso: 268 },
  { id: 'gh', label: 'Ghana',                flag: 'GH', iso: 288 },
  { id: 'gd', label: 'Granada',              flag: 'GD', iso: 308 },
  { id: 'gr', label: 'Grecia',               flag: 'GR', iso: 300 },
  { id: 'gl', label: 'Groenlandia',          flag: 'GL', iso: 304 },
  { id: 'gt', label: 'Guatemala',            flag: 'GT', iso: 320 },
  { id: 'gn', label: 'Guinea',               flag: 'GN', iso: 324 },
  { id: 'gq', label: 'Guinea Ecuatorial',    flag: 'GQ', iso: 226 },
  { id: 'gw', label: 'Guinea-Bisáu',         flag: 'GW', iso: 624 },
  { id: 'gy', label: 'Guyana',               flag: 'GY', iso: 328 },
  { id: 'ht', label: 'Haití',                flag: 'HT', iso: 332 },
  { id: 'hn', label: 'Honduras',             flag: 'HN', iso: 340 },
  { id: 'hu', label: 'Hungría',              flag: 'HU', iso: 348 },
  { id: 'in', label: 'India',                flag: 'IN', iso: 356 },
  { id: 'id', label: 'Indonesia',            flag: 'ID', iso: 360 },
  { id: 'iq', label: 'Irak',                 flag: 'IQ', iso: 368 },
  { id: 'ir', label: 'Irán',                 flag: 'IR', iso: 364 },
  { id: 'ie', label: 'Irlanda',              flag: 'IE', iso: 372 },
  { id: 'is', label: 'Islandia',             flag: 'IS', iso: 352 },
  { id: 'sb', label: 'Islas Salomón',        flag: 'SB', iso: 90  },
  { id: 'il', label: 'Israel',               flag: 'IL', iso: 376 },
  { id: 'jm', label: 'Jamaica',              flag: 'JM', iso: 388 },
  { id: 'jo', label: 'Jordania',             flag: 'JO', iso: 400 },
  { id: 'kz', label: 'Kazajistán',           flag: 'KZ', iso: 398 },
  { id: 'ke', label: 'Kenia',                flag: 'KE', iso: 404 },
  { id: 'kg', label: 'Kirguistán',           flag: 'KG', iso: 417 },
  { id: 'ki', label: 'Kiribati',             flag: 'KI', iso: 296 },
  { id: 'kw', label: 'Kuwait',               flag: 'KW', iso: 414 },
  { id: 'la', label: 'Laos',                 flag: 'LA', iso: 418 },
  { id: 'ls', label: 'Lesoto',               flag: 'LS', iso: 426 },
  { id: 'lv', label: 'Letonia',              flag: 'LV', iso: 428 },
  { id: 'lb', label: 'Líbano',               flag: 'LB', iso: 422 },
  { id: 'lr', label: 'Liberia',              flag: 'LR', iso: 430 },
  { id: 'ly', label: 'Libia',                flag: 'LY', iso: 434 },
  { id: 'li', label: 'Liechtenstein',        flag: 'LI', iso: 438 },
  { id: 'lt', label: 'Lituania',             flag: 'LT', iso: 440 },
  { id: 'lu', label: 'Luxemburgo',           flag: 'LU', iso: 442 },
  { id: 'mk', label: 'Macedonia',            flag: 'MK', iso: 807 },
  { id: 'mg', label: 'Madagascar',           flag: 'MG', iso: 450 },
  { id: 'my', label: 'Malasia',              flag: 'MY', iso: 458 },
  { id: 'mw', label: 'Malaui',               flag: 'MW', iso: 454 },
  { id: 'mv', label: 'Maldivas',             flag: 'MV', iso: 462 },
  { id: 'ml', label: 'Malí',                 flag: 'ML', iso: 466 },
  { id: 'mt', label: 'Malta',                flag: 'MT', iso: 470 },
  { id: 'ma', label: 'Marruecos',            flag: 'MA', iso: 504 },
  { id: 'mh', label: 'Marshall',             flag: 'MH', iso: 584 },
  { id: 'mu', label: 'Mauricio',             flag: 'MU', iso: 480 },
  { id: 'mr', label: 'Mauritania',           flag: 'MR', iso: 478 },
  { id: 'fm', label: 'Micronesia',           flag: 'FM', iso: 583 },
  { id: 'md', label: 'Moldavia',             flag: 'MD', iso: 498 },
  { id: 'mc', label: 'Mónaco',               flag: 'MC', iso: 492 },
  { id: 'mn', label: 'Mongolia',             flag: 'MN', iso: 496 },
  { id: 'me', label: 'Montenegro',           flag: 'ME', iso: 499 },
  { id: 'mz', label: 'Mozambique',           flag: 'MZ', iso: 508 },
  { id: 'mm', label: 'Myanmar',              flag: 'MM', iso: 104 },
  { id: 'na', label: 'Namibia',              flag: 'NA', iso: 516 },
  { id: 'nr', label: 'Nauru',                flag: 'NR', iso: 520 },
  { id: 'np', label: 'Nepal',                flag: 'NP', iso: 524 },
  { id: 'ni', label: 'Nicaragua',            flag: 'NI', iso: 558 },
  { id: 'ne', label: 'Níger',                flag: 'NE', iso: 562 },
  { id: 'ng', label: 'Nigeria',              flag: 'NG', iso: 566 },
  { id: 'no', label: 'Noruega',              flag: 'NO', iso: 578 },
  { id: 'nz', label: 'Nueva Zelanda',        flag: 'NZ', iso: 554 },
  { id: 'om', label: 'Omán',                 flag: 'OM', iso: 512 },
  { id: 'nl', label: 'Países Bajos',         flag: 'NL', iso: 528 },
  { id: 'pk', label: 'Pakistán',             flag: 'PK', iso: 586 },
  { id: 'pw', label: 'Palaos',               flag: 'PW', iso: 585 },
  { id: 'ps', label: 'Palestina',            flag: 'PS', iso: 275 },
  { id: 'pa', label: 'Panamá',               flag: 'PA', iso: 591 },
  { id: 'pg', label: 'Papúa Nueva Guinea',   flag: 'PG', iso: 598 },
  { id: 'py', label: 'Paraguay',             flag: 'PY', iso: 600 },
  { id: 'pe', label: 'Perú',                 flag: 'PE', iso: 604 },
  { id: 'pl', label: 'Polonia',              flag: 'PL', iso: 616 },
  { id: 'pt', label: 'Portugal',             flag: 'PT', iso: 620 },
  { id: 'qa', label: 'Qatar',                flag: 'QA', iso: 634 },
  { id: 'gb', label: 'Reino Unido',          flag: 'GB', iso: 826 },
  { id: 'cz', label: 'Rep. Checa',           flag: 'CZ', iso: 203 },
  { id: 'do', label: 'Rep. Dominicana',      flag: 'DO', iso: 214 },
  { id: 'rw', label: 'Ruanda',               flag: 'RW', iso: 646 },
  { id: 'ro', label: 'Rumania',              flag: 'RO', iso: 642 },
  { id: 'ru', label: 'Rusia',                flag: 'RU', iso: 643 },
  { id: 'ws', label: 'Samoa',                flag: 'WS', iso: 882 },
  { id: 'kn', label: 'San Cristóbal',        flag: 'KN', iso: 659 },
  { id: 'sm', label: 'San Marino',           flag: 'SM', iso: 674 },
  { id: 'vc', label: 'San Vicente',          flag: 'VC', iso: 670 },
  { id: 'lc', label: 'Santa Lucía',          flag: 'LC', iso: 662 },
  { id: 'st', label: 'Santo Tomé y Príncipe',flag: 'ST', iso: 678 },
  { id: 'sn', label: 'Senegal',              flag: 'SN', iso: 686 },
  { id: 'rs', label: 'Serbia',               flag: 'RS', iso: 688 },
  { id: 'sc', label: 'Seychelles',           flag: 'SC', iso: 690 },
  { id: 'sl', label: 'Sierra Leona',         flag: 'SL', iso: 694 },
  { id: 'sg', label: 'Singapur',             flag: 'SG', iso: 702 },
  { id: 'sy', label: 'Siria',                flag: 'SY', iso: 760 },
  { id: 'so', label: 'Somalia',              flag: 'SO', iso: 706 },
  { id: 'lk', label: 'Sri Lanka',            flag: 'LK', iso: 144 },
  { id: 'za', label: 'Sudáfrica',            flag: 'ZA', iso: 710 },
  { id: 'sd', label: 'Sudán',                flag: 'SD', iso: 736 },
  { id: 'ss', label: 'Sudán del Sur',        flag: 'SS', iso: 728 },
  { id: 'se', label: 'Suecia',               flag: 'SE', iso: 752 },
  { id: 'ch', label: 'Suiza',                flag: 'CH', iso: 756 },
  { id: 'sr', label: 'Surinam',              flag: 'SR', iso: 740 },
  { id: 'th', label: 'Tailandia',            flag: 'TH', iso: 764 },
  { id: 'tw', label: 'Taiwán',               flag: 'TW', iso: 158 },
  { id: 'tz', label: 'Tanzania',             flag: 'TZ', iso: 834 },
  { id: 'tj', label: 'Tayikistán',           flag: 'TJ', iso: 762 },
  { id: 'tl', label: 'Timor-Leste',          flag: 'TL', iso: 626 },
  { id: 'tg', label: 'Togo',                 flag: 'TG', iso: 768 },
  { id: 'to', label: 'Tonga',                flag: 'TO', iso: 776 },
  { id: 'tt', label: 'Trinidad y Tobago',    flag: 'TT', iso: 780 },
  { id: 'tn', label: 'Túnez',                flag: 'TN', iso: 788 },
  { id: 'tm', label: 'Turkmenistán',         flag: 'TM', iso: 795 },
  { id: 'tr', label: 'Turquía',              flag: 'TR', iso: 792 },
  { id: 'tv', label: 'Tuvalu',               flag: 'TV', iso: 798 },
  { id: 'ua', label: 'Ucrania',              flag: 'UA', iso: 804 },
  { id: 'ug', label: 'Uganda',               flag: 'UG', iso: 800 },
  { id: 'uy', label: 'Uruguay',              flag: 'UY', iso: 858 },
  { id: 'uz', label: 'Uzbekistán',           flag: 'UZ', iso: 860 },
  { id: 'vu', label: 'Vanuatu',              flag: 'VU', iso: 548 },
  { id: 'va', label: 'Vaticano',             flag: 'VA', iso: 336 },
  { id: 've', label: 'Venezuela',            flag: 'VE', iso: 862 },
  { id: 'vn', label: 'Vietnam',              flag: 'VN', iso: 704 },
  { id: 'ye', label: 'Yemen',                flag: 'YE', iso: 887 },
  { id: 'dj', label: 'Yibuti',               flag: 'DJ', iso: 262 },
  { id: 'zm', label: 'Zambia',               flag: 'ZM', iso: 894 },
  { id: 'zw', label: 'Zimbabue',             flag: 'ZW', iso: 716 },
]

const DENOMINATIONS = [
  { value: 10,  label: '$10',  bg: '#334155', border: '#64748b', text: '#cbd5e1', glow: 'rgba(100,116,139,0.5)' },
  { value: 50,  label: '$50',  bg: '#3730a3', border: '#818cf8', text: '#c7d2fe', glow: 'rgba(99,102,241,0.5)' },
  { value: 100, label: '$100', bg: '#065f46', border: '#34d399', text: '#a7f3d0', glow: 'rgba(16,185,129,0.5)' },
  { value: 500, label: '$500', bg: '#78350f', border: '#fbbf24', text: '#fde68a', glow: 'rgba(245,158,11,0.5)' },
]

const MILESTONES = [
  { pct: 10,  icon: '🌱', label: '¡Primer paso!',              color: '#34d399' },
  { pct: 25,  icon: '⭐', label: '¡Un quarter!',               color: '#818cf8' },
  { pct: 50,  icon: '✈️', label: '¡A medio camino!',           color: '#38bdf8' },
  { pct: 75,  icon: '🔥', label: '¡Casi listo!',               color: '#fb923c' },
  { pct: 100, icon: '🎉', label: '¡Intercambio desbloqueado!', color: '#fbbf24' },
]

const CONFETTI_COLORS = ['#10b981','#6366f1','#f59e0b','#ec4899','#3b82f6','#a78bfa','#34d399','#f472b6']

const COUNTRY_RATES = {
  af:  { symbol: '؋',    rate: 71.5,   label: 'AFN' },  // Afganistán
  al:  { symbol: 'L',    rate: 93.2,   label: 'ALL' },  // Albania
  de:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Alemania
  ad:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Andorra
  ao:  { symbol: 'Kz',   rate: 830,    label: 'AOA' },  // Angola
  ag:  { symbol: '$',    rate: 2.7,    label: 'XCD' },  // Antigua y Barbuda
  sa:  { symbol: '﷼',    rate: 3.75,   label: 'SAR' },  // Arabia Saudí
  dz:  { symbol: 'دج',   rate: 134,    label: 'DZD' },  // Argelia
  ar:  { symbol: '$',    rate: 870,    label: 'ARS' },  // Argentina
  am:  { symbol: '֏',    rate: 388,    label: 'AMD' },  // Armenia
  au:  { symbol: 'A$',   rate: 1.53,   label: 'AUD' },  // Australia
  at:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Austria
  az:  { symbol: '₼',    rate: 1.70,   label: 'AZN' },  // Azerbaiyán
  bs:  { symbol: 'B$',   rate: 1.0,    label: 'BSD' },  // Bahamas
  bd:  { symbol: '৳',    rate: 110,    label: 'BDT' },  // Bangladesh
  bb:  { symbol: 'Bds$', rate: 2.0,    label: 'BBD' },  // Barbados
  bh:  { symbol: 'BD',   rate: 0.38,   label: 'BHD' },  // Baréin
  be:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Bélgica
  bz:  { symbol: 'BZ$',  rate: 2.0,    label: 'BZD' },  // Belice
  bj:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Benín
  by:  { symbol: 'Br',   rate: 3.27,   label: 'BYN' },  // Bielorrusia
  bo:  { symbol: 'Bs',   rate: 6.91,   label: 'BOB' },  // Bolivia
  ba:  { symbol: 'KM',   rate: 1.80,   label: 'BAM' },  // Bosnia y Herzegovina
  bw:  { symbol: 'P',    rate: 13.5,   label: 'BWP' },  // Botsuana
  br:  { symbol: 'R$',   rate: 4.97,   label: 'BRL' },  // Brasil
  bn:  { symbol: 'B$',   rate: 1.35,   label: 'BND' },  // Brunéi
  bg:  { symbol: 'лв',   rate: 1.80,   label: 'BGN' },  // Bulgaria
  bf:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Burkina Faso
  bi:  { symbol: 'Fr',   rate: 2850,   label: 'BIF' },  // Burundi
  bt:  { symbol: 'Nu.',  rate: 83.1,   label: 'BTN' },  // Bután
  cv:  { symbol: '$',    rate: 98.3,   label: 'CVE' },  // Cabo Verde
  kh:  { symbol: '៛',    rate: 4100,   label: 'KHR' },  // Camboya
  cm:  { symbol: 'Fr',   rate: 603,    label: 'XAF' },  // Camerún
  ca:  { symbol: 'C$',   rate: 1.36,   label: 'CAD' },  // Canadá
  cf:  { symbol: 'Fr',   rate: 603,    label: 'XAF' },  // Centroáfrica
  td:  { symbol: 'Fr',   rate: 603,    label: 'XAF' },  // Chad
  cl:  { symbol: '$',    rate: 950,    label: 'CLP' },  // Chile
  cn:  { symbol: '¥',    rate: 7.24,   label: 'CNY' },  // China
  cy:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Chipre
  co:  { symbol: '$',    rate: 3900,   label: 'COP' },  // Colombia
  km:  { symbol: 'Fr',   rate: 452,    label: 'KMF' },  // Comoras
  cg:  { symbol: 'Fr',   rate: 603,    label: 'XAF' },  // Congo
  cd:  { symbol: 'Fr',   rate: 2750,   label: 'CDF' },  // Congo RD
  kp:  { symbol: '₩',    rate: 900,    label: 'KPW' },  // Corea del Norte
  kr:  { symbol: '₩',    rate: 1325,   label: 'KRW' },  // Corea del Sur
  ci:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Costa de Marfil
  cr:  { symbol: '₡',    rate: 515,    label: 'CRC' },  // Costa Rica
  hr:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Croacia
  cu:  { symbol: '$',    rate: 24,     label: 'CUP' },  // Cuba
  dk:  { symbol: 'kr',   rate: 6.88,   label: 'DKK' },  // Dinamarca
  dm:  { symbol: '$',    rate: 2.7,    label: 'XCD' },  // Dominica
  ec:  { symbol: '$',    rate: 1,      label: 'USD' },  // Ecuador
  us:  { symbol: '$',    rate: 1,      label: 'USD' },  // EE.UU.
  eg:  { symbol: '£',    rate: 30.9,   label: 'EGP' },  // Egipto
  sv:  { symbol: '$',    rate: 1,      label: 'USD' },  // El Salvador
  ae:  { symbol: 'د.إ',  rate: 3.67,   label: 'AED' },  // Emiratos Árabes
  er:  { symbol: 'Nfk',  rate: 15,     label: 'ERN' },  // Eritrea
  sk:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Eslovaquia
  si:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Eslovenia
  es:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // España
  ee:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Estonia
  sz:  { symbol: 'L',    rate: 18.6,   label: 'SZL' },  // Esuatini
  et:  { symbol: 'Br',   rate: 56.5,   label: 'ETB' },  // Etiopía
  ph:  { symbol: '₱',    rate: 56.5,   label: 'PHP' },  // Filipinas
  fi:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Finlandia
  fj:  { symbol: 'FJ$',  rate: 2.24,   label: 'FJD' },  // Fiyi
  fr:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Francia
  ga:  { symbol: 'Fr',   rate: 603,    label: 'XAF' },  // Gabón
  gm:  { symbol: 'D',    rate: 67.5,   label: 'GMD' },  // Gambia
  ge:  { symbol: '₾',    rate: 2.65,   label: 'GEL' },  // Georgia
  gh:  { symbol: '₵',    rate: 12.4,   label: 'GHS' },  // Ghana
  gd:  { symbol: '$',    rate: 2.7,    label: 'XCD' },  // Granada
  gr:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Grecia
  gl:  { symbol: 'kr',   rate: 6.9,    label: 'DKK' },  // Groenlandia
  gt:  { symbol: 'Q',    rate: 7.79,   label: 'GTQ' },  // Guatemala
  gn:  { symbol: 'Fr',   rate: 8600,   label: 'GNF' },  // Guinea
  gq:  { symbol: 'Fr',   rate: 603,    label: 'XAF' },  // Guinea Ecuatorial
  gw:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Guinea-Bisáu
  gy:  { symbol: 'G$',   rate: 209,    label: 'GYD' },  // Guyana
  ht:  { symbol: 'G',    rate: 132,    label: 'HTG' },  // Haití
  hn:  { symbol: 'L',    rate: 24.7,   label: 'HNL' },  // Honduras
  hu:  { symbol: 'Ft',   rate: 362,    label: 'HUF' },  // Hungría
  in:  { symbol: '₹',    rate: 83.1,   label: 'INR' },  // India
  id:  { symbol: 'Rp',   rate: 15600,  label: 'IDR' },  // Indonesia
  iq:  { symbol: 'ع.د',  rate: 1310,   label: 'IQD' },  // Irak
  ir:  { symbol: '﷼',    rate: 42000,  label: 'IRR' },  // Irán
  ie:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Irlanda
  is:  { symbol: 'kr',   rate: 137,    label: 'ISK' },  // Islandia
  sb:  { symbol: 'SI$',  rate: 8.45,   label: 'SBD' },  // Islas Salomón
  il:  { symbol: '₪',    rate: 3.74,   label: 'ILS' },  // Israel
  it:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Italia
  jm:  { symbol: 'J$',   rate: 155,    label: 'JMD' },  // Jamaica
  jp:  { symbol: '¥',    rate: 149,    label: 'JPY' },  // Japón
  jo:  { symbol: 'د.أ',  rate: 0.71,   label: 'JOD' },  // Jordania
  kz:  { symbol: '₸',    rate: 452,    label: 'KZT' },  // Kazajistán
  ke:  { symbol: 'KSh',  rate: 129,    label: 'KES' },  // Kenia
  kg:  { symbol: 'с',    rate: 89.2,   label: 'KGS' },  // Kirguistán
  ki:  { symbol: '$',    rate: 1,      label: 'AUD' },  // Kiribati
  kw:  { symbol: 'د.ك',  rate: 0.31,   label: 'KWD' },  // Kuwait
  la:  { symbol: '₭',    rate: 21500,  label: 'LAK' },  // Laos
  ls:  { symbol: 'L',    rate: 18.6,   label: 'LSL' },  // Lesoto
  lv:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Letonia
  lb:  { symbol: 'ل.ل',  rate: 89500,  label: 'LBP' },  // Líbano
  lr:  { symbol: 'L$',   rate: 190,    label: 'LRD' },  // Liberia
  ly:  { symbol: 'ل.د',  rate: 4.83,   label: 'LYD' },  // Libia
  li:  { symbol: 'Fr',   rate: 0.89,   label: 'CHF' },  // Liechtenstein
  lt:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Lituania
  lu:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Luxemburgo
  mk:  { symbol: 'ден',  rate: 56.8,   label: 'MKD' },  // Macedonia
  mg:  { symbol: 'Ar',   rate: 4500,   label: 'MGA' },  // Madagascar
  my:  { symbol: 'RM',   rate: 4.72,   label: 'MYR' },  // Malasia
  mw:  { symbol: 'MK',   rate: 1730,   label: 'MWK' },  // Malaui
  mv:  { symbol: 'Rf',   rate: 15.4,   label: 'MVR' },  // Maldivas
  ml:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Malí
  mt:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Malta
  ma:  { symbol: 'د.م',  rate: 9.97,   label: 'MAD' },  // Marruecos
  mh:  { symbol: '$',    rate: 1,      label: 'USD' },  // Marshall
  mu:  { symbol: '₨',    rate: 46.5,   label: 'MUR' },  // Mauricio
  mr:  { symbol: 'UM',   rate: 39.5,   label: 'MRU' },  // Mauritania
  mx:  { symbol: '$',    rate: 17.1,   label: 'MXN' },  // México
  fm:  { symbol: '$',    rate: 1,      label: 'USD' },  // Micronesia
  md:  { symbol: 'L',    rate: 17.8,   label: 'MDL' },  // Moldavia
  mc:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Mónaco
  mn:  { symbol: '₮',    rate: 3450,   label: 'MNT' },  // Mongolia
  me:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Montenegro
  mz:  { symbol: 'MT',   rate: 63.5,   label: 'MZN' },  // Mozambique
  mm:  { symbol: 'K',    rate: 2100,   label: 'MMK' },  // Myanmar
  na:  { symbol: 'N$',   rate: 18.6,   label: 'NAD' },  // Namibia
  nr:  { symbol: '$',    rate: 1,      label: 'AUD' },  // Nauru
  np:  { symbol: 'Rs',   rate: 133,    label: 'NPR' },  // Nepal
  ni:  { symbol: 'C$',   rate: 36.6,   label: 'NIO' },  // Nicaragua
  ne:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Níger
  ng:  { symbol: '₦',    rate: 1540,   label: 'NGN' },  // Nigeria
  no:  { symbol: 'kr',   rate: 10.6,   label: 'NOK' },  // Noruega
  nz:  { symbol: 'NZ$',  rate: 1.63,   label: 'NZD' },  // Nueva Zelanda
  om:  { symbol: 'ر.ع',  rate: 0.38,   label: 'OMR' },  // Omán
  nl:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Países Bajos
  pk:  { symbol: '₨',    rate: 278,    label: 'PKR' },  // Pakistán
  pw:  { symbol: '$',    rate: 1,      label: 'USD' },  // Palaos
  ps:  { symbol: '₪',    rate: 3.74,   label: 'ILS' },  // Palestina
  pa:  { symbol: 'B/.',  rate: 1.0,    label: 'PAB' },  // Panamá
  pg:  { symbol: 'K',    rate: 3.73,   label: 'PGK' },  // Papúa Nueva Guinea
  py:  { symbol: '₲',    rate: 7290,   label: 'PYG' },  // Paraguay
  pe:  { symbol: 'S/',   rate: 3.72,   label: 'PEN' },  // Perú
  pl:  { symbol: 'zł',   rate: 3.95,   label: 'PLN' },  // Polonia
  pt:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Portugal
  qa:  { symbol: 'ر.ق',  rate: 3.64,   label: 'QAR' },  // Qatar
  gb:  { symbol: '£',    rate: 0.79,   label: 'GBP' },  // Reino Unido
  cz:  { symbol: 'Kč',   rate: 22.8,   label: 'CZK' },  // Rep. Checa
  do:  { symbol: 'RD$',  rate: 58.5,   label: 'DOP' },  // Rep. Dominicana
  rw:  { symbol: 'Fr',   rate: 1290,   label: 'RWF' },  // Ruanda
  ro:  { symbol: 'lei',  rate: 4.57,   label: 'RON' },  // Rumania
  ru:  { symbol: '₽',    rate: 89.5,   label: 'RUB' },  // Rusia
  ws:  { symbol: 'T',    rate: 2.72,   label: 'WST' },  // Samoa
  kn:  { symbol: '$',    rate: 2.7,    label: 'XCD' },  // San Cristóbal
  sm:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // San Marino
  vc:  { symbol: '$',    rate: 2.7,    label: 'XCD' },  // San Vicente
  lc:  { symbol: '$',    rate: 2.7,    label: 'XCD' },  // Santa Lucía
  st:  { symbol: 'Db',   rate: 23.1,   label: 'STN' },  // Santo Tomé y Príncipe
  sn:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Senegal
  rs:  { symbol: 'din',  rate: 107,    label: 'RSD' },  // Serbia
  sc:  { symbol: '₨',    rate: 13.7,   label: 'SCR' },  // Seychelles
  sl:  { symbol: 'Le',   rate: 22000,  label: 'SLL' },  // Sierra Leona
  sg:  { symbol: 'S$',   rate: 1.34,   label: 'SGD' },  // Singapur
  sy:  { symbol: '£',    rate: 13000,  label: 'SYP' },  // Siria
  so:  { symbol: 'Sh',   rate: 571,    label: 'SOS' },  // Somalia
  lk:  { symbol: 'Rs',   rate: 312,    label: 'LKR' },  // Sri Lanka
  za:  { symbol: 'R',    rate: 18.6,   label: 'ZAR' },  // Sudáfrica
  sd:  { symbol: '£',    rate: 600,    label: 'SDG' },  // Sudán
  ss:  { symbol: '£',    rate: 1300,   label: 'SSP' },  // Sudán del Sur
  se:  { symbol: 'kr',   rate: 10.4,   label: 'SEK' },  // Suecia
  ch:  { symbol: 'Fr',   rate: 0.89,   label: 'CHF' },  // Suiza
  sr:  { symbol: '$',    rate: 36.5,   label: 'SRD' },  // Surinam
  th:  { symbol: '฿',    rate: 35.1,   label: 'THB' },  // Tailandia
  tw:  { symbol: 'NT$',  rate: 31.8,   label: 'TWD' },  // Taiwán
  tz:  { symbol: 'Sh',   rate: 2550,   label: 'TZS' },  // Tanzania
  tj:  { symbol: 'SM',   rate: 10.9,   label: 'TJS' },  // Tayikistán
  tl:  { symbol: '$',    rate: 1,      label: 'USD' },  // Timor-Leste
  tg:  { symbol: 'Fr',   rate: 603,    label: 'XOF' },  // Togo
  to:  { symbol: 'T$',   rate: 2.36,   label: 'TOP' },  // Tonga
  tt:  { symbol: 'TT$',  rate: 6.79,   label: 'TTD' },  // Trinidad y Tobago
  tn:  { symbol: 'د.ت',  rate: 3.11,   label: 'TND' },  // Túnez
  tm:  { symbol: 'T',    rate: 3.50,   label: 'TMT' },  // Turkmenistán
  tr:  { symbol: '₺',    rate: 32.1,   label: 'TRY' },  // Turquía
  tv:  { symbol: '$',    rate: 1,      label: 'AUD' },  // Tuvalu
  ua:  { symbol: '₴',    rate: 37.3,   label: 'UAH' },  // Ucrania
  ug:  { symbol: 'Sh',   rate: 3750,   label: 'UGX' },  // Uganda
  uy:  { symbol: '$',    rate: 39.5,   label: 'UYU' },  // Uruguay
  uz:  { symbol: "so'm", rate: 12500,  label: 'UZS' },  // Uzbekistán
  vu:  { symbol: 'Vt',   rate: 118,    label: 'VUV' },  // Vanuatu
  va:  { symbol: '€',    rate: 0.92,   label: 'EUR' },  // Vaticano
  ve:  { symbol: 'Bs',   rate: 36.5,   label: 'VES' },  // Venezuela
  vn:  { symbol: '₫',    rate: 24500,  label: 'VND' },  // Vietnam
  ye:  { symbol: '﷼',    rate: 250,    label: 'YER' },  // Yemen
  dj:  { symbol: 'Fr',   rate: 177,    label: 'DJF' },  // Yibuti
  zm:  { symbol: 'ZK',   rate: 26.5,   label: 'ZMW' },  // Zambia
  zw:  { symbol: 'Z$',   rate: 360,    label: 'ZWL' },  // Zimbabue
}

/* ─── Persistence ───────────────────────────────────────────── */

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

/* ─── Helpers ───────────────────────────────────────────────── */

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

const fmtDate = (ts) =>
  new Intl.DateTimeFormat('es-CL', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }).format(new Date(ts))

const renderFlag = (code, className = "w-6 h-4 inline-block rounded-sm object-cover shadow-sm") => (
  <img
    src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
    alt={`Bandera de ${code}`}
    className={className}
  />
)

/* ─── WorldMap ──────────────────────────────────────────────────
──────────────────────────────────────────────────────────────── */
function WorldMap({ selectedIso, selectableIsos = [], onSelectCountry }) {
  const containerRef = useRef(null)
  const d3Ref        = useRef(null)   // stores d3 module after first load
  const svgRef       = useRef(null)   // stores d3 selection
  const [ready, setReady] = useState(false)
  const selectedIsoRef = useRef(selectedIso)
  useEffect(() => { selectedIsoRef.current = selectedIso }, [selectedIso])

  // Load D3 + TopoJSON + world data once on mount
  useEffect(() => {
    let cancelled = false
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/d3@7/+esm'),
      import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'),
    ]).then(([d3, topojson]) => {
      if (cancelled) return
      d3Ref.current = d3
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
        .then(r => r.json())
        .then(world => {
          if (cancelled || !containerRef.current) return
          const el = containerRef.current
          const W  = el.clientWidth  || 560
          const H  = el.clientHeight || 380

          const svg = d3.select(el).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${W} ${H}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')

          svgRef.current = svg

          const projection = d3.geoNaturalEarth1()
  .scale(W / 4.2)
  .translate([W / 2, H / 2])

          const pathFn = d3.geoPath().projection(projection)
          const features = topojson.feature(world, world.objects.countries).features

          svg.selectAll('path')
            .data(features)
            .enter()
            .append('path')
            .attr('d', pathFn)
            .attr('data-iso', d => d.id)
            .attr('fill', '#1e3a5f')
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 0.4)
            .style('transition', 'fill 0.4s ease')
            .on('mouseover', function(event, d) {
              const isSelectable = selectableIsos.includes(Number(d.id))
              d3.select(this).attr('fill', isSelectable ? '#34d399' : '#2a5080')
              if (isSelectable) d3.select(this).style('cursor', 'pointer')
              // tooltip
              const allDests = [...(window.__allDests || [])]
              const found = allDests.find(x => x.iso === Number(d.id))
              if (found) {
                let tip = document.getElementById('map-tooltip')
                if (!tip) { tip = document.createElement('div'); tip.id = 'map-tooltip'; document.body.appendChild(tip) }
                tip.style.cssText = `position:fixed;left:${event.clientX+12}px;top:${event.clientY-28}px;background:#0f172a;color:#e2e8f0;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:700;border:1px solid #334155;pointer-events:none;z-index:9999`
                tip.textContent = found.label
              }
            })
            .on('mousemove', function(event) {
              const tip = document.getElementById('map-tooltip')
              if (tip) { tip.style.left = `${event.clientX+12}px`; tip.style.top = `${event.clientY-28}px` }
            })
            .on('mouseout', function(event, d) {
              d3.select(this)
                .attr('fill', d.id == selectedIsoRef.current ? '#10b981' : '#1e3a5f')
                .style('cursor', 'default')
              const tip = document.getElementById('map-tooltip')
              if (tip) tip.remove()
            })
            .on('click', function(event, d) {
              const isSelectable = selectableIsos.includes(Number(d.id))
              if (isSelectable && onSelectCountry) onSelectCountry(Number(d.id))
            })
          
            window.__allDests = [...DESTINATIONS, ...EXTRA_DESTINATIONS]
          if (!cancelled) setReady(true)
        })
    }).catch(() => {}) // silently ignore network errors
    return () => {
      cancelled = true
      const tip = document.getElementById('map-tooltip')
      if (tip) tip.remove()
    }
  }, [])

  // Re-color whenever selectedIso changes (or map first becomes ready)
  useEffect(() => {
    if (!ready || !svgRef.current) return
    svgRef.current.selectAll('path')
      // eslint-disable-next-line eqeqeq — intentional: TopoJSON ids are numbers, selectedIso may be number
      .attr('fill', d => d.id == selectedIso ? '#10b981' : '#1e3a5f')
.attr('stroke', d => d.id == selectedIso ? '#34d399' : '#0f172a')
.attr('stroke-width', d => d.id == selectedIso ? 1 : 0.4)
  }, [selectedIso, ready])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '340px' }}
    />
  )
}

/* ─── Sub-components ────────────────────────────────────────── */

function LuggageIcon({ pct, bounce, goal100, isOver }) {
  const fillColor = pct >= 100 ? '#eab308' : '#10b981'
  return (
    <div
      className={`relative flex items-center justify-center w-full h-full rounded-[2.2rem] overflow-hidden
        style={{ background: 'linear-gradient(135deg,#2e2a78,#16143c)', minHeight: '144px' }}
        border-2 shadow-2xl select-none transition-all duration-200
        ${bounce ? 'luggage-bounce' : ''}
        ${isOver ? 'scale-110 border-emerald-400 bg-emerald-950/20 ring-4 ring-emerald-500/20' : ''}
        ${!isOver && pct >= 100 ? 'border-amber-400 shadow-amber-950/50' : ''}
        ${!isOver && pct < 100 ? 'border-indigo-400/60 shadow-indigo-950/60' : ''}
      `}
      style={{ background: 'linear-gradient(135deg,#2e2a78,#16143c)' }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 luggage-fill-inner"
        style={{ height: `${pct}%`, backgroundColor: fillColor, opacity: 0.32 }}
      />
      <svg viewBox="0 0 48 48" className="relative z-10 w-20 h-20" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="16" width="32" height="24" rx="4" stroke="#c7d2fe" strokeWidth="2"/>
        <rect x="16" y="10" width="16" height="8" rx="2" stroke="#c7d2fe" strokeWidth="1.8"/>
        <line x1="24" y1="16" x2="24" y2="40" stroke="#c7d2fe" strokeWidth="1.5" opacity="0.4"/>
        <line x1="8" y1="28" x2="40" y2="28" stroke="#c7d2fe" strokeWidth="1.5" opacity="0.4"/>
        <circle cx="10" cy="42" r="2" fill="#c7d2fe" opacity="0.8"/>
        <circle cx="38" cy="42" r="2" fill="#c7d2fe" opacity="0.8"/>
      </svg>
      {pct > 0 && (
        <span className="absolute bottom-2.5 right-3 font-display font-black z-10 text-sm tracking-wider"
          style={{ color: pct >= 100 ? '#fbbf24' : '#34d399' }}>
          {Math.round(pct)}%
        </span>
      )}
      {goal100 && (
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center animate-pop-in z-20 shadow-lg">
          <Trophy size={16} className="text-amber-900" strokeWidth={2.5} />
        </div>
      )}
    </div>
  )
}

function ConfettiPiece({ color, left, delay, size, shape }) {
  return (
    <div
      className="fixed top-0 pointer-events-none z-50 animate-confetti-fall"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${1100 + Math.random() * 500}ms`,
        width: `${size}px`,
        height: shape === 'circle' ? `${size}px` : `${size * 0.55}px`,
        borderRadius: shape === 'circle' ? '50%' : '2px',
        backgroundColor: color,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  )
}

function MilestoneToast({ milestone, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3400)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-pop-in">
      <div className="card-glass rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl border border-emerald-500/30">
        <span className="text-3xl">{milestone.icon}</span>
        <div>
          <p className="font-display font-semibold text-slate-300 text-xs">Hito alcanzado</p>
          <p className="font-display font-bold text-base" style={{ color: milestone.color }}>{milestone.label}</p>
        </div>
        <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-300 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

/* ─── Extra Destinations Modal ──────────────────────────────── */
function ExtraDestinationsModal({ selected, onSelect, onClose }) {
  const [search, setSearch] = useState('')  // ← añade esto

  const filtered = EXTRA_DESTINATIONS.filter(d =>
    d.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="animate-modal-in card-glass rounded-3xl p-6 w-full max-w-sm border border-indigo-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
            <Plane size={17} className="text-emerald-400" />
            Más destinos
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-700/50">
            <X size={18} />
          </button>
        </div>

        {/* ── Buscador ── */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            autoFocus
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar país..."
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl pl-9 pr-10 py-2.5
              text-white text-sm font-display font-semibold placeholder:text-slate-600
              focus:outline-none focus:border-indigo-400/70 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* ── Grid filtrado ── */}
        <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 py-1">
          {filtered.length > 0 ? filtered.map(d => (
            <button
              key={d.id}
              onClick={() => { onSelect(d); onClose() }}
              className={`
                flex flex-col items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-150 min-h-[78px]
                ${selected?.id === d.id
                  ? 'bg-indigo-600/40 border-indigo-400/70 scale-102 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-500/70'}
              `}
            >
              {renderFlag(d.flag, "w-8 h-5 rounded-sm object-cover shadow-sm flex-shrink-0")}
              <span className="text-slate-200 text-xs font-bold leading-tight text-center block w-full px-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {d.label}
              </span>
            </button>
          )) : (
            <div className="col-span-3 text-center py-8 text-slate-500 text-sm">
              No se encontró «{search}»
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── EditGoalModal ─────────────────────────────────────────── */
function EditGoalModal({ destination, goal, onSave, onClose }) {
  const [dest, setDest] = useState(destination)
  const [amount, setAmount] = useState(String(goal))
  const [error, setError] = useState('')
  const [showExtra, setShowExtra] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleSave()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [amount, dest])

  const RATES = {
    USD: { symbol: '$',  rate: 1,      label: 'USD' },
    EUR: { symbol: '€',  rate: 0.92,   label: 'EUR' },
    PEN: { symbol: 'S/', rate: 3.72,   label: 'PEN' },
  }

  const handleSave = () => {
    const parsed = parseInt(amount.replace(/\D/g, ''), 10)
    if (!parsed || parsed < 100 || parsed > 999999) {
      setError('Ingresa un monto entre $100 y $999.999')
      return
    }
    onSave({ destination: dest, goal: parsed })
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {showExtra && (
        <ExtraDestinationsModal
          selected={dest}
          onSelect={setDest}
          onClose={() => setShowExtra(false)}
        />
      )}
      <div className="animate-modal-in card-glass rounded-3xl p-6 w-full max-w-sm border border-indigo-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
            <Settings size={18} className="text-indigo-400" />
            Editar meta
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-700/50">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <span className="text-slate-400 text-xs font-medium block mb-2">Destino del viaje</span>
          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1 py-1">
            {DESTINATIONS.map(d => (
              <button
                key={d.id}
                onClick={() => setDest(d)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-150 min-h-[78px]
                  ${dest.id === d.id
                    ? 'bg-indigo-600/40 border-indigo-400/70 scale-102 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-500/70'}
                `}
              >
                {renderFlag(d.flag, "w-8 h-5 rounded-sm object-cover shadow-sm flex-shrink-0")}
                <span className="text-slate-200 text-xs font-bold leading-tight text-center block w-full px-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {d.label}
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowExtra(true)}
              className="flex flex-col items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-600/60 bg-slate-800/30 hover:border-indigo-400/60 hover:bg-slate-700/40 transition-all duration-150 min-h-[78px]"
            >
              <div className="w-8 h-5 rounded-sm bg-slate-700 flex items-center justify-center">
                <Plus size={14} className="text-slate-400" />
              </div>
              <span className="text-slate-400 text-xs font-bold">Más</span>
            </button>
          </div>
        </div>

        <div className="block mb-5">
          <span className="text-slate-400 text-xs font-medium block mb-2">Meta de ahorro (USD)</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-display font-bold">$</span>
            <input
              type="text"
              value={amount}
              onChange={e => { setAmount(e.target.value.replace(/\D/g, '')); setError('') }}
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl pl-8 pr-4 py-3
                text-white font-display font-bold text-lg focus:outline-none focus:border-indigo-400/70
                focus:ring-1 focus:ring-indigo-400/30 transition-all"
              placeholder="1500"
            />
          </div>
          {error && <p className="text-rose-400 text-xs mt-1.5">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300 font-display font-semibold text-sm transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5">
            <Check size={15} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Setup Screen ──────────────────────────────────────────── */

function getSliderGradient(value, max = 50000) {
  const pct = Math.min(value / max, 1)
  const hue = Math.round(240 - pct * 200)
  const sat = Math.round(60 + pct * 30)
  const lit = Math.round(55 - pct * 10)
  return `linear-gradient(90deg, hsl(${hue},${sat}%,${lit}%) ${pct * 100}%, #1e293b ${pct * 100}%)`
}

function SetupScreen({ onStart }) {
  const [dest, setDest] = useState(null)
  const [amount, setAmount] = useState(3000)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [showExtra, setShowExtra] = useState(false)
  const [editingAmount, setEditingAmount] = useState(false)

  const handleNext = () => {
    if (!dest) { setError('Elige un destino para continuar'); return }
    setError('')
    setStep(2)
  }

  const handleStart = () => {
    if (!amount || amount < 100 || amount > 99999) {
      setError('Ingresa un monto entre $100 y $99.999')
      return
    }
    onStart({ destination: dest, goal: amount })
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern font-body flex items-center justify-center w-full overflow-hidden">
      {showExtra && (
        <ExtraDestinationsModal
          selected={dest}
          onSelect={(d) => { setDest(d); setError('') }}
          onClose={() => setShowExtra(false)}
        />
      )}

      {/* ── Two-column layout: form left, map right ── */}
      <div className="w-full flex flex-col lg:flex-row items-stretch" style={{ maxWidth: '1140px', minHeight: '100vh' }}>

        {/* LEFT — scrollable form panel */}
        <div className="w-full lg:w-[440px] flex-shrink-0 flex flex-col justify-center px-6 py-10 lg:py-0 z-10">

          {/* Title */}
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Plane size={18} className="text-emerald-400" />
              <span className="text-emerald-400 font-display font-bold text-xs tracking-widest uppercase">Destino</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-0.5">
              <span
                className="font-display font-extrabold text-white"
                style={{ fontSize: '2.2rem', lineHeight: 1.05, fontStretch: '100%', letterSpacing: '-0.02em', fontSynthesis: 'none' }}
              >
                Intercambio
              </span>
              <span className="flex items-center gap-2.5">
                <span
                  className="font-display font-extrabold"
                  style={{
                    fontSize: '2.2rem', lineHeight: 1.05, fontStretch: '100%',
                    letterSpacing: '-0.02em', fontSynthesis: 'none',
                    background: dest ? 'linear-gradient(135deg,#10b981,#34d399)' : 'none',
                    WebkitBackgroundClip: dest ? 'text' : 'unset',
                    WebkitTextFillColor: dest ? 'transparent' : '#475569',
                    backgroundClip: dest ? 'text' : 'unset',
                    color: dest ? 'transparent' : '#475569',
                  }}
                >
                  {dest ? dest.label : '...'}
                </span>
                {dest && renderFlag(dest.flag, "w-9 h-6 rounded-md shadow-md object-cover")}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-2">Tu rastreador de ahorros gamificado</p>
          </div>

          {/* Card */}
          <div className="card-glass rounded-3xl p-6 border border-indigo-500/20 shadow-2xl animate-modal-in">
            {step === 1 && (
              <>
                <h2 className="font-display font-bold text-white text-lg mb-1">¿A dónde viajas?</h2>
                <p className="text-slate-400 text-sm mb-5">Elige tu destino de intercambio</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {DESTINATIONS.map(d => (
                    <button
                      key={d.id}
                      onClick={() => { setDest(d); setError('') }}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-150 active:scale-95 min-h-[82px]
                        ${dest?.id === d.id
                          ? 'bg-indigo-600/40 border-indigo-400/70 scale-102 shadow-lg shadow-indigo-900/30'
                          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-500/70'}`}
                    >
                      {renderFlag(d.flag, "w-8 h-5 rounded-sm object-cover shadow-sm")}
                      <span className="text-xs font-bold text-center leading-tight text-slate-300">{d.label}</span>
                    </button>
                  ))}
                  {/* (+) 9th cell */}
                  <button
                    onClick={() => setShowExtra(true)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-600/60 bg-slate-800/20 hover:border-indigo-400/60 hover:bg-slate-700/30 transition-all duration-150 active:scale-95 min-h-[82px]"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center border border-slate-600/60">
                      <Plus size={16} className="text-slate-300" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Más</span>
                  </button>
                </div>
                {dest && !DESTINATIONS.find(d => d.id === dest.id) && (
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-900/30 border border-indigo-500/30">
                    {renderFlag(dest.flag, "w-7 h-4 rounded-sm object-cover shadow-sm")}
                    <span className="text-indigo-300 text-sm font-display font-bold">{dest.label} seleccionado</span>
                    <button onClick={() => setDest(null)} className="ml-auto text-slate-500 hover:text-slate-300"><X size={13} /></button>
                  </div>
                )}
                {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-base transition-all duration-150 active:scale-98 flex items-center justify-center gap-2"
                >
                  Siguiente <ChevronRight size={17} />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  onClick={() => { setStep(1); setError('') }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm mb-4 transition-colors"
                >
                  <ChevronRight size={14} className="rotate-180" /> Volver
                </button>
                <h2 className="font-display font-bold text-white text-lg mb-1">¿Cuánto quieres ahorrar?</h2>
                <p className="text-slate-400 text-sm mb-5">
                  Define tu meta en dólares para lifestyle <span className="text-white font-semibold">{dest?.label}</span>
                </p>
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {[500, 1000, 1500, 2000, 3000, 5000].map(preset => (
                    <button
                      key={preset}
                      onClick={() => { setAmount(preset); setError('') }}
                      className={`py-3.5 px-2 rounded-2xl border text-sm font-display font-extrabold transition-all duration-150 active:scale-95 shadow-sm
                        ${amount === preset
                          ? 'bg-emerald-600/40 border-emerald-400/70 text-emerald-300 shadow-emerald-900/30 scale-105'
                          : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'}`}
                    >
                      ${preset.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-xs font-medium">Monto personalizado</span>
                    {editingAmount ? (
                      <input
                        autoFocus
                        type="text"
                        value={amount}
                        onChange={e => {
                          const v = Number(e.target.value.replace(/\D/g, ''))
                          if (!isNaN(v)) setAmount(v)
                        }}
                        onBlur={() => setEditingAmount(false)}
                        onKeyDown={e => e.key === 'Enter' && setEditingAmount(false)}
                        className="w-28 bg-transparent border-b border-emerald-400 text-white font-display font-black text-base text-right focus:outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => setEditingAmount(true)}
                        className="font-display font-black text-base text-white cursor-pointer hover:text-emerald-300 transition-colors border-b border-dashed border-slate-600 hover:border-emerald-400"
                        title="Clic para editar"
                      >
                        {fmt(amount)}
                      </span>
                    )}
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                      style={{ width: `${(amount / 50000) * 100}%`, background: getSliderGradient(amount) }}
                    />
                    <input
                      type="range" min={1000} max={50000} step={100} value={amount}
                      onChange={e => { setAmount(Number(e.target.value)); setError('') }}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                      style={{ zIndex: 10 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 px-0.5">
                    <span className="text-slate-600 text-[10px] font-display font-bold">$1,000</span>
                    <span className="text-slate-600 text-[10px] font-display font-bold">$50,000</span>
                  </div>
                </div>
                {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
                <button
                  onClick={handleStart}
                  className="w-full py-3.5 rounded-2xl text-white font-display font-bold text-base transition-all duration-150 active:scale-98 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
                >
                  <Sparkles size={16} />
                  ¡Comenzar mi ahorro!
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT — map panel, hidden on mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0d1b2e 100%)' }}
        >
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Map */}
          <div className="relative z-10 w-full h-full p-6 flex items-center">
            <WorldMap 
              selectedIso={dest?.iso} 
              selectableIsos={[...DESTINATIONS, ...EXTRA_DESTINATIONS].map(d => d.iso)}
              onSelectCountry={(iso) => {
                const found = [...DESTINATIONS, ...EXTRA_DESTINATIONS].find(d => d.iso === iso)
                if (found) { setDest(found); setError('') }
              }}
            />
          </div>
          {/* Selected country label */}
          {dest && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-pop-in">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl card-glass border border-emerald-500/30 shadow-lg">
                {renderFlag(dest.flag, "w-7 h-5 rounded-sm object-cover shadow-sm")}
                <span className="font-display font-bold text-emerald-300 text-sm">{dest.label}</span>
              </div>
            </div>
          )}
          {!dest && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-slate-600 text-xs font-display font-bold tracking-wider uppercase">
              Selecciona un destino
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

/* ─── Main App ──────────────────────────────────────────────── */

export default function App() {
  const [isSetup, setIsSetup] = useState(null)
  const [goal, setGoal] = useState(1500)
  const [destination, setDestination] = useState(DESTINATIONS[0])
  const [total, setTotal] = useState(0)
  const [history, setHistory] = useState([])

  const [luggageBounce, setLuggageBounce] = useState(false)
  const [flyingBills, setFlyingBills] = useState([])
  const [confettiPieces, setConfettiPieces] = useState([])
  const [activeMilestone, setActiveMilestone] = useState(null)
  const [reachedMilestones, setReachedMilestones] = useState(new Set())
  const [animatingMilestones, setAnimatingMilestones] = useState(new Set())
  const [lastAdded, setLastAdded] = useState(null)
  const [undoFlash, setUndoFlash] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [isBillOverLuggage, setIsBillOverLuggage] = useState(false)
  const [currency, setCurrency] = useState('USD')

  const luggageRef          = useRef(null)
  const billIdRef           = useRef(0)
  const activeDragRef       = useRef(null)
  const isProcessingDeposit = useRef(false)

  /* Load from localStorage */
  useEffect(() => {
    const data = loadData()
    if (!data || !data.goal || !data.destination) { setIsSetup(false); return }
    setGoal(data.goal)
    setDestination(data.destination)
    if (data.total)   setTotal(data.total)
    if (data.history) setHistory(data.history)
    const currentTotal = data.total || 0
    const currentGoal  = data.goal  || 1500
    const pct = (currentTotal / currentGoal) * 100
    setReachedMilestones(new Set(MILESTONES.filter(m => pct >= m.pct).map(m => m.pct)))
    setIsSetup(true)
  }, [])

  /* Save to localStorage */
  useEffect(() => {
    if (isSetup) saveData({ goal, destination, total, history })
  }, [goal, destination, total, history, isSetup])

  const pct       = Math.min((total / goal) * 100, 100)
  const remaining = Math.max(0, goal - total)

  const triggerConfetti = useCallback((count = 28) => {
    const pieces = Array.from({ length: count }, (_, i) => ({
      id: i + Date.now(),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 450,
      size: 5 + Math.random() * 9,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }))
    setConfettiPieces(pieces)
    setTimeout(() => setConfettiPieces([]), 2200)
  }, [])

  const triggerBounce = useCallback(() => {
    setLuggageBounce(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setLuggageBounce(true)))
    setTimeout(() => setLuggageBounce(false), 600)
  }, [])

  const checkMilestones = useCallback((newTotal, currentGoal, currentReached) => {
    const newPct = (newTotal / currentGoal) * 100
    const newReached = new Set(currentReached)
    let triggeredAny = false
    let lastHit = null
    MILESTONES.forEach(m => {
      if (newPct >= m.pct && !currentReached.has(m.pct)) {
        newReached.add(m.pct)
        triggeredAny = true
        lastHit = m
        setAnimatingMilestones(prev => new Set([...prev, m.pct]))
        setTimeout(() => setAnimatingMilestones(prev => { const n = new Set(prev); n.delete(m.pct); return n }), 600)
      }
    })
    if (triggeredAny && lastHit) {
      setActiveMilestone(lastHit)
      triggerConfetti(lastHit.pct === 100 ? 70 : 35)
    }
    setReachedMilestones(newReached)
    return newReached
  }, [triggerConfetti])

  /* ─── Bill drag ────────────────────────────────────────────── */

  const startBillFlow = (denom, clientX, clientY) => {
    if (total >= goal) return
    isProcessingDeposit.current = false
    const id = ++billIdRef.current
    setFlyingBills(prev => [...prev, { id, value: denom.value, x: clientX, y: clientY, denomination: denom, isDragging: true }])
    activeDragRef.current = id
  }

  const handleMouseDown = (denom, e) => { if (e.button !== 0) return; startBillFlow(denom, e.clientX, e.clientY) }
  const handleTouchStart = (denom, e) => {
    if (e.touches && e.touches.length > 0) {
      if (e.cancelable) e.preventDefault()
      startBillFlow(denom, e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handlePointerMove = useCallback((e) => {
    if (!activeDragRef.current) return
    const id = activeDragRef.current
    const currentX = e.clientX, currentY = e.clientY
    let overLuggage = false
    if (luggageRef.current) {
      const r = luggageRef.current.getBoundingClientRect()
      if (currentX >= r.left && currentX <= r.right && currentY >= r.top && currentY <= r.bottom) overLuggage = true
    }
    setIsBillOverLuggage(overLuggage)
    setFlyingBills(prev => prev.map(b => b.id === id ? { ...b, x: currentX, y: currentY } : b))
  }, [])

  // Stable refs to avoid stale closures in handlePointerUp
  const flyingBillsRef         = useRef(flyingBills);       useEffect(() => { flyingBillsRef.current = flyingBills },           [flyingBills])
  const isBillOverLuggageRef   = useRef(isBillOverLuggage); useEffect(() => { isBillOverLuggageRef.current = isBillOverLuggage }, [isBillOverLuggage])
  const goalRef                = useRef(goal);               useEffect(() => { goalRef.current = goal },                         [goal])
  const reachedMilestonesRef   = useRef(reachedMilestones); useEffect(() => { reachedMilestonesRef.current = reachedMilestones }, [reachedMilestones])
  const totalRef               = useRef(total);             useEffect(() => { totalRef.current = total },                        [total])

  const handlePointerUp = useCallback(() => {
    if (!activeDragRef.current) return
    const id = activeDragRef.current
    activeDragRef.current = null   // clear first — prevents re-entry

    const targetBill = flyingBillsRef.current.find(b => b.id === id)

    if (isBillOverLuggageRef.current && targetBill && !isProcessingDeposit.current) {
      isProcessingDeposit.current = true
      triggerBounce()
      const depositAmount = targetBill.value
      const currentGoal   = goalRef.current

      // Pure updater — no side effects inside
      setTotal(prev => Math.min(prev + depositAmount, currentGoal))

      // Side effects outside the updater
      const newTotal = Math.min(totalRef.current + depositAmount, currentGoal)
      const entry = { id: Date.now(), amount: depositAmount, ts: Date.now(), totalAfter: newTotal }
      setHistory(h => [entry, ...h].slice(0, 50))
      setLastAdded(entry.id)
      setTimeout(() => setLastAdded(null), 2200)
      checkMilestones(newTotal, currentGoal, reachedMilestonesRef.current)
    }

    setFlyingBills(prev => prev.filter(b => b.id !== id))
    setIsBillOverLuggage(false)
  }, [triggerBounce, checkMilestones])

  // Register listeners ONCE per drag session — not on every pointermove render
  const isDraggingRef = useRef(false)
  useEffect(() => {
    const hasDrag = flyingBills.some(b => b.isDragging)
    if (hasDrag && !isDraggingRef.current) {
      isDraggingRef.current = true
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    } else if (!hasDrag && isDraggingRef.current) {
      isDraggingRef.current = false
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [flyingBills, handlePointerMove, handlePointerUp])

  const handleUndo = useCallback(() => {
    if (history.length === 0) return
    const [last, ...rest] = history
    const newTotal = Math.max(0, total - last.amount)
    setTotal(newTotal)
    setHistory(rest)
    const newPct = (newTotal / goal) * 100
    setReachedMilestones(new Set(MILESTONES.filter(m => newPct >= m.pct).map(m => m.pct)))
    setUndoFlash(true)
    setTimeout(() => setUndoFlash(false), 500)
  }, [history, total, goal])

  const handleModalSave = useCallback(({ destination: newDest, goal: newGoal }) => {
    setDestination(newDest)
    setGoal(newGoal)
    const newPct = (total / newGoal) * 100
    setReachedMilestones(new Set(MILESTONES.filter(m => newPct >= m.pct).map(m => m.pct)))
    setShowModal(false)
  }, [total])

  const handleReset   = useCallback(() => setShowConfirmReset(true), [])
  const executeReset  = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setTotal(0); setHistory([]); setGoal(1500); setDestination(DESTINATIONS[0])
    setReachedMilestones(new Set()); setAnimatingMilestones(new Set())
    setShowConfirmReset(false); setIsSetup(false)
  }, [])

  const avgDeposit = history.length > 0 ? Math.round(total / history.length) : 0
  const daysApprox = history.length > 0 && remaining > 0
    ? Math.ceil(remaining / Math.max(avgDeposit, 1))
    : remaining === 0 ? 0 : null

  if (isSetup === null) return null
  if (!isSetup) {
    return (
      <SetupScreen onStart={({ destination: d, goal: g }) => {
        setDestination(d); setGoal(g); setIsSetup(true)
      }} />
    )
  }

  /* ── Dashboard ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen w-screen bg-slate-950 bg-grid-pattern font-body overflow-x-hidden select-none">

      {confettiPieces.map(p => <ConfettiPiece key={p.id} {...p} />)}

      {/* Flying bill */}
      {flyingBills.map(b => (
        <div key={b.id} className="fixed pointer-events-none z-50 cursor-grabbing touch-none"
          style={{ left: b.x, top: b.y, transform: 'translate(-50%, -50%)' }}>
          <div className="w-24 h-14 rounded-md flex flex-col items-center justify-center relative border-2 p-1 overflow-hidden transition-colors"
            style={{
              backgroundColor: b.denomination.bg,
              borderColor: isBillOverLuggage ? '#10b981' : b.denomination.border,
              boxShadow: isBillOverLuggage ? '0 0 30px #10b981' : `0 10px 25px -5px ${b.denomination.glow}`,
            }}>
            <div className="absolute inset-0.5 rounded border opacity-40 pointer-events-none" style={{ borderColor: b.denomination.border }} />
            <span className="absolute top-1 left-1.5 text-[7px] font-black tracking-tighter opacity-40" style={{ color: b.denomination.text }}>{b.denomination.label}</span>
            <span className="absolute bottom-1 right-1.5 text-[7px] font-black tracking-tighter opacity-40" style={{ color: b.denomination.text }}>{b.denomination.label}</span>
            <div className="relative z-10 flex flex-col items-center justify-center leading-none">
              <span className="font-display font-black text-base tracking-tight" style={{ color: b.denomination.text }}>{b.denomination.label}</span>
              <span className="text-[7px] font-bold uppercase tracking-widest opacity-60 mt-0.5" style={{ color: b.denomination.text }}>
                {isBillOverLuggage ? '¡Suéltame!' : 'Ahorro USD'}
              </span>
            </div>
          </div>
        </div>
      ))}

      {activeMilestone && <MilestoneToast milestone={activeMilestone} onClose={() => setActiveMilestone(null)} />}
      {showModal && <EditGoalModal destination={destination} goal={goal} onSave={handleModalSave} onClose={() => setShowModal(false)} />}

      {showConfirmReset && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowConfirmReset(false)}>
          <div className="animate-modal-in card-glass rounded-3xl p-6 w-full max-w-sm border border-rose-500/30 shadow-2xl shadow-rose-950/20 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3.5 border border-rose-500/20">
              <Undo2 size={22} className="rotate-45" />
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-2">¿Borrar meta actual?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Esta acción eliminará de forma permanente tu destino de viaje y todos los ahorros acumulados hasta el momento.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmReset(false)} className="flex-1 py-2.5 rounded-xl border border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300 font-display font-semibold text-sm transition-all">No, cancelar</button>
              <button onClick={executeReset} className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-sm transition-all active:scale-95 shadow-lg shadow-rose-900/30">Sí, borrar todo</button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MOBILE: una columna vertical (< xl)
          DESKTOP: tres columnas 35 / 35 / 30  (≥ xl / 1280px)
      ───────────────────────────────────────────────────────── */}
      <div className="w-full xl:h-screen flex flex-col xl:flex-row xl:items-stretch overflow-hidden">

        {/* ══════════════════════════════════════════
            COL 1 — 50%  →  Progreso / Meta
        ══════════════════════════════════════════ */}
        <div className="w-full xl:w-[50%] flex-shrink-0 px-4 pt-6 pb-4
          xl:h-full xl:overflow-y-auto
          flex flex-col gap-4 border-b xl:border-b-0 xl:border-r border-slate-800/40">

          {/* Header */}
          <header className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80">
            <div className="flex items-stretch justify-between gap-3 w-full">

              {/* Título */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Plane size={13} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 font-display font-bold text-[10px] tracking-widest uppercase">Destino Activo</span>
                </div>
                <span className="font-display font-black text-white uppercase tracking-wide"
                  style={{ fontSize: '1.8rem', lineHeight: 1.1, letterSpacing: '0.06em', fontSynthesis: 'none' }}>
                  Intercambio <span className="text-indigo-300 text-xs"></span>
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-display font-black text-gradient-emerald uppercase"
                    style={{ fontSize: '2.8rem', lineHeight: 1, letterSpacing: '-0.01em', fontSynthesis: 'none' }}>
                    {destination.label}
                  </span>
                </div>
              </div>

    {/* Separador */}
    <div className="w-px bg-slate-800/80 flex-shrink-0" />

    {/* Bandera */}
    <div className="flex flex-col items-center justify-center px-4 flex-shrink-0">
      {renderFlag(destination.flag, "w-16 h-11 rounded-lg object-cover shadow-xl border border-white/15")}
    </div>

    {/* Separador */}
    <div className="w-px bg-slate-800/80 flex-shrink-0" />

    {/* Estado */}
    <div className="flex flex-col items-center justify-center gap-1 px-3 flex-shrink-0 min-w-[90px]">
      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-slate-500">Estado</span>
      <span className="text-2xl leading-none">
        {MILESTONES.findLast(m => reachedMilestones.has(m.pct))?.icon ?? '🎯'}
      </span>
      <span className="font-display font-bold text-[10px] text-center leading-tight"
        style={{ color: MILESTONES.findLast(m => reachedMilestones.has(m.pct))?.color ?? '#475569' }}>
        {MILESTONES.findLast(m => reachedMilestones.has(m.pct))?.label ?? 'Comenzando...'}
      </span>
    </div>

    {/* Separador */}
    <div className="w-px bg-slate-800/80 flex-shrink-0" />

    {/* Meta + botones */}
    <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
      <div className="rounded-xl px-3 py-1.5 bg-slate-900/80 border border-slate-700/60 flex flex-col w-full">
        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Meta total</span>
        <span className="font-display font-black text-base text-white">{fmt(goal)}</span>
      </div>
      <div className="flex gap-1.5 w-full justify-end">
        <button onClick={() => setShowModal(true)} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/50 transition-all active:scale-95">
          <Pencil size={13} />
        </button>
        <button onClick={handleReset} className="p-2 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:text-rose-300 hover:border-rose-600/60 transition-all active:scale-95">
          <X size={13} />
        </button>
      </div>
    </div>

  </div>
</header>

          {/* Hero Card */}
          <div className="card-glass rounded-3xl p-5 flex flex-col animate-pulse-glow flex-1 min-h-0">
            <div className="flex items-start justify-between gap-4 flex-1 mb-5 h-full">
              <div className="flex flex-col gap-2 min-w-0 flex-1 h-full justify-between">
                <span className="text-slate-300 text-base font-display font-black tracking-widest uppercase">
                  Total Ahorrado
                </span>
                <span className="font-display font-black leading-none select-text"
                  style={{
                    fontSize: 'clamp(4.5rem, 10vw, 6.5rem)',
                    background: 'linear-gradient(135deg,#10b981,#34d399)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    letterSpacing: '-0.02em', fontSynthesis: 'none',
                  }}>
                  {fmt(total)}
                </span>

                {/* Selector de moneda */}
{(() => {
  const destRate = COUNTRY_RATES[destination.id] || { symbol: '$', rate: 1, label: 'USD' }
  const tabs = [
    { key: 'USD', symbol: '$',           rate: 1,             label: 'USD' },
    { key: 'EUR', symbol: '€',           rate: 0.92,          label: 'EUR' },
    { key: 'LOC', symbol: destRate.symbol, rate: destRate.rate, label: destRate.label },
  ]
  // deduplica si el destino ya es USD o EUR
  const unique = tabs.filter((t, i, arr) => arr.findIndex(x => x.label === t.label) === i)
  const active = tabs.find(t => t.key === currency) || tabs[0]
  return (
    <div className="flex flex-col gap-2 mt-1">
      <div className="flex gap-1.5">
        {unique.map(t => (
          <button
            key={t.key}
            onClick={() => setCurrency(t.key)}
            className={`px-3 py-1 rounded-lg text-[11px] font-display font-bold transition-all duration-150 border
              ${currency === t.key
                ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {currency !== 'USD' && (
        <div className="flex flex-col gap-1 mt-1">
          {/* Tipo de cambio */}
          <p className="text-slate-500 text-[10px] font-display font-semibold flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">$1 USD</span>
            <span className="text-slate-600">→</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              {active.symbol}{active.rate.toLocaleString('es-CL', { maximumFractionDigits: 2 })} {active.label}
            </span>
          </p>
          {/* Total convertido */}
          <p className="text-slate-400 text-xs font-display font-semibold">
            ≈ <span className="text-white font-black">
              {active.symbol}{Math.round(total * active.rate).toLocaleString()}
            </span>
            {' '}
            <span className="text-slate-500">/ meta {active.symbol}{Math.round(goal * active.rate).toLocaleString()}</span>
          </p>
        </div>
      )}
    </div>
  )
})()}

                {remaining > 0 ? (
                  <p className="text-slate-300 text-base font-display font-bold">
                    Te faltan <span className="text-amber-400">{fmt(remaining)}</span>
                  </p>
                ) : (
                  <span className="text-emerald-400 font-black text-sm flex items-center gap-1 animate-pop-in">
                    ¡Meta completada! 🎊
                  </span>
                )}
              </div>

              {/* Maleta más grande con borde brillante */}
              <div
                ref={luggageRef}
                className="flex-shrink-0 p-3 rounded-[2.2rem] flex items-center justify-center self-stretch"
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
                  border: '2px solid rgba(99,102,241,0.5)',
                  boxShadow: '0 0 28px rgba(99,102,241,0.25), inset 0 0 20px rgba(16,185,129,0.05)',
                  minWidth: '240px',
                  maxWidth: '250px',
                  width: '24%',
                }}
              >
                <LuggageIcon pct={pct} bounce={luggageBounce} goal100={total >= goal} isOver={isBillOverLuggage} />
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full mt-auto">
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60 p-[2px]">
                <div className="h-full rounded-full shimmer-bar" style={{ width: `${pct}%`, transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
              </div>
              <div className="flex justify-between mt-2 px-0.5">
                {MILESTONES.slice(0, 4).map(m => (
                  <div key={m.pct} className="flex flex-col items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${reachedMilestones.has(m.pct) ? 'scale-125' : ''}`}
                      style={{ backgroundColor: reachedMilestones.has(m.pct) ? m.color : '#334155' }} />
                    <span className="text-slate-500 font-display font-bold text-[9px]">{m.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-5 gap-1.5">
            {MILESTONES.map(m => {
              const reached   = reachedMilestones.has(m.pct)
              const animating = animatingMilestones.has(m.pct)
              return (
                <div key={m.pct}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 border transition-all duration-500
                    ${reached ? 'card-glass milestone-active-ring scale-102 bg-slate-900/40' : 'bg-slate-900/20 border-slate-900/50 opacity-40'}`}
                  style={{ borderColor: reached ? m.color : 'rgba(30,41,59,0.5)' }}>
                  <span className={`text-xl transition-all duration-300 ${animating ? 'animate-milestone-pop' : ''} ${reached ? '' : 'grayscale'}`}>
                    {m.icon}
                  </span>
                  <span className="text-[10px] font-display font-bold text-center leading-tight"
                    style={{ color: reached ? m.color : '#475569' }}>{m.pct}%</span>
                </div>
              )
            })}
          </div>

          {/* Footer desktop */}
          <footer className="hidden xl:block mt-auto pb-2">
            <p className="text-slate-600 text-xs font-medium flex items-center gap-1.5 flex-wrap">
              <Sparkles size={10} className="text-indigo-500" />
              <span>Intercambio {destination.label}</span>
              {renderFlag(destination.flag, "w-4 h-2.5 rounded-sm object-cover")}
              <span>· Tu viaje comienza aquí</span>
              <Sparkles size={10} className="text-emerald-500" />
            </p>
          </footer>
        </div>

        {/* ══════════════════════════════════════════
            COL 2 — 30%  →  Billetera
        ══════════════════════════════════════════ */}
        <div className="w-full xl:w-[30%] flex-shrink-0 px-4 py-6
          xl:h-full xl:overflow-y-auto
          flex flex-col gap-4 border-b xl:border-b-0 xl:border-r border-slate-800/40">

          <div className="card-glass rounded-3xl p-5 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Coins size={16} className="text-amber-400" />
              <h2 className="font-display font-bold text-white text-lg">Tu billetera</h2>
              <span className="ml-auto text-slate-500 text-xs">Arrastra a la maleta</span>
            </div>

            {/* 2×2 grid de billetes */}
            <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
              {DENOMINATIONS.map(denom => (
                <button key={denom.value}
                  onMouseDown={e => handleMouseDown(denom, e)}
                  onTouchStart={e => handleTouchStart(denom, e)}
                  disabled={total >= goal}
                  className="relative group no-select rounded-2xl p-5 flex flex-col items-center justify-center gap-3
                    cursor-grab active:cursor-grabbing transition-all duration-150
                    hover:scale-105 active:scale-95 h-full
                    disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100
                    focus:outline-none focus:ring-2 focus:ring-white/20 shadow-lg"
                  style={{ backgroundColor: denom.bg, border: `1.5px solid ${denom.border}`, boxShadow: `0 4px 20px ${denom.glow}` }}>
                  <Banknote size={38} style={{ color: denom.text }} strokeWidth={1.5} className="transition-transform group-hover:rotate-6" />
                  <span className="font-display font-extrabold text-3xl" style={{ color: denom.text }}>{denom.label}</span>
                  <span className="text-sm font-bold" style={{ color: `${denom.text}70` }}>USD</span>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${denom.glow} 0%, transparent 70%)` }} />
                </button>
              ))}
            </div>

            {total >= goal && (
              <div className="text-center py-3 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 animate-slide-up">
                <p className="text-emerald-400 font-display font-bold flex items-center justify-center gap-2 text-sm">
                  <Trophy size={15} /> ¡Meta alcanzada! ¡Prepara las maletas! <Trophy size={15} />
                </p>
              </div>
            )}
          </div>

          {/* Stats debajo de la billetera */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Depósitos',   value: history.length,                          IconComponent: ChevronRight },
              { label: 'Promedio',    value: avgDeposit > 0 ? fmt(avgDeposit) : '$0', IconComponent: Target       },
              { label: 'Días aprox.', value: daysApprox !== null ? daysApprox : '∞',  IconComponent: MapPin       },
            ].map(stat => (
              <div key={stat.label} className="card-glass-light rounded-2xl px-3 py-3 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-slate-500">
                  <stat.IconComponent size={12} />
                  <span className="text-[11px] font-medium">{stat.label}</span>
                </div>
                <span className="font-display font-bold text-white text-lg">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            COL 3 — 20%  →  Historial
        ══════════════════════════════════════════ */}
        <div className="w-full xl:flex-1 px-4 py-6
          xl:h-full xl:overflow-hidden
          flex flex-col gap-4">

          <div className="card-glass rounded-3xl p-5 flex flex-col flex-1">
            {/* Header fijo del historial */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <History size={16} className="text-indigo-400" />
                <h2 className="font-display font-bold text-white text-lg">Historial</h2>
              </div>
              {history.length > 0 && (
                <button onClick={handleUndo}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/50
                    hover:border-rose-600/70 text-rose-400 hover:text-rose-300 text-sm font-display font-semibold
                    transition-all duration-150 active:scale-95 focus:outline-none
                    ${undoFlash ? 'border-rose-500/70 ring-2 ring-rose-500/30' : ''}`}>
                  <Undo2 size={13} />Deshacer
                </button>
              )}
            </div>

            {/* Lista con scroll fijo a ~3 items */}
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Plane size={28} className="text-slate-700 mx-auto mb-3" strokeWidth={1} />
                <p className="text-slate-500 text-sm">Aún no hay depósitos.</p>
                <p className="text-slate-600 text-xs mt-1">¡Arrastra un billete a la maleta!</p>
              </div>
            ) : (
              <>
                {/* Scroll limitado: cada item ~72px → 3 items ≈ 216px, +gradiente */}
                <div className="relative flex-shrink-0">
                  <ul className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1"
                    style={{ maxHeight: '576px' }}>
                    {history.map((entry, i) => {
                      const denom = DENOMINATIONS.find(d => d.value === entry.amount) || DENOMINATIONS[0]
                      return (
                        <li key={entry.id}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-500 flex-shrink-0
                            ${lastAdded === entry.id ? 'bg-emerald-900/30 border-emerald-500/40 animate-slide-up' : 'bg-slate-800/40 border-slate-700/30'}
                            ${i > 0 ? 'opacity-65' : ''}`}>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: denom.bg, border: `1px solid ${denom.border}40` }}>
                            <Banknote size={15} style={{ color: denom.border }} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-white text-sm">+{fmt(entry.amount)}</p>
                            <p className="text-slate-500 text-xs truncate">→ {fmt(entry.totalAfter)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-slate-500 text-[10px]">{fmtDate(entry.ts)}</p>
                            {i === 0 && <span className="text-emerald-500 text-[9px] font-display font-semibold block">Último</span>}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  {/* Gradiente inferior que indica scroll */}
                  {history.length > 8 && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none rounded-b-xl"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.9))' }} />
                  )}
                </div>

                {/* Contador de registros */}
                {history.length > 8 && (
                  <p className="text-slate-600 text-[10px] font-display font-bold text-center mt-2 flex-shrink-0">
                    {history.length} registros en total · scroll ↑↓
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer móvil */}
          <footer className="xl:hidden text-center pb-4">
            <p className="text-slate-600 text-xs font-medium flex items-center justify-center gap-1.5 flex-wrap">
              <Sparkles size={10} className="text-indigo-500" />
              <span>Intercambio {destination.label}</span>
              {renderFlag(destination.flag, "w-4 h-2.5 rounded-sm object-cover")}
              <span>· Tu viaje comienza aquí</span>
              <Sparkles size={10} className="text-emerald-500" />
            </p>
          </footer>
        </div>

      </div>
    </div>
  )
}