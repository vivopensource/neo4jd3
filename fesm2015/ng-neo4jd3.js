import { Injectable, ɵɵdefineInjectable, Component, NgModule } from '@angular/core';
import { select, forceSimulation, forceCollide, forceManyBody, forceLink, forceCenter, zoom, event, drag, rgb, json } from 'd3';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgNeo4jD3Icons {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.options = options;
        this.options.iconMap = this.fontAwesomeIcons();
    }
    /**
     * @return {?}
     */
    fontAwesomeIcons() {
        return { 'glass': 'f000', 'music': 'f001', 'search': 'f002', 'envelope-o': 'f003', 'heart': 'f004', 'star': 'f005',
            'star-o': 'f006', 'user': 'f007', 'film': 'f008', 'th-large': 'f009', 'th': 'f00a', 'th-list': 'f00b', 'check': 'f00c',
            'remove,close,times': 'f00d', 'search-plus': 'f00e', 'search-minus': 'f010', 'power-off': 'f011', 'signal': 'f012',
            'gear,cog': 'f013', 'trash-o': 'f014', 'home': 'f015', 'file-o': 'f016', 'clock-o': 'f017', 'road': 'f018', 'download': 'f019',
            'arrow-circle-o-down': 'f01a', 'arrow-circle-o-up': 'f01b', 'inbox': 'f01c', 'play-circle-o': 'f01d', 'rotate-right,repeat': 'f01e',
            'refresh': 'f021', 'list-alt': 'f022', 'lock': 'f023', 'flag': 'f024', 'headphones': 'f025', 'volume-off': 'f026',
            'volume-down': 'f027', 'volume-up': 'f028', 'qrcode': 'f029', 'barcode': 'f02a', 'tag': 'f02b', 'tags': 'f02c',
            'book': 'f02d', 'bookmark': 'f02e', 'print': 'f02f', 'camera': 'f030', 'font': 'f031', 'bold': 'f032', 'italic': 'f033',
            'text-height': 'f034', 'text-width': 'f035', 'align-left': 'f036', 'align-center': 'f037', 'align-right': 'f038',
            'align-justify': 'f039', 'list': 'f03a', 'dedent,outdent': 'f03b', 'indent': 'f03c', 'video-camera': 'f03d',
            'photo,image,picture-o': 'f03e', 'pencil': 'f040', 'map-marker': 'f041', 'adjust': 'f042', 'tint': 'f043',
            'edit,pencil-square-o': 'f044', 'share-square-o': 'f045', 'check-square-o': 'f046', 'arrows': 'f047',
            'step-backward': 'f048', 'fast-backward': 'f049', 'backward': 'f04a', 'play': 'f04b', 'pause': 'f04c', 'stop': 'f04d',
            'forward': 'f04e', 'fast-forward': 'f050', 'step-forward': 'f051', 'eject': 'f052', 'chevron-left': 'f053',
            'chevron-right': 'f054', 'plus-circle': 'f055', 'minus-circle': 'f056', 'times-circle': 'f057', 'check-circle': 'f058',
            'question-circle': 'f059', 'info-circle': 'f05a', 'crosshairs': 'f05b', 'times-circle-o': 'f05c', 'check-circle-o': 'f05d',
            'ban': 'f05e', 'arrow-left': 'f060', 'arrow-right': 'f061', 'arrow-up': 'f062', 'arrow-down': 'f063', 'mail-forward,share': 'f064',
            'expand': 'f065', 'compress': 'f066', 'plus': 'f067', 'minus': 'f068', 'asterisk': 'f069', 'exclamation-circle': 'f06a', 'gift': 'f06b',
            'leaf': 'f06c', 'fire': 'f06d', 'eye': 'f06e', 'eye-slash': 'f070', 'warning,exclamation-triangle': 'f071', 'plane': 'f072',
            'calendar': 'f073', 'random': 'f074', 'comment': 'f075', 'magnet': 'f076', 'chevron-up': 'f077', 'chevron-down': 'f078',
            'retweet': 'f079', 'shopping-cart': 'f07a', 'folder': 'f07b', 'folder-open': 'f07c', 'arrows-v': 'f07d', 'arrows-h': 'f07e',
            'bar-chart-o,bar-chart': 'f080', 'twitter-square': 'f081', 'facebook-square': 'f082', 'camera-retro': 'f083', 'key': 'f084',
            'gears,cogs': 'f085', 'comments': 'f086', 'thumbs-o-up': 'f087', 'thumbs-o-down': 'f088', 'star-half': 'f089', 'heart-o': 'f08a',
            'sign-out': 'f08b', 'linkedin-square': 'f08c', 'thumb-tack': 'f08d', 'external-link': 'f08e', 'sign-in': 'f090', 'trophy': 'f091',
            'github-square': 'f092', 'upload': 'f093', 'lemon-o': 'f094', 'phone': 'f095', 'square-o': 'f096', 'bookmark-o': 'f097',
            'phone-square': 'f098', 'twitter': 'f099', 'facebook-f,facebook': 'f09a', 'github': 'f09b', 'unlock': 'f09c', 'credit-card': 'f09d',
            'feed,rss': 'f09e', 'hdd-o': 'f0a0', 'bullhorn': 'f0a1', 'bell': 'f0f3', 'certificate': 'f0a3', 'hand-o-right': 'f0a4',
            'hand-o-left': 'f0a5', 'hand-o-up': 'f0a6', 'hand-o-down': 'f0a7', 'arrow-circle-left': 'f0a8', 'arrow-circle-right': 'f0a9',
            'arrow-circle-up': 'f0aa', 'arrow-circle-down': 'f0ab', 'globe': 'f0ac', 'wrench': 'f0ad', 'tasks': 'f0ae', 'filter': 'f0b0',
            'briefcase': 'f0b1', 'arrows-alt': 'f0b2', 'group,users': 'f0c0', 'chain,link': 'f0c1', 'cloud': 'f0c2', 'flask': 'f0c3',
            'cut,scissors': 'f0c4', 'copy,files-o': 'f0c5', 'paperclip': 'f0c6', 'save,floppy-o': 'f0c7', 'square': 'f0c8', 'navicon,reorder,bars': 'f0c9',
            'list-ul': 'f0ca', 'list-ol': 'f0cb', 'strikethrough': 'f0cc', 'underline': 'f0cd', 'table': 'f0ce', 'magic': 'f0d0', 'truck': 'f0d1',
            'pinterest': 'f0d2', 'pinterest-square': 'f0d3', 'google-plus-square': 'f0d4', 'google-plus': 'f0d5', 'money': 'f0d6', 'caret-down': 'f0d7',
            'caret-up': 'f0d8', 'caret-left': 'f0d9', 'caret-right': 'f0da', 'columns': 'f0db', 'unsorted,sort': 'f0dc', 'sort-down,sort-desc': 'f0dd',
            'sort-up,sort-asc': 'f0de', 'envelope': 'f0e0', 'linkedin': 'f0e1', 'rotate-left,undo': 'f0e2', 'legal,gavel': 'f0e3',
            'dashboard,tachometer': 'f0e4', 'comment-o': 'f0e5', 'comments-o': 'f0e6', 'flash,bolt': 'f0e7', 'sitemap': 'f0e8', 'umbrella': 'f0e9',
            'paste,clipboard': 'f0ea', 'lightbulb-o': 'f0eb', 'exchange': 'f0ec', 'cloud-download': 'f0ed', 'cloud-upload': 'f0ee', 'user-md': 'f0f0',
            'stethoscope': 'f0f1', 'suitcase': 'f0f2', 'bell-o': 'f0a2', 'coffee': 'f0f4', 'cutlery': 'f0f5', 'file-text-o': 'f0f6', 'building-o': 'f0f7',
            'hospital-o': 'f0f8', 'ambulance': 'f0f9', 'medkit': 'f0fa', 'fighter-jet': 'f0fb', 'beer': 'f0fc', 'h-square': 'f0fd', 'plus-square': 'f0fe',
            'angle-double-left': 'f100', 'angle-double-right': 'f101', 'angle-double-up': 'f102', 'angle-double-down': 'f103', 'angle-left': 'f104',
            'angle-right': 'f105', 'angle-up': 'f106', 'angle-down': 'f107', 'desktop': 'f108', 'laptop': 'f109', 'tablet': 'f10a',
            'mobile-phone,mobile': 'f10b', 'circle-o': 'f10c', 'quote-left': 'f10d', 'quote-right': 'f10e', 'spinner': 'f110', 'circle': 'f111',
            'mail-reply,reply': 'f112', 'github-alt': 'f113', 'folder-o': 'f114', 'folder-open-o': 'f115', 'smile-o': 'f118', 'frown-o': 'f119',
            'meh-o': 'f11a', 'gamepad': 'f11b', 'keyboard-o': 'f11c', 'flag-o': 'f11d', 'flag-checkered': 'f11e', 'terminal': 'f120', 'code': 'f121',
            'mail-reply-all,reply-all': 'f122', 'star-half-empty,star-half-full,star-half-o': 'f123', 'location-arrow': 'f124', 'crop': 'f125',
            'code-fork': 'f126', 'unlink,chain-broken': 'f127', 'question': 'f128', 'info': 'f129', 'exclamation': 'f12a', 'superscript': 'f12b',
            'subscript': 'f12c', 'eraser': 'f12d', 'puzzle-piece': 'f12e', 'microphone': 'f130', 'microphone-slash': 'f131', 'shield': 'f132',
            'calendar-o': 'f133', 'fire-extinguisher': 'f134', 'rocket': 'f135', 'maxcdn': 'f136', 'chevron-circle-left': 'f137',
            'chevron-circle-right': 'f138', 'chevron-circle-up': 'f139', 'chevron-circle-down': 'f13a', 'html5': 'f13b', 'css3': 'f13c',
            'anchor': 'f13d', 'unlock-alt': 'f13e', 'bullseye': 'f140', 'ellipsis-h': 'f141', 'ellipsis-v': 'f142', 'rss-square': 'f143',
            'play-circle': 'f144', 'ticket': 'f145', 'minus-square': 'f146', 'minus-square-o': 'f147', 'level-up': 'f148', 'level-down': 'f149',
            'check-square': 'f14a', 'pencil-square': 'f14b', 'external-link-square': 'f14c', 'share-square': 'f14d', 'compass': 'f14e',
            'toggle-down,caret-square-o-down': 'f150', 'toggle-up,caret-square-o-up': 'f151', 'toggle-right,caret-square-o-right': 'f152',
            'euro,eur': 'f153', 'gbp': 'f154', 'dollar,usd': 'f155', 'rupee,inr': 'f156', 'cny,rmb,yen,jpy': 'f157', 'ruble,rouble,rub': 'f158',
            'won,krw': 'f159', 'bitcoin,btc': 'f15a', 'file': 'f15b', 'file-text': 'f15c', 'sort-alpha-asc': 'f15d', 'sort-alpha-desc': 'f15e',
            'sort-amount-asc': 'f160', 'sort-amount-desc': 'f161', 'sort-numeric-asc': 'f162', 'sort-numeric-desc': 'f163', 'thumbs-up': 'f164',
            'thumbs-down': 'f165', 'youtube-square': 'f166', 'youtube': 'f167', 'xing': 'f168', 'xing-square': 'f169', 'youtube-play': 'f16a',
            'dropbox': 'f16b', 'stack-overflow': 'f16c', 'instagram': 'f16d', 'flickr': 'f16e', 'adn': 'f170', 'bitbucket': 'f171', 'bitbucket-square': 'f172',
            'tumblr': 'f173', 'tumblr-square': 'f174', 'long-arrow-down': 'f175', 'long-arrow-up': 'f176', 'long-arrow-left': 'f177',
            'long-arrow-right': 'f178', 'apple': 'f179', 'windows': 'f17a', 'android': 'f17b', 'linux': 'f17c', 'dribbble': 'f17d', 'skype': 'f17e',
            'foursquare': 'f180', 'trello': 'f181', 'female': 'f182', 'male': 'f183', 'gittip,gratipay': 'f184', 'sun-o': 'f185', 'moon-o': 'f186',
            'archive': 'f187', 'bug': 'f188', 'vk': 'f189', 'weibo': 'f18a', 'renren': 'f18b', 'pagelines': 'f18c',
            'stack-exchange': 'f18d', 'arrow-circle-o-right': 'f18e', 'arrow-circle-o-left': 'f190', 'toggle-left,caret-square-o-left': 'f191',
            'dot-circle-o': 'f192', 'wheelchair': 'f193', 'vimeo-square': 'f194', 'turkish-lira,try': 'f195', 'plus-square-o': 'f196',
            'space-shuttle': 'f197', 'slack': 'f198', 'envelope-square': 'f199', 'wordpress': 'f19a', 'openid': 'f19b',
            'institution,bank,university': 'f19c', 'mortar-board,graduation-cap': 'f19d', 'yahoo': 'f19e', 'google': 'f1a0', 'reddit': 'f1a1',
            'reddit-square': 'f1a2', 'stumbleupon-circle': 'f1a3', 'stumbleupon': 'f1a4', 'delicious': 'f1a5', 'digg': 'f1a6', 'pied-piper-pp': 'f1a7',
            'pied-piper-alt': 'f1a8', 'drupal': 'f1a9', 'joomla': 'f1aa', 'language': 'f1ab', 'fax': 'f1ac', 'building': 'f1ad', 'child': 'f1ae',
            'paw': 'f1b0', 'spoon': 'f1b1', 'cube': 'f1b2', 'cubes': 'f1b3', 'behance': 'f1b4', 'behance-square': 'f1b5', 'steam': 'f1b6',
            'steam-square': 'f1b7', 'recycle': 'f1b8', 'automobile,car': 'f1b9', 'cab,taxi': 'f1ba', 'tree': 'f1bb', 'spotify': 'f1bc', 'deviantart': 'f1bd',
            'soundcloud': 'f1be', 'database': 'f1c0', 'file-pdf-o': 'f1c1', 'file-word-o': 'f1c2', 'file-excel-o': 'f1c3',
            'file-powerpoint-o': 'f1c4', 'file-photo-o,file-picture-o,file-image-o': 'f1c5', 'file-zip-o,file-archive-o': 'f1c6',
            'file-sound-o,file-audio-o': 'f1c7', 'file-movie-o,file-video-o': 'f1c8', 'file-code-o': 'f1c9', 'vine': 'f1ca', 'codepen': 'f1cb',
            'jsfiddle': 'f1cc', 'life-bouy,life-buoy,life-saver,support,life-ring': 'f1cd', 'circle-o-notch': 'f1ce',
            'ra,resistance,rebel': 'f1d0', 'ge,empire': 'f1d1', 'git-square': 'f1d2', 'git': 'f1d3', 'y-combinator-square,yc-square,hacker-news': 'f1d4',
            'tencent-weibo': 'f1d5', 'qq': 'f1d6',
            'wechat,weixin': 'f1d7', 'send,paper-plane': 'f1d8', 'send-o,paper-plane-o': 'f1d9', 'history': 'f1da', 'circle-thin': 'f1db',
            'header': 'f1dc', 'paragraph': 'f1dd', 'sliders': 'f1de', 'share-alt': 'f1e0', 'share-alt-square': 'f1e1', 'bomb': 'f1e2',
            'soccer-ball-o,futbol-o': 'f1e3', 'tty': 'f1e4', 'binoculars': 'f1e5', 'plug': 'f1e6', 'slideshare': 'f1e7', 'twitch': 'f1e8', 'yelp': 'f1e9',
            'newspaper-o': 'f1ea', 'wifi': 'f1eb', 'calculator': 'f1ec', 'paypal': 'f1ed', 'google-wallet': 'f1ee', 'cc-visa': 'f1f0',
            'cc-mastercard': 'f1f1', 'cc-discover': 'f1f2', 'cc-amex': 'f1f3', 'cc-paypal': 'f1f4', 'cc-stripe': 'f1f5', 'bell-slash': 'f1f6',
            'bell-slash-o': 'f1f7', 'trash': 'f1f8', 'copyright': 'f1f9', 'at': 'f1fa',
            'eyedropper': 'f1fb', 'paint-brush': 'f1fc', 'birthday-cake': 'f1fd', 'area-chart': 'f1fe', 'pie-chart': 'f200',
            'line-chart': 'f201', 'lastfm': 'f202', 'lastfm-square': 'f203', 'toggle-off': 'f204', 'toggle-on': 'f205', 'bicycle': 'f206', 'bus': 'f207',
            'ioxhost': 'f208', 'angellist': 'f209', 'cc': 'f20a', 'shekel,sheqel,ils': 'f20b', 'meanpath': 'f20c', 'buysellads': 'f20d',
            'connectdevelop': 'f20e', 'dashcube': 'f210', 'forumbee': 'f211', 'leanpub': 'f212', 'sellsy': 'f213', 'shirtsinbulk': 'f214',
            'simplybuilt': 'f215', 'skyatlas': 'f216', 'cart-plus': 'f217', 'cart-arrow-down': 'f218', 'diamond': 'f219', 'ship': 'f21a',
            'user-secret': 'f21b', 'motorcycle': 'f21c',
            'street-view': 'f21d',
            'heartbeat': 'f21e', 'venus': 'f221', 'mars': 'f222', 'mercury': 'f223', 'intersex,transgender': 'f224',
            'transgender-alt': 'f225', 'venus-double': 'f226', 'mars-double': 'f227', 'venus-mars': 'f228', 'mars-stroke': 'f229',
            'mars-stroke-v': 'f22a', 'mars-stroke-h': 'f22b', 'neuter': 'f22c', 'genderless': 'f22d', 'facebook-official': 'f230',
            'pinterest-p': 'f231', 'whatsapp': 'f232', 'server': 'f233', 'user-plus': 'f234',
            'user-times': 'f235', 'hotel,bed': 'f236', 'viacoin': 'f237', 'train': 'f238', 'subway': 'f239', 'medium': 'f23a',
            'yc,y-combinator': 'f23b', 'optin-monster': 'f23c', 'opencart': 'f23d', 'expeditedssl': 'f23e', 'battery-4,battery-full': 'f240',
            'battery-3,battery-three-quarters': 'f241', 'battery-2,battery-half': 'f242', 'battery-1,battery-quarter': 'f243',
            'battery-0,battery-empty': 'f244', 'mouse-pointer': 'f245', 'i-cursor': 'f246', 'object-group': 'f247', 'object-ungroup': 'f248',
            'sticky-note': 'f249', 'sticky-note-o': 'f24a', 'cc-jcb': 'f24b', 'cc-diners-club': 'f24c', 'clone': 'f24d', 'balance-scale': 'f24e',
            'hourglass-o': 'f250', 'hourglass-1,hourglass-start': 'f251',
            'hourglass-2,hourglass-half': 'f252', 'hourglass-3,hourglass-end': 'f253', 'hourglass': 'f254',
            'hand-grab-o,hand-rock-o': 'f255', 'hand-stop-o,hand-paper-o': 'f256', 'hand-scissors-o': 'f257', 'hand-lizard-o': 'f258',
            'hand-spock-o': 'f259', 'hand-pointer-o': 'f25a', 'hand-peace-o': 'f25b', 'trademark': 'f25c', 'registered': 'f25d',
            'creative-commons': 'f25e', 'gg': 'f260',
            'gg-circle': 'f261', 'tripadvisor': 'f262', 'odnoklassniki': 'f263', 'odnoklassniki-square': 'f264', 'get-pocket': 'f265', 'wikipedia-w': 'f266',
            'safari': 'f267', 'chrome': 'f268', 'firefox': 'f269', 'opera': 'f26a', 'internet-explorer': 'f26b', 'tv,television': 'f26c',
            'contao': 'f26d', '500px': 'f26e', 'amazon': 'f270', 'calendar-plus-o': 'f271', 'calendar-minus-o': 'f272',
            'calendar-times-o': 'f273', 'calendar-check-o': 'f274', 'industry': 'f275', 'map-pin': 'f276', 'map-signs': 'f277',
            'map-o': 'f278', 'map': 'f279', 'commenting': 'f27a', 'commenting-o': 'f27b', 'houzz': 'f27c', 'vimeo': 'f27d', 'black-tie': 'f27e',
            'fonticons': 'f280', 'reddit-alien': 'f281', 'edge': 'f282', 'credit-card-alt': 'f283', 'codiepie': 'f284', 'modx': 'f285',
            'fort-awesome': 'f286', 'usb': 'f287', 'product-hunt': 'f288', 'mixcloud': 'f289', 'scribd': 'f28a', 'pause-circle': 'f28b',
            'pause-circle-o': 'f28c', 'stop-circle': 'f28d',
            'stop-circle-o': 'f28e', 'shopping-bag': 'f290', 'shopping-basket': 'f291', 'hashtag': 'f292', 'bluetooth': 'f293',
            'bluetooth-b': 'f294', 'percent': 'f295', 'gitlab': 'f296', 'wpbeginner': 'f297', 'wpforms': 'f298', 'envira': 'f299',
            'universal-access': 'f29a', 'wheelchair-alt': 'f29b',
            'question-circle-o': 'f29c', 'blind': 'f29d', 'audio-description': 'f29e', 'volume-control-phone': 'f2a0', 'braille': 'f2a1',
            'assistive-listening-systems': 'f2a2', 'asl-interpreting,american-sign-language-interpreting': 'f2a3',
            'deafness,hard-of-hearing,deaf': 'f2a4', 'glide': 'f2a5', 'glide-g': 'f2a6',
            'signing,sign-language': 'f2a7', 'low-vision': 'f2a8', 'viadeo': 'f2a9', 'viadeo-square': 'f2aa', 'snapchat': 'f2ab',
            'snapchat-ghost': 'f2ac', 'snapchat-square': 'f2ad', 'pied-piper': 'f2ae', 'first-order': 'f2b0', 'yoast': 'f2b1',
            'themeisle': 'f2b2', 'google-plus-circle,google-plus-official': 'f2b3', 'fa,font-awesome': 'f2b4' };
    }
    /**
     * @return {?}
     */
    static exampleIcons() {
        return {
            'Api': 'gear',
            'Cookie': 'paw',
            'Email': 'at',
            'Git': 'git',
            'Github': 'github',
            'Google': 'google',
            'Ip': 'map-marker',
            'Issues': 'exclamation-circle',
            'Language': 'language',
            'Options': 'sliders',
            'Password': 'lock',
            'Phone': 'phone',
            'Project': 'folder-open',
            'SecurityChallengeAnswer': 'commenting',
            'User': 'user',
            'Actor': 'user',
            'zoomFit': 'arrows-alt',
            'zoomIn': 'search-plus',
            'zoomOut': 'search-minus',
            'Object': 'laptop',
            'Address': 'home',
            'BirthDate': 'birthday-cake',
            'CreditCard': 'credit-card',
            'Device': 'laptop',
            'icons': 'font-awesome',
        };
    }
    /**
     * @return {?}
     */
    static exampleImages() {
        return {
            'Address': 'assets/img/twemoji/1f3e0.svg',
            'BirthDate': 'assets/img/twemoji/1f382.svg',
            'Cookie': 'assets/img/twemoji/1f36a.svg',
            'CreditCard': 'assets/img/twemoji/1f4b3.svg',
            'Device': 'assets/img/twemoji/1f4bb.svg',
            'Email': 'assets/img/twemoji/2709.svg',
            'Git': 'assets/img/twemoji/1f5c3.svg',
            'Github': 'assets/img/twemoji/1f5c4.svg',
            'icons': 'assets/img/twemoji/1f38f.svg',
            'Ip': 'assets/img/twemoji/1f4cd.svg',
            'Issues': 'assets/img/twemoji/1f4a9.svg',
            'Language': 'assets/img/twemoji/1f1f1-1f1f7.svg',
            'Options': 'assets/img/twemoji/2699.svg',
            'Password': 'assets/img/twemoji/1f511.svg',
            'Project': 'assets/img/twemoji/2198.svg',
            'Project|name|neo4jd3': 'assets/img/twemoji/2196.svg',
            'User': 'assets/img/twemoji/1f600.svg',
            'Actor': 'assets/img/twemoji/1f600.svg',
            'Object': 'assets/img/twemoji/1f4bb.svg',
            'Api': 'assets/img/twemoji/1f527.svg',
            'Phone': 'assets/img/twemoji/1f4de.svg',
            'SecurityChallengeAnswer': 'assets/img/twemoji/1f4ac.svg',
            'zoomFit': 'assets/img/twemoji/2194.svg',
            'zoomIn': 'assets/img/twemoji/1f50d.svg',
            'zoomOut': 'assets/img/twemoji/1f50e.svg',
            'Google': 'assets/img/twemoji/1f4bb.svg'
        };
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgNeo4jD3Icons.prototype.options;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const Neo4jD3Records = {
    "results": [
        {
            "columns": [
                "Actor",
                "Object"
            ],
            "data": [
                {
                    "graph": {
                        "nodes": [
                            {
                                "id": 1142,
                                "labels": [
                                    "User"
                                ],
                                "properties": {
                                    "id": 1142,
                                    "userName": "newuser9",
                                    "mbox": "mailto:newuser9@mail.de",
                                    "objectType": "Agent"
                                }
                            },
                            {
                                "id": 1158,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1158,
                                    "objectName": "Lisa-Ark",
                                    "objectDescription": "http://curatr3.com/define/type/level",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/arkarea/Lisa-Ark",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1147,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1147,
                                    "objectName": "Lisa-Hangar",
                                    "objectDescription": "http://curatr3.com/define/type/level",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/arkarea/Lisa-Hangar",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1144,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1144,
                                    "objectName": "Mission Campus",
                                    "objectDescription": "http://curatr3.com/define/type/level",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/startmission",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1168,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1168,
                                    "objectName": "Simulation",
                                    "objectDescription": "http://adlnet.gov/expapi/activities/simulation",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/sensorstart",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1160,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1160,
                                    "objectName": "This list shows the weather conditions in each turn. Don't schedule a sensor to a turn with weather conditions that will ruin its images.",
                                    "objectDescription": "http://id.tincanapi.com/activitytype/suggestion",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/hintasked/thislistshowstheweatherconditionsineachturn.don'tscheduleasensortoaturnwithweatherconditionsthatwillruinitsimages.",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1161,
                                "labels": [
                                    "User"
                                ],
                                "properties": {
                                    "id": 1161,
                                    "userName": "Agent007",
                                    "mbox": "mailto:newuser9@mail.de",
                                    "objectType": "Agent"
                                }
                            },
                            {
                                "id": 1149,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1149,
                                    "objectName": "Mi6 Simulation",
                                    "objectDescription": "http://adlnet.gov/expapi/activities/simulation",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/sensorabandon",
                                    "objectType": "Outcome"
                                }
                            },
                            {
                                "id": 1159,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1159,
                                    "objectName": "Mi6 Simulation",
                                    "objectDescription": "http://id.tincanapi.com/activitytype/suggestion",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/hintasked/hereyoucanseetheweatherconditionsofthecurrentturn.don'tscheduleasensortoaturnwithweatherconditionsthatwillruinitsimages.",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1148,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1148,
                                    "objectName": "Mi6 Simulation",
                                    "objectDescription": "http://id.tincanapi.com/activitytype/suggestion",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/hintasked/thisfieldtellsyouhowlongthedeployedsensorwilltaketoproduceimages.thetimeiscalculatedwiththefieldsaboveit.youcandelaythestartofthesensorwith/startdelayrounds/tohavethesensorproducegoodimages.",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1166,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1166,
                                    "objectName": "Lisa-Bridge",
                                    "objectDescription": "http://curatr3.com/define/type/level",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/arkarea/Lisa-Bridge",
                                    "objectType": "Activity"
                                }
                            },
                            {
                                "id": 1169,
                                "labels": [
                                    "Device"
                                ],
                                "properties": {
                                    "id": 1169,
                                    "objectName": "Mission Campus",
                                    "objectDescription": "http://curatr3.com/define/type/level",
                                    "objectId": "http://www.iosb.fraunhofer.de/schema/xapi/lostearth/missionfailure",
                                    "objectType": "Activity"
                                }
                            }
                        ],
                        "relationships": [
                            {
                                "id": 6256,
                                "type": "completed",
                                "startNode": 1142,
                                "endNode": 1158,
                                "properties": {
                                    "xapiId": "babb0b9d-bf4e-42e0-aeba-b48ea704b28a"
                                }
                            },
                            {
                                "id": 6254,
                                "type": "selected",
                                "startNode": 1142,
                                "endNode": 1158,
                                "properties": {
                                    "xapiId": "babb0b9d-bf4e-42e0-aeba-b48ea704b28a"
                                }
                            },
                            {
                                "id": 5994,
                                "type": "read",
                                "startNode": 1142,
                                "endNode": 1147,
                                "properties": {
                                    "xapiId": "87800929-ca14-442e-bd65-2004777f979a"
                                }
                            },
                            {
                                "id": 5988,
                                "type": "read",
                                "startNode": 1142,
                                "endNode": 1147,
                                "properties": {
                                    "xapiId": "87800929-ca14-442e-bd65-2004777f979a"
                                }
                            },
                            {
                                "id": 5984,
                                "type": "selected",
                                "startNode": 1142,
                                "endNode": 1147,
                                "properties": {
                                    "xapiId": "87800929-ca14-442e-bd65-2004777f979a"
                                }
                            },
                            {
                                "id": 5983,
                                "type": "started",
                                "startNode": 1142,
                                "endNode": 1144,
                                "properties": {
                                    "xapiId": "ce7e28fb-f95c-445e-b366-25af5d4a8bc5"
                                }
                            },
                            {
                                "id": 5960,
                                "type": "completed",
                                "startNode": 1142,
                                "endNode": 1168,
                                "properties": {
                                    "xapiId": "55fc2f88-45a3-40c6-9bdd-19d8dd35cce8"
                                }
                            },
                            {
                                "id": 5959,
                                "type": "selected",
                                "startNode": 1142,
                                "endNode": 1158,
                                "properties": {
                                    "xapiId": "babb0b9d-bf4e-42e0-aeba-b48ea704b28a"
                                }
                            },
                            {
                                "id": 6132,
                                "type": "read",
                                "startNode": 1142,
                                "endNode": 1160,
                                "properties": {
                                    "xapiId": "0fa6d86a-75f0-4c6f-a439-78cf2208d07a"
                                }
                            },
                            {
                                "id": 6308,
                                "type": "asked",
                                "startNode": 1142,
                                "endNode": 1160,
                                "properties": {
                                    "xapiId": "ea168d07-7251-46bf-aa64-d57e9ab92d04"
                                }
                            },
                            {
                                "id": 5639,
                                "type": "started",
                                "startNode": 1142,
                                "endNode": 1168,
                                "properties": {
                                    "xapiId": "55fc2f88-45a3-40c6-9bdd-19d8dd35cce8"
                                }
                            },
                            {
                                "id": 5630,
                                "type": "abandoned",
                                "startNode": 1161,
                                "endNode": 1149,
                                "properties": {
                                    "xapiId": "55fc2f88-45a3-40c6-9bdd-19d8dd35cce8"
                                }
                            },
                            {
                                "id": 5644,
                                "type": "asked",
                                "startNode": 1161,
                                "endNode": 1159,
                                "properties": {
                                    "xapiId": "898e54be-3b8d-4189-b51d-a512407d8d54"
                                }
                            },
                            {
                                "id": 5607,
                                "type": "asked",
                                "startNode": 1161,
                                "endNode": 1148,
                                "properties": {
                                    "xapiId": "2290654f-2b5e-47a7-b3b0-2e7588ad68d1"
                                }
                            },
                            {
                                "id": 5567,
                                "type": "started",
                                "startNode": 1161,
                                "endNode": 1168,
                                "properties": {
                                    "xapiId": "55fc2f88-45a3-40c6-9bdd-19d8dd35cce8"
                                }
                            },
                            {
                                "id": 6248,
                                "type": "completed",
                                "startNode": 1142,
                                "endNode": 1168,
                                "properties": {
                                    "xapiId": "55fc2f88-45a3-40c6-9bdd-19d8dd35cce8"
                                }
                            },
                            {
                                "id": 5642,
                                "type": "selected",
                                "startNode": 1142,
                                "endNode": 1158,
                                "properties": {
                                    "xapiId": "947b8d30-93b6-4588-bd4c-fd2b6e06a0f3"
                                }
                            },
                            {
                                "id": 5996,
                                "type": "selected",
                                "startNode": 1142,
                                "endNode": 1166,
                                "properties": {
                                    "xapiId": "b88896a7-5a6e-4be8-98cb-f0746e84794f"
                                }
                            },
                            {
                                "id": 5995,
                                "type": "started",
                                "startNode": 1142,
                                "endNode": 1168,
                                "properties": {
                                    "xapiId": "55fc2f88-45a3-40c6-9bdd-19d8dd35cce8"
                                }
                            },
                            {
                                "id": 6309,
                                "type": "failed",
                                "startNode": 1142,
                                "endNode": 1169,
                                "properties": {
                                    "xapiId": "3b4a184b-6d51-4b03-ada6-6aeac1d3e26c"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "errors": []
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgNeo4jd3Service {
    constructor() {
        this.outOfContext = false;
        this.valueSet = false;
        this.classes2colors = {};
        this.justLoaded = false;
        this.numClasses = 0;
        this.svgScale = undefined;
        this.options = {
            arrowSize: 4,
            colors: this.colors(),
            highlight: undefined,
            icons: undefined,
            iconMap: [],
            // This value assigned in Neo4jRandom
            imageMap: {},
            images: undefined,
            infoPanel: true,
            minCollision: undefined,
            neo4jData: undefined,
            neo4jDataUrl: undefined,
            nodeOutlineFillColor: undefined,
            nodeRadius: 25,
            relationshipColor: '#a5abb6',
            zoomFit: false,
            showIcons: true,
            onNodeDoubleClick: undefined,
            onNodeClick: undefined,
            onNodeMouseEnter: undefined,
            onNodeMouseLeave: undefined,
            onRelationshipDoubleClick: undefined,
            onNodeDragEnd: undefined,
            onNodeDragStart: undefined,
            graphContainerHeight: '100%'
        };
    }
    /**
     * @param {?} _selector
     * @param {?} _options
     * @return {?}
     */
    setValues(_selector, _options) {
        new NgNeo4jD3Icons(this.options);
        this.containerIdentity = _selector;
        this.optionsInput = _options;
        this.valueSet = true;
    }
    /**
     * @return {?}
     */
    isValueSet() {
        return this.valueSet;
    }
    /**
     * @return {?}
     */
    getOptionsInput() {
        return this.optionsInput;
    }
    /**
     * @return {?}
     */
    getContainer() {
        return this.container;
    }
    /**
     * @return {?}
     */
    init() {
        this.container = select(this.containerIdentity);
        this.initIconMap(this.options);
        this.mergeProperty(this.options, this.optionsInput);
        if (this.options.neo4jData) {
            this.mergeRelationshipWithSameNodes();
        }
        if (this.options.icons) {
            this.options.showIcons = true;
        }
        if (!this.options.minCollision) {
            this.options.minCollision = this.options.nodeRadius * 2;
        }
        this.initImageMap(this.options);
        this.container.attr('class', 'neo4jd3')
            .html('');
        if (this.options.infoPanel) {
            this.info = this.appendInfoPanel(this.container);
        }
        this.svg = this.appendGraph(this.container);
        this.simulation = this.initSimulation();
        if (this.options.neo4jData) {
            this.loadNeo4jData();
        }
        else if (this.options.neo4jDataUrl) {
            this.loadNeo4jDataFromUrl(this.options.neo4jDataUrl);
        }
        else {
            console.error('Error: both neo4jData and neo4jDataUrl are empty!');
        }
        return this.options;
    }
    /**
     * @return {?}
     */
    initSimulation() {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var parentElement = this.svg.node().parentElement;
        if (parentElement == undefined || parentElement.parentElement == undefined) {
            return;
        }
        /** @type {?} */
        const clientWidth = this.svg.node().parentElement.parentElement.clientWidth / 2;
        /** @type {?} */
        const clientHeight = this.svg.node().parentElement.parentElement.clientHeight / 2;
        /** @type {?} */
        var simulation = forceSimulation()
            // .velocityDecay(0.8)
            // .force('x', d3.force().strength(0.002))
            // .force('y', d3.force().strength(0.002))
            .force('collide', forceCollide().radius((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return thisObj.options.minCollision;
        }))
            .iterations(2))
            .force('charge', forceManyBody())
            .force('link', forceLink().id((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.id;
        })))
            .force('center', forceCenter(clientWidth, clientHeight))
            .on('tick', (/**
         * @return {?}
         */
        function () {
            thisObj.tick();
        }))
            .on('end', (/**
         * @return {?}
         */
        function () {
            if (thisObj.options.zoomFit && !thisObj.justLoaded) {
                // FOR CUSTOMIZATION
            }
        }));
        return simulation;
    }
    /**
     * @param {?} container
     * @return {?}
     */
    appendGraph(container) {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', thisObj.options.graphContainerHeight)
            .attr('class', 'neo4jd3-graph')
            .call(zoom().on('zoom', (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var scale = event.transform.k;
            /** @type {?} */
            var translate = [event.transform.x, event.transform.y];
            if (thisObj.svgTranslate) {
                translate[0] += thisObj.svgTranslate[0];
                translate[1] += thisObj.svgTranslate[1];
            }
            if (thisObj.svgScale) {
                scale *= thisObj.svgScale;
            }
            thisObj.svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
        })))
            .on('dblclick.zoom', null)
            .append('g')
            .attr('width', '100%')
            .attr('height', '100%');
        this.svgRelationships = svg.append('g').attr('class', 'relationships');
        this.svgNodes = svg.append('g').attr('class', 'nodes');
        return svg;
    }
    /**
     * @param {?} container
     * @return {?}
     */
    appendInfoPanel(container) {
        return container.append('div')
            .attr('class', 'neo4jd3-info');
    }
    /**
     * @param {?} cls
     * @param {?} isNode
     * @param {?} property
     * @param {?=} value
     * @return {?}
     */
    appendInfoElement(cls, isNode, property, value = null) {
        /** @type {?} */
        var elem = this.info.append('a');
        elem.attr('href', '#')
            .attr('class', cls)
            .html('<strong>' + property + '</strong>' + (value ? (': ' + value) : ''));
        if (!value) {
            /** @type {?} */
            var thisObj = this;
            elem.style('background-color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return thisObj.options.nodeOutlineFillColor ? thisObj.options.nodeOutlineFillColor : (isNode ? thisObj.class2color(property) : thisObj.defaultColor());
            }))
                .style('border-color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return thisObj.options.nodeOutlineFillColor ? thisObj.class2darkenColor(thisObj.options.nodeOutlineFillColor) : (isNode ? thisObj.class2darkenColor(property) : thisObj.defaultDarkenColor());
            }))
                .style('color', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return thisObj.options.nodeOutlineFillColor ? thisObj.class2darkenColor(thisObj.options.nodeOutlineFillColor) : '#fff';
            }));
        }
    }
    /**
     * @param {?} cls
     * @param {?} node
     * @return {?}
     */
    appendInfoElementClass(cls, node) {
        this.appendInfoElement(cls, true, node);
    }
    /**
     * @param {?} cls
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    appendInfoElementProperty(cls, property, value) {
        this.appendInfoElement(cls, false, property, value);
    }
    /**
     * @param {?} cls
     * @param {?} relationship
     * @return {?}
     */
    appendInfoElementRelationship(cls, relationship) {
        this.appendInfoElement(cls, false, relationship);
    }
    /**
     * @return {?}
     */
    appendNode() {
        /** @type {?} */
        var thisObj = this;
        return this.node.enter()
            .append('g')
            .attr('class', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var classes = 'node';
            if (thisObj.icon(d)) {
                classes += ' node-icon';
            }
            if (thisObj.image(d)) {
                classes += ' node-image';
            }
            if (thisObj.options.highlight) {
                for (var i = 0; i < thisObj.options.highlight.length; i++) {
                    /** @type {?} */
                    const highlight = thisObj.options.highlight[i];
                    if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                        classes += ' node-highlighted';
                        break;
                    }
                }
            }
            return classes;
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            d.fx = d.fy = null;
            if (thisObj.options.onNodeClick != undefined) {
                thisObj.options.onNodeClick(d);
            }
        }))
            .on('dblclick', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            thisObj.stickNode(d);
            if (thisObj.options.onNodeDoubleClick != undefined) {
                thisObj.options.onNodeDoubleClick(d);
            }
        }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.updateInfo(d);
            }
            if (thisObj.options.onNodeMouseEnter != undefined) {
                thisObj.options.onNodeMouseEnter(d);
            }
        }))
            .on('mouseleave', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.clearInfo();
            }
            if (thisObj.options.onNodeMouseLeave != undefined) {
                thisObj.options.onNodeMouseLeave(d);
            }
        }))
            .call(drag()
            .on('start', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { thisObj.dragStarted(d); }))
            .on('drag', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { thisObj.dragged(d); }))
            .on('end', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { thisObj.dragEnded(d); })));
    }
    /**
     * @return {?}
     */
    appendNodeToGraph() {
        /** @type {?} */
        var n = this.appendNode();
        this.appendRingToNode(n);
        this.appendOutlineToNode(n);
        if (this.options.icons) {
            this.appendTextToNode(n);
        }
        if (this.options.images) {
            this.appendImageToNode(n);
        }
        return n;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendOutlineToNode(node) {
        /** @type {?} */
        var thisObj = this;
        /** @type {?} */
        var options = this.options;
        return node.append('circle')
            .attr('class', 'outline')
            .attr('r', options.nodeRadius)
            .style('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return options.nodeOutlineFillColor ? options.nodeOutlineFillColor : thisObj.class2color(d.labels[0]);
        }))
            .style('stroke', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return options.nodeOutlineFillColor ? thisObj.class2darkenColor(options.nodeOutlineFillColor) : thisObj.class2darkenColor(d.labels[0]);
        }))
            .append('title').text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return thisObj.toString(d);
        }));
    }
    /**
     * @param {?} cls
     * @return {?}
     */
    class2color(cls) {
        /** @type {?} */
        var color = this.classes2colors[cls];
        if (!color) {
            // color = this.options.colors[Math.min(numClasses, this.options.colors.length - 1)];
            color = this.options.colors[this.numClasses % this.options.colors.length];
            this.classes2colors[cls] = color;
            this.numClasses++;
        }
        return color;
    }
    /**
     * @param {?} cls
     * @return {?}
     */
    class2darkenColor(cls) {
        /** @type {?} */
        var colorValue = this.class2color(cls);
        try {
            // COLOR Object is not working properly when the optimization is set true
            /** @type {?} */
            var colorObject = rgb(colorValue);
            return colorObject.darker(1);
        }
        catch (err) { }
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendRingToNode(node) {
        /** @type {?} */
        var thisObj = this;
        return node.append('circle')
            .attr('class', 'ring')
            .attr('r', this.options.nodeRadius * 1.16)
            .append('title').text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return thisObj.toString(d);
        }));
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendImageToNode(node) {
        /** @type {?} */
        var thisObj = this;
        // TODO >> Change This To Become The Container
        // Added the [iconFlag] attribute in the node or 'd' variable
        return node.append('image').attr('width', '35px')
            .attr('height', '35px').attr('x', '-18px').attr('y', '-18px')
            .attr('xlink:href', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return thisObj.image(d); }));
        ;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    appendTextToNode(node) {
        /** @type {?} */
        var thisObj = this;
        return node.append('text')
            .attr('class', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return 'text' + (thisObj.icon(d) ? ' icon' : ''); }))
            .attr('fill', 'black')
            .attr('font-size', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (thisObj.icon(d) ? '25px' : '12px'); }))
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (thisObj.icon(d) ? '25px' : '30px'); }))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (thisObj.icon(d) ? '25px' : '30px'); }))
            .attr('style', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            const rgb = 'fill: rgb(225, 225, 225); stroke: rgb(000, 000, 000);';
            return thisObj.icon(d) ? rgb : '';
        }))
            .html((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var _icon = thisObj.icon(d);
            return _icon ? '&#x' + _icon : d.id;
        }));
    }
    /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    appendRandomDataToNode(d, maxNodesToGenerate) {
        /** @type {?} */
        var data = this.randomD3Data(d, maxNodesToGenerate);
        this.updateWithNeo4jData(data);
    }
    /**
     * @return {?}
     */
    appendRelationship() {
        /** @type {?} */
        var thisObj = this;
        // Function > Double Click 
        /** @type {?} */
        const fnDoubleClick = (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.options.onRelationshipDoubleClick != undefined) {
                thisObj.options.onRelationshipDoubleClick(d);
            }
        });
        // Function > Mouse Enter
        /** @type {?} */
        const fnMouseEnter = (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (thisObj.info) {
                thisObj.updateInfo(d);
            }
        });
        return this.relationship.enter().append('g').attr('class', 'relationship').on('dblclick', fnDoubleClick).on('mouseenter', fnMouseEnter);
    }
    /**
     * @return {?}
     */
    clearInfo() {
        this.info.html('');
    }
    /**
     * @return {?}
     */
    color() {
        return this.options.colors[this.options.colors.length * Math.random() << 0];
    }
    /**
     * @return {?}
     */
    colors() {
        // d3.schemeCategory10,
        // d3.schemeCategory20,
        return [
            '#68bdf6',
            '#6dce9e',
            '#faafc2',
            '#f2baf6',
            '#ff928c',
            '#fcea7e',
            '#ffc766',
            '#405f9e',
            '#a5abb6',
            '#78cecb',
            '#b88cbb',
            '#ced2d9',
            '#e84646',
            '#fa5f86',
            '#ffab1a',
            '#fcda19',
            '#797b80',
            '#c9d96f',
            '#47991f',
            '#70edee',
            '#ff75ea' // pink
        ];
    }
    /**
     * @param {?} array
     * @param {?} id
     * @return {?}
     */
    containsResult(array, id) {
        /** @type {?} */
        var filter = array.filter((/**
         * @param {?} elem
         * @return {?}
         */
        function (elem) {
            return elem.id === id;
        }));
        return filter.length > 0;
    }
    /**
     * @return {?}
     */
    defaultColor() {
        return this.options.relationshipColor;
    }
    /**
     * @return {?}
     */
    defaultDarkenColor() {
        /** @type {?} */
        var colorValue = this.options.colors[this.options.colors.length - 1];
        try {
            // COLOR Object is not working properly when the optimization is set true
            /** @type {?} */
            var colorObject = rgb(colorValue);
            return colorObject.darker(1);
        }
        catch (err) { }
    }
    /**
     * @param {?} d
     * @return {?}
     */
    dragEnded(d) {
        if (!event.active) {
            this.simulation.alphaTarget(0);
        }
        if (this.options.onNodeDragEnd != undefined) {
            this.options.onNodeDragEnd(d);
        }
    }
    /**
     * @param {?} d
     * @return {?}
     */
    dragged(d) {
        this.stickNode(d);
    }
    /**
     * @param {?} d
     * @return {?}
     */
    dragStarted(d) {
        if (!event.active) {
            this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
        if (this.options.onNodeDragStart != undefined) {
            this.options.onNodeDragStart(d);
        }
    }
    /**
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    extend(obj1, obj2) {
        /** @type {?} */
        var obj = {};
        this.mergeProperty(obj, obj1);
        this.mergeProperty(obj, obj2);
        return obj;
    }
    /**
     * @param {?} d
     * @return {?}
     */
    icon(d) {
        /** @type {?} */
        var code;
        if (this.options.iconMap && this.options.showIcons && this.options.icons) {
            if (this.options.icons[d.labels[0]] && this.options.iconMap[this.options.icons[d.labels[0]]]) {
                code = this.options.iconMap[this.options.icons[d.labels[0]]];
            }
            else if (this.options.iconMap[d.labels[0]]) {
                code = this.options.iconMap[d.labels[0]];
            }
            else if (this.options.icons[d.labels[0]]) {
                code = this.options.icons[d.labels[0]];
            }
        }
        return code;
    }
    /**
     * @param {?} d
     * @return {?}
     */
    image(d) {
        /** @type {?} */
        var i;
        /** @type {?} */
        var imagesForLabel;
        /** @type {?} */
        var img;
        /** @type {?} */
        var imgLevel;
        /** @type {?} */
        var label;
        /** @type {?} */
        var labelPropertyValue;
        /** @type {?} */
        var property;
        /** @type {?} */
        var value;
        if (this.options.images) {
            /** @type {?} */
            const imgRef = d.img == undefined ? d.labels[0] : d.img;
            imagesForLabel = this.options.imageMap[imgRef];
            if (imagesForLabel) {
                imgLevel = 0;
                for (i = 0; i < imagesForLabel.length; i++) {
                    labelPropertyValue = imagesForLabel[i].split('|');
                    switch (labelPropertyValue.length) {
                        case 3:
                            value = labelPropertyValue[2];
                        /* falls through */
                        case 2:
                            property = labelPropertyValue[1];
                        /* falls through */
                        case 1:
                            label = labelPropertyValue[0];
                    }
                    if (imgRef === label &&
                        (!property || d.properties[property] !== undefined) &&
                        (!value || d.properties[property] === value)) {
                        if (labelPropertyValue.length > imgLevel) {
                            img = this.options.images[imagesForLabel[i]];
                            imgLevel = labelPropertyValue.length;
                        }
                    }
                }
            }
        }
        return img;
    }
    /**
     * @return {?}
     */
    loadNeo4jData() {
        this.nodes = [];
        this.relationships = [];
        this.updateWithNeo4jData(this.options.neo4jData);
    }
    /**
     * @param {?} neo4jDataUrl
     * @return {?}
     */
    loadNeo4jDataFromUrl(neo4jDataUrl) {
        this.nodes = [];
        this.relationships = [];
        json(neo4jDataUrl, (/**
         * @param {?} error
         * @param {?} data
         * @return {?}
         */
        function (error, data) {
            if (error) {
                throw error;
            }
            this.updateWithNeo4jData(data);
        }));
    }
    /**
     * @param {?} data
     * @return {?}
     */
    neo4jDataToD3Data(data) {
        /** @type {?} */
        var graph = {
            nodes: [],
            relationships: []
        };
        /** @type {?} */
        var thisObj = this;
        data.results.forEach((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            result.data.forEach((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                data.graph.nodes.forEach((/**
                 * @param {?} node
                 * @return {?}
                 */
                function (node) {
                    if (!thisObj.containsResult(graph.nodes, node.id)) {
                        graph.nodes.push(node);
                    }
                }));
                data.graph.relationships.forEach((/**
                 * @param {?} relationship
                 * @return {?}
                 */
                function (relationship) {
                    relationship.source = relationship.startNode;
                    relationship.target = relationship.endNode;
                    graph.relationships.push(relationship);
                }));
                data.graph.relationships.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) {
                    if (a.source > b.source) {
                        return 1;
                    }
                    else if (a.source < b.source) {
                        return -1;
                    }
                    else {
                        if (a.target > b.target) {
                            return 1;
                        }
                        if (a.target < b.target) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                }));
                for (var i = 0; i < data.graph.relationships.length; i++) {
                    if (i !== 0 && data.graph.relationships[i].source === data.graph.relationships[i - 1].source && data.graph.relationships[i].target === data.graph.relationships[i - 1].target) {
                        data.graph.relationships[i].linknum = data.graph.relationships[i - 1].linknum + 1;
                    }
                    else {
                        data.graph.relationships[i].linknum = 1;
                    }
                }
            }));
        }));
        return graph;
    }
    /**
     * @param {?} d
     * @return {?}
     */
    toString(d) {
        /** @type {?} */
        var s = d.labels ? d.labels[0] : d.type;
        s += ' (<id>: ' + d.id;
        Object.keys(d.properties).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            s += ', ' + property + ': ' + JSON.stringify(d.properties[property]);
        }));
        s += ')';
        return s;
    }
    /**
     * @param {?} d
     * @param {?} maxNodesToGenerate
     * @return {?}
     */
    randomD3Data(d, maxNodesToGenerate) {
        /** @type {?} */
        var data = {
            nodes: [],
            relationships: []
        };
        /** @type {?} */
        var numNodes = (maxNodesToGenerate * Math.random() << 0) + 1;
        /** @type {?} */
        var s = this.size();
        for (var i = 0; i < numNodes; i++) {
            // var icons = Object.keys(this.options.iconMap);
            /** @type {?} */
            const label = "Hello";
            // icons[icons.length * Math.random() << 0];
            /** @type {?} */
            const node = {
                id: s.nodes + 1 + i,
                labels: [label],
                properties: {
                    random: label
                },
                x: d.x,
                y: d.y
            };
            data.nodes[data.nodes.length] = node;
            /** @type {?} */
            const relationship = {
                id: s.relationships + 1 + i,
                type: label.toUpperCase(),
                startNode: d.id,
                endNode: s.nodes + 1 + i,
                properties: {
                    from: Date.now()
                },
                source: d.id,
                target: s.nodes + 1 + i,
                linknum: s.relationships + 1 + i
            };
            data.relationships[data.relationships.length] = relationship;
        }
        return data;
    }
    /**
     * @return {?}
     */
    size() {
        return {
            nodes: this.nodes.length,
            relationships: this.relationships.length
        };
    }
    /**
     * @param {?} d
     * @return {?}
     */
    stickNode(d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    /**
     * @return {?}
     */
    tick() {
        this.tickNodes();
        this.tickRelationships();
    }
    /**
     * @return {?}
     */
    tickNodes() {
        if (this.node) {
            this.node.attr('transform', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (d != undefined)
                    return 'translate(' + d.x + ', ' + d.y + ')';
                /** @type {?} */
                const msg = "=========>>>>>>>>>>>>>> ERROR >> tickNodes";
                console.error(msg);
                throw new Error(msg);
            }));
        }
    }
    /**
     * @return {?}
     */
    tickRelationships() {
        if (this.relationship) {
            /** @type {?} */
            const thisObj = this;
            this.relationship.attr('transform', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                if (d != undefined) {
                    /** @type {?} */
                    var angle = thisObj.rotation(d.source, d.target);
                    if (d.source != undefined) {
                        return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
                    }
                }
                /** @type {?} */
                const msg = "=========>>>>>>>>>>>>>> ERROR >> tickRelationships";
                console.error(msg);
                throw new Error(msg);
            }));
            this.tickRelationshipsTexts();
            this.tickRelationshipsOutlines();
            this.tickRelationshipsOverlays();
        }
    }
    /**
     * @return {?}
     */
    tickRelationshipsOutlines() {
        /** @type {?} */
        var thisObj = this;
        this.relationship.each((/**
         * @param {?} relationship
         * @param {?} index
         * @param {?} g
         * @return {?}
         */
        (relationship, index, g) => {
            /** @type {?} */
            var obj = g[index];
            /** @type {?} */
            var rel = select(obj);
            /** @type {?} */
            var outline;
            try {
                outline = rel.select('.outline');
            }
            catch (err) {
                return;
            }
            /** @type {?} */
            var text = rel.select('.text');
            try {
                /** @type {?} */
                var bbox = text.node().getBBox();
            }
            catch (err) {
                return;
            }
            /** @type {?} */
            var padding = 3;
            outline.attr('d', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                try {
                    /** @type {?} */
                    var options = thisObj.options;
                    /** @type {?} */
                    var center = { x: 0, y: 0 };
                    /** @type {?} */
                    var angle = thisObj.rotation(d.source, d.target);
                    /** @type {?} */
                    var textBoundingBox = text.node().getBBox();
                    /** @type {?} */
                    var textPadding = 5;
                    /** @type {?} */
                    var u = thisObj.unitaryVector(d.source, d.target);
                    /** @type {?} */
                    var textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 };
                    /** @type {?} */
                    var n = thisObj.unitaryNormalVector(d.source, d.target);
                    /** @type {?} */
                    var rotatedPointA1 = thisObj.rotatePoint(center, { x: 0 + (thisObj.options.nodeRadius + 1) * u.x - n.x, y: 0 + (thisObj.options.nodeRadius + 1) * u.y - n.y }, angle);
                    /** @type {?} */
                    var rotatedPointB1 = thisObj.rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle);
                    /** @type {?} */
                    var rotatedPointC1 = thisObj.rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle);
                    /** @type {?} */
                    var rotatedPointD1 = thisObj.rotatePoint(center, { x: 0 + (options.nodeRadius + 1) * u.x, y: 0 + (options.nodeRadius + 1) * u.y }, angle);
                    /** @type {?} */
                    var rotatedPointA2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle);
                    /** @type {?} */
                    var rotatedPointB2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y - u.y * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointC2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointD2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y }, angle);
                    /** @type {?} */
                    var rotatedPointE2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x + (-n.x - u.x) * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y + (-n.y - u.y) * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointF2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x - u.x * options.arrowSize, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y - u.y * options.arrowSize }, angle);
                    /** @type {?} */
                    var rotatedPointG2 = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);
                    return 'M ' + rotatedPointA1.x + ' ' + rotatedPointA1.y +
                        ' L ' + rotatedPointB1.x + ' ' + rotatedPointB1.y +
                        ' L ' + rotatedPointC1.x + ' ' + rotatedPointC1.y +
                        ' L ' + rotatedPointD1.x + ' ' + rotatedPointD1.y +
                        ' Z M ' + rotatedPointA2.x + ' ' + rotatedPointA2.y +
                        ' L ' + rotatedPointB2.x + ' ' + rotatedPointB2.y +
                        ' L ' + rotatedPointC2.x + ' ' + rotatedPointC2.y +
                        ' L ' + rotatedPointD2.x + ' ' + rotatedPointD2.y +
                        ' L ' + rotatedPointE2.x + ' ' + rotatedPointE2.y +
                        ' L ' + rotatedPointF2.x + ' ' + rotatedPointF2.y +
                        ' L ' + rotatedPointG2.x + ' ' + rotatedPointG2.y +
                        ' Z';
                }
                catch (err) {
                    return;
                }
            }));
        }));
    }
    /**
     * @param {?} d
     * @param {?} text
     * @return {?}
     */
    outlineFunction(d, text) {
    }
    /**
     * @return {?}
     */
    tickRelationshipsOverlays() {
        /** @type {?} */
        var thisObj = this;
        this.relationshipOverlay.attr('d', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var center = { x: 0, y: 0 };
            /** @type {?} */
            var angle = thisObj.rotation(d.source, d.target);
            /** @type {?} */
            var n1 = thisObj.unitaryNormalVector(d.source, d.target);
            /** @type {?} */
            var n = thisObj.unitaryNormalVector(d.source, d.target, 50);
            /** @type {?} */
            var rotatedPointA = thisObj.rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle);
            /** @type {?} */
            var rotatedPointB = thisObj.rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle);
            /** @type {?} */
            var rotatedPointC = thisObj.rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle);
            /** @type {?} */
            var rotatedPointD = thisObj.rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);
            return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
                ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
                ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
                ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
                ' Z';
        }));
    }
    /**
     * @return {?}
     */
    tickRelationshipsTexts() {
        /** @type {?} */
        var thisObj = this;
        this.relationshipText.attr('transform', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var angle = (thisObj.rotation(d.source, d.target) + 360) % 360;
            /** @type {?} */
            var mirror = angle > 90 && angle < 270;
            /** @type {?} */
            var center = { x: 0, y: 0 };
            /** @type {?} */
            var n = thisObj.unitaryNormalVector(d.source, d.target);
            /** @type {?} */
            var nWeight = mirror ? 2 : -3;
            /** @type {?} */
            var point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight };
            /** @type {?} */
            var rotatedPoint = thisObj.rotatePoint(center, point, angle);
            return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
        }));
    }
    /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    unitaryNormalVector(source, target, newLength = 1) {
        /** @type {?} */
        var center = { x: 0, y: 0 };
        /** @type {?} */
        var vector = this.unitaryVector(source, target, newLength);
        return this.rotatePoint(center, vector, 90);
    }
    /**
     * @param {?} source
     * @param {?} target
     * @param {?=} newLength
     * @return {?}
     */
    unitaryVector(source, target, newLength = 1) {
        /** @type {?} */
        var length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);
        return {
            x: (target.x - source.x) / length,
            y: (target.y - source.y) / length,
        };
    }
    /**
     * This function is obselete and not used any where
     * \@obselete
     * @param {?} d3Data
     * @return {?}
     */
    updateWithD3Data(d3Data) {
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    }
    /**
     * Update data for Neo4j Visualization
     * @param {?} neo4jData
     * @return {?}
     */
    updateWithNeo4jData(neo4jData) {
        /** @type {?} */
        var d3Data = this.neo4jDataToD3Data(neo4jData);
        this.updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    }
    /**
     * @param {?} d
     * @return {?}
     */
    updateInfo(d) {
        this.clearInfo();
        if (d.labels) {
            this.appendInfoElementClass('class', d.labels[0]);
        }
        else {
            this.appendInfoElementRelationship('class', d.type);
        }
        this.appendInfoElementProperty('property', '&lt;id&gt;', d.id);
        /** @type {?} */
        var thisObj = this;
        Object.keys(d.properties).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            thisObj.appendInfoElementProperty('property', property, JSON.stringify(d.properties[property]));
        }));
    }
    /**
     * @param {?} n
     * @return {?}
     */
    updateNodes(n) {
        Array.prototype.push.apply(this.nodes, n);
        this.node = this.svgNodes.selectAll('.node').data(this.nodes, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.id; }));
        /** @type {?} */
        var nodeEnter = this.appendNodeToGraph();
        this.node = nodeEnter.merge(this.node);
    }
    /**
     * @param {?} n
     * @param {?} r
     * @return {?}
     */
    updateNodesAndRelationships(n, r) {
        this.updateRelationships(r);
        this.updateNodes(n);
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.relationships);
    }
    /**
     * @param {?} r
     * @return {?}
     */
    updateRelationships(r) {
        Array.prototype.push.apply(this.relationships, r);
        this.relationship = this.svgRelationships.selectAll('.relationship').data(this.relationships, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.id; }));
        /** @type {?} */
        var relationship = this.appendRelationship();
        /** @type {?} */
        var relationshipEnter = this.appendRelationshipToGraph(relationship);
        this.relationship = relationshipEnter.relationship.merge(this.relationship);
        this.relationshipOutline = this.svg.selectAll('.relationship .outline');
        this.relationshipOutline = relationshipEnter.outline.merge(this.relationshipOutline);
        this.relationshipOverlay = this.svg.selectAll('.relationship .overlay');
        this.relationshipOverlay = relationshipEnter.overlay.merge(this.relationshipOverlay);
        this.relationshipText = this.svg.selectAll('.relationship .text');
        this.relationshipText = relationshipEnter.text.merge(this.relationshipText);
    }
    // ---------------------------------
    //            Neo4j Util
    // ---------------------------------
    /**
     * @return {?}
     */
    getOptionsPresentation() {
        return {
            arrowSize: 4,
            colors: undefined,
            highlight: [
                {
                    class: 'Project',
                    property: 'name',
                    value: 'neo4jd3'
                },
                {
                    class: 'User',
                    property: 'userId',
                    value: 'eisman'
                }
            ],
            icons: NgNeo4jD3Icons.exampleIcons(),
            images: NgNeo4jD3Icons.exampleImages(),
            iconMap: undefined,
            // This value assigned in Neo4jRandom
            imageMap: undefined,
            infoPanel: true,
            minCollision: 60,
            neo4jData: Neo4jD3Records,
            nodeOutlineFillColor: undefined,
            neo4jDataUrl: undefined,
            nodeRadius: 25,
            relationshipColor: '#a5abb6',
            onRelationshipDoubleClick: (/**
             * @param {?} relationship
             * @return {?}
             */
            function (relationship) {
                console.log('double click on relationship: ' + JSON.stringify(relationship));
            }),
            zoomFit: true,
            showIcons: true,
            onNodeDoubleClick: undefined,
            onNodeClick: undefined,
            onNodeMouseEnter: undefined,
            onNodeMouseLeave: undefined,
            onNodeDragEnd: undefined,
            onNodeDragStart: undefined,
            graphContainerHeight: '100%'
        };
    }
    /**
     * @param {?} c
     * @param {?} p
     * @param {?} angle
     * @return {?}
     */
    rotatePoint(c, p, angle) {
        return this.rotate(c.x, c.y, p.x, p.y, angle);
    }
    /**
     * @param {?} source
     * @param {?} target
     * @return {?}
     */
    rotation(source, target) {
        return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
    }
    /**
     * @param {?} cx
     * @param {?} cy
     * @param {?} x
     * @param {?} y
     * @param {?} angle
     * @return {?}
     */
    rotate(cx, cy, x, y, angle) {
        /** @type {?} */
        var radians = (Math.PI / 180) * angle;
        /** @type {?} */
        var cos = Math.cos(radians);
        /** @type {?} */
        var sin = Math.sin(radians);
        /** @type {?} */
        var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        /** @type {?} */
        var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }
    /**
     * @param {?} options
     * @return {?}
     */
    initIconMap(options) {
        Object.keys(options.iconMap).forEach((/**
         * @param {?} key
         * @param {?} index
         * @return {?}
         */
        function (key, index) {
            /** @type {?} */
            var keys = key.split(',');
            /** @type {?} */
            var value = options.iconMap[key];
            keys.forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                options.iconMap[key] = value;
            }));
        }));
        return options.iconMap;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    initImageMap(options) {
        // var key, keys, selector;
        /** @type {?} */
        var key;
        /** @type {?} */
        var keys;
        for (key in options.images) {
            if (options.images.hasOwnProperty(key)) {
                keys = key.split('|');
                if (!options.imageMap[keys[0]]) {
                    options.imageMap[keys[0]] = [key];
                }
                else {
                    options.imageMap[keys[0]].push(key);
                }
            }
        }
    }
    /**
     * @param {?} r
     * @return {?}
     */
    appendTextToRelationship(r) {
        /** @type {?} */
        var rText = r.append('text');
        return rText.attr('class', 'text').attr('fill', '#000000').attr('font-size', '8px').attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.type; }));
    }
    /**
     * @param {?} relationship
     * @return {?}
     */
    appendRelationshipToGraph(relationship) {
        /** @type {?} */
        var text = this.appendTextToRelationship(relationship);
        /** @type {?} */
        var outline = relationship.append('path').attr('class', 'outline').attr('fill', '#a5abb6').attr('stroke', 'none');
        /** @type {?} */
        var overlay = relationship.append('path').attr('class', 'overlay');
        // this.relationship = relationship;
        return {
            outline: outline,
            overlay: overlay,
            relationship: relationship,
            text: text
        };
    }
    /**
     * @param {?} target
     * @param {?} source
     * @return {?}
     */
    mergeProperty(target, source) {
        Object.keys(source).forEach((/**
         * @param {?} property
         * @return {?}
         */
        function (property) {
            /** @type {?} */
            const sourceProperty = source[property];
            if (sourceProperty != undefined) {
                if (!(sourceProperty instanceof Array))
                    target[property] = source[property];
                else if (sourceProperty.length > 0)
                    target[property] = source[property];
            }
        }));
    }
    /**
     * @return {?}
     */
    version() {
        return "0.1.6";
    }
    // Merges All Relationships with the same nodes
    /**
     * @private
     * @return {?}
     */
    mergeRelationshipWithSameNodes() {
        /** @type {?} */
        let r = this.options.neo4jData.results[0].data[0].graph.relationships;
        // Check the relationship counts between 2 nodes
        /** @type {?} */
        var drawnRelationship = {};
        for (let rIndex = 0; rIndex < r.length; rIndex++) {
            /** @type {?} */
            let rel = r[rIndex];
            /** @type {?} */
            const startNode = rel['startNode'];
            /** @type {?} */
            const endNode = rel['endNode'];
            /** @type {?} */
            const relationshipKey = startNode + '-' + endNode;
            /** @type {?} */
            let relationshipValue = drawnRelationship[relationshipKey];
            rel['id'] = rel['id'].toString();
            if (relationshipValue != undefined) {
                if (relationshipKey == '1161-1148') {
                    console.log(JSON.stringify(rel));
                }
                /** @type {?} */
                let relationshipModified = {};
                /** @type {?} */
                const obj = relationshipValue;
                // 
                /** @type {?} */
                const keys = this.mergeKeys(obj, rel);
                keys.forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => {
                    /** @type {?} */
                    const newVal = this.assignAttributes(key, obj, rel);
                    if (newVal != undefined) {
                        relationshipModified[key] = this.assignAttributes(key, obj, rel);
                    }
                }));
                drawnRelationship[relationshipKey] = relationshipModified;
            }
            else {
                drawnRelationship[relationshipKey] = rel;
            }
        }
        /** @type {?} */
        const newRel = Object.values(drawnRelationship);
        this.options.neo4jData.results[0].data[0].graph.relationships = newRel;
    }
    /**
     * @private
     * @param {?} obj1
     * @param {?} obj2
     * @return {?}
     */
    mergeKeys(obj1, obj2) {
        /** @type {?} */
        let keys = Object.keys(obj1);
        keys = keys.concat(Object.keys(obj2));
        return [...new Set(keys)];
    }
    /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    assignAttributes(key, relationship1, relationship2) {
        if (key === 'properties') {
            /** @type {?} */
            const prop1 = relationship1.properties;
            /** @type {?} */
            const prop2 = relationship2.properties;
            if (prop1 == undefined && prop2 == undefined) {
                return {};
            }
            else if (prop1 == undefined) {
                return prop2;
            }
            else if (prop2 == undefined) {
                return prop1;
            }
            /** @type {?} */
            const keys = this.mergeKeys(prop1, prop2);
            /** @type {?} */
            let prop = {};
            keys.forEach((/**
             * @param {?} key
             * @return {?}
             */
            key => {
                prop[key] = this.assignAttributesValue(key, prop1, prop2);
            }));
            return prop;
        }
        else if (key == 'target' || key == 'linknum' || key == 'startNode' || key == 'endNode') {
            return relationship1[key];
        }
        return this.assignAttributesValue(key, relationship1, relationship2);
    }
    /**
     * @private
     * @param {?} key
     * @param {?} relationship1
     * @param {?} relationship2
     * @return {?}
     */
    assignAttributesValue(key, relationship1, relationship2) {
        /** @type {?} */
        let val1 = relationship1[key];
        /** @type {?} */
        let val2 = relationship2[key];
        if (val1 != undefined || val2 != undefined) {
            if (val1 == undefined) {
                return val2;
            }
            else if (val2 == undefined) {
                return val1;
            }
            else {
                if (val1 instanceof Array || val2 instanceof Array) {
                    if (!(val1 instanceof Array)) {
                        val2.push(val1);
                        return val2;
                    }
                    else if (!(val2 instanceof Array)) {
                        val1.push(val2);
                        return val1;
                    }
                    return val1.concat(val2);
                }
                else if (val1 instanceof Object || val2 instanceof Object) {
                    if (!(val1 instanceof Object)) {
                        val2.custom_key_assigned = val1;
                        return val2;
                    }
                    else if (!(val2 instanceof Object)) {
                        val1.custom_key_assigned = val2;
                        return val1;
                    }
                    /** @type {?} */
                    const keys = this.mergeKeys(val1, val2);
                    /** @type {?} */
                    let obj = {};
                    keys.forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    key => {
                        obj[key] = this.assignAttributesValue(key, val1, val2);
                    }));
                    return obj;
                }
                return val1 + ', ' + val2;
            }
        }
        return undefined;
    }
}
NgNeo4jd3Service.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgNeo4jd3Service.ctorParameters = () => [];
/** @nocollapse */ NgNeo4jd3Service.ngInjectableDef = ɵɵdefineInjectable({ factory: function NgNeo4jd3Service_Factory() { return new NgNeo4jd3Service(); }, token: NgNeo4jd3Service, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgNeo4jd3Service.prototype.outOfContext;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.valueSet;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.container;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.containerIdentity;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.info;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.node;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.nodes;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationship;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationships;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationshipOutline;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationshipOverlay;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.relationshipText;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.simulation;
    /** @type {?} */
    NgNeo4jd3Service.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgNodes;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgRelationships;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgTranslate;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.classes2colors;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.justLoaded;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.numClasses;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.svgScale;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.optionsInput;
    /**
     * @type {?}
     * @private
     */
    NgNeo4jd3Service.prototype.options;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgNeo4jd3Component {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NgNeo4jd3Component.decorators = [
    { type: Component, args: [{
                selector: 'lib-ng-neo4jd3',
                template: `
    <p>
      ng-neo4jd3 works!
    </p>
  `,
                styles: ['./../assets/css/counter-button.component.css']
            }] }
];
/** @nocollapse */
NgNeo4jd3Component.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgNeo4jd3Module {
}
NgNeo4jd3Module.decorators = [
    { type: NgModule, args: [{
                declarations: [NgNeo4jd3Component],
                imports: [],
                exports: [NgNeo4jd3Component]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RelationshipEnter {
}
if (false) {
    /** @type {?} */
    RelationshipEnter.prototype.outline;
    /** @type {?} */
    RelationshipEnter.prototype.overlay;
    /** @type {?} */
    RelationshipEnter.prototype.relationship;
    /** @type {?} */
    RelationshipEnter.prototype.text;
}
class NgNeo4jD3Data {
}
if (false) {
    /** @type {?} */
    NgNeo4jD3Data.prototype.results;
    /** @type {?} */
    NgNeo4jD3Data.prototype.errors;
}
class NgNeo4jD3Options {
    constructor() {
        this.colors = [];
        this.highlight = [];
        this.iconMap = {};
        this.icons = {};
        this.imageMap = {};
        this.images = {};
        this.infoPanel = true;
        this.nodeRadius = 25;
        this.relationshipColor = '#a5abb6';
        this.zoomFit = false;
        this.showIcons = true;
        this.onNodeClick = (/**
         * @return {?}
         */
        () => { console.log("onNodeClick >> Default Method!"); });
        this.onNodeDoubleClick = (/**
         * @return {?}
         */
        () => { console.log("onNodeDoubleClick >> Default Method!"); });
        this.onNodeMouseEnter = (/**
         * @return {?}
         */
        () => { console.log("onNodeMouseEnter >> Default Method!"); });
        this.onNodeMouseLeave = (/**
         * @return {?}
         */
        () => { console.log("onNodeMouseLeave >> Default Method!"); });
        this.onRelationshipDoubleClick = (/**
         * @return {?}
         */
        () => { console.log("onRelationshipDoubleClick >> Default Method!"); });
        this.onNodeDragEnd = (/**
         * @return {?}
         */
        () => { console.log("onNodeDragEnd >> Default Method!"); });
        this.onNodeDragStart = (/**
         * @return {?}
         */
        () => { console.log("onNodeDragStart >> Default Method!"); });
        this.neo4jDataUrl = undefined;
        this.graphContainerHeight = '100%';
    }
}
if (false) {
    /** @type {?} */
    NgNeo4jD3Options.prototype.arrowSize;
    /** @type {?} */
    NgNeo4jD3Options.prototype.colors;
    /** @type {?} */
    NgNeo4jD3Options.prototype.highlight;
    /** @type {?} */
    NgNeo4jD3Options.prototype.iconMap;
    /** @type {?} */
    NgNeo4jD3Options.prototype.icons;
    /** @type {?} */
    NgNeo4jD3Options.prototype.imageMap;
    /** @type {?} */
    NgNeo4jD3Options.prototype.images;
    /** @type {?} */
    NgNeo4jD3Options.prototype.infoPanel;
    /** @type {?} */
    NgNeo4jD3Options.prototype.minCollision;
    /** @type {?} */
    NgNeo4jD3Options.prototype.nodeOutlineFillColor;
    /** @type {?} */
    NgNeo4jD3Options.prototype.nodeRadius;
    /** @type {?} */
    NgNeo4jD3Options.prototype.relationshipColor;
    /** @type {?} */
    NgNeo4jD3Options.prototype.zoomFit;
    /** @type {?} */
    NgNeo4jD3Options.prototype.showIcons;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onNodeClick;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onNodeDoubleClick;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onNodeMouseEnter;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onNodeMouseLeave;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onRelationshipDoubleClick;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onNodeDragEnd;
    /** @type {?} */
    NgNeo4jD3Options.prototype.onNodeDragStart;
    /** @type {?} */
    NgNeo4jD3Options.prototype.neo4jData;
    /** @type {?} */
    NgNeo4jD3Options.prototype.neo4jDataUrl;
    /** @type {?} */
    NgNeo4jD3Options.prototype.graphContainerHeight;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { Neo4jD3Records, NgNeo4jD3Data, NgNeo4jD3Icons, NgNeo4jD3Options, NgNeo4jd3Component, NgNeo4jd3Module, NgNeo4jd3Service, RelationshipEnter };
//# sourceMappingURL=ng-neo4jd3.js.map
