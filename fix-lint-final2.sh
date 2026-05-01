cd api

# Fix scraper service explicit types
sed -i 's/Promise<any>/Promise<Record<string, unknown>>/g' src/scraper/scraper.controller.ts

# Remove unused imports
sed -i '/IsEnum/d' src/transactions/dto/transaction.dto.ts
sed -i 's/Put,//g' src/users/users.controller.ts
sed -i '/ChangePasswordDto/d' src/users/users.controller.ts
sed -i '/UpdatePreferencesDto/d' src/users/users.controller.ts
