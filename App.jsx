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
const LANGS=["FR","EN","ES","PT","NL","DE","IT","EL","TR","PL","RU","UK","LT","AR","HE","FA","KO","中","日"];
const FLAGS={FR:"🇫🇷",EN:"🇬🇧",ES:"🇪🇸",PT:"🇧🇷",NL:"🇳🇱",DE:"🇩🇪",IT:"🇮🇹",EL:"🇬🇷",TR:"🇹🇷",PL:"🇵🇱",RU:"🇷🇺",UK:"🇺🇦",LT:"🇱🇹",AR:"🇸🇦",HE:"🇮🇱",FA:"🇮🇷",KO:"🇰🇷","中":"🇨🇳","日":"🇯🇵"};
const RTL_LANGS=["AR","HE","FA"];

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
  FR:{techs:["Poème · Croix dorée","Lettre manuscrite · Encre marine · Sculpture","Photographie couleur · Texte jaune","Tirage argentique · Encre verte manuscrite","Photo couleur · Texte rouge · Cravate Hermès","Photographie couleur · Jean ouvert · Nature","Photo teintée cyan · Lettre manuscrite orange","Texte rouge · NB · Avertissement multilingue","Lettre manuscrite · Billets 50€ · Mains","Texte rouge · NB · Manifeste","Lettre manuscrite · Fond fleuri · Encre marine"],aw:"Contenu Explicite · Adultes Avertis",am:"Ce site présente des œuvres photographiques destinées exclusivement aux adultes avertis.",ap:"+ 18 ans — Version complète",am2:"− 18 ans — Version grand public",nav:["I Love You Moneypenis","Le Clip Teaser","Les précieux coffrets","In Situ aimes ça","Le prix des aubergines","De jolies plumes vraiment…","🍆","I love you too","Ici tout recommence","Des feutres et des mains"],navPresse:"Trop d'honneurs pour peu de chair",hl:"Édition Limitée · Tirages Argentiques Originaux",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Un Conte de Fées Pop Porn Gay, destiné aux adultes avertis.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Découvrir l'œuvre",pt:"I Love You Moneypenis",ps:"11 tirages argentiques originaux · Traphot, Montrouge\nSignés et numérotés par Sébastien Moreu & André Vaszkievicz",mg:"Cliquer pour agrandir",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Tirage argentique · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Impression sur papier Arches · Numérotée et signée à la main par les deux artistes",op:"Ouverture",tx:"Texte",pr:"Œuvre protégée · Filigrane numérique",ct:"Le Coffret",cs:"Portfolio complet · 11 tirages argentiques · Signés & numérotés · Gants inclus",zt:"In Situ",zs:"Les œuvres en situation",vt:"Film",vs:"Contenu réservé aux adultes avertis",st:"Acquérir",pft:"Petit Format  30 × 40 cm",pfc:"50 portfolios numérotés 01/50 → 50/50",pfi:"ISBN : 978-2-492649-21-9",gft:"Grand Format  50 × 70 cm",gfc:"15 portfolios numérotés 01/15 → 15/15",gfi:"ISBN : 978-2-492649-20-2",sg:"Signés S.M. & A.V. · Numéro sur chaque tirage · Gants inclus",pd:"Traphot, Montrouge",p1:"Portfolio PF complet",p2:"Tirage séparé PF",p3:"Portfolio GF complet",p4:"Tirage séparé GF",sh:"Transport & Assurance",sb:"Emballage muséal · DHL Express\nFrance 45 € · Europe 95 € · International 180 €\nAssurance incluse",py:"Paiement",pb:"Virement · Carte · PayPal · 3× sans frais",co:"Conditions",cb:"Certificat d'authenticité · Retour 14 jours · TVA selon pays",rv:"Réserver",by:"Acquérir",bt:"Bio & Signatures",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — qui rappelle, comme une forme de résignation stylistique, que tout le monde l'a toujours appelé Sébastien — est ce qui arrive quand la discipline et la volonté se refusent à domestiquer l'obsession.\n\nNé le 25 décembre 1972 dans un décor trop parfait pour être innocent — Saint-Tropez — il grandit dans l'ombre de la précision, un père dentiste façonnant des bouches, et du mythe : résistants, marins, disparus, fantômes familiaux qui refusent de rester enterrés. À dix ans, on lui remet un arsenal complet de peinture. Pas un jouet. Une première arme chargée — début d'une collection baroque, celle d'un fou de guerres intimes.\n\nIl ne les rendra jamais. Préférant multiplier ses champs de bataille.\n\nIl avance par déplacements successifs : peinture, livres, images, relations humaines — tout devient matériau, tout peut être réassemblé. Ce qu'il construit n'est pas une œuvre au sens classique, mais un champ de tensions : entre mémoire et invention, fidélité et trahison, contrôle et perte.\n\nIl ne travaille pas pour les institutions. Il les infiltre. Depuis les années 90, dans l'orbite du galeriste Enrico Navarra, il construit une carrière qui refuse les étiquettes : ni tout à fait salarié, ni tout à fait artiste, ni simple éditeur — plutôt une anomalie productive, capable de générer livres, expositions, liens, archives, idées, communication, événements, à une cadence aussi époustouflante que discontinue. Un désordre qui sert de camouflage à cet homme qui détruit méthodiquement tous les cadres censés le contenir.\n\nIl participe activement à la conception et au développement de la collection Made By…, projet éditorial international consacré à la création contemporaine à travers différentes scènes culturelles. Dans ce cadre, il collabore étroitement avec le photographe Simon Schwyzer.\n\nSa relation avec Simon Schwyzer en est le cœur instable : une collaboration devenue dépendance, une amitié transformée en système amoureux. Un couple ? Depuis la mort brutale du photographe suisse, Moreu répond : « Demandez-lui. » Toujours est-il qu'après sa disparition, rien ne s'arrête — au contraire, tout s'intensifie. Travailler devient une manière de retenir, éditer une manière de prolonger, écrire une manière de ne pas céder. Il s'engage dans la préservation et la valorisation de son œuvre, notamment à travers la préparation de la publication de la monographie Made by… Simon Schwyzer.\n\nEn 2017, avec le soutien d'Enrico Navarra, il avait fondé les Éditions Sébastien Moreu, structure indépendante dédiée aux livres d'art, essais et projets éditoriaux transversaux. La mémoire du photographe suisse détruira l'entreprise. Pas les projets.\n\nPlus tard, avec André Vaszkievicz, l'intime change encore de forme. I Love You Moneypenis n'est pas un projet décoratif posé sur leur relation : c'est une collision de texte, d'image, de désir, d'argent, de corps. Une œuvre conçue depuis l'intérieur du lien, sans filtre protecteur. Leur mariage, le 19 octobre 2024 à Saint-Tropez, ne stabilise rien : il rend officiel ce qui débordait déjà.\n\nSon propre travail — collages, textes, dispositifs éditoriaux — relève d'une esthétique de l'exposition. Journaux ouverts, images découpées, mémoire traitée comme matière première. Rien n'est neutre. Tout est impliqué.\n\nPhysiquement, il porte un corps qui ne coopère pas toujours : cœur rapide, tension capricieuse, système sous pression. Et pourtant, il continue, avec des habitudes qui ressemblent parfois à de la défiance, parfois à une indifférence aux conséquences. Pas de récit propre de rédemption ici. Seulement la persistance.\n\nIl aime intensément, archive obsessionnellement, travaille compulsivement, et refuse de simplifier quoi que ce soit.\n\nS'il existe un principe unificateur, c'est celui-ci : Sébastien Moreu ne résout pas ses contradictions, tant il vénère celles des autres.\n\nLes siennes, il les organise — puis il vit à l'intérieur de l'exposition. Cette galerie est sa maison et celle qu'il offre toute entière à ceux qu'il aime, rien n'est jamais pour lui.\n\nPour conclure, il citerait Desproges : « Étonnant non? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz est né le 28 novembre 1990 dans un Brésil qui ressemble peu aux cartes postales tropicales. Seberi, petite ville rurale du sud du pays, appartient à ces territoires façonnés par les migrations européennes du XXe siècle : communautés ici polonaises, mais un peu plus loin allemandes, italiennes, lituaniennes… où les langues, les traditions, les danses et le catholicisme survivent parfois avec davantage d'obstination que dans leurs pays d'origine.\n\nFils de descendants polonais nés au Brésil, André grandit dans un environnement structuré par le travail, la religion, les silences et les codes virils. Dernier enfant d'une fratrie de huit (dont une seule sœur), né près de dix ans après le plus jeune de ses aînés, il arrive dans une famille déjà marquée par l'effort, les contraintes et le poids des héritages culturels.\n\nUn imprévu aimé. Aimé mais pas attendu. Il sera bien seul dans cette famille nombreuse.\n\nTrès tôt, il comprend deux choses : il se sent profondément à sa place à l'école, et certains désirs n'ont pas leur place dans le monde où il grandit.\n\nL'adolescence gay n'est facile pour personne, nulle part… mais dans ce contexte rural et conservateur, il n'en est même pas question. Le mot n'existe pas et le désir se vit davantage comme une tension intérieure que comme une identité possible.\n\nAndré apprend donc à observer et à se taire, à contrôler ses gestes, à blâmer son corps et ses émotions.\nIl est trop sensible pour parler et trop taiseux pour être sentimental. Trop discipliné pour ne pas être blessé. Trop désiré pour aimer simplement. Trop trahi pour le confier.\n\nMais il y avait les livres, les dictionnaires, les cartes géographiques, les langues étrangères — tout un monde de papier presque infini qui lui permettait déjà de quitter Seberi mentalement avant de pouvoir le faire physiquement.\n\nAprès l'équivalent du baccalauréat, brillant, les études supérieures resteront pourtant inaccessibles à sa condition. André travaille à Porto Alegre, découvre un peu de liberté et un peu de lui-même avec, puis il quitte progressivement le Brésil pour l'Europe et le Monde. Peut-être que plus loin on peut trouver plus de soi.\nIl apprend l'anglais en Irlande, obtient la nationalité lituanienne par ascendance familiale et développe une maîtrise remarquable des langues : portugais, espagnol, polonais, français, allemand et plusieurs autres encore. La plupart du temps seul.\n\nSon rapport aux langues relève autant de la performance académique que d'une forme de déplacement existentiel : changer de langue devient aussi une manière de déplacer la gêne, tromper l'ennui, franchir les frontières et améliorer le regard porté sur lui-même.\n\nLes années suivantes ressemblent longtemps à une traversée précaire de l'Europe contemporaine : déracinement, pandémie, reconstruction permanente.\n\nPourtant André conserve une discipline presque ascétique : sport, travail intellectuel constant, contrôle alimentaire, jamais d'alcool, et pratiquement aucune drogue. Son corps semble traité comme un territoire qu'il faut maintenir debout coûte que coûte.\n\nLa rencontre avec Sébastien Moreu transforme cette trajectoire mais n'en efface pas les blessures… tout du moins tente-t-elle de l'adoucir. Ensemble, ils développent I Love You Moneypenis, projet mêlant image, désir, autobiographie et performance. Leur mariage, célébré à Saint-Tropez le 19 octobre 2024, ne stabilise pas le chaos : il lui donne simplement une forme viable et visible, un répit.\n\nEn parallèle, André reprend des études à Sorbonne Nouvelle en sciences du langage, où ses résultats attirent rapidement l'attention, notamment en chinois. Il effectue également un stage remarqué au Cours Florent. Le timide se révèle à lui-même, découvre la force libératoire de l'expression des émotions qu'il s'autorise puisque écrite par d'autres. Été 2025, il part en immersion universitaire à Taïwan ; cette année ce sera Shanghai.\n\nFéru d'astrologie et de spiritualités anciennes, engagé dans un travail thérapeutique profond autour de son vécu, André reste pourtant difficile à résumer. Tout chez lui semble organisé pour transformer les blessures en architecture intérieure.\n\nMais aux yeux de Sébastien Moreu, le plus bouleversant est ailleurs, le plus bouleversant c'est de regarder André observer une fleur sauvage. Parce qu'alors toute la mécanique tombe — la maîtrise, la défense, le contrôle — et réapparaît soudain quelque chose d'extrêmement rare : une douceur intacte ayant survécu à tout le reste.\n\nPour conclure, il citerait probablement Jorge Amado : « Le monde ne vaut que par l'émotion qu'il nous donne. » ou plus certainement aujourd'hui Gisèle Pelicot : « La honte doit changer de camp. »",prst:"Dossier de Presse",prss:"Dossier de presse en préparation",prsc:"contact@moneypenis.com",plt:"Ils en Parlent",pls:"Revue de presse en préparation",nt:"Contact",ns:"Envoyer",n1:"Nom",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024\nISBN PF: 978-2-492649-21-9 · ISBN GF: 978-2-492649-20-2 · INPI n° 4999735 & 4999726 · Filigrane numérique",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Je déclare sur l'honneur être âgé(e) de 18 ans ou plus et être majeur(e) selon la législation de mon pays de résidence.",ck2:"Je reconnais que ce site présente des œuvres photographiques artistiques à caractère explicite, incluant la vente de tirages originaux, et j'accepte d'y accéder en connaissance de cause.",nat:"Note des auteurs",naf:"Les Auteurs tiennent à avertir que la légèreté divertissante du titre et du logo peuvent, comme les visuels et textes explicites des œuvres, donner une impression de désinvolture face à un sujet pourtant grave. Ils rappellent qu'il n'en est rien et que ce conte est né de leurs expériences personnelles. Tous deux en ayant, pour des raisons et à des époques différentes, vécus tous les aspects.\n\nLeur projet artistique commun a pour intention de dissuader quiconque de s'engager dans une activité en prévenant qu'encore aujourd'hui : elle ferme plus de portes qu'elle n'en ouvre et expose à un grand nombre de risques ceux qui la pratiquent et leurs proches. Notamment infections et maladies, en particulier les MST, addictions à l'usage de drogues et alcools… Cette activité, sous quelque forme que ce soit, expose à la précarité, à la dépendance, au rejet social, à la violence, au chantage, aux abus, à la contrainte et aux rackets.\n\nPour ceux, trop rares, qui réussissent à s'en extraire, elle nécessite toujours un accompagnement psychologique à très long terme tant nos sociétés ne leurs laissent d'autres issues que la victimisation ou la honte, voire les deux à la fois.\n\nLes auteurs appellent donc au respect et à la protection des travailleurs du sexe. Sans pour autant disconvenir de la nécessité d'une pénalisation des clients, ils appellent pareillement à un traitement digne de la misère affective, voire de la détresse, qui les conduisent à contrevenir à la Loi. Les auteurs espèrent, de la part du grand public comme des institutions, un plus grand soutien aux associations qui peuvent accompagner les uns comme les autres.\n\nIl ne s'agit en aucun cas ici de lever aveuglément les tabous sur toutes les pratiques, pas plus que de faire scandale… Mais de rappeler l'urgence de se défaire des interdits sociétaux qui sclérosent un débat public qui pourtant se doit d'être serein, et non recouvert d'un habit de morale qui n'a rien à faire là et empêche toute libération de la parole. Ils n'ont aucun doute que s'il est un voile à bannir, c'est celui-ci.\n\nEt par débat, ils entendent évoquer le premier d'entre tous, celui qui devrait se tenir au sein de la famille.\n\nEt puis c'est beau… aussi… une bite !\n\n(Le modèle sélectionné par les artistes n'est pas un travailleur du sexe. Partageant sa vie avec l'un des auteurs, il a tenu à rester anonyme.)\n\nSi les Auteurs ont abordé ce sujet qui les touche, c'est qu'il leur a semblé qu'à notre époque de communication formatée, de censure des réseaux et de renaissance de la pudibonderie, il était plus que jamais nécessaire d'apporter un point de vue créatif et artistique qui reste étrangement absent. Ils ont voulu donner à cet ensemble à la fois la légèreté qui devrait prévaloir lorsqu'on évoque l'amour et le plaisir, et le poids qu'imposent les réalités vécues : avec courage et sans pathos.\n\nIls n'entendent pas se substituer aux choix individuels, pas plus qu'aux lois en vigueur dans des pays souverains comme aux valeurs auxquelles chacun est libre d'adhérer.\n\nEn France — ce n'est pas le cas dans tous les pays même démocratiques — les réponses apportées par la police et la justice, dans le cadre légal d'une lutte essentielle contre le trafic d'êtres humains, se sont améliorées au fur et à mesure des années dans le sens de ce que l'on attend d'un pays moderne. Mais elles le font dans le cadre de l'aspect général et n'apportent pas, ce n'est peut-être pas leur rôle, d'amélioration aux situations individuelles vécues tant par les travailleurs du sexe que par leurs clients. Des associations remplissent discrètement leurs missions malgré la faiblesse de leurs moyens.\n\nTant pour les administrations concernées que pour les associations, des sites Internet existent. Certains très utiles sont sélectionnés et disponibles sur une liste régulièrement mise à jour sur notre propre site Internet : www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Planches à l'unité",siCh:"Choisir le format",siInq:"Demander",siNote:"Prix en euros, TVA française incluse. Frais d'emballage, d'expédition et d'assurance facturés au coût réel.",siCont:"Pour acquérir, contactez-nous à smoreu@mac.com — ou via le formulaire de contact",siPro:"Libraires, marchands d'art et galeries — pour nos conditions professionnelles, expositions et dépôts, merci de nous écrire.",siRgpd:"Les coordonnées transmises serviront uniquement à votre demande et à des informations sur les projets des artistes",siPick:"Cliquer sur une planche pour la voir et l'acquérir",req:"Faire une demande",reqAge:"Cette section est réservée aux personnes majeures.",shPfD:"30 × 40 cm · 50 exemplaires numérotés et signés",shGfD:"50 × 70 cm · 15 exemplaires numérotés et signés",shUn:"Planches à l'unité",shUnD:"Chaque tirage en Petit ou Grand Format, signé S.M. & A.V.",fFirstName:"Prénom",fPhone:"Téléphone",fCountry:"Pays",fLangPref:"Langue de réponse",fPref:"Préférence de contact",fMatrix:"Objet de la demande",fMatrixHint:"Cochez les cases correspondantes",fMsgPh:"Précisions (500 caractères max.)",fConsent:"J'accepte les conditions ci-dessus et l'envoi de mes coordonnées à Sébastien Moreu et André Vaszkievicz.",fSent:"Demande envoyée. Vous recevrez une réponse à l'adresse indiquée.",fError:"Erreur d'envoi. Vous pouvez écrire directement à smoreu@mac.com.",rqInfo:"Information",rqBuy:"Achat",rqDeposit:"Dépôt",rqPro:"Professionnel",rqColl:"Collectionneur",rqOther:"Autre",continueShop:"Continuer la consultation",nax:"Lire l'intégralité ▾",nac:"Réduire ▴",aiWarn:"ATTENTION : CETTE TRADUCTION EST GÉNÉRÉE PAR IA ET PEUT CONTENIR ERREURS OU CONTRESENS",rqAcq:"Disponibilité & modalités d'acquisition",rqPress:"Presse",rqInfo2:"Informations générales",rqPro2:"Professionnel · Revendeurs",rqOther2:"Divers",shopPortPF:"Portfolio · Petit Format",shopPortGF:"Portfolio · Grand Format",shopSingPF:"Planches à l'unité · Petit Format",shopSingGF:"Planches à l'unité · Grand Format",priceLbl:"Prix TTC",priceUnit:"TTC",pricePer:"/ planche",availPort:"Numéros %F% à %T% sur %N% commercialisés",availSingle:"Issues des portfolios %F% à %T% sur %N%",noChoice:"Le numéro de tirage est attribué automatiquement (non sélectionnable par l'acheteur)",shopFormTitle:"Faire une demande",shopFormSubtitle:"Sélectionnez les produits et la nature de votre demande. Notre équipe vous répondra rapidement.",shopFmtPF:"Petit Format · 30 × 40 cm",shopFmtGF:"Grand Format · 50 × 70 cm",ctTitle:"Nous écrire",ctSubtitle:"Une question sur le projet, sur les artistes, ou autre — écrivez-nous, nous vous répondrons.",ctSubj:"Sujet de votre message",ctSubjProj:"Le projet I Love You Moneypenis",ctSubjArt:"Les artistes",ctSubjOther:"Autre question",ctFollow:"Suivez-nous"},
  EN:{techs:["Poem · Golden cross","Handwritten letter · Navy ink · Sculpture","Color photograph · Yellow text","Silver gelatin print · Handwritten green ink","Color photo · Red text · Hermès tie","Color photograph · Open jeans · Nature","Cyan-tinted photo · Orange handwritten letter","Red text · B&W · Multilingual warning","Handwritten letter · €50 bills · Hands","Red text · B&W · Manifesto","Handwritten letter · Floral background · Navy ink"],aw:"Explicit Content · For Adults Only",am:"This site presents photographic artworks for informed adults only.",ap:"+ 18 — Full version",am2:"− 18 — Public version",nav:["I Love You Moneypenis","The Teaser","The Precious Box Sets","In Situ Likes That","The Eggplant Index","Truly Fine Quills…","🍆","I love you too","Here It All Begins Again","Of Markers and Hands"],navPresse:"Too Much Honor for So Little Flesh",hl:"Limited Edition · Original Silver Gelatin Prints",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"A Gay Pop Porn Fairy Tale, for informed adults.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Step into the work",pt:"I Love You Moneypenis",ps:"11 original silver gelatin prints · Traphot, Montrouge\nSigned and numbered by Sébastien Moreu & André Vaszkievicz",mg:"Click to enlarge",tech_info:"2024 · 30 × 40 cm / 11¾ × 15¾ in (50 ed.) · 50 × 70 cm / 19¾ × 27½ in (15 ed.) · Silver gelatin print · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm / 11¾ × 15¾ in (50 ed.) · 50 × 70 cm / 19¾ × 27½ in (15 ed.) · Print on Arches paper · Hand-numbered and signed by both artists",op:"Opening",tx:"Text",pr:"Protected artwork · Digital watermark",ct:"The Box Set",cs:"Complete portfolio · 11 silver gelatin prints · Signed & numbered · Gloves included",zt:"In Situ",zs:"The works in situ",vt:"Film",vs:"Content for informed adults only",st:"Acquire",pft:"Small Format  30 × 40 cm",pfc:"50 portfolios numbered 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Large Format  50 × 70 cm",gfc:"15 portfolios numbered 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signed S.M. & A.V. · Number on each print · Gloves included",pd:"Traphot, Montrouge",p1:"Small Format portfolio · complete",p2:"Single print · Small Format",p3:"Large Format portfolio · complete",p4:"Single print · Large Format",sh:"Shipping & Insurance",sb:"Museum packaging · DHL Express\nFrance €45 · Europe €95 · International €180\nInsurance included",py:"Payment",pb:"Bank transfer · Credit card · PayPal · 3× interest-free",co:"Terms",cb:"Certificate of authenticity · 14-day return · VAT by country",rv:"Reserve",by:"Acquire",bt:"Of Quills & Hands",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — who reminds us, as a kind of stylistic resignation, that everyone has always called him Sébastien — is what happens when discipline and will refuse to domesticate obsession.\n\nBorn on December 25, 1972 in a setting too perfect to be innocent — Saint-Tropez — he grew up in the shadow of precision (a dentist father shaping mouths) and of myth: resistance fighters, sailors, missing men, family ghosts refusing to stay buried. At ten, he is handed a full painting arsenal. Not a toy. A first loaded weapon — the beginning of a baroque collection, that of a man mad for intimate wars.\n\nHe will never return them. Preferring to multiply his battlefields.\n\nHe advances through successive displacements: painting, books, images, human relations — everything becomes material, everything can be reassembled. What he builds is not a work in the classical sense, but a field of tensions: between memory and invention, fidelity and betrayal, control and loss.\n\nHe doesn't work for institutions. He infiltrates them. Since the nineties, in the orbit of gallerist Enrico Navarra, he has built a career that refuses labels: neither quite employee, nor quite artist, nor mere editor — rather a productive anomaly, capable of generating books, exhibitions, links, archives, ideas, communication, events, at a pace as breathtaking as it is discontinuous. A disorder that serves as camouflage for this man who methodically destroys every frame meant to contain him.\n\nHe actively participates in the conception and development of the Made By… collection, an international editorial project devoted to contemporary creation across different cultural scenes. In this context, he collaborates closely with photographer Simon Schwyzer.\n\nHis relationship with Simon Schwyzer is the unstable heart of it: a collaboration become dependency, a friendship transformed into a love system. A couple? Since the brutal death of the Swiss photographer, Moreu answers: \"Ask him.\" Still, after his disappearance, nothing stops — on the contrary, everything intensifies. Working becomes a way of holding on, editing a way of prolonging, writing a way of not giving in. He commits to preserving and promoting Schwyzer's work, notably through the preparation of the monograph Made by… Simon Schwyzer.\n\nIn 2017, with the support of Enrico Navarra, he had founded Éditions Sébastien Moreu, an independent imprint dedicated to art books, essays and transversal editorial projects. The memory of the Swiss photographer will destroy the enterprise. Not the projects.\n\nLater, with André Vaszkievicz, the intimate changes form again. I Love You Moneypenis is not a decorative project laid over their relationship: it is a collision of text, image, desire, money, body. A work conceived from inside the bond, without protective filter. Their marriage, on October 19, 2024 in Saint-Tropez, stabilizes nothing: it makes official what was already overflowing.\n\nHis own work — collages, texts, editorial devices — belongs to an aesthetics of exposure. Open newspapers, cut-out images, memory treated as raw material. Nothing is neutral. Everything is implicated.\n\nPhysically, he carries a body that doesn't always cooperate: rapid heart, capricious tension, system under pressure. And yet he continues, with habits that sometimes resemble defiance, sometimes indifference to consequences. No proper redemption narrative here. Only persistence.\n\nHe loves intensely, archives obsessively, works compulsively, and refuses to simplify anything.\n\nIf there is a unifying principle, it is this: Sébastien Moreu does not resolve his contradictions, so much does he venerate those of others.\n\nHis own, he organizes — then lives inside the exhibition. This gallery is his home and the one he offers entirely to those he loves; nothing is ever for himself.\n\nTo conclude, he would quote Desproges: \"Astonishing, isn't it?\" ",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz was born on November 28, 1990 in a Brazil that bears little resemblance to tropical postcards. Seberi, a small rural town in the south of the country, belongs to those territories shaped by twentieth-century European migrations: Polish communities here, but a little further away German, Italian, Lithuanian… where languages, traditions, dances and Catholicism sometimes survive with even more obstinacy than in their countries of origin.\n\nSon of Polish descendants born in Brazil, André grew up in an environment structured by work, religion, silences and masculine codes. The last child of eight siblings (with only one sister), born nearly ten years after the youngest of his elders, he arrived in a family already marked by effort, constraints and the weight of cultural heritage.\n\nAn unforeseen, loved one. Loved but not expected. He would be quite alone in this large family.\n\nVery early on, he understood two things: he felt deeply in his place at school, and certain desires had no place in the world he was growing up in.\n\nGay adolescence is easy for no one, nowhere… but in that rural and conservative context, it was not even spoken of. The word did not exist and desire was experienced more as an inner tension than as a possible identity.\n\nSo André learned to observe and to stay silent, to control his gestures, to blame his body and his emotions.\nHe was too sensitive to speak and too taciturn to be sentimental. Too disciplined not to be wounded. Too desired to love simply. Too betrayed to confide it.\n\nBut there were books, dictionaries, geographic maps, foreign languages — a whole almost infinite world of paper that already allowed him to leave Seberi mentally before he could do so physically.\n\nAfter the equivalent of the baccalaureate, brilliant, higher studies would nonetheless remain inaccessible to his condition. André worked in Porto Alegre, discovered a bit of freedom and a bit of himself along with it, then gradually left Brazil for Europe and the World. Perhaps further away one can find more of oneself.\nHe learned English in Ireland, obtained Lithuanian citizenship through family ancestry and developed a remarkable mastery of languages: Portuguese, Spanish, Polish, French, German and several others still. Most of the time alone.\n\nHis relationship with languages was as much a matter of academic performance as of a form of existential displacement: changing language became also a way to displace embarrassment, to outwit boredom, to cross borders and to improve the gaze he cast upon himself.\n\nThe following years long resembled a precarious crossing of contemporary Europe: uprooting, pandemic, permanent reconstruction.\n\nYet André maintained an almost ascetic discipline: sport, constant intellectual work, dietary control, never alcohol, and practically no drugs. His body seemed treated as a territory to be kept standing at all costs.\n\nThe encounter with Sébastien Moreu transformed this trajectory but did not erase its wounds… or at least tried to soften them. Together, they developed I Love You Moneypenis, a project blending image, desire, autobiography and performance. Their marriage, celebrated in Saint-Tropez on October 19, 2024, did not stabilize the chaos: it simply gave it a viable and visible form, a respite.\n\nIn parallel, André resumed studies at Sorbonne Nouvelle in language sciences, where his results quickly drew attention, notably in Chinese. He also completed a noted internship at the Cours Florent. The shy one revealed himself to himself, discovered the liberating force of expressing emotions he allowed himself since they were written by others. Summer 2025, he left for a university immersion in Taiwan; this year it will be Shanghai.\n\nPassionate about astrology and ancient spiritualities, engaged in deep therapeutic work around his lived experience, André nonetheless remains difficult to summarize. Everything about him seems organized to transform wounds into interior architecture.\n\nBut in the eyes of Sébastien Moreu, the most moving thing is elsewhere — the most moving thing is to watch André observe a wildflower. Because then the entire machinery falls — the mastery, the defense, the control — and suddenly something extremely rare reappears: an intact gentleness having survived everything else.\n\nTo conclude, he would probably quote Jorge Amado: \"The world is worth only the emotion it gives us.\" or more certainly today Gisèle Pelicot: \"Shame must change sides.\"",prst:"Press Materials",prss:"In preparation",prsc:"contact@moneypenis.com",plt:"In the Press",pls:"Coming soon",nt:"Contact",ns:"Send",n1:"Name",n2:"Email",n3:"Message",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024\nISBN SF: 978-2-492649-21-9 · ISBN LF: 978-2-492649-20-2 · INPI no. 4999735 & 4999726",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"I hereby declare that I am 18 years of age or older and of legal age according to the laws of my country of residence.",ck2:"I acknowledge that this site presents explicit artistic photographic works, including the sale of original prints, and I consent to access it knowingly.",nat:"A Note from the Authors",naf:"The Authors wish to warn that the entertaining lightness of the title and logo may, like the explicit visuals and texts of the works, give an impression of flippancy toward a subject that is nonetheless serious. They remind us that this is not the case and that this tale was born of their personal experiences. Both having, for different reasons and at different times, lived all of its aspects.\n\nTheir joint artistic project intends to dissuade anyone from engaging in such an activity by warning that even today: it closes more doors than it opens and exposes those who practice it and their loved ones to a great many risks. Notably infections and illnesses, particularly STIs, addictions to drug and alcohol use… This activity, in whatever form, exposes one to precariousness, dependency, social rejection, violence, blackmail, abuse, coercion and racketeering.\n\nFor the too rare few who manage to extract themselves, it always requires very long-term psychological support, so deeply do our societies leave them no other exits than victimization or shame, or indeed both at once.\n\nThe authors therefore call for respect and protection of sex workers. Without denying the need to penalize clients, they likewise call for a dignified treatment of the emotional misery, even distress, that leads them to break the Law. The authors hope, from the general public as much as from institutions, for greater support to associations that can accompany both sides.\n\nThis is in no way about blindly lifting taboos on every practice, nor about creating scandal… But about recalling the urgency of shedding the societal prohibitions that ossify a public debate which ought instead to be serene, not draped in a moral garb that has no place there and that prevents any liberation of speech. They have no doubt that if there is a veil to be cast off, it is this one.\n\nAnd by debate, they mean to invoke the first of them all, the one that should be held within the family.\n\nAnd besides… a cock is beautiful… too !\n\n(The model selected by the artists is not a sex worker. Sharing his life with one of the authors, he insisted on remaining anonymous.)\n\nIf the Authors have addressed this subject that touches them, it is because it seemed to them that in our era of formatted communication, network censorship and resurgent prudery, it was more than ever necessary to bring a creative and artistic perspective that remains strangely absent. They wanted to give this whole both the lightness that should prevail when speaking of love and pleasure, and the weight imposed by lived realities: with courage and without pathos.\n\nThey do not mean to substitute themselves for individual choices, any more than for the laws in force in sovereign countries or the values each is free to embrace.\n\nIn France — and this is not the case in every country, even democratic ones — the responses provided by police and justice, within the legal framework of an essential fight against human trafficking, have improved over the years in the direction one expects of a modern country. But they do so within the general framework and bring no improvement — perhaps it is not their role — to the individual situations experienced both by sex workers and by their clients. Associations quietly carry out their missions despite the meagerness of their means.\n\nFor the relevant administrations as well as for the associations, websites exist. Some particularly useful ones are selected and available on a regularly updated list on our own website: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Single Prints",siCh:"Choose format",siInq:"Inquire",siNote:"Prices in euros, French VAT included. Packaging, shipping and insurance billed at cost.",siCont:"To acquire, write us at smoreu@mac.com — or via the contact form",siPro:"Booksellers, art dealers and galleries — write us for trade terms, exhibitions and consignment.",siRgpd:"Your details will only be used for your inquiry and for updates on the artists' projects.",siPick:"Tap a print to view and acquire it",req:"Make a request",reqAge:"This section is reserved for adults.",shPfD:"30 × 40 cm · 50 numbered and signed editions",shGfD:"50 × 70 cm · 15 numbered and signed editions",shUn:"Single Prints",shUnD:"Each print available in Small or Large Format · signed S.M. & A.V.",fFirstName:"First name",fPhone:"Phone",fCountry:"Country",fLangPref:"Reply language",fPref:"Contact preference",fMatrix:"Subject of your request",fMatrixHint:"Tick the relevant boxes",fMsgPh:"Details (max. 500 characters)",fConsent:"I accept the conditions above and the transmission of my details to Sébastien Moreu and André Vaszkievicz.",fSent:"Request sent. You will receive a reply at the address provided.",fError:"Sending failed. You can write us directly at smoreu@mac.com.",rqInfo:"Information",rqBuy:"Purchase",rqDeposit:"Consignment",rqPro:"Trade",rqColl:"Collector",rqOther:"Other",continueShop:"Keep browsing",nax:"Read in full ▾",nac:"Collapse ▴",aiWarn:"WARNING: THIS TRANSLATION IS AI-GENERATED AND MAY CONTAIN ERRORS OR MISINTERPRETATIONS",rqAcq:"Availability & acquisition",rqPress:"Press",rqInfo2:"General information",rqPro2:"Trade · Dealers",rqOther2:"Other",shopPortPF:"Portfolio · Small Format",shopPortGF:"Portfolio · Large Format",shopSingPF:"Single Prints · Small Format",shopSingGF:"Single Prints · Large Format",priceLbl:"Price incl. tax",priceUnit:"incl. tax",pricePer:"/ print",availPort:"Numbers %F% to %T% of %N% available",availSingle:"From portfolios %F% to %T% of %N%",noChoice:"Print number is assigned automatically (not buyer-selectable)",shopFormTitle:"Make a request",shopFormSubtitle:"Select the products and the nature of your request. We will reply promptly.",shopFmtPF:"Small Format · 30 × 40 cm",shopFmtGF:"Large Format · 50 × 70 cm",ctTitle:"Write to us",ctSubtitle:"A question about the project, the artists, or anything else — write to us, we will reply.",ctSubj:"Subject of your message",ctSubjProj:"The project I Love You Moneypenis",ctSubjArt:"The artists",ctSubjOther:"Other question",ctFollow:"Follow us"},
  ES:{techs:["Poema · Cruz dorada","Carta manuscrita · Tinta marina · Escultura","Fotografía a color · Texto amarillo","Copia argéntica · Tinta verde manuscrita","Foto a color · Texto rojo · Corbata Hermès","Fotografía a color · Jeans abiertos · Naturaleza","Foto teñida de cian · Carta manuscrita naranja","Texto rojo · B/N · Advertencia multilingüe","Carta manuscrita · Billetes de 50€ · Manos","Texto rojo · B/N · Manifiesto","Carta manuscrita · Fondo floral · Tinta marina"],aw:"Contenido Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versión completa",am2:"− 18 — Versión pública",nav:["I Love You Moneypenis","El Tráiler","Los preciosos estuches","In Situ te gusta","El precio de las berenjenas","Hermosas plumas, ciertamente…","🍆","I love you too","Aquí todo recomienza","De rotuladores y de manos"],navPresse:"Demasiados honores para tan poca carne",hl:"Edición Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"París, 2024",hd:"Un Cuento de Hadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Entrar en la obra",pt:"I Love You Moneypenis",ps:"11 copias en plata · Traphot · Firmadas y numeradas",mg:"Clic para ampliar",tech_info:"2024 · 30 × 40 cm (50 ej.) · 50 × 70 cm (15 ej.) · Copia argéntica · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ej.) · 50 × 70 cm (15 ej.) · Impresión sobre papel Arches · Numerada y firmada a mano por ambos artistas",op:"Apertura",tx:"Texto",pr:"Obra protegida",ct:"La Caja",cs:"Portfolio completo · 11 copias · Firmadas · Guantes",zt:"In Situ",zs:"Las obras en situación",vt:"Vídeo",vs:"Contenido para adultos",st:"Adquirir",pft:"Pequeño Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Gran Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmadas · Numeradas · Guantes",pd:"Traphot",p1:"Portafolio Pequeño Formato · completo",p2:"Lámina suelta · Pequeño Formato",p3:"Portafolio Gran Formato · completo",p4:"Lámina suelta · Gran Formato",sh:"Transporte",sb:"DHL · Francia 45€ · Europa 95€ · Internacional 180€",py:"Pago",pb:"Transferencia · Tarjeta · PayPal",co:"Condiciones",cb:"Certificado · Devolución 14 días",rv:"Reservar",by:"Adquirir",bt:"De plumas y de manos",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que recuerda, como una especie de resignación estilística, que todo el mundo siempre lo ha llamado Sébastien — es lo que ocurre cuando la disciplina y la voluntad se niegan a domesticar la obsesión.\n\nNacido el 25 de diciembre de 1972 en un escenario demasiado perfecto para ser inocente — Saint-Tropez — crece a la sombra de la precisión, un padre dentista que moldea bocas, y del mito: miembros de la resistencia, marineros, desaparecidos, fantasmas familiares que se niegan a permanecer enterrados. A los diez años, le entregan un arsenal completo de pintura. No un juguete. Una primera arma cargada — inicio de una colección barroca, la de un loco de las guerras íntimas.\n\nNunca las devolverá. Prefiriendo multiplicar sus campos de batalla.\n\nAvanza mediante desplazamientos sucesivos: pintura, libros, imágenes, relaciones humanas — todo se vuelve material, todo puede reensamblarse. Lo que construye no es una obra en sentido clásico, sino un campo de tensiones: entre memoria e invención, fidelidad y traición, control y pérdida.\n\nNo trabaja para las instituciones. Las infiltra. Desde los años 90, en la órbita del galerista Enrico Navarra, construye una carrera que rechaza las etiquetas: ni del todo asalariado, ni del todo artista, ni simple editor — más bien una anomalía productiva, capaz de generar libros, exposiciones, vínculos, archivos, ideas, comunicación, eventos, a un ritmo tan deslumbrante como discontinuo. Un desorden que sirve de camuflaje a este hombre que destruye metódicamente todos los marcos destinados a contenerlo.\n\nParticipa activamente en la concepción y el desarrollo de la colección Made By…, proyecto editorial internacional dedicado a la creación contemporánea a través de diferentes escenas culturales. En este marco, colabora estrechamente con el fotógrafo Simon Schwyzer.\n\nSu relación con Simon Schwyzer es el corazón inestable de todo ello: una colaboración convertida en dependencia, una amistad transformada en sistema amoroso. ¿Una pareja? Desde la muerte brutal del fotógrafo suizo, Moreu responde: « Pregúntenle. » Lo cierto es que tras su desaparición, nada se detiene — al contrario, todo se intensifica. Trabajar se vuelve una manera de retener, editar una manera de prolongar, escribir una manera de no ceder. Se compromete en la preservación y valorización de su obra, en particular a través de la preparación de la publicación de la monografía Made by… Simon Schwyzer.\n\nEn 2017, con el apoyo de Enrico Navarra, había fundado las Éditions Sébastien Moreu, estructura independiente dedicada a libros de arte, ensayos y proyectos editoriales transversales. La memoria del fotógrafo suizo destruirá la empresa. No los proyectos.\n\nMás tarde, con André Vaszkievicz, lo íntimo cambia nuevamente de forma. I Love You Moneypenis no es un proyecto decorativo colocado sobre su relación: es una colisión de texto, imagen, deseo, dinero, cuerpo. Una obra concebida desde el interior del vínculo, sin filtro protector. Su matrimonio, el 19 de octubre de 2024 en Saint-Tropez, no estabiliza nada: oficializa lo que ya desbordaba.\n\nSu propio trabajo — collages, textos, dispositivos editoriales — pertenece a una estética de la exposición. Periódicos abiertos, imágenes recortadas, memoria tratada como materia prima. Nada es neutro. Todo está implicado.\n\nFísicamente, lleva un cuerpo que no siempre coopera: corazón rápido, tensión caprichosa, sistema bajo presión. Y sin embargo, continúa, con hábitos que a veces se parecen al desafío, a veces a la indiferencia ante las consecuencias. Ningún relato propio de redención aquí. Solo la persistencia.\n\nAma intensamente, archiva obsesivamente, trabaja compulsivamente y rechaza simplificar lo que sea.\n\nSi existe un principio unificador, es este: Sébastien Moreu no resuelve sus contradicciones, tanto venera las de los demás.\n\nLas suyas, las organiza — y luego vive dentro de la exposición. Esta galería es su casa y la que ofrece por entero a aquellos que ama, nada es nunca para él.\n\nPara concluir, citaría a Desproges: « ¿Sorprendente, no? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz nació el 28 de noviembre de 1990 en un Brasil que poco se parece a las postales tropicales. Seberi, pequeña ciudad rural del sur del país, pertenece a esos territorios moldeados por las migraciones europeas del siglo XX: comunidades polacas aquí, pero un poco más lejos alemanas, italianas, lituanas… donde las lenguas, las tradiciones, los bailes y el catolicismo sobreviven a veces con más obstinación que en sus países de origen.\n\nHijo de descendientes polacos nacidos en Brasil, André crece en un entorno estructurado por el trabajo, la religión, los silencios y los códigos viriles. Último hijo de una familia de ocho hermanos (con una sola hermana), nacido casi diez años después del menor de sus mayores, llega a una familia ya marcada por el esfuerzo, las limitaciones y el peso de las herencias culturales.\n\nUn imprevisto amado. Amado pero no esperado. Estará bien solo en esa familia numerosa.\n\nMuy pronto comprende dos cosas: se siente profundamente en su lugar en la escuela, y ciertos deseos no tienen cabida en el mundo en el que crece.\n\nLa adolescencia gay no es fácil para nadie, en ninguna parte… pero en ese contexto rural y conservador, ni siquiera se habla de ello. La palabra no existe y el deseo se vive más como una tensión interior que como una identidad posible.\n\nAndré aprende entonces a observar y a callarse, a controlar sus gestos, a culpar a su cuerpo y a sus emociones.\nEs demasiado sensible para hablar y demasiado callado para ser sentimental. Demasiado disciplinado para no ser herido. Demasiado deseado para amar simplemente. Demasiado traicionado para confiarlo.\n\nPero estaban los libros, los diccionarios, los mapas geográficos, las lenguas extranjeras — todo un mundo de papel casi infinito que ya le permitía abandonar Seberi mentalmente antes de poder hacerlo físicamente.\n\nTras el equivalente al bachillerato, brillante, los estudios superiores permanecerían sin embargo inaccesibles a su condición. André trabaja en Porto Alegre, descubre algo de libertad y algo de sí mismo con ella, luego abandona progresivamente Brasil por Europa y el Mundo. Quizás más lejos se pueda encontrar más de uno mismo.\nAprende inglés en Irlanda, obtiene la nacionalidad lituana por ascendencia familiar y desarrolla un dominio notable de las lenguas: portugués, español, polaco, francés, alemán y otras varias más. La mayor parte del tiempo solo.\n\nSu relación con las lenguas tiene tanto que ver con la performance académica como con una forma de desplazamiento existencial: cambiar de lengua se convierte también en una manera de desplazar la incomodidad, engañar al aburrimiento, atravesar las fronteras y mejorar la mirada que se dirige a sí mismo.\n\nLos años siguientes se asemejan durante mucho tiempo a una travesía precaria de la Europa contemporánea: desarraigo, pandemia, reconstrucción permanente.\n\nSin embargo André conserva una disciplina casi ascética: deporte, trabajo intelectual constante, control alimentario, nunca alcohol, y prácticamente ninguna droga. Su cuerpo parece tratado como un territorio que debe mantenerse en pie cueste lo que cueste.\n\nEl encuentro con Sébastien Moreu transforma esa trayectoria pero no borra sus heridas… al menos intenta suavizarlas. Juntos desarrollan I Love You Moneypenis, proyecto que mezcla imagen, deseo, autobiografía y performance. Su matrimonio, celebrado en Saint-Tropez el 19 de octubre de 2024, no estabiliza el caos: simplemente le da una forma viable y visible, un respiro.\n\nParalelamente, André retoma sus estudios en la Sorbonne Nouvelle en ciencias del lenguaje, donde sus resultados llaman rápidamente la atención, en especial en chino. Realiza también una práctica destacada en el Cours Florent. El tímido se revela a sí mismo, descubre la fuerza liberadora de expresar las emociones que se permite ya que están escritas por otros. Verano de 2025, parte en inmersión universitaria a Taiwán; este año será Shanghái.\n\nApasionado por la astrología y las espiritualidades antiguas, comprometido en un trabajo terapéutico profundo en torno a su vivencia, André sigue siendo sin embargo difícil de resumir. Todo en él parece organizado para transformar las heridas en arquitectura interior.\n\nPero a los ojos de Sébastien Moreu, lo más conmovedor está en otra parte: lo más conmovedor es mirar a André observar una flor silvestre. Porque entonces toda la mecánica se desmorona — el dominio, la defensa, el control — y reaparece de pronto algo extremadamente raro: una dulzura intacta que ha sobrevivido a todo lo demás.\n\nPara concluir, citaría probablemente a Jorge Amado: « El mundo sólo vale por la emoción que nos da. » o más seguramente hoy a Gisèle Pelicot: « La vergüenza debe cambiar de bando. »",prst:"Material de prensa",prss:"En preparación",prsc:"contact@moneypenis.com",plt:"Hablan de la obra",pls:"Próximamente",nt:"Contacto",ns:"Enviar",n1:"Nombre",n2:"Email",n3:"Mensaje",lg:"© Sébastien Moreu · © André Vaszkievicz · París 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro bajo mi responsabilidad tener 18 años o más y ser mayor de edad según la legislación de mi país de residencia.",ck2:"Reconozco que este sitio presenta obras fotográficas artísticas de carácter explícito, incluyendo la venta de copias originales, y acepto acceder a él con pleno conocimiento.",nat:"Nota de los autores",naf:"Los Autores desean advertir que la ligereza entretenida del título y el logotipo puede, como los visuales y textos explícitos de las obras, dar una impresión de despreocupación frente a un tema sin embargo grave. Recuerdan que no es así y que este cuento nació de sus experiencias personales. Ambos habiendo vivido, por razones distintas y en épocas distintas, todos sus aspectos.\n\nSu proyecto artístico común tiene la intención de disuadir a cualquiera de involucrarse en una actividad advirtiendo que aún hoy: cierra más puertas de las que abre y expone a múltiples riesgos a quienes la practican y a sus allegados. En particular infecciones y enfermedades, especialmente las ITS, adicciones al uso de drogas y alcohol… Esta actividad, en cualquier forma, expone a la precariedad, la dependencia, el rechazo social, la violencia, el chantaje, los abusos, la coacción y los chantajes.\n\nPara los demasiado escasos que logran salir de ella, requiere siempre un acompañamiento psicológico a muy largo plazo, tanto nuestras sociedades no les dejan otra salida que la victimización o la vergüenza, incluso ambas a la vez.\n\nLos autores llaman pues al respeto y a la protección de los trabajadores del sexo. Sin negar la necesidad de penalizar a los clientes, llaman igualmente a un trato digno hacia la miseria afectiva, incluso la angustia, que los lleva a transgredir la Ley. Los autores esperan, tanto del gran público como de las instituciones, un mayor apoyo a las asociaciones que pueden acompañar a unos y a otros.\n\nNo se trata aquí de levantar ciegamente los tabúes sobre todas las prácticas, ni de provocar escándalo… Sino de recordar la urgencia de deshacerse de las prohibiciones sociales que esclerotizan un debate público que sin embargo debería ser sereno, y no cubierto con un manto de moralina que no tiene nada que hacer ahí e impide toda liberación de la palabra. No tienen ninguna duda de que si hay un velo que desterrar, es éste.\n\nY por debate entienden evocar el primero de todos, el que debería celebrarse en el seno de la familia.\n\nY además es bonita… también… una polla !\n\n(El modelo seleccionado por los artistas no es un trabajador del sexo. Compartiendo su vida con uno de los autores, ha querido permanecer anónimo.)\n\nSi los Autores abordaron este tema que les concierne, es porque les pareció que en nuestra época de comunicación estandarizada, de censura en las redes y de renacimiento de la mojigatería, era más necesario que nunca aportar un punto de vista creativo y artístico que sigue estando extrañamente ausente. Quisieron dar a este conjunto tanto la ligereza que debería prevalecer al evocar el amor y el placer, como el peso que imponen las realidades vividas: con valentía y sin patetismo.\n\nNo pretenden sustituirse a las decisiones individuales, ni a las leyes vigentes en países soberanos ni a los valores a los que cada cual es libre de adherirse.\n\nEn Francia — no es el caso en todos los países, incluso democráticos — las respuestas de la policía y la justicia, en el marco legal de una lucha esencial contra el tráfico de seres humanos, han ido mejorando con los años hacia lo que se espera de un país moderno. Pero lo hacen en el marco general y no aportan, quizá no sea su papel, mejoras a las situaciones individuales que viven tanto los trabajadores del sexo como sus clientes. Asociaciones cumplen discretamente con sus misiones a pesar de la debilidad de sus medios.\n\nTanto para las administraciones como para las asociaciones, existen sitios web. Algunos muy útiles están seleccionados y disponibles en una lista actualizada regularmente en nuestro propio sitio web: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Grabados sueltos",siCh:"Elegir formato",siInq:"Consultar",siNote:"Precios en euros, IVA francés incluido. Embalaje, transporte y seguro facturados al coste real.",siCont:"Para adquirir, escríbanos a smoreu@mac.com — o use el formulario de contacto",siPro:"Libreros, marchantes y galerías — escríbanos para condiciones profesionales, exposiciones y depósitos.",siRgpd:"Sus datos se usarán únicamente para su consulta y para noticias sobre los proyectos de los artistas.",siPick:"Toca una lámina para verla y adquirirla",req:"Hacer una solicitud",reqAge:"Esta sección está reservada a personas mayores de edad.",shPfD:"30 × 40 cm · 50 ejemplares numerados y firmados",shGfD:"50 × 70 cm · 15 ejemplares numerados y firmados",shUn:"Láminas sueltas",shUnD:"Cada lámina disponible en Pequeño o Gran Formato · firmadas S.M. & A.V.",fFirstName:"Nombre",fPhone:"Teléfono",fCountry:"País",fLangPref:"Idioma de respuesta",fPref:"Preferencia de contacto",fMatrix:"Objeto de su solicitud",fMatrixHint:"Marque las casillas correspondientes",fMsgPh:"Precisiones (máx. 500 caracteres)",fConsent:"Acepto las condiciones anteriores y la transmisión de mis datos a Sébastien Moreu y André Vaszkievicz.",fSent:"Solicitud enviada. Recibirá una respuesta en la dirección indicada.",fError:"Error de envío. Puede escribir directamente a smoreu@mac.com.",rqInfo:"Información",rqBuy:"Compra",rqDeposit:"Depósito",rqPro:"Profesional",rqColl:"Coleccionista",rqOther:"Otro",continueShop:"Seguir consultando",nax:"Leer todo ▾",nac:"Reducir ▴",aiWarn:"ATENCIÓN: ESTA TRADUCCIÓN ES GENERADA POR IA Y PUEDE CONTENER ERRORES O CONTRASENTIDOS",rqAcq:"Disponibilidad y modalidades de adquisición",rqPress:"Prensa",rqInfo2:"Información general",rqPro2:"Profesional · Distribuidores",rqOther2:"Otros",shopPortPF:"Portafolio · Formato Pequeño",shopPortGF:"Portafolio · Formato Grande",shopSingPF:"Láminas individuales · Formato Pequeño",shopSingGF:"Láminas individuales · Formato Grande",priceLbl:"Precio con IVA",priceUnit:"IVA incl.",pricePer:"/ lámina",availPort:"Números %F% a %T% de %N% comercializados",availSingle:"De los portafolios %F% a %T% de %N%",noChoice:"El número de la tirada se asigna automáticamente (no seleccionable por el comprador)",shopFormTitle:"Realizar una solicitud",shopFormSubtitle:"Seleccione los productos y la naturaleza de su solicitud. Nuestro equipo le responderá rápidamente.",shopFmtPF:"Formato Pequeño · 30 × 40 cm",shopFmtGF:"Formato Grande · 50 × 70 cm",ctTitle:"Escríbanos",ctSubtitle:"Una pregunta sobre el proyecto, los artistas o cualquier otra cosa — escríbanos, le responderemos.",ctSubj:"Asunto de su mensaje",ctSubjProj:"El proyecto I Love You Moneypenis",ctSubjArt:"Los artistas",ctSubjOther:"Otra pregunta",ctFollow:"Síganos"},
  PT:{techs:["Poema · Cruz dourada","Carta manuscrita · Tinta marinha · Escultura","Fotografia a cores · Texto amarelo","Cópia argêntica · Tinta verde manuscrita","Foto a cores · Texto vermelho · Gravata Hermès","Fotografia a cores · Jeans aberto · Natureza","Foto matizada ciano · Carta manuscrita laranja","Texto vermelho · P&B · Aviso multilíngue","Carta manuscrita · Notas de 50€ · Mãos","Texto vermelho · P&B · Manifesto","Carta manuscrita · Fundo floral · Tinta marinha"],aw:"Conteúdo Explícito",am:"Obras fotográficas para adultos.",ap:"+ 18 — Versão completa",am2:"− 18 — Versão pública",nav:["I Love You Moneypenis","O Teaser","Os preciosos estojos","In Situ adora isso","O preço das berinjelas","Belas penas, deveras…","🍆","I love you too","Aqui tudo recomeça","Das canetas e das mãos"],navPresse:"Demasiadas honras para tão pouca carne",hl:"Edição Limitada",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Um Conto de Fadas Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Entrar na obra",pt:"I Love You Moneypenis",ps:"11 cópias em prata · Traphot · Assinadas e numeradas",mg:"Clique para ampliar",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Tiragem argêntica · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Impressão em papel Arches · Numerada e assinada à mão pelos dois artistas",op:"Abertura",tx:"Texto",pr:"Obra protegida",ct:"O Coffret",cs:"Portfolio completo · 11 cópias · Assinadas · Luvas",zt:"In Situ",zs:"As obras em situação",vt:"Vídeo",vs:"Conteúdo para adultos",st:"Adquirir",pft:"Pequeno Formato 30×40",pfc:"50 portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Assinadas · Numeradas · Luvas",pd:"Traphot",p1:"Portfólio Pequeno Formato · completo",p2:"Gravura avulsa · Pequeno Formato",p3:"Portfólio Grande Formato · completo",p4:"Gravura avulsa · Grande Formato",sh:"Transporte",sb:"DHL · França 45€ · Europa 95€ · Internacional 180€",py:"Pagamento",pb:"Transferência · Cartão · PayPal",co:"Condições",cb:"Certificado · Devolução 14 dias",rv:"Reservar",by:"Adquirir",bt:"De penas e de mãos",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — que lembra, como uma espécie de resignação estilística, que todos sempre o chamaram Sébastien — é o que acontece quando a disciplina e a vontade se recusam a domesticar a obsessão.\n\nNascido em 25 de dezembro de 1972 num cenário demasiado perfeito para ser inocente — Saint-Tropez — cresce à sombra da precisão, um pai dentista moldando bocas, e do mito: resistentes, marinheiros, desaparecidos, fantasmas familiares que se recusam a permanecer enterrados. Aos dez anos, recebe um arsenal completo de pintura. Não um brinquedo. Uma primeira arma carregada — início de uma coleção barroca, a de um louco por guerras íntimas.\n\nNunca as devolverá. Preferindo multiplicar os seus campos de batalha.\n\nAvança por deslocamentos sucessivos: pintura, livros, imagens, relações humanas — tudo se torna material, tudo pode ser remontado. O que constrói não é uma obra no sentido clássico, mas um campo de tensões: entre memória e invenção, fidelidade e traição, controlo e perda.\n\nNão trabalha para as instituições. Infiltra-as. Desde os anos 90, na órbita do galerista Enrico Navarra, constrói uma carreira que recusa rótulos: nem totalmente assalariado, nem totalmente artista, nem simples editor — antes uma anomalia produtiva, capaz de gerar livros, exposições, ligações, arquivos, ideias, comunicação, eventos, a um ritmo tão deslumbrante quanto descontínuo. Uma desordem que serve de camuflagem a este homem que destrói metodicamente todos os enquadramentos destinados a contê-lo.\n\nParticipa ativamente na conceção e desenvolvimento da coleção Made By…, projeto editorial internacional consagrado à criação contemporânea através de diferentes cenas culturais. Neste âmbito, colabora estreitamente com o fotógrafo Simon Schwyzer.\n\nA sua relação com Simon Schwyzer é o coração instável de tudo isso: uma colaboração transformada em dependência, uma amizade transformada em sistema amoroso. Um casal? Desde a morte brutal do fotógrafo suíço, Moreu responde: « Pergunte-lhe. » O facto é que após o seu desaparecimento, nada para — pelo contrário, tudo se intensifica. Trabalhar torna-se uma forma de reter, editar uma forma de prolongar, escrever uma forma de não ceder. Empenha-se na preservação e valorização da sua obra, nomeadamente através da preparação da publicação da monografia Made by… Simon Schwyzer.\n\nEm 2017, com o apoio de Enrico Navarra, fundara as Éditions Sébastien Moreu, estrutura independente dedicada a livros de arte, ensaios e projetos editoriais transversais. A memória do fotógrafo suíço destruirá a empresa. Não os projetos.\n\nMais tarde, com André Vaszkievicz, o íntimo muda novamente de forma. I Love You Moneypenis não é um projeto decorativo posto sobre a sua relação: é uma colisão de texto, imagem, desejo, dinheiro, corpo. Uma obra concebida do interior do vínculo, sem filtro protetor. O seu casamento, em 19 de outubro de 2024 em Saint-Tropez, não estabiliza nada: oficializa o que já transbordava.\n\nO seu próprio trabalho — colagens, textos, dispositivos editoriais — pertence a uma estética da exposição. Jornais abertos, imagens recortadas, memória tratada como matéria-prima. Nada é neutro. Tudo está implicado.\n\nFisicamente, carrega um corpo que nem sempre coopera: coração rápido, tensão caprichosa, sistema sob pressão. E no entanto, continua, com hábitos que por vezes se parecem com o desafio, por vezes com a indiferença face às consequências. Nenhuma narrativa própria de redenção aqui. Apenas a persistência.\n\nAma intensamente, arquiva obsessivamente, trabalha compulsivamente, e recusa simplificar fosse o que fosse.\n\nSe existe um princípio unificador, é este: Sébastien Moreu não resolve as suas contradições, tanto venera as dos outros.\n\nAs suas, organiza-as — depois vive no interior da exposição. Esta galeria é a sua casa e aquela que oferece inteira àqueles que ama, nada é jamais para si.\n\nPara concluir, citaria Desproges: « Espantoso, não? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz nasceu a 28 de novembro de 1990 num Brasil que pouco se assemelha aos postais tropicais. Seberi, pequena cidade rural do sul do país, pertence àqueles territórios moldados pelas migrações europeias do século XX: comunidades polacas aqui, mas um pouco mais longe alemãs, italianas, lituanas… onde as línguas, as tradições, as danças e o catolicismo sobrevivem por vezes com mais obstinação do que nos seus países de origem.\n\nFilho de descendentes polacos nascidos no Brasil, André cresce num ambiente estruturado pelo trabalho, pela religião, pelos silêncios e pelos códigos viris. Último filho de uma fratria de oito (com uma única irmã), nascido quase dez anos depois do mais novo dos seus irmãos mais velhos, chega a uma família já marcada pelo esforço, pelas limitações e pelo peso das heranças culturais.\n\nUm imprevisto amado. Amado mas não esperado. Estará bem sozinho nessa família numerosa.\n\nMuito cedo compreende duas coisas: sente-se profundamente no seu lugar na escola, e certos desejos não têm lugar no mundo onde cresce.\n\nA adolescência gay não é fácil para ninguém, em lugar nenhum… mas naquele contexto rural e conservador, nem sequer se fala disso. A palavra não existe e o desejo vive-se mais como uma tensão interior do que como uma identidade possível.\n\nAndré aprende então a observar e a calar-se, a controlar os seus gestos, a culpar o seu corpo e as suas emoções.\nÉ demasiado sensível para falar e demasiado calado para ser sentimental. Demasiado disciplinado para não ser ferido. Demasiado desejado para amar simplesmente. Demasiado traído para o confiar.\n\nMas havia os livros, os dicionários, os mapas geográficos, as línguas estrangeiras — todo um mundo de papel quase infinito que já lhe permitia deixar Seberi mentalmente antes de o poder fazer fisicamente.\n\nDepois do equivalente ao bacharelado, brilhante, os estudos superiores permaneceriam contudo inacessíveis à sua condição. André trabalha em Porto Alegre, descobre um pouco de liberdade e um pouco de si mesmo com ela, depois deixa progressivamente o Brasil pela Europa e pelo Mundo. Talvez mais longe se possa encontrar mais de si.\nAprende inglês na Irlanda, obtém a nacionalidade lituana por ascendência familiar e desenvolve um domínio notável das línguas: português, espanhol, polaco, francês, alemão e várias outras ainda. A maior parte do tempo sozinho.\n\nA sua relação com as línguas é tanto uma questão de performance académica como uma forma de deslocamento existencial: mudar de língua torna-se também uma maneira de deslocar o constrangimento, enganar o tédio, atravessar as fronteiras e melhorar o olhar que lança sobre si mesmo.\n\nOs anos seguintes assemelham-se durante muito tempo a uma travessia precária da Europa contemporânea: desenraizamento, pandemia, reconstrução permanente.\n\nNo entanto, André conserva uma disciplina quase ascética: desporto, trabalho intelectual constante, controlo alimentar, nunca álcool, e praticamente nenhuma droga. O seu corpo parece tratado como um território que é preciso manter de pé custe o que custar.\n\nO encontro com Sébastien Moreu transforma essa trajetória, mas não apaga as feridas… ou pelo menos tenta suavizá-las. Juntos, desenvolvem I Love You Moneypenis, projeto que mistura imagem, desejo, autobiografia e performance. O seu casamento, celebrado em Saint-Tropez a 19 de outubro de 2024, não estabiliza o caos: dá-lhe simplesmente uma forma viável e visível, uma trégua.\n\nEm paralelo, André retoma estudos na Sorbonne Nouvelle em ciências da linguagem, onde os seus resultados rapidamente atraem a atenção, sobretudo em chinês. Realiza também um estágio notado no Cours Florent. O tímido revela-se a si mesmo, descobre a força libertadora da expressão das emoções que se autoriza por serem escritas por outros. Verão de 2025, parte em imersão universitária a Taiwan; este ano será Xangai.\n\nApaixonado por astrologia e espiritualidades antigas, empenhado num trabalho terapêutico profundo em torno do seu vivido, André continua contudo difícil de resumir. Tudo nele parece organizado para transformar as feridas em arquitetura interior.\n\nMas aos olhos de Sébastien Moreu, o mais comovente está noutro lugar: o mais comovente é ver André observar uma flor silvestre. Porque então toda a mecânica cai — o domínio, a defesa, o controlo — e reaparece subitamente algo extremamente raro: uma doçura intacta que sobreviveu a todo o resto.\n\nPara concluir, citaria provavelmente Jorge Amado: « O mundo só vale pela emoção que nos dá. » ou mais seguramente hoje Gisèle Pelicot: « A vergonha deve mudar de campo. »",prst:"Material de imprensa",prss:"Em preparação",prsc:"contact@moneypenis.com",plt:"Falam da obra",pls:"Em breve",nt:"Contacto",ns:"Enviar",n1:"Nome",n2:"Email",n3:"Mensagem",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Declaro sob minha responsabilidade ter 18 anos ou mais e ser maior de idade segundo a legislação do meu país de residência.",ck2:"Reconheço que este site apresenta obras fotográficas artísticas de carácter explícito, incluindo a venda de tiragens originais, e aceito aceder a ele com pleno conhecimento.",nat:"Nota dos autores",naf:"Os Autores fazem questão de avisar que a leveza divertida do título e do logótipo podem, tal como os visuais e textos explícitos das obras, dar uma impressão de descontração perante um tema, no entanto, grave. Lembram que não é o caso e que este conto nasceu das suas experiências pessoais. Tendo ambos vivido, por razões e em épocas diferentes, todos os seus aspectos.\n\nO seu projeto artístico comum tem a intenção de dissuadir qualquer pessoa de se envolver nesta atividade alertando que, ainda hoje: fecha mais portas do que abre e expõe a inúmeros riscos quem a pratica e os seus próximos. Nomeadamente infeções e doenças, em particular as DST, adições ao uso de drogas e álcool… Esta atividade, sob qualquer forma, expõe à precariedade, à dependência, à rejeição social, à violência, à chantagem, aos abusos, à coação e às extorsões.\n\nPara os poucos demasiados raros que conseguem sair, exige sempre um acompanhamento psicológico a muito longo prazo, tanto as nossas sociedades não lhes deixam outra saída que a vitimização ou a vergonha, ou mesmo as duas ao mesmo tempo.\n\nOs autores apelam portanto ao respeito e à proteção dos trabalhadores do sexo. Sem por isso desconvirem da necessidade de uma penalização dos clientes, apelam igualmente a um tratamento digno da miséria afetiva, ou mesmo da angústia, que os leva a contravir a Lei. Os autores esperam, da parte do grande público como das instituições, um maior apoio às associações que podem acompanhar uns e outros.\n\nNão se trata aqui de levantar cegamente os tabus sobre todas as práticas, nem de fazer escândalo… Mas de lembrar a urgência de nos desfazermos das proibições societais que esclerosam um debate público que deveria ser sereno, e não coberto com um manto moral que nada tem a fazer aí e impede toda libertação da palavra. Não têm dúvida alguma de que, se há um véu a banir, é este.\n\nE por debate, entendem evocar o primeiro de todos, aquele que se deveria realizar no seio da família.\n\nE além disso… é bonita… também… uma pila !\n\n(O modelo selecionado pelos artistas não é um trabalhador do sexo. Partilhando a sua vida com um dos autores, fez questão de permanecer anónimo.)\n\nSe os Autores abordaram este tema que os toca, é porque lhes pareceu que, na nossa era de comunicação formatada, de censura das redes e de renascimento do pudibundismo, era mais que nunca necessário trazer um ponto de vista criativo e artístico que permanece estranhamente ausente. Quiseram dar a este conjunto tanto a leveza que deveria prevalecer ao evocar o amor e o prazer, como o peso imposto pelas realidades vividas: com coragem e sem pathos.\n\nNão pretendem substituir-se às escolhas individuais, nem às leis em vigor em países soberanos nem aos valores aos quais cada um é livre de aderir.\n\nEm França — não é o caso em todos os países, mesmo democráticos — as respostas dadas pela polícia e justiça, no quadro legal de uma luta essencial contra o tráfico de seres humanos, têm vindo a melhorar ao longo dos anos no sentido do que se espera de um país moderno. Mas fazem-no no quadro geral e não trazem, talvez não seja o seu papel, melhorias às situações individuais vividas tanto pelos trabalhadores do sexo como pelos seus clientes. Associações cumprem discretamente as suas missões apesar da fragilidade dos seus meios.\n\nTanto para as administrações como para as associações, existem sites na Internet. Alguns muito úteis estão selecionados e disponíveis numa lista regularmente atualizada no nosso próprio site: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Estampas avulsas",siCh:"Escolher formato",siInq:"Consultar",siNote:"Preços em euros, IVA francês incluído. Embalagem, transporte e seguro faturados ao custo real.",siCont:"Para adquirir, escreva-nos para smoreu@mac.com — ou use o formulário de contato",siPro:"Livreiros, marchands e galerias — escreva-nos para condições profissionais, exposições e depósitos.",siRgpd:"Os seus dados serão usados apenas para a sua consulta e para informações sobre os projetos dos artistas.",siPick:"Toque numa gravura para ver e adquirir",req:"Fazer um pedido",reqAge:"Esta secção é reservada a maiores de idade.",shPfD:"30 × 40 cm · 50 exemplares numerados e assinados",shGfD:"50 × 70 cm · 15 exemplares numerados e assinados",shUn:"Gravuras avulsas",shUnD:"Cada gravura disponível em Pequeno ou Grande Formato · assinadas S.M. & A.V.",fFirstName:"Nome próprio",fPhone:"Telefone",fCountry:"País",fLangPref:"Idioma de resposta",fPref:"Preferência de contato",fMatrix:"Objeto do seu pedido",fMatrixHint:"Marque as caixas correspondentes",fMsgPh:"Detalhes (máx. 500 caracteres)",fConsent:"Aceito as condições acima e a transmissão dos meus dados a Sébastien Moreu e André Vaszkievicz.",fSent:"Pedido enviado. Receberá uma resposta no endereço indicado.",fError:"Falha no envio. Pode escrever diretamente para smoreu@mac.com.",rqInfo:"Informação",rqBuy:"Compra",rqDeposit:"Consignação",rqPro:"Profissional",rqColl:"Colecionador",rqOther:"Outro",continueShop:"Continuar a consultar",nax:"Ler tudo ▾",nac:"Reduzir ▴",aiWarn:"ATENÇÃO: ESTA TRADUÇÃO É GERADA POR IA E PODE CONTER ERROS OU CONTRASSENSOS",rqAcq:"Disponibilidade e modalidades de aquisição",rqPress:"Imprensa",rqInfo2:"Informações gerais",rqPro2:"Profissional · Revendedores",rqOther2:"Diversos",shopPortPF:"Portfólio · Formato Pequeno",shopPortGF:"Portfólio · Formato Grande",shopSingPF:"Gravuras avulsas · Formato Pequeno",shopSingGF:"Gravuras avulsas · Formato Grande",priceLbl:"Preço com IVA",priceUnit:"IVA incl.",pricePer:"/ gravura",availPort:"Números %F% a %T% de %N% comercializados",availSingle:"Provenientes dos portfólios %F% a %T% de %N%",noChoice:"O número da tiragem é atribuído automaticamente (não selecionável pelo comprador)",shopFormTitle:"Fazer um pedido",shopFormSubtitle:"Selecione os produtos e a natureza do seu pedido. Nossa equipe responderá rapidamente.",shopFmtPF:"Formato Pequeno · 30 × 40 cm",shopFmtGF:"Formato Grande · 50 × 70 cm",ctTitle:"Escreva-nos",ctSubtitle:"Uma pergunta sobre o projeto, sobre os artistas ou outra — escreva-nos, responderemos.",ctSubj:"Assunto da sua mensagem",ctSubjProj:"O projeto I Love You Moneypenis",ctSubjArt:"Os artistas",ctSubjOther:"Outra pergunta",ctFollow:"Siga-nos"},
  DE:{techs:["Gedicht · Goldenes Kreuz","Handschriftlicher Brief · Marineblaue Tinte · Skulptur","Farbfotografie · Gelber Text","Silbergelatineabzug · Handschriftliche grüne Tinte","Farbfoto · Roter Text · Hermès-Krawatte","Farbfotografie · Offene Jeans · Natur","Cyan getöntes Foto · Orange handschriftlicher Brief","Roter Text · S/W · Mehrsprachige Warnung","Handschriftlicher Brief · 50€-Scheine · Hände","Roter Text · S/W · Manifest","Handschriftlicher Brief · Blumenhintergrund · Marineblaue Tinte"],aw:"Expliziter Inhalt",am:"Fotografien für Erwachsene.",ap:"+ 18 — Vollständige Version",am2:"− 18 — Öffentliche Version",nav:["I Love You Moneypenis","Der Teaser","Die kostbaren Mappen","In Situ mag das","Der Auberginenpreis","Wahrhaft schöne Federn…","🍆","I love you too","Hier fängt alles wieder an","Von Stiften und Händen"],navPresse:"Zu viele Ehren für so wenig Fleisch",hl:"Limitierte Auflage",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Ein Gay Pop Porn Märchen.\nCollection La Grande Librairie de Saint-Tropez®",hc:"In das Werk eintreten",pt:"I Love You Moneypenis",ps:"11 Silbergelatinedrucke · Traphot · Signiert",mg:"Zum Vergrößern klicken",tech_info:"2024 · 30 × 40 cm (50 Ex.) · 50 × 70 cm (15 Ex.) · Silbergelatinedruck · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 Ex.) · 50 × 70 cm (15 Ex.) · Druck auf Arches-Papier · Von beiden Künstlern handnummeriert und signiert",op:"Eröffnung",tx:"Text",pr:"Geschütztes Kunstwerk",ct:"Das Set",cs:"Vollständiges Portfolio · 11 Drucke · Handschuhe",zt:"In Situ",zs:"Die Werke in situ",vt:"Film",vs:"Nur für Erwachsene",st:"Erwerben",pft:"Kleinformat 30×40",pfc:"50 Portfolios 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Großformat 50×70",gfc:"15 Portfolios 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Signiert · Nummeriert · Handschuhe",pd:"Traphot",p1:"Portfolio Kleinformat · vollständig",p2:"Einzelblatt · Kleinformat",p3:"Portfolio Großformat · vollständig",p4:"Einzelblatt · Großformat",sh:"Versand",sb:"DHL · Frankreich 45€ · Europa 95€ · International 180€",py:"Zahlung",pb:"Überweisung · Kreditkarte · PayPal",co:"Bedingungen",cb:"Echtheitszertifikat · 14-tägiges Rückgaberecht",rv:"Reservieren",by:"Erwerben",bt:"Von Federn & Händen",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — der uns als eine Art stilistischer Resignation daran erinnert, dass ihn alle immer Sébastien genannt haben — ist das, was passiert, wenn Disziplin und Wille sich weigern, die Besessenheit zu zähmen.\n\nGeboren am 25. Dezember 1972 in einer Kulisse, die zu perfekt ist, um unschuldig zu sein — Saint-Tropez — wächst er im Schatten der Präzision auf, eines Zahnarztvaters, der Münder formt, und des Mythos: Widerstandskämpfer, Seeleute, Verschwundene, Familiengespenster, die sich weigern, begraben zu bleiben. Mit zehn Jahren wird ihm ein vollständiges Malarsenal überreicht. Kein Spielzeug. Eine erste geladene Waffe — der Anfang einer barocken Sammlung, die eines Verrückten intimer Kriege.\n\nEr wird sie nie zurückgeben. Er zieht es vor, seine Schlachtfelder zu vervielfältigen.\n\nEr schreitet durch aufeinanderfolgende Verschiebungen voran: Malerei, Bücher, Bilder, menschliche Beziehungen — alles wird Material, alles kann neu zusammengesetzt werden. Was er baut, ist kein Werk im klassischen Sinne, sondern ein Spannungsfeld: zwischen Erinnerung und Erfindung, Treue und Verrat, Kontrolle und Verlust.\n\nEr arbeitet nicht für die Institutionen. Er infiltriert sie. Seit den 90er Jahren, in der Umlaufbahn des Galeristen Enrico Navarra, baut er eine Karriere auf, die Etiketten ablehnt: weder ganz Angestellter, noch ganz Künstler, noch einfacher Verleger — vielmehr eine produktive Anomalie, fähig, Bücher, Ausstellungen, Verbindungen, Archive, Ideen, Kommunikation, Veranstaltungen zu generieren, in einem ebenso atemberaubenden wie unzusammenhängenden Tempo. Eine Unordnung, die diesem Mann als Tarnung dient, der methodisch alle Rahmen zerstört, die ihn enthalten sollen.\n\nEr beteiligt sich aktiv an der Konzeption und Entwicklung der Sammlung Made By…, einem internationalen Editionsprojekt, das dem zeitgenössischen Schaffen über verschiedene kulturelle Szenen hinweg gewidmet ist. In diesem Rahmen arbeitet er eng mit dem Fotografen Simon Schwyzer zusammen.\n\nSeine Beziehung zu Simon Schwyzer ist das instabile Herz davon: eine Zusammenarbeit, die zur Abhängigkeit wurde, eine Freundschaft, die in ein Liebessystem verwandelt wurde. Ein Paar? Seit dem brutalen Tod des Schweizer Fotografen antwortet Moreu: « Fragen Sie ihn. » Tatsache ist, dass nach seinem Verschwinden nichts aufhört — im Gegenteil, alles verstärkt sich. Arbeiten wird zu einer Art, festzuhalten, Editieren zu einer Art, zu verlängern, Schreiben zu einer Art, nicht nachzugeben. Er engagiert sich in der Bewahrung und Aufwertung seines Werks, insbesondere durch die Vorbereitung der Veröffentlichung der Monografie Made by… Simon Schwyzer.\n\n2017 hatte er mit Unterstützung von Enrico Navarra die Éditions Sébastien Moreu gegründet, eine unabhängige Struktur, die Kunstbüchern, Essays und übergreifenden Editionsprojekten gewidmet ist. Die Erinnerung an den Schweizer Fotografen wird das Unternehmen zerstören. Nicht die Projekte.\n\nSpäter, mit André Vaszkievicz, ändert sich das Intime erneut. I Love You Moneypenis ist kein dekoratives Projekt, das ihre Beziehung überdeckt: Es ist eine Kollision von Text, Bild, Begierde, Geld, Körper. Ein Werk, das von innerhalb der Bindung konzipiert wurde, ohne schützenden Filter. Ihre Heirat am 19. Oktober 2024 in Saint-Tropez stabilisiert nichts: Sie macht offiziell, was bereits überfloss.\n\nSeine eigene Arbeit — Collagen, Texte, Editionsvorrichtungen — gehört zu einer Ästhetik der Ausstellung. Aufgeschlagene Zeitungen, ausgeschnittene Bilder, Erinnerung als Rohmaterial behandelt. Nichts ist neutral. Alles ist beteiligt.\n\nKörperlich trägt er einen Körper, der nicht immer mitarbeitet: schnelles Herz, launischer Blutdruck, System unter Druck. Und dennoch macht er weiter, mit Gewohnheiten, die manchmal an Trotz erinnern, manchmal an Gleichgültigkeit gegenüber den Folgen. Hier keine eigene Erlösungsgeschichte. Nur die Beharrlichkeit.\n\nEr liebt intensiv, archiviert obsessiv, arbeitet zwanghaft und weigert sich, irgendetwas zu vereinfachen.\n\nWenn es ein vereinendes Prinzip gibt, ist es dieses: Sébastien Moreu löst seine Widersprüche nicht, so sehr verehrt er die der anderen.\n\nSeine eigenen organisiert er — dann lebt er im Inneren der Ausstellung. Diese Galerie ist sein Haus und das Haus, das er denen, die er liebt, vollständig anbietet; nichts ist jemals für ihn.\n\nUm zu schließen, würde er Desproges zitieren: « Erstaunlich, nicht wahr? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz wurde am 28. November 1990 in einem Brasilien geboren, das den tropischen Postkarten kaum ähnelt. Seberi, eine kleine ländliche Stadt im Süden des Landes, gehört zu jenen Gebieten, die von den europäischen Migrationen des 20. Jahrhunderts geprägt wurden: hier polnische Gemeinschaften, etwas weiter weg deutsche, italienische, litauische… wo Sprachen, Traditionen, Tänze und der Katholizismus zuweilen mit noch mehr Hartnäckigkeit überleben als in ihren Herkunftsländern.\n\nAls Sohn polnischer Nachfahren, in Brasilien geboren, wächst André in einer Umgebung auf, die von Arbeit, Religion, Schweigen und männlichen Codes strukturiert ist. Als letztes Kind von acht Geschwistern (mit nur einer Schwester), fast zehn Jahre nach dem jüngsten seiner älteren Geschwister geboren, kommt er in eine Familie, die bereits durch Anstrengung, Zwänge und das Gewicht kultureller Erbschaften geprägt ist.\n\nEin geliebter Unvorhergesehener. Geliebt, aber nicht erwartet. Er wird ganz allein sein in dieser großen Familie.\n\nSehr früh begreift er zwei Dinge: Er fühlt sich tief am rechten Platz in der Schule, und bestimmte Begierden haben keinen Platz in der Welt, in der er aufwächst.\n\nDie schwule Adoleszenz ist für niemanden leicht, nirgendwo… doch in jenem ländlichen und konservativen Kontext ist davon nicht einmal die Rede. Das Wort existiert nicht, und das Begehren wird mehr als innere Spannung erlebt denn als mögliche Identität.\n\nAndré lernt also zu beobachten und zu schweigen, seine Gesten zu kontrollieren, seinen Körper und seine Gefühle anzuklagen.\nEr ist zu sensibel, um zu sprechen, und zu schweigsam, um sentimental zu sein. Zu diszipliniert, um nicht verletzt zu werden. Zu begehrt, um einfach zu lieben. Zu verraten, um es anzuvertrauen.\n\nDoch da waren die Bücher, die Wörterbücher, die geografischen Karten, die Fremdsprachen — eine ganze, fast unendliche Welt aus Papier, die es ihm erlaubte, Seberi geistig zu verlassen, bevor er es körperlich konnte.\n\nNach dem brillanten Äquivalent zum Abitur blieben höhere Studien dennoch seinem Stand unzugänglich. André arbeitet in Porto Alegre, entdeckt damit ein wenig Freiheit und ein wenig von sich selbst, und verlässt dann nach und nach Brasilien Richtung Europa und Welt. Vielleicht kann man weiter weg mehr von sich finden.\nEr lernt Englisch in Irland, erhält die litauische Staatsangehörigkeit über familiäre Abstammung und entwickelt eine bemerkenswerte Beherrschung von Sprachen: Portugiesisch, Spanisch, Polnisch, Französisch, Deutsch und noch mehrere weitere. Meistens allein.\n\nSein Verhältnis zu den Sprachen ist ebenso eine Frage akademischer Leistung wie einer Form existenzieller Verschiebung: die Sprache zu wechseln wird auch ein Mittel, die Verlegenheit zu verschieben, die Langeweile zu täuschen, Grenzen zu überschreiten und den Blick auf sich selbst zu verbessern.\n\nDie folgenden Jahre gleichen lange einer prekären Durchquerung des heutigen Europas: Entwurzelung, Pandemie, ständige Rekonstruktion.\n\nDennoch bewahrt André eine fast asketische Disziplin: Sport, ständige intellektuelle Arbeit, Ernährungskontrolle, nie Alkohol und praktisch keine Drogen. Sein Körper scheint wie ein Territorium behandelt zu werden, das um jeden Preis aufrecht gehalten werden muss.\n\nDie Begegnung mit Sébastien Moreu verändert diesen Weg, ohne jedoch die Wunden auszulöschen… zumindest versucht sie, sie zu mildern. Gemeinsam entwickeln sie I Love You Moneypenis, ein Projekt, das Bild, Begehren, Autobiografie und Performance verbindet. Ihre Heirat, am 19. Oktober 2024 in Saint-Tropez gefeiert, stabilisiert das Chaos nicht: sie verleiht ihm einfach eine lebbare und sichtbare Form, eine Atempause.\n\nParallel dazu nimmt André sein Studium an der Sorbonne Nouvelle in Sprachwissenschaften wieder auf, wo seine Ergebnisse rasch Aufmerksamkeit erregen, insbesondere im Chinesischen. Er absolviert außerdem ein viel beachtetes Praktikum am Cours Florent. Der Schüchterne offenbart sich sich selbst, entdeckt die befreiende Kraft des Ausdrucks von Emotionen, den er sich erlaubt, weil sie von anderen geschrieben sind. Sommer 2025 reist er zu einem universitären Aufenthalt nach Taiwan; dieses Jahr wird es Shanghai sein.\n\nLeidenschaftlich an Astrologie und alten Spiritualitäten interessiert, in eine tiefe therapeutische Arbeit über seine Erfahrung engagiert, bleibt André dennoch schwer zusammenzufassen. Alles an ihm scheint darauf ausgerichtet, Wunden in innere Architektur zu verwandeln.\n\nDoch in den Augen von Sébastien Moreu liegt das Ergreifendste anderswo: das Ergreifendste ist, André bei der Betrachtung einer Wildblume zuzusehen. Denn dann fällt die ganze Mechanik in sich zusammen — die Meisterschaft, die Verteidigung, die Kontrolle — und plötzlich taucht etwas extrem Seltenes wieder auf: eine unversehrte Zartheit, die alles andere überlebt hat.\n\nZum Abschluss würde er wahrscheinlich Jorge Amado zitieren: „Die Welt ist nur die Emotion wert, die sie uns schenkt.\" oder, heute eher noch, Gisèle Pelicot: „Die Scham muss die Seite wechseln.\"",prst:"Pressemappe",prss:"In Vorbereitung",prsc:"contact@moneypenis.com",plt:"In der Presse",pls:"Demnächst",nt:"Kontakt",ns:"Senden",n1:"Name",n2:"Email",n3:"Nachricht",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Ich erkläre hiermit, dass ich 18 Jahre oder älter bin und nach den Gesetzen meines Wohnsitzlandes volljährig bin.",ck2:"Ich erkenne an, dass diese Website explizite künstlerische Fotografien präsentiert, einschließlich des Verkaufs von Originaldrucken, und willige wissentlich in den Zugang ein.",nat:"Vorwort der Autoren",naf:"Die Autoren möchten darauf hinweisen, dass die unterhaltsame Leichtigkeit von Titel und Logo, ebenso wie die expliziten Bilder und Texte der Werke, den Eindruck einer Unbekümmertheit gegenüber einem dennoch ernsten Thema vermitteln können. Sie erinnern daran, dass dies nicht der Fall ist und dass diese Erzählung aus ihren persönlichen Erfahrungen entstanden ist. Beide haben aus unterschiedlichen Gründen und zu unterschiedlichen Zeiten alle Aspekte erlebt.\n\nIhr gemeinsames künstlerisches Projekt hat die Absicht, jeden davon abzuhalten, sich auf eine Tätigkeit einzulassen, indem sie davor warnen, dass diese auch heute noch: mehr Türen schließt als öffnet und diejenigen, die sie ausüben, und ihre Angehörigen einer Vielzahl von Risiken aussetzt. Insbesondere Infektionen und Krankheiten, vor allem Geschlechtskrankheiten, Drogen- und Alkoholabhängigkeiten… Diese Tätigkeit, in welcher Form auch immer, setzt der Prekarität, der Abhängigkeit, der sozialen Ablehnung, der Gewalt, der Erpressung, dem Missbrauch, dem Zwang und der Schutzgelderpressung aus.\n\nFür die zu wenigen, die es schaffen, sich zu befreien, erfordert sie stets eine sehr langfristige psychologische Begleitung, da unsere Gesellschaften ihnen kaum andere Auswege lassen als Viktimisierung oder Scham, oder sogar beides zugleich.\n\nDie Autoren rufen daher zum Respekt und zum Schutz der Sexarbeiter:innen auf. Ohne die Notwendigkeit einer Bestrafung der Freier in Frage zu stellen, rufen sie ebenso zu einer würdigen Behandlung der emotionalen Not, ja Verzweiflung auf, die diese dazu bringt, gegen das Gesetz zu verstoßen. Die Autoren erhoffen sich, sowohl von der Öffentlichkeit als auch von den Institutionen, eine größere Unterstützung für Vereine, die beide Seiten begleiten können.\n\nEs geht hier keineswegs darum, blindlings die Tabus über sämtliche Praktiken aufzuheben, noch einen Skandal zu schüren… Sondern darum, an die Dringlichkeit zu erinnern, sich von den gesellschaftlichen Verboten zu lösen, die eine öffentliche Debatte versteinern lassen, die jedoch besonnen sein sollte und nicht mit einem moralischen Gewand bedeckt, das dort nichts zu suchen hat und jede Befreiung der Sprache verhindert. Sie haben keinen Zweifel: wenn es einen Schleier zu lüften gilt, dann diesen.\n\nUnd mit Debatte meinen sie die erste von allen, die innerhalb der Familie geführt werden sollte.\n\nUnd außerdem… ist sie schön… auch… ein Schwanz !\n\n(Das vom Künstlerpaar ausgewählte Modell ist kein Sexarbeiter. Da es sein Leben mit einem der Autoren teilt, hat es darauf bestanden, anonym zu bleiben.)\n\nWenn die Autoren sich diesem Thema gewidmet haben, das sie berührt, dann weil es ihnen schien, dass in unserer Zeit der formatierten Kommunikation, der Netzwerk-Zensur und der Renaissance der Prüderie es notwendiger denn je war, eine kreative und künstlerische Perspektive einzubringen, die seltsamerweise abwesend bleibt. Sie wollten diesem Ganzen sowohl die Leichtigkeit verleihen, die beim Evozieren von Liebe und Lust überwiegen sollte, als auch das Gewicht der gelebten Realitäten: mit Mut und ohne Pathos.\n\nSie haben nicht die Absicht, sich an die Stelle individueller Entscheidungen zu setzen, ebenso wenig wie an die Stelle der in souveränen Ländern geltenden Gesetze oder der Werte, denen jede:r frei steht beizutreten.\n\nIn Frankreich — was nicht in allen, selbst demokratischen Ländern der Fall ist — haben sich die Antworten der Polizei und der Justiz, im rechtlichen Rahmen eines wesentlichen Kampfes gegen den Menschenhandel, im Laufe der Jahre in dem Sinne verbessert, den man von einem modernen Land erwartet. Doch sie tun dies im allgemeinen Rahmen und bringen keine Verbesserung — vielleicht ist es nicht ihre Aufgabe — der individuellen Situationen, die sowohl Sexarbeiter:innen als auch ihre Kund:innen erleben. Vereine erfüllen still ihre Aufgaben trotz der Knappheit ihrer Mittel.\n\nSowohl für die zuständigen Verwaltungen als auch für die Vereine existieren Webseiten. Einige sehr nützliche sind ausgewählt und auf einer regelmäßig aktualisierten Liste auf unserer eigenen Website verfügbar: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Einzeldrucke",siCh:"Format wählen",siInq:"Anfragen",siNote:"Preise in Euro, französische MwSt. inkl. Verpackung, Versand und Versicherung zum Selbstkostenpreis.",siCont:"Zum Erwerb schreiben Sie an smoreu@mac.com — oder über das Kontaktformular",siPro:"Buchhändler, Kunsthändler und Galerien — schreiben Sie uns für Konditionen, Ausstellungen und Konsignationen.",siRgpd:"Ihre Angaben werden ausschließlich für Ihre Anfrage und für Informationen zu den Projekten der Künstler verwendet.",siPick:"Auf einen Druck tippen, um ihn anzusehen und zu erwerben",req:"Eine Anfrage stellen",reqAge:"Dieser Bereich ist Erwachsenen vorbehalten.",shPfD:"30 × 40 cm · 50 nummerierte und signierte Ausgaben",shGfD:"50 × 70 cm · 15 nummerierte und signierte Ausgaben",shUn:"Einzelblätter",shUnD:"Jedes Blatt verfügbar in Klein- oder Großformat · signiert S.M. & A.V.",fFirstName:"Vorname",fPhone:"Telefon",fCountry:"Land",fLangPref:"Antwortsprache",fPref:"Kontaktwunsch",fMatrix:"Gegenstand Ihrer Anfrage",fMatrixHint:"Bitte die zutreffenden Felder ankreuzen",fMsgPh:"Anmerkungen (max. 500 Zeichen)",fConsent:"Ich akzeptiere die obigen Bedingungen und die Übermittlung meiner Angaben an Sébastien Moreu und André Vaszkievicz.",fSent:"Anfrage gesendet. Sie erhalten eine Antwort an die angegebene Adresse.",fError:"Senden fehlgeschlagen. Sie können direkt an smoreu@mac.com schreiben.",rqInfo:"Information",rqBuy:"Kauf",rqDeposit:"Konsignation",rqPro:"Fachhandel",rqColl:"Sammler",rqOther:"Sonstiges",continueShop:"Weiter stöbern",nax:"Vollständig lesen ▾",nac:"Einklappen ▴",aiWarn:"ACHTUNG: DIESE ÜBERSETZUNG WURDE VON KI ERZEUGT UND KANN FEHLER ODER MISSVERSTÄNDNISSE ENTHALTEN",rqAcq:"Verfügbarkeit & Erwerbsmodalitäten",rqPress:"Presse",rqInfo2:"Allgemeine Informationen",rqPro2:"Fachhandel · Wiederverkäufer",rqOther2:"Sonstiges",shopPortPF:"Portfolio · Kleinformat",shopPortGF:"Portfolio · Großformat",shopSingPF:"Einzelblätter · Kleinformat",shopSingGF:"Einzelblätter · Großformat",priceLbl:"Preis inkl. MwSt.",priceUnit:"inkl. MwSt.",pricePer:"/ Blatt",availPort:"Nummern %F% bis %T% von %N% verfügbar",availSingle:"Aus den Portfolios %F% bis %T% von %N%",noChoice:"Die Auflagennummer wird automatisch zugewiesen (nicht vom Käufer wählbar)",shopFormTitle:"Anfrage stellen",shopFormSubtitle:"Wählen Sie die Produkte und die Art Ihrer Anfrage. Unser Team meldet sich zeitnah.",shopFmtPF:"Kleinformat · 30 × 40 cm",shopFmtGF:"Großformat · 50 × 70 cm",ctTitle:"Schreiben Sie uns",ctSubtitle:"Eine Frage zum Projekt, zu den Künstlern oder etwas anderem — schreiben Sie uns, wir antworten.",ctSubj:"Betreff Ihrer Nachricht",ctSubjProj:"Das Projekt I Love You Moneypenis",ctSubjArt:"Die Künstler",ctSubjOther:"Andere Frage",ctFollow:"Folgen Sie uns"},
  IT:{techs:["Poesia · Croce dorata","Lettera manoscritta · Inchiostro blu marino · Scultura","Fotografia a colori · Testo giallo","Stampa argentica · Inchiostro verde manoscritto","Foto a colori · Testo rosso · Cravatta Hermès","Fotografia a colori · Jeans aperto · Natura","Foto tinta ciano · Lettera manoscritta arancione","Testo rosso · B/N · Avviso multilingue","Lettera manoscritta · Banconote da 50€ · Mani","Testo rosso · B/N · Manifesto","Lettera manoscritta · Sfondo floreale · Inchiostro blu marino"],aw:"Contenuto Esplicito",am:"Opere fotografiche per adulti.",ap:"+ 18 — Versione completa",am2:"− 18 — Versione pubblica",nav:["I Love You Moneypenis","Il Teaser","I preziosi cofanetti","In Situ ti piace","Il prezzo delle melanzane","Belle penne, davvero…","🍆","I love you too","Qui tutto ricomincia","Di pennarelli e di mani"],navPresse:"Troppi onori per così poca carne",hl:"Edizione Limitata",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Parigi, 2024",hd:"Una Fiaba Pop Porn Gay.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Entrare nell'opera",pt:"I Love You Moneypenis",ps:"11 stampe all'argento · Traphot · Firmate",mg:"Clic per ingrandire",tech_info:"2024 · 30 × 40 cm (50 es.) · 50 × 70 cm (15 es.) · Stampa al gelatino-argento · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 es.) · 50 × 70 cm (15 es.) · Stampa su carta Arches · Numerata e firmata a mano dai due artisti",op:"Apertura",tx:"Testo",pr:"Opera protetta",ct:"Il Cofanetto",cs:"Portfolio completo · 11 stampe · Guanti",zt:"In Situ",zs:"Le opere in situazione",vt:"Film",vs:"Contenuto per adulti",st:"Acquisire",pft:"Piccolo Formato 30×40",pfc:"50 portfolio 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Grande Formato 50×70",gfc:"15 portfolio 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Firmate · Numerate · Guanti",pd:"Traphot",p1:"Portfolio Piccolo Formato · completo",p2:"Stampa singola · Piccolo Formato",p3:"Portfolio Grande Formato · completo",p4:"Stampa singola · Grande Formato",sh:"Spedizione",sb:"DHL · Francia 45€ · Europa 95€ · Internazionale 180€",py:"Pagamento",pb:"Bonifico · Carta · PayPal",co:"Condizioni",cb:"Certificato · Reso 14 giorni",rv:"Prenotare",by:"Acquisire",bt:"Di penne e di mani",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — che ricorda, come una sorta di rassegnazione stilistica, che tutti l'hanno sempre chiamato Sébastien — è ciò che accade quando la disciplina e la volontà si rifiutano di addomesticare l'ossessione.\n\nNato il 25 dicembre 1972 in uno scenario troppo perfetto per essere innocente — Saint-Tropez — cresce all'ombra della precisione, un padre dentista che modella bocche, e del mito: resistenti, marinai, scomparsi, fantasmi familiari che si rifiutano di rimanere sepolti. A dieci anni, gli viene consegnato un arsenale completo di pittura. Non un giocattolo. Una prima arma carica — inizio di una collezione barocca, quella di un pazzo di guerre intime.\n\nNon le restituirà mai. Preferendo moltiplicare i suoi campi di battaglia.\n\nAvanza per spostamenti successivi: pittura, libri, immagini, relazioni umane — tutto diventa materiale, tutto può essere riassemblato. Ciò che costruisce non è un'opera in senso classico, ma un campo di tensioni: tra memoria e invenzione, fedeltà e tradimento, controllo e perdita.\n\nNon lavora per le istituzioni. Le infiltra. Dagli anni '90, nell'orbita del gallerista Enrico Navarra, costruisce una carriera che rifiuta le etichette: né del tutto dipendente, né del tutto artista, né semplice editore — piuttosto un'anomalia produttiva, capace di generare libri, esposizioni, legami, archivi, idee, comunicazione, eventi, a un ritmo tanto strabiliante quanto discontinuo. Un disordine che serve da camuffamento a quest'uomo che distrugge metodicamente tutte le cornici destinate a contenerlo.\n\nPartecipa attivamente alla concezione e allo sviluppo della collezione Made By…, progetto editoriale internazionale dedicato alla creazione contemporanea attraverso diverse scene culturali. In questo ambito, collabora strettamente con il fotografo Simon Schwyzer.\n\nIl suo rapporto con Simon Schwyzer ne è il cuore instabile: una collaborazione divenuta dipendenza, un'amicizia trasformata in sistema amoroso. Una coppia? Dalla morte brutale del fotografo svizzero, Moreu risponde: « Chiedete a lui. » Sta di fatto che dopo la sua scomparsa, nulla si ferma — al contrario, tutto si intensifica. Lavorare diventa un modo per trattenere, editare un modo per prolungare, scrivere un modo per non cedere. Si impegna nella preservazione e nella valorizzazione della sua opera, in particolare attraverso la preparazione della pubblicazione della monografia Made by… Simon Schwyzer.\n\nNel 2017, con il sostegno di Enrico Navarra, aveva fondato le Éditions Sébastien Moreu, struttura indipendente dedicata ai libri d'arte, saggi e progetti editoriali trasversali. La memoria del fotografo svizzero distruggerà l'impresa. Non i progetti.\n\nPiù tardi, con André Vaszkievicz, l'intimo cambia ancora forma. I Love You Moneypenis non è un progetto decorativo posto sulla loro relazione: è una collisione di testo, immagine, desiderio, denaro, corpo. Un'opera concepita dall'interno del legame, senza filtro protettivo. Il loro matrimonio, il 19 ottobre 2024 a Saint-Tropez, non stabilizza nulla: rende ufficiale ciò che già traboccava.\n\nIl suo stesso lavoro — collage, testi, dispositivi editoriali — appartiene a un'estetica dell'esposizione. Giornali aperti, immagini ritagliate, memoria trattata come materia prima. Nulla è neutro. Tutto è implicato.\n\nFisicamente, porta un corpo che non sempre coopera: cuore rapido, pressione capricciosa, sistema sotto pressione. Eppure continua, con abitudini che a volte assomigliano alla sfida, a volte all'indifferenza per le conseguenze. Nessun racconto proprio di redenzione qui. Solo la persistenza.\n\nAma intensamente, archivia ossessivamente, lavora compulsivamente, e rifiuta di semplificare alcunché.\n\nSe esiste un principio unificatore, è questo: Sébastien Moreu non risolve le sue contraddizioni, tanto venera quelle degli altri.\n\nLe sue, le organizza — poi vive all'interno dell'esposizione. Questa galleria è la sua casa e quella che offre interamente a coloro che ama, nulla è mai per lui.\n\nPer concludere, citerebbe Desproges: « Sorprendente, non è vero? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz è nato il 28 novembre 1990 in un Brasile che assomiglia poco alle cartoline tropicali. Seberi, piccola città rurale del sud del paese, appartiene a quei territori plasmati dalle migrazioni europee del XX secolo: comunità polacche qui, ma poco più in là tedesche, italiane, lituane… dove le lingue, le tradizioni, le danze e il cattolicesimo sopravvivono talvolta con più ostinazione che nei loro paesi d'origine.\n\nFiglio di discendenti polacchi nati in Brasile, André cresce in un ambiente strutturato dal lavoro, dalla religione, dai silenzi e dai codici virili. Ultimo figlio di una fratria di otto (con una sola sorella), nato quasi dieci anni dopo il più giovane dei suoi maggiori, arriva in una famiglia già segnata dallo sforzo, dai vincoli e dal peso delle eredità culturali.\n\nUn imprevisto amato. Amato ma non atteso. Sarà ben solo in quella famiglia numerosa.\n\nMolto presto comprende due cose: si sente profondamente al proprio posto a scuola, e certi desideri non hanno posto nel mondo in cui cresce.\n\nL'adolescenza gay non è facile per nessuno, in nessun luogo… ma in quel contesto rurale e conservatore non se ne parla nemmeno. La parola non esiste e il desiderio si vive più come una tensione interiore che come un'identità possibile.\n\nAndré impara dunque a osservare e a tacere, a controllare i propri gesti, a biasimare il proprio corpo e le proprie emozioni.\nÈ troppo sensibile per parlare e troppo silenzioso per essere sentimentale. Troppo disciplinato per non essere ferito. Troppo desiderato per amare semplicemente. Troppo tradito per confidarlo.\n\nMa c'erano i libri, i dizionari, le carte geografiche, le lingue straniere — tutto un mondo di carta quasi infinito che già gli permetteva di lasciare Seberi mentalmente prima di poterlo fare fisicamente.\n\nDopo l'equivalente del diploma di maturità, brillante, gli studi superiori sarebbero tuttavia rimasti inaccessibili alla sua condizione. André lavora a Porto Alegre, scopre un po' di libertà e un po' di sé con essa, poi lascia progressivamente il Brasile per l'Europa e il Mondo. Forse più lontano si può trovare più di sé.\nImpara l'inglese in Irlanda, ottiene la nazionalità lituana per discendenza familiare e sviluppa una notevole padronanza delle lingue: portoghese, spagnolo, polacco, francese, tedesco e diverse altre ancora. La maggior parte del tempo da solo.\n\nIl suo rapporto con le lingue dipende tanto dalla performance accademica quanto da una forma di spostamento esistenziale: cambiare lingua diventa anche un modo di spostare l'imbarazzo, ingannare la noia, varcare le frontiere e migliorare lo sguardo che porta su se stesso.\n\nGli anni seguenti assomigliano a lungo a una traversata precaria dell'Europa contemporanea: sradicamento, pandemia, ricostruzione permanente.\n\nEppure André conserva una disciplina quasi ascetica: sport, lavoro intellettuale costante, controllo alimentare, mai alcol e praticamente nessuna droga. Il suo corpo sembra trattato come un territorio che bisogna tenere in piedi a tutti i costi.\n\nL'incontro con Sébastien Moreu trasforma questa traiettoria ma non ne cancella le ferite… o almeno tenta di addolcirle. Insieme sviluppano I Love You Moneypenis, progetto che mescola immagine, desiderio, autobiografia e performance. Il loro matrimonio, celebrato a Saint-Tropez il 19 ottobre 2024, non stabilizza il caos: gli dà semplicemente una forma vivibile e visibile, una tregua.\n\nIn parallelo, André riprende gli studi alla Sorbonne Nouvelle in scienze del linguaggio, dove i suoi risultati attirano rapidamente l'attenzione, in particolare in cinese. Effettua anche uno stage notato al Cours Florent. Il timido si rivela a se stesso, scopre la forza liberatoria dell'espressione delle emozioni che si permette poiché scritte da altri. Estate 2025, parte in immersione universitaria a Taiwan; quest'anno sarà Shanghai.\n\nAppassionato di astrologia e spiritualità antiche, impegnato in un profondo lavoro terapeutico sul proprio vissuto, André resta tuttavia difficile da riassumere. Tutto in lui sembra organizzato per trasformare le ferite in architettura interiore.\n\nMa agli occhi di Sébastien Moreu, ciò che più commuove è altrove: ciò che più commuove è guardare André osservare un fiore selvatico. Perché allora tutta la meccanica crolla — la padronanza, la difesa, il controllo — e riappare improvvisamente qualcosa di estremamente raro: una dolcezza intatta sopravvissuta a tutto il resto.\n\nPer concludere, citerebbe probabilmente Jorge Amado: « Il mondo non vale che per l'emozione che ci dona. » o, più certamente oggi, Gisèle Pelicot: « La vergogna deve cambiare di campo. »",prst:"Materiali stampa",prss:"In preparazione",prsc:"contact@moneypenis.com",plt:"Ne parlano",pls:"Prossimamente",nt:"Contatto",ns:"Inviare",n1:"Nome",n2:"Email",n3:"Messaggio",lg:"© Sébastien Moreu · © André Vaszkievicz · Parigi 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Dichiaro sotto la mia responsabilità di avere 18 anni o più e di essere maggiorenne secondo la legislazione del mio paese di residenza.",ck2:"Riconosco che questo sito presenta opere fotografiche artistiche di carattere esplicito, inclusa la vendita di stampe originali, e accetto di accedervi consapevolmente.",nat:"Nota degli autori",naf:"Gli Autori desiderano avvertire che la leggerezza divertente del titolo e del logo possono, come i visivi e i testi espliciti delle opere, dare un'impressione di disinvoltura di fronte a un soggetto pur tuttavia grave. Ricordano che non è così e che questo racconto è nato dalle loro esperienze personali. Entrambi avendo, per ragioni e in epoche diverse, vissuto tutti gli aspetti.\n\nIl loro progetto artistico comune ha l'intenzione di dissuadere chiunque dall'impegnarsi in un'attività avvertendo che ancora oggi: chiude più porte di quante ne apra ed espone a numerosi rischi coloro che la praticano e i loro cari. In particolare infezioni e malattie, soprattutto le MST, dipendenze dall'uso di droghe e alcol… Questa attività, in qualsiasi forma, espone alla precarietà, alla dipendenza, al rifiuto sociale, alla violenza, al ricatto, agli abusi, alla coercizione e agli estorsioni.\n\nPer coloro, troppo pochi, che riescono a uscirne, richiede sempre un accompagnamento psicologico a lunghissimo termine, tanto le nostre società non lasciano loro altre uscite che la vittimizzazione o la vergogna, o entrambe insieme.\n\nGli autori invitano quindi al rispetto e alla protezione dei lavoratori del sesso. Senza per questo discutere la necessità di una penalizzazione dei clienti, invitano allo stesso modo a un trattamento dignitoso della miseria affettiva, o persino dell'angoscia, che li conduce a contravvenire alla Legge. Gli autori sperano, da parte del grande pubblico come delle istituzioni, in un maggiore sostegno alle associazioni che possono accompagnare gli uni come gli altri.\n\nNon si tratta qui di sollevare ciecamente i tabù su tutte le pratiche, né di fare scandalo… Ma di ricordare l'urgenza di liberarsi dei divieti sociali che irrigidiscono un dibattito pubblico che dovrebbe invece essere sereno, e non coperto da un abito morale che non ha nulla da fare lì e impedisce ogni liberazione della parola. Non hanno alcun dubbio che, se c'è un velo da bandire, è questo.\n\nE per dibattito, intendono evocare il primo di tutti, quello che dovrebbe tenersi all'interno della famiglia.\n\nE poi è bello… anche… un cazzo !\n\n(Il modello selezionato dagli artisti non è un lavoratore del sesso. Condividendo la sua vita con uno degli autori, ha tenuto a rimanere anonimo.)\n\nSe gli Autori hanno affrontato questo tema che li riguarda, è perché è sembrato loro che nella nostra epoca di comunicazione formattata, di censura delle reti e di rinascita della pudibonderia, fosse più che mai necessario apportare un punto di vista creativo e artistico che resta stranamente assente. Hanno voluto dare a questo insieme sia la leggerezza che dovrebbe prevalere quando si evocano l'amore e il piacere, sia il peso imposto dalle realtà vissute: con coraggio e senza pathos.\n\nNon intendono sostituirsi alle scelte individuali, né alle leggi vigenti in paesi sovrani né ai valori a cui ciascuno è libero di aderire.\n\nIn Francia — non è il caso in tutti i paesi, anche democratici — le risposte fornite dalla polizia e dalla giustizia, nel quadro legale di una lotta essenziale contro la tratta di esseri umani, sono migliorate negli anni nel senso di ciò che ci si aspetta da un paese moderno. Ma lo fanno nel quadro generale e non apportano, forse non è il loro ruolo, miglioramenti alle situazioni individuali vissute sia dai lavoratori del sesso che dai loro clienti. Associazioni svolgono discretamente le loro missioni nonostante la scarsità dei loro mezzi.\n\nSia per le amministrazioni competenti che per le associazioni, esistono siti Internet. Alcuni molto utili sono selezionati e disponibili su una lista regolarmente aggiornata sul nostro stesso sito web: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Stampe singole",siCh:"Scegliere formato",siInq:"Richiedere",siNote:"Prezzi in euro, IVA francese inclusa. Imballaggio, spedizione e assicurazione al costo effettivo.",siCont:"Per acquistare, scrivici a smoreu@mac.com — o tramite il modulo di contatto",siPro:"Librai, mercanti d'arte e gallerie — scriveteci per condizioni professionali, mostre e depositi.",siRgpd:"I tuoi dati saranno utilizzati solo per la tua richiesta e per informazioni sui progetti degli artisti.",siPick:"Tocca una stampa per vederla e acquistarla",req:"Inviare una richiesta",reqAge:"Questa sezione è riservata ai maggiorenni.",shPfD:"30 × 40 cm · 50 esemplari numerati e firmati",shGfD:"50 × 70 cm · 15 esemplari numerati e firmati",shUn:"Stampe singole",shUnD:"Ogni stampa disponibile in Piccolo o Grande Formato · firmate S.M. & A.V.",fFirstName:"Nome",fPhone:"Telefono",fCountry:"Paese",fLangPref:"Lingua di risposta",fPref:"Preferenza di contatto",fMatrix:"Oggetto della richiesta",fMatrixHint:"Spunta le caselle pertinenti",fMsgPh:"Dettagli (max 500 caratteri)",fConsent:"Accetto le condizioni sopra e la trasmissione dei miei dati a Sébastien Moreu e André Vaszkievicz.",fSent:"Richiesta inviata. Riceverai una risposta all'indirizzo indicato.",fError:"Invio fallito. Puoi scrivere direttamente a smoreu@mac.com.",rqInfo:"Informazione",rqBuy:"Acquisto",rqDeposit:"Deposito",rqPro:"Professionale",rqColl:"Collezionista",rqOther:"Altro",continueShop:"Continua a sfogliare",nax:"Leggi tutto ▾",nac:"Riduci ▴",aiWarn:"ATTENZIONE: QUESTA TRADUZIONE È GENERATA DALL'IA E PUÒ CONTENERE ERRORI O CONTROSENSI",rqAcq:"Disponibilità e modalità di acquisto",rqPress:"Stampa",rqInfo2:"Informazioni generali",rqPro2:"Professionale · Rivenditori",rqOther2:"Altro",shopPortPF:"Portfolio · Piccolo Formato",shopPortGF:"Portfolio · Grande Formato",shopSingPF:"Stampe singole · Piccolo Formato",shopSingGF:"Stampe singole · Grande Formato",priceLbl:"Prezzo IVA incl.",priceUnit:"IVA incl.",pricePer:"/ stampa",availPort:"Numeri da %F% a %T% su %N% commercializzati",availSingle:"Provenienti dai portfolio %F% a %T% su %N%",noChoice:"Il numero della tiratura è assegnato automaticamente (non selezionabile dall'acquirente)",shopFormTitle:"Inoltrare una richiesta",shopFormSubtitle:"Seleziona i prodotti e la natura della tua richiesta. Il nostro team ti risponderà rapidamente.",shopFmtPF:"Piccolo Formato · 30 × 40 cm",shopFmtGF:"Grande Formato · 50 × 70 cm",ctTitle:"Scrivici",ctSubtitle:"Una domanda sul progetto, sugli artisti o altro — scrivici, ti risponderemo.",ctSubj:"Oggetto del messaggio",ctSubjProj:"Il progetto I Love You Moneypenis",ctSubjArt:"Gli artisti",ctSubjOther:"Altra domanda",ctFollow:"Seguici"},
  "中":{techs:["诗 · 金色十字","手写信 · 深蓝墨水 · 雕塑","彩色摄影 · 黄色文字","银盐照片 · 手写绿色墨水","彩色照片 · 红色文字 · 爱马仕领带","彩色摄影 · 敞开的牛仔裤 · 自然","青色调照片 · 橙色手写信","红色文字 · 黑白 · 多语言警告","手写信 · 50欧元钞票 · 手","红色文字 · 黑白 · 宣言","手写信 · 花卉背景 · 深蓝墨水"],aw:"限制级内容",am:"成人摄影艺术作品。",ap:"+ 18岁 — 完整版",am2:"− 18岁 — 公开版",nav:["I Love You Moneypenis","预告","珍贵的盒装","In Situ 你喜欢","茄子的价格","果然好笔啊…","🍆","I love you too","在此一切重新开始","笔与手"],navPresse:"肉少荣多",hl:"限量版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"巴黎，2024",hd:"同志流行色情童话。\nCollection La Grande Librairie de Saint-Tropez®",hc:"进入作品",pt:"I Love You Moneypenis",ps:"11幅银盐照片 · Traphot · 签名编号",mg:"点击放大",tech_info:"2024 · 30 × 40 厘米（50份）· 50 × 70 厘米（15份）· 银盐照片 · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm（50版）· 50 × 70 cm（15版）· 印于 Arches 纸 · 由两位艺术家亲笔编号与签名",op:"序",tx:"文字",pr:"受保护作品",ct:"套装",cs:"完整作品集 · 11幅 · 手套",zt:"In Situ",zs:"作品展示",vt:"影片",vs:"成人内容",st:"购买",pft:"小格式 30×40",pfc:"50份 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大格式 50×70",gfc:"15份 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"签名 · 编号 · 手套",pd:"Traphot",p1:"小幅作品集 · 完整",p2:"单张作品 · 小幅",p3:"大幅作品集 · 完整",p4:"单张作品 · 大幅",sh:"运输",sb:"DHL · 法国45€ · 欧洲95€ · 国际180€",py:"支付",pb:"转账 · 信用卡 · PayPal",co:"条款",cb:"证书 · 14天退货",rv:"预订",by:"购买",bt:"笔与手",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu —— 他以一种风格化的认命姿态提醒我们，所有人始终都称他为Sébastien —— 是当纪律与意志拒绝驯化执念时所发生的事。\n\n1972年12月25日生于一个完美得不可能无邪的场景 —— 圣特罗佩 —— 他在精确的阴影中成长，一位塑造嘴巴的牙医父亲，以及神话的阴影中：抵抗者、水手、失踪者、拒绝保持安葬的家族幽灵。十岁时，人们交给他一整套绘画武器。不是玩具。一件首发上膛的武器 —— 一段巴洛克式收藏的开始，一个亲密战争疯子的收藏。\n\n他永远不会归还。他宁愿增加自己的战场。\n\n他通过连续的位移前进：绘画、书籍、影像、人际关系 —— 一切都成为素材，一切都可以重新组装。他所构建的不是经典意义上的作品，而是一个张力的场域：在记忆与创造、忠诚与背叛、控制与失去之间。\n\n他不为机构工作。他渗透它们。自90年代起，在画廊主Enrico Navarra的轨道上，他构建起一份拒绝标签的职业：既非完全的雇员，也非完全的艺术家，更非简单的出版者 —— 而是一种富有生产力的异常现象，能够以令人窒息又断续的节奏，生成书籍、展览、联系、档案、想法、传播、活动。一种作为伪装的混乱，掩护着这个有条不紊地摧毁一切试图束缚他的框架的男人。\n\n他积极参与Made By…系列丛书的构思与发展，这是一个致力于跨越不同文化场景的当代创作的国际编辑项目。在此框架下，他与摄影师Simon Schwyzer紧密合作。\n\n他与Simon Schwyzer的关系是其中不稳定的心脏：一种变成了依赖的合作，一份转变为爱情系统的友谊。一对伴侣？自从这位瑞士摄影师的猝然离世，Moreu回答说：「问他吧。」事实是，自他的消失之后，没有任何事情停止 —— 相反，一切都在加剧。工作成为挽留的方式，编辑成为延续的方式，写作成为不放弃的方式。他致力于他作品的保存与推广，特别是通过Made by… Simon Schwyzer专论出版的筹备。\n\n2017年，在Enrico Navarra的支持下，他创立了Éditions Sébastien Moreu出版社，一个致力于艺术书籍、论文集和跨界编辑项目的独立机构。瑞士摄影师的记忆将摧毁这个企业。但不会摧毁那些项目。\n\n后来，与André Vaszkievicz一起，亲密性再次改变形态。I Love You Moneypenis不是一个置于他们关系之上的装饰项目：它是文本、图像、欲望、金钱、身体的碰撞。一部从纽带内部构想、没有保护性滤镜的作品。他们于2024年10月19日在圣特罗佩的婚礼并未稳定任何事：它只是使已经溢出的东西变得正式。\n\n他自己的工作 —— 拼贴、文本、编辑装置 —— 属于一种展示美学。摊开的报纸、剪下的图像、被当作原材料处理的记忆。没有任何东西是中立的。一切都被卷入其中。\n\n身体上，他带着一具并不总是合作的身体：心跳过速、反复无常的血压、压力下的系统。然而，他继续着，以有时近乎挑衅、有时近乎对后果漠不关心的习惯。这里没有真正的救赎叙事。只有坚持。\n\n他强烈地爱，痴迷地存档，强迫性地工作，并拒绝简化任何事物。\n\n如果存在一个统一原则，那就是这个：Sébastien Moreu不解决他自己的矛盾，因为他如此崇敬他人的矛盾。\n\n他自己的矛盾，他组织它们 —— 然后他生活在展览的内部。这间画廊是他的家，也是他完整献给他所爱之人的家，没有任何东西是属于他自己的。\n\n作为结语，他会引用Desproges的话：「令人吃惊，不是吗？」",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz于1990年11月28日生于一个与热带明信片几乎毫无相似之处的巴西。Seberi，该国南部一个小型乡村小镇，属于那些由二十世纪欧洲移民塑造的领土：这里是波兰人社区，但稍远处则是德国人、意大利人、立陶宛人……在那里，语言、传统、舞蹈和天主教信仰有时比在它们的原籍国保存得更为顽强。\n\n作为出生于巴西的波兰后裔之子，André在一个由工作、宗教、沉默和阳刚气质规则所构建的环境中成长。他是八个孩子家庭中最小的一个（只有一个姐姐），出生时距他最年轻的兄长几乎相差十年，他来到一个已经被努力、限制和文化遗产之重所标记的家庭。\n\n一个被爱的意外。被爱但不被期待。在这个大家庭里他将非常孤独。\n\n非常早，他理解两件事：他在学校里深感自在，而某些欲望在他成长的世界中没有位置。\n\n同性恋的青春期对任何人来说，在任何地方都不容易……但在这个乡村且保守的背景下，根本不会谈论它。这个词不存在，欲望更多被作为一种内心的紧张感来体验，而非作为一种可能的身份。\n\n因此，André学会了观察和沉默，控制自己的姿态，谴责自己的身体和情感。\n他过于敏感而无法发声，又过于沉默而难以感伤。过于自律而不会受伤。过于被渴望而无法简单地去爱。过于被背叛而无法吐露此事。\n\n但是有书籍、词典、地理地图、外语 —— 一整个几乎无穷的纸质世界，已经允许他在能够身体上离开Seberi之前，便已在精神上离开。\n\n出色地通过了相当于法国高中毕业会考的考试之后，高等教育对他的处境而言仍将无法企及。André在阿雷格里港工作，发现了一些自由以及与之相伴的部分自己，然后逐渐离开巴西，前往欧洲和世界。也许走得更远，能找到更多的自我。\n他在爱尔兰学习英语，凭家族血统获得立陶宛国籍，并发展出对多门语言的卓越掌握：葡萄牙语、西班牙语、波兰语、法语、德语和其他几种语言。大部分时间是独自一人。\n\n他与语言的关系既属于学术成就，也属于一种存在性的位移：换语言也成为转移不适、欺骗厌倦、跨越国境并改善他对自己的注视的一种方式。\n\n接下来的数年长久地像是当代欧洲的一次不稳定穿越：被连根拔起、疫情、持续的重建。\n\n然而André保持着一种近乎苦行的纪律：运动、不断的智力工作、饮食控制、从不饮酒、几乎不碰毒品。他的身体似乎被作为一片必须不惜代价保持站立的领土来对待。\n\n与Sébastien Moreu的相遇改变了这条轨迹，但并未抹去其伤口……至少试图缓和它们。他们共同发展了I Love You Moneypenis，一个混合了影像、欲望、自传和表演的项目。2024年10月19日在圣特罗佩举行的婚礼并未稳定这场混乱：它只是赋予它一种可以承受的可见形式，一段喘息。\n\n与此同时，André在新索邦大学重新开始语言学的学业，他的成绩很快引起关注，尤其是中文。他还在弗洛朗戏剧学校完成了一段引人注目的实习。这位羞涩之人向自己揭示，发现了表达情感的解放力量，因为这些情感由他人书写，他便允许自己表达。2025年夏，他将前往台湾进行大学沉浸式学习；今年将是上海。\n\n热衷于占星学和古代灵性，并致力于围绕自己经历的深度治疗工作，André仍然难以被概括。他身上的一切似乎都被组织起来，将创伤转化为内在建筑。\n\n但在Sébastien Moreu眼中，最动人之处在别的地方 —— 最动人的是看着André观察一朵野花。因为在那时，所有的机制都崩塌了 —— 掌控、防御、控制 —— 突然间，某种极为罕见的东西重新出现：一种从一切之中幸存下来的完好无损的温柔。\n\n作为结语，他大概会引用Jorge Amado的话：「世界的价值仅在于它给予我们的情感。」或者今天更确切地引用Gisèle Pelicot：「羞耻应该换阵营了。」",prst:"媒体资料",prss:"筹备中",prsc:"contact@moneypenis.com",plt:"媒体报道",pls:"敬请期待",nt:"联系",ns:"发送",n1:"姓名",n2:"邮箱",n3:"留言",lg:"© Sébastien Moreu · © André Vaszkievicz · 巴黎 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"本人郑重声明已满18周岁，并符合本人居住国法律规定的成年年龄。",ck2:"本人知悉本网站展示含露骨内容的艺术摄影作品，包括出售原版印刷品，并自愿访问。",nat:"作者寄语",naf:"作者们希望提醒：标题和标识所带的轻盈娱乐感，以及作品中露骨的视觉与文字，可能给人一种对严肃议题不以为然的印象。他们要强调事实并非如此——这部寓言诞生于他们各自的亲身经历。二人因不同的原因、在不同的时期，亲历过其中的所有面向。\n\n他们共同的艺术项目旨在劝阻任何人投身这项至今仍：关闭比开启更多大门、并将从业者及其亲人暴露于诸多风险之中的活动。尤其是感染与疾病（特别是性传播疾病）、对毒品和酒精的成瘾……无论以何种形式，这项活动都会使人陷入贫困、依附、社会排斥、暴力、勒索、虐待、胁迫与敲诈。\n\n对于极少数得以脱身者，由于社会只为他们留下\"受害者\"或\"羞耻者\"——甚至兼而有之——的出路，他们始终需要极为长期的心理陪伴。\n\n因此，作者呼吁尊重并保护性工作者。在不否认对客户进行刑事处罚之必要性的同时，他们同样呼吁以尊严对待将这些客户引向违法的情感困境乃至精神窘迫。作者期望，无论是公众还是机构，都能给予那些能陪伴双方的协会更多支持。\n\n这里绝非要盲目地打破所有禁忌，也绝非要制造丑闻……而是要提醒：迫切需要摆脱那些使公共讨论僵化的社会禁令——这场讨论本应平静，而非被披上一件本不该在场、阻止一切言说的道德外衣。他们毫不怀疑，如果有一层面纱需要被撕去，正是这一层。\n\n而所谓讨论，他们首先指的是那场最重要的：本应在家庭内部展开的对话。\n\n再说……鸡巴……也很美的！\n\n（艺术家所选的模特并非性工作者。因其与作者之一共同生活，他坚持匿名。）\n\n如果作者触及了这一令他们深切关切的议题，那是因为他们感到：在我们这个被格式化的传播、网络审查与拘谨复兴的时代，比任何时候都更需要一种创造性与艺术性的视角——而这一视角却奇异地缺席。他们希望同时赋予这一整体应有的轻盈——当我们谈论爱与愉悦时——以及现实所施加的重量：以勇气，不带悲情。\n\n他们无意取代个人的选择，也不取代主权国家现行的法律，更不取代每个人自由认同的价值观。\n\n在法国——这并非所有国家、甚至所有民主国家的情况——警察与司法机构在反对人口贩运这一根本斗争的法律框架下所给出的回应，多年来已逐步改善到符合现代国家所应有的水准。但这是在一般层面进行的，对性工作者及其客户所经历的个体处境并无实际改善——这或许本就不是它们的职责。一些协会在资源匮乏的情况下仍默默地履行着自己的使命。\n\n无论是相关行政机构还是协会，都存在相应的网站。其中部分非常有用的网站已被筛选，可在我们网站上定期更新的列表中查阅：www.moneypenis.com · www.moneypenis.com/prevention",siPl:"单幅作品",siCh:"选择尺寸",siInq:"咨询",siNote:"价格以欧元计，含法国增值税。包装、运输和保险按实际成本计费。",siCont:"如需购买，请写信至 smoreu@mac.com — 或通过联系表单",siPro:"书店、艺术经销商和画廊 — 请就专业条件、展览和寄售联系我们。",siRgpd:"您的信息仅用于回复您的咨询，以及通知您艺术家项目的相关动态。",siPick:"点击作品以查看并购买",req:"提交申请",reqAge:"此栏目仅供成年人浏览。",shPfD:"30 × 40 厘米 · 50 张编号并签名版",shGfD:"50 × 70 厘米 · 15 张编号并签名版",shUn:"单张作品",shUnD:"每件作品可选小幅或大幅 · S.M. & A.V. 签名",fFirstName:"名",fPhone:"电话",fCountry:"国家",fLangPref:"回复语言",fPref:"联系方式偏好",fMatrix:"咨询主题",fMatrixHint:"请勾选相关选项",fMsgPh:"详情（最多 500 字符）",fConsent:"我接受上述条件，并同意将我的信息转交给 Sébastien Moreu 及 André Vaszkievicz。",fSent:"咨询已发送。我们将向您提供的地址回复。",fError:"发送失败。您可直接写信至 smoreu@mac.com。",rqInfo:"信息咨询",rqBuy:"购买",rqDeposit:"寄售",rqPro:"专业",rqColl:"收藏家",rqOther:"其他",continueShop:"继续浏览",nax:"阅读全文 ▾",nac:"收起 ▴",aiWarn:"注意：本翻译由人工智能生成，可能含有错误或误解",rqAcq:"供货与购买条件",rqPress:"媒体",rqInfo2:"一般信息",rqPro2:"专业 · 经销商",rqOther2:"其他",shopPortPF:"作品集 · 小尺寸",shopPortGF:"作品集 · 大尺寸",shopSingPF:"单张版画 · 小尺寸",shopSingGF:"单张版画 · 大尺寸",priceLbl:"含税价",priceUnit:"含税",pricePer:"/ 张",availPort:"共 %N% 件中第 %F% 至第 %T% 号可售",availSingle:"来自共 %N% 件中第 %F% 至第 %T% 号作品集",noChoice:"版次编号自动分配（买家无法选择）",shopFormTitle:"提交咨询",shopFormSubtitle:"请选择产品和咨询性质。我们将尽快回复您。",shopFmtPF:"小尺寸 · 30 × 40 厘米",shopFmtGF:"大尺寸 · 50 × 70 厘米",ctTitle:"联系我们",ctSubtitle:"关于项目、艺术家或其他任何问题 — 请联系我们，我们会回复您。",ctSubj:"您的留言主题",ctSubjProj:"I Love You Moneypenis 项目",ctSubjArt:"艺术家",ctSubjOther:"其他问题",ctFollow:"关注我们"},
  "日":{techs:["詩 · 金の十字架","手書きの手紙 · 紺青のインク · 彫刻","カラー写真 · 黄色の文字","銀塩プリント · 手書きの緑のインク","カラー写真 · 赤い文字 · エルメスのネクタイ","カラー写真 · 開いたジーンズ · 自然","シアン調の写真 · オレンジの手書きの手紙","赤い文字 · モノクロ · 多言語の警告","手書きの手紙 · 50ユーロ札 · 手","赤い文字 · モノクロ · マニフェスト","手書きの手紙 · 花柄の背景 · 紺青のインク"],aw:"成人向",am:"成人向け作品。",ap:"+ 18歳 — 完全版",am2:"− 18歳 — 公開版",nav:["I Love You Moneypenis","ティーザー","貴重な箱たち","In Situ お気に入り","茄子の値段","誠に見事な筆…","🍆","I love you too","ここから、すべてが始まる","ペンと手"],navPresse:"栄誉多くて肉少なし",hl:"限定版",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"パリ、2024",hd:"大人のためのゲイ童話。\nCollection La Grande Librairie de Saint-Tropez®",hc:"作品の中へ",pt:"I Love You Moneypenis",ps:"11点の銀塩プリント · Traphot · 署名番号",mg:"クリックで拡大",tech_info:"2024 · 30 × 40 cm（50点）· 50 × 70 cm（15点）· 銀塩プリント · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm（50部）· 50 × 70 cm（15部）· Arches 紙印刷 · 両アーティストによる手書きの番号と署名",op:"序",tx:"テキスト",pr:"保護作品",ct:"ボックスセット",cs:"完全ポートフォリオ · 11点 · 手袋",zt:"In Situ",zs:"作品の展示",vt:"映像",vs:"成人向け",st:"購入",pft:"小サイズ 30×40",pfc:"50部 01/50→50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"大サイズ 50×70",gfc:"15部 01/15→15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"署名 · 番号 · 手袋",pd:"Traphot",p1:"小サイズ ポートフォリオ・全揃い",p2:"単品 · 小サイズ",p3:"大サイズ ポートフォリオ・全揃い",p4:"単品 · 大サイズ",sh:"輸送",sb:"DHL · フランス45€ · 欧州95€ · 国際180€",py:"支払い",pb:"振込 · カード · PayPal",co:"条件",cb:"証明書 · 14日返品",rv:"予約",by:"購入",bt:"筆と手について",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — 一種の文体的諦観のように、誰もが常に彼をSébastienと呼んできたことを私たちに思い出させる彼 — は、規律と意志が執着を飼いならすことを拒んだときに起こることである。\n\n1972年12月25日、無垢であるには完璧すぎる舞台 — サン=トロペ — に生まれた彼は、精度（口を形作る歯科医の父）と神話（レジスタンス、船乗り、行方不明者、埋葬されたままでいることを拒む家族の亡霊たち）の影の中で育つ。十歳で、彼は完全な絵画の武器庫を手渡される。おもちゃではない。最初の装填済みの武器 — バロック的コレクションの始まり、親密な戦争に狂った者のコレクション。\n\n彼は決してそれらを返さないだろう。自らの戦場を増やすことを好んで。\n\n彼は連続的な移動によって前進する：絵画、書物、イメージ、人間関係 — すべてが素材となり、すべてが再構成されうる。彼が構築するものは古典的な意味での作品ではなく、緊張の場である：記憶と発明、忠誠と裏切り、制御と喪失の間で。\n\n彼は機関のために働かない。彼はそれらに浸透する。90年代以降、ギャラリストEnrico Navarraの軌道において、彼はラベルを拒否するキャリアを築く：完全に従業員でもなく、完全に芸術家でもなく、単なる編集者でもない — むしろ生産的な異常、書物、展覧会、つながり、アーカイブ、アイデア、コミュニケーション、イベントを、息をのむような、しかし断続的なリズムで生み出すことのできる異常。彼を封じ込めようとするすべての枠組みを系統的に破壊するこの男の偽装として機能する無秩序。\n\n彼はMade By…コレクションの構想と発展に積極的に参加する。これは異なる文化的シーンを通じての現代の創造に捧げられた国際的な編集プロジェクトである。この枠組みの中で、彼は写真家Simon Schwyzerと緊密に協力する。\n\nSimon Schwyzerとの関係はその不安定な核心である：依存となった協力、愛情のシステムに変容した友情。カップル？スイス人写真家の突然の死以降、Moreuはこう答える：「彼に訊いてください。」いずれにせよ、彼の消失後、何も止まらない — 反対に、すべてが激化する。働くことは引き留める方法となり、編集することは延長する方法となり、書くことは屈服しない方法となる。彼は彼の作品の保存と振興に取り組む。特にMade by… Simon Schwyzer モノグラフの出版準備を通じて。\n\n2017年、Enrico Navarraの支援を受けて、彼は美術書、エッセイ、横断的編集プロジェクトに捧げられた独立した機構、Éditions Sébastien Moreuを設立していた。スイス人写真家の記憶が事業を破壊するだろう。プロジェクトはそうではない。\n\nのちに、André Vaszkieviczとともに、親密なるものは再び形を変える。I Love You Moneypenisは彼らの関係の上に置かれた装飾的プロジェクトではない：それはテクスト、イメージ、欲望、金銭、身体の衝突である。絆の内側から構想された、保護のフィルターのない作品。2024年10月19日のサン=トロペでの彼らの結婚は何も安定化させない：それはすでにあふれ出していたものを公式化するにすぎない。\n\n彼自身の仕事 — コラージュ、テクスト、編集装置 — は露出の美学に属する。広げられた新聞、切り抜かれたイメージ、原材料として扱われる記憶。何ものも中立ではない。すべてが関与している。\n\n身体的に、彼は常に協力するわけではない身体を背負っている：速い心拍、気まぐれな血圧、圧力下のシステム。それでも彼は続ける、時に挑戦に、時に結果への無関心に似た習慣とともに。ここに固有の贖罪の物語はない。ただ持続のみ。\n\n彼は激しく愛し、強迫的にアーカイブし、衝動的に働き、そして何ものも単純化することを拒む。\n\n統合的原理が存在するなら、それはこれである：Sébastien Moreuは自らの矛盾を解決しない、それほどまでに彼は他者の矛盾を崇敬している。\n\n自らのものは、彼はそれらを組織する — そして展覧会の内部に住む。このギャラリーは彼の家であり、彼が愛する者たちに丸ごと差し出す家である、何ものも決して彼自身のためのものではない。\n\n結論として、彼はDesprogesを引用するだろう：「驚くべきことではないか？」",vn:"André Vaszkievicz",vb:"André Francisco Vaszkieviczは1990年11月28日、熱帯の絵葉書とはほとんど似ていないブラジルに生まれた。同国南部の小さな田舎町Seberiは、20世紀のヨーロッパ移民によって形作られた領土の一つに属する：ここではポーランド人のコミュニティ、しかし少し先にはドイツ人、イタリア人、リトアニア人のコミュニティ……そこでは言語、伝統、舞踊、カトリックが、時にその出身国よりも頑強に生き延びている。\n\nブラジルで生まれたポーランド系の子孫の息子であるAndréは、労働、宗教、沈黙、男性的規範によって構造化された環境で育つ。八人兄弟（妹は一人だけ）の末っ子であり、年上の兄たちの最年少からおよそ十年後に生まれた彼は、すでに労苦、制約、文化的継承の重みによって刻印された家族の中に到着する。\n\n愛された予期せぬもの。愛されたが、期待されていなかった。彼はこの大家族の中で非常に孤独だろう。\n\n非常に早く、彼は二つのことを理解する：学校では深く自分の居場所を感じるが、ある種の欲望は彼が育つ世界には居場所がない。\n\nゲイの青春期は誰にとっても、どこにおいても容易ではない……しかしこの田舎の保守的な文脈ではそれは話題にすらならない。言葉は存在せず、欲望は可能なアイデンティティとしてよりも、内的な緊張として体験される。\n\nだからAndréは観察することと黙ることを、自分の身振りを制御することを、自分の身体と感情を責めることを学ぶ。\n彼は語るには感じやすすぎ、感傷的であるには無口すぎる。傷つかないには規律正しすぎる。単純に愛するには欲望されすぎている。それを打ち明けるには裏切られすぎている。\n\nしかし、本があった、辞書があった、地理の地図があった、外国語があった —— 彼に身体的にSeberiを離れることができる前から、精神的にそこを離れることをすでに許していた、ほぼ無限の紙の世界全体。\n\nバカロレアに相当する優秀な合格の後、高等教育は彼の境遇にとっては依然として手の届かないものであり続けるだろう。Andréはポルト・アレグレで働き、いくらかの自由と、それとともにいくらかの自分自身を発見し、その後徐々にブラジルを離れヨーロッパと世界へ向かう。おそらくより遠くで、より多くの自分を見出すことができる。\n彼はアイルランドで英語を学び、家族の系譜によりリトアニア国籍を取得し、複数の言語に対する卓越した習熟を発展させる：ポルトガル語、スペイン語、ポーランド語、フランス語、ドイツ語、そしてさらにいくつか他にも。ほとんどの時間を独りで。\n\n言語との彼の関係は、学業的なパフォーマンスと同じく、ある実存的な位置の移動の一形態に属する：言語を変えることは、また、居心地の悪さを移動させ、退屈を欺き、国境を越え、彼が自分自身に向ける眼差しを改善する方法となる。\n\n続く数年間は長らく、現代ヨーロッパの不安定な横断を思わせる：根からの引き剥がし、パンデミック、恒久的な再建。\n\nそれでもAndréはほとんど禁欲的な規律を保つ：スポーツ、絶え間ない知的労働、食事のコントロール、決してアルコールを摂らず、ほとんどドラッグもない。彼の身体は、何としても立ち続けさせなければならない領土のように扱われているように見える。\n\nSébastien Moreuとの出会いはこの軌跡を変容させるが、その傷を消すことはない……少なくともそれらを和らげようとする。共に彼らは、イメージ、欲望、自伝、パフォーマンスを混ぜ合わせるプロジェクトI Love You Moneypenisを発展させる。2024年10月19日にサン=トロペで祝われた彼らの結婚は混沌を安定させはしない：それは単にそれに生きられうる目に見える形を、ひとつの猶予を与えるだけだ。\n\n並行して、Andréはソルボンヌ・ヌーヴェルで言語学の学業を再開し、彼の成績は、特に中国語において、すぐに注目を集める。彼はまたコース・フローランで注目される研修も行う。この内気な人物は自分自身に対し自らを明らかにし、他者によって書かれているがゆえに自らに許す感情の表現の解放力を発見する。2025年の夏、彼は台湾での大学留学に旅立つ；今年は上海となるだろう。\n\n占星術と古代の霊性に情熱を傾け、自らの経験をめぐる深い治療的作業に従事しながらも、Andréは依然として要約するのが困難なままである。彼の中のすべては、傷を内的建築に変えるために組織されているように見える。\n\nしかしSébastien Moreuの眼には、最も心を打つものは別の場所にある —— 最も心を打つのは、Andréが一輪の野の花を観察するのを眺めることである。なぜならその時、すべての機構が崩れ落ちるからだ —— 熟練、防御、制御 —— そして突然、極めて稀なものが再び現れる：すべての他のものから生き延びた無傷の優しさ。\n\n結論として、彼はおそらくJorge Amadoを引用するだろう：「世界はそれが我々に与える感動の分だけしか価値がない。」あるいは今日においてはより確実にGisèle Pelicotを引用するだろう：「恥は陣営を変えるべきだ。」",prst:"プレス資料",prss:"準備中",prsc:"contact@moneypenis.com",plt:"メディアにて",pls:"近日公開",nt:"お問合せ",ns:"送信",n1:"名前",n2:"メール",n3:"メッセージ",lg:"© Sébastien Moreu · © André Vaszkievicz · パリ 2024",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"私は18歳以上であり、居住国の法律に基づく成年年齢に達していることを宣言します。",ck2:"本サイトが露骨な内容を含む芸術的写真作品を掲載し、オリジナルプリントの販売を行うことを認識した上で、自らの意志でアクセスすることに同意します。",nat:"作者のことば",naf:"作者たちは次のことを伝えておきたい。タイトルとロゴが帯びる娯楽的な軽さ、そして作品の露骨な視覚と言葉は、本来重い主題に対して軽薄な印象を与えかねない。だが実際はまったく違うのであり、この物語は二人の個人的な経験から生まれたものである。二人とも、理由も時期も異なるが、その全側面を生き抜いてきた。\n\n彼らの共同芸術プロジェクトの意図は、今なおこの活動が：開く扉より閉ざす扉のほうが多く、従事する者とその身近な人々を数多のリスクにさらすという事実を伝え、誰一人として安易にそこに足を踏み入れないよう促すことにある。とりわけ感染症や病気（特に性感染症）、薬物・アルコール依存……。この活動はいかなる形であれ、困窮、依存、社会的排除、暴力、脅迫、虐待、強制、ゆすりへとさらす。\n\nそこから抜け出せた、あまりに数少ない者にとっても、極めて長期的な心理的支援が必要となる。なぜなら、我々の社会は彼らに「犠牲者」か「恥」、あるいはその両方以外の出口をほぼ残さないからである。\n\nゆえに作者たちは、セックスワーカーへの尊重と保護を呼びかける。客の処罰の必要性を否定するわけではないが、同様に、客たちを違法行為へと駆り立てる情緒的悲惨、ときに苦悩に対する尊厳ある扱いをも呼びかける。作者たちは、一般市民にも諸機関にも、双方に伴走できる団体への、より大きな支援を望んでいる。\n\nここではすべての行為に関するタブーを盲目的に解こうとしているのでも、スキャンダルを起こそうとしているのでもない……。むしろ、公共の議論を硬直化させる社会的禁忌から脱する緊急性を訴えているのである — 本来その議論は穏やかであるべきで、場違いな道徳の衣をまとうべきではなく、その衣はあらゆる発話の解放を妨げているからだ。彼らは確信している：もし剥がすべきヴェールがあるとすれば、それはこのヴェールだ、と。\n\nそして議論とは、彼らの言葉で言えば、何よりもまず家庭の中で行われるべき、最も根源的な議論を指している。\n\nそれに……チンコは……美しい！ それもまた、ひとつの事実だ。\n\n（アーティストたちが選んだモデルはセックスワーカーではない。作者の一人と人生を共にしているため、匿名であることを望んだ。）\n\n作者たちがこの自身に深く関わる主題を扱ったのは、今や規格化された伝達、ネットワーク上の検閲、そして禁欲主義の復活する時代において、奇妙なほどに不在のままである創造的・芸術的視点を提示することが、これまでになく必要だと感じたからである。彼らはこの全体に、愛と快楽を語る際に本来優先されるべき軽やかさと、現実が押しつける重さの両方を、勇気をもって、しかし悲愴さなしに与えようとした。\n\n彼らは個人の選択に取って代わるつもりはなく、また主権国家で施行される法律や、各人が自由に同意できる価値観に取って代わるつもりもない。\n\nフランスでは — 民主国家であってもすべての国がそうとは限らないが — 人身売買との本質的な闘いという法的枠組みの中で、警察と司法が提供する対応は、近代国家に期待されるものへと年々改善してきた。しかしそれは一般的な枠組みの中でのことであり、セックスワーカーやその客が経験する個別の状況に改善をもたらすことはない — それは恐らく彼らの役割ではないのだろう。いくつかの団体は、資金不足にもかかわらず、ひそかにその使命を果たしている。\n\n関係行政にも団体にも、ウェブサイトが存在する。とくに有用ないくつかは選別され、私たちのウェブサイト上で定期的に更新されるリストにて閲覧できる：www.moneypenis.com · www.moneypenis.com/prevention",siPl:"単品プリント",siCh:"サイズを選択",siInq:"お問い合わせ",siNote:"価格はユーロ、フランス付加価値税込み。梱包、配送、保険は実費請求。",siCont:"ご購入は smoreu@mac.com までメール、または問い合わせフォームをご利用ください",siPro:"書店、美術商、ギャラリーの皆さま — 業者条件、展示、委託についてお問い合わせください。",siRgpd:"ご記入の情報は、お問い合わせへの回答と作家のプロジェクトのお知らせにのみ使用いたします。",siPick:"作品をタップしてご覧いただき、購入できます",req:"お問合せを送る",reqAge:"このセクションは成人の方のみ閲覧可能です。",shPfD:"30 × 40 cm · エディション50部 ナンバリング・サイン入り",shGfD:"50 × 70 cm · エディション15部 ナンバリング・サイン入り",shUn:"単品プリント",shUnD:"各作品は小サイズまたは大サイズ · S.M. & A.V. 署名",fFirstName:"名",fPhone:"電話番号",fCountry:"国名",fLangPref:"ご希望の返信言語",fPref:"ご希望の連絡方法",fMatrix:"お問い合わせ内容",fMatrixHint:"該当する項目にチェックしてください",fMsgPh:"詳細(500文字以内)",fConsent:"上記条件と、私の情報を Sébastien Moreu および André Vaszkievicz に送信することに同意します。",fSent:"送信されました。指定アドレス宛に返信いたします。",fError:"送信に失敗しました。smoreu@mac.com まで直接ご連絡ください。",rqInfo:"情報",rqBuy:"購入",rqDeposit:"委託",rqPro:"業者",rqColl:"コレクター",rqOther:"その他",continueShop:"続けて閲覧する",nax:"全文を読む ▾",nac:"閉じる ▴",aiWarn:"注意：この翻訳はAIにより生成されており、誤りや誤解を含む可能性があります",rqAcq:"在庫状況・購入条件",rqPress:"報道",rqInfo2:"一般情報",rqPro2:"業務 · ディーラー",rqOther2:"その他",shopPortPF:"ポートフォリオ · 小サイズ",shopPortGF:"ポートフォリオ · 大サイズ",shopSingPF:"単品プリント · 小サイズ",shopSingGF:"単品プリント · 大サイズ",priceLbl:"税込価格",priceUnit:"税込",pricePer:"/ 1点",availPort:"全 %N% 点中、%F%〜%T% 番販売中",availSingle:"全 %N% 点中、ポートフォリオ %F%〜%T% より",noChoice:"エディション番号は自動割り当て（購入者は選択不可）",shopFormTitle:"お問い合わせ",shopFormSubtitle:"商品とお問い合わせ内容をご選択ください。速やかにご返信いたします。",shopFmtPF:"小サイズ · 30 × 40 cm",shopFmtGF:"大サイズ · 50 × 70 cm",ctTitle:"お問い合わせ",ctSubtitle:"プロジェクト、アーティスト、その他ご質問はメッセージをお送りください。ご返信いたします。",ctSubj:"メッセージの件名",ctSubjProj:"プロジェクト I Love You Moneypenis",ctSubjArt:"アーティスト",ctSubjOther:"その他のご質問",ctFollow:"フォローする"},EL:{techs:["Ποίημα · Χρυσός σταυρός","Χειρόγραφο γράμμα · Μπλε ναυτικού μελάνι · Γλυπτό","Έγχρωμη φωτογραφία · Κίτρινο κείμενο","Εκτύπωση ασημόζελα · Πράσινο χειρόγραφο μελάνι","Έγχρωμη φωτογραφία · Κόκκινο κείμενο · Γραβάτα Hermès","Έγχρωμη φωτογραφία · Ανοιχτό τζιν · Φύση","Φωτογραφία με κυανό τόνο · Πορτοκαλί χειρόγραφο γράμμα","Κόκκινο κείμενο · Α/Μ · Πολυγλωσσική προειδοποίηση","Χειρόγραφο γράμμα · Χαρτονομίσματα 50€ · Χέρια","Κόκκινο κείμενο · Α/Μ · Μανιφέστο","Χειρόγραφο γράμμα · Λουλουδάτο φόντο · Μπλε ναυτικού μελάνι"],aw:"Σαφές περιεχόμενο · Μόνο για ενημερωμένους ενήλικες",am:"Αυτός ο ιστότοπος παρουσιάζει φωτογραφικά έργα τέχνης που προορίζονται αποκλειστικά για ενημερωμένους ενήλικες.",ap:"+ 18 ετών — Πλήρης έκδοση",am2:"− 18 ετών — Δημόσια έκδοση",nav:["I Love You Moneypenis","Το Teaser","Τα πολύτιμα κουτιά","In Situ σου αρέσει","Η τιμή των μελιτζανών","Όμορφες πένες, αληθινά…","🍆","I love you too","Εδώ όλα ξαναρχίζουν","Μαρκαδόροι και χέρια"],navPresse:"Πολλές τιμές για λίγη σάρκα",hl:"Περιορισμένη Έκδοση · Πρωτότυπες εκτυπώσεις ασημόζελα",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Παρίσι, 2024",hd:"Ένα γκέι ποπ πορνό παραμύθι, για ενημερωμένους ενήλικες.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Είσοδος στο έργο",pt:"I Love You Moneypenis",ps:"11 πρωτότυπες εκτυπώσεις ασημόζελα · Traphot, Montrouge\nΥπογεγραμμένες και αριθμημένες από τους Sébastien Moreu & André Vaszkievicz",mg:"Κάντε κλικ για μεγέθυνση",tech_info:"2024 · 30 × 40 cm (50 αντ.) · 50 × 70 cm (15 αντ.) · Εκτύπωση ασημόζελα · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 αντ.) · 50 × 70 cm (15 αντ.) · Εκτύπωση σε χαρτί Arches · Αριθμημένη και υπογεγραμμένη με το χέρι και από τους δύο καλλιτέχνες",op:"Άνοιγμα",tx:"Κείμενο",pr:"Προστατευμένο έργο · Ψηφιακό υδατόσημο",ct:"Το Κουτί",cs:"Πλήρες πορτφόλιο · 11 εκτυπώσεις ασημόζελα · Υπογεγραμμένες & αριθμημένες · Γάντια συμπεριλαμβανόμενα",zt:"In Situ",zs:"Τα έργα στο περιβάλλον τους",vt:"Φιλμ",vs:"Περιεχόμενο μόνο για ενημερωμένους ενήλικες",st:"Απόκτηση",pft:"Μικρό μέγεθος  30 × 40 cm",pfc:"50 πορτφόλιο αριθμημένα 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Μεγάλο μέγεθος  50 × 70 cm",gfc:"15 πορτφόλιο αριθμημένα 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Υπογεγραμμένα S.M. & A.V. · Αριθμός σε κάθε εκτύπωση · Γάντια συμπεριλαμβανόμενα",pd:"Traphot, Montrouge",p1:"Πορτφόλιο Μικρή Έκδοση · πλήρες",p2:"Μεμονωμένο φύλλο · Μικρή Έκδοση",p3:"Πορτφόλιο Μεγάλη Έκδοση · πλήρες",p4:"Μεμονωμένο φύλλο · Μεγάλη Έκδοση",sh:"Μεταφορά & Ασφάλιση",sb:"Μουσειακή συσκευασία · DHL Express\nΓαλλία 45 € · Ευρώπη 95 € · Διεθνώς 180 €\nΑσφάλιση συμπεριλαμβανόμενη",py:"Πληρωμή",pb:"Έμβασμα · Κάρτα · PayPal · 3× άτοκα",co:"Όροι",cb:"Πιστοποιητικό αυθεντικότητας · 14ήμερη επιστροφή · ΦΠΑ ανά χώρα",rv:"Κράτηση",by:"Απόκτηση",bt:"Με πένες και χέρια",sn:"Sébastien Moreu",sb2:"Ο Jean Sébastien Moreu — που μας θυμίζει, ως ένα είδος υφολογικής παραίτησης, ότι όλοι ανέκαθεν τον αποκαλούσαν Sébastien — είναι αυτό που συμβαίνει όταν η πειθαρχία και η θέληση αρνούνται να εξημερώσουν την εμμονή.\n\nΓεννημένος στις 25 Δεκεμβρίου 1972 σε ένα σκηνικό υπερβολικά τέλειο για να είναι αθώο — Saint-Tropez — μεγαλώνει στη σκιά της ακρίβειας (πατέρας οδοντίατρος που διαμορφώνει στόματα) και του μύθου: αντιστασιακοί, ναυτικοί, εξαφανισμένοι, οικογενειακά φαντάσματα που αρνούνται να μείνουν θαμμένα. Στα δέκα του χρόνια του παραδίδουν ένα πλήρες οπλοστάσιο ζωγραφικής. Όχι παιχνίδι. Ένα πρώτο γεμάτο όπλο — η αρχή μιας μπαρόκ συλλογής, εκείνης ενός τρελού των ενδότερων πολέμων.\n\nΔεν θα τα επιστρέψει ποτέ. Προτιμώντας να πολλαπλασιάσει τα πεδία μαχών του.\n\nΠροχωρά μέσα από διαδοχικές μετατοπίσεις: ζωγραφική, βιβλία, εικόνες, ανθρώπινες σχέσεις — όλα γίνονται υλικό, όλα μπορούν να ξανασυναρμολογηθούν. Αυτό που χτίζει δεν είναι έργο με την κλασική έννοια, αλλά πεδίο εντάσεων: μεταξύ μνήμης και επινόησης, πίστης και προδοσίας, ελέγχου και απώλειας.\n\nΔεν εργάζεται για τους θεσμούς. Τους διεισδύει. Από τη δεκαετία του '90, στην τροχιά του γκαλερίστα Enrico Navarra, χτίζει μια καριέρα που απορρίπτει τις ετικέτες: ούτε εντελώς υπάλληλος, ούτε εντελώς καλλιτέχνης, ούτε απλός εκδότης — μάλλον μια παραγωγική ανωμαλία, ικανή να δημιουργεί βιβλία, εκθέσεις, συνδέσεις, αρχεία, ιδέες, επικοινωνία, εκδηλώσεις, σε ρυθμό εξίσου εκπληκτικό όσο και ασυνεχή. Μια αταξία που χρησιμεύει ως καμουφλάζ σε αυτόν τον άνθρωπο που καταστρέφει μεθοδικά όλα τα πλαίσια που υποτίθεται ότι τον περιορίζουν.\n\nΣυμμετέχει ενεργά στη σύλληψη και την ανάπτυξη της συλλογής Made By…, διεθνές εκδοτικό σχέδιο αφιερωμένο στη σύγχρονη δημιουργία μέσα από διαφορετικές πολιτιστικές σκηνές. Σε αυτό το πλαίσιο, συνεργάζεται στενά με τον φωτογράφο Simon Schwyzer.\n\nΗ σχέση του με τον Simon Schwyzer είναι η ασταθής καρδιά του: μια συνεργασία που έγινε εξάρτηση, μια φιλία που μεταμορφώθηκε σε ερωτικό σύστημα. Ζευγάρι; Από τον βίαιο θάνατο του Ελβετού φωτογράφου, ο Moreu απαντά: « Ρωτήστε τον. » Πάντως, μετά την εξαφάνισή του, τίποτα δεν σταματά — αντιθέτως, όλα εντείνονται. Το να εργάζεται γίνεται τρόπος να κρατάει, το να εκδίδει τρόπος να παρατείνει, το να γράφει τρόπος να μην υποχωρεί. Δεσμεύεται στη διατήρηση και την προώθηση του έργου του, ιδίως μέσα από την προετοιμασία της έκδοσης της μονογραφίας Made by… Simon Schwyzer.\n\nΤο 2017, με την υποστήριξη του Enrico Navarra, είχε ιδρύσει τις Éditions Sébastien Moreu, ανεξάρτητη δομή αφιερωμένη σε καλλιτεχνικά βιβλία, δοκίμια και διατομεακά εκδοτικά σχέδια. Η μνήμη του Ελβετού φωτογράφου θα καταστρέψει την επιχείρηση. Όχι τα σχέδια.\n\nΑργότερα, με τον André Vaszkievicz, το οικείο αλλάζει και πάλι μορφή. Το I Love You Moneypenis δεν είναι ένα διακοσμητικό σχέδιο τοποθετημένο πάνω στη σχέση τους: είναι μια σύγκρουση κειμένου, εικόνας, επιθυμίας, χρημάτων, σώματος. Έργο σχεδιασμένο από μέσα του δεσμού, χωρίς προστατευτικό φίλτρο. Ο γάμος τους, στις 19 Οκτωβρίου 2024 στο Saint-Tropez, δεν σταθεροποιεί τίποτα: επισημοποιεί αυτό που ήδη ξεχείλιζε.\n\nΗ δική του δουλειά — κολάζ, κείμενα, εκδοτικές διατάξεις — υπάγεται σε μια αισθητική της έκθεσης. Ανοιχτές εφημερίδες, κομμένες εικόνες, μνήμη που αντιμετωπίζεται ως πρώτη ύλη. Τίποτα δεν είναι ουδέτερο. Όλα εμπλέκονται.\n\nΣωματικά, φέρει ένα σώμα που δεν συνεργάζεται πάντα: γρήγορη καρδιά, ιδιότροπη πίεση, σύστημα υπό πίεση. Κι όμως, συνεχίζει, με συνήθειες που μοιάζουν μερικές φορές με πρόκληση, μερικές φορές με αδιαφορία για τις συνέπειες. Καμία πραγματική αφήγηση λύτρωσης εδώ. Μόνο η επιμονή.\n\nΑγαπά έντονα, αρχειοθετεί εμμονικά, εργάζεται καταναγκαστικά και αρνείται να απλοποιήσει οτιδήποτε.\n\nΑν υπάρχει ένα ενοποιητικό αρχή, είναι αυτό: ο Sébastien Moreu δεν επιλύει τις αντιφάσεις του, τόσο πολύ λατρεύει εκείνες των άλλων.\n\nΤις δικές του, τις οργανώνει — και μετά ζει μέσα στην έκθεση. Αυτή η γκαλερί είναι το σπίτι του και αυτό που προσφέρει ολόκληρο σε αυτούς που αγαπά· τίποτα δεν είναι ποτέ για τον εαυτό του.\n\nΓια να καταλήξει, θα παρέθετε τον Desproges: « Καταπληκτικό, έτσι δεν είναι; »",vn:"André Vaszkievicz",vb:"Ο André Francisco Vaszkievicz γεννήθηκε στις 28 Νοεμβρίου 1990 σε μια Βραζιλία που μοιάζει ελάχιστα με τις τροπικές καρτ-ποστάλ. Το Seberi, μικρή αγροτική πόλη στον νότο της χώρας, ανήκει σε εκείνα τα εδάφη που διαμορφώθηκαν από τις ευρωπαϊκές μεταναστεύσεις του 20ού αιώνα: πολωνικές κοινότητες εδώ, αλλά λίγο πιο πέρα γερμανικές, ιταλικές, λιθουανικές… όπου οι γλώσσες, οι παραδόσεις, οι χοροί και ο καθολικισμός μερικές φορές επιβιώνουν με μεγαλύτερη επιμονή από ό,τι στις χώρες προέλευσής τους.\n\nΓιος Πολωνών απογόνων γεννημένων στη Βραζιλία, ο André μεγαλώνει σε ένα περιβάλλον δομημένο από εργασία, θρησκεία, σιωπές και ανδρικούς κώδικες. Τελευταίο παιδί οικογένειας με οκτώ αδέλφια (με μία μόνο αδελφή), γεννημένος σχεδόν δέκα χρόνια μετά τον νεότερο των μεγαλύτερων αδελφών του, φτάνει σε μια οικογένεια ήδη σημαδεμένη από τον κόπο, τους περιορισμούς και το βάρος των πολιτιστικών κληρονομιών.\n\nΈνα αγαπημένο απρόβλεπτο. Αγαπημένο αλλά μη αναμενόμενο. Θα είναι αρκετά μόνος σε αυτή την πολυπληθή οικογένεια.\n\nΠολύ νωρίς, καταλαβαίνει δύο πράγματα: αισθάνεται βαθιά στη θέση του στο σχολείο, και ορισμένες επιθυμίες δεν έχουν θέση στον κόσμο όπου μεγαλώνει.\n\nΗ γκέι εφηβεία δεν είναι εύκολη για κανέναν, πουθενά… αλλά σε αυτό το αγροτικό και συντηρητικό πλαίσιο, ούτε καν συζητείται. Η λέξη δεν υπάρχει και η επιθυμία βιώνεται περισσότερο ως εσωτερική ένταση παρά ως πιθανή ταυτότητα.\n\nΟ André μαθαίνει λοιπόν να παρατηρεί και να σιωπά, να ελέγχει τις χειρονομίες του, να κατηγορεί το σώμα και τα συναισθήματά του.\nΕίναι υπερβολικά ευαίσθητος για να μιλήσει και υπερβολικά σιωπηλός για να είναι συναισθηματικός. Υπερβολικά πειθαρχημένος για να μην πληγωθεί. Υπερβολικά επιθυμητός για να αγαπήσει απλά. Υπερβολικά προδομένος για να το εμπιστευθεί.\n\nΑλλά υπήρχαν τα βιβλία, τα λεξικά, οι γεωγραφικοί χάρτες, οι ξένες γλώσσες — ένας ολόκληρος σχεδόν άπειρος κόσμος από χαρτί που του επέτρεπε ήδη να εγκαταλείπει το Seberi νοητικά πριν μπορέσει να το κάνει σωματικά.\n\nΜετά το ισοδύναμο των πανελληνίων, λαμπρός, οι ανώτερες σπουδές θα παρέμεναν ωστόσο απρόσιτες για την κατάστασή του. Ο André εργάζεται στο Πόρτο Αλέγκρε, ανακαλύπτει λίγη ελευθερία και λίγο από τον εαυτό του μαζί της, μετά αφήνει σταδιακά τη Βραζιλία για την Ευρώπη και τον Κόσμο. Ίσως πιο μακριά να βρίσκεται περισσότερο από τον εαυτό του.\nΜαθαίνει αγγλικά στην Ιρλανδία, λαμβάνει τη λιθουανική υπηκοότητα με οικογενειακή καταγωγή και αναπτύσσει αξιοσημείωτη γνώση γλωσσών: πορτογαλικά, ισπανικά, πολωνικά, γαλλικά, γερμανικά και πολλές άλλες ακόμη. Τις περισσότερες φορές μόνος.\n\nΗ σχέση του με τις γλώσσες αφορά τόσο την ακαδημαϊκή απόδοση όσο και μια μορφή υπαρξιακής μετατόπισης: το να αλλάζει γλώσσα γίνεται επίσης τρόπος να μετατοπίζει την αμηχανία, να ξεγελάει την πλήξη, να διασχίζει τα σύνορα και να βελτιώνει τη ματιά που στρέφει προς τον εαυτό του.\n\nΤα επόμενα χρόνια θυμίζουν για πολύ καιρό μια επισφαλή διέλευση της σύγχρονης Ευρώπης: ξεριζωμός, πανδημία, μόνιμη ανοικοδόμηση.\n\nΩστόσο, ο André διατηρεί μια σχεδόν ασκητική πειθαρχία: σπορ, σταθερή πνευματική εργασία, διατροφικός έλεγχος, ποτέ αλκοόλ και πρακτικά καθόλου ναρκωτικά. Το σώμα του φαίνεται να αντιμετωπίζεται ως μια επικράτεια που πρέπει να κρατηθεί όρθια πάση θυσία.\n\nΗ συνάντηση με τον Sébastien Moreu μεταμορφώνει αυτή την τροχιά αλλά δεν σβήνει τις πληγές της… τουλάχιστον προσπαθεί να τις απαλύνει. Μαζί αναπτύσσουν το I Love You Moneypenis, σχέδιο που αναμιγνύει εικόνα, επιθυμία, αυτοβιογραφία και περφόρμανς. Ο γάμος τους, που γιορτάστηκε στο Saint-Tropez στις 19 Οκτωβρίου 2024, δεν σταθεροποιεί το χάος: του δίνει απλώς μια βιώσιμη και ορατή μορφή, μια ανάπαυλα.\n\nΠαράλληλα, ο André ξαναπιάνει σπουδές στη Sorbonne Nouvelle στις γλωσσολογικές επιστήμες, όπου τα αποτελέσματά του τραβούν γρήγορα την προσοχή, ιδίως στα κινεζικά. Πραγματοποιεί επίσης μια αξιοσημείωτη πρακτική άσκηση στο Cours Florent. Ο ντροπαλός αποκαλύπτεται στον εαυτό του, ανακαλύπτει την απελευθερωτική δύναμη της έκφρασης των συναισθημάτων που επιτρέπει στον εαυτό του αφού είναι γραμμένα από άλλους. Καλοκαίρι 2025, αναχωρεί για πανεπιστημιακή εμβύθιση στην Ταϊβάν· φέτος θα είναι η Σαγκάη.\n\nΛάτρης της αστρολογίας και των αρχαίων πνευματικοτήτων, εμπλεκόμενος σε μια βαθιά θεραπευτική εργασία γύρω από την εμπειρία του, ο André παραμένει ωστόσο δύσκολο να συνοψιστεί. Όλα σε αυτόν φαίνονται οργανωμένα για να μετατρέψουν τις πληγές σε εσωτερική αρχιτεκτονική.\n\nΑλλά στα μάτια του Sébastien Moreu, το πιο συγκινητικό είναι αλλού — το πιο συγκινητικό είναι να βλέπει τον André να παρατηρεί ένα αγριολούλουδο. Γιατί τότε ολόκληρος ο μηχανισμός καταρρέει — η κυριαρχία, η άμυνα, ο έλεγχος — και ξαναεμφανίζεται ξαφνικά κάτι εξαιρετικά σπάνιο: μια ανέπαφη γλυκύτητα που έχει επιβιώσει από όλα τα υπόλοιπα.\n\nΓια να καταλήξει, θα παρέθετε πιθανότατα τον Jorge Amado: « Ο κόσμος αξίζει μόνο για τη συγκίνηση που μας δίνει. » ή με μεγαλύτερη βεβαιότητα σήμερα τη Gisèle Pelicot: « Η ντροπή πρέπει να αλλάξει στρατόπεδο. »",prst:"Υλικό Τύπου",prss:"Σε προετοιμασία",prsc:"contact@moneypenis.com",plt:"Στον Τύπο",pls:"Έρχεται σύντομα",nt:"Επικοινωνία",ns:"Αποστολή",n1:"Όνομα",n2:"Email",n3:"Μήνυμα",lg:"© Sébastien Moreu · © André Vaszkievicz · Παρίσι 2024\nISBN ΜΜ: 978-2-492649-21-9 · ISBN ΜεΜ: 978-2-492649-20-2 · INPI αρ. 4999735 & 4999726 · Ψηφιακό υδατόσημο",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Δηλώνω υπευθύνως ότι είμαι 18 ετών ή μεγαλύτερος/η και ενήλικος/η σύμφωνα με τη νομοθεσία της χώρας διαμονής μου.",ck2:"Αναγνωρίζω ότι αυτός ο ιστότοπος παρουσιάζει καλλιτεχνικά φωτογραφικά έργα ρητού χαρακτήρα, συμπεριλαμβανομένης της πώλησης πρωτότυπων εκτυπώσεων, και συναινώ να αποκτήσω πρόσβαση εν γνώσει μου.",nat:"Σημείωμα των δημιουργών",naf:"Οι Δημιουργοί επιθυμούν να προειδοποιήσουν ότι η ψυχαγωγική ελαφρότητα του τίτλου και του λογοτύπου, όπως και οι ρητές εικόνες και τα κείμενα των έργων, μπορούν να δώσουν εντύπωση ανεμελιάς απέναντι σε ένα ωστόσο σοβαρό θέμα. Υπενθυμίζουν ότι δεν είναι έτσι και ότι αυτό το παραμύθι γεννήθηκε από τις προσωπικές τους εμπειρίες. Και οι δύο έχουν, για διαφορετικούς λόγους και σε διαφορετικές εποχές, βιώσει όλες τις πτυχές του.\n\nΤο κοινό καλλιτεχνικό τους σχέδιο έχει την πρόθεση να αποτρέψει οποιονδήποτε από το να εμπλακεί σε μια δραστηριότητα προειδοποιώντας ότι ακόμη και σήμερα: κλείνει περισσότερες πόρτες από όσες ανοίγει και εκθέτει σε πολυάριθμους κινδύνους όσους την ασκούν και τους οικείους τους. Ιδίως λοιμώξεις και ασθένειες, ειδικά ΣΜΝ, εξαρτήσεις από χρήση ναρκωτικών και αλκοόλ… Αυτή η δραστηριότητα, σε οποιαδήποτε μορφή, εκθέτει σε επισφάλεια, εξάρτηση, κοινωνική απόρριψη, βία, εκβιασμό, κακοποίηση, εξαναγκασμό και απαιτήσεις.\n\nΓια εκείνους, υπερβολικά λίγους, που καταφέρνουν να ξεφύγουν, απαιτεί πάντοτε μια πολύ μακροπρόθεσμη ψυχολογική συνοδεία, τόσο πολύ οι κοινωνίες μας δεν τους αφήνουν άλλες διεξόδους από τη θυματοποίηση ή τη ντροπή, ή και τα δύο μαζί.\n\nΟι δημιουργοί καλούν λοιπόν σε σεβασμό και προστασία των εργαζομένων του σεξ. Χωρίς να αρνούνται την αναγκαιότητα ποινικοποίησης των πελατών, καλούν εξίσου σε αξιοπρεπή μεταχείριση της συναισθηματικής δυστυχίας, ακόμη και της απόγνωσης, που τους οδηγεί να παραβιάζουν τον Νόμο. Οι δημιουργοί ελπίζουν, τόσο από το ευρύ κοινό όσο και από τους θεσμούς, σε μεγαλύτερη υποστήριξη προς τις ενώσεις που μπορούν να συνοδεύσουν τόσο τους μεν όσο και τους δε.\n\nΔεν πρόκειται εδώ σε καμία περίπτωση για τυφλή άρση των ταμπού σε όλες τις πρακτικές, ούτε για την πρόκληση σκανδάλου… Αλλά για την υπενθύμιση του επείγοντος να απαλλαγούμε από τις κοινωνικές απαγορεύσεις που σκληραίνουν μια δημόσια συζήτηση που ωστόσο θα έπρεπε να είναι ήρεμη, και όχι καλυμμένη με ένα ηθικό ένδυμα που δεν έχει εκεί τίποτα να κάνει και εμποδίζει κάθε απελευθέρωση του λόγου. Δεν έχουν καμία αμφιβολία ότι αν υπάρχει ένα πέπλο να εξοριστεί, είναι αυτό.\n\nΚαι με συζήτηση εννοούν να επικαλεστούν την πρώτη από όλες, αυτή που θα έπρεπε να γίνει εντός της οικογένειας.\n\nΚαι έπειτα είναι όμορφο… επίσης… ένα πέος!\n\n(Το μοντέλο που επέλεξαν οι καλλιτέχνες δεν είναι εργαζόμενος του σεξ. Μοιραζόμενος τη ζωή του με έναν από τους δημιουργούς, επιθυμούσε να παραμείνει ανώνυμος.)\n\nΑν οι Δημιουργοί ασχολήθηκαν με αυτό το θέμα που τους αγγίζει, είναι γιατί τους φάνηκε ότι στην εποχή μας της τυποποιημένης επικοινωνίας, της λογοκρισίας των δικτύων και της αναγέννησης της σεμνοτυφίας, ήταν περισσότερο από ποτέ απαραίτητο να φέρουν μια δημιουργική και καλλιτεχνική άποψη που παραμένει παραδόξως απούσα. Θέλησαν να δώσουν σε αυτό το σύνολο τόσο την ελαφρότητα που θα έπρεπε να επικρατεί όταν συζητάμε για τον έρωτα και την απόλαυση, όσο και το βάρος που επιβάλλουν οι βιωμένες πραγματικότητες: με θάρρος και χωρίς πάθος.\n\nΔεν εννοούν να υποκαταστήσουν τις ατομικές επιλογές, ούτε τους νόμους που ισχύουν σε κυρίαρχα κράτη ούτε τις αξίες στις οποίες ο καθένας είναι ελεύθερος να προσχωρήσει.\n\nΣτη Γαλλία — δεν είναι η περίπτωση όλων των χωρών, ακόμη και των δημοκρατικών — οι απαντήσεις που δίνονται από την αστυνομία και τη δικαιοσύνη, στο νομικό πλαίσιο ενός ουσιαστικού αγώνα κατά της εμπορίας ανθρώπων, έχουν βελτιωθεί με τα χρόνια προς την κατεύθυνση αυτού που αναμένεται από μια σύγχρονη χώρα. Αλλά το κάνουν στο γενικό πλαίσιο και δεν προσφέρουν, ίσως δεν είναι ο ρόλος τους, βελτίωση στις ατομικές καταστάσεις που βιώνουν τόσο οι εργαζόμενοι του σεξ όσο και οι πελάτες τους. Ενώσεις εκπληρώνουν διακριτικά τις αποστολές τους παρά την ασθένεια των μέσων τους.\n\nΤόσο για τις σχετικές διοικήσεις όσο και για τις ενώσεις, υπάρχουν διαδικτυακοί τόποι. Ορισμένοι πολύ χρήσιμοι επιλέγονται και είναι διαθέσιμοι σε μια λίστα που ενημερώνεται τακτικά στον δικό μας διαδικτυακό τόπο: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Μεμονωμένες πλάκες",siCh:"Επιλέξτε μέγεθος",siInq:"Ερώτηση",siNote:"Τιμές σε ευρώ, με γαλλικό ΦΠΑ. Συσκευασία, αποστολή και ασφάλιση στο κόστος.",siCont:"Για απόκτηση, γράψτε μας στο smoreu@mac.com — ή μέσω της φόρμας επικοινωνίας",siPro:"Βιβλιοπώλες, έμποροι τέχνης και γκαλερί — γράψτε μας για επαγγελματικούς όρους, εκθέσεις και παρακαταθήκες.",siRgpd:"Τα στοιχεία σας θα χρησιμοποιηθούν μόνο για το αίτημά σας και για ενημερώσεις σχετικά με τα έργα των καλλιτεχνών.",siPick:"Αγγίξτε ένα έργο για να το δείτε και να το αποκτήσετε",req:"Υποβάλετε αίτηση",reqAge:"Αυτή η ενότητα προορίζεται μόνο για ενηλίκους.",shPfD:"30 × 40 εκ. · 50 αριθμημένα και υπογεγραμμένα αντίτυπα",shGfD:"50 × 70 εκ. · 15 αριθμημένα και υπογεγραμμένα αντίτυπα",shUn:"Μεμονωμένα φύλλα",shUnD:"Κάθε φύλλο διαθέσιμο σε Μικρή ή Μεγάλη Έκδοση · υπογεγραμμένα S.M. & A.V.",fFirstName:"Όνομα",fPhone:"Τηλέφωνο",fCountry:"Χώρα",fLangPref:"Γλώσσα απάντησης",fPref:"Προτίμηση επικοινωνίας",fMatrix:"Θέμα του αιτήματος",fMatrixHint:"Σημειώστε τα σχετικά πεδία",fMsgPh:"Λεπτομέρειες (μέγ. 500 χαρακτήρες)",fConsent:"Αποδέχομαι τους παραπάνω όρους και τη διαβίβαση των στοιχείων μου στους Sébastien Moreu και André Vaszkievicz.",fSent:"Το αίτημα στάλθηκε. Θα λάβετε απάντηση στη διεύθυνση που δηλώσατε.",fError:"Η αποστολή απέτυχε. Μπορείτε να γράψετε απευθείας στο smoreu@mac.com.",rqInfo:"Πληροφορίες",rqBuy:"Αγορά",rqDeposit:"Παρακαταθήκη",rqPro:"Επαγγελματικά",rqColl:"Συλλέκτης",rqOther:"Άλλο",continueShop:"Συνέχεια περιήγησης",nax:"Διαβάστε όλο το κείμενο ▾",nac:"Μάζεμα ▴",aiWarn:"ΠΡΟΣΟΧΗ: ΑΥΤΗ Η ΜΕΤΑΦΡΑΣΗ ΕΧΕΙ ΠΑΡΑΧΘΕΙ ΑΠΟ ΤΕΧΝΗΤΗ ΝΟΗΜΟΣΥΝΗ ΚΑΙ ΜΠΟΡΕΙ ΝΑ ΠΕΡΙΕΧΕΙ ΛΑΘΗ Ή ΠΑΡΑΝΟΗΣΕΙΣ",rqAcq:"Διαθεσιμότητα και όροι απόκτησης",rqPress:"Τύπος",rqInfo2:"Γενικές πληροφορίες",rqPro2:"Επαγγελματικά · Μεταπωλητές",rqOther2:"Άλλο",shopPortPF:"Πορτφόλιο · Μικρή Έκδοση",shopPortGF:"Πορτφόλιο · Μεγάλη Έκδοση",shopSingPF:"Μεμονωμένα φύλλα · Μικρή Έκδοση",shopSingGF:"Μεμονωμένα φύλλα · Μεγάλη Έκδοση",priceLbl:"Τιμή με ΦΠΑ",priceUnit:"με ΦΠΑ",pricePer:"/ φύλλο",availPort:"Αριθμοί %F% έως %T% από %N% διαθέσιμοι",availSingle:"Από τα πορτφόλια %F% έως %T% από %N%",noChoice:"Ο αριθμός εκτύπωσης αποδίδεται αυτόματα (δεν επιλέγεται από τον αγοραστή)",shopFormTitle:"Υποβολή αιτήματος",shopFormSubtitle:"Επιλέξτε τα προϊόντα και τη φύση του αιτήματός σας. Η ομάδα μας θα απαντήσει σύντομα.",shopFmtPF:"Μικρή Έκδοση · 30 × 40 cm",shopFmtGF:"Μεγάλη Έκδοση · 50 × 70 cm",ctTitle:"Επικοινωνία",ctSubtitle:"Μια ερώτηση για το έργο, τους καλλιτέχνες ή κάτι άλλο — γράψτε μας, θα σας απαντήσουμε.",ctSubj:"Θέμα του μηνύματός σας",ctSubjProj:"Το έργο I Love You Moneypenis",ctSubjArt:"Οι καλλιτέχνες",ctSubjOther:"Άλλη ερώτηση",ctFollow:"Ακολουθήστε μας"},TR:{techs:["Şiir · Altın haç","El yazısı mektup · Lacivert mürekkep · Heykel","Renkli fotoğraf · Sarı metin","Gümüş jelatin baskı · El yazısı yeşil mürekkep","Renkli fotoğraf · Kırmızı metin · Hermès kravat","Renkli fotoğraf · Açık kot · Doğa","Camgöbeği tonlu fotoğraf · Turuncu el yazısı mektup","Kırmızı metin · S/B · Çok dilli uyarı","El yazısı mektup · 50€ banknotlar · Eller","Kırmızı metin · S/B · Manifesto","El yazısı mektup · Çiçekli arka plan · Lacivert mürekkep"],aw:"Müstehcen içerik · Yalnızca bilinçli yetişkinler için",am:"Bu site, yalnızca bilinçli yetişkinlere yönelik fotoğraf sanat eserleri sunmaktadır.",ap:"+ 18 yaş — Tam sürüm",am2:"− 18 yaş — Kamu sürümü",nav:["I Love You Moneypenis","Tanıtım","Değerli Kutular","In Situ Seviyorsun","Patlıcanın Fiyatı","Gerçekten Güzel Kalemler…","🍆","I love you too","Burada Her Şey Yeniden Başlar","Kalemler ve Eller"],navPresse:"Az Etle Çok Şeref",hl:"Sınırlı Sayıda Baskı · Orijinal jelatin gümüş baskılar",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paris, 2024",hd:"Yetişkinler için bir Gay Pop Porno masalı.\nCollection La Grande Librairie de Saint-Tropez®",hc:"Esere girin",pt:"I Love You Moneypenis",ps:"11 orijinal jelatin gümüş baskı · Traphot, Montrouge\nSébastien Moreu & André Vaszkievicz tarafından imzalı ve numaralı",mg:"Büyütmek için tıklayın",tech_info:"2024 · 30 × 40 cm (50 adet) · 50 × 70 cm (15 adet) · Jelatin gümüş baskı · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 adet) · 50 × 70 cm (15 adet) · Arches kağıdına baskı · Her iki sanatçı tarafından elle numaralanmış ve imzalanmış",op:"Açılış",tx:"Metin",pr:"Korumalı eser · Dijital filigran",ct:"Kutu",cs:"Tam portfolyo · 11 jelatin gümüş baskı · İmzalı ve numaralı · Eldivenler dahil",zt:"In Situ",zs:"Mekânda eserler",vt:"Film",vs:"Yalnızca bilinçli yetişkinler için içerik",st:"Edinin",pft:"Küçük Boyut  30 × 40 cm",pfc:"01/50 → 50/50 numaralı 50 portfolyo",pfi:"ISBN: 978-2-492649-21-9",gft:"Büyük Boyut  50 × 70 cm",gfc:"01/15 → 15/15 numaralı 15 portfolyo",gfi:"ISBN: 978-2-492649-20-2",sg:"S.M. & A.V. imzalı · Her baskıda numara · Eldivenler dahil",pd:"Traphot, Montrouge",p1:"Portföy Küçük Format · tam",p2:"Tekil baskı · Küçük Format",p3:"Portföy Büyük Format · tam",p4:"Tekil baskı · Büyük Format",sh:"Nakliye ve Sigorta",sb:"Müze ambalajı · DHL Express\nFransa 45 € · Avrupa 95 € · Uluslararası 180 €\nSigorta dahil",py:"Ödeme",pb:"Havale · Kart · PayPal · 3× faizsiz",co:"Koşullar",cb:"Orijinallik sertifikası · 14 gün iade · Ülkeye göre KDV",rv:"Rezerve Et",by:"Edinin",bt:"Kalemlerden ve ellerden",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — bir tür stilistik teslimiyet olarak herkesin onu her zaman Sébastien diye çağırdığını bize hatırlatan kişi — disiplinin ve iradenin saplantıyı evcilleştirmeyi reddettiğinde olan şeydir.\n\n25 Aralık 1972'de masum olmak için fazla mükemmel bir sahnede — Saint-Tropez — doğan o, kesinliğin (ağızlar şekillendiren bir dişçi baba) ve mitin gölgesinde büyür: direnişçiler, denizciler, kayıplar, gömülü kalmayı reddeden aile hayaletleri. On yaşında, kendisine eksiksiz bir resim cephanesi teslim edilir. Oyuncak değil. İlk dolu silah — bir barok koleksiyonunun, mahrem savaşlar delisinin koleksiyonunun başlangıcı.\n\nOnları asla geri vermeyecek. Savaş alanlarını çoğaltmayı tercih ediyor.\n\nArdışık yer değiştirmelerle ilerliyor: resim, kitaplar, görüntüler, insan ilişkileri — her şey malzeme oluyor, her şey yeniden bir araya getirilebilir. İnşa ettiği şey klasik anlamda bir eser değil, bir gerilim alanıdır: hafıza ile icat, sadakat ile ihanet, kontrol ile kayıp arasında.\n\nKurumlar için çalışmıyor. Onlara sızıyor. 90'lı yıllardan beri, galerist Enrico Navarra'nın yörüngesinde, etiketleri reddeden bir kariyer inşa ediyor: ne tam olarak çalışan, ne tam olarak sanatçı, ne sadece yayıncı — daha çok kitaplar, sergiler, bağlantılar, arşivler, fikirler, iletişim, etkinlikler üretebilen üretken bir anomali, hem nefes kesici hem süreksiz bir hızda. Kendisini içermeye yönelik tüm çerçeveleri metodik olarak yok eden bu adam için kamuflaj görevi gören bir düzensizlik.\n\nMade By… koleksiyonunun tasarımına ve geliştirilmesine aktif olarak katılıyor, farklı kültürel sahnelerde çağdaş yaratıcılığa adanmış uluslararası bir yayın projesi. Bu çerçevede, fotoğrafçı Simon Schwyzer ile yakın bir işbirliği yapıyor.\n\nSimon Schwyzer ile ilişkisi her şeyin kararsız kalbidir: bağımlılığa dönüşmüş bir işbirliği, aşk sistemine dönüşmüş bir dostluk. Çift mi? İsviçreli fotoğrafçının vahşi ölümünden bu yana Moreu yanıtlıyor: « Ona sorun. » Yine de, onun ortadan kaybolmasından sonra hiçbir şey durmuyor — aksine, her şey yoğunlaşıyor. Çalışmak tutmanın, yayınlamak uzatmanın, yazmak teslim olmamanın bir yolu oluyor. Eserini korumaya ve tanıtmaya kendini adıyor, özellikle Made by… Simon Schwyzer monografisinin yayınlanmasının hazırlanması yoluyla.\n\n2017'de, Enrico Navarra'nın desteğiyle, sanat kitapları, denemeler ve enine kesen yayın projelerine adanmış bağımsız bir yapı olan Éditions Sébastien Moreu'yu kurmuştu. İsviçreli fotoğrafçının anısı işletmeyi yok edecek. Projeleri değil.\n\nDaha sonra, André Vaszkievicz ile, mahrem yeniden biçim değiştirir. I Love You Moneypenis ilişkilerinin üzerine konulmuş dekoratif bir proje değildir: metin, görüntü, arzu, para, beden çarpışmasıdır. Koruyucu filtre olmadan, bağın içinden tasarlanmış bir eser. 19 Ekim 2024'te Saint-Tropez'deki evlilikleri hiçbir şeyi istikrara kavuşturmuyor: zaten taşan şeyi resmileştiriyor.\n\nKendi çalışması — kolajlar, metinler, yayın aygıtları — bir teşhir estetiğine aittir. Açık gazeteler, kesilmiş görüntüler, hammadde gibi işlenen hafıza. Hiçbir şey tarafsız değil. Her şey dahil.\n\nFiziksel olarak, her zaman işbirliği yapmayan bir bedene sahiptir: hızlı kalp, kaprisli tansiyon, baskı altında sistem. Ve yine de, bazen meydan okumaya benzeyen, bazen sonuçlara kayıtsızlığa benzeyen alışkanlıklarla devam ediyor. Burada kendine özgü bir kurtuluş anlatısı yok. Sadece direnç.\n\nYoğun bir şekilde sever, takıntılı bir şekilde arşivler, kompulsif olarak çalışır ve hiçbir şeyi basitleştirmeyi reddeder.\n\nBirleştirici bir ilke varsa, şudur: Sébastien Moreu çelişkilerini çözmez, başkalarınınkine o kadar çok saygı duyar ki.\n\nKendininkileri organize eder — ve sonra serginin içinde yaşar. Bu galeri onun evi ve sevdiklerine bütünüyle sunduğu evdir; hiçbir şey asla onun için değildir.\n\nSonuç olarak, Desproges'u alıntılardı: « Şaşırtıcı, değil mi? »",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz, 28 Kasım 1990'da tropik kartpostallara çok az benzeyen bir Brezilya'da doğdu. Ülkenin güneyinde küçük bir kırsal kasaba olan Seberi, 20. yüzyılın Avrupa göçlerinin şekillendirdiği topraklara aittir: burada Polonya toplulukları, ancak biraz ötede Alman, İtalyan, Litvanya toplulukları… dillerin, geleneklerin, dansların ve Katolikliğin bazen kendi ülkelerinden daha fazla inatla hayatta kaldığı yerlerde.\n\nBrezilya'da doğmuş Polonyalı torunların oğlu olan André, iş, din, sessizlikler ve eril kodlarla yapılandırılmış bir ortamda büyür. Sekiz kardeşli bir ailenin son çocuğu (sadece bir kız kardeş olan), yaşça büyüklerinin en küçüğünden neredeyse on yıl sonra doğan o, çaba, kısıtlamalar ve kültürel mirasların ağırlığıyla zaten damgalanmış bir aileye gelir.\n\nSevilen bir beklenmedik. Sevilen ama beklenmemiş. Bu kalabalık ailede oldukça yalnız olacak.\n\nÇok erken iki şeyi anlıyor: okulda derinden kendi yerinde hissediyor ve bazı arzuların büyüdüğü dünyada yeri yok.\n\nGay ergenlik hiç kimse için, hiçbir yerde kolay değildir… ama bu kırsal ve muhafazakar bağlamda söz konusu bile değildir. Kelime yoktur ve arzu, olası bir kimlik olarak değil, daha çok bir iç gerilim olarak yaşanır.\n\nAndré böylece gözlemlemeyi ve susmayı, jestlerini kontrol etmeyi, bedenini ve duygularını suçlamayı öğrenir.\nKonuşamayacak kadar hassas ve duygusal olamayacak kadar suskundur. Yaralanmamak için fazla disiplinli. Basit sevmek için fazla arzulu. Bunu itiraf edemeyecek kadar ihanete uğramış.\n\nAma kitaplar, sözlükler, coğrafya haritaları, yabancı diller vardı — Seberi'yi fiziksel olarak terk edebilmeden önce zihinsel olarak terk etmesine zaten izin veren neredeyse sonsuz bir kağıt dünyası.\n\nParlak bakaloryanın eşdeğerinden sonra, yüksek öğrenim yine de durumu için erişilemez kalacaktır. André Porto Alegre'de çalışır, biraz özgürlük ve onunla biraz kendini keşfeder, sonra Brezilya'yı yavaş yavaş Avrupa ve Dünya için terk eder. Belki daha uzakta daha fazla kendini bulabiliriz.\nİrlanda'da İngilizce öğrenir, aile soyundan Litvanya vatandaşlığı alır ve dillerde dikkate değer bir hakimiyet geliştirir: Portekizce, İspanyolca, Lehçe, Fransızca, Almanca ve birkaç başkası daha. Çoğu zaman yalnız.\n\nDillerle olan ilişkisi, akademik performans kadar varoluşsal bir yer değiştirme biçimine de aittir: dil değiştirmek aynı zamanda utancı yer değiştirmenin, can sıkıntısını aldatmanın, sınırları geçmenin ve kendine yönelttiği bakışı iyileştirmenin bir yolu olur.\n\nSonraki yıllar uzun süre çağdaş Avrupa'nın tehlikeli geçişini andırıyor: köklerinden koparılma, pandemi, sürekli yeniden inşa.\n\nYine de André neredeyse çileci bir disiplini sürdürüyor: spor, sürekli entelektüel çalışma, beslenme kontrolü, asla alkol ve neredeyse hiç uyuşturucu yok. Bedeni, ne pahasına olursa olsun ayakta tutulması gereken bir bölge olarak ele alınıyor gibi görünüyor.\n\nSébastien Moreu ile karşılaşma bu yörüngeyi dönüştürür ama yaralarını silmez… en azından onları yumuşatmaya çalışır. Birlikte görüntü, arzu, otobiyografi ve performansı harmanlayan bir proje olan I Love You Moneypenis'i geliştirirler. 19 Ekim 2024'te Saint-Tropez'de kutlanan evlilikleri kaosu istikrara kavuşturmaz: ona sadece yaşanabilir ve görünür bir biçim, bir nefes verir.\n\nParalel olarak, André dilbilim alanında Sorbonne Nouvelle'de eğitimine devam ediyor, burada sonuçları özellikle Çincede hızla dikkat çekiyor. Ayrıca Cours Florent'ta dikkate değer bir staj yapıyor. Utangaç kendini kendine açıyor, başkaları tarafından yazıldığı için kendine izin verdiği duyguları ifade etmenin özgürleştirici gücünü keşfediyor. 2025 yazında, Tayvan'a üniversite daldırması için ayrılıyor; bu yıl Şanghay olacak.\n\nAstroloji ve eski maneviyatlara tutkun, yaşadığı deneyim etrafında derin bir terapötik çalışmaya bağlı olan André, yine de özetlemesi zor kalıyor. Onunla ilgili her şey yaraları içsel bir mimariye dönüştürmek için organize edilmiş gibi görünüyor.\n\nAma Sébastien Moreu'nun gözünde en dokunaklı olan başka bir yerdedir — en dokunaklı olan, André'nin bir kır çiçeğini gözlemlemesini izlemektir. Çünkü o zaman tüm mekanizma çöker — ustalık, savunma, kontrol — ve aniden son derece nadir bir şey yeniden ortaya çıkar: her şeye dayanan dokunulmamış bir yumuşaklık.\n\nSonuç olarak, muhtemelen Jorge Amado'yu alıntılardı: « Dünya yalnızca bize verdiği duygu kadar değerli. » ya da bugün daha kesin olarak Gisèle Pelicot'yu: « Utanç kamp değiştirmeli. »",prst:"Basın Materyali",prss:"Hazırlık aşamasında",prsc:"contact@moneypenis.com",plt:"Basında",pls:"Çok yakında",nt:"İletişim",ns:"Gönder",n1:"Ad",n2:"E-posta",n3:"Mesaj",lg:"© Sébastien Moreu · © André Vaszkievicz · Paris 2024\nISBN KB: 978-2-492649-21-9 · ISBN BB: 978-2-492649-20-2 · INPI no. 4999735 & 4999726 · Dijital filigran",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"İkamet ettiğim ülkenin yasalarına göre 18 yaşında veya daha büyük olduğumu ve reşit olduğumu kendi sorumluluğum altında beyan ederim.",ck2:"Bu sitenin orijinal baskıların satışı dahil müstehcen nitelikli sanatsal fotoğraf eserleri sunduğunu kabul eder ve bilinçli olarak erişmeyi onaylarım.",nat:"Yazarların Notu",naf:"Yazarlar, başlığın ve logonun eğlendirici hafifliğinin, eserlerin müstehcen görselleri ve metinleri gibi, yine de ciddi bir konu karşısında bir umursamazlık izlenimi verebileceğini uyarmak isterler. Bunun böyle olmadığını ve bu masalın kendi kişisel deneyimlerinden doğduğunu hatırlatırlar. Her ikisi de, farklı nedenlerle ve farklı dönemlerde, tüm yönlerini yaşamışlardır.\n\nOrtak sanatsal projeleri, bugün bile bu durumun: açtığından daha fazla kapıyı kapattığı ve bunu uygulayanları ve yakınlarını birçok riske maruz bıraktığı konusunda uyararak, herkesi böyle bir faaliyete girişmekten caydırma niyetindedir. Özellikle enfeksiyonlar ve hastalıklar, özellikle CYBH, uyuşturucu ve alkol kullanımına bağlı bağımlılıklar… Bu faaliyet, hangi biçimde olursa olsun, güvencesizliğe, bağımlılığa, sosyal dışlanmaya, şiddete, şantaja, istismara, baskıya ve haraçlara maruz bırakır.\n\nOradan çıkmayı başaranlar için, çok az sayıda, her zaman çok uzun vadeli psikolojik bir refakat gerektirir, toplumlarımız onlara mağdurlaştırma veya utançtan, hatta her ikisinden başka çıkış bırakmadığı için.\n\nYazarlar bu nedenle seks işçilerine saygı gösterilmesini ve korunmasını isterler. Müşterilere ceza verilmesinin gerekliliğini reddetmeden, Yasa'yı ihlal etmelerine yol açan duygusal sefalet, hatta umutsuzluk karşısında onurlu bir muameleye de aynı şekilde çağırırlar. Yazarlar, hem geniş kamuoyundan hem de kurumlardan, her iki tarafa eşlik edebilecek derneklere daha fazla destek bekliyorlar.\n\nBurada söz konusu olan kesinlikle tüm pratikler üzerindeki tabuları kör bir şekilde kaldırmak değildir, skandal yaratmak da değildir… Ancak sakin olması gereken ve buraya hiçbir şey yapmayan ve sözün her türlü kurtuluşunu engelleyen ahlaki bir cüppe ile örtülmemesi gereken bir kamusal tartışmayı sertleştiren toplumsal yasaklardan kurtulma aciliyetini hatırlatmaktır. Eğer kovulması gereken bir örtü varsa, bunun bu olduğundan hiç şüpheleri yok.\n\nVe tartışma derken, hepsinin en başında olanı, aile içinde yapılması gerekenleri kastediyorlar.\n\nVe ayrıca güzeldir… o da… bir sik!\n\n(Sanatçıların seçtiği model bir seks işçisi değildir. Yazarlardan biriyle hayatını paylaşan o, anonim kalmak istemiştir.)\n\nYazarlar kendilerini etkileyen bu konuya değindiyse, bunun nedeni, biçimlendirilmiş iletişim, ağ sansürü ve namus kavramının yeniden doğuşu çağımızda, garip bir şekilde eksik kalan yaratıcı ve sanatsal bir bakış açısı getirmenin her zamankinden daha gerekli olduğunun onlara görünmüş olmasıdır. Bu bütüne hem aşk ve hazdan söz ederken hüküm sürmesi gereken hafifliği, hem de yaşanmış gerçeklerin dayattığı ağırlığı vermek istemişlerdir: cesaret ve patos olmadan.\n\nBireysel seçimlerin yerine geçmeye, demokratik bile olsa egemen ülkelerde yürürlükte olan yasalara veya herkesin özgürce katılmakta olduğu değerlere geçmeye niyetleri yoktur.\n\nFransa'da — bu, demokratik bile olsa tüm ülkelerde durum değildir — polis ve adalet tarafından, insan kaçakçılığına karşı temel mücadelenin yasal çerçevesinde verilen yanıtlar, modern bir ülkeden beklenenler doğrultusunda yıllar içinde iyileşmiştir. Ancak bunu genel çerçevede yapıyorlar ve seks işçileri ile müşterilerinin yaşadığı bireysel durumlara iyileştirme getirmiyorlar, belki de bu onların rolü değil. Dernekler, kaynaklarının yetersizliğine rağmen misyonlarını gizlice yerine getiriyor.\n\nHem ilgili idareler hem de dernekler için internet siteleri mevcuttur. Çok yararlı bazıları seçilmiş ve kendi internet sitemizde düzenli olarak güncellenen bir listede mevcuttur: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Tekli baskılar",siCh:"Boyut seçin",siInq:"Sormak",siNote:"Fiyatlar avro cinsindendir, Fransız KDV'si dahildir. Paketleme, kargo ve sigorta gerçek maliyetiyle faturalandırılır.",siCont:"Edinim için smoreu@mac.com adresine yazın — veya iletişim formunu kullanın",siPro:"Kitapçılar, sanat tüccarları ve galeriler — profesyonel koşullar, sergiler ve emanetler için bize yazın.",siRgpd:"Verileriniz yalnızca talebiniz ve sanatçıların projeleri hakkındaki haberler için kullanılacaktır.",siPick:"Bir baskıya dokunarak görüntüleyin ve edinin",req:"Talepte bulun",reqAge:"Bu bölüm yalnızca yetişkinlere yöneliktir.",shPfD:"30 × 40 cm · 50 numaralı ve imzalı baskı",shGfD:"50 × 70 cm · 15 numaralı ve imzalı baskı",shUn:"Tekil baskılar",shUnD:"Her baskı Küçük veya Büyük Formatta mevcut · S.M. & A.V. tarafından imzalı",fFirstName:"Ad",fPhone:"Telefon",fCountry:"Ülke",fLangPref:"Yanıt dili",fPref:"İletişim tercihi",fMatrix:"Talebinizin konusu",fMatrixHint:"İlgili kutuları işaretleyin",fMsgPh:"Ayrıntılar (maks. 500 karakter)",fConsent:"Yukarıdaki koşulları ve bilgilerimin Sébastien Moreu ile André Vaszkievicz'e iletilmesini kabul ediyorum.",fSent:"Talep gönderildi. Belirttiğiniz adrese yanıt göndereceğiz.",fError:"Gönderim başarısız. Doğrudan smoreu@mac.com adresine yazabilirsiniz.",rqInfo:"Bilgi",rqBuy:"Satın alma",rqDeposit:"Emanet",rqPro:"Ticaret",rqColl:"Koleksiyoner",rqOther:"Diğer",continueShop:"Göz atmaya devam et",nax:"Tamamını oku ▾",nac:"Daralt ▴",aiWarn:"DİKKAT: BU ÇEVİRİ YAPAY ZEKA TARAFINDAN ÜRETİLMİŞTİR VE HATALAR VEYA YANLIŞ ANLAŞILMALAR İÇEREBİLİR",rqAcq:"Stok durumu ve edinim koşulları",rqPress:"Basın",rqInfo2:"Genel bilgiler",rqPro2:"Profesyonel · Satıcılar",rqOther2:"Diğer",shopPortPF:"Portföy · Küçük Format",shopPortGF:"Portföy · Büyük Format",shopSingPF:"Tekil baskılar · Küçük Format",shopSingGF:"Tekil baskılar · Büyük Format",priceLbl:"KDV dahil fiyat",priceUnit:"KDV dahil",pricePer:"/ baskı",availPort:"%N% adetten %F%-%T% numaralı baskılar mevcut",availSingle:"%N% portföyden %F%-%T% numaralı portföylerden",noChoice:"Baskı numarası otomatik olarak atanır (alıcı tarafından seçilemez)",shopFormTitle:"Talep gönderin",shopFormSubtitle:"Ürünleri ve talebinizin niteliğini seçin. Ekibimiz size hızla geri dönecektir.",shopFmtPF:"Küçük Format · 30 × 40 cm",shopFmtGF:"Büyük Format · 50 × 70 cm",ctTitle:"Bize yazın",ctSubtitle:"Proje, sanatçılar ya da başka bir konuda bir sorunuz mu var — bize yazın, cevap vereceğiz.",ctSubj:"Mesajınızın konusu",ctSubjProj:"I Love You Moneypenis projesi",ctSubjArt:"Sanatçılar",ctSubjOther:"Başka bir soru",ctFollow:"Bizi takip edin"},RU:{techs:["Поэма · Золотой крест","Рукописное письмо · Тёмно-синие чернила · Скульптура","Цветная фотография · Жёлтый текст","Серебряно-желатиновый отпечаток · Зелёные рукописные чернила","Цветное фото · Красный текст · Галстук Hermès","Цветная фотография · Расстёгнутые джинсы · Природа","Фото в циановом оттенке · Оранжевое рукописное письмо","Красный текст · Ч/Б · Многоязычное предупреждение","Рукописное письмо · Купюры 50€ · Руки","Красный текст · Ч/Б · Манифест","Рукописное письмо · Цветочный фон · Тёмно-синие чернила"],aw:"Откровенный контент · Только для информированных взрослых",am:"Этот сайт представляет фотографические произведения, предназначенные исключительно для информированных взрослых.",ap:"+ 18 лет — Полная версия",am2:"− 18 лет — Публичная версия",nav:["I Love You Moneypenis","Тизер","Драгоценные шкатулки","In Situ тебе нравится","Цена баклажанов","Поистине прекрасные перья…","🍆","I love you too","Здесь всё начинается заново","Маркеры и руки"],navPresse:"Слишком много чести для столь малой плоти",hl:"Лимитированное издание · Оригинальные серебряно-желатиновые отпечатки",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Париж, 2024",hd:"Гей-поп-порно сказка, для информированных взрослых.\nКоллекция La Grande Librairie de Saint-Tropez®",hc:"Войти в произведение",pt:"I Love You Moneypenis",ps:"11 оригинальных серебряно-желатиновых отпечатков · Traphot, Монруж\nПодписаны и пронумерованы Sébastien Moreu & André Vaszkievicz",mg:"Нажмите, чтобы увеличить",tech_info:"2024 · 30 × 40 см (50 экз.) · 50 × 70 см (15 экз.) · Серебряно-желатиновый отпечаток · Traphot, Монруж",pl0:"2024 · 30 × 40 см (50 экз.) · 50 × 70 см (15 экз.) · Печать на бумаге Arches · Пронумерована и подписана вручную обоими художниками",op:"Открытие",tx:"Текст",pr:"Произведение защищено · Цифровой водяной знак",ct:"Кофре",cs:"Полное портфолио · 11 серебряно-желатиновых отпечатков · Подписаны и пронумерованы · Перчатки включены",zt:"In Situ",zs:"Произведения в интерьере",vt:"Фильм",vs:"Содержание только для информированных взрослых",st:"Приобрести",pft:"Малый формат  30 × 40 см",pfc:"50 портфолио, пронумерованных 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Большой формат  50 × 70 см",gfc:"15 портфолио, пронумерованных 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Подписаны S.M. & A.V. · Номер на каждом отпечатке · Перчатки включены",pd:"Traphot, Монруж",p1:"Портфолио Малый формат · полное",p2:"Отдельный оттиск · Малый формат",p3:"Портфолио Большой формат · полное",p4:"Отдельный оттиск · Большой формат",sh:"Доставка и страхование",sb:"Музейная упаковка · DHL Express\nФранция 45 € · Европа 95 € · Международная 180 €\nСтрахование включено",py:"Оплата",pb:"Банковский перевод · Карта · PayPal · 3 платежа без процентов",co:"Условия",cb:"Сертификат подлинности · Возврат 14 дней · НДС по стране",rv:"Зарезервировать",by:"Приобрести",bt:"О перьях и руках",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — который напоминает, как стилистическое смирение, что все всегда называли его Sébastien — это то, что происходит, когда дисциплина и воля отказываются приручать одержимость.\n\nРодившийся 25 декабря 1972 года в декоре, слишком совершенном, чтобы быть невинным — Сен-Тропе — он растёт в тени точности (отец-стоматолог, формирующий рты) и мифа: участники Сопротивления, моряки, пропавшие, семейные призраки, отказывающиеся оставаться погребёнными. В десять лет ему вручают полный арсенал живописи. Не игрушка. Первое заряженное оружие — начало барочной коллекции, коллекции безумца интимных войн.\n\nОн никогда их не вернёт. Предпочитая умножать поля сражений.\n\nОн продвигается через последовательные смещения: живопись, книги, образы, человеческие отношения — всё становится материалом, всё может быть пересобрано. То, что он строит, — не произведение в классическом смысле, а поле напряжений: между памятью и изобретением, верностью и предательством, контролем и потерей.\n\nОн не работает на институции. Он их инфильтрирует. С 90-х годов, на орбите галериста Enrico Navarra, он строит карьеру, отвергающую ярлыки: ни вполне служащий, ни вполне художник, ни просто издатель — скорее продуктивная аномалия, способная порождать книги, выставки, связи, архивы, идеи, коммуникацию, события в ритме столь же захватывающем, сколь и прерывистом. Беспорядок, служащий камуфляжем этому человеку, который методично разрушает все рамки, призванные его удержать.\n\nОн активно участвует в замысле и развитии коллекции Made By…, международного издательского проекта, посвящённого современному творчеству на разных культурных сценах. В этом контексте он тесно сотрудничает с фотографом Simon Schwyzer.\n\nЕго отношения с Simon Schwyzer — это нестабильное сердце всего: сотрудничество, ставшее зависимостью, дружба, превратившаяся в любовную систему. Пара? После жестокой смерти швейцарского фотографа Moreu отвечает: «Спросите у него». Тем не менее, после его исчезновения ничто не останавливается — напротив, всё усиливается. Работать становится способом удержать, редактировать — способом продлить, писать — способом не сдаться. Он берёт на себя обязательство сохранения и продвижения его творчества, в частности через подготовку публикации монографии Made by… Simon Schwyzer.\n\nВ 2017 году при поддержке Enrico Navarra он основал Éditions Sébastien Moreu, независимое издательство, посвящённое книгам по искусству, эссе и трансверсальным издательским проектам. Память швейцарского фотографа разрушит предприятие. Не проекты.\n\nПозже, с André Vaszkievicz, интимное снова меняет форму. I Love You Moneypenis — не декоративный проект, наложенный на их отношения: это столкновение текста, образа, желания, денег, тела. Произведение, задуманное изнутри связи, без защитного фильтра. Их брак, 19 октября 2024 года в Сен-Тропе, ничего не стабилизирует: он официально оформляет то, что уже переполнялось.\n\nЕго собственная работа — коллажи, тексты, издательские устройства — относится к эстетике выставления. Открытые газеты, вырезанные образы, память, обработанная как первичный материал. Ничто не нейтрально. Всё вовлечено.\n\nФизически он несёт тело, которое не всегда сотрудничает: быстрое сердце, капризное давление, система под давлением. И всё же он продолжает, с привычками, которые иногда напоминают вызов, иногда безразличие к последствиям. Никакого собственного нарратива искупления здесь. Только настойчивость.\n\nОн любит интенсивно, архивирует одержимо, работает компульсивно и отказывается что-либо упрощать.\n\nЕсли существует объединяющий принцип, он таков: Sébastien Moreu не разрешает свои противоречия, настолько он почитает противоречия других.\n\nСвои собственные он организует — потом живёт внутри выставки. Эта галерея — его дом, и тот, который он целиком предлагает тем, кого любит; ничего никогда не для него.\n\nВ заключение он процитировал бы Desproges: «Поразительно, не правда ли?»",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz родился 28 ноября 1990 года в Бразилии, которая мало похожа на тропические открытки. Сéбери, маленький сельский городок на юге страны, принадлежит к тем территориям, сформированным европейскими миграциями XX века: польские общины здесь, но чуть дальше немецкие, итальянские, литовские… где языки, традиции, танцы и католицизм иногда выживают с большей упорностью, чем в их странах происхождения.\n\nСын польских потомков, рождённых в Бразилии, André растёт в среде, структурированной трудом, религией, молчанием и мужскими кодами. Последний ребёнок в семье из восьми детей (с единственной сестрой), родившийся почти через десять лет после младшего из своих старших, он приходит в семью, уже отмеченную усилием, ограничениями и весом культурного наследия.\n\nЛюбимая неожиданность. Любимая, но не ожидаемая. Он будет совсем один в этой многодетной семье.\n\nОчень рано он понимает две вещи: он чувствует себя глубоко на своём месте в школе, и определённые желания не имеют места в мире, в котором он растёт.\n\nГей-подростковый период нелегко никому, нигде… но в этом сельском и консервативном контексте об этом даже не говорят. Слова не существует, и желание переживается скорее как внутреннее напряжение, чем как возможная идентичность.\n\nИтак, André учится наблюдать и молчать, контролировать свои жесты, обвинять своё тело и свои эмоции.\nОн слишком чувствителен, чтобы говорить, и слишком молчалив, чтобы быть сентиментальным. Слишком дисциплинирован, чтобы не быть раненным. Слишком желанен, чтобы любить просто. Слишком предан, чтобы доверить это.\n\nНо были книги, словари, географические карты, иностранные языки — целый почти бесконечный мир бумаги, который уже позволял ему покинуть Сéбери мысленно, прежде чем он смог сделать это физически.\n\nПосле эквивалента бакалавриата, блестящего, высшее образование тем не менее останется недоступным для его положения. André работает в Порту-Алегри, открывает немного свободы и немного себя вместе с ней, затем постепенно покидает Бразилию ради Европы и Мира. Возможно, дальше можно найти больше себя.\nОн учит английский в Ирландии, получает литовское гражданство по семейному происхождению и развивает замечательное владение языками: португальский, испанский, польский, французский, немецкий и многие другие. Большую часть времени один.\n\nЕго отношение к языкам относится столько же к академическому достижению, сколько к форме экзистенциального смещения: смена языка становится также способом сместить смущение, обмануть скуку, пересечь границы и улучшить взгляд, обращённый на самого себя.\n\nПоследующие годы долго напоминают шаткое пересечение современной Европы: вырывание корней, пандемия, постоянная реконструкция.\n\nОднако André сохраняет почти аскетическую дисциплину: спорт, постоянная интеллектуальная работа, контроль питания, никогда алкоголя и практически никаких наркотиков. Его тело, кажется, рассматривается как территория, которую нужно удерживать на ногах любой ценой.\n\nВстреча с Sébastien Moreu преобразует эту траекторию, но не стирает её ран… по крайней мере пытается смягчить их. Вместе они развивают I Love You Moneypenis, проект, смешивающий образ, желание, автобиографию и перформанс. Их брак, отпразднованный в Сен-Тропе 19 октября 2024 года, не стабилизирует хаос: он просто придаёт ему жизнеспособную и видимую форму, передышку.\n\nПараллельно André возобновляет учёбу в Sorbonne Nouvelle по лингвистике, где его результаты быстро привлекают внимание, особенно по китайскому. Он также проходит замечательную стажировку в Cours Florent. Застенчивый открывается самому себе, обнаруживает освобождающую силу выражения эмоций, которые он позволяет себе, поскольку они написаны другими. Лето 2025 года, он отправляется на университетское погружение в Тайвань; в этом году это будет Шанхай.\n\nУвлечённый астрологией и древними духовностями, занятый глубокой терапевтической работой вокруг своего опыта, André тем не менее остаётся трудным для резюмирования. Всё в нём, кажется, организовано, чтобы преобразовать раны во внутреннюю архитектуру.\n\nНо в глазах Sébastien Moreu самое волнующее находится в другом месте — самое волнующее это смотреть, как André наблюдает за полевым цветком. Потому что тогда вся механика падает — мастерство, защита, контроль — и внезапно вновь появляется нечто чрезвычайно редкое: нетронутая нежность, пережившая всё остальное.\n\nВ заключение, он, вероятно, процитировал бы Jorge Amado: «Мир стоит лишь того волнения, которое он нам даёт». или, более уверенно сегодня, Gisèle Pelicot: «Стыд должен сменить сторону».",prst:"Пресс-материалы",prss:"В подготовке",prsc:"contact@moneypenis.com",plt:"В прессе",pls:"Скоро",nt:"Контакт",ns:"Отправить",n1:"Имя",n2:"Email",n3:"Сообщение",lg:"© Sébastien Moreu · © André Vaszkievicz · Париж 2024\nISBN МФ: 978-2-492649-21-9 · ISBN БФ: 978-2-492649-20-2 · INPI № 4999735 & 4999726 · Цифровой водяной знак",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Подтверждаю под свою честную ответственность, что мне 18 лет или больше и что я являюсь совершеннолетним согласно законодательству страны моего проживания.",ck2:"Признаю, что данный сайт представляет художественные фотографические произведения откровенного характера, включая продажу оригинальных тиражей, и согласен(на) получить к ним осознанный доступ.",nat:"Слово авторов",naf:"Авторы желают предупредить, что развлекательная лёгкость названия и логотипа, как и откровенные визуальные и текстовые элементы произведений, могут создать впечатление беспечности перед тем не менее серьёзной темой. Они напоминают, что это не так и что эта сказка родилась из их личного опыта. Оба пережили все её аспекты, по разным причинам и в разные периоды.\n\nИх совместный художественный проект призван отговорить любого от вступления в подобную деятельность, предупреждая, что и сегодня: она закрывает больше дверей, чем открывает, и подвергает занимающихся ею и их близких множеству рисков. В частности, инфекциям и болезням, особенно ИППП, зависимостям от употребления наркотиков и алкоголя… Эта деятельность, в любой форме, подвергает прекарности, зависимости, социальному отторжению, насилию, шантажу, злоупотреблениям, принуждению и вымогательству.\n\nДля тех слишком немногих, кому удаётся из неё выбраться, она всегда требует очень долгосрочной психологической поддержки, настолько наши общества не оставляют им других выходов, кроме виктимизации или стыда, а то и обоих сразу.\n\nПоэтому авторы призывают к уважению и защите секс-работников. Не отрицая необходимости пенализации клиентов, они равным образом призывают к достойному обращению с эмоциональной нищетой, даже отчаянием, которые толкают их нарушать Закон. Авторы надеются, как со стороны широкой публики, так и со стороны учреждений, на бо́льшую поддержку ассоциаций, способных сопровождать тех и других.\n\nЗдесь речь ни в коем случае не о слепом снятии табу со всех практик, не больше, чем о создании скандала… Но о напоминании о срочности избавиться от общественных запретов, которые склерозируют публичные дебаты, которые тем не менее должны быть безмятежными, а не покрытыми моралистическим одеянием, которому здесь нечего делать и которое препятствует любому освобождению речи. У них нет сомнений, что если есть покрывало, которое следует отбросить, то это оно.\n\nИ под дебатами они имеют в виду первейшие из всех — те, что должны вестись внутри семьи.\n\nИ к тому же это красиво… тоже… член!\n\n(Модель, выбранная художниками, не является секс-работником. Делящий жизнь с одним из авторов, он пожелал остаться анонимным.)\n\nЕсли Авторы затронули эту тему, которая их касается, то потому, что им показалось, что в нашу эпоху форматированной коммуникации, цензуры сетей и возрождения ханжества было более чем когда-либо необходимо привнести креативную и художественную точку зрения, которая остаётся странно отсутствующей. Они хотели придать этому целому одновременно лёгкость, которая должна преобладать, когда говорят о любви и удовольствии, и тяжесть, которую налагают пережитые реальности: с мужеством и без пафоса.\n\nОни не намерены подменять собой индивидуальные выборы, как и законы, действующие в суверенных странах, как и ценности, которым каждый волен следовать.\n\nВо Франции — это не случай во всех странах, даже демократических — ответы, данные полицией и юстицией, в правовой рамке существенной борьбы с торговлей людьми, улучшались с годами в направлении того, что ожидается от современной страны. Но они делают это в общей рамке и не приносят, возможно, это не их роль, улучшения индивидуальным ситуациям, переживаемым как секс-работниками, так и их клиентами. Ассоциации скромно выполняют свои миссии, несмотря на слабость своих средств.\n\nКак для соответствующих администраций, так и для ассоциаций, существуют интернет-сайты. Некоторые очень полезные отобраны и доступны в регулярно обновляемом списке на нашем собственном интернет-сайте: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Отдельные отпечатки",siCh:"Выбрать формат",siInq:"Запросить",siNote:"Цены в евро, французский НДС включён. Упаковка, доставка и страховка по фактической стоимости.",siCont:"Для приобретения пишите на smoreu@mac.com — или через форму обратной связи",siPro:"Книготорговцам, арт-дилерам и галереям — пишите для условий, выставок и комиссионной торговли.",siRgpd:"Ваши данные будут использованы только для вашего запроса и для информирования о проектах художников.",siPick:"Коснитесь оттиска, чтобы рассмотреть и приобрести",req:"Сделать запрос",reqAge:"Этот раздел только для совершеннолетних.",shPfD:"30 × 40 см · 50 нумерованных и подписанных тиражей",shGfD:"50 × 70 см · 15 нумерованных и подписанных тиражей",shUn:"Отдельные оттиски",shUnD:"Каждый оттиск в Малом или Большом формате · подписан S.M. & A.V.",fFirstName:"Имя",fPhone:"Телефон",fCountry:"Страна",fLangPref:"Язык ответа",fPref:"Способ связи",fMatrix:"Предмет запроса",fMatrixHint:"Отметьте соответствующие поля",fMsgPh:"Уточнения (макс. 500 знаков)",fConsent:"Я принимаю указанные условия и передачу своих данных Sébastien Moreu и André Vaszkievicz.",fSent:"Запрос отправлен. Ответ придёт на указанный адрес.",fError:"Ошибка отправки. Вы можете написать напрямую на smoreu@mac.com.",rqInfo:"Информация",rqBuy:"Покупка",rqDeposit:"Комиссия",rqPro:"Профессионалы",rqColl:"Коллекционер",rqOther:"Прочее",continueShop:"Продолжить просмотр",nax:"Читать полностью ▾",nac:"Свернуть ▴",aiWarn:"ВНИМАНИЕ: ЭТОТ ПЕРЕВОД СОЗДАН ИИ И МОЖЕТ СОДЕРЖАТЬ ОШИБКИ ИЛИ НЕВЕРНЫЕ ТРАКТОВКИ",rqAcq:"Доступность и условия приобретения",rqPress:"Пресса",rqInfo2:"Общая информация",rqPro2:"Профессионалы · Реселлеры",rqOther2:"Прочее",shopPortPF:"Портфолио · Малый формат",shopPortGF:"Портфолио · Большой формат",shopSingPF:"Отдельные оттиски · Малый формат",shopSingGF:"Отдельные оттиски · Большой формат",priceLbl:"Цена с НДС",priceUnit:"с НДС",pricePer:"/ оттиск",availPort:"Номера с %F% по %T% из %N% доступны",availSingle:"Из портфолио %F%–%T% из %N%",noChoice:"Номер тиража присваивается автоматически (покупатель не выбирает)",shopFormTitle:"Подать запрос",shopFormSubtitle:"Выберите продукты и характер запроса. Наша команда оперативно ответит.",shopFmtPF:"Малый формат · 30 × 40 см",shopFmtGF:"Большой формат · 50 × 70 см",ctTitle:"Напишите нам",ctSubtitle:"Вопрос о проекте, об артистах или что-то ещё — напишите нам, мы ответим.",ctSubj:"Тема вашего сообщения",ctSubjProj:"Проект I Love You Moneypenis",ctSubjArt:"Артисты",ctSubjOther:"Другой вопрос",ctFollow:"Подпишитесь"},PL:{techs:["Wiersz · Złoty krzyż","Rękopis · Atrament granatowy · Rzeźba","Fotografia kolorowa · Żółty tekst","Odbitka srebrowo-żelatynowa · Zielony atrament odręczny","Zdjęcie kolorowe · Czerwony tekst · Krawat Hermès","Fotografia kolorowa · Rozpięte jeansy · Natura","Zdjęcie z odcieniem cyjanu · Pomarańczowy rękopis","Czerwony tekst · Cz/B · Wielojęzyczne ostrzeżenie","Rękopis · Banknoty 50€ · Dłonie","Czerwony tekst · Cz/B · Manifest","Rękopis · Kwiecisty tło · Atrament granatowy"],aw:"Treści dla dorosłych · Tylko dla świadomych odbiorców",am:"Ta strona prezentuje dzieła fotograficzne przeznaczone wyłącznie dla świadomych dorosłych.",ap:"+ 18 lat — Wersja pełna",am2:"− 18 lat — Wersja publiczna",nav:["I Love You Moneypenis","Zwiastun","Cenne Pudełka","In Situ Lubisz to","Cena Bakłażanów","Naprawdę piękne pióra…","🍆","I love you too","Tu wszystko zaczyna się od nowa","Mazaki i dłonie"],navPresse:"Tyle zaszczytów za tak mało ciała",hl:"Edycja Limitowana · Oryginalne odbitki srebrowo-żelatynowe",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paryż, 2024",hd:"Gejowska Pop Porno Bajka, dla świadomych dorosłych.\nKolekcja La Grande Librairie de Saint-Tropez®",hc:"Wejdź w dzieło",pt:"I Love You Moneypenis",ps:"11 oryginalnych odbitek srebrowo-żelatynowych · Traphot, Montrouge\nPodpisane i ponumerowane przez Sébastien Moreu & André Vaszkievicz",mg:"Kliknij, aby powiększyć",tech_info:"2024 · 30 × 40 cm (50 egz.) · 50 × 70 cm (15 egz.) · Odbitka srebrowo-żelatynowa · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 egz.) · 50 × 70 cm (15 egz.) · Druk na papierze Arches · Numerowana i podpisana ręcznie przez obu artystów",op:"Otwarcie",tx:"Tekst",pr:"Dzieło chronione · Znak wodny cyfrowy",ct:"Kaseta",cs:"Kompletne portfolio · 11 odbitek srebrowo-żelatynowych · Podpisane i ponumerowane · Rękawiczki w zestawie",zt:"In Situ",zs:"Dzieła w sytuacji",vt:"Film",vs:"Treść tylko dla świadomych dorosłych",st:"Nabyć",pft:"Mały format  30 × 40 cm",pfc:"50 portfolio ponumerowanych 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Duży format  50 × 70 cm",gfc:"15 portfolio ponumerowanych 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Podpisane S.M. & A.V. · Numer na każdej odbitce · Rękawiczki w zestawie",pd:"Traphot, Montrouge",p1:"Portfolio Mały Format · komplet",p2:"Pojedyncza odbitka · Mały Format",p3:"Portfolio Duży Format · komplet",p4:"Pojedyncza odbitka · Duży Format",sh:"Transport i ubezpieczenie",sb:"Opakowanie muzealne · DHL Express\nFrancja 45 € · Europa 95 € · Międzynarodowy 180 €\nUbezpieczenie wliczone",py:"Płatność",pb:"Przelew · Karta · PayPal · 3× bez odsetek",co:"Warunki",cb:"Certyfikat autentyczności · Zwrot 14 dni · VAT zależnie od kraju",rv:"Zarezerwować",by:"Nabyć",bt:"O piórach i dłoniach",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — który przypomina, jak swoista stylistyczna rezygnacja, że wszyscy zawsze nazywali go Sébastien — jest tym, co się dzieje, gdy dyscyplina i wola odmawiają oswojenia obsesji.\n\nUrodzony 25 grudnia 1972 w scenerii zbyt doskonałej, by była niewinna — Saint-Tropez — dorasta w cieniu precyzji (ojciec dentysta kształtujący usta) i mitu: ruchu oporu, marynarzy, zaginionych, rodzinnych duchów, które odmawiają pozostania pogrzebanymi. W wieku dziesięciu lat otrzymuje pełen arsenał malarski. Nie zabawkę. Pierwszą naładowaną broń — początek barokowej kolekcji, kolekcji szaleńca intymnych wojen.\n\nNigdy ich nie zwróci. Wolał mnożyć swoje pola bitwy.\n\nPosuwa się przez kolejne przemieszczenia: malarstwo, książki, obrazy, relacje międzyludzkie — wszystko staje się materiałem, wszystko można złożyć na nowo. To, co buduje, nie jest dziełem w klasycznym sensie, lecz polem napięć: między pamięcią a wymysłem, wiernością a zdradą, kontrolą a stratą.\n\nNie pracuje dla instytucji. Infiltruje je. Od lat 90. w orbicie galernika Enrico Navarra buduje karierę odrzucającą etykiety: ani całkiem pracownik, ani całkiem artysta, ani zwykły wydawca — raczej produktywna anomalia, zdolna generować książki, wystawy, więzi, archiwa, idee, komunikację, wydarzenia w tempie zarówno zapierającym dech, jak i nieciągłym. Nieporządek służący za kamuflaż temu człowiekowi, który metodycznie niszczy wszelkie ramy mające go ograniczać.\n\nAktywnie uczestniczy w koncepcji i rozwoju kolekcji Made By…, międzynarodowego projektu wydawniczego poświęconego współczesnej twórczości na różnych scenach kulturowych. W tym kontekście blisko współpracuje z fotografem Simon Schwyzer.\n\nJego relacja z Simon Schwyzer jest niestabilnym sercem całości: współpraca, która stała się zależnością, przyjaźń przekształcona w system miłosny. Para? Od brutalnej śmierci szwajcarskiego fotografa Moreu odpowiada: „Zapytaj go”. Niemniej, po jego zniknięciu nic się nie zatrzymuje — wręcz przeciwnie, wszystko się intensyfikuje. Praca staje się sposobem na zatrzymanie, edytowanie sposobem na przedłużenie, pisanie sposobem na to, by się nie poddać. Angażuje się w zachowanie i promocję jego twórczości, m.in. poprzez przygotowanie publikacji monografii Made by… Simon Schwyzer.\n\nW 2017 r., przy wsparciu Enrico Navarra, założył Éditions Sébastien Moreu, niezależne wydawnictwo poświęcone książkom o sztuce, esejom i transwersalnym projektom wydawniczym. Pamięć szwajcarskiego fotografa zniszczy przedsiębiorstwo. Nie projekty.\n\nPóźniej, z André Vaszkievicz, intymne znów zmienia formę. I Love You Moneypenis nie jest dekoracyjnym projektem nałożonym na ich relację: jest zderzeniem tekstu, obrazu, pragnienia, pieniędzy, ciała. Dziełem pomyślanym wewnątrz więzi, bez ochronnego filtra. Ich małżeństwo, 19 października 2024 r. w Saint-Tropez, nic nie stabilizuje: nadaje oficjalny charakter temu, co już się rozlewało.\n\nJego własna praca — kolaże, teksty, urządzenia wydawnicze — należy do estetyki ekspozycji. Otwarte gazety, wycięte obrazy, pamięć traktowana jak surowiec. Nic nie jest neutralne. Wszystko jest zaangażowane.\n\nFizycznie nosi ciało, które nie zawsze współpracuje: szybkie serce, kapryśne ciśnienie, system pod presją. A jednak kontynuuje, z nawykami przypominającymi czasem wyzwanie, czasem obojętność wobec konsekwencji. Brak tu właściwej narracji odkupienia. Tylko wytrwałość.\n\nKocha intensywnie, archiwizuje obsesyjnie, pracuje kompulsywnie i odmawia upraszczania czegokolwiek.\n\nJeśli istnieje zasada jednocząca, to ta: Sébastien Moreu nie rozwiązuje swoich sprzeczności, tak bardzo czci sprzeczności innych.\n\nSwoje organizuje — następnie żyje w środku wystawy. Ta galeria jest jego domem i tym, który ofiarowuje w całości tym, których kocha; nic nigdy nie jest dla niego.\n\nNa zakończenie zacytowałby Desproges'a: „Zaskakujące, prawda?”",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz urodził się 28 listopada 1990 r. w Brazylii niewiele przypominającej tropikalne pocztówki. Seberi, małe wiejskie miasteczko na południu kraju, należy do tych terytoriów ukształtowanych przez europejskie migracje XX wieku: społeczności polskie tutaj, ale nieco dalej niemieckie, włoskie, litewskie… gdzie języki, tradycje, tańce i katolicyzm przetrwały czasem z większym uporem niż w krajach ich pochodzenia.\n\nSyn polskich potomków urodzonych w Brazylii, André dorasta w środowisku ustrukturyzowanym przez pracę, religię, milczenia i męskie kody. Najmłodsze dziecko z ośmiorga rodzeństwa (z jedyną siostrą), urodzony niemal dziesięć lat po najmłodszym z jego starszych, przychodzi do rodziny już naznaczonej wysiłkiem, ograniczeniami i ciężarem dziedzictwa kulturowego.\n\nUkochana niespodzianka. Ukochana, ale nieoczekiwana. Będzie zupełnie sam w tej wielodzietnej rodzinie.\n\nBardzo wcześnie rozumie dwie rzeczy: czuje się głęboko na swoim miejscu w szkole, a pewne pragnienia nie mają miejsca w świecie, w którym dorasta.\n\nGejowskie dorastanie nie jest łatwe dla nikogo, nigdzie… ale w tym wiejskim i konserwatywnym kontekście nie ma o tym nawet mowy. Słowo nie istnieje, a pragnienie jest przeżywane bardziej jako wewnętrzne napięcie niż jako możliwa tożsamość.\n\nAndré uczy się więc obserwować i milczeć, kontrolować swoje gesty, obwiniać swoje ciało i emocje.\nJest zbyt wrażliwy, by mówić, i zbyt milczący, by być sentymentalnym. Zbyt zdyscyplinowany, by nie być zranionym. Zbyt pożądany, by kochać po prostu. Zbyt zdradzony, by się tym zwierzyć.\n\nAle były książki, słowniki, mapy geograficzne, języki obce — cały niemal nieskończony świat papieru, który już pozwalał mu opuścić Seberi mentalnie, zanim mógł to zrobić fizycznie.\n\nPo odpowiedniku matury, świetnej, studia wyższe pozostaną jednak niedostępne dla jego sytuacji. André pracuje w Porto Alegre, odkrywa trochę wolności i trochę siebie wraz z nią, następnie stopniowo opuszcza Brazylię na rzecz Europy i Świata. Może dalej można znaleźć więcej siebie.\nUczy się angielskiego w Irlandii, otrzymuje obywatelstwo litewskie przez pochodzenie rodzinne i rozwija godne uwagi opanowanie języków: portugalskiego, hiszpańskiego, polskiego, francuskiego, niemieckiego i kilku innych jeszcze. Większość czasu sam.\n\nJego stosunek do języków dotyczy zarówno osiągnięcia akademickiego, co formy egzystencjalnego przemieszczenia: zmiana języka staje się także sposobem na przemieszczenie zażenowania, oszukanie nudy, przekraczanie granic i poprawę spojrzenia, jakim obdarza samego siebie.\n\nLata następne długo przypominają niepewne przemierzanie współczesnej Europy: wykorzenienie, pandemia, ciągła odbudowa.\n\nA jednak André zachowuje niemal ascetyczną dyscyplinę: sport, stała praca intelektualna, kontrola żywieniowa, nigdy alkoholu i praktycznie żadnych narkotyków. Jego ciało wydaje się traktowane jako terytorium, które trzeba utrzymać na nogach za wszelką cenę.\n\nSpotkanie z Sébastien Moreu przekształca tę trajektorię, ale nie wymazuje jej ran… przynajmniej próbuje je złagodzić. Razem rozwijają I Love You Moneypenis, projekt mieszający obraz, pragnienie, autobiografię i performance. Ich małżeństwo, świętowane w Saint-Tropez 19 października 2024 r., nie stabilizuje chaosu: po prostu nadaje mu żywotną i widoczną formę, wytchnienie.\n\nRównolegle André wznawia studia w Sorbonne Nouvelle z nauk o języku, gdzie jego wyniki szybko przyciągają uwagę, zwłaszcza z chińskiego. Odbywa również zauważony staż w Cours Florent. Nieśmiały odkrywa się przed sobą samym, odkrywa wyzwalającą siłę wyrażania emocji, na które sobie pozwala, bo są napisane przez innych. Lato 2025 r., wyjeżdża na uniwersyteckie zanurzenie na Tajwan; w tym roku to będzie Szanghaj.\n\nZafascynowany astrologią i starożytnymi duchowościami, zaangażowany w głęboką pracę terapeutyczną wokół swojego doświadczenia, André pozostaje jednak trudny do streszczenia. Wszystko w nim wydaje się zorganizowane, by przekształcać rany w wewnętrzną architekturę.\n\nAle w oczach Sébastien Moreu to, co najbardziej wzruszające, jest gdzie indziej — to najbardziej wzruszające jest patrzeć, jak André obserwuje polny kwiat. Bo wtedy cała mechanika upada — mistrzostwo, obrona, kontrola — i nagle pojawia się ponownie coś niezwykle rzadkiego: nienaruszona łagodność, która przetrwała wszystko inne.\n\nNa zakończenie cytowałby zapewne Jorge Amado: „Świat wart jest tylko tej emocji, którą nam daje”. lub bardziej z pewnością dzisiaj Gisèle Pelicot: „Wstyd musi zmienić stronę”.",prst:"Materiały prasowe",prss:"W przygotowaniu",prsc:"contact@moneypenis.com",plt:"W mediach",pls:"Wkrótce",nt:"Kontakt",ns:"Wyślij",n1:"Nazwisko",n2:"Email",n3:"Wiadomość",lg:"© Sébastien Moreu · © André Vaszkievicz · Paryż 2024\nISBN MF: 978-2-492649-21-9 · ISBN DF: 978-2-492649-20-2 · INPI nr 4999735 & 4999726 · Cyfrowy znak wodny",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Oświadczam na własną odpowiedzialność, że mam ukończone 18 lat i jestem osobą pełnoletnią zgodnie z prawem kraju mojego zamieszkania.",ck2:"Przyjmuję do wiadomości, że ta strona prezentuje artystyczne dzieła fotograficzne o charakterze jawnym, w tym sprzedaż oryginalnych odbitek, i wyrażam świadomą zgodę na dostęp.",nat:"Słowo od autorów",naf:"Autorzy pragną ostrzec, że rozrywkowa lekkość tytułu i logo, podobnie jak wprost wyrażone obrazy i teksty dzieł, mogą sprawiać wrażenie nonszalancji wobec tematu jednak poważnego. Przypominają, że tak nie jest i że ta opowieść narodziła się z ich osobistych doświadczeń. Obaj, z różnych powodów i w różnych epokach, przeżyli wszystkie jej aspekty.\n\nIch wspólny projekt artystyczny ma na celu odwiedzenie kogokolwiek od angażowania się w działalność, ostrzegając, że nawet dzisiaj: zamyka więcej drzwi niż otwiera i naraża na wiele ryzyk tych, którzy ją praktykują, oraz ich bliskich. W szczególności zakażenia i choroby, zwłaszcza STI, uzależnienia od używania narkotyków i alkoholu… Ta działalność, w jakiejkolwiek formie, naraża na prekarność, zależność, odrzucenie społeczne, przemoc, szantaż, nadużycia, przymus i wymuszenia.\n\nDla zbyt nielicznych, którym udaje się z niej wyjść, zawsze wymaga ona bardzo długoterminowego wsparcia psychologicznego, tak bardzo nasze społeczeństwa nie pozostawiają im innych wyjść niż wiktymizacja lub wstyd, a nawet oba naraz.\n\nAutorzy wzywają zatem do szacunku i ochrony pracowników i pracowniczek seksualnych. Nie negując konieczności penalizacji klientów, wzywają jednocześnie do godnego traktowania nędzy uczuciowej, a nawet rozpaczy, która prowadzi ich do łamania Prawa. Autorzy mają nadzieję, ze strony zarówno opinii publicznej, jak i instytucji, na większe wsparcie dla stowarzyszeń, które mogą towarzyszyć jednym i drugim.\n\nNie chodzi tu w żadnym wypadku o ślepe zniesienie tabu wobec wszystkich praktyk, ani o wywołanie skandalu… Lecz o przypomnienie pilnej potrzeby pozbycia się społecznych zakazów, które unieruchamiają publiczną debatę, która jednak powinna być spokojna, a nie przyodziana w moralistyczną szatę, która nie ma tam miejsca i uniemożliwia jakiekolwiek wyzwolenie słowa. Nie mają wątpliwości, że jeśli istnieje zasłona do zerwania, to właśnie ta.\n\nA przez debatę rozumieją przywołanie tej pierwszej ze wszystkich, tej, która powinna toczyć się w łonie rodziny.\n\nA poza tym to jest piękne… także… kutas !\n\n(Model wybrany przez artystów nie jest pracownikiem seksualnym. Dzieląc życie z jednym z autorów, postanowił pozostać anonimowy.)\n\nJeśli Autorzy poruszyli ten temat, który ich dotyczy, to dlatego, że wydało im się, że w naszej epoce sformatowanej komunikacji, cenzury sieci i renesansu pruderii, bardziej niż kiedykolwiek konieczne było wniesienie kreatywnego i artystycznego punktu widzenia, który pozostaje dziwnie nieobecny. Chcieli nadać tej całości zarówno lekkość, która powinna przeważać, gdy mówi się o miłości i przyjemności, jak i ciężar narzucany przez przeżyte rzeczywistości: z odwagą i bez patosu.\n\nNie zamierzają zastępować wyborów indywidualnych, ani praw obowiązujących w suwerennych krajach, ani wartości, do których każdy może swobodnie się przyznawać.\n\nWe Francji — to nie jest przypadek we wszystkich krajach, nawet demokratycznych — odpowiedzi udzielane przez policję i wymiar sprawiedliwości, w ramach prawnych walki istotnej z handlem ludźmi, poprawiły się z biegiem lat w kierunku tego, czego oczekuje się od kraju nowoczesnego. Ale czynią to w ramach aspektu ogólnego i nie wnoszą, być może to nie ich rola, poprawy do indywidualnych sytuacji przeżywanych zarówno przez pracowników seksualnych, jak i ich klientów. Stowarzyszenia dyskretnie wypełniają swoje misje pomimo słabości swoich środków.\n\nZarówno dla zainteresowanych administracji, jak i dla stowarzyszeń, istnieją strony internetowe. Niektóre bardzo użyteczne są wybrane i dostępne na regularnie aktualizowanej liście na naszej własnej stronie internetowej: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Pojedyncze odbitki",siCh:"Wybrać format",siInq:"Zapytać",siNote:"Ceny w euro, francuski VAT wliczony. Opakowanie, wysyłka i ubezpieczenie po koszcie własnym.",siCont:"Aby nabyć, napisz do smoreu@mac.com — lub przez formularz kontaktowy",siPro:"Księgarze, marszandzi i galerie — napiszcie do nas w sprawie warunków handlowych, wystaw i depozytów.",siRgpd:"Twoje dane będą wykorzystane wyłącznie do Twojego zapytania oraz informacji o projektach artystów.",siPick:"Dotknij grafiki, by ją obejrzeć i nabyć",req:"Złożyć zapytanie",reqAge:"Ta sekcja jest zarezerwowana dla osób pełnoletnich.",shPfD:"30 × 40 cm · 50 numerowanych i sygnowanych egzemplarzy",shGfD:"50 × 70 cm · 15 numerowanych i sygnowanych egzemplarzy",shUn:"Pojedyncze odbitki",shUnD:"Każda odbitka dostępna w Małym lub Dużym Formacie · sygnowana S.M. & A.V.",fFirstName:"Imię",fPhone:"Telefon",fCountry:"Kraj",fLangPref:"Język odpowiedzi",fPref:"Preferencja kontaktu",fMatrix:"Przedmiot zapytania",fMatrixHint:"Zaznacz odpowiednie pola",fMsgPh:"Szczegóły (maks. 500 znaków)",fConsent:"Akceptuję powyższe warunki i przekazanie moich danych Sébastien Moreu i André Vaszkievicz.",fSent:"Zapytanie wysłane. Odpowiedź otrzymasz na podany adres.",fError:"Wysyłka nie powiodła się. Możesz napisać bezpośrednio na smoreu@mac.com.",rqInfo:"Informacja",rqBuy:"Zakup",rqDeposit:"Depozyt",rqPro:"Handel",rqColl:"Kolekcjoner",rqOther:"Inne",continueShop:"Kontynuuj przeglądanie",nax:"Przeczytaj całość ▾",nac:"Zwiń ▴",aiWarn:"UWAGA: TO TŁUMACZENIE ZOSTAŁO WYGENEROWANE PRZEZ AI I MOŻE ZAWIERAĆ BŁĘDY LUB NIEPRAWIDŁOWE INTERPRETACJE",rqAcq:"Dostępność i warunki nabycia",rqPress:"Prasa",rqInfo2:"Informacje ogólne",rqPro2:"Profesjonaliści · Dystrybutorzy",rqOther2:"Inne",shopPortPF:"Portfolio · Mały Format",shopPortGF:"Portfolio · Duży Format",shopSingPF:"Pojedyncze odbitki · Mały Format",shopSingGF:"Pojedyncze odbitki · Duży Format",priceLbl:"Cena brutto",priceUnit:"brutto",pricePer:"/ odbitka",availPort:"Numery %F%–%T% z %N% dostępne",availSingle:"Z portfolio %F%–%T% z %N%",noChoice:"Numer odbitki przydzielany automatycznie (nie do wyboru przez kupującego)",shopFormTitle:"Złóż zapytanie",shopFormSubtitle:"Wybierz produkty i charakter zapytania. Nasz zespół szybko odpowie.",shopFmtPF:"Mały Format · 30 × 40 cm",shopFmtGF:"Duży Format · 50 × 70 cm",ctTitle:"Napisz do nas",ctSubtitle:"Pytanie o projekt, o artystów lub coś innego — napisz, odpowiemy.",ctSubj:"Temat wiadomości",ctSubjProj:"Projekt I Love You Moneypenis",ctSubjArt:"Artyści",ctSubjOther:"Inne pytanie",ctFollow:"Obserwuj nas"},NL:{aw:"Expliciete Inhoud · Voor Geïnformeerde Volwassenen",am:"Deze website toont fotografische werken bestemd voor geïnformeerde volwassenen.",ap:"+ 18 jaar — Volledige versie",am2:"− 18 jaar — Algemene versie",nav:["I Love You Moneypenis","De Teaser","De Kostbare Cassettes","In Situ vind je dat leuk","De prijs der aubergines","Werkelijk fraaie pennen…","🍆","I love you too","Hier begint alles opnieuw","Van stiften en handen"],navPresse:"Te veel eer voor zo weinig vlees",hl:"Beperkte Editie · Originele zilvergelatineprints",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Parijs, 2024",hd:"Een Gay Pop Porn Sprookje, voor geïnformeerde volwassenen.\nCollectie La Grande Librairie de Saint-Tropez®",hc:"Het werk betreden",pt:"I Love You Moneypenis",ps:"11 originele zilvergelatineprints · Traphot, Montrouge\nGesigneerd en genummerd door Sébastien Moreu & André Vaszkievicz",mg:"Klik om te vergroten",tech_info:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Zilvergelatineprint · Traphot, Montrouge",pl0:"2024 · 30 × 40 cm (50 ex.) · 50 × 70 cm (15 ex.) · Druk op Arches papier · Handmatig genummerd en gesigneerd door beide kunstenaars",op:"Opening",tx:"Tekst",pr:"Beschermd werk · Digitaal watermerk",ct:"De Box",cs:"Volledig portfolio · 11 zilvergelatineprints · Gesigneerd & genummerd · Handschoenen inbegrepen",zt:"In Situ",zs:"De werken in situatie",vt:"Film",vs:"Inhoud voor geïnformeerde volwassenen",st:"Verwerven",pft:"Klein formaat  30 × 40 cm",pfc:"50 portfolio's genummerd 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Groot formaat  50 × 70 cm",gfc:"15 portfolio's genummerd 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Gesigneerd S.M. & A.V. · Nummer op elke print · Handschoenen inbegrepen",pd:"Traphot, Montrouge",p1:"Portfolio Klein Formaat · volledig",p2:"Losse prent · Klein Formaat",p3:"Portfolio Groot Formaat · volledig",p4:"Losse prent · Groot Formaat",sh:"Verzending & Verzekering",sb:"Museale verpakking · DHL Express\nFrankrijk 45 € · Europa 95 € · Internationaal 180 €\nVerzekering inbegrepen",py:"Betaling",pb:"Bankoverschrijving · Kaart · PayPal · 3× renteloos",co:"Voorwaarden",cb:"Echtheidscertificaat · 14 dagen retour · BTW per land",rv:"Reserveren",by:"Verwerven",bt:"Van veren & handen",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — die ons eraan herinnert, als een soort stilistische berusting, dat iedereen hem altijd Sébastien heeft genoemd — is wat gebeurt wanneer discipline en wil weigeren obsessie te temmen.\n\nGeboren op 25 december 1972 in een decor te perfect om onschuldig te zijn — Saint-Tropez — groeit hij op in de schaduw van precisie (een vader-tandarts die monden vormt) en mythe: verzetsstrijders, zeelieden, vermisten, familie-spoken die weigeren begraven te blijven. Op zijn tiende krijgt hij een compleet schildersarsenaal. Geen speelgoed. Een eerste geladen wapen — het begin van een barokke collectie, die van een dolzinnige van intieme oorlogen.\n\nHij zal ze nooit teruggeven. Liever zijn slagvelden vermenigvuldigen.\n\nHij vordert via opeenvolgende verschuivingen: schilderkunst, boeken, beelden, menselijke relaties — alles wordt materiaal, alles kan opnieuw worden samengesteld. Wat hij bouwt is geen werk in klassieke zin, maar een veld van spanningen: tussen geheugen en uitvinding, trouw en verraad, controle en verlies.\n\nHij werkt niet voor instellingen. Hij infiltreert ze. Sinds de jaren 90, in de baan van galeriehouder Enrico Navarra, bouwt hij een carrière die etiketten verwerpt: niet helemaal werknemer, niet helemaal kunstenaar, geen gewone uitgever — eerder een productieve anomalie, in staat om boeken, tentoonstellingen, banden, archieven, ideeën, communicatie en evenementen te genereren in een tempo dat zowel adembenemend als discontinu is. Een wanorde die als camouflage dient voor deze man die methodisch elk kader vernietigt dat hem zou moeten bevatten.\n\nHij neemt actief deel aan de conceptie en ontwikkeling van de Made By… collectie, een internationaal redactioneel project gewijd aan hedendaagse creatie op verschillende culturele podia. In deze context werkt hij nauw samen met fotograaf Simon Schwyzer.\n\nZijn relatie met Simon Schwyzer is het onstabiele hart hiervan: een samenwerking die afhankelijkheid werd, een vriendschap die in een liefdessysteem veranderde. Een koppel? Sinds de brute dood van de Zwitserse fotograaf antwoordt Moreu: „Vraag het hem.\" Toch stopt na zijn verdwijning niets — integendeel, alles intensiveert. Werken wordt een manier om vast te houden, redigeren een manier om te verlengen, schrijven een manier om niet toe te geven. Hij verbindt zich aan het behoud en de promotie van zijn werk, met name door de voorbereiding van de publicatie van de monografie Made by… Simon Schwyzer.\n\nIn 2017, met de steun van Enrico Navarra, richtte hij Éditions Sébastien Moreu op, een onafhankelijke uitgeverij gewijd aan kunstboeken, essays en transversale redactionele projecten. De herinnering aan de Zwitserse fotograaf zal het bedrijf vernietigen. Niet de projecten.\n\nLater, met André Vaszkievicz, verandert het intieme weer van vorm. I Love You Moneypenis is geen decoratief project dat op hun relatie is gelegd: het is een botsing van tekst, beeld, verlangen, geld, lichaam. Een werk bedacht vanuit de binnenkant van de band, zonder beschermend filter. Hun huwelijk, op 19 oktober 2024 in Saint-Tropez, stabiliseert niets: het maakt officieel wat al overstroomde.\n\nZijn eigen werk — collages, teksten, redactionele apparaten — behoort tot een esthetiek van blootstelling. Open kranten, uitgeknipte beelden, geheugen behandeld als grondstof. Niets is neutraal. Alles is betrokken.\n\nFysiek draagt hij een lichaam dat niet altijd meewerkt: snelle hartslag, grillige bloeddruk, systeem onder druk. En toch gaat hij door, met gewoontes die soms op uitdaging lijken, soms op onverschilligheid voor de gevolgen. Geen eigen verlossingsverhaal hier. Alleen volharding.\n\nHij houdt intens van, archiveert obsessief, werkt compulsief en weigert iets te vereenvoudigen.\n\nAls er een verenigend principe bestaat, is het dit: Sébastien Moreu lost zijn tegenstrijdigheden niet op, zozeer vereert hij die van anderen.\n\nDe zijne organiseert hij — leeft dan binnen de tentoonstelling. Deze galerij is zijn thuis en degene die hij volledig aanbiedt aan wie hij liefheeft; niets is ooit voor hemzelf.\n\nTer afsluiting zou hij Desproges citeren: „Verbazingwekkend, nietwaar?\"",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz werd geboren op 28 november 1990 in een Brazilië dat weinig lijkt op tropische ansichtkaarten. Seberi, een klein landelijk stadje in het zuiden van het land, behoort tot die gebieden gevormd door de Europese migraties van de twintigste eeuw: hier Poolse gemeenschappen, maar iets verder Duitse, Italiaanse, Litouwse… waar talen, tradities, dansen en katholicisme soms met meer koppigheid overleven dan in hun landen van herkomst.\n\nZoon van Poolse afstammelingen geboren in Brazilië, groeit André op in een omgeving gestructureerd door werk, religie, stiltes en mannelijke codes. Het jongste kind van acht broers en zussen (met slechts één zus), bijna tien jaar na de jongste van zijn oudere broers geboren, komt hij in een gezin reeds gemerkt door inspanning, beperkingen en het gewicht van culturele erfenissen.\n\nEen geliefde onverwachte. Geliefd maar niet verwacht. Hij zal heel alleen zijn in dit grote gezin.\n\nZeer vroeg begrijpt hij twee dingen: hij voelt zich diep op zijn plaats op school, en bepaalde verlangens hebben geen plaats in de wereld waarin hij opgroeit.\n\nDe gay-adolescentie is voor niemand gemakkelijk, nergens… maar in deze landelijke en conservatieve context is er zelfs geen sprake van. Het woord bestaat niet en verlangen wordt meer ervaren als een innerlijke spanning dan als een mogelijke identiteit.\n\nDus leert André observeren en zwijgen, zijn gebaren te controleren, zijn lichaam en zijn emoties de schuld te geven.\nHij is te gevoelig om te spreken en te zwijgzaam om sentimenteel te zijn. Te gedisciplineerd om niet gewond te raken. Te begeerd om eenvoudig lief te hebben. Te verraden om het toe te vertrouwen.\n\nMaar er waren de boeken, de woordenboeken, de geografische kaarten, de vreemde talen — een hele bijna oneindige wereld van papier die hem al toestond Seberi mentaal te verlaten voordat hij dat fysiek kon.\n\nNa het equivalent van het eindexamen, briljant, zou hoger onderwijs niettemin ontoegankelijk blijven voor zijn situatie. André werkt in Porto Alegre, ontdekt een beetje vrijheid en een beetje van zichzelf erbij, dan verlaat hij Brazilië geleidelijk voor Europa en de Wereld. Misschien kan men verder weg meer van zichzelf vinden.\nHij leert Engels in Ierland, verkrijgt de Litouwse nationaliteit via familiale afkomst en ontwikkelt een opmerkelijke beheersing van talen: Portugees, Spaans, Pools, Frans, Duits en nog verschillende andere. Het grootste deel van de tijd alleen.\n\nZijn verhouding met talen behoort evenzeer tot academische prestatie als tot een vorm van existentiële verschuiving: van taal veranderen wordt ook een manier om ongemak te verplaatsen, verveling te bedriegen, grenzen te overschrijden en de blik die hij op zichzelf werpt te verbeteren.\n\nDe volgende jaren lijken lang op een precair doorkruisen van het hedendaagse Europa: ontworteling, pandemie, permanente reconstructie.\n\nToch behoudt André een bijna ascetische discipline: sport, constant intellectueel werk, voedingscontrole, nooit alcohol, en praktisch geen drugs. Zijn lichaam lijkt behandeld te worden als een gebied dat tegen elke prijs overeind moet blijven.\n\nDe ontmoeting met Sébastien Moreu transformeert dit traject maar wist de wonden niet uit… probeert ze tenminste te verzachten. Samen ontwikkelen ze I Love You Moneypenis, een project dat beeld, verlangen, autobiografie en performance mengt. Hun huwelijk, gevierd in Saint-Tropez op 19 oktober 2024, stabiliseert de chaos niet: het geeft het simpelweg een leefbare en zichtbare vorm, een respijt.\n\nParallel hervat André zijn studie aan de Sorbonne Nouvelle in taalwetenschappen, waar zijn resultaten snel de aandacht trekken, met name in het Chinees. Hij doet ook een opgemerkte stage aan het Cours Florent. De verlegene onthult zich aan zichzelf, ontdekt de bevrijdende kracht van het uitdrukken van emoties die hij zichzelf toestaat omdat ze door anderen geschreven zijn. Zomer 2025, vertrekt hij voor een universitaire onderdompeling in Taiwan; dit jaar zal het Shanghai zijn.\n\nGepassioneerd door astrologie en oude spiritualiteiten, betrokken bij diep therapeutisch werk rond zijn ervaring, blijft André toch moeilijk samen te vatten. Alles aan hem lijkt georganiseerd om wonden in innerlijke architectuur om te zetten.\n\nMaar in de ogen van Sébastien Moreu bevindt het ontroerendste zich elders — het ontroerendste is André een wilde bloem te zien observeren. Want dan valt alle mechaniek — de beheersing, de verdediging, de controle — en herrijst plotseling iets uiterst zeldzaams: een onaangetaste zachtheid die al het andere heeft overleefd.\n\nTer afsluiting zou hij waarschijnlijk Jorge Amado citeren: „De wereld is alleen waard wat de emotie is die hij ons geeft.\" of meer zeker vandaag Gisèle Pelicot: „De schaamte moet van kamp veranderen.\"",prst:"Persmateriaal",prss:"In voorbereiding",prsc:"contact@moneypenis.com",plt:"In de pers",pls:"Binnenkort",nt:"Contact",ns:"Versturen",n1:"Naam",n2:"Email",n3:"Bericht",lg:"© Sébastien Moreu · © André Vaszkievicz · Parijs 2024\nISBN KF: 978-2-492649-21-9 · ISBN GF: 978-2-492649-20-2 · INPI nr 4999735 & 4999726 · Digitaal watermerk",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Ik verklaar op mijn eer 18 jaar of ouder te zijn en meerderjarig volgens de wetgeving van mijn land van verblijf.",ck2:"Ik erken dat deze site artistieke fotografische werken van expliciete aard presenteert, inclusief de verkoop van originele prints, en ik stem ermee in deze met volledige kennis te bezoeken.",nat:"Noot van de auteurs",naf:"De Auteurs willen waarschuwen dat de vermakelijke lichtheid van de titel en het logo, evenals de expliciete beelden en teksten van de werken, een indruk van zorgeloosheid kunnen wekken tegenover een nochtans ernstig onderwerp. Zij herinneren eraan dat dit niet het geval is en dat dit verhaal voortkomt uit hun persoonlijke ervaringen. Beiden hebben, om verschillende redenen en in verschillende tijden, alle aspecten ervan beleefd.\n\nHun gezamenlijk artistiek project heeft tot doel iemand te ontmoedigen om aan zo'n activiteit deel te nemen, door te waarschuwen dat nog steeds vandaag: het meer deuren sluit dan opent en degenen die het beoefenen en hun naasten blootstelt aan een groot aantal risico's. Met name infecties en ziekten, in het bijzonder SOA's, verslavingen aan drugs- en alcoholgebruik… Deze activiteit, in welke vorm dan ook, stelt bloot aan precariteit, afhankelijkheid, sociale afwijzing, geweld, chantage, misbruik, dwang en afpersing.\n\nVoor de te weinigen die erin slagen er uit te komen, vereist het altijd een zeer langdurige psychologische begeleiding, zozeer laten onze samenlevingen hen geen andere uitwegen dan slachtofferschap of schaamte, soms beide tegelijk.\n\nDe auteurs roepen daarom op tot respect voor en bescherming van sekswerkers. Zonder de noodzaak van bestraffing van klanten te ontkennen, roepen zij eveneens op tot een waardige behandeling van de emotionele ellende, zelfs nood, die hen ertoe brengt de Wet te overtreden. De auteurs hopen, zowel van het grote publiek als van instellingen, op meer steun aan verenigingen die beiden kunnen begeleiden.\n\nHet gaat hier in geen geval om het blindelings opheffen van taboes op alle praktijken, evenmin om schandaal te maken… Maar om de urgentie te herinneren ons te ontdoen van de maatschappelijke verboden die een publiek debat verstarren dat nochtans sereen zou moeten zijn, en niet bedekt met een moralistisch gewaad dat daar niets te zoeken heeft en elke bevrijding van het woord verhindert. Zij twijfelen er niet aan dat als er een sluier af moet, het deze is.\n\nEn met debat bedoelen zij het eerste van allen op te roepen, datgene dat binnen het gezin gevoerd zou moeten worden.\n\nEn dan is het ook mooi… een pik!\n\n(Het model gekozen door de kunstenaars is geen sekswerker. Hij deelt zijn leven met een van de auteurs en heeft erop gestaan anoniem te blijven.)\n\nAls de Auteurs dit onderwerp dat hen raakt hebben aangesneden, is dat omdat het hen leek dat in onze tijd van geformatteerde communicatie, netwerkcensuur en heropleving van preutsheid, het meer dan ooit noodzakelijk was een creatief en artistiek standpunt aan te brengen dat vreemd afwezig blijft. Zij wilden aan dit geheel zowel de lichtheid geven die zou moeten overheersen wanneer men over liefde en plezier spreekt, als het gewicht dat doorleefde realiteiten opleggen: met moed en zonder pathos.\n\nZij beogen niet zich in de plaats te stellen van individuele keuzes, evenmin van de geldende wetten in soevereine landen of de waarden waaraan eenieder vrij is zich te verbinden.\n\nIn Frankrijk — dat is niet het geval in alle landen, zelfs democratische — zijn de antwoorden gegeven door politie en justitie, binnen het wettelijke kader van een essentiële strijd tegen mensenhandel, met de jaren verbeterd in de richting van wat men van een modern land verwacht. Maar zij doen dit binnen het algemene kader en brengen, misschien is het niet hun rol, geen verbetering aan de individuele situaties beleefd zowel door sekswerkers als door hun klanten. Verenigingen vervullen hun missies discreet ondanks de zwakte van hun middelen.\n\nZowel voor de betrokken administraties als voor de verenigingen bestaan er websites. Sommige zeer nuttige zijn geselecteerd en beschikbaar op een regelmatig bijgewerkte lijst op onze eigen website: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Losse prints",siCh:"Formaat kiezen",siInq:"Aanvragen",siNote:"Prijzen in euro, Franse btw inbegrepen. Verpakking, verzending en verzekering tegen kostprijs.",siCont:"Om aan te schaffen, schrijf naar smoreu@mac.com — of via het contactformulier",siPro:"Boekhandelaren, kunsthandelaren en galerieën — schrijf ons voor handelsvoorwaarden, tentoonstellingen en consignaties.",siRgpd:"Uw gegevens worden alleen gebruikt voor uw aanvraag en voor nieuws over de projecten van de kunstenaars.",siPick:"Tik op een prent om hem te bekijken en aan te schaffen",req:"Een verzoek indienen",reqAge:"Deze sectie is voorbehouden aan meerderjarigen.",shPfD:"30 × 40 cm · 50 genummerde en gesigneerde edities",shGfD:"50 × 70 cm · 15 genummerde en gesigneerde edities",shUn:"Losse prenten",shUnD:"Elke prent verkrijgbaar in Klein of Groot Formaat · gesigneerd S.M. & A.V.",fFirstName:"Voornaam",fPhone:"Telefoon",fCountry:"Land",fLangPref:"Antwoordtaal",fPref:"Contactvoorkeur",fMatrix:"Onderwerp van uw aanvraag",fMatrixHint:"Vink de relevante vakjes aan",fMsgPh:"Toelichting (max. 500 tekens)",fConsent:"Ik aanvaard de bovenstaande voorwaarden en de overdracht van mijn gegevens aan Sébastien Moreu en André Vaszkievicz.",fSent:"Aanvraag verstuurd. U ontvangt een antwoord op het opgegeven adres.",fError:"Verzending mislukt. U kunt rechtstreeks schrijven naar smoreu@mac.com.",rqInfo:"Informatie",rqBuy:"Aankoop",rqDeposit:"Consignatie",rqPro:"Vakhandel",rqColl:"Verzamelaar",rqOther:"Overig",continueShop:"Verder bladeren",nax:"Volledig lezen ▾",nac:"Inklappen ▴",aiWarn:"WAARSCHUWING: DEZE VERTALING IS GEGENEREERD DOOR AI EN KAN FOUTEN OF MISVERSTANDEN BEVATTEN",rqAcq:"Beschikbaarheid en aankoopvoorwaarden",rqPress:"Pers",rqInfo2:"Algemene informatie",rqPro2:"Vakhandel · Wederverkopers",rqOther2:"Overig",shopPortPF:"Portfolio · Klein Formaat",shopPortGF:"Portfolio · Groot Formaat",shopSingPF:"Losse prenten · Klein Formaat",shopSingGF:"Losse prenten · Groot Formaat",priceLbl:"Prijs incl. btw",priceUnit:"incl. btw",pricePer:"/ prent",availPort:"Nummers %F% tot %T% van %N% beschikbaar",availSingle:"Uit de portfolio's %F% tot %T% van %N%",noChoice:"Het oplagenummer wordt automatisch toegekend (niet door koper te kiezen)",shopFormTitle:"Een aanvraag indienen",shopFormSubtitle:"Selecteer de producten en de aard van uw vraag. Ons team reageert spoedig.",shopFmtPF:"Klein Formaat · 30 × 40 cm",shopFmtGF:"Groot Formaat · 50 × 70 cm",ctTitle:"Schrijf ons",ctSubtitle:"Een vraag over het project, de kunstenaars of iets anders — schrijf ons, wij reageren.",ctSubj:"Onderwerp van uw bericht",ctSubjProj:"Het project I Love You Moneypenis",ctSubjArt:"De kunstenaars",ctSubjOther:"Andere vraag",ctFollow:"Volg ons",techs:["Gedicht · Gouden kruis","Handgeschreven brief · Marineblauwe inkt · Sculptuur","Kleurenfoto · Gele tekst","Zilvergelatineprint · Handgeschreven groene inkt","Kleurenfoto · Rode tekst · Hermès-stropdas","Kleurenfoto · Open jeans · Natuur","Cyaan getinte foto · Oranje handgeschreven brief","Rode tekst · Z/W · Meertalige waarschuwing","Handgeschreven brief · 50€-biljetten · Handen","Rode tekst · Z/W · Manifest","Handgeschreven brief · Bloemenachtergrond · Marineblauwe inkt"]},UK:{aw:"Відверний контент · Лише для свідомих дорослих",am:"Цей сайт представляє фотографічні твори, призначені виключно для свідомих дорослих.",ap:"+ 18 років — Повна версія",am2:"− 18 років — Публічна версія",nav:["I Love You Moneypenis","Тізер","Дорогоцінні скриньки","In Situ тобі подобається","Ціна баклажанів","Справді чудові пера…","🍆","I love you too","Тут усе починається спочатку","Маркери та руки"],navPresse:"Забагато честі для такої малої плоті",hl:"Лімітоване видання · Оригінальні срібно-желатинові відбитки",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Париж, 2024",hd:"Гей-поп-порно казка, для свідомих дорослих.\nКолекція La Grande Librairie de Saint-Tropez®",hc:"Увійти у твір",pt:"I Love You Moneypenis",ps:"11 оригінальних срібно-желатинових відбитків · Traphot, Монруж\nПідписані та пронумеровані Sébastien Moreu & André Vaszkievicz",mg:"Натисніть, щоб збільшити",tech_info:"2024 · 30 × 40 см (50 прим.) · 50 × 70 см (15 прим.) · Срібно-желатиновий відбиток · Traphot, Монруж",pl0:"2024 · 30 × 40 см (50 прим.) · 50 × 70 см (15 прим.) · Друк на папері Arches · Пронумерована та підписана вручну обома художниками",op:"Відкриття",tx:"Текст",pr:"Твір захищено · Цифровий водяний знак",ct:"Кофре",cs:"Повне портфоліо · 11 срібно-желатинових відбитків · Підписані та пронумеровані · Рукавички в комплекті",zt:"In Situ",zs:"Твори в інтер'єрі",vt:"Фільм",vs:"Контент лише для свідомих дорослих",st:"Придбати",pft:"Малий формат  30 × 40 см",pfc:"50 портфоліо, пронумерованих 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Великий формат  50 × 70 см",gfc:"15 портфоліо, пронумерованих 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Підписані S.M. & A.V. · Номер на кожному відбитку · Рукавички в комплекті",pd:"Traphot, Монруж",p1:"Портфоліо Малий формат · повне",p2:"Окремий відбиток · Малий формат",p3:"Портфоліо Великий формат · повне",p4:"Окремий відбиток · Великий формат",sh:"Доставка та страхування",sb:"Музейне пакування · DHL Express\nФранція 45 € · Європа 95 € · Міжнародна 180 €\nСтрахування включено",py:"Оплата",pb:"Банківський переказ · Картка · PayPal · 3 платежі без відсотків",co:"Умови",cb:"Сертифікат автентичності · Повернення 14 днів · ПДВ за країною",rv:"Зарезервувати",by:"Придбати",bt:"Про пера та руки",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — який нагадує, як стилістичне змирення, що всі завжди називали його Sébastien — це те, що відбувається, коли дисципліна та воля відмовляються приручати одержимість.\n\nНародився 25 грудня 1972 року в декорі, занадто досконалому, щоб бути невинним — Сен-Тропе — він росте в тіні точності (батько-стоматолог, який формує роти) і міфу: учасники Опору, моряки, зниклі, сімейні привиди, що відмовляються залишатися похованими. У десять років йому вручають повний арсенал живопису. Не іграшку. Першу заряджену зброю — початок барокової колекції, колекції божевільного інтимних воєн.\n\nВін ніколи їх не поверне. Воліючи помножувати поля битв.\n\nВін просувається через послідовні зміщення: живопис, книги, образи, людські стосунки — все стає матеріалом, все можна перезібрати. Те, що він будує, — не твір у класичному сенсі, а поле напружень: між пам'яттю та винаходом, вірністю та зрадою, контролем та втратою.\n\nВін не працює на інституції. Він їх інфільтрує. З 90-х років, на орбіті галеріста Enrico Navarra, він будує кар'єру, яка відкидає ярлики: ні цілком службовець, ні цілком художник, ні просто видавець — радше продуктивна аномалія, здатна породжувати книги, виставки, зв'язки, архіви, ідеї, комунікацію, події в ритмі настільки ж захоплюючому, наскільки й перервному. Безлад, що служить камуфляжем цій людині, яка методично руйнує всі рамки, покликані її утримувати.\n\nВін активно бере участь у задумі та розвитку колекції Made By…, міжнародного видавничого проєкту, присвяченого сучасній творчості на різних культурних сценах. У цьому контексті він тісно співпрацює з фотографом Simon Schwyzer.\n\nЙого стосунки з Simon Schwyzer — нестабільне серце всього: співпраця, що стала залежністю, дружба, перетворена на любовну систему. Пара? Після жорстокої смерті швейцарського фотографа Moreu відповідає: «Запитайте у нього». Тим не менш, після його зникнення ніщо не зупиняється — навпаки, все посилюється. Працювати стає способом утримати, редагувати — способом продовжити, писати — способом не здатися. Він бере на себе зобов'язання зі збереження та просування його творчості, зокрема через підготовку публікації монографії Made by… Simon Schwyzer.\n\nУ 2017 році за підтримки Enrico Navarra він заснував Éditions Sébastien Moreu, незалежне видавництво, присвячене книгам про мистецтво, есеям та трансверсальним видавничим проєктам. Пам'ять швейцарського фотографа знищить підприємство. Не проєкти.\n\nПізніше, з André Vaszkievicz, інтимне знову змінює форму. I Love You Moneypenis — не декоративний проєкт, накладений на їхні стосунки: це зіткнення тексту, образу, бажання, грошей, тіла. Твір, задуманий зсередини зв'язку, без захисного фільтра. Їхній шлюб, 19 жовтня 2024 року в Сен-Тропе, нічого не стабілізує: він офіційно оформляє те, що вже переливалося через край.\n\nЙого власна робота — колажі, тексти, видавничі пристрої — належить до естетики виставлення. Відкриті газети, вирізані образи, пам'ять, оброблена як первинний матеріал. Ніщо не нейтральне. Все залучене.\n\nФізично він несе тіло, яке не завжди співпрацює: швидке серце, примхливий тиск, система під тиском. І все ж він продовжує, зі звичками, які іноді нагадують виклик, іноді байдужість до наслідків. Жодного власного наративу спокути тут. Лише наполегливість.\n\nВін любить інтенсивно, архівує одержимо, працює компульсивно і відмовляється щось спрощувати.\n\nЯкщо існує об'єднуючий принцип, він такий: Sébastien Moreu не вирішує своїх протиріч, настільки він шанує протиріччя інших.\n\nСвої він організовує — потім живе всередині виставки. Ця галерея — його дім і той, який він цілком пропонує тим, кого любить; ніщо ніколи не для нього.\n\nНа закінчення він би процитував Desproges: «Вражаюче, чи не так?»",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz народився 28 листопада 1990 року в Бразилії, яка мало схожа на тропічні листівки. Сéбері, маленьке сільське містечко на півдні країни, належить до тих територій, сформованих європейськими міграціями XX століття: польські общини тут, але трохи далі німецькі, італійські, литовські… де мови, традиції, танці та католицизм іноді виживають із більшою впертістю, ніж у країнах їхнього походження.\n\nСин польських нащадків, народжених у Бразилії, André росте в середовищі, структурованому працею, релігією, мовчаннями та чоловічими кодами. Остання дитина в родині з восьми дітей (з єдиною сестрою), народився майже через десять років після наймолодшого зі своїх старших, він приходить у родину, вже позначену зусиллям, обмеженнями та вагою культурних спадщин.\n\nКохана несподіванка. Кохана, але не очікувана. Він буде зовсім сам у цій багатодітній родині.\n\nДуже рано він розуміє дві речі: він почувається глибоко на своєму місці у школі, а певні бажання не мають місця у світі, в якому він росте.\n\nГей-підлітковий період нелегко нікому, ніде… але в цьому сільському й консервативному контексті про це навіть не говорять. Слова не існує, а бажання переживається радше як внутрішнє напруження, ніж як можлива ідентичність.\n\nОтже, André вчиться спостерігати і мовчати, контролювати свої жести, звинувачувати своє тіло й емоції.\nВін надто чутливий, щоб говорити, і надто мовчазний, щоб бути сентиментальним. Надто дисциплінований, щоб не бути пораненим. Надто бажаний, щоб любити просто. Надто зраджений, щоб довірити це.\n\nАле були книги, словники, географічні карти, іноземні мови — цілий майже нескінченний світ паперу, який уже дозволяв йому покинути Сéбері подумки, перш ніж він зміг зробити це фізично.\n\nПісля еквівалента бакалаврату, блискучого, вища освіта тим не менш залишиться недоступною для його становища. André працює в Порту-Алегрі, відкриває трохи свободи й трохи себе разом із нею, потім поступово залишає Бразилію заради Європи та Світу. Можливо, далі можна знайти більше себе.\nВін вчить англійську в Ірландії, отримує литовське громадянство за сімейним походженням і розвиває чудове володіння мовами: португальська, іспанська, польська, французька, німецька і кілька інших. Більшу частину часу самотньо.\n\nЙого ставлення до мов стосується як академічного досягнення, так і форми екзистенційного зміщення: зміна мови стає також способом змістити збентеження, обманути нудьгу, перетинати кордони й покращити погляд, яким він обдаровує самого себе.\n\nНаступні роки довго нагадують хитке перетинання сучасної Європи: викорінення, пандемія, постійна реконструкція.\n\nОднак André зберігає майже аскетичну дисципліну: спорт, постійна інтелектуальна робота, контроль харчування, ніколи алкоголю та практично жодних наркотиків. Його тіло, здається, обробляється як територія, яку треба тримати на ногах за будь-яку ціну.\n\nЗустріч з Sébastien Moreu перетворює цю траєкторію, але не стирає її ран… принаймні намагається їх пом'якшити. Разом вони розвивають I Love You Moneypenis, проєкт, що змішує образ, бажання, автобіографію та перформанс. Їхній шлюб, відсвяткований у Сен-Тропе 19 жовтня 2024 року, не стабілізує хаос: він просто надає йому життєздатну й видиму форму, перепочинок.\n\nПаралельно André відновлює навчання в Sorbonne Nouvelle з мовознавства, де його результати швидко привертають увагу, особливо з китайської. Він також проходить помітне стажування в Cours Florent. Сором'язливий відкривається самому собі, виявляє визвольну силу вираження емоцій, які він дозволяє собі, оскільки вони написані іншими. Літо 2025 року, він їде на університетське занурення на Тайвань; цього року це буде Шанхай.\n\nЗахоплений астрологією та давніми духовностями, залучений до глибокої терапевтичної роботи навколо свого досвіду, André тим не менш залишається важким для резюмування. Все в ньому, здається, організоване, щоб перетворювати рани у внутрішню архітектуру.\n\nАле в очах Sébastien Moreu найзворушливіше знаходиться в іншому місці — найзворушливіше це дивитися, як André спостерігає за польовою квіткою. Бо тоді вся механіка падає — майстерність, захист, контроль — і раптом знову з'являється щось надзвичайно рідкісне: незаймана ніжність, яка пережила все інше.\n\nНа закінчення, він би, ймовірно, процитував Jorge Amado: «Світ вартий лише тієї емоції, яку він нам дає». або з більшою впевненістю сьогодні Gisèle Pelicot: «Сором повинен змінити сторону».",prst:"Прес-матеріали",prss:"У підготовці",prsc:"contact@moneypenis.com",plt:"У пресі",pls:"Скоро",nt:"Контакт",ns:"Надіслати",n1:"Ім'я",n2:"Email",n3:"Повідомлення",lg:"© Sébastien Moreu · © André Vaszkievicz · Париж 2024\nISBN МФ: 978-2-492649-21-9 · ISBN ВФ: 978-2-492649-20-2 · INPI № 4999735 & 4999726 · Цифровий водяний знак",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Підтверджую під свою чесну відповідальність, що мені виповнилося 18 років і що я є повнолітньою особою згідно з законодавством країни мого проживання.",ck2:"Визнаю, що цей сайт представляє художні фотографічні твори відвертого характеру, включаючи продаж оригінальних тиражів, та погоджуюся отримати до них свідомий доступ.",nat:"Слово авторів",naf:"Автори бажають попередити, що розважальна легкість назви та логотипа, як і відверні візуальні та текстові елементи творів, можуть створити враження безтурботності перед тим не менш серйозною темою. Вони нагадують, що це не так і що ця казка народилася з їхнього особистого досвіду. Обоє пережили всі її аспекти, з різних причин і в різні періоди.\n\nЇхній спільний художній проєкт покликаний відрадити будь-кого від вступу в подібну діяльність, попереджаючи, що й сьогодні: вона закриває більше дверей, ніж відкриває, і піддає тих, хто нею займається, та їхніх близьких безлічі ризиків. Зокрема, інфекціям та хворобам, особливо ІПСШ, залежностям від вживання наркотиків і алкоголю… Ця діяльність, у будь-якій формі, піддає прекарності, залежності, соціальному відторгненню, насильству, шантажу, зловживанням, примусу та вимаганням.\n\nДля тих надто небагатьох, кому вдається з неї вибратися, вона завжди вимагає дуже довгострокової психологічної підтримки, настільки наші суспільства не залишають їм інших виходів, окрім віктимізації або сорому, а то й обох разом.\n\nТому автори закликають до поваги та захисту секс-працівників. Не заперечуючи необхідності пеналізації клієнтів, вони рівною мірою закликають до гідного ставлення до емоційної злиденності, навіть розпачу, які штовхають їх порушувати Закон. Автори сподіваються, як з боку широкої публіки, так і з боку установ, на більшу підтримку асоціацій, здатних супроводжувати тих та інших.\n\nТут йдеться в жодному разі не про сліпе зняття табу з усіх практик, не більше, ніж про створення скандалу… Але про нагадування про терміновість позбутися суспільних заборон, які склеротизують публічні дебати, які тим не менш повинні бути безтурботними, а не покритими моралістичним одягом, якому тут немає чого робити, і який перешкоджає будь-якому звільненню мовлення. У них немає сумнівів, що якщо є запинало, яке слід відкинути, то це воно.\n\nА під дебатами вони мають на увазі перші з усіх — ті, що повинні вестися всередині родини.\n\nА окрім того це красиво… теж… член!\n\n(Модель, обрана художниками, не є секс-працівником. Ділячи життя з одним з авторів, він побажав залишитися анонімним.)\n\nЯкщо Автори торкнулися цієї теми, яка їх стосується, то тому, що їм здалося, що в нашу епоху форматованої комунікації, цензури мереж і відродження ханжества більше, ніж будь-коли, було необхідно привнести креативну та художню точку зору, яка залишається дивно відсутньою. Вони хотіли надати цьому цілому одночасно легкість, яка повинна переважати, коли говорять про любов і насолоду, і важкість, яку накладають пережиті реальності: з мужністю і без пафосу.\n\nВони не мають наміру підміняти собою індивідуальні вибори, як і закони, що діють у суверенних країнах, як і цінності, яким кожен вільний слідувати.\n\nУ Франції — це не випадок у всіх країнах, навіть демократичних — відповіді, надані поліцією та юстицією, у правових рамках суттєвої боротьби з торгівлею людьми, покращувалися з роками в напрямку того, чого очікують від сучасної країни. Але вони роблять це у загальних рамках і не приносять, можливо, це не їхня роль, покращення індивідуальним ситуаціям, які переживають як секс-працівники, так і їхні клієнти. Асоціації скромно виконують свої місії, незважаючи на слабкість своїх засобів.\n\nЯк для відповідних адміністрацій, так і для асоціацій, існують інтернет-сайти. Деякі дуже корисні відібрані та доступні в регулярно оновлюваному списку на нашому власному інтернет-сайті: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Окремі відбитки",siCh:"Обрати формат",siInq:"Запитати",siNote:"Ціни в євро, французький ПДВ включений. Упаковка, доставка та страхування за фактичною вартістю.",siCont:"Для придбання пишіть на smoreu@mac.com — або через форму контакту",siPro:"Книгарням, арт-дилерам і галереям — пишіть для умов, виставок і комісійної торгівлі.",siRgpd:"Ваші дані використовуються лише для вашого запиту та інформування про проєкти митців.",siPick:"Торкніться відбитка, щоб переглянути та придбати",req:"Зробити запит",reqAge:"Цей розділ лише для повнолітніх.",shPfD:"30 × 40 см · 50 нумерованих і підписаних тиражів",shGfD:"50 × 70 см · 15 нумерованих і підписаних тиражів",shUn:"Окремі відбитки",shUnD:"Кожен відбиток у Малому або Великому форматі · підписаний S.M. & A.V.",fFirstName:"Ім'я",fPhone:"Телефон",fCountry:"Країна",fLangPref:"Мова відповіді",fPref:"Спосіб контакту",fMatrix:"Предмет запиту",fMatrixHint:"Позначте відповідні поля",fMsgPh:"Деталі (макс. 500 символів)",fConsent:"Я приймаю вищезазначені умови та передачу моїх даних Sébastien Moreu та André Vaszkievicz.",fSent:"Запит надіслано. Відповідь надійде на вказану адресу.",fError:"Помилка надсилання. Ви можете написати безпосередньо на smoreu@mac.com.",rqInfo:"Інформація",rqBuy:"Купівля",rqDeposit:"Комісія",rqPro:"Професіонали",rqColl:"Колекціонер",rqOther:"Інше",continueShop:"Продовжити перегляд",nax:"Читати повністю ▾",nac:"Згорнути ▴",aiWarn:"УВАГА: ЦЕЙ ПЕРЕКЛАД СТВОРЕНО ШТУЧНИМ ІНТЕЛЕКТОМ І МОЖЕ МІСТИТИ ПОМИЛКИ АБО ХИБНІ ТЛУМАЧЕННЯ",rqAcq:"Наявність та умови придбання",rqPress:"Преса",rqInfo2:"Загальна інформація",rqPro2:"Професіонали · Дилери",rqOther2:"Інше",shopPortPF:"Портфоліо · Малий формат",shopPortGF:"Портфоліо · Великий формат",shopSingPF:"Окремі відбитки · Малий формат",shopSingGF:"Окремі відбитки · Великий формат",priceLbl:"Ціна з ПДВ",priceUnit:"з ПДВ",pricePer:"/ відбиток",availPort:"Номери з %F% по %T% з %N% доступні",availSingle:"З портфоліо %F%–%T% з %N%",noChoice:"Номер відбитка призначається автоматично (покупець не вибирає)",shopFormTitle:"Подати запит",shopFormSubtitle:"Оберіть продукти та характер вашого запиту. Наша команда оперативно відповість.",shopFmtPF:"Малий формат · 30 × 40 см",shopFmtGF:"Великий формат · 50 × 70 см",ctTitle:"Напишіть нам",ctSubtitle:"Питання про проєкт, про митців чи інше — напишіть нам, ми відповімо.",ctSubj:"Тема вашого повідомлення",ctSubjProj:"Проєкт I Love You Moneypenis",ctSubjArt:"Митці",ctSubjOther:"Інше питання",ctFollow:"Підпишіться",techs:["Поема · Золотий хрест","Рукописний лист · Темно-сині чорнила · Скульптура","Кольорова фотографія · Жовтий текст","Срібно-желатиновий відбиток · Зелені рукописні чорнила","Кольорове фото · Червоний текст · Краватка Hermès","Кольорова фотографія · Розстібнуті джинси · Природа","Фото в ціановому відтінку · Помаранчевий рукописний лист","Червоний текст · Ч/Б · Багатомовне попередження","Рукописний лист · Купюри 50€ · Руки","Червоний текст · Ч/Б · Маніфест","Рукописний лист · Квітковий фон · Темно-сині чорнила"]},LT:{aw:"Atviro turinio · Tik informuotiems suaugusiems",am:"Šioje svetainėje pristatomi fotografijos kūriniai, skirti tik informuotiems suaugusiems.",ap:"+ 18 metų — Pilna versija",am2:"− 18 metų — Vieša versija",nav:["I Love You Moneypenis","Anonsas","Brangūs aplankai","In Situ tau patinka","Baklažanų kaina","Iš tiesų gražios plunksnos…","🍆","I love you too","Čia viskas prasideda iš naujo","Flomasteriai ir rankos"],navPresse:"Per daug garbės už tiek mažai kūno",hl:"Ribota laida · Originalūs sidabro-želatininiai atspaudai",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"Paryžius, 2024",hd:"Gėjų Pop Porno pasaka, informuotiems suaugusiems.\nKolekcija La Grande Librairie de Saint-Tropez®",hc:"Žengti į kūrinį",pt:"I Love You Moneypenis",ps:"11 originalių sidabro-želatininių atspaudų · Traphot, Monružas\nPasirašyti ir sunumeruoti Sébastien Moreu ir André Vaszkievicz",mg:"Spauskite, kad padidintumėte",tech_info:"2024 · 30 × 40 cm (50 egz.) · 50 × 70 cm (15 egz.) · Sidabro-želatininis atspaudas · Traphot, Monružas",pl0:"2024 · 30 × 40 cm (50 egz.) · 50 × 70 cm (15 egz.) · Spauda ant Arches popieriaus · Sunumeruota ir pasirašyta abiejų menininkų ranka",op:"Atidarymas",tx:"Tekstas",pr:"Saugomas kūrinys · Skaitmeninis vandens ženklas",ct:"Dėžutė",cs:"Pilnas portfolio · 11 sidabro-želatininių atspaudų · Pasirašyti ir sunumeruoti · Pirštinės įskaičiuotos",zt:"In Situ",zs:"Kūriniai aplinkoje",vt:"Filmas",vs:"Turinys tik informuotiems suaugusiems",st:"Įsigyti",pft:"Mažas formatas  30 × 40 cm",pfc:"50 portfolijų sunumeruotų 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"Didelis formatas  50 × 70 cm",gfc:"15 portfolijų sunumeruotų 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"Pasirašyta S.M. & A.V. · Numeris ant kiekvieno atspaudo · Pirštinės įskaičiuotos",pd:"Traphot, Monružas",p1:"Portfolio Mažas formatas · pilnas",p2:"Atskiras atspaudas · Mažas formatas",p3:"Portfolio Didelis formatas · pilnas",p4:"Atskiras atspaudas · Didelis formatas",sh:"Pristatymas ir draudimas",sb:"Muziejinė pakuotė · DHL Express\nPrancūzija 45 € · Europa 95 € · Tarptautinis 180 €\nDraudimas įskaičiuotas",py:"Apmokėjimas",pb:"Pervedimas · Kortelė · PayPal · 3× be palūkanų",co:"Sąlygos",cb:"Autentiškumo sertifikatas · 14 dienų grąžinimas · PVM pagal šalį",rv:"Rezervuoti",by:"Įsigyti",bt:"Apie plunksnas ir rankas",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — kuris primena, kaip savotišką stilistinį pasidavimą, kad visi visada vadino jį Sébastien — yra tai, kas atsitinka, kai disciplina ir valia atsisako prijaukinti apsėdimą.\n\nGimęs 1972 m. gruodžio 25 d. per tobulą peizažą, kad būtų nekaltas — Sen-Tropezas — jis auga preciziškumo (tėvas odontologas, formuojantis burnas) ir mito šešėlyje: pasipriešinimo dalyviai, jūreiviai, dingusieji, šeimos vaiduokliai, atsisakantys likti palaidoti. Sulaukęs dešimties metų, jam įteikiamas pilnas tapybos arsenalas. Ne žaislas. Pirmas užtaisytas ginklas — barokinės kolekcijos pradžia, intymių karų pamišėlio kolekcija.\n\nJis niekada jų negrąžins. Verčiau dauginti savo mūšių laukus.\n\nJis žengia per nuoseklius poslinkius: tapyba, knygos, vaizdai, žmogiški santykiai — viskas tampa medžiaga, viskas gali būti perdėliota. Tai, ką jis stato, nėra kūrinys klasikine prasme, bet įtampų laukas: tarp atminties ir išmonės, ištikimybės ir išdavystės, kontrolės ir praradimo.\n\nJis nedirba institucijoms. Jis jas infiltruoja. Nuo 90-ųjų, galerininko Enrico Navarra orbitoje, jis kuria karjerą, atmetančią etiketes: nei visai darbuotojas, nei visai menininkas, nei tiesiog leidėjas — veikiau produktyvi anomalija, gebanti generuoti knygas, parodas, ryšius, archyvus, idėjas, komunikaciją, įvykius tokiu tempu, kuris yra ir kvapą gniaužiantis, ir nenutrūkstantis. Netvarka, tarnaujanti kaip kamufliažas šiam žmogui, metodiškai naikinančiam visus rėmus, skirtus jį sulaikyti.\n\nJis aktyviai dalyvauja Made By… kolekcijos sumanyme ir plėtroje, tarptautiniame redakciniame projekte, skirtame šiuolaikinei kūrybai įvairiose kultūrinėse scenose. Šiame kontekste jis glaudžiai bendradarbiauja su fotografu Simon Schwyzer.\n\nJo santykiai su Simon Schwyzer yra nestabili viso to širdis: bendradarbiavimas, tapęs priklausomybe, draugystė, virtusi meilės sistema. Pora? Nuo brutalios šveicarų fotografo mirties Moreu atsako: „Paklauskite jo\". Vis dėlto, po jo dingimo niekas nesustoja — priešingai, viskas intensyvėja. Darbas tampa būdu išlaikyti, redagavimas — būdu pratęsti, rašymas — būdu nepasiduoti. Jis įsipareigoja saugoti ir skleisti jo kūrybą, ypač per monografijos Made by… Simon Schwyzer leidimo parengimą.\n\n2017 m., remiamas Enrico Navarra, jis įkūrė Éditions Sébastien Moreu, nepriklausomą leidyklą, skirtą meno knygoms, esė ir transversaliems redaciniams projektams. Šveicarų fotografo atmintis sunaikins įmonę. Ne projektus.\n\nVėliau, su André Vaszkievicz, intymumas vėl keičia formą. I Love You Moneypenis nėra dekoratyvinis projektas, uždėtas ant jų santykių: tai teksto, vaizdo, troškimo, pinigų, kūno susidūrimas. Kūrinys, sumanytas iš ryšio vidaus, be apsauginio filtro. Jų santuoka, 2024 m. spalio 19 d. Sen-Tropeze, nieko nestabilizuoja: ji oficialiai įformina tai, kas jau veržėsi per kraštus.\n\nJo paties darbas — koliažai, tekstai, redakciniai įrenginiai — priklauso ekspozicijos estetikai. Atviri laikraščiai, iškirpti vaizdai, atmintis, traktuojama kaip žaliava. Niekas nėra neutralus. Viskas įsipareigoję.\n\nFiziškai jis nešioja kūną, kuris ne visada bendradarbiauja: greita širdis, kaprizingas spaudimas, sistema po slėgiu. Ir vis dėlto jis tęsia, su įpročiais, kurie kartais primena iššūkį, kartais abejingumą pasekmėms. Čia nėra tinkamo atpirkimo pasakojimo. Tik atkaklumas.\n\nJis myli intensyviai, archyvuoja apsėstai, dirba kompulsiškai ir atsisako ką nors supaprastinti.\n\nJei egzistuoja vienijantis principas, jis toks: Sébastien Moreu neišsprendžia savo prieštaravimų, taip stipriai jis garbina kitų prieštaravimus.\n\nSavuosius jis organizuoja — tada gyvena parodos viduje. Ši galerija yra jo namai ir tie, kuriuos jis visiškai siūlo tiems, kuriuos myli; niekas niekada nėra jam.\n\nBaigdamas jis pacituotų Desproges: „Stebėtina, ar ne?\"",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz gimė 1990 m. lapkričio 28 d. Brazilijoje, mažai panašioje į tropikų atvirukus. Seberi, mažas kaimiškas miestelis šalies pietuose, priklauso toms teritorijoms, suformuotoms XX a. europiečių migracijų: lenkų bendruomenės čia, bet šiek tiek toliau vokiečių, italų, lietuvių… kur kalbos, tradicijos, šokiai ir katalikybė kartais išgyvena su didesniu užsispyrimu nei jų kilmės šalyse.\n\nLenkų palikuonių, gimusių Brazilijoje, sūnus, André auga aplinkoje, struktūruotoje darbo, religijos, tylėjimų ir vyriškųjų kodų. Paskutinis aštuonių vaikų šeimos vaikas (su vienintele seserimi), gimęs beveik dešimt metų po jaunesnio iš savo vyresniųjų, jis atvyksta į šeimą, jau pažymėtą pastangų, apribojimų ir kultūrinių paveldų svorio.\n\nMylimas netikėtumas. Mylimas, bet nelauktas. Jis bus visiškai vienas šioje daugiavaikėje šeimoje.\n\nLabai anksti jis supranta du dalykus: jis jaučiasi giliai savo vietoje mokykloje, o tam tikri troškimai neturi vietos pasaulyje, kuriame jis auga.\n\nGėjų paauglystė nelengva niekam, niekur… bet šiame kaimiškame ir konservatyviame kontekste apie tai net nekalbama. Žodis neegzistuoja, o troškimas išgyvenamas labiau kaip vidinė įtampa, nei kaip galima tapatybė.\n\nTaigi André mokosi stebėti ir tylėti, kontroliuoti savo gestus, kaltinti savo kūną ir emocijas.\nJis per jautrus kalbėti ir per tylus, kad būtų sentimentalus. Per disciplinuotas, kad nebūtų sužeistas. Per geidžiamas, kad mylėtų paprastai. Per išduotas, kad tai patikėtų.\n\nBet buvo knygos, žodynai, geografiniai žemėlapiai, užsienio kalbos — visas beveik begalinis popierinis pasaulis, kuris jau leido jam palikti Seberi mintimis, prieš tai, kai galėjo tai padaryti fiziškai.\n\nPo brandos atestato ekvivalento, puikaus, aukštasis mokslas vis dėlto liks neprieinamas jo padėčiai. André dirba Porto Alegrėje, atranda šiek tiek laisvės ir šiek tiek savęs su ja, paskui palaipsniui palieka Braziliją dėl Europos ir Pasaulio. Galbūt toliau galima rasti daugiau savęs.\nJis mokosi anglų kalbos Airijoje, gauna Lietuvos pilietybę pagal šeimyninę kilmę ir išvysto nepaprastą kalbų valdymą: portugalų, ispanų, lenkų, prancūzų, vokiečių ir keletą kitų. Didžiąją laiko dalį vienas.\n\nJo santykis su kalbomis priklauso tiek nuo akademinio pasirodymo, tiek nuo egzistencinio poslinkio formos: kalbos keitimas tampa ir būdu pastumti nepatogumą, apgauti nuobodulį, kirsti sienas ir pagerinti žvilgsnį, kurį jis nukreipia į save patį.\n\nSekantys metai ilgai primena netvirtą šiuolaikinės Europos kirtimą: išrovimas iš šaknų, pandemija, nuolatinė rekonstrukcija.\n\nVis dėlto André išlaiko beveik asketišką discipliną: sportas, nuolatinis intelektualinis darbas, mitybos kontrolė, niekada alkoholio ir praktiškai jokių narkotikų. Atrodo, kad jo kūnas traktuojamas kaip teritorija, kurią reikia bet kokia kaina išlaikyti ant kojų.\n\nSusitikimas su Sébastien Moreu transformuoja šią trajektoriją, bet neištrina jos žaizdų… bent jau bando jas sušvelninti. Kartu jie kuria I Love You Moneypenis, projektą, jungiantį vaizdą, troškimą, autobiografiją ir performansą. Jų santuoka, švenčiama Sen-Tropeze 2024 m. spalio 19 d., nestabilizuoja chaoso: ji tiesiog suteikia jam gyvybingą ir matomą formą, atokvėpį.\n\nLygiagrečiai André tęsia studijas Sorbonne Nouvelle kalbotyros srityje, kur jo rezultatai greitai patraukia dėmesį, ypač kinų kalboje. Jis taip pat atlieka pažymėtą stažuotę Cours Florent. Drovus atskleidžia save sau pačiam, atranda išlaisvinančią galią išreikšti emocijas, kurias jis leidžia sau, nes jos parašytos kitų. 2025 m. vasarą jis išvyksta į universitetinį pasinerimą Taivane; šiais metais tai bus Šanchajus.\n\nAistringas astrologijos ir senovinių dvasingumų mėgėjas, įsipareigojęs giliam terapiniam darbui apie savo patirtį, André vis dėlto lieka sunkiai apibendrinamas. Atrodo, kad viskas jame organizuota taip, kad žaizdas paverstų vidine architektūra.\n\nBet Sébastien Moreu akyse jaudinamiausia yra kitur — jaudinamiausia yra stebėti, kaip André žiūri į lauko gėlę. Nes tada visa mechanika krenta — meistrystė, gynyba, kontrolė — ir staiga vėl atsiranda kažkas itin retas: nepaliesta švelnybė, išgyvenusi visa kita.\n\nBaigdamas jis tikriausiai pacituotų Jorge Amado: „Pasaulis vertas tik tos emocijos, kurią jis mums duoda\". arba tiksliau šiandien Gisèle Pelicot: „Gėda turi pakeisti pusę\".",prst:"Spaudos medžiaga",prss:"Ruošiama",prsc:"contact@moneypenis.com",plt:"Spaudoje",pls:"Netrukus",nt:"Kontaktai",ns:"Siųsti",n1:"Pavardė",n2:"Email",n3:"Žinutė",lg:"© Sébastien Moreu · © André Vaszkievicz · Paryžius 2024\nISBN MF: 978-2-492649-21-9 · ISBN DF: 978-2-492649-20-2 · INPI nr. 4999735 ir 4999726 · Skaitmeninis vandens ženklas",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"Patvirtinu sąžiningai, kad man yra 18 metų ar daugiau ir kad esu pilnametis (-ė) pagal savo gyvenamosios šalies įstatymus.",ck2:"Pripažįstu, kad šioje svetainėje pristatomi atviro pobūdžio meniniai fotografijos kūriniai, įskaitant originalių atspaudų pardavimą, ir sutinku sąmoningai prie jų prisijungti.",nat:"Autorių žodis",naf:"Autoriai nori įspėti, kad pavadinimo ir logotipo pramoginis lengvumas, kaip ir kūrinių atviri vaizdai bei tekstai, gali sudaryti įspūdį nerimasties prieš vis dėlto rimtą temą. Jie primena, kad taip nėra ir kad ši pasaka gimė iš jų asmeninės patirties. Abu, dėl skirtingų priežasčių ir skirtingais laikais, išgyveno visus jos aspektus.\n\nJų bendras meninis projektas siekia atgrasyti bet ką nuo įsitraukimo į tokią veiklą, įspėdamas, kad ir šiandien: ji uždaro daugiau durų, nei atveria, ir patiria daugybę rizikos pavojų tiems, kurie ja užsiima, ir jų artimiesiems. Ypač infekcijos ir ligos, ypatingai LPL, priklausomybės nuo narkotikų ir alkoholio vartojimo… Ši veikla, bet kokia forma, patiria nestabilumą, priklausomybę, socialinį atstūmimą, smurtą, šantažą, prievartavimą, prievartą ir reketą.\n\nTiems pernelyg retiems, kuriems pavyksta iš to ištrūkti, ji visada reikalauja labai ilgalaikės psichologinės paramos, taip stipriai mūsų visuomenės nepalieka jiems kitų išėjimų, išskyrus viktimizaciją ar gėdą, ar net abu vienu metu.\n\nTaigi autoriai ragina gerbti ir saugoti sekso darbuotojus. Neneigdami klientų baudžiamosios atsakomybės būtinybės, jie taip pat ragina oriai elgtis su emociniu skurdu, net nusivylimu, kurie veda juos pažeisti Įstatymą. Autoriai tikisi tiek iš plačiosios visuomenės, tiek iš institucijų, didesnės paramos asociacijoms, kurios gali lydėti vienus ir kitus.\n\nČia visiškai ne apie aklą tabu atšaukimą visoms praktikoms, ne daugiau, nei apie skandalo kūrimą… Bet apie priminimą skubos atsikratyti visuomeninių draudimų, kurie sklerozuoja viešąsias diskusijas, kurios vis dėlto turėtų būti ramios, o ne padengtos moralistiniu drabužiu, kuriam čia nieko veikti ir kuris trukdo bet kokiam kalbos išlaisvinimui. Jie neabejoja, kad jei yra šydas, kurį reikia nuversti, tai būtent šis.\n\nO debatais jie turi omenyje pirmuosius iš visų — tuos, kurie turėtų vykti šeimos viduje.\n\nIr be to tai gražu… taip pat… penis!\n\n(Menininkų pasirinktas modelis nėra sekso darbuotojas. Dalindamasis gyvenimu su vienu iš autorių, jis pageidavo likti anonimiškas.)\n\nJei Autoriai palietė šią temą, kuri juos paliečia, tai todėl, kad jiems atrodė, jog mūsų formatuotos komunikacijos, tinklų cenzūros ir tariamo tobulumo atgimimo epochoje buvo labiau nei bet kada būtina pateikti kūrybišką ir meninį požiūrį, kuris lieka keistai nesantis. Jie norėjo suteikti šiai visumai tiek lengvumą, kuris turėtų vyrauti kalbant apie meilę ir malonumą, tiek svorį, kurį primeta pergyventos realybės: su drąsa ir be patoso.\n\nJie neketina pakeisti individualių pasirinkimų, kaip ir įstatymų, galiojančių suverenios valstybėse, kaip ir vertybių, kurioms kiekvienas yra laisvas priklausyti.\n\nPrancūzijoje — tai nėra atvejis visose šalyse, net demokratinėse — policijos ir teisingumo atsakymai, esminės kovos su prekyba žmonėmis teisinėje sistemoje, gerėjo metams bėgant ta kryptimi, kurios tikimasi iš modernios šalies. Bet jie tai daro bendros perspektyvos rėmuose ir neatneša, galbūt tai ne jų vaidmuo, pagerinimo individualioms situacijoms, kurias patiria tiek sekso darbuotojai, tiek jų klientai. Asociacijos diskretiškai vykdo savo misijas, nepaisant savo priemonių silpnumo.\n\nTiek atitinkamoms administracijoms, tiek asociacijoms egzistuoja interneto svetainės. Kai kurios labai naudingos atrinktos ir prieinamos reguliariai atnaujinamame sąraše mūsų pačių interneto svetainėje: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"Atskiri atspaudai",siCh:"Pasirinkti formatą",siInq:"Pasiteirauti",siNote:"Kainos eurais, įskaitant Prancūzijos PVM. Pakavimas, siuntimas ir draudimas pagal faktinę savikainą.",siCont:"Norėdami įsigyti, rašykite į smoreu@mac.com — arba per kontaktinę formą",siPro:"Knygnešiams, meno prekiautojams ir galerijoms — rašykite dėl sąlygų, parodų ir konsignacijų.",siRgpd:"Jūsų duomenys bus naudojami tik jūsų užklausai ir informacijai apie menininkų projektus.",siPick:"Bakstelėkite atspaudą, kad jį pamatytumėte ir įsigytumėte",req:"Pateikti užklausą",reqAge:"Šis skyrius skirtas tik suaugusiems.",shPfD:"30 × 40 cm · 50 numeruotų ir pasirašytų egzempliorių",shGfD:"50 × 70 cm · 15 numeruotų ir pasirašytų egzempliorių",shUn:"Atskiri atspaudai",shUnD:"Kiekvienas atspaudas Mažu arba Dideliu formatu · pasirašytas S.M. & A.V.",fFirstName:"Vardas",fPhone:"Telefonas",fCountry:"Šalis",fLangPref:"Atsakymo kalba",fPref:"Pageidaujamas susisiekimas",fMatrix:"Užklausos objektas",fMatrixHint:"Pažymėkite atitinkamus laukus",fMsgPh:"Detalės (maks. 500 simbolių)",fConsent:"Sutinku su pirmiau nurodytomis sąlygomis ir savo duomenų perdavimu Sébastien Moreu ir André Vaszkievicz.",fSent:"Užklausa išsiųsta. Atsakymą gausite nurodytu adresu.",fError:"Siuntimas nepavyko. Galite rašyti tiesiogiai į smoreu@mac.com.",rqInfo:"Informacija",rqBuy:"Pirkimas",rqDeposit:"Komisija",rqPro:"Prekyba",rqColl:"Kolekcionierius",rqOther:"Kita",continueShop:"Tęsti naršymą",nax:"Skaityti viską ▾",nac:"Sutraukti ▴",aiWarn:"DĖMESIO: ŠIS VERTIMAS YRA SUKURTAS DI IR GALI TURĖTI KLAIDŲ AR NESUSIPRATIMŲ",rqAcq:"Prieinamumas ir įsigijimo sąlygos",rqPress:"Spauda",rqInfo2:"Bendra informacija",rqPro2:"Profesionalai · Platintojai",rqOther2:"Kita",shopPortPF:"Portfolio · Mažas formatas",shopPortGF:"Portfolio · Didelis formatas",shopSingPF:"Atskiri atspaudai · Mažas formatas",shopSingGF:"Atskiri atspaudai · Didelis formatas",priceLbl:"Kaina su PVM",priceUnit:"su PVM",pricePer:"/ atspaudas",availPort:"Numeriai nuo %F% iki %T% iš %N% prieinami",availSingle:"Iš portfolio %F%–%T% iš %N%",noChoice:"Tiražo numeris priskiriamas automatiškai (pirkėjas negali rinktis)",shopFormTitle:"Pateikti užklausą",shopFormSubtitle:"Pasirinkite produktus ir užklausos pobūdį. Mūsų komanda greitai atsakys.",shopFmtPF:"Mažas formatas · 30 × 40 cm",shopFmtGF:"Didelis formatas · 50 × 70 cm",ctTitle:"Parašykite mums",ctSubtitle:"Klausimas apie projektą, menininkus ar kita — parašykite, atsakysime.",ctSubj:"Žinutės tema",ctSubjProj:"Projektas I Love You Moneypenis",ctSubjArt:"Menininkai",ctSubjOther:"Kitas klausimas",ctFollow:"Sekite mus",techs:["Eilėraštis · Auksinis kryžius","Ranka rašytas laiškas · Tamsiai mėlynas rašalas · Skulptūra","Spalvota fotografija · Geltonas tekstas","Sidabro-želatininis atspaudas · Ranka rašytas žalias rašalas","Spalvota nuotrauka · Raudonas tekstas · Hermès kaklaraištis","Spalvota fotografija · Atsegti džinsai · Gamta","Cianu atspalvio nuotrauka · Oranžinis ranka rašytas laiškas","Raudonas tekstas · J/B · Daugiakalbis perspėjimas","Ranka rašytas laiškas · 50€ banknotai · Rankos","Raudonas tekstas · J/B · Manifestas","Ranka rašytas laiškas · Gėlių fonas · Tamsiai mėlynas rašalas"]},
  KO:{techs:["시 · 황금 십자가","손글씨 편지 · 짙은 청색 잉크 · 조각","컬러 사진 · 노란 글씨","은염 인화 · 손글씨 녹색 잉크","컬러 사진 · 빨간 글씨 · Hermès 넥타이","컬러 사진 · 열린 청바지 · 자연","청록색조 사진 · 주황색 손글씨 편지","빨간 글씨 · 흑백 · 다국어 경고","손글씨 편지 · 50€ 지폐 · 손","빨간 글씨 · 흑백 · 선언문","손글씨 편지 · 꽃 배경 · 짙은 청색 잉크"],aw:"노골적 콘텐츠 · 인지 성인 전용",am:"이 사이트는 인지 성인을 위한 사진 예술 작품을 소개합니다.",ap:"+ 18세 — 전체 버전",am2:"− 18세 — 공개 버전",nav:["I Love You Moneypenis","티저","귀한 상자들","In Situ 마음에 들죠","가지의 가격","참으로 멋진 필치…","🍆","I love you too","여기에서 모든 것이 다시 시작된다","펜과 손"],navPresse:"살은 적은데 영광은 많아라",hl:"한정판 · 오리지널 젤라틴 실버 프린트",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"파리, 2024",hd:"인지 성인을 위한 게이 팝 포르노 동화.\n컬렉션 La Grande Librairie de Saint-Tropez®",hc:"작품에 들어가기",pt:"I Love You Moneypenis",ps:"11점의 오리지널 젤라틴 실버 프린트 · Traphot, 몽루즈\nSébastien Moreu & André Vaszkievicz 서명 및 번호 매김",mg:"확대하려면 클릭",tech_info:"2024 · 30 × 40 cm (50점) · 50 × 70 cm (15점) · 젤라틴 실버 프린트 · Traphot, 몽루즈",pl0:"2024 · 30 × 40 cm (50점) · 50 × 70 cm (15점) · Arches 종이 인쇄 · 두 작가가 손으로 번호 매김 및 서명",op:"오프닝",tx:"텍스트",pr:"보호된 작품 · 디지털 워터마크",ct:"박스 세트",cs:"전체 포트폴리오 · 11점의 젤라틴 실버 프린트 · 서명 및 번호 매김 · 장갑 포함",zt:"In Situ",zs:"공간 속의 작품들",vt:"영상",vs:"인지 성인 전용 콘텐츠",st:"구매",pft:"소형  30 × 40 cm",pfc:"01/50 → 50/50 번호가 매겨진 50개 포트폴리오",pfi:"ISBN: 978-2-492649-21-9",gft:"대형  50 × 70 cm",gfc:"01/15 → 15/15 번호가 매겨진 15개 포트폴리오",gfi:"ISBN: 978-2-492649-20-2",sg:"S.M. & A.V. 서명 · 각 프린트에 번호 · 장갑 포함",pd:"Traphot, 몽루즈",p1:"포트폴리오 소형 · 전체",p2:"낱장 판화 · 소형",p3:"포트폴리오 대형 · 전체",p4:"낱장 판화 · 대형",sh:"배송 및 보험",sb:"박물관급 포장 · DHL Express\n프랑스 45 € · 유럽 95 € · 국제 180 €\n보험 포함",py:"결제",pb:"은행 송금 · 카드 · PayPal · 3회 무이자",co:"조건",cb:"정품 보증서 · 14일 반품 · 국가별 부가세",rv:"예약",by:"구매",bt:"펜과 손에 대하여",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — 모두가 항상 그를 Sébastien으로 불러왔다는 사실을 일종의 문체적 체념으로 우리에게 상기시키는 그 — 는 규율과 의지가 집착을 길들이기를 거부할 때 일어나는 일이다.\n\n1972년 12월 25일, 무구하기에는 너무 완벽한 무대 — 생트로페 — 에서 태어난 그는 정밀함의 그늘(입을 형성하는 치과의사 아버지)과 신화의 그늘에서 자란다: 레지스탕스 대원들, 선원들, 실종자들, 묻혀 있기를 거부하는 가족의 유령들. 열 살에 그는 완전한 회화 무기고를 받는다. 장난감이 아니다. 첫 번째 장전된 무기 — 바로크 컬렉션의 시작, 친밀한 전쟁들에 미친 사람의 컬렉션.\n\n그는 결코 그것들을 돌려주지 않을 것이다. 자신의 전장을 늘리는 것을 선호하면서.\n\n그는 연속적인 이동을 통해 나아간다: 회화, 책, 이미지, 인간 관계 — 모든 것이 재료가 되고, 모든 것이 재조립될 수 있다. 그가 짓는 것은 고전적 의미의 작품이 아니라 긴장의 장이다: 기억과 발명 사이, 충실과 배신 사이, 통제와 상실 사이.\n\n그는 기관들을 위해 일하지 않는다. 그는 그것들에 침투한다. 90년대부터 갤러리스트 Enrico Navarra의 궤도에서, 그는 라벨을 거부하는 경력을 쌓는다: 완전히 직원도, 완전히 예술가도, 단순한 편집자도 아닌 — 오히려 생산적인 변칙, 책, 전시, 연결, 아카이브, 아이디어, 커뮤니케이션, 이벤트를 숨막히면서도 단속적인 속도로 생성할 수 있는. 그를 담아내려는 모든 틀을 체계적으로 파괴하는 이 남자에게 위장으로 작용하는 무질서.\n\n그는 Made By… 컬렉션의 구상과 발전에 적극적으로 참여한다. 이는 다양한 문화적 무대를 통한 현대 창작에 헌정된 국제적 편집 프로젝트이다. 이 맥락에서 그는 사진작가 Simon Schwyzer와 긴밀하게 협력한다.\n\nSimon Schwyzer와의 관계는 그 모든 것의 불안정한 심장이다: 의존이 된 협력, 사랑의 체계로 변형된 우정. 커플? 스위스 사진작가의 갑작스러운 죽음 이후 Moreu는 답한다: «그에게 물어보세요.» 그럼에도 불구하고, 그의 사라짐 이후 아무것도 멈추지 않는다 — 오히려 모든 것이 강화된다. 일하는 것은 붙잡는 방법이 되고, 편집하는 것은 연장하는 방법이 되며, 글쓰는 것은 굴복하지 않는 방법이 된다. 그는 그의 작품을 보존하고 알리는 데 헌신한다. 특히 Made by… Simon Schwyzer 모노그래프의 출판 준비를 통해.\n\n2017년, Enrico Navarra의 지원으로 그는 미술서, 에세이 및 횡단적 편집 프로젝트에 헌정된 독립 출판사 Éditions Sébastien Moreu를 설립했다. 스위스 사진작가의 기억이 그 기업을 파괴할 것이다. 프로젝트들은 아니다.\n\n나중에, André Vaszkievicz와 함께, 친밀함은 다시 형태를 바꾼다. I Love You Moneypenis는 그들의 관계 위에 놓인 장식 프로젝트가 아니다: 그것은 텍스트, 이미지, 욕망, 돈, 신체의 충돌이다. 보호 필터 없이, 유대의 내부에서 구상된 작품. 2024년 10월 19일 생트로페에서의 그들의 결혼은 아무것도 안정시키지 않는다: 그것은 이미 넘쳐흐르고 있던 것을 공식화한다.\n\n그의 자신의 작업 — 콜라주, 텍스트, 편집 장치 — 은 노출의 미학에 속한다. 펼쳐진 신문, 잘라낸 이미지, 원자재로 다루어진 기억. 어느 것도 중립적이지 않다. 모든 것이 연루되어 있다.\n\n육체적으로, 그는 항상 협조하지 않는 신체를 짊어진다: 빠른 심장, 변덕스러운 혈압, 압박 아래의 시스템. 그럼에도 그는 계속한다. 때로는 도전을 닮은, 때로는 결과에 대한 무관심을 닮은 습관들과 함께. 여기에는 적절한 구원 서사가 없다. 오직 끈기만이.\n\n그는 강렬하게 사랑하고, 강박적으로 아카이브하며, 충동적으로 일하고, 어떤 것도 단순화하기를 거부한다.\n\n통합적 원칙이 있다면, 이것이다: Sébastien Moreu는 자신의 모순을 해결하지 않는다. 그만큼 그는 타인의 모순을 숭배한다.\n\n자신의 모순들을 그는 조직한다 — 그러고 나서 전시 안에서 산다. 이 갤러리는 그의 집이며, 그가 사랑하는 이들에게 전부를 바치는 곳이다; 아무것도 결코 그 자신을 위한 것이 아니다.\n\n결론적으로, 그는 Desproges를 인용할 것이다: «놀랍지 않은가?»",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz는 1990년 11월 28일, 열대 엽서와는 거의 닮지 않은 브라질에서 태어났다. 이 나라 남부의 작은 시골 마을 Seberi는 20세기 유럽 이민에 의해 형성된 영토에 속한다: 여기에는 폴란드 공동체가, 조금 더 가면 독일, 이탈리아, 리투아니아 공동체가 있다… 언어, 전통, 춤, 가톨릭교가 때로는 출신국보다 더 강고하게 살아남는 곳에서.\n\n브라질에서 태어난 폴란드 후손의 아들인 André는 노동, 종교, 침묵, 남성성의 규범으로 구조화된 환경에서 자란다. 여덟 남매(여동생 하나만)의 막내로, 형제 중 가장 어린 형보다 거의 십 년 늦게 태어난 그는 이미 노력, 제약, 문화적 유산의 무게로 새겨진 가족에 도착한다.\n\n사랑받은 의외성. 사랑받았지만 기대되지 않았다. 그는 이 대가족 안에서 매우 외로울 것이다.\n\n매우 일찍, 그는 두 가지를 이해한다: 학교에서는 깊이 자신의 자리를 느끼지만, 어떤 욕망들은 그가 자라는 세계에 자리가 없다.\n\n게이 청소년기는 누구에게도, 어디에서도 쉽지 않다… 하지만 이 시골의 보수적인 맥락에서는 그것에 대해 말조차 하지 않는다. 단어는 존재하지 않고, 욕망은 가능한 정체성보다는 내적 긴장으로 경험된다.\n\nAndré는 그래서 관찰하고 침묵하는 법을, 자신의 몸짓을 통제하는 법을, 자신의 몸과 감정을 비난하는 법을 배운다.\n그는 말하기에는 너무 예민하고, 감상적이기에는 너무 과묵하다. 상처받지 않기에는 너무 규율적이다. 단순히 사랑하기에는 너무 욕망된다. 그것을 털어놓기에는 너무 배신당했다.\n\n그러나 책들, 사전들, 지리 지도들, 외국어들이 있었다 — 이미 그가 신체적으로 떠날 수 있기 전에 정신적으로 Seberi를 떠나는 것을 허락한, 거의 무한한 종이의 세계.\n\n탁월한 바칼로레아 동등 시험 이후, 고등 교육은 그럼에도 그의 상황에 접근 불가능할 것이다. André는 포르투알레그리에서 일하면서 약간의 자유와 자신의 일부를 발견하고, 점차 브라질을 떠나 유럽과 세계로 향한다. 어쩌면 더 멀리서 더 많은 자신을 찾을 수 있을지도 모른다.\n그는 아일랜드에서 영어를 배우고, 가족 혈통에 의해 리투아니아 국적을 취득하고, 언어에 대한 놀라운 숙달을 발전시킨다: 포르투갈어, 스페인어, 폴란드어, 프랑스어, 독일어 그리고 여러 다른 언어들. 대부분 혼자서.\n\n언어와의 그의 관계는 학업 성취만큼이나 실존적 변위의 한 형태에 속한다: 언어를 바꾸는 것은 또한 불편함을 옮기고, 권태를 속이고, 국경을 건너고, 자신에게 던지는 시선을 개선하는 한 방법이 된다.\n\n뒤이은 해들은 오랫동안 현대 유럽의 위태로운 횡단을 닮는다: 뿌리 뽑힘, 팬데믹, 영구적인 재건.\n\n그럼에도 André는 거의 금욕적인 규율을 유지한다: 운동, 끊임없는 지적 노동, 식이 통제, 결코 술을 마시지 않고 마약은 거의 하지 않는다. 그의 몸은 어떻게든 서 있게 해야 하는 영토처럼 다루어지는 것 같다.\n\nSébastien Moreu와의 만남은 이 궤적을 변화시키지만 그 상처들을 지우지는 않는다… 적어도 그것들을 누그러뜨리려고 시도한다. 함께 그들은 이미지, 욕망, 자서전, 퍼포먼스를 혼합하는 프로젝트인 I Love You Moneypenis를 발전시킨다. 2024년 10월 19일 생트로페에서 거행된 그들의 결혼은 혼돈을 안정시키지 않는다: 그것은 단지 그것에 살 수 있고 보이는 형태를, 하나의 휴식을 부여한다.\n\n동시에 André는 소르본누벨에서 언어학 학업을 재개하고, 그의 성적은 특히 중국어에서 빠르게 주목을 끈다. 그는 또한 쿠르 플로랑에서 주목할 만한 연수를 마친다. 수줍은 사람이 자신에게 자신을 드러내고, 다른 사람들이 쓴 것이기에 자신에게 허락하는 감정 표현의 해방적 힘을 발견한다. 2025년 여름, 그는 타이완으로 대학 몰입 학습을 떠난다; 올해는 상하이가 될 것이다.\n\n점성술과 고대 영성에 열정적이고, 자신의 경험을 둘러싼 깊은 치료적 작업에 참여하면서도, André는 여전히 요약하기 어렵다. 그의 모든 것이 상처를 내적 건축으로 변환하기 위해 조직된 것처럼 보인다.\n\n그러나 Sébastien Moreu의 눈에는 가장 감동적인 것이 다른 곳에 있다 — 가장 감동적인 것은 André가 야생화를 관찰하는 것을 바라보는 것이다. 그 순간 모든 기계가 무너지기 때문이다 — 숙달, 방어, 통제 — 그리고 갑자기 극히 드문 무언가가 다시 나타난다: 다른 모든 것을 살아남은 손상되지 않은 부드러움.\n\n결론적으로, 그는 아마도 Jorge Amado를 인용할 것이다: «세상은 그것이 우리에게 주는 감동만큼의 가치가 있다.» 또는 오늘날 더 확실하게 Gisèle Pelicot를: «수치심은 진영을 바꿔야 한다.»",prst:"보도 자료",prss:"준비 중",prsc:"contact@moneypenis.com",plt:"언론에서",pls:"곧 공개",nt:"연락처",ns:"보내기",n1:"이름",n2:"이메일",n3:"메시지",lg:"© Sébastien Moreu · © André Vaszkievicz · 파리 2024\nISBN 소형: 978-2-492649-21-9 · ISBN 대형: 978-2-492649-20-2 · INPI 번호 4999735 및 4999726 · 디지털 워터마크",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"본인은 18세 이상이며 거주 국가의 법률에 따라 성인임을 명예와 양심에 따라 선언합니다.",ck2:"이 사이트가 오리지널 프린트 판매를 포함하여 노골적인 성격의 예술 사진 작품을 소개한다는 것을 인정하며, 의식적으로 접근하는 것에 동의합니다.",nat:"작가의 말",naf:"작가들은 제목과 로고의 오락적 가벼움이 작품의 노골적인 시각 자료 및 텍스트와 마찬가지로 그럼에도 진지한 주제 앞에서 무신경한 인상을 줄 수 있음을 경고하고자 합니다. 그들은 그렇지 않으며 이 이야기는 자신들의 개인적 경험에서 태어났음을 상기시킵니다. 두 사람 모두 다른 이유와 다른 시기에 그 모든 측면을 경험했습니다.\n\n그들의 공동 예술 프로젝트는 오늘날에도 이러한 활동이: 열어주는 문보다 더 많은 문을 닫고, 그것을 실행하는 사람들과 그들의 가까운 이들을 수많은 위험에 노출시킨다는 것을 경고함으로써 누구든 이러한 활동에 가담하는 것을 만류할 의도입니다. 특히 감염과 질병, 특히 성병, 약물 및 알코올 사용 의존증… 이 활동은 어떤 형태든 불안정, 의존, 사회적 거부, 폭력, 협박, 학대, 강요, 갈취에 노출시킵니다.\n\n그것에서 벗어나는 데 성공하는 너무 적은 사람들에게, 그것은 항상 매우 장기적인 심리적 동반을 요구합니다. 우리 사회들이 그들에게 피해자화 또는 수치심, 또는 둘 다 동시에 외에는 다른 출구를 남기지 않기 때문입니다.\n\n그러므로 작가들은 성노동자들에 대한 존중과 보호를 호소합니다. 고객의 형사처벌의 필요성을 부인하지 않으면서도, 그들은 또한 법을 위반하게 만드는 감정적 비참함, 심지어 절망에 대한 품위 있는 대우를 호소합니다. 작가들은 일반 대중과 기관 모두에게 양쪽 모두를 동반할 수 있는 협회들에 대한 더 큰 지원을 희망합니다.\n\n여기에서는 결코 모든 관행에 대한 금기를 맹목적으로 해제하는 것도, 스캔들을 일으키는 것도 아닙니다… 그러나 평온해야 할 공공 토론을 경직시키는 사회적 금지를 떨쳐버리고, 여기에 있을 자리가 없으며 모든 발언의 해방을 방해하는 도덕적 옷을 입히지 말아야 할 시급함을 상기시키는 것입니다. 만약 추방해야 할 베일이 있다면, 그것은 이것입니다.\n\n그리고 토론으로 그들은 모든 것 중 첫 번째, 가족 내에서 이루어져야 할 토론을 떠올리고자 합니다.\n\n그리고 또한 아름다워… 도… 자지!\n\n(작가들이 선택한 모델은 성노동자가 아닙니다. 작가 중 한 명과 삶을 공유하며, 그는 익명으로 남기를 원했습니다.)\n\n작가들이 자신들과 관련된 이 주제를 다루었다면, 그것은 형식화된 커뮤니케이션, 네트워크 검열, 점잔빼기의 부활이라는 우리 시대에 이상하게 부재한 채로 남아 있는 창조적이고 예술적인 관점을 가져오는 것이 그 어느 때보다 필요해 보였기 때문입니다. 그들은 이 전체에 사랑과 쾌락을 환기할 때 우세해야 할 가벼움과, 체험된 현실에 의해 부과되는 무게를 동시에 부여하고자 했습니다: 용기와 함께 그리고 비장함 없이.\n\n그들은 개인적 선택을 대체하려는 의도가 없으며, 주권 국가에서 시행 중인 법률이나 각자가 자유롭게 따르는 가치를 대체하려는 의도도 없습니다.\n\n프랑스에서는 — 이는 민주주의 국가를 포함한 모든 국가에서 그러한 것은 아닙니다 — 인신매매에 대한 본질적 투쟁의 법적 틀 내에서 경찰과 사법부가 제공하는 답변은 현대 국가로부터 기대되는 방향으로 수년에 걸쳐 개선되어 왔습니다. 그러나 그들은 일반적 틀 안에서 그것을 하며, 그것이 그들의 역할이 아닐 수도 있지만, 성노동자와 그 고객 모두가 겪는 개별적 상황에 개선을 가져오지 않습니다. 협회들은 그들의 수단의 부족함에도 불구하고 임무를 신중하게 수행합니다.\n\n관련 행정 기관과 협회 모두에 대해 인터넷 사이트가 존재합니다. 일부 매우 유용한 것들이 선정되어 우리 자신의 인터넷 사이트의 정기적으로 업데이트되는 목록에서 이용 가능합니다: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"개별 프린트",siCh:"크기 선택",siInq:"문의하기",siNote:"가격은 유로 표시, 프랑스 부가세 포함. 포장, 배송, 보험은 실비 청구.",siCont:"구매를 원하시면 smoreu@mac.com 으로 메일을 보내주세요 — 또는 문의 양식을 이용하세요",siPro:"서점, 아트 딜러, 갤러리 — 거래 조건, 전시 및 위탁에 관해 연락주세요.",siRgpd:"귀하의 정보는 문의 응답과 작가 프로젝트 소식 안내에만 사용됩니다.",siPick:"작품을 탭하여 보고 구매하세요",req:"문의 제출",reqAge:"이 섹션은 성인만 이용 가능합니다.",shPfD:"30 × 40 cm · 번호와 서명이 있는 50점 한정",shGfD:"50 × 70 cm · 번호와 서명이 있는 15점 한정",shUn:"낱장 판매",shUnD:"각 판화는 소형 또는 대형으로 제공 · S.M. & A.V. 서명",fFirstName:"이름",fPhone:"전화번호",fCountry:"국가",fLangPref:"답변 언어",fPref:"선호 연락 방법",fMatrix:"문의 대상",fMatrixHint:"해당 항목에 체크하세요",fMsgPh:"내용 (최대 500자)",fConsent:"위 조건과 정보가 Sébastien Moreu 및 André Vaszkievicz에게 전달되는 데 동의합니다.",fSent:"문의가 전송되었습니다. 입력하신 주소로 답변을 받으실 것입니다.",fError:"전송 실패. smoreu@mac.com 으로 직접 연락하실 수 있습니다.",rqInfo:"정보",rqBuy:"구매",rqDeposit:"위탁",rqPro:"거래처",rqColl:"컬렉터",rqOther:"기타",continueShop:"계속 둘러보기",nax:"전체 읽기 ▾",nac:"접기 ▴",aiWarn:"주의: 이 번역은 AI에 의해 생성되었으며 오류나 오해가 있을 수 있습니다",rqAcq:"재고 및 구매 조건",rqPress:"언론",rqInfo2:"일반 정보",rqPro2:"전문가 · 유통업체",rqOther2:"기타",shopPortPF:"포트폴리오 · 소형",shopPortGF:"포트폴리오 · 대형",shopSingPF:"낱장 판화 · 소형",shopSingGF:"낱장 판화 · 대형",priceLbl:"부가세 포함 가격",priceUnit:"부가세 포함",pricePer:"/ 판화",availPort:"총 %N%개 중 %F%–%T%번 판매 중",availSingle:"총 %N% 포트폴리오 중 %F%–%T% 포트폴리오에서",noChoice:"판화 번호는 자동으로 부여됩니다 (구매자가 선택할 수 없음)",shopFormTitle:"문의하기",shopFormSubtitle:"제품과 문의 성격을 선택해 주세요. 신속히 답변드리겠습니다.",shopFmtPF:"소형 · 30 × 40 cm",shopFmtGF:"대형 · 50 × 70 cm",ctTitle:"문의",ctSubtitle:"프로젝트, 아티스트, 기타 무엇이든 문의해 주시면 답변드립니다.",ctSubj:"메시지 주제",ctSubjProj:"I Love You Moneypenis 프로젝트",ctSubjArt:"아티스트",ctSubjOther:"기타 질문",ctFollow:"팔로우"},AR:{techs:["قصيدة · صليب ذهبي","رسالة بخط اليد · حبر أزرق داكن · منحوتة","صورة ملونة · نص أصفر","طبعة جيلاتين فضي · حبر أخضر بخط اليد","صورة ملونة · نص أحمر · ربطة عنق Hermès","صورة ملونة · جينز مفتوح · طبيعة","صورة بلون سماوي · رسالة برتقالية بخط اليد","نص أحمر · أبيض وأسود · تحذير متعدد اللغات","رسالة بخط اليد · أوراق نقدية فئة 50€ · أيدي","نص أحمر · أبيض وأسود · بيان","رسالة بخط اليد · خلفية بالأزهار · حبر أزرق داكن"],aw:"محتوى صريح · للبالغين المُطلعين فقط",am:"يقدم هذا الموقع أعمالاً فوتوغرافية فنية مخصصة للبالغين المُطلعين.",ap:"+ 18 سنة — النسخة الكاملة",am2:"− 18 سنة — النسخة العامة",nav:["I Love You Moneypenis","العرض الترويجي","الصناديق الثمينة","In Situ يعجبك","سعر الباذنجان","أقلام جميلة حقاً…","🍆","I love you too","هنا يبدأ كل شيء من جديد","أقلام التحديد والأيدي"],navPresse:"كثير من الشرف لقليل من اللحم",hl:"إصدار محدود · طبعات جيلاتين فضي أصلية",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"باريس، 2024",hd:"حكاية بوب بورنو مثلية الجنس، للبالغين المُطلعين.\nمجموعة La Grande Librairie de Saint-Tropez®",hc:"ادخل إلى العمل",pt:"I Love You Moneypenis",ps:"11 طبعة جيلاتين فضي أصلية · Traphot، Montrouge\nموقعة ومرقمة من قبل Sébastien Moreu و André Vaszkievicz",mg:"انقر للتكبير",tech_info:"2024 · 30 × 40 سم (50 نسخة) · 50 × 70 سم (15 نسخة) · طبعة جيلاتين فضي · Traphot، Montrouge",pl0:"2024 · 30 × 40 سم (50 نسخة) · 50 × 70 سم (15 نسخة) · طباعة على ورق Arches · مرقمة وموقعة يدوياً من كلا الفنانين",op:"الافتتاح",tx:"نص",pr:"عمل محمي · علامة مائية رقمية",ct:"العلبة",cs:"المجموعة الكاملة · 11 طبعة جيلاتين فضي · موقعة ومرقمة · القفازات مرفقة",zt:"In Situ",zs:"الأعمال في المكان",vt:"فيلم",vs:"محتوى للبالغين المُطلعين فقط",st:"اقتناء",pft:"الحجم الصغير  30 × 40 سم",pfc:"50 مجموعة مرقمة 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"الحجم الكبير  50 × 70 سم",gfc:"15 مجموعة مرقمة 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"موقعة S.M. & A.V. · رقم على كل طبعة · القفازات مرفقة",pd:"Traphot، Montrouge",p1:"بورتفوليو المقاس الصغير · كامل",p2:"مطبوعة مفردة · المقاس الصغير",p3:"بورتفوليو المقاس الكبير · كامل",p4:"مطبوعة مفردة · المقاس الكبير",sh:"الشحن والتأمين",sb:"تغليف متحفي · DHL Express\nفرنسا 45 € · أوروبا 95 € · دولي 180 €\nالتأمين مشمول",py:"الدفع",pb:"تحويل · بطاقة · PayPal · 3 أقساط بدون فوائد",co:"الشروط",cb:"شهادة أصالة · إرجاع خلال 14 يوم · ضريبة القيمة المضافة حسب البلد",rv:"حجز",by:"اقتناء",bt:"من الأقلام والأيدي",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — الذي يذكرنا، كنوع من الاستسلام الأسلوبي، بأن الجميع نادوه دائماً Sébastien — هو ما يحدث عندما يرفض الانضباط والإرادة ترويض الهوس.\n\nوُلد في 25 ديسمبر 1972 في مشهد مثالي أكثر من اللازم ليكون بريئاً — Saint-Tropez — ينشأ في ظل الدقة، أب طبيب أسنان يشكل الأفواه، والأسطورة: مقاومون، بحارة، مفقودون، أشباح عائلية ترفض البقاء مدفونة. في العاشرة من عمره، يُسلَّم له ترسانة كاملة من الرسم. ليست لعبة. أول سلاح محشو — بداية مجموعة باروكية، تلك لمجنون الحروب الحميمة.\n\nلن يعيدها أبداً. مفضلاً مضاعفة ساحات معاركه.\n\nيتقدم بإزاحات متتالية: رسم، كتب، صور، علاقات إنسانية — كل شيء يصبح مادة، كل شيء يمكن إعادة تجميعه. ما يبنيه ليس عملاً بالمعنى الكلاسيكي، بل حقل توترات: بين الذاكرة والاختراع، الوفاء والخيانة، السيطرة والفقدان.\n\nلا يعمل للمؤسسات. يخترقها. منذ التسعينيات، في مدار صاحب المعرض Enrico Navarra، يبني مساراً مهنياً يرفض التصنيفات: لا موظف تماماً، ولا فنان تماماً، ولا ناشر بسيط — بل شذوذ منتج، قادر على توليد كتب، معارض، روابط، أرشيفات، أفكار، اتصالات، أحداث، بإيقاع مذهل ومتقطع في آن واحد. فوضى تخدم كتمويه لهذا الرجل الذي يدمر بشكل منهجي كل الأطر المفترض أن تحتويه.\n\nيشارك بنشاط في تصميم وتطوير مجموعة Made By…، مشروع تحريري دولي مكرس للإبداع المعاصر عبر مشاهد ثقافية مختلفة. في هذا الإطار، يتعاون عن كثب مع المصور Simon Schwyzer.\n\nعلاقته مع Simon Schwyzer هي القلب غير المستقر لكل ذلك: تعاون أصبح اعتماداً، صداقة تحولت إلى نظام عاطفي. زوجان؟ منذ الموت العنيف للمصور السويسري، يجيب Moreu: «اسألوه.» على أي حال، بعد اختفائه، لا شيء يتوقف — على العكس، كل شيء يتكثف. العمل يصبح طريقة للإمساك، التحرير طريقة للإطالة، الكتابة طريقة لعدم الاستسلام. يلتزم بالحفاظ على عمله وتثمينه، خاصة من خلال الإعداد لنشر دراسة Made by… Simon Schwyzer.\n\nفي عام 2017، بدعم من Enrico Navarra، أسس Éditions Sébastien Moreu، هيكلاً مستقلاً مكرساً لكتب الفن والمقالات والمشاريع التحريرية المستعرضة. ذكرى المصور السويسري ستدمر المؤسسة. ليس المشاريع.\n\nلاحقاً، مع André Vaszkievicz، يغير الحميم شكله مرة أخرى. I Love You Moneypenis ليس مشروعاً زخرفياً موضوعاً على علاقتهما: إنه اصطدام نص وصورة ورغبة ومال وجسد. عمل تم تصوره من داخل الرابطة، دون مرشح حامي. زواجهما، في 19 أكتوبر 2024 في Saint-Tropez، لا يستقر أي شيء: يجعل رسمياً ما كان يفيض بالفعل.\n\nعمله الخاص — كولاجات، نصوص، أجهزة تحريرية — ينتمي إلى جمالية المعرض. صحف مفتوحة، صور مقطوعة، ذاكرة تُعامل كمادة خام. لا شيء محايد. كل شيء متورط.\n\nجسدياً، يحمل جسداً لا يتعاون دائماً: قلب سريع، ضغط متقلب، نظام تحت الضغط. ومع ذلك، يستمر، بعادات تشبه أحياناً التحدي، وأحياناً اللامبالاة بالعواقب. لا رواية خلاص خاصة هنا. فقط الإصرار.\n\nيحب بشدة، يؤرشف بهوس، يعمل بشكل قهري، ويرفض تبسيط أي شيء.\n\nإذا كان هناك مبدأ موحد، فهو هذا: Sébastien Moreu لا يحل تناقضاته الخاصة، بقدر ما يبجل تناقضات الآخرين.\n\nتناقضاته الخاصة، ينظمها — ثم يعيش داخل المعرض. هذا المعرض هو منزله وذلك الذي يقدمه بأكمله لأولئك الذين يحبهم، لا شيء أبداً له.\n\nفي الختام، سيقتبس من Desproges: «مذهل، أليس كذلك؟»",vn:"André Vaszkievicz",vb:"وُلد André Francisco Vaszkievicz في 28 نوفمبر 1990 في برازيل لا تشبه كثيراً البطاقات البريدية الاستوائية. Seberi، بلدة ريفية صغيرة في جنوب البلاد، تنتمي إلى تلك المناطق التي شكلتها الهجرات الأوروبية في القرن العشرين: مجتمعات بولندية هنا، لكن أبعد قليلاً مجتمعات ألمانية وإيطالية وليتوانية… حيث تبقى اللغات والتقاليد والرقصات والكاثوليكية أحياناً بعناد أكبر مما في بلدانها الأصلية.\n\nابن سلالة بولندية وُلدت في البرازيل، ينشأ André في بيئة مهيكلة بالعمل والدين والصمت والأكواد الذكورية. آخر طفل في عائلة من ثمانية أبناء (مع شقيقة وحيدة)، وُلد بعد عشر سنوات تقريباً من أصغر إخوته الأكبر سناً، يصل إلى عائلة محفورة بالفعل بالجهد والقيود وثقل الموروثات الثقافية.\n\nمفاجأة محبوبة. محبوب لكن غير متوقع. سيكون وحيداً جداً في هذه العائلة الكبيرة.\n\nمبكراً جداً، يفهم شيئين: يشعر عميقاً بأنه في مكانه في المدرسة، وأن بعض الرغبات لا مكان لها في العالم الذي ينمو فيه.\n\nالمراهقة المثلية ليست سهلة لأي شخص، في أي مكان… لكن في هذا السياق الريفي والمحافظ، لا يُتحدث عنها حتى. الكلمة غير موجودة والرغبة تُعاش أكثر كتوتر داخلي بدلاً من هوية ممكنة.\n\nيتعلم André إذن المراقبة والصمت، التحكم في إيماءاته، لوم جسده وعواطفه.\nإنه حساس جداً للكلام وصامت جداً ليكون عاطفياً. منضبط جداً ليُجرح. مرغوب جداً ليحب ببساطة. مخدوع جداً ليبوح بذلك.\n\nلكن كانت هناك الكتب والقواميس والخرائط الجغرافية واللغات الأجنبية — عالم ورقي شبه لا نهائي بأكمله كان يسمح له بالفعل بمغادرة Seberi ذهنياً قبل أن يستطيع القيام بذلك جسدياً.\n\nبعد ما يعادل البكالوريا، متفوقاً، ستظل التعليم العالي مع ذلك بعيد المنال لحالته. يعمل André في بورتو أليغري، يكتشف بعض الحرية وشيئاً من ذاته معها، ثم يغادر البرازيل تدريجياً نحو أوروبا والعالم. ربما يمكن العثور على المزيد من الذات أبعد.\nيتعلم الإنجليزية في أيرلندا، يحصل على الجنسية الليتوانية بالنسب العائلي ويطور إتقاناً ملحوظاً للغات: البرتغالية، الإسبانية، البولندية، الفرنسية، الألمانية وعدة لغات أخرى. معظم الوقت وحيداً.\n\nعلاقته باللغات تنتمي بقدر ما إلى الأداء الأكاديمي إلى شكل من الإزاحة الوجودية: تغيير اللغة يصبح أيضاً طريقة لإزاحة الإحراج، خداع الملل، عبور الحدود وتحسين النظرة التي يلقيها على نفسه.\n\nالسنوات التالية تشبه طويلاً عبوراً متقلباً لأوروبا المعاصرة: اقتلاع، جائحة، إعادة بناء دائمة.\n\nومع ذلك يحافظ André على انضباط شبه زاهد: رياضة، عمل فكري مستمر، تحكم غذائي، أبداً كحول وفعلياً لا مخدرات. جسده يبدو معامَلاً كأنه إقليم يجب الحفاظ على وقوفه بأي ثمن.\n\nاللقاء مع Sébastien Moreu يحول هذا المسار لكنه لا يمحو جراحه… على الأقل يحاول تخفيفها. معاً يطورون I Love You Moneypenis، مشروع يمزج بين الصورة والرغبة والسيرة الذاتية والأداء. زواجهما، الذي احتُفل به في Saint-Tropez في 19 أكتوبر 2024، لا يستقر الفوضى: يعطيها ببساطة شكلاً قابلاً للعيش ومرئياً، هدنة.\n\nبالتوازي، يستأنف André دراسته في Sorbonne Nouvelle في علوم اللغة، حيث تجذب نتائجه الانتباه بسرعة، خاصة في اللغة الصينية. يقوم أيضاً بتدريب لافت في Cours Florent. الخجول يكشف نفسه لنفسه، يكتشف القوة المحررة للتعبير عن المشاعر التي يسمح بها لنفسه لأنها مكتوبة من قبل آخرين. صيف 2025، يغادر للانغماس الجامعي في تايوان؛ هذه السنة ستكون شنغهاي.\n\nشغوف بعلم التنجيم والروحانيات القديمة، منخرط في عمل علاجي عميق حول تجربته، يبقى André مع ذلك صعب التلخيص. كل شيء فيه يبدو منظماً لتحويل الجراح إلى عمارة داخلية.\n\nلكن في عيون Sébastien Moreu، الأكثر تأثيراً موجود في مكان آخر — الأكثر تأثيراً هو رؤية André يراقب زهرة برية. لأن في تلك اللحظة تنهار كل الآلية — الإتقان، الدفاع، السيطرة — ويظهر فجأة شيء نادر للغاية: نعومة سليمة نجت من كل شيء آخر.\n\nفي الختام، سيقتبس على الأرجح من Jorge Amado: «العالم يستحق فقط الانفعال الذي يقدمه لنا.» أو بشكل أكثر تأكيداً اليوم من Gisèle Pelicot: «العار يجب أن يغير المعسكر.»",prst:"مواد الصحافة",prss:"قيد الإعداد",prsc:"contact@moneypenis.com",plt:"في الصحافة",pls:"قريباً",nt:"اتصال",ns:"إرسال",n1:"الاسم",n2:"البريد الإلكتروني",n3:"رسالة",lg:"© Sébastien Moreu · © André Vaszkievicz · باريس 2024\nISBN صغير: 978-2-492649-21-9 · ISBN كبير: 978-2-492649-20-2 · INPI رقم 4999735 و 4999726 · علامة مائية رقمية",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"أعلن على شرفي أنني أبلغ من العمر 18 سنة أو أكثر وأنني بالغ وفقاً لتشريعات بلد إقامتي.",ck2:"أعترف بأن هذا الموقع يقدم أعمالاً فنية فوتوغرافية ذات طابع صريح، بما في ذلك بيع طبعات أصلية، وأوافق على الوصول إليها بوعي.",nat:"كلمة المؤلفين",naf:"يرغب المؤلفان في التحذير من أن الخفة الترفيهية للعنوان والشعار، مثل الصور والنصوص الصريحة للأعمال، يمكن أن تعطي انطباعاً بعدم المبالاة أمام موضوع جاد رغم ذلك. يذكران بأن الأمر ليس كذلك وأن هذه الحكاية وُلدت من تجاربهما الشخصية. كلاهما عاش، لأسباب وفي حقب مختلفة، جميع جوانبها.\n\nمشروعهما الفني المشترك يهدف إلى ثني أي شخص عن الانخراط في نشاط بالتحذير من أنه حتى اليوم: يغلق أبواباً أكثر مما يفتح ويعرض ممارسيه وأقاربهم لمخاطر عديدة. خاصة العدوى والأمراض، خاصة الأمراض المنقولة جنسياً، وإدمان استخدام المخدرات والكحول… هذا النشاط، بأي شكل من الأشكال، يعرض للهشاشة والتبعية والرفض الاجتماعي والعنف والابتزاز والاعتداء والإكراه والابتزاز.\n\nبالنسبة لأولئك القليلين جداً الذين يتمكنون من الخروج منه، فإنه يتطلب دائماً مرافقة نفسية طويلة الأمد، لأن مجتمعاتنا لا تترك لهم أي مخرج آخر سوى الإيذاء أو العار، أو حتى الاثنين معاً.\n\nيدعو المؤلفان إذن إلى احترام وحماية العاملين في الجنس. دون أن يناقشا ضرورة تجريم الزبائن، يدعوان أيضاً إلى معاملة كريمة للبؤس العاطفي، حتى اليأس، الذي يقودهم إلى انتهاك القانون. يأمل المؤلفان، من قبل عموم الجمهور كما من قبل المؤسسات، في دعم أكبر للجمعيات التي يمكن أن ترافق أولئك كما هؤلاء.\n\nلا يتعلق الأمر هنا بأي حال بإزالة المحرمات بشكل أعمى عن جميع الممارسات، ولا بإثارة فضيحة… بل بتذكير الإلحاح للتخلص من المحظورات الاجتماعية التي تجمد نقاشاً عاماً يجب أن يكون مع ذلك هادئاً، وليس مغطى بثوب أخلاقي ليس له ما يفعله هنا ويعيق كل تحرر للكلام. ليس لديهما أي شك في أنه إذا كان هناك حجاب يجب طرده، فهذا هو.\n\nوبالنقاش، يقصدان ذكر الأول من بين كل النقاشات، ذلك الذي يجب أن يدور داخل العائلة.\n\nثم إنه جميل… أيضاً… قضيب!\n\n(الموديل الذي اختاره الفنانان ليس عاملاً في الجنس. مشاركاً حياته مع أحد المؤلفين، أصرّ على البقاء مجهول الهوية.)\n\nإذا تناول المؤلفان هذا الموضوع الذي يخصهما، فلأنه بدا لهما أنه في عصرنا للاتصال المنمط، رقابة الشبكات وعودة الاحتشام، أصبح أكثر من أي وقت مضى ضرورياً تقديم وجهة نظر إبداعية وفنية تبقى غريباً غائبة. أرادا منح هذا الكل في آن واحد الخفة التي يجب أن تسود عند ذكر الحب والمتعة، والوزن الذي تفرضه الوقائع المعاشة: بشجاعة ودون شفقة.\n\nليس في نيتهما الحلول محل الاختيارات الفردية، ولا القوانين السارية في البلدان ذات السيادة ولا القيم التي يحق لكل شخص الالتزام بها.\n\nفي فرنسا — وليس هذا حال جميع البلدان، حتى الديمقراطية منها — تحسنت الردود التي تقدمها الشرطة والعدالة، في الإطار القانوني لمكافحة أساسية للاتجار بالبشر، عبر السنين في اتجاه ما يُتوقع من بلد حديث. لكنهما تفعلان ذلك في الإطار العام ولا تقدمان، ربما ليس دورهما، تحسناً للحالات الفردية التي يعيشها كل من العاملين في الجنس وزبائنهم. تقوم الجمعيات بشكل سري بمهامها رغم ضعف وسائلها.\n\nبالنسبة للإدارات المعنية كما للجمعيات، توجد مواقع إنترنت. بعضها مفيد جداً مختار ومتاح في قائمة محدثة بانتظام على موقعنا الإلكتروني الخاص: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"طبعات فردية",siCh:"اختر الحجم",siInq:"استفسار",siNote:"الأسعار باليورو شاملة الضريبة الفرنسية. التغليف والشحن والتأمين بسعر التكلفة الحقيقية.",siCont:"للاقتناء، اكتب إلى smoreu@mac.com — أو عبر نموذج الاتصال",siPro:"للمكتبات وتجار الفن والمعارض — اكتبوا لنا للحصول على الشروط المهنية والمعارض والإيداعات.",siRgpd:"ستُستخدم بياناتك حصراً لاستفسارك ولإطلاعك على أخبار مشاريع الفنانين.",siPick:"انقر على مطبوعة لرؤيتها وشرائها",req:"إرسال طلب",reqAge:"هذا القسم مخصّص للبالغين فقط.",shPfD:"30 × 40 سم · 50 نسخة مرقمة وموقّعة",shGfD:"50 × 70 سم · 15 نسخة مرقمة وموقّعة",shUn:"مطبوعات مفردة",shUnD:"كل مطبوعة متوفرة بالمقاس الصغير أو الكبير · موقّعة من S.M. & A.V.",fFirstName:"الاسم الأول",fPhone:"الهاتف",fCountry:"البلد",fLangPref:"لغة الرد",fPref:"وسيلة الاتصال المفضّلة",fMatrix:"موضوع الطلب",fMatrixHint:"ضع علامة في الخانات المناسبة",fMsgPh:"تفاصيل (بحد أقصى 500 حرف)",fConsent:"أقبل الشروط أعلاه وإرسال بياناتي إلى Sébastien Moreu و André Vaszkievicz.",fSent:"تم إرسال الطلب. ستصلك الإجابة على العنوان المُشار إليه.",fError:"فشل الإرسال. يمكنك الكتابة مباشرة إلى smoreu@mac.com.",rqInfo:"معلومات",rqBuy:"شراء",rqDeposit:"إيداع",rqPro:"تجارة",rqColl:"جامع تحف",rqOther:"آخر",continueShop:"متابعة التصفّح",nax:"اقرأ النص الكامل ▾",nac:"طيّ ▴",aiWarn:"تنبيه: هذه الترجمة من إنتاج الذكاء الاصطناعي وقد تحتوي على أخطاء أو سوء فهم",rqAcq:"التوفر وشروط الاقتناء",rqPress:"الصحافة",rqInfo2:"معلومات عامة",rqPro2:"محترفون · موزعون",rqOther2:"متفرقات",shopPortPF:"بورتفوليو · مقاس صغير",shopPortGF:"بورتفوليو · مقاس كبير",shopSingPF:"مطبوعات مفردة · مقاس صغير",shopSingGF:"مطبوعات مفردة · مقاس كبير",priceLbl:"السعر شامل الضريبة",priceUnit:"شامل الضريبة",pricePer:"/ مطبوعة",availPort:"الأرقام من %F% إلى %T% من أصل %N% متاحة",availSingle:"من البورتفوليوهات %F% إلى %T% من أصل %N%",noChoice:"يُخصَّص رقم النسخة تلقائيًا (لا يختاره المشتري)",shopFormTitle:"تقديم طلب",shopFormSubtitle:"اختر المنتجات وطبيعة طلبك. سنرد عليك بسرعة.",shopFmtPF:"مقاس صغير · 30 × 40 سم",shopFmtGF:"مقاس كبير · 50 × 70 سم",ctTitle:"اكتب إلينا",ctSubtitle:"سؤال عن المشروع أو الفنانين أو غير ذلك — اكتب لنا، سنرد عليك.",ctSubj:"موضوع رسالتك",ctSubjProj:"مشروع I Love You Moneypenis",ctSubjArt:"الفنانون",ctSubjOther:"سؤال آخر",ctFollow:"تابعنا"},HE:{techs:["שיר · צלב זהב","מכתב בכתב יד · דיו כחול כהה · פיסול","צילום צבעוני · טקסט צהוב","הדפס ג'לטין כסף · דיו ירוקה בכתב יד","תצלום צבעוני · טקסט אדום · עניבת Hermès","צילום צבעוני · ג'ינס פתוח · טבע","תצלום בגוון ציאן · מכתב כתום בכתב יד","טקסט אדום · שחור-לבן · אזהרה רב-לשונית","מכתב בכתב יד · שטרות 50€ · ידיים","טקסט אדום · שחור-לבן · מניפסט","מכתב בכתב יד · רקע פרחוני · דיו כחול כהה"],aw:"תוכן בוטה · למבוגרים מודעים בלבד",am:"אתר זה מציג יצירות צילום אמנותיות המיועדות למבוגרים מודעים בלבד.",ap:"+ 18 שנים — גרסה מלאה",am2:"− 18 שנים — גרסה ציבורית",nav:["I Love You Moneypenis","טריילר","הקופסאות היקרות","In Situ אוהב את זה","מחיר החצילים","עטים יפים באמת…","🍆","I love you too","כאן הכל מתחיל מחדש","טושים וידיים"],navPresse:"יותר מדי כבוד לבשר מועט",hl:"מהדורה מוגבלת · הדפסי ג'לטין כסף מקוריים",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"פריז, 2024",hd:"אגדת פופ-פורנו גאה, למבוגרים מודעים.\nאוסף La Grande Librairie de Saint-Tropez®",hc:"להיכנס ליצירה",pt:"I Love You Moneypenis",ps:"11 הדפסי ג'לטין כסף מקוריים · Traphot, Montrouge\nחתומים וממוספרים על ידי Sébastien Moreu ו-André Vaszkievicz",mg:"לחץ להגדלה",tech_info:"2024 · 30 × 40 ס\"מ (50 עותקים) · 50 × 70 ס\"מ (15 עותקים) · הדפס ג'לטין כסף · Traphot, Montrouge",pl0:"2024 · 30 × 40 ס\"מ (50 עותקים) · 50 × 70 ס\"מ (15 עותקים) · הדפסה על נייר Arches · ממוספר וחתום ביד על ידי שני האמנים",op:"פתיחה",tx:"טקסט",pr:"יצירה מוגנת · סימן מים דיגיטלי",ct:"הקופסה",cs:"תיק עבודות מלא · 11 הדפסי ג'לטין כסף · חתומים וממוספרים · כפפות כלולות",zt:"In Situ",zs:"היצירות במצבן",vt:"סרט",vs:"תוכן למבוגרים מודעים בלבד",st:"רכישה",pft:"פורמט קטן  30 × 40 ס\"מ",pfc:"50 תיקי עבודות ממוספרים 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"פורמט גדול  50 × 70 ס\"מ",gfc:"15 תיקי עבודות ממוספרים 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"חתום S.M. & A.V. · מספר על כל הדפס · כפפות כלולות",pd:"Traphot, Montrouge",p1:"פורטפוליו פורמט קטן · מלא",p2:"הדפס בודד · פורמט קטן",p3:"פורטפוליו פורמט גדול · מלא",p4:"הדפס בודד · פורמט גדול",sh:"משלוח וביטוח",sb:"אריזה מוזיאלית · DHL Express\nצרפת 45 € · אירופה 95 € · בינלאומי 180 €\nביטוח כלול",py:"תשלום",pb:"העברה בנקאית · כרטיס · PayPal · 3 תשלומים ללא ריבית",co:"תנאים",cb:"תעודת אותנטיות · החזרה תוך 14 יום · מע\"מ לפי מדינה",rv:"הזמן",by:"רכישה",bt:"על עטים וידיים",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — המזכיר לנו, כסוג של השלמה סגנונית, שכולם תמיד קראו לו Sébastien — הוא מה שקורה כשמשמעת ורצון מסרבים לאלף אובססיה.\n\nנולד ב-25 בדצמבר 1972 בתפאורה מושלמת מדי מכדי להיות תמימה — Saint-Tropez — הוא גדל בצל הדיוק, אב רופא שיניים המעצב פיות, והמיתוס: לוחמי התנגדות, ימאים, נעדרים, רוחות משפחתיות המסרבות להישאר קבורות. בגיל עשר, מוסרים לו ארסנל שלם של ציור. לא צעצוע. נשק טעון ראשון — תחילתו של אוסף בארוקי, של משוגע המלחמות האינטימיות.\n\nהוא לא יחזיר אותם לעולם. מעדיף להרבות את שדות הקרב שלו.\n\nהוא מתקדם דרך תזוזות עוקבות: ציור, ספרים, תמונות, יחסי אנוש — הכל הופך לחומר, הכל ניתן להרכיב מחדש. מה שהוא בונה אינו יצירה במובן הקלאסי, אלא שדה של מתחים: בין זיכרון להמצאה, נאמנות לבגידה, שליטה לאובדן.\n\nהוא לא עובד עבור המוסדות. הוא חודר אליהם. מאז שנות ה-90, במסלול של בעל הגלריה Enrico Navarra, הוא בונה קריירה הדוחה תוויות: לא לגמרי שכיר, לא לגמרי אמן, לא מוציא לאור פשוט — אלא חריגה פרודוקטיבית, מסוגלת ליצור ספרים, תערוכות, קישורים, ארכיונים, רעיונות, תקשורת, אירועים, בקצב מסחרר ובו-בזמן בלתי רציף. אי-סדר המשמש כהסוואה לאיש הזה שהורס בשיטתיות את כל המסגרות שאמורות להכיל אותו.\n\nהוא משתתף באופן פעיל בעיצוב ובפיתוח של אוסף Made By…, פרויקט עריכה בינלאומי המוקדש ליצירה עכשווית דרך זירות תרבותיות שונות. במסגרת זו, הוא משתף פעולה באופן הדוק עם הצלם Simon Schwyzer.\n\nמערכת היחסים שלו עם Simon Schwyzer היא הלב הבלתי יציב של כל זאת: שיתוף פעולה שהפך לתלות, ידידות שהשתנתה למערכת אהבה. זוג? מאז מותו האלים של הצלם השוויצרי, Moreu עונה: «תשאלו אותו.» בכל זאת, לאחר היעלמותו, שום דבר לא נעצר — להפך, הכל מתעצם. לעבוד הופך לדרך לאחוז, לערוך לדרך להאריך, לכתוב לדרך לא להיכנע. הוא מתחייב לשמירה ולקידום של יצירתו, במיוחד דרך ההכנה לפרסום המונוגרפיה Made by… Simon Schwyzer.\n\nב-2017, בתמיכת Enrico Navarra, הקים את Éditions Sébastien Moreu, מבנה עצמאי המוקדש לספרי אמנות, מסות ופרויקטים עריכתיים רוחביים. זכרו של הצלם השוויצרי יהרוס את החברה. לא את הפרויקטים.\n\nמאוחר יותר, עם André Vaszkievicz, האינטימי משנה צורה שוב. I Love You Moneypenis אינו פרויקט דקורטיבי המונח על מערכת היחסים שלהם: זוהי התנגשות של טקסט, תמונה, תשוקה, כסף, גוף. יצירה הגויה מתוך הקשר, ללא מסנן מגן. נישואיהם, ב-19 באוקטובר 2024 ב-Saint-Tropez, אינם מייצבים דבר: הם הופכים רשמי את מה שכבר גלש.\n\nעבודתו שלו — קולאז'ים, טקסטים, מערכים עריכתיים — שייכת לאסתטיקה של תצוגה. עיתונים פתוחים, תמונות גזורות, זיכרון המטופל כחומר גלם. שום דבר אינו ניטרלי. הכל מעורב.\n\nפיזית, הוא נושא גוף שאינו תמיד משתף פעולה: לב מהיר, לחץ דם הפכפך, מערכת תחת לחץ. ובכל זאת, הוא ממשיך, עם הרגלים הדומים לפעמים להתרסה, לפעמים לאדישות לתוצאות. אין כאן נרטיב משלו של גאולה. רק ההתמדה.\n\nהוא אוהב באינטנסיביות, מארכב באובססיביות, עובד בכפייתיות, ומסרב לפשט שום דבר.\n\nאם קיים עיקרון מאחד, זהו: Sébastien Moreu אינו פותר את הסתירות שלו, כל כך הוא מעריץ את אלו של האחרים.\n\nאת שלו, הוא מארגן — ואז חי בתוך התצוגה. הגלריה הזו היא ביתו ואותו הוא מציע במלואו לאלו שהוא אוהב, שום דבר לעולם אינו עבורו.\n\nלסיכום, הוא יצטט את Desproges: «מדהים, לא?»",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz נולד ב-28 בנובמבר 1990 בברזיל שכמעט אינה דומה לגלויות הטרופיות. Seberi, עיירה כפרית קטנה בדרום המדינה, שייכת לאותם שטחים שעוצבו על ידי ההגירות האירופאיות של המאה ה-20: קהילות פולניות כאן, אך מעט הלאה גרמניות, איטלקיות, ליטאיות… שם שפות, מסורות, ריקודים וקתוליות שורדים לעיתים בעיקשות גדולה יותר מאשר בארצות המוצא שלהם.\n\nבן של צאצאי פולנים שנולדו בברזיל, André גדל בסביבה מובנית על ידי עבודה, דת, שתיקות וקודים גבריים. ילד אחרון במשפחה של שמונה (עם אחות יחידה), שנולד כמעט עשר שנים אחרי הצעיר מבכוריו, הוא מגיע למשפחה כבר מסומנת על ידי מאמץ, אילוצים ומשקל המורשת התרבותית.\n\nהפתעה אהובה. אהוב אך לא צפוי. הוא יהיה בודד מאוד במשפחה הגדולה הזו.\n\nמוקדם מאוד, הוא מבין שני דברים: הוא מרגיש עמוקות במקומו בבית הספר, וחלק מהתשוקות אין להן מקום בעולם שבו הוא גדל.\n\nגיל ההתבגרות הגאה אינו קל לאף אחד, בשום מקום… אך בהקשר הכפרי והשמרני הזה, אפילו לא מדברים על זה. המילה אינה קיימת והתשוקה נחווית יותר כמתח פנימי מאשר כזהות אפשרית.\n\nAndré לומד אם כן להתבונן ולשתוק, לשלוט במחוותיו, להאשים את גופו ואת רגשותיו.\nהוא רגיש מדי מכדי לדבר ושותק מדי מכדי להיות סנטימנטלי. ממושמע מדי מכדי לא להיפצע. רצוי מדי מכדי לאהוב בפשטות. נבגד מדי מכדי להפקיד זאת.\n\nאך היו ספרים, מילונים, מפות גיאוגרפיות, שפות זרות — עולם נייר כמעט אינסופי שלם שכבר אפשר לו לעזוב את Seberi מנטלית לפני שיכול לעשות זאת פיזית.\n\nאחרי שווה הערך לבגרות, מבריק, ההשכלה הגבוהה תיוותר בכל זאת מחוץ להישג ידו לתנאיו. André עובד בפורטו אלגרי, מגלה קצת חופש וקצת מעצמו איתה, ואז עוזב בהדרגה את ברזיל לטובת אירופה והעולם. אולי רחוק יותר אפשר למצוא יותר מעצמו.\nהוא לומד אנגלית באירלנד, מקבל אזרחות ליטאית בזכות מוצא משפחתי ומפתח שליטה מרשימה בשפות: פורטוגזית, ספרדית, פולנית, צרפתית, גרמנית ומספר אחרות. רוב הזמן לבד.\n\nהיחס שלו לשפות שייך באותה מידה להישג אקדמי כמו לצורה של תזוזה קיומית: לשנות שפה הופך גם לדרך להזיז את המבוכה, להוליך שולל את השעמום, לחצות את הגבולות ולשפר את המבט שהוא מטיל על עצמו.\n\nהשנים הבאות מזכירות זמן רב חציה רעועה של אירופה העכשווית: עקירה, מגפה, בנייה מחדש קבועה.\n\nובכל זאת André שומר על משמעת כמעט סגפנית: ספורט, עבודה אינטלקטואלית קבועה, בקרה תזונתית, לעולם לא אלכוהול וכמעט שום סמים. גופו נראה כמטופל כשטח שיש לשמור על עמידתו בכל מחיר.\n\nהמפגש עם Sébastien Moreu מעצב מחדש מסלול זה אך אינו מוחק את פצעיו… לפחות מנסה להקל עליהם. יחד הם מפתחים את I Love You Moneypenis, פרויקט המערבב בין תמונה, תשוקה, אוטוביוגרפיה והופעה. נישואיהם, שנחגגו ב-Saint-Tropez ב-19 באוקטובר 2024, אינם מייצבים את הכאוס: הם פשוט מעניקים לו צורה ניתנת לחיים וגלויה, רגיעה.\n\nבמקביל, André חוזר ללימודים ב-Sorbonne Nouvelle במדעי השפה, שם תוצאותיו מושכות במהירות תשומת לב, במיוחד בסינית. הוא גם משלים התמחות מצוינת ב-Cours Florent. הביישן חושף את עצמו לעצמו, מגלה את הכוח המשחרר של הבעת רגשות שהוא מאפשר לעצמו מכיוון שהם נכתבים על ידי אחרים. בקיץ 2025, הוא יוצא לטבילה אקדמית בטייוואן; השנה זו תהיה שנגחאי.\n\nנלהב מאסטרולוגיה ורוחניות עתיקה, מעורב בעבודה טיפולית עמוקה סביב חוויית חייו, André נשאר בכל זאת קשה לסכם. הכל בו נראה מאורגן כדי להפוך פצעים לאדריכלות פנימית.\n\nאך בעיניו של Sébastien Moreu, המרגש ביותר נמצא במקום אחר — המרגש ביותר הוא להתבונן ב-André מתבונן בפרח בר. כי אז כל המכניזם קורס — השליטה, ההגנה, השליטה — ופתאום מופיע מחדש משהו נדיר ביותר: עדינות שלמה ששרדה את כל השאר.\n\nלסיכום, הוא בוודאי יצטט את Jorge Amado: «העולם שווה רק את הריגוש שהוא נותן לנו.» או בוודאות יותר היום את Gisèle Pelicot: «הבושה צריכה להחליף מחנה.»",prst:"חומרי תקשורת",prss:"בהכנה",prsc:"contact@moneypenis.com",plt:"בתקשורת",pls:"בקרוב",nt:"יצירת קשר",ns:"שליחה",n1:"שם",n2:"אימייל",n3:"הודעה",lg:"© Sébastien Moreu · © André Vaszkievicz · פריז 2024\nISBN קטן: 978-2-492649-21-9 · ISBN גדול: 978-2-492649-20-2 · INPI מס' 4999735 ו-4999726 · סימן מים דיגיטלי",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"אני מצהיר בכבוד שאני בן 18 או יותר ובגיר על פי חוקי ארץ מגוריי.",ck2:"אני מכיר בכך שאתר זה מציג יצירות צילום אמנותיות בעלות אופי בוטה, כולל מכירת הדפסים מקוריים, ומסכים לגשת אליהן בידיעה.",nat:"דבר היוצרים",naf:"המחברים מבקשים להזהיר שהקלילות המבדרת של הכותרת והלוגו, כמו גם הוויזואלים והטקסטים הבוטים של היצירות, עלולים לתת רושם של זלזול נוכח נושא חמור בכל זאת. הם מזכירים שזה לא המקרה ושסיפור זה נולד מהחוויות האישיות שלהם. שניהם חוו, מסיבות ובתקופות שונות, את כל היבטיו.\n\nהפרויקט האמנותי המשותף שלהם מתכוון להניא כל אחד מלהיכנס לפעילות זו על ידי אזהרה שעוד היום: היא סוגרת יותר דלתות משהיא פותחת וחושפת את העוסקים בה ואת קרוביהם לסיכונים רבים. במיוחד זיהומים ומחלות, במיוחד מחלות מין, התמכרויות לסמים ואלכוהול… פעילות זו, בכל צורה שהיא, חושפת לרעועות, תלות, דחייה חברתית, אלימות, סחיטה, התעללות, כפייה וסחיטה.\n\nעבור אלו, מעטים מדי, שמצליחים לצאת ממנה, היא דורשת תמיד ליווי פסיכולוגי לטווח ארוך מאוד, עד כדי כך החברות שלנו לא משאירות להם יציאות אחרות מלבד הקרבה או בושה, או שניהם יחד.\n\nהמחברים קוראים אם כן לכבוד ולהגנה על עובדי המין. מבלי להתווכח על הצורך בהפללת לקוחות, הם קוראים גם ליחס מכובד לסבל הרגשי, אפילו לייאוש, המוביל אותם להפר את החוק. המחברים מקווים, מצד הציבור הרחב כמו מצד המוסדות, לתמיכה גדולה יותר באגודות המסוגלות ללוות את אלו כמו את אלה.\n\nאין מדובר כאן בשום אופן בהסרה עיוורת של טאבו מכל המנהגים, ואף לא ביצירת שערורייה… אלא בהזכרת הדחיפות להיפטר מאיסורים חברתיים שמקשיחים דיון ציבורי שאמור בכל זאת להיות שלוו, ולא מכוסה באדרת מוסרנית שאין לה מה לעשות שם והמונעת כל שחרור של הדיבור. אין להם כל ספק שאם יש צעיף שצריך לגרש, זה זה.\n\nובדיון, הם מתכוונים להזכיר את הראשון מכולם, זה שאמור להתקיים בתוך המשפחה.\n\nואז זה יפה… גם… זין!\n\n(הדוגמן שנבחר על ידי האמנים אינו עובד מין. חולק את חייו עם אחד המחברים, הוא ביקש להישאר אנונימי.)\n\nאם המחברים נגעו בנושא זה הנוגע להם, זה משום שנראה להם שבעידן שלנו של תקשורת מתוקננת, צנזורה של רשתות ותחיית הצניעות, היה יותר מתמיד הכרחי להביא נקודת מבט יצירתית ואמנותית הנשארת באופן מוזר נעדרת. הם רצו להעניק למכלול זה בו-בזמן את הקלילות שאמורה לשרור כשמדברים על אהבה והנאה, ואת הכובד שהמציאויות הנחוות מטילות: באומץ וללא פאתוס.\n\nאין בכוונתם לתפוס את מקום הבחירות האישיות, ואף לא של החוקים התקפים במדינות ריבוניות או של הערכים שכל אחד חופשי להחזיק בהם.\n\nבצרפת — וזה לא המקרה בכל המדינות, אפילו הדמוקרטיות — התשובות שמספקות המשטרה והצדק, במסגרת החוקית של מאבק חיוני נגד סחר בבני אדם, השתפרו לאורך השנים בכיוון של מה שמצופה ממדינה מודרנית. אך הן עושות זאת במסגרת הכללית ואינן מביאות, אולי זה לא תפקידן, שיפור למצבים האישיים שחווים הן עובדי המין הן לקוחותיהם. אגודות ממלאות בצורה דיסקרטית את משימותיהן למרות חולשת אמצעיהן.\n\nהן עבור המנהלות הרלוונטיות הן עבור האגודות, קיימים אתרי אינטרנט. חלק מהמועילים מאוד נבחרים וזמינים ברשימה המתעדכנת באופן קבוע באתר האינטרנט שלנו: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"הדפסים בודדים",siCh:"בחר גודל",siInq:"לפנייה",siNote:"מחירים ביורו, כולל מע\"מ צרפתי. אריזה, משלוח וביטוח לפי עלות בפועל.",siCont:"לרכישה, כתוב לנו אל smoreu@mac.com — או דרך טופס יצירת קשר",siPro:"מוכרי ספרים, סוחרי אמנות וגלריות — כתבו לנו לתנאים מקצועיים, תערוכות ופיקדונות.",siRgpd:"פרטיך יישמרו רק לצורך פנייתך וקבלת מידע על פרויקטים של האמנים.",siPick:"הקש על הדפס כדי לראותו ולרכוש אותו",req:"שלח בקשה",reqAge:"מדור זה מיועד לבגירים בלבד.",shPfD:"30 × 40 ס\"מ · 50 הדפסים ממוספרים וחתומים",shGfD:"50 × 70 ס\"מ · 15 הדפסים ממוספרים וחתומים",shUn:"הדפסים בודדים",shUnD:"כל הדפס זמין בפורמט קטן או גדול · חתום S.M. & A.V.",fFirstName:"שם פרטי",fPhone:"טלפון",fCountry:"מדינה",fLangPref:"שפת מענה",fPref:"אופן התקשרות מועדף",fMatrix:"נושא הפנייה",fMatrixHint:"סמן את התיבות הרלוונטיות",fMsgPh:"פרטים (עד 500 תווים)",fConsent:"אני מסכים לתנאים שלעיל ולהעברת פרטיי אל Sébastien Moreu ו-André Vaszkievicz.",fSent:"הפנייה נשלחה. תקבל תשובה לכתובת שצוינה.",fError:"השליחה נכשלה. ניתן לכתוב ישירות אל smoreu@mac.com.",rqInfo:"מידע",rqBuy:"רכישה",rqDeposit:"פיקדון",rqPro:"מסחר",rqColl:"אספן",rqOther:"אחר",continueShop:"להמשיך לעיין",nax:"לקרוא הכל ▾",nac:"לכווץ ▴",aiWarn:"שים לב: תרגום זה נוצר על ידי בינה מלאכותית ועלול להכיל שגיאות או אי הבנות",rqAcq:"זמינות ותנאי רכישה",rqPress:"עיתונות",rqInfo2:"מידע כללי",rqPro2:"מקצועי · משווקים",rqOther2:"אחר",shopPortPF:"פורטפוליו · פורמט קטן",shopPortGF:"פורטפוליו · פורמט גדול",shopSingPF:"הדפסים בודדים · פורמט קטן",shopSingGF:"הדפסים בודדים · פורמט גדול",priceLbl:"מחיר כולל מע״מ",priceUnit:"כולל מע״מ",pricePer:"/ הדפס",availPort:"מספרים %F%–%T% מתוך %N% זמינים",availSingle:"מהפורטפוליו %F%–%T% מתוך %N%",noChoice:"מספר ההדפס נקבע אוטומטית (הקונה אינו בוחר)",shopFormTitle:"הגשת בקשה",shopFormSubtitle:"בחר את המוצרים ואת סוג הפנייה. ניצור איתך קשר בהקדם.",shopFmtPF:"פורמט קטן · 30 × 40 ס״מ",shopFmtGF:"פורמט גדול · 50 × 70 ס״מ",ctTitle:"כתוב לנו",ctSubtitle:"שאלה על הפרויקט, על האמנים או אחר — כתוב לנו, ואנחנו נחזור אליך.",ctSubj:"נושא ההודעה",ctSubjProj:"הפרויקט I Love You Moneypenis",ctSubjArt:"האמנים",ctSubjOther:"שאלה אחרת",ctFollow:"עקוב אחרינו"},FA:{techs:["شعر · صلیب طلایی","نامه دست‌نویس · جوهر آبی تیره · مجسمه","عکس رنگی · متن زرد","چاپ ژلاتین نقره · جوهر سبز دست‌نویس","عکس رنگی · متن قرمز · کراوات Hermès","عکس رنگی · شلوار جین باز · طبیعت","عکس با ته‌رنگ فیروزه‌ای · نامه نارنجی دست‌نویس","متن قرمز · سیاه و سفید · هشدار چندزبانه","نامه دست‌نویس · اسکناس‌های 50 یورو · دست‌ها","متن قرمز · سیاه و سفید · بیانیه","نامه دست‌نویس · پس‌زمینه گل‌دار · جوهر آبی تیره"],aw:"محتوای صریح · فقط برای بزرگسالان آگاه",am:"این سایت آثار هنری عکاسی را به نمایش می‌گذارد که برای بزرگسالان آگاه در نظر گرفته شده است.",ap:"+ 18 سال — نسخه کامل",am2:"− 18 سال — نسخه عمومی",nav:["I Love You Moneypenis","تیزر","صندوقچه‌های گرانبها","In Situ دوست داری","بهای بادمجان‌ها","قلم‌های زیبا، حقیقتاً…","🍆","I love you too","اینجا همه چیز از نو آغاز می‌شود","ماژیک‌ها و دست‌ها"],navPresse:"افتخارات بسیار برای گوشتی اندک",hl:"ویرایش محدود · چاپ‌های ژلاتین نقره اصل",ht:"I Love You\nMoneypenis",hs:"Sébastien Moreu & André Vaszkievicz",hy:"پاریس، 2024",hd:"یک افسانه پاپ پورن همجنس‌گرا، برای بزرگسالان آگاه.\nمجموعه La Grande Librairie de Saint-Tropez®",hc:"ورود به اثر",pt:"I Love You Moneypenis",ps:"11 چاپ ژلاتین نقره اصل · Traphot، Montrouge\nامضا و شماره‌گذاری شده توسط Sébastien Moreu و André Vaszkievicz",mg:"برای بزرگنمایی کلیک کنید",tech_info:"2024 · 30 × 40 سانتی‌متر (50 نسخه) · 50 × 70 سانتی‌متر (15 نسخه) · چاپ ژلاتین نقره · Traphot، Montrouge",pl0:"2024 · 30 × 40 سانتی‌متر (50 نسخه) · 50 × 70 سانتی‌متر (15 نسخه) · چاپ روی کاغذ Arches · شماره‌گذاری و امضا شده با دست توسط هر دو هنرمند",op:"افتتاح",tx:"متن",pr:"اثر محافظت‌شده · واترمارک دیجیتال",ct:"جعبه",cs:"پورتفولیو کامل · 11 چاپ ژلاتین نقره · امضا و شماره‌گذاری شده · دستکش شامل",zt:"In Situ",zs:"آثار در موقعیت",vt:"فیلم",vs:"محتوای فقط برای بزرگسالان آگاه",st:"تملک",pft:"اندازه کوچک  30 × 40 سانتی‌متر",pfc:"50 پورتفولیو شماره‌گذاری شده 01/50 → 50/50",pfi:"ISBN: 978-2-492649-21-9",gft:"اندازه بزرگ  50 × 70 سانتی‌متر",gfc:"15 پورتفولیو شماره‌گذاری شده 01/15 → 15/15",gfi:"ISBN: 978-2-492649-20-2",sg:"امضا S.M. & A.V. · شماره روی هر چاپ · دستکش شامل",pd:"Traphot، Montrouge",p1:"پورتفولیو قطع کوچک · کامل",p2:"چاپ تکی · قطع کوچک",p3:"پورتفولیو قطع بزرگ · کامل",p4:"چاپ تکی · قطع بزرگ",sh:"حمل و نقل و بیمه",sb:"بسته‌بندی موزه‌ای · DHL Express\nفرانسه 45 € · اروپا 95 € · بین‌المللی 180 €\nبیمه شامل",py:"پرداخت",pb:"حواله · کارت · PayPal · 3 قسط بدون بهره",co:"شرایط",cb:"گواهی اصالت · بازگشت در 14 روز · مالیات بر اساس کشور",rv:"رزرو",by:"تملک",bt:"از قلم‌ها و دست‌ها",sn:"Sébastien Moreu",sb2:"Jean Sébastien Moreu — کسی که به ما به عنوان نوعی تسلیم سبکی یادآوری می‌کند که همه او را همیشه Sébastien صدا کرده‌اند — همان چیزی است که وقتی نظم و اراده از رام کردن وسواس امتناع می‌کنند، اتفاق می‌افتد.\n\nمتولد 25 دسامبر 1972 در یک صحنه‌آرایی بیش از حد کامل برای اینکه بی‌گناه باشد — Saint-Tropez — او در سایه دقت رشد می‌کند، پدری دندان‌پزشک که دهان‌ها را شکل می‌دهد، و در سایه افسانه: مقاومان، دریانوردان، گمشدگان، ارواح خانوادگی که از دفن ماندن سر باز می‌زنند. در ده سالگی، یک زرادخانه کامل از نقاشی به او تحویل داده می‌شود. اسباب‌بازی نیست. اولین سلاح بارگذاری شده — آغاز یک مجموعه باروک، مجموعه دیوانه‌ای از جنگ‌های صمیمانه.\n\nاو هرگز آن‌ها را پس نخواهد داد. ترجیح می‌دهد میدان‌های نبرد خود را افزایش دهد.\n\nاو از طریق جابجایی‌های متوالی پیش می‌رود: نقاشی، کتاب‌ها، تصاویر، روابط انسانی — همه چیز ماده می‌شود، همه چیز می‌تواند دوباره ساخته شود. آنچه او می‌سازد یک اثر به معنای کلاسیک نیست، بلکه میدانی از تنش‌هاست: بین حافظه و اختراع، وفاداری و خیانت، کنترل و از دست دادن.\n\nاو برای نهادها کار نمی‌کند. به آن‌ها نفوذ می‌کند. از دهه 90، در مدار گالریست Enrico Navarra، او حرفه‌ای می‌سازد که برچسب‌ها را رد می‌کند: نه کاملاً کارمند، نه کاملاً هنرمند، نه ناشر ساده — بلکه یک ناهنجاری مولد، قادر به تولید کتاب‌ها، نمایشگاه‌ها، پیوندها، آرشیوها، ایده‌ها، ارتباطات، رویدادها، با ریتمی به همان اندازه نفس‌گیر و ناپیوسته. یک بی‌نظمی که به عنوان استتار برای این مرد عمل می‌کند که به طور سیستماتیک تمام چهارچوب‌هایی را که قرار است او را در بر گیرند، نابود می‌کند.\n\nاو فعالانه در طراحی و توسعه مجموعه Made By… شرکت می‌کند، یک پروژه ویرایشی بین‌المللی اختصاص یافته به آفرینش معاصر از طریق صحنه‌های فرهنگی مختلف. در این چارچوب، او از نزدیک با عکاس Simon Schwyzer همکاری می‌کند.\n\nرابطه او با Simon Schwyzer قلب ناپایدار همه آن است: همکاری که به وابستگی تبدیل شد، دوستی که به سیستم عاشقانه تبدیل شد. یک زوج؟ از زمان مرگ خشن عکاس سوئیسی، Moreu پاسخ می‌دهد: «از او بپرسید.» در هر صورت، پس از ناپدید شدن او، هیچ چیز متوقف نمی‌شود — برعکس، همه چیز شدت می‌گیرد. کار کردن راهی برای نگه داشتن می‌شود، ویرایش راهی برای تمدید، نوشتن راهی برای تسلیم نشدن. او متعهد به حفظ و ترویج اثر خود می‌شود، به ویژه از طریق آماده‌سازی انتشار مونوگرافی Made by… Simon Schwyzer.\n\nدر سال 2017، با حمایت Enrico Navarra، او Éditions Sébastien Moreu را تأسیس کرد، یک ساختار مستقل اختصاص یافته به کتاب‌های هنری، مقالات و پروژه‌های ویرایشی عرضی. یاد عکاس سوئیسی شرکت را نابود خواهد کرد. نه پروژه‌ها را.\n\nبعدها، با André Vaszkievicz، صمیمیت دوباره شکل می‌گیرد. I Love You Moneypenis یک پروژه دکوراتیو نیست که روی رابطه آن‌ها قرار گرفته باشد: این یک برخورد متن، تصویر، آرزو، پول، بدن است. اثری که از درون پیوند طراحی شده، بدون فیلتر محافظ. ازدواج آن‌ها، در 19 اکتبر 2024 در Saint-Tropez، هیچ چیز را تثبیت نمی‌کند: آنچه را که قبلاً سرریز می‌شد، رسمی می‌کند.\n\nکار خود او — کلاژها، متون، تجهیزات ویرایشی — به زیبایی‌شناسی نمایش تعلق دارد. روزنامه‌های باز، تصاویر بریده شده، حافظه به عنوان ماده خام تلقی می‌شود. هیچ چیز خنثی نیست. همه چیز درگیر است.\n\nاز نظر بدنی، او بدنی را حمل می‌کند که همیشه همکاری نمی‌کند: قلب سریع، فشار خون متغیر، سیستم تحت فشار. و با این حال، او ادامه می‌دهد، با عادت‌هایی که گاهی شبیه به سرکشی و گاهی شبیه به بی‌تفاوتی نسبت به عواقب است. هیچ روایت رستگاری خاصی در اینجا نیست. فقط پایداری.\n\nاو شدیداً عاشق است، وسواس‌گونه آرشیو می‌کند، اجبارگونه کار می‌کند، و از ساده کردن هر چیزی امتناع می‌کند.\n\nاگر یک اصل وحدت‌بخش وجود داشته باشد، این است: Sébastien Moreu تناقضات خود را حل نمی‌کند، آن‌قدر که تناقضات دیگران را تجلیل می‌کند.\n\nمال خود را، او سازماندهی می‌کند — سپس در داخل نمایشگاه زندگی می‌کند. این گالری خانه او و خانه‌ای است که او به طور کامل به آن‌هایی که دوست دارد تقدیم می‌کند، هیچ چیز هرگز برای او نیست.\n\nبرای نتیجه‌گیری، او از Desproges نقل قول می‌کند: «شگفت‌انگیز، اینطور نیست؟»",vn:"André Vaszkievicz",vb:"André Francisco Vaszkievicz در 28 نوامبر 1990 در برزیلی متولد شد که شباهت کمی به کارت پستال‌های گرمسیری دارد. Seberi، یک شهر کوچک روستایی در جنوب کشور، به آن سرزمین‌هایی تعلق دارد که توسط مهاجرت‌های اروپایی قرن بیستم شکل گرفته‌اند: جوامع لهستانی در اینجا، اما کمی دورتر آلمانی، ایتالیایی، لیتوانیایی… جایی که زبان‌ها، سنت‌ها، رقص‌ها و کاتولیک گاهی با سرسختی بیشتری نسبت به کشورهای مبدأ خود زنده می‌مانند.\n\nپسر اعقاب لهستانی‌های متولد در برزیل، André در محیطی رشد می‌کند که توسط کار، مذهب، سکوت‌ها و قوانین مردانه ساختار یافته است. آخرین فرزند یک خانواده هشت نفری (با یک خواهر تنها)، تقریباً ده سال بعد از کوچک‌ترین برادران بزرگ‌ترش متولد شده، او وارد خانواده‌ای می‌شود که قبلاً با تلاش، محدودیت‌ها و وزن میراث فرهنگی نشانه‌گذاری شده است.\n\nیک غیرمنتظره دوست داشته شده. دوست داشته شده اما انتظار نمی‌رفت. او در این خانواده پرجمعیت کاملاً تنها خواهد بود.\n\nبسیار زود، او دو چیز را می‌فهمد: عمیقاً در مدرسه احساس راحتی می‌کند، و برخی از خواسته‌ها جایی در دنیایی که در آن رشد می‌کند ندارند.\n\nنوجوانی همجنس‌گرایی برای هیچ‌کس، در هیچ کجا آسان نیست… اما در این زمینه روستایی و محافظه‌کارانه، حتی در مورد آن صحبت نمی‌شود. کلمه وجود ندارد و خواسته بیشتر به عنوان یک تنش درونی تجربه می‌شود تا به عنوان یک هویت ممکن.\n\nبنابراین André یاد می‌گیرد که مشاهده کند و سکوت کند، حرکات خود را کنترل کند، بدن و احساسات خود را سرزنش کند.\nاو برای صحبت بیش از حد حساس است و برای احساساتی بودن بیش از حد ساکت. برای آسیب نخوردن بیش از حد منضبط است. برای ساده عاشق شدن بیش از حد مورد تمایل است. برای اعتراف کردن به آن بیش از حد خیانت شده است.\n\nاما کتاب‌ها، فرهنگ‌های لغت، نقشه‌های جغرافیایی، زبان‌های خارجی وجود داشتند — یک دنیای کاغذی تقریباً بی‌نهایت که قبلاً به او اجازه می‌داد قبل از اینکه بتواند به صورت فیزیکی این کار را انجام دهد، Seberi را ذهنی ترک کند.\n\nپس از معادل دیپلم متوسطه، با درخشش، تحصیلات عالی همچنان برای شرایط او دست نیافتنی باقی خواهد ماند. André در پورتو آلگره کار می‌کند، کمی آزادی و کمی از خود را با آن کشف می‌کند، سپس به تدریج برزیل را به سوی اروپا و جهان ترک می‌کند. شاید دورتر بتوان خود بیشتری یافت.\nاو در ایرلند انگلیسی می‌آموزد، با تبار خانوادگی شهروندی لیتوانیایی را به دست می‌آورد و تسلط قابل توجهی بر زبان‌ها پیدا می‌کند: پرتغالی، اسپانیایی، لهستانی، فرانسوی، آلمانی و چندین زبان دیگر. بیشتر اوقات تنها.\n\nرابطه او با زبان‌ها به اندازه عملکرد آکادمیک به نوعی جابجایی وجودی تعلق دارد: تغییر زبان همچنین به راهی برای جابجا کردن دستپاچگی، فریب دادن خستگی، گذر از مرزها و بهبود نگاهی که او به خود می‌اندازد تبدیل می‌شود.\n\nسال‌های بعد برای مدت طولانی شبیه عبور ناپایدار اروپای معاصر است: ریشه‌کنی، همه‌گیری، بازسازی دائم.\n\nبا این حال André یک انضباط تقریباً ریاضت‌کشانه را حفظ می‌کند: ورزش، کار فکری مداوم، کنترل غذایی، هرگز الکل و عملاً هیچ مواد مخدری. بدن او به نظر می‌رسد به عنوان قلمرویی که باید به هر قیمتی روی پاهای خود نگه داشته شود، رفتار می‌شود.\n\nملاقات با Sébastien Moreu این مسیر را متحول می‌کند اما زخم‌های آن را پاک نمی‌کند… حداقل سعی می‌کند آن‌ها را تسکین دهد. آن‌ها با هم I Love You Moneypenis را توسعه می‌دهند، پروژه‌ای که تصویر، آرزو، خاطرات و اجرا را با هم ترکیب می‌کند. ازدواج آن‌ها، که در 19 اکتبر 2024 در Saint-Tropez جشن گرفته شد، هرج و مرج را تثبیت نمی‌کند: فقط شکل قابل زندگی و قابل مشاهده‌ای، یک استراحت، به آن می‌دهد.\n\nبه موازات آن، André تحصیلات خود را در Sorbonne Nouvelle در علوم زبان از سر می‌گیرد، جایی که نتایج او به سرعت توجه را جلب می‌کند، به ویژه در زبان چینی. او همچنین یک دوره کارآموزی برجسته در Cours Florent را به پایان می‌رساند. خجالتی به خودش آشکار می‌شود، قدرت رهایی‌بخش بیان احساساتی را کشف می‌کند که به خود اجازه می‌دهد چون توسط دیگران نوشته شده‌اند. تابستان 2025، او برای غوطه‌وری دانشگاهی به تایوان عزیمت می‌کند؛ امسال شانگهای خواهد بود.\n\nبا اشتیاق به نجوم و معنویت‌های باستانی، در یک کار درمانی عمیق در مورد تجربه خود مشغول است، André با این حال خلاصه کردنش دشوار باقی می‌ماند. به نظر می‌رسد همه چیز در او سازماندهی شده تا زخم‌ها را به معماری درونی تبدیل کند.\n\nاما در چشم Sébastien Moreu، تأثیرگذارترین چیز در جای دیگری است — تأثیرگذارترین چیز این است که André را در حال مشاهده یک گل وحشی تماشا کند. زیرا در آن زمان همه مکانیسم فرو می‌ریزد — تسلط، دفاع، کنترل — و ناگهان چیزی بسیار نادر دوباره ظاهر می‌شود: لطافتی دست‌نخورده که از همه چیز دیگر نجات یافته است.\n\nبرای نتیجه‌گیری، او احتمالاً Jorge Amado را نقل قول می‌کند: «دنیا تنها به اندازه احساسی که به ما می‌دهد، ارزش دارد.» یا با اطمینان بیشتری امروز Gisèle Pelicot را: «شرم باید اردوگاه را تغییر دهد.»",prst:"مطالب مطبوعاتی",prss:"در دست تهیه",prsc:"contact@moneypenis.com",plt:"در مطبوعات",pls:"به‌زودی",nt:"تماس",ns:"ارسال",n1:"نام",n2:"ایمیل",n3:"پیام",lg:"© Sébastien Moreu · © André Vaszkievicz · پاریس 2024\nISBN کوچک: 978-2-492649-21-9 · ISBN بزرگ: 978-2-492649-20-2 · INPI شماره 4999735 و 4999726 · واترمارک دیجیتال",si:"www.moneypenis.com",pv:"www.moneypenis.com/prevention",ck1:"من به شرافت خود اعلام می‌کنم که 18 سال یا بیشتر دارم و طبق قوانین کشور محل اقامتم بالغ هستم.",ck2:"تأیید می‌کنم که این سایت آثار هنری عکاسی با ماهیت صریح را به نمایش می‌گذارد، از جمله فروش چاپ‌های اصل، و موافقم که آگاهانه به آن دسترسی پیدا کنم.",nat:"سخن مؤلفان",naf:"نویسندگان می‌خواهند هشدار دهند که سبکی تفریحی عنوان و لوگو، مانند تصاویر و متون صریح آثار، می‌تواند تأثیری از سهل‌انگاری در مقابل یک موضوع جدی با این حال بدهد. آن‌ها یادآور می‌شوند که اینطور نیست و این داستان از تجربیات شخصی آن‌ها متولد شده است. هر دو، به دلایل و در دوران‌های مختلف، تمام جنبه‌های آن را تجربه کرده‌اند.\n\nپروژه هنری مشترک آن‌ها قصد دارد هر کسی را از درگیر شدن در فعالیتی منع کند با هشدار دادن که حتی امروز: درهای بیشتری را می‌بندد تا اینکه باز کند و کسانی را که به آن می‌پردازند و عزیزانشان را در معرض خطرات بسیاری قرار می‌دهد. به ویژه عفونت‌ها و بیماری‌ها، به‌ویژه بیماری‌های مقاربتی، اعتیاد به مصرف مواد مخدر و الکل… این فعالیت، در هر شکلی، در معرض ناپایداری، وابستگی، طرد اجتماعی، خشونت، باج‌خواهی، سوء استفاده، اجبار و اخاذی قرار می‌دهد.\n\nبرای آن‌ها، که تعدادشان بسیار کم است، که موفق به خروج از آن می‌شوند، همیشه نیاز به همراهی روانی بسیار طولانی‌مدت دارد، آن‌قدر که جوامع ما هیچ راه‌حل دیگری جز قربانی شدن یا شرم، یا هر دو با هم برای آن‌ها باقی نمی‌گذارند.\n\nبنابراین نویسندگان به احترام و حفاظت از کارگران جنسی دعوت می‌کنند. بدون اینکه ضرورت جرم‌انگاری مشتریان را زیر سؤال ببرند، آن‌ها به طور یکسان به برخورد محترمانه با بدبختی عاطفی، حتی ناامیدی، که آن‌ها را به نقض قانون می‌کشاند، دعوت می‌کنند. نویسندگان امیدوارند، از سوی عموم مردم و همچنین از سوی نهادها، حمایت بیشتری از انجمن‌هایی که می‌توانند هر دو طرف را همراهی کنند.\n\nاینجا به هیچ وجه صحبت از برداشتن کورکورانه تابوها از همه شیوه‌ها نیست، و نه ایجاد رسوایی… بلکه یادآوری ضرورت رهایی از ممنوعیت‌های اجتماعی است که یک بحث عمومی را که با این حال باید آرام باشد، خشک می‌کنند، و نه با یک لباس اخلاقی پوشانده شود که هیچ کاری در اینجا ندارد و هر نوع رهایی کلام را مانع می‌شود. آن‌ها هیچ شکی ندارند که اگر حجابی باید کنار گذاشته شود، این یکی است.\n\nو با بحث، آن‌ها قصد دارند اولین از همه را یادآور شوند، آن یکی که باید در داخل خانواده انجام شود.\n\nو پس از آن زیبا است… همچنین… یک کیر!\n\n(مدلی که توسط هنرمندان انتخاب شده، کارگر جنسی نیست. در اشتراک زندگی با یکی از نویسندگان، او اصرار کرد که ناشناس بماند.)\n\nاگر نویسندگان به این موضوع که آن‌ها را تحت تأثیر قرار می‌دهد پرداختند، به این دلیل است که به نظر آن‌ها رسید که در عصر ما با ارتباطات قالب‌بندی شده، سانسور شبکه‌ها و احیای حیا، بیش از هر زمان دیگری ضروری بود یک نقطه نظر خلاقانه و هنری ارائه شود که به طور عجیبی غایب باقی مانده است. آن‌ها می‌خواستند به این مجموعه هم سبکی را که باید هنگام بحث درباره عشق و لذت غالب باشد، و هم وزنی را که واقعیت‌های زندگی تحمیل می‌کنند، بدهند: با شجاعت و بدون احساساتی شدن.\n\nآن‌ها قصد ندارند جایگزین انتخاب‌های فردی شوند، و نه قوانین جاری در کشورهای حاکم یا ارزش‌هایی که هر کس آزاد است به آن‌ها پایبند باشد.\n\nدر فرانسه — و این مورد در همه کشورها، حتی دموکراتیک‌ها، صدق نمی‌کند — پاسخ‌های ارائه شده توسط پلیس و عدالت، در چارچوب قانونی یک مبارزه اساسی علیه قاچاق انسان، در طول سال‌ها در جهتی که از یک کشور مدرن انتظار می‌رود، بهبود یافته است. اما آن‌ها این کار را در چارچوب کلی انجام می‌دهند و، شاید این نقش آن‌ها نباشد، بهبودی به موقعیت‌های فردی که توسط کارگران جنسی و مشتریانشان تجربه می‌شود، نمی‌بخشند. انجمن‌ها با وجود ضعف امکاناتشان به طور محتاطانه مأموریت‌های خود را انجام می‌دهند.\n\nهم برای ادارات مربوطه و هم برای انجمن‌ها، سایت‌های اینترنتی وجود دارد. برخی بسیار مفید انتخاب شده و در فهرستی که به طور منظم بر روی سایت اینترنتی خودمان به‌روزرسانی می‌شود، موجود است: www.moneypenis.com · www.moneypenis.com/prevention",siPl:"چاپ‌های تکی",siCh:"اندازه را انتخاب کنید",siInq:"درخواست",siNote:"قیمت‌ها به یورو با مالیات فرانسوی. هزینه بسته‌بندی، ارسال و بیمه به قیمت تمام‌شده محاسبه می‌شود.",siCont:"برای تهیه، به smoreu@mac.com بنویسید — یا از فرم تماس استفاده کنید",siPro:"کتاب‌فروشان، فروشندگان آثار هنری و گالری‌ها — برای شرایط تجاری، نمایشگاه‌ها و امانت‌گذاری برای ما بنویسید.",siRgpd:"اطلاعات شما تنها برای درخواست شما و اطلاع‌رسانی درباره پروژه‌های هنرمندان استفاده می‌شود.",siPick:"روی یک چاپ لمس کنید تا آن را ببینید و تهیه کنید",req:"ارسال درخواست",reqAge:"این بخش فقط برای بزرگسالان است.",shPfD:"30 × 40 سانتی‌متر · 50 نسخه شماره‌گذاری و امضا شده",shGfD:"50 × 70 سانتی‌متر · 15 نسخه شماره‌گذاری و امضا شده",shUn:"چاپ‌های تکی",shUnD:"هر چاپ در قطع کوچک یا بزرگ موجود است · امضای S.M. و A.V.",fFirstName:"نام",fPhone:"تلفن",fCountry:"کشور",fLangPref:"زبان پاسخ",fPref:"روش تماس ترجیحی",fMatrix:"موضوع درخواست",fMatrixHint:"گزینه‌های مرتبط را علامت بزنید",fMsgPh:"جزئیات (حداکثر ۵۰۰ کاراکتر)",fConsent:"با شرایط فوق و انتقال اطلاعاتم به Sébastien Moreu و André Vaszkievicz موافقم.",fSent:"درخواست ارسال شد. پاسخ به آدرس اعلام‌شده فرستاده می‌شود.",fError:"ارسال ناموفق بود. می‌توانید مستقیم به smoreu@mac.com بنویسید.",rqInfo:"اطلاعات",rqBuy:"خرید",rqDeposit:"امانت",rqPro:"حرفه‌ای",rqColl:"کلکسیونر",rqOther:"دیگر",continueShop:"ادامه مرور",nax:"خواندن کامل ▾",nac:"جمع کردن ▴",aiWarn:"توجه: این ترجمه توسط هوش مصنوعی تولید شده و ممکن است حاوی اشتباهات یا سوء تفاهم باشد",rqAcq:"موجودی و شرایط خرید",rqPress:"مطبوعات",rqInfo2:"اطلاعات کلی",rqPro2:"حرفه‌ای · توزیع‌کنندگان",rqOther2:"متفرقه",shopPortPF:"پورتفولیو · قطع کوچک",shopPortGF:"پورتفولیو · قطع بزرگ",shopSingPF:"چاپ‌های تکی · قطع کوچک",shopSingGF:"چاپ‌های تکی · قطع بزرگ",priceLbl:"قیمت با مالیات",priceUnit:"با مالیات",pricePer:"/ چاپ",availPort:"شماره‌های %F% تا %T% از %N% موجود",availSingle:"از پورتفولیوهای %F% تا %T% از %N%",noChoice:"شماره چاپ به‌صورت خودکار تخصیص می‌یابد (خریدار انتخاب نمی‌کند)",shopFormTitle:"ارسال درخواست",shopFormSubtitle:"محصولات و موضوع درخواست خود را انتخاب کنید. به‌زودی پاسخ خواهیم داد.",shopFmtPF:"قطع کوچک · 30 × 40 سانتی‌متر",shopFmtGF:"قطع بزرگ · 50 × 70 سانتی‌متر",ctTitle:"با ما تماس بگیرید",ctSubtitle:"سؤالی درباره پروژه، هنرمندان یا چیز دیگر — برای ما بنویسید، پاسخ خواهیم داد.",ctSubj:"موضوع پیام شما",ctSubjProj:"پروژه I Love You Moneypenis",ctSubjArt:"هنرمندان",ctSubjOther:"سؤال دیگر",ctFollow:"ما را دنبال کنید"}};


const EDS=[
  {key:"pf",pr:{port:590,single:110},rm:{port:37,tot:50},
   avail:{portFrom:41,portTo:46,portTot:50,singleFrom:47,singleTo:50,singleTot:50}},
  {key:"gf",pr:{port:1190,single:180},rm:{port:12,tot:15},
   avail:{portFrom:11,portTo:13,portTot:15,singleFrom:14,singleTo:15,singleTot:15}}
];
// 5 types de requête (anciens : info/buy/dep/pro/col/oth — remplacés)
const REQUEST_KEYS=["rqInfo","rqAcq","rqPro","rqPress","rqOther"];
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
  
    RU: `КОМУ ЭТО МОЖЕТ КАСАТЬСЯ

Я — ОДИНОЧЕСТВО, КОТОРОЕ ЛЕЧИТ ТВОЮ ПЕЧАЛЬ
Я — ПЕЧАЛЬ, КОТОРАЯ ЛЕЧИТ ТВОЁ ОДИНОЧЕСТВО
Я — ОДЕЯНИЕ ЛЮБВИ
Я — НАГАЯ ЛЮБОВЬ
Я — ЭТО ТЕЛО, ПЕРЕОДЕТОЕ ЖЕЛАНИЯМИ
Я — ЭТО ЖЕЛАНИЕ, КОТОРОЕ ЛЕЧИТ ТВОЁ
Я — ЭТО ЖЕЛАНИЕ В БЕЗДНЕ ТВОЕГО.
Я — ЭТОТ ТОТЕМ, САМЫЙ ДРЕВНИЙ ИЗ ВСЕХ,
Я — ПЛОТЬ И КРОВЬ,
Я — КОЖА БЕЗ КОСТЕЙ.
Я — ЭТО ТАБУ, КОТОРОЕ ХОТЯТ ЗАМОЛЧАТЬ,
Я — ТАКЖЕ СМЕХ И УЛЫБКА.
Я — ЭТОТ ПОЛ, КОТОРОМУ ТЫ ПОКЛОНЯЕШЬСЯ,
Я — ИСТЕРЗАННАЯ ПЛОТЬ.
Я — ЭТО ИСКУШЕНИЕ, КОТОРОЕ ВЛЕЧЁТ ТЕБЯ,
Я — ЭТО ОТВРАЩЕНИЕ, КОТОРОЕ ОТТАЛКИВАЕТ ТЕБЯ.
Я — ОБЕЩАНИЕ, КЛЯТВА, ИСПОВЕДЬ,
Я — ЛОЖЬ И ИСТИНА.
Я — ОДИНОЧКА, ВСЕГДА ВЕРНЫЙ И ОДИНОКИЙ,
ЛЕГЕНДА И ЖИВОЕ ТЕЛО.
Я — НАСИЛИЕ, ДРАЗНЯЩАЯ НЕЖНОСТЬ,
ТОТ ДРОЖАЩИЙ ПАЛАЧ.
ОН Я — В ЭТОМ ОБРЯДЕ ВЕРНУВШИХСЯ ЯЗЫЧНИКОВ,
ВЫСОКАЯ ОБЕДНЯ ЭТОЙ ВНОВЬ ОБРЕТЁННОЙ МЕССЫ.
Я — ЗОЛОТО, КОТОРОЕ КУПИШЬ В ВЫСОКОМ КАЧЕСТВЕ
И КОТОРОЕ Я ПРОДАМ ТЕБЕ ПО САМОЙ ВЫГОДНОЙ ЦЕНЕ.
ВДОВЕЦ ОТ ПОЛУНОЧИ ДО ЗАРИ,
Я — БУМАЖНЫЙ СУПРУГ ПОД ЛОЖЕМ.
Я — МАНИФЕСТ ВАШИХ ДЕЛИКАТНЫХ КОВАРСТВ,
ХРОНИКА ВАШИХ ВНУТРЕННИХ ВОЙН.
Я — Я БОЛЬШЕ НЕ ЗНАЮ КТО,
Я — ВСЕ, КЕМ Я БЫЛ.
Я — ВСЁ ЭТО ВМЕСТЕ.
Я — ВАШ ЕДИНСТВЕННЫЙ И ВЕЛИКИЙ MONEYPENIS.`,
  
    PL: `DO WSZYSTKICH ZAINTERESOWANYCH

JESTEM SAMOTNOŚCIĄ KTÓRA LECZY TWÓJ SMUTEK
JESTEM SMUTKIEM KTÓRY LECZY TWOJĄ SAMOTNOŚĆ
JESTEM SZATĄ MIŁOŚCI
JESTEM NAGĄ MIŁOŚCIĄ
JESTEM TYM CIAŁEM PRZEBRANYM W PRAGNIENIA
JESTEM TYM PRAGNIENIEM KTÓRE LECZY TWOJE
JESTEM TYM PRAGNIENIEM W OTCHŁANI TWOJEGO.
JESTEM TYM TOTEMEM, NAJSTARSZYM ZE WSZYSTKICH,
JESTEM CIAŁEM I KRWIĄ,
JESTEM SKÓRĄ BEZ KOŚCI.
JESTEM TYM TABU KTÓRE CHCE SIĘ ZMILCZEĆ,
JESTEM TAKŻE ŚMIECHEM I UŚMIECHEM.
JESTEM TĄ PŁCIĄ KTÓRĄ CZCISZ,
JESTEM UMĘCZONYM CIAŁEM.
JESTEM POKUSĄ KTÓRA CIĘ PRZYCIĄGA,
JESTEM WSTRĘTEM KTÓRY CIĘ ODPYCHA.
JESTEM OBIETNICĄ, PRZYSIĘGĄ, WYZNANIEM,
JESTEM KŁAMSTWEM I PRAWDĄ.
JESTEM ODLUDKIEM, ZAWSZE WIERNYM I SAMOTNYM,
LEGENDĄ I ŻYWYM CIAŁEM.
JESTEM PRZEMOCĄ, DROCZĄCĄ SIĘ CZUŁOŚCIĄ,
TYM DRŻĄCYM KATEM.
ON TO JA — W TYM OBRZĄDKU POWRACAJĄCYCH POGAN,
SUMMA MSZALNA TEJ NA NOWO ODNALEZIONEJ MSZY.
JESTEM ZŁOTEM KTÓRE KUPISZ W WYSOKIEJ JAKOŚCI
A KTÓRE JA TOBIE SPRZEDAM PO NAJLEPSZEJ CENIE.
WDOWIEC OD PÓŁNOCY DO ŚWITU,
JESTEM PAPIEROWYM MAŁŻONKIEM POD ŁOŻEM.
JESTEM MANIFESTEM WASZYCH DELIKATNYCH PERFIDII,
KRONIKĄ WASZYCH WEWNĘTRZNYCH WOJEN.
JESTEM JUŻ NIE WIEM KIM,
JESTEM WSZYSTKIM CZYM BYŁEM.
JESTEM TYM WSZYSTKIM RAZEM WZIĘTYM.
JESTEM WASZYM JEDYNYM I WIELKIM MONEYPENIS.`,
  
    NL: `AAN WIE HET MOGE AANGAAN

IK BEN DE EENZAAMHEID DIE JOUW DROEFHEID VERZORGT
IK BEN DE DROEFHEID DIE JOUW EENZAAMHEID VERZORGT
IK BEN HET KLEED VAN DE LIEFDE
IK BEN DE NAAKTE LIEFDE
IK BEN DAT LICHAAM VERKLEED ALS BEGEERTEN
IK BEN DAT VERLANGEN DAT HET JOUWE VERZORGT
IK BEN DAT VERLANGEN IN DE AFGROND VAN HET JOUWE.
IK BEN DIE TOTEM, DE OUDSTE VAN ALLEMAAL,
IK BEN HET VLEES EN HET BLOED,
IK BEN DE HUID ZONDER DE BEENDEREN.
IK BEN DAT TABOE DAT MEN WIL VERZWIJGEN,
IK BEN OOK DE LACH EN DE GLIMLACH.
IK BEN DAT GESLACHT DAT JIJ VEREERT,
IK BEN HET GEKWELDE VLEES.
IK BEN DIE VERLEIDING DIE JOU AANTREKT,
IK BEN DIE AFKEER DIE JOU AFSTOOT.
IK BEN DE BELOFTE, DE EED, DE BEKENTENIS,
IK BEN DE LEUGEN EN DE WAARHEID.
IK BEN DE EENZAME, ALTIJD TROUW EN ALLEEN,
DE LEGENDE EN HET LEVENDE LICHAAM.
IK BEN HET GEWELD, DE PLAGENDE TEDERHEID,
DIE TRILLENDE BEUL.
HIJ IS IK — IN DIT RITUEEL VAN TERUGGEKEERDE HEIDENEN,
DE HOOGMIS VAN DEZE TERUGGEVONDEN MIS.
IK BEN HET GOUD DAT JE IN HOGE KWALITEIT KOOPT
EN DAT IK JE TEGEN DE BESTE PRIJS VERKOOP.
WEDUWNAAR VAN MIDDERNACHT TOT DAGERAAD,
IK BEN DE PAPIEREN ECHTGENOOT ONDER HET BED.
IK BEN HET MANIFEST VAN UW DELICATE PERFIDIES,
DE KRONIEK VAN UW INNERLIJKE OORLOGEN.
IK BEN IK WEET NIET MEER WIE,
IK BEN ALLES WAT IK GEWEEST BEN.
IK BEN DIT ALLES TEGELIJK.
IK BEN UW ENIGE EN GROTE MONEYPENIS.`,
  
    EL: `ΠΡΟΣ ΟΠΟΙΟΝ ΑΦΟΡΑ

ΕΙΜΑΙ Η ΜΟΝΑΞΙΑ ΠΟΥ ΘΕΡΑΠΕΥΕΙ ΤΗΝ ΘΛΙΨΗ ΣΟΥ
ΕΙΜΑΙ Η ΘΛΙΨΗ ΠΟΥ ΘΕΡΑΠΕΥΕΙ ΤΗΝ ΜΟΝΑΞΙΑ ΣΟΥ
ΕΙΜΑΙ ΤΟ ΕΝΔΥΜΑ ΤΟΥ ΕΡΩΤΑ
ΕΙΜΑΙ Ο ΕΡΩΤΑΣ ΓΥΜΝΟΣ
ΕΙΜΑΙ ΑΥΤΟ ΤΟ ΣΩΜΑ ΜΕΤΑΜΦΙΕΣΜΕΝΟ ΣΕ ΕΠΙΘΥΜΙΕΣ
ΕΙΜΑΙ ΑΥΤΗ Η ΕΠΙΘΥΜΙΑ ΠΟΥ ΘΕΡΑΠΕΥΕΙ ΤΗΝ ΔΙΚΗ ΣΟΥ
ΕΙΜΑΙ ΑΥΤΗ Η ΕΠΙΘΥΜΙΑ ΣΤΗΝ ΑΒΥΣΣΟ ΤΗΣ ΔΙΚΗΣ ΣΟΥ.
ΕΙΜΑΙ ΑΥΤΟ ΤΟ ΤΟΤΕΜ, ΤΟ ΑΡΧΑΙΟΤΕΡΟ ΑΠ' ΟΛΑ,
ΕΙΜΑΙ Η ΣΑΡΚΑ ΚΑΙ ΤΟ ΑΙΜΑ,
ΕΙΜΑΙ ΤΟ ΔΕΡΜΑ ΧΩΡΙΣ ΤΑ ΟΣΤΑ.
ΕΙΜΑΙ ΑΥΤΟ ΤΟ ΤΑΜΠΟΥ ΠΟΥ ΘΕΛΟΥΝ ΝΑ ΑΠΟΣΙΩΠΗΣΟΥΝ,
ΕΙΜΑΙ ΕΠΙΣΗΣ ΤΟ ΓΕΛΙΟ ΚΑΙ ΤΟ ΧΑΜΟΓΕΛΟ.
ΕΙΜΑΙ ΑΥΤΟ ΤΟ ΦΥΛΟ ΠΟΥ ΛΑΤΡΕΥΕΙΣ,
ΕΙΜΑΙ Η ΒΑΣΑΝΙΣΜΕΝΗ ΣΑΡΚΑ.
ΕΙΜΑΙ Ο ΠΕΙΡΑΣΜΟΣ ΠΟΥ ΣΕ ΕΛΚΥΕΙ,
ΕΙΜΑΙ Η ΑΗΔΙΑ ΠΟΥ ΣΕ ΑΠΩΘΕΙ.
ΕΙΜΑΙ Η ΥΠΟΣΧΕΣΗ, Ο ΟΡΚΟΣ, Η ΕΞΟΜΟΛΟΓΗΣΗ,
ΕΙΜΑΙ ΤΟ ΨΕΥΔΟΣ ΚΑΙ Η ΑΛΗΘΕΙΑ.
ΕΙΜΑΙ Ο ΕΡΗΜΙΤΗΣ, ΠΑΝΤΑ ΠΙΣΤΟΣ ΚΑΙ ΜΟΝΟΣ,
Ο ΘΡΥΛΟΣ ΚΑΙ ΤΟ ΖΩΝΤΑΝΟ ΣΩΜΑ.
ΕΙΜΑΙ Η ΒΙΑ, Η ΠΕΙΡΑΧΤΙΚΗ ΤΡΥΦΕΡΟΤΗΤΑ,
ΑΥΤΟΣ Ο ΤΡΕΜΑΜΕΝΟΣ ΔΗΜΙΟΣ.
ΑΥΤΟΣ ΕΙΝΑΙ ΕΓΩ — ΣΕ ΑΥΤΗΝ ΤΗΝ ΤΕΛΕΤΗ ΤΩΝ ΕΠΙΣΤΡΕΦΟΝΤΩΝ ΕΘΝΙΚΩΝ,
Η ΥΨΗΛΗ ΛΕΙΤΟΥΡΓΙΑ ΑΥΤΗΣ ΤΗΣ ΞΑΝΑΒΡΕΘΕΙΣΑΣ ΛΕΙΤΟΥΡΓΙΑΣ.
ΕΙΜΑΙ ΤΟ ΧΡΥΣΑΦΙ ΠΟΥ ΘΑ ΑΓΟΡΑΣΕΙΣ ΣΕ ΥΨΗΛΗ ΠΟΙΟΤΗΤΑ
ΚΑΙ ΠΟΥ ΕΓΩ ΘΑ ΣΟΥ ΠΟΥΛΗΣΩ ΣΤΗΝ ΚΑΛΥΤΕΡΗ ΤΙΜΗ.
ΧΗΡΟΣ ΑΠΟ ΤΑ ΜΕΣΑΝΥΧΤΑ ΕΩΣ ΤΗΝ ΑΥΓΗ,
ΕΙΜΑΙ Ο ΧΑΡΤΙΝΟΣ ΣΥΖΥΓΟΣ ΚΑΤΩ ΑΠΟ ΤΟ ΚΡΕΒΑΤΙ.
ΕΙΜΑΙ ΤΟ ΜΑΝΙΦΕΣΤΟ ΤΩΝ ΛΕΠΤΕΠΙΛΕΠΤΩΝ ΔΟΛΙΟΤΗΤΩΝ ΣΑΣ,
ΤΟ ΧΡΟΝΙΚΟ ΤΩΝ ΕΣΩΤΕΡΙΚΩΝ ΣΑΣ ΠΟΛΕΜΩΝ.
ΕΙΜΑΙ ΔΕΝ ΞΕΡΩ ΠΛΕΟΝ ΠΟΙΟΣ,
ΕΙΜΑΙ ΟΛΟΙ ΟΣΟΙ ΥΠΗΡΞΑ.
ΕΙΜΑΙ ΟΛΑ ΑΥΤΑ ΜΑΖΙ.
ΕΙΜΑΙ Ο ΜΟΝΑΔΙΚΟΣ ΚΑΙ ΜΕΓΑΣ MONEYPENIS ΣΑΣ.`,
  
    TR: `İLGİLENEN HERKESE

BEN SENİN ÜZÜNTÜNÜ İYİLEŞTİREN YALNIZLIĞIM
BEN SENİN YALNIZLIĞINI İYİLEŞTİREN ÜZÜNTÜYÜM
BEN AŞKIN ELBİSESİYİM
BEN ÇIPLAK AŞKIM
BEN ARZULARLA KOSTÜMLENMİŞ O BEDENİM
BEN SENİNKİNİ İYİLEŞTİREN O ARZUYUM
BEN SENİN UÇURUMUNDAKİ O ARZUYUM.
BEN O TOTEMİM, HEPSİNİN EN ESKİSİ,
BEN ETİM VE KANIM,
BEN KEMİKSİZ DERİYİM.
BEN SUSTURULMAK İSTENEN O TABUYUM,
BEN AYNI ZAMANDA KAHKAHA VE GÜLÜMSEMEYİM.
BEN SENİN TAPTIĞIN O CİNSİYETİM,
BEN İŞKENCEYE UĞRAMIŞ ETİM.
BEN SENİ ÇEKEN O BAŞTAN ÇIKARMAYIM,
BEN SENİ İTEN O TİKSİNTİYİM.
BEN VAAT, YEMİN, İTİRAFIM,
BEN YALAN VE HAKİKATİM.
BEN ASOSYAL, HER ZAMAN SADIK VE YALNIZ,
EFSANE VE CANLI BEDEN.
BEN ŞİDDET, ALAYCI ŞEFKATİM,
O TİTREYEN CELLAT.
O BENİM — DÖNEN PAGANLARIN BU AYİNİNDE,
BU YENİDEN BULUNMUŞ AYİNİN YÜCE KUTSAMASI.
BEN YÜKSEK KALİTEDE SATIN ALACAĞIN
VE BENİM SANA EN İYİ FİYATA SATACAĞIM ALTINIM.
GECEYARISINDAN ŞAFAĞA DUL,
BEN YATAK ALTINDAKİ KAĞIT EŞİM.
BEN İNCE KÖTÜLÜKLERİNİZİN MANİFESTOSU,
İÇ SAVAŞLARINIZIN KRONOLOJİSİYİM.
BEN ARTIK KİM BİLMİYORUM,
BEN OLDUĞUM HER ŞEYİM.
BEN TÜM BUNLAR BİR ARADAYIM.
BEN SİZİN TEK VE BÜYÜK MONEYPENIS'İNİZİM.`,
  
    UK: `ДО ТОГО, КОГО ЦЕ СТОСУЄТЬСЯ

Я — САМОТНІСТЬ, ЩО ЗЦІЛЮЄ ТВІЙ СМУТОК
Я — СМУТОК, ЩО ЗЦІЛЮЄ ТВОЮ САМОТНІСТЬ
Я — ОДЯГ ЛЮБОВІ
Я — ГОЛА ЛЮБОВ
Я — ЦЕ ТІЛО, ПЕРЕОДЯГНЕНЕ В БАЖАННЯ
Я — ЦЕ БАЖАННЯ, ЩО ЗЦІЛЮЄ ТВОЄ
Я — ЦЕ БАЖАННЯ В БЕЗОДНІ ТВОГО.
Я — ЦЕЙ ТОТЕМ, НАЙСТАРІШИЙ З УСІХ,
Я — ТІЛО І КРОВ,
Я — ШКІРА БЕЗ КІСТОК.
Я — ЦЕ ТАБУ, ЯКЕ ХОЧУТЬ ЗАМОВЧАТИ,
Я — ТАКОЖ СМІХ І УСМІШКА.
Я — ЦЯ СТАТЬ, ЯКУ ТИ ШАНУЄШ,
Я — ЦЯ ПРИМІТИВНА СТАТУЯ.
Я — ЧУТТЄВЕ ДЕРЕВО,
Я — СПОКІЙ І НАПРУГА.
Я — ЗНАРЯДДЯ ПРАЦІВНИКА.
Я — ВОСКОВА СВІЧКА, ЩО СПЛИВАЄ,
Я ПАЛАЮ ПІД ХРЕСТОМ І
Я — ЦЕЙ ЧЛЕН, ЯКОГО ТИ ОБОЖНЮЄШ.
Я — ЦЯ ГУБКА БЕЗМЕЖНОЇ НІЖНОСТІ,
Я — ТОЙ, ХТО ТРИВАЄ, ПОКИ МИНАЄ ЧАС.

Я MONEYPENIS

ТИ МОЖЕШ НАЗИВАТИ МЕНЕ "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... І ЩО З ТОГО?
У МЕНЕ НЕ БУДЕ ЕПІТАФІЇ!

ВІД МОЇХ ОСТАНКІВ НІЧОГО НЕ ЗАЛИШИТЬСЯ...
ПІД ХРЕСТОМ Я БУДУ ВІДСУТНІЙ НА МОГИЛІ МОГО ПАНА, ТАКА ДОЛЯ БЕЗ КІСТОК.
"TRUE LOVE LEAVES NO TRACES"
ВИСПІВУВАВ СПІВАК
Я MONEYPENIS
ТІЛЬКИ МОЄ СЕРЦЕ НА ПРОДАЖ, А ТИ, ТИ МЕНЕ ЛЮБИШ...`,
  
    LT: `TIEMS, KURIUOS TAI LIEČIA

AŠ ESU VIENATVĖ, KURI GYDO TAVO LIŪDESĮ
AŠ ESU LIŪDESYS, KURIS GYDO TAVO VIENATVĘ
AŠ ESU MEILĖS DRABUŽIS
AŠ ESU NUOGA MEILĖ
AŠ ESU TAS KŪNAS, PERSIRENGĘS GEISMAIS
AŠ ESU TAS GEISMAS, KURIS GYDO TAVĄJĮ
AŠ ESU TAS GEISMAS TAVOJO BEDUGNĖJE.
AŠ ESU TAS TOTEMAS, SENIAUSIAS IŠ VISŲ,
AŠ ESU KŪNAS IR KRAUJAS,
AŠ ESU ODA BE KAULŲ.
AŠ ESU TAS TABU, KURĮ NORI NUTYLĖTI,
AŠ TAIP PAT ESU JUOKAS IR ŠYPSENA.
AŠ ESU TA LYTIS, KURIĄ TU GARBINI,
AŠ ESU TA PIRMYKŠTĖ STATULA.
AŠ ESU JUSLINĖ MEDIENA,
AŠ ESU POILSIS IR ĮTAMPA.
AŠ ESU DARBININKO ĮRANKIS.
AŠ ESU TIRPSTANTI ŽVAKĖ,
AŠ DEGU PO KRYŽIUMI IR
AŠ ESU TAS GAIDYS, KURĮ TU DIEVINI.
AŠ ESU TA BEGALINĖS ŠVELNUMO KEMPINĖ,
AŠ ESU TAS, KURIS TRUNKA TIEK, KIEK PRAEINA LAIKAS.

AŠ ESU MONEYPENIS

GALI MANE VADINTI "CRAZY WILLY", "GOGODICKY",
"DOLLARS DOLL FANTASY"... TAI KAS?
NETURĖSIU EPITAFIJOS!

IŠ MANO PALAIKŲ NIEKAS NELIKS...
PO KRYŽIUMI BŪSIU NEPASIRODĘS PRIE SAVO ŠEIMININKO KAPO, TOKS YRA BEKAULIŲ LIKIMAS.
"TRUE LOVE LEAVES NO TRACES"
PSALMODIJAVO DAINININKAS
AŠ ESU MONEYPENIS
TIK MANO ŠIRDIS PARDUODAMA, O TU, TU MANE MYLI...`,
    AR: `إلى من يهمه الأمر

أنا الوحدة التي تشفي حزنك
أنا الحزن الذي يشفي وحدتك
أنا لباس الحب
أنا الحب العاري
أنا هذا الجسد المتنكر في هيئة رغبات
أنا هذه الرغبة التي تشفي رغبتك
أنا هذه الرغبة في هاوية رغبتك.
أنا هذا الطوطم، الأقدم من كل شيء،
أنا اللحم والدم،
أنا الجلد بلا عظام.
أنا هذا التابو الذي يُراد إسكاته،
أنا أيضاً الضحكة والابتسامة.
أنا هذا الجنس الذي تعبده،
أنا هذا التمثال البدائي.
أنا الخشب الشهواني،
أنا الراحة والتوتر.
أنا أداة العامل.
أنا الشمعة المشتعلة،
أنا أحترق تحت الصليب
أنا هذا القضيب الذي تعشقه.
أنا هذه الإسفنجة من العذوبة اللانهائية،
أنا الذي يدوم ما دام الزمن يمضي.

أنا منيبينيس

يمكنك أن تناديني "كريزي ويلي"، "غوغوديكي"،
"دولارز دول فانتزي"... وماذا في ذلك؟
لن يكون لي مرثية!

لن يبقى من رفاتي شيء...
تحت الصليب، سأكون غائباً عن قبر سيدي، هذا قدر من بلا عظام.
"الحب الحقيقي لا يترك أثراً"
كان يرتل المغني
أنا منيبينيس
قلبي وحده للبيع، وأنت، أنت تحبني...`,
    HE: `למי שזה נוגע

אני הבדידות שמרפאת את עצבותך
אני העצבות שמרפאת את בדידותך
אני לבוש האהבה
אני האהבה העירומה
אני הגוף הזה המחופש לתשוקות
אני התשוקה הזו שמרפאת את שלך
אני התשוקה הזו בתהום של שלך.
אני הטוטם הזה, העתיק מכולם,
אני בשר ודם,
אני עור ללא עצמות.
אני הטאבו הזה שרוצים להשתיק,
אני גם הצחוק והחיוך.
אני המין הזה שאתה סוגד לו,
אני הפסל הפרימיטיבי הזה.
אני העץ החושני,
אני המנוחה והמתח.
אני כלי העובד.
אני הנר הבוער,
אני נשרף תחת הצלב
ואני הזין הזה שאתה מעריץ.
אני הספוג הזה של מתיקות אינסופית,
אני זה שמחזיק כל עוד הזמן חולף.

אני מאניפניס

אתה יכול לקרוא לי "קרייזי ווילי", "גוגודיקי",
"דולרס דול פנטזי"... אז מה?
לא יהיה לי כתובת קבר!

לא יישאר דבר משלדי...
מתחת לצלב, אהיה נעדר מקבר אדוני, זה גורלם של חסרי העצמות.
"אהבה אמיתית לא משאירה עקבות"
היה הזמר מזמר
אני מאניפניס
רק לבי עומד למכירה, ואתה, אתה אוהב אותי...`,
    FA: `به هرکس که مربوط می‌شود

من تنهایی‌ای هستم که اندوهت را شفا می‌دهد
من اندوهی هستم که تنهایی‌ات را شفا می‌دهد
من جامهٔ عشقم
من عشق برهنه‌ام
من این تنم که در لباس امیال پنهان است
من این میلم که میل تو را شفا می‌دهد
من این میلم در ژرفای میل تو.
من این توتمم، کهن‌ترین همه،
من گوشت و خونم،
من پوستم بی استخوان.
من این تابویم که می‌خواهند خاموشش کنند،
من نیز خنده و لبخندم.
من این جنسم که می‌پرستی،
من این مجسمهٔ ابتدایی‌ام.
من چوب شهوتم،
من آرامش و تنشم.
من ابزار کارگرم.
من شمع سوزانم،
من زیر صلیب در آتشم
و من این آلتی‌ام که می‌پرستی.
من این اسفنج شیرینی بی‌پایانم،
من آنم که تا زمان می‌گذرد، می‌مانم.

من منی‌پنیسم

می‌توانی مرا «کریزی ویلی»، «گوگودیکی»،
«دلارز دل فانتزی» بنامی... که چه شود؟
سنگ گوری نخواهم داشت!

از پیکرم چیزی نخواهد ماند...
زیر صلیب، از گور آقایم غایب خواهم بود، این سرنوشت بی‌استخوانان است.
«عشق حقیقی اثری بر جای نمی‌گذارد»
خواننده زمزمه می‌کرد
من منی‌پنیسم
تنها قلب من فروشی است، و تو، تو دوستم داری...`,
    KO: `관련된 모든 분께

나는 너의 슬픔을 치유하는 고독이다
나는 너의 고독을 치유하는 슬픔이다
나는 사랑의 의복이다
나는 벌거벗은 사랑이다
나는 욕망으로 위장한 이 몸이다
나는 너의 것을 치유하는 이 욕망이다
나는 너의 심연 속의 이 욕망이다.
나는 가장 오래된 이 토템이다,
나는 살과 피이다,
나는 뼈 없는 살갗이다.
나는 침묵시키려는 이 금기이다,
나는 또한 웃음과 미소이다.
나는 네가 숭배하는 이 성기이다,
나는 이 원시의 조각상이다.
나는 관능의 나무이다,
나는 휴식과 긴장이다.
나는 노동자의 도구이다.
나는 타오르는 촛불이다,
나는 십자가 아래에서 불타며
나는 네가 사랑하는 이 자지이다.
나는 무한한 부드러움의 이 해면이다,
나는 시간이 흐르는 동안 지속되는 자이다.

나는 머니페니스다

너는 나를 "크레이지 윌리", "고고디키",
"달러즈 돌 판타지"라 부를 수 있다... 그래서?
나에게는 묘비명이 없을 것이다!

내 시신에서 아무것도 남지 않으리...
십자가 아래, 나는 내 주인의 무덤에서 사라지리, 그것이 뼈 없는 자의 운명이다.
"진정한 사랑은 흔적을 남기지 않는다"
가수는 그리 읊조렸다
나는 머니페니스다
오직 내 마음만이 팔 것, 그리고 너, 너는 나를 사랑한다...`,
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
  
    RU: `Дорогой Господин,

Moneypenis, любовь моя,
сердце моё, мой ангел,
я не нахожу слов, я не нахожу слов...
я люблю тебя, вот и всё. И что ещё ответить члену, который пишет?
Литературный пенис, иностранный корреспондент.
Я могу лишь забыть всякий стыд и достоинство,
и ответить тебе: я люблю тебя ...

К твоим ногам, рукам, бёдрам,
к твоим губам, языку, шее, плечам,
я не нахожу слов, я не нахожу слов...

К твоему сердцу, разуму, дыханию,
к твоей нежности, твоей силе, твоему рассвету,
к твоим хрупкостям, гордости, отголоскам,
я не нахожу слов, я не нахожу слов...

Любить — значит расширяться, растягиваться, открываться, удивляться,
расти, сиять, плакать тоже, страдать всегда, пугаться, цепляться, дрожать иногда, доверять, верить, надеяться.
А ещё в каждой пылинке света, в каждой ласке утра,
в каждой милой ночной непрозрачности находить тебя
и без меры тебе принадлежать.

И если бы мне нужно было оплакивать что-то одно при разрыве, который слишком хорошо обозначает свою резкость, это была бы наша безответная нежность, для которой никогда не было слов, кроме тех, что отдаются, чтобы быть смешанными,
и шёпотом сказанных
во время бессонницы и сладких пробуждений.

Целую тебя.`,
  
    PL: `Drogi Panie,

Moneypenis miłości moja,
serce moje, mój aniele,
nie znajduję słów, nie znajduję słów...
kocham cię i tyle. A co odpowiedzieć kuśce która pisze?
Pisarski penis, korespondent zagraniczny.
Mogę tylko zapomnieć o wszelkim wstydzie i godności,
i odpowiedzieć ci kocham cię ...

Do twoich stóp, twoich rąk, twoich bioder,
do twoich ust, twojego języka, twojej szyi, twoich ramion,
nie znajduję słów, nie znajduję słów...

Do twojego serca, twojego umysłu, twojego oddechu,
do twojej czułości, twojej siły, twojej zorzy,
do twoich kruchości, twojej dumy, twoich ech,
nie znajduję słów, nie znajduję słów...

Kochać to rozszerzać się, rozciągać, otwierać, zachwycać,
rosnąć, promienieć, płakać też, cierpieć zawsze, lękać się, czepiać się, drżeć czasem, ufać, wierzyć, mieć nadzieję.
A także w każdym pyłku światła, w każdej pieszczocie poranka,
w każdej słodkiej nocnej nieprzezroczystości znajdować ciebie
i bez miary do ciebie przynależeć.

A gdybym musiał opłakiwać tylko jedną rzecz przy zerwaniu, które zbyt dobrze podkreśla swoją gwałtowność, byłaby to nasza bezsenna czułość, dla której nigdy nie było słów poza tymi, które się daje, by zostały zmieszane,
i wyszeptywanych
w bezsennościach i słodkich przebudzeniach.

Całuję cię.`,
  
    NL: `Geachte Meneer,

Moneypenis mijn liefde,
mijn hart, mijn engel,
ik vind de woorden niet, ik vind de woorden niet...
ik hou van je, dat is alles. En wat te antwoorden aan een pik die schrijft?
Een literaire penis, een buitenlandse correspondent.
Ik kan slechts alle schaamte en waardigheid vergeten,
en je antwoorden ik hou van je ...

Aan je voeten, je handen, je heupen,
aan je lippen, je tong, je nek, je schouders,
ik vind de woorden niet, ik vind de woorden niet...

Aan je hart, je geest, je adem,
aan je tederheid, je kracht, je dageraad,
aan je broosheden, je trots, je echo's,
ik vind de woorden niet, ik vind de woorden niet...

Liefhebben is uitbreiden, uitrekken, openen, verbazen,
groeien, stralen, ook huilen, altijd lijden, vrezen, zich vastklampen, soms beven, vertrouwen, geloven, hopen.
En ook in elk stofje licht, in elke streling van de ochtend,
in elke zachte nachtelijke ondoorzichtigheid jou vinden
en zonder maat tot jou behoren.

En als ik bij een breuk die haar bruusheid maar al te goed onderstreept slechts één ding te betreuren had, dan zou het onze slapeloze tederheid zijn, waarvoor er nooit andere woorden zijn geweest dan die welke men geeft om te worden vermengd,
en gefluisterd
in slapeloosheden en zachte ontwakingen.

Ik kus je.`,
  
    EL: `Αγαπητέ Κύριε,

Moneypenis αγάπη μου,
καρδιά μου, άγγελέ μου,
δεν βρίσκω τα λόγια, δεν βρίσκω τα λόγια...
σε αγαπώ ορίστε. Και τι να απαντήσει κανείς σε ένα πέος που γράφει;
Ένα λογοτεχνικό πέος, ένας ξένος ανταποκριτής.
Δεν μπορώ παρά να ξεχάσω κάθε συστολή και αξιοπρέπεια,
και να σου απαντήσω σε αγαπώ ...

Στα πόδια σου, στα χέρια σου, στους γοφούς σου,
στα χείλη σου, στη γλώσσα σου, στον λαιμό σου, στους ώμους σου,
δεν βρίσκω τα λόγια, δεν βρίσκω τα λόγια...

Στην καρδιά σου, στο πνεύμα σου, στην ανάσα σου,
στην τρυφερότητά σου, στη δύναμή σου, στην αυγή σου,
στις ευθραυστότητές σου, στην υπερηφάνειά σου, στις ηχώ σου,
δεν βρίσκω τα λόγια, δεν βρίσκω τα λόγια...

Το να αγαπάς είναι να επεκτείνεσαι, να τεντώνεσαι, να ανοίγεσαι, να εκπλήσσεσαι,
να μεγαλώνεις, να λάμπεις, να κλαις επίσης, να υποφέρεις πάντα, να φοβάσαι, να κρατιέσαι, να τρέμεις μερικές φορές, να εμπιστεύεσαι, να πιστεύεις, να ελπίζεις.
Και επίσης σε κάθε σωματίδιο φωτός, σε κάθε χάδι του πρωινού,
σε κάθε γλυκιά νυχτερινή σκοτεινιά να σε βρίσκω
και χωρίς μέτρο να σου ανήκω.

Και αν έπρεπε να θρηνήσω ένα και μόνο πράγμα σε ένα ρήγμα που υπογραμμίζει πολύ καλά την αποτομότητά του, θα ήταν η αλεσχάστη τρυφερότητά μας, για την οποία δεν υπήρξαν ποτέ άλλα λόγια από αυτά που δίνονται για να αναμειχθούν,
και να ψιθυριστούν
σε αϋπνίες και γλυκές αφυπνίσεις.

Σε φιλώ.`,
  
    TR: `Sevgili Bay,

Moneypenis aşkım,
kalbim, meleğim,
kelimeleri bulamıyorum, kelimeleri bulamıyorum...
seni seviyorum hepsi bu. Ve yazan bir yarrağa ne yanıt verilir?
Edebi bir penis, yabancı bir muhabir.
Tüm utangaçlığımı ve onurumu unutmaktan başka bir şey yapamam,
ve sana yanıt vermekten seni seviyorum ...

Ayaklarına, ellerine, kalçalarına,
dudaklarına, dilinin, boynuna, omuzlarına,
kelimeleri bulamıyorum, kelimeleri bulamıyorum...

Kalbine, zihnine, nefesine,
şefkatine, gücüne, şafağına,
kırılganlıklarına, gururuna, yankılarına,
kelimeleri bulamıyorum, kelimeleri bulamıyorum...

Sevmek genişlemek, uzanmak, açılmak, şaşırmaktır,
büyümek, parlamak, ağlamak da, hep acı çekmek, korkmak, sarılmak, bazen titremek, güvenmek, inanmak, ummaktır.
Ve ayrıca her ışık zerresinde, sabahın her okşamasında,
her tatlı gece karanlığında seni bulmak
ve ölçüsüzce sana ait olmak.

Ve ani kopuşunu çok iyi vurgulayan bir kopuşta yas tutacağım tek bir şey olsaydı, bu bizim uykusuz şefkatimiz olurdu, ki bu şefkat için karışmak üzere verilen kelimelerden başka kelime hiçbir zaman olmadı,
ve fısıldanan
uykusuz gecelerde ve tatlı uyanışlarda.

Seni öpüyorum.`,
  
    UK: `Шановний Пане,

Moneypenis, любове моя,
серце моє, ангеле мій,
я не знаходжу слів, я не знаходжу слів...
я тебе люблю, ось і все. І що відповідати члену, який пише?
Літературний пеніс, іноземний кореспондент.
Я можу лише забути всю сором'язливість і гідність,
і відповісти тобі: я тебе люблю ...

До твоїх ніг, твоїх рук, твоїх стегон,
до твоїх губ, твого язика, твоєї шиї, твоїх плечей,
я не знаходжу слів, я не знаходжу слів...

До твого серця, твого розуму, твого дихання,
до твоєї ніжності, твоєї сили, твоєї зорі,
до твоїх крихкостей, твоєї гордості, твоїх відлунь,
я не знаходжу слів, я не знаходжу слів...

Любити — значить розширятися, розтягуватися, відкриватися, дивуватися,
рости, сяяти, плакати також, страждати завжди, боятися, чіплятися, тремтіти інколи, довіряти, вірити, сподіватися.
А ще в кожній порошинці світла, в кожній пестощі ранку,
в кожній солодкій нічній непрозорості знаходити тебе
і безмежно тобі належати.

І якби мені довелося оплакувати лиш одне при розриві, який надто добре підкреслює свою різкість, це була б наша безсонна ніжність, для якої ніколи не було слів, крім тих, що дають, щоб бути змішаними,
і прошепотіти
в безсонницях і солодких пробудженнях.

Цілую тебе.`,
  
    LT: `Gerbiamasis,

Moneypenis, mano meile,
mano širdie, mano angele,
nerandu žodžių, nerandu žodžių...
myliu tave, tai ir viskas. O ką atsakyti rašančiam falui?
Literatūrinis penis, užsienio korespondentas.
Galiu tik pamiršti visą drovumą ir orumą,
ir atsakyti tau myliu tave ...

Tavo pėdoms, tavo rankoms, tavo klubams,
tavo lūpoms, tavo liežuviui, tavo kaklui, tavo pečiams,
nerandu žodžių, nerandu žodžių...

Tavo širdžiai, tavo protui, tavo kvėpavimui,
tavo švelnumui, tavo jėgai, tavo aušrai,
tavo trapumams, tavo išdidumui, tavo aidams,
nerandu žodžių, nerandu žodžių...

Mylėti — tai plėstis, tęstis, atverti save, stebėtis,
augti, šviesti, taip pat verkti, visada kentėti, bijoti, kabintis, kartais drebėti, pasitikėti, tikėti, viltis.
Ir taip pat kiekvienoje šviesos dulkėje, kiekvienoje ryto glamonėje,
kiekviename saldžiame naktiniame neperregimume rasti tave
ir be saiko tau priklausyti.

Ir jeigu reikėtų apverkti vienintelį dalyką prie skyrybų, kurios pernelyg gerai pabrėžia savo staigumą, tai būtų mūsų nemiegantis švelnumas, kuriam niekada nebuvo kitų žodžių, išskyrus tuos, kurie duodami, kad būtų sumaišyti,
ir pakuždomis ištarti
nemigos naktyse ir saldžiuose pabudimuose.

Bučiuoju tave.`,
    AR: `سيدي العزيز،

منيبينيس حبي،
قلبي، ملاكي،
لا أجد الكلمات، لا أجد الكلمات...
أحبك، هذا كل شيء. وماذا أرد على قضيب يكتب؟
قضيب أدبي، مراسل أجنبي.
لا أملك إلا أن أنسى كل حياء وكرامة،
وأرد عليك أحبك، راغبةً في تصديق ذلك.
أحبك إلى حد قبول المستحيل، إلى حد تخيّل أنك تخاطبني
أنا. إلى حد احمرار خفيف للوجه، من هذا الخجل الصغير الذي يدفئ الوجنتين.

في الحال الذي بلغته، منيبينيس قلبي الرقيق، قضيبي الجميل،
يمكنني الرد عليك جيداً...

سميكي الضعيف، خدعتي الطويلة الصلبة، لأسبوع أو حتى النهاية...

وبما أنك تكتب فلا بد أنك تقدر على القراءة. يمكنني حتى أن أكتب لك
كقضيب إن لزم الأمر... إلى حد تلطيخ ريشتي!

لكن هل كلماتك لا توجد إلا في عينيّ؟
مجرد لطف شاعري يكسو تبادلاتنا؟
وهم في عقل عليل ونفس حزينة تسكنانني؟

أعلم... أعلم أعلم... قلبك وحده للبيع!
قلبك وحده للبيع وأنا أحبك.
لكن من السعر المعروض لا أعرف رقماً ولا عملة.
أحبك منيبينيس... هذا كل شيء!

الآخر لك ♥`,
    HE: `אדוני היקר,

מאניפניס אהבתי,
לבי, מלאכי,
איני מוצא את המילים, איני מוצא את המילים...
אני אוהב אותך, זה הכל. ומה לענות לזין שכותב?
פין ספרותי, כתב חוץ.
אני יכול רק לשכוח כל צניעות וכבוד,
ולענות לך אני אוהב אותך, מוכן להאמין בכך.
אני אוהב אותך עד כדי קבלת הבלתי אפשרי, עד כדי דמיון שאתה פונה
אלי. עד כדי להסמיק מעט, מאותה בושה קטנה שמחממת את הפנים.

במצב שבו אני, מאניפניס לבי הרך, הזין היפה שלי,
אני יכול בהחלט לענות לך...

עבה וחלוש שלי, ארוך וקשה תעלולי, לשבוע או עד הסוף...

ומאחר שאתה כותב, אתה בוודאי יכול לקרוא. אני יכול אפילו לכתוב לך
כמו זין אם צריך... עד כדי ללכלך את העט שלי!

אבל האם מילותיך קיימות רק בעיני?
נימוס פיוטי פשוט שמלביש את החילופים בינינו?
ראייה של נפש חולה ונשמה עצובה השוכנות בי?

אני יודע... אני יודע יודע... רק לבך עומד למכירה!
רק לבך עומד למכירה ואני אוהב אותך.
אבל את המחיר המוצג איני יודע, לא מספר ולא מטבע.
אני אוהב אותך מאניפניס... זה הכל!

האחר שלך ♥`,
    FA: `آقای عزیز،

منی‌پنیس عشق من،
قلب من، فرشتهٔ من،
کلمات را نمی‌یابم، کلمات را نمی‌یابم...
دوستت دارم، همین. و چه پاسخی به آلتی که می‌نویسد بدهم؟
آلتی ادیب، خبرنگار خارجی.
نمی‌توانم جز فراموش کردن هر حیا و کرامت،
و پاسخ دادن دوستت دارم، با تمایل به باور آن.
چنان دوستت دارم که ناممکن را می‌پذیرم، تصور می‌کنم که تو با من
سخن می‌گویی. کمی سرخ می‌شوم، از این شرم کوچک که چهره را گرم می‌کند.

در حالی که هستم، منی‌پنیس قلب لطیفم، آلت زیبایم،
می‌توانم به تو پاسخ بدهم...

ضخیم و ضعیفم، بلند و سختم، برای یک هفته یا تا پایان...

و چون می‌نویسی، حتماً می‌توانی بخوانی. می‌توانم حتی برایت
چون آلتی بنویسم اگر لازم باشد... تا قلمم را آلوده کنم!

اما آیا کلمات تو فقط در چشمان من وجود دارند؟
ادب شاعرانه‌ای ساده که تبادلات ما را می‌پوشاند؟
دیدگاهی از ذهن بیمار و روح غمگینی که در من ساکن‌اند؟

می‌دانم... می‌دانم می‌دانم... تنها قلب تو فروشی است!
تنها قلب تو فروشی است و من دوستت دارم.
اما از قیمت اعلام‌شده نه عدد می‌دانم نه ارز.
دوستت دارم منی‌پنیس... همین!

دیگرِ تو ♥`,
    KO: `선생님께,

머니페니스 내 사랑,
내 마음, 내 천사여,
말을 찾을 수 없습니다, 말을 찾을 수 없습니다...
나는 당신을 사랑합니다, 그게 전부입니다. 글을 쓰는 자지에게 무어라 답하리오?
문학적 음경, 외국 통신원에게.
나는 모든 수치와 위엄을 잊을 수밖에 없고,
당신에게 사랑한다 답할 뿐, 그것을 믿고자 합니다.
나는 불가능을 받아들일 만큼 당신을 사랑합니다, 당신이
나에게 말을 거는 것이라 상상하며. 얼굴을 약간 붉히며, 얼굴을 덥히는 이 작은 부끄러움으로.

지금의 상태에서, 머니페니스 나의 부드러운 마음이여, 나의 아름다운 자지여,
나는 당신에게 잘 답할 수 있습니다...

내 굵고 약한 것이여, 내 길고 단단한 속임수여, 일주일이든 끝까지든...

그리고 당신이 쓰니, 분명 읽을 수 있을 것입니다. 필요하다면
자지처럼 당신에게 글을 쓸 수도 있습니다... 내 펜이 더럽혀질 정도로!

그런데 당신의 말은 오직 내 눈에만 존재하는 걸까요?
우리 교환을 꾸미는 단순한 시적 예의일까요?
내 안에 깃든 병든 정신과 슬픈 영혼의 환상일까요?

알아요... 알아요 알아요... 오직 당신의 마음만이 팔 것!
오직 당신의 마음만이 팔 것이고 나는 당신을 사랑합니다.
하지만 표시된 가격의 숫자도 화폐도 모르겠습니다.
사랑합니다 머니페니스... 그게 전부입니다!

당신의 또 다른 ♥`,
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
  
    RU: `Я ТАК МНОГО ПУТЕШЕСТВОВАЛ, КОМНАТЫ С ВИДОМ ВСЕ ПОХОЖИ. Я ТАК МНОГО ПУТЕШЕСТВОВАЛ, ПОСЕЩАЛ РТЫ, ПРОНИКАЛ В ЛИЦА, ЛАСКАЛ ЯЗЫКИ. Я ТАК МНОГО ПУТЕШЕСТВОВАЛ, ТАНЦЕВАЛ В САМЫХ ТЁМНЫХ ПОЛОСТЯХ, КОТОРЫЕ ПОХОЖИ НА САМЫЕ ТЁМНЫЕ ПОЛОСТИ. Я ТАК МНОГО ПУТЕШЕСТВОВАЛ, Я ЗАСЛУЖИВАЮ, ЧТОБЫ МЕНЯ ВЫМЫЛИ БОЛЬШЕ, ЧЕМ ЛЮБОГО ДРУГОГО. И НИКОГДА Я НЕ ЧУВСТВОВАЛ СЕБЯ ТАКИМ ЧИСТЫМ, КАК ВЫЙДЯ ИЗ ЭТОЙ ИЗВРАЩЁННОЙ И ЖАЛКОЙ ГРЯЗИ. Я УЛЫБАЮСЬ ВСЕМ, А НА УЛИЦЕ Я ХОДИЛ ПОД ВСЕМИ СОЛНЦАМИ, ПОД ВСЕМИ ДОЖДЯМИ, ПОД ВСЕМИ ВЕТРАМИ. ИНОГДА БОЛЕЕ УЛЫБЧИВЫЙ, ИНОГДА БОЛЕЕ МРАЧНЫЙ. Я ТАК МНОГО ПУТЕШЕСТВОВАЛ, ЛЮДИ КАЖУТСЯ МНЕ ВСЕ ПОХОЖИМИ. ОНИ ТАКЖЕ КАЖУТСЯ МНЕ ПОЛНЫМИ ДОБРОЙ ВОЛИ И ХОРОШИХ НАМЕРЕНИЙ. У МЕНЯ НЕТ К НИМ НИЧЕГО, КРОМЕ ИСКРЕННЕЙ И ВОСХИЩЁННОЙ БЛАГОДАРНОСТИ. И КАЖДЫЙ РАЗ, КАК Я УЕЗЖАЛ, ОНИ ВОЗВРАЩАЛИСЬ В МОЙ КАРМАН, А Я УЛЫБАЛСЯ ПЕРЕД ИХ ОБЕЩАНИЕМ ДРУГИХ ПУТЕШЕСТВИЙ. Я ТАК МНОГО ПУТЕШЕСТВОВАЛ, ЧТО НАШЁЛ ТЕБЯ И БОЛЬШЕ НЕ ХОЧУ УЕЗЖАТЬ. ИЛИ ТОЛЬКО С ТОБОЙ, КОНЕЧНО.

Зайдите ко мне, проходите, говорите — я отвечу с послезавтрашнего дня.`,
  
    PL: `TAK WIELE PODRÓŻOWAŁEM, POKOJE Z WIDOKIEM WSZYSTKIE SĄ PODOBNE. TAK WIELE PODRÓŻOWAŁEM, ODWIEDZAŁEM USTA, PRZENIKAŁEM TWARZE, GŁASKAŁEM JĘZYKI. TAK WIELE PODRÓŻOWAŁEM, TAŃCZYŁEM W NAJCIEMNIEJSZYCH JAMACH, KTÓRE PRZYPOMINAJĄ NAJCIEMNIEJSZE JAMY. TAK WIELE PODRÓŻOWAŁEM, ZASŁUGUJĘ NA TO BY WYKĄPAĆ MNIE BARDZIEJ NIŻ KOGOKOLWIEK INNEGO. A NIGDY NIE CZUŁEM SIĘ TAK CZYSTY JAK PO WYJŚCIU Z TEGO PRZEWROTNEGO I ŻAŁOSNEGO BRUDU. UŚMIECHAM SIĘ DO WSZYSTKICH, A NA ULICY CHODZIŁEM W KAŻDYM SŁOŃCU, W KAŻDYM DESZCZU, W KAŻDYM WIETRZE. CZASEM BARDZIEJ UŚMIECHNIĘTY, CZASEM BARDZIEJ POSĘPNY. TAK WIELE PODRÓŻOWAŁEM, LUDZIE WYDAJĄ MI SIĘ WSZYSCY PODOBNI. WYDAJĄ MI SIĘ TAKŻE PEŁNI DOBREJ WOLI I DOBRYCH INTENCJI. NIE MAM DLA NICH NICZEGO POZA SZCZERĄ I PEŁNĄ PODZIWU WDZIĘCZNOŚCIĄ. ZA KAŻDYM RAZEM GDY WYJEŻDŻAŁEM, WRACALI DO MOJEJ KIESZENI, A JA UŚMIECHAŁEM SIĘ PRZED ICH OBIETNICĄ KOLEJNYCH PODRÓŻY. TAK WIELE PODRÓŻOWAŁEM, ŻE ZNALAZŁEM CIEBIE I NIE CHCĘ JUŻ WIĘCEJ WYJEŻDŻAĆ. ALBO TYLKO Z TOBĄ, OCZYWIŚCIE.

Wstąpcie do mnie, przechodźcie, mówcie, odpowiem od pojutrza.`,
  
    NL: `IK HEB ZOVEEL GEREISD, KAMERS MET UITZICHT LIJKEN ALLEMAAL OP ELKAAR. IK HEB ZOVEEL GEREISD, MONDEN BEZOCHT, GEZICHTEN BINNENGEDRONGEN, TONGEN GESTREELD. IK HEB ZOVEEL GEREISD, IK HEB GEDANST IN DE DONKERSTE HOLTEN DIE LIJKEN OP DE DONKERSTE HOLTEN. IK HEB ZOVEEL GEREISD, IK VERDIEN MEER GEWASSEN TE WORDEN DAN EEN ANDER. EN NOOIT HEB IK MIJ ZO ZUIVER GEVOELD ALS BIJ HET VERLATEN VAN DEZE VERDORVEN EN ERBARMELIJKE SMEERLAPPERIJ. IK GLIMLACH NAAR IEDEREEN, EN OP STRAAT HEB IK GELOPEN ONDER ALLE ZONNEN, IN ALLE REGENS, IN ALLE WINDEN. SOMS GLIMLACHENDER, SOMS DUISTERDER. IK HEB ZOVEEL GEREISD, MENSEN LIJKEN MIJ ALLEMAAL OP ELKAAR. ZE LIJKEN MIJ OOK VOL VAN GOEDE WIL EN GOEDE BEDOELINGEN. IK HEB VOOR HEN NIETS DAN OPRECHTE EN BEWONDERENDE DANKBAARHEID. EN ELKE KEER DAT IK WEGGING, KWAMEN ZE TERUG IN MIJN ZAK, EN IK GLIMLACHTE BIJ HUN BELOFTE VAN ANDERE REIZEN. IK HEB ZOVEEL GEREISD DAT IK JOU GEVONDEN HEB EN NIET MEER WIL WEGGAAN. OF ALLEEN MET JOU, NATUURLIJK.

Kom langs, kom binnen, spreek — ik antwoord vanaf overmorgen.`,
  
    EL: `ΕΧΩ ΤΑΞΙΔΕΨΕΙ ΤΟΣΟ ΠΟΛΥ, ΤΑ ΔΩΜΑΤΙΑ ΜΕ ΘΕΑ ΜΟΙΑΖΟΥΝ ΟΛΑ ΜΕΤΑΞΥ ΤΟΥΣ. ΕΧΩ ΤΑΞΙΔΕΨΕΙ ΤΟΣΟ ΠΟΛΥ, ΕΠΙΣΚΕΦΘΗΚΑ ΣΤΟΜΑΤΑ, ΔΙΕΙΣΕΔΥΣΑ ΣΕ ΠΡΟΣΩΠΑ, ΧΑΪΔΕΨΑ ΓΛΩΣΣΕΣ. ΕΧΩ ΤΑΞΙΔΕΨΕΙ ΤΟΣΟ ΠΟΛΥ, ΕΧΩ ΧΟΡΕΨΕΙ ΣΤΙΣ ΠΙΟ ΣΚΟΤΕΙΝΕΣ ΚΟΙΛΟΤΗΤΕΣ ΠΟΥ ΜΟΙΑΖΟΥΝ ΜΕ ΤΙΣ ΠΙΟ ΣΚΟΤΕΙΝΕΣ ΚΟΙΛΟΤΗΤΕΣ. ΕΧΩ ΤΑΞΙΔΕΨΕΙ ΤΟΣΟ ΠΟΛΥ, ΑΞΙΖΩ ΝΑ ΜΕ ΞΕΠΛΥΝΟΥΝ ΠΕΡΙΣΣΟΤΕΡΟ ΑΠΟ ΟΠΟΙΟΝΔΗΠΟΤΕ ΑΛΛΟΝ. ΚΑΙ ΠΟΤΕ ΔΕΝ ΕΧΩ ΝΙΩΣΕΙ ΤΟΣΟ ΚΑΘΑΡΟΣ ΟΣΟ ΒΓΑΙΝΟΝΤΑΣ ΑΠΟ ΑΥΤΗΝ ΤΗΝ ΑΣΕΛΓΗ ΚΑΙ ΑΘΛΙΑ ΛΑΣΠΗ. ΧΑΜΟΓΕΛΩ ΣΕ ΟΛΟΥΣ, ΚΑΙ ΣΤΟΥΣ ΔΡΟΜΟΥΣ ΕΧΩ ΠΕΡΠΑΤΗΣΕΙ ΚΑΤΩ ΑΠΟ ΟΛΟΥΣ ΤΟΥΣ ΗΛΙΟΥΣ, ΣΕ ΟΛΕΣ ΤΙΣ ΒΡΟΧΕΣ, ΣΕ ΟΛΟΥΣ ΤΟΥΣ ΑΝΕΜΟΥΣ. ΑΛΛΟΤΕ ΠΙΟ ΧΑΜΟΓΕΛΑΣΤΟΣ, ΑΛΛΟΤΕ ΠΙΟ ΣΚΟΤΕΙΝΟΣ. ΕΧΩ ΤΑΞΙΔΕΨΕΙ ΤΟΣΟ ΠΟΛΥ, ΟΙ ΑΝΘΡΩΠΟΙ ΜΟΥ ΦΑΙΝΟΝΤΑΙ ΟΛΟΙ ΟΜΟΙΟΙ. ΜΟΥ ΦΑΙΝΟΝΤΑΙ ΕΠΙΣΗΣ ΓΕΜΑΤΟΙ ΚΑΛΗΣ ΘΕΛΗΣΗΣ ΚΑΙ ΚΑΛΩΝ ΠΡΟΘΕΣΕΩΝ. ΔΕΝ ΕΧΩ ΓΙ' ΑΥΤΟΥΣ ΠΑΡΑ ΕΙΛΙΚΡΙΝΗ ΚΑΙ ΘΑΥΜΑΣΤΙΚΗ ΕΥΓΝΩΜΟΣΥΝΗ. ΚΑΙ ΚΑΘΕ ΦΟΡΑ ΠΟΥ ΕΦΕΥΓΑ, ΕΠΕΣΤΡΕΦΑΝ ΣΤΗΝ ΤΣΕΠΗ ΜΟΥ ΚΑΙ ΧΑΜΟΓΕΛΟΥΣΑ ΜΠΡΟΣΤΑ ΣΤΗΝ ΥΠΟΣΧΕΣΗ ΑΛΛΩΝ ΤΑΞΙΔΙΩΝ. ΕΧΩ ΤΑΞΙΔΕΨΕΙ ΤΟΣΟ ΠΟΛΥ ΠΟΥ ΣΕ ΒΡΗΚΑ ΚΑΙ ΔΕΝ ΘΕΛΩ ΠΛΕΟΝ ΝΑ ΦΥΓΩ. Η ΜΟΝΟ ΜΑΖΙ ΣΟΥ, ΦΥΣΙΚΑ.

Περάστε από μένα, περάστε, μιλήστε, θα απαντήσω από μεθαύριο.`,
  
    TR: `ÇOK SEYAHAT ETTİM, MANZARALI ODALAR HEPSİ BİRBİRİNE BENZİYOR. ÇOK SEYAHAT ETTİM, AĞIZLAR ZİYARET ETTİM, YÜZLERE NÜFUZ ETTİM, DİLLERİ OKŞADIM. ÇOK SEYAHAT ETTİM, EN KARANLIK BOŞLUKLARDA DANS ETTİM Kİ BUNLAR EN KARANLIK BOŞLUKLARA BENZİYOR. ÇOK SEYAHAT ETTİM, BAŞKA HERKESTEN DAHA FAZLA YIKANMAYI HAK EDİYORUM. VE BU SAPKIN VE ACıKLı PİSLİKTEN ÇIKARKEN OLDUĞUM KADAR TEMİZ HİSSETMEDİM. HERKESE GÜLÜMSÜYORUM, VE SOKAKTA HER GÜNEŞ ALTINDA, HER YAĞMURDA, HER RÜZGARDA YÜRÜDÜM. BAZEN DAHA GÜLÜMSEYEN, BAZEN DAHA KARANLIK. ÇOK SEYAHAT ETTİM, İNSANLAR BANA HEP BİRBİRİNE BENZİYOR GİBİ GELİYOR. AYRICA BANA İYİ NİYET VE İYİ NİYETLERLE DOLU GİBİ GÖRÜNÜYORLAR. ONLARA KARŞI İÇTEN VE HAYRAN BİR ŞÜKRANDAN BAŞKA BİR ŞEYİM YOK. VE HER AYRILDIĞIMDA, CEPLERİME GERİ DÖNDÜLER, VE BAŞKA SEYAHATLERİN VAADİ KARŞISINDA GÜLÜMSEDİM. O KADAR ÇOK SEYAHAT ETTİM Kİ SENİ BULDUM VE ARTIK AYRILMAK İSTEMİYORUM. YA DA SADECE SENİNLE, ELBETTE.

Bana uğrayın, geçin, konuşun, yarından sonra yanıt vereceğim.`,
  
    UK: `Я ТАК БАГАТО ПОДОРОЖУВАВ, КІМНАТИ З ВИДОМ ВСІ ПОДІБНІ. Я ТАК БАГАТО ПОДОРОЖУВАВ, ВІДВІДУВАВ РОТИ, ПРОНИКАВ У ОБЛИЧЧЯ, ЛАСКАВ ЯЗИКИ. Я ТАК БАГАТО ПОДОРОЖУВАВ, ТАНЦЮВАВ У НАЙТЕМНІШИХ ПОРОЖНИНАХ, ЩО НАГАДУЮТЬ НАЙТЕМНІШІ ПОРОЖНИНИ. Я ТАК БАГАТО ПОДОРОЖУВАВ, Я ЗАСЛУГОВУЮ, ЩОБ МЕНЕ ВИКУПАЛИ БІЛЬШЕ ЗА БУДЬ-КОГО ІНШОГО. І НІКОЛИ Я НЕ ПОЧУВАВ СЕБЕ ТАКИМ ЧИСТИМ, ЯК ВИЙШОВШИ З ЦЬОГО ЗБОЧЕНОГО І ЖАЛЮГІДНОГО БРУДУ. Я ПОСМІХАЮСЬ ДО ВСІХ, А НА ВУЛИЦІ Я ХОДИВ ПІД УСІМА СОНЦЯМИ, ПІД УСІМА ДОЩАМИ, ПІД УСІМА ВІТРАМИ. ІНОДІ БІЛЬШ УСМІХНЕНИЙ, ІНОДІ БІЛЬШ ХМУРИЙ. Я ТАК БАГАТО ПОДОРОЖУВАВ, ЛЮДИ ЗДАЮТЬСЯ МЕНІ ВСІ ПОДІБНИМИ. ВОНИ ТАКОЖ ЗДАЮТЬСЯ МЕНІ ПОВНИМИ ДОБРОЇ ВОЛІ І ДОБРИХ НАМІРІВ. У МЕНЕ ДО НИХ НІЧОГО, КРІМ ЩИРОЇ І ЗАХОПЛЕНОЇ ВДЯЧНОСТІ. І ЩОРАЗУ, ЯК Я ВІД'ЇЖДЖАВ, ВОНИ ПОВЕРТАЛИСЬ У МОЮ КИШЕНЮ, А Я УСМІХАВСЯ ПЕРЕД ЇХНЬОЮ ОБІЦЯНКОЮ ІНШИХ ПОДОРОЖЕЙ. Я ТАК БАГАТО ПОДОРОЖУВАВ, ЩО ЗНАЙШОВ ТЕБЕ І БІЛЬШЕ НЕ ХОЧУ ВІД'ЇЖДЖАТИ. АБО ТІЛЬКИ З ТОБОЮ, ЗВИЧАЙНО.

Зайдіть до мене, заходьте, говоріть — я відповім післязавтра.`,
  
    LT: `AŠ TIEK KELIAVAU, KAMBARIAI SU VAIZDU VISI PANAŠŪS. AŠ TIEK KELIAVAU, LANKIAU LŪPAS, ĮSISKVERBĖM Į VEIDUS, GLAMONĖJAU LIEŽUVIUS. AŠ TIEK KELIAVAU, ŠOKAU TAMSIAUSIOSE ERTMĖSE, KURIOS PANAŠIOS Į TAMSIAUSIAS ERTMES. AŠ TIEK KELIAVAU, AŠ NUSIPELNAU BŪTI IŠMAUDYTAS LABIAU NEI BET KAS KITAS. IR NIEKADA NESIJAUČIAU TOKS ŠVARUS, KAIP IŠĖJĘS IŠ ŠITO IŠKRYPUSIO IR APGAILĖTINO PURVO. AŠ ŠYPSAUSI VISIEMS, O GATVĖJE EIDAVAU PO VISOMIS SAULĖMIS, VISUOSE LIETUMS, VISUOSE VĖJUOSE. KARTAIS LABIAU ŠYPSANTIS, KARTAIS LABIAU NIŪRESNIS. AŠ TIEK KELIAVAU, ŽMONĖS MAN ATRODO VISI PANAŠŪS. JIE MAN TAIP PAT ATRODO PILNI GEROS VALIOS IR GERŲ KETINIMŲ. AŠ JIEMS NETURIU NIEKO, IŠSKYRUS NUOŠIRDŲ IR DŽIAUGSMINGĄ DĖKINGUMĄ. IR KIEKVIENĄ KARTĄ, KAI IŠVYKDAVAU, JIE GRĮŽDAVO Į MANO KIŠENĘ, IR AŠ ŠYPSODAVAUSI PRIEŠ JŲ KITŲ KELIONIŲ PAŽADUS. AŠ TIEK KELIAVAU, KAD RADAU TAVE IR NEBENORIU VAŽIUOTI. ARBA TIK SU TAVIMI, ŽINOMA.

Užeikite pas mane, eikite, kalbėkite, atsakysiu nuo poryt.`,
    AR: `لقد سافرت كثيراً، الغرف ذات الإطلالة تتشابه كلها. لقد سافرت كثيراً، زرت أفواهاً، اخترقت وجوهاً، داعبت ألسنة. لقد سافرت كثيراً، رقصت في أحلك التجاويف التي تشبه أحلك التجاويف. لقد سافرت كثيراً، أستحق أن أُغسل أكثر مما يحين دوري. لقد سافرت كثيراً، متمايلاً بليونة بين تلك الأفخاذ القوية التي تحملني وتساندني. لقد سافرت كثيراً، برفقة أو دونها، حقائبي الثقيلة متدلية في الأسفل. لقد سافرت كثيراً، دون أن أهرب فعلاً. لقد سافرت كثيراً، أهرب أحياناً. لقد سافرت كثيراً، مُصبَّناً احتراماً لذاتي، لقد سافرت كثيراً، معطَّراً دون خجل من باقيكم. لقد سافرت كثيراً، خاضعاً للإيقاع المتمايل لأخ يحتضر على ظهري. لقد سافرت كثيراً، عرفت أشد الارتعاشات يأساً. لقد سافرت كثيراً، دائماً مغسولاً، دائماً مدلَّلاً. لقد سافرت كثيراً، لكن هذا هو معنى حياتنا: الرقص، الموت يسيل اللعاب، والبدء من جديد. لقد سافرت كثيراً، خرجت بمعجزة، عدت إلى الحياة، أشعر بحقي ينزلق إلى جيبه ملاصقاً لي. لقد جبت العالم المعروف بأسماء كثيرة مختلفة: "إل فانتاستيكو زوب ديلوكس"... "إل تشيبر دي أورو"... "ثيك أمور"... "بانزر بينيس"... "كوك أوريكو"... لقد جبت العالم، أحياناً ضعت. لقد سافرت كثيراً حتى أنه، أحياناً، لا يبقى مني سوى ذلك الإحساس الناتج عن "آغواس دي مارسو"...
لقد سافرت كثيراً، أنا منيبينيس وأنت تحبني.`,
    HE: `נסעתי כל כך הרבה, חדרים עם נוף נראים כולם דומים. נסעתי כל כך הרבה, ביקרתי בפיות, חדרתי לפנים, ליטפתי לשונות. נסעתי כל כך הרבה, רקדתי בחללים האפלים ביותר הדומים לחללים האפלים ביותר. נסעתי כל כך הרבה, מגיע לי להיות מקולח לעיתים תכופות יותר מתורי. נסעתי כל כך הרבה, מתנדנד רך בין אותם ירכיים אדירות הנושאות ותומכות בי. נסעתי כל כך הרבה, מלווה או לא, מזוודותיי הכבדות תלויות למטה. נסעתי כל כך הרבה, מבלי לברוח באמת. נסעתי כל כך הרבה, בורח לפעמים. נסעתי כל כך הרבה, מסובן מתוך כבוד עצמי, נסעתי כל כך הרבה, מבושם בלי בושה מפניכם. נסעתי כל כך הרבה, כפוף לקצב המתנדנד של אח גוסס על גבי. נסעתי כל כך הרבה, הכרתי את הרעדים הנואשים ביותר. נסעתי כל כך הרבה, תמיד שטוף, תמיד מפונק. נסעתי כל כך הרבה, אבל זוהי משמעות חיינו: לרקוד, למות בריר ולהתחיל מחדש. נסעתי כל כך הרבה, ניצל בנס, קם לתחייה, מרגיש את מגיע לי מחליק אל כיסו צמוד אלי. חציתי את העולם המוכר בכל כך הרבה שמות שונים: "אל פנטסטיקו זוב דלוקס"... "אל צ'יברה דה אורו"... "ת'יק אמור"... "פנצר פניס"... "קוק אוריקו"... חציתי את העולם, לפעמים איבדתי את עצמי. נסעתי כל כך הרבה ש, לפעמים, כל מה שנשאר ממני זו אותה תחושה הנובעת מ"אגואס די מארסו"...
נסעתי כל כך הרבה, אני מאניפניס ואתה אוהב אותי.`,
    FA: `آنقدر سفر کرده‌ام که اتاق‌های با چشم‌انداز همگی شبیه به هم به نظر می‌رسند. آنقدر سفر کرده‌ام، دهان‌ها را زیارت کرده‌ام، چهره‌ها را در نوردیده‌ام، زبان‌ها را نوازش کرده‌ام. آنقدر سفر کرده‌ام که در تاریک‌ترین حفره‌ها رقصیده‌ام، حفره‌هایی شبیه به تاریک‌ترین حفره‌ها. آنقدر سفر کرده‌ام که شایستهٔ آنم که بیشتر از نوبتم دوش بگیرم. آنقدر سفر کرده‌ام، نرم بین آن ران‌های نیرومند که مرا حمل می‌کنند و نگاه می‌دارند، تاب می‌خورم. آنقدر سفر کرده‌ام، با همراه یا بی همراه، چمدان‌های سنگینم آویزان در پایین. آنقدر سفر کرده‌ام، بی آنکه واقعاً بگریزم. آنقدر سفر کرده‌ام، گاه گریزان. آنقدر سفر کرده‌ام، صابون‌خورده از احترام به خود، آنقدر سفر کرده‌ام، عطرآگین بی شرم از دیگر شما. آنقدر سفر کرده‌ام، تسلیم ریتم تاب‌دار برادری در حال جان‌کندن بر پشتم. آنقدر سفر کرده‌ام، نومیدترین لرزش‌ها را شناخته‌ام. آنقدر سفر کرده‌ام، همیشه شسته، همیشه نازپرورده. آنقدر سفر کرده‌ام، اما این است معنای زندگی ما: رقصیدن، آب‌دهان‌ریزان مردن و از نو آغازیدن. آنقدر سفر کرده‌ام، معجزه‌آسا رها شده، رستاخیز یافته، حق خود را احساس می‌کنم که به جیب او می‌لغزد، در آغوش من. جهان شناخته‌شده با نام‌های گوناگون بسیار را پیموده‌ام: «ال فانتاستیکو زوب دلوکس»... «ال چیبره دو ارو»... «تیک آمور»... «پانزر پنیس»... «کاک اوریکو»... جهان را پیموده‌ام، گاه خود را گم کرده‌ام. آنقدر سفر کرده‌ام که، گاهی، از من جز آن احساس برخاسته از «آگوآس دو مارسو» چیزی نمی‌ماند...
آنقدر سفر کرده‌ام، من منی‌پنیسم و تو دوستم داری.`,
    KO: `나는 너무 많이 여행했다, 전망 있는 방들은 모두 비슷해 보인다. 나는 너무 많이 여행했다, 입들을 방문했고, 얼굴들을 관통했고, 혀들을 어루만졌다. 나는 너무 많이 여행했다, 가장 어두운 동굴들 속에서 춤을 추었으니 가장 어두운 동굴들과 닮은 것들이었다. 나는 너무 많이 여행했다, 내 차례보다 더 자주 씻겨질 자격이 있다. 나는 너무 많이 여행했다, 나를 짊어지고 지탱하는 저 강력한 허벅지들 사이에서 부드럽게 흔들리며. 나는 너무 많이 여행했다, 동반자가 있든 없든, 무거운 짐들이 아래로 늘어진 채. 나는 너무 많이 여행했다, 진정으로 도망치지는 않은 채. 나는 너무 많이 여행했다, 때로는 도망치면서. 나는 너무 많이 여행했다, 자존심에서 비누칠을 했고, 나는 너무 많이 여행했다, 너희 나머지에 대한 부끄러움 없이 향수를 뿌렸다. 나는 너무 많이 여행했다, 내 등 위에서 죽어가는 형제의 흔들리는 리듬에 복종하며. 나는 너무 많이 여행했다, 가장 절망적인 떨림들을 알았다. 나는 너무 많이 여행했다, 항상 씻겼고, 항상 보살핌을 받았다. 나는 너무 많이 여행했다, 그러나 그것이 우리 삶의 의미이다: 춤추고, 침을 흘리며 죽고 다시 시작하는 것. 나는 너무 많이 여행했다, 기적적으로 살아남아, 부활하여, 내 몫이 내게 바짝 붙은 그의 주머니로 미끄러져 들어가는 것을 느끼며. 나는 그토록 많은 다른 이름들로 알려진 세계를 누볐다: "엘 판타스티코 좁 디럭스"... "엘 시브레 데 오로"... "씩 아무르"... "판처 페니스"... "콕 오리코"... 나는 세계를 누볐다, 때로는 길을 잃었다. 나는 너무 많이 여행했기에, 때때로, 나에게 남는 것은 "아구아스 드 마르수"에서 비롯되는 그 감각뿐이다...
나는 너무 많이 여행했다, 나는 머니페니스이고 너는 나를 사랑한다.`,
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
  
    RU: `Лето 2023

Твоё успокоенное лицо — это твой любимый мой портрет.
Растрёпанные в меру волосы, расслабленные черты, закрытые глаза,
лицо безмятежности, которое заставляет меня писать тебе зелёными чернилами.

Эй, Money-p

Помнишь ли ты наши обменянные радости?
Или они теряются вместе с теми, что разделены в других местах?
Они теряются, я знаю, что значит давать
себе всё то, что вечером даёшь только себе.

Не обижайся, поскольку ты сам это пишешь, я тебя цитирую:
«Я не для всех, я для каждого
кто меня выбирает.»
Кто хорошо выбирает, плохо делит, говорю я.

Я часто буду повторять тебе: думай хорошо!
А моё имя из голубя, ты унесёшь его с собой,
с другой стороны слов.`,
  
    PL: `Lato 2023

Twoja uspokojona twarz, to mój ulubiony portret ciebie.
Włosy w nieładzie z umiarem, rysy odprężone, oczy zamknięte,
twarz pogody ducha która sprawia, że piszę do ciebie zielonym atramentem.

Hej Money-p

Pamiętasz nasze wymienione radości?
Czy też gubią się z tymi dzielonymi gdzie indziej?
Gubią się, wiem co znaczy dawać
sobie to wszystko co wieczorem daje się tylko sobie.

Nie obrażaj się, ponieważ sam to piszesz, cytuję cię:
«Nie jestem dla wszystkich, jestem dla każdego
kto mnie wybiera.»
Kto dobrze wybiera, źle dzieli, ja mówię.

Często będę ci to powtarzać: pomyśl dobrze!
A moje imię z gołębia, zabierzesz je ze sobą,
po drugiej stronie słów.`,
  
    NL: `Zomer 2023

Jouw gekalmeerde gezicht is het portret van jou dat ik het liefst zie.
Met mate verward, ontspannen trekken, gesloten ogen,
het gezicht van de sereniteit dat mij ertoe brengt jou met groene inkt te schrijven.

Hé Money-p

Herinner je je onze uitgewisselde vreugden?
Of verliezen ze zich met die elders gedeeld?
Ze verliezen zich, ik weet wat het betekent zichzelf
alles te geven wat men 's avonds slechts aan zichzelf geeft.

Wees niet beledigd, aangezien jij het zelf schrijft, ik citeer je:
«Ik ben er niet voor iedereen, ik ben er voor elk
die mij kiest.»
Wie goed kiest, deelt slecht, zeg ik.

Ik zal je dat vaak herhalen: denk er goed over na!
En mijn naam van duif, je zult hem met je meenemen,
aan de andere kant van de woorden.`,
  
    EL: `Καλοκαίρι 2023

Το γαληνεμένο σου πρόσωπο, είναι το πορτρέτο σου που προτιμώ.
Αναμαλλιασμένος με μέτρο, χαλαρωμένα χαρακτηριστικά, κλειστά μάτια,
το πρόσωπο της γαλήνης που με κάνει να σου γράφω με πράσινη μελάνη.

Έι Money-p

Θυμάσαι τις ανταλλαγμένες χαρές μας;
Ή χάνονται με αυτές που μοιραστήκαμε αλλού;
Χάνονται, ξέρω τι σημαίνει να δίνω
στον εαυτό μου όλα αυτά που το βράδυ δίνουμε μόνο στον εαυτό μας.

Μην προσβληθείς, αφού εσύ ο ίδιος το γράφεις, σε παραθέτω:
«Δεν είμαι για όλους, είμαι για τον καθένα
που με διαλέγει.»
Όποιος διαλέγει καλά, μοιράζει άσχημα, λέω.

Θα στο επαναλάβω συχνά: σκέψου καλά!
Και το όνομά μου του περιστεριού, θα το πάρεις μαζί σου,
από την άλλη πλευρά των λέξεων.`,
  
    TR: `Yaz 2023

Sakinleşmiş yüzün, senin en sevdiğim portrenidir.
Ölçülü dağınık saçlar, gevşemiş çizgiler, kapalı gözler,
sana yeşil mürekkeple yazmama neden olan sükunetin yüzü.

Hey Money-p

Paylaştığımız sevinçleri hatırlıyor musun?
Yoksa başka yerlerde paylaşılanlarla mı kayboluyorlar?
Kayboluyorlar, akşam yalnızca kendine
verdiğin her şeyi kendine vermenin ne demek olduğunu biliyorum.

Alınma, çünkü bunu sen yazıyorsun, seni alıntılıyorum:
«Herkes için değilim, beni seçen
herkes için varım.»
İyi seçen, kötü paylaşır, derim ben.

Sana bunu sık sık tekrarlayacağım: iyi düşün!
Ve güvercin ismimi, yanında götüreceksin,
kelimelerin diğer tarafına.`,
  
    UK: `Літо 2023

Твоє заспокоєне обличчя — це твій улюблений мій портрет.
Розкуйовджений в міру, риси розслаблені, очі заплющені,
обличчя безтурботності, що змушує мене писати тобі зеленим чорнилом.

Гей Money-p

Чи пам'ятаєш ти наші обмінені радощі?
Чи вони губляться з тими, поділеними в інших місцях?
Вони губляться, я знаю, що означає давати
собі все те, що ввечері даєш тільки собі.

Не ображайся, оскільки ти сам це пишеш, я тебе цитую:
«Я не для всіх, я для кожного,
хто мене обирає.»
Хто добре обирає, погано ділить, кажу я.

Я часто буду тобі повторювати: подумай добре!
А моє ім'я голубине, ти візьмеш його з собою,
з іншого боку слів.`,
  
    LT: `Vasara 2023

Tavo nurimęs veidas, tai tavo portretas, kurį labiausiai mėgstu.
Susitaršęs su saiku, bruožai atsipalaidavę, akys užmerktos,
ramybės veidas, kuris verčia mane rašyti tau žaliu rašalu.

Eii Money-p

Ar prisimeni mūsų pasikeistus džiaugsmus?
Ar jie pasimeta su tais, kurie pasidalinti kitur?
Pasimeta, žinau, ką reiškia duoti
sau visa tai, ką vakare duodi tik sau.

Neįsižeisk, nes tu pats tai rašai, cituoju tave:
«Aš ne visiems, aš kiekvienam,
kuris mane pasirenka.»
Kas gerai pasirenka, blogai dalina, sakau aš.

Dažnai tau tai kartosiu: gerai pagalvok!
O mano balandiškas vardas, tu nešiesi jį su savimi,
kitoje žodžių pusėje.`,
    AR: `صيف 2023

وجهك الهادئ، هو صورتك التي أفضّلها.
أشعث دون مبالغة، الملامح مسترخية، العينان مغمضتان،
وجه السكينة الذي يدفعني للكتابة إليك بحبر أخضر.

يا منيبي

أتذكر أفراحنا المتبادلة؟
أم أنها تضيع مع تلك المتقاسمة في مكان آخر؟
هل تختلط بلحظات أنانيتي العادية؟
بحماسة الاندفاع لقلة خبرتي؟
أم أنها أكثر حزناً تغرق في دموعك؟
يا قوسي الرقيق المشدود، منيبينيس اكتب لي.
اكتب لي رذائلك، شروط خدمتك
اكتب لي رغباتك، ضحكاتك، مخاوفك، والأسوأ أيضاً...
أحبك.

الآخر الدائم الإخلاص لك ♥`,
    HE: `קיץ 2023

פניך השלוות, זה הדיוקן שלך שאני מעדיף.
פרוע מעט, תווים רגועים, עיניים עצומות,
פני השלווה הגורמים לי לכתוב לך בדיו ירוקה.

הי מאני-פ

האם אתה זוכר את שמחותינו המשותפות?
או שהן הולכות לאיבוד עם אלה החלוקות במקום אחר?
האם הן מתערבבות עם רגעי האנוכיות הרגילים שלי?
עם ההתרגשות הנמהרת של חוסר ניסיוני?
או, עצוב יותר, האם הן שוקעות בדמעותיך?
קשת מתוחה ורכה שלי, מאניפניס כתוב לי.
כתוב לי את החטאים שלך, את חוקי השירות שלך
כתוב לי את תשוקותיך, את צחוקיך, את פחדיך, וגם את הגרוע ביותר...
אני אוהב אותך.

האחר שלך התמיד נאמן ♥`,
    FA: `تابستان 2023

چهرهٔ آرام تو، تصویری از توست که بیشترین می‌پسندم.
کمی ژولیده، چهره‌ای آسوده، چشمانی بسته،
چهرهٔ آرامشی که مرا وادار می‌کند تا با مرکب سبز به تو بنویسم.

هی منی-پ

آیا شادی‌های مشتركمان را به یاد می‌آوری؟
یا با شادی‌های قسمت‌شده در جاهای دیگر گم می‌شوند؟
آیا با لحظات خودخواهی عادی‌ام درمی‌آمیزند؟
با شور شتابزدهٔ بی‌تجربگی‌ام؟
یا غم‌انگیزتر، در اشک‌های تو غرق می‌شوند؟
کمان لطیف کشیدهٔ من، منی‌پنیس برایم بنویس.
رذایلت، قوانین خدمتت را برایم بنویس
آرزوهایت، خنده‌هایت، ترس‌هایت، و بدترین را نیز برایم بنویس...
دوستت دارم.

دیگرِ همیشه فداکار تو ♥`,
    KO: `2023년 여름

너의 평온한 얼굴, 그것이 내가 좋아하는 너의 초상이다.
약간 헝클어진, 긴장이 풀린 이목구비, 감긴 눈,
초록 잉크로 너에게 편지를 쓰게 만드는 평온의 얼굴.

이봐 머니-피

우리가 함께 나눈 기쁨을 기억하는가?
아니면 다른 곳에서 나눈 것들과 함께 사라지는가?
나의 평범한 이기심의 순간들과 섞이는가?
나의 미숙함의 성급한 흥분과 함께?
아니면 더 슬프게, 너의 눈물 속에 가라앉는가?
나의 부드럽게 당겨진 활이여, 머니페니스 나에게 편지를 써다오.
너의 악덕들을, 너의 봉사의 법칙들을 나에게 써다오
너의 욕망들을, 너의 웃음들을, 너의 두려움들을, 그리고 최악의 것도 써다오...
사랑한다.

언제나 헌신적인 너의 또 다른 ♥`,
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
  
    RU: `Я ПЕРЕОДЕВАЮ СВОИ ЖЕЛАНИЯ
Я СДЕЛАЛ СВОИМИ ЖЕЛАНИЯ ДРУГИХ
МОИ УДОВОЛЬСТВИЯ ОСТАЮТСЯ СО МНОЙ
ВЫ НИКОГДА НИЧЕГО О НИХ НЕ УЗНАЕТЕ...
МОЖЕТ БЫТЬ, ЭТО ЛИШИТЬ СЕБЯ ИХ?
Я ФИЗИОТЕРАПЕВТ ВАШИХ ИНТИМНЫХ ВПАДИН
ТЕХ, ЧТО У ВАШИХ ВЫСТУПАЮЩИХ ИНТИМНОСТЕЙ.
ВЫ МОЖЕТЕ ТАКЖЕ ИГРАТЬ В ДОКТОРА,
ИГРАТЬ В МЕДСЕСТРУ... НЕ В АНЕСТЕЗИОЛОГА...
ВЫ МОЖЕТЕ ИГРАТЬ В МАЛЫШКУ, ПЛУТА,
ШЛЮХУ, СВЯТУЮ,
ТОЛЬКО НЕ В ИНТИМНОГО ВРАГА...
Я ВАШ ПОВЕЛИТЕЛЬ И ВАШ РАБ
Я ВАШ ЗВЕРЬ, ВАШ КОНЬ,
ИГРА КОТОРАЯ КОНЧАЕТСЯ
ИГРА КОТОРАЯ НЕ КОНЧАЕТСЯ.
Я ВАШ MONEYPENIS, ПОТОМУ ЧТО МНЕ ТАК НРАВИТСЯ
ПОТОМУ ЧТО ВАМ ТАК НРАВИТСЯ.
ВАШИ ДЕНЬГИ ПРИХОДЯТ И УХОДЯТ
ПУСТЫЕ КАК ВАШИ ОБЕЩАНИЯ
НА МОЁМ БЕРЕГУ ИХ ВОЛНЫ ОБ Я КОТОРОМ ОНИ НИЧЕГО НЕ ЗНАЮТ.
И ТЕМ НЕ МЕНЕЕ Я ВСЕГДА ВАШ ПРИЛИВ,
МОЙ ОДНОНОЧНЫЙ КЛИЕНТ, ТЕАТР ОДНОЙ ВСТРЕЧИ.
Я ВАШ ПРОТЕЖЕ ОДНОЙ НОЧИ,
КОТОРЫЙ ПРОТЕЖИРУЕТ ВАС НАВСЕГДА.`,
  
    PL: `PRZEBIERAM SWOJE PRAGNIENIA
UCZYNIŁEM SWOIMI PRAGNIENIA INNYCH
MOJE PRZYJEMNOŚCI POZOSTAJĄ ZE MNĄ
NIGDY NIC O NICH NIE BĘDZIECIE WIEDZIEĆ...
MOŻE TO JEST POZBAWIENIE SIĘ ICH?
JESTEM FIZJOTERAPEUTĄ WASZYCH INTYMNYCH ZAGŁĘBIEŃ
TYM WASZYCH WYSTAJĄCYCH INTYMNOŚCI.
MOŻECIE TAKŻE GRAĆ W DOKTORA,
GRAĆ W PIELĘGNIARKĘ... NIE W ANESTEZJOLOGA...
MOŻECIE GRAĆ W MAŁĄ, W ŁOTRZYCĘ,
W DZIWKĘ, W ŚWIĘTĄ,
TYLKO NIE W INTYMNEGO WROGA...
JESTEM WASZYM PANEM I WASZYM NIEWOLNIKIEM
JESTEM WASZĄ BESTIĄ, WASZYM KONIEM,
GRĄ KTÓRA SIĘ KOŃCZY
GRĄ KTÓRA SIĘ NIE KOŃCZY.
JESTEM WASZYM MONEYPENIS, BO MI SIĘ TO PODOBA
BO WAM SIĘ TO PODOBA.
WASZE PIENIĄDZE PRZYCHODZĄ I ODCHODZĄ
PUSTE JAK WASZE OBIETNICE
NA MOIM BRZEGU ICH FALE O MNIE O KTÓRYM NIC NIE WIEDZĄ.
A JEDNAK ZAWSZE JESTEM WASZYM PRZYPŁYWEM,
MÓJ JEDNONOCNY KLIENT, TEATR JEDNEGO SPOTKANIA.
JESTEM WASZYM JEDNONOCNYM PROTEŻOWANYM
KTÓRY PROTEŻUJE WAS NA ZAWSZE.`,
  
    NL: `IK VERMOM MIJN VERLANGENS
IK HEB DIE VAN ANDEREN TOT DE MIJNE GEMAAKT
MIJN GENOEGENS BLIJVEN BIJ MIJ
JULLIE ZULLEN ER NOOIT IETS VAN WETEN...
MISSCHIEN IS HET MEZELF ERVAN BEROVEN?
IK BEN DE KINESITHERAPEUT VAN UW INTIEME HOLTES
DIE VAN UW UITSTEKENDE INTIMITEITEN.
JULLIE KUNNEN OOK DOKTER SPELEN,
VERPLEEGSTER SPELEN... NIET ANESTHESIST...
JULLIE KUNNEN BABY SPELEN, SCHURK,
HOER, HEILIGE,
ALLEEN NIET INTIEME VIJAND...
IK BEN UW MEESTER EN UW SLAAF
IK BEN UW BEEST, UW PAARD,
EEN SPEL DAT EINDIGT
EEN SPEL DAT NIET EINDIGT.
IK BEN UW MONEYPENIS, OMDAT HET MIJ BEHAAGT
OMDAT HET U BEHAAGT.
UW GELD KOMT EN GAAT
LEEG ZOALS UW BELOFTEN
OP MIJN OEVER HUN GOLVEN OVER MIJ WAAROVER ZIJ NIETS WETEN.
EN TOCH BEN IK ALTIJD UW VLOED,
MIJN KLANT VAN ÉÉN NACHT, THEATER VAN ÉÉN ONTMOETING.
IK BEN UW PROTÉGÉ VAN ÉÉN NACHT
DIE U VOOR ALTIJD ALS PROTÉGÉ HEEFT.`,
  
    EL: `ΜΕΤΑΜΦΙΕΖΩ ΤΙΣ ΕΠΙΘΥΜΙΕΣ ΜΟΥ
ΕΧΩ ΚΑΝΕΙ ΔΙΚΕΣ ΜΟΥ ΑΥΤΕΣ ΤΩΝ ΑΛΛΩΝ
ΟΙ ΑΠΟΛΑΥΣΕΙΣ ΜΟΥ ΜΕΝΟΥΝ ΜΑΖΙ ΜΟΥ
ΔΕΝ ΘΑ ΜΑΘΕΤΕ ΠΟΤΕ ΤΙΠΟΤΑ ΓΙ' ΑΥΤΕΣ...
ΙΣΩΣ ΕΙΝΑΙ ΤΟ ΝΑ ΣΤΕΡΗΘΩ ΑΠ' ΑΥΤΕΣ;
ΕΙΜΑΙ Ο ΦΥΣΙΟΘΕΡΑΠΕΥΤΗΣ ΤΩΝ ΕΣΩΤΕΡΙΚΩΝ ΣΑΣ ΚΟΙΛΟΤΗΤΩΝ
ΑΥΤΟΣ ΤΩΝ ΕΞΕΧΟΥΣΩΝ ΕΣΩΤΕΡΙΚΟΤΗΤΩΝ ΣΑΣ.
ΜΠΟΡΕΙΤΕ ΕΠΙΣΗΣ ΝΑ ΠΑΙΞΕΤΕ ΤΟΝ ΓΙΑΤΡΟ,
ΝΑ ΠΑΙΞΕΤΕ ΤΗΝ ΝΟΣΟΚΟΜΑ... ΟΧΙ ΤΟΝ ΑΝΑΙΣΘΗΣΙΟΛΟΓΟ...
ΜΠΟΡΕΙΤΕ ΝΑ ΠΑΙΞΕΤΕ ΤΟ ΜΩΡΟ, ΤΟΝ ΑΛΗΤΗ,
ΤΗΝ ΠΟΥΤΑΝΑ, ΤΗΝ ΑΓΙΑ,
ΜΟΝΟ ΟΧΙ ΤΟΝ ΕΣΩΤΕΡΙΚΟ ΕΧΘΡΟ...
ΕΙΜΑΙ Ο ΑΦΕΝΤΗΣ ΣΑΣ ΚΑΙ Ο ΣΚΛΑΒΟΣ ΣΑΣ
ΕΙΜΑΙ ΤΟ ΘΗΡΙΟ ΣΑΣ, ΤΟ ΑΛΟΓΟ ΣΑΣ,
ΕΝΑ ΠΑΙΧΝΙΔΙ ΠΟΥ ΤΕΛΕΙΩΝΕΙ
ΕΝΑ ΠΑΙΧΝΙΔΙ ΠΟΥ ΔΕΝ ΤΕΛΕΙΩΝΕΙ.
ΕΙΜΑΙ Ο MONEYPENIS ΣΑΣ, ΕΠΕΙΔΗ ΜΟΥ ΑΡΕΣΕΙ ΕΤΣΙ
ΕΠΕΙΔΗ ΣΑΣ ΑΡΕΣΕΙ ΕΤΣΙ.
ΤΑ ΧΡΗΜΑΤΑ ΣΑΣ ΕΡΧΟΝΤΑΙ ΚΑΙ ΦΕΥΓΟΥΝ
ΑΔΕΙΑ ΟΠΩΣ ΟΙ ΥΠΟΣΧΕΣΕΙΣ ΣΑΣ
ΣΤΗΝ ΑΚΤΗ ΜΟΥ ΤΑ ΚΥΜΑΤΑ ΤΟΥΣ ΓΙΑ ΕΜΕΝΑ ΓΙΑ ΤΟΝ ΟΠΟΙΟ ΔΕΝ ΞΕΡΟΥΝ ΤΙΠΟΤΑ.
ΚΙ ΟΜΩΣ ΕΙΜΑΙ ΠΑΝΤΑ Η ΠΛΗΜΜΥΡΙΔΑ ΣΑΣ,
Ο ΠΕΛΑΤΗΣ ΜΙΑΣ ΝΥΧΤΑΣ ΜΟΥ, ΘΕΑΤΡΟ ΜΙΑΣ ΣΥΝΑΝΤΗΣΗΣ.
ΕΙΜΑΙ Ο ΠΡΟΣΤΑΤΕΥΟΜΕΝΟΣ ΜΙΑΣ ΝΥΧΤΑΣ ΣΑΣ
ΠΟΥ ΣΑΣ ΠΡΟΣΤΑΤΕΥΕΙ ΓΙΑ ΠΑΝΤΑ.`,
  
    TR: `ARZULARIMI KOSTÜMLÜYORUM
BAŞKALARININKİNİ KENDİME MAL ETTİM
ZEVKLERİM YANIMDA KALIYOR
ONLAR HAKKINDA HİÇBİR ŞEY ÖĞRENMEYECEKSİNİZ...
BELKİ DE BU ONLARDAN MAHRUM KALMAKTIR?
BEN İÇSEL ÇUKURLARINIZIN FİZYOTERAPİSTİYİM
ÇIKINTILI MAHREMİYETLERİNİZİNKİ.
DOKTORU DA OYNAYABİLİRSİNİZ,
HEMŞİREYİ OYNAYABİLİRSİNİZ... ANESTEZİSTİ DEĞİL...
BEBEĞİ, HİLEKARI,
FAHİŞEYİ, AZİZİ OYNAYABİLİRSİNİZ,
SADECE İÇSEL DÜŞMANI OYNAMAYIN...
BEN SİZİN EFENDİNİZ VE KÖLENİZİM
BEN SİZİN CANAVARINIZ, ATINIZIM,
BİTEN BİR OYUN
BİTMEYEN BİR OYUN.
BEN MONEYPENIS'İNİZİM, ÇÜNKÜ ÖYLE HOŞUMA GİDİYOR
ÇÜNKÜ ÖYLE HOŞUNUZA GİDİYOR.
PARANIZ GELİYOR VE GİDİYOR
VAATLERİNİZ GİBİ BOŞ
SAHİLİMDE DALGALARI ONLARIN HİÇ BİLMEDİĞİ BEN HAKKINDA.
VE YİNE DE HER ZAMAN SİZİN GELGİTİNİZİM,
TEK GECELİK MÜŞTERİM, TEK BULUŞMANIN TİYATROSU.
BEN BİR GECELİK HİMAYELİNİZİM
Kİ SİZİ SONSUZA DEK HİMAYE EDER.`,
  
    UK: `Я ПЕРЕОДЯГАЮ СВОЇ БАЖАННЯ
Я ЗРОБИВ СВОЇМИ БАЖАННЯ ІНШИХ
МОЇ ЗАДОВОЛЕННЯ ЗАЛИШАЮТЬСЯ ЗІ МНОЮ
ВИ НІКОЛИ НІЧОГО ПРО НИХ НЕ ДІЗНАЄТЕСЬ...
МОЖЕ ЦЕ ПОЗБАВИТИ СЕБЕ ЇХ?
Я ФІЗІОТЕРАПЕВТ ВАШИХ ІНТИМНИХ ЗАГЛИБИН
ТИХ, ЩО ВАШИХ ВИСТУПАЮЧИХ ІНТИМНОСТЕЙ.
ВИ МОЖЕТЕ ТАКОЖ ГРАТИ В ЛІКАРЯ,
ГРАТИ В МЕДСЕСТРУ... НЕ В АНЕСТЕЗІОЛОГА...
ВИ МОЖЕТЕ ГРАТИ В МАЛЯТКО, В ПАДЛЮКУ,
В ПОВІЮ, В СВЯТУ,
ТІЛЬКИ НЕ В ІНТИМНОГО ВОРОГА...
Я ВАШ ПАН І ВАШ РАБ
Я ВАШ ЗВІР, ВАШ КІНЬ,
ГРА, ЯКА ЗАКІНЧУЄТЬСЯ
ГРА, ЯКА НЕ ЗАКІНЧУЄТЬСЯ.
Я ВАШ MONEYPENIS, БО МЕНІ ТАК ПОДОБАЄТЬСЯ
БО ВАМ ТАК ПОДОБАЄТЬСЯ.
ВАШІ ГРОШІ ПРИХОДЯТЬ І ЙДУТЬ
ПОРОЖНІ, ЯК ВАШІ ОБІЦЯНКИ
НА МОЄМУ БЕРЕЗІ ЇХНІ ХВИЛІ ПРО МЕНЕ, ПРО ЯКОГО ВОНИ НІЧОГО НЕ ЗНАЮТЬ.
І ВСЕ Ж Я ЗАВЖДИ ВАШ ПРИЛИВ,
МІЙ КЛІЄНТ ОДНІЄЇ НОЧІ, ТЕАТР ОДНІЄЇ ЗУСТРІЧІ.
Я ВАШ ОПІКУВАНИЙ ОДНІЄЇ НОЧІ,
ЩО ОПІКУЄ ВАС НАЗАВЖДИ.`,
  
    LT: `AŠ PERSIRENGIU SAVO GEISMUS
AŠ PADARIAU SAVAIS KITŲ GEISMUS
MANO MALONUMAI LIEKA SU MANIMI
JŪS NIEKADA NIEKO APIE JUOS NESUŽINOSITE...
GAL TAI ATSISAKYMAS JŲ?
AŠ ESU JŪSŲ INTYMIŲ ĮDUBŲ KINEZITERAPEUTAS
TAS JŪSŲ IŠSIKIŠUSIŲ INTYMUMŲ.
JŪS TAIP PAT GALITE VAIDINTI DAKTARĄ,
VAIDINTI SLAUGYTOJĄ... NE ANESTEZIOLOGĄ...
GALITE VAIDINTI KŪDIKĮ, ŠELMĮ,
KEKŠĘ, ŠVENTĄJĄ,
TIK NE INTYMŲ PRIEŠĄ...
AŠ ESU JŪSŲ PONAS IR JŪSŲ VERGAS
AŠ ESU JŪSŲ ŽVĖRIS, JŪSŲ ARKLYS,
ŽAIDIMAS, KURIS BAIGIASI
ŽAIDIMAS, KURIS NESIBAIGIA.
AŠ ESU JŪSŲ MONEYPENIS, NES MAN TAIP PATINKA
NES JUMS TAIP PATINKA.
JŪSŲ PINIGAI ATEINA IR IŠEINA
TUŠTI KAIP JŪSŲ PAŽADAI
MANO KRANTE JŲ BANGOS APIE MANE, APIE KURĮ JIE NIEKO NEŽINO.
IR TAČIAU AŠ VISADA JŪSŲ POTVYNIS,
MANO VIENOS NAKTIES KLIENTAS, VIENO SUSITIKIMO TEATRAS.
AŠ ESU JŪSŲ VIENOS NAKTIES GLOBOTINIS,
KURIS JUS GLOBOJA AMŽINAI.`,
    AR: `أخفي رغباتي
جعلت رغبات الآخرين رغباتي
متعي تبقى معي
لن تعرفوا عنها شيئاً أبداً...
ربما لأحرم نفسي منها؟
أنا أخصائي العلاج الطبيعي لتجاويفكم الحميمة
ولبروزاتكم الحميمة.
يمكنكم أيضاً اللعب بدور الطبيب،
بدور الممرضة... لا الطبيب المخدر...
لست صبوراً أبداً:
الوقت محدود!
أنا منيبينيس وأنت تحبني...

تدفع لتلفّني في حرير أمك،
لتربط لي ربطة عنق عيد الميلاد أو مقود الكلب.
أنا لك ما دام الوقت يمضي. هذا كل شيء...
لا أخجل منك ولا من نفسي. هل لديك هذا الحظ؟
اسمي منيبينيس، قلبي وحده للبيع.
يمكنك إضافة سيدي إن كان يريحك أو ببساطة مناداتي:
"سيدي الصغير"... "ضربة السيدة السمينة"، "يسوع" أو "الوحش الصغير"...
"جوني العميق"... كما تفضل.
أنا منهك من الإصغاء إليك، كما أنا منهك من الإصغاء لآخرين قبلك.
موهبتي هاهنا، عارية أمامك. هذا ما أعرف فعله، وأفعله بإتقان.
فاخرس، ادفع، وتعال نمارس الجنس.`,
    HE: `אני מסווה את תשוקותי
עשיתי את של אחרים שלי
התענוגות שלי נשארים אצלי
לעולם לא תדעו עליהם דבר...
אולי זה כדי לשלול אותם מעצמי?
אני הפיזיותרפיסט של החללים האינטימיים שלכם
זה של האינטימיות הבולטות שלכם.
אתם יכולים גם לשחק רופא,
לשחק אחות... לא רופא מרדים...
אני אף פעם לא יותר מדי סבלני:
הזמן מוגבל!
אני מאניפניס ואתה אוהב אותי...

אתה משלם כדי לעטוף אותי במשי של אמך,
לקשור לי עניבת חג מולד או רצועת כלב.
אני שלך כל זמן שהזמן עובר. זה הכל...
אין לי שום בושה ממך ולא מעצמי. יש לך את המזל הזה?
שמי מאניפניס, רק לבי עומד למכירה.
אתה יכול להוסיף אדוני אם זה משפר לך, או פשוט לקרוא לי:
"מילורד הקטן"... "פעימת הגברת השמנה", "ישו" או "החיה הקטנה"...
"ג'וני העמוק"... כפי שאתה מעדיף.
אני מותש מלהקשיב לך, כפי שאני מותש מלהקשיב לאחרים לפניך.
הכישרון שלי הוא כאן, חשוף לפניך. זה מה שאני יודע לעשות, ואני עושה זאת היטב.
אז תסתום את הפה, שלם ובוא נזיין.`,
    FA: `خواسته‌هایم را پنهان می‌کنم
خواسته‌های دیگران را از آن خود کرده‌ام
لذت‌هایم با من می‌مانند
هرگز چیزی از آنها نخواهید دانست...
شاید برای محروم کردن خودم از آنها؟
من فیزیوتراپیست گودی‌های صمیمی شما هستم
و برآمدگی‌های صمیمی شما.
می‌توانید نقش پزشک را بازی کنید،
نقش پرستار را... نه نقش بیهوش‌کننده را...
من هرگز خیلی صبور نیستم:
وقت محدود است!
من منی‌پنیسم و تو دوستم داری...

پول می‌دهی تا مرا در حریر مادرت بپیچی،
تا کراوات کریسمس یا قلادهٔ سگ به من ببندی.
تا زمانی که زمان می‌گذرد از آن توام. همین...
من از تو و از خودم شرم ندارم. آیا تو این بخت را داری؟
نامم منی‌پنیس است، تنها قلبم فروشی است.
می‌توانی آقا را اضافه کنی اگر حالت را بهتر می‌کند یا به سادگی صدایم کنی:
«ارباب کوچک من»... «ضربان بانوی فربه»، «عیسی» یا «هیولای کوچک»...
«جانی عمیق»... هرطور می‌پسندی.
از گوش دادن به تو فرسوده‌ام، همانطور که از گوش دادن به دیگران پیش از تو فرسوده‌ام.
استعداد من اینجاست، عریان در برابر تو. این کاری است که می‌دانم چگونه انجامش دهم، و خوب انجامش می‌دهم.
پس خفه شو، بپرداز و بیا گاییدن را شروع کنیم.`,
    KO: `나는 내 욕망을 위장한다
나는 다른 이들의 것을 내 것으로 삼았다
내 쾌락은 나와 함께 머문다
너희는 결코 그것을 알지 못하리...
어쩌면 그것은 나 자신에게서 그것을 박탈하기 위함인가?
나는 너희 내밀한 구석의 물리치료사이고
너희 돌출된 내밀함의 그것이다.
너희는 또한 의사 놀이를 할 수도,
간호사 놀이를 할 수도 있다... 마취과 의사는 안 된다...
나는 결코 그리 인내심이 많지 않다:
시간이 제한되어 있다!
나는 머니페니스이고 너는 나를 사랑한다...

너는 너의 어머니의 비단으로 나를 감싸기 위해 돈을 낸다,
크리스마스 넥타이나 개 목줄을 나에게 묶기 위해.
나는 시간이 흐르는 동안 너의 것이다. 그뿐이다...
나는 너에 대해서도 나 자신에 대해서도 부끄럽지 않다. 너에게도 그런 행운이 있는가?
내 이름은 머니페니스, 오직 내 마음만이 팔 것이다.
기분이 좋다면 "선생님"을 붙여도 좋고 그저 나를 이렇게 불러도 좋다:
"마이 리틀 로드"... "더 팻 레이디 비트", "지저스" 또는 "베이비 비스트"...
"딥 조니 딥"... 네가 원하는 대로.
나는 너의 말을 듣는 데 지쳤다, 너 이전의 다른 이들의 말을 들었던 만큼 지쳤다.
내 재능은 여기 있다, 네 앞에 벌거벗은 채로. 이것이 내가 할 줄 아는 것이고, 나는 그것을 잘한다.
그러니 닥치고, 지불하고, 와서 우리 떡쳐보자.`,
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
  
    RU: `Open Air

[Изображение без текста]`,
  
    PL: `Open Air

[Obraz sam — bez tekstu]`,
  
    NL: `Open Air

[Beeld alleen — zonder tekst]`,
  
    EL: `Open Air

[Εικόνα μόνη — χωρίς κείμενο]`,
  
    TR: `Open Air

[Görüntü tek başına — metin yok]`,
  
    UK: `Open Air

[Образ один — без тексту]`,
  
    LT: `Open Air

[Vaizdas vienas — be teksto]`,
    AR: `Open Air\n\n[صورة فقط — بدون نص]`,
    HE: `Open Air\n\n[תמונה בלבד — ללא טקסט]`,
    FA: `Open Air\n\n[فقط تصویر — بدون متن]`,
    KO: `Open Air\n\n[이미지만 — 텍스트 없음]`,
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
  
    RU: `Moneypenis,
у меня нет слов, поэтому я их позаимствую, такие же совершенные, какими они были написаны при других обстоятельствах. Они здесь, в конце этой статьи, в этом маленьком кусочке вырезанной бумаги, который я храню в кармане, который я теряю и нахожу годами. Он так хорошо сопровождает этот портрет тебя моей рукой, твоё дитя.

«Тогда останутся два или три облика, всегда одни и те же, и эти медленные звуки оплакивания глубокой ночью, и наш смех, что наполнял улыбкой остальной мир. Любое лицо моей памяти будет ускользать в этой летящей толпе, и оттуда вернётся одно или другое со своим стёртым уже именем, со своим прошлым счастьем, со своей старой нежностью на устах, и ясный голос пропоёт несколько слов от близкого языка. И пока этот тёплый шёпот раздаётся в наших сердцах, наша память будет проходить тенями по нашим словам, пока тишина не закроет их одно за другим...»

— Бертран Бельжемен, скончавшийся 12 декабря 2024 года`,
  
    PL: `Moneypenis,
nie mam słów, więc je pożyczę, równie doskonałe jak zostały napisane w innych okolicznościach. Są tam na końcu tego artykułu, ten mały kawałek wyciętego papieru który trzymam w kieszeni, który gubię i odnajduję od lat. Tak dobrze towarzyszy temu portretowi ciebie z mojej ręki, twojemu dziecku.

«Pozostaną wtedy dwa lub trzy oblicza, zawsze te same, i te powolne dźwięki opłakiwania głęboką nocą, i nasze śmiechy które wypełniały uśmiechem resztę świata. Każda twarz mojej pamięci umknie w tym lecącym tłumie, i stamtąd powróci jedna lub druga ze swoim już zatartym imieniem, ze swoim minionym szczęściem, ze swoją starą czułością na ustach, a jasny głos zaśpiewa kilka słów bliskiego języka. A gdy ten ciepły szept rozbrzmiewa w naszych sercach, nasza pamięć będzie przechodzić cieniami przez nasze słowa, aż cisza zamknie je jedne po drugim...»

— Bertrand Belgemine, zmarły 12 grudnia 2024`,
  
    NL: `Moneypenis,
ik heb de woorden niet, dus ik zal ze lenen, even perfect als ze geschreven werden in andere omstandigheden. Ze staan daar aan het einde van dit artikel, dit kleine stukje uitgeknipt papier dat ik in mijn zak bewaar, dat ik al jaren verlies en terugvind. Het past zo goed bij dit portret van jou uit mijn hand, jouw kind.

«Er zullen dan twee of drie gelaten overblijven, altijd dezelfde, en die trage geluiden van treurnis diep in de nacht, en ons gelach dat de rest van de wereld met een glimlach vulde. Elk gezicht van mijn geheugen zal wegglijden in deze vluchtende menigte, en daaruit zal de een of de ander terugkeren met zijn reeds vervaagde naam, met zijn vroegere geluk, met zijn oude tederheid op de lippen, en een heldere stem zal enkele woorden zingen van een nabije taal. En zolang deze warme fluistering in onze harten weerklinkt, zal ons geheugen schaduwen werpen op onze woorden, tot de stilte ze één voor één sluit...»

— Bertrand Belgemine, overleden op 12 december 2024`,
  
    EL: `Moneypenis,
δεν έχω τα λόγια οπότε θα τα δανειστώ, εξίσου τέλεια όπως γράφτηκαν σε άλλες περιστάσεις. Είναι εκεί στο τέλος αυτού του άρθρου, αυτό το μικρό κομμάτι κομμένο χαρτί που κρατάω στην τσέπη μου, που χάνω και ξαναβρίσκω εδώ και χρόνια. Συνοδεύει τόσο όμορφα αυτό το πορτρέτο σου από το χέρι μου, παιδί σου.

«Θα μείνουν τότε δύο ή τρεις όψεις, πάντα οι ίδιες, και αυτοί οι αργοί ήχοι θρήνου βαθιά τη νύχτα, και τα γέλια μας που γέμιζαν με χαμόγελο τον υπόλοιπο κόσμο. Κάθε πρόσωπο της μνήμης μου θα ξεγλιστρά μέσα σε αυτό το πλήθος που πετά, και απ' εκεί θα επιστρέφει το ένα ή το άλλο με το ήδη σβησμένο του όνομα, με την περασμένη του ευτυχία, με την παλιά του τρυφερότητα στα χείλη, και μια καθαρή φωνή θα ψάλλει λίγες λέξεις από μια κοντινή γλώσσα. Και όσο αυτός ο θερμός ψίθυρος ηχεί στις καρδιές μας, η μνήμη μας θα περνά με σκιές πάνω στα λόγια μας, ώσπου η σιωπή θα τα κλείνει το ένα μετά το άλλο...»

— Bertrand Belgemine, αποβιώσας στις 12 Δεκεμβρίου 2024`,
  
    TR: `Moneypenis,
kelimelerim yok bu yüzden onları ödünç alacağım, başka koşullarda yazıldıkları kadar kusursuz. Bu makalenin sonunda, yıllardır kaybedip yeniden bulduğum, cebimde sakladığım bu küçük kesilmiş kağıt parçasındalar. Senin elimden çıkan bu portrene, çocuğuna, ne kadar iyi eşlik ediyorlar.

«O zaman iki ya da üç görünüm kalacak, hep aynıları, ve gecenin derinliğinde o yavaş yas sesleri, ve dünyanın geri kalanını gülümsemeyle dolduran kahkahalarımız. Hafızamın her yüzü bu uçan kalabalıkta kayıp gidecek, ve oradan biri veya öbürü şimdiden silinmiş adıyla, geçmiş mutluluğuyla, dudaklarındaki eski şefkatiyle geri dönecek, ve berrak bir ses yakın bir dilden birkaç kelime söyleyecek. Ve bu sıcak fısıltı kalplerimizde çınladığı sürece, hafızamız kelimelerimiz üzerinden gölgelerle geçecek, sessizlik onları birer birer kapayana dek...»

— Bertrand Belgemine, 12 Aralık 2024'te vefat etti`,
  
    UK: `Moneypenis,
у мене немає слів, тому я їх позичу, такі ж досконалі, як вони були написані за інших обставин. Вони там у кінці цієї статті, цей маленький шматочок вирізаного паперу, який я тримаю в кишені, який я гублю і знаходжу роками. Він так добре супроводжує цей портрет тебе моєю рукою, твоє дитя.

«Тоді залишаться два чи три обличчя, завжди ті самі, і ці повільні звуки скорботи в глибокій ночі, і наш сміх, що наповнював посмішкою решту світу. Кожне обличчя моєї пам'яті вислизатиме в цьому летючому натовпі, і звідти повертатиметься одне чи інше зі своїм уже стертим ім'ям, зі своїм минулим щастям, зі своєю старою ніжністю на устах, і ясний голос проспіває кілька слів з близької мови. І поки цей теплий шепіт відлунюватиме в наших серцях, наша пам'ять проходитиме тінями по наших словах, поки тиша не закриє їх одне за одним...»

— Бертран Бельжемен, помер 12 грудня 2024 року`,
  
    LT: `Moneypenis,
neturiu žodžių, tad juos pasiskolinsiu, tokius pat tobulus, kaip buvo parašyti kitomis aplinkybėmis. Jie ten šio straipsnio pabaigoje, šis mažas išrtas popieriaus gabalėlis, kurį laikau kišenėje, kurį pamesiu ir randu jau metų metus. Jis taip gražiai lydi šį tavo portretą iš mano rankos, tavo vaiką.

«Liks tada du ar trys veidai, visada tie patys, ir tie lėti gedulo garsai gilios nakties metu, ir mūsų juokai, kurie pripildė šypsena likusio pasaulio. Kiekvienas mano atminties veidas išslys į šią skrendančią minią, ir iš ten grįš vienas ar kitas su jau ištrintu vardu, su praėjusia laime, su sena švelnumu lūpose, ir aiškus balsas sudainuos kelis žodžius iš artimos kalbos. Ir kol šis šiltas šnabždesys aidės mūsų širdyse, mūsų atmintis praeis šešėliais per mūsų žodžius, kol tyla juos vieną po kito uždarys...»

— Bertran Bežemenas, miręs 2024 m. gruodžio 12 d.`,
    AR: `منيبينيس،
لا أملك الكلمات فسأقترضها، كاملةً كما كُتبت في ظروف أخرى. ها هي في نهاية ذلك المقال، تلك القصاصة الصغيرة من الورق التي أحتفظ بها في جيبي، أضيعها وأجدها منذ سنوات. ترافق بشكل ممتاز هذا الوجه الجميل لك، الجميل لكن المرعب.
منيبي، حبيبي العزيز، لست أول من كان بإمكاني أن أستشهد له بهذه الرسالة، كان حقيقياً تماماً ذاك، بل كان كاملاً تماماً الأول... جزء من فضل تعرفنا أنا وأنت يعود إليه، بل بفضله وبخطئي أيضاً...
أضيف فقط: لن أحبك أقل بسبب ذلك، لكن لا تبدد موهبتك، لا تدر ظهرك للحظ: الحياة! لا تذهب لتدمر نفسك ومن يحبونك معك. ومن جهة القصة حيث أقف سأصرّ: لا تذهب لتتأرجح حزيناً في طرف حبل... العدم سيأتي بسرعة كافية.

الآخر الحزين لك ♥`,
    HE: `מאניפניס,
אין לי את המילים אז אשאל אותן, מושלמות כפי שנכתבו בנסיבות אחרות. הן שם בסוף הכתבה הזו, חתיכת הנייר הקטנה החתוכה שאני שומר בכיסי, שאני מאבד ומוצא שוב במשך השנים. היא מלווה כל כך יפה את הדיוקן הזה שלך, יפה אך מפחיד.
מאני-פ, אהובי היקר, אינך הראשון לו יכולתי לצטט מכתב זה, הוא היה אמיתי לחלוטין, לבסוף שלם לגמרי הראשון... זה מעט הודות לו שאתה ואני הכרנו, ובכן הודות לו ובאשמתי גם...
אוסיף רק: לא אאהב אותך פחות בגלל זה אך אל תבזבז את הכישרון שלך, אל תפנה גב למזל: לחיים! אל תלך לחבל בעצמך ובאלה שאוהבים אותך איתך. ומצד הסיפור בו אני ניצב אני אתעקש: אל תלך להתנדנד עצוב בקצה חבל... האין יגיע במהרה דיו.

ה-♥ העצוב האחר שלך`,
    FA: `منی‌پنیس،
کلمات را ندارم پس آن‌ها را به وام می‌گیرم، چنان کامل که در شرایط دیگری نوشته شدند. آن‌ها آنجا هستند در پایان آن مقاله، آن تکهٔ کاغذ کوچک بریده‌ای که در جیبم نگه می‌دارم، که سال‌هاست گم می‌کنم و دوباره می‌یابم. آن‌ها چه خوب با این چهرهٔ زیبا اما هراس‌انگیز تو همراه می‌شوند.
منی-پ، عشق عزیزم، تو نخستین کسی نیستی که می‌توانستم این نامه را برایش بخوانم، او واقعاً واقعی بود، در واقع نخستین کاملاً تمام و کمال... قدری به لطف اوست که تو و من یکدیگر را شناختیم، در واقع به لطف او و به خطای من نیز...
فقط اضافه می‌کنم: به این خاطر کمتر دوستت نخواهم داشت اما استعدادت را هدر نده، به بخت پشت نکن: به زندگی! نرو که خودت را و کسانی را که دوستت دارند با خود نابود کنی. و از سویی از داستان که من ایستاده‌ام اصرار می‌کنم: نرو که غمگین در انتهای طنابی تاب بخوری... نیستی به سرعت کافی فرا خواهد رسید.

دیگرِ غمگین تو ♥`,
    KO: `머니페니스,
나는 말이 없으니 빌리겠다, 다른 상황에서 쓰인 그대로 완벽한 말들을. 그것들은 그 기사의 끝에, 내가 주머니에 간직하고, 잃어버리고 또 찾기를 반복해온 그 작게 잘린 종이 조각에 있다. 그것들은 너의 이 초상에 너무도 잘 어울린다, 아름답지만 두려운.
머니-피, 나의 사랑하는 이여, 너는 내가 이 편지를 인용할 수 있었던 첫 사람은 아니다, 그는 매우 실재했고, 결국 매우 온전한 첫 사람이었으니... 그 덕분에 너와 내가 알게 된 면이 조금 있고, 그러니까 그 덕분에 그리고 또한 나의 잘못으로도...
나는 단지 덧붙이리: 그것 때문에 너를 덜 사랑하지는 않을 것이나 너의 재능을 낭비하지 말라, 행운에 등을 돌리지 말라: 삶에! 너 자신과 너를 사랑하는 이들을 함께 망치러 가지 말라. 그리고 내가 서 있는 이야기의 이쪽에서 나는 강조하리: 슬프게 밧줄 끝에 매달리러 가지 말라... 허무는 충분히 빨리 도래하리.

너의 슬픈 또 다른 ♥`,
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
  
    RU: `ВНИМАНИЕ! WARNING! ATENÇÃO! OJO! ACHTUNG!

Я MONEYPENIS, ИНОГДА Я РАНЮ, ИНОГДА Я КОЛЮ, Я MONEYPENIS, ВЫ МОЖЕТЕ МЕНЯ ПРИВЯЗАТЬ, НО ЭТО Я ВАС ДЕРЖУ!
НЕ ДУМАЙТЕ, ЧТО Я НЕ УМЕЮ ЛЮБИТЬ, Я ТОЛЬКО ЭТО И УМЕЮ ДЕЛАТЬ. НО ПРИНЯТЬ ТО, ЧТО ТЕБЯ ЛЮБЯТ — ЭТО СОВСЕМ ДРУГАЯ ИСТОРИЯ И НЕ САМАЯ ЛЁГКАЯ.
ВСЕ MONEYPENIS МИРА ДЛЯ ТЕБЯ ОДНОГО! Я КОНЦА ВРЕМЁН, ВОТ И ВСЁ.
Я ЭТА ОПУХОЛЬ В РУКЕ, КОТОРАЯ ОПУСКАЕТСЯ ДО ВАШЕГО НИЗА ЖИВОТА. ИНОГДА ОНА ИЗВЕРГАЕТ ОБРАЗЫ, КОТОРЫЕ ВЫ НЕ ВИДЕЛИ ПРИХОДЯЩИМИ.
Я ВАША ГЕРОИЧЕСКАЯ ИНКАРНАЦИЯ И ВАШЕ ПОВСЕДНЕВНОЕ ПАДЕНИЕ.`,
  
    PL: `UWAGA! WARNING! ATENÇÃO! OJO! ACHTUNG!

JESTEM MONEYPENIS, CZASEM RANIĘ, CZASEM KŁUJĘ, JESTEM MONEYPENIS, MOŻECIE MNIE PRZYWIĄZAĆ, ALE TO JA WAS TRZYMAM!
NIE MYŚLCIE, ŻE NIE POTRAFIĘ KOCHAĆ, TYLKO TO POTRAFIĘ ROBIĆ. ALE ZGODZIĆ SIĘ NA BYCIE KOCHANYM TO ZUPEŁNIE INNA HISTORIA I NIE NAJŁATWIEJSZA.
WSZYSTKIE MONEYPENIS ŚWIATA DLA CIEBIE SAMEGO! JESTEM KOŃCEM CZASÓW I TYLE.
JESTEM TYM NAROŚLEM W RĘCE, KTÓRY OPADA DO WASZEGO PODBRZUSZA. CZASAMI WYTRYSKUJE OBRAZY KTÓRYCH NIE WIDZIELIŚCIE NADCHODZĄCYCH.
JESTEM WASZYM HEROICZNYM WCIELENIEM I WASZYM CODZIENNYM UPADKIEM.`,
  
    NL: `LET OP! WARNING! ATENÇÃO! OJO! ACHTUNG!

IK BEN MONEYPENIS, SOMS VERWOND IK, SOMS PRIK IK, IK BEN MONEYPENIS, JE KUNT MIJ VASTBINDEN, MAAR IK BEN DEGENE DIE JOU VASTHOUDT!
DENK NIET DAT IK NIET KAN LIEFHEBBEN, IK KAN ALLEEN MAAR DAT DOEN. MAAR AANVAARDEN OM BEMIND TE WORDEN IS EEN HEEL ANDER VERHAAL EN NIET HET EENVOUDIGSTE.
ALLE MONEYPENIS VAN DE WERELD VOOR JOU ALLEEN! IK BEN HET EINDE DER TIJDEN, DAT IS ALLES.
IK BEN DIE UITWAS IN DE HAND DIE TOT AAN UW ONDERBUIK REIKT. SOMS SPUIT HIJ BEELDEN UIT DIE U NIET ZAG AANKOMEN.
IK BEN UW HEROÏSCHE INCARNATIE EN UW DAGELIJKSE VAL.`,
  
    EL: `ΠΡΟΣΟΧΗ! WARNING! ATENÇÃO! OJO! ACHTUNG!

ΕΙΜΑΙ Ο MONEYPENIS, ΜΕΡΙΚΕΣ ΦΟΡΕΣ ΠΛΗΓΩΝΩ, ΜΕΡΙΚΕΣ ΦΟΡΕΣ ΤΣΙΜΠΩ, ΕΙΜΑΙ Ο MONEYPENIS, ΜΠΟΡΕΙΤΕ ΝΑ ΜΕ ΔΕΣΕΤΕ, ΑΛΛΑ ΕΓΩ ΕΙΜΑΙ ΑΥΤΟΣ ΠΟΥ ΣΑΣ ΚΡΑΤΑΕΙ!
ΜΗΝ ΝΟΜΙΖΕΤΕ ΟΤΙ ΔΕΝ ΞΕΡΩ ΝΑ ΑΓΑΠΩ, ΞΕΡΩ ΝΑ ΚΑΝΩ ΜΟΝΟ ΑΥΤΟ. ΑΛΛΑ ΤΟ ΝΑ ΔΕΧΘΕΙΣ ΝΑ ΑΓΑΠΗΘΕΙΣ ΕΙΝΑΙ ΕΝΤΕΛΩΣ ΑΛΛΗ ΙΣΤΟΡΙΑ ΚΑΙ ΟΧΙ Η ΕΥΚΟΛΟΤΕΡΗ.
ΟΛΟΙ ΟΙ MONEYPENIS ΤΟΥ ΚΟΣΜΟΥ ΓΙΑ ΕΣΕΝΑ ΜΟΝΟ! ΕΙΜΑΙ ΤΟ ΤΕΛΟΣ ΤΩΝ ΧΡΟΝΩΝ ΟΡΙΣΤΕ.
ΕΙΜΑΙ ΑΥΤΗ Η ΕΞΟΓΚΩΣΗ ΣΤΟ ΧΕΡΙ ΠΟΥ ΚΑΤΕΒΑΙΝΕΙ ΜΕΧΡΙ ΤΟ ΧΑΜΗΛΟΚΟΙΛΙ ΣΑΣ. ΚΑΠΟΤΕ ΕΚΣΦΕΝΔΟΝΙΖΕΙ ΕΙΚΟΝΕΣ ΠΟΥ ΔΕΝ ΕΙΔΑΤΕ ΝΑ ΕΡΧΟΝΤΑΙ.
ΕΙΜΑΙ Η ΗΡΩΪΚΗ ΕΝΣΑΡΚΩΣΗ ΣΑΣ ΚΑΙ Η ΚΑΘΗΜΕΡΙΝΗ ΣΑΣ ΠΤΩΣΗ.`,
  
    TR: `DİKKAT! WARNING! ATENÇÃO! OJO! ACHTUNG!

BEN MONEYPENIS, BAZEN YARALIYORUM, BAZEN BATIYORUM, BEN MONEYPENIS, BENİ BAĞLAYABİLİRSİNİZ, AMA BEN SİZİ TUTUYORUM!
SEVMEYİ BİLMEDİĞİMİ SANMAYIN, SADECE BUNU YAPABİLİRİM. AMA SEVİLMEYİ KABUL ETMEK TAMAMEN BAŞKA BİR HİKAYE VE EN KOLAYI DEĞİL.
DÜNYANIN TÜM MONEYPENIS'LERİ SADECE SENİN İÇİN! BEN ZAMANLARIN SONUYUM HEPSİ BU.
BEN ELDEKİ O ÇIKINTIYIM Kİ KARNINIZIN ALTINA DEK İNER. BAZEN GELDİĞİNİ GÖRMEDİĞİNİZ GÖRÜNTÜLER FIRLATIR.
BEN SİZİN KAHRAMAN ENKARNASYONUNUZ VE GÜNDELİK DÜŞÜŞÜNÜZÜM.`,
  
    UK: `УВАГА! WARNING! ATENÇÃO! OJO! ACHTUNG!

Я MONEYPENIS, ІНОДІ Я РАНЮ, ІНОДІ Я КОЛЮ, Я MONEYPENIS, ВИ МОЖЕТЕ МЕНЕ ПРИВ'ЯЗАТИ, АЛЕ ЦЕ Я ВАС ТРИМАЮ!
НЕ ДУМАЙТЕ, ЩО Я НЕ ВМІЮ ЛЮБИТИ, Я ТІЛЬКИ ЦЕ І ВМІЮ РОБИТИ. АЛЕ ПРИЙНЯТИ ТЕ, ЩО ТЕБЕ ЛЮБЛЯТЬ — ЦЕ ЗОВСІМ ІНША ІСТОРІЯ І НЕ НАЙЛЕГША.
ВСІ MONEYPENIS СВІТУ ДЛЯ ТЕБЕ ОДНОГО! Я КІНЕЦЬ ЧАСІВ, ОСЬ І ВСЕ.
Я ЦЕ НАРОСТ У РУЦІ, ЩО ОПУСКАЄТЬСЯ ДО ВАШОГО НИЗУ ЖИВОТА. ІНОДІ ВІН ВИВЕРГАЄ ОБРАЗИ, ЯКИХ ВИ НЕ БАЧИЛИ, ЩО НАБЛИЖАЮТЬСЯ.
Я ВАША ГЕРОЇЧНА ІНКАРНАЦІЯ І ВАШЕ ПОВСЯКДЕННЕ ПАДІННЯ.`,
  
    LT: `DĖMESIO! WARNING! ATENÇÃO! OJO! ACHTUNG!

AŠ ESU MONEYPENIS, KARTAIS ŽEIDŽIU, KARTAIS DURIU, AŠ ESU MONEYPENIS, GALITE MANE PRIRIŠTI, BET TAI AŠ JUS LAIKAU!
NEMANYKITE, KAD NEMOKU MYLĖTI, AŠ TIK TAI IR MOKU DARYTI. BET SUTIKTI BŪTI MYLIMU TAI VISAI KITA ISTORIJA IR NE PATI LENGVIAUSIA.
VISI PASAULIO MONEYPENIS TAU VIENAM! AŠ ESU LAIKŲ PABAIGA, TAI VISKAS.
AŠ ESU TAS ATAUGOS RANKOJE, KURIS NUSILEIDŽIA IKI JŪSŲ APATINĖS PILVO DALIES. KARTAIS JIS IŠSPJAUNA VAIZDUS, KURIŲ NEMATĖTE ATEINANČIŲ.
AŠ ESU JŪSŲ HEROIŠKA INKARNACIJA IR JŪSŲ KASDIENINIS NUOPUOLIS.`,
    AR: `انتباه! تحذير! تنبيه! احذر! تنبه!

أنا منيبينيس، أحياناً أجرح، أحياناً ألسع، أنا منيبينيس، يمكنكم تكبيلي، لكنني من يمسك بكم!
لا تظنوا أنني لا أعرف أن أحب، لا أعرف أن أفعل سوى ذلك. لكن قبول أن يكون المرء محبوباً قصة أخرى تماماً.
لا أحد يعرف إلى ماذا أصبو، لكن من يعرف حقاً؟ من السهل جداً الاعتقاد أن الأمر مجرد مال، لكنني لا ألومكم... ليس من السهل كسبه!

تحذير!

أنا منيبينيس، وأنت تحبني... أنت أيضاً تحبني`,
    HE: `תשומת לב! אזהרה! אטנסאו! אוחו! אכטונג!

אני מאניפניס, לפעמים אני פוצע, לפעמים אני עוקץ, אני מאניפניס, אתם יכולים לקשור אותי, אבל אני זה שמחזיק אתכם!
אל תחשבו שאינני יודע לאהוב, זה כל מה שאני יודע לעשות. אבל לקבל להיות אהוב זה סיפור אחר לגמרי.
איש אינו יודע למה אני שואף, אבל מי באמת יודע? קל מדי לחשוב שזה רק הכסף, אבל אינני כועס עליכם... זה לא קל להרוויח אותו!

אזהרה!

אני מאניפניס, ואתה אוהב אותי... גם אתה אוהב אותי`,
    FA: `توجه! هشدار! آتنسائو! اوخو! آختونگ!

من منی‌پنیسم، گاهی زخم می‌زنم، گاهی نیش می‌زنم، من منی‌پنیسم، می‌توانید مرا ببندید، اما این من هستم که شما را در دست دارم!
گمان نکنید که نمی‌دانم چگونه عاشق باشم، تنها این را می‌دانم. اما پذیرفتن اینکه دوست‌داشته شوی داستان دیگری است.
کسی نمی‌داند به چه چیزی اشتیاق دارم، اما چه کسی واقعاً می‌داند؟ خیلی آسان است که فکر کنیم فقط پول است، اما از شما دلگیر نیستم... به دست آوردنش آسان نیست!

هشدار!

من منی‌پنیسم، و تو دوستم داری... تو هم دوستم داری`,
    KO: `주의! 경고! 아텐상오! 오호! 아흐퉁!

나는 머니페니스, 때로 상처 주고, 때로 찌른다, 나는 머니페니스, 너희가 나를 묶을 수 있지만, 너희를 붙들고 있는 건 나다!
내가 사랑할 줄 모른다고 생각하지 말라, 내가 할 줄 아는 건 그것뿐이다. 그러나 사랑받기를 받아들이는 것은 완전히 다른 이야기다.
내가 무엇을 갈망하는지 아무도 모른다, 그러나 누가 정말로 아는가? 단지 돈이라 여기는 건 너무 쉽다, 그러나 너희를 원망하지 않는다... 그것은 벌기 쉬운 게 아니다!

경고!

나는 머니페니스, 그리고 너는 나를 사랑한다... 너 또한 나를 사랑한다`,
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
  
    RU: `Moneypenis, любовь моя, я охотно покрою тебя тем малым золотом, что у меня есть. Скоро ты больше не будешь писать, наконец придёт день, когда я больше не смогу тебя читать.
Moneypenis, приближается день твоего исчезновения в моей вновь обретённой разумности.
Moneypenis, испарившийся в моей грустной восстановленной морали.
Проклятый день, когда моя любовь к тебе исчерпает себя в моих воспоминаниях. Я не хочу, я не хочу, я не хочу. И всё же ничего нельзя сделать. Уже ничего нельзя сделать.

И тогда у меня не останется тебя, чтобы тебя любить, чтобы тебя желать, чтобы тебя проклинать, чтобы тебя благословлять, чтобы тебя писать.

Я буду только этой опустевшей рукой, которая нацарапает другую правду:

«Я однажды его очень любил
но что я потерял в любви
я выиграл в свободе
он был знаком ветра,
сладким и яростным,
смешанным с любовью и борьбой
я долго оплакивал
этот ветер прошёл
никогда жизнь не была мне настолько одолжена,
никогда у меня не было столько крыльев
никогда я не был так свободен.»`,
  
    PL: `Moneypenis, miłości moja, chętnie pokryję cię tym niewielkim złotem które mam. Wkrótce nie będziesz już pisać, a w końcu nadejdzie dzień, w którym nie będę już potrafił cię czytać.
Moneypenis, zbliża się dzień twego zniknięcia w mojej odzyskanej rozsądności.
Moneypenis ulotniony w mojej smutnej przywróconej moralności.
Przeklęty dzień, w którym moja miłość do ciebie wyczerpie się w moich wspomnieniach. Nie chcę, nie chcę, nie chcę. A jednak nic nie można zrobić. Nic już nie można zrobić.

I wtedy nie pozostanie mi już ciebie by cię kochać, by cię pragnąć, by cię przeklinać, by cię błogosławić, by cię pisać.

Będę tylko tą opustoszałą ręką, która nakreśli inną prawdę:

«Kochałem go bardzo pewnego razu
ale to co straciłem w miłości
zyskałem w wolności
był znakiem wiatru,
słodkim i gwałtownym,
mieszanką miłości i walki
długo opłakiwałem
ten wiatr minął
nigdy życie nie było mi tak użyczone,
nigdy nie miałem tylu skrzydeł
nigdy nie byłem tak wolny.»`,
  
    NL: `Moneypenis, mijn liefde, ik zal je gaarne bedekken met het beetje goud dat ik heb. Weldra zul je niet meer schrijven, eindelijk zal er een dag komen dat ik je niet meer kan lezen.
Moneypenis, de dag nadert van jouw verdwijning in mijn teruggevonden redelijkheid.
Moneypenis verdampt in mijn droevige herstelde moraal.
De vervloekte dag waarop mijn liefde voor jou zich zal uitputten in mijn herinneringen. Ik wil het niet, ik wil het niet, ik wil het niet. En toch is er niets aan te doen. Er is al niets meer aan te doen.

En dan zal ik jou niet meer hebben om van je te houden, om je te begeren, om je te vervloeken, om je te zegenen, om je te schrijven.

Ik zal slechts deze ontvolkte hand zijn, die een andere waarheid zal krabbelen:

«Ik heb hem eens zeer liefgehad
maar wat ik in liefde verloor
won ik in vrijheid
hij was een teken van de wind,
zacht en heftig,
mengeling van liefde en strijd
lang heb ik geweend
deze wind is voorbij
nooit was het leven mij zo geleend,
nooit had ik zoveel vleugels
nooit was ik zo vrij.»`,
  
    EL: `Moneypenis, αγάπη μου, με ευχαρίστηση θα σε καλύψω με το λίγο χρυσάφι που έχω. Σύντομα δεν θα γράφεις πλέον, επιτέλους θα έρθει μια μέρα και δεν θα μπορώ πλέον να σε διαβάσω.
Moneypenis, πλησιάζει η μέρα της εξαφάνισής σου μέσα στην ξαναβρεθείσα λογική μου.
Moneypenis εξατμισμένος μέσα στην θλιβερή μου αποκατεστημένη ηθική.
Η καταραμένη μέρα όπου η αγάπη μου για εσένα θα εξαντληθεί στις αναμνήσεις μου. Δεν θέλω, δεν θέλω, δεν θέλω. Κι όμως δεν γίνεται τίποτα. Δεν γίνεται πλέον τίποτα.

Και τότε δεν θα μου μένεις εσύ για να σε αγαπώ, για να σε επιθυμώ, για να σε καταριέμαι, για να σε ευλογώ, για να σε γράφω.

Θα είμαι μόνο αυτό το ερημωμένο χέρι, που θα χαράξει μια άλλη αλήθεια:

«Τον αγάπησα πολύ μια φορά
αλλά αυτό που έχασα στην αγάπη
κέρδισα στην ελευθερία
ήταν ένα σημάδι του ανέμου,
γλυκό και σφοδρό,
ανάμεικτο με αγάπη και αγώνα
έκλαψα για πολύ καιρό
αυτός ο άνεμος πέρασε
ποτέ δεν μου δάνεισαν τόσο πολύ τη ζωή,
ποτέ δεν είχα τόσα φτερά
ποτέ δεν ήμουν τόσο ελεύθερος.»`,
  
    TR: `Moneypenis, aşkım, sahip olduğum az altınla seni seve seve örteceğim. Yakında artık yazmayacaksın, sonunda bir gün gelecek ve seni artık okuyamayacağım.
Moneypenis, kavuşulmuş mantığımda kayboluş günün yaklaşıyor.
Moneypenis hüzünlü onarılmış ahlakımda buharlaşmış.
Sana olan aşkımın anılarımda tükeneceği lanetli gün. İstemiyorum, istemiyorum, istemiyorum. Yine de yapacak bir şey yok. Artık yapacak bir şey kalmadı.

Ve o zaman seni sevmek için, seni arzulamak için, sana lanet etmek için, seni kutsamak için, sana yazmak için sana sahip olmayacağım.

Sadece başka bir hakikati karalayacak olan o boşalmış el olacağım:

«Bir zamanlar onu çok sevdim
ama aşkta kaybettiklerimi
özgürlükte kazandım
o rüzgarın bir işaretiydi,
tatlı ve şiddetli,
aşk ve mücadele karışımı
uzun süre ağladım
o rüzgar geçti
hayat bana hiç bu kadar ödünç verilmemişti,
hiç bu kadar kanadım olmamıştı
hiç bu kadar özgür olmamıştım.»`,
  
    UK: `Moneypenis, любове моя, я охоче покрию тебе тим малим золотом, що маю. Скоро ти більше не писатимеш, нарешті прийде день, і я більше не зможу тебе читати.
Moneypenis, наближається день твого зникнення в моїй знову знайденій розсудливості.
Moneypenis, випарований у моїй сумній відновленій моралі.
Проклятий день, коли моя любов до тебе вичерпає себе в моїх спогадах. Я не хочу, я не хочу, я не хочу. І все ж нічого не можна зробити. Вже нічого не можна зробити.

І тоді у мене не залишиться тебе, щоб тебе любити, щоб тебе бажати, щоб тебе проклинати, щоб тебе благословляти, щоб тебе писати.

Я буду лише цією спустошеною рукою, що накреслить іншу правду:

«Я колись його дуже любив,
але те, що я втратив у любові,
я виграв у свободі,
він був знаком вітру,
солодким і шаленим,
сумішшю любові й боротьби,
я довго оплакував,
цей вітер пройшов,
ніколи життя не було мені так позичене,
ніколи у мене не було стільки крил,
ніколи я не був таким вільним.»`,
  
    LT: `Moneypenis, mano meile, su malonumu apgaubsiu tave mažu auksu, kurį turiu. Greitai tu nebebrašysi, pagaliau ateis diena, ir aš nebegalėsiu tavęs skaityti.
Moneypenis, artėja tavo išnykimo diena mano sugrąžintame protingume.
Moneypenis išgaravęs mano liūdname atstatyto moralume.
Prakeikta diena, kai mano meilė tau išseks mano atsiminimuose. Nenoriu, nenoriu, nenoriu. Ir vis dėlto nieko negalima padaryti. Jau nieko negalima padaryti.

Ir tada man neliks tavęs, kad tave mylėčiau, kad tavęs geisčiau, kad tave prakeikčiau, kad tave laiminčiau, kad tave rašyčiau.

Aš būsiu tik ši ištuštėjusi ranka, kuri brūkštels kitą tiesą:

«Aš kartą jį labai mylėjau,
bet ką pralaimėjau meilėje,
laimėjau laisvėje,
jis buvo vėjo ženklas,
saldus ir įniršęs,
meilės ir kovos mišinys,
ilgai jį apverkiau,
šis vėjas praėjo,
niekada gyvenimas nebuvo man taip paskolintas,
niekada neturėjau tiek sparnų,
niekada nebuvau toks laisvas.»`,
    AR: `منيبينيس، حبي، سأغطيك عن طيب خاطر بالقليل من الذهب الذي أملك. قريباً لن تكتب بعد، أخيراً سيأتي يوم ولن أعود قادراً على قراءتك.
منيبينيس، يقترب يوم اختفائك في عقلي المستعاد.
منيبينيس متبخراً في أخلاقي المستعادة الحزينة.
اليوم اللعين الذي فيه سيغرق حبي القوي الصادق في خجلي من دفع ثمن حبك الذي لا أستحقه، عندما يصبح الخجل من نفسي أقوى مشاعري.
هل أحببتني منيبينيس؟ هل كنت ثرياً كفاية لأطعم روحك وأرضي قلبك؟
أعرف حزنك، أعرف وحدتك.
أعرف الشهية وأعرف الاشمئزاز، النشوة والخضوع.
منيبينيس، حروفك تختفي واحدة تلو الأخرى، حاملةً كلماتك... ما زلت أتذكرها.
منيبينيس، تذكر بدورك أنني حين أحب فإلى الأبد، لكن يحتاج الأمر إلى اثنين للتحاب إلى الأبد. منيبينيس... لا تدين لي بشيء.

♥ك إلى الأبد.`,
    HE: `מאניפניס, אהובי, אכסה אותך ברצון במעט הזהב שיש לי. בקרוב לא תכתוב יותר, סוף סוף יום יבוא ולא אוכל יותר לקרוא אותך.
מאניפניס, היום מתקרב להיעלמותך בתבונה שלי המשוחזרת.
מאניפניס מתאדה במוסר העצוב שלי המשוקם.
היום הארור בו אהבתי החזקה והכנה כל כך תטבע בבושתי לשלם עבור אהבתך שאיני ראוי לה, כשבושה מעצמי תהיה לרגש החזק שלי.
האם אהבת אותי מאניפניס? האם הייתי עשיר דיו להאכיל את נשמתך ולספק את לבך?
אני יודע את עצבותך, אני יודע את בדידותך.
אני יודע את התיאבון ואני יודע את הגועל, את האקסטזה ואת ההכנעה.
מאניפניס, אותיותיך נעלמות אחת אחר השנייה, נושאות איתן את מילותיך... אני עוד זוכר אותן.
מאניפניס, בתורך זכור שכשאני אוהב זה לתמיד, אבל צריך שניים כדי לאהוב לעולמים. מאניפניס... אינך חייב לי דבר.

ה-♥ שלך לנצח.`,
    FA: `منی‌پنیس، عشق من، با اشتیاق تو را با اندک طلایی که دارم خواهم پوشاند. به‌زودی دیگر نخواهی نوشت، سرانجام روزی فرا خواهد رسید و دیگر نخواهم توانست تو را بخوانم.
منی‌پنیس، روز ناپدید شدنت در عقل بازیافته‌ام نزدیک می‌شود.
منی‌پنیس بخار شده در اخلاق غمگین بازسازی‌شده‌ام.
آن روز نفرین‌شده که در آن عشق نیرومند و صادقانه‌ام در شرم پرداختن بهای عشقت که شایسته‌اش نیستم غرق خواهد شد، زمانی که شرم از خویشتنم نیرومندترین احساسم خواهد شد.
آیا دوستم داشتی منی‌پنیس؟ آیا آنقدر ثروتمند بودم که روحت را سیر کنم و دلت را خرسند سازم؟
غم تو را می‌شناسم، تنهایی‌ات را می‌شناسم.
اشتها را می‌شناسم و انزجار را می‌شناسم، خلسه و فرمانبری را.
منی‌پنیس، حروفت یکی یکی محو می‌شوند، کلماتت را با خود می‌برند... هنوز به یادشان دارم.
منی‌پنیس، تو نیز به یاد داشته باش که وقتی من عاشق می‌شوم، برای همیشه است، اما برای دوست داشتن جاودانه دو تن لازم است. منی‌پنیس... هیچ به من بدهکار نیستی.

♥ تو تا ابد.`,
    KO: `머니페니스, 내 사랑, 나는 기꺼이 내가 가진 작은 금으로 너를 덮으리라. 곧 너는 더 이상 쓰지 않으리, 마침내 어느 날이 오면 나는 더 이상 너를 읽을 수 없게 되리라.
머니페니스, 회복된 내 이성 속으로의 너의 사라짐의 날이 다가온다.
머니페니스 슬프게 회복된 내 도덕 속에서 증발한다.
저주받은 그 날, 내가 받을 자격 없는 너의 사랑을 위해 지불하는 내 부끄러움 속에 나의 그토록 강하고 진실한 사랑이 잠기리라, 나 자신에 대한 부끄러움이 내 가장 강한 감정이 될 때.
나를 사랑했는가 머니페니스? 나는 너의 영혼을 먹이고 너의 마음을 만족시킬 만큼 풍요로웠는가?
나는 너의 슬픔을 안다, 나는 너의 고독을 안다.
나는 식욕을 알고 혐오를 안다, 황홀과 순종을.
머니페니스, 너의 글자들이 하나씩 사라진다, 너의 말들을 가져가며... 나는 여전히 그것들을 기억한다.
머니페니스, 너의 차례에 기억하라, 내가 사랑할 때는 영원히 사랑한다는 것을, 그러나 영원히 서로 사랑하려면 둘이 필요하다는 것을. 머니페니스... 너는 내게 아무것도 빚지지 않았다.

너의 영원한 ♥.`,
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
  
    RU: `Я MONEYPENIS
Я ОРУДИЕ БЕЗ СЛАВЫ...
КОЛОНКИ ИГРАЮТ НА ПОЛНУЮ "THE FIRST CUT IS THE DEEPEST"
Я ПРОСТО ОРУДИЕ ЧЕЛОВЕКА ЗА РАБОТОЙ.
СЕКС-РАБОТНИКА, ЭСКОРТА, ЖИГОЛО ИЛИ...
Я КАК ОН, БЕЗ СТЫДА, НО НЕ БЕЗ СОВЕСТИ.
Я ВЫНОСЛИВ В ТРУДЕ, Я ЕГО АРГУМЕНТ И УДАР.
ЕГО НЕИЗМЕННОЕ СЛОВО.
ИНОГДА ТАКЖЕ ЕГО МЕСТЬ.
ЕГО ОДИНОЧЕСТВО ЦЕРКОВНОЙ МЫШИ В ЭТОЙ САМОЙ СТАРОЙ ЦЕРКВИ В МИРЕ.
ЭТОТ КОНТРАКТ ДЛЯ КОТОРОГО НЕТ НИКАКОГО ПРОФСОЮЗА
НА УЖЕ ВЕКОВОМ ЭКОНОМИЧЕСКОМ КЛИЕНТЕЛИЗМЕ.

Я ОПУСТОШЁННЫЙ И НИКОГДА НЕ ПОЛНОСТЬЮ ВОЗНАГРАЖДЁННЫЙ, ИСЧЕРПАННЫЙ.
ОН ВСЁ ЖЕ ЗАСЛУЖИВАЕТ ИСКУПЛЕНИЯ И БОЛЬШЕГО, ЧЕМ ПРОЩЕНИЕ
ОБЩЕСТВА, КОТОРОЕ ЕГО ПИТАЕТ, БОЛЬШЕ, ЧЕМ ОНО ПРИЗНАЁТ.`,
  
    PL: `JESTEM MONEYPENIS
JESTEM NARZĘDZIEM BEZ CHWAŁY...
GŁOŚNIKI GRAJĄ NA CAŁY REGULATOR "THE FIRST CUT IS THE DEEPEST"
JESTEM TYLKO NARZĘDZIEM CZŁOWIEKA PRZY PRACY.
PRACOWNIKA SEKSUALNEGO, ESKORTY, ŻIGOLAKA LUB...
JESTEM JAK ON, BEZ WSTYDU ALE NIE BEZ SUMIENIA.
JESTEM WYTRWAŁY W PRACY, JESTEM JEGO ARGUMENTEM I CIOSEM.
JEGO NIEZMIENNYM SŁOWEM.
CZASEM TAKŻE JEGO ZEMSTĄ.
JEGO SAMOTNOŚCIĄ MYSZY KOŚCIELNEJ W TYM NAJSTARSZYM KOŚCIELE NA ŚWIECIE.
TYM KONTRAKTEM DLA KTÓREGO NIE MA ŻADNEGO ZWIĄZKU ZAWODOWEGO
W JUŻ WIEKOWYM EKONOMICZNYM KLIENTELIZMIE.

JESTEM OPRÓŻNIONY I NIGDY W PEŁNI WYNAGRODZONY, WYCZERPANY.
ON ZASŁUGUJE JEDNAK NA ODKUPIENIE I NA WIĘCEJ NIŻ PRZEBACZENIE
ZE STRONY SPOŁECZEŃSTWA KTÓRE GO ŻYWI BARDZIEJ NIŻ TO PRZYZNAJE.`,
  
    NL: `IK BEN MONEYPENIS
IK BEN HET WERKTUIG ZONDER GLORIE...
DE SPEAKERS SPELEN OP VOLLE KRACHT "THE FIRST CUT IS THE DEEPEST"
IK BEN SLECHTS HET WERKTUIG VAN EEN MAN AAN HET WERK.
EEN SEKSWERKER, EEN ESCORT, EEN GIGOLO OF...
IK BEN ALS HIJ, ZONDER SCHAAMTE MAAR NIET ZONDER GEWETEN.
IK BEN VOLHARDEND IN DE TAAK, IK BEN ZIJN ARGUMENT EN ZIJN SLAG.
ZIJN ONVERANDERLIJKE WOORD.
SOMS OOK ZIJN WRAAK.
ZIJN EENZAAMHEID VAN KERKMUIS IN DEZE OUDSTE KERK TER WERELD.
DAT CONTRACT WAARVOOR ER GEEN ENKELE VAKBOND BESTAAT
OP EEN AL EEUWENOUD ECONOMISCH KLANTENBINDINGSYSTEEM.

IK BEN UITGEPUT EN NOOIT GEHEEL BELOOND, OPGEBRUIKT.
HIJ VERDIENT NOCHTANS VERLOSSING EN MEER DAN VERGEVING
VAN EEN MAATSCHAPPIJ DIE HEM VOEDT MEER DAN ZE ERKENT.`,
  
    EL: `ΕΙΜΑΙ Ο MONEYPENIS
ΕΙΜΑΙ ΤΟ ΕΡΓΑΛΕΙΟ ΧΩΡΙΣ ΔΟΞΑ...
ΤΑ ΗΧΕΙΑ ΠΑΙΖΟΥΝ ΣΤΟ ΤΕΡΜΑ "THE FIRST CUT IS THE DEEPEST"
ΕΙΜΑΙ ΜΟΝΟ ΤΟ ΕΡΓΑΛΕΙΟ ΕΝΟΣ ΑΝΘΡΩΠΟΥ ΣΤΗ ΔΟΥΛΕΙΑ.
ΕΝΟΣ ΕΡΓΑΖΟΜΕΝΟΥ ΤΟΥ ΣΕΞ, ΕΝΟΣ ΕΣΚΟΡΤ, ΕΝΟΣ ΖΙΓΚΟΛΟ Ή...
ΕΙΜΑΙ ΣΑΝ ΑΥΤΟΝ, ΧΩΡΙΣ ΝΤΡΟΠΗ ΑΛΛΑ ΟΧΙ ΧΩΡΙΣ ΣΥΝΕΙΔΗΣΗ.
ΕΙΜΑΙ ΣΚΛΗΡΟΣ ΣΤΟ ΕΡΓΟ, ΕΙΜΑΙ ΤΟ ΕΠΙΧΕΙΡΗΜΑ ΤΟΥ ΚΑΙ ΤΟ ΧΤΥΠΗΜΑ ΤΟΥ.
Ο ΑΜΕΤΑΒΛΗΤΟΣ ΤΟΥ ΛΟΓΟΣ.
ΠΟΤΕ-ΠΟΤΕ ΕΠΙΣΗΣ Η ΕΚΔΙΚΗΣΗ ΤΟΥ.
Η ΜΟΝΑΞΙΑ ΤΟΥ ΤΟΥ ΠΟΝΤΙΚΟΥ ΤΗΣ ΕΚΚΛΗΣΙΑΣ ΣΕ ΑΥΤΗΝ ΤΗΝ ΠΙΟ ΠΑΛΙΑ ΕΚΚΛΗΣΙΑ ΣΤΟΝ ΚΟΣΜΟ.
ΑΥΤΟ ΤΟ ΣΥΜΒΟΛΑΙΟ ΓΙΑ ΤΟ ΟΠΟΙΟ ΔΕΝ ΥΠΑΡΧΕΙ ΚΑΝΕΝΑ ΣΩΜΑΤΕΙΟ
ΣΕ ΕΝΑΝ ΗΔΗ ΑΙΩΝΟΒΙΟ ΟΙΚΟΝΟΜΙΚΟ ΠΕΛΑΤΕΙΑΣΜΟ.

ΕΙΜΑΙ ΑΔΕΙΑΣΜΕΝΟΣ ΚΑΙ ΠΟΤΕ ΠΛΗΡΩΣ ΑΝΤΑΜΕΙΨΕΝΟΣ, ΕΞΟΥΘΕΝΩΜΕΝΟΣ.
ΑΞΙΖΕΙ ΕΝΤΟΥΤΟΙΣ ΛΥΤΡΩΣΗ ΚΑΙ ΠΕΡΙΣΣΟΤΕΡΟ ΑΠΟ ΣΥΓΧΩΡΕΣΗ
ΑΠΟ ΜΙΑ ΚΟΙΝΩΝΙΑ ΠΟΥ ΤΟΝ ΤΡΕΦΕΙ ΠΕΡΙΣΣΟΤΕΡΟ ΑΠ' ΟΣΟ ΠΑΡΑΔΕΧΕΤΑΙ.`,
  
    TR: `BEN MONEYPENIS
BEN ŞANSIZ ARAÇIM...
HOPARLÖRLER SONUNA KADAR "THE FIRST CUT IS THE DEEPEST" ÇALIYOR
BEN YALNIZCA İŞBAŞINDAKİ BİR ADAMIN ARACIYIM.
BİR SEKS İŞÇİSİ, BİR ESKORT, BİR JİGOLO YA DA...
BEN ONUN GİBİYİM, UTANMASIZ AMA VİCDANSIZ DEĞİL.
GÖREVDE SERTİM, ONUN ARGÜMANI VE DARBESİYİM.
ONUN DEĞİŞMEZ SÖZÜ.
BAZEN AYNI ZAMANDA ONUN İNTİKAMI.
DÜNYANIN BU EN ESKİ KİLİSESİNDE KİLİSE FARESİNİN YALNIZLIĞI.
HİÇBİR SENDİKANIN VAR OLMADIĞI O SÖZLEŞME
YÜZYILLIK BİR EKONOMİK MÜŞTERİCİLİĞİN ÜZERİNDE.

BOŞALMIŞIM VE HİÇBİR ZAMAN TAMAMEN ÖDÜLLENDİRİLMEMİŞİM, TÜKETİLMİŞİM.
YİNE DE KURTULUŞU VE ONU KABUL ETTİĞİNDEN DAHA ÇOK BESLEYEN
BİR TOPLUMDAN BAĞIŞLANMADAN FAZLASINI HAK EDİYOR.`,
  
    UK: `Я MONEYPENIS
Я ЗНАРЯДДЯ БЕЗ СЛАВИ...
КОЛОНКИ ГРАЮТЬ НА ПОВНУ "THE FIRST CUT IS THE DEEPEST"
Я ПРОСТО ЗНАРЯДДЯ ЛЮДИНИ ЗА РОБОТОЮ.
СЕКС-ПРАЦІВНИКА, ЕСКОРТА, ЖИГОЛО АБО...
Я ЯК ВІН, БЕЗ СОРОМУ, АЛЕ НЕ БЕЗ СУМЛІННЯ.
Я ВИТРИВАЛИЙ У ПРАЦІ, Я ЙОГО АРГУМЕНТ І УДАР.
ЙОГО НЕЗМІННЕ СЛОВО.
ІНОДІ ТАКОЖ ЙОГО ПОМСТА.
ЙОГО САМОТНІСТЬ ЦЕРКОВНОЇ МИШІ В ЦІЙ НАЙСТАРІШІЙ ЦЕРКВІ У СВІТІ.
ЦЕЙ КОНТРАКТ, ДЛЯ ЯКОГО НЕМАЄ ЖОДНОЇ ПРОФСПІЛКИ
НА ВЖЕ ВІКОВОМУ ЕКОНОМІЧНОМУ КЛІЄНТЕЛІЗМІ.

Я СПУСТОШЕНИЙ І НІКОЛИ ПОВНІСТЮ ВИНАГОРОДЖЕНИЙ, ВИЧЕРПАНИЙ.
ВІН ВСЕ Ж ЗАСЛУГОВУЄ НА ВИКУПЛЕННЯ І БІЛЬШЕ, НІЖ ПРОЩЕННЯ
ВІД СУСПІЛЬСТВА, ЩО ЙОГО ЖИВИТЬ, БІЛЬШЕ, НІЖ ВОНО ВИЗНАЄ.`,
  
    LT: `AŠ ESU MONEYPENIS
AŠ ESU ĮRANKIS BE ŠLOVĖS...
KOLONĖLĖS GROJA VISU GARSU "THE FIRST CUT IS THE DEEPEST"
AŠ ESU TIK DARBO ŽMOGAUS ĮRANKIS.
SEKSO DARBUOTOJO, ESKORTO, ŽIGOLO ARBA...
AŠ KAIP JIS, BE GĖDOS, BET NE BE SĄŽINĖS.
AŠ STIPRUS DARBE, AŠ JO ARGUMENTAS IR JO SMŪGIS.
JO NEKINTANTIS ŽODIS.
KARTAIS TAIP PAT JO KERŠTAS.
JO BAŽNYTINĖS PELĖS VIENATVĖ ŠIOJE SENIAUSIOJE PASAULIO BAŽNYČIOJE.
ŠIS SUTARTIS, KURIAI NĖRA JOKIOS PROFESINĖS SĄJUNGOS
JAU AMŽIŲ SENUMO EKONOMINIO KLIENTELIZMO.

AŠ IŠTUŠTĖJĘS IR NIEKADA VISIŠKAI ATLYGINTAS, IŠSEKĘS.
JIS VIS DĖLTO NUSIPELNO ATPIRKIMO IR DAUGIAU NEI ATLEIDIMO
IŠ VISUOMENĖS, KURI JĮ MAITINA DAUGIAU, NEI PRIPAŽĮSTA.`,
    AR: `أنا منيبينيس
أنا الأداة بلا مجد...
مكبرات الصوت تصدح بـ"الجرح الأول هو الأعمق"
أنا فقط أداة رجل في العمل.
عامل جنس، مرافق، جيغولو أو...
أنا مثله، بلا خجل لكن لست بلا ضمير.
أنا صلب في العمل، أنا لطيف وهش...
أنا في كل الأحوال أقل عاهرة من زبائني...
أنا منيبينيس، لي فخر وضع شرفي أعلى بكثير من المؤخرة، حيث يتخيل آخرون شرفهم، وشرف وضع فخري بنفس الارتفاع.
فكروا بي ما شئتم، لكن باعتدال. أعطوني الاحترام نفسه الذي أهبه كل يوم.
عرفت الأسوأ واحتفظت بالأفضل.
المرء لا يختار موهبته، عليه أن يعتني بها...
أنا منيبينيس، أعرف كيف أُحَب وهذا يريح قلبي، الذي هو الشيء الوحيد للبيع.
أنا مثل سيدي، في العمق نحن واحد... الرقة تجعلنا أحياناً نبكي. شحذوا سكاكينكم!`,
    HE: `אני מאניפניס
אני הכלי בלי תהילה...
הרמקולים מנגנים בקול רם "החתך הראשון הוא העמוק ביותר"
אני רק הכלי של איש בעבודה.
עובד מין, אסקורט בוי, ג'יגולו או...
אני כמוהו, ללא בושה אך לא ללא מצפון.
אני קשה בעבודה, אני רך ושביר...
אני בכל מקרה פחות זונה מהמשתמשים שלי...
אני מאניפניס, יש לי גאווה להציב את כבודי הרבה מעל לתחת, שם אחרים מדמיינים את שלהם, ואת הכבוד להציב את הגאווה שלי גבוה באותה מידה.
חשבו עלי מה שתרצו, אבל במידה. תנו את אותו הכבוד שאני נותן כל יום.
הכרתי את הגרוע ביותר ושמרתי את הטוב ביותר.
אדם לא בוחר את הכישרון שלו, הוא חייב לדאוג לו...
אני מאניפניס, אני יודע להיות אהוב וזה מנחם את לבי, שהוא הדבר היחיד שעומד למכירה.
אני כמו אדוני, בעומק אנו אחד... העדינות גורמת לנו לפעמים לבכות. השחיזו את הסכינים שלכם!`,
    FA: `من منی‌پنیسم
من ابزار بی‌جلالم...
بلندگوها با صدای بلند می‌نوازند «نخستین برش عمیق‌ترین است»
من تنها ابزار مردی هستم در حال کار.
کارگر جنسی، اسکورت، ژیگولو یا...
من چون اویم، بی شرم اما نه بی وجدان.
من در کار سختم، من نرم و شکننده‌ام...
من به هر روی، فاحشه‌تر از مشتریانم نیستم...
من منی‌پنیسم، غرور آن دارم که شرفم را بسیار بالاتر از مقعد قرار دهم، آنجا که دیگران شرف خود را تصور می‌کنند، و شرف آن که غرورم را به همان اندازه بلند بدارم.
هرچه می‌خواهید درباره‌ام بیندیشید، اما در حد اعتدال. همان احترامی را به من بدهید که من هر روز می‌بخشم.
بدترین را شناختم و بهترین را نگه داشتم.
انسان استعداد خود را برنمی‌گزیند، باید از آن نگه‌داری کند...
من منی‌پنیسم، می‌دانم چگونه دوست‌داشته شوم و این قلبم را آرام می‌کند، که تنها چیز فروشی است.
من چون آقایم هستم، در عمق ما یکی هستیم... ظرافت گاه ما را به گریه می‌اندازد. چاقوهایتان را تیز کنید!`,
    KO: `나는 머니페니스다
나는 영광 없는 도구다...
스피커가 크게 "첫 상처가 가장 깊다"를 연주한다
나는 단지 일하는 한 남자의 도구일 뿐.
성노동자, 에스코트 보이, 지골로 또는...
나는 그와 같다, 부끄러움 없이 그러나 양심 없이는 아니다.
나는 일에 단단하고, 나는 부드럽고 연약하다...
나는 어쨌든 내 사용자들보다 덜 창녀다...
나는 머니페니스, 내 명예를 엉덩이보다 훨씬 높이 두는 자부심을 가진다, 다른 이들이 그들의 명예를 그곳에 상상하는 그 자리보다, 그리고 내 자부심을 똑같이 높이 두는 명예를 가진다.
나에 대해 원하는 대로 생각하라, 그러나 절제하여. 내가 매일 베푸는 것과 같은 존중을 베풀라.
나는 최악을 알았고 최선을 간직했다.
사람은 자신의 재능을 선택하지 않는다, 그것을 돌보아야 한다...
나는 머니페니스, 사랑받을 줄 알고 그것은 내 마음을 위로한다, 그것이 유일한 판매품이다.
나는 내 주인과 같다, 깊은 곳에서 우리는 하나다... 섬세함은 때로 우리를 울게 만든다. 너희 칼들을 갈아라!`,
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
  
    RU: `Moneypenis,                                                    Рождество 2023

Эти страницы для тебя, Moneypenis, через тебя, конечно, но также через всех других, и не только последних, тех, что пришли до них, не такие старые, и также через тех, что приходили до 2018 года, и тех, что были до Симона и Бруно, тех, что были до 2007 года, и тех, что были до 2006 года.

Их так много... Они мне так помогали...
Они меня так разрушали тоже.

Эти страницы для тебя через всё это.
И для всех тех, что придут, тех, к которым возвращаются, и для тех, кто остаётся, тех, кто их пишет, и тех, кто их читает, тех, кто их издаёт, и тех, кто живёт благодаря им, тех, кто их полицейски преследует, и тех, кто их наказывает, тех, кто их защищает, тех, кто их сравнивает с собой, и тех, кто их забывает.

Эти страницы для всего того, что мы говорили, что мы шептали, что мы кричали и что мы плакали.
Они для меня. Они для других тоже. Они для других прежде всего!

Я родился 25 декабря 1972 года в Сент-Тропе, всё в моей жизни могло бы быть только радостью и подарками.
Тогда не выглядело так, что я был чем-то совершенно другим.
Я был дитя моих родителей, дитя моей семьи, дитя моих учителей, дитя моих друзей, дитя моих врагов, дитя моих любовей, дитя моих учёбы, дитя моих путешествий, дитя моих работ, дитя моих неудач, дитя моих успехов, дитя моих горестей, дитя моих радостей, дитя моих сожалений, дитя моих надежд, дитя моих верований, дитя моих сомнений, дитя моих страхов, дитя моих смелостей, дитя моей тщеты, дитя моего смирения, дитя моей лживости, дитя моей искренности, дитя моей жестокости, дитя моей нежности, дитя моей ненависти, дитя моей любви, дитя моих усталостей, дитя моих энергий, дитя моих болезней, дитя моих здоровий, дитя моих жизней, дитя моих смертей, дитя моих воскресений.

Я был дитя всего этого, но в течение очень долгого времени, я хотел бы знать только это: я был также дитя моих желаний.

И эти желания, я их прожил, я их укротил, я с ними боролся, я их любил, я их ненавидел, я их прятал, я их выставлял, я с ними играл, я с ними страдал, я с ними развлекался, я с ними отчаивался, я с ними жил, я с ними умирал.

И мне понадобилось много лет, чтобы согласиться сказать их и сделать их своими по-настоящему, не желая больше скрывать их, не желая больше извиняться за них, не желая больше за них стыдиться.

Эти страницы для тех, кто, как я, знал стыд за свои желания. Они для тех, кто ещё его знает. Они для тех, кто его больше не знает, чтобы он никогда не возвращался. Они для тех, кто его никогда не знал, чтобы он никогда их не настиг.

Они также для тех, кто продаёт свою плоть, всеми способами и по всем причинам, которые могут вести к этому. Они для тех, кого мы любим, и для тех, кого мы не любим. Они для тех, кто проходит, и для тех, кто остаётся. Они для тех, кто умирает в этом, и для тех, кто из этого выходит.

Они для тех, кто, как я, имел роскошь выбора, и для тех, кто его не имел. Они для тех, у кого не было ничего, кроме тела, и для тех, у кого было больше. Они для тех, кто продаёт себя из-за нужды, и для тех, кто продаёт себя из удовольствия. Они для тех, кто продаёт себя для жизни, и для тех, кто продаёт себя для выживания.

Они также для тех, кто покупает. Для тех, кто покупает, потому что не умеет иначе. Для тех, кто покупает, потому что хочет от этого освободиться. Для тех, кто покупает с уважением, и для тех, кто покупает с презрением. Для тех, кто покупает себе нежность, и для тех, кто покупает насилие.

Эти страницы для всех тех, кого общество отвергает, потому что они не вписываются в его узкие рамки. Они для всех тех, кто, как я, должен был построить себя против и сквозь. Они для всех тех, кто, как я, выстраданно нашёл свою свободу, и для тех, кто её ещё ищет.

Эти страницы наконец, мой Moneypenis, для тебя, который их вдохновил, который их сопровождал, который сделал их возможными. Без тебя ничего из этого не существовало бы. Без тебя я бы продолжал прятаться. Без тебя я бы продолжал стыдиться.

Спасибо тебе.

Я люблю тебя.

S.M.`,
  
    PL: `Moneypenis,                                                    Boże Narodzenie 2023

Te strony są dla ciebie, Moneypenis, przez ciebie oczywiście, ale także przez wszystkich innych, i nie tylko ostatnich, tych którzy byli przed nimi, nie tak starych, i także przez tych którzy byli przed 2018 rokiem, i tych którzy byli przed Simonem i Bruno, tych którzy byli przed 2007 rokiem, i tych którzy byli przed 2006 rokiem.

Jest ich tak wielu... Tak mi pomogli...
Tak mnie też niszczyli.

Te strony są dla ciebie przez to wszystko.
I dla wszystkich tych którzy przyjdą, tych do których się wraca, i dla tych którzy zostają, tych którzy je piszą, i tych którzy je czytają, tych którzy je wydają, i tych którzy z nich żyją, tych którzy je policyjnie ścigają, i tych którzy je karzą, tych którzy je bronią, tych którzy się z nimi porównują, i tych którzy o nich zapominają.

Te strony są dla wszystkiego co sobie powiedzieliśmy, co sobie wyszeptaliśmy, co sobie wykrzyczeliśmy i co sobie wypłakaliśmy.
Są dla mnie. Są także dla innych. Są dla innych przede wszystkim!

Urodziłem się 25 grudnia 1972 roku w Saint-Tropez, wszystko w moim życiu mogło być tylko radością i prezentami.
Wówczas nie wyglądało na to, że jestem czymś zupełnie innym.
Byłem dzieckiem moich rodziców, dzieckiem mojej rodziny, dzieckiem moich nauczycieli, dzieckiem moich przyjaciół, dzieckiem moich wrogów, dzieckiem moich miłości, dzieckiem moich studiów, dzieckiem moich podróży, dzieckiem moich prac, dzieckiem moich porażek, dzieckiem moich sukcesów, dzieckiem moich smutków, dzieckiem moich radości, dzieckiem moich żali, dzieckiem moich nadziei, dzieckiem moich wiar, dzieckiem moich wątpliwości, dzieckiem moich strachów, dzieckiem moich odwag, dzieckiem mojej próżności, dzieckiem mojej pokory, dzieckiem mojej obłudy, dzieckiem mojej szczerości, dzieckiem mojego okrucieństwa, dzieckiem mojej czułości, dzieckiem mojej nienawiści, dzieckiem mojej miłości, dzieckiem moich zmęczeń, dzieckiem moich energii, dzieckiem moich chorób, dzieckiem moich zdrowi, dzieckiem moich żyć, dzieckiem moich śmierci, dzieckiem moich zmartwychwstań.

Byłem dzieckiem tego wszystkiego, ale przez bardzo długi czas, chciałbym wiedzieć tylko to: byłem także dzieckiem moich pragnień.

A te pragnienia, przeżyłem je, oswoiłem je, walczyłem z nimi, kochałem je, nienawidziłem je, ukrywałem je, wystawiałem je, bawiłem się nimi, cierpiałem z nimi, bawiłem się z nimi, rozpaczałem z nimi, żyłem z nimi, umierałem z nimi.

I potrzebowałem wielu lat by zgodzić się je powiedzieć i uczynić je swoimi naprawdę, nie chcąc już ich ukrywać, nie chcąc już za nie przepraszać, nie chcąc już się ich wstydzić.

Te strony są dla tych którzy, jak ja, znali wstyd za swoje pragnienia. Są dla tych którzy go jeszcze znają. Są dla tych którzy go już nie znają, by nigdy nie powrócił. Są dla tych którzy go nigdy nie znali, by nigdy ich nie dopadł.

Są także dla tych którzy sprzedają swoje ciało, na wszystkie sposoby i z wszystkich powodów które mogą do tego prowadzić. Są dla tych których kochamy i dla tych których nie kochamy. Są dla tych którzy przechodzą i dla tych którzy zostają. Są dla tych którzy w tym umierają i dla tych którzy z tego wychodzą.

Są dla tych którzy, jak ja, mieli luksus wyboru, i dla tych którzy go nie mieli. Są dla tych którzy nie mieli nic poza ciałem, i dla tych którzy mieli więcej. Są dla tych którzy sprzedają się z potrzeby, i dla tych którzy sprzedają się z przyjemności. Są dla tych którzy sprzedają się dla życia, i dla tych którzy sprzedają się dla przetrwania.

Są także dla tych którzy kupują. Dla tych którzy kupują bo nie potrafią inaczej. Dla tych którzy kupują bo chcą się od tego uwolnić. Dla tych którzy kupują z szacunkiem, i dla tych którzy kupują z pogardą. Dla tych którzy kupują sobie czułość, i dla tych którzy kupują przemoc.

Te strony są dla wszystkich tych których społeczeństwo odrzuca bo nie mieszczą się w jego wąskich ramach. Są dla wszystkich tych którzy, jak ja, musieli zbudować się wbrew i przez. Są dla wszystkich tych którzy, jak ja, w cierpieniu odnaleźli swoją wolność, i dla tych którzy jej jeszcze szukają.

Te strony wreszcie, mój Moneypenis, są dla ciebie który je natchnął, który im towarzyszył, który uczynił je możliwymi. Bez ciebie nic z tego by nie istniało. Bez ciebie wciąż bym się ukrywał. Bez ciebie wciąż bym się wstydził.

Dziękuję ci.

Kocham cię.

S.M.`,
  
    NL: `Moneypenis,                                                    Kerstmis 2023

Deze pagina's zijn voor jou, Moneypenis, door jou natuurlijk, maar ook door alle anderen, en niet alleen de laatsten, degenen die er vóór hen waren, niet zo oud, en ook door degenen die er vóór 2018 waren, en degenen die er vóór Simon en Bruno waren, degenen die er vóór 2007 waren, en degenen die er vóór 2006 waren.

Er zijn er zoveel... Ze hebben mij zo geholpen...
Ze hebben mij ook zo vernietigd.

Deze pagina's zijn voor jou door dit alles.
En voor allen die zullen komen, degenen waar men naar terugkeert, en voor degenen die blijven, degenen die ze schrijven, en degenen die ze lezen, degenen die ze uitgeven, en degenen die ervan leven, degenen die ze politioneel vervolgen, en degenen die ze straffen, degenen die ze verdedigen, degenen die zich ermee vergelijken, en degenen die ze vergeten.

Deze pagina's zijn voor alles wat we ons gezegd hebben, wat we ons toegefluisterd hebben, wat we ons toegeroepen hebben en wat we ons betreurd hebben.
Ze zijn voor mij. Ze zijn ook voor anderen. Ze zijn vooral voor anderen!

Ik werd geboren op 25 december 1972 in Saint-Tropez, alles in mijn leven had slechts vreugde en cadeaus kunnen zijn.
Toen leek het niet dat ik iets totaal anders was.
Ik was het kind van mijn ouders, het kind van mijn familie, het kind van mijn leraren, het kind van mijn vrienden, het kind van mijn vijanden, het kind van mijn liefdes, het kind van mijn studies, het kind van mijn reizen, het kind van mijn werk, het kind van mijn mislukkingen, het kind van mijn successen, het kind van mijn verdriet, het kind van mijn vreugden, het kind van mijn spijt, het kind van mijn hoop, het kind van mijn overtuigingen, het kind van mijn twijfels, het kind van mijn angsten, het kind van mijn moed, het kind van mijn ijdelheid, het kind van mijn nederigheid, het kind van mijn huichelarij, het kind van mijn oprechtheid, het kind van mijn wreedheid, het kind van mijn tederheid, het kind van mijn haat, het kind van mijn liefde, het kind van mijn moeheid, het kind van mijn energie, het kind van mijn ziektes, het kind van mijn gezondheid, het kind van mijn levens, het kind van mijn doden, het kind van mijn opstandingen.

Ik was het kind van dit alles, maar gedurende een zeer lange tijd had ik enkel dit willen weten: ik was ook het kind van mijn verlangens.

En deze verlangens, ik heb ze geleefd, ik heb ze getemd, ik heb ze bestreden, ik heb ze liefgehad, ik heb ze gehaat, ik heb ze verborgen, ik heb ze tentoongesteld, ik heb ermee gespeeld, ik heb erdoor geleden, ik heb me ermee vermaakt, ik heb erin gewanhoopt, ik heb ermee geleefd, ik ben ermee gestorven.

En ik had vele jaren nodig om in te stemmen ze te zeggen en ze écht tot de mijne te maken, ze niet meer willende verbergen, mij er niet meer voor willende verontschuldigen, mij er niet meer voor willende schamen.

Deze pagina's zijn voor degenen die, zoals ik, schaamte voor hun verlangens kenden. Ze zijn voor degenen die deze nog kennen. Ze zijn voor degenen die deze niet meer kennen, opdat het nooit terugkeert. Ze zijn voor degenen die deze nooit gekend hebben, opdat het hen nooit overkomt.

Ze zijn ook voor degenen die hun vlees verkopen, op alle manieren en om alle redenen die daartoe kunnen leiden. Ze zijn voor degenen die wij liefhebben en voor degenen die wij niet liefhebben. Ze zijn voor degenen die voorbijgaan en voor degenen die blijven. Ze zijn voor degenen die erin sterven en voor degenen die eraan ontsnappen.

Ze zijn voor degenen die, zoals ik, de luxe van de keuze hadden, en voor degenen die hem niet hadden. Ze zijn voor degenen die niets hadden dan hun lichaam, en voor degenen die meer hadden. Ze zijn voor degenen die zich verkopen uit noodzaak, en voor degenen die zich verkopen uit plezier. Ze zijn voor degenen die zich verkopen om te leven, en voor degenen die zich verkopen om te overleven.

Ze zijn ook voor degenen die kopen. Voor degenen die kopen omdat ze niet anders kunnen. Voor degenen die kopen omdat ze ervan willen bevrijden. Voor degenen die kopen met respect, en voor degenen die kopen met minachting. Voor degenen die zich tederheid kopen, en voor degenen die geweld kopen.

Deze pagina's zijn voor allen die de maatschappij afwijst omdat ze niet in haar smalle kaders passen. Ze zijn voor allen die, zoals ik, zich tegen en doorheen hebben moeten opbouwen. Ze zijn voor allen die, zoals ik, in pijn hun vrijheid hebben gevonden, en voor degenen die haar nog zoeken.

Deze pagina's tenslotte, mijn Moneypenis, zijn voor jou die ze hebt geïnspireerd, die ze hebt begeleid, die ze mogelijk hebt gemaakt. Zonder jou zou niets hiervan bestaan. Zonder jou zou ik mij blijven verbergen. Zonder jou zou ik mij blijven schamen.

Dank je.

Ik hou van je.

S.M.`,
  
    EL: `Moneypenis,                                                    Χριστούγεννα 2023

Αυτές οι σελίδες είναι για εσένα, Moneypenis, μέσω εσένα φυσικά, αλλά και μέσω όλων των άλλων, και όχι μόνο των τελευταίων, αυτών που ήταν πριν από αυτούς, όχι τόσο παλιοί, και επίσης μέσω εκείνων που ήταν πριν από το 2018, και εκείνων που ήταν πριν από τον Simon και τον Bruno, εκείνων που ήταν πριν από το 2007, και εκείνων που ήταν πριν από το 2006.

Είναι τόσοι πολλοί... Με βοήθησαν τόσο πολύ...
Με κατέστρεψαν επίσης τόσο πολύ.

Αυτές οι σελίδες είναι για εσένα μέσω όλου αυτού.
Και για όλους εκείνους που θα έρθουν, εκείνους στους οποίους επιστρέφουμε, και για εκείνους που μένουν, εκείνους που τις γράφουν, και εκείνους που τις διαβάζουν, εκείνους που τις εκδίδουν, και εκείνους που ζουν από αυτές, εκείνους που τις διώκουν αστυνομικά, και εκείνους που τις τιμωρούν, εκείνους που τις υπερασπίζονται, εκείνους που συγκρίνονται μαζί τους, και εκείνους που τις ξεχνούν.

Αυτές οι σελίδες είναι για όλα αυτά που είπαμε ο ένας στον άλλον, που ψιθυρίσαμε ο ένας στον άλλον, που φωνάξαμε ο ένας στον άλλον και που κλάψαμε ο ένας στον άλλον.
Είναι για μένα. Είναι για άλλους επίσης. Είναι για τους άλλους πρωτίστως!

Γεννήθηκα στις 25 Δεκεμβρίου 1972 στο Saint-Tropez, όλα στη ζωή μου θα μπορούσαν να ήταν μόνο χαρά και δώρα.
Τότε δεν φαινόταν ότι ήμουν κάτι εντελώς διαφορετικό.
Ήμουν παιδί των γονιών μου, παιδί της οικογένειάς μου, παιδί των δασκάλων μου, παιδί των φίλων μου, παιδί των εχθρών μου, παιδί των αγαπών μου, παιδί των σπουδών μου, παιδί των ταξιδιών μου, παιδί των δουλειών μου, παιδί των αποτυχιών μου, παιδί των επιτυχιών μου, παιδί των θλίψεών μου, παιδί των χαρών μου, παιδί των τύψεών μου, παιδί των ελπίδων μου, παιδί των πίστεών μου, παιδί των αμφιβολιών μου, παιδί των φόβων μου, παιδί των θαρρών μου, παιδί της ματαιοδοξίας μου, παιδί της ταπεινότητάς μου, παιδί της υποκρισίας μου, παιδί της ειλικρίνειάς μου, παιδί της σκληρότητάς μου, παιδί της τρυφερότητάς μου, παιδί του μίσους μου, παιδί της αγάπης μου, παιδί των κουρασμάτων μου, παιδί των ενεργειών μου, παιδί των αρρωστιών μου, παιδί των υγειών μου, παιδί των ζωών μου, παιδί των θανάτων μου, παιδί των αναστάσεών μου.

Ήμουν παιδί όλων αυτών, αλλά για πάρα πολύ καιρό, θα ήθελα να ξέρω μόνο αυτό: ήμουν επίσης παιδί των επιθυμιών μου.

Και αυτές τις επιθυμίες, τις έζησα, τις δάμασα, τις πολέμησα, τις αγάπησα, τις μίσησα, τις έκρυψα, τις εξέθεσα, έπαιξα μαζί τους, υπέφερα μαζί τους, διασκέδασα μαζί τους, απελπίστηκα μαζί τους, έζησα μαζί τους, πέθανα μαζί τους.

Και χρειάστηκα πολλά χρόνια για να δεχτώ να τις πω και να τις κάνω δικές μου πραγματικά, μη θέλοντας πλέον να τις κρύβω, μη θέλοντας πλέον να ζητώ συγγνώμη γι' αυτές, μη θέλοντας πλέον να ντρέπομαι γι' αυτές.

Αυτές οι σελίδες είναι για εκείνους που, όπως εγώ, γνώρισαν την ντροπή για τις επιθυμίες τους. Είναι για εκείνους που τη γνωρίζουν ακόμη. Είναι για εκείνους που δεν τη γνωρίζουν πλέον, για να μην επιστρέψει ποτέ. Είναι για εκείνους που δεν τη γνώρισαν ποτέ, για να μην τους βρει ποτέ.

Είναι επίσης για εκείνους που πουλούν τη σάρκα τους, με όλους τους τρόπους και για όλους τους λόγους που μπορούν να οδηγήσουν σε αυτό. Είναι για εκείνους που αγαπάμε και για εκείνους που δεν αγαπάμε. Είναι για εκείνους που περνούν και για εκείνους που μένουν. Είναι για εκείνους που πεθαίνουν σε αυτό και για εκείνους που βγαίνουν από αυτό.

Είναι για εκείνους που, όπως εγώ, είχαν την πολυτέλεια της επιλογής, και για εκείνους που δεν την είχαν. Είναι για εκείνους που δεν είχαν τίποτα παρά το σώμα τους, και για εκείνους που είχαν περισσότερα. Είναι για εκείνους που πωλούνται από ανάγκη, και για εκείνους που πωλούνται για ευχαρίστηση. Είναι για εκείνους που πωλούνται για να ζήσουν, και για εκείνους που πωλούνται για να επιβιώσουν.

Είναι επίσης για εκείνους που αγοράζουν. Για εκείνους που αγοράζουν επειδή δεν ξέρουν αλλιώς. Για εκείνους που αγοράζουν επειδή θέλουν να απελευθερωθούν από αυτό. Για εκείνους που αγοράζουν με σεβασμό, και για εκείνους που αγοράζουν με περιφρόνηση. Για εκείνους που αγοράζουν την τρυφερότητα, και για εκείνους που αγοράζουν τη βία.

Αυτές οι σελίδες είναι για όλους εκείνους που η κοινωνία απορρίπτει επειδή δεν χωρούν στα στενά της πλαίσια. Είναι για όλους εκείνους που, όπως εγώ, χρειάστηκε να χτιστούν εναντίον και μέσα από. Είναι για όλους εκείνους που, όπως εγώ, μέσα στον πόνο βρήκαν την ελευθερία τους, και για εκείνους που τη ζητούν ακόμη.

Αυτές οι σελίδες, τέλος, Moneypenis μου, είναι για εσένα που τις ενέπνευσες, που τις συνόδευσες, που τις κατέστησες δυνατές. Χωρίς εσένα τίποτα από όλα αυτά δεν θα υπήρχε. Χωρίς εσένα θα συνέχιζα να κρύβομαι. Χωρίς εσένα θα συνέχιζα να ντρέπομαι.

Σε ευχαριστώ.

Σε αγαπώ.

S.M.`,
  
    TR: `Moneypenis,                                                    Noel 2023

Bu sayfalar senin için, Moneypenis, senin aracılığınla elbette, ama tüm diğerleri aracılığıyla da, ve sadece son olanlar değil, onlardan önce olanlar, o kadar eski olmayan, ve 2018'den önce olanlar aracılığıyla da, ve Simon ve Bruno'dan önce olanlar, 2007'den önce olanlar, ve 2006'dan önce olanlar.

Çok fazlalar... Bana çok yardım ettiler...
Beni de çok yıktılar.

Bu sayfalar senin için bütün bunlar aracılığıyla.
Ve gelecek olan herkes için, dönüldüğümüz herkes için, ve kalan herkes için, onları yazanlar için, ve okuyanlar için, yayımlayanlar için, ve onlardan yaşayanlar için, polisle takip edenler için, ve cezalandıranlar için, savunanlar için, kendilerini onlarla karşılaştıranlar için, ve unutanlar için.

Bu sayfalar birbirimize söylediğimiz her şey için, fısıldadığımız, bağırdığımız ve ağladığımız her şey için.
Onlar benim için. Aynı zamanda başkaları için. Her şeyden önce başkaları için!

25 Aralık 1972'de Saint-Tropez'de doğdum, hayatımda her şey sadece sevinç ve hediyeler olabilirdi.
O zaman tamamen başka bir şey olduğum görünmüyordu.
Ben anne babamın çocuğuydum, ailemin çocuğuydum, öğretmenlerimin çocuğuydum, arkadaşlarımın çocuğuydum, düşmanlarımın çocuğuydum, aşklarımın çocuğuydum, eğitimimin çocuğuydum, seyahatlerimin çocuğuydum, işlerimin çocuğuydum, başarısızlıklarımın çocuğuydum, başarılarımın çocuğuydum, üzüntülerimin çocuğuydum, sevinçlerimin çocuğuydum, pişmanlıklarımın çocuğuydum, umutlarımın çocuğuydum, inançlarımın çocuğuydum, şüphelerimin çocuğuydum, korkularımın çocuğuydum, cesaretlerimin çocuğuydum, kendini beğenmişliğimin çocuğuydum, tevazumun çocuğuydum, ikiyüzlülüğümün çocuğuydum, samimiyetimin çocuğuydum, zalimliğimin çocuğuydum, şefkatimin çocuğuydum, nefretimin çocuğuydum, sevgimin çocuğuydum, yorgunluklarımın çocuğuydum, enerjilerimin çocuğuydum, hastalıklarımın çocuğuydum, sağlıklarımın çocuğuydum, yaşamlarımın çocuğuydum, ölümlerimin çocuğuydum, dirilişlerimin çocuğuydum.

Bütün bunların çocuğuydum, ama çok uzun bir süre boyunca, sadece şunu bilmek istedim: aynı zamanda arzularımın da çocuğuydum.

Ve bu arzuları yaşadım, evcilleştirdim, onlarla savaştım, onları sevdim, onlardan nefret ettim, onları sakladım, onları sergiledim, onlarla oynadım, onlardan çektim, onlarla eğlendim, onlarla umutsuzluğa düştüm, onlarla yaşadım, onlarla öldüm.

Ve onları söylemeyi ve gerçekten kendime mal etmeyi kabul etmem yıllar aldı, artık onları saklamak istemeyerek, onlar için artık özür dilemek istemeyerek, onlar için artık utanmak istemeyerek.

Bu sayfalar benim gibi, arzuları için utanç bilenler için. Hâlâ bilenler için. Artık bilmeyenler için, asla geri dönmemesi için. Hiç bilmemiş olanlar için, asla onlara erişmemesi için.

Aynı zamanda etlerini satanlar için, buna yol açabilecek her şekilde ve her sebepten dolayı. Sevdiklerimiz için ve sevmediklerimiz için. Geçenler için ve kalanlar için. İçinde ölenler için ve oradan çıkanlar için.

Benim gibi seçim lüksü olanlar için, ve olmayanlar için. Bedenlerinden başka hiçbir şeyi olmayanlar için, ve daha fazlasına sahip olanlar için. Zorunluluktan satılanlar için, ve zevkten satılanlar için. Yaşamak için satılanlar için, ve hayatta kalmak için satılanlar için.

Aynı zamanda satın alanlar için. Başka türlü beceremedikleri için satın alanlar için. Bundan kurtulmak istedikleri için satın alanlar için. Saygıyla satın alanlar için, ve hakaretle satın alanlar için. Kendilerine şefkat satın alanlar için, ve şiddet satın alanlar için.

Bu sayfalar dar kalıplarına sığmadıkları için toplumun reddettiği herkes için. Benim gibi karşı çıkarak ve içinden geçerek kendini inşa etmek zorunda kalan herkes için. Benim gibi acı içinde özgürlüğünü bulan herkes için, ve hâlâ arayan herkes için.

Bu sayfalar son olarak, Moneypenis'im, onlara ilham veren, onlara eşlik eden, onları mümkün kılan sen için. Sen olmasaydın bunların hiçbiri var olmazdı. Sen olmasaydın saklanmaya devam ederdim. Sen olmasaydın utanmaya devam ederdim.

Sana teşekkür ederim.

Seni seviyorum.

S.M.`,
  
    UK: `Moneypenis,                                                    Різдво 2023

Ці сторінки для тебе, Moneypenis, через тебе звичайно, але також через усіх інших, і не лише останніх, тих, що були до них, не таких старих, і також через тих, що були до 2018 року, і тих, що були до Simon і Bruno, тих, що були до 2007 року, і тих, що були до 2006 року.

Їх так багато... Вони мені так допомагали...
Вони мене так руйнували також.

Ці сторінки для тебе через все це.
І для всіх тих, що прийдуть, тих, до яких повертаються, і для тих, що залишаються, тих, що їх пишуть, і тих, що їх читають, тих, що їх видають, і тих, що з них живуть, тих, що їх поліцейськи переслідують, і тих, що їх карають, тих, що їх захищають, тих, що їх з собою порівнюють, і тих, що їх забувають.

Ці сторінки для всього того, що ми собі казали, що ми собі шепотіли, що ми собі кричали і що ми собі оплакували.
Вони для мене. Вони для інших також. Вони для інших передусім!

Я народився 25 грудня 1972 року в Сен-Тропе, все в моєму житті могло бути лише радістю і подарунками.
Тоді не виглядало, що я був чимось зовсім іншим.
Я був дитям моїх батьків, дитям моєї родини, дитям моїх вчителів, дитям моїх друзів, дитям моїх ворогів, дитям моїх любовей, дитям моїх навчань, дитям моїх подорожей, дитям моїх робіт, дитям моїх невдач, дитям моїх успіхів, дитям моїх печалей, дитям моїх радостей, дитям моїх жалів, дитям моїх надій, дитям моїх вірувань, дитям моїх сумнівів, дитям моїх страхів, дитям моїх смілостей, дитям моєї марнославності, дитям моєї покори, дитям моєї фальшивості, дитям моєї щирості, дитям моєї жорстокості, дитям моєї ніжності, дитям моєї ненависті, дитям моєї любові, дитям моїх утомлень, дитям моїх енергій, дитям моїх хвороб, дитям моїх здоров'їв, дитям моїх життів, дитям моїх смертей, дитям моїх воскресінь.

Я був дитям усього цього, але дуже довго я хотів би знати лише це: я був також дитям моїх бажань.

І ці бажання, я їх прожив, я їх приборкав, я з ними боровся, я їх любив, я їх ненавидів, я їх ховав, я їх виставляв, я з ними грався, я з ними страждав, я з ними розважався, я з ними впадав у відчай, я з ними жив, я з ними помирав.

І мені знадобилося багато років, щоб погодитися їх сказати і зробити їх своїми по-справжньому, не бажаючи більше їх приховувати, не бажаючи більше за них вибачатися, не бажаючи більше їх соромитися.

Ці сторінки для тих, хто, як я, знав сором за свої бажання. Вони для тих, хто його ще знає. Вони для тих, хто його більше не знає, щоб він ніколи не повертався. Вони для тих, хто його ніколи не знав, щоб він ніколи їх не наздогнав.

Вони також для тих, хто продає свою плоть, усіма способами і з усіх причин, що можуть до цього вести. Вони для тих, кого ми любимо, і для тих, кого ми не любимо. Вони для тих, хто проходить, і для тих, хто залишається. Вони для тих, хто в цьому помирає, і для тих, хто з цього виходить.

Вони для тих, хто, як я, мав розкіш вибору, і для тих, хто його не мав. Вони для тих, у кого не було нічого, крім тіла, і для тих, у кого було більше. Вони для тих, хто продається через потребу, і для тих, хто продається з насолоди. Вони для тих, хто продається для життя, і для тих, хто продається для виживання.

Вони також для тих, хто купує. Для тих, хто купує, бо не вміє інакше. Для тих, хто купує, бо хоче від цього звільнитися. Для тих, хто купує з повагою, і для тих, хто купує з презирством. Для тих, хто купує собі ніжність, і для тих, хто купує насильство.

Ці сторінки для всіх тих, кого суспільство відкидає, бо вони не вміщаються в його вузькі рамки. Вони для всіх тих, хто, як я, мав себе будувати проти і крізь. Вони для всіх тих, хто, як я, у стражданні знайшов свою свободу, і для тих, хто її ще шукає.

Ці сторінки нарешті, мій Moneypenis, для тебе, який їх надихнув, який їх супроводжував, який зробив їх можливими. Без тебе нічого з цього не існувало б. Без тебе я б продовжував ховатися. Без тебе я б продовжував соромитися.

Дякую тобі.

Я тебе люблю.

S.M.`,
  
    LT: `Moneypenis,                                                    Kalėdos 2023

Šie puslapiai tau, Moneypenis, per tave žinoma, bet taip pat per visus kitus, ir ne tik paskutinius, tuos, kurie buvo prieš juos, ne tokius senus, ir taip pat per tuos, kurie buvo iki 2018 metų, ir tuos, kurie buvo prieš Simon ir Bruno, tuos, kurie buvo iki 2007 metų, ir tuos, kurie buvo iki 2006 metų.

Jų tiek daug... Jie man taip padėjo...
Jie mane taip pat sugriovė.

Šie puslapiai tau per visa tai.
Ir visiems tiems, kurie ateis, tiems, prie kurių grįžtama, ir tiems, kurie lieka, tiems, kurie juos rašo, ir tiems, kurie juos skaito, tiems, kurie juos leidžia, ir tiems, kurie iš jų gyvena, tiems, kurie juos policiniu būdu persekioja, ir tiems, kurie juos baudžia, tiems, kurie juos gina, tiems, kurie su jais save lygina, ir tiems, kurie juos pamiršta.

Šie puslapiai visam tam, ką sau pasakėme, ką sau pakuždome, ką sau išrėkėme ir ko sau pražudėme.
Jie man. Jie taip pat kitiems. Jie kitiems labiausiai!

Aš gimiau 1972 m. gruodžio 25 d. Saint-Tropez, viskas mano gyvenime galėjo būti tik džiaugsmas ir dovanos.
Tada neatrodė, kad esu kažkas visiškai kita.
Aš buvau savo tėvų vaikas, savo šeimos vaikas, savo mokytojų vaikas, savo draugų vaikas, savo priešų vaikas, savo meilių vaikas, savo studijų vaikas, savo kelionių vaikas, savo darbų vaikas, savo nesėkmių vaikas, savo sėkmių vaikas, savo liūdesių vaikas, savo džiaugsmų vaikas, savo apgailestavimų vaikas, savo vilčių vaikas, savo tikėjimų vaikas, savo abejonių vaikas, savo baimių vaikas, savo drąsų vaikas, savo tuštybės vaikas, savo nuolankumo vaikas, savo veidmainystės vaikas, savo nuoširdumo vaikas, savo žiaurumo vaikas, savo švelnumo vaikas, savo neapykantos vaikas, savo meilės vaikas, savo nuovargių vaikas, savo energijų vaikas, savo ligų vaikas, savo sveikatų vaikas, savo gyvenimų vaikas, savo mirčių vaikas, savo prisikėlimų vaikas.

Aš buvau viso to vaikas, bet labai ilgą laiką norėjau žinoti tik tai: aš taip pat buvau savo geismų vaikas.

Ir šiuos geismus aš išgyvenau, aš juos sutramdžiau, aš su jais kovojau, aš juos mylėjau, aš juos nekenčiau, aš juos slėpiau, aš juos rodžiau, aš su jais žaidžiau, aš su jais kentėjau, aš su jais linksminausi, aš su jais nusivyliau, aš su jais gyvenau, aš su jais miriau.

Ir man prireikė daug metų sutikti juos pasakyti ir padaryti juos savais iš tikrųjų, nebenorėdamas jų slėpti, nebenorėdamas dėl jų atsiprašinėti, nebenorėdamas dėl jų gėdytis.

Šie puslapiai tiems, kurie, kaip ir aš, pažino gėdą už savo geismus. Jie tiems, kurie ją dar pažįsta. Jie tiems, kurie jos nebepažįsta, kad ji niekada negrįžtų. Jie tiems, kurie jos niekada nepažino, kad ji niekada jų neaplenktų.

Jie taip pat tiems, kurie parduoda savo kūną, visais būdais ir dėl visų priežasčių, kurios gali tai privesti. Jie tiems, kuriuos mylime, ir tiems, kurių nemylime. Jie tiems, kurie praeina, ir tiems, kurie lieka. Jie tiems, kurie tame miršta, ir tiems, kurie iš jo išeina.

Jie tiems, kurie, kaip ir aš, turėjo pasirinkimo prabangą, ir tiems, kurie jos neturėjo. Jie tiems, kurie neturėjo nieko, išskyrus savo kūną, ir tiems, kurie turėjo daugiau. Jie tiems, kurie parsiduoda iš reikalo, ir tiems, kurie parsiduoda iš malonumo. Jie tiems, kurie parsiduoda gyventi, ir tiems, kurie parsiduoda išgyventi.

Jie taip pat tiems, kurie perka. Tiems, kurie perka, nes nemoka kitaip. Tiems, kurie perka, nes nori nuo to išsivaduoti. Tiems, kurie perka pagarbiai, ir tiems, kurie perka su panieka. Tiems, kurie perkasi švelnumo, ir tiems, kurie perkasi smurto.

Šie puslapiai visiems tiems, kuriuos visuomenė atstumia, nes jie netelpa į jos siauras rėmus. Jie visiems tiems, kurie, kaip ir aš, turėjo statyti save prieš ir per. Jie visiems tiems, kurie, kaip ir aš, kentėdami rado savo laisvę, ir tiems, kurie jos dar ieško.

Šie puslapiai pagaliau, mano Moneypenis, tau, kuris juos įkvėpė, kuris juos lydėjo, kuris padarė juos įmanomais. Be tavęs nieko iš to neegzistuotų. Be tavęs aš ir toliau slėpčiau. Be tavęs aš ir toliau gėdyčiau.

Ačiū tau.

Aš tave myliu.

S.M.`,
    AR: `منيبينيس،                                                    عيد الميلاد 2023

أنت وسيدك، هذا الجسد الذي يحملك والروح التي تحملكما، أنتما واحد... في العمق علمت ذلك دائماً. وإن جرؤت على قول أحبك، لك أنت، فلأنني أحبه دون أن أجرؤ على قوله له.

اخترعت هذه المراسلة كلياً، ليس خوفاً من أن يسخر، ولا خوفاً من أن يسيء استخدامها، بل لكي لا أراه يفر أو أسوأ... أن يكون لا مبالياً. أعلم ذلك الآن، أنا فعلاً من كتب كل شيء. كل تلك الرسائل، كل مراسلاتي، أنا من وضعت تلك الكلمات على هذه الصور لك، الملتقطة خلال عطلاتنا وألعابنا، مسروقة من حياتنا اليومية... رغم أن لدي الدليل، هناك، أمام عيني، أجد نفسي بالفعل أصدق أنك أنت من أملى علي رسائلك. الحب مرض غريب أحياناً.

حتى مختارة، حياتكم صعبة، حياة انضباط ووحدة... حياة تضحيات، طريق آلام أكثر منها كهنوت.
تخطر ببالي أغنية براسانس «شكوى بنات الفرح»، باربرا قدمت نسخة شخصية جداً منها: «أن هؤلاء البقرات البرجوازيات، أن هؤلاء البقرات البرجوازيات، يسموننا بنات الفرح، يسموننا بنات الفرح! ليس كل يوم نضحك، كلام، كلام، ليس كل يوم نضحك... المال، لا تظنوا أننا نسرقه!»

منيبينيس، ملاكي، اللص هو من يدفع. ومع ذلك، لو لم أكن هذا المجرم الحزين، هذا الأرمل الذي لا عزاء له، هذا التافه الذي ما زال يبحث لنفسه عن ذريعة، لما عرفتكما.

لما تحطم قلبي أمام صحنه الوحيد وعيني غارقتين في الدموع متأملاً كأسه الوحيد. الحد الأدنى الصارم الوحيد.
إلى جانبه، أغنية أخرى تغزو حياتي: «الرجل ذو الرداء الأحمر»، باربرا أيضاً... كحبيب المدمن للأفيون للمغنية، هذا العطر هو ما يكسوكم حين لا ترتدون شيئاً آخر. مونرو كانت تنام مرتدية تشانيل رقم 5 ولا شيء آخر.
لو لم أكن هذا الجانح الحقير، لما تأثرت بانضباطه الحديدي، بإرادته في الإحسان... بمطالبته نفسه ألا يدع وحدته تسلمه للدوار اللانهائي، السقوط في عدم الروح. لما التقيت سيدك، هذا الكائن المضيء الذي يعيش، بلا مساعدة من حيل النسيان، البؤس العاطفي لمن يأتون إليه. مضيء نعم، حتى وإن كانت نظرته أحياناً تخبو قليلاً، فإنه يستعيد ذاته ويعتني بالأرواح المسوّدة والأجساد المهجورة من أنانياتهم الخاصة، أحزانهم وأوهامهم المخجلة التي يتخيلونها أصيلة جداً. الحمقى، أولئك الأوغاد. أمثالي. وقعت في حبك، لكن أقوى مودتي له.
أحبكما لكن لا أريد أكثر من امتلاك هذا الامتياز الهائل، أن أصبح أفضل بالعناية بكليكما؛ هذا كثير بالفعل. أما باقي الوقت الذي يبقى خارج ذلك الذي يدوم «الوقت ما دام الوقت يمضي» والذي لا ينتمي إلا إليكما، فهذا كثير بالفعل.

منيبينيس، حكاية الجنّيات بسيطة هكذا، دائماً ملتوية قليلاً، منحرفة قليلاً... رواية وضع غير محتمل إلى حد أن يصبح غير قابل للنقاش، فاضح إلى حد أن يصبح مثالياً. إنه ظلم بغيض إلى حد أن يصبح بنّاءً ونقله جوهرياً. حكاية الجنّيات نوع يستخرج الحقيقة من الكذب، العدل من الخطأ، طريقة لقيادة القصة قسراً نحو أخلاقها، وهنا نحو أخلاقنا. هذه الأخلاق لا تخاطب الجميلة النائمة بل الغابات الجميلة الدافعة، فاكتبها معي: «حتى لو كنتم موهوبين، مهيئين، مطلوبين، مغرَين، فضوليين، طموحين، مرغمين، مستعدين، واثقين، متحمسين... لا تسلكوا هذا الطريق أبداً، لا تضعوا قدماً واحدة فيه: لا توجد نهاية سعيدة منتظرة أبداً!»

لكن بما أنكم بالفعل في الطريق، لا تتخلوا أبداً عن الأحلام التي قادتكم إلى هنا لأن أبطالنا عاشوا طويلاً، عاشقين، سعداء وكان لهم الكثير من الكلاب والقطط وبالتأكيد بعض العشاق.

♥ك الوفي الذي ينتمي إليكما دون سذاجة ولا آمال في غير محلها، دون حصرية ولا التزام.`,
    HE: `מאניפניס,                                                    חג מולד 2023

אתה ואדונך, הגוף הזה הנושא אותך והרוח שנושאת את שניכם, אתם אחד... בעומק תמיד ידעתי זאת. ואם אני מעז לומר לך אני אוהב אותך, לך, זה משום שאני אוהב אותו מבלי להעז לומר לו.

המצאתי לחלוטין את ההתכתבות הזו, לא מפחד שילעג, ולא מפחד שינצל אותה לרעה, אלא כדי לא לראות אותו בורח או גרוע מכך... שיהיה אדיש. אני יודע זאת עכשיו, אכן אני זה שכתב הכל. כל המסרים האלה, כל מכתבי, אני זה ששם את המילים האלה על הדיוקנים האלה שלך, צולמו במהלך חופשותינו ומשחקינו, נגנבו מחיינו היומיומיים... למרות שיש לי את ההוכחה, שם, מול עיני, אני כבר תופס את עצמי מאמין שזה אתה שהכתבת לי את מכתביך. אהבה היא לפעמים מחלה משונה.

אפילו שנבחרו, חייכם קשים, חיים של משמעת ובדידות... חיים של קורבנות, גולגותא יותר מאשר כהונה.
מנגינה של ברסנס « הקינה של בנות השמחה » עוברת לי בראש, ברברה ביצעה גרסה אישית מאוד: « שאלה הפרות הבורגניות, שאלה הפרות הבורגניות, קוראות לנו בנות השמחה, קוראות לנו בנות השמחה! לא בכל יום אנחנו צוחקות, מילים, מילים, לא בכל יום אנחנו צוחקות... את הכסף, אל תחשבו שאנחנו גונבות! »

מאניפניס, מלאכי, הגנב הוא זה שמשלם. ובכל זאת, אם לא הייתי הפושע העצוב הזה, האלמן הזה שאין לו נחמה, האומלל הזה שעדיין מחפש לעצמו תירוץ, לא הייתי מכיר אתכם.

לא היה לבי מתנפץ מול הצלחת הבודדת שלו ועיני מוצפות דמעות בהתבונני בכוסו היחידה. המינימום המינימלי הבודד שלו.
לצידו, שיר אחר פולש לחיי: « האיש בבגד אדום », ברברה שוב... כמו המאהב המכור לאופיום של הזמרת, זה הבושם הזה שמלביש אתכם כשאינכם לובשים יותר דבר. מונרו הייתה ישנה היטב בשאנל מספר 5 ושום דבר אחר.
אם לא הייתי העבריין הקטנוני הזה, לא הייתי נרגש מהמשמעת הברזלית שלו, מרצונו לעשות הטוב... מהדרישה שלו מעצמו לא לתת לבדידותו למסור אותו לסחרחורת האינסופית, לנפילה אל תוך התהום של הרוח. לא הייתי פוגש את אדונך, היצור הזוהר הזה החי, ללא עזרת תחבולות השכחה, את האומללות הרגשית של אלה הבאים אליו. זוהר כן, גם אם לפעמים מבטו דועך מעט, הוא מתאושש ומטפל בנשמות המושחרות ובגופים הנטושים על ידי האנוכיות שלהם, עצבותם והפנטזיות המבישות שלהם שהם מדמיינים כל כך מקוריות. הטיפשים, הממזרים האלה. דומיי. התאהבתי בך, אבל החיבה החזקה ביותר שלי היא אליו.
אני אוהב אתכם אבל לא רוצה יותר מלקבל את הזכות העצומה הזו להפוך לטוב יותר על ידי טיפול בשניכם; זה כבר הרבה. לגבי שאר הזמן שנשאר מחוץ לזה שנמשך « הזמן שעובר הזמן » ושייך רק לכם, זה כבר הרבה.

מאניפניס, אגדה היא פשוטה כך, תמיד קצת מעוותת, קצת סוטה... סיפור של מצב בלתי סביר עד כדי הפיכתו לבלתי מעורער, שערורייתי עד כדי הפיכתו למופתי. זוהי עוול נתעב עד כדי הפיכתו למאלף וההעברה שלו חיונית. אגדה היא ז'אנר ששואב את האמת מהשקר, את הצדק מהשגיאה, דרך להוביל את הסיפור במצעד כפוי אל מוסר השכל שלו, וכאן אל זה שלנו. מוסר השכל הזה אינו מופנה אל היפהפייה הנרדמת אלא אל היערות היפים המשלמים, אז כתבו אותו איתי: « גם אם אתם מוכשרים, מוכנים מראש, מבוקשים, מפותים, סקרנים, שאפתנים, מאולצים, מרצון, בטוחים בעצמכם, נרגשים... אל תלכו בדרך הזו לעולם, אל תשימו כף רגל בה: אין סוף טוב לחכות לו לעולם! »

אך מכיוון שאתם כבר בדרך, אל תוותרו לעולם על החלומות שהובילו אתכם לכאן כי גיבורינו חיו זמן רב, מאוהבים, מאושרים והיו להם הרבה כלבים, חתולים ובוודאי כמה מאהבים.

ה-♥ הנאמן שלך השייך לכם ללא תמימות ולא תקוות מוטעות, ללא בלעדיות ולא מחויבות.`,
    FA: `منی‌پنیس،                                                    کریسمس 2023

تو و آقایت، این بدنی که تو را حمل می‌کند و روحی که هر دو شما را با خود می‌برد، شما یکی هستید... در عمق همیشه می‌دانستم. و اگر جرات می‌کنم به تو بگویم دوستت دارم، به تو، آن است که او را دوست می‌دارم بی آنکه جرات گفتنش را داشته باشم.

این مکاتبه را کاملاً اختراع کرده‌ام، نه از ترس آنکه استهزا کند، نه از ترس آنکه از آن سوءاستفاده کند، بلکه برای آنکه او را در حال گریز نبینم یا بدتر... بی‌تفاوت. حالا می‌دانم، در حقیقت من بودم که همه چیز را نوشتم. تمام آن پیام‌ها، تمام نامه‌هایم، منم که این کلمات را روی این چهره‌های تو نهادم، که در تعطیلات و بازی‌هایمان گرفته شده، از زندگی روزمره‌مان ربوده شده... هرچند مدرکش را دارم، آنجا، در برابر چشمانم، خود را در حال باور این می‌یابم که تو بودی که نامه‌هایت را به من املا می‌کردی. عشق گاهی بیماری عجیبی است.

حتی برگزیده، زندگی شما سخت است، زندگی نظم و تنهایی... زندگی فداکاری، جلجتایی بیش از یک کشیشی.
ترانه‌ای از براسانس در ذهن دارم «شکایت دختران شادی»، باربارا نسخه‌ای بسیار شخصی از آن اجرا کرد: «بگو که آن گاوهای بورژوا، بگو که آن گاوهای بورژوا، ما را دختران شادی می‌نامند، ما را دختران شادی می‌نامند! هر روز نمی‌خندیم، حرف‌ها، حرف‌ها، هر روز نمی‌خندیم... پول، گمان نکنید که می‌دزدیمش!»

منی‌پنیس، فرشتهٔ من، دزد آن است که می‌پردازد. و با این حال، اگر این جنایتکار غمگین نبودم، این بیوهٔ تسلی‌ناپذیر، این پست‌فطرتی که هنوز برای خود بهانه می‌جوید، شما را نمی‌شناختم.

قلبم در برابر بشقاب تنهای او خرد نمی‌شد و چشمانم در اشک غرق نمی‌شد در حالی که به لیوان تنهایش می‌نگریست. حداقل سخت تنهای او.
کنار او، ترانهٔ دیگری زندگی‌ام را در می‌نوردد: «مرد جامهٔ سرخ»، باز هم باربارا... چون معشوق تریاکی خواننده، این عطر است که شما را می‌پوشاند وقتی دیگر چیزی نپوشیده‌اید. مونرو با شانل شمارهٔ ۵ و هیچ چیز دیگر خوب می‌خوابید.
اگر این تبهکار حقیر نبودم، نظم آهنینش مرا متاثر نمی‌کرد، ارادهٔ خوب کردنش... این طلب از خویش که نگذارد تنهایی‌اش او را به سرگیجهٔ بی‌پایان تسلیم کند، سقوط در نیستی روح. به آقایت برنمی‌خوردم، این موجود نورانی که، بی یاری حقه‌های فراموشی، فقر عاطفی کسانی را که نزدش می‌آیند زندگی می‌کند. نورانی آری، حتی اگر گاه نگاهش اندکی خاموش شود، خود را باز می‌یابد و به جان‌های سیاه‌شده و بدن‌های رهاشده توسط خودخواهی‌هاشان، اندوه‌هاشان و خیال‌های شرم‌آورشان که چنان اصیل می‌پندارند، می‌پردازد. احمق‌ها، آن رذل‌ها. همتایان من. به تو دل بستم، اما محبت قوی‌ترم به اوست.
شما را دوست دارم اما چیزی بیش از داشتن این امتیاز عظیم نمی‌خواهم، بهتر شدن با مراقبت از هر دوی شما؛ این خود بسیار است. برای بقیهٔ وقتی که خارج از زمانی می‌ماند که «به اندازه‌ای که زمان می‌گذرد» دوام می‌آورد و تنها به شما تعلق دارد، این خود بسیار است.

منی‌پنیس، یک قصهٔ پریان به همین سادگی است، همیشه کمی پیچ‌خورده، کمی منحرف... روایت موقعیتی ناممکن تا حدی که غیرقابل انکار شود، رسواکننده تا حدی که نمونه شود. بی‌عدالتی ناپسندی است تا حدی که آموزنده شود و انتقالش ضروری. قصهٔ پریان ژانری است که حقیقت را از دروغ، عدل را از تقصیر بیرون می‌کشد، شیوه‌ای است برای راندن داستان به اجبار به سوی اخلاقش، و اینجا به سوی اخلاق ما. این اخلاق نه به زیبای خفته که به جنگل‌های زیبای پرداخت‌کننده خطاب می‌کند، پس آن را با من بنویس: «حتی اگر بااستعداد، آماده، خواسته‌شده، وسوسه‌شده، کنجکاو، جاه‌طلب، مجبور، داوطلب، مطمئن، هیجان‌زده باشید... هرگز این راه را در پیش نگیرید، حتی یک قدم در آن نگذارید: هرگز پایان خوشی منتظرش نخواهید بود!»

اما چون شما در راهید، هرگز رؤیاهایی را که شما را به اینجا کشانده‌اند رها نکنید زیرا قهرمانان ما مدت‌ها زیستند، عاشق، شادمان و سگ‌ها و گربه‌های فراوان و حتماً چند معشوق داشتند.

♥ وفادار تو که بدون ساده‌لوحی و بدون امیدهای بی‌جا، بدون انحصار و بدون الزام به شما تعلق دارد.`,
    KO: `머니페니스,                                                    크리스마스 2023

너와 너의 주인, 너를 짊어진 이 몸과 너희 둘을 데려가는 정신, 너희는 하나다... 깊은 곳에서 나는 늘 그것을 알고 있었다. 그리고 내가 감히 너에게 사랑한다고 말한다면, 너에게, 그것은 내가 그를 사랑하면서 그에게 그것을 말할 용기가 없기 때문이다.

나는 이 서신 왕래를 완전히 지어냈다, 그가 비웃을까 두려워서도, 그가 그것을 악용할까 두려워서도 아니라, 그가 도망치는 것을 보지 않기 위해, 혹은 더 나쁘게... 무관심해지는 것을 보지 않기 위해서였다. 이제 나는 안다, 모든 것을 쓴 것은 정말로 나였다. 그 모든 메시지들, 나의 모든 편지들, 우리의 휴가와 놀이 동안 찍힌, 우리의 일상에서 훔쳐낸 너의 이 초상들 위에 그 말들을 올린 것은 나였다... 증거를 가지고 있음에도, 거기, 내 눈앞에, 나는 이미 너에게서 편지를 받아쓰게 한 것이 너였다고 믿게 된다. 사랑은 때때로 이상한 병이다.

선택된 것이라 할지라도, 너희의 삶은 힘들다, 규율과 고독의 삶... 희생의 삶, 사제직이라기보다는 갈보리.
브라상스의 노래 «기쁨의 딸들의 한탄»이 머리에 맴돈다, 바르바라가 매우 개인적인 버전으로 불렀다: « 저 부르주아 암소들이, 저 부르주아 암소들이, 우리를 기쁨의 딸들이라 부르네, 우리를 기쁨의 딸들이라 부르네! 매일 웃을 수 있는 건 아냐, 말, 말, 매일 웃을 수 있는 건 아냐... 돈, 우리가 훔친다고 생각 말아라! »

머니페니스, 나의 천사여, 도둑은 지불하는 자다. 그러나 만일 내가 이 슬픈 범죄자가, 이 위로받지 못한 홀아비가, 여전히 자신을 위해 어떤 핑계를 찾는 이 비참한 자가 아니었다면, 나는 너희를 알지 못했으리.

그의 홀로 있는 접시 앞에서 내 마음이 부서지지 않았으리, 그의 유일한 잔을 바라보며 눈물에 빠진 내 눈도. 그의 엄격한 외로운 최소한.
그의 곁에서, 또 다른 노래가 내 삶에 침투한다: « 붉은 옷을 입은 남자 », 다시 바르바라... 가수의 아편 중독자 연인처럼, 그것은 너희가 더 이상 아무것도 입지 않을 때 너희를 입히는 그 향수다. 먼로는 샤넬 N°5를 입고 아무것도 입지 않은 채로 잘 잤다.
내가 이 비열한 범법자가 아니었다면, 나는 그의 강철 같은 규율에, 잘하려는 그의 의지에 감동하지 않았으리... 자신의 고독이 자신을 무한한 현기증, 정신의 허무로의 추락에 내맡기게 하지 않으려는 그의 자신에 대한 요구에. 나는 너의 주인을, 망각의 인공물 없이 자신에게 다가오는 이들의 정서적 비참을 살아내는 이 빛나는 존재를 만나지 못했으리. 빛나는, 그렇다, 비록 때로 그의 시선이 약간 흐려지더라도, 그는 스스로를 되찾고 그들 자신의 이기심에, 그들의 슬픔과 그들이 그토록 독창적이라 상상하는 부끄러운 환상들에 의해 검어진 영혼들과 버려진 몸들을 돌본다. 그 바보들, 그 개자식들. 나의 동족들. 나는 너에게 사랑에 빠졌다, 그러나 나의 가장 강한 애정은 그에게로 향한다.
나는 너희를 사랑하지만 너희 둘을 돌봄으로써 더 나은 사람이 되는 이 거대한 특권을 가지는 것 이상은 원치 않는다; 그것만으로도 이미 많다. « 시간이 흐르는 한 지속되는 » 시간 밖에 남는 나머지 시간, 오직 너희에게만 속하는 그 시간에 대해서는, 이미 많은 것이다.

머니페니스, 동화는 그렇게 간단하다, 늘 약간 비틀어진, 약간 도착적인... 부인할 수 없게 될 정도로 있을 법하지 않은, 모범적이 될 정도로 추문이 되는 상황의 이야기. 그것은 교훈적이 될 정도로 가증스러운 부당함이고 그 전달이 본질적이다. 동화는 거짓에서 진실을, 잘못에서 정의를 끌어내는 장르이며, 강요된 행진으로 이야기를 그 교훈을 향해, 그리고 여기 우리의 교훈을 향해 이끄는 방식이다. 이 교훈은 잠자는 숲속의 미녀가 아니라 지불하는 아름다운 숲들에게 말한다, 그러니 나와 함께 그것을 써라: « 너희가 재능 있고, 예정되어 있고, 요청받고, 유혹받고, 호기심 많고, 야심 차고, 강요받고, 자발적이고, 자신감 있고, 흥분되어 있더라도... 결코 이 길을 가지 말라, 한 발도 그것에 들이지 말라: 결코 기다릴 행복한 결말은 없다! »

그러나 너희가 이미 길 위에 있으니, 너희를 그곳으로 이끈 꿈들을 결코 버리지 말라 왜냐하면 우리의 영웅들은 오래 살았고, 사랑했고, 행복했으며 많은 개들, 고양이들 그리고 분명 몇몇 연인들을 가졌으니.

순진함도, 잘못 놓인 희망도, 배타성도, 의무도 없이 너희에게 속한 너의 충실한 ♥.`,
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
  const [isLandscape,setIsLandscape]=useState(false);
  const imgRef=useRef(null);

  useEffect(()=>{
    const check=()=>{
      if(typeof window==="undefined") return;
      setIsLandscape(window.innerWidth>window.innerHeight);
    };
    check();
    window.addEventListener("resize",check);
    window.addEventListener("orientationchange",check);
    return()=>{
      window.removeEventListener("resize",check);
      window.removeEventListener("orientationchange",check);
    };
  },[]);

  const handleImgClick=(e)=>{
    e.stopPropagation();
    if(!imgRef.current) return;
    const r=imgRef.current.getBoundingClientRect();
    if(zoomed){setZoomed(false);}
    else{setZPos({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100});setZoomed(true);}
  };

  const txt = TEXTS[p.num]?.[lang] || TEXTS[p.num]?.EN || TEXTS[p.num]?.FR || null;
  // En paysage + tapuscrit visible : tapuscrit à GAUCHE, image à droite (row layout)
  // En portrait + tapuscrit visible : tapuscrit en HAUT, image en dessous (column layout, comme avant)
  const textBesideImage = isLandscape && showText && txt;

  return(
    <div style={{position:"fixed",inset:0,height:"100dvh",
      background:"rgba(255,255,255,0.98)",zIndex:9000,
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

      {/* Content : column par défaut, row si paysage + tapuscrit */}
      <div style={{flex:1,overflow:"hidden",display:"flex",
        flexDirection:textBesideImage?"row":"column",minHeight:0,minWidth:0}}
        onClick={e=>e.stopPropagation()}>

        {/* Text panel — adapté selon orientation */}
        {showText&&txt&&(
          <div style={textBesideImage
            ? {background:"#ffffff",borderRight:"1px solid #0a1228",
               padding:"14px 18px",width:"30%",maxWidth:320,minWidth:200,
               height:"100%",overflowY:"auto",flexShrink:0}
            : {background:"#ffffff",borderBottom:"1px solid #0a1228",
               padding:"14px 18px",maxHeight:"18vh",overflowY:"auto",flexShrink:0}}>
            <pre style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:11,
              color:"#0a1228",lineHeight:1.9,whiteSpace:"pre-wrap",margin:0}}>{txt}</pre>
          </div>
        )}

        {/* Image */}
        <div ref={imgRef} onClick={handleImgClick}
          style={{flex:1,overflow:"hidden",cursor:zoomed?"zoom-out":"zoom-in",
            background:"#ffffff",position:"relative",minHeight:0,minWidth:0}}>
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
const FORMSPREE_ID = "mlgzkqvo";
const FORMSPREE_URL = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : "";

// Pays courants (top 30 — peut être étendu)
const COUNTRIES = [
  "France","Belgique","Suisse","Luxembourg","Monaco","Canada","Allemagne","Italie",
  "Espagne","Portugal","Pays-Bas","Royaume-Uni","Irlande","Autriche","Pologne","Lituanie",
  "Brésil","États-Unis","Mexique","Argentine","Japon","Chine","Corée du Sud","Taïwan",
  "Singapour","Australie","Nouvelle-Zélande","Émirats arabes unis","Maroc","Sénégal"
];

// ─── Formulaire de contact SIMPLE (menu Contact) ─────────────────────────────
// Différent du formulaire shop : pas de grille produit, sujet libre (radio).
function SimpleContactForm({t,lang}){
  const[d,setD]=useState({
    nom:"",prenom:"",email:"",phone:"",country:"",
    subj:"projet",msg:"",consent:false,langPref:lang
  });
  const[result,setResult]=useState(null);
  const[sending,setSending]=useState(false);
  const set=(k,v)=>setD(s=>({...s,[k]:v}));

  const subjLabel=(k)=>{
    if(k==="projet") return t.ctSubjProj||"Le projet";
    if(k==="artistes") return t.ctSubjArt||"Les artistes";
    if(k==="autre") return t.ctSubjOther||"Autre question";
    return k;
  };

  const buildSummary=()=>{
    const dt=new Date().toLocaleString("fr-FR",{
      day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    const lignes=[`Contact — ${dt}`,"",
      "── Coordonnées ──",
      `Nom : ${d.nom}`,
      `Prénom : ${d.prenom}`,
      `Email : ${d.email}`,
      `Téléphone : ${d.phone||"(non renseigné)"}`,
      `Pays : ${d.country||"(non renseigné)"}`,
      `Langue de réponse : ${d.langPref}`,
      "",
      "── Sujet ──",
      subjLabel(d.subj),
      "",
      "── Message ──",
      d.msg||"(aucun)"];
    return lignes.join("\n");
  };

  const valid=d.nom.trim()&&d.prenom.trim()&&d.email.trim()&&d.consent&&d.msg.length<=2000;

  const onSubmit=async(e)=>{
    e.preventDefault();
    if(!valid||sending) return;
    setSending(true);
    const summary=buildSummary();
    if(FORMSPREE_ID){
      try{
        const resp=await fetch(`https://formspree.io/f/${FORMSPREE_ID}`,{
          method:"POST",
          headers:{"Content-Type":"application/json","Accept":"application/json"},
          body:JSON.stringify({
            _subject:`Contact — ${d.nom} ${d.prenom} (${subjLabel(d.subj)})`,
            _replyto:d.email,
            nom:d.nom,prenom:d.prenom,email:d.email,phone:d.phone,
            country:d.country,langPref:d.langPref,sujet:subjLabel(d.subj),
            message:d.msg,resume:summary,
          }),
        });
        setSending(false);
        if(resp.ok){ setResult("ok"); } else { setResult("err"); }
        return;
      }catch(err){
        setSending(false); setResult("err"); return;
      }
    }
    setSending(false);
    const href=`mailto:smoreu@mac.com?subject=${encodeURIComponent(`Contact — ${d.nom} ${d.prenom}`)}&body=${encodeURIComponent(summary)}`;
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
          fontSize:18,color:"#0a1228",lineHeight:1.6}}>{t.fSent}</p>
      </div>
    );
  }

  return(
    <form onSubmit={onSubmit} style={{textAlign:"left"}}>
      {/* Coordonnées */}
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
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
        <select value={d.country} onChange={e=>set("country",e.target.value)} style={inp}>
          <option value="">{t.fCountry} —</option>
          {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={d.langPref} onChange={e=>set("langPref",e.target.value)} style={inp}>
          {Object.keys(T).map(l=><option key={l} value={l}>{t.fLangPref} : {l}</option>)}
        </select>
      </div>

      {/* Sujet (radio) */}
      <p style={lbl}>{t.ctSubj||"Sujet de votre message"}</p>
      <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:22}}>
        {["projet","artistes","autre"].map(s=>(
          <label key={s} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,
            cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
            <input type="radio" name="ctsubj" value={s} checked={d.subj===s}
              onChange={()=>set("subj",s)} style={{accentColor:"#0a1228"}}/>
            {subjLabel(s)}
          </label>
        ))}
      </div>

      {/* Message */}
      <p style={lbl}>{t.n3}</p>
      <textarea value={d.msg} onChange={e=>set("msg",e.target.value.slice(0,2000))}
        placeholder={t.fMsgPh} rows={6} maxLength={2000}
        style={{...inp,resize:"vertical",marginBottom:6}} required/>
      <p style={{fontSize:10,color:"#0a1228",opacity:.6,textAlign:"right",marginBottom:18,
        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
        {d.msg.length} / 2000
      </p>

      {/* RGPD */}
      <div style={{padding:"14px 16px",border:"1px solid #0a1228",marginBottom:16}}>
        <p style={{color:"#0a1228",fontSize:11,lineHeight:1.7,marginBottom:10,
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
          Les informations recueillies sont destinées à Sébastien Moreu et André Vaszkievicz, responsables du traitement, dans le seul but de répondre à votre demande et, le cas échéant, de vous informer de l'évolution de leurs projets. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à <strong>smoreu@mac.com</strong>.
        </p>
        <label style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:11,
          color:"#0a1228",fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,
          lineHeight:1.5,cursor:"pointer"}}>
          <input type="checkbox" checked={d.consent} onChange={e=>set("consent",e.target.checked)}
            style={{marginTop:3,accentColor:"#0a1228"}} required/>
          <span>{t.fConsent}</span>
        </label>
      </div>

      {result==="err"&&(
        <p style={{color:"#0a1228",fontSize:12,marginBottom:14,
          fontFamily:"'Space Grotesk',sans-serif",fontWeight:500}}>{t.fError}</p>
      )}

      <div style={{textAlign:"center"}}>
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

function ContactForm({t,lang,d,setD,matrix,setMatrix,result,setResult,onContinue,onSuccess}){
  const[sending,setSending]=useState(false);

  const set=(k,v)=>setD(s=>({...s,[k]:v}));
  const tog=(o,r)=>setMatrix(m=>({...m,[`${o}|${r}`]:!m[`${o}|${r}`]}));

  // Format clé matrix : `${format}_${oId}|${requestKey}`
  // format ∈ {pf, gf}, oId ∈ {port, I, II, ..., XI}, requestKey ∈ REQUEST_KEYS
  const requestLabel=(k)=>{
    if(k==="rqInfo") return t.rqInfo2||t.rqInfo||"Informations générales";
    if(k==="rqAcq") return t.rqAcq||"Disponibilité & acquisition";
    if(k==="rqPro") return t.rqPro2||t.rqPro||"Professionnel · Revendeurs";
    if(k==="rqPress") return t.rqPress||"Presse";
    if(k==="rqOther") return t.rqOther2||t.rqOther||"Divers";
    return k;
  };

  // Icônes SVG sobres (navy)
  const IconBox=({sz=18})=>(
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{display:"inline-block",verticalAlign:"middle"}}>
      <rect x="3" y="6" width="18" height="14"/>
      <path d="M3 10 L21 10"/>
      <path d="M9 6 L9 4 L15 4 L15 6"/>
    </svg>
  );
  const IconPrint=({sz=18})=>(
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{display:"inline-block",verticalAlign:"middle"}}>
      <rect x="4" y="3" width="16" height="18"/>
      <path d="M7 9 L17 9 M7 13 L17 13 M7 17 L13 17"/>
    </svg>
  );

  // Récap résumé envoyé à smoreu@mac.com
  const buildSummary=()=>{
    const dt=new Date().toLocaleString("fr-FR",{
      day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    const lignes=[`Demande Shop — ${dt}`,"",
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
    // Parcourt PF puis GF
    EDS.forEach(ed=>{
      const fmtName=ed.key==="pf"?"Petit Format (30×40)":"Grand Format (50×70)";
      const items=[];
      // Portfolio d'abord
      const portTypes=REQUEST_KEYS.filter(r=>matrix[`${ed.key}_port|${r}`]).map(r=>requestLabel(r));
      if(portTypes.length) items.push(`Portfolio : ${portTypes.join(", ")}`);
      // Puis les planches I à XI
      PRINTS.forEach(p=>{
        const types=REQUEST_KEYS.filter(r=>matrix[`${ed.key}_${p.num}|${r}`]).map(r=>requestLabel(r));
        if(types.length) items.push(`Planche ${p.num} : ${types.join(", ")}`);
      });
      if(items.length){
        lignes.push(`▸ ${fmtName}`);
        items.forEach(it=>lignes.push(`  • ${it}`));
      }
    });
    const anyChecked=Object.values(matrix).some(v=>v);
    if(!anyChecked) lignes.push("(Aucun produit sélectionné)");
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

      {/* Section 3 : Pour chaque format, en-tête + grille [Portfolio + planches I-XI] × types */}
      <p style={lbl}>{t.fMatrix}</p>
      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:11,
        color:"#0a1228",opacity:.7,marginBottom:14}}>{t.fMatrixHint}</p>

      {EDS.map((ed,edi)=>{
        const isP=ed.key==="pf";
        const fmtLabel=isP?(t.shopFmtPF||"Petit Format · 30 × 40 cm"):(t.shopFmtGF||"Grand Format · 50 × 70 cm");
        const av=ed.avail;
        const availPortTxt=(t.availPort||"Numéros %F% à %T% sur %N%")
          .replace("%F%",av.portFrom).replace("%T%",av.portTo).replace("%N%",av.portTot);
        const availSingTxt=(t.availSingle||"Issues des portfolios %F% à %T% sur %N%")
          .replace("%F%",av.singleFrom).replace("%T%",av.singleTo).replace("%N%",av.singleTot);
        return(
          <div key={ed.key} style={{border:"1px solid #0a1228",marginBottom:edi===0?20:24}}>
            {/* En-tête format : titre + prix + dispo */}
            <div style={{background:"#0a1228",color:"#ffffff",padding:"12px 16px"}}>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:11,
                letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>
                {fmtLabel}
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,
                fontFamily:"'Space Grotesk',sans-serif",fontSize:11,lineHeight:1.5}}>
                <div>
                  <p style={{marginBottom:2,opacity:.7,fontSize:9,letterSpacing:1.5,
                    textTransform:"uppercase"}}>
                    <IconBox sz={12}/> Portfolio
                  </p>
                  <p style={{fontWeight:600,fontSize:14,marginBottom:2}}>
                    {ed.pr.port.toLocaleString("fr-FR")} € <span style={{fontSize:10,opacity:.7,fontWeight:400}}>{t.priceUnit||"TTC"}</span>
                  </p>
                  <p style={{opacity:.85,fontSize:10}}>{availPortTxt}</p>
                  <p style={{opacity:.65,fontSize:9,fontStyle:"italic",marginTop:2}}>{t.noChoice||"Numéro attribué automatiquement"}</p>
                </div>
                <div>
                  <p style={{marginBottom:2,opacity:.7,fontSize:9,letterSpacing:1.5,
                    textTransform:"uppercase"}}>
                    <IconPrint sz={12}/> {t.shUn||"Planches à l'unité"}
                  </p>
                  <p style={{fontWeight:600,fontSize:14,marginBottom:2}}>
                    {ed.pr.single} € <span style={{fontSize:10,opacity:.7,fontWeight:400}}>{t.priceUnit||"TTC"} {t.pricePer||"/ planche"}</span>
                  </p>
                  <p style={{opacity:.85,fontSize:10}}>{availSingTxt}</p>
                </div>
              </div>
            </div>

            {/* Tableau : 5 lignes (types) × 12 colonnes (Portfolio + I à XI) */}
            <div style={{overflowX:"auto"}}>
              <table style={{borderCollapse:"collapse",width:"100%",
                fontFamily:"'Space Grotesk',sans-serif",fontSize:10,color:"#0a1228",
                minWidth:680}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #0a1228"}}>
                    <th style={{padding:"10px 10px",textAlign:"left",fontWeight:500,
                      letterSpacing:1,fontSize:9,minWidth:160,background:"#f7f6f3",
                      position:"sticky",left:0,zIndex:1,borderRight:"1px solid #0a1228"}}>
                      &nbsp;
                    </th>
                    {/* Colonne Portfolio en premier */}
                    <th style={{padding:"10px 6px",textAlign:"center",fontWeight:500,
                      letterSpacing:1,fontSize:9,textTransform:"uppercase",
                      background:"#f7f6f3",borderRight:"1px solid #0a1228",minWidth:64}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <IconBox sz={16}/>
                        <span>Portfolio</span>
                      </div>
                    </th>
                    {/* Colonnes planches I à XI */}
                    {PRINTS.map(p=>(
                      <th key={p.id} style={{padding:"10px 4px",textAlign:"center",fontWeight:500,
                        letterSpacing:.5,fontSize:9,background:"#f7f6f3",
                        borderLeft:"1px solid rgba(10,18,40,.15)",minWidth:42}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                          <IconPrint sz={14}/>
                          <span>{p.num}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REQUEST_KEYS.map(rk=>(
                    <tr key={rk} style={{borderTop:"1px solid rgba(10,18,40,.15)"}}>
                      <td style={{padding:"10px 10px",fontWeight:500,
                        background:"#ffffff",position:"sticky",left:0,zIndex:1,
                        borderRight:"1px solid #0a1228",textTransform:"uppercase",
                        letterSpacing:1,fontSize:9,lineHeight:1.3}}>
                        {requestLabel(rk)}
                      </td>
                      {/* Case Portfolio */}
                      <td style={{padding:"6px",textAlign:"center",
                        borderRight:"1px solid #0a1228",background:"#fcfaf6"}}>
                        <input type="checkbox"
                          checked={!!matrix[`${ed.key}_port|${rk}`]}
                          onChange={()=>tog(`${ed.key}_port`,rk)}
                          style={{accentColor:"#0a1228",cursor:"pointer",width:16,height:16}}/>
                      </td>
                      {/* Cases planches I à XI */}
                      {PRINTS.map(p=>(
                        <td key={p.id} style={{padding:"6px",textAlign:"center",
                          borderLeft:"1px solid rgba(10,18,40,.15)"}}>
                          <input type="checkbox"
                            checked={!!matrix[`${ed.key}_${p.num}|${rk}`]}
                            onChange={()=>tog(`${ed.key}_${p.num}`,rk)}
                            style={{accentColor:"#0a1228",cursor:"pointer",width:14,height:14}}/>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

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

function SocialButtons({align="center",size=36}){
  const links=[
    {name:"Instagram",href:"https://www.instagram.com/i.l.y.m_artproject?igsh=MTdtd3l1em5pNWI1aA%3D%3D&utm_source=qr",
     icon:(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
       <rect x="3" y="3" width="18" height="18" rx="5"/>
       <circle cx="12" cy="12" r="4"/>
       <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>
     </svg>)},
    {name:"X",href:"https://x.com/SirMoneypenis",
     icon:(<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
     </svg>)},
    {name:"Threads",href:"https://www.threads.com/@i.l.y.m_artproject",
     icon:(<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
       <path d="M12.18 23.5h-.04C9.16 23.45 6.84 22.55 5.2 20.81 3.7 19.24 2.9 17 2.85 14.16v-.06c.05-2.84.85-5.08 2.35-6.65C6.84 5.71 9.16 4.81 12.14 4.76h.05c2.24.02 4.11.66 5.58 1.92 1.46 1.25 2.42 3.02 2.85 5.27l-1.71.42c-.72-3.75-3.18-5.66-6.74-5.7-2.36.04-4.13.74-5.27 2.07-1.06 1.24-1.61 3.04-1.65 5.34.04 2.3.59 4.1 1.65 5.34 1.14 1.33 2.91 2.03 5.27 2.07 2.13-.03 3.54-.55 4.71-1.71.78-.78 1.5-1.95 1.66-3.5-.58-.32-1.32-.62-2.2-.86-.16 1.59-.65 2.85-1.46 3.74-1.07 1.16-2.6 1.78-4.36 1.81-1.41-.02-2.59-.4-3.42-1.16-.83-.74-1.31-1.79-1.31-2.93 0-1.16.49-2.18 1.43-2.84.93-.66 2.25-1 3.74-.99 1.09.01 2.05.13 2.86.34-.05-.66-.18-1.21-.4-1.6-.32-.55-.86-.87-1.69-.87-.04 0-.07 0-.11.01-.66 0-1.55.16-2.16 1.13l-1.46-.99c.79-1.27 2.16-1.91 3.62-1.94h.16c2.7 0 4.31 1.66 4.55 4.6.13.05.27.11.4.17 1.79.85 3.11 2.13 3.83 3.71l-1.59.74c-.55-1.18-1.43-2.07-2.6-2.69-.21 1.99-1.07 3.5-2.06 4.49-1.46 1.46-3.31 2.16-5.83 2.19z"/>
     </svg>)}
  ];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:align==="right"?"flex-end":align==="left"?"flex-start":"center",gap:8}}>
      {links.map(l=>(
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer"
          title={l.name} aria-label={l.name}
          style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
            width:size,height:size,background:"#0a1228",color:"#ffffff",
            borderRadius:4,textDecoration:"none",transition:"opacity .2s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.75"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          {l.icon}
        </a>
      ))}
    </div>
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
  // Pré-coche la case "Acquisition" du produit choisi
  // productId : "PF" (portfolio petit), "GF" (portfolio grand), ou "I"..."XI" (planche num)
  const openDemandFor=(productId)=>{
    setFormMatrix(m=>{
      const next={...m};
      if(productId==="PF") next[`pf_port|rqAcq`]=true;
      else if(productId==="GF") next[`gf_port|rqAcq`]=true;
      else {
        // Planche I..XI : coche dans les 2 formats (PF et GF) → l'acheteur précise dans le message
        next[`pf_${productId}|rqAcq`]=true;
        next[`gf_${productId}|rqAcq`]=true;
      }
      return next;
    });
    setFormReturn(shopView);
    setShopView("form");
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

  // Direction du document (RTL pour AR/HE/FA, LTR sinon)
  useEffect(()=>{
    if(typeof document==="undefined") return;
    const isRTL=RTL_LANGS.includes(lang);
    document.documentElement.dir=isRTL?"rtl":"ltr";
    document.documentElement.lang=lang;
    return()=>{document.documentElement.dir="ltr";};
  },[lang]);

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
  const NAV=["portfolio","video","coffret","insitu","shop","bio","jeu","contact","accueil","signatures"];
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
        .nb{background:none;border:none;color:#0a1228;
          letter-spacing:0.5px;text-transform:none;cursor:pointer;padding:0;
          text-align:center;transition:opacity .2s;
          font-family:'Libre Baskerville',serif;font-style:italic;
          font-weight:400;display:inline-block;line-height:1.15;
          white-space:normal;}
        .nb.huge{font-size:clamp(36px,7vw,72px);line-height:1.05;font-weight:400;}
        .nb.big {font-size:clamp(20px,3.6vw,36px);}
        .nb.med {font-size:clamp(17px,2.8vw,26px);}
        .nb.sml {font-size:clamp(13px,2vw,19px);}
        .nb.aub {font-size:clamp(32px,5vw,56px);line-height:1;}
        .nb:hover{opacity:0.65;}
        .nb.gr{cursor:default;opacity:0.55;}
        .nb.gr:hover{opacity:0.55;}
        .nb.on{font-weight:700;}
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

        /* État "intro terminée" : fige toutes les animations au dernier frame
           (logo droit, cœur tombé, aubergine tombée) sans flash. */
        .intro-stage.done .intro-wrap,
        .intro-stage.done .intro-heart,
        .intro-stage.done .intro-aub {
          animation-delay: -9.5s !important;
          animation-play-state: paused !important;
        }

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

          {/* Logo central : statique (cliquable) AVANT clic, animé PENDANT, figé final APRÈS */}
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
              {/* Flash subliminal : uniquement PENDANT l'animation, jamais après */}
              {!introDone&&(
                <img className="intro-flash" src={IMG.flash} alt=""
                  draggable={false} onContextMenu={e=>e.preventDefault()}/>
              )}
              <div className={`intro-stage${introDone?" done":""}`}>
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
          <div style={{height:38}}/>
          <h1 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(28px,6.6vw,44px)",color:"#0a1228",marginBottom:6,lineHeight:1.2}}>
            I Love You Moneypenis
          </h1>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:10,
            letterSpacing:3,color:"#0a1228",marginBottom:4,textTransform:"uppercase"}}>
            Sébastien Moreu & André Vaszkievicz · Paris 2024
          </p>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:9,
            letterSpacing:4,color:"#0a1228",marginBottom:42,textTransform:"uppercase"}}>
            {t.aw}
          </p>

          {/* ── Déclaration + boutons · sans cadre, en premier ──────────────── */}
          <div style={{maxWidth:380,width:"100%",marginBottom:46,textAlign:"left",
            padding:"0 4px"}}>
            <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontSize:9.5,
              color:"#0a1228",lineHeight:1.55,marginBottom:10}}>{t.am}</p>

            <label style={{display:"flex",alignItems:"flex-start",gap:8,
              cursor:"pointer",marginBottom:7}}>
              <input type="checkbox" checked={ck1} onChange={e=>setCk1(e.target.checked)}
                style={{marginTop:2,width:13,height:13,accentColor:"#0a1228",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:9.5,color:"#0a1228",lineHeight:1.45}}>{t.ck1}</span>
            </label>

            <label style={{display:"flex",alignItems:"flex-start",gap:8,
              cursor:"pointer",marginBottom:13}}>
              <input type="checkbox" checked={ck2} onChange={e=>setCk2(e.target.checked)}
                style={{marginTop:2,width:13,height:13,accentColor:"#0a1228",
                  flexShrink:0,cursor:"pointer"}}/>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                fontSize:9.5,color:"#0a1228",lineHeight:1.45}}>{t.ck2}</span>
            </label>

            <div style={{display:"flex",flexDirection:"row",gap:8}}>
              <button className="bs"
                style={{flex:1,opacity:ck1&&ck2?1:0.35,transition:"opacity .2s",
                  cursor:ck1&&ck2?"pointer":"not-allowed",padding:"9px 10px",fontSize:9,
                  letterSpacing:1.4,lineHeight:1.3}}
                onClick={()=>{if(ck1&&ck2){setAgeOk(true);setDis(true);setMenuOpen(true);}}}>
                {t.ap}
              </button>
              <button className="bg"
                style={{flex:1,padding:"9px 10px",fontSize:9,
                  letterSpacing:1.4,lineHeight:1.3}}
                onClick={()=>{setAgeOk(false);setDis(true);setMenuOpen(true);}}>
                {t.am2}
              </button>
            </div>
          </div>

          {/* ── Note des auteurs · sans cadre, intégrale, après les boutons ─── */}
          <div style={{maxWidth:520,width:"100%",marginBottom:18,textAlign:"left",
            padding:"0 4px"}}>
            {(()=>{
              const AUTH={FR:"Les Auteurs",EN:"The Authors",ES:"Los Autores",
                PT:"Os Autores",IT:"Gli Autori",DE:"Die Autoren",
                EL:"Οι Δημιουργοί",TR:"Yazarlar",RU:"Авторы",PL:"Autorzy",
                NL:"De Auteurs",UK:"Автори",LT:"Autoriai",KO:"작가들",
                "中":"作者们","日":"作者たち",AR:"المؤلفان",HE:"המחברים",FA:"نویسندگان"};
              const a=AUTH[lang]||"";
              return t.naf.split("\n\n").map((para,j)=>{
                const idx=(j===0&&a)?para.indexOf(a):-1;
                return(
                  <p key={j} style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                    fontSize:11,color:"#0a1228",lineHeight:1.7,marginBottom:9}}>
                    {idx>=0?(<>{para.slice(0,idx)}<strong style={{fontWeight:700}}>{a}</strong>{para.slice(idx+a.length)}</>):para}
                  </p>
                );
              });
            })()}
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

            {/* Réseaux sociaux */}
            <div style={{marginRight:4}}>
              <SocialButtons size={26}/>
            </div>

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

      {/* ══ MENU OVERLAY (nuage organique) ════════════════════════════════════ */}
      {menuOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:790,
          background:"rgba(255,255,255,0.98)",backdropFilter:"blur(20px)",
          paddingTop:"calc(52px + env(safe-area-inset-top,0px))",
          paddingBottom:"env(safe-area-inset-bottom,16px)"}}
          onClick={()=>setMenuOpen(false)}>
          <div style={{position:"relative",width:"100%",height:"100%"}}>
            {(() => {
              const items=[
                {sk:"bio",        side:"left",  pos:8,  top:8,  size:"big",  fsOver:"clamp(22px,4.3vw,42px)", maxW:"60vw", label: t.nav[5]||"De jolies plumes vraiment…"},
                {sk:"coffret",    side:"right", pos:11, top:15, size:"sml",                                   maxW:"42vw", label: t.nav[2]||"Les précieux coffrets"},
                {sk:"contact",    side:"left",  pos:14, top:23, size:"sml",  fsOver:"clamp(12px,1.8vw,17px)", maxW:"40vw", label: t.nav[7]||"I love you too"},
                {sk:"shop",       side:"right", pos:15, top:30, size:"big",                                   maxW:"54vw", label: t.nav[4]||"Le prix des aubergines"},
                {sk:"jeu",        side:"left",  pos:20, top:45, size:"aub",  fsOver:"clamp(48px,8.5vw,100px)",maxW:"30vw", label:"🍆"},
                {sk:"portfolio",  side:"center",         top:56, size:"huge",                                 maxW:"86vw", label: t.nav[0]||"I Love You Moneypenis", twoLine:true},
                {sk:"insitu",     side:"right", pos:19, top:69, size:"sml",  fsOver:"clamp(16px,2.6vw,24px)", maxW:"46vw", label: t.nav[3]||"In Situ aimes ça"},
                {sk:"signatures", side:"left",  pos:17, top:77, size:"sml",                                   maxW:"50vw", label: t.nav[9]||"Des feutres et des mains"},
                {sk:"video",      side:"right", pos:15, top:84, size:"big",  fsOver:"clamp(18px,3.2vw,30px)", maxW:"54vw", label: t.nav[1]||"Le Clip Teaser"},
                {sk:"presse",     side:"center",         top:91, size:"sml",                                  maxW:"82vw", label: t.navPresse||"Trop d'honneurs pour peu de chair", url:"https://catalogue.bnf.fr/rechercher.do?motRecherche=I+love+you+moneypenis&critereRecherche=0&depart=0&facetteModifiee=ok"},
                {sk:"accueil",    side:"right", pos:11, top:96, size:"med",                                   maxW:"55vw", label: t.nav[8]||"Ici tout recommence"},
              ];
              return items.map(item=>{
                const styleObj={position:"absolute", top:`${item.top}%`, padding:"4px 8px", maxWidth:`min(${item.maxW}, 540px)`};
                if(item.side==="left"){
                  styleObj.left=`${item.pos}%`;
                  styleObj.transform="translateY(-50%)";
                  styleObj.textAlign="left";
                }else if(item.side==="right"){
                  styleObj.right=`${item.pos}%`;
                  styleObj.transform="translateY(-50%)";
                  styleObj.textAlign="right";
                }else{
                  styleObj.left="50%";
                  styleObj.transform="translate(-50%, -50%)";
                  styleObj.textAlign="center";
                }
                if(item.fsOver) styleObj.fontSize=item.fsOver;
                return (
                  <button key={item.sk}
                    className={`nb ${item.size}${item.disabled?" gr":""}${sec===item.sk?" on":""}`}
                    style={styleObj}
                    onClick={(e)=>{
                      e.stopPropagation();
                      if(item.disabled) return;
                      if(item.url){
                        window.open(item.url,"_blank","noopener,noreferrer");
                        setMenuOpen(false);
                        return;
                      }
                      if(item.sk==="accueil"){
                        setStarted(false);
                        setDis(false);
                        setSec("portfolio");
                        setMenuOpen(false);
                        setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),50);
                        return;
                      }
                      goSec(item.sk);
                    }}>
                    {item.twoLine&&item.sk==="portfolio" ? (
                      <span style={{display:"inline-block"}}>
                        <span style={{display:"block",lineHeight:1.04,textAlign:"left"}}>I&nbsp;Love&nbsp;You</span>
                        <span style={{display:"block",lineHeight:1.04,paddingLeft:"22%"}}>Moneypenis</span>
                      </span>
                    ) : item.label}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      )}

      <div style={{paddingTop:"calc(52px + env(safe-area-inset-top,0px))"}}>

      {/* ══ PORTFOLIO ════════════════════════════════════════════════════════ */}
      {sec==="portfolio"&&(<>
        <div style={{maxWidth:860,margin:"60px auto 40px",padding:"0 20px",textAlign:"center"}}>
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
            maxWidth:460,margin:"0 auto",fontWeight:400}}>{t.hd}</p>
        </div>

        <div style={{maxWidth:860,margin:"0 auto",padding:"0 14px 70px"}}>

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
          <div style={{position:"relative",textAlign:"center",marginBottom:28}}>
            <button onClick={()=>goSec("portfolio")}
              style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",color:"#0a1228",
                fontSize:18,lineHeight:1,padding:"6px 10px"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)",marginBottom:6}}>{t.nav[1]||t.vt}</h2>
            <p style={{color:"#0a1228",fontSize:11,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              {t.vs}
            </p>
          </div>
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
          <div style={{position:"relative",textAlign:"center",marginBottom:32}}>
            <button onClick={()=>goSec("portfolio")}
              style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"6px 10px"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)",marginBottom:6}}>{t.nav[2]||t.ct}</h2>
            <div style={{color:"#0a1228",fontSize:12,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              {t.cs}
            </div>
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
          <div style={{position:"relative",textAlign:"center",marginBottom:32}}>
            <button onClick={()=>goSec("portfolio")}
              style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"6px 10px"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)",marginBottom:6}}>{t.nav[3]||t.zt}</h2>
            <p style={{color:"#0a1228",fontSize:12,letterSpacing:1,
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              {t.zs}
            </p>
          </div>
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
                  marginBottom:18}}>{t.nav[4]||t.st}</h1>
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
                    <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,marginBottom:8,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.shPfD}
                    </p>
                    <p style={{color:"#0a1228",fontSize:14,fontWeight:600,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif"}}>
                      {EDS[0].pr.port.toLocaleString("fr-FR")} € <span style={{fontSize:10,fontWeight:400,opacity:.7}}>{t.priceUnit||"TTC"}</span> <span style={{fontSize:10,fontWeight:400,opacity:.5}}>· {EDS[0].pr.single} € {t.pricePer||"/ planche"}</span>
                    </p>
                    <p style={{color:"#0a1228",fontSize:10,opacity:.7,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {(t.availPort||"Numéros %F% à %T% sur %N%").replace("%F%",EDS[0].avail.portFrom).replace("%T%",EDS[0].avail.portTo).replace("%N%",EDS[0].avail.portTot)} <span style={{fontWeight:600}}>*</span>
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
                    <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,marginBottom:8,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.shGfD}
                    </p>
                    <p style={{color:"#0a1228",fontSize:14,fontWeight:600,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif"}}>
                      {EDS[1].pr.port.toLocaleString("fr-FR")} € <span style={{fontSize:10,fontWeight:400,opacity:.7}}>{t.priceUnit||"TTC"}</span> <span style={{fontSize:10,fontWeight:400,opacity:.5}}>· {EDS[1].pr.single} € {t.pricePer||"/ planche"}</span>
                    </p>
                    <p style={{color:"#0a1228",fontSize:10,opacity:.7,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {(t.availPort||"Numéros %F% à %T% sur %N%").replace("%F%",EDS[1].avail.portFrom).replace("%T%",EDS[1].avail.portTo).replace("%N%",EDS[1].avail.portTot)} <span style={{fontWeight:600}}>*</span>
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
                    <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,marginBottom:8,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      {t.shUnD}
                    </p>
                    <p style={{color:"#0a1228",fontSize:13,fontWeight:600,marginBottom:4,
                      fontFamily:"'Space Grotesk',sans-serif"}}>
                      {EDS[0].pr.single} € <span style={{fontSize:10,fontWeight:400,opacity:.7}}>PF</span> · {EDS[1].pr.single} € <span style={{fontSize:10,fontWeight:400,opacity:.7}}>GF</span> <span style={{fontSize:10,fontWeight:400,opacity:.5}}>{t.priceUnit||"TTC"} {t.pricePer||"/ planche"}</span>
                    </p>
                    <p style={{color:"#0a1228",fontSize:10,opacity:.7,lineHeight:1.5,
                      fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                      PF : {(t.availSingle||"Issues des portfolios %F% à %T% sur %N%").replace("%F%",EDS[0].avail.singleFrom).replace("%T%",EDS[0].avail.singleTo).replace("%N%",EDS[0].avail.singleTot)}<br/>
                      GF : {(t.availSingle||"Issues des portfolios %F% à %T% sur %N%").replace("%F%",EDS[1].avail.singleFrom).replace("%T%",EDS[1].avail.singleTo).replace("%N%",EDS[1].avail.singleTot)}
                    </p>
                  </div>
                </div>

                {/* Mention bas : tarifs + conditions pro */}
                <div style={{textAlign:"center",padding:"40px 0 0",maxWidth:520,margin:"0 auto"}}>
                  <p style={{color:"#0a1228",fontSize:9,opacity:.55,marginBottom:14,
                    fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontStyle:"italic",
                    lineHeight:1.6}}>
                    {t.nextWaves||"* Prix exceptionnel de lancement, jusqu'à épuisement. Vagues suivantes : PF n°31 à 40 à 700 € · GF n°6 à 10 à 1 300 € l'exemplaire."}
                  </p>
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
                    ← {t.nav[4]||t.st}
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
                      {/* Prix portfolio */}
                      <p style={{color:"#0a1228",fontSize:22,fontWeight:600,marginBottom:6,
                        fontFamily:"'Space Grotesk',sans-serif"}}>
                        {(isP?EDS[0].pr.port:EDS[1].pr.port).toLocaleString("fr-FR")} €
                        <span style={{fontSize:11,fontWeight:400,opacity:.7,marginLeft:6}}>{t.priceUnit||"TTC"}</span>
                      </p>
                      {/* Dispo + note attribution */}
                      <p style={{color:"#0a1228",fontSize:12,lineHeight:1.6,marginBottom:4,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                        {(t.availPort||"Numéros %F% à %T% sur %N%")
                          .replace("%F%",isP?EDS[0].avail.portFrom:EDS[1].avail.portFrom)
                          .replace("%T%",isP?EDS[0].avail.portTo:EDS[1].avail.portTo)
                          .replace("%N%",isP?EDS[0].avail.portTot:EDS[1].avail.portTot)}
                      </p>
                      <p style={{color:"#0a1228",fontSize:10,lineHeight:1.5,marginBottom:14,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,fontStyle:"italic",opacity:.7}}>
                        {t.noChoice||"Numéro attribué automatiquement"}
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
                  ← {t.nav[4]||t.st}
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
                      <p style={{color:"#0a1228",fontSize:13,lineHeight:1.8,marginBottom:18,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,whiteSpace:"pre-line"}}>
                        {t.techs?.[p.id-1]||p.tech}
                      </p>
                      {/* Prix planche (PF + GF disponibles) */}
                      <p style={{color:"#0a1228",fontSize:14,fontWeight:600,marginBottom:4,
                        fontFamily:"'Space Grotesk',sans-serif"}}>
                        {EDS[0].pr.single} € <span style={{fontSize:10,fontWeight:400,opacity:.7}}>PF</span>
                        &nbsp;·&nbsp;
                        {EDS[1].pr.single} € <span style={{fontSize:10,fontWeight:400,opacity:.7}}>GF</span>
                        <span style={{fontSize:10,fontWeight:400,opacity:.5,marginLeft:8}}>{t.priceUnit||"TTC"} {t.pricePer||"/ planche"}</span>
                      </p>
                      <p style={{color:"#0a1228",fontSize:10,opacity:.7,lineHeight:1.5,marginBottom:24,
                        fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                        PF : {(t.availSingle||"Issues des portfolios %F% à %T% sur %N%").replace("%F%",EDS[0].avail.singleFrom).replace("%T%",EDS[0].avail.singleTo).replace("%N%",EDS[0].avail.singleTot)}<br/>
                        GF : {(t.availSingle||"Issues des portfolios %F% à %T% sur %N%").replace("%F%",EDS[1].avail.singleFrom).replace("%T%",EDS[1].avail.singleTo).replace("%N%",EDS[1].avail.singleTot)}
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

            {/* ── VUE : FORMULAIRE DE DEMANDE (grille shop) ───────────── */}
            {shopView==="form"&&(
              <div style={{maxWidth:1100,margin:"50px auto",padding:"0 18px 70px"}}>
                <button onClick={()=>setShopView(formReturn||"list")}
                  style={{background:"none",border:"none",cursor:"pointer",
                    color:"#0a1228",fontSize:10,letterSpacing:3,padding:"0 0 16px",
                    fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                    textTransform:"uppercase"}}>
                  ← {t.nav[4]||t.st}
                </button>
                <div style={{textAlign:"center",marginBottom:28}}>
                  <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                    fontWeight:400,fontSize:"clamp(24px,4vw,36px)",color:"#0a1228",
                    marginBottom:8}}>{t.shopFormTitle||t.req}</h2>
                  <div style={{width:36,height:1,background:"#0a1228",margin:"0 auto 14px"}}/>
                  <p style={{color:"#0a1228",fontSize:12,lineHeight:1.7,maxWidth:520,
                    margin:"0 auto",fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
                    {t.shopFormSubtitle||t.fMatrixHint}
                  </p>
                </div>
                <ContactForm t={t} lang={lang}
                  d={formData} setD={setFormData}
                  matrix={formMatrix} setMatrix={setFormMatrix}
                  result={formResult} setResult={setFormResult}
                  onContinue={()=>setShopView(formReturn||"list")}
                  onSuccess={onFormSuccess}/>
              </div>
            )}
          </>
        ) : (
          /* -18 : pas de shop accessible */
          <div style={{maxWidth:520,margin:"120px auto",padding:"0 24px",textAlign:"center"}}>
            <Logo sz={48}/>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(22px,4vw,34px)",color:"#0a1228",
              marginTop:24,marginBottom:16}}>{t.nav[4]||t.st}</h2>
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

      {/* ══ BIO (biographies seulement, signatures = section séparée) ════════ */}
      {sec==="bio"&&(
        <div style={{maxWidth:1280,margin:"60px auto",padding:"0 18px 70px"}}>
          <div style={{position:"relative",textAlign:"center",marginBottom:40}}>
            <button onClick={()=>goSec("portfolio")}
              style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"6px 10px"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>{t.nav[5]||t.bt}</h2>
          </div>

          {/* 2 bios côte à côte (responsive : 1 col mobile, 2 col desktop) */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",
            gap:48,marginBottom:48}}>
            {[{n:t.sn,b:t.sb2,i:"S.M.",ph:IMG.portrait_sm},
              {n:t.vn,b:t.vb, i:"A.V.",ph:IMG.portrait_av}].map((a,k)=>(
              <div key={k} style={{display:"flex",flexDirection:"column",alignItems:"stretch"}}>
                <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:18}}>
                  <div style={{width:78,height:78,borderRadius:"50%",overflow:"hidden",
                    border:"1px solid #0a1228",flexShrink:0}}>
                    <img src={a.ph} alt={a.n} draggable={false}
                      onContextMenu={e=>e.preventDefault()}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </div>
                  <div>
                    <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
                      fontSize:22,fontWeight:400,lineHeight:1.2,marginBottom:4}}>{a.n}</p>
                    <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
                      fontSize:9,color:"#0a1228",letterSpacing:2}}>{a.i}</p>
                  </div>
                </div>
                <div>
                  {a.b.split("\n\n").map((para,j)=>(
                    <p key={j} style={{color:"#0a1228",fontSize:14,lineHeight:1.9,fontWeight:400,
                      marginBottom:12}}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Portrait duo centré en bas */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",
            paddingTop:24,borderTop:"1px solid #0a1228"}}>
            <div style={{width:110,height:110,borderRadius:"50%",overflow:"hidden",
              border:"1px solid #0a1228",marginTop:24}}>
              <img src={IMG.portrait_duo} alt="Sébastien & André" draggable={false}
                onContextMenu={e=>e.preventDefault()}
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </div>
            <p style={{textAlign:"center",fontFamily:"'Space Grotesk',sans-serif",
              fontWeight:400,fontSize:9,color:"#0a1228",letterSpacing:2,marginTop:12,
              fontStyle:"italic"}}>
              S.M. & A.V.
            </p>
          </div>
        </div>
      )}

      {/* ══ SIGNATURES (photos séance signature seulement) ═══════════════════ */}
      {sec==="signatures"&&(
        <div style={{maxWidth:1140,margin:"60px auto",padding:"0 14px 70px"}}>
          <div style={{position:"relative",textAlign:"center",marginBottom:20}}>
            <button onClick={()=>goSec("portfolio")}
              style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",
                color:"#0a1228",fontSize:18,lineHeight:1,padding:"6px 10px"}}>←</button>
            <h2 style={{fontFamily:"'Libre Baskerville',serif",fontStyle:"italic",
              fontWeight:400,fontSize:"clamp(20px,4vw,38px)"}}>
              {t.nav[9]||"Des feutres et des mains"}
            </h2>
          </div>
          <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:400,
            fontSize:11,letterSpacing:2,color:"#0a1228",marginBottom:30,
            textTransform:"uppercase"}}>
            Séance de signature · Paris · 2024
          </p>
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
              marginTop:18,marginBottom:8}}>{t.nav[7]||t.nt}</h2>
            <div style={{width:36,height:1,background:"#0a1228",margin:"0 auto 18px"}}/>
            <p style={{color:"#0a1228",fontSize:13,lineHeight:1.7,maxWidth:520,margin:"0 auto",
              fontFamily:"'Space Grotesk',sans-serif",fontWeight:400}}>
              {t.ctSubtitle||"Une question sur le projet, sur les artistes, ou autre — écrivez-nous, nous vous répondrons."}
            </p>

            {/* Liens réseaux sociaux */}
            <div style={{marginTop:24,display:"flex",justifyContent:"center"}}>
              <SocialButtons size={36}/>
            </div>
          </div>
          <SimpleContactForm t={t} lang={lang}/>
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
