
yarn build:backend
yarn cdk synth

$results = sam local invoke createNoteHandler -e packages/backend/events/createNoteHandler.test-001.json -t packages/infra/cdk.out/aws-sdk-js-notes-app.template.json -n env-vars.json
aws dynamodb get-item --table-name "aws-sdk-js-notes-app-notesAF81B09D-3CA95X2A2Z3E" --key '{""noteId"": {""S"": ""2fbca06fd8ed66bdd4a1388e572a11d98075e9ed""}}' --endpoint-url http://localhost:8000 > output/getitem.json

$table = "aws-sdk-js-notes-app-notesAF81B09D-3CA95X2A2Z3E"
$key = '{""noteId"": {""S"": ""'+ $noteId + '""}}'
$noteId = ((sam local invoke createNoteHandler -e packages/backend/events/createNoteHandler.test-001.json -t packages/infra/cdk.out/aws-sdk-js-notes-app.template.json -n env-vars.json | convertfrom-json).body | convertfrom-json).noteId.S
aws dynamodb get-item --table-name $table --key $('{""noteId"": {""S"": ""'+ $noteId + '""}}') --endpoint-url http://localhost:8000 > output/getitem.json
