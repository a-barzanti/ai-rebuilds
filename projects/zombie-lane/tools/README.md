# Tools

Small Bun scripts that check the format specs in [../notes](../notes) against your own copy of the game. The
browser-side readers the rebuild uses are in [../lib](../lib). Both are written from the specs and contain no code
from the game. Extract the APK first; it's a ZIP, so
`unzip zombie-lane.apk -d zl` works.

| Script | What it does |
| ------ | ------------ |
| `check-anims.ts` | Parses all 18,670 animation entries in `assets/r1`. Every entry should be consumed exactly. It also reports which ones point at art that isn't in the APK. |
| `check-bundles.ts` | Parses every `assets/bundle_<id>/0` descriptor and compares the PNG counts with the files in the folder. |
| `dex-consts.ts` | Prints the static constant values of one class from `classes.dex`, for example `'Lcom/dchoc/toolkit/ResourceIDs;'` (resource names to IDs). |

```sh
bun projects/zombie-lane/tools/check-anims.ts zl/assets
bun projects/zombie-lane/tools/check-bundles.ts zl/assets
bun projects/zombie-lane/tools/dex-consts.ts zl/classes.dex 'Lcom/dchoc/toolkit/ResourceIDs;' > resource-ids.json
```

Expected results for APK 1.0.33 (SHA-256 `39b93f6f…0ad6`):

- `check-anims`: 18,670 exact, 0 failed. 2,553 HD targets have missing art; the default and VGA targets have none.
- `check-bundles`: 536 of 537 exact. `bundle_1413` has 46 unexplained bytes, and 10 folders ship one PNG more than their
  descriptor lists.

Don't commit the output of `dex-consts.ts` for whole classes. Quote only the IDs a spec needs.
