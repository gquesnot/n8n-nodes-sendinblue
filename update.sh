cd /home/forge/n8n.marquedigitale.fr || return
git pull
cd ../tmp/n8n-nodes-sendinblue || return
git pull
cp -rf dist/nodes/  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/nodes
cp -rf dist/credentials/  /home/forge/n8n.marquedigitale.fr/packages/nodes-base/credentials/
cd n8n.marquedigitale.fr/package/nodes-base/ || return
if grep -q "Sendinblue" package.json; test $? -eq 1; then
  sed 's/"credentials": [/"credentials": [\n"dist/credentials/SendinblueApi.credentials.js",/' n8n.marquedigitale.fr/package/nodes-base/package.json
  sed 's/"nodes": [\n"dist/nodes/Sendinblue/Sendinblue.node.js",/' n8n.marquedigitale.fr/package/nodes-base/package.json
  sed 's/"dependencies": {\n"sib-api-v3-sdk": "^8.2.1"/' n8n.marquedigitale.fr/package/nodes-base/package.json
  npm i
fi
cd /home/forge/n8n.marquedigitale.fr || return
lerna bootstrap --hoist
npm run build
(npm run start&)



