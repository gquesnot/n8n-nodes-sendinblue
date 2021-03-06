yes | cp -rf dist/nodes/*  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/nodes
yes | cp -rf dist/credentials/*  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/credentials/
cd /home/forge/n8n.marquedigitale.fr/packages/nodes-base/ || return
if grep -q "SendinblueApi.credentials.js" package.json; test $? -eq 1; then
  match='    \"credentials\": \['
  insert='      \"dist/credentials/SendinblueApi.credentials.js\",'
  sed -i "s|$match|$match\n$insert|" package.json
fi
if grep -q "Sendinblue.node.js" package.json; test $? -eq 1; then
  match='    \"nodes\": \['
  insert='      \"dist/nodes/Sendinblue/Sendinblue.node.js\",'
  sed -i "s|$match|$match\n$insert|" package.json
fi
if grep -q "sib-api-v3-sdk" package.json; test $? -eq 1; then
  match='  \"dependencies\": {'
  insert='    "sib-api-v3-sdk": "\^8.2.1",'
  sed -i "s/$match/$match\n$insert/" package.json
  npm i
fi
cd /home/forge/n8n.marquedigitale.fr || return
killall -9 node
lerna bootstrap --hoist
npm run build
(npm run start&)

