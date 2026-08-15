# Ownership and migration test cases

The plugin root is initially configured for `ownership-by-id`.

The registry fixtures must be present in `plugins-test/manifests.json` before running these submissions.

## Select ownership-by-ID

```powershell
Copy-Item .\test-cases\ownership-by-id\package.json .\package.json -Force
Copy-Item .\test-cases\ownership-by-id\package-lock.json .\package-lock.json -Force
Copy-Item .\test-cases\ownership-by-id\manifest.json .\src\manifest.json -Force
```

Expected result: the scan finds `com.test4.ownershipById` by manifest ID, detects that its registered repository is `Joplin-tooling-test`, rejects the submission from `joplin-test-plugin-`, and closes the issue.

## Select legacy NPM migration

```powershell
Copy-Item .\test-cases\legacy-npm-migration\package.json .\package.json -Force
Copy-Item .\test-cases\legacy-npm-migration\package-lock.json .\package-lock.json -Force
Copy-Item .\test-cases\legacy-npm-migration\manifest.json .\src\manifest.json -Force
```

Expected result: the scan finds `com.test4.legacyNpmMigration`, sees `_npm_package_name` without a registered `repository_url`, and rejects the submission with the maintainer-verification message.

## Select ownership-by-name

```powershell
Copy-Item .\test-cases\ownership-by-name\package.json .\package.json -Force
Copy-Item .\test-cases\ownership-by-name\package-lock.json .\package-lock.json -Force
Copy-Item .\test-cases\ownership-by-name\manifest.json .\src\manifest.json -Force
```

Expected result: the scan treats `com.test4.submittedNameLookup` as a new plugin. After the clean scan is approved, publish lookup finds the existing registry entry by its `name`, detects the different registered repository, and rejects publication.

For each selected case, commit and push the plugin repository before running `npm run submit`, because submission requires a clean working tree and a commit that matches the remote branch.
