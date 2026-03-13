import re
import glob
from collections import defaultdict

# 1. Parse valid counties and constituencies from kenyaLeaders.ts
valid_counties = {}
with open('c:/Users/samka/Downloads/civic-evidence-kenya/src/lib/kenyaLeaders.ts', 'r', encoding='utf-8') as f:
    data = f.read()

count_blocks = re.split(r'county:\s*"([^"]+)"', data)
for i in range(1, len(count_blocks), 2):
    county = count_blocks[i]
    # find all constituencies in this block
    constituencies = [m.group(1) for m in re.finditer(r'name:\s*"([^"]+)"', count_blocks[i+1])]
    valid_counties[county] = set(constituencies)

# 2. Parse all wards from SQL files
sql_data = defaultdict(list)
for f in glob.glob('c:/Users/samka/Downloads/civic-evidence-kenya/scripts/insert_kenya_wards*.sql'):
    with open(f, 'r', encoding='utf-8') as fp:
        for line in fp:
            m = re.search(r"\('[^']*',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'", line)
            if m:
                # county, constituency, ward
                sql_data[m.group(1)].append((m.group(2).split("',")[0], m.group(3).split("',")[0]))

# 3. Find mismatches
mismatches = defaultdict(list)
for county, wards in sql_data.items():
    if county in valid_counties:
        valid_consts = valid_counties[county]
        for const_sq, ward in wards:
            if const_sq not in valid_consts and const_sq != 'null':
                mismatches[county].append((const_sq, ward))

# 4. Print results
total_mismatches = 0
for county, items in mismatches.items():
    print(f"--- {county} Mismatches ---")
    
    # group by invalid constituency
    invalid_groups = defaultdict(list)
    for c, w in items:
        invalid_groups[c].append(w)
        
    for invalid_c, wards in invalid_groups.items():
        print(f"Invalid Constituency: '{invalid_c}'")
        print(f"  Wards: {', '.join(set(wards))}")
        total_mismatches += len(set(wards))
    print()

if total_mismatches == 0:
    print("All counties match correctly!")
else:
    print(f"Total invalid ward entries found: {total_mismatches}")
