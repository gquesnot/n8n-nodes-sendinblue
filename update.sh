cd /home/forge/n8n.marquedigitale.fr || return
git pull
cd ../tmp/n8n-nodes-sendinblue || return
git pull
yes | cp -rf dist/nodes/*  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/nodes
yes | cp -rf dist/credentials/*  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/credentials/
cd /home/forge/n8n.marquedigitale.fr/packages/nodes-base/ || return
if grep -q "Sendinblue.credentials.js" package.json; test $? -eq 1; then
  echo 1
  match='    \"credentials\": ['
  insert='      "dist/credentials/SendinblueApi.credentials.js",'
  sed -i "s/$match/$match\n$insert/" package.json
fi
if grep -q "Sendinblue.node.js" package.json; test $? -eq 1; then
  echo 2
  match='    \"nodes\": ['
  insert='      "dist/nodes/Sendinblue/Sendinblue.node.js",'
  sed -i "s/$match/$match\n$insert/" package.json

fi
if grep -q "sib-api-v3-sdk" package.json; test $? -eq 1; then
  echo 3
  match='  \"dependencies\": {'
  insert='    "sib-api-v3-sdk": "\^8.2.1",'
  sed -i "s/$match/$match\n$insert/" package.json
  npm i
fi


cd /home/forge/n8n.marquedigitale.fr || return
lerna bootstrap --hoist
npm run build
sudo kill -9 $(sudo lsof -t -i:5678) >& /dev/null
(npm run start&)

