source $1

gh secret set NEO4J_URI --body "$NEO4J_URI"
gh secret set NEO4J_USERNAME --body "$NEO4J_USERNAME"
gh secret set NEO4J_PASSWORD --body "$NEO4J_PASSWORD"

gh secret set AZURE_TENANT_ID --body "$AZURE_TENANT_ID"
gh secret set AZURE_CLIENT_ID --body "$AZURE_CLIENT_ID"
gh secret set AZURE_CLIENT_SECRET --body "$AZURE_CLIENT_SECRET"
gh secret set AZURE_KEY_ID --body "$AZURE_KEY_ID"

gh secret set TOKEN_AUDIENCE --body "$TOKEN_AUDIENCE"
gh secret set TOKEN_ENDPOINT --body "$TOKEN_ENDPOINT"
gh secret set API_BASE_URL --body "$API_BASE_URL"
gh secret set CLIENT_ID --body "$CLIENT_ID"
gh secret set CLIENT_SECRET --body "$CLIENT_SECRET"