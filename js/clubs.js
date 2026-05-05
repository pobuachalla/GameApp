'use strict';

// ─── MEATH GAA CLUB DIRECTORY ─────────────────────────────────────────────────
const MEATH_CLUBS = [
  {name:"Ballinabrackey",pitch:"Ballinabrackey GFC",crest:"crests/ballinabrackey.png"},
  {name:"Ballinlough",pitch:"Ballinlough, Kells, Co. Meath.",crest:"crests/ballinlough.png"},
  {name:"Ballivor",pitch:"Kinnegad Road, Ballivor, Co. Meath.",crest:"crests/ballivor.png"},
  {name:"Bective",pitch:"Cannistown, Navan, Co. Meath.",crest:"crests/bective.png"},
  {name:"Blackhall Gaels",pitch:"Batterstown, Co. Meath.",crest:"crests/blackhall_gaels.png"},
  {name:"Boardsmill",pitch:"Kilmurray, Trim, Co. Meath.",crest:"crests/boardsmill.png"},
  {name:"Carnaross",pitch:"Carnaross, Kells, Co. Meath.",crest:"crests/carnaross.jpg"},
  {name:"Castletown",pitch:"Knock, Castletown, Navan, Co. Meath.",crest:"crests/castletown.jpeg"},
  {name:"Clann na nGael",pitch:"O'Growney Park, Kells Road, Athboy, Co. Meath.",crest:"crests/clann_na_ngael.png"},
  {name:"Clonard",pitch:"Towlaght, Clonard, Co. Meath.",crest:"crests/clonard.png"},
  {name:"Cortown",pitch:"Páirc Naomh Baoithin, Cortown, Kells, Co. Meath.",crest:"crests/cortown.jpg"},
  {name:"Curraha",pitch:"Joe McDermott Park, Kilbrew, Ashbourne, Co. Meath.",crest:"crests/curraha.png"},
  {name:"Donaghmore / Ashbourne",pitch:"Killegland, Ashbourne, Co. Meath.",crest:"crests/donaghmore__ashbourne.png"},
  {name:"Drumbaragh Emmets",pitch:"Drumbaragh, Kells, Co. Meath.",crest:"crests/drumbaragh_emmets.png"},
  {name:"Drumconrath",pitch:"Birdhill, Drumconrath, Co. Meath.",crest:"crests/drumconrath.png"},
  {name:"Drumree",pitch:"Knockmark, Drumree, Co. Meath.",crest:"crests/drumree.png"},
  {name:"Duleek / Bellewstown",pitch:"Navan Road, Duleek, Co. Meath.",crest:"crests/duleek__bellewstown.jpg"},
  {name:"Dunderry",pitch:"Dunderry, Navan, Co. Meath.",crest:"crests/dunderry.png"},
  {name:"Dunsany",pitch:"Páirc na nGael, Dunsany, Co. Meath.",crest:"crests/dunsany.png"},
  {name:"Dunshaughlin",pitch:"Drumree Road, Dunshaughlin, Co. Meath.",crest:"crests/dunshaughlin.png"},
  {name:"Eastern Gaels",pitch:"Eastern Gaels GFC",crest:"crests/eastern_gaels.jpg"},
  {name:"Gaeil Colmcille",pitch:"Gardenrath Road, Kells, Co. Meath.",crest:"crests/gaeil_colmcille.png"},
  {name:"Kilbride",pitch:"Priestown, Kilbride, Co. Meath.",crest:"crests/kilbride.png"},
  {name:"Kildalkey",pitch:"Cloneylogan, Kildalkey, Co. Meath.",crest:"crests/kildalkey.png"},
  {name:"Killyon",pitch:"Killyon, Longwood, Co. Meath.",crest:"crests/killyon.png"},
  {name:"Kilmainham",pitch:"Kilmainham, Kells, Co. Meath.",crest:"crests/kilmainham.png"},
  {name:"Kilmainhamwood",pitch:"Kilmainhamwood, Kells, Co. Meath.",crest:"crests/kilmainhamwood.jpeg"},
  {name:"Kilmessan",pitch:"Ringlestown, Kilmessan, Co. Meath.",crest:"crests/kilmessan.png"},
  {name:"Kilskyre",pitch:"Kilskyre, Kells, Co. Meath.",crest:"crests/kilskyre.jpg"},
  {name:"Kiltale",pitch:"Kiltale Hurling Club",crest:"crests/kiltale.png"},
  {name:"Longwood",pitch:"Longwood, Co. Meath.",crest:"crests/longwood.png"},
  {name:"Meath Hill",pitch:"Meath Hill GFC",crest:"crests/meath_hill.jpeg"},
  {name:"Moylagh",pitch:"Moylagh, Co. Meath.",crest:"crests/moylagh.png"},
  {name:"Moynalty",pitch:"Moynalty GFC",crest:"crests/moynalty.png"},
  {name:"Moynalvey",pitch:"Moynalvey GFC",crest:"crests/moynalvey.jpg"},
  {name:"Na Fianna",pitch:"Na Fianna, Enfield, Co. Meath.",crest:"crests/na_fianna.png"},
  {name:"Nobber",pitch:"Nobber GFC",crest:"crests/nobber.png"},
  {name:"O’Mahony’s",pitch:"",crest:"crests/omahonys.png"},
  {name:"Oldcastle",pitch:"Oldcastle GFC",crest:"crests/oldcastle.png"},
  {name:"Rathkenny",pitch:"Rathkenny GFC",crest:"crests/rathkenny.png"},
  {name:"Rathmolyon",pitch:"Rathmolyon, Co. Meath.",crest:"crests/rathmolyon.jpg"},
  {name:"Ratoath",pitch:"Ratoath, Co. Meath.",crest:"crests/ratoath.png"},
  {name:"Seneschalstown",pitch:"Seneschalstown GFC",crest:"crests/seneschalstown.png"},
  {name:"Simonstown Gaels",pitch:"Simonstown Gaels GFC",crest:"crests/simonstown_gaels.png"},
  {name:"Skryne",pitch:"Skryne GFC",crest:"crests/skryne.png"},
  {name:"Slane",pitch:"Slane GFC",crest:"crests/slane.jpg"},
  {name:"St. Brigid’s",pitch:"",crest:"crests/st_brigids.jpg"},
  {name:"St. Colmcille’s",pitch:"",crest:"crests/st_colmcilles.png"},
  {name:"St. Mary’s",pitch:"",crest:"crests/st_marys.png"},
  {name:"St. Michael’s",pitch:"",crest:"crests/st_michaels.png"},
  {name:"St. Patrick’s",pitch:"",crest:"crests/st_patricks.jpg"},
  {name:"St. Paul’s",pitch:"",crest:"crests/st_pauls.png"},
  {name:"St. Peter’s Dunboyne",pitch:"Dunboyne, Co. Meath.",crest:"crests/st_peters_dunboyne.png"},
  {name:"St. Ultan’s",pitch:"",crest:"crests/st_ultans.png"},
  {name:"St. Vincent’s",pitch:"",crest:"crests/st_vincents.png"},
  {name:"Summerhill",pitch:"Clonmahon, Summerhill, Co. Meath.",crest:"crests/summerhill.jpg"},
  {name:"Syddan",pitch:"Lobinstown, Co. Meath.",crest:"crests/syddan.png"},
  {name:"Trim",pitch:"St. Loman's Park, Newhaggard Road, Trim, Co. Meath.",crest:"crests/trim.png"},
  {name:"Walterstown",pitch:"Oldtown, Garlow Cross, Navan, Co. Meath.",crest:"crests/walterstown.jpg"},
  {name:"Wolfe Tones",pitch:"Kilberry, Navan, Co. Meath.",crest:"crests/wolfe_tones.png"},
];

// ─── COUNTY CRESTS ────────────────────────────────────────────────────────────
const COUNTIES = [
  'Antrim','Armagh','Carlow','Cavan','Clare','Cork','Derry','Donegal','Down',
  'Dublin','Fermanagh','Galway','Kerry','Kildare','Kilkenny','Laois','Leitrim',
  'Limerick','Longford','Louth','Mayo','Meath','Monaghan','Offaly','Roscommon',
  'Sligo','Tipperary','Tyrone','Waterford','Westmeath','Wexford','Wicklow',
];

function findCountyCrest(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  const county = COUNTIES.find(c => n.includes(c.toLowerCase()));
  return county ? 'crests/' + county.toLowerCase() + '.png' : null;
}

function findClub(name) {
  if (!name) return null;
  const norm = s => s.toLowerCase().replace(/\s*[/–-]\s*/g, '/').replace(/['''.]/g, '').replace(/\s+/g, ' ').trim();
  const n = norm(name);
  const exact = MEATH_CLUBS.find(c => norm(c.name) === n);
  if (exact) return exact;
  return MEATH_CLUBS.find(c => n.includes(norm(c.name))) || null;
}
