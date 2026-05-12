import { useState, useRef, useEffect } from "react";

const IMG={
  logo:"/logo.jpg",
  warning_cmp:"/warning-cmp.jpg",
  fan:"/fan.jpg",
  open_pf:"/open-pf.jpg",
  box_open:"/box-open.jpg",
  prints_line:"/prints-line.jpg",
  inside:"/inside.jpg",
  inside_blur:"/inside_blur.jpg",
  outside:"/outside.jpg",
  outside_blur:"/outside_blur.jpg",
  // ── vues coffret studio ──
  coffrets_flat:"/coffrets-flat.jpg",
  coffret_gf_closed:"/coffret-gf-closed.jpg",
  coffret_pf_print:"/coffret-pf-print.jpg",
  coffret_detail:"/coffret-detail.jpg",
  open_pf_2:"/open-pf-2.jpg",
  // ── portraits bio ──
  portrait_sm:"/portrait-sm.jpg",
  portrait_av:"/portrait-av.jpg",
  portrait_duo:"/portrait-duo.jpg",
};
const VID={gate:"/gate.mp4",full:"/full.mp4"};
const LANGS=["FR","EN","ES","PT","DE","IT","中","日"];

const PRINTS=[
  {id:1,num:"I",   src:"/tirage-01.jpg",tech:"Poème · Croix dorée",                                origLangs:["FR","PT","EN"],bz:[{t:42,l:52,w:34,h:30,lb:"— Je suis Moneypenis —"}]},
  {id:2,num:"II",  src:"/tirage-02.jpg",tech:"Lettre manuscrite · Encre marine · Sculpture",       origLangs:["FR","EN"],     bz:[{t:5,l:30,w:50,h:38,lb:"— dear sir —"}]},
  {id:3,num:"III", src:"/tirage-03.jpg",tech:"Photographie couleur · Texte jaune",                 origLangs:["FR","PT","EN"],bz:[{t:2,l:8,w:84,h:52,lb:"— j'ai tant voyagé —"}]},
  {id:4,num:"IV",  src:"/tirage-04.jpg",tech:"Tirage argentique · Encre verte manuscrite",         origLangs:["FR"],          bz:[{t:5,l:15,w:70,h:52,lb:"— été 2023 —"}]},
  {id:5,num:"V",   src:"/tirage-05.jpg",tech:"Photo couleur · Texte rouge · Cravate Hermès",       origLangs:["FR","PT","EN"],bz:[{t:10,l:30,w:50,h:40,lb:"— je déguise mes désirs —"}]},
  {id:6,num:"VI",  src:"/tirage-06.jpg",tech:"Photographie couleur · Jean ouvert · Nature",        origLangs:["FR"],          bz:[{t:15,l:28,w:44,h:38,lb:"— open air —"}]},
  {id:7,num:"VII", src:"/tirage-07.jpg",tech:"Photo teintée cyan · Lettre manuscrite orange",      origLangs:["FR","EN"],     bz:[{t:18,l:28,w:56,h:75,lb:""}]},
  {id:8,num:"VIII",src:"/tirage-08.jpg",tech:"Texte rouge · NB · Avertissement multilingue",       origLangs:["FR","PT"],     bz:[{t:36,l:25,w:62,h:50,lb:"— WARNING! —"}]},
  {id:9,num:"IX",  src:"/tirage-09.jpg",tech:"Lettre manuscrite · Billets 50€ · Mains",            origLangs:["FR"],          bz:[{t:38,l:28,w:55,h:62,lb:""}]},
  {id:10,num:"X",  src:"/tirage-10.jpg",tech:"Texte rouge · NB · Manifeste",                       origLangs:["FR","PT","EN"],bz:[{t:20,l:38,w:48,h:45,lb:"— je suis moneypenis —"}]},
  {id:11,num:"XI", src:"/tirage-11.jpg",tech:"Lettre manuscrite · Fond fleuri · Encre marine",     origLangs:["FR"],          bz:[]},
];

// ─── Caractéristiques communes à tous les tirages ────────────────────────────
const EDITION={
  year:2024,
  pf:{cm:"30 × 40 cm", in:"11 ¹³⁄₁₆ × 15 ¾ in", count:50},  // Petit Format
  gf:{cm:"50 × 70 cm", in:"19 ¹¹⁄₁₆ × 27 ⁹⁄₁₆ in", count:15}, // Grand Format
  lab:"Traphot, Montrouge",
};
const T={
  FR:{aw:"Contenu Explicite · Adultes Avertis",am:"Ce site présente des œuvres photographiques destinées exclusivement aux adultes avertis.",ap:"+ 18 ans — Version complète",am2:"− 18 ans — Version grand public",nav:["Portfolio","Vidéo","Coffret","In Situ","Shop","Bio & Signature","Presse","Ils en parlent","Contact"],hl:"Édition Limitée · Tirages Argentiques Originaux",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Un Conte de Fées Pop Porn Gay, destiné aux adultes avertis.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Découvrir l'œuvre",pt:"Les 11 Tirages",ps:"Tirages argentiques originaux · Traphot, Montrouge\nSignés et numérotés par Sébastien Moreu & André Vaszkievicz",mg:"Cliquer pour agrandir",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Tirage argentique · Traphot, Montrouge",tx:"Texte",pr:"Œuvre protégée · Filigrane numérique",ct:"Le Coffret",cs:"Portfolio complet · 11 tirages argentiques · Signés & numérotés · Gants inclus",zt:"Chez Vous",zs:"Les œuvres en situation",vt:"Film",vs:"Contenu réservé aux adultes avertis",st:"Acquérir",pft:"Petit Format  30 × 40 cm",pfc:"50 portfolios numérotés 01/50 → 50/50",pfi:"ISBN : 978-2-492649-21-9",gft:"Grand Format  50 × 70 cm",gfc:"15 portfolios numérotés 01/15 → 15/15",gfi:"ISBN : 978-2-492649-20-2",sg:"Signés S.M. & A.V. · Numéro sur chaque tirage · Gants inclus",pd:"Traphot, Montrouge",p1:"Portfolio PF complet",p2:"Tirage séparé PF",p3:"Portfolio GF complet",p4:"Tirage séparé GF",sh:"Transport & Assurance",sb:"Emballage muséal · DHL Express\nFrance 45 € · Europe 95 € · International 180 €\nAssurance incluse",py:"Paiement",pb:"Virement · Carte · PayPal · 3× sans frais",co:"Conditions",cb:"Certificat d'authenticité · Retour 14 jours · TVA selon pays",rv:"Réserver",by:"Acquérir",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — qui rappelle, comme une forme de résignation stylistique, que tout le monde l'a toujours appelé Sébastien — est ce qui arrive quand la discipline et la volonté se refusent à domestiquer l'obsession.\n\nNé le 25 décembre 1972 dans un décor trop parfait pour être innocent — Saint-Tropez — il grandit dans l'ombre de la précision, un père dentiste façonnant des bouches, et du mythe : résistants, marins, disparus, fantômes familiaux qui refusent de rester enterrés. À dix ans, on lui remet un arsenal complet de peinture. Pas un jouet. Une première arme chargée — début d'une collection baroque, celle d'un fou de guerres intimes.\n\nIl ne les rendra jamais. Préférant multiplier ses champs de bataille.\n\nIl avance par déplacements successifs : peinture, livres, images, relations humaines — tout devient matériau, tout peut être réassemblé. Ce qu'il construit n'est pas une œuvre au sens classique, mais un champ de tensions : entre mémoire et invention, fidélité et trahison, contrôle et perte.\n\nIl ne travaille pas pour les institutions. Il les infiltre. Depuis les années 90, dans l'orbite du galeriste Enrico Navarra, il construit une carrière qui refuse les étiquettes : ni tout à fait salarié, ni tout à fait artiste, ni simple éditeur — plutôt une anomalie productive, capable de générer livres, expositions, liens, archives, idées, communication, événements, à une cadence aussi époustouflante que discontinue. Un désordre qui sert de camouflage à cet homme qui détruit méthodiquement tous les cadres censés le contenir.\n\nIl participe activement à la conception et au développement de la collection Made By…, projet éditorial international consacré à la création contemporaine à travers différentes scènes culturelles. Dans ce cadre, il collabore étroitement avec le photographe Simon Schwyzer.\n\nSa relation avec Simon Schwyzer en est le cœur instable : une collaboration devenue dépendance, une amitié transformée en système amoureux. Un couple ? Depuis la mort brutale du photographe suisse, Moreu répond : « Demandez-lui. » Toujours est-il qu'après sa disparition, rien ne s'arrête — au contraire, tout s'intensifie. Travailler devient une manière de retenir, éditer une manière de prolonger, écrire une manière de ne pas céder. Il s'engage dans la préservation et la valorisation de son œuvre, notamment à travers la préparation de la publication de la monographie Made by… Simon Schwyzer.\n\nEn 2017, avec le soutien d'Enrico Navarra, il avait fondé les Éditions Sébastien Moreu, structure indépendante dédiée aux livres d'art, essais et projets éditoriaux transversaux. La mémoire du photographe suisse détruira l'entreprise. Pas les projets.\n\nPlus tard, avec André Vaszkievicz, l'intime change encore de forme. I Love You Moneypenis n'est pas un projet décoratif posé sur leur relation : c'est une collision de texte, d'image, de désir, d'argent, de corps. Une œuvre conçue depuis l'intérieur du lien, sans filtre protecteur. Leur mariage, le 19 octobre 2024 à Saint-Tropez, ne stabilise rien : il rend officiel ce qui débordait déjà.\n\nSon propre travail — collages, textes, dispositifs éditoriaux — relève d'une esthétique de l'exposition. Journaux ouverts, images découpées, mémoire traitée comme matière première. Rien n'est neutre. Tout est impliqué.\n\nPhysiquement, il porte un corps qui ne coopère pas toujours : cœur rapide, tension capricieuse, système sous pression. Et pourtant, il continue, avec des habitudes qui ressemblent parfois à de la défiance, parfois à une indifférence aux conséquences. Pas de récit propre de rédemption ici. Seulement la persistance.\n\nIl aime intensément, archive obsessionnellement, travaille compulsivement, et refuse de simplifier quoi que ce soit.\n\nS'il existe un principe unificateur, c'est celui-ci : Sébastien Moreu ne résout pas ses contradictions, tant il vénère celles des autres.\n\nLes siennes, il les organise — puis il vit à l'intérieur de l'exposition. Cette galerie est sa maison et celle qu'il offre toute entière à ceux qu'il aime, rien n'est jamais pour lui.\n\nPour conclure, il citerait Desproges : « Étonnant non? »",vn:"André Vaszkievicz",vb:"Nom d'artiste d'un créateur protéiforme d'origine slave, né au début des années 90 en Amérique du Sud. Littérature, art contemporain, musique, performance. Sébastien Moreu et André Vaszkievicz se sont mariés le 19 octobre 2024.",prst:"Dossier de Presse",prss:"Dossier de presse en préparation",prsc:"contact@moneypenis.com",plt:"Ils en Parlent",pls:"Revue de presse en préparation",nt:"Contact",ns:"Envoyer",n1:"Nom",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024 · © ESM Saint-Tropez 2024\nISBN PF: 978-2-492649-21-9 · ISBN GF: 978-2-492649-20-2 · INPI n° 4999735 & 4999726 · Filigrane numérique",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Je déclare sur l'honneur être âgé(e) de 18 ans ou plus et être majeur(e) selon la législation de mon pays de résidence.",ck2:"Je reconnais que ce site présente des œuvres photographiques artistiques à caractère explicite, incluant la vente de tirages originaux, et j'accepte d'y accéder en connaissance de cause.",nat:"Note des auteurs",naf:"Les Auteurs tiennent à avertir que la légèreté divertissante du titre et du logo peuvent, comme les visuels et textes explicites des œuvres, donner une impression de désinvolture face à un sujet pourtant grave. Ils rappellent qu'il n'en est rien et que ce conte est né de leurs expériences personnelles. Tous deux en ayant, pour des raisons et à des époques différentes, vécus tous les aspects.\n\nLeur projet artistique commun a pour intention de dissuader quiconque de s'engager dans une activité en prévenant qu'encore aujourd'hui : elle ferme plus de portes qu'elle n'en ouvre et expose à un grand nombre de risques ceux qui la pratiquent et leurs proches. Notamment infections et maladies, en particulier les MST, addictions à l'usage de drogues et alcools… Cette activité, sous quelque forme que ce soit, expose à la précarité, à la dépendance, au rejet social, à la violence, au chantage, aux abus, à la contrainte et aux rackets.\n\nPour ceux, trop rares, qui réussissent à s'en extraire, elle nécessite toujours un accompagnement psychologique à très long terme tant nos sociétés ne leurs laissent d'autres issues que la victimisation ou la honte, voire les deux à la fois.\n\nLes auteurs appellent donc au respect et à la protection des travailleurs du sexe. Sans pour autant disconvenir de la nécessité d'une pénalisation des clients, ils appellent pareillement à un traitement digne de la misère affective, voire de la détresse, qui les conduisent à contrevenir à la Loi. Les auteurs espèrent, de la part du grand public comme des institutions, un plus grand soutien aux associations qui peuvent accompagner les uns comme les autres.\n\nIl ne s'agit en aucun cas ici de lever aveuglément les tabous sur toutes les pratiques, pas plus que de faire scandale… Mais de rappeler l'urgence de se défaire des interdits sociétaux qui sclérosent un débat public qui pourtant se doit d'être serein, et non recouvert d'un habit de morale qui n'a rien à faire là et empêche toute libération de la parole. Ils n'ont aucun doute que s'il est un voile à bannir, c'est celui-ci.\n\nEt par débat, ils entendent évoquer le premier d'entre tous, celui qui devrait se tenir au sein de la famille.\n\nEt puis c'est beau… aussi… une bite !\n\n(Le modèle sélectionné par les artistes n'est pas un travailleur du sexe. Partageant sa vie avec l'un des auteurs, il a tenu à rester anonyme.)\n\nSi les Auteurs ont abordé ce sujet qui les touche, c'est qu'il leur a semblé qu'à notre époque de communication formatée, de censure des réseaux et de renaissance de la pudibonderie, il était plus que jamais nécessaire d'apporter un point de vue créatif et artistique qui reste étrangement absent. Ils ont voulu donner à cet ensemble à la fois la légèreté qui devrait prévaloir lorsqu'on évoque l'amour et le plaisir, et le poids qu'imposent les réalités vécues : avec courage et sans pathos.\n\nIls n'entendent pas se substituer aux choix individuels, pas plus qu'aux lois en vigueur dans des pays souverains comme aux valeurs auxquelles chacun est libre d'adhérer.\n\nEn France — ce n'est pas le cas dans tous les pays même démocratiques — les réponses apportées par la police et la justice, dans le cadre légal d'une lutte essentielle contre le trafic d'êtres humains, se sont améliorées au fur et à mesure des années dans le sens de ce que l'on attend d'un pays moderne. Mais elles le font dans le cadre de l'aspect général et n'apportent pas, ce n'est peut-être pas leur rôle, d'amélioration aux situations individuelles vécues tant par les travailleurs du sexe que par leurs clients. Des associations remplissent discrètement leurs missions malgré la faiblesse de leurs moyens.\n\nTant pour les administrations concernées que pour les associations, des sites Internet existent. Certains très utiles sont sélectionnés et disponibles sur une liste régulièrement mise à jour sur notre propre site Internet : www.moneypenis.com · www.moneypenis.com/prevention",nax:"Lire l'intégralité ▾",nac:"Réduire ▴"},
  EN:{aw:"Explicit Content · For Adults Only",am:"This site presents photographic artworks for informed adults only.",ap:"+ 18 — Full version",am2:"− 18 — Public version",nav:["Portfolio","Film","Box Set","In Situ","Shop","Bio & Signature","Press","Reviews","Contact"],hl:"Limited Edition · Original Silver Gelatin Prints",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"A Gay Pop Porn Fairy Tale, for informed adults.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Discover the work",pt:"The 11 Prints",ps:"Original silver gelatin prints · Traphot, Montrouge\nSigned and numbered by Sébastien Moreu & André Vaszkievicz",mg:"Click to enlarge",tech_info:"2024 · 30 × 40 cm / 11¾ × 15¾ in (50 ed.) · 50 × 70 cm / 19¾ × 27½ in (15 ed.) · Silver gelatin print · Traphot, Montrouge",tx:"Text",pr:"Protected artwork · Digital watermark",ct:"The Box Set",cs:"Complete portfolio · 11 silver gelatin prints · Signed & numbered · Gloves included",zt:"In Situ",zs:"The works in situ",vt:"Film",vs:"Content for informed adults only",st:"Acquire",pft:"Small Format  30 × 40 cm",pfc:"50 portfolios numbered 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Large Format  50 × 70 cm",gfc:"15 portfolios numbered 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signed S.M. & A.V. · Number on each print · Gloves included",pd:"Traphot, Montrouge",p1:"Complete SF portfolio",p2:"Single SF print",p3:"Complete LF portfolio",p4:"Single LF print",sh:"Shipping & Insurance",sb:"Museum packaging · DHL Express\nFrance €45 · Europe €95 · International €180\nInsurance included",py:"Payment",pb:"Bank transfer · Credit card · PayPal · 3× interest-free",co:"Terms",cb:"Certificate of authenticity · 14-day return · VAT by country",rv:"Reserve",by:"Acquire",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — who reminds us, as a kind of stylistic resignation, that everyone has always called him Sébastien — is what happens when discipline and will refuse to domesticate obsession.\n\nBorn on December 25, 1972 in a setting too perfect to be innocent — Saint-Tropez — he grew up in the shadow of precision (a dentist father shaping mouths) and of myth: resistance fighters, sailors, missing men, family ghosts refusing to stay buried. At ten, he is handed a full painting arsenal. Not a toy. A first loaded weapon — the beginning of a baroque collection, that of a man mad for intimate wars.\n\nHe will never return them. Preferring to multiply his battlefields.\n\nHe advances through successive displacements: painting, books, images, human relations — everything becomes material, everything can be reassembled. What he builds is not a work in the classical sense, but a field of tensions: between memory and invention, fidelity and betrayal, control and loss.\n\nHe doesn't work for institutions. He infiltrates them. Since the nineties, in the orbit of gallerist Enrico Navarra, he has built a career that refuses labels: neither quite employee, nor quite artist, nor mere editor — rather a productive anomaly, capable of generating books, exhibitions, links, archives, ideas, communication, events, at a pace as breathtaking as it is discontinuous. A disorder that serves as camouflage for this man who methodically destroys every frame meant to contain him.\n\nHe actively participates in the conception and development of the Made By… collection, an international editorial project devoted to contemporary creation across different cultural scenes. In this context, he collaborates closely with photographer Simon Schwyzer.\n\nHis relationship with Simon Schwyzer is the unstable heart of it: a collaboration become dependency, a friendship transformed into a love system. A couple? Since the brutal death of the Swiss photographer, Moreu answers: \"Ask him.\" Still, after his disappearance, nothing stops — on the contrary, everything intensifies. Working becomes a way of holding on, editing a way of prolonging, writing a way of not giving in. He commits to preserving and promoting Schwyzer's work, notably through the preparation of the monograph Made by… Simon Schwyzer.\n\nIn 2017, with the support of Enrico Navarra, he had founded Éditions Sébastien Moreu, an independent imprint dedicated to art books, essays and transversal editorial projects. The memory of the Swiss photographer will destroy the enterprise. Not the projects.\n\nLater, with André Vaszkievicz, the intimate changes form again. I Love You Moneypenis is not a decorative project laid over their relationship: it is a collision of text, image, desire, money, body. A work conceived from inside the bond, without protective filter. Their marriage, on October 19, 2024 in Saint-Tropez, stabilizes nothing: it makes official what was already overflowing.\n\nHis own work — collages, texts, editorial devices — belongs to an aesthetics of exposure. Open newspapers, cut-out images, memory treated as raw material. Nothing is neutral. Everything is implicated.\n\nPhysically, he carries a body that doesn't always cooperate: rapid heart, capricious tension, system under pressure. And yet he continues, with habits that sometimes resemble defiance, sometimes indifference to consequences. No proper redemption narrative here. Only persistence.\n\nHe loves intensely, archives obsessively, works compulsively, and refuses to simplify anything.\n\nIf there is a unifying principle, it is this: Sébastien Moreu does not resolve his contradictions, so much does he venerate those of others.\n\nHis own, he organizes — then lives inside the exhibition. This gallery is his home and the one he offers entirely to those he loves; nothing is ever for himself.\n\nTo conclude, he would quote Desproges: \"Astonishing, isn't it?\" ",vn:"André Vaszkievicz",vb:"Artist name of a protean creator of Slavic origin, born early 1990s in South America. Literature, contemporary art, music, performance. Sébastien Moreu and André Vaszkievicz were married on October 19, 2024.",prst:"Press Kit",prss:"Press kit in preparation",prsc:"contact@moneypenis.com",plt:"Reviews",pls:"Press review in preparation",nt:"Contact",ns:"Send",n1:"Name",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024 · © ESM Saint-Tropez 2024\nISBN SF: 978-2-492649-21-9 · ISBN LF: 978-2-492649-20-2 · INPI no. 4999735 & 4999726",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"I hereby declare that I am 18 years of age or older and of legal age according to the laws of my country of residence.",ck2:"I acknowledge that this site presents explicit artistic photographic works, including the sale of original prints, and I consent to access it knowingly.",nat:"Authors' Note",naf:"The Authors wish to warn that the entertaining lightness of the title and logo may, like the explicit visuals and texts of the works, give an impression of flippancy toward a subject that is nonetheless serious. They remind us that this is not the case and that this tale was born of their personal experiences. Both having, for different reasons and at different times, lived all of its aspects.\n\nTheir joint artistic project intends to dissuade anyone from engaging in such an activity by warning that even today: it closes more doors than it opens and exposes those who practice it and their loved ones to a great many risks. Notably infections and illnesses, particularly STIs, addictions to drug and alcohol use… This activity, in whatever form, exposes one to precariousness, dependency, social rejection, violence, blackmail, abuse, coercion and racketeering.\n\nFor the too rare few who manage to extract themselves, it always requires very long-term psychological support, so deeply do our societies leave them no other exits than victimization or shame, or indeed both at once.\n\nThe authors therefore call for respect and protection of sex workers. Without denying the need to penalize clients, they likewise call for a dignified treatment of the emotional misery, even distress, that leads them to break the Law. The authors hope, from the general public as much as from institutions, for greater support to associations that can accompany both sides.\n\nThis is in no way about blindly lifting taboos on every practice, nor about creating scandal… But about recalling the urgency of shedding the societal prohibitions that ossify a public debate which ought instead to be serene, not draped in a moral garb that has no place there and that prevents any liberation of speech. They have no doubt that if there is a veil to be cast off, it is this one.\n\nAnd by debate, they mean to invoke the first of them all, the one that should be held within the family.\n\nAnd besides… a cock is beautiful… too !\n\n(The model selected by the artists is not a sex worker. Sharing his life with one of the authors, he insisted on remaining anonymous.)\n\nIf the Authors have addressed this subject that touches them, it is because it seemed to them that in our era of formatted communication, network censorship and resurgent prudery, it was more than ever necessary to bring a creative and artistic perspective that remains strangely absent. They wanted to give this whole both the lightness that should prevail when speaking of love and pleasure, and the weight imposed by lived realities: with courage and without pathos.\n\nThey do not mean to substitute themselves for individual choices, any more than for the laws in force in sovereign countries or the values each is free to embrace.\n\nIn France — and this is not the case in every country, even democratic ones — the responses provided by police and justice, within the legal framework of an essential fight against human trafficking, have improved over the years in the direction one expects of a modern country. But they do so within the general framework and bring no improvement — perhaps it is not their role — to the individual situations experienced both by sex workers and by their clients. Associations quietly carry out their missions despite the meagerness of their means.\n\nFor the relevant administrations as well as for the associations, websites exist. Some particularly useful ones are selected and available on a regularly updated list on our own website: www.moneypenis.com · www.moneypenis.com/prevention",nax:"Read in full ▾",nac:"Collapse ▴"},
  ES:{aw:"Contenido Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versión completa",am2:"− 18 — Versión pública",nav:["Portfolio","Vídeo","Caja","In Situ","Tienda","Bio & Signature","Prensa","Reseñas","Contacto"],hl:"Edición Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"París, 2024",hd:"Un Cuento de Hadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Descubrir",pt:"Los 11 Tirajes",ps:"Copias en plata · Traphot · Firmadas y numeradas",mg:"Clic para ampliar",tech_info:"2024 · 30 × 40 cm (50 ej.) · 50 × 70 cm (15 ej.) · Copia argéntica · Traphot, Montrouge",tx:"Texto",pr:"Obra protegida",ct:"La Caja",cs:"Portfolio completo · 11 copias · Firmadas · Guantes",zt:"In Situ",zs:"Las obras en situación",vt:"Vídeo",vs:"Contenido para adultos",st:"Adquirir",pft:"Pequeño Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Gran Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmadas · Numeradas · Guantes",pd:"Traphot",p1:"Portfolio PF",p2:"Copia PF",p3:"Portfolio GF",p4:"Copia GF",sh:"Transporte",sb:"DHL · Francia 45€ · Europa 95€ · Internacional 180€",py:"Pago",pb:"Transferencia · Tarjeta · PayPal",co:"Condiciones",cb:"Certificado · Devolución 14 días",rv:"Reservar",by:"Adquirir",bt:"Bio & Firmas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que recuerda, como una resignación estilística, que todos siempre lo han llamado Sébastien — es lo que ocurre cuando la disciplina y la voluntad se niegan a domesticar la obsesión.\n\nNacido el 25 de diciembre de 1972 en Saint-Tropez, crece a la sombra de la precisión y del mito familiar. A los diez años recibe un arsenal de pintura: una primera arma cargada, inicio de una colección barroca de guerras íntimas.\n\nDesde los años 90, en la órbita del galerista Enrico Navarra, construye una carrera que rechaza las etiquetas. Participa en la colección Made By…, donde colabora estrechamente con el fotógrafo Simon Schwyzer. Su muerte brutal no detiene nada: al contrario, todo se intensifica.\n\nEn 2017 funda Éditions Sébastien Moreu. Más tarde, con André Vaszkievicz, lo íntimo cambia de forma: I Love You Moneypenis no es decorativo, es una colisión de texto, imagen, deseo, dinero, cuerpo. Su matrimonio el 19 de octubre de 2024 en Saint-Tropez no estabiliza nada: hace oficial lo que ya desbordaba.\n\nSi existe un principio unificador es éste: Sébastien Moreu no resuelve sus contradicciones, tanto venera las de los demás. Las suyas, las organiza — y vive dentro de la exposición.",vn:"André Vaszkievicz",vb:"Creador de origen eslavo, nacido en América del Sur. Casados el 19 de octubre de 2024.",prst:"Prensa",prss:"En preparación",prsc:"contact@moneypenis.com",plt:"Reseñas",pls:"En preparación",nt:"Contacto",ns:"Enviar",n1:"Nombre",n2:"Email",n3:"Mensaje",lg:"© Sébastien Moreu · © André Vaszkievicz · París 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro bajo mi responsabilidad tener 18 años o más y ser mayor de edad según la legislación de mi país de residencia.",ck2:"Reconozco que este sitio presenta obras fotográficas artísticas de carácter explícito, incluyendo la venta de copias originales, y acepto acceder a él con pleno conocimiento.",nat:"Nota de los autores",naf:"Los Autores desean advertir que la ligereza entretenida del título y el logotipo puede, como los visuales y textos explícitos de las obras, dar una impresión de despreocupación frente a un tema sin embargo grave. Recuerdan que no es así y que este cuento nació de sus experiencias personales. Ambos habiendo vivido, por razones distintas y en épocas distintas, todos sus aspectos.\n\nSu proyecto artístico común tiene la intención de disuadir a cualquiera de involucrarse en una actividad advirtiendo que aún hoy: cierra más puertas de las que abre y expone a múltiples riesgos a quienes la practican y a sus allegados. En particular infecciones y enfermedades, especialmente las ITS, adicciones al uso de drogas y alcohol… Esta actividad, en cualquier forma, expone a la precariedad, la dependencia, el rechazo social, la violencia, el chantaje, los abusos, la coacción y los chantajes.\n\nPara los demasiado escasos que logran salir de ella, requiere siempre un acompañamiento psicológico a muy largo plazo, tanto nuestras sociedades no les dejan otra salida que la victimización o la vergüenza, incluso ambas a la vez.\n\nLos autores llaman pues al respeto y a la protección de los trabajadores del sexo. Sin negar la necesidad de penalizar a los clientes, llaman igualmente a un trato digno hacia la miseria afectiva, incluso la angustia, que los lleva a transgredir la Ley. Los autores esperan, tanto del gran público como de las instituciones, un mayor apoyo a las asociaciones que pueden acompañar a unos y a otros.\n\nNo se trata aquí de levantar ciegamente los tabúes sobre todas las prácticas, ni de provocar escándalo… Sino de recordar la urgencia de deshacerse de las prohibiciones sociales que esclerotizan un debate público que sin embargo debería ser sereno, y no cubierto con un manto de moralina que no tiene nada que hacer ahí e impide toda liberación de la palabra. No tienen ninguna duda de que si hay un velo que desterrar, es éste.\n\nY por debate entienden evocar el primero de todos, el que debería celebrarse en el seno de la familia.\n\nY además es bonita… también… una polla !\n\n(El modelo seleccionado por los artistas no es un trabajador del sexo. Compartiendo su vida con uno de los autores, ha querido permanecer anónimo.)\n\nSi los Autores abordaron este tema que les concierne, es porque les pareció que en nuestra época de comunicación estandarizada, de censura en las redes y de renacimiento de la mojigatería, era más necesario que nunca aportar un punto de vista creativo y artístico que sigue estando extrañamente ausente. Quisieron dar a este conjunto tanto la ligereza que debería prevalecer al evocar el amor y el placer, como el peso que imponen las realidades vividas: con valentía y sin patetismo.\n\nNo pretenden sustituirse a las decisiones individuales, ni a las leyes vigentes en países soberanos ni a los valores a los que cada cual es libre de adherirse.\n\nEn Francia — no es el caso en todos los países, incluso democráticos — las respuestas de la policía y la justicia, en el marco legal de una lucha esencial contra el tráfico de seres humanos, han ido mejorando con los años hacia lo que se espera de un país moderno. Pero lo hacen en el marco general y no aportan, quizá no sea su papel, mejoras a las situaciones individuales que viven tanto los trabajadores del sexo como sus clientes. Asociaciones cumplen discretamente con sus misiones a pesar de la debilidad de sus medios.\n\nTanto para las administraciones como para las asociaciones, existen sitios web. Algunos muy útiles están seleccionados y disponibles en una lista actualizada regularmente en nuestro propio sitio web: www.moneypenis.com · www.moneypenis.com/prevention",nax:"Leer todo ▾",nac:"Reducir ▴"},
  PT:{aw:"Conteúdo Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versão completa",am2:"− 18 — Versão pública",nav:["Portfolio","Vídeo","Coffret","In Situ","Loja","Bio & Signature","Imprensa","Críticas","Contacto"],hl:"Edição Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Um Conto de Fadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Descobrir",pt:"As 11 Cópias",ps:"Cópias em prata · Traphot · Assinadas e numeradas",mg:"Clique para ampliar",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Tiragem argêntica · Traphot, Montrouge",tx:"Texto",pr:"Obra protegida",ct:"O Coffret",cs:"Portfolio completo · 11 cópias · Assinadas · Luvas",zt:"In Situ",zs:"As obras em situação",vt:"Vídeo",vs:"Conteúdo para adultos",st:"Adquirir",pft:"Pequeno Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Assinadas · Numeradas · Luvas",pd:"Traphot",p1:"Portfolio PF",p2:"Cópia PF",p3:"Portfolio GF",p4:"Cópia GF",sh:"Transporte",sb:"DHL · França 45€ · Europa 95€ · Internacional 180€",py:"Pagamento",pb:"Transferência · Cartão · PayPal",co:"Condições",cb:"Certificado · Devolução 14 dias",rv:"Reservar",by:"Adquirir",bt:"Bio & Assinaturas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que lembra, como uma resignação estilística, que toda a gente sempre lhe chamou Sébastien — é o que acontece quando a disciplina e a vontade se recusam a domesticar a obsessão.\n\nNascido a 25 de dezembro de 1972 em Saint-Tropez, cresce à sombra da precisão e do mito familiar. Aos dez anos recebe um arsenal de pintura: uma primeira arma carregada, início de uma coleção barroca de guerras íntimas.\n\nDesde os anos 90, na órbita do galerista Enrico Navarra, constrói uma carreira que recusa rótulos. Participa na coleção Made By…, onde colabora estreitamente com o fotógrafo Simon Schwyzer. A morte brutal do fotógrafo suíço não detém nada: pelo contrário, tudo se intensifica.\n\nEm 2017 funda as Éditions Sébastien Moreu. Mais tarde, com André Vaszkievicz, o íntimo muda de forma: I Love You Moneypenis não é decorativo, é uma colisão de texto, imagem, desejo, dinheiro, corpo. O casamento a 19 de outubro de 2024 em Saint-Tropez não estabiliza nada: torna oficial o que já transbordava.\n\nSe existe um princípio unificador é este: Sébastien Moreu não resolve as suas contradições, tanto venera as dos outros. As suas, organiza-as — e vive dentro da exposição.",vn:"André Vaszkievicz",vb:"Criador de origem eslava, nascido na América do Sul. Casados a 19 de outubro de 2024.",prst:"Imprensa",prss:"Em preparação",prsc:"contact@moneypenis.com",plt:"Críticas",pls:"Em preparação",nt:"Contacto",ns:"Enviar",n1:"Nome",n2:"Email",n3:"Mensagem",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro sob minha responsabilidade ter 18 anos ou mais e ser maior de idade segundo a legislação do meu país de residência.",ck2:"Reconheço que este site apresenta obras fotográficas artísticas de carácter explícito, incluindo a venda de tiragens originais, e aceito aceder a ele com pleno conhecimento.",nat:"Nota dos autores",naf:"Os Autores fazem questão de avisar que a leveza divertida do título e do logótipo podem, tal como os visuais e textos explícitos das obras, dar uma impressão de descontração perante um tema, no entanto, grave. Lembram que não é o caso e que este conto nasceu das suas experiências pessoais. Tendo ambos vivido, por razões e em épocas diferentes, todos os seus aspectos.\n\nO seu projeto artístico comum tem a intenção de dissuadir qualquer pessoa de se envolver nesta atividade alertando que, ainda hoje: fecha mais portas do que abre e expõe a inúmeros riscos quem a pratica e os seus próximos. Nomeadamente infeções e doenças, em particular as DST, adições ao uso de drogas e álcool… Esta atividade, sob qualquer forma, expõe à precariedade, à dependência, à rejeição social, à violência, à chantagem, aos abusos, à coação e às extorsões.\n\nPara os poucos demasiados raros que conseguem sair, exige sempre um acompanhamento psicológico a muito longo prazo, tanto as nossas sociedades não lhes deixam outra saída que a vitimização ou a vergonha, ou mesmo as duas ao mesmo tempo.\n\nOs autores apelam portanto ao respeito e à proteção dos trabalhadores do sexo. Sem por isso desconvirem da necessidade de uma penalização dos clientes, apelam igualmente a um tratamento digno da miséria afetiva, ou mesmo da angústia, que os leva a contravir a Lei. Os autores esperam, da parte do grande público como das instituições, um maior apoio às associações que podem acompanhar uns e outros.\n\nNão se trata aqui de levantar cegamente os tabus sobre todas as práticas, nem de fazer escândalo… Mas de lembrar a urgência de nos desfazermos das proibições societais que esclerosam um debate público que deveria ser sereno, e não coberto com um manto moral que nada tem a fazer aí e impede toda libertação da palavra. Não têm dúvida alguma de que, se há um véu a banir, é este.\n\nE por debate, entendem evocar o primeiro de todos, aquele que se deveria realizar no seio da família.\n\nE além disso… é bonita… também… uma pila !\n\n(O modelo selecionado pelos artistas não é um trabalhador do sexo. Partilhando a sua vida com um dos autores, fez questão de permanecer anónimo.)\n\nSe os Autores abordaram este tema que os toca, é porque lhes pareceu que, na nossa era de comunicação formatada, de censura das redes e de renascimento do pudibundismo, era mais que nunca necessário trazer um ponto de vista criativo e artístico que permanece estranhamente ausente. Quiseram dar a este conjunto tanto a leveza que deveria prevalecer ao evocar o amor e o prazer, como o peso imposto pelas realidades vividas: com coragem e sem pathos.\n\nNão pretendem substituir-se às escolhas individuais, nem às leis em vigor em países soberanos nem aos valores aos quais cada um é livre de aderir.\n\nEm França — não é o caso em todos os países, mesmo democráticos — as respostas dadas pela polícia e justiça, no quadro legal de uma luta essencial contra o tráfico de seres humanos, têm vindo a melhorar ao longo dos anos no sentido do que se espera de um país moderno. Mas fazem-no no quadro geral e não trazem, talvez não seja o seu papel, melhorias às situações individuais vividas tanto pelos trabalhadores do sexo como pelos seus clientes. Associações cumprem discretamente as suas missões apesar da fragilidade dos seus meios.\n\nTanto para as administrações como para as associações, existem sites na Internet. Alguns muito úteis estão selecionados e disponíveis numa lista regularmente atualizada no nosso próprio site: www.moneypenis.com · www.moneypenis.com/prevention",nax:"Ler tudo ▾",nac:"Reduzir ▴"},
  DE:{aw:"Expliziter Inhalt",am:"Fotografien für Erwachsene.",ap:"+ 18 — Vollständige Version",am2:"− 18 — Öffentliche Version",nav:["Portfolio","Film","Set","In Situ","Shop","Bio & Signature","Presse","Rezensionen","Kontakt"],hl:"Limitierte Auflage",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Ein Gay Pop Porn Märchen.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Entdecken",pt:"Die 11 Drucke",ps:"Silbergelatinedrucke · Traphot · Signiert",mg:"Zum Vergrößern klicken",tech_info:"2024 · 30 × 40 cm (50 Ex.) · 50 × 70 cm (15 Ex.) · Silbergelatinedruck · Traphot, Montrouge",tx:"Text",pr:"Geschütztes Kunstwerk",ct:"Das Set",cs:"Vollständiges Portfolio · 11 Drucke · Handschuhe",zt:"In Situ",zs:"Die Werke in situ",vt:"Film",vs:"Nur für Erwachsene",st:"Erwerben",pft:"Kleinformat 30×40",pfc:"50 Portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Großformat 50×70",gfc:"15 Portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signiert · Nummeriert · Handschuhe",pd:"Traphot",p1:"Portfolio KF",p2:"Einzeldruck KF",p3:"Portfolio GF",p4:"Einzeldruck GF",sh:"Versand",sb:"DHL · Frankreich 45€ · Europa 95€ · International 180€",py:"Zahlung",pb:"Überweisung · Kreditkarte · PayPal",co:"Bedingungen",cb:"Echtheitszertifikat · 14-tägiges Rückgaberecht",rv:"Reservieren",by:"Erwerben",bt:"Bio & Signaturen",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — der wie eine stilistische Resignation daran erinnert, dass ihn immer alle Sébastien genannt haben — ist das, was geschieht, wenn Disziplin und Wille sich weigern, die Obsession zu zähmen.\n\nGeboren am 25. Dezember 1972 in Saint-Tropez, wächst er im Schatten der Präzision und des Familienmythos auf. Mit zehn erhält er ein vollständiges Malarsenal: eine erste geladene Waffe, Beginn einer barocken Sammlung intimer Kriege.\n\nSeit den 90er Jahren, im Umkreis des Galeristen Enrico Navarra, baut er eine Karriere auf, die Etiketten ablehnt. Er beteiligt sich an der Sammlung Made By…, wo er eng mit dem Fotografen Simon Schwyzer zusammenarbeitet. Dessen brutaler Tod stoppt nichts — im Gegenteil, alles intensiviert sich.\n\n2017 gründet er die Éditions Sébastien Moreu. Später, mit André Vaszkievicz, verändert sich das Intime erneut: I Love You Moneypenis ist nicht dekorativ, sondern eine Kollision aus Text, Bild, Begehren, Geld, Körper. Die Hochzeit am 19. Oktober 2024 in Saint-Tropez stabilisiert nichts — sie offizialisiert, was bereits überlief.\n\nFalls es ein vereinigendes Prinzip gibt, dann dieses: Sébastien Moreu löst seine Widersprüche nicht auf, so sehr verehrt er die der anderen. Seine eigenen ordnet er — und lebt dann im Inneren der Ausstellung.",vn:"André Vaszkievicz",vb:"Vielseitiger Schöpfer slawischer Herkunft. Heirat am 19. Oktober 2024.",prst:"Presse",prss:"In Vorbereitung",prsc:"contact@moneypenis.com",plt:"Rezensionen",pls:"In Vorbereitung",nt:"Kontakt",ns:"Senden",n1:"Name",n2:"Email",n3:"Nachricht",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Ich erkläre hiermit, dass ich 18 Jahre oder älter bin und nach den Gesetzen meines Wohnsitzlandes volljährig bin.",ck2:"Ich erkenne an, dass diese Website explizite künstlerische Fotografien präsentiert, einschließlich des Verkaufs von Originaldrucken, und willige wissentlich in den Zugang ein.",nat:"Anmerkung der Autoren",naf:"Die Autoren möchten darauf hinweisen, dass die unterhaltsame Leichtigkeit von Titel und Logo, ebenso wie die expliziten Bilder und Texte der Werke, den Eindruck einer Unbekümmertheit gegenüber einem dennoch ernsten Thema vermitteln können. Sie erinnern daran, dass dies nicht der Fall ist und dass diese Erzählung aus ihren persönlichen Erfahrungen entstanden ist. Beide haben aus unterschiedlichen Gründen und zu unterschiedlichen Zeiten alle Aspekte erlebt.\n\nIhr gemeinsames künstlerisches Projekt hat die Absicht, jeden davon abzuhalten, sich auf eine Tätigkeit einzulassen, indem sie davor warnen, dass diese auch heute noch: mehr Türen schließt als öffnet und diejenigen, die sie ausüben, und ihre Angehörigen einer Vielzahl von Risiken aussetzt. Insbesondere Infektionen und Krankheiten, vor allem Geschlechtskrankheiten, Drogen- und Alkoholabhängigkeiten… Diese Tätigkeit, in welcher Form auch immer, setzt der Prekarität, der Abhängigkeit, der sozialen Ablehnung, der Gewalt, der Erpressung, dem Missbrauch, dem Zwang und der Schutzgelderpressung aus.\n\nFür die zu wenigen, die es schaffen, sich zu befreien, erfordert sie stets eine sehr langfristige psychologische Begleitung, da unsere Gesellschaften ihnen kaum andere Auswege lassen als Viktimisierung oder Scham, oder sogar beides zugleich.\n\nDie Autoren rufen daher zum Respekt und zum Schutz der Sexarbeiter:innen auf. Ohne die Notwendigkeit einer Bestrafung der Freier in Frage zu stellen, rufen sie ebenso zu einer würdigen Behandlung der emotionalen Not, ja Verzweiflung auf, die diese dazu bringt, gegen das Gesetz zu verstoßen. Die Autoren erhoffen sich, sowohl von der Öffentlichkeit als auch von den Institutionen, eine größere Unterstützung für Vereine, die beide Seiten begleiten können.\n\nEs geht hier keineswegs darum, blindlings die Tabus über sämtliche Praktiken aufzuheben, noch einen Skandal zu schüren… Sondern darum, an die Dringlichkeit zu erinnern, sich von den gesellschaftlichen Verboten zu lösen, die eine öffentliche Debatte versteinern lassen, die jedoch besonnen sein sollte und nicht mit einem moralischen Gewand bedeckt, das dort nichts zu suchen hat und jede Befreiung der Sprache verhindert. Sie haben keinen Zweifel: wenn es einen Schleier zu lüften gilt, dann diesen.\n\nUnd mit Debatte meinen sie die erste von allen, die innerhalb der Familie geführt werden sollte.\n\nUnd außerdem… ist sie schön… auch… ein Schwanz !\n\n(Das vom Künstlerpaar ausgewählte Modell ist kein Sexarbeiter. Da es sein Leben mit einem der Autoren teilt, hat es darauf bestanden, anonym zu bleiben.)\n\nWenn die Autoren sich diesem Thema gewidmet haben, das sie berührt, dann weil es ihnen schien, dass in unserer Zeit der formatierten Kommunikation, der Netzwerk-Zensur und der Renaissance der Prüderie es notwendiger denn je war, eine kreative und künstlerische Perspektive einzubringen, die seltsamerweise abwesend bleibt. Sie wollten diesem Ganzen sowohl die Leichtigkeit verleihen, die beim Evozieren von Liebe und Lust überwiegen sollte, als auch das Gewicht der gelebten Realitäten: mit Mut und ohne Pathos.\n\nSie haben nicht die Absicht, sich an die Stelle individueller Entscheidungen zu setzen, ebenso wenig wie an die Stelle der in souveränen Ländern geltenden Gesetze oder der Werte, denen jede:r frei steht beizutreten.\n\nIn Frankreich — was nicht in allen, selbst demokratischen Ländern der Fall ist — haben sich die Antworten der Polizei und der Justiz, im rechtlichen Rahmen eines wesentlichen Kampfes gegen den Menschenhandel, im Laufe der Jahre in dem Sinne verbessert, den man von einem modernen Land erwartet. Doch sie tun dies im allgemeinen Rahmen und bringen keine Verbesserung — vielleicht ist es nicht ihre Aufgabe — der individuellen Situationen, die sowohl Sexarbeiter:innen als auch ihre Kund:innen erleben. Vereine erfüllen still ihre Aufgaben trotz der Knappheit ihrer Mittel.\n\nSowohl für die zuständigen Verwaltungen als auch für die Vereine existieren Webseiten. Einige sehr nützliche sind ausgewählt und auf einer regelmäßig aktualisierten Liste auf unserer eigenen Website verfügbar: www.moneypenis.com · www.moneypenis.com/prevention",nax:"Vollständig lesen ▾",nac:"Einklappen ▴"},
  IT:{aw:"Contenuto Esplicito",am:"Opere fotografiche per adulti.",ap:"+ 18 — Versione completa",am2:"− 18 — Versione pubblica",nav:["Portfolio","Film","Cofanetto","In Situ","Shop","Bio & Signature","Stampa","Recensioni","Contatto"],hl:"Edizione Limitata",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Parigi, 2024",hd:"Una Fiaba Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Scoprire",pt:"Le 11 Stampe",ps:"Stampe all'argento · Traphot · Firmate",mg:"Clic per ingrandire",tech_info:"2024 · 30 × 40 cm (50 es.) · 50 × 70 cm (15 es.) · Stampa al gelatino-argento · Traphot, Montrouge",tx:"Testo",pr:"Opera protetta",ct:"Il Cofanetto",cs:"Portfolio completo · 11 stampe · Guanti",zt:"In Situ",zs:"Le opere in situazione",vt:"Film",vs:"Contenuto per adulti",st:"Acquisire",pft:"Piccolo Formato 30×40",pfc:"50 portfolio 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolio 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmate · Numerate · Guanti",pd:"Traphot",p1:"Portfolio PF",p2:"Stampa PF",p3:"Portfolio GF",p4:"Stampa GF",sh:"Spedizione",sb:"DHL · Francia 45€ · Europa 95€ · Internazionale 180€",py:"Pagamento",pb:"Bonifico · Carta · PayPal",co:"Condizioni",cb:"Certificato · Reso 14 giorni",rv:"Prenotare",by:"Acquisire",bt:"Bio & Firme",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — che ricorda, come una rassegnazione stilistica, che tutti l'hanno sempre chiamato Sébastien — è ciò che accade quando la disciplina e la volontà si rifiutano di addomesticare l'ossessione.\n\nNato il 25 dicembre 1972 a Saint-Tropez, cresce all'ombra della precisione e del mito familiare. A dieci anni gli consegnano un arsenale completo di pittura: una prima arma carica, inizio di una collezione barocca di guerre intime.\n\nDagli anni '90, nell'orbita del gallerista Enrico Navarra, costruisce una carriera che rifiuta le etichette. Partecipa alla collezione Made By…, dove collabora strettamente con il fotografo Simon Schwyzer. La morte brutale del fotografo svizzero non ferma nulla — al contrario, tutto si intensifica.\n\nNel 2017 fonda le Éditions Sébastien Moreu. Più tardi, con André Vaszkievicz, l'intimo cambia di nuovo forma: I Love You Moneypenis non è decorativo, è una collisione di testo, immagine, desiderio, denaro, corpo. Il matrimonio il 19 ottobre 2024 a Saint-Tropez non stabilizza nulla: rende ufficiale ciò che già traboccava.\n\nSe esiste un principio unificatore è questo: Sébastien Moreu non risolve le proprie contraddizioni, tanto venera quelle altrui. Le sue, le organizza — e vive all'interno dell'esposizione.",vn:"André Vaszkievicz",vb:"Creatore di origine slava, nato in Sud America. Sposati il 19 ottobre 2024.",prst:"Stampa",prss:"In preparazione",prsc:"contact@moneypenis.com",plt:"Recensioni",pls:"In preparazione",nt:"Contatto",ns:"Inviare",n1:"Nome",n2:"Email",n3:"Messaggio",lg:"© Sébastien Moreu · © André Vaszkievicz · Parigi 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Dichiaro sotto la mia responsabilità di avere 18 anni o più e di essere maggiorenne secondo la legislazione del mio paese di residenza.",ck2:"Riconosco che questo sito presenta opere fotografiche artistiche di carattere esplicito, inclusa la vendita di stampe originali, e accetto di accedervi consapevolmente.",nat:"Nota degli autori",naf:"Gli Autori desiderano avvertire che la leggerezza divertente del titolo e del logo possono, come i visivi e i testi espliciti delle opere, dare un'impressione di disinvoltura di fronte a un soggetto pur tuttavia grave. Ricordano che non è così e che questo racconto è nato dalle loro esperienze personali. Entrambi avendo, per ragioni e in epoche diverse, vissuto tutti gli aspetti.\n\nIl loro progetto artistico comune ha l'intenzione di dissuadere chiunque dall'impegnarsi in un'attività avvertendo che ancora oggi: chiude più porte di quante ne apra ed espone a numerosi rischi coloro che la praticano e i loro cari. In particolare infezioni e malattie, soprattutto le MST, dipendenze dall'uso di droghe e alcol… Questa attività, in qualsiasi forma, espone alla precarietà, alla dipendenza, al rifiuto sociale, alla violenza, al ricatto, agli abusi, alla coercizione e agli estorsioni.\n\nPer coloro, troppo pochi, che riescono a uscirne, richiede sempre un accompagnamento psicologico a lunghissimo termine, tanto le nostre società non lasciano loro altre uscite che la vittimizzazione o la vergogna, o entrambe insieme.\n\nGli autori invitano quindi al rispetto e alla protezione dei lavoratori del sesso. Senza per questo discutere la necessità di una penalizzazione dei clienti, invitano allo stesso modo a un trattamento dignitoso della miseria affettiva, o persino dell'angoscia, che li conduce a contravvenire alla Legge. Gli autori sperano, da parte del grande pubblico come delle istituzioni, in un maggiore sostegno alle associazioni che possono accompagnare gli uni come gli altri.\n\nNon si tratta qui di sollevare ciecamente i tabù su tutte le pratiche, né di fare scandalo… Ma di ricordare l'urgenza di liberarsi dei divieti sociali che irrigidiscono un dibattito pubblico che dovrebbe invece essere sereno, e non coperto da un abito morale che non ha nulla da fare lì e impedisce ogni liberazione della parola. Non hanno alcun dubbio che, se c'è un velo da bandire, è questo.\n\nE per dibattito, intendono evocare il primo di tutti, quello che dovrebbe tenersi all'interno della famiglia.\n\nE poi è bello… anche… un cazzo !\n\n(Il modello selezionato dagli artisti non è un lavoratore del sesso. Condividendo la sua vita con uno degli autori, ha tenuto a rimanere anonimo.)\n\nSe gli Autori hanno affrontato questo tema che li riguarda, è perché è sembrato loro che nella nostra epoca di comunicazione formattata, di censura delle reti e di rinascita della pudibonderia, fosse più che mai necessario apportare un punto di vista creativo e artistico che resta stranamente assente. Hanno voluto dare a questo insieme sia la leggerezza che dovrebbe prevalere quando si evocano l'amore e il piacere, sia il peso imposto dalle realtà vissute: con coraggio e senza pathos.\n\nNon intendono sostituirsi alle scelte individuali, né alle leggi vigenti in paesi sovrani né ai valori a cui ciascuno è libero di aderire.\n\nIn Francia — non è il caso in tutti i paesi, anche democratici — le risposte fornite dalla polizia e dalla giustizia, nel quadro legale di una lotta essenziale contro la tratta di esseri umani, sono migliorate negli anni nel senso di ciò che ci si aspetta da un paese moderno. Ma lo fanno nel quadro generale e non apportano, forse non è il loro ruolo, miglioramenti alle situazioni individuali vissute sia dai lavoratori del sesso che dai loro clienti. Associazioni svolgono discretamente le loro missioni nonostante la scarsità dei loro mezzi.\n\nSia per le amministrazioni competenti che per le associazioni, esistono siti Internet. Alcuni molto utili sono selezionati e disponibili su una lista regolarmente aggiornata sul nostro stesso sito web: www.moneypenis.com · www.moneypenis.com/prevention",nax:"Leggi tutto ▾",nac:"Riduci ▴"},
  "中":{aw:"限制级内容",am:"成人摄影艺术作品。",ap:"+ 18岁 — 完整版",am2:"− 18岁 — 公开版",nav:["作品集","影片","套装","In Situ","商店","传记 & 签名","新闻","评论","联系"],hl:"限量版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"巴黎，2024",hd:"同志流行色情童话。\nCollection La Grande Librairie de Saint-Tropez®",hc:"探索",pt:"11幅印刷品",ps:"银盐照片 · Traphot · 签名编号",mg:"点击放大",tech_info:"2024 · 30 × 40 厘米（50份）· 50 × 70 厘米（15份）· 银盐照片 · Traphot, Montrouge",tx:"文字",pr:"受保护作品",ct:"套装",cs:"完整作品集 · 11幅 · 手套",zt:"In Situ",zs:"作品展示",vt:"影片",vs:"成人内容",st:"购买",pft:"小格式 30×40",pfc:"50份 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大格式 50×70",gfc:"15份 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"签名 · 编号 · 手套",pd:"Traphot",p1:"小格式套装",p2:"小格式单幅",p3:"大格式套装",p4:"大格式单幅",sh:"运输",sb:"DHL · 法国45€ · 欧洲95€ · 国际180€",py:"支付",pb:"转账 · 信用卡 · PayPal",co:"条款",cb:"证书 · 14天退货",rv:"预订",by:"购买",bt:"传记 & 签名",sn:"Sébastien Moreu",sb2:"让·塞巴斯蒂安·莫罗（Jean Sébastien Moreu）——他以一种风格化的认命姿态提醒人们：大家一直叫他塞巴斯蒂安——是纪律与意志拒绝驯服执念时所诞生的产物。\n\n1972年12月25日生于圣特罗佩，在精确与家族神话的阴影中长大。十岁时获赠一整套绘画工具：第一件上膛的武器，巴洛克式私人战争收藏的开端。\n\n九十年代以来，他在画廊主恩里科·纳瓦拉的轨道上构建了一种拒绝标签的职业生涯。他参与 Made By… 丛书的策划，与摄影师西蒙·施维泽密切合作。瑞士摄影师的猝然离世并未让一切停止——恰恰相反，一切都被加剧。\n\n2017年创立 Éditions Sébastien Moreu。后来与安德烈·瓦兹基耶维奇相遇，亲密关系再度变形：《I Love You Moneypenis》不是装饰性的作品，而是文本、图像、欲望、金钱与身体的碰撞。2024年10月19日在圣特罗佩的婚礼并未让一切稳定，而是将早已溢出的现实正式化。\n\n若存在一个统一原则，那便是：塞巴斯蒂安·莫罗从不解决自己的矛盾，因他过于崇敬他人的矛盾。他将自己的矛盾加以整理——然后住进展览的内部。",vn:"André Vaszkievicz",vb:"斯拉夫裔，南美出生。2024年10月19日结婚。",prst:"新闻",prss:"准备中",prsc:"contact@moneypenis.com",plt:"评论",pls:"准备中",nt:"联系",ns:"发送",n1:"姓名",n2:"邮箱",n3:"留言",lg:"© Sébastien Moreu · © André Vaszkievicz · 巴黎 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"本人郑重声明已满18周岁，并符合本人居住国法律规定的成年年龄。",ck2:"本人知悉本网站展示含露骨内容的艺术摄影作品，包括出售原版印刷品，并自愿访问。",nat:"作者寄语",naf:"作者们希望提醒：标题和标识所带的轻盈娱乐感，以及作品中露骨的视觉与文字，可能给人一种对严肃议题不以为然的印象。他们要强调事实并非如此——这部寓言诞生于他们各自的亲身经历。二人因不同的原因、在不同的时期，亲历过其中的所有面向。\n\n他们共同的艺术项目旨在劝阻任何人投身这项至今仍：关闭比开启更多大门、并将从业者及其亲人暴露于诸多风险之中的活动。尤其是感染与疾病（特别是性传播疾病）、对毒品和酒精的成瘾……无论以何种形式，这项活动都会使人陷入贫困、依附、社会排斥、暴力、勒索、虐待、胁迫与敲诈。\n\n对于极少数得以脱身者，由于社会只为他们留下\"受害者\"或\"羞耻者\"——甚至兼而有之——的出路，他们始终需要极为长期的心理陪伴。\n\n因此，作者呼吁尊重并保护性工作者。在不否认对客户进行刑事处罚之必要性的同时，他们同样呼吁以尊严对待将这些客户引向违法的情感困境乃至精神窘迫。作者期望，无论是公众还是机构，都能给予那些能陪伴双方的协会更多支持。\n\n这里绝非要盲目地打破所有禁忌，也绝非要制造丑闻……而是要提醒：迫切需要摆脱那些使公共讨论僵化的社会禁令——这场讨论本应平静，而非被披上一件本不该在场、阻止一切言说的道德外衣。他们毫不怀疑，如果有一层面纱需要被撕去，正是这一层。\n\n而所谓讨论，他们首先指的是那场最重要的：本应在家庭内部展开的对话。\n\n再说……鸡巴……也很美的！\n\n（艺术家所选的模特并非性工作者。因其与作者之一共同生活，他坚持匿名。）\n\n如果作者触及了这一令他们深切关切的议题，那是因为他们感到：在我们这个被格式化的传播、网络审查与拘谨复兴的时代，比任何时候都更需要一种创造性与艺术性的视角——而这一视角却奇异地缺席。他们希望同时赋予这一整体应有的轻盈——当我们谈论爱与愉悦时——以及现实所施加的重量：以勇气，不带悲情。\n\n他们无意取代个人的选择，也不取代主权国家现行的法律，更不取代每个人自由认同的价值观。\n\n在法国——这并非所有国家、甚至所有民主国家的情况——警察与司法机构在反对人口贩运这一根本斗争的法律框架下所给出的回应，多年来已逐步改善到符合现代国家所应有的水准。但这是在一般层面进行的，对性工作者及其客户所经历的个体处境并无实际改善——这或许本就不是它们的职责。一些协会在资源匮乏的情况下仍默默地履行着自己的使命。\n\n无论是相关行政机构还是协会，都存在相应的网站。其中部分非常有用的网站已被筛选，可在我们网站上定期更新的列表中查阅：www.moneypenis.com · www.moneypenis.com/prevention",nax:"阅读全文 ▾",nac:"收起 ▴"},
  "日":{aw:"成人向",am:"成人向け作品。",ap:"+ 18歳 — 完全版",am2:"− 18歳 — 公開版",nav:["ポートフォリオ","映像","ボックス","In Situ","ショップ","略歴 & 署名","プレス","レビュー","お問合せ"],hl:"限定版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"パリ、2024",hd:"大人のためのゲイ童話。\nCollection La Grande Librairie de Saint-Tropez®",hc:"発見する",pt:"11点のプリント",ps:"銀塩プリント · Traphot · 署名番号",mg:"クリックで拡大",tech_info:"2024 · 30 × 40 cm（50点）· 50 × 70 cm（15点）· 銀塩プリント · Traphot, Montrouge",tx:"テキスト",pr:"保護作品",ct:"ボックスセット",cs:"完全ポートフォリオ · 11点 · 手袋",zt:"In Situ",zs:"作品の展示",vt:"映像",vs:"成人向け",st:"購入",pft:"小サイズ 30×40",pfc:"50部 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大サイズ 50×70",gfc:"15部 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"署名 · 番号 · 手袋",pd:"Traphot",p1:"小セット",p2:"小単品",p3:"大セット",p4:"大単品",sh:"輸送",sb:"DHL · フランス45€ · 欧州95€ · 国際180€",py:"支払い",pb:"振込 · カード · PayPal",co:"条件",cb:"証明書 · 14日返品",rv:"予約",by:"購入",bt:"略歴 & 署名",sn:"Sébastien Moreu",sb2:"ジャン・セバスチャン・モロー — まるで様式的な諦めのように、皆が常に彼を「セバスチャン」と呼んできたと告げる男 — は、規律と意志が執念を飼い慣らすことを拒んだときに生まれるものである。\n\n1972年12月25日、サン＝トロペにて誕生。歯科医の父が形作る口腔の精密さと、家族神話の影のもとで育つ。十歳のとき、絵画道具一式を与えられる。玩具ではない。装填された最初の武器であり、私的な戦争を求める男のバロック的コレクションの始まりである。\n\n90年代以降、ギャラリスト、エンリコ・ナヴァラの軌道上で、彼はあらゆるラベルを拒むキャリアを築く。Made By… コレクションの企画に参画し、スイス人写真家シモン・シュヴァイツァーと深く協働する。彼の急逝は何も停止させない — むしろすべてを加速させる。\n\n2017年、Éditions Sébastien Moreu を設立。のちにアンドレ・ヴァシュキェヴィッチと出会い、親密さは再び形を変える。《I Love You Moneypenis》は装飾的な作品ではなく、テクスト、イメージ、欲望、金銭、身体の衝突である。2024年10月19日、サン＝トロペでの婚姻は何も安定させない — 既に溢れ出ていたものを公式化するに過ぎない。\n\nもし統一原理があるならば、それはこうだ：セバスチャン・モローは自らの矛盾を解決しない。他者の矛盾をあまりに崇めているために。自らの矛盾は整理し — そして、展覧会の内側に住む。",vn:"André Vaszkievicz",vb:"スラブ系クリエーター、南米生まれ。2024年10月19日に結婚。",prst:"プレス",prss:"準備中",prsc:"contact@moneypenis.com",plt:"レビュー",pls:"準備中",nt:"お問合せ",ns:"送信",n1:"名前",n2:"メール",n3:"メッセージ",lg:"© Sébastien Moreu · © André Vaszkievicz · パリ 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"私は18歳以上であり、居住国の法律に基づく成年年齢に達していることを宣言します。",ck2:"本サイトが露骨な内容を含む芸術的写真作品を掲載し、オリジナルプリントの販売を行うことを認識した上で、自らの意志でアクセスすることに同意します。",nat:"作者ノート",naf:"作者たちは次のことを伝えておきたい。タイトルとロゴが帯びる娯楽的な軽さ、そして作品の露骨な視覚と言葉は、本来重い主題に対して軽薄な印象を与えかねない。だが実際はまったく違うのであり、この物語は二人の個人的な経験から生まれたものである。二人とも、理由も時期も異なるが、その全側面を生き抜いてきた。\n\n彼らの共同芸術プロジェクトの意図は、今なおこの活動が：開く扉より閉ざす扉のほうが多く、従事する者とその身近な人々を数多のリスクにさらすという事実を伝え、誰一人として安易にそこに足を踏み入れないよう促すことにある。とりわけ感染症や病気（特に性感染症）、薬物・アルコール依存……。この活動はいかなる形であれ、困窮、依存、社会的排除、暴力、脅迫、虐待、強制、ゆすりへとさらす。\n\nそこから抜け出せた、あまりに数少ない者にとっても、極めて長期的な心理的支援が必要となる。なぜなら、我々の社会は彼らに「犠牲者」か「恥」、あるいはその両方以外の出口をほぼ残さないからである。\n\nゆえに作者たちは、セックスワーカーへの尊重と保護を呼びかける。客の処罰の必要性を否定するわけではないが、同様に、客たちを違法行為へと駆り立てる情緒的悲惨、ときに苦悩に対する尊厳ある扱いをも呼びかける。作者たちは、一般市民にも諸機関にも、双方に伴走できる団体への、より大きな支援を望んでいる。\n\nここではすべての行為に関するタブーを盲目的に解こうとしているのでも、スキャンダルを起こそうとしているのでもない……。むしろ、公共の議論を硬直化させる社会的禁忌から脱する緊急性を訴えているのである — 本来その議論は穏やかであるべきで、場違いな道徳の衣をまとうべきではなく、その衣はあらゆる発話の解放を妨げているからだ。彼らは確信している：もし剥がすべきヴェールがあるとすれば、それはこのヴェールだ、と。\n\nそして議論とは、彼らの言葉で言えば、何よりもまず家庭の中で行われるべき、最も根源的な議論を指している。\n\nそれに……チンコは……美しい！ それもまた、ひとつの事実だ。\n\n（アーティストたちが選んだモデルはセックスワーカーではない。作者の一人と人生を共にしているため、匿名であることを望んだ。）\n\n作者たちがこの自身に深く関わる主題を扱ったのは、今や規格化された伝達、ネットワーク上の検閲、そして禁欲主義の復活する時代において、奇妙なほどに不在のままである創造的・芸術的視点を提示することが、これまでになく必要だと感じたからである。彼らはこの全体に、愛と快楽を語る際に本来優先されるべき軽やかさと、現実が押しつける重さの両方を、勇気をもって、しかし悲愴さなしに与えようとした。\n\n彼らは個人の選択に取って代わるつもりはなく、また主権国家で施行される法律や、各人が自由に同意できる価値観に取って代わるつもりもない。\n\nフランスでは — 民主国家であってもすべての国がそうとは限らないが — 人身売買との本質的な闘いという法的枠組みの中で、警察と司法が提供する対応は、近代国家に期待されるものへと年々改善してきた。しかしそれは一般的な枠組みの中でのことであり、セックスワーカーやその客が経験する個別の状況に改善をもたらすことはない — それは恐らく彼らの役割ではないのだろう。いくつかの団体は、資金不足にもかかわらず、ひそかにその使命を果たしている。\n\n関係行政にも団体にも、ウェブサイトが存在する。とくに有用ないくつかは選別され、私たちのウェブサイト上で定期的に更新されるリストにて閲覧できる：www.moneypenis.com · www.moneypenis.com/prevention",nax:"全文を読む ▾",nac:"閉じる ▴"},
};


const EDS=[{key:"pf",pr:{port:590,single:110},rm:{port:37,tot:50}},{key:"gf",pr:{port:1190,single:180},rm:{port:12,tot:15}}];
const TEXTS = {
  I: {
    FR: `TO WHOM IT MAY CONCERN

JE SUIS LA SOLITUDE QUI SOIGNE TA TRISTESSE
JE SUIS L'HABIT DE L'AMOUR
JE SUIS CE CORPS DÉGUISÉ DE DÉSIRS
JE SUIS CE DÉSIR QUI SOIGNE LE TIEN
JE SUIS CE DÉSIR DANS L'ABÎME DU TIEN.
JE SUIS CE TOTEM, LE PLUS ANCIEN DE TOUS,
JE SUIS LA CHAIR ET LE SANG,
JE SUIS LA PEAU SANS LES OS.
JE SUIS CE TABOU QU'ON VEUT TAIRE,
JE SUIS AUSSI LE RIRE ET LE SOURIRE.
JE SUIS CE SEXE QUE TU VÉNÈRES,
JE SUIS CETTE STATUE PRIMITIVE.
JE SUIS LE BOIS SENSUEL,
JE SUIS LE REPOS ET LA TENSION.
JE SUIS L'OUTIL DU TRAVAILLEUR.
JE SUIS LE CIERGE QUI COULE,
JE SUIS BRÛLANT SOUS LA CROIX ET
JE SUIS CETTE BITE QUE TU ADORES.
JE SUIS CETTE ÉPONGE DE DOUCEUR INFINIE,
JE SUIS CELUI QUI DURE LE TEMPS QUE LE TEMPS PASSE.

JE SUIS MONEYPENIS

TU PEUX M'APPELER "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... ET ALORS ?
JE N'AURAI PAS D'ÉPITAPHE !

DE MA DÉPOUILLE IL NE RESTERA RIEN...
SOUS LA CROIX, JE SERAI ABSENT DE LA TOMBE DE MON MAÎTRE, C'EST LE DESTIN DES SANS OS.
"TRUE LOVE LEAVES NO TRACES"
PSALMODIAIT LE CHANTEUR
JE SUIS MONEYPENIS
SEUL MON CŒUR EST À VENDRE, ET TOI, TU M'AIMES...`,

    EN: `TO WHOM IT MAY CONCERN

I AM THE SOLITUDE THAT HEALS YOUR SADNESS
I AM THE GARMENT OF LOVE
I AM THIS BODY DISGUISED AS DESIRES
I AM THIS DESIRE THAT HEALS YOURS
I AM THIS DESIRE IN THE ABYSS OF YOURS.
I AM THIS TOTEM, THE OLDEST OF ALL,
I AM FLESH AND BLOOD,
I AM SKIN WITHOUT BONES.
I AM THIS TABOO THAT MUST BE SILENCED,
I AM ALSO THE LAUGHTER AND THE SMILE.
I AM THIS SEX THAT YOU WORSHIP,
I AM THIS PRIMITIVE STATUE.
I AM SENSUAL WOOD,
I AM REST AND TENSION.
I AM THE WORKER'S TOOL.
I AM THE BURNING CANDLE,
I AM BURNING UNDER THE CROSS AND
I AM THIS COCK THAT YOU ADORE.
I AM THIS SPONGE OF INFINITE SWEETNESS,
I AM THE ONE WHO LASTS AS LONG AS TIME PASSES.

I AM MONEYPENIS

YOU CAN CALL ME "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... WHO CARES?
I WILL HAVE NO EPITAPH!

NOTHING WILL REMAIN OF MY REMAINS...
UNDER THE CROSS, I WILL BE ABSENT FROM MY MASTER'S GRAVE, THAT IS THE DESTINY OF THE BONELESS.
"TRUE LOVE LEAVES NO TRACES"
THE SINGER WOULD PSALM
I AM MONEYPENIS
ONLY MY HEART IS FOR SALE, AND YOU, YOU LOVE ME...`,

    ES: `PARA QUIEN CORRESPONDA

SOY LA SOLEDAD QUE CURA TU TRISTEZA
SOY EL TRAJE DEL AMOR
SOY ESTE CUERPO DISFRAZADO DE DESEOS
SOY ESTE DESEO QUE CURA EL TUYO
SOY ESTE DESEO EN EL ABISMO DEL TUYO.
SOY ESTE TÓTEM, EL MÁS ANTIGUO DE TODOS,
SOY CARNE Y SANGRE,
SOY LA PIEL SIN HUESOS.
SOY ESTE TABÚ QUE QUIEREN SILENCIAR,
SOY TAMBIÉN LA RISA Y LA SONRISA.
SOY ESTE SEXO QUE VENERAS,
SOY ESTA ESTATUA PRIMITIVA.
SOY MADERA SENSUAL,
SOY EL DESCANSO Y LA TENSIÓN.
SOY LA HERRAMIENTA DEL TRABAJADOR.
SOY LA VELA QUE SE DERRITE,
SOY ARDIENTE BAJO LA CRUZ Y
SOY ESTA POLLA QUE ADORAS.
SOY ESTA ESPONJA DE DULZURA INFINITA,
SOY AQUEL QUE DURA MIENTRAS PASA EL TIEMPO.

SOY MONEYPENIS

PUEDES LLAMARME "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... ¿A QUIÉN LE IMPORTA?
¡NO TENDRÉ EPITAFIO!

NADA QUEDARÁ DE MIS RESTOS...
"TRUE LOVE LEAVES NO TRACES"
SOLO MI CORAZÓN ESTÁ EN VENTA, Y TÚ, TÚ ME AMAS...`,

    PT: `PARA QUEM POSSA INTERESSAR

EU SOU A SOLIDÃO QUE CUIDA DA TUA TRISTEZA
EU SOU O HÁBITO DO AMOR
EU SOU ESTE CORPO DISFARÇADO DE DESEJOS
EU SOU ESTE DESEJO QUE CUIDA DO TEU
EU SOU ESTE DESEJO NO ABISMO DO TEU.
EU SOU ESTE TOTEM, O MAIS ANTIGO DE TODOS,
EU SOU A CARNE E O SANGUE,
EU SOU A PELE SEM OS OSSOS.
EU SOU ESTE TABU QUE QUEREM CALAR,
EU TAMBÉM SOU O RISO E O SORRISO.
EU SOU ESTE SEXO QUE VENERAS,
EU SOU ESTA ESTÁTUA PRIMITIVA.
EU SOU A MADEIRA SENSUAL,
EU SOU O REPOUSO E A TENSÃO.
EU SOU O INSTRUMENTO DO TRABALHADOR.
EU SOU O CÍRIO QUE DERRETE,
EU SOU ARDENTE SOB A CRUZ E
EU SOU ESTE PÉNIS QUE ADORAS.
EU SOU ESTA ESPONJA DE DOÇURA INFINITA,
EU SOU AQUELE QUE DURA O TEMPO QUE O TEMPO PASSA.

EU SOU MONEYPENIS

PODES CHAMAR-ME "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... E DAÍ?
NÃO TEREI EPITÁFIO!

NADA FICARÁ DOS MEUS RESTOS...
"TRUE LOVE LEAVES NO TRACES"
SALMODIAVA O CANTOR
EU SOU MONEYPENIS
SÓ O MEU CORAÇÃO ESTÁ À VENDA, E TU, TU ME AMAS...`,

    DE: `AN WEN AUCH IMMER

ICH BIN DIE EINSAMKEIT, DIE DEINE TRAURIGKEIT HEILT
ICH BIN DAS GEWAND DER LIEBE
ICH BIN DIESER ALS BEGEHREN VERKLEIDETE KÖRPER
ICH BIN DIESES BEGEHREN, DAS DEINS HEILT
ICH BIN DIESES TOTEM, DAS ÄLTESTE VON ALLEN,
ICH BIN FLEISCH UND BLUT,
ICH BIN DIE HAUT OHNE KNOCHEN.
ICH BIN DIESES TABU, DAS VERSCHWIEGEN WERDEN SOLL,
ICH BIN AUCH DAS LACHEN UND DAS LÄCHELN.
ICH BIN DIESES GESCHLECHT, DAS DU VEREHRST,
ICH BIN DIESE PRIMITIVE STATUE.
ICH BIN SINNLICHES HOLZ,
ICH BIN RUHE UND SPANNUNG.
ICH BIN DAS WERKZEUG DES ARBEITERS.
ICH BIN DIE BRENNENDE KERZE,
ICH BIN DIESER SCHWANZ, DEN DU ANBETEST.

ICH BIN MONEYPENIS

DU KANNST MICH "CRAZY WILLY", "GOGODICKY" NENNEN... EGAL!
ICH WERDE KEIN EPITAPH HABEN!

"TRUE LOVE LEAVES NO TRACES"
NUR MEIN HERZ STEHT ZUM VERKAUF, UND DU, DU LIEBST MICH...`,

    IT: `A CHI DI COMPETENZA

SONO LA SOLITUDINE CHE GUARISCE LA TUA TRISTEZZA
SONO IL VESTITO DELL'AMORE
SONO QUESTO CORPO TRAVESTITO DA DESIDERI
SONO QUESTO TOTEM, IL PIÙ ANTICO DI TUTTI,
SONO CARNE E SANGUE,
SONO LA PELLE SENZA OSSA.
SONO QUESTO TABÙ CHE VOGLIONO TACERE,
SONO ANCHE LA RISATA E IL SORRISO.
SONO QUESTO SESSO CHE VENERI,
SONO QUESTA STATUA PRIMITIVA.
SONO LEGNO SENSUALE,
SONO IL RIPOSO E LA TENSIONE.
SONO LO STRUMENTO DELL'OPERAIO.
SONO LA CANDELA CHE BRUCIA,
SONO QUESTO CAZZO CHE ADORI.

SONO MONEYPENIS

PUOI CHIAMARMI "CRAZY WILLY", "GOGODICKY"... CHI SE NE FREGA!
NON AVRÒ EPITAFFIO!

"TRUE LOVE LEAVES NO TRACES"
SOLO IL MIO CUORE È IN VENDITA, E TU, TU MI AMI...`,

    "中": `致有关人士

我是治愈你悲伤的孤独
我是爱的外衣
我是这个伪装成欲望的身体
我是这个最古老的图腾，
我是血肉，
我是没有骨头的皮肤。
我是想要沉默的禁忌，
我也是笑声和微笑。
我是你崇拜的性，
我是这座原始雕像。
我是感性的木头，
我是休息和张力。
我是工人的工具。
我是燃烧的蜡烛，
我是你崇拜的那根。

我是MONEYPENIS

你可以叫我"CRAZY WILLY"、"GOGODICKY"……无所谓！
我不会有墓志铭！

"TRUE LOVE LEAVES NO TRACES"
只有我的心在出售，而你，你爱我……`,

    "日": `関係各位へ

私はあなたの悲しみを癒す孤独
私は愛の衣
私は欲望に変装したこの体
私は最も古いトーテム、
私は肉と血、
私は骨のない皮膚。
私は沈黙させたいこのタブー、
私は笑いと微笑みでもある。
私はあなたが崇拝するこの性、
私はこの原始的な彫像。
私は官能的な木材、
私は休息と緊張。
私は労働者の道具。
私は燃えるろうそく、
私はあなたが崇拝するその器官。

私はMONEYPENIS

"CRAZY WILLY"「GOGODICKY」何でも呼んでいい…どうでもいい！
私には墓碑銘がない！

"TRUE LOVE LEAVES NO TRACES"
売っているのは私の心だけ、そしてあなたは私を愛している……`,
  },

  II: {
    FR: `Cher Monsieur,

Moneypenis mon amour,
mon cœur, mon ange,
je ne trouve pas les mots, je ne trouve pas les mots...
je t'aime voilà tout. Et puis que répondre à une bite qui écrit ?
Un pénis littéraire, un correspondant étranger.
Je ne peux qu'oublier toute pudeur et dignité,
et te répondre je t'aime à bien vouloir le croire.
Je t'aime à en accepter l'impossible, à imaginer que tu t'adresses
à moi. À en rougir un peu, de cette petite honte qui chauffe le visage.

Au point où j'en suis, Moneypenis mon tendre cœur, ma belle bite,
je peux bien te répondre...

Mon épais et faible, mon long et dur tour de passe-passe, pour une semaine ou jusqu'à la fin...

Et puisque tu écris tu dois bien pouvoir lire. Je peux même t'écrire
comme une bite s'il le faut... à en salir ma plume !

Mais tes mots n'existent-ils qu'à mes yeux ?
Une simple politesse poétique qui habille nos échanges ?
Une vue de l'esprit malade et de l'âme triste qui m'habitent ?

Je sais... je sais je sais... seul ton cœur est à vendre !
Seul ton cœur est à vendre et moi je t'aime.
Mais du prix affiché je ne connais ni chiffre ni devise.
I love you Moneypenis... voilà tout !

Ton autre ♥`,

    EN: `Dear Sir,

Moneypenis my love,
my heart, my angel,
I cannot find the words, I cannot find the words...
I love you, that is all. And what to reply to a cock that writes?
A literary penis, a foreign correspondent.
I can only forget all modesty and dignity,
and reply I love you, willing to believe it.
I love you enough to accept the impossible, to imagine that you address yourself
to me. To blush a little, from that small shame that warms the face.

At the point where I am, Moneypenis my tender heart, my beautiful cock,
I can well reply to you...

My thick & weak, my long hard trick, for a week or to the end...

And since you write you must be able to read. I can even write to you
like a cock if need be... enough to dirty my pen!

But do your words only exist in my eyes?
A simple poetic courtesy that dresses our exchanges?
A view of the sick mind and sad soul that inhabit me?

I know... i know i know... your heart only is for sale!
Only your heart is for sale and I love you.
But the price displayed I know neither figure nor currency.
I love you Moneypenis... that is all!

Your other ♥`,

    ES: `Querido Señor,

Moneypenis mi amor,
mi corazón, mi ángel,
no encuentro las palabras, no encuentro las palabras...
te quiero y punto. ¿Y qué responder a una polla que escribe?
Un pene literario, un corresponsal extranjero.
Solo puedo olvidar todo pudor y dignidad,
y responderte te quiero queriendo creerlo.
Te quiero hasta aceptar lo imposible, imaginar que te diriges a mí.
Hasta ruborizarme un poco, de esa pequeña vergüenza que calienta el rostro.

Mi grueso y débil, mi largo y duro truco, por una semana o hasta el final...

Pero ¿tus palabras solo existen ante mis ojos?
¿Una simple cortesía poética que viste nuestros intercambios?

Sé... sé sé... ¡solo tu corazón está en venta!
I love you Moneypenis... ¡y punto!

Tu otro ♥`,

    PT: `Caro Senhor,

Moneypenis meu amor,
meu coração, meu anjo,
não encontro as palavras, não encontro as palavras...
eu te amo, só isso. E o que responder a um pénis que escreve?
Um pénis literário, um correspondente estrangeiro.
Só posso esquecer todo o pudor e dignidade,
e te responder eu te amo querendo acreditar nisso.
Eu te amo a ponto de aceitar o impossível, de imaginar que te diriges a mim.
A ponto de corar um pouco, dessa pequena vergonha que aquece o rosto.

O meu espesso e fraco, o meu longo e duro truque, por uma semana ou até ao fim...

Mas as tuas palavras só existem aos meus olhos?
Uma simples cortesia poética que veste as nossas trocas?
Uma visão do espírito doente e da alma triste que me habitam?

Eu sei... eu sei eu sei... só o teu coração está à venda!
Só o teu coração está à venda e eu te amo.
Mas do preço afixado não conheço nem número nem moeda.
I love you Moneypenis... só isso!

O teu outro ♥`,

    DE: `Sehr geehrter Herr,

Moneypenis meine Liebe,
mein Herz, mein Engel,
ich finde die Worte nicht, ich finde die Worte nicht...
ich liebe dich, das ist alles. Und was einem Schwanz antworten, der schreibt?
Ein literarischer Penis, ein ausländischer Korrespondent.
Ich kann nur alle Scham und Würde vergessen,
und dir antworten ich liebe dich, es glauben wollen.

Mein dicker und schwacher, mein langer harter Trick, für eine Woche oder bis zum Ende...

Aber existieren deine Worte nur in meinen Augen?
Ich weiß... ich weiß ich weiß... nur dein Herz steht zum Verkauf!
I love you Moneypenis... das ist alles!

Dein anderes ♥`,

    IT: `Caro Signore,

Moneypenis amore mio,
il mio cuore, il mio angelo,
non trovo le parole, non trovo le parole...
ti amo, ecco tutto. E cosa rispondere a un cazzo che scrive?
Un pene letterario, un corrispondente straniero.
Posso solo dimenticare ogni pudore e dignità,
e risponderti ti amo volendolo credere.

Il mio spesso e debole, il mio lungo duro trucco, per una settimana o fino alla fine...

Ma le tue parole esistono solo ai miei occhi?
So... so so... solo il tuo cuore è in vendita!
I love you Moneypenis... ecco tutto!

Il tuo altro ♥`,

    "中": `亲爱的先生，

Moneypenis我的爱，
我的心，我的天使，
我找不到词语，我找不到词语……
我爱你，就这样。怎么回复一个会写作的阴茎？
一个文学阴茎，一个外国通讯员。
我只能忘记所有的羞耻和尊严，
回答你我爱你，相信这是真的。

我肥厚而软弱，我漫长而坚硬的把戏，持续一周或直到终点……

但你的话语只存在于我眼中吗？
我知道……只有你的心在出售！
I love you Moneypenis……就这样！

你的另一个♥`,

    "日": `拝啓、

Moneypenis 私の愛、
私の心、私の天使、
言葉が見つからない、言葉が見つからない……
あなたを愛している、それだけ。書くペニスに何と返事をすれば？
文学的なペニス、外国の通信員。
あらゆる慎みと尊厳を忘れるしかない、
あなたを愛していると返事する、信じながら。

私の太くて弱い、長くて硬いトリック、一週間か最後まで…

でもあなたの言葉は私の目にしか存在しないの？
分かっている……売っているのはあなたの心だけ！
I love you Moneypenis……それだけ！

あなたのもう一つ♥`,
  },

  III: {
    FR: `J'AI TANT VOYAGÉ, LES CHAMBRES AVEC VUE SE RESSEMBLENT TOUTES. J'AI TANT VOYAGÉ, VISITÉ DES BOUCHES, PÉNÉTRÉ DES VISAGES, CARESSÉ DES LANGUES. J'AI TANT VOYAGÉ, J'AI DANSÉ DANS LES CAVITÉS LES PLUS SOMBRES QUI RESSEMBLENT AUX CAVITÉS LES PLUS SOMBRES. J'AI TANT VOYAGÉ, JE MÉRITE D'ÊTRE DOUCHÉ PLUS SOUVENT QU'À MON TOUR. J'AI TANT VOYAGÉ, BALANCÉ SOUPLE ENTRE CES CUISSES PUISSANTES QUI ME PORTENT ET SUPPORTENT. J'AI TANT VOYAGÉ, SANS VRAIMENT FUIR. J'AI TANT VOYAGÉ, S'ENFUIR PARFOIS. J'AI TANT VOYAGÉ, SAVONNÉ PAR RESPECT POUR MOI-MÊME, J'AI TANT VOYAGÉ, PARFUMÉ SANS HONTE DE VOUS AUTRES. J'AI TANT VOYAGÉ, SOUMIS AU RYTHME CHALOUPÉ D'UN FRÈRE AGONISANT DANS MON DOS. J'AI TANT VOYAGÉ, J'AI CONNU LES TREMBLEMENTS LES PLUS DÉSESPÉRÉS. J'AI TANT VOYAGÉ, TOUJOURS LAVÉ, TOUJOURS CHOYÉ. J'AI TANT VOYAGÉ, MAIS C'EST LE SENS DE NOS VIES : DANSER, MOURIR EN BAVANT ET RECOMMENCER. J'AI TANT VOYAGÉ, MIRACULÉ, RESSUSCITÉ, SENTANT GLISSER MON DÛ DANS SA POCHE TOUT CONTRE MOI. J'AI PARCOURU LE MONDE CONNU SOUS TANT DE NOMS DIFFÉRENTS : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... J'AI PARCOURU LE MONDE, PARFOIS JE ME SUIS PERDU. J'AI TANT VOYAGÉ QUE, PARFOIS, IL NE RESTE DE MOI QUE CETTE SENSATION QUI RÉSULTE DES "ÁGUAS DE MARÇO"...
J'AI TANT VOYAGÉ, JE SUIS MONEYPENIS ET TOI TU M'AIMES.`,

    EN: `I HAVE TRAVELLED SO MUCH, HOTEL ROOMS WITH A VIEW ALL LOOK THE SAME. I HAVE TRAVELLED SO MUCH, VISITED MOUTHS, PENETRATED FACES, CARESSED TONGUES. I HAVE TRAVELLED SO MUCH, DANCED IN THE DARKEST CAVITIES THAT RESEMBLE THE DARKEST CAVITIES. I HAVE TRAVELLED SO MUCH, I DESERVE TO BE SHOWERED MORE OFTEN THAN MY TURN. I HAVE TRAVELLED SO MUCH, SWAYING GENTLY BETWEEN THOSE POWERFUL THIGHS THAT CARRY AND SUPPORT ME. I HAVE TRAVELLED SO MUCH, WITHOUT REALLY FLEEING. I HAVE TRAVELLED SO MUCH, FLEEING SOMETIMES. I HAVE TRAVELLED SO MUCH, SOAPED OUT OF SELF-RESPECT, PERFUMED WITHOUT SHAME FOR THE REST OF YOU. I HAVE TRAVELLED SO MUCH, SUBJECTED TO THE SWAYING RHYTHM OF A DYING BROTHER ON MY BACK. I HAVE TRAVELLED SO MUCH, I HAVE KNOWN THE MOST DESPERATE TREMORS. I HAVE TRAVELLED SO MUCH, ALWAYS WASHED, ALWAYS PAMPERED. I HAVE TRAVELLED SO MUCH, BUT THAT IS THE MEANING OF OUR LIVES: DANCE, DIE DROOLING AND START AGAIN. I HAVE TRAVELLED SO MUCH, MIRACULOUSLY SAVED, RESURRECTED, FEELING MY DUE SLIDING INTO ITS POCKET RIGHT AGAINST ME. I HAVE TRAVELLED THE WORLD KNOWN BY SO MANY DIFFERENT NAMES: "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... I HAVE TRAVELLED THE WORLD, SOMETIMES I LOST MYSELF. I HAVE TRAVELLED SO MUCH THAT, SOMETIMES, ALL THAT REMAINS OF ME IS THAT SENSATION RESULTING FROM "ÁGUAS DE MARÇO"...
I HAVE TRAVELLED SO MUCH, I AM MONEYPENIS AND YOU LOVE ME.`,

    ES: `HE VIAJADO TANTO, TODAS LAS HABITACIONES CON VISTAS SE PARECEN. HE VIAJADO TANTO, VISITADO BOCAS, PENETRADO ROSTROS, ACARICIADO LENGUAS. HE VIAJADO TANTO, HE BAILADO EN LAS CAVIDADES MÁS OSCURAS QUE SE PARECEN A LAS CAVIDADES MÁS OSCURAS. HE VIAJADO TANTO, MEREZCO SER DUCHADO MÁS A MENUDO QUE CUANDO ME TOCA. HE VIAJADO TANTO, BALANCEADO SUAVE ENTRE ESTOS MUSLOS PODEROSOS QUE ME LLEVAN Y ME SOSTIENEN. HE VIAJADO TANTO, SIN HUIR REALMENTE. HE VIAJADO TANTO, HUIR A VECES. HE VIAJADO TANTO, JABONADO POR RESPETO A MÍ MISMO, HE VIAJADO TANTO, PERFUMADO SIN VERGÜENZA DE LOS DEMÁS. HE VIAJADO TANTO, SOMETIDO AL RITMO CADENCIOSO DE UN HERMANO AGONIZANDO A MIS ESPALDAS. HE VIAJADO TANTO, HE CONOCIDO LOS TEMBLORES MÁS DESESPERADOS. HE VIAJADO TANTO, SIEMPRE LAVADO, SIEMPRE MIMADO. HE VIAJADO TANTO, PERO ESE ES EL SENTIDO DE NUESTRAS VIDAS: BAILAR, MORIR BABEANDO Y VOLVER A EMPEZAR. HE VIAJADO TANTO, MILAGROSO, RESUCITADO, SINTIENDO DESLIZARSE MI TRIBUTO EN SU BOLSILLO CONTRA MÍ. HE RECORRIDO EL MUNDO CONOCIDO BAJO TANTOS NOMBRES DIFERENTES : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... HE RECORRIDO EL MUNDO, A VECES ME HE PERDIDO. HE VIAJADO TANTO QUE, A VECES, SÓLO QUEDA DE MÍ ESA SENSACIÓN QUE RESULTA DE LAS "ÁGUAS DE MARÇO"...
HE VIAJADO TANTO, SOY MONEYPENIS Y TÚ ME AMAS.`,

    PT: `EU VIAJEI TANTO, OS QUARTOS COM VISTA PARECEM-SE TODOS. EU VIAJEI TANTO, VISITEI BOCAS, PENETREI ROSTOS, ACARICIEI LÍNGUAS. EU VIAJEI TANTO, DANCEI NAS CAVIDADES MAIS SOMBRIAS QUE SE PARECEM ÀS CAVIDADES MAIS SOMBRIAS. EU VIAJEI TANTO, MEREÇO SER BANHADO MAIS VEZES DO QUE A MINHA VEZ. EU VIAJEI TANTO, BALANÇADO SUAVE ENTRE ESSAS COXAS PODEROSAS QUE ME PORTAM E SUPORTAM. EU VIAJEI TANTO, SEM VERDADEIRAMENTE FUGIR. EU VIAJEI TANTO, A FUGIR ÀS VEZES. EU VIAJEI TANTO, ENSABOADO POR RESPEITO POR MIM MESMO, PERFUMADO SEM VERGONHA DE VOCÊS. EU VIAJEI TANTO, SUBMETIDO AO RITMO DE UM IRMÃO AGONIZANTE NAS MINHAS COSTAS. EU VIAJEI TANTO, CONHECI OS TREMORES MAIS DESESPERADOS. EU VIAJEI TANTO, SEMPRE LAVADO, SEMPRE MIMADO. EU VIAJEI TANTO, MAS ESSE É O SENTIDO DAS NOSSAS VIDAS: DANÇAR, MORRER A BABAR E RECOMEÇAR. EU PERCORRI O MUNDO CONHECIDO POR TANTOS NOMES DIFERENTES: "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... EU PERCORRI O MUNDO, ÀS VEZES PERDI-ME. EU VIAJEI TANTO QUE, ÀS VEZES, RESTA DE MIM SOMENTE ESSA SENSAÇÃO QUE RESULTA "AS ÁGUAS DE MARÇO"...
EU VIAJEI TANTO, SOU MONEYPENIS E TU ME AMAS.`,

    DE: `ICH BIN SO VIEL GEREIST, ALLE ZIMMER MIT AUSSICHT ÄHNELN SICH. ICH BIN SO VIEL GEREIST, HABE MÜNDER BESUCHT, GESICHTER DURCHDRUNGEN, ZUNGEN LIEBKOST. ICH BIN SO VIEL GEREIST, HABE IN DEN DUNKELSTEN HÖHLEN GETANZT, DIE DEN DUNKELSTEN HÖHLEN ÄHNELN. ICH BIN SO VIEL GEREIST, ICH VERDIENE ES, ÖFTER GEDUSCHT ZU WERDEN ALS AN DER REIHE. ICH BIN SO VIEL GEREIST, GESCHMEIDIG GESCHAUKELT ZWISCHEN DIESEN MÄCHTIGEN SCHENKELN, DIE MICH TRAGEN UND STÜTZEN. ICH BIN SO VIEL GEREIST, OHNE WIRKLICH ZU FLIEHEN. ICH BIN SO VIEL GEREIST, MANCHMAL FLÜCHTEND. ICH BIN SO VIEL GEREIST, EINGESEIFT AUS SELBSTRESPEKT, ICH BIN SO VIEL GEREIST, PARFÜMIERT OHNE SCHAM VOR DEN ANDEREN. ICH BIN SO VIEL GEREIST, DEM SCHAUKELNDEN RHYTHMUS EINES STERBENDEN BRUDERS IN MEINEM RÜCKEN UNTERWORFEN. ICH BIN SO VIEL GEREIST, HABE DAS VERZWEIFELTSTE ZITTERN GEKANNT. ICH BIN SO VIEL GEREIST, STETS GEWASCHEN, STETS VERWÖHNT. ICH BIN SO VIEL GEREIST, DOCH DAS IST DER SINN UNSERES LEBENS: TANZEN, SABBERND STERBEN UND WIEDER VON VORN BEGINNEN. ICH BIN SO VIEL GEREIST, EIN WUNDER, AUFERSTANDEN, FÜHLEND WIE MEIN LOHN IN SEINE TASCHE GLEITET, DICHT AN MIR. ICH BIN DURCH DIE WELT GEZOGEN, BEKANNT UNTER SO VIELEN VERSCHIEDENEN NAMEN : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... ICH BIN DURCH DIE WELT GEZOGEN, MANCHMAL HABE ICH MICH VERLOREN. ICH BIN SO VIEL GEREIST, DASS MANCHMAL NUR JENES GEFÜHL VON MIR BLEIBT, DAS AUS DEN "ÁGUAS DE MARÇO" ENTSTEHT...
ICH BIN SO VIEL GEREIST, ICH BIN MONEYPENIS UND DU LIEBST MICH.`,

    IT: `HO TANTO VIAGGIATO, TUTTE LE STANZE CON VISTA SI ASSOMIGLIANO. HO TANTO VIAGGIATO, VISITATO BOCCHE, PENETRATO VISI, ACCAREZZATO LINGUE. HO TANTO VIAGGIATO, HO DANZATO NELLE CAVITÀ PIÙ SCURE CHE ASSOMIGLIANO ALLE CAVITÀ PIÙ SCURE. HO TANTO VIAGGIATO, MERITO DI ESSERE LAVATO PIÙ SPESSO DEL MIO TURNO. HO TANTO VIAGGIATO, DONDOLATO MORBIDO TRA QUESTE COSCE POTENTI CHE MI PORTANO E MI SOSTENGONO. HO TANTO VIAGGIATO, SENZA DAVVERO FUGGIRE. HO TANTO VIAGGIATO, FUGGIRE A VOLTE. HO TANTO VIAGGIATO, INSAPONATO PER RISPETTO VERSO ME STESSO, HO TANTO VIAGGIATO, PROFUMATO SENZA VERGOGNA DEGLI ALTRI. HO TANTO VIAGGIATO, SOTTOMESSO AL RITMO ONDEGGIANTE DI UN FRATELLO AGONIZZANTE ALLE MIE SPALLE. HO TANTO VIAGGIATO, HO CONOSCIUTO I TREMORI PIÙ DISPERATI. HO TANTO VIAGGIATO, SEMPRE LAVATO, SEMPRE COCCOLATO. HO TANTO VIAGGIATO, MA È IL SENSO DELLE NOSTRE VITE: DANZARE, MORIRE SBAVANDO E RICOMINCIARE. HO TANTO VIAGGIATO, MIRACOLATO, RISUSCITATO, SENTENDO SCIVOLARE IL MIO DOVUTO NELLA SUA TASCA CONTRO DI ME. HO PERCORSO IL MONDO CONOSCIUTO SOTTO TANTI NOMI DIVERSI : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... HO PERCORSO IL MONDO, A VOLTE MI SONO PERDUTO. HO TANTO VIAGGIATO CHE, A VOLTE, DI ME NON RESTA CHE QUELLA SENSAZIONE CHE RISULTA DALLE "ÁGUAS DE MARÇO"...
HO TANTO VIAGGIATO, SONO MONEYPENIS E TU MI AMI.`,

    "中": `我旅行了如此之多，所有带景观的房间都彼此相似。我旅行了如此之多，访问过嘴，穿透过面孔，爱抚过舌头。我旅行了如此之多，在最幽暗的洞穴中起舞，那些洞穴彼此相似。我旅行了如此之多，理应比轮到我时更频繁地被沐浴。我旅行了如此之多，柔软地摇摆于那些托起并支撑着我的强壮大腿之间。我旅行了如此之多，却未曾真正逃离。我旅行了如此之多，有时也逃离。我旅行了如此之多，出于对自己的尊重而被肥皂洗净，旅行了如此之多，毫无羞愧地被你们香水熏染。我旅行了如此之多，臣服于背后那位垂死兄弟摇曳的节奏。我旅行了如此之多，经历过最绝望的颤抖。我旅行了如此之多，永远干净，永远被宠爱。我旅行了如此之多，但这就是我们生命的意义：舞蹈、流着口水死去、再重新开始。我旅行了如此之多，奇迹般地、复活般地，感觉我的报酬滑入紧贴我的口袋里。我以无数不同的名字游历世界："EL FANTASTICO ZOB DELUXE"……"EL CHIBRE DE ORO"……"THICK AMOUR"……"PANZER PéNIS"……"COCK ORICO"……我游历世界，有时我迷失了自己。我旅行了如此之多，以至于有时我身上只剩下那种由"ÁGUAS DE MARçO"（三月的水）所唤起的感觉……
我旅行了如此之多，我是 MONEYPENIS，而你爱我。`,

    "日": `私はあまりに多く旅をしてきた、眺めのある部屋はどれも互いに似ている。あまりに多く旅をしてきた、口を訪れ、顔を貫き、舌を愛撫してきた。あまりに多く旅をしてきた、最も暗い洞窟で踊ってきた、互いに似た最も暗い洞窟で。あまりに多く旅をしてきた、私は自分の順番より頻繁に洗われるに値する。あまりに多く旅をしてきた、私を運び支えるこの力強い太ももの間で柔らかく揺れて。あまりに多く旅をしてきた、本当に逃げることなく。あまりに多く旅をしてきた、時には逃げて。あまりに多く旅をしてきた、自尊心ゆえに石鹸で洗われ、あまりに多く旅をしてきた、お前たち他者の前で恥じることなく香水をまとって。あまりに多く旅をしてきた、背後で死にゆく兄弟の揺れるリズムに服従して。あまりに多く旅をしてきた、最も絶望的な震えを知ってきた。あまりに多く旅をしてきた、常に洗われ、常に甘やかされて。あまりに多く旅をしてきた、しかしそれが我らの生の意味である：踊り、よだれを垂らしながら死に、また始める。あまりに多く旅をしてきた、奇跡的に、復活して、私の報酬が私に密着した彼のポケットへ滑り込むのを感じながら。私はあまりに多くの異なる名で世界を巡ってきた：「EL FANTASTICO ZOB DELUXE」……「EL CHIBRE DE ORO」……「THICK AMOUR」……「PANZER PéNIS」……「COCK ORICO」……世界を巡り、時には自分を見失った。あまりに多く旅をしてきたゆえに、時に私には「ÁGUAS DE MARçO」（三月の水）から生まれるあの感覚しか残らない……
私はあまりに多く旅をしてきた、私はMONEYPENISであり、お前は私を愛している。`,
  },

  IV: {
    FR: `Été 2023

Ton visage apaisé, c'est le portrait de toi que je préfère.
Décoiffé sans excès, les traits détendus, les yeux fermés,
le visage de la sérénité qui me fait t'écrire à l'encre verte.

Hé Money-p

Te souviens-tu de nos joies échangées ?
Ou se perdent-elles avec celles partagées ailleurs ?
Se confondent-elles avec mes moments d'égoïsme banal ?
Avec la fébrilité pressée de mon inexpérience ?
Ou plus tristement s'abîment-elles dans tes larmes ?
Mon tendre arc tendu, Moneypenis écris-moi.
Écris-moi tes propres vices, les lois de ton service
Écris-moi tes désirs, tes rires, tes peurs, et le pire aussi...
Je t'aime.

Ton toujours dévoué autre ♥`,

    EN: `Summer 2023

Your peaceful face, it's the portrait of you I prefer.
Slightly dishevelled, relaxed features, eyes closed,
the face of serenity that makes me write to you in green ink.

Hey Money-p

Do you remember our shared joys?
Or do they get lost with those shared elsewhere?
Do they blend with my moments of ordinary selfishness?
With the hurried excitement of my inexperience?
Or more sadly do they sink in your tears?
My tender drawn bow, Moneypenis write to me.
Write me your own vices, the rules of your service
Write me your desires, your laughter, your fears, and the worst too...
I love you.

Your ever devoted other ♥`,

    ES: `Verano 2023

Tu cara apaciguada, es el retrato tuyo que prefiero.
Despeinado sin exceso, rasgos relajados, ojos cerrados,
el rostro de la serenidad que me hace escribirte con tinta verde.

Oye Money-p

¿Te acuerdas de nuestras alegrías intercambiadas?
¿O se pierden con las compartidas en otro lugar?
¿Se confunden con mis momentos de egoísmo banal?
¿Con la febrilidad apresurada de mi inexperiencia?
¿O más tristemente se arruinan en tus lágrimas?
Mi tierno arco tenso, Moneypenis escríbeme.
Escríbeme tus propios vicios, las leyes de tu servicio
Escríbeme tus deseos, tus risas, tus miedos, y lo peor también...
Te quiero.

Tu siempre dedicado otro ♥`,

    PT: `Verão 2023

O teu rosto apaziguado, é o retrato de ti que prefiro.
Despenteado sem excessos, traços relaxados, olhos fechados,
o rosto da serenidade que me faz escrever-te a tinta verde.

Ei Money-p

Lembras-te das nossas alegrias trocadas?
Ou perdem-se com as partilhadas noutro lugar?
Confundem-se com os meus momentos de egoísmo banal?
Com a febrilidade apressada da minha inexperiência?
Ou mais tristemente estragam-se nas tuas lágrimas?
Meu terno arco tenso, Moneypenis escreve-me.
Escreve-me os teus próprios vícios, as leis do teu serviço
Escreve-me os teus desejos, as tuas risadas, os teus medos, e o pior também...
Eu te amo.

O teu sempre dedicado outro ♥`,

    DE: `Sommer 2023

Dein friedliches Gesicht, das ist das Porträt von dir, das ich bevorzuge.
Leicht zerzaust, entspannte Züge, geschlossene Augen,
das Gesicht der Gelassenheit, das mich dazu bringt, dir mit grüner Tinte zu schreiben.

Hey Money-p

Erinnerst du dich an unsere getauschten Freuden?
Oder gehen sie verloren mit denen, die anderswo geteilt wurden?
Schreib mir deine eigenen Laster, die Regeln deines Dienstes
Schreib mir deine Wünsche, dein Lachen, deine Ängste, und das Schlimmste auch...
Ich liebe dich.

Dein immer ergebenes anderes ♥`,

    IT: `Estate 2023

Il tuo viso pacificato, è il ritratto di te che preferisco.
Scarmigliato senza eccessi, tratti rilassati, occhi chiusi,
il volto della serenità che mi fa scriverti con inchiostro verde.

Ehi Money-p

Ti ricordi delle nostre gioie condivise?
O si perdono con quelle condivise altrove?
Scrivimi i tuoi vizi, le leggi del tuo servizio
Scrivimi i tuoi desideri, le tue risate, le tue paure, e il peggio anche...
Ti amo.

Il tuo sempre devoto altro ♥`,

    "中": `2023年夏

你平静的脸，是我最喜欢的你的样子。
微乱的发，放松的轮廓，闭着的眼睛，
那宁静的面孔让我用绿色墨水给你写信。

嘿 Money-p

你还记得我们交换的快乐吗？
还是它们随着在别处分享的快乐而迷失了？
把你的欲望、笑声、恐惧，还有最糟糕的也写给我……
我爱你。

你永远忠诚的另一个♥`,

    "日": `2023年夏

あなたの穏やかな顔、それが私の好きなあなたの肖像。
少し乱れた髪、くつろいだ表情、閉じた目、
その静けさの顔が私に緑のインクであなたに書かせる。

ねえ Money-p

私たちが交わした喜びを覚えている？
それとも他で分かち合ったものと共に消えてしまった？
あなたの欲望、笑い、恐れ、そして最悪のことも書いてください……
愛しています。

あなたのいつも献身的なもう一つ♥`,
  },

  V: {
    FR: `JE DÉGUISE MES DÉSIRS
J'AI FAIT MIENS CEUX DES AUTRES
MES PLAISIRS RESTENT AVEC MOI
VOUS N'EN SAUREZ JAMAIS RIEN...
PEUT-ÊTRE EST-CE DE M'EN PRIVER ?
JE SUIS LE KINÉ DE VOS CREUX INTIMES
CELUI DE VOS INTIMITÉS SAILLANTES.
VOUS POUVEZ AUSSI JOUER AU MÉDECIN,
JOUER À L'INFIRMIÈRE... PAS L'ANESTHÉSISTE...
JE NE SUIS JAMAIS TROP PATIENT :
LE TEMPS EST COMPTÉ !
JE SUIS MONEYPENIS ET TOI TU M'AIMES...

TU PAYES POUR M'ENROULER DANS LA SOIE DE TA MÈRE,
M'ATTACHER UNE CRAVATE DE NOËL OU LA LAISSE DU CHIEN.
JE SUIS À TOI LE TEMPS QUE LE TEMPS PASSE. C'EST TOUT...
JE N'AI AUCUNE HONTE NI DE TOI NI DE MOI. AS-TU CETTE CHANCE ?
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
TU PEUX AJOUTER MONSIEUR SI ÇA TE FAIT DU BIEN OU SIMPLEMENT M'APPELER :
"MY LITTLE LORD"... "THE FAT LADY BEAT", "JESUS" OU "BABY BEAST"...
"DEEP JOHNNY DEEP"... COMME TU PRÉFÈRES.
JE SUIS ÉPUISÉ DE T'ÉCOUTER, COMME JE SUIS ÉPUISÉ D'AVOIR ÉCOUTÉ D'AUTRES AVANT TOI.
MOI MON TALENT IL EST LÀ, À NU DEVANT TOI. C'EST CE QUE JE SAIS FAIRE, ET JE LE FAIS BIEN.
ALORS TA GUEULE, PAYE ET VIENS ON BAISE.`,

    EN: `I DISGUISE MY DESIRES
I MADE OTHERS' MINE
MY PLEASURES STAY WITH ME
YOU WILL NEVER KNOW THEM...
PERHAPS IT IS TO DEPRIVE MYSELF OF THEM?
I AM THE PHYSIOTHERAPIST OF YOUR INTIMATE HOLLOWS
THE ONE OF YOUR PROTRUDING INTIMACIES.
YOU CAN ALSO PLAY DOCTOR,
PLAY NURSE... NOT ANESTHESIOLOGIST...
I AM NEVER TOO PATIENT:
TIME IS LIMITED!
I AM MONEYPENIS AND YOU LOVE ME...

YOU PAY TO WRAP ME IN YOUR MOTHER'S SILK,
TIE A CHRISTMAS TIE OR A DOG LEASH AROUND ME.
I AM YOURS AS LONG AS TIME PASSES. THAT'S ALL...
I HAVE NO SHAME OF YOU OR OF ME. DO YOU HAVE THAT LUCK?
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
YOU CAN ADD SIR IF IT MAKES YOU FEEL BETTER OR JUST CALL ME:
"MY LITTLE LORD"... "THE FAT LADY BEAT", "JESUS" OR "BABY BEAST"...
"DEEP JOHNNY DEEP"... AS YOU PREFER.
I AM EXHAUSTED FROM LISTENING TO YOU, JUST AS I AM EXHAUSTED FROM HAVING LISTENED TO OTHERS BEFORE YOU.
MY TALENT IS THERE, NAKED BEFORE YOU. THAT IS WHAT I KNOW HOW TO DO, AND I DO IT WELL.
SHUT UP, PAY AND COME, LET'S FUCK.`,

    ES: `OCULTO MIS DESEOS
HE HECHO MÍOS LOS DE LOS DEMÁS
MIS PLACERES PERMANECEN CONMIGO
JAMÁS SABRÉIS NADA DE ELLOS...
¿ACASO ES PRIVARME DE ELLOS?
SOY EL FISIOTERAPEUTA DE VUESTROS HUECOS ÍNTIMOS
EL DE VUESTRAS INTIMIDADES SOBRESALIENTES.
PODÉIS TAMBIÉN JUGAR AL MÉDICO,
JUGAR A LA ENFERMERA... NO AL ANESTESISTA...
NUNCA SOY DEMASIADO PACIENTE :
¡EL TIEMPO ESTÁ CONTADO!
SOY MONEYPENIS Y TÚ ME AMAS...

PAGAS POR ENVOLVERME EN LA SEDA DE TU MADRE,
PONERME UNA CORBATA DE NAVIDAD O LA CORREA DEL PERRO.
SOY TUYO MIENTRAS EL TIEMPO PASE. ESO ES TODO...
NO TENGO VERGÜENZA NI DE TI NI DE MÍ. ¿TIENES TÚ ESA SUERTE?
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
PUEDES AÑADIR SEÑOR SI TE HACE BIEN O LLAMARME SIMPLEMENTE :
"MY LITTLE LORD"... "THE FAT LADY BEAT", "JESUS" O "BABY BEAST"...
"DEEP JOHNNY DEEP"... COMO PREFIERAS.
ESTOY AGOTADO DE ESCUCHARTE, COMO ESTOY AGOTADO DE HABER ESCUCHADO A OTROS ANTES QUE A TI.
MI TALENTO ESTÁ AQUÍ, DESNUDO ANTE TI. ES LO QUE SÉ HACER, Y LO HAGO BIEN.
ASÍ QUE CIERRA LA BOCA, PAGA Y VENGA, FOLLAMOS.`,

    PT: `DISFARÇO OS MEUS DESEJOS
FIZ MEUS OS DOS OUTROS
OS MEUS PRAZERES FICAM COMIGO
NUNCA SABEREIS NADA DELES...
SERÁ PRIVAR-ME DELES?
SOU O FISIOTERAPEUTA DAS VOSSAS CAVIDADES ÍNTIMAS
O DAS VOSSAS INTIMIDADES SALIENTES.
PODEIS TAMBÉM BRINCAR AOS MÉDICOS,
BRINCAR ÀS ENFERMEIRAS... NÃO AO ANESTESISTA...
NUNCA SOU DEMASIADO PACIENTE :
O TEMPO ESTÁ CONTADO!
SOU MONEYPENIS E TU AMAS-ME...

PAGAS PARA ME ENROLAR NA SEDA DA TUA MÃE,
PRENDER-ME UMA GRAVATA DE NATAL OU A TRELA DO CÃO.
SOU TEU ENQUANTO O TEMPO PASSAR. É TUDO...
NÃO TENHO VERGONHA NEM DE TI NEM DE MIM. TENS TU ESSA SORTE?
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
PODES ACRESCENTAR SENHOR SE TE FIZER BEM OU CHAMAR-ME SIMPLESMENTE :
"MY LITTLE LORD"... "THE FAT LADY BEAT", "JESUS" OU "BABY BEAST"...
"DEEP JOHNNY DEEP"... COMO PREFERIRES.
ESTOU EXAUSTO DE TE OUVIR, COMO ESTOU EXAUSTO DE TER OUVIDO OUTROS ANTES DE TI.
O MEU TALENTO ESTÁ AQUI, NU À TUA FRENTE. É O QUE SEI FAZER, E FAÇO-O BEM.
ENTÃO CALA-TE, PAGA E VEM, A GENTE TRANSA.`,

    DE: `ICH TARNE MEINE BEGIERDEN
ICH HABE DIE DER ANDEREN ZU MEINEN GEMACHT
MEINE LÜSTE BLEIBEN BEI MIR
IHR WERDET NIE ETWAS DAVON ERFAHREN...
IST DAS ETWA, MIR ZU ENTSAGEN?
ICH BIN DER PHYSIOTHERAPEUT EURER INTIMEN HÖHLEN
DERJENIGE EURER VORSTEHENDEN INTIMITÄTEN.
IHR DÜRFT AUCH ARZT SPIELEN,
KRANKENSCHWESTER SPIELEN... NICHT ANÄSTHESIST...
ICH BIN NIE ZU GEDULDIG :
DIE ZEIT IST GEZÄHLT!
ICH BIN MONEYPENIS UND DU LIEBST MICH...

DU ZAHLST, UM MICH IN DIE SEIDE DEINER MUTTER ZU WICKELN,
MIR EINE WEIHNACHTSKRAWATTE ODER DIE HUNDELEINE ANZULEGEN.
ICH GEHÖRE DIR, SO LANGE DIE ZEIT VERSTREICHT. DAS IST ALLES...
ICH SCHÄME MICH WEDER FÜR DICH NOCH FÜR MICH. HAST DU DIESES GLÜCK?
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
DU KANNST HERR HINZUFÜGEN, WENN ES DIR GUTTUT, ODER MICH EINFACH NENNEN :
"MY LITTLE LORD"... "THE FAT LADY BEAT", "JESUS" ODER "BABY BEAST"...
"DEEP JOHNNY DEEP"... WIE DU MAGST.
ICH BIN ERSCHÖPFT DAVON, DIR ZUZUHÖREN, WIE ICH ERSCHÖPFT BIN, ANDERE VOR DIR ANGEHÖRT ZU HABEN.
MEIN TALENT IST HIER, NACKT VOR DIR. DAS KANN ICH, UND ICH MACHE ES GUT.
ALSO HALT'S MAUL, ZAHL UND KOMM, WIR FICKEN.`,

    IT: `TRAVESTO I MIEI DESIDERI
HO FATTO MIEI QUELLI DEGLI ALTRI
I MIEI PIACERI RESTANO CON ME
NON NE SAPRETE MAI NULLA...
SARÀ FORSE PRIVARMENE?
SONO IL FISIOTERAPISTA DEI VOSTRI INCAVI INTIMI
QUELLO DELLE VOSTRE INTIMITÀ SPORGENTI.
POTETE ANCHE GIOCARE AL MEDICO,
GIOCARE ALL'INFERMIERA... NON ALL'ANESTESISTA...
NON SONO MAI TROPPO PAZIENTE :
IL TEMPO È CONTATO!
SONO MONEYPENIS E TU MI AMI...

PAGHI PER AVVOLGERMI NELLA SETA DI TUA MADRE,
LEGARMI UNA CRAVATTA NATALIZIA O IL GUINZAGLIO DEL CANE.
SONO TUO PER IL TEMPO CHE IL TEMPO PASSA. È TUTTO...
NON HO ALCUNA VERGOGNA NÉ DI TE NÉ DI ME. HAI TU QUESTA FORTUNA?
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
PUOI AGGIUNGERE SIGNORE SE TI FA BENE O CHIAMARMI SEMPLICEMENTE :
"MY LITTLE LORD"... "THE FAT LADY BEAT", "JESUS" O "BABY BEAST"...
"DEEP JOHNNY DEEP"... COME PREFERISCI.
SONO ESAUSTO DI ASCOLTARTI, COME SONO ESAUSTO DI AVER ASCOLTATO ALTRI PRIMA DI TE.
IL MIO TALENTO È QUI, NUDO DAVANTI A TE. È QUEL CHE SO FARE, E LO FACCIO BENE.
QUINDI CHIUDI LA BOCCA, PAGA E VIENI, SCOPIAMO.`,

    "中": `我伪装我的欲望
我把别人的欲望变成了自己的
我的快乐留在我身边
你永远不会知道……
也许是为了剥夺自己？
我是你私密凹陷的理疗师。
你也可以扮演医生，扮演护士……
我从不太有耐心：时间有限！
我是MONEYPENIS，你爱我……

你付钱让我缠绕在你母亲的丝绸里。
只要时间流逝我就是你的。就这样……
我对你和对我自己都没有羞耻。你有这种运气吗？
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
闭嘴，付钱，过来，我们做爱。`,

    "日": `私は自分の欲望を偽装する
他人の欲望を自分のものにした
私の喜びは私のそばに残る
あなたは決して知らない……
それは自分を奪うためかもしれない？
私はあなたの親密な窪みの理学療法士。
医者ごっこをしてもいい、看護師ごっこでも……
私は決して辛抱強すぎない：時間は限られている！
私はMONEYPENIS、あなたは私を愛している……

あなたはお母さんのシルクで私を包むためにお金を払う。
時間が過ぎる限り私はあなたのもの。それだけ……
あなたにも自分にも恥はない。あなたはその幸運を持っている？
MY NAME IS MONEYPENIS, ONLY MY HEART IS FOR SALE.
黙れ、払え、来い、セックスしよう。`,
  },

  VI: {
    FR: `Open Air\n\n[Image seule — sans texte]`,
    EN: `Open Air\n\n[Image only — no text]`,
    ES: `Open Air\n\n[Solo imagen — sin texto]`,
    PT: `Open Air\n\n[Apenas imagem — sem texto]`,
    DE: `Open Air\n\n[Nur Bild — kein Text]`,
    IT: `Open Air\n\n[Solo immagine — nessun testo]`,
    "中": `Open Air\n\n【仅图像 — 无文字】`,
    "日": `Open Air\n\n【画像のみ — テキストなし】`,
  },

  VII: {
    FR: `Moneypenis,
je n'ai pas les mots alors je vais les emprunter, aussi parfaits qu'ils furent écrits dans d'autres circonstances. Ils sont là dans cette fin d'article, ce petit bout de papier découpé que je garde dans ma poche, que je perds et retrouve depuis des années. Il accompagne si bien ce portrait de toi, beau mais effrayant.
Money-p, mon cher amour, tu n'es pas le premier à qui j'aurais pu citer cette lettre, il était bien réel lui, enfin bien entier le premier... c'est un peu grâce à lui si nous nous sommes connus toi et moi, enfin grâce à lui et par ma faute aussi...
J'ajouterai seulement : je ne t'en aimerai pas moins pour cela mais ne gaspille pas ton talent, ne tourne pas le dos à la chance : la vie ! Ne va pas te foutre en l'air et ceux qui t'aiment avec. Et du côté de l'histoire où je me tiens j'insisterai : ne va pas te balancer triste au bout d'une corde... le néant arrivera bien assez vite.

Ton autre ♥ triste`,

    EN: `Moneypenis,
I don't have the words so I will borrow them, as perfect as they were written in other circumstances. They are there in this end of article, this little piece of cut paper I keep in my pocket, that I lose and find again over the years. It accompanies this portrait of you so well, beautiful but frightening.
Money-p, dear love, you are not the first to whom I could have cited this letter, he was quite real, finally quite whole the first... it is partly thanks to him that we met you and I, well thanks to him and through my fault too...
I will only add: I will not love you less for that but don't waste your talent, don't turn your back on luck: life! Don't go and ruin yourself and those who love you. And on the side of the story where I stand I will insist: don't go and hang yourself sadly at the end of a rope... the void will arrive soon enough.

Your other sad ♥`,

    ES: `Moneypenis,
no tengo las palabras, así que voy a tomarlas prestadas, tan perfectas como fueron escritas en otras circunstancias. Están allí, en el final de ese artículo, ese pedacito de papel recortado que guardo en mi bolsillo, que pierdo y reencuentro desde hace años. Acompaña tan bien ese retrato tuyo, hermoso pero aterrador.
Money-p, mi querido amor, no eres el primero a quien yo habría podido citarle esta carta; él era muy real, entero el primero... es un poco gracias a él si nos hemos conocido tú y yo, gracias a él y por mi culpa también...
Sólo añadiré: no te amaré menos por ello, pero no malgastes tu talento, no le des la espalda a tu suerte: ¡la vida! No vayas a echarlo todo a perder con quienes te aman. Y desde el lado de la historia donde me sostengo insistiré: no vayas a colgarte triste de una cuerda... la nada llegará bastante pronto.

Tu otro ♥ triste`,

    PT: `Moneypenis,
não tenho as palavras, então vou pedi-las emprestadas, tão perfeitas como foram escritas noutras circunstâncias. Estão ali, no fim daquele artigo, naquele pedacinho de papel recortado que guardo no meu bolso, que perco e reencontro há anos. Acompanha tão bem esse retrato teu, belo mas assustador.
Money-p, meu querido amor, não és o primeiro a quem eu teria podido citar esta carta; ele era bem real, inteiro o primeiro... é um pouco graças a ele se nos conhecemos tu e eu, graças a ele e por minha culpa também...
Apenas acrescentarei: não te amarei menos por isso, mas não desperdices o teu talento, não voltes as costas à tua sorte: a vida! Não vás dar cabo de ti e de quem te ama contigo. E do lado da história onde me situo insistirei: não vás pendurar-te triste numa corda... o nada chegará suficientemente depressa.

O teu outro ♥ triste`,

    DE: `Moneypenis,
ich habe nicht die Worte, also werde ich sie mir leihen, so vollkommen wie sie unter anderen Umständen geschrieben wurden. Sie sind dort, am Ende jenes Artikels, in jenem kleinen ausgeschnittenen Papier, das ich in meiner Tasche aufbewahre, das ich seit Jahren verliere und wiederfinde. Es begleitet so gut dieses Porträt von dir, schön aber erschreckend.
Money-p, mein lieber Schatz, du bist nicht der erste, dem ich diesen Brief hätte zitieren können; er war ganz real, der erste, ganz und gar... es ist ein wenig ihm zu verdanken, wenn wir uns kennengelernt haben, du und ich, dank ihm und auch durch meine Schuld...
Ich füge nur hinzu: ich werde dich deswegen nicht weniger lieben, aber verschwende dein Talent nicht, kehre deinem Glück nicht den Rücken: dem Leben! Bring dich nicht um, mit allen, die dich lieben. Und von der Seite der Geschichte, auf der ich stehe, beharre ich: häng dich nicht traurig an einem Strick auf... das Nichts wird schnell genug kommen.

Dein anderes ♥ trauriges`,

    IT: `Moneypenis,
non ho le parole, allora le prenderò in prestito, perfette come furono scritte in altre circostanze. Sono lì, alla fine di quell'articolo, in quel pezzetto di carta ritagliato che tengo in tasca, che perdo e ritrovo da anni. Accompagna così bene questo ritratto di te, bello ma spaventoso.
Money-p, mio caro amore, non sei il primo a cui avrei potuto citare questa lettera; lui era ben reale, intero il primo... è un po' grazie a lui se ci siamo conosciuti tu ed io, grazie a lui e anche per colpa mia...
Aggiungerò soltanto: non ti amerò meno per questo, ma non sprecare il tuo talento, non voltare le spalle alla tua fortuna: la vita! Non andare a rovinarti, e con te quelli che ti amano. E dal lato della storia in cui io sto insisterò: non andare a impiccarti triste in fondo a una corda... il nulla arriverà abbastanza presto.

Il tuo altro ♥ triste`,

    "中": `Moneypenis，
我没有词语，所以我要借用它们，就像它们在其他情况下写得那么完美。它们伴随着你的这幅肖像，美丽但可怕。
不要浪费你的才华，不要背对机遇：生命！不要毁掉自己和爱你的人。我会坚持：不要悲伤地吊死在绳子末端……虚无会来得足够快的。

你悲伤的另一个♥`,

    "日": `Moneypenis、
言葉がないので借りてくる、他の状況で書かれたのと同じくらい完璧に。この言葉はあなたのこの肖像画によく合う、美しいが恐ろしい。
才能を無駄にしないで、幸運に背を向けないで：人生を！自分自身とあなたを愛する人たちを台無しにしないで。そして私は主張する：悲しそうに縄の端にぶら下がらないで……虚無は十分早くやってくる。

あなたの悲しいもう一つ♥`,
  },

  VIII: {
    FR: `ATTENTION ! WARNING ! ATENÇÃO ! OJO ! ACHTUNG !

JE SUIS MONEYPENIS, PARFOIS JE BLESSE, PARFOIS JE PIQUE, JE SUIS MONEYPENIS, VOUS POUVEZ M'ATTACHER, MAIS C'EST MOI QUI VOUS TIENS !
NE CROYEZ PAS QUE JE NE SAIS PAS AIMER, JE NE SAIS FAIRE QUE ÇA. MAIS ACCEPTER D'ÊTRE AIMÉ C'EST UNE TOUT AUTRE HISTOIRE.
PERSONNE NE SAIT CE QUE J'ASPIRE, MAIS QUI LE SAIT VRAIMENT ? C'EST TROP FACILE DE CROIRE QUE CE N'EST QUE L'ARGENT, MAIS JE NE VOUS EN VEUX PAS... IL N'EST PAS FACILE À GAGNER !

WARNING !

JE SUIS MONEYPENIS, ET TOI TU M'AIMES... TOI AUSSI TU M'AIMES`,

    EN: `ATTENTION! WARNING! ATENÇÃO! OJO! ACHTUNG!

I AM MONEYPENIS, SOMETIMES I HURT, SOMETIMES I STING, I AM MONEYPENIS, YOU CAN TIE ME UP, BUT I AM THE ONE WHO HOLDS YOU!
DON'T THINK I DON'T KNOW HOW TO LOVE, THAT'S ALL I KNOW HOW TO DO. BUT ACCEPTING TO BE LOVED IS A WHOLE OTHER STORY.
NOBODY KNOWS WHAT I ASPIRE TO, BUT WHO REALLY DOES? IT'S TOO EASY TO THINK IT'S JUST THE MONEY, BUT I DON'T BLAME YOU... IT'S NOT EASY TO EARN!

WARNING!

I AM MONEYPENIS, AND YOU LOVE ME... YOU TOO LOVE ME`,

    ES: `¡ATENCIÓN! ¡WARNING! ¡ATENÇÃO! ¡OJO! ¡ACHTUNG!

SOY MONEYPENIS, A VECES HIERO, A VECES PICO, SOY MONEYPENIS, PUEDES ATARME, ¡PERO SOY YO QUIEN TE SUJETA!
NO CREAS QUE NO SÉ AMAR, ES LO ÚNICO QUE SÉ HACER. PERO ACEPTAR SER AMADO ES OTRA HISTORIA COMPLETAMENTE DISTINTA.
NADIE SABE LO QUE ASPIRO, PERO ¿QUIÉN LO SABE DE VERDAD? ES DEMASIADO FÁCIL CREER QUE SOLO ES EL DINERO, PERO NO OS LO REPROCHO... ¡NO ES FÁCIL DE GANAR!

WARNING!

SOY MONEYPENIS, Y TÚ ME AMAS... TÚ TAMBIÉN ME AMAS`,

    PT: `ATENÇÃO! WARNING! ATENÇÃO! OJO! ACHTUNG!

EU SOU MONEYPENIS, ÀS VEZES MAGOO, ÀS VEZES PICO, EU SOU MONEYPENIS, PODES AMARRAR-ME, MAS SOU EU QUEM TE SEGURA!
NÃO ACREDITES QUE NÃO SEI AMAR, É SÓ O QUE SEI FAZER. MAS ACEITAR SER AMADO É UMA HISTÓRIA COMPLETAMENTE DIFERENTE.
NINGUÉM SABE O QUE ASPIRO, MAS QUEM SABE DE VERDADE? É DEMASIADO FÁCIL ACREDITAR QUE É SÓ O DINHEIRO, MAS NÃO VOS GUARDO RANCOR... NÃO É FÁCIL DE GANHAR!

WARNING!

EU SOU MONEYPENIS, E TU ME AMAS... TU TAMBÉM ME AMAS`,

    DE: `ACHTUNG! WARNING! ATENÇÃO! OJO! ACHTUNG!

ICH BIN MONEYPENIS, MANCHMAL VERLETZE ICH, MANCHMAL STECHE ICH, ICH BIN MONEYPENIS, DU KANNST MICH FESSELN, ABER ICH BIN DERJENIGE, DER DICH HÄLT!
GLAUB NICHT, DASS ICH NICHT LIEBEN KANN, DAS IST ALLES, WAS ICH KANN. ABER GELIEBT ZU WERDEN AKZEPTIEREN IST EINE GANZ ANDERE GESCHICHTE.
NIEMAND WEISS, WAS ICH ANSTREBE, ABER WER WEISS ES WIRKLICH? ES IST ZU EINFACH ZU DENKEN, ES IST NUR DAS GELD, ABER ICH MACHE EUCH KEINE VORWÜRFE... ES IST NICHT LEICHT ZU VERDIENEN!

WARNING!

ICH BIN MONEYPENIS, UND DU LIEBST MICH... DU AUCH LIEBST MICH`,

    IT: `ATTENZIONE! WARNING! ATENÇÃO! OJO! ACHTUNG!

SONO MONEYPENIS, A VOLTE FERISCO, A VOLTE PUNTO, SONO MONEYPENIS, PUOI LEGARMI, MA SONO IO CHE TI TENGO!
NON CREDERE CHE NON SO AMARE, È L'UNICA COSA CHE SO FARE. MA ACCETTARE DI ESSERE AMATO È TUTT'ALTRA STORIA.
NESSUNO SA COSA ASPIRO, MA CHI LO SA DAVVERO? È TROPPO FACILE CREDERE CHE SIA SOLO IL DENARO, MA NON VE NE VOGLIO... NON È FACILE DA GUADAGNARE!

WARNING!

SONO MONEYPENIS, E TU MI AMI... ANCHE TU MI AMI`,

    "中": `注意！WARNING！ATENÇÃO！OJO！ACHTUNG！

我是MONEYPENIS，有时我伤害，有时我刺痛，我是MONEYPENIS，你可以绑住我，但是握住你的是我！
不要以为我不会爱，这是我唯一会做的事。但接受被爱是完全不同的故事。
没有人知道我渴望什么，但谁真的知道呢？太容易认为只是钱的问题，但我不怪你……钱不容易赚！

WARNING！

我是MONEYPENIS，而你爱我……你也爱我`,

    "日": `注意！WARNING！ATENÇÃO！OJO！ACHTUNG！

私はMONEYPENIS、時に傷つけ、時に刺す、私はMONEYPENIS、縛っていいけど、あなたを掴んでいるのは私だ！
私が愛せないと思わないで、それだけが私にできること。でも愛されることを受け入れるのは全く別の話。
誰も私が何を望んでいるか知らない、でも誰が本当に知っているの？お金のためだけと思うのは簡単すぎる、でも責めない……稼ぐのは簡単じゃない！

WARNING！

私はMONEYPENIS、そしてあなたは私を愛している……あなたも私を愛している`,
  },

  IX: {
    FR: `Moneypenis, mon amour, je te couvrirai volontiers du peu d'or que j'ai. Bientôt tu n'écriras plus, enfin un jour viendra et je ne saurai plus te lire.
Moneypenis, le jour approche de ta disparition dans ma raison retrouvée.
Moneypenis évaporé dans ma triste morale restaurée.
Le jour maudit où mon amour si fort et si sincère se noiera dans ma honte de payer ton amour que je ne mérite pas, quand la honte de moi-même sera devenue le plus fort de mes sentiments.
M'as-tu aimé Moneypenis ? Étais-je assez riche pour nourrir ton âme et satisfaire ton cœur ?
Je connais ta tristesse, je connais ta solitude.
Je connais l'appétit et je sais le dégoût, l'extase et la soumission.
Moneypenis, tes lettres s'effacent une à une, emportant tes mots... je m'en souviens encore.
Moneypenis, à ton tour souviens-toi quand j'aime c'est pour toujours, mais il faut être deux pour s'aimer à jamais. Moneypenis... tu ne me dois rien.

Ton ♥ à jamais.`,

    EN: `Moneypenis, my love, I would willingly cover you with the little gold I have. Soon you will write no more, finally a day will come and I will no longer be able to read you.
Moneypenis, the day approaches of your disappearance into my restored reason.
Moneypenis evaporated in my sad restored morality.
The cursed day when my love so strong and so sincere will drown in my shame of paying for your love that I do not deserve, when shame of myself will have become the strongest of my feelings.
Did you love me Moneypenis? Was I rich enough to feed your soul and satisfy your heart?
I know your sadness, I know your solitude.
I know the appetite and I know the disgust, the ecstasy and the submission.
Moneypenis, your letters fade one by one, carrying away your words... I still remember them.
Moneypenis, in your turn remember that when I love it is forever, but it takes two to love each other forever. Moneypenis... you owe me nothing.

Your ♥ forever.`,

    ES: `Moneypenis, mi amor, te cubriré con gusto del poco oro que tengo. Pronto ya no escribirás, llegará un día en que ya no sabré leerte.
Moneypenis, se acerca el día de tu desaparición en mi razón recobrada.
Moneypenis evaporado en mi triste moral restaurada.
El día maldito en que mi amor tan fuerte y tan sincero se ahogará en mi vergüenza de pagar tu amor que no merezco, cuando la vergüenza de mí mismo se haya vuelto el más fuerte de mis sentimientos.
¿Me amaste, Moneypenis? ¿Era yo lo suficientemente rico para nutrir tu alma y satisfacer tu corazón?
Conozco tu tristeza, conozco tu soledad.
Conozco el apetito y sé el disgusto, el éxtasis y la sumisión.
Moneypenis, tus cartas se borran una a una, llevándose tus palabras... aún las recuerdo.
Moneypenis, recuerda a tu vez que cuando amo es para siempre, pero hay que ser dos para amarse por siempre. Moneypenis... no me debes nada.

Tu ♥ para siempre.`,

    PT: `Moneypenis, meu amor, cobrir-te-ei de bom grado com o pouco ouro que tenho. Em breve já não escreverás, enfim virá um dia em que já não saberei ler-te.
Moneypenis, aproxima-se o dia do teu desaparecimento na minha razão reencontrada.
Moneypenis evaporado na minha triste moral restaurada.
O dia maldito em que o meu amor tão forte e tão sincero se afogará na minha vergonha de pagar o teu amor que não mereço, quando a vergonha de mim mesmo se tornar o mais forte dos meus sentimentos.
Amaste-me, Moneypenis? Era eu suficientemente rico para nutrir a tua alma e satisfazer o teu coração?
Conheço a tua tristeza, conheço a tua solidão.
Conheço o apetite e sei o nojo, o êxtase e a submissão.
Moneypenis, as tuas cartas apagam-se uma a uma, levando as tuas palavras... ainda me lembro delas.
Moneypenis, por tua vez lembra-te de que quando amo é para sempre, mas é preciso ser dois para amar-se para sempre. Moneypenis... nada me deves.

O teu ♥ para sempre.`,

    DE: `Moneypenis, meine Liebe, ich werde dich gerne mit dem wenigen Gold bedecken, das ich habe. Bald wirst du nicht mehr schreiben, eines Tages wird kommen, da ich dich nicht mehr lesen können werde.
Moneypenis, der Tag deines Verschwindens in meiner wiedergefundenen Vernunft naht.
Moneypenis verflüchtigt in meiner traurigen wiederhergestellten Moral.
Der verfluchte Tag, an dem meine so starke und so aufrichtige Liebe ertrinken wird in meiner Scham, deine Liebe zu bezahlen, die ich nicht verdiene, wenn die Scham vor mir selbst zum stärksten meiner Gefühle geworden sein wird.
Hast du mich geliebt, Moneypenis? War ich reich genug, um deine Seele zu nähren und dein Herz zu sättigen?
Ich kenne deine Trauer, ich kenne deine Einsamkeit.
Ich kenne den Appetit und kenne den Ekel, die Ekstase und die Unterwerfung.
Moneypenis, deine Briefe verschwinden einer nach dem anderen und nehmen deine Worte mit... ich erinnere mich noch.
Moneypenis, erinnere du dich nun daran, dass wenn ich liebe, ist es für immer, doch man muss zu zweit sein, um sich für immer zu lieben. Moneypenis... du schuldest mir nichts.

Dein ♥ für immer.`,

    IT: `Moneypenis, amore mio, ti coprirò volentieri del poco oro che ho. Presto non scriverai più, verrà un giorno in cui non saprò più leggerti.
Moneypenis, si avvicina il giorno della tua sparizione nella mia ragione ritrovata.
Moneypenis evaporato nella mia triste morale restaurata.
Il giorno maledetto in cui il mio amore così forte e così sincero affogherà nella mia vergogna di pagare il tuo amore che non merito, quando la vergogna di me stesso sarà diventata il più forte dei miei sentimenti.
Mi hai amato, Moneypenis? Ero abbastanza ricco per nutrire la tua anima e soddisfare il tuo cuore?
Conosco la tua tristezza, conosco la tua solitudine.
Conosco l'appetito e so il disgusto, l'estasi e la sottomissione.
Moneypenis, le tue lettere si cancellano una ad una, portando via le tue parole... me ne ricordo ancora.
Moneypenis, a tua volta ricordati che quando amo è per sempre, ma bisogna essere in due per amarsi per sempre. Moneypenis... non mi devi nulla.

Il tuo ♥ per sempre.`,

    "中": `Moneypenis，我的爱，我愿意用我拥有的少量黄金覆盖你。很快你将不再写作。
Moneypenis，我知道你的悲伤，我知道你的孤独。
我知道欲望和厌恶，狂喜和顺从。
Moneypenis，你的信件一封一封地消失……我还记得它们。
Moneypenis，轮到你记住，当我爱是永远的，但需要两个人才能永远相爱。Moneypenis……你不欠我任何东西。

你的♥永远。`,

    "日": `Moneypenis、私の愛、私が持っているわずかな金でおおっていただろう。まもなくあなたは書かなくなる。
Moneypenis、あなたの悲しみを知っている、あなたの孤独を知っている。
食欲を知っている、嫌悪感を知っている、恍惚と服従を知っている。
Moneypenis、あなたの手紙は一枚一枚消えていく……まだ覚えている。
Moneypenis、あなたの番に覚えていて、私が愛するときは永遠、でも永遠に愛し合うには二人必要。Moneypenis……あなたは私に何も借りていない。

あなたの♥永遠に。`,
  },

  X: {
    FR: `JE SUIS MONEYPENIS
JE SUIS L'OUTIL SANS GLOIRE...
LES ENCEINTES JOUENT À FOND "THE FIRST CUT IS THE DEEPEST"
JE SUIS SEULEMENT L'OUTIL D'UN HOMME AU TRAVAIL.
UN TRAVAILLEUR DU SEXE, UN ESCORT BOY, UN GIGOLO OU...
JE SUIS DUR À LA TÂCHE, JE SUIS DOUX ET FRAGILE...
JE SUIS DE TOUTE MANIÈRE MOINS PUTE QUE MES USAGERS...
JE SUIS MONEYPENIS, J'AI LA FIERTÉ DE PLACER MON HONNEUR BIEN PLUS HAUT QUE LE CUL, LÀ OÙ D'AUTRES IMAGINENT LE LEUR, ET L'HONNEUR DE PLACER MA FIERTÉ TOUT AUSSI HAUT.
PENSEZ DE MOI CE DONT VOUS AUREZ ENVIE, MAIS SOYEZ SANS EXCÈS. AYEZ LE MÊME RESPECT QUE JE DONNE CHAQUE JOUR.
J'AI SU LE PIRE ET GARDE LE MEILLEUR.
ON NE CHOISIT PAS SON TALENT, ON DOIT EN PRENDRE SOIN...
JE SUIS COMME MON MAÎTRE, AU FOND NOUS NE FAISONS QU'UN... LA DÉLICATESSE NOUS FAIT PARFOIS PLEURER. AIGUISEZ VOS COUTEAUX !`,

    EN: `I AM MONEYPENIS
I AM THE TOOL WITHOUT GLORY...
SPEAKERS PLAY LOUDLY "THE FIRST CUT IS THE DEEPEST"
I AM ONLY THE TOOL OF A MAN AT WORK.
A SEX WORKER, AN ESCORT BOY, A GIGOLO OR...
I AM HARD AT WORK, I AM GENTLE AND FRAGILE...
I AM IN ANY CASE LESS OF A WHORE THAN MY USERS...
I AM MONEYPENIS, I HAVE THE PRIDE TO PLACE MY HONOUR MUCH HIGHER THAN THE ASS, WHERE OTHERS IMAGINE THEIRS, AND THE HONOUR TO PLACE MY PRIDE JUST AS HIGH.
THINK OF ME WHAT YOU WILL, BUT WITH MODERATION. HAVE THE SAME RESPECT THAT I GIVE EVERY DAY.
I HAVE KNOWN THE WORST AND KEPT THE BEST.
ONE DOES NOT CHOOSE ONE'S TALENT, ONE MUST TAKE CARE OF IT...
I AM LIKE MY MASTER, DEEP DOWN WE ARE ONE... DELICACY SOMETIMES MAKES US CRY. SHARPEN YOUR KNIVES!`,

    ES: `SOY MONEYPENIS
SOY LA HERRAMIENTA SIN GLORIA...
LOS ALTAVOCES SUENAN A TODO VOLUMEN "THE FIRST CUT IS THE DEEPEST"
SOY SOLO EL INSTRUMENTO DE UN HOMBRE EN EL TRABAJO.
UN TRABAJADOR DEL SEXO, UN ESCORT BOY, UN GIGOLO O...
SOY DURO EN EL TRABAJO, SOY TIERNO Y FRÁGIL...
SOY EN TODO CASO MENOS PUTA QUE MIS USUARIOS...
SOY MONEYPENIS, TENGO EL ORGULLO DE COLOCAR MI HONOR MUCHO MÁS ALTO QUE EL CULO, DONDE OTROS IMAGINAN EL SUYO.
HE CONOCIDO LO PEOR Y GUARDADO LO MEJOR.
NO SE ELIGE EL TALENTO, HAY QUE CUIDARLO...
¡AFILAD VUESTROS CUCHILLOS!`,

    PT: `EU SOU MONEYPENIS
EU SOU O INSTRUMENTO SEM GLÓRIA...
AS COLUNAS TOCAM ALTO "THE FIRST CUT IS THE DEEPEST"
EU SOU APENAS O INSTRUMENTO DE UM HOMEM NO TRABALHO.
UM TRABALHADOR DO SEXO, UM ESCORT BOY, UM GIGOLO OU...
SOU DURO NO TRABALHO, SOU DELICADO E FRÁGIL...
SOU DE QUALQUER MANEIRA MENOS PUTA DO QUE OS MEUS UTILIZADORES...
EU SOU MONEYPENIS, TENHO O ORGULHO DE COLOCAR A MINHA HONRA MUITO MAIS ALTO DO QUE O CU, ONDE OUTROS IMAGINAM O SEU.
CONHECI O PIOR E GUARDEI O MELHOR.
NÃO SE ESCOLHE O TALENTO, É PRECISO CUIDAR DELE...
AFIEM SUAS FACAS!`,

    DE: `ICH BIN MONEYPENIS
ICH BIN DAS WERKZEUG OHNE RUHM...
DIE LAUTSPRECHER SPIELEN LAUT "THE FIRST CUT IS THE DEEPEST"
ICH BIN NUR DAS WERKZEUG EINES MANNES BEI DER ARBEIT.
EIN SEXARBEITER, EIN ESCORT BOY, EIN GIGOLO ODER...
ICH BIN HART BEI DER ARBEIT, ICH BIN SANFT UND ZERBRECHLICH...
ICH HABE DAS SCHLIMMSTE GEWUSST UND DAS BESTE BEHALTEN.
MAN WÄHLT SEIN TALENT NICHT, MAN MUSS ES PFLEGEN...
SCHÄRFT EURE MESSER!`,

    IT: `SONO MONEYPENIS
SONO LO STRUMENTO SENZA GLORIA...
GLI ALTOPARLANTI SUONANO FORTE "THE FIRST CUT IS THE DEEPEST"
SONO SOLO LO STRUMENTO DI UN UOMO AL LAVORO.
UN LAVORATORE DEL SESSO, UN ESCORT BOY, UN GIGOLO O...
SONO DURO AL LAVORO, SONO DELICATO E FRAGILE...
HO CONOSCIUTO IL PEGGIO E TENUTO IL MEGLIO.
NON SI SCEGLIE IL PROPRIO TALENTO, BISOGNA PRENDERSENE CURA...
AFFILATE I VOSTRI COLTELLI!`,

    "中": `我是MONEYPENIS
我是没有荣耀的工具……
音箱大声播放着"THE FIRST CUT IS THE DEEPEST"
我只是一个工作中的男人的工具。
一个性工作者，一个陪伴男孩，一个牛郎……
我工作努力，我温柔脆弱……
无论如何我都不如我的使用者那么婊子……
我知道最坏的，保留了最好的。
人无法选择自己的才能，必须好好照顾它……
磨利你们的刀！`,

    "日": `私はMONEYPENIS
私は栄光のない道具……
スピーカーが大音量で流す"THE FIRST CUT IS THE DEEPEST"
私はただ働く男の道具。
セックスワーカー、エスコートボーイ、ジゴロ……
私は仕事に励み、繊細で壊れやすい……
最悪を知り、最善を保った。
才能は選べない、大切にしなければならない……
ナイフを研げ！`,
  },

  XI: {
    FR: `Moneypenis,                                                    Noël 2023

Toi et ton maître, ce corps qui te porte et l'esprit qui vous emporte, ne faites qu'un... au fond je l'ai toujours su. Et si j'ose te dire je t'aime, à toi, c'est que je l'aime sans oser le lui dire.

J'ai totalement inventé cette correspondance, pas par peur qu'il se moque, non plus que par crainte qu'il n'en abuse, mais pour ne pas le voir fuir ou pire encore... qu'il soit indifférent. Je le sais désormais, c'est bien moi qui ai tout écrit. Tous ces messages, tous mes courriers, moi qui ai posé ces mots sur ces portraits de toi, pris lors de nos vacances et de nos jeux, volés à notre quotidien... J'ai beau en avoir la preuve, là, sous mes yeux que déjà je me surprends à croire que c'est toi qui m'as dicté tes lettres. L'amour est une drôle de maladie parfois.

Même choisie c'est une dure vie que la vôtre, une vie de discipline et de solitude... une vie de sacrifices, un calvaire plus qu'un sacerdoce.
J'ai en tête cette chanson de Brassens « La Complainte des Filles de Joie », Barbara en a interprété une version très personnelle : « dire que ces vaches de bourgeois, dire que ces vaches de bourgeois, nous appellent les filles de joie, nous appellent les filles de joie ! c'est pas tous les jours qu'on rigole, paroles, paroles, c'est pas tous les jours qu'on rigole... les sous croyez pas qu'on les vole ! »

Moneypenis, mon ange, le voleur c'est celui qui paye. Et pourtant si je n'avais pas été ce triste criminel, ce veuf inconsolable, ce minable qui se cherche encore quelque prétexte, je ne vous aurais pas connu.

Moneypenis, un conte de fées c'est aussi simple que ça, c'est toujours un peu tordu, un peu pervers... le récit d'une situation improbable à en devenir incontestable, scandaleuse à en devenir exemplaire. C'est une injustice odieuse à en devenir édifiante et sa transmission essentielle. Un conte de fées est un genre qui tire la vérité du mensonge, la justice de la faute, c'est une manière de conduire l'histoire à marche forcée vers sa morale, et ici vers la nôtre. Cette morale ne s'adresse pas à la belle au bois dormant mais aux beaux bois payants, alors écris-la avec moi : « même si vous êtes doués, prédisposés, sollicités, tentés, curieux, ambitieux, contraints, volontaires, sûrs de vous, excités... n'empruntez jamais ce chemin, n'y mettez pas un pied : il n'y a jamais de happy-end à attendre ! »

Mais puisque vous êtes déjà en chemin, n'abandonnez jamais les rêves qui vous ont conduit là car nos héros vécurent longtemps, amoureux, heureux et eurent beaucoup de chiens, de chats et certainement quelques amants.

Ton ♥ fidèle qui vous appartient sans naïveté ni espoirs déplacés, sans exclusivité ni obligation.`,

    EN: `Moneypenis,                                                    Christmas 2023

You and your master, this body that carries you and the spirit that carries you both away, you are one... deep down I always knew it. And if I dare tell you I love you, to you, it is because I love him without daring to tell him.

I completely invented this correspondence, not for fear he would mock, nor for fear he would abuse it, but to avoid seeing him flee or worse... that he would be indifferent. I know it now, it was indeed me who wrote everything. All these messages, all my letters, I who put these words on these portraits of you, taken during our holidays and our games, stolen from our daily life... I may have the proof of it, there, before my eyes, yet I already find myself believing it was you who dictated your letters to me. Love is a strange illness sometimes.

Even chosen, yours is a hard life, a life of discipline and solitude... a life of sacrifice, a calvary more than a priesthood.
I have in mind this Brassens song « La Complainte des Filles de Joie », Barbara performed a very personal version: "those bourgeois cows, those bourgeois cows, call us the girls of joy! It's not every day that we laugh... don't think we steal the money!"

Moneypenis, my angel, the thief is the one who pays. And yet if I had not been this sad criminal, this inconsolable widower, this wretch still looking for some pretext, I would not have known you.

Moneypenis, a fairy tale is as simple as that, always a little twisted, a little perverse... this moral is not addressed to sleeping beauty but to the beautiful paying woods, so write it with me: "even if you are gifted, predisposed, solicited, tempted, curious, ambitious, constrained, willing, sure of yourselves, excited... never take this path, never put a foot on it: there is never a happy ending to expect!"

But since you are already on the way, never abandon the dreams that led you there for our heroes lived long, in love, happy and had many dogs, cats and certainly some lovers.

Your faithful ♥ which belongs to you without naivety or misplaced hopes, without exclusivity or obligation.`,

    ES: `Moneypenis,                                                    Navidad 2023

Tú y tu amo, este cuerpo que te lleva y el espíritu que os arrastra, no sois más que uno... en el fondo siempre lo supe. Y si me atrevo a decirte te amo, a ti, es porque le amo a él sin atreverme a decírselo.

He inventado por completo esta correspondencia, no por miedo a que se burle, ni por temor a que abuse de ella, sino para no verlo huir o peor aún... que sea indiferente. Ya lo sé ahora, soy yo quien lo ha escrito todo. Todos esos mensajes, todos mis correos, soy yo quien ha puesto esas palabras sobre esos retratos tuyos, tomados durante nuestras vacaciones y nuestros juegos, robados a nuestro cotidiano... Por más que tengo la prueba, allí, ante mis ojos, ya me sorprendo creyendo que eres tú quien me ha dictado tus cartas. El amor es a veces una rara enfermedad.

Incluso elegida, vuestra vida es dura, una vida de disciplina y de soledad... una vida de sacrificios, un calvario más que un sacerdocio.
Tengo en mente esa canción de Brassens « La Complainte des Filles de Joie », Barbara hizo una interpretación muy personal: « decir que estos cerdos burgueses, decir que estos cerdos burgueses, nos llaman las chicas de la alegría, nos llaman las chicas de la alegría! no es todos los días que reímos, palabras, palabras, no es todos los días que reímos... el dinero, ¡no creáis que lo robamos! »

Moneypenis, mi ángel, el ladrón es quien paga. Y sin embargo si yo no hubiera sido ese triste criminal, ese viudo inconsolable, ese miserable que todavía se busca algún pretexto, no os habría conocido.

Moneypenis, un cuento de hadas es algo tan simple, siempre un poco torcido, un poco perverso... el relato de una situación improbable hasta volverse incontestable, escandalosa hasta volverse ejemplar. Es una injusticia odiosa hasta volverse edificante y su transmisión es esencial. Un cuento de hadas es un género que extrae la verdad de la mentira, la justicia de la falta, es una manera de conducir la historia a marcha forzada hacia su moraleja, y aquí hacia la nuestra. Esta moraleja no se dirige a la bella durmiente del bosque sino a los hermosos bosques que pagan, así que escríbela conmigo: « aunque seáis dotados, predispuestos, solicitados, tentados, curiosos, ambiciosos, obligados, voluntarios, seguros de vosotros mismos, excitados... no toméis nunca este camino, no pongáis ni un pie: ¡nunca hay un final feliz que esperar! »

Pero puesto que ya estáis en camino, no abandonéis nunca los sueños que os han conducido allí, pues nuestros héroes vivieron mucho tiempo, enamorados, felices, y tuvieron muchos perros, gatos y ciertamente algunos amantes.

Tu ♥ fiel que os pertenece sin ingenuidad ni esperanzas desplazadas, sin exclusividad ni obligación.`,

    PT: `Moneypenis,                                                    Natal 2023

Tu e o teu mestre, este corpo que te carrega e o espírito que vos transporta, não fazeis senão um... no fundo sempre o soube. E se ouso dizer-te amo-te, a ti, é porque o amo sem ousar dizer-lho.

Inventei totalmente esta correspondência, não por medo de que ele troce, nem por receio de que abuse dela, mas para não o ver fugir ou pior ainda... que ele seja indiferente. Já o sei agora, sou eu quem escreveu tudo. Todas essas mensagens, todas as minhas cartas, sou eu quem pôs essas palavras sobre esses retratos teus, tirados durante as nossas férias e os nossos jogos, roubados ao nosso quotidiano... Por mais que tenha a prova, ali, sob os meus olhos, já me surpreendo a acreditar que és tu quem me ditou as tuas cartas. O amor é por vezes uma estranha doença.

Mesmo escolhida, é uma vida dura a vossa, uma vida de disciplina e de solidão... uma vida de sacrifícios, um calvário mais do que um sacerdócio.
Tenho em mente esta canção de Brassens « La Complainte des Filles de Joie », Barbara fez uma versão muito pessoal: « dizer que estes burgueses porcos, dizer que estes burgueses porcos, nos chamam meninas da alegria, nos chamam meninas da alegria! não é todos os dias que rimos, palavras, palavras, não é todos os dias que rimos... os tostões, não acrediteis que os roubamos! »

Moneypenis, meu anjo, o ladrão é quem paga. E no entanto, se eu não tivesse sido este triste criminoso, este viúvo inconsolável, este miserável que ainda se procura algum pretexto, eu não vos teria conhecido.

Moneypenis, um conto de fadas é assim tão simples, é sempre um pouco torto, um pouco perverso... o relato de uma situação improvável até se tornar incontestável, escandalosa até se tornar exemplar. É uma injustiça odiosa até se tornar edificante e a sua transmissão é essencial. Um conto de fadas é um género que tira a verdade da mentira, a justiça da falta, é uma maneira de conduzir a história à força para a sua moral, e aqui para a nossa. Esta moral não se dirige à bela adormecida no bosque mas aos belos bosques que pagam, então escreve-a comigo: « mesmo se sois dotados, predispostos, solicitados, tentados, curiosos, ambiciosos, obrigados, voluntários, seguros de vós, excitados... nunca tomeis este caminho, não ponhais um pé nele: nunca há happy-end a esperar! »

Mas já que estais em caminho, não abandoneis nunca os sonhos que vos conduziram até aí, pois os nossos heróis viveram muito tempo, apaixonados, felizes e tiveram muitos cães, gatos e certamente alguns amantes.

O teu ♥ fiel que vos pertence sem ingenuidade nem esperanças deslocadas, sem exclusividade nem obrigação.`,

    DE: `Moneypenis,                                                    Weihnachten 2023

Du und dein Meister, dieser Körper, der dich trägt, und der Geist, der euch fortreißt — ihr seid eins... im Grunde wusste ich es schon immer. Und wenn ich es wage, dir zu sagen ich liebe dich, dann nur, weil ich ihn liebe, ohne es ihm zu sagen wagen.

Ich habe diesen Briefwechsel völlig erfunden, nicht aus Angst, dass er sich lustig macht, noch aus Furcht, dass er ihn missbraucht, sondern um ihn nicht fliehen zu sehen oder schlimmer noch... dass er gleichgültig sei. Ich weiß es nun, ich bin es, der alles geschrieben hat. All diese Nachrichten, all meine Briefe — ich habe diese Worte auf diese Porträts von dir gelegt, aufgenommen während unserer Ferien und unserer Spiele, dem Alltag entwendet... So sehr ich den Beweis habe, hier, vor meinen Augen, ertappe ich mich dabei, zu glauben, dass du es bist, der mir deine Briefe diktiert hat. Die Liebe ist manchmal eine sonderbare Krankheit.

Selbst gewählt ist euer Leben hart, ein Leben aus Disziplin und Einsamkeit... ein Leben der Opfer, ein Kalvarienberg mehr als ein Priestertum.
Ich habe dieses Lied von Brassens im Kopf, « La Complainte des Filles de Joie », Barbara hat eine sehr persönliche Version daraus gemacht: « zu sagen, dass diese Schweine von Bürgern, zu sagen, dass diese Schweine von Bürgern, uns die Mädchen der Freude nennen, uns die Mädchen der Freude nennen! es ist nicht jeden Tag, dass wir lachen, Worte, Worte, es ist nicht jeden Tag, dass wir lachen... das Geld, glaubt nicht, dass wir es stehlen! »

Moneypenis, mein Engel, der Dieb ist derjenige, der zahlt. Und doch, wenn ich nicht dieser traurige Kriminelle, dieser untröstliche Witwer, dieser Erbärmliche, der sich noch immer irgendeinen Vorwand sucht, gewesen wäre, hätte ich euch nicht kennengelernt.

Moneypenis, ein Märchen ist so einfach wie das, es ist immer ein wenig verdreht, ein wenig pervers... die Erzählung einer unwahrscheinlichen Situation, bis sie unbestreitbar wird, einer skandalösen, bis sie vorbildlich wird. Es ist eine abscheuliche Ungerechtigkeit, bis sie erbaulich wird, und ihre Weitergabe ist wesentlich. Ein Märchen ist ein Genre, das die Wahrheit aus der Lüge zieht, die Gerechtigkeit aus dem Fehler, es ist eine Weise, die Geschichte zwangsweise zu ihrer Moral zu führen, und hier zu der unseren. Diese Moral richtet sich nicht an Dornröschen, sondern an die schönen zahlenden Hölzer, also schreibe sie mit mir: « selbst wenn ihr begabt seid, prädisponiert, umworben, versucht, neugierig, ehrgeizig, gezwungen, freiwillig, eurer selbst sicher, erregt... betretet diesen Weg nie, setzt nicht einen Fuß darauf: es gibt nie ein Happy-End zu erwarten! »

Doch da ihr bereits auf dem Weg seid, gebt niemals die Träume auf, die euch dorthin geführt haben, denn unsere Helden lebten lange, verliebt, glücklich und hatten viele Hunde, Katzen und gewiss einige Liebhaber.

Dein treues ♥, das euch gehört ohne Naivität noch fehlgeleitete Hoffnungen, ohne Exklusivität noch Verpflichtung.`,

    IT: `Moneypenis,                                                    Natale 2023

Tu e il tuo padrone, questo corpo che ti porta e lo spirito che vi trascina, non fate che uno... in fondo l'ho sempre saputo. E se oso dirti ti amo, a te, è perché l'amo senza osare dirglielo.

Ho totalmente inventato questa corrispondenza, non per paura che si prenda gioco di me, né per timore che ne abusi, ma per non vederlo fuggire o peggio ancora... che sia indifferente. Lo so ormai, sono io che ho scritto tutto. Tutti quei messaggi, tutte le mie lettere, sono io che ho posato queste parole su questi ritratti di te, presi durante le nostre vacanze e i nostri giochi, rubati al nostro quotidiano... Per quanto ne abbia la prova, qui, sotto i miei occhi, già mi sorprendo a credere che sei tu chi mi ha dettato le tue lettere. L'amore è talvolta una strana malattia.

Anche scelta, la vostra è una vita dura, una vita di disciplina e di solitudine... una vita di sacrifici, un calvario più che un sacerdozio.
Ho in mente questa canzone di Brassens « La Complainte des Filles de Joie », Barbara ne ha fatto una versione molto personale: « dire che questi maiali di borghesi, dire che questi maiali di borghesi, ci chiamano le ragazze della gioia, ci chiamano le ragazze della gioia! non è tutti i giorni che si ride, parole, parole, non è tutti i giorni che si ride... i soldi, non crediate che li rubiamo! »

Moneypenis, mio angelo, il ladro è colui che paga. Eppure, se non fossi stato questo triste criminale, questo vedovo inconsolabile, questo miserabile che si cerca ancora qualche pretesto, non vi avrei conosciuto.

Moneypenis, una favola è semplice così, è sempre un po' contorta, un po' perversa... il racconto di una situazione improbabile fino a diventare incontestabile, scandalosa fino a diventare esemplare. È un'ingiustizia odiosa fino a diventare edificante e la sua trasmissione è essenziale. Una favola è un genere che trae la verità dalla menzogna, la giustizia dalla colpa, è un modo di condurre la storia a marcia forzata verso la sua morale, e qui verso la nostra. Questa morale non si rivolge alla bella addormentata nel bosco ma ai bei boschi paganti, allora scrivila con me: « anche se siete dotati, predisposti, sollecitati, tentati, curiosi, ambiziosi, costretti, volontari, sicuri di voi stessi, eccitati... non prendete mai questo cammino, non metteteci un piede: non c'è mai un happy-end da aspettare! »

Ma poiché siete già in cammino, non abbandonate mai i sogni che vi hanno condotti là, perché i nostri eroi vissero a lungo, innamorati, felici, e ebbero molti cani, gatti e certamente qualche amante.

Il tuo ♥ fedele che vi appartiene senza ingenuità né speranze fuori posto, senza esclusività né obbligo.`,

    "中": `Moneypenis，                                                    2023年圣诞节

你和你的主人，这个承载你的身体和带走你们的精神，你们是一体的……内心深处我一直知道。如果我敢对你说我爱你，是因为我爱他却不敢对他说。

我完全发明了这段通信，不是怕他嘲笑，也不是怕他滥用，而是为了不看到他逃跑或更糟……他无动于衷。我现在知道了，确实是我写了一切。爱有时是一种奇怪的疾病。

我脑子里有这首Brassens的歌《La Complainte des Filles de Joie》，Barbara演唱了一个非常个人化的版本。

Moneypenis，我的天使，小偷是付钱的人。然而如果我不是那个悲伤的罪犯，我就不会认识你。

Moneypenis，童话就是这么简单，总是有点扭曲，有点变态……和我一起写这个道德：「即使你有天赋……永远不要走这条路！」

但既然你已经在路上了，永远不要放弃带你来这里的梦想，因为我们的英雄活了很长时间，相爱，幸福，有很多狗、猫，当然还有一些情人。

你忠实的♥`,

    "日": `Moneypenis、                                                    2023年クリスマス

あなたとあなたの主人、あなたを運ぶ体と二人を連れ去る精神、あなたたちは一つだ……心の奥底では常にそれを知っていた。あなたに愛していると言う勇気があるのは、彼に言う勇気なく彼を愛しているから。

私はこの文通を完全に作り上げた、彼が笑うことを恐れてではなく、彼が逃げるのを見ないため。愛は時に奇妙な病気だ。

私の頭の中にあるBrassensの曲«La Complainte des Filles de Joie»、Barbaraがとても個人的なバージョンを歌った。

Moneypenis、私の天使、泥棒は払う人だ。それでもあの悲しい犯罪者でなければ、あなたに出会えなかった。

Moneypenis、おとぎ話とはそんなに単純なもの、いつも少し歪んで、少し倒錯していて……私と一緒にこの教訓を書いてほしい：「才能があっても……決してこの道を歩くな！」

でも既に道を歩んでいるのだから、そこへ導いた夢を決して諦めないで。なぜなら私たちの英雄は長く生き、愛し合い、幸せで、たくさんの犬、猫、そして確かに何人かの恋人を持ったのだから。

あなたの忠実な♥`,
  },
};


// ── COMPONENTS ────────────────────────────────────────────────────────────────

function PImg({src,ageOk,bz=[],style={},onClick,fit=false}){
  const z=ageOk?[]:bz;
  const wrapperStyle = fit
    ? {position:"relative",display:"inline-block",lineHeight:0,
       maxWidth:"100%",maxHeight:"100%",...style}
    : {position:"relative",...style};
  const imgStyle = fit
    ? {maxWidth:"100%",maxHeight:"100%",width:"auto",height:"auto",display:"block",
       userSelect:"none",WebkitUserDrag:"none",cursor:onClick?"pointer":"default"}
    : {width:"100%",height:"auto",display:"block",
       userSelect:"none",WebkitUserDrag:"none",cursor:onClick?"pointer":"default"};
  return(
    <div style={wrapperStyle} onClick={onClick}>
      <img src={src} alt="" draggable={false} onContextMenu={e=>e.preventDefault()}
        style={imgStyle}/>
      {z.map((zi,i)=>(
        <div key={i} style={{position:"absolute",top:`${zi.t}%`,left:`${zi.l}%`,width:`${zi.w}%`,height:`${zi.h}%`,
          backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",background:"rgba(255,255,255,0.3)",
          display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"italic",fontSize:"clamp(9px,1.2vw,13px)",
            color:"rgba(30,30,30,0.7)",letterSpacing:"0.15em",textAlign:"center",padding:"0 8px",userSelect:"none"}}>
            {zi.lb}
          </span>
        </div>
      ))}
    </div>
  );
}

// Lightbox with text toggle
function LBox({prints,ci,ageOk,onClose,onPrev,onNext,t,lang}){
  const p=prints[ci];
  const [zoomed,setZoomed]=useState(false);
  const [zPos,setZPos]=useState({x:50,y:50});
  const [showText,setShowText]=useState(false);
  const imgRef=useRef(null);

  const handleImgClick=(e)=>{
    e.stopPropagation();
    if(!imgRef.current) return;
    const r=imgRef.current.getBoundingClientRect();
    if(zoomed){setZoomed(false);}
    else{setZPos({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100});setZoomed(true);}
  };

  const txt = TEXTS[p.num]?.[lang] || null;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(251,251,248,0.98)",zIndex:3000,
      display:"flex",flexDirection:"column"}} onClick={onClose}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"10px 16px",borderBottom:"1px solid #cfcbc4",background:"#fafafa",
        paddingTop:"max(10px,env(safe-area-inset-top,10px))",flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontSize:15,color:"#1a1a1a"}}>
            I Love You Moneypenis
          </span>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:11,
            color:"#3a3836",letterSpacing:3}}>· {p.num}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {txt&&(
            <button onClick={()=>setShowText(!showText)}
              style={{background:showText?"#1a1a1a":"none",border:"1px solid #cfcbc4",
                color:showText?"#fff":"#2a2826",padding:"4px 10px",fontSize:8,letterSpacing:2,
                cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                textTransform:"uppercase",transition:"all .2s"}}>
              {showText?`✕ ${t.tx}`:`≡ ${t.tx}`}
            </button>
          )}
          <button onClick={onClose}
            style={{background:"none",border:"1px solid #cfcbc4",color:"#2a2826",
              width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}
        onClick={e=>e.stopPropagation()}>

        {/* Text panel — only when requested */}
        {showText&&txt&&(
          <div style={{background:"#ffffff",borderBottom:"1px solid #cfcbc4",
            padding:"14px 18px",maxHeight:"18vh",overflowY:"auto",flexShrink:0}}>
            <pre style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:11,
              color:"#2a2826",lineHeight:1.9,whiteSpace:"pre-wrap",margin:0}}>{txt}</pre>
          </div>
        )}

        {/* Image */}
        <div ref={imgRef} onClick={handleImgClick}
          style={{flex:1,overflow:"hidden",cursor:zoomed?"zoom-out":"zoom-in",
            display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa",
            padding:"20px"}}>
          <div style={{transition:"transform .35s ease",
            transformOrigin:`${zPos.x}% ${zPos.y}%`,
            transform:zoomed?"scale(2.5)":"scale(1)",
            maxWidth:"100%",maxHeight:"100%",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <PImg src={p.src} ageOk={ageOk} bz={p.bz} fit={true}/>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"8px 16px",borderTop:"1px solid #cfcbc4",background:"#fafafa",
        paddingBottom:"max(8px,env(safe-area-inset-bottom,8px))",flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onPrev} disabled={ci===0}
          style={{background:"none",border:"1px solid #cfcbc4",
            color:ci===0?"#2a2826":"#2a2826",padding:"5px 14px",
            cursor:ci===0?"default":"pointer",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,letterSpacing:2}}>
          ← PREV
        </button>
        <span style={{color:"#2a2826",fontSize:9,fontFamily:"'Space Grotesk',sans-serif",
          fontWeight:300,letterSpacing:3}}>{p.num}</span>
        <button onClick={onNext} disabled={ci===prints.length-1}
          style={{background:"none",border:"1px solid #cfcbc4",
            color:ci===prints.length-1?"#2a2826":"#2a2826",padding:"5px 14px",
            cursor:ci===prints.length-1?"default":"pointer",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,letterSpacing:2}}>
          NEXT →
        </button>
      </div>
    </div>
  );
}

function SRow({label,price,rem,total,cta}){
  const[done,setDone]=useState(false);
  const pct=Math.round(((total-rem)/total)*100);
  return(
    <div style={{padding:"18px 0",borderBottom:"1px solid #cfcbc4"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <p style={{color:"#2a2826",fontSize:13,fontWeight:400}}>{label}</p>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
            <div style={{width:70,height:1,background:"#cfcbc4"}}>
              <div style={{width:`${pct}%`,height:"100%",background:"#1a1a1a"}}/>
            </div>
            <span style={{color:"#3a3836",fontSize:9,fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              {rem}/{total}
            </span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,color:"#1a1a1a"}}>
            {price.toLocaleString()} €
          </span>
          <button onClick={()=>setDone(!done)}
            style={{background:done?"#1a1a1a":"transparent",border:"1px solid #b8b4b0",
              color:done?"#fff":"#2a2826",padding:"7px 18px",fontSize:9,letterSpacing:2,
              cursor:"pointer",transition:"all .2s",fontFamily:"'Space Grotesk',sans-serif",
              fontWeight:400,textTransform:"uppercase"}}>
            {done?"✓":cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function CS({title,soon,contact}){
  return(
    <div style={{maxWidth:680,margin:"100px auto",padding:"0 24px",textAlign:"center"}}>
      <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
        fontSize:"clamp(22px,4vw,38px)",color:"#3a3836",marginBottom:20}}>{title}</h2>
      <div style={{width:36,height:1,background:"#cfcbc4",margin:"0 auto 20px"}}/>
      <p style={{color:"#2a2826",fontSize:12,letterSpacing:1,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:10}}>{soon}</p>
      {contact&&<p style={{color:"#3a3836",fontSize:11,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{contact}</p>}
    </div>
  );
}

const Logo=({sz=30})=>(
  <div style={{width:sz,height:sz,borderRadius:"50%",overflow:"hidden",
    border:"1px solid #cfcbc4",flexShrink:0}}>
    <img src={IMG.logo} alt="" draggable={false} onContextMenu={e=>e.preventDefault()}
      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const[lang,setLang]=useState("FR");
  const[ageOk,setAgeOk]=useState(false);
  const[dis,setDis]=useState(false);
  const[ck1,setCk1]=useState(false);
  const[ck2,setCk2]=useState(false);
  const[sec,setSec]=useState("portfolio");
  const[lb,setLb]=useState(null);
  const[et,setEt]=useState("pf");
  const[menuOpen,setMenuOpen]=useState(false);
  const[langOpen,setLangOpen]=useState(false);
  const[showNote,setShowNote]=useState(false);
  const[introDone,setIntroDone]=useState(false);
  const t=T[lang];

  // Fallback : si onAnimationEnd ne fire pas, force introDone après 3.3s
  useEffect(()=>{
    if(introDone) return;
    const tm=setTimeout(()=>setIntroDone(true),3300);
    return ()=>clearTimeout(tm);
  },[introDone]);
  const ed=EDS.find(e=>e.key===et);
  const NAV=["portfolio","video","coffret","chez","shop","bio","presse","parlent","contact"];
  const GR=["presse","parlent"];

  const goSec=(s)=>{setSec(s);setMenuOpen(false);setLangOpen(false);};

  return(
    <div style={{fontFamily:"'Space Grotesk',sans-serif",background:"#fafafa",
      color:"#1a1a1a",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:#cfcbc4;}
        img{-webkit-user-drag:none;}
        .nb{background:none;border:none;color:#2a2826;font-size:11px;letter-spacing:3px;
          text-transform:uppercase;cursor:pointer;padding:12px 0;width:100%;text-align:center;
          transition:color .2s;font-family:'Space Grotesk',sans-serif;font-weight:400;display:block;}
        .nb:hover,.nb.on{color:#1a1a1a;}
        .nb.gr{color:#3a3836;cursor:default;pointer-events:none;}
        .bs{background:#1a1a1a;border:1px solid #1a1a1a;color:#fff;padding:14px 30px;
          font-size:9px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;
          transition:opacity .2s;font-family:'Space Grotesk',sans-serif;font-weight:400;width:100%;}
        .bs:hover{opacity:.8;}
        .bg{background:none;border:1px solid #b8b4b0;color:#2a2826;padding:14px 30px;
          font-size:9px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;
          transition:all .25s;font-family:'Space Grotesk',sans-serif;font-weight:400;width:100%;}
        .bg:hover{border-color:#1a1a1a;color:#1a1a1a;}
        .hs{transition:opacity .2s;}.hs:hover{opacity:.88;}
        input,textarea{background:#fff;border:1px solid #cfcbc4;color:#1a1a1a;
          padding:12px 16px;font-size:14px;width:100%;outline:none;
          font-family:'Space Grotesk',sans-serif;transition:border-color .2s;}
        input:focus,textarea:focus{border-color:#3a3836;}
        video{display:block;width:100%;}
        @keyframes introBounce {
          0%   { transform: scale(0.15) rotate(0deg); }
          15%  { transform: scale(7) rotate(180deg); }
          25%  { transform: scale(0.3) rotate(280deg); }
          37%  { transform: translate(34vw, 22vh) scale(0.45) rotate(450deg); }
          49%  { transform: translate(34vw, 52vh) scale(0.45) rotate(600deg); }
          61%  { transform: translate(-34vw, 52vh) scale(0.5) rotate(750deg); }
          73%  { transform: translate(-34vw, 22vh) scale(0.5) rotate(920deg); }
          82%  { transform: translate(0, 30vh) scale(0.6) rotate(1080deg); }
          92%  { transform: scale(1.2) rotate(1260deg); }
          100% { transform: scale(1) rotate(1440deg); }
        }
        .intro-logo { animation: introBounce 3.2s linear forwards; transform-origin: 50% 50%; }
        .fade-in    { transition: opacity .6s ease .2s; }
      `}</style>

      {/* ══ AGE GATE ══════════════════════════════════════════════════════════ */}
      {!dis&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"#fafafa",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"max(32px,env(safe-area-inset-top,32px)) 24px max(32px,env(safe-area-inset-bottom,32px))",
          textAlign:"center",overflowY:"auto"}}>

          {/* Lang picker (fades in après intro) */}
          <div className="fade-in" style={{position:"absolute",top:"calc(14px + env(safe-area-inset-top,0px))",
            right:14,display:"grid",gridTemplateColumns:"repeat(4, minmax(30px, auto))",
            gap:2,justifyItems:"stretch",opacity:introDone?1:0}}>
            {LANGS.map(l=>(
              <button key={l}
                style={{background:"none",border:lang===l?"1px solid #1a1a1a":"1px solid #cfcbc4",
                  color:lang===l?"#1a1a1a":"#3a3836",padding:"3px 7px",fontSize:9,
                  cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                  letterSpacing:1,transition:"all .15s",textAlign:"center"}}
                onClick={()=>setLang(l)}>{l}</button>
            ))}
          </div>

          {/* Logo : animation d'intro */}
          <div className="intro-logo"
            onAnimationEnd={()=>setIntroDone(true)}>
            <Logo sz={80}/>
          </div>

          {/* Tout le reste : fade-in après intro */}
          <div className="fade-in" style={{display:"flex",flexDirection:"column",
            alignItems:"center",width:"100%",opacity:introDone?1:0}}>
          <div style={{height:16}}/>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(20px,5vw,32px)",color:"#1a1a1a",marginBottom:4,lineHeight:1.2}}>
            I Love You Moneypenis
          </h1>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:9,
            letterSpacing:3,color:"#2a2826",marginBottom:4,textTransform:"uppercase"}}>
            Sébastien Moreu & André Vaszkievicz · Paris 2024
          </p>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:8,
            letterSpacing:4,color:"#3a3836",marginBottom:24,textTransform:"uppercase"}}>
            {t.aw}
          </p>

          {/* ── Note des auteurs · repliable ───────────────────────────────── */}
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4",
            padding:"16px 20px",maxWidth:420,width:"100%",marginBottom:14,textAlign:"left"}}>
            <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:13,color:"#1a1a1a",marginBottom:10,
              letterSpacing:".02em"}}>
              {t.nat}
            </p>
            {(showNote?t.naf.split("\n\n"):[t.naf.split("\n\n")[0]]).map((para,j)=>(
              <p key={j} style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                fontSize:10.5,color:"#2a2826",lineHeight:1.7,marginBottom:9}}>
                {para}
              </p>
            ))}
            <button onClick={()=>setShowNote(!showNote)}
              style={{background:"none",border:"none",padding:"4px 0",marginTop:2,
                cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:9,letterSpacing:2,color:"#3a3836",
                textTransform:"uppercase",textAlign:"left"}}>
              {showNote?t.nac:t.nax}
            </button>
          </div>

          {/* Declaration box */}
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4",
            padding:"18px 20px",maxWidth:420,width:"100%",marginBottom:20,textAlign:"left"}}>
            <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:11,
              color:"#3a3836",lineHeight:1.8,marginBottom:16}}>{t.am}</p>

            <label style={{display:"flex",alignItems:"flex-start",gap:10,
              cursor:"pointer",marginBottom:12}}>
              <input type="checkbox" checked={ck1} onChange={e=>setCk1(e.target.checked)}
                style={{marginTop:2,width:16,height:16,accentColor:"#1a1a1a",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                fontSize:11,color:"#2a2826",lineHeight:1.6}}>{t.ck1}</span>
            </label>

            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
              <input type="checkbox" checked={ck2} onChange={e=>setCk2(e.target.checked)}
                style={{marginTop:2,width:16,height:16,accentColor:"#1a1a1a",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                fontSize:11,color:"#2a2826",lineHeight:1.6}}>{t.ck2}</span>
            </label>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",maxWidth:360}}>
            <button className="bs"
              style={{opacity:ck1&&ck2?1:0.35,transition:"opacity .2s",
                cursor:ck1&&ck2?"pointer":"not-allowed"}}
              onClick={()=>{if(ck1&&ck2){setAgeOk(true);setDis(true);}}}>
              {t.ap}
            </button>
            <button className="bg"
              onClick={()=>{setAgeOk(false);setDis(true);}}>
              {t.am2}
            </button>
          </div>

          <div style={{marginTop:20,display:"flex",gap:16,fontSize:9,color:"#3a3836",
            letterSpacing:1,fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
            <a href={`https://${t.si}`} style={{color:"#3a3836",textDecoration:"none"}}>{t.si}</a>
            <span>·</span>
            <a href={`https://${t.pv}`} style={{color:"#3a3836",textDecoration:"none"}}>{t.pv}</a>
          </div>
          </div>{/* /fade-in wrapper */}
        </div>
      )}

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:800,
        background:"rgba(251,251,248,0.97)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid #cfcbc4",paddingTop:"env(safe-area-inset-top,0px)"}}>
        <div style={{height:52,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 14px",gap:8}}>

          {/* Logo + titre */}
          <div style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",flexShrink:0}}
            onClick={()=>goSec("portfolio")}>
            <Logo sz={26}/>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
              fontSize:8,letterSpacing:3,color:"#1a1a1a",whiteSpace:"nowrap"}}>
              A.V.S.M PRINTS
            </span>
          </div>

          {/* Right controls */}
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>

            {/* Lang dropdown */}
            <div style={{position:"relative"}}>
              <button onClick={()=>{setLangOpen(!langOpen);setMenuOpen(false);}}
                style={{background:"none",border:"1px solid #cfcbc4",color:"#1a1a1a",
                  padding:"5px 8px",fontSize:9,letterSpacing:1,cursor:"pointer",
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
                  display:"flex",alignItems:"center",gap:3,transition:"all .2s"}}>
                {lang} <span style={{fontSize:7,color:"#3a3836"}}>▾</span>
              </button>
              {langOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                  background:"#fafafa",border:"1px solid #cfcbc4",zIndex:900,
                  minWidth:52,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
                  {LANGS.filter(l=>l!==lang).map(l=>(
                    <button key={l}
                      onClick={()=>{setLang(l);setLangOpen(false);}}
                      style={{display:"block",width:"100%",background:"none",border:"none",
                        borderBottom:"1px solid #fafafa",padding:"9px 0",fontSize:9,
                        letterSpacing:1,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                        fontWeight:400,color:"#2a2826",textAlign:"center"}}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 18+ toggle */}
            <button onClick={()=>{if(!ageOk){setDis(false);}else{setAgeOk(false);}setLangOpen(false);}}
              style={{background:"none",
                border:`1px solid ${ageOk?"#1a1a1a":"#cfcbc4"}`,
                color:ageOk?"#1a1a1a":"#3a3836",padding:"5px 7px",fontSize:8,
                letterSpacing:1,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                fontWeight:400,transition:"all .2s",whiteSpace:"nowrap"}}>
              {ageOk?"● 18+":"○ 18+"}
            </button>

            {/* Burger */}
            <button onClick={()=>{setMenuOpen(!menuOpen);setLangOpen(false);}}
              style={{background:"none",border:"1px solid #cfcbc4",cursor:"pointer",
                padding:"7px 9px",display:"flex",flexDirection:"column",gap:4,
                alignItems:"center",transition:"all .2s"}}>
              <span style={{display:"block",width:18,height:1.5,background:"#2a2826",
                transition:"all .25s",
                transform:menuOpen?"rotate(45deg) translate(4px,4px)":"none"}}/>
              <span style={{display:"block",width:18,height:1.5,
                background:menuOpen?"transparent":"#2a2826",transition:"all .25s"}}/>
              <span style={{display:"block",width:18,height:1.5,background:"#2a2826",
                transition:"all .25s",
                transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"none"}}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MENU OVERLAY ══════════════════════════════════════════════════════ */}
      {menuOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:790,
          background:"rgba(251,251,248,0.98)",backdropFilter:"blur(20px)",
          display:"flex",flexDirection:"column",
          paddingTop:"calc(52px + env(safe-area-inset-top,0px))",
          paddingBottom:"env(safe-area-inset-bottom,20px)"}}
          onClick={()=>setMenuOpen(false)}>
          <div style={{flex:1,display:"flex",flexDirection:"column",
            justifyContent:"center",alignItems:"center",gap:0}}>
            {t.nav.map((n,i)=>(
              <button key={n}
                className={`nb${sec===NAV[i]?" on":""}${GR.includes(NAV[i])?" gr":""}`}
                onClick={()=>{if(!GR.includes(NAV[i]))goSec(NAV[i]);}}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{paddingTop:"calc(52px + env(safe-area-inset-top,0px))"}}>

      {/* ══ PORTFOLIO ════════════════════════════════════════════════════════ */}
      {sec==="portfolio"&&(<>
        <div style={{background:"#ffffff",textAlign:"center",
          padding:"60px 20px 44px",borderBottom:"1px solid #cfcbc4"}}>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:8,
            letterSpacing:5,color:"#2a2826",marginBottom:12,textTransform:"uppercase"}}>
            {t.hl}
          </p>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(28px,6.5vw,72px)",lineHeight:1.15,color:"#1a1a1a",
            marginBottom:12,whiteSpace:"pre-line"}}>{t.ht}</h1>
          <p style={{color:"#2a2826",fontSize:13,letterSpacing:2,marginBottom:4,fontWeight:400}}>
            {t.hs}
          </p>
          <p style={{color:"#2a2826",fontSize:11,letterSpacing:1,marginBottom:20}}>{t.hy}</p>
          <p style={{color:"#3a3836",fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",
            maxWidth:460,margin:"0 auto 24px",fontWeight:300}}>{t.hd}</p>
          <button className="bg" style={{width:"auto",display:"inline-block"}}
            onClick={()=>document.getElementById("pg")?.scrollIntoView({behavior:"smooth"})}>
            {t.hc}
          </button>
        </div>

        <div style={{maxWidth:860,margin:"0 auto",padding:"40px 14px 70px"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
              fontSize:"clamp(20px,3.5vw,36px)"}}>{t.pt}</h2>
            <span style={{color:"#3a3836",fontSize:9,letterSpacing:3,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>— XI</span>
          </div>
          <p style={{color:"#3a3836",fontSize:12,lineHeight:1.9,whiteSpace:"pre-line",
            marginBottom:32,fontWeight:300}}>{t.ps}</p>

          <div id="pg" style={{display:"flex",flexDirection:"column"}}>
            {PRINTS.map((p,idx)=>(
              <div key={p.id} className="hs"
                style={{display:"flex",alignItems:"stretch",
                  borderBottom:"1px solid #cfcbc4",background:"#ffffff",cursor:"pointer"}}
                onClick={()=>setLb(idx)}
                onMouseEnter={e=>e.currentTarget.style.background="#fafafa"}
                onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}>
                <div style={{flexShrink:0,width:"32%",maxWidth:200,background:"#fafafa"}}>
                  <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
                </div>
                <div style={{flex:1,padding:"20px 18px",display:"flex",
                  flexDirection:"column",justifyContent:"center",gap:7}}>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                    fontSize:"clamp(15px,2.2vw,22px)",fontWeight:400,color:"#1a1a1a",
                    lineHeight:1.3}}>
                    I Love You Moneypenis
                    <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
                      fontSize:"clamp(11px,1.6vw,15px)",fontWeight:300,
                      color:"#3a3836",letterSpacing:3,marginLeft:10}}>· {p.num}</span>
                  </p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                    fontSize:10,color:"#2a2826",lineHeight:1.5}}>{p.tech}</p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                    fontSize:9,color:"#3a3836",lineHeight:1.6,marginTop:2}}>{t.tech_info}</p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,
                    fontSize:8,color:"#2a2826",letterSpacing:2,textTransform:"uppercase",
                    marginTop:6}}>
                    {t.mg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>)}

      {/* ══ VIDÉO ════════════════════════════════════════════════════════════ */}
      {sec==="video"&&(
        <div style={{maxWidth:960,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",color:"#3a3836",
                fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.vt}</h2>
          </div>
          <p style={{color:"#2a2826",fontSize:11,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:28}}>
            {t.vs}
          </p>
          <div style={{background:"#000",border:"1px solid #1a1a1a"}}>
            <video src={ageOk?VID.full:VID.gate} controls preload="metadata"
              onContextMenu={e=>e.preventDefault()}
              style={{width:"100%",display:"block",background:"#000"}}/>
          </div>
          <p style={{color:"#3a3836",fontSize:8,letterSpacing:2,marginTop:8,
            textAlign:"right",fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
            {t.pr}
          </p>
        </div>
      )}

      {/* ══ COFFRET ══════════════════════════════════════════════════════════ */}
      {sec==="coffret"&&(
        <div style={{maxWidth:1140,margin:"60px auto",padding:"0 14px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#3a3836",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.ct}</h2>
          </div>
          <div style={{color:"#3a3836",fontSize:12,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:32}}>
            {t.cs}
          </div>

          {/* ──────── Hero : vue d'ensemble ──────── */}
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4",marginBottom:24}}>
            <img src={IMG.coffrets_flat} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"8px 14px",color:"#2a2826",fontSize:10,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Les 2 coffrets · Petit Format + Grand Format
            </p>
          </div>

          {/* ──────── PETIT FORMAT ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Petit Format · 30 × 40 cm
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#3a3836",marginLeft:14,
              textTransform:"uppercase",fontWeight:300}}>50 portfolios · 01 → 50</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
            {[{src:IMG.coffret_pf_print,cap:"Coffret PF fermé · Tirage I extrait"},
              {src:IMG.box_open,        cap:"Coffret PF ouvert · Colophon"}].map((im,i)=>(
              <div key={i} style={{background:"#ffffff",border:"1px solid #cfcbc4"}}>
                <img src={im.src} alt="" draggable={false}
                  onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
                <p style={{padding:"6px 10px",color:"#2a2826",fontSize:9,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{im.cap}</p>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
            <div style={{background:"#ffffff",border:"1px solid #cfcbc4"}}>
              <PImg src={IMG.open_pf} ageOk={ageOk} bz={[{t:18,l:52,w:42,h:62,lb:""}]}/>
              <p style={{padding:"6px 10px",color:"#2a2826",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                Coffret PF ouvert · Tirage V
              </p>
            </div>
            <div style={{background:"#ffffff",border:"1px solid #cfcbc4"}}>
              <img src={IMG.open_pf_2} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
              <p style={{padding:"6px 10px",color:"#2a2826",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                Coffret PF ouvert · Premières pages
              </p>
            </div>
          </div>

          {/* ──────── GRAND FORMAT ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Grand Format · 50 × 70 cm
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#3a3836",marginLeft:14,
              textTransform:"uppercase",fontWeight:300}}>15 portfolios · 01 → 15</span>
          </h3>
          <div style={{display:"flex",justifyContent:"center",
            background:"#ffffff",border:"1px solid #cfcbc4"}}>
            <div style={{maxWidth:540,width:"100%"}}>
              <img src={IMG.coffret_gf_closed} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
              <p style={{padding:"6px 10px",color:"#2a2826",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                Coffret GF fermé
              </p>
            </div>
          </div>

          {/* ──────── COMPARATIF DES FORMATS ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Comparatif des formats
          </h3>
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4"}}>
            <PImg src={IMG.warning_cmp} ageOk={ageOk}
              bz={[{t:36,l:10,w:22,h:42,lb:""},{t:25,l:46,w:50,h:65,lb:""}]}/>
            <p style={{padding:"8px 14px",color:"#2a2826",fontSize:10,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Tirage VIII — WARNING! · PF (30 × 40) vs GF (50 × 70)
            </p>
          </div>

          {/* ──────── LE CONTENU ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Les 11 tirages
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
            {[{src:IMG.fan,         cap:"Vue éventail · Drap blanc"},
              {src:IMG.prints_line, cap:"Alignement · Les 11 planches"}].map((im,i)=>(
              <div key={i} style={{background:"#ffffff",border:"1px solid #cfcbc4"}}>
                <img src={im.src} alt="" draggable={false}
                  onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
                <p style={{padding:"6px 10px",color:"#2a2826",fontSize:9,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{im.cap}</p>
              </div>
            ))}
          </div>
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4"}}>
            <img src={IMG.coffret_detail} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 10px",color:"#2a2826",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Détail · Intérieur du coffret
            </p>
          </div>
        </div>
      )}

      {/* ══ CHEZ VOUS ════════════════════════════════════════════════════════ */}
      {sec==="chez"&&(
        <div style={{maxWidth:1140,margin:"60px auto",padding:"0 14px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#3a3836",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.zt}</h2>
          </div>
          <p style={{color:"#3a3836",fontSize:12,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,marginBottom:32}}>
            {t.zs}
          </p>
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4",marginBottom:2}}>
            <img src={ageOk?IMG.inside:IMG.inside_blur} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 12px",color:"#2a2826",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Les 11 tirages encadrés · Chambre · Paris
            </p>
          </div>
          <div style={{background:"#ffffff",border:"1px solid #cfcbc4",marginBottom:2}}>
            <img src={ageOk?IMG.outside:IMG.outside_blur} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 12px",color:"#2a2826",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
              Les 11 tirages encadrés · Atelier · Paris
            </p>
          </div>
        </div>
      )}

      {/* ══ SHOP ═════════════════════════════════════════════════════════════ */}
      {sec==="shop"&&(
        <div style={{maxWidth:940,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#3a3836",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.st}</h2>
          </div>
          <div style={{display:"flex",borderBottom:"1px solid #cfcbc4",marginBottom:28}}>
            {EDS.map(e=>(
              <button key={e.key} onClick={()=>setEt(e.key)}
                style={{background:"none",border:"none",
                  borderBottom:et===e.key?"1px solid #1a1a1a":"1px solid transparent",
                  color:et===e.key?"#1a1a1a":"#3a3836",padding:"9px 22px",fontSize:9,
                  letterSpacing:3,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                  fontWeight:400,textTransform:"uppercase",transition:"all .2s",marginBottom:-1}}>
                {e.key==="pf"?t.pft:t.gft}
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:8,
            padding:18,background:"#ffffff",border:"1px solid #cfcbc4",alignItems:"center"}}>
            <img src={et==="pf"?IMG.coffret_pf_print:IMG.coffret_gf_closed} alt=""
              draggable={false} onContextMenu={e=>e.preventDefault()}
              style={{width:"100%",display:"block"}}/>
            <div>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:8,
                letterSpacing:4,color:"#3a3836",marginBottom:8,textTransform:"uppercase"}}>
                {et==="pf"?t.pft:t.gft}
              </p>
              <p style={{fontSize:13,fontWeight:400,color:"#2a2826",marginBottom:5}}>
                {et==="pf"?t.pfc:t.gfc}
              </p>
              <p style={{color:"#2a2826",fontSize:11,marginBottom:5,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{t.sg}</p>
              <p style={{color:"#3a3836",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
                {et==="pf"?t.pfi:t.gfi}
              </p>
            </div>
          </div>
          <SRow label={et==="pf"?t.p1:t.p3} price={ed.pr.port}
            rem={ed.rm.port} total={ed.rm.tot} cta={t.by}/>
          <SRow label={et==="pf"?t.p2:t.p4} price={ed.pr.single}
            rem={99} total={110} cta={t.rv}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",
            gap:2,marginTop:32}}>
            {[{ti:t.sh,bo:t.sb},{ti:t.py,bo:t.pb},{ti:t.co,bo:t.cb}].map(c=>(
              <div key={c.ti} style={{background:"#ffffff",border:"1px solid #cfcbc4",
                padding:"18px 16px"}}>
                <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                  fontSize:15,fontWeight:400,marginBottom:8}}>{c.ti}</p>
                <p style={{color:"#3a3836",fontSize:12,lineHeight:1.9,
                  whiteSpace:"pre-line",fontWeight:300}}>{c.bo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ BIO ══════════════════════════════════════════════════════════════ */}
      {sec==="bio"&&(
        <div style={{maxWidth:840,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:40}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#3a3836",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.bt}</h2>
          </div>

          {/* Bios first */}
          {[{n:t.sn,b:t.sb2,i:"S.M.",ph:IMG.portrait_sm},
            {n:t.vn,b:t.vb, i:"A.V.",ph:IMG.portrait_av}].map((a,i)=>(
            <div key={i}>
              <div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:28,
                marginBottom:i===0?20:44,paddingBottom:i===0?0:44}}>
                <div style={{paddingTop:3}}>
                  <div style={{width:80,height:80,borderRadius:"50%",overflow:"hidden",
                    border:"1px solid #cfcbc4",margin:"0 auto"}}>
                    <img src={a.ph} alt={a.n} draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:300,fontSize:8,color:"#3a3836",letterSpacing:2,marginTop:8}}>
                    {a.i}
                  </p>
                </div>
                <div>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                    fontSize:21,fontWeight:400,marginBottom:12}}>{a.n}</p>
                  {a.b.split("\n\n").map((para,j)=>(
                    <p key={j} style={{color:"#2a2826",fontSize:14,lineHeight:1.9,fontWeight:300,
                      marginBottom:12}}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Duo entre les 2 bios */}
              {i===0&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",
                  margin:"20px auto 40px",paddingBottom:30,
                  borderBottom:"1px solid #cfcbc4"}}>
                  <div style={{width:100,height:100,borderRadius:"50%",overflow:"hidden",
                    border:"1px solid #cfcbc4"}}>
                    <img src={IMG.portrait_duo} alt="Sébastien & André" draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:300,fontSize:8,color:"#3a3836",letterSpacing:2,marginTop:10,
                    fontStyle:"italic"}}>
                    S.M. & A.V.
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Signature photos grid AFTER bios — with conditional blur on sex-revealing prints */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#1a1a1a",
            marginTop:10,marginBottom:14,letterSpacing:.3}}>
            Séance de signature
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#3a3836",marginLeft:14,
              textTransform:"uppercase",fontWeight:300}}>Paris · 2024</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
            gap:2,background:"#cfcbc4"}}>
            {[
              {src:"/sign-01.jpg",bz:[]},
              {src:"/sign-02.jpg",bz:[]},
              {src:"/sign-03.jpg",bz:[{t:6,l:14,w:67,h:72,lb:""}]},
              {src:"/sign-04.jpg",bz:[{t:0,l:18,w:48,h:28,lb:""}]},
              {src:"/sign-05.jpg",bz:[{t:4,l:14,w:75,h:50,lb:""}]},
              {src:"/sign-06.jpg",bz:[]},
              {src:"/sign-07.jpg",bz:[{t:48,l:0,w:52,h:46,lb:""}]},
              {src:"/sign-08.jpg",bz:[]},
            ].map((s,i)=>(
              <div key={i} style={{background:"#ffffff"}}>
                <PImg src={s.src} ageOk={ageOk} bz={s.bz}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {sec==="presse"&&<CS title={t.prst} soon={t.prss} contact={t.prsc}/>}
      {sec==="parlent"&&<CS title={t.plt} soon={t.pls} contact={null}/>}

      {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
      {sec==="contact"&&(
        <div style={{maxWidth:500,margin:"60px auto",padding:"0 18px 70px",textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32,
            justifyContent:"center"}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#3a3836",fontSize:18,lineHeight:1}}>←</button>
            <Logo sz={48}/>
          </div>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:18,
            letterSpacing:5,marginBottom:4}}>A.V.S.M PRINTS</h2>
          <p style={{color:"#3a3836",fontSize:9,letterSpacing:2,marginBottom:28,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>
            I LOVE YOU MONEYPENIS · ESM SAINT-TROPEZ
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:9,textAlign:"left",
            marginBottom:12}}>
            <input placeholder={t.n1}/>
            <input placeholder={t.n2}/>
            <textarea placeholder={t.n3} rows={5} style={{resize:"vertical"}}/>
          </div>
          <button className="bg" style={{width:"auto",display:"inline-block"}}>
            {t.ns}
          </button>
        </div>
      )}

      </div>{/* paddingTop */}

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{borderTop:"1px solid #cfcbc4",
        padding:"16px 18px calc(16px + env(safe-area-inset-bottom,0px))",
        background:"#fafafa",display:"flex",justifyContent:"space-between",
        alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <Logo sz={20}/>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
            fontSize:8,letterSpacing:4,color:"#3a3836"}}>A.V.S.M PRINTS</span>
        </div>
        <p style={{color:"#3a3836",fontSize:8,whiteSpace:"pre-line",textAlign:"center",
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,letterSpacing:.3}}>
          {t.lg}
        </p>
        <a href={`https://${t.pv}`}
          style={{color:"#3a3836",fontSize:8,letterSpacing:1,textDecoration:"none",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:300}}>{t.pv}</a>
      </footer>

      {/* ══ LIGHTBOX ═════════════════════════════════════════════════════════ */}
      {lb!==null&&(
        <LBox prints={PRINTS} ci={lb} ageOk={ageOk} lang={lang}
          onClose={()=>setLb(null)}
          onPrev={e=>{e.stopPropagation();setLb(i=>Math.max(0,i-1));}}
          onNext={e=>{e.stopPropagation();setLb(i=>Math.min(PRINTS.length-1,i+1));}}
          t={t}/>
      )}
    </div>
  );
}
