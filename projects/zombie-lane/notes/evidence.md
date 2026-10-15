# Evidence index

REA evidence behind the notes in this folder. The evidence records themselves are kept locally by whoever ran the
analysis and are **not committed**, because they contain decompiled code. Re-run the same operation on an APK
with the same SHA-256 to reproduce them.

- **Target:** `zombie-lane-1-0-33-multi-android.apk`, SHA-256
  `39b93f6f5409a3e9f84a47efdd23e3067333117bc5edad6c27887091ebda0ad6`
- **Tools:** REA `rea-agents@6.4.0` (CLI and MCP), JADX provider `jadx-headless-mcp` 0.7.1 (JAR SHA-256
  `6e5eacf5…ff75`, source revision `5844800a`), Temurin JDK 26
- **Date:** 2026-10-14 (first pass), 2026-10-15 (second to fourth passes)

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-package` | inspect_android_package | manifest, permissions, counts | `ev_b4cf5094241465dc51d1921cfde05b721048c4d3259cd2fab1851bff2408468c` |
| `E-classes` | search_android_classes | all 2,137 classes (complete) | `ev_728296067849b5d07e07619499eb94f77f7e0559ed3b774fdc4f57d41e722d89` |
| `E-inventory` | inspect_artifact (MCP) | archive member graph | `ev_20883279a166934e09109385e297d9ea8c96ada593ba4a6a6a9ed3c5c2ad77ee` |
| `E-extract` | extract_artifact (MCP) | 1,471 regular files, containment verified | `ev_df0a18724be18ec03c7a6c99a647dd77c2aa9c1df198e29ad6fc8b2dcdbc7451` |
| `E-Toolkit` | inspect_android_class | `com.dchoc.toolkit.Toolkit` | `ev_cc10de54829cb8efd434478bd6239c8b79442a47eabaf6bd7ab746309e822014` |
| `E-loadFile` | inspect_android_method | `Toolkit.loadFile` | `ev_7f1f578946c1d721043b57c48c5b05db05eb1bcfbf6119fe6c9b3b5dd94c3c63` |
| `E-fromLoaded` | inspect_android_method | `Toolkit.getResourceBytesFromLoadedFile` | `ev_748ac43ded632c3b77eca038cf991d39b16b4a1ad9abe46a0fa8992d5312c117` |
| `E-getResBytes` | inspect_android_method | `Toolkit.getResourceBytes(int)` (overload 0) | `ev_f6433890ed09fa6b078478c44713c7cf3b373f10ce454cb95b1054c185266ed8` |
| `E-getText` | inspect_android_method | `Toolkit.getText` | `ev_ca2f8361bb1f0437cc61987c8affe6e52037907e496a14c934a40af0882265a4` |
| `E-DChocMIDlet` | inspect_android_class | `com.dchoc.toolkit.DChocMIDlet` | `ev_cf06d9f547baa9ba9062a2dbd6750a3ed91fcf2f13c765525077054ab8294a18` |
| `E-run` | inspect_android_method | `DChocMIDlet.run` | `ev_1963b7a898a6b08fd545d9d4f15fa7eaf3872a4b4bdd05500685b1fa0081e445` |
| `E-updateTimer` | inspect_android_method | `DChocMIDlet.updateTimer` | `ev_312c655d927c07e9068bdcc7a66bb8e16cdc3e442cc59cac17e4d9a2f78ce082` |
| `E-realDelta` | inspect_android_method | `DChocMIDlet.getRealDeltaTime` | `ev_4926f0d43fd7b854a37d6281aebd6062c8a82e3482adcef1e9d5c3d5cf65409b` |
| `E-IController` | inspect_android_class | `com.dchoc.toolkit.IController` | `ev_fcc001b4d4e93b75dc61c6a87da05a282efab074b3729a1e720d470c1a61a496` |
| `E-DCiDead` | inspect_android_class | `com.dchoc.DCiDead` | `ev_6e509b63161fd0744cd604c2ac9d127572c4bfe29867545ee25c0c881456c483` |
| `E-DCRenderer` | inspect_android_class | `javax.microedition.lcdui.DCRenderer` | `ev_8604b5a9c4b85258a738b6e1df75206271a17b6885a7354b5a147fd3e1f3d554` |
| `E-onDrawFrame` | inspect_android_method | `DCRenderer.onDrawFrame` | `ev_2957039237d8e21ba9ad88c69d7da07c5549f0a0bc9aed71d8295789f4f5cbcc` |
| `E-GameEngine` | inspect_android_class | `com.dchoc.idead.GameEngine` | `ev_47d888ff93f924ab11cee9bcb76e454ad358eb95f58a7161fa14c6944b1c185e` |
| `E-ge-logic` | inspect_android_method | `GameEngine.logicUpdate` | `ev_bd4f0bb46a4108e645390561682b633b319d78d813f6e64aac9cf2cc80fa2772` |
| `E-refs-ge` | trace_android_references | callers of `GameEngine.logicUpdate` (1, complete) | `ev_2f560d44fda504177c9f39f1b1ae0ed128b1460dcac53e7510374242695478fc` |
| `E-refs-game` | trace_android_references | callers of `Game.logicUpdate` (0 static) | `ev_d809386798da8c303fefa88ca080c58a3dd12ad027b4fb3a5e16efef5a6e094b` |
| `E-Time` | inspect_android_class | `com.dchoc.idead.Time` | `ev_3ba0cc354b6cc96284be8b61e4c810698c71eb988fef8bc52e736162da05ee6e` |
| `E-Timing` | inspect_android_class | `com.dchoc.idead.Timing` | `ev_521bf837e9e19073b10a7ab77edba73f21dd9ffcffae2eef4c5988aa44feeb37` |
| `E-Tuner` | inspect_android_class | `com.dchoc.idead.tuner.Tuner` | `ev_72ab7969db17e1afa97edc11f580f6217a35f366a441f88f30b29d2e05257383` |
| `E-ServletsMgr` | inspect_android_class | `idead.servlets.ServletsManager` | `ev_80b85b6f6ab91ce00a0a72d8bcb7e8969784d2dcb480a034b7db9e4d0ba8715d` |
| `E-ServletReq` | inspect_android_class | `idead.servlets.ServletRequest` | `ev_af316f136f171e362ade1b41b7b2a28993642e328457b95ad1eced1e92c40605` |
| `E-Servlets` | inspect_android_class | `idead.servlets.Servlets` | `ev_72270808bd160b4363fa0bf9253f59f1ad6af17f4c48ae574184fcf1534307c2` |

### Second pass (2026-10-15)

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-ge-load` | inspect_android_method | `GameEngine.load` (startup steps) | `ev_fcf00b7f15889c8f97ee852ce32cb0afdd3cdde948af1b1e796daeba0b4d8c91` |
| `E-sr-execute` | inspect_android_method | `ServletRequest.execute` (async send, signature) | `ev_942998be0f050761faae5fd9274e9af8cac11cae9e83ddf04ba75ea92c40ea6b` |
| `E-cns-response` | inspect_android_method | `CreateNewSession.processResponse` | `ev_f48f4b843bbd831962749d3db65f48267a6bee362532c1197ce18e97672a2da7` |
| `E-cns-offline` | inspect_android_method | `CreateNewSession.showOfflineMode` | `ev_b8b433b3d69a1b6041f435b6a9e3e021167994242958f4bbb5693adee5721490` |
| `E-cns-endElement` | inspect_android_method | `CreateNewSession.endElement` (session ID, user ID) | `ev_bb7ae9f874ce98b9e98906714e6870863a87ffebe8a435e4e33826a3300b942b` |
| `E-refs-offline` | trace_android_references | callers of `showOfflineMode` (1, complete) | `ev_8c50067d0561721ecb2c48b41aa4a52dfdcc65b4f21eb91e72efc599238e6928` |
| `E-hud-callback` | inspect_android_method | `HUDFoldable.callback` | `ev_3622db25c8f11f1f9d01222c86ea65a2f8a61848eec47c25b1799c75ed50b2a6` |
| `E-gt-endElement` | inspect_android_method | `GetTimers.endElement` (overload 1) | `ev_5e596962f2e6a3eebf3688a3ada84959470e6339103ba0424b89cef524dfe39b` |
| `E-refs-timers` | trace_android_references | callers of `GameEngine.setGetTimers` (3, complete) | `ev_0d42b629aaed4df134094099f1a036dfa0182b07d78395f44549a2db27ff6f82` |
| `E-timestamp` | inspect_android_method | `Timing.getTimestamp` | `ev_11744324863253484951fbbd8e03b1d71172e5e06e40b6d3652a37ab8d7f2f37` |
| `E-ResourceIDs` | inspect_android_class | `toolkit.ResourceIDs` (21,015 field names) | `ev_286dd94c81b5546373b9a9dd555390e133eede840f5e26d84f6169bfc02a74d2` |
| `E-Tuner-init` | inspect_android_method | `Tuner.init` (GAMESETUP field order) | `ev_7456282320a179de54dc005f74872a0abd05a9bebbb09e193dbf4dee88508a99` |
| `E-readIntArray` | inspect_android_method | `ToolkitHelpers.readIntArray` | `ev_ae51eaf398e4a46bfffd0da323e6736f8b3a5fc93ba10751ffc4d2ac32ddaaa6` |
| `E-textureInit` | inspect_android_method | `DavinciUtilities.textureInit` | `ev_ea4b9a6ffefed7def7162ee195d98e5aea4d706ab7f05c49d1123d5ce7e46d15` |
| `E-readBundle` | inspect_android_method | `DavinciUtilities.readTextureBundleData` | `ev_0e1e2d0ef9f1232c0f27335eed43dab607adb0e277c5d24b5b66ca49192d07e8` |
| `E-readTexture` | inspect_android_method | `DavinciUtilities.readTextureData` | `ev_0b3287443a0d576f530f689acc121cfe06a231131c27e4d7cff37f1d3eead56a` |
| `E-loadTextureImage` | inspect_android_method | `DavinciUtilities.loadTextureImage` (image reference bits) | `ev_b284bc1af77a02f414ca2df13c4d3cce0280b201c693c187d8aef42dff4c79e2` |
| `E-versionText` | inspect_android_method | `DavinciUtilities.getVersionText` | `ev_1cf623a067f8825ced1bee2d3f4b8c4c1dd3aaac47e046841dd01aaa625013a8` |
| `E-createAnimation` | inspect_android_method | `Animation.createAnimation` (link entries, variant choice) | `ev_9681f112d97d56465fb0eaa3a0d732651fdc940de58d0941e4e99327d4d8bdd9` |
| `E-initAnimation` | inspect_android_method | `Animation.initAnimation` (header, durations, timeline) | `ev_1964238e262aeef55a2da94007aa83bba0e8e7ad7425a5b0e6a041ab5a6fa48b` |
| `E-isFrameRef` | inspect_android_method | `Animation.isFrameReference` | `ev_5346cfc205eff4401829d20367aef70ae7d0751b14503449be63cf48b2b5c257` |
| `E-loadFrame` | inspect_android_method | `AnimationFrame.loadFrameData` (renderables) | `ev_a3410f752c8da2eac8e50c2bfe58262936fb60fb41a1f7634f5d214770655a82` |
| `E-timelineLoad` | inspect_android_method | `TimelineChannel.load` | `ev_1311bdd6f7d7da7f7c59eb9c78e82055dfeafe40e29f7ba50533ab2ec38eddae` |
| `E-timelineValue` | inspect_android_method | `Animation.getTimelineValue` | `ev_e82acc0a6facc28cfa445fded8172bfa6fb05f70b62b7fbcb81bade211ef2974` |
| `E-serverAssets` | inspect_android_method | `ServerAssetLoader.init` | `ev_9ccd2163f4b6d95df79073664461d88d37450726a63a8143c1b8c08266066b85` |
| `E-bundleLoadFile` | inspect_android_method | `ServerBundle.loadFile` | `ev_799bd6b7141bd638e1eacd7de71e9b114fc14189669af696458583b3af2a7414` |

### Third pass: drawing (2026-10-15)

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-spriteDraw` | inspect_android_method | `SpriteObject.draw` (overload 1) | `ev_3ba1b4d1c98d2cb25e154d09b26d0fed4c95b74ce4705816a0a3a6e783739b01` |
| `E-spriteUpdate` | inspect_android_method | `SpriteObject.logicUpdate` | `ev_44a59cfef2526b8461f5fa3a156f433ad8aed2b84e40c3584169f1b7bc2d9d68` |
| `E-timelineX` | inspect_android_method | `SpriteObject.getTimelineX` | `ev_66c035bc457bc23383de8324880dde5c715132695e9fab96d12bf6c66b675d57` |
| `E-drawAligned` | inspect_android_method | `SpriteObject.drawAligned` | `ev_17cb87bc023d870ac4bbd07effdba7fba56f98f76e31c866d8f957c541aa9395` |
| `E-animDoDraw` | inspect_android_method | `Animation.doDraw` | `ev_e843eebca1a9ef3bc4572c10ddff1045a3ff6365744209e1edd60ac39f7927b8` |
| `E-frameDoDraw` | inspect_android_method | `AnimationFrame.doDraw` | `ev_88d1dcdb6a2a9470a5e1ea8efb78a0701d37df7c035f298e646c232083fe6c51` |
| `E-timelineValue2` | inspect_android_method | `TimelineChannel.getValue` | `ev_8b9a60a138a2115b928995c0b89338a60487ebeeac601073ddcef242e71b0c90` |
| `E-neutral` | inspect_android_method | `TimelineChannel.getNeutralValue` | `ev_3fd89fb9c3e67e81eebde03bb8e63319337cd62f4b50d8f01cdaee9479304640` |
| `E-ease` | inspect_android_method | `TimelineChannel.easeInOutQuad` (and `easeInQuad`, `easeOutQuad`) | `ev_b4ba3f1f347209b3044881aad4a1d5f3cc7fa23cbf36c546cd658246ae43fdb5` |
| `E-lerp` | inspect_android_method | `DavinciUtilities.interpolateValue` | `ev_2b48a8f9178630e115a8fb355a55d4a46b8283ae1c6818eca3409494999a70ee` |
| `E-drawTexture` | inspect_android_method | `OGL.drawTexture` (overload 1) | `ev_ee692db24483b058c16c8a776cf07d84e4e326ab282e521cb1de49a57abaf117` |
| `E-angle` | inspect_android_method | `OGLParameters.setAngleInt` | `ev_112712e97bed4f53042720ad067048c2743f817fa761cccc3498cfa7ea7c3e38` |
| `E-scale` | inspect_android_method | `OGLParameters.setScaleInt` | `ev_fec421f63a6e033c93b94805813ec640dde47ad2bd29faa2495daf2dcf00a7f9` |
| `E-blending` | inspect_android_method | `OGL.setBlending` | `ev_997c0ada717101af5200005d1013828a8afbacb0b740383cbdb37db029c4be32` |
| `E-colorRGB` | inspect_android_method | `OGL.setColorRGB` | `ev_65036ed0ed86b27e5aae39fc186444c3c3afd2038aa7141df40ff7f211c74ce0` |

### Fourth pass: scenes and saves (2026-10-15)

Constant values (record names, the `dchoc.db` schema, `Item.TYPE_*`, `IsometricObject.TYPE_*`,
`ObjectLoader.VERSION_NUMBER` = 103) were read with `tools/dex-consts.ts` **[sh]**.

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-SceneLoader` | inspect_android_class | `isometric.SceneLoader` | `ev_32577b5a7bcd38a79ab26346232c863b327c23cb174f3cca61fd122513d7e3db` |
| `E-sl-load` | inspect_android_method | `SceneLoader.load` | `ev_7a6e14ff9a74e23e787025d82f0f8abf5f1c9eaae2b37f7d1bac3af34f7850cd` |
| `E-sl-readSizes` | inspect_android_method | `SceneLoader.readSizes` | `ev_6d718045410d706c415d03307aa6275fe1cb9392ca1e356fa4be68dac835d4ea` |
| `E-sl-save` | inspect_android_method | `SceneLoader.saveCurrent` | `ev_dbf71e9c489e6e01771d60137926010053bbb690505d9fadcfe333a6302939dd` |
| `E-ObjectLoader` | inspect_android_class | `isometric.ObjectLoader` | `ev_f5e8288abee8d05c2839708b3922a977fa69d7db9e4942922d86ba7cda4af94d` |
| `E-ol-load` | inspect_android_method | `ObjectLoader.load` | `ev_e23e51952e76cdc93b54545b27ac6c0c44c3b73fcab1b6369bc6d786b8f63f10` |
| `E-ol-loadU` | inspect_android_method | `ObjectLoader.loadUncompressed` | `ev_8f2665ec032aa4cc99b835be9a3ac1b33a684fd58fff5e3cc680913b59feb791` |
| `E-ol-save` | inspect_android_method | `ObjectLoader.save` | `ev_157c293279a3ad36882c4352b4e37bfb2f2e95cd3c138a33e2bf030963caf295` |
| `E-olo-readCrash` | inspect_android_method | `ObjectLoaderOld.readCrash` | `ev_e4de07629261df32d3c0ddfcc55d2c55bbc58723d2b07059eef6a338e1cec343` |
| `E-olo-writeCrash` | inspect_android_method | `ObjectLoaderOld.writeCrash` | `ev_e109c440147e179643debf4bf1b61c51eeeefab3823fde220021f071b920631d` |
| `E-TH` | inspect_android_class | `toolkit.ToolkitHelpers` (one readLong, one writeLong) | `ev_884950c8654be86a9d4768eebfe19ea4e8c70bafa24c2f54d516c7afa5fae113` |
| `E-th-readLong` | inspect_android_method | `ToolkitHelpers.readLong` | `ev_7241d273bd7755f6d5471323036533bbb14e8ba951473f6509852d756d0f7788` |
| `E-th-writeLong` | inspect_android_method | `ToolkitHelpers.writeLong` | `ev_cc4fce157c43fe125aa274a0a9e860d3ac72ac8a0ac0e90cf9af4e787c9e495c` |
| `E-th-readRIDs` | inspect_android_method | `ToolkitHelpers.readResourceIDs` | `ev_bd2306c8d733f8f99ae8b8d69f73a085d6d8248e60c309d0abb5a2325d4e066b` |
| `E-th-readVL` | inspect_android_method | `ToolkitHelpers.readValueList` | `ev_2f124edb1e1c53fc57720ce7a6e3154cf37b3ed244bea07ee7a4acb39f90c436` |
| `E-DChocByteArray` | inspect_android_class | `toolkit.DChocByteArray` | `ev_2316b4cb907d4d7f146587154f20d61b513147f760019e82eccde0cbe611beb4` |
| `E-dba-readInt` | inspect_android_method | `DChocByteArray.readInt` | `ev_80ed1f9db9de6271d44a068d556954fba9135a37e4a759314fdf8659109bde05` |
| `E-tk-writeRec` | inspect_android_method | `Toolkit.writeRecordByteArray` | `ev_8b55a667368aadaf98e70d2b728965c82c75f960b61a8f02aa06b84f830ef7f7` |
| `E-tk-readRec` | inspect_android_method | `Toolkit.readRecordByteArray` | `ev_68637a25e0ba3c3622195f466b97a621dff629d9b8f2ba391a6152f9aaa2a437` |
| `E-tk-writeDB` | inspect_android_method | `Toolkit.writeRecordByteArrayToDB` | `ev_b927ea5b21d834f977915e7b49478c12ac1a57ca7bc2f17a74019b46fbfd0327` |
| `E-tk-readDB` | inspect_android_method | `Toolkit.readRecordByteArrayFromDB` | `ev_f226995feb78d098100c42d594ddb1fedd6d8bb9403ac07ea6cbb60c0cc58dbe` |
| `E-sw-init` | inspect_android_method | `SettingsWrapper.init` | `ev_6dc120736878daa3db057e4a62308361da8e4401dc17d633ef47fef70f92cbd9` |
| `E-sw-parseVersion` | inspect_android_method | `SettingsWrapper.parseVersion` | `ev_7219eb64edd659f1abbe45e710a73dbbaab1b22e12d05911487d5188adc67e96` |
| `E-ge-saveCommon` | inspect_android_method | `GameEngine.saveGameStateCommon` | `ev_c822efc1beb994b801ac835904a2ac4ec3a2aa5ce0dd2c454c4ba139f8ae2976` |
| `E-refs-saveCurrent` | trace_android_references | callers of `SceneLoader.saveCurrent` (complete) | `ev_1993379a663fd6a65ecb6cbda52b901803926893bf7659082cedd85243f610dc` |
| `E-refs-sl-load` | trace_android_references | callers of `SceneLoader.load` (complete) | `ev_c309fad1e266fff9ebf22c282138f3d01dea7fe99a2d73969133d992633f08d8` |
| `E-pl-loadScene` | inspect_android_method | `Place.loadScene` | `ev_a23210842482d7071bbe326749ca71e418d09e1e18824893477e40e07a37d400` |
| `E-rp-init` | inspect_android_method | `RobsPlace.<init>` | `ev_4e5510db1e9f131e5bb5415ea3eaa27cbf7b3f06f2ccff9a30696f0465a2bb16` |
| `E-fx-missing` | inspect_android_method | `Fixes.fixMissingCharacters` | `ev_a645a019e4bb8c846a51bf695c9b115c3a9043039e2ae34bb8285fdda44f7978` |
| `E-im-loadData` | inspect_android_method | `ItemManager.loadData` | `ev_8edccb5bcf8ec90bc7b7bbbc35271a88a19af5a42fae3cfb49d552161d1ee3cf` |
| `E-Item` | inspect_android_class | `items.Item` | `ev_6c018d97587f9de4d318f6efdb99b23130450fda0d406ac275f7303f03b4769e` |
| `E-di-load` | inspect_android_method | `DestructibleItem.loadData` | `ev_867b18145033c1e73e0cfe9158194f04141f7acc96fd909e1e3656028599035e` |
| `E-zi-load` | inspect_android_method | `ZombieItem.loadData` | `ev_5f8e04f8ed6244608351054c87d89cda2cfc5acacd9ba07be4311778a263b922` |
| `E-fi-load` | inspect_android_method | `FenceItem.loadData` | `ev_88e8201f4ff2c1a9a7e31f53bcc32e0a68b3e9e0ca49cf8fc3a7e73011de50d2` |
| `E-ConstructionItem-load` | inspect_android_method | `ConstructionItem.loadData` | `ev_373261eeb68e5357dfff25028ddc78e58dca5227106b484e2898ca3d648c0124` |
| `E-DecorationItem-load` | inspect_android_method | `DecorationItem.loadData` | `ev_16fcb3cd9bc418b024853402744e9c6d3a096df088a88a47004d432f51d581b3` |
| `E-FarmingItem-load` | inspect_android_method | `FarmingItem.loadData` | `ev_070c94ba31200d0f12792c9c87ec352c523f81e35765c98588156155fd8d8e80` |
| `E-PlayerItem-load` | inspect_android_method | `PlayerItem.loadData` | `ev_7747070bcd4f65e7b7684b6d10e54f9f377f1e92d6db2dc836900b96e24c2bf3` |
| `E-it-getX` | inspect_android_method | `IsometricTile.getX` (and `getY`) | `ev_62ad989cd5ae428f3c059d1e0fbffcf14a4ef542bc942a60bc509b457dbea3c1` |
| `E-it-getTileSize` | inspect_android_method | `IsometricTile.getTileSize` | `ev_0e0055c8dee2d6c9049d819a8dd6f064463423db288a2b8d4fb0f8661b719ee6` |
| `E-is-init` | inspect_android_method | `IsometricScene.init` | `ev_ccdea857142d8362717cbbc33822a94c39b9028263521a91e31bcab640728e1d` |
| `E-tr-init` | inspect_android_method | `Transform.init` | `ev_10d06b8ac7351fb346530b42abe09fef9b32f31a101959e8b04be4f7254861ef` |
| `E-tm-transform` | inspect_android_method | `TransformMatrix.transform` | `ev_4cc3d05716daf142002ad9141286b11fdc054f3f4b838323627964ec218b7e3d` |
| `E-tm-scale` | inspect_android_method | `TransformMatrix.scale` | `ev_f981fb76297ca451a6b9c198252eaf60a8bdde444e8803868f9bd5027c9e435d` |
| `E-io-setPosition` | inspect_android_method | `IsometricObject.setPosition` | `ev_44d28ded79649aac50a47dc7b9d18b123dfe9ccb835dd21385e8513e0074afd8` |
| `E-io-init` | inspect_android_method | `IsometricObject.init` | `ev_db83e202c6bb300ea9e710fc03474e70095c7a7dddbaea23221faa1c997cc044` |
| `E-is-doDraw` | inspect_android_method | `IsometricScene.doDraw` | `ev_65d8ce18361a0897e74de9e2a6131a5c81dd9a3f3b5a5cd576e5ddd04846165f` |
| `E-is-sort` | inspect_android_method | `IsometricScene.sortByPosition` | `ev_8256c7e2c94cc1150dadf5bcf1cf65be6f257a9c31a1ea4fc1fb2a9f42789920` |
| `E-is-front` | inspect_android_method | `IsometricScene.isObjectFrontOf` | `ev_f715ff268f5f7fb3397ad0448d27bc5ea6d8a057736a7f6498e2f7f972497802` |
| `E-is-bg` | inspect_android_method | `IsometricScene.drawBackground` | `ev_ba86d910752ad13424014ee08eb9bec4daba4bfe9b0ba3c46d00dd02f4aa357d` |
| `E-if-init` | inspect_android_method | `IsometricFloor.<init>` | `ev_7111ca9e4c73c6b7bc2b69cccb030e5456c511bc14b89e9ebb4e45c3778897df` |
| `E-if-doDraw` | inspect_android_method | `IsometricFloor.doDraw` | `ev_8c3b04df7410269bf8bab7e2a137519359160a9a7a30971354e8568da26f4ded` |
| `E-an-load` | inspect_android_method | `Animations.loadAnimations` | `ev_08941d41757b0aa2837d07cfb4e5497c70eeb284df68e3dac34bbd0be64d13a4` |
| `E-tr-changeAnim` | trace_android_references | callers of `Animations.changeAnimation` (complete) | `ev_2302f01ac74f74781ffdda7188c61fe9528d5ed8d4239846269388dd5f970587` |
| `E-fo-setEdges` | inspect_android_method | `FenceObject.setEdges` | `ev_31c22eeca30fc48fc52a178b9396b4790c8feeec05c69fcd3bab74b4b53e73bf` |
| `E-fo-updateEdges` | inspect_android_method | `FenceObject.updateEdges` | `ev_38203c235a74bdec827281a5333bdcfa95c76226b7b66a3436efe926e70bf344` |
| `E-fo-upd` | inspect_android_method | `FenceObject.updateAnimations` | `ev_bfc5f5d538518ee7fe75fb79ca96d139f7a8fb0691a44fd58bc85b7eb97d280a` |
| `E-owh-init` | inspect_android_method | `ObjectWithHealth.init` | `ev_e4279f088803b77b48d21f98faba6ace5b0ba9af175b8c9bff178edde294524f` |
| `E-owh-upd` | inspect_android_method | `ObjectWithHealth.updateAnimations` | `ev_b78cad5aa37ed9d2e345e869de5aac402d33a972863b370a5b2eae67563c5c40` |
| `E-co-cs` | inspect_android_method | `ConstructionObject.changeState` | `ev_85eb10d620ea43388b0f51c01f73a354084dcfd9440aec26821d941e966490b8` |
| `E-do-cs` | inspect_android_method | `DecorationObject.changeState` | `ev_716eff015cc730b4bc2a123bdce100f9db0dffbe12697022bc7806ef9e389d5c` |
| `E-zc-cs` | inspect_android_method | `ZombieCharacter.changeState` | `ev_a59e1a7ea1609c7628e8b6206b4437e69014fa2e03362d927381936acd6d4ae2` |
| `E-ogl-fillBezier` | inspect_android_method | `OGL.fillBezier` | `ev_21af5bdbef717d5433e6a2b1d87cbba31b65fc42abca703cf438b2926f0e938a` |
| `E-ogl-fillPolygon` | inspect_android_method | `OGL.fillPolygon` | `ev_34d391df1ab3f70b7cc52680db9f85e380e4b7c45e551967084b0cf9b05e9d10` |

## Static-analysis limits

These apply to everything above:

- The APK was never executed. Decompiled code shows what the code says, not what happened at runtime.
- Calls through interfaces or reflection don't show up as static references. That is why `Game.logicUpdate` has
  no static callers.
- APK signatures were not verified, and the native AllJoyn libraries were not analyzed.
- Constant **values** (resource IDs, enum values) are not part of REA's class output. They were read straight from
  `classes.dex` with `tools/dex-consts.ts`, so they are tagged **[sh]**.
- Format layouts marked **[sh]** were checked by parsing every entry with the scripts in [../tools](../tools/).
