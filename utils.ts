import fs = require('fs');
import path = require('path');

console.log('Spadaj...')

import utilsEjs = require('./utils-ejs')
utilsEjs.ejsToHtml('app', 'index', 'index', { title: 'Nic', data: null })

console.log('OK')
