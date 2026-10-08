/**
 * Liste des pays du monde (code ISO 3166-1 alpha-2, nom en français, devise ISO 4217).
 * Utilisée à la fois pour "pays d'envoi" et "pays de réception" — tous les
 * pays sont éligibles aux deux rôles dans ce prototype. En production,
 * tu limiteras probablement les pays d'envoi à ceux où tu es agréé, et les
 * pays de réception à ceux couverts par tes fournisseurs de paiement.
 *
 * Le drapeau n'est pas stocké : il est généré à partir du code ISO via
 * des symboles indicateurs régionaux Unicode (évite 190 emojis à maintenir
 * à la main et les risques d'erreur de copier-coller).
 */
function codeToFlag(isoCode) {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const RAW_COUNTRIES = [
  // Afrique
  ["DZ", "Algérie", "DZD"], ["AO", "Angola", "AOA"], ["BJ", "Bénin", "XOF"],
  ["BW", "Botswana", "BWP"], ["BF", "Burkina Faso", "XOF"], ["BI", "Burundi", "BIF"],
  ["CM", "Cameroun", "XAF"], ["CV", "Cap-Vert", "CVE"], ["CF", "République centrafricaine", "XAF"],
  ["TD", "Tchad", "XAF"], ["KM", "Comores", "KMF"], ["CG", "Congo", "XAF"],
  ["CD", "RD Congo", "CDF"], ["CI", "Côte d'Ivoire", "XOF"], ["DJ", "Djibouti", "DJF"],
  ["EG", "Égypte", "EGP"], ["GQ", "Guinée équatoriale", "XAF"], ["ER", "Érythrée", "ERN"],
  ["SZ", "Eswatini", "SZL"], ["ET", "Éthiopie", "ETB"], ["GA", "Gabon", "XAF"],
  ["GM", "Gambie", "GMD"], ["GH", "Ghana", "GHS"], ["GN", "Guinée", "GNF"],
  ["GW", "Guinée-Bissau", "XOF"], ["KE", "Kenya", "KES"], ["LS", "Lesotho", "LSL"],
  ["LR", "Libéria", "LRD"], ["LY", "Libye", "LYD"], ["MG", "Madagascar", "MGA"],
  ["MW", "Malawi", "MWK"], ["ML", "Mali", "XOF"], ["MR", "Mauritanie", "MRU"],
  ["MU", "Maurice", "MUR"], ["MA", "Maroc", "MAD"], ["MZ", "Mozambique", "MZN"],
  ["NA", "Namibie", "NAD"], ["NE", "Niger", "XOF"], ["NG", "Nigeria", "NGN"],
  ["RW", "Rwanda", "RWF"], ["ST", "Sao Tomé-et-Principe", "STN"], ["SN", "Sénégal", "XOF"],
  ["SC", "Seychelles", "SCR"], ["SL", "Sierra Leone", "SLE"], ["SO", "Somalie", "SOS"],
  ["ZA", "Afrique du Sud", "ZAR"], ["SS", "Soudan du Sud", "SSP"], ["SD", "Soudan", "SDG"],
  ["TZ", "Tanzanie", "TZS"], ["TG", "Togo", "XOF"], ["TN", "Tunisie", "TND"],
  ["UG", "Ouganda", "UGX"], ["ZM", "Zambie", "ZMW"], ["ZW", "Zimbabwe", "ZWL"],

  // Amériques
  ["AR", "Argentine", "ARS"], ["AG", "Antigua-et-Barbuda", "XCD"], ["BS", "Bahamas", "BSD"],
  ["BB", "Barbade", "BBD"], ["BZ", "Belize", "BZD"], ["BO", "Bolivie", "BOB"],
  ["BR", "Brésil", "BRL"], ["CA", "Canada", "CAD"], ["CL", "Chili", "CLP"],
  ["CO", "Colombie", "COP"], ["CR", "Costa Rica", "CRC"], ["CU", "Cuba", "CUP"],
  ["DM", "Dominique", "XCD"], ["DO", "République dominicaine", "DOP"], ["EC", "Équateur", "USD"],
  ["SV", "Salvador", "USD"], ["US", "États-Unis", "USD"], ["GD", "Grenade", "XCD"],
  ["GT", "Guatemala", "GTQ"], ["GY", "Guyana", "GYD"], ["HT", "Haïti", "HTG"],
  ["HN", "Honduras", "HNL"], ["JM", "Jamaïque", "JMD"], ["MX", "Mexique", "MXN"],
  ["NI", "Nicaragua", "NIO"], ["PA", "Panama", "PAB"], ["PY", "Paraguay", "PYG"],
  ["PE", "Pérou", "PEN"], ["KN", "Saint-Christophe-et-Niévès", "XCD"], ["LC", "Sainte-Lucie", "XCD"],
  ["VC", "Saint-Vincent-et-les-Grenadines", "XCD"], ["SR", "Suriname", "SRD"],
  ["TT", "Trinité-et-Tobago", "TTD"], ["UY", "Uruguay", "UYU"], ["VE", "Venezuela", "VES"],

  // Asie
  ["AF", "Afghanistan", "AFN"], ["AM", "Arménie", "AMD"], ["AZ", "Azerbaïdjan", "AZN"],
  ["BH", "Bahreïn", "BHD"], ["BD", "Bangladesh", "BDT"], ["BT", "Bhoutan", "BTN"],
  ["BN", "Brunei", "BND"], ["KH", "Cambodge", "KHR"], ["CN", "Chine", "CNY"],
  ["GE", "Géorgie", "GEL"], ["IN", "Inde", "INR"], ["ID", "Indonésie", "IDR"],
  ["IR", "Iran", "IRR"], ["IQ", "Irak", "IQD"], ["IL", "Israël", "ILS"],
  ["JP", "Japon", "JPY"], ["JO", "Jordanie", "JOD"], ["KZ", "Kazakhstan", "KZT"],
  ["KW", "Koweït", "KWD"], ["KG", "Kirghizistan", "KGS"], ["LA", "Laos", "LAK"],
  ["LB", "Liban", "LBP"], ["MY", "Malaisie", "MYR"], ["MV", "Maldives", "MVR"],
  ["MN", "Mongolie", "MNT"], ["MM", "Myanmar", "MMK"], ["NP", "Népal", "NPR"],
  ["KP", "Corée du Nord", "KPW"], ["OM", "Oman", "OMR"], ["PK", "Pakistan", "PKR"],
  ["PS", "Palestine", "ILS"], ["PH", "Philippines", "PHP"], ["QA", "Qatar", "QAR"],
  ["SA", "Arabie saoudite", "SAR"], ["SG", "Singapour", "SGD"], ["KR", "Corée du Sud", "KRW"],
  ["LK", "Sri Lanka", "LKR"], ["SY", "Syrie", "SYP"], ["TW", "Taïwan", "TWD"],
  ["TJ", "Tadjikistan", "TJS"], ["TH", "Thaïlande", "THB"], ["TL", "Timor oriental", "USD"],
  ["TR", "Turquie", "TRY"], ["TM", "Turkménistan", "TMT"], ["AE", "Émirats arabes unis", "AED"],
  ["UZ", "Ouzbékistan", "UZS"], ["VN", "Vietnam", "VND"], ["YE", "Yémen", "YER"],

  // Europe
  ["AL", "Albanie", "ALL"], ["AD", "Andorre", "EUR"], ["AT", "Autriche", "EUR"],
  ["BY", "Biélorussie", "BYN"], ["BE", "Belgique", "EUR"], ["BA", "Bosnie-Herzégovine", "BAM"],
  ["BG", "Bulgarie", "BGN"], ["HR", "Croatie", "EUR"], ["CY", "Chypre", "EUR"],
  ["DK", "Danemark", "DKK"], ["EE", "Estonie", "EUR"], ["FI", "Finlande", "EUR"],
  ["FR", "France", "EUR"], ["DE", "Allemagne", "EUR"], ["GR", "Grèce", "EUR"],
  ["HU", "Hongrie", "HUF"], ["IS", "Islande", "ISK"], ["IE", "Irlande", "EUR"],
  ["IT", "Italie", "EUR"], ["XK", "Kosovo", "EUR"], ["LV", "Lettonie", "EUR"],
  ["LI", "Liechtenstein", "CHF"], ["LT", "Lituanie", "EUR"], ["LU", "Luxembourg", "EUR"],
  ["MT", "Malte", "EUR"], ["MD", "Moldavie", "MDL"], ["MC", "Monaco", "EUR"],
  ["ME", "Monténégro", "EUR"], ["NL", "Pays-Bas", "EUR"], ["MK", "Macédoine du Nord", "MKD"],
  ["NO", "Norvège", "NOK"], ["PL", "Pologne", "PLN"], ["PT", "Portugal", "EUR"],
  ["RO", "Roumanie", "RON"], ["RU", "Russie", "RUB"], ["SM", "Saint-Marin", "EUR"],
  ["RS", "Serbie", "RSD"], ["SK", "Slovaquie", "EUR"], ["SI", "Slovénie", "EUR"],
  ["ES", "Espagne", "EUR"], ["SE", "Suède", "SEK"], ["CH", "Suisse", "CHF"],
  ["UA", "Ukraine", "UAH"], ["GB", "Royaume-Uni", "GBP"], ["VA", "Vatican", "EUR"],

  // Océanie
  ["AU", "Australie", "AUD"], ["FJ", "Fidji", "FJD"], ["KI", "Kiribati", "AUD"],
  ["MH", "Îles Marshall", "USD"], ["FM", "Micronésie", "USD"], ["NR", "Nauru", "AUD"],
  ["NZ", "Nouvelle-Zélande", "NZD"], ["PW", "Palaos", "USD"], ["PG", "Papouasie-Nouvelle-Guinée", "PGK"],
  ["WS", "Samoa", "WST"], ["SB", "Îles Salomon", "SBD"], ["TO", "Tonga", "TOP"],
  ["TV", "Tuvalu", "AUD"], ["VU", "Vanuatu", "VUV"],
];

export const COUNTRIES = RAW_COUNTRIES
  .map(([code, name, currency]) => ({ code, name, currency, flag: codeToFlag(code) }))
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

export const POPULAR_COUNTRY_CODES = ["CI", "FR", "US", "NG", "GA", "CM", "SN", "GB"];
export const POPULAR_COUNTRIES = COUNTRIES.filter((c) => POPULAR_COUNTRY_CODES.includes(c.code));
