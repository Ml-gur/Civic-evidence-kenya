// generate_constituency_fix.ts
import fs from 'fs';
import { KENYA_DATA } from '../src/lib/kenyaData';

let sql = `-- Comprehensive script to fix constituency mappings in kenya_wards
-- Automatically generated based on the official KENYA_DATA configuration

`;

let updateCount = 0;

for (const county of KENYA_DATA) {
  for (const constituency of county.constituencies) {
    if (constituency.wards.length === 0) continue;

    // Formatting string replacements for SQL (escape single quotes)
    const formattedCounty = county.name.replace(/'/g, "''");
    const formattedConstituency = constituency.name.replace(/'/g, "''");
    
    const wardTerms = constituency.wards.map(w => `'${w.replace(/'/g, "''")}'`).join(', ');

    sql += `UPDATE kenya_wards \n`;
    sql += `SET constituency = '${formattedConstituency}' \n`;
    sql += `WHERE county = '${formattedCounty}' AND ward IN (${wardTerms});\n\n`;

    updateCount++;
  }
}

// Exception for Kajiado variations that exist in the DB but are typed slightly differently
sql += `-- Kajiado specialized variations mapped automatically
UPDATE kenya_wards 
SET constituency = 'Kajiado North' 
WHERE county = 'Kajiado' AND ward IN ('Ngong', 'Oloolua', 'Ongata Rongai', 'Nkaimoronya', 'Olkeri', 'Nkaimurunya');

UPDATE kenya_wards 
SET constituency = 'Kajiado West' 
WHERE county = 'Kajiado' AND ward IN ('Keekonyokie', 'North Keekonyokie', 'South Keekonyokie', 'Central Keekonyokie', 'Ewuaso Oonkidong''i', 'Magadi', 'Iloodokilani', 'Mosiro', 'Kiserian');

UPDATE kenya_wards 
SET constituency = 'Kajiado East' 
WHERE county = 'Kajiado' AND ward IN ('Kaputiei North', 'Kitengela', 'Oloosirkon/Sholinke', 'Kenyawa-Poka', 'Imaroro', 'Kenyawa Poka', 'Oloosirkon', 'Sholinke');

UPDATE kenya_wards 
SET constituency = 'Kajiado Central' 
WHERE county = 'Kajiado' AND ward IN ('Purko', 'Ildamat', 'Dalalekutuk', 'Matapato North', 'Matapato South');

UPDATE kenya_wards 
SET constituency = 'Kajiado South' 
WHERE county = 'Kajiado' AND ward IN ('Entonet/Lenkism', 'Imbirikani/Eselenkei', 'Kuku', 'Rombo', 'Kimana', 'Entonet', 'Lenkism', 'Imbirikani', 'Eselenkei');
`;

fs.writeFileSync('scripts/update_all_counties_constituencies.sql', sql);
console.log(`Successfully mapped ${updateCount} constituencies into update_all_counties_constituencies.sql`);
