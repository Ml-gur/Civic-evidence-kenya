export interface ConstituencyLeader {
    name: string;
    mp: string;
}

export interface CountyLeader {
    code: string;
    county: string;
    governor: string;
    constituencies: ConstituencyLeader[];
}

export const KENYA_LEADERS: CountyLeader[] = [
    {
        code: "01", county: "Mombasa", governor: "Abdulswamad Nassir",
        constituencies: [
            { name: "Changamwe", mp: "Shimbwa, Omar Mwinyi" },
            { name: "Jomvu", mp: "Bady, Bady Twalib" },
            { name: "Kisauni", mp: "Bedzimba, Rashid Juma" },
            { name: "Nyali", mp: "Mohamed, Mohamed Ali" },
            { name: "Likoni", mp: "Mboko, Mishi Juma Khamisi" },
            { name: "Mvita", mp: "Machele, Mohamed Soud" }
        ]
    },
    {
        code: "02", county: "Kwale", governor: "Fatuma Achani",
        constituencies: [
            { name: "Msambweni", mp: "Bader, Salim Feisal" },
            { name: "Lungalunga", mp: "Chiforomodo, Mangale Munga" },
            { name: "Matuga", mp: "Tandaza, Kassim Sawa" },
            { name: "Kinango", mp: "Rai, Samuel Gonzi" }
        ]
    },
    {
        code: "03", county: "Kilifi", governor: "Gideon Mung'aro",
        constituencies: [
            { name: "Kilifi North", mp: "Baya, Owen Yaa" },
            { name: "Kilifi South", mp: "Kiti, Richard Ken Chonga" },
            { name: "Kaloleni", mp: "Katana, Paul Kahindi" },
            { name: "Rabai", mp: "Mupe, Anthony Kenga" },
            { name: "Ganze", mp: "Tungule, Charo Kenneth Kazungu" },
            { name: "Malindi", mp: "Mnyazi, Amina Laura" },
            { name: "Magarini", mp: "Kombe, Harrison Garama" }
        ]
    },
    {
        code: "04", county: "Tana River", governor: "Dhadho Godhana",
        constituencies: [
            { name: "Garsen", mp: "Guyo, Ali Wario" },
            { name: "Galole", mp: "Hiribae, Said Buya" },
            { name: "Bura", mp: "Yakub, Adow Kuno" }
        ]
    },
    {
        code: "05", county: "Lamu", governor: "Issa Timamy",
        constituencies: [
            { name: "Lamu East", mp: "Obo, Ruweida Mohamed" },
            { name: "Lamu West", mp: "Muiruri, Muthama Stanley" }
        ]
    },
    {
        code: "06", county: "Taita Taveta", governor: "Andrew Mwadime",
        constituencies: [
            { name: "Taveta", mp: "Bwire, John Okano" },
            { name: "Wundanyi", mp: "Mwakuwona, Danson Mwashako" },
            { name: "Mwatate", mp: "Shake, Peter Mbogho" },
            { name: "Voi", mp: "Abdi, Khamis Chome" }
        ]
    },
    {
        code: "07", county: "Garissa", governor: "Nathif Jama",
        constituencies: [
            { name: "Garissa Township", mp: "Barrow, Dekow Mohamed" },
            { name: "Balambala", mp: "Shurie, Abdi Omar" },
            { name: "Lagdera", mp: "Mohamed, Abdikadir Hussein" },
            { name: "Dadaab", mp: "Maalim, Farah" },
            { name: "Fafi", mp: "Yakub, Farah Salah" },
            { name: "Ijara", mp: "Abdi, Abdi Ali" }
        ]
    },
    {
        code: "08", county: "Wajir", governor: "Ahmed Abdullahi",
        constituencies: [
            { name: "Wajir North", mp: "Saney, Ibrahim Abdi" },
            { name: "Wajir East", mp: "Mohamed, Aden Daudi" },
            { name: "Tarbaj", mp: "Barre, Hussein Abdi" },
            { name: "Wajir West", mp: "Farah, Yussuf Mohamed" },
            { name: "Eldas", mp: "Wehliye, Adan Keynan" },
            { name: "Wajir South", mp: "Adow, Mohamed Aden" }
        ]
    },
    {
        code: "09", county: "Mandera", governor: "Mohamed Adan Khalif",
        constituencies: [
            { name: "Mandera West", mp: "Yussuf, Adan Haji" },
            { name: "Banissa", mp: "Hassan, Ahmed Maalim" },
            { name: "Mandera North", mp: "Abdullahi, Bashir Sheikh" },
            { name: "Mandera South", mp: "Haro, Abdul Ebrahim" },
            { name: "Mandera East", mp: "Abdirahman, Husseinweytan Mohamed" },
            { name: "Lafey", mp: "Abdirahman, Mohamed Abdi" }
        ]
    },
    {
        code: "10", county: "Marsabit", governor: "Mohamud Ali",
        constituencies: [
            { name: "Moyale", mp: "Jaldesa, Guyo Waqo" },
            { name: "North Horr", mp: "Guyo, Adhe Wario" },
            { name: "Saku", mp: "Raso, Dido Ali" },
            { name: "Laisamis", mp: "Lekuton, Joseph" }
        ]
    },
    {
        code: "11", county: "Isiolo", governor: "Abdi Hassan Guyo",
        constituencies: [
            { name: "Isiolo North", mp: "Lomwa, Joseph Samal" },
            { name: "Isiolo South", mp: "" }
        ]
    },
    {
        code: "12", county: "Meru", governor: "Kawira Mwangaza",
        constituencies: [
            { name: "Igembe South", mp: "Mwirigi, John Paul" },
            { name: "Igembe Central", mp: "Karitho, Kiili Daniel" },
            { name: "Igembe North", mp: "M'Anaiba, Julius Taitumu" },
            { name: "Tigania West", mp: "Mutunga, John Kanyuithia" },
            { name: "Tigania East", mp: "Aburi, Lawrence Mpuru" },
            { name: "North Imenti", mp: "Abdul, Rahim Dawood" },
            { name: "Buuri", mp: "Murwithania, Rindikiri Mugambi" },
            { name: "Central Imenti", mp: "Kirima, Moses Nguchine" },
            { name: "South Imenti", mp: "Ithinji, Dr. Shadrack Mwiti" }
        ]
    },
    {
        code: "13", county: "Tharaka-Nithi", governor: "Muthomi Njuki",
        constituencies: [
            { name: "Maara", mp: "Mbiuki, Japhet Miriti Kareke" },
            { name: "Chuka/Igambang'om", mp: "Ntwiga, Patrick Munene" },
            { name: "Tharaka", mp: "Murugara, George Gitonga" }
        ]
    },
    {
        code: "14", county: "Embu", governor: "Cecily Mbarire",
        constituencies: [
            { name: "Manyatta", mp: "Mukunji, John Gitonga Mwaniki" },
            { name: "Runyenjes", mp: "Karemba, Eric Muchangi Njiru" },
            { name: "Mbeere South", mp: "Nebart, Bernard Muriuki" },
            { name: "Mbeere North", mp: "Njeru, Leo Wa Muthende" }
        ]
    },
    {
        code: "15", county: "Kitui", governor: "Julius Malombe",
        constituencies: [
            { name: "Mwingi North", mp: "Nzengu, Paul Musyimi" },
            { name: "Mwingi West", mp: "Nguna, Charles Ngusya" },
            { name: "Mwingi Central", mp: "Mulyungi, Gideon Mutemi" },
            { name: "Kitui West", mp: "Nyenze, Edith Vethi" },
            { name: "Kitui Rural", mp: "Mboni, David Mwalika" },
            { name: "Kitui Central", mp: "Mulu, Makali Benson" },
            { name: "Kitui East", mp: "Mbai, Nimrod Mbithuka" },
            { name: "Kitui South", mp: "Nyamai, Rachael Kaki" }
        ]
    },
    {
        code: "16", county: "Machakos", governor: "Wavinya Ndeti",
        constituencies: [
            { name: "Masinga", mp: "Mwalyo, Joshua Mbithi Mutua" },
            { name: "Yatta", mp: "Basil, Robert Ngui" },
            { name: "Kangundo", mp: "Muli, Fabian Kyule" },
            { name: "Matungulu", mp: "Mule, Stephen Mutinda" },
            { name: "Kathiani", mp: "Mbui, Robert" },
            { name: "Mavoko", mp: "King'ola Patrick Makau" },
            { name: "Machakos Town", mp: "Mule, Caleb Mutiso" },
            { name: "Mwala", mp: "Musau, Vincent Musyoka" }
        ]
    },
    {
        code: "17", county: "Makueni", governor: "Mutula Kilonzo Jr.",
        constituencies: [
            { name: "Mbooni", mp: "Nzioka, Erastus Kivasu" },
            { name: "Kilome", mp: "Nzambia, Thudeeus Kithua" },
            { name: "Kaiti", mp: "Kimilu, Joshua Kivinda" },
            { name: "Makueni", mp: "Kiamba, Suzanne Ndunge" },
            { name: "Kibwezi West", mp: "Mutuse, Eckomas Mwengi" },
            { name: "Kibwezi East", mp: "Mbalu, Jessica Nduku Kiko" }
        ]
    },
    {
        code: "18", county: "Nyandarua", governor: "Moses Kiarie Badilisha",
        constituencies: [
            { name: "Kinangop", mp: "Kwenya, Thuku Zachary" },
            { name: "Kipipiri", mp: "Muhia, Wanjiku" },
            { name: "Ol Kalou", mp: "Kiaraho, David Njuguna" },
            { name: "Ol Jorok", mp: "Muchira, Michael Mwangi" },
            { name: "Ndaragwa", mp: "Gachagua, George N." }
        ]
    },
    {
        code: "19", county: "Nyeri", governor: "Mutahi Kahiga",
        constituencies: [
            { name: "Tetu", mp: "Mwangi, Geoffrey Wandeto" },
            { name: "Kieni", mp: "Wainaina, Antony Njoroge" },
            { name: "Mathira", mp: "Kahugu, Eric Meangi" },
            { name: "Othaya", mp: "Wainaina, Michael Wambugu" },
            { name: "Mukurweini", mp: "Gichohi, Kaguchia John Philip" },
            { name: "Nyeri Town", mp: "Mathenge, Duncan Maina" }
        ]
    },
    {
        code: "20", county: "Kirinyaga", governor: "Anne Waiguru",
        constituencies: [
            { name: "Mwea", mp: "Maingi, Mary" },
            { name: "Gichugu", mp: "Githinji, Robert Gichimu" },
            { name: "Ndia", mp: "GK, George Macharia Kariuki" },
            { name: "Kirinyaga Central", mp: "Gitari, Joseph Gachoki" }
        ]
    },
    {
        code: "21", county: "Murang'a", governor: "Irungu Kang'ata",
        constituencies: [
            { name: "Kangema", mp: "Kihungi, Peter Irungu" },
            { name: "Mathioya", mp: "Gichuki, Edwin Mugo" },
            { name: "Kiharu", mp: "Nyoro, Samson Ndindi" },
            { name: "Kigumo", mp: "Munyoro, Joseph Kamau" },
            { name: "Maragwa", mp: "Njoroge, Mary Wamaua Waithira" },
            { name: "Kandara", mp: "Njuguna, Chege" },
            { name: "Gatanga", mp: "Muriu, Wakili Edward" }
        ]
    },
    {
        code: "22", county: "Kiambu", governor: "Kimani Wamatangi",
        constituencies: [
            { name: "Gatundu South", mp: "Kagombe, Gabriel Gathuka" },
            { name: "Gatundu North", mp: "Kururia, Elijah Njore Njoroge" },
            { name: "Juja", mp: "Ndung'u George Koimburi" },
            { name: "Thika Town", mp: "Ng'ang'a Alice Wambui" },
            { name: "Ruiru", mp: "Kingara, Simon Ng'ang'a" },
            { name: "Githunguri", mp: "Wamuchomba, Gathoni" },
            { name: "Kiambu", mp: "Waithaka, John Machua" },
            { name: "Kiambaa", mp: "John Njuguna" },
            { name: "Kabete", mp: "Wamacukuru, James Githua Kamau" },
            { name: "Kikuyu", mp: "Ichung'wah, Anthony Kimani" },
            { name: "Limuru", mp: "Chege, John Kiragu" },
            { name: "Lari", mp: "Kahangara, Joseph Mburu" }
        ]
    },
    {
        code: "23", county: "Turkana", governor: "Jeremiah Lomorukai",
        constituencies: [
            { name: "Turkana North", mp: "Naibun, Paul Ekwom" },
            { name: "Turkana West", mp: "Nanok, Daniel Epuyo" },
            { name: "Turkana Central", mp: "Emathe, Joseph Namuar" },
            { name: "Loima", mp: "Akuja, Protus Ewesit" },
            { name: "Turkana South", mp: "Namoit, John Ariko" },
            { name: "Turkana East", mp: "Ngikolong, Nicholas Ng'ikor Nixon" }
        ]
    },
    {
        code: "24", county: "West Pokot", governor: "Simon Kachapin",
        constituencies: [
            { name: "Kapenguria", mp: "Chumel, Samwel Moroto" },
            { name: "Sigor", mp: "Lochakapong, Peter" },
            { name: "Kacheliba", mp: "Titus, Lotee" },
            { name: "Pokot South", mp: "Pkosing, David Losiakou" }
        ]
    },
    {
        code: "25", county: "Samburu", governor: "Lati Lelelit",
        constituencies: [
            { name: "Samburu West", mp: "Lesuuda, Josephine Naisula" },
            { name: "Samburu North", mp: "Letipila, Dominic Eli" },
            { name: "Samburu East", mp: "Lentoijoni, Jackson Lekumontare" }
        ]
    },
    {
        code: "26", county: "Trans Nzoia", governor: "George Natembeya",
        constituencies: [
            { name: "Kwanza", mp: "Wanyonyi, Ferdinand Kevin" },
            { name: "Endebess", mp: "Pukose, Robert (Dr.)" },
            { name: "Saboti", mp: "Luyai, Caleb Amisi" },
            { name: "Kiminini", mp: "Bisau, Maurice Kakai" },
            { name: "Cherangany", mp: "Barasa, Patrick Simiyu" }
        ]
    },
    {
        code: "27", county: "Uasin Gishu", governor: "Jonathan Bii",
        constituencies: [
            { name: "Soy", mp: "Kiplagat, David" },
            { name: "Turbo", mp: "Sitienei, Janet Jepkemboi" },
            { name: "Moiben", mp: "Bartoo, Phylis Jepkemoi" },
            { name: "Ainabkoi", mp: "Chepkonga, Kiprono Samwel" },
            { name: "Kapseret", mp: "Sudi, Oscar Kipchumba" },
            { name: "Kesses", mp: "Rutto, Julius Kipletting" }
        ]
    },
    {
        code: "28", county: "Elgeyo Marakwet", governor: "Wisley Rotich",
        constituencies: [
            { name: "Marakwet East", mp: "Bowen, David Kangogo" },
            { name: "Marakwet West", mp: "Toroitich, Timothy Kipchumba" },
            { name: "Keiyo North", mp: "Korir, Adams Kipsanai" },
            { name: "Keiyo South", mp: "Kipkoech, Gideon Kimaiyo" }
        ]
    },
    {
        code: "29", county: "Nandi", governor: "Stephen Sang",
        constituencies: [
            { name: "Tinderet", mp: "Kipbiwot, Julius Melly" },
            { name: "Aldai", mp: "Kitany, Marianne Jebet" },
            { name: "Nandi Hills", mp: "Kitur, Bernard Kibor" },
            { name: "Chesumei", mp: "Biego, Paul Kibichy" },
            { name: "Emgwen", mp: "Lelmengit, Josses Kiptoo Kosgey" },
            { name: "Mosop", mp: "Kirwa, Abraham Kipsang" }
        ]
    },
    {
        code: "30", county: "Baringo", governor: "Benjamin Cheboi",
        constituencies: [
            { name: "Tiaty", mp: "Kassait, William Kamket" },
            { name: "Baringo North", mp: "Kipkoros, Joseph Makilap" },
            { name: "Baringo Central", mp: "Kandie, Joshua Chepyegon" },
            { name: "Baringo South", mp: "Kamuren, Charles" },
            { name: "Mogotio", mp: "Kipgnor, Reuben Kiborek" },
            { name: "Eldama Ravine", mp: "Sirma, Musa Cherutich" }
        ]
    },
    {
        code: "31", county: "Laikipia", governor: "Joshua Irungu",
        constituencies: [
            { name: "Laikipia West", mp: "Karani, Stephen Wachira" },
            { name: "Laikipia East", mp: "Kiunjuri, Festus Mwangi" },
            { name: "Laikipia North", mp: "Korere, Sarah Paulata" }
        ]
    },
    {
        code: "32", county: "Nakuru", governor: "Susan Kihika",
        constituencies: [
            { name: "Molo", mp: "Kimani, Francis Kuria" },
            { name: "Njoro", mp: "Chepkwony, Charity Kathambi" },
            { name: "Naivasha", mp: "Kihara, Jayne Wanjiru Njeru" },
            { name: "Gilgil", mp: "Wanjira, Martha Wangari" },
            { name: "Kuresoi South", mp: "Tonui, Joseph Kipkosgei" },
            { name: "Kuresoi North", mp: "Kiprono, Mutai Alfred" },
            { name: "Subukia", mp: "Gachobe, Samuel Kinuthia" },
            { name: "Rongai", mp: "Chebor, Paul Kibet" },
            { name: "Bahati", mp: "Mrembo, Irene Njoki" },
            { name: "Nakuru Town West", mp: "Arama, Samuel" },
            { name: "Nakuru Town East", mp: "Gikaria, David" }
        ]
    },
    {
        code: "33", county: "Narok", governor: "Patrick Ole Ntutu",
        constituencies: [
            { name: "Kilgoris", mp: "Sunkuli, Julius Lekakeny Ole" },
            { name: "Emurua Dikirr", mp: "Kipyegon, Johana Ng'eno" },
            { name: "Narok North", mp: "Pareiyo, Agnes Mantaine" },
            { name: "Narok East", mp: "Lemanken, Aramat" },
            { name: "Narok South", mp: "Kitilai, Ole Ntutu" },
            { name: "Narok West", mp: "Tongoyo, Gabriel Koshal" }
        ]
    },
    {
        code: "34", county: "Kajiado", governor: "Joseph Ole Lenku",
        constituencies: [
            { name: "Kajiado North", mp: "Nguro, Onesmus Ngogoyo" },
            { name: "Kajiado Central", mp: "Kanchory, Elijah Memusi" },
            { name: "Kajiado East", mp: "Hamisi, Kakuta Maimai" },
            { name: "Kajiado West", mp: "Risa, Sunkuiya George" },
            { name: "Kajiado South", mp: "Sakimba, Parashina Samuel" }
        ]
    },
    {
        code: "35", county: "Kericho", governor: "Erick Mutai",
        constituencies: [
            { name: "Kipkelion East", mp: "Cherorot, Joseph Kimutai" },
            { name: "Kipkelion West", mp: "Kosgei, Hilary Kiplangat" },
            { name: "Ainamoi", mp: "Langat, Benjamin Kipkirui" },
            { name: "Bureti", mp: "Komingoi, Kibet Kirai" },
            { name: "Belgut", mp: "Koech, Nelson" },
            { name: "Sigowet/Soin", mp: "Kemei, Justice Kipsang" }
        ]
    },
    {
        code: "36", county: "Bomet", governor: "Hillary Barchok",
        constituencies: [
            { name: "Sotik", mp: "Sigei, Francis Kipyegon arap" },
            { name: "Chepalungu", mp: "Koech, Victor Kipngetich" },
            { name: "Bomet East", mp: "Yegon, Richard Kipkemoi" },
            { name: "Bomet Central", mp: "Kilel, Richard Cheruiyot" },
            { name: "Konoin", mp: "Yegon, Brighton Leonard" }
        ]
    },
    {
        code: "37", county: "Kakamega", governor: "Fernandes Barasa",
        constituencies: [
            { name: "Lugari", mp: "Nabii, Nabwera Daraja" },
            { name: "Likuyani", mp: "Mugabe, Innocent Maino" },
            { name: "Malava", mp: "Ndakwa, David Athman" },
            { name: "Lurambi", mp: "Mukhwana, Titus Khamala" },
            { name: "Navakholo", mp: "Wangwe, Emmanuel" },
            { name: "Mumias West", mp: "Naicca, Johnson Manya" },
            { name: "Mumias East", mp: "Salasya, Peter Kalerwa" },
            { name: "Matungu", mp: "Nabulindo, Peter Oscar" },
            { name: "Butere", mp: "Mwale, Nicholas S. Tindi" },
            { name: "Khwisero", mp: "Wangaya, Christopher Aseka" },
            { name: "Shinyalu", mp: "Ikana, Frederick Lusuli" },
            { name: "Ikolomani", mp: "Shinali, Bernard Masaka" }
        ]
    },
    {
        code: "38", county: "Vihiga", governor: "Wilber Ottichilo",
        constituencies: [
            { name: "Vihiga", mp: "Kagesi, Kivai Ernest Ogesi" },
            { name: "Sabatia", mp: "Logova, Sloyn Clement" },
            { name: "Hamisi", mp: "Gimose, Charles Gumini" },
            { name: "Luanda", mp: "Oyugi, Dick Maungu" },
            { name: "Emuhaya", mp: "Omboko, Milemba Jeremiah" }
        ]
    },
    {
        code: "39", county: "Bungoma", governor: "Ken Lusaka",
        constituencies: [
            { name: "Mt.Elgon", mp: "Chesebe, Fred Kapondi" },
            { name: "Sirisia", mp: "Koyi, John Waluke" },
            { name: "Kabuchai", mp: "Kalasinga, Joseph Simiyu Wekesa Majimbo" },
            { name: "Bumula", mp: "Wamboka, Nelson Jack Wamboka" },
            { name: "Kanduyi", mp: "Makali, John Okwisia" },
            { name: "Webuye East", mp: "Wanyonyi, Martin Pepela" },
            { name: "Webuye West", mp: "Sitati, Daniel Wanyama" },
            { name: "Kimilili", mp: "Mutua, Didmus Wekesa Barasa" },
            { name: "Tongaren", mp: "Murumba, John Chikati" }
        ]
    },
    {
        code: "40", county: "Busia", governor: "Paul Otuoma",
        constituencies: [
            { name: "Teso North", mp: "Oku, Edward Kaunya" },
            { name: "Teso South", mp: "Otucho, Mary Emaase" },
            { name: "Nambale", mp: "Mulanya, Geoffrey Ekesa" },
            { name: "Matayos", mp: "Odanga, Geoffrey Makokha" },
            { name: "Butula", mp: "Ovula, Joseph II. Maero" },
            { name: "Funyula", mp: "Oundo, Wilberforce Ojiambo" },
            { name: "Budalangi", mp: "Wanjala, Raphael Sauti Bitta" }
        ]
    },
    {
        code: "41", county: "Siaya", governor: "James Orengo",
        constituencies: [
            { name: "Ugenya", mp: "Ochieng, David Ouma" },
            { name: "Ugunja", mp: "Omondi, Moses Okoth" },
            { name: "Alego Usonga", mp: "Atandi Samuel Onunga" },
            { name: "Gem", mp: "Odhiambo, Elisha Ochieng" },
            { name: "Bondo", mp: "Ogolla, Gideon Ochanda" },
            { name: "Rarieda", mp: "Amollo, Paul Otiende" }
        ]
    },
    {
        code: "42", county: "Kisumu", governor: "Anyang' Nyong'o",
        constituencies: [
            { name: "Kisumu East", mp: "Ahmed, Shakeel Ahmed Shabbir" },
            { name: "Kisumu West", mp: "Buyu, Rozaah Akinyi" },
            { name: "Kisumu Central", mp: "Oron, Joshua Odongo" },
            { name: "Seme", mp: "Nyikal, James Wambura" },
            { name: "Nyando", mp: "Odoyo, Okello Jared" },
            { name: "Muhoroni", mp: "Oyoo, James Onyango" },
            { name: "Nyakach", mp: "Owuor, Joshua Aduma" }
        ]
    },
    {
        code: "43", county: "Homa Bay", governor: "Gladys Wanga",
        constituencies: [
            { name: "Kasipul", mp: "Ong'ondo Boyd Were" },
            { name: "Kabondo Kasipul", mp: "Obara, Eve Akinyi" },
            { name: "Karachuonyo", mp: "Okuome, Andrew Adipo" },
            { name: "Rangwe", mp: "Gogo, Lilian Achieng" },
            { name: "Homa Bay Town", mp: "Kaluma, George Peter Opondo" },
            { name: "Ndhiwa", mp: "Owino, Martin Peters" },
            { name: "Mbita", mp: "" },
            { name: "Suba", mp: "Omondi, Caroli" }
        ]
    },
    {
        code: "44", county: "Migori", governor: "Ochilo Ayacko",
        constituencies: [
            { name: "Rongo", mp: "Abuor, Paul" },
            { name: "Awendo", mp: "Owino, John Walter" },
            { name: "Suna East", mp: "Mohamed, Junet Sheikh Nuh" },
            { name: "Suna West", mp: "Masara, Peter Francis" },
            { name: "Uriri", mp: "Nyamita, Mark Ogolla" },
            { name: "Nyatike", mp: "Odege, Tom Mboya" },
            { name: "Kuria West", mp: "Robi, Mathias Nyamabe" },
            { name: "Kuria East", mp: "Kemero, Maisori Marwa Kitayama" }
        ]
    },
    {
        code: "45", county: "Kisii", governor: "Simba Arati",
        constituencies: [
            { name: "Bonchari", mp: "Onchoke Charles" },
            { name: "South Mugirango", mp: "Onyiego, Silvanus Osoro" },
            { name: "Bomachoge Borabu", mp: "Momanyi, Innocent Obiri" },
            { name: "Bobasi", mp: "" },
            { name: "Bomachoge Chache", mp: "Alfah, Miruka Ondieki" },
            { name: "Nyaribari Masaba", mp: "Manduku, Daniel Ogwoka" },
            { name: "Nyaribari Chache", mp: "Jhanda Zaheer" },
            { name: "Kitutu Chache North", mp: "Mokaya, Nyakundi Japheth" },
            { name: "Kitutu Chache South", mp: "Kibagendi, Antoney" }
        ]
    },
    {
        code: "46", county: "Nyamira", governor: "Amos Nyaribo",
        constituencies: [
            { name: "Kitutu Masaba", mp: "Gisairo, Clive Ombane" },
            { name: "West Mugirango", mp: "Mogaka, Stephen M." },
            { name: "North Mugirango", mp: "Nyamoko, Joash Nyamache" },
            { name: "Borabu", mp: "Osero, Patrick Kibagendi" }
        ]
    },
    {
        code: "47", county: "Nairobi", governor: "Johnson Sakaja",
        constituencies: [
            { name: "Westlands", mp: "Wetangula, Timothy Wanyonyi" },
            { name: "Dagoretti North", mp: "Flachi, Beatrice Kadeveresia" },
            { name: "Dagoretti South", mp: "Waweru, John Kiarie" },
            { name: "Langata", mp: "Khodhe, Phelix Odiwuor" },
            { name: "Kibra", mp: "Orero, Peter Ochieng" },
            { name: "Roysambu", mp: "Mwafrika, Augustine Kamande" },
            { name: "Kasarani", mp: "Karauri, Ronald Kamwiko" },
            { name: "Ruaraka", mp: "Francis, Kajwang' Tom Joseph" },
            { name: "Embakasi South", mp: "Mawathe, Julius Musili" },
            { name: "Embakasi North", mp: "Gakuya, James Mwangi" },
            { name: "Embakasi Central", mp: "Gathiru, Mejadonk Benjamin" },
            { name: "Embakasi East", mp: "Ongili, Babu Owino Paul" },
            { name: "Embakasi West", mp: "Mwenje, Mark Samuel Muriithi" },
            { name: "Makadara", mp: "Omwera, George Aladwa" },
            { name: "Kamukunji", mp: "Hassan, Abdi Yusuf" },
            { name: "Starehe", mp: "Maina, Mwago Amos" },
            { name: "Mathare", mp: "Oluoch, Anthony Tom" }
        ]
    },
];

/** Look up a county's governor by county name */
export function getGovernor(countyName: string): string {
    return KENYA_LEADERS.find(c => c.county === countyName)?.governor ?? '';
}

/** Look up an MP by county name + constituency name */
export function getMP(countyName: string, constituencyName: string): string {
    const county = KENYA_LEADERS.find(c => c.county === countyName);
    return county?.constituencies.find(c => c.name === constituencyName)?.mp ?? '';
}
