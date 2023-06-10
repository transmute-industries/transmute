source $1

gh secret set NEO4J_URI --body "$NEO4J_URI"
gh secret set NEO4J_USERNAME --body "$NEO4J_USERNAME"
gh secret set NEO4J_PASSWORD --body "$NEO4J_PASSWORD"
