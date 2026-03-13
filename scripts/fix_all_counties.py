import csv
import json
import re
import os
import glob
from collections import defaultdict

# Official County Codes to Names
COUNTY_CODES = {
    '1': 'Mombasa', '2': 'Kwale', '3': 'Kilifi', '4': 'Tana River', '5': 'Lamu',
    '6': 'Taita Taveta', '7': 'Garissa', '8': 'Wajir', '9': 'Mandera', '10': 'Marsabit',
    '11': 'Isiolo', '12': 'Meru', '13': 'Tharaka-Nithi', '14': 'Embu', '15': 'Kitui',
    '16': 'Machakos', '17': 'Makueni', '18': 'Nyandarua', '19': 'Nyeri', '20': 'Kirinyaga',
    '21': "Murang'a", '22': 'Kiambu', '23': 'Turkana', '24': 'West Pokot', '25': 'Samburu',
    '26': 'Trans Nzoia', '27': 'Uasin Gishu', '28': 'Elgeyo/Marakwet', '29': 'Nandi', '30': 'Baringo',
    '31': 'Laikipia', '32': 'Nakuru', '33': 'Narok', '34': 'Kajiado', '35': 'Kericho',
    '36': 'Bomet', '37': 'Kakamega', '38': 'Vihiga', '39': 'Bungoma', '40': 'Busia',
    '41': 'Siaya', '42': 'Kisumu', '43': 'Homa Bay', '44': 'Migori', '45': 'Kisii',
    '46': 'Nyamira', '47': 'Nairobi'
}

def load_mapping():
    mapping = {} # (CountyName, WardNameNormalized) -> ConstituencyName
    if not os.path.exists('mapping.csv'):
        print("Error: mapping.csv not found!")
        return {}
        
    with open('mapping.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = row['County']
            const = row['Constituency_name']
            ward = row['Ward']
            if code in COUNTY_CODES and const and ward:
                county_name = COUNTY_CODES[code]
                mapping[(county_name, ward.lower().strip())] = const.strip().title()
    return mapping

def fix_sql_files(mapping):
    sql_files = glob.glob('insert_kenya_wards*.sql')
    total_fixes = 0
    
    for filename in sql_files:
        print(f"Processing {filename}...")
        changed = False
        new_lines = []
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                m = re.search(r"\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'", line)
                if m:
                    cid, county, old_const, ward = m.groups()
                    key = (county, ward.lower().strip())
                    if key in mapping:
                        new_const = mapping[key]
                        if new_const.lower() != old_const.lower() and old_const.lower() != 'id':
                            old_part = f"'{county}', '{old_const}', '{ward}'"
                            new_part = f"'{county}', '{new_const}', '{ward}'"
                            if old_part in line:
                                line = line.replace(old_part, new_part)
                                changed = True
                                total_fixes += 1
                new_lines.append(line)
        
        if changed:
            with open(filename, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print(f"  Updated {filename}")
            
    print(f"Total fixes applied: {total_fixes}")

def generate_update_script(mapping):
    grouped = defaultdict(list)
    for (county, ward), const in mapping.items():
        grouped[(county, const)].append(ward)
        
    with open('update_nationwide_wards.sql', 'w', encoding='utf-8') as f:
        f.write("-- Nationwide Script to fix ward-constituency mappings\n")
        f.write("-- Generated based on comprehensive CSV data\n\n")
        
        for (county, const), wards in sorted(grouped.items()):
            sq = "'"
            dsq = "''"
            # Get wards that are actually present in the user's data or just all wards?
            # We'll just generate for all.
            wards_str = ", ".join([f"'{w.title().replace(sq, dsq)}'" for w in sorted(wards)])
            sql = f"UPDATE kenya_wards SET constituency = '{const.replace(sq, dsq)}' WHERE county = '{county.replace(sq, dsq)}' AND ward IN ({wards_str});\n"
            f.write(sql)
    print("Generated update_nationwide_wards.sql")

if __name__ == "__main__":
    m = load_mapping()
    if m:
        fix_sql_files(m)
        generate_update_script(m)
