cd /home/forge/n8n.marquedigitale.fr || return
git pull
cd ../tmp/n8n-nodes-sendinblue || return
git pull
yes | cp -rf dist/nodes/*  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/nodes
yes | cp -rf dist/credentials/*  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/credentials/
cd /home/forge/n8n.marquedigitale.fr/packages/nodes-base/ || return
if grep -q "Sendinblue" package.json; test $? -eq 1; then
  sed 's/\"credentials\": [/\"credentials\": [\n      \"dist/credentials/SendinblueApi.credentials.js\",/' package.json
  sed 's/\"nodes\": [\n      \"dist/nodes/Sendinblue/Sendinblue.node.js\",/'package.json
  sed 's/\"dependencies\": {\n    \"sib-api-v3-sdk": "^8.2.1\"/' package.json
  npm i
fi
cd /home/forge/n8n.marquedigitale.fr || return
lerna bootstrap --hoist
npm run build
sudo kill -9 $(sudo lsof -t -i:5678) >& /dev/null
(npm run start&)

