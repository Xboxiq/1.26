#!/usr/bin/env bash
# إنشاء ريبو GitHub مستقل من هذا المجلد
# الاستخدام: ./create-standalone-repo.sh
set -euo pipefail
cd "$(dirname "$0")"

if [ -d .git ]; then
  echo "يوجد git هنا بالفعل. لإنشاء ريبو جديد:"
  echo "  git remote set-url origin https://github.com/YOUR_ORG/tadfuq-khair.git"
  echo "  git push -u origin main"
  exit 0
fi

git init -b main
git add -A
git commit -m "تدفّق الخير — منصة خدمات المشتركين v2"
echo ""
echo "تم. الآن أنشئ ريبو على GitHub ثم:"
echo "  git remote add origin https://github.com/YOUR_ORG/tadfuq-khair.git"
echo "  git push -u origin main"
