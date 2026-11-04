# How to update the Email Builder

For anyone making changes, using AI or not. The short version: **make changes on a branch, open a pull request, and Ashley approves it.** Nothing goes live until it is merged into `main`.

## One-time setup (Ashley)
1. Add Holly: on GitHub, open the repo, then **Settings > Collaborators > Add people**. Give her **Write** access. She accepts the email invite.
2. Protect the live version: **Settings > Branches > Add branch protection rule**. Branch name `main`. Turn on **Require a pull request before merging**. Now nothing reaches the live page without approval.
3. Keep the repo **Public** (Settings > General). Because it is public, never add student PDFs, names or screenshots anywhere in it, including issues and comments.

## One-time setup (Holly)
1. Accept the invite.
2. Open Claude (your own account) and connect GitHub when it asks. Claude Code on the web (claude.ai/code) works well because it can read the repo and open pull requests for you.
3. Start each session by telling Claude: **"Read CLAUDE.md first."** It holds the rules and the history, so Claude knows what has already been decided.

## Making a change
1. **Start from the latest version.** Pick this repo in Claude and ask for a new branch. Never ask Claude to push straight to `main`.
2. **Describe the change in plain words.** For a bug, say what you did, what you expected, and what happened. Names are fine in your own chat with Claude, but keep them out of the repo.
3. **Ask Claude to test.** Say: "Run `node tests/smoke.mjs` and bump the version number." Every line should say PASS.
4. **Try it yourself.** If the change touches how reports are read or how emails sound, run a real report through the page before opening the pull request. Download `index.html` from your branch, open it in your browser, and use it like staff would. Keep real PDFs on your computer only.
5. **Open a pull request.** Ask Claude to open one and write what changed and why in two or three sentences. Mention which reports you tested.
6. **Ashley reviews.** She opens the pull request, checks **Files changed**, tries the page the same way, and presses **Merge**.

## After the merge
1. Open the **Actions** tab and wait for the green check on "pages build and deployment". Do not merge another change until it is done. A grey "cancelled" mark means a newer build replaced it, which is fine.
2. Refresh the live page and check the version number next to **Report a problem**. It should match the new version.
3. If you do not see the change, hold Shift while refreshing, or open the page in a private window.

## If something breaks
Open the merged pull request and press **Revert**. GitHub makes a new pull request that undoes it. Merge that, wait for the green check, and the live page goes back to how it was. Then work on the fix on a new branch.

## Rules
- **No student data in the repo.** No PDFs, names, or screenshots of real reports. The `tests/pdfs/` folder is for your computer only and is git-ignored.
- Bug reports that arrive by email contain real student information. Share them with your own Claude chat if you need to. Do not paste them into GitHub.
- Do not edit `index.html` by pasting into GitHub's web editor. It has damaged the file before. Use Claude, git, or upload the whole file.
- One change per pull request. Small is easier to approve and easier to undo.
- Do not change the bug-report address or token near the top of the bug-report code. If one of them needs to change, ask Ashley.
