const fs = require('fs');
const path = require('path');

// Input and Output files
const geojsonFile = path.join(__dirname, '../rgeo/rgeocode/geojson/ke.level4.json');
const outputFile = path.join(__dirname, 'insert_kenya_wards.sql');

console.log('Reading GeoJSON...');
const data = JSON.parse(fs.readFileSync(geojsonFile, 'utf8'));

console.log(`Found ${data.features.length} features. Generating SQL...`);

const CHUNK_SIZE = 100;
const FEATURES_PER_FILE = 250;
let fileIndex = 1;
let currentFeatureCount = 0;
let sql = `-- Generated SQL to insert Kenya Wards manually - Part ${fileIndex}\n\n`;

for (let i = 0; i < data.features.length; i += CHUNK_SIZE) {
    const chunk = data.features.slice(i, i + CHUNK_SIZE);

    sql += 'INSERT INTO public.kenya_wards (id, county, constituency, ward, geom) VALUES\n';

    const values = chunk.map((f, index) => {
        const baseId = f.properties.id4 || `ward_${Date.now()}`;
        const id = `${baseId}_${fileIndex}_${index}`;
        const county = (f.properties.level2 || '').replace(/'/g, "''");
        const constituency = (f.properties.level3 || '').replace(/'/g, "''");
        const ward = (f.properties.level4 || '').replace(/'/g, "''");
        const geomStr = JSON.stringify(f.geometry);
        return `('${id}', '${county}', '${constituency}', '${ward}', ST_GeomFromGeoJSON('${geomStr}'))`;
    });

    sql += values.join(',\n') + ';\n\n';
    currentFeatureCount += chunk.length;

    if (currentFeatureCount >= FEATURES_PER_FILE || i + CHUNK_SIZE >= data.features.length) {
        const outPath = path.join(__dirname, `insert_kenya_wards_part${fileIndex}.sql`);
        fs.writeFileSync(outPath, sql, 'utf8');
        console.log(`Generated Part ${fileIndex}: ${outPath}`);

        fileIndex++;
        currentFeatureCount = 0;
        sql = `-- Generated SQL to insert Kenya Wards manually - Part ${fileIndex}\n\n`;
    }
}
console.log('You can now copy the contents of these split files and run them one by one in the Supabase SQL Editor.');
