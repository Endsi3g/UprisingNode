cd api
node -e "
const fs = require('fs');
let dtoContent = fs.readFileSync('src/transactions/dto/transaction.dto.ts', 'utf8');
dtoContent = 'import { IsNumber, IsString, IsOptional } from \'class-validator\';\n' + dtoContent;
fs.writeFileSync('src/transactions/dto/transaction.dto.ts', dtoContent);
"
