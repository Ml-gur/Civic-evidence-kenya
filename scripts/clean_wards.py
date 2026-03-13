import os
import glob

kajiado_ward_to_constituency = {
    # Kajiado North
    "Ngong": "Kajiado North",
    "Oloolua": "Kajiado North",
    "Ongata Rongai": "Kajiado North",
    "Nkaimoronya": "Kajiado North",
    "Olkeri": "Kajiado North",
    "Nkaimurunya": "Kajiado North",

    # Kajiado West
    "Keekonyokie": "Kajiado West",
    "North Keekonyokie": "Kajiado West",
    "South Keekonyokie": "Kajiado West",
    "Central Keekonyokie": "Kajiado West",
    "Ewuaso Oonkidong'i": "Kajiado West",
    "Magadi": "Kajiado West",
    "Iloodokilani": "Kajiado West",
    "Mosiro": "Kajiado West",
    "Kiserian": "Kajiado West", 

    # Kajiado East
    "Kaputiei North": "Kajiado East",
    "Kitengela": "Kajiado East",
    "Oloosirkon/Sholinke": "Kajiado East",
    "Kenyawa-Poka": "Kajiado East",
    "Imaroro": "Kajiado East",
    "Kenyawa Poka": "Kajiado East",
    "Oloosirkon": "Kajiado East",
    "Sholinke": "Kajiado East",

    # Kajiado Central
    "Purko": "Kajiado Central",
    "Ildamat": "Kajiado Central",
    "Dalalekutuk": "Kajiado Central",
    "Matapato North": "Kajiado Central",
    "Matapato South": "Kajiado Central",

    # Kajiado South
    "Entonet/Lenkism": "Kajiado South",
    "Imbirikani/Eselenkei": "Kajiado South",
    "Kuku": "Kajiado South",
    "Rombo": "Kajiado South",
    "Kimana": "Kajiado South",
    "Entonet": "Kajiado South",
    "Lenkism": "Kajiado South",
    "Imbirikani": "Kajiado South",
    "Eselenkei": "Kajiado South"
}

def clean_sql_file(filename):
    print(f"Cleaning {filename}...")
    temp_file = filename + ".tmp"
    changes_made = 0
    with open(filename, 'r', encoding='utf-8') as f_in, open(temp_file, 'w', encoding='utf-8') as f_out:
        for line in f_in:
            if "'Kajiado'" in line:
                parts = line.split("', '")
                if len(parts) >= 4:
                    county = parts[1]
                    old_const = parts[2]
                    ward = parts[3].split("',")[0]
                    
                    if county == 'Kajiado':
                        new_const = kajiado_ward_to_constituency.get(ward, old_const)
                        if new_const != old_const:
                            old_str = f"', '{old_const}', '{ward}'"
                            new_str = f"', '{new_const}', '{ward}'"
                            if old_str in line:
                                line = line.replace(old_str, new_str)
                                changes_made += 1
                                print(f"  Fixed: Ward '{ward}' from '{old_const}' to '{new_const}'")
            f_out.write(line)
    
    if changes_made > 0:
        os.replace(temp_file, filename)
        print(f"File {filename} updated with {changes_made} changes.\n")
    else:
        os.remove(temp_file)
        print(f"File {filename} unchanged.\n")

files_to_process = glob.glob('insert_kenya_wards*.sql')
for file in files_to_process:
    clean_sql_file(file)

print("Done cleaning!")
