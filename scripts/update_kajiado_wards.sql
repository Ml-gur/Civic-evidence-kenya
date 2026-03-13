-- Update script to fix Kajiado constituency mappings in the Supabase database
-- This ensures that reverse geocoding returns the correct constituency instead of ward/division names
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
