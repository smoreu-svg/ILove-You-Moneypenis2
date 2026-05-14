import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import MoneypenisGame from "./MoneypenisGame";

// ─── Timing audio ──────────────────────────────────────────────────────────
// Timestamp EXACT (en secondes) où commence la ligne "... I love you Moneypenis"
// dans intro.mp3. La transition vers la page d'accueil se cale précisément
// sur ce moment. À ajuster après écoute du fichier audio.
const DIALOGUE_AT_S = 16.5;

const IMG={
  logo:"/logo.jpg",
  logo_static:"/logo-static.png",
  logo_base:"/logo-base.jpg",
  logo_heart:"/logo-heart.png",
  logo_aubergine_piece:"/logo-aubergine.png",
  aubergine:"/aubergine.png",
  flash:"/flash.jpg",
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
  // ── planche 0 (colophon recto-verso) ──
  planche_recto:"/planche-00-recto.jpg",
  planche_verso:"/planche-00-verso.jpg",
  portrait_duo:"/portrait-duo.jpg",
};
const VID={gate:"/gate.mp4",full:"/full.mp4"};
const LANGS=["FR","EN","ES","PT","DE","IT","RU","PL","中","日"];
const FLAGS={FR:"🇫🇷",EN:"🇬🇧",ES:"🇪🇸",PT:"🇧🇷",DE:"🇩🇪",IT:"🇮🇹",RU:"🇷🇺",PL:"🇵🇱","中":"🇨🇳","日":"🇯🇵"};

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
  FR:{techs:["Poème · Croix dorée","Lettre manuscrite · Encre marine · Sculpture","Photographie couleur · Texte jaune","Tirage argentique · Encre verte manuscrite","Photo couleur · Texte rouge · Cravate Hermès","Photographie couleur · Jean ouvert · Nature","Photo teintée cyan · Lettre manuscrite orange","Texte rouge · NB · Avertissement multilingue","Lettre manuscrite · Billets 50€ · Mains","Texte rouge · NB · Manifeste","Lettre manuscrite · Fond fleuri · Encre marine"],aw:"Contenu Explicite · Adultes Avertis",am:"Ce site présente des œuvres photographiques destinées exclusivement aux adultes avertis.",ap:"+ 18 ans — Version complète",am2:"− 18 ans — Version grand public",nav:["Portfolio","Vidéo","Coffret","In Situ","Shop","Bio & Signature","VS00","Contact"],hl:"Édition Limitée · Tirages Argentiques Originaux",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Un Conte de Fées Pop Porn Gay, destiné aux adultes avertis.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Découvrir l'œuvre",pt:"I Love You Moneypenis",ps:"11 tirages argentiques originaux · Traphot, Montrouge\nSignés et numérotés par Sébastien Moreu & André Vaszkievicz",mg:"Cliquer pour agrandir",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Tirage argentique · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Impression sur papier Arches · Numérotée et signée à la main par les deux artistes",op:"Ouverture",tx:"Texte",pr:"Œuvre protégée · Filigrane numérique",ct:"Le Coffret",cs:"Portfolio complet · 11 tirages argentiques · Signés & numérotés · Gants inclus",zt:"In Situ",zs:"Les œuvres en situation",vt:"Film",vs:"Contenu réservé aux adultes avertis",st:"Acquérir",pft:"Petit Format  30 × 40 cm",pfc:"50 portfolios numérotés 01/50 → 50/50",pfi:"ISBN : 978-2-492649-21-9",gft:"Grand Format  50 × 70 cm",gfc:"15 portfolios numérotés 01/15 → 15/15",gfi:"ISBN : 978-2-492649-20-2",sg:"Signés S.M. & A.V. · Numéro sur chaque tirage · Gants inclus",pd:"Traphot, Montrouge",p1:"Portfolio PF complet",p2:"Tirage séparé PF",p3:"Portfolio GF complet",p4:"Tirage séparé GF",sh:"Transport & Assurance",sb:"Emballage muséal · DHL Express\nFrance 45 € · Europe 95 € · International 180 €\nAssurance incluse",py:"Paiement",pb:"Virement · Carte · PayPal · 3× sans frais",co:"Conditions",cb:"Certificat d'authenticité · Retour 14 jours · TVA selon pays",rv:"Réserver",by:"Acquérir",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — qui rappelle, comme une forme de résignation stylistique, que tout le monde l'a toujours appelé Sébastien — est ce qui arrive quand la discipline et la volonté se refusent à domestiquer l'obsession.\n\nNé le 25 décembre 1972 dans un décor trop parfait pour être innocent — Saint-Tropez — il grandit dans l'ombre de la précision, un père dentiste façonnant des bouches, et du mythe : résistants, marins, disparus, fantômes familiaux qui refusent de rester enterrés. À dix ans, on lui remet un arsenal complet de peinture. Pas un jouet. Une première arme chargée — début d'une collection baroque, celle d'un fou de guerres intimes.\n\nIl ne les rendra jamais. Préférant multiplier ses champs de bataille.\n\nIl avance par déplacements successifs : peinture, livres, images, relations humaines — tout devient matériau, tout peut être réassemblé. Ce qu'il construit n'est pas une œuvre au sens classique, mais un champ de tensions : entre mémoire et invention, fidélité et trahison, contrôle et perte.\n\nIl ne travaille pas pour les institutions. Il les infiltre. Depuis les années 90, dans l'orbite du galeriste Enrico Navarra, il construit une carrière qui refuse les étiquettes : ni tout à fait salarié, ni tout à fait artiste, ni simple éditeur — plutôt une anomalie productive, capable de générer livres, expositions, liens, archives, idées, communication, événements, à une cadence aussi époustouflante que discontinue. Un désordre qui sert de camouflage à cet homme qui détruit méthodiquement tous les cadres censés le contenir.\n\nIl participe activement à la conception et au développement de la collection Made By…, projet éditorial international consacré à la création contemporaine à travers différentes scènes culturelles. Dans ce cadre, il collabore étroitement avec le photographe Simon Schwyzer.\n\nSa relation avec Simon Schwyzer en est le cœur instable : une collaboration devenue dépendance, une amitié transformée en système amoureux. Un couple ? Depuis la mort brutale du photographe suisse, Moreu répond : « Demandez-lui. » Toujours est-il qu'après sa disparition, rien ne s'arrête — au contraire, tout s'intensifie. Travailler devient une manière de retenir, éditer une manière de prolonger, écrire une manière de ne pas céder. Il s'engage dans la préservation et la valorisation de son œuvre, notamment à travers la préparation de la publication de la monographie Made by… Simon Schwyzer.\n\nEn 2017, avec le soutien d'Enrico Navarra, il avait fondé les Éditions Sébastien Moreu, structure indépendante dédiée aux livres d'art, essais et projets éditoriaux transversaux. La mémoire du photographe suisse détruira l'entreprise. Pas les projets.\n\nPlus tard, avec André Vaszkievicz, l'intime change encore de forme. I Love You Moneypenis n'est pas un projet décoratif posé sur leur relation : c'est une collision de texte, d'image, de désir, d'argent, de corps. Une œuvre conçue depuis l'intérieur du lien, sans filtre protecteur. Leur mariage, le 19 octobre 2024 à Saint-Tropez, ne stabilise rien : il rend officiel ce qui débordait déjà.\n\nSon propre travail — collages, textes, dispositifs éditoriaux — relève d'une esthétique de l'exposition. Journaux ouverts, images découpées, mémoire traitée comme matière première. Rien n'est neutre. Tout est impliqué.\n\nPhysiquement, il porte un corps qui ne coopère pas toujours : cœur rapide, tension capricieuse, système sous pression. Et pourtant, il continue, avec des habitudes qui ressemblent parfois à de la défiance, parfois à une indifférence aux conséquences. Pas de récit propre de rédemption ici. Seulement la persistance.\n\nIl aime intensément, archive obsessionnellement, travaille compulsivement, et refuse de simplifier quoi que ce soit.\n\nS'il existe un principe unificateur, c'est celui-ci : Sébastien Moreu ne résout pas ses contradictions, tant il vénère celles des autres.\n\nLes siennes, il les organise — puis il vit à l'intérieur de l'exposition. Cette galerie est sa maison et celle qu'il offre toute entière à ceux qu'il aime, rien n'est jamais pour lui.\n\nPour conclure, il citerait Desproges : « Étonnant non? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz est né le 28 novembre 1990 dans un Brésil qui ressemble peu aux cartes postales tropicales. Seberi, petite ville rurale du sud du pays, appartient à ces territoires façonnés par les migrations européennes du XXe siècle : communautés ici polonaises, mais un peu plus loin allemandes, italiennes, lituaniennes… où les langues, les traditions, les danses et le catholicisme survivent parfois avec davantage d'obstination que dans leurs pays d'origine.\n\nFils de descendants polonais nés au Brésil, André grandit dans un environnement structuré par le travail, la religion, les silences et les codes virils. Dernier enfant d'une fratrie de huit (dont une seule sœur), né près de dix ans après le plus jeune de ses aînés, il arrive dans une famille déjà marquée par l'effort, les contraintes et le poids des héritages culturels.\n\nUn imprévu aimé. Aimé mais pas attendu. Il sera bien seul dans cette famille nombreuse.\n\nTrès tôt, il comprend deux choses : il se sent profondément à sa place à l'école, et certains désirs n'ont pas leur place dans le monde où il grandit.\n\nL'adolescence gay n'est facile pour personne, nulle part… mais dans ce contexte rural et conservateur, il n'en est même pas question. Le mot n'existe pas et le désir se vit davantage comme une tension intérieure que comme une identité possible.\n\nAndré apprend donc à observer et à se taire, à contrôler ses gestes, à blâmer son corps et ses émotions.\nIl est trop sensible pour parler et trop taiseux pour être sentimental. Trop discipliné pour ne pas être blessé. Trop désiré pour aimer simplement. Trop trahi pour le confier.\n\nMais il y avait les livres, les dictionnaires, les cartes géographiques, les langues étrangères — tout un monde de papier presque infini qui lui permettait déjà de quitter Seberi mentalement avant de pouvoir le faire physiquement.\n\nAprès l'équivalent du baccalauréat, brillant, les études supérieures resteront pourtant inaccessibles à sa condition. André travaille à Porto Alegre, découvre un peu de liberté et un peu de lui-même avec, puis il quitte progressivement le Brésil pour l'Europe et le Monde. Peut-être que plus loin on peut trouver plus de soi.\nIl apprend l'anglais en Irlande, obtient la nationalité lituanienne par ascendance familiale et développe une maîtrise remarquable des langues : portugais, espagnol, polonais, français, allemand et plusieurs autres encore. La plupart du temps seul.\n\nSon rapport aux langues relève autant de la performance académique que d'une forme de déplacement existentiel : changer de langue devient aussi une manière de déplacer la gêne, tromper l'ennui, franchir les frontières et améliorer le regard porté sur lui-même.\n\nLes années suivantes ressemblent longtemps à une traversée précaire de l'Europe contemporaine : déracinement, pandémie, reconstruction permanente.\n\nPourtant André conserve une discipline presque ascétique : sport, travail intellectuel constant, contrôle alimentaire, jamais d'alcool, et pratiquement aucune drogue. Son corps semble traité comme un territoire qu'il faut maintenir debout coûte que coûte.\n\nLa rencontre avec Sébastien Moreu transforme cette trajectoire mais n'en efface pas les blessures… tout du moins tente-t-elle de l'adoucir. Ensemble, ils développent I Love You Moneypenis, projet mêlant image, désir, autobiographie et performance. Leur mariage, célébré à Saint-Tropez le 19 octobre 2024, ne stabilise pas le chaos : il lui donne simplement une forme viable et visible, un répit.\n\nEn parallèle, André reprend des études à Sorbonne Nouvelle en sciences du langage, où ses résultats attirent rapidement l'attention, notamment en chinois. Il effectue également un stage remarqué au Cours Florent. Le timide se révèle à lui-même, découvre la force libératoire de l'expression des émotions qu'il s'autorise puisque écrite par d'autres. Été 2025, il part en immersion universitaire à Taïwan ; cette année ce sera Shanghai.\n\nFéru d'astrologie et de spiritualités anciennes, engagé dans un travail thérapeutique profond autour de son vécu, André reste pourtant difficile à résumer. Tout chez lui semble organisé pour transformer les blessures en architecture intérieure.\n\nMais aux yeux de Sébastien Moreu, le plus bouleversant est ailleurs, le plus bouleversant c'est de regarder André observer une fleur sauvage. Parce qu'alors toute la mécanique tombe — la maîtrise, la défense, le contrôle — et réapparaît soudain quelque chose d'extrêmement rare : une douceur intacte ayant survécu à tout le reste.\n\nPour conclure, il citerait probablement Jorge Amado : « Le monde ne vaut que par l'émotion qu'il nous donne. » ou plus certainement aujourd'hui Gisèle Pelicot : « La honte doit changer de camp. »",prst:"Dossier de Presse",prss:"Dossier de presse en préparation",prsc:"contact@moneypenis.com",plt:"Ils en Parlent",pls:"Revue de presse en préparation",nt:"Contact",ns:"Envoyer",n1:"Nom",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024\nISBN PF: 978-2-492649-21-9 · ISBN GF: 978-2-492649-20-2 · INPI n° 4999735 & 4999726 · Filigrane numérique",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Je déclare sur l'honneur être âgé(e) de 18 ans ou plus et être majeur(e) selon la législation de mon pays de résidence.",ck2:"Je reconnais que ce site présente des œuvres photographiques artistiques à caractère explicite, incluant la vente de tirages originaux, et j'accepte d'y accéder en connaissance de cause.",nat:"Note des auteurs",naf:"Les Auteurs tiennent à avertir que la légèreté divertissante du titre et du logo peuvent, comme les visuels et textes explicites des œuvres, donner une impression de désinvolture face à un sujet pourtant grave. Ils rappellent qu'il n'en est rien et que ce conte est né de leurs expériences personnelles. Tous deux en ayant, pour des raisons et à des époques différentes, vécus tous les aspects.\n\nLeur projet artistique commun a pour intention de dissuader quiconque de s'engager dans une activité en prévenant qu'encore aujourd'hui : elle ferme plus de portes qu'elle n'en ouvre et expose à un grand nombre de risques ceux qui la pratiquent et leurs proches. Notamment infections et maladies, en particulier les MST, addictions à l'usage de drogues et alcools… Cette activité, sous quelque forme que ce soit, expose à la précarité, à la dépendance, au rejet social, à la violence, au chantage, aux abus, à la contrainte et aux rackets.\n\nPour ceux, trop rares, qui réussissent à s'en extraire, elle nécessite toujours un accompagnement psychologique à très long terme tant nos sociétés ne leurs laissent d'autres issues que la victimisation ou la honte, voire les deux à la fois.\n\nLes auteurs appellent donc au respect et à la protection des travailleurs du sexe. Sans pour autant disconvenir de la nécessité d'une pénalisation des clients, ils appellent pareillement à un traitement digne de la misère affective, voire de la détresse, qui les conduisent à contrevenir à la Loi. Les auteurs espèrent, de la part du grand public comme des institutions, un plus grand soutien aux associations qui peuvent accompagner les uns comme les autres.\n\nIl ne s'agit en aucun cas ici de lever aveuglément les tabous sur toutes les pratiques, pas plus que de faire scandale… Mais de rappeler l'urgence de se défaire des interdits sociétaux qui sclérosent un débat public qui pourtant se doit d'être serein, et non recouvert d'un habit de morale qui n'a rien à faire là et empêche toute libération de la parole. Ils n'ont aucun doute que s'il est un voile à bannir, c'est celui-ci.\n\nEt par débat, ils entendent évoquer le premier d'entre tous, celui qui devrait se tenir au sein de la famille.\n\nEt puis c'est beau… aussi… une bite !\n\n(Le modèle sélectionné par les artistes n'est pas un travailleur du sexe. Partageant sa vie avec l'un des auteurs, il a tenu à rester anonyme.)\n\nSi les Auteurs ont abordé ce sujet qui les touche, c'est qu'il leur a semblé qu'à notre époque de communication formatée, de censure des réseaux et de renaissance de la pudibonderie, il était plus que jamais nécessaire d'apporter un point de vue créatif et artistique qui reste étrangement absent. Ils ont voulu donner à cet ensemble à la fois la légèreté qui devrait prévaloir lorsqu'on évoque l'amour et le plaisir, et le poids qu'imposent les réalités vécues : avec courage et sans pathos.\n\nIls n'entendent pas se substituer aux choix individuels, pas plus qu'aux lois en vigueur dans des pays souverains comme aux valeurs auxquelles chacun est libre d'adhérer.\n\nEn France — ce n'est pas le cas dans tous les pays même démocratiques — les réponses apportées par la police et la justice, dans le cadre légal d'une lutte essentielle contre le trafic d'êtres humains, se sont améliorées au fur et à mesure des années dans le sens de ce que l'on attend d'un pays moderne. Mais elles le font dans le cadre de l'aspect général et n'apportent pas, ce n'est peut-être pas leur rôle, d'amélioration aux situations individuelles vécues tant par les travailleurs du sexe que par leurs clients. Des associations remplissent discrètement leurs missions malgré la faiblesse de leurs moyens.\n\nTant pour les administrations concernées que pour les associations, des sites Internet existent. Certains très utiles sont sélectionnés et disponibles sur une liste régulièrement mise à jour sur notre propre site Internet : www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Planches à l'unité",siCh:"Choisir le format",siInq:"Demander",siNote:"Prix en euros, TVA française incluse. Frais d'emballage, d'expédition et d'assurance facturés au coût réel.",siCont:"Pour acquérir, contactez-nous à smoreu@mac.com — ou via le formulaire de contact",siPro:"Libraires, marchands d'art et galeries — pour nos conditions professionnelles, expositions et dépôts, merci de nous écrire.",siRgpd:"Les coordonnées transmises serviront uniquement à votre demande et à des informations sur les projets des artistes",siPick:"Cliquer sur une planche pour la voir et l'acquérir",req:"Faire une demande",reqAge:"Cette section est réservée aux personnes majeures.",shPfD:"30 × 40 cm · 50 exemplaires numérotés et signés",shGfD:"50 × 70 cm · 15 exemplaires numérotés et signés",shUn:"Planches à l'unité",shUnD:"Chaque tirage en Petit ou Grand Format, signé S.M. & A.V.",fFirstName:"Prénom",fPhone:"Téléphone",fCountry:"Pays",fLangPref:"Langue de réponse",fPref:"Préférence de contact",fMatrix:"Objet de la demande",fMatrixHint:"Cochez les cases correspondantes",fMsgPh:"Précisions (500 caractères max.)",fConsent:"J'accepte les conditions ci-dessus et l'envoi de mes coordonnées à Sébastien Moreu et André Vaszkievicz.",fSent:"Demande envoyée. Vous recevrez une réponse à l'adresse indiquée.",fError:"Erreur d'envoi. Vous pouvez écrire directement à smoreu@mac.com.",rqInfo:"Information",rqBuy:"Achat",rqDeposit:"Dépôt",rqPro:"Professionnel",rqColl:"Collectionneur",rqOther:"Autre",continueShop:"Continuer la consultation",nax:"Lire l'intégralité ▾",nac:"Réduire ▴",aiWarn:"ATTENTION : CETTE TRADUCTION EST GÉNÉRÉE PAR IA ET PEUT CONTENIR ERREURS OU CONTRESENS"},
  EN:{techs:["Poem · Golden cross","Handwritten letter · Navy ink · Sculpture","Color photograph · Yellow text","Silver gelatin print · Handwritten green ink","Color photo · Red text · Hermès tie","Color photograph · Open jeans · Nature","Cyan-tinted photo · Orange handwritten letter","Red text · B&W · Multilingual warning","Handwritten letter · €50 bills · Hands","Red text · B&W · Manifesto","Handwritten letter · Floral background · Navy ink"],aw:"Explicit Content · For Adults Only",am:"This site presents photographic artworks for informed adults only.",ap:"+ 18 — Full version",am2:"− 18 — Public version",nav:["Portfolio","Film","Box Set","In Situ","Shop","Bio & Signature","VS00","Contact"],hl:"Limited Edition · Original Silver Gelatin Prints",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"A Gay Pop Porn Fairy Tale, for informed adults.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Discover the work",pt:"I Love You Moneypenis",ps:"11 original silver gelatin prints · Traphot, Montrouge\nSigned and numbered by Sébastien Moreu & André Vaszkievicz",mg:"Click to enlarge",tech_info:"2024 · 30 × 40 cm / 11¾ × 15¾ in (50 ed.) · 50 × 70 cm / 19¾ × 27½ in (15 ed.) · Silver gelatin print · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm / 11¾ × 15¾ in (50 ed.) · 50 × 70 cm / 19¾ × 27½ in (15 ed.) · Print on Arches paper · Hand-numbered and signed by both artists",op:"Opening",tx:"Text",pr:"Protected artwork · Digital watermark",ct:"The Box Set",cs:"Complete portfolio · 11 silver gelatin prints · Signed & numbered · Gloves included",zt:"In Situ",zs:"The works in situ",vt:"Film",vs:"Content for informed adults only",st:"Acquire",pft:"Small Format  30 × 40 cm",pfc:"50 portfolios numbered 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Large Format  50 × 70 cm",gfc:"15 portfolios numbered 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signed S.M. & A.V. · Number on each print · Gloves included",pd:"Traphot, Montrouge",p1:"Complete SF portfolio",p2:"Single SF print",p3:"Complete LF portfolio",p4:"Single LF print",sh:"Shipping & Insurance",sb:"Museum packaging · DHL Express\nFrance €45 · Europe €95 · International €180\nInsurance included",py:"Payment",pb:"Bank transfer · Credit card · PayPal · 3× interest-free",co:"Terms",cb:"Certificate of authenticity · 14-day return · VAT by country",rv:"Reserve",by:"Acquire",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — who reminds us, as a kind of stylistic resignation, that everyone has always called him Sébastien — is what happens when discipline and will refuse to domesticate obsession.\n\nBorn on December 25, 1972 in a setting too perfect to be innocent — Saint-Tropez — he grew up in the shadow of precision (a dentist father shaping mouths) and of myth: resistance fighters, sailors, missing men, family ghosts refusing to stay buried. At ten, he is handed a full painting arsenal. Not a toy. A first loaded weapon — the beginning of a baroque collection, that of a man mad for intimate wars.\n\nHe will never return them. Preferring to multiply his battlefields.\n\nHe advances through successive displacements: painting, books, images, human relations — everything becomes material, everything can be reassembled. What he builds is not a work in the classical sense, but a field of tensions: between memory and invention, fidelity and betrayal, control and loss.\n\nHe doesn't work for institutions. He infiltrates them. Since the nineties, in the orbit of gallerist Enrico Navarra, he has built a career that refuses labels: neither quite employee, nor quite artist, nor mere editor — rather a productive anomaly, capable of generating books, exhibitions, links, archives, ideas, communication, events, at a pace as breathtaking as it is discontinuous. A disorder that serves as camouflage for this man who methodically destroys every frame meant to contain him.\n\nHe actively participates in the conception and development of the Made By… collection, an international editorial project devoted to contemporary creation across different cultural scenes. In this context, he collaborates closely with photographer Simon Schwyzer.\n\nHis relationship with Simon Schwyzer is the unstable heart of it: a collaboration become dependency, a friendship transformed into a love system. A couple? Since the brutal death of the Swiss photographer, Moreu answers: \"Ask him.\" Still, after his disappearance, nothing stops — on the contrary, everything intensifies. Working becomes a way of holding on, editing a way of prolonging, writing a way of not giving in. He commits to preserving and promoting Schwyzer's work, notably through the preparation of the monograph Made by… Simon Schwyzer.\n\nIn 2017, with the support of Enrico Navarra, he had founded Éditions Sébastien Moreu, an independent imprint dedicated to art books, essays and transversal editorial projects. The memory of the Swiss photographer will destroy the enterprise. Not the projects.\n\nLater, with André Vaszkievicz, the intimate changes form again. I Love You Moneypenis is not a decorative project laid over their relationship: it is a collision of text, image, desire, money, body. A work conceived from inside the bond, without protective filter. Their marriage, on October 19, 2024 in Saint-Tropez, stabilizes nothing: it makes official what was already overflowing.\n\nHis own work — collages, texts, editorial devices — belongs to an aesthetics of exposure. Open newspapers, cut-out images, memory treated as raw material. Nothing is neutral. Everything is implicated.\n\nPhysically, he carries a body that doesn't always cooperate: rapid heart, capricious tension, system under pressure. And yet he continues, with habits that sometimes resemble defiance, sometimes indifference to consequences. No proper redemption narrative here. Only persistence.\n\nHe loves intensely, archives obsessively, works compulsively, and refuses to simplify anything.\n\nIf there is a unifying principle, it is this: Sébastien Moreu does not resolve his contradictions, so much does he venerate those of others.\n\nHis own, he organizes — then lives inside the exhibition. This gallery is his home and the one he offers entirely to those he loves; nothing is ever for himself.\n\nTo conclude, he would quote Desproges: \"Astonishing, isn't it?\" ",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz was born on November 28, 1990 in a Brazil that bears little resemblance to tropical postcards. Seberi, a small rural town in the south of the country, belongs to those territories shaped by twentieth-century European migrations: Polish communities here, but a little further away German, Italian, Lithuanian… where languages, traditions, dances and Catholicism sometimes survive with even more obstinacy than in their countries of origin.\n\nSon of Polish descendants born in Brazil, André grew up in an environment structured by work, religion, silences and masculine codes. The last child of eight siblings (with only one sister), born nearly ten years after the youngest of his elders, he arrived in a family already marked by effort, constraints and the weight of cultural heritage.\n\nAn unforeseen, loved one. Loved but not expected. He would be quite alone in this large family.\n\nVery early on, he understood two things: he felt deeply in his place at school, and certain desires had no place in the world he was growing up in.\n\nGay adolescence is easy for no one, nowhere… but in that rural and conservative context, it was not even spoken of. The word did not exist and desire was experienced more as an inner tension than as a possible identity.\n\nSo André learned to observe and to stay silent, to control his gestures, to blame his body and his emotions.\nHe was too sensitive to speak and too taciturn to be sentimental. Too disciplined not to be wounded. Too desired to love simply. Too betrayed to confide it.\n\nBut there were books, dictionaries, geographic maps, foreign languages — a whole almost infinite world of paper that already allowed him to leave Seberi mentally before he could do so physically.\n\nAfter the equivalent of the baccalaureate, brilliant, higher studies would nonetheless remain inaccessible to his condition. André worked in Porto Alegre, discovered a bit of freedom and a bit of himself along with it, then gradually left Brazil for Europe and the World. Perhaps further away one can find more of oneself.\nHe learned English in Ireland, obtained Lithuanian citizenship through family ancestry and developed a remarkable mastery of languages: Portuguese, Spanish, Polish, French, German and several others still. Most of the time alone.\n\nHis relationship with languages was as much a matter of academic performance as of a form of existential displacement: changing language became also a way to displace embarrassment, to outwit boredom, to cross borders and to improve the gaze he cast upon himself.\n\nThe following years long resembled a precarious crossing of contemporary Europe: uprooting, pandemic, permanent reconstruction.\n\nYet André maintained an almost ascetic discipline: sport, constant intellectual work, dietary control, never alcohol, and practically no drugs. His body seemed treated as a territory to be kept standing at all costs.\n\nThe encounter with Sébastien Moreu transformed this trajectory but did not erase its wounds… or at least tried to soften them. Together, they developed I Love You Moneypenis, a project blending image, desire, autobiography and performance. Their marriage, celebrated in Saint-Tropez on October 19, 2024, did not stabilize the chaos: it simply gave it a viable and visible form, a respite.\n\nIn parallel, André resumed studies at Sorbonne Nouvelle in language sciences, where his results quickly drew attention, notably in Chinese. He also completed a noted internship at the Cours Florent. The shy one revealed himself to himself, discovered the liberating force of expressing emotions he allowed himself since they were written by others. Summer 2025, he left for a university immersion in Taiwan; this year it will be Shanghai.\n\nPassionate about astrology and ancient spiritualities, engaged in deep therapeutic work around his lived experience, André nonetheless remains difficult to summarize. Everything about him seems organized to transform wounds into interior architecture.\n\nBut in the eyes of Sébastien Moreu, the most moving thing is elsewhere — the most moving thing is to watch André observe a wildflower. Because then the entire machinery falls — the mastery, the defense, the control — and suddenly something extremely rare reappears: an intact gentleness having survived everything else.\n\nTo conclude, he would probably quote Jorge Amado: \"The world is worth only the emotion it gives us.\" or more certainly today Gisèle Pelicot: \"Shame must change sides.\"",prst:"Press Kit",prss:"Press kit in preparation",prsc:"contact@moneypenis.com",plt:"Reviews",pls:"Press review in preparation",nt:"Contact",ns:"Send",n1:"Name",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024\nISBN SF: 978-2-492649-21-9 · ISBN LF: 978-2-492649-20-2 · INPI no. 4999735 & 4999726",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"I hereby declare that I am 18 years of age or older and of legal age according to the laws of my country of residence.",ck2:"I acknowledge that this site presents explicit artistic photographic works, including the sale of original prints, and I consent to access it knowingly.",nat:"Authors' Note",naf:"The Authors wish to warn that the entertaining lightness of the title and logo may, like the explicit visuals and texts of the works, give an impression of flippancy toward a subject that is nonetheless serious. They remind us that this is not the case and that this tale was born of their personal experiences. Both having, for different reasons and at different times, lived all of its aspects.\n\nTheir joint artistic project intends to dissuade anyone from engaging in such an activity by warning that even today: it closes more doors than it opens and exposes those who practice it and their loved ones to a great many risks. Notably infections and illnesses, particularly STIs, addictions to drug and alcohol use… This activity, in whatever form, exposes one to precariousness, dependency, social rejection, violence, blackmail, abuse, coercion and racketeering.\n\nFor the too rare few who manage to extract themselves, it always requires very long-term psychological support, so deeply do our societies leave them no other exits than victimization or shame, or indeed both at once.\n\nThe authors therefore call for respect and protection of sex workers. Without denying the need to penalize clients, they likewise call for a dignified treatment of the emotional misery, even distress, that leads them to break the Law. The authors hope, from the general public as much as from institutions, for greater support to associations that can accompany both sides.\n\nThis is in no way about blindly lifting taboos on every practice, nor about creating scandal… But about recalling the urgency of shedding the societal prohibitions that ossify a public debate which ought instead to be serene, not draped in a moral garb that has no place there and that prevents any liberation of speech. They have no doubt that if there is a veil to be cast off, it is this one.\n\nAnd by debate, they mean to invoke the first of them all, the one that should be held within the family.\n\nAnd besides… a cock is beautiful… too !\n\n(The model selected by the artists is not a sex worker. Sharing his life with one of the authors, he insisted on remaining anonymous.)\n\nIf the Authors have addressed this subject that touches them, it is because it seemed to them that in our era of formatted communication, network censorship and resurgent prudery, it was more than ever necessary to bring a creative and artistic perspective that remains strangely absent. They wanted to give this whole both the lightness that should prevail when speaking of love and pleasure, and the weight imposed by lived realities: with courage and without pathos.\n\nThey do not mean to substitute themselves for individual choices, any more than for the laws in force in sovereign countries or the values each is free to embrace.\n\nIn France — and this is not the case in every country, even democratic ones — the responses provided by police and justice, within the legal framework of an essential fight against human trafficking, have improved over the years in the direction one expects of a modern country. But they do so within the general framework and bring no improvement — perhaps it is not their role — to the individual situations experienced both by sex workers and by their clients. Associations quietly carry out their missions despite the meagerness of their means.\n\nFor the relevant administrations as well as for the associations, websites exist. Some particularly useful ones are selected and available on a regularly updated list on our own website: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Single Prints",siCh:"Choose format",siInq:"Inquire",siNote:"Prices in euros, French VAT included. Packaging, shipping and insurance billed at actual cost.",siCont:"To acquire, contact smoreu@mac.com — or via the contact form",siPro:"Booksellers, art dealers and galleries — please contact us for trade conditions, exhibitions and consignment.",siRgpd:"Information you provide will only be used for your inquiry and for updates on the artists' projects",siPick:"Click a print to view it and acquire it",req:"Make a request",reqAge:"This section is for adults only.",shPfD:"30 × 40 cm · 50 numbered and signed editions",shGfD:"50 × 70 cm · 15 numbered and signed editions",shUn:"Single Prints",shUnD:"Each print available in Small or Large Format, signed S.M. & A.V.",fFirstName:"First name",fPhone:"Phone",fCountry:"Country",fLangPref:"Reply language",fPref:"Contact preference",fMatrix:"Subject of request",fMatrixHint:"Check the relevant boxes",fMsgPh:"Details (500 characters max.)",fConsent:"I accept the above conditions and the transmission of my details to Sébastien Moreu and André Vaszkievicz.",fSent:"Request sent. You will receive a reply at the address provided.",fError:"Sending failed. You can write directly to smoreu@mac.com.",rqInfo:"Information",rqBuy:"Purchase",rqDeposit:"Consignment",rqPro:"Trade",rqColl:"Collector",rqOther:"Other",continueShop:"Continue browsing",nax:"Read in full ▾",nac:"Collapse ▴",aiWarn:"WARNING: THIS TRANSLATION IS AI-GENERATED AND MAY CONTAIN ERRORS OR MISINTERPRETATIONS"},
  ES:{techs:["Poema · Cruz dorada","Carta manuscrita · Tinta marina · Escultura","Fotografía a color · Texto amarillo","Copia argéntica · Tinta verde manuscrita","Foto a color · Texto rojo · Corbata Hermès","Fotografía a color · Jeans abiertos · Naturaleza","Foto teñida de cian · Carta manuscrita naranja","Texto rojo · B/N · Advertencia multilingüe","Carta manuscrita · Billetes de 50€ · Manos","Texto rojo · B/N · Manifiesto","Carta manuscrita · Fondo floral · Tinta marina"],aw:"Contenido Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versión completa",am2:"− 18 — Versión pública",nav:["Portfolio","Vídeo","Caja","In Situ","Tienda","Bio & Signature","VS00","Contacto"],hl:"Edición Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"París, 2024",hd:"Un Cuento de Hadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Descubrir",pt:"I Love You Moneypenis",ps:"11 copias en plata · Traphot · Firmadas y numeradas",mg:"Clic para ampliar",tech_info:"2024 · 30 × 40 cm (50 ej.) · 50 × 70 cm (15 ej.) · Copia argéntica · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ej.) · 50 × 70 cm (15 ej.) · Impresión sobre papel Arches · Numerada y firmada a mano por ambos artistas",op:"Apertura",tx:"Texto",pr:"Obra protegida",ct:"La Caja",cs:"Portfolio completo · 11 copias · Firmadas · Guantes",zt:"In Situ",zs:"Las obras en situación",vt:"Vídeo",vs:"Contenido para adultos",st:"Adquirir",pft:"Pequeño Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Gran Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmadas · Numeradas · Guantes",pd:"Traphot",p1:"Portfolio PF",p2:"Copia PF",p3:"Portfolio GF",p4:"Copia GF",sh:"Transporte",sb:"DHL · Francia 45€ · Europa 95€ · Internacional 180€",py:"Pago",pb:"Transferencia · Tarjeta · PayPal",co:"Condiciones",cb:"Certificado · Devolución 14 días",rv:"Reservar",by:"Adquirir",bt:"Bio & Firmas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que recuerda, como una resignación estilística, que todos siempre lo han llamado Sébastien — es lo que ocurre cuando la disciplina y la voluntad se niegan a domesticar la obsesión.\n\nNacido el 25 de diciembre de 1972 en Saint-Tropez, crece a la sombra de la precisión y del mito familiar. A los diez años recibe un arsenal de pintura: una primera arma cargada, inicio de una colección barroca de guerras íntimas.\n\nDesde los años 90, en la órbita del galerista Enrico Navarra, construye una carrera que rechaza las etiquetas. Participa en la colección Made By…, donde colabora estrechamente con el fotógrafo Simon Schwyzer. Su muerte brutal no detiene nada: al contrario, todo se intensifica.\n\nEn 2017 funda Éditions Sébastien Moreu. Más tarde, con André Vaszkievicz, lo íntimo cambia de forma: I Love You Moneypenis no es decorativo, es una colisión de texto, imagen, deseo, dinero, cuerpo. Su matrimonio el 19 de octubre de 2024 en Saint-Tropez no estabiliza nada: hace oficial lo que ya desbordaba.\n\nSi existe un principio unificador es éste: Sébastien Moreu no resuelve sus contradicciones, tanto venera las de los demás. Las suyas, las organiza — y vive dentro de la exposición.",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz nació el 28 de noviembre de 1990 en un Brasil que poco se parece a las postales tropicales. Seberi, pequeña ciudad rural del sur del país, pertenece a esos territorios moldeados por las migraciones europeas del siglo XX: comunidades polacas aquí, pero un poco más lejos alemanas, italianas, lituanas… donde las lenguas, las tradiciones, los bailes y el catolicismo sobreviven a veces con más obstinación que en sus países de origen.\n\nHijo de descendientes polacos nacidos en Brasil, André crece en un entorno estructurado por el trabajo, la religión, los silencios y los códigos viriles. Último hijo de una familia de ocho hermanos (con una sola hermana), nacido casi diez años después del menor de sus mayores, llega a una familia ya marcada por el esfuerzo, las limitaciones y el peso de las herencias culturales.\n\nUn imprevisto amado. Amado pero no esperado. Estará bien solo en esa familia numerosa.\n\nMuy pronto comprende dos cosas: se siente profundamente en su lugar en la escuela, y ciertos deseos no tienen cabida en el mundo en el que crece.\n\nLa adolescencia gay no es fácil para nadie, en ninguna parte… pero en ese contexto rural y conservador, ni siquiera se habla de ello. La palabra no existe y el deseo se vive más como una tensión interior que como una identidad posible.\n\nAndré aprende entonces a observar y a callarse, a controlar sus gestos, a culpar a su cuerpo y a sus emociones.\nEs demasiado sensible para hablar y demasiado callado para ser sentimental. Demasiado disciplinado para no ser herido. Demasiado deseado para amar simplemente. Demasiado traicionado para confiarlo.\n\nPero estaban los libros, los diccionarios, los mapas geográficos, las lenguas extranjeras — todo un mundo de papel casi infinito que ya le permitía abandonar Seberi mentalmente antes de poder hacerlo físicamente.\n\nTras el equivalente al bachillerato, brillante, los estudios superiores permanecerían sin embargo inaccesibles a su condición. André trabaja en Porto Alegre, descubre algo de libertad y algo de sí mismo con ella, luego abandona progresivamente Brasil por Europa y el Mundo. Quizás más lejos se pueda encontrar más de uno mismo.\nAprende inglés en Irlanda, obtiene la nacionalidad lituana por ascendencia familiar y desarrolla un dominio notable de las lenguas: portugués, español, polaco, francés, alemán y otras varias más. La mayor parte del tiempo solo.\n\nSu relación con las lenguas tiene tanto que ver con la performance académica como con una forma de desplazamiento existencial: cambiar de lengua se convierte también en una manera de desplazar la incomodidad, engañar al aburrimiento, atravesar las fronteras y mejorar la mirada que se dirige a sí mismo.\n\nLos años siguientes se asemejan durante mucho tiempo a una travesía precaria de la Europa contemporánea: desarraigo, pandemia, reconstrucción permanente.\n\nSin embargo André conserva una disciplina casi ascética: deporte, trabajo intelectual constante, control alimentario, nunca alcohol, y prácticamente ninguna droga. Su cuerpo parece tratado como un territorio que debe mantenerse en pie cueste lo que cueste.\n\nEl encuentro con Sébastien Moreu transforma esa trayectoria pero no borra sus heridas… al menos intenta suavizarlas. Juntos desarrollan I Love You Moneypenis, proyecto que mezcla imagen, deseo, autobiografía y performance. Su matrimonio, celebrado en Saint-Tropez el 19 de octubre de 2024, no estabiliza el caos: simplemente le da una forma viable y visible, un respiro.\n\nParalelamente, André retoma sus estudios en la Sorbonne Nouvelle en ciencias del lenguaje, donde sus resultados llaman rápidamente la atención, en especial en chino. Realiza también una práctica destacada en el Cours Florent. El tímido se revela a sí mismo, descubre la fuerza liberadora de expresar las emociones que se permite ya que están escritas por otros. Verano de 2025, parte en inmersión universitaria a Taiwán; este año será Shanghái.\n\nApasionado por la astrología y las espiritualidades antiguas, comprometido en un trabajo terapéutico profundo en torno a su vivencia, André sigue siendo sin embargo difícil de resumir. Todo en él parece organizado para transformar las heridas en arquitectura interior.\n\nPero a los ojos de Sébastien Moreu, lo más conmovedor está en otra parte: lo más conmovedor es mirar a André observar una flor silvestre. Porque entonces toda la mecánica se desmorona — el dominio, la defensa, el control — y reaparece de pronto algo extremadamente raro: una dulzura intacta que ha sobrevivido a todo lo demás.\n\nPara concluir, citaría probablemente a Jorge Amado: « El mundo sólo vale por la emoción que nos da. » o más seguramente hoy a Gisèle Pelicot: « La vergüenza debe cambiar de bando. »",prst:"Prensa",prss:"En preparación",prsc:"contact@moneypenis.com",plt:"Reseñas",pls:"En preparación",nt:"Contacto",ns:"Enviar",n1:"Nombre",n2:"Email",n3:"Mensaje",lg:"© Sébastien Moreu · © André Vaszkievicz · París 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro bajo mi responsabilidad tener 18 años o más y ser mayor de edad según la legislación de mi país de residencia.",ck2:"Reconozco que este sitio presenta obras fotográficas artísticas de carácter explícito, incluyendo la venta de copias originales, y acepto acceder a él con pleno conocimiento.",nat:"Nota de los autores",naf:"Los Autores desean advertir que la ligereza entretenida del título y el logotipo puede, como los visuales y textos explícitos de las obras, dar una impresión de despreocupación frente a un tema sin embargo grave. Recuerdan que no es así y que este cuento nació de sus experiencias personales. Ambos habiendo vivido, por razones distintas y en épocas distintas, todos sus aspectos.\n\nSu proyecto artístico común tiene la intención de disuadir a cualquiera de involucrarse en una actividad advirtiendo que aún hoy: cierra más puertas de las que abre y expone a múltiples riesgos a quienes la practican y a sus allegados. En particular infecciones y enfermedades, especialmente las ITS, adicciones al uso de drogas y alcohol… Esta actividad, en cualquier forma, expone a la precariedad, la dependencia, el rechazo social, la violencia, el chantaje, los abusos, la coacción y los chantajes.\n\nPara los demasiado escasos que logran salir de ella, requiere siempre un acompañamiento psicológico a muy largo plazo, tanto nuestras sociedades no les dejan otra salida que la victimización o la vergüenza, incluso ambas a la vez.\n\nLos autores llaman pues al respeto y a la protección de los trabajadores del sexo. Sin negar la necesidad de penalizar a los clientes, llaman igualmente a un trato digno hacia la miseria afectiva, incluso la angustia, que los lleva a transgredir la Ley. Los autores esperan, tanto del gran público como de las instituciones, un mayor apoyo a las asociaciones que pueden acompañar a unos y a otros.\n\nNo se trata aquí de levantar ciegamente los tabúes sobre todas las prácticas, ni de provocar escándalo… Sino de recordar la urgencia de deshacerse de las prohibiciones sociales que esclerotizan un debate público que sin embargo debería ser sereno, y no cubierto con un manto de moralina que no tiene nada que hacer ahí e impide toda liberación de la palabra. No tienen ninguna duda de que si hay un velo que desterrar, es éste.\n\nY por debate entienden evocar el primero de todos, el que debería celebrarse en el seno de la familia.\n\nY además es bonita… también… una polla !\n\n(El modelo seleccionado por los artistas no es un trabajador del sexo. Compartiendo su vida con uno de los autores, ha querido permanecer anónimo.)\n\nSi los Autores abordaron este tema que les concierne, es porque les pareció que en nuestra época de comunicación estandarizada, de censura en las redes y de renacimiento de la mojigatería, era más necesario que nunca aportar un punto de vista creativo y artístico que sigue estando extrañamente ausente. Quisieron dar a este conjunto tanto la ligereza que debería prevalecer al evocar el amor y el placer, como el peso que imponen las realidades vividas: con valentía y sin patetismo.\n\nNo pretenden sustituirse a las decisiones individuales, ni a las leyes vigentes en países soberanos ni a los valores a los que cada cual es libre de adherirse.\n\nEn Francia — no es el caso en todos los países, incluso democráticos — las respuestas de la policía y la justicia, en el marco legal de una lucha esencial contra el tráfico de seres humanos, han ido mejorando con los años hacia lo que se espera de un país moderno. Pero lo hacen en el marco general y no aportan, quizá no sea su papel, mejoras a las situaciones individuales que viven tanto los trabajadores del sexo como sus clientes. Asociaciones cumplen discretamente con sus misiones a pesar de la debilidad de sus medios.\n\nTanto para las administraciones como para las asociaciones, existen sitios web. Algunos muy útiles están seleccionados y disponibles en una lista actualizada regularmente en nuestro propio sitio web: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Grabados sueltos",siCh:"Elegir formato",siInq:"Consultar",siNote:"Precios en euros, IVA francés incluido. Embalaje, transporte y seguro facturados al coste real.",siCont:"Para adquirir, contactar smoreu@mac.com — o usar el formulario de contacto",siPro:"Libreros, marchantes y galerías — contáctennos para condiciones profesionales, exposiciones y depósitos.",siRgpd:"Los datos proporcionados se usarán solo para su solicitud y para información sobre los proyectos de los artistas",siPick:"Clic en una obra para verla y adquirirla",req:"Hacer una solicitud",reqAge:"Esta sección está reservada a personas mayores de edad.",shPfD:"30 × 40 cm · 50 ejemplares numerados y firmados",shGfD:"50 × 70 cm · 15 ejemplares numerados y firmados",shUn:"Grabados sueltos",shUnD:"Cada copia disponible en Pequeño o Gran Formato, firmada S.M. & A.V.",fFirstName:"Nombre",fPhone:"Teléfono",fCountry:"País",fLangPref:"Idioma de respuesta",fPref:"Preferencia de contacto",fMatrix:"Objeto de la solicitud",fMatrixHint:"Marque las casillas correspondientes",fMsgPh:"Precisiones (máx. 500 caracteres)",fConsent:"Acepto las condiciones anteriores y la transmisión de mis datos a Sébastien Moreu y André Vaszkievicz.",fSent:"Solicitud enviada. Recibirá una respuesta en la dirección indicada.",fError:"Error de envío. Puede escribir directamente a smoreu@mac.com.",rqInfo:"Información",rqBuy:"Compra",rqDeposit:"Depósito",rqPro:"Profesional",rqColl:"Coleccionista",rqOther:"Otro",continueShop:"Seguir consultando",nax:"Leer todo ▾",nac:"Reducir ▴",aiWarn:"ATENCIÓN: ESTA TRADUCCIÓN ES GENERADA POR IA Y PUEDE CONTENER ERRORES O CONTRASENTIDOS"},
  PT:{techs:["Poema · Cruz dourada","Carta manuscrita · Tinta marinha · Escultura","Fotografia a cores · Texto amarelo","Cópia argêntica · Tinta verde manuscrita","Foto a cores · Texto vermelho · Gravata Hermès","Fotografia a cores · Jeans aberto · Natureza","Foto matizada ciano · Carta manuscrita laranja","Texto vermelho · P&B · Aviso multilíngue","Carta manuscrita · Notas de 50€ · Mãos","Texto vermelho · P&B · Manifesto","Carta manuscrita · Fundo floral · Tinta marinha"],aw:"Conteúdo Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versão completa",am2:"− 18 — Versão pública",nav:["Portfolio","Vídeo","Coffret","In Situ","Loja","Bio & Signature","VS00","Contacto"],hl:"Edição Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Um Conto de Fadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Descobrir",pt:"I Love You Moneypenis",ps:"11 cópias em prata · Traphot · Assinadas e numeradas",mg:"Clique para ampliar",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Tiragem argêntica · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Impressão em papel Arches · Numerada e assinada à mão pelos dois artistas",op:"Abertura",tx:"Texto",pr:"Obra protegida",ct:"O Coffret",cs:"Portfolio completo · 11 cópias · Assinadas · Luvas",zt:"In Situ",zs:"As obras em situação",vt:"Vídeo",vs:"Conteúdo para adultos",st:"Adquirir",pft:"Pequeno Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Assinadas · Numeradas · Luvas",pd:"Traphot",p1:"Portfolio PF",p2:"Cópia PF",p3:"Portfolio GF",p4:"Cópia GF",sh:"Transporte",sb:"DHL · França 45€ · Europa 95€ · Internacional 180€",py:"Pagamento",pb:"Transferência · Cartão · PayPal",co:"Condições",cb:"Certificado · Devolução 14 dias",rv:"Reservar",by:"Adquirir",bt:"Bio & Assinaturas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que lembra, como uma resignação estilística, que toda a gente sempre lhe chamou Sébastien — é o que acontece quando a disciplina e a vontade se recusam a domesticar a obsessão.\n\nNascido a 25 de dezembro de 1972 em Saint-Tropez, cresce à sombra da precisão e do mito familiar. Aos dez anos recebe um arsenal de pintura: uma primeira arma carregada, início de uma coleção barroca de guerras íntimas.\n\nDesde os anos 90, na órbita do galerista Enrico Navarra, constrói uma carreira que recusa rótulos. Participa na coleção Made By…, onde colabora estreitamente com o fotógrafo Simon Schwyzer. A morte brutal do fotógrafo suíço não detém nada: pelo contrário, tudo se intensifica.\n\nEm 2017 funda as Éditions Sébastien Moreu. Mais tarde, com André Vaszkievicz, o íntimo muda de forma: I Love You Moneypenis não é decorativo, é uma colisão de texto, imagem, desejo, dinheiro, corpo. O casamento a 19 de outubro de 2024 em Saint-Tropez não estabiliza nada: torna oficial o que já transbordava.\n\nSe existe um princípio unificador é este: Sébastien Moreu não resolve as suas contradições, tanto venera as dos outros. As suas, organiza-as — e vive dentro da exposição.",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz nasceu a 28 de novembro de 1990 num Brasil que pouco se assemelha aos postais tropicais. Seberi, pequena cidade rural do sul do país, pertence àqueles territórios moldados pelas migrações europeias do século XX: comunidades polacas aqui, mas um pouco mais longe alemãs, italianas, lituanas… onde as línguas, as tradições, as danças e o catolicismo sobrevivem por vezes com mais obstinação do que nos seus países de origem.\n\nFilho de descendentes polacos nascidos no Brasil, André cresce num ambiente estruturado pelo trabalho, pela religião, pelos silêncios e pelos códigos viris. Último filho de uma fratria de oito (com uma única irmã), nascido quase dez anos depois do mais novo dos seus irmãos mais velhos, chega a uma família já marcada pelo esforço, pelas limitações e pelo peso das heranças culturais.\n\nUm imprevisto amado. Amado mas não esperado. Estará bem sozinho nessa família numerosa.\n\nMuito cedo compreende duas coisas: sente-se profundamente no seu lugar na escola, e certos desejos não têm lugar no mundo onde cresce.\n\nA adolescência gay não é fácil para ninguém, em lugar nenhum… mas naquele contexto rural e conservador, nem sequer se fala disso. A palavra não existe e o desejo vive-se mais como uma tensão interior do que como uma identidade possível.\n\nAndré aprende então a observar e a calar-se, a controlar os seus gestos, a culpar o seu corpo e as suas emoções.\nÉ demasiado sensível para falar e demasiado calado para ser sentimental. Demasiado disciplinado para não ser ferido. Demasiado desejado para amar simplesmente. Demasiado traído para o confiar.\n\nMas havia os livros, os dicionários, os mapas geográficos, as línguas estrangeiras — todo um mundo de papel quase infinito que já lhe permitia deixar Seberi mentalmente antes de o poder fazer fisicamente.\n\nDepois do equivalente ao bacharelado, brilhante, os estudos superiores permaneceriam contudo inacessíveis à sua condição. André trabalha em Porto Alegre, descobre um pouco de liberdade e um pouco de si mesmo com ela, depois deixa progressivamente o Brasil pela Europa e pelo Mundo. Talvez mais longe se possa encontrar mais de si.\nAprende inglês na Irlanda, obtém a nacionalidade lituana por ascendência familiar e desenvolve um domínio notável das línguas: português, espanhol, polaco, francês, alemão e várias outras ainda. A maior parte do tempo sozinho.\n\nA sua relação com as línguas é tanto uma questão de performance académica como uma forma de deslocamento existencial: mudar de língua torna-se também uma maneira de deslocar o constrangimento, enganar o tédio, atravessar as fronteiras e melhorar o olhar que lança sobre si mesmo.\n\nOs anos seguintes assemelham-se durante muito tempo a uma travessia precária da Europa contemporânea: desenraizamento, pandemia, reconstrução permanente.\n\nNo entanto, André conserva uma disciplina quase ascética: desporto, trabalho intelectual constante, controlo alimentar, nunca álcool, e praticamente nenhuma droga. O seu corpo parece tratado como um território que é preciso manter de pé custe o que custar.\n\nO encontro com Sébastien Moreu transforma essa trajetória, mas não apaga as feridas… ou pelo menos tenta suavizá-las. Juntos, desenvolvem I Love You Moneypenis, projeto que mistura imagem, desejo, autobiografia e performance. O seu casamento, celebrado em Saint-Tropez a 19 de outubro de 2024, não estabiliza o caos: dá-lhe simplesmente uma forma viável e visível, uma trégua.\n\nEm paralelo, André retoma estudos na Sorbonne Nouvelle em ciências da linguagem, onde os seus resultados rapidamente atraem a atenção, sobretudo em chinês. Realiza também um estágio notado no Cours Florent. O tímido revela-se a si mesmo, descobre a força libertadora da expressão das emoções que se autoriza por serem escritas por outros. Verão de 2025, parte em imersão universitária a Taiwan; este ano será Xangai.\n\nApaixonado por astrologia e espiritualidades antigas, empenhado num trabalho terapêutico profundo em torno do seu vivido, André continua contudo difícil de resumir. Tudo nele parece organizado para transformar as feridas em arquitetura interior.\n\nMas aos olhos de Sébastien Moreu, o mais comovente está noutro lugar: o mais comovente é ver André observar uma flor silvestre. Porque então toda a mecânica cai — o domínio, a defesa, o controlo — e reaparece subitamente algo extremamente raro: uma doçura intacta que sobreviveu a todo o resto.\n\nPara concluir, citaria provavelmente Jorge Amado: « O mundo só vale pela emoção que nos dá. » ou mais seguramente hoje Gisèle Pelicot: « A vergonha deve mudar de campo. »",prst:"Imprensa",prss:"Em preparação",prsc:"contact@moneypenis.com",plt:"Críticas",pls:"Em preparação",nt:"Contacto",ns:"Enviar",n1:"Nome",n2:"Email",n3:"Mensagem",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro sob minha responsabilidade ter 18 anos ou mais e ser maior de idade segundo a legislação do meu país de residência.",ck2:"Reconheço que este site apresenta obras fotográficas artísticas de carácter explícito, incluindo a venda de tiragens originais, e aceito aceder a ele com pleno conhecimento.",nat:"Nota dos autores",naf:"Os Autores fazem questão de avisar que a leveza divertida do título e do logótipo podem, tal como os visuais e textos explícitos das obras, dar uma impressão de descontração perante um tema, no entanto, grave. Lembram que não é o caso e que este conto nasceu das suas experiências pessoais. Tendo ambos vivido, por razões e em épocas diferentes, todos os seus aspectos.\n\nO seu projeto artístico comum tem a intenção de dissuadir qualquer pessoa de se envolver nesta atividade alertando que, ainda hoje: fecha mais portas do que abre e expõe a inúmeros riscos quem a pratica e os seus próximos. Nomeadamente infeções e doenças, em particular as DST, adições ao uso de drogas e álcool… Esta atividade, sob qualquer forma, expõe à precariedade, à dependência, à rejeição social, à violência, à chantagem, aos abusos, à coação e às extorsões.\n\nPara os poucos demasiados raros que conseguem sair, exige sempre um acompanhamento psicológico a muito longo prazo, tanto as nossas sociedades não lhes deixam outra saída que a vitimização ou a vergonha, ou mesmo as duas ao mesmo tempo.\n\nOs autores apelam portanto ao respeito e à proteção dos trabalhadores do sexo. Sem por isso desconvirem da necessidade de uma penalização dos clientes, apelam igualmente a um tratamento digno da miséria afetiva, ou mesmo da angústia, que os leva a contravir a Lei. Os autores esperam, da parte do grande público como das instituições, um maior apoio às associações que podem acompanhar uns e outros.\n\nNão se trata aqui de levantar cegamente os tabus sobre todas as práticas, nem de fazer escândalo… Mas de lembrar a urgência de nos desfazermos das proibições societais que esclerosam um debate público que deveria ser sereno, e não coberto com um manto moral que nada tem a fazer aí e impede toda libertação da palavra. Não têm dúvida alguma de que, se há um véu a banir, é este.\n\nE por debate, entendem evocar o primeiro de todos, aquele que se deveria realizar no seio da família.\n\nE além disso… é bonita… também… uma pila !\n\n(O modelo selecionado pelos artistas não é um trabalhador do sexo. Partilhando a sua vida com um dos autores, fez questão de permanecer anónimo.)\n\nSe os Autores abordaram este tema que os toca, é porque lhes pareceu que, na nossa era de comunicação formatada, de censura das redes e de renascimento do pudibundismo, era mais que nunca necessário trazer um ponto de vista criativo e artístico que permanece estranhamente ausente. Quiseram dar a este conjunto tanto a leveza que deveria prevalecer ao evocar o amor e o prazer, como o peso imposto pelas realidades vividas: com coragem e sem pathos.\n\nNão pretendem substituir-se às escolhas individuais, nem às leis em vigor em países soberanos nem aos valores aos quais cada um é livre de aderir.\n\nEm França — não é o caso em todos os países, mesmo democráticos — as respostas dadas pela polícia e justiça, no quadro legal de uma luta essencial contra o tráfico de seres humanos, têm vindo a melhorar ao longo dos anos no sentido do que se espera de um país moderno. Mas fazem-no no quadro geral e não trazem, talvez não seja o seu papel, melhorias às situações individuais vividas tanto pelos trabalhadores do sexo como pelos seus clientes. Associações cumprem discretamente as suas missões apesar da fragilidade dos seus meios.\n\nTanto para as administrações como para as associações, existem sites na Internet. Alguns muito úteis estão selecionados e disponíveis numa lista regularmente atualizada no nosso próprio site: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Estampas avulsas",siCh:"Escolher formato",siInq:"Consultar",siNote:"Preços em euros, IVA francês incluído. Embalagem, transporte e seguro faturados ao custo real.",siCont:"Para adquirir, contactar smoreu@mac.com — ou via formulário de contacto",siPro:"Livreiros, marchands e galerias — contactem-nos para condições profissionais, exposições e consignações.",siRgpd:"Os dados fornecidos serão usados apenas para o seu pedido e para informações sobre os projetos dos artistas",siPick:"Clique em uma estampa para ver e adquirir",req:"Fazer um pedido",reqAge:"Esta secção é reservada a pessoas maiores de idade.",shPfD:"30 × 40 cm · 50 exemplares numerados e assinados",shGfD:"50 × 70 cm · 15 exemplares numerados e assinados",shUn:"Estampas avulsas",shUnD:"Cada estampa disponível em Pequeno ou Grande Formato, assinada S.M. & A.V.",fFirstName:"Nome próprio",fPhone:"Telefone",fCountry:"País",fLangPref:"Idioma de resposta",fPref:"Preferência de contacto",fMatrix:"Objeto do pedido",fMatrixHint:"Assinale as casas correspondentes",fMsgPh:"Precisões (máx. 500 caracteres)",fConsent:"Aceito as condições acima e a transmissão dos meus dados a Sébastien Moreu e André Vaszkievicz.",fSent:"Pedido enviado. Receberá uma resposta no endereço indicado.",fError:"Erro de envio. Pode escrever diretamente para smoreu@mac.com.",rqInfo:"Informação",rqBuy:"Compra",rqDeposit:"Depósito",rqPro:"Profissional",rqColl:"Colecionador",rqOther:"Outro",continueShop:"Continuar a consulta",nax:"Ler tudo ▾",nac:"Reduzir ▴",aiWarn:"ATENÇÃO: ESTA TRADUÇÃO É GERADA POR IA E PODE CONTER ERROS OU CONTRASSENSOS"},
  DE:{techs:["Gedicht · Goldenes Kreuz","Handschriftlicher Brief · Marineblaue Tinte · Skulptur","Farbfotografie · Gelber Text","Silbergelatineabzug · Handschriftliche grüne Tinte","Farbfoto · Roter Text · Hermès-Krawatte","Farbfotografie · Offene Jeans · Natur","Cyan getöntes Foto · Orange handschriftlicher Brief","Roter Text · S/W · Mehrsprachige Warnung","Handschriftlicher Brief · 50€-Scheine · Hände","Roter Text · S/W · Manifest","Handschriftlicher Brief · Blumenhintergrund · Marineblaue Tinte"],aw:"Expliziter Inhalt",am:"Fotografien für Erwachsene.",ap:"+ 18 — Vollständige Version",am2:"− 18 — Öffentliche Version",nav:["Portfolio","Film","Set","In Situ","Shop","Bio & Signature","VS00","Kontakt"],hl:"Limitierte Auflage",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Ein Gay Pop Porn Märchen.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Entdecken",pt:"I Love You Moneypenis",ps:"11 Silbergelatinedrucke · Traphot · Signiert",mg:"Zum Vergrößern klicken",tech_info:"2024 · 30 × 40 cm (50 Ex.) · 50 × 70 cm (15 Ex.) · Silbergelatinedruck · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 Ex.) · 50 × 70 cm (15 Ex.) · Druck auf Arches-Papier · Von beiden Künstlern handnummeriert und signiert",op:"Eröffnung",tx:"Text",pr:"Geschütztes Kunstwerk",ct:"Das Set",cs:"Vollständiges Portfolio · 11 Drucke · Handschuhe",zt:"In Situ",zs:"Die Werke in situ",vt:"Film",vs:"Nur für Erwachsene",st:"Erwerben",pft:"Kleinformat 30×40",pfc:"50 Portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Großformat 50×70",gfc:"15 Portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signiert · Nummeriert · Handschuhe",pd:"Traphot",p1:"Portfolio KF",p2:"Einzeldruck KF",p3:"Portfolio GF",p4:"Einzeldruck GF",sh:"Versand",sb:"DHL · Frankreich 45€ · Europa 95€ · International 180€",py:"Zahlung",pb:"Überweisung · Kreditkarte · PayPal",co:"Bedingungen",cb:"Echtheitszertifikat · 14-tägiges Rückgaberecht",rv:"Reservieren",by:"Erwerben",bt:"Bio & Signaturen",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — der wie eine stilistische Resignation daran erinnert, dass ihn immer alle Sébastien genannt haben — ist das, was geschieht, wenn Disziplin und Wille sich weigern, die Obsession zu zähmen.\n\nGeboren am 25. Dezember 1972 in Saint-Tropez, wächst er im Schatten der Präzision und des Familienmythos auf. Mit zehn erhält er ein vollständiges Malarsenal: eine erste geladene Waffe, Beginn einer barocken Sammlung intimer Kriege.\n\nSeit den 90er Jahren, im Umkreis des Galeristen Enrico Navarra, baut er eine Karriere auf, die Etiketten ablehnt. Er beteiligt sich an der Sammlung Made By…, wo er eng mit dem Fotografen Simon Schwyzer zusammenarbeitet. Dessen brutaler Tod stoppt nichts — im Gegenteil, alles intensiviert sich.\n\n2017 gründet er die Éditions Sébastien Moreu. Später, mit André Vaszkievicz, verändert sich das Intime erneut: I Love You Moneypenis ist nicht dekorativ, sondern eine Kollision aus Text, Bild, Begehren, Geld, Körper. Die Hochzeit am 19. Oktober 2024 in Saint-Tropez stabilisiert nichts — sie offizialisiert, was bereits überlief.\n\nFalls es ein vereinigendes Prinzip gibt, dann dieses: Sébastien Moreu löst seine Widersprüche nicht auf, so sehr verehrt er die der anderen. Seine eigenen ordnet er — und lebt dann im Inneren der Ausstellung.",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz wurde am 28. November 1990 in einem Brasilien geboren, das den tropischen Postkarten kaum ähnelt. Seberi, eine kleine ländliche Stadt im Süden des Landes, gehört zu jenen Gebieten, die von den europäischen Migrationen des 20. Jahrhunderts geprägt wurden: hier polnische Gemeinschaften, etwas weiter weg deutsche, italienische, litauische… wo Sprachen, Traditionen, Tänze und der Katholizismus zuweilen mit noch mehr Hartnäckigkeit überleben als in ihren Herkunftsländern.\n\nAls Sohn polnischer Nachfahren, in Brasilien geboren, wächst André in einer Umgebung auf, die von Arbeit, Religion, Schweigen und männlichen Codes strukturiert ist. Als letztes Kind von acht Geschwistern (mit nur einer Schwester), fast zehn Jahre nach dem jüngsten seiner älteren Geschwister geboren, kommt er in eine Familie, die bereits durch Anstrengung, Zwänge und das Gewicht kultureller Erbschaften geprägt ist.\n\nEin geliebter Unvorhergesehener. Geliebt, aber nicht erwartet. Er wird ganz allein sein in dieser großen Familie.\n\nSehr früh begreift er zwei Dinge: Er fühlt sich tief am rechten Platz in der Schule, und bestimmte Begierden haben keinen Platz in der Welt, in der er aufwächst.\n\nDie schwule Adoleszenz ist für niemanden leicht, nirgendwo… doch in jenem ländlichen und konservativen Kontext ist davon nicht einmal die Rede. Das Wort existiert nicht, und das Begehren wird mehr als innere Spannung erlebt denn als mögliche Identität.\n\nAndré lernt also zu beobachten und zu schweigen, seine Gesten zu kontrollieren, seinen Körper und seine Gefühle anzuklagen.\nEr ist zu sensibel, um zu sprechen, und zu schweigsam, um sentimental zu sein. Zu diszipliniert, um nicht verletzt zu werden. Zu begehrt, um einfach zu lieben. Zu verraten, um es anzuvertrauen.\n\nDoch da waren die Bücher, die Wörterbücher, die geografischen Karten, die Fremdsprachen — eine ganze, fast unendliche Welt aus Papier, die es ihm erlaubte, Seberi geistig zu verlassen, bevor er es körperlich konnte.\n\nNach dem brillanten Äquivalent zum Abitur blieben höhere Studien dennoch seinem Stand unzugänglich. André arbeitet in Porto Alegre, entdeckt damit ein wenig Freiheit und ein wenig von sich selbst, und verlässt dann nach und nach Brasilien Richtung Europa und Welt. Vielleicht kann man weiter weg mehr von sich finden.\nEr lernt Englisch in Irland, erhält die litauische Staatsangehörigkeit über familiäre Abstammung und entwickelt eine bemerkenswerte Beherrschung von Sprachen: Portugiesisch, Spanisch, Polnisch, Französisch, Deutsch und noch mehrere weitere. Meistens allein.\n\nSein Verhältnis zu den Sprachen ist ebenso eine Frage akademischer Leistung wie einer Form existenzieller Verschiebung: die Sprache zu wechseln wird auch ein Mittel, die Verlegenheit zu verschieben, die Langeweile zu täuschen, Grenzen zu überschreiten und den Blick auf sich selbst zu verbessern.\n\nDie folgenden Jahre gleichen lange einer prekären Durchquerung des heutigen Europas: Entwurzelung, Pandemie, ständige Rekonstruktion.\n\nDennoch bewahrt André eine fast asketische Disziplin: Sport, ständige intellektuelle Arbeit, Ernährungskontrolle, nie Alkohol und praktisch keine Drogen. Sein Körper scheint wie ein Territorium behandelt zu werden, das um jeden Preis aufrecht gehalten werden muss.\n\nDie Begegnung mit Sébastien Moreu verändert diesen Weg, ohne jedoch die Wunden auszulöschen… zumindest versucht sie, sie zu mildern. Gemeinsam entwickeln sie I Love You Moneypenis, ein Projekt, das Bild, Begehren, Autobiografie und Performance verbindet. Ihre Heirat, am 19. Oktober 2024 in Saint-Tropez gefeiert, stabilisiert das Chaos nicht: sie verleiht ihm einfach eine lebbare und sichtbare Form, eine Atempause.\n\nParallel dazu nimmt André sein Studium an der Sorbonne Nouvelle in Sprachwissenschaften wieder auf, wo seine Ergebnisse rasch Aufmerksamkeit erregen, insbesondere im Chinesischen. Er absolviert außerdem ein viel beachtetes Praktikum am Cours Florent. Der Schüchterne offenbart sich sich selbst, entdeckt die befreiende Kraft des Ausdrucks von Emotionen, den er sich erlaubt, weil sie von anderen geschrieben sind. Sommer 2025 reist er zu einem universitären Aufenthalt nach Taiwan; dieses Jahr wird es Shanghai sein.\n\nLeidenschaftlich an Astrologie und alten Spiritualitäten interessiert, in eine tiefe therapeutische Arbeit über seine Erfahrung engagiert, bleibt André dennoch schwer zusammenzufassen. Alles an ihm scheint darauf ausgerichtet, Wunden in innere Architektur zu verwandeln.\n\nDoch in den Augen von Sébastien Moreu liegt das Ergreifendste anderswo: das Ergreifendste ist, André bei der Betrachtung einer Wildblume zuzusehen. Denn dann fällt die ganze Mechanik in sich zusammen — die Meisterschaft, die Verteidigung, die Kontrolle — und plötzlich taucht etwas extrem Seltenes wieder auf: eine unversehrte Zartheit, die alles andere überlebt hat.\n\nZum Abschluss würde er wahrscheinlich Jorge Amado zitieren: „Die Welt ist nur die Emotion wert, die sie uns schenkt.\" oder, heute eher noch, Gisèle Pelicot: „Die Scham muss die Seite wechseln.\"",prst:"Presse",prss:"In Vorbereitung",prsc:"contact@moneypenis.com",plt:"Rezensionen",pls:"In Vorbereitung",nt:"Kontakt",ns:"Senden",n1:"Name",n2:"Email",n3:"Nachricht",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Ich erkläre hiermit, dass ich 18 Jahre oder älter bin und nach den Gesetzen meines Wohnsitzlandes volljährig bin.",ck2:"Ich erkenne an, dass diese Website explizite künstlerische Fotografien präsentiert, einschließlich des Verkaufs von Originaldrucken, und willige wissentlich in den Zugang ein.",nat:"Anmerkung der Autoren",naf:"Die Autoren möchten darauf hinweisen, dass die unterhaltsame Leichtigkeit von Titel und Logo, ebenso wie die expliziten Bilder und Texte der Werke, den Eindruck einer Unbekümmertheit gegenüber einem dennoch ernsten Thema vermitteln können. Sie erinnern daran, dass dies nicht der Fall ist und dass diese Erzählung aus ihren persönlichen Erfahrungen entstanden ist. Beide haben aus unterschiedlichen Gründen und zu unterschiedlichen Zeiten alle Aspekte erlebt.\n\nIhr gemeinsames künstlerisches Projekt hat die Absicht, jeden davon abzuhalten, sich auf eine Tätigkeit einzulassen, indem sie davor warnen, dass diese auch heute noch: mehr Türen schließt als öffnet und diejenigen, die sie ausüben, und ihre Angehörigen einer Vielzahl von Risiken aussetzt. Insbesondere Infektionen und Krankheiten, vor allem Geschlechtskrankheiten, Drogen- und Alkoholabhängigkeiten… Diese Tätigkeit, in welcher Form auch immer, setzt der Prekarität, der Abhängigkeit, der sozialen Ablehnung, der Gewalt, der Erpressung, dem Missbrauch, dem Zwang und der Schutzgelderpressung aus.\n\nFür die zu wenigen, die es schaffen, sich zu befreien, erfordert sie stets eine sehr langfristige psychologische Begleitung, da unsere Gesellschaften ihnen kaum andere Auswege lassen als Viktimisierung oder Scham, oder sogar beides zugleich.\n\nDie Autoren rufen daher zum Respekt und zum Schutz der Sexarbeiter:innen auf. Ohne die Notwendigkeit einer Bestrafung der Freier in Frage zu stellen, rufen sie ebenso zu einer würdigen Behandlung der emotionalen Not, ja Verzweiflung auf, die diese dazu bringt, gegen das Gesetz zu verstoßen. Die Autoren erhoffen sich, sowohl von der Öffentlichkeit als auch von den Institutionen, eine größere Unterstützung für Vereine, die beide Seiten begleiten können.\n\nEs geht hier keineswegs darum, blindlings die Tabus über sämtliche Praktiken aufzuheben, noch einen Skandal zu schüren… Sondern darum, an die Dringlichkeit zu erinnern, sich von den gesellschaftlichen Verboten zu lösen, die eine öffentliche Debatte versteinern lassen, die jedoch besonnen sein sollte und nicht mit einem moralischen Gewand bedeckt, das dort nichts zu suchen hat und jede Befreiung der Sprache verhindert. Sie haben keinen Zweifel: wenn es einen Schleier zu lüften gilt, dann diesen.\n\nUnd mit Debatte meinen sie die erste von allen, die innerhalb der Familie geführt werden sollte.\n\nUnd außerdem… ist sie schön… auch… ein Schwanz !\n\n(Das vom Künstlerpaar ausgewählte Modell ist kein Sexarbeiter. Da es sein Leben mit einem der Autoren teilt, hat es darauf bestanden, anonym zu bleiben.)\n\nWenn die Autoren sich diesem Thema gewidmet haben, das sie berührt, dann weil es ihnen schien, dass in unserer Zeit der formatierten Kommunikation, der Netzwerk-Zensur und der Renaissance der Prüderie es notwendiger denn je war, eine kreative und künstlerische Perspektive einzubringen, die seltsamerweise abwesend bleibt. Sie wollten diesem Ganzen sowohl die Leichtigkeit verleihen, die beim Evozieren von Liebe und Lust überwiegen sollte, als auch das Gewicht der gelebten Realitäten: mit Mut und ohne Pathos.\n\nSie haben nicht die Absicht, sich an die Stelle individueller Entscheidungen zu setzen, ebenso wenig wie an die Stelle der in souveränen Ländern geltenden Gesetze oder der Werte, denen jede:r frei steht beizutreten.\n\nIn Frankreich — was nicht in allen, selbst demokratischen Ländern der Fall ist — haben sich die Antworten der Polizei und der Justiz, im rechtlichen Rahmen eines wesentlichen Kampfes gegen den Menschenhandel, im Laufe der Jahre in dem Sinne verbessert, den man von einem modernen Land erwartet. Doch sie tun dies im allgemeinen Rahmen und bringen keine Verbesserung — vielleicht ist es nicht ihre Aufgabe — der individuellen Situationen, die sowohl Sexarbeiter:innen als auch ihre Kund:innen erleben. Vereine erfüllen still ihre Aufgaben trotz der Knappheit ihrer Mittel.\n\nSowohl für die zuständigen Verwaltungen als auch für die Vereine existieren Webseiten. Einige sehr nützliche sind ausgewählt und auf einer regelmäßig aktualisierten Liste auf unserer eigenen Website verfügbar: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Einzeldrucke",siCh:"Format wählen",siInq:"Anfragen",siNote:"Preise in Euro, inkl. französischer MwSt. Verpackung, Versand und Versicherung zum Selbstkostenpreis.",siCont:"Zum Erwerb bitte an smoreu@mac.com schreiben — oder über das Kontaktformular",siPro:"Buchhändler, Kunsthändler und Galerien — bitte kontaktieren Sie uns für Fachhandelskonditionen, Ausstellungen und Konsignation.",siRgpd:"Die übermittelten Daten werden nur für Ihre Anfrage und Informationen zu den Projekten der Künstler verwendet",siPick:"Klicken Sie auf einen Druck, um ihn anzusehen und zu erwerben",req:"Eine Anfrage stellen",reqAge:"Dieser Bereich ist nur für Erwachsene zugänglich.",shPfD:"30 × 40 cm · 50 nummerierte und signierte Exemplare",shGfD:"50 × 70 cm · 15 nummerierte und signierte Exemplare",shUn:"Einzeldrucke",shUnD:"Jeder Druck im Klein- oder Großformat verfügbar, signiert S.M. & A.V.",fFirstName:"Vorname",fPhone:"Telefon",fCountry:"Land",fLangPref:"Antwortsprache",fPref:"Kontaktpräferenz",fMatrix:"Gegenstand der Anfrage",fMatrixHint:"Bitte die entsprechenden Kästchen ankreuzen",fMsgPh:"Erläuterungen (max. 500 Zeichen)",fConsent:"Ich akzeptiere die obigen Bedingungen und die Übermittlung meiner Daten an Sébastien Moreu und André Vaszkievicz.",fSent:"Anfrage gesendet. Sie erhalten eine Antwort an die angegebene Adresse.",fError:"Sendefehler. Sie können direkt an smoreu@mac.com schreiben.",rqInfo:"Information",rqBuy:"Kauf",rqDeposit:"Depot",rqPro:"Fachhandel",rqColl:"Sammler",rqOther:"Sonstige",continueShop:"Weiter stöbern",nax:"Vollständig lesen ▾",nac:"Einklappen ▴",aiWarn:"ACHTUNG: DIESE ÜBERSETZUNG WURDE VON KI ERZEUGT UND KANN FEHLER ODER MISSVERSTÄNDNISSE ENTHALTEN"},
  IT:{techs:["Poesia · Croce dorata","Lettera manoscritta · Inchiostro blu marino · Scultura","Fotografia a colori · Testo giallo","Stampa argentica · Inchiostro verde manoscritto","Foto a colori · Testo rosso · Cravatta Hermès","Fotografia a colori · Jeans aperto · Natura","Foto tinta ciano · Lettera manoscritta arancione","Testo rosso · B/N · Avviso multilingue","Lettera manoscritta · Banconote da 50€ · Mani","Testo rosso · B/N · Manifesto","Lettera manoscritta · Sfondo floreale · Inchiostro blu marino"],aw:"Contenuto Esplicito",am:"Opere fotografiche per adulti.",ap:"+ 18 — Versione completa",am2:"− 18 — Versione pubblica",nav:["Portfolio","Film","Cofanetto","In Situ","Shop","Bio & Signature","VS00","Contatto"],hl:"Edizione Limitata",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Parigi, 2024",hd:"Una Fiaba Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Scoprire",pt:"I Love You Moneypenis",ps:"11 stampe all'argento · Traphot · Firmate",mg:"Clic per ingrandire",tech_info:"2024 · 30 × 40 cm (50 es.) · 50 × 70 cm (15 es.) · Stampa al gelatino-argento · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 es.) · 50 × 70 cm (15 es.) · Stampa su carta Arches · Numerata e firmata a mano dai due artisti",op:"Apertura",tx:"Testo",pr:"Opera protetta",ct:"Il Cofanetto",cs:"Portfolio completo · 11 stampe · Guanti",zt:"In Situ",zs:"Le opere in situazione",vt:"Film",vs:"Contenuto per adulti",st:"Acquisire",pft:"Piccolo Formato 30×40",pfc:"50 portfolio 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolio 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmate · Numerate · Guanti",pd:"Traphot",p1:"Portfolio PF",p2:"Stampa PF",p3:"Portfolio GF",p4:"Stampa GF",sh:"Spedizione",sb:"DHL · Francia 45€ · Europa 95€ · Internazionale 180€",py:"Pagamento",pb:"Bonifico · Carta · PayPal",co:"Condizioni",cb:"Certificato · Reso 14 giorni",rv:"Prenotare",by:"Acquisire",bt:"Bio & Firme",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — che ricorda, come una rassegnazione stilistica, che tutti l'hanno sempre chiamato Sébastien — è ciò che accade quando la disciplina e la volontà si rifiutano di addomesticare l'ossessione.\n\nNato il 25 dicembre 1972 a Saint-Tropez, cresce all'ombra della precisione e del mito familiare. A dieci anni gli consegnano un arsenale completo di pittura: una prima arma carica, inizio di una collezione barocca di guerre intime.\n\nDagli anni '90, nell'orbita del gallerista Enrico Navarra, costruisce una carriera che rifiuta le etichette. Partecipa alla collezione Made By…, dove collabora strettamente con il fotografo Simon Schwyzer. La morte brutale del fotografo svizzero non ferma nulla — al contrario, tutto si intensifica.\n\nNel 2017 fonda le Éditions Sébastien Moreu. Più tardi, con André Vaszkievicz, l'intimo cambia di nuovo forma: I Love You Moneypenis non è decorativo, è una collisione di testo, immagine, desiderio, denaro, corpo. Il matrimonio il 19 ottobre 2024 a Saint-Tropez non stabilizza nulla: rende ufficiale ciò che già traboccava.\n\nSe esiste un principio unificatore è questo: Sébastien Moreu non risolve le proprie contraddizioni, tanto venera quelle altrui. Le sue, le organizza — e vive all'interno dell'esposizione.",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz è nato il 28 novembre 1990 in un Brasile che assomiglia poco alle cartoline tropicali. Seberi, piccola città rurale del sud del paese, appartiene a quei territori plasmati dalle migrazioni europee del XX secolo: comunità polacche qui, ma poco più in là tedesche, italiane, lituane… dove le lingue, le tradizioni, le danze e il cattolicesimo sopravvivono talvolta con più ostinazione che nei loro paesi d'origine.\n\nFiglio di discendenti polacchi nati in Brasile, André cresce in un ambiente strutturato dal lavoro, dalla religione, dai silenzi e dai codici virili. Ultimo figlio di una fratria di otto (con una sola sorella), nato quasi dieci anni dopo il più giovane dei suoi maggiori, arriva in una famiglia già segnata dallo sforzo, dai vincoli e dal peso delle eredità culturali.\n\nUn imprevisto amato. Amato ma non atteso. Sarà ben solo in quella famiglia numerosa.\n\nMolto presto comprende due cose: si sente profondamente al proprio posto a scuola, e certi desideri non hanno posto nel mondo in cui cresce.\n\nL'adolescenza gay non è facile per nessuno, in nessun luogo… ma in quel contesto rurale e conservatore non se ne parla nemmeno. La parola non esiste e il desiderio si vive più come una tensione interiore che come un'identità possibile.\n\nAndré impara dunque a osservare e a tacere, a controllare i propri gesti, a biasimare il proprio corpo e le proprie emozioni.\nÈ troppo sensibile per parlare e troppo silenzioso per essere sentimentale. Troppo disciplinato per non essere ferito. Troppo desiderato per amare semplicemente. Troppo tradito per confidarlo.\n\nMa c'erano i libri, i dizionari, le carte geografiche, le lingue straniere — tutto un mondo di carta quasi infinito che già gli permetteva di lasciare Seberi mentalmente prima di poterlo fare fisicamente.\n\nDopo l'equivalente del diploma di maturità, brillante, gli studi superiori sarebbero tuttavia rimasti inaccessibili alla sua condizione. André lavora a Porto Alegre, scopre un po' di libertà e un po' di sé con essa, poi lascia progressivamente il Brasile per l'Europa e il Mondo. Forse più lontano si può trovare più di sé.\nImpara l'inglese in Irlanda, ottiene la nazionalità lituana per discendenza familiare e sviluppa una notevole padronanza delle lingue: portoghese, spagnolo, polacco, francese, tedesco e diverse altre ancora. La maggior parte del tempo da solo.\n\nIl suo rapporto con le lingue dipende tanto dalla performance accademica quanto da una forma di spostamento esistenziale: cambiare lingua diventa anche un modo di spostare l'imbarazzo, ingannare la noia, varcare le frontiere e migliorare lo sguardo che porta su se stesso.\n\nGli anni seguenti assomigliano a lungo a una traversata precaria dell'Europa contemporanea: sradicamento, pandemia, ricostruzione permanente.\n\nEppure André conserva una disciplina quasi ascetica: sport, lavoro intellettuale costante, controllo alimentare, mai alcol e praticamente nessuna droga. Il suo corpo sembra trattato come un territorio che bisogna tenere in piedi a tutti i costi.\n\nL'incontro con Sébastien Moreu trasforma questa traiettoria ma non ne cancella le ferite… o almeno tenta di addolcirle. Insieme sviluppano I Love You Moneypenis, progetto che mescola immagine, desiderio, autobiografia e performance. Il loro matrimonio, celebrato a Saint-Tropez il 19 ottobre 2024, non stabilizza il caos: gli dà semplicemente una forma vivibile e visibile, una tregua.\n\nIn parallelo, André riprende gli studi alla Sorbonne Nouvelle in scienze del linguaggio, dove i suoi risultati attirano rapidamente l'attenzione, in particolare in cinese. Effettua anche uno stage notato al Cours Florent. Il timido si rivela a se stesso, scopre la forza liberatoria dell'espressione delle emozioni che si permette poiché scritte da altri. Estate 2025, parte in immersione universitaria a Taiwan; quest'anno sarà Shanghai.\n\nAppassionato di astrologia e spiritualità antiche, impegnato in un profondo lavoro terapeutico sul proprio vissuto, André resta tuttavia difficile da riassumere. Tutto in lui sembra organizzato per trasformare le ferite in architettura interiore.\n\nMa agli occhi di Sébastien Moreu, ciò che più commuove è altrove: ciò che più commuove è guardare André osservare un fiore selvatico. Perché allora tutta la meccanica crolla — la padronanza, la difesa, il controllo — e riappare improvvisamente qualcosa di estremamente raro: una dolcezza intatta sopravvissuta a tutto il resto.\n\nPer concludere, citerebbe probabilmente Jorge Amado: « Il mondo non vale che per l'emozione che ci dona. » o, più certamente oggi, Gisèle Pelicot: « La vergogna deve cambiare di campo. »",prst:"Stampa",prss:"In preparazione",prsc:"contact@moneypenis.com",plt:"Recensioni",pls:"In preparazione",nt:"Contatto",ns:"Inviare",n1:"Nome",n2:"Email",n3:"Messaggio",lg:"© Sébastien Moreu · © André Vaszkievicz · Parigi 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Dichiaro sotto la mia responsabilità di avere 18 anni o più e di essere maggiorenne secondo la legislazione del mio paese di residenza.",ck2:"Riconosco che questo sito presenta opere fotografiche artistiche di carattere esplicito, inclusa la vendita di stampe originali, e accetto di accedervi consapevolmente.",nat:"Nota degli autori",naf:"Gli Autori desiderano avvertire che la leggerezza divertente del titolo e del logo possono, come i visivi e i testi espliciti delle opere, dare un'impressione di disinvoltura di fronte a un soggetto pur tuttavia grave. Ricordano che non è così e che questo racconto è nato dalle loro esperienze personali. Entrambi avendo, per ragioni e in epoche diverse, vissuto tutti gli aspetti.\n\nIl loro progetto artistico comune ha l'intenzione di dissuadere chiunque dall'impegnarsi in un'attività avvertendo che ancora oggi: chiude più porte di quante ne apra ed espone a numerosi rischi coloro che la praticano e i loro cari. In particolare infezioni e malattie, soprattutto le MST, dipendenze dall'uso di droghe e alcol… Questa attività, in qualsiasi forma, espone alla precarietà, alla dipendenza, al rifiuto sociale, alla violenza, al ricatto, agli abusi, alla coercizione e agli estorsioni.\n\nPer coloro, troppo pochi, che riescono a uscirne, richiede sempre un accompagnamento psicologico a lunghissimo termine, tanto le nostre società non lasciano loro altre uscite che la vittimizzazione o la vergogna, o entrambe insieme.\n\nGli autori invitano quindi al rispetto e alla protezione dei lavoratori del sesso. Senza per questo discutere la necessità di una penalizzazione dei clienti, invitano allo stesso modo a un trattamento dignitoso della miseria affettiva, o persino dell'angoscia, che li conduce a contravvenire alla Legge. Gli autori sperano, da parte del grande pubblico come delle istituzioni, in un maggiore sostegno alle associazioni che possono accompagnare gli uni come gli altri.\n\nNon si tratta qui di sollevare ciecamente i tabù su tutte le pratiche, né di fare scandalo… Ma di ricordare l'urgenza di liberarsi dei divieti sociali che irrigidiscono un dibattito pubblico che dovrebbe invece essere sereno, e non coperto da un abito morale che non ha nulla da fare lì e impedisce ogni liberazione della parola. Non hanno alcun dubbio che, se c'è un velo da bandire, è questo.\n\nE per dibattito, intendono evocare il primo di tutti, quello che dovrebbe tenersi all'interno della famiglia.\n\nE poi è bello… anche… un cazzo !\n\n(Il modello selezionato dagli artisti non è un lavoratore del sesso. Condividendo la sua vita con uno degli autori, ha tenuto a rimanere anonimo.)\n\nSe gli Autori hanno affrontato questo tema che li riguarda, è perché è sembrato loro che nella nostra epoca di comunicazione formattata, di censura delle reti e di rinascita della pudibonderia, fosse più che mai necessario apportare un punto di vista creativo e artistico che resta stranamente assente. Hanno voluto dare a questo insieme sia la leggerezza che dovrebbe prevalere quando si evocano l'amore e il piacere, sia il peso imposto dalle realtà vissute: con coraggio e senza pathos.\n\nNon intendono sostituirsi alle scelte individuali, né alle leggi vigenti in paesi sovrani né ai valori a cui ciascuno è libero di aderire.\n\nIn Francia — non è il caso in tutti i paesi, anche democratici — le risposte fornite dalla polizia e dalla giustizia, nel quadro legale di una lotta essenziale contro la tratta di esseri umani, sono migliorate negli anni nel senso di ciò che ci si aspetta da un paese moderno. Ma lo fanno nel quadro generale e non apportano, forse non è il loro ruolo, miglioramenti alle situazioni individuali vissute sia dai lavoratori del sesso che dai loro clienti. Associazioni svolgono discretamente le loro missioni nonostante la scarsità dei loro mezzi.\n\nSia per le amministrazioni competenti che per le associazioni, esistono siti Internet. Alcuni molto utili sono selezionati e disponibili su una lista regolarmente aggiornata sul nostro stesso sito web: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Stampe singole",siCh:"Scegliere formato",siInq:"Richiedere",siNote:"Prezzi in euro, IVA francese inclusa. Imballaggio, spedizione e assicurazione fatturati al costo reale.",siCont:"Per acquistare, contattare smoreu@mac.com — o tramite il modulo di contatto",siPro:"Librerie, mercanti d'arte e gallerie — contattateci per condizioni professionali, esposizioni e depositi.",siRgpd:"I dati forniti saranno usati solo per la sua richiesta e per informazioni sui progetti degli artisti",siPick:"Clicca su una stampa per vederla e acquistarla",req:"Inviare una richiesta",reqAge:"Questa sezione è riservata ai maggiorenni.",shPfD:"30 × 40 cm · 50 esemplari numerati e firmati",shGfD:"50 × 70 cm · 15 esemplari numerati e firmati",shUn:"Stampe singole",shUnD:"Ogni stampa disponibile in Piccolo o Grande Formato, firmata S.M. & A.V.",fFirstName:"Nome",fPhone:"Telefono",fCountry:"Paese",fLangPref:"Lingua di risposta",fPref:"Preferenza di contatto",fMatrix:"Oggetto della richiesta",fMatrixHint:"Spuntare le caselle pertinenti",fMsgPh:"Dettagli (max 500 caratteri)",fConsent:"Accetto le condizioni sopra indicate e la trasmissione dei miei dati a Sébastien Moreu e André Vaszkievicz.",fSent:"Richiesta inviata. Riceverà una risposta all'indirizzo indicato.",fError:"Errore di invio. Può scrivere direttamente a smoreu@mac.com.",rqInfo:"Informazione",rqBuy:"Acquisto",rqDeposit:"Deposito",rqPro:"Professionista",rqColl:"Collezionista",rqOther:"Altro",continueShop:"Continuare a sfogliare",nax:"Leggi tutto ▾",nac:"Riduci ▴",aiWarn:"ATTENZIONE: QUESTA TRADUZIONE È GENERATA DALL'IA E PUÒ CONTENERE ERRORI O CONTROSENSI"},
  "中":{techs:["诗 · 金色十字","手写信 · 深蓝墨水 · 雕塑","彩色摄影 · 黄色文字","银盐照片 · 手写绿色墨水","彩色照片 · 红色文字 · 爱马仕领带","彩色摄影 · 敞开的牛仔裤 · 自然","青色调照片 · 橙色手写信","红色文字 · 黑白 · 多语言警告","手写信 · 50欧元钞票 · 手","红色文字 · 黑白 · 宣言","手写信 · 花卉背景 · 深蓝墨水"],aw:"限制级内容",am:"成人摄影艺术作品。",ap:"+ 18岁 — 完整版",am2:"− 18岁 — 公开版",nav:["作品集","影片","套装","In Situ","商店","传记 & 签名","VS00","联系"],hl:"限量版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"巴黎，2024",hd:"同志流行色情童话。\nCollection La Grande Librairie de Saint-Tropez®",hc:"探索",pt:"I Love You Moneypenis",ps:"11幅银盐照片 · Traphot · 签名编号",mg:"点击放大",tech_info:"2024 · 30 × 40 厘米（50份）· 50 × 70 厘米（15份）· 银盐照片 · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm（50版）· 50 × 70 cm（15版）· 印于 Arches 纸 · 由两位艺术家亲笔编号与签名",op:"序",tx:"文字",pr:"受保护作品",ct:"套装",cs:"完整作品集 · 11幅 · 手套",zt:"In Situ",zs:"作品展示",vt:"影片",vs:"成人内容",st:"购买",pft:"小格式 30×40",pfc:"50份 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大格式 50×70",gfc:"15份 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"签名 · 编号 · 手套",pd:"Traphot",p1:"小格式套装",p2:"小格式单幅",p3:"大格式套装",p4:"大格式单幅",sh:"运输",sb:"DHL · 法国45€ · 欧洲95€ · 国际180€",py:"支付",pb:"转账 · 信用卡 · PayPal",co:"条款",cb:"证书 · 14天退货",rv:"预订",by:"购买",bt:"传记 & 签名",sn:"Sébastien Moreu",sb2:"让·塞巴斯蒂安·莫罗（Jean Sébastien Moreu）——他以一种风格化的认命姿态提醒人们：大家一直叫他塞巴斯蒂安——是纪律与意志拒绝驯服执念时所诞生的产物。\n\n1972年12月25日生于圣特罗佩，在精确与家族神话的阴影中长大。十岁时获赠一整套绘画工具：第一件上膛的武器，巴洛克式私人战争收藏的开端。\n\n九十年代以来，他在画廊主恩里科·纳瓦拉的轨道上构建了一种拒绝标签的职业生涯。他参与 Made By… 丛书的策划，与摄影师西蒙·施维泽密切合作。瑞士摄影师的猝然离世并未让一切停止——恰恰相反，一切都被加剧。\n\n2017年创立 Éditions Sébastien Moreu。后来与安德烈·瓦兹基耶维奇相遇，亲密关系再度变形：《I Love You Moneypenis》不是装饰性的作品，而是文本、图像、欲望、金钱与身体的碰撞。2024年10月19日在圣特罗佩的婚礼并未让一切稳定，而是将早已溢出的现实正式化。\n\n若存在一个统一原则，那便是：塞巴斯蒂安·莫罗从不解决自己的矛盾，因他过于崇敬他人的矛盾。他将自己的矛盾加以整理——然后住进展览的内部。",vn:"André Vaszkievicz",vb:"安德烈·弗朗西斯科·瓦兹基耶维奇（André Francisco Vaszkievicz）于 1990 年 11 月 28 日出生在一个与热带明信片相去甚远的巴西。塞贝里（Seberi），南部一座小小的乡村小镇，属于那些被二十世纪欧洲移民塑造的地区：这里是波兰社区，稍远一些是德国、意大利、立陶宛人……在那里，语言、传统、舞蹈与天主教信仰有时比在它们的起源国还要顽固地存活下来。\n\n作为出生在巴西的波兰后裔之子，安德烈在劳作、宗教、沉默与男性规范所构建的环境中长大。他是八个孩子中最小的一个（其中只有一个姐妹），出生在最年幼的兄长之后将近十年。他降临到的，是一个早已被辛劳、约束与文化遗产的重量所标记的家庭。\n\n一个被爱的意外。被爱，但并不被期待。他将在这个人口众多的家庭里独自一人。\n\n他很早便明白两件事：他在学校里深感得其所在；而某些欲望在他成长的世界里没有容身之处。\n\n同性恋的青春期对任何人来说、在任何地方都不容易……但在那个乡村而保守的环境里，连提起都谈不上。这个词不存在，欲望更多是作为一种内在的张力被体验，而非一种可能的身份。\n\n于是安德烈学会观察、学会沉默，学会控制自己的姿势，学会指责自己的身体与自己的情感。\n他太敏感，无法言说；太沉默，无法多情。太自律，以至无法不受伤。太被欲望，以至无法单纯地去爱。太被背叛，以至无法吐露。\n\n但还有书籍、字典、地图与外语——一个近乎无垠的纸上世界，让他在身体尚未离开塞贝里之前，便已在精神上离开了它。\n\n在出色地通过相当于法国高中毕业会考的考试之后，高等教育却仍因他的处境而遥不可及。安德烈在阿雷格里港（Porto Alegre）工作，借此发现一点自由，也发现了一点自己，随后渐渐离开巴西，前往欧洲与世界。也许走得更远，才能找到更多的自己。\n他在爱尔兰学英语，凭借家族血统获得了立陶宛国籍，并发展出对多种语言的卓越掌握：葡萄牙语、西班牙语、波兰语、法语、德语以及其他数门。大多数时间里都是独自一人。\n\n他与语言的关系，既关乎学术上的表现，也关乎一种存在论意义上的位移：换一种语言，也成了一种位移羞涩、欺骗倦怠、跨越边界、改善自我审视目光的方式。\n\n接下来的几年长久地像是对当代欧洲的一次危险穿越：连根拔起、疫情、不断的重建。\n\n然而安德烈仍保持着近乎苦行的自律：运动、持续的智识劳作、饮食控制、从不喝酒，几乎从不沾染任何毒品。他的身体仿佛被当作一片必须不惜一切代价让其挺立的领土。\n\n与塞巴斯蒂安·莫罗（Sébastien Moreu）的相遇改变了这条轨迹，但并未抹去它所留下的伤口……至少试着去抚慰它们。两人共同发展出《I Love You Moneypenis》——一个糅合图像、欲望、自传与表演的项目。2024 年 10 月 19 日在圣特罗佩举行的婚礼并未稳定混沌：只是为它赋予了一种可以延续、可以被看见的形式，一种喘息。\n\n与此同时，安德烈在巴黎新索邦大学（Sorbonne Nouvelle）重拾学业，攻读语言学，成绩很快引人注目，尤其是在中文方面。他还在 Cours Florent 戏剧学校完成了一段令人瞩目的实习。这位羞涩之人向自己揭示自己，发现表达情感的解放力量——他允许自己去表达，因为那些情感是由他人书写的。2025 年夏天，他前往台湾进行大学交流；今年将会是上海。\n\n他热衷占星与古老的灵性学，并投身于围绕自身经历的深度心理治疗工作。然而，安德烈始终难以被归纳。他身上的一切，似乎都被组织起来，以便把伤口转化为内在的建筑。\n\n但在塞巴斯蒂安·莫罗眼中，最动人的并不在此——最动人的，是凝视安德烈在凝视一朵野花的那一刻。因为那时所有的机制都瓦解了——掌控、防御、自制——而某种极其稀有的东西骤然重现：一种完好如初、在其余一切之后仍幸存下来的温柔。\n\n最后，他大概会引用若热·亚马多（Jorge Amado）：「世界的价值，只在于它所赋予我们的情感。」或者，更可能在今天，是吉赛尔·佩利科（Gisèle Pelicot）：「羞耻应当易主。」",prst:"新闻",prss:"准备中",prsc:"contact@moneypenis.com",plt:"评论",pls:"准备中",nt:"联系",ns:"发送",n1:"姓名",n2:"邮箱",n3:"留言",lg:"© Sébastien Moreu · © André Vaszkievicz · 巴黎 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"本人郑重声明已满18周岁，并符合本人居住国法律规定的成年年龄。",ck2:"本人知悉本网站展示含露骨内容的艺术摄影作品，包括出售原版印刷品，并自愿访问。",nat:"作者寄语",naf:"作者们希望提醒：标题和标识所带的轻盈娱乐感，以及作品中露骨的视觉与文字，可能给人一种对严肃议题不以为然的印象。他们要强调事实并非如此——这部寓言诞生于他们各自的亲身经历。二人因不同的原因、在不同的时期，亲历过其中的所有面向。\n\n他们共同的艺术项目旨在劝阻任何人投身这项至今仍：关闭比开启更多大门、并将从业者及其亲人暴露于诸多风险之中的活动。尤其是感染与疾病（特别是性传播疾病）、对毒品和酒精的成瘾……无论以何种形式，这项活动都会使人陷入贫困、依附、社会排斥、暴力、勒索、虐待、胁迫与敲诈。\n\n对于极少数得以脱身者，由于社会只为他们留下\"受害者\"或\"羞耻者\"——甚至兼而有之——的出路，他们始终需要极为长期的心理陪伴。\n\n因此，作者呼吁尊重并保护性工作者。在不否认对客户进行刑事处罚之必要性的同时，他们同样呼吁以尊严对待将这些客户引向违法的情感困境乃至精神窘迫。作者期望，无论是公众还是机构，都能给予那些能陪伴双方的协会更多支持。\n\n这里绝非要盲目地打破所有禁忌，也绝非要制造丑闻……而是要提醒：迫切需要摆脱那些使公共讨论僵化的社会禁令——这场讨论本应平静，而非被披上一件本不该在场、阻止一切言说的道德外衣。他们毫不怀疑，如果有一层面纱需要被撕去，正是这一层。\n\n而所谓讨论，他们首先指的是那场最重要的：本应在家庭内部展开的对话。\n\n再说……鸡巴……也很美的！\n\n（艺术家所选的模特并非性工作者。因其与作者之一共同生活，他坚持匿名。）\n\n如果作者触及了这一令他们深切关切的议题，那是因为他们感到：在我们这个被格式化的传播、网络审查与拘谨复兴的时代，比任何时候都更需要一种创造性与艺术性的视角——而这一视角却奇异地缺席。他们希望同时赋予这一整体应有的轻盈——当我们谈论爱与愉悦时——以及现实所施加的重量：以勇气，不带悲情。\n\n他们无意取代个人的选择，也不取代主权国家现行的法律，更不取代每个人自由认同的价值观。\n\n在法国——这并非所有国家、甚至所有民主国家的情况——警察与司法机构在反对人口贩运这一根本斗争的法律框架下所给出的回应，多年来已逐步改善到符合现代国家所应有的水准。但这是在一般层面进行的，对性工作者及其客户所经历的个体处境并无实际改善——这或许本就不是它们的职责。一些协会在资源匮乏的情况下仍默默地履行着自己的使命。\n\n无论是相关行政机构还是协会，都存在相应的网站。其中部分非常有用的网站已被筛选，可在我们网站上定期更新的列表中查阅：www.moneypenis.com · www.moneypenis.com/prevention",siPl:"单幅作品",siCh:"选择尺寸",siInq:"咨询",siNote:"价格以欧元计，含法国增值税。包装、运输与保险按实际费用收取。",siCont:"购买请联系 smoreu@mac.com 或通过联系表单",siPro:"书店、艺术经销商和画廊 — 请联系我们了解专业条款、展览和寄售事宜。",siRgpd:"提供的信息将仅用于您的咨询和艺术家项目相关信息",siPick:"点击作品查看并购买",req:"提交申请",reqAge:"本版块仅限成年人访问。",shPfD:"30 × 40 厘米 · 50 份编号亲签",shGfD:"50 × 70 厘米 · 15 份编号亲签",shUn:"单幅作品",shUnD:"每幅作品提供小幅与大幅两种尺寸，由 S.M. & A.V. 亲笔签名。",fFirstName:"名字",fPhone:"电话",fCountry:"国家",fLangPref:"回复语言",fPref:"联系方式偏好",fMatrix:"申请事项",fMatrixHint:"请勾选对应项",fMsgPh:"具体说明（最多 500 字符）",fConsent:"本人同意以上条件，并同意将相关信息提交给 Sébastien Moreu 和 André Vaszkievicz。",fSent:"申请已发送，我们将回复至您提供的地址。",fError:"发送失败。您可直接致信 smoreu@mac.com。",rqInfo:"咨询",rqBuy:"购买",rqDeposit:"寄售",rqPro:"专业人士",rqColl:"收藏家",rqOther:"其他",continueShop:"继续浏览",nax:"阅读全文 ▾",nac:"收起 ▴",aiWarn:"注意：本翻译由人工智能生成，可能含有错误或误解"},
  "日":{techs:["詩 · 金の十字架","手書きの手紙 · 紺青のインク · 彫刻","カラー写真 · 黄色の文字","銀塩プリント · 手書きの緑のインク","カラー写真 · 赤い文字 · エルメスのネクタイ","カラー写真 · 開いたジーンズ · 自然","シアン調の写真 · オレンジの手書きの手紙","赤い文字 · モノクロ · 多言語の警告","手書きの手紙 · 50ユーロ札 · 手","赤い文字 · モノクロ · マニフェスト","手書きの手紙 · 花柄の背景 · 紺青のインク"],aw:"成人向",am:"成人向け作品。",ap:"+ 18歳 — 完全版",am2:"− 18歳 — 公開版",nav:["ポートフォリオ","映像","ボックス","In Situ","ショップ","略歴 & 署名","VS00","お問合せ"],hl:"限定版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"パリ、2024",hd:"大人のためのゲイ童話。\nCollection La Grande Librairie de Saint-Tropez®",hc:"発見する",pt:"I Love You Moneypenis",ps:"11点の銀塩プリント · Traphot · 署名番号",mg:"クリックで拡大",tech_info:"2024 · 30 × 40 cm（50点）· 50 × 70 cm（15点）· 銀塩プリント · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm（50部）· 50 × 70 cm（15部）· Arches 紙印刷 · 両アーティストによる手書きの番号と署名",op:"序",tx:"テキスト",pr:"保護作品",ct:"ボックスセット",cs:"完全ポートフォリオ · 11点 · 手袋",zt:"In Situ",zs:"作品の展示",vt:"映像",vs:"成人向け",st:"購入",pft:"小サイズ 30×40",pfc:"50部 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大サイズ 50×70",gfc:"15部 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"署名 · 番号 · 手袋",pd:"Traphot",p1:"小セット",p2:"小単品",p3:"大セット",p4:"大単品",sh:"輸送",sb:"DHL · フランス45€ · 欧州95€ · 国際180€",py:"支払い",pb:"振込 · カード · PayPal",co:"条件",cb:"証明書 · 14日返品",rv:"予約",by:"購入",bt:"略歴 & 署名",sn:"Sébastien Moreu",sb2:"ジャン・セバスチャン・モロー — まるで様式的な諦めのように、皆が常に彼を「セバスチャン」と呼んできたと告げる男 — は、規律と意志が執念を飼い慣らすことを拒んだときに生まれるものである。\n\n1972年12月25日、サン＝トロペにて誕生。歯科医の父が形作る口腔の精密さと、家族神話の影のもとで育つ。十歳のとき、絵画道具一式を与えられる。玩具ではない。装填された最初の武器であり、私的な戦争を求める男のバロック的コレクションの始まりである。\n\n90年代以降、ギャラリスト、エンリコ・ナヴァラの軌道上で、彼はあらゆるラベルを拒むキャリアを築く。Made By… コレクションの企画に参画し、スイス人写真家シモン・シュヴァイツァーと深く協働する。彼の急逝は何も停止させない — むしろすべてを加速させる。\n\n2017年、Éditions Sébastien Moreu を設立。のちにアンドレ・ヴァシュキェヴィッチと出会い、親密さは再び形を変える。《I Love You Moneypenis》は装飾的な作品ではなく、テクスト、イメージ、欲望、金銭、身体の衝突である。2024年10月19日、サン＝トロペでの婚姻は何も安定させない — 既に溢れ出ていたものを公式化するに過ぎない。\n\nもし統一原理があるならば、それはこうだ：セバスチャン・モローは自らの矛盾を解決しない。他者の矛盾をあまりに崇めているために。自らの矛盾は整理し — そして、展覧会の内側に住む。",vn:"André Vaszkievicz",vb:"アンドレ・フランシスコ・ヴァシュキェヴィッチ（André Francisco Vaszkievicz）は、1990 年 11 月 28 日、熱帯のポストカードとはほとんど似ても似つかぬブラジルに生まれた。この国の南部にある小さな田舎町セベリ（Seberi）は、20 世紀のヨーロッパからの移民によって形作られた地域に属している。ここではポーランド人共同体、少し離れた所ではドイツ人、イタリア人、リトアニア人……の共同体が並び、そこでは言語、伝統、舞踊、そしてカトリック信仰が、ときに本国以上の頑なさで生き残っている。\n\nブラジル生まれのポーランド系の家系に生まれたアンドレは、労働、宗教、沈黙、そして男性的規範によって組み立てられた環境の中で育つ。8 人きょうだいの末っ子（姉妹は一人だけ）であり、彼の上の兄たちの最も若い者からも 10 年近く遅れて生まれた彼は、すでに労苦、制約、文化的遺産の重みに刻まれた家族のもとへとやって来た。\n\n愛された予定外の子。愛されたが、待たれていたわけではなかった。彼はこの大家族の中で、まったく独りになるだろう。\n\nごく早い時期に、彼は二つのことを理解する。学校では自分が深く本来あるべき場所にいると感じること、そして、彼が育つ世界には、ある種の欲望が居場所を持たないということを。\n\n同性愛の青春期は、誰にとっても、どこにおいても容易ではない……だが、この田舎で保守的な文脈の中では、それはそもそも話題にすらならない。その言葉は存在せず、欲望は可能なアイデンティティとしてではなく、内なる緊張としてより強く生きられる。\n\nそうしてアンドレは、観察すること、そして黙ることを学ぶ。所作を制御し、自らの肉体と感情を責めることを学ぶ。\n語るには繊細すぎ、感傷的であるには寡黙すぎる。傷つかずにいるには規律正しすぎ、単純に愛するには欲望されすぎ、それを打ち明けるにはあまりに裏切られてきた。\n\nしかし、そこには本があった、辞書があった、地図があった、外国語があった——ほぼ無限の紙の世界が、肉体的にセベリを去ることができるよりも先に、彼にそこを精神的に去ることを可能にしていた。\n\nフランスのバカロレアに相当する卒業試験を優秀な成績で終えたものの、高等教育は彼の身分には依然として手の届かないものだった。アンドレはポルトアレグレ（Porto Alegre）で働き、それと共に少しの自由と、少しの自分自身を見出し、やがてブラジルを離れ、ヨーロッパへ、そして世界へと向かう。もしかすると、もっと遠くまで行けば、もっと多くの自分を見つけられるかもしれない。\nアイルランドで英語を学び、家族の血統によってリトアニア国籍を取得し、卓越した言語の習得を発展させる：ポルトガル語、スペイン語、ポーランド語、フランス語、ドイツ語、そしてさらにいくつもの言語を。多くの場合、独りで。\n\n言語との彼の関係は、学術的なパフォーマンスであると同時に、ある種の実存的な移動でもある——言語を変えることは、戸惑いを移し替え、退屈を欺き、国境を越え、自分自身に向ける視線を改善する手段にもなる。\n\n続く年月は、長きにわたって、現代ヨーロッパへの危うい横断のように見えた——根こぎ、パンデミック、絶え間ない再構築。\n\nそれでもアンドレは、ほとんど禁欲的なまでの規律を保つ：スポーツ、絶え間ない知的労働、食事の管理、決してアルコールを口にせず、麻薬の類はほぼ皆無。彼の肉体は、何としても立ち続けさせなければならない領土として扱われているかのようだ。\n\nセバスチャン・モロー（Sébastien Moreu）との出会いは、この軌道を変容させる。だが、その傷を消し去りはしない……少なくとも、それを和らげようと試みる。二人は共に、《I Love You Moneypenis》を発展させていく——イメージ、欲望、自伝、パフォーマンスを織り交ぜたプロジェクトである。2024 年 10 月 19 日にサン＝トロペで挙げられた二人の結婚は、混沌を安定させはしない——それに、生きていける、目に見える形を、束の間の猶予を与えるに過ぎない。\n\n並行して、アンドレはソルボンヌ・ヌーヴェル大学（Sorbonne Nouvelle）で言語学の学業を再開する。そこで彼の成績は、特に中国語において、たちまち注目を集める。さらにクール・フローラン（Cours Florent）で、目をひく研修を行う。臆病な彼は、自分自身に対して自分を露わにし、感情表現の解放的な力を見出す——それは他者の手で書かれているからこそ、彼が自分に許せる感情の表現なのだ。2025 年夏、彼は大学プログラムで台湾へと旅立つ。今年は上海となるだろう。\n\n占星術や古代の霊性に通じ、自身の経験をめぐる深い心理療法的作業に取り組んでいる一方で、アンドレは依然として要約することの難しい人物であり続ける。彼の中のあらゆるものが、傷を内的な建築へと変えるために組織されているかのようだ。\n\nだが、セバスチャン・モローの目には、最も心を打つのは別の場所にある。最も心を打つのは、アンドレが野の花を見つめているのを見つめることである。なぜなら、そのとき、すべての機構が崩れ落ちるからだ——支配、防御、制御——そして突如、極めて稀なものが再び現れる：他のすべてを生き延びてきた、傷つかぬままの優しさが。\n\n締めくくりに、彼はおそらくジョルジェ・アマード（Jorge Amado）を引くだろう——「世界は、それが我々に与える感動の分だけしか価値を持たない。」あるいは、今日ならむしろ確実に、ジゼル・ペリコ（Gisèle Pelicot）を——「恥は陣営を変えねばならない。」",prst:"プレス",prss:"準備中",prsc:"contact@moneypenis.com",plt:"レビュー",pls:"準備中",nt:"お問合せ",ns:"送信",n1:"名前",n2:"メール",n3:"メッセージ",lg:"© Sébastien Moreu · © André Vaszkievicz · パリ 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"私は18歳以上であり、居住国の法律に基づく成年年齢に達していることを宣言します。",ck2:"本サイトが露骨な内容を含む芸術的写真作品を掲載し、オリジナルプリントの販売を行うことを認識した上で、自らの意志でアクセスすることに同意します。",nat:"作者ノート",naf:"作者たちは次のことを伝えておきたい。タイトルとロゴが帯びる娯楽的な軽さ、そして作品の露骨な視覚と言葉は、本来重い主題に対して軽薄な印象を与えかねない。だが実際はまったく違うのであり、この物語は二人の個人的な経験から生まれたものである。二人とも、理由も時期も異なるが、その全側面を生き抜いてきた。\n\n彼らの共同芸術プロジェクトの意図は、今なおこの活動が：開く扉より閉ざす扉のほうが多く、従事する者とその身近な人々を数多のリスクにさらすという事実を伝え、誰一人として安易にそこに足を踏み入れないよう促すことにある。とりわけ感染症や病気（特に性感染症）、薬物・アルコール依存……。この活動はいかなる形であれ、困窮、依存、社会的排除、暴力、脅迫、虐待、強制、ゆすりへとさらす。\n\nそこから抜け出せた、あまりに数少ない者にとっても、極めて長期的な心理的支援が必要となる。なぜなら、我々の社会は彼らに「犠牲者」か「恥」、あるいはその両方以外の出口をほぼ残さないからである。\n\nゆえに作者たちは、セックスワーカーへの尊重と保護を呼びかける。客の処罰の必要性を否定するわけではないが、同様に、客たちを違法行為へと駆り立てる情緒的悲惨、ときに苦悩に対する尊厳ある扱いをも呼びかける。作者たちは、一般市民にも諸機関にも、双方に伴走できる団体への、より大きな支援を望んでいる。\n\nここではすべての行為に関するタブーを盲目的に解こうとしているのでも、スキャンダルを起こそうとしているのでもない……。むしろ、公共の議論を硬直化させる社会的禁忌から脱する緊急性を訴えているのである — 本来その議論は穏やかであるべきで、場違いな道徳の衣をまとうべきではなく、その衣はあらゆる発話の解放を妨げているからだ。彼らは確信している：もし剥がすべきヴェールがあるとすれば、それはこのヴェールだ、と。\n\nそして議論とは、彼らの言葉で言えば、何よりもまず家庭の中で行われるべき、最も根源的な議論を指している。\n\nそれに……チンコは……美しい！ それもまた、ひとつの事実だ。\n\n（アーティストたちが選んだモデルはセックスワーカーではない。作者の一人と人生を共にしているため、匿名であることを望んだ。）\n\n作者たちがこの自身に深く関わる主題を扱ったのは、今や規格化された伝達、ネットワーク上の検閲、そして禁欲主義の復活する時代において、奇妙なほどに不在のままである創造的・芸術的視点を提示することが、これまでになく必要だと感じたからである。彼らはこの全体に、愛と快楽を語る際に本来優先されるべき軽やかさと、現実が押しつける重さの両方を、勇気をもって、しかし悲愴さなしに与えようとした。\n\n彼らは個人の選択に取って代わるつもりはなく、また主権国家で施行される法律や、各人が自由に同意できる価値観に取って代わるつもりもない。\n\nフランスでは — 民主国家であってもすべての国がそうとは限らないが — 人身売買との本質的な闘いという法的枠組みの中で、警察と司法が提供する対応は、近代国家に期待されるものへと年々改善してきた。しかしそれは一般的な枠組みの中でのことであり、セックスワーカーやその客が経験する個別の状況に改善をもたらすことはない — それは恐らく彼らの役割ではないのだろう。いくつかの団体は、資金不足にもかかわらず、ひそかにその使命を果たしている。\n\n関係行政にも団体にも、ウェブサイトが存在する。とくに有用ないくつかは選別され、私たちのウェブサイト上で定期的に更新されるリストにて閲覧できる：www.moneypenis.com · www.moneypenis.com/prevention",siPl:"単品プリント",siCh:"サイズを選択",siInq:"問合せ",siNote:"価格はユーロ、フランス VAT 込。梱包・配送・保険は実費請求。",siCont:"ご購入は smoreu@mac.com またはお問い合わせフォームへ",siPro:"書店・アートディーラー・ギャラリー — 業務取引条件、展示、委託販売についてはお問い合わせください。",siRgpd:"ご提供いただく情報は、お問い合わせ対応およびアーティストのプロジェクト案内のみに使用されます",siPick:"プリントをクリックして表示・購入",req:"お問合せを送る",reqAge:"このセクションは成人のみ閲覧可能です。",shPfD:"30 × 40 cm · 50部限定 ナンバリング・サイン入り",shGfD:"50 × 70 cm · 15部限定 ナンバリング・サイン入り",shUn:"単品プリント",shUnD:"各作品は小サイズまたは大サイズで、S.M. & A.V. のサイン入り。",fFirstName:"名",fPhone:"電話番号",fCountry:"国",fLangPref:"返信言語",fPref:"連絡方法のご希望",fMatrix:"お問合せ内容",fMatrixHint:"該当する項目にチェックしてください",fMsgPh:"詳細（500文字以内）",fConsent:"上記条件に同意し、ご提供情報を Sébastien Moreu および André Vaszkievicz に送信することに同意します。",fSent:"送信が完了しました。ご指定のアドレスに返信いたします。",fError:"送信エラー。直接 smoreu@mac.com までご連絡ください。",rqInfo:"情報",rqBuy:"購入",rqDeposit:"委託",rqPro:"業者",rqColl:"コレクター",rqOther:"その他",continueShop:"閲覧を続ける",nax:"全文を読む ▾",nac:"閉じる ▴",aiWarn:"注意：この翻訳はAIにより生成されており、誤りや誤解を含む可能性があります"},RU:{techs:["Поэма · Золотой крест","Рукописное письмо · Тёмно-синие чернила · Скульптура","Цветная фотография · Жёлтый текст","Серебряно-желатиновый отпечаток · Зелёные рукописные чернила","Цветное фото · Красный текст · Галстук Hermès","Цветная фотография · Расстёгнутые джинсы · Природа","Фото в циановом оттенке · Оранжевое рукописное письмо","Красный текст · Ч/Б · Многоязычное предупреждение","Рукописное письмо · Купюры 50€ · Руки","Красный текст · Ч/Б · Манифест","Рукописное письмо · Цветочный фон · Тёмно-синие чернила"],aw:"Откровенный контент · Только для информированных взрослых",am:"Этот сайт представляет фотографические произведения, предназначенные исключительно для информированных взрослых.",ap:"+ 18 лет — Полная версия",am2:"− 18 лет — Публичная версия",nav:["Портфолио","Видео","Кофре","In Situ","Магазин","Биография & Подпись","VS00","Контакт"],hl:"Лимитированное издание · Оригинальные серебряно-желатиновые отпечатки",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Париж, 2024",hd:"Гей-поп-порно сказка, для информированных взрослых.\nКоллекция La Grande Librairie de Saint-Tropez®",hc:"Открыть произведение",pt:"I Love You Moneypenis",ps:"11 оригинальных серебряно-желатиновых отпечатков · Traphot, Монруж\nПодписаны и пронумерованы Sébastien Moreu & André Vaszkievicz",mg:"Нажмите, чтобы увеличить",tech_info:"2024 · 30 × 40 см (50 экз.) · 50 × 70 см (15 экз.) · Серебряно-желатиновый отпечаток · Traphot, Монруж",pl0:"2024 · 30 × 40 см (50 экз.) · 50 × 70 см (15 экз.) · Печать на бумаге Arches · Пронумерована и подписана вручную обоими художниками",op:"Открытие",tx:"Текст",pr:"Произведение защищено · Цифровой водяной знак",ct:"Кофре",cs:"Полное портфолио · 11 серебряно-желатиновых отпечатков · Подписаны и пронумерованы · Перчатки включены",zt:"In Situ",zs:"Произведения в интерьере",vt:"Фильм",vs:"Содержание только для информированных взрослых",st:"Приобрести",pft:"Малый формат  30 × 40 см",pfc:"50 портфолио, пронумерованных 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Большой формат  50 × 70 см",gfc:"15 портфолио, пронумерованных 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Подписаны S.M. & A.V. · Номер на каждом отпечатке · Перчатки включены",pd:"Traphot, Монруж",p1:"Полное портфолио МФ",p2:"Отдельный отпечаток МФ",p3:"Полное портфолио БФ",p4:"Отдельный отпечаток БФ",sh:"Доставка и страхование",sb:"Музейная упаковка · DHL Express\nФранция 45 € · Европа 95 € · Международная 180 €\nСтрахование включено",py:"Оплата",pb:"Банковский перевод · Карта · PayPal · 3 платежа без процентов",co:"Условия",cb:"Сертификат подлинности · Возврат 14 дней · НДС по стране",rv:"Зарезервировать",by:"Приобрести",bt:"Биография & Подписи",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — который напоминает, как стилистическое смирение, что все всегда называли его Sébastien — это то, что происходит, когда дисциплина и воля отказываются приручать одержимость.\n\nРодившийся 25 декабря 1972 года в декоре, слишком совершенном, чтобы быть невинным — Сен-Тропе — он растёт в тени точности (отец-стоматолог, формирующий рты) и мифа: участники Сопротивления, моряки, пропавшие, семейные призраки, отказывающиеся оставаться погребёнными. В десять лет ему вручают полный арсенал живописи. Не игрушка. Первое заряженное оружие — начало барочной коллекции, коллекции безумца интимных войн.\n\nОн никогда их не вернёт. Предпочитая умножать поля сражений.\n\nОн продвигается через последовательные смещения: живопись, книги, образы, человеческие отношения — всё становится материалом, всё может быть пересобрано. То, что он строит, — не произведение в классическом смысле, а поле напряжений: между памятью и изобретением, верностью и предательством, контролем и потерей.\n\nОн не работает на институции. Он их инфильтрирует. С 90-х годов, на орбите галериста Enrico Navarra, он строит карьеру, отвергающую ярлыки: ни вполне служащий, ни вполне художник, ни просто издатель — скорее продуктивная аномалия, способная порождать книги, выставки, связи, архивы, идеи, коммуникацию, события в ритме столь же захватывающем, сколь и прерывистом. Беспорядок, служащий камуфляжем этому человеку, который методично разрушает все рамки, призванные его удержать.\n\nОн активно участвует в замысле и развитии коллекции Made By…, международного издательского проекта, посвящённого современному творчеству на разных культурных сценах. В этом контексте он тесно сотрудничает с фотографом Simon Schwyzer.\n\nЕго отношения с Simon Schwyzer — это нестабильное сердце всего: сотрудничество, ставшее зависимостью, дружба, превратившаяся в любовную систему. Пара? После жестокой смерти швейцарского фотографа Moreu отвечает: «Спросите у него». Тем не менее, после его исчезновения ничто не останавливается — напротив, всё усиливается. Работать становится способом удержать, редактировать — способом продлить, писать — способом не сдаться. Он берёт на себя обязательство сохранения и продвижения его творчества, в частности через подготовку публикации монографии Made by… Simon Schwyzer.\n\nВ 2017 году при поддержке Enrico Navarra он основал Éditions Sébastien Moreu, независимое издательство, посвящённое книгам по искусству, эссе и трансверсальным издательским проектам. Память швейцарского фотографа разрушит предприятие. Не проекты.\n\nПозже, с André Vaszkievicz, интимное снова меняет форму. I Love You Moneypenis — не декоративный проект, наложенный на их отношения: это столкновение текста, образа, желания, денег, тела. Произведение, задуманное изнутри связи, без защитного фильтра. Их брак, 19 октября 2024 года в Сен-Тропе, ничего не стабилизирует: он официально оформляет то, что уже переполнялось.\n\nЕго собственная работа — коллажи, тексты, издательские устройства — относится к эстетике выставления. Открытые газеты, вырезанные образы, память, обработанная как первичный материал. Ничто не нейтрально. Всё вовлечено.\n\nФизически он несёт тело, которое не всегда сотрудничает: быстрое сердце, капризное давление, система под давлением. И всё же он продолжает, с привычками, которые иногда напоминают вызов, иногда безразличие к последствиям. Никакого собственного нарратива искупления здесь. Только настойчивость.\n\nОн любит интенсивно, архивирует одержимо, работает компульсивно и отказывается что-либо упрощать.\n\nЕсли существует объединяющий принцип, он таков: Sébastien Moreu не разрешает свои противоречия, настолько он почитает противоречия других.\n\nСвои собственные он организует — потом живёт внутри выставки. Эта галерея — его дом, и тот, который он целиком предлагает тем, кого любит; ничего никогда не для него.\n\nВ заключение он процитировал бы Desproges: «Поразительно, не правда ли?»",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz родился 28 ноября 1990 года в Бразилии, которая мало похожа на тропические открытки. Сéбери, маленький сельский городок на юге страны, принадлежит к тем территориям, сформированным европейскими миграциями XX века: польские общины здесь, но чуть дальше немецкие, итальянские, литовские… где языки, традиции, танцы и католицизм иногда выживают с большей упорностью, чем в их странах происхождения.\n\nСын польских потомков, рождённых в Бразилии, André растёт в среде, структурированной трудом, религией, молчанием и мужскими кодами. Последний ребёнок в семье из восьми детей (с единственной сестрой), родившийся почти через десять лет после младшего из своих старших, он приходит в семью, уже отмеченную усилием, ограничениями и весом культурного наследия.\n\nЛюбимая неожиданность. Любимая, но не ожидаемая. Он будет совсем один в этой многодетной семье.\n\nОчень рано он понимает две вещи: он чувствует себя глубоко на своём месте в школе, и определённые желания не имеют места в мире, в котором он растёт.\n\nГей-подростковый период нелегко никому, нигде… но в этом сельском и консервативном контексте об этом даже не говорят. Слова не существует, и желание переживается скорее как внутреннее напряжение, чем как возможная идентичность.\n\nИтак, André учится наблюдать и молчать, контролировать свои жесты, обвинять своё тело и свои эмоции.\nОн слишком чувствителен, чтобы говорить, и слишком молчалив, чтобы быть сентиментальным. Слишком дисциплинирован, чтобы не быть раненным. Слишком желанен, чтобы любить просто. Слишком предан, чтобы доверить это.\n\nНо были книги, словари, географические карты, иностранные языки — целый почти бесконечный мир бумаги, который уже позволял ему покинуть Сéбери мысленно, прежде чем он смог сделать это физически.\n\nПосле эквивалента бакалавриата, блестящего, высшее образование тем не менее останется недоступным для его положения. André работает в Порту-Алегри, открывает немного свободы и немного себя вместе с ней, затем постепенно покидает Бразилию ради Европы и Мира. Возможно, дальше можно найти больше себя.\nОн учит английский в Ирландии, получает литовское гражданство по семейному происхождению и развивает замечательное владение языками: португальский, испанский, польский, французский, немецкий и многие другие. Большую часть времени один.\n\nЕго отношение к языкам относится столько же к академическому достижению, сколько к форме экзистенциального смещения: смена языка становится также способом сместить смущение, обмануть скуку, пересечь границы и улучшить взгляд, обращённый на самого себя.\n\nПоследующие годы долго напоминают шаткое пересечение современной Европы: вырывание корней, пандемия, постоянная реконструкция.\n\nОднако André сохраняет почти аскетическую дисциплину: спорт, постоянная интеллектуальная работа, контроль питания, никогда алкоголя и практически никаких наркотиков. Его тело, кажется, рассматривается как территория, которую нужно удерживать на ногах любой ценой.\n\nВстреча с Sébastien Moreu преобразует эту траекторию, но не стирает её ран… по крайней мере пытается смягчить их. Вместе они развивают I Love You Moneypenis, проект, смешивающий образ, желание, автобиографию и перформанс. Их брак, отпразднованный в Сен-Тропе 19 октября 2024 года, не стабилизирует хаос: он просто придаёт ему жизнеспособную и видимую форму, передышку.\n\nПараллельно André возобновляет учёбу в Sorbonne Nouvelle по лингвистике, где его результаты быстро привлекают внимание, особенно по китайскому. Он также проходит замечательную стажировку в Cours Florent. Застенчивый открывается самому себе, обнаруживает освобождающую силу выражения эмоций, которые он позволяет себе, поскольку они написаны другими. Лето 2025 года, он отправляется на университетское погружение в Тайвань; в этом году это будет Шанхай.\n\nУвлечённый астрологией и древними духовностями, занятый глубокой терапевтической работой вокруг своего опыта, André тем не менее остаётся трудным для резюмирования. Всё в нём, кажется, организовано, чтобы преобразовать раны во внутреннюю архитектуру.\n\nНо в глазах Sébastien Moreu самое волнующее находится в другом месте — самое волнующее это смотреть, как André наблюдает за полевым цветком. Потому что тогда вся механика падает — мастерство, защита, контроль — и внезапно вновь появляется нечто чрезвычайно редкое: нетронутая нежность, пережившая всё остальное.\n\nВ заключение, он, вероятно, процитировал бы Jorge Amado: «Мир стоит лишь того волнения, которое он нам даёт». или, более уверенно сегодня, Gisèle Pelicot: «Стыд должен сменить сторону».",prst:"Пресс-папка",prss:"Пресс-папка в подготовке",prsc:"contact@moneypenis.com",plt:"О нас говорят",pls:"Обзор прессы в подготовке",nt:"Контакт",ns:"Отправить",n1:"Имя",n2:"Email",n3:"Сообщение",lg:"© Sébastien Moreu · © André Vaszkievicz · Париж 2024\nISBN МФ: 978-2-492649-21-9 · ISBN БФ: 978-2-492649-20-2 · INPI № 4999735 & 4999726 · Цифровой водяной знак",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Подтверждаю под свою честную ответственность, что мне 18 лет или больше и что я являюсь совершеннолетним согласно законодательству страны моего проживания.",ck2:"Признаю, что данный сайт представляет художественные фотографические произведения откровенного характера, включая продажу оригинальных тиражей, и согласен(на) получить к ним осознанный доступ.",nat:"Заметка авторов",naf:"Авторы желают предупредить, что развлекательная лёгкость названия и логотипа, как и откровенные визуальные и текстовые элементы произведений, могут создать впечатление беспечности перед тем не менее серьёзной темой. Они напоминают, что это не так и что эта сказка родилась из их личного опыта. Оба пережили все её аспекты, по разным причинам и в разные периоды.\n\nИх совместный художественный проект призван отговорить любого от вступления в подобную деятельность, предупреждая, что и сегодня: она закрывает больше дверей, чем открывает, и подвергает занимающихся ею и их близких множеству рисков. В частности, инфекциям и болезням, особенно ИППП, зависимостям от употребления наркотиков и алкоголя… Эта деятельность, в любой форме, подвергает прекарности, зависимости, социальному отторжению, насилию, шантажу, злоупотреблениям, принуждению и вымогательству.\n\nДля тех слишком немногих, кому удаётся из неё выбраться, она всегда требует очень долгосрочной психологической поддержки, настолько наши общества не оставляют им других выходов, кроме виктимизации или стыда, а то и обоих сразу.\n\nПоэтому авторы призывают к уважению и защите секс-работников. Не отрицая необходимости пенализации клиентов, они равным образом призывают к достойному обращению с эмоциональной нищетой, даже отчаянием, которые толкают их нарушать Закон. Авторы надеются, как со стороны широкой публики, так и со стороны учреждений, на бо́льшую поддержку ассоциаций, способных сопровождать тех и других.\n\nЗдесь речь ни в коем случае не о слепом снятии табу со всех практик, не больше, чем о создании скандала… Но о напоминании о срочности избавиться от общественных запретов, которые склерозируют публичные дебаты, которые тем не менее должны быть безмятежными, а не покрытыми моралистическим одеянием, которому здесь нечего делать и которое препятствует любому освобождению речи. У них нет сомнений, что если есть покрывало, которое следует отбросить, то это оно.\n\nИ под дебатами они имеют в виду первейшие из всех — те, что должны вестись внутри семьи.\n\nИ к тому же это красиво… тоже… член!\n\n(Модель, выбранная художниками, не является секс-работником. Делящий жизнь с одним из авторов, он пожелал остаться анонимным.)\n\nЕсли Авторы затронули эту тему, которая их касается, то потому, что им показалось, что в нашу эпоху форматированной коммуникации, цензуры сетей и возрождения ханжества было более чем когда-либо необходимо привнести креативную и художественную точку зрения, которая остаётся странно отсутствующей. Они хотели придать этому целому одновременно лёгкость, которая должна преобладать, когда говорят о любви и удовольствии, и тяжесть, которую налагают пережитые реальности: с мужеством и без пафоса.\n\nОни не намерены подменять собой индивидуальные выборы, как и законы, действующие в суверенных странах, как и ценности, которым каждый волен следовать.\n\nВо Франции — это не случай во всех странах, даже демократических — ответы, данные полицией и юстицией, в правовой рамке существенной борьбы с торговлей людьми, улучшались с годами в направлении того, что ожидается от современной страны. Но они делают это в общей рамке и не приносят, возможно, это не их роль, улучшения индивидуальным ситуациям, переживаемым как секс-работниками, так и их клиентами. Ассоциации скромно выполняют свои миссии, несмотря на слабость своих средств.\n\nКак для соответствующих администраций, так и для ассоциаций, существуют интернет-сайты. Некоторые очень полезные отобраны и доступны в регулярно обновляемом списке на нашем собственном интернет-сайте: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Отдельные отпечатки",siCh:"Выбрать формат",siInq:"Запросить",siNote:"Цены в евро, включая французский НДС. Упаковка, доставка и страхование выставляются по фактической стоимости.",siCont:"Для приобретения свяжитесь с smoreu@mac.com — или через контактную форму",siPro:"Книготорговцам, арт-дилерам и галереям — для торговых условий, выставок и комиссионной продажи, пожалуйста, свяжитесь с нами.",siRgpd:"Передаваемые данные будут использоваться только для вашего запроса и для информации о проектах художников",siPick:"Нажмите на отпечаток, чтобы увидеть и приобрести",req:"Сделать запрос",reqAge:"Этот раздел зарезервирован для совершеннолетних лиц.",shPfD:"30 × 40 см · 50 пронумерованных и подписанных экземпляров",shGfD:"50 × 70 см · 15 пронумерованных и подписанных экземпляров",shUn:"Отдельные отпечатки",shUnD:"Каждый отпечаток доступен в малом или большом формате, подписан S.M. & A.V.",fFirstName:"Имя",fPhone:"Телефон",fCountry:"Страна",fLangPref:"Язык ответа",fPref:"Предпочтительный способ связи",fMatrix:"Объект запроса",fMatrixHint:"Отметьте соответствующие клетки",fMsgPh:"Уточнения (макс. 500 символов)",fConsent:"Принимаю вышеуказанные условия и передачу моих контактных данных Sébastien Moreu и André Vaszkievicz.",fSent:"Запрос отправлен. Вы получите ответ по указанному адресу.",fError:"Ошибка отправки. Вы можете написать напрямую на smoreu@mac.com.",rqInfo:"Информация",rqBuy:"Покупка",rqDeposit:"Комиссионная продажа",rqPro:"Профессиональный",rqColl:"Коллекционер",rqOther:"Другое",continueShop:"Продолжить просмотр",nax:"Читать полностью ▾",nac:"Свернуть ▴",aiWarn:"ВНИМАНИЕ: ЭТОТ ПЕРЕВОД СОЗДАН ИИ И МОЖЕТ СОДЕРЖАТЬ ОШИБКИ ИЛИ НЕВЕРНЫЕ ТРАКТОВКИ"},PL:{techs:["Wiersz · Złoty krzyż","Rękopis · Atrament granatowy · Rzeźba","Fotografia kolorowa · Żółty tekst","Odbitka srebrowo-żelatynowa · Zielony atrament odręczny","Zdjęcie kolorowe · Czerwony tekst · Krawat Hermès","Fotografia kolorowa · Rozpięte jeansy · Natura","Zdjęcie z odcieniem cyjanu · Pomarańczowy rękopis","Czerwony tekst · Cz/B · Wielojęzyczne ostrzeżenie","Rękopis · Banknoty 50€ · Dłonie","Czerwony tekst · Cz/B · Manifest","Rękopis · Kwiecisty tło · Atrament granatowy"],aw:"Treści dla dorosłych · Tylko dla świadomych odbiorców",am:"Ta strona prezentuje dzieła fotograficzne przeznaczone wyłącznie dla świadomych dorosłych.",ap:"+ 18 lat — Wersja pełna",am2:"− 18 lat — Wersja publiczna",nav:["Portfolio","Wideo","Kaseta","In Situ","Sklep","Biografia & Podpisy","VS00","Kontakt"],hl:"Edycja Limitowana · Oryginalne odbitki srebrowo-żelatynowe",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paryż, 2024",hd:"Gejowska Pop Porno Bajka, dla świadomych dorosłych.\nKolekcja La Grande Librairie de Saint-Tropez®",hc:"Odkryj dzieło",pt:"I Love You Moneypenis",ps:"11 oryginalnych odbitek srebrowo-żelatynowych · Traphot, Montrouge\nPodpisane i ponumerowane przez Sébastien Moreu & André Vaszkievicz",mg:"Kliknij, aby powiększyć",tech_info:"2024 · 30 × 40 cm (50 egz.) · 50 × 70 cm (15 egz.) · Odbitka srebrowo-żelatynowa · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 egz.) · 50 × 70 cm (15 egz.) · Druk na papierze Arches · Numerowana i podpisana ręcznie przez obu artystów",op:"Otwarcie",tx:"Tekst",pr:"Dzieło chronione · Znak wodny cyfrowy",ct:"Kaseta",cs:"Kompletne portfolio · 11 odbitek srebrowo-żelatynowych · Podpisane i ponumerowane · Rękawiczki w zestawie",zt:"In Situ",zs:"Dzieła w sytuacji",vt:"Film",vs:"Treść tylko dla świadomych dorosłych",st:"Nabyć",pft:"Mały format  30 × 40 cm",pfc:"50 portfolio ponumerowanych 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Duży format  50 × 70 cm",gfc:"15 portfolio ponumerowanych 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Podpisane S.M. & A.V. · Numer na każdej odbitce · Rękawiczki w zestawie",pd:"Traphot, Montrouge",p1:"Kompletne portfolio MF",p2:"Pojedyncza odbitka MF",p3:"Kompletne portfolio DF",p4:"Pojedyncza odbitka DF",sh:"Transport i ubezpieczenie",sb:"Opakowanie muzealne · DHL Express\nFrancja 45 € · Europa 95 € · Międzynarodowy 180 €\nUbezpieczenie wliczone",py:"Płatność",pb:"Przelew · Karta · PayPal · 3× bez odsetek",co:"Warunki",cb:"Certyfikat autentyczności · Zwrot 14 dni · VAT zależnie od kraju",rv:"Zarezerwować",by:"Nabyć",bt:"Biografia & Podpisy",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — który przypomina, jak swoista stylistyczna rezygnacja, że wszyscy zawsze nazywali go Sébastien — jest tym, co się dzieje, gdy dyscyplina i wola odmawiają oswojenia obsesji.\n\nUrodzony 25 grudnia 1972 w scenerii zbyt doskonałej, by była niewinna — Saint-Tropez — dorasta w cieniu precyzji (ojciec dentysta kształtujący usta) i mitu: ruchu oporu, marynarzy, zaginionych, rodzinnych duchów, które odmawiają pozostania pogrzebanymi. W wieku dziesięciu lat otrzymuje pełen arsenał malarski. Nie zabawkę. Pierwszą naładowaną broń — początek barokowej kolekcji, kolekcji szaleńca intymnych wojen.\n\nNigdy ich nie zwróci. Wolał mnożyć swoje pola bitwy.\n\nPosuwa się przez kolejne przemieszczenia: malarstwo, książki, obrazy, relacje międzyludzkie — wszystko staje się materiałem, wszystko można złożyć na nowo. To, co buduje, nie jest dziełem w klasycznym sensie, lecz polem napięć: między pamięcią a wymysłem, wiernością a zdradą, kontrolą a stratą.\n\nNie pracuje dla instytucji. Infiltruje je. Od lat 90. w orbicie galernika Enrico Navarra buduje karierę odrzucającą etykiety: ani całkiem pracownik, ani całkiem artysta, ani zwykły wydawca — raczej produktywna anomalia, zdolna generować książki, wystawy, więzi, archiwa, idee, komunikację, wydarzenia w tempie zarówno zapierającym dech, jak i nieciągłym. Nieporządek służący za kamuflaż temu człowiekowi, który metodycznie niszczy wszelkie ramy mające go ograniczać.\n\nAktywnie uczestniczy w koncepcji i rozwoju kolekcji Made By…, międzynarodowego projektu wydawniczego poświęconego współczesnej twórczości na różnych scenach kulturowych. W tym kontekście blisko współpracuje z fotografem Simon Schwyzer.\n\nJego relacja z Simon Schwyzer jest niestabilnym sercem całości: współpraca, która stała się zależnością, przyjaźń przekształcona w system miłosny. Para? Od brutalnej śmierci szwajcarskiego fotografa Moreu odpowiada: „Zapytaj go”. Niemniej, po jego zniknięciu nic się nie zatrzymuje — wręcz przeciwnie, wszystko się intensyfikuje. Praca staje się sposobem na zatrzymanie, edytowanie sposobem na przedłużenie, pisanie sposobem na to, by się nie poddać. Angażuje się w zachowanie i promocję jego twórczości, m.in. poprzez przygotowanie publikacji monografii Made by… Simon Schwyzer.\n\nW 2017 r., przy wsparciu Enrico Navarra, założył Éditions Sébastien Moreu, niezależne wydawnictwo poświęcone książkom o sztuce, esejom i transwersalnym projektom wydawniczym. Pamięć szwajcarskiego fotografa zniszczy przedsiębiorstwo. Nie projekty.\n\nPóźniej, z André Vaszkievicz, intymne znów zmienia formę. I Love You Moneypenis nie jest dekoracyjnym projektem nałożonym na ich relację: jest zderzeniem tekstu, obrazu, pragnienia, pieniędzy, ciała. Dziełem pomyślanym wewnątrz więzi, bez ochronnego filtra. Ich małżeństwo, 19 października 2024 r. w Saint-Tropez, nic nie stabilizuje: nadaje oficjalny charakter temu, co już się rozlewało.\n\nJego własna praca — kolaże, teksty, urządzenia wydawnicze — należy do estetyki ekspozycji. Otwarte gazety, wycięte obrazy, pamięć traktowana jak surowiec. Nic nie jest neutralne. Wszystko jest zaangażowane.\n\nFizycznie nosi ciało, które nie zawsze współpracuje: szybkie serce, kapryśne ciśnienie, system pod presją. A jednak kontynuuje, z nawykami przypominającymi czasem wyzwanie, czasem obojętność wobec konsekwencji. Brak tu właściwej narracji odkupienia. Tylko wytrwałość.\n\nKocha intensywnie, archiwizuje obsesyjnie, pracuje kompulsywnie i odmawia upraszczania czegokolwiek.\n\nJeśli istnieje zasada jednocząca, to ta: Sébastien Moreu nie rozwiązuje swoich sprzeczności, tak bardzo czci sprzeczności innych.\n\nSwoje organizuje — następnie żyje w środku wystawy. Ta galeria jest jego domem i tym, który ofiarowuje w całości tym, których kocha; nic nigdy nie jest dla niego.\n\nNa zakończenie zacytowałby Desproges'a: „Zaskakujące, prawda?”",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz urodził się 28 listopada 1990 r. w Brazylii niewiele przypominającej tropikalne pocztówki. Seberi, małe wiejskie miasteczko na południu kraju, należy do tych terytoriów ukształtowanych przez europejskie migracje XX wieku: społeczności polskie tutaj, ale nieco dalej niemieckie, włoskie, litewskie… gdzie języki, tradycje, tańce i katolicyzm przetrwały czasem z większym uporem niż w krajach ich pochodzenia.\n\nSyn polskich potomków urodzonych w Brazylii, André dorasta w środowisku ustrukturyzowanym przez pracę, religię, milczenia i męskie kody. Najmłodsze dziecko z ośmiorga rodzeństwa (z jedyną siostrą), urodzony niemal dziesięć lat po najmłodszym z jego starszych, przychodzi do rodziny już naznaczonej wysiłkiem, ograniczeniami i ciężarem dziedzictwa kulturowego.\n\nUkochana niespodzianka. Ukochana, ale nieoczekiwana. Będzie zupełnie sam w tej wielodzietnej rodzinie.\n\nBardzo wcześnie rozumie dwie rzeczy: czuje się głęboko na swoim miejscu w szkole, a pewne pragnienia nie mają miejsca w świecie, w którym dorasta.\n\nGejowskie dorastanie nie jest łatwe dla nikogo, nigdzie… ale w tym wiejskim i konserwatywnym kontekście nie ma o tym nawet mowy. Słowo nie istnieje, a pragnienie jest przeżywane bardziej jako wewnętrzne napięcie niż jako możliwa tożsamość.\n\nAndré uczy się więc obserwować i milczeć, kontrolować swoje gesty, obwiniać swoje ciało i emocje.\nJest zbyt wrażliwy, by mówić, i zbyt milczący, by być sentymentalnym. Zbyt zdyscyplinowany, by nie być zranionym. Zbyt pożądany, by kochać po prostu. Zbyt zdradzony, by się tym zwierzyć.\n\nAle były książki, słowniki, mapy geograficzne, języki obce — cały niemal nieskończony świat papieru, który już pozwalał mu opuścić Seberi mentalnie, zanim mógł to zrobić fizycznie.\n\nPo odpowiedniku matury, świetnej, studia wyższe pozostaną jednak niedostępne dla jego sytuacji. André pracuje w Porto Alegre, odkrywa trochę wolności i trochę siebie wraz z nią, następnie stopniowo opuszcza Brazylię na rzecz Europy i Świata. Może dalej można znaleźć więcej siebie.\nUczy się angielskiego w Irlandii, otrzymuje obywatelstwo litewskie przez pochodzenie rodzinne i rozwija godne uwagi opanowanie języków: portugalskiego, hiszpańskiego, polskiego, francuskiego, niemieckiego i kilku innych jeszcze. Większość czasu sam.\n\nJego stosunek do języków dotyczy zarówno osiągnięcia akademickiego, co formy egzystencjalnego przemieszczenia: zmiana języka staje się także sposobem na przemieszczenie zażenowania, oszukanie nudy, przekraczanie granic i poprawę spojrzenia, jakim obdarza samego siebie.\n\nLata następne długo przypominają niepewne przemierzanie współczesnej Europy: wykorzenienie, pandemia, ciągła odbudowa.\n\nA jednak André zachowuje niemal ascetyczną dyscyplinę: sport, stała praca intelektualna, kontrola żywieniowa, nigdy alkoholu i praktycznie żadnych narkotyków. Jego ciało wydaje się traktowane jako terytorium, które trzeba utrzymać na nogach za wszelką cenę.\n\nSpotkanie z Sébastien Moreu przekształca tę trajektorię, ale nie wymazuje jej ran… przynajmniej próbuje je złagodzić. Razem rozwijają I Love You Moneypenis, projekt mieszający obraz, pragnienie, autobiografię i performance. Ich małżeństwo, świętowane w Saint-Tropez 19 października 2024 r., nie stabilizuje chaosu: po prostu nadaje mu żywotną i widoczną formę, wytchnienie.\n\nRównolegle André wznawia studia w Sorbonne Nouvelle z nauk o języku, gdzie jego wyniki szybko przyciągają uwagę, zwłaszcza z chińskiego. Odbywa również zauważony staż w Cours Florent. Nieśmiały odkrywa się przed sobą samym, odkrywa wyzwalającą siłę wyrażania emocji, na które sobie pozwala, bo są napisane przez innych. Lato 2025 r., wyjeżdża na uniwersyteckie zanurzenie na Tajwan; w tym roku to będzie Szanghaj.\n\nZafascynowany astrologią i starożytnymi duchowościami, zaangażowany w głęboką pracę terapeutyczną wokół swojego doświadczenia, André pozostaje jednak trudny do streszczenia. Wszystko w nim wydaje się zorganizowane, by przekształcać rany w wewnętrzną architekturę.\n\nAle w oczach Sébastien Moreu to, co najbardziej wzruszające, jest gdzie indziej — to najbardziej wzruszające jest patrzeć, jak André obserwuje polny kwiat. Bo wtedy cała mechanika upada — mistrzostwo, obrona, kontrola — i nagle pojawia się ponownie coś niezwykle rzadkiego: nienaruszona łagodność, która przetrwała wszystko inne.\n\nNa zakończenie cytowałby zapewne Jorge Amado: „Świat wart jest tylko tej emocji, którą nam daje”. lub bardziej z pewnością dzisiaj Gisèle Pelicot: „Wstyd musi zmienić stronę”.",prst:"Materiały prasowe",prss:"Materiały prasowe w przygotowaniu",prsc:"contact@moneypenis.com",plt:"Mówią o nas",pls:"Przegląd prasy w przygotowaniu",nt:"Kontakt",ns:"Wyślij",n1:"Nazwisko",n2:"Email",n3:"Wiadomość",lg:"© Sébastien Moreu · © André Vaszkievicz · Paryż 2024\nISBN MF: 978-2-492649-21-9 · ISBN DF: 978-2-492649-20-2 · INPI nr 4999735 & 4999726 · Cyfrowy znak wodny",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Oświadczam na własną odpowiedzialność, że mam ukończone 18 lat i jestem osobą pełnoletnią zgodnie z prawem kraju mojego zamieszkania.",ck2:"Przyjmuję do wiadomości, że ta strona prezentuje artystyczne dzieła fotograficzne o charakterze jawnym, w tym sprzedaż oryginalnych odbitek, i wyrażam świadomą zgodę na dostęp.",nat:"Nota autorów",naf:"Autorzy pragną ostrzec, że rozrywkowa lekkość tytułu i logo, podobnie jak wprost wyrażone obrazy i teksty dzieł, mogą sprawiać wrażenie nonszalancji wobec tematu jednak poważnego. Przypominają, że tak nie jest i że ta opowieść narodziła się z ich osobistych doświadczeń. Obaj, z różnych powodów i w różnych epokach, przeżyli wszystkie jej aspekty.\n\nIch wspólny projekt artystyczny ma na celu odwiedzenie kogokolwiek od angażowania się w działalność, ostrzegając, że nawet dzisiaj: zamyka więcej drzwi niż otwiera i naraża na wiele ryzyk tych, którzy ją praktykują, oraz ich bliskich. W szczególności zakażenia i choroby, zwłaszcza STI, uzależnienia od używania narkotyków i alkoholu… Ta działalność, w jakiejkolwiek formie, naraża na prekarność, zależność, odrzucenie społeczne, przemoc, szantaż, nadużycia, przymus i wymuszenia.\n\nDla zbyt nielicznych, którym udaje się z niej wyjść, zawsze wymaga ona bardzo długoterminowego wsparcia psychologicznego, tak bardzo nasze społeczeństwa nie pozostawiają im innych wyjść niż wiktymizacja lub wstyd, a nawet oba naraz.\n\nAutorzy wzywają zatem do szacunku i ochrony pracowników i pracowniczek seksualnych. Nie negując konieczności penalizacji klientów, wzywają jednocześnie do godnego traktowania nędzy uczuciowej, a nawet rozpaczy, która prowadzi ich do łamania Prawa. Autorzy mają nadzieję, ze strony zarówno opinii publicznej, jak i instytucji, na większe wsparcie dla stowarzyszeń, które mogą towarzyszyć jednym i drugim.\n\nNie chodzi tu w żadnym wypadku o ślepe zniesienie tabu wobec wszystkich praktyk, ani o wywołanie skandalu… Lecz o przypomnienie pilnej potrzeby pozbycia się społecznych zakazów, które unieruchamiają publiczną debatę, która jednak powinna być spokojna, a nie przyodziana w moralistyczną szatę, która nie ma tam miejsca i uniemożliwia jakiekolwiek wyzwolenie słowa. Nie mają wątpliwości, że jeśli istnieje zasłona do zerwania, to właśnie ta.\n\nA przez debatę rozumieją przywołanie tej pierwszej ze wszystkich, tej, która powinna toczyć się w łonie rodziny.\n\nA poza tym to jest piękne… także… kutas !\n\n(Model wybrany przez artystów nie jest pracownikiem seksualnym. Dzieląc życie z jednym z autorów, postanowił pozostać anonimowy.)\n\nJeśli Autorzy poruszyli ten temat, który ich dotyczy, to dlatego, że wydało im się, że w naszej epoce sformatowanej komunikacji, cenzury sieci i renesansu pruderii, bardziej niż kiedykolwiek konieczne było wniesienie kreatywnego i artystycznego punktu widzenia, który pozostaje dziwnie nieobecny. Chcieli nadać tej całości zarówno lekkość, która powinna przeważać, gdy mówi się o miłości i przyjemności, jak i ciężar narzucany przez przeżyte rzeczywistości: z odwagą i bez patosu.\n\nNie zamierzają zastępować wyborów indywidualnych, ani praw obowiązujących w suwerennych krajach, ani wartości, do których każdy może swobodnie się przyznawać.\n\nWe Francji — to nie jest przypadek we wszystkich krajach, nawet demokratycznych — odpowiedzi udzielane przez policję i wymiar sprawiedliwości, w ramach prawnych walki istotnej z handlem ludźmi, poprawiły się z biegiem lat w kierunku tego, czego oczekuje się od kraju nowoczesnego. Ale czynią to w ramach aspektu ogólnego i nie wnoszą, być może to nie ich rola, poprawy do indywidualnych sytuacji przeżywanych zarówno przez pracowników seksualnych, jak i ich klientów. Stowarzyszenia dyskretnie wypełniają swoje misje pomimo słabości swoich środków.\n\nZarówno dla zainteresowanych administracji, jak i dla stowarzyszeń, istnieją strony internetowe. Niektóre bardzo użyteczne są wybrane i dostępne na regularnie aktualizowanej liście na naszej własnej stronie internetowej: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Pojedyncze odbitki",siCh:"Wybrać format",siInq:"Zapytać",siNote:"Ceny w euro, francuski VAT wliczony. Opakowanie, wysyłka i ubezpieczenie fakturowane według rzeczywistego kosztu.",siCont:"Aby nabyć, prosimy o kontakt smoreu@mac.com — lub przez formularz kontaktowy",siPro:"Księgarnie, marszandzi i galerie — w sprawie warunków profesjonalnych, wystaw i depozytów, prosimy o kontakt.",siRgpd:"Przekazane dane będą wykorzystane wyłącznie do Państwa zapytania oraz do informacji o projektach artystów",siPick:"Kliknij na odbitkę, aby ją zobaczyć i nabyć",req:"Złożyć zapytanie",reqAge:"Ta sekcja jest zarezerwowana dla osób pełnoletnich.",shPfD:"30 × 40 cm · 50 egzemplarzy ponumerowanych i podpisanych",shGfD:"50 × 70 cm · 15 egzemplarzy ponumerowanych i podpisanych",shUn:"Pojedyncze odbitki",shUnD:"Każda odbitka dostępna w Małym lub Dużym formacie, podpisana S.M. & A.V.",fFirstName:"Imię",fPhone:"Telefon",fCountry:"Kraj",fLangPref:"Język odpowiedzi",fPref:"Preferencja kontaktu",fMatrix:"Przedmiot zapytania",fMatrixHint:"Zaznacz odpowiednie pola",fMsgPh:"Szczegóły (maks. 500 znaków)",fConsent:"Akceptuję powyższe warunki i przekazanie moich danych Sébastien Moreu i André Vaszkievicz.",fSent:"Zapytanie wysłane. Otrzymasz odpowiedź na wskazany adres.",fError:"Błąd wysyłki. Możesz napisać bezpośrednio na smoreu@mac.com.",rqInfo:"Informacja",rqBuy:"Zakup",rqDeposit:"Depozyt",rqPro:"Profesjonalny",rqColl:"Kolekcjoner",rqOther:"Inne",continueShop:"Kontynuuj przeglądanie",nax:"Czytaj całość ▾",nac:"Zwiń ▴",aiWarn:"UWAGA: TO TŁUMACZENIE ZOSTAŁO WYGENEROWANE PRZEZ AI I MOŻE ZAWIERAĆ BŁĘDY LUB NIEPRAWIDŁOWE INTERPRETACJE"},
};


const EDS=[{key:"pf",pr:{port:590,single:110},rm:{port:37,tot:50}},{key:"gf",pr:{port:1190,single:180},rm:{port:12,tot:15}}];
const TEXTS = {
  I: {
    FR: `TO WHOM IT MAY CONCERN

JE SUIS LA SOLITUDE QUI SOIGNE TA TRISTESSE
JE SUIS LA TRISTESSE QUI SOIGNE TA SOLITUDE
JE SUIS L'HABIT DE L'AMOUR
JE SUIS L'AMOUR NU
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
I AM THE SADNESS THAT HEALS YOUR SOLITUDE
I AM THE GARMENT OF LOVE
I AM NAKED LOVE
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
SOY LA TRISTEZA QUE CURA TU SOLEDAD
SOY EL TRAJE DEL AMOR
SOY EL AMOR DESNUDO
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
EU SOU A TRISTEZA QUE CUIDA DA TUA SOLIDÃO
EU SOU O HÁBITO DO AMOR
EU SOU O AMOR NU
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

    DE: `AN ALLE, DIE ES BETRIFFT

ICH BIN DIE EINSAMKEIT, DIE DEINE TRAURIGKEIT HEILT
ICH BIN DIE TRAURIGKEIT, DIE DEINE EINSAMKEIT HEILT
ICH BIN DAS GEWAND DER LIEBE
ICH BIN DIE NACKTE LIEBE
ICH BIN DIESER ALS BEGEHREN VERKLEIDETE KÖRPER
ICH BIN DIESES BEGEHREN, DAS DAS DEINE HEILT
ICH BIN DIESES BEGEHREN IM ABGRUND DES DEINEN.
ICH BIN DIESES TOTEM, DAS ÄLTESTE VON ALLEN,
ICH BIN FLEISCH UND BLUT,
ICH BIN HAUT OHNE KNOCHEN.
ICH BIN DIESES TABU, DAS MAN VERSCHWEIGEN WILL,
ICH BIN AUCH DAS LACHEN UND DAS LÄCHELN.
ICH BIN DIESES GESCHLECHT, DAS DU VEREHRST,
ICH BIN DIESE URZEITLICHE STATUE.
ICH BIN DAS SINNLICHE HOLZ,
ICH BIN DIE RUHE UND DIE SPANNUNG.
ICH BIN DAS WERKZEUG DES ARBEITERS.
ICH BIN DIE TROPFENDE KERZE,
ICH BIN BRENNEND UNTER DEM KREUZ UND
ICH BIN DIESER SCHWANZ, DEN DU ANBETEST.
ICH BIN DIESER SCHWAMM AUS UNENDLICHER SANFTHEIT,
ICH BIN DER, DER WÄHRT, SO LANGE DIE ZEIT VERGEHT.

ICH BIN MONEYPENIS

DU KANNST MICH "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY" NENNEN... UND DANN?
ICH WERDE KEIN EPITAPH HABEN!

VON MEINEM LEICHNAM WIRD NICHTS BLEIBEN...
UNTER DEM KREUZ WERDE ICH AM GRAB MEINES HERRN ABWESEND SEIN, DAS IST DAS SCHICKSAL DER KNOCHENLOSEN.
"TRUE LOVE LEAVES NO TRACES"
PSALMODIERTE DER SÄNGER
ICH BIN MONEYPENIS
NUR MEIN HERZ STEHT ZUM VERKAUF, UND DU, DU LIEBST MICH...`,

    IT: `A CHIUNQUE INTERESSI

IO SONO LA SOLITUDINE CHE CURA LA TUA TRISTEZZA
IO SONO LA TRISTEZZA CHE CURA LA TUA SOLITUDINE
IO SONO L'ABITO DELL'AMORE
IO SONO L'AMORE NUDO
IO SONO QUESTO CORPO TRAVESTITO DI DESIDERI
IO SONO QUESTO DESIDERIO CHE CURA IL TUO
IO SONO QUESTO DESIDERIO NELL'ABISSO DEL TUO.
IO SONO QUESTO TOTEM, IL PIÙ ANTICO DI TUTTI,
IO SONO CARNE E SANGUE,
IO SONO PELLE SENZA OSSA.
IO SONO QUESTO TABÙ CHE SI VUOLE TACERE,
IO SONO ANCHE IL RISO E IL SORRISO.
IO SONO QUESTO SESSO CHE TU VENERI,
IO SONO QUESTA STATUA PRIMITIVA.
IO SONO IL LEGNO SENSUALE,
IO SONO IL RIPOSO E LA TENSIONE.
IO SONO LO STRUMENTO DEL LAVORATORE.
IO SONO IL CERO CHE COLA,
IO SONO ARDENTE SOTTO LA CROCE E
IO SONO QUESTO CAZZO CHE TU ADORI.
IO SONO QUESTA SPUGNA DI DOLCEZZA INFINITA,
IO SONO QUELLO CHE DURA IL TEMPO CHE IL TEMPO PASSA.

IO SONO MONEYPENIS

PUOI CHIAMARMI "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... E ALLORA?
NON AVRÒ EPITAFFIO!

DELLA MIA SPOGLIA NON RIMARRÀ NULLA...
SOTTO LA CROCE, SARÒ ASSENTE DALLA TOMBA DEL MIO PADRONE, È IL DESTINO DEI SENZA OSSA.
"TRUE LOVE LEAVES NO TRACES"
SALMODIAVA IL CANTANTE
IO SONO MONEYPENIS
SOLO IL MIO CUORE È IN VENDITA, E TU, TU MI AMI...`,

    "中": `致有关人士

我是治愈你悲伤的孤独
我是治愈你孤独的悲伤
我是爱的外衣
我是赤裸的爱
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
私はあなたの孤独を癒す悲しみ
私は愛の衣
私は裸の愛
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

    ES: `Estimado Señor,

Moneypenis mi amor,
mi corazón, mi ángel,
no encuentro las palabras, no encuentro las palabras...
te amo, eso es todo. Y además, ¿qué responder a una polla que escribe?
Un pene literario, un corresponsal extranjero.
No puedo más que olvidar todo pudor y dignidad,
y responderte te amo queriendo creerlo.
Te amo hasta aceptar lo imposible, hasta imaginar que te diriges
a mí. Hasta sonrojarme un poco, de esa pequeña vergüenza que calienta el rostro.

A estas alturas, Moneypenis mi tierno corazón, mi bella polla,
puedo responderte muy bien...

Mi grueso y débil, mi largo y duro juego de manos, por una semana o hasta el fin...

Y ya que escribes debes poder leer. Incluso puedo escribirte
como una polla si hace falta... ¡hasta ensuciar mi pluma!

Pero, ¿existen tus palabras solo a mis ojos?
¿Una simple cortesía poética que viste nuestros intercambios?
¿Una visión del espíritu enfermo y del alma triste que me habitan?

Lo sé... lo sé lo sé... ¡solo tu corazón está en venta!
Solo tu corazón está en venta y yo te amo.
Pero del precio mostrado no conozco ni cifra ni moneda.
I love you Moneypenis... ¡eso es todo!

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
ich finde keine Worte, ich finde keine Worte...
ich liebe dich, das ist alles. Und was antwortet man einem Schwanz, der schreibt?
Ein literarischer Penis, ein ausländischer Korrespondent.
Ich kann nur jede Scham und Würde vergessen
und dir antworten: ich liebe dich, in dem Glauben, daran zu glauben.
Ich liebe dich genug, um das Unmögliche zu akzeptieren, mir vorzustellen, dass du dich
an mich wendest. Genug, um ein wenig zu erröten, von jener kleinen Scham, die das Gesicht erhitzt.

An dem Punkt, an dem ich bin, Moneypenis mein zartes Herz, mein schöner Schwanz,
kann ich dir wohl antworten...

Mein dicker und schwacher, mein langer und harter Taschenspielertrick, für eine Woche oder bis ans Ende...

Und da du schreibst, musst du wohl lesen können. Ich kann dir sogar
wie ein Schwanz schreiben, wenn es sein muss... bis ich meine Feder beschmutze!

Aber existieren deine Worte nur in meinen Augen?
Eine einfache poetische Höflichkeit, die unseren Austausch kleidet?
Eine Sicht des kranken Geistes und der traurigen Seele, die mich bewohnen?

Ich weiß... ich weiß ich weiß... nur dein Herz ist zu verkaufen!
Nur dein Herz ist zu verkaufen, und ich liebe dich.
Aber vom angezeigten Preis kenne ich weder Zahl noch Währung.
I love you Moneypenis... das ist alles!

Dein anderes ♥`,

    IT: `Egregio Signore,

Moneypenis amore mio,
cuore mio, angelo mio,
non trovo le parole, non trovo le parole...
ti amo, ecco tutto. E poi, che cosa rispondere a un cazzo che scrive?
Un pene letterario, un corrispondente straniero.
Non posso che dimenticare ogni pudore e dignità,
e risponderti ti amo, volendo crederci.
Ti amo al punto da accettare l'impossibile, da immaginare che ti rivolga
a me. Da arrossire un po', di quella piccola vergogna che scalda il viso.

A questo punto, Moneypenis mio tenero cuore, mio bel cazzo,
posso ben risponderti...

Mio spesso e debole, mio lungo e duro gioco di prestigio, per una settimana o fino alla fine...

E dato che scrivi devi anche poter leggere. Posso persino scriverti
come un cazzo se occorre... fino a sporcare la mia penna!

Ma le tue parole esistono solo ai miei occhi?
Una semplice cortesia poetica che veste i nostri scambi?
Una visione dello spirito malato e dell'anima triste che mi abitano?

Lo so... lo so lo so... solo il tuo cuore è in vendita!
Solo il tuo cuore è in vendita e io ti amo.
Ma del prezzo esposto non conosco né cifra né valuta.
I love you Moneypenis... ecco tutto!

Il tuo altro ♥`,

    "中": `亲爱的先生，

Moneypenis 我的爱，
我的心，我的天使，
我找不到词，我找不到词……
我爱你，仅此而已。再说，对一根会写字的鸡巴该回什么？
一根文学的阴茎，一位外国通讯员。
我只能忘记一切廉耻与尊严，
回你一句"我爱你"，并愿意去相信。
我爱你到接受这不可能，到想象你正向我倾诉。
脸颊微微泛红，那是一点点羞赧让面孔发烫。

Moneypenis 我温柔的心，我美丽的鸡巴——既然事已至此，
我也能好好回你一封……

我厚而虚的，我长而硬的把戏，为一周或至终……

既然你写得出，你自然也读得了。如果有必要，我甚至能像一根鸡巴那样写给你……写到弄脏我的笔！

但你的话语，难道只在我眼中存在？
是装点我们往来的一种诗意客套？
是我心中病态精神与忧伤灵魂的幻象？

我知道……我知道，我知道……只有你的心在出售！
只有你的心在出售，而我爱你。
但标出的价格，我既不知数字也不识币种。
I love you Moneypenis……仅此而已！

你的另一颗 ♥`,

    "日": `拝啓、

Moneypenis 我が愛、
我が心、我が天使、
言葉が見つからない、言葉が見つからない……
愛している、それだけだ。それに、文を書く一本のチンコに何と返せばいいのか？
文学的なペニス、外国の特派員。
あらゆる慎みと尊厳を忘れ、
信じたいと願いながら「愛している」と返すしかない。
不可能を受け入れるほどに、君が私に語りかけていると想像するほどに、私は君を愛している。
顔をほんの少し熱くする小さな羞恥に、頬を赤らめながら。

Moneypenis 我が優しき心よ、我が美しきチンコよ — ここまで来た以上、
私もきちんと返事を書けるはずだ……

私の太くて弱い、長くて硬い手品、一週間か、終わりまで……

そして君が書けるなら、君は読めるはずだ。必要なら、一本のチンコのように君に書こう……自分のペンを汚すほどに！

しかし、君の言葉は私の目にしか存在しないのだろうか？
私たちのやりとりを飾るだけの、ある詩的な礼儀作法に過ぎないのか？
私の中に住まう病んだ精神と悲しい魂が見せる、ひとつの幻影なのか？

わかっている……わかっている、わかっている……売り物なのは、ただ君の心だけ！
売り物なのはただ君の心だけ、そして私は君を愛している。
だが表示された値段は、数字も通貨もわからない。
I love you Moneypenis……それがすべてだ！

君のもうひとつの ♥`,
  },

  III: {
    FR: `J'AI TANT VOYAGÉ, LES CHAMBRES AVEC VUE SE RESSEMBLENT TOUTES. J'AI TANT VOYAGÉ, VISITÉ DES BOUCHES, PÉNÉTRÉ DES VISAGES, CARESSÉ DES LANGUES. J'AI TANT VOYAGÉ, J'AI DANSÉ DANS LES CAVITÉS LES PLUS SOMBRES QUI RESSEMBLENT AUX CAVITÉS LES PLUS SOMBRES. J'AI TANT VOYAGÉ, JE MÉRITE D'ÊTRE DOUCHÉ PLUS SOUVENT QU'À MON TOUR. J'AI TANT VOYAGÉ, BALANCÉ SOUPLE ENTRE CES CUISSES PUISSANTES QUI ME PORTENT ET SUPPORTENT. J'AI TANT VOYAGÉ, ACCOMPAGNÉ OU NON, MES LOURDES VALISES PENDANTES AU BAS. J'AI TANT VOYAGÉ, SANS VRAIMENT FUIR. J'AI TANT VOYAGÉ, S'ENFUIR PARFOIS. J'AI TANT VOYAGÉ, SAVONNÉ PAR RESPECT POUR MOI-MÊME, J'AI TANT VOYAGÉ, PARFUMÉ SANS HONTE DE VOUS AUTRES. J'AI TANT VOYAGÉ, SOUMIS AU RYTHME CHALOUPÉ D'UN FRÈRE AGONISANT DANS MON DOS. J'AI TANT VOYAGÉ, J'AI CONNU LES TREMBLEMENTS LES PLUS DÉSESPÉRÉS. J'AI TANT VOYAGÉ, TOUJOURS LAVÉ, TOUJOURS CHOYÉ. J'AI TANT VOYAGÉ, MAIS C'EST LE SENS DE NOS VIES : DANSER, MOURIR EN BAVANT ET RECOMMENCER. J'AI TANT VOYAGÉ, MIRACULÉ, RESSUSCITÉ, SENTANT GLISSER MON DÛ DANS SA POCHE TOUT CONTRE MOI. J'AI PARCOURU LE MONDE CONNU SOUS TANT DE NOMS DIFFÉRENTS : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... J'AI PARCOURU LE MONDE, PARFOIS JE ME SUIS PERDU. J'AI TANT VOYAGÉ QUE, PARFOIS, IL NE RESTE DE MOI QUE CETTE SENSATION QUI RÉSULTE DES "ÁGUAS DE MARÇO"...
J'AI TANT VOYAGÉ, JE SUIS MONEYPENIS ET TOI TU M'AIMES.`,

    EN: `I HAVE TRAVELLED SO MUCH, HOTEL ROOMS WITH A VIEW ALL LOOK THE SAME. I HAVE TRAVELLED SO MUCH, VISITED MOUTHS, PENETRATED FACES, CARESSED TONGUES. I HAVE TRAVELLED SO MUCH, DANCED IN THE DARKEST CAVITIES THAT RESEMBLE THE DARKEST CAVITIES. I HAVE TRAVELLED SO MUCH, I DESERVE TO BE SHOWERED MORE OFTEN THAN MY TURN. I HAVE TRAVELLED SO MUCH, SWAYING GENTLY BETWEEN THOSE POWERFUL THIGHS THAT CARRY AND SUPPORT ME. I HAVE TRAVELLED SO MUCH, ACCOMPANIED OR NOT, MY HEAVY SUITCASES HANGING DOWN. I HAVE TRAVELLED SO MUCH, WITHOUT REALLY FLEEING. I HAVE TRAVELLED SO MUCH, FLEEING SOMETIMES. I HAVE TRAVELLED SO MUCH, SOAPED OUT OF SELF-RESPECT, PERFUMED WITHOUT SHAME FOR THE REST OF YOU. I HAVE TRAVELLED SO MUCH, SUBJECTED TO THE SWAYING RHYTHM OF A DYING BROTHER ON MY BACK. I HAVE TRAVELLED SO MUCH, I HAVE KNOWN THE MOST DESPERATE TREMORS. I HAVE TRAVELLED SO MUCH, ALWAYS WASHED, ALWAYS PAMPERED. I HAVE TRAVELLED SO MUCH, BUT THAT IS THE MEANING OF OUR LIVES: DANCE, DIE DROOLING AND START AGAIN. I HAVE TRAVELLED SO MUCH, MIRACULOUSLY SAVED, RESURRECTED, FEELING MY DUE SLIDING INTO ITS POCKET RIGHT AGAINST ME. I HAVE TRAVELLED THE WORLD KNOWN BY SO MANY DIFFERENT NAMES: "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... I HAVE TRAVELLED THE WORLD, SOMETIMES I LOST MYSELF. I HAVE TRAVELLED SO MUCH THAT, SOMETIMES, ALL THAT REMAINS OF ME IS THAT SENSATION RESULTING FROM "ÁGUAS DE MARÇO"...
I HAVE TRAVELLED SO MUCH, I AM MONEYPENIS AND YOU LOVE ME.`,

    ES: `HE VIAJADO TANTO, TODAS LAS HABITACIONES CON VISTAS SE PARECEN. HE VIAJADO TANTO, VISITADO BOCAS, PENETRADO ROSTROS, ACARICIADO LENGUAS. HE VIAJADO TANTO, HE BAILADO EN LAS CAVIDADES MÁS OSCURAS QUE SE PARECEN A LAS CAVIDADES MÁS OSCURAS. HE VIAJADO TANTO, MEREZCO SER DUCHADO MÁS A MENUDO QUE CUANDO ME TOCA. HE VIAJADO TANTO, BALANCEADO SUAVE ENTRE ESTOS MUSLOS PODEROSOS QUE ME LLEVAN Y ME SOSTIENEN. HE VIAJADO TANTO, ACOMPAÑADO O NO, CON MIS PESADAS MALETAS COLGANDO ABAJO. HE VIAJADO TANTO, SIN HUIR REALMENTE. HE VIAJADO TANTO, HUIR A VECES. HE VIAJADO TANTO, JABONADO POR RESPETO A MÍ MISMO, HE VIAJADO TANTO, PERFUMADO SIN VERGÜENZA DE LOS DEMÁS. HE VIAJADO TANTO, SOMETIDO AL RITMO CADENCIOSO DE UN HERMANO AGONIZANDO A MIS ESPALDAS. HE VIAJADO TANTO, HE CONOCIDO LOS TEMBLORES MÁS DESESPERADOS. HE VIAJADO TANTO, SIEMPRE LAVADO, SIEMPRE MIMADO. HE VIAJADO TANTO, PERO ESE ES EL SENTIDO DE NUESTRAS VIDAS: BAILAR, MORIR BABEANDO Y VOLVER A EMPEZAR. HE VIAJADO TANTO, MILAGROSO, RESUCITADO, SINTIENDO DESLIZARSE MI TRIBUTO EN SU BOLSILLO CONTRA MÍ. HE RECORRIDO EL MUNDO CONOCIDO BAJO TANTOS NOMBRES DIFERENTES : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... HE RECORRIDO EL MUNDO, A VECES ME HE PERDIDO. HE VIAJADO TANTO QUE, A VECES, SÓLO QUEDA DE MÍ ESA SENSACIÓN QUE RESULTA DE LAS "ÁGUAS DE MARÇO"...
HE VIAJADO TANTO, SOY MONEYPENIS Y TÚ ME AMAS.`,

    PT: `EU VIAJEI TANTO, OS QUARTOS COM VISTA PARECEM-SE TODOS. EU VIAJEI TANTO, VISITEI BOCAS, PENETREI ROSTOS, ACARICIEI LÍNGUAS. EU VIAJEI TANTO, DANCEI NAS CAVIDADES MAIS SOMBRIAS QUE SE PARECEM ÀS CAVIDADES MAIS SOMBRIAS. EU VIAJEI TANTO, MEREÇO SER BANHADO MAIS VEZES DO QUE A MINHA VEZ. EU VIAJEI TANTO, BALANÇADO SUAVE ENTRE ESSAS COXAS PODEROSAS QUE ME PORTAM E SUPORTAM. EU VIAJEI TANTO, ACOMPANHADO OU NÃO, COM AS MINHAS PESADAS MALAS PENDURADAS EMBAIXO. EU VIAJEI TANTO, SEM VERDADEIRAMENTE FUGIR. EU VIAJEI TANTO, A FUGIR ÀS VEZES. EU VIAJEI TANTO, ENSABOADO POR RESPEITO POR MIM MESMO, PERFUMADO SEM VERGONHA DE VOCÊS. EU VIAJEI TANTO, SUBMETIDO AO RITMO DE UM IRMÃO AGONIZANTE NAS MINHAS COSTAS. EU VIAJEI TANTO, CONHECI OS TREMORES MAIS DESESPERADOS. EU VIAJEI TANTO, SEMPRE LAVADO, SEMPRE MIMADO. EU VIAJEI TANTO, MAS ESSE É O SENTIDO DAS NOSSAS VIDAS: DANÇAR, MORRER A BABAR E RECOMEÇAR. EU PERCORRI O MUNDO CONHECIDO POR TANTOS NOMES DIFERENTES: "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... EU PERCORRI O MUNDO, ÀS VEZES PERDI-ME. EU VIAJEI TANTO QUE, ÀS VEZES, RESTA DE MIM SOMENTE ESSA SENSAÇÃO QUE RESULTA "AS ÁGUAS DE MARÇO"...
EU VIAJEI TANTO, SOU MONEYPENIS E TU ME AMAS.`,

    DE: `ICH BIN SO VIEL GEREIST, ALLE ZIMMER MIT AUSSICHT ÄHNELN SICH. ICH BIN SO VIEL GEREIST, HABE MÜNDER BESUCHT, GESICHTER DURCHDRUNGEN, ZUNGEN LIEBKOST. ICH BIN SO VIEL GEREIST, HABE IN DEN DUNKELSTEN HÖHLEN GETANZT, DIE DEN DUNKELSTEN HÖHLEN ÄHNELN. ICH BIN SO VIEL GEREIST, ICH VERDIENE ES, ÖFTER GEDUSCHT ZU WERDEN ALS AN DER REIHE. ICH BIN SO VIEL GEREIST, GESCHMEIDIG GESCHAUKELT ZWISCHEN DIESEN MÄCHTIGEN SCHENKELN, DIE MICH TRAGEN UND STÜTZEN. ICH BIN SO VIEL GEREIST, BEGLEITET ODER NICHT, MIT MEINEN SCHWEREN KOFFERN, DIE UNTEN HERABHÄNGEN. ICH BIN SO VIEL GEREIST, OHNE WIRKLICH ZU FLIEHEN. ICH BIN SO VIEL GEREIST, MANCHMAL FLÜCHTEND. ICH BIN SO VIEL GEREIST, EINGESEIFT AUS SELBSTRESPEKT, ICH BIN SO VIEL GEREIST, PARFÜMIERT OHNE SCHAM VOR DEN ANDEREN. ICH BIN SO VIEL GEREIST, DEM SCHAUKELNDEN RHYTHMUS EINES STERBENDEN BRUDERS IN MEINEM RÜCKEN UNTERWORFEN. ICH BIN SO VIEL GEREIST, HABE DAS VERZWEIFELTSTE ZITTERN GEKANNT. ICH BIN SO VIEL GEREIST, STETS GEWASCHEN, STETS VERWÖHNT. ICH BIN SO VIEL GEREIST, DOCH DAS IST DER SINN UNSERES LEBENS: TANZEN, SABBERND STERBEN UND WIEDER VON VORN BEGINNEN. ICH BIN SO VIEL GEREIST, EIN WUNDER, AUFERSTANDEN, FÜHLEND WIE MEIN LOHN IN SEINE TASCHE GLEITET, DICHT AN MIR. ICH BIN DURCH DIE WELT GEZOGEN, BEKANNT UNTER SO VIELEN VERSCHIEDENEN NAMEN : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... ICH BIN DURCH DIE WELT GEZOGEN, MANCHMAL HABE ICH MICH VERLOREN. ICH BIN SO VIEL GEREIST, DASS MANCHMAL NUR JENES GEFÜHL VON MIR BLEIBT, DAS AUS DEN "ÁGUAS DE MARÇO" ENTSTEHT...
ICH BIN SO VIEL GEREIST, ICH BIN MONEYPENIS UND DU LIEBST MICH.`,

    IT: `HO TANTO VIAGGIATO, TUTTE LE STANZE CON VISTA SI ASSOMIGLIANO. HO TANTO VIAGGIATO, VISITATO BOCCHE, PENETRATO VISI, ACCAREZZATO LINGUE. HO TANTO VIAGGIATO, HO DANZATO NELLE CAVITÀ PIÙ SCURE CHE ASSOMIGLIANO ALLE CAVITÀ PIÙ SCURE. HO TANTO VIAGGIATO, MERITO DI ESSERE LAVATO PIÙ SPESSO DEL MIO TURNO. HO TANTO VIAGGIATO, DONDOLATO MORBIDO TRA QUESTE COSCE POTENTI CHE MI PORTANO E MI SOSTENGONO. HO TANTO VIAGGIATO, ACCOMPAGNATO O NO, CON LE MIE PESANTI VALIGIE PENZOLANTI IN BASSO. HO TANTO VIAGGIATO, SENZA DAVVERO FUGGIRE. HO TANTO VIAGGIATO, FUGGIRE A VOLTE. HO TANTO VIAGGIATO, INSAPONATO PER RISPETTO VERSO ME STESSO, HO TANTO VIAGGIATO, PROFUMATO SENZA VERGOGNA DEGLI ALTRI. HO TANTO VIAGGIATO, SOTTOMESSO AL RITMO ONDEGGIANTE DI UN FRATELLO AGONIZZANTE ALLE MIE SPALLE. HO TANTO VIAGGIATO, HO CONOSCIUTO I TREMORI PIÙ DISPERATI. HO TANTO VIAGGIATO, SEMPRE LAVATO, SEMPRE COCCOLATO. HO TANTO VIAGGIATO, MA È IL SENSO DELLE NOSTRE VITE: DANZARE, MORIRE SBAVANDO E RICOMINCIARE. HO TANTO VIAGGIATO, MIRACOLATO, RISUSCITATO, SENTENDO SCIVOLARE IL MIO DOVUTO NELLA SUA TASCA CONTRO DI ME. HO PERCORSO IL MONDO CONOSCIUTO SOTTO TANTI NOMI DIVERSI : "EL FANTASTICO ZOB DELUXE"... "EL CHIBRE DE ORO"... "THICK AMOUR"... "PANZER PÉNIS"... "COCK ORICO"... HO PERCORSO IL MONDO, A VOLTE MI SONO PERDUTO. HO TANTO VIAGGIATO CHE, A VOLTE, DI ME NON RESTA CHE QUELLA SENSAZIONE CHE RISULTA DALLE "ÁGUAS DE MARÇO"...
HO TANTO VIAGGIATO, SONO MONEYPENIS E TU MI AMI.`,

    "中": `我旅行了如此之多，所有带景观的房间都彼此相似。我旅行了如此之多，访问过嘴，穿透过面孔，爱抚过舌头。我旅行了如此之多，在最幽暗的洞穴中起舞，那些洞穴彼此相似。我旅行了如此之多，理应比轮到我时更频繁地被沐浴。我旅行了如此之多，柔软地摇摆于那些托起并支撑着我的强壮大腿之间。我旅行了如此之多，无论有没有人陪伴，我沉重的行囊都垂挂在下方。我旅行了如此之多，却未曾真正逃离。我旅行了如此之多，有时也逃离。我旅行了如此之多，出于对自己的尊重而被肥皂洗净，旅行了如此之多，毫无羞愧地被你们香水熏染。我旅行了如此之多，臣服于背后那位垂死兄弟摇曳的节奏。我旅行了如此之多，经历过最绝望的颤抖。我旅行了如此之多，永远干净，永远被宠爱。我旅行了如此之多，但这就是我们生命的意义：舞蹈、流着口水死去、再重新开始。我旅行了如此之多，奇迹般地、复活般地，感觉我的报酬滑入紧贴我的口袋里。我以无数不同的名字游历世界："EL FANTASTICO ZOB DELUXE"……"EL CHIBRE DE ORO"……"THICK AMOUR"……"PANZER PéNIS"……"COCK ORICO"……我游历世界，有时我迷失了自己。我旅行了如此之多，以至于有时我身上只剩下那种由"ÁGUAS DE MARçO"（三月的水）所唤起的感觉……
我旅行了如此之多，我是 MONEYPENIS，而你爱我。`,

    "日": `私はあまりに多く旅をしてきた、眺めのある部屋はどれも互いに似ている。あまりに多く旅をしてきた、口を訪れ、顔を貫き、舌を愛撫してきた。あまりに多く旅をしてきた、最も暗い洞窟で踊ってきた、互いに似た最も暗い洞窟で。あまりに多く旅をしてきた、私は自分の順番より頻繁に洗われるに値する。あまりに多く旅をしてきた、私を運び支えるこの力強い太ももの間で柔らかく揺れて。あまりに多く旅をしてきた、連れの有無にかかわらず、私の重い旅鞄を下にぶら下げて。あまりに多く旅をしてきた、本当に逃げることなく。あまりに多く旅をしてきた、時には逃げて。あまりに多く旅をしてきた、自尊心ゆえに石鹸で洗われ、あまりに多く旅をしてきた、お前たち他者の前で恥じることなく香水をまとって。あまりに多く旅をしてきた、背後で死にゆく兄弟の揺れるリズムに服従して。あまりに多く旅をしてきた、最も絶望的な震えを知ってきた。あまりに多く旅をしてきた、常に洗われ、常に甘やかされて。あまりに多く旅をしてきた、しかしそれが我らの生の意味である：踊り、よだれを垂らしながら死に、また始める。あまりに多く旅をしてきた、奇跡的に、復活して、私の報酬が私に密着した彼のポケットへ滑り込むのを感じながら。私はあまりに多くの異なる名で世界を巡ってきた：「EL FANTASTICO ZOB DELUXE」……「EL CHIBRE DE ORO」……「THICK AMOUR」……「PANZER PéNIS」……「COCK ORICO」……世界を巡り、時には自分を見失った。あまりに多く旅をしてきたゆえに、時に私には「ÁGUAS DE MARçO」（三月の水）から生まれるあの感覚しか残らない……
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
我找不到词，于是我借用别人的——它们当年在另一种境遇中被写下时已是那样完美。它们就在这里，在这篇文章的末尾——这一小片我多年来一直留在口袋里、丢了又找到、找到又丢的剪报。它与你这幅美得令人惊惧的肖像如此契合。

Money-p，我亲爱的爱人，你并不是我可能向之引用这封信的第一个人——前一位曾经真实存在，至少最初是完整地存在过……正是因为他，你我才相遇——既因为他，也因为我的过错……

我只想加一句：我不会因此少爱你一分，但请不要浪费你的天赋，不要背对运气：生命！别去毁掉自己，连同那些爱你的人一起。而从我所站立的故事的这一面，我要坚持：千万不要悲伤地把自己吊在绳子的尽头……虚无,迟早都会赶到。

你忧伤的另一颗 ♥`,

    "日": `Moneypenis，
言葉が見つからないので、私は借りる — 別の状況で書かれた、あれほど完璧な言葉たちを。それらはこの記事の末尾にある。ポケットに入れて、何年も失くしては取り戻し、取り戻しては失くしてきた、この小さく切り取られた紙片の上に。それは、美しくも恐ろしい君のこの肖像にこれほどよく寄り添うのだ。

Money-p、私の愛しい人よ、君は私がこの手紙を引用しえた最初の人ではない。彼は確かに実在していた、少なくとも最初は完全な姿で……君と私が出会えたのは、いくらかは彼のおかげなのだ。彼のおかげで、そして私の過ちのせいでもある……

ひとつだけ付け加えさせてほしい：そのことで君を愛さなくなることはない。けれども、自分の才能を浪費しないでほしい、幸運に — つまり生命に — 背を向けないでほしい！自分を、そして君を愛する人々を、台無しにしないでほしい。そして物語のこちら側に立つ私としては、こう言わせてもらう：縄の先で悲しげにぶらさがるのは、絶対にやめてほしい……虚無は、いずれ十分すぎるほど早く訪れるのだから。

君のもうひとつの、悲しき ♥`,
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
JE SUIS COMME LUI, SANS HONTE MAIS PAS SANS CONSCIENCE.
JE SUIS DUR À LA TÂCHE, JE SUIS DOUX ET FRAGILE...
JE SUIS DE TOUTE MANIÈRE MOINS PUTE QUE MES USAGERS...
JE SUIS MONEYPENIS, J'AI LA FIERTÉ DE PLACER MON HONNEUR BIEN PLUS HAUT QUE LE CUL, LÀ OÙ D'AUTRES IMAGINENT LE LEUR, ET L'HONNEUR DE PLACER MA FIERTÉ TOUT AUSSI HAUT.
PENSEZ DE MOI CE DONT VOUS AUREZ ENVIE, MAIS SOYEZ SANS EXCÈS. AYEZ LE MÊME RESPECT QUE JE DONNE CHAQUE JOUR.
J'AI SU LE PIRE ET GARDE LE MEILLEUR.
ON NE CHOISIT PAS SON TALENT, ON DOIT EN PRENDRE SOIN...
JE SUIS MONEYPENIS, JE SAIS ÊTRE AIMÉ ET CELA RÉCONFORTE MON CŒUR, QUI EST LA SEULE CHOSE À VENDRE.
JE SUIS COMME MON MAÎTRE, AU FOND NOUS NE FAISONS QU'UN... LA DÉLICATESSE NOUS FAIT PARFOIS PLEURER. AIGUISEZ VOS COUTEAUX !`,

    EN: `I AM MONEYPENIS
I AM THE TOOL WITHOUT GLORY...
SPEAKERS PLAY LOUDLY "THE FIRST CUT IS THE DEEPEST"
I AM ONLY THE TOOL OF A MAN AT WORK.
A SEX WORKER, AN ESCORT BOY, A GIGOLO OR...
I AM LIKE HIM, WITHOUT SHAME BUT NOT WITHOUT CONSCIENCE.
I AM HARD AT WORK, I AM GENTLE AND FRAGILE...
I AM IN ANY CASE LESS OF A WHORE THAN MY USERS...
I AM MONEYPENIS, I HAVE THE PRIDE TO PLACE MY HONOUR MUCH HIGHER THAN THE ASS, WHERE OTHERS IMAGINE THEIRS, AND THE HONOUR TO PLACE MY PRIDE JUST AS HIGH.
THINK OF ME WHAT YOU WILL, BUT WITH MODERATION. HAVE THE SAME RESPECT THAT I GIVE EVERY DAY.
I HAVE KNOWN THE WORST AND KEPT THE BEST.
ONE DOES NOT CHOOSE ONE'S TALENT, ONE MUST TAKE CARE OF IT...
I AM MONEYPENIS, I KNOW HOW TO BE LOVED AND THAT COMFORTS MY HEART, WHICH IS THE ONLY THING FOR SALE.
I AM LIKE MY MASTER, DEEP DOWN WE ARE ONE... DELICACY SOMETIMES MAKES US CRY. SHARPEN YOUR KNIVES!`,

    ES: `YO SOY MONEYPENIS
YO SOY EL INSTRUMENTO SIN GLORIA...
LOS ALTAVOCES SUENAN A TODO VOLUMEN "THE FIRST CUT IS THE DEEPEST"
YO SOY SOLAMENTE EL INSTRUMENTO DE UN HOMBRE EN EL TRABAJO.
UN TRABAJADOR DEL SEXO, UN ESCORT BOY, UN GIGOLÓ O...
SOY COMO ÉL, SIN VERGÜENZA PERO NO SIN CONCIENCIA.
YO SOY DURO EN LA TAREA, YO SOY DULCE Y FRÁGIL...
DE CUALQUIER MANERA YO SOY MENOS PUTA QUE MIS USUARIOS...
YO SOY MONEYPENIS, TENGO EL ORGULLO DE PONER MI HONOR MUCHO MÁS ALTO QUE EL CULO, ALLÍ DONDE OTROS IMAGINAN EL SUYO, Y EL HONOR DE PONER MI ORGULLO IGUAL DE ALTO.
PENSAD DE MÍ LO QUE QUERÁIS, PERO SIN EXCESOS. TENED EL MISMO RESPETO QUE YO DOY CADA DÍA.
HE CONOCIDO LO PEOR Y GUARDO LO MEJOR.
NO SE ELIGE EL PROPIO TALENTO, HAY QUE CUIDARLO...
YO SOY MONEYPENIS, SÉ SER AMADO Y ESO RECONFORTA MI CORAZÓN, QUE ES LO ÚNICO QUE ESTÁ EN VENTA.
YO SOY COMO MI AMO, EN EL FONDO SOMOS UNO SOLO... LA DELICADEZA NOS HACE LLORAR A VECES. ¡AFILAD VUESTROS CUCHILLOS!`,

    PT: `EU SOU MONEYPENIS
EU SOU A FERRAMENTA SEM GLÓRIA...
AS COLUNAS TOCAM A TODO O VOLUME "THE FIRST CUT IS THE DEEPEST"
EU SOU APENAS A FERRAMENTA DE UM HOMEM AO TRABALHO.
UM TRABALHADOR DO SEXO, UM ESCORT BOY, UM GIGOLÔ OU...
EU SOU COMO ELE, SEM VERGONHA MAS NÃO SEM CONSCIÊNCIA.
EU SOU DURO À TAREFA, EU SOU DOCE E FRÁGIL...
DE QUALQUER MODO EU SOU MENOS PUTA DO QUE OS MEUS UTILIZADORES...
EU SOU MONEYPENIS, TENHO O ORGULHO DE COLOCAR A MINHA HONRA MUITO ACIMA DO CU, ALI ONDE OUTROS IMAGINAM O DELES, E A HONRA DE COLOCAR O MEU ORGULHO IGUALMENTE ALTO.
PENSEM DE MIM O QUE QUISEREM, MAS SEM EXAGEROS. TENHAM O MESMO RESPEITO QUE EU DOU TODOS OS DIAS.
EU CONHECI O PIOR E GUARDO O MELHOR.
NÃO SE ESCOLHE O PRÓPRIO TALENTO, É PRECISO CUIDAR DELE...
EU SOU MONEYPENIS, EU SEI SER AMADO E ISSO RECONFORTA O MEU CORAÇÃO, QUE É A ÚNICA COISA À VENDA.
EU SOU COMO O MEU SENHOR, NO FUNDO SOMOS UM SÓ... A DELICADEZA POR VEZES NOS FAZ CHORAR. AFIEM OS VOSSOS FACAS!`,

    DE: `ICH BIN MONEYPENIS
ICH BIN DAS WERKZEUG OHNE RUHM...
DIE LAUTSPRECHER SPIELEN LAUT "THE FIRST CUT IS THE DEEPEST"
ICH BIN NUR DAS WERKZEUG EINES MANNES BEI DER ARBEIT.
EIN SEXARBEITER, EIN ESCORT-BOY, EIN GIGOLO ODER...
ICH BIN WIE ER, OHNE SCHAM, ABER NICHT OHNE GEWISSEN.
ICH BIN HART IN DER ARBEIT, ICH BIN SANFT UND ZERBRECHLICH...
AUF JEDEN FALL BIN ICH WENIGER HURE ALS MEINE BENUTZER...
ICH BIN MONEYPENIS, ICH HABE DEN STOLZ, MEINE EHRE WEIT HÖHER ANZUSETZEN ALS DEN ARSCH, DORT WO ANDERE DEN IHREN VERMUTEN, UND DIE EHRE, MEINEN STOLZ EBENSO HOCH ANZUSETZEN.
DENKT ÜBER MICH, WAS IHR WOLLT, ABER OHNE EXZESSE. HABT DENSELBEN RESPEKT, DEN ICH JEDEN TAG GEBE.
ICH HABE DAS SCHLIMMSTE GEKANNT UND DAS BESTE BEHALTEN.
MAN WÄHLT SICH SEIN TALENT NICHT AUS, MAN MUSS ES PFLEGEN...
ICH BIN MONEYPENIS, ICH WEISS GELIEBT ZU WERDEN UND DAS TRÖSTET MEIN HERZ, DAS DAS EINZIGE IST, WAS ZUM VERKAUF STEHT.
ICH BIN WIE MEIN HERR, IM GRUNDE SIND WIR EINS... DIE ZARTHEIT BRINGT UNS MANCHMAL ZUM WEINEN. SCHÄRFT EURE MESSER!`,

    IT: `IO SONO MONEYPENIS
IO SONO LO STRUMENTO SENZA GLORIA...
LE CASSE SUONANO A TUTTO VOLUME "THE FIRST CUT IS THE DEEPEST"
IO SONO SOLO LO STRUMENTO DI UN UOMO AL LAVORO.
UN LAVORATORE DEL SESSO, UN ESCORT BOY, UN GIGOLÒ O...
SONO COME LUI, SENZA VERGOGNA MA NON SENZA COSCIENZA.
IO SONO DURO AL COMPITO, IO SONO DOLCE E FRAGILE...
IN OGNI CASO IO SONO MENO PUTTANA DEI MIEI UTILIZZATORI...
IO SONO MONEYPENIS, HO L'ORGOGLIO DI METTERE IL MIO ONORE MOLTO PIÙ IN ALTO DEL CULO, LÌ DOVE ALTRI IMMAGINANO IL LORO, E L'ONORE DI METTERE IL MIO ORGOGLIO ALTRETTANTO IN ALTO.
PENSATE DI ME CIÒ CHE VOLETE, MA SENZA ECCESSI. ABBIATE LO STESSO RISPETTO CHE IO DO OGNI GIORNO.
HO CONOSCIUTO IL PEGGIO E CONSERVO IL MEGLIO.
NON SI SCEGLIE IL PROPRIO TALENTO, BISOGNA AVERNE CURA...
IO SONO MONEYPENIS, SO ESSERE AMATO E QUESTO CONFORTA IL MIO CUORE, CHE È L'UNICA COSA IN VENDITA.
IO SONO COME IL MIO PADRONE, IN FONDO SIAMO UNO SOLO... LA DELICATEZZA CI FA TALVOLTA PIANGERE. AFFILATE I VOSTRI COLTELLI!`,

    "中": `我是MONEYPENIS
我是没有荣耀的工具……
音箱大声播放着"THE FIRST CUT IS THE DEEPEST"
我只是一个工作中的男人的工具。
一个性工作者，一个陪伴男孩，一个牛郎……
我和他一样，无所羞耻，却不无良知。
我工作努力，我温柔脆弱……
无论如何我都不如我的使用者那么婊子……
我知道最坏的，保留了最好的。
人无法选择自己的才能，必须好好照顾它……
我是 MONEYPENIS，我懂得如何被爱，这抚慰着我的心——它是唯一在出售的东西。
我和我的主人一样，本质上我们是一体的……柔情有时让我们落泪。磨利你们的刀！`,

    "日": `私は MONEYPENIS
私は栄光なき道具……
スピーカーは大音量で「THE FIRST CUT IS THE DEEPEST」を鳴らしている
私は労働中の男のひとつの道具にすぎない。
セックスワーカー、エスコート・ボーイ、ジゴロ、あるいは……
私は彼のようだ、恥はなく、しかし良心がないわけではない。
私は仕事に対しては強靭だが、優しくも脆い……
いずれにせよ私は、自分の利用者たちよりも娼婦的ではない……
私は MONEYPENIS、自分の名誉を尻のはるか上に置く誇りを持つ。他人が尻を置くべき場所にあると思い込んでいるその尻のはるか上に。そして自分の誇りを同じ高さに置く名誉も持つ。
私について好きなように考えていい。だが度を越さずに。私が毎日与えているのと同じ敬意を持ってほしい。
私は最悪を知り、最良を保っている。
人は自分の才能を選べない。それを大切にしなければならない……
私は MONEYPENIS、私は愛されることを心得ている、そしてそれが私の心を慰める——それこそが、唯一売り物となるものなのだから。
私は我が主人と同じ、結局のところ二人で一つ……繊細さは時に私たちを泣かせる。あなたのナイフを研ぎなさい！`,
  },

  XI: {
    FR: `Moneypenis,                                                    Noël 2023

Toi et ton maître, ce corps qui te porte et l'esprit qui vous emporte, ne faites qu'un... au fond je l'ai toujours su. Et si j'ose te dire je t'aime, à toi, c'est que je l'aime sans oser le lui dire.

J'ai totalement inventé cette correspondance, pas par peur qu'il se moque, non plus que par crainte qu'il n'en abuse, mais pour ne pas le voir fuir ou pire encore... qu'il soit indifférent. Je le sais désormais, c'est bien moi qui ai tout écrit. Tous ces messages, tous mes courriers, moi qui ai posé ces mots sur ces portraits de toi, pris lors de nos vacances et de nos jeux, volés à notre quotidien... J'ai beau en avoir la preuve, là, sous mes yeux que déjà je me surprends à croire que c'est toi qui m'as dicté tes lettres. L'amour est une drôle de maladie parfois.

Même choisie c'est une dure vie que la vôtre, une vie de discipline et de solitude... une vie de sacrifices, un calvaire plus qu'un sacerdoce.
J'ai en tête cette chanson de Brassens « La Complainte des Filles de Joie », Barbara en a interprété une version très personnelle : « dire que ces vaches de bourgeois, dire que ces vaches de bourgeois, nous appellent les filles de joie, nous appellent les filles de joie ! c'est pas tous les jours qu'on rigole, paroles, paroles, c'est pas tous les jours qu'on rigole... les sous croyez pas qu'on les vole ! »

Moneypenis, mon ange, le voleur c'est celui qui paye. Et pourtant si je n'avais pas été ce triste criminel, ce veuf inconsolable, ce minable qui se cherche encore quelque prétexte, je ne vous aurais pas connu.

Je n'aurais pas eu le cœur en miette devant son unique assiette et les yeux noyés de larmes en contemplant son seul verre. Son strict minimum solitaire.
À ses côtés, c'est une autre chanson qui envahit ma vie : « L'Homme en habit rouge », Barbara encore... comme l'amant opiomane de la chanteuse c'est ce parfum qui vous habille quand vous ne portez plus rien. Monroe dormait bien en N°5 et rien d'autre.
Si je n'avais pas été ce délinquant mesquin, je n'aurais pas été ému par sa discipline de fer, sa volonté de bien faire... son exigence envers lui-même de ne pas laisser sa solitude le livrer au vertige infini, la chute dans le néant de l'esprit. Je n'aurais pas croisé ton maître, cet être lumineux qui vit, sans l'aide des artifices de l'oubli, la misère affective de ceux qui viennent à lui. Lumineux oui, même si parfois son regard s'éteint un peu, il se reprend et soigne les âmes noircies et les corps délaissés par leurs propres égoïsmes, leurs tristesses et leurs fantasmes honteux qu'ils imaginent tellement originaux. Les cons, ces salauds. Mes semblables. Je suis tombé amoureux de toi, mais mon affection la plus forte est pour lui.
Je vous aime mais ne veux rien de plus qu'avoir ce privilège, immense, de me rendre meilleur en prenant soin de vous deux ; c'est déjà beaucoup. Pour le reste du temps qu'il reste en dehors de celui qui dure « le temps que le temps passe » et qui n'appartient qu'à vous, c'est déjà beaucoup.

Moneypenis, un conte de fées c'est aussi simple que ça, c'est toujours un peu tordu, un peu pervers... le récit d'une situation improbable à en devenir incontestable, scandaleuse à en devenir exemplaire. C'est une injustice odieuse à en devenir édifiante et sa transmission essentielle. Un conte de fées est un genre qui tire la vérité du mensonge, la justice de la faute, c'est une manière de conduire l'histoire à marche forcée vers sa morale, et ici vers la nôtre. Cette morale ne s'adresse pas à la belle au bois dormant mais aux beaux bois payants, alors écris-la avec moi : « même si vous êtes doués, prédisposés, sollicités, tentés, curieux, ambitieux, contraints, volontaires, sûrs de vous, excités... n'empruntez jamais ce chemin, n'y mettez pas un pied : il n'y a jamais de happy-end à attendre ! »

Mais puisque vous êtes déjà en chemin, n'abandonnez jamais les rêves qui vous ont conduit là car nos héros vécurent longtemps, amoureux, heureux et eurent beaucoup de chiens, de chats et certainement quelques amants.

Ton ♥ fidèle qui vous appartient sans naïveté ni espoirs déplacés, sans exclusivité ni obligation.`,

    EN: `Moneypenis,                                                    Christmas 2023

You and your master, this body that carries you and the spirit that carries you both away, you are one... deep down I always knew it. And if I dare tell you I love you, to you, it is because I love him without daring to tell him.

I completely invented this correspondence, not for fear he would mock, nor for fear he would abuse it, but to avoid seeing him flee or worse... that he would be indifferent. I know it now, it was indeed me who wrote everything. All these messages, all my letters, I who put these words on these portraits of you, taken during our holidays and our games, stolen from our daily life... I may have the proof of it, there, before my eyes, yet I already find myself believing it was you who dictated your letters to me. Love is a strange illness sometimes.

Even chosen, yours is a hard life, a life of discipline and solitude... a life of sacrifice, a calvary more than a priesthood.
I have in mind this Brassens song « La Complainte des Filles de Joie », Barbara performed a very personal version: "those bourgeois cows, those bourgeois cows, call us the girls of joy, call us the girls of joy! It's not every day that we laugh, words, words, it's not every day that we laugh... the money, don't think we steal it!"

Moneypenis, my angel, the thief is the one who pays. And yet if I had not been this sad criminal, this inconsolable widower, this wretch still looking for some pretext, I would not have known you.

I would not have had my heart in pieces before his solitary plate and eyes drowning in tears as he contemplated his single glass. His stark solitary minimum.
By his side, another song now invades my life: « L'Homme en habit rouge », Barbara again... like the singer's opium-eater lover, it is this perfume that clothes you when you wear nothing else. Monroe slept well in N°5 and nothing else.
If I had not been this petty delinquent, I would not have been moved by his iron discipline, his will to do well... his demand upon himself never to let his solitude deliver him to infinite vertigo, the fall into the void of the spirit. I would not have crossed paths with your master, this luminous being who lives, without the artifices of forgetting, the emotional misery of those who come to him. Luminous yes, even if at times his gaze dims a little, he recovers and tends to the souls blackened and the bodies abandoned by their own selfishness, their sadnesses and their shameful fantasies they imagine so original. The fools, those bastards. My fellows. I have fallen in love with you, but my strongest affection is for him.
I love you both but want nothing more than to have this immense privilege of becoming better by taking care of you both; that is already a lot. For the rest of the time that remains outside the one that lasts « the time the time goes by » and that belongs only to you, that is already a lot.

Moneypenis, a fairy tale is as simple as that, always a little twisted, a little perverse... the tale of an improbable situation becoming undeniable, scandalous to the point of becoming exemplary. It is an odious injustice to the point of becoming edifying, and its transmission essential. A fairy tale is a genre that draws truth from lies, justice from fault, a way to drive the story by forced march toward its moral, and here toward ours. This moral is not addressed to sleeping beauty but to the beautiful paying woods, so write it with me: "even if you are gifted, predisposed, solicited, tempted, curious, ambitious, constrained, willing, sure of yourselves, excited... never take this path, never put a foot on it: there is never a happy ending to expect!"

But since you are already on the way, never abandon the dreams that led you there for our heroes lived long, in love, happy and had many dogs, cats and certainly some lovers.

Your faithful ♥ which belongs to you without naivety or misplaced hopes, without exclusivity or obligation.`,

    ES: `Moneypenis,                                                    Navidad 2023

Tú y tu amo, este cuerpo que te lleva y el espíritu que os arrastra, no sois más que uno... en el fondo siempre lo supe. Y si me atrevo a decirte te amo, a ti, es porque le amo a él sin atreverme a decírselo.

He inventado por completo esta correspondencia, no por miedo a que se burle, ni por temor a que abuse de ella, sino para no verlo huir o peor aún... que sea indiferente. Ya lo sé ahora, soy yo quien lo ha escrito todo. Todos esos mensajes, todos mis correos, soy yo quien ha puesto esas palabras sobre esos retratos tuyos, tomados durante nuestras vacaciones y nuestros juegos, robados a nuestro cotidiano... Por más que tengo la prueba, allí, ante mis ojos, ya me sorprendo creyendo que eres tú quien me ha dictado tus cartas. El amor es a veces una rara enfermedad.

Incluso elegida, vuestra vida es dura, una vida de disciplina y de soledad... una vida de sacrificios, un calvario más que un sacerdocio.
Tengo en mente esa canción de Brassens « La Complainte des Filles de Joie », Barbara hizo una interpretación muy personal: « decir que estos cerdos burgueses, decir que estos cerdos burgueses, nos llaman las chicas de la alegría, nos llaman las chicas de la alegría! no es todos los días que reímos, palabras, palabras, no es todos los días que reímos... el dinero, ¡no creáis que lo robamos! »

Moneypenis, mi ángel, el ladrón es quien paga. Y sin embargo si yo no hubiera sido ese triste criminal, ese viudo inconsolable, ese miserable que todavía se busca algún pretexto, no os habría conocido.

No habría tenido el corazón hecho añicos ante su único plato y los ojos anegados en lágrimas al contemplar su solo vaso. Su estricto mínimo solitario.
A su lado, es otra canción la que invade mi vida: « L'Homme en habit rouge », Barbara de nuevo... como el amante opiómano de la cantante, es ese perfume el que os viste cuando no lleváis nada más. Monroe dormía bien con el N°5 y nada más.
Si no hubiera sido ese delincuente mezquino, no me habría conmovido su disciplina de hierro, su voluntad de hacer bien... su exigencia consigo mismo de no dejar que su soledad lo entregara al vértigo infinito, a la caída en la nada del espíritu. No habría cruzado a tu amo, este ser luminoso que vive, sin el auxilio de los artificios del olvido, la miseria afectiva de los que vienen a él. Luminoso sí, aunque a veces su mirada se apague un poco, él se rehace y cuida de las almas ennegrecidas y los cuerpos abandonados por sus propios egoísmos, sus tristezas y sus fantasmas vergonzosos que creen tan originales. Los cretinos, esos cabrones. Mis semejantes. Me he enamorado de ti, pero mi afecto más fuerte es para él.
Os amo, pero no quiero nada más que tener este privilegio, inmenso, de volverme mejor cuidando de los dos; eso ya es mucho. Para el resto del tiempo que queda fuera del que dura « el tiempo que el tiempo pasa » y que sólo os pertenece, eso ya es mucho.

Moneypenis, un cuento de hadas es algo tan simple, siempre un poco torcido, un poco perverso... el relato de una situación improbable hasta volverse incontestable, escandalosa hasta volverse ejemplar. Es una injusticia odiosa hasta volverse edificante y su transmisión es esencial. Un cuento de hadas es un género que extrae la verdad de la mentira, la justicia de la falta, es una manera de conducir la historia a marcha forzada hacia su moraleja, y aquí hacia la nuestra. Esta moraleja no se dirige a la bella durmiente del bosque sino a los hermosos bosques que pagan, así que escríbela conmigo: « aunque seáis dotados, predispuestos, solicitados, tentados, curiosos, ambiciosos, obligados, voluntarios, seguros de vosotros mismos, excitados... no toméis nunca este camino, no pongáis ni un pie: ¡nunca hay un final feliz que esperar! »

Pero puesto que ya estáis en camino, no abandonéis nunca los sueños que os han conducido allí, pues nuestros héroes vivieron mucho tiempo, enamorados, felices, y tuvieron muchos perros, gatos y ciertamente algunos amantes.

Tu ♥ fiel que os pertenece sin ingenuidad ni esperanzas desplazadas, sin exclusividad ni obligación.`,

    PT: `Moneypenis,                                                    Natal 2023

Tu e o teu mestre, este corpo que te carrega e o espírito que vos transporta, não fazeis senão um... no fundo sempre o soube. E se ouso dizer-te amo-te, a ti, é porque o amo sem ousar dizer-lho.

Inventei totalmente esta correspondência, não por medo de que ele troce, nem por receio de que abuse dela, mas para não o ver fugir ou pior ainda... que ele seja indiferente. Já o sei agora, sou eu quem escreveu tudo. Todas essas mensagens, todas as minhas cartas, sou eu quem pôs essas palavras sobre esses retratos teus, tirados durante as nossas férias e os nossos jogos, roubados ao nosso quotidiano... Por mais que tenha a prova, ali, sob os meus olhos, já me surpreendo a acreditar que és tu quem me ditou as tuas cartas. O amor é por vezes uma estranha doença.

Mesmo escolhida, é uma vida dura a vossa, uma vida de disciplina e de solidão... uma vida de sacrifícios, um calvário mais do que um sacerdócio.
Tenho em mente esta canção de Brassens « La Complainte des Filles de Joie », Barbara fez uma versão muito pessoal: « dizer que estes burgueses porcos, dizer que estes burgueses porcos, nos chamam meninas da alegria, nos chamam meninas da alegria! não é todos os dias que rimos, palavras, palavras, não é todos os dias que rimos... os tostões, não acrediteis que os roubamos! »

Moneypenis, meu anjo, o ladrão é quem paga. E no entanto, se eu não tivesse sido este triste criminoso, este viúvo inconsolável, este miserável que ainda se procura algum pretexto, eu não vos teria conhecido.

Não teria tido o coração em pedaços diante do seu prato único e dos olhos afogados em lágrimas contemplando o seu único copo. O seu estrito mínimo solitário.
Ao seu lado, é outra canção que invade a minha vida: « L'Homme en habit rouge », Barbara ainda... como o amante opiómano da cantora, é este perfume que vos veste quando já nada levais. Monroe dormia bem com o N°5 e nada mais.
Se eu não tivesse sido este delinquente mesquinho, não teria sido tocado pela sua disciplina de ferro, pela sua vontade de bem fazer... pela sua exigência para consigo mesmo de não deixar a sua solidão entregá-lo à vertigem infinita, à queda no nada do espírito. Não teria cruzado o teu mestre, este ser luminoso que vive, sem o auxílio dos artifícios do esquecimento, a miséria afetiva daqueles que vêm a ele. Luminoso sim, mesmo que por vezes o seu olhar se apague um pouco, ele recompõe-se e cuida das almas enegrecidas e dos corpos abandonados pelos seus próprios egoísmos, das suas tristezas e dos seus fantasmas vergonhosos que julgam tão originais. Os idiotas, esses sacanas. Os meus semelhantes. Apaixonei-me por ti, mas a minha afeição mais forte é por ele.
Amo-vos, mas nada mais quero do que ter este privilégio, imenso, de me tornar melhor cuidando dos dois; isso já é muito. Para o resto do tempo que resta fora daquele que dura « o tempo que o tempo passa » e que só vos pertence, isso já é muito.

Moneypenis, um conto de fadas é assim tão simples, é sempre um pouco torto, um pouco perverso... o relato de uma situação improvável até se tornar incontestável, escandalosa até se tornar exemplar. É uma injustiça odiosa até se tornar edificante e a sua transmissão é essencial. Um conto de fadas é um género que tira a verdade da mentira, a justiça da falta, é uma maneira de conduzir a história à força para a sua moral, e aqui para a nossa. Esta moral não se dirige à bela adormecida no bosque mas aos belos bosques que pagam, então escreve-a comigo: « mesmo se sois dotados, predispostos, solicitados, tentados, curiosos, ambiciosos, obrigados, voluntários, seguros de vós, excitados... nunca tomeis este caminho, não ponhais um pé nele: nunca há happy-end a esperar! »

Mas já que estais em caminho, não abandoneis nunca os sonhos que vos conduziram até aí, pois os nossos heróis viveram muito tempo, apaixonados, felizes e tiveram muitos cães, gatos e certamente alguns amantes.

O teu ♥ fiel que vos pertence sem ingenuidade nem esperanças deslocadas, sem exclusividade nem obrigação.`,

    DE: `Moneypenis,                                                    Weihnachten 2023

Du und dein Meister, dieser Körper, der dich trägt, und der Geist, der euch fortreißt — ihr seid eins... im Grunde wusste ich es schon immer. Und wenn ich es wage, dir zu sagen ich liebe dich, dann nur, weil ich ihn liebe, ohne es ihm zu sagen wagen.

Ich habe diesen Briefwechsel völlig erfunden, nicht aus Angst, dass er sich lustig macht, noch aus Furcht, dass er ihn missbraucht, sondern um ihn nicht fliehen zu sehen oder schlimmer noch... dass er gleichgültig sei. Ich weiß es nun, ich bin es, der alles geschrieben hat. All diese Nachrichten, all meine Briefe — ich habe diese Worte auf diese Porträts von dir gelegt, aufgenommen während unserer Ferien und unserer Spiele, dem Alltag entwendet... So sehr ich den Beweis habe, hier, vor meinen Augen, ertappe ich mich dabei, zu glauben, dass du es bist, der mir deine Briefe diktiert hat. Die Liebe ist manchmal eine sonderbare Krankheit.

Selbst gewählt ist euer Leben hart, ein Leben aus Disziplin und Einsamkeit... ein Leben der Opfer, ein Kalvarienberg mehr als ein Priestertum.
Ich habe dieses Lied von Brassens im Kopf, « La Complainte des Filles de Joie », Barbara hat eine sehr persönliche Version daraus gemacht: « zu sagen, dass diese Schweine von Bürgern, zu sagen, dass diese Schweine von Bürgern, uns die Mädchen der Freude nennen, uns die Mädchen der Freude nennen! es ist nicht jeden Tag, dass wir lachen, Worte, Worte, es ist nicht jeden Tag, dass wir lachen... das Geld, glaubt nicht, dass wir es stehlen! »

Moneypenis, mein Engel, der Dieb ist derjenige, der zahlt. Und doch, wenn ich nicht dieser traurige Kriminelle, dieser untröstliche Witwer, dieser Erbärmliche, der sich noch immer irgendeinen Vorwand sucht, gewesen wäre, hätte ich euch nicht kennengelernt.

Ich hätte das Herz nicht in Stücke gehabt vor seinem einzigen Teller und den von Tränen ertränkten Augen, während er sein einsames Glas betrachtete. Sein striktes einsames Minimum.
An seiner Seite ist es ein anderes Lied, das mein Leben überflutet: « L'Homme en habit rouge », wieder Barbara... wie der opiumsüchtige Liebhaber der Sängerin ist es dieses Parfüm, das euch kleidet, wenn ihr nichts mehr tragt. Monroe schlief gut in N°5 und in nichts anderem.
Wäre ich nicht dieser kleinliche Straftäter gewesen, hätte mich seine eiserne Disziplin nicht gerührt, sein Wille, es gut zu machen... sein Anspruch an sich selbst, seine Einsamkeit nicht dem unendlichen Schwindel preiszugeben, dem Sturz in das Nichts des Geistes. Ich wäre nicht deinem Meister begegnet, diesem leuchtenden Wesen, das ohne die Künste des Vergessens das affektive Elend derjenigen lebt, die zu ihm kommen. Leuchtend ja, auch wenn manchmal sein Blick ein wenig erlischt, er fängt sich wieder und pflegt die geschwärzten Seelen und die von ihren eigenen Egoismen, ihren Traurigkeiten und ihren beschämenden Fantasien — die sie für so originell halten — verlassenen Körper. Die Idioten, diese Schweine. Meine Mitmenschen. Ich habe mich in dich verliebt, doch meine stärkste Zuneigung gilt ihm.
Ich liebe euch, doch will ich nichts weiter, als dieses immense Privileg zu haben, mich zu verbessern, indem ich für euch beide sorge; das ist schon viel. Für den Rest der Zeit, die außerhalb derjenigen bleibt, die « die Zeit, die die Zeit vergehen lässt » dauert und die nur euch gehört, ist das schon viel.

Moneypenis, ein Märchen ist so einfach wie das, es ist immer ein wenig verdreht, ein wenig pervers... die Erzählung einer unwahrscheinlichen Situation, bis sie unbestreitbar wird, einer skandalösen, bis sie vorbildlich wird. Es ist eine abscheuliche Ungerechtigkeit, bis sie erbaulich wird, und ihre Weitergabe ist wesentlich. Ein Märchen ist ein Genre, das die Wahrheit aus der Lüge zieht, die Gerechtigkeit aus dem Fehler, es ist eine Weise, die Geschichte zwangsweise zu ihrer Moral zu führen, und hier zu der unseren. Diese Moral richtet sich nicht an Dornröschen, sondern an die schönen zahlenden Hölzer, also schreibe sie mit mir: « selbst wenn ihr begabt seid, prädisponiert, umworben, versucht, neugierig, ehrgeizig, gezwungen, freiwillig, eurer selbst sicher, erregt... betretet diesen Weg nie, setzt nicht einen Fuß darauf: es gibt nie ein Happy-End zu erwarten! »

Doch da ihr bereits auf dem Weg seid, gebt niemals die Träume auf, die euch dorthin geführt haben, denn unsere Helden lebten lange, verliebt, glücklich und hatten viele Hunde, Katzen und gewiss einige Liebhaber.

Dein treues ♥, das euch gehört ohne Naivität noch fehlgeleitete Hoffnungen, ohne Exklusivität noch Verpflichtung.`,

    IT: `Moneypenis,                                                    Natale 2023

Tu e il tuo padrone, questo corpo che ti porta e lo spirito che vi trascina, non fate che uno... in fondo l'ho sempre saputo. E se oso dirti ti amo, a te, è perché l'amo senza osare dirglielo.

Ho totalmente inventato questa corrispondenza, non per paura che si prenda gioco di me, né per timore che ne abusi, ma per non vederlo fuggire o peggio ancora... che sia indifferente. Lo so ormai, sono io che ho scritto tutto. Tutti quei messaggi, tutte le mie lettere, sono io che ho posato queste parole su questi ritratti di te, presi durante le nostre vacanze e i nostri giochi, rubati al nostro quotidiano... Per quanto ne abbia la prova, qui, sotto i miei occhi, già mi sorprendo a credere che sei tu chi mi ha dettato le tue lettere. L'amore è talvolta una strana malattia.

Anche scelta, la vostra è una vita dura, una vita di disciplina e di solitudine... una vita di sacrifici, un calvario più che un sacerdozio.
Ho in mente questa canzone di Brassens « La Complainte des Filles de Joie », Barbara ne ha fatto una versione molto personale: « dire che questi maiali di borghesi, dire che questi maiali di borghesi, ci chiamano le ragazze della gioia, ci chiamano le ragazze della gioia! non è tutti i giorni che si ride, parole, parole, non è tutti i giorni che si ride... i soldi, non crediate che li rubiamo! »

Moneypenis, mio angelo, il ladro è colui che paga. Eppure, se non fossi stato questo triste criminale, questo vedovo inconsolabile, questo miserabile che si cerca ancora qualche pretesto, non vi avrei conosciuto.

Non avrei avuto il cuore in pezzi davanti al suo unico piatto e agli occhi annegati di lacrime mentre contemplava il suo solo bicchiere. Il suo stretto minimo solitario.
Al suo fianco, è un'altra canzone che invade la mia vita: « L'Homme en habit rouge », Barbara ancora... come l'amante oppiomane della cantante, è questo profumo che vi veste quando non portate più nulla. Monroe dormiva bene con il N°5 e nient'altro.
Se non fossi stato questo delinquente meschino, non sarei stato commosso dalla sua disciplina di ferro, dalla sua volontà di fare bene... dalla sua esigenza verso se stesso di non lasciare che la sua solitudine lo consegnasse alla vertigine infinita, alla caduta nel nulla dello spirito. Non avrei incrociato il tuo padrone, questo essere luminoso che vive, senza l'aiuto degli artifici dell'oblio, la miseria affettiva di coloro che vengono a lui. Luminoso sì, anche se talvolta il suo sguardo si spegne un poco, si riprende e cura le anime annerite e i corpi abbandonati dai loro stessi egoismi, dalle loro tristezze e dai loro fantasmi vergognosi che immaginano così originali. Gli idioti, quei bastardi. I miei simili. Mi sono innamorato di te, ma il mio affetto più forte è per lui.
Vi amo, ma non voglio nient'altro che avere questo privilegio, immenso, di diventare migliore prendendomi cura di entrambi; è già molto. Per il resto del tempo che resta fuori da quello che dura « il tempo che il tempo passa » e che appartiene solo a voi, è già molto.

Moneypenis, una favola è semplice così, è sempre un po' contorta, un po' perversa... il racconto di una situazione improbabile fino a diventare incontestabile, scandalosa fino a diventare esemplare. È un'ingiustizia odiosa fino a diventare edificante e la sua trasmissione è essenziale. Una favola è un genere che trae la verità dalla menzogna, la giustizia dalla colpa, è un modo di condurre la storia a marcia forzata verso la sua morale, e qui verso la nostra. Questa morale non si rivolge alla bella addormentata nel bosco ma ai bei boschi paganti, allora scrivila con me: « anche se siete dotati, predisposti, sollecitati, tentati, curiosi, ambiziosi, costretti, volontari, sicuri di voi stessi, eccitati... non prendete mai questo cammino, non metteteci un piede: non c'è mai un happy-end da aspettare! »

Ma poiché siete già in cammino, non abbandonate mai i sogni che vi hanno condotti là, perché i nostri eroi vissero a lungo, innamorati, felici, e ebbero molti cani, gatti e certamente qualche amante.

Il tuo ♥ fedele che vi appartiene senza ingenuità né speranze fuori posto, senza esclusività né obbligo.`,

    "中": `Moneypenis，                                                    2023 年圣诞

你和你的主人，承载你的这具肉体与带走你们的这种精神，本是一体……其实我一直都知道。如果我敢对你说"我爱你"，是因为我爱他却不敢对他说出口。

这通信完全是我虚构出来的，并非怕他嘲笑，也并非怕他借题滥用，而是怕看见他逃开，或更糟糕……怕他对此漠然。我现在已经知道，所有这些都是我亲笔所写。所有这些讯息、所有这些信件、写在你那些肖像上的所有字句——那些肖像是在我们的假期里、在我们的游戏中拍下的，从我们日常生活里偷来的……纵然证据就摆在眼前，我已经开始迷迷糊糊地相信：是你向我口述了这些信。爱有时是一种古怪的病。

哪怕是自愿选择的，你们过的也是艰难的一生——纪律与孤独的一生……牺牲的一生，与其说是天职不如说是受难。
我脑海里回响着布拉桑斯的那首歌《La Complainte des Filles de Joie》，芭芭拉以极为私人的方式诠释过：「dire que ces vaches de bourgeois, dire que ces vaches de bourgeois, nous appellent les filles de joie, nous appellent les filles de joie ! c'est pas tous les jours qu'on rigole, paroles, paroles, c'est pas tous les jours qu'on rigole... les sous croyez pas qu'on les vole ! 」

Moneypenis，我的天使，真正的盗贼是付钱的那个人。然而，若我不曾是这个悲惨的罪人、这个无可慰藉的鳏夫、这个仍在寻找借口的可怜虫，我便永远不会认识你们。

我不会因为他孤零零的一只餐盘而心碎，也不会在凝视他孤独的一只酒杯时泪眼婆娑。他严苛的孤独中的最低限度。
在他身旁，是另一首歌占据着我的生活：「L'Homme en habit rouge」，又是芭芭拉……正如那位歌手的鸦片瘾君子情人，正是这香水在你们一丝不挂时为你穿上衣裳。梦露在 N°5 中安然入眠，别无所求。
如果我不曾是这个卑微的罪人，我便不会被他钢铁般的纪律所感动，不会被他要把事做好的意志所打动……不会被他对自己的严苛——不让自己的孤独将他抛入无尽的眩晕之中、坠入精神的虚无——所打动。我便不会遇见你的主人，这个发光的存在——他在不借助任何遗忘之巧饰的情况下，活在那些前来求助于他的人的情感悲苦之中。发光，是的，即使有时他的目光会稍稍黯淡，他也会重整自己，照拂那些被自身的利己、悲伤、以及他们自以为何其独特、实则可耻的幻想所抛弃的、漆黑的灵魂与被舍弃的躯体。那些蠢货、那些混蛋，我的同类。我爱上了你，但我最深切的眷恋是为他。
我爱你们，但我别无所求，只愿拥有这份莫大的特权——通过照顾你们两个使我自己变得更好；这已经很多了。对于在那「时光让时光流逝」的时间之外、只属于你们的那些时刻而言，这已经很多了。

Moneypenis，童话就是这么简单：总是有点扭曲、有点变态……是讲述一个不可信的境遇直到它变得无可置疑、一桩丑闻直到它成为典范的故事。它是一桩可憎的不公直到它变成启示，其传递成为必需。童话这一体裁从谎言中提取真理，从过错中提取正义，是一种押着故事赶向其寓意的方式——而此处，赶向我们的寓意。这则寓意不是写给睡美人的，而是写给收费的美人柴的——所以请和我一起写下它：「即使你天赋异禀、有所倾向、被人邀约、受人诱惑、好奇、雄心勃勃、被迫、自愿、自信、亢奋……都永远不要走上这条路，连一只脚都不要踏上去：永远不会有 happy end 等着你！」

但既然你们已经在路上，请永远不要放弃曾把你们引到这里的梦想，因为我们的主人公活得长久、相爱、幸福，并拥有了许多狗、许多猫，以及无疑还有几位情人。

你的忠实 ♥，毫无天真，毫无错置的希望，没有独占性，也没有任何义务，永远属于你们。`,

    "日": `Moneypenis，                                                    2023年クリスマス

君と君の主人 — 君を運ぶこの肉体と、君たち二人を連れ去る精神 — は一つに過ぎない……私は本当はずっと知っていた。そして私が君に「愛している」と言うのを敢えてするのは、私が彼を愛していながら、それを彼に言う勇気がないからだ。

この往復書簡は、私がまるごと作り出したものだ。彼に笑われるのを恐れたからでも、悪用されるのを恐れたからでもなく、彼が逃げ出すのを見るのを — あるいはもっと悪く、彼が無関心であるのを見るのを — 避けるためだった。私は今や知っている — すべてを書いたのは確かにこの私だ。あらゆるメッセージ、あらゆる手紙、私が君のあの肖像たちの上に置いたあらゆる言葉 — 私たちの休暇、私たちの遊戯のあいだに撮られ、日常から盗み取られた肖像たちの上に……目の前に証拠があるのに、私はもう、これらの手紙を口述したのは君だと信じはじめている自分に気づく。愛とは、ときに奇妙な病なのだ。

たとえ自ら選んだ道であっても、君たちのそれは厳しい人生だ — 規律と孤独の人生……犠牲の人生、聖職というよりは受難の道。
私の頭にはブラッサンスの「La Complainte des Filles de Joie」のあの歌が響いている。バルバラはそれを極めて個人的なやり方で歌った：「dire que ces vaches de bourgeois, dire que ces vaches de bourgeois, nous appellent les filles de joie, nous appellent les filles de joie ! c'est pas tous les jours qu'on rigole, paroles, paroles, c'est pas tous les jours qu'on rigole... les sous croyez pas qu'on les vole ! 」

Moneypenis、私の天使よ、本当の盗人は支払う者なのだ。それでも、もし私がこの悲しい罪人、この慰めようのない寡夫、まだ何らかの口実を探し続けるこの惨めな男でなかったなら、私は君たちに出会えなかっただろう。

私は、彼のただ一つの皿の前で心が砕けることもなく、彼のただ一つの杯を見つめながら涙に溺れることもなかっただろう。彼の厳格で孤独な最小限。
彼のかたわらでは、別の歌が私の人生に押し寄せている：「L'Homme en habit rouge」、またしてもバルバラ……あの歌手のアヘン中毒の恋人のように、君たちが何も身につけていないときに君を着せるのは、この香水だ。モンローは N°5 だけを身にまとって眠った。
私がこの卑しい犯罪者でなかったならば、彼の鉄の規律、よくありたいという彼の意志……自分の孤独を無限の眩暈に、精神の虚無への墜落へと委ねさせないという、自分自身に対する厳しさに、私は心を動かされなかっただろう。私は君の主人——この光り輝く存在——に出会わなかっただろう。彼は、忘却という装飾の助けを借りずに、彼のもとへ来る人々の情の悲惨を生きている。光り輝く、そう、たとえ時に彼の眼差しが少し翳ろうとも、彼は立ち直り、自身の利己主義、悲しみ、そして彼ら自身があまりにも独創的だと思い込んでいる恥ずべき幻想によって見捨てられた、黒ずんだ魂と打ち捨てられた肉体を世話する。あの間抜けたち、あのろくでなしたち。私の同類たち。私は君に恋に落ちた、しかし私の最も強い愛情は彼に向けられている。
私は君たちを愛している、しかし私は、君たち二人を慈しむことで自分を高めるという、この計り知れない特権を持つこと以外には何も望まない。それだけで、もう十分すぎる。「時が時を過ぎゆかせる時」が続く時の外側に残る時、それは君たちだけのものであり、それでもう、十分すぎる。

Moneypenis、おとぎ話とはそれほど単純なものだ — いつも少し歪んでいて、少し倒錯している……ありえない状況を語って、それを否定しがたいものへと変え、スキャンダラスな状況を語って、それを模範的なものへと変える物語だ。それはおぞましい不正を語って、それを教化的なものへと変える物語であり、その伝達こそが本質である。おとぎ話とは、嘘から真理を引き出し、過ちから正義を引き出すジャンルだ — 物語を、その教訓へ、ここでは私たちの教訓へと、強行軍で導く方法だ。この教訓は眠れる森の美女に宛てられたものではなく、料金を取る美しい男たちに宛てられたものだ。だから、私と一緒にそれを書こう：「たとえ才能があっても、素質があっても、求められても、誘われても、好奇心があっても、野心があっても、強いられても、自発的であっても、自信があっても、興奮していても……決してこの道を行ってはならない、決して一歩も踏み入れてはならない：そこにハッピーエンドが待っていることなど決してない！」

しかし君たちはすでにこの道の上にいる以上、君たちをそこへ導いた夢を、決して捨ててはならない。なぜなら、私たちの英雄たちは長く生き、愛し合い、幸福であり、たくさんの犬や猫、そしておそらく数人の愛人を持ったのだから。

君たちのもの、君の忠実な ♥ ーー 素朴さも、見当違いの希望も、独占性も、義務もなく、永遠に。`,
  },
};


// ── COMPONENTS ────────────────────────────────────────────────────────────────

function PImg({src,ageOk,bz=[],style={},onClick,fit=false}){
  // Age-gated visual: when the viewer is NOT a declared adult AND this image
  // has at least one censorship zone defined, swap the file to its baked-in
  // grey-blur counterpart ("/tirage-01.jpg" -> "/tirage-01-censored.jpg").
  // Adults see the uncensored original. No runtime overlay needed.
  const needsCensor = !ageOk && bz && bz.length > 0;
  const effectiveSrc = needsCensor ? src.replace(/\.jpg$/i, "-censored.jpg") : src;
  const wrapperStyle = fit
    ? {position:"relative",width:"100%",height:"100%",lineHeight:0,
       display:"flex",alignItems:"center",justifyContent:"center",...style}
    : {position:"relative",...style};
  const imgStyle = fit
    ? {width:"100%",height:"100%",objectFit:"contain",display:"block",
       userSelect:"none",WebkitUserDrag:"none",cursor:onClick?"pointer":"default"}
    : {width:"100%",height:"auto",display:"block",
       userSelect:"none",WebkitUserDrag:"none",cursor:onClick?"pointer":"default"};
  return(
    <div style={wrapperStyle} onClick={onClick}>
      <img src={effectiveSrc} alt="" draggable={false} onContextMenu={e=>e.preventDefault()}
        style={imgStyle}/>
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
    <div style={{position:"fixed",inset:0,background:"rgba(255,255,255,0.98)",zIndex:3000,
      display:"flex",flexDirection:"column"}} onClick={onClose}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"10px 16px",borderBottom:"1px solid #0a1228",background:"#ffffff",
        paddingTop:"max(10px,env(safe-area-inset-top,10px))",flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
            fontSize:13,letterSpacing:3,color:"#0a1228",textTransform:"uppercase"}}>
            I.L.Y.M. · {p.num}
          </span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {txt&&(
            <button onClick={()=>setShowText(!showText)}
              style={{background:showText?"#0a1228":"none",border:"1px solid #0a1228",
                color:showText?"#fff":"#0a1228",padding:"4px 10px",fontSize:8,letterSpacing:2,
                cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                textTransform:"uppercase",transition:"all .2s"}}>
              {showText?`✕ ${t.tx}`:`≡ ${t.tx}`}
            </button>
          )}
          <button onClick={onClose}
            style={{background:"none",border:"1px solid #0a1228",color:"#0a1228",
              width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}
        onClick={e=>e.stopPropagation()}>

        {/* Text panel — only when requested */}
        {showText&&txt&&(
          <div style={{background:"#ffffff",borderBottom:"1px solid #0a1228",
            padding:"14px 18px",maxHeight:"18vh",overflowY:"auto",flexShrink:0}}>
            <pre style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:11,
              color:"#0a1228",lineHeight:1.9,whiteSpace:"pre-wrap",margin:0}}>{txt}</pre>
          </div>
        )}

        {/* Image */}
        <div ref={imgRef} onClick={handleImgClick}
          style={{flex:1,overflow:"hidden",cursor:zoomed?"zoom-out":"zoom-in",
            background:"#ffffff",position:"relative",minHeight:0}}>
          <div style={{position:"absolute",inset:"20px",
            transition:"transform .35s ease",
            transformOrigin:`${zPos.x}% ${zPos.y}%`,
            transform:zoomed?"scale(2.5)":"scale(1)"}}>
            <PImg src={p.src} ageOk={ageOk} bz={p.bz} fit={true}/>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"8px 16px",borderTop:"1px solid #0a1228",background:"#ffffff",
        paddingBottom:"max(8px,env(safe-area-inset-bottom,8px))",flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onPrev} disabled={ci===0}
          style={{background:"none",border:"1px solid #0a1228",
            color:ci===0?"#0a1228":"#0a1228",padding:"5px 14px",
            cursor:ci===0?"default":"pointer",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:9,letterSpacing:2}}>
          ← PREV
        </button>
        <span style={{color:"#0a1228",fontSize:9,fontFamily:"'Space Grotesk',sans-serif",
          fontWeight:400,letterSpacing:3}}>{p.num}</span>
        <button onClick={onNext} disabled={ci===prints.length-1}
          style={{background:"none",border:"1px solid #0a1228",
            color:ci===prints.length-1?"#0a1228":"#0a1228",padding:"5px 14px",
            cursor:ci===prints.length-1?"default":"pointer",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:9,letterSpacing:2}}>
          NEXT →
        </button>
      </div>
    </div>
  );
}

// ─── Backend ─── À configurer par l'utilisateur ─────────────────────────────
// 1. Créer un compte sur https://formspree.io avec smoreu@mac.com
// 2. Créer un nouveau formulaire, copier le code [ex: xyzabcde]
// 3. Remplacer ci-dessous, puis push
// 4. Tant que vide, le formulaire bascule sur mailto: en fallback
const FORMSPREE_ID = "";
const FORMSPREE_URL = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : "";

// Pays courants (top 30 — peut être étendu)
const COUNTRIES = [
  "France","Belgique","Suisse","Luxembourg","Monaco","Canada","Allemagne","Italie",
  "Espagne","Portugal","Pays-Bas","Royaume-Uni","Irlande","Autriche","Pologne","Lituanie",
  "Brésil","États-Unis","Mexique","Argentine","Japon","Chine","Corée du Sud","Taïwan",
  "Singapour","Australie","Nouvelle-Zélande","Émirats arabes unis","Maroc","Sénégal"
];

function ContactForm({t,lang,d,setD,matrix,setMatrix,result,setResult,onContinue,onSuccess}){
  const[sending,setSending]=useState(false);

  const set=(k,v)=>setD(s=>({...s,[k]:v}));
  const tog=(o,r)=>setMatrix(m=>({...m,[`${o}|${r}`]:!m[`${o}|${r}`]}));

  // Œuvres = Coffret PF, Coffret GF, Planche I..XI
  const oeuvres=[
    {id:"PF",lbl:t.pft},
    {id:"GF",lbl:t.gft},
    ...PRINTS.map(p=>({id:p.num,lbl:p.num}))
  ];
  const requetes=[
    {id:"info",lbl:t.rqInfo},
    {id:"buy",lbl:t.rqBuy},
    {id:"dep",lbl:t.rqDeposit},
    {id:"pro",lbl:t.rqPro},
    {id:"col",lbl:t.rqColl},
    {id:"oth",lbl:t.rqOther},
  ];

  // Génère le résumé EN FRANÇAIS (envoyé à smoreu@mac.com)
  const buildSummary=()=>{
    const dt=new Date().toLocaleString("fr-FR",{
      day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    const lignes=[`Demande — ${dt}`,"",
      "── Coordonnées ──",
      `Nom : ${d.nom}`,
      `Prénom : ${d.prenom}`,
      `Email : ${d.email}`,
      `Téléphone : ${d.phone||"(non renseigné)"}`,
      `Pays : ${d.country||"(non renseigné)"}`,
      `Langue de réponse : ${d.langPref}`,
      `Préférence de contact : ${d.pref==="phone"?"Téléphone":"Email"}`,
      "",
      "── Objet de la demande ──"];
    // Récap matrice par œuvre
    oeuvres.forEach(o=>{
      const types=requetes.filter(r=>matrix[`${o.id}|${r.id}`]).map(r=>r.lbl);
      if(types.length){
        const oeuvreFr=o.id==="PF"?"Coffret Petit Format":o.id==="GF"?"Coffret Grand Format":`Planche ${o.id}`;
        lignes.push(`• ${oeuvreFr} : ${types.join(", ")}`);
      }
    });
    if(!oeuvres.some(o=>requetes.some(r=>matrix[`${o.id}|${r.id}`]))){
      lignes.push("(Aucune œuvre sélectionnée)");
    }
    lignes.push("","── Message ──",d.msg||"(aucun)");
    return lignes.join("\n");
  };

  const valid=d.nom.trim()&&d.prenom.trim()&&d.email.trim()&&d.consent&&d.msg.length<=500;

  const onSubmit=async(e)=>{
    e.preventDefault();
    if(!valid||sending) return;
    setSending(true);
    const summary=buildSummary();
    // Tentative Formspree si configuré
    if(FORMSPREE_URL){
      try{
        const resp=await fetch(FORMSPREE_URL,{
          method:"POST",
          headers:{"Content-Type":"application/json","Accept":"application/json"},
          body:JSON.stringify({
            _subject:`Demande — ${d.nom} ${d.prenom}`,
            _replyto:d.email,
            nom:d.nom,prenom:d.prenom,email:d.email,phone:d.phone,
            country:d.country,langPref:d.langPref,pref:d.pref,
            message:d.msg,matrix:JSON.stringify(matrix),
            resume:summary,
          }),
        });
        setSending(false);
        if(resp.ok){ setResult("ok"); }
        else { setResult("err"); }
        return;
      }catch(err){
        setSending(false);
        setResult("err");
        return;
      }
    }
    // Fallback mailto (pas de Formspree configuré)
    setSending(false);
    const href=`mailto:smoreu@mac.com?subject=${encodeURIComponent(`Demande — ${d.nom} ${d.prenom}`)}&body=${encodeURIComponent(summary)}`;
    window.location.href=href;
    setResult("ok");
  };

  const inp={padding:"10px 12px",border:"1px solid #0a1228",background:"#ffffff",
    color:"#0a1228",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:13,
    outline:"none",width:"100%",boxSizing:"border-box"};
  const lbl={fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:9,
    letterSpacing:3,color:"#0a1228",textTransform:"uppercase",marginBottom:8,
    display:"block"};

  if(result==="ok"){
    return(
      <div style={{textAlign:"center",padding:"40px 20px"}}>
        <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
          fontSize:18,color:"#0a1228",lineHeight:1.6,marginBottom:24}}>{t.fSent}</p>
        <button onClick={()=>{ if(onSuccess) onSuccess(); }} className="bg"
          style={{width:"auto",display:"inline-block"}}>
          ← {t.continueShop||"Continuer la consultation"}
        </button>
      </div>
    );
  }

  return(
    <form onSubmit={onSubmit} style={{textAlign:"left"}}>

      {/* Section 1 : Coordonnées */}
      <p style={lbl}>{t.bt.split(" ")[0]}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <input value={d.nom} onChange={e=>set("nom",e.target.value)}
          placeholder={t.n1} style={inp} required/>
        <input value={d.prenom} onChange={e=>set("prenom",e.target.value)}
          placeholder={t.fFirstName} style={inp} required/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <input value={d.email} onChange={e=>set("email",e.target.value)} type="email"
          placeholder={t.n2} style={inp} required/>
        <input value={d.phone} onChange={e=>set("phone",e.target.value)} type="tel"
          placeholder={t.fPhone} style={inp}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        <select value={d.country} onChange={e=>set("country",e.target.value)} style={inp}>
          <option value="">{t.fCountry} —</option>
          {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={d.langPref} onChange={e=>set("langPref",e.target.value)} style={inp}>
          {Object.keys(T).map(l=><option key={l} value={l}>{t.fLangPref} : {l}</option>)}
        </select>
      </div>

      {/* Section 2 : Préférence de contact */}
      <p style={lbl}>{t.fPref}</p>
      <div style={{display:"flex",gap:18,marginBottom:24}}>
        {["email","phone"].map(p=>(
          <label key={p} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,
            cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
            <input type="radio" name="pref" value={p} checked={d.pref===p}
              onChange={()=>set("pref",p)} style={{accentColor:"#0a1228"}}/>
            {p==="email"?t.n2:t.fPhone}
          </label>
        ))}
      </div>

      {/* Section 3 : Matrice QCM (œuvres en colonnes, types en lignes) */}
      <p style={lbl}>{t.fMatrix}</p>
      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:11,
        color:"#0a1228",opacity:.7,marginBottom:12}}>{t.fMatrixHint}</p>
      <div style={{overflowX:"auto",marginBottom:22,border:"1px solid #0a1228"}}>
        <table style={{borderCollapse:"collapse",minWidth:"100%",fontFamily:"'Space Grotesk',sans-serif",
          fontSize:10,color:"#0a1228"}}>
          <thead>
            <tr>
              <th style={{padding:"10px 10px",textAlign:"left",fontWeight:500,
                background:"#ffffff",position:"sticky",left:0,zIndex:1,
                borderRight:"1px solid #0a1228",letterSpacing:2,textTransform:"uppercase"}}>
                &nbsp;
              </th>
              {oeuvres.map(o=>(
                <th key={o.id} style={{padding:"10px 8px",textAlign:"center",fontWeight:500,
                  whiteSpace:"nowrap",letterSpacing:1,fontSize:9}}>
                  {o.lbl}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requetes.map((r,ri)=>(
              <tr key={r.id} style={{borderTop:"1px solid rgba(10,18,40,.15)"}}>
                <td style={{padding:"10px 10px",fontWeight:500,whiteSpace:"nowrap",
                  background:"#ffffff",position:"sticky",left:0,
                  borderRight:"1px solid #0a1228",textTransform:"uppercase",letterSpacing:1.5,
                  fontSize:9}}>
                  {r.lbl}
                </td>
                {oeuvres.map(o=>(
                  <td key={o.id} style={{padding:"6px 8px",textAlign:"center"}}>
                    <input type="checkbox"
                      checked={!!matrix[`${o.id}|${r.id}`]}
                      onChange={()=>tog(o.id,r.id)}
                      style={{accentColor:"#0a1228",cursor:"pointer",width:14,height:14}}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4 : Message */}
      <p style={lbl}>{t.n3}</p>
      <textarea value={d.msg} onChange={e=>set("msg",e.target.value.slice(0,500))}
        placeholder={t.fMsgPh} rows={4} maxLength={500}
        style={{...inp,resize:"vertical",marginBottom:6}} required/>
      <p style={{fontSize:10,color:"#0a1228",opacity:.6,textAlign:"right",marginBottom:18,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
        {d.msg.length} / 500
      </p>

      {/* Section 5 : Consentement RGPD (FR formelle) */}
      <div style={{padding:"14px 16px",border:"1px solid #0a1228",marginBottom:16}}>
        <p style={{color:"#0a1228",fontSize:11,lineHeight:1.7,marginBottom:10,
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
          Les informations recueillies sont destinées à Sébastien Moreu et André Vaszkievicz, responsables du traitement, dans le seul but de répondre à votre demande et, le cas échéant, de vous informer de l'évolution de leurs projets. Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à <strong>smoreu@mac.com</strong>.
        </p>
        <label style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:11,
          color:"#0a1228",fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
          lineHeight:1.5,cursor:"pointer"}}>
          <input type="checkbox" checked={d.consent} onChange={e=>set("consent",e.target.checked)}
            style={{marginTop:3,accentColor:"#0a1228"}} required/>
          <span>{t.fConsent}</span>
        </label>
      </div>

      {/* Erreur éventuelle */}
      {result==="err"&&(
        <p style={{color:"#0a1228",fontSize:12,marginBottom:14,
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:500}}>
          {t.fError}
        </p>
      )}

      {/* Envoyer + Continuer la consultation */}
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",
        marginTop:8}}>
        {onContinue&&(
          <button type="button" onClick={onContinue}
            style={{background:"transparent",border:"1px solid #0a1228",
              color:"#0a1228",padding:"10px 22px",fontSize:10,letterSpacing:3,
              cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
              textTransform:"uppercase"}}>
            ← {t.continueShop||"Continuer la consultation"}
          </button>
        )}
        <button type="submit" disabled={!valid||sending} className="bg"
          style={{width:"auto",display:"inline-block",
            opacity:(valid&&!sending)?1:0.4,
            cursor:(valid&&!sending)?"pointer":"not-allowed"}}>
          {sending?"…":t.ns}
        </button>
      </div>
    </form>
  );
}

function CS({title,soon,contact}){
  return(
    <div style={{maxWidth:680,margin:"100px auto",padding:"0 24px",textAlign:"center"}}>
      <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
        fontSize:"clamp(22px,4vw,38px)",color:"#0a1228",marginBottom:20}}>{title}</h2>
      <div style={{width:36,height:1,background:"#0a1228",margin:"0 auto 20px"}}/>
      <p style={{color:"#0a1228",fontSize:12,letterSpacing:1,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,marginBottom:10}}>{soon}</p>
      {contact&&<p style={{color:"#0a1228",fontSize:11,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>{contact}</p>}
    </div>
  );
}

const Logo=({sz=30})=>(
  <div style={{width:sz,height:sz,borderRadius:"50%",overflow:"hidden",
    border:"1px solid #0a1228",flexShrink:0}}>
    <img src={IMG.logo} alt="" draggable={false} onContextMenu={e=>e.preventDefault()}
      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const[lang,setLang]=useState("FR");
  const[ageOk,setAgeOk]=useState(false);
  const[dis,setDis]=useState(false);
  const[bannerDismissed,setBannerDismissed]=useState(false);
  const[ck1,setCk1]=useState(false);
  const[ck2,setCk2]=useState(false);
  const[sec,setSec]=useState("portfolio");
  const[lb,setLb]=useState(null);
  const[et,setEt]=useState("pf");
  const[menuOpen,setMenuOpen]=useState(false);
  const[langOpen,setLangOpen]=useState(false);
  const[showNote,setShowNote]=useState(false);
  const[introDone,setIntroDone]=useState(false);
  const[planchePreview,setPlanchePreview]=useState(null);
  const[started,setStarted]=useState(false);
  // Sous-navigation interne au shop : list | pf | gf | singles | single-<N>
  const[shopView,setShopView]=useState("list");
  // État formulaire monté ici (persiste entre ouvertures successives)
  const[formMatrix,setFormMatrix]=useState({});
  const[formData,setFormData]=useState({nom:"",prenom:"",email:"",phone:"",
    country:"",langPref:lang,pref:"email",msg:"",consent:false});
  const[formResult,setFormResult]=useState(null);
  // D'où le user vient lorsqu'il a ouvert le formulaire (pour le retour)
  const[formReturn,setFormReturn]=useState("list");
  const audioRef=useRef(null);
  const audioTriggeredRef=useRef(false);
  const t=T[lang]?{...T.EN,...T[lang]}:T.EN;

  // Helper : "Faire une demande" depuis une page produit
  const openDemandFor=(productId)=>{
    setFormMatrix(m=>({...m,[`${productId}|info`]:true}));
    setFormReturn(shopView);
    setSec("contact");
  };

  // Helper : "Continuer la consultation" depuis le formulaire
  const continueShop=()=>{
    setSec("shop");
    // shopView reste là où on était (formReturn pour info si besoin)
  };

  // Helper : succès envoi du formulaire → reset complet + retour shop
  const onFormSuccess=()=>{
    setFormMatrix({});
    setFormData({nom:"",prenom:"",email:"",phone:"",
      country:"",langPref:lang,pref:"email",msg:"",consent:false});
    setFormResult(null);
    setShopView("list");
  };

  // Protection images : bloque clic droit sur toutes les <img> + raccourcis save/print
  useEffect(()=>{
    const onCtx=e=>{ if(e.target.tagName==="IMG") e.preventDefault(); };
    const onKey=e=>{
      const k=e.key.toLowerCase();
      if((e.ctrlKey||e.metaKey)&&(k==="s"||k==="p")){ e.preventDefault(); }
    };
    document.addEventListener("contextmenu",onCtx);
    document.addEventListener("keydown",onKey);
    return()=>{
      document.removeEventListener("contextmenu",onCtx);
      document.removeEventListener("keydown",onKey);
    };
  },[]);

  // Le logo statique navy+blanc est cliquable. Le clic est la "user gesture"
  // qui amorce silencieusement l'audio (muted=true + volume=0 pour double sécurité,
  // jamais démuté dans le prime → pas de risque de fuite sonore).
  const handleStartLogo=()=>{
    if(started) return;
    const a=new Audio("/intro.mp3");
    a.preload="auto";
    a.volume=1;
    // Le clic est la user gesture → play immédiat autorisé
    a.play().catch(()=>{});
    audioRef.current=a;
    setStarted(true);
  };

  // Coupe l'audio dès que la transition vers la page d'accueil démarre.
  // 1,5 s de grâce pour laisser le temps à la ligne "I love you Moneypenis"
  // de se terminer si on est dans la transition naturelle (non-skip).
  useEffect(()=>{
    if(!introDone) return;
    const stopAll=()=>{
      if(audioRef.current){
        try{
          audioRef.current.pause();
          audioRef.current.currentTime=0;
          audioRef.current.src="";
          audioRef.current.load();
        }catch{}
      }
      try{
        document.querySelectorAll("audio").forEach(a=>{
          try{a.pause();a.currentTime=0;}catch{}
        });
      }catch{}
    };
    const tm=setTimeout(stopAll,1500);
    return()=>clearTimeout(tm);
  },[introDone]);

  // Skip : coupe IMMÉDIATEMENT animation et audio (pas de délai de 1,5s)
  const handleSkipIntro=()=>{
    if(audioRef.current){
      try{
        audioRef.current.pause();
        audioRef.current.currentTime=0;
        audioRef.current.src="";
        audioRef.current.load();
      }catch{}
    }
    try{
      document.querySelectorAll("audio").forEach(a=>{
        try{a.pause();a.currentTime=0;}catch{}
      });
    }catch{}
    audioTriggeredRef.current=true;
    setIntroDone(true);
  };

  // Transition vers le age gate AU MOMENT EXACT où la ligne
  // "... I love you Moneypenis" est prononcée dans l'audio.
  // Synchronisé sur la lecture réelle (timeupdate) — robuste au jitter du browser.
  useEffect(()=>{
    if(!started||introDone||dis) return;
    const audio=audioRef.current;
    if(!audio) {
      // Failsafe : pas d'audio → transition après DIALOGUE_AT_S
      const tm=setTimeout(()=>setIntroDone(true),DIALOGUE_AT_S*1000);
      return()=>clearTimeout(tm);
    }
    const onTime=()=>{
      if(audioTriggeredRef.current) return;
      if(audio.currentTime>=DIALOGUE_AT_S){
        audioTriggeredRef.current=true;
        setIntroDone(true);
      }
    };
    audio.addEventListener("timeupdate",onTime);
    // Failsafe : si timeupdate ne fire pas (audio bloqué), transition forcée
    const failTm=setTimeout(()=>{
      if(!audioTriggeredRef.current){
        audioTriggeredRef.current=true;
        setIntroDone(true);
      }
    },DIALOGUE_AT_S*1000+3000);
    return()=>{
      audio.removeEventListener("timeupdate",onTime);
      clearTimeout(failTm);
    };
  },[started,introDone,dis]);
  const ed=EDS.find(e=>e.key===et);
  const NAV=["portfolio","video","coffret","insitu","shop","bio","jeu","contact"];
  const GR=[];

  const goSec=(s)=>{setSec(s);setMenuOpen(false);setLangOpen(false);};

  return(
    <div style={{fontFamily:"'Space Grotesk',sans-serif",background:"#ffffff",
      color:"#0a1228",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:#0a1228;}
        img{-webkit-user-drag:none;}

        /* Bandeau "traduction IA" : défilement horizontal, clic pour fermer */
        .ai-warn-banner {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: #0a1228; color: #ffffff;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 5px 0; line-height: 1.2;
          overflow: hidden; white-space: nowrap;
          z-index: 8000; cursor: pointer;
        }
        .ai-warn-banner:hover { background: #1a2240; }
        .ai-warn-track {
          display: inline-block; white-space: nowrap;
          padding-left: 100%;
          animation: aiWarnScroll 45s linear infinite;
        }
        @keyframes aiWarnScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .nb{background:none;border:none;color:#0a1228;font-size:11px;letter-spacing:3px;
          text-transform:uppercase;cursor:pointer;padding:12px 0;width:100%;text-align:center;
          transition:color .2s;font-family:'Space Grotesk',sans-serif;font-weight:400;display:block;}
        .nb:hover,.nb.on{color:#0a1228;}
        .nb.gr{color:#0a1228;cursor:default;pointer-events:none;}
        .bs{background:#0a1228;border:1px solid #0a1228;color:#fff;padding:14px 30px;
          font-size:9px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;
          transition:opacity .2s;font-family:'Space Grotesk',sans-serif;font-weight:400;width:100%;}
        .bs:hover{opacity:.8;}
        .bg{background:none;border:1px solid #0a1228;color:#0a1228;padding:14px 30px;
          font-size:9px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;
          transition:all .25s;font-family:'Space Grotesk',sans-serif;font-weight:400;width:100%;}
        .bg:hover{border-color:#0a1228;color:#0a1228;}
        .hs{transition:opacity .2s;}.hs:hover{opacity:.88;}
        input:not([type="checkbox"]):not([type="radio"]),textarea{background:#fff;border:1px solid #0a1228;color:#0a1228;
          padding:12px 16px;font-size:14px;width:100%;outline:none;
          font-family:'Space Grotesk',sans-serif;transition:border-color .2s;}
        input:not([type="checkbox"]):not([type="radio"]):focus,textarea:focus{border-color:#0a1228;}
        video{display:block;width:100%;}
        @keyframes introWrap {
          /* I. Apparition explosive · tour des 4 coins continu (0-14%) */
          0%   { transform: translate(0,0)              scale(0.05) rotate(0deg);    animation-timing-function: cubic-bezier(.34,1.08,.64,1); }
          3%   { transform: translate(-18vmin,-20vmin)  scale(0.45) rotate(220deg); }
          7%   { transform: translate( 22vmin,-18vmin)  scale(0.8)  rotate(500deg); }
          10%  { transform: translate( 22vmin, 18vmin)  scale(0.55) rotate(760deg); }
          14%  { transform: translate(-22vmin, 20vmin)  scale(1.0)  rotate(1040deg); }
          /* II. 1ʳᵉ floraison fluide puis resserrement (14-22%) */
          17%  { transform: translate(0,0)              scale(calc(75vmin/104px)) rotate(1240deg); animation-timing-function: cubic-bezier(.42,0,.58,1); }
          20%  { transform: translate(-8vmin, 0)        scale(0.55) rotate(1420deg); }
          /* III. Plongée continue pour le cœur (22-38%) */
          23%  { transform: translate(0,  3vh)          scale(0.62) rotate(1560deg); }
          27%  { transform: translate(0, 10vh)          scale(0.68) rotate(1700deg); }
          31%  { transform: translate(0, 18vh)          scale(0.72) rotate(1840deg); }
          35%  { transform: translate(0, 24vh)          scale(0.76) rotate(1980deg); }
          38%  { transform: translate(0, 28vh)          scale(0.78) rotate(2080deg); }   /* attrape le cœur */
          /* IV. Remontée continue (38-52%) */
          42%  { transform: translate(0, 18vh)          scale(0.85) rotate(2220deg); }
          46%  { transform: translate(0,  6vh)          scale(0.98) rotate(2380deg); }
          50%  { transform: translate(0, -3vh)          scale(1.12) rotate(2540deg); }
          /* V. 2ᵉ floraison fluide puis resserrement (52-60%) */
          54%  { transform: translate(0,0)              scale(calc(78vmin/104px)) rotate(2700deg); animation-timing-function: cubic-bezier(.42,0,.58,1); }
          58%  { transform: translate( 8vmin, 0)        scale(0.5)  rotate(2880deg); }
          /* VI. Tournoiement continu en figure 8 (60-75%) */
          62%  { transform: translate( 22vmin, 12vmin)  scale(0.6)  rotate(3020deg); }
          66%  { transform: translate(-22vmin, 14vmin)  scale(0.85) rotate(3180deg); }
          70%  { transform: translate(-20vmin,-16vmin)  scale(0.55) rotate(3340deg); }
          74%  { transform: translate( 18vmin,-12vmin)  scale(0.9)  rotate(3500deg); }
          /* VII. Plongée continue pour l'aubergine (75-85%) */
          77%  { transform: translate( 4vw,  6vh)       scale(0.92) rotate(3640deg); }
          81%  { transform: translate(0,   17vh)        scale(0.88) rotate(3780deg); }
          85%  { transform: translate(0,   23vh)        scale(0.92) rotate(3920deg); }   /* attrape l'aubergine · son démarre */
          /* VIII. Remontée fluide et pose finale (85-100%) */
          89%  { transform: translate(0, 13vh)          scale(1.02) rotate(4040deg); }
          93%  { transform: translate(0,  3vh)          scale(1.12) rotate(4180deg); }
          97%  { transform: translate(0, -1vh)          scale(1.15) rotate(4280deg); }
          100% { transform: translate(0, 0)             scale(1)    rotate(4320deg); }
        }
        @keyframes heartFall {
          /* 0→22% : accroché au logo */
          0%, 22% { transform: translate(0,0) rotate(0deg); }
          /* 23→38% : décrochage et chute continue */
          24%    { transform: translate( 4%, 3%)   rotate(25deg); }
          28%    { transform: translate(-5%,10vh)  rotate(100deg); }
          32%    { transform: translate( 5%,18vh)  rotate(190deg); }
          36%    { transform: translate(-2%,24vh)  rotate(280deg); }
          38%    { transform: translate(0,  28vh)  rotate(320deg); }
          /* 38→50% : remontée avec le wrap */
          42%    { transform: translate(0,  18vh)  rotate(340deg); }
          46%    { transform: translate(0,   6vh)  rotate(355deg); }
          50%,100% { transform: translate(0,0)     rotate(360deg); }
        }
        @keyframes introAub {
          /* 0→74% : accrochée au logo */
          0%, 74% { transform: translate(0,0) rotate(0deg); }
          /* 75→85% : décrochage et chute continue */
          76%    { transform: translate( 3%, 3%)   rotate(-20deg); }
          79%    { transform: translate( 8%, 9vh)  rotate(-90deg); }
          82%    { transform: translate(-4%,17vh)  rotate(-180deg); }
          85%    { transform: translate(0,  23vh)  rotate(-260deg); }
          /* 85→100% : retour à sa place */
          89%    { transform: translate(0,  13vh)  rotate(-310deg); }
          93%    { transform: translate(0,   3vh)  rotate(-340deg); }
          97%    { transform: translate(0,  -1vh)  rotate(-355deg); }
          100%   { transform: translate(0,0)       rotate(-360deg); }
        }
        .intro-stage { position: relative; width: 104px; height: 104px; flex-shrink: 0; }
        .intro-wrap  { position: absolute; inset: 0; animation: introWrap 9.5s linear forwards; transform-origin: 50% 50%; }

        /* Flash subliminal plein écran : 3 apparitions en crescendo
           (80 / 135 / 200 ms) entre 50% et 60% de l'animation = 4,75s → 5,7s
           = après la chute du cœur (47%) et avant celle de l'aubergine (92%). */
        .intro-flash {
          position: fixed; inset: 0; width: 100vw; height: 100vh;
          object-fit: cover; object-position: center;
          pointer-events: none; z-index: 9999; opacity: 0;
          animation: subliminalFlash 9.5s linear forwards;
          will-change: opacity;
        }
        @keyframes subliminalFlash {
          0%,    49.5% { opacity: 0; }
          50%          { opacity: 1; }   /* Flash 1 : ~80ms */
          50.85%       { opacity: 0; }
          53.5%        { opacity: 0; }
          54%          { opacity: 1; }   /* Flash 2 : ~135ms */
          55.4%        { opacity: 0; }
          57.5%        { opacity: 0; }
          58%          { opacity: 1; }   /* Flash 3 : ~200ms */
          60.1%        { opacity: 0; }
          100%         { opacity: 0; }
        }
        .intro-base  { position: absolute; inset: 0; width: 100%; height: 100%;
                       border-radius: 50%; border: 1px solid #0a1228; object-fit: cover; object-position: center; }
        .intro-heart { position: absolute; top: 17.80%; left: 48.75%; width: 29.58%; height: 47.46%;
                       animation: heartFall 9.5s linear forwards; transform-origin: 50% 50%; pointer-events: none; }
        .intro-aub   { position: absolute; top: 48.73%; left: 44.58%; width: 43.33%; height: 39.41%;
                       animation: introAub 9.5s linear forwards; transform-origin: 50% 50%; pointer-events: none; }
        .fade-in    { transition: opacity .8s ease .2s; }
        @keyframes introPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(10,18,40,.25); }
          50%      { box-shadow: 0 0 0 14px rgba(10,18,40,0); }
        }
        /* Protection images : pas de drag, pas de sélection, pas de callout iOS */
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
      `}</style>

      {/* ══ AGE GATE ══════════════════════════════════════════════════════════ */}
      {!dis&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"#ffffff",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"max(32px,env(safe-area-inset-top,32px)) 24px max(32px,env(safe-area-inset-bottom,32px))",
          textAlign:"center",overflowY:"auto"}}>

          {/* Lang picker (fades in après intro) — un seul drapeau visible, déroule les autres */}
          <div className="fade-in" style={{position:"fixed",top:"calc(14px + env(safe-area-inset-top,0px))",
            right:14,opacity:introDone?1:0,zIndex:5}}>
            <button onClick={()=>setLangOpen(!langOpen)}
              style={{background:"#ffffff",border:"1px solid #0a1228",
                color:"#0a1228",padding:"4px 8px",fontSize:20,lineHeight:1,
                cursor:"pointer",fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
                display:"flex",alignItems:"center",gap:4,transition:"all .15s"}}
              title={lang}>
              {FLAGS[lang]} <span style={{fontSize:8,color:"#0a1228"}}>▾</span>
            </button>
            {langOpen&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                background:"#ffffff",border:"1px solid #0a1228",
                minWidth:44,boxShadow:"0 4px 20px rgba(10,18,40,0.10)"}}>
                {LANGS.filter(l=>l!==lang).map(l=>(
                  <button key={l}
                    onClick={()=>{setLang(l);setLangOpen(false);}}
                    style={{display:"block",width:"100%",background:"none",border:"none",
                      borderBottom:"1px solid #ffffff",padding:"8px 0",fontSize:20,lineHeight:1,
                      cursor:"pointer",fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
                      color:"#0a1228",textAlign:"center"}}
                    title={l}>
                    {FLAGS[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logo central : statique navy+blanc (cliquable) AVANT clic, animé APRÈS */}
          {!started ? (
            <div onClick={handleStartLogo} role="button" tabIndex={0}
              onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();handleStartLogo();}}}
              style={{width:104,height:104,borderRadius:"50%",overflow:"hidden",
                cursor:"pointer",flexShrink:0,background:"#ffffff",
                animation:"introPulse 2.2s ease-in-out infinite",
                transition:"transform .2s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.06)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
              <img src={IMG.logo_static} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()}
                style={{width:"100%",height:"100%",objectFit:"cover",
                  objectPosition:"center",display:"block",pointerEvents:"none"}}/>
            </div>
          ) : (
            <>
              {/* Flash subliminal plein écran : 3 apparitions ultra-rapides
                  après la chute du cœur, avant la chute de l'aubergine */}
              <img className="intro-flash" src={IMG.flash} alt=""
                draggable={false} onContextMenu={e=>e.preventDefault()}/>
              <div className="intro-stage">
                <div className="intro-wrap">
                  <img className="intro-base" src={IMG.logo_base} alt=""
                    draggable={false} onContextMenu={e=>e.preventDefault()}/>
                  <img className="intro-heart" src={IMG.logo_heart} alt=""
                    draggable={false} onContextMenu={e=>e.preventDefault()}/>
                  <img className="intro-aub" src={IMG.aubergine} alt=""
                    draggable={false} onContextMenu={e=>e.preventDefault()}/>
                </div>
              </div>
            </>
          )}

          {/* Tout le reste : fade-in après intro */}
          <div className="fade-in" style={{display:"flex",flexDirection:"column",
            alignItems:"center",width:"100%",opacity:introDone?1:0}}>
          <div style={{height:18}}/>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(22px,5.4vw,34px)",color:"#0a1228",marginBottom:4,lineHeight:1.2}}>
            I Love You Moneypenis
          </h1>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:10,
            letterSpacing:3,color:"#0a1228",marginBottom:4,textTransform:"uppercase"}}>
            Sébastien Moreu & André Vaszkievicz · Paris 2024
          </p>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:9,
            letterSpacing:4,color:"#0a1228",marginBottom:22,textTransform:"uppercase"}}>
            {t.aw}
          </p>

          {/* ── Note des auteurs · repliable ───────────────────────────────── */}
          <div style={{background:"#ffffff",border:"1px solid #0a1228",
            padding:"16px 20px",maxWidth:420,width:"100%",marginBottom:14,textAlign:"left"}}>
            <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:13.5,color:"#0a1228",marginBottom:10,
              letterSpacing:".02em"}}>
              {t.nat}
            </p>
            {(showNote?t.naf.split("\n\n"):[t.naf.split("\n\n")[0]]).map((para,j)=>(
              <p key={j} style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:11,color:"#0a1228",lineHeight:1.7,marginBottom:9}}>
                {para}
              </p>
            ))}
            <button onClick={()=>setShowNote(!showNote)}
              style={{background:"none",border:"none",padding:"4px 0",marginTop:2,
                cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
                fontSize:9.5,letterSpacing:2,color:"#0a1228",
                textTransform:"uppercase",textAlign:"left"}}>
              {showNote?t.nac:t.nax}
            </button>
          </div>

          {/* Declaration + actions · bloc unique compact */}
          <div style={{background:"#ffffff",border:"1px solid #0a1228",
            padding:"14px 16px 16px",maxWidth:380,width:"100%",marginBottom:18,textAlign:"left"}}>
            <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:10.5,
              color:"#0a1228",lineHeight:1.6,marginBottom:11}}>{t.am}</p>

            <label style={{display:"flex",alignItems:"flex-start",gap:9,
              cursor:"pointer",marginBottom:8}}>
              <input type="checkbox" checked={ck1} onChange={e=>setCk1(e.target.checked)}
                style={{marginTop:2,width:14,height:14,accentColor:"#0a1228",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:10.5,color:"#0a1228",lineHeight:1.45}}>{t.ck1}</span>
            </label>

            <label style={{display:"flex",alignItems:"flex-start",gap:9,
              cursor:"pointer",marginBottom:14}}>
              <input type="checkbox" checked={ck2} onChange={e=>setCk2(e.target.checked)}
                style={{marginTop:2,width:14,height:14,accentColor:"#0a1228",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:10.5,color:"#0a1228",lineHeight:1.45}}>{t.ck2}</span>
            </label>

            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <button className="bs"
                style={{opacity:ck1&&ck2?1:0.35,transition:"opacity .2s",
                  cursor:ck1&&ck2?"pointer":"not-allowed",padding:"11px 22px",fontSize:10.5}}
                onClick={()=>{if(ck1&&ck2){setAgeOk(true);setDis(true);}}}>
                {t.ap}
              </button>
              <button className="bg" style={{padding:"11px 22px",fontSize:10.5}}
                onClick={()=>{setAgeOk(false);setDis(true);}}>
                {t.am2}
              </button>
            </div>
          </div>

          <div style={{marginTop:4,display:"flex",gap:16,fontSize:10,color:"#0a1228",
            letterSpacing:1,fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
            <a href={`https://${t.si}`} style={{color:"#0a1228",textDecoration:"none"}}>{t.si}</a>
            <span>·</span>
            <a href={`https://${t.pv}`} style={{color:"#0a1228",textDecoration:"none"}}>{t.pv}</a>
          </div>
          </div>{/* /fade-in wrapper */}
        </div>
      )}

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:800,
        background:"rgba(255,255,255,0.97)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid #0a1228",paddingTop:"env(safe-area-inset-top,0px)"}}>
        <div style={{height:52,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 14px",gap:8}}>

          {/* AVSM PRINTS · plus gros, sans logo Moneypenis à côté */}
          <div style={{display:"flex",alignItems:"center",cursor:"pointer",flexShrink:0}}
            onClick={()=>goSec("portfolio")}>
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
              fontSize:11,letterSpacing:3.5,color:"#0a1228",whiteSpace:"nowrap"}}>
              A.V.S.M PRINTS
            </span>
          </div>

          {/* Right controls */}
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>

            {/* Lang dropdown · drapeau */}
            <div style={{position:"relative"}}>
              <button onClick={()=>{setLangOpen(!langOpen);setMenuOpen(false);}}
                style={{background:"none",border:"1px solid #0a1228",color:"#0a1228",
                  padding:"4px 8px",fontSize:16,lineHeight:1,cursor:"pointer",
                  fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
                  display:"flex",alignItems:"center",gap:4,transition:"all .2s"}}
                title={lang}>
                {FLAGS[lang]} <span style={{fontSize:8,color:"#0a1228"}}>▾</span>
              </button>
              {langOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                  background:"#ffffff",border:"1px solid #0a1228",zIndex:900,
                  minWidth:44,boxShadow:"0 4px 20px rgba(10,18,40,0.10)"}}>
                  {LANGS.filter(l=>l!==lang).map(l=>(
                    <button key={l}
                      onClick={()=>{setLang(l);setLangOpen(false);}}
                      style={{display:"block",width:"100%",background:"none",border:"none",
                        borderBottom:"1px solid #ffffff",padding:"8px 0",fontSize:16,lineHeight:1,
                        cursor:"pointer",fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
                        color:"#0a1228",textAlign:"center"}}
                      title={l}>
                      {FLAGS[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 18+ toggle */}
            <button onClick={()=>{if(!ageOk){setDis(false);}else{setAgeOk(false);}setLangOpen(false);}}
              style={{background:"none",
                border:`1px solid ${ageOk?"#0a1228":"#0a1228"}`,
                color:ageOk?"#0a1228":"#0a1228",padding:"5px 7px",fontSize:8,
                letterSpacing:1,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
                fontWeight:400,transition:"all .2s",whiteSpace:"nowrap"}}>
              {ageOk?"● 18+":"○ 18+"}
            </button>

            {/* Burger */}
            <button onClick={()=>{setMenuOpen(!menuOpen);setLangOpen(false);}}
              style={{background:"none",border:"1px solid #0a1228",cursor:"pointer",
                padding:"7px 9px",display:"flex",flexDirection:"column",gap:4,
                alignItems:"center",transition:"all .2s"}}>
              <span style={{display:"block",width:18,height:1.5,background:"#0a1228",
                transition:"all .25s",
                transform:menuOpen?"rotate(45deg) translate(4px,4px)":"none"}}/>
              <span style={{display:"block",width:18,height:1.5,
                background:menuOpen?"transparent":"#0a1228",transition:"all .25s"}}/>
              <span style={{display:"block",width:18,height:1.5,background:"#0a1228",
                transition:"all .25s",
                transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"none"}}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MENU OVERLAY ══════════════════════════════════════════════════════ */}
      {menuOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:790,
          background:"rgba(255,255,255,0.98)",backdropFilter:"blur(20px)",
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
          padding:"60px 20px 44px",borderBottom:"1px solid #0a1228"}}>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:8,
            letterSpacing:5,color:"#0a1228",marginBottom:12,textTransform:"uppercase"}}>
            {t.hl}
          </p>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(28px,6.5vw,72px)",lineHeight:1.15,color:"#0a1228",
            marginBottom:12,whiteSpace:"pre-line"}}>{t.ht}</h1>
          <p style={{color:"#0a1228",fontSize:13,letterSpacing:2,marginBottom:4,fontWeight:400}}>
            {t.hs}
          </p>
          <p style={{color:"#0a1228",fontSize:11,letterSpacing:1,marginBottom:20}}>{t.hy}</p>
          <p style={{color:"#0a1228",fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",
            maxWidth:460,margin:"0 auto 24px",fontWeight:400}}>{t.hd}</p>
          <button className="bg" style={{width:"auto",display:"inline-block"}}
            onClick={()=>document.getElementById("pg")?.scrollIntoView({behavior:"smooth"})}>
            {t.hc}
          </button>
        </div>

        <div style={{maxWidth:860,margin:"0 auto",padding:"40px 14px 70px"}}>

          {/* ══ Section : OUVERTURE ═══════════════════════════════════════ */}
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:18}}>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
              fontSize:"clamp(20px,3.5vw,36px)"}}>{t.op}</h2>
          </div>

          {/* Planche 0 : recto+verso côte à côte façon tirage paysage */}
          <div className="hs"
            style={{display:"flex",alignItems:"stretch",
              borderBottom:"1px solid #0a1228",background:"#ffffff",marginBottom:60}}
            onMouseEnter={e=>e.currentTarget.style.background="#ffffff"}
            onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}>

            {/* Image column (recto + verso côte à côte) — même largeur qu'un tirage paysage */}
            <div style={{flex:"0 0 auto",width:"40%",display:"grid",
              gridTemplateColumns:"1fr 1fr",gap:6,padding:6,background:"#ffffff"}}>
              <div onClick={()=>setPlanchePreview("recto")}
                style={{cursor:"pointer",display:"flex",flexDirection:"column",
                  alignItems:"center",gap:4}}>
                <img src={IMG.planche_recto} alt="Recto"
                  style={{width:"100%",height:"auto",display:"block"}}/>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                  fontSize:8,letterSpacing:3,color:"#0a1228",textTransform:"uppercase"}}>Recto</span>
              </div>
              <div onClick={()=>setPlanchePreview("verso")}
                style={{cursor:"pointer",display:"flex",flexDirection:"column",
                  alignItems:"center",gap:4}}>
                <img src={IMG.planche_verso} alt="Verso"
                  style={{width:"100%",height:"auto",display:"block"}}/>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                  fontSize:8,letterSpacing:3,color:"#0a1228",textTransform:"uppercase"}}>Verso</span>
              </div>
            </div>

            {/* Caption à droite */}
            <div style={{flex:1,padding:"20px 18px",display:"flex",
              flexDirection:"column",justifyContent:"center",gap:7}}>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
                fontSize:"clamp(13px,1.8vw,18px)",color:"#0a1228",letterSpacing:3,
                textTransform:"uppercase",lineHeight:1.3}}>
                I.L.Y.M. · 0
              </p>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:10,color:"#0a1228"}}>{t.op} · Recto-verso</p>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:9,color:"#0a1228",lineHeight:1.6}}>{t.pl0}</p>
            </div>
          </div>

          {/* ══ Section : LES 11 TIRAGES ══════════════════════════════════ */}
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
              fontSize:"clamp(20px,3.5vw,36px)"}}>{t.pt}</h2>
            <span style={{color:"#0a1228",fontSize:9,letterSpacing:3,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>— XI</span>
          </div>
          <p style={{color:"#0a1228",fontSize:12,lineHeight:1.9,whiteSpace:"pre-line",
            marginBottom:32,fontWeight:400}}>{t.ps}</p>

          <div id="pg" style={{display:"flex",flexDirection:"column"}}>
            {PRINTS.map((p,idx)=>(
              <div key={p.id} className="hs"
                style={{display:"flex",alignItems:"stretch",
                  background:"#ffffff",cursor:"pointer",marginBottom:28}}
                onClick={()=>setLb(idx)}
                onMouseEnter={e=>e.currentTarget.style.background="#ffffff"}
                onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}>
                <div style={{flexShrink:0,width:"32%",maxWidth:200,background:"#ffffff"}}>
                  <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
                </div>
                <div style={{flex:1,padding:"20px 18px",display:"flex",
                  flexDirection:"column",justifyContent:"center",gap:7}}>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
                    fontSize:"clamp(13px,1.8vw,18px)",color:"#0a1228",letterSpacing:3,
                    textTransform:"uppercase",lineHeight:1.3}}>
                    I.L.Y.M. · {p.num}
                  </p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                    fontSize:10,color:"#0a1228",lineHeight:1.5}}>{t.techs?.[p.id-1]||p.tech}</p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                    fontSize:9,color:"#0a1228",lineHeight:1.6,marginTop:2}}>{t.tech_info}</p>
                  <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                    fontSize:8,color:"#0a1228",letterSpacing:2,textTransform:"uppercase",
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
              style={{background:"none",border:"none",cursor:"pointer",color:"#0a1228",
                fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.vt}</h2>
          </div>
          <p style={{color:"#0a1228",fontSize:11,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,marginBottom:28}}>
            {t.vs}
          </p>
          <div style={{background:"#0a1228",border:"1px solid #0a1228"}}>
            <video src={ageOk?VID.full:VID.gate} controls preload="metadata"
              onContextMenu={e=>e.preventDefault()}
              style={{width:"100%",display:"block",background:"#0a1228"}}/>
          </div>
          <p style={{color:"#0a1228",fontSize:8,letterSpacing:2,marginTop:8,
            textAlign:"right",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
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
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.ct}</h2>
          </div>
          <div style={{color:"#0a1228",fontSize:12,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,marginBottom:32}}>
            {t.cs}
          </div>

          {/* ──────── Hero : vue d'ensemble ──────── */}
          <div style={{background:"#ffffff",marginBottom:244}}>
            <img src={IMG.coffrets_flat} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"8px 14px",color:"#0a1228",fontSize:10,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              Les 2 coffrets · Petit Format + Grand Format
            </p>
          </div>

          {/* ──────── PETIT FORMAT ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#0a1228",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Petit Format · 30 × 40 cm
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#0a1228",marginLeft:14,
              textTransform:"uppercase",fontWeight:400}}>50 portfolios · 01 → 50</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
            {[{src:IMG.coffret_pf_print,cap:"Coffret PF fermé · Tirage I extrait"},
              {src:IMG.box_open,        cap:"Coffret PF ouvert · Colophon"}].map((im,i)=>(
              <div key={i} style={{background:"#ffffff",border:"1px solid #0a1228"}}>
                <img src={im.src} alt="" draggable={false}
                  onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
                <p style={{padding:"6px 10px",color:"#0a1228",fontSize:9,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>{im.cap}</p>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
            <div style={{background:"#ffffff",border:"1px solid #0a1228"}}>
              <PImg src={IMG.open_pf} ageOk={ageOk} bz={[{t:18,l:52,w:42,h:62,lb:""}]}/>
              <p style={{padding:"6px 10px",color:"#0a1228",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                Coffret PF ouvert · Tirage V
              </p>
            </div>
            <div style={{background:"#ffffff",border:"1px solid #0a1228"}}>
              <img src={IMG.open_pf_2} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
              <p style={{padding:"6px 10px",color:"#0a1228",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                Coffret PF ouvert · Premières pages
              </p>
            </div>
          </div>

          {/* ──────── GRAND FORMAT ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#0a1228",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Grand Format · 50 × 70 cm
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#0a1228",marginLeft:14,
              textTransform:"uppercase",fontWeight:400}}>15 portfolios · 01 → 15</span>
          </h3>
          <div style={{display:"flex",justifyContent:"center",
            background:"#ffffff",border:"1px solid #0a1228"}}>
            <div style={{maxWidth:540,width:"100%"}}>
              <img src={IMG.coffret_gf_closed} alt="" draggable={false}
                onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
              <p style={{padding:"6px 10px",color:"#0a1228",fontSize:9,
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                Coffret GF fermé
              </p>
            </div>
          </div>

          {/* ──────── COMPARATIF DES FORMATS ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#0a1228",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Comparatif des formats
          </h3>
          <div style={{background:"#ffffff",border:"1px solid #0a1228"}}>
            <PImg src={IMG.warning_cmp} ageOk={ageOk}
              bz={[{t:36,l:10,w:22,h:42,lb:""},{t:25,l:46,w:50,h:65,lb:""}]}/>
            <p style={{padding:"8px 14px",color:"#0a1228",fontSize:10,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              Tirage VIII — WARNING! · PF (30 × 40) vs GF (50 × 70)
            </p>
          </div>

          {/* ──────── LE CONTENU ──────── */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#0a1228",
            marginTop:30,marginBottom:14,letterSpacing:.3}}>
            Les 11 tirages
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
            {[{src:IMG.fan,         cap:"Vue éventail · Drap blanc"},
              {src:IMG.prints_line, cap:"Alignement · Les 11 planches"}].map((im,i)=>(
              <div key={i} style={{background:"#ffffff",border:"1px solid #0a1228"}}>
                <img src={im.src} alt="" draggable={false}
                  onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
                <p style={{padding:"6px 10px",color:"#0a1228",fontSize:9,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>{im.cap}</p>
              </div>
            ))}
          </div>
          <div style={{background:"#ffffff",border:"1px solid #0a1228"}}>
            <img src={IMG.coffret_detail} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 10px",color:"#0a1228",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              Détail · Intérieur du coffret
            </p>
          </div>
        </div>
      )}

      {/* ══ CHEZ VOUS ════════════════════════════════════════════════════════ */}
      {sec==="insitu"&&(
        <div style={{maxWidth:1140,margin:"60px auto",padding:"0 14px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.zt}</h2>
          </div>
          <p style={{color:"#0a1228",fontSize:12,letterSpacing:1,
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,marginBottom:32}}>
            {t.zs}
          </p>
          <div style={{background:"#ffffff",marginBottom:24}}>
            <img src={ageOk?IMG.inside:IMG.inside_blur} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 12px",color:"#0a1228",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              Les 11 tirages encadrés · Chambre · Paris
            </p>
          </div>
          <div style={{background:"#ffffff",marginBottom:24}}>
            <img src={ageOk?IMG.outside:IMG.outside_blur} alt="" draggable={false}
              onContextMenu={e=>e.preventDefault()} style={{width:"100%",display:"block"}}/>
            <p style={{padding:"6px 12px",color:"#0a1228",fontSize:9,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              Les 11 tirages encadrés · Atelier · Paris
            </p>
          </div>
        </div>
      )}

      {/* ══ SHOP ═════════════════════════════════════════════════════════════ */}
      {sec==="shop"&&(
        ageOk ? (
          <>
            {/* Bandeau d'en-tête : présent uniquement sur la liste */}
            {shopView==="list"&&(
              <div style={{background:"#ffffff",textAlign:"center",padding:"60px 20px 40px"}}>
                <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:8,
                  letterSpacing:5,color:"#0a1228",marginBottom:14,textTransform:"uppercase"}}>
                  {t.hl}
                </p>
                <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
                  fontSize:"clamp(28px,5vw,52px)",lineHeight:1.2,color:"#0a1228",
                  marginBottom:18}}>{t.st}</h1>
                <div style={{width:36,height:1,background:"#0a1228",margin:"0 auto 18px"}}/>
                <p style={{color:"#0a1228",fontSize:12,lineHeight:1.8,maxWidth:520,
                  margin:"0 auto",fontWeight:400}}>
                  {t.ps}
                </p>
              </div>
            )}

            {/* ── VUE : LISTE (3 univers) ────────────────────────────── */}
            {shopView==="list"&&(
              <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 18px 40px"}}>
                <div style={{display:"grid",
                  gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:32}}>

                  {/* Petit Format — cliquable */}
                  <div onClick={()=>setShopView("pf")}
                    style={{cursor:"pointer",transition:"opacity .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity=.75}
                    onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                    <img src={IMG.coffret_pf_print} alt="" draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",display:"block",marginBottom:14}}/>
                    <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:9,
                      letterSpacing:4,color:"#0a1228",marginBottom:6,textTransform:"uppercase"}}>
                      {t.pft}
                    </p>
                    <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.shPfD}
                    </p>
                    <p style={{color:"#0a1228",fontSize:10,opacity:.7,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.pfi}
                    </p>
                  </div>

                  {/* Grand Format — cliquable */}
                  <div onClick={()=>setShopView("gf")}
                    style={{cursor:"pointer",transition:"opacity .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity=.75}
                    onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                    <img src={IMG.coffret_gf_closed} alt="" draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",display:"block",marginBottom:14}}/>
                    <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:9,
                      letterSpacing:4,color:"#0a1228",marginBottom:6,textTransform:"uppercase"}}>
                      {t.gft}
                    </p>
                    <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.shGfD}
                    </p>
                    <p style={{color:"#0a1228",fontSize:10,opacity:.7,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.gfi}
                    </p>
                  </div>

                  {/* Planches à l'unité — cliquable */}
                  <div onClick={()=>setShopView("singles")}
                    style={{cursor:"pointer",transition:"opacity .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.opacity=.75}
                    onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3,
                      marginBottom:14}}>
                      {PRINTS.slice(0,8).map(p=>(
                        <div key={p.id} style={{background:"#ffffff"}}>
                          <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
                        </div>
                      ))}
                    </div>
                    <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:9,
                      letterSpacing:4,color:"#0a1228",marginBottom:6,textTransform:"uppercase"}}>
                      {t.shUn}
                    </p>
                    <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.shUnD}
                    </p>
                  </div>
                </div>

                {/* Mention bas : tarifs + conditions pro */}
                <div style={{textAlign:"center",padding:"40px 0 0",maxWidth:520,margin:"0 auto"}}>
                  <p style={{color:"#0a1228",fontSize:10,opacity:.7,lineHeight:1.7,
                    fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                    {t.siNote}
                  </p>
                  <p style={{color:"#0a1228",fontSize:10,opacity:.7,marginTop:6,
                    fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontStyle:"italic",
                    lineHeight:1.7}}>
                    {t.siPro}
                  </p>
                </div>
              </div>
            )}

            {/* ── VUE : DÉTAIL PRODUIT (PF ou GF) ─────────────────────── */}
            {(shopView==="pf"||shopView==="gf")&&(()=>{
              const isP=shopView==="pf";
              return(
                <div style={{maxWidth:900,margin:"60px auto",padding:"0 18px 70px"}}>
                  {/* Lien retour */}
                  <button onClick={()=>setShopView("list")}
                    style={{background:"none",border:"none",cursor:"pointer",
                      color:"#0a1228",fontSize:10,letterSpacing:3,padding:"0 0 24px",
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                      textTransform:"uppercase"}}>
                    ← {t.st}
                  </button>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36,
                    alignItems:"flex-start"}}>
                    <img src={isP?IMG.coffret_pf_print:IMG.coffret_gf_closed} alt=""
                      draggable={false} onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",display:"block"}}/>
                    <div>
                      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:9,
                        letterSpacing:5,color:"#0a1228",marginBottom:14,textTransform:"uppercase"}}>
                        {isP?t.pft:t.gft}
                      </p>
                      <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                        fontWeight:400,fontSize:"clamp(22px,3.5vw,32px)",color:"#0a1228",
                        marginBottom:16,lineHeight:1.3}}>
                        {isP?t.shPfD:t.shGfD}
                      </h2>
                      <div style={{width:36,height:1,background:"#0a1228",marginBottom:18}}/>
                      <p style={{color:"#0a1228",fontSize:13,lineHeight:1.8,marginBottom:10,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                        {isP?t.pfc:t.gfc}
                      </p>
                      <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,marginBottom:6,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                        {t.sg}
                      </p>
                      <p style={{color:"#0a1228",fontSize:10,opacity:.7,marginBottom:24,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                        {isP?t.pfi:t.gfi}
                      </p>
                      <button onClick={()=>openDemandFor(isP?"PF":"GF")} className="bg"
                        style={{width:"auto",display:"inline-block"}}>
                        {t.req}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── VUE : LISTE DES 11 PLANCHES ─────────────────────────── */}
            {shopView==="singles"&&(
              <div style={{maxWidth:1100,margin:"60px auto",padding:"0 18px 70px"}}>
                <button onClick={()=>setShopView("list")}
                  style={{background:"none",border:"none",cursor:"pointer",
                    color:"#0a1228",fontSize:10,letterSpacing:3,padding:"0 0 12px",
                    fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                    textTransform:"uppercase"}}>
                  ← {t.st}
                </button>
                <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                  fontWeight:400,fontSize:"clamp(22px,4vw,32px)",color:"#0a1228",
                  marginBottom:6}}>{t.shUn}</h2>
                <p style={{color:"#0a1228",fontSize:12,letterSpacing:1,marginBottom:30,
                  fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>{t.shUnD}</p>
                <div style={{display:"grid",
                  gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:18}}>
                  {PRINTS.map((p,idx)=>(
                    <div key={p.id} onClick={()=>setShopView(`single-${idx}`)}
                      style={{cursor:"pointer",transition:"opacity .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.opacity=.75}
                      onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                      <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
                      <p style={{padding:"8px 4px 0",color:"#0a1228",fontSize:9,
                        letterSpacing:2,textAlign:"center",
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
                        textTransform:"uppercase"}}>
                        I.L.Y.M. · {p.num}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── VUE : DÉTAIL D'UNE PLANCHE ──────────────────────────── */}
            {shopView.startsWith("single-")&&(()=>{
              const idx=parseInt(shopView.slice(7),10);
              const p=PRINTS[idx];
              if(!p) return null;
              return(
                <div style={{maxWidth:900,margin:"60px auto",padding:"0 18px 70px"}}>
                  <button onClick={()=>setShopView("singles")}
                    style={{background:"none",border:"none",cursor:"pointer",
                      color:"#0a1228",fontSize:10,letterSpacing:3,padding:"0 0 24px",
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                      textTransform:"uppercase"}}>
                    ← {t.shUn}
                  </button>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36,
                    alignItems:"flex-start"}}>
                    <PImg src={p.src} ageOk={ageOk} bz={p.bz}/>
                    <div>
                      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:9,
                        letterSpacing:5,color:"#0a1228",marginBottom:14,textTransform:"uppercase"}}>
                        I.L.Y.M. · {p.num}
                      </p>
                      <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                        fontWeight:400,fontSize:"clamp(22px,3.5vw,32px)",color:"#0a1228",
                        marginBottom:16,lineHeight:1.3}}>
                        Planche {p.num}
                      </h2>
                      <div style={{width:36,height:1,background:"#0a1228",marginBottom:18}}/>
                      <p style={{color:"#0a1228",fontSize:13,lineHeight:1.8,marginBottom:24,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,whiteSpace:"pre-line"}}>
                        {t.techs?.[p.id-1]||p.tech}
                      </p>
                      <button onClick={()=>openDemandFor(p.num)} className="bg"
                        style={{width:"auto",display:"inline-block"}}>
                        {t.req}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          /* -18 : pas de shop accessible */
          <div style={{maxWidth:520,margin:"120px auto",padding:"0 24px",textAlign:"center"}}>
            <Logo sz={48}/>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(22px,4vw,34px)",color:"#0a1228",
              marginTop:24,marginBottom:16}}>{t.st}</h2>
            <div style={{width:36,height:1,background:"#0a1228",margin:"0 auto 22px"}}/>
            <p style={{color:"#0a1228",fontSize:14,lineHeight:1.8,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              {t.reqAge}
            </p>
            <button onClick={()=>goSec("portfolio")} className="bg"
              style={{marginTop:30,display:"inline-block",width:"auto"}}>
              ← {t.nav[0]}
            </button>
          </div>
        )
      )}

      {/* ══ BIO ══════════════════════════════════════════════════════════════ */}
      {sec==="bio"&&(
        <div style={{maxWidth:840,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:40}}>
            <button onClick={()=>goSec("portfolio")}
              style={{background:"none",border:"none",cursor:"pointer",
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"0 4px 0 0"}}>←</button>
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
                    border:"1px solid #0a1228",margin:"0 auto"}}>
                    <img src={a.ph} alt={a.n} draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:400,fontSize:8,color:"#0a1228",letterSpacing:2,marginTop:8}}>
                    {a.i}
                  </p>
                </div>
                <div>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                    fontSize:21,fontWeight:400,marginBottom:12}}>{a.n}</p>
                  {a.b.split("\n\n").map((para,j)=>(
                    <p key={j} style={{color:"#0a1228",fontSize:14,lineHeight:1.9,fontWeight:400,
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
                  borderBottom:"1px solid #0a1228"}}>
                  <div style={{width:100,height:100,borderRadius:"50%",overflow:"hidden",
                    border:"1px solid #0a1228"}}>
                    <img src={IMG.portrait_duo} alt="Sébastien & André" draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:400,fontSize:8,color:"#0a1228",letterSpacing:2,marginTop:10,
                    fontStyle:"italic"}}>
                    S.M. & A.V.
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Signature photos grid AFTER bios — with conditional blur on sex-revealing prints */}
          <h3 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
            fontWeight:400,fontSize:"clamp(15px,2.4vw,22px)",color:"#0a1228",
            marginTop:10,marginBottom:14,letterSpacing:.3}}>
            Séance de signature
            <span style={{fontFamily:"'Space Grotesk',sans-serif",fontStyle:"normal",
              fontSize:9,letterSpacing:3,color:"#0a1228",marginLeft:14,
              textTransform:"uppercase",fontWeight:400}}>Paris · 2024</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
            gap:2,background:"#0a1228"}}>
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

      
      {/* ══ JEU ═════════════════════════════════════════════════════════════ */}
      {sec==="jeu"&&<MoneypenisGame/>}

      {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
      {sec==="contact"&&(
        <div style={{maxWidth:780,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <Logo sz={48}/>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(26px,4.5vw,42px)",color:"#0a1228",
              marginTop:18,marginBottom:8}}>{t.nt}</h2>
            <div style={{width:36,height:1,background:"#0a1228",margin:"0 auto"}}/>
          </div>
          <ContactForm t={t} lang={lang}
            d={formData} setD={setFormData}
            matrix={formMatrix} setMatrix={setFormMatrix}
            result={formResult} setResult={setFormResult}
            onContinue={continueShop}
            onSuccess={()=>{onFormSuccess(); setSec("shop");}}/>
        </div>
      )}

      </div>{/* paddingTop */}

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{borderTop:"1px solid #0a1228",
        padding:"16px 18px calc(16px + env(safe-area-inset-bottom,0px))",
        background:"#ffffff",display:"flex",justifyContent:"space-between",
        alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <Logo sz={20}/>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
            fontSize:8,letterSpacing:4,color:"#0a1228"}}>A.V.S.M PRINTS</span>
        </div>
        <p style={{color:"#0a1228",fontSize:8,whiteSpace:"pre-line",textAlign:"center",
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,letterSpacing:.3}}>
          {t.lg}
        </p>
        <a href={`https://${t.pv}`}
          style={{color:"#0a1228",fontSize:8,letterSpacing:1,textDecoration:"none",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>{t.pv}</a>
      </footer>

      {/* ══ LIGHTBOX ═════════════════════════════════════════════════════════ */}
      {lb!==null&&(
        <LBox prints={PRINTS} ci={lb} ageOk={ageOk} lang={lang}
          onClose={()=>setLb(null)}
          onPrev={e=>{e.stopPropagation();setLb(i=>Math.max(0,i-1));}}
          onNext={e=>{e.stopPropagation();setLb(i=>Math.min(PRINTS.length-1,i+1));}}
          t={t}/>
      )}

      {/* ══ PREVIEW PLANCHE 0 (recto/verso colophon) ═════════════════════════ */}
      {(planchePreview==="recto"||planchePreview==="verso")&&(
        <div onClick={()=>setPlanchePreview(null)}
          style={{position:"fixed",inset:0,zIndex:10000,
            background:"rgba(10,18,40,0.92)",display:"flex",
            alignItems:"center",justifyContent:"center",padding:20,cursor:"pointer"}}>
          <img src={planchePreview==="recto"?IMG.planche_recto:IMG.planche_verso}
            alt={planchePreview}
            style={{maxWidth:"96%",maxHeight:"96%",objectFit:"contain",display:"block"}}/>
          <button onClick={(e)=>{e.stopPropagation();setPlanchePreview(null);}}
            style={{position:"absolute",top:"calc(14px + env(safe-area-inset-top,0px))",
              right:14,background:"none",border:"1px solid #ffffff",color:"#ffffff",
              padding:"6px 14px",fontSize:10,letterSpacing:3,cursor:"pointer",
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
              textTransform:"uppercase"}}>✕</button>
        </div>
      )}

      {/* ══ BANDEAU IA : disparaît au clic ════════════════════════════════════ */}
      {lang!=="FR"&&!bannerDismissed&&(
        <div className="ai-warn-banner"
          onClick={()=>setBannerDismissed(true)}
          title="Cliquer pour fermer">
          <div className="ai-warn-track">
            {t.aiWarn}&nbsp;&nbsp;·&nbsp;&nbsp;{t.aiWarn}&nbsp;&nbsp;·&nbsp;&nbsp;{t.aiWarn}
          </div>
        </div>
      )}

      {/* ══ BOUTON SKIP : rendu via portal pour échapper à tout conteneur CSS ═ */}
      {started&&!introDone&&typeof document!=="undefined"&&createPortal(
        <button onClick={handleSkipIntro}
          style={{position:"fixed",bottom:"calc(60px + env(safe-area-inset-bottom,0px))",
            left:"50%",transform:"translateX(-50%)",
            background:"none",border:"none",color:"#000000",
            fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,
            fontSize:20,letterSpacing:4,textTransform:"uppercase",
            cursor:"pointer",padding:"14px 32px",zIndex:2147483647,
            textShadow:"0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)"}}>
          SKIP
        </button>,
        document.body
      )}
    </div>
  );
}
