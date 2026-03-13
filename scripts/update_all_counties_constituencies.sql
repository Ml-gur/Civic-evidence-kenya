-- Comprehensive script to fix constituency mappings in kenya_wards
-- Automatically generated based on the official KENYA_DATA configuration

UPDATE kenya_wards 
SET constituency = 'Changamwe' 
WHERE county = 'Mombasa' AND ward IN ('Port Reitz', 'Kipevu', 'Airport', 'Changamwe', 'Chaani');

UPDATE kenya_wards 
SET constituency = 'Jomvu' 
WHERE county = 'Mombasa' AND ward IN ('Jomvu Kuu', 'Miritini', 'Mikindani');

UPDATE kenya_wards 
SET constituency = 'Kisauni' 
WHERE county = 'Mombasa' AND ward IN ('Mjambere', 'Junda', 'Bamburi', 'Mwakirunge', 'Mtopanga', 'Magogoni', 'Shanzu');

UPDATE kenya_wards 
SET constituency = 'Nyali' 
WHERE county = 'Mombasa' AND ward IN ('Frere Town', 'Ziwa La Ng''ombe', 'Mkomani', 'Kongowea', 'Kadzandani');

UPDATE kenya_wards 
SET constituency = 'Likoni' 
WHERE county = 'Mombasa' AND ward IN ('Mtongwe', 'Shika Adabu', 'Bofu', 'Likoni', 'Timbwani');

UPDATE kenya_wards 
SET constituency = 'Mvita' 
WHERE county = 'Mombasa' AND ward IN ('Mji Wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo');

UPDATE kenya_wards 
SET constituency = 'Msambweni' 
WHERE county = 'Kwale' AND ward IN ('Gombatobongwe', 'Ukunda', 'Kinondo', 'Ramisi');

UPDATE kenya_wards 
SET constituency = 'Lungalunga' 
WHERE county = 'Kwale' AND ward IN ('Pongwekikoneni', 'Dzombo', 'Mwereni', 'Vanga');

UPDATE kenya_wards 
SET constituency = 'Matuga' 
WHERE county = 'Kwale' AND ward IN ('Tsimba Golini', 'Waa', 'Tiwi', 'Kubo South', 'Mkongani');

UPDATE kenya_wards 
SET constituency = 'Kinango' 
WHERE county = 'Kwale' AND ward IN ('Nadavaya', 'Puma', 'Kinango', 'Mackinnon-Road', 'Chengoni/Samburu', 'Mwavumbo', 'Kasemeni');

UPDATE kenya_wards 
SET constituency = 'Kilifi North' 
WHERE county = 'Kilifi' AND ward IN ('Tezo', 'Sokoni', 'Kibarani', 'Dabaso', 'Matsangoni', 'Watamu', 'Mnarani');

UPDATE kenya_wards 
SET constituency = 'Kilifi South' 
WHERE county = 'Kilifi' AND ward IN ('Junju', 'Mwarakaya', 'Shimo La Tewa', 'Chasimba', 'Mtepeni');

UPDATE kenya_wards 
SET constituency = 'Kaloleni' 
WHERE county = 'Kilifi' AND ward IN ('Mariakani', 'Kayafungo', 'Kaloleni', 'Mwanamwinga');

UPDATE kenya_wards 
SET constituency = 'Rabai' 
WHERE county = 'Kilifi' AND ward IN ('Mwawesa', 'Ruruma', 'Kambe/Ribe', 'Rabai/Kisurutini');

UPDATE kenya_wards 
SET constituency = 'Ganze' 
WHERE county = 'Kilifi' AND ward IN ('Ganze', 'Bamba', 'Jaribuni', 'Sokoke');

UPDATE kenya_wards 
SET constituency = 'Malindi' 
WHERE county = 'Kilifi' AND ward IN ('Jilore', 'Kakuyuni', 'Ganda', 'Malindi Town', 'Shella');

UPDATE kenya_wards 
SET constituency = 'Magarini' 
WHERE county = 'Kilifi' AND ward IN ('Marafa', 'Magarini', 'Gongoni', 'Adu', 'Garashi', 'Sabaki');

UPDATE kenya_wards 
SET constituency = 'Garsen' 
WHERE county = 'Tana River' AND ward IN ('Kipini East', 'Garsen South', 'Kipini West', 'Garsen Central', 'Garsen West', 'Garsen North');

UPDATE kenya_wards 
SET constituency = 'Galole' 
WHERE county = 'Tana River' AND ward IN ('Kinakomba', 'Mikinduni', 'Chewani', 'Wayu');

UPDATE kenya_wards 
SET constituency = 'Bura' 
WHERE county = 'Tana River' AND ward IN ('Chewele', 'Bura', 'Bangale', 'Sala', 'Madogo');

UPDATE kenya_wards 
SET constituency = 'Lamu East' 
WHERE county = 'Lamu' AND ward IN ('Faza', 'Kiunga', 'Basuba');

UPDATE kenya_wards 
SET constituency = 'Lamu West' 
WHERE county = 'Lamu' AND ward IN ('Shella', 'Mkomani', 'Hindi', 'Mkunumbi', 'Hongwe', 'Witu', 'Bahari');

UPDATE kenya_wards 
SET constituency = 'Taveta' 
WHERE county = 'Taita Taveta' AND ward IN ('Chala', 'Mahoo', 'Bomeni', 'Mboghoni', 'Mata');

UPDATE kenya_wards 
SET constituency = 'Wundanyi' 
WHERE county = 'Taita Taveta' AND ward IN ('Wundanyi/Mbale', 'Werugha', 'Wumingu/Kishushe', 'Mwanda/Mgange');

UPDATE kenya_wards 
SET constituency = 'Mwatate' 
WHERE county = 'Taita Taveta' AND ward IN ('Rong''e', 'Mwatate', 'Bura', 'Chawia', 'Wusi/Kishamba');

UPDATE kenya_wards 
SET constituency = 'Voi' 
WHERE county = 'Taita Taveta' AND ward IN ('Mbololo', 'Sagalla', 'Kaloleni', 'Marungu', 'Kasigau', 'Ngolia');

UPDATE kenya_wards 
SET constituency = 'Garissa Township' 
WHERE county = 'Garissa' AND ward IN ('Waberi', 'Galbet', 'Township', 'Iftin');

UPDATE kenya_wards 
SET constituency = 'Balambala' 
WHERE county = 'Garissa' AND ward IN ('Balambala', 'Danyere', 'Jara Jara', 'Saka', 'Sankuri');

UPDATE kenya_wards 
SET constituency = 'Lagdera' 
WHERE county = 'Garissa' AND ward IN ('Modogashe', 'Benane', 'Goreale', 'Maalimin', 'Sabena', 'Baraki');

UPDATE kenya_wards 
SET constituency = 'Dadaab' 
WHERE county = 'Garissa' AND ward IN ('Dertu', 'Dadaab', 'Labasigale', 'Damajale', 'Liboi', 'Abakaile');

UPDATE kenya_wards 
SET constituency = 'Fafi' 
WHERE county = 'Garissa' AND ward IN ('Bura', 'Dekaharia', 'Jarajila', 'Fafi', 'Nanighi');

UPDATE kenya_wards 
SET constituency = 'Ijara' 
WHERE county = 'Garissa' AND ward IN ('Hulugho', 'Sangailu', 'Ijara', 'Masalani');

UPDATE kenya_wards 
SET constituency = 'Wajir North' 
WHERE county = 'Wajir' AND ward IN ('Gurar', 'Bute', 'Korondile', 'Malkagufu', 'Batalu', 'Danaba', 'Godoma');

UPDATE kenya_wards 
SET constituency = 'Wajir East' 
WHERE county = 'Wajir' AND ward IN ('Wagberi', 'Township', 'Barwago', 'Khorof/Harar');

UPDATE kenya_wards 
SET constituency = 'Tarbaj' 
WHERE county = 'Wajir' AND ward IN ('Elben', 'Sarman', 'Tarbaj', 'Wargadud');

UPDATE kenya_wards 
SET constituency = 'Wajir West' 
WHERE county = 'Wajir' AND ward IN ('Arbajahan', 'Hadado/Athibohol', 'Ademasajide', 'Wagalla/Ganyure');

UPDATE kenya_wards 
SET constituency = 'Eldas' 
WHERE county = 'Wajir' AND ward IN ('Eldas', 'Della', 'Lakoley South/Basir', 'Elnur/Tula Tula');

UPDATE kenya_wards 
SET constituency = 'Wajir South' 
WHERE county = 'Wajir' AND ward IN ('Benane', 'Burder', 'Dadaja Bulla', 'Habasswein', 'Lagboghol South', 'Ibrahim Ure', 'Diif');

UPDATE kenya_wards 
SET constituency = 'Mandera West' 
WHERE county = 'Mandera' AND ward IN ('Takaba South', 'Takaba', 'Lag Sure', 'Dandu', 'Gither');

UPDATE kenya_wards 
SET constituency = 'Banissa' 
WHERE county = 'Mandera' AND ward IN ('Banissa', 'Derkhale', 'Guba', 'Malkamari', 'Kiliwehiri');

UPDATE kenya_wards 
SET constituency = 'Mandera North' 
WHERE county = 'Mandera' AND ward IN ('Ashabito', 'Guticha', 'Morothile', 'Rhamu', 'Rhamu-Dimtu');

UPDATE kenya_wards 
SET constituency = 'Mandera South' 
WHERE county = 'Mandera' AND ward IN ('Wargudud', 'Kutulo', 'Elwak South', 'Elwak North', 'Shimbir Fatuma');

UPDATE kenya_wards 
SET constituency = 'Mandera East' 
WHERE county = 'Mandera' AND ward IN ('Arabia', 'Bulla Mpya', 'Khalalio', 'Neboi', 'Township');

UPDATE kenya_wards 
SET constituency = 'Lafey' 
WHERE county = 'Mandera' AND ward IN ('Libehia', 'Fino', 'Lafey', 'Warankara', 'Alungo Gof');

UPDATE kenya_wards 
SET constituency = 'Moyale' 
WHERE county = 'Marsabit' AND ward IN ('Butiye', 'Sololo', 'Heilu-Manyatta', 'Golbo', 'Moyale Township', 'Uran', 'Obbu');

UPDATE kenya_wards 
SET constituency = 'North Horr' 
WHERE county = 'Marsabit' AND ward IN ('Illeret', 'North Horr', 'Dukana', 'Maikona', 'Turbi');

UPDATE kenya_wards 
SET constituency = 'Saku' 
WHERE county = 'Marsabit' AND ward IN ('Sagante/Jaldesa', 'Karare', 'Marsabit Central');

UPDATE kenya_wards 
SET constituency = 'Laisamis' 
WHERE county = 'Marsabit' AND ward IN ('Loiyangalani', 'Kargi/South Horr', 'Korr/Ngurunit', 'Log Logo', 'Laisamis');

UPDATE kenya_wards 
SET constituency = 'Isiolo North' 
WHERE county = 'Isiolo' AND ward IN ('Wabera', 'Bulla Pesa', 'Chari', 'Cherab', 'Ngare Mara', 'Burat', 'Oldonyiro');

UPDATE kenya_wards 
SET constituency = 'Isiolo South' 
WHERE county = 'Isiolo' AND ward IN ('Garbatulla', 'Kinna', 'Sericho');

UPDATE kenya_wards 
SET constituency = 'Igembe South' 
WHERE county = 'Meru' AND ward IN ('Maua', 'Kiegoi/Antubochiu', 'Athiru Gaiti', 'Akachiu', 'Kanuni');

UPDATE kenya_wards 
SET constituency = 'Igembe Central' 
WHERE county = 'Meru' AND ward IN ('Akirang''ondu', 'Athiru Ruujine', 'Igembe East', 'Njia', 'Kangeta');

UPDATE kenya_wards 
SET constituency = 'Igembe North' 
WHERE county = 'Meru' AND ward IN ('Antuambui', 'Ntunene', 'Antubetwe Kiongo', 'Naathu', 'Amwathi');

UPDATE kenya_wards 
SET constituency = 'Tigania West' 
WHERE county = 'Meru' AND ward IN ('Athwana', 'Akithii', 'Kianjai', 'Nkomo', 'Mbeu');

UPDATE kenya_wards 
SET constituency = 'Tigania East' 
WHERE county = 'Meru' AND ward IN ('Thangatha', 'Mikinduri', 'Kiguchwa', 'Muthara', 'Karama');

UPDATE kenya_wards 
SET constituency = 'North Imenti' 
WHERE county = 'Meru' AND ward IN ('Municipality', 'Ntima East', 'Ntima West', 'Nyaki West', 'Nyaki East');

UPDATE kenya_wards 
SET constituency = 'Buuri' 
WHERE county = 'Meru' AND ward IN ('Timau', 'Kisima', 'Kiirua/Naari', 'Ruiri/Rwarera', 'Kibirichia');

UPDATE kenya_wards 
SET constituency = 'Central Imenti' 
WHERE county = 'Meru' AND ward IN ('Mwanganthia', 'Abothuguchi Central', 'Abothuguchi West', 'Kiagu');

UPDATE kenya_wards 
SET constituency = 'South Imenti' 
WHERE county = 'Meru' AND ward IN ('Mitunguu', 'Igoji East', 'Igoji West', 'Abogeta East', 'Abogeta West', 'Nkuene');

UPDATE kenya_wards 
SET constituency = 'Maara' 
WHERE county = 'Tharaka-Nithi' AND ward IN ('Mitheru', 'Muthambi', 'Mwimbi', 'Ganga', 'Chogoria');

UPDATE kenya_wards 
SET constituency = 'Chuka/Igambang''om' 
WHERE county = 'Tharaka-Nithi' AND ward IN ('Mariani', 'Karingani', 'Magumoni', 'Mugwe', 'Igambang''ombe');

UPDATE kenya_wards 
SET constituency = 'Tharaka' 
WHERE county = 'Tharaka-Nithi' AND ward IN ('Gatunga', 'Mukothima', 'Nkondi', 'Chiakariga', 'Marimanti');

UPDATE kenya_wards 
SET constituency = 'Manyatta' 
WHERE county = 'Embu' AND ward IN ('Ruguru/Ngandori', 'Kithimu', 'Nginda', 'Mbeti North', 'Kirimari', 'Gaturi South');

UPDATE kenya_wards 
SET constituency = 'Runyenjes' 
WHERE county = 'Embu' AND ward IN ('Gaturi North', 'Kagaari South', 'Central  Ward', 'Kagaari North', 'Kyeni North', 'Kyeni South');

UPDATE kenya_wards 
SET constituency = 'Mbeere South' 
WHERE county = 'Embu' AND ward IN ('Mwea', 'Makima', 'Mbeti South', 'Mavuria', 'Kiambere');

UPDATE kenya_wards 
SET constituency = 'Mbeere North' 
WHERE county = 'Embu' AND ward IN ('Nthawa', 'Muminji', 'Evurore');

UPDATE kenya_wards 
SET constituency = 'Mwingi North' 
WHERE county = 'Kitui' AND ward IN ('Ngomeni', 'Kyuso', 'Mumoni', 'Tseikuru', 'Tharaka');

UPDATE kenya_wards 
SET constituency = 'Mwingi West' 
WHERE county = 'Kitui' AND ward IN ('Kyome/Thaana', 'Nguutani', 'Migwani', 'Kiomo/Kyethani');

UPDATE kenya_wards 
SET constituency = 'Mwingi Central' 
WHERE county = 'Kitui' AND ward IN ('Central', 'Kivou', 'Nguni', 'Nuu', 'Mui', 'Waita');

UPDATE kenya_wards 
SET constituency = 'Kitui West' 
WHERE county = 'Kitui' AND ward IN ('Mutonguni', 'Kauwi', 'Matinyani', 'Kwa Mutonga/Kithumula');

UPDATE kenya_wards 
SET constituency = 'Kitui Rural' 
WHERE county = 'Kitui' AND ward IN ('Kisasi', 'Mbitini', 'Kwavonza/Yatta', 'Kanyangi');

UPDATE kenya_wards 
SET constituency = 'Kitui Central' 
WHERE county = 'Kitui' AND ward IN ('Miambani', 'Township', 'Kyangwithya West', 'Mulango', 'Kyangwithya East');

UPDATE kenya_wards 
SET constituency = 'Kitui East' 
WHERE county = 'Kitui' AND ward IN ('Zombe/Mwitika', 'Chuluni', 'Nzambani', 'Voo/Kyamatu', 'Endau/Malalani', 'Mutito/Kaliku');

UPDATE kenya_wards 
SET constituency = 'Kitui South' 
WHERE county = 'Kitui' AND ward IN ('Ikanga/Kyatune', 'Mutomo', 'Mutha', 'Ikutha', 'Kanziko', 'Athi');

UPDATE kenya_wards 
SET constituency = 'Masinga' 
WHERE county = 'Machakos' AND ward IN ('Kivaa', 'Masinga Central', 'Ekalakala', 'Muthesya', 'Ndithini');

UPDATE kenya_wards 
SET constituency = 'Yatta' 
WHERE county = 'Machakos' AND ward IN ('Ndalani', 'Matuu', 'Kithimani', 'Ikombe', 'Katangi');

UPDATE kenya_wards 
SET constituency = 'Kangundo' 
WHERE county = 'Machakos' AND ward IN ('Kangundo North', 'Kangundo Central', 'Kangundo East', 'Kangundo West');

UPDATE kenya_wards 
SET constituency = 'Matungulu' 
WHERE county = 'Machakos' AND ward IN ('Tala', 'Matungulu North', 'Matungulu East', 'Matungulu West', 'Kyeleni');

UPDATE kenya_wards 
SET constituency = 'Kathiani' 
WHERE county = 'Machakos' AND ward IN ('Mitaboni', 'Kathiani Central', 'Upper Kaewa/Iveti', 'Lower Kaewa/Kaani');

UPDATE kenya_wards 
SET constituency = 'Mavoko' 
WHERE county = 'Machakos' AND ward IN ('Athi River', 'Kinanie', 'Muthwani', 'Syokimau/Mulolongo');

UPDATE kenya_wards 
SET constituency = 'Machakos Town' 
WHERE county = 'Machakos' AND ward IN ('Kalama', 'Mua', 'Mutituni', 'Machakos Central', 'Mumbuni North', 'Muvuti/Kiima-Kimwe', 'Kola');

UPDATE kenya_wards 
SET constituency = 'Mwala' 
WHERE county = 'Machakos' AND ward IN ('Mbiuni', 'Makutano/ Mwala', 'Masii', 'Muthetheni', 'Wamunyu', 'Kibauni');

UPDATE kenya_wards 
SET constituency = 'Mbooni' 
WHERE county = 'Makueni' AND ward IN ('Tulimani', 'Mbooni', 'Kithungo/Kitundu', 'Kisau/Kiteta', 'Waia/Kako', 'Kalawa');

UPDATE kenya_wards 
SET constituency = 'Kilome' 
WHERE county = 'Makueni' AND ward IN ('Kasikeu', 'Mukaa', 'Kiima Kiu/Kalanzoni');

UPDATE kenya_wards 
SET constituency = 'Kaiti' 
WHERE county = 'Makueni' AND ward IN ('Ukia', 'Kee', 'Kilungu', 'Ilima');

UPDATE kenya_wards 
SET constituency = 'Makueni' 
WHERE county = 'Makueni' AND ward IN ('Wote', 'Muvau/Kikuumini', 'Mavindini', 'Kitise/Kithuki', 'Kathonzweni', 'Nzaui/Kilili/Kalamba', 'Mbitini');

UPDATE kenya_wards 
SET constituency = 'Kibwezi West' 
WHERE county = 'Makueni' AND ward IN ('Makindu', 'Nguumo', 'Kikumbulyu North', 'Kikumbulyu South', 'Nguu/Masumba', 'Emali/Mulala');

UPDATE kenya_wards 
SET constituency = 'Kibwezi East' 
WHERE county = 'Makueni' AND ward IN ('Masongaleni', 'Mtito Andei', 'Thange', 'Ivingoni/Nzambani');

UPDATE kenya_wards 
SET constituency = 'Kinangop' 
WHERE county = 'Nyandarua' AND ward IN ('Engineer', 'Gathara', 'North Kinangop', 'Murungaru', 'Njabini\Kiburu', 'Nyakio', 'Githabai', 'Magumu');

UPDATE kenya_wards 
SET constituency = 'Kipipiri' 
WHERE county = 'Nyandarua' AND ward IN ('Wanjohi', 'Kipipiri', 'Geta', 'Githioro');

UPDATE kenya_wards 
SET constituency = 'Ol Kalou' 
WHERE county = 'Nyandarua' AND ward IN ('Karau', 'Kanjuiri Ridge', 'Mirangine', 'Kaimbaga', 'Rurii');

UPDATE kenya_wards 
SET constituency = 'Ol Jorok' 
WHERE county = 'Nyandarua' AND ward IN ('Gathanji', 'Gatimu', 'Weru', 'Charagita');

UPDATE kenya_wards 
SET constituency = 'Ndaragwa' 
WHERE county = 'Nyandarua' AND ward IN ('Leshau Pondo', 'Kiriita', 'Central', 'Shamata');

UPDATE kenya_wards 
SET constituency = 'Tetu' 
WHERE county = 'Nyeri' AND ward IN ('Dedan Kimanthi', 'Wamagana', 'Aguthi/Gaaki');

UPDATE kenya_wards 
SET constituency = 'Kieni' 
WHERE county = 'Nyeri' AND ward IN ('Mweiga', 'Naromoru Kiamathaga', 'Mwiyogo/Endarasha', 'Mugunda', 'Gatarakwa', 'Thegu River', 'Kabaru', 'Gakawa');

UPDATE kenya_wards 
SET constituency = 'Mathira' 
WHERE county = 'Nyeri' AND ward IN ('Ruguru', 'Magutu', 'Iriaini', 'Konyu', 'Kirimukuyu', 'Karatina Town');

UPDATE kenya_wards 
SET constituency = 'Othaya' 
WHERE county = 'Nyeri' AND ward IN ('Mahiga', 'Iria-Ini', 'Chinga', 'Karima');

UPDATE kenya_wards 
SET constituency = 'Mukurweini' 
WHERE county = 'Nyeri' AND ward IN ('Gikondi', 'Rugi', 'Mukurwe-Ini West', 'Mukurwe-Ini Central');

UPDATE kenya_wards 
SET constituency = 'Nyeri Town' 
WHERE county = 'Nyeri' AND ward IN ('Kiganjo/Mathari', 'Rware', 'Gatitu/Muruguru', 'Ruring''u', 'Kamakwa/Mukaro');

UPDATE kenya_wards 
SET constituency = 'Mwea' 
WHERE county = 'Kirinyaga' AND ward IN ('Mutithi', 'Kangai', 'Thiba', 'Wamumu', 'Nyangati', 'Murinduko', 'Gathigiriri', 'Tebere');

UPDATE kenya_wards 
SET constituency = 'Gichugu' 
WHERE county = 'Kirinyaga' AND ward IN ('Kabare', 'Baragwi', 'Njukiini', 'Ngariama', 'Karumandi');

UPDATE kenya_wards 
SET constituency = 'Ndia' 
WHERE county = 'Kirinyaga' AND ward IN ('Mukure', 'Kiine', 'Kariti');

UPDATE kenya_wards 
SET constituency = 'Kirinyaga Central' 
WHERE county = 'Kirinyaga' AND ward IN ('Mutira', 'Kanyeki-Ini', 'Kerugoya', 'Inoi');

UPDATE kenya_wards 
SET constituency = 'Kangema' 
WHERE county = 'Murang''a' AND ward IN ('Kanyenyaini', 'Muguru', 'Rwathia');

UPDATE kenya_wards 
SET constituency = 'Mathioya' 
WHERE county = 'Murang''a' AND ward IN ('Gitugi', 'Kiru', 'Kamacharia');

UPDATE kenya_wards 
SET constituency = 'Kiharu' 
WHERE county = 'Murang''a' AND ward IN ('Wangu', 'Mugoiri', 'Mbiri', 'Township', 'Murarandia', 'Gaturi');

UPDATE kenya_wards 
SET constituency = 'Kigumo' 
WHERE county = 'Murang''a' AND ward IN ('Kahumbu', 'Muthithi', 'Kigumo', 'Kangari', 'Kinyona');

UPDATE kenya_wards 
SET constituency = 'Maragwa' 
WHERE county = 'Murang''a' AND ward IN ('Kimorori/Wempa', 'Makuyu', 'Kambiti', 'Kamahuha', 'Ichagaki', 'Nginda');

UPDATE kenya_wards 
SET constituency = 'Kandara' 
WHERE county = 'Murang''a' AND ward IN ('Ng''araria', 'Muruka', 'Kagundu-Ini', 'Gaichanjiru', 'Ithiru', 'Ruchu');

UPDATE kenya_wards 
SET constituency = 'Gatanga' 
WHERE county = 'Murang''a' AND ward IN ('Ithanga', 'Kakuzi/Mitubiri', 'Mugumo-Ini', 'Kihumbu-Ini', 'Gatanga', 'Kariara');

UPDATE kenya_wards 
SET constituency = 'Gatundu South' 
WHERE county = 'Kiambu' AND ward IN ('Kiamwangi', 'Kiganjo', 'Ndarugu', 'Ngenda');

UPDATE kenya_wards 
SET constituency = 'Gatundu North' 
WHERE county = 'Kiambu' AND ward IN ('Gituamba', 'Githobokoni', 'Chania', 'Mang''u');

UPDATE kenya_wards 
SET constituency = 'Juja' 
WHERE county = 'Kiambu' AND ward IN ('Murera', 'Theta', 'Juja', 'Witeithie', 'Kalimoni');

UPDATE kenya_wards 
SET constituency = 'Thika Town' 
WHERE county = 'Kiambu' AND ward IN ('Township', 'Kamenu', 'Hospital', 'Gatuanyaga', 'Ngoliba');

UPDATE kenya_wards 
SET constituency = 'Ruiru' 
WHERE county = 'Kiambu' AND ward IN ('Gitothua', 'Biashara', 'Gatongora', 'Kahawa Sukari', 'Kahawa Wendani', 'Kiuu', 'Mwiki', 'Mwihoko');

UPDATE kenya_wards 
SET constituency = 'Githunguri' 
WHERE county = 'Kiambu' AND ward IN ('Githunguri', 'Githiga', 'Ikinu', 'Ngewa', 'Komothai');

UPDATE kenya_wards 
SET constituency = 'Kiambu' 
WHERE county = 'Kiambu' AND ward IN ('Ting''ang''a', 'Ndumberi', 'Riabai', 'Township');

UPDATE kenya_wards 
SET constituency = 'Kiambaa' 
WHERE county = 'Kiambu' AND ward IN ('Cianda', 'Karuri', 'Ndenderu', 'Muchatha', 'Kihara');

UPDATE kenya_wards 
SET constituency = 'Kabete' 
WHERE county = 'Kiambu' AND ward IN ('Gitaru', 'Muguga', 'Nyadhuna', 'Kabete', 'Uthiru');

UPDATE kenya_wards 
SET constituency = 'Kikuyu' 
WHERE county = 'Kiambu' AND ward IN ('Karai', 'Nachu', 'Sigona', 'Kikuyu', 'Kinoo');

UPDATE kenya_wards 
SET constituency = 'Limuru' 
WHERE county = 'Kiambu' AND ward IN ('Bibirioni', 'Limuru Central', 'Ndeiya', 'Limuru East', 'Ngecha Tigoni');

UPDATE kenya_wards 
SET constituency = 'Lari' 
WHERE county = 'Kiambu' AND ward IN ('Kinale', 'Kijabe', 'Nyanduma', 'Kamburu', 'Lari/Kirenga');

UPDATE kenya_wards 
SET constituency = 'Turkana North' 
WHERE county = 'Turkana' AND ward IN ('Kaeris', 'Lake Zone', 'Lapur', 'Kaaleng/Kaikor', 'Kibish', 'Nakalale');

UPDATE kenya_wards 
SET constituency = 'Turkana West' 
WHERE county = 'Turkana' AND ward IN ('Kakuma', 'Lopur', 'Letea', 'Songot', 'Kalobeyei', 'Lokichoggio', 'Nanaam');

UPDATE kenya_wards 
SET constituency = 'Turkana Central' 
WHERE county = 'Turkana' AND ward IN ('Kerio Delta', 'Kang''atotha', 'Kalokol', 'Lodwar Township', 'Kanamkemer');

UPDATE kenya_wards 
SET constituency = 'Loima' 
WHERE county = 'Turkana' AND ward IN ('Kotaruk/Lobei', 'Turkwel', 'Loima', 'Lokiriama/Lorengippi');

UPDATE kenya_wards 
SET constituency = 'Turkana South' 
WHERE county = 'Turkana' AND ward IN ('Kaputir', 'Katilu', 'Lobokat', 'Kalapata', 'Lokichar');

UPDATE kenya_wards 
SET constituency = 'Turkana East' 
WHERE county = 'Turkana' AND ward IN ('Kapedo/Napeitom', 'Katilia', 'Lokori/Kochodin');

UPDATE kenya_wards 
SET constituency = 'Kapenguria' 
WHERE county = 'West Pokot' AND ward IN ('Riwo', 'Kapenguria', 'Mnagei', 'Siyoi', 'Endugh', 'Sook');

UPDATE kenya_wards 
SET constituency = 'Sigor' 
WHERE county = 'West Pokot' AND ward IN ('Sekerr', 'Masool', 'Lomut', 'Weiwei');

UPDATE kenya_wards 
SET constituency = 'Kacheliba' 
WHERE county = 'West Pokot' AND ward IN ('Suam', 'Kodich', 'Kapckok', 'Kasei', 'Kiwawa', 'Alale');

UPDATE kenya_wards 
SET constituency = 'Pokot South' 
WHERE county = 'West Pokot' AND ward IN ('Chepareria', 'Batei', 'Lelan', 'Tapach');

UPDATE kenya_wards 
SET constituency = 'Samburu West' 
WHERE county = 'Samburu' AND ward IN ('Lodokejek', 'Suguta Marmar', 'Maralal', 'Loosuk', 'Poro');

UPDATE kenya_wards 
SET constituency = 'Samburu North' 
WHERE county = 'Samburu' AND ward IN ('El-Barta', 'Nachola', 'Ndoto', 'Nyiro', 'Angata Nanyokie', 'Baawa');

UPDATE kenya_wards 
SET constituency = 'Samburu East' 
WHERE county = 'Samburu' AND ward IN ('Waso', 'Wamba West', 'Wamba East', 'Wamba North');

UPDATE kenya_wards 
SET constituency = 'Kwanza' 
WHERE county = 'Trans Nzoia' AND ward IN ('Kapomboi', 'Kwanza', 'Keiyo', 'Bidii');

UPDATE kenya_wards 
SET constituency = 'Endebess' 
WHERE county = 'Trans Nzoia' AND ward IN ('Chepchoina', 'Endebess', 'Matumbei');

UPDATE kenya_wards 
SET constituency = 'Saboti' 
WHERE county = 'Trans Nzoia' AND ward IN ('Kinyoro', 'Matisi', 'Tuwani', 'Saboti', 'Machewa');

UPDATE kenya_wards 
SET constituency = 'Kiminini' 
WHERE county = 'Trans Nzoia' AND ward IN ('Kiminini', 'Waitaluk', 'Sirende', 'Hospital', 'Sikhendu', 'Nabiswa');

UPDATE kenya_wards 
SET constituency = 'Cherangany' 
WHERE county = 'Trans Nzoia' AND ward IN ('Sinyerere', 'Makutano', 'Kaplamai', 'Motosiet', 'Cherangany/Suwerwa', 'Chepsiro/Kiptoror', 'Sitatunga');

UPDATE kenya_wards 
SET constituency = 'Soy' 
WHERE county = 'Uasin Gishu' AND ward IN ('Moi''s Bridge', 'Kapkures', 'Ziwa', 'Segero/Barsombe', 'Kipsomba', 'Soy', 'Kuinet/Kapsuswa');

UPDATE kenya_wards 
SET constituency = 'Turbo' 
WHERE county = 'Uasin Gishu' AND ward IN ('Ngenyilel', 'Tapsagoi', 'Kamagut', 'Kiplombe', 'Kapsaos', 'Huruma');

UPDATE kenya_wards 
SET constituency = 'Moiben' 
WHERE county = 'Uasin Gishu' AND ward IN ('Tembelio', 'Sergoit', 'Karuna/Meibeki', 'Moiben', 'Kimumu');

UPDATE kenya_wards 
SET constituency = 'Ainabkoi' 
WHERE county = 'Uasin Gishu' AND ward IN ('Kapsoya', 'Kaptagat', 'Ainabkoi/Olare');

UPDATE kenya_wards 
SET constituency = 'Kapseret' 
WHERE county = 'Uasin Gishu' AND ward IN ('Simat/Kapseret', 'Kipkenyo', 'Ngeria', 'Megun', 'Langas');

UPDATE kenya_wards 
SET constituency = 'Kesses' 
WHERE county = 'Uasin Gishu' AND ward IN ('Racecourse', 'Cheptiret/Kipchamo', 'Tulwet/Chuiyat', 'Tarakwa');

UPDATE kenya_wards 
SET constituency = 'Marakwet East' 
WHERE county = 'Elgeyo/Marakwet' AND ward IN ('Kapyego', 'Sambirir', 'Endo', 'Embobut / Embulot');

UPDATE kenya_wards 
SET constituency = 'Marakwet West' 
WHERE county = 'Elgeyo/Marakwet' AND ward IN ('Lelan', 'Sengwer', 'Cherang''any/Chebororwa', 'Moiben/Kuserwo', 'Kapsowar', 'Arror');

UPDATE kenya_wards 
SET constituency = 'Keiyo North' 
WHERE county = 'Elgeyo/Marakwet' AND ward IN ('Emsoo', 'Kamariny', 'Kapchemutwa', 'Tambach');

UPDATE kenya_wards 
SET constituency = 'Keiyo South' 
WHERE county = 'Elgeyo/Marakwet' AND ward IN ('Kaptarakwa', 'Chepkorio', 'Soy North', 'Soy South', 'Kabiemit', 'Metkei');

UPDATE kenya_wards 
SET constituency = 'Tinderet' 
WHERE county = 'Nandi' AND ward IN ('Songhor/Soba', 'Tindiret', 'Chemelil/Chemase', 'Kapsimotwo');

UPDATE kenya_wards 
SET constituency = 'Aldai' 
WHERE county = 'Nandi' AND ward IN ('Kabwareng', 'Terik', 'Kemeloi-Maraba', 'Kobujoi', 'Kaptumo-Kaboi', 'Koyo-Ndurio');

UPDATE kenya_wards 
SET constituency = 'Nandi Hills' 
WHERE county = 'Nandi' AND ward IN ('Nandi Hills', 'Chepkunyuk', 'Ol''lessos', 'Kapchorua');

UPDATE kenya_wards 
SET constituency = 'Chesumei' 
WHERE county = 'Nandi' AND ward IN ('Chemundu/Kapng''etuny', 'Kosirai', 'Lelmokwo/Ngechek', 'Kaptel/Kamoiywo', 'Kiptuya');

UPDATE kenya_wards 
SET constituency = 'Emgwen' 
WHERE county = 'Nandi' AND ward IN ('Chepkumia', 'Kapkangani', 'Kapsabet', 'Kilibwoni');

UPDATE kenya_wards 
SET constituency = 'Mosop' 
WHERE county = 'Nandi' AND ward IN ('Chepterwai', 'Kipkaren', 'Kurgung/Surungai', 'Kabiyet', 'Ndalat', 'Kabisaga', 'Sangalo/Kebulonik');

UPDATE kenya_wards 
SET constituency = 'Tiaty' 
WHERE county = 'Baringo' AND ward IN ('Tirioko', 'Kolowa', 'Ribkwo', 'Silale', 'Loiyamorock', 'Tangulbei/Korossi', 'Churo/Amaya');

UPDATE kenya_wards 
SET constituency = 'Baringo  North' 
WHERE county = 'Baringo' AND ward IN ('Barwessa', 'Kabartonjo', 'Saimo/Kipsaraman', 'Saimo/Soi', 'Bartabwa');

UPDATE kenya_wards 
SET constituency = 'Baringo Central' 
WHERE county = 'Baringo' AND ward IN ('Kabarnet', 'Sacho', 'Tenges', 'Ewalel Chapchap', 'Kapropita');

UPDATE kenya_wards 
SET constituency = 'Baringo South' 
WHERE county = 'Baringo' AND ward IN ('Marigat', 'Ilchamus', 'Mochongoi', 'Mukutani');

UPDATE kenya_wards 
SET constituency = 'Mogotio' 
WHERE county = 'Baringo' AND ward IN ('Mogotio', 'Emining', 'Kisanana');

UPDATE kenya_wards 
SET constituency = 'Eldama Ravine' 
WHERE county = 'Baringo' AND ward IN ('Lembus', 'Lembus Kwen', 'Ravine', 'Mumberes/Maji Mazuri', 'Lembus/Perkerra', 'Koibatek');

UPDATE kenya_wards 
SET constituency = 'Laikipia West' 
WHERE county = 'Laikipia' AND ward IN ('Olmoran', 'Rumuruti Township', 'Kinamba', 'Marmanet', 'Igwamiti', 'Salama');

UPDATE kenya_wards 
SET constituency = 'Laikipia East' 
WHERE county = 'Laikipia' AND ward IN ('Ngobit', 'Tigithi', 'Thingithu', 'Nanyuki', 'Umande');

UPDATE kenya_wards 
SET constituency = 'Laikipia North' 
WHERE county = 'Laikipia' AND ward IN ('Sosian', 'Segera', 'Mukogondo West', 'Mukogondo East');

UPDATE kenya_wards 
SET constituency = 'Molo' 
WHERE county = 'Nakuru' AND ward IN ('Mariashoni', 'Elburgon', 'Turi', 'Molo');

UPDATE kenya_wards 
SET constituency = 'Njoro' 
WHERE county = 'Nakuru' AND ward IN ('Maunarok', 'Mauche', 'Kihingo', 'Nessuit', 'Lare', 'Njoro');

UPDATE kenya_wards 
SET constituency = 'Naivasha' 
WHERE county = 'Nakuru' AND ward IN ('Biashara', 'Hells Gate', 'Lakeview', 'Maai-Mahiu', 'Maiella', 'Olkaria', 'Naivasha East', 'Viwandani');

UPDATE kenya_wards 
SET constituency = 'Gilgil' 
WHERE county = 'Nakuru' AND ward IN ('Gilgil', 'Elementaita', 'Mbaruk/Eburu', 'Malewa West', 'Murindati');

UPDATE kenya_wards 
SET constituency = 'Kuresoi South' 
WHERE county = 'Nakuru' AND ward IN ('Amalo', 'Keringet', 'Kiptagich', 'Tinet');

UPDATE kenya_wards 
SET constituency = 'Kuresoi North' 
WHERE county = 'Nakuru' AND ward IN ('Kiptororo', 'Nyota', 'Sirikwa', 'Kamara');

UPDATE kenya_wards 
SET constituency = 'Subukia' 
WHERE county = 'Nakuru' AND ward IN ('Subukia', 'Waseges', 'Kabazi');

UPDATE kenya_wards 
SET constituency = 'Rongai' 
WHERE county = 'Nakuru' AND ward IN ('Menengai West', 'Soin', 'Visoi', 'Mosop', 'Solai');

UPDATE kenya_wards 
SET constituency = 'Bahati' 
WHERE county = 'Nakuru' AND ward IN ('Dundori', 'Kabatini', 'Kiamaina', 'Lanet/Umoja', 'Bahati');

UPDATE kenya_wards 
SET constituency = 'Nakuru Town West' 
WHERE county = 'Nakuru' AND ward IN ('Barut', 'London', 'Kaptembwo', 'Kapkures', 'Rhoda', 'Shaabab');

UPDATE kenya_wards 
SET constituency = 'Nakuru Town East' 
WHERE county = 'Nakuru' AND ward IN ('Biashara', 'Kivumbini', 'Flamingo', 'Menengai', 'Nakuru East');

UPDATE kenya_wards 
SET constituency = 'Kilgoris' 
WHERE county = 'Narok' AND ward IN ('Kilgoris Central', 'Keyian', 'Angata Barikoi', 'Shankoe', 'Kimintet', 'Lolgorian');

UPDATE kenya_wards 
SET constituency = 'Emurua Dikirr' 
WHERE county = 'Narok' AND ward IN ('Ilkerin', 'Ololmasani', 'Mogondo', 'Kapsasian');

UPDATE kenya_wards 
SET constituency = 'Narok North' 
WHERE county = 'Narok' AND ward IN ('Olpusimoru', 'Olokurto', 'Narok Town', 'Nkareta', 'Olorropil', 'Melili');

UPDATE kenya_wards 
SET constituency = 'Narok East' 
WHERE county = 'Narok' AND ward IN ('Mosiro', 'Ildamat', 'Keekonyokie', 'Suswa');

UPDATE kenya_wards 
SET constituency = 'Narok South' 
WHERE county = 'Narok' AND ward IN ('Majimoto/Naroosura', 'Ololulung''a', 'Melelo', 'Loita', 'Sogoo', 'Sagamian');

UPDATE kenya_wards 
SET constituency = 'Narok West' 
WHERE county = 'Narok' AND ward IN ('Ilmotiok', 'Mara', 'Siana', 'Naikarra');

UPDATE kenya_wards 
SET constituency = 'Kajiado North' 
WHERE county = 'Kajiado' AND ward IN ('Olkeri', 'Ongata Rongai', 'Nkaimurunya', 'Oloolua', 'Ngong');

UPDATE kenya_wards 
SET constituency = 'Kajiado Central' 
WHERE county = 'Kajiado' AND ward IN ('Purko', 'Ildamat', 'Dalalekutuk', 'Matapato North', 'Matapato South');

UPDATE kenya_wards 
SET constituency = 'Kajiado East' 
WHERE county = 'Kajiado' AND ward IN ('Kaputiei North', 'Kitengela', 'Oloosirkon/Sholinke', 'Kenyawa-Poka', 'Imaroro');

UPDATE kenya_wards 
SET constituency = 'Kajiado West' 
WHERE county = 'Kajiado' AND ward IN ('Keekonyokie', 'Iloodokilani', 'Magadi', 'Ewuaso Oonkidong''i', 'Mosiro');

UPDATE kenya_wards 
SET constituency = 'Kajiado South' 
WHERE county = 'Kajiado' AND ward IN ('Entonet/Lenkisim', 'Mbirikani/Eselenkei', 'Kuku', 'Rombo', 'Kimana');

UPDATE kenya_wards 
SET constituency = 'Kipkelion East' 
WHERE county = 'Kericho' AND ward IN ('Londiani', 'Kedowa/Kimugul', 'Chepseon', 'Tendeno/Sorget');

UPDATE kenya_wards 
SET constituency = 'Kipkelion West' 
WHERE county = 'Kericho' AND ward IN ('Kunyak', 'Kamasian', 'Kipkelion', 'Chilchila');

UPDATE kenya_wards 
SET constituency = 'Ainamoi' 
WHERE county = 'Kericho' AND ward IN ('Kapsoit', 'Ainamoi', 'Kapkugerwet', 'Kipchebor', 'Kipchimchim', 'Kapsaos');

UPDATE kenya_wards 
SET constituency = 'Bureti' 
WHERE county = 'Kericho' AND ward IN ('Kisiara', 'Tebesonik', 'Cheboin', 'Chemosot', 'Litein', 'Cheplanget', 'Kapkatet');

UPDATE kenya_wards 
SET constituency = 'Belgut' 
WHERE county = 'Kericho' AND ward IN ('Waldai', 'Kabianga', 'Cheptororiet/Seretut', 'Chaik', 'Kapsuser');

UPDATE kenya_wards 
SET constituency = 'Sigowet/Soin' 
WHERE county = 'Kericho' AND ward IN ('Sigowet', 'Kaplelartet', 'Soliat', 'Soin');

UPDATE kenya_wards 
SET constituency = 'Sotik' 
WHERE county = 'Bomet' AND ward IN ('Ndanai/Abosi', 'Chemagel', 'Kipsonoi', 'Kapletundo', 'Rongena/Manaret');

UPDATE kenya_wards 
SET constituency = 'Chepalungu' 
WHERE county = 'Bomet' AND ward IN ('Kong''asis', 'Nyangores', 'Sigor', 'Chebunyo', 'Siongiroi');

UPDATE kenya_wards 
SET constituency = 'Bomet East' 
WHERE county = 'Bomet' AND ward IN ('Merigi', 'Kembu', 'Longisa', 'Kipreres', 'Chemaner');

UPDATE kenya_wards 
SET constituency = 'Bomet Central' 
WHERE county = 'Bomet' AND ward IN ('Silibwet Township', 'Ndaraweta', 'Singorwet', 'Chesoen', 'Mutarakwa');

UPDATE kenya_wards 
SET constituency = 'Konoin' 
WHERE county = 'Bomet' AND ward IN ('Chepchabas', 'Kimulot', 'Mogogosiek', 'Boito', 'Embomos');

UPDATE kenya_wards 
SET constituency = 'Lugari' 
WHERE county = 'Kakamega' AND ward IN ('Mautuma', 'Lugari', 'Lumakanda', 'Chekalini', 'Chevaywa', 'Lwandeti');

UPDATE kenya_wards 
SET constituency = 'Likuyani' 
WHERE county = 'Kakamega' AND ward IN ('Likuyani', 'Sango', 'Kongoni', 'Nzoia', 'Sinoko');

UPDATE kenya_wards 
SET constituency = 'Malava' 
WHERE county = 'Kakamega' AND ward IN ('West Kabras', 'Chemuche', 'East Kabras', 'Butali/Chegulo', 'Manda-Shivanga', 'Shirugu-Mugai', 'South Kabras');

UPDATE kenya_wards 
SET constituency = 'Lurambi' 
WHERE county = 'Kakamega' AND ward IN ('Butsotso East', 'Butsotso South', 'Butsotso Central', 'Sheywe', 'Mahiakalo', 'Shirere');

UPDATE kenya_wards 
SET constituency = 'Navakholo' 
WHERE county = 'Kakamega' AND ward IN ('Ingostse-Mathia', 'Shinoyi-Shikomari-', 'Bunyala West', 'Bunyala East', 'Bunyala Central');

UPDATE kenya_wards 
SET constituency = 'Mumias West' 
WHERE county = 'Kakamega' AND ward IN ('Mumias Central', 'Mumias North', 'Etenje', 'Musanda');

UPDATE kenya_wards 
SET constituency = 'Mumias East' 
WHERE county = 'Kakamega' AND ward IN ('Lubinu/Lusheya', 'Isongo/Makunga/Malaha', 'East Wanga');

UPDATE kenya_wards 
SET constituency = 'Matungu' 
WHERE county = 'Kakamega' AND ward IN ('Koyonzo', 'Kholera', 'Khalaba', 'Mayoni', 'Namamali');

UPDATE kenya_wards 
SET constituency = 'Butere' 
WHERE county = 'Kakamega' AND ward IN ('Marama West', 'Marama Central', 'Marenyo - Shianda', 'Marama North', 'Marama South');

UPDATE kenya_wards 
SET constituency = 'Khwisero' 
WHERE county = 'Kakamega' AND ward IN ('Kisa North', 'Kisa East', 'Kisa West', 'Kisa Central');

UPDATE kenya_wards 
SET constituency = 'Shinyalu' 
WHERE county = 'Kakamega' AND ward IN ('Isukha North', 'Murhanda', 'Isukha Central', 'Isukha South', 'Isukha East', 'Isukha West');

UPDATE kenya_wards 
SET constituency = 'Ikolomani' 
WHERE county = 'Kakamega' AND ward IN ('Idakho South', 'Idakho East', 'Idakho North', 'Idakho Central');

UPDATE kenya_wards 
SET constituency = 'Vihiga' 
WHERE county = 'Vihiga' AND ward IN ('Lugaga-Wamuluma', 'South Maragoli', 'Central Maragoli', 'Mungoma');

UPDATE kenya_wards 
SET constituency = 'Sabatia' 
WHERE county = 'Vihiga' AND ward IN ('Lyaduywa/Izava', 'West Sabatia', 'Chavakali', 'North Maragoli', 'Wodanga', 'Busali');

UPDATE kenya_wards 
SET constituency = 'Hamisi' 
WHERE county = 'Vihiga' AND ward IN ('Shiru', 'Muhudu', 'Shamakhokho', 'Gisambai', 'Banja', 'Tambua', 'Jepkoyai');

UPDATE kenya_wards 
SET constituency = 'Luanda' 
WHERE county = 'Vihiga' AND ward IN ('Luanda Township', 'Wemilabi', 'Mwibona', 'Luanda South', 'Emabungo');

UPDATE kenya_wards 
SET constituency = 'Emuhaya' 
WHERE county = 'Vihiga' AND ward IN ('North East Bunyore', 'Central Bunyore', 'West Bunyore');

UPDATE kenya_wards 
SET constituency = 'Mt.Elgon' 
WHERE county = 'Bungoma' AND ward IN ('Cheptais', 'Chesikaki', 'Chepyuk', 'Kapkateny', 'Kaptama', 'Elgon');

UPDATE kenya_wards 
SET constituency = 'Sirisia' 
WHERE county = 'Bungoma' AND ward IN ('Namwela', 'Malakisi/South Kulisiru', 'Lwandanyi');

UPDATE kenya_wards 
SET constituency = 'Kabuchai' 
WHERE county = 'Bungoma' AND ward IN ('Kabuchai/Chwele', 'West Nalondo', 'Bwake/Luuya', 'Mukuyuni');

UPDATE kenya_wards 
SET constituency = 'Bumula' 
WHERE county = 'Bungoma' AND ward IN ('South Bukusu', 'Bumula', 'Khasoko', 'Kabula', 'Kimaeti', 'West Bukusu', 'Siboti');

UPDATE kenya_wards 
SET constituency = 'Kanduyi' 
WHERE county = 'Bungoma' AND ward IN ('Bukembe West', 'Bukembe East', 'Township', 'Khalaba', 'Musikoma', 'East Sang''alo', 'Marakaru/Tuuti', 'Sang''alo West');

UPDATE kenya_wards 
SET constituency = 'Webuye East' 
WHERE county = 'Bungoma' AND ward IN ('Mihuu', 'Ndivisi', 'Maraka');

UPDATE kenya_wards 
SET constituency = 'Webuye West' 
WHERE county = 'Bungoma' AND ward IN ('Misikhu', 'Sitikho', 'Matulo', 'Bokoli');

UPDATE kenya_wards 
SET constituency = 'Kimilili' 
WHERE county = 'Bungoma' AND ward IN ('Kimilili', 'Kibingei', 'Maeni', 'Kamukuywa');

UPDATE kenya_wards 
SET constituency = 'Tongaren' 
WHERE county = 'Bungoma' AND ward IN ('Mbakalo', 'Naitiri/Kabuyefwe', 'Milima', 'Ndalu/ Tabani', 'Tongaren', 'Soysambu/ Mitua');

UPDATE kenya_wards 
SET constituency = 'Teso North' 
WHERE county = 'Busia' AND ward IN ('Malaba Central', 'Malaba North', 'Ang''urai South', 'Ang''urai North', 'Ang''urai East', 'Malaba South');

UPDATE kenya_wards 
SET constituency = 'Teso South' 
WHERE county = 'Busia' AND ward IN ('Ang''orom', 'Chakol South', 'Chakol North', 'Amukura West', 'Amukura East', 'Amukura Central');

UPDATE kenya_wards 
SET constituency = 'Nambale' 
WHERE county = 'Busia' AND ward IN ('Nambale Township', 'Bukhayo North/Waltsi', 'Bukhayo East', 'Bukhayo Central');

UPDATE kenya_wards 
SET constituency = 'Matayos' 
WHERE county = 'Busia' AND ward IN ('Bukhayo West', 'Mayenje', 'Matayos South', 'Busibwabo', 'Burumba');

UPDATE kenya_wards 
SET constituency = 'Butula' 
WHERE county = 'Busia' AND ward IN ('Marachi West', 'Kingandole', 'Marachi Central', 'Marachi East', 'Marachi North', 'Elugulu');

UPDATE kenya_wards 
SET constituency = 'Funyula' 
WHERE county = 'Busia' AND ward IN ('Namboboto Nambuku', 'Nangina', 'Ageng''a Nanguba', 'Bwiri');

UPDATE kenya_wards 
SET constituency = 'Budalangi' 
WHERE county = 'Busia' AND ward IN ('Bunyala Central', 'Bunyala North', 'Bunyala West', 'Bunyala South');

UPDATE kenya_wards 
SET constituency = 'Ugenya' 
WHERE county = 'Siaya' AND ward IN ('West Ugenya', 'Ukwala', 'North Ugenya', 'East Ugenya');

UPDATE kenya_wards 
SET constituency = 'Ugunja' 
WHERE county = 'Siaya' AND ward IN ('Sidindi', 'Sigomere', 'Ugunja');

UPDATE kenya_wards 
SET constituency = 'Alego Usonga' 
WHERE county = 'Siaya' AND ward IN ('Usonga', 'West Alego', 'Central Alego', 'Siaya Township', 'North Alego', 'South East Alego');

UPDATE kenya_wards 
SET constituency = 'Gem' 
WHERE county = 'Siaya' AND ward IN ('North Gem', 'West Gem', 'Central Gem', 'Yala Township', 'East Gem', 'South Gem');

UPDATE kenya_wards 
SET constituency = 'Bondo' 
WHERE county = 'Siaya' AND ward IN ('West Yimbo', 'Central Sakwa', 'South Sakwa', 'Yimbo East', 'West Sakwa', 'North Sakwa');

UPDATE kenya_wards 
SET constituency = 'Rarieda' 
WHERE county = 'Siaya' AND ward IN ('East Asembo', 'West Asembo', 'North Uyoma', 'South Uyoma', 'West Uyoma');

UPDATE kenya_wards 
SET constituency = 'Kisumu East' 
WHERE county = 'Kisumu' AND ward IN ('Kajulu', 'Kolwa East', 'Manyatta ''B''', 'Nyalenda ''A''', 'Kolwa Central');

UPDATE kenya_wards 
SET constituency = 'Kisumu West' 
WHERE county = 'Kisumu' AND ward IN ('South West Kisumu', 'Central Kisumu', 'Kisumu North', 'West Kisumu', 'North West Kisumu');

UPDATE kenya_wards 
SET constituency = 'Kisumu Central' 
WHERE county = 'Kisumu' AND ward IN ('Railways', 'Migosi', 'Shaurimoyo Kaloleni', 'Market Milimani', 'Kondele', 'Nyalenda B');

UPDATE kenya_wards 
SET constituency = 'Seme' 
WHERE county = 'Kisumu' AND ward IN ('West Seme', 'Central Seme', 'East Seme', 'North Seme');

UPDATE kenya_wards 
SET constituency = 'Nyando' 
WHERE county = 'Kisumu' AND ward IN ('East Kano/Wawidhi', 'Awasi/Onjiko', 'Ahero', 'Kabonyo/Kanyagwal', 'Kobura');

UPDATE kenya_wards 
SET constituency = 'Muhoroni' 
WHERE county = 'Kisumu' AND ward IN ('Miwani', 'Ombeyi', 'Masogo/Nyang''oma', 'Chemelil', 'Muhoroni/Koru');

UPDATE kenya_wards 
SET constituency = 'Nyakach' 
WHERE county = 'Kisumu' AND ward IN ('South West Nyakach', 'North Nyakach', 'Central Nyakach', 'West Nyakach', 'South East Nyakach');

UPDATE kenya_wards 
SET constituency = 'Kasipul' 
WHERE county = 'Homa Bay' AND ward IN ('West Kasipul', 'South Kasipul', 'Central Kasipul', 'East Kamagak', 'West Kamagak');

UPDATE kenya_wards 
SET constituency = 'Kabondo Kasipul' 
WHERE county = 'Homa Bay' AND ward IN ('Kabondo East', 'Kabondo West', 'Kokwanyo/Kakelo', 'Kojwach');

UPDATE kenya_wards 
SET constituency = 'Karachuonyo' 
WHERE county = 'Homa Bay' AND ward IN ('West Karachuonyo', 'North Karachuonyo', 'Central', 'Kanyaluo', 'Kibiri', 'Wangchieng', 'Kendu Bay Town');

UPDATE kenya_wards 
SET constituency = 'Rangwe' 
WHERE county = 'Homa Bay' AND ward IN ('West Gem', 'East Gem', 'Kagan', 'Kochia');

UPDATE kenya_wards 
SET constituency = 'Homa Bay Town' 
WHERE county = 'Homa Bay' AND ward IN ('Homa Bay Central', 'Homa Bay Arujo', 'Homa Bay West', 'Homa Bay East');

UPDATE kenya_wards 
SET constituency = 'Ndhiwa' 
WHERE county = 'Homa Bay' AND ward IN ('Kwabwai', 'Kanyadoto', 'Kanyikela', 'North Kabuoch', 'Kabuoch South/Pala', 'Kanyamwa Kologi', 'Kanyamwa Kosewe');

UPDATE kenya_wards 
SET constituency = 'Mbita' 
WHERE county = 'Homa Bay' AND ward IN ('Mfangano Island', 'Rusinga Island', 'Kasgunga', 'Gembe', 'Lambwe');

UPDATE kenya_wards 
SET constituency = 'Suba' 
WHERE county = 'Homa Bay' AND ward IN ('Gwassi South', 'Gwassi North', 'Kaksingri West', 'Ruma Kaksingri East');

UPDATE kenya_wards 
SET constituency = 'Rongo' 
WHERE county = 'Migori' AND ward IN ('North Kamagambo', 'Central Kamagambo', 'East Kamagambo', 'South Kamagambo');

UPDATE kenya_wards 
SET constituency = 'Awendo' 
WHERE county = 'Migori' AND ward IN ('North Sakwa', 'South Sakwa', 'West Sakwa', 'Central Sakwa');

UPDATE kenya_wards 
SET constituency = 'Suna East' 
WHERE county = 'Migori' AND ward IN ('God Jope', 'Suna Central', 'Kakrao', 'Kwa');

UPDATE kenya_wards 
SET constituency = 'Suna West' 
WHERE county = 'Migori' AND ward IN ('Wiga', 'Wasweta Ii', 'Ragana-Oruba', 'Wasimbete');

UPDATE kenya_wards 
SET constituency = 'Uriri' 
WHERE county = 'Migori' AND ward IN ('West Kanyamkago', 'North Kanyamkago', 'Central Kanyamkago', 'South Kanyamkago', 'East Kanyamkago');

UPDATE kenya_wards 
SET constituency = 'Nyatike' 
WHERE county = 'Migori' AND ward IN ('Kachien''g', 'Kanyasa', 'North Kadem', 'Macalder/Kanyarwanda', 'Kaler', 'Got Kachola', 'Muhuru');

UPDATE kenya_wards 
SET constituency = 'Kuria West' 
WHERE county = 'Migori' AND ward IN ('Bukira East', 'Bukira Centrl/Ikerege', 'Isibania', 'Makerero', 'Masaba', 'Tagare', 'Nyamosense/Komosoko');

UPDATE kenya_wards 
SET constituency = 'Kuria East' 
WHERE county = 'Migori' AND ward IN ('Gokeharaka/Getambwega', 'Ntimaru West', 'Ntimaru East', 'Nyabasi East', 'Nyabasi West');

UPDATE kenya_wards 
SET constituency = 'Bonchari' 
WHERE county = 'Kisii' AND ward IN ('Bomariba', 'Bogiakumu', 'Bomorenda', 'Riana');

UPDATE kenya_wards 
SET constituency = 'South Mugirango' 
WHERE county = 'Kisii' AND ward IN ('Tabaka', 'Boikang''a', 'Bogetenga', 'Borabu / Chitago', 'Moticho', 'Getenga');

UPDATE kenya_wards 
SET constituency = 'Bomachoge Borabu' 
WHERE county = 'Kisii' AND ward IN ('Bombaba Borabu', 'Boochi Borabu', 'Bokimonge', 'Magenche');

UPDATE kenya_wards 
SET constituency = 'Bobasi' 
WHERE county = 'Kisii' AND ward IN ('Masige West', 'Masige East', 'Bobasi Central', 'Nyacheki', 'Bobasi Bogetaorio', 'Bobasi Chache', 'Sameta/Mokwerero', 'Bobasi Boitangare');

UPDATE kenya_wards 
SET constituency = 'Bomachoge Chache' 
WHERE county = 'Kisii' AND ward IN ('Majoge', 'Boochi/Tendere', 'Bosoti/Sengera');

UPDATE kenya_wards 
SET constituency = 'Nyaribari Masaba' 
WHERE county = 'Kisii' AND ward IN ('Ichuni', 'Nyamasibi', 'Masimba', 'Gesusu', 'Kiamokama');

UPDATE kenya_wards 
SET constituency = 'Nyaribari Chache' 
WHERE county = 'Kisii' AND ward IN ('Bobaracho', 'Kisii Central', 'Keumbu', 'Kiogoro', 'Birongo', 'Ibeno');

UPDATE kenya_wards 
SET constituency = 'Kitutu Chache North' 
WHERE county = 'Kisii' AND ward IN ('Monyerero', 'Sensi', 'Marani', 'Kegogi');

UPDATE kenya_wards 
SET constituency = 'Kitutu Chache South' 
WHERE county = 'Kisii' AND ward IN ('Bogusero', 'Bogeka', 'Nyakoe', 'Kitutu   Central', 'Nyatieko');

UPDATE kenya_wards 
SET constituency = 'Kitutu Masaba' 
WHERE county = 'Nyamira' AND ward IN ('Rigoma', 'Gachuba', 'Kemera', 'Magombo', 'Manga', 'Gesima');

UPDATE kenya_wards 
SET constituency = 'West Mugirango' 
WHERE county = 'Nyamira' AND ward IN ('Nyamaiya', 'Bogichora', 'Bosamaro', 'Bonyamatuta', 'Township');

UPDATE kenya_wards 
SET constituency = 'North Mugirango' 
WHERE county = 'Nyamira' AND ward IN ('Itibo', 'Bomwagamo', 'Bokeira', 'Magwagwa', 'Ekerenyo');

UPDATE kenya_wards 
SET constituency = 'Borabu' 
WHERE county = 'Nyamira' AND ward IN ('Mekenene', 'Kiabonyoru', 'Nyansiongo', 'Esise');

UPDATE kenya_wards 
SET constituency = 'Westlands' 
WHERE county = 'Nairobi' AND ward IN ('Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View');

UPDATE kenya_wards 
SET constituency = 'Dagoretti North' 
WHERE county = 'Nairobi' AND ward IN ('Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro');

UPDATE kenya_wards 
SET constituency = 'Dagoretti South' 
WHERE county = 'Nairobi' AND ward IN ('Mutuini', 'Ngando', 'Riruta', 'Uthiru/Ruthimitu', 'Waithaka');

UPDATE kenya_wards 
SET constituency = 'Langata' 
WHERE county = 'Nairobi' AND ward IN ('Karen', 'Nairobi West', 'Mugumo-Ini', 'South-C', 'Nyayo Highrise');

UPDATE kenya_wards 
SET constituency = 'Kibra' 
WHERE county = 'Nairobi' AND ward IN ('Laini Saba', 'Lindi', 'Makina', 'Woodley/Kenyatta Golf', 'Sarangombe');

UPDATE kenya_wards 
SET constituency = 'Roysambu' 
WHERE county = 'Nairobi' AND ward IN ('Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa');

UPDATE kenya_wards 
SET constituency = 'Kasarani' 
WHERE county = 'Nairobi' AND ward IN ('Claycity', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai');

UPDATE kenya_wards 
SET constituency = 'Ruaraka' 
WHERE county = 'Nairobi' AND ward IN ('Baba Dogo', 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho');

UPDATE kenya_wards 
SET constituency = 'Embakasi South' 
WHERE county = 'Nairobi' AND ward IN ('Imara Daima', 'Kwa Njenga', 'Kwa Reuben', 'Pipeline', 'Kware');

UPDATE kenya_wards 
SET constituency = 'Embakasi North' 
WHERE county = 'Nairobi' AND ward IN ('Kariobangi North', 'Dandora Area I', 'Dandora Area Ii', 'Dandora Area Iii', 'Dandora Area Iv');

UPDATE kenya_wards 
SET constituency = 'Embakasi Central' 
WHERE county = 'Nairobi' AND ward IN ('Kayole North', 'Kayole Central', 'Kayole South', 'Komarock', 'Matopeni');

UPDATE kenya_wards 
SET constituency = 'Embakasi East' 
WHERE county = 'Nairobi' AND ward IN ('Upper Savannah', 'Lower Savannah', 'Embakasi', 'Utawala', 'Mihango');

UPDATE kenya_wards 
SET constituency = 'Embakasi West' 
WHERE county = 'Nairobi' AND ward IN ('Umoja I', 'Umoja Ii', 'Mowlem', 'Kariobangi South');

UPDATE kenya_wards 
SET constituency = 'Makadara' 
WHERE county = 'Nairobi' AND ward IN ('Makongeni', 'Maringo/Hamza', 'Harambee', 'Viwandani');

UPDATE kenya_wards 
SET constituency = 'Kamukunji' 
WHERE county = 'Nairobi' AND ward IN ('Pumwani', 'Eastleigh North', 'Eastleigh South', 'Airbase', 'California');

UPDATE kenya_wards 
SET constituency = 'Starehe' 
WHERE county = 'Nairobi' AND ward IN ('Nairobi Central', 'Ngara', 'Ziwani/Kariokor', 'Pangani', 'Landimawe', 'Nairobi South');

UPDATE kenya_wards 
SET constituency = 'Mathare' 
WHERE county = 'Nairobi' AND ward IN ('Hospital', 'Mabatini', 'Huruma', 'Ngei', 'Mlango Kubwa', 'Kiamaiko');

-- Kajiado specialized variations mapped automatically
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
