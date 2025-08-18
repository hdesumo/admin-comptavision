#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

TYPES_TARGET="@/types/licence"
PATTERN_1="@/app/admin/licenses/page"
PATTERN_2="./app/admin/licenses/page"
PATTERN_3="../../app/admin/licenses/page"
PATTERN_4="../../../app/admin/licenses/page"

cd "$ROOT_DIR"

if [ ! -f "src/types/licence.ts" ]; then
  echo "❌ Fichier src/types/licence.ts introuvable. Crée-le d'abord puis relance ce script."
  exit 1
fi

echo "🔎 Recherche d'import depuis la page admin/licenses/page…"
MATCHED_FILES="$(grep -RIl --exclude-dir=node_modules --include='*.{ts,tsx}' \
  -e "from ['\"]$PATTERN_1['\"]" \
  -e "from ['\"]$PATTERN_2['\"]" \
  -e "from ['\"]$PATTERN_3['\"]" \
  -e "from ['\"]$PATTERN_4['\"]" \
  src || true)"

if [ -z "$MATCHED_FILES" ]; then
  echo "✅ Aucun import problématique trouvé."
  exit 0
fi

echo "🛠 Remplacement des sources d'import par $TYPES_TARGET"
# Détecter macOS vs Linux pour sed -i
if sed --version >/dev/null 2>&1; then
  SED_INPLACE=(-i)
else
  SED_INPLACE=(-i '')
fi

for f in $MATCHED_FILES; do
  echo "  -> $f"
  # Remplace la source d'import, qu'il s'agisse d'import type, named ou namespace.
  sed "${SED_INPLACE[@]}" \
    -e "s#from ['\"]$PATTERN_1['\"];#from \"$TYPES_TARGET\";#g" \
    -e "s#from ['\"]$PATTERN_2['\"];#from \"$TYPES_TARGET\";#g" \
    -e "s#from ['\"]$PATTERN_3['\"];#from \"$TYPES_TARGET\";#g" \
    -e "s#from ['\"]$PATTERN_4['\"];#from \"$TYPES_TARGET\";#g" \
    "$f"
done

echo "🧹 Nettoyage d'imports par défaut potentiellement invalides…"
# Supprime un import par défaut depuis la page (qui ne devrait pas exister)
for f in $MATCHED_FILES; do
  # Exemple: import Foo from "@/app/admin/licenses/page"
  sed "${SED_INPLACE[@]}" \
    -e "s#import \([A-Za-z0-9_]\+\) from [\"']$TYPES_TARGET[\"'];#// NOTE: import par défaut supprimé (page.tsx ne doit pas être importée)\n//# import \1 from \"$TYPES_TARGET\";#g" \
    "$f"
done

echo "✅ Remplacements terminés."
echo "💡 Pense à vérifier/ajuster les noms importés (Licence, LicencesListResponse, CreateLicenceBody) si nécessaire."

